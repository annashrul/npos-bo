import React, { Component } from "react";
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import Select from "react-select";
import Paginationq from "helper";
import Preloader from "Preloader";
import { rangeDate, toRp } from "helper";
import { FetchReportSaleByCust } from "redux/actions/sale/sale_by_cust.action";
import Swal from "sweetalert2";
import SaleByCustReportExcel from "components/App/modals/report/sale/form_sale_by_cust_excel";
import {
  deleteReportSaleByCust,
  FetchReportDetailSaleByCust,
  FetchReportSaleByCustExcel,
} from "redux/actions/sale/sale_by_cust.action";
import DetailSaleByCustReport from "../../modals/report/sale/detail_sale_by_cust_report";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import {
  dateRange,
  generateNo,
  handleDataSelect,
  isEmptyOrUndefined,
  swallOption,
} from "../../../../helper";
import SelectCommon from "../../common/SelectCommon";
import SelectSortCommon from "../../common/SelectSortCommon";

class SaleByCustArchive extends Component {
  constructor(props) {
    super(props);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDetail = this.handleDetail.bind(this);
    this.state = {
      where_data: "",
      type: "",
      location: "",
      any: "",
      sort: "",
      filter: "",
      isModalDetail: false,
      isModalExport: false,
      startDate: moment(new Date()).format("yyyy-MM-DD"),
      endDate: moment(new Date()).format("yyyy-MM-DD"),
      type_data: [
        { kode: "", value: "Semua Tipe" },
        { kode: "0", value: "Tunai" },
        { kode: "1", value: "Non Tunai" },
        { kode: "2", value: "Gabungan" },
        { kode: "3", value: "Void" },
      ],
      filter_data: [
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
  handleDelete(e, id) {
    e.preventDefault();
    swallOption("anda yakin akan menghapus data ini ?", () => {
      this.props.dispatch(deleteReportSaleByCust(id));
    });
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
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formSaleByCustExcel"));
    this.props.dispatch(
      FetchReportSaleByCustExcel(1, this.state.where_data, total)
    );
  }

  handleChangeSelect(state, val) {
    this.setState({ [state]: val.value });
    setTimeout(() => this.handleService(), 300);
  }

  handleService(page = 1) {
    const { startDate, endDate, filter, sort, any } = this.state;
    let where = `page=${page}&datefrom=${startDate}&dateto=${endDate}`;
    if (isEmptyOrUndefined(sort) && isEmptyOrUndefined(filter))
      where += `&sort=${filter}|${sort}`;
    if (isEmptyOrUndefined(any)) where += `&q=${any}`;
    this.setState({ where_data: where });
    this.props.dispatch(FetchReportSaleByCust(where));
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
    } = this.props.sale_by_custReport;

    return (
      <Layout page="Laporan Arsip Penjualan">
        <div className="row" style={{ zoom: "90%" }}>
          <div className="col-6 col-xs-6 col-md-2">
            {dateRange((first, last) => {
              this.setState({ startDate: first, endDate: last });
              setTimeout(() => this.handleService(), 300);
            }, `${this.state.startDate} to ${this.state.endDate}`)}
          </div>
          <div className="col-6 col-xs-6 col-md-2">
            <SelectCommon
              label="Kolom"
              options={handleDataSelect(
                this.state.filter_data,
                "kode",
                "value"
              )}
              callback={(res) => this.handleChangeSelect("filter", res)}
            />
          </div>
          <div className="col-6 col-xs-6 col-md-2">
            <SelectSortCommon
              callback={(res) => this.handleChangeSelect("sort", res)}
            />
          </div>
          <div className="col-6 col-xs-6 col-md-5">
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
                    this.handleService();
                  }
                }}
              />
              <span className="input-group-append">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    this.handleService();
                  }}
                >
                  <i className="fa fa-search" />
                </button>
              </span>
            </div>
          </div>
          <div className="col-md-1">
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
                    <th className="text-black middle nowrap">Kd Cust</th>
                    <th className="text-black middle nowrap">Nama</th>
                    <th className="text-black middle nowrap">Gross Sales</th>
                    <th className="text-black middle nowrap">Diskon Item</th>
                    <th className="text-black middle nowrap">Diskon Trx</th>
                    <th className="text-black middle nowrap">Service</th>
                    <th className="text-black middle nowrap">Qty</th>
                  </tr>
                </thead>
                {!this.props.isLoadingReport ? (
                  <tbody>
                    {typeof data === "object" ? (
                      data.length > 0 ? (
                        data.map((v, i) => {
                          return (
                            <tr key={i}>
                              <td className="text-center middle nowrap">
                                {generateNo(i, current_page)}
                              </td>

                              <td className="middle nowrap">{v.kd_cust}</td>
                              <td className="middle nowrap">{v.nama}</td>
                              <td className="middle nowrap text-right">
                                {toRp(parseInt(v.gross_sales, 10))}
                              </td>
                              <td className="middle nowrap text-right">
                                {toRp(parseInt(v.diskon_item, 10))}
                              </td>
                              <td className="middle nowrap text-right">
                                {toRp(parseInt(v.diskon_trx, 10))}
                              </td>
                              <td className="middle nowrap text-right">
                                {toRp(v.service)}
                              </td>
                              <td className="middle nowrap text-right">
                                {v.qty}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={8}>No Data</td>
                        </tr>
                      )
                    ) : (
                      <tr>
                        <td colSpan={8}>No Data</td>
                      </tr>
                    )}
                  </tbody>
                ) : (
                  <Preloader />
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
        {this.state.isModalExport ? (
          <SaleByCustReportExcel
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            location={this.state.location}
          />
        ) : null}
        {this.state.isModalDetail ? (
          <DetailSaleByCustReport
            detailSaleByCust={this.props.detailSaleByCust}
          />
        ) : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    sale_by_custReport: state.sale_by_custReducer.report,
    // totalPenjualan:state.sale_by_custReducer.total_penjualan,
    sale_by_custReportExcel: state.sale_by_custReducer.report_excel,
    totalPenjualanExcel: state.sale_by_custReducer.total_penjualan_excel,
    isLoadingReport: state.sale_by_custReducer.isLoadingReport,
    detailSaleByCust: state.sale_by_custReducer.dataDetail,
    isLoadingDetail: state.sale_by_custReducer.isLoadingDetail,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(SaleByCustArchive);
