import React,{Component} from 'react'
import Layout from 'components/App/Layout'
import Paginationq from "helper";
import {FetchPiutangReport, FetchPiutangReportExcel, DeletePiutangReport} from "redux/actions/piutang/piutang.action";
import connect from "react-redux/es/connect/connect";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
// import DetailPiutang from "components/App/modals/report/inventory/piutang_report/detail_piutang";
import PiutangReportExcel from "components/App/modals/piutang/form_piutang_excel";
// import ApprovePiutang from "components/App/modals/report/inventory/piutang_report/approve_piutang";
import Select from 'react-select';
import moment from "moment";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import {rangeDate} from "helper";
import Preloader from "Preloader";
import Swal from 'sweetalert2'
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';
import { Link } from 'react-router-dom';
class PiutangReport extends Component{
    constructor(props){
        super(props);
        this.approve = this.approve.bind(this);
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
        let page=localStorage.page_piutang_report;
        this.handleParameter(page!==undefined&&page!==null?page:1);
    }
    componentDidMount(){
        if (localStorage.location_piutang_report !== undefined && localStorage.location_piutang_report !== '') {
            this.setState({location: localStorage.location_piutang_report})
        }
        if (localStorage.any_piutang_report !== undefined && localStorage.any_piutang_report !== '') {
            this.setState({any: localStorage.any_piutang_report})
        }
        if (localStorage.date_from_piutang_report !== undefined && localStorage.date_from_piutang_report !== null) {
            this.setState({startDate: localStorage.date_from_piutang_report})
        }
        if (localStorage.date_to_piutang_report !== undefined && localStorage.date_to_piutang_report !== null) {
            this.setState({endDate: localStorage.date_to_piutang_report})
        }
        if (localStorage.sort_piutang_report !== undefined && localStorage.sort_piutang_report !== null) {
            this.setState({sort: localStorage.sort_piutang_report})
        }
        if (localStorage.filter_piutang_report !== undefined && localStorage.filter_piutang_report !== null) {
            this.setState({filter: localStorage.filter_piutang_report})
        }
        if (localStorage.status_piutang_report !== undefined && localStorage.status_piutang_report !== null) {
            this.setState({status: localStorage.status_piutang_report})
        }
    }
    handlePageChange(pageNumber){
        localStorage.setItem("page_piutang_report",pageNumber);
        this.props.dispatch(FetchPiutangReport(pageNumber))
    }
    approve(e,code,hpp,qty){
        e.preventDefault();
        localStorage.setItem("code_for_approve",code);
        localStorage.setItem("hpp_for_approve",hpp);
        localStorage.setItem("qty_for_approve",qty);
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("approvePiutang"));
    };
    handleEvent = (event, picker) => {
        const awal = picker.startDate._d.toISOString().substring(0,10);
        const akhir = picker.endDate._d.toISOString().substring(0,10);
        localStorage.setItem("date_from_piutang_report",`${awal}`);
        localStorage.setItem("date_to_piutang_report",`${akhir}`);
        this.setState({
            startDate:awal,
            endDate:akhir
        });
    };
    handleSearch(e){
        e.preventDefault();
        localStorage.setItem("any_piutang_report",this.state.any);
        this.handleParameter(1);
    }
    handleDelete(e,kode){
        e.preventDefault();
        Swal.fire({
            title: 'Peringatan',
            text: "Hapus data ini?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.value) {
                
                this.props.dispatch(DeletePiutangReport(kode));
            }
        })
    }
    handleParameter(pageNumber){
        let dateFrom=localStorage.date_from_piutang_report;
        let dateTo=localStorage.date_to_piutang_report;
        let lokasi = localStorage.location_piutang_report;
        let any = localStorage.any_piutang_report;
        let sort=localStorage.sort_piutang_report;
        let filter=localStorage.filter_piutang_report;
        let status=localStorage.status_piutang_report;
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
        localStorage.setItem("where_piutang_report",pageNumber);
        this.props.dispatch(FetchPiutangReport(pageNumber,where))
        // this.props.dispatch(FetchPiutangReportExcel(pageNumber,where))
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
            {kode:"no_nota",value: "No Nota"},
            {kode:"fak_jual",value: "Faktur Jual"},
            {kode:"tgl_byr",value: "Tanggal Bayar"},
            {kode:"cara_byr",value: "Cara Bayar"},
            {kode:"jumlah",value: "Jumlah"},
            {kode:"nm_bank",value: "Nama Bank"},
            {kode:"tgl_jatuh_tempo",value: "Jatuh Tempo"},
            {kode:"tgl_cair_giro",value: "tanggal Cair Giro"},
            {kode:"nama",value: "Nama"},
            {kode:"kd_cust",value: "Kode Cust."},
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
            {kode:"1",value: "Approve"},
            {kode:"0",value: "Not Approve"},
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
        // localStorage.setItem('status_piutang_report',this.state.status===''||this.state.status===undefined?status[0].kode:localStorage.status_piutang_report)
        localStorage.setItem('sort_piutang_report',this.state.sort===''||this.state.sort===undefined?sort[0].kode:localStorage.sort_piutang_report)
        localStorage.setItem('filter_piutang_report',this.state.filter===''||this.state.filter===undefined?filter[0].kode:localStorage.filter_piutang_report)
    
    }
    HandleChangeLokasi(lk) {
        this.setState({
            location: lk.value
        })
        localStorage.setItem('location_piutang_report', lk.value);
    }
    handleChange(event){
        this.setState({ [event.target.name]: event.target.value });
    }

    HandleChangeSort(sr) {
        this.setState({
            sort: sr.value,
        });
        localStorage.setItem('sort_piutang_report', sr.value);
    }
    HandleChangeFilter(fl) {
        this.setState({
            filter: fl.value,
        });
        localStorage.setItem('filter_piutang_report', fl.value);
    }
    HandleChangeStatus(st) {
        this.setState({
            status: st.value,
        });
        localStorage.setItem('status_piutang_report', st.value);
    }
    toggleModal(e,total,perpage) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        // let range = total*perpage;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formPiutangExcel"));
        this.props.dispatch(FetchPiutangReportExcel(this.state.where_data,total));
    }

    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        const {
            per_page,
            last_page,
            current_page,
            // from,
            // to,
            data,
            // total
        } = this.props.piutangReport;
        
        return (
            <Layout page="Laporan Piutang">
                <div className="col-12 box-margin">
                    <div className="card">
                        <div className="card-body">
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

                                {/* <div className="col-6 col-xs-6 col-md-2">
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
                                <div className="col-6 col-xs-6 col-md-2"></div>
                                <div className="col-6 col-xs-6 col-md-2"></div>
                                <div className="col-6 col-xs-6 col-md-2"></div> */}
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
                                <div className="col-6 col-xs-6 col-md-3">
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
                            <div className="table-responsive" style={{overflowX: "auto"}}>
                                <table className="table table-hover table-bordered">
                                    <thead className="bg-light">
                                    <tr>
                                        <th className="text-black" style={columnStyle} rowSpan="2">#</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">No Nota</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Faktur Jual</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Tanggal Bayar</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Cara Bayar</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Jumlah</th>
                                        {/* <th className="text-black" style={columnStyle} rowSpan="2">kasir</th> */}
                                        <th className="text-black" style={columnStyle} rowSpan="2">nama Bank</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Jatuh Tempo</th>
                                        {/* <th className="text-black" style={columnStyle} rowSpan="2">bulat</th> */}
                                        <th className="text-black" style={columnStyle} rowSpan="2">No Giro</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Tanggal Cair Giro</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Nama</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">kode Cust.</th>
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
                                                            return(
                                                                <tr key={i}>
                                                                    <td style={columnStyle}>
                                                                        <div className="btn-group">
                                                                            <UncontrolledButtonDropdown>
                                                                                <DropdownToggle caret>
                                                                                    Aksi
                                                                                </DropdownToggle>
                                                                                <DropdownMenu>
                                                                                    <DropdownItem onClick={(e)=>this.handleDelete(e,v.no_nota)}>Delete</DropdownItem>
                                                                                    <Link to={`../bayar_piutang3ply/${v.no_nota}`}><DropdownItem>3ply</DropdownItem></Link>
                                                                                </DropdownMenu>
                                                                                </UncontrolledButtonDropdown>
                                                                        </div>
                                                                    </td>
                                                                    <td style={columnStyle}>{v.no_nota}</td>
                                                                    <td style={columnStyle}>{v.fak_jual}</td>
                                                                    <td style={columnStyle}>{moment(v.tgl_byr).format("DD-MM-YYYY")}</td>
                                                                    <td style={columnStyle}>{v.cara_byr}</td>
                                                                    <td style={columnStyle}>{v.jumlah}</td>
                                                                    {/* <td style={columnStyle}>{v.kasir}</td> */}
                                                                    <td style={columnStyle}>{v.nm_bank}</td>
                                                                    <td style={columnStyle}>{moment(v.tgl_jatuh_tempo).format("DD-MM-YYYY")}</td>
                                                                    {/* <td style={columnStyle}>{v.bulat}</td> */}
                                                                    <td style={columnStyle}>{v.nogiro}</td>
                                                                    <td style={columnStyle}>{moment(v.tgl_cair_giro).format("DD-MM-YYYY")}</td>
                                                                    <td style={columnStyle}>{v.nama}</td>
                                                                    <td style={columnStyle}>{v.kd_cust}</td>
                                                                    <td style={columnStyle}>{v.ket}</td>

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
                            {/* <DetailPiutang piutangDetail={this.props.piutangDetail}/> */}
                            <PiutangReportExcel startDate={this.state.startDate} endDate={this.state.endDate} />
                            {/* <ApprovePiutang/> */}
                        </div>
                    </div>
                </div>
            </Layout>
            );
    }
}

const mapStateToProps = (state) => {
    
    return {
        piutangReport:state.piutangReducer.data_report,
        isLoadingDetail: state.piutangReducer.isLoadingDetail,
        auth:state.auth,
        isLoading: state.piutangReducer.isLoading,
        // piutangDetail:state.piutangReducer.report_data,
        piutangReportExcel:state.piutangReducer.report_excel,
        // isLoadingDetailSatuan: state.stockReportReducer.isLoadingDetailSatuan,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(PiutangReport);