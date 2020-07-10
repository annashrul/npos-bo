import React,{Component} from 'react';
import {toRp} from "../../../../../helper";
import connect from "react-redux/es/connect/connect";
import {FetchPriceProduct} from "../../../../../actions/masterdata/price_product/price_product.action";
import {ModalToggle, ModalType} from "../../../../../actions/modal.action";
import Paginationq from "../../../../../helper";

class ListPriceProduct extends Component{
    constructor(props){
        super(props);
        this.handlesearch = this.handlesearch.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }
    toggleModal(e) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formPriceProduct"));
    }
    handlePageChange(pageNumber){
        console.log(`active page is ${pageNumber}`);
        let any = localStorage.getItem('any_price_product');
        if(any!==''){
            this.props.dispatch(FetchPriceProduct(pageNumber,any));
        }else{
            this.props.dispatch(FetchPriceProduct(pageNumber,''));
        }

    }
    handlesearch(e){
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        let any = data.get('field_any');
        localStorage.setItem('any_price_product',`${any}`);
        if(any!==''||any!==null||any!==undefined){
            this.props.dispatch(FetchPriceProduct(1,any));
        }else{
            this.props.dispatch(FetchPriceProduct(1,''));
        }
    }
    handleDelete = (e,kode) => {
        e.preventDefault();
    };
    handleEdit = (e,kode) => {
        e.preventDefault();
    };

    render(){
        const loc_delete = this.handleDelete;
        const loc_edit = this.handleEdit;
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        const {total,last_page,per_page,current_page,from,to,data} = this.props.data;
        return (
            <div>
                <form onSubmit={this.handlesearch} noValidate>
                    <div className="row">
                        <div className="col-10 col-xs-10 col-md-3">
                            <div className="form-group">
                                <label>Search</label>
                                <input type="text" className="form-control form-control-lg" name="field_any" defaultValue={localStorage.getItem('any_price_product')}/>
                            </div>
                        </div>
                        <div className="col-2 col-xs-4 col-md-4">
                            <div className="form-group">
                                <button style={{marginTop:"27px",marginRight:"2px"}} type="submit" className="btn btn-primary"><i className="fa fa-search"></i></button>
                                <button style={{marginTop:"27px",marginRight:"2px"}} type="button" onClick={(e)=>this.toggleModal(e)} className="btn btn-primary"><i className="fa fa-plus"></i></button>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="table-responsive" style={{overflowX: "auto"}}>
                    <table className="table table-hover table-bordered">
                        <thead className="bg-light">
                        <tr>
                            <th className="text-black" style={columnStyle} rowSpan="2">#</th>
                            <th className="text-black" style={columnStyle} rowSpan="2">Code</th>
                            <th className="text-black" style={columnStyle} rowSpan="2">Barcode</th>
                            <th className="text-black" style={columnStyle} rowSpan="2">Location</th>
                            <th className="text-black" style={columnStyle} colSpan="4">Selling Price</th>

                            <th className="text-black" style={columnStyle} rowSpan="2">PPN</th>
                            <th className="text-black" style={columnStyle} rowSpan="2">Service</th>
                        </tr>
                        <tr>
                            <td className="text-black" style={columnStyle}>1</td>
                            <td className="text-black" style={columnStyle}>2</td>
                            <td className="text-black" style={columnStyle}>3</td>
                            <td className="text-black" style={columnStyle}>4</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            (
                                typeof data === 'object' ?
                                    data.map((v,i)=>{
                                        return(
                                            <tr key={i}>
                                                <td style={columnStyle}>{/* Example split danger button */}
                                                    <div className="btn-group">
                                                        <button className="btn btn-primary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            Action
                                                        </button>
                                                        <div className="dropdown-menu">
                                                            <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>loc_edit(e,v.kode)}>Edit</a>
                                                            <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>loc_delete(e,v.kode)}>Delete</a>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={columnStyle}>{v.kd_brg}</td>
                                                <td style={columnStyle}>{v.barcode?v.barcode:'-'}</td>
                                                <td style={columnStyle}>{v.lokasi?v.lokasi:'-'}</td>
                                                <td style={columnStyle}>{toRp(v.harga)}</td>
                                                <td style={columnStyle}>{toRp(v.harga2)}</td>
                                                <td style={columnStyle}>{toRp(v.harga3)}</td>
                                                <td style={columnStyle}>{toRp(v.harga4)}</td>
                                                <td style={columnStyle}>{v.ppn}</td>
                                                <td style={columnStyle}>{v.service}</td>

                                            </tr>
                                        )
                                    })
                                    : "No data."
                            )
                        }
                        </tbody>
                    </table>
                </div>
                <div style={{"marginTop":"20px","float":"right"}}>
                    <Paginationq
                        current_page={current_page}
                        per_page={per_page}
                        total={total}
                        callback={this.handlePageChange.bind(this)}
                    />
                </div>
            </div>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        isOpen:state.modalReducer,
    }
}
export default connect(mapStateToProps)(ListPriceProduct);