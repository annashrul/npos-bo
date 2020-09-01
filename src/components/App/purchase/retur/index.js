import React,{Component} from 'react'
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import Swal from "sweetalert2";
import {FetchSupplierAll} from "redux/actions/masterdata/supplier/supplier.action";
import {FetchBrg} from "redux/actions/masterdata/product/product.action";
import {setProductbrg} from "redux/actions/masterdata/product/product.action";
import {store,get, update,destroy,cekData,del} from "components/model/app.model";
import StickyBox from "react-sticky-box";
import {toRp} from "helper";
import DatePicker from "react-datepicker";
import Select from "react-select";
import moment from "moment";
import {storeReturTanpaNota} from "../../../../redux/actions/purchase/retur_tanpa_nota/return_tanpa_nota.action";
const table='retur_tanpa_nota';
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

class ReturTanpaNota extends Component{
    constructor(props) {
        super(props);
        this.state = {
            databrg: [],
            brgval:[],
            tanggal: moment(new Date()).format("yyyy-MM-DD"),
            location_data:[],
            location:"",
            supplier_data:[],
            supplier:"",
            catatan:"-",
            userid:0,
            ambil_nota:'',
            searchby:1,
            search:"",
            error:{
                location:"",
                supplier:"",
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
        this.HandleChangeSupplier = this.HandleChangeSupplier.bind(this);
        this.setTanggal=this.setTanggal.bind(this);
        this.HandleReset = this.HandleReset.bind(this);
        this.HandleSearch = this.HandleSearch.bind(this);
    }
    componentDidMount() {
        this.props.dispatch(FetchSupplierAll());
        this.getData();
        if (localStorage.catatan !== undefined && localStorage.catatan !== '') {
            this.setState({
                catatan: localStorage.catatan
            })
        }
        if (localStorage.lk !== undefined && localStorage.lk !== '') {
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
            this.props.dispatch(FetchBrg(1, 'barcode', '', localStorage.lk, localStorage.sp, this.autoSetQty))
        }
    }
    componentWillReceiveProps = (nextProps) => {
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
    HandleChangeLokasi(lk) {
        let err = Object.assign({}, this.state.error, {
            location: ""
        });

        this.setState({
            location: lk.value,
            error: err
        })
        localStorage.setItem('lk', lk.value);
        if (this.state.supplier !== "") {
            this.props.dispatch(FetchBrg(1, 'barcode', '', lk.value, this.state.supplier, this.autoSetQty))
        }
        destroy(table);
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
            this.props.dispatch(FetchBrg(1, 'barcode', '', this.state.location, sp.value, this.autoSetQty))
        }
        destroy(table);
        this.getData()
    }
    HandleCommonInputChange(e,errs=true,st=0){
        const column = e.target.name;
        const val = e.target.value;
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
                        return null;
                    })

                    let final= {
                        id: res.id,

                        kd_brg: res.kd_brg,
                        nm_brg:res.nm_brg,
                        barcode:newbrg.barcode,
                        satuan:newbrg.satuan,
                        deskripsi:res.deskripsi,
                        kondisi:res.kondisi,
                        stock: newbrg.stock,
                        harga_beli: newbrg.harga_beli,
                        ppn:res.ppn,
                        ket:'',
                        qty_retur:0,
                        tambahan:res.tambahan


                        // qty: 0,
                        // kd_brg: res.kd_brg,
                        // barcode: newbrg.barcode,
                        // satuan: newbrg.satuan,
                        // diskon: res.diskon,
                        // diskon2: res.diskon2,
                        // diskon3: 0,
                        // diskon4: 0,
                        // ppn: res.ppn,
                        // qty_bonus: res.qty_bonus,
                        // stock: newbrg.stock,
                        // harga_beli: newbrg.harga_beli,
                        // nm_brg: res.nm_brg,
                        // tambahan: res.tambahan
                    }
                    update(table, final);
                    Toast.fire({
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
            nm_brg:item.nm_brg,
            barcode:item.barcode,
            satuan:item.satuan,
            deskripsi:item.deskripsi,
            kondisi:item.kondisi,
            stock:item.stock,
            ppn:item.ppn,
            harga_beli:item.harga_beli,
            ket:item.ket,
            qty_retur:item.qty_retur,
            tambahan:item.tambahan
        };
        const cek = cekData('kd_brg',item.kd_brg,table);
        cek.then(res => {
            if(res===undefined){
                store(table, finaldt)
            }else{
                update(table,{
                    id:res.id,
                    kd_brg: res.kd_brg,
                    nm_brg:res.nm_brg,
                    barcode:res.barcode,
                    satuan:res.satuan,
                    deskripsi:res.deskripsi,
                    kondisi:res.kondisi,
                    stock:res.stock,
                    ppn:res.ppn,
                    harga_beli:res.harga_beli,
                    ket:res.ket,
                    qty_retur:parseFloat(res.qty_retur)+1,
                    tambahan:res.tambahan
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
        if (this.state.catatan === "" || this.state.location === "" || this.state.supplier === "") {
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
                        title: 'Simpan Transaksi Retur Tanpa Nota?',
                        text: "Pastikan data yang anda masukan sudah benar!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Ya, Simpan!',
                        cancelButtonText: 'Tidak!'
                    }).then((result) => {
                        if (result.value) {
                            let data={};
                            let detail=[];
                            data['tanggal'] = moment(this.state.tanggal).format("yyyy-MM-DD");
                            data['supplier'] = this.state.supplier;
                            data['keterangan'] = this.state.catatan;
                            data['subtotal'] = localStorage.getItem("grand_total");
                            data['lokasi'] = this.state.location;
                            data['userid']  = this.state.userid;
                            res.map(item => {
                                detail.push({
                                    "kd_brg": item.kd_brg,
                                    "barcode": item.barcode,
                                    "satuan": item.satuan,
                                    "qty": item.qty_retur,
                                    "harga_beli": item.harga_beli,
                                    "keterangan": item.keterangan,
                                    "kondisi": item.kondisi,
                                })
                                return null;
                            });
                            data['detail'] = detail;
                            this.props.dispatch(storeReturTanpaNota(data));
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
                    nm_brg:data[0].nm_brg,
                    barcode:data[0].barcode,
                    satuan:data[0].satuan,
                    deskripsi:data[0].deskripsi,
                    kondisi:data[0].kondisi,
                    stock:data[0].stock,
                    ppn:data[0].ppn,
                    harga_beli:data[0].harga_beli,
                    ket:data[0].ket,
                    qty_retur:1,
                    tambahan:data[0].tambahan
                })
            } else {
                update(table, {
                    id: res.id,
                    kd_brg: res.kd_brg,
                    nm_brg:res.nm_brg,
                    barcode:res.barcode,
                    satuan:res.satuan,
                    deskripsi:res.deskripsi,
                    kondisi:res.kondisi,
                    stock:res.stock,
                    ppn:res.ppn,
                    harga_beli:res.harga_beli,
                    ket:res.ket,
                    qty_retur:parseFloat(res.qty_retur) + 1,
                    tambahan:res.tambahan
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
            let brg = []
            res.map((i) => {
                brg.push({
                    kondisi: i.kondisi,
                    qty_retur: i.qty_retur,
                    satuan: i.satuan,
                    harga_beli: i.harga_beli,
                    ket: i.ket,
                });
                return null;
            })
            this.setState({
                databrg: res,
                brgval: brg
            })
        });
    }
    render(){
        let total_stock = 0;
        let qty_retur = 0;
        let grand_total = 0;
        let opSupplier=[];
        if(this.props.supplier!=[]){
            this.props.supplier.map(i=>{
                opSupplier.push({
                    value: i.kode,
                    label: i.nama
                })
                return null;
            })
        }
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        return (
            <Layout page="Retur Tanpa Nota">
                <div className="card">
                    <div className="card-header">
                        <h5>Retur Tanpa Nota</h5>
                    </div>
                    <div style={{ height: "100vh"}}>
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <StickyBox offsetTop={100} offsetBottom={20} style={{width:"20%" }}>
                                <div className="card">
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
                                                                <select name='searchby'
                                                                        className="form-control form-control-sm"
                                                                        onChange={(e) => this.HandleCommonInputChange(e, false)}>
                                                                    <option value={1}>Kode Barang</option>
                                                                    <option value={2}>Barcode</option>
                                                                    <option value={3}>Deskripsi</option>
                                                                </select>
                                                            </div>
                                                            <small
                                                                id="passwordHelpBlock"
                                                                className="form-text text-muted"
                                                            >
                                                                Cari
                                                                berdasarkan {parseInt(this.state.searchby,10) == 1 ? 'Kode Barang' : (parseInt(this.state.searchby,10) === 2 ? 'Barcode' : 'Deskripsi')}
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
                                                                    placeholder="Search"
                                                                    value={this.state.search}
                                                                    onChange={(e) => this.HandleCommonInputChange(e, false)}
                                                                    onKeyPress={
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
                                      className="btn btn-primary"
                                      onClick={
                                          event => {
                                              event.preventDefault();
                                              this.HandleSearch();
                                          }
                                      }
                                  >
                                    <i className="fa fa-search"/>
                                  </button>
                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/*end chat-search*/}
                                            <div className="people-list">
                                                <div id="chat_user_2">
                                                    <ul className="chat-list list-unstyled">
                                                        {
                                                            this.props.barang.length !== 0 ?
                                                                this.props.barang.map((i, inx) => {
                                                                    return (
                                                                        <li className="clearfix" key={inx}
                                                                            onClick={(e) => this.HandleAddBrg(e, {
                                                                                kd_brg: i.kd_brg,
                                                                                nm_brg:i.nm_brg,
                                                                                barcode:i.barcode,
                                                                                satuan:i.satuan,
                                                                                deskripsi:i.deskripsi,
                                                                                kondisi:i.kondisi,
                                                                                stock:i.stock,
                                                                                ppn:i.ppn,
                                                                                harga_beli:i.harga_beli,
                                                                                ket:'-',
                                                                                qty_retur:1,
                                                                                tambahan:i.tambahan
                                                                            })}>
                                                                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png" alt="avatar"/>
                                                                            <div className="about">
                                                                                <div className="status"><small>{i.nm_brg.toLowerCase()}</small></div>
                                                                            </div>
                                                                        </li>
                                                                    )
                                                                }) : (
                                                                    <div style={{
                                                                        textAlign: 'center',
                                                                        fontSize: "11px",
                                                                        fontStyle: "italic"
                                                                    }}>Barang tidak ditemukan.</div>
                                                                )

                                                        }


                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </StickyBox>
                            <div style={{width:"80%"}}>
                                <div className="card" style={{height: "auto"}}>
                                    <div className="container" style={{marginTop: "20px"}}>
                                        {/* HEADER FORM */}
                                        <form className=''>
                                            <div className="row">
                                                <div className="col-md-6">

                                                    <div className="form-group">
                                                        <label className="control-label font-12">
                                                            Tanggal Order
                                                        </label>
                                                        <input type="date" name={"tanggal"} className={"form-control"} value={this.state.tanggal} onChange={(e => this.HandleCommonInputChange(e))}/>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="control-label font-12">
                                                            Lokasi
                                                        </label>
                                                        <Select
                                                            options={this.state.location_data}
                                                            placeholder="Pilih Lokasi"
                                                            onChange={this.HandleChangeLokasi}
                                                            value={
                                                                this.state.location_data.find(op => {
                                                                    return op.value === this.state.location
                                                                })
                                                            }

                                                        />
                                                        <div className="invalid-feedback"
                                                             style={this.state.error.location !== "" ? {display: 'block'} : {display: 'none'}}>
                                                            {this.state.error.location}
                                                        </div>
                                                    </div>
                                                    
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label className="control-label font-12">
                                                            Supplier
                                                        </label>
                                                        <Select
                                                            options={opSupplier}
                                                            placeholder="Pilih Supplier"
                                                            onChange={this.HandleChangeSupplier}
                                                            value={
                                                                opSupplier.find(op => {
                                                                    return op.value === this.state.supplier
                                                                })
                                                            }
                                                        />
                                                        <div className="invalid-feedback"
                                                             style={this.state.error.supplier !== "" ? {display: 'block'} : {display: 'none'}}>
                                                            {this.state.error.supplier}
                                                        </div>
                                                    </div>

                                                    <div className="form-group">
                                                        <label className="control-label font-12">
                                                            Catatan
                                                        </label>
                                                        <textarea
                                                            className="form-control"
                                                            id="exampleTextarea1"
                                                            rows={1}
                                                            onChange={(e => this.HandleCommonInputChange(e))}
                                                            name="catatan"
                                                            value={this.state.catatan}
                                                        />
                                                        <div className="invalid-feedback"
                                                             style={this.state.error.catatan !== "" ? {display: 'block'} : {display: 'none'}}>
                                                            {this.state.error.catatan}
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive" style={{overflowX: 'auto',zoom:"85%"}}>
                                            <table className="table table-hover table-bordered">
                                                <thead>
                                                <tr>
                                                    <th style={columnStyle}>#</th>
                                                    <th style={columnStyle}>Nama barang</th>
                                                    <th style={columnStyle}>barcode</th>
                                                    <th style={columnStyle}>satuan</th>
                                                    <th style={columnStyle}>harga beli</th>
                                                    <th style={columnStyle}>Kondisi</th>
                                                    <th style={columnStyle}>Ket</th>
                                                    <th style={columnStyle}>Stock</th>
                                                    <th style={columnStyle}>Qty Retur</th>
                                                    <th style={columnStyle}>Nilai Retur</th>
                                                </tr>
                                                </thead>

                                                <tbody>
                                                {
                                                    this.state.databrg.map((item, index) => {
                                                        let total_retur=parseInt(item.qty_retur,10)*parseInt(item.harga_beli,10);
                                                        grand_total = grand_total + total_retur;
                                                        localStorage.setItem("grand_total",grand_total);
                                                        qty_retur = qty_retur+parseInt(item.qty_retur,10);
                                                        total_stock = total_stock+parseInt(item.stock,10);
                                                        return (
                                                            <tr key={index}>
                                                                <td style={columnStyle}>
                                                                    <a href="about:blank" className='btn btn-danger btn-sm'
                                                                       onClick={(e) => this.HandleRemove(e, item.id)}><i
                                                                        className='fa fa-trash'/></a>
                                                                </td>
                                                                <td style={columnStyle}>{item.nm_brg}</td>
                                                                <td style={columnStyle}>{item.barcode}</td>
                                                                <td>
                                                                    <select className="form-control" style={{width:"100px"}} name='satuan' onChange={(e)=>this.HandleChangeInputValue(e,index,item.barcode,item.tambahan)}>
                                                                        {
                                                                            item.tambahan.map(i=>{
                                                                                return(
                                                                                    <option value={i.satuan} selected={i.satuan === item.satuan}>{i.satuan}</option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </select>
                                                                </td>
                                                                <td style={columnStyle}><input className="form-control" style={{width:"100px",textAlign:"right"}} type='text' name='harga_beli' onBlur={(e)=>this.HandleChangeInput(e,item.barcode)} onChange={(e)=>this.HandleChangeInputValue(e,index)}   value={this.state.brgval[index].harga_beli}/></td>
                                                                <td style={columnStyle}>
                                                                    <select className="form-control" style={{width:"140px"}} name='kondisi' onChange={(e) => this.HandleChangeInput(e, item.barcode)} value={this.state.brgval[index].kondisi} defaultValue={this.state.brgval[index].kondisi}>
                                                                        <option value="">Pilih Kondisi</option>
                                                                        <option value="bad_stock">Bad Stock</option>
                                                                        <option value="good_stock">Good Stock</option>
                                                                        <option value="dead_stock">Dead Stock</option>
                                                                        <option value="over_stock">Over Stock</option>
                                                                        <option value="expired_date">Expired Date</option>
                                                                        <option value="slow_moving">Slow Moving</option>
                                                                    </select>
                                                                </td>
                                                                <td style={columnStyle}><input className="form-control" style={{width:"100px"}} type='text' name='ket' onBlur={(e)=>this.HandleChangeInput(e,item.barcode)} onChange={(e)=>this.HandleChangeInputValue(e,index)}   value={this.state.brgval[index].ket}/></td>
                                                                <td style={columnStyle}>{item.stock}</td>
                                                                <td style={columnStyle}><input className="form-control" style={{width:"100px",textAlign:"right"}} type='text' name='qty_retur' onBlur={(e)=>this.HandleChangeInput(e,item.barcode)} onChange={(e)=>this.HandleChangeInputValue(e,index)}   value={this.state.brgval[index].qty_retur}/></td>
                                                                <td style={columnStyle}><input className="form-control" style={{width:"100px",textAlign:"right"}} readOnly={true} type='text' value={toRp(total_retur)}/></td>

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
                                            <div className="col-md-5">
                                                <div className="pull-right">
                                                    <table className="table table-hover">
                                                        <thead>
                                                        <tr>
                                                            <th>TOTAL STOCK</th>
                                                            <th>{total_stock}</th>
                                                        </tr>
                                                        <tr>
                                                            <th>TOTAL QTY</th>
                                                            <th>{qty_retur}</th>
                                                        </tr>
                                                        <tr>
                                                            <th>GRAND TOTAL</th>
                                                            <th>{toRp(grand_total)}</th>
                                                        </tr>
                                                        </thead>
                                                    </table>
                                                    {/*<tfoot>*/}
                                                    {/*<tr>*/}
                                                        {/*<td colSpan={7}>TOTAL</td>*/}
                                                        {/*<td></td>*/}
                                                        {/*<td style={{textAlign:"right"}}>{qty_retur}</td>*/}
                                                        {/*<td style={{textAlign:"right"}}>{grand_total}</td>*/}
                                                    {/*</tr>*/}
                                                    {/*</tfoot>*/}
                                                </div>
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
    supplier: state.supplierReducer.dataSupllier,
    auth:state.auth,
});

export default connect(mapStateToPropsCreateItem)(ReturTanpaNota);