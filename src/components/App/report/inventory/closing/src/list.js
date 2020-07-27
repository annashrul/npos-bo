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
import DatePicker from 'react-datepicker';
class ListClosing extends Component{
    constructor(props){
        super(props);
        // this.toggle = this.toggle.bind(this);
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.hanleEvent=this.handleEvent.bind(this);
        this.state={
            location_data:[],
            location:"",
            startDate:new Date(),
            // endDate:localStorage.getItem("endDateClosing")==='' || localStorage.getItem("endDateClosing")===null || localStorage.getItem("endDateClosing")=== undefined?moment(new Date()).format("yyyy-MM-DD"):localStorage.getItem("endDateClosing"),
            token:'',
            detail:{}
        }
    }
    
    handlePageChange(pageNumber){
        this.setState({activePage: pageNumber});
        localStorage.setItem("page_closing_report",pageNumber);
        this.props.dispatch(FetchClosing(pageNumber, this.state.startDate,this.state.location))
    }
    
    handleEvent = date => {
        this.setState({
            startDate: date
        });
        console.log("date",date)
    };
    
    componentWillReceiveProps = (nextProps) => {
        console.log("nextProps", nextProps)
        if (nextProps.auth.user) {
            let lk = []
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
                    // userid: nextProps.auth.user.id
                })
                // console.log("nextProps lok 1", this.state.location_data)
                // console.log("nextProps bool 1", nextProps.auth.user)
                // console.log("nextProps lk 1", lk)
                // console.log("nextProps loc 1", loc)
            }
            // console.log("nextProps lok 2", this.state.location_data)
            // console.log("nextProps bool 2", nextProps.auth.user)
            // console.log("nextProps lk 2", lk)
            // console.log("nextProps loc 2", loc)
        }
        // console.log("nextProps lok 3", this.state.location_data)
        // console.log("nextProps bool 3", nextProps.auth.user)
    }
    HandleChangeLokasi(lk){
        this.setState({
            location:lk.value
        })
        localStorage.setItem('lk', lk.value);
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

    HandleSubmit(e){
        e.preventDefault()
        this.props.dispatch(FetchClosing(1,this.state.startDate,this.state.location))
        console.log("lok lagi", this.state.location_data)
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
        console.log("############ LOKASI ##############",this.state.location);
        return (

            <div>
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-infor-mation d-flex flex-wrap align-items-center mb-3">
                                <div className="col-4 text-left">
                                    <div className="form-group">
                                        {/* <label className="control-label font-12">Periode </label> */}
                                        <DatePicker
                                            className="form-control rounded-right"
                                            selected={this.state.startDate}
                                            onChange={this.handleEvent}
                                        />
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
                                            // defaultValue={{ label: "Select Location", value: "-" }}
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
                                        <button type="button" className="btn btn-primary" onClick={(e=>this.HandleSubmit(e))}>SHOW</button>
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
        auth:state.auth,
        isLoading: state.closingReducer.isLoading,
        closingDetail:state.closingReducer.closing_data,
        // isLoadingDetailSatuan: state.stockReducer.isLoadingDetailSatuan,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
};

export default connect(mapStateToProps)(ListClosing);