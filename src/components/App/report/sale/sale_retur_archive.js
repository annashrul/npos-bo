import React, { Component } from "react";
import Layout from "components/App/Layout";
import { FetchSaleReturReport, FetchSaleReturReportExcel } from "redux/actions/sale/sale.action";
import connect from "react-redux/es/connect/connect";
import SaleReturReportExcel from "components/App/modals/report/sale/form_sale_retur_excel";
import { dateRange, handleDataSelect, isEmptyOrUndefined, setStorage, getStorage, isProgress, toDate } from "../../../../helper";
import LokasiCommon from "../../common/LokasiCommon";
import SelectCommon from "../../common/SelectCommon";
import SelectSortCommon from "../../common/SelectSortCommon";
import TableCommon from "../../common/TableCommon";

const dateFromStorage = "dateFromReportSaleReturArchive";
const dateToStorage = "dateToReportSaleReturArchive";
const locationStorage = "locationReportSaleReturArchive";
const columnStorage = "columnReportSaleReturArchive";
const sortStorage = "sortReportSaleReturArchive";
const anyStorage = "anyReportSaleReturArchive";
const activeDateRangePickerStorage = "activeDateRangeReportSaleReturArchive";

class SaleReturReport extends Component {
  constructor(props) {
    super(props);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.state = {
      where_data: "",
      any: "",
      location: "",
      startDate: toDate(new Date()),
      endDate: toDate(new Date()),
      sort: "",
      isModalReport: false,
      column: "",
      column_data: [
        { kode: "kd_trx", value: "Kode Trx" },
        { kode: "tgl", value: "Tanggal" },
        { kode: "nama", value: "Nama" },
        { kode: "nilai_retur", value: "Nilai Retur" },
        { kode: "diskon_item", value: "Diskon Item" },
      ],
    };
  }

  componentWillUnmount() {
    this.setState({ isModalReport: false });
  }
  componentWillMount() {
    this.handleService(1);
  }

  handlePageChange(pageNumber) {
    this.handleService(pageNumber);
  }

  toggleModal(e, total) {
    e.preventDefault();
    this.setState({ isModalReport: true });
    this.props.dispatch(FetchSaleReturReportExcel(1, this.state.where_data, total));
  }
  handleChangeSelect(state, res) {
    if (state === "location") setStorage(locationStorage, res.value);
    if (state === "column") setStorage(columnStorage, res.value);
    if (state === "sort") setStorage(sortStorage, res.value);
    setTimeout(() => this.handleService(), 300);
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
      Object.assign(state, { lokasi: getLocation });
    }
    if (isEmptyOrUndefined(getColumn)) {
      where += `&sort${getColumn}`;
      Object.assign(state, { column: getColumn });
      if (isEmptyOrUndefined(getSort)) {
        where += `&sort${getColumn}|${getSort}`;
        Object.assign(state, { sort: getSort });
      }
    }

    if (isEmptyOrUndefined(getAny)) {
      where += `&q=${getAny}`;
      Object.assign(state, { any: getAny });
    }
    Object.assign(state, { where_data: where });
    this.setState(state);
    this.props.dispatch(FetchSaleReturReport(where));
  }

  handleSearch(e) {
    e.preventDefault();
    this.handleService();
  }

  render() {
    const { per_page, last_page, current_page, total, data } = this.props.sale_returReport;
    const { startDate, endDate, location, column, sort, column_data, any, isModalReport } = this.state;

    return (
      <Layout page="Laporan SaleRetur">
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
            <LokasiCommon callback={(res) => this.handleChangeSelect("location", res)} isAll={true} dataEdit={location} />
          </div>

          <div className="col-6 col-xs-6 col-md-2">
            <SelectCommon label="Kolom" options={handleDataSelect(column_data, "kode", "value")} callback={(res) => this.handleChangeSelect("column", res)} dataEdit={column} />
          </div>
          <div className="col-6 col-xs-6 col-md-2">
            <SelectSortCommon callback={(res) => this.handleChangeSelect("sort", res)} dataEdit={sort} />
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
                <button className="btn btn-primary ml-1" onClick={(e) => this.toggleModal(e, last_page * per_page, per_page)}>
                  {isProgress(this.props.percent)}
                </button>
              </span>
            </div>
          </div>
        </div>
        <TableCommon
          head={[
            { label: "No", className: "text-center", width: "1%" },
            { label: "Kode", width: "5%" },
            { label: "Nama" },
            { label: "Nilai retur", width: "1%" },
            { label: "Diskon item", width: "1%" },
            { label: "Tanggal", width: "1%" },
          ]}
          meta={{ total: total, current_page: current_page, per_page: per_page }}
          body={typeof data === "object" && data}
          label={[{ label: "kd_trx" }, { label: "nama" }, { label: "nilai_retur" }, { label: "diskon_item" }, { label: "tgl", date: true }]}
          current_page={current_page}
          callbackPage={this.handlePageChange.bind(this)}
        />
        {this.props.isOpen && isModalReport ? <SaleReturReportExcel startDate={startDate} endDate={endDate} /> : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    sale_returReport: state.saleReducer.sale_retur_data,
    isLoadingDetail: state.saleReducer.isLoadingDetail,
    auth: state.auth,
    isLoading: state.saleReducer.isLoading,
    sale_returReportExcel: state.saleReducer.sale_retur_export,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    percent: state.saleReducer.percent,
  };
};
export default connect(mapStateToProps)(SaleReturReport);
