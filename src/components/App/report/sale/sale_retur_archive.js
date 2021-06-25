import React, { Component } from "react";
import Layout from "components/App/Layout";
import Paginationq from "helper";
import {
  FetchSaleReturReport,
  FetchSaleReturReportExcel,
} from "redux/actions/sale/sale.action";
import connect from "react-redux/es/connect/connect";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import SaleReturReportExcel from "components/App/modals/report/sale/form_sale_retur_excel";
import moment from "moment";
import {
  dateRange,
  generateNo,
  handleDataSelect,
  isEmptyOrUndefined,
} from "../../../../helper";
import LokasiCommon from "../../common/LokasiCommon";
import SelectCommon from "../../common/SelectCommon";
import SelectSortCommon from "../../common/SelectSortCommon";

class SaleReturReport extends Component {
  constructor(props) {
    super(props);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.state = {
      where_data: "",
      any: "",
      location: "",
      startDate: moment(new Date()).format("yyyy-MM-DD"),
      endDate: moment(new Date()).format("yyyy-MM-DD"),
      sort: "",
      isModalReport: false,
      where_data: "",
      filter: "",
      filter_data: [
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
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formSaleReturExcel"));
    this.props.dispatch(
      FetchSaleReturReportExcel(1, this.state.where_data, total)
    );
  }
  handleChangeSelect(state, val) {
    this.setState({ [state]: val.value });
    setTimeout(() => this.handleService(), 300);
  }

  handleService(page = 1) {
    const { startDate, endDate, location, filter, sort, any } = this.state;
    let where = `page=${page}&datefrom=${startDate}&dateto=${endDate}`;
    if (isEmptyOrUndefined(location)) where += `&lokasi=${location}`;
    if (isEmptyOrUndefined(sort) && isEmptyOrUndefined(filter))
      where += `&sort=${filter}|${sort}`;
    if (isEmptyOrUndefined(any)) where += `&q=${any}`;
    this.setState({ where_data: where });
    this.props.dispatch(FetchSaleReturReport(where));
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
              this.setState({ startDate: first, endDate: last });
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
          <div className="col-12 col-xs-12 col-md-3">
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
          <div className="col-12 col-xs-12 col-md-1">
            <div className="form-group text-right">
              <button
                style={{ marginTop: "28px" }}
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
                {typeof data === "object" ? (
                  data.length > 0 ? (
                    data.map((v, i) => {
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
                  ) : (
                    <tr>
                      <td colSpan={6}>No Data</td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td colSpan={6}>No Data</td>
                  </tr>
                )}
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
  };
};
export default connect(mapStateToProps)(SaleReturReport);
