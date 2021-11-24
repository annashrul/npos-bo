import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { headerPdf, headerExcel, to_pdf, toDate, toExcel } from "../../../../../helper";
import { EXTENSION } from "../../../../../redux/actions/_constants";

import ExportCommon from "../../../common/ExportCommon";
class SaleOmsetReportExcel extends Component {
  // constructor(props) {
  //   super(props);
  //   this.toggle = this.toggle.bind(this);
  //   this.handleView = this.handleView.bind(this);
  //   this.printDocument = this.printDocument.bind(this);
  //   this.state = {
  //     title: "",
  //     jenis: "",
  //     type: "",
  //     view: false,
  //     error: {
  //       title: "",
  //       jenis: "",
  //       type: "",
  //     },
  //   };
  // }
  // handleView = (e) => {
  //   e.preventDefault();
  //   this.setState({
  //     view: !this.state.view,
  //   });
  // };
  // toggle = (e) => {
  //   e.preventDefault();
  //   this.props.dispatch(ModalToggle(false));
  // };
  // printDocument = (e) => {
  //   e.preventDefault();
  //   const headers = [["No", "Tanggal", "Omset Kotor", "Diskon Trx", "Diskon Item", "Tunai", "Non Tunai", "Net Sales", "Setoran", "Selisih"]];
  //   let data =
  //     typeof this.props.sale_omsetReportExcel.data === "object"
  //       ? this.props.sale_omsetReportExcel.data.map((v, i) => [
  //           i + 1,
  //           moment(v.tanggal).format("YYYY-MM-DD"),
  //           parseFloat(v.gross_sales),
  //           parseFloat(v.diskon_trx),
  //           parseFloat(v.diskon_item),
  //           parseFloat(v.tunai),
  //           parseFloat(v.non_tunai),
  //           parseFloat(v.net_sales),
  //           parseFloat(v.setoran),
  //           parseFloat(v.net_sales) - parseFloat(v.setoran),
  //         ])
  //       : "";
  //   // data +=["TOTAL","","","","","","","","",tprice];
  //   to_pdf(
  //     "OMSET_PENJUALAN",
  //     headerPdf({
  //       title: "OMSET PENJUALAN",
  //       dateFrom: this.props.startDate,
  //       dateTo: this.props.endDate,
  //     }),
  //     headers,
  //     data
  //     // footer
  //   );
  //   this.toggle(e);
  // };
  // printDocumentXLsx = (e, param) => {
  //   e.preventDefault();

  //   let header = [
  //     ["LAPORAN OMSET PENJUALAN"],
  //     ["PERIODE : " + this.props.startDate + " - " + this.props.endDate + ""],
  //     [""],
  //     ["Tanggal", "Omset Kotor", "Diskon Trx", "Diskon Item", "Tunai", "Non Tunai", "Net Sales", "Setoran", "Selisih"],
  //   ];
  //   let raw =
  //     typeof this.props.sale_omsetReportExcel.data === "object"
  //       ? this.props.sale_omsetReportExcel.data.map((v, i) => [
  //           moment(v.tanggal).format("YYYY-MM-DD"),
  // parseFloat(v.gross_sales),
  // parseFloat(v.diskon_trx),
  // parseFloat(v.diskon_item),
  // parseFloat(v.tunai),
  // parseFloat(v.non_tunai),
  // parseFloat(v.net_sales),
  // parseFloat(v.setoran),
  // parseFloat(v.net_sales) - parseFloat(v.setoran),
  //         ])
  //       : "";

  //   let body = header.concat(raw);

  //   let data = body;
  //   let ws = XLSX.utils.json_to_sheet(data, { skipHeader: true });

  //   let wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
  //   let exportFileName = `Laporan__Omset_Penjualan_${moment(new Date()).format("YYYYMMDDHHMMss")}.${param === "csv" ? `csv` : `xlsx`}`;
  //   XLSX.writeFile(wb, exportFileName, {
  //     type: "file",
  //     bookType: param === "csv" ? "csv" : "xlsx",
  //   });

  //   this.toggle(e);
  // };
  constructor(props) {
    super(props);
    this.printExcel = this.printExcel.bind(this);
    this.printPdf = this.printPdf.bind(this);
  }

  handleHeader() {
    return ["NO", "TANGGAL", "OMSET KOTOR", "DISKON TRANSAKSI", "DISKON ITEM", "TUNAI", "NON TUNAI", "NET SALES", "SETORAN", "SELISIH"];
  }
  handleFooter() {
    const total_data = this.props.sale_omsetReportExcel.total_data;
    return [
      [""],
      [""],
      [
        "TOTAL",
        parseFloat(total_data.gross_sales),
        parseFloat(total_data.diskon_trx),
        parseFloat(total_data.diskon_item),
        parseFloat(total_data.tunai),
        parseFloat(total_data.non_tunai),
        parseFloat(total_data.net_sales),
        parseFloat(total_data.setoran),
        parseFloat(total_data.net_sales - total_data.setoran),
      ],
    ];
  }

  handleContent(cek = "excel") {
    let data = this.props.sale_omsetReportExcel.data;
    let props = [];
    if (data !== undefined) {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let v = data[i];
          props.push([
            i + 1,
            toDate(v.tanggal),
            parseFloat(v.gross_sales),
            parseFloat(v.diskon_trx),
            parseFloat(v.diskon_item),
            parseFloat(v.tunai),
            parseFloat(v.non_tunai),
            parseFloat(v.net_sales),
            parseFloat(v.setoran),
            parseFloat(v.net_sales) - parseFloat(v.setoran),
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
      "OMSET PENJUALAN",
      headerPdf({
        title: "OMSET PENJUALAN",
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
    toExcel("LAPORAN OMSET PENJUALAN", `${this.props.startDate} - ${this.props.endDate}`, header, this.handleContent("excel"), this.handleFooter(), EXTENSION.XLXS);
    this.props.dispatch(ModalToggle(false));
  }
  render() {
    console.log(this.props.sale_omsetReportExcel);
    return <ExportCommon modalType="formSaleOmsetExcel" isPdf={true} callbackPdf={() => this.printPdf()} isExcel={true} callbackExcel={() => this.printExcel()} />;
  }
}

const mapStateToProps = (state) => {
  return {
    sale_omsetReportExcel: state.saleOmsetReducer.report_excel,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(SaleOmsetReportExcel);
