import React, { Component } from "react";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import {
  fetchPoReport,
  fetchPoReportExcel,
} from "redux/actions/purchase/purchase_order/po.action";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import { poReportDetail } from "redux/actions/purchase/purchase_order/po.action";
import moment from "moment";
import Paginationq, { statusQ } from "helper";
import DetailPoReport from "components/App/modals/report/purchase/purchase_order/detail_po_report";
import PoReportExcel from "components/App/modals/report/purchase/purchase_order/form_po_excel";
import DateRangePicker from "react-bootstrap-daterangepicker";
import Select from "react-select";
import { rangeDate } from "helper";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";

class PoReport extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleEvent = this.handleEvent.bind(this);
    this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.HandleChangeSort = this.HandleChangeSort.bind(this);
    this.HandleChangeFilter = this.HandleChangeFilter.bind(this);
    this.HandleChangeStatus = this.HandleChangeStatus.bind(this);
    this.state = {
      master: {},
      where_data: "",
      any: "",
      location: "",
      location_data: [],
      startDate: moment(new Date()).format("yyyy-MM-DD"),
      endDate: moment(new Date()).format("yyyy-MM-DD"),
      sort: "",
      sort_data: [],
      filter: "",
      filter_data: [],
      status: "",
      status_data: [],
      isModalDetail: false,
      isModalExport: false,
    };
  }

  componentWillUnmount() {
    this.setState({ isModalDetail: false, isModalExport: false });
  }

  getProps(param) {
    if (param.auth.user) {
      let lk = [
        {
          value: "",
          label: "Semua Lokasi",
        },
      ];
      let loc = param.auth.user.lokasi;
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
  }
  componentWillReceiveProps(nextProps) {
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
      { kode: "no_po", value: "No. PO" },
      { kode: "tgl_po", value: "Tanggal PO" },
      { kode: "tglkirim", value: "Tanggal Kirim" },
      { kode: "nama_supplier", value: "Nama Supplier" },
      { kode: "status", value: "Status" },
      { kode: "kode_supplier", value: "Kode Supplier" },
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
      { kode: "", value: "Semua" },
      { kode: "0", value: "Processing" },
      { kode: "1", value: "Ordered" },
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
    });
    this.getProps(nextProps);

    localStorage.setItem(
      "status_po_report",
      this.state.status === "" || this.state.status === undefined
        ? status[0].kode
        : localStorage.status_po_report
    );
    localStorage.setItem(
      "sort_po_report",
      this.state.sort === "" || this.state.sort === undefined
        ? sort[0].kode
        : localStorage.sort_po_report
    );
    localStorage.setItem(
      "filter_po_report",
      this.state.filter === "" || this.state.filter === undefined
        ? filter[0].kode
        : localStorage.filter_po_report
    );
  }
  componentWillMount() {
    this.getProps(this.props);
    let page = localStorage.page_po_report;
    if (page !== undefined && page !== null) {
      this.handleParamter(page);
    } else {
      this.handleParamter(1);
    }
  }
  componentDidMount() {
    if (
      localStorage.location_po_report !== undefined &&
      localStorage.location_po_report !== null
    ) {
      this.setState({ location: localStorage.location_po_report });
    }
    if (
      localStorage.any_po_report !== undefined &&
      localStorage.any_po_report !== ""
    ) {
      this.setState({ any: localStorage.any_po_report });
    }
    if (
      localStorage.date_from_po_report !== undefined &&
      localStorage.date_from_po_report !== null
    ) {
      this.setState({ startDate: localStorage.date_from_po_report });
    }
    if (
      localStorage.date_to_po_report !== undefined &&
      localStorage.date_to_po_report !== null
    ) {
      this.setState({ endDate: localStorage.date_to_po_report });
    }
    if (
      localStorage.sort_po_report !== undefined &&
      localStorage.sort_po_report !== null
    ) {
      this.setState({ sort: localStorage.sort_po_report });
    }
    if (
      localStorage.filter_po_report !== undefined &&
      localStorage.filter_po_report !== null
    ) {
      this.setState({ filter: localStorage.filter_po_report });
    }
    if (
      localStorage.status_po_report !== undefined &&
      localStorage.status_po_report !== null
    ) {
      this.setState({ status: localStorage.status_po_report });
    }
  }
  handleParamter(pageNumber) {
    let dateFrom = localStorage.date_from_po_report;
    let dateTo = localStorage.date_to_po_report;
    let lokasi = localStorage.location_po_report;
    let any = localStorage.any_po_report;
    let sort = localStorage.sort_po_report;
    let filter = localStorage.filter_po_report;
    let status = localStorage.status_po_report;
    let where = "";
    if (dateFrom !== undefined && dateFrom !== null) {
      where += `&dateFrom=${dateFrom}&dateTo=${dateTo}`;
    }
    if (lokasi !== undefined && lokasi !== null && lokasi !== "") {
      where += `&lokasi=${lokasi}`;
    }
    if (status !== undefined && status !== null && status !== "") {
      where += `&status=${status}`;
    }
    if (filter !== undefined && filter !== null && filter !== "") {
      if (sort !== undefined && sort !== null && sort !== "") {
        where += `&sort=${filter}|${sort}`;
      }
    }
    if (any !== undefined && any !== null && any !== "") {
      where += `&q=${any}`;
    }
    this.setState({
      where_data: where,
    });
    this.props.dispatch(fetchPoReport(pageNumber, where));
    // this.props.dispatch(fetchPoReportExcel(pageNumber,where))
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  handleEvent = (event, picker) => {
    const awal = moment(picker.startDate._d).format("YYYY-MM-DD");
    const akhir = moment(picker.endDate._d).format("YYYY-MM-DD");
    localStorage.setItem("date_from_po_report", `${awal}`);
    localStorage.setItem("date_to_po_report", `${akhir}`);
    this.setState({
      startDate: awal,
      endDate: akhir,
    });
  };
  HandleChangeLokasi(lk) {
    this.setState({ location: lk.value });
    localStorage.setItem("location_po_report", lk.value);
  }
  handlePageChange(pageNumber) {
    localStorage.setItem("page_po_report", pageNumber);
    this.handleParamter(pageNumber);
  }
  handleSearch(e) {
    e.preventDefault();
    localStorage.setItem("any_po_report", this.state.any);
    this.handleParamter(1);
  }
  toggle(e, no_po, i) {
    e.preventDefault();
    this.setState({ isModalDetail: true });
    this.props.dispatch(poReportDetail(1, no_po));
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("poReportDetail"));

    this.setState({
      master: {
        no_po: no_po,
        tgl_po: moment(this.props.poReport.data[i].tgl_po).format("yyyy-MM-DD"),
        tgl_kirim: moment(this.props.poReport.data[i].tglkirim).format(
          "yyyy-MM-DD"
        ),
        lokasi: this.props.poReport.data[i].lokasi,
        kd_kasir: this.props.poReport.data[i].kd_kasir,
        nama_supplier: this.props.poReport.data[i].nama_supplier,
        alamat_supplier: this.props.poReport.data[i].alamat_supplier,
        telp_supplier: this.props.poReport.data[i].telp_supplier,
        catatan: this.props.poReport.data[i].catatan,
      },
    });
  }

  HandleChangeSort(sr) {
    this.setState({
      sort: sr.value,
    });
    localStorage.setItem("sort_po_report", sr.value);
  }
  HandleChangeFilter(fl) {
    this.setState({
      filter: fl.value,
    });
    localStorage.setItem("filter_po_report", fl.value);
  }
  HandleChangeStatus(st) {
    this.setState({
      status: st.value,
    });
    localStorage.setItem("status_po_report", st.value);
  }

  toggleModal(e, total, perpage) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.setState({ isModalExport: true });

    // let range = total*perpage;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formPoExcel"));
    this.props.dispatch(fetchPoReportExcel(1, this.state.where_data, total));
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
    } = this.props.poReport;
    return (
      <Layout page="Laporan Purchase Order">
        <div className="row" style={{ zoom: "90%" }}>
          <div className="col-md-11" style={{ zoom: "90%" }}>
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
                  <label className="control-label font-12">Status</label>
                  <Select
                    options={this.state.status_data}
                    // placeholder="Pilih Tipe Kas"
                    onChange={this.HandleChangeStatus}
                    value={this.state.status_data.find((op) => {
                      return op.value === this.state.status;
                    })}
                  />
                </div>
              </div>
              <div className="col-6 col-xs-6 col-md-2">
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
              <div className="col-6 col-xs-6 col-md-2">
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
              <div className="col-6 col-xs-6 col-md-2">
                <div className="form-group">
                  <label>Cari</label>
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

          <div className="col-md-1 text-right" style={{ zoom: "90%" }}>
            <button
              style={{ marginTop: "28px", marginRight: "5px" }}
              className="btn btn-primary"
              onClick={this.handleSearch}
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
              <i className="fa fa-print"></i>
            </button>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="table table-hover table-bordered">
            <thead className="bg-light">
              <tr>
                <th className="text-black" style={columnStyle}>
                  #
                </th>
                <th className="text-black" style={columnStyle}>
                  No. PO
                </th>
                <th className="text-black" style={columnStyle}>
                  Tanggal
                </th>
                <th className="text-black" style={columnStyle}>
                  Tanggal Kirim
                </th>
                <th className="text-black" style={columnStyle}>
                  Nama Supplier
                </th>
                <th className="text-black" style={columnStyle}>
                  Lokasi
                </th>
                <th className="text-black" style={columnStyle}>
                  Jenis
                </th>
                <th className="text-black" style={columnStyle}>
                  Operator
                </th>
                <th className="text-black" style={columnStyle}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {typeof data === "object" ? (
                data.map((v, i) => {
                  return (
                    <tr key={i}>
                      <td style={columnStyle}>
                        {/* Example split danger button */}
                        <div className="btn-group">
                          <UncontrolledButtonDropdown>
                            <DropdownToggle caret>Aksi</DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem
                                onClick={(e) => this.toggle(e, v.no_po, i)}
                              >
                                Detail
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledButtonDropdown>
                        </div>
                      </td>
                      <td style={columnStyle}>{v.no_po}</td>
                      <td style={columnStyle}>
                        {moment(v.tgl_po).format("YYYY-MM-DD")}
                      </td>
                      <td style={columnStyle}>
                        {moment(v.tglkirim).format("YYYY-MM-DD")}
                      </td>
                      <td style={columnStyle}>{v.nama_supplier}</td>
                      <td style={columnStyle}>{v.lokasi}</td>
                      <td style={columnStyle}>{v.jenis}</td>
                      <td style={columnStyle}>{v.kd_kasir}</td>
                      <td style={columnStyle}>
                        {v.status === "0"
                          ? statusQ("warning", "Processing")
                          : statusQ("success", "Ordered")}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td>No data.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: "20px", float: "right" }}>
          <Paginationq
            current_page={current_page}
            per_page={per_page}
            total={last_page * per_page}
            callback={this.handlePageChange.bind(this)}
          />
        </div>
        {this.state.isModalDetail ? (
          <DetailPoReport
            master={this.state.master}
            poReportDetail={this.props.dataReportDetail}
          />
        ) : null}

        {this.state.isModalExport ? (
          <PoReportExcel
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
    poReport: state.poReducer.data,
    poReportExcel: state.poReducer.report_excel,
    dataReportDetail: state.poReducer.dataReportDetail,
    isLoading: state.poReducer.isLoading,
    isLoadingDetail: state.poReducer.isLoadingDetail,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(PoReport);
