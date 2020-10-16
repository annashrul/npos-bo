import React,{Component} from 'react';
import Layout from "../Layout";
import connect from "react-redux/es/connect/connect";
import { Card, CardBody, CardHeader, Collapse } from 'reactstrap';
import { FetchKartuPiutang, FetchPiutang } from '../../../redux/actions/piutang/piutang.action';
import { toRp } from '../../../helper';
import Spinner from '../../../Spinner';
import BayarPiutangForm from './src/bayar_piutang_form'
// import Select from "react-select";
// import {FetchPiutang, storePiutang} from "redux/actions/piutang/piutang.action";
import moment from "moment";
// import {toRp} from "helper";
// import Swal from "sweetalert2";
import Paginationq from "helper";
// import { rmComma, toCurrency } from '../../../helper';

class BayarPiutang extends Component{
    constructor(props) {
        super(props);
        this.state={
            isOpen:false,
            indexOpen:null,
            isPay:false,
            data:{}
        //     tgl: moment(new Date()).format("yyyy-MM-DD"),
        //     no_trx : "",
        //     location:"",
        //     jenis_trx_data:[],
        //     jenis_trx:"",
        //     nota_pembelian:"",
        //     nama:"",
        //     tempo:"",
        //     catatan:"-",
        //     jumlah_telah_bayar:"",
        //     jumlah_bayar:"",
        //     userid:0,
        //     error:{
        //         location:"",
        //         jenis_trx:"",
        //         nota_pembelian:"",
        //         catatan:"",
        //         jumlah_telah_bayar: "",
        //         jumlah_bayar:"",
        //     }
        }
        // this.handleChange   = this.handleChange.bind(this);
        // this.HandleChangeJenisTrx = this.HandleChangeJenisTrx.bind(this);
        // this.handleSearch   = this.handleSearch.bind(this);
        // this.handleCancel   = this.handleCancel.bind(this);
        // this.handleSave     = this.handleSave.bind(this);
        this.toggle     = this.toggle.bind(this);
        this.handleBayar     = this.handleBayar.bind(this);
        this.handlesearch     = this.handlesearch.bind(this);
        this.handlePageChange     = this.handlePageChange.bind(this);
    }

    // getProps(param){
    //     let jns=[
    //         {value:"Tunai", label:"Tunai"},
    //         {value:"Transfer", label:"Transfer"},
    //     ];
    //     this.setState({
    //         jenis_trx_data:jns
    //     });
    //     if (param.auth.user) {
    //         this.setState({
    //             userid: param.auth.user.id
    //         })
    //     }
    // }

    // componentDidMount(){
    //     if (localStorage.jenis_trx_piutang !== undefined && localStorage.jenis_trx_piutang !== '') {
    //         this.setState({
    //             jenis_trx: localStorage.jenis_trx_piutang
    //         });
    //     }
    //     if (localStorage.nota_pembelian_piutang !== undefined && localStorage.nota_pembelian_piutang !== '') {
    //         this.setState({
    //             nota_pembelian: localStorage.nota_pembelian_piutang
    //         });
    //         this.props.dispatch(FetchPiutang(localStorage.nota_pembelian_piutang));
    //     }

    // }

    // componentWillReceiveProps = (nextProps) => {
    //     this.getProps(nextProps);
    // }
    // componentWillMount(){
    //     this.getProps(this.props);
    // }

    // handleChange(e){
    //     let column = e.target.name;
    //     let val = e.target.value;
    //     let err = Object.assign({}, this.state.error, {
    //         [column]: ""
    //     });
    //     if(column==='nota_pembelian'){
    //         localStorage.setItem("nota_pembelian_piutang",val);
    //     }
    //     if(column === 'jumlah_bayar'){
    //         this.setState({
    //             [column]: val.replace(/,/g,'').replace(/\D/,''),
    //             error: err
    //         });
    //     } else {
    //         this.setState({
    //             [column]: val,
    //             error: err
    //         });
    //     }

    // }

    // HandleChangeJenisTrx(jenis) {
    //     let err = Object.assign({}, this.state.error, {jenis_trx: ""});
    //     this.setState({
    //         jenis_trx: jenis.value,
    //         error: err
    //     });
    //     localStorage.setItem('jenis_trx_piutang', jenis.value);
    // }
    // handleSearch(e){
    //     let err = this.state.error;
    //     if(this.state.jenis_trx===''){
    //         err = Object.assign({}, err, {
    //             jenis_trx:"Jenis Pembayaran Tidak Boleh Kosong"
    //         });
    //     }
    //     else{
    //         this.props.dispatch(FetchPiutang(this.state.nota_pembelian));
            
    //     }
    //     this.setState({
    //         error: err
    //     })
    // }
    // handleSave(e){
    //     e.preventDefault();
    //     let err = this.state.error;
    //     if(this.state.jenis_trx===''){
    //         err = Object.assign({}, err, {
    //             jenis_trx:"Jenis Pembayaran Tidak Boleh Kosong"
    //         });
    //         this.setState({error: err,})
            
    //     }
    //     else if(this.state.nota_pembelian===''){
    //         err = Object.assign({}, err, {
    //             nota_pembelian:"Nota Penjualan Tidak Boleh Kosong"
    //         });
    //         this.setState({error: err,})
            
    //     }
    //     else if(this.state.catatan===''){
    //         err = Object.assign({}, err, {
    //             catatan:"Keterangan Tidak Boleh Kosong"
    //         });
    //         this.setState({error: err,})
            
    //     }

    //     else if(this.state.jumlah_bayar===''||this.state.jumlah_bayar==='0' || parseInt(this.state.jumlah_bayar,10)===0){
    //         err = Object.assign({}, err, {
    //             jumlah_bayar:"Jumlah Bayar Tidak Boleh Kosong"
    //         });
    //         this.setState({error: err,})
    //     }
    //     else if(parseInt(this.state.jumlah_bayar,10)>(parseInt(this.props.getPiutang.gt,10)-parseInt(this.props.getPiutang.jumlah_telah_bayar,10))){
    //         err = Object.assign({}, err, {
    //             jumlah_bayar:"Jumlah Bayar Tidak Boleh Lebih Dari Jumlah Piutang"
    //         });
    //         this.setState({
    //             error: err,
    //             jumlah_bayar:0
    //         })
    //     }
    //     else{
    //         Swal.fire({
    //             title: 'Simpan Piutang?',
    //             text: "Pastikan data yang anda masukan sudah benar!",
    //             icon: 'warning',
    //             showCancelButton: true,
    //             confirmButtonColor: '#3085d6',
    //             cancelButtonColor: '#d33',
    //             confirmButtonText: 'Ya, Simpan!',
    //             cancelButtonText: 'Tidak!'
    //         }).then((result) => {
    //             if (result.value) {
    //                 let data={};
    //                 data['nota_jual'] = this.state.nota_pembelian;;
    //                 data['tanggal'] = moment(this.state.tgl).format("yyyy-MM-DD");
    //                 data['jumlah'] = this.state.jumlah_bayar;
    //                 data['jumlah_piutang'] = parseInt(this.props.getPiutang.gt,10);
    //                 data['tgl_jatuh_tempo'] = moment(this.props.getPiutang.tempo).format("yyyy-MM-DD");
    //                 data['lokasi'] = this.props.getPiutang.lokasi===undefined||this.props.getPiutang.lokasi===''||this.props.getPiutang.lokasi===null?'LK/0001':this.props.getPiutang.lokasi;
    //                 data['cara_byr'] = this.state.jenis_trx;
    //                 data['bank'] = '-';
    //                 data['pembulatan'] = 0;
    //                 data['nogiro'] = 0;
    //                 data['tanggal_cair'] = moment(new Date()).format("yyyy-MM-DD");
    //                 data['ket'] = this.state.catatan;
    //                 data['userid'] = this.state.userid;
    //                 data['jumlah_sudah_bayar'] = this.props.getPiutang.jumlah_telah_bayar;
                    
    //                 this.props.dispatch(storePiutang(data,(arr)=>this.props.history.push(arr)));
    //             }
    //         })
    //     }


    // }
    // handleCancel(e){
    //     e.preventDefault();
    //     Swal.fire({
    //         title: 'Are you sure?',
    //         text: "You won't be able to revert this!",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Yes!'
    //     }).then((result) => {
    //         if (result.value) {
    //             localStorage.removeItem("nota_pembelian_piutang");
    //             localStorage.removeItem("jenis_trx_piutang");
    //             window.location.reload();
    //         }
    //     })

    // }

    componentWillMount(){
        this.props.dispatch(FetchKartuPiutang(1,''))
    }

    toggle(e,index){
        e.preventDefault();
        this.setState({
            isOpen:!this.state.isOpen,
            indexOpen:index
        })
    }
    handleBayar(e,kode){
        e.preventDefault();
        this.setState({
            isPay:!this.state.isPay,
            data:{"kode":kode}
        })
        
        this.props.dispatch(FetchPiutang(kode));
    }
    handlesearch(e){
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        let any = data.get('any');
        localStorage.setItem('any_kartu_piutang',any);
        this.props.dispatch(FetchKartuPiutang(1,any===null||any===''||any===undefined?'':"&customer="+any));
    }
    handlePageChange(pageNumber) {
        let any = localStorage.getItem("any_kartu_piutang");
        this.props.dispatch(FetchKartuPiutang(pageNumber,any===undefined&&any===null&&any===''?1:"&customer="+any))
    }
    render(){

        const {last_page,current_page,per_page} = this.props.getKartuPiutang===undefined?{'last_page':'','per_page':'','current_page':''}:this.props.getKartuPiutang;
        // console.log(data===undefined?'':data);
        console.log(this.props.getKartuPiutang);
        return (
            <Layout page="Bayar Piutang">
                <Card>
                    <CardHeader className="bg-transparent"><h4>Pembayaran Piutang</h4></CardHeader>
                    <CardBody hidden={this.state.isPay}>
                        <form onSubmit={this.handlesearch} noValidate>
                            <div className="row">
                                <div className="col-10 col-xs-10 col-md-3">
                                    <div className="form-group">
                                        <label>Search</label>
                                        <input type="text" className="form-control" name="any" defaultValue={localStorage.getItem('any_kartu_piutang')}/>
                                    </div>
                                </div>
                                <div className="col-2 col-xs-2 col-md-3">
                                    <div className="form-group">
                                        <button style={{marginTop:"27px"}} type="submit" className="btn btn-primary"><i className="fa fa-search"></i></button>
                                    </div>
                                </div>
                            </div>

                        </form>
                            {
                                !this.props.isLoading?
                                <div>
                                    {
                                        this.props.getKartuPiutang!==undefined? this.props.getKartuPiutang.data.map((v,i)=>{
                                            return(
                                                <div className="accordion" key={i}>
                                                    <div className="card">
                                                    <button className="btn btn-link btn-block text-left" onClick={(e)=>this.toggle(e,i)}>
                                                        <div className="card-header d-flex align-items-center justify-content-between" style={{borderBottom:'none'}}>
                                                        <h5 className="mb-0">
                                                            {/* <button className="btn btn-link collapsed" onClick={this.toggle} type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne"> */}
                                                            {v.nama} | {v.kd_cust}
                                                            {/* </button> */}
                                                        </h5>
                                                        <h5><i className={this.state.isOpen&&this.state.indexOpen===i?"fa fa-angle-up":"fa fa-angle-down"}></i></h5>
                                                        </div>
                                                    </button>
                                                        <Collapse isOpen={this.state.isOpen&&this.state.indexOpen===i}>
                                                            <Card>
                                                            <CardBody>
                                                                {
                                                                    v.detail.map((w,j) => {
                                                                        return(
                                                                            <div className="accordion" key={j}>
                                                                                <div className="card rounded bg-dark mb-1">
                                                                                    <div className="card-header d-flex align-items-center justify-content-between">
                                                                                        <div>
                                                                                            <h6 className="text-light">
                                                                                                {/* <button className="btn btn-link" onClick={(e)=>this.handleBayar(e,w.kd_trx)} type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne"> */}
                                                                                                {w.kd_trx}
                                                                                                {/* </button> */}
                                                                                            </h6>
                                                                                            <small className="text-light">{moment(w.tgl).format('YYYY-MM-DD')} | </small>
                                                                                            <small className="text-light">Piutang : {toRp(parseInt(w.piutang,10))} | </small>
                                                                                            <small className="text-light">Dibayar : {toRp(parseInt(w.dibayar,10))}</small>
                                                                                        </div>
                                                                                        <button className="btn btn-primary" onClick={(e)=>this.handleBayar(e,w.kd_trx)} type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                                                                        <i class="fa fa-usd"></i>&nbsp;Bayar
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                                <div className="bg-transparent d-flex align-items-center justify-content-between mt-3">
                                                                    <div className="widgets-card-title">
                                                                        <h5 className="card-title mb-0">Sisa Piutang</h5>
                                                                    </div>
                                                                    <div class="badge badge-danger" style={{padding:'10px'}}>{toRp(parseInt(v.sisa_piutang,10))}</div>
                                                                </div>
                                                            </CardBody>
                                                            </Card>
                                                        </Collapse>
                                                    </div>
                                                </div>
                                            )
                                        }) : "no data"
                                    }
                                </div> : <Spinner/>
                            }
                            
                            <div style={{"marginTop":"20px","float":"right"}}>
                                <Paginationq
                                    current_page={current_page}
                                    per_page={per_page}
                                    total={last_page*per_page}
                                    callback={this.handlePageChange.bind(this)}
                                />
                            </div>
                    </CardBody>
                    <CardBody hidden={!this.state.isPay}>
                        <BayarPiutangForm data={this.state.data} />
                    </CardBody>
                </Card>
            </Layout>
        );
    }

}
const mapStateToPropsCreateItem = (state) => ({
    auth:state.auth,
    nota:state.piutangReducer.get_code,
    getPiutang:state.piutangReducer.data,
    getKartuPiutang:state.piutangReducer.data_kartu_piutang,
    isLoading:state.piutangReducer.isLoading,
    isLoadingPost:state.piutangReducer.isLoadingPost
});

export default connect(mapStateToPropsCreateItem)(BayarPiutang);