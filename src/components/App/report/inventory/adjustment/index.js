import React, { Component } from "react";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import { deleteAdjustment, FetchAdjustment, FetchAdjustmentDetail } from "redux/actions/adjustment/adjustment.action";
import DetailAdjustment from "components/App/modals/report/inventory/adjustment_report/detail_adjustment_report";
import { HEADERS } from "redux/actions/_constants";
import { FetchAdjustmentExcel } from "redux/actions/adjustment/adjustment.action";
import AdjustmentReportExcel from "components/App/modals/report/inventory/adjustment_report/form_adjustment_excel";
import { dateRange, getStorage, isEmptyOrUndefined, isProgress, setStorage, toDate } from "../../../../../helper";
import LokasiCommon from "../../../common/LokasiCommon";
import SelectCommon from "../../../common/SelectCommon";
import SelectSortCommon from "../../../common/SelectSortCommon";
import TableCommon from "../../../common/TableCommon";

const dateFromStorage = "dateFromReportAdjusment";
const dateToStorage = "dateToReportAdjusment";
const locationStorage = "locationReportAdjusment";
const columnStorage = "columnReportAdjusment";
const sortStorage = "sortReportAdjusment";
const anyStorage = "anyReportAdjusment";
const activeDateRangePickerStorage = "activeDateReportAdjusment";

class AdjustmentReport extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.state = {
      where_data: "",
      any: "",
      location: "",
      startDate: toDate(new Date()),
      endDate: toDate(new Date()),
      sort: "",
      column: "",
      column_data: [
        { value: "kd_trx", label: "Kode Trx" },
        { value: "tgl", label: "Tanggal" },
        { value: "username", label: "Username" },
      ],
      isModalExcel: false,
      isModalDetail: false,
    };
  }
  handleService(page = 1) {
    let getDateFrom = getStorage(dateFromStorage);
    let getDateTo = getStorage(dateToStorage);
    let getLocation = getStorage(locationStorage);
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
      Object.assign(state, { location: getLocation, bukaHarga: true });
    }

    if (isEmptyOrUndefined(getColumn) && isEmptyOrUndefined(getSort)) {
      where += `&sort=${getColumn}|${getSort}`;
      Object.assign(state, { column: getColumn, sort: getSort });
    }

    if (isEmptyOrUndefined(getAny)) {
      where += `&q=${getAny}`;
      Object.assign(state, { any: getAny });
    }
    Object.assign(state, { where_data: where });
    this.setState(state);
    this.props.dispatch(FetchAdjustment(where));
  }
  handleSelect(state, res) {
    if (state === "location") setStorage(locationStorage, res.value);
    if (state === "column") setStorage(columnStorage, res.value);
    if (state === "sort") setStorage(sortStorage, res.value);
    this.setState({ [state]: res.value });
    setTimeout(() => this.handleService(), 500);
  }

  componentWillUnmount() {
    this.setState({ isModalExcel: false, isModalDetail: false });
  }

  componentWillMount() {
    this.handleService();
  }
  componentDidMount() {
    this.handleService();
  }

  handlePageChange(pageNumber) {
    this.handleService(pageNumber);
  }
  handleSearch(e) {
    e.preventDefault();
    setStorage(anyStorage, this.state.any);
    this.handleService(1);
  }
  handleModal(type, obj) {
    if (type === "excel") {
      this.setState({ isModalExcel: true });
      this.props.dispatch(FetchAdjustmentExcel(1, this.state.where_data, obj.total));
      return;
    }
    if (type === "detail") {
      this.setState({ isModalDetail: true });
      this.props.dispatch(FetchAdjustmentDetail(obj.kd_trx, "page=1"));
      return;
    }
  }

  handleDelete(obj) {
    Object.assign(obj, { where: this.state.where_data });
    this.props.dispatch(deleteAdjustment(obj));
  }

  render() {
    const { total, last_page, per_page, current_page, data } = this.props.adjustmentReport;
    const { startDate, endDate, location, column, column_data, sort, any, isModalExcel, isModalDetail } = this.state;

    return (
      <Layout page="Laporan Adjusment">
        <div className="row">
          <div className="col-6 col-xs-6 col-md-2">
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
          <div className="col-6 col-xs-6 col-md-2">
            <LokasiCommon callback={(res) => this.handleSelect("location", res)} dataEdit={location} isAll={true} />
          </div>
          <div className="col-6 col-xs-6 col-md-2">
            <SelectCommon label="Kolom" options={column_data} dataEdit={column} callback={(res) => this.handleSelect("column", res)} />
          </div>
          <div className="col-6 col-xs-6 col-md-2">
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
          head={[
            { label: "No", className: "text-center", width: "1%" },
            { label: "#", className: "text-center", width: "1%" },
            { label: "Kode Adjusment", width: "1%" },
            { label: "Operator", width: "1%" },
            { label: "Lokasi", width: "1%" },
            { label: "Tanggal", width: "1%" },
            { label: "Keterangan" },
          ]}
          meta={{ total: total, current_page: current_page, per_page: per_page }}
          current_page={current_page}
          callbackPage={this.handlePageChange.bind(this)}
          body={typeof data === "object" && data}
          label={[{ label: "kd_trx" }, { label: "username" }, { label: "lokasi" }, { label: "tgl", date: true }, { label: "keterangan" }]}
          action={[{ label: "Detail" }, { label: "Nota" }, { label: "3ply" }, { label: "Hapus" }]}
          callback={(e, index) => {
            if (e === 0) this.handleModal("detail", data[index]);
            if (e === 1) this.props.history.push(`${HEADERS.URL}reports/adjust/${data[index].kd_trx}.pdf`);
            if (e === 2) this.props.history.push(`../adjust3ply/${data[index].kd_trx}`);
            if (e === 3) this.handleDelete(data[index]);
          }}
        />
        {this.props.isOpen && isModalExcel ? <AdjustmentReportExcel startDate={startDate} endDate={endDate} location={location} /> : null}
        {this.props.isOpen && isModalDetail ? <DetailAdjustment detail={this.props.adjustmentDetailSatuan} /> : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    adjustmentReport: state.adjustmentReducer.data,
    adjustmentReportExcel: state.adjustmentReducer.dataExcel,
    total: state.adjustmentReducer.total,
    download: state.adjustmentReducer.download,
    auth: state.auth,
    adjustmentDetailSatuan: state.adjustmentReducer.dataDetailTransaksi,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};

export default connect(mapStateToProps)(AdjustmentReport);
