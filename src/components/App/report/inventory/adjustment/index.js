import React,{Component} from 'react';
import Layout from "components/App/Layout";
import Preloader from "Preloader";
import connect from "react-redux/es/connect/connect";
import {deleteAdjustment, FetchAdjustment, FetchAdjustmentDetail} from "redux/actions/adjustment/adjustment.action";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import Paginationq, {statusQ} from "helper";
import DetailAdjustment from "components/App/modals/report/inventory/adjustment_report/detail_adjustment_report";
import Swal from "sweetalert2";
import Select from 'react-select';
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import {rangeDate} from "helper";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import {HEADERS} from "../../../../../redux/actions/_constants";
import {FetchAdjustmentExcel} from "../../../../../redux/actions/adjustment/adjustment.action";


class AdjustmentReport extends Component{
    constructor(props){
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.state={
            any:"",
            location:"",
            location_data:[],
            startDate:moment(new Date()).format("yyyy-MM-DD"),
            endDate:moment(new Date()).format("yyyy-MM-DD"),
        }
    }
    componentWillReceiveProps = (nextProps) => {
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
                })
                this.setState({
                    location_data: lk,
                })
            }
        }
    }
    componentWillMount(){
        let page=localStorage.page_adjust_report;
        this.handleParamter(page!==undefined&&page!==null?page:1);
    }
    componentDidMount(){
        if (localStorage.location_adjust_report !== undefined && localStorage.location_adjust_report !== '') {
            this.setState({location: localStorage.location_adjust_report})
        }
        if (localStorage.any_adjust_report !== undefined && localStorage.any_adjust_report !== '') {
            this.setState({any: localStorage.any_adjust_report})
        }
        if (localStorage.date_from_adjust_report !== undefined && localStorage.date_from_adjust_report !== null) {
            this.setState({startDate: localStorage.date_from_adjust_report})
        }
        if (localStorage.date_to_adjust_report !== undefined && localStorage.date_to_adjust_report !== null) {
            this.setState({endDate: localStorage.date_to_adjust_report})
        }
    }
    handleParamter(pageNumber){
        let dateFrom=localStorage.date_from_adjust_report;
        let dateTo=localStorage.date_to_adjust_report;
        let lokasi=localStorage.location_adjust_report;
        let any=localStorage.any_adjust_report;
        let where='';
        if(dateFrom!==undefined&&dateFrom!==null){
            where+=`&dateFrom=${dateFrom}&dateTo=${dateTo}`;
        }
        if(lokasi!==undefined&&lokasi!==null&&lokasi!==''){
            where+=`&lokasi=${lokasi}`;
        }
        if(any!==undefined&&any!==null&&any!==''){
            where+=`&q=${any}`;
        }
        this.props.dispatch(FetchAdjustmentExcel(where));
        this.props.dispatch(FetchAdjustment(pageNumber,where))
    }
    handleChange(event){
        this.setState({ [event.target.name]: event.target.value });
    }
    handlePageChange(pageNumber){
        console.log(`active page is ${pageNumber}`);
        localStorage.setItem("page_adjust_report",pageNumber);
        this.handleParamter(pageNumber);
    }
    handleSearch(e){
        e.preventDefault();
        localStorage.setItem('any_adjust_report',this.state.any);
        this.handleParamter(1);
    }
    toggleModal(e, kd_trx) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("detailAdjustment"));
        this.props.dispatch(FetchAdjustmentDetail(1,kd_trx))
    }
    handleEvent = (event, picker) => {
        const awal = picker.startDate._d.toISOString().substring(0,10);
        const akhir = picker.endDate._d.toISOString().substring(0,10);
        localStorage.setItem("date_from_adjust_report",`${awal}`);
        localStorage.setItem("date_to_adjust_report",`${akhir}`);
        this.setState({
            startDate:awal,
            endDate:akhir
        });
    };

    HandleChangeLokasi(lk) {
        this.setState({location: lk.value});
        localStorage.setItem('location_adjust_report', lk.value);
    }

    render(){
        const {total,last_page,per_page,current_page,from,to,data} = this.props.adjustmentReport;

        const columnStyle = {verticalAlign: "middle", textAlign: "center"};
        return (
            <Layout page="Laporan Adjusment">
                <div className="col-12 box-margin">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-6 col-xs-6 col-md-2">
                                    <div className="form-group">
                                        <label htmlFor=""> Periode </label>
                                        <DateRangePicker style={{display:'unset'}} ranges={rangeDate} alwaysShowCalendars={true} onEvent={this.handleEvent}>
                                            <input type="text" className="form-control" value={`${this.state.startDate} to ${this.state.endDate}`} style={{padding: '10px',width: '185px',fontWeight:'bolder'}}/>
                                        </DateRangePicker>
                                    </div>
                                </div>
                                <div className="col-6 col-xs-6 col-md-2">
                                    <div className="form-group">
                                        <label htmlFor="">Lokasi</label>
                                        <Select options={this.state.location_data} onChange={this.HandleChangeLokasi} placeholder="Pilih Lokasi" value={this.state.location_data.find(op=>{return op.value===this.state.location})}/>
                                    </div>
                                </div>
                                <div className="col-6 col-xs-6 col-md-2">
                                    <div className="form-group">
                                        <label>Cari</label>
                                        <input className="form-control" type="text" style={{padding: '9px',width: '185px',fontWeight:'bolder'}} name="any" value={this.state.any} onChange={(e) => this.handleChange(e)}/>
                                    </div>
                                </div>
                                <div className="col-6 col-xs-6 col-md-4">
                                    <div className="form-group">
                                        <button onClick={(e=>this.handleSearch(e))} style={{marginTop:"29px",marginRight:"2px"}} type="button" className="btn btn-primary" ><i className="fa fa-search"></i></button>
                                        <ReactHTMLTableToExcel className="btn btn-primary btnBrg" table="report_adjusment" filename="laporan adjusment" sheet="laporan adjusment" buttonText="export excel"/>
                                    </div>
                                </div>
                            </div>
                            <div className="table-responsive" style={{overflowX: "auto"}}>
                                {/*EXPORT EXCEL*/}
                                <table className="table table-hover table-bordered"  id="report_adjusment" style={{display:"none"}}>
                                    <thead className="bg-light">
                                    <tr>
                                        <th className="text-black" colSpan={6}>{this.state.startDate} - {this.state.startDate}</th>
                                    </tr>
                                    <tr>
                                        <th className="text-black" colSpan={6}>{this.state.location===''?'SEMUA LOKASI':this.state.location}</th>
                                    </tr>

                                    <tr>
                                        <th className="text-black" style={columnStyle}>No</th>
                                        <th className="text-black" style={columnStyle}>Tanggal</th>
                                        <th className="text-black" style={columnStyle}>No. Adjusment</th>
                                        <th className="text-black" style={columnStyle}>Operator</th>
                                        <th className="text-black" style={columnStyle}>Lokasi</th>
                                        <th className="text-black" style={columnStyle}>Keterangan</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        (
                                            typeof this.props.adjustmentReportExcel.data === 'object' ?
                                                this.props.adjustmentReportExcel.data.map((v,i)=>{
                                                    return(
                                                        <tr key={i}>
                                                            <td style={columnStyle}>{i+1}</td>
                                                            <td style={columnStyle}>{moment(v.tgl).format("yyyy-MM-DD")}</td>
                                                            <td style={columnStyle}>{v.kd_trx}</td>
                                                            <td style={columnStyle}>{v.username}</td>
                                                            <td style={columnStyle}>{v.lokasi}</td>
                                                            <td style={columnStyle}>{v.keterangan}</td>
                                                        </tr>
                                                    )
                                                })
                                                : "No data."
                                        )
                                    }
                                    </tbody>
                                </table>
                                {/*END REPORT EXCEL*/}
                                <table className="table table-hover table-bordered">
                                    <thead className="bg-light">
                                    <tr>
                                        <th className="text-black" style={columnStyle}>#</th>
                                        <th className="text-black" style={columnStyle}>No. Adjusment</th>
                                        <th className="text-black" style={columnStyle}>Tanggal</th>
                                        <th className="text-black" style={columnStyle}>Operator</th>
                                        <th className="text-black" style={columnStyle}>Lokasi</th>
                                        <th className="text-black" style={columnStyle}>Keterangan</th>
                                    </tr>
                                    </thead>
                                    {
                                        !this.props.isLoading?(
                                            <tbody>
                                            {
                                                (
                                                    typeof data === 'object' ?
                                                        data.map((v,i)=>{
                                                            return(
                                                                <tr key={i}>
                                                                    <td style={columnStyle}>{/* Example split danger button */}
                                                                        <div className="btn-group">
                                                                            <button className="btn btn-primary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                Action
                                                                            </button>
                                                                            <div className="dropdown-menu">
                                                                                <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.toggleModal(e,v.kd_trx)}>Detail</a>
                                                                                <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.toggleModal(e,v.kd_trx)}>Delete</a>
                                                                                <a className="dropdown-item" href={`${HEADERS.URL}reports/adjusment/${v.kd_trx}.pdf`} target="_blank">Nota</a>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td style={columnStyle}>{v.kd_trx}</td>
                                                                    <td style={columnStyle}>{moment(v.tgl).format("yyyy-MM-DD")}</td>
                                                                    <td style={columnStyle}>{v.username}</td>
                                                                    <td style={columnStyle}>{v.lokasi}</td>
                                                                    <td style={columnStyle}>{v.keterangan}</td>
                                                                </tr>
                                                            )
                                                        })
                                                        : "No data."
                                                )
                                            }
                                            </tbody>
                                        ):<Preloader/>
                                    }
                                </table>
                            </div>
                            <div style={{"marginTop":"20px","float":"right"}}>
                                <Paginationq
                                    current_page={parseInt(current_page)}
                                    per_page={parseInt(per_page)}
                                    total={parseInt(total)}
                                    callback={this.handlePageChange.bind(this)}
                                />
                            </div>

                            <DetailAdjustment detail={this.props.adjustmentDetailSatuan} />
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        adjustmentReport:state.adjustmentReducer.data,
        adjustmentReportExcel:state.adjustmentReducer.dataExcel,
        total:state.adjustmentReducer.total,
        isLoadingDetailSatuan: state.adjustmentReducer.isLoadingDetailSatuan,
        auth:state.auth,
        isLoading: state.adjustmentReducer.isLoading,
        adjustmentDetailSatuan:state.adjustmentReducer.dataDetailTransaksi,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}

export default connect(mapStateToProps)(AdjustmentReport)