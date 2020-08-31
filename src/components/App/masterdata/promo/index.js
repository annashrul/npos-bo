import React,{Component} from 'react';
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import {FetchPromo, FetchPromoKategori} from "redux/actions/masterdata/promo/promo.action";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import moment from "moment";
import Paginationq, {statusQ} from "helper";
import FormPromo from "components/App/modals/masterdata/promo/form_promo";
import Preloader from "Preloader";
import {HEADERS} from "redux/actions/_constants";
import {deletePromo, FetchPromoDetail} from "redux/actions/masterdata/promo/promo.action";
import {FetchGroupProduct} from "redux/actions/masterdata/group_product/group_product.action";
import {FetchSupplierAll} from "redux/actions/masterdata/supplier/supplier.action";
import {FetchAllLocation} from "redux/actions/masterdata/location/location.action";
import Swal from "sweetalert2";
import {setPromoDetail} from "../../../../redux/actions/masterdata/promo/promo.action";
class Promo extends Component{
    constructor(props){
        super(props);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.state={
            detail:{}
        }

        this.handlePagin=this.handlePagin.bind(this);
    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.auth.user) {
            let access = nextProps.auth.user.access;
            if(access!==undefined&&access!==null){
                if(nextProps.auth.user.access[17]['label']==="0"){
                    alert("bukan halaman kamu");
                    this.props.history.push({
                        pathname: '/',
                        state: {from: this.props.location.pathname}
                    });
                }
            }
        }
    }
    componentWillMount(){
        this.props.dispatch(FetchPromoKategori());
        this.props.dispatch(FetchPromo(1,''));
    }
    handleAdd(e) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formPromo"));
        this.props.dispatch(FetchGroupProduct(1,'',100));
        this.props.dispatch(FetchSupplierAll());
        this.props.dispatch(FetchAllLocation());
        this.props.dispatch(setPromoDetail([]))

    }
    handleEdit(e,id) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formPromo"));
        this.props.dispatch(FetchPromoDetail(id));
        this.props.dispatch(FetchGroupProduct(1,'',100));
        this.props.dispatch(FetchSupplierAll());
        this.props.dispatch(FetchAllLocation());
    }
    handlePagin(param){
        let any = this.state.any;
        this.props.dispatch(FetchPromo(param,''));
    }
    handleSearch(e){
        e.preventDefault();
    }
    handleDelete(e,id){
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
               this.props.dispatch(deletePromo(id))
            }
        })

    }

    render(){
        const {current_page,data,from,last_page,per_page,to,total} = this.props.promo;
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        return (
            <Layout page="Promo">
                <div className="col-12 box-margin">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={this.handleSearch} noValidate>
                                <div className="row">
                                    <div className="col-10 col-xs-10 col-md-3">
                                        <div className="form-group">
                                            <label>Search</label>
                                            <input type="text" className="form-control" name="any" defaultValue={localStorage.getItem('any_promo')}/>
                                        </div>
                                    </div>
                                    <div className="col-2 col-xs-2 col-md-3">
                                        <div className="form-group">
                                            <button style={{marginTop:"27px",marginRight:"2px"}} type="submit" className="btn btn-primary"><i className="fa fa-search"/></button>
                                            <button style={{marginTop:"27px"}} type="button" onClick={(e)=>this.handleAdd(e)} className="btn btn-primary"><i className="fa fa-plus"/></button>
                                        </div>
                                    </div>
                                </div>

                            </form>
                            {
                                !this.props.isLoading?(
                                    <div className="row">
                                        {
                                            (
                                                total !== '0'?
                                                    typeof data === 'object' ?
                                                        data.map((v,i)=>{
                                                            let arrLok = v.lokasi.split(',');
                                                            return(
                                                                <div className="col-xl-3 col-md-6 box-margin" key={i}>
                                                                    <div className="card">
                                                                        <div className="social-widget">
                                                                            <div className={'bg-success p-3 text-center text-white font-30'}>
                                                                                <img src={v.gambar==='-'?'https://icoconvert.com/images/noimage2.png':`${HEADERS.URL+v.gambar}`} style={{height:"120px"}} alt=""/>
                                                                            </div>
                                                                            <div className="row">
                                                                                <div className="col-8 text-left">
                                                                                    <div className="p-2">
                                                                                        <p style={{fontSize:"12px"}}>{v.id_promo}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-4 text-center">
                                                                                    <div className="p-2">
                                                                                        <div className="dashboard-dropdown">
                                                                                            <div className="dropdown">
                                                                                                <button style={{marginTop:"-7px"}} className="btn dropdown-toggle" type="button" id="dashboardDropdown50" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="ti-more"></i></button>
                                                                                                <div className="dropdown-menu dropdown-menu-right"
                                                                                                     aria-labelledby="dashboardDropdown50">
                                                                                                    <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.handleEdit(e,v.id_promo)}><i className="ti-pencil-alt"/> Edit</a>
                                                                                                    <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.handleDelete(e,v.id_promo)}><i className="ti-trash"></i> Delete</a>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="row">
                                                                                <div className="col-12 text-left">
                                                                                    <div className="p-2">
                                                                                        <table className="table" style={{padding:0,border:"none"}}>
                                                                                            <thead>
                                                                                            <tr>
                                                                                                <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}>Kategori</th>
                                                                                                <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}>{v.category}</th>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}>Lokasi</th>
                                                                                                <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}> {arrLok.length > 3 ? `${arrLok[0]},${arrLok[1]},${arrLok[2]} ...` : v.lokasi}</th>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}>Tgl Mulai</th>
                                                                                                <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}> {v.periode==="1"?'-':moment(v.daritgl).format("yyyy-MM-DD HH:mm:ss")}</th>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}>Tgl Selesai</th>
                                                                                                <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}> {v.periode==="1"?'-':moment(v.sampaitgl).format("yyyy-MM-DD HH:mm:ss")}</th>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}>Member</th>
                                                                                                <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}> {v.member==='0'?'-':v.member}</th>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}>Periode</th>
                                                                                                <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}> {v.periode==='1'?'Tanpa Periode':'-'}</th>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}>Catatan</th>
                                                                                                <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}> {v.keterangan.length>20?`${v.keterangan.substring(0,20)} ...` : v.keterangan}</th>
                                                                                            </tr>
                                                                                            </thead>
                                                                                        </table>
                                                                                    </div>
                                                                                </div>


                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                        : "No data." : <div className="col-md-12">
                                                        <h1 className="text-center">No Data</h1>
                                                    </div>
                                            )
                                        }
                                    </div>
                                ):<Preloader/>
                            }
                            <div style={{"marginTop":"20px","float":"right"}}>
                                <Paginationq
                                    current_page={current_page}
                                    per_page={per_page}
                                    total={total}
                                    callback={this.handlePagin.bind(this)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <FormPromo
                    detail={this.props.promo_detail}
                    kategori={this.props.promo_kategori}
                    kel_barang={this.props.kel_barang}
                    supplier={this.props.supplier}
                    lokasi={this.props.lokasi}

                />

            </Layout>
        );
    }

}



const mapStateToProps = (state) => {
    return {
        authenticated: state.auth,
        promo:state.promoReducer.data,
        promo_kategori:state.promoReducer.data_kategori,
        promo_detail:state.promoReducer.detail,
        isLoading: state.promoReducer.isLoading,
        auth: state.auth,
        kel_barang:state.groupProductReducer.data,
        supplier:state.supplierReducer.dataSupllier,
        lokasi:state.locationReducer.allData,
    }
}

export default connect(mapStateToProps)(Promo)