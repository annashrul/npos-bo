import React, { Component } from 'react';
import {Link} from "react-router-dom"
import {connect} from 'react-redux'
import {withRouter} from "react-router-dom"
import { logoutUser } from "../../../redux/actions/authActions";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

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
            isReportLog:false,
            isReportPenjualan:false,
            isTrxMutasi:false,
            isTrxOpname:false,
            isTrxPengiriman:false,
            isProduction:false,
            isPaid:false,
            isArea:false,
            pageMenu : '',
            dataUser:[],
            dataUser0:'',
            activeMenu:'dashboard',
            //MASTERDATA
            modul_masterdata:false,
            barang:'', departemen:'', supplier:'', customer:'', kas:'', sales:'', bank:'', promo:'',area:'',meja:'',
            //PRODUKSI
            modul_produksi:false,
            produksi:'',
            //INVENTORY
            modul_inventory:false,
            modul_inventory_opname:false,
            modul_inventory_pengiriman:false,
            modul_inventory_mutasi:false,
            delivery_note:'',alokasi:'',approval_mutasi:'',adjusment:'',opname:'',approval_opname:'',packing:'',expedisi:'',approval_mutasi_jual_beli:'',bayar_mutasi_jual_beli:'',
            //PEMBELIAN
            modul_pembelian:false,
            purchase_order:'',receive_pembelian:'',retur_tanpa_nota:'',
            //TRANSAKSI
            modul_penjualan:false,
            penjualan_barang:'',
            cash_trx:'',
            //PEMBAYARAN
            modul_pembayaran:false,
            hutang:'',piutang:'',
            //REPORT
            modul_report:false,
            modul_report_penjualan:false,
            modul_report_inventory:false,
            modul_report_pembelian:false,
            modul_report_pembayaran:false,
            modul_report_log:false,
            r_closing:'',r_kas:'',r_laba_rugi:'',r_produksi:'',r_arsip_penjualan:'',r_arsip_retur_penjualan:'',r_penjualan_by_customer:'',
            r_stock:'',r_adjusment:'',r_alokasi:'',r_delivery_note:'',r_opname:'',r_mutasi:'',r_alokasi_trx:'',r_expedisi:'',
            r_purchase_order:'',r_receive:'',r_arsip_pembelian_by_supplier:'',
            r_hutang:'',r_piutang:'',
            r_trx:'',r_act:'',
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
                    isReportPenjualan:false,
                    isReportLog:false
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
                    isReportPenjualan:false,
                    isReportLog:false
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
                    isReportPenjualan:!this.state.isReportPenjualan,
                    isReportLog:false
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
                    isReportPenjualan:false,
                    isReportLog:false
                })
            }
            if(this.state.isReportLog === true) {
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
                    isReportLog:!this.state.isReportLog,
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
                isPaid:false,
                isReportLog:false
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
                    isTrxOpname:false,
                    isTrxPengiriman:false,
                    isTrxMutasi:!this.state.isTrxMutasi,
                    isReportLog:false
                })
            }
            if(this.state.isTrxOpname === true){
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
                    isTrxMutasi:false,
                    isTrxOpname:!this.state.isTrxOpname,
                    isTrxPengiriman:false,
                    isReportLog:false
                })
            }
            if(this.state.isTrxPengiriman === true){
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
                    isTrxMutasi:false,
                    isTrxOpname:false,
                    isTrxPengiriman:!this.state.isTrxPengiriman,
                    isReportLog:false
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
                isReportLog:false,
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
        if (param === 'trx_opname'){
            this.setState({
                isTrxOpname : !this.state.isTrxOpname,
            });
        }
        if (param === 'trx_pengiriman'){
            this.setState({
                isTrxPengiriman : !this.state.isTrxPengiriman,
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
        if(param === 'report_log'){
            this.setState({
                isReportLog: !this.state.isReportLog,
                // isInventory : false
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
        if(param === 'area'){
            this.setState({
                isArea : !this.state.isArea, 
                isMasterdata : true,
                isReport : false,
                isInventory : false
            });
        }
        this.forceUpdate();
        
    }
    getProps(param){
        if (param.auth.user) {
            let akses =param.auth.user.access;
            
            if(akses!==undefined&&akses!==null){
                // SETTING
                let pengaturan_umum                 = akses[0]['value']!==null?akses[0]['value']:"0";   //cek varaibale akses apabila tidak bernilai null
                let pengguna                        = akses[1]['value']!==null?akses[1]['value']:"0";   //cek varaibale akses apabila tidak bernilai null
                let lokasi                          = akses[2]['value']!==null?akses[2]['value']:"0";   //cek varaibale akses apabila tidak bernilai null
                //MASTERDATA
                let barang                          = akses[10]['value']!==null?akses[10]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let departemen                      = akses[11]['value']!==null?akses[11]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let supplier                        = akses[12]['value']!==null?akses[12]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let customer                        = akses[13]['value']!==null?akses[13]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let kas                             = akses[14]['value']!==null?akses[14]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let sales                           = akses[15]['value']!==null?akses[15]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let bank                            = akses[16]['value']!==null?akses[16]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let promo                           = akses[17]['value']!==null?akses[17]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                //PRODUKSI
                let produksi                        = akses[20]['value']!==null?akses[20]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                //INVENTORY
                let delivery_note                   = akses[30]['value']!==null?akses[30]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let alokasi                         = akses[31]['value']!==null?akses[31]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let approval_mutasi                 = akses[32]['value']!==null?akses[32]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let adjusment                       = akses[33]['value']!==null?akses[33]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let opname                          = akses[34]['value']!==null?akses[34]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let approval_opname                 = akses[35]['value']!==null?akses[35]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let packing                         = akses[36]['value']!==null?akses[36]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let expedisi                        = akses[37]['value']!==null?akses[37]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let approval_mutasi_jual_beli       = akses[38]['value']!==null?akses[38]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let bayar_mutasi_jual_beli          = akses[39]['value']!==null?akses[39]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                //PEMBELIAN
                let purchase_order                  = akses[40]['value']!==null?akses[40]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let receive_pembelian               = akses[41]['value']!==null?akses[41]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let retur_tanpa_nota                = akses[42]['value']!==null?akses[42]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                //TRANSAKSI
                let penjualan_barang                = akses[50]['value']!==null?akses[50]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let cash_trx                        = akses[51]['value']!==null?akses[50]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                //PEMBAYARAN
                let hutang                          = akses[60]['value']!==null?akses[60]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let piutang                         = akses[61]['value']!==null?akses[61]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                //REPORT
                let r_closing                       = akses[70]['value']!==null?akses[70]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let r_kas                           = akses[71]['value']!==null?akses[71]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let r_laba_rugi                     = akses[72]['value']!==null?akses[72]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let r_produksi                      = akses[73]['value']!==null?akses[73]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let r_arsip_penjualan               = akses[74]['value']!==null?akses[74]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let r_arsip_retur_penjualan         = akses[75]['value']!==null?akses[75]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let r_penjualan_by_customer         = akses[76]['value']!==null?akses[76]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let r_stock                         = akses[77]['value']!==null?akses[77]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let r_adjusment                     = akses[78]['value']!==null?akses[78]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let r_alokasi                       = akses[79]['value']!==null?akses[79]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let r_delivery_note                 = akses[80]['value']!==null?akses[80]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let r_opname                        = akses[81]['value']!==null?akses[81]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let r_mutasi                        = akses[82]['value']!==null?akses[82]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let r_alokasi_trx                   = akses[83]['value']!==null?akses[83]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let r_expedisi                      = akses[84]['value']!==null?akses[84]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let r_purchase_order                = akses[85]['value']!==null?akses[85]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let r_receive                       = akses[86]['value']!==null?akses[86]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let r_arsip_pembelian_by_supplier   = akses[87]['value']!==null?akses[87]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let r_hutang                        = akses[88]['value']!==null?akses[88]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let r_piutang                       = akses[89]['value']!==null?akses[89]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let r_trx                           = akses[88]['value']!==null?akses[88]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                let r_act                           = akses[89]['value']!==null?akses[89]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                //CETAK BARCODE
                let cetak_barcode                   = akses[90]['value']!==null?akses[90]['value']:"0"; //cek varaibale akses apabila tidak bernilai null
                // start pengecekan apabila fitur bernilai 0
                //setting
                if(pengaturan_umum!=='0'&&pengguna!=='0'&&lokasi!=='0'){
                    this.setState({modul_setting:true});
                }
                //masterdata
                if(barang!=='0'&&departemen!=='0'&&supplier!=='0'&&customer!=='0'&&kas!=='0'&&sales!=='0'&&bank!=='0'&&promo!=='0'){
                    this.setState({modul_masterdata:true});
                }
                //produksi
                if(produksi!=='0'){
                    this.setState({modul_produksi:true});
                }
                //inventory
                if(delivery_note!=='0'&&alokasi!=='0'&&approval_mutasi!=='0'&&adjusment!=='0'&&opname!=='0'&&approval_opname!=='0'&&packing!=='0'&&expedisi!=='0'&&approval_mutasi_jual_beli!=='0'&&bayar_mutasi_jual_beli!=='0'){
                    this.setState({modul_inventory:true});
                }
                if(approval_mutasi_jual_beli!=='0'||bayar_mutasi_jual_beli!=='0'){
                    this.setState({modul_inventory:true,modul_inventory_mutasi:true});
                }
                if(opname!=='0'||approval_opname!=='0'){
                    this.setState({modul_inventory:true,modul_inventory_opname:true});
                }
                if(packing!=='0'||expedisi!=='0'){
                    this.setState({modul_inventory:true,modul_inventory_pengiriman:true});
                }
                if(purchase_order!=='0'||receive_pembelian!=='0'||retur_tanpa_nota!=='0'){
                    this.setState({modul_pembelian:true});
                }
                if(penjualan_barang!=='0'||cash_trx!=='0'){
                    this.setState({modul_penjualan:true});
                }
                if(hutang!=='0'||piutang!=='0'){
                    this.setState({modul_pembayaran:true});
                }
                if(
                    r_closing!=='0'||r_kas!=='0'||r_laba_rugi!=='0'||
                    r_produksi!=='0'||
                    r_arsip_penjualan!=='0'||r_arsip_retur_penjualan!=='0'||r_penjualan_by_customer!=='0'||
                    r_stock!=='0'||r_adjusment!=='0'|| r_alokasi!=='0'|| r_delivery_note!=='0'|| r_opname!=='0'|| r_mutasi!=='0'|| r_alokasi_trx!=='0'|| r_expedisi!=='0'||
                    r_purchase_order!=='0'|| r_receive!=='0'|| r_arsip_pembelian_by_supplier!=='0'||
                    r_hutang!=='0'|| r_piutang!=='0'
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
                if(r_trx!=='0'||r_act!=='0'){
                    this.setState({modul_report:true,modul_report_log:true});
                }
                if(cetak_barcode!=='0'){
                    this.setState({modul_cetak_barcode:true});
                }
                // end pengecekan apabila fitur bernilai 0
                // start set ke state nilai yang sudah dicek
                this.setState({
                    // SETTING
                    pengaturan_umum:pengaturan_umum, pengguna:pengguna, lokasi:lokasi,
                    // //MASTERDATA
                    barang:barang, departemen:departemen, supplier:supplier, customer:customer, kas:kas,
                    sales:sales, bank:bank, promo:promo,
                    // //PRODUKSI
                    produksi:produksi,
                    //INVENTORY
                    delivery_note:delivery_note, alokasi:alokasi, approval_mutasi:approval_mutasi, adjusment:adjusment, opname:opname, approval_opname:approval_opname,
                    packing:packing, approval_mutasi_jual_beli:approval_mutasi_jual_beli, bayar_mutasi_jual_beli:bayar_mutasi_jual_beli,
                    //PEMBELIAN
                    purchase_order:purchase_order, receive_pembelian:receive_pembelian,
                    retur_tanpa_nota:retur_tanpa_nota,
                    //TRANSAKSI
                    penjualan_barang:penjualan_barang, cash_trx:cash_trx,
                    //PEMBAYARAN
                    hutang:hutang, piutang:piutang,
                    //REPORT
                    r_closing:r_closing, r_kas:r_kas, r_laba_rugi:r_laba_rugi, r_produksi:r_produksi, r_arsip_penjualan:r_arsip_penjualan,
                    r_arsip_retur_penjualan:r_arsip_retur_penjualan, r_penjualan_by_customer:r_penjualan_by_customer, r_stock:r_stock,
                    r_adjusment:r_adjusment, r_alokasi:r_alokasi, r_delivery_note:r_delivery_note, r_opname:r_opname, r_mutasi:r_mutasi,
                    r_alokasi_trx:r_alokasi_trx, r_expedisi:r_expedisi, r_purchase_order:r_purchase_order, r_receive:r_receive,
                    r_arsip_pembelian_by_supplier:r_arsip_pembelian_by_supplier, r_hutang:r_hutang, r_piutang:r_piutang, r_trx:r_trx, r_act:r_act,
                    //CETAK BARCODE
                    cetak_barcode:cetak_barcode,
                })
                // end set ke state nilai yang sudah dicek
            }
        }
    }
    componentDidMount(){
        this.getProps(this.props);
      
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
            path==='/bank' ||
            path==='/area' ||
            path==='/meja' 
            ){
            
            this.setState({
                isMasterdata:true
            })
                if(
                    path==='/area' ||
                    path==='/meja'
                    ){
                    this.setState({
                        isArea:true,
                    })
                }
        } else if(
            path === '/delivery_note' ||
            path === '/alokasi' ||
            path === '/adjustment'||
            path === '/approval_mutasi'||
            path === '/opname'||
            path === '/approval_opname' ||
            path === '/packing' ||
            path === '/expedisi' ||
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
                    isTrxMutasi:true,
                    isTrxOpname:false,
                    isTrxPengiriman:false,
                })
            }
            if(path==='/opname' || path==='/approval_opname'){
                this.setState({
                    isTrxMutasi:false,
                    isTrxOpname:true,
                    isTrxPengiriman:false,
                })
            }
            if(path==='/packing' || path==='/expedisi'){
                this.setState({
                    isTrxMutasi:false,
                    isTrxOpname:false,
                    isTrxPengiriman:true,
                })
            }
        } else if(path==='/purchase_order' || path === '/receive'|| path === '/retur_tanpa_nota'){
            
            this.setState({
                isReceive:true
            })
        } else if(path==='/sale' || path==='/cash_trx'){
            
            this.setState({
                isSale:true
            })
        } else if(
            path==='/report/cash'|| 
            path==='/report/laba_rugi'|| 
            path==='/report/sale_archive'|| 
            path==='/report/sale_retur_archive'|| 
            path==='/report/sale_by_cust_archive'|| 
            path==='/report/sale_by_product_archive'|| 
            path==='/report/closing' ||
            path==='/report/inventory'||
            path==='/report/adjustment'|| 
            path==='/report/alokasi' ||
            path==='/report/dn' ||
            path==='/report/opname' ||
            path==='/report/expedisi' ||
            path==='/report/packing' ||
            path==='/report/mutation' ||
            path==='/report/alokasi_trx' ||
            path==='/report/production' ||

            path==='/report/po'||
            path==='/report/receive'||
            path==='/report/purchase_by_supplier'||

            path==='/report/hutang' ||
            path==='/report/piutang' ||

            path==='/log/trx' ||
            path==='/log/act'
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
                path==='/report/packing' || 
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
               path==='/report/sale_by_cust_archive' ||
               path==='/report/sale_by_product_archive'
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
           } else if(
               path==='/log/trx' ||
               path==='/log/act'
               ){
               
               this.setState({
                   isReportLog:true
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
    
    handleLogout = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Apakah anda yakin akan logout aplikasi?',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya!'
        }).then((result) => {
            if (result.value) {
                this.props.logoutUser();
            }
        })
    };
    render() {
        // const clickAble = {
        //     color: '#a6b6d0',
        //     "&:hover": {
        //         color: "#333"
        //     },
        //     cursor: 'pointer'
        // }
        const path = this.props.location.pathname;
        const {
            modul_setting,
            modul_masterdata,
            // modul_produksi,
            modul_inventory,modul_inventory_mutasi,modul_inventory_opname,modul_inventory_pengiriman,
            modul_pembelian,
            modul_penjualan,
            modul_pembayaran,
            modul_report,modul_report_penjualan,modul_report_inventory,modul_report_pembelian,modul_report_pembayaran,modul_report_log,
            modul_cetak_barcode,
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

                        <a href="!#" onClick={(e) => this.changeMenu(e,'masterdata')}><i className="zmdi zmdi-receipt" /> <span>Master Data</span> <i className="fa fa-angle-right" /></a>
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

                            {/* <li className={"treeview" + (this.state.isArea===true || path==='/area'|| path==='/meja'?" active menu-open" : "")} style={modul_masterdata===true?{display:'block'}:{display:'none'}}>
                                <a href="!#" onClick={(e) => this.changeMenu(e,'area')}><i className="fa fa-map" /> <span>Data Area</span> <i className="fa fa-angle-right"/></a>
                                <ul className={"treeview-menu animate__animated" + (this.state.isArea===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isArea===true ?"block" : "none"}}>
                                    <li className={path==='/area'?"active":''} style={this.state.area==="0"?{"display":"none"}:{"display":"block"}}><Link to="/area" style={{width:'fit-content'}}> <i className="zmdi zmdi-balance" />Area </Link></li>
                                    <li className={path==='/meja'?"active":''} style={this.state.meja==="0"?{"display":"none"}:{"display":"block"}}><Link to="/meja" style={{width:'fit-content'}}> <i className="zmdi zmdi-panorama-wide-angle" />Meja </Link></li>
                                </ul>
                            </li> */}
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
                        path === '/packing'||
                        path === '/expedisi'
                        ?" active menu-open" : "")} style={modul_inventory===true?{display:'block'}:{display:'none'}}>
                        <a href="!#" onClick={(e) => this.changeMenu(e,'inventory')}><i className="zmdi zmdi-storage" /> <span>Inventory</span> <i className="fa fa-angle-right" /></a>
                        <ul className={"treeview-menu animate__animated" + (this.state.isInventory===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isInventory===true
                        ?"block" : "none"}}>
                            <li className={path==='/adjustment'?"active":''} style={this.state.adjusment==="0"?{"display":"none"}:{"display":"block"}}><Link to="/adjustment" style={{width:'fit-content'}}> <i className="fa fa-adjust" />Adjustment </Link></li>
                            <li className={path==='/delivery_note'?"active":''} style={this.state.delivery_note==="0"?{"display":"none"}:{"display":"block"}}><Link to="/delivery_note" style={{width:'fit-content'}}> <i className="fa fa-sticky-note" />Delivery Note</Link></li>
                            <li className={path==='/alokasi'?"active":''} style={this.state.alokasi==="0"?{"display":"none"}:{"display":"block"}}><Link to="/alokasi" style={{width:'fit-content'}}> <i className="fa fa-dropbox" />Alokasi </Link></li>
                            <li className={path==='/approval_mutasi'?"active":''} style={this.state.approval_mutasi==="0"?{"display":"none"}:{"display":"block"}}><Link to="/approval_mutasi" style={{width:'fit-content'}}> <i className="zmdi zmdi-calendar-check" />Approval Mutasi </Link></li>
                            <li className={"treeview" + (this.state.isTrxOpname===true || path==='/opname'|| path==='/approval_opname'?" active menu-open" : "")} style={modul_inventory_opname===true?{display:'block'}:{display:'none'}}>
                                <a href="!#" onClick={(e) => this.changeMenu(e,'trx_opname')}><i className="fa fa-object-group" /> <span>Opname</span> <i className="fa fa-angle-right"/></a>
                                <ul className={"treeview-menu animate__animated" + (this.state.isTrxOpname===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isTrxOpname===true ?"block" : "none"}}>
                                    <li className={path==='/opname'?"active":''} style={this.state.opname==="0"?{"display":"none"}:{"display":"block"}}><Link to="/opname" style={{width:'fit-content'}}> <i className="fa fa-balance-scale" />Transaksi </Link></li>
                                    <li className={path==='/approval_opname'?"active":''} style={this.state.approval_opname==="0"?{"display":"none"}:{"display":"block"}}><Link to="/approval_opname" style={{width:'fit-content'}}> <i className="zmdi zmdi-calendar-check" />Approval </Link></li>
                                </ul>
                            </li>
                            <li className={"treeview" + (this.state.isTrxPengiriman===true || path==='/packing'|| path==='/expedisi'?" active menu-open" : "")} style={modul_inventory_pengiriman===true?{display:'block'}:{display:'none'}}>
                                <a href="!#" onClick={(e) => this.changeMenu(e,'trx_pengiriman')}><i className="fa fa-send" /> <span>Pengiriman</span> <i className="fa fa-angle-right"/></a>
                                <ul className={"treeview-menu animate__animated" + (this.state.isTrxPengiriman===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isTrxPengiriman===true ?"block" : "none"}}>
                                    <li className={path==='/packing'?"active":''} style={this.state.packing==="0"?{"display":"none"}:{"display":"block"}}><Link to="/packing" style={{width:'fit-content'}}> <i className="fa fa-codepen" />Packing </Link></li>
                                    <li className={path==='/expedisi'?"active":''} style={this.state.packing==="0"?{"display":"none"}:{"display":"block"}}><Link to="/expedisi" style={{width:'fit-content'}}> <i className="fa fa-truck" />Expedisi </Link></li>
                                </ul>
                            </li>
                            <li className={"treeview" + (this.state.isTrxMutasi===true || path==='/approval_mutasi_jual_beli'|| path==='/bayar_mutasi_jual_beli'?" active menu-open" : "")} style={modul_inventory_mutasi===true?{display:'block'}:{display:'none'}}>
                                <a href="!#" onClick={(e) => this.changeMenu(e,'trx_mutasi')}><i className="zmdi zmdi-card" /> <span>Mutasi Jual Beli</span> <i className="fa fa-angle-right"/></a>
                                <ul className={"treeview-menu animate__animated" + (this.state.isTrxMutasi===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isTrxMutasi===true ?"block" : "none"}}>
                                    <li className={path==='/approval_mutasi_jual_beli'?"active":''} style={this.state.approval_mutasi_jual_beli==="0"?{"display":"none"}:{"display":"block"}}><Link to="/approval_mutasi_jual_beli" style={{width:'fit-content'}}> <i className="zmdi zmdi-calendar-check" />Approval</Link></li>
                                    <li className={path==='/bayar_mutasi_jual_beli'?"active":''} style={this.state.bayar_mutasi_jual_beli==="0"?{"display":"none"}:{"display":"block"}}><Link to="/bayar_mutasi_jual_beli" style={{width:'fit-content'}}> <i className="fa fa-money" />Bayar</Link></li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    {/* INVENTORY MODUL END */}

                    {/* PEMBELIAN MODUL START */}

                    <li className={"treeview" + (this.state.isReceive===true  || path==='/purchase_order' || path === '/receive'|| path === '/retur_tanpa_nota' ?" active menu-open" : "")}  style={modul_pembelian===true?{display:'block'}:{display:'none'}}>
                        <a href="!#" onClick={(e) => this.changeMenu(e,'receive')}><i className="fa fa-list-alt"/> <span>Pembelian</span> <i className="fa fa-angle-right" /></a>
                        <ul className={"treeview-menu animate__animated" + (this.state.isReceive===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isReceive===true
                        ?"block" : "none"}}>
                            <li className={path==='/purchase_order'?"active":''} style={this.state.purchase_order==="0"?{"display":"none"}:{"display":"block"}}><Link to="/purchase_order" style={{width:'fit-content'}}> <i className="fa fa-list-ol" />Purchase Order</Link></li>
                            <li className={path==='/receive'?"active":''} style={this.state.receive_pembelian==="0"?{"display":"none"}:{"display":"block"}}><Link to="/receive" style={{width:'fit-content'}}> <i className="zmdi zmdi-assignment-check" />Receive Pembelian</Link></li>
                            <li className={path==='/retur_tanpa_nota'?"active":''} style={this.state.retur_tanpa_nota==="0"?{"display":"none"}:{"display":"block"}}><Link to="/retur_tanpa_nota" style={{width:'fit-content'}}> <i className="fa fa-rotate-left" />Retur Tanpa Nota</Link></li>
                        </ul>
                    </li>
                    {/* PEMBELIAN MODUL END */}

                    {/* TRANSAKSI MODUL START */}
                    <li className={"treeview" + (this.state.isSale===true  || path==='/sale'?" active menu-open" : "")} style={modul_penjualan===true?{display:'block'}:{display:'none'}}>
                        <a href="!#" onClick={(e) => this.changeMenu(e,'sale')}><i className="fa fa-shopping-cart" /> <span>Transaksi</span> <i className="fa fa-angle-right" /></a>
                        <ul className={"treeview-menu animate__animated" + (this.state.isSale===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isSale===true
                        ?"block" : "none"}}>
                            <li className={path==='/sale'?"active":''} style={this.state.penjualan_barang==="0"?{"display":"none"}:{"display":"block"}}><Link to="/sale" style={{width:'fit-content'}}> <i className="fa fa-shopping-bag" />Penjualan Barang</Link></li>
                            <li className={path==='/cash_trx'?"active":''} style={this.state.cash_trx==="0"?{"display":"none"}:{"display":"block"}}><Link to="/cash_trx" style={{width:'fit-content'}}> <i className="fa fa-archive" />Transaksi Kas</Link></li>
                        </ul>
                    </li>
                    {/* TRANSAKSI MODUL END */}

                    {/* PEMBAYARAN SECTION START */}
                    <li className={"treeview" + (this.state.isPaid===true  || path==='/bayar_hutang' || path==='/bayar_piutang'?" active menu-open" : "")} style={modul_pembayaran===true?{display:'block'}:{display:'none'}}>
                        <a href="!#" onClick={(e) => this.changeMenu(e,'paid')}><i className="fa fa-money" /> <span>Pembayaran</span> <i className="fa fa-angle-right" /></a>
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
                        this.state.isReportLog===true ||
                        path==='/report/cash'||
                        path==='/report/closing'
                        ?" active menu-open" : "")} style={modul_report===true?{display:'block'}:{display:'none'}}>
                        <a href="!#" onClick={(e) => this.changeMenu(e,'report')}><i className="zmdi zmdi-book" /> <span>Report</span> <i className="fa fa-angle-right" /></a>

                        <ul className={"treeview-menu animate__animated" + (this.state.isReport===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isReport===true || this.state.isReportInventory===true || this.state.isReportPembelian===true ?"block" : "none"}}>
                            <li className={path==='/report/closing'?"active":''} style={this.state.r_closing==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/closing" style={{width:'fit-content'}}> <i className="zmdi zmdi-lock" />Closing</Link></li>
                            <li className={path==='/report/cash'?"active":''} style={this.state.r_kas==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/cash" style={{width:'fit-content'}}> <i className="fa fa-money" />Kas</Link></li>
                            <li className={path==='/report/laba_rugi'?"active":''} style={this.state.r_laba_rugi==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/laba_rugi" style={{width:'fit-content'}}> <i className="zmdi zmdi-archive" />Laba Rugi</Link></li>
                            <li className={path==='/report/production'?"active":''} style={this.state.r_produksi==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/production" style={{width:'fit-content'}}> <i className="fa fa-product-hunt" />Produksi</Link></li>

                            {/* SUBLAPORAN TRANSAKSI MODUL START */}
                            <li className={"treeview" + (this.state.isReportPenjualan===true || 
                                path==='/report/sale_archive' || 
                                path==='/report/sale_retur_archive' || 
                                path==='/report/sale_by_cust_archive' ||
                                path==='/report/sale_by_product_archive' 
                                ?" active menu-open" : "")} style={modul_report_penjualan===true?{display:'block'}:{display:'none'}}>
                                <a href="!#" onClick={(e) => this.changeMenu(e,'report_penjualan')}><i className="fa fa-list-alt"/>Penjualan <i className="fa fa-angle-right"/></a>

                                <ul className={"treeview-menu animate__animated" + (this.state.isReportPenjualan===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isReportPenjualan===true ?"block" : "none"}}>
                                    <li className={path==='/report/sale_archive'?"active":''} style={this.state.r_arsip_penjualan==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/sale_archive" style={{width:'fit-content'}}> <i className="zmdi zmdi-archive" />Arsip Penjualan</Link></li>
                                    <li className={path==='/report/sale_retur_archive'?"active":''} style={this.state.r_arsip_retur_penjualan==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/sale_retur_archive" style={{width:'fit-content'}}> <i className="zmdi zmdi-archive" />Arsip Retur Penjualan</Link></li>
                                    <li className={path==='/report/sale_by_cust_archive'?"active":''} style={this.state.r_penjualan_by_customer==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/sale_by_cust_archive" style={{width:'fit-content'}}> <i className="zmdi zmdi-assignment-check" />Penjualan by Cust.</Link></li>
                                    <li className={path==='/report/sale_by_product_archive'?"active":''} style={this.state.r_penjualan_by_customer==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/sale_by_product_archive" style={{width:'fit-content'}}> <i className="zmdi zmdi-assignment-check" />Penjualan by Barang</Link></li>
                                </ul>
                            </li>
                            {/* SUBLAPORAN TRANSAKSI MODUL END */}

                            {/* SUBLAPORAN INVENTORY MODUL START */}
                            <li className={"treeview" + (this.state.isReportInventory===true ||
                                path==='/report/inventory'|| path==='/report/adjustment'||
                                path==='/report/alokasi'||
                                path==='/report/opname'||
                                path==='/report/packing'||
                                path==='/report/expedisi'||
                                path==='/report/mutation'||
                                path==='/report/alokasi_trx'||
                                path==='/report/dn'?" active menu-open" : "")} style={modul_report_inventory===true?{display:'block'}:{display:'none'}}>
                                <a href="!#" onClick={(e) => this.changeMenu(e,'report_inventory')}><i className="zmdi zmdi-widgets"/>Inventory <i className="fa fa-angle-right"/></a>
                                <ul className={"treeview-menu animate__animated" + (this.state.isReportInventory===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isReportInventory===true?"block" : "none"}}>
                                    <li className={path==='/report/inventory'?"active":''} style={this.state.r_stock==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/inventory" style={{width:'fit-content'}}> <i className="zmdi zmdi-chart" />Stock</Link></li>
                                    <li className={path==='/report/adjustment'?"active":''} style={this.state.r_adjusment==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/adjustment" style={{width:'fit-content'}}> <i className="fa fa-adjust" />Adjustment</Link></li>
                                    <li className={path==='/report/alokasi'?"active":''} style={this.state.r_alokasi==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/alokasi" style={{width:'fit-content'}}> <i className="fa fa-dropbox" />Alokasi</Link></li>
                                    <li className={path==='/report/dn'?"active":''} style={this.state.r_delivery_note==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/dn" style={{width:'fit-content'}}> <i className="fa fa-sticky-note" />Delivery Note</Link></li>
                                    <li className={path==='/report/opname'?"active":''} style={this.state.r_opname==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/opname" style={{width:'fit-content'}}> <i className="fa fa-balance-scale" />Opname</Link></li>
                                    <li className={path==='/report/mutation'?"active":''} style={this.state.r_mutasi==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/mutation" style={{width:'fit-content'}}> <i className="zmdi zmdi-card" />Mutasi</Link></li>
                                    <li className={path==='/report/alokasi_trx'?"active":''} style={this.state.r_alokasi_trx==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/alokasi_trx" style={{width:'fit-content'}}> <i className="fa fa-money" />Alokasi Trx</Link></li>
                                    <li className={path==='/report/packing'?"active":''} style={this.state.r_expedisi==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/packing" style={{width:'fit-content'}}> <i className="fa fa-codepen" />Packing</Link></li>
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

                                <a href="!#" onClick={(e) => this.changeMenu(e,'report_pembelian')}><i className="fa fa-list-alt"/>Pembelian <i className="fa fa-angle-right"/></a>
                                <ul className={"treeview-menu animate__animated" + (this.state.isReportPembelian===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isReportPembelian===true
                        ?"block" : "none"}}>
                                    <li className={path==='/report/po'?"active":''} style={this.state.r_purchase_order==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/po" style={{width:'fit-content'}}> <i className="fa fa-list-ol" />Purchase Order</Link></li>
                                    <li className={path==='/report/receive'?"active":''} style={this.state.r_receive==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/receive" style={{width:'fit-content'}}> <i className="zmdi zmdi-assignment-check" />Receive</Link></li>
                                    <li className={path==='/report/purchase_by_supplier'?"active":''} style={this.state.r_arsip_pembelian_by_supplier==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/purchase_by_supplier" style={{width:'fit-content'}}> <i className="zmdi zmdi-assignment-check" />Pembelian by Supplier</Link></li>
                                </ul>
                            </li>
                            {/* SUBLAPORAN PEMBELIAN MODUL END */}

                            {/* SUBLAPORAN PEMBAYARAN MODUL START */}
                            <li className={"treeview" + (this.state.isReportPembayaran===true || 
                                path==='/report/hutang'|| 
                                path==='/report/piutang'
                                ?" active menu-open" : "")} style={modul_report_pembayaran===true?{display:'block'}:{display:'none'}}>

                                <a href="!#" onClick={(e) => this.changeMenu(e,'report_pembayaran')}><i className="fa fa-money"/>Pembayaran <i className="fa fa-angle-right"/></a>
                                <ul className={"treeview-menu animate__animated" + (this.state.isReportPembayaran===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isReportPembayaran===true
                        ?"block" : "none"}}>
                                    <li className={path==='/report/hutang'?"active":''} style={this.state.r_hutang==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/hutang" style={{width:'fit-content'}}> <i className="fa fa-dollar" />Hutang</Link></li>
                                    <li className={path==='/report/piutang'?"active":''} style={this.state.r_piutang==="0"?{"display":"none"}:{"display":"block"}}><Link to="/report/piutang" style={{width:'fit-content'}}> <i className="fa fa-credit-card" />Piutang</Link></li>
                                </ul>
                            </li>
                            {/* SUBLAPORAN PEMBAYARAN MODUL END */}

                            {/* SUBLAPORAN LOG MODUL START */}
                            <li className={"treeview" + (this.state.isReportLog===true || 
                                path==='/log/trx'|| 
                                path==='/log/act'
                                ?" active menu-open" : "")} style={modul_report_log===true?{display:'block'}:{display:'none'}}>

                                <a href="!#" onClick={(e) => this.changeMenu(e,'report_log')}><i className="fa fa-pencil"/>Log <i className="fa fa-angle-right"/></a>
                                <ul className={"treeview-menu animate__animated" + (this.state.isReportLog===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isReportLog===true
                        ?"block" : "none"}}>
                                    <li className={path==='/log/trx'?"active":''} style={this.state.r_hutang==="0"?{"display":"none"}:{"display":"block"}}><Link to="/log/trx" style={{width:'fit-content'}}> <i className="fa fa-file-text" />Transaksi</Link></li>
                                    <li className={path==='/log/act'?"active":''} style={this.state.r_piutang==="0"?{"display":"none"}:{"display":"block"}}><Link to="/log/act" style={{width:'fit-content'}}> <i className="fa fa-file-text" />Aktivitas</Link></li>
                                </ul>
                            </li>
                            {/* SUBLAPORAN LOG MODUL END */}
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
                        <a href="!#" onClick={(e) => this.changeMenu(e,'setting')}><i className="fa fa-gears" /> <span>Setting</span> <i className="fa fa-angle-right" /></a>
                        <ul className={"treeview-menu animate__animated" + (this.state.isSetting===true ?" animate__bounceInRight " : " animate__fadeOutLeft ") + "animate__faster"} style={{display:this.state.isSetting===true
                        ?"block" : "none"}}>
                            <li className={path==='/company'?"active":''} style={this.state.pengaturan_umum==="0"?{"display":"none"}:{"display":"block"}}><Link to="/company" style={{width:'fit-content'}}> <i className="fa fa-gear" />Pengaturan Umum</Link></li>
                            <li className={path==='/user'?"active":''} style={this.state.pengguna==="0"?{"display":"none"}:{"display":"block"}}><Link to="/user" style={{width:'fit-content'}}> <i className="fa fa-group" />Pengguna</Link></li>
                            <li className={path==='/location'?"active":''} style={this.state.lokasi==="0"?{"display":"none"}:{"display":"block"}}><Link to="/location" style={{width:'fit-content'}}> <i className="zmdi zmdi-pin" />Lokasi</Link></li>
                        </ul>
                    </li>
                    {/* SETTINGS MODUL END */}

                    {/* LOGOUT MODUL START */}
                    <li><a href={null} style={{cursor:'pointer',color:'#a6b6d0'}} onClick={(event)=>this.handleLogout(event)}> <i className="fa fa-chain-broken" /><span> Logout</span></a></li>
                    {/* LOGOUT MODUL END */}
                </ul>
            </nav>
        )
    }
}
SideMenu.propTypes = {
    logoutUser: PropTypes.func.isRequired
};
const mapStateToProps = (state) => {
    return{
        auth: state.auth
    }
}

export default withRouter(connect(mapStateToProps,{logoutUser})(SideMenu))