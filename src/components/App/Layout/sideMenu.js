import React, { Component, useEffect } from 'react';
import {Link} from "react-router-dom"
import {connect} from 'react-redux'
import {withRouter} from "react-router-dom"
// import animate from 'animate.css' //enable to activate animation for sidebar

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
            isReportPenjualan:false,
            isTrxMutasi:false,
            isProduction:false,
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

    changeMenu(e,param){
        e.preventDefault();
        if(this.state.isReport === true){
            this.setState({
                isSetting:false,
                isMasterdata: false,
                isInventory: false,
                isReport: true,
                isReceive: false,
                isSale:false,
                isProduction:false
            })
            if(this.state.isReportInventory === true){
                this.setState({
                    isSetting:false,
                    isMasterdata: false,
                    isInventory: false,
                    isReport: true,
                    isReceive: false,
                    isSale:false,
                    isReportInventory:!this.state.isReportInventory,
                    isReportPembelian:false,
                    isReportPenjualan:false
                })
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
                    isReportPembelian:!this.state.isReportPembelian,
                    isReportPenjualan:false
                })
            }
            if(this.state.isReportPenjualan === true) {
                this.setState({
                    isSetting:false,
                    isMasterdata: false,
                    isInventory: false,
                    isReport: true,
                    isReceive: false,
                    isSale:false,
                    isReportInventory:false,
                    isReportPembelian:false,
                    isReportPenjualan:!this.state.isReportPenjualan
                })
            }
        }
        else if(this.state.isInventory === true){
            this.setState({
                isSetting:false,
                isMasterdata: false,
                isInventory: true,
                isReport: false,
                isReceive: false,
                isSale:false,
                isReportPembelian:false,
                isReportInventory:false,
                isReportPenjualan:false,
                isProduction:false
            });

            if(this.state.isTrxMutasi === true){
                this.setState({
                    isSetting:false,
                    isMasterdata: false,
                    isInventory: true,
                    isReport: false,
                    isReceive: false,
                    isSale:false,
                    isReportPembelian:false,
                    isReportInventory:false,
                    isReportPenjualan:false,
                    isTrxMutasi:!this.state.isTrxMutasi,
                })
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
                isReportPembelian:false,
                isReportPenjualan:false,
                isProduction:false
            })
        }

        const path = this.props.location.pathname;
        if(param === 'setting'){
            this.setState({
                isSetting : !this.state.isSetting, 
                isReport : false,
                isInventory : false
            });
        }
        if(param === 'masterdata'){
            this.setState({
                isMasterdata : !this.state.isMasterdata, 
                isReport : false,
                isInventory : false
            });
        }
        if(param === 'production'){
            this.setState({
                isProduction : !this.state.isProduction,
                isInventory : false,
                isReport : false,
            });
        }
        if (param === 'inventory'){
            this.setState({
                isInventory : !this.state.isInventory, 
                isReport : false
            });
        }
        if (param === 'trx_mutasi'){
            this.setState({
                isTrxMutasi : !this.state.isTrxMutasi,
            });
        }
        if(param === 'hutang'){
            this.setState({
                isHutang : !this.state.isHutang, 
                isReport : false,
                isInventory : false
            });
        }
        if(param === 'report'){
            this.setState({
                isReport : !this.state.isReport,
                isInventory : false
            });
        }
        if(param === 'report_inventory'){
            this.setState({
                isReportInventory : !this.state.isReportInventory,
                isInventory : false
            });
        }
        if(param === 'report_pembelian'){
            this.setState({
                isReportPembelian: !this.state.isReportPembelian,
                isInventory : false
            });
        }
        if(param === 'report_penjualan'){
            this.setState({
                isReportPenjualan: !this.state.isReportPenjualan,
                isInventory : false
            });
        }
        if(param === 'receive'){
            this.setState({
                isReceive : !this.state.isReceive, 
                isReport : false,
                isInventory : false
            });
        }
        if(param === 'sale'){
            this.setState({
                isSale : !this.state.isSale, 
                isReport : false,
                isInventory : false
            });
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
            path==='/promo' ||
            path==='/bank'){
            console.log("didmount",path)
            this.setState({
                isMasterdata:true
            })
        } else if(
            path === '/delivery_note' ||
            path === '/alokasi' ||
            path === '/adjustment'||
            path === '/approval_mutasi'||
            path === '/opname'||
            path === '/approval_opname' ||
            path === '/packing' ||
            path === '/approval_mutasi_jual_beli' ||
            path === '/bayar_mutasi_jual_beli'
        ){
            console.log("didmount",path)
            this.setState({
                isInventory:true
            });
            if(
                path==='/approval_mutasi_jual_beli' ||
                path==='/bayar_mutasi_jual_beli'
                ){
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
            path==='/report/cash'|| 
            path==='/report/laba_rugi'|| 
            path==='/report/sale_archive'|| 
            path==='/report/sale_by_cust_archive'|| 
            path==='/report/closing' ||
            path==='/report/inventory'||
            path==='/report/adjustment'|| 
            path==='/report/alokasi' ||
            path==='/report/dn' ||
            path==='/report/opname' ||
            path==='/report/expedisi' ||
            path==='/report/mutation' ||
            path==='/report/alokasi_trx' ||
            path==='/report/production' ||

            path==='/report/po'||
            path==='/report/receive'
            ){
            console.log("didmount",path)
            this.setState({
                isReport:true
            })
            if(
                path==='/report/inventory'|| 
                path==='/report/adjustment'|| 
                path==='/report/alokasi' || 
                path==='/report/opname' || 
                path==='/report/expedisi' || 
                path==='/report/mutation' || 
                path==='/report/alokasi_trx' || 
                path==='/report/production' || 
                path==='/report/dn'){
               console.log("didmount",path)
               this.setState({
                   isReportInventory:true
               })
           } else if(
               path==='/report/po'||
               path==='/report/receive'){
               console.log("didmount",path)
               this.setState({
                   isReportPembelian:true
               })
           } else if(
               path==='/report/sale_archive' ||
               path==='/report/sale_by_cust_archive'
               ){
               console.log("didmount",path)
               this.setState({
                   isReportPenjualan:true
               })
           } 
        } else if(path==='/trx_produksi'||path==='/approval_produksi'){
            this.setState({
                isProduction:true
            })
        }
    }
    componentWillReceiveProps = (nextProps) => {
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
    }

     getSortByClass(){
        setTimeout(() => {
            return 'none';
          }, 500);
      }
    render() {
        const path = this.props.location.pathname;
        return (
            <nav>
                <ul className="sidebar-menu" data-widget="tree">
                    <li  className={path==='/'?"active":''}><Link to="/"> <i className="fa fa-dashboard" /><span> Dashboard</span></Link></li>

                    <li className={ "treeview" +
                        (this.state.isMasterdata===true ||
                        path==='/department' ||
                        path==='/supplier' ||
                        path==='/sales' ||
                        path==='/cash' ||
                        path==='/customer' ||
                        path==='/product' ||
                        path==='/promo' ||
                        path==='/bank'
                            ?" active menu-open" : "")
                    }>
                        <a href="#" onClick={(e) => this.changeMenu(e,'masterdata')}><i className="zmdi zmdi-receipt" /> <span>Master Data</span> <i className="fa fa-angle-right" /></a>
                        <ul className={"treeview-menu animate__animated" + (this.state.isMasterdata===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isMasterdata===true
                        ?"block" : "none"}}>
                            <li className={path==='/product'?"active":''} style={this.state.product==="0"?{"display":"none"}:{"display":"block"}}><Link to="/product" style={{width:'fit-content'}}> <i className="fa fa-list-alt" />Barang</Link></li>
                            <li className={path==='/department'?"active":''} style={this.state.department==="0"?{"display":"none"}:{"display":"block"}}><Link to="/department" style={{width:'fit-content'}}> <i className="zmdi zmdi-store-24" />Departmen</Link></li>
                            <li className={path==='/supplier'?"active":''} style={this.state.supplier==="0"?{"display":"none"}:{"display":"block"}}><Link to="/supplier" style={{width:'fit-content'}}> <i className="fa fa-truck" />Supplier </Link></li>
                            <li className={path==='/customer'?"active":''} style={this.state.customer==="0"?{"display":"none"}:{"display":"block"}}><Link to="/customer" style={{width:'fit-content'}}> <i className="fa fa-user" />Kustomer </Link></li>
                            <li className={path==='/cash'?"active":''} style={this.state.cash==="0"?{"display":"none"}:{"display":"block"}}><Link to="/cash" style={{width:'fit-content'}}> <i className="fa fa-money" />Kas </Link></li>
                            <li className={path==='/sales'?"active":''} style={this.state.sales==="0"?{"display":"none"}:{"display":"block"}}><Link to="/sales" style={{width:'fit-content'}}> <i className="fa fa-user-secret" />Sales </Link></li>
                            <li className={path==='/bank'?"active":''} style={this.state.bank==="0"?{"display":"none"}:{"display":"block"}}><Link to="/bank" style={{width:'fit-content'}}> <i className="fa fa-bank" />Bank </Link></li>
                            <li className={path==='/promo'?"active":''} style={this.state.promo==="0"?{"display":"none"}:{"display":"block"}}><Link to="/promo" style={{width:'fit-content'}}> <i className="fa fa-ticket" />Promo </Link></li>
                        </ul>
                    </li>

                    <li className={"treeview" +(this.state.isProduction===true
                        || path==='/trx_produksi'
                        || path==='/approval_produksi'
                        ?" active menu-open" : ""
                        )
                    }>
                        <a href="#" onClick={(e) => this.changeMenu(e,'production')}><i className="fa fa-product-hunt" /> <span>Produksi</span> <i className="fa fa-angle-right" /></a>
                        <ul className={"treeview-menu animate__animated" + (this.state.isProduction===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isProduction===true
                        ?"block" : "none"}}>
                            <li className={path==='/trx_produksi'?"active":''}><Link to="/trx_produksi" style={{width:'fit-content'}}> <i className="fa fa-adjust" />Transaksi</Link></li>
                            {/* <li className={path==='/approval_produksi'?"active":''} ><Link to="/approval_produksi" style={{width:'fit-content'}}> <i className="fa fa-check" />Approval</Link></li> */}
                        </ul>
                    </li>

                    <li className={"treeview" +
                        (this.state.isInventory===true || this.state.isTrxMutasi ||
                        path==='/delivery_note' ||
                        path === '/alokasi' ||
                        path === '/adjustment'||
                        path === '/approval_mutasi'||
                        path === '/opname'||
                        path === '/approval_opname'||
                        path === '/packing'
                        ?" active menu-open" : "")}>
                        <a href="#" onClick={(e) => this.changeMenu(e,'inventory')}><i className="zmdi zmdi-storage" /> <span>Inventory</span> <i className="fa fa-angle-right" /></a>
                        <ul className={"treeview-menu animate__animated" + (this.state.isInventory===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isInventory===true
                        ?"block" : "none"}}>
                            <li className={path==='/delivery_note'?"active":''}><Link to="/delivery_note" style={{width:'fit-content'}}> <i className="fa fa-sticky-note" />Delivery Note</Link></li>
                            <li className={path==='/alokasi'?"active":''}><Link to="/alokasi" style={{width:'fit-content'}}> <i className="fa fa-dropbox" />Alokasi </Link></li>
                            <li className={path==='/approval_mutasi'?"active":''}><Link to="/approval_mutasi" style={{width:'fit-content'}}> <i className="zmdi zmdi-calendar-check" />Approval Mutasi </Link></li>
                            <li className={path==='/adjustment'?"active":''}><Link to="/adjustment" style={{width:'fit-content'}}> <i className="fa fa-adjust" />Adjustment </Link></li>
                            <li className={path==='/opname'?"active":''}><Link to="/opname" style={{width:'fit-content'}}> <i className="fa fa-balance-scale" />Opname </Link></li>
                            <li className={path==='/approval_opname'?"active":''}><Link to="/approval_opname" style={{width:'fit-content'}}> <i className="zmdi zmdi-calendar-check" />Approval Opname </Link></li>
                            <li className={path==='/packing'?"active":''}><Link to="/packing" style={{width:'fit-content'}}> <i className="fa fa-codepen" />Packing </Link></li>
                            <li className={"treeview" + (this.state.isTrxMutasi===true || path==='/approval_mutasi_jual_beli'|| path==='/bayar_mutasi_jual_beli'?" active menu-open" : "")}>
                                <a href="javascript:void(0)" onClick={(e) => this.changeMenu(e,'trx_mutasi')}><i className="zmdi zmdi-card" /> <span>Mutasi Jual Beli</span> <i className="fa fa-angle-right"/></a>
                                <ul className={"treeview-menu animate__animated" + (this.state.isTrxMutasi===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isTrxMutasi===true ?"block" : "none"}}>
                                    <li className={path==='/approval_mutasi_jual_beli'?"active":''}><Link to="/approval_mutasi_jual_beli" style={{width:'fit-content'}}> <i className="zmdi zmdi-calendar-check" />Approval</Link></li>
                                    <li className={path==='/bayar_mutasi_jual_beli'?"active":''}><Link to="/bayar_mutasi_jual_beli" style={{width:'fit-content'}}> <i className="fa fa-money" />Bayar</Link></li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    {/*END MODUL INVENTORY*/}
                    {/*START MODUL PEMBELIAN*/}
                    <li className={"treeview" + (this.state.isReceive===true  || path==='/purchase_order' || path === '/receive'|| path === '/retur_tanpa_nota' ?" active menu-open" : "")}>
                        <a href="#" onClick={(e) => this.changeMenu(e,'receive')}><i className="fa fa-list-alt"/> <span>Pembelian</span> <i className="fa fa-angle-right" /></a>
                        <ul className={"treeview-menu animate__animated" + (this.state.isReceive===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isReceive===true
                        ?"block" : "none"}}>
                            <li className={path==='/purchase_order'?"active":''}><Link to="/purchase_order" style={{width:'fit-content'}}> <i className="fa fa-list-ol" />Purchase Order</Link></li>
                            <li className={path==='/receive'?"active":''}><Link to="/receive" style={{width:'fit-content'}}> <i className="zmdi zmdi-assignment-check" />Receive Pembelian</Link></li>
                            <li className={path==='/retur_tanpa_nota'?"active":''}><Link to="/retur_tanpa_nota" style={{width:'fit-content'}}> <i className="fa fa-rotate-left" />Retur Tanpa Nota</Link></li>
                        </ul>
                    </li>
                    <li className={"treeview" + (this.state.isSale===true  || path==='/sale'?" active menu-open" : "")}>
                        <a href="#" onClick={(e) => this.changeMenu(e,'sale')}><i className="fa fa-shopping-cart" /> <span>Penjualan</span> <i className="fa fa-angle-right" /></a>
                        <ul className={"treeview-menu animate__animated" + (this.state.isSale===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isSale===true
                        ?"block" : "none"}}>
                            <li className={path==='/sale'?"active":''}><Link to="/sale" style={{width:'fit-content'}}> <i className="fa fa-shopping-cart" />Penjualan Barang</Link></li>
                        </ul>
                    </li>
                    <li className={"treeview" + (this.state.isReport===true || this.state.isReportInventory===true || this.state.isReportPembelian===true || this.state.isReportPenjualan===true ||
                        path==='/report/cash'||
                        path==='/report/closing'
                        ?" active menu-open" : "")}>
                        <a href="#" onClick={(e) => this.changeMenu(e,'report')}><i className="zmdi zmdi-book" /> <span>Report</span> <i className="fa fa-angle-right" /></a>
                        <ul className={"treeview-menu animate__animated" + (this.state.isReport===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isReport===true || this.state.isReportInventory===true || this.state.isReportPembelian===true ?"block" : "none"}}>
                            <li className={path==='/report/closing'?"active":''}><Link to="/report/closing" style={{width:'fit-content'}}> <i className="zmdi zmdi-lock" />Closing</Link></li>
                            <li className={path==='/report/cash'?"active":''}><Link to="/report/cash" style={{width:'fit-content'}}> <i className="fa fa-money" />Kas</Link></li>
                            <li className={path==='/report/laba_rugi'?"active":''}><Link to="/report/laba_rugi" style={{width:'fit-content'}}> <i className="zmdi zmdi-archive" />Laba Rugi</Link></li>

                            <li className={"treeview" + (this.state.isReportPenjualan===true || path==='/report/sale_archive' || path==='/report/sale_by_cust_archive' ?" active menu-open" : "")}>
                                <a href="#" onClick={(e) => this.changeMenu(e,'report_penjualan')}><i className="fa fa-list-alt"/>Penjualan <i className="fa fa-angle-right"></i></a>
                                <ul className={"treeview-menu animate__animated" + (this.state.isReportPenjualan===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isReportPenjualan===true ?"block" : "none"}}>
                                    <li className={path==='/report/sale_archive'?"active":''}><Link to="/report/sale_archive" style={{width:'fit-content'}}> <i className="zmdi zmdi-archive" />Arsip Penjualan</Link></li>
                                    <li className={path==='/report/sale_by_cust_archive'?"active":''}><Link to="/report/sale_by_cust_archive" style={{width:'fit-content'}}> <i className="zmdi zmdi-assignment-check" />Penjualan by Cust.</Link></li>
                                </ul>
                            </li>

                            <li className={"treeview" + (this.state.isReportInventory===true ||
                                path==='/report/inventory'|| path==='/report/adjustment'||
                                path==='/report/alokasi'||
                                path==='/report/opname'||
                                path==='/report/production'||
                                path==='/report/expedisi'||
                                path==='/report/mutation'||
                                path==='/report/alokasi_trx'||
                                path==='/report/dn'?" active menu-open" : "")}>
                                <a href="#" onClick={(e) => this.changeMenu(e,'report_inventory')}><i className="zmdi zmdi-widgets"/>Inventory <i className="fa fa-angle-right"></i></a>
                                <ul className={"treeview-menu animate__animated" + (this.state.isReportInventory===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isReportInventory===true?"block" : "none"}}>
                                    <li className={path==='/report/inventory'?"active":''}><Link to="/report/inventory" style={{width:'fit-content'}}> <i className="ti-server" />Stock</Link></li>
                                    <li className={path==='/report/adjustment'?"active":''}><Link to="/report/adjustment" style={{width:'fit-content'}}> <i className="fa fa-adjust" />Adjustment</Link></li>
                                    <li className={path==='/report/alokasi'?"active":''}><Link to="/report/alokasi" style={{width:'fit-content'}}> <i className="fa fa-dropbox" />Alokasi</Link></li>
                                    <li className={path==='/report/dn'?"active":''}><Link to="/report/dn" style={{width:'fit-content'}}> <i className="fa fa-sticky-note" />Delivery Note</Link></li>
                                    <li className={path==='/report/opname'?"active":''}><Link to="/report/opname" style={{width:'fit-content'}}> <i className="fa fa-balance-scale" />Opname</Link></li>
                                    <li className={path==='/report/mutation'?"active":''}><Link to="/report/mutation" style={{width:'fit-content'}}> <i className="zmdi zmdi-card" />Mutasi</Link></li>
                                    <li className={path==='/report/alokasi_trx'?"active":''}><Link to="/report/alokasi_trx" style={{width:'fit-content'}}> <i className="fa fa-money" />Alokasi Trx</Link></li>
                                    <li className={path==='/report/expedisi'?"active":''}><Link to="/report/expedisi" style={{width:'fit-content'}}> <i className="fa fa-truck" />Ekspedisi</Link></li>
                                    <li className={path==='/report/production'?"active":''}><Link to="/report/production" style={{width:'fit-content'}}> <i className="fa fa-industry" />Produksi</Link></li>
                                </ul>
                            </li>
                            <li className={"treeview" + (this.state.isReportPembelian===true || path==='/report/po'|| path==='/report/receive'?" active menu-open" : "")}>

                                <a href="#" onClick={(e) => this.changeMenu(e,'report_pembelian')}><i className="fa fa-list-alt"/>Pembelian <i className="fa fa-angle-right"></i></a>
                                <ul className={"treeview-menu animate__animated" + (this.state.isReportPembelian===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isReportPembelian===true
                        ?"block" : "none"}}>
                                    <li className={path==='/report/po'?"active":''}><Link to="/report/po" style={{width:'fit-content'}}> <i className="fa fa-list-ol" />Purchase Order</Link></li>
                                    <li className={path==='/report/receive'?"active":''}><Link to="/report/receive" style={{width:'fit-content'}}> <i className="zmdi zmdi-assignment-check" />Receive</Link></li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    {/*END MODUL LAPORAN*/}
                    {/*START MODUL CETAK BARCODE*/}
                    <li  className={path==='/cetak_barcode'?"active":''}><Link to="/cetak_barcode"> <i className="fa fa-barcode" /><span>Cetak Barcode </span></Link></li>
                    {/*END MODUL CETAK BARCODE*/}

                    <li className={"treeview" +(this.state.isSetting===true
                        || path==='/user'
                        || path==='/location'
                        || path==='/company'
                        ?" active menu-open" : ""
                        )
                    }>
                        <a href="#" onClick={(e) => this.changeMenu(e,'setting')}><i className="fa fa-gears" /> <span>Setting</span> <i className="fa fa-angle-right" /></a>
                        <ul className={"treeview-menu animate__animated" + (this.state.isSetting===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isSetting===true
                        ?"block" : "none"}}>
                            <li className={path==='/company'?"active":''}><Link to="/company" style={{width:'fit-content'}}> <i className="fa fa-gear" />Pengaturan Umum</Link></li>
                            <li className={path==='/user'?"active":''} ><Link to="/user" style={{width:'fit-content'}}> <i className="fa fa-group" />Pengguna</Link></li>
                            <li className={path==='/location'?"active":''} ><Link to="/location" style={{width:'fit-content'}}> <i className="zmdi zmdi-pin" />Lokasi</Link></li>
                        </ul>
                    </li>

                    {/* <li  className={path==='/cetak_barcode'?"active":''}><Link to="/cetak_barcode"> <i className="fa fa-barcode" /><span>Cetak Barcode </span></Link></li> */}
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