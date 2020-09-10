import React,{Component} from 'react';
import connect from "react-redux/es/connect/connect";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import FormProduct from "components/App/modals/masterdata/product/form_product";
import {FetchGroupProduct} from "redux/actions/masterdata/group_product/group_product.action";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import "jspdf-autotable";
import {to_pdf} from "helper";
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
import DetailProduct from "components/App/modals/masterdata/product/detail_product";
import {FetchCustomerPrice} from "redux/actions/masterdata/customer/customer.action";
import CustomerPrice from "components/App/modals/masterdata/customer/customer_price";
import {FetchProductCode} from "redux/actions/masterdata/product/product.action";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import moment from "moment";
import imgY from 'assets/status-Y.png';
import imgT from 'assets/status-T.png';
import {rangeDate} from "helper";
import Select from "react-select";
import {
    UncontrolledButtonDropdown,
    DropdownMenu,
    DropdownItem,
    DropdownToggle
} from 'reactstrap';

class ListProduct extends Component{
    constructor(props){
        super(props);
        this.HandleChangeSortBy = this.HandleChangeSortBy.bind(this);
        this.handlesearch = this.handlesearch.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleChecked = this.handleChecked.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSearchBy = this.handleSearchBy.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.state = {
            isExcel : false,
            array1: [],
            byValue : '',
            startDate:moment(new Date()).format("yyyy-MM-DD"),
            endDate:moment(new Date()).format("yyyy-MM-DD"),
            sort_by_data: [],
            sort_by:'',
            semua_periode:false,
            detail:{},
            any_kode_barang:"",
            any_nama_barang:"",
            any_kelompok_barang:"",
            any_supplier_barang:"",
            any_subdept_barang:"",
            any_kategori_barang:"",
        }
    }

    componentWillMount(){
        let sort_by=[];

        let sort_by_data=[
            {value: "asc",label:'Teratas'},
            {value: "desc", label:'Terbawah'},
        ];

        sort_by_data.map((i) => {
            sort_by.push({
                value: i.value,
                label: i.label
            });
            return null;
        });
        this.setState({
            sort_by_data: sort_by,
        });
    }

    componentDidMount(){
        if(localStorage.any_master_kode_barang!==undefined&&localStorage.any_master_kode_barang!==null&&localStorage.any_master_kode_barang!==''){
            this.setState({any_kode_barang:localStorage.any_master_kode_barang});
        }
        if(localStorage.any_master_nama_barang!==undefined&&localStorage.any_master_nama_barang!==null&&localStorage.any_master_nama_barang!==''){
            this.setState({any_nama_barang:localStorage.any_master_nama_barang});
        }
        if(localStorage.any_master_kelompok_barang!==undefined&&localStorage.any_master_kelompok_barang!==null&&localStorage.any_master_kelompok_barang!==''){
            this.setState({any_kelompok_barang:localStorage.any_master_kelompok_barang});
        }
        if(localStorage.any_master_supplier_barang!==undefined&&localStorage.any_master_supplier_barang!==null&&localStorage.any_master_supplier_barang!==''){
            this.setState({any_supplier_barang:localStorage.any_master_supplier_barang});
        }
        if(localStorage.any_master_subdept_barang!==undefined&&localStorage.any_master_subdept_barang!==null&&localStorage.any_master_subdept_barang!==''){
            this.setState({any_subdept_barang:localStorage.any_master_subdept_barang});
        }
        if(localStorage.any_master_kategori_barang!==undefined&&localStorage.any_master_kategori_barang!==null&&localStorage.any_master_kategori_barang!==''){
            this.setState({any_kategori_barang:localStorage.any_master_kategori_barang});
        }
        if(localStorage.date_from_master_product!==undefined&&localStorage.date_from_master_product!==null){
            this.setState({startDate:localStorage.date_from_master_product})
        }
        if(localStorage.date_to_master_product!==undefined&&localStorage.date_to_master_product!==null){
            this.setState({endDate:localStorage.date_to_master_product})
        }
        if(localStorage.semua_periode_barang!==undefined&&localStorage.semua_periode_barang!==null){
            this.setState({semua_periode:localStorage.semua_periode_barang})
        }
        if (localStorage.sort_by_barang !== undefined && localStorage.sort_by_barang !== '') {
            this.setState({
                sort_by: localStorage.sort_by_barang
            })
        }
        
    }
    handleChecked(event){
        localStorage.setItem("semua_periode_barang",event.target.checked);
        
        let column=event.target.name;
        // let value=event.target.name;
        this.setState({
            [column]: event.target.checked,
        });
    }
    handleChange(event){
        let column=event.target.name;
        let value=event.target.value;
        this.setState({
            [column]: value,
        });


    }
    HandleChangeSortBy(type) {
        this.setState({
            sort_by: type.value,
        });
        localStorage.setItem('sort_by_barang', type.value);
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
    handleSearchBy(event){
        let column = event.target.name;
        let val = event.target.value;
        let where = '';
        if(column==='kategori_barang'){
            localStorage.removeItem("jenis_barang");
            localStorage.removeItem("kelompok_barang");
            localStorage.setItem("kategori_barang",val);
        }
        if(column==='jenis_barang'){
            localStorage.removeItem("kelompok_barang");
            localStorage.removeItem("kategori_barang");
            let jenis = localStorage.setItem("jenis_barang",val);
            if(where!==''){where+='&';}
            where+=`searchby=jenis&q=${jenis}`;
        }
        if(column==='kelompok_barang'){
            localStorage.removeItem("kategori_barang");
            localStorage.removeItem("jenis_barang");
            localStorage.setItem("kelompok_barang",val);
        }
        this.props.dispatch(FetchProduct(1,where));

    }
    handlesearch(event){
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        let any = data.get('field_any');
        let sortName = data.get('sort_name');
        let dateFrom=this.state.startDate;
        let dateTo=this.state.endDate;
        localStorage.setItem('any_product',`${any}`);
        localStorage.setItem('by_product',`${sortName}`);
        localStorage.setItem("startDateProduct",`${dateFrom}`);
        localStorage.setItem("endDateProduct",`${dateTo}`);
        
        let where='';
        if(this.state.semua_periode===false){
            if(dateFrom!==null&&dateTo!==null){
                if(where!==''){where+='&';}
                where+=`datefrom=${dateFrom}&dateto=${dateTo}`;
            }
        }
        this.props.dispatch(FetchProduct(1,where));
    }
    handleEnter(column){
        let where='';
        let que = 'any_master';
        let kode=this.state.any_kode_barang;
        let nama=this.state.any_nama_barang;
        let kelompok=this.state.any_kelompok_barang;
        let supplier=this.state.any_supplier_barang;
        let subdept=this.state.any_subdept_barang;
        let kategori=this.state.any_kategori_barang;
        if(kode!==''||nama!==''||kelompok!==''||supplier!==''||subdept!==''||kategori!==''){
            if(column==='any_kode_barang'){
                if(where!==''){where+='&';}
                where+=`searchby=kd_brg&q=${kode}`;
                localStorage.setItem(`${que}_kode_barang`,kode);
            }
            if(column==='any_nama_barang'){
                if(where!==''){where+='&';}
                where+=`searchby=nm_brg&q=${nama}`;
                localStorage.setItem(`${que}_nama_barang`,nama);
            }
            if(column==='any_kelompok_barang'){
                if(where!==''){where+='&';}
                where+=`searchby=kel_brg&q=${kelompok}`;
                localStorage.setItem(`${que}_kelompok_barang`,kelompok);
            }
            if(column==='any_supplier_barang'){
                if(where!==''){where+='&';}
                where+=`searchby=supplier&q=${supplier}`;
                localStorage.setItem(`${que}_supplier_barang`,supplier);
            }
            if(column==='any_subdept_barang'){
                if(where!==''){where+='&';}
                where+=`searchby=subdept&q=${subdept}`;
                localStorage.setItem(`${que}_subdept_barang`,subdept);
            }
            if(column==='any_kategori_barang'){
                if(where!==''){where+='&';}
                where+=`searchby=kategori&q=${kategori}`;
                localStorage.setItem(`${que}_kategori_barang`,kategori);
            }
            this.props.dispatch(FetchProduct(1,where));
        }else{
            localStorage.removeItem(`${que}_kode_barang`);
            localStorage.removeItem(`${que}_nama_barang`);
            localStorage.removeItem(`${que}_kelompok_barang`);
            localStorage.removeItem(`${que}_supplier_barang`);
            localStorage.removeItem(`${que}_subdept_barang`);
            localStorage.removeItem(`${que}_kategori_barang`);
            this.props.dispatch(FetchProduct(1,''));
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
    handleEvent = (event, picker) => {
        const awal = picker.startDate._d.toISOString().substring(0,10);
        const akhir = picker.endDate._d.toISOString().substring(0,10);
        localStorage.setItem("date_from_master_product",`${awal}`);
        localStorage.setItem("date_to_master_product",`${akhir}`);
        this.setState({
            startDate:awal,
            endDate:akhir
        });
    };
    render(){
        const loc_delete = this.handleDelete;
        const loc_edit = this.handleEdit;
        const {total,per_page,current_page,data} = this.props.data;
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        return (
            <div>

                <form onSubmit={this.handlesearch} noValidate>
                    <div className="row">
                        <div className="col-6 col-xs-6 col-md-2">
                            <div className="form-group">
                                <label className="control-label font-12">Urutan Posisi</label>
                                <Select
                                    options={this.state.sort_by_data} onChange={this.HandleChangeSortBy}
                                    value={this.state.sort_by_data.find(op => {return op.value === this.state.sort_by})}
                                />
                            </div>

                        </div>

                        <div className="col-6 col-xs-6 col-md-2">
                            <div className="form-group">
                                <label>Periode Input</label><br/>
                                <label htmlFor="inputState" className="col-form-label"><input name="semua_periode" type="checkbox" checked={localStorage.semua_periode_barang==="true"?true:false} onChange={this.handleChecked}/> semua periode</label>
                            </div>
                        </div>
                        <div className="col-6 col-xs6 col-md-2">
                            <div className="form-group">
                                <label htmlFor=""> Periode </label>
                                <DateRangePicker style={{display:'unset'}} ranges={rangeDate} alwaysShowCalendars={true} onEvent={this.handleEvent}>
                                    <input type="text" className="form-control" name="date_product" value={`${this.state.startDate} to ${this.state.endDate}`} style={{padding: '9px',width: '185px',fontWeight:'bolder'}}/>
                                </DateRangePicker>
                            </div>
                        </div>
                        <div className="col-12 col-xs-12 col-md-4">
                            <div className="form-group">
                                <button style={{marginTop:"27px",marginRight:"2px"}} type="submit" className="btn btn-primary"><i className="fa fa-search"></i></button>
                                <button style={{marginTop:"27px",marginRight:"2px"}} type="button" onClick={(e)=>this.toggleModal(e)} className="btn btn-primary"><i className="fa fa-plus"></i></button>
                                <button style={{marginTop:"27px",marginRight:"2px"}} type="button" onClick={this.exportPDF} className="btn btn-primary"><i className="fa fa-file-pdf-o"></i></button>
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
                    {/*DATA EXCEL*/}
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
                                                <td style={columnStyle}>{v.supplier}</td>
                                                <td style={columnStyle}>{v.subdept}</td>
                                                <td style={columnStyle}>{v.kategori}</td>
                                                <td style={columnStyle}>{v.jenis==='0'? <img alt="netindo" src={imgT} width="20px"/>: <img alt="netindo" src={imgY} width="20px"/>}</td>
                                                <td style={columnStyle}>{v.stock_min}</td>
                                            </tr>
                                        )
                                    })
                                    : "No data."
                            )
                        }
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan="7"></td>
                            <td>0</td>
                            <td></td>
                        </tr>
                        </tfoot>
                    </table>
                    {/*END DATA EXCEL*/}
                    <table className="table table-hover table-bordered" style={{zoom:"80%"}}>
                        <thead className="bg-light">
                        <tr>
                            <th className="text-black" style={columnStyle} colSpan={1}/>
                            <th className="text-black" style={columnStyle}>Kode Barang</th>
                            <th className="text-black" style={columnStyle}>Nama Barang</th>
                            <th className="text-black" style={columnStyle}>Kelompok</th>
                            <th className="text-black" style={columnStyle}>Supplier</th>
                            <th className="text-black" style={columnStyle}>Sub Dept</th>
                            <th className="text-black" style={columnStyle}>Kategori</th>
                            <th className="text-black" style={columnStyle} colSpan={3}/>
                        </tr>
                        <tr>
                            <td className="text-black" style={columnStyle}>No</td>
                            <td><input name="any_kode_barang" value={this.state.any_kode_barang} onChange={this.handleChange} onKeyPress={
                                event=>{
                                    // event.preventDefault();
                                    if(event.key==='Enter'){this.handleEnter('any_kode_barang');}
                                }
                            } style={{width:"150px"}} type="text" className="form-control" placeholder="Kode Barang"/></td>
                            <td><input name="any_nama_barang" value={this.state.any_nama_barang} onChange={this.handleChange} onKeyPress={event=>{if(event.key==='Enter'){this.handleEnter('any_nama_barang');}}} style={{width:"150px"}} type="text" className="form-control" placeholder="Nama Barang"/></td>
                            <td><input name="any_kelompok_barang" value={this.state.any_kelompok_barang} onChange={this.handleChange} onKeyPress={event=>{if(event.key==='Enter'){this.handleEnter('any_kelompok_barang');}}} style={{width:"150px"}} type="text" className="form-control" placeholder="Kelompok"/></td>
                            <td><input name="any_supplier_barang" value={this.state.any_supplier_barang} onChange={this.handleChange} onKeyPress={event=>{if(event.key==='Enter'){this.handleEnter('any_supplier_barang');}}} style={{width:"150px"}} type="text" className="form-control" placeholder="Supplier"/></td>
                            <td><input name="any_subdept_barang" value={this.state.any_subdept_barang} onChange={this.handleChange} onKeyPress={event=>{if(event.key==='Enter'){this.handleEnter('any_subdept_barang');}}} style={{width:"150px"}} type="text" className="form-control" placeholder="Sub Dept"/></td>
                            <td><input name="any_kategori_barang" value={this.state.any_kategori_barang} onChange={this.handleChange} onKeyPress={event=>{if(event.key==='Enter'){this.handleEnter('any_kategori_barang');}}} style={{width:"150px"}} type="text" className="form-control" placeholder="Kategori"/></td>
                            <td className="text-black" style={columnStyle}>Jenis</td>
                            <td className="text-black" style={columnStyle}>Stock Min</td>
                            <td className="text-black" style={columnStyle}>#</td>
                        </tr>
                        </thead>
                        <tbody>

                        {
                            (
                                typeof data === 'object' ? data.length > 0 ?
                                    data.map((v,i)=>{
                                        return(
                                            <tr key={i}>
                                                <td style={columnStyle}> {i+1 + (10 * (parseInt(current_page,10)-1))}</td>
                                                <td style={columnStyle}>{v.kd_brg}</td>
                                                <td style={columnStyle}>{v.nm_brg}</td>
                                                <td style={columnStyle}>{v.kel_brg}</td>
                                                <td style={columnStyle}>{v.supplier}</td>
                                                <td style={columnStyle}>{v.subdept}</td>
                                                <td style={columnStyle}>{v.kategori}</td>
                                                <td style={columnStyle}>{v.jenis==='0'? <img alt="netindo" src={imgT} width="20px"/>: <img alt="netindo" src={imgY} width="20px"/>}</td>
                                                <td style={columnStyle}>{v.stock_min}</td>
                                                <td style={columnStyle}>
                                                    <div className="btn-group mb-2 mr-2">
                                                        <UncontrolledButtonDropdown>
                                                        <DropdownToggle caret>
                                                            Aksi
                                                        </DropdownToggle>
                                                        <DropdownMenu>
                                                            <DropdownItem onClick={(e)=>this.handlePriceCustomer(e,v.kd_brg,v.nm_brg)}>Set Harga Customer</DropdownItem>
                                                            <DropdownItem  onClick={(e)=>this.loc_detail(e,v.kd_brg)}>Detail</DropdownItem>
                                                            <DropdownItem onClick={(e)=>loc_edit(e,v.kd_brg)}>Edit</DropdownItem>
                                                            <DropdownItem onClick={(e)=>loc_delete(e,v.kd_brg)}>Delete</DropdownItem>
                                                        </DropdownMenu>
                                                        </UncontrolledButtonDropdown>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                    : "No data." : "No data."
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
        supplier:state.supplierReducer.dataSupllier,
        subDept:state.subDepartmentReducer.all,
        productEdit:state.productReducer.dataEdit,
        productDetail:state.productReducer.dataDetail,
        customerPrice:state.customerReducer.dataPrice,
        productCode:state.productReducer.productCode
    }
}

export default connect(mapStateToProps)(ListProduct)
