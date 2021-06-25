import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import moment from "moment";
import { to_pdf } from "helper";
import "jspdf-autotable";
import ExportCommon from "../../../common/ExportCommon";
import { headerPdf, toExcel } from "../../../../../helper";

class SaleReturReportExcel extends Component {
  constructor(props) {
    super(props);
    this.printExcel = this.printExcel.bind(this);
    this.printPdf = this.printPdf.bind(this);
  }

  handleHeader() {
    return ["KODE TRANSAKSI", "TANGGAL", "NAMA", "NILAI RETUR", "DISKON ITEM"];
  }

  handleContent() {
    let props = [];
    if (this.props.sale_returReportExcel.data !== undefined) {
      if (this.props.sale_returReportExcel.data.length > 0) {
        this.props.sale_returReportExcel.data.map((v) => {
          props.push([
            v.kd_trx,
            moment(v.tgl).format("DD-MM-YYYY"),
            v.nama,
            v.nilai_retur,
            v.diskon_item,
          ]);
        });
      }
    }
    return props;
  }

  printPdf() {
    const headers = [this.handleHeader()];
    to_pdf(
      "RETUR_PENJUALAN",
      headerPdf({
        title: "RETUR PENJUALAN",
        dateFrom: this.props.startDate,
        dateTo: this.props.endDate,
      }),
      headers,
      this.handleContent()
    );
    this.props.dispatch(ModalToggle(false));
  }
  printExcel() {
    toExcel(
      "LAPORAN RETUR PENJUALAN",
      `${this.props.startDate} - ${this.props.endDate}`,
      this.handleHeader(),
      this.handleContent(),
      []
    );
    this.props.dispatch(ModalToggle(false));
  }
  render() {
    return (
      <div>
        <ExportCommon
          modalType="formSaleReturExcel"
          isPdf={true}
          callbackPdf={() => this.printPdf()}
          isExcel={true}
          callbackExcel={() => this.printExcel()}
        />
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
