import React,{Component} from 'react';
import {store,get, update,destroy,cekData,del} from "components/model/app.model";
import connect from "react-redux/es/connect/connect";
import Layout from "components/App/Layout"
import {FetchBrg,setProductbrg} from 'redux/actions/masterdata/product/product.action'
import {FetchCheck} from 'redux/actions/site.action'
import {FetchNota,storeAlokasi} from 'redux/actions/inventory/alokasi.action'
import {FetchDnReport,FetchDnData,setDnData} from 'redux/actions/inventory/dn.action'

import { Scrollbars } from "react-custom-scrollbars";
import Select from 'react-select'
import Swal from 'sweetalert2'
import moment from 'moment';

const table='alokasi'
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

class Alokasi extends Component{

    constructor(props) {
        super(props);

        this.state = {
            addingItemName: "",
            databrg: [],
            brgval:[],
            tanggal: moment(new Date()).format("yyyy-MM-DD"),
            qty:0,
            location_data:[],
            location:"",
            location2:"",
            catatan:"",
            userid:0,
            searchby:1,
            search:"",
            no_delivery_note: '-',
            data_nota:[],
            ambil_data:1,
            ambil_nota:'',
            jenis_trx:'Mutasi',
            jenis_trx_data:[],
            error:{
                location:"",
                location2: "",
                catatan:"",
                qty:[]
            }
        };
        this.HandleRemove = this.HandleRemove.bind(this);
        this.HandleAddBrg = this.HandleAddBrg.bind(this);
        this.HandleChangeInput = this.HandleChangeInput.bind(this);
        this.HandleChangeInputValue = this.HandleChangeInputValue.bind(this);
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.HandleChangeLokasi2 = this.HandleChangeLokasi2.bind(this);
        this.setTanggal=this.setTanggal.bind(this);
        this.HandleReset = this.HandleReset.bind(this);
        this.HandleSearch = this.HandleSearch.bind(this);
        this.getData = this.getData.bind(this);
        this.HandleChangeNota = this.HandleChangeNota.bind(this);
        this.HandleChangeJenisTrx= this.HandleChangeJenisTrx.bind(this);
    }

    getProps(param){
        if (param.auth.user) {
            let lk = []
            let loc = param.auth.user.lokasi;
            if(loc!==undefined){
                loc.map((i) => {
                    lk.push({
                        value: i.kode,
                        label: i.nama
                    });
                    return null;
                })
                this.setState({
                    location_data: lk,
                    userid: param.auth.user.id
                })
            }
        }
    }

    componentWillMount(){
        this.getProps(this.props);
    }

    componentDidMount() {
         let jt=[
            {value:"Alokasi",label:"Alokasi"},
            {value:"Mutasi",label:"Mutasi"},
            {value:"Transaksi",label:"Transaksi"},
        ];
        this.setState({jenis_trx_data:jt});
        this.getData()
        if (localStorage.catatan !== undefined && localStorage.catatan !== '') {
            this.setState({
                catatan: localStorage.catatan
            })
        }
        if (localStorage.ambil_data !== undefined && localStorage.ambil_data !== '') {
            if (parseInt(localStorage.ambil_data,10) === 2) {
                this.props.dispatch(FetchDnReport(1, 1000))
            }
            this.setState({
                ambil_data: parseInt(localStorage.ambil_data,10)
            })
        }

        if (localStorage.nota !== undefined && localStorage.nota !== '') {

            this.setState({
                ambil_nota: localStorage.nota
            })
        }

        if (localStorage.lk !== undefined && localStorage.lk !== '') {
            let prefix = this.state.jenis_trx.toLowerCase() === 'alokasi' ? 'MC' : (this.state.jenis_trx.toLowerCase() === 'mutasi' ? 'MU' : 'TR');

            this.props.dispatch(FetchNota(localStorage.lk, prefix))
            this.props.dispatch(FetchBrg(1, 'barcode', '', localStorage.lk, null, this.autoSetQty))

            this.setState({
                location: localStorage.lk
            })
        }
        if (localStorage.lk2 !== undefined && localStorage.lk2 !== '') {
            this.setState({
                location2: localStorage.lk2
            })
        }
    }

    componentWillReceiveProps = (nextProps) => {
        this.getProps(nextProps);
        if (nextProps.auth.user) {
            let lk = []
            let loc = nextProps.auth.user.lokasi;
            if(loc!==undefined){
                loc.map((i) => {
                    lk.push({
                        value: i.kode,
                        label: i.nama
                    });
                    return null;
                })
                this.setState({
                    location_data: lk,
                    userid: nextProps.auth.user.id
                })
            }
        }
        if(nextProps.barang.length>0){
            this.getData()
        }

        if(nextProps.dn_report){
            let nota = []
            let po = nextProps.dn_report;
            if (po !== undefined) {
                po.map((i) => {
                    nota.push({
                        value: i.no_delivery_note,
                        label: i.no_delivery_note
                    });
                    return null
                })
                this.setState({
                    data_nota: nota
                })
            }

        }
        if (nextProps.dn_data){
            if (nextProps.dn_data.master!==undefined){
                if(this.props.dn_data===undefined){
                    let prefix = this.state.jenis_trx.toLowerCase() === 'alokasi' ? 'MC' : (this.state.jenis_trx.toLowerCase() === 'mutasi' ? 'MU' : 'TR');
                    this.props.dispatch(FetchNota(nextProps.dn_data.master.kd_lokasi_1,prefix))
                    this.setState({
                        location: nextProps.dn_data.master.kd_lokasi_1,
                        location2: nextProps.dn_data.master.kd_lokasi_2,
                        catatan: nextProps.dn_data.master.keterangan,
                        no_delivery_note: nextProps.dn_data.master.no_delivery_note
                    })
                    localStorage.setItem('lk', nextProps.dn_data.master.kd_lokasi_1)
                    localStorage.setItem('lk2', nextProps.dn_data.master.kd_lokasi_2)
                    localStorage.setItem('catatan', nextProps.dn_data.master.catatan)

                    nextProps.dn_data.detail.map(item=>{
                        const datas = {
                            kd_brg: item.kode_barang,
                            nm_brg: item.nm_brg,
                            barcode: item.barcode,
                            satuan: item.satuan,
                            harga_beli: item.harga_beli,
                            hrg_jual: item.harga,
                            stock: item.stock,
                            qty: item.qty,
                            tambahan: item.tambahan
                        };
                        store(table, datas)
                        this.getData();
                        return null;
                    })
                }

            }
        }


    }

    componentWillUnmount() {
        this.props.dispatch(setProductbrg({status:'',msg:'',result:{data:[]}}));
        destroy(table);
        localStorage.removeItem('sp');
        localStorage.removeItem('lk');
        localStorage.removeItem('ambil_data');
        localStorage.removeItem('nota');
        localStorage.removeItem('catatan');

    }

    HandleChangeNota(nota){
        this.props.dispatch(setDnData([]))
        this.setState({
            ambil_nota: nota.value,
            error: {
                location: "",
                supplier: "",
                catatan: "",
                notasupplier: "",
                penerima: ""
            }
        })
        destroy(table)
        localStorage.setItem('nota', nota.value);
        this.props.dispatch(FetchDnData(nota.value));
        localStorage.removeItem('sp');
        localStorage.removeItem('lk');
        localStorage.removeItem('catatan');
        this.getData()
    }

    HandleChangeLokasi(lk) {
        let err = Object.assign({}, this.state.error, {
            location: ""
        });
        this.setState({
            location: lk.value,
            error: err
        })
        localStorage.setItem('lk', lk.value);
        let prefix = this.state.jenis_trx.toLowerCase() === 'alokasi' ? 'MC' : (this.state.jenis_trx.toLowerCase() === 'mutasi' ? 'MU' : 'TR');
        this.props.dispatch(FetchNota(lk.value, prefix))
        this.props.dispatch(FetchBrg(1, 'barcode', '', lk.value, null, this.autoSetQty))
        destroy(table)
        this.getData()

    }

    HandleChangeLokasi2(sp) {
        let err = Object.assign({}, this.state.error, {
            location2: ""
        });
        this.setState({
            location2: sp.value,
            error: err
        })
        localStorage.setItem('lk2', sp.value);
    }
    HandleChangeJenisTrx(sp) {
        this.setState({
            jenis_trx: sp.value,
        });
    }

    HandleCommonInputChange(e,errs=true,st=0){
        const column = e.target.name;
        const val = e.target.value;
        this.setState({
            [column]: val
        });
        if(column==='jenis_trx'){
            if(this.state.location!==''){
                let prefix = val.toLowerCase()==='alokasi'?'MC':(val.toLowerCase()==='mutasi'?'MU':'TR');
                this.props.dispatch(FetchNota(this.state.location, prefix))
            }

        }

        if (column === 'notasupplier'){
            this.props.dispatch(FetchCheck({
                table: 'master_beli',
                kolom: 'nonota',
                value: val
            }))
        }

        if (column === 'ambil_data') {
            if(parseInt(val,10)===2){
                this.props.dispatch(FetchDnReport(1, 1000));
            }

            localStorage.setItem('ambil_data',val);
            destroy(table)
            this.getData()
        }

        if(errs){
            let err = Object.assign({}, this.state.error, {
                [column]: ""
            });
            this.setState({
                error: err
            });
        }
    }

    HandleChangeInput(e,id,idx){
        const column = e.target.name;
        const val = e.target.value;

        const cek = cekData('barcode', id, table);
        cek.then(res => {
            if (res === undefined) {
                Toast.fire({
                    icon: 'error',
                    title: `not found.`
                })
            } else {

                let final= {}
                Object.keys(res).forEach((k, i) => {
                    if(k!==column){
                        final[k] = res[k];
                    }else{
                        final[column]=val
                    }
                })

                update(table, final)
                Toast.fire({
                    icon: 'success',
                    title: `${column} has been changed.`
                })
            }
            this.getData()
        })

    }

    HandleChangeInputValue(e,i,barcode=null,datas=[]) {
        const column = e.target.name;
        const val = e.target.value;
        let brgval = [...this.state.brgval];
        brgval[i] = {...brgval[i], [column]: val};
        this.setState({ brgval });

        if(column==='satuan'){
            const cek = cekData('barcode', barcode, table);
            cek.then(res => {
                if (res === undefined) {
                    Toast.fire({
                        icon: 'error',
                        title: `not found.`
                    })
                } else {
                    let newbrg=[];
                    datas.map(i=>{
                        if(i.satuan===val){
                            newbrg=i;
                        }
                    })

                    let final= {
                        id: res.id,
                        kd_brg: res.kd_brg,
                        nm_brg: res.nm_brg,
                        barcode: newbrg.barcode,
                        satuan: newbrg.satuan,
                        harga_beli: newbrg.harga_beli,
                        hrg_jual: newbrg.harga,
                        stock: newbrg.stock,
                        qty: 1,
                        tambahan: res.tambahan
                    }
                    update(table, final)
                    Toast.fire({
                        icon: 'success',
                        title: `${column} has been changed.`
                    })
                }
                this.getData()
                return null;
            })
        }

    }

    setTanggal(date) {
        this.setState({
            tanggal: date
        });
    };

    HandleRemove(e, id){
        e.preventDefault()
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                del(table,id);
                this.getData()
                Swal.fire(
                    'Deleted!',
                    'Your data has been deleted.',
                    'success'
                )
            }
        })
    }

    HandleAddBrg(e,item) {
        e.preventDefault();
        const finaldt = {
            kd_brg: item.kd_brg,
            nm_brg: item.nm_brg,
            barcode: item.barcode,
            satuan: item.satuan,
            harga_beli: item.harga_beli,
            hrg_jual: item.hrg_jual,
            stock: item.stock,
            qty: item.qty,
            tambahan: item.tambahan
        };
        const cek = cekData('kd_brg',item.kd_brg,table);
        cek.then(res => {
            if(res===undefined){
                store(table, finaldt)
            }else{
                update(table,{
                    id:res.id,
                    kd_brg: res.kd_brg,
                    nm_brg: res.nm_brg,
                    barcode: res.barcode,
                    satuan: res.satuan,
                    harga_beli: res.harga_beli,
                    hrg_jual: res.hrg_jual,
                    stock: res.stock,
                    qty: parseFloat(res.qty)+1,
                    tambahan: res.tambahan
                })
            }


            this.getData()
            return null;
        })
    }

    HandleReset(e){
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.value) {
                destroy(table);
                localStorage.removeItem('lk2');
                localStorage.removeItem('lk');
                localStorage.removeItem('ambil_data');
                localStorage.removeItem('nota');
                window.location.reload(false);
            }
        })
    }

    HandleSubmit(e){
        e.preventDefault();

        // validator head form
        let err = this.state.error;
        if (this.state.catatan === "" || this.state.location === "" || this.state.location2 === "") {
            if(this.state.catatan===""){
                err = Object.assign({}, err, {
                    catatan:"Catatan tidak boleh kosong."
                });
            }
            if (this.state.location === "") {
                err = Object.assign({}, err, {
                    location: "Lokasi asal tidak boleh kosong."
                });
            }

            if (this.state.location2 === "") {
                err = Object.assign({}, err, {
                    location2: "Lokasi tujuan tidak boleh kosong."
                });
            }

            this.setState({
                error: err
            })
        }else{
            const data = get(table);
            data.then(res => {
                if (res.length===0){
                    Swal.fire(
                        'Error!',
                        `Pilih barang untuk melanjutkan ${this.state.jenis_trx}.`,
                        'error'
                    )
                }else{
                    Swal.fire({
                        title: `Simpan ${this.state.jenis_trx}?`,
                        text: "Pastikan data yang anda masukan sudah benar!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Ya, Simpan!',
                        cancelButtonText: 'Tidak!'
                    }).then((result) => {
                        if (result.value) {
                            let err_stock="";
                            let subtotal = 0;
                            let detail = [];
                            res.map(item => {
                                subtotal += parseInt(item.harga_beli,10) * parseFloat(item.qty);
                                if(item.qty>item.stock) err_stock=`Qty barang melebihi stock persediaan.`;
                                detail.push({
                                    kd_brg:item.kd_brg,
                                    barcode:item.barcode,
                                    satuan:item.satuan,
                                    qty:item.qty,
                                    hrg_beli: item.harga_beli,
                                    hrg_jual:item.hrg_jual
                                })
                            })
                            let data_final = {
                                tgl_mutasi: moment(this.state.tanggal).format("YYYY-MM-DD"),
                                lokasi_asal:this.state.location,
                                lokasi_tujuan:this.state.location2,
                                catatan:this.state.catatan,
                                kode_delivery_note: this.state.ambil_nota,
                                subtotal,
                                userid: this.state.userid,
                                jenis_trx: this.state.jenis_trx,
                                detail: detail
                            };
                            if(err_stock===''){
                                this.props.dispatch(storeAlokasi(data_final));
                            }else{
                                Swal.fire({
                                    title: `Anda yakin akan melanjutkan transaksi?`,
                                    text: err_stock,
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Ya!',
                                    cancelButtonText: 'Tidak!'
                                }).then((result) => {
                                    if (result.value) {
                                        this.props.dispatch(storeAlokasi(data_final));
                                    }
                                })
                            }
                        }
                    })
                }
                return null;
            })
        }

    }

    autoSetQty(kode, data) {
        const cek = cekData('kd_brg', kode, table);
        return cek.then(res => {
            if (res === undefined) {
                store(table, {
                    kd_brg: data[0].kd_brg,
                    nm_brg: data[0].nm_brg,
                    barcode: data[0].barcode,
                    satuan: data[0].satuan,
                    harga_beli: data[0].harga_beli,
                    hrg_jual: data[0].hrg_jual,
                    stock: data[0].stock,
                    qty: 1,
                    tambahan: data[0].tambahan
                })
            } else {
                update(table, {
                    id: res.id,
                    qty: parseFloat(res.qty) + 1,
                    kd_brg: res.kd_brg,
                    nm_brg: res.nm_brg,
                    barcode: res.barcode,
                    satuan: res.satuan,
                    harga_beli: res.harga_beli,
                    hrg_jual: res.hrg_jual,
                    stock: res.stock,
                    tambahan: res.tambahan
                })
            }
            return true
        })
    }

    HandleSearch() {
        if (this.state.supplier === "" || this.state.lokasi === "") {
            Swal.fire(
                'Gagal!',
                'Pilih lokasi dan supplier terlebih dahulu.',
                'error'
            )
        } else {
            const searchby = parseInt(this.state.searchby,10) === 1 ? 'kd_brg' : (parseInt(this.state.searchby,10) === 2 ? 'barcode' : 'deskripsi')
            this.props.dispatch(FetchBrg(1, searchby, this.state.search, this.state.lokasi, this.state.supplier, this.autoSetQty));
            this.setState({search: ''});

        }
    }

    getData(){
        const data = get(table);
        data.then(res => {
            let brg = [];
            let err = [];
            res.map((i) => {
                brg.push({
                    qty: i.qty,
                    satuan: i.satuan
                });
                err.push({
                    qty:''
                })
            })
            this.setState({
                databrg: res,
                brgval: brg,
                error: Object.assign({}, this.state.eror, {
                    qty: err
                })
            })
            return null;
        });
    }

    render() {
        // if(this.props.isLoading){
        //   return <Preloader/>
        // }

        let subtotal = 0;
        // let grandtotal = 0;
        //  let grandtotal = this.state.grandtotal;
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};

        return (
            <Layout page="Alokasi">
                <div className="row align-items-center">
                    <div className="col-6">
                        <div className="dashboard-header-title mb-3">
                            <h5 className="mb-0 font-weight-bold">Alokasi</h5>
                            {/* <p className="mb-0 font-weight-bold">Welcome to Motrila Dashboard.</p> */}
                        </div>
                    </div>
                    {/* Dashboard Info Area */}
                    <div className="col-6">
                        <div className="dashboard-infor-mation d-flex flex-wrap align-items-center mb-3">

                        </div>
                    </div>
                </div>

                <div className="row" style={{marginTop:'20px'}}>
                    {/* LEFT SIDE */}
                    <div className="col-lg-5 col-md-4 col-xl-3 box-margin">
                        {/* AMBIL DATA */}
                        <div className="card mb-3" style={{height: "auto"}}>
                            <div className="card-body">
                                <div className="chat-area">
                                    <div className="chat-header-text d-flex border-none mb-10">
                                        <div className="chat-about">
                                            <div className="chat-with font-13">Ambil Data</div>
                                        </div>
                                    </div>
                                    <div className="chat-search">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <div className="input-group input-group-sm">
                                                        <select name='ambil_data' className="form-control form-control-sm" onChange={(e)=>this.HandleCommonInputChange(e,false)}>
                                                            <option value={1} selected={this.state.ambil_data===1}>Langsung</option>
                                                            <option value={2} selected={this.state.ambil_data===2}>Delivery Note</option>
                                                        </select>
                                                    </div>
                                                    <small
                                                        id="passwordHelpBlock"
                                                        className="form-text text-muted"
                                                    >
                                                        {parseInt(this.state.ambil_data,10)===1?this.state.jenis_trx+' langsung.':'Ambil data pembelian dari Delivery Note.'}
                                                    </small>
                                                </div>
                                            </div>
                                            <div className="col-md-12" style={parseInt(this.state.ambil_data,10)===1?{display:'none'}:{display:'block'}}>
                                                <div className="form-group">
                                                    <Select
                                                        options={this.state.data_nota}
                                                        placeholder ={"Pilih Nota "+(parseInt(this.state.ambil_data,10)===2?'DN':'')}
                                                        onChange={this.HandleChangeNota}
                                                        value = {
                                                            this.state.data_nota.find(op => {
                                                                return op.value === this.state.ambil_nota
                                                            })
                                                        }

                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* List barang */}
                        <div className="card" style={{height: "auto"}}>
                            <div className="card-body">
                                <div className="chat-area">
                                    <div className="chat-header-text d-flex border-none mb-10">
                                        <div className="chat-about">
                                            <div className="chat-with font-18">Pilih Barang</div>
                                        </div>
                                    </div>
                                    <div className="chat-search">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <div className="input-group input-group-sm">
                                                        <select name='searchby' className="form-control form-control-sm" onChange={(e)=>this.HandleCommonInputChange(e,false)}>
                                                            <option value={1}>Kode Barang</option>
                                                            <option value={2}>Barcode</option>
                                                            <option value={3}>Deskripsi</option>
                                                        </select>
                                                    </div>
                                                    <small
                                                        id="passwordHelpBlock"
                                                        className="form-text text-muted"
                                                    >
                                                        Cari berdasarkan {parseInt(this.state.searchby,10)===1?'Kode Barang':(parseInt(this.state.searchby,10)===2?'Barcode':'Deskripsi')}
                                                    </small>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <div className="input-group input-group-sm">
                                                        <input
                                                            autoFocus
                                                            type="text"
                                                            id="chat-search"
                                                            name="search"
                                                            className="form-control form-control-sm"
                                                            value={this.state.search}
                                                            placeholder="Search"
                                                            onChange={(e)=>this.HandleCommonInputChange(e,false)}
                                                            onKeyPress = {
                                                                event => {
                                                                    if (event.key === 'Enter') {
                                                                        this.HandleSearch();

                                                                    }
                                                                }
                                                            }
                                                        />
                                                        <span className="input-group-append">
                                  <button
                                      type="button"
                                      style={{zIndex:0}}
                                      className="btn btn-primary"
                                      onClick = {
                                          event => {
                                              event.preventDefault();
                                              this.HandleSearch();
                                          }
                                      }
                                  >
                                    <i className="fa fa-search" />
                                  </button>
                                </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/*end chat-search*/}
                                    <Scrollbars style={{ width: "100%", height: "500px", maxHeight:'100%' }}>
                                        <div className="people-list">
                                            <div id="chat_user_2">
                                                <ul className="chat-list list-unstyled">
                                                    {
                                                        this.props.barang.length!==0?
                                                            this.props.barang.map((i,inx)=>{
                                                                return(
                                                                    <li className="clearfix" key={inx} onClick={(e)=>this.HandleAddBrg(e,{
                                                                        kd_brg:i.kd_brg,
                                                                        nm_brg:i.nm_brg,
                                                                        barcode:i.barcode,
                                                                        satuan:i.satuan,
                                                                        harga_beli:i.harga_beli,
                                                                        hrg_jual: i.hrg_jual,
                                                                        stock:i.stock,
                                                                        qty:1,
                                                                        tambahan:i.tambahan,
                                                                    })}>
                                                                        <img src={i.gambar} alt="avatar" />
                                                                        <div className="about">
                                                                            <div className="name">{i.nm_brg}</div>
                                                                            <div className="status" style={{fontStyle:'italic'}}>{i.supplier}</div>
                                                                        </div>
                                                                    </li>
                                                                )
                                                            }):(
                                                                <div style={{textAlign:'center',fontSize:"11px",fontStyle:"italic"}}>Barang tidak ditemukan.</div>
                                                            )

                                                    }


                                                </ul>
                                            </div>
                                        </div>
                                    </Scrollbars>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-7 col-md-8 col-xl-9 box-margin">
                        <div className="card" style={{height: "auto"}}>
                            <div className="container" style={{ marginTop: "20px" }}>
                                {/* HEADER FORM */}
                                <form className=''>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label className="control-label font-12">
                                                            No. Transkasi
                                                        </label>
                                                        <input
                                                            type="text"
                                                            readOnly
                                                            className="form-control"
                                                            id="nota"
                                                            style={{fontWeight:'bolder'}}
                                                            value={this.props.nota}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="control-label font-12">Tanggal Order</label>
                                                        <input type="date" name={"tanggal"} className={"form-control"} value={this.state.tanggal} onChange={(e=>this.HandleCommonInputChange(e))}/>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="control-label font-12">
                                                            Lokasi Asal
                                                        </label>
                                                        <Select
                                                            options={this.state.location_data}
                                                            placeholder = "Pilih Lokasi Asal"
                                                            onChange={this.HandleChangeLokasi}
                                                            value = {
                                                                this.state.location_data.find(op => {
                                                                    return op.value === this.state.location
                                                                })
                                                            }

                                                        />
                                                        <div className="invalid-feedback" style={this.state.error.location!==""?{display:'block'}:{display:'none'}}>
                                                            {this.state.error.location}
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="control-label font-12">
                                                            Lokasi Tujuan
                                                        </label>
                                                        <Select
                                                            options={this.state.location_data.filter(
                                                                option => option.value !== this.state.location
                                                            )}
                                                            placeholder="Pilih Lokasi Tujuan"
                                                            onChange={this.HandleChangeLokasi2}
                                                            value = {
                                                                this.state.location_data.find(op => {
                                                                    return op.value === this.state.location2
                                                                })
                                                            }
                                                        />
                                                        <div className="invalid-feedback" style={this.state.error.location2!==""?{display:'block'}:{display:'none'}}>
                                                            {this.state.error.location2}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="control-label font-12">
                                                            Jenis Transaksi
                                                        </label>
                                                        <Select
                                                            options={this.state.jenis_trx_data}
                                                            placeholder="Pilih Jenis Transaksi"
                                                            onChange={this.HandleChangeJenisTrx}
                                                            value={
                                                                this.state.jenis_trx_data.find(op => {
                                                                    return op.value === this.state.jenis_trx
                                                                })
                                                            }

                                                        />

                                                    </div>
                                                    <div className="form-group">
                                                        <label className="control-label font-12">
                                                            Catatan
                                                        </label>
                                                        <input type="text" name={"catatan"} className={"form-control"} value={this.state.catatan} onChange={(e=>this.HandleCommonInputChange(e))}/>
                                                        <div className="invalid-feedback" style={this.state.error.catatan!==""?{display:'block'}:{display:'none'}}>
                                                            {this.state.error.catatan}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="card-body">
                                <div id="tableContainer">
                                    <div style={{overflowX:'auto',zoom:'85%'}}>

                                        <table className="table table-hover table-bordered">
                                            <thead >
                                            <tr>
                                                <th style={columnStyle}>#</th>
                                                <th style={columnStyle}>Nama</th>
                                                <th style={columnStyle}>Barcode</th>
                                                <th style={columnStyle}>Satuan</th>
                                                <th style={columnStyle}>Harga beli</th>
                                                <th style={columnStyle}>Harga jual1</th>
                                                <th style={columnStyle}>Stock</th>
                                                <th style={columnStyle}>Qty</th>
                                                <th style={columnStyle}>Subtotal</th>
                                            </tr>
                                            </thead>

                                            <tbody>
                                            {
                                                this.state.databrg.map((item,index)=>{
                                                    subtotal+=this.state.jenis_trx.toLowerCase()!=='transaksi'?parseInt(item.harga_beli,10)*parseFloat(item.qty):parseInt(item.hrg_jual,10)*parseFloat(item.qty);
                                                    return (
                                                        <tr key={index} >
                                                            <td style={columnStyle}>
                                                                <a href="about:blank" className='btn btn-danger btn-sm' onClick={(e)=>this.HandleRemove(e,item.id)}><i className='fa fa-trash'/></a>
                                                            </td>
                                                            <td style={columnStyle}>{item.nm_brg}</td>
                                                            <td style={columnStyle}>{item.barcode}</td>
                                                            <td style={columnStyle}><select className="form-control" style={{width:"100px"}} name='satuan' onChange={(e)=>this.HandleChangeInputValue(e,index,item.barcode,item.tambahan)}>
                                                                {
                                                                    item.tambahan.map(i=>{
                                                                        return(
                                                                            <option value={i.satuan} selected={i.satuan === item.satuan}>{i.satuan}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </select></td>
                                                            <td style={columnStyle}>{item.harga_beli}</td>
                                                            <td style={columnStyle}>{item.hrg_jual}</td>
                                                            <td style={columnStyle}>{item.stock}</td>
                                                            <td style={columnStyle}>
                                                                <input type='text' name='qty' className="form-control" onBlur={(e)=>this.HandleChangeInput(e,item.barcode)} style={{width:'100%',textAlign:'center'}} onChange={(e)=>this.HandleChangeInputValue(e,index)}  value={this.state.brgval[index].qty}/>
                                                                <div className="invalid-feedback" style={parseInt(this.state.brgval[index].qty,10)>parseInt(item.stock,10)?{display:'block'}:{display:'none'}}>
                                                                    Qty Melebihi Stock.
                                                                </div>
                                                            </td>
                                                            <td style={columnStyle}>{this.state.jenis_trx.toLowerCase()!=='transaksi'?parseInt(item.harga_beli,10)*parseFloat(item.qty):parseInt(item.hrg_jual,10)*parseFloat(item.qty)}</td>
                                                        </tr>
                                                    )
                                                })

                                            }
                                            </tbody>
                                        </table>


                                    </div>
                                    <div className='row'>
                                        <div className="col-md-7">
                                            <div className="dashboard-btn-group d-flex align-items-center">
                                                <a href="about:blank" onClick={(e)=>this.HandleSubmit(e)} className="btn btn-primary ml-1">Simpan</a>
                                                <a href="about:blank" onClick={(e)=>this.HandleReset(e)} className="btn btn-danger ml-1">Reset</a>
                                            </div>
                                        </div>
                                        <div className="col-md-5" style={{zoom:'70%'}}>
                                            <div className="pull-right">
                                                <form className="form_head">
                                                    <div className="row" style={{marginBottom: '3px'}}>
                                                        <label className="col-sm-4">Sub Total</label>
                                                        <div className="col-sm-8">
                                                            <input type="text" id="sub_total" name="sub_total" className="form-control text-right" value={subtotal} readOnly />
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}


const mapStateToPropsCreateItem = (state) => ({
    barang: state.productReducer.result_brg,
    loadingbrg: state.productReducer.isLoadingBrg,
    nota: state.alokasiReducer.code,
    supplier: state.supplierReducer.dataSupllier,
    isLoading:state.alokasiReducer.isLoading,
    auth:state.auth,
    dn_report: state.dnReducer.report_data,
    dn_data: state.dnReducer.dn_data,
    checkNotaPem: state.siteReducer.check
});

export default connect(mapStateToPropsCreateItem)(Alokasi);