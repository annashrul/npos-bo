import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import moment from "moment";
import { to_pdf, headerPdf, toExcel } from "helper";
import { statusPurchaseOrder } from "helperStatus";
import "jspdf-autotable";
import ExportCommon from "../../../../common/ExportCommon";

class PoReportExcel extends Component {
  constructor(props) {
    super(props);
    this.printExcel = this.printExcel.bind(this);
    this.printPdf = this.printPdf.bind(this);
  }

  handleHeader() {
    return ["NO", "NO PO", "TGL", "TGL KIRIM", "SUPPLIER", "LOKASI", "JENIS", "STATUS"];
  }

  handleContent() {
    let props = [];
    if (this.props.poReportExcel.data !== undefined) {
      if (this.props.poReportExcel.data.length > 0) {
        this.props.poReportExcel.data.map((v, i) =>
          props.push([i + 1, v.no_po, moment(v.tgl_po).format("YYYY-MM-DD"), moment(v.tglkirim).format("YYYY-MM-DD"), v.nama_supplier, v.lokasi, v.jenis, statusPurchaseOrder(v.status)])
        );
      }
    }
    return props;
  }

  printPdf() {
    const headers = [this.handleHeader()];
    to_pdf(
      "PURCHASE ORDER",
      headerPdf({
        title: "PURCHASE ORDER",
        dateFrom: this.props.startDate,
        dateTo: this.props.endDate,
      }),
      headers,
      this.handleContent()
    );
    this.props.dispatch(ModalToggle(false));
  }
  printExcel() {
    toExcel("LAPORAN PURCHASE ORDER", `${this.props.startDate} - ${this.props.endDate}`, this.handleHeader(), this.handleContent(), []);
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
