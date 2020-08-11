import React,{Component} from 'react'
import Layout from 'components/App/Layout'
import Paginationq from "helper";
import {FetchOpname, FetchOpnameData} from "redux/actions/inventory/opname.action";
import connect from "react-redux/es/connect/connect";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import DetailOpname from "components/App/modals/report/inventory/opname_report/detail_opname";
import Select from 'react-select';
import moment from "moment";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import {rangeDate} from "helper";
import Preloader from "../../../../../Preloader";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import {statusQ} from "../../../../../helper";
class OpnameReport extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.state={
            any:"",
            location:"",
            location_data:[],
            startDate:moment(new Date()).format("yyyy-MM-DD"),
            endDate:moment(new Date()).format("yyyy-MM-DD"),
        }
    }
    componentWillMount(){
        let page=localStorage.page_opname_report;
        this.handleParameter(page!==undefined&&page!==null?page:1);
    }
    componentDidMount(){
        if (localStorage.location_opname_report !== undefined && localStorage.location_opname_report !== '') {
            this.setState({location: localStorage.location_opname_report})
        }
        if (localStorage.any_opname_report !== undefined && localStorage.any_opname_report !== '') {
            this.setState({any: localStorage.any_opname_report})
        }
        if (localStorage.date_from_opname_report !== undefined && localStorage.date_from_opname_report !== null) {
            this.setState({startDate: localStorage.date_from_opname_report})
        }
        if (localStorage.date_to_opname_report !== undefined && localStorage.date_to_opname_report !== null) {
            this.setState({endDate: localStorage.date_to_opname_report})
        }
    }
    handlePageChange(pageNumber){
        localStorage.setItem("page_opname_report",pageNumber);
        this.props.dispatch(FetchOpname(pageNumber))
    }
    toggle(e,code,barcode,name){
        e.preventDefault();
        localStorage.setItem("code",code);
        localStorage.setItem("barcode",barcode);
        localStorage.setItem("name",name);
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("detailOpname"));
        // this.props.dispatch(FetchOpnameData(code))
    };
    handleEvent = (event, picker) => {
        const awal = picker.startDate._d.toISOString().substring(0,10);
        const akhir = picker.endDate._d.toISOString().substring(0,10);
        localStorage.setItem("date_from_opname_report",`${awal}`);
        localStorage.setItem("date_to_opname_report",`${akhir}`);
        this.setState({
            startDate:awal,
            endDate:akhir
        });
    };
    handleSearch(e){
        e.preventDefault();
        localStorage.setItem("any_opname_report",this.state.any);
        this.handleParameter(1);
    }
    handleParameter(pageNumber){
        let dateFrom=localStorage.date_from_opname_report;
        let dateTo=localStorage.date_to_opname_report;
        let lokasi = localStorage.location_opname_report;
        let any = localStorage.any_opname_report;
        let where='';
        if(dateFrom!==undefined&&dateFrom!==null){
            where+=`&datefrom=${dateFrom}&dateto=${dateTo}`;
        }
        if(lokasi!==undefined&&lokasi!==null&&lokasi!==''){
            where+=`&lokasi=${lokasi}`;
        }
        if(any!==undefined&&any!==null&&any!==''){
            where+=`q=${any}`
        }
        this.props.dispatch(FetchOpname(pageNumber,where))
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
    HandleChangeLokasi(lk) {
        this.setState({
            location: lk.value
        })
        localStorage.setItem('location_opname_report', lk.value);
    }
    handleChange(event){
        this.setState({ [event.target.name]: event.target.value });
    }

    



    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        const {per_page,current_page,from,to,data} = this.props.opnameReport;
        return (
            <Layout page="Laporan Opname">
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
                                <div className="col-6 col-xs-6 col-md-2">
                                    <div className="form-group">
                                        <label>Cari</label>
                                        <input className="form-control" type="text" style={{padding: '9px',fontWeight:'bolder'}} name="any" value={this.state.any} onChange={(e) => this.handleChane(e)}/>
                                    </div>
                                </div>
                                <div className="col-6 col-xs-6 col-md-3">
                                    <div className="form-group">
                                        <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary" onClick={this.handleSearch}>
                                            <i className="fa fa-search"/>
                                        </button>
                                        <ReactHTMLTableToExcel
                                            className="btn btn-primary btnBrg"
                                            table="report_sale_to_excel"
                                            filename="laporan_penjualan"
                                            sheet="barang"
                                            buttonText="export excel">
                                        </ReactHTMLTableToExcel>
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
                                        <th className="text-black" style={columnStyle} rowSpan="2">kode Barang</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Nama Barang</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Kel. Barang</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Barcode</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Qty Fisik</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Stok Terakhir</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Lokasi</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">harga Beli</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Status</th>
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
                                                                    {/* <td style={columnStyle}>Example split danger button */}
                                                                        {/* <div className="btn-group">
                                                                            <button className="btn btn-primary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                Action
                                                                            </button>
                                                                            <div className="dropdown-menu"> */}
                                                                                {/* <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.handleEdit(e,v.kd_brg)}>Export</a> */}
                                                                                {/* <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.toggle(e,v.no_delivery_note,'','')}>Detail</a>
                                                                            </div>
                                                                        </div>
                                                                    </td> */}
                                                                    <td style={columnStyle}>{v.kd_trx}</td>
                                                                    <td style={columnStyle}>{moment(v.tanggal).format("DD-MM-YYYY")}</td>
                                                                    <td style={columnStyle}>{v.kd_brg}</td>
                                                                    <td style={columnStyle}>{v.nm_brg}</td>
                                                                    <td style={columnStyle}>{v.nm_kel_brg}</td>
                                                                    <td style={columnStyle}>{v.barcode}</td>
                                                                    <td style={columnStyle}>{v.qty_fisik}</td>
                                                                    <td style={columnStyle}>{v.stock_terakhir}</td>
                                                                    <td style={columnStyle}>{v.lokasi}</td>
                                                                    <td style={columnStyle}>{v.hrg_beli}</td>
                                                                    <td style={columnStyle}>{
                                                                        v.status==='0'?statusQ('danger','Belum Opname'):(v.status==='1'?statusQ('warning','Sudah Opname'):"")
                                                                        // v.status===0?statusQ('danger','proses'):(v.status===1?statusQ('warning','packing')?(v.status===2?statusQ('info','dikirim'):statusQ('info','diterima')):""):""
                                                                    }</td>

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
                            {/* <div style={{"marginTop":"20px","float":"right"}}>
                                <Paginationq
                                    current_page={current_page}
                                    per_page={per_page}
                                    total={total}
                                    callback={this.handlePageChange.bind(this)}
                                />
                            </div> */}
                            {/* <DetailOpname opnameDetail={this.props.opnameDetail}/> */}
                        </div>
                    </div>
                </div>
            </Layout>
            );
    }
}

const mapStateToProps = (state) => {
    console.log("mapStateToProps opname", state)
    return {
        opnameReport:state.opnameReducer.report,
        isLoadingDetail: state.opnameReducer.isLoadingDetail,
        auth:state.auth,
        isLoading: state.opnameReducer.isLoading,
        // opnameDetail:state.opnameReducer.opname_data,
        // isLoadingDetailSatuan: state.stockReportReducer.isLoadingDetailSatuan,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(OpnameReport);