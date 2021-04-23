import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import { ModalBody } from "reactstrap";
import moment from "moment";
import { to_pdf, statusQ } from "helper";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
// import jsPDF from 'jspdf';
import imgExcel from "assets/xls.png";
import imgPdf from "assets/pdf.png";
import "jspdf-autotable";
import Swal from "sweetalert2";

class PackingReportExcel extends Component {
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
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
  };
  printDocument = (e) => {
    e.preventDefault();
    if (typeof this.props.packingReportExcel.data === "object") {
      if (this.props.packingReportExcel.data.length > 0) {
        let stringHtml = "";
        let loc_val =
          this.props.location === "" ? "SEMUA" : this.props.location;
        stringHtml +=
          '<div style="text-align:center>' +
          '<h3 align="center"><center>PERIODE : ' +
          this.props.startDate +
          " - " +
          this.props.endDate +
          "</center></h3>" +
          '<h3 align="center"><center>LOKASI : ' +
          loc_val +
          "</center></h3>" +
          '<h3 align="center"><center>&nbsp;</center></h3>' +
          '<h3 style="text-align:center"><center>LAPORAN PACKING</center></h3>' +
          "</div>";

        const headers = [
          [
            "Kode Packing.",
            "Tanggal",
            "Pengirim",
            "Lokasi Asal",
            "Lokasi Tujuan",
            "Nama Operator",
            "Status",
          ],
        ];
        let data = this.props.packingReportExcel.data.map((v) => [
          v.kd_packing,
          moment(v.tgl_packing).format("DD-MM-YYYY"),
          v.pengirim,
          v.nama_lokasi_asal,
          v.nama_lokasi_tujuan,
          v.nama_operator,
          v.status === "0"
            ? "Belum Packing"
            : v.status === "1"
            ? "Sudah Packing"
            : "",
        ]);

        // data +=["TOTAL","","","","","","","","",tprice];
        to_pdf(
          "packing_",
          stringHtml,
          headers,
          data
          // footer
        );
        this.toggle(e);
      } else {
        Swal.fire({
          allowOutsideClick: false,
          title: "Terjadi Kesalahan",
          text: "Data Tidak Tersedia",
        });
      }
    }
  };
  render() {
    const columnStyle = { verticalAlign: "middle", textAlign: "center" };
    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === "formPackingExcel"}
        size={this.state.view === false ? "md" : "xl"}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        keyboard
      >
        {/* <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Manage Export":"Update PackingExcel"}</ModalHeader> */}

        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <button type="button" className="close">
              <span aria-hidden="true" onClick={(e) => this.toggle(e)}>
                ×
              </span>
              <span className="sr-only">Close</span>
            </button>
            <h3 className="text-center">Manage Export</h3>
            <div className="row mb-4">
              {/* <div className="col-4">
                                <button type="button" className="btn btn-info btn-block" onClick={(e => this.handleView(e))}>VIEW</button>
                            </div> */}
              <div className="col-6">
                <div className="single-gallery--item">
                  <div className="gallery-thumb">
                    <img src={imgPdf} alt=""></img>
                  </div>
                  <div className="gallery-text-area">
                    <div className="gallery-icon">
                      <button
                        type="button"
                        className="btn btn-circle btn-lg btn-danger"
                        onClick={(e) => this.printDocument(e)}
                      >
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
                    <div
                      className="gallery-icon"
                      onClick={(e) => this.toggle(e)}
                    >
                      <ReactHTMLTableToExcel
                        className="btn btn-circle btn-lg btn-success"
                        table={"laporan_packing"}
                        filename={"laporan_packing"}
                        sheet="kas"
                        buttonText={<i className="fa fa-print"></i>}
                      ></ReactHTMLTableToExcel>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="row mt-4">
                            <div className="col-12">
                                <button type="button" className="btn btn-info float-right">CLOSE</button>
                            </div>
                        </div> */}
            {/* <hr></hr> */}
            <table
              className="table table-hover table-bordered table-responsive"
              id="laporan_packing"
              style={{
                display: this.state.view === false ? "none" : "inline-table",
              }}
            >
              <thead className="bg-light">
                <tr>
                  <th className="text-black" colSpan={7}>
                    {this.props.startDate} - {this.props.startDate}
                  </th>
                </tr>
                <tr>
                  <th className="text-black" colSpan={7}>
                    {this.props.location === ""
                      ? "SEMUA LOKASI"
                      : this.props.location}
                  </th>
                </tr>

                <tr>
                  <th className="text-black" rowSpan="2" style={columnStyle}>
                    Kode Packing.
                  </th>
                  <th className="text-black" rowSpan="2" style={columnStyle}>
                    Tanggal
                  </th>
                  <th className="text-black" rowSpan="2" style={columnStyle}>
                    Pengirim
                  </th>
                  <th className="text-black" rowSpan="2" style={columnStyle}>
                    Lokasi Asal
                  </th>
                  <th className="text-black" rowSpan="2" style={columnStyle}>
                    Lokasi Tujuan
                  </th>
                  <th className="text-black" rowSpan="2" style={columnStyle}>
                    Nama Operator
                  </th>
                  <th className="text-black" rowSpan="2" style={columnStyle}>
                    Status
                  </th>
                </tr>
                <tr></tr>
              </thead>
              {
                <tbody>
                  {typeof this.props.packingReportExcel.data === "object"
                    ? this.props.packingReportExcel.data.length > 0
                      ? this.props.packingReportExcel.data.map((v, i) => {
                          return (
                            <tr key={i}>
                              <td style={columnStyle}>{v.kd_packing}</td>
                              <td style={columnStyle}>
                                {moment(v.tgl_packing).format("DD-MM-YYYY")}
                              </td>
                              <td style={columnStyle}>{v.pengirim}</td>
                              <td style={columnStyle}>{v.nama_lokasi_asal}</td>
                              <td style={columnStyle}>
                                {v.nama_lokasi_tujuan}
                              </td>
                              <td style={columnStyle}>{v.nama_operator}</td>
                              <td style={columnStyle}>
                                {v.status === "0"
                                  ? statusQ("danger", "Belum Packing")
                                  : v.status === "1"
                                  ? statusQ("warning", "Sudah Packing")
                                  : ""}
                              </td>
                            </tr>
                          );
                        })
                      : "No data."
                    : "No data."}
                </tbody>
              }
            </table>
          </ModalBody>
        </form>
      </WrapperModal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    packingReportExcel: state.packingReducer.report_excel,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(PackingReportExcel);
