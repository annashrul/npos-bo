import React,{Component} from 'react'
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import Select from "react-select";
import Paginationq from "helper";
import Preloader from "Preloader";
import {rangeDate, toRp} from "helper";
import {
    FetchReportSaleBySales,
    FetchReportDetailSaleBySales
} from "redux/actions/sale/sale_by_sales.action";
import Details from "../../modals/report/sale/detail_sale_by_sales_report";
import {ModalToggle, ModalType} from "redux/actions/modal.action";

class SaleBySalesArchive extends Component{
    constructor(props){
        super(props);
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.HandleChangeType = this.HandleChangeType.bind(this);
        this.handleEvent = this.handleEvent.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDetail = this.handleDetail.bind(this);
        this.HandleChangeFilter = this.HandleChangeFilter.bind(this);
        this.HandleChangeStatus = this.HandleChangeStatus.bind(this);
        this.state={
            where_data:"",
            type_data:[],
            type:"",
            location_data:[],
            location:"",
            any_sale_by_sales_report:"",
            startDate:moment(new Date()).format("yyyy-MM-DD"),
            endDate:moment(new Date()).format("yyyy-MM-DD"),
            sort:"",
            sort_data:[],
            filter:"",
            filter_data:[{
                value:'qty|DESC',
                label:'Qty Terbesar'
            }, {
                value: 'qty|ASC',
                label: 'Qty Terkecil'
            }, {
                value: 'gross_sales|DESC',
                label: 'Gross Sales Terbesar'
            }, {
                value: 'gross_sales|ASC',
                label: 'Gross Sales Terkecil'
            }, {
                value: 'diskon_item|DESC',
                label: 'Diskon Item Terbesar'
            }, {
                value: 'diskon_item|ASC',
                label: 'Diskon Item Terkecil'
            }],
            status:"",
            status_data:[],
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.auth.user) {
            let lk = [{
                value: "",
                label: "Semua Lokasi"
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
        let page=localStorage.getItem("pageNumber_sale_by_sales_report");
        this.checkingParameter(page===undefined&&page===null?1:page);
    }
    componentDidMount(){
        if (localStorage.location_sale_by_sales_report !== undefined && localStorage.location_sale_by_sales_report !== '') {
            this.setState({
                location: localStorage.location_sale_by_sales_report
            })
        }

        if (localStorage.any_sale_by_sales_report !== undefined && localStorage.any_sale_by_sales_report !== '') {
            this.setState({
                any: localStorage.any_sale_by_sales_report
            })
        }
        if (localStorage.date_from_sale_by_sales_report !== undefined && localStorage.date_from_sale_by_sales_report !== null) {
            this.setState({
                startDate: localStorage.date_from_sale_by_sales_report
            })
        }
        if (localStorage.date_to_sale_by_sales_report !== undefined && localStorage.date_to_sale_by_sales_report !== null) {
            this.setState({
                endDate: localStorage.date_to_sale_by_sales_report
            })
        }

        if (localStorage.filter_sale_by_sales_report !== undefined && localStorage.filter_sale_by_sales_report !== null) {
            this.setState({filter: localStorage.filter_sale_by_sales_report})
        }
        if (localStorage.status_sale_by_sales_report !== undefined && localStorage.status_sale_by_sales_report !== null) {
            this.setState({status: localStorage.status_sale_by_sales_report})
        }
    }
    handleChange(event){
        this.setState({ [event.target.name]: event.target.value });
    }
    HandleChangeType(type) {
        this.setState({
            type: type.value,
        });
        localStorage.setItem('type_sale_by_sales_report', type.value);
    }
    HandleChangeLokasi(lk) {
        this.setState({
            location: lk.value,
        });
        localStorage.setItem('location_sale_by_sales_report', lk.value);
    }
    handleEvent = (event, picker) => {
        const awal = moment(picker.startDate._d).format('YYYY-MM-DD');
        const akhir = moment(picker.endDate._d).format('YYYY-MM-DD');
        localStorage.setItem("date_from_sale_by_sales_report",`${awal}`);
        localStorage.setItem("date_to_sale_by_sales_report",`${akhir}`);
        this.setState({
            startDate:awal,
            endDate:akhir
        });
    };
    handleSearch(e){
        e.preventDefault();
        localStorage.setItem("any_sale_by_sales_report",this.state.any_sale_by_sales_report);
        this.checkingParameter(1);
    }
    checkingParameter(pageNumber){
        let where='';
        let dateFrom=localStorage.getItem("date_from_sale_by_sales_report");
        let dateTo=localStorage.getItem("date_to_sale_by_sales_report");
        let any=localStorage.getItem("any_sale_by_sales_report");
        let filter = localStorage.filter_sale_by_sales_report;
        let lokasi = localStorage.location_sale_by_sales_report;
        if(dateFrom!==undefined&&dateFrom!==null){
            if(where!==''){where+='&'}where+=`datefrom=${dateFrom}&dateto=${dateTo}`
        }else{
            if(where!==''){where+='&'}where+=`datefrom=${this.state.startDate}&dateto=${this.state.endDate}`
        }
        if(lokasi!==undefined&&lokasi!==null&&lokasi!==''){
            if(where!==''){where+='&'}where+=`lokasi=${lokasi}`
        }
        
        if(filter!==undefined&&filter!==null&&filter!==''){
            if(where!==''){where+='&'}where+=`sort=${filter}`;
        }
        if(any!==undefined&&any!==null&&any!==''){
            if(where!==''){where+='&'}where+=`q=${any}`
        }
        this.setState({
            where_data:where
        })
        localStorage.setItem("where_sale_by_sales_report",pageNumber);
        this.props.dispatch(FetchReportSaleBySales(pageNumber === null ? 1 : pageNumber, where));
        // this.props.dispatch(FetchReportSaleBySalesExcel(pageNumber===null?1:pageNumber,where));
    }
    handlePageChange(pageNumber){
        localStorage.setItem("pageNumber_sale_by_sales_report",pageNumber);
        this.checkingParameter(pageNumber);
    }
    handleDetail(e,kode){
        e.preventDefault();

        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("detailSaleBySalesReport"));
        let where=''
        let dateFrom = localStorage.getItem("date_from_sale_by_sales_report");
        let dateTo = localStorage.getItem("date_to_sale_by_sales_report");
        let lokasi = localStorage.location_sale_by_sales_report;

        if(dateFrom!==undefined&&dateFrom!==null){
            if(where!==''){where+='&'}where+=`datefrom=${dateFrom}&dateto=${dateTo}`
        }else{
            if(where!==''){where+='&'}where+=`datefrom=${this.state.startDate}&dateto=${this.state.endDate}`
        }
        if(lokasi!==undefined&&lokasi!==null&&lokasi!==''){
            if(where!==''){where+='&'}where+=`lokasi=${lokasi}`
        }
        this.props.dispatch(FetchReportDetailSaleBySales(1, btoa(kode), where));
    }

    
    HandleChangeFilter(fl) {
        this.setState({
            filter: fl.value,
        });
        localStorage.setItem('filter_sale_by_sales_report', fl.value);
    }
    HandleChangeStatus(st) {
        this.setState({
            status: st.value,
        });
        localStorage.setItem('status_sale_by_sales_report', st.value);
    }
    toggleModal(e,total,perpage) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        // let range = total*perpage;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formSaleByCustExcel"));
        // this.props.dispatch(FetchReportSaleBySalesExcel(1,this.state.where_data,total));
    }

    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        const {
            // total,
            last_page,
            per_page,
            current_page,
            // from,
            // to,
            data
        } = this.props.data;

        return (
            <Layout page="Laporan Arsip Penjualan">
                <div className="card">
                    <div className="card-header">
                        <h5>Laporan Arsip Penjualan By Sales</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-10">
                                <div className="row">
                                    <div className="col-6 col-xs-6 col-md-3">
                                        <div className="form-group">
                                            <label htmlFor=""> Periode </label>
                                            <DateRangePicker style={{display:'unset'}} ranges={rangeDate} alwaysShowCalendars={true} onEvent={this.handleEvent}>
                                                <input type="text" className="form-control" name="date_sale_by_sales_report" value={`${this.state.startDate} to ${this.state.endDate}`} style={{padding: '9px',fontWeight:'bolder'}}/>
                                            </DateRangePicker>


                                        </div>
                                    </div>
                                    <div className="col-6 col-xs-6 col-md-3">
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
                                    <div className="col-6 col-xs-6 col-md-3">
                                        <div className="form-group">
                                            <label className="control-label font-12">
                                                Lokasi
                                            </label>
                                            <Select
                                                options={this.state.location_data}
                                                // placeholder="Pilih Tipe Kas"
                                                onChange={this.HandleChangeLokasi}
                                                value={
                                                    this.state.location_data.find(op => {
                                                        return op.value === this.state.location
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                  
                                    <div className="col-6 col-xs-6 col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="">Cari</label>
                                            <input type="text" name="any_sale_by_sales_report" className="form-control form-control-lg" value={this.state.any_sale_by_sales_report} onChange={(e)=>this.handleChange(e)}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="row">
                                    <div className="col-12 col-xs-12 col-md-12">
                                        <div className="form-group text-right">
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
                            <div className="col-md-12">
                                <div className="table-responsive" style={{overflowX: "auto",zoom:"85%"}}>

                                    <table className="table table-hover table-bordered">
                                        <thead className="bg-light">

                                        <tr>
                                            {/* <th className="text-black" rowSpan="2" style={columnStyle}>#</th> */}
                                            <th className="text-black" rowSpan="2" style={columnStyle}>No</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Nama</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Lokasi</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Qty</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Gross Sales</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Diskon Item</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Aksi</th>
                                        </tr>
                                        </thead>
                                        {
                                            !this.props.isLoadingReport?(
                                                <tbody>
                                                {
                                                    typeof data==='object'? data.length>0?

                                                        data.map((v,i)=>{
                                                            return (
                                                                <tr key={i}>
                                                                    <td style={columnStyle}> {i+1 + (10 * (parseInt(current_page,10)-1))}</td>

                                                                    <td style={columnStyle}>{v.nama}</td>
                                                                    <td style={columnStyle}>{v.lokasi}</td>
                                                                    <td style={{textAlign:"right"}}>{toRp(parseInt(v.qty,10))}</td>
                                                                    <td style={{textAlign:"right"}}>{toRp(parseInt(v.gross_sales,10))}</td>
                                                                    <td style={{textAlign:"right"}}>{toRp(parseInt(v.diskon_item,10))}</td>
                                                                    <td style={{textAlign:"center"}}>
                                                                        <button className="btn btn-secondary" onClick={event=>this.handleDetail(event,v.kode)}><i className="fa fa-eye"/> Detail</button>
                                                                    </td>
                                                                </tr>
                                                            );


                                                        }) : "No data." : "No data."
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
                                        total={parseInt(last_page*per_page,10)}
                                        callback={this.handlePageChange.bind(this)}
                                    />
                                </div>
                                {/* <SaleByCustReportExcel startDate={this.state.startDate} endDate={this.state.endDate} location={this.state.location} /> */}
                            </div>
                        </div>
                    </div>
                </div>
                <Details />
            </Layout>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        data:state.saleBySalesReducer.data,
        // totalPenjualan:state.saleBySalesReducer.total_penjualan,
        sale_by_custReportExcel:state.saleBySalesReducer.report_excel,
        totalPenjualanExcel:state.saleBySalesReducer.total_penjualan_excel,
        isLoadingReport: state.saleBySalesReducer.isLoadingReport,
        detailSaleByCust:state.saleBySalesReducer.dataDetail,
        isLoadingDetail: state.saleBySalesReducer.isLoadingDetail,
        auth: state.auth
    }
}

export default connect(mapStateToProps)(SaleBySalesArchive)