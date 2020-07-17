import React,{Component} from 'react';
import connect from "react-redux/es/connect/connect";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import FormProduct from "components/App/modals/masterdata/product/form_product";
import {FetchGroupProduct} from "redux/actions/masterdata/group_product/group_product.action";
// import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import "jspdf-autotable";
import {to_pdf, toRp} from "helper";
import {FetchLocation} from "redux/actions/masterdata/location/location.action";
import {FetchProduct,deleteProduct} from "redux/actions/masterdata/product/product.action";
import Paginationq from "helper";
import {FetchSupplierAll} from "redux/actions/masterdata/supplier/supplier.action";
import {FetchSubDepartmentAll} from "redux/actions/masterdata/department/sub_department.action";
import Swal from "sweetalert2";
import {
    FetchProductDetail,
    FetchProductEdit,
    setProductEdit
} from "redux/actions/masterdata/product/product.action";
import DetailProduct from "../../../../modals/masterdata/product/detail_product";
import {FetchCustomerPrice} from "redux/actions/masterdata/customer/customer.action";
import CustomerPrice from "../../../../modals/masterdata/customer/customer_price";
import {FetchProductCode} from "../../../../../../redux/actions/masterdata/product/product.action";

class ListProduct extends Component{
    constructor(props){
        super(props);
        this.handlesearch = this.handlesearch.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.state = {
            isExcel : false,
            array1: [],
            byValue : '',
            searchBy: [
                {id: 1, value: "kd_brg",label:'Code'},
                {id: 2, value: "barcode", label:'Barcode'},
                {id: 3, value: "nm_brg", label:'Name'},
            ],
            detail:{}
        }
    }

    handlePageChange(pageNumber){
        this.props.dispatch(FetchProduct(pageNumber));
    }
    handleDelete = (e,kode) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                this.props.dispatch(deleteProduct(kode));
            }
        })
    };
    handleEdit = (e,kode) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formProduct"));
        this.props.dispatch(FetchGroupProduct(1,''));
        this.props.dispatch(FetchLocation());
        this.props.dispatch(FetchSupplierAll());
        this.props.dispatch(FetchSubDepartmentAll());
        this.props.dispatch(FetchProductEdit(kode));
        this.props.dispatch(FetchProductCode());

    };
    handlesearch(event){
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        let any = data.get('field_any');
        let by = data.get('by_product');
        localStorage.setItem('any_product',`${any}`);
        localStorage.setItem('by_product',`${by}`);
        if(any!==''||any!==null||any!==undefined){
            this.props.dispatch(FetchProduct(1,by,any));
        }else{
            this.props.dispatch(FetchProduct(1,'',''));
        }
    }

    loc_detail(e,kode) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("detailProduct"));
        this.props.dispatch(FetchProductDetail(kode));
    }
    handlePriceCustomer(e,kode,nm_brg){
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("CustomerPrice"));
        localStorage.setItem("nm_brg_price_customer",nm_brg);
        localStorage.setItem("kd_brg_price_customer",kode);
        this.props.dispatch(FetchCustomerPrice(kode,1,''));
    }
    toggleModal(e) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formProduct"));
        this.props.dispatch(FetchGroupProduct(1,''));
        this.props.dispatch(FetchLocation());
        this.props.dispatch(FetchSupplierAll());
        this.props.dispatch(FetchSubDepartmentAll());
        this.props.dispatch(setProductEdit([]));
        this.props.dispatch(FetchProductCode());
    }

    exportPDF = () => {
        let stringHtml = '',tprice=0;
        stringHtml+= `<h3 align="center"><center>PRODUCT REPORT</center></h3>`;
        stringHtml+= `<h3 align="center">PT NETINDO MEDIATAMA PERKASA</h3>`;
        const headers = [["CODE", "NAME","GROUP","SUPPLIER","SUB DEPT","PRICE"]];
        const data = typeof this.props.data.data === 'object'?this.props.data.data.map(elt=> [
            elt.kd_brg, elt.nm_brg,elt.kel_brg,elt.group1,elt.group2,Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(elt.hrg_beli)
        ]):'';
        const footer =["TOTAL","","","","",tprice];
        to_pdf(
            "product_report",
            stringHtml,
            headers,
            data,
            footer
        );
    }

    render(){
        const loc_delete = this.handleDelete;
        const loc_edit = this.handleEdit;
        const {total,last_page,per_page,current_page,from,to,data} = this.props.data;
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        console.log("NYOKOT CODE",this.props.productCode);
        return (
            <div>
                <form onSubmit={this.handlesearch} noValidate>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="exampleFormControlSelect1">Serach By</label>
                                <select className="form-control form-control-lg" id="by_product" name="by_product">
                                    {
                                        this.state.searchBy.map((v,i)=>{
                                            return (<option key={i} value={v.value} selected={localStorage.getItem('by_product')===v.value?true:false}>{v.label}</option>)
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="col-10 col-xs-10 col-md-3">
                            <div className="form-group">
                                <label>Search</label>
                                <input type="text" className="form-control form-control-lg" name="field_any" defaultValue={localStorage.getItem('any_product')}/>
                            </div>
                        </div>
                        <div className="col-2 col-xs-4 col-md-4">
                            <div className="form-group">
                                <button style={{marginTop:"27px",marginRight:"2px"}} type="submit" className="btn btn-primary"><i className="fa fa-search"></i></button>
                                <button style={{marginTop:"27px",marginRight:"2px"}} type="button" onClick={(e)=>this.toggleModal(e)} className="btn btn-primary"><i className="fa fa-plus"></i></button>
                                <button style={{marginTop:"27px",marginRight:"2px"}} type="button" onClick={this.exportPDF} className="btn btn-primary">Export PDF</button>

                                <ReactHTMLTableToExcel
                                    className="btn btn-primary btnBrg"
                                    table="emp"
                                    filename="barang"
                                    sheet="barang"
                                    buttonText="export excel">
                                </ReactHTMLTableToExcel>
                            </div>
                        </div>


                    </div>

                </form>
                <div className="table-responsive" style={{overflowX: "auto"}}>
                    <table className="table table-hover"  id="emp" style={{display:"none"}}>
                        <thead className="bg-light">
                        <tr>
                            <th className="text-black" style={columnStyle}>Code</th>
                            <th className="text-black" style={columnStyle}>Name</th>
                            <th className="text-black" style={columnStyle}>Group</th>
                            <th className="text-black" style={columnStyle}>Supplier</th>
                            <th className="text-black" style={columnStyle}>Sub Dept</th>
                            <th className="text-black" style={columnStyle}>Purchase Price</th>
                            <th className="text-black" style={columnStyle}>Category</th>
                            <th className="text-black" style={columnStyle}>Stock Min</th>
                            <th className="text-black" style={columnStyle}>Product Type</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            (
                                typeof data === 'object' ?
                                    data.map((v,i)=>{
                                        return(
                                            <tr key={i}>
                                                <td style={columnStyle}>{v.kd_brg}</td>
                                                <td style={columnStyle}>{v.nm_brg}</td>
                                                <td style={columnStyle}>{v.kel_brg}</td>
                                                <td style={columnStyle}>{v.group1}</td>
                                                <td style={columnStyle}>{v.group2}</td>
                                                <td style={columnStyle}>{toRp(v.hrg_beli)}</td>
                                                <td style={columnStyle}>{v.kategori}</td>
                                                <td style={columnStyle}>{v.stock_min}</td>
                                                <td style={columnStyle}>{v.jenis}</td>
                                            </tr>
                                        )
                                    })
                                    : "No data."
                            )
                        }
                        </tbody>
                    </table>
                    <table className="table table-hover table-bordered">
                        <thead className="bg-light">
                        <tr>
                            <th className="text-black" style={columnStyle}>#</th>
                            <th className="text-black" style={columnStyle}>Code</th>
                            <th className="text-black" style={columnStyle}>Name</th>
                            <th className="text-black" style={columnStyle}>Group</th>
                            <th className="text-black" style={columnStyle}>Supplier</th>
                            <th className="text-black" style={columnStyle}>Sub Dept</th>

                            <th className="text-black" style={columnStyle}>Category</th>
                            <th className="text-black" style={columnStyle}>Stock Min</th>
                            <th className="text-black" style={columnStyle}>Product Type</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            (
                                typeof data === 'object' ?
                                    data.map((v,i)=>{
                                        return(
                                            <tr key={i}>
                                                <td style={columnStyle}>
                                                    <div className="btn-group">
                                                        <button className="btn btn-primary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            Action
                                                        </button>
                                                        <div className="dropdown-menu">
                                                            <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.handlePriceCustomer(e,v.kd_brg,v.nm_brg)}>Set Harga Customer</a>
                                                            <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.loc_detail(e,v.kd_brg)}>Detail</a>
                                                            <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>loc_edit(e,v.kd_brg)}>Edit</a>
                                                            <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>loc_delete(e,v.kd_brg)}>Delete</a>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={columnStyle}>{v.kd_brg}</td>
                                                <td style={columnStyle}>{v.nm_brg}</td>
                                                <td style={columnStyle}>{v.kel_brg}</td>
                                                <td style={columnStyle}>{v.subdept}</td>
                                                <td style={columnStyle}>{v.supplier}</td>

                                                <td style={columnStyle}>{v.kategori}</td>
                                                <td style={columnStyle}>{v.stock_min}</td>
                                                <td style={columnStyle}>{v.jenis}</td>
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
                <FormProduct
                    data={this.props.group}
                    dataLocation={this.props.location}
                    dataSupplier={this.props.supplier}
                    dataSubDept={this.props.subDept}
                    dataEdit={this.props.productEdit}
                    productCode={this.props.productCode}
                />
                <DetailProduct dataDetail={this.props.productDetail}/>
                <CustomerPrice dataCustomerPrice={this.props.customerPrice}/>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        isOpen:state.modalReducer,
        location:state.locationReducer.data,
        supplier:state.supplierReducer.dataAll,
        subDept:state.subDepartmentReducer.all,
        productEdit:state.productReducer.dataEdit,
        productDetail:state.productReducer.dataDetail,
        customerPrice:state.customerReducer.dataPrice,
        productCode:state.productReducer.productCode
    }
}

export default connect(mapStateToProps)(ListProduct)
