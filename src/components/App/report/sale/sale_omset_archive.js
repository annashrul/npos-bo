import React, { Component } from "react";
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import moment from "moment";
import Paginationq from "helper";
import { toRp } from "helper";
import {
  FetchReportSaleOmset,
  FetchReportSaleOmsetExcel,
} from "redux/actions/sale/sale_omset.action";
import SaleOmsetReportExcel from "../../modals/report/sale/form_sale_omset_excel";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import {
  dateRange,
  generateNo,
  getStorage,
  handleDataSelect,
  isEmptyOrUndefined,
  noData,
  rmStorage,
  setStorage,
} from "../../../../helper";
import SelectCommon from "../../common/SelectCommon";

const dateFromStorage = "dateFromReportSaleOmset";
const dateToStorage = "dateToReportSaleOmset";
const sortStorage = "sortReportSaleOmset";
const anyStorage = "anyReportSaleOmset";

class SaleOmsetArchive extends Component {
  constructor(props) {
    super(props);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.state = {
      where_data: "",
      any: "",
      sort: "",
      startDate: moment(new Date()).format("yyyy-MM-DD"),
      endDate: moment(new Date()).format("yyyy-MM-DD"),
      sort_data: [
        {
          value: "qty|DESC",
          label: "Qty Terbesar",
        },
        {
          value: "qty|ASC",
          label: "Qty Terkecil",
        },
        {
          value: "gross_sales|DESC",
          label: "Gross Sales Terbesar",
        },
        {
          value: "gross_sales|ASC",
          label: "Gross Sales Terkecil",
        },
        {
          value: "diskon_item|DESC",
          label: "Diskon Item Terbesar",
        },
        {
          value: "diskon_item|ASC",
          label: "Diskon Item Terkecil",
        },
      ],
      export: false,
    };
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

  toggleModal(e, total) {
    e.preventDefault();
    this.setState({ export: true });

    this.props.dispatch(
      FetchReportSaleOmsetExcel(1, this.state.where_data, total)
    );
  }

  handleChangeSelect(state, val) {
    setStorage(sortStorage, val.value);
    this.setState({ [state]: val.value });
    setTimeout(() => this.handleService(), 300);
  }

  handleService(page = 1) {
    const { startDate, endDate, sort, any } = this.state;
    let dateFrom = getStorage(dateFromStorage);
    let dateTo = getStorage(dateToStorage);
    let sortBy = getStorage(sortStorage);
    let q = getStorage(anyStorage);
    let where = `page=${page}&datefrom=${startDate}&dateto=${endDate}`;
    let setState = {};

    if (isEmptyOrUndefined(dateFrom) && isEmptyOrUndefined(dateTo)) {
      where = `page=${page}&datefrom=${dateFrom}&dateto=${dateTo}`;
      Object.assign(setState, { startDate: dateFrom, endDate: dateTo });
    }
    if (isEmptyOrUndefined(sortBy)) {
      where += `&sort=${sortBy}`;
      Object.assign(setState, { sort: sortBy });
    }
    if (isEmptyOrUndefined(q)) {
      where += `&q=${q}`;
      Object.assign(setState, { any: q });
    }
    Object.assign(setState, { where_data: where });
    this.setState(setState);
    this.props.dispatch(FetchReportSaleOmset(where));
  }
  handleSearch(e) {
    setStorage(anyStorage, e.target.value);
    this.handleService();
  }

  render() {
    const {
      // total,
      last_page,
      per_page,
      current_page,
      // from,
      // to,
      data,
      total_data,
    } = this.props.data;

    let tot_qty = 0;
    let tot_gross_sales = 0;
    let tot_net_sales = 0;
    let tot_grand_total = 0;
    let tot_diskon_item = 0;
    let tot_diskon_trx = 0;
    let tot_tax = 0;
    let tot_service = 0;

    return (
      <Layout page="Laporan Arsip Penjualan">
        <div className="row" style={{ zoom: "90%" }}>
          <div className="col-md-10">
            <div className="row">
              <div className="col-6 col-xs-6 col-md-3">
                {dateRange((first, last) => {
                  setStorage(dateFromStorage, first);
                  setStorage(dateToStorage, last);
                  this.setState({ startDate: first, endDate: last });
                  setTimeout(() => this.handleService(), 300);
                }, `${this.state.startDate} to ${this.state.endDate}`)}
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <SelectCommon
                  label="Urutan"
                  options={handleDataSelect(
                    this.state.sort_data,
                    "value",
                    "label"
                  )}
                  callback={(res) => this.handleChangeSelect("sort", res)}
                  dataEdit={this.state.sort}
                />
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <label>Cari</label>
                <div className="input-group">
                  <input
                    type="search"
                    name="any"
                    className="form-control"
                    placeholder="tulis sesuatu disini"
                    value={this.state.any}
                    onChange={(e) => this.setState({ any: e.target.value })}
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
                        e.preventDefault();
                        this.handleSearch(e);
                      }}
                    >
                      <i className="fa fa-search" />
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="row">
              <div className="col-12 col-xs-12 col-md-12">
                <div className="form-group text-right">
                  <button
                    style={{ marginTop: "28px", marginRight: "5px" }}
                    className="btn btn-primary"
                    onClick={(e) =>
                      this.toggleModal(e, last_page * per_page, per_page)
                    }
                  >
                    <i className="fa fa-print" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div style={{ overflowX: "auto" }}>
              <table className="table table-hover table-noborder">
                <thead className="bg-light">
                  <tr>
                    <th
                      className="text-black text-center middle nowrap"
                      width="1%"
                    >
                      No
                    </th>
                    <th className="text-black middle nowrap">Tanggal</th>
                    <th className="text-black middle nowrap">QTY</th>
                    <th className="text-black middle nowrap">Gross Sale</th>
                    <th className="text-black middle nowrap">Net Sale</th>
                    <th className="text-black middle nowrap">Diskon Item</th>
                    <th className="text-black middle nowrap">Diskon Trx</th>
                    <th className="text-black middle nowrap">TAX</th>
                    <th className="text-black middle nowrap">Service</th>
                    <th className="text-black middle nowrap">Grand Total</th>
                  </tr>
                </thead>
                <tbody>
                  {typeof data === "object"
                    ? data.length > 0
                      ? data.map((v, i) => {
                          tot_qty = tot_qty + parseFloat(v.qty);
                          tot_gross_sales =
                            tot_gross_sales + parseFloat(v.gross_sales);
                          tot_net_sales =
                            tot_net_sales + parseFloat(v.net_sales);
                          tot_grand_total =
                            tot_grand_total + parseFloat(v.grand_total);
                          tot_diskon_item =
                            tot_diskon_item + parseFloat(v.diskon_item);
                          tot_diskon_trx =
                            tot_diskon_trx + parseFloat(v.diskon_trx);
                          tot_tax = tot_tax + parseFloat(v.tax);
                          tot_service = tot_service + parseFloat(v.service);
                          return (
                            <tr key={i}>
                              <td className="text-center middle nowrap">
                                {generateNo(i, current_page)}
                              </td>
                              <td className="middle nowrap">
                                {moment(v.tanggal).format("YYYY-MM-DD")}
                              </td>
                              <td className="middle nowrap text-right">
                                {parseFloat(v.qty).toFixed(2)}
                              </td>
                              <td className="middle nowrap text-right">
                                {toRp(parseFloat(v.gross_sales).toFixed(2))}
                              </td>
                              <td className="middle nowrap text-right">
                                {toRp(parseFloat(v.net_sales).toFixed(2))}
                              </td>
                              <td className="middle nowrap text-right">
                                {toRp(parseFloat(v.diskon_item).toFixed(2))}
                              </td>
                              <td className="middle nowrap text-right">
                                {toRp(parseFloat(v.diskon_trx).toFixed(2))}
                              </td>
                              <td className="middle nowrap text-right">
                                {toRp(parseFloat(v.tax).toFixed(2))}
                              </td>
                              <td className="middle nowrap text-right">
                                {toRp(parseFloat(v.service).toFixed(2))}
                              </td>
                              <td className="middle nowrap text-right">
                                {toRp(parseFloat(v.grand_total).toFixed(2))}
                              </td>
                            </tr>
                          );
                        })
                      : noData(10)
                    : noData(10)}
                </tbody>

                {total_data !== undefined && total_data.qty !== undefined ? (
                  <tfoot className="bg-light">
                    <tr>
                      <td className="middle nowrap" colSpan={2}>
                        {" "}
                        Total Perhalaman
                      </td>

                      <td className="middle nowrap text-right">
                        {parseFloat(tot_qty).toFixed(2)}
                      </td>
                      <td className="middle nowrap text-right">
                        {toRp(parseFloat(tot_gross_sales).toFixed(2))}
                      </td>
                      <td className="middle nowrap text-right">
                        {toRp(parseFloat(tot_net_sales).toFixed(2))}
                      </td>
                      <td className="middle nowrap text-right">
                        {toRp(parseFloat(tot_diskon_item).toFixed(2))}
                      </td>
                      <td className="middle nowrap text-right">
                        {toRp(parseFloat(tot_diskon_trx).toFixed(2))}
                      </td>
                      <td className="middle nowrap text-right">
                        {toRp(parseFloat(tot_tax).toFixed(2))}
                      </td>
                      <td className="middle nowrap text-right">
                        {toRp(parseFloat(tot_service).toFixed(2))}
                      </td>
                      <td className="middle nowrap text-right">
                        {toRp(parseFloat(tot_grand_total).toFixed(2))}
                      </td>
                    </tr>
                    <tr>
                      <td className="middle nowrap" colSpan={2}>
                        Total keseluruhan
                      </td>

                      <td className="middle nowrap text-right">
                        {parseFloat(total_data.qty).toFixed(2)}
                      </td>
                      <td className="middle nowrap text-right">
                        {toRp(parseFloat(total_data.gross_sales).toFixed(2))}
                      </td>
                      <td className="middle nowrap text-right">
                        {toRp(parseFloat(total_data.net_sales).toFixed(2))}
                      </td>
                      <td className="middle nowrap text-right">
                        {toRp(parseFloat(total_data.grand_total).toFixed(2))}
                      </td>
                      <td className="middle nowrap text-right">
                        {toRp(parseFloat(total_data.diskon_item).toFixed(2))}
                      </td>
                      <td className="middle nowrap text-right">
                        {toRp(parseFloat(total_data.diskon_trx).toFixed(2))}
                      </td>
                      <td className="middle nowrap text-right">
                        {toRp(parseFloat(total_data.tax).toFixed(2))}
                      </td>
                      <td className="middle nowrap text-right">
                        {toRp(parseFloat(total_data.service).toFixed(2))}
                      </td>
                    </tr>
                  </tfoot>
                ) : (
                  noData(10)
                )}
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
          </div>
        </div>
        {this.props.isOpen &&
        this.props.sale_omsetReportExcel.data !== undefined &&
        this.props.sale_omsetReportExcel.data.length > 0 ? (
          <SaleOmsetReportExcel
            startDate={this.state.startDate}
            endDate={this.state.endDate}
          />
        ) : (
          ""
        )}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.saleOmsetReducer.data,
    // totalPenjualan:state.saleOmsetReducer.total_penjualan,
    sale_omsetReportExcel: state.saleOmsetReducer.report_excel,
    totalPenjualanExcel: state.saleOmsetReducer.total_penjualan_excel,
    isLoadingReport: state.saleOmsetReducer.isLoadingReport,
    detailSaleByCust: state.saleOmsetReducer.dataDetail,
    isLoadingDetail: state.saleOmsetReducer.isLoadingDetail,
    auth: state.auth,
    isOpen: state.modalReducer,
  };
};

export default connect(mapStateToProps)(SaleOmsetArchive);
