import React,{Component} from 'react';
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import {toRp} from "helper";
import moment from "moment";
import BayarMutasiJualBeliForm from "./src/bayar_mutasi_jual_beli_form"
import { Card, CardBody, CardHeader, Collapse } from 'reactstrap';
import Spinner from 'Spinner';
import Paginationq from "helper";
import { FetchDataBayarMutasiJualBeli, FetchKartuAlokasi } from '../../../../redux/actions/inventory/mutasi_jual_beli.action';

class BayarMutasiJualBeli extends Component{
    constructor(props) {
        super(props);
        this.state={
            isOpen:false,
            indexOpen:null,
            isPay:false,
            data:{}
        }
        this.toggle     = this.toggle.bind(this);
        this.handleBayar     = this.handleBayar.bind(this);
        this.handlesearch     = this.handlesearch.bind(this);
        this.handlePageChange     = this.handlePageChange.bind(this);
    }

    componentWillMount(){
        this.props.dispatch(FetchKartuAlokasi(1,''))
    }

    toggle(e,index){
        e.preventDefault();
        this.setState({
            // isOpen:!this.state.isOpen,
            indexOpen:index===this.state.indexOpen?null:index
        })
    }
    handleBayar(e,kode){
        e.preventDefault();
        this.setState({
            isPay:!this.state.isPay,
            data:{"kode":kode}
        })
        
        this.props.dispatch(FetchDataBayarMutasiJualBeli(kode));
    }
    handlesearch(e){
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        let any = data.get('any');
        localStorage.setItem('any_kartu_piutang',any);
        this.props.dispatch(FetchKartuAlokasi(1,any===null||any===''||any===undefined?'':"&customer="+any));
    }
    handlePageChange(pageNumber) {
        let any = localStorage.getItem("any_kartu_piutang");
        this.props.dispatch(FetchKartuAlokasi(pageNumber,any===undefined&&any===null&&any===''?1:"&customer="+any))
    }
    update(value){
        return () => {
            this.setState({
                isPay: value
            });
        }
    }
    render(){
        const {last_page,current_page,per_page,data,total_hutang} = this.props.getKartuPiutang===undefined?{'last_page':'','per_page':'','current_page':'','data':[],'total_hutang':''}:this.props.getKartuPiutang;
        return (
            <Layout page="Bayar Mutasi Jual Beli">
            <Card>
                    <CardHeader className="bg-transparent d-flex align-items-center justify-content-between"><h4>Pembayaran Mutasi Jual Beli</h4><h4>Total Nominal Mutasi Rp. {toRp(parseInt(total_hutang,10))}</h4></CardHeader>
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
                                        data!==undefined? data.length > 0 ? data.map((v,i)=>{
                                            return(
                                                <div className="accordion" key={i}>
                                                    <div className="card mb-2">
                                                    <button className="btn btn-link btn-block text-left" onClick={(e)=>this.toggle(e,i)}>
                                                        <div className="card-header d-flex align-items-center justify-content-between" style={{borderBottom:'none'}}>
                                                        <h5 className="mb-0">
                                                            {/* <button className="btn btn-link collapsed" onClick={this.toggle} type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne"> */}
                                                            {v.asal} | Sisa : Rp. {toRp(parseInt(v.sisa_hutang,10))}
                                                            {/* </button> */}
                                                        </h5>
                                                        <h5><i className={this.state.indexOpen===i?"fa fa-angle-up":"fa fa-angle-down"}></i></h5>
                                                        </div>
                                                    </button>
                                                        <Collapse isOpen={this.state.indexOpen===i}>
                                                            <Card>
                                                            <CardBody style={{minHeight:'min-content',maxHeight:'400px',overflowX:'auto'}}>
                                                                {
                                                                    v.detail.map((w,j) => {
                                                                        return(
                                                                            <div className="accordion" key={j}>
                                                                                <div className="card rounded bg-dark mb-1">
                                                                                    <div className="card-header d-flex align-items-center justify-content-between">
                                                                                        <div>
                                                                                            <h6 className="text-light">
                                                                                                {/* <button className="btn btn-link" onClick={(e)=>this.handleBayar(e,w.kd_trx)} type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne"> */}
                                                                                                {w.no_faktur_mutasi} | Sisa : Rp. {toRp(parseInt(w.sisa_hutang,10))}
                                                                                                {/* </button> */}
                                                                                            </h6>
                                                                                            <p className="text-light">Lokasi Asal : {w.kd_lokasi_1} | Lokasi Tujuan : {w.kd_lokasi_2}</p>
                                                                                            <small className="text-light">{moment(w.tgl).format('YYYY-MM-DD')} | </small>
                                                                                            <small className="text-light">Hutang : {toRp(parseInt(w.hutang,10))} | </small>
                                                                                            <small className="text-light">Dibayar : {toRp(parseInt(w.dibayar,10))}</small>
                                                                                        </div>
                                                                                        <button className="btn btn-primary" onClick={(e)=>this.handleBayar(e,w.no_faktur_mutasi)} type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                                                                        <i class="fa fa-usd"></i>&nbsp;Bayar
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </CardBody>
                                                            </Card>
                                                        </Collapse>
                                                    </div>
                                                </div>
                                            )
                                        }) : "no data" : "no data"
                                    }
                                </div> : <Spinner spinnerLabel={"Memuat data ..."}/>
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
                        <BayarMutasiJualBeliForm data={this.state.data} action={this.update.bind(this)} history={this.props.history}/>
                    </CardBody>
                </Card>
            </Layout>
        );
    }

}


const mapStateToPropsCreateItem = (state) => ({
    auth:state.auth,
    isOpen:state.modalReducer,
    getKartuPiutang:state.mutasiJualBeliReducer.kartu_data,
    isLoading:state.mutasiJualBeliReducer.isLoading,
});

export default connect(mapStateToPropsCreateItem)(BayarMutasiJualBeli);