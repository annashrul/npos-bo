import React, { Component } from "react";
import Layout from "components/App/Layout";
import { FetchDn, FetchDnExcel, FetchDnDetail } from "redux/actions/inventory/dn.action";
import connect from "react-redux/es/connect/connect";
import DetailDn from "components/App/modals/report/inventory/dn_report/detail_dn";
import DnReportExcel from "components/App/modals/report/inventory/dn_report/form_dn_excel";
import { dateRange, generateNo, getStorage, handleDataSelect, isEmptyOrUndefined, isProgress, noData, rmSpaceToStrip, setStorage, toDate } from "../../../../../helper";
import { statusDeliveryNote, STATUS_DELIVERY_NOTE } from "../../../../../helperStatus";
import LokasiCommon from "../../../common/LokasiCommon";
import SelectCommon from "../../../common/SelectCommon";
import SelectSortCommon from "../../../common/SelectSortCommon";
import TableCommon from "../../../common/TableCommon";
import ButtonActionCommon from "../../../common/ButtonActionCommon";

const dateFromStorage = "dateFromReportDeliveryNote";
const dateToStorage = "dateToReportDeliveryNote";
const statusStorage = "statusReportDeliveryNote";
const locationStorage = "locationReportDeliveryNote";
const columnStorage = "columnReportDeliveryNote";
const sortStorage = "sortReportDeliveryNote";
const anyStorage = "anyReportDeliveryNote";
const activeDateRangePickerStorage = "activeDateRangeReportDeliveryNote";

class DnReport extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.state = {
      where_data: "",
      any: "",
      location: "",
      startDate: toDate(new Date()),
      endDate: toDate(new Date()),
      sort: "",
      column: "",
      column_data: [
        { value: "no_delivery_note", label: "No DN" },
        { value: "tanggal", label: "Tanggal" },
        { value: "status", label: "Status" },
      ],
      status: "",
      isModalDetail: false,
      isModalExport: false,
    };
  }

  componentWillUnmount() {
    this.setState({ isModalDetail: false, isModalExport: false });
  }

  componentDidMount() {
    this.handleService();
  }
  componentWillMount() {
    this.handleService();
  }
  handlePageChange(pageNumber) {
    this.handleService(pageNumber);
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
    let state = { bukaHarga: false };

    if (isEmptyOrUndefined(getDateFrom) && isEmptyOrUndefined(getDateTo)) {
      where += `&datefrom=${getDateFrom}&dateto=${getDateTo}`;
      Object.assign(state, { startDate: getDateFrom, endDate: getDateTo });
    } else {
      where += `&datefrom=${this.state.startDate}&dateto=${this.state.endDate}`;
    }
    if (isEmptyOrUndefined(getLocation)) {
      where += `&lokasi=${getLocation}`;
      Object.assign(state, { location: getLocation, bukaHarga: true });
    }

    if (isEmptyOrUndefined(getStatus)) {
      where += `&status=${getStatus}`;
      Object.assign(state, { status: getStatus });
    }
    if (isEmptyOrUndefined(getColumn)) {
      where += `&sort=${getColumn}`;
      Object.assign(state, { column: getColumn });
      if (isEmptyOrUndefined(getSort)) {
        where += `|${getSort}`;
        Object.assign(state, { sort: getSort });
      }
    }
    if (isEmptyOrUndefined(getAny)) {
      where += `&q=${getAny}`;
      Object.assign(state, { any: getAny });
    }
    Object.assign(state, { where_data: where });
    this.setState(state);
    this.props.dispatch(FetchDn(where));
  }
  handleSelect(state, res) {
    if (state === "location") setStorage(locationStorage, res.value);
    if (state === "status") setStorage(statusStorage, res.value);
    if (state === "column") setStorage(columnStorage, res.value);
    if (state === "sort") setStorage(sortStorage, res.value);
    this.setState({ [state]: res.value });
    this.handleService();
  }
  handleModal(param, obj) {
    let state = {};
    if (param === "excel") {
      Object.assign(state, { isModalExport: true });
      this.props.dispatch(FetchDnExcel(1, this.state.where_data, obj.total));
    } else {
      Object.assign(obj, { where: this.state.where_data });
      Object.assign(state, { isModalDetail: true, detail: obj });
      this.props.dispatch(FetchDnDetail(obj.no_delivery_note));
    }
    this.setState(state);
  }
  handleSearch(e) {
    e.preventDefault();
    setStorage(anyStorage, this.state.any);
    this.handleService(1);
  }

  render() {
    const columnStyle = {
      verticalAlign: "middle",
      textAlign: "center",
      whiteSpace: "nowrap",
    };
    const { per_page, last_page, current_page, data, total } = this.props.dnReport;
    const { startDate, endDate, location, status, column, column_data, sort, any, isModalExport, isModalDetail } = this.state;
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
      <Layout page="Laporan Dn">
        <div className="row">
          <div className="col-6 col-xs-6 col-md-3">
            {dateRange(
              (first, last, isActive) => {
                setStorage(activeDateRangePickerStorage, isActive);
                setStorage(dateFromStorage, first);
                setStorage(dateToStorage, last);
                this.handleService();
              },
              `${toDate(startDate)} - ${toDate(endDate)}`,
              getStorage(activeDateRangePickerStorage)
            )}
          </div>

          <div className="col-6 col-xs-6 col-md-3">
            <LokasiCommon callback={(res) => this.handleSelect("location", res)} dataEdit={location} isAll={true} />
          </div>

          <div className="col-6 col-xs-6 col-md-3">
            <SelectCommon label="Filter stock" options={handleDataSelect(STATUS_DELIVERY_NOTE, "value", "label")} callback={(res) => this.handleSelect("status", res)} dataEdit={status} />
          </div>
          <div className="col-6 col-xs-6 col-md-3">
            <SelectCommon label="Kolom" options={column_data} callback={(res) => this.handleSelect("column", res)} dataEdit={column} />
          </div>
          <div className="col-6 col-xs-6 col-md-3">
            <SelectSortCommon callback={(res) => this.handleSelect("sort", res)} dataEdit={sort} />
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
          rowSpan={[{ label: "Delivery note" }, { label: "Beli" }, { label: "Asal" }, { label: "Tujuan" }]}
          meta={{ total: total, current_page: current_page, per_page: per_page }}
          current_page={current_page}
          callbackPage={this.handlePageChange.bind(this)}
          renderRow={
            typeof data === "object"
              ? data.length > 0
                ? data.map((v, i) => {
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center"> {generateNo(i, current_page)}</td>
                        <td className="middle nowrap text-center">
                          <ButtonActionCommon
                            action={[{ label: "Detail" }, { label: "3ply" }]}
                            callback={(e) => {
                              if (e === 0) this.handleModal("detail", v);
                              if (e === 1) this.props.history.push(`../dn3ply/${v.no_delivery_note}`);
                            }}
                          />
                        </td>
                        <td className="middle nowrap">{v.no_delivery_note}</td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.no_faktur_beli)}</td>
                        <td className="middle nowrap">{v.kd_lokasi_1}</td>
                        <td className="middle nowrap">{v.kd_lokasi_2}</td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.keterangan)}</td>
                        <td className="middle nowrap">{statusDeliveryNote(v.status, true)}</td>
                        <td className="middle nowrap">{toDate(v.tanggal)}</td>
                      </tr>
                    );
                  })
                : noData(head.length)
              : noData(head.length)
          }
        />

        {this.props.isOpen && isModalDetail ? <DetailDn dnDetail={this.props.dnDetail} /> : null}

        {this.props.isOpen && isModalExport ? <DnReportExcel startDate={startDate} endDate={endDate} /> : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    download: state.dnReducer.download,
    dnReport: state.dnReducer.report,
    auth: state.auth,
    dnDetail: state.dnReducer.dn_detail,
    dnReportExcel: state.dnReducer.report_excel,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(DnReport);
