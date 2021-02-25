import React,{Component} from 'react'
import moment from 'moment';
import { toRp } from 'helper';
import connect from "react-redux/es/connect/connect";
import Swal from "sweetalert2";
import {reClosing} from "redux/actions/report/closing/closing.action";
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';

class Card extends Component {
    constructor(props) {
        super(props);

        this.handleReclosing = this.handleReclosing.bind(this);
    }

    handleReclosing(e, id, tanggal) {
        e.preventDefault();
        Swal.fire({allowOutsideClick: false,
            title: 'Reclosing?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes, Reclosing!'
        }).then((result) => {
            if (result.value) {
                let parseData = {};
                parseData['id'] = id;
                parseData['tgl'] = moment(tanggal).format("yyyy-MM-DD");
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
                                    <UncontrolledButtonDropdown>
                                            <DropdownToggle caret style={{background:'transparent',border:'none'}}>
                                                <i className="zmdi zmdi-more-vert"></i>
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem onClick={(e)=>this.handleReclosing(e,item.id,item.tanggal)}><i className="fa fa-history"></i> Reclosing</DropdownItem>
                                            </DropdownMenu>
                                    </UncontrolledButtonDropdown>
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
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.gross_sales,10))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Discount Item</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.disc,10))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Discount Total</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.disc_tr,10))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Net Omset</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.net_omset,10))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Tax</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.tax,10))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Service</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.serv,10))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Rounding</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.rounding,10))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Total Omset</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.net_omset,10))}</p>
                                    </div>
                                </div>
                                <hr style={{margin:'unset'}}></hr>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Cash</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.net_omset,10)-parseInt(item.setoran_card,10))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Piutang</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.piutang,10))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">EDC Seatle</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.setoran_card,10))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Total Debit</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.total_debit,10))}</p>
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
                                                        <p className="text-10 mb-0 text-right">({toRp(parseInt(v.jumlah,10))})</p>
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
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.total_kredit,10))}</p>
                                    </div>
                                </div>
                                {
                                        item.list_kredit.map((v, i) => {
                                            return(
                                                <div className="row" key={i}>
                                                    <div className="col-6">
                                                        <p className="text-9 mb-0 text-left">- {v.kartu}</p>
                                                    </div>
                                                    <div className="col-6" >
                                                        <p className="text-10 mb-0 text-right">({toRp(parseInt(v.jumlah,10))})</p>
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
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.setoran_compliment,10))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Point</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.setoran_poin,10))}</p>
                                    </div>
                                </div>
                                <hr style={{margin:'unset'}}></hr>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Receive Amount</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.income,10))}</p>
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
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.income,10))}</p>
                                    </div>
                                </div>
                                <hr style={{margin:'unset'}}></hr>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Cash in Hand</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp((parseInt(item.net_omset,10)-parseInt(item.setoran_card,10))+parseInt(item.income,10))}</p>
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
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.tax_retur,10))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Service</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.service_retur,10))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Discount</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.disc_retur,10))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Paid Out</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.kas_keluar,10))}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Total Outcome</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.outcome,10))}</p>
                                    </div>
                                </div>
                                <hr style={{margin:'unset'}}></hr>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Total Cash Sales</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.total_cash_sales,10))}</p>
                                    </div>
                                </div>
                                <hr style={{margin:'unset'}}></hr>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="text-10 mb-0 text-left">Cashier Cash</p>
                                    </div>
                                    <div className="col-6" >
                                        <p className="text-12 mb-0 text-right">{toRp(parseInt(item.cashier_cash,10))}</p>
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