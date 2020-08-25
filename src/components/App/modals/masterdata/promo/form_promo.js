import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {FormGroup, Input, Label, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import {stringifyFormData} from "helper";
import {createPromo} from "redux/actions/masterdata/promo/promo.action";
import Select from "react-select";
import {HEADERS} from "redux/actions/_constants";
// import {FetchBrg} from "redux/actions/masterdata/product/product.action";
import {FetchUserLevel} from "redux/actions/masterdata/user_level/user_level.action";
import {FetchCustomerType} from "redux/actions/masterdata/customer_type/customer_type.action";
import {FetchBrgSame} from "redux/actions/masterdata/product/product.action";
import {toRp} from "helper";
import moment from "moment";
import {FetchAllLocation} from "redux/actions/masterdata/location/location.action";
import FileBase64 from "react-file-base64";
import {FetchGroupProduct} from "redux/actions/masterdata/group_product/group_product.action";
import {FetchSupplierAll} from "redux/actions/masterdata/supplier/supplier.action";

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
        this.state = {
            barang_data:[],
            barang_data1:[],
            category: '',
            category_data:[],
            jenis_member: '',
            jenis_member_data:[],
            kel_brg: '',
            kel_brg_data:[],
            supplier: '',
            supplier_data:[],
            lokasi:"",
            lokasi_data:[],
            selectedOption:[],
            hanya_member:false,
            tanpa_periode:false,
            tgl_mulai:moment(new Date()).format('YYYY-MM-DDTHH:mm'),
            tgl_selesai:moment(new Date()).format('YYYY-MM-DDTHH:mm'),
            keterangan:'',
            min_trx:'',
            gambar:'-',
            diskon1:'',
            diskon2:'',
            kode_buy:'',
            kode_get:'',
            isCheckedLokasi:false,
            isCheckedDiskonPersen:true,
            isCheckedDiskonNominal:false,
            error:{
                category:'',jenis_member:'',tgl_mulai:'', tgl_selesai:'',lokasi:'',kel_brg:'',supplier:'',
                diskon1:'',diskon2:'',kode_buy:'',kode_get:'',min_trx:'',keterangan:'',barang1:'',barang2:''
            }
        };
    }
    getProps(param){
        console.log('get props',param)
        if(param.customerType.data!==undefined){
            let cust=[];
            param.customerType.data.map((v,i)=>{
                cust.push({
                    value:v.kode,
                    label:v.nama,
                })
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
            });
            this.setState({category_data:kategori});
        }
        if(param.barang!==undefined){
            let brg=param.barang;
            let brg1=param.barang;
            for(let i=0;i<brg.length;i++){
                Object.assign(brg[i],{qty:0,qty2:0,checked:false,jenis:"persen"});
            }
            for(let i=0;i<brg1.length;i++){
                Object.assign(brg1[i],{qty_bg:0,qty2_bg:0,checked_bg:false,jenis_bg:"persen"});
            }
            this.setState({barang_data:brg,barang_data1:brg1});
        }

        if(param.kel_barang.data!==undefined){
            let kel_brg=[];
            param.kel_barang.data.map((v,i)=>{
                kel_brg.push({
                    value:v.kel_brg,
                    label:v.nm_kel_brg,
                })
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
            });
            this.setState({supplier_data:supplier});
        }
        if(param.detail!==undefined){
            let str = param.detail.lokasi;
            if(str!==undefined){
                let ar = str.split(',');
                let loc=[];
                if(param.lokasi.data!==undefined){
                    for(let i=0;i<param.lokasi.data.length;i++){
                        for(let x=0;x<ar.length;x++){
                            if(param.lokasi.data[i].kode === ar[x]){
                                loc.push({value:ar[x],label:param.lokasi.data[i].nama_toko});
                            }
                        }
                    }
                }
                this.setState({
                    selectedOption:loc,
                })
            }

            this.setState({
                category:param.detail.category,
                keterangan:param.detail.keterangan,
                tgl_mulai:moment(param.detail.daritgl).format('YYYY-MM-DDTHH:mm'),
                tgl_selesai:moment(param.detail.sampaitgl).format('YYYY-MM-DDTHH:mm'),
            });
            if(param.detail.detail !== undefined){
                if(param.detail.detail.length>0){
                    if(param.detail.category==='kelbrg'){
                        this.handleChangeKelBarang({value:param.detail.detail[0].kd_brg});
                    }
                    if(param.detail.category==='bg'){
                        for(let x=0;x<param.detail.detail.length;x++){
                            // console.log("KODE BARANG",param.detail.detail[x].kd_brg);
                            console.log("BARANG STATE",this.state.barang_data);
                            for(let i=0;i<this.state.barang_data.length;i++){
                                // console.log("BARCODE",this.state.barang_data[i].barcode);

                                if(this.state.barang_data[i].barcode === param.detail.detail[x].kd_brg){
                                    if(param.detail.detail[x].isbuy===1){
                                        Object.assign(this.state.barang_data[i],{qty:0,qty2:0,checked:true,jenis:"persen"});
                                    }

                                }
                            }
                            for(let i=0;i<this.state.barang_data1.length;i++){
                                if(this.state.barang_data1[i].barcode === param.detail.detail[x].kd_brg){
                                    if(param.detail.detail[x].isbuy===0){
                                        Object.assign(this.state.barang_data1[i],{qty_bg:0,qty2_bg:0,checked_bg:true,jenis_bg:"persen"});
                                    }

                                }
                            }
                        }
                        // this.setState({barang_data:brg});
                        // console.log("PUSH BARANG DATA 1",brg);


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
            }else{
                this.setState({
                    tanpa_periode:false
                })
            }

        }

    }
    componentWillMount(){
        this.getProps(this.props);


    }
    componentWillReceiveProps(nextProps){
        this.getProps(nextProps);

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
                });
                this.setState({lokasi:'',isCheckedLokasi:false});
            }

        }
    }
    handleChangeCategory(val){
        console.log("kategori",val);
        let err = Object.assign({}, this.state.error, {
            category: ""
        });
        this.setState({
            category:val.value,
            error: err
        });

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
        console.log(val);
        let err = Object.assign({}, this.state.error, {
            lokasi: ""
        });
        if(val!==null){
            this.setState({selectedOption:val,error:err});
        }
    }
    handleChangeKelBarang(val){
        console.log(val.value)
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
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.setState({})
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
    handleSubmit(e){
        e.preventDefault();
        let parseData={};

        parseData['category']=this.state.category;
        parseData['daritgl']=this.state.tgl_mulai===''?moment(new Date()).format("yyyy-MM-DD HH:mm:ss"):moment(this.state.tgl_mulai).format("yyyy-MM-DD HH:mm:ss");
        parseData['sampaitgl']=this.state.tgl_selesai===''?moment(new Date()).format("yyyy-MM-DD HH:mm:ss"):moment(this.state.tgl_selesai).format("yyyy-MM-DD HH:mm:ss");
        parseData['lokasi']=this.state.lokasi.toString();
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
        if(parseData['lokasi']===''||parseData['lokasi']===undefined){
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
                        barcode:v.barcode, diskon:v.qty, diskon2:v.qty2, min_trx:0, min_qty:0, open_price:0, hrg_jual:v.harga, bonus:0, isbuy:0
                    })
                }
            }
            if(this.state.category==='tm'){
                if(v.checked === true){
                    detail.push({
                        barcode:v.barcode, diskon:0, diskon2:0, min_trx:this.state.min_trx, min_qty:0, open_price:v.qty, hrg_jual:v.harga, bonus:0, isbuy:0
                    })
                }
            }
        });
        if(this.state.category==='kelbrg'){
            detail.push({
                barcode:this.state.kel_brg, diskon:this.state.diskon1, diskon2:this.state.diskon1, min_trx:this.state.min_trx, min_qty:0, open_price:0, hrg_jual:0, bonus:0, isbuy:0
            })
        }
        if(this.state.category==='spr'){
            detail.push({
                barcode:this.state.supplier, diskon:this.state.diskon1, diskon2:this.state.diskon1, min_trx:this.state.min_trx, min_qty:0, open_price:0, hrg_jual:0, bonus:0, isbuy:0
            })
        }
        if(this.state.category==='bg'){
            this.state.barang_data.map((v,i)=>{
                if(v.checked === true){
                    detail.push({
                        barcode:v.barcode, diskon:0, diskon2:0, min_trx:0, min_qty:v.qty, open_price:0, hrg_jual:v.harga, bonus:0, isbuy:1
                    })
                }
            });
            this.state.barang_data1.map((v,i)=>{
                if(v.checked_bg===true){
                    detail.push({
                        barcode:v.barcode, diskon:0, diskon2:0, min_trx:0, min_qty:0, open_price:0, hrg_jual:v.harga, bonus:v.qty_bg, isbuy:0
                    })
                }
            });
        }
        parseData['detail']=detail;
        this.props.dispatch(createPromo(parseData));
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.setState({})
        console.log("submitted",parseData);


    }
    render(){
        const {lokasi_data} = this.state;
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        let lokasi = typeof this.props.lokasi.data === 'object' ? this.props.lokasi.data : [];
        let locG = [];
        for(let i=0;i<lokasi.length;i++){
            locG.push({value:lokasi[i].kode,label:lokasi[i].nama_toko})
        }
        this.state.lokasi_data = locG;
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formPromo"}  size="lg" style={this.state.category==='brg'||this.state.category==='tm'||this.state.category==='bg'? {maxWidth: '1600px', width: '100%'}:{}}>
                <ModalHeader toggle={this.toggle}>
                    {this.props.detail.length===0?"Add Promo":"Update Promo"}
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
                                        <input type="text" name="min_trx" className="form-control" value={this.state.min_trx} onChange={this.handleChange}/>
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
                                        <label>Tipe Diskon</label>
                                        <br/>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="diskonPersen" checked={this.state.isCheckedDiskonPersen} value={this.state.isCheckedDiskonPersen} onChange={this.handleChange}/>
                                            <label className="form-check-label">Persen (%)</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="diskonNominal" checked={this.state.isCheckedDiskonNominal} value={this.state.isCheckedDiskonNominal} onChange={this.handleChange}/>
                                            <label className="form-check-label">Nominal (rp)</label>
                                        </div>
                                    </div>
                                    <div className="form-group" style={this.state.category==='kelbrg'||this.state.category==='spr'?{display:"block"}:{display:"none"}}>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label htmlFor="">Diskon 1 {this.state.isCheckedDiskonPersen?'Persen':'Nominal'}</label>
                                                <input className="form-control" type="number" name="diskon1" value={
                                                    parseInt(this.state.diskon1)<0?0:(this.state.isCheckedDiskonPersen?parseInt(this.state.diskon1)>100?0:this.state.diskon1:this.state.diskon1)
                                                } onChange={this.handleChange}/>
                                                <small style={{fontWeight:"bold",color:"red"}}>
                                                    {this.state.isCheckedDiskonPersen?parseInt(this.state.diskon1)>100?'inputan tidak boleh lebih dari 100':'':''}
                                                    {parseInt(this.state.diskon1)<0?'inputan tidak boleh berisi angka negatif':''}
                                                </small>
                                                <div className="invalid-feedback"
                                                     style={this.state.error.diskon1 !== "" ? {display: 'block'} : {display: 'none'}}>
                                                    {this.state.error.diskon1}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="">Diskon 2 {this.state.isCheckedDiskonPersen?'Persen':'Nominal'}</label>
                                                <input className="form-control" type="number" name="diskon2" value={
                                                    parseInt(this.state.diskon2)<0?0:(this.state.isCheckedDiskonPersen?parseInt(this.state.diskon2)>100?0:this.state.diskon2:this.state.diskon2)
                                                } onChange={this.handleChange}/>
                                                <small style={{fontWeight:"bold",color:"red"}}>
                                                    {this.state.isCheckedDiskonPersen?parseInt(this.state.diskon2)>100?'inputan tidak boleh lebih dari 100':'':''}
                                                    {parseInt(this.state.diskon2)<0?'inputan tidak boleh berisi angka negatif':''}
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
                        <div className="col-md-8" style={this.state.category==='brg'||this.state.category==='tm'||this.state.category==='bg'?{display:"block"}:{display:"none"}}>
                            {/*TABLE BARANG KATEGORI (BARANG,TEBUS MURAH)*/}

                            <div className="table-responsive" style={this.state.category==='brg'||this.state.category==='tm'? {overflowX: 'auto',height:"auto"}:{overflowX: 'auto',height:"250px"}}>
                                <table className="table table-hover table-bordered">
                                    <thead className="bg-light">
                                    <tr>
                                        <th style={columnStyle}>No</th>
                                        <th style={columnStyle}>#</th>
                                        <th style={columnStyle}>Nama</th>
                                        <th style={columnStyle}>Barcode</th>
                                        <th style={columnStyle}>Harga jual</th>
                                        {this.state.category==='tm'?<th style={columnStyle}>Harga Tebus</th>:(this.state.category==='bg'?<th style={columnStyle}>Min Beli ( Qty )</th>:<th style={columnStyle}>Jenis</th>)}
                                        {this.state.category==='tm'||this.state.category==='bg'?'':<th style={columnStyle}>Diskon 1</th>}
                                        {this.state.category==='tm'||this.state.category==='bg'?'':<th style={columnStyle}>Diskon 2</th>}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.barang_data.map((v,i)=>{
                                            return (
                                                <tr>
                                                    <td style={columnStyle}>{i+1}</td>
                                                    <td style={columnStyle}>
                                                        <input type="checkbox" name="checked" checked={v.checked} onChange={(e)=>this.handleChangeDynamic(e,i)}/>
                                                    </td>
                                                    <td style={columnStyle}>{v.nm_brg}</td>
                                                    <td style={columnStyle}>{v.barcode}</td>
                                                    <td style={columnStyle}>{toRp(v.harga)}</td>
                                                    {
                                                        this.state.category==='tm' ?(
                                                            <td style={columnStyle}>
                                                                <input style={{textAlign:"right"}} type="number" name="qty" className="form-control" value={v.qty} onChange={(e)=>this.handleChangeDynamic(e,i)}/>
                                                            </td>
                                                        ):(this.state.category==='bg'?<td style={columnStyle}>
                                                            <input style={{textAlign:"right"}} type="number" name="qty" className="form-control" value={v.qty} onChange={(e)=>this.handleChangeDynamic(e,i)}/>
                                                        </td>:'')
                                                    }
                                                    {
                                                        this.state.category==='tm'||this.state.category==='bg'?"":(
                                                            <td style={columnStyle}>
                                                                <select name="jenis" className="form-control" value={v.jenis} defaultValue={v.jenis} onChange={(e)=>this.handleChangeDynamic(e,i)}>
                                                                    <option value="persen">Persen (%)</option>
                                                                    <option value="nominal">Nominal (rp)</option>
                                                                </select>
                                                            </td>
                                                        )
                                                    }

                                                    {
                                                        this.state.category==='tm'||this.state.category==='bg'?"":(
                                                            <td style={columnStyle}>
                                                                <input style={{textAlign:"right"}} type="number" name="qty" className="form-control" value={
                                                                    parseInt(v.qty)<0?0:(v.jenis==='persen'?parseInt(v.qty)>100?0:v.qty:v.qty)
                                                                } onChange={(e)=>this.handleChangeDynamic(e,i)}/>
                                                                {
                                                                    v.jenis==='persen'?
                                                                        parseInt(v.qty)>100 ?
                                                                            (<small style={{color:"red",fontWeight:"bold"}}>inputan tidak boleh lebih dari 100</small>)
                                                                            :""
                                                                        :''
                                                                }
                                                                {
                                                                    parseInt(v.qty)<0?<small style={{color:"red",fontWeight:"bold"}}>inputan tidak boleh berisi angka negatif</small>:""
                                                                }
                                                            </td>
                                                        )
                                                    }
                                                    {
                                                        this.state.category==='tm'||this.state.category==='bg'?"":(
                                                            <td style={columnStyle}>
                                                                <input style={{textAlign:"right"}} type="number" name="qty2" className="form-control" value={
                                                                    parseInt(v.qty2)<0?0:(v.jenis==='persen'?parseInt(v.qty2)>100?0:v.qty2:v.qty2)
                                                                } onChange={(e)=>this.handleChangeDynamic(e,i)}/>
                                                                {
                                                                    v.jenis==='persen'?
                                                                        parseInt(v.qty2)>100 ?
                                                                            (<small style={{color:"red",fontWeight:"bold"}}>inputan tidak boleh lebih dari 100</small>)
                                                                            :""
                                                                        :''
                                                                }
                                                                {
                                                                    parseInt(v.qty2)<0?<small style={{color:"red",fontWeight:"bold"}}>inputan tidak boleh berisi angka negatif</small>:""
                                                                }
                                                            </td>
                                                        )
                                                    }
                                                </tr>
                                            );
                                        })
                                    }
                                    </tbody>
                                </table>
                            </div>
                            {/*TABLE BARANG KATEGORI (BUY GET)*/}

                            <div className="table-responsive" style={this.state.category==='bg'? {display:"block",overflowX: 'auto',height:"250px"}:{display:"none",overflowX: 'auto',height:"auto"}}>
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
                                        this.state.barang_data1.map((v,i)=>{
                                            return (
                                                <tr>
                                                    <td style={columnStyle}>{i+1}</td>
                                                    <td style={columnStyle}>
                                                        <input type="checkbox" name="checked_bg" checked={v.checked_bg} onChange={(e)=>this.handleChangeDynamic(e,i)}/>
                                                    </td>
                                                    <td style={columnStyle}>{v.nm_brg}</td>
                                                    <td style={columnStyle}>{v.barcode}</td>
                                                    <td style={columnStyle}>{toRp(v.harga)}</td>
                                                    <td style={columnStyle}>
                                                        <input style={{textAlign:"right"}} type="number" name="qty_bg" className="form-control" value={v.qty_bg} onChange={(e)=>this.handleChangeDynamic(e,i)}/>
                                                    </td>

                                                </tr>
                                            );
                                        })
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                </ModalBody>
                <ModalFooter>
                    <div className="form-group" style={{textAlign:"right"}}>
                        <button type="button" className="btn btn-warning mb-2 mr-2"><i className="ti-close" /> Cancel</button>
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

    }
}
export default connect(mapStateToProps)(FormPromo);