import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { to_pdf, headerPdf, toExcel, toDate, headerExcel } from "../../../../helper";
import { EXTENSION } from "../../../../redux/actions/_constants";
import ExportCommon from "../../common/ExportCommon";

class PiutangReportExcel extends Component {
  constructor(props) {
    super(props);
    this.printExcel = this.printExcel.bind(this);
    this.printPdf = this.printPdf.bind(this);
  }

  handleHeader() {
    return [
      "No".toUpperCase(),
      "No Nota".toUpperCase(),
      "Faktur Jual".toUpperCase(),
      "Bank".toUpperCase(),
      "Customer".toUpperCase(),
      "Operator".toUpperCase(),
      "Jumlah".toUpperCase(),
      "Tanggal Bayar".toUpperCase(),
      "Jatuh Tempo".toUpperCase(),
    ];
  }

  handleContent(cek = "excel") {
    let props = [];
    let data = this.props.piutangReportExcel.data;
    if (data !== undefined) {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let v = data[i];
          props.push([i + 1, v.no_nota, v.fak_jual, v.nm_bank, v.nama, v.operator, parseInt(v.jumlah, 10), toDate(v.tgl_byr), toDate(v.tgl_jatuh_tempo)]);
          if (cek === "excel") props[i].shift();
        }
      }
    }
    console.log(props);
    return props;
  }

  printPdf() {
    const headers = [this.handleHeader()];
    to_pdf(
      "PIUTANG",
      headerPdf({
        title: "PIUTANG",
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
    toExcel("LAPORAN PIUTANG", headerExcel(this.props.startDate, this.props.endDate), header, this.handleContent(), [], EXTENSION.XLXS);
    this.props.dispatch(ModalToggle(false));
  }
  render() {
    return <ExportCommon modalType="formPiutangExcel" isPdf={true} callbackPdf={() => this.printPdf()} isExcel={true} callbackExcel={() => this.printExcel()} />;
  }
}

const mapStateToProps = (state) => {
  return {
    piutangReportExcel: state.piutangReducer.report_excel,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(PiutangReportExcel);
