import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import ExportCommon from "../../../common/ExportCommon";
import { EXTENSION } from "../../../../../redux/actions/_constants";
import { toDate, toExcel } from "../../../../../helper";

class SaleReportExcel extends Component {
  constructor(props) {
    super(props);
    this.printExcel = this.printExcel.bind(this);
  }

  handleHeader() {
    return [
      "Kd Trx",
      "Tanggal",
      "Jam",
      "Jatuh Tempo",
      "Customer",
      "Kasir",
      "Omset",
      "Diskon Item",
      "Diskon Total (rp)",
      "Diskon Total (%)",
      "Net Sales",
      "Profit",
      "Tunai",
      "Kembalian",
      "Total Tunai",
      "Transfer",
      "Status",
      "Lokasi",
      "Jenis Trx",
    ];
  }

  handleFooter() {
    return [
      [""],
      [""],
      [
        "TOTAL",
        "",
        "",
        "",
        "",
        "",
        parseFloat(this.props.totalPenjualanExcel.omset),
        parseFloat(this.props.totalPenjualanExcel.dis_item),
        parseFloat(this.props.totalPenjualanExcel.dis_rp),
        parseFloat(this.props.totalPenjualanExcel.dis_persen),
        parseFloat(this.props.totalPenjualanExcel.gt),
        parseFloat(this.props.totalPenjualanExcel.profit),
        parseFloat(this.props.totalPenjualanExcel.bayar),
        parseFloat(this.props.totalPenjualanExcel.change),
        parseFloat(this.props.totalPenjualanExcel.total_tunai_all),
        parseFloat(this.props.totalPenjualanExcel.jml_kartu),
        "",
        "",
        "",
      ],
    ];
  }

  handleContent() {
    let props = [];
    let data = this.props.saleReportExcel.data;
    if (data !== undefined) {
      if (data.length > 0) {
        data.map((v) =>
          props.push([
            v.kd_trx,
            toDate(v.tgl),
            toDate(v.jam, "/", true),
            v.jenis_trx === "Kredit" ? toDate(v.tempo) : "-",
            v.customer,
            v.nama,
            parseFloat(v.omset),
            parseFloat(v.diskon_item),
            parseFloat(v.dis_rp),
            parseFloat(v.dis_persen),
            parseFloat(v.omset - v.diskon_item - v.dis_rp - v.kas_lain),
            parseFloat(v.profit),
            // v.regmember ? v.regmember : "-",
            // v.kas_lain,
            // v.ket_kas_lain,
            parseFloat(v.bayar),
            String(v.jenis_trx).toLowerCase() === "non tunai"
              ? 0
              : parseFloat(v.change),
            parseFloat(v.bayar) -
              (String(v.jenis_trx).toLowerCase() === "non tunai"
                ? 0
                : parseFloat(v.change)),
            parseFloat(v.jml_kartu),
            v.status,
            v.lokasi,
            v.jenis_trx,
          ])
        );
      }
    }
    return props;
  }
  printExcel(param) {
    toExcel(
      "LAPORAN ARSIP PENJUALAN",
      `${this.props.startDate} - ${this.props.endDate}`,
      this.handleHeader(),
      this.handleContent(),
      this.handleFooter(),
      param
    );
    this.props.dispatch(ModalToggle(false));
  }
  render() {
    return (
      <ExportCommon
        modalType="formSaleExcel"
        isCsv={true}
        isExcel={true}
        callbackCsv={() => this.printExcel(EXTENSION.CSV)}
        callbackExcel={() => this.printExcel(EXTENSION.XLXS)}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    saleReportExcel: state.saleReducer.report_excel,
  };
};
export default connect(mapStateToProps)(SaleReportExcel);
