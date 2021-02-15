import React,{Component} from 'react';
import {store,get, update,destroy,cekData,del} from "components/model/app.model";
import connect from "react-redux/es/connect/connect";
import Layout from "components/App/Layout"
import Select from 'react-select'
import Swal from 'sweetalert2'
import moment from 'moment';
import {FetchCustomerAll} from "redux/actions/masterdata/customer/customer.action";
import {setProductbrg, FetchProductSale} from "redux/actions/masterdata/product/product.action";
import StickyBox from "react-sticky-box";
import FormSale from "../../modals/sale/form_sale";
import {ModalToggle,ModalType} from "redux/actions/modal.action";
import {FetchNotaSale} from "redux/actions/sale/sale.action";
import {FetchDetailLocation} from "redux/actions/masterdata/location/location.action";
import {toRp,toCurrency,rmComma} from "helper";
import Spinner from 'Spinner'
import {HEADERS} from "../../../../redux/actions/_constants";

const table='sale'
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

class Sale extends Component{

    constructor(props) {
        super(props);

        this.state = {
            isOpenPrice:false,
            addingItemName: "",
            databrg: [],
            brgval:[],
            tgl_order:moment(new Date()).format("yyyy-MM-DD"),
            tgl_kirim:moment(new Date()).format("yyyy-MM-DD"),
            harga_beli: 0,
            diskon:0,
            ppn:0,
            qty:0,
            location_data:[],
            location:"",
            customer: "1000001",
            catatan:"-",
            jenis_trx:"Tunai",
            userid:0,
            searchby:1,
            search:"",
            subtotal:0,
            discount_persen:0,
            discount_harga:0,
            pajak:0,
            perpage:5,
            scrollPage:0,
            isScroll:false,
            isClick:0,
            error:{
                location:"",
                customer:"",
                catatan:""
            },
            detail:[],
            master:{}
        };
        this.HandleRemove = this.HandleRemove.bind(this);
        this.HandleAddBrg = this.HandleAddBrg.bind(this);
        this.HandleChangeInput = this.HandleChangeInput.bind(this);
        this.HandleChangeInputValue = this.HandleChangeInputValue.bind(this);
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.HandleChangeCustomer = this.HandleChangeCustomer.bind(this);
        this.setTglOrder=this.setTglOrder.bind(this);
        this.HandleReset = this.HandleReset.bind(this);
        this.HandleSearch = this.HandleSearch.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.handleChecked = this.handleChecked.bind(this);
    }

    componentDidMount(){
        this.getData();
        if(localStorage.lk!==undefined&&localStorage.lk!==''){
            this.props.dispatch(FetchNotaSale(localStorage.lk));
            this.setState({
                location:localStorage.lk
            })
        }
        if (localStorage.cs !== undefined && localStorage.cs !== '') {
            this.setState({
                customer: localStorage.cs
            })
        }
        if (localStorage.cs !== undefined && localStorage.lk!==undefined) {

            let where=`lokasi=${localStorage.lk}&customer=${localStorage.cs}`;

            if(localStorage.anySaleTrx!==undefined){
                if(where!==''){where+='&';}
                where+=`q=${localStorage.anySaleTrx}`;
                if(parseInt(this.state.searchby,10)===1){if(where!==''){where+='&';}where+=`searchby=kd_brg`}
                if(parseInt(this.state.searchby,10)===2){if(where!==''){where+='&';}where+=`searchby=barcode`}
                if(parseInt(this.state.searchby,10)===3){if(where!==''){where+='&';}where+=`searchby=deskripsi`}
            }
            this.props.dispatch(FetchProductSale(1,`${where}&perpage=${this.state.perpage}`,'sale',this.autoSetQty));
        }

        const nextProps = this.props;
        if (nextProps.auth.user) {
            let lk = []
            let loc = nextProps.auth.user.lokasi;
            if(loc!==undefined){
                loc.map((i) => {
                    lk.push({
                        value: i.kode,
                        label: i.nama
                    });
                    return true;
                })
                this.setState({
                    location_data: lk,
                    userid: nextProps.auth.user.id
                })
            }
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
            let lk = []
            let loc = nextProps.auth.user.lokasi;
            if(loc!==undefined){
                loc.map((i) => {
                    lk.push({
                        value: i.kode,
                        label: i.nama
                    });
                    return true;
                })
                this.setState({
                    location_data: lk,
                    userid: nextProps.auth.user.id
                })
            }
        }
        if(nextProps.barang.length>0){
            this.getData();

        }

    }
    componentWillUnmount(){
        this.props.dispatch(setProductbrg({status:'',msg:'',result:{data:[]}}));
        destroy(table);
        localStorage.removeItem('cs');
        localStorage.removeItem('lk');
        localStorage.removeItem('anySaleTrx');
    }
    HandleChangeLokasi(lk){
        let err = Object.assign({}, this.state.error, {
            location: ""
        });
        this.setState({
            location:lk.value,
            error: err
        })
        localStorage.setItem('lk', lk.value);
        this.props.dispatch(FetchNotaSale(lk.value));
        this.props.dispatch(FetchDetailLocation(lk.value));
        this.props.dispatch(FetchCustomerAll(lk.value));
        if (this.state.customer!==""){
            let where=``;
            
            if(lk.value!=='' || this.state.location!==''){
                if(where!==''){where+='&';}where+=`lokasi=${lk.value}`
            }
            if(this.state.customer!=='' && this.state.customer!=='1000001'){
                if(where!==''){where+='&';}where+=`customer=${this.state.customer}`
            }
            this.props.dispatch(FetchProductSale(1,`${where}&perpage=5`,'sale',this.autoSetQty));
        }
        destroy(table)
        this.getData();
    }
    HandleChangeCustomer(cs) {
        let err = Object.assign({}, this.state.error, {
            customer: ""
        });
        this.setState({
            customer: cs.value,
            error: err,
            scrollPage:5
        })
        localStorage.setItem('cs', cs.value);
        if (this.state.location !== "") {
            let where=``;
            if(where!==''){where+='&';}where+=`lokasi=${this.state.location}`

            if(this.state.customer!==''){
                if(cs.value!=='1000001'){
                    if(where!==''){where+='&';}where+=`customer=${cs.value}`
                }
            }
            this.props.dispatch(FetchProductSale(1,`${where}&perpage=5`,'sale',this.autoSetQty));
        }
        destroy(table);
        this.getData();
    }
    HandleCommonInputChange(e,errs=true,st=0){
        const column = e.target.name;
        const val = e.target.value;
        if (column === 'discount_persen' || column === 'pajak'){
            if (val < 0 || val==='') this.setState({[column]: 0});
            else if (val >100) this.setState({[column]: 100});
            else this.setState({[column]: val});

            if (column === 'discount_persen'){
                this.setState({ 'discount_harga': (st*(rmComma(val)/100)) });
            }
        } else if (column === 'discount_harga') {
            const disper = (rmComma(val)/st) * 100;
            this.setState({ 'discount_persen': disper>=100?100:disper, [column]: disper>=100?st:rmComma(val) });
        }else{
            this.setState({
                [column]: val
            });
        }
        this.setState({
            [column]: val
        });
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
            this.getData();
        })

    }
    HandleChangeInputValue(e,i,barcode=null,datas=[]) {
        const column = e.target.name;
        const val = e.target.value;
        if(column==='harga'||column==='qty'||column==='diskon_persen'||column==='ppn'){
            let brgval = [...this.state.brgval];
            brgval[i] = {...brgval[i], [column]: val};
            this.setState({ brgval });
        }

        const cek = cekData('barcode', barcode, table);
        if(column === 'satuan'){
            cek.then(res => {
                if (res === undefined) {
                    Toast.fire({
                        icon: 'error',
                        title: `not found.`
                    })
                } else {
                    let final= {
                        id: res.id,
                        qty: 0,
                        kd_brg: res.kd_brg,
                        nm_brg: res.nm_brg,
                        barcode: res.barcode,
                        satuan: res.satuan,
                        harga: res.harga,
                        stock: res.stock,
                        diskon_persen: res.diskon_persen,
                        diskon_nominal: res.diskon_nominal,
                        ppn: res.ppn,
                        tambahan: res.tambahan
                    }
                    update(table, final)
                    Toast.fire({
                        icon: 'success',
                        title: `${column} has been changed.`
                    })
                }
                this.getData();
            })
        }

    }
    setTglOrder(date) {
        this.setState({
            tgl_order: date
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
                this.setState({
                    subtotal:0
                })
                del(table,id)
                    .then(res=>{
                        this.getData();
                        Swal.fire(
                            'Deleted!',
                            'Your data has been deleted.',
                            'success'
                        )

                    })
            }
        })
    }
    HandleAddBrg(e,item,index) {
        e.preventDefault();
        this.setState({
            isScroll:false,
            isClick:index
        });
        const finaldt = {
            kd_brg: item.kd_brg,
            nm_brg: item.nm_brg,
            barcode: item.barcode,
            satuan: item.satuan,
            harga_old:item.harga,
            harga: item.harga,
            harga2: item.harga2,
            harga3: item.harga3,
            harga4: item.harga4,
            stock: item.stock,
            diskon_persen: item.diskon_persen,
            diskon_nominal: 0,
            ppn: item.ppn,
            qty: item.qty,
            hrg_beli:item.hrg_beli,
            kategori:item.kategori,
            services:item.services,
            tambahan: item.tambahan,
            isOpenPrice: item.isOpenPrice,
        };
        const cek = cekData('barcode',item.barcode,table);
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
                    harga: res.harga,
                    harga2: res.harga2,
                    harga3: res.harga3,
                    harga4: res.harga4,
                    harga_old: res.harga,
                    hrg_beli: res.hrg_beli,
                    stock: res.stock,
                    diskon_persen: res.diskon_persen,
                    diskon_nominal: 0,
                    ppn: res.ppn,
                    qty: parseFloat(res.qty)+1,
                    kategori: item.kategori,
                    services: item.services,
                    tambahan: item.tambahan,
                    isOpenPrice: item.isOpenPrice,
                })
            }


            this.getData();
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
                localStorage.removeItem('cs');
                localStorage.removeItem('lk');
                localStorage.removeItem('anySaleTrx');
                window.location.reload(false);
            }
        })
    }
    HandleSubmit(e){
        e.preventDefault();
        // validator head form
        let err = this.state.error;
        if (this.state.catatan === "" || this.state.location === "" || this.state.customer === ""){
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

            if (this.state.customer === "") {
                err = Object.assign({}, err, {
                    customer: "customer tidak boleh kosong."
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
                        'Pilih barang untuk melanjutkan Penjualan.',
                        'error'
                    )
                }else{
                    const bool = !this.props.isOpen;
                    this.props.dispatch(ModalToggle(bool));
                    this.props.dispatch(ModalType("formSale"));
                    let subtotal = 0;
                    let detail = [];

                    res.map(item => {
                        let disc1 = 0;
                        let disc2 = 0;
                        let ppn = 0;
                        let hrg=parseInt(rmComma(item.harga),10);
                        let ppnInt=parseInt(item.ppn,10);
                        let disc_rp=parseInt(item.diskon_nominal,10);
                        let disc_per=parseInt(item.diskon_persen,10);
                        if(disc_per!==0){
                            disc1 = hrg-(hrg*(disc_per/100));
                            disc2 = disc1;
                            if(disc_rp!==0){
                                disc2 = disc1-(disc1*(disc_rp/100))
                            }
                        }
                        else if(disc_rp!==0){
                            disc1 = hrg-(hrg*(disc_rp/100));
                            disc2 = disc1;
                            if(disc_per!==0){
                                disc2 = disc1-(disc1*(disc_per/100))
                            }
                        }
                        if(ppnInt!==0){
                            ppn = hrg*(ppnInt/100);
                        }

                        subtotal+=(disc2===0?hrg+ppn:disc2+ppn)*parseInt(item.qty,10);
                        detail.push({
                            kode_trx:this.props.nota,
                            subtotal:(disc2===0?hrg+ppn:disc2+ppn)*parseInt(item.qty,10),
                            price:rmComma(item.harga),
                            qty:item.qty,
                            diskon:disc2,
                            kategori:item.kategori,
                            tax:item.ppn,
                            services:item.services,
                            sku:item.barcode,
                            open_price:rmComma(item.harga)===rmComma(item.harga_old)?0:rmComma(item.harga),
                            hrg_beli:rmComma(item.hrg_beli),
                            nm_brg: item.nm_brg,
                            satuan: item.satuan
                        })
                        return null;
                    });
                    moment.locale("id");
                    let master = {
                        "cetak_nota":true,
                        "tempo": moment(new Date()).format("yyyy-MM-DD HH:mm:ss"),
                        "hr": "S",
                        "kartu": "-",
                        "dis_persen": this.state.discount_persen,
                        "dis_rp": this.state.discount_harga===0?0:rmComma(this.state.discount_harga),
                        "kd_sales": 1,
                        "jam": moment(new Date()).format("HH:mm:ss"),
                        "tgl": moment(new Date()).format("yyyy-MM-DD HH:mm:ss"),
                        "compliment": "-",
                        "kd_kasir": this.state.userid,
                        "no_kartu": "0",
                        "id_hold": "-",
                        "diskon": this.state.discount_harga===0?0:rmComma(this.state.discount_harga),
                        "compliment_rp": "0",
                        "jml_kartu": 0,
                        "charge": 0,
                        "change": 0,
                        "rounding": 0,
                        "tax": this.state.pajak,
                        "nominal_poin": 0,
                        "tunai": 0,
                        "poin_tukar": 0,
                        "gt": (subtotal - (subtotal * (parseFloat(this.state.discount_persen) / 100))) + (subtotal * (parseFloat(this.state.pajak) / 100)),
                        "pemilik_kartu": "-",
                        "jenis_trx": "TUNAI",
                        "kd_cust": this.state.customer,
                        "kode_trx":this.props.nota,
                        "subtotal": subtotal,
                        "lokasi": this.state.location,
                        "kassa": "A",
                        "jns_kartu": "Debit",
                        "status": "LUNAS",
                        "optional_note":this.state.catatan
                    };
                    this.setState({
                        master:master,
                        detail:detail
                    })
                    
                }
            })
        }

    }
    autoSetQty(kode,data){
        const cek = cekData('barcode', kode, table);
        return cek.then(res => {
            if (res === undefined) {
                store(table, {
                    kd_brg: data[0].kd_brg,
                    nm_brg: data[0].nm_brg,
                    barcode: data[0].barcode,
                    satuan: data[0].satuan,
                    harga_old:data[0].harga,
                    harga: data[0].harga,
                    harga2: data[0].harga2,
                    harga3: data[0].harga3,
                    harga4: data[0].harga4,
                    stock: data[0].stock,
                    diskon_persen: data[0].diskon_persen,
                    diskon_nominal: data[0].diskon_nominal,
                    ppn: data[0].ppn,
                    qty: 1,
                    hrg_beli:data[0].hrg_beli,
                    kategori:data[0].kategori,
                    services:data[0].service,
                    tambahan: data[0].tambahan,
                    isOpenPrice:false,
                })
            } else {
                update(table, {
                    id: res.id,
                    kd_brg: res.kd_brg,
                    nm_brg: res.nm_brg,
                    barcode: res.barcode,
                    satuan: res.satuan,
                    harga: res.harga,
                    harga2: res.harga2,
                    harga3: res.harga3,
                    harga4: res.harga4,
                    stock: res.stock,
                    diskon_persen: res.diskon_persen,
                    diskon_nominal: res.diskon_nominal,
                    ppn: res.ppn,
                    qty: parseFloat(res.qty) + 1,
                    tambahan: res.tambahan
                })
            }
            return true
        })
    }
    HandleSearch(){
        if (this.state.customer === "" || this.state.lokasi === "") {
            Swal.fire('Gagal!', 'Pilih lokasi dan customer terlebih dahulu.', 'error')
        }else{
            localStorage.setItem("anySaleTrx",this.state.search);
            let where=`lokasi=${this.state.location}&customer=${this.state.customer}`;
            if(parseInt(this.state.searchby,10)===1){if(where!==''){where+='&';}where+=`searchby=kd_brg`}
            if(parseInt(this.state.searchby,10)===2){if(where!==''){where+='&';}where+=`searchby=barcode`}
            if(parseInt(this.state.searchby,10)===3){if(where!==''){where+='&';}where+=`searchby=deskripsi`}
            if(this.state.search!==''){if(where!==''){where+='&';}where+=`q=${this.state.search}`}
            this.props.dispatch(FetchProductSale(1,`${where}&perpage=5`,'sale',this.autoSetQty));
            this.setState({search: ''});
        }
    }
    getData() {
        const data = get(table);
        
        data.then(res => {
            let brg = []
            res.map((i) => {
                brg.push({
                    isOpenPrice:i.isOpenPrice,
                    harga: i.harga,
                    harga2: i.harga2,
                    harga3: i.harga3,
                    harga4: i.harga4,
                    diskon_persen: i.diskon_persen,
                    diskon_nominal: i.diskon_nominal,
                    ppn: i.ppn,
                    qty: i.qty,
                    satuan: i.satuan
                });
                return null;
            })
            this.setState({
                databrg: res,
                brgval: brg
            })
        });
    }
    handleLoadMore(){
        this.setState({
            isScroll:true
        });
        let perpage = parseInt(this.props.pagin_brg_sale.per_page,10);
        let lengthBrg = parseInt(this.props.barang.length,10);
        if(perpage===lengthBrg || perpage<lengthBrg){
            // barang?page=1&lokasi=LK/0001&customer=1000001&searchby=deskripsi&q=cedea&perpage=5
            let where=`lokasi=${this.state.location}&customer=${this.state.customer}`;
            if(localStorage.anySaleTrx!==undefined){
                if(where!==''){where+='&';}
                where+=`q=${localStorage.anySaleTrx}`
                if(parseInt(this.state.searchby,10)===1){if(where!==''){where+='&';}where+=`searchby=kd_brg`}
                if(parseInt(this.state.searchby,10)===2){if(where!==''){where+='&';}where+=`searchby=barcode`}
                if(parseInt(this.state.searchby,10)===3){if(where!==''){where+='&';}where+=`searchby=deskripsi`}
            }
            // let where=`lokasi=${this.state.location}&customer=${this.state.customer}&perpage=${this.state.perpage}`;
            this.props.dispatch(FetchProductSale(1,`${where}&perpage=${this.state.perpage}`,'sale',this.autoSetQty));
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
    handleChecked(event,i,barcode){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        // this.setState({
        //     [name]: value,
        // });
        let brgval = [...this.state.brgval];
        brgval[i] = {...brgval[i], [name]: value};
        this.setState({ brgval });
        const cek = cekData('barcode', barcode, table);
        if(name === 'isOpenPrice'){
            cek.then(res => {
                if (res === undefined) {
                    Toast.fire({
                        icon: 'error',
                        title: `not found.`
                    })
                } else {
                    let final= {
                        id: res.id,
                        qty: 0,
                        kd_brg: res.kd_brg,
                        nm_brg: res.nm_brg,
                        barcode: res.barcode,
                        satuan: res.satuan,
                        harga: res.harga,
                        stock: res.stock,
                        diskon_persen: res.diskon_persen,
                        diskon_nominal: res.diskon_nominal,
                        ppn: res.ppn,
                        tambahan: res.tambahan,
                        isOpenPrice:value
                    }
                    update(table, final);
                    Toast.fire({
                        icon: 'success',
                        title: `${name} has been changed.`
                    })
                }
                this.getData();
            })
        }
    }
    render() {
        if(this.state.isScroll===true)this.handleScroll();

        let opCustomer=[{
            value: '1000001',
            label: 'UMUM'
        }];

        if (this.props.customer !== undefined && this.props.customer !== []) {
            this.props.customer.map(i=>{
                opCustomer.push({
                    value: i.kd_cust,
                    label: i.nama
                })
                return null;
            })
        }
        let totalsub=0;
        const centerStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        const leftStyle = {verticalAlign: "middle", textAlign: "left",whiteSpace:"nowrap"};
        const rightStyle = {verticalAlign: "middle", textAlign: "right",whiteSpace: "nowrap"};
        
        return (
            <Layout page="Penjualan Barang">
                <div className="card">
                    <div className="card-header">
                        <h4>Penjualan Barang</h4>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <StickyBox offsetTop={100} offsetBottom={20} style={{width:"25%",marginRight:"10px"  }}>
                            <div className="card">
                                <div className="card-body">
                                    <div className="form-group">
                                        <div className="input-group input-group-sm">
                                            <select name='searchby' className="form-control form-control-sm" onChange={(e) => this.HandleCommonInputChange(e, false)}>
                                                <option value={1}>Kode Barang</option>
                                                <option value={2}>Barcode</option>
                                                <option value={3}>Deskripsi</option>
                                            </select>
                                        </div>
                                        <small id="passwordHelpBlock" className="form-text text-muted">
                                            Cariberdasarkan {parseInt(this.state.searchby,10) === 1 ? 'Kode Barang' : (parseInt(this.state.searchby,10) === 2 ? 'Barcode' : 'Deskripsi')}
                                        </small>
                                    </div>
                                    <div className="form-group">
                                        <div className="input-group input-group-sm">
                                            <input autoFocus type="text" id="chat-search" name="search" className="form-control form-control-sm" placeholder={`Search ${localStorage.anySaleTrx!==undefined?localStorage.anySaleTrx:""}`} value={this.state.search}
                                                onChange={(e) => this.HandleCommonInputChange(e, false)}
                                                onKeyPress={event => {if (event.key === 'Enter') {this.HandleSearch();}}}
                                            />
                                            <span className="input-group-append">
                                              <button type="button" className="btn btn-primary" onClick={event => {event.preventDefault();this.HandleSearch();}}>
                                                <i className="fa fa-search"/>
                                              </button>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="people-list" style={{zoom:"80%",height:'300px',maxHeight:'100%',overflowY:'scroll'}}>
                                            {
                                                !this.props.loadingbrg?
                                                    <div id="chat_user_2">
                                                        <ul className="chat-list list-unstyled">
                                                            {
                                                                this.props.barang.length !== 0 ?
                                                                    this.props.barang.map((i, inx) => {
                                                                        return (
                                                                            <li style={{backgroundColor:this.state.scrollPage===inx||this.state.isClick===inx?"#eeeeee":""}} id={`item${inx}`} className="clearfix" key={inx}
                                                                                onClick={(e) => this.HandleAddBrg(e, {
                                                                                    kd_brg: i.kd_brg,
                                                                                    nm_brg: i.nm_brg,
                                                                                    barcode: i.barcode,
                                                                                    satuan: i.satuan,
                                                                                    harga_old:i.harga,
                                                                                    harga: i.harga,
                                                                                    harga2: i.harga2,
                                                                                    harga3: i.harga3,
                                                                                    harga4: i.harga4,
                                                                                    stock: i.stock,
                                                                                    diskon_persen: i.diskon_persen,
                                                                                    diskon_nominal: i.diskon_nominal,
                                                                                    ppn: i.ppn,
                                                                                    qty: 1,
                                                                                    hrg_beli:i.hrg_beli,
                                                                                    kategori:i.kategori,
                                                                                    services:i.service,
                                                                                    tambahan: i.tambahan,
                                                                                    isOpenPrice: false,
                                                                                },inx)}>
                                                                                {i.gambar.replace(" ","") === `${HEADERS.URL}images/barang/default.png` ? (<span class="circle">{inx + 1}</span>) : (<img src={i.gambar} alt="avatar"/>)}
                                                                                <div className="about">
                                                                                    <div className="status" style={{color: 'black',fontWeight:"bold", wordBreak:"break-all", fontSize:"12px"}}>{i.nm_brg}</div>
                                                                                    <div className="status" style={{color: '#a1887f', fontWeight:"bold", wordBreak:"break-all", fontSize:"12px"}}>({i.kd_brg}) {toRp(i.harga)}</div>
                                                                                </div>

                                                                            </li>
                                                                        )
                                                                    })
                                                                    : (
                                                                        <div style={{textAlign: 'center', fontSize: "11px", fontStyle: "italic"}}>Barang tidak ditemukan.</div>
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
                        </StickyBox>
                        <div style={{width:"75%",zoom:'85%'}}>
                            <div className="card">
                                <div className="card-body">
                                    <form className=''>
                                        <div className="row">
                                            <div className="col-md-2">
                                                <div className="form-group">
                                                    <label className="control-label font-12">No. Transaksi</label>
                                                    <input type="text" readOnly className="form-control" id="nota" value={this.props.nota}/>
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <div className="form-group">
                                                    <label className="control-label font-12">Tanggal Order</label>
                                                    <input type="date" name={"tgl_order"} className={"form-control"} value={this.state.tgl_order} onChange={(e => this.HandleCommonInputChange(e))}/>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="control-label font-12">Lokasi</label>
                                                    <Select options={this.state.location_data} placeholder="Pilih Lokasi"
                                                            onChange={this.HandleChangeLokasi}
                                                            value={this.state.location_data.find(op => {return op.value === this.state.location})}
                                                    />
                                                    <div className="invalid-feedback"
                                                         style={this.state.error.location !== "" ? {display: 'block'} : {display: 'none'}}>
                                                        {this.state.error.location}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="control-label font-12">Customer</label>
                                                    <Select options={opCustomer} placeholder="Pilih Customer"
                                                            onChange={this.HandleChangeCustomer}
                                                            value={opCustomer.find(op => {return op.value === this.state.customer})}
                                                    />
                                                    <div className="invalid-feedback"
                                                         style={this.state.error.customer !== "" ? {display: 'block'} : {display: 'none'}}>
                                                        {this.state.error.customer}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <div className="form-group">
                                                    <label className="control-label font-12">Catatan</label>
                                                    <textarea style={{height: "39px"}} className="form-control" id="exampleTextarea1" rows={3} defaultValue={this.state.catatan} onChange={(e => this.HandleCommonInputChange(e))} name="catatan"/>
                                                    <div className="invalid-feedback"
                                                         style={this.state.error.catatan !== "" ? {display: 'block'} : {display: 'none'}}>
                                                        {this.state.error.catatan}
                                                    </div>

                                                </div>
                                            </div>

                                        </div>
                                    </form>
                                    <div style={{overflowX: "auto"}}>
                                        <table className="table table-hover">
                                            <thead>
                                            <tr>
                                                <th style={centerStyle}>#</th>
                                                <th style={centerStyle}>barang</th>
                                                <th style={centerStyle}>barcode</th>
                                                <th style={centerStyle}>satuan</th>
                                                <th style={centerStyle}>harga</th>
                                                <th style={centerStyle}>disc 1 (%)</th>
                                                {/* <th style={centerStyle}>disc 2 (%)</th> */}
                                                <th style={centerStyle}>ppn</th>
                                                <th style={centerStyle}>stock</th>
                                                <th style={centerStyle}>qty</th>
                                                <th style={centerStyle}>Subtotal</th>
                                            </tr>
                                            </thead>

                                            <tbody>
                                            {
                                                this.state.databrg.map((item, index) => {
                                                    let disc1 = 0;
                                                    let disc2 = 0;
                                                    let ppn = 0;
                                                    let hrg=parseInt(rmComma(item.harga),10);
                                                    let ppnInt=parseInt(item.ppn,10);
                                                    let disc_rp=parseInt(item.diskon_nominal,10);
                                                    let disc_per=parseInt(item.diskon_persen,10);
                                                    // 2000-(2000*(10/100)) = 1800 // diskon 1 (%)
                                                    // 1800-(1800*(10/100)) = 1620 // diskon 2 (%)
                                                    // 2000+(2000*(10/100)) = 2200 // ppn
                                                    if(disc_per!==0){
                                                        disc1 = hrg-(hrg*(disc_per/100));
                                                        disc2 = disc1;
                                                        if(disc_rp!==0){
                                                            disc2 = disc1-(disc1*(disc_rp/100))
                                                        }
                                                    }else if(disc_rp!==0){
                                                        disc1 = hrg-(hrg*(disc_rp/100));
                                                        disc2 = disc1;
                                                        if(disc_per!==0){
                                                            disc2 = disc1-(disc1*(disc_per/100))
                                                        }
                                                    }

                                                    if(ppnInt!==0){
                                                        ppn = hrg*(ppnInt/100);
                                                    }

                                                    totalsub+=(disc2===0?hrg+ppn:disc2+ppn)*parseInt(item.qty,10);

                                                    return (
                                                        <tr key={index}>
                                                            <td style={centerStyle}>
                                                                <a href="about:blank" className='btn btn-danger btn-sm' onClick={(e) => this.HandleRemove(e, item.id)}><i className='fa fa-trash'/></a>
                                                            </td>
                                                            <td style={leftStyle}>{item.nm_brg}</td>
                                                            <td style={leftStyle}>{item.barcode}</td>
                                                            <td style={leftStyle}>{item.satuan}</td>
                                                            <td style={centerStyle}>

                                                                {/*<label>Open Price <input style={{float:"right!important"}} type="checkbox" className={"form-control"} name={"isOpenPrice"} checked={this.state.brgval[index].isOpenPrice} onChange={(e) => this.handleChecked(e, index)}/></label>*/}



                                                                {

                                                                    this.state.brgval[index].isOpenPrice?(
                                                                        <input type="text" className={"form-control"} value={toCurrency(this.state.brgval[index].harga)} style={{width:"100px"}} name="harga"
                                                                               onBlur={(e) => this.HandleChangeInput(e, item.barcode)}
                                                                               onChange={(e) => this.HandleChangeInputValue(e, index)}
                                                                        />
                                                                    ):(
                                                                        <select className="form-control" name='harga' style={{width:"100px"}}
                                                                                onBlur={(e) => this.HandleChangeInput(e, item.barcode)}
                                                                                onChange={(e) => this.HandleChangeInputValue(e, index)}>
                                                                            <option value={this.state.brgval[index].harga} style={{display:this.state.brgval[index].harga===''||this.state.brgval[index].harga==='0'?'none':''}}>{toCurrency(this.state.brgval[index].harga)}</option>
                                                                            <option value={this.state.brgval[index].harga2} style={{display:this.state.brgval[index].harga2===''||this.state.brgval[index].harga2==='0'?'none':''}}>{toCurrency(this.state.brgval[index].harga2)}</option>
                                                                            <option value={this.state.brgval[index].harga3} style={{display:this.state.brgval[index].harga3===''||this.state.brgval[index].harga3==='0'?'none':''}}>{toCurrency(this.state.brgval[index].harga3)}</option>
                                                                            <option value={this.state.brgval[index].harga4} style={{display:this.state.brgval[index].harga4===''||this.state.brgval[index].harga4==='0'?'none':''}}>{toCurrency(this.state.brgval[index].harga4)}</option>
                                                                        </select>
                                                                    )
                                                                }
                                                                <div className="row" style={{marginTop:"5px"}}>
                                                                    <div className="col-md-3" style={{paddingRight:"0px",paddingLeft:"0px"}}>
                                                                        <input type="checkbox" className={"form-control"} name={"isOpenPrice"} checked={this.state.brgval[index].isOpenPrice} onChange={(e) => this.handleChecked(e, index,item.barcode)}/>
                                                                    </div>
                                                                    <div className="col-md-" style={{marginTop:"-3px",textAlign:"left",paddingLeft:"0px"}}>
                                                                        <small>open price</small>
                                                                    </div>

                                                                </div>

                                                                {/* <input type='text' className="form-control" name='harga'
                                                                       onBlur={(e) => this.HandleChangeInput(e, item.barcode)}
                                                                       onChange={(e) => this.HandleChangeInputValue(e, index)}
                                                                       value={toCurrency(this.state.brgval[index].harga)}/> */}
                                                            </td>
                                                            <td style={centerStyle}><input type='number' name='diskon_persen' style={{width:"100px",textAlign:"right"}} className="form-control"
                                                                       onBlur={(e) => this.HandleChangeInput(e, item.barcode)}
                                                                       onChange={(e) => this.HandleChangeInputValue(e, index)}
                                                                       value={this.state.brgval[index].diskon_persen}/>
                                                            </td>
                                                            {/* <td><input type='text' name='diskon_nominal'
                                                                       className="form-control"
                                                                       onBlur={(e) => this.HandleChangeInput(e, item.barcode)}
                                                                       onChange={(e) => this.HandleChangeInputValue(e, index)}
                                                                       value={this.state.brgval[index].diskon_nominal}/>
                                                            </td> */}
                                                            <td style={centerStyle}><input type='number' name='ppn' style={{width:"100px",textAlign:"right"}}  className="form-control"
                                                                       onBlur={(e) => this.HandleChangeInput(e, item.barcode)}
                                                                       onChange={(e) => this.HandleChangeInputValue(e, index)}
                                                                       value={this.state.brgval[index].ppn}/>
                                                            </td>
                                                            <td style={centerStyle}>
                                                                <input readOnly={true} type="number" value={item.stock} className="form-control" style={{width:"100px",textAlign:"right"}}/>
                                                            </td>
                                                            <td style={centerStyle}><input type='text' name='qty' style={{width:"100px",textAlign:"right"}}
                                                                       onBlur={(e) => this.HandleChangeInput(e, item.barcode)}
                                                                       className="form-control"
                                                                       onChange={(e) => this.HandleChangeInputValue(e, index)}
                                                                       value={this.state.brgval[index].qty}/>
                                                                <div className="invalid-feedback text-center" style={parseInt(this.state.brgval[index].qty,10)>parseInt(item.stock,10)?{display:'block'}:{display:'none'}}>
                                                                    Qty Melebihi Stock.
                                                                </div>
                                                            </td>
                                                            <td style={centerStyle}>
                                                                <input readOnly={true} type="text" value={toCurrency((disc2===0?hrg+ppn:disc2+ppn)*parseInt(item.qty,10))} className="form-control" style={{width:"100px",textAlign:"right"}}/>
                                                            </td>
                                                            {/*<td style={centerStyle}>{toCurrency((disc2===0?hrg+ppn:disc2+ppn)*parseInt(item.qty,10))}</td>*/}

                                                        </tr>
                                                    )
                                                })
                                            }
                                            </tbody>
                                            <tfoot>
                                            <tr style={{background: '#eee'}}>
                                                <td colSpan='9' style={rightStyle}>Total
                                                </td>
                                                <td colSpan='1' style={rightStyle}>{toRp(totalsub)}</td>
                                            </tr>
                                            </tfoot>
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
                                                            <input type="text" id="sub_total" name="sub_total" className="form-control text-right" value={toCurrency(totalsub)} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className="row" style={{marginBottom: '3px'}}>
                                                        <label className="col-sm-4">Discount</label>
                                                        <div className="col-sm-3">
                                                            <input type="number" onChange={(e)=>this.HandleCommonInputChange(e,false,totalsub)}  name="discount_persen"  min="0" max="100"className="form-control" placeholder="%" value={this.state.discount_persen}/>
                                                        </div>
                                                        <div className="col-sm-5">
                                                            <input type="text" onChange={(e) => this.HandleCommonInputChange(e,false,totalsub)} name="discount_harga" className="form-control text-right" placeholder="Rp" value={toCurrency(this.state.discount_harga)}/>
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

                                                            <input type="text" name="grand_total" className="form-control text-right" readOnly value={toCurrency((totalsub - (totalsub * (parseFloat(this.state.discount_persen) / 100))) + (totalsub * (parseFloat(this.state.pajak) / 100)))} />
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



                <FormSale master={this.state.master} detail={this.state.detail} subtotal={totalsub} lokasi={this.props.dataDetailLocation}/>
            </Layout>
        );
    }
}


const mapStateToPropsCreateItem = (state) => ({
    barang: state.productReducer.result_brg_sale,
    loadingbrg: state.productReducer.isLoadingBrgSale,
    pagin_brg_sale:state.productReducer.pagin_brg_sale,
    nota: state.saleReducer.code,
    customer: state.customerReducer.all,
    auth:state.auth,
    dataDetailLocation:state.locationReducer.detail,
});

export default (connect(mapStateToPropsCreateItem)(Sale));