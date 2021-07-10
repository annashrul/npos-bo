import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { to_pdf, headerPdf, parseToRp, toDate, toExcel, toRp } from "../../../../../helper";
import ExportCommon from "../../../common/ExportCommon";
import { EXTENSION } from "../../../../../redux/actions/_constants";

class CashReportExcel extends Component {
  constructor(props) {
    super(props);
    this.printExcel = this.printExcel.bind(this);
    this.printPdf = this.printPdf.bind(this);
  }

  handleHeader() {
    return ["NO", "KODE KAS", "LOKASI", "KASSA", "KASIR", "TIPE", "JENIS", "JUMLAH", "KETERANGAN", "TANGGAL"];
  }

  handleContent(cek = "excel") {
    let data = this.props.cashReportExcel.data;
    let props = [];
    if (data !== undefined) {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let v = data[i];
          props.push([i + 1, v.kd_trx, v.lokasi, v.kassa, v.kasir, v.type, v.jenis, parseToRp(v.jumlah), v.keterangan, toDate(v.tgl)]);
          cek === "excel" && props[i].shift();
        }
      }
    }
    return props;
  }

  printPdf() {
    const headers = [this.handleHeader()];
    to_pdf(
      `KAS ${this.props.tipe}`.toUpperCase(),
      headerPdf({
        title: `KAS ${this.props.tipe}`.toUpperCase(),
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
    toExcel(`LAPORAN KAS ${this.props.tipe}`.toUpperCase(), `${this.props.startDate} - ${this.props.endDate}`, header, this.handleContent("excel"), [], EXTENSION.XLXS);
    this.props.dispatch(ModalToggle(false));
  }
  render() {
    return <ExportCommon modalType="formCashExcel" isPdf={true} callbackPdf={() => this.printPdf()} isExcel={true} callbackExcel={() => this.printExcel()} />;
  }
}

const mapStateToProps = (state) => {
  return {
    cashReportExcel: state.cashReducer.dataExcel,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(CashReportExcel);
