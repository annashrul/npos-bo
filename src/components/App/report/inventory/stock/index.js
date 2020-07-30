import React,{Component} from 'react'
import Layout from 'components/App/Layout'
import {FetchStockReport} from "redux/actions/report/inventory/stock_report.action";
import connect from "react-redux/es/connect/connect";
import DetailStockReportSatuan from "components/App/modals/report/inventory/stock_report/detail_stock_report_satuan";
import moment from "moment";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import {FetchStockReportDetailSatuan} from "redux/actions/report/inventory/stock_report.action";
import DateRangePicker from "react-bootstrap-daterangepicker";
import {rangeDate} from "helper";
import Select from "react-select";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Preloader from "../../../../../Preloader";

class InventoryReport extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.HandleChangeStock = this.HandleChangeStock.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleEvent = this.handleEvent.bind(this);
        this.state={
            location:"",
            location_data:[],
            status_data: [],
            status:"",
            any:"",
            startDate:moment(new Date()).format("yyyy-MM-DD"),
            endDate:moment(new Date()).format("yyyy-MM-DD"),
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
        console.log(`${code} ${barcode} ${name}`);
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
        localStorage.setItem("any_sale_report",this.state.any_sale_report);
        this.handleParameter(1);
        // this.props.dispatch(FetchStockReport(this.state.activePage,this.state.search,this.state.startDate,this.state.endDate,this.state.location,this.state.filter_stock_report))
    }
    componentWillReceiveProps = (nextProps) => {
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
        })
        this.setState({
            status_data: st,
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
        if(any!==undefined&&any!==null){
            where+=`&q=${any}`;
        }
        this.props.dispatch(FetchStockReport(pageNumber,where));

    }


    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        const {per_page,current_page,from,to,data} = this.props.stockReport;
        const {total_dn,total_stock_awal,total_stock_masuk,total_stock_keluar,total_stock_akhir} = this.props.total;

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
                                    <label htmlFor="exampleFormControlSelect1">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                                    <div className="form-group">
                                        <input className="form-control" type="text" style={{padding: '9px',width: '185px',fontWeight:'bolder'}} name="any" value={this.state.any} onChange={(e) => this.handleChange(e)}/>
                                    </div>
                                </div>

                                <div className="col-6 col-xs-6 col-md-4">
                                    <div className="form-group">
                                        <button onClick={(e=>this.handleSearch(e))} style={{marginTop:"29px",marginRight:"2px", padding:"8px"}} type="button" className="btn btn-primary" ><i className="fa fa-search"></i></button>
                                        <ReactHTMLTableToExcel
                                            className="btn btn-primary btnBrg"
                                            table="report_sale_to_excel"
                                            filename="laporan_stock"
                                            sheet="laporan stock"
                                            buttonText="export excel">
                                        </ReactHTMLTableToExcel>
                                    </div>
                                </div>
                            </div>
                            <div className="table-responsive" style={{overflowX: "auto"}}>
                                <table className="table table-hover table-bordered" style={{zoom:"80%"}}>
                                    <thead className="bg-light">
                                    <tr>
                                        <th className="text-black" style={columnStyle} rowSpan="2">#</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Code</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Barcode</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Unit</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Name</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Supplier</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Sub Dept</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Group</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Delivery Note</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">First Stock</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Stock In</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Stock Out</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Last Stock</th>
                                    </tr>
                                    </thead>
                                    {
                                        !this.props.isLoading?(
                                            <tbody>
                                            {
                                                (
                                                    typeof data === 'object' ?
                                                        data.map((v,i)=>{
                                                            total_dn_per = total_dn_per+parseInt(v.delivery_note);
                                                            total_first_stock_per = total_first_stock_per+parseInt(v.stock_awal);
                                                            total_last_stock_per = total_last_stock_per+parseInt(v.stock_akhir);
                                                            total_stock_in_per = total_stock_in_per+parseInt(v.stock_masuk);
                                                            total_stock_out_per = total_stock_out_per+parseInt(v.stock_keluar);
                                                            return(
                                                                <tr key={i}>
                                                                    <td style={columnStyle}>{/* Example split danger button */}
                                                                        <div className="btn-group">
                                                                            <button className="btn btn-primary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                Action
                                                                            </button>
                                                                            <div className="dropdown-menu">
                                                                                <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.handleEdit(e,v.kd_brg)}>Export</a>
                                                                                <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.toggle(e,v.kd_brg,v.barcode,v.nm_brg)}>Detail</a>
                                                                            </div>
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
                                                                    <td style={{textAlign:"right"}}>{v.stock_akhir}</td>

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
                                    <tr style={{fontWeight:"bold"}}>
                                        <th colSpan="8">TOTAL PERPAGE</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_dn_per}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_first_stock_per}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_stock_in_per}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_stock_out_per}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_last_stock_per}</th>
                                    </tr>
                                    <tr style={{fontWeight:"bold"}}>
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

                            <DetailStockReportSatuan token={this.props.token} stockReportDetailSatuan={this.props.stockReportDetailSatuan}/>
                            
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
        total:state.stockReportReducer.total,
        auth:state.auth,
        isLoading: state.stockReportReducer.isLoading,
        stockReportDetailSatuan:state.stockReportReducer.dataDetailSatuan,
        isLoadingDetailSatuan: state.stockReportReducer.isLoadingDetailSatuan,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(InventoryReport);