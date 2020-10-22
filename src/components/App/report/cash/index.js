import React,{Component} from 'react'
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import {FetchCashReport} from "redux/actions/masterdata/cash/cash.action";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import Select from "react-select";
import Paginationq from "helper";
import Preloader from "../../../../Preloader";
import {kassa, rangeDate, toRp} from "../../../../helper";
import {FetchCashReportExcel} from "../../../../redux/actions/masterdata/cash/cash.action";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import CashReportExcel from 'components/App/modals/report/cash/form_cash_excel'

class ReportCash extends Component{
    constructor(props){
        super(props);
        this.state={
            where_data:"",
            type_data:[],
            type:"",
            location_data:[],
            location:"",
            kassa_data: [],
            kassa:"",
            startDate:moment(new Date()).format("yyyy-MM-DD"),
            endDate:moment(new Date()).format("yyyy-MM-DD")
        }
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.HandleChangeKassa = this.HandleChangeKassa.bind(this);
        this.HandleChangeType = this.HandleChangeType.bind(this);
        this.handleEvent = this.handleEvent.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

    }
    componentWillReceiveProps = (nextProps) => {
        let type = [
            {kode:"",value: "Semua Tipe"},
            {kode:"masuk",value: "Kas Masuk"},
            {kode:"keluar",value: "Kas Keluar"},
        ];
        let data_type=[];
        type.map((i) => {
            data_type.push({
                value: i.kode,
                label: i.value
            });
            return null;
        });


        this.setState({
            type_data: data_type,
        });
        if (nextProps.auth.user) {
            let lk = [{
                value: "",
                label: "Semua Lokasi"
            }];
            let loc = nextProps.auth.user.lokasi;
            if(loc!==undefined){
                // loc.push({"kode":"","nama":"Semua Lokasi"});
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
        let page=localStorage.getItem("pageNumber_cash_report");
        if(page!==undefined&&page!==null){
            this.checkingParameter(page);
        }else{
            this.checkingParameter(1);
        }


    }
    componentDidMount(){
        if (localStorage.location_cash_report !== undefined && localStorage.location_cash_report !== '') {
            this.setState({
                location: localStorage.location_cash_report
            })
        }
        if (localStorage.kassa_cash_report !== undefined && localStorage.kassa_cash_report !== '') {
            this.setState({
                kassa: localStorage.kassa_cash_report
            })
        }
        if (localStorage.type_cash_report !== undefined && localStorage.type_cash_report !== '') {
            this.setState({
                type: localStorage.type_cash_report
            })
        }
        if (localStorage.date_from_cash_report !== undefined && localStorage.date_from_cash_report !== null) {
            this.setState({
                startDate: localStorage.date_from_cash_report
            })
        }
        if (localStorage.date_to_cash_report !== undefined && localStorage.date_to_cash_report !== null) {
            this.setState({
                endDate: localStorage.date_to_cash_report
            })
        }
    }
    HandleChangeType(type) {
        this.setState({
            type: type.value,
        });
        localStorage.setItem('type_cash_report', type.value);
    }
    HandleChangeLokasi(lk) {
        this.setState({
            location: lk.value,
        });
        localStorage.setItem('location_cash_report', lk.value);
    }
    HandleChangeKassa(ks) {
        this.setState({
            kassa: ks.value,
        });
        localStorage.setItem('kassa_cash_report', ks.value);
    }
    handleEvent = (event, picker) => {
        const awal = moment(picker.startDate._d).format('YYYY-MM-DD');
        const akhir = moment(picker.endDate._d).format('YYYY-MM-DD');
        localStorage.setItem("date_from_cash_report",`${awal}`);
        localStorage.setItem("date_to_cash_report",`${akhir}`);
        this.setState({
            startDate:awal,
            endDate:akhir
        });
    };
    handleSearch(e){
        e.preventDefault();
        let page=localStorage.getItem("pageNumber_cash_report");
        if(page!==undefined&&page!==null){
            this.checkingParameter(page);
        }else{
            this.checkingParameter(1);
        }
    }
    toggleModal(e,total,perpage) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        // let range = total*perpage;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formCashExcel"));
        this.props.dispatch(FetchCashReportExcel(this.state.where_data,total));
    }
    checkingParameter(pageNumber){
        let where='';
        let dateFrom=localStorage.getItem("date_from_cash_report");
        let dateTo=localStorage.getItem("date_to_cash_report");
        let tipe=localStorage.getItem("type_cash_report");
        let lokasi=localStorage.getItem("location_cash_report");
        let kassa=localStorage.getItem("kassa_cash_report");
        if(dateFrom!==undefined&&dateFrom!==null){
            if(where!==''){where+='&'}where+=`datefrom=${dateFrom}&dateto=${dateTo}`
        }
        if(tipe!==undefined&&tipe!==null&&tipe!==''){
            if(where!==''){where+='&'}where+=`type_kas=${tipe}`
        }
        if(lokasi!==undefined&&lokasi!==null&&lokasi!==''){
            if(where!==''){where+='&'}where+=`lokasi=${lokasi}`
        }
        if(kassa!==undefined&&kassa!==null&&kassa!==''){
            if(where!==''){where+='&'}where+=`kassa=${kassa}`
        }

        this.setState({
            where_data:where
        })

        this.props.dispatch(FetchCashReport(pageNumber,where));
        // this.props.dispatch(FetchCashReportExcel(where));
    }
    handlePageChange(pageNumber){
        localStorage.setItem("pageNumber_cash_report",pageNumber);
        this.checkingParameter(pageNumber);
    }
    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        const {
            // total,
            last_page,
            per_page,
            current_page,
            // from,
            // to,
            data
        } = this.props.cashReport;
        let subtotal=0;
        
        return (
            <Layout page="Laporan Kas">
                <div className="card">
                    <div className="card-header">
                        <h5>Laporan Kas</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-6 col-xs-6 col-md-2">
                                <div className="form-group">
                                    <label htmlFor=""> Periode </label>
                                    <DateRangePicker
                                        ranges={rangeDate}
                                        alwaysShowCalendars={true}
                                        onEvent={this.handleEvent}
                                    >
                                        <input type="text"className="form-control" name="date_product" value={`${this.state.startDate} to ${this.state.endDate}`}  style={{padding: '10px',fontWeight:'bolder'}}/>
                                    </DateRangePicker>
                                </div>
                            </div>
                            <div className="col-6 col-xs-6 col-md-2">
                                <div className="form-group">
                                    <label className="control-label font-12">
                                        Lokasi
                                    </label>
                                    <Select
                                        options={this.state.location_data}
                                        placeholder="Pilih Lokasi"
                                        onChange={this.HandleChangeLokasi}
                                        value={
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
                                        Kassa
                                    </label>
                                    <Select
                                        options={kassa('semua')}
                                        placeholder="Pilih Kassa"
                                        onChange={this.HandleChangeKassa}
                                        value={
                                            this.state.kassa_data.find(op => {
                                                return op.value === this.state.kassa
                                            })
                                        }

                                    />
                                </div>
                            </div>
                            <div className="col-6 col-xs-6 col-md-2">
                                <div className="form-group">
                                    <label className="control-label font-12">
                                        Tipe Kas
                                    </label>
                                    <Select
                                        options={this.state.type_data}
                                        placeholder="Pilih Tipe Kas"
                                        onChange={this.HandleChangeType}
                                        value={
                                            this.state.type_data.find(op => {
                                                return op.value === this.state.type
                                            })
                                        }

                                    />
                                </div>
                            </div>
                            <div className="col-6 col-xs-6 col-md-3">
                                <div className="form-group">
                                    <label className="control-label font-12"></label>
                                    <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary" onClick={this.handleSearch}>
                                        <i className="fa fa-search"></i>
                                    </button>
                                    <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary" onClick={(e => this.toggleModal(e,(last_page*per_page),per_page))}>
                                        <i className="fa fa-print"></i> Export
                                    </button>
                                </div>

                            </div>
                            <div className="col-md-12">
                                <div className="table-responsive" style={{overflowX: "auto",zoom:"85%"}}>
                                    <table className="table table-hover table-bordered"  id="laporan_kas" style={{display:"none"}}>
                                        <thead className="bg-light">
                                        <tr>
                                            <th className="text-black" colSpan={10}>TIPE : {this.state.type===''?'SEMUA':this.state.type.toUpperCase()}</th>
                                        </tr>
                                        <tr>
                                            <th className="text-black" colSpan={10}>PERIODE: {this.state.startDate} - {this.state.startDate}</th>
                                        </tr>
                                        <tr>
                                            <th className="text-black" colSpan={10}>LOKASI: {this.state.location===''?'SEMUA LOKASI':this.state.location}</th>
                                        </tr>
                                        <tr>
                                            <th className="text-black" colSpan={10}>KASSA : {this.state.kassa===''?'SEMUA KASSA':this.state.kassa}</th>
                                        </tr>
                                        <tr>
                                            <th className="text-black" style={columnStyle}>No</th>
                                            <th className="text-black" style={columnStyle}>Tgl</th>
                                            <th className="text-black" style={columnStyle}>Kd Trx</th>
                                            <th className="text-black" style={columnStyle}>Keterangan</th>
                                            <th className="text-black" style={columnStyle}>Lokasi</th>
                                            <th className="text-black" style={columnStyle}>Kassa</th>
                                            <th className="text-black" style={columnStyle}>Kasir</th>
                                            <th className="text-black" style={columnStyle}>Tipe</th>
                                            <th className="text-black" style={columnStyle}>Jenis</th>
                                            <th className="text-black" style={columnStyle}>Jumlah</th>
                                        </tr>
                                        </thead>
                                        <tbody>

                                        {
                                            (
                                                (typeof this.props.cashReportExcel.data === 'object') ? this.props.cashReportExcel.data.length > 0 ?
                                                    this.props.cashReportExcel.data.map((v,i)=>{
                                                        subtotal = subtotal+parseInt(v.jumlah,10);
                                                        return(
                                                            <tr key={i}>
                                                                <td style={columnStyle}>{i+1}</td>
                                                                <td style={columnStyle}>{moment(v.tgl).format("yyyy-MM-DD")}</td>
                                                                <td style={columnStyle}>{v.kd_trx}</td>
                                                                <td style={columnStyle}>{v.keterangan}</td>
                                                                <td style={columnStyle}>{v.lokasi}</td>
                                                                <td style={columnStyle}>{v.kassa}</td>
                                                                <td style={columnStyle}>{v.kasir}</td>
                                                                <td style={columnStyle}>{v.type}</td>
                                                                <td style={columnStyle}>{v.jenis}</td>
                                                                <td style={{textAlign:"right"}}>{toRp(parseInt(v.jumlah,10))}</td>
                                                            </tr>
                                                        )
                                                    })
                                                    : "No data." : "No data."
                                            )
                                        }
                                        </tbody>
                                        <tfoot>
                                        <tr>
                                            <td colSpan={9}>TOTAL</td>
                                            <td style={{textAlign:"right"}}>{toRp(subtotal)}</td>
                                        </tr>
                                        </tfoot>
                                    </table>
                                    <table className="table table-hover table-bordered">
                                        <thead className="bg-light">
                                        <tr>
                                            <th className="text-black" style={columnStyle}>Kd Trx</th>
                                            <th className="text-black" style={columnStyle}>Tgl</th>
                                            <th className="text-black" style={columnStyle}>Jumlah</th>
                                            <th className="text-black" style={columnStyle}>Keterangan</th>
                                            <th className="text-black" style={columnStyle}>Lokasi</th>
                                            <th className="text-black" style={columnStyle}>Kassa</th>
                                            <th className="text-black" style={columnStyle}>Kasir</th>
                                            <th className="text-black" style={columnStyle}>Tipe</th>
                                            <th className="text-black" style={columnStyle}>Jenis</th>
                                        </tr>
                                        </thead>
                                        {
                                            !this.props.isLoadingReport?(
                                                <tbody>

                                                {
                                                    (
                                                        typeof data === 'object' ? data.length > 0 ?
                                                            data.map((v,i)=>{
                                                                return(
                                                                    <tr key={i}>
                                                                        <td style={columnStyle}>{v.kd_trx}</td>
                                                                        <td style={columnStyle}>{moment(v.tgl).format("yyyy-MM-DD hh:mm:ss")}</td>
                                                                        <td style={columnStyle}>{toRp(v.jumlah)}</td>
                                                                        <td style={columnStyle}>{v.keterangan}</td>
                                                                        <td style={columnStyle}>{v.lokasi}</td>
                                                                        <td style={columnStyle}>{v.kassa}</td>
                                                                        <td style={columnStyle}>{v.kasir}</td>
                                                                        <td style={columnStyle}>{v.type}</td>
                                                                        <td style={columnStyle}>{v.jenis}</td>
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
                                        current_page={parseInt(current_page,10)}
                                        per_page={parseInt(per_page,10)}
                                        total={parseInt((per_page*last_page),10)}
                                        callback={this.handlePageChange.bind(this)}
                                    />
                                    <CashReportExcel tipe={this.state.type} startDate={this.state.startDate} endDate={this.state.endDate} location={this.state.location} kassa={this.state.kassa} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        cashReport:state.cashReducer.dataReport,
        cashReportExcel:state.cashReducer.dataExcel,
        isLoadingReport: state.cashReducer.isLoadingReport,
        auth: state.auth
    }
}

export default connect(mapStateToProps)(ReportCash)