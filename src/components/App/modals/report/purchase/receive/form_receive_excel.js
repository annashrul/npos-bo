import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { float, toDate, toExcel } from "../../../../../../helper";
import ExportCommon from "../../../../common/ExportCommon";
import { EXTENSION } from "../../../../../../redux/actions/_constants";

class ReceiveReportExcel extends Component {
  constructor(props) {
    super(props);
    this.printExcel = this.printExcel.bind(this);
  }

  handleHeader() {
    return ["NO FAKTUR", "TANGGAL", "PENERIMA", "TIPE", "PELUNASAN", "DISKON", "PPN", "SUPPLIER", "OPERATOR", "LOKASI", "PEMBAYARAN KE-", "SISA PEMBAYARAN", "QTY BELI", "TOTAL BELI"];
  }

  handleContent() {
    let props = [];
    let data = this.props.receiveReportExcel.data;
    let totalDiskonPerHalaman = 0;
    let totalPpnPerHalaman = 0;
    let totalSisaPembayaranPerHalaman = 0;
    let totalQtyBeliPerHalaman = 0;
    let totalJumlahBeliPerHalaman = 0;
    if (data !== undefined) {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let v = data[i];
          let sisa = `${v.pelunasan}`.toUpperCase() === "LUNAS" ? 0 : float(v.total_beli) - float(v.jumlah_bayar);
          totalDiskonPerHalaman += float(v.disc);
          totalPpnPerHalaman += float(v.ppn);
          totalSisaPembayaranPerHalaman += float(sisa);
          totalQtyBeliPerHalaman += float(v.qty_beli);
          totalJumlahBeliPerHalaman += float(v.total_beli);
          props.push([
            v.no_faktur_beli,
            toDate(v.tgl_beli),
            v.nama_penerima,
            v.type,
            v.pelunasan,
            float(v.disc),
            float(v.ppn),
            v.supplier,
            v.operator,
            v.lokasi,
            float(v.jumlah_pembayaran),
            float(sisa),
            float(v.qty_beli),
            float(v.total_beli),
          ]);
        }
      }
    }
    return {
      body: props,
      footer: {
        diskon: totalDiskonPerHalaman,
        ppn: totalPpnPerHalaman,
        sisa: totalSisaPembayaranPerHalaman,
        qtyBeli: totalQtyBeliPerHalaman,
        jumlahBeli: totalJumlahBeliPerHalaman,
      },
    };
  }
  printExcel(param) {
    let content = this.handleContent();
    let dataFooter = content.footer;
    let footer = [[""], [""], ["TOTAL", "", "", "", "", dataFooter.diskon, dataFooter.ppn, "", "", "", "", dataFooter.sisa, dataFooter.qtyBeli, dataFooter.jumlahBeli]];
    toExcel("LAPORAN RECEIVE PEMBELIAN", `${this.props.startDate} - ${this.props.endDate}`, this.handleHeader(), content.body, footer, param);
    this.props.dispatch(ModalToggle(false));
  }
  render() {
    return <ExportCommon modalType="formReceiveExcel" isCsv={true} isExcel={true} callbackCsv={() => this.printExcel(EXTENSION.CSV)} callbackExcel={() => this.printExcel(EXTENSION.XLXS)} />;
  }
}

const mapStateToProps = (state) => {
  return {
    receiveReportExcel: state.receiveReducer.receiveReportExcel,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(ReceiveReportExcel);
