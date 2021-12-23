import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import ExportCommon from "../../../common/ExportCommon";
import { toExcel, headerPdf, toRp, to_pdf } from "../../../../../helper";
import { EXTENSION } from "../../../../../redux/actions/_constants";

class ExportSaleByGroupProduct extends Component {
  constructor(props) {
    super(props);
    this.printExcel = this.printExcel.bind(this);
    this.printPdf = this.printPdf.bind(this);
  }

  handleHeader() {
    return ["NO", "KODE", "NAMA", "QTY TERJUAL", "DISKON ITEM", "NET SALES", "TAX","SERVICE", "GROSS SALES"];
  }

  handleContent(cek = "excel") {
    let props = [];
    let data = this.props.dataExport.data;
    if (data !== undefined) {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          props.push([
            i + 1,
            data[i].kel_brg,
            data[i].kelompok,
            parseInt(data[i].qty, 10),
            parseInt(data[i].gross, 10),
            parseInt(data[i].diskon_item, 10),
            parseInt(data[i].tax, 10),
            parseInt(data[i].service, 10),
            parseInt(data[i].net_sales, 10)
          ]);
          cek === "excel" && props[i].shift();
        }
      }
    }
    return props;
  }

  printPdf() {
    const headers = [this.handleHeader()];
    let content = this.handleContent("pdf");
    to_pdf(
      "PENJUALAN BY KELOMPOK BARANG",
      headerPdf({
        title: "PENJUALAN BY KELOMPOK BARANG",
        dateFrom: this.props.startDate,
        dateTo: this.props.endDate,
      }),
      headers,
      content
    );
    this.props.dispatch(ModalToggle(false));
  }
  printExcel() {
    let content = this.handleContent();
    let header = this.handleHeader();
    header.shift();
    toExcel("LAPORAN PENJUALAN BY KELOMPOK BARANG", `${this.props.startDate} - ${this.props.endDate}`, header, content, [], EXTENSION.XLXS);
    this.props.dispatch(ModalToggle(false));
  }
  render() {
    return (
      <div>
        <ExportCommon modalType="modalSaleByGroupProductExport" isPdf={true} callbackPdf={() => this.printPdf()} isExcel={true} callbackExcel={() => this.printExcel()} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataExport: state.saleByGroupProductReducer.dataExport,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(ExportSaleByGroupProduct);
