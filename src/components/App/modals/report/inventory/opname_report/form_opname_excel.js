import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { to_pdf, headerExcel, headerPdf, toDate, toExcel } from "../../../../../../helper";
import ExportCommon from "../../../../common/ExportCommon";
import { statusOpname } from "../../../../../../helperStatus";
import { EXTENSION } from "../../../../../../redux/actions/_constants";

class OpnameReportExcel extends Component {
  constructor(props) {
    super(props);
    this.printExcel = this.printExcel.bind(this);
    this.printPdf = this.printPdf.bind(this);
  }

  handleHeader() {
    return ["NO", "KODE TRX", "TGL", "KODE BRG", "NAMA BRG", "KEL BRG", "BARCODE", "QTY FISIK", "STOK TERAKHIR", "LOKASI", "HRG BELI", "STATUS"];
  }

  handleContent(cek = "excel") {
    let data = this.props.opnameReportExcel.data;
    let props = [];
    if (data !== undefined) {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let v = data[i];
          props.push([i + 1, v.kd_trx, toDate(v.tanggal), v.kd_brg, v.nm_brg, v.nm_kel_brg, v.barcode, v.qty_fisik, v.stock_terakhir, v.lokasi, v.hrg_beli, statusOpname(v.status)]);
          cek === "excel" && props[i].shift();
        }
      }
    }
    return props;
  }

  printPdf() {
    const headers = [this.handleHeader()];
    to_pdf(
      "OPNAME",
      headerPdf({
        title: "OPNAME",
        dateFrom: this.props.periode.split("-")[0],
        dateTo: this.props.periode.split("-")[1],
      }),
      headers,
      this.handleContent("pdf")
    );
    this.props.dispatch(ModalToggle(false));
  }
  printExcel() {
    let header = this.handleHeader();
    header.shift();
    toExcel("LAPORAN OPNAME", headerExcel(this.props.periode.split("-")[0], this.props.periode.split("-")[1]), header, this.handleContent(), [], EXTENSION.XLXS);
    this.props.dispatch(ModalToggle(false));
  }
  render() {
    return <ExportCommon modalType="formOpnameExcel" isPdf={true} callbackPdf={() => this.printPdf()} isExcel={true} callbackExcel={() => this.printExcel()} />;
  }
}

const mapStateToProps = (state) => {
  return {
    opnameReportExcel: state.opnameReducer.report_excel,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(OpnameReportExcel);
