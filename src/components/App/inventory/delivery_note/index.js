import React,{Component} from 'react';
import axios from 'axios';
import Select from 'react-select'
import Swal from 'sweetalert2'
import connect from "react-redux/es/connect/connect";
import moment from 'moment';
import AsyncSelect from 'react-select/async';
import {store,get, update,destroy,cekData,del} from "components/model/app.model";
import Layout from "components/App/Layout"
import {FetchBrg,setProductbrg} from 'redux/actions/masterdata/product/product.action'
import {FetchCheck} from 'redux/actions/site.action'
import {FetchNota,storeDN} from 'redux/actions/inventory/dn.action'
import {FetchReceiveData,setPoData} from 'redux/actions/purchase/receive/receive.action'
import {HEADERS} from 'redux/actions/_constants'
import {toRp,ToastQ} from "helper";
import {withRouter} from 'react-router-dom';
import StickyBox from "react-sticky-box";
import Spinner from 'Spinner'

const table='delivery_note'


const filterColors = (inputValue) => {
    let search = 'receive/report?page=1&perpage=40';
    if (inputValue !== '') search = 'receive/report?page=1&perpage=40&q='+inputValue;
    return axios.get(HEADERS.URL + search)
        .then(function (response) {
            const data = response.data
            let options=[]
            data.result.data.map((i) => {
                options.push({
                    value: i.no_faktur_beli,
                    label: i.no_faktur_beli
                });
                return null;
            })
            return options;

        })
        .catch(function (error) {
            return [];
        })
};

const loadOptions = (inputValue,callback) => {
    const results = filterColors(inputValue);
    results.then(res=>{
        callback(res)
    })
};
class DeliveryNote extends Component{
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
            location_val:"",
            location2_val:"",
            catatan:"",
            userid:0,
            searchby:1,
            search:"",
            no_faktur_beli:"-",
            data_nota:[],
            ambil_data:1,
            ambil_nota:'',
            perpage:5,
            scrollPage:0,
            isScroll:false,
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
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.handleLoad = this.handleLoad.bind(this);
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
        if(param.barang.length>0){
            this.getData()
        }
        if (param.receive_data){
            if (param.receive_data.master!==undefined){
                if(this.props.receive_data===undefined){
                    this.props.dispatch(FetchNota(param.receive_data.master.lokasi))
                    this.setState({
                        location: param.receive_data.master.lokasi,
                        catatan: param.receive_data.master.catatan,
                        no_faktur_beli: param.receive_data.master.no_faktur_beli
                    })
                    localStorage.setItem('lk', param.receive_data.master.lokasi)
                    localStorage.setItem('catatan', param.receive_data.master.catatan)

                    param.receive_data.detail.map(item=>{
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
    componentWillMount(){
        this.getProps(this.props);
    }
    componentDidMount() {
        this.getData()
        if (localStorage.catatan !== undefined && localStorage.catatan !== '') {
            this.setState({
                catatan: localStorage.catatan
            })
        }

        if (localStorage.ambil_data !== undefined && localStorage.ambil_data !== '') {
            if (localStorage.ambil_data === 2) {
                // this.props.dispatch(FetchPoReport(1, 1000))
            }
            this.setState({
                ambil_data: localStorage.ambil_data
            })
        }

        if (localStorage.nota !== undefined && localStorage.nota !== '') {

            this.setState({
                ambil_nota: localStorage.nota
            })
            // this.props.dispatch(FetchReceiveData(localStorage.nota));
            // destroy(table)
            // this.getData()
        }

        if (localStorage.lk !== undefined && localStorage.lk !== '') {
            this.props.dispatch(FetchNota(localStorage.lk))
            this.props.dispatch(FetchBrg(1, 'barcode', '', localStorage.lk, null, this.autoSetQty,5))

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
        let perpage=this.state.perpage;
        if(this.props.barang.length === perpage){
            this.setState({
                perpage:perpage+5
            });
        }

        this.getProps(nextProps);
    }
    componentWillUnmount() {
        this.props.dispatch(setProductbrg({status:'',msg:'',result:{data:[]}}));
        destroy(table);
        localStorage.removeItem('sp');
        localStorage.removeItem('lk');
        localStorage.removeItem('ambil_data');
        localStorage.removeItem('nota');
        localStorage.removeItem('catatan');
        localStorage.removeItem('anyDeliveryNote');

    }
    HandleChangeNota(nota){
        this.props.dispatch(setPoData([]))
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



        localStorage.setItem('nota', nota.value);
        this.props.dispatch(FetchReceiveData(nota.value));
        destroy(table)
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
            location_val: lk.label,
            error: err
        })
        localStorage.setItem('lk', lk.value);
        this.props.dispatch(FetchNota(lk.value))
        this.props.dispatch(FetchBrg(1, 'barcode', '', lk.value, null, this.autoSetQty,5))
        destroy(table)
        this.getData()

    }
    HandleChangeLokasi2(sp) {
        let err = Object.assign({}, this.state.error, {
            location2: ""
        });
        this.setState({
            location2: sp.value,
            location2_val: sp.label,
            error: err
        })
        localStorage.setItem('lk2', sp.value);
    }
    HandleCommonInputChange(e,errs=true,st=0){
        const column = e.target.name;
        const val = e.target.value;

        this.setState({
            [column]: val
        });

        if (column === 'notasupplier'){
            this.props.dispatch(FetchCheck({
                table: 'master_beli',
                kolom: 'nonota',
                value: val
            }))
        }

        if (column === 'ambil_data') {
            if(val===2){
                // this.props.dispatch(FetchPoReport(1, 1000))
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
                ToastQ.fire({
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
                ToastQ.fire({
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
                    ToastQ.fire({
                        icon: 'error',
                        title: `not found.`
                    })
                } else {
                    let newbrg=[];
                    datas.map(i=>{
                        if(i.satuan===val){
                            newbrg=i;
                            //
                        }
                        return null;
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
                    ToastQ.fire({
                        icon: 'success',
                        title: `${column} has been changed.`
                    })
                }
                this.getData()
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
        Swal.fire({allowOutsideClick: false,
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
        this.setState({
            isScroll:false
        });
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
        })
    }
    HandleReset(e){
        e.preventDefault();
        Swal.fire({allowOutsideClick: false,
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
                        'Pilih barang untuk melanjutkan Delivery Note.',
                        'error'
                    )
                }else{
                    Swal.fire({allowOutsideClick: false,
                        title: 'Simpan Delivery Note?',
                        text: "Pastikan data yang anda masukan sudah benar!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Ya, Simpan!',
                        cancelButtonText: 'Tidak!'
                    }).then((result) => {
                        if (result.value) {
                            let subtotal = 0;
                            let detail = [];
                            res.map(item => {
                                subtotal += parseInt(item.harga_beli,10) * parseFloat(item.qty);
                                detail.push({
                                    kd_brg:item.kd_brg,
                                    barcode:item.barcode,
                                    satuan:item.satuan,
                                    qty:item.qty,
                                    hrg_beli: item.harga_beli,
                                    hrg_jual:item.hrg_jual
                                })
                                return null;
                            })
                            let data_final = {
                                tanggal: moment(this.state.tanggal).format("YYYY-MM-DD"),
                                lokasi_asal:this.state.location,
                                lokasi_tujuan:this.state.location2,
                                catatan:this.state.catatan,
                                kode_pembelian: this.state.ambil_nota,
                                subtotal,
                                userid: this.state.userid,
                                detail: detail
                            };
                            //
                            let parsedata={};
                            parsedata['detail'] = data_final;
                            parsedata['master'] = this.state.databrg;
                            parsedata['nota'] = this.props.nota;
                            parsedata['logo'] = this.props.auth.user.logo;
                            parsedata['user'] = this.props.auth.user.username;
                            parsedata['lokasi_asal'] = this.state.location_val;
                            parsedata['lokasi_tujuan'] = this.state.location2_val;
                            this.props.dispatch(storeDN(parsedata,(arr)=>this.props.history.push(arr)));
                        }
                    })
                }
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
            localStorage.setItem("anyDeliveryNote",this.state.search);
            const searchby = parseInt(this.state.searchby,10) === 1 ? 'kd_brg' : (parseInt(this.state.searchby,10) === 2 ? 'barcode' : 'deskripsi')
            this.props.dispatch(FetchBrg(1, searchby, this.state.search, this.state.lokasi, this.state.supplier, this.autoSetQty,5));
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
                return null;
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
    handleLoadMore(){
        this.setState({
            isScroll:true
        });
        let perpage = parseInt(this.props.paginBrg.per_page,10);
        let lengthBrg = parseInt(this.props.barang.length,10);
        if(perpage===lengthBrg || perpage<lengthBrg){
            let searchby='';
            if(parseInt(this.state.searchby,10)===1 || this.state.searchby===""){
                searchby='kd_brg';
            }
            if(parseInt(this.state.searchby,10)===2){
                searchby='barcode';
            }
            if(parseInt(this.state.searchby,10)===3){
                searchby='deskripsi';
            }
            this.props.dispatch(FetchBrg(1,searchby, localStorage.anyDeliveryNote!==undefined?localStorage.anyDeliveryNote:"", this.state.location, null, this.autoSetQty,this.state.perpage));
            this.setState({scrollPage:this.state.scrollPage+5});
        }
        else{
            Swal.fire({allowOutsideClick: false,
                title: 'Perhatian',
                icon: 'warning',
                text: 'Tidak ada data.',
            });
        }

    }
    handleScroll(){
        let divToScrollTo;
        divToScrollTo = document.getElementById(`item${this.state.scrollPage}`);
        if (divToScrollTo) {
            divToScrollTo.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' })
        }
    }

    handleLoad(e){
        console.log(e.height);
    }

    render() {
        if(this.state.isScroll===true)this.handleScroll();
        console.log(this.state.isScroll);
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        let subtotal = 0;
        return (
            <Layout page="Delivery Note">
                <div className="card">
                    <div className="card-header">
                        <h4>Delivery Note</h4>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12" style={{ display: 'flex', alignItems: 'flex-start' }}>
                                {/*START LEFT*/}
                                <StickyBox offsetTop={100} offsetBottom={20} style={{zoom:"80%",width:"25%",marginRight:"10px"  }}>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label className="control-label font-12">{parseInt(this.state.ambil_data,10)===1?'Delivery note langsung.':'Ambil data DN dari Pembelian.'}</label>
                                                <div className="input-group input-group-sm">
                                                    <select name='ambil_data' className="form-control form-control-sm" onChange={(e)=>this.HandleCommonInputChange(e,false)}>
                                                        <option value={1} selected={this.state.ambil_data === 1}>Delivery Note Langsung</option>
                                                        <option value={2} selected={this.state.ambil_data===2}>Pembelian</option>
                                                    </select>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="col-md-12" style={parseInt(this.state.ambil_data,10)===1?{display:'none'}:{display:'block'}}>
                                            <div className="form-group">
                                                <label className="control-label font-12">Nota Pembelian</label>
                                                <AsyncSelect
                                                    placeholder ={"Pilih Nota "+(parseInt(this.state.ambil_data,10)===1?'':'Pembelian')}
                                                    onChange={this.HandleChangeNota}
                                                    value = {{
                                                        label: this.state.ambil_nota,
                                                        value: this.state.ambil_nota
                                                    }}
                                                    cacheOptions
                                                    loadOptions={loadOptions}
                                                    defaultOptions
                                                    filterOptions = {
                                                        (options, filter, currentValues) => {
                                                            return options;
                                                        }
                                                    }

                                                />
                                            </div>
                                        </div>
                                    </div>
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
                                                        <small id="passwordHelpBlock" className="form-text text-muted">
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
                                                                placeholder={`Search ${localStorage.anyDeliveryNote!==undefined?localStorage.anyDeliveryNote:""}`}
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
                                        <div className="people-list" style={{height:'300px',maxHeight:'100%',overflowY:'scroll'}}>
                                            {
                                                !this.props.loadingbrg?
                                                        <div id="chat_user_2">
                                                            <ul className="chat-list list-unstyled">
                                                                {
                                                                    this.props.barang.length!==0?
                                                                        this.props.barang.map((i,inx)=>{
                                                                            return(
                                                                            <li style={{backgroundColor:this.state.scrollPage===inx?"#eeeeee":""}} id={`item${inx}`} className="clearfix" key={inx} onClick={(e)=>this.HandleAddBrg(e,{
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
                                                                                {i.gambar === `${HEADERS.URL}images/barang/default.png` ? (<span class="circle">{inx + 1}</span>) : (<img src={i.gambar} alt="avatar"/>)}
                                                                                    <div className="about">
                                                                                        <div className="status" style={{color: 'black',fontWeight:"bold", wordBreak:"break-all", fontSize:"12px"}}>{i.nm_brg}</div>
                                                                                        <div className="status" style={{color: '#a1887f', fontWeight:"bold", wordBreak:"break-all", fontSize:"12px"}}>({i.kd_brg}) {i.supplier}</div>
                                                                                    </div>
                                                                                </li>
                                                                            )
                                                                        })
                                                                    :(
                                                                        <div style={{textAlign:'center',fontSize:"11px",fontStyle:"italic"}}>Barang tidak ditemukan.</div>
                                                                    )
                                                                }
                                                            </ul>
                                                        </div>
                                                    :<div id="chat_user_2"><Spinner/></div>
                                            }
                                        </div>
                                        <hr/>
                                        <div className="form-group">
                                            <button className={"btn btn-primary"} style={{width:"100%"}} onClick={this.handleLoadMore}>{this.props.loadingbrg?'tunggu sebentar ...':'tampilkan lebih banyak'}</button>
                                        </div>
                                    </div>
                                </StickyBox>
                                {/*END LEFT*/}
                                {/*START RIGHT*/}
                                <div style={{width:"75%"}}>
                                    <div className="card-header" style={{zoom:"85%"}}>
                                        <form className=''>
                                            <div className="row">
                                                <div className="col-md-2">
                                                    <div className="form-group">
                                                        <label className="control-label font-12">No. Transaksi</label>
                                                        <input type="text" readOnly className="form-control" id="nota" value={this.props.nota}  style={{padding:"9px"}}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-2">
                                                    <div className="form-group">
                                                        <label className="control-label font-12">Tanggal</label>
                                                        <input type="date" name={"tanggal"} className={"form-control"} value={this.state.tanggal} onChange={(e=>this.HandleCommonInputChange(e))} style={{padding:"9px"}}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label className="control-label font-12">Lokasi Asal</label>
                                                        <Select options={this.state.location_data} placeholder = "=== Pilih ===" onChange={this.HandleChangeLokasi} value = {this.state.location_data.find(op => {return op.value === this.state.location})}/>
                                                        <div className="invalid-feedback" style={this.state.error.location!==""?{display:'block'}:{display:'none'}}>
                                                            {this.state.error.location}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label className="control-label font-12">Lokasi Tujuan</label>
                                                        <Select options={this.state.location_data.filter(option => option.value !== this.state.location)}
                                                            placeholder="=== Pilih ==="
                                                            onChange={this.HandleChangeLokasi2}
                                                            value = {this.state.location_data.find(op => {return op.value === this.state.location2})}
                                                        />
                                                        <div className="invalid-feedback" style={this.state.error.supplier!==""?{display:'block'}:{display:'none'}}>
                                                            {this.state.error.supplier}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-2">
                                                    <div className="form-group">
                                                        <label className="control-label font-12">Catatan</label>
                                                        <input type="text" name="catatan" className="form-control" value={this.state.catatan} onChange={(e=>this.HandleCommonInputChange(e))} style={{padding:"9px"}}/>
                                                        <div className="invalid-feedback" style={this.state.error.catatan!==""?{display:'block'}:{display:'none'}}>
                                                            {this.state.error.catatan}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div style={{overflowX: 'auto',zoom:'80%',marginTop:"10px"}}>
                                        <table className="table table-hover">
                                            <thead>
                                            <tr>
                                                <th style={columnStyle}>No</th>
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
                                                this.state.databrg.map((item, index) => {
                                                    subtotal += parseInt(item.harga_beli,10) * parseFloat(item.qty);
                                                    return (
                                                        <tr key={index}>
                                                            <td style={columnStyle}>{index+1}</td>

                                                            <td style={columnStyle}>
                                                                <a href="about:blank" className='btn btn-danger btn-sm'
                                                                   onClick={(e) => this.HandleRemove(e, item.id)}><i
                                                                    className='fa fa-trash'/></a>
                                                            </td>
                                                            <td style={columnStyle}>{item.nm_brg}</td>
                                                            <td style={columnStyle}>{item.barcode}</td>
                                                            <td style={columnStyle}><select className="form-control" name='satuan' disabled={item.tambahan.length<=1?true:false} style={{width:"100px"}} onChange={(e) => this.HandleChangeInputValue(e, index, item.barcode, item.tambahan)}>
                                                                {
                                                                    item.tambahan.map(i => {
                                                                        return (
                                                                            <option value={i.satuan} selected={i.satuan === item.satuan}>{i.satuan}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </select></td>
                                                            <td style={columnStyle}>
                                                                <input type="text" className="form-control" value={toRp(item.harga_beli)} readOnly style={{textAlign:"right",width:"100px"}}/>
                                                            </td>
                                                            <td style={columnStyle}>
                                                                <input type="text" className="form-control" value={toRp(item.hrg_jual)} readOnly style={{textAlign:"right",width:"100px"}}/>
                                                            </td>
                                                            <td style={columnStyle}>
                                                                <input type="text" className="form-control" value={item.stock} readOnly style={{textAlign:"right",width:"100px"}}/>
                                                            </td>
                                                            <td style={columnStyle}>
                                                                <input
                                                                    type='text' name='qty'
                                                                    onBlur={(e) => this.HandleChangeInput(e, item.barcode)}
                                                                    style={{width: '100px', textAlign: 'right'}}
                                                                    onChange={(e) => this.HandleChangeInputValue(e, index)}
                                                                    className="form-control"
                                                                    value={this.state.brgval[index].qty}
                                                                />
                                                                <div className="invalid-feedback"
                                                                     style={parseInt(this.state.brgval[index].qty,10) > parseInt(item.stock,10) ? {display: 'block'} : {display: 'none'}}>
                                                                    Qty Melebihi Stock.
                                                                </div>
                                                            </td>
                                                            <td style={columnStyle}>
                                                                <input type="text" className="form-control" value={toRp(parseInt(item.harga_beli,10) * parseFloat(item.qty))} readOnly style={{textAlign:"right",width:"100px"}}/>
                                                            </td>
                                                        </tr>
                                                    )
                                                })

                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                    <hr/>
                                    <div className='row'>
                                        <div className="col-md-7">
                                            <div className="dashboard-btn-group d-flex align-items-center">
                                                <a href="about:blank" onClick={(e) => this.HandleSubmit(e)}
                                                   className="btn btn-primary ml-1">Simpan</a>
                                                <a href="about:blank" onClick={(e) => this.HandleReset(e)}
                                                   className="btn btn-danger ml-1">Reset</a>
                                            </div>
                                        </div>
                                        <div className="col-md-5" style={{zoom: '70%'}}>
                                            <div className="pull-right">
                                                <form className="form_head">
                                                    <div className="row" style={{marginBottom: '3px'}}>
                                                        <label className="col-sm-4">Sub Total</label>
                                                        <div className="col-sm-8">
                                                            <input type="text" id="sub_total" name="sub_total" className="form-control text-right" value={toRp(subtotal)} readOnly/>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                {/*END RIGHT*/}

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
    paginBrg:state.productReducer.pagin_brg,
    nota: state.dnReducer.code,
    isLoading:state.receiveReducer.isLoading,
    auth:state.auth,
    po_report: state.poReducer.report_data,
    receive_data: state.receiveReducer.receive_data,
    checkNotaPem: state.siteReducer.check
});

export default withRouter(connect(mapStateToPropsCreateItem)(DeliveryNote));