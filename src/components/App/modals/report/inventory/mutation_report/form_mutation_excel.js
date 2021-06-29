import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import "jspdf-autotable";
import ExportCommon from "../../../../common/ExportCommon";
import { to_pdf, headerPdf, toExcel, rmSpaceToStrip, toDate } from "../../../../../../helper";
import { EXTENSION } from "../../../../../../redux/actions/_constants";

class MutationReportExcel extends Component {
  constructor(props) {
    super(props);
    this.printExcel = this.printExcel.bind(this);
    this.printPdf = this.printPdf.bind(this);
  }

  handleHeader() {
    return ["NO", "NO.MUTASI", "LOK.ASAL", "LOK.TUJUAN", "NO.BELI", "STATUS", "KET", "TGL"];
  }

  handleContent(cek = "excel") {
    let props = [];
    if (this.props.mutationReportExcel.data !== undefined) {
      if (this.props.mutationReportExcel.data.length > 0) {
        this.props.mutationReportExcel.data.map((v, i) => {
          props.push([
            i + 1,
            v.no_faktur_mutasi,
            v.lokasi_asal,
            v.lokasi_tujuan,
            rmSpaceToStrip(v.no_faktur_beli),
            v.status === "0" ? "Dikirim" : v.status === "1" ? "Diterima" : "",
            v.keterangan,
            toDate(v.tgl_mutasi),
          ]);
          if (cek === "excel") props[i].shift();
        });
      }
    }
    return props;
  }

  printPdf() {
    const headers = [this.handleHeader()];
    to_pdf(
      "MUTASI",
      headerPdf({
        title: "MUTASI",
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
    toExcel("LAPORAN MUTASI", `${this.props.startDate} - ${this.props.endDate}`, header, this.handleContent(), [], EXTENSION.XLXS);
    this.props.dispatch(ModalToggle(false));
  }
  render() {
    return <ExportCommon modalType="formMutationExcel" isPdf={true} callbackPdf={() => this.printPdf()} isExcel={true} callbackExcel={() => this.printExcel()} />;
  }
}

const mapStateToProps = (state) => {
  return {
    mutationReportExcel: state.mutationReducer.report_excel,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(MutationReportExcel);
