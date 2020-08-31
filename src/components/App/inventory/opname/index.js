import React,{Component} from 'react';
import {store,get, update,destroy,cekData,del} from "components/model/app.model";
import connect from "react-redux/es/connect/connect";
import Layout from "../../Layout";
import Select from "react-select";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import {FetchBrg} from "../../../../redux/actions/masterdata/product/product.action";
import {Scrollbars} from "react-custom-scrollbars";
import moment from "moment";
import {storeOpname} from "../../../../redux/actions/inventory/opname.action";
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

const table='opname';
class TrxOpname extends Component{
    constructor(props) {
        super(props);
        this.state={
            databrg: [],
            brgval:[],
            location_data:[],
            location:"",
            catatan:'-',
            tgl_order: new Date(),
            searchby:"",
            search:"",
            userid:0,
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

    }
    componentDidMount(){
        if(localStorage.location_opname!==undefined&&localStorage.location_opname!==''){
            this.setState({
                location:localStorage.location_opname
            })

        }
        if (localStorage.location_opname!==undefined&&localStorage.location_opname!=='') {
            this.props.dispatch(FetchBrg(1, 'barcode', '', localStorage.location_opname, null, this.autoSetQty));
        }
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
        if(param.barang.length>0){
            this.getData();
        }
    }
    componentWillReceiveProps = (nextProps) => {
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
            error: err
        })
        localStorage.setItem('location_opname', lk.value);
        this.props.dispatch(FetchBrg(1, 'barcode', '', lk.value, null, this.autoSetQty));
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
            qty_fisik:parseInt(item.qty_fisik,10)+1,
        };
        const cek = cekData('kd_brg',item.kd_brg,table);
        cek.then(res => {
            if(res==undefined){
                store(table, finaldt)
            }else{
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
                    qty_fisik:parseInt(res.qty_fisik,10)+1,
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
                this.getData();

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
                localStorage.removeItem("location_opname");
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
            if (res == undefined) {
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
                update(table, final);
                Toast.fire({
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
                if (res.length==0){
                    Swal.fire(
                        'Error!',
                        'Pilih barang untuk melanjutkan Opname.',
                        'error'
                    )
                }else{
                    Swal.fire({
                        title: 'Simpan Opname?',
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
                            let data={};
                            data['kd_kasir'] = this.state.userid;
                            data['tgl'] = moment(this.state.tgl_order).format("yyyy-MM-DD");
                            data['lokasi'] = this.state.location;
                            res.map(item => {
                                detail.push({
                                    "kd_brg": item.kd_brg,
                                    "qty_fisik": item.qty_fisik,
                                    "stock_terakhir": item.stock,
                                    "hrg_beli": item.harga_beli,
                                    "barcode": item.barcode
                                })
                            });
                            data['detail'] = detail;
                            this.props.dispatch(storeOpname(data));
                        }
                    })
                }
            })
        }

    }
    autoSetQty(kode,data){
        const cek = cekData('kd_brg', kode, table);
        return cek.then(res => {
            if (res == undefined) {
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
                    qty_fisik:data[0].qty_fisik,
                })
            } else {
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
                    qty_fisik:parseFloat(res.qty_fisik) + 1,
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
                    qty_fisik: i.qty_fisik,
                });
            })
            this.setState({
                databrg: res,
                brgval: brg
            })
        });
    }

    render() {
        return (
            <Layout page="Opname">
                <div className="card">
                    <div className="card-header">
                        <h4>Opname</h4>
                    </div>
                    <div className="row">
                        <div className="col-md-3">
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
                                        <small
                                            id="passwordHelpBlock"
                                            className="form-text text-muted"
                                        >
                                            Cari
                                            berdasarkan {parseInt(this.state.searchby,10) == 1 ? 'Kode Barang' : (parseInt(this.state.searchby,10) === 2 ? 'Barcode' : 'Deskripsi')}
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
                                    <Scrollbars style={{ width: "100%", height: "500px", maxHeight:'100%' }}>
                                        <div className="people-list">
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
                                                                        qty_fisik:0,
                                                                    })}>
                                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png" alt="avatar" />
                                                                        <div className="about">
                                                                            <div className="status" style={{color: 'red',fontWeight:"bold"}}><small>{i.nm_brg}</small></div>
                                                                            <div className="status" style={{color: 'red',fontWeight:"bold"}}><small>{i.nm_brg}</small></div>
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
                        <div className="col-md-9">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="control-label font-12">
                                                    Tanggal Order
                                                </label>
                                                <div className="input-group">
                                                    <DatePicker
                                                        className="form-control rounded-right"
                                                        selected={this.state.tgl_order}
                                                        onChange={this.setTglOrder}
                                                    />
                                                </div>
                                            </div>


                                        </div>
                                        <div className="col-md-6">

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
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Kode</th>
                                                    <th>barcode</th>
                                                    <th>Nama</th>
                                                    <th>Satuan</th>
                                                    <th>Stock Sistem</th>
                                                    <th>Stock Fisik</th>
                                                </tr>
                                                </thead>

                                                <tbody>
                                                {
                                                    this.state.databrg.map((item, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>
                                                                    <a href="about:blank" className='btn btn-danger btn-sm'
                                                                       onClick={(e) => this.HandleRemove(e, item.id)}><i
                                                                        className='fa fa-trash'/></a>
                                                                </td>
                                                                <td>{item.kd_brg}</td>
                                                                <td>{item.barcode}</td>
                                                                <td>{item.nm_brg}</td>
                                                                <td>{item.satuan}</td>
                                                                <td><input readOnly={true} type='text' name='stock' value={item.stock} className="form-control"/></td>
                                                                <td><input type='text' name='qty_fisik' onBlur={(e) => this.HandleChangeInput(e, item.barcode)} onChange={(e) => this.HandleChangeInputValue(e, index)} value={this.state.brgval[index].qty_fisik} className="form-control"/></td>
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
                    </div>
                </div>
            </Layout>
        );
    }
}


const mapStateToPropsCreateItem = (state) => ({
    auth:state.auth,
    barang: state.productReducer.result_brg,
    loadingbrg: state.productReducer.isLoadingBrg
});

export default connect(mapStateToPropsCreateItem)(TrxOpname);