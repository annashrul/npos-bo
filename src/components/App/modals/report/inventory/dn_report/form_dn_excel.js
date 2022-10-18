import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import ExportCommon from "../../../../common/ExportCommon";
import { to_pdf, headerExcel, headerPdf, rmSpaceToStrip, toDate, toExcel } from "../../../../../../helper";
import { statusDeliveryNote } from "../../../../../../helperStatus";
import { EXTENSION } from "../../../../../../redux/actions/_constants";

class DnReportExcel extends Component {
  constructor(props) {
    super(props);
    this.printExcel = this.printExcel.bind(this);
    this.printPdf = this.printPdf.bind(this);
  }

  handleHeader() {
    return ["NO", "FATUR DN", "TANGGAL", "LOK>ASAL", "LOK.TUJUAN", "STATUS", "FAKTUR BELI", "KETERANGAN"];
  }

  handleContent(cek = "excel") {
    let props = [];
    let data = this.props.dnReportExcel.data;
    if (data !== undefined) {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let v = data[i];
          props.push([i + 1, v.no_delivery_note, toDate(v.tanggal), v.kd_lokasi_1, v.kd_lokasi_2, statusDeliveryNote(v.status), rmSpaceToStrip(v.no_faktur_beli), rmSpaceToStrip(v.keterangan)]);
          if (cek === "excel") props[i].shift();
        }
      }
    }
    return props;
  }

  printPdf() {
    const headers = [this.handleHeader()];
    to_pdf(
      "DELIVERY NOTE",
      headerPdf({
        title: "DELIVERY NOTE",
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
    toExcel("LAPORAN DELIVERY NOTE", headerExcel(this.props.startDate, this.props.endDate), header, this.handleContent(), [], EXTENSION.XLXS);
    this.props.dispatch(ModalToggle(false));
  }
  render() {
    return <ExportCommon modalType="formDnExcel" isPdf={true} callbackPdf={() => this.printPdf()} isExcel={true} callbackExcel={() => this.printExcel()} />;
  }
}

const mapStateToProps = (state) => {
  return {
    dnReportExcel: state.dnReducer.report_excel,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(DnReportExcel);
