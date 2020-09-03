import React,{Component} from 'react'
import Layout from 'components/App/Layout'
import Paginationq from "helper";
import {FetchSaleReturReport, FetchSaleReturReportExcel} from "redux/actions/sale/sale.action";
import connect from "react-redux/es/connect/connect";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
// import DetailSaleRetur from "components/App/modals/report/inventory/sale_retur_report/detail_sale_retur";
import SaleReturReportExcel from "components/App/modals/report/sale/form_sale_retur_excel";
// import ApproveSaleRetur from "components/App/modals/report/inventory/sale_retur_report/approve_sale_retur";
import Select from 'react-select';
import moment from "moment";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import {rangeDate} from "helper";
import Preloader from "Preloader";
class SaleReturReport extends Component{
    constructor(props){
        super(props);
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
        let page=localStorage.page_sale_retur_report;
        this.handleParameter(page!==undefined&&page!==null?page:1);
    }
    componentDidMount(){
        if (localStorage.location_sale_retur_report !== undefined && localStorage.location_sale_retur_report !== '') {
            this.setState({location: localStorage.location_sale_retur_report})
        }
        if (localStorage.any_sale_retur_report !== undefined && localStorage.any_sale_retur_report !== '') {
            this.setState({any: localStorage.any_sale_retur_report})
        }
        if (localStorage.date_from_sale_retur_report !== undefined && localStorage.date_from_sale_retur_report !== null) {
            this.setState({startDate: localStorage.date_from_sale_retur_report})
        }
        if (localStorage.date_to_sale_retur_report !== undefined && localStorage.date_to_sale_retur_report !== null) {
            this.setState({endDate: localStorage.date_to_sale_retur_report})
        }
        if (localStorage.sort_sale_retur_report !== undefined && localStorage.sort_sale_retur_report !== null) {
            this.setState({sort: localStorage.sort_sale_retur_report})
        }
        if (localStorage.filter_sale_retur_report !== undefined && localStorage.filter_sale_retur_report !== null) {
            this.setState({filter: localStorage.filter_sale_retur_report})
        }
        if (localStorage.status_sale_retur_report !== undefined && localStorage.status_sale_retur_report !== null) {
            this.setState({status: localStorage.status_sale_retur_report})
        }
    }
    handlePageChange(pageNumber){
        localStorage.setItem("page_sale_retur_report",pageNumber);
        this.props.dispatch(FetchSaleReturReport(pageNumber))
    }
    handleEvent = (event, picker) => {
        const awal = picker.startDate._d.toISOString().substring(0,10);
        const akhir = picker.endDate._d.toISOString().substring(0,10);
        localStorage.setItem("date_from_sale_retur_report",`${awal}`);
        localStorage.setItem("date_to_sale_retur_report",`${akhir}`);
        this.setState({
            startDate:awal,
            endDate:akhir
        });
    };
    handleSearch(e){
        e.preventDefault();
        localStorage.setItem("any_sale_retur_report",this.state.any);
        this.handleParameter(1);
    }
    handleParameter(pageNumber){
        let dateFrom=localStorage.date_from_sale_retur_report;
        let dateTo=localStorage.date_to_sale_retur_report;
        let lokasi = localStorage.location_sale_retur_report;
        let any = localStorage.any_sale_retur_report;
        let sort=localStorage.sort_sale_retur_report;
        let filter=localStorage.filter_sale_retur_report;
        let status=localStorage.status_sale_retur_report;
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
            where+=`&search=${any}`
        }
        this.setState({
            where_data:where
        })
        localStorage.setItem("where_sale_retur_report",pageNumber);
        this.props.dispatch(FetchSaleReturReport(pageNumber,where))
        // this.props.dispatch(FetchSaleReturReportExcel(pageNumber,where))
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
            {kode:"kd_trx",value: "Kode Trx"},
            {kode:"tgl",value: "Tanggal"},
            {kode:"nama",value: "Nama"},
            {kode:"nilai_retur",value: "Nilai Retur"},
            {kode:"diskon_item",value: "Diskon Item"},
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
            // localStorage.setItem('status_sale_retur_report',this.state.status===''||this.state.status===undefined?status[0].kode:localStorage.status_sale_retur_report)
            localStorage.setItem('sort_sale_retur_report',this.state.sort===''||this.state.sort===undefined?sort[0].kode:localStorage.sort_sale_retur_report)
            localStorage.setItem('filter_sale_retur_report',this.state.filter===''||this.state.filter===undefined?filter[0].kode:localStorage.filter_sale_retur_report)
        }
    }
    HandleChangeLokasi(lk) {
        this.setState({
            location: lk.value
        })
        localStorage.setItem('location_sale_retur_report', lk.value);
    }
    handleChange(event){
        this.setState({ [event.target.name]: event.target.value });
    }

    HandleChangeSort(sr) {
        this.setState({
            sort: sr.value,
        });
        localStorage.setItem('sort_sale_retur_report', sr.value);
    }
    HandleChangeFilter(fl) {
        this.setState({
            filter: fl.value,
        });
        localStorage.setItem('filter_sale_retur_report', fl.value);
    }
    HandleChangeStatus(st) {
        this.setState({
            status: st.value,
        });
        localStorage.setItem('status_sale_retur_report', st.value);
    }
    toggleModal(e,total,perpage) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        // let range = total*perpage;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formSaleReturExcel"));
        this.props.dispatch(FetchSaleReturReportExcel(1,this.state.where_data,total));
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
        } = this.props.sale_returReport;
        
        return (
            <Layout page="Laporan SaleRetur">
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
                                            <input type="text" className="form-control" value={`${this.state.startDate} to ${this.state.endDate}`} style={{padding: '10px',width: '185px',fontWeight:'bolder'}}/>
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
                                {/* <div className="col-6 col-xs-6 col-md-2">
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
                                <div className="col-6 col-xs-6 col-md-2">
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
                                        {/* <th className="text-black" style={columnStyle} rowSpan="2">#</th> */}
                                        <th className="text-black" style={columnStyle} rowSpan="2">Kode Trx</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Tanggal</th>
                                        {/* <th className="text-black" style={columnStyle} rowSpan="2">kasir</th> */}
                                        <th className="text-black" style={columnStyle} rowSpan="2">Nama</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Nilai Retur</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Diskon Item</th>
                                        {/* <th className="text-black" style={columnStyle} rowSpan="2">Lokasi</th> */}
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
                                                                    {/* <td style={columnStyle}>
                                                                        <div className="btn-group">
                                                                            <button className="btn btn-primary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                Action
                                                                            </button>
                                                                            <div className="dropdown-menu">
                                                                                <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.handleEdit(e,v.kd_brg)}>Export</a>
                                                                                <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.handleDelete(e,v.no_nota)}>Delete</a>
                                                                                <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.toggle(e,v.kd_produksi,'','')}>Detail</a>
                                                                                <a className="dropdown-item" href="javascript:void(0)" style={{display:v.status===0?'block':'none'}} onClick={(e)=>this.approve(e,v.kd_produksi,v.hpp,v.qty_estimasi)}>Approve</a>
                                                                            </div>
                                                                        </div>
                                                                    </td> */}
                                                                    <td style={columnStyle}>{v.kd_trx}</td>
                                                                    <td style={columnStyle}>{moment(v.tgl).format("DD-MM-YYYY")}</td>
                                                                    {/* <td style={columnStyle}>{v.kd_kasir}</td> */}
                                                                    <td style={columnStyle}>{v.nama}</td>
                                                                    <td style={columnStyle}>{v.nilai_retur}</td>
                                                                    <td style={columnStyle}>{v.diskon_item}</td>
                                                                    {/* <td style={columnStyle}>{v.lokasi}</td> */}

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
                            {/* <DetailSaleRetur sale_returDetail={this.props.sale_returDetail}/> */}
                            <SaleReturReportExcel startDate={this.state.startDate} endDate={this.state.endDate} />
                            {/* <ApproveSaleRetur/> */}
                        </div>
                    </div>
                </div>
            </Layout>
            );
    }
}

const mapStateToProps = (state) => {
    
    return {
        sale_returReport:state.saleReducer.sale_retur_data,
        isLoadingDetail: state.saleReducer.isLoadingDetail,
        auth:state.auth,
        isLoading: state.saleReducer.isLoading,
        // sale_returDetail:state.sale_returReducer.report_data,
        sale_returReportExcel:state.saleReducer.sale_retur_export,
        // isLoadingDetailSatuan: state.stockReportReducer.isLoadingDetailSatuan,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(SaleReturReport);