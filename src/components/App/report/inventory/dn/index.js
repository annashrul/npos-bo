import React,{Component} from 'react'
import Layout from 'components/App/Layout'
import Paginationq from "helper";
import {FetchDn, FetchDnExcel, FetchDnDetail} from "redux/actions/inventory/dn.action";
import connect from "react-redux/es/connect/connect";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import DetailDn from "components/App/modals/report/inventory/dn_report/detail_dn";
import DnReportExcel from "components/App/modals/report/inventory/dn_report/form_dn_excel";
import Select from 'react-select';
import moment from "moment";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import {rangeDate} from "helper";
import Preloader from "Preloader";
import {statusQ} from "helper";
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';
import { Link } from 'react-router-dom';
class DnReport extends Component{
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
        let page=localStorage.page_dn_report;
        this.handleParameter(page!==undefined&&page!==null?page:1);
    }
    componentDidMount(){
        if (localStorage.location_dn_report !== undefined && localStorage.location_dn_report !== '') {
            this.setState({location: localStorage.location_dn_report})
        }
        if (localStorage.any_dn_report !== undefined && localStorage.any_dn_report !== '') {
            this.setState({any: localStorage.any_dn_report})
        }
        if (localStorage.date_from_dn_report !== undefined && localStorage.date_from_dn_report !== null) {
            this.setState({startDate: localStorage.date_from_dn_report})
        }
        if (localStorage.date_to_dn_report !== undefined && localStorage.date_to_dn_report !== null) {
            this.setState({endDate: localStorage.date_to_dn_report})
        }
        if (localStorage.sort_dn_report !== undefined && localStorage.sort_dn_report !== null) {
            this.setState({sort: localStorage.sort_dn_report})
        }
        if (localStorage.filter_dn_report !== undefined && localStorage.filter_dn_report !== null) {
            this.setState({filter: localStorage.filter_dn_report})
        }
        if (localStorage.status_dn_report !== undefined && localStorage.status_dn_report !== null) {
            this.setState({status: localStorage.status_dn_report})
        }
    }
    handlePageChange(pageNumber){
        localStorage.setItem("page_dn_report",pageNumber);
        this.props.dispatch(FetchDn(pageNumber))
    }
    toggle(e,code,barcode,name){
        e.preventDefault();
        localStorage.setItem("code",code);
        localStorage.setItem("barcode",barcode);
        localStorage.setItem("name",name);
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("detailDn"));
        this.props.dispatch(FetchDnDetail(code))
    };
    handleEvent = (event, picker) => {
        const awal = picker.startDate._d.toISOString().substring(0,10);
        const akhir = picker.endDate._d.toISOString().substring(0,10);
        localStorage.setItem("date_from_dn_report",`${awal}`);
        localStorage.setItem("date_to_dn_report",`${akhir}`);
        this.setState({
            startDate:awal,
            endDate:akhir
        });
    };
    handleSearch(e){
        e.preventDefault();
        localStorage.setItem("any_dn_report",this.state.any);
        this.handleParameter(1);
    }
    handleParameter(pageNumber){
        let dateFrom=localStorage.date_from_dn_report;
        let dateTo=localStorage.date_to_dn_report;
        let lokasi = localStorage.location_dn_report;
        let any = localStorage.any_dn_report;
        let sort=localStorage.sort_dn_report;
        let filter=localStorage.filter_dn_report;
        let status=localStorage.status_dn_report;
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
        this.props.dispatch(FetchDn(pageNumber,where))
        // this.props.dispatch(FetchDnExcel(pageNumber,where))
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
            {kode:"no_delivery_note",value: "No DN"},
            {kode:"tanggal",value: "Tanggal"},
            {kode:"status",value: "Status"},
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
            {kode:"3",value: "Diterima"},
            {kode:"2",value: "Dikirim"},
            {kode:"1",value: "Packing"},
            {kode:"0",value: "Proses"},
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
        localStorage.setItem('status_dn_report',this.state.status===''||this.state.status===undefined?status[0].kode:localStorage.status_dn_report)
        localStorage.setItem('sort_dn_report',this.state.sort===''||this.state.sort===undefined?sort[0].kode:localStorage.sort_dn_report)
        localStorage.setItem('filter_dn_report',this.state.filter===''||this.state.filter===undefined?filter[0].kode:localStorage.filter_dn_report)
    }
    HandleChangeLokasi(lk) {
        this.setState({
            location: lk.value
        })
        localStorage.setItem('location_dn_report', lk.value);
    }
    handleChange(event){
        this.setState({ [event.target.name]: event.target.value });
    }

    HandleChangeSort(sr) {
        this.setState({
            sort: sr.value,
        });
        localStorage.setItem('sort_dn_report', sr.value);
    }
    HandleChangeFilter(fl) {
        this.setState({
            filter: fl.value,
        });
        localStorage.setItem('filter_dn_report', fl.value);
    }
    HandleChangeStatus(st) {
        this.setState({
            status: st.value,
        });
        localStorage.setItem('status_dn_report', st.value);
    }
    toggleModal(e,total,perpage) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        // let range = total*perpage;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formDnExcel"));
        this.props.dispatch(FetchDnExcel(1,this.state.where_data,total));
    }

    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        const {
            per_page,
            last_page,
            current_page,
            // from,
            // to,
            data,
            // total
        } = this.props.dnReport;
        return (
            <Layout page="Laporan Dn">
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
                                <div className="col-md-2" style={{zoom:"85%",textAlign:"right"}}>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary" onClick={this.handleSearch}>
                                                    <i className="fa fa-search"/>
                                                </button>
                                                <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary" onClick={(e => this.toggleModal(e,(last_page*per_page),per_page))}>
                                                    <i className="fa fa-print"/> Export
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                            {/*DATA EXCEL*/}
                            <table className="table table-hover"  id="report_dn_to_excel" style={{display:"none"}}>
                                <thead className="bg-light">
                                <tr>
                                    <th className="text-black" colSpan={7}>{this.state.startDate} - {this.state.startDate}</th>
                                </tr>
                                <tr>
                                    <th className="text-black" colSpan={7}>LAPORAN DELIVERY NOTE</th>
                                </tr>

                                <tr>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>No DN</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Tanggal</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Lokasi Asal</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Lokasi Tujuan</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Status</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>No. Faktur Beli</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Keterangan</th>
                                </tr>
                                <tr></tr>
                                </thead>
                                {
                                    <tbody>
                                    {
                                        typeof this.props.dnReportExcel.data==='object'? this.props.dnReportExcel.data.length>0?
                                            this.props.dnReportExcel.data.map((v,i)=>{
                                                return (
                                                    <tr key={i}>
                                                        <td style={columnStyle}>{v.no_delivery_note}</td>
                                                        <td style={columnStyle}>{moment(v.tanggal).format("DD-MM-YYYY")}</td>
                                                        <td style={columnStyle}>{v.kd_lokasi_1}</td>
                                                        <td style={columnStyle}>{v.kd_lokasi_2}</td>
                                                        <td style={columnStyle}>{v.status==='0'?statusQ('danger','proses'):(v.status==='1'?statusQ('warning','packing'):(v.status==='2'?statusQ('info','dikirim'):(v.status==='3'?statusQ('success','diterima'):"")))}</td>
                                                        <td style={columnStyle}>{v.no_faktur_beli?v.no_faktur_beli:'-'}</td>
                                                        <td style={columnStyle}>{v.keterangan?v.keterangan:'-'}</td>
                                                    </tr>
                                                );
                                            }) : "No data." : "No data."
                                    }
                                    </tbody>
                                }
                            </table>
                            {/*END DATA EXCEL*/}
                            <div className="table-responsive" style={{overflowX: "auto"}}>
                                <table className="table table-hover table-bordered">
                                    <thead className="bg-light">
                                    <tr>
                                        <th className="text-black" style={columnStyle} rowSpan="2">#</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">No DN</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Tanggal</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Lokasi Asal</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Lokasi Tujuan</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Status</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">No. Faktur Beli</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Keterangan</th>
                                    </tr>
                                    </thead>
                                    {
                                        !this.props.isLoading?(
                                            <tbody>
                                            {
                                                (
                                                    typeof data === 'object' ? data.length>0?
                                                        data.map((v,i)=>{
                                                            // total_dn_per = total_dn_per+parseInt(v.delivery_note);
                                                            // total_first_stock_per = total_first_stock_per+parseInt(v.stock_awal);
                                                            // total_last_stock_per = total_last_stock_per+parseInt(v.stock_akhir);
                                                            // total_stock_in_per = total_stock_in_per+parseInt(v.stock_masuk);
                                                            // total_stock_out_per = total_stock_out_per+parseInt(v.stock_keluar);
                                                            return(
                                                                <tr key={i}>
                                                                    <td style={columnStyle}>{/* Example split danger button */}
                                                                        <div className="btn-group">
                                                                            <UncontrolledButtonDropdown>
                                                                                <DropdownToggle caret>
                                                                                    Aksi
                                                                                </DropdownToggle>
                                                                                <DropdownMenu>
                                                                                    <DropdownItem onClick={(e)=>this.toggle(e,v.no_delivery_note,'','')}>Detail</DropdownItem>
                                                                                    <Link to={`../dn3ply/${v.no_delivery_note}`}><DropdownItem>3ply</DropdownItem></Link>
                                                                                </DropdownMenu>
                                                                                </UncontrolledButtonDropdown>
                                                                        </div>
                                                                    </td>
                                                                    <td style={columnStyle}>{v.no_delivery_note}</td>
                                                                    <td style={columnStyle}>{moment(v.tanggal).format("DD-MM-YYYY")}</td>
                                                                    <td style={columnStyle}>{v.kd_lokasi_1}</td>
                                                                    <td style={columnStyle}>{v.kd_lokasi_2}</td>
                                                                    <td style={columnStyle}>{
                                                                        v.status==='0'?statusQ('danger','proses'):(v.status==='1'?statusQ('warning','packing'):(v.status==='2'?statusQ('info','dikirim'):(v.status==='3'?statusQ('success','diterima'):"")))
                                                                        // v.status===0?statusQ('danger','proses'):(v.status===1?statusQ('warning','packing')?(v.status===2?statusQ('info','dikirim'):statusQ('info','diterima')):""):""
                                                                    }</td>
                                                                    <td style={columnStyle}>{v.no_faktur_beli?v.no_faktur_beli:'-'}</td>
                                                                    <td style={columnStyle}>{v.keterangan?v.keterangan:'-'}</td>

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
                                    total={parseInt((per_page*last_page),10)}
                                    callback={this.handlePageChange.bind(this)}
                                />
                            </div>
                            <DetailDn dnDetail={this.props.dnDetail}/>
                            <DnReportExcel startDate={this.state.startDate} endDate={this.state.endDate} />
                        </div>
                    </div>
                </div>
            </Layout>
            );
    }
}

const mapStateToProps = (state) => {
    
    return {
        dnReport:state.dnReducer.report,
        isLoadingDetail: state.dnReducer.isLoadingDetail,
        auth:state.auth,
        isLoading: state.dnReducer.isLoading,
        dnDetail:state.dnReducer.dn_detail,
        dnReportExcel:state.dnReducer.report_excel,
        isLoadingDetailSatuan: state.stockReportReducer.isLoadingDetailSatuan,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(DnReport);