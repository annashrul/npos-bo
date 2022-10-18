import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import ExportCommon from "../../../../common/ExportCommon";
import { to_pdf, headerExcel, headerPdf, toDate, toExcel } from "../../../../../../helper";
import { statusPacking } from "../../../../../../helperStatus";
import { EXTENSION } from "../../../../../../redux/actions/_constants";

class ExpedisiReportExcel extends Component {
  constructor(props) {
    super(props);
    this.printExcel = this.printExcel.bind(this);
    this.printPdf = this.printPdf.bind(this);
  }

  handleHeader() {
    return ["NO", "NO EXPEDISI", "TANGGAL", "PENGIRIM", "LOK.ASAL", "LOK.TUJUAN", "OPERATOR", "STATUS"];
  }

  handleContent(cek = "excel") {
    let props = [];
    let data = this.props.expedisiReportExcel.data;
    if (data !== undefined) {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let v = data[i];
          props.push([i + 1, v.kd_expedisi, toDate(v.tgl_expedisi), v.pengirim, v.nama_lokasi_asal, v.nama_lokasi_tujuan, v.nama_operator, statusPacking(v.status)]);
          if (cek === "excel") props[i].shift();
        }
      }
    }
    return props;
  }

  printPdf() {
    const headers = [this.handleHeader()];
    to_pdf(
      "EXPEDISI",
      headerPdf({
        title: "EXPEDISI",
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
    toExcel("LAPORAN EXPEDISI", headerExcel(this.props.startDate, this.props.endDate), header, this.handleContent(), [], EXTENSION.XLXS);
    this.props.dispatch(ModalToggle(false));
  }
  render() {
    return <ExportCommon modalType="formExpedisiExcel" isPdf={true} callbackPdf={() => this.printPdf()} isExcel={true} callbackExcel={() => this.printExcel()} />;
  }
}

const mapStateToProps = (state) => {
  return {
    expedisiReportExcel: state.expedisiReducer.report_excel,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(ExpedisiReportExcel);
