import React,{Component} from 'react';
import {toRp} from "helper";
import connect from "react-redux/es/connect/connect";
import {FetchPriceProduct} from "redux/actions/masterdata/price_product/price_product.action";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import Paginationq from "helper";
import FormPriceProduct from "../../../../modals/masterdata/price_product/form_price_product";

class ListPriceProduct extends Component{
    constructor(props){
        super(props);
        this.handlesearch = this.handlesearch.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.state={
            detail:{}
        }
    }

    handlePageChange(pageNumber){
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
    handleEdit = (e,id,harga,ppn,service,harga2,harga3,harga4) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formPriceProduct"));
        this.setState({
            detail:{
                "id":id,
                "harga":harga,
                "ppn":ppn,
                "service":harga,
                "harga2":harga2,
                "harga3":harga3,
                "harga4":harga4,
            }
        })
    };

    render(){
        const centerStyle = {verticalAlign: "middle", textAlign: "center"};
        const leftStyle = {verticalAlign: "middle", textAlign: "left"};
        const rightStyle = {verticalAlign: "middle", textAlign: "right",whiteSpace: "nowrap"};
        const {
            total,
            // last_page,
            per_page,
            current_page,
            // from,
            // to,
            data
        } = this.props.data;
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
                                <button style={{marginTop:"27px",marginRight:"2px"}} type="submit" className="btn btn-primary"><i className="fa fa-search"/></button>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="table-responsive" style={{overflowX: "auto"}}>
                    <table className="table table-hover table-bordered">
                        <thead className="bg-light">
                        <tr>
                            <th className="text-black" style={centerStyle} rowSpan="2">#</th>
                            <th className="text-black" style={centerStyle} rowSpan="2">Kode</th>
                            <th className="text-black" style={centerStyle} rowSpan="2">Barcode</th>
                            <th className="text-black" style={centerStyle} rowSpan="2">Nama</th>
                            <th className="text-black" style={centerStyle} rowSpan="2">Lokasi</th>
                            <th className="text-black" style={centerStyle} colSpan="4">Harga Jual</th>
                            <th className="text-black" style={centerStyle} rowSpan="2">PPN</th>
                            <th className="text-black" style={centerStyle} rowSpan="2">Servis</th>
                        </tr>
                        <tr>
                            <td className="text-black" style={centerStyle}>1</td>
                            <td className="text-black" style={centerStyle}>2</td>
                            <td className="text-black" style={centerStyle}>3</td>
                            <td className="text-black" style={centerStyle}>4</td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            (
                                typeof data === 'object' ?
                                    data.map((v,i)=>{
                                        return(
                                            <tr key={i}>
                                                <td style={centerStyle}>{/* Example split danger button */}
                                                    <div className="btn-group">
                                                        <button className="btn btn-primary btn-sm" type="button"  onClick={(e)=>this.handleEdit(
                                                            e,v.id,v.harga,v.ppn,v.service,v.harga2,v.harga3,v.harga4
                                                        )}>
                                                            Edit
                                                        </button>

                                                    </div>
                                                </td>
                                                <td style={leftStyle}>{v.kd_brg}</td>
                                                <td style={leftStyle}>{v.barcode?v.barcode:'-'}</td>
                                                <td style={leftStyle}>{v.nm_brg?v.nm_brg:'-'}</td>
                                                <td style={leftStyle}>{v.nama_toko?v.nama_toko:'-'}</td>
                                                <td style={rightStyle}>{toRp(v.harga)}</td>
                                                <td style={rightStyle}>{toRp(v.harga2)}</td>
                                                <td style={rightStyle}>{toRp(v.harga3)}</td>
                                                <td style={rightStyle}>{toRp(v.harga4)}</td>
                                                <td style={rightStyle}>{v.ppn}</td>
                                                <td style={rightStyle}>{v.service}</td>
                                            </tr>
                                        )
                                    })
                                    : "No data."
                            )
                        }
                        </tbody>
                    </table>
                    <div style={{"marginTop":"20px","float":"right"}}>
                        <Paginationq
                            current_page={current_page}
                            per_page={per_page}
                            total={total}
                            callback={this.handlePageChange.bind(this)}
                        />
                    </div>
                </div>
                <FormPriceProduct detail={this.state.detail}/>
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