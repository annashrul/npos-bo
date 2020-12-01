import React,{Component} from 'react';
import {store,get, update,destroy,cekData,del} from "components/model/app.model";
import connect from "react-redux/es/connect/connect";
import Layout from "../../Layout";
import Select from "react-select";
import Swal from "sweetalert2";
import {
    BrowserView,
    MobileView,
    // isBrowser,
    // isMobile
} from 'react-device-detect';
import moment from "moment";
import {FetchCodeAdjustment} from "redux/actions/adjustment/adjustment.action";
import {toRp,lengthBrg,ToastQ} from "helper";
import {FetchCodeProduksi, storeProduksi,FetchBrgProduksiBahan, FetchBrgProduksiPaket} from "redux/actions/inventory/produksi.action";
import imgDefault from 'assets/default.png'
import StickyBox from "react-sticky-box";


const table='production';
class Produksi extends Component{
    constructor(props) {
        super(props);
        this.state={
            databrg: [],
            brgval:[],
            location_data:[],
            location:"",
            barang_paket_data:[],
            barang_paket:"",
            catatan:'-',
            tgl_order: moment(new Date()).format('YYYY-MM-DD'),
            searchby:"",
            search:"",
            userid:0,
            qty_estimasi:0,
            perpage:5,
            isload:false,
            scrollPage:0,
            error:{
                location:"",
                catatan:"",
                qty_estimasi:"",
            },
        }
        this.setTglOrder=this.setTglOrder.bind(this);
        this.HandleChangeBarangPaket = this.HandleChangeBarangPaket.bind(this);
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
        if(param.barangPaket.length>0){
            this.getData();
            let brg=[];
            if(typeof param.barangPaket === 'object'){
                param.barangPaket.map((v)=>{
                    brg.push({
                        value:`${v.kd_brg} | ${v.barcode}`,
                        label:v.nm_brg,
                    })
                    return null;
                })
            }
            this.setState({
                barang_paket_data:brg
            })
        }
    }
    componentDidMount(){
        if(localStorage.location_produksi!==undefined&&localStorage.location_produksi!==''){
            this.setState({
                location:localStorage.location_produksi
            })

        }
        if(localStorage.barang_paket_produksi!==undefined&&localStorage.barang_paket_produksi!==''){
            this.setState({
                barang_paket:localStorage.barang_paket_produksi
            })

        }
        if (localStorage.location_produksi!==undefined&&localStorage.location_produksi!=='') {
            // this.props.dispatch(FetchBrg(1, 'barcode', '', localStorage.location_produksi, null, this.autoSetQty));
            this.props.dispatch(FetchBrgProduksiBahan(1,'barcode','',localStorage.location_produksi,this.autoSetQty,5));
            this.props.dispatch(FetchBrgProduksiPaket(1,'barcode','',localStorage.location_produksi));
            this.props.dispatch(FetchCodeAdjustment(localStorage.location_produksi));
        }
    }
    componentWillReceiveProps = (nextProps) => {
        let perpage=this.state.perpage;
        if(typeof this.props.barangBahan.data === 'object'){
            if(this.props.barangBahan.data.length === perpage){
                this.setState({
                    perpage:perpage+5
                });
            }
        }

        this.getProps(nextProps);
    }
    componentWillUnmount(){
        destroy(table);
        localStorage.removeItem('location_produksi');
        localStorage.removeItem('barang_paket_produksi');
    }
    componentWillMount(){
        this.getProps(this.props);

    }
    setTglOrder(date) {
        this.setState({
            tgl_order: date
        });
    };
    HandleChangeBarangPaket(lk){
        let err = Object.assign({}, this.state.error, {
            barang_paket: ""
        });
        this.setState({
            barang_paket: lk.value,
            error: err
        });
        localStorage.setItem('barang_paket_produksi', lk.value);
    }
    HandleChangeLokasi(lk){
        let err = Object.assign({}, this.state.error, {
            location: ""
        });
        this.setState({
            location: lk.value,
            error: err
        });
        localStorage.setItem('location_produksi', lk.value);
        this.props.dispatch(FetchCodeProduksi(lk.value));
        this.props.dispatch(FetchBrgProduksiBahan(1,'barcode','',lk.value,this.autoSetQty,5));
        this.props.dispatch(FetchBrgProduksiPaket(1,'barcode','',lk.value));

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
            if(parseInt(this.state.searchby,10)===1 || this.state.searchby===""){
                this.props.dispatch(FetchBrgProduksiBahan(1,'kd_brg',this.state.search,this.state.location,this.autoSetQty));
                this.props.dispatch(FetchBrgProduksiPaket(1,'kd_brg',this.state.search,this.state.location));
            }
            if(parseInt(this.state.searchby,10)===2){
                this.props.dispatch(FetchBrgProduksiBahan(1,'barcode',this.state.search,this.state.location,this.autoSetQty));
                this.props.dispatch(FetchBrgProduksiPaket(1,'barcode',this.state.search,this.state.location));
            }
            if(parseInt(this.state.searchby,10)===3){
                this.props.dispatch(FetchBrgProduksiBahan(1,'deskripsi',this.state.search,this.state.location,this.autoSetQty));
                this.props.dispatch(FetchBrgProduksiPaket(1,'deskripsi',this.state.search,this.state.location));
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
            kd_brg:item.kd_brg,
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
                localStorage.removeItem('location_produksi');
                localStorage.removeItem('barang_paket_produksi');
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
        if (this.state.catatan === "" || this.state.location === "" || this.state.barang_paket === ""){
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
            if (this.state.barang_paket === "") {
                err = Object.assign({}, err, {
                    barang_paket: "barang paket tidak boleh kosong."
                });
            }
            this.setState({
                error: err
            })
        }else{
            if(this.state.qty_estimasi===0||this.state.qty_estimasi==='0'||this.state.qty_estimasi===''){
                err = Object.assign({}, err, {
                    qty_estimasi: "qty estimasi tidak boleh kosong"
                });
                this.setState({
                    error: err
                })
            }else{
                const data = get(table);
                data.then(res => {
                    if (res.length===0){
                        Swal.fire(
                            'Error!',
                            'Pilih barang untuk melanjutkan Produksi.',
                            'error'
                        )
                    }else{
                        Swal.fire({
                            title: 'Simpan Produksi?',
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
                                let exp = this.state.barang_paket.split("|", 2);
                                let data={};
                                data['brcd_hasil'] = exp[1].trim();
                                data['kd_brg_hasil'] = exp[0].trim();
                                data['userid'] = this.state.userid;
                                data['tanggal'] = moment(this.state.tgl_order).format("yyyy-MM-DD");
                                data['lokasi'] = this.state.location;
                                data['keterangan'] = this.state.catatan;
                                data['qty_estimasi'] = this.state.qty_estimasi;
                                res.map(item => {
                                    detail.push({
                                        "kd_brg": item.kd_brg,
                                        "barcode": item.barcode,
                                        "satuan": item.satuan,
                                        "qty": item.qty_adjust,
                                        "harga_beli": item.harga_beli
                                    })
                                    // if(parseFloat(item.qty_adjust) > parseFloat(item.stock)){
                                    //     alert("qty melebihi sistem");
                                    // }
                                    return null;
                                });
                                data['detail'] = detail;

                                for(let x=0;x<res.length;x++){
                                    if(parseFloat(res[x].qty_adjust) > parseFloat(res[x].stock)){
                                        Swal.fire({
                                            title: `Anda yakin akan melanjutkan transaksi?`,
                                            text: `ada qty yang melebihi stock`,
                                            icon: 'warning',
                                            showCancelButton: true,
                                            confirmButtonColor: '#3085d6',
                                            cancelButtonColor: '#d33',
                                            confirmButtonText: 'Ya!',
                                            cancelButtonText: 'Tidak!'
                                        }).then((result) => {
                                            if (result.value) {
                                                this.props.dispatch(storeProduksi(data));
                                            }
                                        })
                                    }else{
                                        this.props.dispatch(storeProduksi(data));
                                        break;
                                    }
                                }
                            }
                        })


                    }
                })
            }

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
        if(parseInt(this.props.barangBahan.total,10)>parseInt(this.props.barangBahan.per_page,10)){
            this.props.dispatch(FetchBrgProduksiBahan(1,'kd_brg',this.state.search,this.state.location,this.autoSetQty,this.state.perpage));
            this.setState({scrollPage:this.state.scrollPage+5});

        }
        else{
            Swal.fire({
                title: 'Perhatian',
                icon: 'warning',
                text: 'Tidak ada data.',
            });
        }
        if(!this.props.loadingbrg)this.handleScroll();

    }
    handleScroll(){
        let divToScrollTo;
        divToScrollTo = document.getElementById(`item${this.state.scrollPage}`);
        if (divToScrollTo) {
            divToScrollTo.scrollIntoView(false,{behavior: 'smooth'})
        }
    }
    render() {
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        return (
            <Layout page="Produksi">
                <div className="card">
                    <div className="card-header">
                        <h4>Produksi</h4>
                    </div>
                    <BrowserView>
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            {/*START LEFT*/}
                            <StickyBox offsetTop={100} offsetBottom={20} style={{width:"20%",marginRight:"10px"  }}>
                                <div className="card">
                                    <div className="card-body">
                                        <div className="form-group">
                                            <label htmlFor="">Plih Barang</label>
                                            <div className="input-group input-group-sm">
                                                <select name='searchby' className="form-control form-control-sm" onChange={(e) => this.HandleCommonInputChange(e, false)}>
                                                    <option value={1}>Kode Barang</option>
                                                    <option value={2}>Barcode</option>
                                                    <option value={3}>Deskripsi</option>
                                                </select>
                                            </div>
                                            <small id="passwordHelpBlock" className="form-text text-muted">
                                                Cari
                                                berdasarkan {parseInt(this.state.searchby,10) === 1 ? 'Kode Barang' : (parseInt(this.state.searchby,10) === 2 ? 'Barcode' : 'Deskripsi')}
                                            </small>
                                        </div>
                                        <div className="form-group">
                                            <div className="input-group input-group-sm">
                                                <input autoFocus type="text" id="chat-search" name="search" className="form-control form-control-sm" placeholder="Search" value={this.state.search} onChange={(e) => this.HandleCommonInputChange(e, false)}
                                                       onKeyPress={event => {if (event.key === 'Enter') {this.HandleSearch();}}}
                                                />
                                                <span className="input-group-append">
                                                  <button type="button" className="btn btn-primary" onClick={event => {event.preventDefault();this.HandleSearch();}}>
                                                    <i className="fa fa-search"/>
                                                  </button>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="people-list" style={{height:'300px',maxHeight:'100%',overflowY:'scroll'}}>
                                            <div id="chat_user_2">
                                                <ul className="chat-list list-unstyled">
                                                    {

                                                        typeof this.props.barangBahan.data ==='object'? this.props.barangBahan.data.length!==0?
                                                            this.props.barangBahan.data.map((i,inx)=>{
                                                                return(
                                                                    <li style={{backgroundColor:this.state.scrollPage===inx?"#eeeeee":""}} id={`item${inx}`} className="clearfix" key={inx} onClick={(e)=>this.HandleAddBrg(e,{
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
                                                                        qty_adjust:0,
                                                                        status:'tambah',
                                                                        saldo_stock:i.stock,
                                                                        tambahan:i.tambahan
                                                                    })}>
                                                                        <img src={i.gambar} onError={(e)=>{e.target.onerror = null; e.target.src=`${imgDefault}`}} alt="avatar"/>
                                                                        <div className="about">
                                                                            <div className="status" style={{color: 'black',fontWeight:"bold",fontSize:"12px"}}>{lengthBrg(i.nm_brg)}</div>
                                                                            <div className="status" style={{color: 'black',fontWeight:"bold"}}><small>{i.barcode}</small></div>
                                                                        </div>
                                                                    </li>
                                                                )
                                                            })
                                                            :(
                                                                <div style={{textAlign:'center',fontSize:"11px",fontStyle:"italic"}}>Barang tidak ditemukan.</div>
                                                            ) :""
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className="form-group">
                                            <button className={"btn btn-primary"} style={{width:"100%"}} onClick={this.handleLoadMore}>{this.props.isLoading?'Tunggu Sebentar':'tampilkan lebih banyak'}</button>
                                        </div>
                                    </div>
                                </div>
                            </StickyBox>
                            {/*END LEFT*/}
                            {/*START RIGHT*/}
                            <div style={{width:"80%"}}>
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row" style={{zoom:"80%"}}>
                                            <div className="col-md-2">
                                                <div className="form-group">
                                                    <label className="control-label font-12">Kode Produksi</label>
                                                    <input type="text" readOnly className="form-control" id="nota" style={{fontWeight: 'bolder'}} value={this.props.nota}/>
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <div className="form-group">
                                                    <label className="control-label font-12">Tanggal Order</label>
                                                    <input type="date" name="tgl_order" className="form-control" value={this.state.tgl_order} onChange={(e => this.HandleCommonInputChange(e))}/>
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <div className="form-group">
                                                    <label className="control-label font-12">Lokasi</label>
                                                    <Select options={this.state.location_data} placeholder="Pilih Lokasi" onChange={this.HandleChangeLokasi} value={this.state.location_data.find(op => {return op.value === this.state.location})}/>
                                                    <div className="invalid-feedback"
                                                         style={this.state.error.location !== "" ? {display: 'block'} : {display: 'none'}}>
                                                        {this.state.error.location}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="control-label font-12">Barang Paket</label>
                                                    <Select options={this.state.barang_paket_data} placeholder="Pilih Barang" onChange={this.HandleChangeBarangPaket} value={this.state.barang_paket_data.find(op => {return op.value === this.state.barang_paket})}/>
                                                    <div className="invalid-feedback"
                                                         style={this.state.error.barang_paket !== "" ? {display: 'block'} : {display: 'none'}}>
                                                        {this.state.error.barang_paket}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-1">
                                                <div className="form-group">
                                                    <label className="control-label font-12">Qty Est.</label>
                                                    <input type="text" name="qty_estimasi" className="form-control" value={this.state.qty_estimasi} onChange={(e => this.HandleCommonInputChange(e))}/>
                                                    <div className="invalid-feedback"
                                                         style={this.state.error.qty_estimasi !== "" ? {display: 'block'} : {display: 'none'}}>
                                                        {this.state.error.qty_estimasi}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <div className="form-group">
                                                    <label className="control-label font-12">Catatan</label>
                                                    <input type="text" name="catatan" className="form-control" value={this.state.catatan} onChange={(e => this.HandleCommonInputChange(e))} />
                                                    <div className="invalid-feedback"
                                                         style={this.state.error.catatan !== "" ? {display: 'block'} : {display: 'none'}}>
                                                        {this.state.error.catatan}
                                                    </div>
                                                </div>

                                            </div>

                                        </div>
                                        <div className="row">
                                            <div className="col-md-12" style={{overflowX: "auto",zoom:"85%"}}>
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
                                                        <th style={columnStyle}>Qty</th>
                                                    </tr>
                                                    </thead>

                                                    <tbody>
                                                    {
                                                        this.state.databrg.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td style={columnStyle}>{index+1}</td>

                                                                    <td style={columnStyle}>
                                                                        <a href="about:blank" className='btn btn-danger btn-sm' onClick={(e) => this.HandleRemove(e, item.id)}><i className='fa fa-trash'/></a>
                                                                    </td>
                                                                    <td style={columnStyle}>{item.kd_brg}</td>
                                                                    <td style={columnStyle}>{item.barcode}</td>
                                                                    <td style={columnStyle}>{item.nm_brg}</td>
                                                                    <td style={columnStyle}>{item.satuan}</td>
                                                                    <td style={columnStyle}><input style={{textAlign:"right"}} readOnly={true} type='text' name='harga_beli' value={toRp(parseInt(item.harga_beli,10))} className="form-control"/></td>
                                                                    <td style={columnStyle}><input style={{textAlign:"right"}} readOnly={true} type='text' name='stock' value={item.stock} className="form-control"/></td>
                                                                    <td style={columnStyle}>
                                                                        <input style={{textAlign:"right"}} type='text' name='qty_adjust' onBlur={(e) => this.HandleChangeInput(e, item.barcode)} onChange={(e) => this.HandleChangeInputValue(e, index)} value={
                                                                            parseFloat(this.state.brgval[index].qty_adjust) <= 0 ?0:this.state.brgval[index].qty_adjust
                                                                        }  className="form-control"/>
                                                                        {
                                                                            parseFloat(this.state.brgval[index].qty_adjust) <= 0 ? (<small style={{fontWeight:"bold",color:"red"}}>Qty Tidak boleh 0</small>) : ""
                                                                        }
                                                                        {
                                                                            parseFloat(this.state.brgval[index].qty_adjust) > parseFloat(item.stock) ? (<small style={{fontWeight:"bold",color:"red"}}>Qty melebihi stock sistem</small>) : ""
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                    </tbody>
                                                </table>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-header">
                                        <div className="dashboard-btn-group d-flex align-items-center">
                                            <a href="about:blank" onClick={(e)=>this.HandleSubmit(e)} className="btn btn-primary ml-1">Simpan</a>
                                            <a href="about:blank" onClick={(e)=>this.HandleReset(e)} className="btn btn-danger ml-1">Reset</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*END RIGHT*/}
                        </div>
                    </BrowserView>
                    <MobileView>
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-6 col-sm-6">
                                        <div className="form-group">
                                            <label htmlFor="">Plih Barang</label>
                                            <div className="input-group input-group-sm">
                                                <select name='searchby' className="form-control form-control-sm" onChange={(e) => this.HandleCommonInputChange(e, false)}>
                                                    <option value={1}>Kode Barang</option>
                                                    <option value={2}>Barcode</option>
                                                    <option value={3}>Deskripsi</option>
                                                </select>
                                            </div>
                                            <small id="passwordHelpBlock" className="form-text text-muted">
                                                Cari
                                                berdasarkan {parseInt(this.state.searchby,10) === 1 ? 'Kode Barang' : (parseInt(this.state.searchby,10) === 2 ? 'Barcode' : 'Deskripsi')}
                                            </small>
                                        </div>
                                        <div className="form-group">
                                            <div className="input-group input-group-sm">
                                                <input autoFocus type="text" id="chat-search" name="search" className="form-control form-control-sm" placeholder="Search" value={this.state.search} onChange={(e) => this.HandleCommonInputChange(e, false)}
                                                       onKeyPress={event => {if (event.key === 'Enter') {this.HandleSearch();}}}
                                                />
                                                <span className="input-group-append">
                                                  <button type="button" className="btn btn-primary" onClick={event => {event.preventDefault();this.HandleSearch();}}>
                                                    <i className="fa fa-search"/>
                                                  </button>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="people-list" style={{height:'250px',maxHeight:'100%',overflowY:'scroll'}}>
                                            <div id="chat_user_2">
                                                <ul className="chat-list list-unstyled">
                                                    {

                                                        typeof this.props.barangBahan.data ==='object'? this.props.barangBahan.data.length!==0?
                                                            this.props.barangBahan.data.map((i,inx)=>{
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
                                                                        qty_adjust:0,
                                                                        status:'tambah',
                                                                        saldo_stock:i.stock,
                                                                        tambahan:i.tambahan
                                                                    })}>
                                                                        <img src={i.gambar} onError={(e)=>{e.target.onerror = null; e.target.src=`${imgDefault}`}} alt="avatar"/>
                                                                        <div className="about">
                                                                            <div className="status" style={{color: 'black',fontWeight:"bold",fontSize:"12px"}}>{lengthBrg(i.nm_brg)}</div>
                                                                            <div className="status" style={{color: 'black',fontWeight:"bold"}}><small>{i.barcode}</small></div>
                                                                        </div>
                                                                    </li>
                                                                )
                                                            })
                                                            :(
                                                                <div style={{textAlign:'center',fontSize:"11px",fontStyle:"italic"}}>Barang tidak ditemukan.</div>
                                                            ) :""
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                        <hr/>
                                        <div className="form-group">
                                            <button className={"btn btn-primary"} style={{width:"100%"}} onClick={this.handleLoadMore}>{this.props.isLoading?'loading ...':'muat lebih'}</button>
                                        </div>
                                    </div>
                                    <div className="col-6 col-sm-6">
                                        <div className="form-group">
                                            <label className="control-label font-12">Kode Produksi</label>
                                            <input type="text" readOnly className="form-control" id="nota" style={{fontWeight: 'bolder'}} value={this.props.nota}/>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label font-12">Tanggal Order</label>
                                            <input type="date" name="tgl_order" className="form-control" value={this.state.tgl_order} onChange={(e => this.HandleCommonInputChange(e))}/>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label font-12">Lokasi</label>
                                            <Select options={this.state.location_data} placeholder="Pilih Lokasi" onChange={this.HandleChangeLokasi} value={this.state.location_data.find(op => {return op.value === this.state.location})}/>
                                            <div className="invalid-feedback"
                                                 style={this.state.error.location !== "" ? {display: 'block'} : {display: 'none'}}>
                                                {this.state.error.location}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label font-12">Barang Paket</label>
                                            <Select options={this.state.barang_paket_data} placeholder="Pilih Barang" onChange={this.HandleChangeBarangPaket} value={this.state.barang_paket_data.find(op => {return op.value === this.state.barang_paket})}/>
                                            <div className="invalid-feedback"
                                                 style={this.state.error.barang_paket !== "" ? {display: 'block'} : {display: 'none'}}>
                                                {this.state.error.barang_paket}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label font-12">Qty Estimasi</label>
                                            <input type="text" name="qty_estimasi" className="form-control" value={this.state.qty_estimasi} onChange={(e => this.HandleCommonInputChange(e))}/>
                                            <div className="invalid-feedback"
                                                 style={this.state.error.qty_estimasi !== "" ? {display: 'block'} : {display: 'none'}}>
                                                {this.state.error.qty_estimasi}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label font-12">Catatan</label>
                                            <input type="text" name="catatan" className="form-control" value={this.state.catatan} onChange={(e => this.HandleCommonInputChange(e))} />
                                            <div className="invalid-feedback"
                                                 style={this.state.error.catatan !== "" ? {display: 'block'} : {display: 'none'}}>
                                                {this.state.error.catatan}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div style={{overflowX: "auto",zoom:"80%"}}>
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
                                                    <th style={columnStyle}>Qty Barang Paket</th>
                                                </tr>
                                                </thead>

                                                <tbody>
                                                {
                                                    this.state.databrg.map((item, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td style={columnStyle}>{index+1}</td>

                                                                <td style={columnStyle}>
                                                                    <a href="about:blank" className='btn btn-danger btn-sm' onClick={(e) => this.HandleRemove(e, item.id)}><i className='fa fa-trash'/></a>
                                                                </td>
                                                                <td style={columnStyle}>{item.kd_brg}</td>
                                                                <td style={columnStyle}>{item.barcode}</td>
                                                                <td style={columnStyle}>{item.nm_brg}</td>
                                                                <td style={columnStyle}>{item.satuan}</td>
                                                                <td style={columnStyle}><input style={{textAlign:"right"}} readOnly={true} type='text' name='harga_beli' value={toRp(parseInt(item.harga_beli,10))} className="form-control"/></td>
                                                                <td style={columnStyle}><input style={{textAlign:"right"}} readOnly={true} type='text' name='stock' value={item.stock} className="form-control"/></td>
                                                                <td style={columnStyle}>
                                                                    <input style={{textAlign:"right"}} type='text' name='qty_adjust' onBlur={(e) => this.HandleChangeInput(e, item.barcode)} onChange={(e) => this.HandleChangeInputValue(e, index)} value={
                                                                        parseFloat(this.state.brgval[index].qty_adjust) <= 0 ?0:this.state.brgval[index].qty_adjust
                                                                    }  className="form-control"/>
                                                                    {
                                                                        parseFloat(this.state.brgval[index].qty_adjust) <= 0 ? (<small style={{fontWeight:"bold",color:"red"}}>Qty Tidak boleh 0</small>) : ""
                                                                    }
                                                                    {
                                                                        parseFloat(this.state.brgval[index].qty_adjust) > parseFloat(item.stock) ? (<small style={{fontWeight:"bold",color:"red"}}>Qty melebihi stock sistem</small>) : ""
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </MobileView>

                </div>
            </Layout>
        );
    }
}


const mapStateToPropsCreateItem = (state) => ({
    auth:state.auth,
    // barang: state.productReducer.result_brg,
    loadingbrg: state.productReducer.isLoadingBrg,
    nota:state.produksiReducer.code,
    barangBahan:state.produksiReducer.dataBahan,
    barangPaket:state.produksiReducer.dataPaket,
    isLoading:state.produksiReducer.isLoading,
});

export default connect(mapStateToPropsCreateItem)(Produksi);