import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalHeader} from "reactstrap";
import connect from "react-redux/es/connect/connect";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {stringifyFormData} from "helper";
import {setProductEdit,createProduct,updateProduct} from "redux/actions/masterdata/product/product.action";
import {FetchProductCode} from "redux/actions/masterdata/product/product.action";
import NumberFormat from 'react-number-format';
import {FetchCheck, setCheck, setLoading} from "redux/actions/site.action";
import axios from "axios";
import {HEADERS} from "redux/actions/_constants";

class FormProduct extends Component{
    constructor(props){
        super(props);
        this.state = {
            isShowFinish: false,
            isCustomizeVisible: true,
            selectedOption: null,
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
            kel_brg: '',
            stock: '0',
            kategori: '',
            stock_min: '0',
            group1: '',
            group2: '',
            deskripsi: '-',
            gambar: '',
            jenis: '',
            kcp: '',
            poin: '0',
            online: '0',
            berat: '0',
            barangSku: [{"barcode": "", "qty": "", "konversi": "", "satuan_jual": ""}],
            barangHargaEdit: [[
                {
                    "nama_toko":"","lokasi":"",
                    "isCheckedPCS":false,
                    "hrgBeliPCS": 0,
                    "margin1PCS":0,"margin2PCS":0,"margin3PCS":0,"margin4PCS":0,
                    "hrgJual1PCS":0,"hrgJual2PCS":0,"hrgJual3PCS":0,"hrgJual4PCS":0,
                    "ppnPCS": 0,
                    "servicePCS":0
                },
                {
                    "nama_toko":"","lokasi":"",
                    "isCheckedPACK":false,
                    "hrgBeliPACK":0,
                    "margin1PACK":0,"margin2PACK":0,"margin3PACK":0,"margin4PACK":0,
                    "hrgJual1PACK":0,"hrgJual2PACK":0,"hrgJual3PACK":0,"hrgJual4PACK":0,
                    "ppnPACK": 0,
                    "servicePACK":0
                },
                {
                    "nama_toko":"","lokasi":"",
                    "isCheckedKARTON":false,
                    "hrgBeliKARTON":0,
                    "margin1KARTON":0,"margin2KARTON":0,"margin3KARTON":0,"margin4KARTON":0,
                    "hrgJual1KARTON":0,"hrgJual2KARTON":0,"hrgJual3KARTON":0,"hrgJual4KARTON":0,
                    "ppnKARTON":0,
                    "serviceKARTON":0
                }
            ]],
            barangHarga: [[
                {
                    "nama_toko":"","lokasi":"",
                    "isCheckedPCS":false,
                    "hrgBeliPCS": 0,
                    "margin1PCS":0,"margin2PCS":0,"margin3PCS":0,"margin4PCS":0,
                    "hrgJual1PCS":0,"hrgJual2PCS":0,"hrgJual3PCS":0,"hrgJual4PCS":0,
                    "ppnPCS": 0,
                    "servicePCS":0
                },
                {
                    "nama_toko":"","lokasi":"",
                    "isCheckedPACK":false,
                    "hrgBeliPACK":0,
                    "margin1PACK":0,"margin2PACK":0,"margin3PACK":0,"margin4PACK":0,
                    "hrgJual1PACK":0,"hrgJual2PACK":0,"hrgJual3PACK":0,"hrgJual4PACK":0,
                    "ppnPACK": 0,
                    "servicePACK":0
                },
                {
                    "nama_toko":"","lokasi":"",
                    "isCheckedKARTON":false,
                    "hrgBeliKARTON":0,
                    "margin1KARTON":0,"margin2KARTON":0,"margin3KARTON":0,"margin4KARTON":0,
                    "hrgJual1KARTON":0,"hrgJual2KARTON":0,"hrgJual3KARTON":0,"hrgJual4KARTON":0,
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
            hrg_beli: '',
            hrg_beli_pack: '',
            hrg_beli_karton: '',
            margin1: '', margin2: '', margin3: '', margin4: '',
            margin1_pack: '', margin2_pack: '', margin3_pack: '', margin4_pack: '',
            margin1_karton: '', margin2_karton: '', margin3_karton: '', margin4_karton: '',
            hrgjual1: '', hrgjual2: '', hrgjual3: '', hrgjual4: '',
            hrgjual1_pack: '', hrgjual2_pack: '', hrgjual3_pack: '', hrgjual4_pack: '',
            hrgjual1_karton: '', hrgjual2_karton: '', hrgjual3_karton: '', hrgjual4_karton: '',
            service: '', service_pack: '', service_karton: '',
            ppn: '', ppn_pack: '', ppn_karton: '',

            hrgBeliPACK: 0,
            margin1PACK: 0, margin2PACK: 0, margin3PACK: 0, margin4PACK: 0,
            hrgJual1PACK: 0, hrgJual2PACK: 0, hrgJual3PACK: 0, hrgJual4PACK: 0,
            servicePACK: 0, ppnPACK: 0,

            hrgBeliKARTON: 0,
            margin1KARTON: 0, margin2KARTON: 0, margin3KARTON: 0, margin4KARTON: 0,
            hrgJual1KARTON: 0, hrgJual2KARTON: 0, hrgJual3KARTON: 0, hrgJual4KARTON: 0,
            serviceKARTON: 0, ppnKARTON: 0,
            purchasePrice: {},
            generateCode:false,
            codeServer:0,

        };
        this.handleChange = this.handleChange.bind(this);
        this.onHandleChangeChild = this.onHandleChangeChild.bind(this);
        this.onHandleChangeChildPack = this.onHandleChangeChildPack.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.generateCode = this.generateCode.bind(this);
        this.checkData = this.checkData.bind(this);
    }
    generateCode(e){
        this.setState({generateCode: e.target.checked,});
        if(e.target.checked === true){
            console.log(this.state.codeServer);
            this.state.kd_brg = this.state.codeServer;
            this.props.dispatch(FetchCheck({
                table: 'barang',
                kolom: 'kd_brg',
                value: this.state.codeServer
            }));
            let err = this.state.error;
            err = Object.assign({}, err, {kd_brg:""});
            this.setState({error: err});
        }else{
            this.state.kd_brg = "";
        }
        console.log(e.target.checked);
    }
    toggle = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(setProductEdit([]));
        this.setState({

        })
    };

    componentWillReceiveProps(nextProps){
        console.log("componentWillReceiveProps",nextProps);
        // localStorage.setItem("isReadonlySama","false");
        // localStorage.setItem("isReadonlySamaPack","false");
        // localStorage.setItem("isReadonlySamaKarton","false");
        this.state.codeServer = nextProps.productCode;

        if(nextProps.dataEdit !== undefined && nextProps.dataEdit !== []){
            console.log("########################## EDIT ############################");
            let barang_sku = typeof nextProps.dataEdit.barang_sku === 'object' ? nextProps.dataEdit.barang_sku : this.state.barangSku;
            let barang_hrg = typeof nextProps.dataEdit.barang_hrg === 'object' ? nextProps.dataEdit.barang_hrg : this.state.barangHarga;
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
               if(barang_sku.length == 3){
                   barangHrg.push(
                       [
                           {
                               "nama_toko":barang_hrg[x][0].nama_toko,"lokasi":barang_hrg[x][0].lokasi,
                               "isCheckedPCS":true,
                               "hrgBeliPCS": barang_hrg[x][0].harga_beli,
                               "margin1PCS":((parseInt(barang_hrg[x][0].harga)-parseInt(barang_hrg[x][0].harga_beli))/parseInt(barang_hrg[x][0].harga_beli))*100,
                               "margin2PCS":((parseInt(barang_hrg[x][0].harga2)-parseInt(barang_hrg[x][0].harga_beli))/parseInt(barang_hrg[x][0].harga_beli))*100,
                               "margin3PCS":((parseInt(barang_hrg[x][0].harga3)-parseInt(barang_hrg[x][0].harga_beli))/parseInt(barang_hrg[x][0].harga_beli))*100,
                               "margin4PCS":((parseInt(barang_hrg[x][0].harga4)-parseInt(barang_hrg[x][0].harga_beli))/parseInt(barang_hrg[x][0].harga_beli))*100,
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
               }else{
                   barangHrg.push(
                       [
                           {
                               "nama_toko":barang_hrg[x][0].nama_toko,"lokasi":barang_hrg[x][0].lokasi,
                               "isCheckedPCS":true,
                               "hrgBeliPCS": barang_hrg[x][0].harga_beli,
                               "margin1PCS":((parseInt(barang_hrg[x][0].harga)-parseInt(barang_hrg[x][0].harga_beli))/parseInt(barang_hrg[x][0].harga_beli))*100,
                               "margin2PCS":((parseInt(barang_hrg[x][0].harga2)-parseInt(barang_hrg[x][0].harga_beli))/parseInt(barang_hrg[x][0].harga_beli))*100,
                               "margin3PCS":((parseInt(barang_hrg[x][0].harga3)-parseInt(barang_hrg[x][0].harga_beli))/parseInt(barang_hrg[x][0].harga_beli))*100,
                               "margin4PCS":((parseInt(barang_hrg[x][0].harga4)-parseInt(barang_hrg[x][0].harga_beli))/parseInt(barang_hrg[x][0].harga_beli))*100,
                               "hrgJual1PCS":barang_hrg[x][0].harga,"hrgJual2PCS":barang_hrg[x][0].harga2,"hrgJual3PCS":barang_hrg[x][0].harga3,"hrgJual4PCS":barang_hrg[x][0].harga4,
                               "ppnPCS": barang_hrg[x][0].ppn,
                               "servicePCS": barang_hrg[x][0].service
                           }
                       ]
                   )
               }

            }
            this.setState({
                kd_brg: nextProps.dataEdit.kd_brg,
                nm_brg: nextProps.dataEdit.nm_brg,
                kel_brg: nextProps.dataEdit.kel_brg,
                jenis:nextProps.dataEdit.kategori,
                stock_min:nextProps.dataEdit.stock_min,
                group1:nextProps.dataEdit.group1,
                group2:nextProps.dataEdit.group2,
                deskripsi:nextProps.dataEdit.deskripsi,
                gambar:"",
                kategori:nextProps.dataEdit.jenis,
                kcp:nextProps.dataEdit.kcp,
                poin:nextProps.dataEdit.poin,
                online:nextProps.dataEdit.online,
                berat:nextProps.dataEdit.berat,
                barangSku:barangSku,
                barangHarga:barangHrg
            })
        }else{
            console.log("########################## ADD ############################");

            const {data} = nextProps.dataLocation;
            console.log("DATA",data);
            this.state.check = nextProps.dataLocation;
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
                                "hrgBeliPCS": "0",
                                "margin1PCS":"0","margin2PCS":"0","margin3PCS":"0","margin4PCS":"0",
                                "hrgJual1PCS":"0","hrgJual2PCS":"0","hrgJual3PCS":"0","hrgJual4PCS":"0",
                                "ppnPCS": "0",
                                "servicePCS": "0"
                            },
                            {
                                "nama_toko":v.nama_toko,"lokasi": v.kode,
                                "isCheckedPACK":false,
                                "hrgBeliPACK": "0",
                                "margin1PACK":"0","margin2PACK":"0","margin3PACK":"0","margin4PACK":"0",
                                "hrgJual1PACK":"0","hrgJual2PACK":"0","hrgJual3PACK":"0","hrgJual4PACK":"0",
                                "ppnPACK": "0",
                                "servicePACK": "0"
                            },
                            {
                                "nama_toko":v.nama_toko,"lokasi": v.kode,
                                "isCheckedKARTON":false,
                                "hrgBeliKARTON": "0",
                                "margin1KARTON":"0","margin2KARTON":"0","margin3KARTON":"0","margin4KARTON":"0",
                                "hrgJual1KARTON":"0","hrgJual2KARTON":"0","hrgJual3KARTON":"0","hrgJual4KARTON":"0",
                                "ppnKARTON": "0",
                                "serviceKARTON": "0"
                            }
                        ]
                    )
                });
                console.log("ABRANG PUSH",brgHrg);
                this.setState({
                    barangHarga:brgHrg
                });
            }
        }

        // this.setState({barangHrg:brgHrg});
    }
    // onHandleChangeChild
    async fetchData(data){
        const url = HEADERS.URL + `site/cekdata`;
        return await axios.post(url, data)
            .then(function (response) {
                const data = response.data;
                console.log(data);
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
        // this.setState({ [event.target.name]: event.target.value});

        if(event.target.id==='barcode1'){
            const data = this.fetchData({
                table: 'barang_sku',
                kolom: 'barcode',
                value: val
            });
            data.then(res=>{
                console.log("IEU RES",res);
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
                    // if(this.state.barangSku[0].barcode===this.state.barangSku[1].barcode){
                    //     this.setState({
                    //         error_barcode1:true,
                    //         pesan_barcode1:"barcode 1 dan 2 tidak boleh sama"
                    //     })
                    // }
                    // if(this.state.barangSku[0].barcode===this.state.barangSku[2].barcode){
                    //     this.setState({
                    //         error_barcode1:true,
                    //         pesan_barcode1:"barcode 1 dan 3 tidak boleh sama"
                    //     })
                    // }
                }
            });

            // console.log("")

        }
        if(event.target.id==='barcode2'){
            const data = this.fetchData({
                table: 'barang_sku',
                kolom: 'barcode',
                value: val
            });
            data.then(res=>{
                console.log("IEU RES",res);
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
            // if(this.state.barangSku[1].barcode===this.state.barangSku[0].barcode){
            //     this.setState({
            //         error_barcode2:true,
            //         pesan_barcode2:"barcode 2 dan 1 tidak boleh sama"
            //     })
            //
            // }
            // if(this.state.barangSku[1].barcode===this.state.barangSku[2].barcode){
            //     this.setState({
            //         error_barcode2:true,
            //         pesan_barcode2:"barcode 2 dan 3 tidak boleh sama"
            //     })
            // }
        }
        if(event.target.id==='barcode3'){
            const data = this.fetchData({
                table: 'barang_sku',
                kolom: 'barcode',
                value: val
            });
            data.then(res=>{
                console.log("IEU RES",res);
                if(res.result===1){
                    this.setState({
                        error_barcode3:true,
                        pesan_barcode3:"barcode sudah digunakan"
                    })
                }else{
                    this.setState({error_barcode3:false,pesan_barcode3:""})
                }
            });
            // if(this.state.barangSku[2].barcode===this.state.barangSku[0].barcode){
            //     this.setState({
            //         error_barcode3:true,
            //         pesan_barcode3:"barcode 3 dan 1 tidak boleh sama"
            //     })
            // }
            // if(this.state.barangSku[2].barcode===this.state.barangSku[1].barcode){
            //     this.setState({
            //         error_barcode3:true,
            //         pesan_barcode3:"barcode 3 dan 2 tidak boleh sama"
            //     })
            // }

        }

    }
    handleChange(event,i){
        let name = event.target.name;
        let val = event.target.value;
        let hrg_jual_1_pcs = 0;let margin1_pcs=0;
        let hrg_jual_2_pcs = 0;let margin2_pcs=0;
        let hrg_jual_3_pcs = 0;let margin3_pcs=0;
        let hrg_jual_4_pcs = 0;let margin4_pcs=0;
        // this.setState({
        //     kd_brg: event.target.value,
        //     error: event.target.validationMessage
        // });
        this.setState({ [event.target.name]: event.target.value});
        let err = Object.assign({}, this.state.error, {
            [name]: ""
        });
        this.setState({
            error: err
        });
        if(name==='kd_brg'){
            this.props.dispatch(FetchCheck({
                table: 'barang',
                kolom: 'kd_brg',
                value: val
            }));
        }
        if(i!==null){
            console.log("ID",event.target.id);
            let barangSku = [...this.state.barangSku];
            barangSku[i] = {...barangSku[i], [event.target.name]: event.target.value};
            this.setState({ barangSku });
            if(event.target.id==='barcode1'){
                if(barangSku[0].barcode===barangSku[1].barcode){
                    this.setState({
                        error_barcode1:true,
                        pesan_barcode1:"barcode 1 dan 2 tidak boleh sama"
                    })
                }else{
                    this.setState({
                        error_barcode1:false,
                        pesan_barcode1:""
                    })
                }
            }
            if(event.target.id==='barcode2'){
                if(barangSku[1].barcode===barangSku[0].barcode){
                    this.setState({
                        error_barcode2:true,
                        pesan_barcode2:"barcode 2 dan 1 tidak boleh sama"
                    })
                }else{
                    this.setState({
                        error_barcode2:false,
                        pesan_barcode2:""
                    })
                }
            }
        }

        if(event.target.name === 'jenis'){
            if(event.target.value === '0'){
                let brgSku = [];
                for(let i=0;i<3;i++){
                    brgSku.push({"barcode":"0","qty":"0","konversi":"0","satuan_jual":"0"})
                }
                this.setState({barangSku: brgSku});
                // this.state.barangSku.push({[event.target.name]:event.target.value});
            }
            else{
                // localStorage.setItem("colBrgSku","1");
                let brgSku = [];
                for(let i=0;i<1;i++){
                    brgSku.push({"barcode":"0","qty":"0","konversi":"0","satuan_jual":"0"})
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
            // localStorage.setItem("")
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
        //hrg beli = 5000*10/100
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
        //input margin = hrg_beli + hrg_beli*(10/100)
    }
    handleSelect = (index) => {
        let err = this.state.error;
        // if(this.state.kd_brg===''||this.state.kd_brg===undefined){
        //     err = Object.assign({}, err, {kd_brg:"kode barang tidak boleh kosong"});
        //     this.setState({error: err});
        //     return;
        // }
        // if(this.state.nm_brg===''||this.state.nm_brg===undefined){
        //     err = Object.assign({}, err, {nm_brg:"nama barang tidak boleh kosong"});
        //     this.setState({error: err});
        //     return;
        // }
        // if(this.state.kel_brg===''||this.state.kel_brg===undefined){
        //     err = Object.assign({}, err, {kel_brg:"kelompok barang tidak boleh kosong"});
        //     this.setState({error: err});
        //     return;
        // }
        // if(this.state.stock_min===''||this.state.stock_min===undefined){
        //     err = Object.assign({}, err, {stock_min:"Stock tidak boleh kosong"});
        //     this.setState({error: err});
        //     return;
        // }
        // if(this.state.group1===''||this.state.group1===undefined){
        //     err = Object.assign({}, err, {group1:"supplier tidak boleh kosong"});
        //     this.setState({error: err});
        //     return;
        // }
        // if(this.state.group2===''||this.state.group2===undefined){
        //     err = Object.assign({}, err, {group2:"sub dept tidak boleh kosong"});
        //     this.setState({error: err});
        //     return;
        // }
        // if(this.state.deskripsi===''||this.state.deskripsi===undefined){
        //     err = Object.assign({}, err, {deskripsi:"deskripsi tidak boleh kosong"});
        //     this.setState({error: err});
        //     return;
        // }
        // if(this.state.jenis===''||this.state.jenis===undefined){
        //     err = Object.assign({}, err, {jenis:"jenis tidak boleh kosong"});
        //     this.setState({error: err});
        //     return;
        // }
        // if(this.state.kcp===''||this.state.kcp===undefined){
        //     err = Object.assign({}, err, {kcp:"kcp tidak boleh kosong"});
        //     this.setState({error: err});
        //     return;
        // }
        // if(this.state.poin===''||this.state.poin===undefined){
        //     err = Object.assign({}, err, {poin:"poin tidak boleh kosong"});
        //     this.setState({error: err});
        //     return;
        // }
        // if(this.state.online===''||this.state.online===undefined){
        //     err = Object.assign({}, err, {online:"online tidak boleh kosong"});
        //     this.setState({error: err});
        //     return;
        // }
        // if(this.state.berat===''||this.state.berat===undefined){
        //     err = Object.assign({}, err, {berat:"berat tidak boleh kosong"});
        //     this.setState({error: err});
        //     return;
        // }
        for(let i=0;i<this.state.barangSku.length;i++){
            console.log("ISI BARCODE",this.state.barangSku[i].barcode);
            if(this.state.barangSku[i].barcode===""||this.state.barangSku[i].barcode===undefined){
                alert(`form barcode index ke ${i+1} tidak boleh kosong`);
                return;
            }
            if(this.state.barangSku[i].satuan_jual===""||this.state.barangSku[i].satuan_jual===undefined){
                alert(`form tampilkan di pos index ke ${i+1} tidak boleh kosong`);
                return;
            }

        }
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
        console.log(event.target.name);
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
    onHandleChangeChildPack(event,i){
        this.setState({ [event.target.name]: event.target.value });
        let qty_konversi=[];
        for(let i=0;i<this.state.barangSku.length;i++){
            qty_konversi.push(this.state.barangSku[i].konversi);
        }
        let barangHarga = [...this.state.barangHarga];
        if(event.target.name==="margin1PACK"){
            barangHarga[i][1] = {...barangHarga[i][1], [event.target.name]: event.target.value};
            barangHarga[i][1].hrgJual1PACK = parseInt(barangHarga[i][1].hrgBeliPACK) * (parseInt(event.target.value)/100) + parseInt(barangHarga[i][1].hrgBeliPACK);
            this.state.hrgJual1PACK = parseInt(barangHarga[i][1].hrgBeliPACK) * (parseInt(event.target.value)/100) + parseInt(barangHarga[i].hrgBeliPACK);
        }
        if(event.target.name==="margin2PACK"){
            barangHarga[i][1] = {...barangHarga[i][1], [event.target.name]: event.target.value};
            barangHarga[i][1].hrgJual2PACK = parseInt(barangHarga[i][1].hrgBeliPACK) * (parseInt(event.target.value)/100) + parseInt(barangHarga[i][1].hrgBeliPACK);
            this.state.hrgJual2PACK = parseInt(barangHarga[i][1].hrgBeliPACK) * (parseInt(event.target.value)/100) + parseInt(barangHarga[i][1].hrgBeliPACK);
        }
        if(event.target.name==="margin3PACK"){
            barangHarga[i][1] = {...barangHarga[i][1], [event.target.name]: event.target.value};
            barangHarga[i][1].hrgJual3PACK = parseInt(barangHarga[i][1].hrgBeliPACK) * (parseInt(event.target.value)/100) + parseInt(barangHarga[i][1].hrgBeliPACK);
            this.state.hrgJual3PACK = parseInt(barangHarga[i][1].hrgBeliPACK) * (parseInt(event.target.value)/100) + parseInt(barangHarga[i][1].hrgBeliPACK);
        }
        if(event.target.name==="margin4PACK"){
            barangHarga[i][1] = {...barangHarga[i][1], [event.target.name]: event.target.value};
            barangHarga[i][1].hrgJual4PACK = parseInt(barangHarga[i][1].hrgBeliPACK) * (parseInt(event.target.value)/100) + parseInt(barangHarga[i][1].hrgBeliPACK);
            this.state.hrgJual4PACK = parseInt(barangHarga[i][1].hrgBeliPACK) * (parseInt(event.target.value)/100) + parseInt(barangHarga[i][1].hrgBeliPACK);
        }
        if(event.target.name==="hrgJual1PACK"){
            barangHarga[i][1] = {...barangHarga[i][1], [event.target.name]: event.target.value};
            barangHarga[i][1].margin1PACK = ((parseInt(event.target.value)-parseInt(barangHarga[i][1].hrgBeliPACK))/parseInt(barangHarga[i][1].hrgBeliPACK))*100;
            this.state.margin1PACK = ((parseInt(event.target.value)-parseInt(barangHarga[i][1].hrgBeliPACK))/parseInt(barangHarga[i][1].hrgBeliPACK))*100;
        }
        if(event.target.name==="hrgJual2PACK"){
            barangHarga[i][1] = {...barangHarga[i][1], [event.target.name]: event.target.value};
            barangHarga[i][1].margin2PACK = ((parseInt(event.target.value)-parseInt(barangHarga[i][1].hrgBeliPACK))/parseInt(barangHarga[i][1].hrgBeliPACK))*100;
            this.state.margin2PACK = ((parseInt(event.target.value)-parseInt(barangHarga[i][1].hrgBeliPACK))/parseInt(barangHarga[i][1].hrgBeliPACK))*100;

        }
        if(event.target.name==="hrgJual3PACK"){
            barangHarga[i][1] = {...barangHarga[i][1], [event.target.name]: event.target.value};
            barangHarga[i][1].margin3PACK = ((parseInt(event.target.value)-parseInt(barangHarga[i][1].hrgBeliPACK))/parseInt(barangHarga[i][1].hrgBeliPACK))*100;
            this.state.margin3PACK = ((parseInt(event.target.value)-parseInt(barangHarga[i][1].hrgBeliPACK))/parseInt(barangHarga[i][1].hrgBeliPACK))*100;

        }
        if(event.target.name==="hrgJual4PACK"){
            barangHarga[i][1] = {...barangHarga[i][1], [event.target.name]: event.target.value};
            barangHarga[i][1].margin4PACK = ((parseInt(event.target.value)-parseInt(barangHarga[i][1].hrgBeliPACK))/parseInt(barangHarga[i][1].hrgBeliPACK))*100;
            this.state.margin4PACK = ((parseInt(event.target.value)-parseInt(barangHarga[i][1].hrgBeliPACK))/parseInt(barangHarga[i][1].hrgBeliPACK))*100;
        }
        if(event.target.name==="servicePACK"){
            barangHarga[i][1] = {...barangHarga[i][1], [event.target.name]: event.target.value};
            this.state.servicePACK = event.target.value;
        }
        if(event.target.name==="ppnPACK"){
            barangHarga[i][1] = {...barangHarga[i][1], [event.target.name]: event.target.value};
            this.state.ppnePACK = event.target.value;
        }
        this.setState({ barangHarga });
    }
    onHandleChangeChildKarton(event,i){
        this.setState({ [event.target.name]: event.target.value });
        let qty_konversi=[];
        for(let i=0;i<this.state.barangSku.length;i++){
            qty_konversi.push(this.state.barangSku[i].konversi);
        }
        let barangHarga = [...this.state.barangHarga];
        if(event.target.name==="margin1KARTON"){
            barangHarga[i][2] = {...barangHarga[i][2], [event.target.name]: event.target.value};
            barangHarga[i][2].hrgJual1KARTON = parseInt(barangHarga[i][2].hrgBeliKARTON) * (parseInt(event.target.value)/100) + parseInt(barangHarga[i][2].hrgBeliKARTON);
            this.state.hrgJual1KARTON = parseInt(barangHarga[i][2].hrgBeliKARTON) * (parseInt(event.target.value)/100) + parseInt(barangHarga[i][2].hrgBeliKARTON);
        }
        if(event.target.name==="margin2KARTON"){
            barangHarga[i][2] = {...barangHarga[i][2], [event.target.name]: event.target.value};
            barangHarga[i][2].hrgJual2KARTON = parseInt(barangHarga[i][2].hrgBeliKARTON) * (parseInt(event.target.value)/100) + parseInt(barangHarga[i][2].hrgBeliKARTON);
            this.state.hrgJual2KARTON = parseInt(barangHarga[i][2].hrgBeliKARTON) * (parseInt(event.target.value)/100) + parseInt(barangHarga[i][2].hrgBeliKARTON);
        }
        if(event.target.name==="margin3KARTON"){
            barangHarga[i][2] = {...barangHarga[i][2], [event.target.name]: event.target.value};
            barangHarga[i][2].hrgJual3KARTON = parseInt(barangHarga[i][2].hrgBeliKARTON) * (parseInt(event.target.value)/100) + parseInt(barangHarga[i][2].hrgBeliKARTON);
            this.state.hrgJual3KARTON = parseInt(barangHarga[i][2].hrgBeliKARTON) * (parseInt(event.target.value)/100) + parseInt(barangHarga[i][2].hrgBeliKARTON);
        }
        if(event.target.name==="margin4KARTON"){
            barangHarga[i][2] = {...barangHarga[i][2], [event.target.name]: event.target.value};
            barangHarga[i][2].hrgJual4KARTON = parseInt(barangHarga[i][2].hrgBeliKARTON) * (parseInt(event.target.value)/100) + parseInt(barangHarga[i][2].hrgBeliKARTON);
            this.state.hrgJual4KARTON = parseInt(barangHarga[i][2].hrgBeliKARTON) * (parseInt(event.target.value)/100) + parseInt(barangHarga[i][2].hrgBeliKARTON);
        }
        if(event.target.name==="hrgJual1KARTON"){
            barangHarga[i][2] = {...barangHarga[i][2], [event.target.name]: event.target.value};
            barangHarga[i][2].margin1KARTON = ((parseInt(event.target.value)-parseInt(barangHarga[i][2].hrgBeliKARTON))/parseInt(barangHarga[i][2].hrgBeliKARTON))*100;
            this.state.margin1KARTON = ((parseInt(event.target.value)-parseInt(barangHarga[i][2].hrgBeliKARTON))/parseInt(barangHarga[i][2].hrgBeliKARTON))*100;
        }
        if(event.target.name==="hrgJual2KARTON"){
            barangHarga[i][2] = {...barangHarga[i][2], [event.target.name]: event.target.value};
            barangHarga[i][2].margin2KARTON = ((parseInt(event.target.value)-parseInt(barangHarga[i][2].hrgBeliKARTON))/parseInt(barangHarga[i][2].hrgBeliKARTON))*100;
            this.state.margin2KARTON = ((parseInt(event.target.value)-parseInt(barangHarga[i][2].hrgBeliKARTON))/parseInt(barangHarga[i][2].hrgBeliKARTON))*100;

        }
        if(event.target.name==="hrgJual3KARTON"){
            barangHarga[i][2] = {...barangHarga[i][2], [event.target.name]: event.target.value};
            barangHarga[i][2].margin3KARTON = ((parseInt(event.target.value)-parseInt(barangHarga[i][2].hrgBeliKARTON))/parseInt(barangHarga[i][2].hrgBeliKARTON))*100;
            this.state.margin3KARTON = ((parseInt(event.target.value)-parseInt(barangHarga[i][2].hrgBeliKARTON))/parseInt(barangHarga[i][2].hrgBeliKARTON))*100;

        }
        if(event.target.name==="hrgJual4KARTON"){
            barangHarga[i][2] = {...barangHarga[i][2], [event.target.name]: event.target.value};
            barangHarga[i][2].margin4KARTON = ((parseInt(event.target.value)-parseInt(barangHarga[i][2].hrgBeliKARTON))/parseInt(barangHarga[i][2].hrgBeliKARTON))*100;
            this.state.margin4KARTON = ((parseInt(event.target.value)-parseInt(barangHarga[i][2].hrgBeliKARTON))/parseInt(barangHarga[i][2].hrgBeliKARTON))*100;
        }
        if(event.target.name==="serviceKARTON"){
            barangHarga[i][2] = {...barangHarga[i][2], [event.target.name]: event.target.value};
            this.state.serviceKARTON = event.target.value;
        }
        if(event.target.name==="ppnKARTON"){
            barangHarga[i][2] = {...barangHarga[i][2], [event.target.name]: event.target.value};
            this.state.ppneKARTON = event.target.value;
        }
        this.setState({ barangHarga });

    }
    handleAllChecked = (event) => {
        console.log(event.target.checked);
        let cik=[];
        event.target.checked===true?localStorage.setItem("isReadonly","true"):localStorage.setItem("isReadonly","false");
        console.log(this.state.barangHarga);
        for(let i=0;i<this.state.barangHarga.length;i++){
            this.state.barangHarga[i][0].isCheckedPCS = event.target.checked;
        }

        if(event.target.checked === true){
            localStorage.setItem("samarata","true");
        }else{
            localStorage.setItem("samarata","false");
        }
        console.log("DATA CIK",cik);
        this.setState({
            isChecked:event.target.checked,
        });
    };
    handleAllCheckedSku(event,i,lbl){
        console.log(event.target.checked);
        console.log(event.target.name);
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
    handleCheckChieldElementKarton(e,i){
        this.setState((state, props) => {
            state.barangHarga[i][2].isCheckedKARTON = !state.barangHarga[i][2].isCheckedKARTON;
            return {
                barangHarga: state.barangHarga
            }
        });
    }
    handleCheckChieldElementPack(e,i){
        this.setState((state, props) => {
            state.barangHarga[i][1].isCheckedPACK = !state.barangHarga[i][1].isCheckedPACK;
            return {
                barangHarga: state.barangHarga
            }
        });
    }
    handleCheckChieldElement = (i) => (event=>{
        this.setState((state, props) => {
            state.barangHarga[i][0].isCheckedPCS = !state.barangHarga[i][0].isCheckedPCS;
            return {
                barangHarga: state.barangHarga
            }
        });
    });
    handleChangeMore(e){
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
        if(localStorage.getItem("samarata_pack") === "true"){
            for(let i=0;i<this.state.barangHarga.length;i++){
                if(e.target.name==="hrg_beli_pack"){
                    this.state.barangHarga[i][1].hrgBeliPACK =  e.target.value;
                    this.state.hrgBeliPACK = e.target.value;
                }
                if(e.target.name==="margin1_pack"){
                    this.setState({
                        hrgjual1_pack:parseInt(this.state.hrg_beli_pack) * (parseInt(e.target.value)/100) + parseInt(this.state.hrg_beli_pack),
                        hrgJual1PACK:parseInt(this.state.hrg_beli_pack) * (parseInt(e.target.value)/100) + parseInt(this.state.hrg_beli_pack),
                        margin1PACK:e.target.value,
                    });
                    this.state.barangHarga[i][1].margin1PACK = e.target.value;
                    this.state.barangHarga[i][1].hrgJual1PACK = parseInt(this.state.hrg_beli_pack) * (parseInt(e.target.value)/100) + parseInt(this.state.hrg_beli_pack);
                }
                if(e.target.name==="margin2_pack"){
                    this.setState({
                        hrgjual2_pack:parseInt(this.state.hrg_beli_pack) * (parseInt(e.target.value)/100) + parseInt(this.state.hrg_beli_pack),
                        hrgJual2PACK:parseInt(this.state.hrg_beli_pack) * (parseInt(e.target.value)/100) + parseInt(this.state.hrg_beli_pack),
                        margin2PACK:e.target.value,
                    });
                    this.state.barangHarga[i][1].margin2PACK = e.target.value;
                    this.state.barangHarga[i][1].hrgJual2PACK = parseInt(this.state.hrg_beli_pack) * (parseInt(e.target.value)/100) + parseInt(this.state.hrg_beli_pack);                }
                if(e.target.name==="margin3_pack"){
                    this.setState({
                        hrgjual3_pack:parseInt(this.state.hrg_beli_pack) * (parseInt(e.target.value)/100) + parseInt(this.state.hrg_beli_pack),
                        hrgJual3PACK:parseInt(this.state.hrg_beli_pack) * (parseInt(e.target.value)/100) + parseInt(this.state.hrg_beli_pack),
                        margin3PACK:e.target.value,
                    });
                    this.state.barangHarga[i][1].margin3PACK = e.target.value;
                    this.state.barangHarga[i][1].hrgJual3PACK = parseInt(this.state.hrg_beli_pack) * (parseInt(e.target.value)/100) + parseInt(this.state.hrg_beli_pack);
                }
                if(e.target.name==="margin4_pack"){
                    this.setState({
                        hrgjual4_pack:parseInt(this.state.hrg_beli_pack) * (parseInt(e.target.value)/100) + parseInt(this.state.hrg_beli_pack),
                        hrgJual4PACK:parseInt(this.state.hrg_beli_pack) * (parseInt(e.target.value)/100) + parseInt(this.state.hrg_beli_pack),
                        margin4PACK:e.target.value,
                    });
                    this.state.barangHarga[i][1].margin4PACK = e.target.value;
                    this.state.barangHarga[i][1].hrgJual4PACK = parseInt(this.state.hrg_beli_pack) * (parseInt(e.target.value)/100) + parseInt(this.state.hrg_beli_pack);
                }
                if(e.target.name==="hrgjual1_pack"){
                    // this.state.barangHarga[i].hrgJual1PACK =  e.target.value;
                    this.setState({
                        margin1_pack:((parseInt(e.target.value)-parseInt(this.state.hrg_beli_pack))/parseInt(this.state.hrg_beli_pack))*100,
                        margin1PACK:((parseInt(e.target.value)-parseInt(this.state.hrg_beli_pack))/parseInt(this.state.hrg_beli_pack))*100,
                        hrgJual1PACK:e.target.value
                    });
                    this.state.barangHarga[i][1].margin1PACK = ((parseInt(e.target.value)-parseInt(this.state.hrg_beli_pack))/parseInt(this.state.hrg_beli_pack))*100;
                    this.state.barangHarga[i][1].hrgJual1PACK = e.target.value;
                    // margin4_pcs = ((parseInt(val)-parseInt(this.state.hrg_beli))/parseInt(this.state.hrg_beli))*100;
                }
                if(e.target.name==="hrgjual2_pack"){
                    this.setState({
                        margin2_pack:((parseInt(e.target.value)-parseInt(this.state.hrg_beli_pack))/parseInt(this.state.hrg_beli_pack))*100,
                        margin2PACK:((parseInt(e.target.value)-parseInt(this.state.hrg_beli_pack))/parseInt(this.state.hrg_beli_pack))*100,
                        hrgJual2PACK:e.target.value
                    });
                    this.state.barangHarga[i][1].margin2PACK = ((parseInt(e.target.value)-parseInt(this.state.hrg_beli_pack))/parseInt(this.state.hrg_beli_pack))*100;
                    this.state.barangHarga[i][1].hrgJual2PACK = e.target.value;
                }
                if(e.target.name==="hrgjual3_pack"){
                    this.setState({
                        margin3_pack:((parseInt(e.target.value)-parseInt(this.state.hrg_beli_pack))/parseInt(this.state.hrg_beli_pack))*100,
                        margin3PACK:((parseInt(e.target.value)-parseInt(this.state.hrg_beli_pack))/parseInt(this.state.hrg_beli_pack))*100,
                        hrgJual3PACK:e.target.value
                    });
                    this.state.barangHarga[i][1].margin3PACK = ((parseInt(e.target.value)-parseInt(this.state.hrg_beli_pack))/parseInt(this.state.hrg_beli_pack))*100;
                    this.state.barangHarga[i][1].hrgJual3PACK = e.target.value;
                }
                if(e.target.name==="hrgjual4_pack"){
                    this.setState({
                        margin4_pack:((parseInt(e.target.value)-parseInt(this.state.hrg_beli_pack))/parseInt(this.state.hrg_beli_pack))*100,
                        margin4PACK:((parseInt(e.target.value)-parseInt(this.state.hrg_beli_pack))/parseInt(this.state.hrg_beli_pack))*100,
                        hrgJual4PACK:e.target.value
                    });
                    this.state.barangHarga[i][1].margin4PACK = ((parseInt(e.target.value)-parseInt(this.state.hrg_beli_pack))/parseInt(this.state.hrg_beli_pack))*100;
                    this.state.barangHarga[i][1].hrgJual4PACK = e.target.value;
                }
                if(e.target.name==="service_pack"){
                    this.state.barangHarga[i][1].servicePACK =  e.target.value;
                    this.state.servicePACK = e.target.value;
                }
                if(e.target.name==="ppn_pack"){
                    this.state.barangHarga[i][1].ppnPACK =  e.target.value;
                    this.state.ppnPACK = e.target.value;
                }
            }
        }
        if(localStorage.getItem("samarata_karton") === "true"){
            for(let i=0;i<this.state.barangHarga.length;i++) {
                if (e.target.name === "hrg_beli_karton") {
                    this.state.barangHarga[i][2].hrgBeliKARTON = e.target.value;
                }
                if (e.target.name === "margin1_karton") {
                    this.setState({
                        hrgjual1_karton:parseInt(this.state.hrg_beli_karton) * (parseInt(e.target.value)/100) + parseInt(this.state.hrg_beli_karton),
                        hrgJual1KARTON:parseInt(this.state.hrg_beli_karton) * (parseInt(e.target.value)/100) + parseInt(this.state.hrg_beli_karton),
                        margin1KARTON:e.target.value
                    });
                    this.state.barangHarga[i][2].margin1KARTON = e.target.value;
                    this.state.barangHarga[i][2].hrgJual1KARTON = parseInt(this.state.hrg_beli_karton) * (parseInt(e.target.value)/100) + parseInt(this.state.hrg_beli_karton);
                }
                if (e.target.name === "margin2_karton") {
                    this.setState({
                        hrgjual2_karton:parseInt(this.state.hrg_beli_karton) * (parseInt(e.target.value)/100) + parseInt(this.state.hrg_beli_karton),
                        hrgJual2KARTON:parseInt(this.state.hrg_beli_karton) * (parseInt(e.target.value)/100) + parseInt(this.state.hrg_beli_karton),
                        margin2KARTON:e.target.value
                    });
                    this.state.barangHarga[i][2].margin2KARTON = e.target.value;
                    this.state.barangHarga[i][2].hrgJual2KARTON = parseInt(this.state.hrg_beli_karton) * (parseInt(e.target.value)/100) + parseInt(this.state.hrg_beli_karton);                }
                if (e.target.name === "margin3_karton") {
                    this.setState({
                        hrgjual3_karton:parseInt(this.state.hrg_beli_karton) * (parseInt(e.target.value)/100) + parseInt(this.state.hrg_beli_karton),
                        hrgJual3KARTON:parseInt(this.state.hrg_beli_karton) * (parseInt(e.target.value)/100) + parseInt(this.state.hrg_beli_karton),
                        margin3KARTON:e.target.value
                    });
                    this.state.barangHarga[i][2].margin3KARTON = e.target.value;
                    this.state.barangHarga[i][2].hrgJual3KARTON = parseInt(this.state.hrg_beli_karton) * (parseInt(e.target.value)/100) + parseInt(this.state.hrg_beli_karton);
                }
                if (e.target.name === "margin4_karton") {
                    this.setState({
                        hrgjual4_karton:parseInt(this.state.hrg_beli_karton) * (parseInt(e.target.value)/100) + parseInt(this.state.hrg_beli_karton),
                        hrgJual4KARTON:parseInt(this.state.hrg_beli_karton) * (parseInt(e.target.value)/100) + parseInt(this.state.hrg_beli_karton),
                        margin4KARTON:e.target.value
                    });
                    this.state.barangHarga[i][2].margin4KARTON = e.target.value;
                    this.state.barangHarga[i][2].hrgJual4KARTON = parseInt(this.state.hrg_beli_karton) * (parseInt(e.target.value)/100) + parseInt(this.state.hrg_beli_karton);
                }
                if (e.target.name === "hrgjual1_karton") {
                    this.setState({
                        margin1_karton:((parseInt(e.target.value)-parseInt(this.state.hrg_beli_karton))/parseInt(this.state.hrg_beli_karton))*100,
                        margin1KARTON:((parseInt(e.target.value)-parseInt(this.state.hrg_beli_karton))/parseInt(this.state.hrg_beli_karton))*100,
                        hrgJual1KARTON:e.target.value
                    });
                    this.state.barangHarga[i][2].margin1KARTON = ((parseInt(e.target.value)-parseInt(this.state.hrg_beli_karton))/parseInt(this.state.hrg_beli_karton))*100;
                    this.state.barangHarga[i][2].hrgJual1KARTON = e.target.value;
                }
                if (e.target.name === "hrgjual2_karton") {
                    this.setState({
                        margin2_karton:((parseInt(e.target.value)-parseInt(this.state.hrg_beli_karton))/parseInt(this.state.hrg_beli_karton))*100,
                        margin2KARTON:((parseInt(e.target.value)-parseInt(this.state.hrg_beli_karton))/parseInt(this.state.hrg_beli_karton))*100,
                        hrgJual2KARTON:e.target.value
                    });
                    this.state.barangHarga[i][2].margin2KARTON = ((parseInt(e.target.value)-parseInt(this.state.hrg_beli_karton))/parseInt(this.state.hrg_beli_karton))*100;
                    this.state.barangHarga[i][2].hrgJual2KARTON = e.target.value;
                }
                if (e.target.name === "hrgjual3_karton") {
                    this.setState({
                        margin3_karton:((parseInt(e.target.value)-parseInt(this.state.hrg_beli_karton))/parseInt(this.state.hrg_beli_karton))*100,
                        margin3KARTON:((parseInt(e.target.value)-parseInt(this.state.hrg_beli_karton))/parseInt(this.state.hrg_beli_karton))*100,
                        hrgJual3KARTON:e.target.value
                    });
                    this.state.barangHarga[i][2].margin3KARTON = ((parseInt(e.target.value)-parseInt(this.state.hrg_beli_karton))/parseInt(this.state.hrg_beli_karton))*100;
                    this.state.barangHarga[i][2].hrgJual3KARTON = e.target.value;
                }
                if (e.target.name === "hrgjual4_karton") {
                    this.setState({
                        margin4_karton:((parseInt(e.target.value)-parseInt(this.state.hrg_beli_karton))/parseInt(this.state.hrg_beli_karton))*100,
                        margin4KARTON:((parseInt(e.target.value)-parseInt(this.state.hrg_beli_karton))/parseInt(this.state.hrg_beli_karton))*100,
                        hrgJual4KARTON:e.target.value
                    });
                    this.state.barangHarga[i][2].margin4KARTON = ((parseInt(e.target.value)-parseInt(this.state.hrg_beli_karton))/parseInt(this.state.hrg_beli_karton))*100;
                    this.state.barangHarga[i][2].hrgJual4KARTON = e.target.value;
                }
                if (e.target.name === "service_karton") {
                    this.state.barangHarga[i][2].serviceKARTON = e.target.value;
                    this.state.serviceKARTON = e.target.value;
                }
                if (e.target.name === "ppn_karton") {
                    this.state.barangHarga[i][2].ppnKARTON = e.target.value;
                    this.state.ppnKARTON = e.target.value;
                }
            }

        }



    }

    handleSubmit(e){
        e.preventDefault();
        let parseData = {};
        let barangSku = [];let barangHrg=[];let barcode=[];
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
                barangHrg.push({
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
            }
            else{
                barangHrg.push({
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
                barangHrg.push({
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
                barangHrg.push({
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
            }
        }
        parseData["kd_brg"]=this.state.kd_brg;
        parseData["nm_brg"]=this.state.nm_brg;
        parseData["kel_brg"]=this.state.kel_brg;
        // parseData["stock"]=this.state.stock;
        parseData["jenis"]=this.state.kategori;
        parseData["stock_min"]=this.state.stock_min;
        parseData["group1"]=this.state.group1;
        parseData["group2"]=this.state.group2;
        parseData["deskripsi"]=this.state.deskripsi;
        parseData["gambar"]='-';
        parseData["kategori"]=this.state.jenis;
        parseData["kcp"]=this.state.kcp;
        parseData["poin"]=this.state.poin;
        parseData["online"]=this.state.online;
        parseData["berat"]=this.state.berat;
        parseData["barang_sku"] = barangSku;
        parseData["barang_harga"] = barangHrg;
        console.log("FORM DATA",parseData);
        // console.log();
        if(this.props.dataEdit !== undefined && this.props.dataEdit !== []){
            this.props.dispatch(updateProduct(this.state.kd_brg,parseData))
        }else{
            this.props.dispatch(createProduct(parseData));

        }


    }



    render(){

        const {data} = this.props.data;
        const dataSupplier = this.props.dataSupplier.data;
        const dataSubDep = this.props.dataSubDept.data;

        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formProduct"} size="lg" style={{maxWidth: '1600px', width: '100%'}}>
                <ModalHeader toggle={this.toggle}>
                    {this.props.detail===undefined?"Add Product":"Update Product"}
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
                                            <label htmlFor="inputState" className="col-form-label"><input type="checkbox" checked={this.state.generateCode} onChange={this.generateCode}/> Kode Barang</label>
                                            <input type="text" className="form-control" name="kd_brg" value={this.state.kd_brg} onChange={(e)=>this.handleChange(e,null)} required/>
                                            <div className="invalid-feedback" style={this.state.error.kd_brg || this.props.checkKodeBarang===true !== "" ? {display: 'block'} : {display: 'none'}}>
                                                {
                                                    this.state.kd_brg===''||this.state.kd_brg===undefined?this.state.error.kd_brg:(this.props.checkKodeBarang===true?"kode barang sudah digunakan":"")
                                                }
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Name</label>
                                            <input type="text" className="form-control" name="nm_brg" value={this.state.nm_brg} onChange={(e)=>this.handleChange(e,null)} required/>
                                            <div className="invalid-feedback"
                                                 style={this.state.error.nm_brg !== "" ? {display: 'block'} : {display: 'none'}}>
                                                {this.state.error.nm_brg}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Group</label>
                                            <select className="form-control form-control-lg" name="kel_brg" value={this.state.kel_brg} onChange={(e)=>this.handleChange(e,null)}>
                                                <option value="">Pilih</option>
                                                {
                                                    typeof data === 'object' ? data.map((v,i)=>{return (<option key={i} value={v.kel_brg} >{v.nm_kel_brg}</option>)}) : (<option value="" >no data</option>)
                                                }
                                            </select>
                                            <div className="invalid-feedback"
                                                 style={this.state.error.kel_brg !== "" ? {display: 'block'} : {display: 'none'}}>
                                                {this.state.error.kel_brg}
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Product Category</label>
                                            <select name="kategori" className="form-control form-control-lg" value={this.state.kategori} onChange={(e)=>this.handleChange(e,null)}>
                                                <option value="1">selling items</option>
                                                <option value="0">Not selling items</option>
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
                                            <select name="group1" className="form-control form-control-lg" value={this.state.group1} onChange={(e)=>this.handleChange(e,null)}>
                                                <option value="">Pilih</option>
                                                {
                                                    typeof dataSupplier === 'object' ? dataSupplier.map((v,i)=>{return (<option key={i} value={v.kode} >{v.nama}</option>)}) : (<option value="" >no data</option>)
                                                }
                                            </select>
                                            <div className="invalid-feedback"
                                                 style={this.state.error.group1 !== "" ? {display: 'block'} : {display: 'none'}}>
                                                {this.state.error.group1}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Sub Dept</label>
                                            <select name="group2" className="form-control form-control-lg" value={this.state.group2} onChange={(e)=>this.handleChange(e,null)}>
                                                <option value="">Pilih</option>
                                                {
                                                    typeof dataSubDep === 'object' ? dataSubDep.map((v,i)=>{return (<option key={i} value={v.kode} >{v.nama}</option>)}) : (<option value="" >no data</option>)
                                                }
                                            </select>
                                            <div className="invalid-feedback"
                                                 style={this.state.error.group2 !== "" ? {display: 'block'} : {display: 'none'}}>
                                                {this.state.error.group2}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Description</label>
                                            <input type="text" className="form-control" name="deskripsi" value={this.state.deskripsi} onChange={(e)=>this.handleChange(e,null)}  required/>
                                            <div className="invalid-feedback"
                                                 style={this.state.error.deskripsi !== "" ? {display: 'block'} : {display: 'none'}}>
                                                {this.state.error.deskripsi}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Gambar</label>
                                            <input type="file" className="form-control" name="gambar" value={this.state.gambar} onChange={(e)=>this.handleChange(e,null)}  required/>
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
                                            <label>Product Status</label>
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
                                            <label>Weight</label>
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
                                                <th>{!this.props.isLoadingCheck?'Barcoe':'cek data.......'}</th>
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
                                                                <input type="text" className="form-control" name="barcode" id={`${x===0?'barcode1':(x===1?'barcode2':'barcode3')}`} value={this.state.barangSku[x].barcode} onChange={(e)=>this.handleChange(e,x)} onBlur={(e)=>this.checkData(e,x)} required/>
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
                                                                <input readOnly={true} type="text" className="form-control" name="qty" value={satuan} onChange={(e)=>this.handleChange(e,x)} required/>
                                                            </td>
                                                            <td>
                                                                <input readOnly={x===0?true:false} type="text" className="form-control" name="konversi" value={this.state.barangSku[x].konversi} onChange={(e)=>this.handleChange(e,x)} required/>
                                                            </td>
                                                            <td>
                                                                <select name="satuan_jual" id="satuan_jual" className="form-control" value={this.state.barangSku[x].satuan_jual} defaultValue={this.state.barangSku[x].satuan_jual} onChange={(e)=>this.handleChange(e,x)}>
                                                                    <option value="">Pilih Opsi</option>
                                                                    <option value="0">Tampilkan</option>
                                                                    <option value="1">Sembunyikan</option>
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
                                            <div className="col-md-2">
                                                <div className="form-group">
                                                    <div className="row">
                                                        <label className="col-md-8"  style={{fontSize:"10px"}}>Atur Semua (PCS)</label>
                                                        <input type="checkbox" className="form-control col-md-2" onChange={this.handleAllChecked}/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-10">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="row">
                                                            <div className="col-md-4">
                                                                <input readOnly={localStorage.getItem("isReadonlySama")==="true"?true:false} type="text" placeholder="hrg beli pcs" className="form-control hrg_beli" name="hrg_beli" onChange={(e)=>this.handleChange(e,null)} value={this.state.hrg_beli} style={{fontSize:"10px"}}/>
                                                                {/*<NumberFormat className="form-control" thousandSeparator={true} name="hrg_beli" value={parseInt(this.state.hrg_beli)} onKeyUp={this.handleAll.bind(this)}/>*/}

                                                            </div>
                                                            <div className="col-md-4 text-center">
                                                                <input readOnly={localStorage.getItem("isReadonlySama")==="true"?true:false} type="number" placeholder="margin 1 pcs" className="form-control" name="margin1" onChange={(e)=>this.handleChange(e,null)} value={this.state.margin1} style={{fontSize:"10px"}}/>
                                                                <input readOnly={localStorage.getItem("isReadonlySama")==="true"?true:false} type="text" placeholder="margin 2 pcs" className="form-control" name="margin2" onChange={(e)=>this.handleChange(e,null)} value={this.state.margin2} style={{fontSize:"10px"}}/>
                                                                <input readOnly={localStorage.getItem("isReadonlySama")==="true"?true:false} type="text" placeholder="margin 3 pcs" className="form-control" name="margin3" onChange={(e)=>this.handleChange(e,null)} value={this.state.margin3} style={{fontSize:"10px"}}/>
                                                                <input readOnly={localStorage.getItem("isReadonlySama")==="true"?true:false} type="text" placeholder="margin 4 pcs" className="form-control" name="margin4" onChange={(e)=>this.handleChange(e,null)} value={this.state.margin4} style={{fontSize:"10px"}}/>
                                                            </div>
                                                            <div className="col-md-4 text-center">
                                                                <input readOnly={localStorage.getItem("isReadonlySama")==="true"?true:false} type="text" placeholder="hrg jual 1 pcs" className="form-control" name="hrgjual1" onChange={(e)=>this.handleChange(e,null)} value={this.state.hrgjual1} style={{fontSize:"10px"}}/>
                                                                <input readOnly={localStorage.getItem("isReadonlySama")==="true"?true:false} type="text" placeholder="hrg jual 2 pcs" className="form-control" name="hrgjual2" onChange={(e)=>this.handleChange(e,null)} value={this.state.hrgjual2} style={{fontSize:"10px"}}/>
                                                                <input readOnly={localStorage.getItem("isReadonlySama")==="true"?true:false} type="text" placeholder="hrg jual 3 pcs" className="form-control" name="hrgjual3" onChange={(e)=>this.handleChange(e,null)} value={this.state.hrgjual3} style={{fontSize:"10px"}}/>
                                                                <input readOnly={localStorage.getItem("isReadonlySama")==="true"?true:false} type="text" placeholder="hrg jual 4 pcs" className="form-control" name="hrgjual4" onChange={(e)=>this.handleChange(e,null)} value={this.state.hrgjual4} style={{fontSize:"10px"}}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="row">
                                                            <div className="col-md-3">
                                                                <input readOnly={localStorage.getItem("isReadonlySama")==="true"?true:false} type="text" placeholder="service pcs" className="form-control" name="service" onChange={(e)=>this.handleChange(e,null)} value={this.state.service} style={{fontSize:"10px"}}/>
                                                            </div>
                                                            <div className="col-md-3 text-center">
                                                                <input readOnly={localStorage.getItem("isReadonlySama")==="true"?true:false} type="text" placeholder="PPN pcs" className="form-control" name="ppn" onChange={(e)=>this.handleChange(e,null)} value={this.state.ppn} style={{fontSize:"10px"}}/>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                            {this.state.barangSku.length === 3 ? (()=>{
                                                let container =[];
                                                let lbl = '';
                                                for(let i=0; i<2; i++){
                                                    lbl = (i%2===0)?'PACK':'KARTON';
                                                    container.push(
                                                        <div className="col-md-12">
                                                            <div className="row" key={i}>
                                                                <div className="col-md-2">
                                                                    <div className="form-group">
                                                                        <div className="row">
                                                                            <label className="col-md-8"  style={{fontSize:"10px"}}>Atur Semua ({lbl})</label>
                                                                            <input type="checkbox" className="form-control col-md-2" onChange={(e)=>this.handleAllCheckedSku(e,i,(i%2===0)?'PACK':'KARTON')}/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-10">
                                                                    <div className="row">
                                                                        <div className="col-md-6">
                                                                            <div className="row">
                                                                                <div className="col-md-4">
                                                                                    {i%2===0?(<input type="text" placeholder="hrg beli pack" className="form-control" name="hrg_beli_pack" value={this.state.hrg_beli_pack} onChange={(e)=>this.handleChangeMore(e)} style={{fontSize:"10px"}}/>) : (<input type="text" placeholder="hrg beli karton" className="form-control" name="hrg_beli_karton" value={this.state.hrg_beli_karton} onChange={(e)=>this.handleChangeMore(e)} style={{fontSize:"10px"}}/>)}
                                                                                </div>
                                                                                <div className="col-md-4">
                                                                                    {i%2===0?(<input type="text" placeholder="margin 1 pack" className="form-control" name="margin1_pack" value={this.state.margin1_pack} onChange={(e)=>this.handleChangeMore(e)} style={{fontSize:"10px"}}/>) : (<input type="text" placeholder="margin 1 karton" className="form-control" name="margin1_karton" value={this.state.margin1_karton} onChange={(e)=>this.handleChangeMore(e)} style={{fontSize:"10px"}}/>)}
                                                                                    {i%2===0?(<input type="text" placeholder="margin 2 pack" className="form-control" name="margin2_pack" value={this.state.margin2_pack} onChange={(e)=>this.handleChangeMore(e)} style={{fontSize:"10px"}}/>) : (<input type="text" placeholder="margin 2 karton" className="form-control" name="margin2_karton" value={this.state.margin2_karton} onChange={(e)=>this.handleChangeMore(e)} style={{fontSize:"10px"}}/>)}
                                                                                    {i%2===0?(<input type="text" placeholder="margin 3 pack" className="form-control" name="margin3_pack" value={this.state.margin3_pack} onChange={(e)=>this.handleChangeMore(e)} style={{fontSize:"10px"}}/>) : (<input type="text" placeholder="margin 3 karton" className="form-control" name="margin3_karton" value={this.state.margin3_karton} onChange={(e)=>this.handleChangeMore(e)} style={{fontSize:"10px"}}/>)}
                                                                                    {i%2===0?(<input type="text" placeholder="margin 4 pack" className="form-control" name="margin4_pack" value={this.state.margin4_pack} onChange={(e)=>this.handleChangeMore(e)} style={{fontSize:"10px"}}/>) : (<input type="text" placeholder="margin 4 karton" className="form-control" name="margin4_karton" value={this.state.margin4_karton} onChange={(e)=>this.handleChangeMore(e)} style={{fontSize:"10px"}}/>)}
                                                                                </div>
                                                                                <div className="col-md-4">
                                                                                    {i%2===0?(<input type="text" placeholder="hrg jual 1 pack" className="form-control" name="hrgjual1_pack" value={this.state.hrgjual1_pack} onChange={(e)=>this.handleChangeMore(e)} style={{fontSize:"10px"}}/>) : (<input type="text" placeholder="hrg jual 1 karton" className="form-control" name="hrgjual1_karton" value={this.state.hrgjual1_karton} onChange={(e)=>this.handleChangeMore(e)} style={{fontSize:"10px"}}/>)}
                                                                                    {i%2===0?(<input type="text" placeholder="hrg jual 2 pack" className="form-control" name="hrgjual2_pack" value={this.state.hrgjual2_pack} onChange={(e)=>this.handleChangeMore(e)} style={{fontSize:"10px"}}/>) : (<input type="text" placeholder="hrg jual 2 karton" className="form-control" name="hrgjual2_karton" value={this.state.hrgjual2_karton} onChange={(e)=>this.handleChangeMore(e)} style={{fontSize:"10px"}}/>)}
                                                                                    {i%2===0?(<input type="text" placeholder="hrg jual 3 pack" className="form-control" name="hrgjual3_pack" value={this.state.hrgjual3_pack} onChange={(e)=>this.handleChangeMore(e)} style={{fontSize:"10px"}}/>) : (<input type="text" placeholder="hrg jual 3 karton" className="form-control" name="hrgjual3_karton" value={this.state.hrgjual3_karton} onChange={(e)=>this.handleChangeMore(e)} style={{fontSize:"10px"}}/>)}
                                                                                    {i%2===0?(<input type="text" placeholder="hrg jual 4 pack" className="form-control" name="hrgjual4_pack" value={this.state.hrgjual4_pack} onChange={(e)=>this.handleChangeMore(e)} style={{fontSize:"10px"}}/>) : (<input type="text" placeholder="hrg jual 4 karton" className="form-control" name="hrgjual4_karton" value={this.state.hrgjual4_karton} onChange={(e)=>this.handleChangeMore(e)} style={{fontSize:"10px"}}/>)}
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                        {/*service,ppn,stock min,stock max */}
                                                                        <div className="col-md-6">
                                                                            <div className="row">
                                                                                <div className="col-md-3">
                                                                                    {i%2===0?(<input type="text" placeholder="service pack" className="form-control" name="service_pack" value={this.state.service_pack} onChange={(e)=>this.handleChangeMore(e)} style={{fontSize:"10px"}}/>) : (<input type="text" placeholder="service karton" className="form-control" name="service_karton" value={this.state.service_karton} onChange={(e)=>this.handleChangeMore(e)} style={{fontSize:"10px"}}/>)}
                                                                                </div>
                                                                                <div className="col-md-3 text-center">
                                                                                    {i%2===0?(<input type="text" placeholder="PPN pack" className="form-control" name="ppn_pack" value={this.state.ppn_pack} onChange={(e)=>this.handleChangeMore(e)} style={{fontSize:"10px"}}/>) : (<input type="text" placeholder="ppn karton" className="form-control" name="ppn_karton" value={this.state.ppn_karton} onChange={(e)=>this.handleChangeMore(e)} style={{fontSize:"10px"}}/>)}
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
                                            })():''}
                                            {/*END ATUR SEMUA*/}
                                            <div className="col-md-12">
                                                <hr/>
                                            </div>
                                            <div className="col-md-12">
                                                <hr/>
                                            </div>

                                            {
                                                this.state.barangHarga.map((v,i)=>{
                                                    return (
                                                        <div className="col-md-12" key={i}>
                                                            <div className="row">
                                                                {/*PCS*/}
                                                                <div className="col-md-2">
                                                                    <div className="form-group">
                                                                        <div className="row">
                                                                            <label className="col-md-8"  style={{fontSize:"10px"}}> {v[0].nama_toko} ( PCS )</label>
                                                                            <input type="checkbox" name="lokasi" value={v[0].lokasi} checked={v[0].isCheckedPCS} onChange={this.handleCheckChieldElement(i)}/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-10">
                                                                    <div className="row">
                                                                        <div className="col-md-6">
                                                                            <div className="row">
                                                                                <div className="col-md-4">
                                                                                    <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="hrg beli" className="form-control" name="hrgBeliPCS" value={v[0].hrgBeliPCS} onChange={(e)=>this.onHandleChangeChild(e,i)} style={{fontSize:"10px"}}/>
                                                                                </div>
                                                                                <div className="col-md-4">
                                                                                    <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="margin 1" className="form-control" name="margin1PCS" value={v[0].margin1PCS} onChange={(e)=>this.onHandleChangeChild(e,i)} style={{fontSize:"10px"}}/>
                                                                                    <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="margin 2" className="form-control" name="margin2PCS" value={v[0].margin2PCS} onChange={(e)=>this.onHandleChangeChild(e,i)} style={{fontSize:"10px"}}/>
                                                                                    <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="margin 3" className="form-control" name="margin3PCS" value={v[0].margin3PCS} onChange={(e)=>this.onHandleChangeChild(e,i)} style={{fontSize:"10px"}}/>
                                                                                    <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="margin 4" className="form-control" name="margin4PCS" value={v[0].margin4PCS} onChange={(e)=>this.onHandleChangeChild(e,i)} style={{fontSize:"10px"}}/>
                                                                                </div>
                                                                                <div className="col-md-4">
                                                                                    <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="hrg jual 1" className="form-control" name="hrgJual1PCS" value={v[0].hrgJual1PCS} onChange={(e)=>this.onHandleChangeChild(e,i)} style={{fontSize:"10px"}}/>
                                                                                    <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="hrg jual 2" className="form-control" name="hrgJual2PCS" value={v[0].hrgJual2PCS} onChange={(e)=>this.onHandleChangeChild(e,i)} style={{fontSize:"10px"}}/>
                                                                                    <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="hrg jual 3" className="form-control" name="hrgJual3PCS" value={v[0].hrgJual3PCS} onChange={(e)=>this.onHandleChangeChild(e,i)} style={{fontSize:"10px"}}/>
                                                                                    <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="hrg jual 4" className="form-control" name="hrgJual4PCS" value={v[0].hrgJual4PCS} onChange={(e)=>this.onHandleChangeChild(e,i)} style={{fontSize:"10px"}}/>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                        {/*service,ppn,stock min,stock max */}
                                                                        <div className="col-md-6">
                                                                            <div className="row">
                                                                                <div className="col-md-3">
                                                                                    <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="service" className="form-control" name="servicePCS" value={v[0].servicePCS} onChange={(e)=>this.onHandleChangeChild(e,i)} style={{fontSize:"10px"}}/>
                                                                                </div>
                                                                                <div className="col-md-3 text-center">
                                                                                    <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="PPN" className="form-control" name="ppnPCS" value={v[0].ppnPCS} onChange={(e)=>this.onHandleChangeChild(e,i)} style={{fontSize:"10px"}}/>
                                                                                </div>

                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                </div>

                                                            </div>
                                                            {
                                                                this.state.barangSku.length === 3 ? (
                                                                    <div className="row">
                                                                        {/*PACK*/}
                                                                        <div className="col-md-2">
                                                                            <div className="form-group">
                                                                                <div className="row">
                                                                                    <label className="col-md-8"  style={{fontSize:"10px"}}> {v[1].nama_toko} ( PACK )</label>
                                                                                    <input type="checkbox" name="lokasi" value={v[1].lokasi} checked={v[1].isCheckedPACK} onChange={(e)=>this.handleCheckChieldElementPack(e,i)}/>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-10">
                                                                            <div className="row">
                                                                                <div className="col-md-6">
                                                                                    <div className="row">
                                                                                        <div className="col-md-4">
                                                                                            <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="hrg beli" className="form-control" name="hrgBeliPACK" value={v[1].hrgBeliPACK} onChange={(e)=>this.onHandleChangeChildPack(e,i)} style={{fontSize:"10px"}}/>
                                                                                        </div>
                                                                                        <div className="col-md-4">
                                                                                            <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="margin 1" className="form-control" name="margin1PACK" value={v[1].margin1PACK} onChange={(e)=>this.onHandleChangeChildPack(e,i)} style={{fontSize:"10px"}}/>
                                                                                            <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="margin 2" className="form-control" name="margin2PACK" value={v[1].margin2PACK} onChange={(e)=>this.onHandleChangeChildPack(e,i)} style={{fontSize:"10px"}}/>
                                                                                            <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="margin 3" className="form-control" name="margin3PACK" value={v[1].margin3PACK} onChange={(e)=>this.onHandleChangeChildPack(e,i)} style={{fontSize:"10px"}}/>
                                                                                            <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="margin 4" className="form-control" name="margin4PACK" value={v[1].margin4PACK} onChange={(e)=>this.onHandleChangeChildPack(e,i)} style={{fontSize:"10px"}}/>
                                                                                        </div>
                                                                                        <div className="col-md-4">
                                                                                            <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="hrg jual 1" className="form-control" name="hrgJual1PACK" value={v[1].hrgJual1PACK} onChange={(e)=>this.onHandleChangeChildPack(e,i)} style={{fontSize:"10px"}}/>
                                                                                            <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="hrg jual 2" className="form-control" name="hrgJual2PACK" value={v[1].hrgJual2PACK} onChange={(e)=>this.onHandleChangeChildPack(e,i)} style={{fontSize:"10px"}}/>
                                                                                            <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="hrg jual 3" className="form-control" name="hrgJual3PACK" value={v[1].hrgJual3PACK} onChange={(e)=>this.onHandleChangeChildPack(e,i)} style={{fontSize:"10px"}}/>
                                                                                            <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="hrg jual 4" className="form-control" name="hrgJual4PACK" value={v[1].hrgJual4PACK} onChange={(e)=>this.onHandleChangeChildPack(e,i)} style={{fontSize:"10px"}}/>
                                                                                        </div>

                                                                                    </div>
                                                                                </div>
                                                                                {/*service,ppn,stock min,stock max */}
                                                                                <div className="col-md-6">
                                                                                    <div className="row">
                                                                                        <div className="col-md-3">
                                                                                            <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="service" className="form-control" name="servicePACK" value={v[1].servicePACK} onChange={(e)=>this.onHandleChangeChildPack(e,i)} style={{fontSize:"10px"}}/>
                                                                                        </div>
                                                                                        <div className="col-md-3 text-center">
                                                                                            <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="PPN" className="form-control" name="ppnPACK" value={v[1].ppnPACK} onChange={(e)=>this.onHandleChangeChildPack(e,i)} style={{fontSize:"10px"}}/>
                                                                                        </div>

                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                        {/*KARTON*/}
                                                                        <div className="col-md-2">
                                                                            <div className="form-group">
                                                                                <div className="row">
                                                                                    <label className="col-md-8"  style={{fontSize:"10px"}}> {v[2].nama_toko} ( KARTON )</label>
                                                                                    <input type="checkbox" name="lokasi" value={v[2].lokasi} checked={v[2].isCheckedKARTON} onChange={(e)=>this.handleCheckChieldElementKarton(e,i)}/>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-10">
                                                                            <div className="row">
                                                                                <div className="col-md-6">
                                                                                    <div className="row">
                                                                                        <div className="col-md-4">
                                                                                            <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="hrg beli" className="form-control" name="hrgBeliKARTON" value={v[2].hrgBeliKARTON} onChange={(e)=>this.onHandleChangeChildKarton(e,i)} style={{fontSize:"10px"}}/>
                                                                                        </div>
                                                                                        <div className="col-md-4">
                                                                                            <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="margin 1" className="form-control" name="margin1KARTON" value={v[2].margin1KARTON} onChange={(e)=>this.onHandleChangeChildKarton(e,i)} style={{fontSize:"10px"}}/>
                                                                                            <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="margin 2" className="form-control" name="margin2KARTON" value={v[2].margin2KARTON} onChange={(e)=>this.onHandleChangeChildKarton(e,i)} style={{fontSize:"10px"}}/>
                                                                                            <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="margin 3" className="form-control" name="margin3KARTON" value={v[2].margin3KARTON} onChange={(e)=>this.onHandleChangeChildKarton(e,i)} style={{fontSize:"10px"}}/>
                                                                                            <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="margin 4" className="form-control" name="margin4KARTON" value={v[2].margin4KARTON} onChange={(e)=>this.onHandleChangeChildKarton(e,i)} style={{fontSize:"10px"}}/>
                                                                                        </div>
                                                                                        <div className="col-md-4">
                                                                                            <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="hrg jual 1" className="form-control" name="hrgJual1KARTON" value={v[2].hrgJual1KARTON} onChange={(e)=>this.onHandleChangeChildKarton(e,i)} style={{fontSize:"10px"}}/>
                                                                                            <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="hrg jual 2" className="form-control" name="hrgJual2KARTON" value={v[2].hrgJual2KARTON} onChange={(e)=>this.onHandleChangeChildKarton(e,i)} style={{fontSize:"10px"}}/>
                                                                                            <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="hrg jual 3" className="form-control" name="hrgJual3KARTON" value={v[2].hrgJual3KARTON} onChange={(e)=>this.onHandleChangeChildKarton(e,i)} style={{fontSize:"10px"}}/>
                                                                                            <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="hrg jual 4" className="form-control" name="hrgJual4KARTON" value={v[2].hrgJual4KARTON} onChange={(e)=>this.onHandleChangeChildKarton(e,i)} style={{fontSize:"10px"}}/>
                                                                                        </div>

                                                                                    </div>
                                                                                </div>
                                                                                {/*service,ppn,stock min,stock max */}
                                                                                <div className="col-md-6">
                                                                                    <div className="row">
                                                                                        <div className="col-md-3">
                                                                                            <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="service" className="form-control" name="serviceKARTON" value={v[2].serviceKARTON} onChange={(e)=>this.onHandleChangeChildKarton(e,i)} style={{fontSize:"10px"}}/>
                                                                                        </div>
                                                                                        <div className="col-md-3 text-center">
                                                                                            <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="PPN" className="form-control" name="ppnKARTON" value={v[2].ppnKARTON} onChange={(e)=>this.onHandleChangeChildKarton(e,i)} style={{fontSize:"10px"}}/>
                                                                                        </div>

                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : ""
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
                                            <button type="button" className="btn btn-warning mb-2 mr-2"><i className="ti-close" /> Cancel</button>
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
        // group:state.groupProductReducer.data
    }
}
export default connect(mapStateToProps)(FormProduct);