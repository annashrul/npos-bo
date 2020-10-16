import React,{Component} from 'react';
import {store,get, update,destroy,cekData,del} from "components/model/app.model";
import connect from "react-redux/es/connect/connect";
import Layout from "../../Layout";
import Select from "react-select";
import Swal from "sweetalert2";
import {FetchBrg} from "redux/actions/masterdata/product/product.action";
import moment from "moment";
import {FetchCodeAdjustment, storeAdjusment} from "redux/actions/adjustment/adjustment.action";
import {withRouter} from 'react-router-dom';
import StickyBox from "react-sticky-box";
import {ToastQ} from "helper";
import imgDefault from 'assets/default.png'
import {toRp} from "../../../../helper";

const table='adjusment';
class TrxAdjustment extends Component{
    constructor(props) {
        super(props);
        this.state={
            databrg: [],
            brgval:[],
            location_data:[],
            location:"",
            location_val:"",
            catatan:'-',
            tgl_order: moment(new Date()).format("yyyy-MM-DD"),
            searchby:"",
            search:"",
            userid:0,
            perpage:5,
            error:{
                location:"",
                catatan:""
            },
        }
        this.setTglOrder=this.setTglOrder.bind(this);
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.HandleCommonInputChange=this.HandleCommonInputChange.bind(this);
        this.HandleSearch=this.HandleSearch.bind(this);
        this.HandleAddBrg=this.HandleAddBrg.bind(this);
        this.HandleRemove=this.HandleRemove.bind(this);
        this.HandleReset=this.HandleReset.bind(this);
        this.HandleChangeInputValue=this.HandleChangeInputValue.bind(this);
        this.HandleChangeInput=this.HandleChangeInput.bind(this);
        this.handleLoadMore=this.handleLoadMore.bind(this);

    }
    getProps(param){
        if (param.auth.user) {
            let lk = [];
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
            this.getData();
        }
    }
    componentDidMount(){
        if(localStorage.lk!==undefined&&localStorage.lk!==''){
            this.setState({
                location:localStorage.lk
            })

        }
        if (localStorage.lk!==undefined&&localStorage.lk!=='') {
            this.props.dispatch(FetchBrg(1, 'barcode', '', localStorage.lk, null, this.autoSetQty,5));
            this.props.dispatch(FetchCodeAdjustment(localStorage.lk));
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
    componentWillMount(){
       this.getProps(this.props);
    }
    setTglOrder(date) {
        this.setState({
            tgl_order: date
        });
    };
    HandleChangeLokasi(lk){
        let err = Object.assign({}, this.state.error, {
            location: ""
        });
        this.setState({
            location: lk.value,
            location_val: lk.label,
            error: err
        })
        localStorage.setItem('lk', lk.value);
        this.props.dispatch(FetchCodeAdjustment(lk.value));
        this.props.dispatch(FetchBrg(1, 'barcode', '', lk.value, null, this.autoSetQty,5));
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
    HandleSearch(){
        if (this.state.location === "") {
            Swal.fire(
                'Gagal!',
                'Pilih lokasi',
                'error'
            )
        }else{
            // alert("bus "+this.state.searchby);

            // let where=`lokasi=${this.state.location}&customer=${this.state.customer}`;
            //
            if(parseInt(this.state.searchby,10)===1 || this.state.searchby===""){
                this.props.dispatch(FetchBrg(1, 'kd_brg', this.state.search, this.state.location, null, this.autoSetQty));
            }
            if(parseInt(this.state.searchby,10)===2){
                this.props.dispatch(FetchBrg(1, 'barcode', this.state.search, this.state.location, null, this.autoSetQty));

            }
            if(parseInt(this.state.searchby,10)===3){
                this.props.dispatch(FetchBrg(1, 'deskripsi', this.state.search, this.state.location, null, this.autoSetQty));

            }
            this.setState({search: ''});

        }
    }
    HandleAddBrg(e,item) {
        e.preventDefault();
        const finaldt = {
            barcode:item.barcode,
            harga_beli:item.harga_beli,
            satuan:item.satuan,
            hrg_jual:item.hrg_jual,
            kd_brg:item.kd_brg,day
            nm_brg:item.nm_brg,
            kel_brg:item.kel_brg,
            kategori:item.kategori,
            stock_min:item.stock_min,
            supplier:item.supplier,
            subdept:item.subdept,
            deskripsi:item.deskripsi,
            jenis:item.jenis,
            kcp:item.kcp,
            poin:item.poin,
            group1:item.group1,
            group2:item.group2,
            stock:item.stock,
            qty_adjust:parseInt(item.qty_adjust,10)+1,
            status:item.status,
            saldo_stock:item.stock,
            tambahan:item.tambahan,
        };
        const cek = cekData('kd_brg',item.kd_brg,table);
        cek.then(res => {
            if(res===undefined){
                store(table, finaldt)
            }else{
                let saldo_stock = res.stock;
                if(res.status === 'kurang'){
                    saldo_stock=parseInt(res.stock,10)-parseInt(res.qty_adjust,10);
                }
                if(res.status === 'tambah' || res.status==='' || res.status === undefined){
                    saldo_stock=parseInt(res.stock,10)+parseInt(res.qty_adjust,10)
                }
                update(table,{
                    id:res.id,
                    barcode:res.barcode,
                    harga_beli:res.harga_beli,
                    satuan:res.satuan,
                    hrg_jual:res.hrg_jual,
                    kd_brg:res.kd_brg,
                    nm_brg:res.nm_brg,
                    kel_brg:res.kel_brg,
                    kategori:res.kategori,
                    stock_min:res.stock_min,
                    supplier:res.supplier,
                    subdept:res.subdept,
                    deskripsi:res.deskripsi,
                    jenis:res.jenis,
                    kcp:res.kcp,
                    poin:res.poin,
                    group1:res.group1,
                    group2:res.group2,
                    stock:res.stock,
                    qty_adjust:parseInt(res.qty_adjust,10)+1,
                    saldo_stock:saldo_stock,
                    status:res.status,
                    tambahan:res.tambahan,
                })
            }
            this.getData()
        })
    }
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
                localStorage.removeItem('lk');
                window.location.reload(false);
            }
        })
    }
    HandleChangeInputValue(e,i,barcode=null,datas=[]) {
        const column = e.target.name;
        const val = e.target.value;
        let brgval = [...this.state.brgval];
        brgval[i] = {...brgval[i], [column]: val};
        this.setState({ brgval });

        if (column === 'satuan') {
            const cek = cekData('barcode', barcode, table);
            cek.then(res => {
                if (res === undefined) {
                    ToastQ.fire({
                        icon: 'error',
                        title: `not found.`
                    })
                } else {
                    let newbrg = [];
                    datas.map(i => {
                        if (i.satuan === val) {
                            newbrg = i;
                            //
                        }
                        return null;
                    })

                    let final = {
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
                if (column === 'qty_adjust'){
                    let saldo_stock = res.stock;
                    console.log(val);
                    console.log(val);
                    if (res.status === 'kurang') {
                        saldo_stock = parseInt(res.stock, 10) - parseInt(val, 10);
                    }
                    if (res.status === 'tambah' || res.status === '' || res.status === undefined) {
                        saldo_stock = parseInt(res.stock, 10) + parseInt(val, 10)
                    }
                    final[saldo_stock]=saldo_stock;
                }
                update(table, final);
                ToastQ.fire({
                    icon: 'success',
                    title: `${column} has been changed.`
                })
            }
            this.getData();
        })

    }
    HandleSubmit(e){
        e.preventDefault();
        
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
            this.setState({
                error: err
            })
        }else{
            const data = get(table);
            data.then(res => {
                if (res.length===0){
                    Swal.fire(
                        'Error!',
                        'Pilih barang untuk melanjutkan Adjusment.',
                        'error'
                    )
                }else{
                    
                    Swal.fire({
                        title: 'Simpan Adjusment?',
                        text: "Pastikan data yang anda masukan sudah benar!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Ya, Simpan!',
                        cancelButtonText: 'Tidak!'
                    }).then((result) => {
                        if (result.value) {

                            let detail = [];
                            let data={};
                            data['kd_kasir'] = this.state.userid;
                            data['tgl'] = moment(this.state.tgl_order).format("yyyy-MM-DD");
                            data['lokasi'] = this.state.location;
                            data['keterangan'] = this.state.catatan;
                            res.map(item => {
                                let saldo_stock=item.saldo_stock;

                                if(item.status === 'kurang'){
                                    saldo_stock=parseInt(item.stock,10)-parseInt(item.qty_adjust,10);
                                }
                                if(item.status === 'tambah' || item.status === '' || item.status === undefined){
                                    saldo_stock=parseInt(item.stock,10)+parseInt(item.qty_adjust,10)
                                }
                                detail.push({
                                    "brcd_brg": item.barcode,
                                    "status": item.status,
                                    "qty_adjust": item.qty_adjust,
                                    "stock_terakhir": saldo_stock,
                                    "hrg_beli": item.harga_beli
                                })
                                return null;
                            });
                            data['detail'] = detail;
                            data['master'] = this.state.databrg;
                            data['nota'] = this.props.nota;
                            data['logo'] = this.props.auth.user.logo;
                            data['user'] = this.props.auth.user.username;
                            data['lokasi_val'] = this.state.location_val;
                            data['alamat'] = this.props.auth.user.alamat;
                            data['site_title'] = this.props.auth.user.site_title === undefined?this.props.auth.user.title:this.props.auth.user.site_title;
                            this.props.dispatch(storeAdjusment(data,(arr)=>this.props.history.push(arr)));
                        }
                    })


                }
            })
        }

    }
    autoSetQty(kode,data){
        const cek = cekData('kd_brg', kode, table);
        return cek.then(res => {
            if (res === undefined) {
                store(table, {
                    barcode:data[0].barcode,
                    harga_beli:data[0].harga_beli,
                    satuan:data[0].satuan,
                    hrg_jual:data[0].hrg_jual,
                    kd_brg:data[0].kd_brg,
                    nm_brg:data[0].nm_brg,
                    kel_brg:data[0].kel_brg,
                    kategori:data[0].kategori,
                    stock_min:data[0].stock_min,
                    supplier:data[0].supplier,
                    subdept:data[0].subdept,
                    deskripsi:data[0].deskripsi,
                    jenis:data[0].jenis,
                    kcp:data[0].kcp,
                    poin:data[0].poin,
                    group1:data[0].group1,
                    group2:data[0].group1,
                    stock:data[0].stock,
                    qty_adjust:0,
                    saldo_stock:data[0].stock,
                    status:"tambah",
                    tambahan: data[0].tambahan
                })
            } else {
                let saldo_stock = res.stock;
                if(res.status === 'kurang'){
                    saldo_stock=parseInt(res.stock,10)-parseInt(res.qty_adjust,10);
                }
                if(res.status === 'tambah' || res.status==='' || res.status === undefined){
                    saldo_stock=parseInt(res.stock,10)+parseInt(res.qty_adjust,10)
                }
                update(table, {
                    id: res.id,
                    barcode:res.barcode,
                    harga_beli:res.harga_beli,
                    satuan:res.satuan,
                    hrg_jual:res.hrg_jual,
                    kd_brg:res.kd_brg,
                    nm_brg:res.nm_brg,
                    kel_brg:res.kel_brg,
                    kategori:res.kategori,
                    stock_min:res.stock_min,
                    supplier:res.supplier,
                    subdept:res.subdept,
                    deskripsi:res.deskripsi,
                    jenis:res.jenis,
                    kcp:res.kcp,
                    poin:res.poin,
                    group1:res.group1,
                    group2:res.group1,
                    stock:res.stock,
                    saldo_stock:saldo_stock,
                    qty_adjust:parseFloat(res.qty_adjust) + 1,
                    status:res.status,
                    tambahan: res.tambahan
                })
            }
            return true
        })
    }
    getData() {
        const data = get(table);
        data.then(res => {
            let brg = [];
            res.map((i) => {
                brg.push({
                    qty_adjust: i.qty_adjust,
                    status: i.status,
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
        let perpage = parseInt(this.props.paginBrg.per_page,10);
        let lengthBrg = parseInt(this.props.barang.length,10);
        if(perpage===lengthBrg || perpage<lengthBrg){
            this.props.dispatch(FetchBrg(1, 'barcode', '', this.state.location, null, this.autoSetQty,this.state.perpage));
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
        return (
            <Layout page="Adjusment">
                <div className="card">
                    <div className="card-header">
                        <h4>Adjusment</h4>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12" style={{ display: 'flex', alignItems: 'flex-start' }}>
                                {/*START LEFT*/}
                                <StickyBox offsetTop={100} offsetBottom={20} style={{width:"23%",marginRight:"10px"  }}>
                                    <div className="form-group">
                                        <label htmlFor="">Plih Barang</label>
                                        <div className="input-group input-group-sm">
                                            <select name='searchby' className="form-control form-control-sm" onChange={(e) => this.HandleCommonInputChange(e, false)}>
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
                                            berdasarkan {parseInt(this.state.searchby,10) === 1 ? 'Kode Barang' : (parseInt(this.state.searchby,10) === 2 ? 'Barcode' : 'Deskripsi')}
                                        </small>
                                    </div>
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
                                                          <button type="button" className="btn btn-primary"
                                                                  onClick={
                                                                      event => {
                                                                          event.preventDefault();
                                                                          this.HandleSearch();
                                                                      }
                                                                  }>
                                                            <i className="fa fa-search"/>
                                                          </button>
                                                        </span>
                                        </div>
                                    </div>
                                    <div className="people-list" style={{height:'300px',maxHeight:'100%',overflowY:'scroll'}}>
                                        <div id="chat_user_2">
                                            <ul className="chat-list list-unstyled">
                                                {
                                                    this.props.barang.length!==0?
                                                        this.props.barang.map((i,inx)=>{
                                                            return(
                                                                <li className="clearfix" key={inx} onClick={(e)=>this.HandleAddBrg(e,{
                                                                    barcode:i.barcode,
                                                                    harga_beli:i.harga_beli,
                                                                    satuan:i.satuan,
                                                                    hrg_jual:i.hrg_jual,
                                                                    kd_brg:i.kd_brg,
                                                                    nm_brg:i.nm_brg,
                                                                    kel_brg:i.kel_brg,
                                                                    kategori:i.kategori,
                                                                    stock_min:i.stock_min,
                                                                    supplier:i.supplier,
                                                                    subdept:i.subdept,
                                                                    deskripsi:i.deskripsi,
                                                                    jenis:i.jenis,
                                                                    kcp:i.kcp,
                                                                    poin:i.poin,
                                                                    group1:i.group1,
                                                                    group2:i.group2,
                                                                    stock:i.stock,
                                                                    qty_adjust:1,
                                                                    status:'tambah',
                                                                    saldo_stock:i.stock,
                                                                    tambahan:i.tambahan
                                                                })}>
                                                                    <img src={i.gambar} onError={(e)=>{e.target.onerror = null; e.target.src=`${imgDefault}`}} alt="avatar"/>
                                                                    <div className="about">
                                                                        <div className="status" style={{color: 'black',fontWeight:"bold",
                                                                            wordBreak:"break-all",
                                                                            fontSize:"12px"}}>{i.nm_brg}</div>
                                                                            <div className="status" style={{color: 'black',
                                                                            fontWeight:"bold"}}><small>({i.kd_brg}) <small>{i.supplier}</small></small></div>
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
                                    <hr/>
                                    <div className="form-group">
                                        <button className={"btn btn-primary"} style={{width:"100%"}} onClick={this.handleLoadMore}>{this.props.loadingbrg?'tunggu sebentar ...':'tampilkan lebih banyak'}</button>
                                    </div>
                                </StickyBox>
                                {/*END LEFT*/}
                                {/*START RIGHT*/}
                                <div style={{width:"77%"}}>
                                    <div className="card-header" style={{zoom:"85%"}}>
                                        <form className=''>
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="">Kode Adjusment</label>
                                                        <input
                                                            type="text"
                                                            readOnly
                                                            className="form-control"
                                                            id="nota"
                                                            style={{fontWeight: 'bolder'}}
                                                            value={this.props.nota}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label className="control-label font-12">
                                                            Tanggal Order
                                                        </label>
                                                        <input type="date" name={"tgl_order"} className={"form-control"} value={this.state.tgl_order} onChange={(e => this.HandleCommonInputChange(e))}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
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
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label className="control-label font-12">
                                                            Catatan
                                                        </label>
                                                        <input type="text" name={"catatan"} className="form-control" defaultValue={this.state.catatan} onChange={(e => this.HandleCommonInputChange(e))}/>
                                                        <div className="invalid-feedback"
                                                             style={this.state.error.catatan !== "" ? {display: 'block'} : {display: 'none'}}>
                                                            {this.state.error.catatan}
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div style={{overflowX: "auto",zoom:"80%",marginTop:'10px'}}>
                                        <table className="table table-hover">
                                            <thead>
                                            <tr>
                                                <th style={columnStyle}>No</th>
                                                <th style={columnStyle}>#</th>
                                                <th style={columnStyle}>Kode</th>
                                                <th style={columnStyle}>barcode</th>
                                                <th style={columnStyle}>Nama</th>
                                                <th style={columnStyle}>Satuan</th>
                                                <th style={columnStyle}>Harga Beli</th>
                                                <th style={columnStyle}>Stock Sistem</th>
                                                <th style={columnStyle}>Jenis</th>
                                                <th style={columnStyle}>Stock Adjust</th>
                                                <th style={columnStyle}>Saldo Stock</th>
                                            </tr>
                                            </thead>

                                            <tbody>
                                            {
                                                this.state.databrg.map((item, index) => {
                                                    let saldo_stock = item.saldo_stock;
                                                    if(item.status === 'kurang'){
                                                        saldo_stock=parseInt(item.stock,10)-parseInt(item.qty_adjust,10);
                                                    }
                                                    if(item.status === 'tambah' || item.status===''){
                                                        saldo_stock=parseInt(item.stock,10)+parseInt(item.qty_adjust,10)
                                                    }
                                                    return (
                                                        <tr key={index}>
                                                            <td style={columnStyle}>{index+1}</td>
                                                            <td style={columnStyle}>
                                                                <a href="about:blank" className='btn btn-danger btn-sm'
                                                                   onClick={(e) => this.HandleRemove(e, item.id)}><i
                                                                    className='fa fa-trash'/></a>
                                                            </td>
                                                            <td style={columnStyle}>{item.kd_brg}</td>
                                                            <td style={columnStyle}>{item.barcode}</td>
                                                            <td style={columnStyle}>{item.nm_brg}</td>
                                                            <td style={columnStyle}><select className="form-control" name='satuan' style={{width:"100px"}} disabled={item.tambahan.length<=1?true:false} onChange={(e) => this.HandleChangeInputValue(e, index, item.barcode, item.tambahan)}>
                                                                {
                                                                    item.tambahan.map(i => {
                                                                        return (
                                                                            <option value={i.satuan} selected={i.satuan === item.satuan}>{i.satuan}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </select></td>

                                                            <td style={columnStyle}><input style={{textAlign:"right"}} readOnly={true} type='text' name='harga_beli' value={toRp(item.harga_beli)} className="form-control"/></td>
                                                            <td style={columnStyle}><input style={{textAlign:"right"}} readOnly={true} type='text' name='stock' value={item.stock} className="form-control"/></td>
                                                            <td style={columnStyle}>
                                                                <select style={{width:"120px"}} name='status' onChange={(e) => this.HandleChangeInput(e, item.barcode)} value={this.state.brgval[index].status} defaultValue={this.state.brgval[index].status} className="form-control">
                                                                    <option value="tambah">Tambah</option>
                                                                    <option value="kurang">Kurang</option>
                                                                </select>
                                                            </td>
                                                            <td style={columnStyle}>
                                                                <input style={{textAlign:"right"}} type='text' name='qty_adjust' onBlur={(e) => this.HandleChangeInput(e, item.barcode)} onChange={(e) => this.HandleChangeInputValue(e, index)} value={this.state.brgval[index].qty_adjust}  className="form-control"/>
                                                                {
                                                                    parseFloat(this.state.brgval[index].qty_adjust) <= 0 ? (<small style={{fontWeight:"bold",color:"red"}}>Qty Tidak boleh 0</small>) : ""
                                                                }
                                                            </td>
                                                            <td style={columnStyle}>
                                                                <input style={{textAlign:"right"}} readOnly={true} type="text" className="form-control" value={saldo_stock}/>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                            </tbody>
                                        </table>

                                    </div>
                                    <div className="dashboard-btn-group d-flex align-items-center">
                                        <a href="about:blank" onClick={(e)=>this.HandleSubmit(e)} className="btn btn-primary ml-1">Simpan</a>
                                        <a href="about:blank" onClick={(e)=>this.HandleReset(e)} className="btn btn-danger ml-1">Reset</a>
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
    auth:state.auth,
    barang: state.productReducer.result_brg,
    loadingbrg: state.productReducer.isLoadingBrg,
    paginBrg:state.productReducer.pagin_brg,
    nota:state.adjustmentReducer.get_code,
});

export default withRouter(connect(mapStateToPropsCreateItem)(TrxAdjustment));