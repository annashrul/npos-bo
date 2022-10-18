import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { to_pdf, headerExcel, headerPdf, parseToRp, rmSpaceToStrip, toDate, toExcel } from "../../../../../../helper";
import { statusArsipPenjualan, statusMutasi } from "../../../../../../helperStatus";
import { EXTENSION } from "../../../../../../redux/actions/_constants";
import ExportCommon from "../../../../common/ExportCommon";
class TransactionReportExcel extends Component {
  constructor(props) {
    super(props);
    this.printExcel = this.printExcel.bind(this);
    this.printPdf = this.printPdf.bind(this);
  }

  handleHeader() {
    return ["NO", "FAK.MUTASI", "FAK.BELI", "LOK.ASAL", "LOK.TUJUAN", "NET SALE", "HPP", "PROFIT", "PENERIMAAN", "PEMBAYARAN", "KET", "TGL"];
  }

  handleContent(cek = "excel") {
    let data = this.props.transactionReportExcel.data;
    let props = [];
    if (data !== undefined) {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let v = data[i];
          props.push([
            i + 1,
            v.no_faktur_mutasi,
            rmSpaceToStrip(v.no_faktur_beli),
            v.lokasi_asal,
            v.lokasi_tujuan,
            parseToRp(v.net_sales),
            parseToRp(v.hpp),
            parseToRp(v.profit),
            statusMutasi(v.status),
            statusArsipPenjualan(`${v.status_transaksi}`),
            rmSpaceToStrip(v.keterangan),
            toDate(v.tgl_mutasi),
          ]);
          cek === "excel" && props[i].shift();
        }
      }
    }
    return props;
  }

  printPdf() {
    const headers = [this.handleHeader()];
    to_pdf(
      "ALOKASI TRANSAKSI",
      headerPdf({
        title: "ALOKASI TRANSAKSI",
        dateFrom: this.props.startDate,
        dateTo: this.props.endDate,
      }),
      headers,
      this.handleContent("pdf")
    );
    this.props.dispatch(ModalToggle(false));
  }
  printExcel() {
    let header = this.handleHeader();
    header.shift();
    toExcel("LAPORAN ALOKASI TRANSAKSI", headerExcel(this.props.startDate, this.props.endDate), header, this.handleContent(), [], EXTENSION.XLXS);
    this.props.dispatch(ModalToggle(false));
  }
  render() {
    return <ExportCommon modalType="formTransactionExcel" isPdf={true} callbackPdf={() => this.printPdf()} isExcel={true} callbackExcel={() => this.printExcel()} />;
  }
}

const mapStateToProps = (state) => {
  return {
    transactionReportExcel: state.transactionReducer.report_excel,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(TransactionReportExcel);
