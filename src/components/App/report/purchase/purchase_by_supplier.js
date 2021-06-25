import React, { Component } from "react";
import Layout from "components/App/Layout";
import Paginationq from "helper";
import {
  FetchPurchaseBySupplierReport,
  FetchPurchaseBySupplierReportExcel,
} from "redux/actions/purchase/purchase_order/po.action";
import connect from "react-redux/es/connect/connect";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import PurchaseBySupplierReportExcel from "components/App/modals/purchase/form_purchase_by_supplier_excel";
import moment from "moment";
import {
  dateRange,
  generateNo,
  getStorage,
  isEmptyOrUndefined,
  noData,
  setStorage,
  toRp,
} from "../../../../helper";
import SelectSortCommon from "../../common/SelectSortCommon";
import SelectCommon from "../../common/SelectCommon";

const dateFromStorage = "dateFromReportPoBySupplier";
const dateToStorage = "dateToReportPoBySupplier";
const columnStorage = "columnReportPoBySupplier";
const sortStorage = "sortReportPoBySupplier";
const anyStorage = "anyReportPoBySupplier";

class PurchaseBySupplierReport extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.state = {
      where_data: "",
      any: "",
      dateFrom: moment(new Date()).format("yyyy-MM-DD"),
      dateTo: moment(new Date()).format("yyyy-MM-DD"),
      sort: "",
      column: "",
      column_data: [
        { value: "kode", label: "Kode" },
        { value: "nama", label: "Nama" },
        { value: "total_pembelian", label: "Total Pembelian" },
      ],
      isModalExport: false,
    };
  }
  handleService(page = 1) {
    let tglAwal = getStorage(dateFromStorage);
    let tglAkhir = getStorage(dateToStorage);
    let kolom = getStorage(columnStorage);
    let urutan = getStorage(sortStorage);
    let any = getStorage(anyStorage);
    let where = `page=${page}`;
    let state = {};
    if (isEmptyOrUndefined(tglAwal) && isEmptyOrUndefined(tglAkhir)) {
      where = `page=${page}&datefrom=${tglAwal}&dateto=${tglAkhir}`;
      Object.assign(state, { dateFrom: tglAwal, dateTo: tglAkhir });
    } else {
      where = `page=${page}&datefrom=${this.state.dateFrom}&dateto=${this.state.dateTo}`;
    }
    if (isEmptyOrUndefined(kolom)) {
      if (isEmptyOrUndefined(urutan)) {
        where += `&sort=${kolom}|${urutan}`;
        Object.assign(state, { sort: urutan, column: kolom });
      }
    }
    if (isEmptyOrUndefined(any)) {
      where += `&q=${any}`;
      Object.assign(state, { any: any });
    }
    Object.assign(state, { where_data: where });
    this.setState(state);
    this.props.dispatch(FetchPurchaseBySupplierReport(where));
  }
  handleChangeSelect(state, res) {
    if (state === "column") setStorage(columnStorage, res.value);
    if (state === "sort") setStorage(sortStorage, res.value);
    setTimeout(() => this.handleService(1), 500);
  }

  componentWillUnmount() {
    this.setState({ isModalExport: false });
  }
  componentWillMount() {
    this.handleService(1);
  }
  componentDidMount() {
    this.handleService(1);
  }
  handlePageChange(pageNumber) {
    this.handleService(pageNumber);
  }

  handleSearch(e) {
    e.preventDefault();
    setStorage(anyStorage, this.state.any);
    setTimeout(() => this.handleService(1), 500);
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  toggleModal(e, total, perpage) {
    e.preventDefault();
    this.setState({ isModalExport: true });
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formPurchaseBySupplierExcel"));
    this.props.dispatch(
      FetchPurchaseBySupplierReportExcel(1, this.state.where_data, total)
    );
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
    } = this.props.purchase_by_supplierReport;
    let total = 0;
    return (
      <Layout page="Laporan PurchaseBySupplier">
        <div style={{ zoom: "90%" }}>
          <form onSubmit={this.handleSearch} noValidate>
            <div className="row">
              <div className="col-md-11">
                <div className="row">
                  <div className="col-6 col-xs-6 col-md-3">
                    {dateRange((first, last) => {
                      setStorage(dateFromStorage, first);
                      setStorage(dateToStorage, last);
                      setTimeout(() => this.handleService(1), 500);
                    }, `${this.state.dateFrom} to ${this.state.dateTo}`)}
                  </div>
                  <div className="col-6 col-xs-6 col-md-3">
                    <SelectCommon
                      label="Kolom"
                      options={this.state.column_data}
                      callback={(res) => this.handleChangeSelect("column", res)}
                      dataEdit={this.state.column}
                    />
                  </div>
                  <div className="col-6 col-xs-6 col-md-3">
                    <SelectSortCommon
                      callback={(res) => this.handleChangeSelect("sort", res)}
                      dataEdit={this.state.sort}
                    />
                  </div>
                  <div className="col-6 col-xs-6 col-md-3">
                    <div className="form-group">
                      <label>Cari</label>
                      <input
                        className="form-control"
                        type="text"
                        name="any"
                        value={this.state.any}
                        onChange={(e) => this.handleChange(e)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-xs-12 col-md-1 text-right">
                <div className="form-group">
                  <button
                    style={{ marginTop: "28px", marginRight: "5px" }}
                    className="btn btn-primary"
                    onClick={this.handleSearch}
                  >
                    <i className="fa fa-search" />
                  </button>
                  <button
                    style={{ marginTop: "28px" }}
                    className="btn btn-primary"
                    onClick={(e) =>
                      this.toggleModal(e, per_page * last_page, per_page)
                    }
                  >
                    <i className="fa fa-print"></i>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="table table-hover table-noborder">
            <thead className="bg-light">
              <tr>
                <th className="text-black text-center middle nowrap" width="1%">
                  No
                </th>
                <th className="text-black middle nowrap">Kode</th>
                <th className="text-black middle nowrap">Nama</th>
                <th className="text-black middle nowrap" width="5%">
                  Total Pembelian
                </th>
              </tr>
            </thead>
            <tbody>
              {typeof data === "object"
                ? data.length > 0
                  ? data.map((v, i) => {
                      total = total + parseInt(v.total_pembelian);
                      return (
                        <tr key={i}>
                          <td className="text-center middle nowrap">
                            {generateNo(i, current_page)}
                          </td>
                          <td className="middle nowrap">{v.kode}</td>
                          <td className="middle nowrap">{v.nama}</td>
                          <td className="text-right middle nowrap">
                            {toRp(v.total_pembelian)}
                          </td>
                        </tr>
                      );
                    })
                  : noData(4)
                : noData(4)}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}>Total perhalaman</td>
                <td className="middle nowrap text-right">{toRp(total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div style={{ marginTop: "20px", float: "right" }}>
          <Paginationq
            current_page={current_page}
            per_page={per_page}
            total={last_page * per_page}
            callback={this.handlePageChange.bind(this)}
          />
        </div>
        {this.state.isModalExport ? (
          <PurchaseBySupplierReportExcel
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
    purchase_by_supplierReport: state.poReducer.pbs_data,
    isLoadingDetail: state.poReducer.isLoadingDetail,
    auth: state.auth,
    isLoading: state.poReducer.isLoading,
    // purchase_by_supplierDetail:state.purchase_by_supplierReducer.report_data,
    purchase_by_supplierReportExcel: state.poReducer.pbs_data_excel,
    // isLoadingDetailSatuan: state.stockReportReducer.isLoadingDetailSatuan,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(PurchaseBySupplierReport);
