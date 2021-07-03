import React, { Component } from "react";
import Layout from "components/App/Layout";
import { FetchTransaction, FetchTransactionExcel, FetchTransactionData } from "redux/actions/inventory/transaction.action";
import { rePrintFaktur } from "redux/actions/inventory/mutation.action";
import connect from "react-redux/es/connect/connect";
import DetailTransaction from "components/App/modals/report/inventory/transaction_report/detail_transaction";
import TransactionReportExcel from "components/App/modals/report/inventory/transaction_report/form_transaction_excel";
import Swal from "sweetalert2";
import { DeleteTransaction } from "../../../../../redux/actions/inventory/transaction.action";
import { CURRENT_DATE, dateRange, generateNo, getStorage, getWhere, isEmptyOrUndefined, isProgress, noData, parseToRp, rmSpaceToStrip, setStorage, toDate } from "../../../../../helper";
import SelectCommon from "../../../common/SelectCommon";
import SelectSortCommon from "../../../common/SelectSortCommon";
import TableCommon from "../../../common/TableCommon";
import ButtonActionCommon from "../../../common/ButtonActionCommon";
import { statusArsipPenjualan, statusMutasi } from "../../../../../helperStatus";

const dateFromStorage = "dateFromReportReceive";
const dateToStorage = "dateToReportReceive";
const columnStorage = "columnReportReveive";
const sortStorage = "sortReportReveive";
const anyStorage = "anyReportReveive";

class TransactionReport extends Component {
  constructor(props) {
    super(props);
    this.handleModal = this.handleModal.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleRePrint = this.handleRePrint.bind(this);
    this.state = {
      where_data: `page=1&datefrom=${CURRENT_DATE}&dateto=${CURRENT_DATE}`,
      any: "",
      location: "",
      startDate: CURRENT_DATE,
      endDate: CURRENT_DATE,
      sort: "",
      column: "",
      column_data: [
        { value: "no_faktur_mutasi", label: "Kode Mutasi" },
        { value: "tgl_mutasi", label: "Tanggal" },
        { value: "status", label: "Status" },
      ],
      isModalDetail: false,
      isModalExport: false,
    };
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
      where = `page=${page}&datefrom=${getDateFrom}&dateto=${getDateTo}`;
      Object.assign(state, { startDate: getDateFrom, endDate: getDateTo });
    } else {
      where = `page=${page}&datefrom=${this.state.startDate}&dateto=${this.state.endDate}`;
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
    this.props.dispatch(FetchTransaction(where));
  }
  handleSelect(state, res) {
    if (state === "column") setStorage(columnStorage, res.value);
    if (state === "sort") setStorage(sortStorage, res.value);
    setTimeout(() => this.handleService(1), 500);
  }
  handleModal(type, obj) {
    let state = {};
    let whereState = getWhere(this.state.where_data);
    let where = `page=1${whereState}`;
    if (type === "excel") {
      Object.assign(state, { isModalExport: true });
      this.props.dispatch(FetchTransactionExcel(1, where, obj.total));
    } else {
      Object.assign(state, { isModalDetail: true, where_data: where });
      this.props.dispatch(FetchTransactionData(obj.no_faktur_mutasi, where, true));
    }
    this.setState(state);
  }

  componentWillUnmount() {
    this.setState({ isModalDetail: false, isModalExport: false });
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
    this.handleService();
  }

  handleRePrint(id) {
    this.props.dispatch(rePrintFaktur(id));
  }

  HandleRemove(id) {
    Swal.fire({
      allowOutsideClick: false,
      title: "Are you sure?",
      text: "You won't be able to revert this! ",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        // del(table,id);
        // this.getData()
        this.props.dispatch(DeleteTransaction(id));
      }
    });
  }

  render() {
    const { per_page, last_page, current_page, total_periode, data, total } = this.props.transactionReport;
    const { startDate, endDate, column, column_data, sort, any, where_data, isModalDetail, isModalExport } = this.state;

    let totalNetSalePerHalaman = 0;
    let totalHppPerHalaman = 0;
    let totalProfitPerHalaman = 0;
    const head = [
      { rowSpan: 2, label: "No", className: "text-center", width: "1%" },
      { rowSpan: 2, label: "#", className: "text-center", width: "1%" },
      { colSpan: 2, label: "Faktur", width: "1%" },
      { colSpan: 2, label: "Lokasi", width: "1%" },
      { rowSpan: 2, label: "Net sale", width: "1%" },
      { rowSpan: 2, label: "Hpp", width: "1%" },
      { rowSpan: 2, label: "Profit", width: "1%" },
      { colSpan: 2, label: "Status", width: "1%" },
      { rowSpan: 2, label: "Keterangan" },
      { rowSpan: 2, label: "Tanggal", width: "1%" },
    ];
    return (
      <Layout page="Laporan Alokasi Transaksi">
        <div className="row">
          <div className="col-6 col-xs-6 col-md-2">
            {dateRange((first, last) => {
              setStorage(dateFromStorage, first);
              setStorage(dateToStorage, last);
              this.handleService();
            }, `${toDate(startDate)} - ${toDate(endDate)}`)}
          </div>
          <div className="col-6 col-xs-6 col-md-2">
            <SelectCommon label="Kolom" options={column_data} callback={(res) => this.handleSelect("column", res)} dataEdit={column} />
          </div>
          <div className="col-6 col-xs-6 col-md-2">
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
          rowSpan={[{ label: "Mutasi" }, { label: "Beli" }, { label: "Asal" }, { label: "Tujuan" }, { label: "Penerimaan" }, { label: "Pembayaran" }]}
          meta={{ total: total, current_page: current_page, per_page: per_page }}
          current_page={current_page}
          callbackPage={this.handlePageChange.bind(this)}
          renderRow={
            typeof data === "object"
              ? data.length > 0
                ? data.map((v, i) => {
                    let action = [{ label: "Detail" }, { label: "Print Faktur" }, { label: "3ply" }, { label: "Hapus" }, { label: "Edit" }];
                    if (v.status !== "0") {
                      action = [{ label: "Detail" }, { label: "Print Faktur" }, { label: "3ply" }, { label: "Hapus" }];
                    }
                    totalNetSalePerHalaman += parseInt(v.net_sales, 10);
                    totalHppPerHalaman += parseInt(v.hpp, 10);
                    totalProfitPerHalaman += parseInt(v.profit, 10);
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center"> {generateNo(i, current_page)}</td>
                        <td className="middle nowrap text-center">
                          <ButtonActionCommon
                            action={action}
                            callback={(e) => {
                              console.log(e);
                              if (e === 0) this.handleModal("detail", v);
                              if (e === 1) this.handleRePrint(v.no_faktur_mutasi);
                              if (e === 2) this.props.history.push(`../alokasi3ply/${v.no_faktur_mutasi}`);
                              if (e === 3) this.HandleRemove(v.no_faktur_mutasi);
                              if (v.status === "0") {
                                if (e === 4) this.props.history.push(`../edit/alokasi/${btoa(v.no_faktur_mutasi)}`);
                              }
                            }}
                          />
                        </td>
                        <td className="middle nowrap">{v.no_faktur_mutasi}</td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.no_faktur_beli)}</td>
                        <td className="middle nowrap">{v.lokasi_asal}</td>
                        <td className="middle nowrap">{v.lokasi_tujuan}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.net_sales)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.hpp)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.profit)}</td>
                        <td className="middle nowrap">{statusMutasi(v.status, true)}</td>
                        <td className="middle nowrap">{statusArsipPenjualan(`${v.status_transaksi}`, true)}</td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.keterangan)}</td>
                        <td className="middle nowrap">{toDate(v.tgl_mutasi)}</td>
                      </tr>
                    );
                  })
                : noData(head.length)
              : noData(head.length)
          }
          footer={[
            {
              data: [
                { colSpan: 6, label: "Total perhalaman", className: "text-left" },
                { colSpan: 1, label: parseToRp(totalNetSalePerHalaman) },
                { colSpan: 1, label: parseToRp(totalHppPerHalaman) },
                { colSpan: 1, label: parseToRp(totalProfitPerHalaman) },
                { colSpan: 4, label: "" },
              ],
            },
            {
              data: [
                { colSpan: 6, label: "Total keseluruhan", className: "text-left" },
                { colSpan: 1, label: parseToRp(total_periode ? total_periode.net_sales : 0) },
                { colSpan: 1, label: parseToRp(total_periode ? total_periode.hpp : 0) },
                { colSpan: 1, label: parseToRp(total_periode ? total_periode.profit : 0) },
                { colSpan: 4, label: "" },
              ],
            },
          ]}
        />
        {this.props.isOpen && isModalDetail ? <DetailTransaction where={where_data} transactionDetail={this.props.transactionDetail} /> : null}
        {this.props.isOpen && isModalExport ? <TransactionReportExcel startDate={startDate} endDate={endDate} /> : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    download: state.transactionReducer.download,
    transactionReport: state.transactionReducer.report,
    isLoadingDetail: state.transactionReducer.isLoadingApproval,
    auth: state.auth,
    isLoading: state.transactionReducer.isLoadingApproval,
    transactionDetail: state.transactionReducer.report_data,
    transactionReportExcel: state.transactionReducer.report_excel,
    // isLoadingDetailSatuan: state.stockReportReducer.isLoadingDetailSatuan,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(TransactionReport);
