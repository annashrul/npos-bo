import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import ExportCommon from "../../../../common/ExportCommon";
import { to_pdf, headerExcel, headerPdf, toDate, toExcel } from "../../../../../../helper";
import { EXTENSION } from "../../../../../../redux/actions/_constants";

class AdjustmentReportExcel extends Component {
  constructor(props) {
    super(props);
    this.printExcel = this.printExcel.bind(this);
    this.printPdf = this.printPdf.bind(this);
  }

  handleHeader() {
    return ["NO", "NO.ADJUSMENT", "OPERATOR", "LOKASI", "TANGGAL", "KETERANGAN"];
  }

  handleContent(cek = "excel") {
    let props = [];
    let data = this.props.adjustmentReportExcel.data;
    if (data !== undefined) {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          props.push([i + 1, data[i].kd_trx, data[i].username, data[i].lokasi, toDate(data[i].tgl), data[i].keterangan]);
          if (cek === "excel") props[i].shift();
        }
      }
    }
    return props;
  }

  printPdf() {
    const headers = [this.handleHeader()];
    to_pdf(
      "ADJUSMENT",
      headerPdf({
        title: "ADJUSMENT",
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
    toExcel("LAPORAN ADJUSMENT", headerExcel(this.props.startDate, this.props.endDate), header, this.handleContent(), [], EXTENSION.XLXS);
    this.props.dispatch(ModalToggle(false));
  }
  render() {
    return <ExportCommon modalType="formAdjustmentExcel" isPdf={true} callbackPdf={() => this.printPdf()} isExcel={true} callbackExcel={() => this.printExcel()} />;
  }
}

const mapStateToProps = (state) => {
  return {
    adjustmentReportExcel: state.adjustmentReducer.dataExcel,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(AdjustmentReportExcel);
