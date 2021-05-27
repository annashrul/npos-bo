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
    FetchReportSaleOmset,
    FetchReportDetailSaleOmset,
    FetchReportSaleOmsetExcel
} from "redux/actions/sale/sale_omset.action";
import SaleOmsetReportExcel from "../../modals/report/sale/form_sale_omset_excel";
import {ModalToggle, ModalType} from "redux/actions/modal.action";

class SaleOmsetArchive extends Component{
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
            any_sale_omset_report:"",
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
            export:false
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
        let page=localStorage.getItem("pageNumber_sale_omset_report");
        this.checkingParameter(page===undefined&&page===null?1:page);
    }
    componentDidMount(){
        if (localStorage.location_sale_omset_report !== undefined && localStorage.location_sale_omset_report !== '') {
            this.setState({
                location: localStorage.location_sale_omset_report
            })
        }

        if (localStorage.any_sale_omset_report !== undefined && localStorage.any_sale_omset_report !== '') {
            this.setState({
                any: localStorage.any_sale_omset_report
            })
        }
        if (localStorage.date_from_sale_omset_report !== undefined && localStorage.date_from_sale_omset_report !== null) {
            this.setState({
                startDate: localStorage.date_from_sale_omset_report
            })
        }
        if (localStorage.date_to_sale_omset_report !== undefined && localStorage.date_to_sale_omset_report !== null) {
            this.setState({
                endDate: localStorage.date_to_sale_omset_report
            })
        }

        if (localStorage.filter_sale_omset_report !== undefined && localStorage.filter_sale_omset_report !== null) {
            this.setState({filter: localStorage.filter_sale_omset_report})
        }
        if (localStorage.status_sale_omset_report !== undefined && localStorage.status_sale_omset_report !== null) {
            this.setState({status: localStorage.status_sale_omset_report})
        }
    }
    handleChange(event){
        this.setState({ [event.target.name]: event.target.value });
    }
    HandleChangeType(type) {
        this.setState({
            type: type.value,
        });
        localStorage.setItem('type_sale_omset_report', type.value);
    }
    HandleChangeLokasi(lk) {
        this.setState({
            location: lk.value,
        });
        localStorage.setItem('location_sale_omset_report', lk.value);
    }
    handleEvent = (event, picker) => {
        const awal = moment(picker.startDate._d).format('YYYY-MM-DD');
        const akhir = moment(picker.endDate._d).format('YYYY-MM-DD');
        localStorage.setItem("date_from_sale_omset_report",`${awal}`);
        localStorage.setItem("date_to_sale_omset_report",`${akhir}`);
        this.setState({
            startDate:awal,
            endDate:akhir
        });
    };
    handleSearch(e){
        e.preventDefault();
        localStorage.setItem("any_sale_omset_report",this.state.any_sale_omset_report);
        this.checkingParameter(1);
    }
    checkingParameter(pageNumber){
        let where='';
        let dateFrom=localStorage.getItem("date_from_sale_omset_report");
        let dateTo=localStorage.getItem("date_to_sale_omset_report");
        let any=localStorage.getItem("any_sale_omset_report");
        let filter = localStorage.filter_sale_omset_report;
        let lokasi = localStorage.location_sale_omset_report;
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
        localStorage.setItem("where_sale_omset_report",pageNumber);
        this.props.dispatch(FetchReportSaleOmset(pageNumber === null ? 1 : pageNumber, where));
        // this.props.dispatch(FetchReportSaleOmsetExcel(pageNumber===null?1:pageNumber,where));
    }
    handlePageChange(pageNumber){
        localStorage.setItem("pageNumber_sale_omset_report",pageNumber);
        this.checkingParameter(pageNumber);
    }
    handleDetail(e,kode){
        e.preventDefault();

        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("detailSaleOmsetReport"));
        let where=''
        let dateFrom = localStorage.getItem("date_from_sale_omset_report");
        let dateTo = localStorage.getItem("date_to_sale_omset_report");
        let lokasi = localStorage.location_sale_omset_report;

        if(dateFrom!==undefined&&dateFrom!==null){
            if(where!==''){where+='&'}where+=`datefrom=${dateFrom}&dateto=${dateTo}`
        }else{
            if(where!==''){where+='&'}where+=`datefrom=${this.state.startDate}&dateto=${this.state.endDate}`
        }
        if(lokasi!==undefined&&lokasi!==null&&lokasi!==''){
            if(where!==''){where+='&'}where+=`lokasi=${lokasi}`
        }
        this.props.dispatch(FetchReportDetailSaleOmset(1, btoa(kode), where));
    }

    
    HandleChangeFilter(fl) {
        this.setState({
            filter: fl.value,
        });
        localStorage.setItem('filter_sale_omset_report', fl.value);
    }
    HandleChangeStatus(st) {
        this.setState({
            status: st.value,
        });
        localStorage.setItem('status_sale_omset_report', st.value);
    }
    toggleModal(e,total,perpage) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        // let range = total*perpage;
        this.setState({export:true})
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formSaleOmsetExcel"));
        this.props.dispatch(FetchReportSaleOmsetExcel(1,this.state.where_data,total));
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
            data,
            total_data
        } = this.props.data;

        let tot_qty = 0;
        let tot_gross_sales = 0;
        let tot_net_sales = 0;
        let tot_grand_total = 0;
        let tot_diskon_item = 0;
        let tot_diskon_trx = 0;
        let tot_tax = 0;
        let tot_service = 0;

        return (
            <Layout page="Laporan Arsip Penjualan">
                <div className="card">
                    <div className="card-header">
                        <h5>Laporan Omset Penjualan</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-10">
                                <div className="row">
                                    <div className="col-6 col-xs-6 col-md-3">
                                        <div className="form-group">
                                            <label htmlFor=""> Periode </label>
                                            <DateRangePicker style={{display:'unset'}} ranges={rangeDate} alwaysShowCalendars={true} onEvent={this.handleEvent}>
                                                <input type="text" className="form-control" name="date_sale_omset_report" value={`${this.state.startDate} to ${this.state.endDate}`} style={{padding: '9px',fontWeight:'bolder'}}/>
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
                                    {/* <div className="col-6 col-xs-6 col-md-3">
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
                                    </div> */}
                                  
                                    <div className="col-6 col-xs-6 col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="">Cari</label>
                                            <input type="text" name="any_sale_omset_report" className="form-control form-control-lg" value={this.state.any_sale_omset_report} onChange={(e)=>this.handleChange(e)}/>
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
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Tanggal</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>QTY</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Gross Sale</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Net Sale</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Diskon Item</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Diskon Trx</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>TAX</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Service</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Grand Total</th>
                                        </tr>
                                        </thead>
                                        {
                                            !this.props.isLoadingReport?(
                                                <tbody>
                                                {
                                                    typeof data==='object'? data.length>0?

                                                        data.map((v,i)=>{
                                                            tot_qty = tot_qty + parseFloat(v.qty);
                                                            tot_gross_sales = tot_gross_sales+parseFloat(v.gross_sales);
                                                            tot_net_sales = tot_net_sales+parseFloat(v.net_sales);
                                                            tot_grand_total = tot_grand_total+parseFloat(v.grand_total);
                                                            tot_diskon_item = tot_diskon_item+parseFloat(v.diskon_item);
                                                            tot_diskon_trx = tot_diskon_trx+parseFloat(v.diskon_trx);
                                                            tot_tax = tot_tax+parseFloat(v.tax);
                                                            tot_service = tot_service+parseFloat(v.service);
                                                            return (
                                                                <tr key={i}>
                                                                    <td style={columnStyle}> {i+1 + (10 * (parseInt(current_page,10)-1))}</td>

                                                                    <td style={columnStyle}>{moment(v.tanggal).format('YYYY-MM-DD')}</td>
                                                                    <td style={columnStyle}>{parseFloat(v.qty).toFixed(2)}</td>
                                                                    <td style={{textAlign:"right"}}>{toRp(parseFloat(v.gross_sales).toFixed(2))}</td>
                                                                    <td style={{textAlign:"right"}}>{toRp(parseFloat(v.net_sales).toFixed(2))}</td>
                                                                    <td style={{textAlign:"right"}}>{toRp(parseFloat(v.diskon_item).toFixed(2))}</td>
                                                                    <td style={{textAlign:"right"}}>{toRp(parseFloat(v.diskon_trx).toFixed(2))}</td>
                                                                    <td style={{textAlign:"right"}}>{toRp(parseFloat(v.tax).toFixed(2))}</td>
                                                                    <td style={{textAlign:"right"}}>{toRp(parseFloat(v.service).toFixed(2))}</td>
                                                                    <td style={{textAlign:"right"}}>{toRp(parseFloat(v.grand_total).toFixed(2))}</td>
                                                                </tr>
                                                            );


                                                        }) : "No data." : "No data."
                                                }
                                                </tbody>
                                            ):<Preloader/>
                                        }
                                        {
                                            total_data!==undefined&&total_data.qty!==undefined?(
                                                <tfoot className="bg-light">
                                                    <tr>
                                                        <td style={columnStyle} colSpan={2}> Total Perpage</td>

                                                        <td style={columnStyle}>{parseFloat(tot_qty).toFixed(2)}</td>
                                                        <td style={{textAlign:"right"}}>{toRp(parseFloat(tot_gross_sales).toFixed(2))}</td>
                                                        <td style={{textAlign:"right"}}>{toRp(parseFloat(tot_net_sales).toFixed(2))}</td>
                                                        <td style={{textAlign:"right"}}>{toRp(parseFloat(tot_diskon_item).toFixed(2))}</td>
                                                        <td style={{textAlign:"right"}}>{toRp(parseFloat(tot_diskon_trx).toFixed(2))}</td>
                                                        <td style={{textAlign:"right"}}>{toRp(parseFloat(tot_tax).toFixed(2))}</td>
                                                        <td style={{textAlign:"right"}}>{toRp(parseFloat(tot_service).toFixed(2))}</td>
                                                        <td style={{textAlign:"right"}}>{toRp(parseFloat(tot_grand_total).toFixed(2))}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={columnStyle} colSpan={2}> Total</td>

                                                        <td style={columnStyle}>{parseFloat(total_data.qty).toFixed(2)}</td>
                                                        <td style={{textAlign:"right"}}>{toRp(parseFloat(total_data.gross_sales).toFixed(2))}</td>
                                                        <td style={{textAlign:"right"}}>{toRp(parseFloat(total_data.net_sales).toFixed(2))}</td>
                                                        <td style={{textAlign:"right"}}>{toRp(parseFloat(total_data.grand_total).toFixed(2))}</td>
                                                        <td style={{textAlign:"right"}}>{toRp(parseFloat(total_data.diskon_item).toFixed(2))}</td>
                                                        <td style={{textAlign:"right"}}>{toRp(parseFloat(total_data.diskon_trx).toFixed(2))}</td>
                                                        <td style={{textAlign:"right"}}>{toRp(parseFloat(total_data.tax).toFixed(2))}</td>
                                                        <td style={{textAlign:"right"}}>{toRp(parseFloat(total_data.service).toFixed(2))}</td>
                                                    </tr>
                                                </tfoot>
                                            ):''
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
                                {this.props.sale_omsetReportExcel.data!==undefined&&this.props.sale_omsetReportExcel.data.length>0?
                                <SaleOmsetReportExcel startDate={this.state.startDate} endDate={this.state.endDate} location={this.state.location} />:''
                            }
                            </div>
                        </div>
                    </div>
                </div>
                {/* <Details /> */}
            </Layout>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        data:state.saleOmsetReducer.data,
        // totalPenjualan:state.saleOmsetReducer.total_penjualan,
        sale_omsetReportExcel:state.saleOmsetReducer.report_excel,
        totalPenjualanExcel:state.saleOmsetReducer.total_penjualan_excel,
        isLoadingReport: state.saleOmsetReducer.isLoadingReport,
        detailSaleByCust:state.saleOmsetReducer.dataDetail,
        isLoadingDetail: state.saleOmsetReducer.isLoadingDetail,
        auth: state.auth
    }
}

export default connect(mapStateToProps)(SaleOmsetArchive)