import React,{Component} from 'react';
import Layout from "../Layout";
import DatePicker from "react-datepicker";
import connect from "react-redux/es/connect/connect";
import Select from "react-select";
import {FetchHutang, storeHutang} from "redux/actions/hutang/hutang.action";
import moment from "moment";
import {toRp} from "helper";
import Swal from "sweetalert2";
import Preloader from "Preloader";
import {
    withRouter
} from 'react-router-dom';

class BayarHutang extends Component{
    constructor(props) {
        super(props);
        this.state={
            tgl: new Date(),
            no_trx : "",
            location:"",
            location_val:"",
            jenis_trx_data:[],
            jenis_trx:"",
            nota_pembelian:"",
            nama_supplier:"",
            jatuh_tempo:"",
            catatan:"-",
            jumlah_bayar:"",
            userid:0,
            error:{
                location:"",
                jenis_trx:"",
                catatan:"",
                jumlah_bayar: ""
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeTgl = this.handleChangeTgl.bind(this);
        this.HandleChangeJenisTrx = this.HandleChangeJenisTrx.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    getProps(param){
        let jns=[
            {value:"Tunai", label:"Tunai"},
            {value:"Transfer", label:"Transfer"},
        ];
        this.setState({
            jenis_trx_data:jns
        });
        if (param.auth.user) {
            this.setState({
                userid: param.auth.user.id
            })
        }
    }

    componentDidMount(){
        if (localStorage.jenis_trx_hutang !== undefined && localStorage.jenis_trx_hutang !== '') {
            this.setState({
                jenis_trx: localStorage.jenis_trx_hutang
            });
        }
        if (localStorage.nota_pembelian_hutang !== undefined && localStorage.nota_pembelian_hutang !== '') {
            this.setState({
                nota_pembelian: localStorage.nota_pembelian_hutang
            });
            this.props.dispatch(FetchHutang(localStorage.nota_pembelian_hutang));
        }

    }

    componentWillReceiveProps = (nextProps) => {
        this.getProps(nextProps);
    }
    componentWillMount(){
        this.getProps(this.props);
    }
    handleChangeTgl(date) {
        this.setState({
            tgl: date
        });
    };
    handleChange(e){
        let column = e.target.name;
        let val = e.target.value;
        let err = Object.assign({}, this.state.error, {
            [column]: ""
        });
        if(column==='nota_pembelian'){
            localStorage.setItem("nota_pembelian_hutang",val);
        }
        this.setState({
            [column]: val,
            error: err
        });

    }

    HandleChangeJenisTrx(jenis) {
        let err = Object.assign({}, this.state.error, {jenis_trx: ""});
        this.setState({
            jenis_trx: jenis.value,
            error: err
        });
        localStorage.setItem('jenis_trx_hutang', jenis.value);
    }
    handleSearch(e){
        let err = this.state.error;
        if(this.state.jenis_trx===''){
            err = Object.assign({}, err, {
                jenis_trx:"Jenis Pembayaran Tidak Boleh Kosong"
            });
        }
        else{
            this.props.dispatch(FetchHutang(this.state.nota_pembelian));
            
        }
        this.setState({
            error: err
        })
    }
    handleSave(e){
        e.preventDefault();
        let err = this.state.error;
        if(this.state.jenis_trx===''){
            err = Object.assign({}, err, {
                jenis_trx:"Jenis Pembayaran Tidak Boleh Kosong"
            });
        }
        else if(this.state.nota_pembelian===''){
            err = Object.assign({}, err, {
                nota_pembelian:"Nota Pembelian Tidak Boleh Kosong"
            });
        }
        else if(this.state.catatan===''){
            err = Object.assign({}, err, {
                catatan:"Keterangan Tidak Boleh Kosong"
            });
        }
        else if(this.state.jumlah_bayar===''||this.state.jumlah_bayar==='0'){
            err = Object.assign({}, err, {
                jumlah_bayar:"Jumlah Bayar Tidak Boleh Kosong"
            });
        }else{
            Swal.fire({
                title: 'Simpan Hutang?',
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
                    data['bank'] = '-';
                    data['cara_byr'] = this.state.jenis_trx;
                    data['jumlah_bayar'] = this.state.jumlah_bayar;
                    data['jumlah_hutang'] = parseInt(this.props.getHutang.nilai_pembelian,10)-parseInt(this.props.getHutang.jumlah_bayar,10);
                    data['ket'] = this.state.catatan;
                    data['lokasi'] = this.props.getHutang.lokasi;
                    data['nogiro'] = 0;
                    data['nota_beli'] = this.state.nota_pembelian;
                    data['pembulatan'] = 0;
                    data['tanggal'] = moment(this.state.tgl).format("yyyy-MM-DD");
                    data['tanggal_cair'] = moment(new Date()).format("yyyy-MM-DD");
                    data['tgl_jatuh_tempo'] = moment(this.props.getHutang.tgl_jatuh_tempo).format("yyyy-MM-DD");
                    data['userid'] = this.state.userid;
                    data['logo'] = this.props.auth.user.logo;
                    data['user'] = this.props.auth.user.username;
                    data['lokasi_val'] = this.state.location_val;
                    this.props.dispatch(storeHutang(data,(arr)=>this.props.history.push(arr)));
                }
            })


        }
        this.setState({
            error: err
        })
    }
    handleCancel(e){
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
                localStorage.removeItem("nota_pembelian_hutang");
                localStorage.removeItem("jenis_trx_hutang");
                window.location.reload();
            }
        })

    }
    render(){
        return (
            <Layout page="Bayar Hutang">
                <div className="card">
                    <div className="card-header">
                        <h4>Bayar Hutang</h4>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="control-label font-12">No. Bayar Hutang</label>
                                    <input  readOnly={true} type="text" className="form-control" value={this.props.nota}/>
                                </div>
                                <div className="form-group">
                                    <label className="control-label font-12">Tanggal</label>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">
                                              <i className="fa fa-calendar" />
                                            </span>
                                        </div>
                                        <DatePicker
                                            className="form-control"
                                            selected={this.state.tgl}
                                            onChange={this.handleChangeTgl}
                                        />
                                    </div>
                                </div>

                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="control-label font-12">Lokasi Hutang</label>
                                    <input readOnly={true} type="text" name="lokasi" className="form-control" value={this.props.getHutang.nama_toko!==undefined?this.props.getHutang.nama_toko:"-"}/>
                                </div>
                                <div className="form-group">
                                    <label className="control-label font-12">Jenis Pembayaran</label>
                                    <Select
                                        options={this.state.jenis_trx_data}
                                        placeholder="Pilih Jenis Transaksi"
                                        onChange={this.HandleChangeJenisTrx}
                                        value={
                                            this.state.jenis_trx_data.find(op => {
                                                return op.value === this.state.jenis_trx
                                            })
                                        }

                                    />
                                    <div className="invalid-feedback"
                                         style={this.state.error.jenis_trx !== "" ? {display: 'block'} : {display: 'none'}}>
                                        {this.state.error.jenis_trx}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="control-label font-12">Nota Pembelian</label>
                                    <div className="input-group">
                                        <input type="text" className="form-control" name="nota_pembelian" value={this.state.nota_pembelian} onChange={this.handleChange}
                                               onKeyPress = {
                                                   event => {
                                                       if (event.key === 'Enter') {
                                                           this.handleSearch();

                                                       }
                                                   }
                                               }
                                        />
                                        <div className="input-group-prepend">
                                            <button className="btn btn-primary" onClick={this.handleSearch}>
                                                {
                                                    this.props.isLoading?"loading ....":<i className="fa fa-search"/>
                                                }
                                            </button>
                                        </div>
                                    </div>
                                    <div className="invalid-feedback"
                                         style={this.state.error.nota_pembelian !== "" ? {display: 'block'} : {display: 'none'}}>
                                        {this.state.error.nota_pembelian}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="control-label font-12">Nama Supplier</label>
                                    <input readOnly={true} type="text" className="form-control" name="nama_supplier" value={this.props.getHutang.supplier!==undefined?this.props.getHutang.supplier:this.state.nama_supplier}/>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="control-label font-12">Jatuh Tempo</label>
                                    <input readOnly={true} type="text" className="form-control" name="jatuh_tempo" value={this.props.getHutang.tgl_jatuh_tempo!==undefined?moment(this.props.getHutang.tgl_jatuh_tempo).format("yyyy-MM-DD"):this.state.jatuh_tempo}/>
                                </div>
                                <div className="form-group">
                                    <label className="control-label font-12">Keterangan</label>
                                    <input type="text" className="form-control" name="catatan" value={this.state.catatan} onChange={this.handleChange}/>
                                    <div className="invalid-feedback"
                                         style={this.state.error.catatan !== "" ? {display: 'block'} : {display: 'none'}}>
                                        {this.state.error.catatan}
                                    </div>
                                </div>
                            </div>

                        </div>
                        <hr/>
                        {
                            this.props.isLoadingPost?<Preloader/>:  <div className="row">
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="control-label font-12">Jumlah Hutang</label>
                                        <input readOnly={true} type="text" className="form-control" value={this.props.getHutang.nilai_pembelian!==undefined?toRp(parseInt(this.props.getHutang.nilai_pembelian,10)):"0"}/>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label font-12">Jumlah Yang Telah Dibayar</label>
                                        <input readOnly={true} type="text" className="form-control" value={this.props.getHutang.jumlah_bayar!==undefined?this.props.getHutang.jumlah_bayar:"0"}/>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="control-label font-12">Sisa Hutang</label>
                                        <input readOnly={true} type="text" className="form-control" value={this.props.getHutang.nilai_pembelian!==undefined?toRp(parseInt(this.props.getHutang.nilai_pembelian,10)-parseInt(this.props.getHutang.jumlah_bayar,10)):"0"}/>
                                    </div>
                                    <div className="form-group">
                                        <label className="control-label font-12">Jumlah Bayar</label>
                                        <input type="text" name="jumlah_bayar" className="form-control" value={this.state.jumlah_bayar} onChange={this.handleChange}/>
                                        <div className="invalid-feedback"
                                             style={this.state.error.jumlah_bayar !== "" ? {display: 'block'} : {display: 'none'}}>
                                            {this.state.error.jumlah_bayar}
                                        </div>
                                        {
                                            this.state.jumlah_bayar > (parseInt(this.props.getHutang.nilai_pembelian,10)-parseInt(this.props.getHutang.jumlah_bayar,10)) ? <small style={{fontWeight:"bold",color:"red"}}>Jumlah Bayar Melebihi Hutang</small>:""
                                        }
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <div className="pull-right" style={{alignSelf: "flex-end"}}>
                                            <button className="btn btn-primary btn-sm" style={{marginTop:"29px"}} onClick={this.handleSave} disabled={this.state.jumlah_bayar > (parseInt(this.props.getHutang.nilai_pembelian,10)-parseInt(this.props.getHutang.jumlah_bayar,10))?true:false}>Simpan</button>
                                            <button className="btn btn-danger btn-sm" style={{marginTop:"29px",marginLeft:"5px"}} onClick={this.handleCancel}>Batal</button>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        }

                    </div>
                </div>
            </Layout>
        );
    }

}
const mapStateToPropsCreateItem = (state) => ({
    auth:state.auth,
    nota:state.hutangReducer.get_code,
    getHutang:state.hutangReducer.data,
    isLoading:state.hutangReducer.isLoading,
    isLoadingPost:state.hutangReducer.isLoadingPost
});

export default withRouter(connect(mapStateToPropsCreateItem)(BayarHutang));