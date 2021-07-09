import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody } from "reactstrap";
import moment from "moment";
import { headerExcel, headerPdf, parseToRp, toDate, toExcel, toRp } from "../../../../../helper";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
// import jsPDF from 'jspdf';
import imgExcel from "assets/xls.png";
import imgPdf from "assets/pdf.png";
import "jspdf-autotable";
import { to_pdf } from "helper";
import ExportCommon from "../../../common/ExportCommon";
import { EXTENSION } from "../../../../../redux/actions/_constants";

class CashReportExcel extends Component {
  //   constructor(props) {
  //     super(props);
  //     this.toggle = this.toggle.bind(this);
  //     this.handleView = this.handleView.bind(this);
  //     this.printDocument = this.printDocument.bind(this);
  //     // this.handleSubmit = this.handleSubmit.bind(this);
  //     // this.handleChange = this.handleChange.bind(this);
  //     this.state = {
  //       title: "",
  //       jenis: "",
  //       type: "",
  //       view: false,
  //       error: {
  //         title: "",
  //         jenis: "",
  //         type: "",
  //       },
  //     };
  //   }
  //   handleView = (e) => {
  //     e.preventDefault();
  //     this.setState({
  //       view: !this.state.view,
  //     });
  //   };
  //   toggle = (e) => {
  //     e.preventDefault();
  //     const bool = !this.props.isOpen;
  //     this.props.dispatch(ModalToggle(bool));
  //   };
  //   printDocument = (e) => {
  //     e.preventDefault();
  //     let stringHtml = "";
  //     stringHtml +=
  //       '<h3 align="center"><center>TIPE : ' +
  //       (this.props.tipe === "" ? "SEMUA" : this.props.tipe.toUpperCase()) +
  //       "</center></h3>" +
  //       '<h3 align="center"><center>PERIODE : ' +
  //       this.props.startDate +
  //       " - " +
  //       this.props.endDate +
  //       "</center></h3>" +
  //       '<h3 align="center"><center>LOKASI : ' +
  //       (this.props.location === "" ? "SEMUA LOKASI" : this.props.location) +
  //       "</center></h3>" +
  //       '<h3 align="center"><center>KASSA : ' +
  //       (this.props.kassa === "" ? "SEMUA KASSA" : this.props.kassa) +
  //       "</center></h3>";
  //     // stringHtml+=
  //     // '<table style="border:0px;width:100%">'+
  //     // '<tbody>'+
  //     //     '<tr><td><h3>TIPE : ' + (this.props.tipe===''?'SEMUA':this.props.tipe.toUpperCase()) + '</h3></td></tr>'+
  //     //     '<tr><td><h3>PERIODER : ' + this.props.startDate + ' - ' + this.props.endDate + '</h3></td></tr>'+
  //     //     '<tr><td><h3>LOKASI : ' + (this.props.location===''?'SEMUA LOKASI':this.props.location) + '</h3></td></tr>'+
  //     //     '<tr><td><h3>KASSA : ' + (this.props.kassa===''?'SEMUA KASSA':this.props.kassa) + '</h3></td></tr>'+
  //     // '</tbody>'+
  //     // '</table>';
  //     // stringHtml+= '<h3 align="center"><center>PERIODE : '+this.props.startDate + ' - ' + this.props.endDate+'</center></h3>';
  //     // stringHtml+= '<h3 align="center"><center>LOKASI : '+this.props.location===''?'SEMUA LOKASI':this.props.location+'</center></h3>';
  //     // stringHtml+= '<h3 align="center"><center>KASSA : '+this.props.kassa===''?'SEMUA KASSA':this.props.kassa+'</center></h3>';

  //     const headers = [["No", "Tgl", "Kd Trx", "Keterangan", "Lokasi", "Kassa", "Kasir", "Tipe", "Jenis", "Jumlah"]];
  //     let data =
  //       typeof this.props.cashReportExcel.data === "object"
  //         ? this.props.cashReportExcel.data.map((v) => [1, moment(v.tgl).format("yyyy-MM-DD"), v.kd_trx, v.keterangan, v.lokasi, v.kassa, v.kasir, v.type, v.jenis, toRp(parseInt(v.jumlah, 10))])
  //         : "";
  //     // data +=["TOTAL","","","","","","","","",tprice];
  //     to_pdf(
  //       "kas_",
  //       stringHtml,
  //       headers,
  //       data
  //       // footer
  //     );
  //     this.toggle(e);
  //   };

  constructor(props) {
    super(props);
    this.printExcel = this.printExcel.bind(this);
    this.printPdf = this.printPdf.bind(this);
  }

  handleHeader() {
    return ["NO", "KODE KAS", "LOKASI", "KASSA", "KASIR", "TIPE", "JENIS", "JUMLAH", "KETERANGAN", "TANGGAL"];
  }

  handleContent(cek = "excel") {
    let data = this.props.cashReportExcel.data;
    let props = [];
    if (data !== undefined) {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let v = data[i];
          props.push([i + 1, v.kd_trx, v.lokasi, v.kassa, v.kasir, v.type, v.jenis, parseToRp(v.jumlah), v.keterangan, toDate(v.tgl)]);
          cek === "excel" && props[i].shift();
        }
      }
    }
    return props;
  }

  printPdf() {
    const headers = [this.handleHeader()];
    to_pdf(
      `KAS ${this.props.tipe}`.toUpperCase(),
      headerPdf({
        title: `KAS ${this.props.tipe}`.toUpperCase(),
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
    toExcel(`LAPORAN KAS ${this.props.tipe}`.toUpperCase(), `${this.props.startDate} - ${this.props.endDate}`, header, this.handleContent("excel"), [], EXTENSION.XLXS);
    this.props.dispatch(ModalToggle(false));
  }
  render() {
    return <ExportCommon modalType="formCashExcel" isPdf={true} callbackPdf={() => this.printPdf()} isExcel={true} callbackExcel={() => this.printExcel()} />;
  }
}

const mapStateToProps = (state) => {
  return {
    cashReportExcel: state.cashReducer.dataExcel,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(CashReportExcel);
