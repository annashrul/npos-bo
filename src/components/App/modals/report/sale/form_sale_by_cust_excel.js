import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import ExportCommon from "../../../common/ExportCommon";
import { toExcel, headerPdf, toRp, to_pdf } from "../../../../../helper";
import { EXTENSION } from "../../../../../redux/actions/_constants";

class SaleByCustReportExcel extends Component {
  constructor(props) {
    super(props);
    this.printExcel = this.printExcel.bind(this);
    this.printPdf = this.printPdf.bind(this);
  }

  handleHeader() {
    return ["NO", "KODE CUST", "NAMA", "GROSS SALES", "DISKON ITEM", "DISKON TRX", "SERVICE", "QTY"];
  }

  handleContent(cek = "excel") {
    let props = [];
    let data = this.props.sale_by_custReportExcel.data;
    if (data !== undefined) {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          props.push([
            i + 1,
            data[i].kd_cust,
            data[i].nama,
            toRp(parseInt(data[i].gross_sales, 10)),
            toRp(parseInt(data[i].diskon_item, 10)),
            toRp(parseInt(data[i].diskon_trx, 10)),
            toRp(data[i].service),
            data[i].qty,
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
      "PENJUALAN BY CUSTOMER",
      headerPdf({
        title: "PENJUALAN BY CUSTOMER",
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
    toExcel("LAPORAN PENJUALAN BY CUSTOMER", `${this.props.startDate} - ${this.props.endDate}`, header, content, [], EXTENSION.XLXS);
    this.props.dispatch(ModalToggle(false));
  }
  render() {
    return (
      <div>
        <ExportCommon modalType="formSaleByCustExcel" isPdf={true} callbackPdf={() => this.printPdf()} isExcel={true} callbackExcel={() => this.printExcel()} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    sale_by_custReportExcel: state.sale_by_custReducer.report_excel,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(SaleByCustReportExcel);
