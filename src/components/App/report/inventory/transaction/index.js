import React,{Component} from 'react'
import Layout from 'components/App/Layout'
import Paginationq from "helper";
import {FetchTransaction, FetchTransactionExcel, FetchTransactionData} from "redux/actions/inventory/transaction.action";
import {rePrintFaktur} from "redux/actions/inventory/mutation.action";
import connect from "react-redux/es/connect/connect";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import DetailTransaction from "components/App/modals/report/inventory/transaction_report/detail_transaction";
import TransactionReportExcel from "components/App/modals/report/inventory/transaction_report/form_transaction_excel";
import Select from 'react-select';
import moment from "moment";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import {rangeDate} from "helper";
import Preloader from "Preloader";
import {statusQ,toRp} from "helper";
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';
import { Link } from 'react-router-dom';
class TransactionReport extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.HandleChangeSort = this.HandleChangeSort.bind(this);
        this.HandleChangeFilter = this.HandleChangeFilter.bind(this);
        this.HandleChangeStatus = this.HandleChangeStatus.bind(this);
        this.handleRePrint = this.handleRePrint.bind(this);
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
        let page=localStorage.page_transaction_report;
        this.handleParameter(page!==undefined&&page!==null?page:1);
    }
    componentDidMount(){
        if (localStorage.location_transaction_report !== undefined && localStorage.location_transaction_report !== '') {
            this.setState({location: localStorage.location_transaction_report})
        }
        if (localStorage.any_transaction_report !== undefined && localStorage.any_transaction_report !== '') {
            this.setState({any: localStorage.any_transaction_report})
        }
        if (localStorage.date_from_transaction_report !== undefined && localStorage.date_from_transaction_report !== null) {
            this.setState({startDate: localStorage.date_from_transaction_report})
        }
        if (localStorage.date_to_transaction_report !== undefined && localStorage.date_to_transaction_report !== null) {
            this.setState({endDate: localStorage.date_to_transaction_report})
        }
        if (localStorage.sort_transaction_report !== undefined && localStorage.sort_transaction_report !== null) {
            this.setState({sort: localStorage.sort_transaction_report})
        }
        if (localStorage.filter_transaction_report !== undefined && localStorage.filter_transaction_report !== null) {
            this.setState({filter: localStorage.filter_transaction_report})
        }
        if (localStorage.status_transaction_report !== undefined && localStorage.status_transaction_report !== null) {
            this.setState({status: localStorage.status_transaction_report})
        }
    }
    handlePageChange(pageNumber){
        localStorage.setItem("page_transaction_report",pageNumber);
        this.props.dispatch(FetchTransaction(pageNumber))
    }
    toggle(e,code,barcode,name){
        e.preventDefault();
        localStorage.setItem("code",code);
        localStorage.setItem("barcode",barcode);
        localStorage.setItem("name",name);
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("detailTransaction"));
        this.props.dispatch(FetchTransactionData(1,code))
    };
    handleEvent = (event, picker) => {
        const awal = moment(picker.startDate._d).format('YYYY-MM-DD');
        const akhir = moment(picker.endDate._d).format('YYYY-MM-DD');
        localStorage.setItem("date_from_transaction_report",`${awal}`);
        localStorage.setItem("date_to_transaction_report",`${akhir}`);
        this.setState({
            startDate:awal,
            endDate:akhir
        });
    };
    handleSearch(e){
        e.preventDefault();
        localStorage.setItem("any_transaction_report",this.state.any);
        this.handleParameter(1);
    }
    handleParameter(pageNumber){
        let dateFrom=localStorage.date_from_transaction_report;
        let dateTo=localStorage.date_to_transaction_report;
        // let lokasi = localStorage.location_transaction_report;
        let any = localStorage.any_transaction_report;
        let sort=localStorage.sort_transaction_report;
        let filter=localStorage.filter_transaction_report;
        // let status=localStorage.status_transaction_report;
        let where='';
        if(dateFrom!==undefined&&dateFrom!==null){
            where+=`&datefrom=${dateFrom}&dateto=${dateTo}`;
        }
        // if(lokasi!==undefined&&lokasi!==null&&lokasi!==''){
        //     where+=`&lokasi=${lokasi}`;
        // }
        // if(status!==undefined&&status!==null&&status!==''){
        //     where+=`&status=${status}`;
        // }
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
        this.props.dispatch(FetchTransaction(pageNumber,where))
        // this.props.dispatch(FetchTransactionExcel(pageNumber,where))
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
            {kode:"no_faktur_mutasi",value: "Kode Mutasi"},
            {kode:"tgl_mutasi",value: "Tanggal"},
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
        // let status = [
        //     {kode:"",value: "Default"},
        //     {kode:"0",value: "0"},
        //     {kode:"1",value: "1"},
        //     {kode:"2",value: "2"},
        // ];
        // let data_status=[];
        // status.map((i) => {
        //     data_status.push({
        //         value: i.kode,
        //         label: i.value
        //     });
        // });
        this.setState({
            sort_data: data_sort,
            filter_data: data_filter,
            // status_data: data_status,
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
    
        // localStorage.setItem('status_transaction_report',this.state.status===''||this.state.status===undefined?status[0].kode:localStorage.status_transaction_report)
        localStorage.setItem('sort_transaction_report',this.state.sort===''||this.state.sort===undefined?sort[0].kode:localStorage.sort_transaction_report)
        localStorage.setItem('filter_transaction_report',this.state.filter===''||this.state.filter===undefined?filter[0].kode:localStorage.filter_transaction_report)
    }
    HandleChangeLokasi(lk) {
        this.setState({
            location: lk.value
        })
        localStorage.setItem('location_transaction_report', lk.value);
    }
    handleChange(event){
        this.setState({ [event.target.name]: event.target.value });
    }

    HandleChangeSort(sr) {
        this.setState({
            sort: sr.value,
        });
        localStorage.setItem('sort_transaction_report', sr.value);
    }
    HandleChangeFilter(fl) {
        this.setState({
            filter: fl.value,
        });
        localStorage.setItem('filter_transaction_report', fl.value);
    }
    HandleChangeStatus(st) {
        this.setState({
            status: st.value,
        });
        localStorage.setItem('status_transaction_report', st.value);
    }

    toggleModal(e,total,perpage) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        // let range = total*perpage;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formTransactionExcel"));
        this.props.dispatch(FetchTransactionExcel(1,this.state.where_data,total));
    }

    handleRePrint(e,id){
        e.preventDefault();
        this.props.dispatch(rePrintFaktur(id));
    }
    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        const {
            per_page,
            last_page,
            current_page,
            // from,
            // to,
            total_periode,
            data,
            // total
        } = this.props.transactionReport;
        let ns=0;let hp=0;let pr=0;
        return (
            <Layout page="Laporan Alokasi Transaksi">
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
                                                    <i className="fa fa-print"/> Export
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                            <div style={{overflowX: "auto"}}>
                                <table className="table table-hover table-bordered">
                                    <thead className="bg-light">
                                    <tr>
                                        <th className="text-black" style={columnStyle} rowSpan="2">No</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">#</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Kode Faktur</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Tanggal Mutasi</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Lokasi Asal</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Lokasi Tujuan</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Net Sales</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Hpp</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Profit</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Status Penerimaan</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Status Pembayaran</th>
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
                                                            ns+=parseInt(v.net_sales,10);
                                                            hp+=parseInt(v.hpp,10);
                                                            pr+=parseInt(v.profit,10);
                                                            return(
                                                                <tr key={i}>
                                                                    <td style={columnStyle}> {i+1 + (10 * (parseInt(current_page,10)-1))}</td>

                                                                    <td style={columnStyle}>
                                                                        <div className="btn-group">
                                                                            <UncontrolledButtonDropdown>
                                                                                <DropdownToggle caret>
                                                                                    Aksi
                                                                                </DropdownToggle>
                                                                                <DropdownMenu>
                                                                                    <DropdownItem onClick={(e)=>this.toggle(e,v.no_faktur_mutasi,'','')}>Detail</DropdownItem>
                                                                                    {v.status==='0'?<Link to={`../edit/alokasi/${btoa(v.no_faktur_mutasi)}`}><DropdownItem>Edit</DropdownItem></Link>:''}
                                                                                    <Link to={`../alokasi3ply/${v.no_faktur_mutasi}`} target="_blank"><DropdownItem>3ply</DropdownItem></Link>
                                                                                    <DropdownItem onClick={(e)=>this.handleRePrint(e,v.no_faktur_mutasi)}>Print Faktur</DropdownItem>
                                                                                </DropdownMenu>
                                                                                </UncontrolledButtonDropdown>
                                                                        </div>
                                                                    </td>
                                                                    <td style={columnStyle}>{v.no_faktur_mutasi}</td>
                                                                    <td style={columnStyle}>{moment(v.tgl_mutasi).format("DD-MM-YYYY")}</td>
                                                                    <td style={columnStyle}>{v.lokasi_asal}</td>
                                                                    <td style={columnStyle}>{v.lokasi_tujuan}</td>
                                                                    <td style={columnStyle}>{toRp(v.net_sales)}</td>
                                                                    <td style={columnStyle}>{toRp(v.hpp)}</td>
                                                                    <td style={columnStyle}>{toRp(v.profit)}</td>
                                                                    <td style={columnStyle}>{
                                                                        v.status==='0'?statusQ('info','Dikirim'):(v.status==='1'?statusQ('success','Diterima'):"")
                                                                        // v.status===0?statusQ('danger','proses'):(v.status===1?statusQ('warning','packing')?(v.status===2?statusQ('info','dikirim'):statusQ('info','diterima')):""):""
                                                                    }</td>
                                                                    <td style={columnStyle}>{
                                                                        String(v.status_transaksi)==='0'?statusQ('info','Belum Lunas'):(String(v.status_transaksi)==='1'?statusQ('success','Lunas'):"")
                                                                        // v.status===0?statusQ('danger','proses'):(v.status===1?statusQ('warning','packing')?(v.status===2?statusQ('info','dikirim'):statusQ('info','diterima')):""):""
                                                                    }</td>
                                                                    <td style={columnStyle}>{v.keterangan}</td>

                                                                </tr>
                                                            )
                                                        })
                                                        : "No data." : "No data."
                                                )
                                            }
                                            
                                            </tbody>
                                        ):<Preloader/>
                                    }
                                    <tfoot>
                                        <tr style={{backgroundColor:"#EEEEEE"}}>
                                            <td colSpan="6">TOTAL PERPAGE</td>
                                            <td style={{textAlign:"right"}}>{toRp(ns)}</td>
                                            <td style={{textAlign:"right"}}>{toRp(hp)}</td>
                                            <td style={{textAlign:"right"}}>{toRp(pr)}</td>
                                            <td colSpan="3"></td>
                                        </tr>
                                        <tr style={{backgroundColor:"#EEEEEE"}}>
                                            <td colSpan="6">TOTAL</td>
                                            <td style={{textAlign:"right"}}>{toRp(total_periode!==undefined?total_periode.net_sales:0)}</td>
                                            <td style={{textAlign:"right"}}>{toRp(total_periode!==undefined?total_periode.hpp:0)}</td>
                                            <td style={{textAlign:"right"}}>{toRp(total_periode!==undefined?total_periode.profit:0)}</td>
                                            <td colSpan="3"></td>
                                        </tr>
                                    </tfoot>
                                </table>

                            </div>
                            <div style={{"marginTop":"20px","float":"right"}}>
                                <Paginationq
                                    current_page={current_page}
                                    per_page={per_page}
                                    total={(last_page*per_page)}
                                    callback={this.handlePageChange.bind(this)}
                                />
                            </div>
                            <DetailTransaction transactionDetail={this.props.transactionDetail}/>
                            <TransactionReportExcel startDate={this.state.startDate} endDate={this.state.endDate} />
                        </div>
                    </div>
                </div>
            </Layout>
            );
    }
}

const mapStateToProps = (state) => {
    
    return {
        transactionReport:state.transactionReducer.report,
        isLoadingDetail: state.transactionReducer.isLoadingApproval,
        auth:state.auth,
        isLoading: state.transactionReducer.isLoadingApproval,
        transactionDetail:state.transactionReducer.report_data,
        transactionReportExcel:state.transactionReducer.report_excel,
        // isLoadingDetailSatuan: state.stockReportReducer.isLoadingDetailSatuan,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(TransactionReport);