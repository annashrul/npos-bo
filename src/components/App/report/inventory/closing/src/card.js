import React,{Component} from 'react'
import moment from 'moment';
import { toRp } from 'helper';
import connect from "react-redux/es/connect/connect";
import Swal from "sweetalert2";
import {reClosing} from "redux/actions/report/closing/closing.action";

class Card extends Component {
    constructor(props) {
        super(props);

        this.handleReclosing = this.handleReclosing.bind(this);
    }

    handleReclosing(e, id, tanggal) {
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
                parseData['tgl'] = moment(tanggal).format("yyyy-MM-DD");
                console.log(parseData);
                this.props.dispatch(reClosing(parseData));
            }
        })

    }
    
    render(){
        const {item}=this.props;
        return(
            <div className="col-md-6 col-xl-4">
                <div className="card rounded box-margin">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-10">
                                <h6 className="mb-0">{item.kasir} - {item.nama_toko} ({item.kassa})</h6>
                                <p className="text-12 mb-0">{moment(item.tanggal).locale('id').format("LLLL")}</p>
                            </div>
                            <div className="col-2 text-right">
                                <div className="dashboard-dropdown">
                                    <div className="dropdown">
                                        <button className="btn dropdown-toggle" type="button" id="dashboardDropdown50" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="ti-more"></i></button>
                                        <div className="dropdown-menu dropdown-menu-right"
                                                aria-labelledby="dashboardDropdown50">
                                            <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.handleReclosing(e,item.id,item.tanggal)}><i className="fa fa-history"/>Reclosing</a>
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
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.gross_sales))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Discount Item</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.disc))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Discount Total</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.disc_tr))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Net Omset</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.net_omset))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Tax</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.tax))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Service</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.serv))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Rounding</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.rounding))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Total Omset</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.net_omset))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Cash</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.tunai))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">EDC Seatle</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.setoran_card))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Total Debit</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.total_debit))}</p>
                                    </div>
                                </div>
                                
                                    {
                                        item.list_debit.map((v, i) => {
                                            return(
                                                <div className="row" key={i}>
                                                    <div className="col-6">
                                                        <p className="text-9 mb-0 text-left">- {v.kartu}</p>
                                                    </div>
                                                    <div className="col-6" >
                                                        <p className="text-10 mb-0 text-right">({toRp(parseInt(v.jumlah))})</p>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Total Kredit</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.total_kredit))}</p>
                                    </div>
                                </div>
                                {
                                        item.list_kredit.map((v, i) => {
                                            console.log(i);
                                            return(
                                                <div className="row" key={i}>
                                                    <div className="col-6">
                                                        <p className="text-9 mb-0 text-left">- {v.kartu}</p>
                                                    </div>
                                                    <div className="col-6" >
                                                        <p className="text-10 mb-0 text-right">({toRp(parseInt(v.jumlah))})</p>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Compliment</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.setoran_compliment))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Point</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.setoran_poin))}</p>
                                    </div>
                                </div>
                                <hr style={{margin:'unset'}}></hr>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Receive Amount</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.income))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Other Income</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(0)}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Total Income</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.tunai)+parseInt(item.income))}</p>
                                    </div>
                                </div>
                                <hr style={{margin:'unset'}}></hr>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Cash in Hand</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.cash_in_hand))}</p>
                                    </div>
                                </div>
                                <hr style={{margin:'unset'}}></hr>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Return</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(item.total_retur)}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Tax</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.tax_retur))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Service</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.service_retur))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Discount</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.disc_retur))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Paid Out</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.kas_keluar))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Total Outcome</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.outcome))}</p>
                                    </div>
                                </div>
                                <hr style={{margin:'unset'}}></hr>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Total Cash Sales</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.total_cash_sales))}</p>
                                    </div>
                                </div>
                                <hr style={{margin:'unset'}}></hr>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Cashier Cash</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.cashier_cash))}</p>
                                    </div>
                                </div>
                                <hr style={{margin:'unset'}}></hr>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Status</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{item.status}</p>
                                    </div>
                                </div>
                                <hr style={{margin:'unset'}}></hr>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Note</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{item.keterangan?item.keterangan:'-'}</p>
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
    }
}

export default connect()(Card);