import React, { Component } from "react";
import Layout from "components/App/Layout";
import Paginationq from "helper";
import {
  FetchSaleReturReport,
  FetchSaleReturReportExcel,
} from "redux/actions/sale/sale.action";
import connect from "react-redux/es/connect/connect";
import SaleReturReportExcel from "components/App/modals/report/sale/form_sale_retur_excel";
import moment from "moment";
import {
  dateRange,
  generateNo,
  handleDataSelect,
  isEmptyOrUndefined,
  setStorage,
  getStorage,
  noData,
  isProgress,
} from "../../../../helper";
import LokasiCommon from "../../common/LokasiCommon";
import SelectCommon from "../../common/SelectCommon";
import SelectSortCommon from "../../common/SelectSortCommon";
import ExportCommon from "../../common/ExportCommon";

const dateFromStorage = "dateFromReportSaleReturArchive";
const dateToStorage = "dateToReportSaleReturArchive";
const locationStorage = "locationReportSaleReturArchive";
const columnStorage = "columnReportSaleReturArchive";
const sortStorage = "sortReportSaleReturArchive";
const anyStorage = "anyReportSaleReturArchive";

class SaleReturReport extends Component {
  constructor(props) {
    super(props);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.state = {
      where_data: "",
      any: "",
      location: "",
      startDate: moment(new Date()).format("yyyy-MM-DD"),
      endDate: moment(new Date()).format("yyyy-MM-DD"),
      sort: "",
      isModalReport: false,
      where_data: "",
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
    this.props.dispatch(
      FetchSaleReturReportExcel(1, this.state.where_data, total)
    );
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
    if (isEmptyOrUndefined(getColumn) && isEmptyOrUndefined(getSort)) {
      where += `&sort${getColumn}|${getSort}`;
      Object.assign(state, { column: getColumn, sort: getSort });
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
    const {
      per_page,
      last_page,
      current_page,
      // from,
      // to,
      data,
      // total
    } = this.props.sale_returReport;

    return (
      <Layout page="Laporan SaleRetur">
        <div className="row" style={{ zoom: "90%" }}>
          <div className="col-6 col-xs-6 col-md-2">
            {dateRange((first, last) => {
              setStorage(dateFromStorage, first);
              setStorage(dateToStorage, last);
              setTimeout(() => this.handleService(), 300);
            }, `${this.state.startDate} to ${this.state.endDate}`)}
          </div>

          <div className="col-6 col-xs-6 col-md-2">
            <LokasiCommon
              callback={(res) => this.handleChangeSelect("location", res)}
              isAll={true}
            />
          </div>

          <div className="col-6 col-xs-6 col-md-2">
            <SelectCommon
              label="Kolom"
              options={handleDataSelect(
                this.state.column_data,
                "kode",
                "value"
              )}
              callback={(res) => this.handleChangeSelect("column", res)}
            />
          </div>
          <div className="col-6 col-xs-6 col-md-2">
            <SelectSortCommon
              callback={(res) => this.handleChangeSelect("sort", res)}
            />
          </div>
          <div className="col-12 col-xs-12 col-md-3">
            <label>Cari</label>
            <div className="input-group">
              <input
                type="search"
                name="any"
                className="form-control"
                placeholder="tulis sesuatu disini"
                value={this.state.any}
                onChange={(e) => {
                  this.setState({ any: e.target.value });
                  setStorage(anyStorage, e.target.value);
                }}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    this.handleSearch(event);
                  }
                }}
              />
              <span className="input-group-append">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={(e) => {
                    this.handleSearch(e);
                  }}
                >
                  <i className="fa fa-search" />
                </button>
              </span>
            </div>
          </div>
          <div className="col-12 col-xs-12 col-md-1">
            <div className="form-group text-right">
              <button
                style={{ marginTop: "28px" }}
                className="btn btn-primary"
                onClick={(e) =>
                  this.toggleModal(e, last_page * per_page, per_page)
                }
              >
                {isProgress(this.props.percent)}
              </button>
            </div>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="table table-hover table-noborder">
            <thead className="bg-light">
              <tr>
                <th className="text-black text-center middle nowrap" width="1%">
                  No
                </th>
                <th className="text-black middle nowrap" width="5%">
                  Kode Trx
                </th>
                <th className="text-black middle nowrap">Nama</th>
                <th className="text-black middle nowrap" width="1%">
                  Nilai Retur
                </th>
                <th className="text-black middle nowrap" width="1%">
                  Diskon Item
                </th>
                <th className="text-black middle nowrap" width="1%">
                  Tanggal
                </th>
              </tr>
            </thead>
            {
              <tbody>
                {typeof data === "object"
                  ? data.length > 0
                    ? data.map((v, i) => {
                        return (
                          <tr key={i}>
                            <td className="text-center middle nowrap">
                              {generateNo(i, current_page)}
                            </td>
                            <td className="middle nowrap">{v.kd_trx}</td>
                            <td className="middle nowrap">{v.nama}</td>
                            <td className="middle nowrap text-right">
                              {v.nilai_retur}
                            </td>
                            <td className="middle nowrap text-right">
                              {v.diskon_item}
                            </td>
                            <td className="middle nowrap">
                              {moment(v.tgl).format("DD-MM-YYYY")}
                            </td>
                          </tr>
                        );
                      })
                    : noData(6)
                  : noData(6)}
              </tbody>
            }
          </table>
        </div>
        <div style={{ marginTop: "20px", float: "right" }}>
          <Paginationq
            current_page={current_page}
            per_page={per_page}
            total={parseInt(per_page * last_page, 10)}
            callback={this.handlePageChange.bind(this)}
          />
        </div>
        {/* <ExportCommon
          modalType="formSaleReturExcel"
          isPdf={true}
          callbackPdf={() => {}}
          isExcel={true}
          callbackExcel={() => {}}
        /> */}
        {/* <DetailSaleRetur sale_returDetail={this.props.sale_returDetail}/> */}
        {this.props.isOpen && this.state.isModalReport ? (
          <SaleReturReportExcel
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
