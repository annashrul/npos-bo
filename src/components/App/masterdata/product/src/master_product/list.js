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
import DetailProduct from "components/App/modals/masterdata/product/detail_product";
import {FetchCustomerPrice} from "redux/actions/masterdata/customer/customer.action";
import CustomerPrice from "components/App/modals/masterdata/customer/customer_price";
import {FetchProductCode} from "redux/actions/masterdata/product/product.action";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import moment from "moment";
import imgY from 'assets/status-Y.png';
import imgT from 'assets/status-T.png';
const range = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
    "Last 7 Days": [moment().subtract(6, "days"), moment()],
    "Last 30 Days": [moment().subtract(29, "days"), moment()],
    "This Month": [moment().startOf("month"), moment().endOf("month")],
    "Last Month": [
        moment()
            .subtract(1, "month")
            .startOf("month"),
        moment()
            .subtract(1, "month")
            .endOf("month")
    ],
    "Last Year": [
        moment()
            .subtract(1, "year")
            .startOf("year"),
        moment()
            .subtract(1, "year")
            .endOf("year")
    ]
};
class ListProduct extends Component{
    constructor(props){
        super(props);
        this.handlesearch = this.handlesearch.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSearchBy = this.handleSearchBy.bind(this);
        console.log("CONSTURTOR DATE FROM",localStorage.getItem("startDateProduct")===''?'string kosong':localStorage.getItem("startDateProduct"));
        this.state = {
            isExcel : false,
            array1: [],
            byValue : '',
            startDate:localStorage.getItem("startDateProduct")===''?moment(new Date()).format("yyyy-MM-DD"):localStorage.getItem("startDateProduct"),
            endDate:localStorage.getItem("endDateProduct")===''?moment(new Date()).format("yyyy-MM-DD"):localStorage.getItem("endDateProduct"),
            sortBy: [
                {id: 1, value: "kd_brg",label:'Kode Barang'},
                {id: 2, value: "barcode", label:'Barcode'},
                {id: 3, value: "nm_brg", label:'Nama Barang'},
                {id: 3, value: "deskripsi", label:'Deskripsi'},
                {id: 3, value: "kel_brg", label:'Kelompok'},
                {id: 3, value: "supplier", label:'Supplier'},
                {id: 3, value: "subdept", label:'Sub Dept'},
            ],
            searchJenis: [
                {id: 0, value: "1",label:'Dijual'},
                {id: 1, value: "0", label:'Tidak Dijual'},
            ],
            searchKategori: [
                {id: 0, value: "0",label:'Karton'},
                {id: 1, value: "1", label:'Satuan'},
                {id: 2, value: "2", label:'Paket'},
                {id: 3, value: "3", label:'Servis'},
            ],
            searchKelompok: [
                {id: 0, value: "MAKANAN",label:'Makanan'},
                {id: 1, value: "MINUMAN", label:'Minuman'},
            ],
            semuaPeriode:false,
            detail:{}
        }
    }
    // componentWillUnmount(){
    //     localStorage.removeItem("startDateProduct");
    //     localStorage.removeItem("endDateProduct");
    //     localStorage.removeItem("semuaPeriode");
    //     localStorage.removeItem('any_product');
    //     localStorage.removeItem('by_product');
    //     localStorage.removeItem('kategori_barang');
    //     console.log("################################## REMOVE STORAGE #########################");
    // }
    // componentWillMount(){
    //     this.props.dispatch(FetchProduct(1,''));
    //
    // }
    handleChange(event){
        event.target.checked===true?localStorage.setItem("semuaPeriode","true"):localStorage.setItem("semuaPeriode","false")
        this.setState({
            [event.target.name]: event.target.value,
            semuaPeriode:!this.state.semuaPeriode
        });
        console.log("LOCAL STORAGE",localStorage.getItem("semuaPeriode"));
        console.log("STATE",this.state.semuaPeriode);
        console.log("EVENT",event.target.checked);
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
    handleSearchBy(event){
        let column = event.target.name;
        let val = event.target.value;
        let where = '';
        if(column==='kategori_barang'){
            localStorage.removeItem("jenis_barang");
            localStorage.removeItem("kelompok_barang");
            let kategori = localStorage.setItem("kategori_barang",val);

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
            let kelompok = localStorage.setItem("kelompok_barang",val);
        }
        this.props.dispatch(FetchProduct(1,where));

    }
    handlesearch(event){
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        console.log("DATA FORM",data);
        let any = data.get('field_any');
        let sortName = data.get('sort_name');
        let kategori = data.get("kategori_barang");
        let jenis = data.get("jenis_barang");
        let dateFrom=this.state.startDate;
        let dateTo=this.state.endDate;
        localStorage.setItem('any_product',`${any}`);
        localStorage.setItem('by_product',`${sortName}`);
        localStorage.setItem('jenis_barang',`${jenis}`);
        localStorage.setItem('kategori_barang',`${kategori}`);
        localStorage.setItem("startDateProduct",`${dateFrom}`);
        localStorage.setItem("endDateProduct",`${dateTo}`);
        let where='';
        if(localStorage.getItem("semuaPeriode")==="false" || localStorage.getItem("semuaPeriode")===null){
            if(dateFrom!==null&&dateTo!==null){
                if(where!==''){where+='&';}
                where+=`datefrom=${dateFrom}&dateto=${dateTo}`;
            }
        }
        // if(kategori!==''){
        //     if(where!==''){where+='&';}
        //     where+=`kategori=${kategori}`;
        // }
        // if(jenis!==''){
        //     if(where!==''){where+='&';}
        //     where+=`jenis=${jenis}`;
        // }

        this.props.dispatch(FetchProduct(1,where));
        console.log(where);
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
    handleEvent = (event, picker) => {
        console.log("start: ", picker.startDate);
        console.log("end: ", picker.endDate._d.toISOString());
        // end:  2020-07-02T16:59:59.999Z
        const awal = picker.startDate._d.toISOString().substring(0,10);
        const akhir = picker.endDate._d.toISOString().substring(0,10);
        localStorage.setItem("startDateProduct",`${awal}`);
        localStorage.setItem("endDateProduct",`${akhir}`);
        this.setState({
            startDate:awal,
            endDate:akhir
        });
        // console.log(picker.startDate._d.toISOString());
        // console.log(picker.endDate._d.toISOString());
    };
    render(){
        const loc_delete = this.handleDelete;
        const loc_edit = this.handleEdit;
        const {total,last_page,per_page,current_page,from,to,data} = this.props.data;
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        console.log("TANGGAL",this.state.startDate);
        console.log("TANGGAL",this.state.endDate);



        return (
            <div>

                <form onSubmit={this.handlesearch} noValidate>
                    <div className="row">
                        <div className="col-6 col-xs-6 col-md-3">
                            <div className="form-group">
                                <label htmlFor="exampleFormControlSelect1">Serach By</label>
                                <div className="input-group">
                                    <select className="form-control form-control-lg" id="sort_name" name="sort_name">
                                        {
                                            this.state.sortBy.map((v,i)=>{
                                                return (<option key={i} value={v.value} selected={localStorage.getItem('sort_name')===v.value?true:false}>{v.label}</option>)
                                            })
                                        }
                                    </select>
                                    <select className="form-control form-control-lg" id="sort_by" name="sort_by" onChange={this.handleChange}>
                                        <option value="ASC">ASC</option>
                                        <option value="DESC">DESC</option>
                                    </select>
                                </div>
                            </div>

                        </div>

                        <div className="col-6 col-xs-6 col-md-2">
                            <div className="form-group">
                                <label>Periode Input</label><br/>
                                <label htmlFor="inputState" className="col-form-label"><input name="semua_periode" type="checkbox" checked={localStorage.getItem("semuaPeriode")==="true"?true:false} onChange={this.handleChange}/> semua periode</label>
                            </div>
                        </div>
                        <div className="col-6 col-xs6 col-md-2">
                            <div className="form-group">
                                <label htmlFor=""> Periode </label>
                                <DateRangePicker
                                    ranges={range}
                                    alwaysShowCalendars={true}
                                    onEvent={this.handleEvent}
                                >
                                    <input type="text" className="form-control" name="date_product" value={`${this.state.startDate} to ${this.state.endDate}`}/>
                                    {/*<input type="text" className="form-control" name="date_product" value={`${this.state.startDate} to ${this.state.endDate}`}/>*/}
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
                                                <td style={columnStyle}>{v.subdept}</td>
                                                <td style={columnStyle}>{v.supplier}</td>
                                                <td style={columnStyle}>{v.kategori}</td>
                                                <td style={columnStyle}>{v.jenis==='0'? <img src={imgT} width="20px"/>: <img src={imgY} width="20px"/>}</td>
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
                    <table className="table table-hover table-bordered">
                        <thead className="bg-light">
                        <tr>
                            <th className="text-black" style={columnStyle}>#</th>
                            <th className="text-black" style={columnStyle}>Code</th>
                            <th className="text-black" style={columnStyle}>Nama</th>
                            <th className="text-black" style={columnStyle}>Kelompok</th>
                            <th className="text-black" style={columnStyle}>Supplier</th>
                            <th className="text-black" style={columnStyle}>Sub Dept</th>
                            <th className="text-black" style={columnStyle}>Kategori</th>
                            <th className="text-black" style={columnStyle}>Jenis</th>
                            <th className="text-black" style={columnStyle}>Stock Min</th>
                        </tr>
                        <tr>
                            <td></td>
                            <td><input type="text" className="form-control" placeholder="Kode Barang"/></td>
                            <td><input type="text" className="form-control" placeholder="Nama Barang"/></td>
                            <td>
                                <select className="form-control form-control-lg" id="kelompok_barang" name="kelompok_barang" onChange={this.handleSearchBy}>
                                    <option value="">Pilih Kelompok</option>
                                    {
                                        this.state.searchKelompok.map((v,i)=>{
                                            return (<option key={i} value={v.value} selected={localStorage.getItem('kelompok_barang')===v.value?true:false}>{v.label}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td><input type="text" className="form-control" placeholder="Supplier"/></td>
                            <td><input type="text" className="form-control" placeholder="Sub Dept"/></td>
                            <td>
                                <select className="form-control form-control-lg" id="kategori_barang" name="kategori_barang" onChange={this.handleSearchBy}>
                                    <option value="">Pilih Kategori</option>
                                    {
                                        this.state.searchKategori.map((v,i)=>{
                                            return (<option key={i} value={v.value} selected={localStorage.getItem('kategori_barang')===v.value?true:false}>{v.label}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td>
                                <select className="form-control form-control-lg" id="jenis_barang" name="jenis_barang" onChange={this.handleSearchBy}>
                                    <option value="">Pilih Jenis</option>
                                    {
                                        this.state.searchJenis.map((v,i)=>{
                                            return (<option key={i} value={v.value} selected={localStorage.getItem('jenis_barang')===v.value?true:false}>{v.label}</option>)
                                        })
                                    }
                                </select>
                            </td>
                            <td></td>
                        </tr>
                        </thead>
                        <tbody>

                        {
                            (
                                typeof data === 'object' ? data.length > 0 ?
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
                                                <td style={columnStyle}>{v.jenis==='0'? <img src={imgT} width="20px"/>: <img src={imgY} width="20px"/>}</td>
                                                <td style={columnStyle}>{v.stock_min}</td>
                                            </tr>
                                        )
                                    })
                                    : "No data." : "No data."
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
