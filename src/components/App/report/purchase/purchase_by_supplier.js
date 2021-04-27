import React, { Component } from "react";
import Layout from "components/App/Layout";
import Paginationq from "helper";
import {
  FetchPurchaseBySupplierReport,
  FetchPurchaseBySupplierReportExcel,
} from "redux/actions/purchase/purchase_order/po.action";
import connect from "react-redux/es/connect/connect";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
// import DetailPurchaseBySupplier from "components/App/modals/report/inventory/purchase_by_supplier_report/detail_purchase_by_supplier";
import PurchaseBySupplierReportExcel from "components/App/modals/purchase/form_purchase_by_supplier_excel";
// import ApprovePurchaseBySupplier from "components/App/modals/report/inventory/purchase_by_supplier_report/approve_purchase_by_supplier";
import Select from "react-select";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import toCurrency, { rangeDate } from "helper";
import Preloader from "Preloader";
class PurchaseBySupplierReport extends Component {
  constructor(props) {
    super(props);
    this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.HandleChangeSort = this.HandleChangeSort.bind(this);
    this.HandleChangeFilter = this.HandleChangeFilter.bind(this);
    this.HandleChangeStatus = this.HandleChangeStatus.bind(this);
    this.state = {
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
      isModalExport: false,
    };
  }

  componentWillUnmount() {
    this.setState({ isModalExport: false });
  }
  componentWillMount() {
    this.props.dispatch(FetchPurchaseBySupplierReport(1));
    // let page = localStorage.page_purchase_by_supplier_report;
    // this.handleParameter(page !== undefined && page !== null ? page : 1);
  }
  componentDidMount() {
    if (
      localStorage.location_purchase_by_supplier_report !== undefined &&
      localStorage.location_purchase_by_supplier_report !== ""
    ) {
      this.setState({
        location: localStorage.location_purchase_by_supplier_report,
      });
    }
    if (
      localStorage.any_purchase_by_supplier_report !== undefined &&
      localStorage.any_purchase_by_supplier_report !== ""
    ) {
      this.setState({ any: localStorage.any_purchase_by_supplier_report });
    }
    if (
      localStorage.date_from_purchase_by_supplier_report !== undefined &&
      localStorage.date_from_purchase_by_supplier_report !== null
    ) {
      this.setState({
        startDate: localStorage.date_from_purchase_by_supplier_report,
      });
    }
    if (
      localStorage.date_to_purchase_by_supplier_report !== undefined &&
      localStorage.date_to_purchase_by_supplier_report !== null
    ) {
      this.setState({
        endDate: localStorage.date_to_purchase_by_supplier_report,
      });
    }
    if (
      localStorage.sort_purchase_by_supplier_report !== undefined &&
      localStorage.sort_purchase_by_supplier_report !== null
    ) {
      this.setState({ sort: localStorage.sort_purchase_by_supplier_report });
    }
    if (
      localStorage.filter_purchase_by_supplier_report !== undefined &&
      localStorage.filter_purchase_by_supplier_report !== null
    ) {
      this.setState({
        filter: localStorage.filter_purchase_by_supplier_report,
      });
    }
    if (
      localStorage.status_purchase_by_supplier_report !== undefined &&
      localStorage.status_purchase_by_supplier_report !== null
    ) {
      this.setState({
        status: localStorage.status_purchase_by_supplier_report,
      });
    }
  }
  handlePageChange(pageNumber) {
    localStorage.setItem("page_purchase_by_supplier_report", pageNumber);
    this.props.dispatch(FetchPurchaseBySupplierReport(pageNumber));
  }
  handleEvent = (event, picker) => {
    const awal = moment(picker.startDate._d).format("YYYY-MM-DD");
    const akhir = moment(picker.endDate._d).format("YYYY-MM-DD");
    localStorage.setItem("date_from_purchase_by_supplier_report", `${awal}`);
    localStorage.setItem("date_to_purchase_by_supplier_report", `${akhir}`);
    this.setState({
      startDate: awal,
      endDate: akhir,
    });
  };
  handleSearch(e) {
    e.preventDefault();
    localStorage.setItem("any_purchase_by_supplier_report", this.state.any);
    this.handleParameter(1);
  }
  handleParameter(pageNumber) {
    let dateFrom = localStorage.date_from_purchase_by_supplier_report;
    let dateTo = localStorage.date_to_purchase_by_supplier_report;
    let lokasi = localStorage.location_purchase_by_supplier_report;
    let any = localStorage.any_purchase_by_supplier_report;
    let sort = localStorage.sort_purchase_by_supplier_report;
    let filter = localStorage.filter_purchase_by_supplier_report;
    let status = localStorage.status_purchase_by_supplier_report;
    let where = "";
    if (dateFrom !== undefined && dateFrom !== null) {
      where += `&datefrom=${dateFrom}&dateto=${dateTo}`;
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
    localStorage.setItem("where_purchase_by_supplier_report", pageNumber);
    this.props.dispatch(FetchPurchaseBySupplierReport(pageNumber, where));
    // this.props.dispatch(FetchPurchaseBySupplierReportExcel(pageNumber,where))
  }
  componentWillReceiveProps = (nextProps) => {
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
      { kode: "kode", value: "Kode" },
      { kode: "nama", value: "Nama" },
      { kode: "total_pembelian", value: "Total Pembelian" },
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
      { kode: "1", value: "Approve" },
      { kode: "0", value: "Not Approve" },
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
    // localStorage.setItem('status_purchase_by_supplier_report',this.state.status===''||this.state.status===undefined?status[0].kode:localStorage.status_purchase_by_supplier_report)
    localStorage.setItem(
      "sort_purchase_by_supplier_report",
      this.state.sort === "" || this.state.sort === undefined
        ? sort[0].kode
        : localStorage.sort_purchase_by_supplier_report
    );
    localStorage.setItem(
      "filter_purchase_by_supplier_report",
      this.state.filter === "" || this.state.filter === undefined
        ? filter[0].kode
        : localStorage.filter_purchase_by_supplier_report
    );
  };
  HandleChangeLokasi(lk) {
    this.setState({
      location: lk.value,
    });
    localStorage.setItem("location_purchase_by_supplier_report", lk.value);
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  HandleChangeSort(sr) {
    this.setState({
      sort: sr.value,
    });
    localStorage.setItem("sort_purchase_by_supplier_report", sr.value);
  }
  HandleChangeFilter(fl) {
    this.setState({
      filter: fl.value,
    });
    localStorage.setItem("filter_purchase_by_supplier_report", fl.value);
  }
  HandleChangeStatus(st) {
    this.setState({
      status: st.value,
    });
    localStorage.setItem("status_purchase_by_supplier_report", st.value);
  }
  toggleModal(e, total, perpage) {
    e.preventDefault();
    this.setState({ isModalExport: true });
    const bool = !this.props.isOpen;
    // let range = total*perpage;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formPurchaseBySupplierExcel"));
    this.props.dispatch(
      FetchPurchaseBySupplierReportExcel(1, this.state.where_data, total)
    );
  }

  render() {
    const columnStyle = { verticalAlign: "middle", textAlign: "center" };
    const {
      per_page,
      last_page,
      current_page,
      // from,
      // to,
      data,
      // total
    } = this.props.purchase_by_supplierReport;

    return (
      <Layout page="Laporan PurchaseBySupplier">
        <div className="row">
          <div className="col-md-10">
            <div className="row">
              <div className="col-6 col-xs-6 col-md-3">
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
              <div className="col-6 col-xs-6 col-md-3">
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
              <div className="col-6 col-xs-6 col-md-3">
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
              <div className="col-6 col-xs-6 col-md-3">
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

          <div className="col-12 col-xs-21 col-md-2 text-right">
            <div className="form-group">
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
                  this.toggleModal(e, per_page * last_page, per_page)
                }
              >
                <i className="fa fa-print"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="table-responsive" style={{ overflowX: "auto" }}>
          <table className="table table-hover table-bordered">
            <thead className="bg-light">
              <tr>
                {/* <th className="text-black" style={columnStyle} rowSpan="2">#</th> */}
                <th className="text-black" style={columnStyle}>
                  No
                </th>
                <th className="text-black" style={columnStyle}>
                  Kode
                </th>
                <th className="text-black" style={columnStyle}>
                  Nama
                </th>
                <th className="text-black" style={columnStyle}>
                  Total Pembelian
                </th>
              </tr>
            </thead>
            <tbody>
              {typeof data === "object" ? (
                data.length > 0 ? (
                  data.map((v, i) => {
                    return (
                      <tr key={i}>
                        <td style={columnStyle}>
                          {i + 1 + 10 * (parseInt(current_page, 10) - 1)}
                        </td>
                        <td style={columnStyle}>{v.kode}</td>
                        <td style={columnStyle}>{v.nama}</td>
                        <td style={columnStyle}>{v.total_pembelian}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4}>No Data.</td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan={4}>No Data.</td>
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
        {this.state.isModalExport ? (
          <PurchaseBySupplierReportExcel
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
    purchase_by_supplierReport: state.poReducer.pbs_data,
    isLoadingDetail: state.poReducer.isLoadingDetail,
    auth: state.auth,
    isLoading: state.poReducer.isLoading,
    // purchase_by_supplierDetail:state.purchase_by_supplierReducer.report_data,
    purchase_by_supplierReportExcel: state.poReducer.pbs_data_excel,
    // isLoadingDetailSatuan: state.stockReportReducer.isLoadingDetailSatuan,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(PurchaseBySupplierReport);
