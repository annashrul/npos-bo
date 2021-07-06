import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import ExportCommon from "../../../common/ExportCommon";
import { to_pdf, headerPdf, toDate, toExcel } from "../../../../../helper";
import { EXTENSION } from "../../../../../redux/actions/_constants";

class SaleReturReportExcel extends Component {
  constructor(props) {
    super(props);
    this.printExcel = this.printExcel.bind(this);
    this.printPdf = this.printPdf.bind(this);
  }

  handleHeader() {
    return ["NO", "KODE TRANSAKSI", "NAMA", "NILAI RETUR", "DISKON ITEM", "LOKASI", "TANGGAL"];
  }

  handleContent(cek = "excel") {
    let props = [];
    let data = this.props.sale_returReportExcel.data;
    if (data !== undefined) {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          props.push([i + 1, data[i].kd_trx, data[i].nama, data[i].nilai_retur, data[i].diskon_item, data[i].lokasi, toDate(data[i].tgl)]);
          cek === "excel" && props[i].shift();
        }
      }
    }
    return props;
  }

  printPdf() {
    const headers = [this.handleHeader()];
    const content = this.handleContent("pdf");
    to_pdf(
      "RETUR_PENJUALAN",
      headerPdf({
        title: "RETUR PENJUALAN",
        dateFrom: this.props.startDate,
        dateTo: this.props.endDate,
      }),
      headers,
      content
    );
    this.props.dispatch(ModalToggle(false));
  }
  printExcel() {
    let header = this.handleHeader();
    header.shift();
    let content = this.handleContent();
    toExcel("LAPORAN RETUR PENJUALAN", `${this.props.startDate} - ${this.props.endDate}`, header, content, [], EXTENSION.XLXS);
    this.props.dispatch(ModalToggle(false));
  }
  render() {
    return (
      <div>
        <ExportCommon modalType="formSaleReturExcel" isPdf={true} callbackPdf={() => this.printPdf()} isExcel={true} callbackExcel={() => this.printExcel()} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    sale_returReportExcel: state.saleReducer.sale_retur_export,
  };
};
export default connect(mapStateToProps)(SaleReturReportExcel);
