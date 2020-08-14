import React,{Component} from 'react';
import {store,get, update,destroy,cekData,del} from "components/model/app.model";
import connect from "react-redux/es/connect/connect";
import Layout from "../../Layout";
import Select from "react-select";
import Swal from "sweetalert2";
import {FetchBrg} from "redux/actions/masterdata/product/product.action";
import {Scrollbars} from "react-custom-scrollbars";
import moment from "moment";
import {FetchCodeAdjustment} from "redux/actions/adjustment/adjustment.action";
import {toRp} from "helper";
import {FetchCodeProduksi, storeProduksi} from "redux/actions/inventory/produksi.action";
import {
    FetchBrgProduksi,
    FetchBrgProduksiBahan,
    FetchBrgProduksiPaket
} from "../../../../redux/actions/inventory/produksi.action";
import {ToastQ} from "helper";
import {FetchAlokasi} from "../../../../redux/actions/inventory/alokasi.action";
import {FetchBrgPacking, FetchCodePacking, storePacking} from "../../../../redux/actions/inventory/packing.action";


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
                })
                this.setState({
                    location_data: lk,
                    userid: param.auth.user.id
                })
            }
        }
        if(param.codeAlokasi.data!==undefined){
            let no_faktur=[];
            typeof param.codeAlokasi.data === 'object' ? param.codeAlokasi.data.map((v,i)=>{
                no_faktur.push({
                    value:v.no_faktur_mutasi,
                    label:v.no_faktur_mutasi,
                })
            }): "No data.";
            this.setState({
                faktur_alokasi_data:no_faktur
            })
        }
        typeof param.barang.detail === 'object' ? param.barang.detail.length > 0 ? this.getData() : "" : "";
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
    }
    componentWillReceiveProps = (nextProps) => {
        this.getProps(nextProps);
    }


    componentWillMount(){
        this.getProps(this.props);
        this.props.dispatch(FetchCodePacking());
        this.props.dispatch(FetchAlokasi(1,'&status=0&perpage=1000'));
    }
    handleChangeFakturAlokasi(lk){
        let err = Object.assign({}, this.state.error, {
            faktur_alokasi: ""
        });
        this.setState({
            faktur_alokasi: lk.value,
            error: err
        });
        this.props.dispatch(FetchBrgPacking(lk.value,this.autoSetQty));

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

    }
    HandleChangeInput(e,id){
        const column = e.target.name;
        const val = e.target.value;
        if(id!==null){
            const cek = cekData('barcode', id, table);
            cek.then(res => {
                if (res == undefined) {
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
                if (res.length==0){
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
                            });
                            data['detail'] = detail;
                            this.props.dispatch(storePacking(data));
                        }
                    })


                }
            })
        }


    }
    autoSetQty(kode,data){
        const cek = cekData('kode_barang', kode, table);
        return cek.then(res => {
            if (res == undefined) {
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
                    qty_packing:parseInt(res.qty_packing)+1,
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
                                                            let qty_packing = parseInt(this.state.brgval[index].qty_packing)>parseInt(item.qty_alokasi)?parseInt(item.qty_alokasi):this.state.brgval[index].qty_packing;
                                                            console.log(qty_packing);
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
                                                                                    <option value={i.satuan} selected={i.satuan == item.satuan}>{i.satuan}</option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </select></td>
                                                                    <td style={columnStyle}><input readOnly={true} type='text' name='harga_beli' value={toRp(parseInt(item.harga_beli))} className="form-control"/></td>
                                                                    <td style={columnStyle}><input readOnly={true} type='text' name='stock' value={item.stock} className="form-control"/></td>
                                                                    <td style={columnStyle}><input readOnly={true} type='text' name='qty_alokasi' value={item.qty_alokasi} className="form-control"/></td>
                                                                    <td style={columnStyle}>
                                                                        <input type='text' name='qty_packing' onBlur={(e) => this.HandleChangeInput(e, item.barcode)} onChange={(e) => this.HandleChangeInputValue(e, index)} className="form-control" value={qty_packing}/>

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

export default connect(mapStateToPropsCreateItem)(TrxPacking);