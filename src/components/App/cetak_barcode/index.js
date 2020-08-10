import React,{Component} from 'react';
import {store,get, update,destroy,cekData,del} from "components/model/app.model";
import connect from "react-redux/es/connect/connect";
import Select from "react-select";
import Swal from "sweetalert2";
import {Scrollbars} from "react-custom-scrollbars";
import {FetchCodeAdjustment, storeAdjusment} from "redux/actions/adjustment/adjustment.action";
import {FetchBrgSame} from "redux/actions/masterdata/product/product.action";
import Layout from "../Layout";
import {storeCetakBarcode} from "../../../redux/actions/site.action";
import ModalCetakBarcode from "../modals/modal_cetak_barcode";
import {ModalToggle, ModalType} from "../../../redux/actions/modal.action";
import moment from "moment";
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

const table='cetak_barcode';
class CetakBarcode extends Component{
    constructor(props) {
        super(props);
        this.state={
            data_barcode:"",
            databrg: [],
            brgval:[],
            location_data:[],
            location:"",
            searchby:"",
            search:"",
            userid:0,
            error:{
                location:"",
            },
        }
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.HandleCommonInputChange=this.HandleCommonInputChange.bind(this);
        this.HandleSearch=this.HandleSearch.bind(this);
        this.HandleAddBrg=this.HandleAddBrg.bind(this);
        this.HandleRemove=this.HandleRemove.bind(this);
        this.HandleReset=this.HandleReset.bind(this);
        this.HandleChangeInputValue=this.HandleChangeInputValue.bind(this);
        this.HandleChangeInput=this.HandleChangeInput.bind(this);
        this.HandleSubmit=this.HandleSubmit.bind(this);

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
    componentDidMount(){
        if(localStorage.lk!==undefined&&localStorage.lk!==''){
            this.setState({
                location:localStorage.lk
            })
        }
        if (localStorage.lk!==undefined&&localStorage.lk!=='') {
            this.props.dispatch(FetchBrgSame(1, 'barcode', '', localStorage.lk, null, this.autoSetQty));
        }
    }
    componentWillReceiveProps = (nextProps) => {
        this.getProps(nextProps);
    }

    componentWillMount(){
        this.getProps(this.props);
    }

    HandleChangeLokasi(lk){
        let err = Object.assign({}, this.state.error, {
            location: ""
        });
        this.setState({
            location: lk.value,
            error: err
        })
        localStorage.setItem('lk', lk.value);
        this.props.dispatch(FetchBrgSame(1, 'barcode', '', lk.value, null, this.autoSetQty));
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
            if(parseInt(this.state.searchby)===1 || this.state.searchby===""){
                this.props.dispatch(FetchBrgSame(1, 'kd_brg', this.state.search, this.state.location, null, this.autoSetQty));
            }
            if(parseInt(this.state.searchby)===2){
                this.props.dispatch(FetchBrgSame(1, 'barcode', this.state.search, this.state.location, null, this.autoSetQty));

            }
            if(parseInt(this.state.searchby)===3){
                this.props.dispatch(FetchBrgSame(1, 'deskripsi', this.state.search, this.state.location, null, this.autoSetQty));

            }
            this.setState({search: ''});

        }
    }
    HandleAddBrg(e,item) {
        e.preventDefault();
        console.log(item);
        const finaldt = {
            barcode:item.barcode,
            title:item.title,
            harga_jual:item.harga_jual,
            qty:parseInt(item.qty)+1,
        };
        const cek = cekData('barcode',item.barcode,table);
        cek.then(res => {
            if(res==undefined){
                store(table, finaldt)
            }else{
                update(table,{
                    id:res.id,
                    barcode:res.barcode,
                    title:res.title,
                    harga_jual:res.harga_jual,
                    qty:parseInt(res.qty)+1,
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
                            let parseData={};
                            let barcode = 'barcode, title, harga_jual\n';
                            res.map(item => {
                                for(let i=0;i<parseInt(item.qty);i++){
                                    barcode += item.barcode + ', ' + item.title + ', '+item.harga_jual
                                    barcode +='\n'
                                }
                                detail.push({
                                    "barcode": item.barcode,
                                    "title": item.title,
                                    "harga_jual": item.harga_jual,
                                    "qty": item.qty,
                                })
                            });
                            this.setState({
                                data_barcode:barcode
                            })
                            parseData['data'] = detail;
                            this.downloadTxtFile(barcode);
                            // this.props.dispatch(ModalToggle(true));
                            // this.props.dispatch(ModalType("modal_cetak_barcode"));

                            Swal.fire({
                                title: 'Apakah Anda Akan Membuka Aplikasi Pencetak Barcode?',
                                text: "buka dan import file txt, dan masukan ke aplikasi pencetak barcode ini",
                                icon: 'success',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Ya, Simpan!',
                                cancelButtonText: 'Tidak!'
                            }).then((result) => {
                                if (result.value) {
                                    // window.location.reload();
                                    localStorage.removeItem('lk');

                                    destroy('cetak_barcode');
                                    this.getData();
                                    const win = window.open("NetindoAppBartend:",'_blank');
                                    if (win != null) {
                                        win.focus();
                                    }
                                }else{
                                    window.location.reload();
                                    localStorage.removeItem('lk');
                                    destroy('cetak_barcode');
                                }
                            })
                        }
                    })
                }
            })
        }

    }
    dateOnlyCode() {
        return moment(new Date()).format("YYYYMMDD");
    }
    intRand(limit, char = '0123456789') {
        let result           = '';
        let characters = char;
        const charactersLength = characters.length;
        for ( var i = 0; i < limit; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    downloadTxtFile = (data) => {
        const element = document.createElement("a");
        const file = new Blob([data], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `barcode_barang_${this.dateOnlyCode()}${this.intRand(2)}.txt`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
        // console.log("ELEMENT CLICK",element.click());
    }
    autoSetQty(kode,data){
        const cek = cekData('barcode', kode, table);
        return cek.then(res => {
            if (res == undefined) {
                store(table, {
                    barcode:data[0].barcode,
                    title:data[0].title,
                    harga_jual:data[0].harga_jual,
                    qty:data[0].qty,
                })
            } else {
                update(table, {
                    id: res.id,
                    barcode:res.barcode,
                    title:data[0].title,
                    harga_jual:data[0].harga_jual,
                    qty:parseFloat(res.qty) + 1,
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
                    qty: i.qty,
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
            <Layout page="Cetak Barcode">
                <div className="card">
                    <div className="card-header">
                        <h4>Cetak Barcode</h4>
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
                                            berdasarkan {parseInt(this.state.searchby) == 1 ? 'Kode Barang' : (parseInt(this.state.searchby) === 2 ? 'Barcode' : 'Deskripsi')}
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
                                                                        title:i.nm_brg,
                                                                        harga_jual:i.harga,
                                                                        qty:0,
                                                                    })}>
                                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png" alt="avatar" />
                                                                        <div className="about">
                                                                            <div className="status" style={{color: 'red',fontWeight:"bold"}}><small>{i.nm_brg}</small></div>
                                                                            <div className="status" style={{color: 'red',fontWeight:"bold"}}><small>{i.barcode}</small></div>
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
                                        <div className="col-md-12">
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

                                        <div className="table-responsive" style={{overflowX: "auto",zoom:"80%"}}>
                                            <table className="table table-hover">
                                                <thead>
                                                <tr>
                                                    <th style={columnStyle}>#</th>
                                                    <th style={columnStyle}>barcode</th>
                                                    <th style={columnStyle}>Title</th>
                                                    <th style={columnStyle}>Harga Jual</th>
                                                    <th style={columnStyle}>Qty</th>
                                                </tr>
                                                </thead>

                                                <tbody>
                                                {
                                                    this.state.databrg.map((item, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td style={columnStyle}>
                                                                    <a href="#" className='btn btn-danger btn-sm'
                                                                       onClick={(e) => this.HandleRemove(e, item.id)}><i
                                                                        className='fa fa-trash'/></a>
                                                                </td>
                                                                <td style={columnStyle}>{item.barcode}</td>
                                                                <td style={columnStyle}>{item.title}</td>
                                                                <td style={columnStyle}>{item.harga_jual}</td>
                                                                <td style={columnStyle}>
                                                                    <input type='text' name='qty' onBlur={(e) => this.HandleChangeInput(e, item.barcode)} onChange={(e) => this.HandleChangeInputValue(e, index)} value={this.state.brgval[index].qty}  className="form-control"/>
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
                                        <a href="#" onClick={(e)=>this.HandleSubmit(e)} className="btn btn-primary ml-1">Simpan</a>
                                        <a href="#" onClick={(e)=>this.HandleReset(e)} className="btn btn-danger ml-1">Reset</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ModalCetakBarcode getLink={this.props.get_link} dataBarcode={this.state.data_barcode}/>
            </Layout>
        );
    }
}


const mapStateToPropsCreateItem = (state) => ({
    auth:state.auth,
    barang: state.productReducer.result_brg,
    loadingbrg: state.productReducer.isLoadingBrg,
    get_link:state.siteReducer.get_link
});

export default connect(mapStateToPropsCreateItem)(CetakBarcode);