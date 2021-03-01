import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import {stringifyFormData} from "helper";
import {
    createUserLevel,
    updateUserLevel
} from "redux/actions/masterdata/user_level/user_level.action";
import {
    ModalBody,
    ModalHeader,
    ModalFooter
} from "reactstrap";

import {ModalToggle} from "redux/actions/modal.action";

class FormUserLevel extends Component{

    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            //0-9
            setting         : [
                {parent:0,value: "0", isChecked: false,label:'Pengaturan Umum',id:0},
                {parent:0,value: "0", isChecked: false,label:'Pengguna',id:1},
                {parent:0,value: "0", isChecked: false,label:'Lokasi',id:2},
                {value: "0", isChecked: false,label:'',id:3},
                {value: "0", isChecked: false,label:'',id:4},
                {value: "0", isChecked: false,label:'',id:5},
                {value: "0", isChecked: false,label:'',id:6},
                {value: "0", isChecked: false,label:'',id:7},
                {value: "0", isChecked: false,label:'',id:8},
                {value: "0", isChecked: false,label:'',id:9},
            ],
            //10-19
            masterdata      : [
                {parent:1,value: "0", isChecked: false,label:'Barang',id:10},
                {parent:1,value: "0", isChecked: false,label:'Departemen',id:11},
                {parent:1,value: "0", isChecked: false,label:'Supplier',id:12},
                {parent:1,value: "0", isChecked: false,label:'Customer',id:13},
                {parent:1,value: "0", isChecked: false,label:'Kas',id:14},
                {parent:1,value: "0", isChecked: false,label:'Sales',id:15},
                {parent:1,value: "0", isChecked: false,label:'Bank',id:16},
                {parent:1,value: "0", isChecked: false,label:'Promo',id:17},
                {value: "0", isChecked: false,label:'',id:18},
                {value: "0", isChecked: false,label:'',id:19},
            ],
            //20-29
            inventory       : [
                {parent:2,value: "0", isChecked: false,label:'Delivery Note',id:20},
                {parent:2,value: "0", isChecked: false,label:'Alokasi',id:21},
                {parent:2,value: "0", isChecked: false,label:'Approval Mutasi',id:22},
                {parent:2,value: "0", isChecked: false,label:'Adjusment',id:23},
                {parent:2,value: "0", isChecked: false,label:'Opname',id:24},
                {parent:2,value: "0", isChecked: false,label:'Approval Opname',id:25},
                {parent:2,value: "0", isChecked: false,label:'Packing',id:26},
                {parent:2,value: "0", isChecked: false,label:'Approval Mutasi Jual Beli',id:27},
                {parent:2,value: "0", isChecked: false,label:'Bayar Mutasi Jual Beli',id:28},
                {parent:2,value: "0", isChecked: false,label:'Expedisi',id:29},

            ],
            //30-39
            pembelian       : [
                {parent:3,value: "0", isChecked: false,label:'Purchase Order',id:30},
                {parent:3,value: "0", isChecked: false,label:'Receive Pembelian',id:31},
                {parent:3,value: "0", isChecked: false,label:'Retur Tanpa Nota',id:32},
                {value: "0", isChecked: false,label:'',id:33},
                {value: "0", isChecked: false,label:'',id:34},
                {value: "0", isChecked: false,label:'',id:35},
                {value: "0", isChecked: false,label:'',id:36},
                {value: "0", isChecked: false,label:'',id:37},
                {value: "0", isChecked: false,label:'',id:33},
                {value: "0", isChecked: false,label:'',id:39},
            ],
            //40-49
            transaksi       : [
                {parent:4,value: "0", isChecked: false,label:'Penjualan Barang',id:40},
                {parent:4,value: "0", isChecked: false,label:'Transaksi Kas',id:41},
                {parent:4,value: "0", isChecked: false,label:'',id:42},
                {value: "0", isChecked: false,label:'',id:43},
                {value: "0", isChecked: false,label:'',id:44},
                {value: "0", isChecked: false,label:'',id:45},
                {value: "0", isChecked: false,label:'',id:46},
                {value: "0", isChecked: false,label:'',id:47},
                {value: "0", isChecked: false,label:'',id:48},
                {value: "0", isChecked: false,label:'',id:49},
            ],
            //50-59
            pembayaran      : [
                {parent:5,value: "0", isChecked: false,label:'Bayar Hutang',id:50},
                {parent:5,value: "0", isChecked: false,label:'Bayar Piutang',id:51},
                {value: "0", isChecked: false,label:'',id:52},
                {value: "0", isChecked: false,label:'',id:53},
                {value: "0", isChecked: false,label:'',id:54},
                {value: "0", isChecked: false,label:'',id:55},
                {value: "0", isChecked: false,label:'',id:56},
                {value: "0", isChecked: false,label:'',id:57},
                {value: "0", isChecked: false,label:'',id:58},
                {value: "0", isChecked: false,label:'',id:59},
            ],
            //60-89
            report          : [
                {parent:6,menu:'closing',value: "0", isChecked: false,label:'Laporan Closing',id:60},
                {parent:6,menu:'kas',value: "0", isChecked: false,label:'Laporan Kas',id:61},
                {parent:6,menu:'laba_rugi',value: "0", isChecked: false,label:'Laporan Laba Rugi',id:62},
                {parent:6,menu:'produksi',value: "0", isChecked: false,label:'Laporan Produksi',id:63},

                {parent:6,menu:'penjualan',value: "0", isChecked: false,label:'Laporan Arsip Penjualan',id:64},
                {parent:6,menu:'penjualan',value: "0", isChecked: false,label:'Laporan Arsip Retur Penjualan',id:65},
                {parent:6,menu:'penjualan',value: "0", isChecked: false,label:'Laporan Penjualan By Customer',id:66},
                {parent:6,menu:'penjualan',value: "0", isChecked: false,label:'Laporan Penjualan By Barang',id:67},

                {parent:6,menu:'inventory',value: "0", isChecked: false,label:'Laporan Stock',id:68},
                {parent:6,menu:'inventory',value: "0", isChecked: false,label:'Laporan Adjusment',id:69},
                {parent:6,menu:'inventory',value: "0", isChecked: false,label:'Laporan Alokasi',id:70},
                {parent:6,menu:'inventory',value: "0", isChecked: false,label:'Laporan Delivery Note',id:71},
                {parent:6,menu:'inventory',value: "0", isChecked: false,label:'Laporan Opname',id:72},
                {parent:6,menu:'inventory',value: "0", isChecked: false,label:'Laporan Mutasi',id:73},
                {parent:6,menu:'inventory',value: "0", isChecked: false,label:'Laporan Alokasi Transaksi',id:74},
                {parent:6,menu:'inventory',value: "0", isChecked: false,label:'Laporan Packing',id:75},
                {parent:6,menu:'inventory',value: "0", isChecked: false,label:'Laporan Expedisi',id:76},

                {parent:6,menu:'pembelian',value: "0", isChecked: false,label:'Laporan Purchase Order',id:77},
                {parent:6,menu:'pembelian',value: "0", isChecked: false,label:'Laporan Receive Pembelian',id:78},
                {parent:6,menu:'pembelian',value: "0", isChecked: false,label:'Laporan Pembelian By Supplier',id:79},

                {parent:6,menu:'pembayaran',value: "0", isChecked: false,label:'Laporan Hutang',id:80},
                {parent:6,menu:'pembayaran',value: "0", isChecked: false,label:'Laporan Piutang',id:81},

                {parent:6,menu:'log',value: "0", isChecked: false,label:'Laporan Log Transaksi',id:82},
                {parent:6,menu:'log',value: "0", isChecked: false,label:'Laporan Log Aktifitas',id:83},
                {parent:6,menu:'penjualan',value: "0", isChecked: false,label:'Laporan Penjualan By Sales',id:84},
                {value: "0", isChecked: false,label:'',id:85},
                {value: "0", isChecked: false,label:'',id:86},
                {value: "0", isChecked: false,label:'',id:87},
                {value: "0", isChecked: false,label:'',id:88},
                {value: "0", isChecked: false,label:'',id:89},
            ],
            //90-99
            produksi        : [
                {parent:7,value: "0", isChecked: false,label:'Produksi',id:90},
                {value: "0", isChecked: false,label:'',id:91},
                {value: "0", isChecked: false,label:'',id:92},
                {value: "0", isChecked: false,label:'',id:93},
                {value: "0", isChecked: false,label:'',id:94},
                {value: "0", isChecked: false,label:'',id:95},
                {value: "0", isChecked: false,label:'',id:96},
                {value: "0", isChecked: false,label:'',id:97},
                {value: "0", isChecked: false,label:'',id:98},
                {value: "0", isChecked: false,label:'',id:99},
            ],
            //100-109
            cetak_barcode   : [
                {parent:8,value: "0", isChecked: false,label:'Cetak Barcode',id:100},
                {value: "0", isChecked: false,label:'',id:101},
                {value: "0", isChecked: false,label:'',id:102},
                {value: "0", isChecked: false,label:'',id:103},
                {value: "0", isChecked: false,label:'',id:104},
                {value: "0", isChecked: false,label:'',id:105},
                {value: "0", isChecked: false,label:'',id:106},
                {value: "0", isChecked: false,label:'',id:107},
                {value: "0", isChecked: false,label:'',id:108},
                {value: "0", isChecked: false,label:'',id:109},
            ],
            lvl             : "",
            access          : [],
            array_modul     : ['setting','masterdata','inventory','pembelian','transaksi','pembayaran','report','produksi','cetak_barcode'],
            error           : {
                lvl:""
            }
        }
    }
    clearState(){
        this.setState(
            {
                //0-9
                setting         : [
                    {parent:'setting',value: "0", isChecked: false,label:'Pengaturan Umum',id:0},
                    {parent:'setting',value: "0", isChecked: false,label:'Pengguna',id:1},
                    {parent:'setting',value: "0", isChecked: false,label:'Lokasi',id:2},
                    {value: "0", isChecked: false,label:'',id:3},
                    {value: "0", isChecked: false,label:'',id:4},
                    {value: "0", isChecked: false,label:'',id:5},
                    {value: "0", isChecked: false,label:'',id:6},
                    {value: "0", isChecked: false,label:'',id:7},
                    {value: "0", isChecked: false,label:'',id:8},
                    {value: "0", isChecked: false,label:'',id:9},
                ],
                //10-19
                masterdata      : [
                    {parent:'masterdata',value: "0", isChecked: false,label:'Barang',id:10},
                    {parent:'masterdata',value: "0", isChecked: false,label:'Departemen',id:11},
                    {parent:'masterdata',value: "0", isChecked: false,label:'Supplier',id:12},
                    {parent:'masterdata',value: "0", isChecked: false,label:'Customer',id:13},
                    {parent:'masterdata',value: "0", isChecked: false,label:'Kas',id:14},
                    {parent:'masterdata',value: "0", isChecked: false,label:'Sales',id:15},
                    {parent:'masterdata',value: "0", isChecked: false,label:'Bank',id:16},
                    {parent:'masterdata',value: "0", isChecked: false,label:'Promo',id:17},
                    {value: "0", isChecked: false,label:'',id:18},
                    {value: "0", isChecked: false,label:'',id:19},
                ],
                //20-29
                inventory       : [
                    {parent:'inventory',value: "0", isChecked: false,label:'Delivery Note',id:20},
                    {parent:'inventory',value: "0", isChecked: false,label:'Alokasi',id:21},
                    {parent:'inventory',value: "0", isChecked: false,label:'Approval Mutasi',id:22},
                    {parent:'inventory',value: "0", isChecked: false,label:'Adjusment',id:23},
                    {parent:'inventory',value: "0", isChecked: false,label:'Opname',id:24},
                    {parent:'inventory',value: "0", isChecked: false,label:'Approval Opname',id:25},
                    {parent:'inventory',value: "0", isChecked: false,label:'Packing',id:26},
                    {parent:'inventory',value: "0", isChecked: false,label:'Approval Mutasi Jual Beli',id:27},
                    {parent:'inventory',value: "0", isChecked: false,label:'Bayar Mutasi Jual Beli',id:28},
                    {parent:'inventory',value: "0", isChecked: false,label:'Expedisi',id:29},

                ],
                //30-39
                pembelian       : [
                    {parent:'pembelian',value: "0", isChecked: false,label:'Purchase Order',id:30},
                    {parent:'pembelian',value: "0", isChecked: false,label:'Receive Pembelian',id:31},
                    {parent:'pembelian',value: "0", isChecked: false,label:'Retur Tanpa Nota',id:32},
                    {value: "0", isChecked: false,label:'',id:33},
                    {value: "0", isChecked: false,label:'',id:34},
                    {value: "0", isChecked: false,label:'',id:35},
                    {value: "0", isChecked: false,label:'',id:36},
                    {value: "0", isChecked: false,label:'',id:37},
                    {value: "0", isChecked: false,label:'',id:33},
                    {value: "0", isChecked: false,label:'',id:39},
                ],
                //40-49
                transaksi       : [
                    {parent:'transaksi',value: "0", isChecked: false,label:'Penjualan Barang',id:40},
                    {parent:'transaksi',value: "0", isChecked: false,label:'Transaksi Kas',id:41},
                    {parent:'transaksi',value: "0", isChecked: false,label:'',id:42},
                    {value: "0", isChecked: false,label:'',id:43},
                    {value: "0", isChecked: false,label:'',id:44},
                    {value: "0", isChecked: false,label:'',id:45},
                    {value: "0", isChecked: false,label:'',id:46},
                    {value: "0", isChecked: false,label:'',id:47},
                    {value: "0", isChecked: false,label:'',id:48},
                    {value: "0", isChecked: false,label:'',id:49},
                ],
                //50-59
                pembayaran      : [
                    {parent:'pembayaran',value: "0", isChecked: false,label:'Bayar Hutang',id:50},
                    {parent:'pembayaran',value: "0", isChecked: false,label:'Bayar Piutang',id:51},
                    {value: "0", isChecked: false,label:'',id:52},
                    {value: "0", isChecked: false,label:'',id:53},
                    {value: "0", isChecked: false,label:'',id:54},
                    {value: "0", isChecked: false,label:'',id:55},
                    {value: "0", isChecked: false,label:'',id:56},
                    {value: "0", isChecked: false,label:'',id:57},
                    {value: "0", isChecked: false,label:'',id:58},
                    {value: "0", isChecked: false,label:'',id:59},
                ],
                //60-89
                report          : [
                    {parent:'report',menu:'closing',value: "0", isChecked: false,label:'Laporan Closing',id:60},
                    {parent:'report',menu:'kas',value: "0", isChecked: false,label:'Laporan Kas',id:61},
                    {parent:'report',menu:'laba_rugi',value: "0", isChecked: false,label:'Laporan Laba Rugi',id:62},
                    {parent:'report',menu:'produksi',value: "0", isChecked: false,label:'Laporan Produksi',id:63},

                    {parent:'report',menu:'penjualan',value: "0", isChecked: false,label:'Laporan Arsip Penjualan',id:64},
                    {parent:'report',menu:'penjualan',value: "0", isChecked: false,label:'Laporan Arsip Retur Penjualan',id:65},
                    {parent:'report',menu:'penjualan',value: "0", isChecked: false,label:'Laporan Penjualan By Customer',id:66},
                    {parent:'report',menu:'penjualan',value: "0", isChecked: false,label:'Laporan Penjualan By Barang',id:67},

                    {parent:'report',menu:'inventory',value: "0", isChecked: false,label:'Laporan Stock',id:68},
                    {parent:'report',menu:'inventory',value: "0", isChecked: false,label:'Laporan Adjusment',id:69},
                    {parent:'report',menu:'inventory',value: "0", isChecked: false,label:'Laporan Alokasi',id:70},
                    {parent:'report',menu:'inventory',value: "0", isChecked: false,label:'Laporan Delivery Note',id:71},
                    {parent:'report',menu:'inventory',value: "0", isChecked: false,label:'Laporan Opname',id:72},
                    {parent:'report',menu:'inventory',value: "0", isChecked: false,label:'Laporan Mutasi',id:73},
                    {parent:'report',menu:'inventory',value: "0", isChecked: false,label:'Laporan Alokasi Transaksi',id:74},
                    {parent:'report',menu:'inventory',value: "0", isChecked: false,label:'Laporan Packing',id:75},
                    {parent:'report',menu:'inventory',value: "0", isChecked: false,label:'Laporan Expedisi',id:76},

                    {parent:'report',menu:'pembelian',value: "0", isChecked: false,label:'Laporan Purchase Order',id:77},
                    {parent:'report',menu:'pembelian',value: "0", isChecked: false,label:'Laporan Receive Pembelian',id:78},
                    {parent:'report',menu:'pembelian',value: "0", isChecked: false,label:'Laporan Pembelian By Supplier',id:79},

                    {parent:'report',menu:'pembayaran',value: "0", isChecked: false,label:'Laporan Hutang',id:80},
                    {parent:'report',menu:'pembayaran',value: "0", isChecked: false,label:'Laporan Piutang',id:81},

                    {parent:'report',menu:'log',value: "0", isChecked: false,label:'Laporan Log Transaksi',id:82},
                    {parent:'report',menu:'log',value: "0", isChecked: false,label:'Laporan Log Aktifitas',id:83},
                    {parent:'report',menu:'penjualan',value: "0", isChecked: false,label:'Laporan Penjualan By Sales',id:84},
                    {value: "0", isChecked: false,label:'',id:85},
                    {value: "0", isChecked: false,label:'',id:86},
                    {value: "0", isChecked: false,label:'',id:87},
                    {value: "0", isChecked: false,label:'',id:88},
                    {value: "0", isChecked: false,label:'',id:89},
                ],
                //90-99
                produksi        : [
                    {parent:'produksi',value: "0", isChecked: false,label:'Produksi',id:90},
                    {value: "0", isChecked: false,label:'',id:91},
                    {value: "0", isChecked: false,label:'',id:92},
                    {value: "0", isChecked: false,label:'',id:93},
                    {value: "0", isChecked: false,label:'',id:94},
                    {value: "0", isChecked: false,label:'',id:95},
                    {value: "0", isChecked: false,label:'',id:96},
                    {value: "0", isChecked: false,label:'',id:97},
                    {value: "0", isChecked: false,label:'',id:98},
                    {value: "0", isChecked: false,label:'',id:99},
                ],
                //100-109
                cetak_barcode   : [
                    {parent:'cetak_barcode',value: "0", isChecked: false,label:'Cetak Barcode',id:100},
                    {value: "0", isChecked: false,label:'',id:101},
                    {value: "0", isChecked: false,label:'',id:102},
                    {value: "0", isChecked: false,label:'',id:103},
                    {value: "0", isChecked: false,label:'',id:104},
                    {value: "0", isChecked: false,label:'',id:105},
                    {value: "0", isChecked: false,label:'',id:106},
                    {value: "0", isChecked: false,label:'',id:107},
                    {value: "0", isChecked: false,label:'',id:108},
                    {value: "0", isChecked: false,label:'',id:109},
                ],
                lvl             : "",
                access          : [],
                array_modul     : ['setting','masterdata','inventory','pembelian','transaksi','pembayaran','report','produksi','cetak_barcode'],
                error           : {
                    lvl:""
                }
            }
        )
    }



    getProps(param){
        if (param.detail !== undefined && param.detail !== []) {
            let array=[];
            this.state.array_modul.map(val=>{
                array.push(...this.state[val]);
            });
            this.handleLoopAccess(
                array,
                param.detail.access
            );
            this.setState({lvl:param.detail.lvl});
        }
        else{
            this.clearState();
        }
    }
    componentWillReceiveProps(nextProps) {
        this.getProps(nextProps);
    }
    componentWillMount(){
        this.getProps(this.props);
    }
    toggle = (e) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.clearState();
    };
    handleLoopAccess(moduls=[],nextProps=[]){
        if(nextProps!==null){
            moduls.forEach(modul=>{
                for(let i=0;i<nextProps.length;i++){
                    if(modul.label === nextProps[i].label){
                        modul.isChecked = nextProps[i].isChecked;
                        modul.value = nextProps[i].value;
                    }
                }
            });
            return moduls;
        }
    }
    handleAllChecked = (event,param) => {
        let moduls = this.state[param];
        moduls.forEach(modul => {
            modul.isChecked = event.target.checked;
            modul.value = modul.label!==''?modul.isChecked === false ? "0":"1":"0";
        });
        this.setState({param: moduls});


    };
    handleCheckChieldElement = (event,param) => {
        let moduls = this.state[param];
        moduls.forEach(modul => {
            if (modul.label === event.target.getAttribute("id")){
                modul.isChecked =  event.target.checked;
                modul.value = modul.label!==''? modul.isChecked === false ? "0":"1":"0";
            }
        });
        this.setState({param: moduls});
    };
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
        let err = Object.assign({}, this.state.error, {[event.target.name]: ""});
        this.setState({error: err});
    };
    handleSubmit(e){
        e.preventDefault();
        let form        = e.target;
        let data        = new FormData(form);
        let parseData   = stringifyFormData(data);
        let akses       = [];
        let err         = this.state.error;
        this.state.array_modul.forEach(val=>{
            this.state[val].forEach(key=>{
                akses.push({
                    value:key.value,
                    isChecked:key.isChecked,
                    label:key.label,
                    // id:key.id,
                    parent:key.parent,
                    menu:key.menu!==undefined?key.menu:''
                })
            })
        });

        parseData['lvl']    = this.state.lvl;
        parseData['access'] = akses;
        if(parseData['lvl']===''){
            err = Object.assign({}, err, {lvl:"nama user level tidak boleh kosong"});
            this.setState({error: err});
        }
        else{
            if(this.props.detail !==undefined){
                this.props.dispatch(updateUserLevel(this.props.detail.id,parseData));
                this.props.dispatch(ModalToggle(false));
                this.clearState();
            }else{
                this.props.dispatch(createUserLevel(parseData));
                this.props.dispatch(ModalToggle(false));
                this.clearState();
            }
        }
    }
    render(){
        const {array_modul} = this.state;
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formUserLevel"} size="lg">
                <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Tambah User Level":"Ubah User Level"}</ModalHeader>
                <form onSubmit={(e)=>this.handleSubmit(e)}>
                    <ModalBody>
                        <div className="row">
                            <div className="col-12">
                                <div className="form-group">
                                    <label>Nama User Level</label>
                                    <input type="text" className="form-control" name="lvl" value={this.state.lvl}  onChange={(e)=>this.handleChange(e)} />
                                    <div className="invalid-feedback" style={this.state.error.lvl !== "" ? {display: 'block'} : {display: 'none'}}>
                                        {this.state.error.lvl}
                                    </div>
                                </div>

                            </div>

                            {
                                array_modul.map((val,i)=>{
                                    return (
                                        <div className="col-12" key={i}>
                                            <div className="form-group">
                                                <input type="checkbox" onChange={(e)=>this.handleAllChecked(e,val)}  value="checkedall" /> <b style={{color:'red'}}>{val.replace('_',' ').toUpperCase()}</b>
                                            </div>
                                            <div className="row">
                                                {
                                                    this.state[val].map((modul, index) => {
                                                        return (
                                                            modul.label!==''? <div className="col-md-4" key={index} >
                                                                <div className="form-group" style={{marginLeft:"6px",fontSize:"12px"}}>
                                                                    <input onChange={(e)=>this.handleCheckChieldElement(e,val)} id={modul.label} className={modul.label} type="checkbox" checked={modul.isChecked} value={modul.value} /> {modul.label}
                                                                </div>
                                                            </div>:''
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    );
                                })
                            }

                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="form-group" style={{textAlign:"right"}}>
                            <button type="button" className="btn btn-danger mb-2 mr-2" onClick={this.toggle}><i className="ti-close" /> Close</button>
                            <button type="submit" className="btn btn-primary mb-2 mr-2" ><i className="ti-save" /> Save</button>
                        </div>
                    </ModalFooter>
                </form>
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

export default connect(mapStateToProps)(FormUserLevel);
