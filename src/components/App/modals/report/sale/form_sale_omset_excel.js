import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalHeader } from "reactstrap";
import { toRp, to_pdf } from "helper";
import imgExcel from "assets/xls.png";
import imgPdf from "assets/pdf.png";
import moment from "moment";
import XLSX from "xlsx";
import { headerPdf } from "../../../../../helper";
class SaleOmsetReportExcel extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleView = this.handleView.bind(this);
    this.printDocument = this.printDocument.bind(this);
    this.state = {
      title: "",
      jenis: "",
      type: "",
      view: false,
      error: {
        title: "",
        jenis: "",
        type: "",
      },
    };
  }
  handleView = (e) => {
    e.preventDefault();
    this.setState({
      view: !this.state.view,
    });
  };
  toggle = (e) => {
    e.preventDefault();
    this.props.dispatch(ModalToggle(false));
  };
  printDocument = (e) => {
    e.preventDefault();
    const headers = [["No", "Tanggal", "Omset Kotor", "Diskon Trx", "Diskon Item", "Tunai", "Non Tunai", "Net Sales", "Setoran", "Selisih"]];
    let data =
      typeof this.props.sale_omsetReportExcel.data === "object"
        ? this.props.sale_omsetReportExcel.data.map((v, i) => [
            i + 1,
            moment(v.tanggal).format("YYYY-MM-DD"),
            parseFloat(v.gross_sales),
            parseFloat(v.diskon_trx),
            parseFloat(v.diskon_item),
            parseFloat(v.tunai),
            parseFloat(v.non_tunai),
            parseFloat(v.net_sales),
            parseFloat(v.setoran),
            parseFloat(v.net_sales) - parseFloat(v.setoran),
          ])
        : "";
    // data +=["TOTAL","","","","","","","","",tprice];
    to_pdf(
      "OMSET_PENJUALAN",
      headerPdf({
        title: "OMSET PENJUALAN",
        dateFrom: this.props.startDate,
        dateTo: this.props.endDate,
      }),
      headers,
      data
      // footer
    );
    this.toggle(e);
  };
  printDocumentXLsx = (e, param) => {
    e.preventDefault();

    let header = [
      ["LAPORAN OMSET PENJUALAN"],
      ["PERIODE : " + this.props.startDate + " - " + this.props.endDate + ""],
      [""],
      ["Tanggal", "Omset Kotor", "Diskon Trx", "Diskon Item", "Tunai", "Non Tunai", "Net Sales", "Setoran", "Selisih"],
    ];
    let raw =
      typeof this.props.sale_omsetReportExcel.data === "object"
        ? this.props.sale_omsetReportExcel.data.map((v, i) => [
            moment(v.tanggal).format("YYYY-MM-DD"),
            parseFloat(v.gross_sales),
            parseFloat(v.diskon_trx),
            parseFloat(v.diskon_item),
            parseFloat(v.tunai),
            parseFloat(v.non_tunai),
            parseFloat(v.net_sales),
            parseFloat(v.setoran),
            parseFloat(v.net_sales) - parseFloat(v.setoran),
          ])
        : "";

    let body = header.concat(raw);

    let data = body;
    let ws = XLSX.utils.json_to_sheet(data, { skipHeader: true });

    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
    let exportFileName = `Laporan__Omset_Penjualan_${moment(new Date()).format("YYYYMMDDHHMMss")}.${param === "csv" ? `csv` : `xlsx`}`;
    XLSX.writeFile(wb, exportFileName, {
      type: "file",
      bookType: param === "csv" ? "csv" : "xlsx",
    });

    this.toggle(e);
  };
  render() {
    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === "formSaleOmsetExcel"}
        size={"md"}
        // aria-labelledby="contained-modal-title-vcenter"
        centered
        // keyboard
      >
        <ModalHeader toggle={this.toggle}>Manage Export</ModalHeader>
        <ModalBody>
          {/* <button
            type="button"
            className="close"
            onClick={(e) => this.toggle(e)}
          >
            <span className="text-dark" aria-hidden="true">
              ×
            </span>
            <span className="sr-only">Close</span>
          </button> */}
          {/* <h3 className="text-center">Manage Export</h3> */}
          <div className="row mb-4">
            <div className="col-6">
              <div className="single-gallery--item">
                <div className="gallery-thumb">
                  <img src={imgPdf} alt=""></img>
                </div>
                <div className="gallery-text-area">
                  <div className="gallery-icon">
                    <button type="button" className="btn btn-circle btn-lg btn-danger" onClick={(e) => this.printDocument(e)}>
                      <i className="fa fa-print"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="single-gallery--item">
                <div className="gallery-thumb">
                  <img src={imgExcel} alt=""></img>
                </div>
                <div className="gallery-text-area">
                  <div className="gallery-icon">
                    <button type="button" className="btn btn-circle btn-lg btn-success" onClick={(e) => this.printDocumentXLsx(e, "xlsx")}>
                      <i className="fa fa-print"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </WrapperModal>
    );
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
