import React, { Component, useEffect } from 'react';
import {Link} from "react-router-dom"
import {connect} from 'react-redux'
import {withRouter} from "react-router-dom"
// import animate from 'animate.css'

class SideMenu extends Component {
    constructor(props){
        super(props);
        this.state ={
            isSetting:false,
            isMasterdata: false,
            isInventory: false,
            isReport: false,
            isReceive: false,
            isHutang:false,
            isSale:false,
            isReportInventory:false,
            isReportPembelian:false,
            isTrxMutasi:false,
            pageMenu : '',
            dataUser:[],
            dataUser0:'',
            product:'',
            user:'',
            department:'',
            supplier:'',
            location:'',
            customer:'',
            cash:'',
            sales:'',
            bank:'',
            activeMenu:'dashboard'
        }
        this.subChangeMenu = this.subChangeMenu.bind(this);
        this.changeMenu = this.changeMenu.bind(this);
    }

    subChangeMenu(e){
        this.setState({isMasterdata : true});
    }

    changeMenu(param){
        if(this.state.isReport === true){
            this.setState({
                isSetting:false,
                isMasterdata: false,
                isInventory: false,
                isReport: true,
                isReceive: false,
                isSale:false,
            })
            console.log("isReport", true)
            if(this.state.isReportInventory === true){
                this.setState({
                    isSetting:false,
                    isMasterdata: false,
                    isInventory: false,
                    isReport: true,
                    isReceive: false,
                    isSale:false,
                    isReportInventory:!this.state.isReportInventory,
                    isReportPembelian:false
                })
                console.log("isReportInventory",true);
            }
            if(this.state.isReportPembelian === true) {
                this.setState({
                    isSetting:false,
                    isMasterdata: false,
                    isInventory: false,
                    isReport: true,
                    isReceive: false,
                    isSale:false,
                    isReportInventory:false,
                    isReportPembelian:!this.state.isReportPembelian
                })
                console.log("isReportPembelian",true)
            }
        }
        else {
            this.setState({
                isSetting:false,
                isMasterdata: false,
                isInventory: false,
                isReport: false,
                isReceive: false,
                isSale:false,
                isReportInventory:false,
                isReportPembelian:false
            })
        }
        const path = this.props.location.pathname;
        if(param === 'setting'){
            this.setState({isSetting : !this.state.isSetting, isReport : false});
        }
        if(param === 'masterdata'){
            this.setState({isMasterdata : !this.state.isMasterdata, isReport : false});
        }
        if(this.state.isInventory === true){
            this.setState({
                isSetting:false,
                isMasterdata: false,
                isInventory: true,
                isReport: false,
                isReceive: false,
                isSale:false,
                isReportPembelian:false,
                isReportInventory:false,
            });
            if(this.state.isTrxMutasi === true){
                this.setState({
                    isSetting:false,
                    isMasterdata: false,
                    isInventory: false,
                    isReport: true,
                    isReceive: false,
                    isSale:false,
                    isReportPembelian:false,
                    isReportInventory:false,
                    isTrxMutasi:!this.state.isTrxMutasi,
                })
            }
        }
        else{
            this.setState({
                isSetting:false,
                isMasterdata: false,
                isInventory: false,
                isReport: false,
                isReceive: false,
                isSale:false,
                isTrxMutasi:false,
                isReportInventory:false,
                isReportPembelian:false
            })
        }
        if (param === 'inventory'){
            this.setState({
                isInventory : !this.state.isInventory, isReport : false
            });
        }
        if (param === 'trx_mutasi'){
            this.setState({
                isTrxMutasi : !this.state.isTrxMutasi,
            });
        }
        if(param === 'hutang'){
            this.setState({
                isHutang : !this.state.isHutang, isReport : false
            });
        }
        if(param === 'report'){
            this.setState({isReport : !this.state.isReport});
        }
        if(param === 'report_inventory'){
            this.setState({
                isReportInventory : !this.state.isReportInventory,
                // isReport : false
            });
        }
        if(param === 'report_pembelian'){
            this.setState({
                isReportPembelian: !this.state.isReportPembelian,
                // isReport : false
            });
        }
        if(param === 'receive'){
            this.setState({isReceive : !this.state.isReceive, isReport : false});
        }
        if(param === 'sale'){
            this.setState({isSale : !this.state.isSale, isReport : false});
        }
        this.forceUpdate();
        console.log("side menu state", this.state);
    }
    componentDidMount(){
        let dataUser=[];
        console.log("componentwillmount",this.props.auth.user.access);
        let loc =this.props.auth.user.access;
        if(loc!==undefined&&loc!==null){
            this.setState({
                product:this.props.auth.user.access[10]['label'],
                user:this.props.auth.user.access[11]['label'],
                department:this.props.auth.user.access[12]['label'],
                supplier:this.props.auth.user.access[13]['label'],
                location:this.props.auth.user.access[14]['label'],
                customer:this.props.auth.user.access[15]['label'],
                cash:this.props.auth.user.access[16]['label'],
                sales:this.props.auth.user.access[17]['label'],
                bank:this.props.auth.user.access[18]['label'],
            })
        }
        const path = this.props.location.pathname;
        if(path==='/user' || path==='/location' || path==='/company'){
            console.log("didmount",path)
            this.setState({
                isSetting:true
            })
        } else if(
            path==='/department' ||
            path==='/supplier' ||
            path==='/sales' ||
            path==='/cash' ||
            path==='/customer' ||
            path==='/product' ||
            path==='/bank'){
            console.log("didmount",path)
            this.setState({
                isMasterdata:true
            })
        } else if(
            path==='/delivery_note' ||
            path === '/alokasi' ||
            path === '/adjustment'||
            path === '/approval_mutasi'||
            path === '/opname'||
            path === '/approval_opname' ||
            path === '/approval_mutasi_transaksi'
        ){
            console.log("didmount",path)
            this.setState({
                isInventory:true
            });
            if(path==='/approval_mutasi_transaksi'){
                this.setState({
                    isTrxMutasi:true
                })
            }
        } else if(path==='/purchase_order' || path === '/receive'|| path === '/retur_tanpa_nota'){
            console.log("didmount",path)
            this.setState({
                isReceive:true
            })
        } else if(path==='/sale'){
            console.log("didmount",path)
            this.setState({
                isSale:true
            })
        } else if(
            path==='/report_cash'|| 
            path==='/sale_archive'|| 
            path==='/closing' ||
            path==='/inventory_report'||
            path==='/adjustment_report'|| 
            path==='/alokasi_report' ||
            path==='/po_report'||
            path==='/receive_report'
            ){
            console.log("didmount",path)
            this.setState({
                isReport:true
            })
            if(path==='/inventory_report'|| path==='/adjustment_report'|| path==='/alokasi_report'){
               console.log("didmount",path)
               this.setState({
                   isReportInventory:true
               })
           } else if(path==='/po_report'|| path==='/receive_report'){
               console.log("didmount",path)
               this.setState({
                   isReportPembelian:true
               })
           }
        } 
    }
    componentWillReceiveProps = (nextProps) => {
        console.log("componentWillReceiveProps", nextProps);
        if (nextProps.auth.user) {
            let loc =nextProps.auth.user.access;
            if(loc!==undefined&&loc!==null){
                this.setState({
                    product:nextProps.auth.user.access[10]['label']!==null?nextProps.auth.user.access[10]['label']:"0",
                    user:nextProps.auth.user.access[11]['label']!==null?nextProps.auth.user.access[11]['label']:"0",
                    department:nextProps.auth.user.access[12]['label']!==null?nextProps.auth.user.access[12]['label']:"0",
                    supplier:nextProps.auth.user.access[13]['label']!==null?nextProps.auth.user.access[13]['label']:"0",
                    location:nextProps.auth.user.access[14]['label']!==null?nextProps.auth.user.access[14]['label']:"0",
                    customer:nextProps.auth.user.access[15]['label']!==null?nextProps.auth.user.access[15]['label']:"0",
                    cash:nextProps.auth.user.access[16]['label']!==null?nextProps.auth.user.access[16]['label']:"0",
                    sales:nextProps.auth.user.access[17]['label']!==null?nextProps.auth.user.access[17]['label']:"0",
                    bank:nextProps.auth.user.access[18]['label']!==null?nextProps.auth.user.access[18]['label']:"0",
                })
            }
        }
        if (this.props.activePath !== nextProps.activePath) {
            this.setState({
              activePath: nextProps.activePath
            })
        }
        console.log("testttttt",this.state.activeMenu);
    }

     getSortByClass(){
        setTimeout(() => {
            return 'none';
          }, 500);
      }
    render() {
        // masterdata: [
        //     {id: 10, value: "0", isChecked: false,label:'product'},
        //     {id: 11, value: "0", isChecked: false,label:'user'},
        //     {id: 12, value: "0", isChecked: false,label:'department'},
        //     {id: 13, value: "0", isChecked: false,label:'supplier'},
        //     {id: 14, value: "0", isChecked: false,label:'location'},
        //     {id: 15, value: "0", isChecked: false,label:'customer'},
        //     {id: 16, value: "0", isChecked: false,label:'cash'},
        //     {id: 17, value: "0", isChecked: false,label:'sales'},
        //     {id: 18, value: "0", isChecked: false,label:'bank'},
        //     {id: 19, value: "0", isChecked: false,label:''},
        // ],
        const path = this.props.location.pathname;
        
        console.log("App Rendered!");
        console.log("App Rendered!", this.state.isSetting);
        return (
            <nav>
                <ul className="sidebar-menu" data-widget="tree">
                    <li  className={path==='/'?"active":''}><Link to="/"> <i className="zmdi zmdi-view-dashboard" /><span> Dashboard</span></Link></li>
                    <li className={"treeview" +(this.state.isSetting===true
                        || path==='/user'
                        || path==='/location'
                        || path==='/company'
                        ?" active menu-open" : ""
                        )
                    }>
                        <a href="javascript:void(0)" onClick={(e) => this.changeMenu('setting')}><i className="zmdi zmdi-apps" /> <span>Pengaturan</span> <i className="fa fa-angle-right" /></a>
                        <ul className={"treeview-menu animate__animated" + (this.state.isSetting===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isSetting===true
                        ?"block" : "none"}}>
                            <li className={path==='/company'?"active":''}><Link to="/company" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Perusahaan</Link></li>
                            <li className={path==='/user'?"active":''} ><Link to="/user" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />User</Link></li>
                            <li className={path==='/location'?"active":''} ><Link to="/location" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Lokasi</Link></li>
                        </ul>
                    </li>
                    <li className={ "treeview" +
                        (this.state.isMasterdata===true ||
                        path==='/department' ||
                        path==='/supplier' ||
                        path==='/sales' ||
                        path==='/cash' ||
                        path==='/customer' ||
                        path==='/product' ||
                        path==='/bank'
                            ?" active menu-open" : "")
                    }>
                        <a href="#" onClick={(e) => this.changeMenu('masterdata')}><i className="zmdi zmdi-apps" /> <span>Masterdata</span> <i className="fa fa-angle-right" /></a>
                        <ul className={"treeview-menu animate__animated" + (this.state.isMasterdata===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isMasterdata===true
                        ?"block" : "none"}}>
                            <li className={path==='/product'?"active":''} style={this.state.product==="0"?{"display":"none"}:{"display":"block"}}><Link to="/product" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Produk</Link></li>
                            <li className={path==='/department'?"active":''} style={this.state.department==="0"?{"display":"none"}:{"display":"block"}}><Link to="/department" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Departemen </Link></li>
                            <li className={path==='/supplier'?"active":''} style={this.state.supplier==="0"?{"display":"none"}:{"display":"block"}}><Link to="/supplier" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Supplier </Link></li>
                            <li className={path==='/customer'?"active":''} style={this.state.customer==="0"?{"display":"none"}:{"display":"block"}}><Link to="/customer" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Customer </Link></li>
                            <li className={path==='/cash'?"active":''} style={this.state.cash==="0"?{"display":"none"}:{"display":"block"}}><Link to="/cash" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Kas </Link></li>
                            <li className={path==='/sales'?"active":''} style={this.state.sales==="0"?{"display":"none"}:{"display":"block"}}><Link to="/sales" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Sales </Link></li>
                            <li className={path==='/bank'?"active":''} style={this.state.bank==="0"?{"display":"none"}:{"display":"block"}}><Link to="/bank" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Bank </Link></li>
                            <li className={path==='/promo'?"active":''} style={this.state.promo==="0"?{"display":"none"}:{"display":"block"}}><Link to="/promo" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Promo </Link></li>
                            {/*<li className={path==='/bank'?"active":''}><Link to="/bank" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Bank </Link></li>*/}
                        </ul>
                    </li>
                    <li className={"treeview" +
                        (this.state.isInventory===true || this.state.isTrxMutasi ||
                        path==='/delivery_note' || 
                        path === '/alokasi' ||
                        path === '/adjustment'||
                        path === '/approval_mutasi'||
                        path === '/opname'||
                        path === '/approval_opname'
                        ?" active menu-open" : "")}>
                        <a href="#" onClick={(e) => this.changeMenu('inventory')}><i className="zmdi zmdi-apps" /> <span>Inventory</span> <i className="fa fa-angle-right" /></a>
                        <ul className={"treeview-menu animate__animated" + (this.state.isInventory===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isInventory===true ?"block" : "none"}}>
                            <li className={path==='/delivery_note'?"active":''}><Link to="/delivery_note" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Delivery Note</Link></li>
                            <li className={path==='/alokasi'?"active":''}><Link to="/alokasi" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Alokasi </Link></li>
                            <li className={path==='/approval_mutasi'?"active":''}><Link to="/approval_mutasi" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Approval Mutasi </Link></li>
                            <li className={path==='/adjustment'?"active":''}><Link to="/adjustment" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Adjustment </Link></li>
                            <li className={path==='/opname'?"active":''}><Link to="/opname" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Opname </Link></li>
                            <li className={path==='/approval_opname'?"active":''}><Link to="/approval_opname" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Approval Opname </Link></li>
                            <li className={"treeview" + (this.state.isTrxMutasi===true || path==='/po_report'|| path==='/receive_report'?" active menu-open" : "")}>
                                <a href="#" onClick={(e) => this.changeMenu('trx_mutasi')}><i className="zmdi zmdi-apps" /> <span>Mutasi Transaksi</span> <i className="fa fa-angle-right"/></a>
                                <ul className={"treeview-menu animate__animated" + (this.state.isTrxMutasi===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isTrxMutasi===true
                                        ?"block" : "none"}}>
                                    <li className={path==='/approval_mutasi_transaksi'?"active":''}><Link to="/approval_mutasi_transaksi" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Approval Mutasi Transaksi</Link></li>
                                    <li className={path==='/receive_report'?"active":''}><Link to="/receive_report" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Receive</Link></li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li className={"treeview" + (this.state.isReceive===true  || path==='/purchase_order' || path === '/receive'|| path === '/retur_tanpa_nota' ?" active menu-open" : "")}>
                        <a href="#" onClick={(e) => this.changeMenu('receive')}><i className="zmdi zmdi-apps" /> <span>Pembelian</span> <i className="fa fa-angle-right" /></a>
                        <ul className={"treeview-menu animate__animated" + (this.state.isReceive===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isReceive===true
                        ?"block" : "none"}}>
                            <li className={path==='/purchase_order'?"active":''}><Link to="/purchase_order" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Purchase Order</Link></li>
                            <li className={path==='/receive'?"active":''}><Link to="/receive" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Receive Pembelian</Link></li>
                            <li className={path==='/retur_tanpa_nota'?"active":''}><Link to="/retur_tanpa_nota" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Retur Tanpa Nota</Link></li>
                        </ul>
                    </li>
                    <li className={"treeview" + (this.state.isSale===true  || path==='/sale'?" active menu-open" : "")}>
                        <a href="#" onClick={(e) => this.changeMenu('sale')}><i className="zmdi zmdi-apps" /> <span>Penjualan</span> <i className="fa fa-angle-right" /></a>
                        <ul className={"treeview-menu animate__animated" + (this.state.isSale===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isSale===true
                        ?"block" : "none"}}>
                            <li className={path==='/sale'?"active":''}><Link to="/sale" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Penjualan Barang</Link></li>
                        </ul>
                    </li>
                    <li className={"treeview" + (this.state.isReport===true || this.state.isReportInventory===true || this.state.isReportPembelian===true ||
                        path==='/report_cash'|| 
                        path==='/closing'|| 
                        path==='/sale_archive'
                        ?" active menu-open" : "")}>
                        <a href="#" onClick={(e) => this.changeMenu('report')}><i className="zmdi zmdi-apps" /> <span>Report</span> <i className="fa fa-angle-right" /></a>
                        <ul className={"treeview-menu animate__animated" + (this.state.isReport===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isReport===true || this.state.isReportInventory===true || this.state.isReportPembelian===true
                        ?"block" : "none"}}>
                            <li className={path==='/closing'?"active":''}><Link to="/closing" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Closing</Link></li>
                            <li className={path==='/report_cash'?"active":''}><Link to="/report_cash" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Kas</Link></li>
                            <li className={path==='/sale_archive'?"active":''}><Link to="/sale_archive" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Arsip Penjualan</Link></li>
                            <li className={"treeview" + (this.state.isReportInventory===true || path==='/inventory_report'|| path==='/adjustment_report'|| path==='/alokasi_report'?" active menu-open" : "")}>
                                <a href="#" onClick={(e) => this.changeMenu('report_inventory')}>Inventory <i className="fa fa-angle-right"></i></a>
                                <ul className={"treeview-menu animate__animated" + (this.state.isReportInventory===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isReportInventory===true
                        ?"block" : "none"}}>
                                    <li className={path==='/inventory_report'?"active":''}><Link to="/inventory_report" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Stock</Link></li>
                                    <li className={path==='/adjustment_report'?"active":''}><Link to="/adjustment_report" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Adjustment</Link></li>
                                    <li className={path==='/alokasi_report'?"active":''}><Link to="/alokasi_report" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Alokasi</Link></li>
                                </ul>
                            </li>
                            <li className={"treeview" + (this.state.isReportPembelian===true || path==='/po_report'|| path==='/receive_report'?" active menu-open" : "")}>
                                <a href="#" onClick={(e) => this.changeMenu('report_pembelian')}>Pembelian <i className="fa fa-angle-right"></i></a>
                                <ul className={"treeview-menu animate__animated" + (this.state.isReportPembelian===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isReportPembelian===true
                        ?"block" : "none"}}>
                                    <li className={path==='/po_report'?"active":''}><Link to="/po_report" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Purchase Order</Link></li>
                                    <li className={path==='/receive_report'?"active":''}><Link to="/receive_report" style={{width:'fit-content'}}> <i className="zmdi zmdi-apps" />Receive</Link></li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li  className={path==='/cetak_barcode'?"active":''}><Link to="/cetak_barcode"> <i className="zmdi zmdi-apps" /><span>Cetak Barcode </span></Link></li>

                </ul>
            </nav>
            )
    }
}

const mapStateToProps = (state) => {
    return{
        auth: state.auth
    }
}

export default withRouter(connect(mapStateToProps)(SideMenu))