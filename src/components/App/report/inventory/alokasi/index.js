import React, { Component } from "react";
import Layout from "components/App/Layout";
import Paginationq from "helper";
import { FetchAlokasi, FetchAlokasiExcel, FetchAlokasiDetail } from "redux/actions/inventory/alokasi.action";
import { rePrintFaktur } from "redux/actions/inventory/mutation.action";
import connect from "react-redux/es/connect/connect";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import DetailAlokasi from "components/App/modals/report/inventory/alokasi_report/detail_alokasi";
import AlokasiReportExcel from "components/App/modals/report/inventory/alokasi_report/form_alokasi_excel";
import FormAlokasi from "components/App/modals/inventory/alokasi/form_alokasi";
import Select from "react-select";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { rangeDate } from "helper";
import { statusQ } from "helper";
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
import { Link } from "react-router-dom";
import { dateRange, generateNo, getStorage, isEmptyOrUndefined, isProgress, noData, rmSpaceToStrip, setStorage, toDate } from "../../../../../helper";
import LokasiCommon from "../../../common/LokasiCommon";
import SelectCommon from "../../../common/SelectCommon";
import SelectSortCommon from "../../../common/SelectSortCommon";
import TableCommon from "../../../common/TableCommon";
import ButtonActionCommon from "../../../common/ButtonActionCommon";

const dateFromStorage = "dateFromReportAlokasi";
const dateToStorage = "dateToReportAlokasi";
const locationStorage = "locationReportAlokasi";
const statusStorage = "statusReportAlokasi";
const columnStorage = "columnReportAlokasi";
const sortStorage = "sortReportAlokasi";
const anyStorage = "anyReportAlokasi";
const activeDateRangePickerStorage = "activeDateReportAlokasi";

class AlokasiReport extends Component {
  constructor(props) {
    super(props);
    this.handleModal = this.handleModal.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleRePrint = this.handleRePrint.bind(this);
    this.state = {
      where_data: "",
      any: "",
      location: "",
      startDate: moment(new Date()).format("yyyy-MM-DD"),
      endDate: moment(new Date()).format("yyyy-MM-DD"),
      status: "",
      status_data: [
        { value: "", label: "Semua" },
        { value: "3", label: "Diterima" },
        { value: "2", label: "Dikirim" },
        { value: "1", label: "Packing" },
        { value: "0", label: "Proses" },
      ],
      sort: "",
      sort_data: [],
      column: "",
      column_data: [
        { value: "no_faktur_mutasi", label: "Faktur Mutasi" },
        { value: "tgl_mutasi", label: "Tanggal Mutasi" },
        { value: "status", label: "Status" },
      ],
      isModalDetail: false,
      isModalExcel: false,
    };
  }
  componentWillUnmount() {
    this.setState({
      isModalDetail: false,
      isModalExcel: false,
    });
  }

  componentWillMount() {
    this.handleService();
  }
  componentDidMount() {
    this.handleService();
  }
  handleService(page = 1) {
    let getDateFrom = getStorage(dateFromStorage);
    let getDateTo = getStorage(dateToStorage);
    let getLocation = getStorage(locationStorage);
    let getStatus = getStorage(statusStorage);
    let getColumn = getStorage(columnStorage);
    let getSort = getStorage(sortStorage);
    let getAny = getStorage(anyStorage);

    let where = `page=${page}`;
    let state = {};

    if (isEmptyOrUndefined(getDateFrom) && isEmptyOrUndefined(getDateTo)) {
      where += `&datefrom=${getDateFrom}&dateto=${getDateTo}`;
      Object.assign(state, { startDate: getDateFrom, endDate: getDateTo });
    } else {
      where += `&datefrom=${this.state.startDate}&dateto=${this.state.endDate}`;
    }
    if (isEmptyOrUndefined(getLocation)) {
      where += `&lokasi=${getLocation}`;
      Object.assign(state, { location: getLocation });
    }
    if (isEmptyOrUndefined(getStatus)) {
      where += `&status=${getStatus}`;
      Object.assign(state, { status: getStatus });
    }

    if (isEmptyOrUndefined(getColumn)) {
      where += `&sort=${getColumn}`;
      Object.assign(state, { column: getColumn });
      if (isEmptyOrUndefined(getSort)) {
        where += `&sort=${getColumn}|${getSort}`;
        Object.assign(state, { sort: getSort });
      }
    }

    if (isEmptyOrUndefined(getAny)) {
      where += `&q=${getAny}`;
      Object.assign(state, { any: getAny });
    }
    Object.assign(state, { where_data: where });
    this.setState(state);
    this.props.dispatch(FetchAlokasi(where));
  }

  handlePageChange(page) {
    this.handleService(page);
  }

  handleSearch(e) {
    e.preventDefault();
    setStorage(anyStorage, this.state.any);
    this.handleService();
  }

  handleModal(type, obj) {
    let setState = {};
    if (type === "excel") {
      Object.assign(setState, { isModalExcel: true });
      this.props.dispatch(FetchAlokasiExcel(1, this.state.where_data, obj.total));
    } else if (type === "detail") {
      Object.assign(setState, { isModalDetail: true });
      this.props.dispatch(FetchAlokasiDetail(obj.no_faktur_mutasi, this.state.where_data));
    }
    this.setState(setState);
  }

  handleRePrint(e, id) {
    e.preventDefault();
    this.props.dispatch(rePrintFaktur(id));
  }

  handleSelect(state, res) {
    if (state === "location") setStorage(locationStorage, res.value);
    if (state === "status") setStorage(statusStorage, res.value);
    if (state === "column") setStorage(columnStorage, res.value);
    if (state === "sort") setStorage(sortStorage, res.value);
    this.setState({ [state]: res.value });
    setTimeout(() => this.handleService(), 500);
  }

  render() {
    const { per_page, last_page, current_page, data, total } = this.props.alokasiReport;
    const { startDate, endDate, location, status, status_data, column, column_data, sort, any, isModalExcel, isModalDetail } = this.state;
    const head = [
      { rowSpan: 2, label: "No", className: "text-center", width: "1%" },
      { rowSpan: 2, label: "#", className: "text-center", width: "1%" },
      { colSpan: 2, label: "No faktur", width: "1%" },
      { colSpan: 2, label: "Lokasi", width: "1%" },
      { rowSpan: 2, label: "Keterangan" },
      { rowSpan: 2, label: "Status", width: "1%" },
      { rowSpan: 2, label: "Tanggal", width: "1%" },
    ];
    return (
      <Layout page="Laporan Alokasi">
        <div className="row">
          <div className="col-6 col-xs-6 col-md-3">
            {dateRange(
              (first, last, isActive) => {
                setStorage(activeDateRangePickerStorage, isActive);
                setStorage(dateFromStorage, first);
                setStorage(dateToStorage, last);
                setTimeout(() => this.handleService(), 300);
              },
              `${toDate(startDate)} - ${toDate(endDate)}`,
              getStorage(activeDateRangePickerStorage)
            )}
          </div>
          <div className="col-6 col-xs-6 col-md-3">
            <LokasiCommon callback={(res) => this.handleSelect("location", res)} dataEdit={location} isAll={true} />
          </div>
          <div className="col-6 col-xs-6 col-md-3">
            <SelectCommon label="Status" options={status_data} dataEdit={status} callback={(res) => this.handleSelect("status", res)} />
          </div>
          <div className="col-6 col-xs-6 col-md-3">
            <SelectCommon label="Kolom" options={column_data} dataEdit={column} callback={(res) => this.handleSelect("column", res)} />
          </div>
          <div className="col-6 col-xs-6 col-md-3">
            <SelectSortCommon dataEdit={sort} callback={(res) => this.handleSelect("sort", res)} />
          </div>
          <div className="col-6 col-xs-6 col-md-3">
            <label>Cari</label>
            <div className="input-group">
              <input
                type="search"
                name="any"
                className="form-control"
                placeholder="tulis sesuatu disini"
                value={any}
                onChange={(e) => this.setState({ any: e.target.value })}
                onKeyPress={(e) => {
                  if (e.key === "Enter") this.handleSearch(e);
                }}
              />
              <span className="input-group-append">
                <button type="button" className="btn btn-primary" onClick={this.handleSearch}>
                  <i className="fa fa-search" />
                </button>
                <button
                  className="btn btn-primary ml-1"
                  onClick={(e) => {
                    this.handleModal("excel", {
                      total: last_page * per_page,
                    });
                  }}
                >
                  {isProgress(this.props.download)}
                </button>
              </span>
            </div>
          </div>
        </div>

        <TableCommon
          head={head}
          rowSpan={[{ label: "Mutasi" }, { label: "Beli" }, { label: "Asal" }, { label: "Tujuan" }]}
          meta={{ total: total, current_page: current_page, per_page: per_page }}
          current_page={current_page}
          callbackPage={this.handlePageChange.bind(this)}
          renderRow={
            typeof data === "object"
              ? data.length > 0
                ? data.map((v, i) => {
                    let action = [{ label: "Detail" }];
                    if (v.status === "0") {
                      action.push({ label: "Edit" });
                    }
                    action.push({ label: "3ply" }, { label: "Print nota" });
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center"> {generateNo(i, current_page)}</td>
                        <td className="middle nowrap text-center">
                          <ButtonActionCommon
                            action={action}
                            callback={(e) => {
                              if (e === 0) this.handleModal("detail", v);
                              if (e === 1) this.props.history.push(`../edit/alokasi/${btoa(v.no_faktur_mutasi)}`);
                              if (e === 2) this.props.history.push(`../alokasi3ply/${v.no_faktur_mutasi}`);
                              if (e === 3) this.handleRePrint(e, v.no_faktur_mutasi);
                            }}
                          />
                        </td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.no_faktur_mutasi)}</td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.no_faktur_beli)}</td>
                        <td className="middle nowrap">{v.lokasi_asal}</td>
                        <td className="middle nowrap">{v.lokasi_tujuan}</td>

                        <td className="middle nowrap">{rmSpaceToStrip(v.keterangan)}</td>
                        <td className="middle nowrap">
                          {v.status === "0"
                            ? statusQ("primary", "proses")
                            : v.status === "1"
                            ? statusQ("warning", "packing")
                            : v.status === "2"
                            ? statusQ("info", "dikirim")
                            : v.status === "3"
                            ? statusQ("success", "diterima")
                            : ""}
                        </td>
                        <td className="middle nowrap">{toDate(v.tgl_mutasi)}</td>
                      </tr>
                    );
                  })
                : noData(head.length)
              : noData(head.length)
          }
        />

        {this.props.isOpen && isModalDetail ? <DetailAlokasi alokasiDetail={this.props.alokasiDetail} /> : null}
        {this.props.isOpen && isModalExcel ? <AlokasiReportExcel startDate={startDate} endDate={endDate} /> : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    alokasiReport: state.alokasiReducer.data,
    download: state.alokasiReducer.download,
    auth: state.auth,
    alokasiDetail: state.alokasiReducer.alokasi_data,
    alokasiReportExcel: state.alokasiReducer.report_excel,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(AlokasiReport);
