import React,{Component} from 'react'
import connect from "react-redux/es/connect/connect";
import Layout from "../../Layout";
import Select from "react-select";
import moment from "moment";
import {FetchBrgPackingTrx} from "redux/actions/inventory/packing.action";
import Swal from "sweetalert2";
import {storeExpedisi} from "redux/actions/inventory/expedisi.action";
import {
    withRouter
} from 'react-router-dom';

class Expedisi extends Component{
    constructor(props) {
        super(props);
        this.state={
            userid:0,
            location1:"",
            location2:"",
            location_val:"",
            location2_val:"",
            location_data:[],
            tanggal:moment(new Date()).format("yyyy-MM-DD"),
            pengirim:'',
            catatan:'',
            search:'',
            brgVal:[],
            error:{
                location1:"",
                location2:"",
                pengirim:"",
                catatan:"",
                search:'',
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.HandleChangeLokasi2 = this.HandleChangeLokasi2.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
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
        if(param.barang!==[]){
            if(param.barang.detail!==undefined){
                let data=[];
                let checked;

                param.barang.detail.map((v,i)=>{
                    if(localStorage.getItem(`isChecked${i}`)!==undefined){
                        if(localStorage.getItem(`isChecked${i}`)==="true"){
                            checked=true;
                        }else{
                            checked=false;
                        }
                    }
                    data.push({
                        kd_packing:v.kd_packing,
                        kode_barang: v.kode_barang,
                        qty: v.qty,
                        barcode: v.barcode,
                        satuan: v.satuan,
                        nm_brg: v.nm_brg,
                        isChecked:checked
                    })
                    return null;
                });
                this.setState({brgVal:data});
                return null;
            }
        }
    }
    componentWillReceiveProps(nextProps){
        this.getProps(nextProps);
    }
    componentWillMount(){
        this.getProps(this.props);
    }
    componentDidMount(){
        if(localStorage.search_expedisi!==undefined){
            this.props.dispatch(FetchBrgPackingTrx(localStorage.search_expedisi));
            this.setState({search:localStorage.search_expedisi})
        }
        if(localStorage.lokasi1_expedisi!==undefined){
            this.setState({location1:localStorage.lokasi1_expedisi})
        }
        if(localStorage.lokasi2_expedisi!==undefined){
            this.setState({location2:localStorage.lokasi2_expedisi})
        }
    }
    handleChange(e){
        const column = e.target.name;
        const val = e.target.value;
        this.setState({
            [column]: val
        });
        let err = Object.assign({}, this.state.error, {
            [column]: ""
        });
        this.setState({
            error: err
        });
    }
    handleChangeDynamic(event,i){
        let checked=event.target.checked;
        // 
        // this.setState({
        //     brgVal:[i].isChecked
        // })
        var brgVal = this.state.brgVal;
        brgVal[i].isChecked = checked;
        this.setState({brgVal: brgVal});
        // this.state.brgVal[i].isChecked = checked;
        // this.setState();
        checked===true?localStorage.setItem(`isChecked${i}`,"true"):localStorage.setItem(`isChecked${i}`,"false");

    }
    HandleChangeLokasi(lk) {
        let err = Object.assign({}, this.state.error, {location1: ""});
        this.setState({
            location1: lk.value,
        location_val: lk.label,
            error: err
        })
        localStorage.setItem('lokasi1_expedisi', lk.value);
    }
    HandleChangeLokasi2(sp) {
        let err = Object.assign({}, this.state.error, {location2: ""});
        this.setState({
            location2: sp.value,
        location2_val: sp.label,
            error: err
        })
        localStorage.setItem('lokasi2_expedisi', sp.value);
    }
    handleSubmit(e){
        e.preventDefault();
        let err = this.state.error;
        if(this.state.location1===''){
            err = Object.assign({}, err, {location1:"Lokasi Asal tidak boleh kosong."});
            this.setState({error:err});
        }
        else if(this.state.location2===''){
            err = Object.assign({}, err, {location2:"Lokasi Tujuan tidak boleh kosong."});
            this.setState({error:err});
        }
        else if(this.state.pengirim===''){
            err = Object.assign({}, err, {pengirim:"Pengirim tidak boleh kosong."});
            this.setState({error:err});
        }
        else if(this.state.catatan===''){
            err = Object.assign({}, err, {catatan:"catatan tidak boleh kosong."});
            this.setState({error:err});
        }
        else{
            if(this.state.brgVal.length===0){
                Swal.fire(
                    'Error!',
                    'Pilih barang untuk melanjutkan Transaksi Expedisi.',
                    'error'
                )
            }else{
                Swal.fire({allowOutsideClick: false,
                    title: 'Simpan Expedisi?',
                    text: "Pastikan data yang anda masukan sudah benar!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Ya, Simpan!',
                    cancelButtonText: 'Tidak!'
                }).then((result) => {
                    if (result.value) {
                        let parsedata={};
                        parsedata['kode'] = this.state.search;
                        parsedata['tanggal'] = moment(this.state.tanggal).format("yyyy-MM-DD");
                        parsedata['lokasi_asal'] = this.state.location1;
                        parsedata['lokasi_tujuan'] = this.state.location2;
                        parsedata['pengirim'] = this.state.pengirim;
                        parsedata['userid'] = this.state.userid;
                        parsedata['catatan'] = this.state.catatan;
                        let detail=[];
                        this.state.brgVal.map((v,i)=>{
                            if(v.isChecked===true){
                                detail.push({
                                    kd_packing:v.kd_packing,
                                    ket:'-',
                                    jml_koli:v.qty,
                                })
                            }
                            return null;
                        })
                        parsedata['detail'] = detail;
                        let newparse = {}
                        newparse['detail'] = parsedata;
                        newparse['master'] = this.state.brgVal;
                        newparse['logo'] = this.props.auth.user.logo;
                        newparse['user'] = this.props.auth.user.username;
                        newparse['lokasi_asal'] = this.state.location_val;
                        newparse['lokasi_tujuan'] = this.state.location2_val;
                        this.props.dispatch(storeExpedisi(newparse,(arr)=>this.props.history.push(arr)));
                    }
                })

            }

        }
    }
    handleReset(e){
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
                localStorage.removeItem("lokasi1_expedisi");
                localStorage.removeItem("lokasi2_expedisi");
                localStorage.removeItem("search_expedisi");
                window.location.reload(false);
            }
        })
    }
    handleSearch(){
        localStorage.setItem("search_expedisi",this.state.search);
        this.props.dispatch(FetchBrgPackingTrx(this.state.search));
    }
    render(){

        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        return (
            <Layout page={"Expedisi"}>
                <div className="card">
                    <div className="card-header">
                        <h4>Expedisi</h4>
                    </div>
                    <div className="row">
                        <div className="card-body">
                            <div className="col-md-12">
                                <div className="row">
                                    <div className="col-md-2">
                                        <label className="control-label font-12">Tanggal</label>
                                        <input type="date" name={"tanggal"} className={"form-control"} value={this.state.tanggal} onChange={this.handleChange}/>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label className="control-label font-12">Lokasi Asal</label>
                                            <Select options={this.state.location_data} placeholder="==== Pilih ====" onChange={this.HandleChangeLokasi} value = {this.state.location_data.find(op => {return op.value === this.state.location1})}/>
                                            <div className="invalid-feedback" style={this.state.error.location1!==""?{display:'block'}:{display:'none'}}>
                                                {this.state.error.location1}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label className="control-label font-12">Lokasi Tujuan</label>
                                            <Select options={this.state.location_data.filter(option => option.value !== this.state.location2)} placeholder="==== Pilih ====" onChange={this.HandleChangeLokasi2} value = {this.state.location_data.find(op => {return op.value === this.state.location2})}/>
                                            <div className="invalid-feedback" style={this.state.error.location2!==""?{display:'block'}:{display:'none'}}>
                                                {this.state.error.location2}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-2">
                                        <label className="control-label font-12">Pengirim</label>
                                        <input type="text" name={"pengirim"} className={"form-control"} value={this.state.pengirim} onChange={this.handleChange}/>
                                        <div className="invalid-feedback" style={this.state.error.pengirim!==""?{display:'block'}:{display:'none'}}>
                                            {this.state.error.pengirim}
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <label className="control-label font-12">Catatan</label>
                                        <input type="text" name={"catatan"} className={"form-control"} value={this.state.catatan} onChange={this.handleChange}/>
                                        <div className="invalid-feedback" style={this.state.error.catatan!==""?{display:'block'}:{display:'none'}}>
                                            {this.state.error.catatan}
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label className="control-label font-12">Kode Packing</label>
                                            <div className="input-group input-group-sm">
                                                <input autoFocus type="text" name="search" className="form-control form-control-sm" value={this.state.search} placeholder="Kode Packing"
                                                    onChange={this.handleChange} onKeyPress = {event => {if (event.key === 'Enter') {this.handleSearch();}}}
                                                />
                                                <span className="input-group-append">
                                                    <button type="button" style={{zIndex:0}} className="btn btn-primary" onClick = {event => {event.preventDefault();this.handleSearch();}}>
                                                        <i className="fa fa-search" />
                                                    </button>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="card-body">
                            <div className="col-md-12">
                                <table className="table table-bordered table-hover">
                                    <thead>
                                    <tr>
                                        <th style={columnStyle}>No</th>
                                        <th style={columnStyle}>#</th>
                                        <th style={columnStyle}>Kode Packing</th>
                                        <th style={columnStyle}>Kode Barang</th>
                                        <th style={columnStyle}>Barcode</th>
                                        <th style={columnStyle}>Satuan</th>
                                        <th style={columnStyle}>Nama Barang</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.brgVal.map((v,i)=>{
                                            return (
                                                <tr>
                                                    <td style={columnStyle}>{i+1}</td>
                                                    <td style={columnStyle}>
                                                        <input type="checkbox" name="isChecked" value={v.isChecked} checked={v.isChecked} onChange={(e)=>this.handleChangeDynamic(e,i)}/>
                                                    </td>
                                                    <td style={columnStyle}>{v.kd_packing}</td>
                                                    <td style={columnStyle}>{v.kode_barang}</td>
                                                    <td style={columnStyle}>{v.barcode}</td>
                                                    <td style={columnStyle}>{v.satuan}</td>
                                                    <td style={columnStyle}>{v.nm_brg}</td>
                                                </tr>
                                            );
                                        })
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="card-header">
                        <button onClick={(e) => this.handleSubmit(e)} className="btn btn-primary ml-1">Simpan</button>
                        <button onClick={(e) => this.handleReset(e)} className="btn btn-danger ml-1">Batal</button>
                    </div>
                </div>
            </Layout>
        );
    }
}
const mapStateToPropsCreateItem = (state) => ({
    barang: state.packingReducer.data_trx,
    loading: state.packingReducer.isLoading,
    auth:state.auth,
});

export default withRouter(connect(mapStateToPropsCreateItem)(Expedisi));