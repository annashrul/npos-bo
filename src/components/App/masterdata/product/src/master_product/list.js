import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import FormProduct from "components/App/modals/masterdata/product/form_product";
import { FetchGroupProduct } from "redux/actions/masterdata/group_product/group_product.action";
import "jspdf-autotable";
import { to_pdf } from "helper";
import { FetchAllLocation } from "redux/actions/masterdata/location/location.action";
import {
  FetchProduct,
  deleteProduct,
} from "redux/actions/masterdata/product/product.action";
import Paginationq from "helper";
import { FetchSupplierAll } from "redux/actions/masterdata/supplier/supplier.action";
import { FetchSubDepartmentAll } from "redux/actions/masterdata/department/sub_department.action";
import Swal from "sweetalert2";
import {
  FetchProductDetail,
  FetchProductEdit,
  setProductEdit,
} from "redux/actions/masterdata/product/product.action";
import DetailProduct from "components/App/modals/masterdata/product/detail_product";
import { FetchCustomerPrice } from "redux/actions/masterdata/customer/customer.action";
import CustomerPrice from "components/App/modals/masterdata/customer/customer_price";
// import {FetchProductCode} from "redux/actions/masterdata/product/product.action";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import imgY from "assets/status-Y.png";
import imgT from "assets/status-T.png";
import { rangeDate } from "helper";
import Select from "react-select";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import FormProductExport from "../../../../modals/masterdata/product/form_product_export";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyPdfL from "../../../../../../myPdfL";
import FormProductPricing from "../../../../modals/masterdata/product/form_product_pricing";
import { readPrinter } from "../../../../../../redux/actions/masterdata/printer/printer.action";
import { dateRange, generateNo } from "../../../../../../helper";

class ListProduct extends Component {
  constructor(props) {
    super(props);
    this.handlesearch = this.handlesearch.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleExport = this.handleExport.bind(this);
    this.handlePeriode = this.handlePeriode.bind(this);
    this.state = {
      isExcel: false,
      array1: [],
      byValue: "",
      startDate: moment(new Date()).format("yyyy-MM-DD"),
      endDate: moment(new Date()).format("yyyy-MM-DD"),
      sort_by_data: [],
      sort_by: "",
      semua_periode: true,
      detail: {},
      any_kode_barang: "",
      any_nama_barang: "",
      any_kelompok_barang: "",
      any_supplier_barang: "",
      any_dept_barang: "",
      any_subdept_barang: "",
      any_kategori_barang: "",
      isModalForm: false,
      isModalFormPer: false,
      isModalDetail: false,
      isModalCustomer: false,
    };
  }
  componentWillUnmount() {
    this.setState({
      isModalForm: false,
      isModalFormPer: false,
      isModalDetail: false,
      isModalCustomer: false,
    });
  }

  handleChange(event) {
    let column = event.target.name;
    let value = event.target.value;
    let checked = event.target.checked;
    if (checked && column === "semua_periode") {
      this.props.dispatch(FetchProduct());
    }
    if (!checked && column === "semua_periode") {
      this.props.dispatch(
        FetchProduct(
          1,
          `datefrom=${this.state.startDate}&dateto=${this.state.endDate}`
        )
      );
    }
    this.setState({
      [column]: column === "semua_periode" ? checked : value,
    });
  }

  handlePageChange(pageNumber) {
    let column = localStorage.getItem("column_search");
    let where = "";
    let que = "any_master";
    let kode = this.state.any_kode_barang;
    let nama = this.state.any_nama_barang;
    let kelompok = this.state.any_kelompok_barang;
    let supplier = this.state.any_supplier_barang;
    let dept = this.state.any_dept_barang;
    let subdept = this.state.any_subdept_barang;
    let kategori = this.state.any_kategori_barang;
    if (
      kode !== "" ||
      nama !== "" ||
      kelompok !== "" ||
      supplier !== "" ||
      subdept !== "" ||
      kategori !== ""
    ) {
      if (column === "any_kode_barang") {
        if (where !== "") {
          where += "&";
        }
        where += `searchby=kd_brg&q=${btoa(kode)}`;
        localStorage.setItem(`${que}_kode_barang`, kode);
      }
      if (column === "any_nama_barang") {
        if (where !== "") {
          where += "&";
        }
        where += `searchby=nm_brg&q=${btoa(nama)}`;
        localStorage.setItem(`${que}_nama_barang`, nama);
      }
      if (column === "any_kelompok_barang") {
        if (where !== "") {
          where += "&";
        }
        where += `searchby=kel_brg&q=${btoa(kelompok)}`;
        localStorage.setItem(`${que}_kelompok_barang`, kelompok);
      }
      if (column === "any_supplier_barang") {
        if (where !== "") {
          where += "&";
        }
        where += `searchby=supplier&q=${btoa(supplier)}`;
        localStorage.setItem(`${que}_supplier_barang`, supplier);
      }
      if (column === "any_dept_barang") {
        if (where !== "") {
          where += "&";
        }
        where += `searchby=dept&q=${btoa(dept)}`;
        localStorage.setItem(`${que}_dept_barang`, dept);
      }
      if (column === "any_subdept_barang") {
        if (where !== "") {
          where += "&";
        }
        where += `searchby=subdept&q=${btoa(subdept)}`;
        localStorage.setItem(`${que}_subdept_barang`, subdept);
      }
      if (column === "any_kategori_barang") {
        if (where !== "") {
          where += "&";
        }
        where += `searchby=kategori&q=${btoa(kategori)}`;
        localStorage.setItem(`${que}_kategori_barang`, kategori);
      }
      this.props.dispatch(FetchProduct(pageNumber, where));
    } else {
      localStorage.removeItem(`${que}_kode_barang`);
      localStorage.removeItem(`${que}_nama_barang`);
      localStorage.removeItem(`${que}_kelompok_barang`);
      localStorage.removeItem(`${que}_supplier_barang`);
      localStorage.removeItem(`${que}_dept_barang`);
      localStorage.removeItem(`${que}_subdept_barang`);
      localStorage.removeItem(`${que}_kategori_barang`);
      this.props.dispatch(FetchProduct(pageNumber, ""));
    }
  }
  handleDelete = (e, kode) => {
    e.preventDefault();
    this.props.dispatch(deleteProduct(kode));
  };

  handlesearch(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    let any = data.get("field_any");
    let sortName = data.get("sort_name");
    let dateFrom = this.state.startDate;
    let dateTo = this.state.endDate;
    localStorage.setItem("any_product", `${any}`);
    localStorage.setItem("by_product", `${sortName}`);
    localStorage.setItem("startDateProduct", `${dateFrom}`);
    localStorage.setItem("endDateProduct", `${dateTo}`);

    let where = "";

    if (this.state.semua_periode === false) {
      if (dateFrom !== null && dateTo !== null) {
        if (where !== "") {
          where += "&";
        }
        where += `datefrom=${dateFrom}&dateto=${dateTo}`;
      }
    }
    this.props.dispatch(FetchProduct(1, where));
  }
  handleEnter(column) {
    localStorage.setItem("column_search", `${column}`);
    let where = "";
    let que = "any_master";
    let kode = this.state.any_kode_barang;
    let nama = this.state.any_nama_barang;
    let kelompok = this.state.any_kelompok_barang;
    let supplier = this.state.any_supplier_barang;
    let dept = this.state.any_dept_barang;
    let subdept = this.state.any_subdept_barang;
    let kategori = this.state.any_kategori_barang;
    if (
      kode !== "" ||
      nama !== "" ||
      kelompok !== "" ||
      supplier !== "" ||
      dept !== "" ||
      subdept !== "" ||
      kategori !== ""
    ) {
      if (column === "any_kode_barang") {
        if (where !== "") {
          where += "&";
        }
        where += `searchby=kd_brg&q=${btoa(kode)}`;
        localStorage.setItem(`${que}_kode_barang`, kode);
      }
      if (column === "any_nama_barang") {
        if (where !== "") {
          where += "&";
        }
        where += `searchby=nm_brg&q=${btoa(nama)}`;
        localStorage.setItem(`${que}_nama_barang`, nama);
      }
      if (column === "any_kelompok_barang") {
        if (where !== "") {
          where += "&";
        }
        where += `searchby=kel_brg&q=${btoa(kelompok)}`;
        localStorage.setItem(`${que}_kelompok_barang`, kelompok);
      }
      if (column === "any_supplier_barang") {
        if (where !== "") {
          where += "&";
        }
        where += `searchby=supplier&q=${btoa(supplier)}`;
        localStorage.setItem(`${que}_supplier_barang`, supplier);
      }
      if (column === "any_dept_barang") {
        if (where !== "") {
          where += "&";
        }
        where += `searchby=dept&q=${btoa(dept)}`;
        localStorage.setItem(`${que}_dept_barang`, dept);
      }
      if (column === "any_subdept_barang") {
        if (where !== "") {
          where += "&";
        }
        where += `searchby=subdept&q=${btoa(subdept)}`;
        localStorage.setItem(`${que}_subdept_barang`, subdept);
      }
      if (column === "any_kategori_barang") {
        if (where !== "") {
          where += "&";
        }
        where += `searchby=kategori&q=${btoa(kategori)}`;
        localStorage.setItem(`${que}_kategori_barang`, kategori);
      }

      this.props.dispatch(FetchProduct(1, where));
    } else {
      localStorage.removeItem(`${que}_kode_barang`);
      localStorage.removeItem(`${que}_nama_barang`);
      localStorage.removeItem(`${que}_kelompok_barang`);
      localStorage.removeItem(`${que}_supplier_barang`);
      localStorage.removeItem(`${que}_dept_barang`);
      localStorage.removeItem(`${que}_subdept_barang`);
      localStorage.removeItem(`${que}_kategori_barang`);
      this.props.dispatch(FetchProduct(1, ""));
    }
  }
  handleExport(e) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formProductExcel"));
  }
  loc_detail(e, kode) {
    e.preventDefault();
    this.setState({ isModalDetail: true });
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("detailProduct"));
    this.props.dispatch(FetchProductDetail(kode));
  }
  handlePriceCustomer(e, kode, nm_brg) {
    e.preventDefault();
    this.setState({ isModalCustomer: true });

    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("CustomerPrice"));
    localStorage.setItem("nm_brg_price_customer", nm_brg);
    localStorage.setItem("kd_brg_price_customer", kode);
    this.props.dispatch(FetchCustomerPrice(btoa(kode), 1, ""));
  }
  toggleModal(e) {
    e.preventDefault();
    this.setState({ isModalForm: true });

    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formProduct"));
    this.props.dispatch(FetchGroupProduct(1, "", "1000"));
    this.props.dispatch(readPrinter("page=1&perpage=99999"));
    this.props.dispatch(FetchAllLocation());
    this.props.dispatch(FetchSupplierAll());
    this.props.dispatch(FetchSubDepartmentAll());
    this.props.dispatch(setProductEdit([]));
    // this.props.dispatch(FetchProductCode());
  }
  handleEdit = (e, kode, pricing) => {
    e.preventDefault();
    if (pricing) {
      this.setState({ isModalFormPer: true });
    } else {
      this.setState({ isModalForm: true });
    }

    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(
      ModalType(pricing ? "formProductPricing" : "formProduct")
    );
    this.props.dispatch(FetchGroupProduct(1, "", "1000"));
    this.props.dispatch(FetchAllLocation());
    this.props.dispatch(FetchSupplierAll());
    this.props.dispatch(FetchSubDepartmentAll());
    this.props.dispatch(FetchProductEdit(kode));
    // this.props.dispatch(FetchProductCode());
  };
  exportPDF = () => {
    let stringHtml = "",
      tprice = 0;
    stringHtml += `<h3 align="center"><center>PRODUCT REPORT</center></h3>`;
    stringHtml += `<h3 align="center">PT NETINDO MEDIATAMA PERKASA</h3>`;
    const headers = [
      ["CODE", "NAME", "GROUP", "SUPPLIER", "SUB DEPARTEMEN", "PRICE"],
    ];
    const data =
      typeof this.props.data.data === "object"
        ? this.props.data.data.map((elt) => [
            elt.kd_brg,
            elt.nm_brg,
            elt.kel_brg,
            elt.group1,
            elt.group2,
            Intl.NumberFormat("en-IN", { maximumSignificantDigits: 3 }).format(
              elt.hrg_beli
            ),
          ])
        : "";
    const footer = ["TOTAL", "", "", "", "", tprice];
    to_pdf("product_report", stringHtml, headers, data, footer);
  };

  handleInput(name) {
    return (
      <input
        name={name}
        value={this.state[name]}
        onChange={this.handleChange}
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            this.handleEnter(`${name}`);
          }
        }}
        style={{ width: "-webkit-fill-available", marginTop: "2px" }}
        type="text"
        className="form-control"
        placeholder={`${name}`.replaceAll("_", " ").replaceAll("any ", "")}
      />
    );
  }

  handlePeriode(first, last) {
    this.props.dispatch(FetchProduct(1, `datefrom=${first}&dateto=${last}`));
    this.setState({ startDate: first, endDate: last });
  }

  render() {
    const loc_delete = this.handleDelete;
    const loc_edit = this.handleEdit;
    const loc_edit_per = this.handleEdit;
    const { total, per_page, current_page, data } = this.props.data;
    const centerStyle = {
      whiteSpace: "nowrap",
      verticalAlign: "middle",
      textAlign: "center",
    };
    const leftStyle = {
      whiteSpace: "nowrap",
      verticalAlign: "middle",
      textAlign: "left",
    };

    const headers = [
      "No",
      "Code",
      "Name",
      "Group",
      "Supplier",
      "Dept",
      "Sub Dept",
      "Purchase Price",
      // 'Category',
    ];

    let body = [];
    if (typeof data === "object") {
      for (let i = 0; i < data.length; i++) {
        const v = data[i];
        body.push([
          i + 1,
          v.kd_brg,
          v.nm_brg,
          v.kel_brg,
          v.supplier,
          v.dept,
          v.subdept,
          // v.kategori,
        ]);
      }
    }

    body.unshift(headers);

    // const rightStyle = {verticalAlign: "middle", textAlign: "right",whiteSpace: "nowrap"};
    return (
      <div>
        <form onSubmit={this.handlesearch} noValidate>
          <div className="row">
            <div className="col-md-9">
              <div className="row">
                <div className="col-6 col-xs-6 col-md-2">
                  <div className="form-group">
                    <label>Periode Input</label>
                    <br />

                    <label htmlFor="inputState" className="col-form-label">
                      <input
                        name="semua_periode"
                        type="checkbox"
                        checked={this.state.semua_periode}
                        onChange={this.handleChange}
                      />
                      &nbsp; semua periode
                    </label>
                  </div>
                </div>
                <div className="col-6 col-xs-6 col-md-3">
                  {dateRange(
                    (first, last) => {
                      this.handlePeriode(first, last);
                    },
                    () => {},
                    `${this.state.startDate} to ${this.state.endDate}`,
                    !this.state.semua_periode ? true : false
                  )}
                </div>
              </div>
            </div>

            <div className="col-12 col-xs-12 col-md-3 text-right">
              <button
                style={{ marginTop: "27px", marginRight: "2px" }}
                type="button"
                onClick={(e) => this.toggleModal(e)}
                className="btn btn-primary"
              >
                <i className="fa fa-plus"></i>
              </button>
              <PDFDownloadLink
                document={
                  <MyPdfL
                    title={[
                      "Data Barang per Halaman",
                      `${this.state.startDate} sampai ${this.state.endDate}`,
                    ]}
                    result={body}
                  />
                }
                style={{ marginTop: "27px", marginRight: "2px" }}
                fileName="semua_barang.pdf"
                className="btn btn-primary py-2 d-none"
              >
                {({ blob, url, loading, error }) =>
                  loading ? (
                    <i className="spinner-border spinner-border-sm"></i>
                  ) : (
                    <i className="fa fa-file-pdf-o"></i>
                  )
                }
              </PDFDownloadLink>
              {/* <button
                style={{ marginTop: "27px", marginRight: "2px" }}
                type="button"
                onClick={this.exportPDF}
                className="btn btn-primary"
              >
                <i className="fa fa-file-pdf-o"></i>
              </button> */}
              <button
                style={{ marginTop: "27px", marginRight: "2px" }}
                type="button"
                onClick={(e) => this.handleExport(e)}
                className="btn btn-primary"
              >
                <i className="fa fa-file-excel-o"></i>
              </button>
              {/* <ReactHTMLTableToExcel
                className="btn btn-primary btnBrg"
                table="emp"
                filename="barang"
                sheet="barang"
                buttonText="export excel"
              ></ReactHTMLTableToExcel> */}
            </div>
          </div>
        </form>
        <div style={{ overflowX: "auto" }}>
          <table className="table table-hover table-noborder">
            <thead className="bg-light">
              <tr>
                <th className="text-black" style={centerStyle}>
                  No
                </th>
                <th className="text-black" style={centerStyle}>
                  #
                </th>
                <th className="text-black middle">
                  Kode barang <br />
                  {this.handleInput("any_kode_barang")}
                </th>
                <th className="text-black">
                  Nama barang <br />
                  {this.handleInput("any_nama_barang")}
                </th>
                <th className="text-black" width="10%">
                  Kelompok <br />
                  {this.handleInput("any_kelompok_barang")}
                </th>
                <th className="text-black" width="10%">
                  Supplier
                  <br />
                  {this.handleInput("any_supplier_barang")}
                </th>
                <th className="text-black middle" width="10%">
                  Departemen
                </th>
                <th className="text-black" width="10%">
                  Sub departemen
                  <br />
                  {this.handleInput("any_subdept_barang")}
                </th>
                <th className="text-black" width="10%">
                  Kategori
                  <br />
                  {this.handleInput("any_kategori_barang")}
                </th>
                <th className="text-black middle">Jenis</th>
                <th className="text-black middle">
                  Stock
                  <br />
                  Min
                </th>
              </tr>
            </thead>
            <tbody>
              {typeof data === "object" ? (
                data !== undefined && data.length > 0 ? (
                  data.map((v, i) => {
                    return (
                      <tr key={i}>
                        <td style={centerStyle}>
                          {generateNo(i, current_page)}
                        </td>
                        <td style={centerStyle}>
                          <div className="btn-group">
                            <UncontrolledButtonDropdown>
                              <DropdownToggle caret>Aksi</DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem
                                  onClick={(e) =>
                                    this.handlePriceCustomer(
                                      e,
                                      v.kd_brg,
                                      v.nm_brg
                                    )
                                  }
                                >
                                  Set Harga Customer
                                </DropdownItem>
                                <DropdownItem
                                  onClick={(e) => this.loc_detail(e, v.kd_brg)}
                                >
                                  Detail
                                </DropdownItem>
                                <DropdownItem
                                  onClick={(e) => loc_edit(e, v.kd_brg)}
                                >
                                  Edit
                                </DropdownItem>
                                <DropdownItem
                                  onClick={(e) =>
                                    loc_edit_per(e, v.kd_brg, true)
                                  }
                                >
                                  Edit Harga per Lokasi
                                </DropdownItem>
                                <DropdownItem
                                  onClick={(e) => loc_delete(e, v.kd_brg)}
                                >
                                  Delete
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledButtonDropdown>
                          </div>
                        </td>
                        <td style={leftStyle}>{v.kd_brg}</td>
                        <td style={leftStyle}>{v.nm_brg}</td>
                        <td style={leftStyle}>{v.kel_brg}</td>
                        <td style={leftStyle}>{v.supplier}</td>
                        <td style={leftStyle}>{v.dept}</td>
                        <td style={leftStyle}>{v.subdept}</td>
                        <td style={leftStyle}>{v.kategori}</td>
                        <td style={centerStyle}>
                          {v.jenis === "0" ? (
                            <img alt="netindo" src={imgT} width="20px" />
                          ) : (
                            <img alt="netindo" src={imgY} width="20px" />
                          )}
                        </td>
                        <td style={centerStyle}>{v.stock_min}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={11}>No data</td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan={11}>No data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: "20px", float: "right" }}>
          <Paginationq
            current_page={current_page}
            per_page={per_page}
            total={total}
            callback={this.handlePageChange.bind(this)}
          />
        </div>
        {this.state.isModalForm ? (
          <FormProduct
            detail={{ kel_brg: "" }}
            data={this.props.groupProduct}
            dataLocation={this.props.location}
            dataSupplier={this.props.supplier}
            dataSubDept={this.props.subDept}
            dataEdit={this.props.productEdit}
            productCode={this.props.productCode}
          />
        ) : null}
        {this.state.isModalFormPer ? (
          <FormProductPricing
            // allState={this.state}
            data={this.props.groupProduct}
            dataLocation={this.props.location}
            dataSupplier={this.props.supplier}
            dataSubDept={this.props.subDept}
            dataEdit={this.props.productEdit}
            productCode={this.props.productCode}
          />
        ) : null}

        {this.state.isModalDetail ? (
          <DetailProduct dataDetail={this.props.productDetail} />
        ) : null}
        {this.state.isModalCustomer ? (
          <CustomerPrice dataCustomerPrice={this.props.customerPrice} />
        ) : null}
        <FormProductExport />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    location: state.locationReducer.allData,
    supplier: state.supplierReducer.dataSupllier,
    subDept: state.subDepartmentReducer.all,
    productEdit: state.productReducer.dataEdit,
    productDetail: state.productReducer.dataDetail,
    customerPrice: state.customerReducer.dataPrice,
    productCode: state.productReducer.productCode,
    groupProduct: state.groupProductReducer.data,
  };
};

export default connect(mapStateToProps)(ListProduct);
