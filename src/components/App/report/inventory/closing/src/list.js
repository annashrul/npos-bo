import React,{Component} from 'react'
import Paginationq from "helper";
import {FetchClosing, FetchClosingDetail} from "redux/actions/report/closing/closing.action";
import connect from "react-redux/es/connect/connect";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
// import DetailClosing from "components/App/modals/report/inventory/closing_report/detail_closing";
import Preloader from "Preloader";
import Select from 'react-select';
import moment from "moment";
import 'moment/locale/id'
import DateRangePicker from 'react-bootstrap-daterangepicker';
import {HEADERS} from 'redux/actions/_constants'
import { toRp } from '../../../../../../helper';

const range = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
    "Last 7 Days": [moment().subtract(6, "days"), moment()],
    "Last 30 Days": [moment().subtract(29, "days"), moment()],
    "This Month": [moment().startOf("month"), moment().endOf("month")],
    "Last Month": [
        moment()
            .subtract(1, "month")
            .startOf("month"),
        moment()
            .subtract(1, "month")
            .endOf("month")
    ],
    "Last Year": [
        moment()
            .subtract(1, "year")
            .startOf("year"),
        moment()
            .subtract(1, "year")
            .endOf("year")
    ]
};

class ListClosing extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state={
            location:"",
            location_data:[],
            status: [
                {id: 1, value: "0",label:'Packing'},
                {id: 2, value: "1", label:'Packed'},
                {id: 3, value: "2", label:'Received'},
            ],
            startDate:localStorage.getItem("startDateClosing")===''?moment(new Date()).format("yyyy-MM-DD"):localStorage.getItem("startDateClosing"),
            endDate:localStorage.getItem("endDateClosing")===''?moment(new Date()).format("yyyy-MM-DD"):localStorage.getItem("endDateClosing"),
            token:'',
            detail:{}
        }
    }
    componentWillMount(){
        console.log("TOKEN LIST",this.props.token);
       this.setState({token:this.props.token});
    }
    handlePageChange(pageNumber){
        this.setState({activePage: pageNumber});
        localStorage.setItem("page_closing_report",pageNumber);
        this.props.dispatch(FetchClosing(pageNumber))
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
        this.props.dispatch(ModalType("detailClosing"));
        // this.setState({
        //     detail:{"code":localStorage.getItem("code")}
        // });
        // this.state.detail = {"code":"11111"};
        this.props.dispatch(FetchClosingDetail(1,code,'','',''))
    };
    handleEvent = (event, picker) => {
        console.log("start: ", picker.startDate);
        console.log("end: ", picker.endDate._d.toISOString());
        // end:  2020-07-02T16:59:59.999Z
        const awal = picker.startDate._d.toISOString().substring(0,10);
        const akhir = picker.endDate._d.toISOString().substring(0,10);
        localStorage.setItem("startDateProduct",`${awal}`);
        localStorage.setItem("endDateProduct",`${akhir}`);
        this.setState({
            startDate:awal,
            endDate:akhir
        });
        // console.log(picker.startDate._d.toISOString());
        // console.log(picker.endDate._d.toISOString());
    };
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.auth.user) {
          let lk = []
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
                userid: nextProps.auth.user.id
              })
          }
        }
      }
      HandleChangeLokasi(lk) {
        let err = Object.assign({}, this.state.error, {
            location: ""
        });
        console.log(err);
        this.setState({
            location: lk.value,
            error: err
        })
        localStorage.setItem('lk_closing_report', lk.value);
    }

    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        const {total,last_page,per_page,current_page,from,to,data} = this.props.data;
        // const {total_dn,total_stock_awal,total_stock_masuk,total_stock_keluar,total_stock_akhir} = this.props.total;

        // let total_dn_per=0;
        // let total_first_stock_per=0;
        // let total_last_stock_per=0;
        // let total_stock_in_per=0;
        // let total_stock_out_per=0;
        console.log("############ TOTAL DATA ##############",this.props.data);
        console.log("############ LOKASI ##############",this.state.location_data);
        return (

            <div>
                <div className="row">
                    <div className="col-6 col-xs-6 col-md-2">
                        <div className="form-group">
                            <label htmlFor=""> Periode </label>
                            <DateRangePicker
                                ranges={range}
                                alwaysShowCalendars={true}
                                onEvent={this.handleEvent}
                            >
                                <input type="text" className="form-control" name="date_product" value={`${this.state.startDate} to ${this.state.endDate}`}/>
                                {/*<input type="text" className="form-control" name="date_product" value={`${this.state.startDate} to ${this.state.endDate}`}/>*/}
                            </DateRangePicker>
                        </div>
                    </div>

                    <div className="col-6 col-xs-6 col-md-2">
                        <div className="form-group">
                            <label htmlFor="exampleFormControlSelect1">Destination</label>
                            <div className="input-group">
                                <select className="form-control form-control-lg" id="sort_name" name="sort_name">
                                    {
                                        this.state.location_data.map((v,i)=>{
                                            return (<option key={i} value={v.value} selected={localStorage.getItem('location')===v.value?true:false}>{v.label}</option>)
                                        })
                                    }
                                </select>
                                {/* <Select 
                                                    options={this.state.location_data} 
                                                    placeholder = "Pilih Lokasi"
                                                    defaultValue={{ label: "Select Location", value: "-" }}
                                                    onChange={this.HandleChangeLokasi}
                                                    value = {
                                                        this.state.location_data.find(op => {
                                                        return op.value === this.state.location
                                                        })
                                                    }
                                                    /> */}
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-xs-6 col-md-2">
                        <div className="form-group">
                            <label htmlFor="exampleFormControlSelect1">Status</label>
                            <div className="input-group">
                                <select className="form-control form-control-lg" id="status_closing_report" name="status_closing_report">
                                    {
                                        this.state.status.map((v,i)=>{
                                            return (<option key={i} value={v.value} selected={localStorage.getItem('status_closing_report')===v.value?true:false}>{v.label}</option>)
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-xs-6 col-md-2">
                    <label htmlFor="exampleFormControlSelect1">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                        <div className="form-group">
                            <input className={"form-control"} type={"text"}></input>
                            {/* <button style={{marginTop:"27px",marginRight:"2px"}} type="submit" className="btn btn-primary"><i className="fa fa-search"></i></button> */}
                        </div>
                    </div>
                    <div className="col-6 col-xs-6 col-md-4">
                        <div className="form-group">
                            <button style={{marginTop:"27px",marginRight:"2px"}} type="submit" className="btn btn-primary"><i className="fa fa-search"></i></button>
                            <button style={{marginTop:"27px",marginRight:"2px"}} type="submit" className="btn btn-primary"><i className="fa fa-excel"> Export Excel</i></button>
                            {/* <button style={{marginTop:"27px",marginRight:"2px"}} type="button" onClick={(e)=>this.toggleModal(e)} className="btn btn-primary"><i className="fa fa-plus"></i></button>
                            <button style={{marginTop:"27px",marginRight:"2px"}} type="button" onClick={this.exportPDF} className="btn btn-primary"><i className="fa fa-file-pdf-o"></i></button>
                            <ReactHTMLTableToExcel
                                className="btn btn-primary btnBrg"
                                table="emp"
                                filename="barang"
                                sheet="barang"
                                buttonText="export excel">
                            </ReactHTMLTableToExcel> */}
                        </div>
                    </div>
                </div>
                <div className="row">
                    {
                        (
                            typeof data==='object'? data.map((v,i)=> {
                                return (
                                    <div className="col-md-6 col-xl-4" key={i}>
                                        <div className="card rounded box-margin">
                                            <div className="card-body">
                                                {/* <div className="d-flex justify-content-between mb-2 pb-2">
                                                    <div className="d-flex align-items-center"> */}
                                                        {/* <img className="chat-img" src={v.foto===null||v.foto==='-'?profile:v.foto} alt=""/> */}
                                                        {/* card: "0"
                                                        cash_in_hand: "35194300.00300000"
                                                        cashier_cash: "3995350"
                                                        compliment: "0"
                                                        deposit: "0"
                                                        disc: "28000.0"
                                                        disc_retur: "0"
                                                        disc_tr: "11800"
                                                        gross_sales: "35194300.00"
                                                        id: "ST20200703LK/00011E"
                                                        income: "300000"
                                                        kas_keluar: "2780000"
                                                        kassa: "E"
                                                        kd_kasir: "1"
                                                        keterangan: ""
                                                        list_debit: []
                                                        list_kredit: []
                                                        lokasi: "LK/0001"
                                                        net_omset: "35180200.00"
                                                        outcome: 2780000
                                                        poin: "0"
                                                        rounding: "0"
                                                        serv: "0.0"
                                                        service_retur: "0"
                                                        setoran_card: "0"
                                                        setoran_compliment: "0"
                                                        setoran_poin: "0"
                                                        st: "35220000.00"
                                                        status: "Deficit (-28718950.00)"
                                                        tanggal: "2020-06-30T17:00:00.000Z"
                                                        tax: "14100.0"
                                                        tax_retur: "0"
                                                        total_cash_sales: 32714300
                                                        total_debit: 0
                                                        total_kredit: 0
                                                        total_retur: "0"
                                                        tunai: "35088107"
                                                        tunai_final: "35194300.00"
                                                        uang: "35194300.00" */}
                                                        <div className="row">
                                                            <div className="col-10">
                                                                {/* <div className="ml-3"> */}
                                                                    <h6 className="mb-0">{v.lokasi}</h6>
                                                                    <p className="text-12 mb-0">{moment(v.tanggal).locale('id').format("LLLL")}</p>
                                                                    <hr></hr>
                                                                    {/* <button type="submit" className="btn btn-primary"><i className="fa fa-excel"> Re-closing</i></button> */}
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">Total Sales</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">Discount Item</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">Discount Total</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">Discount Total</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">Net Omset</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">Tax</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 texttoRp-left(">Service)</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">Rounding</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">Total Omset</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">Cash</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">EDC Seatle</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">Total Debit</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">Total Kredit</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">Compliment</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">Point</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <hr style={{margin:'unset'}}></hr>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">Receive Amount</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">Other Income</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">Total Income</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <hr style={{margin:'unset'}}></hr>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">Cash in Hand</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <hr style={{margin:'unset'}}></hr>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">Return</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">Tax</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">Service</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">Discount</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">Paid Out</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">Total Outcome</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <hr style={{margin:'unset'}}></hr>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">Total Cash Sales</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <hr style={{margin:'unset'}}></hr>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">Cashier Cash</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <hr style={{margin:'unset'}}></hr>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">Status</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <hr style={{margin:'unset'}}></hr>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p className="text-10 mb-0 text-left">Note</p>
                                                                        </div>
                                                                        <div className="col-6" >
                                                                            <p className="text-12 mb-0 text-right">{toRp(v.total_cash_sales)}</p>
                                                                        </div>
                                                                    </div>
                                                                    {/* <p className="text-12 mb-0">{v.total_cash_sales}</p>
                                                                    <p className="text-12 mb-0">{v.total_cash_sales}</p>
                                                                    <p className="text-12 mb-0">{v.total_cash_sales}</p>
                                                                    <p className="text-12 mb-0">{v.total_cash_sales}</p>
                                                                    <p className="text-12 mb-0">{v.total_cash_sales}</p>
                                                                    <p className="text-12 mb-0">{v.total_cash_sales}</p>
                                                                    <p className="text-12 mb-0">{v.total_cash_sales}</p>
                                                                    <p className="text-12 mb-0">{v.total_cash_sales}</p>
                                                                    <p className="text-12 mb-0">{v.total_cash_sales}</p>
                                                                    <p className="text-12 mb-0">{v.total_cash_sales}</p>
                                                                    <p className="text-12 mb-0">{v.total_cash_sales}</p>
                                                                    <p className="text-12 mb-0">{v.total_cash_sales}</p>
                                                                    <p className="text-12 mb-0">{v.total_cash_sales}</p>
                                                                    <p className="text-12 mb-0">{v.total_cash_sales}</p>
                                                                    <p className="text-12 mb-0">{v.total_cash_sales}</p>
                                                                    <p className="text-12 mb-0">{v.total_cash_sales}</p>
                                                                    <p className="text-12 mb-0">{v.total_cash_sales}</p>
                                                                    <p className="text-12 mb-0">{v.total_cash_sales}</p>
                                                                    <p className="text-12 mb-0">{v.total_cash_sales}</p> */}
                                                                {/* </div> */}
                                                            </div>
                                                            <div className="col-2">
                                                                <div className="dashboard-dropdown">
                                                                    <div className="dropdown">
                                                                        <button className="btn dropdown-toggle" type="button" id="dashboardDropdown50" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="ti-more"></i></button>
                                                                        <div className="dropdown-menu dropdown-menu-right"
                                                                            aria-labelledby="dashboardDropdown50">
                                                                            <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.toggleEdit(e,v.id)}><i className="ti-pencil-alt"></i> Edit</a>
                                                                            <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.handleDetail(e,v.id)}><i className="ti-eye"></i> Detail</a>
                                                                            <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.handleDelete(e,v.id)}><i className="ti-trash"></i> Delete</a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                {/* </div>
                                            </div> */}
                                        </div>
                                    </div>
                                )
                            }):"No data."
                        )
                    }
                </div>
                <div style={{"marginTop":"20px","float":"right"}}>
                    <Paginationq
                        current_page={current_page}
                        per_page={per_page}
                        total={total}
                        callback={this.handlePageChange.bind(this)}
                    />
                </div>
               {/* <DetailClosing token={this.props.token} closingDetail={this.props.closingDetail}/> */}
                {/*<DetailStockTransaction token={this.props.token}/>*/}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    console.log("mapStateToProps",state);
    return {
        // detail:this.state.detail,
        isLoading: state.closingReducer.isLoading,
        closingDetail:state.closingReducer.closing_data,
        // isLoadingDetailSatuan: state.stockReducer.isLoadingDetailSatuan,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
};

export default connect(mapStateToProps)(ListClosing);