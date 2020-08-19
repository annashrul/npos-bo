import React,{Component} from 'react';
import {deletePromo, FetchPromo} from "redux/actions/masterdata/promo/promo.action";
import connect from "react-redux/es/connect/connect";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import Paginationq, {statusQ} from "helper";
import FormPromo from "components/App/modals/masterdata/promo/form_promo";
import Swal from "sweetalert2";
import moment from 'moment';
class ListPromo extends Component{
    constructor(props){
        super(props);
        this.toggleModal = this.toggleModal.bind(this);
        this.state={
            detail:{}
        }
    }

    toggleModal(e) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formPromo"));
    }

    render(){
        const {current_page,data,from,last_page,per_page,to,total} = this.props.data;
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        const kategori = this.props.data_kategori;
        return (
            <div>
                <form onSubmit={this.handlesearch} noValidate>
                    <div className="row">
                        <div className="col-10 col-xs-10 col-md-3">
                            <div className="form-group">
                                <label>Search</label>
                                <input type="text" className="form-control" name="any" defaultValue={localStorage.getItem('any_promo')}/>
                            </div>
                        </div>
                        <div className="col-2 col-xs-2 col-md-3">
                            <div className="form-group">
                                <button style={{marginTop:"27px",marginRight:"2px"}} type="submit" className="btn btn-primary"><i className="fa fa-search"></i></button>
                                <button style={{marginTop:"27px"}} type="button" onClick={(e)=>this.toggleModal(e)} className="btn btn-primary"><i className="fa fa-plus"></i></button>
                            </div>
                        </div>
                    </div>

                </form>
                <div className="row">
                    {
                        (
                            total !== '0'?
                            typeof data === 'object' ?
                                data.map((v,i)=>{
                                    return(
                                        <div className="col-xl-3 col-md-6 height-card box-margin" key={i}>
                                            <div className="card">
                                                <div className="social-widget">
                                                    <div className={'bg-success p-3 text-center text-white font-30'}>
                                                        <img src={v.gambar==='-'?'https://icoconvert.com/images/noimage2.png':v.gambar} style={{height:"120px"}} alt=""/>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-8 text-left">
                                                            <div className="p-2">
                                                                <p style={{fontSize:"12px"}}>{v.akun}</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-4 text-center">
                                                            <div className="p-2">
                                                                <div className="dashboard-dropdown">
                                                                    <div className="dropdown">
                                                                        <button style={{marginTop:"-7px"}} className="btn dropdown-toggle" type="button" id="dashboardDropdown50" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="ti-more"></i></button>
                                                                        <div className="dropdown-menu dropdown-menu-right"
                                                                             aria-labelledby="dashboardDropdown50">
                                                                            <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.handleEdit(
                                                                                e,v.id_promo,v.akun,v.charge_debit,v.charge_kredit,v.edc,v.foto,v.status,v.nama
                                                                            )}><i className="ti-pencil-alt"></i> Edit</a>
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
                                                                        <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}>Category sd</th>
                                                                        {/*{kategori.filter(cat => cat.kode===v.category).map(filteredCat => (*/}
                                                                            {/*// <li>*/}
                                                                            {/*// {filteredName}*/}
                                                                            {/*// </li>*/}
                                                                            {/*<th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}> {filteredCat.title}</th>*/}
                                                                        {/*))}*/}
                                                                    </tr>
                                                                    <tr>
                                                                        <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}>Location</th>
                                                                        <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}> {v.lokasi}</th>
                                                                    </tr>
                                                                    <tr>
                                                                        <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}>Date start</th>
                                                                        <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}> {moment(v.daritgl).format("yyyy-MM-DD")}</th>
                                                                    </tr>
                                                                    <tr>
                                                                        <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}>Date end</th>
                                                                        <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}> {moment(v.sampaitgl).format("yyyy-MM-DD")}</th>
                                                                    </tr>
                                                                    <tr>
                                                                        <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}>Member</th>
                                                                        <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}> {v.member}</th>
                                                                    </tr>
                                                                    <tr>
                                                                        <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}>Periode</th>
                                                                        <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}> {v.periode}</th>
                                                                    </tr>
                                                                    <tr>
                                                                        <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}>Note</th>
                                                                        <th style={{paddingTop:"3px",paddingBottom:"3px",paddingLeft:0,paddingRight:0,borderTop:"none"}}> {v.keterangan}</th>
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
                <div style={{"marginTop":"20px","float":"right"}}>
                    <Paginationq
                        current_page={current_page}
                        per_page={per_page}
                        total={total}
                        callback={this.handlePageChange.bind(this)}
                    />
                </div>
                 <FormPromo token={this.props.token} detail={this.state.detail} kategori={kategori}/>
            </div>
        );
    }
}

export default connect()(ListPromo)
