import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import ExportCommon from "../../../common/ExportCommon";
import { to_pdf, headerPdf, parseToRp, toDate, toExcel } from "../../../../../helper";
import { EXTENSION } from "../../../../../redux/actions/_constants";

class SaleByProductReportExcel extends Component {
  constructor(props) {
    super(props);
    this.printExcel = this.printExcel.bind(this);
    this.printPdf = this.printPdf.bind(this);
  }

  handleHeader() {
    return ["NO", "KODE", "NAMA", "BARCODE", "SATUAN", "QTY", "G.SALE", "DISC", "PAJAK", "SERVIS", "LOKASI", "TGL"];
  }

  handleContent(cek = "excel") {
    let props = [];
    let data = this.props.sale_by_productReportExcel.data;
    if (data !== undefined) {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let v = data[i];
          props.push([
            i + 1,
            v.kd_brg,
            v.nm_brg,
            v.barcode,
            v.satuan,
            parseToRp(v.qty_jual),
            parseToRp(v.gross_sales),
            parseToRp(v.diskon_item),
            parseToRp(v.tax),
            parseToRp(v.service),
            v.toko,
            toDate(v.tgl),
          ]);
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
      "PENJUALAN BY BARANG",
      headerPdf({
        title: "PENJUALAN BY BARANG",
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
    toExcel("LAPORAN PENJUALAN BY BARANG", `${this.props.startDate} - ${this.props.endDate}`, header, content, [], EXTENSION.XLXS);
    this.props.dispatch(ModalToggle(false));
  }
  render() {
    return (
      <div>
        <ExportCommon modalType="formSaleByProductExcel" isPdf={true} callbackPdf={() => this.printPdf()} isExcel={true} callbackExcel={() => this.printExcel()} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    sale_by_productReportExcel: state.sale_by_productReducer.report_excel,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(SaleByProductReportExcel);
