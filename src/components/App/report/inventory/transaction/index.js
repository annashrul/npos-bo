import React, { Component } from "react";
import Layout from "components/App/Layout";
import { FetchTransaction, FetchTransactionExcel, FetchTransactionData } from "redux/actions/inventory/transaction.action";
import { rePrintFaktur } from "redux/actions/inventory/mutation.action";
import connect from "react-redux/es/connect/connect";
import DetailTransaction from "components/App/modals/report/inventory/transaction_report/detail_transaction";
import TransactionReportExcel from "components/App/modals/report/inventory/transaction_report/form_transaction_excel";
import { DeleteTransaction } from "../../../../../redux/actions/inventory/transaction.action";
import { CURRENT_DATE, generateNo, getFetchWhere, getPeriode, noData, parseToRp, rmSpaceToStrip, toDate } from "../../../../../helper";
import TableCommon from "../../../common/TableCommon";
import ButtonActionCommon from "../../../common/ButtonActionCommon";
import { statusArsipPenjualan, statusMutasi } from "../../../../../helperStatus";
import HeaderReportCommon from "../../../common/HeaderReportCommon";
import { linkAlokasi, linkReportAlokasi3ply } from "../../../../../helperLink";

class TransactionReport extends Component {
  constructor(props) {
    super(props);
    this.handleModal = this.handleModal.bind(this);
    this.handleService = this.handleService.bind(this);
    this.handleRePrint = this.handleRePrint.bind(this);
    this.state = {
      where_data: `page=1&datefrom=${CURRENT_DATE}&dateto=${CURRENT_DATE}`,
      startDate: CURRENT_DATE,
      endDate: CURRENT_DATE,
      column_data: [
        { value: "no_faktur_mutasi", label: "Faktur mutasi" },
        { value: "tgl_mutasi", label: "Tanggal" },
        { value: "status", label: "Status" },
        { value: "lokasi_asal", label: "Lokasi asal" },
        { value: "lokasi_tujuan", label: "Lokasi tujuan" },
      ],
      isModalDetail: false,
      isModalExport: false,
    };
  }

  handleService(res, page = 1) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      let state = { where_data: where };
      this.setState(state);
      this.props.dispatch(FetchTransaction(where));
    }
  }

  handleModal(type, obj) {
    let whereState = this.state.where_data;
    let where = getFetchWhere(whereState);
    let periode = getPeriode(where.split("&"));
    let getDate = periode.split("-");
    let state = { startDate: getDate[0], endDate: getDate[1], where_data: where };

    if (type === "excel") {
      Object.assign(state, { isModalExport: true });
      this.props.dispatch(FetchTransactionExcel(where, obj.total));
    } else {
      Object.assign(state, { isModalDetail: true, where_data: where });
      this.props.dispatch(FetchTransactionData(obj.no_faktur_mutasi, where, true));
    }
    this.setState(state);
  }

  componentWillUnmount() {
    this.setState({ isModalDetail: false, isModalExport: false });
  }

  handlePageChange(pageNumber) {
    this.handleService(this.state.where_data, pageNumber);
  }

  handleRePrint(id) {
    this.props.dispatch(rePrintFaktur(id));
  }

  HandleRemove(id) {
    let data = { id: id, where: this.state.where_data };
    this.props.dispatch(DeleteTransaction(data));
  }

  render() {
    const { per_page, last_page, current_page, total_periode, data, total } = this.props.transactionReport;
    const { startDate, endDate, column_data, where_data, isModalDetail, isModalExport } = this.state;

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
    const rowSpan = [{ label: "Mutasi" }, { label: "Beli" }, { label: "Asal" }, { label: "Tujuan" }, { label: "Penerimaan" }, { label: "Pembayaran" }];
    return (
      <Layout page="Laporan Alokasi Transaksi">
        <HeaderReportCommon
          pathName="ReportAlokasiTransaksi"
          isColumn={true}
          isLocation={true}
          isSort={true}
          isLocation={true}
          columnData={column_data}
          callbackWhere={(res) => this.handleService(res)}
          callbackExcel={() => this.handleModal("excel", { total: last_page * per_page })}
          excelData={this.props.download}
        />
        <TableCommon
          head={head}
          rowSpan={rowSpan}
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
                              if (e === 2) this.props.history.push(`${linkReportAlokasi3ply}${v.no_faktur_mutasi}`);
                              if (e === 3) this.HandleRemove(v.no_faktur_mutasi);
                              if (v.status === "0") {
                                if (e === 4) this.props.history.push(`${linkAlokasi}/${btoa(v.no_faktur_mutasi)}`);
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
                : noData(head.length + rowSpan.length)
              : noData(head.length + rowSpan.length)
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
    auth: state.auth,
    transactionDetail: state.transactionReducer.report_data,
    transactionReportExcel: state.transactionReducer.report_excel,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(TransactionReport);
