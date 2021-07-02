import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import ExportCommon from "../../../../common/ExportCommon";
import { to_pdf, headerExcel, headerPdf, rmSpaceToStrip, toDate, toExcel } from "../../../../../../helper";
import { EXTENSION } from "../../../../../../redux/actions/_constants";
import { statusAlokasi } from "../../../../../../helperStatus";
class AlokasiReportExcel extends Component {
  constructor(props) {
    super(props);
    this.printExcel = this.printExcel.bind(this);
    this.printPdf = this.printPdf.bind(this);
  }

  handleHeader() {
    return ["NO", "NO MUTASI", "NO BELI", "LOK.ASAL", "LOK.TUJUAN", "STATUS", "TANGGAL", "KETERANGAN"];
  }

  handleContent(cek = "excel") {
    let props = [];
    let data = this.props.alokasiReportExcel.data;
    if (data !== undefined) {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          props.push([
            i + 1,
            data[i].no_faktur_mutasi,
            rmSpaceToStrip(data[i].no_faktur_beli),
            data[i].lokasi_asal,
            data[i].lokasi_tujuan,
            statusAlokasi(data[i].status),
            toDate(data[i].tgl_mutasi),
            rmSpaceToStrip(data[i].keterangan),
          ]);
          if (cek === "excel") props[i].shift();
        }
      }
    }
    return props;
  }

  printPdf() {
    const headers = [this.handleHeader()];
    to_pdf(
      "ALOKASI",
      headerPdf({
        title: "ALOKASI",
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
    toExcel("LAPORAN ALOKASI", headerExcel(this.props.startDate, this.props.endDate), header, this.handleContent(), [], EXTENSION.XLXS);
    this.props.dispatch(ModalToggle(false));
  }
  render() {
    return <ExportCommon modalType="formAlokasiExcel" isPdf={true} callbackPdf={() => this.printPdf()} isExcel={true} callbackExcel={() => this.printExcel()} />;
  }
}

const mapStateToProps = (state) => {
  return {
    alokasiReportExcel: state.alokasiReducer.report_excel,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(AlokasiReportExcel);
