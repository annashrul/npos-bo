import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalHeader} from "reactstrap";
import connect from "react-redux/es/connect/connect";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {stringifyFormData} from "helper";
import {setProductEdit,createProduct,updateProduct} from "redux/actions/masterdata/product/product.action";
import {FetchProductCode} from "redux/actions/masterdata/product/product.action";
import {FetchCheck, setCheck, setLoading} from "redux/actions/site.action";
import axios from "axios";
import {HEADERS} from "redux/actions/_constants";
import Select from "react-select";
import FileBase64 from "react-file-base64";
import moment from "moment";
import {toPersen} from "../../../../../helper";

class FormProduct extends Component{
    constructor(props){
        super(props);
        this.state = {
            nm_harga1:"1",
            nm_harga2:"2",
            nm_harga3:"3",
            nm_harga4:"4",
            set_harga:1,
            selectedIndex: 0,
            error_barcode1:false,
            error_barcode2:false,
            error_barcode3:false,
            pesan_barcode1:"",
            pesan_barcode2:"",
            pesan_barcode3:"",
            error:{
                kd_brg:"",
                nm_brg:"",
                kel_brg:"",
                stock:"",
                kategori:"",
                stock_min:"",
                group1:"",
                group2:"",
                deskripsi:"",
                jenis:"",
                kcp:"",
                poin:"",
                online:"",
                berat:"",
                barang_sku_err:[]
            },
            kd_brg: '',
            nm_brg: '',
            kel_brg_data:[],
            kel_brg: '',
            stock: '0',
            kategori: '',
            stock_min: '0',
            group1_data:[],
            group1: '',
            group2_data:[],
            group2: '',
            deskripsi: '-',
            gambar: '',
            jenis: '',
            kcp: '',
            poin: '0',
            online: '0',
            berat: '0',
            barangSku: [{"barcode": "", "qty": "", "konversi": "", "satuan_jual": "1"}],
            barangHargaEdit: [[
                {
                    "nama_toko":"","lokasi":"",
                    "isCheckedPCS":false,
                    "hrgBeliPCS": 0,
                    "margin1PCS":"0","margin2PCS":"0","margin3PCS":"0","margin4PCS":"0",
                    "hrgJual1PCS":"0","hrgJual2PCS":"0","hrgJual3PCS":"0","hrgJual4PCS":"0",
                    "ppnPCS": 0,
                    "servicePCS":0
                },
                {
                    "nama_toko":"","lokasi":"",
                    "isCheckedPACK":false,
                    "hrgBeliPACK":0,
                    "margin1PACK":"0","margin2PACK":"0","margin3PACK":"0","margin4PACK":"0",
                    "hrgJual1PACK":"0","hrgJual2PACK":"","hrgJual3PACK":"0","hrgJual4PACK":"0",
                    "ppnPACK": 0,
                    "servicePACK":0
                },
                {
                    "nama_toko":"","lokasi":"",
                    "isCheckedKARTON":false,
                    "hrgBeliKARTON":0,
                    "margin1KARTON":"0","margin2KARTON":"0","margin3KARTON":"0","margin4KARTON":"0",
                    "hrgJual1KARTON":"0","hrgJual2KARTON":"0","hrgJual3KARTON":"0","hrgJual4KARTON":"0",
                    "ppnKARTON":0,
                    "serviceKARTON":0
                }
            ]],
            barangHarga: [[
                {
                    "nama_toko":"","lokasi":"",
                    "isCheckedPCS":false,
                    "hrgBeliPCS": 0,
                    "margin1PCS":"0","margin2PCS":"0","margin3PCS":"0","margin4PCS":"0",
                    "hrgJual1PCS":"0","hrgJual2PCS":"0","hrgJual3PCS":"0","hrgJual4PCS":"0",
                    "ppnPCS": 0,
                    "servicePCS":0
                },
                {
                    "nama_toko":"","lokasi":"",
                    "isCheckedPACK":false,
                    "hrgBeliPACK":0,
                    "margin1PACK":"0","margin2PACK":"0","margin3PACK":"0","margin4PACK":"0",
                    "hrgJual1PACK":"0","hrgJual2PACK":"0","hrgJual3PACK":"0","hrgJual4PACK":"0",
                    "ppnPACK": 0,
                    "servicePACK":0
                },
                {
                    "nama_toko":"","lokasi":"",
                    "isCheckedKARTON":false,
                    "hrgBeliKARTON":0,
                    "margin1KARTON":"0","margin2KARTON":"0","margin3KARTON":"0","margin4KARTON":"0",
                    "hrgJual1KARTON":"0","hrgJual2KARTON":"0","hrgJual3KARTON":"0","hrgJual4KARTON":"0",
                    "ppnKARTON":0,
                    "serviceKARTON":0
                }
            ]],
            barcode: [],
            qty: [],
            konversi: [],
            satuan_jual: [],
            isChecked: false,
            PACK: false,
            KARTON: false,
            check: [],
            hrg_beli: '0', hrg_beli_pack: '0', hrg_beli_karton: '0',
            margin1: '0', margin2: '0', margin3: '0', margin4: '0',
            margin1_pack: '0', margin2_pack: '0', margin3_pack: '0', margin4_pack: '0',
            margin1_karton: '0', margin2_karton: '0', margin3_karton: '0', margin4_karton: '0',
            hrgjual1:'0', hrgjual2: '0', hrgjual3: '0', hrgjual4: '0',
            hrgjual1_pack: '0', hrgjual2_pack: '0', hrgjual3_pack: '0', hrgjual4_pack: '0',
            hrgjual1_karton: '0', hrgjual2_karton: '0', hrgjual3_karton: '0', hrgjual4_karton: '0',
            service: '0', service_pack: '0', service_karton: '0',
            ppn: '0', ppn_pack: '0', ppn_karton: '0',

            hrgBeliPACK: 0,
            margin1PACK: '0', margin2PACK: '0', margin3PACK: '0', margin4PACK: '0',
            hrgJual1PACK: '0', hrgJual2PACK: '0', hrgJual3PACK: '0', hrgJual4PACK: '0',
            servicePACK: 0, ppnPACK: 0,

            hrgBeliKARTON: 0,
            margin1KARTON: '0', margin2KARTON: '0', margin3KARTON: '0', margin4KARTON: '0',
            hrgJual1KARTON: '0', hrgJual2KARTON: '0', hrgJual3KARTON: '0', hrgJual4KARTON: '0',
            serviceKARTON: 0, ppnKARTON: 0,
            purchasePrice: {},
            generateCode:false,
            codeServer:0,

        };
        this.handleKelompokBarang = this.handleKelompokBarang.bind(this);
        this.handleGroup1 = this.handleGroup1.bind(this);
        this.handleGroup2 = this.handleGroup2.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onHandleChangeChild = this.onHandleChangeChild.bind(this);
        this.onHandleChangeChildSku = this.onHandleChangeChildSku.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.generateCode = this.generateCode.bind(this);
        this.checkData = this.checkData.bind(this);
    }

    clearState(){
        this.setState({
            nm_harga1:"1",
            nm_harga2:"2",
            nm_harga3:"3",
            nm_harga4:"4",
            set_harga:1,
            selectedIndex: 0,
            error_barcode1:false,
            error_barcode2:false,
            error_barcode3:false,
            pesan_barcode1:"",
            pesan_barcode2:"",
            pesan_barcode3:"",
            error:{
                kd_brg:"",
                nm_brg:"",
                kel_brg:"",
                stock:"",
                kategori:"",
                stock_min:"",
                group1:"",
                group2:"",
                deskripsi:"",
                jenis:"",
                kcp:"",
                poin:"",
                online:"",
                berat:"",
                barang_sku_err:[]
            },
            kd_brg: '',
            nm_brg: '',
            kel_brg_data:[],
            kel_brg: '',
            stock: '0',
            kategori: '',
            stock_min: '0',
            group1_data:[],
            group1: '',
            group2_data:[],
            group2: '',
            deskripsi: '-',
            gambar: '',
            jenis: '',
            kcp: '',
            poin: '0',
            online: '0',
            berat: '0',
            barangSku: [{"barcode": "", "qty": "", "konversi": "", "satuan_jual": "1"}],
            barangHargaEdit: [[
                {
                    "nama_toko":"","lokasi":"",
                    "isCheckedPCS":false,
                    "hrgBeliPCS": 0,
                    "margin1PCS":"0","margin2PCS":"0","margin3PCS":"0","margin4PCS":"0",
                    "hrgJual1PCS":"0","hrgJual2PCS":"0","hrgJual3PCS":"0","hrgJual4PCS":"0",
                    "ppnPCS": 0,
                    "servicePCS":0
                },
                {
                    "nama_toko":"","lokasi":"",
                    "isCheckedPACK":false,
                    "hrgBeliPACK":0,
                    "margin1PACK":"0","margin2PACK":"0","margin3PACK":"0","margin4PACK":"0",
                    "hrgJual1PACK":"0","hrgJual2PACK":"","hrgJual3PACK":"0","hrgJual4PACK":"0",
                    "ppnPACK": 0,
                    "servicePACK":0
                },
                {
                    "nama_toko":"","lokasi":"",
                    "isCheckedKARTON":false,
                    "hrgBeliKARTON":0,
                    "margin1KARTON":"0","margin2KARTON":"0","margin3KARTON":"0","margin4KARTON":"0",
                    "hrgJual1KARTON":"0","hrgJual2KARTON":"0","hrgJual3KARTON":"0","hrgJual4KARTON":"0",
                    "ppnKARTON":0,
                    "serviceKARTON":0
                }
            ]],
            barangHarga: [[
                {
                    "nama_toko":"","lokasi":"",
                    "isCheckedPCS":false,
                    "hrgBeliPCS": 0,
                    "margin1PCS":"0","margin2PCS":"0","margin3PCS":"0","margin4PCS":"0",
                    "hrgJual1PCS":"0","hrgJual2PCS":"0","hrgJual3PCS":"0","hrgJual4PCS":"0",
                    "ppnPCS": 0,
                    "servicePCS":0
                },
                {
                    "nama_toko":"","lokasi":"",
                    "isCheckedPACK":false,
                    "hrgBeliPACK":0,
                    "margin1PACK":"0","margin2PACK":"0","margin3PACK":"0","margin4PACK":"0",
                    "hrgJual1PACK":"0","hrgJual2PACK":"0","hrgJual3PACK":"0","hrgJual4PACK":"0",
                    "ppnPACK": 0,
                    "servicePACK":0
                },
                {
                    "nama_toko":"","lokasi":"",
                    "isCheckedKARTON":false,
                    "hrgBeliKARTON":0,
                    "margin1KARTON":"0","margin2KARTON":"0","margin3KARTON":"0","margin4KARTON":"0",
                    "hrgJual1KARTON":"0","hrgJual2KARTON":"0","hrgJual3KARTON":"0","hrgJual4KARTON":"0",
                    "ppnKARTON":0,
                    "serviceKARTON":0
                }
            ]],
            barcode: [],
            qty: [],
            konversi: [],
            satuan_jual: [],
            isChecked: false,
            PACK: false,
            KARTON: false,
            check: [],
            hrg_beli: '0', hrg_beli_pack: '0', hrg_beli_karton: '0',
            margin1: '0', margin2: '0', margin3: '0', margin4: '0',
            margin1_pack: '0', margin2_pack: '0', margin3_pack: '0', margin4_pack: '0',
            margin1_karton: '0', margin2_karton: '0', margin3_karton: '0', margin4_karton: '0',
            hrgjual1:'0', hrgjual2: '0', hrgjual3: '0', hrgjual4: '0',
            hrgjual1_pack: '0', hrgjual2_pack: '0', hrgjual3_pack: '0', hrgjual4_pack: '0',
            hrgjual1_karton: '0', hrgjual2_karton: '0', hrgjual3_karton: '0', hrgjual4_karton: '0',
            service: '0', service_pack: '0', service_karton: '0',
            ppn: '0', ppn_pack: '0', ppn_karton: '0',

            hrgBeliPACK: 0,
            margin1PACK: '0', margin2PACK: '0', margin3PACK: '0', margin4PACK: '0',
            hrgJual1PACK: '0', hrgJual2PACK: '0', hrgJual3PACK: '0', hrgJual4PACK: '0',
            servicePACK: 0, ppnPACK: 0,

            hrgBeliKARTON: 0,
            margin1KARTON: '0', margin2KARTON: '0', margin3KARTON: '0', margin4KARTON: '0',
            hrgJual1KARTON: '0', hrgJual2KARTON: '0', hrgJual3KARTON: '0', hrgJual4KARTON: '0',
            serviceKARTON: 0, ppnKARTON: 0,
            purchasePrice: {},
            generateCode:false,
            codeServer:0,
        })
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(setProductEdit([]));
        localStorage.removeItem("isReadonly");
        localStorage.removeItem("samarata");
        localStorage.removeItem("isReadonlySamaPack");
        localStorage.removeItem("isReadonlyPack");
        localStorage.removeItem("samarata_pack");
        localStorage.removeItem("isReadonlySamaKarton");
        localStorage.removeItem("isReadonlyKarton");
        localStorage.removeItem("samarata_karton");
    }

    generateCode(e){
        this.setState({generateCode: e.target.checked,});
        if(e.target.checked === true){
            let err = this.state.error;
            err = Object.assign({}, err, {kd_brg:""});

            this.setState({
                kd_brg:`${moment(new Date()).format("YYMMDD")}${Math.floor(Math.random() * (10000 - 0 + 1)) + 0}`,
                error: err
            });
            this.props.dispatch(FetchCheck({
                table: 'barang',
                kolom: 'kd_brg',
                value: this.state.kd_brg
            }));

        }else{
            this.state.kd_brg = "";
        }
    }
    toggle = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        this.clearState()
    };
    getProps(param){
        console.log("get props",param.dataSupplier);
        this.setState({
            nm_harga1:param.auth.user.harga1,
            nm_harga2:param.auth.user.harga2,
            nm_harga3:param.auth.user.harga3,
            nm_harga4:param.auth.user.harga4,
            set_harga:param.auth.user.set_harga,
        });
        this.state.codeServer = param.productCode;
        if(param.dataEdit !== undefined && param.dataEdit !== []){
            console.log("JENIS DIPILIH",param.dataEdit.kategori)
            let barang_sku = typeof param.dataEdit.barang_sku === 'object' ? param.dataEdit.barang_sku : this.state.barangSku;
            let barang_hrg = typeof param.dataEdit.barang_hrg === 'object' ? param.dataEdit.barang_hrg : this.state.barangHarga;
            let barangSku=[];let barangHrg=[];let konversi=[];
            for(let i=0;i<barang_sku.length;i++){
                barangSku.push({
                    "barcode":barang_sku[i].barcode,
                    "qty":barang_sku[i].satuan,
                    "konversi":barang_sku[i].qty_konversi,
                    "satuan_jual":barang_sku[i].satuan_jual
                });
                konversi.push(barang_sku[i].konversi);
            }
            for(let x=0; x<barang_hrg.length;x++){
                if(barang_sku.length === 3){
                    barangHrg.push(
                        [
                            {
                                "nama_toko":barang_hrg[x][0].nama_toko,"lokasi":barang_hrg[x][0].lokasi,
                                "isCheckedPCS":true,
                                "hrgBeliPCS": barang_hrg[x][0].harga_beli,
                                "margin1PCS":param.dataEdit.kategori==='4'?'0':((parseInt(barang_hrg[x][0].harga)-parseInt(barang_hrg[x][0].harga_beli))/parseInt(barang_hrg[x][0].harga_beli))*100,
                                "margin2PCS":param.dataEdit.kategori==='4'?'0':((parseInt(barang_hrg[x][0].harga2)-parseInt(barang_hrg[x][0].harga_beli))/parseInt(barang_hrg[x][0].harga_beli))*100,
                                "margin3PCS":param.dataEdit.kategori==='4'?'0':((parseInt(barang_hrg[x][0].harga3)-parseInt(barang_hrg[x][0].harga_beli))/parseInt(barang_hrg[x][0].harga_beli))*100,
                                "margin4PCS":param.dataEdit.kategori==='4'?'0':((parseInt(barang_hrg[x][0].harga4)-parseInt(barang_hrg[x][0].harga_beli))/parseInt(barang_hrg[x][0].harga_beli))*100,
                                "hrgJual1PCS":barang_hrg[x][0].harga,"hrgJual2PCS":barang_hrg[x][0].harga2,"hrgJual3PCS":barang_hrg[x][0].harga3,"hrgJual4PCS":barang_hrg[x][0].harga4,
                                "ppnPCS": barang_hrg[x][0].ppn,
                                "servicePCS": barang_hrg[x][0].service
                            },
                            {
                                "nama_toko":barang_hrg[x][1].nama_toko,"lokasi":barang_hrg[x][1].lokasi,
                                "isCheckedPACK":false,
                                "hrgBeliPACK": barang_hrg[x][1].harga_beli,
                                "margin1PACK":((parseInt(barang_hrg[x][1].harga)-parseInt(barang_hrg[x][1].harga_beli))/parseInt(barang_hrg[x][1].harga_beli))*100,
                                "margin2PACK":((parseInt(barang_hrg[x][1].harga2)-parseInt(barang_hrg[x][1].harga_beli))/parseInt(barang_hrg[x][1].harga_beli))*100,
                                "margin3PACK":((parseInt(barang_hrg[x][1].harga3)-parseInt(barang_hrg[x][1].harga_beli))/parseInt(barang_hrg[x][1].harga_beli))*100,
                                "margin4PACK":((parseInt(barang_hrg[x][1].harga4)-parseInt(barang_hrg[x][1].harga_beli))/parseInt(barang_hrg[x][1].harga_beli))*100,
                                "hrgJual1PACK":barang_hrg[x][1].harga,"hrgJual2PACK":barang_hrg[x][1].harga2,"hrgJual3PACK":barang_hrg[x][1].harga3,"hrgJual4PACK":barang_hrg[x][1].harga4,
                                "ppnPACK":barang_hrg[x][1].ppn,
                                "servicePACK":barang_hrg[x][1].service
                            },
                            {
                                "nama_toko":barang_hrg[x][2].nama_toko,"lokasi":barang_hrg[x][2].lokasi,
                                "isCheckedKARTON":false,
                                "hrgBeliKARTON": barang_hrg[x][2].harga_beli,
                                "margin1KARTON":((parseInt(barang_hrg[x][2].harga)-parseInt(barang_hrg[x][2].harga_beli))/parseInt(barang_hrg[x][2].harga_beli))*100,
                                "margin2KARTON":((parseInt(barang_hrg[x][2].harga2)-parseInt(barang_hrg[x][2].harga_beli))/parseInt(barang_hrg[x][2].harga_beli))*100,
                                "margin3KARTON":((parseInt(barang_hrg[x][2].harga3)-parseInt(barang_hrg[x][2].harga_beli))/parseInt(barang_hrg[x][2].harga_beli))*100,
                                "margin4KARTON":((parseInt(barang_hrg[x][2].harga4)-parseInt(barang_hrg[x][2].harga_beli))/parseInt(barang_hrg[x][2].harga_beli))*100,
                                "hrgJual1KARTON": barang_hrg[x][2].harga,"hrgJual2KARTON": barang_hrg[x][2].harga2,"hrgJual3KARTON": barang_hrg[x][2].harga3,"hrgJual4KARTON": barang_hrg[x][2].harga4,
                                "ppnKARTON": barang_hrg[x][2].ppn,
                                "serviceKARTON": barang_hrg[x][2].service
                            }
                        ]
                    )
                }
                else if(barang_sku.length === 2){
                    barangHrg.push(
                        [
                            {
                                "nama_toko":barang_hrg[x][0].nama_toko,"lokasi":barang_hrg[x][0].lokasi,
                                "isCheckedPCS":true,
                                "hrgBeliPCS": barang_hrg[x][0].harga_beli,
                                "margin1PCS":param.dataEdit.kategori==='4'?'0':((parseInt(barang_hrg[x][0].harga)-parseInt(barang_hrg[x][0].harga_beli))/parseInt(barang_hrg[x][0].harga_beli))*100,
                                "margin2PCS":param.dataEdit.kategori==='4'?'0':((parseInt(barang_hrg[x][0].harga2)-parseInt(barang_hrg[x][0].harga_beli))/parseInt(barang_hrg[x][0].harga_beli))*100,
                                "margin3PCS":param.dataEdit.kategori==='4'?'0':((parseInt(barang_hrg[x][0].harga3)-parseInt(barang_hrg[x][0].harga_beli))/parseInt(barang_hrg[x][0].harga_beli))*100,
                                "margin4PCS":param.dataEdit.kategori==='4'?'0':((parseInt(barang_hrg[x][0].harga4)-parseInt(barang_hrg[x][0].harga_beli))/parseInt(barang_hrg[x][0].harga_beli))*100,
                                "hrgJual1PCS":barang_hrg[x][0].harga,"hrgJual2PCS":barang_hrg[x][0].harga2,"hrgJual3PCS":barang_hrg[x][0].harga3,"hrgJual4PCS":barang_hrg[x][0].harga4,
                                "ppnPCS": barang_hrg[x][0].ppn,
                                "servicePCS": barang_hrg[x][0].service
                            },
                            {
                                "nama_toko":barang_hrg[x][1].nama_toko,"lokasi":barang_hrg[x][1].lokasi,
                                "isCheckedPACK":true,
                                "hrgBeliPACK": barang_hrg[x][1].harga_beli,
                                "margin1PACK":((parseInt(barang_hrg[x][1].harga)-parseInt(barang_hrg[x][1].harga_beli))/parseInt(barang_hrg[x][1].harga_beli))*100,
                                "margin2PACK":((parseInt(barang_hrg[x][1].harga2)-parseInt(barang_hrg[x][1].harga_beli))/parseInt(barang_hrg[x][1].harga_beli))*100,
                                "margin3PACK":((parseInt(barang_hrg[x][1].harga3)-parseInt(barang_hrg[x][1].harga_beli))/parseInt(barang_hrg[x][1].harga_beli))*100,
                                "margin4PACK":((parseInt(barang_hrg[x][1].harga4)-parseInt(barang_hrg[x][1].harga_beli))/parseInt(barang_hrg[x][1].harga_beli))*100,
                                "hrgJual1PACK":barang_hrg[x][1].harga,"hrgJual2PACK":barang_hrg[x][1].harga2,"hrgJual3PACK":barang_hrg[x][1].harga3,"hrgJual4PACK":barang_hrg[x][1].harga4,
                                "ppnPACK":barang_hrg[x][1].ppn,
                                "servicePACK":barang_hrg[x][1].service
                            },
                        ]
                    )
                }
                else{
                    barangHrg.push(
                        [
                            {
                                "nama_toko":barang_hrg[x][0].nama_toko,"lokasi":barang_hrg[x][0].lokasi,
                                "isCheckedPCS":true,
                                "hrgBeliPCS": barang_hrg[x][0].harga_beli,
                                "margin1PCS":param.dataEdit.kategori==='4'?'0':((parseInt(barang_hrg[x][0].harga)-parseInt(barang_hrg[x][0].harga_beli))/parseInt(barang_hrg[x][0].harga_beli))*100,
                                "margin2PCS":param.dataEdit.kategori==='4'?'0':((parseInt(barang_hrg[x][0].harga2)-parseInt(barang_hrg[x][0].harga_beli))/parseInt(barang_hrg[x][0].harga_beli))*100,
                                "margin3PCS":param.dataEdit.kategori==='4'?'0':((parseInt(barang_hrg[x][0].harga3)-parseInt(barang_hrg[x][0].harga_beli))/parseInt(barang_hrg[x][0].harga_beli))*100,
                                "margin4PCS":param.dataEdit.kategori==='4'?'0':((parseInt(barang_hrg[x][0].harga4)-parseInt(barang_hrg[x][0].harga_beli))/parseInt(barang_hrg[x][0].harga_beli))*100,
                                "hrgJual1PCS":barang_hrg[x][0].harga,"hrgJual2PCS":barang_hrg[x][0].harga2,"hrgJual3PCS":barang_hrg[x][0].harga3,"hrgJual4PCS":barang_hrg[x][0].harga4,
                                "ppnPCS": barang_hrg[x][0].ppn,
                                "servicePCS": barang_hrg[x][0].service
                            }
                        ]
                    )
                }

            }
            this.setState({
                kd_brg: param.dataEdit.kd_brg,
                nm_brg: param.dataEdit.nm_brg,
                kel_brg: param.dataEdit.kel_brg,
                jenis:param.dataEdit.kategori,
                stock_min:param.dataEdit.stock_min,
                group1:param.dataEdit.group1,
                group2:param.dataEdit.group2,
                deskripsi:param.dataEdit.deskripsi,
                gambar:"",
                kategori:param.dataEdit.jenis,
                kcp:param.dataEdit.kcp,
                poin:param.dataEdit.poin,
                online:param.dataEdit.online,
                berat:param.dataEdit.berat,
                barangSku:barangSku,
                barangHarga:barangHrg
            })
        }
        else{
            const {data} = param.dataLocation;
            this.state.check = param.dataLocation;
            let brgHrg=[];
            if(typeof data === 'object'){
                data.map((v,i)=>{
                    Object.assign(v,{
                        isChecked:false,
                        PACK:false,
                        KARTON:false,
                        hrg_beli:'0',
                    });
                    brgHrg.push(
                        [
                            {
                                "nama_toko":v.nama_toko,"lokasi": v.kode,
                                "isCheckedPCS":false,
                                "hrgBeliPCS": 0,
                                "margin1PCS":"0","margin2PCS":"0","margin3PCS":"0","margin4PCS":"0",
                                "hrgJual1PCS":"0","hrgJual2PCS":"0","hrgJual3PCS":"0","hrgJual4PCS":"0",
                                "ppnPCS": "0",
                                "servicePCS": "0"
                            },
                            {
                                "nama_toko":v.nama_toko,"lokasi": v.kode,
                                "isCheckedPACK":false,
                                "hrgBeliPACK": 0,
                                "margin1PACK":"0","margin2PACK":"0","margin3PACK":"0","margin4PACK":"0",
                                "hrgJual1PACK":"0","hrgJual2PACK":"0","hrgJual3PACK":"0","hrgJual4PACK":"0",
                                "ppnPACK": "0",
                                "servicePACK": "0"
                            },
                            {
                                "nama_toko":v.nama_toko,"lokasi": v.kode,
                                "isCheckedKARTON":false,
                                "hrgBeliKARTON": 0,
                                "margin1KARTON":"0","margin2KARTON":"0","margin3KARTON":"0","margin4KARTON":"0",
                                "hrgJual1KARTON":"0","hrgJual2KARTON":"0","hrgJual3KARTON":"0","hrgJual4KARTON":"0",
                                "ppnKARTON": "0",
                                "serviceKARTON": "0"
                            }
                        ]
                    )
                });
                this.setState({
                    barangHarga:brgHrg
                });
            }
        }
        let kel_brg=[];
        let group1=[];
        let group2=[];
        if(param.data.data!==undefined){
            typeof param.data.data === 'object' ? param.data.data.map((v,i)=>{
                kel_brg.push({
                    value:v.kel_brg,
                    label:v.nm_kel_brg,
                })
            }): "no data"
            this.setState({
                kel_brg_data:kel_brg
            })
        }
        if(param.dataSupplier!==undefined){
            param.dataSupplier.map((v,i)=>{
                group1.push({
                    value:v.kode,
                    label:v.nama,
                })
            })
            this.setState({
                group1_data:group1
            })
        }

        if(param.dataSubDept.data!==undefined){
            typeof param.dataSubDept.data === 'object' ? param.dataSubDept.data.map((v,i)=>{
                group2.push({
                    value:v.kode,
                    label:v.nama,
                })
            }): "no data"
            this.setState({
                group2_data:group2
            })
        }


    }
    componentWillReceiveProps(nextProps){
        this.getProps(nextProps);
    }
    componentWillMount(){
        this.getProps(this.props);
    }
    async fetchData(data){
        const url = HEADERS.URL + `site/cekdata`;
        return await axios.post(url, data)
            .then(function (response) {
                const data = response.data;
                return data;
            })
            .catch(function (error) {
                if (error.response) {
                    console.log("error")
                }
            })
    }
    checkData(event,i){
        event.preventDefault();
        let name = event.target.name;
        let val = event.target.value;
        let barangSku = [...this.state.barangSku];
        barangSku[i] = {...barangSku[i], [event.target.name]: event.target.value};
        this.setState({ barangSku });
        if(barangSku.length===3||barangSku.length===2){
            if(barangSku[0].barcode!=='0'){
                if(barangSku.length===3) {
                    if (barangSku[0].barcode === barangSku[2].barcode) {
                        alert('barcode 1 tidak boleh sama dengan barcode 3');
                        barangSku[0].barcode = '0';
                    }
                }
            }
            if(barangSku[1].barcode!=='0'){
                if(barangSku[1].barcode===barangSku[0].barcode){
                    alert('barcode 2 tidak boleh sama dengan barcode 1');
                    barangSku[1].barcode='0';
                }
            }
            if(barangSku.length===3){
                if(barangSku[2].barcode!=='0'){
                    if(barangSku[2].barcode===barangSku[1].barcode){
                        alert('barcode 3 tidak boleh sama dengan barcode 2');
                        barangSku[2].barcode='0';
                    }
                }
            }



        }

        if(event.target.id==='barcode1'){
            if(val===this.state.kd_brg){
                alert('barcode 1 tidak boleh sama dengan kode barang');
                barangSku[0].barcode='0';
            }

            const data = this.fetchData({
                table: 'barang_sku',
                kolom: 'barcode',
                value: val
            });
            data.then(res=>{
                if(res.result===1){
                    this.setState({
                        error_barcode1:true,
                        pesan_barcode1:"barcode sudah digunakan"
                    })
                }else{
                    this.setState({
                        error_barcode1:false,
                        pesan_barcode1:""
                    })
                }
            });
        }
        if(event.target.id==='barcode2'){
            if(val===this.state.kd_brg){
                alert('barcode 2 tidak boleh sama dengan kode barang');
                barangSku[1].barcode='0';
            }
            const data = this.fetchData({
                table: 'barang_sku',
                kolom: 'barcode',
                value: val
            });
            data.then(res=>{
                if(res.result===1){
                    this.setState({
                        error_barcode2:true,
                        pesan_barcode2:"barcode sudah digunakan"
                    })
                }else{
                    this.setState({
                        error_barcode2:false,
                        pesan_barcode2:""
                    })
                }
            });
        }
        if(event.target.id==='barcode3'){
            if(val===this.state.kd_brg){
                alert('barcode 3 tidak boleh sama dengan kode barang');
                barangSku[2].barcode='0';
            }
            const data = this.fetchData({
                table: 'barang_sku',
                kolom: 'barcode',
                value: val
            });
            data.then(res=>{
                if(res.result===1){
                    this.setState({
                        error_barcode3:true,
                        pesan_barcode3:"barcode sudah digunakan"
                    })
                }else{
                    this.setState({error_barcode3:false,pesan_barcode3:""})
                }
            });
        }
    }
    handleKelompokBarang(val) {
        let err = Object.assign({}, this.state.error, {kel_brg: ""});
        this.setState({
            kel_brg: val.value,
            error: err
        });
    }
    handleGroup1(val) {
        let err = Object.assign({}, this.state.error, {group1: ""});
        this.setState({
            group1: val.value,
            error: err
        });
    }
    handleGroup2(val) {
        let err = Object.assign({}, this.state.error, {group2: ""});
        this.setState({
            group2: val.value,
            error: err
        });
    }
    handleSelect = (index) => {
        let err = this.state.error;
        if(this.props.checkKodeBarang!==false){
            this.setState({
                kd_brg:"0"
            });
            return;
        }
        if(this.state.kd_brg===''||this.state.kd_brg===undefined){
            err = Object.assign({}, err, {kd_brg:"kode barang tidak boleh kosong"});
            this.setState({error: err});
            console.log(this.props.checkKodeBarang);
            return;
        }
        if(this.state.nm_brg===''||this.state.nm_brg===undefined){
            err = Object.assign({}, err, {nm_brg:"nama barang tidak boleh kosong"});
            this.setState({error: err});
            return;
        }
        if(this.state.kel_brg===''||this.state.kel_brg===undefined){
            err = Object.assign({}, err, {kel_brg:"kelompok barang tidak boleh kosong"});
            this.setState({error: err});
            return;
        }
        if(this.state.kategori===''||this.state.kategori===undefined){
            err = Object.assign({}, err, {kategori:"kategori barang tidak boleh kosong"});
            this.setState({error: err});
            return;
        }
        if(this.state.stock_min===''||this.state.stock_min===undefined){
            err = Object.assign({}, err, {stock_min:"Stock tidak boleh kosong"});
            this.setState({error: err});
            return;
        }
        if(this.state.group1===''||this.state.group1===undefined){
            err = Object.assign({}, err, {group1:"supplier tidak boleh kosong"});
            this.setState({error: err});
            return;
        }
        if(this.state.group2===''||this.state.group2===undefined){
            err = Object.assign({}, err, {group2:"sub dept tidak boleh kosong"});
            this.setState({error: err});
            return;
        }
        if(this.state.deskripsi===''||this.state.deskripsi===undefined){
            err = Object.assign({}, err, {deskripsi:"deskripsi tidak boleh kosong"});
            this.setState({error: err});
            return;
        }
        if(this.state.jenis===''||this.state.jenis===undefined){
            err = Object.assign({}, err, {jenis:"jenis tidak boleh kosong"});
            this.setState({error: err});
            return;
        }
        if(this.state.kcp===''||this.state.kcp===undefined){
            err = Object.assign({}, err, {kcp:"kcp tidak boleh kosong"});
            this.setState({error: err});
            return;
        }
        if(this.state.poin===''||this.state.poin===undefined){
            err = Object.assign({}, err, {poin:"poin tidak boleh kosong"});
            this.setState({error: err});
            return;
        }
        if(this.state.online===''||this.state.online===undefined){
            err = Object.assign({}, err, {online:"online tidak boleh kosong"});
            this.setState({error: err});
            return;
        }
        if(this.state.berat===''||this.state.berat===undefined){
            err = Object.assign({}, err, {berat:"berat tidak boleh kosong"});
            this.setState({error: err});
            return;
        }
        if(index===2){
            for(let i=0;i<this.state.barangSku.length;i++){
                if(this.state.barangSku[i].barcode==="0"||this.state.barangSku[i].barcode===""||this.state.barangSku[i].barcode===undefined){
                    alert(`barcode ${i+1} tidak boleh kosong atau tidak boleh 0`);
                    return;
                }
                if(this.state.barangSku[i].satuan_jual===""||this.state.barangSku[i].satuan_jual===undefined){
                    alert(`form tampilkan di pos index ke ${i+1} tidak boleh kosong`);
                    return;
                }
                if(this.state.barangSku[i].qty===""){
                    alert(`Satuan tidak boleh kosong`);
                    return;
                }

            }

        }
        //
        if(this.state.error_barcode1===true||this.state.error_barcode2===true||this.state.error_barcode3===true){
            return;
        }

        this.setState({selectedIndex: index}, () => {});

    };
    onHandleChangeChild(event,i) {
        event.preventDefault();

        this.setState({ [event.target.name]: event.target.value });
        let qty_konversi=[];
        for(let i=0;i<this.state.barangSku.length;i++){
            qty_konversi.push(this.state.barangSku[i].konversi);
        }
        let barangHarga = [...this.state.barangHarga];
        if(event.target.name==="hrgBeliPCS"){
            barangHarga[i][0] = {...barangHarga[i][0], [event.target.name]: event.target.value};
            if(this.state.barangSku.length > 1){
                barangHarga[i][1].hrgBeliPACK = parseInt(event.target.value*qty_konversi[1]);
                barangHarga[i][2].hrgBeliKARTON = parseInt(event.target.value*qty_konversi[2]);
            }
            this.state.hrgBeliPACK =  parseInt(event.target.value*qty_konversi[1]);
            this.state.hrgBeliKARTON =  parseInt(event.target.value*qty_konversi[2]);
        }
        if(event.target.name==="margin1PCS"){
            barangHarga[i] = {...barangHarga[i], [event.target.name]: event.target.value};
            barangHarga[i].hrgJual1PCS = parseInt(barangHarga[i].hrgBeliPCS) * (parseInt(event.target.value)/100) + parseInt(barangHarga[i].hrgBeliPCS);

        }
        if(event.target.name==="margin1PCS"){
            barangHarga[i][0] = {...barangHarga[i][0], [event.target.name]: event.target.value};
            barangHarga[i][0].hrgJual1PCS = parseInt(barangHarga[i][0].hrgBeliPCS) * (parseInt(event.target.value)/100) + parseInt(barangHarga[i][0].hrgBeliPCS);
        }
        if(event.target.name==="margin2PCS"){
            barangHarga[i][0] = {...barangHarga[i][0], [event.target.name]: event.target.value};
            barangHarga[i][0].hrgJual2PCS = parseInt(barangHarga[i][0].hrgBeliPCS) * (parseInt(event.target.value)/100) + parseInt(barangHarga[i][0].hrgBeliPCS);
        }
        if(event.target.name==="margin3PCS"){
            barangHarga[i][0] = {...barangHarga[i][0], [event.target.name]: event.target.value};
            barangHarga[i][0].hrgJual3PCS = parseInt(barangHarga[i][0].hrgBeliPCS) * (parseInt(event.target.value)/100) + parseInt(barangHarga[i][0].hrgBeliPCS);
        }
        if(event.target.name==="margin4PCS"){
            barangHarga[i][0] = {...barangHarga[i][0], [event.target.name]: event.target.value};
            barangHarga[i][0].hrgJual4PCS = parseInt(barangHarga[i][0].hrgBeliPCS) * (parseInt(event.target.value)/100) + parseInt(barangHarga[i][0].hrgBeliPCS);
        }
        if(event.target.name==="hrgJual1PCS"){
            barangHarga[i][0] = {...barangHarga[i][0], [event.target.name]: event.target.value};
            barangHarga[i][0].margin1PCS = ((parseInt(event.target.value)-parseInt(barangHarga[i][0].hrgBeliPCS))/parseInt(barangHarga[i][0].hrgBeliPCS))*100;
        }
        if(event.target.name==="hrgJual2PCS"){
            barangHarga[i][0] = {...barangHarga[i][0], [event.target.name]: event.target.value};
            barangHarga[i][0].margin2PCS = ((parseInt(event.target.value)-parseInt(barangHarga[i][0].hrgBeliPCS))/parseInt(barangHarga[i][0].hrgBeliPCS))*100;
        }
        if(event.target.name==="hrgJual3PCS"){
            barangHarga[i][0] = {...barangHarga[i][0], [event.target.name]: event.target.value};
            barangHarga[i][0].margin3PCS = ((parseInt(event.target.value)-parseInt(barangHarga[i][0].hrgBeliPCS))/parseInt(barangHarga[i][0].hrgBeliPCS))*100;
        }
        if(event.target.name==="hrgJual4PCS"){
            barangHarga[i][0] = {...barangHarga[i][0], [event.target.name]: event.target.value};
            barangHarga[i][0].margin4PCS = ((parseInt(event.target.value)-parseInt(barangHarga[i][0].hrgBeliPCS))/parseInt(barangHarga[i][0].hrgBeliPCS))*100;
        }
        if(event.target.name==="servicePCS"){
            barangHarga[i][0] = {...barangHarga[i][0], [event.target.name]: event.target.value};
        }
        if(event.target.name==="ppnPCS"){
            barangHarga[i][0] = {...barangHarga[i][0], [event.target.name]: event.target.value};
        }
        this.setState({ barangHarga });

    };
    onHandleChangeChildSku(event,i,x,lbl){
        let column=event.target.name;
        let value=event.target.value;
        this.setState({ [column]: value });
        let barangHarga = [...this.state.barangHarga];
        if(column==='hrgBeliPCS'||column==='hrgBeliPACK'||column==='hrgBeliKARTON'){
            barangHarga[i][x] = {...barangHarga[i][x], [column]: value};
            console.log(barangHarga[i][x].hrgBeliPACK);
            if(column==='hrgBeliPCS'){
                this.state.hrgBeliPCS = value;
                barangHarga[i][0].hrgBeliPCS = value;
                if(this.state.barangSku.length === 3){
                    let qty_konversi=[];
                    this.state.barangSku[x].konversi!==undefined?qty_konversi.push(this.state.barangSku[x].konversi):0;
                    barangHarga[i][1].hrgBeliPACK = parseInt(value*qty_konversi[1]);
                    barangHarga[i][2].hrgBeliKARTON = parseInt(value*qty_konversi[2]);
                    this.state.hrgBeliPACK =  parseInt(value*qty_konversi[1]);
                    this.state.hrgBeliKARTON =  parseInt(value*qty_konversi[2]);
                }
            }
            if(column==='hrgBeliPACK'){
                this.state.hrgBeliPACK = value;
                barangHarga[i][1].hrgBeliPACK = value;
            }
            if(column==='hrgBeliKARTON'){
                this.state.hrgBeliKARTON = value;
                barangHarga[i][2].hrgBeliKARTON = value;
            }


        }
        if(column==='margin1PCS'||column==='margin2PCS'||column==='margin3PCS'||column==='margin4PCS'|| column==='margin1PACK'||column==='margin2PACK'||column==='margin3PACK'||column==='margin4PACK'|| column==='margin1KARTON'||column==='margin2KARTON'||column==='margin3KARTON'||column==='margin4KARTON'){
            barangHarga[i][x] = {...barangHarga[i][x], [column]: value};
            if(column==='margin1PCS'){
                barangHarga[i][x].hrgJual1PCS = parseInt(barangHarga[i][x].hrgBeliPCS) * (parseInt(value)/100) + parseInt(barangHarga[i][x].hrgBeliPCS);
                this.state.hrgJual1PCS= parseInt(barangHarga[i][x].hrgBeliPCS) * (parseInt(value)/100) + parseInt(barangHarga[x].hrgBeliPCS);
            }
            if(column==='margin2PCS'){
                barangHarga[i][x].hrgJual2PCS = parseInt(barangHarga[i][x].hrgBeliPCS) * (parseInt(value)/100) + parseInt(barangHarga[i][x].hrgBeliPCS);
                this.state.hrgJual2PCS= parseInt(barangHarga[i][x].hrgBeliPCS) * (parseInt(value)/100) + parseInt(barangHarga[x].hrgBeliPCS);
            }
            if(column==='margin3PCS'){
                barangHarga[i][x].hrgJual3PCS = parseInt(barangHarga[i][x].hrgBeliPCS) * (parseInt(value)/100) + parseInt(barangHarga[i][x].hrgBeliPCS);
                this.state.hrgJual3PCS= parseInt(barangHarga[i][x].hrgBeliPCS) * (parseInt(value)/100) + parseInt(barangHarga[x].hrgBeliPCS);
            }
            if(column==='margin4PCS'){
                barangHarga[i][0].hrgJual4PCS = parseInt(barangHarga[i][0].hrgBeliPCS) * (parseInt(value)/100) + parseInt(barangHarga[i][0].hrgBeliPCS);
                this.state.hrgJual4PCS= parseInt(barangHarga[i][0].hrgBeliPCS) * (parseInt(value)/100) + parseInt(barangHarga[0].hrgBeliPCS);
            }
            if(column==='margin1PACK'){
                barangHarga[i][x].hrgJual1PACK = parseInt(barangHarga[i][x].hrgBeliPACK) * (parseInt(value)/100) + parseInt(barangHarga[i][x].hrgBeliPACK);
                this.state.hrgJual1PACK= parseInt(barangHarga[i][x].hrgBeliPACK) * (parseInt(value)/100) + parseInt(barangHarga[x].hrgBeliPACK);
            }
            if(column==='margin2PACK'){
                barangHarga[i][x].hrgJual2PACK = parseInt(barangHarga[i][x].hrgBeliPACK) * (parseInt(value)/100) + parseInt(barangHarga[i][x].hrgBeliPACK);
                this.state.hrgJual2PACK= parseInt(barangHarga[i][x].hrgBeliPACK) * (parseInt(value)/100) + parseInt(barangHarga[x].hrgBeliPACK);
            }
            if(column==='margin3PACK'){
                barangHarga[i][x].hrgJual3PACK = parseInt(barangHarga[i][x].hrgBeliPACK) * (parseInt(value)/100) + parseInt(barangHarga[i][x].hrgBeliPACK);
                this.state.hrgJual4PACK= parseInt(barangHarga[i][x].hrgBeliPACK) * (parseInt(value)/100) + parseInt(barangHarga[x].hrgBeliPACK);
            }
            if(column==='margin4PACK'){
                barangHarga[i][x].hrgJual4PACK = parseInt(barangHarga[i][x].hrgBeliPACK) * (parseInt(value)/100) + parseInt(barangHarga[i][x].hrgBeliPACK);
                this.state.hrgJual4PACK= parseInt(barangHarga[i][x].hrgBeliPACK) * (parseInt(value)/100) + parseInt(barangHarga[x].hrgBeliPACK);
            }
            if(column==='margin1KARTON'){
                barangHarga[i][x].hrgJual1KARTON = parseInt(barangHarga[i][x].hrgBeliKARTON) * (parseInt(value)/100) + parseInt(barangHarga[i][x].hrgBeliKARTON);
                this.state.hrgJual1KARTON= parseInt(barangHarga[i][x].hrgBeliKARTON) * (parseInt(value)/100) + parseInt(barangHarga[x].hrgBeliKARTON);
            }
            if(column==='margin2KARTON'){
                barangHarga[i][x].hrgJual2KARTON = parseInt(barangHarga[i][x].hrgBeliKARTON) * (parseInt(value)/100) + parseInt(barangHarga[i][x].hrgBeliKARTON);
                this.state.hrgJual2KARTON= parseInt(barangHarga[i][x].hrgBeliKARTON) * (parseInt(value)/100) + parseInt(barangHarga[x].hrgBeliKARTON);
            }
            if(column==='margin3KARTON'){
                barangHarga[i][x].hrgJual3KARTON = parseInt(barangHarga[i][x].hrgBeliKARTON) * (parseInt(value)/100) + parseInt(barangHarga[i][x].hrgBeliKARTON);
                this.state.hrgJual3KARTON= parseInt(barangHarga[i][x].hrgBeliKARTON) * (parseInt(value)/100) + parseInt(barangHarga[x].hrgBeliKARTON);
            }
            if(column==='margin4KARTON'){
                barangHarga[i][x].hrgJual4KARTON = parseInt(barangHarga[i][x].hrgBeliKARTON) * (parseInt(value)/100) + parseInt(barangHarga[i][x].hrgBeliKARTON);
                this.state.hrgJual4KARTON= parseInt(barangHarga[i][x].hrgBeliKARTON) * (parseInt(value)/100) + parseInt(barangHarga[x].hrgBeliKARTON);
            }

        }
        if(column==='hrgJual1PCS'||column==='hrgJual2PCS'||column==='hrgJual3PCS'||column==='hrgJual4PCS'||column==='hrgJual1PACK'||column==='hrgJual2PACK'||column==='hrgJual3PACK'||column==='hrgJual4PACK'||column==='hrgJual1KARTON'||column==='hrgJual2KARTON'||column==='hrgJual3KARTON'||column==='hrgJual4KARTON'){
            barangHarga[i][x] = {...barangHarga[i][x], [column]: value};
            if(column==='hrgJual1PCS'){
                barangHarga[i][x].margin1PCS = ((parseInt(value)-parseInt(barangHarga[i][x].hrgBeliPCS))/parseInt(barangHarga[i][x].hrgBeliPCS))*100;
                this.state.margin1PCS = ((parseInt(value)-parseInt(barangHarga[i][x].hrgBeliPCS))/parseInt(barangHarga[i][x].hrgBeliPCS))*100;
            }
            if(column==='hrgJual2PCS'){
                barangHarga[i][x].margin2PCS = ((parseInt(value)-parseInt(barangHarga[i][x].hrgBeliPCS))/parseInt(barangHarga[i][x].hrgBeliPCS))*100;
                this.state.margin2PCS = ((parseInt(value)-parseInt(barangHarga[i][x].hrgBeliPCS))/parseInt(barangHarga[i][x].hrgBeliPCS))*100;
            }
            if(column==='hrgJual3PCS'){
                barangHarga[i][x].margin3PCS = ((parseInt(value)-parseInt(barangHarga[i][x].hrgBeliPCS))/parseInt(barangHarga[i][x].hrgBeliPCS))*100;
                this.state.margin3PCS = ((parseInt(value)-parseInt(barangHarga[i][x].hrgBeliPCS))/parseInt(barangHarga[i][x].hrgBeliPCS))*100;
            }
            if(column==='hrgJual4PCS'){
                barangHarga[i][x].margin4PCS = ((parseInt(value)-parseInt(barangHarga[i][x].hrgBeliPCS))/parseInt(barangHarga[i][x].hrgBeliPCS))*100;
                this.state.margin4PCS = ((parseInt(value)-parseInt(barangHarga[i][x].hrgBeliPCS))/parseInt(barangHarga[i][x].hrgBeliPCS))*100;
            }
            if(column==='hrgJual1PACK'){
                barangHarga[i][x].margin1PACK = ((parseInt(value)-parseInt(barangHarga[i][x].hrgBeliPACK))/parseInt(barangHarga[i][x].hrgBeliPACK))*100;
                this.state.margin1PACK = ((parseInt(value)-parseInt(barangHarga[i][x].hrgBeliPACK))/parseInt(barangHarga[i][x].hrgBeliPACK))*100;
            }
            if(column==='hrgJual2PACK'){
                barangHarga[i][x].margin2PACK = ((parseInt(value)-parseInt(barangHarga[i][x].hrgBeliPACK))/parseInt(barangHarga[i][x].hrgBeliPACK))*100;
                this.state.margin2PACK = ((parseInt(value)-parseInt(barangHarga[i][x].hrgBeliPACK))/parseInt(barangHarga[i][x].hrgBeliPACK))*100;
            }
            if(column==='hrgJual3PACK'){
                barangHarga[i][x].margin3PACK = ((parseInt(value)-parseInt(barangHarga[i][x].hrgBeliPACK))/parseInt(barangHarga[i][x].hrgBeliPACK))*100;
                this.state.margin3PACK = ((parseInt(value)-parseInt(barangHarga[i][x].hrgBeliPACK))/parseInt(barangHarga[i][x].hrgBeliPACK))*100;
            }
            if(column==='hrgJual4PACK'){
                barangHarga[i][x].margin4PACK = ((parseInt(value)-parseInt(barangHarga[i][x].hrgBeliPACK))/parseInt(barangHarga[i][x].hrgBeliPACK))*100;
                this.state.margin4PACK = ((parseInt(value)-parseInt(barangHarga[i][x].hrgBeliPACK))/parseInt(barangHarga[i][x].hrgBeliPACK))*100;
            }
            if(column==='hrgJual1KARTON'){
                barangHarga[i][x].margin1KARTON = ((parseInt(value)-parseInt(barangHarga[i][x].hrgBeliKARTON))/parseInt(barangHarga[i][x].hrgBeliKARTON))*100;
                this.state.margin1KARTON = ((parseInt(value)-parseInt(barangHarga[i][x].hrgBeliKARTON))/parseInt(barangHarga[i][x].hrgBeliKARTON))*100;
            }
            if(column==='hrgJual2KARTON'){
                barangHarga[i][x].margin2KARTON = ((parseInt(value)-parseInt(barangHarga[i][x].hrgBeliKARTON))/parseInt(barangHarga[i][x].hrgBeliKARTON))*100;
                this.state.margin2KARTON = ((parseInt(value)-parseInt(barangHarga[i][x].hrgBeliKARTON))/parseInt(barangHarga[i][x].hrgBeliKARTON))*100;
            }
            if(column==='hrgJual3KARTON'){
                barangHarga[i][x].margin3KARTON = ((parseInt(value)-parseInt(barangHarga[i][x].hrgBeliKARTON))/parseInt(barangHarga[i][x].hrgBeliKARTON))*100;
                this.state.margin3KARTON = ((parseInt(value)-parseInt(barangHarga[i][x].hrgBeliKARTON))/parseInt(barangHarga[i][x].hrgBeliKARTON))*100;
            }
            if(column==='hrgJual4KARTON'){
                barangHarga[i][x].margin4KARTON = ((parseInt(value)-parseInt(barangHarga[i][x].hrgBeliKARTON))/parseInt(barangHarga[i][x].hrgBeliKARTON))*100;
                this.state.margin4KARTON = ((parseInt(value)-parseInt(barangHarga[i][x].hrgBeliKARTON))/parseInt(barangHarga[i][x].hrgBeliKARTON))*100;
            }
        }

        if(column==='servicePCS'||column==='servicePACK'||column==='serviceKARTON'){
            barangHarga[i][x] = {...barangHarga[i][x], [column]: value};
            if(column==='servicePCS'){
                this.state.servicePCS = value;
            }
            if(column==='servicePACK'){
                this.state.servicePACK = value;
            }
            if(column==='serviceKARTON'){
                this.state.serviceKARTON = value;
            }
        }
        if(column==='ppnPCS'||column==='ppnPACK'||column==='ppnKARTON'){
            barangHarga[i][x] = {...barangHarga[i][x], [column]: value};
            if(column==='ppnPCS'){
                this.state.ppnPCS = value;
            }
            if(column==='ppnPACK'){
                this.state.ppnPACK = value;
            }
            if(column==='ppnKARTON'){
                this.state.ppnKARTON = value;
            }
        }
        this.setState({ barangHarga });
    }
    handleAllCheckedSku(event,i,lbl){
        if(lbl === 'PCS'){
            event.target.checked===true?localStorage.setItem("isReadonly","true"):localStorage.setItem("isReadonly","false");
            event.target.checked===true?localStorage.setItem("samarata","true"):localStorage.setItem("samarata","false");
            let data=this.state.barangHarga;
            data.map((v,i)=>{
                Object.assign(v[0],{"isCheckedPCS":event.target.checked})
            });
            this.setState({barangHarga: data});
        }
        if(lbl === 'PACK'){
            event.target.checked===true?localStorage.setItem("isReadonlySamaPack","true"):localStorage.setItem("isReadonlySamaPack","false");
            event.target.checked===true?localStorage.setItem("isReadonlyPack","true"):localStorage.setItem("isReadonlyPack","false");
            event.target.checked===true?localStorage.setItem("samarata_pack","true"):localStorage.setItem("samarata_pack","false");
            let data=this.state.barangHarga;
            data.map((v,i)=>{
                Object.assign(v[1],{"isCheckedPACK":event.target.checked})
            });
            this.setState({barangHarga: data});
        }
        if(lbl === 'KARTON'){
            event.target.checked===true?localStorage.setItem("isReadonlySamaKarton","true"):localStorage.setItem("isReadonlySamaKarton","false");
            event.target.checked===true?localStorage.setItem("isReadonlyKarton","true"):localStorage.setItem("isReadonlyKarton","false");
            event.target.checked===true?localStorage.setItem("samarata_karton","true"):localStorage.setItem("samarata_karton","false");
            let data=this.state.barangHarga;
            data.map((v,i)=>{
                Object.assign(v[2],{"isCheckedKARTON":event.target.checked})
            });
            this.setState({barangHarga: data});
        }
    }
    handleCheckChieldElementSku(e,i){
        this.setState((state, props) => {
            state.barangHarga[i][1].isCheckedPACK = !state.barangHarga[i][1].isCheckedPACK;
            return {
                barangHarga: state.barangHarga
            }
        });
    }
    handleChange(event,i){
        let name = event.target.name;
        let val = event.target.value;
        let hrg_jual_1_pcs = 0;let margin1_pcs=0;
        let hrg_jual_2_pcs = 0;let margin2_pcs=0;
        let hrg_jual_3_pcs = 0;let margin3_pcs=0;
        let hrg_jual_4_pcs = 0;let margin4_pcs=0;
        this.setState({ [event.target.name]: event.target.value});
        let err = Object.assign({}, this.state.error, {
            [name]: ""
        });
        this.setState({
            error: err
        });
        if(name==='nm_brg'){this.setState({deskripsi:val})}
        if(name==='kd_brg'){
            this.props.dispatch(FetchCheck({
                table: 'barang',
                kolom: 'kd_brg',
                value: val
            }));
        }
        if(i!==null){
            let barangSku = [...this.state.barangSku];
            barangSku[i] = {...barangSku[i], [event.target.name]: event.target.value};
            this.setState({ barangSku });
        }
        if(event.target.name === 'jenis'){
            if(event.target.value === '0'){
                let brgSku = [];
                for(let i=0;i<3;i++){
                    let brcd=i===0?`${this.state.kd_brg}01`:(i===1?`${this.state.kd_brg}02`:`${this.state.kd_brg}03`);
                    let satuan=(i===0)?"Pcs":(i===1?"Pack":"Karton");
                    brgSku.push({"barcode":brcd,"qty":satuan,"konversi":"0","satuan_jual":"1"})
                }
                this.setState({barangSku: brgSku});
            }
            else if(event.target.value === '2'){
                let brgSku = [];
                for(let i=0;i<2;i++){
                    let brcd=i===0?`${this.state.kd_brg}01`:(i===1?`${this.state.kd_brg}02`:'');
                    brgSku.push({"barcode":brcd,"qty":"","konversi":"0","satuan_jual":"1"})
                }
                this.setState({barangSku: brgSku});
            }
            else{
                let brgSku = [];
                for(let i=0;i<1;i++){
                    let satuan='';
                    if(event.target.value==='2'){
                        satuan='';
                    }
                    else if(event.target.value==='1'){
                        satuan='Pcs';
                    }
                    else if(event.target.value==='3'){
                        satuan='Pack';
                    }
                    brgSku.push({"barcode":`${this.state.kd_brg}01`,"qty":satuan,"konversi":"0","satuan_jual":"1"})
                }
                this.setState({barangSku: brgSku});
            }
        }
        let qty_konversi=[];
        for(let i=0;i<this.state.barangSku.length;i++){
            qty_konversi.push(this.state.barangSku[i].konversi);
        }
        if(name === 'hrg_beli'){
            this.setState({
                hrg_beli_pack : parseInt(val*qty_konversi[1]),
                hrg_beli_karton : parseInt(val*qty_konversi[2]),
            });
        }
        if(name === "hrgjual1"){
            this.setState({
                margin1:((parseInt(val)-parseInt(this.state.hrg_beli))/parseInt(this.state.hrg_beli))*100,
            });
            margin1_pcs = ((parseInt(val)-parseInt(this.state.hrg_beli))/parseInt(this.state.hrg_beli))*100;

        }
        if(name === "hrgjual2"){
            this.setState({
                margin2:((parseInt(val)-parseInt(this.state.hrg_beli))/parseInt(this.state.hrg_beli))*100,

            });
            margin2_pcs = ((parseInt(val)-parseInt(this.state.hrg_beli))/parseInt(this.state.hrg_beli))*100;
        }
        if(name === "hrgjual3"){
            this.setState({
                margin3:((parseInt(val)-parseInt(this.state.hrg_beli))/parseInt(this.state.hrg_beli))*100,

            });
            margin3_pcs = ((parseInt(val)-parseInt(this.state.hrg_beli))/parseInt(this.state.hrg_beli))*100;
        }
        if(name === "hrgjual4"){
            this.setState({
                margin4:((parseInt(val)-parseInt(this.state.hrg_beli))/parseInt(this.state.hrg_beli))*100,
            });
            margin4_pcs = ((parseInt(val)-parseInt(this.state.hrg_beli))/parseInt(this.state.hrg_beli))*100;
        }
        if(name === "margin1"){
            this.setState({
                hrgjual1:parseInt(this.state.hrg_beli) * (parseInt(val)/100) + parseInt(this.state.hrg_beli),
            });
            hrg_jual_1_pcs = parseInt(this.state.hrg_beli) * (parseInt(val)/100) + parseInt(this.state.hrg_beli);
        }
        if(name === "margin2"){
            this.setState({
                hrgjual2:(parseInt(this.state.hrg_beli) * (parseInt(val)/100)) + parseInt(this.state.hrg_beli)
            });
            hrg_jual_2_pcs = (parseInt(this.state.hrg_beli)*(parseInt(val)/100))+parseInt(this.state.hrg_beli);
        }
        if(name === "margin3"){
            this.setState({hrgjual3:(parseInt(this.state.hrg_beli)*(parseInt(val)/100))+parseInt(this.state.hrg_beli)});
            hrg_jual_3_pcs = (parseInt(this.state.hrg_beli)*(parseInt(val)/100))+parseInt(this.state.hrg_beli);
        }
        if(name === "margin4"){
            this.setState({hrgjual4:(parseInt(this.state.hrg_beli)*(parseInt(val)/100))+parseInt(this.state.hrg_beli)});
            hrg_jual_4_pcs = (parseInt(this.state.hrg_beli)*(parseInt(val)/100))+parseInt(this.state.hrg_beli);
        }
        if(localStorage.getItem("samarata") === "true"){
            for(let i=0;i<this.state.barangHarga.length;i++){
                if(name === 'hrg_beli'){
                    this.state.barangHarga[i][0].hrgBeliPCS = val;
                    if(this.state.barangSku.length === 3){
                        this.state.barangHarga[i][1].hrgBeliPACK = parseInt(val*qty_konversi[1]);
                        this.state.barangHarga[i][2].hrgBeliKARTON = parseInt(val*qty_konversi[2]);
                    }

                }
                if(name === 'margin1'){
                    this.state.barangHarga[i][0].margin1PCS = val;
                    this.state.barangHarga[i][0].hrgJual1PCS = hrg_jual_1_pcs;
                }
                if(name === 'margin2'){
                    this.state.barangHarga[i][0].margin2PCS = val;
                    this.state.barangHarga[i][0].hrgJual2PCS = hrg_jual_2_pcs;

                }
                if(name === 'margin3'){
                    this.state.barangHarga[i][0].margin3PCS = val;
                    this.state.barangHarga[i][0].hrgJual3PCS = hrg_jual_3_pcs;
                }
                if(name === 'margin4'){
                    this.state.barangHarga[i][0].margin4PCS = val;
                    this.state.barangHarga[i][0].hrgJual4PCS = hrg_jual_4_pcs;
                }
                if(name === 'hrgjual1'){
                    this.state.barangHarga[i][0].hrgJual1PCS = val;
                    this.state.barangHarga[i][0].margin1PCS = margin1_pcs;
                }
                if(name === 'hrgjual2'){
                    this.state.barangHarga[i][0].hrgJual2PCS = val;
                    this.state.barangHarga[i][0].margin2PCS = margin2_pcs;
                }
                if(name === 'hrgjual3'){
                    this.state.barangHarga[i][0].hrgJual3PCS = val;
                    this.state.barangHarga[i][0].margin3PCS = margin3_pcs;
                }
                if(name === 'hrgjual4'){
                    this.state.barangHarga[i][0].hrgJual4PCS = val;
                    this.state.barangHarga[i][0].margin4PCS = margin4_pcs;
                }
                if(name === 'service'){this.state.barangHarga[i][0].servicePCS = val;}
                if(name === 'ppn'){this.state.barangHarga[i][0].ppnPCS = val;}
            }
        }
    }
    handleChangeMore(e){
        e.preventDefault();
        let hrg_jual_1_pcs = 0;let margin1_pcs=0;
        let hrg_jual_2_pcs = 0;let margin2_pcs=0;
        let hrg_jual_3_pcs = 0;let margin3_pcs=0;
        let hrg_jual_4_pcs = 0;let margin4_pcs=0;
        let column = e.target.name;
        let value = e.target.value;
        this.setState({ [column]: value });
        let qty_konversi=[];
        for(let i=0;i<this.state.barangSku.length;i++){
            qty_konversi.push(this.state.barangSku[i].konversi);
        }
        if(column === 'hrg_beli'){
            this.setState({
                hrg_beli_pack : parseInt(value*qty_konversi[1]),
                hrg_beli_karton : parseInt(value*qty_konversi[2]),
            });
        }
        if(column === "margin1"){
            this.setState({
                hrgjual1:parseInt(this.state.hrg_beli) * (parseInt(value)/100) + parseInt(this.state.hrg_beli),
            });
            hrg_jual_1_pcs = parseInt(this.state.hrg_beli) * (parseInt(value)/100) + parseInt(this.state.hrg_beli);
        }
        if(column === "margin2"){
            this.setState({
                hrgjual2:(parseInt(this.state.hrg_beli) * (parseInt(value)/100)) + parseInt(this.state.hrg_beli)
            });
            hrg_jual_2_pcs = (parseInt(this.state.hrg_beli)*(parseInt(value)/100))+parseInt(this.state.hrg_beli);
        }
        if(column === "margin3"){
            this.setState({hrgjual3:(parseInt(this.state.hrg_beli)*(parseInt(value)/100))+parseInt(this.state.hrg_beli)});
            hrg_jual_3_pcs = (parseInt(this.state.hrg_beli)*(parseInt(value)/100))+parseInt(this.state.hrg_beli);
        }
        if(column === "margin4"){
            this.setState({hrgjual4:(parseInt(this.state.hrg_beli)*(parseInt(value)/100))+parseInt(this.state.hrg_beli)});
            hrg_jual_4_pcs = (parseInt(this.state.hrg_beli)*(parseInt(value)/100))+parseInt(this.state.hrg_beli);
        }
        if(column === "hrgjual1"){
            this.setState({
                margin1:((parseInt(value)-parseInt(this.state.hrg_beli))/parseInt(this.state.hrg_beli))*100,
            });
            margin1_pcs = ((parseInt(value)-parseInt(this.state.hrg_beli))/parseInt(this.state.hrg_beli))*100;

        }
        if(column === "hrgjual2"){
            this.setState({
                margin2:((parseInt(value)-parseInt(this.state.hrg_beli))/parseInt(this.state.hrg_beli))*100,

            });
            margin2_pcs = ((parseInt(value)-parseInt(this.state.hrg_beli))/parseInt(this.state.hrg_beli))*100;
        }
        if(column === "hrgjual3"){
            this.setState({
                margin3:((parseInt(value)-parseInt(this.state.hrg_beli))/parseInt(this.state.hrg_beli))*100,

            });
            margin3_pcs = ((parseInt(value)-parseInt(this.state.hrg_beli))/parseInt(this.state.hrg_beli))*100;
        }
        if(column === "hrgjual4"){
            this.setState({
                margin4:((parseInt(value)-parseInt(this.state.hrg_beli))/parseInt(this.state.hrg_beli))*100,
            });
            margin4_pcs = ((parseInt(value)-parseInt(this.state.hrg_beli))/parseInt(this.state.hrg_beli))*100;
        }

        if(localStorage.getItem("samarata") === "true"){
            for(let i=0;i<this.state.barangHarga.length;i++) {
                if(column === 'hrg_beli'){
                    this.state.barangHarga[i][0].hrgBeliPCS = value;
                    if(this.state.barangSku.length === 3){
                        this.state.barangHarga[i][1].hrgBeliPACK = parseInt(value*qty_konversi[1]);
                        this.state.barangHarga[i][2].hrgBeliKARTON = parseInt(value*qty_konversi[2]);
                    }
                }
                if(column === 'margin1'){
                    this.state.barangHarga[i][0].margin1PCS = value;
                    this.state.barangHarga[i][0].hrgJual1PCS = hrg_jual_1_pcs;
                    console.log(this.state.barangHarga[i][0].hrgJual1PCS);
                }
                if(column === 'margin2'){
                    this.state.barangHarga[i][0].margin2PCS = value;
                    this.state.barangHarga[i][0].hrgJual2PCS = hrg_jual_2_pcs;

                }
                if(column === 'margin3'){
                    this.state.barangHarga[i][0].margin3PCS = value;
                    this.state.barangHarga[i][0].hrgJual3PCS = hrg_jual_3_pcs;
                }
                if(column === 'margin4'){
                    this.state.barangHarga[i][0].margin4PCS = value;
                    this.state.barangHarga[i][0].hrgJual4PCS = hrg_jual_4_pcs;
                }
                if(column === 'hrgjual1'){
                    this.state.barangHarga[i][0].hrgJual1PCS = value;
                    this.state.barangHarga[i][0].margin1PCS = margin1_pcs;
                }
                if(column === 'hrgjual2'){
                    this.state.barangHarga[i][0].hrgJual2PCS = value;
                    this.state.barangHarga[i][0].margin2PCS = margin2_pcs;
                }
                if(column === 'hrgjual3'){
                    this.state.barangHarga[i][0].hrgJual3PCS = value;
                    this.state.barangHarga[i][0].margin3PCS = margin3_pcs;
                }
                if(column === 'hrgjual4'){
                    this.state.barangHarga[i][0].hrgJual4PCS = value;
                    this.state.barangHarga[i][0].margin4PCS = margin4_pcs;
                }
                if(column === 'service'){this.state.barangHarga[i][0].servicePCS = value;}
                if(column === 'ppn'){this.state.barangHarga[i][0].ppnPCS = value;}
            }
        }
        if(localStorage.getItem("samarata_pack") === "true"){
            for(let i=0;i<this.state.barangHarga.length;i++){
                if(column==="hrg_beli_pack"){
                    this.state.barangHarga[i][1].hrgBeliPACK =  value;
                    this.state.hrgBeliPACK = value;
                }
                if(column==="margin1_pack"){
                    this.setState({
                        hrgjual1_pack:parseInt(this.state.hrg_beli_pack) * (parseInt(value)/100) + parseInt(this.state.hrg_beli_pack),
                        hrgJual1PACK:parseInt(this.state.hrg_beli_pack) * (parseInt(value)/100) + parseInt(this.state.hrg_beli_pack),
                        margin1PACK:value,
                    });
                    this.state.barangHarga[i][1].margin1PACK = value;
                    this.state.barangHarga[i][1].hrgJual1PACK = parseInt(this.state.hrg_beli_pack) * (parseInt(value)/100) + parseInt(this.state.hrg_beli_pack);
                }
                if(column==="margin2_pack"){
                    this.setState({
                        hrgjual2_pack:parseInt(this.state.hrg_beli_pack) * (parseInt(value)/100) + parseInt(this.state.hrg_beli_pack),
                        hrgJual2PACK:parseInt(this.state.hrg_beli_pack) * (parseInt(value)/100) + parseInt(this.state.hrg_beli_pack),
                        margin2PACK:value,
                    });
                    this.state.barangHarga[i][1].margin2PACK = value;
                    this.state.barangHarga[i][1].hrgJual2PACK = parseInt(this.state.hrg_beli_pack) * (parseInt(value)/100) + parseInt(this.state.hrg_beli_pack);                }
                if(column==="margin3_pack"){
                    this.setState({
                        hrgjual3_pack:parseInt(this.state.hrg_beli_pack) * (parseInt(value)/100) + parseInt(this.state.hrg_beli_pack),
                        hrgJual3PACK:parseInt(this.state.hrg_beli_pack) * (parseInt(value)/100) + parseInt(this.state.hrg_beli_pack),
                        margin3PACK:value,
                    });
                    this.state.barangHarga[i][1].margin3PACK = value;
                    this.state.barangHarga[i][1].hrgJual3PACK = parseInt(this.state.hrg_beli_pack) * (parseInt(value)/100) + parseInt(this.state.hrg_beli_pack);
                }
                if(column==="margin4_pack"){
                    this.setState({
                        hrgjual4_pack:parseInt(this.state.hrg_beli_pack) * (parseInt(value)/100) + parseInt(this.state.hrg_beli_pack),
                        hrgJual4PACK:parseInt(this.state.hrg_beli_pack) * (parseInt(value)/100) + parseInt(this.state.hrg_beli_pack),
                        margin4PACK:value,
                    });
                    this.state.barangHarga[i][1].margin4PACK = value;
                    this.state.barangHarga[i][1].hrgJual4PACK = parseInt(this.state.hrg_beli_pack) * (parseInt(value)/100) + parseInt(this.state.hrg_beli_pack);
                }
                if(column==="hrgjual1_pack"){
                    this.setState({
                        margin1_pack:((parseInt(value)-parseInt(this.state.hrg_beli_pack))/parseInt(this.state.hrg_beli_pack))*100,
                        margin1PACK:((parseInt(value)-parseInt(this.state.hrg_beli_pack))/parseInt(this.state.hrg_beli_pack))*100,
                        hrgJual1PACK:value
                    });
                    this.state.barangHarga[i][1].margin1PACK = ((parseInt(value)-parseInt(this.state.hrg_beli_pack))/parseInt(this.state.hrg_beli_pack))*100;
                    this.state.barangHarga[i][1].hrgJual1PACK = value;
                    // margin4_pcs = ((parseInt(val)-parseInt(this.state.hrg_beli))/parseInt(this.state.hrg_beli))*100;
                }
                if(column==="hrgjual2_pack"){
                    this.setState({
                        margin2_pack:((parseInt(value)-parseInt(this.state.hrg_beli_pack))/parseInt(this.state.hrg_beli_pack))*100,
                        margin2PACK:((parseInt(value)-parseInt(this.state.hrg_beli_pack))/parseInt(this.state.hrg_beli_pack))*100,
                        hrgJual2PACK:value
                    });
                    this.state.barangHarga[i][1].margin2PACK = ((parseInt(value)-parseInt(this.state.hrg_beli_pack))/parseInt(this.state.hrg_beli_pack))*100;
                    this.state.barangHarga[i][1].hrgJual2PACK = value;
                }
                if(column==="hrgjual3_pack"){
                    this.setState({
                        margin3_pack:((parseInt(value)-parseInt(this.state.hrg_beli_pack))/parseInt(this.state.hrg_beli_pack))*100,
                        margin3PACK:((parseInt(value)-parseInt(this.state.hrg_beli_pack))/parseInt(this.state.hrg_beli_pack))*100,
                        hrgJual3PACK:value
                    });
                    this.state.barangHarga[i][1].margin3PACK = ((parseInt(value)-parseInt(this.state.hrg_beli_pack))/parseInt(this.state.hrg_beli_pack))*100;
                    this.state.barangHarga[i][1].hrgJual3PACK = value;
                }
                if(column==="hrgjual4_pack"){
                    this.setState({
                        margin4_pack:((parseInt(value)-parseInt(this.state.hrg_beli_pack))/parseInt(this.state.hrg_beli_pack))*100,
                        margin4PACK:((parseInt(value)-parseInt(this.state.hrg_beli_pack))/parseInt(this.state.hrg_beli_pack))*100,
                        hrgJual4PACK:value
                    });
                    this.state.barangHarga[i][1].margin4PACK = ((parseInt(value)-parseInt(this.state.hrg_beli_pack))/parseInt(this.state.hrg_beli_pack))*100;
                    this.state.barangHarga[i][1].hrgJual4PACK = value;
                }
                if(column==="service_pack"){
                    this.state.barangHarga[i][1].servicePACK =  value;
                    this.state.servicePACK = value;
                }
                if(column==="ppn_pack"){
                    this.state.barangHarga[i][1].ppnPACK = value;
                    this.state.ppnPACK = value;
                }
            }
        }
        if(localStorage.getItem("samarata_karton") === "true"){
            for(let i=0;i<this.state.barangHarga.length;i++) {
                if (column === "hrg_beli_karton") {
                    this.state.barangHarga[i][2].hrgBeliKARTON = value;
                }
                if (column === "margin1_karton") {
                    this.setState({
                        hrgjual1_karton:parseInt(this.state.hrg_beli_karton) * (parseInt(value)/100) + parseInt(this.state.hrg_beli_karton),
                        hrgJual1KARTON:parseInt(this.state.hrg_beli_karton) * (parseInt(value)/100) + parseInt(this.state.hrg_beli_karton),
                        margin1KARTON:value
                    });
                    this.state.barangHarga[i][2].margin1KARTON = value;
                    this.state.barangHarga[i][2].hrgJual1KARTON = parseInt(this.state.hrg_beli_karton) * (parseInt(value)/100) + parseInt(this.state.hrg_beli_karton);
                }
                if (column === "margin2_karton") {
                    this.setState({
                        hrgjual2_karton:parseInt(this.state.hrg_beli_karton) * (parseInt(value)/100) + parseInt(this.state.hrg_beli_karton),
                        hrgJual2KARTON:parseInt(this.state.hrg_beli_karton) * (parseInt(value)/100) + parseInt(this.state.hrg_beli_karton),
                        margin2KARTON:value
                    });
                    this.state.barangHarga[i][2].margin2KARTON = value;
                    this.state.barangHarga[i][2].hrgJual2KARTON = parseInt(this.state.hrg_beli_karton) * (parseInt(value)/100) + parseInt(this.state.hrg_beli_karton);                }
                if (column === "margin3_karton") {
                    this.setState({
                        hrgjual3_karton:parseInt(this.state.hrg_beli_karton) * (parseInt(value)/100) + parseInt(this.state.hrg_beli_karton),
                        hrgJual3KARTON:parseInt(this.state.hrg_beli_karton) * (parseInt(value)/100) + parseInt(this.state.hrg_beli_karton),
                        margin3KARTON:value
                    });
                    this.state.barangHarga[i][2].margin3KARTON = value;
                    this.state.barangHarga[i][2].hrgJual3KARTON = parseInt(this.state.hrg_beli_karton) * (parseInt(value)/100) + parseInt(this.state.hrg_beli_karton);
                }
                if (column === "margin4_karton") {
                    this.setState({
                        hrgjual4_karton:parseInt(this.state.hrg_beli_karton) * (parseInt(value)/100) + parseInt(this.state.hrg_beli_karton),
                        hrgJual4KARTON:parseInt(this.state.hrg_beli_karton) * (parseInt(value)/100) + parseInt(this.state.hrg_beli_karton),
                        margin4KARTON:value
                    });
                    this.state.barangHarga[i][2].margin4KARTON = value;
                    this.state.barangHarga[i][2].hrgJual4KARTON = parseInt(this.state.hrg_beli_karton) * (parseInt(value)/100) + parseInt(this.state.hrg_beli_karton);
                }
                if (column === "hrgjual1_karton") {
                    this.setState({
                        margin1_karton:((parseInt(value)-parseInt(this.state.hrg_beli_karton))/parseInt(this.state.hrg_beli_karton))*100,
                        margin1KARTON:((parseInt(value)-parseInt(this.state.hrg_beli_karton))/parseInt(this.state.hrg_beli_karton))*100,
                        hrgJual1KARTON:value
                    });
                    this.state.barangHarga[i][2].margin1KARTON = ((parseInt(value)-parseInt(this.state.hrg_beli_karton))/parseInt(this.state.hrg_beli_karton))*100;
                    this.state.barangHarga[i][2].hrgJual1KARTON = value;
                }
                if (column === "hrgjual2_karton") {
                    this.setState({
                        margin2_karton:((parseInt(value)-parseInt(this.state.hrg_beli_karton))/parseInt(this.state.hrg_beli_karton))*100,
                        margin2KARTON:((parseInt(value)-parseInt(this.state.hrg_beli_karton))/parseInt(this.state.hrg_beli_karton))*100,
                        hrgJual2KARTON:value
                    });
                    this.state.barangHarga[i][2].margin2KARTON = ((parseInt(value)-parseInt(this.state.hrg_beli_karton))/parseInt(this.state.hrg_beli_karton))*100;
                    this.state.barangHarga[i][2].hrgJual2KARTON = value;
                }
                if (column === "hrgjual3_karton") {
                    this.setState({
                        margin3_karton:((parseInt(value)-parseInt(this.state.hrg_beli_karton))/parseInt(this.state.hrg_beli_karton))*100,
                        margin3KARTON:((parseInt(value)-parseInt(this.state.hrg_beli_karton))/parseInt(this.state.hrg_beli_karton))*100,
                        hrgJual3KARTON:value
                    });
                    this.state.barangHarga[i][2].margin3KARTON = ((parseInt(value)-parseInt(this.state.hrg_beli_karton))/parseInt(this.state.hrg_beli_karton))*100;
                    this.state.barangHarga[i][2].hrgJual3KARTON = value;
                }
                if (column === "hrgjual4_karton") {
                    this.setState({
                        margin4_karton:((parseInt(value)-parseInt(this.state.hrg_beli_karton))/parseInt(this.state.hrg_beli_karton))*100,
                        margin4KARTON:((parseInt(value)-parseInt(this.state.hrg_beli_karton))/parseInt(this.state.hrg_beli_karton))*100,
                        hrgJual4KARTON:value
                    });
                    this.state.barangHarga[i][2].margin4KARTON = ((parseInt(value)-parseInt(this.state.hrg_beli_karton))/parseInt(this.state.hrg_beli_karton))*100;
                    this.state.barangHarga[i][2].hrgJual4KARTON = value;
                }
                if (column === "service_karton") {
                    this.state.barangHarga[i][2].serviceKARTON = value;
                    this.state.serviceKARTON = value;
                }
                if (column === "ppn_karton") {
                    this.state.barangHarga[i][2].ppnKARTON = value;
                    this.state.ppnKARTON = value;
                }
            }

        }



    }
    validasiLastForm(){
        let barangSku = [];
        let barangHarga = [];
        let barcode=[];
        for(let i=0;i<this.state.barangSku.length;i++){
            barangSku.push({
                "barcode":this.state.barangSku[i].barcode,
                "satuan":this.state.barangSku[i].qty,
                "qty_konversi":this.state.barangSku[i].konversi,
                "satuan_jual":this.state.barangSku[i].satuan_jual,
            });
            barcode.push(this.state.barangSku[i].barcode);
        }
        for(let i=0;i<this.state.barangHarga.length;i++){
            if(this.state.barangSku.length === 1){
                barangHarga.push({
                    "lokasi":this.state.barangHarga[i][0].lokasi,
                    "harga":this.state.barangHarga[i][0].hrgJual1PCS,
                    "harga_beli":this.state.barangHarga[i][0].hrgBeliPCS,
                    "barcode":barcode[0],
                    "ppn":this.state.barangHarga[i][0].ppnPCS,
                    "service":this.state.barangHarga[i][0].servicePCS,
                    "harga2":this.state.barangHarga[i][0].hrgJual2PCS,
                    "harga3":this.state.barangHarga[i][0].hrgJual3PCS,
                    "harga4":this.state.barangHarga[i][0].hrgJual4PCS,
                });
                if(parseInt(this.state.barangHarga[i][0].hrgBeliPCS) === 0||parseInt(this.state.barangHarga[i][0].hrgBeliPCS) < 0){
                    alert(`harga beli satuan ${this.state.barangSku[0].qty} di lokasi ${this.state.barangHarga[i][0].nama_toko} tidak boleh kurang dari 0`);
                    return;
                }
                if(this.state.jenis!=='4'){
                    if(parseInt(this.state.barangHarga[i][0].margin1PCS) < 0){
                        alert(`margin 1 satuan ${this.state.barangSku[0].qty} tidak boleh kurang dari 0`);
                        return;
                    }
                    if(parseInt(this.state.barangHarga[i][0].margin2PCS) < 0){
                        alert(`margin 2 satuan ${this.state.barangSku[0].qty} tidak boleh kurang dari 0`);
                        return;
                    }
                    if(parseInt(this.state.barangHarga[i][0].margin2PCS) < 0){
                        alert(`margin 3 satuan ${this.state.barangSku[0].qty} tidak boleh kurang dari 0`);
                        return;
                    }
                    if(parseInt(this.state.barangHarga[i][0].margin2PCS) < 0){
                        alert(`margin 4 satuan ${this.state.barangSku[0].qty} tidak boleh kurang dari 0`);
                        return;
                    }
                    if(parseInt(this.state.barangHarga[i][0].hrgJual1PCS) === 0 ||parseInt(this.state.barangHarga[i][0].hrgJual1PCS) < 0){
                        alert(`harga jual 1 satuan ${this.state.barangSku[0].qty} tidak boleh kurang dari 0`);return;
                    }
                    if(parseInt(this.state.barangHarga[i][0].hrgJual2PCS) === 0 ||parseInt(this.state.barangHarga[i][0].hrgJual2PCS) < 0){
                        alert(`harga jual 2 satuan ${this.state.barangSku[0].qty} tidak boleh kurang dari 0`);return;
                    }
                    if(parseInt(this.state.barangHarga[i][0].hrgJual3PCS) === 0 ||parseInt(this.state.barangHarga[i][0].hrgJual3PCS) < 0){
                        alert(`harga jual 3 satuan ${this.state.barangSku[0].qty} tidak boleh kurang dari 0`);return;
                    }
                    if(parseInt(this.state.barangHarga[i][0].hrgJual4PCS) === 0 ||parseInt(this.state.barangHarga[i][0].hrgJual4PCS) < 0){
                        alert(`harga jual 4 ${this.state.barangSku[0].qty} tidak boleh kurang dari 0`);return;
                    }
                    if(parseInt(this.state.barangHarga[i][0].ppnPCS) < 0){
                        alert(`ppn satuan ${this.state.barangSku[0].qty} tidak boleh kurang dari 0`);return;
                    }
                    if(parseInt(this.state.barangHarga[i][0].servicePCS) < 0){
                        alert(`service satuan ${this.state.barangSku[0].qty} tidak boleh kurang dari 0`);return;
                    }
                }
            }
            else if(this.state.barangSku.length === 2){
                barangHarga.push({
                    "lokasi":this.state.barangHarga[i][0].lokasi,
                    "harga":this.state.barangHarga[i][0].hrgJual1PCS,
                    "harga_beli":this.state.barangHarga[i][0].hrgBeliPCS,
                    "barcode":barcode[0],
                    "ppn":this.state.barangHarga[i][0].ppnPCS,
                    "service":this.state.barangHarga[i][0].servicePCS,
                    "harga2":this.state.barangHarga[i][0].hrgJual2PCS,
                    "harga3":this.state.barangHarga[i][0].hrgJual3PCS,
                    "harga4":this.state.barangHarga[i][0].hrgJual4PCS,
                });
                barangHarga.push({
                    "lokasi":this.state.barangHarga[i][1].lokasi,
                    "harga":this.state.barangHarga[i][1].hrgJual1PACK,
                    "harga_beli":this.state.barangHarga[i][1].hrgBeliPACK,
                    "barcode":barcode[1]===undefined?"0":barcode[1],
                    "ppn":this.state.barangHarga[i][1].ppnPACK,
                    "service":this.state.barangHarga[i][1].servicePACK,
                    "harga2":this.state.barangHarga[i][1].hrgJual2PACK,
                    "harga3":this.state.barangHarga[i][1].hrgJual3PACK,
                    "harga4":this.state.barangHarga[i][1].hrgJual4PACK,
                });
                // VALIDASI PCS
                if(parseInt(this.state.barangHarga[i][0].hrgBeliPCS) === 0||parseInt(this.state.barangHarga[i][0].hrgBeliPCS) < 0){
                    alert(`harga beli satuan ${this.state.barangSku[0].qty} di lokasi ${this.state.barangHarga[i][0].nama_toko} tidak boleh kurang dari 0`);
                    return;
                }
                if(parseInt(this.state.barangHarga[i][0].margin1PCS) < 0){
                    alert(`margin 1 satuan ${this.state.barangSku[0].qty} tidak boleh kurang dari 0`);
                    return;
                }
                if(parseInt(this.state.barangHarga[i][0].margin2PCS) < 0){
                    alert(`margin 2 satuan ${this.state.barangSku[0].qty} tidak boleh kurang dari 0`);
                    return;
                }
                if(parseInt(this.state.barangHarga[i][0].margin3PCS) < 0){
                    alert(`margin 3 satuan ${this.state.barangSku[0].qty} tidak boleh kurang dari 0`);
                    return;
                }
                if(parseInt(this.state.barangHarga[i][0].margin4PCS) < 0){
                    alert(`margin 4 satuan ${this.state.barangSku[0].qty} tidak boleh kurang dari 0`);
                    return;
                }
                if(parseInt(this.state.barangHarga[i][0].hrgJual1PCS) === 0||parseInt(this.state.barangHarga[i][0].hrgJual1PCS) < 0){
                    alert(`harga jual 1 satuan ${this.state.barangSku[0].qty} tidak boleh kurang dari 0`);return;
                }
                if(parseInt(this.state.barangHarga[i][0].hrgJual2PCS) === 0||parseInt(this.state.barangHarga[i][0].hrgJual2PCS) < 0){
                    alert(`harga jual 2 satuan ${this.state.barangSku[0].qty} tidak boleh kurang dari 0`);return;
                }
                if(parseInt(this.state.barangHarga[i][0].hrgJual3PCS) === 0||parseInt(this.state.barangHarga[i][0].hrgJual3PCS) < 0){
                    alert(`harga jual 3 satuan ${this.state.barangSku[0].qty} tidak boleh kurang dari 0`);return;
                }
                if(parseInt(this.state.barangHarga[i][0].hrgJual4PCS) === 0||parseInt(this.state.barangHarga[i][0].hrgJual4PCS) < 0){
                    alert(`harga jual 4 ${this.state.barangSku[0].qty} tidak boleh kurang dari 0`);return;
                }
                if(parseInt(this.state.barangHarga[i][0].ppnPCS) < 0){
                    alert(`ppn satuan ${this.state.barangSku[0].qty} tidak boleh kurang dari 0`);return;
                }
                if(parseInt(this.state.barangHarga[i][0].servicePCS) < 0){
                    alert(`service satuan ${this.state.barangSku[0].qty} tidak boleh kurang dari 0`);return;
                }
                // VALIDASI PACK
                if(parseInt(this.state.barangHarga[i][1].hrgBeliPACK) === 0||parseInt(this.state.barangHarga[i][1].hrgBeliPACK) < 0){
                    alert(`harga beli satuan ${this.state.barangSku[1].qty} di lokasi ${this.state.barangHarga[i][1].nama_toko} tidak boleh kurang dari 0`);
                    return;
                }
                if(parseInt(this.state.barangHarga[i][1].margin1PACK) < 0){
                    alert(`margin 1 satuan ${this.state.barangSku[1].qty} di lokasi ${this.state.barangHarga[i][1].nama_toko} tidak boleh kurang dari 0`);
                    return;
                }
                if(parseInt(this.state.barangHarga[i][1].margin2PACK) < 0){
                    alert(`margin 2 satuan ${this.state.barangSku[1].qty} di lokasi ${this.state.barangHarga[i][1].nama_toko} tidak boleh kurang dari 0`);
                    return;
                }
                if(parseInt(this.state.barangHarga[i][1].margin3PACK) < 0){
                    alert(`margin 3 satuan ${this.state.barangSku[1].qty} di lokasi ${this.state.barangHarga[i][1].nama_toko} tidak boleh kurang dari 0`);
                    return;
                }
                if(parseInt(this.state.barangHarga[i][1].margin4PACK) < 0){
                    alert(`margin 4 satuan ${this.state.barangSku[1].qty} di lokasi ${this.state.barangHarga[i][1].nama_toko} tidak boleh kurang dari 0`);
                    return;
                }
                if(parseInt(this.state.barangHarga[i][1].hrgJual1PACK) === 0||parseInt(this.state.barangHarga[i][1].hrgJual1PACK) < 0){
                    alert(`harga jual 1 satuan ${this.state.barangSku[1].qty} di lokasi ${this.state.barangHarga[i][1].nama_toko} tidak boleh kurang dari 0`);return;
                }
                if(parseInt(this.state.barangHarga[i][1].hrgJual2PACK) === 0||parseInt(this.state.barangHarga[i][1].hrgJual2PACK) < 0){
                    alert(`harga jual 2 satuan ${this.state.barangSku[1].qty} di lokasi ${this.state.barangHarga[i][1].nama_toko} tidak boleh kurang dari 0`);return;
                }
                if(parseInt(this.state.barangHarga[i][1].hrgJual3PACK) === 0||parseInt(this.state.barangHarga[i][1].hrgJual3PACK) < 0){
                    alert(`harga jual 3 satuan ${this.state.barangSku[1].qty} di lokasi ${this.state.barangHarga[i][1].nama_toko} tidak boleh kurang dari 0`);return;
                }
                if(parseInt(this.state.barangHarga[i][1].hrgJual4PACK) === 0||parseInt(this.state.barangHarga[i][1].hrgJual4PACK) < 0){
                    alert(`harga jual 4 ${this.state.barangSku[1].qty} di lokasi ${this.state.barangHarga[i][1].nama_toko} tidak boleh kurang dari 0`);return;
                }
                if(parseInt(this.state.barangHarga[i][1].ppnPACK) < 0){
                    alert(`ppn satuan ${this.state.barangSku[1].qty} di lokasi ${this.state.barangHarga[i][1].nama_toko} tidak boleh kurang dari 0`);return;
                }
                if(parseInt(this.state.barangHarga[i][1].servicePACK) < 0){
                    alert(`service satuan ${this.state.barangSku[1].qty} di lokasi ${this.state.barangHarga[i][1].nama_toko} tidak boleh kurang dari 0`);return;
                }

            }
            else{
                barangHarga.push({
                    "lokasi":this.state.barangHarga[i][0].lokasi,
                    "harga":this.state.barangHarga[i][0].hrgJual1PCS,
                    "harga_beli":this.state.barangHarga[i][0].hrgBeliPCS,
                    "barcode":barcode[0],
                    "ppn":this.state.barangHarga[i][0].ppnPCS,
                    "service":this.state.barangHarga[i][0].servicePCS,
                    "harga2":this.state.barangHarga[i][0].hrgJual2PCS,
                    "harga3":this.state.barangHarga[i][0].hrgJual3PCS,
                    "harga4":this.state.barangHarga[i][0].hrgJual4PCS,
                });
                barangHarga.push({
                    "lokasi":this.state.barangHarga[i][1].lokasi,
                    "harga":this.state.barangHarga[i][1].hrgJual1PACK,
                    "harga_beli":this.state.barangHarga[i][1].hrgBeliPACK,
                    "barcode":barcode[1]===undefined?"0":barcode[1],
                    "ppn":this.state.barangHarga[i][1].ppnPACK,
                    "service":this.state.barangHarga[i][1].servicePACK,
                    "harga2":this.state.barangHarga[i][1].hrgJual2PACK,
                    "harga3":this.state.barangHarga[i][1].hrgJual3PACK,
                    "harga4":this.state.barangHarga[i][1].hrgJual4PACK,
                });
                barangHarga.push({
                    "lokasi":this.state.barangHarga[i][2].lokasi,
                    "harga":this.state.barangHarga[i][2].hrgJual1KARTON,
                    "harga_beli":this.state.barangHarga[i][2].hrgBeliKARTON,
                    "barcode":barcode[2]===undefined?"0":barcode[2],
                    "ppn":this.state.barangHarga[i][2].ppnKARTON,
                    "service":this.state.barangHarga[i][2].serviceKARTON,
                    "harga2":this.state.barangHarga[i][2].hrgJual2KARTON,
                    "harga3":this.state.barangHarga[i][2].hrgJual3KARTON,
                    "harga4":this.state.barangHarga[i][2].hrgJual4KARTON,
                });
                // VALIDASI PCS
                if(parseInt(this.state.barangHarga[i][0].hrgBeliPCS) === 0||parseInt(this.state.barangHarga[i][0].hrgBeliPCS) < 0){
                    alert(`harga beli satuan ${this.state.barangSku[0].qty} di lokasi ${this.state.barangHarga[i][0].nama_toko} tidak boleh kurang dari 0`);
                    return;
                }
                if(parseInt(this.state.barangHarga[i][0].margin1PCS) < 0){
                    alert(`margin 1 satuan ${this.state.barangSku[0].qty} di lokasi ${this.state.barangHarga[i][0].nama_toko} tidak boleh kurang dari 0`);
                    return;
                }
                if(parseInt(this.state.barangHarga[i][0].margin2PCS) < 0){
                    alert(`margin 2 satuan ${this.state.barangSku[0].qty} di lokasi ${this.state.barangHarga[i][0].nama_toko} tidak boleh kurang dari 0`);
                    return;
                }
                if(parseInt(this.state.barangHarga[i][0].margin3PCS) < 0){
                    alert(`margin 3 satuan ${this.state.barangSku[0].qty} di lokasi ${this.state.barangHarga[i][0].nama_toko} tidak boleh kurang dari 0`);
                    return;
                }
                if(parseInt(this.state.barangHarga[i][0].margin4PCS) < 0){
                    alert(`margin 4 satuan ${this.state.barangSku[0].qty} di lokasi ${this.state.barangHarga[i][0].nama_toko} tidak boleh kurang dari 0`);
                    return;
                }
                if(parseInt(this.state.barangHarga[i][0].hrgJual1PCS) === 0||parseInt(this.state.barangHarga[i][0].hrgJual1PCS) < 0){
                    alert(`harga jual 1 satuan ${this.state.barangSku[0].qty} di lokasi ${this.state.barangHarga[i][0].nama_toko} tidak boleh kurang dari 0`);return;
                }
                if(parseInt(this.state.barangHarga[i][0].hrgJual2PCS) === 0||parseInt(this.state.barangHarga[i][0].hrgJual2PCS) < 0){
                    alert(`harga jual 2 satuan ${this.state.barangSku[0].qty} di lokasi ${this.state.barangHarga[i][0].nama_toko} tidak boleh kurang dari 0`);return;
                }
                if(parseInt(this.state.barangHarga[i][0].hrgJual3PCS) === 0||parseInt(this.state.barangHarga[i][0].hrgJual3PCS) < 0){
                    alert(`harga jual 3 satuan ${this.state.barangSku[0].qty} di lokasi ${this.state.barangHarga[i][0].nama_toko} tidak boleh kurang dari 0`);return;
                }
                if(parseInt(this.state.barangHarga[i][0].hrgJual4PCS) === 0||parseInt(this.state.barangHarga[i][0].hrgJual4PCS) < 0){
                    alert(`harga jual 4 ${this.state.barangSku[0].qty} di lokasi ${this.state.barangHarga[i][0].nama_toko} tidak boleh kurang dari 0`);return;
                }
                if(parseInt(this.state.barangHarga[i][0].ppnPCS) < 0){
                    alert(`ppn satuan ${this.state.barangSku[0].qty} di lokasi ${this.state.barangHarga[i][0].nama_toko} tidak boleh kurang dari 0`);return;
                }
                if(parseInt(this.state.barangHarga[i][0].servicePCS) < 0){
                    alert(`service satuan ${this.state.barangSku[0].qty} di lokasi ${this.state.barangHarga[i][0].nama_toko} tidak boleh kurang dari 0`);return;
                }
                // VALIDASI PACK
                if(parseInt(this.state.barangHarga[i][1].hrgBeliPACK) === 0||parseInt(this.state.barangHarga[i][1].hrgBeliPACK) < 0){
                    alert(`harga beli satuan ${this.state.barangSku[1].qty} di lokasi ${this.state.barangHarga[i][1].nama_toko} tidak boleh kurang dari 0`);
                    return;
                }
                if(parseInt(this.state.barangHarga[i][1].margin1PACK) < 0){
                    alert(`margin 1 satuan ${this.state.barangSku[1].qty} di lokasi ${this.state.barangHarga[i][1].nama_toko} tidak boleh kurang dari 0`);
                    return;
                }
                if(parseInt(this.state.barangHarga[i][1].margin2PACK) < 0){
                    alert(`margin 2 satuan ${this.state.barangSku[1].qty} di lokasi ${this.state.barangHarga[i][1].nama_toko} tidak boleh kurang dari 0`);
                    return;
                }
                if(parseInt(this.state.barangHarga[i][1].margin3PACK) < 0){
                    alert(`margin 3 satuan ${this.state.barangSku[1].qty} di lokasi ${this.state.barangHarga[i][1].nama_toko} tidak boleh kurang dari 0`);
                    return;
                }
                if(parseInt(this.state.barangHarga[i][1].margin4PACK) < 0){
                    alert(`margin 4 satuan ${this.state.barangSku[1].qty} di lokasi ${this.state.barangHarga[i][1].nama_toko} tidak boleh kurang dari 0`);
                    return;
                }
                if(parseInt(this.state.barangHarga[i][1].hrgJual1PACK) === 0||parseInt(this.state.barangHarga[i][1].hrgJual1PACK) < 0){
                    alert(`harga jual 1 satuan ${this.state.barangSku[1].qty} di lokasi ${this.state.barangHarga[i][1].nama_toko} tidak boleh kurang dari 0`);return;
                }
                if(parseInt(this.state.barangHarga[i][1].hrgJual2PACK) === 0||parseInt(this.state.barangHarga[i][1].hrgJual2PACK) < 0){
                    alert(`harga jual 2 satuan ${this.state.barangSku[1].qty} di lokasi ${this.state.barangHarga[i][1].nama_toko} tidak boleh kurang dari 0`);return;
                }
                if(parseInt(this.state.barangHarga[i][1].hrgJual3PACK) === 0||parseInt(this.state.barangHarga[i][1].hrgJual3PACK) < 0){
                    alert(`harga jual 3 satuan ${this.state.barangSku[1].qty} di lokasi ${this.state.barangHarga[i][1].nama_toko} tidak boleh kurang dari 0`);return;
                }
                if(parseInt(this.state.barangHarga[i][1].hrgJual4PACK) === 0||parseInt(this.state.barangHarga[i][1].hrgJual4PACK) < 0){
                    alert(`harga jual 4 ${this.state.barangSku[1].qty} di lokasi ${this.state.barangHarga[i][1].nama_toko} tidak boleh kurang dari 0`);return;
                }
                if(parseInt(this.state.barangHarga[i][1].ppnPACK) < 0){
                    alert(`ppn satuan ${this.state.barangSku[1].qty} di lokasi ${this.state.barangHarga[i][1].nama_toko} tidak boleh kurang dari 0`);return;
                }
                if(parseInt(this.state.barangHarga[i][1].servicePACK) < 0){
                    alert(`service satuan ${this.state.barangSku[1].qty} di lokasi ${this.state.barangHarga[i][1].nama_toko} tidak boleh kurang dari 0`);return;
                }
                // VALIDASI KARTON
                if(parseInt(this.state.barangHarga[i][2].hrgBeliKARTON) === 0||parseInt(this.state.barangHarga[i][2].hrgBeliKARTON) < 0){
                    alert(`harga beli satuan ${this.state.barangSku[2].qty} di lokasi ${this.state.barangHarga[i][2].nama_toko} tidak boleh kurang dari 0`);
                    return;
                }
                if(parseInt(this.state.barangHarga[i][2].margin1KARTON) < 0){
                    alert(`margin 1 satuan ${this.state.barangSku[2].qty} di lokasi ${this.state.barangHarga[i][2].nama_toko} tidak boleh kurang dari 0`);
                    return;
                }
                if(parseInt(this.state.barangHarga[i][2].margin2KARTON) < 0){
                    alert(`margin 2 satuan ${this.state.barangSku[2].qty} di lokasi ${this.state.barangHarga[i][2].nama_toko} tidak boleh kurang dari 0`);
                    return;
                }
                if(parseInt(this.state.barangHarga[i][2].margin3KARTON) < 0){
                    alert(`margin 3 satuan ${this.state.barangSku[2].qty} di lokasi ${this.state.barangHarga[i][2].nama_toko} tidak boleh kurang dari 0`);
                    return;
                }
                if(parseInt(this.state.barangHarga[i][2].margin4KARTON) < 0){
                    alert(`margin 4 satuan ${this.state.barangSku[2].qty} di lokasi ${this.state.barangHarga[i][2].nama_toko} tidak boleh kurang dari 0`);
                    return;
                }
                if(parseInt(this.state.barangHarga[i][2].hrgJual1KARTON) === 0||parseInt(this.state.barangHarga[i][2].hrgJual1KARTON) < 0){
                    alert(`harga jual 1 satuan ${this.state.barangSku[2].qty} di lokasi ${this.state.barangHarga[i][2].nama_toko} tidak boleh kurang dari 0`);return;
                }
                if(parseInt(this.state.barangHarga[i][2].hrgJual2KARTON) === 0||parseInt(this.state.barangHarga[i][2].hrgJual2KARTON) < 0){
                    alert(`harga jual 2 satuan ${this.state.barangSku[2].qty} di lokasi ${this.state.barangHarga[i][2].nama_toko} tidak boleh kurang dari 0`);return;
                }
                if(parseInt(this.state.barangHarga[i][2].hrgJual3KARTON) === 0||parseInt(this.state.barangHarga[i][2].hrgJual3KARTON) < 0){
                    alert(`harga jual 3 satuan ${this.state.barangSku[2].qty} di lokasi ${this.state.barangHarga[i][2].nama_toko} tidak boleh kurang dari 0`);return;
                }
                if(parseInt(this.state.barangHarga[i][2].hrgJual4KARTON) === 0||parseInt(this.state.barangHarga[i][2].hrgJual4KARTON) < 0){
                    alert(`harga jual 4 ${this.state.barangSku[2].qty} di lokasi ${this.state.barangHarga[i][2].nama_toko} tidak boleh kurang dari 0`);return;
                }
                if(parseInt(this.state.barangHarga[i][2].ppnKARTON) < 0){
                    alert(`ppn satuan ${this.state.barangSku[2].qty} di lokasi ${this.state.barangHarga[i][2].nama_toko} tidak boleh kurang dari 0`);return;
                }
                if(parseInt(this.state.barangHarga[i][2].serviceKARTON) < 0){
                    alert(`service satuan ${this.state.barangSku[2].qty} di lokasi ${this.state.barangHarga[i][2].nama_toko} tidak boleh kurang dari 0`);return;
                }
            }
        }
        return [{"barangSku":barangSku,"barangHarga":barangHarga}];
    }
    handleSubmit(e){
        e.preventDefault();
        let parseData = {};
        let barangSku = [];
        let barangHrg = [];
        parseData["kd_brg"]     = this.state.kd_brg;
        parseData["nm_brg"]     = this.state.nm_brg;
        parseData["kel_brg"]    = this.state.kel_brg;
        parseData["jenis"]      = this.state.kategori;
        parseData["stock_min"]  = this.state.stock_min;
        parseData["group1"]     = this.state.group1;
        parseData["group2"]     = this.state.group2;
        parseData["deskripsi"]  = this.state.deskripsi;
        parseData['gambar']     = this.state.gambar;
        parseData["kategori"]   = this.state.jenis;
        parseData["kcp"]        = this.state.kcp;
        parseData["poin"]       = this.state.poin;
        parseData["online"]     = this.state.online;
        parseData["berat"]      = this.state.berat;
        if(parseData['gambar']===''){parseData['gambar']='-';
        }else{parseData['gambar']=this.state.gambar.base64;}
        let arr=this.validasiLastForm();
        if(arr!==undefined){
            for(let x=0;x<arr.length;x++){
                for(let y=0;y<arr[x].barangSku.length;y++){
                    barangSku.push(arr[x].barangSku[y]);
                }
                for(let y=0;y<arr[x].barangHarga.length;y++){
                    barangHrg.push(arr[x].barangHarga[y]);
                }
            }
        }
        parseData["barang_sku"]     = barangSku;
        parseData["barang_harga"]   = barangHrg;

        if(this.props.dataEdit !== undefined && this.props.dataEdit !== []){
            this.props.dispatch(updateProduct(this.state.kd_brg,parseData))
        }else{
            this.props.dispatch(createProduct(parseData));
        }
        this.clearState();



    }
    getFiles(files) {
        this.setState({
            gambar: files
        })
    };
    render(){
        return (
            <WrapperModal className="custom-map-modal" isOpen={this.props.isOpen && this.props.type === "formProduct"} size="lg">
                <ModalHeader toggle={this.toggle}>
                    {
                        this.props.dataEdit===undefined?"Tambah Barang":"Ubah Barang"
                    }
                    <br/>
                    {
                        this.state.selectedIndex===0?(
                            <small> ( sebelum memilih jenis barang, pastikan anda sudah membuat kode barang terlebih dahulu. tujuan ini untuk membuat barcode secara otomatis )</small>
                        ) : this.state.selectedIndex===1?(
                            <small> ( barcode tidak boleh ada yang sama dengan yang lainnya )</small>
                        ) : this.state.selectedIndex===2?(
                            <small> ( ceklis atur semua untuk mengatur form yang lainnya )</small>
                        ) : ""
                    }
                </ModalHeader>

                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <Tabs onSelect={this.handleSelect} selectedIndex={this.state.selectedIndex}>
                            <TabList>
                                <Tab label="Core Courses">Form 1</Tab>
                                <Tab label="Core Courses">Form 2</Tab>
                                <Tab label="Core Courses">Form 3</Tab>
                            </TabList>
                            <hr/>
                            <TabPanel>
                                <div className="row">
                                    <div className="col-md-4">

                                        <div className="form-group">
                                            <label htmlFor="inputState" className="col-form-label">{this.props.dataEdit===undefined?<input type="checkbox" checked={this.state.generateCode} onChange={this.generateCode}/>:""} Kode Barang</label>
                                            <input readOnly={this.props.dataEdit===undefined?false:true} type="text" className="form-control" name="kd_brg" value={this.state.kd_brg} onChange={(e)=>this.handleChange(e,null)} required/>
                                            <div className="invalid-feedback" style={this.state.error.kd_brg || this.props.checkKodeBarang===true !== "" ? {display: 'block'} : {display: 'none'}}>
                                                {
                                                    this.state.kd_brg===''||this.state.kd_brg===undefined?this.state.error.kd_brg:(this.props.checkKodeBarang===true?"kode barang sudah digunakan":"")
                                                }
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Nama Barang</label>
                                            <input type="text" className="form-control" name="nm_brg" value={this.state.nm_brg} onChange={(e)=>this.handleChange(e,null)} required/>
                                            <div className="invalid-feedback"
                                                 style={this.state.error.nm_brg !== "" ? {display: 'block'} : {display: 'none'}}>
                                                {this.state.error.nm_brg}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Kelompok Barang</label>
                                            <Select options={this.state.kel_brg_data} placeholder="Pilih Kelompok Barang" onChange={this.handleKelompokBarang} value={this.state.kel_brg_data.find(op => {return op.value === this.state.kel_brg})}/>
                                            <div className="invalid-feedback"
                                                 style={this.state.error.kel_brg !== "" ? {display: 'block'} : {display: 'none'}}>
                                                {this.state.error.kel_brg}
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Kategori Barang</label>
                                            <select name="kategori" className="form-control form-control-lg" value={this.state.kategori} onChange={(e)=>this.handleChange(e,null)}>
                                                <option value="">Pilih Kategori Barang</option>
                                                <option value="1">Dijual</option>
                                                <option value="0">Tidak Dijual</option>
                                            </select>
                                            <div className="invalid-feedback"
                                                 style={this.state.error.kategori !== "" ? {display: 'block'} : {display: 'none'}}>
                                                {this.state.error.kategori}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Stock Min</label>
                                            <input type="number" className="form-control" name="stock_min" value={this.state.stock_min} onChange={(e)=>this.handleChange(e,null)} required/>
                                            <div className="invalid-feedback"
                                                 style={this.state.error.stock_min !== "" ? {display: 'block'} : {display: 'none'}}>
                                                {this.state.error.stock_min}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Supplier</label>
                                            <Select options={this.state.group1_data} placeholder="Pilih Supplier" onChange={this.handleGroup1} value={this.state.group1_data.find(op => {return op.value === this.state.group1})}/>
                                            <div className="invalid-feedback"
                                                 style={this.state.error.group1 !== "" ? {display: 'block'} : {display: 'none'}}>
                                                {this.state.error.group1}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Sub Dept</label>
                                            <Select options={this.state.group2_data} placeholder="Pilih Sub Dept" onChange={this.handleGroup2} value={this.state.group2_data.find(op => {return op.value === this.state.group2})}/>
                                            <div className="invalid-feedback"
                                                 style={this.state.error.group2 !== "" ? {display: 'block'} : {display: 'none'}}>
                                                {this.state.error.group2}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Deskripsi</label>
                                            <input type="text" className="form-control" name="deskripsi" value={this.state.deskripsi} onChange={(e)=>this.handleChange(e,null)}  required/>
                                            <div className="invalid-feedback"
                                                 style={this.state.error.deskripsi !== "" ? {display: 'block'} : {display: 'none'}}>
                                                {this.state.error.deskripsi}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="inputState" className="col-form-label">Gambar</label><br/>
                                            <FileBase64 multiple={ false } className="mr-3 form-control-file" onDone={ this.getFiles.bind(this) } />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Jenis Barang</label>
                                            <select name="jenis" id="jenis" className="form-control form-control-lg" value={this.state.jenis} onChange={(e)=>this.handleChange(e,null)}>
                                                <option value="">Pilih Jenis</option>
                                                <option value="1">Satuan</option>
                                                <option value="2">Paket</option>
                                                <option value="3">Servis</option>
                                                <option value="0">Karton</option>
                                                <option value="4">Bahan</option>
                                            </select>
                                            <div className="invalid-feedback"
                                                 style={this.state.error.jenis !== "" ? {display: 'block'} : {display: 'none'}}>
                                                {this.state.error.jenis}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>KCP</label>
                                            <select name="kcp" id="kcp" className="form-control form-control-lg" value={this.state.kcp} onChange={(e)=>this.handleChange(e,null)}>
                                                <option value="">Pilih Kcp</option>
                                                <option value="-">-</option>
                                                <option value="0">Kitchen 1</option>
                                                <option value="1">Kitchen 2</option>
                                                <option value="2">Kitchen 3</option>
                                            </select>
                                            <div className="invalid-feedback"
                                                 style={this.state.error.kcp !== "" ? {display: 'block'} : {display: 'none'}}>
                                                {this.state.error.kcp}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Poin</label>
                                            <input type="text" className="form-control" name="poin" value={this.state.poin} onChange={(e)=>this.handleChange(e,null)} required/>
                                            <div className="invalid-feedback"
                                                 style={this.state.error.poin !== "" ? {display: 'block'} : {display: 'none'}}>
                                                {this.state.error.poin}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Status Barang</label>
                                            <select name="online" className="form-control form-control-lg" value={this.state.online} onChange={(e)=>this.handleChange(e,null)}>
                                                <option value="">Pilih Status</option>
                                                <option value="0">Offline</option>
                                                <option value="1">Online</option>
                                            </select>
                                            <div className="invalid-feedback"
                                                 style={this.state.error.online !== "" ? {display: 'block'} : {display: 'none'}}>
                                                {this.state.error.online}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Berat</label>
                                            <input type="text" className="form-control" name="berat" value={this.state.berat} onChange={(e)=>this.handleChange(e,null)} required/>
                                            <div className="invalid-feedback"
                                                 style={this.state.error.berat !== "" ? {display: 'block'} : {display: 'none'}}>
                                                {this.state.error.berat}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div className="row">
                                    <div className="col-md-12">
                                        <table className="table table-hover">
                                            <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Barcode</th>
                                                <th>Satuan</th>
                                                <th>Konversi Qty</th>
                                                <th>Tampilkan di POS ?</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {(()=>{
                                                let container =[];
                                                for(let x=0; x<this.state.barangSku.length; x++){
                                                    let satuan=(x===0)?"Pcs":(x===1?"Pack":"Karton");
                                                    container.push(
                                                        <tr key={x}>
                                                            <td>
                                                                {x+1}
                                                            </td>
                                                            <td>
                                                                <input readOnly={this.props.dataEdit===undefined?false:true} type="text" className="form-control" name="barcode" id={`${x===0?'barcode1':(x===1?'barcode2':'barcode3')}`} value={this.state.barangSku[x].barcode} onChange={(e)=>this.handleChange(e,x)} onBlur={(e)=>this.checkData(e,x)} required/>
                                                                {
                                                                    x===0?this.state.error_barcode1===true?(
                                                                        <small style={{color:"red",fontWeight:"bold"}}>{this.state.pesan_barcode1}</small>
                                                                    ):"":""
                                                                }
                                                                {
                                                                    x===1?this.state.error_barcode2===true?(
                                                                        <small style={{color:"red",fontWeight:"bold"}}>{this.state.pesan_barcode2}</small>
                                                                    ):"":""
                                                                }
                                                                {
                                                                    x===2?this.state.error_barcode3===true?(
                                                                        <small style={{color:"red",fontWeight:"bold"}}>{this.state.pesan_barcode3}</small>
                                                                    ):"":""
                                                                }

                                                                {/*<small>{this.props.checkBarcode1 === true ? "barcode 1 sudah digunakan" : (this.props.checkBarcode2 === true ? "barcode 2 sudah digunakan" : this.props.checkBarcode3 === true ? "barcode 3 sudah digunakan" : "")}</small>*/}
                                                            </td>
                                                            <td>
                                                                <input type="text" className="form-control" name="qty" value={this.state.barangSku[x].qty} onChange={(e)=>this.handleChange(e,x)} required/>
                                                            </td>
                                                            <td>
                                                                <input readOnly={x===0?true:false} type="text" className="form-control" name="konversi" value={this.state.barangSku[x].konversi} onChange={(e)=>this.handleChange(e,x)} required/>
                                                            </td>
                                                            <td>
                                                                <select name="satuan_jual" id="satuan_jual" className="form-control" value={this.state.barangSku[x].satuan_jual} defaultValue={this.state.barangSku[x].satuan_jual} onChange={(e)=>this.handleChange(e,x)}>
                                                                    <option value="">Pilih Opsi</option>
                                                                    <option value="1">Tampilkan</option>
                                                                    <option value="0">Sembunyikan</option>
                                                                </select>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                                return container;
                                            })()}
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="row">
                                            <div className="col-md-2">
                                                <label style={{fontSize:"10px"}}>Lokasi</label>
                                            </div>
                                            <div className="col-md-10">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="row">
                                                            <div className="col-md-4">
                                                                <label className="control-label" style={{fontSize:"10px"}}>Harga Beli</label>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <label className="control-label" style={{fontSize:"10px"}}>Margin %</label>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <label className="control-label" style={{fontSize:"10px"}}>Harga Jual</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="row">
                                                            <div className="col-md-3">
                                                                <label className="control-label" style={{fontSize:"10px"}}>Service %</label>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <label className="control-label" style={{fontSize:"10px"}}>PPN %</label>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>

                                            </div>
                                            {/*END LABEL*/}
                                            <div className="col-md-12">
                                                <hr/>
                                            </div>
                                            {/*ATUR SEMUA*/}
                                            {/*DIDIEU*/}
                                            {(()=>{
                                                let container =[];
                                                for(let i=0; i<this.state.barangSku.length; i++){
                                                    let lbl=this.state.barangSku[i].qty;
                                                    let stateHargaBeli = i===0?'hrg_beli':(i===1?'hrg_beli_pack':'hrg_beli_karton');
                                                    let stateService = i===0?'service':(i===1?'service_pack':'service_karton');
                                                    let statePpn = i===0?'ppn':(i===1?'ppn_pack':'ppn_karton');
                                                    let satuan;
                                                    if(i===0){
                                                        satuan='Pcs';
                                                    }
                                                    if(i===1){
                                                        satuan='Pack';
                                                    }
                                                    if(i===2){
                                                        satuan='Karton';
                                                    }

                                                    container.push(
                                                        <div className="col-md-12">
                                                            <div className="row" key={i}>
                                                                <div className="col-md-2">
                                                                    <div className="form-group">
                                                                        <div className="row">
                                                                            <label className="col-md-8"  style={{fontSize:"10px"}}>Atur Semua ({lbl})</label>
                                                                            <input type="checkbox" className="form-control col-md-2" onChange={(e)=>this.handleAllCheckedSku(e,i,satuan.toUpperCase())}/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-10">
                                                                    <div className="row">
                                                                        <div className="col-md-6">
                                                                            <div className="row">
                                                                                <div className="col-md-4">
                                                                                    <div className="form-group">
                                                                                        <label style={{fontSize:"8px"}}>harga beli ({lbl})</label>
                                                                                        <input type="number" placeholder={`hrg beli ${lbl}`} className="form-control" name={stateHargaBeli} value={this.state[stateHargaBeli]} onChange={(e)=>this.handleChangeMore(e)} style={{fontSize:"10px"}}/>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-4">
                                                                                    {
                                                                                        (()=>{
                                                                                            let containers =[];
                                                                                            for(let z=0; z<this.state.set_harga; z++){
                                                                                                let stateMargin = i===0?`margin${z+1}`:(i===1?`margin${z+1}_pack`:`margin${z+1}_karton`);
                                                                                                containers.push(
                                                                                                    <div className="form-group">
                                                                                                        <label style={{fontSize:"8px"}}>margin {z+1} {lbl}</label>
                                                                                                        <input readOnly={this.state.jenis==='4'?true:false} type="number" placeholder={`margin ${z+1} ${lbl}`} className="form-control" name={stateMargin} value={this.state[stateMargin]} onChange={(e)=>this.handleChangeMore(e)}  style={{fontSize:"10px"}}/>
                                                                                                    </div>
                                                                                                )
                                                                                            }
                                                                                            return containers;
                                                                                        })()
                                                                                    }
                                                                                </div>
                                                                                <div className="col-md-4">
                                                                                    {
                                                                                        (()=>{
                                                                                            let containers =[];
                                                                                            for(let z=0; z<this.state.set_harga; z++){
                                                                                                let place=`nm_harga${z+1}`;
                                                                                                let stateHargaJual = i===0?`hrgjual${z+1}`:(i===1?`hrgjual${z+1}_pack`:`hrgjual${z+1}_karton`);
                                                                                                containers.push(
                                                                                                    <div className="form-group">
                                                                                                        <label style={{fontSize:"8px"}}>harga jual {this.state[place]}</label>
                                                                                                        <input readOnly={this.state.jenis==='4'?true:false} type="number" placeholder={`hrg jual ${this.state[place]} ${lbl}`} className="form-control" name={stateHargaJual} value={this.state[stateHargaJual]} onChange={(e)=>this.handleChangeMore(e)} style={{fontSize:"10px"}}/>
                                                                                                    </div>
                                                                                                )

                                                                                            }
                                                                                            return containers;
                                                                                        })()
                                                                                    }


                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                        {/*service,ppn,stock min,stock max */}
                                                                        <div className="col-md-6">
                                                                            <div className="row">
                                                                                <div className="col-md-3">
                                                                                    <div className="form-group">
                                                                                        <label style={{fontSize:"8px"}}>service {lbl}</label>
                                                                                        <input readOnly={this.state.jenis==='4'?true:false} type="number" placeholder={`service ${lbl}`} className="form-control" name={stateService} value={this.state[stateService]} onChange={(e)=>this.handleChangeMore(e)} style={{fontSize:"10px"}}/>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-3 text-center">
                                                                                    <div className="form-group">
                                                                                        <label style={{fontSize:"8px"}}>PPN {lbl}</label>
                                                                                        <input readOnly={this.state.jenis==='4'?true:false} type="number" placeholder={`ppn ${lbl}`} className="form-control" name={statePpn} value={this.state[statePpn]} onChange={(e)=>this.handleChangeMore(e)} style={{fontSize:"10px"}}/>
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    )
                                                }
                                                return container;
                                            })()}
                                            {/*END ATUR SEMUA*/}
                                            <div className="col-md-12">
                                                <hr/>
                                            </div>
                                            <div className="col-md-12">
                                                <hr/>
                                            </div>

                                            {
                                                this.state.barangHarga.map((v,i)=>{
                                                    console.log(v);
                                                    return (
                                                        <div className="col-md-12" key={i}>
                                                            {
                                                                (()=>{
                                                                    let containers =[];
                                                                    for(let x=0; x<this.state.barangSku.length; x++){
                                                                        let satuan = '',checked;
                                                                        let lbl=this.state.barangSku[x].qty;
                                                                        let isReadonly='isReadonly';
                                                                        let hargaBeli,nameHargaBeli='hrgBeli';
                                                                        let service,serviceName='service';
                                                                        let ppn,ppnName='ppn';
                                                                        if(x===0){
                                                                            satuan='Pcs';
                                                                            checked=v[x].isCheckedPCS;
                                                                            hargaBeli=v[x].hrgBeliPCS;nameHargaBeli+=`PCS`;isReadonly+=``;
                                                                            service=v[x].servicePCS;
                                                                            ppn=v[x].ppnPCS;
                                                                            serviceName+='PCS';
                                                                            ppnName+='PCS';
                                                                        }
                                                                        if(x===1){
                                                                            satuan='Pack';
                                                                            checked=v[x].isCheckedPACK;hargaBeli=v[x].hrgBeliPACK;nameHargaBeli+=`PACK`;isReadonly+=`Pack`;
                                                                            service=v[x].servicePACK;ppn=v[x].ppnPACK;
                                                                            serviceName+='PACK';
                                                                            ppnName+='PACK';
                                                                        }
                                                                        if(x===2){
                                                                            satuan='Karton';
                                                                            checked=v[x].isCheckedKARTON;hargaBeli=v[x].hrgBeliKARTON;nameHargaBeli+=`KARTON`;isReadonly+=`Karton`;
                                                                            service=v[x].serviceKARTON;ppn=v[x].ppnKARTON;
                                                                            serviceName+='KARTON';
                                                                            ppnName+='KARTON';
                                                                        }
                                                                        containers.push(
                                                                            <div className="row">
                                                                                <div className="col-md-2">
                                                                                    <div className="form-group">
                                                                                        <div className="row">
                                                                                            <label className="col-md-8"  style={{fontSize:"10px"}}> {v[x].nama_toko} ( {lbl} )</label>
                                                                                            <input type="checkbox" name="lokasi" value={v[x].lokasi} checked={checked} onChange={(e)=>this.handleCheckChieldElementSku(e,i)}/>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-md-10">
                                                                                    <div className="row">
                                                                                        <div className="col-md-6">
                                                                                            <div className="row">
                                                                                                <div className="col-md-4">
                                                                                                    <div className="form-group">
                                                                                                        <label style={{fontSize:"8px"}}>harga beli </label>
                                                                                                        <input readOnly={localStorage.getItem(`${isReadonly}`)==='true'?true:false} type="number" placeholder="hrg beli" className="form-control" name={nameHargaBeli} value={hargaBeli}  onChange={(e)=>this.onHandleChangeChildSku(e,i,x,satuan)} style={{fontSize:"10px"}}/>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-md-4">
                                                                                                    {
                                                                                                        (()=>{
                                                                                                            let container =[];
                                                                                                            for(let z=0; z<this.state.set_harga; z++){
                                                                                                                let marginName;
                                                                                                                if(x===0){
                                                                                                                    marginName=`margin${z+1}PCS`;
                                                                                                                }
                                                                                                                if(x===1){
                                                                                                                    marginName=`margin${z+1}PACK`;
                                                                                                                }
                                                                                                                if(x===2){
                                                                                                                    marginName=`margin${z+1}KARTON`;
                                                                                                                }

                                                                                                                let marginValue=v[x][marginName];
                                                                                                                container.push(
                                                                                                                    <div className="form-group">
                                                                                                                        <label style={{fontSize:"8px"}}>margin {z+1}</label>
                                                                                                                        <input readOnly={this.state.jenis==='4'?true:localStorage.getItem(`${isReadonly}`)==="true"?true:false} type="number" placeholder={`margin ${z+1}`} className="form-control" name={marginName} onChange={(e)=>this.onHandleChangeChildSku(e,i,x,satuan)} value={marginValue} style={{fontSize:"10px"}}/>
                                                                                                                    </div>

                                                                                                                )
                                                                                                            }
                                                                                                            return container;
                                                                                                        })()
                                                                                                    }

                                                                                                </div>
                                                                                                <div className="col-md-4">
                                                                                                    {
                                                                                                        (()=>{
                                                                                                            let container =[];
                                                                                                            for(let z=0; z<this.state.set_harga; z++){
                                                                                                                let place=`nm_harga${z+1}`;
                                                                                                                // let nama=`hrgJual${z+1}PACK`;
                                                                                                                let hrgName=`hrgJual${z+1}${satuan!==undefined?satuan.toUpperCase():''}`;
                                                                                                                let hrg=`hrgJual${z+1}${satuan!==undefined?satuan.toUpperCase():''}`;
                                                                                                                let hrgValue=v[x][hrg];
                                                                                                                container.push(
                                                                                                                    <div className="form-group">
                                                                                                                        <label style={{fontSize:"8px"}}>harga jual {this.state[place]}</label>
                                                                                                                        <input readOnly={this.state.jenis==='4'?true:localStorage.getItem(`${isReadonly}`)==="true"?true:false} type="number" placeholder={`hrg jual ${this.state[place]}`} className="form-control" name={hrgName} onChange={(e)=>this.onHandleChangeChildSku(e,i,x,satuan)} value={hrgValue} style={{fontSize:"10px"}}/>
                                                                                                                    </div>
                                                                                                                )
                                                                                                            }
                                                                                                            return container;
                                                                                                        })()
                                                                                                    }


                                                                                                </div>

                                                                                            </div>
                                                                                        </div>
                                                                                        {/*service,ppn,stock min,stock max */}
                                                                                        <div className="col-md-6">
                                                                                            <div className="row">
                                                                                                <div className="col-md-3">
                                                                                                    <div className="form-group">
                                                                                                        <label style={{fontSize:"8px"}}>service</label>
                                                                                                        <input readOnly={this.state.jenis==='4'?true:localStorage.getItem(`${isReadonly}`)==='true'?true:false} type="number" placeholder="service" className="form-control" name={serviceName} value={service} onChange={(e)=>this.onHandleChangeChildSku(e,i,x,satuan)} style={{fontSize:"10px"}}/>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-md-3">
                                                                                                    <div className="form-group">
                                                                                                        <label style={{fontSize:"8px"}}>PPN</label>
                                                                                                        <input readOnly={this.state.jenis==='4'?true:localStorage.getItem(`${isReadonly}`)==='true'?true:false} type="number" placeholder="PPN" className="form-control" name={ppnName} value={ppn} onChange={(e)=>this.onHandleChangeChildSku(e,i,x,satuan)} style={{fontSize:"10px"}}/>
                                                                                                    </div>
                                                                                                </div>

                                                                                            </div>
                                                                                        </div>

                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                        )

                                                                    }
                                                                    return containers;
                                                                })()
                                                            }


                                                            <hr/>

                                                        </div>
                                                    )
                                                })
                                            }
                                            {/*END DYNAMIC  */}


                                        </div>

                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group" style={{textAlign:"right"}}>
                                            <button type="button" className="btn btn-warning mb-2 mr-2" onClick={this.toggle}><i className="ti-close" /> Cancel</button>
                                            <button type="submit" className="btn btn-primary mb-2 mr-2" ><i className="ti-save" /> Simpan</button>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                        </Tabs>

                    </ModalBody>
                </form>

            </WrapperModal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
        location:state.locationReducer.data,
        checkKodeBarang: state.siteReducer.check,
        checkBarcode1: state.siteReducer.check,
        isLoadingCheck: state.siteReducer.isLoading,
        auth: state.auth

        // group:state.groupProductReducer.data
    }
}
export default connect(mapStateToProps)(FormProduct);
