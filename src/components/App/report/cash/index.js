import React,{Component} from 'react'
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import {FetchCashReport} from "redux/actions/masterdata/cash/cash.action";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import Select from "react-select";
import Paginationq from "helper";
import Preloader from "../../../../Preloader";
import {rangeDate, toRp} from "../../../../helper";

class ReportCash extends Component{
    constructor(props){
        super(props);
        this.state={
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
        });
        let kassa = [
            {value: "Semua Kassa",kode: ""},
            {value: "A",kode: "A"},{value: "B",kode: "B"},{value: "C",kode: "C"},{value: "D",kode: "D"},{value: "E",kode: "E"},{value: "F",kode: "F"},{value: "G",kode: "G"},{value: "H",kode: "H"},
            {value: "I",kode: "I"},{value: "J",kode: "J"},{value: "K",kode: "K"},{value: "L",kode: "L"},{value: "M",kode: "M"},{value: "N",kode: "N"},{value: "O",kode: "O"},{value: "P",kode: "P"},
            {value: "Q",kode: "Q"},{value: "R",kode: "R"},{value: "S",kode: "S"},{value: "T",kode: "T"},{value: "U",kode: "U"},{value: "V",kode: "V"},{value: "W",kode: "W"},{value: "X",kode: "X"},
            {value: "Y",kode: "Y"},{value: "Z",kode: "Z"}
        ];
        let data_kassa=[];

        kassa.map((i) => {
            data_kassa.push({
                value: i.kode,
                label: i.value
            });
        });

        this.setState({
            kassa_data: data_kassa,
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
                })
                this.setState({
                    location_data: lk,
                })
            }
        }
    }

    componentWillMount(){
        let page=localStorage.getItem("pageNumber_cash_report");
        this.checkingParameter(page===undefined&&page===null?1:page);
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
        const awal = picker.startDate._d.toISOString().substring(0,10);
        const akhir = picker.endDate._d.toISOString().substring(0,10);
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
        this.checkingParameter(page===undefined&&page===null?1:page);
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
        if(tipe!==undefined&&tipe!==null){
            if(where!==''){where+='&'}where+=`type_kas=${tipe}`
        }
        if(lokasi!==undefined&&lokasi!==null){
            if(where!==''){where+='&'}where+=`lokasi=${lokasi}`
        }
        if(kassa!==undefined&&kassa!==null){
            if(where!==''){where+='&'}where+=`kassa=${kassa}`
        }
        this.props.dispatch(FetchCashReport(pageNumber,where));
    }
    handlePageChange(pageNumber){
        localStorage.setItem("pageNumber_cash_report",pageNumber);
        this.checkingParameter(pageNumber);
    }
    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        const {total,last_page,per_page,current_page,from,to,data} = this.props.cashReport;

        console.log("RENDER LAPORAN KAS",this.props.cashReport);
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
                                        <input type="text" className="form-control" name="date_product" value={`${this.state.startDate} to ${this.state.endDate}`}/>
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
                                        options={this.state.kassa_data}
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
                            <div className="col-6 col-xs-6 col-md-1">
                                <div className="form-group">
                                    <label className="control-label font-12"></label>
                                    <button style={{marginTop:"28px"}} className="btn btn-primary" onClick={this.handleSearch}>
                                        <i className="fa fa-search"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="table-responsive" style={{overflowX: "auto"}}>
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
                                        current_page={parseInt(current_page)}
                                        per_page={parseInt(per_page)}
                                        total={parseInt(total)}
                                        callback={this.handlePageChange.bind(this)}
                                    />
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
        isLoadingReport: state.cashReducer.isLoadingReport,
        auth: state.auth
    }
}

export default connect(mapStateToProps)(ReportCash)