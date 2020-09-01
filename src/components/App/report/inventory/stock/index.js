import React,{Component} from 'react'
import Layout from 'components/App/Layout'
import {FetchStockReport,FetchStockReportExcel} from "redux/actions/report/inventory/stock_report.action";
import connect from "react-redux/es/connect/connect";
import DetailStockReportSatuan from "components/App/modals/report/inventory/stock_report/detail_stock_report_satuan";
import StockReportExcel from "components/App/modals/report/inventory/stock_report/form_stock_report_excel";
import moment from "moment";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import {FetchStockReportDetailSatuan} from "redux/actions/report/inventory/stock_report.action";
import DateRangePicker from "react-bootstrap-daterangepicker";
import {rangeDate} from "helper";
import Select from "react-select";
import Preloader from "Preloader";
import {HEADERS} from "redux/actions/_constants";
import Paginationq from "helper";
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';

class InventoryReport extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.HandleChangeStock = this.HandleChangeStock.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleEvent = this.handleEvent.bind(this);
        this.HandleChangeSearchBy = this.HandleChangeSearchBy.bind(this);
        this.state={
            where_data:"",
            isSelected:false,
            location:"",
            location_data:[],
            status_data: [],
            status:"",
            any:"",
            startDate:moment(new Date()).format("yyyy-MM-DD"),
            endDate:moment(new Date()).format("yyyy-MM-DD"),
            search_by:"",
            search_by_data:[],
        }
    }
    componentDidMount(){
        if (localStorage.lk_stock_report !== undefined && localStorage.lk_stock_report !== '') {
            this.setState({
                location: localStorage.lk_stock_report
            })
        }

        if (localStorage.st_stock_report !== undefined && localStorage.st_stock_report !== null) {
            this.setState({
                status: localStorage.st_stock_report
            })
        }
        if (localStorage.search_by_stock_report !== undefined && localStorage.search_by_stock_report !== null) {
            this.setState({
                search_by: localStorage.search_by_stock_report
            })
        }
        if (localStorage.any_stock_report !== undefined && localStorage.any_stock_report !== null) {
            this.setState({
                any: localStorage.any_stock_report
            })
        }
        if (localStorage.date_from_stock_report !== undefined && localStorage.date_from_stock_report !== null) {
            this.setState({
                startDate: localStorage.date_from_stock_report
            })
        }
        if (localStorage.date_to_stock_report !== undefined && localStorage.date_to_stock_report !== null) {
            this.setState({
                endDate: localStorage.date_to_stock_report
            })
        }
    }
    componentWillMount(){
        let pageStockReport = localStorage.getItem('page_stock_report');
        this.handleParameter(pageStockReport!==undefined&&pageStockReport!==null?pageStockReport:1);
    }
    handlePageChange(pageNumber){
        localStorage.setItem("page_stock_report",pageNumber);
        this.handleParameter(pageNumber);

    }
    toggle(e,code,barcode,name){
        e.preventDefault();
        localStorage.setItem("code",code);
        localStorage.setItem("barcode",barcode);
        localStorage.setItem("name",name);
        // this.setState({detail:{}});
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("detailStockReportSatuan"));
        // this.setState({
        //     detail:{"code":localStorage.getItem("code")}
        // });
        // this.state.detail = {"code":"11111"};
        this.props.dispatch(FetchStockReportDetailSatuan(1,code,'','',''))
    };
    handleChange(event){
        this.setState({ [event.target.name]: event.target.value });
    }
    handleEvent = (event, picker) => {
        const awal = picker.startDate._d.toISOString().substring(0,10);
        const akhir = picker.endDate._d.toISOString().substring(0,10);
        localStorage.setItem("date_from_stock_report",`${awal}`);
        localStorage.setItem("date_to_stock_report",`${akhir}`);
        this.setState({
            startDate:awal,
            endDate:akhir
        });
    };
    handleSearch(e){
        e.preventDefault();
        localStorage.setItem("any_stock_report",this.state.any);
        this.handleParameter(1);
    }
    componentWillReceiveProps = (nextProps) => {
        let sb=[];
        let searchBy=[
            {value: "kd_brg", label:'Kode Barang'},
            {value: "nm_brg", label:'Nama Barang'},
            {value: "group1", label:'Supplier'},
        ];
        searchBy.map((i) => {
            sb.push({
                value: i.value,
                label: i.label
            });
            return null;
        })
        let status= [
            {value: "",label:'Semua Stock'},
            {value: "<",label:'Stock -'},
            {value: ">",label:'Stock +'},
            {value: "=",label:'Stock 0'},
        ];
        let st=[];
        status.map((i) => {
            st.push({
                value: i.value,
                label: i.label
            });
            return null;
        })
        this.setState({
            status_data: st,
            search_by_data:sb
        })
        if (nextProps.auth.user) {
            let lk = [];
            let loc = nextProps.auth.user.lokasi;
            if(loc!==undefined){
                lk.push({
                    value: '-',
                    label: 'Pilih Lokasi'
                });
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
    HandleChangeLokasi(lk) {
        this.setState({
            location: lk.value
        })
        localStorage.setItem('lk_stock_report', lk.value);
    }
    HandleChangeSearchBy(sb) {
        this.setState({
            search_by: sb.value
        })
        localStorage.setItem('search_by_stock_report', sb.value);
    }
    HandleChangeStock(lk) {
        this.setState({
            status: lk.value
        })
        localStorage.setItem('st_stock_report', lk.value);
    }
    handleParameter(pageNumber){
        let dateFrom=localStorage.date_from_stock_report;
        let dateTo=localStorage.date_to_stock_report;
        let lokasi=localStorage.lk_stock_report;
        let status=localStorage.st_stock_report;
        let any=localStorage.any_stock_report;
        let search_by=localStorage.search_by_stock_report;
        let where='';
        if(dateFrom!==undefined&&dateFrom!==null){
            where+=`&dateFrom=${dateFrom}&dateTo=${dateTo}`;
        }
        if(lokasi!==undefined&&lokasi!==null){
            where+=`&lokasi=${lokasi}`;
        }
        if(status!==undefined&&status!==null&&status!==''){
            where+=`&filter_stock=${status}`;
        }
        if(search_by!==undefined&&search_by!==null&&search_by!==''){
            where+=`&searchby=${search_by}`;
        }

        if(any!==undefined&&any!==null&&any!==''){
            where+=`&search=${any}`;
        }
        this.setState({
            where_data:where
        })
        localStorage.setItem("where_stock_report",pageNumber);
        this.props.dispatch(FetchStockReport(pageNumber,where));
        // this.props.dispatch(FetchStockReportExcel(pageNumber,where));

    }
    toggleModal(e,total,perpage) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        let range = total*perpage;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formStockExcel"));
        this.props.dispatch(FetchStockReportExcel(1,this.state.where_data,total));
    }


    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        const {per_page,last_page,current_page,from,to,data,total} = this.props.stockReport;
        const {total_dn,total_stock_awal,total_stock_masuk,total_stock_keluar,total_stock_akhir} = this.props.total_stock;

        let total_dn_per=0;
        let total_first_stock_per=0;
        let total_last_stock_per=0;
        let total_stock_in_per=0;
        let total_stock_out_per=0;
        return (
            <Layout page="Laporan Stock">
                <div className="col-12">
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

                                <div className="col-6 col-xs-6 col-md-2">
                                    <div className="form-group">
                                        <label htmlFor="exampleFormControlSelect1">Filter Stock</label>
                                        <Select
                                            options={this.state.status_data}
                                            onChange={this.HandleChangeStock}
                                            placeholder="Pilih Stock"
                                            value = {
                                                this.state.status_data.find(op => {
                                                    return op.value === this.state.status
                                                })
                                            }
                                        />

                                    </div>
                                </div>
                                <div className="col-6 col-xs-6 col-md-2">
                                    <div className="form-group">
                                        <label htmlFor="exampleFormControlSelect1">Search By</label>
                                        <Select
                                            options={this.state.search_by_data}
                                            onChange={this.HandleChangeSearchBy}
                                            placeholder="Pilih Kolom"
                                            value = {
                                                this.state.search_by_data.find(op => {
                                                    return op.value === this.state.search_by
                                                })
                                            }
                                        />

                                    </div>
                                </div>
                                <div className="col-6 col-xs-6 col-md-2" style={{paddingLeft:"0px"}}>
                                    <label htmlFor="exampleFormControlSelect1">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                                    <div className="form-group">
                                        <input className="form-control" type="text" style={{padding: '9px',width: '185px',fontWeight:'bolder'}} name="any" value={this.state.any} onChange={(e) => this.handleChange(e)}/>
                                    </div>

                                </div>

                                <div className="col-6 col-xs-6 col-md-2">
                                    <div className="form-group">
                                        <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary" onClick={(e => this.handleSearch(e))}>
                                            <i className="fa fa-search"/>
                                        </button>
                                        <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary" onClick={(e => this.toggleModal(e,(last_page*per_page),per_page))}>
                                            <i className="fa fa-print"></i> Export
                                        </button>
                                    </div>

                                </div>
                            </div>
                            {/*DATA EXCEL*/}
                            <table className="table table-hover"  id="report_stock_to_excel" style={{display:"none"}}>
                                <thead className="bg-light">
                                <tr>
                                    <th className="text-black" colSpan={12}>{this.state.startDate} - {this.state.startDate}</th>
                                </tr>
                                <tr>
                                    <th className="text-black" colSpan={12}>LAPORAN STOCK</th>
                                </tr>

                                <tr>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Kode Barang</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Barcode</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Satuan</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Nama</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Supplier</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Sub Dept</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Kelompok</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Delivery Note</th>
                                    <th className="text-black" colSpan="4" style={columnStyle}>Stok</th>
                                </tr>
                                <tr>
                                    <th className="text-black" rowSpan="1" style={columnStyle}>Awal</th>
                                    <th className="text-black" rowSpan="1" style={columnStyle}>Masuk</th>
                                    <th className="text-black" rowSpan="1" style={columnStyle}>Keluar</th>
                                    <th className="text-black" rowSpan="1" style={columnStyle}>Akhir</th>
                                </tr>
                                </thead>
                                {
                                    <tbody>
                                    {
                                        typeof this.props.stockReportExcel.data==='object'? this.props.stockReportExcel.data.length>0?
                                            this.props.stockReportExcel.data.map((v,i)=>{
                                                const stok_akhir = (parseFloat(v.stock_awal) + parseFloat(v.stock_masuk) - parseFloat(v.stock_keluar));
                                                total_dn_per = total_dn_per+parseInt(v.delivery_note,10);
                                                total_first_stock_per = total_first_stock_per+parseInt(v.stock_awal,10);
                                                total_last_stock_per = total_last_stock_per+parseFloat(v.stock_awal)+parseFloat(v.stock_masuk)-parseFloat(v.stock_keluar);
                                                total_last_stock_per = total_last_stock_per + stok_akhir;
                                                total_stock_in_per = total_stock_in_per+parseInt(v.stock_masuk,10);
                                                total_stock_out_per = total_stock_out_per+parseInt(v.stock_keluar,10);
                                                return (
                                                    <tr key={i}>
                                                        <td style={columnStyle}>{v.kd_brg}</td>
                                                        <td style={columnStyle}>{v.barcode}</td>
                                                        <td style={columnStyle}>{v.satuan}</td>
                                                        <td style={columnStyle}>{v.nm_brg}</td>
                                                        <td style={columnStyle}>{v.supplier}</td>
                                                        <td style={columnStyle}>{v.sub_dept}</td>
                                                        <td style={columnStyle}>{v.nama_kel}</td>
                                                        <td style={columnStyle}>{v.delivery_note}</td>
                                                        <td style={columnStyle}>{v.stock_awal}</td>
                                                        <td style={columnStyle}>{v.stock_masuk}</td>
                                                        <td style={columnStyle}>{v.stock_keluar}</td>
                                                        {/* <td style={columnStyle}>{parseFloat(v.stock_awal)+parseFloat(v.stock_masuk)-parseFloat(v.stock_keluar)}</td> */}
                                                        <td style={columnStyle}>{stok_akhir}</td>
                                                    </tr>
                                                );
                                            }) : "No data." : "No data."
                                    }
                                    <tfoot>
                                    <tr style={{fontWeight:"bold"}}>
                                        <th colSpan="7">TOTAL PERPAGE</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_dn_per}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_first_stock_per}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_stock_in_per}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_stock_out_per}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_last_stock_per}</th>
                                    </tr>
                                    <tr style={{fontWeight:"bold",backgroundColor:"#EEEEEE"}}>
                                        <th colSpan="7">TOTAL</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_dn!==undefined?total_dn:'0'}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_stock_awal===undefined?0:total_stock_awal}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_stock_masuk===undefined?0:total_stock_masuk}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_stock_keluar===undefined?0:total_stock_keluar}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_stock_akhir===undefined?0:total_stock_akhir}</th>
                                    </tr>
                                    </tfoot>
                                    </tbody>
                                }
                            </table>
                            {/*END DATA EXCEL*/}
                            <div className="table-responsive" style={{overflowX: "auto"}}>
                                <table className="table table-hover table-bordered" style={{zoom:"80%"}}>
                                    <thead className="bg-light">
                                    <tr>
                                        <th className="text-black" style={columnStyle} rowSpan="2">#</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Kode Barang</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Barcode</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Satuan</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Nama</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Supplier</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Sub Dept</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Kelompok</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Delivery Note</th>
                                        <th className="text-black" style={columnStyle} colSpan="4">Stok</th>
                                    </tr>
                                    <tr>
                                        <th className="text-black" style={columnStyle} rowSpan="1">Awal</th>
                                        <th className="text-black" style={columnStyle} rowSpan="1">Masuk</th>
                                        <th className="text-black" style={columnStyle} rowSpan="1">Keluar</th>
                                        <th className="text-black" style={columnStyle} rowSpan="1">Akhir</th>
                                    </tr>
                                    <tr></tr>
                                    </thead>
                                    {
                                        !this.props.isLoading?(
                                            <tbody>
                                            {
                                                (
                                                    typeof data === 'object' ?
                                                        data.map((v,i)=>{
                                                            const stok_akhir = (parseFloat(v.stock_awal) + parseFloat(v.stock_masuk) - parseFloat(v.stock_keluar));
                                                            total_dn_per = total_dn_per+parseInt(v.delivery_note,10);
                                                            total_first_stock_per = total_first_stock_per+parseInt(v.stock_awal,10);
                                                            total_last_stock_per = total_last_stock_per+parseFloat(v.stock_awal)+parseFloat(v.stock_masuk)-parseFloat(v.stock_keluar);
                                                            total_last_stock_per = total_last_stock_per + stok_akhir;
                                                            total_stock_in_per = total_stock_in_per+parseInt(v.stock_masuk,10);
                                                            total_stock_out_per = total_stock_out_per+parseInt(v.stock_keluar,10);
                                                            
                                                            return(
                                                                <tr key={i}>
                                                                    <td style={columnStyle}>{/* Example split danger button */}
                                                                        <div className="btn-group">
                                                                            <UncontrolledButtonDropdown>
                                                                                <DropdownToggle caret>
                                                                                    Aksi
                                                                                </DropdownToggle>
                                                                                <DropdownMenu>
                                                                                    <DropdownItem href={`${HEADERS.URL}reports/penjualan/${v.kd_trx}.pdf`} target="_blank">Export</DropdownItem>
                                                                                    <DropdownItem onClick={(e)=>this.toggle(e,v.kd_brg,v.barcode,v.nm_brg)}>Detail</DropdownItem>
                                                                                </DropdownMenu>
                                                                            </UncontrolledButtonDropdown>
                                                                        </div>
                                                                    </td>
                                                                    <td style={columnStyle}>{v.kd_brg}</td>
                                                                    <td style={columnStyle}>{v.barcode}</td>
                                                                    <td style={columnStyle}>{v.satuan}</td>
                                                                    <td style={columnStyle}>{v.nm_brg}</td>
                                                                    <td style={columnStyle}>{v.supplier}</td>
                                                                    <td style={columnStyle}>{v.sub_dept}</td>
                                                                    <td style={columnStyle}>{v.nama_kel}</td>
                                                                    <td style={{textAlign:"right"}}>{v.delivery_note}</td>
                                                                    <td style={{textAlign:"right"}}>{v.stock_awal}</td>
                                                                    <td style={{textAlign:"right"}}>{v.stock_masuk}</td>
                                                                    <td style={{textAlign:"right"}}>{v.stock_keluar}</td>
                                                                    <td style={{textAlign:"right"}}>{parseFloat(v.stock_awal)+parseFloat(v.stock_masuk)-parseFloat(v.stock_keluar)}</td>

                                                                </tr>
                                                            )
                                                        })
                                                        : "No data."
                                                )
                                            }
                                            </tbody>
                                        ):<Preloader/>
                                    }
                                    <tfoot>
                                    <tr style={{fontWeight:"bold",backgroundColor:"#EEEEEE"}}>
                                        <th colSpan="8">TOTAL PERPAGE</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_dn_per}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_first_stock_per}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_stock_in_per}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_stock_out_per}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_last_stock_per}</th>
                                    </tr>
                                    <tr style={{fontWeight:"bold",backgroundColor:"#EEEEEE"}}>
                                        <th colSpan="8">TOTAL</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_dn!==undefined?total_dn:'0'}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_stock_awal===undefined?0:total_stock_awal}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_stock_masuk===undefined?0:total_stock_masuk}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_stock_keluar===undefined?0:total_stock_keluar}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_stock_akhir===undefined?0:total_stock_akhir}</th>
                                    </tr>
                                    </tfoot>
                                </table>

                            </div>
                            <div style={{"marginTop":"20px","float":"right"}}>
                                <Paginationq
                                    current_page={parseInt(current_page,10)}
                                    per_page={parseInt(per_page,10)}
                                    total={parseInt((per_page*last_page),10)}
                                    callback={this.handlePageChange.bind(this)}
                                />
                            </div>
                            <DetailStockReportSatuan token={this.props.token} stockReportDetailSatuan={this.props.stockReportDetailSatuan}/>
                            <StockReportExcel startDate={this.state.startDate} endDate={this.state.endDate} />
                        </div>
                    </div>

                </div>
                {/*}*/}
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        stockReport:state.stockReportReducer.data,
        stockReportExcel:state.stockReportReducer.report_excel,
        total_stock:state.stockReportReducer.total_stock,
        auth:state.auth,
        isLoading: state.stockReportReducer.isLoading,
        stockReportDetailSatuan:state.stockReportReducer.dataDetailSatuan,
        isLoadingDetailSatuan: state.stockReportReducer.isLoadingDetailSatuan,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(InventoryReport);