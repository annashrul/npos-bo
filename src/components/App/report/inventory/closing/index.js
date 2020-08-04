import React,{Component} from 'react'
import Layout from 'components/App/Layout'
import Preloader from "Preloader";
import connect from "react-redux/es/connect/connect";
import Paginationq from "helper";
import {FetchClosing, reClosing} from "redux/actions/report/closing/closing.action";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import Select from 'react-select';
import moment from "moment";
import Swal from "sweetalert2";
import {HEADERS} from 'redux/actions/_constants'
import { toRp } from 'helper';
import DatePicker from 'react-datepicker';
import 'moment/locale/id'


class Closing extends Component{
    constructor(props){
        super(props);
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.handleEvent=this.handleEvent.bind(this);
        this.handleSearch=this.handleSearch.bind(this);
        this.state={
            location_data:[],
            location:"",
            startDate:new Date(),
            token:'',
            detail:{}
        }
    }
    getProps(param){
        if (param.auth.user) {
            let lk = [{
                value: 'all',
                label: 'Semua'
            }]
            let loc = param.auth.user.lokasi;
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
    componentWillMount(){
        this.getProps(this.props);
    }
    componentWillReceiveProps = (nextProps) => {
        this.getProps(nextProps);
    }
    componentDidMount(){

        if(localStorage.location_report_closing!==undefined&&localStorage.location_report_closing!==null){
            this.setState({
                location: localStorage.location_report_closing
            });
        }
    }
    handlePageChange(pageNumber){
        localStorage.setItem("page_closing_report",pageNumber);
        this.props.dispatch(FetchClosing(pageNumber,''))
    }

    handleEvent = date => {
        this.setState({
            startDate: date
        });
        console.log(moment(date).format("MM/DD/yyyy"))
    };


    HandleChangeLokasi(lk){
        this.setState({
            location:lk.value
        });

        localStorage.setItem('location_report_closing', lk.value);
    }

    handleReclosing(e,id){
        e.preventDefault();
        Swal.fire({
            title: 'Reclosing?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes, Reclosing!'
        }).then((result) => {
            if (result.value) {
                let parseData = {};
                parseData['id'] = id;
                parseData['tgl'] = moment(new Date()).format("yyyy-MM-DD");
                this.props.dispatch(reClosing(parseData));
            }
        })

    }

    handleSearch(e){
        e.preventDefault();
        let where='';
        if(this.state.startDate!==undefined&&this.state.startDate!==null){
            where+=`&datefrom=${moment(this.state.startDate).format("yyyy-MM-DD")}`;
        }
        if(this.state.location!==''&&this.state.location!==undefined&&this.state.location!==null){
            where+=`&lokasi=${this.state.location}`;
        }
        this.props.dispatch(FetchClosing(1,where));
    }

    render(){
        const {total,last_page,per_page,current_page,from,to,data} = this.props.closing;
        return (
            <Layout page="Closing">
                <div className="col-12 box-margin">
                    <div className="card">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="control-label font-12">Tanggal</label>
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text"><i className="fa fa-calendar" /></span>
                                            </div>
                                            <DatePicker
                                                className="form-control"
                                                selected={this.state.startDate}
                                                onChange={this.handleEvent}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="control-label font-12">Lokasi</label>
                                        <Select
                                            options={this.state.location_data}
                                            placeholder = "Pilih Lokasi"
                                            onChange={this.HandleChangeLokasi}
                                            value = {
                                                this.state.location_data.find(op => {
                                                    return op.value === this.state.location
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="col-md-1">
                                    <div className="form-group">
                                        <button style={{marginTop:"28px"}} type="button" className="btn btn-primary" onClick={(e=>this.handleSearch(e))}><i className="fa fa-search"/></button>
                                    </div>
                                </div>
                            </div>
                            <hr/>
                            <div className="row" style={{zoom:"85%"}}>
                                {
                                    (
                                        typeof data==='object'? data.length > 0 ? data.map((v,i)=> {
                                            let net = (parseFloat(v.st)-parseFloat(v.disc)-parseFloat(v.disc_tr));
                                            let gs = (parseFloat(net)+parseFloat(v.rounding)+parseFloat(v.tax)+parseFloat(v.serv));

                                            let tunai = (parseFloat(gs)+parseFloat(v.setoran_card));
                                            let uang = (tunai+v.compliment+v.card+v.deposit);
                                            let cash_sales = tunai+v.income-v.outcome;
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
                                                                                <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.handleReclosing(e,v.id)}><i className="fa fa-history"/>Reclosing</a>
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
                                                                        <div className="col-6">
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
                                                                            <p className="text-12 mb-0 text-right">{toRp(parseInt(v.service_retur))}</p>
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
                                                                            <p className="text-12 mb-0 text-right">{v.keterangan?v.keterangan:'-'}</p>
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
                                        }):"No data." : (<p className="text-center">No Data.</p>)
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
                        </div>
                    </div>
                </div>
            </Layout>
            );
    }
}


const mapStateToProps = (state) => {
    return {
        closing:state.closingReducer.data,
        auth:state.auth,
        isLoading: state.closingReducer.isLoading,
        closingDetail:state.closingReducer.closing_data,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(Closing);