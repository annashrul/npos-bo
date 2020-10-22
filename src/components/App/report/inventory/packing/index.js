import React,{Component} from 'react'
import Layout from 'components/App/Layout'
import Paginationq from "helper";
import {FetchPacking, FetchPackingExcel} from "redux/actions/inventory/packing.action";
import connect from "react-redux/es/connect/connect";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import PackingReportExcel from "components/App/modals/report/inventory/packing_report/form_packing_excel";
import Select from 'react-select';
import moment from "moment";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import {rangeDate} from "helper";
import Preloader from "Preloader";
import {statusQ} from "helper";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown } from 'reactstrap';
import { Link } from 'react-router-dom';
class PackingReport extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.HandleChangeSort = this.HandleChangeSort.bind(this);
        this.HandleChangeFilter = this.HandleChangeFilter.bind(this);
        this.HandleChangeStatus = this.HandleChangeStatus.bind(this);
        this.state={
            where_data:"",
            any:"",
            location:"",
            location_data:[],
            startDate:moment(new Date()).format("yyyy-MM-DD"),
            endDate:moment(new Date()).format("yyyy-MM-DD"),
            sort:"",
            sort_data:[],
            filter:"",
            filter_data:[],
            status:"",
            status_data:[],
        }
    }
    componentWillMount(){
        let page=localStorage.page_packing_report;
        this.handleParameter(page!==undefined&&page!==null?page:1);
    }
    componentDidMount(){
        if (localStorage.location_packing_report !== undefined && localStorage.location_packing_report !== '') {
            this.setState({location: localStorage.location_packing_report})
        }
        if (localStorage.any_packing_report !== undefined && localStorage.any_packing_report !== '') {
            this.setState({any: localStorage.any_packing_report})
        }
        if (localStorage.date_from_packing_report !== undefined && localStorage.date_from_packing_report !== null) {
            this.setState({startDate: localStorage.date_from_packing_report})
        }
        if (localStorage.date_to_packing_report !== undefined && localStorage.date_to_packing_report !== null) {
            this.setState({endDate: localStorage.date_to_packing_report})
        }
        if (localStorage.sort_packing_report !== undefined && localStorage.sort_packing_report !== null) {
            this.setState({sort: localStorage.sort_packing_report})
        }
        if (localStorage.filter_packing_report !== undefined && localStorage.filter_packing_report !== null) {
            this.setState({filter: localStorage.filter_packing_report})
        }
        if (localStorage.status_packing_report !== undefined && localStorage.status_packing_report !== null) {
            this.setState({status: localStorage.status_packing_report})
        }
    }
    handlePageChange(pageNumber){
        localStorage.setItem("page_packing_report",pageNumber);
        this.props.dispatch(FetchPacking(pageNumber))
    }
    toggle(e,code,barcode,name){
        e.preventDefault();
        localStorage.setItem("code",code);
        localStorage.setItem("barcode",barcode);
        localStorage.setItem("name",name);
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("detailPacking"));
        // this.props.dispatch(FetchPackingData(code))
    };
    handleEvent = (event, picker) => {
        const awal = moment(picker.startDate._d).format('YYYY-MM-DD');
        const akhir = moment(picker.endDate._d).format('YYYY-MM-DD');
        localStorage.setItem("date_from_packing_report",`${awal}`);
        localStorage.setItem("date_to_packing_report",`${akhir}`);
        this.setState({
            startDate:awal,
            endDate:akhir
        });
    };
    handleSearch(e){
        e.preventDefault();
        localStorage.setItem("any_packing_report",this.state.any);
        this.handleParameter(1);
    }
    handleParameter(pageNumber){
        let dateFrom=localStorage.date_from_packing_report;
        let dateTo=localStorage.date_to_packing_report;
        let lokasi = localStorage.location_packing_report;
        let any = localStorage.any_packing_report;
        let sort=localStorage.sort_packing_report;
        let filter=localStorage.filter_packing_report;
        let status=localStorage.status_packing_report;
        let where='';
        if(dateFrom!==undefined&&dateFrom!==null){
            where+=`&datefrom=${dateFrom}&dateto=${dateTo}`;
        }
        if(lokasi!==undefined&&lokasi!==null&&lokasi!==''){
            where+=`&lokasi=${lokasi}`;
        }
        if(status!==undefined&&status!==null&&status!==''){
            where+=`&status=${status}`;
        }
        if(filter!==undefined&&filter!==null&&filter!==''){
            if(sort!==undefined&&sort!==null&&sort!==''){
                where+=`&sort=${filter}|${sort}`;
            }
        }
        if(any!==undefined&&any!==null&&any!==''){
            where+=`&q=${any}`
        }
        this.setState({
            where_data:where
        })
        this.props.dispatch(FetchPacking(pageNumber,where))
        // this.props.dispatch(FetchPackingExcel(pageNumber,where))
    }
    componentWillReceiveProps = (nextProps) => {
        let sort = [
            {kode:"desc",value: "DESCENDING"},
            {kode:"asc",value: "ASCENDING"},
        ];
        let data_sort=[];
        sort.map((i) => {
            data_sort.push({
                value: i.kode,
                label: i.value
            });
            return null;
        });
        let filter = [
            {kode:"kd_packing",value: "Kode Ekspedisi"},
            {kode:"tgl_packing",value: "Tanggal"},
            {kode:"status",value: "Status"},
            {kode:"pengirim",value: "Pengirim"},
        ];
        let data_filter=[];
        filter.map((i) => {
            data_filter.push({
                value: i.kode,
                label: i.value
            });
            return null;
        });
        let status = [
            {kode:"",value: "Semua"},
            {kode:"0",value: "Proses"},
            {kode:"1",value: "Dikirim"},
            {kode:"2",value: "Diterima"},
        ];
        let data_status=[];
        status.map((i) => {
            data_status.push({
                value: i.kode,
                label: i.value
            });
            return null;
        });
        this.setState({
            sort_data: data_sort,
            filter_data: data_filter,
            status_data: data_status,
        });
        if (nextProps.auth.user) {
            let lk = [{
                value: '',
                label: 'Semua Lokasi'
            }];
            let loc = nextProps.auth.user.lokasi;
            if(loc!==undefined){
                loc.map((i) => {
                    lk.push({
                        value: i.kode,
                        label: i.nama
                    });
                    return null;
                })
                this.setState({
                    location_data: lk,
                })
            }
        }
    
        localStorage.setItem('status_packing_report',this.state.status===''||this.state.status===undefined?status[0].kode:localStorage.status_packing_report)
        localStorage.setItem('sort_packing_report',this.state.sort===''||this.state.sort===undefined?sort[0].kode:localStorage.sort_packing_report)
        localStorage.setItem('filter_packing_report',this.state.filter===''||this.state.filter===undefined?filter[0].kode:localStorage.filter_packing_report)
    
    }
    HandleChangeLokasi(lk) {
        this.setState({
            location: lk.value
        })
        localStorage.setItem('location_packing_report', lk.value);
    }
    handleChange(event){
        this.setState({ [event.target.name]: event.target.value });
    }

    HandleChangeSort(sr) {
        this.setState({
            sort: sr.value,
        });
        localStorage.setItem('sort_packing_report', sr.value);
    }
    HandleChangeFilter(fl) {
        this.setState({
            filter: fl.value,
        });
        localStorage.setItem('filter_packing_report', fl.value);
    }
    HandleChangeStatus(st) {
        this.setState({
            status: st.value,
        });
        localStorage.setItem('status_packing_report', st.value);
    }
    toggleModal(e,total,perpage) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        // let range = total*perpage;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formPackingExcel"));
        this.props.dispatch(FetchPackingExcel(1,this.state.where_data,total));
    }


    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        const {
            per_page,
            last_page,
            current_page,
            // from,
            // to,
            data
        } = this.props.packingReport;
        return (
            <Layout page="Laporan Packing">
                <div className="col-12 box-margin">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">

                                <div className="col-md-10" style={{zoom:"85%"}}>
                                    <div className="row">
                                        <div className="col-6 col-xs-6 col-md-2">
                                            <div className="form-group">
                                                <label htmlFor=""> Periode </label>
                                                <DateRangePicker
                                                    style={{display:'unset'}}
                                                    ranges={rangeDate}
                                                    alwaysShowCalendars={true}
                                                    onEvent={this.handleEvent}
                                                >
                                                    <input type="text" className="form-control" value={`${this.state.startDate} to ${this.state.endDate}`} style={{padding: '10px',fontWeight:'bolder'}}/>
                                                </DateRangePicker>
                                            </div>
                                        </div>

                                        <div className="col-6 col-xs-6 col-md-2">
                                            <div className="form-group">
                                                <label htmlFor="">Lokasi</label>
                                                <Select
                                                    options={this.state.location_data}
                                                    onChange={this.HandleChangeLokasi}
                                                    placeholder="Pilih Lokasi"
                                                    value = {
                                                        this.state.location_data.find(op => {
                                                            return op.value === this.state.location
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="col-6 col-xs-6 col-md-2">
                                            <div className="form-group">
                                                <label className="control-label font-12">
                                                    Status
                                                </label>
                                                <Select
                                                    options={this.state.status_data}
                                                    // placeholder="Pilih Tipe Kas"
                                                    onChange={this.HandleChangeStatus}
                                                    value={
                                                        this.state.status_data.find(op => {
                                                            return op.value === this.state.status
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="col-6 col-xs-6 col-md-2">
                                            <div className="form-group">
                                                <label className="control-label font-12">
                                                    Filter
                                                </label>
                                                <Select
                                                    options={this.state.filter_data}
                                                    // placeholder="Pilih Tipe Kas"
                                                    onChange={this.HandleChangeFilter}
                                                    value={
                                                        this.state.filter_data.find(op => {
                                                            return op.value === this.state.filter
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="col-6 col-xs-6 col-md-2">
                                            <div className="form-group">
                                                <label className="control-label font-12">
                                                    Sort
                                                </label>
                                                <Select
                                                    options={this.state.sort_data}
                                                    // placeholder="Pilih Tipe Kas"
                                                    onChange={this.HandleChangeSort}
                                                    value={
                                                        this.state.sort_data.find(op => {
                                                            return op.value === this.state.sort
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="col-6 col-xs-6 col-md-2">
                                            <div className="form-group">
                                                <label>Cari</label>
                                                <input className="form-control" type="text" style={{padding: '9px',fontWeight:'bolder'}} name="any" value={this.state.any} onChange={(e) => this.handleChange(e)}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 col-xs-6 col-md-2" style={{zoom:"85%",textAlign:"right"}}>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary" onClick={this.handleSearch}>
                                                    <i className="fa fa-search"/>
                                                </button>
                                                <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary" onClick={(e => this.toggleModal(e,(last_page*per_page),per_page))}>
                                                    <i className="fa fa-print"></i> Export
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                            <div className="table-responsive" style={{overflowX: "auto"}}>
                                <table className="table table-hover table-bordered">
                                    <thead className="bg-light">
                                    <tr>
                                        <th className="text-black" style={columnStyle} rowSpan="2">#</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Kode Packing.</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Tanggal</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Pengirim</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Lokasi Asal</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Lokasi Tujuan</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Nama Operator</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Status</th>
                                    </tr>
                                    </thead>
                                    {
                                        !this.props.isLoading?(
                                            <tbody>
                                            {
                                                (
                                                    typeof data === 'object' ? data.length>0?
                                                        data.map((v,i)=>{
                                                            return(
                                                                <tr key={i}>
                                                                    <td style={columnStyle}>
                                                                        <div className="btn-group">
                                                                            <UncontrolledButtonDropdown>
                                                                                <DropdownToggle caret>
                                                                                    Aksi
                                                                                </DropdownToggle>
                                                                                <DropdownMenu>
                                                                                    {/* <DropdownItem onClick={(e)=>this.toggle(e,v.no_faktur_mutasi,'','')}>Detail</DropdownItem> */}
                                                                                    <Link to={`../packing3ply/${v.kd_packing}`}><DropdownItem>3ply</DropdownItem></Link>
                                                                                </DropdownMenu>
                                                                                </UncontrolledButtonDropdown>
                                                                        </div>
                                                                    </td>
                                                                    <td style={columnStyle}>{v.kd_packing}</td>
                                                                    <td style={columnStyle}>{moment(v.tgl_packing).format("DD-MM-YYYY")}</td>
                                                                    <td style={columnStyle}>{v.pengirim}</td>
                                                                    <td style={columnStyle}>{v.nama_lokasi_asal}</td>
                                                                    <td style={columnStyle}>{v.nama_lokasi_tujuan}</td>
                                                                    <td style={columnStyle}>{v.nama_operator}</td>
                                                                    <td style={columnStyle}>{
                                                                        v.status==='0'?statusQ('danger','Belum Packing'):(v.status==='1'?statusQ('warning','Sudah Packing'):"")
                                                                        // v.status===0?statusQ('danger','proses'):(v.status===1?statusQ('warning','packing')?(v.status===2?statusQ('info','dikirim'):statusQ('info','diterima')):""):""
                                                                    }</td>

                                                                </tr>
                                                            )
                                                        })
                                                        : "No data." : "No data."
                                                )
                                            }
                                            </tbody>
                                        ):<Preloader/>
                                    }
                                </table>

                            </div>
                            <div style={{"marginTop":"20px","float":"right"}}>
                                <Paginationq
                                    current_page={current_page}
                                    per_page={per_page}
                                    total={(per_page*last_page)}
                                    callback={this.handlePageChange.bind(this)}
                                />
                            </div>
                            {/* <DetailPacking packingDetail={this.props.packingDetail}/> */}
                            <PackingReportExcel startDate={this.state.startDate} endDate={this.state.endDate} location={this.state.location} />
                        </div>
                    </div>
                </div>
            </Layout>
            );
    }
}

const mapStateToProps = (state) => {
    
    return {
        packingReport:state.packingReducer.report,
        isLoadingDetail: state.packingReducer.isLoadingDetail,
        packingReportExcel:state.packingReducer.report_excel,
        auth:state.auth,
        isLoading: state.packingReducer.isLoading,
        // packingDetail:state.packingReducer.packing_data,
        // isLoadingDetailSatuan: state.stockReportReducer.isLoadingDetailSatuan,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(PackingReport);