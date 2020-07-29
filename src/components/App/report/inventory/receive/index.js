import React,{Component} from 'react';
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import {FetchReport} from "redux/actions/purchase/receive/receive.action";
import Preloader from "Preloader";
import DateRangePicker from "react-bootstrap-daterangepicker";
import {rangeDate} from "helper";
import Select from "react-select";
import moment from "moment";
import {ModalToggle,ModalType} from "redux/actions/modal.action";
import {FetchReportDetail} from "redux/actions/purchase/receive/receive.action";
import Paginationq from "helper";
import DetailReceiveReport from "../../../modals/report/purchase/receive/detail_receive_report";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import {FetchReceiveData, FetchReportExcel} from "../../../../../redux/actions/purchase/receive/receive.action";
import {toRp} from "../../../../../helper";
import FormReturReceive from "../../../modals/report/purchase/receive/form_retur_receive";

class ReceiveReport extends Component{
    constructor(props){
        super(props);
        this.handleSearch       = this.handleSearch.bind(this);
        this.toggleModal        = this.toggleModal.bind(this);
        this.handleEvent        = this.handleEvent.bind(this);
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.HandleChangeType   = this.HandleChangeType.bind(this);
        this.handleChange       = this.handleChange.bind(this);
        this.handleRetur        = this.handleRetur.bind(this);
        this.state={
            detail          :{},
            startDate       :moment(new Date()).format("yyyy-MM-DD"),
            endDate         :moment(new Date()).format("yyyy-MM-DD"),
            location_data   :[],
            location        :"",
            type_data       :[],
            type            :"",
            any_receive_report:''
        }
    }
    componentWillMount(){
        let page=localStorage.getItem("pageNumber_receive_report");
        this.checkingParameter(page!==undefined&&page!==null?page:1);
    }
    componentDidMount(){
        if (localStorage.location_receive_report !== undefined && localStorage.location_receive_report !== '') {
            this.setState({
                location: localStorage.location_receive_report
            })
        }

        if (localStorage.type_receive_report !== undefined && localStorage.type_receive_report !== '') {
            this.setState({
                type: localStorage.type_receive_report
            })
        }
        if (localStorage.any_receive_report !== undefined && localStorage.any_receive_report !== '') {
            this.setState({
                any: localStorage.any_receive_report
            })
        }
        if (localStorage.date_from_receive_report !== undefined || localStorage.date_from_receive_report !== null) {
            this.setState({
                startDate: localStorage.date_from_receive_report
            })
        }
        if (localStorage.date_to_receive_report !== undefined || localStorage.date_to_receive_report !== null) {
            this.setState({
                endDate: localStorage.date_to_receive_report
            })
        }
        let page=localStorage.getItem("pageNumber_receive_report");
        this.checkingParameter(page!==undefined&&page!==null?page:1);
    }
    componentWillReceiveProps = (nextProps) => {
        let type = [
            {kode:"",value: "Semua Tipe"},
            {kode:"0",value: "Tunai"},
            {kode:"1",value: "Non Tunai"},
        ];
        let data_type=[];
        type.map((i) => {
            data_type.push({
                value: i.kode,
                label: i.value
            });
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
    checkingParameter(pageNumber){
        let where='';
        let dateFrom=localStorage.getItem("date_from_receive_report");
        let dateTo=localStorage.getItem("date_to_receive_report");
        let tipe=localStorage.getItem("type_receive_report");
        let lokasi=localStorage.getItem("location_receive_report");
        let any=localStorage.getItem("any_receive_report");
        if(dateFrom!==null&&dateTo!==null){
            if(where!==''){where+='&'}where+=`datefrom=${dateFrom}&dateto=${dateTo}`
        }else{
            if(where!==''){where+='&'}where+=`datefrom=${this.state.startDate}&dateto=${this.state.endDate}`
        }
        if(tipe!==undefined&&tipe!==null&&tipe!==''){
            if(where!==''){where+='&'}where+=`type=${tipe}`
        }
        if(lokasi!==undefined&&lokasi!==null&&lokasi!==''){
            if(where!==''){where+='&'}where+=`lokasi=${lokasi}`
        }
        if(any !== undefined&&any!==null&&any!==''){
            if(where!==''){where+='&'}where+=`q=${any}`
        }
        this.props.dispatch(FetchReport(pageNumber===null?1:pageNumber,where));
        this.props.dispatch(FetchReportExcel(where));
    }
    handleChange(event){
        this.setState({ [event.target.name]: event.target.value });
    }
    HandleChangeType(type) {
        console.log("TIPE",type.value);
        this.setState({
            type: type.value,
        });
        localStorage.setItem('type_sale_report', type.value);
    }
    HandleChangeLokasi(lk) {
        console.log("LOKASI",lk.value);
        this.setState({
            location: lk.value,
        });
        localStorage.setItem('location_receive_report', lk.value);
    }
    handleEvent = (event, picker) => {
        const awal = picker.startDate._d.toISOString().substring(0,10);
        const akhir = picker.endDate._d.toISOString().substring(0,10);
        localStorage.setItem("date_from_receive_report",`${awal}`);
        localStorage.setItem("date_to_receive_report",`${akhir}`);
        this.setState({
            startDate:awal,
            endDate:akhir
        });
    };
    handlePageChange(pageNumber){
        localStorage.setItem("pageNumber_receive_report",pageNumber);
        this.checkingParameter(pageNumber);
    }
    handleSearch(e){
        e.preventDefault();
        localStorage.setItem("any_receive_report",this.state.any_receive_report);
        this.checkingParameter(1);
    }
    toggleModal(e, kdTrx,tgl,lokasi,penerima,pelunasan,operator) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("receiveReportDetail"));
        let que=`detail_receive_report`;
        localStorage.setItem(`kd_trx_${que}`,kdTrx);
        localStorage.setItem(`tgl_${que}`,tgl);
        localStorage.setItem(`lokasi_${que}`,lokasi);
        localStorage.setItem(`penerima_${que}`,penerima);
        localStorage.setItem(`pelunasan_${que}`,pelunasan);
        localStorage.setItem(`operator_${que}`,operator);
        this.props.dispatch(FetchReportDetail(1,kdTrx));
    }
    handleRetur(e,kode){
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formReturReceive"));
        this.props.dispatch(FetchReceiveData(kode))
    }
    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        const {total,last_page,per_page,current_page,from,to,data} = this.props.data;
        return (
            <Layout page="Laporan Pembelian">
                <div className="col-12 box-margin">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-6 col-xs-6 col-md-2">
                                    <div className="form-group">
                                        <label htmlFor=""> Periode </label>
                                        <div className="customDatePickerWidth">
                                            <DateRangePicker
                                                ranges={rangeDate}
                                                alwaysShowCalendars={true}
                                                onEvent={this.handleEvent}
                                                showDropdowns={true}
                                                autoUpdateInput={true}
                                            >
                                                <input type="text" id="date" className="form-control" name="date_sale_report" value={`${this.state.startDate} to ${this.state.endDate}`}/>
                                            </DateRangePicker>
                                        </div>
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
                                            Tipe Transaksi
                                        </label>
                                        <Select
                                            options={this.state.type_data}
                                            placeholder="Pilih Tipe Transaksi"
                                            onChange={this.HandleChangeType}
                                            value={
                                                this.state.type_data.find(op => {
                                                    return op.value === this.state.type
                                                })
                                            }

                                        />
                                    </div>
                                </div>
                                <div className="col-6 col-xs-6 col-md-2">
                                    <div className="form-group">
                                        <label htmlFor="">Cari</label>
                                        <input type="text" name="any_receive_report" className="form-control" value={this.state.any_receive_report}  onChange={(e)=>this.handleChange(e)}/>
                                    </div>
                                </div>
                                <div className="col-6 col-xs-6 col-md-3">
                                    <div className="form-group">
                                        <label className="control-label font-12"></label>
                                        <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary" onClick={this.handleSearch}>
                                            <i className="fa fa-search"></i>
                                        </button>
                                        <ReactHTMLTableToExcel
                                            className="btn btn-primary btnBrg"
                                            table="report_receive_to_excel"
                                            filename="laporan_pembelian"
                                            sheet="laporan pembelian"
                                            buttonText="export excel">
                                        </ReactHTMLTableToExcel>
                                    </div>

                                </div>


                            </div>
                            <div className="table-responsive" style={{overflowX: "auto"}}>
                                <table className="table table-hover table-bordered" id="report_receive_to_excel" style={{display:"none"}}>
                                    <thead className="bg-light">
                                    <tr>
                                        <th className="text-black" colSpan={15}>{this.state.startDate} - {this.state.startDate}</th>
                                    </tr>
                                    <tr>
                                        <th className="text-black" colSpan={15}>{this.state.location===''?'SEMUA LOKASI':this.state.location}</th>
                                    </tr>
                                    <tr>
                                        <th className="text-black" style={columnStyle}>No Faktur</th>
                                        <th className="text-black" style={columnStyle}>Tanggal</th>
                                        <th className="text-black" style={columnStyle}>Penerima</th>
                                        <th className="text-black" style={columnStyle}>Tipe</th>
                                        <th className="text-black" style={columnStyle}>Pelunasan</th>
                                        <th className="text-black" style={columnStyle}>Diskon</th>
                                        <th className="text-black" style={columnStyle}>PPN</th>
                                        <th className="text-black" style={columnStyle}>Supplier</th>
                                        <th className="text-black" style={columnStyle}>Operator</th>
                                        <th className="text-black" style={columnStyle}>Lokasi</th>
                                        <th className="text-black" style={columnStyle}>Serial</th>
                                        <th className="text-black" style={columnStyle}>Kontrabon</th>
                                        <th className="text-black" style={columnStyle}>Jumlah Kontabon</th>
                                        <th className="text-black" style={columnStyle}>Qty Beli</th>
                                        <th className="text-black" style={columnStyle}>Total Beli</th>
                                    </tr>
                                    </thead>
                                    {
                                        !this.props.isLoading ? (
                                            <tbody>
                                            {
                                                (
                                                    typeof data === 'object' ? data.length>0?
                                                        data.map((v,i)=>{
                                                            return(
                                                                <tr key={i}>

                                                                    <td style={columnStyle}>{v.no_faktur_beli}</td>
                                                                    <td style={columnStyle}>{moment(v.tgl_beli).format("YYYY-MM-DD")}</td>
                                                                    <td style={columnStyle}>{v.nama_penerima}</td>
                                                                    <td style={columnStyle}>{v.type}</td>
                                                                    <td style={columnStyle}>{v.pelunasan}</td>
                                                                    <td style={columnStyle}>{v.disc}</td>
                                                                    <td style={columnStyle}>{v.ppn}</td>
                                                                    <td style={columnStyle}>{v.supplier}</td>
                                                                    <td style={columnStyle}>{v.operator}</td>
                                                                    <td style={columnStyle}>{v.lokasi}</td>
                                                                    <td style={columnStyle}>{v.serial}</td>
                                                                    <td style={columnStyle}>{v.kontabon}</td>
                                                                    <td style={columnStyle}>{v.jumlah_kontrabon}</td>
                                                                    <td style={columnStyle}>{v.qty_beli}</td>
                                                                    <td style={columnStyle}>{v.total_beli}</td>
                                                                </tr>
                                                            )
                                                        })
                                                        : "No data.":"No data."
                                                )
                                            }
                                            </tbody>
                                        ) : <Preloader/>
                                    }

                                </table>
                                <table className="table table-hover table-bordered" style={{zoom:"80%"}}>
                                    <thead className="bg-light">
                                    <tr>
                                        <th className="text-black" style={columnStyle}>#</th>
                                        <th className="text-black" style={columnStyle}>No Faktur</th>
                                        <th className="text-black" style={columnStyle}>Tanggal</th>
                                        <th className="text-black" style={columnStyle}>Penerima</th>
                                        <th className="text-black" style={columnStyle}>Tipe</th>
                                        <th className="text-black" style={columnStyle}>Pelunasan</th>
                                        <th className="text-black" style={columnStyle}>Diskon</th>
                                        <th className="text-black" style={columnStyle}>PPN</th>
                                        <th className="text-black" style={columnStyle}>Supplier</th>
                                        <th className="text-black" style={columnStyle}>Operator</th>
                                        <th className="text-black" style={columnStyle}>Lokasi</th>
                                        <th className="text-black" style={columnStyle}>Serial</th>
                                        <th className="text-black" style={columnStyle}>Kontrabon</th>
                                        <th className="text-black" style={columnStyle}>Jumlah Kontabon</th>
                                        <th className="text-black" style={columnStyle}>Qty Beli</th>
                                        <th className="text-black" style={columnStyle}>Total Beli</th>
                                    </tr>
                                    </thead>
                                    {
                                        !this.props.isLoading ? (
                                            <tbody>
                                            {
                                                (
                                                    typeof data === 'object' ? data.length>0?
                                                        data.map((v,i)=>{
                                                            return(
                                                                <tr key={i}>
                                                                    <td style={columnStyle}>{/* Example split danger button */}
                                                                        <div className="btn-group">
                                                                            <button className="btn btn-primary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                Action
                                                                            </button>
                                                                            <div className="dropdown-menu">
                                                                                <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.toggleModal(
                                                                                    e,v.no_faktur_beli,
                                                                                    moment(v.tgl_beli).format("YYYY-MM-DD"),
                                                                                    v.lokasi,
                                                                                    v.nama_penerima,
                                                                                    v.pelunasan,
                                                                                    v.operator
                                                                                )}>Detail</a>
                                                                                <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.handleRetur(
                                                                                    e,v.no_faktur_beli
                                                                                )}>Retur</a>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td style={columnStyle}>{v.no_faktur_beli}</td>
                                                                    <td style={columnStyle}>{moment(v.tgl_beli).format("YYYY-MM-DD")}</td>
                                                                    <td style={columnStyle}>{v.nama_penerima}</td>
                                                                    <td style={columnStyle}>{v.type}</td>
                                                                    <td style={columnStyle}>{v.pelunasan}</td>
                                                                    <td style={columnStyle}>{v.disc}</td>
                                                                    <td style={columnStyle}>{v.ppn}</td>
                                                                    <td style={columnStyle}>{v.supplier}</td>
                                                                    <td style={columnStyle}>{v.operator}</td>
                                                                    <td style={columnStyle}>{v.lokasi}</td>
                                                                    <td style={columnStyle}>{v.serial}</td>
                                                                    <td style={columnStyle}>{v.kontabon}</td>
                                                                    <td style={columnStyle}>{v.jumlah_kontrabon}</td>
                                                                    <td style={columnStyle}>{v.qty_beli}</td>
                                                                    <td style={columnStyle}>{toRp(parseInt(v.total_beli))}</td>
                                                                </tr>
                                                            )
                                                        })
                                                        : "No data.":"No data."
                                                )
                                            }
                                            </tbody>
                                        ) : <Preloader/>
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
                            <DetailReceiveReport receiveReportDetail={this.props.receiveReportDetail}/>
                            <FormReturReceive dataRetur={this.props.dataRetur}/>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        data:state.receiveReducer.data,
        isLoading: state.receiveReducer.isLoading,
        // isLoadingReportDetail: state.receiveReducer.isLoadingReportDetail,
        receiveReportDetail:state.receiveReducer.dataReceiveReportDetail,
        dataRetur:state.receiveReducer.receive_data,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
        auth: state.auth
    }
}

export default connect(mapStateToProps)(ReceiveReport)