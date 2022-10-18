import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import {createPromo} from "redux/actions/masterdata/promo/promo.action";
import Select from "react-select";
import {FetchCustomerType} from "redux/actions/masterdata/customer_type/customer_type.action";
import {toRp} from "helper";
import moment from "moment";
import Paginationq from "helper";
import {FetchBrg2,FetchBrg1, setPromoDetail, updatePromo} from "redux/actions/masterdata/promo/promo.action";
import FileBase64 from 'react-file-base64';
import { rmComma, toCurrency } from '../../../../../helper';

class FormPromo extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleChangeJenisMember = this.handleChangeJenisMember.bind(this);
        this.handleChangeLokasi = this.handleChangeLokasi.bind(this);
        this.handleChangeKelBarang = this.handleChangeKelBarang.bind(this);
        this.handleChangeSupplier = this.handleChangeSupplier.bind(this);
        this.handleChangeDynamic = this.handleChangeDynamic.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSearch1 = this.handleSearch1.bind(this);
        this.handleSearch2 = this.handleSearch2.bind(this);
        this.state = {
            barang_data             : [],
            barang_data1            : [],
            category                : '',
            category_data           : [],
            jenis_member            : '',
            jenis_member_data       : [],
            kel_brg                 : '',
            kel_brg_data            : [],
            supplier                : '',
            supplier_data           : [],
            lokasi                  : "",
            lokasi_data             : [],
            selectedOption          : [],
            hanya_member            : false,
            tanpa_periode           : false,
            tgl_mulai               : moment(new Date()).format('YYYY-MM-DDTHH:mm'),
            tgl_selesai             : moment(new Date()).format('YYYY-MM-DDTHH:mm'),
            keterangan              : '',
            min_trx                 : '',
            gambar                  : '-',
            diskon1                 : '',
            diskon2                 : '',
            kode_buy                : '',
            kode_get                : '',
            isCheckedLokasi         : false,
            isCheckedDiskonPersen   : true,
            isCheckedDiskonNominal  : false,
            isArrLength             : 0,
            any_1                   : "",
            any_2                   : "",
            error:{
                category        : '',
                jenis_member    : '',
                tgl_mulai       : '',
                tgl_selesai     : '',
                lokasi          : '',
                kel_brg         : '',
                supplier        : '',
                diskon1         : '',
                diskon2         : '',
                kode_buy        : '',
                kode_get        : '',
                min_trx         : '',
                keterangan      : '',
                barang1         : '',
                barang2         : '',
                any_1           : '',
                any_2           : '',
            }
        };
    }
    getProps(param){
        this.setState({isArrLength:0});
        
        if(param.customerType.data!==undefined){
            let cust=[];
            param.customerType.data.map((v,i)=>{
                cust.push({
                    value:v.kode,
                    label:v.nama,
                })
                return null;
            });
            this.setState({jenis_member_data:cust});
        }
        if(param.kategori!==undefined){
            let kategori=[];
            param.kategori.map((v,i)=>{
                kategori.push({
                    value:v.kode,
                    label:v.title,
                })
                return null;
            });
            this.setState({category_data:kategori});
        }
        if(param.barang1.data!==undefined){
            let brg=param.barang1.data;
            for(let i=0;i<brg.length;i++){
                Object.assign(brg[i],{qty:0,qty2:0,checked:false,jenis:"nominal"});
            }
            this.setState({barang_data:brg});
        }
        if(param.barang2.data!==undefined){
            let brg1=param.barang2.data;
            for(let i=0;i<brg1.length;i++){
                Object.assign(brg1[i],{qty_bg:0,qty2_bg:0,checked_bg:false,jenis_bg:"nominal"});
            }
            this.setState({barang_data1:brg1});
        }
        if(param.kel_barang.data!==undefined){
            let kel_brg=[];
            param.kel_barang.data.map((v,i)=>{
                kel_brg.push({
                    value:v.kel_brg,
                    label:v.nm_kel_brg,
                })
                return null;
            });
            this.setState({kel_brg_data:kel_brg});
        }
        if(param.supplier!==undefined){
            let supplier=[];
            param.supplier.map((v,i)=>{
                supplier.push({
                    value:v.kode,
                    label:v.nama,
                })
                return null;
            });
            this.setState({supplier_data:supplier});
        }
        if(param.detail!==undefined){
            this.setState({
                isArrLength:param.detail.length,
                category:param.detail.category,
                keterangan:param.detail.keterangan,
                tgl_mulai:moment(param.detail.daritgl).format('YYYY-MM-DDTHH:mm'),
                tgl_selesai:moment(param.detail.sampaitgl).format('YYYY-MM-DDTHH:mm'),
            });
            let str = param.detail.lokasi;
            if(str!==undefined){
                let ar = str.split(',');
                let loc=[];
                if(param.lokasi.data!==undefined){
                    for(let i=0;i<param.lokasi.data.length;i++){
                        for(let x=0;x<ar.length;x++){
                            if(param.lokasi.data[i].kode === ar[x]){
                                loc.push({value:ar[x],label:param.lokasi.data[i].nama_toko});
                                this.handleChangeLokasi({value:ar[x],label:param.lokasi.data[i].nama_toko})
                            }
                        }
                    }
                }
                this.setState({
                    selectedOption:loc,
                })
            }


            if(param.detail.detail !== undefined){
                if(param.detail.detail.length>0){
                    // JIKA KATEGORI KELOMPOK BARANG
                    if(param.detail.category==='kelbrg'){
                        this.handleChangeKelBarang({value:param.detail.detail[0].kd_brg});
                        this.setState({
                            diskon1:param.detail.detail[0].diskon,
                            diskon2:param.detail.detail[0].diskon2,
                        })
                    }
                    // JIKA KATEGORI SUPPLIER
                    if(param.detail.category==='spr'){
                        this.handleChangeSupplier({value:param.detail.detail[0].kd_brg});
                        this.setState({
                            diskon1:param.detail.detail[0].diskon,
                            diskon2:param.detail.detail[0].diskon2,
                        })
                    }
                    // JIKA KATEGORI BUY GET
                    if(param.detail.category==='bg'){
                        for(let x=0;x<param.detail.detail.length;x++){
                            for(let i=0;i<this.state.barang_data.length;i++){
                                if(this.state.barang_data[i].barcode === param.detail.detail[x].kd_brg){
                                    if(param.detail.detail[x].isbuy===1){
                                        Object.assign(this.state.barang_data[i],{qty:param.detail.detail[x].min_qty,qty2:0,checked:true,jenis:"nominal"});
                                    }

                                }
                            }
                            for(let i=0;i<this.state.barang_data1.length;i++){
                                if(this.state.barang_data1[i].barcode === param.detail.detail[x].kd_brg){
                                    if(param.detail.detail[x].isbuy===0){
                                        Object.assign(this.state.barang_data1[i],{qty_bg:param.detail.detail[x].bonus,qty2_bg:0,checked_bg:true,jenis_bg:"persen"});
                                    }

                                }
                            }
                        }
                        // this.setState({barang_data:brg});
                        // 


                    }

                    //JIKA KATEGORI TEBUS MURAH
                    if(param.detail.category==='tm'){
                        for(let x=0;x<param.detail.detail.length;x++) {
                            for (let i = 0; i < this.state.barang_data.length; i++) {
                                if (this.state.barang_data[i].barcode === param.detail.detail[x].kd_brg) {
                                    Object.assign(this.state.barang_data[i], {
                                        qty: param.detail.detail[x].open_price,
                                        qty2: 0,
                                        checked: true,
                                        jenis: "nominal"
                                    });

                                }
                            }
                        }
                    }
                    if(param.detail.category==='brg'){
                        for(let x=0;x<param.detail.detail.length;x++) {
                            for (let i = 0; i < this.state.barang_data.length; i++) {
                                if (this.state.barang_data[i].barcode === param.detail.detail[x].kd_brg) {
                                    Object.assign(this.state.barang_data[i], {
                                        qty: param.detail.detail[x].diskon,
                                        qty2: param.detail.detail[x].diskon2,
                                        checked: true,
                                        jenis: "nominal"
                                    });

                                }
                            }
                        }
                    }
                    this.setState({
                        min_trx:param.detail.detail[0].min_trx
                    })
                }
            }


            if(param.detail.periode==="1"){
                this.setState({
                    tanpa_periode:true
                })
            }
            else{
                this.setState({
                    tanpa_periode:false
                })
            }

        }
    }
    componentWillMount(){
        this.getProps(this.props);
        this.props.dispatch(FetchBrg1(1,5));
        this.props.dispatch(FetchBrg2(1,5));
    }
    componentWillReceiveProps(props){
        this.getProps(props);
        let lokasi = typeof props.lokasi.data === 'object' ? props.lokasi.data : [];

        let locG = [];
        for(let i=0;i<lokasi.length;i++){
            locG.push({value:lokasi[i].kode,label:lokasi[i].nama_toko})
        }
        this.setState({
            lokasi_data : locG
        })
        // state.lokasi_data = locG;
        return null;
    }
    handleChange = (event) => {
        let column=event.target.name;
        let value=event.target.value;
        let checked=event.target.checked;
        this.setState({ [column]: value});
        let err = Object.assign({}, this.state.error, {[column]: ""});
        this.setState({error: err});
        if(column==='hanya_member'){
            if(checked){
                this.props.dispatch(FetchCustomerType(1,'',100));
                this.setState({hanya_member:true});
            }else{
                this.setState({hanya_member:false});
            }
        }
        if(column==='tanpa_periode'){
            this.setState({tanpa_periode:!this.state.tanpa_periode});
        }
        if(column==='diskonPersen'){
            this.setState({
                isCheckedDiskonPersen:true,
                isCheckedDiskonNominal:false,
            });
        }
        if(column==='diskonNominal'){
            this.setState({
                isCheckedDiskonNominal:true,
                isCheckedDiskonPersen:false,
            });
        }
        if(column==='checked_lokasi'){
            let lokasi=[];let lok=[];
            let err = Object.assign({}, this.state.error, {"lokasi": ""});
            this.setState({error: err});
            if(checked===true){
               this.state.lokasi_data.map((v,i)=>{
                   lok.push(`${v.value}`).toString()
                   return null;
                });
                this.setState({
                    lokasi:lok,
                    isCheckedLokasi:true
                });
            }else{
                this.state.lokasi_data.map((v,i)=>{
                    lokasi.push({
                        value:v.value,
                        label:v.label,
                    });
                    lok.push(`${v.value}`);
                    return null;
                });
                this.setState({lokasi:'',isCheckedLokasi:false});
            }

        }
    }
    handleChangeCategory(val){
        
        let err = Object.assign({}, this.state.error, {
            category: ""
        });
        this.setState({
            category:val.value,
            error: err
        });
        localStorage.setItem("categoryPromo",val.value);

        // if(val.value==='kelbrg'){
        //     this.props.dispatch(FetchGroupProduct(1,'',100));
        // }
        // if(val.value==='spr'){
        //     this.props.dispatch(FetchSupplierAll());
        // }
    }
    handleChangeJenisMember(val){
        let err = Object.assign({}, this.state.error, {
            jenis_member: ""
        });
        this.setState({
            jenis_member:val.value,
            error:err
        })
    }
    handleChangeLokasi(val){
        let err = Object.assign({}, this.state.error, {
            lokasi: ""
        });
        if(val!==null){
            this.setState({selectedOption:val,error:err});
        }
    }
    handleChangeKelBarang(val){
        
        let err = Object.assign({}, this.state.error, {
            kel_brg: ""
        });
        this.setState({kel_brg:val.value,error:err})
    }
    handleChangeSupplier(val){
        let err = Object.assign({}, this.state.error, {
            supplier: ""
        });
        this.setState({supplier:val.value,error:err})
    }
    toggle = (e) => {
        e.preventDefault();
        this.handleClearState();
        localStorage.removeItem("categoryPromo");
    };
    handleChangeDynamic(e,i){
        let column = e.target.name;
        let value = e.target.value;
        let checked = e.target.checked;
        let barang_data = [...this.state.barang_data];
        let barang_data1 = [...this.state.barang_data1];
        if(column === 'checked'){
            barang_data[i] = {...barang_data[i], [column]: checked};
        }
        if(column === 'qty'|| column === 'qty2'|| column=== 'jenis'){
            barang_data[i] = {...barang_data[i], [column]: value};
        }
        if(column === 'checked_bg'){
            barang_data1[i] = {...barang_data1[i], [column]: checked};
        }
        if(column === 'qty_bg'|| column === 'qty2_bg'|| column=== 'jenis_bg'){
            barang_data1[i] = {...barang_data1[i], [column]: value};
        }

        this.setState({ barang_data:barang_data,barang_data1:barang_data1 });
    }
    getFiles(files) {
        this.setState({
            gambar: files
        })
    };
    handleClearState(){
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.setState({
            barang_data             : [],
            barang_data1            : [],
            category                : '',
            category_data           : [],
            jenis_member            : '',
            jenis_member_data       : [],
            kel_brg                 : '',
            kel_brg_data            : [],
            supplier                : '',
            supplier_data           : [],
            lokasi                  : "",
            lokasi_data             : [],
            selectedOption          : [],
            hanya_member            : false,
            tanpa_periode           : false,
            tgl_mulai               : moment(new Date()).format('YYYY-MM-DDTHH:mm'),
            tgl_selesai             : moment(new Date()).format('YYYY-MM-DDTHH:mm'),
            keterangan              : '',
            min_trx                 : '',
            gambar                  : '-',
            diskon1                 : '',
            diskon2                 : '',
            kode_buy                : '',
            kode_get                : '',
            isCheckedLokasi         : false,
            isCheckedDiskonPersen   : true,
            isCheckedDiskonNominal  : false,
            isArrLength             : 0,
            any_1                   : "",
            any_2                   : "",
            error:{
                category        : '',
                jenis_member    : '',
                tgl_mulai       : '',
                tgl_selesai     : '',
                lokasi          : '',
                kel_brg         : '',
                supplier        : '',
                diskon1         : '',
                diskon2         : '',
                kode_buy        : '',
                kode_get        : '',
                min_trx         : '',
                keterangan      : '',
                barang1         : '',
                barang2         : '',
                any_1           : '',
                any_2           : '',
            }
        });
        this.props.dispatch(setPromoDetail([]))
    }
    handleSubmit(e){
        e.preventDefault();
        let parseData={};
        let lokasi=[];
        for(let i=0;i<this.state.selectedOption.length;i++){
            lokasi.push(this.state.selectedOption[i].value);
        }
        
        
        
        

        parseData['category']=this.state.category;
        parseData['daritgl']=moment(this.state.tgl_mulai).format('YYYY-MM-DD HH:mm:ss');
        parseData['sampaitgl']=moment(this.state.tgl_selesai).format('YYYY-MM-DD HH:mm:ss');
        parseData['lokasi']=this.state.isCheckedLokasi===true?this.state.lokasi.toString():lokasi.toString();
        parseData['gambar']=this.state.gambar==='-'?'-':this.state.gambar.base64;
        parseData['member']=this.state.hanya_member?this.state.jenis_member:0;
        parseData['periode']=!this.state.tanpa_periode?0:1;
        parseData['keterangan']=this.state.keterangan;
        let err = this.state.error;
        let detail=[];
        if(parseData['category']===''||parseData['category']===undefined){
            err = Object.assign({}, err, {category:"kategori tidak boleh kosong"});
            this.setState({error: err});
            return;
        }
        if(parseData['periode']===0){
            if(parseData['daritgl']===''||parseData['daritgl']===undefined){
                err = Object.assign({}, err, {tgl_mulai:"tanggal mulai tidak boleh kosong"});
                this.setState({error: err});
                return;
            }
            if(parseData['sampaitgl']===''||parseData['sampaitgl']===undefined){
                err = Object.assign({}, err, {tgl_selesai:"tanggal selesai tidak boleh kosong"});
                this.setState({error: err});
                return;
            }
        }
        if(parseData['category']==='kelbrg'){
            if(this.state.kel_brg===''||this.state.kel_brg===undefined){
                err = Object.assign({}, err, {kel_brg:"kelompok barang tidak boleh kosong"});
                this.setState({error: err});
                return;
            }
        }
        if(parseData['category']==='spr'){
            if(this.state.supplier===''||this.state.supplier===undefined){
                err = Object.assign({}, err, {supplier:"supplier tidak boleh kosong"});
                this.setState({error: err});
                return;
            }
        }
        if(this.state.hanya_member){
            if(parseData['member']===''||parseData['member']===undefined){
                err = Object.assign({}, err, {jenis_member:"jenis member tidak boleh kosong"});
                this.setState({error: err});
                return;
            }
        }
        if(this.state.isCheckedLokasi?!this.state.isCheckedLokasi:parseData['lokasi']===''||parseData['lokasi']===undefined){
            err = Object.assign({}, err, {lokasi:"lokasi tidak boleh kosong"});
            this.setState({error: err});
            return;
        }
        if(parseData['category']==='spr'||parseData['category']==='kelbrg'){
            if(this.state.diskon1===''||this.state.diskon1===undefined){
                err = Object.assign({}, err, {diskon1:"diskon 1 tidak boleh kosong"});
                this.setState({error: err});
                return;
            }
            if(this.state.diskon2===''||this.state.diskon2===undefined){
                err = Object.assign({}, err, {diskon2:"diskon 2 tidak boleh kosong"});
                this.setState({error: err});
                return;
            }
        }
        if(parseData['keterangan']===''||parseData['keterangan']===undefined){
            err = Object.assign({}, err, {keterangan:"keterangan tidak boleh kosong"});
            this.setState({error: err});
            return;
        }
        if(this.state.min_trx===''||this.state.min_trx===undefined){
            err = Object.assign({}, err, {min_trx:"minimal transaksi tidak boleh kosong"});
            this.setState({error: err});
            return;
        }
        this.state.barang_data.map((v,i)=>{
            if(this.state.category==='brg'){
                if(v.checked === true){
                    detail.push({
                        barcode:v.barcode,
                        diskon:v.qty,
                        diskon2:v.qty2,
                        min_trx:rmComma(this.state.min_trx),
                        min_qty:0,
                        open_price:0,
                        hrg_jual:v.harga,
                        bonus:0,
                        isbuy:0
                    })
                }
            }
            if(this.state.category==='tm'){
                if(v.checked === true){
                    detail.push({
                        barcode:v.barcode, diskon:0, diskon2:0, min_trx:rmComma(this.state.min_trx), min_qty:0, open_price:v.qty, hrg_jual:v.harga, bonus:0, isbuy:0
                    })
                }
            }
            return null;
        });
        if(this.state.category==='kelbrg'){
            if(this.state.diskon1===''||parseInt(this.state.diskon1,10)===0||this.state.diskon1==='0'){
                err = Object.assign({}, err, {diskon1:"diskon 1 tidak boleh kosong"});
                this.setState({error: err});
                return;
            }
            detail.push({
                barcode:this.state.kel_brg, diskon:this.state.diskon1, diskon2:this.state.diskon2, min_trx:rmComma(this.state.min_trx), min_qty:0, open_price:0, hrg_jual:0, bonus:0, isbuy:0
            })

        }
        if(this.state.category==='spr'){
            if(this.state.diskon1===''||parseInt(this.state.diskon1,10)===0||this.state.diskon1==='0'){
                err = Object.assign({}, err, {diskon1:"diskon 1 tidak boleh kosong"});
                this.setState({error: err});
                return;
            }
            detail.push({
                barcode:this.state.supplier, diskon:this.state.diskon1, diskon2:this.state.diskon1, min_trx:rmComma(this.state.min_trx), min_qty:0, open_price:0, hrg_jual:0, bonus:0, isbuy:0
            })
        }
        if(this.state.category==='bg'){
            this.state.barang_data.map((v,i)=>{
                if(v.checked === true){
                    detail.push({
                        barcode:v.barcode, diskon:0, diskon2:0, min_trx:rmComma(this.state.min_trx), min_qty:v.qty, open_price:0, hrg_jual:v.harga, bonus:0, isbuy:1
                    })
                }
                return null;
            });
            this.state.barang_data1.map((v,i)=>{
                if(v.checked_bg===true){
                    detail.push({
                        barcode:v.barcode, diskon:0, diskon2:0, min_trx:rmComma(this.state.min_trx), min_qty:0, open_price:0, hrg_jual:v.harga, bonus:v.qty_bg, isbuy:0
                    })
                }
                return null;
            });
        }


        parseData['detail']=detail;
        if(this.state.isArrLength === undefined){
            
            this.props.dispatch(updatePromo(this.props.detail.id_promo,parseData));
        }
        if(this.state.isArrLength === 0){
            
            this.props.dispatch(createPromo(parseData));
        }

        this.handleClearState();
        
    }
    handlePagin1(page){
        this.props.dispatch(FetchBrg1(page,5));
    }
    handlePagin2(page){
        this.props.dispatch(FetchBrg2(page,5));
    }
    handleSearch1(){
        
        let where='';
        if(this.state.any_1!==''){
            where+=`&searchby=barcode&q=${this.state.any_1}`
        }
        this.props.dispatch(FetchBrg1(1,5,where));
    }
    handleSearch2(){
        let where='';
        if(this.state.any_2!==''){
            where+=`&searchby=barcode&q=${this.state.any_2}`
        }
        this.props.dispatch(FetchBrg2(1,5,where));
    }

    // static getDerivedStateFromProps(props, state) {
    //     let lokasi = typeof props.lokasi.data === 'object' ? props.lokasi.data : [];

    //     let locG = [];
    //     for(let i=0;i<lokasi.length;i++){
    //         locG.push({value:lokasi[i].kode,label:lokasi[i].nama_toko})
    //     }
    //     // this.setState({
    //     //     lokasi_data : locG
    //     // })
    //     state.lokasi_data = locG;
    //     return null;
    // }
    render(){
        const {lokasi_data,isArrLength} = this.state;
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        // let lokasi = typeof this.props.lokasi.data === 'object' ? this.props.lokasi.data : [];

        // let locG = [];
        // for(let i=0;i<lokasi.length;i++){
        //     locG.push({value:lokasi[i].kode,label:lokasi[i].nama_toko})
        // }
        // this.setState({
        //     lokasi_data : locG
        // })
        
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formPromo"}  size="lg" className={this.state.category==='brg'||this.state.category==='tm'||this.state.category==='bg'? "custom-map-modal":""}>
                <ModalHeader toggle={this.toggle}>
                    {isArrLength===0?"Tambah Promo":"Ubah Promo"}
                    {
                        this.state.category==='brg'||this.state.category==='tm'||this.state.category==='bg'? <small style={{color:"black",fontWeight:"bold"}}> ( Ceklis Daftar Barang Apabila Akan Didaftarkan Sebagai Barang Promo )</small>:""
                    }
                </ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className={this.state.category==='brg'||this.state.category==='tm'||this.state.category==='bg'?'col-md-4':'col-md-12'}>
                            <div className="form-group">
                                <label htmlFor="inputState" className="col-form-label"><input type="checkbox" name="hanya_member" checked={this.state.hanya_member} onChange={this.handleChange}/> Hanya Member</label>
                                &nbsp;&nbsp;&nbsp;
                                <label htmlFor="inputState" className="col-form-label"><input type="checkbox" name="tanpa_periode" checked={this.state.tanpa_periode} onChange={this.handleChange}/> Tanpa Periode</label>
                            </div>
                            <div className="row">
                                <div className={this.state.category==='spr'||this.state.category==='kelbrg'?"col-md-6":"col-md-12"} >
                                    <div className="form-group" style={this.state.hanya_member?{display:"block"}:{display:"none"}}>
                                        <label>Jenis Member</label>
                                        <Select options={this.state.jenis_member_data} placeholder="==== Pilih ====" onChange={this.handleChangeJenisMember} value={this.state.jenis_member_data.find(op => {return op.value === this.state.jenis_member})}/>
                                        <div className="invalid-feedback"
                                             style={this.state.error.jenis_member !== "" ? {display: 'block'} : {display: 'none'}}>
                                            {this.state.error.jenis_member}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Kategori</label>
                                        <Select options={this.state.category_data} placeholder="==== Pilih ====" onChange={this.handleChangeCategory} value={this.state.category_data.find(op => {return op.value === this.state.category})}/>
                                        <div className="invalid-feedback"
                                             style={this.state.error.category !== "" ? {display: 'block'} : {display: 'none'}}>
                                            {this.state.error.category}
                                        </div>
                                    </div>
                                    <div className="form-group" style={this.state.category==='kelbrg'?{display:"block"}:{display:"none"}}>
                                        <label>Kelompok Barang</label>
                                        <Select options={this.state.kel_brg_data} placeholder="==== Pilih ====" onChange={this.handleChangeKelBarang} value={this.state.kel_brg_data.find(op => {return op.value === this.state.kel_brg})}/>
                                        <div className="invalid-feedback"
                                             style={this.state.error.kel_brg !== "" ? {display: 'block'} : {display: 'none'}}>
                                            {this.state.error.kel_brg}
                                        </div>
                                    </div>
                                    <div className="form-group" style={this.state.category==='spr'?{display:"block"}:{display:"none"}}>
                                        <label>Supplier</label>
                                        <Select options={this.state.supplier_data} placeholder="==== Pilih ====" onChange={this.handleChangeSupplier} value={this.state.supplier_data.find(op => {return op.value === this.state.supplier})}/>
                                        <div className="invalid-feedback"
                                             style={this.state.error.supplier !== "" ? {display: 'block'} : {display: 'none'}}>
                                            {this.state.error.supplier}
                                        </div>
                                    </div>
                                    <div className="form-group" style={!this.state.tanpa_periode?{display:'block'}:{display:'none'}}>
                                        <label>Tanggal Mulai</label>
                                        <input type="datetime-local" name="tgl_mulai" className="form-control" value={this.state.tgl_mulai} onChange={this.handleChange}/>
                                        <div className="invalid-feedback"
                                             style={this.state.error.tgl_mulai !== "" ? {display: 'block'} : {display: 'none'}}>
                                            {this.state.error.tgl_mulai}
                                        </div>
                                    </div>
                                    <div className="form-group" style={!this.state.tanpa_periode?{display:'block'}:{display:'none'}}>
                                        <label>Tanggal Selesai</label>
                                        <input type="datetime-local" name="tgl_selesai" className="form-control" value={this.state.tgl_selesai} onChange={this.handleChange}/>
                                        <div className="invalid-feedback"
                                             style={this.state.error.tgl_selesai !== "" ? {display: 'block'} : {display: 'none'}}>
                                            {this.state.error.tgl_selesai}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="inputState" className="col-form-label"><input type="checkbox" name="checked_lokasi" value={this.state.isCheckedLokasi} onChange={this.handleChange}/> Pilih Semua Lokasi</label>
                                        {
                                            this.state.isCheckedLokasi?(
                                                <input type="text" value={this.state.lokasi} className="form-control" readOnly={true}/>
                                            ):(
                                                <Select
                                                    required isMulti
                                                    value={this.state.selectedOption}
                                                    // value={lokasi_data.find(op => {return op.value === this.state.lokasi})}
                                                    onChange={this.handleChangeLokasi}
                                                    options={lokasi_data}
                                                    name="lokasi"
                                                />
                                            )
                                        }
                                        <div className="invalid-feedback"
                                             style={this.state.error.lokasi !== "" ? {display: 'block'} : {display: 'none'}}>
                                            {this.state.error.lokasi}
                                        </div>

                                    </div>
                                </div>
                                <div className={this.state.category==='spr'||this.state.category==='kelbrg'?"col-md-6":"col-md-12"} >
                                    <div className="form-group">
                                        <label>Keterangan</label>
                                        <input type="text" name="keterangan" className="form-control" value={this.state.keterangan} onChange={this.handleChange}/>
                                        <div className="invalid-feedback"
                                             style={this.state.error.keterangan !== "" ? {display: 'block'} : {display: 'none'}}>
                                            {this.state.error.keterangan}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Minimal Transaksi</label>
                                        <input type="text" name="min_trx" className="form-control" value={toCurrency(this.state.min_trx)} onChange={this.handleChange}/>
                                        <div className="invalid-feedback"
                                             style={this.state.error.min_trx !== "" ? {display: 'block'} : {display: 'none'}}>
                                            {this.state.error.min_trx}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="inputState" className="col-form-label">Foto</label><br/>
                                        <FileBase64 multiple={ false } className="mr-3 form-control-file" onDone={ this.getFiles.bind(this) } />
                                    </div>

                                    <div className="form-group" style={this.state.category==='kelbrg'||this.state.category==='spr'?{display:"block"}:{display:"none"}}>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label htmlFor="">Diskon 1 Persen</label>
                                                <input className="form-control" type="number" name="diskon1" value={
                                                    parseInt(this.state.diskon1,10)<0?0:(this.state.isCheckedDiskonPersen?parseInt(this.state.diskon1,10)>100?'':this.state.diskon1:this.state.diskon1)
                                                } onChange={this.handleChange}/>
                                                <small style={{fontWeight:"bold",color:"red"}}>
                                                    {this.state.isCheckedDiskonPersen?parseInt(this.state.diskon1,10)>100?'inputan tidak boleh lebih dari 100':'':''}
                                                    {parseInt(this.state.diskon1,10)<0?'inputan tidak boleh berisi angka negatif':''}
                                                </small>

                                                <div className="invalid-feedback"
                                                     style={this.state.error.diskon1 !== "" ? {display: 'block'} : {display: 'none'}}>
                                                    {this.state.error.diskon1}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="">Diskon 2 Persen</label>
                                                <input className="form-control" type="number" name="diskon2" value={
                                                    parseInt(this.state.diskon2,10)<0?0:(this.state.isCheckedDiskonPersen?parseInt(this.state.diskon2,10)>100?'':this.state.diskon2:this.state.diskon2)
                                                } onChange={this.handleChange}/>
                                                <small style={{fontWeight:"bold",color:"red"}}>
                                                    {this.state.isCheckedDiskonPersen?parseInt(this.state.diskon2,10)>100?'inputan tidak boleh lebih dari 100':'':''}
                                                    {parseInt(this.state.diskon2,10)<0?'inputan tidak boleh berisi angka negatif':''}
                                                </small>
                                                <div className="invalid-feedback"
                                                     style={this.state.error.diskon2 !== "" ? {display: 'block'} : {display: 'none'}}>
                                                    {this.state.error.diskon2}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>








                        </div>
                        <div className="col-md-8" style={this.state.category==='brg'||this.state.category==='tm'||this.state.category==='bg'?{display:"block",zoom:"80%"}:{display:"none"}}>
                            {/*TABLE BARANG KATEGORI (BARANG,TEBUS MURAH)*/}
                            <div style={{"float":"left","marginBottom":"10px"}}>
                                <div className="input-group mb-3">
                                    <input type="text" name={"any_1"} className={"form-control"} placeholder={"cari barcode"} value={this.state.any_1} onChange={this.handleChange} onKeyPress = {
                                        event => {
                                            if (event.key === 'Enter') {
                                                this.handleSearch1();
                                            }
                                        }
                                    }/>
                                    <div className="input-group-prepend">
                                        <button className={"btn btn-primary"} onClick = {
                                            event => {
                                                event.preventDefault();
                                                this.handleSearch1();
                                            }
                                        }><i className={"fa fa-search"}/></button>
                                    </div>
                                </div>
                            </div>
                            <div style={{"float":"right","marginBottom":"10px"}}>
                                <Paginationq
                                    current_page={parseInt(this.props.barang1.current_page,10)}
                                    per_page={parseInt(this.props.barang1.per_page,10)}
                                    total={parseInt(this.props.barang1.total,10)}
                                    callback={this.handlePagin1.bind(this)}
                                />
                            </div>
                            <div className="table-responsive" style={this.state.category==='brg'||this.state.category==='tm'? {overflowX: 'auto',height:"auto"}:{overflowX: 'auto',height:"auto"}}>
                                <table className="table table-hover table-bordered">
                                    <thead className="bg-light">
                                    <tr>
                                        <th style={columnStyle}>No</th>
                                        <th style={columnStyle}>#</th>
                                        <th style={columnStyle}>Nama</th>
                                        <th style={columnStyle}>Barcode</th>
                                        <th style={columnStyle}>Harga jual</th>
                                        {this.state.category==='tm'?<th style={columnStyle}>Harga Tebus</th>:(this.state.category==='bg'?<th style={columnStyle}>Min Beli ( Qty )</th>:"")}
                                        {this.state.category==='tm'||this.state.category==='bg'?'':<th style={columnStyle}>Diskon 1</th>}
                                        {this.state.category==='tm'||this.state.category==='bg'?'':<th style={columnStyle}>Diskon 2</th>}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.barang_data.length>0?this.state.barang_data.map((v,i)=>{
                                            return (
                                                <tr>
                                                    <td style={columnStyle}> {i+1 + (5 * (parseInt(this.props.barang1.current_page,10)-1))}</td>
                                                    <td style={columnStyle}>
                                                        <input type="checkbox" name="checked" checked={v.checked} onChange={(e)=>this.handleChangeDynamic(e,i)}/>
                                                    </td>
                                                    <td style={columnStyle}>{v.nm_brg}</td>
                                                    <td style={columnStyle}>{v.barcode}</td>
                                                    <td style={columnStyle}>{toRp(v.harga)}</td>
                                                    {
                                                        this.state.category==='tm' ?(
                                                            <td style={columnStyle}>
                                                                <input style={{textAlign:"right"}} type="text" name="qty" className="form-control" value={v.qty} onChange={(e)=>this.handleChangeDynamic(e,i)}/>
                                                            </td>
                                                        ):(this.state.category==='bg'?<td style={columnStyle}>
                                                            <input style={{textAlign:"right"}} type="text" name="qty" className="form-control" value={v.qty} onChange={(e)=>this.handleChangeDynamic(e,i)}/>
                                                        </td>:'')
                                                    }
                                                    {
                                                        this.state.category==='tm'||this.state.category==='bg'?"":(
                                                            <td style={columnStyle}>
                                                                <input style={{textAlign:"right"}} type="text" name="qty" className="form-control" value={
                                                                    v.checked===false?0:parseInt(v.qty,10)<0?0:(v.jenis==='persen'?parseInt(v.qty,10)>100?0:v.qty:v.qty)
                                                                } onChange={(e)=>this.handleChangeDynamic(e,i)}/>
                                                                {
                                                                    v.jenis==='persen'?
                                                                        parseInt(v.qty,10)>100 ?
                                                                            (<small style={{color:"red",fontWeight:"bold"}}>inputan tidak boleh lebih dari 100</small>)
                                                                            :""
                                                                        :''
                                                                }
                                                                {
                                                                    parseInt(v.qty,10)<0?<small style={{color:"red",fontWeight:"bold"}}>inputan tidak boleh berisi angka negatif</small>:""
                                                                }
                                                            </td>
                                                        )
                                                    }
                                                    {
                                                        this.state.category==='tm'||this.state.category==='bg'?"":(
                                                            <td style={columnStyle}>
                                                                <input style={{textAlign:"right"}} type="text" name="qty2" className="form-control" value={
                                                                    v.checked===false?0:parseInt(v.qty2,10)<0?0:(v.jenis==='persen'?parseInt(v.qty2,10)>100?0:v.qty2:v.qty2)
                                                                } onChange={(e)=>this.handleChangeDynamic(e,i)}/>
                                                                {
                                                                    v.jenis==='persen'?
                                                                        parseInt(v.qty2,10)>100 ?
                                                                            (<small style={{color:"red",fontWeight:"bold"}}>inputan tidak boleh lebih dari 100</small>)
                                                                            :""
                                                                        :''
                                                                }
                                                                {
                                                                    parseInt(v.qty2,10)<0?<small style={{color:"red",fontWeight:"bold"}}>inputan tidak boleh berisi angka negatif</small>:""
                                                                }
                                                            </td>
                                                        )
                                                    }
                                                </tr>
                                            );
                                        }):"No data."
                                    }
                                    </tbody>
                                </table>
                            </div>
                            <hr/>
                            {/*TABLE BARANG KATEGORI (BUY GET)*/}
                            <div style={localStorage.categoryPromo==='bg'?{display:"block","float":"left","marginBottom":"10px"}:{display:"none"}}>
                                <div className="input-group mb-3">
                                    <input type="text" name={"any_2"} className={"form-control"} placeholder={"cari barcode"} value={this.state.any_2} onChange={this.handleChange} onKeyPress = {
                                        event => {
                                            if (event.key === 'Enter') {
                                                this.handleSearch2();
                                            }
                                        }
                                    }/>
                                    <div className="input-group-prepend">
                                        <button className={"btn btn-primary"} onClick = {
                                            event => {
                                                event.preventDefault();
                                                this.handleSearch2();
                                            }
                                        }><i className={"fa fa-search"}/></button>
                                    </div>
                                </div>
                            </div>
                            <div style={localStorage.categoryPromo==='bg'?{display:"block","float":"right","marginBottom":"10px"}:{display:"none"}}>
                                <Paginationq
                                    current_page={parseInt(this.props.barang2.current_page,10)}
                                    per_page={parseInt(this.props.barang2.per_page,10)}
                                    total={parseInt(this.props.barang2.total,10)}
                                    callback={this.handlePagin2.bind(this)}
                                />
                            </div>
                            <div className="table-responsive" style={localStorage.categoryPromo==='bg'? {display:"block",overflowX: 'auto',height:'auto'}:{display:"none",overflowX: 'auto',height:"auto"}}>
                                <table className="table table-hover table-bordered">
                                    <thead className="bg-light">
                                    <tr>
                                        <th style={columnStyle}>No</th>
                                        <th style={columnStyle}>#</th>
                                        <th style={columnStyle}>Nama</th>
                                        <th style={columnStyle}>Barcode</th>
                                        <th style={columnStyle}>Harga jual</th>
                                        <th style={columnStyle}>Gratis ( Qty )</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.barang_data1.length>0?this.state.barang_data1.map((v,i)=>{
                                            return (
                                                <tr>
                                                    <td style={columnStyle}> {i+1 + (5 * (parseInt(this.props.barang2.current_page,10)-1))}</td>
                                                    <td style={columnStyle}>
                                                        <input type="checkbox" name="checked_bg" checked={v.checked_bg} onChange={(e)=>this.handleChangeDynamic(e,i)}/>
                                                    </td>
                                                    <td style={columnStyle}>{v.nm_brg}</td>
                                                    <td style={columnStyle}>{v.barcode}</td>
                                                    <td style={columnStyle}>{toRp(v.harga)}</td>
                                                    <td style={columnStyle}>
                                                        <input style={{textAlign:"right"}} type="number" name="qty_bg" className="form-control" value={v.checked_bg===false?0:v.qty_bg} onChange={(e)=>this.handleChangeDynamic(e,i)}/>
                                                    </td>

                                                </tr>
                                            );
                                        }):"No Data"
                                    }
                                    </tbody>
                                </table>
                            </div>

                        </div>

                    </div>

                </ModalBody>
                <ModalFooter>
                    <div className="form-group" style={{textAlign:"right"}}>
                        <button type="button" className="btn btn-warning mb-2 mr-2" onClick={this.toggle}><i className="ti-close" /> Cancel</button>
                        <button type="submit" className="btn btn-primary mb-2 mr-2" onClick={this.handleSubmit}><i className="ti-save" /> Simpan</button>
                    </div>
                </ModalFooter>
            </WrapperModal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
        barang1: state.promoReducer.dataBrg1,
        barang2: state.promoReducer.dataBrg2,
        customerType: state.customerTypeReducer.data,
    }
}
export default connect(mapStateToProps)(FormPromo);