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
import FormProductPricings from "../../../../modals/masterdata/product/form_product_pricing_";
import FormProducts from "../../../../modals/masterdata/product/form_product_";
import { readPrinter } from "../../../../../../redux/actions/masterdata/printer/printer.action";
import {
  dateRange,
  generateNo,
  getStorage,
  handleDataSelect,
  rmSpaceToStrip,
  setStorage,
} from "../../../../../../helper";
import { FetchRak } from "../../../../../../redux/actions/masterdata/rak/rak.action";
import SelectCommon from "../../../../common/SelectCommon";
import Cookies from "js-cookie";
import ButtonActionCommon from "../../../../common/ButtonActionCommon";
import SelectSortCommon from "../../../../common/SelectSortCommon";

class ListProduct extends Component {
  constructor(props) {
    super(props);
    this.handlesearch = this.handlesearch.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleExport = this.handleExport.bind(this);
    this.handlePeriode = this.handlePeriode.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.state = {
      isExcel: false,
      array1: [],
      rak_data: [],
      byValue: "",
      startDate: moment(new Date()).format("yyyy-MM-DD"),
      endDate: moment(new Date()).format("yyyy-MM-DD"),
      sort: "",
      semua_periode: true,
      detail: {},
      any_kode_barang: "",
      any_nama_barang: "",
      any_variasi: "",
      any_nama_singkat: "",
      any_kelompok_barang: "",
      any_supplier_barang: "",
      any_dept_barang: "",
      any_subdept_barang: "",
      any_tag_barang: "",
      any_rak_barang: "",
      any_kategori_barang: "",
      isModalForm: false,
      isModalFormPer: false,
      isModalDetail: false,
      isModalCustomer: false,
      isModalExportExcel: false,
      limit: 5,
      dataLimit: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
    };
    this.handleChangeLimit = this.handleChangeLimit.bind(this);
  }
  getProps(param) {
    let stateRak = [];
    let propsRak = param.rak;
    if (propsRak.data !== undefined) {
      if (typeof propsRak.data === "object") {
        propsRak.data.map((v, i) =>
          stateRak.push({
            value: v.id,
            label: v.title,
          })
        );
      }
    }

    this.setState({
      rak_data: stateRak,
    });
  }
  componentDidMount() {
    this.getProps(this.props);
  }
  componentWillMount() {
    this.getProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }

  componentWillUnmount() {
    this.setState({
      isModalForm: false,
      isModalFormPer: false,
      isModalDetail: false,
      isModalCustomer: false,
    });
  }

  componentDidMount() {
    this.getProps(this.props);
    let getIsPeriodeBarang = getStorage("isPeriodeBarang");
    if (
      getIsPeriodeBarang === null ||
      getIsPeriodeBarang === "null" ||
      getIsPeriodeBarang === "true"
    ) {
      this.setState({ semua_periode: true });
    } else {
      this.setState({
        semua_periode: false,
      });
    }
  }

  handleChangeLimit(e) {
    console.log("limit", e.target.value);
    const val = e.target.value;
    this.setState({ limit: val }, () => {
      console.log(val);
      this.props.dispatch(FetchProduct(1, `perpage=${val}`));
    });
  }

  handleChange(event) {
    let column = event.target.name;
    let value = event.target.value;
    let checked = event.target.checked;
    if (column === "semua_periode") {
      setStorage("isPeriodeBarang", checked);
    }
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
    let where = `sort=nm_brg|${this.state.sort}`;
    if (!this.state.semua_periode) {
      where += `datefrom=${this.state.startDate}&dateto=${this.state.endDate}&`;
    }
    let que = "any_master";
    let kode = this.state.any_kode_barang;
    let nama = this.state.any_nama_barang;
    let ukuran = this.state.any_variasi;
    let nama_singkat = this.state.any_nama_singkat;
    let kelompok = this.state.any_kelompok_barang;
    let supplier = this.state.any_supplier_barang;
    let dept = this.state.any_dept_barang;
    let subdept = this.state.any_subdept_barang;
    let tag = this.state.any_tag_barang;
    let rak = this.state.any_rak_barang;
    let kategori = this.state.any_kategori_barang;
    if (
      kode !== "" ||
      nama !== "" ||
      ukuran !== "" ||
      nama_singkat !== "" ||
      kelompok !== "" ||
      supplier !== "" ||
      subdept !== "" ||
      tag !== "" ||
      rak !== "" ||
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
      if (column === "any_variasi") {
        if (where !== "") {
          where += "&";
        }
        where += `searchby=ukuran&q=${btoa(ukuran)}`;
        localStorage.setItem(`${que}_ukuran`, ukuran);
      }
      if (column === "any_nama_singkat") {
        if (where !== "") {
          where += "&";
        }
        where += `searchby=nama_singkat&q=${btoa(nama_singkat)}`;
        localStorage.setItem(`${que}_nama_singkat`, nama_singkat);
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
      if (column === "any_tag_barang") {
        if (where !== "") {
          where += "&";
        }
        where += `searchby=tag&q=${btoa(tag)}`;
        localStorage.setItem(`${que}_tag_barang`, tag);
      }
      if (column === "any_rak_barang") {
        if (where !== "") {
          where += "&";
        }
        where += `searchby=rak&q=${btoa(rak)}`;
        localStorage.setItem(`${que}_rak_barang`, rak);
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
      localStorage.removeItem(`${que}_ukuran`);
      localStorage.removeItem(`${que}_nama_singkat`);
      localStorage.removeItem(`${que}_kelompok_barang`);
      localStorage.removeItem(`${que}_supplier_barang`);
      localStorage.removeItem(`${que}_dept_barang`);
      localStorage.removeItem(`${que}_subdept_barang`);
      localStorage.removeItem(`${que}_rak_barang`);
      localStorage.removeItem(`${que}_tag_barang`);
      localStorage.removeItem(`${que}_kategori_barang`);
      this.props.dispatch(FetchProduct(pageNumber, where));
    }
  }
  handleDelete = (kode) => {
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
    let ukuran = this.state.any_variasi;
    let nama_singkat = this.state.any_nama_singkat;
    let kelompok = this.state.any_kelompok_barang;
    let supplier = this.state.any_supplier_barang;
    let dept = this.state.any_dept_barang;
    let subdept = this.state.any_subdept_barang;
    let tag = this.state.any_tag_barang;
    let rak = this.state.any_rak_barang;
    let kategori = this.state.any_kategori_barang;

    if (
      kode !== "" ||
      nama !== "" ||
      ukuran !== "" ||
      nama_singkat !== "" ||
      kelompok !== "" ||
      supplier !== "" ||
      dept !== "" ||
      subdept !== "" ||
      tag !== "" ||
      rak !== "" ||
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
      if (column === "any_variasi") {
        if (where !== "") {
          where += "&";
        }
        where += `searchby=ukuran&q=${btoa(ukuran)}`;
        localStorage.setItem(`${que}_ukuran`, ukuran);
      }
      if (column === "any_nama_singkat") {
        if (where !== "") {
          where += "&";
        }
        where += `searchby=nama_singkat&q=${btoa(nama)}`;
        localStorage.setItem(`${que}_nama_singkat`, nama);
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
      if (column === "any_tag_barang") {
        if (where !== "") {
          where += "&";
        }
        where += `tag=${tag}`;
        localStorage.setItem(`${que}_tag_barang`, tag);
      }
      if (column === "any_rak_barang") {
        if (where !== "") {
          where += "&";
        }
        where += `rak=${rak}`;
        localStorage.setItem(`${que}_rak_barang`, rak);
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
      localStorage.removeItem(`${que}_ukuran`);
      localStorage.removeItem(`${que}_nama_singkat`);
      localStorage.removeItem(`${que}_kelompok_barang`);
      localStorage.removeItem(`${que}_supplier_barang`);
      localStorage.removeItem(`${que}_dept_barang`);
      localStorage.removeItem(`${que}_subdept_barang`);
      localStorage.removeItem(`${que}_tag_barang`);
      localStorage.removeItem(`${que}_rak_barang`);
      localStorage.removeItem(`${que}_kategori_barang`);
      this.props.dispatch(FetchProduct(1, ""));
    }
  }
  handleExport(e) {
    e.preventDefault();
    this.setState({ isModalExportExcel: true });
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formProductExcel"));
  }
  loc_detail(res) {
    this.setState({ isModalDetail: true, detail: res });
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("detailProduct"));
    this.props.dispatch(FetchProductDetail(res.kd_brg));
  }
  handlePriceCustomer(kode, nm_brg) {
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
    this.props.dispatch(FetchGroupProduct("page=1&perpage=99999"));
    this.props.dispatch(readPrinter("page=1&perpage=99999"));
    this.props.dispatch(FetchAllLocation());
    this.props.dispatch(FetchSupplierAll());
    this.props.dispatch(FetchSubDepartmentAll());
    this.props.dispatch(FetchRak("page=1&perpage=99999"));
    this.props.dispatch(setProductEdit([]));
    // this.props.dispatch(FetchProductCode());
  }
  handleEdit = (kode, pricing) => {
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
    this.props.dispatch(FetchGroupProduct("page=1&perpage=99999"));
    // this.props.dispatch(FetchRak("page=1&perpage=99999"));
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
        onChange={(e) => {
          this.handleChange(e);
          if (e.target.value === "")
            setTimeout(() => this.handleEnter(name), 300);
        }}
        onKeyPress={(event) => {
          if (event.key === "Enter") this.handleEnter(`${name}`);
        }}
        style={{ width: "-webkit-fill-available" }}
        type="search"
        className="nradius np form-control in-table nbt nbl nbr"
        placeholder={`semua ${name}`
          .replaceAll("_", " ")
          .replaceAll("any ", "")
          .replaceAll(" barang", "")}
      />
    );
  }

  handlePeriode(first, last) {
    this.props.dispatch(
      FetchProduct(
        1,
        `datefrom=${first}&dateto=${last}&sort=nm_brg|${this.state.sort}`
      )
    );
    this.setState({ startDate: first, endDate: last });
  }
  handleSelect(res) {
    console.log("res", res);
    let sortBy = `${res.value}`.toUpperCase();
    if (!this.state.semua_periode) {
      console.log("periode", `${this.state.startDate} - ${this.state.endDate}`);
      this.props.dispatch(
        FetchProduct(
          1,
          `datefrom=${this.state.startDate}&dateto=${this.state.endDate}&sort=nm_brg|${sortBy}`
        )
      );
      this.setState({ sort: sortBy });
    } else {
      console.log("asdasdasd");

      this.props.dispatch(FetchProduct(1, `sort=nm_brg|${sortBy}`));
      this.setState({ sort: sortBy });
    }
  }

  render() {
    const loc_delete = this.handleDelete;
    const loc_edit = this.handleEdit;
    const loc_edit_per = this.handleEdit;
    // const loc_edit_ukuran = this.handleEdit;
    const { total, per_page, current_page, data } = this.props.data;
    const headers = [
      "No",
      "Code",
      "Name",
      "Ukuran",
      "Nama Singkat",
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
          v.ukuran,
          v.nama_singkat,
          v.kel_brg,
          v.supplier,
          v.dept,
          v.subdept,
          // v.kategori,
        ]);
      }
    }
    body.unshift(headers);
    const cekTambahan =
      document
        .getElementById("tambahan_barang")
        .value.search(atob(atob(Cookies.get("tnt=")))) >= 0;
    // const rightStyle = {verticalAlign: "middle", textAlign: "right",whiteSpace: "nowrap"};
    return (
      <div>
        <form onSubmit={this.handlesearch} noValidate>
          <div className="row">
            <div className="col-md-9">
              <div className="row">
                <div className="col-6 col-xs-6 col-md-3">
                  <div className="form-group">
                    <label>
                      <input
                        name="semua_periode"
                        type="checkbox"
                        checked={this.state.semua_periode}
                        onChange={this.handleChange}
                      />
                      &nbsp; periode
                    </label>
                    {!this.state.semua_periode ? (
                      dateRange(
                        (first, last) => {
                          this.handlePeriode(first, last);
                        },
                        `${this.state.startDate} s/d ${this.state.endDate}`,
                        "",
                        true,
                        false
                      )
                    ) : (
                      <input
                        type="text"
                        value="semua periode"
                        className="form-control"
                        disabled={true}
                      />
                    )}
                  </div>
                </div>
                <div
                  className="col-12 col-xs-12 col-md-3"
                  style={{ marginTop: "2px" }}
                >
                  <SelectSortCommon
                    callback={(res) => {
                      this.handleSelect(res);
                    }}
                    dataEdit={this.state.sort}
                  />
                </div>
                <div
                  className="col-12 col-xs-12 col-md-3"
                  style={{ marginTop: "2px" }}
                >
                  <label>data perhalaman</label>
                  <select
                    className="form-control"
                    name="perpage"
                    value={this.state.limit}
                    onChange={this.handleChangeLimit}
                  >
                    {this.state.dataLimit.map((res, i) => {
                      return (
                        <option value={res} key={i}>
                          {res}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>

            <div className="col-12 col-xs-12 col-md-3 text-right">
              <button
                style={{
                  marginTop: !this.state.semua_periode ? "27px" : "0px",
                  marginRight: "2px",
                }}
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
                style={{ marginRight: "2px" }}
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
                style={{
                  marginTop: !this.state.semua_periode ? "27px" : "0px",
                  marginRight: "2px",
                }}
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
                <th className="middle text-center">No</th>
                <th className="middle text-center">#</th>
                <th className="middle">
                  {this.handleInput("any_kode_barang")}
                </th>
                <th className="middle">
                  {this.handleInput("any_nama_barang")}
                </th>
                <th className="middle">
                  {this.handleInput("any_variasi")}
                </th>
                <th className="middle">
                  {this.handleInput("any_nama_singkat")}
                </th>
                <th className="middle" width="10%">
                  {this.handleInput("any_kelompok_barang")}
                </th>
                <th className="middle" width="10%">
                  {this.handleInput("any_supplier_barang")}
                </th>
                <th className="middle" width="10%">
                  Departemen
                </th>
                <th className="middle" width="10%">
                  {this.handleInput("any_subdept_barang")}
                </th>
                <th className={`middle ${!cekTambahan && "none"}`} width="10%">
                  <div className="form-group m-0 p-0">
                    <select
                      className="nradius np form-control in-table nbt nbl nbr"
                      style={{ width: "-webkit-fill-available" }}
                      name="any_rak_barang"
                      onChange={(e) => {
                        this.handleChange(e);
                        setTimeout(
                          () => this.handleEnter("any_rak_barang"),
                          300
                        );
                      }}
                    >
                      <option value="">semua rak</option>
                      {typeof this.state.rak_data === "object"
                        ? this.state.rak_data !== undefined &&
                          this.state.rak_data.length > 0
                          ? this.state.rak_data.map((v, i) => {
                              return (
                                <option value={`${v.value}`} key={i}>
                                  {v.label}
                                </option>
                              );
                            })
                          : ""
                        : ""}
                    </select>
                  </div>
                </th>
                <th className={`middle ${!cekTambahan && "none"}`} width="10%">
                  {this.handleInput("any_tag_barang")}
                </th>
                <th className="middle" width="1%">
                  {this.handleInput("any_kategori_barang")}
                </th>
                <th className="middle">Jenis</th>
                <th className="middle">
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
                        <td className="middle nowrap text-center">
                          {generateNo(i, current_page)}
                        </td>
                        <td className="middle nowrap text-center">
                          <ButtonActionCommon
                            action={[
                              { label: "Set Harga Customer" },
                              { label: "Detail" },
                              { label: "Edit" },
                              { label: "Edit Harga" },
                              { label: "Delete" },
                              // { label: "Edit Variasi" },
                            ]}
                            callback={(e) => {
                              if (e === 0)
                                this.handlePriceCustomer(v.kd_brg, v.nm_brg);
                              if (e === 1) this.loc_detail(v);
                              if (e === 2) loc_edit(v.kd_brg);
                              if (e === 3) loc_edit_per(v.kd_brg, true);
                              if (e === 4) loc_delete(v.kd_brg);
                              // if (e === 5) loc_edit_ukuran(v.kd_brg);
                            }}
                          />
                        </td>
                        <td className={`middle nowrap`}>{v.kd_brg}</td>
                        <td className={`middle nowrap`}>{v.nm_brg}</td>
                        <td className={`middle nowrap`}>{v.ukuran}</td>
                        <td className={`middle nowrap`}>{v.nama_singkat}</td>
                        <td className={`middle nowrap`}>{v.kel_brg}</td>
                        <td className={`middle nowrap`}>{v.supplier}</td>
                        <td className={`middle nowrap`}>{v.dept}</td>
                        <td className={`middle nowrap`}>{v.subdept}</td>
                        <td
                          className={`middle nowrap ${!cekTambahan && "none"}`}
                        >
                          {rmSpaceToStrip(v.rak)}
                        </td>
                        <td
                          className={`middle nowrap ${!cekTambahan && "none"}`}
                        >
                          {rmSpaceToStrip(v.tag)}
                        </td>
                        <td className={`middle nowrap`}>{v.kategori}</td>
                        <td>
                          {v.jenis === "0" ? (
                            <img alt="netindo" src={imgT} width="20px" />
                          ) : (
                            <img alt="netindo" src={imgY} width="20px" />
                          )}
                        </td>
                        <td>{v.stock_min}</td>
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
          <FormProducts
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
          <FormProductPricings
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
          <DetailProduct
            detail={this.state.detail}
            dataDetail={this.props.productDetail}
          />
        ) : null}
        {this.state.isModalCustomer ? (
          <CustomerPrice dataCustomerPrice={this.props.customerPrice} />
        ) : null}
        {this.props.isOpen || this.state.isModalExportExcel ? (
          <FormProductExport />
        ) : null}
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
    rak: state.rakReducer.data,
  };
};

export default connect(mapStateToProps)(ListProduct);
