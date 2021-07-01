import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import moment from "moment";
import { toRp } from "helper";
import ExportCommon from "../../../common/ExportCommon";
import { EXTENSION } from "../../../../../redux/actions/_constants";
import { toExcel } from "../../../../../helper";

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
      "Customer",
      "Kasir",
      "Omset",
      "Diskon Item",
      "Diskon Total (rp)",
      "Diskon Total (%)",
      "HPP",
      "Hrg Jual",
      "Profit",
      "Reg.Member",
      "Trx Lain",
      "Keterangan",
      "Grand Total",
      "Rounding",
      "Tunai",
      "Change",
      "Transfer",
      "Charge",
      "Nama Kartu",
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
        toRp(this.props.totalPenjualanExcel.omset),
        toRp(this.props.totalPenjualanExcel.dis_item),
        toRp(this.props.totalPenjualanExcel.dis_rp),
        this.props.totalPenjualanExcel.dis_persen,
        "",
        "",
        "",
        "",
        toRp(this.props.totalPenjualanExcel.kas_lain),
        "",
        toRp(this.props.totalPenjualanExcel.gt),
        toRp(this.props.totalPenjualanExcel.rounding),
        toRp(this.props.totalPenjualanExcel.bayar),
        toRp(this.props.totalPenjualanExcel.change),
        toRp(this.props.totalPenjualanExcel.jml_kartu),
        toRp(this.props.totalPenjualanExcel.charge),
        "",
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
            moment(v.tgl).format("yyyy/MM/DD"),
            moment(v.jam).format("hh:mm:ss"),
            v.customer,
            v.nama,
            toRp(parseInt(v.omset, 10)),
            toRp(parseInt(v.diskon_item, 10)),
            toRp(v.dis_rp),
            v.dis_persen,
            toRp(parseInt(v.hrg_beli, 10)),
            toRp(parseInt(v.hrg_jual, 10)),
            toRp(parseInt(v.profit, 10)),
            v.regmember ? v.regmember : "-",
            v.kas_lain,
            v.ket_kas_lain,
            toRp(parseInt(v.omset - v.diskon_item - v.dis_rp - v.kas_lain, 10)),
            toRp(parseInt(v.rounding, 10)),
            toRp(parseInt(v.bayar, 10)),
            toRp(parseInt(v.change, 10)),
            toRp(parseInt(v.jml_kartu, 10)),
            toRp(parseInt(v.charge, 10)),
            v.kartu,
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
    toExcel("LAPORAN ARSIP PENJUALAN", `${this.props.startDate} - ${this.props.endDate}`, this.handleHeader(), this.handleContent(), this.handleFooter(), param);
    this.props.dispatch(ModalToggle(false));
  }
  render() {
    return <ExportCommon modalType="formSaleExcel" isCsv={true} isExcel={true} callbackCsv={() => this.printExcel(EXTENSION.CSV)} callbackExcel={() => this.printExcel(EXTENSION.XLXS)} />;
  }
}

const mapStateToProps = (state) => {
  return {
    saleReportExcel: state.saleReducer.report_excel,
  };
};
export default connect(mapStateToProps)(SaleReportExcel);
