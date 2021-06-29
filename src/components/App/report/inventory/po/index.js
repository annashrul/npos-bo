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
import {
  dateRange,
  generateNo,
  getStorage,
  isEmptyOrUndefined,
  isProgress,
  noData,
  setStorage,
  toDate,
} from "../../../../../helper";
import LokasiCommon from "../../../common/LokasiCommon";
import SelectCommon from "../../../common/SelectCommon";
import SelectSortCommon from "../../../common/SelectSortCommon";
import TableCommon from "../../../common/TableCommon";
import ButtonActionCommon from "../../../common/ButtonActionCommon";

const dateFromStorage = "dateFromReportPo";
const dateToStorage = "dateToReportPo";
const locationStorage = "locationReportPo";
const columnStorage = "columnReportPo";
const sortStorage = "sortReportPo";
const statusStorage = "statusReportPo";
const anyStorage = "anyReportPo";

class PoReport extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.state = {
      master: {},
      where_data: "",
      any: "",
      location: "",
      dateFrom: moment(new Date()).format("yyyy-MM-DD"),
      dateTo: moment(new Date()).format("yyyy-MM-DD"),
      sort: "",
      column: "",
      status: "",
      column_data: [
        { value: "no_po", label: "No. PO" },
        { value: "tgl_po", label: "Tanggal PO" },
        { value: "tglkirim", label: "Tanggal Kirim" },
        { value: "nama_supplier", label: "Nama Supplier" },
        { value: "status", label: "Status" },
        { value: "kode_supplier", label: "Kode Supplier" },
      ],
      status_data: [
        { value: "", label: "Semua" },
        { value: "0", label: "Proses" },
        { value: "1", label: "Order" },
        { value: "2", label: "Receive" },
      ],
      isModalDetail: false,
      isModalExport: false,
    };
  }

  handleService(page = 1) {
    let tglAwal = getStorage(dateFromStorage);
    let tglAkhir = getStorage(dateToStorage);
    let lokasi = getStorage(locationStorage);
    let kolom = getStorage(columnStorage);
    let urutan = getStorage(sortStorage);
    let stts = getStorage(statusStorage);
    let any = getStorage(anyStorage);
    let where = `page=${page}`;
    let state = {};

    if (isEmptyOrUndefined(tglAwal) && isEmptyOrUndefined(tglAkhir)) {
      where += `&datefrom=${tglAwal}&dateto=${tglAkhir}`;
      Object.assign(state, { dateFrom: tglAwal, dateTo: tglAkhir });
    } else {
      where += `&datefrom=${this.state.dateFrom}&dateto=${this.state.dateTo}`;
    }
    if (isEmptyOrUndefined(lokasi)) {
      where += `&lokasi=${lokasi}`;
      Object.assign(state, { location: lokasi });
    }
    if (isEmptyOrUndefined(kolom)) {
      if (isEmptyOrUndefined(urutan)) {
        where += `&sort=${kolom}|${urutan}`;
        Object.assign(state, { sort: urutan, column: kolom });
      }
    }
    if (isEmptyOrUndefined(stts)) {
      where += `&status=${stts}`;
      Object.assign(state, { status: stts });
    }
    if (isEmptyOrUndefined(any)) {
      where += `&q=${any}`;
      Object.assign(state, { any: any });
    }
    Object.assign(state, { where_data: where });
    this.setState(state);
    this.props.dispatch(fetchPoReport(where));
  }
  handleChangeSelect(state, res) {
    if (state === "location") setStorage(locationStorage, res.value);
    if (state === "column") setStorage(columnStorage, res.value);
    if (state === "sort") setStorage(sortStorage, res.value);
    if (state === "status") setStorage(statusStorage, res.value);
    this.setState({ [state]: res.value });
    setTimeout(() => this.handleService(1), 500);
  }

  componentWillUnmount() {
    this.setState({ isModalDetail: false, isModalExport: false });
  }
  componentWillMount() {
    this.handleService(1);
  }
  componentDidMount() {
    this.handleService(1);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handlePageChange(pageNumber) {
    this.handleService(pageNumber);
  }
  handleSearch(e) {
    e.preventDefault();
    setStorage(anyStorage, this.state.any);
    this.handleService(this.state.any, 1);
    // setTimeout(() => this.handleService(1), 300);
  }
  toggle(i) {
    this.props.dispatch(poReportDetail(1, this.props.poReport.data[i].no_po));
    this.setState({ isModalDetail: true, master: this.props.poReport.data[i] });
    this.props.dispatch(ModalType("poReportDetail"));
  }

  toggleModal(e, total) {
    e.preventDefault();
    this.props.dispatch(fetchPoReportExcel(1, this.state.where_data, total));
    this.setState({ isModalExport: true });
    this.props.dispatch(ModalType("formPoExcel"));
  }

  render() {
    const { total, last_page, per_page, current_page, data } =
      this.props.poReport;
    const {
      status_data,
      status,
      column,
      column_data,
      location,
      sort,
      any,
      dateFrom,
      dateTo,
      isModalDetail,
      isModalExport,
      master,
    } = this.state;

    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "#", className: "text-center", width: "1%" },
      { label: "No.Po", width: "1%" },
      { label: "Tanggal Po", width: "1%" },
      { label: "Tanggal kirim", width: "1%" },
      { label: "Nama Supplier" },
      { label: "Lokasi", width: "1%" },
      { label: "Jenis", width: "1%" },
      { label: "Operator" },
      { label: "Status", width: "1%" },
    ];

    return (
      <Layout page="Laporan Purchase Order">
        <div className="row">
          <div className="col-md-12">
            <div className="row">
              <div className="col-6 col-xs-6 col-md-3">
                {dateRange((first, last) => {
                  this.setState({ dateFrom: first, dateTo: last });
                  setStorage(dateFromStorage, first);
                  setStorage(dateToStorage, last);
                  setTimeout(() => this.handleService(1), 500);
                }, `${dateFrom} to ${dateTo}`)}
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <div className="form-group">
                  <LokasiCommon
                    isAll={true}
                    callback={(res) => this.handleChangeSelect("location", res)}
                    dataEdit={location}
                  />
                </div>
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <SelectCommon
                  label="Status"
                  options={status_data}
                  callback={(res) => this.handleChangeSelect("status", res)}
                  dataEdit={status}
                />
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <SelectCommon
                  label="Kolom"
                  options={column_data}
                  callback={(res) => this.handleChangeSelect("column", res)}
                  dataEdit={column}
                />
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <SelectSortCommon
                  callback={(res) => this.handleChangeSelect("sort", res)}
                  dataEdit={sort}
                />
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <div className="form-group">
                  <label>Cari</label>
                  <input
                    className="form-control"
                    type="text"
                    name="any"
                    value={any}
                    onChange={(e) => this.handleChange(e)}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <button
                  style={{ marginTop: "28px", marginRight: "5px" }}
                  className="btn btn-primary"
                  onClick={this.handleSearch}
                >
                  <i className="fa fa-search" />
                </button>

                <button
                  className="btn btn-primary"
                  type="button"
                  style={{ marginTop: "28px" }}
                  onClick={(e) => this.toggleModal(e, last_page * per_page)}
                >
                  {isProgress(this.props.isLoading)}
                </button>
              </div>
            </div>
          </div>
        </div>
        <TableCommon
          head={head}
          meta={{
            total: total,
            current_page: current_page,
            per_page: per_page,
          }}
          current_page={current_page}
          callbackPage={this.handlePageChange.bind(this)}
          renderRow={
            typeof data === "object"
              ? data.length > 0
                ? data.map((v, i) => {
                    let title, desc;
                    if (v.status === "0") {
                      title = "warning";
                      desc = "Proses";
                    }
                    if (v.status === "1") {
                      title = "info";
                      desc = "Order";
                    }
                    if (v.status === "2") {
                      title = "success";
                      desc = "Receive";
                    }
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">
                          {generateNo(i, current_page)}
                        </td>
                        <td className="middle nowrap text-center">
                          <ButtonActionCommon
                            action={[{ label: "Detail" }]}
                            callback={(e) => this.toggle(i)}
                          />
                        </td>
                        <td className="middle nowrap">{v.no_po}</td>
                        <td className="middle nowrap">{toDate(v.tgl_po)} </td>
                        <td className="middle nowrap">{toDate(v.tglkirim)} </td>
                        <td className="middle nowrap">{v.nama_supplier}</td>
                        <td className="middle nowrap">{v.lokasi}</td>
                        <td className="middle nowrap">{v.jenis}</td>
                        <td className="middle nowrap">{v.kd_kasir}</td>
                        <td className="middle nowrap">
                          {statusQ(title, desc)}
                        </td>
                      </tr>
                    );
                  })
                : noData(head.length)
              : noData(head.length)
          }
        />

        {this.props.isOpen && isModalDetail ? (
          <DetailPoReport
            master={master}
            poReportDetail={this.props.dataReportDetail}
          />
        ) : null}

        {this.props.isOpen && isModalExport ? (
          <PoReportExcel startDate={dateFrom} endDate={dateTo} />
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
