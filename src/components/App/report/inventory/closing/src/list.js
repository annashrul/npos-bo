import React,{Component} from 'react'
import PropTypes from 'prop-types';
import Paginationq from "helper";
import {FetchClosing, reClosing} from "redux/actions/report/closing/closing.action";
import connect from "react-redux/es/connect/connect";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
// import DetailClosing from "components/App/modals/report/inventory/closing_report/detail_closing";
import Preloader from "Preloader";
import Select from 'react-select';
import moment from "moment";
import 'moment/locale/id'
import Swal from "sweetalert2";
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
        // this.toggle = this.toggle.bind(this);
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.state={
            location_data:[],
            location:"",
            startDate:localStorage.getItem("startDateClosing")===''?moment(new Date()).format("yyyy-MM-DD"):localStorage.getItem("startDateClosing"),
            endDate:localStorage.getItem("endDateClosing")===''?moment(new Date()).format("yyyy-MM-DD"):localStorage.getItem("endDateClosing"),
            token:'',
            detail:{}
        }
    }
    
    handlePageChange(pageNumber){
        this.setState({activePage: pageNumber});
        localStorage.setItem("page_closing_report",pageNumber);
        this.props.dispatch(FetchClosing(pageNumber))
    }
    
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
    };
    
    componentWillReceiveProps = (nextProps) => {
        console.log("=================== nextProps closing",nextProps);
        if (nextProps.auth.user) {
          let lk = []
          let loc = nextProps.auth.user.lokasi;
          if(loc!==undefined){
              lk.push({
                  value: "-",
                  label: "Semua Lokasi"
              });
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
              console.log("get loc closing",loc);
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

    handleReclosing(e,id){
        e.preventDefault();
        Swal.fire({
            title: 'Reclosing?',
            // text: "You won't be able to revert this!",
            icon: 'info',
            showCancelButton: true,
            // confirmButtonColor: '#3085d6',
            // cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Reclosing!'
          }).then((result) => {
            if (result.value) {
                let parseData = {}
                parseData['id'] = id;
                parseData['tgl'] = moment(new Date()).format("YYYY-MM-DD");
                console.log("data reclosing",parseData);
                this.props.dispatch(reClosing(parseData))
            }
          })
        
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
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-infor-mation d-flex flex-wrap align-items-center mb-3">
                                <div className="col-4 text-left">
                                    <div className="form-group">
                                        {/* <label className="control-label font-12">Periode </label> */}
                                        <DateRangePicker
                                            className='float-right'
                                            style={{marginTop:1}}
                                            ranges={range}
                                            alwaysShowCalendars={true}
                                            onEvent={this.handleEvent}
                                        >
                                            <input type="text" className="form-control" name="date_closing" value={`${this.state.startDate} to ${this.state.endDate}`} style={{padding: '9px',width: '185px',fontWeight:'bolder'}}/>
                                        </DateRangePicker>
                                    </div>
                                </div>
                                <div className="col-4 text-left">
                                    <div className="form-group">
                                        {/* <label className="control-label font-12">
                                        Lokasi
                                        </label> */}
                                        <Select 
                                            options={this.state.location_data} 
                                            placeholder = "Pilih Lokasi"
                                            defaultValue={{ label: "Select Location", value: "-" }}
                                            onChange={this.HandleChangeLokasi}
                                            value = {
                                                this.state.location_data.find(op => {
                                                return op.value === this.state.location
                                                })
                                            }
                                            />
                                        {/* <div class="invalid-feedback" style={this.state.error.location!==""?{display:'block'}:{display:'none'}}>
                                            {this.state.error.location}
                                        </div> */}
                                    </div>
                                </div>
                                <div className="col-4 text-left" style={{paddingRight:'unset'}}>
                                    <div className="form-group">
                                        <button type="button" className="btn btn-primary">SHOW</button>
                                    </div>
                                </div>

                        </div>
                    </div>
                </div>
                <div className="row">
                    {
                        (
                            typeof data==='object'? data.map((v,i)=> {
                                let net = (parseFloat(v.st)-parseFloat(v.disc)-parseFloat(v.disc_tr));
                                let gs = (parseFloat(net)+parseFloat(v.rounding)+parseFloat(v.tax)+parseFloat(v.serv));

                                let tunai = (parseFloat(gs)+parseFloat(v.setoran_card));
                                let uang = (tunai+v.compliment+v.card+v.deposit);
                                let cash_sales = tunai+v.income-v.outcome
                                return (
                                    <div className="col-md-6 col-xl-4" key={i}>
                                        <div className="card rounded box-margin">
                                            <div className="card-body">
                                                        <div className="row">
                                                            <div className="col-10">
                                                                    <h6 className="mb-0">{v.lokasi}</h6>
                                                                    <p className="text-12 mb-0">{moment(v.tanggal).locale('id').format("LLLL")}</p>
                                                            </div>
                                                            <div className="col-2 text-right">
                                                                <div className="dashboard-dropdown">
                                                                    <div className="dropdown">
                                                                        <button className="btn dropdown-toggle" type="button" id="dashboardDropdown50" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="ti-more"></i></button>
                                                                        <div className="dropdown-menu dropdown-menu-right"
                                                                            aria-labelledby="dashboardDropdown50">
                                                                            <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.handleReclosing(e,v.id)}><i className="fa fa-history"></i> Reclosing</a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <hr></hr>
                                                                {/* <button type="submit" className="btn btn-primary"><i className="fa fa-excel"> Re-closing</i></button> */}
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">Total Sales</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(v.total_cash_sales))}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">Discount Item</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(v.disc))}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">Discount Total</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(v.disc_tr))}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">Net Omset</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(v.net_omset))}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">Tax</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(v.tax))}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">Service</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(v.serv))}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">Rounding</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(v.rounding))}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">Total Omset</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(gs))}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">Cash</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(tunai))}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">EDC Seatle</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(v.setoran_card))}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">Total Debit</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(v.total_debit))}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">Total Kredit</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(v.total_kredit))}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">Compliment</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(v.setoran_compliment))}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">Point</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(v.setoran_poin))}</p>
                                                                    </div>
                                                                </div>
                                                                <hr style={{margin:'unset'}}></hr>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">Receive Amount</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(v.cashier_cash))}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">Other Income</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(v.outcome))}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">Total Income</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(v.income))}</p>
                                                                    </div>
                                                                </div>
                                                                <hr style={{margin:'unset'}}></hr>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">Cash in Hand</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(v.cash_in_hand))}</p>
                                                                    </div>
                                                                </div>
                                                                <hr style={{margin:'unset'}}></hr>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">Return</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{toRp(v.total_retur)}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">Tax</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(v.tax_retur))}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">Service</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(v.serv_retur))}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">Discount</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(v.disc_retur))}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">Paid Out</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(v.kas_keluar))}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">Total Outcome</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(v.outcome))}</p>
                                                                    </div>
                                                                </div>
                                                                <hr style={{margin:'unset'}}></hr>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">Total Cash Sales</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(v.total_cash_sales))}</p>
                                                                    </div>
                                                                </div>
                                                                <hr style={{margin:'unset'}}></hr>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">Cashier Cash</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(v.cashier_cash))}</p>
                                                                    </div>
                                                                </div>
                                                                <hr style={{margin:'unset'}}></hr>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">Status</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{v.status}</p>
                                                                    </div>
                                                                </div>
                                                                <hr style={{margin:'unset'}}></hr>
                                                                <div className="row">
                                                                    <div className="col-6">
                                                                        <p className="text-10 mb-0 text-left">Note</p>
                                                                    </div>
                                                                    <div className="col-6" >
                                                                        <p className="text-12 mb-0 text-right">{toRp(v.keterangan)}</p>
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

ListClosing.propTypes = {
    auth: PropTypes.object
}
const mapStateToProps = (state) => {
    console.log("mapStateToProps",state);
    return {
        // detail:this.state.detail,
        auth:state,
        isLoading: state.closingReducer.isLoading,
        closingDetail:state.closingReducer.closing_data,
        // isLoadingDetailSatuan: state.stockReducer.isLoadingDetailSatuan,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
};

export default connect(mapStateToProps)(ListClosing);