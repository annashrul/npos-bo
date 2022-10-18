import React,{Component} from 'react';
import {store,get, update,destroy,cekData,del} from "components/model/app.model";
import connect from "react-redux/es/connect/connect";
import Layout from "../../Layout";
import Select from "react-select";
import Swal from "sweetalert2";
import moment from "moment";
import {toRp} from "helper";
import {ToastQ} from "helper";
import {FetchAlokasi} from "../../../../redux/actions/inventory/alokasi.action";
import {FetchBrgPacking, FetchCodePacking, storePacking} from "../../../../redux/actions/inventory/packing.action";
import StickyBox from "react-sticky-box";
import {
    withRouter
} from 'react-router-dom';


const table='packing';
class TrxPacking extends Component{
    constructor(props) {
        super(props);
        this.state={
            no_packing:'',
            databrg: [],
            brgval:[],
            faktur_alokasi_data:[],
            faktur_alokasi:"",
            penerima:"",
            tanggal: moment(new Date()).format('yyyy-MM-DD'),
            searchby:"",
            search:"",
            userid:0,
            error:{
                penerima:"",
                faktur_alokasi:''
            },
        }
        this.handleChangeFakturAlokasi=this.handleChangeFakturAlokasi.bind(this);
        this.HandleCommonInputChange=this.HandleCommonInputChange.bind(this);
        this.HandleRemove=this.HandleRemove.bind(this);
        this.HandleReset=this.HandleReset.bind(this);
        this.HandleChangeInputValue=this.HandleChangeInputValue.bind(this);
        this.HandleChangeInput=this.HandleChangeInput.bind(this);

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
        if(param.codeAlokasi.data!==undefined){
            let no_faktur=[];
            if(typeof param.codeAlokasi.data === 'object'){
                param.codeAlokasi.data.map((v)=>{
                    no_faktur.push({
                        value:v.no_faktur_mutasi,
                        label:v.no_faktur_mutasi,
                    })
                    return null;
                })
            }
            // (typeof param.codeAlokasi.data === 'object') ? param.codeAlokasi.data.map((v)=>{
            //     no_faktur.push({
            //         value:v.no_faktur_mutasi,
            //         label:v.no_faktur_mutasi,
            //     })
            //     return null;
            // }): "No data.";
            this.setState({
                faktur_alokasi_data:no_faktur
            })
        }
        // typeof param.barang.detail === 'object' ? param.barang.detail.length > 0 ? this.getData() : "" : "";


        this.setState({
            no_packing:this.props.code
        })
    }
    componentDidMount(){
        this.getData();
        if (localStorage.faktur_alokasi_packing !== undefined && localStorage.faktur_alokasi_packing !== '') {
            this.setState({
                faktur_alokasi: localStorage.faktur_alokasi_packing
            })
            this.props.dispatch(FetchBrgPacking(localStorage.faktur_alokasi_packing,this.autoSetQty));
        }
        if (localStorage.penerima_packing !== undefined && localStorage.penerima_packing !== '') {
            this.setState({
                penerima: localStorage.penerima_packing
            })
        }
        this.props.dispatch(FetchAlokasi(1,'&status=0&perpage=1000'));
    }
    componentWillReceiveProps = (nextProps) => {
        this.getProps(nextProps);
        
        if(nextProps.barang.length!==0){
            
            nextProps.dispatch(FetchCodePacking(nextProps.barang.length===0?'':nextProps.barang.master.kd_lokasi_1));
            this.setState({
                no_packing:nextProps.code
            })
            
            const data = this.props;
            
            if(this.state.faktur_alokasi!==''){
                
                if (data.barang.detail){
                    destroy(table)
                    data.barang.detail.map(item=>{
                        const datas = {
                            barcode: item.barcode,
                            harga_beli: item.harga_beli,
                            harga_jual: item.harga_jual,
                            kode_barang: item.kode_barang,
                            nm_brg: item.nm_brg,
                            qty_alokasi: item.qty,
                            qty_packing: item.qty,
                            satuan: item.satuan,
                            stock: item.stock,
                            tambahan: item.tambahan,
                        };
                        store(table, datas)
                        this.getData();
                        return null;
                    })
                }
            } else {
                
                destroy(table)
            }
        }
        
    }
    componentWillMount(){
        this.getProps(this.props);
        // this.props.dispatch(FetchCodePacking());
    }

    componentWillUnmount(){
        
        destroy(table);
        this.setState({faktur_alokasi:'',no_packing:'',faktur_alokasi_data:[]})
        localStorage.removeItem('faktur_alokasi_packing')
    }
    handleChangeFakturAlokasi(lk){
        destroy(table);
        this.getData();
        let err = Object.assign({}, this.state.error, {
            faktur_alokasi: ""
        });
        this.setState({
            faktur_alokasi: lk.value,
            error: err
        });
        this.props.dispatch(FetchBrgPacking(lk.value,this.autoSetQty));
        // for(let i=0;i>this.props.barang.length;i++){

        // }
        const param = this.props;
        if (param.barang.detail){
            destroy(table)
            param.barang.detail.map(item=>{
                const datas = {
                    barcode: item.barcode,
                    harga_beli: item.harga_beli,
                    harga_jual: item.harga_jual,
                    kode_barang: item.kode_barang,
                    nm_brg: item.nm_brg,
                    qty_alokasi: item.qty,
                    qty_packing: item.qty,
                    satuan: item.satuan,
                    stock: item.stock,
                    tambahan: item.tambahan,
                };
                store(table, datas)
                this.getData();
                return null;
            })
        }
        
        // this.props.dispatch(FetchCodePacking());
        localStorage.setItem('faktur_alokasi_packing', lk.value);
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
                localStorage.removeItem('faktur_alokasi_packing');
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

                        barcode:res.barcode,
                        harga_beli:newbrg.harga_beli,
                        harga_jual:res.harga_jual,
                        kode_barang: res.kode_barang,
                        nm_brg:res.nm_brg,
                        qty_alokasi:res.qty_alokasi,
                        qty_packing:res.qty_packing,
                        satuan:res.satuan,
                        stock:res.stock,
                        tambahan:res.tambahan,
                    }
                    update(table, final);
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
        if(id!==null){
            const cek = cekData('barcode', id, table);
            cek.then(res => {
                if (res === undefined) {
                    ToastQ.fire({
                        icon: 'error',
                        title: `not found.`
                    })
                    // Toast.fire({
                    //     icon: 'error',
                    //     title: `not found.`
                    // })
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
        }else{
            if(column==='penerima'){
                localStorage.setItem("penerima_packing",val);
            }
        }


    }
    HandleSubmit(e){
        e.preventDefault();
        let err = this.state.error;
        if(this.state.faktur_alokasi === ""){
            err = Object.assign({}, err, {faktur_alokasi:"faktur alokasi tidak boleh kosong."});
            this.setState({error: err})
        }
        else if(this.state.penerima === ""){
            err = Object.assign({}, err, {penerima:"penerima tidak boleh kosong."});
            this.setState({error: err})
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
                    Swal.fire({allowOutsideClick: false,
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
                            let data={};
                            data['kode'] = this.state.no_packing;
                            data['tanggal'] = this.state.tanggal;
                            data['pengirim'] = this.state.penerima;
                            data['userid'] = this.state.userid;
                            data['no_faktur_mutasi'] = this.state.faktur_alokasi;
                            data['jmlbox'] = 0;
                            res.map(item => {
                                detail.push({
                                    "kd_brg": item.kode_barang,
                                    "barcode": item.barcode,
                                    "satuan": item.satuan,
                                    "qty": item.qty_packing,
                                })
                                return null;
                            });
                            data['detail'] = detail;
                            let parsedata={};
                            parsedata['detail'] = data;
                            parsedata['master'] = this.state.databrg;
                            parsedata['nota'] = this.props.code;
                            parsedata['logo'] = this.props.auth.user.logo;
                            parsedata['user'] = this.props.auth.user.username;
                            
                            this.props.dispatch(storePacking(parsedata,(arr)=>this.props.history.push(arr)));
                            
                            destroy(table);
                            this.setState({faktur_alokasi:''})
                            localStorage.removeItem('faktur_alokasi_packing')
                        }
                    })


                }
            })
        }


    }
    HandleAddBrg(e,item) {
        e.preventDefault();
        const finaldt = {
            barcode:item.barcode,
            harga_beli:item.harga_beli,
            harga_jual:item.harga_jual,
            kode_barang: item.kode_barang,
            nm_brg:item.nm_brg,
            qty_alokasi:item.qty_alokasi,
            qty_packing:item.qty_alokasi,
            satuan:item.satuan,
            stock:item.stock,
            tambahan:item.tambahan,
        };
        const cek = cekData('kode_barang',item.kode_barang,table);
        cek.then(res => {
            if(res===undefined){
                store(table, finaldt)
            }else{
                update(table,{
                    id:res.id,
                    barcode:res.barcode,
                    harga_beli:res.harga_beli,
                    harga_jual:res.harga_jual,
                    kode_barang: res.kode_barang,
                    nm_brg:res.nm_brg,
                    qty_alokasi:res.qty_alokasi,
                    qty_packing:parseFloat(res.qty_packing)+1,
                    satuan:res.satuan,
                    stock:res.stock,
                    tambahan:res.tambahan,

                    //
                    // kd_brg: res.kd_brg,
                    // nm_brg:res.nm_brg,
                    // barcode:res.barcode,
                    // satuan:res.satuan,
                    // deskripsi:res.deskripsi,
                    // kondisi:res.kondisi,
                    // stock:res.stock,
                    // ppn:res.ppn,
                    // harga_beli:res.harga_beli,
                    // ket:res.ket,
                    // qty_retur:parseFloat(res.qty_retur)+1,
                    // tambahan:res.tambahan
                })
            }


            this.getData()
        })
    }
    autoSetQty(kode,data){
        const cek = cekData('kode_barang', kode, table);
        return cek.then(res => {
            if (res === undefined) {
                store(table, {
                    qty_alokasi:data[0].qty,
                    kode_barang:data[0].kode_barang,
                    harga_beli:data[0].harga_beli,
                    harga_jual:data[0].harga_jual,
                    barcode:data[0].barcode,
                    satuan:data[0].satuan,
                    stock:data[0].stock,
                    nm_brg:data[0].nm_brg,
                    qty_packing:0,
                    tambahan:data[0].tambahan
                })
            } else {
                update(table, {
                    id:res.id,
                    qty_alokasi:res.qty_alokasi,
                    kode_barang:res.kode_barang,
                    harga_beli:res.harga_beli,
                    harga_jual:res.harga_jual,
                    barcode:res.barcode,
                    satuan:res.satuan,
                    stock:res.stock,
                    nm_brg:res.nm_brg,
                    qty_packing:parseInt(res.qty_packing,10)+1,
                    tambahan:res.tambahan
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
                    qty_packing: i.qty_packing,
                });
                return null;
            })
            this.setState({
                databrg: res,
                brgval: brg
            })
        });
    }
    render() {
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        return (
            <Layout page="Transaksi Packing">
                <div className="card">
                    <div className="card-header">
                        <h4>Transaksi Packing</h4>
                    </div>
                    <div className="row">
                        {/*START RIGHT*/}
                        <div className="col-md-12">
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
                                                                        berdasarkan {parseInt(this.state.searchby,10) === 1 ? 'Kode Barang' : (parseInt(this.state.searchby,10) === 2 ? 'Barcode' : 'Deskripsi')}
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
                                                                    this.props.barang.detail!==undefined?this.props.barang.detail.length !== 0 ?
                                                                        this.props.barang.detail.map((i, inx) => {
                                                                            return (
                                                                                <li className="clearfix" key={inx}
                                                                                    onClick={(e) => this.HandleAddBrg(e, {
                                                                                        barcode: i.barcode,
                                                                                        harga_beli:i.harga_beli,
                                                                                        harga_jual:i.harga_jual,
                                                                                        kode_barang:i.kode_barang,
                                                                                        nm_brg:i.nm_brg,
                                                                                        qty_alokasi:i.qty,
                                                                                        qty_packing:i.qty,
                                                                                        satuan:i.satuan,
                                                                                        stock:i.stock,
                                                                                        tambahan:i.tambahan,

                                                                                    })}>
                                                                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png" alt="avatar"/>
                                                                                    <div className="about">
                                                                                        <div className="status"><small>{i.nm_brg.toLowerCase()}</small></div>
                                                                                        <div className="status"><small>{i.kode_barang.toLowerCase()}</small></div>
                                                                                    </div>
                                                                                </li>
                                                                            )
                                                                        }) : (
                                                                            <div style={{
                                                                                textAlign: 'center',
                                                                                fontSize: "11px",
                                                                                fontStyle: "italic"
                                                                            }}>Barang tidak ditemukan.</div>
                                                                        ):""

                                                                }


                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </StickyBox>
                                    <div style={{width:"80%"}}>
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="row">
                                                            <div className="col-md-3">
                                                                <div className="form-group">
                                                                    <label htmlFor="">No. Packing</label>
                                                                    <input type="text" readOnly className="form-control" style={{fontWeight: 'bolder'}} value={this.state.no_packing}/>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <div className="form-group">
                                                                    <label className="control-label font-12">Tanggal</label>
                                                                    <input type="date" name="tanggal" className="form-control" value={this.state.tanggal} onChange={(e => this.HandleCommonInputChange(e))}/>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <div className="form-group">
                                                                    <label className="control-label font-12">No. Faktur Alokasi</label>
                                                                    <Select options={this.state.faktur_alokasi_data} placeholder="Pilih" onChange={this.handleChangeFakturAlokasi} value={this.state.faktur_alokasi_data.find(op => {return op.value === this.state.faktur_alokasi})}/>
                                                                    <div className="invalid-feedback"
                                                                         style={this.state.error.faktur_alokasi !== "" ? {display: 'block'} : {display: 'none'}}>
                                                                        {this.state.error.faktur_alokasi}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <div className="form-group">
                                                                    <label className="control-label font-12">Penerima</label>
                                                                    <input type="text" name="penerima" className="form-control" value={this.state.penerima} onChange={(e => this.HandleCommonInputChange(e))} onBlur={(e) => this.HandleChangeInput(e, null)}/>
                                                                    <div className="invalid-feedback"
                                                                         style={this.state.error.penerima !== "" ? {display: 'block'} : {display: 'none'}}>
                                                                        {this.state.error.penerima}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="table-responsive" style={{overflowX: "auto",zoom:"80%"}}>
                                                            <table className="table table-hover">
                                                                <thead>
                                                                <tr>
                                                                    <th style={columnStyle}>#</th>
                                                                    <th style={columnStyle}>Kode</th>
                                                                    <th style={columnStyle}>barcode</th>
                                                                    <th style={columnStyle}>Nama</th>
                                                                    <th style={columnStyle}>Satuan</th>
                                                                    <th style={columnStyle}>Harga Beli</th>
                                                                    <th style={columnStyle}>Stock Sistem</th>
                                                                    <th style={columnStyle}>Qty Alokasi</th>
                                                                    <th style={columnStyle}>Qty Packing</th>
                                                                </tr>
                                                                </thead>

                                                                <tbody>
                                                                {
                                                                    this.state.databrg.map((item, index) => {

                                                                        return (
                                                                            <tr key={index}>
                                                                                <td style={columnStyle}>
                                                                                    <a href="about:blank" className='btn btn-danger btn-sm'
                                                                                       onClick={(e) => this.HandleRemove(e, item.id)}><i
                                                                                        className='fa fa-trash'/></a>
                                                                                </td>
                                                                                <td style={columnStyle}>{item.kode_barang}</td>
                                                                                <td style={columnStyle}>{item.barcode}</td>
                                                                                <td style={columnStyle}>{item.nm_brg}</td>
                                                                                <td style={columnStyle}><select className="form-control" name='satuan' style={{width:"100px"}} onChange={(e) => this.HandleChangeInputValue(e, index, item.barcode, item.tambahan)}>
                                                                                    {
                                                                                        item.tambahan.map(i => {
                                                                                            return (
                                                                                                <option value={i.satuan} selected={i.satuan === item.satuan}>{i.satuan}</option>
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </select></td>
                                                                                <td style={columnStyle}><input readOnly={true} type='text' name='harga_beli' value={toRp(parseInt(item.harga_beli,10))} className="form-control"/></td>
                                                                                <td style={columnStyle}><input readOnly={true} type='text' name='stock' value={item.stock} className="form-control"/></td>
                                                                                <td style={columnStyle}><input readOnly={true} type='text' name='qty_alokasi' value={item.qty_alokasi} className="form-control"/></td>
                                                                                <td style={columnStyle}>
                                                                                    <input type='text' name='qty_packing' onBlur={(e) => this.HandleChangeInput(e, item.barcode)} onChange={(e) => this.HandleChangeInputValue(e, index)} className="form-control" value={parseInt(this.state.brgval[index].qty_packing,10)>parseInt(item.qty_alokasi,10)?parseInt(item.qty_alokasi,10):parseInt(this.state.brgval[index].qty_packing,10)}/>
                                                                                    {
                                                                                        parseInt(this.state.brgval[index].qty_packing,10)>parseInt(item.qty_alokasi,10)?<small style={{color:'red'}}>Qty Packing Tidak Boleh Melebihi Qty Alokasi</small>:''
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
                                            <div className="card-header">
                                                <div className="dashboard-btn-group d-flex align-items-center">
                                                    <a href="about:blank" onClick={(e)=>this.HandleSubmit(e)} className="btn btn-primary ml-1">Simpan</a>
                                                    <a href="about:blank" onClick={(e)=>this.HandleReset(e)} className="btn btn-danger ml-1">Reset</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        {/*END RIGHT*/}
                    </div>
                </div>
            </Layout>
        );
    }
}


const mapStateToPropsCreateItem = (state) => ({
    auth:state.auth,
    barang: state.packingReducer.data,
    loading: state.packingReducer.isLoading,
    code:state.packingReducer.code,
    codeAlokasi:state.alokasiReducer.data
});

export default withRouter(connect(mapStateToPropsCreateItem)(TrxPacking));