import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import ExportCommon from "../../../../common/ExportCommon";
import { to_pdf, headerExcel, headerPdf, toDate, toExcel } from "../../../../../../helper";
import { statusPacking } from "../../../../../../helperStatus";
import { EXTENSION } from "../../../../../../redux/actions/_constants";
class PackingReportExcel extends Component {
  constructor(props) {
    super(props);
    this.printExcel = this.printExcel.bind(this);
    this.printPdf = this.printPdf.bind(this);
  }

  handleHeader() {
    return ["NO", "NO PACKING", "TANGGAL", "PENGIRIM", "LOK.ASAL", "LOK.TUJUAN", "OPERATOR", "STATUS"];
  }

  handleContent(cek = "excel") {
    let props = [];
    let data = this.props.packingReportExcel.data;
    if (data !== undefined) {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let v = data[i];
          props.push([i + 1, v.kd_packing, toDate(v.tgl_packing).format("DD-MM-YYYY"), v.pengirim, v.nama_lokasi_asal, v.nama_lokasi_tujuan, v.nama_operator, statusPacking(v.status)]);
          if (cek === "excel") props[i].shift();
        }
      }
    }
    return props;
  }

  printPdf() {
    const headers = [this.handleHeader()];
    to_pdf(
      "PACKING",
      headerPdf({
        title: "PACKING",
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
    toExcel("LAPORAN PACKING", headerExcel(this.props.startDate, this.props.endDate), header, this.handleContent(), [], EXTENSION.XLXS);
    this.props.dispatch(ModalToggle(false));
  }

  render() {
    return <ExportCommon modalType="formPackingExcel" isPdf={true} callbackPdf={() => this.printPdf()} isExcel={true} callbackExcel={() => this.printExcel()} />;
  }
}

const mapStateToProps = (state) => {
  return {
    packingReportExcel: state.packingReducer.report_excel,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(PackingReportExcel);
