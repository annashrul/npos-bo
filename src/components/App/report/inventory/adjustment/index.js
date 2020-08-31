import React,{Component} from 'react';
import Layout from "components/App/Layout";
import Preloader from "Preloader";
import connect from "react-redux/es/connect/connect";
import {deleteAdjustment, FetchAdjustment, FetchAdjustmentDetail} from "redux/actions/adjustment/adjustment.action";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import Paginationq from "helper";
import DetailAdjustment from "components/App/modals/report/inventory/adjustment_report/detail_adjustment_report";
import Swal from "sweetalert2";
import Select from 'react-select';
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import {rangeDate} from "helper";
import {HEADERS} from "redux/actions/_constants";
import {FetchAdjustmentExcel} from "redux/actions/adjustment/adjustment.action";
import AdjustmentReportExcel from 'components/App/modals/report/inventory/adjustment_report/form_adjustment_excel'


class AdjustmentReport extends Component{
    constructor(props){
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.toggleModalDetal = this.toggleModalDetal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.HandleChangeSort = this.HandleChangeSort.bind(this);
        this.HandleChangeFilter = this.HandleChangeFilter.bind(this);
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
        }
    }
    componentWillReceiveProps = (nextProps) => {
        let sort = [
            {kode:"",value: "Default"},
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
            {kode:"",value: "Default"},
            {kode:"kd_trx",value: "Kode Trx"},
            {kode:"tgl",value: "Tanggal"},
            {kode:"username",value: "Username"},
        ];
        let data_filter=[];
        filter.map((i) => {
            data_filter.push({
                value: i.kode,
                label: i.value
            });
            return null;
        });
        this.setState({
            sort_data: data_sort,
            filter_data: data_filter,
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
        if (localStorage.sort_adjust_report !== undefined && localStorage.sort_adjust_report !== null) {
            this.setState({sort: localStorage.sort_adjust_report})
        }
        if (localStorage.filter_adjust_report !== undefined && localStorage.filter_adjust_report !== null) {
            this.setState({filter: localStorage.filter_adjust_report})
        }
    }
    handleParamter(pageNumber){
        let dateFrom=localStorage.date_from_adjust_report;
        let dateTo=localStorage.date_to_adjust_report;
        let lokasi=localStorage.location_adjust_report;
        let any=localStorage.any_adjust_report;
        let sort=localStorage.sort_adjust_report;
        let filter=localStorage.filter_adjust_report;
        let where='';
        if(dateFrom!==undefined&&dateFrom!==null){
            where+=`&dateFrom=${dateFrom}&dateTo=${dateTo}`;
        }
        if(lokasi!==undefined&&lokasi!==null&&lokasi!==''){
            where+=`&lokasi=${lokasi}`;
        }
        if(filter!==undefined&&filter!==null&&filter!==''){
            if(sort!==undefined&&sort!==null&&sort!==''){
                where+=`&sort=${filter}|${sort}`;
            }
        }
        if(any!==undefined&&any!==null&&any!==''){
            where+=`&search=${any}`;
        }
        this.setState({
            where_data:where
        })
        localStorage.setItem("where_adjust_report",where);
        this.props.dispatch(FetchAdjustment(pageNumber,where))
        // this.props.dispatch(FetchAdjustmentExcel(where));
    }
    handleChange(event){
        this.setState({ [event.target.name]: event.target.value });
    }
    handlePageChange(pageNumber){
        localStorage.setItem("page_adjust_report",pageNumber);
        this.handleParamter(pageNumber);
    }
    handleSearch(e){
        e.preventDefault();
        localStorage.setItem('any_adjust_report',this.state.any);
        this.handleParamter(1);
    }
    toggleModalDet(e, kd_trx) {
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
    HandleChangeSort(sr) {
        this.setState({
            sort: sr.value,
        });
        localStorage.setItem('sort_adjust_report', sr.value);
    }
    HandleChangeFilter(fl) {
        this.setState({
            filter: fl.value,
        });
        localStorage.setItem('filter_adjust_report', fl.value);
    }
    HandleChangeLokasi(lk) {
        this.setState({location: lk.value});
        localStorage.setItem('location_adjust_report', lk.value);
    }
    handleDelete(e,id){
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                this.props.dispatch(deleteAdjustment(id));
            }
        })

    }
    toggleModal(e,total,perpage) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        // let range = total*perpage;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formAdjustmentExcel"));
        this.props.dispatch(FetchAdjustmentExcel(1,this.state.where_data,total));
    }

    render(){
        const {
            total,
            // last_page,
            per_page,
            current_page,
            // from,
            // to,
            data
        } = this.props.adjustmentReport;

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
                                        <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary" onClick={(e => this.toggleModal(e,total,per_page))}>
                                            <i className="fa fa-print"></i> Export
                                        </button>
                                    </div>

                                </div>
                            </div>
                            <div className="table-responsive" style={{overflowX: "auto"}}>
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
                                                                                <a tabIndex="0" className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.toggleModalDetodal(e,v.kd_trx)}>Detail</a>
                                                                                <a tabIndex="0" className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.handleDelete(e,v.kd_trx)}>Delete</a>
                                                                                {/*http://192.168.100.10:3000/reports/adjust/AA-2008070002-1.pdf*/}
                                                                                <a tabIndex="0" className="dropdown-item" href={`${HEADERS.URL}reports/adjust/${v.kd_trx}.pdf`} target="_blank">Nota</a>
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
                                    current_page={parseInt(current_page,10)}
                                    per_page={parseInt(per_page,10)}
                                    total={parseInt(total,10)}
                                    callback={this.handlePageChange.bind(this)}
                                />
                            </div>
                            <AdjustmentReportExcel startDate={this.state.startDate} endDate={this.state.endDate} location={this.state.location} />
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