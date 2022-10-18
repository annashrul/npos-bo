import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import ExportCommon from "../../common/ExportCommon";
import { to_pdf, parseToRp, toExcel } from "../../../../helper";
import { EXTENSION } from "../../../../redux/actions/_constants";

class PurchaseBySupplierReportExcel extends Component {
  constructor(props) {
    super(props);
    this.printExcel = this.printExcel.bind(this);
    this.printPdf = this.printPdf.bind(this);
  }

  handleHeader() {
    return ["NO", "KODE", "NAMA", "TOTAL PEMBELIAN"];
  }

  handleContent(cek = "excel") {
    let data = this.props.purchase_by_supplierReportExcel.data;
    let props = [];
    if (data !== undefined) {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let v = data[i];
          props.push([i + 1, v.kode, v.nama, parseToRp(v.total_pembelian)]);
          cek === "excel" && props[i].shift();
        }
      }
    }
    return props;
  }

  printPdf() {
    const headers = [this.handleHeader()];
    let periode = `${this.props.startDate} - ${this.props.endDate}`;
    to_pdf("PEMBELIAN BY SUPPLIER", `LAPORAN PEMBELIAN BY SUPPLIER PERIODE ${periode} `, headers, this.handleContent("pdf"));
    this.props.dispatch(ModalToggle(false));
  }
  printExcel() {
    let header = this.handleHeader();
    header.shift();
    let periode = `${this.props.startDate} - ${this.props.endDate}`;
    toExcel("LAPORAN PEMBELIAN BY SUPPLIER", periode, header, this.handleContent("excel"), [], EXTENSION.XLXS);
    this.props.dispatch(ModalToggle(false));
  }

  render() {
    return <ExportCommon modalType="formPurchaseBySupplierExcel" isPdf={true} callbackPdf={() => this.printPdf()} isExcel={true} callbackExcel={() => this.printExcel()} />;
  }
}

const mapStateToProps = (state) => {
  return {
    purchase_by_supplierReportExcel: state.poReducer.pbs_data_excel,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(PurchaseBySupplierReportExcel);
