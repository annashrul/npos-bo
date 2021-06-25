import React, { Component } from "react";
import Layout from "components/App/Layout";
import {
  FetchStockReport,
  FetchStockReportExcel,
} from "redux/actions/report/inventory/stock_report.action";
import connect from "react-redux/es/connect/connect";
import DetailStockReportSatuan from "components/App/modals/report/inventory/stock_report/detail_stock_report_satuan";
import StockReportExcel from "components/App/modals/report/inventory/stock_report/form_stock_report_excel";
import moment from "moment";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import { FetchStockReportDetailSatuan } from "redux/actions/report/inventory/stock_report.action";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { rangeDate } from "helper";
import Select from "react-select";
import { HEADERS } from "redux/actions/_constants";
import Paginationq from "helper";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import { generateNo, toRp } from "../../../../../helper";

class InventoryReport extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
    this.HandleChangeStock = this.HandleChangeStock.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEvent = this.handleEvent.bind(this);
    this.HandleChangeSearchBy = this.HandleChangeSearchBy.bind(this);
    this.state = {
      where_data: "",
      isSelected: false,
      location: "",
      location_data: [],
      bukaHarga: false,
      status_data: [
        { value: "", label: "Semua Stock" },
        { value: "<", label: "Stock -" },
        { value: ">", label: "Stock +" },
        { value: "=", label: "Stock 0" },
      ],
      status: "",
      any: "",
      startDate: moment(new Date()).format("yyyy-MM-DD"),
      endDate: moment(new Date()).format("yyyy-MM-DD"),
      search_by: "br.kd_brg",
      search_by_data: [
        { value: "br.kd_brg", label: "Kode Barang" },
        { value: "br.nm_brg", label: "Nama Barang" },
        { value: "br.group1", label: "Supplier" },
      ],
      isModalExcel: false,
      isModalDetail: false,
    };
  }
  componentWillUnmount() {
    this.setState({ isModalDetail: false, isModalExcel: false });
    localStorage.removeItem("page_stock_report");
    localStorage.removeItem("code");
    localStorage.removeItem("barcode");
    localStorage.removeItem("name");
    localStorage.removeItem("date_from_stock_report");
    localStorage.removeItem("date_to_stock_report");
    localStorage.removeItem("lk_stock_report");
    localStorage.removeItem("search_by_stock_report");
    localStorage.removeItem("st_stock_report");
    localStorage.removeItem("where_stock_report");
  }

  componentDidMount() {
    if (
      localStorage.lk_stock_report !== undefined &&
      localStorage.lk_stock_report !== ""
    ) {
      this.setState({
        location: localStorage.lk_stock_report,
        bukaHarga: true,
      });
    }

    if (
      localStorage.st_stock_report !== undefined &&
      localStorage.st_stock_report !== null
    ) {
      this.setState({
        status: localStorage.st_stock_report,
      });
    }
    if (
      localStorage.search_by_stock_report !== undefined &&
      localStorage.search_by_stock_report !== null
    ) {
      this.setState({
        search_by: localStorage.search_by_stock_report,
      });
    }
    if (
      localStorage.any_stock_report !== undefined &&
      localStorage.any_stock_report !== null
    ) {
      this.setState({
        any: localStorage.any_stock_report,
      });
    }
    if (
      localStorage.date_from_stock_report !== undefined &&
      localStorage.date_from_stock_report !== null
    ) {
      this.setState({
        startDate: localStorage.date_from_stock_report,
      });
    }
    if (
      localStorage.date_to_stock_report !== undefined &&
      localStorage.date_to_stock_report !== null
    ) {
      this.setState({
        endDate: localStorage.date_to_stock_report,
      });
    }
  }
  componentWillMount() {
    let pageStockReport = localStorage.getItem("page_stock_report");
    this.handleParameter(
      pageStockReport !== undefined && pageStockReport !== null
        ? pageStockReport
        : 1
    );
  }
  handlePageChange(pageNumber) {
    localStorage.setItem("page_stock_report", pageNumber);
    this.handleParameter(pageNumber);
  }
  toggle(e, code, barcode, name) {
    e.preventDefault();
    this.setState({ isModalDetail: true });
    localStorage.setItem("code", code);
    localStorage.setItem("barcode", barcode);
    localStorage.setItem("name", name);
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("detailStockReportSatuan"));

    this.props.dispatch(FetchStockReportDetailSatuan(1, code, "", "", ""));
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  handleEvent = (event, picker) => {
    const awal = moment(picker.startDate._d).format("YYYY-MM-DD");
    const akhir = moment(picker.endDate._d).format("YYYY-MM-DD");
    localStorage.setItem("date_from_stock_report", `${awal}`);
    localStorage.setItem("date_to_stock_report", `${akhir}`);
    this.setState({
      startDate: awal,
      endDate: akhir,
    });
  };
  handleSearch(e) {
    e.preventDefault();
    localStorage.setItem("any_stock_report", this.state.any);
    this.handleParameter(1);
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.auth.user) {
      let lk = [];
      let loc = nextProps.auth.user.lokasi;
      if (loc !== undefined) {
        lk.push({
          value: "",
          label: "Semua Lokasi",
        });
        loc.map((i) => {
          lk.push({
            value: i.kode,
            label: i.nama,
          });
          return null;
        });
        this.setState({
          location_data: lk,
        });
      }
    }
  };
  HandleChangeLokasi(lk) {
    this.setState({
      location: lk.value,
    });
    localStorage.setItem("lk_stock_report", lk.value);
  }
  HandleChangeSearchBy(sb) {
    this.setState({
      search_by: sb.value,
    });
    localStorage.setItem("search_by_stock_report", sb.value);
  }
  HandleChangeStock(lk) {
    this.setState({
      status: lk.value,
    });
    localStorage.setItem("st_stock_report", lk.value);
  }
  handleParameter(pageNumber) {
    let dateFrom = localStorage.date_from_stock_report;
    let dateTo = localStorage.date_to_stock_report;
    let lokasi = localStorage.lk_stock_report;
    let status = localStorage.st_stock_report;
    let any = localStorage.any_stock_report;
    let search_by = localStorage.search_by_stock_report;
    let where = "";
    if (dateFrom !== undefined && dateFrom !== null) {
      where += `&datefrom=${dateFrom}&dateto=${dateTo}`;
    }
    if (lokasi !== "" && lokasi !== undefined && lokasi !== null) {
      where += `&lokasi=${lokasi}`;
      this.setState({
        bukaHarga: true,
      });
    } else {
      this.setState({
        bukaHarga: false,
      });
    }
    if (status !== undefined && status !== null && status !== "") {
      where += `&filter_stock=${status}`;
    }
    if (search_by !== undefined && search_by !== null && search_by !== "") {
      where += `&searchby=${search_by}`;
    }

    if (any !== undefined && any !== null && any !== "") {
      where += `&q=${btoa(any)}`;
    }
    this.setState({
      where_data: where,
    });
    localStorage.setItem("where_stock_report", pageNumber);
    this.props.dispatch(FetchStockReport(pageNumber, where));
    // this.props.dispatch(FetchStockReportExcel(pageNumber,where));
  }
  toggleModal(e, total, perpage) {
    e.preventDefault();
    this.setState({ isModalExcel: true });
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formStockExcel"));
    this.props.dispatch(FetchStockReportExcel(1, this.state.where_data, total));
  }

  render() {
    const columnStyle = {
      verticalAlign: "middle",
      textAlign: "center",
      whiteSpace: "nowrap",
    };
    const { per_page, last_page, current_page, data, total } =
      this.props.stockReport;
    const {
      total_harga_beli,
      total_harga_jual,
      total_harga_beli_qty,
      total_harga_jual_qty,
      total_stock_awal,
      total_stock_masuk,
      total_stock_keluar,
      total_stock_akhir,
      total_stock_penjualan,
    } = this.props.total_stock;

    let total_dn_per = 0;
    let total_jual_per = 0;
    let total_beli_per = 0;
    let total_jual_qty_per = 0;
    let total_beli_qty_per = 0;
    let total_first_stock_per = 0;
    let total_last_stock_per = 0;
    let total_stock_in_per = 0;
    let total_stock_out_per = 0;
    let total_stock_penjualan_per = 0;
    let get_lokasi = true;
    return (
      <Layout page="Laporan Stock">
        <div className="row" style={{ zoom: "90%" }}>
          <div className="col-md-10">
            <div className="row">
              <div className="col-6 col-xs-6 col-md-2">
                <div className="form-group">
                  <label htmlFor=""> Periode </label>
                  <DateRangePicker
                    style={{ display: "unset" }}
                    ranges={rangeDate}
                    alwaysShowCalendars={true}
                    onEvent={this.handleEvent}
                  >
                    <input
                      readOnly={true}
                      type="text"
                      className="form-control"
                      value={`${this.state.startDate} to ${this.state.endDate}`}
                      style={{ padding: "10px", fontWeight: "bolder" }}
                    />
                  </DateRangePicker>
                </div>
              </div>

              <div className="col-6 col-xs-6 col-md-2">
                <div className="form-group">
                  <label htmlFor="">Lokasi</label>
                  <Select
                    options={this.state.location_data}
                    onChange={this.HandleChangeLokasi}
                    placeholder="Pilih Lokasi"
                    value={this.state.location_data.find((op) => {
                      return op.value === this.state.location;
                    })}
                  />
                </div>
              </div>

              <div className="col-6 col-xs-6 col-md-2">
                <div className="form-group">
                  <label htmlFor="exampleFormControlSelect1">
                    Filter Stock
                  </label>
                  <Select
                    options={this.state.status_data}
                    onChange={this.HandleChangeStock}
                    placeholder="Pilih Stock"
                    value={this.state.status_data.find((op) => {
                      return op.value === this.state.status;
                    })}
                  />
                </div>
              </div>
              <div className="col-6 col-xs-6 col-md-2">
                <div className="form-group">
                  <label htmlFor="exampleFormControlSelect1">Search By</label>
                  <Select
                    options={this.state.search_by_data}
                    onChange={this.HandleChangeSearchBy}
                    placeholder="Pilih Kolom"
                    value={this.state.search_by_data.find((op) => {
                      return op.value === this.state.search_by;
                    })}
                  />
                </div>
              </div>
              <div className="col-12 col-xs-12 col-md-3">
                <label htmlFor="exampleFormControlSelect1">
                  Tulis sesuatu disini
                </label>
                <div className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    style={{ padding: "9px", fontWeight: "bolder" }}
                    name="any"
                    value={this.state.any}
                    onChange={(e) => this.handleChange(e)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-2">
            <div className="row">
              <div className="col-12 col-xs-12 col-md-12">
                <div className="form-group text-right">
                  <button
                    style={{ marginTop: "28px", marginRight: "5px" }}
                    className="btn btn-primary"
                    onClick={(e) => this.handleSearch(e)}
                  >
                    <i className="fa fa-search" />
                  </button>
                  <button
                    style={{ marginTop: "28px" }}
                    className="btn btn-primary"
                    onClick={(e) =>
                      this.toggleModal(e, last_page * per_page, per_page)
                    }
                  >
                    <i className="fa fa-print" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            className="table table-hover table-noborder"
            style={{ zoom: "80%" }}
          >
            <thead className="bg-light">
              <tr>
                <th
                  className="text-black text-center middle nowrap"
                  rowSpan="2"
                >
                  No
                </th>
                <th
                  className="text-black text-center middle nowrap"
                  rowSpan="2"
                >
                  #
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Kode Barang
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Barcode
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Satuan
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Nama
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Supplier
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Sub Dept
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Kelompok
                </th>
                <th
                  className={`text-black middle nowrap ${
                    !this.state.bukaHarga ? "d-none" : ""
                  }`}
                  rowSpan="2"
                >
                  Harga Beli
                </th>
                <th
                  className={`text-black middle nowrap ${
                    !this.state.bukaHarga ? "d-none" : ""
                  }`}
                  rowSpan="2"
                >
                  Harga Jual
                </th>
                <th
                  className="text-black middle nowrap text-center"
                  colSpan="5"
                >
                  Stok
                </th>
                <th
                  className={`text-black middle nowrap ${
                    !this.state.bukaHarga ? "d-none" : ""
                  }`}
                  rowSpan="2"
                >
                  Total Harga Beli
                </th>

                <th
                  className={`text-black middle nowrap ${
                    !this.state.bukaHarga ? "d-none" : ""
                  }`}
                  rowSpan="2"
                >
                  Total Harga Jual
                </th>
              </tr>
              <tr>
                <th className="text-black middle nowrap" rowSpan="1">
                  Awal
                </th>
                <th className="text-black middle nowrap" rowSpan="1">
                  In
                </th>
                <th className="text-black middle nowrap" rowSpan="1">
                  Out
                </th>
                <th className="text-black middle nowrap" rowSpan="1">
                  Sale
                </th>
                <th className="text-black middle nowrap" rowSpan="1">
                  Akhir
                </th>
              </tr>
              <tr></tr>
            </thead>
            {
              <tbody>
                {typeof data === "object" ? (
                  data.map((v, i) => {
                    const stok_akhir =
                      parseFloat(v.stock_awal) +
                      parseFloat(v.stock_masuk) -
                      parseFloat(v.stock_keluar);
                    total_dn_per =
                      total_dn_per + parseFloat(v.delivery_note, 10);
                    total_first_stock_per =
                      total_first_stock_per + parseFloat(v.stock_awal, 10);
                    total_last_stock_per =
                      total_last_stock_per +
                      parseFloat(v.stock_awal) +
                      parseFloat(v.stock_masuk) -
                      parseFloat(v.stock_keluar);
                    total_last_stock_per = total_last_stock_per + stok_akhir;
                    total_stock_in_per =
                      total_stock_in_per + parseFloat(v.stock_masuk, 10);
                    total_stock_out_per =
                      total_stock_out_per + parseFloat(v.stock_keluar, 10);
                    total_jual_per += parseInt(v.harga_lokasi, 10);
                    total_beli_per += parseInt(v.harga_beli_lokasi, 10);
                    total_jual_qty_per += parseInt(
                      v.harga_lokasi *
                        (parseFloat(v.stock_awal) + parseFloat(v.stock_masuk)) -
                        (parseFloat(v.stock_keluar) +
                          parseFloat(v.stock_penjualan)),
                      10
                    );
                    total_beli_qty_per += parseInt(
                      v.harga_beli_lokasi *
                        (parseFloat(v.stock_awal) + parseFloat(v.stock_masuk)) -
                        (parseFloat(v.stock_keluar) +
                          parseFloat(v.stock_penjualan)),
                      10
                    );
                    total_stock_penjualan_per =
                      total_stock_penjualan_per +
                      parseFloat(v.stock_penjualan, 10);
                    get_lokasi = v.lokasi === "-";
                    return (
                      <tr key={i}>
                        <td className="text-center middle nowrap">
                          {generateNo(i, current_page)}
                        </td>
                        <td className="text-center middle nowrap">
                          {/* Example split danger button */}
                          <div className="btn-group">
                            <UncontrolledButtonDropdown>
                              <DropdownToggle caret></DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem
                                  href={`${HEADERS.URL}reports/penjualan/${v.kd_trx}.pdf`}
                                  target="_blank"
                                >
                                  Export
                                </DropdownItem>
                                <DropdownItem
                                  onClick={(e) =>
                                    this.toggle(
                                      e,
                                      v.kd_brg,
                                      v.barcode,
                                      v.nm_brg
                                    )
                                  }
                                >
                                  Detail
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledButtonDropdown>
                          </div>
                        </td>
                        <td className="middle nowrap">{v.kd_brg}</td>
                        <td className="middle nowrap">{v.barcode}</td>
                        <td className="middle nowrap">{v.satuan}</td>
                        <td className="middle nowrap">{v.nm_brg}</td>
                        <td className="middle nowrap">{v.supplier}</td>
                        <td className="middle nowrap">{v.sub_dept}</td>
                        <td className="middle nowrap">{v.nama_kel}</td>
                        <td
                          className={`middle nowrap text-right ${
                            !this.state.bukaHarga ? "d-none" : ""
                          }`}
                        >
                          {get_lokasi ? 0 : toRp(v.harga_beli_lokasi)}
                        </td>
                        <td
                          className={`middle nowrap text-right ${
                            !this.state.bukaHarga ? "d-none" : ""
                          }`}
                        >
                          {get_lokasi ? 0 : toRp(v.harga_lokasi)}
                        </td>
                        <td className="text-right middle nowrap">
                          {v.stock_awal}
                        </td>
                        <td className="text-right middle nowrap">
                          {v.stock_masuk}
                        </td>
                        <td className="text-right middle nowrap">
                          {v.stock_keluar}
                        </td>
                        <td className="text-right middle nowrap">
                          {v.stock_penjualan}
                        </td>
                        <td className="text-right middle nowrap">
                          {parseFloat(v.stock_awal) +
                            parseFloat(v.stock_masuk) -
                            (parseFloat(v.stock_keluar) +
                              parseFloat(v.stock_penjualan))}
                        </td>
                        <td
                          className={`text-right middle nowrap ${
                            !this.state.bukaHarga ? "d-none" : ""
                          }`}
                        >
                          {get_lokasi
                            ? 0
                            : toRp(
                                v.harga_beli_lokasi *
                                  (parseFloat(v.stock_awal) +
                                    parseFloat(v.stock_masuk)) -
                                  (parseFloat(v.stock_keluar) +
                                    parseFloat(v.stock_penjualan))
                              )}
                        </td>

                        <td
                          className={`text-right middle nowrap ${
                            !this.state.bukaHarga ? "d-none" : ""
                          }`}
                        >
                          {get_lokasi
                            ? 0
                            : toRp(
                                v.harga_lokasi *
                                  (parseFloat(v.stock_awal) +
                                    parseFloat(v.stock_masuk)) -
                                  (parseFloat(v.stock_keluar) +
                                    parseFloat(v.stock_penjualan))
                              )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={14}>No Data</td>
                  </tr>
                )}
              </tbody>
            }
            <tfoot>
              <tr style={{ fontWeight: "bold", backgroundColor: "#EEEEEE" }}>
                <th colSpan="9">TOTAL PERPAGE</th>
                {/* <th colSpan="1" style={{textAlign:"right"}}>{total_dn_per}</th> */}
                <th
                  className={`${!this.state.bukaHarga ? "d-none" : ""}`}
                  colSpan="1"
                  style={{ textAlign: "right" }}
                >
                  {toRp(total_beli_per)}
                </th>
                <th
                  className={`${!this.state.bukaHarga ? "d-none" : ""}`}
                  colSpan="1"
                  style={{ textAlign: "right" }}
                >
                  {toRp(total_jual_per)}
                </th>
                <th colSpan="1" style={{ textAlign: "right" }}>
                  {total_first_stock_per}
                </th>
                <th colSpan="1" style={{ textAlign: "right" }}>
                  {total_stock_in_per}
                </th>
                <th colSpan="1" style={{ textAlign: "right" }}>
                  {total_stock_out_per}
                </th>
                <th colSpan="1" style={{ textAlign: "right" }}>
                  {total_stock_penjualan_per}
                </th>
                <th colSpan="1" style={{ textAlign: "right" }}>
                  {total_last_stock_per}
                </th>
                <th
                  className={`${!this.state.bukaHarga ? "d-none" : ""}`}
                  colSpan="1"
                  style={{ textAlign: "right" }}
                >
                  {toRp(total_beli_qty_per)}
                </th>

                <th
                  className={`${!this.state.bukaHarga ? "d-none" : ""}`}
                  colSpan="1"
                  style={{ textAlign: "right" }}
                >
                  {toRp(total_jual_qty_per)}
                </th>
              </tr>
              <tr style={{ fontWeight: "bold", backgroundColor: "#EEEEEE" }}>
                <th colSpan="9">TOTAL</th>
                {/* <th colSpan="1" style={{textAlign:"right"}}>{total_dn!==undefined?total_dn:'0'}</th> */}
                <th
                  className={`${!this.state.bukaHarga ? "d-none" : ""}`}
                  colSpan="1"
                  style={{ textAlign: "right" }}
                >
                  {toRp(total_harga_beli)}
                </th>
                <th
                  className={`${!this.state.bukaHarga ? "d-none" : ""}`}
                  colSpan="1"
                  style={{ textAlign: "right" }}
                >
                  {toRp(total_harga_jual)}
                </th>
                <th colSpan="1" style={{ textAlign: "right" }}>
                  {total_stock_awal === undefined || total_stock_awal === null
                    ? 0
                    : total_stock_awal}
                </th>
                <th colSpan="1" style={{ textAlign: "right" }}>
                  {total_stock_masuk === undefined || total_stock_masuk === null
                    ? 0
                    : total_stock_masuk}
                </th>
                <th colSpan="1" style={{ textAlign: "right" }}>
                  {total_stock_keluar === undefined ||
                  total_stock_keluar === null
                    ? 0
                    : total_stock_keluar}
                </th>
                <th colSpan="1" style={{ textAlign: "right" }}>
                  {total_stock_penjualan === undefined ||
                  total_stock_penjualan === null
                    ? 0
                    : total_stock_penjualan}
                </th>
                <th colSpan="1" style={{ textAlign: "right" }}>
                  {total_stock_akhir === undefined || total_stock_akhir === null
                    ? 0
                    : total_stock_akhir}
                </th>
                <th
                  className={`${!this.state.bukaHarga ? "d-none" : ""}`}
                  colSpan="1"
                  style={{ textAlign: "right" }}
                >
                  {toRp(
                    total_harga_beli_qty === undefined ||
                      total_harga_beli_qty === null
                      ? 0
                      : total_harga_beli_qty
                  )}
                </th>

                <th
                  className={`${!this.state.bukaHarga ? "d-none" : ""}`}
                  colSpan="1"
                  style={{ textAlign: "right" }}
                >
                  {toRp(
                    total_harga_jual_qty === undefined ||
                      total_harga_jual_qty === null
                      ? 0
                      : total_harga_jual_qty
                  )}
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
        <div style={{ marginTop: "20px", float: "right" }}>
          <Paginationq
            current_page={parseInt(current_page, 10)}
            per_page={parseInt(per_page, 10)}
            total={parseInt(total, 10)}
            callback={this.handlePageChange.bind(this)}
          />
        </div>
        {this.state.isModalDetail ? (
          <DetailStockReportSatuan
            token={this.props.token}
            stockReportDetailSatuan={this.props.stockReportDetailSatuan}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            lokasi={this.props.auth.user.lokasi}
          />
        ) : null}
        {this.state.isModalExcel ? (
          <StockReportExcel
            startDate={this.state.startDate}
            endDate={this.state.endDate}
          />
        ) : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    stockReport: state.stockReportReducer.data,
    stockReportExcel: state.stockReportReducer.report_excel,
    total_stock: state.stockReportReducer.total_stock,
    auth: state.auth,
    isLoading: state.stockReportReducer.isLoading,
    stockReportDetailSatuan: state.stockReportReducer.dataDetailSatuan,
    isLoadingDetailSatuan: state.stockReportReducer.isLoadingDetailSatuan,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(InventoryReport);
