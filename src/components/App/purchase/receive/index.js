import React,{Component} from 'react';
import {store,get, update,destroy,cekData,del} from "components/model/app.model";
import connect from "react-redux/es/connect/connect";
import Layout from "components/App/Layout"
import {FetchBrg,setProductbrg} from 'redux/actions/masterdata/product/product.action'
import {FetchCheck} from 'redux/actions/site.action'
import {FetchSupplierAll} from 'redux/actions/masterdata/supplier/supplier.action'
import {FetchNota,storeReceive} from 'redux/actions/purchase/receive/receive.action'
import {FetchPoReport,FetchPoData,setPoData} from 'redux/actions/purchase/purchase_order/po.action'
import Select from 'react-select'
import Swal from 'sweetalert2'
import moment from 'moment';
import {updateReceive} from "redux/actions/purchase/receive/receive.action";
import axios from "axios";
import {HEADERS} from "redux/actions/_constants";
import {withRouter} from "react-router-dom"
import StickyBox from "react-sticky-box";
import imgDefault from 'assets/default.png'
import {toRp,lengthBrg,ToastQ} from "helper";
import { rmComma, toCurrency } from '../../../../helper';
import Spinner from 'Spinner'
const table='receive';

class Receive extends Component{
    constructor(props) {
        super(props);
        this.state = {
            addingItemName: "",
            no_faktur_beli:"-",
            databrg: [],
            brgval:[],
            tanggal: moment(new Date()).format("yyyy-MM-DD"),
            harga_beli: 0,
            diskon:0,
            ppn:0,
            qty:0,
            location_data:[],
            location:"",
            location_val:"",
            supplier:"",
            catatan:"",
            notasupplier:"",
            penerima:"",
            jenis_trx:"Tunai",
            userid:0,
            searchby:1,
            qty_bonus:0,
            discount_persen:0,
            discount_harga:0,
            pajak:0,
            search:"",
            grandtotal:0,
            no_po:'-',
            pre_receive:'-',
            data_nota:[],
            ambil_data:1,
            ambil_nota:'',
            perpage:5,
            error:{
                location:"",
                supplier:"",
                catatan:"",
                notasupplier:"",
                penerima: ""
            }
        };
        this.HandleRemove = this.HandleRemove.bind(this);
        this.HandleAddBrg = this.HandleAddBrg.bind(this);
        this.HandleChangeInput = this.HandleChangeInput.bind(this);
        this.HandleChangeInputValue = this.HandleChangeInputValue.bind(this);
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.HandleChangeSupplier = this.HandleChangeSupplier.bind(this);
        this.setTanggal=this.setTanggal.bind(this);
        this.HandleReset = this.HandleReset.bind(this);
        this.HandleSearch = this.HandleSearch.bind(this);
        this.getData = this.getData.bind(this);
        this.HandleChangeNota = this.HandleChangeNota.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }
    async fetchDataEdit(){
        const url = HEADERS.URL + `receive/ambil_data/${this.props.match.params.slug}`;
        return await axios.get(url)
            .then(function (response) {
                return response.data.result;
            })
            .catch(function (error) {
                if (error.response) {
                }
            })
    }
    componentWillMount(){
        if(this.props.match.params.slug!==undefined&&this.props.match.params.slug!==null){
            destroy(table);
            const data = this.fetchDataEdit();
            data.then(res=>{
                res.detail.map((v,i)=>{
                    const data_final={
                        "kd_brg" : v.kode_barang,
                        "barcode" : v.barcode,
                        "satuan" : v.satuan,
                        "diskon" : v.diskon,
                        "harga_beli" : v.harga_beli,
                        "stock" : v.stock,
                        "diskon2" : 0,
                        "diskon3" :0,
                        "diskon4" : 0,
                        "ppn" : v.ppn,
                        "qty" : v.jumlah_beli,
                        "qty_bonus" : v.jumlah_bonus,
                        "nm_brg" : v.nm_brg,
                        "tambahan" : v.tambahan,
                    };
                    store('receive', data_final);
                    return null;
                });
                this.getData();
                this.props.dispatch(FetchBrg(1, 'barcode', '', localStorage.lk, localStorage.sp, this.autoSetQty,5));
                // this.props.dispatch(FetchBrg(1, 'barcode', '', localStorage.lk, null, this.autoSetQty,5));
                this.setState({
                    location:res.master.lokasi,
                    catatan:res.master.catatan,
                    supplier:res.master.kode_supplier,
                    no_faktur_beli:this.props.match.params.slug,
                    penerima:res.master.nama_penerima,
                    notasupplier:res.master.nonota,
                    jenis_trx:res.master.type,
                    discount_persen:(res.master.disc/res.master.total_pembelian)*100,
                    discount_harga:res.master.disc,
                    pajak:res.master.ppn
                })
            });

            // window.location.reload();


            // let get_master = localStorage.getItem('data_master_receive');
            // let master = JSON.parse(get_master);




        }
    }
    componentDidMount() {
        this.props.dispatch(FetchSupplierAll())
        this.getData()
        if (localStorage.catatan !== undefined && localStorage.catatan !== '') {
            this.setState({
                catatan: localStorage.catatan
            })
        }

        if (localStorage.ambil_data !== undefined && localStorage.ambil_data !== '') {
            if (parseInt(localStorage.ambil_data,10) === 2) {
                this.props.dispatch(FetchPoReport(1, 1000))
            }
            this.setState({
                ambil_data: localStorage.ambil_data
            })
        }

        if (localStorage.nota !== undefined && localStorage.nota !== '') {

            this.setState({
                ambil_nota: localStorage.nota
            })
            this.props.dispatch(FetchPoData(localStorage.nota));
            destroy(table)
            this.getData()
        }

        if (localStorage.lk !== undefined && localStorage.lk !== '') {
            this.props.dispatch(FetchNota(localStorage.lk))
            this.setState({
                location: localStorage.lk
            })
        }
        if (localStorage.sp !== undefined && localStorage.sp !== '') {
            this.setState({
                supplier: localStorage.sp
            })
        }
        if (localStorage.sp !== undefined && localStorage.sp !== '' && localStorage.lk !== undefined && localStorage.lk !== '') {
            // this.props.dispatch(FetchBrg(1, 'barcode', '', localStorage.lk, null, this.autoSetQty, 5))
            this.props.dispatch(FetchBrg(1, 'barcode', '', localStorage.lk, localStorage.sp, this.autoSetQty, 5))
        }
    }
    componentWillReceiveProps = (nextProps) => {
        let perpage=this.state.perpage;
        if(nextProps.barang.length === perpage){
            this.setState({
                perpage:perpage+5
            });
        }
        if (nextProps.auth.user) {
            let lk = [];
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

        if(nextProps.po_report){
            let nota = []
            let po = nextProps.po_report;
            if (po !== undefined) {
                po.map((i) => {
                    nota.push({
                        value: i.no_po,
                        label: i.no_po+" ("+i.nama_supplier+")"
                    });
                    return null;
                })
                this.setState({
                    data_nota: nota
                })
            }

        }
        if (nextProps.po_data){
            if (nextProps.po_data.master!==undefined){
                if(this.props.po_data===undefined){
                    this.props.dispatch(FetchNota(nextProps.po_data.master.lokasi))
                    this.setState({
                        location: nextProps.po_data.master.lokasi,
                        supplier: nextProps.po_data.master.kode_supplier,
                        catatan: nextProps.po_data.master.catatan,
                        jenis_trx: nextProps.po_data.master.jenis,
                        no_po: nextProps.po_data.master.no_po
                    })
                    localStorage.setItem('lk', nextProps.po_data.master.lokasi)
                    localStorage.setItem('sp', nextProps.po_data.master.kode_supplier)
                    localStorage.setItem('catatan', nextProps.po_data.master.catatan)

                    nextProps.po_data.detail.map(item=>{
                        const datas = {
                            kd_brg: item.kode_barang,
                            barcode: item.barcode,
                            satuan: item.satuan,
                            diskon: item.diskon,
                            diskon2: item.disc2,
                            diskon3: item.disc3,
                            diskon4: item.disc4,
                            ppn: item.ppn,
                            harga_beli: rmComma(item.harga_beli),
                            qty: item.jumlah_beli,
                            qty_bonus: 0,
                            stock: item.stock,
                            nm_brg: item.nm_brg,
                            tambahan: item.tambahan
                        };
                        store(table, datas);
                        this.getData();
                        return null;
                    })
                }

            }
        }

        if(nextProps.checkNotaPem){
            this.setState({
                error: Object.assign({}, this.state.error, {
                    notasupplier: "Nota supplier sudah digunakan."
                })
            })
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
        localStorage.removeItem('data_master_receive');
        localStorage.removeItem('data_detail_receive');
        destroy('receive');
        if(this.props.match.params.slug!==undefined&&this.props.match.params.slug!==null){
            localStorage.removeItem('data_master_receive');
            localStorage.removeItem('data_detail_receive');
            destroy('receive');
        }

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
        this.props.dispatch(FetchPoData(nota.value));
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
        if (this.state.supplier !== "") {
            this.props.dispatch(FetchBrg(1, 'barcode', '', lk.value, this.state.supplier, this.autoSetQty,5))
            // this.props.dispatch(FetchBrg(1, 'barcode', '', lk.value, null, this.autoSetQty,5))
        }
        destroy(table)
        this.getData()

    }
    HandleChangeSupplier(sp) {
        let err = Object.assign({}, this.state.error, {
            supplier: ""
        });
        this.setState({
            supplier: sp.value,
            error: err
        })
        localStorage.setItem('sp', sp.value);

        if (this.state.location !== "") {
            // this.props.dispatch(FetchBrg(1, 'barcode', '', this.state.location, null, this.autoSetQty, 5))
            this.props.dispatch(FetchBrg(1, 'barcode', '', this.state.location, sp.value, this.autoSetQty, 5))
        }
        destroy(table)
        this.getData()
    }
    HandleCommonInputChange(e,errs=true,st=0){
        const column = e.target.name;
        const val = e.target.value;

        if (column === 'discount_persen' || column === 'pajak'){
            if (val < 0 || val==='') this.setState({[column]: 0});
            else if (val >100) this.setState({[column]: 100});
            else this.setState({[column]: val});

            if (column === 'discount_persen'){
                this.setState({ 'discount_harga': (st*(val/100)) });
            }
        } else if (column === 'discount_harga') {
            const disper = (val/st) * 100;
            this.setState({ 'discount_persen': disper>=100?100:disper, [column]: disper>=100?st:val });
        }else{
            this.setState({
                [column]: val
            });
        }

        if (column === 'notasupplier'){
            this.props.dispatch(FetchCheck({
                table: 'master_beli',
                kolom: 'nonota',
                value: val
            }))
        }

        if (column === 'ambil_data') {
            if (parseInt(val,10) === 2) {
                this.props.dispatch(FetchPoReport(1, 1000))
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
    HandleChangeInput(e,id){
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
                        }
                        return null;
                    })

                    let final= {
                        id: res.id,
                        qty: 0,
                        kd_brg: res.kd_brg,
                        barcode: newbrg.barcode,
                        satuan: newbrg.satuan,
                        diskon: res.diskon,
                        diskon2: res.diskon2,
                        diskon3: 0,
                        diskon4: 0,
                        ppn: res.ppn,
                        qty_bonus: res.qty_bonus,
                        stock: newbrg.stock,
                        harga_beli: newbrg.harga_beli,
                        nm_brg: res.nm_brg,
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
            barcode:item.barcode,
            satuan:item.satuan,
            diskon:item.diskon,
            diskon2:0,
            diskon3:0,
            diskon4:0,
            ppn:item.ppn,
            harga_beli:rmComma(item.harga_beli),
            qty:item.qty,
            qty_bonus: item.qty_bonus,
            stock:item.stock,
            nm_brg:item.nm_brg,
            tambahan:item.tambahan
        };
        const cek = cekData('kd_brg',item.kd_brg,table);
        cek.then(res => {
            if(res===undefined){
                store(table, finaldt)
            }
            else{
                update(table,{
                    id:res.id,
                    qty:parseFloat(res.qty)+1,
                    kd_brg: res.kd_brg,
                    barcode: res.barcode,
                    satuan: res.satuan,
                    diskon: res.diskon,
                    diskon2: res.diskon2,
                    diskon3: 0,
                    diskon4: 0,
                    ppn: res.ppn,
                    stock: res.stock,
                    harga_beli: res.harga_beli,
                    nm_brg:res.nm_brg,
                    qty_bonus:item.qty_bonus,
                    tambahan: res.tambahan
                })
            }
            this.getData()
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
                localStorage.removeItem('sp');
                localStorage.removeItem('lk');
                localStorage.removeItem('ambil_data');
                localStorage.removeItem('nota');
                localStorage.removeItem('catatan');
                window.location.reload(false);
            }
        })
    }
    HandleSubmit(e){
        e.preventDefault();

        // validator head form
        let err = this.state.error;
        if (this.state.catatan === "" || this.state.location === "" || this.state.supplier === "" || this.state.notasupplier === "" || this.state.penerima === "" || this.props.checkNotaPem) {
            if(this.state.catatan===""){
                err = Object.assign({}, err, {
                    catatan:"Catatan tidak boleh kosong."
                });
            }
            if (this.state.location === "") {
                err = Object.assign({}, err, {
                    location: "Lokasi tidak boleh kosong."
                });
            }

            if (this.state.supplier === "") {
                err = Object.assign({}, err, {
                    supplier: "Supplier tidak boleh kosong."
                });
            }
            if (this.state.penerima === "") {
                err = Object.assign({}, err, {
                    penerima: "Penerima tidak boleh kosong."
                });
            }
            if (this.state.notasupplier === "" || this.props.checkNotaPem) {
                err = Object.assign({}, err, {
                    notasupplier: this.props.checkNotaPem ?"Nota supplier telah digunakan.":"Nota supplier tidak boleh kosong."
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
                        'Pilih barang untuk melanjutkan Pembelian.',
                        'error'
                    )
                }else{
                    Swal.fire({
                        title: 'Simpan Receive Pembelian?',
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
                                let disc1 = 0;
                                let disc2 = 0;
                                let ppn = 0;
                                if (item.diskon !== 0) {
                                    disc1 = parseInt(rmComma(item.harga_beli),10) * (parseFloat(item.diskon) / 100);
                                    disc2 = disc1;
                                    if (item.diskon2 !== 0) {
                                        disc2 = disc1 * (parseFloat(item.diskon2) / 100);
                                    }
                                }
                                if (item.ppn !== 0) {
                                    ppn = parseInt(rmComma(item.harga_beli),10) * (parseFloat(item.ppn) / 100);
                                }
                                subtotal += ((parseInt(rmComma(item.harga_beli),10) - disc2) + ppn) * parseFloat(item.qty);
                                detail.push({
                                    kd_brg: item.kd_brg,
                                    barcode: item.barcode,
                                    satuan: item.satuan,
                                    diskon: item.diskon,
                                    diskon2: item.diskon2,
                                    diskon3: item.diskon3,
                                    diskon4: item.diskon4,
                                    ppn: item.ppn,
                                    harga_beli: rmComma(item.harga_beli),
                                    qty: item.qty,
                                    qty_bonus: item.qty_bonus
                                })
                                return null;
                            })
                            let data_final = {
                                tanggal: moment(this.state.tanggal).format("YYYY-MM-DD"),
                                type: this.state.jenis_trx,
                                tgl_jatuh_tempo: moment(this.state.tanggal).format("YYYY-MM-DD"),
                                no_po: this.state.no_po,
                                pre_receive: this.state.pre_receive,
                                sub_total: subtotal,
                                supplier: this.state.supplier,
                                nota_supplier: this.state.notasupplier,
                                nama_penerima: this.state.penerima,
                                discount_harga: this.state.discount_harga,
                                ppn: this.state.pajak,
                                lokasi_beli: this.state.location,
                                userid: this.state.userid,
                                detail: detail
                            };
                            let parsedata = {};
                            parsedata['detail'] = data_final;
                            parsedata['master'] = this.state.databrg;
                            parsedata['nota'] = this.props.nota;
                            parsedata['logo'] = this.props.auth.user.logo;
                            parsedata['user'] = this.props.auth.user.username;
                            parsedata['lokasi_beli'] = this.state.location_val;
                            if(this.props.match.params.slug!==undefined&&this.props.match.params.slug!==null){
                                this.props.dispatch(updateReceive(parsedata,this.props.match.params.slug));
                            }else{
                                this.props.dispatch(storeReceive(parsedata,(arr)=>this.props.history.push(arr)));
                            }
                            return null;
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
                    barcode: data[0].barcode,
                    satuan: data[0].satuan,
                    diskon: 0,
                    diskon2: 0,
                    diskon3: 0,
                    diskon4: 0,
                    ppn: 0,
                    harga_beli: data[0].harga_beli,
                    qty: 1,
                    qty_bonus: 0,
                    stock: data[0].stock,
                    nm_brg: data[0].nm_brg,
                    tambahan: data[0].tambahan
                })
            } else {
                update(table, {
                    id: res.id,
                    qty: parseFloat(res.qty) + 1,
                    kd_brg: res.kd_brg,
                    barcode: res.barcode,
                    satuan: res.satuan,
                    diskon: res.diskon,
                    diskon2: res.diskon2,
                    diskon3: 0,
                    diskon4: 0,
                    ppn: res.ppn,
                    qty_bonus:res.qty_bonus,
                    stock: res.stock,
                    harga_beli: res.harga_beli,
                    nm_brg: res.nm_brg,
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
            this.props.dispatch(FetchBrg(1, searchby, this.state.search, this.state.lokasi, this.state.supplier, this.autoSetQty, 5));
            // this.props.dispatch(FetchBrg(1, searchby, this.state.search, this.state.lokasi, null, this.autoSetQty, 5));
            this.setState({search: ''});

        }
    }
    getData(){
        const data = get(table);
        data.then(res => {
            let brg = []
            res.map((i) => {
                brg.push({
                    harga_beli: i.harga_beli,
                    diskon: i.diskon,
                    ppn: i.ppn,
                    qty: i.qty,
                    qty_bonus: i.qty_bonus,
                    satuan: i.satuan
                });
                return null;
            });
            this.setState({
                databrg: res,
                brgval: brg
            })
            return null;
        });
    }
    handleLoadMore(){
        let perpage = parseInt(this.props.paginBrg.per_page,10);
        let lengthBrg = parseInt(this.props.barang.length,10);
        if(perpage===lengthBrg || perpage<lengthBrg){
            this.props.dispatch(FetchBrg(1, 'barcode', this.state.search, this.state.lokasi, this.state.supplier, this.autoSetQty,this.state.perpage));
            // this.props.dispatch(FetchBrg(1, 'barcode', this.state.search, this.state.lokasi, null, this.autoSetQty, this.state.perpage));

        }
        else{
            Swal.fire({
                title: 'Perhatian',
                icon: 'warning',
                text: 'Tidak ada data.',
            });
        }
    }
    render() {
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        let opSupplier=[];
        if(this.props.supplier!==[]){
            this.props.supplier.map(i=>{
                opSupplier.push({
                    value: i.kode,
                    label: i.nama
                })
                return null;
            })
        }
        let subtotal = 0;

        return (
            <Layout page="Receive Pembelian">
                <div className="card">
                    <div className="card-header">
                        <h4>Receive Pembelian</h4>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <StickyBox offsetTop={100} offsetBottom={20} style={{width:"25%",marginRight:"10px"  }}>
                            <div className="card">
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
                                                                <option value={1} selected={parseInt(this.state.ambil_data,10) === 1}>Pembelian Langsung</option>
                                                                <option value={2} selected={parseInt(this.state.ambil_data,10)===2}>Purchase Order</option>
                                                                <option value={3} selected={parseInt(this.state.ambil_data,10)===3}>Pre-Receive</option>
                                                            </select>
                                                        </div>
                                                        <small
                                                            id="passwordHelpBlock"
                                                            className="form-text text-muted"
                                                        >
                                                            {parseInt(this.state.ambil_data,10)===1?'Pembelian langsung.':(parseInt(this.state.ambil_data,10)===2?'Ambil data pembelian dari PO.':'Ambil data pembelian dari Pre-Receive.')}
                                                        </small>
                                                    </div>
                                                </div>
                                                <div className="col-md-12" style={parseInt(this.state.ambil_data,10)===1?{display:'none'}:{display:'block'}}>
                                                    <div className="form-group">
                                                        <Select
                                                            options={this.state.data_nota}
                                                            placeholder ={"Pilih Nota "+(parseInt(this.state.ambil_data,10)===2?'PO':'Pre-Receive')}
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
                                        <div className="people-list" style={{height:'300px',maxHeight:'100%',overflowY:'scroll'}}>
                                            {
                                                !this.props.loadingbrg?
                                                    <div id="chat_user_2">
                                                        <ul className="chat-list list-unstyled">
                                                            {
                                                                this.props.barang.length!==0?
                                                                    this.props.barang.map((i,inx)=>{
                                                                        return(
                                                                            <abbr title={i.nm_brg} key={inx} >
                                                                            <li className="clearfix"onClick={(e)=>this.HandleAddBrg(e,{
                                                                                kd_brg:i.kd_brg,
                                                                                barcode:i.barcode,
                                                                                satuan:i.satuan,
                                                                                diskon:0,
                                                                                diskon2:0,
                                                                                ppn:0,
                                                                                harga_beli: i.harga_beli,
                                                                                qty:1,
                                                                                qty_bonus:0,
                                                                                stock:i.stock,
                                                                                nm_brg:i.nm_brg,
                                                                                tambahan:i.tambahan
                                                                            })}>
                                                                                
                                                                                <img src={i.gambar} onError={(e)=>{e.target.onerror = null; e.target.src=`${imgDefault}`}} alt="avatar"/>
                                                                                <div className="about">
                                                                                    <div className="status" style={{color: 'black',fontWeight:"bold",fontSize:"12px"}}>{lengthBrg(i.nm_brg)}</div>
                                                                                    <div className="status" style={{color: 'black',fontWeight:"bold"}}><small>{i.supplier}</small></div>
                                                                                </div>
                                                                            </li>
                                                                            </abbr>
                                                                        )
                                                                    }):(
                                                                        <div style={{textAlign:'center',fontSize:"11px",fontStyle:"italic"}}>Barang tidak ditemukan.</div>
                                                                    )

                                                            }


                                                        </ul>
                                                    </div>
                                                    :<Spinner/>
                                            }
                                        </div>
                                        <hr/>
                                        <div className="form-group">
                                            <button className={"btn btn-primary"} style={{width:"100%"}} onClick={this.handleLoadMore}>{this.props.loadingbrg?'tunggu sebentar ...':'tampilkan lebih banyak'}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </StickyBox>
                        <div style={{width:"75%",zoom:"85%"}}>
                            <div className="card">
                                <div className="card-body">
                                    <form className=''>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="control-label font-12">
                                                        No. Transaksi
                                                    </label>
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        className="form-control"
                                                        id="nota"
                                                        value={this.props.match.params.slug!==undefined&&this.props.match.params.slug!==null?this.state.no_faktur_beli:this.props.nota}
                                                    />
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-8">
                                                        <div className="form-group">
                                                            <label className="control-label font-12">
                                                                Tanggal Order
                                                            </label>
                                                            <input type="date" name={"tanggal"} className={"form-control"} value={this.state.tanggal} onChange={(e)=>this.HandleCommonInputChange(e,true)}/>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="control-label font-12">
                                                                Penerima
                                                            </label>

                                                            <input
                                                                type="text"
                                                                id="chat-search"
                                                                name="penerima"
                                                                className="form-control"
                                                                onChange={(e)=>this.HandleCommonInputChange(e,true)}
                                                                value={this.state.penerima}
                                                            />
                                                            <div className="invalid-feedback" style={this.state.error.penerima!==""?{display:'block'}:{display:'none'}}>
                                                                {this.state.error.penerima}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group">
                                                            <label className="control-label font-12">
                                                                Jenis Transaksi
                                                            </label>
                                                            <div className="custom-control custom-radio">
                                                                <input
                                                                    type="radio"
                                                                    id="customRadio1"
                                                                    name="jenis_trx"
                                                                    onChange={(e=>this.HandleCommonInputChange(e))}
                                                                    value="Tunai"
                                                                    className="custom-control-input"
                                                                    checked={this.state.jenis_trx==='Tunai'}
                                                                />
                                                                <label
                                                                    className="custom-control-label"
                                                                    htmlFor="customRadio1"
                                                                >
                                                                    Tunai
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <div className="custom-control custom-radio">
                                                                <input
                                                                    type="radio"
                                                                    id="customRadio2"
                                                                    name="jenis_trx"
                                                                    onChange={(e=>this.HandleCommonInputChange(e))}
                                                                    value="Kredit"
                                                                    className="custom-control-input"
                                                                    checked={this.state.jenis_trx==='Kredit'}

                                                                />
                                                                <label
                                                                    className="custom-control-label"
                                                                    htmlFor="customRadio2"
                                                                >
                                                                    Kredit
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <div className="custom-control custom-radio">
                                                                <input
                                                                    type="radio"
                                                                    id="customRadio3"
                                                                    name="jenis_trx"
                                                                    onChange={(e=>this.HandleCommonInputChange(e))}
                                                                    value="Konsinyasi"
                                                                    className="custom-control-input"
                                                                    checked={this.state.jenis_trx==='Konsinyasi'}

                                                                />
                                                                <label
                                                                    className="custom-control-label"
                                                                    htmlFor="customRadio3"
                                                                >
                                                                    Konsinyasi
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label className="control-label font-12">
                                                                Lokasi
                                                            </label>
                                                            <Select
                                                                options={this.state.location_data}
                                                                placeholder = "Pilih Lokasi"
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
                                                                Supplier
                                                            </label>
                                                            <Select
                                                                options={opSupplier}
                                                                placeholder="Pilih Supplier"
                                                                onChange={this.HandleChangeSupplier}
                                                                value = {
                                                                    opSupplier.find(op => {
                                                                        return op.value === this.state.supplier
                                                                    })
                                                                }
                                                            />
                                                            <div className="invalid-feedback" style={this.state.error.supplier!==""?{display:'block'}:{display:'none'}}>
                                                                {this.state.error.supplier}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label className="control-label font-12">
                                                                Nota Supplier
                                                            </label>

                                                            <input
                                                                type="text"
                                                                id="chat-search"
                                                                name="notasupplier"
                                                                className="form-control"
                                                                onChange={(e)=>this.HandleCommonInputChange(e)}
                                                                value={this.state.notasupplier}
                                                            />
                                                            <div className="invalid-feedback" style={this.state.error.notasupplier!==""?{display:'block'}:{display:'none'}}>
                                                                {this.state.error.notasupplier}
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label className="control-label font-12">
                                                                Catatan
                                                            </label>
                                                            <textarea
                                                                className="form-control"
                                                                id="exampleTextarea1"
                                                                rows={3}
                                                                onChange={(e=>this.HandleCommonInputChange(e))}
                                                                name="catatan"
                                                                value={this.state.catatan}
                                                            />
                                                            <div className="invalid-feedback" style={this.state.error.catatan!==""?{display:'block'}:{display:'none'}}>
                                                                {this.state.error.catatan}
                                                            </div>
                                                            {/* {
                                  this.state.error.catatan!==""?(
                                    <div className="invalid-feedback">
                                      {this.state.error.catatan}
                                    </div>
                                  ):""
                                } */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <div style={{overflowX:'auto'}}>
                                        <table className="table table-hover">
                                            <thead>
                                            <tr>
                                                <th style={columnStyle}>#</th>
                                                <th style={columnStyle}>Nama barang</th>
                                                <th style={columnStyle}>barcode</th>
                                                <th style={columnStyle}>satuan</th>
                                                <th style={columnStyle}>harga beli</th>
                                                <th style={columnStyle}>diskon</th>
                                                <th style={columnStyle}>ppn</th>
                                                <th style={columnStyle}>stock</th>
                                                <th style={columnStyle}>qty</th>
                                                <th style={columnStyle}>bonus</th>
                                                <th style={columnStyle}>Subtotal</th>
                                            </tr>
                                            </thead>

                                            <tbody>
                                            {
                                                this.state.databrg.map((item,index)=>{
                                                    let disc1=0;
                                                    let disc2=0;
                                                    let ppn=0;
                                                    if(item.diskon!==0){
                                                        disc1 = parseInt(rmComma(item.harga_beli),10) * (parseFloat(item.diskon) / 100);
                                                        disc2=disc1;
                                                        if(item.diskon2!==0){
                                                            disc2 = disc1 * (parseFloat(item.diskon2) / 100);
                                                        }
                                                    }


                                                    if(item.ppn!==0){
                                                        ppn = parseInt(rmComma(item.harga_beli),10) * (parseFloat(item.ppn) / 100);
                                                    }
                                                    subtotal+=((parseInt(rmComma(item.harga_beli),10)-disc2)+ppn)*parseFloat(item.qty);
                                                    //
                                                    return (
                                                        <tr key={index} >
                                                            <td style={columnStyle}>
                                                                <a href="about:blank" className='btn btn-danger btn-sm' onClick={(e)=>this.HandleRemove(e,item.id)}><i className='fa fa-trash'/></a>
                                                            </td>
                                                            <td style={{verticalAlign: "middle", textAlign: "left",whiteSpace:"nowrap"}}>{item.nm_brg}</td>
                                                            <td style={{verticalAlign: "middle", textAlign: "left",whiteSpace:"nowrap"}}>{item.barcode}</td>
                                                            <td style={columnStyle}>
                                                                <select name='satuan' onChange={(e)=>this.HandleChangeInputValue(e,index,item.barcode,item.tambahan)} className="form-control" style={{width:"100px"}}>
                                                                    {
                                                                        item.tambahan.map(i=>{
                                                                            return(
                                                                                <option value={i.satuan} selected={i.satuan === item.satuan}>{i.satuan}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                            </td>
                                                            <td style={columnStyle}>
                                                                <input style={{width:"100px",textAlign:"right"}} className="form-control" type='text' name='harga_beli' onBlur={(e)=>this.HandleChangeInput(e,item.barcode)} onChange={(e)=>this.HandleChangeInputValue(e,index)}   value={toCurrency(this.state.brgval[index].harga_beli)}/>
                                                            </td>
                                                            <td style={columnStyle}><input style={{width:"100px",textAlign:"right"}} className="form-control" type='text' name='diskon' onBlur={(e)=>this.HandleChangeInput(e,item.barcode)} onChange={(e)=>this.HandleChangeInputValue(e,index)} value={this.state.brgval[index].diskon}/></td>
                                                            <td style={columnStyle}><input style={{width:"100px",textAlign:"right"}} className="form-control" type='text' name='ppn' onBlur={(e)=>this.HandleChangeInput(e,item.barcode)} onChange={(e)=>this.HandleChangeInputValue(e,index)}   value={this.state.brgval[index].ppn}/></td>
                                                            <td style={columnStyle}>
                                                                <input style={{width:"100px",textAlign:"right"}} readOnly type="text" className="form-control" value={item.stock}/>
                                                            </td>
                                                            <td style={columnStyle}><input style={{width:"100px",textAlign:"right"}} className="form-control" type='text' name='qty' onBlur={(e)=>this.HandleChangeInput(e,item.barcode)} onChange={(e)=>this.HandleChangeInputValue(e,index)}  value={this.state.brgval[index].qty}/></td>
                                                            <td style={columnStyle}><input style={{width:"100px",textAlign:"right"}} className="form-control" type='text' name='qty_bonus' onBlur={(e)=>this.HandleChangeInput(e,item.barcode)} onChange={(e)=>this.HandleChangeInputValue(e,index)}  value={this.state.brgval[index].qty_bonus}/></td>
                                                            <td style={columnStyle}>
                                                                <input style={{width:"100px",textAlign:"right"}} readOnly type="text" className="form-control" value={toRp(((parseInt(rmComma(item.harga_beli),10)-disc2)+ppn)*parseFloat(item.qty))}/>
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
                                                <a href="about:blank" onClick={(e)=>this.HandleSubmit(e)} className="btn btn-primary ml-1">Simpan</a>
                                                <a href="about:blank" onClick={(e)=>this.HandleReset(e)} className="btn btn-danger ml-1">Reset</a>
                                            </div>
                                        </div>
                                        <div className="col-md-5">
                                            <div className="pull-right">
                                                <form className="form_head">
                                                    <div className="row" style={{marginBottom: '3px'}}>
                                                        <label className="col-sm-4">Sub Total</label>
                                                        <div className="col-sm-8">
                                                            <input style={{textAlign:"right"}} type="text" id="sub_total" name="sub_total" className="form-control text-right" value={toRp(subtotal)} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className="row" style={{marginBottom: '3px'}}>
                                                        <label className="col-sm-4">Discount</label>
                                                        <div className="col-sm-3">
                                                            <input type="number" onChange={(e)=>this.HandleCommonInputChange(e,false,subtotal)}  name="discount_persen"  min="0" max="100"className="form-control" placeholder="%" value={this.state.discount_persen}/>
                                                        </div>
                                                        <div className="col-sm-5">
                                                            <input type="text" onChange={(e) => this.HandleCommonInputChange(e,false,subtotal)} name="discount_harga" className="form-control text-right" placeholder="Rp" value={this.state.discount_harga}/>
                                                        </div>
                                                    </div>
                                                    <div className="row" style={{marginBottom: '3px'}}>
                                                        <label className="col-sm-4">Pajak %</label>
                                                        <div className="col-sm-3">
                                                            <input type="number" onChange={(e)=>this.HandleCommonInputChange(e)}  name="pajak"  min="0" max="100" className="form-control" placeholder="%" value={this.state.pajak}/>
                                                        </div>
                                                    </div>
                                                    <div className="row" style={{marginBottom: '3px'}}>
                                                        <label className="col-sm-4">Grand Total</label>
                                                        <div className="col-sm-8">

                                                            <input style={{textAlign:"right"}} type="text" name="grand_total" className="form-control text-right" readOnly value={toRp((subtotal - (subtotal * (parseFloat(this.state.discount_persen) / 100))) + (subtotal * (parseFloat(this.state.pajak) / 100)))} />
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
    nota: state.receiveReducer.code,
    supplier: state.supplierReducer.dataSupllier,
    isLoading:state.receiveReducer.isLoading,
    auth:state.auth,
    po_report: state.poReducer.report_data,
    po_data: state.poReducer.po_data,
    checkNotaPem: state.siteReducer.check,
    dataEdit:state.receiveReducer.receive_data,
    paginBrg:state.productReducer.pagin_brg,

});

export default withRouter(connect(mapStateToPropsCreateItem)(Receive));