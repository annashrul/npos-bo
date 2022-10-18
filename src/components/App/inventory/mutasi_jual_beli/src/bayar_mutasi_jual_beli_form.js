import React,{Component} from 'react';
// import Layout from "../../../Layout";
import connect from "react-redux/es/connect/connect";
import Select from "react-select";
import {
    FetchCodeBayarMutasiJualBeli,
    FetchDataBayarMutasiJualBeli, storeMutasiJualBeli
} from "redux/actions/inventory/mutasi_jual_beli.action";
import Preloader from "Preloader";
import {toRp} from "helper";
import moment from "moment";
import {FetchBank, setBank} from "redux/actions/masterdata/bank/bank.action";
import { rmComma, toCurrency } from '../../../../../helper';
import { withRouter } from 'react-router-dom';

class BayarMutasiJualBeliFrom extends Component{
    constructor(props) {
        super(props);
        this.state={
            no_trx:"-",
            tgl_trx:moment(new Date()).format('YYYY-MM-DD'),
            jenis_data:[],
            location:"",
            jenis_trx:"",
            no_faktur_mutasi:"",
            total_hutang:0,
            jumlah_bayar:0,
            jumlah_sudah_bayar:0,
            sisa_hutang:0,
            userid:0,
            bank_data:[],
            bank:"-",
            error:{
                location:"",
                jenis_trx:"",
                no_faktur_mutasi:"",
                total_hutang:"",
                jumlah_bayar:"",
            }
        }
        // this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this)
        this.HandleChangeJenis = this.HandleChangeJenis.bind(this);
        this.HandleChangeBank = this.HandleChangeBank.bind(this);
        this.handleChangeTanggal = this.handleChangeTanggal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleSave= this.handleSave.bind(this);

    }
    getProps(param){
        let jn = [
            {value:"Tunai",label:"Tunai"},
            {value:"Transfer",label:"Transfer"},
        ];
        this.setState({
            jenis_data:jn,
            no_trx:param.getKode,
            no_faktur_mutasi:param.getData.no_faktur_mutasi,
            location:param.getData.kd_tujuan,
            total_hutang:param.getData.nilai_pembelian,
            jumlah_sudah_bayar:param.getData.jumlah_bayar,
            sisa_hutang:parseInt(param.getData.nilai_pembelian,10)-parseInt(param.getData.jumlah_bayar,10),

        });
        if (param.auth.user) {
            this.setState({
                userid: param.auth.user.id
            })
        }
        let bank=[];
        if(param.getBank!==undefined){
            if(param.getBank.data!==undefined&&param.getBank.data!==[]){
                typeof param.getBank.data === 'object' ? param.getBank.data.length > 0 ? param.getBank.data.map((v,i)=>{
                    bank.push({
                        value:v.nama,
                        label:v.nama
                    })
                    return null;
                }) : bank.push({
                    value:'-',
                    label:'-'
                }) : bank.push({
                    value:'-',
                    label:'-'
                });
                this.setState({
                    bank_data:bank
                })
            }
        }else{
            bank.push({
                value:'-',
                label:'-'
            });
            this.setState({
                bank_data:bank,
                bank:'-'
            })
        }
    }
    componentWillMount(){
        this.getProps(this.props);
    }
    componentWillReceiveProps = (nextProps) => {
        this.getProps(nextProps);
    }

    HandleChangeJenis(lk){
        this.setState({
            jenis_trx:lk.value,
        });
        if(lk.value==='Transfer'){
            this.props.dispatch(FetchBank(1,null,50));
        }else{
            this.props.dispatch(setBank([]));
        }
    }
    HandleChangeBank(lk){
        this.setState({
            bank:lk.value,
        });
    }
    handleChangeTanggal(date) {
        this.setState({
            tgl_trx: date
        });
    };
    handleChange(e,errs=true){
        const column = e.target.name;
        let val = e.target.value;
        if(column==='jumlah_bayar'){
            // let sisa = 0;let sudah=0;
            // if(parseInt(val,10) <= parseInt(this.state.total_hutang,10)){
            //     sisa = parseInt(this.state.total_hutang,10) - parseInt(val,10);
            //     sudah = val;
            // }
            // if(parseInt(val,10) > parseInt(this.state.total_hutang,10)){
            //     sudah=this.state.total_hutang;
            //     sisa = 0;

            // }
            // this.setState({
            //     jumlah_sudah_bayar:sudah,
            //     sisa_hutang:sisa

            // })
            if(parseInt(rmComma(val),10) > parseInt(this.state.sisa_hutang,10)){
                val = parseInt(this.state.sisa_hutang,10);
            }
            this.setState({
                [column]: val
            });
        } else {
            this.setState({
                [column]: val
            });
        }
        if(errs){
            let err = Object.assign({}, this.state.error, {
                [column]: ""
            });
            this.setState({
                error: err
            });
        }
    }
    handleBlur(e){
        e.preventDefault();
        let err = this.state.error;
        if(parseInt(this.state.jumlah_bayar,10) > parseInt(this.state.total_hutang,10)){
            err = Object.assign({}, err, {jumlah_bayar:"jumlah bayar melebihi hutang"});
        }
        this.setState({
            error: err
        })
    }
    handleSearch(e){
        e.preventDefault();
        this.props.dispatch(FetchDataBayarMutasiJualBeli(this.state.no_faktur_mutasi));
        this.props.dispatch(FetchCodeBayarMutasiJualBeli(this.state.location));
    }
    handleSave(e,param){
        e.preventDefault();
        if(param==='simpan'){
            let err = this.state.error;
            if(this.state.no_faktur_mutasi===''){
                err = Object.assign({}, err, {no_faktur_mutasi:"no faktur mutasi tidak boleh kosong"});
                this.setState({error: err})
            }
            else if(this.state.jenis_trx===''){
                err = Object.assign({}, err, {jenis_trx:"jenis transaksi tidak boleh kosong"});
                this.setState({error: err})
            }
            else if(this.state.location===''){
                err = Object.assign({}, err, {jenis_trx:"lokasi tidak boleh kosong"});
                this.setState({error: err})
            }
            else if(this.state.jumlah_bayar===''||this.state.jumlah_bayar===0){
                err = Object.assign({}, err, {jenis_trx:"jumlah bayar tidak boleh kosong"});
                this.setState({error: err})
            }
            else{
                let parseData={};
                parseData['no_faktur_mutasi'] = this.state.no_faktur_mutasi;
                parseData['tanggal'] = moment(this.state.tgl_trx).format("yyyy-MM-DD");
                parseData['jumlah_bayar'] = rmComma(this.state.jumlah_bayar);
                parseData['jumlah_hutang'] = this.state.total_hutang;
                parseData['lokasi'] = this.state.location;
                parseData['jenis_pembayaran'] = this.state.jenis_trx;
                parseData['bank'] = this.state.bank;
                parseData['keterangan'] ='-';
                parseData['userid'] =this.state.userid;
                this.props.dispatch(storeMutasiJualBeli(parseData,(arr)=>this.props.history.push(arr)));
            }

        }else{
            window.location.reload();
        }
    }
    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        return (
            // <Layout page="Bayar Mutasi Jual Beli">
                <div className="card">
                    <div className="card-header">
                        <h4>Bayar Mutasi Jual Beli</h4>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-2">
                                <div className="form-group">
                                    <label>No. Transaksi</label>
                                    <input type="text" name="no_trx" className="form-control" value={this.state.no_trx} readOnly={true}/>
                                </div>
                                <div className="form-group">
                                    <label>Tanggal Transaksi</label>
                                    <div className="input-group">
                                        <input type="date" name="tgl_trx" className="form-control" value={this.state.tgl_trx} onChange={(e)=>this.handleChange(e,false)}/>
                                        {/*<DatePicker className="form-control" selected={this.state.tgl_trx} onChange={this.handleChangeTanggal}/>*/}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="form-group">
                                    <label>Jenis Pembayaran</label>
                                    <Select options={this.state.jenis_data} placeholder="Pilih" onChange={this.HandleChangeJenis} alue={this.state.jenis_data.find(op => {return op.value === this.state.jenis_trx})}/>
                                    <div className="invalid-feedback"
                                         style={this.state.error.jenis_trx !== "" ? {display: 'block'} : {display: 'none'}}>
                                        {this.state.error.jenis_trx}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>No Faktur Mutasi</label>
                                    <div className="input-group mb-3">
                                        <input type="text" name="no_faktur_mutasi" readOnly className="form-control" value={this.state.no_faktur_mutasi} onChange={(e)=>this.handleChange(e,true)}/>
                                        <div className="input-group-prepend d-none">
                                            <button className="btn btn-primary" onClick={this.handleSearch}>{
                                                !this.props.isLoading?<i className="fa fa-search"/>:"loading ...."
                                            }</button>
                                        </div>
                                        <div className="invalid-feedback"
                                             style={this.state.error.no_faktur_mutasi !== "" ? {display: 'block'} : {display: 'none'}}>
                                            {this.state.error.no_faktur_mutasi}
                                        </div>
                                    </div>
                                </div>


                            </div>
                            <div className="col-md-8">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Lokasi Hutang</label>
                                            <input type="text" name="location" className="form-control" value={this.state.location} readOnly={true}/>
                                            <div className="invalid-feedback"
                                                 style={this.state.error.location !== "" ? {display: 'block'} : {display: 'none'}}>
                                                {this.state.error.location}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Total Hutang</label>
                                            <input type="text" name="total_hutang" className="form-control" value={toRp(parseInt(this.state.total_hutang,10))} onChange={(e)=>this.handleChange(e,true)} readOnly={true}/>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Jumlah Bayar</label>
                                            <input type="text" name="jumlah_bayar" className="form-control" value={toCurrency(this.state.jumlah_bayar)} onChange={(e)=>this.handleChange(e,true)} onKeyUp={(e)=>this.handleChange(e,true)}/>
                                            <div className="invalid-feedback"
                                                 style={this.state.error.jumlah_bayar !== "" ? {display: 'block'} : {display: 'none'}}>
                                                {this.state.error.jumlah_bayar}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Sudah Dibayar</label>
                                            <input type="text" name="jumlah_sudah_bayar" className="form-control" value={toRp(parseInt(this.state.jumlah_sudah_bayar,10))} onChange={(e)=>this.handleChange(e,true)} readOnly={true}/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label>Sisa Hutang</label>
                                            <input type="text" name="sisa_hutang" className="form-control" value={toRp(parseInt(this.state.sisa_hutang,10))} onChange={(e)=>this.handleChange(e,true)} readOnly={true}/>
                                        </div>
                                        {
                                            this.state.jenis_trx === 'Transfer' ? (
                                                <div className="form-group">
                                                    <label>Bank</label>
                                                    <Select options={this.state.bank_data} placeholder="Pilih" onChange={this.HandleChangeBank} alue={this.state.bank_data.find(op => {return op.value === this.state.bank})}/>
                                                    <div className="invalid-feedback"
                                                         style={this.state.error.bank !== "" ? {display: 'block'} : {display: 'none'}}>
                                                        {this.state.error.bank}
                                                    </div>
                                                </div>
                                            ) : ''
                                        }

                                    </div>
                                </div>
                            </div>

                        </div>
                        <hr/>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="table-responsive d-none">
                                    <table className="table table-hover table-bordered">
                                        <thead className="bg-light">
                                        <tr>
                                            <th style={columnStyle}>Kode Barang</th>
                                            <th style={columnStyle}>Barcode</th>
                                            <th style={columnStyle}>Nama Barang</th>
                                            <th style={columnStyle}>Harga Beli</th>
                                            <th style={columnStyle}>Harga Jual</th>
                                        </tr>
                                        </thead>
                                        {
                                            !this.props.isLoading?(
                                                <tbody>
                                                {
                                                    typeof this.props.getData.detail === 'object' ? this.props.getData.detail.length > 0 ? this.props.getData.detail.map((v,i)=>{
                                                        return (
                                                            <tr>
                                                                <td style={columnStyle}>{v.kd_brg}</td>
                                                                <td style={columnStyle}>{v.barcode}</td>
                                                                <td style={columnStyle}>{v.nm_brg}</td>
                                                                <td style={{textAlign:"right"}}>{toRp(parseInt(v.hrg_beli,10))}</td>
                                                                <td style={{textAlign:"right"}}>{toRp(parseInt(v.hrg_jual,10))}</td>
                                                            </tr>
                                                        );
                                                    }) : "No data." : "Noda Data."
                                                }
                                                </tbody>
                                            ):<Preloader/>
                                        }
                                    </table>
                                </div>
                                <button className="btn btn-primary" onClick={(e)=>this.handleSave(e,'simpan')} style={{marginRight:"5px"}}>{
                                    !this.props.isLoading?'Simpan':'loading......'
                                }</button>
                                <button className="btn btn-danger" onClick={this.props.action(false)}>Kembali</button>
                            </div>
                        </div>
                    </div>
                    {this.props.isLoading?<Preloader/>:''}
                </div>
            // </Layout>
        );
    }

}


const mapStateToPropsCreateItem = (state) => ({
    auth:state.auth,
    isOpen:state.modalReducer,
    isLoading:state.mutasiJualBeliReducer.isLoading,
    getKode:state.mutasiJualBeliReducer.code,
    getData:state.mutasiJualBeliReducer.data,
    getBank:state.bankReducer.data
});

export default withRouter(connect(mapStateToPropsCreateItem)(BayarMutasiJualBeliFrom));