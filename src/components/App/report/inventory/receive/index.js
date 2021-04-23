import React, { Component } from "react";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import { FetchReport } from "redux/actions/purchase/receive/receive.action";
import Preloader from "Preloader";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { rangeDate } from "helper";
import Select from "react-select";
import moment from "moment";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import Paginationq from "helper";
import DetailReceiveReport from "../../../modals/report/purchase/receive/detail_receive_report";
import ReceiveReportExcel from "../../../modals/report/purchase/receive/form_receive_excel";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import {
  deleteReceiveReport,
  FetchReceiveData,
  FetchReportExcel,
  FetchReportDetail,
} from "redux/actions/purchase/receive/receive.action";
import { toRp } from "helper";
import FormReturReceive from "../../../modals/report/purchase/receive/form_retur_receive";
import Swal from "sweetalert2";

class ReceiveReport extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleEvent = this.handleEvent.bind(this);
    this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
    this.HandleChangeType = this.HandleChangeType.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRetur = this.handleRetur.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.HandleChangeSort = this.HandleChangeSort.bind(this);
    this.HandleChangeFilter = this.HandleChangeFilter.bind(this);
    this.HandleChangeStatus = this.HandleChangeStatus.bind(this);
    this.state = {
      where_data: "",
      detail: {},
      startDate: moment(new Date()).format("yyyy-MM-DD"),
      endDate: moment(new Date()).format("yyyy-MM-DD"),
      location_data: [],
      location: "",
      type_data: [],
      type: "",
      any_receive_report: "",
      sort: "",
      sort_data: [],
      filter: "",
      filter_data: [],
      status: "",
      status_data: [],
      isModalDetail: false,
      isModalForm: false,
      isModalExport: false,
    };
  }

  componentWillUnmount() {
    this.setState({
      isModalDetail: false,
      isModalForm: false,
      isModalExport: false,
    });
  }
  componentWillMount() {
    let page = localStorage.getItem("pageNumber_receive_report");
    this.checkingParameter(page !== undefined && page !== null ? page : 1);
  }
  componentDidMount() {
    if (
      localStorage.location_receive_report !== undefined &&
      localStorage.location_receive_report !== ""
    ) {
      this.setState({
        location: localStorage.location_receive_report,
      });
    }

    if (
      localStorage.type_receive_report !== undefined &&
      localStorage.type_receive_report !== ""
    ) {
      this.setState({
        type: localStorage.type_receive_report,
      });
    }
    if (
      localStorage.any_receive_report !== undefined &&
      localStorage.any_receive_report !== ""
    ) {
      this.setState({
        any: localStorage.any_receive_report,
      });
    }
    if (
      localStorage.date_from_receive_report !== undefined &&
      localStorage.date_from_receive_report !== null
    ) {
      this.setState({
        startDate: localStorage.date_from_receive_report,
      });
    }
    if (
      localStorage.date_to_receive_report !== undefined &&
      localStorage.date_to_receive_report !== null
    ) {
      this.setState({
        endDate: localStorage.date_to_receive_report,
      });
    }
    if (
      localStorage.sort_receive_report !== undefined &&
      localStorage.sort_receive_report !== null
    ) {
      this.setState({ sort: localStorage.sort_receive_report });
    }
    if (
      localStorage.filter_receive_report !== undefined &&
      localStorage.filter_receive_report !== null
    ) {
      this.setState({ filter: localStorage.filter_receive_report });
    }
    if (
      localStorage.status_receive_report !== undefined &&
      localStorage.status_receive_report !== null
    ) {
      this.setState({ status: localStorage.status_receive_report });
    }
    // let page=localStorage.getItem("pageNumber_receive_report");
    // this.checkingParameter(page!==undefined&&page!==null?page:1);
  }
  componentWillReceiveProps = (nextProps) => {
    let type = [
      { kode: "", value: "Semua Tipe" },
      { kode: "Tunai", value: "Tunai" },
      { kode: "Kredit", value: "Kredit" },
    ];
    let data_type = [];
    type.map((i) => {
      data_type.push({
        value: i.kode,
        label: i.value,
      });
      return null;
    });
    let sort = [
      { kode: "desc", value: "DESCENDING" },
      { kode: "asc", value: "ASCENDING" },
    ];
    let data_sort = [];
    sort.map((i) => {
      data_sort.push({
        value: i.kode,
        label: i.value,
      });
      return null;
    });
    let filter = [
      { kode: "no_faktur_beli", value: "No. Faktur" },
      { kode: "nama_penerima", value: "Penerima" },
    ];
    let data_filter = [];
    filter.map((i) => {
      data_filter.push({
        value: i.kode,
        label: i.value,
      });
      return null;
    });
    let status = [
      { kode: "", value: "Semua Status" },
      { kode: "0", value: "Belum Lunas" },
      { kode: "1", value: "Lunas" },
    ];
    let data_status = [];
    status.map((i) => {
      data_status.push({
        value: i.kode,
        label: i.value,
      });
      return null;
    });
    this.setState({
      sort_data: data_sort,
      filter_data: data_filter,
      status_data: data_status,
      type_data: data_type,
    });
    if (nextProps.auth.user) {
      let lk = [
        {
          value: "",
          label: "Semua Lokasi",
        },
      ];
      let loc = nextProps.auth.user.lokasi;
      if (loc !== undefined) {
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

    localStorage.setItem(
      "status_receive_report",
      this.state.status === "" || this.state.status === undefined
        ? status[0].kode
        : localStorage.status_receive_report
    );
    localStorage.setItem(
      "sort_receive_report",
      this.state.sort === "" || this.state.sort === undefined
        ? sort[0].kode
        : localStorage.sort_receive_report
    );
    localStorage.setItem(
      "filter_receive_report",
      this.state.filter === "" || this.state.filter === undefined
        ? filter[0].kode
        : localStorage.filter_receive_report
    );
  };
  checkingParameter(pageNumber) {
    let where = "";
    let dateFrom = localStorage.getItem("date_from_receive_report");
    let dateTo = localStorage.getItem("date_to_receive_report");
    let tipe = localStorage.getItem("type_receive_report");
    let lokasi = localStorage.getItem("location_receive_report");
    let any = localStorage.getItem("any_receive_report");
    let sort = localStorage.sort_receive_report;
    let filter = localStorage.filter_receive_report;
    let status = localStorage.status_receive_report;
    if (dateFrom !== null && dateTo !== null) {
      if (where !== "") {
        where += "&";
      }
      where += `datefrom=${dateFrom}&dateto=${dateTo}`;
    } else {
      if (where !== "") {
        where += "&";
      }
      where += `datefrom=${this.state.startDate}&dateto=${this.state.endDate}`;
    }
    if (tipe !== undefined && tipe !== null && tipe !== "") {
      if (where !== "") {
        where += "&";
      }
      where += `type=${tipe}`;
    }
    if (lokasi !== undefined && lokasi !== null && lokasi !== "") {
      if (where !== "") {
        where += "&";
      }
      where += `lokasi=${lokasi}`;
    }
    if (status !== undefined && status !== null && status !== "") {
      if (where !== "") {
        where += "&";
      }
      where += `status=${status}`;
    }
    if (filter !== undefined && filter !== null && filter !== "") {
      if (sort !== undefined && sort !== null && sort !== "") {
        if (where !== "") {
          where += "&";
        }
        where += `sort=${filter}|${sort}`;
      }
    }
    if (any !== undefined && any !== null && any !== "") {
      if (where !== "") {
        where += "&";
      }
      where += `q=${any}`;
    }
    this.setState({
      where_data: where,
    });
    this.props.dispatch(
      FetchReport(pageNumber === null ? 1 : pageNumber, where)
    );
    // this.props.dispatch(FetchReportExcel(where));
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  HandleChangeType(type) {
    this.setState({
      type: type.value,
    });
    localStorage.setItem("type_receive_report", type.value);
  }
  HandleChangeSort(sr) {
    this.setState({
      sort: sr.value,
    });
    localStorage.setItem("sort_receive_report", sr.value);
  }
  HandleChangeFilter(fl) {
    this.setState({
      filter: fl.value,
    });
    localStorage.setItem("filter_receive_report", fl.value);
  }
  HandleChangeStatus(st) {
    this.setState({
      status: st.value,
    });
    localStorage.setItem("status_receive_report", st.value);
  }

  HandleChangeLokasi(lk) {
    this.setState({
      location: lk.value,
    });
    localStorage.setItem("location_receive_report", lk.value);
  }
  handleEvent = (event, picker) => {
    const awal = moment(picker.startDate._d).format("YYYY-MM-DD");
    const akhir = moment(picker.endDate._d).format("YYYY-MM-DD");
    localStorage.setItem("date_from_receive_report", `${awal}`);
    localStorage.setItem("date_to_receive_report", `${akhir}`);
    this.setState({
      startDate: awal,
      endDate: akhir,
    });
  };
  handlePageChange(pageNumber) {
    localStorage.setItem("pageNumber_receive_report", pageNumber);
    this.checkingParameter(pageNumber);
  }
  handleSearch(e) {
    e.preventDefault();
    localStorage.setItem("any_receive_report", this.state.any_receive_report);
    this.checkingParameter(1);
  }
  toggle(e, kdTrx, tgl, lokasi, penerima, pelunasan, operator) {
    e.preventDefault();
    this.setState({ isModalDetail: true });
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("receiveReportDetail"));
    let que = `detail_receive_report`;
    localStorage.setItem(`kd_trx_${que}`, kdTrx);
    localStorage.setItem(`tgl_${que}`, tgl);
    localStorage.setItem(`lokasi_${que}`, lokasi);
    localStorage.setItem(`penerima_${que}`, penerima);
    localStorage.setItem(`pelunasan_${que}`, pelunasan);
    localStorage.setItem(`operator_${que}`, operator);
    this.props.dispatch(FetchReportDetail(1, kdTrx));
  }
  handleRetur(e, kode) {
    e.preventDefault();
    this.setState({ isModalForm: true });

    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formReturReceive"));
    this.props.dispatch(FetchReceiveData(kode, ""));
  }
  handleDelete(e, kode) {
    e.preventDefault();
    Swal.fire({
      allowOutsideClick: false,
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        this.props.dispatch(deleteReceiveReport(kode));
      }
    });
  }
  handleChangePage(
    e,
    kode,
    lokasi,
    catatan,
    kode_supplier,
    penerima,
    nonota,
    type
  ) {
    e.preventDefault();
    localStorage.setItem("kode_edit", kode);
    localStorage.setItem("lokasi_edit", lokasi);
    localStorage.setItem("catatan_edit", catatan);
    localStorage.setItem("kode_supplier_edit", kode_supplier);
    localStorage.setItem("nama_penerima_edit", penerima);
    localStorage.setItem("nonota_edit", nonota);
    localStorage.setItem("type_edit", type);
    // window.location.href = `/receive/${kode}`;
    this.props.history.push(`/receive/${kode}`);
    // this.props.dispatch(FetchReceiveData(kode,'edit'));
  }
  toggleModal(e, total, perpage) {
    e.preventDefault();
    this.setState({ isModalExport: true });

    const bool = !this.props.isOpen;
    // let range = total*perpage;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formReceiveExcel"));
    this.props.dispatch(FetchReportExcel(1, this.state.where_data, total));
  }
  render() {
    const columnStyle = {
      verticalAlign: "middle",
      textAlign: "center",
      whiteSpace: "nowrap",
    };
    const {
      // total,
      last_page,
      per_page,
      current_page,
      // from,
      // to,
      data,
    } = this.props.data;
    let tot_beli = 0;
    return (
      <Layout page="Laporan Pembelian">
        <div className="row" style={{ zoom: "70%", padding: "0px" }}>
          <div className="col-md-11">
            <div className="row">
              <div
                className="col-6 col-xs-6 col-md-2"
                style={{ paddingRight: "0px" }}
              >
                <div className="form-group">
                  <label htmlFor=""> Periode </label>
                  <DateRangePicker
                    ranges={rangeDate}
                    alwaysShowCalendars={true}
                    onEvent={this.handleEvent}
                    showDropdowns={true}
                    autoUpdateInput={true}
                  >
                    <input
                      type="text"
                      className="form-control"
                      name="date_receive_report"
                      defaultValue={`${this.state.startDate} to ${this.state.endDate}`}
                      style={{ padding: "10px", fontWeight: "bolder" }}
                    />
                  </DateRangePicker>
                </div>
              </div>
              <div
                className="col-6 col-xs-6 col-md-2"
                style={{ padding: "0px" }}
              >
                <div className="form-group">
                  <label className="control-label font-12">Lokasi</label>
                  <Select
                    options={this.state.location_data}
                    placeholder="Pilih Lokasi"
                    onChange={this.HandleChangeLokasi}
                    value={this.state.location_data.find((op) => {
                      return op.value === this.state.location;
                    })}
                  />
                </div>
              </div>
              <div
                className="col-6 col-xs-6 col-md-2"
                style={{ padding: "0px" }}
              >
                <div className="form-group">
                  <label className="control-label font-12">
                    Tipe Transaksi
                  </label>
                  <Select
                    options={this.state.type_data}
                    placeholder="Pilih Tipe Transaksi"
                    onChange={this.HandleChangeType}
                    value={this.state.type_data.find((op) => {
                      return op.value === this.state.type;
                    })}
                  />
                </div>
              </div>
              <div
                className="col-6 col-xs-6 col-md-2"
                style={{ padding: "0px" }}
              >
                <div className="form-group">
                  <label className="control-label font-12">Filter</label>
                  <Select
                    options={this.state.filter_data}
                    // placeholder="Pilih Tipe Kas"
                    onChange={this.HandleChangeFilter}
                    value={this.state.filter_data.find((op) => {
                      return op.value === this.state.filter;
                    })}
                  />
                </div>
              </div>
              <div
                className="col-6 col-xs-6 col-md-1"
                style={{ padding: "0px" }}
              >
                <div className="form-group">
                  <label className="control-label font-12">Sort</label>
                  <Select
                    options={this.state.sort_data}
                    // placeholder="Pilih Tipe Kas"
                    onChange={this.HandleChangeSort}
                    value={this.state.sort_data.find((op) => {
                      return op.value === this.state.sort;
                    })}
                  />
                </div>
              </div>
              <div
                className="col-6 col-xs-6 col-md-2"
                style={{ padding: "0px" }}
              >
                <div className="form-group">
                  <label className="control-label font-12">Status</label>
                  <Select
                    options={this.state.status_data}
                    placeholder="Pilih Status Transaksi"
                    onChange={this.HandleChangeStatus}
                    value={this.state.status_data.find((op) => {
                      return op.value === this.state.status;
                    })}
                  />
                </div>
              </div>
              <div
                className="col-12 col-xs-12 col-md-1"
                style={{ padding: "0px" }}
              >
                <div className="form-group">
                  <label htmlFor="">Cari</label>
                  <input
                    type="text"
                    name="any_receive_report"
                    className="form-control"
                    style={{ width: "100%" }}
                    value={this.state.any_receive_report}
                    onChange={(e) => this.handleChange(e)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-1 text-right">
            <button
              style={{ marginTop: "27px", marginRight: "2px" }}
              className="btn btn-primary"
              onClick={this.handleSearch}
            >
              <i className="fa fa-search" />
            </button>
            <button
              style={{ marginTop: "27px" }}
              className="btn btn-primary"
              onClick={(e) =>
                this.toggleModal(e, last_page * per_page, per_page)
              }
            >
              <i className="fa fa-print"></i>
            </button>
          </div>
        </div>
        <div style={{ overflowX: "auto", zoom: "80%", padding: "0px" }}>
          <table
            className="table table-hover table-bordered"
            style={{ padding: "0px" }}
          >
            <thead className="bg-light">
              <tr>
                <th className="text-black" style={columnStyle}>
                  No
                </th>
                <th className="text-black" style={columnStyle}>
                  #
                </th>
                <th className="text-black" style={columnStyle}>
                  No Faktur
                </th>
                <th className="text-black" style={columnStyle}>
                  Tanggal
                </th>
                <th className="text-black" style={columnStyle}>
                  Penerima
                </th>
                <th className="text-black" style={columnStyle}>
                  Tipe
                </th>
                <th className="text-black" style={columnStyle}>
                  Pelunasan
                </th>
                <th className="text-black" style={columnStyle}>
                  Diskon
                </th>
                <th className="text-black" style={columnStyle}>
                  PPN
                </th>
                <th className="text-black" style={columnStyle}>
                  Supplier
                </th>
                <th className="text-black" style={columnStyle}>
                  Operator
                </th>
                <th className="text-black" style={columnStyle}>
                  Lokasi
                </th>
                <th className="text-black" style={columnStyle}>
                  Serial
                </th>
                <th className="text-black" style={columnStyle}>
                  Pembayaran ke-
                </th>
                <th className="text-black" style={columnStyle}>
                  Sisa Pembayaran
                </th>
                <th className="text-black" style={columnStyle}>
                  Qty Beli
                </th>
                <th className="text-black" style={columnStyle}>
                  Total Beli
                </th>
              </tr>
            </thead>
            <tbody>
              {typeof data === "object" ? (
                data.length > 0 ? (
                  data.map((v, i) => {
                    tot_beli = tot_beli + parseInt(v.total_beli, 10);
                    return (
                      <tr key={i}>
                        <td style={columnStyle}>
                          {" "}
                          {i + 1 + 10 * (parseInt(current_page, 10) - 1)}
                        </td>

                        <td style={columnStyle}>
                          {/* Example split danger button */}
                          <div className="btn-group">
                            <UncontrolledButtonDropdown>
                              <DropdownToggle caret>Aksi</DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem
                                  onClick={(e) =>
                                    this.toggle(
                                      e,
                                      v.no_faktur_beli,
                                      moment(v.tgl_beli).format("YYYY-MM-DD"),
                                      v.lokasi,
                                      v.nama_penerima,
                                      v.pelunasan,
                                      v.operator
                                    )
                                  }
                                >
                                  Detail
                                </DropdownItem>
                                <DropdownItem
                                  onClick={(e) =>
                                    this.handleRetur(e, v.no_faktur_beli)
                                  }
                                >
                                  Retur
                                </DropdownItem>
                                <DropdownItem
                                  onClick={(e) =>
                                    this.handleDelete(e, v.no_faktur_beli)
                                  }
                                >
                                  Delete
                                </DropdownItem>
                                <DropdownItem
                                  onClick={(e) =>
                                    this.handleChangePage(
                                      e,
                                      v.no_faktur_beli,
                                      v.kd_lokasi,
                                      "-",
                                      v.kode_supplier,
                                      v.nama_penerima,
                                      v.nonota,
                                      v.type
                                    )
                                  }
                                >
                                  Edit
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledButtonDropdown>
                          </div>
                        </td>
                        <td style={columnStyle}>{v.no_faktur_beli}</td>
                        <td style={columnStyle}>
                          {moment(v.tgl_beli).format("YYYY-MM-DD")}
                        </td>
                        <td style={columnStyle}>{v.nama_penerima}</td>
                        <td style={columnStyle}>{v.type}</td>
                        <td style={columnStyle}>{v.pelunasan}</td>
                        <td style={columnStyle}>{v.disc}</td>
                        <td style={columnStyle}>{v.ppn}</td>
                        <td style={columnStyle}>{v.supplier}</td>
                        <td style={columnStyle}>{v.operator}</td>
                        <td style={columnStyle}>{v.lokasi}</td>
                        <td style={columnStyle}>{v.serial}</td>
                        <td style={columnStyle}>{v.jumlah_pembayaran}</td>
                        <td style={columnStyle}>
                          {v.pelunasan.toLowerCase() === "lunas"
                            ? 0
                            : toRp(
                                parseFloat(v.total_beli) -
                                  parseFloat(v.jumlah_bayar)
                              )}
                        </td>
                        <td style={columnStyle}>{v.qty_beli}</td>
                        <td style={{ textAlign: "right" }}>
                          {toRp(parseInt(v.total_beli, 10))}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td>No Data.</td>
                  </tr>
                )
              ) : (
                <tr>
                  <td>No Data.</td>
                </tr>
              )}
            </tbody>

            <tfoot>
              <tr style={{ backgroundColor: "#EEEEEE" }}>
                <td colSpan="16">TOTAL PERPAGE</td>
                <td style={{ textAlign: "right" }}>{toRp(tot_beli)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div style={{ marginTop: "20px", float: "right" }}>
          <Paginationq
            current_page={parseInt(current_page, 10)}
            per_page={parseInt(per_page, 10)}
            total={parseInt(last_page * per_page, 10)}
            callback={this.handlePageChange.bind(this)}
          />
        </div>
        {this.state.isModalDetail ? (
          <DetailReceiveReport
            receiveReportDetail={this.props.receiveReportDetail}
          />
        ) : null}

        {this.state.isModalForm ? (
          <FormReturReceive dataRetur={this.props.dataRetur} />
        ) : null}
        {this.state.isModalExport ? (
          <ReceiveReportExcel
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            location={this.state.location}
          />
        ) : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.receiveReducer.data,
    isLoading: state.receiveReducer.isLoading,
    // isLoadingReportDetail: state.receiveReducer.isLoadingReportDetail,
    receiveReportDetail: state.receiveReducer.dataReceiveReportDetail,
    dataRetur: state.receiveReducer.receive_data,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(ReceiveReport);
