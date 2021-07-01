import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import "jspdf-autotable";
import ExportCommon from "../../../../common/ExportCommon";
import { to_pdf, headerPdf, toExcel, rmSpaceToStrip, toDate, headerExcel } from "../../../../../../helper";
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
    let data = this.props.mutationReportExcel.data;
    let props = [];
    if (data !== undefined) {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          props.push([
            i + 1,
            data[i].no_faktur_mutasi,
            data[i].lokasi_asal,
            data[i].lokasi_tujuan,
            rmSpaceToStrip(data[i].no_faktur_beli),
            data[i].status === "0" ? "Dikirim" : data[i].status === "1" ? "Diterima" : "",
            data[i].keterangan,
            toDate(data[i].tgl_mutasi),
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
    toExcel("LAPORAN MUTASI", headerExcel(this.props.startDate, this.props.endDate), header, this.handleContent(), [], EXTENSION.XLXS);
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
