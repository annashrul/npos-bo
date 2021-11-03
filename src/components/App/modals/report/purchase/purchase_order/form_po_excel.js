import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { statusPurchaseOrder } from "helperStatus";
import "jspdf-autotable";
import ExportCommon from "../../../../common/ExportCommon";
import { EXTENSION } from "../../../../../../redux/actions/_constants";
import { to_pdf, headerPdf, toExcel, headerExcel, toDate } from "../../../../../../helper";

class PoReportExcel extends Component {
  constructor(props) {
    super(props);
    this.printExcel = this.printExcel.bind(this);
    this.printPdf = this.printPdf.bind(this);
  }

  handleHeader() {
    return ["NO", "NO PO", "TGL PO", "TGL KIRIM", "SUPPLIER", "LOKASI", "JENIS", "STATUS"];
  }

  handleContent(cek = "excel") {
    let data = this.props.poReportExcel.data;
    let props = [];
    if (data !== undefined) {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let v = data[i];
          props.push([i + 1, v.no_po, toDate(v.tgl_po), toDate(v.tglkirim), v.nama_supplier, v.lokasi, v.jenis, statusPurchaseOrder(`${v.status}`)]);
          cek === "excel" && props[i].shift();
        }
      }
    }
    return props;
  }

  printPdf() {
    console.log(this.props);
    const headers = [this.handleHeader()];
    to_pdf(
      "PURCHASE ORDER",
      headerPdf({
        title: "PURCHASE ORDER",
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
    toExcel("LAPORAN PURCHASE ORDER", headerExcel(this.props.startDate, this.props.endDate), header, this.handleContent("excel"), [], EXTENSION.XLXS);
    this.props.dispatch(ModalToggle(false));
  }

  render() {
    return <ExportCommon modalType="formPoExcel" isPdf={true} callbackPdf={() => this.printPdf()} isExcel={true} callbackExcel={() => this.printExcel()} />;
  }
}

const mapStateToProps = (state) => {
  return {
    poReportExcel: state.poReducer.report_excel,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(PoReportExcel);
