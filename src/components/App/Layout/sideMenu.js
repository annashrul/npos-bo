import React, { Component } from 'react';
import {Link} from "react-router-dom"
import {connect} from 'react-redux'
import {withRouter} from "react-router-dom"
import bayar_mutasi_jual_beli from "../inventory/mutasi_jual_beli/bayar_mutasi_jual_beli";
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
            isReportPembayaran:false,
            isReportPenjualan:false,
            isTrxMutasi:false,
            isProduction:false,
            isPaid:false,
            pageMenu : '',
            dataUser:[],
            dataUser0:'',
            activeMenu:'dashboard',
            //MASTERDATA
            modul_masterdata:false,
            barang:'', departemen:'', supplier:'', customer:'', kas:'', sales:'', bank:'', promo:'',
            //PRODUKSI
            modul_produksi:false,
            produksi:'',
            //INVENTORY
            modul_inventory:false,
            modul_inventory_mutasi:false,
            delivery_note:'',alokasi:'',approval_mutasi:'',adjusment:'',opname:'',approval_opname:'',packing:'',approval_mutasi_jual_beli:'',bayar_mutasi_jual_beli:'',
            //PEMBELIAN
            modul_pembelian:false,
            purchase_order:'',receive_pembelian:'',retur_tanpa_nota:'',
            //PENJUALAN
            modul_penjualan:false,
            penjualan_barang:'',
            //PEMBAYARAN
            modul_pembayaran:false,
            hutang:'',piutang:'',
            //REPORT
            modul_report:false,
            modul_report_penjualan:false,
            modul_report_inventory:false,
            modul_report_pembelian:false,
            modul_report_pembayaran:false,
            r_closing:'',r_kas:'',r_laba_rugi:'',r_produksi:'',r_arsip_penjualan:'',r_arsip_retur_penjualan:'',r_penjualan_by_customer:'',
            r_stock:'',r_adjusment:'',r_alokasi:'',r_delivery_note:'',r_opname:'',r_mutasi:'',r_alokasi_trx:'',r_expedisi:'',
            r_purchase_order:'',r_receive:'',r_arsip_pembelian_by_supplier:'',
            r_hutang:'',r_piutang:'',
            //CETAK BARCODE
            modul_cetak_barcode:false,
            cetak_barcode:'',
            // SETTING
            modul_setting:false,
            pengaturan_umum:'',pengguna:'',lokasi:''
        }
        this.subChangeMenu = this.subChangeMenu.bind(this);
        this.changeMenu = this.changeMenu.bind(this);
    }

    subChangeMenu(e){
        e.preventDefault();
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
                isProduction:false,
                isPaid:false
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
                    isReportPembayaran:false,
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
                    isReportPembayaran:false,
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
                    isReportPembayaran:false,
                    isReportPenjualan:!this.state.isReportPenjualan
                })
            }
            if(this.state.isReportPembayaran === true) {
                this.setState({
                    isSetting:false,
                    isMasterdata: false,
                    isInventory: false,
                    isReport: true,
                    isReceive: false,
                    isSale:false,
                    isReportInventory:false,
                    isReportPembelian:false,
                    isReportPembayaran:!this.state.isReportPembayaran,
                    isReportPenjualan:false
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
                isReportPembayaran:false,
                isReportInventory:false,
                isReportPenjualan:false,
                isProduction:false,
                isPaid:false
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
                    isReportPembayaran:false,
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
                isReportPembayaran:false,
                isReportPenjualan:false,
                isProduction:false,
                isPaid:false
            })
        }

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
        if(param === 'report_pembayaran'){
            this.setState({
                isReportPembayaran: !this.state.isReportPembayaran,
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
        if(param === 'paid'){
            this.setState({
                isPaid : !this.state.isPaid, 
                isReport : false,
                isInventory : false
            });
        }
        this.forceUpdate();
        
    }
    getProps(param){
        if (param.auth.user) {
            let loc =param.auth.user.access;
            if(loc!==undefined&&loc!==null){
                // SETTING
                let pengaturan_umum=param.auth.user.access[0]['label']!==null?param.auth.user.access[0]['label']:"0";
                let pengguna=param.auth.user.access[1]['label']!==null?param.auth.user.access[1]['label']:"0";
                let lokasi=param.auth.user.access[2]['label']!==null?param.auth.user.access[2]['label']:"0";
                //MASTERDATA
                let barang=param.auth.user.access[10]['label']!==null?param.auth.user.access[10]['label']:"0";
                let departemen=param.auth.user.access[11]['label']!==null?param.auth.user.access[11]['label']:"0";
                let supplier=param.auth.user.access[12]['label']!==null?param.auth.user.access[12]['label']:"0";
                let customer=param.auth.user.access[13]['label']!==null?param.auth.user.access[13]['label']:"0";
                let kas=param.auth.user.access[14]['label']!==null?param.auth.user.access[14]['label']:"0";
                let sales=param.auth.user.access[15]['label']!==null?param.auth.user.access[15]['label']:"0";
                let bank=param.auth.user.access[16]['label']!==null?param.auth.user.access[16]['label']:"0";
                let promo=param.auth.user.access[17]['label']!==null?param.auth.user.access[17]['label']:"0";
                //PRODUKSI
                let produksi=param.auth.user.access[20]['label']!==null?param.auth.user.access[20]['label']:"0";
                //INVENTORY
                let delivery_note=param.auth.user.access[30]['label']!==null?param.auth.user.access[30]['label']:"0";
                let alokasi=param.auth.user.access[31]['label']!==null?param.auth.user.access[31]['label']:"0";
                let approval_mutasi=param.auth.user.access[32]['label']!==null?param.auth.user.access[32]['label']:"0";
                let adjusment=param.auth.user.access[33]['label']!==null?param.auth.user.access[33]['label']:"0";
                let opname=param.auth.user.access[34]['label']!==null?param.auth.user.access[34]['label']:"0";
                let approval_opname=param.auth.user.access[35]['label']!==null?param.auth.user.access[35]['label']:"0";
                let packing=param.auth.user.access[36]['label']!==null?param.auth.user.access[36]['label']:"0";
                let approval_mutasi_jual_beli=param.auth.user.access[37]['label']!==null?param.auth.user.access[37]['label']:"0";
                let bayar_mutasi_jual_beli=param.auth.user.access[38]['label']!==null?param.auth.user.access[38]['label']:"0";
                //PEMBELIAN
                let purchase_order=param.auth.user.access[40]['label']!==null?param.auth.user.access[40]['label']:"0";
                let receive_pembelian=param.auth.user.access[41]['label']!==null?param.auth.user.access[41]['label']:"0";
                let retur_tanpa_nota=param.auth.user.access[42]['label']!==null?param.auth.user.access[42]['label']:"0";
                //PENJUALAN
                let penjualan_barang=param.auth.user.access[50]['label']!==null?param.auth.user.access[50]['label']:"0";
                //PEMBAYARAN
                let hutang=param.auth.user.access[60]['label']!==null?param.auth.user.access[60]['label']:"0";
                let piutang=param.auth.user.access[61]['label']!==null?param.auth.user.access[61]['label']:"0";
                //REPORT
                let r_closing=param.auth.user.access[70]['label']!==null?param.auth.user.access[70]['label']:"0";
                let r_kas=param.auth.user.access[71]['label']!==null?param.auth.user.access[71]['label']:"0";
                let r_laba_rugi=param.auth.user.access[72]['label']!==null?param.auth.user.access[72]['label']:"0";
                let r_produksi=param.auth.user.access[73]['label']!==null?param.auth.user.access[73]['label']:"0";
                let r_arsip_penjualan=param.auth.user.access[74]['label']!==null?param.auth.user.access[74]['label']:"0";
                let r_arsip_retur_penjualan=param.auth.user.access[75]['label']!==null?param.auth.user.access[75]['label']:"0";
                let r_penjualan_by_customer=param.auth.user.access[76]['label']!==null?param.auth.user.access[76]['label']:"0";
                let r_stock=param.auth.user.access[77]['label']!==null?param.auth.user.access[77]['label']:"0";
                let r_adjusment=param.auth.user.access[78]['label']!==null?param.auth.user.access[78]['label']:"0";
                let r_alokasi=param.auth.user.access[79]['label']!==null?param.auth.user.access[79]['label']:"0";
                let r_delivery_note=param.auth.user.access[80]['label']!==null?param.auth.user.access[80]['label']:"0";
                let r_opname=param.auth.user.access[81]['label']!==null?param.auth.user.access[81]['label']:"0";
                let r_mutasi=param.auth.user.access[82]['label']!==null?param.auth.user.access[82]['label']:"0";
                let r_alokasi_trx=param.auth.user.access[83]['label']!==null?param.auth.user.access[83]['label']:"0";
                let r_expedisi=param.auth.user.access[84]['label']!==null?param.auth.user.access[84]['label']:"0";
                let r_purchase_order=param.auth.user.access[85]['label']!==null?param.auth.user.access[85]['label']:"0";
                let r_receive=param.auth.user.access[86]['label']!==null?param.auth.user.access[86]['label']:"0";
                let r_arsip_pembelian_by_supplier=param.auth.user.access[87]['label']!==null?param.auth.user.access[87]['label']:"0";
                let r_hutang=param.auth.user.access[88]['label']!==null?param.auth.user.access[88]['label']:"0";
                let r_piutang=param.auth.user.access[89]['label']!==null?param.auth.user.access[89]['label']:"0";
                //CETAK BARCODE
                let cetak_barcode=param.auth.user.access[90]['label']!==null?param.auth.user.access[90]['label']:"0";
                //pengecekan apabila fitur bernilai 0
                if(pengaturan_umum!=='0'&&pengguna!=='0'&&lokasi!=='0'){
                    this.setState({modul_setting:true});
                }
                if(barang!=='0'&&departemen!=='0'&&supplier!=='0'&&customer!=='0'&&kas!=='0'&&sales!=='0'&&bank!=='0'&&promo!=='0'){
                    this.setState({modul_masterdata:true});
                }
                if(produksi!=='0'){
                    this.setState({modul_produksi:true});
                }
                if(delivery_note!=='0'&&alokasi!=='0'&&approval_mutasi!=='0'&&adjusment!=='0'&&opname!=='0'&&approval_opname!=='0'&&packing!=='0'&&approval_mutasi_jual_beli!=='0'&&bayar_mutasi_jual_beli!=='0'){
                    this.setState({modul_inventory:true});
                }else{
                    if(approval_mutasi_jual_beli!=='0'&&bayar_mutasi_jual_beli!=='0'){
                        this.setState({modul_inventory:true,modul_inventory_mutasi:true});
                    }
                }


                if(purchase_order!=='0'&&receive_pembelian!=='0'&&retur_tanpa_nota!=='0'){
                    this.setState({modul_pembelian:true});
                }
                if(penjualan_barang!=='0'){
                    this.setState({modul_penjualan:true});
                }
                if(hutang!=='0'&&piutang!=='0'){
                    this.setState({modul_pembayaran:true});
                }
                if(
                    r_closing!=='0'&&r_kas!=='0'&&r_laba_rugi!=='0'&&
                    r_produksi!=='0'&&
                    r_arsip_penjualan!=='0'&&r_arsip_retur_penjualan!=='0'&&r_penjualan_by_customer!=='0'&&
                    r_stock!=='0'&&r_adjusment!=='0'&& r_alokasi!=='0'&& r_delivery_note!=='0'&& r_opname!=='0'&& r_mutasi!=='0'&& r_alokasi_trx!=='0'&& r_expedisi!=='0'&&
                    r_purchase_order!=='0'&& r_receive!=='0'&& r_arsip_pembelian_by_supplier!=='0'&&
                    r_hutang!=='0'&& r_piutang!=='0'
                ){
                    this.setState({modul_report:true});
                }
                if(r_arsip_penjualan!=='0'||r_arsip_retur_penjualan!=='0'||r_penjualan_by_customer!=='0'){
                    this.setState({modul_report:true,modul_report_penjualan:true});
                }
                if(r_stock!=='0'||r_adjusment!=='0'|| r_alokasi!=='0'|| r_delivery_note!=='0'|| r_opname!=='0'|| r_mutasi!=='0'|| r_alokasi_trx!=='0'|| r_expedisi!=='0'){
                    this.setState({modul_report:true,modul_report_inventory:true});
                }
                if(r_purchase_order!=='0'||r_receive!=='0'||r_arsip_pembelian_by_supplier!=='0'){
                    this.setState({modul_report:true,modul_report_pembelian:true});
                }
                if(r_hutang!=='0'||r_piutang!=='0'){
                    this.setState({modul_report:true,modul_report_pembayaran:true});
                }

                if(cetak_barcode!=='0'){
                    this.setState({modul_cetak_barcode:true});
                }

                this.setState({
                    // SETTING
                    pengaturan_umum:pengaturan_umum,
                    pengguna:pengguna,
                    lokasi:lokasi,
                    // //MASTERDATA
                    barang:barang,
                    departemen:departemen,
                    supplier:supplier,
                    customer:customer,
                    kas:kas,
                    sales:sales,
                    bank:bank,
                    promo:promo,
                    // //PRODUKSI
                    produksi:produksi,
                    //INVENTORY
                    delivery_note:delivery_note,
                    alokasi:alokasi,
                    approval_mutasi:approval_mutasi,
                    adjusment:adjusment,
                    opname:opname,
                    approval_opname:approval_opname,
                    packing:packing,
                    approval_mutasi_jual_beli:approval_mutasi_jual_beli,
                    bayar_mutasi_jual_beli:bayar_mutasi_jual_beli,
                    //PEMBELIAN
                    purchase_order:purchase_order,
                    receive_pembelian:receive_pembelian,
                    retur_tanpa_nota:retur_tanpa_nota,
                    //PENJUALAN
                    penjualan_barang:penjualan_barang,
                    //PEMBAYARAN
                    hutang:hutang,
                    piutang:piutang,
                    //REPORT
                    r_closing:r_closing,
                    r_kas:r_kas,
                    r_laba_rugi:r_laba_rugi,
                    r_produksi:r_produksi,
                    r_arsip_penjualan:r_arsip_penjualan,
                    r_arsip_retur_penjualan:r_arsip_retur_penjualan,
                    r_penjualan_by_customer:r_penjualan_by_customer,
                    r_stock:r_stock,
                    r_adjusment:r_adjusment,
                    r_alokasi:r_alokasi,
                    r_delivery_note:r_delivery_note,
                    r_opname:r_opname,
                    r_mutasi:r_mutasi,
                    r_alokasi_trx:r_alokasi_trx,
                    r_expedisi:r_expedisi,
                    r_purchase_order:r_purchase_order,
                    r_receive:r_receive,
                    r_arsip_pembelian_by_supplier:r_arsip_pembelian_by_supplier,
                    r_hutang:r_hutang,
                    r_piutang:r_piutang,
                    //CETAK BARCODE
                    cetak_barcode:cetak_barcode,
                })
            }
        }
    }
    componentDidMount(){
        let dataUser=[];
        this.getProps(this.props);
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
            
            this.setState({
                isSetting:true
            })
        }
        else if(
            path==='/department' ||
            path==='/supplier' ||
            path==='/sales' ||
            path==='/cash' ||
            path==='/customer' ||
            path==='/product' ||
            path==='/promo' ||
            path==='/bank'){
            
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
            
            this.setState({
                isReceive:true
            })
        } else if(path==='/sale'){
            
            this.setState({
                isSale:true
            })
        } else if(
            path==='/report/cash'|| 
            path==='/report/laba_rugi'|| 
            path==='/report/sale_archive'|| 
            path==='/report/sale_retur_archive'|| 
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
            path==='/report/receive'||
            path==='/report/purchase_by_supplier'||

            path==='/report/hutang' ||
            path==='/report/piutang'
            ){
            
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
                path==='/report/dn'){
               
               this.setState({
                   isReportInventory:true
               })
           } else if(
               path==='/report/po'||
               path==='/report/receive'||
               path==='/report/purchase_by_supplier'
               ){
               
               this.setState({
                   isReportPembelian:true
               })
           } else if(
               path==='/report/sale_archive' ||
               path==='/report/sale_retur_archive' ||
               path==='/report/sale_by_cust_archive'
               ){
               
               this.setState({
                   isReportPenjualan:true
               })
           } else if(
               path==='/report/hutang' ||
               path==='/report/piutang'
               ){
               
               this.setState({
                   isReportPembayaran:true
               })
           } 
        } else if(path==='/trx_produksi'||path==='/approval_produksi'){
            this.setState({
                isProduction:true
            })
        } else if(path==='/bayar_hutang'||path==='/bayar_piutang'){
            this.setState({
                isPaid:true
            })
        }
    }
    componentWillReceiveProps = (nextProps) => {
        this.getProps(nextProps);
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
        const {
            modul_setting,
            modul_masterdata,
            modul_produksi,
            modul_inventory,modul_inventory_mutasi,
            modul_pembelian,
            modul_penjualan,
            modul_pembayaran,
            modul_report,modul_report_penjualan,modul_report_inventory,modul_report_pembelian,modul_report_pembayaran,
            modul_cetak_barcode
        } = this.state;
        return (
            <nav>
                <ul className="sidebar-menu" data-widget="tree">
                    {/* DASHBOARD MODUL START */}
                    <li  className={path==='/'?"active":''}><Link to="/"> <i className="fa fa-dashboard" /><span> Dashboard</span></Link></li>
                    {/* DASHBOARD MODUL END */}

                    {/* MASTERDATA MODUL START */}
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
                    } style={modul_masterdata===true?{display:'block'}:{display:'none'}}>

                        <a tabIndex="0" onClick={(e) => this.changeMenu(e,'masterdata')}><i className="zmdi zmdi-receipt" /> <span>Master Data</span> <i className="fa fa-angle-right" /></a>
                        <ul className={"treeview-menu animate__animated" + (this.state.isMasterdata===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isMasterdata===true
                        ?"block" : "none"}}>
                            <li className={path==='/product'?"active":''} style={this.state.barang==="0"?{"display":"none"}:{"display":"block"}}><Link to="/product" style={{width:'fit-content'}}> <i className="fa fa-list-alt" />Barang</Link></li>
                            <li className={path==='/department'?"active":''} style={this.state.departemen==="0"?{"display":"none"}:{"display":"block"}}><Link to="/department" style={{width:'fit-content'}}> <i className="zmdi zmdi-store-24" />Departmen</Link></li>
                            <li className={path==='/supplier'?"active":''} style={this.state.supplier==="0"?{"display":"none"}:{"display":"block"}}><Link to="/supplier" style={{width:'fit-content'}}> <i className="fa fa-truck" />Supplier </Link></li>
                            <li className={path==='/customer'?"active":''} style={this.state.customer==="0"?{"display":"none"}:{"display":"block"}}><Link to="/customer" style={{width:'fit-content'}}> <i className="fa fa-user" />Customer </Link></li>
                            <li className={path==='/cash'?"active":''} style={this.state.kas==="0"?{"display":"none"}:{"display":"block"}}><Link to="/cash" style={{width:'fit-content'}}> <i className="fa fa-money" />Kas </Link></li>
                            <li className={path==='/sales'?"active":''} style={this.state.sales==="0"?{"display":"none"}:{"display":"block"}}><Link to="/sales" style={{width:'fit-content'}}> <i className="fa fa-user-secret" />Sales </Link></li>
                            <li className={path==='/bank'?"active":''} style={this.state.bank==="0"?{"display":"none"}:{"display":"block"}}><Link to="/bank" style={{width:'fit-content'}}> <i className="fa fa-bank" />Bank </Link></li>
                            <li className={path==='/promo'?"active":''} style={this.state.promo==="0"?{"display":"none"}:{"display":"block"}}><Link to="/promo" style={{width:'fit-content'}}> <i className="fa fa-ticket" />Promo </Link></li>
                        </ul>
                    </li>
                    {/* MASTERDATA MODUL END */}

                    {/* PRODUKSI MODUL START */}
                    <li style={this.state.produksi==="0"?{"display":"none"}:{"display":"block"}} className={path==='/trx_produksi'?"active":''}><Link to="/trx_produksi"> <i className="fa fa-product-hunt" /><span> Produksi</span></Link></li>
                    {/* PRODUKSI MODUL END */}

                    {/* INVENTORY MODUL START */}
                    <li className={"treeview" +
                        (this.state.isInventory===true || this.state.isTrxMutasi ||
                        path==='/delivery_note' ||
                        path === '/alokasi' ||
                        path === '/adjustment'||
                        path === '/approval_mutasi'||
                        path === '/opname'||
                        path === '/approval_opname'||
                        path === '/packing'
                        ?" active menu-open" : "")} style={modul_inventory===true?{display:'block'}:{display:'none'}}>
                        <a tabIndex="0" onClick={(e) => this.changeMenu(e,'inventory')}><i className="zmdi zmdi-storage" /> <span>Inventory</span> <i className="fa fa-angle-right" /></a>
                        <ul className={"treeview-menu animate__animated" + (this.state.isInventory===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isInventory===true
                        ?"block" : "none"}}>
                            <li className={path==='/delivery_note'?"active":''} style={this.state.delivery_note==="0"?{"display":"none"}:{"display":"block"}}><Link to="/delivery_note" style={{width:'fit-content'}}> <i className="fa fa-sticky-note" />Delivery Note</Link></li>
                            <li className={path==='/alokasi'?"active":''} style={this.state.alokasi==="0"?{"display":"none"}:{"display":"block"}}><Link to="/alokasi" style={{width:'fit-content'}}> <i className="fa fa-dropbox" />Alokasi </Link></li>
                            <li className={path==='/approval_mutasi'?"active":''} style={this.state.approval_mutasi==="0"?{"display":"none"}:{"display":"block"}}><Link to="/approval_mutasi" style={{width:'fit-content'}}> <i className="zmdi zmdi-calendar-check" />Approval Mutasi </Link></li>
                            <li className={path==='/adjustment'?"active":''} style={this.state.adjusment==="0"?{"display":"none"}:{"display":"block"}}><Link to="/adjustment" style={{width:'fit-content'}}> <i className="fa fa-adjust" />Adjustment </Link></li>
                            <li className={path==='/opname'?"active":''} style={this.state.opname==="0"?{"display":"none"}:{"display":"block"}}><Link to="/opname" style={{width:'fit-content'}}> <i className="fa fa-balance-scale" />Opname </Link></li>
                            <li className={path==='/approval_opname'?"active":''} style={this.state.approval_opname==="0"?{"display":"none"}:{"display":"block"}}><Link to="/approval_opname" style={{width:'fit-content'}}> <i className="zmdi zmdi-calendar-check" />Approval Opname </Link></li>
                            <li className={path==='/packing'?"active":''} style={this.state.packing==="0"?{"display":"none"}:{"display":"block"}}><Link to="/packing" style={{width:'fit-content'}}> <i className="fa fa-codepen" />Packing </Link></li>
                            <li className={"treeview" + (this.state.isTrxMutasi===true || path==='/approval_mutasi_jual_beli'|| path==='/bayar_mutasi_jual_beli'?" active menu-open" : "")} style={modul_inventory_mutasi===true?{display:'block'}:{display:'none'}}>
                                <a href="javascript:void(0)" onClick={(e) => this.changeMenu(e,'trx_mutasi')}><i className="zmdi zmdi-card" /> <span>Mutasi Jual Beli</span> <i className="fa fa-angle-right"/></a>
                                <ul className={"treeview-menu animate__animated" + (this.state.isTrxMutasi===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isTrxMutasi===true ?"block" : "none"}}>
                                    <li className={path==='/approval_mutasi_jual_beli'?"active":''} style={this.state.approval_mutasi_jual_beli==="0"?{"display":"none"}:{"display":"block"}}><Link to="/approval_mutasi_jual_beli" style={{width:'fit-content'}}> <i className="zmdi zmdi-calendar-check" />Approval</Link></li>
                                    <li className={path==='/bayar_mutasi_jual_beli'?"active":''} style={this.state.bayar_mutasi_jual_beli==="0"?{"display":"none"}:{"display":"block"}}><Link to="/bayar_mutasi_jual_beli" style={{width:'fit-content'}}> <i className="fa fa-money" />Bayar</Link></li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    {/* INVENTORY MODUL END */}

                    {/* PEMBELIAN MODUL START */}

                    <li className={"treeview" + (this.state.isReceive===true  || path==='/purchase_order' || path === '/receive'|| path === '/retur_tanpa_nota' ?" active menu-open" : "")}>
                        <a tabIndex="0" onClick={(e) => this.changeMenu(e,'receive')}><i className="fa fa-list-alt"/> <span>Pembelian</span> <i className="fa fa-angle-right" /></a>
                        <ul className={"treeview-menu animate__animated" + (this.state.isReceive===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isReceive===true
                        ?"block" : "none"}}>
                            <li className={path==='/purchase_order'?"active":''} style={this.state.purchase_order==="0"?{"display":"none"}:{"display":"block"}}><Link to="/purchase_order" style={{width:'fit-content'}}> <i className="fa fa-list-ol" />Purchase Order</Link></li>
                            <li className={path==='/receive'?"active":''} style={this.state.receive_pembelian==="0"?{"display":"none"}:{"display":"block"}}><Link to="/receive" style={{width:'fit-content'}}> <i className="zmdi zmdi-assignment-check" />Receive Pembelian</Link></li>
                            <li className={path==='/retur_tanpa_nota'?"active":''} style={this.state.retur_tanpa_nota==="0"?{"display":"none"}:{"display":"block"}}><Link to="/retur_tanpa_nota" style={{width:'fit-content'}}> <i className="fa fa-rotate-left" />Retur Tanpa Nota</Link></li>
                        </ul>
                    </li>
                    {/* PEMBELIAN MODUL END */}

                    {/* PENJUALAN MODUL START */}
                    <li className={"treeview" + (this.state.isSale===true  || path==='/sale'?" active menu-open" : "")} style={modul_penjualan===true?{display:'block'}:{display:'none'}}>
                        <a href="#" onClick={(e) => this.changeMenu(e,'sale')}><i className="fa fa-shopping-cart" /> <span>Penjualan</span> <i className="fa fa-angle-right" /></a>
                        <ul className={"treeview-menu animate__animated" + (this.state.isSale===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isSale===true
                        ?"block" : "none"}}>
                            <li className={path==='/sale'?"active":''} style={this.state.penjualan_barang==="0"?{"display":"none"}:{"display":"block"}}><Link to="/sale" style={{width:'fit-content'}}> <i className="fa fa-shopping-cart" />Penjualan Barang</Link></li>
                        </ul>
                    </li>
                    {/* PENJUALAN MODUL END */}

                    {/* PEMBAYARAN SECTION START */}
                    <li className={"treeview" + (this.state.isPaid===true  || path==='/bayar_hutang' || path==='/bayar_piutang'?" active menu-open" : "")} style={modul_pembayaran===true?{display:'block'}:{display:'none'}}>
                        <a href="#" onClick={(e) => this.changeMenu(e,'paid')}><i className="fa fa-money" /> <span>Pembayaran</span> <i className="fa fa-angle-right" /></a>
                        <ul className={"treeview-menu animate__animated" + (this.state.isPaid===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isPaid===true
                        ?"block" : "none"}}>
                            <li className={path==='/bayar_hutang'?"active":''} style={this.state.hutang==="0"?{"display":"none"}:{"display":"block"}}><Link to="/bayar_hutang" style={{width:'fit-content'}}> <i className="fa fa-dollar" />Hutang</Link></li>
                            <li className={path==='/bayar_piutang'?"active":''} style={this.state.piutang==="0"?{"display":"none"}:{"display":"block"}}><Link to="/bayar_piutang" style={{width:'fit-content'}}> <i className="fa fa-credit-card" />Piutang</Link></li>
                        </ul>
                    </li>
                    {/* PEMBAYARAN SECTION END */}

                    {/* LAPORAN MODUL START */}
                    <li className={"treeview" + (
                        this.state.isReport===true || 
                        this.state.isReportInventory===true || 
                        this.state.isReportPembelian===true || 
                        this.state.isReportPenjualan===true ||
                        this.state.isReportPembayaran===true ||
                        path==='/report/cash'||
                        path==='/report/closing'
                        ?" active menu-open" : "")} style={modul_report===true?{display:'block'}:{display:'none'}}>
                        <a href="#" onClick={(e) => this.changeMenu(e,'report')}><i className="zmdi zmdi-book" /> <span>Report</span> <i className="fa fa-angle-right" /></a>

                        <ul className={"treeview-menu animate__animated" + (this.state.isReport===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isReport===true || this.state.isReportInventory===true || this.state.isReportPembelian===true ?"block" : "none"}}>
                            <li className={path==='/report/closing'?"active":''} style={this.state.r_closing==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/closing" style={{width:'fit-content'}}> <i className="zmdi zmdi-lock" />Closing</Link></li>
                            <li className={path==='/report/cash'?"active":''} style={this.state.r_kas==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/cash" style={{width:'fit-content'}}> <i className="fa fa-money" />Kas</Link></li>
                            <li className={path==='/report/laba_rugi'?"active":''} style={this.state.r_laba_rugi==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/laba_rugi" style={{width:'fit-content'}}> <i className="zmdi zmdi-archive" />Laba Rugi</Link></li>
                            <li className={path==='/report/production'?"active":''} style={this.state.r_produksi==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/production" style={{width:'fit-content'}}> <i className="fa fa-product-hunt" />Produksi</Link></li>

                            {/* SUBLAPORAN PENJUALAN MODUL START */}
                            <li className={"treeview" + (this.state.isReportPenjualan===true || 
                                path==='/report/sale_archive' || 
                                path==='/report/sale_retur_archive' || 
                                path==='/report/sale_by_cust_archive' 
                                ?" active menu-open" : "")} style={modul_report_penjualan===true?{display:'block'}:{display:'none'}}>
                                <a href="#" onClick={(e) => this.changeMenu(e,'report_penjualan')}><i className="fa fa-list-alt"/>Penjualan <i className="fa fa-angle-right"/></a>

                                <ul className={"treeview-menu animate__animated" + (this.state.isReportPenjualan===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isReportPenjualan===true ?"block" : "none"}}>
                                    <li className={path==='/report/sale_archive'?"active":''} style={this.state.r_arsip_penjualan==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/sale_archive" style={{width:'fit-content'}}> <i className="zmdi zmdi-archive" />Arsip Penjualan</Link></li>
                                    <li className={path==='/report/sale_retur_archive'?"active":''} style={this.state.r_arsip_retur_penjualan==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/sale_retur_archive" style={{width:'fit-content'}}> <i className="zmdi zmdi-archive" />Arsip Retur Penjualan</Link></li>
                                    <li className={path==='/report/sale_by_cust_archive'?"active":''} style={this.state.r_penjualan_by_customer==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/sale_by_cust_archive" style={{width:'fit-content'}}> <i className="zmdi zmdi-assignment-check" />Penjualan by Cust.</Link></li>
                                </ul>
                            </li>
                            {/* SUBLAPORAN PENJUALAN MODUL END */}

                            {/* SUBLAPORAN INVENTORY MODUL START */}
                            <li className={"treeview" + (this.state.isReportInventory===true ||
                                path==='/report/inventory'|| path==='/report/adjustment'||
                                path==='/report/alokasi'||
                                path==='/report/opname'||
                                path==='/report/expedisi'||
                                path==='/report/mutation'||
                                path==='/report/alokasi_trx'||
                                path==='/report/dn'?" active menu-open" : "")} style={modul_report_inventory===true?{display:'block'}:{display:'none'}}>
                                <a href="#" onClick={(e) => this.changeMenu(e,'report_inventory')}><i className="zmdi zmdi-widgets"/>Inventory <i className="fa fa-angle-right"/></a>
                                <ul className={"treeview-menu animate__animated" + (this.state.isReportInventory===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isReportInventory===true?"block" : "none"}}>
                                    <li className={path==='/report/inventory'?"active":''} style={this.state.r_stock==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/inventory" style={{width:'fit-content'}}> <i className="ti-server" />Stock</Link></li>
                                    <li className={path==='/report/adjustment'?"active":''} style={this.state.r_adjusment==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/adjustment" style={{width:'fit-content'}}> <i className="fa fa-adjust" />Adjustment</Link></li>
                                    <li className={path==='/report/alokasi'?"active":''} style={this.state.r_alokasi==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/alokasi" style={{width:'fit-content'}}> <i className="fa fa-dropbox" />Alokasi</Link></li>
                                    <li className={path==='/report/dn'?"active":''} style={this.state.r_delivery_note==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/dn" style={{width:'fit-content'}}> <i className="fa fa-sticky-note" />Delivery Note</Link></li>
                                    <li className={path==='/report/opname'?"active":''} style={this.state.r_opname==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/opname" style={{width:'fit-content'}}> <i className="fa fa-balance-scale" />Opname</Link></li>
                                    <li className={path==='/report/mutation'?"active":''} style={this.state.r_mutasi==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/mutation" style={{width:'fit-content'}}> <i className="zmdi zmdi-card" />Mutasi</Link></li>
                                    <li className={path==='/report/alokasi_trx'?"active":''} style={this.state.r_alokasi_trx==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/alokasi_trx" style={{width:'fit-content'}}> <i className="fa fa-money" />Alokasi Trx</Link></li>
                                    <li className={path==='/report/expedisi'?"active":''} style={this.state.r_expedisi==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/expedisi" style={{width:'fit-content'}}> <i className="fa fa-truck" />Ekspedisi</Link></li>
                                </ul>
                            </li>
                            {/* SUBLAPORAN INVENTORY MODUL END */}

                            {/* SUBLAPORAN PEMBELIAN MODUL START */}
                            <li className={"treeview" + (this.state.isReportPembelian===true || 
                                path==='/report/po'|| 
                                path==='/report/receive' ||
                                path==='/report/purchase_by_supplier'
                                ?" active menu-open" : "")} style={modul_report_pembelian===true?{display:'block'}:{display:'none'}}>

                                <a tabIndex="0" onClick={(e) => this.changeMenu(e,'report_pembelian')}><i className="fa fa-list-alt"/>Pembelian <i className="fa fa-angle-right"></i></a>
                                <ul className={"treeview-menu animate__animated" + (this.state.isReportPembelian===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isReportPembelian===true
                        ?"block" : "none"}}>
                                    <li className={path==='/report/po'?"active":''} style={this.state.r_purchase_order==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/po" style={{width:'fit-content'}}> <i className="fa fa-list-ol" />Purchase Order</Link></li>
                                    <li className={path==='/report/receive'?"active":''} style={this.state.r_receive==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/receive" style={{width:'fit-content'}}> <i className="zmdi zmdi-assignment-check" />Receive</Link></li>
                                    <li className={path==='/report/purchase_by_supplier'?"active":''} style={this.state.r_arsip_pembelian_by_supplier==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/purchase_by_supplier" style={{width:'fit-content'}}> <i className="zmdi zmdi-assignment-check" />Arsip Pembelian by Supplier</Link></li>
                                </ul>
                            </li>
                            {/* SUBLAPORAN PEMBELIAN MODUL END */}

                            {/* SUBLAPORAN PEMBAYARAN MODUL START */}
                            <li className={"treeview" + (this.state.isReportPembayaran===true || 
                                path==='/report/hutang'|| 
                                path==='/report/piutang'
                                ?" active menu-open" : "")} style={modul_report_pembayaran===true?{display:'block'}:{display:'none'}}>

                                <a tabIndex="0" onClick={(e) => this.changeMenu(e,'report_pembayaran')}><i className="fa fa-money"/>Pembayaran <i className="fa fa-angle-right"></i></a>
                                <ul className={"treeview-menu animate__animated" + (this.state.isReportPembayaran===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isReportPembayaran===true
                        ?"block" : "none"}}>
                                    <li className={path==='/report/hutang'?"active":''} style={this.state.r_hutang==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/hutang" style={{width:'fit-content'}}> <i className="fa fa-dollar" />Hutang</Link></li>
                                    <li className={path==='/report/piutang'?"active":''} style={this.state.r_piutang==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/piutang" style={{width:'fit-content'}}> <i className="fa fa-credit-card" />Piutang</Link></li>
                                </ul>
                            </li>
                            {/* SUBLAPORAN PEMBAYARAN MODUL END */}
                        </ul>
                    </li>
                    {/* LAPORAN MODUL END */}

                    {/*START MODUL CETAK BARCODE*/}
                    <li  style={modul_cetak_barcode===true?{display:'block'}:{display:'none'}} className={path==='/cetak_barcode'?"active":''}><Link to="/cetak_barcode"> <i className="fa fa-barcode" /><span>Cetak Barcode </span></Link></li>
                    {/*END MODUL CETAK BARCODE*/}

                    {/* SETTINGS MODUL START */}
                    <li className={"treeview" +(this.state.isSetting===true
                        || path==='/user'
                        || path==='/location'
                        || path==='/company'
                        ?" active menu-open" : ""
                        )
                    } style={modul_setting===true?{display:'block'}:{display:'none'}}>
                        <a href="#" onClick={(e) => this.changeMenu(e,'setting')}><i className="fa fa-gears" /> <span>Setting</span> <i className="fa fa-angle-right" /></a>

                        <ul className={"treeview-menu animate__animated" + (this.state.isSetting===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isSetting===true
                        ?"block" : "none"}}>
                            <li className={path==='/company'?"active":''} style={this.state.pengaturan_umum==="0"?{"display":"none"}:{"display":"block"}}><Link to="/company" style={{width:'fit-content'}}> <i className="fa fa-gear" />Pengaturan Umum</Link></li>
                            <li className={path==='/user'?"active":''} style={this.state.pengguna==="0"?{"display":"none"}:{"display":"block"}}><Link to="/user" style={{width:'fit-content'}}> <i className="fa fa-group" />Pengguna</Link></li>
                            <li className={path==='/location'?"active":''} style={this.state.lokasi==="0"?{"display":"none"}:{"display":"block"}}><Link to="/location" style={{width:'fit-content'}}> <i className="zmdi zmdi-pin" />Lokasi</Link></li>
                        </ul>
                    </li>
                    {/* SETTINGS MODUL END */}

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