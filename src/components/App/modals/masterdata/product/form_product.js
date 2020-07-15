import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalHeader} from "reactstrap";
import connect from "react-redux/es/connect/connect";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {stringifyFormData} from "helper";
import {createProduct} from "redux/actions/masterdata/product/product.action";

class FormProduct extends Component{
    constructor(props){
        super(props);
        this.state = {
            isShowFinish : false,
            isCustomizeVisible: true,
            selectedOption: null,
            selectedIndex:0,
            kd_brg:'',
            nm_brg:'',
            kel_brg:'',
            stock:'0',
            kategori:'0',
            stock_min:'0',
            group1:'',
            group2:'',
            deskripsi:'-',
            gambar:'',
            jenis:'1',
            kcp:'',
            poin:'0',
            online:'0',
            berat:'0',
            barangSku:[{"barcode":"0","qty":"0","konversi":"0","satuan_jual":"0"}],
            barangHarga:[{
                "lokasi": "",
                "isCheckedPCS":false, "isCheckedPACK":false, "isCheckedKARTON":false,
                "hrgBeliPCS": "0", "hrgBeliPACK": "0", "hrgBeliKARTON": "0",
                "margin1PCS":"0","margin2PCS":"0","margin3PCS":"0","margin4PCS":"0",
                "margin1PACK":"0","margin2PACK":"0","margin3PACK":"0","margin4PACK":"0",
                "margin1KARTON":"0","margin2KARTON":"0","margin3KARTON":"0","margin4KARTON":"0",
                "hrgJual1PCS":"0","hrgJual2PCS":"0","hrgJual3PCS":"0","hrgJual4PCS":"0",
                "hrgJual1PACK":"0","hrgJual2PACK":"0","hrgJual3PACK":"0","hrgJual4PACK":"0",
                "hrgJual1KARTON":"0","hrgJual2KARTON":"0","hrgJual3KARTON":"0","hrgJual4KARTON":"0",
                "ppnPCS": "0", "ppnPACK": "0", "ppnKARTON": "0",
                "servicePCS": "0", "servicePACK": "0", "serviceKARTON": "0",
            }],
            barcode:[],
            qty:[],
            konversi:[],
            satuan_jual:[],
            isChecked:false,
            PACK:false,
            KARTON:false,
            check : [],
            hrg_beli:'',
            hrg_beli_pack:'',
            hrg_beli_karton:'',
            margin1:'', margin2:'', margin3:'', margin4:'',
            margin1_pack:'', margin2_pack:'', margin3_pack:'', margin4_pack:'',
            margin1_karton:'', margin2_karton:'', margin3_karton:'', margin4_karton:'',
            hrgjual1:'', hrgjual2:'', hrgjual3:'', hrgjual4:'',
            hrgjual1_pack:'', hrgjual2_pack:'',hrgjual3_pack:'', hrgjual4_pack:'',
            hrgjual1_karton:'', hrgjual2_karton:'', hrgjual3_karton:'', hrgjual4_karton:'',
            service:'', service_pack:'', service_karton:'',
            ppn:'', ppn_pack:'', ppn_karton:'',
            purchasePrice: {}
        };
        this.handleChange = this.handleChange.bind(this);
        this.onHandleChangeChild = this.onHandleChangeChild.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggle = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.setState({

        })
    };

    componentWillReceiveProps(nextProps){
        console.log("componentWillReceiveProps");
        localStorage.setItem("isReadonlySama","false");
        localStorage.setItem("isReadonlySamaPack","false");
        localStorage.setItem("isReadonlySamaKarton","false");
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
                brgHrg.push({
                    "nama_toko":v.nama_toko,"lokasi": v.kode,
                    "isCheckedPCS":false, "isCheckedPACK":false, "isCheckedKARTON":false,
                    "hrgBeliPCS": "0", "hrgBeliPACK": "0", "hrgBeliKARTON": "0",
                    "margin1PCS":"0","margin2PCS":"0","margin3PCS":"0","margin4PCS":"0",
                    "margin1PACK":"0","margin2PACK":"0","margin3PACK":"0","margin4PACK":"0",
                    "margin1KARTON":"0","margin2KARTON":"0","margin3KARTON":"0","margin4KARTON":"0",
                    "hrgJual1PCS":"0","hrgJual2PCS":"0","hrgJual3PCS":"0","hrgJual4PCS":"0",
                    "hrgJual1PACK":"0","hrgJual2PACK":"0","hrgJual3PACK":"0","hrgJual4PACK":"0",
                    "hrgJual1KARTON":"0","hrgJual2KARTON":"0","hrgJual3KARTON":"0","hrgJual4KARTON":"0",
                    "ppnPCS": "0", "ppnPACK": "0", "ppnKARTON": "0",
                    "servicePCS": "0", "servicePACK": "0", "serviceKARTON": "0",
                });
            });
            console.log("ABRANG PUSH",brgHrg);
            this.setState({
                barangHarga:brgHrg
            });
        }
        // this.setState({barangHrg:brgHrg});
    }
    // onHandleChangeChild
    handleChange(event,i){
        let name = event.target.name;
        let val = event.target.value;
        console.log([event.target.name],i);
        this.setState({ [event.target.name]: event.target.value });
        console.log(localStorage.getItem("form_product"));
        if(i!==null){
            let barangSku = [...this.state.barangSku];
            barangSku[i] = {...barangSku[i], [event.target.name]: event.target.value};
            this.setState({ barangSku });
        }
        if(event.target.name === 'jenis'){
            if(event.target.value === '0'){
                localStorage.setItem("colBrgSku","3");
                let brgSku = [];
                for(let i=0;i<3;i++){
                    brgSku.push({"barcode":"0","qty":"0","konversi":"0","satuan_jual":"0"})
                }
                this.setState({barangSku: brgSku});
                // this.state.barangSku.push({[event.target.name]:event.target.value});
            }else{
                localStorage.setItem("colBrgSku","1");
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
        if(localStorage.getItem("samarata") === "true"){
            for(let i=0;i<this.state.barangHarga.length;i++){
                if(name === 'hrg_beli'){
                    this.state.barangHarga[i].hrgBeliPCS = val;
                }
                if(name === 'margin1'){
                    this.state.barangHarga[i].margin1PCS = val;
                    // this.state.barangHarga[i].hrgJual1PCS = this.state.hrgjual1;
                }
                if(name === 'margin2'){this.state.barangHarga[i].margin2PCS = val;}
                if(name === 'margin3'){this.state.barangHarga[i].margin3PCS = val;}
                if(name === 'margin4'){this.state.barangHarga[i].margin4PCS = val;}
                if(name === 'hrgjual1'){this.state.barangHarga[i].hrgJual1PCS = val;}
                if(name === 'hrgjual2'){this.state.barangHarga[i].hrgJual2PCS = val;}
                if(name === 'hrgjual3'){this.state.barangHarga[i].hrgJual3PCS = val;}
                if(name === 'hrgjual4'){this.state.barangHarga[i].hrgJual4PCS = val;}
                if(name === 'service'){this.state.barangHarga[i].servicePCS = val;}
                if(name === 'ppn'){this.state.barangHarga[i].ppnPCS = val;}
            }
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
                hrgjual1_pack : parseInt(val*qty_konversi[1]),
                hrgjual1_karton : parseInt(val*qty_konversi[2]),
            });
        }
        if(name === "hrgjual2"){
            this.setState({
                margin2:((parseInt(val)-parseInt(this.state.hrg_beli))/parseInt(this.state.hrg_beli))*100,
                hrgjual2_pack : parseInt(val*qty_konversi[1]),
                hrgjual2_karton : parseInt(val*qty_konversi[2]),
            });
        }
        if(name === "hrgjual3"){
            this.setState({
                margin3:((parseInt(val)-parseInt(this.state.hrg_beli))/parseInt(this.state.hrg_beli))*100,
                hrgjual3_pack : parseInt(val*qty_konversi[1]),
                hrgjual3_karton : parseInt(val*qty_konversi[2]),

            });
        }
        if(name === "hrgjual4"){
            this.setState({
                margin4:((parseInt(val)-parseInt(this.state.hrg_beli))/parseInt(this.state.hrg_beli))*100,
                hrgjual4_pack : parseInt(val*qty_konversi[1]),
                hrgjual4_karton : parseInt(val*qty_konversi[2]),
            });
        }
        //hrg beli = 5000*10/100
        if(name === "margin1"){
            this.setState({
                hrgjual1:parseInt(this.state.hrg_beli) * (parseInt(val)/100) + parseInt(this.state.hrg_beli),
            })
        }
        if(name === "margin2"){this.setState({hrgjual2:(parseInt(this.state.hrg_beli)*(parseInt(val)/100))+parseInt(this.state.hrg_beli)})}
        if(name === "margin3"){this.setState({hrgjual3:(parseInt(this.state.hrg_beli)*(parseInt(val)/100))+parseInt(this.state.hrg_beli)})}
        if(name === "margin4"){this.setState({hrgjual4:(parseInt(this.state.hrg_beli)*(parseInt(val)/100))+parseInt(this.state.hrg_beli)})}

        //input margin = hrg_beli + hrg_beli*(10/100)

    }

    handleSelect = (index) => {

        this.setState({selectedIndex: index}, () => {
            console.log('Selected tab: ' + this.state.selectedIndex);
            if(index === 0){
                localStorage.setItem("form1",JSON.stringify({
                    "kd_brg":this.state.kd_brg,
                    "nm_brg":this.state.nm_brg,
                    "kel_brg":this.state.kel_brg,
                    "stock":this.state.stock,
                    "kategori":this.state.kategori,
                    "stock_min":this.state.stock_min,
                    "group1":this.state.group1,
                    "group2":this.state.group2,
                    "deskripsi":this.state.deskripsi,
                    "gambar":this.state.gambar,
                    "jenis":this.state.jenis,
                    "kcp":this.state.kcp,
                    "poin":this.state.poin,
                    "online":this.state.online,
                    "berat":this.state.berat,
                }));
            }

        });


        console.log(localStorage.getItem("form_product"))

    };

    onHandleChangeChild = (name,i) => event => {
        console.log("I",i);
        console.log("NAME",name);
        console.log("VALUE",event.target.value);
        this.setState({
            [name]: event.target.value,
        });
        let barangHarga = [...this.state.barangHarga];
        barangHarga[i] = {...barangHarga[i], [event.target.name]: event.target.value};
        this.setState({ barangHarga });

    };
    handleAllChecked = (event) => {
        console.log(event.target.checked);
        let cik=[];
        event.target.checked===true?localStorage.setItem("isReadonly","true"):localStorage.setItem("isReadonly","false");

        for(let i=0;i<this.state.barangHarga.length;i++){
            this.state.barangHarga[i].isCheckedPCS = event.target.checked;
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
    handleAllCheckedSku(event,i){
        console.log(event.target.checked);
        console.log(event.target.name);
        if(event.target.name === 'PACK'){
            event.target.checked===true?localStorage.setItem("isReadonlySamaPack","true"):localStorage.setItem("isReadonlySamaPack","false");
            event.target.checked===true?localStorage.setItem("isReadonlyPack","true"):localStorage.setItem("isReadonlyPack","false");
            event.target.checked===true?localStorage.setItem("samarata_pack","true"):localStorage.setItem("samarata_pack","false");
            let data=this.state.barangHarga;
            data.map((v,i)=>{
               Object.assign(v,{"isCheckedPACK":event.target.checked})
            });
            this.setState({barangHarga: data});

        }
        if(event.target.name === 'KARTON'){
            event.target.checked===true?localStorage.setItem("isReadonlySamaKarton","true"):localStorage.setItem("isReadonlySamaKarton","false");
            event.target.checked===true?localStorage.setItem("isReadonlyKarton","true"):localStorage.setItem("isReadonlyKarton","false");
            event.target.checked===true?localStorage.setItem("samarata_karton","true"):localStorage.setItem("samarata_karton","false");
            let data=this.state.barangHarga;
            data.map((v,i)=>{
                Object.assign(v,{"isCheckedKARTON":event.target.checked})
            });
            this.setState({barangHarga: data});
        }
    }
    handleCheckChieldElementKarton(e,i,kode){
        this.setState((state, props) => {
            state.barangHarga[i].isCheckedKARTON = !state.barangHarga[i].isCheckedKARTON;
            return {
                barangHarga: state.barangHarga
            }
        });
    }
    handleCheckChieldElementPack(e,i,kode){
        this.setState((state, props) => {
            state.barangHarga[i].isCheckedPACK = !state.barangHarga[i].isCheckedPACK;
            return {
                barangHarga: state.barangHarga
            }
        });
    }
    handleCheckChieldElement = (i) => (event=>{
        this.setState((state, props) => {
            state.barangHarga[i].isCheckedPCS = !state.barangHarga[i].isCheckedPCS;
            return {
                barangHarga: state.barangHarga
            }
        });
    });
    handleChangeMore(e){
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
        // if(e.target.name === 'hrg_beli_pack'){this.setState({hrg_beli_pack: e.target.value})}
        // if(e.target.name === 'hrg_beli_karton'){this.setState({hrg_beli_karton: e.target.value})}
        if(localStorage.getItem("samarata_pack") === "true"){
            for(let i=0;i<this.state.barangHarga.length;i++){
                if(e.target.name==="hrg_beli_pack"){this.state.barangHarga[i].hrgBeliPACK =  e.target.value;}
                if(e.target.name==="margin1_pack"){this.state.barangHarga[i].margin1PACK =  e.target.value;}
                if(e.target.name==="margin2_pack"){this.state.barangHarga[i].margin2PACK =  e.target.value;}
                if(e.target.name==="margin3_pack"){this.state.barangHarga[i].margin3PACK =  e.target.value;}
                if(e.target.name==="margin4_pack"){this.state.barangHarga[i].margin4PACK =  e.target.value;}
                if(e.target.name==="hrgjual1_pack"){this.state.barangHarga[i].hrgJual1PACK =  e.target.value;}
                if(e.target.name==="hrgjual2_pack"){this.state.barangHarga[i].hrgJual2PACK =  e.target.value;}
                if(e.target.name==="hrgjual3_pack"){this.state.barangHarga[i].hrgJual3PACK =  e.target.value;}
                if(e.target.name==="hrgjual4_pack"){this.state.barangHarga[i].hrgJual4PACK =  e.target.value;}
                if(e.target.name==="service_pack"){this.state.barangHarga[i].hrgJual4PACK =  e.target.value;}
                if(e.target.name==="ppn4_pack"){this.state.barangHarga[i].hrgJual4PACK =  e.target.value;}
            }
        }
        if(localStorage.getItem("samarata_karton") === "true"){
            for(let i=0;i<this.state.barangHarga.length;i++) {
                if (e.target.name === "hrg_beli_karton") {
                    this.state.barangHarga[i].hrgBeliKARTON = e.target.value;
                }
                if (e.target.name === "margin1_karton") {
                    this.state.barangHarga[i].margin1KARTON = e.target.value;
                }
                if (e.target.name === "margin2_karton") {
                    this.state.barangHarga[i].margin2KARTON = e.target.value;
                }
                if (e.target.name === "margin3_karton") {
                    this.state.barangHarga[i].margin3KARTON = e.target.value;
                }
                if (e.target.name === "margin4_karton") {
                    this.state.barangHarga[i].margin4KARTON = e.target.value;
                }
                if (e.target.name === "hrgjual1_karton") {
                    this.state.barangHarga[i].hrgJual1KARTON = e.target.value;
                }
                if (e.target.name === "hrgjual2_karton") {
                    this.state.barangHarga[i].hrgJual2KARTON = e.target.value;
                }
                if (e.target.name === "hrgjual3_karton") {
                    this.state.barangHarga[i].hrgJual3KARTON = e.target.value;
                }
                if (e.target.name === "hrgjual4_karton") {
                    this.state.barangHarga[i].hrgJual4KARTON = e.target.value;
                }
                if (e.target.name === "service_karton") {
                    this.state.barangHarga[i].serviceKARTON = e.target.value;
                }
                if (e.target.name === "ppn_karton") {
                    this.state.barangHarga[i].ppnKARTON = e.target.value;
                }
            }

        }



    }

    handleSubmit(e){
        e.preventDefault();
        const form = e.target;
        let data = new FormData(form);
        let parseData = stringifyFormData(data);
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
            barangHrg.push({
                "lokasi":this.state.barangHarga[i].lokasi,
                "harga":this.state.barangHarga[i].hrgJual1PCS,
                "harga_beli":this.state.barangHarga[i].hrgBeliPCS,
                "barcode":barcode[0],
                "ppn":this.state.barangHarga[i].ppnPCS,
                "service":this.state.barangHarga[i].servicePCS,
                "harga2":this.state.barangHarga[i].hrgJual2PCS,
                "harga3":this.state.barangHarga[i].hrgJual3PCS,
                "harga4":this.state.barangHarga[i].hrgJual4PCS,
            });
            barangHrg.push({
                "lokasi":this.state.barangHarga[i].lokasi,
                "harga":this.state.barangHarga[i].hrgJual1PACK,
                "harga_beli":this.state.barangHarga[i].hrgBeliPACK,
                "barcode":barcode[1]===undefined?"0":barcode[1],
                "ppn":this.state.barangHarga[i].ppnPACK,
                "service":this.state.barangHarga[i].servicePACK,
                "harga2":this.state.barangHarga[i].hrgJual2PACK,
                "harga3":this.state.barangHarga[i].hrgJual3PACK,
                "harga4":this.state.barangHarga[i].hrgJual4PACK,
            });
            barangHrg.push({
                "lokasi":this.state.barangHarga[i].lokasi,
                "harga":this.state.barangHarga[i].hrgJual1KARTON,
                "harga_beli":this.state.barangHarga[i].hrgBeliKARTON,
                "barcode":barcode[2]===undefined?"0":barcode[2],
                "ppn":this.state.barangHarga[i].ppnKARTON,
                "service":this.state.barangHarga[i].serviceKARTON,
                "harga2":this.state.barangHarga[i].hrgJual2KARTON,
                "harga3":this.state.barangHarga[i].hrgJual3KARTON,
                "harga4":this.state.barangHarga[i].hrgJual4KARTON,
            });

        }
        parseData["kd_brg"]=this.state.kd_brg;
        parseData["nm_brg"]=this.state.nm_brg;
        parseData["kel_brg"]=this.state.kel_brg;
        // parseData["stock"]=this.state.stock;
        parseData["kategori"]=this.state.kategori;
        parseData["stock_min"]=this.state.stock_min;
        parseData["group1"]=this.state.group1;
        parseData["group2"]=this.state.group2;
        parseData["deskripsi"]=this.state.deskripsi;
        parseData["gambar"]='-';
        parseData["jenis"]=this.state.jenis;
        parseData["kcp"]=this.state.kcp;
        parseData["poin"]=this.state.poin;
        parseData["online"]=this.state.online;
        parseData["berat"]=this.state.berat;
        parseData["barang_sku"] = barangSku;
        parseData["barang_harga"] = barangHrg;
        console.log("FORM DATA",parseData);
        // console.log();
        this.props.dispatch(createProduct(parseData));


    }

    render(){
        const { isCustomizeVisible } = this.state;
        const dynamicVar = 'test';
        const {data} = this.props.data;
        const dataSupplier = this.props.dataSupplier.data;
        const dataSubDep = this.props.dataSubDept.data;
        console.log("BARANG HARGA",this.state.barangHarga);

        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formProduct"} size="lg" style={{maxWidth: '1600px', width: '100%'}}>
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Add Product":"Update Product"}</ModalHeader>

                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <Tabs>
                            <TabList>
                                <Tab label="Core Courses" onClick={() =>this.handleSelect(0)}>Form 1</Tab>
                                <Tab label="Core Courses" onClick={() =>this.handleSelect(1)}>Form 2</Tab>
                                <Tab label="Core Courses" onClick={() =>this.handleSelect(2)}>Form 3</Tab>
                            </TabList>
                            <TabPanel>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Code</label>
                                            <input type="text" className="form-control" name="kd_brg" value={this.state.kd_brg} onChange={(e)=>this.handleChange(e,null)} required/>
                                        </div>
                                        <div className="form-group">
                                            <label>Name</label>
                                            <input type="text" className="form-control" name="nm_brg" value={this.state.nm_brg} onChange={(e)=>this.handleChange(e,null)} required/>
                                        </div>
                                        <div className="form-group">
                                            <label>Group</label>
                                            <select className="form-control form-control-lg" name="kel_brg" value={this.state.kel_brg} onChange={(e)=>this.handleChange(e,null)}>
                                                <option value="0">Pilih</option>
                                                {
                                                    typeof data === 'object' ? data.map((v,i)=>{return (<option key={i} value={v.kel_brg} >{v.nm_kel_brg}</option>)}) : (<option value="" >no data</option>)
                                                }
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Stock</label>
                                            <input type="text" className="form-control" name="stock" value={this.state.stock} onChange={(e)=>this.handleChange(e,null)} required/>
                                        </div>
                                        <div className="form-group">
                                            <label>Product Category</label>
                                            <select name="kategori" className="form-control form-control-lg" value={this.state.kategori} onChange={(e)=>this.handleChange(e,null)}>
                                                <option value="1">selling items</option>
                                                <option value="0">Not selling items</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Stock Min</label>
                                            <input type="number" className="form-control" name="stock_min" value={this.state.stock_min} onChange={(e)=>this.handleChange(e,null)} required/>
                                        </div>
                                        <div className="form-group">
                                            <label>Supplier</label>
                                            <select name="group1" className="form-control form-control-lg" value={this.state.group1} onChange={(e)=>this.handleChange(e,null)}>
                                                <option value="0">Pilih</option>
                                                {
                                                    typeof dataSupplier === 'object' ? dataSupplier.map((v,i)=>{return (<option key={i} value={v.kode} >{v.nama}</option>)}) : (<option value="" >no data</option>)
                                                }
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Sub Dept</label>
                                            <select name="group2" className="form-control form-control-lg" value={this.state.group2} onChange={(e)=>this.handleChange(e,null)}>
                                                <option value="0">Pilih</option>
                                                {
                                                    typeof dataSubDep === 'object' ? dataSubDep.map((v,i)=>{return (<option key={i} value={v.kode} >{v.nama}</option>)}) : (<option value="" >no data</option>)
                                                }
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Description</label>
                                            <input type="text" className="form-control" name="deskripsi" value={this.state.deskripsi} onChange={(e)=>this.handleChange(e,null)}  required/>
                                        </div>
                                        <div className="form-group">
                                            <label>Image</label>
                                            <input type="file" className="form-control" name="gambar" value={this.state.gambar} onChange={(e)=>this.handleChange(e,null)}  required/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Product Type</label>
                                            <select name="jenis" id="jenis" className="form-control form-control-lg" value={this.state.jenis} onChange={(e)=>this.handleChange(e,null)}>
                                                <option value="1">Unit</option>
                                                <option value="2">Packet</option>
                                                <option value="3">Service</option>
                                                <option value="0">Cardboard</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>KCP</label>
                                            <select name="kcp" id="kcp" className="form-control form-control-lg" value={this.state.kcp} onChange={(e)=>this.handleChange(e,null)}>
                                                <option value="0">Kitchen 1</option>
                                                <option value="1">Kitchen 2</option>
                                                <option value="2">Kitchen 3</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Point</label>
                                            <input type="text" className="form-control" name="poin" value={this.state.poin} onChange={(e)=>this.handleChange(e,null)} required/>
                                        </div>
                                        <div className="form-group">
                                            <label>Product Status</label>
                                            <select name="online" className="form-control form-control-lg" value={this.state.online} onChange={(e)=>this.handleChange(e,null)}>
                                                <option value="0">Offline</option>
                                                <option value="1">Online</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Weight</label>
                                            <input type="text" className="form-control" name="berat" value={this.state.berat} onChange={(e)=>this.handleChange(e,null)} required/>
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
                                                <th>Satuan Jual</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {(()=>{
                                                let container =[];
                                                for(let x=0; x<this.state.barangSku.length; x++){
                                                    container.push(
                                                        <tr key={x}>
                                                            <td>
                                                                {x+1}
                                                            </td>
                                                            <td>
                                                                <input type="text" className="form-control" name="barcode" value={this.state.barangSku[x].barcode} onChange={(e)=>this.handleChange(e,x)} required/>
                                                            </td>
                                                            <td>
                                                                <input type="text" className="form-control" name="qty" value={this.state.barangSku[x].qty} onChange={(e)=>this.handleChange(e,x)} required/>
                                                            </td>
                                                            <td>
                                                                <input type="text" className="form-control" name="konversi" value={this.state.barangSku[x].konversi} onChange={(e)=>this.handleChange(e,x)} required/>
                                                            </td>
                                                            <td>
                                                                <input type="text" className="form-control" name="satuan_jual" value={this.state.barangSku[x].satuan_jual} onChange={(e)=>this.handleChange(e,x)} required/>
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
                                            {localStorage.getItem("colBrgSku")=== '3' ? (()=>{
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
                                                                            <input type="checkbox" className="form-control col-md-2" name={lbl} onChange={(e)=>this.handleAllCheckedSku(e,i)}/>
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
                                                                <div className="col-md-2">
                                                                    <div className="form-group">
                                                                        <div className="row">
                                                                            <label className="col-md-8"  style={{fontSize:"10px"}}> {v.nama_toko} (PCS)</label>
                                                                            <input type="checkbox" name="lokasi" value={v.lokasi} checked={v.isCheckedPCS} onChange={this.handleCheckChieldElement(i)}/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-10">
                                                                    <div className="row">
                                                                        <div className="col-md-6">
                                                                            <div className="row">
                                                                                <div className="col-md-4">
                                                                                    <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="hrg beli" className="form-control" name="hrgBeliPCS" value={v.hrgBeliPCS} onChange={this.onHandleChangeChild(`hrgBeliPCS`,i)} style={{fontSize:"10px"}}/>
                                                                                </div>
                                                                                <div className="col-md-4">
                                                                                    <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="margin 1" className="form-control" name="margin1PCS" value={v.margin1PCS} onChange={this.onHandleChangeChild(`margin1PCS`,i)} style={{fontSize:"10px"}}/>
                                                                                    <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="margin 2" className="form-control" name="margin2PCS" value={v.margin2PCS} onChange={this.onHandleChangeChild(`margin2PCS`,i)} style={{fontSize:"10px"}}/>
                                                                                    <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="margin 3" className="form-control" name="margin3PCS" value={v.margin3PCS} onChange={this.onHandleChangeChild(`margin3PCS`,i)} style={{fontSize:"10px"}}/>
                                                                                    <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="margin 4" className="form-control" name="margin4PCS" value={v.margin4PCS} onChange={this.onHandleChangeChild(`margin4PCS`,i)} style={{fontSize:"10px"}}/>
                                                                                </div>
                                                                                <div className="col-md-4">
                                                                                    <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="hrg jual 1" className="form-control" name="hrgJual1PCS" value={v.hrgJual1PCS} onChange={this.onHandleChangeChild(`hrgJual1PCS`,i)} style={{fontSize:"10px"}}/>
                                                                                    <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="hrg jual 2" className="form-control" name="hrgJual2PCS" value={v.hrgJual2PCS} onChange={this.onHandleChangeChild(`hrgJual2PCS`,i)} style={{fontSize:"10px"}}/>
                                                                                    <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="hrg jual 3" className="form-control" name="hrgJual3PCS" value={v.hrgJual3PCS} onChange={this.onHandleChangeChild(`hrgJual3PCS`,i)} style={{fontSize:"10px"}}/>
                                                                                    <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="hrg jual 4" className="form-control" name="hrgJual4PCS" value={v.hrgJual4PCS} onChange={this.onHandleChangeChild(`hrgJual4PCS`,i)} style={{fontSize:"10px"}}/>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                        {/*service,ppn,stock min,stock max */}
                                                                        <div className="col-md-6">
                                                                            <div className="row">
                                                                                <div className="col-md-3">
                                                                                    <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="service" className="form-control" name="servicePCS" value={v.servicePCS} onChange={this.onHandleChangeChild(`servicePCS`,i)} style={{fontSize:"10px"}}/>
                                                                                </div>
                                                                                <div className="col-md-3 text-center">
                                                                                    <input readOnly={localStorage.getItem("isReadonly")==='true'?true:false} type="text" placeholder="PPN" className="form-control" name="ppnPCS" value={v.ppnPCS} onChange={this.onHandleChangeChild(`ppnPCS`,i)} style={{fontSize:"10px"}}/>
                                                                                </div>

                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {localStorage.getItem("colBrgSku")=== '3' ? (()=>{
                                                                let container =[];
                                                                let lbl = '';
                                                                for(let x=0; x<2; x++){
                                                                    lbl = (x%2===0)?'PACK':'KARTON';
                                                                    container.push(
                                                                        <div className="row" key={x}>
                                                                            <div className="col-md-2">
                                                                                <div className="form-group">
                                                                                    <div className="row">
                                                                                        <label className="col-md-8"  style={{fontSize:"10px"}}> {v.nama_toko} ({lbl})</label>
                                                                                        {
                                                                                            x%2===0 ? (
                                                                                                <input type="checkbox" name={lbl} value={v.lokasi} checked={v.isCheckedPACK} onChange={(e)=>this.handleCheckChieldElementPack(e,i,'')}/>
                                                                                            ) : (
                                                                                                <input type="checkbox" name={lbl} value={v.lokasi} checked={v.isCheckedKARTON} onChange={(e)=>this.handleCheckChieldElementKarton(e,i,'')}/>

                                                                                            )
                                                                                        }
                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-10">
                                                                                <div className="row">
                                                                                    <div className="col-md-6">
                                                                                        <div className="row">
                                                                                            <div className="col-md-4">
                                                                                                {x%2===0?(<input readOnly={localStorage.getItem("isReadonlyPack")==="true"?true:false} type="text" placeholder="hrg beli" className="form-control" value={localStorage.getItem(`samarata_pack`) === 'true' ? this.state.hrg_beli_pack: null} onChange={this.onHandleChangeChild(`hrg_beli_${x}`)} style={{fontSize:"10px"}}/>) : (<input readOnly={localStorage.getItem("isReadonlyKarton")==="true"?true:false} type="text" placeholder="hrg beli" className="form-control" value={localStorage.getItem(`samarata_karton`) === 'true' ? this.state.hrg_beli_karton: null} onChange={this.onHandleChangeChild(`hrg_beli_${x}`)} style={{fontSize:"10px"}}/>)}
                                                                                            </div>
                                                                                            <div className="col-md-4">
                                                                                                { x%2===0?(<input readOnly={localStorage.getItem("isReadonlyPack")==="true"?true:false} type="text" placeholder="margin 1" className="form-control" value={localStorage.getItem(`samarata_pack`) === 'true' ? this.state.margin1_pack: null} onChange={this.onHandleChangeChild(`margin1_pack_${x}`)} style={{fontSize:"10px"}}/>):(<input readOnly={localStorage.getItem("isReadonlyKarton")==="true"?true:false} type="text" placeholder="margin 1" className="form-control" value={localStorage.getItem(`samarata_karton`) === 'true' ? this.state.margin1_karton: null} onChange={this.onHandleChangeChild(`margin1_karton_${x}`)} style={{fontSize:"10px"}}/>)}
                                                                                                { x%2===0?(<input readOnly={localStorage.getItem("isReadonlyPack")==="true"?true:false} type="text" placeholder="margin 2" className="form-control" value={localStorage.getItem(`samarata_pack`) === 'true' ? this.state.margin2_pack: null} onChange={this.onHandleChangeChild(`margin2_pack_${x}`)} style={{fontSize:"10px"}}/>):(<input readOnly={localStorage.getItem("isReadonlyKarton")==="true"?true:false} type="text" placeholder="margin 2" className="form-control" value={localStorage.getItem(`samarata_karton`) === 'true' ? this.state.margin2_karton: null} onChange={this.onHandleChangeChild(`margin2_karton_${x}`)} style={{fontSize:"10px"}}/>)}
                                                                                                { x%2===0?(<input readOnly={localStorage.getItem("isReadonlyPack")==="true"?true:false} type="text" placeholder="margin 3" className="form-control" value={localStorage.getItem(`samarata_pack`) === 'true' ? this.state.margin3_pack: null} onChange={this.onHandleChangeChild(`margin3_pack_${x}`)} style={{fontSize:"10px"}}/>):(<input readOnly={localStorage.getItem("isReadonlyKarton")==="true"?true:false} type="text" placeholder="margin 3" className="form-control" value={localStorage.getItem(`samarata_karton`) === 'true' ? this.state.margin3_karton: null} onChange={this.onHandleChangeChild(`margin3_karton_${x}`)} style={{fontSize:"10px"}}/>)}
                                                                                                { x%2===0?(<input readOnly={localStorage.getItem("isReadonlyPack")==="true"?true:false} type="text" placeholder="margin 4" className="form-control" value={localStorage.getItem(`samarata_pack`) === 'true' ? this.state.margin4_pack: null} onChange={this.onHandleChangeChild(`margin4_pack_${x}`)} style={{fontSize:"10px"}}/>):(<input readOnly={localStorage.getItem("isReadonlyKarton")==="true"?true:false} type="text" placeholder="margin 4" className="form-control" value={localStorage.getItem(`samarata_karton`) === 'true' ? this.state.margin4_karton: null} onChange={this.onHandleChangeChild(`margin4_karton_${x}`)} style={{fontSize:"10px"}}/>)}
                                                                                            </div>
                                                                                            <div className="col-md-4">
                                                                                                { x%2===0?(<input readOnly={localStorage.getItem("isReadonlyPack")==="true"?true:false} type="text" placeholder="Hrg Jual 1" className="form-control" value={localStorage.getItem(`samarata_pack`) === 'true' ? this.state.hrgjual1_pack: null} onChange={this.onHandleChangeChild(`hrgjual1_pack_${x}`)} style={{fontSize:"10px"}}/>):(<input readOnly={localStorage.getItem("isReadonlyKarton")==="true"?true:false} type="text" placeholder="Hrg Jual 1" className="form-control" value={localStorage.getItem(`samarata_karton`) === 'true' ? this.state.hrgjual1_karton: null} onChange={this.onHandleChangeChild(`hrgjual1_karton_${x}`)} style={{fontSize:"10px"}}/>)}
                                                                                                { x%2===0?(<input readOnly={localStorage.getItem("isReadonlyPack")==="true"?true:false} type="text" placeholder="Hrg Jual 2" className="form-control" value={localStorage.getItem(`samarata_pack`) === 'true' ? this.state.hrgjual2_pack: null} onChange={this.onHandleChangeChild(`hrgjual2_pack_${x}`)} style={{fontSize:"10px"}}/>):(<input readOnly={localStorage.getItem("isReadonlyKarton")==="true"?true:false} type="text" placeholder="Hrg Jual 2" className="form-control" value={localStorage.getItem(`samarata_karton`) === 'true' ? this.state.hrgjual2_karton: null} onChange={this.onHandleChangeChild(`hrgjual2_karton_${x}`)} style={{fontSize:"10px"}}/>)}
                                                                                                { x%2===0?(<input readOnly={localStorage.getItem("isReadonlyPack")==="true"?true:false} type="text" placeholder="Hrg Jual 3" className="form-control" value={localStorage.getItem(`samarata_pack`) === 'true' ? this.state.hrgjual3_pack: null} onChange={this.onHandleChangeChild(`hrgjual3_pack_${x}`)} style={{fontSize:"10px"}}/>):(<input readOnly={localStorage.getItem("isReadonlyKarton")==="true"?true:false} type="text" placeholder="Hrg Jual 3" className="form-control" value={localStorage.getItem(`samarata_karton`) === 'true' ? this.state.hrgjual3_karton: null} onChange={this.onHandleChangeChild(`hrgjual3_karton_${x}`)} style={{fontSize:"10px"}}/>)}
                                                                                                { x%2===0?(<input readOnly={localStorage.getItem("isReadonlyPack")==="true"?true:false} type="text" placeholder="Hrg Jual 4" className="form-control" value={localStorage.getItem(`samarata_pack`) === 'true' ? this.state.hrgjual4_pack: null} onChange={this.onHandleChangeChild(`hrgjual4_pack_${x}`)} style={{fontSize:"10px"}}/>):(<input readOnly={localStorage.getItem("isReadonlyKarton")==="true"?true:false} type="text" placeholder="Hrg Jual 4" className="form-control" value={localStorage.getItem(`samarata_karton`) === 'true' ? this.state.hrgjual4_karton: null} onChange={this.onHandleChangeChild(`hrgjual4_karton_${x}`)} style={{fontSize:"10px"}}/>)}
                                                                                            </div>

                                                                                        </div>
                                                                                    </div>
                                                                                    {/*service,ppn,stock min,stock max */}
                                                                                    <div className="col-md-6">
                                                                                        <div className="row">
                                                                                            <div className="col-md-3">
                                                                                                { x%2===0?(<input readOnly={localStorage.getItem("isReadonlyPack")==="true"?true:false} type="text" placeholder="Service Pack" className="form-control" value={localStorage.getItem(`samarata_pack`) === 'true' ? this.state.service_pack: null} onChange={this.onHandleChangeChild(`service_pack_${x}`)} style={{fontSize:"10px"}}/>):(<input readOnly={localStorage.getItem("isReadonlyKarton")==="true"?true:false} type="text" placeholder="Service Karton" className="form-control" value={localStorage.getItem(`samarata_karton`) === 'true' ? this.state.service_karton: null} onChange={this.onHandleChangeChild(`service_karton_${x}`)} style={{fontSize:"10px"}}/>)}
                                                                                            </div>
                                                                                            <div className="col-md-3 text-center">
                                                                                                { x%2===0?(<input readOnly={localStorage.getItem("isReadonlyPack")==="true"?true:false} type="text" placeholder="PPN Pack" className="form-control" value={localStorage.getItem(`samarata_pack`) === 'true' ? this.state.ppn_pack: null} onChange={this.onHandleChangeChild(`ppn_pack_${x}`)} style={{fontSize:"10px"}}/>):(<input readOnly={localStorage.getItem("isReadonlyKarton")==="true"?true:false} type="text" placeholder="PPN Karton" className="form-control" value={localStorage.getItem(`samarata_karton`) === 'true' ? this.state.ppn_karton: null} onChange={this.onHandleChangeChild(`ppn_karton_${x}`)} style={{fontSize:"10px"}}/>)}
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
        location:state.locationReducer.data
        // group:state.groupProductReducer.data
    }
}
export default connect(mapStateToProps)(FormProduct);