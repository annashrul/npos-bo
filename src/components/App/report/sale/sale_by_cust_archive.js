import React, { Component } from "react";
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import { FetchReportSaleByCust } from "redux/actions/sale/sale_by_cust.action";
import SaleByCustReportExcel from "components/App/modals/report/sale/form_sale_by_cust_excel";
import { FetchReportDetailSaleByCust, FetchReportSaleByCustExcel } from "redux/actions/sale/sale_by_cust.action";
import DetailSaleByCustReport from "../../modals/report/sale/detail_sale_by_cust_report";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import { dateRange, getStorage, handleDataSelect, isEmptyOrUndefined, isProgress, setStorage, toDate } from "../../../../helper";
import SelectCommon from "../../common/SelectCommon";
import SelectSortCommon from "../../common/SelectSortCommon";
import TableCommon from "../../common/TableCommon";

const dateFromStorage = "dateFromReportSaleByCust";
const dateToStorage = "dateToReportSaleByCust";
const columnStorage = "columnReportSaleByCust";
const sortStorage = "sortReportSaleByCust";
const anyStorage = "anyReportSaleByCust";

class SaleByCustArchive extends Component {
  constructor(props) {
    super(props);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleDetail = this.handleDetail.bind(this);
    this.state = {
      where_data: "",
      any: "",
      sort: "",
      column: "",
      isModalDetail: false,
      isModalExport: false,
      startDate: toDate(new Date()),
      endDate: toDate(new Date()),
      column_data: [
        { kode: "kd_cust", value: "Kode Cust." },
        { kode: "nama", value: "Nama" },
        { kode: "qty", value: "QTY" },
        { kode: "gross_sales", value: "Gross Sales" },
        { kode: "diskon_item", value: "Diskon Item" },
        { kode: "diskon_trx", value: "Diskon Trx" },
        { kode: "tax", value: "Tax" },
        { kode: "service", value: "Service" },
      ],
    };
  }

  componentWillUnmount() {
    this.setState({ isModalDetail: false, isModalExport: false });
  }

  componentWillMount() {
    this.handleService(1);
  }

  handlePageChange(pageNumber) {
    this.handleService(pageNumber);
  }

  handleDetail(e, kode) {
    e.preventDefault();
    this.setState({ isModalDetail: true });
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("detailSaleByCustReport"));
    this.props.dispatch(FetchReportDetailSaleByCust(kode));
  }

  toggleModal(e, total) {
    e.preventDefault();
    this.setState({ isModalExport: true });
    this.props.dispatch(ModalType("formSaleByCustExcel"));
    this.props.dispatch(FetchReportSaleByCustExcel(1, this.state.where_data, total));
  }

  handleChangeSelect(state, res) {
    if (state === "column") setStorage(columnStorage, res.value);
    if (state === "sort") setStorage(sortStorage, res.value);
    setTimeout(() => this.handleService(), 300);
  }

  handleService(page = 1) {
    let getDateFrom = getStorage(dateFromStorage);
    let getDateTo = getStorage(dateToStorage);
    let getColumn = getStorage(columnStorage);
    let getSort = getStorage(sortStorage);
    let getAny = getStorage(anyStorage);

    let where = `page=${page}`;
    let state = {};

    if (isEmptyOrUndefined(getDateFrom) && isEmptyOrUndefined(getDateTo)) {
      where += `&datefrom=${toDate(getDateFrom, "-")}&dateto=${toDate(getDateTo, "-")}`;
      Object.assign(state, { startDate: getDateFrom, endDate: getDateTo });
    } else {
      where += `&datefrom=${toDate(this.state.startDate, "-")}&dateto=${toDate(this.state.endDate, "-")}`;
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

    this.props.dispatch(FetchReportSaleByCust(where));
  }
  handleSearch(e) {
    e.preventDefault();
    setStorage(anyStorage, this.state.any);
    this.handleService();
  }

  render() {
    const { total, last_page, per_page, current_page, data } = this.props.sale_by_custReport;
    const { startDate, endDate, column, sort, column_data, any, isModalDetail, isModalExport } = this.state;
    return (
      <Layout page="Laporan Arsip Penjualan">
        <div className="row">
          <div className="col-6 col-xs-6 col-md-2">
            {dateRange((first, last) => {
              setStorage(dateFromStorage, first);
              setStorage(dateToStorage, last);
              setTimeout(() => this.handleService(), 300);
            }, `${toDate(startDate)} - ${toDate(endDate)}`)}
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
                  {isProgress(this.props.download)}
                </button>
              </span>
            </div>
          </div>
        </div>
        <TableCommon
          head={[
            { label: "No", className: "text-center", width: "1%" },
            { label: "Kode Customer", width: "5%" },
            { label: "Nama" },
            { label: "Gross sales", width: "1%" },
            { label: "Diskon item", width: "1%" },
            { label: "Diskon trx", width: "1%" },
            { label: "Service", width: "1%" },
            { label: "Qty", width: "1%" },
          ]}
          meta={{ total: total, current_page: current_page, per_page: per_page }}
          body={typeof data === "object" && data}
          label={[
            { label: "kd_cust" },
            { label: "nama" },
            { label: "gross_sales", isCurrency: true, className: "text-right" },
            { label: "diskon_item", isCurrency: true, className: "text-right" },
            { label: "diskon_trx", isCurrency: true, className: "text-right" },
            { label: "service", isCurrency: true, className: "text-right" },
            { label: "qty", isCurrency: true, className: "text-right" },
          ]}
          current_page={current_page}
          callbackPage={this.handlePageChange.bind(this)}
        />
        {this.props.isOpen && isModalExport ? <SaleByCustReportExcel startDate={startDate} endDate={endDate} /> : null}
        {this.props.isOpen && isModalDetail ? <DetailSaleByCustReport detailSaleByCust={this.props.detailSaleByCust} /> : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    sale_by_custReport: state.sale_by_custReducer.report,
    download: state.sale_by_custReducer.download,
    sale_by_custReportExcel: state.sale_by_custReducer.report_excel,
    totalPenjualanExcel: state.sale_by_custReducer.total_penjualan_excel,
    detailSaleByCust: state.sale_by_custReducer.dataDetail,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(SaleByCustArchive);
