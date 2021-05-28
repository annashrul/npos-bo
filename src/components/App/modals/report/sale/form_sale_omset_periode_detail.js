import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody } from "reactstrap";
import { toRp, to_pdf } from "helper";
import moment from "moment";
import XLSX from "xlsx";
import { TabList, TabPanel, Tabs, Tab } from "react-tabs";

class SaleOmsetPeriodeReportExcel extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleView = this.handleView.bind(this);
    this.printDocument = this.printDocument.bind(this);
    this.state = {
      title: "",
      jenis: "",
      type: "",
      data_a: [
        {
          kd_brg: "1234a",
          nm_brg: "a1",
          omset: "1",
        },
        {
          kd_brg: "1234b",
          nm_brg: "a2",
          omset: "1",
        },
        {
          kd_brg: "1234c",
          nm_brg: "a3",
          omset: "1",
        },
      ],
      data_b: [
        {
          kd_brg: "1234a",
          nm_brg: "b1",
          omset: "1",
        },
        {
          kd_brg: "1234b",
          nm_brg: "b2",
          omset: "1",
        },
      ],
      data_c: [
        {
          kd_brg: "1234a",
          nm_brg: "c1",
          omset: "1",
        },
        {
          kd_brg: "1234b",
          nm_brg: "c2",
          omset: "1",
        },
      ],
      data_d: [
        {
          kd_brg: "1234a",
          nm_brg: "d1",
          omset: "1",
        },
        {
          kd_brg: "1234b",
          nm_brg: "d2",
          omset: "1",
        },
        {
          kd_brg: "1234c",
          nm_brg: "d3",
          omset: "1",
        },
      ],
      view: false,
      error: {
        title: "",
        jenis: "",
        type: "",
      },
    };
  }
  componentWillReceiveProps(nextProps) {
    if (
      typeof nextProps.dataDetail === "object" &&
      nextProps.dataDetail.top_brg_sebelum !== undefined
    ) {
      this.setState({
        data_a: nextProps.dataDetail.top_brg_sebelum,
      });
    }
    if (
      typeof nextProps.dataDetail === "object" &&
      nextProps.dataDetail.top_brg_sekarang !== undefined
    ) {
      this.setState({
        data_b: nextProps.dataDetail.top_brg_sekarang,
      });
    }
    if (
      typeof nextProps.dataDetail === "object" &&
      nextProps.dataDetail.top_value_sebelum !== undefined
    ) {
      this.setState({
        data_c: nextProps.dataDetail.top_value_sebelum,
      });
    }
    if (
      typeof nextProps.dataDetail === "object" &&
      nextProps.dataDetail.top_value_sekarang !== undefined
    ) {
      this.setState({
        data_d: nextProps.dataDetail.top_value_sekarang,
      });
    }
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
    let stringHtml = "";
    stringHtml +=
      '<div style="text-align:center>' +
      '<h3 align="center"><center>PERIODE : ' +
      this.props.startDate +
      " - " +
      this.props.endDate +
      "</center></h3>" +
      '<h3 align="center"><center>&nbsp;</center></h3>' +
      '<h3 style="text-align:center"><center>LAPORAN OMSET PERIODE</center></h3>' +
      "</div>";

    const headers = [
      [
        "Omset Bulan Lalu",
        "Transaksi Bulan Lalu",
        "Rata - Rata Transaksi Bulan Lalu Sale",
        "Omset Bulan Sekarang Sale",
        "Transaksi Bulan Sekarang Total",
        "Rata - Rata Transaksi Bulan Sekarang Item",
        "Pertumbuhan Trx",
        "Persentase",
      ],
    ];
    let data =
      typeof this.props.saleOmsetPeriodeReportExcel.data === "object"
        ? this.props.saleOmsetPeriodeReportExcel.data.map((v) => [
            toRp(parseInt(v.omset_sebelum, 10)),
            toRp(parseInt(v.transaksi_sebelum, 10)),
            toRp(parseInt(v.omset_sebelum / v.transaksi_sebelum, 10)),
            toRp(parseInt(v.omset_sekarang, 10)),
            toRp(parseInt(v.transaksi_sekarang, 10)),
            toRp(parseInt(v.omset_sekarang / v.transaksi_sekarang, 10)),
            toRp(parseInt(v.omset_sekarang - v.omset_sebelum, 10)),
            parseInt(
              ((v.omset_sekarang - v.omset_sebelum) / v.omset_sebelum) * 100,
              10
            ),
          ])
        : "";
    // data +=["TOTAL","","","","","","","","",tprice];
    to_pdf(
      "saleOmsetPeriode_",
      stringHtml,
      headers,
      data
      // footer
    );
    this.toggle(e);
  };
  printDocumentXLsx = (e, param) => {
    e.preventDefault();

    let ws = XLSX.utils.table_to_sheet(
      document.getElementById("laporan_sale_omset_periode")
    );
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    let exportFileName = `Laporan__Omset_Periode_${moment(new Date()).format(
      "YYYYMMDDHHMMss"
    )}.${param === "csv" ? `csv` : `xlsx`}`;
    XLSX.writeFile(wb, exportFileName, {
      type: "file",
      bookType: param === "csv" ? "csv" : "xlsx",
    });

    this.toggle(e);
  };
  render() {
    
    const columnStyle = {
      verticalAlign: "middle",
      textAlign: "center",
      whiteSpace: "nowrap",
    };
    return (
      <WrapperModal
        isOpen={
          this.props.isOpen &&
          this.props.type === "formSaleOmsetPeriodeExcelDetail"
        }
        size={"xl"}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        keyboard
      >
        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <button type="button" className="close">
              <span
                className="text-dark"
                aria-hidden="true"
                onClick={(e) => this.toggle(e)}
              >
                ×
              </span>
              <span className="sr-only">Close</span>
            </button>
            <br />
            <div className="row">
              <div className="col-12 col-xs-12 col-md-12">
                <div className="form-group">
                  <button
                    className="btn btn-primary"
                    onClick={(e) => this.printDocumentXLsx(e, "xlsx")}
                  >
                    <i className="fa fa-print" /> Export
                  </button>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-xs-12 col-md-12">
                <Tabs>
                  <TabList>
                    <Tab>Top by Qty</Tab>
                    <Tab>Top by Value</Tab>
                  </TabList>

                  <TabPanel>
                    <table className="table table-hover table-responsive">
                      <tbody>
                        <tr style={{ height: 53 }}>
                          <td
                            className="p-0 m-0"
                            style={{ border: "none" }}
                            colSpan={4}
                          >
                            <h4>Periode Bulan Lalu</h4>
                          </td>
                          <td style={{ width: "1%", border: "none" }}>
                            &nbsp;
                          </td>
                          <td
                            className="p-0 m-0"
                            style={{ border: "none" }}
                            colSpan={4}
                          >
                            <h4>Periode Bulan Sekarang</h4>
                          </td>
                        </tr>
                        <tr style={{ height: 18 }}>
                          <td
                            style={{
                              width: "11.1111%",
                              textAlign: "center",
                              height: 18,
                            }}
                            colSpan={4}
                          >
                            Top 100 Items By Qty
                          </td>
                          <td style={{ border: "none" }}>&nbsp;</td>
                          <td
                            style={{
                              width: "11.1111%",
                              textAlign: "center",
                              height: 18,
                            }}
                            colSpan={4}
                          >
                            Top 100 Items By Qty
                          </td>
                        </tr>
                        <tr style={{ height: 36 }}>
                          <td style={columnStyle}>
                            <strong>No</strong>
                          </td>
                          <td style={columnStyle}>
                            <strong>Kode Barang</strong>
                          </td>
                          <td style={columnStyle}>
                            <strong>Nama</strong>
                          </td>
                          <td style={columnStyle}>
                            <strong>Omset</strong>
                          </td>
                          <td style={{ border: "none" }}>&nbsp;</td>
                          <td style={columnStyle}>
                            <strong>No</strong>
                          </td>
                          <td style={columnStyle}>
                            <strong>Kode Barang</strong>
                          </td>
                          <td style={columnStyle}>
                            <strong>Nama</strong>
                          </td>
                          <td style={columnStyle}>
                            <strong>Omset</strong>
                          </td>
                        </tr>
                        {(() => {
                          const rows = [];
                          for (
                            let i = 0;
                            i <
                            (this.state.data_a.length > this.state.data_b.length
                              ? this.state.data_a.length
                              : this.state.data_b.length);
                            i++
                          ) {
                            rows.push(
                              <tr style={{ height: 18 }} key={i}>
                                <td>{i + 1}</td>
                                <td>
                                  {this.state.data_a[i] !== undefined &&
                                  this.state.data_a[i].kd_brg !== undefined
                                    ? this.state.data_a[i].kd_brg
                                    : ""}
                                </td>
                                <td>
                                  {this.state.data_a[i] !== undefined &&
                                  this.state.data_a[i].nm_brg !== undefined
                                    ? this.state.data_a[i].nm_brg
                                    : ""}
                                </td>
                                <td>
                                  {this.state.data_a[i] !== undefined &&
                                  this.state.data_a[i].omset !== undefined
                                    ? this.state.data_a[i].omset
                                    : ""}
                                </td>
                                <td style={{ border: "none" }}>&nbsp;</td>
                                <td>{i + 1}</td>
                                <td>
                                  {this.state.data_b[i] !== undefined &&
                                  this.state.data_b[i].kd_brg
                                    ? this.state.data_b[i].kd_brg
                                    : ""}
                                </td>
                                <td>
                                  {this.state.data_b[i] !== undefined &&
                                  this.state.data_b[i].nm_brg
                                    ? this.state.data_b[i].nm_brg
                                    : ""}
                                </td>
                                <td>
                                  {this.state.data_b[i] !== undefined &&
                                  this.state.data_b[i].omset
                                    ? this.state.data_b[i].omset
                                    : ""}
                                </td>
                              </tr>
                            );
                          }
                          return rows;
                        })()}
                      </tbody>
                    </table>
                  </TabPanel>
                  <TabPanel>
                    <table className="table table-hover table-responsive">
                      <tbody>
                        <tr style={{ height: 53 }}>
                          <td
                            className="p-0 m-0"
                            style={{ border: "none" }}
                            colSpan={4}
                          >
                            <h4>Periode Bulan Lalu</h4>
                          </td>
                          <td style={{ width: "1%", border: "none" }}>
                            &nbsp;
                          </td>
                          <td
                            className="p-0 m-0"
                            style={{ border: "none" }}
                            colSpan={4}
                          >
                            <h4>Periode Bulan Sekarang</h4>
                          </td>
                        </tr>
                        <tr style={{ height: 18 }}>
                          <td
                            style={{
                              width: "11.1111%",
                              textAlign: "center",
                              height: 18,
                            }}
                            colSpan={4}
                          >
                            Top 100 Items By Value
                          </td>
                          <td style={{ border: "none" }}>&nbsp;</td>
                          <td
                            style={{
                              width: "11.1111%",
                              textAlign: "center",
                              height: 18,
                            }}
                            colSpan={4}
                          >
                            Top 100 Items By Value
                          </td>
                        </tr>
                        <tr style={{ height: 36 }}>
                          <td style={columnStyle}>
                            <strong>No</strong>
                          </td>
                          <td style={columnStyle}>
                            <strong>Kode Barang</strong>
                          </td>
                          <td style={columnStyle}>
                            <strong>Nama</strong>
                          </td>
                          <td style={columnStyle}>
                            <strong>Omset</strong>
                          </td>
                          <td style={{ border: "none" }}>&nbsp;</td>
                          <td style={columnStyle}>
                            <strong>No</strong>
                          </td>
                          <td style={columnStyle}>
                            <strong>Kode Barang</strong>
                          </td>
                          <td style={columnStyle}>
                            <strong>Nama</strong>
                          </td>
                          <td style={columnStyle}>
                            <strong>Omset</strong>
                          </td>
                        </tr>
                        {(() => {
                          const rows = [];
                          for (
                            let i = 0;
                            i <
                            (this.state.data_c.length > this.state.data_d.length
                              ? this.state.data_c.length
                              : this.state.data_d.length);
                            i++
                          ) {
                            rows.push(
                              <tr style={{ height: 18 }} key={i}>
                                <td>{i + 1}</td>
                                <td>
                                  {this.state.data_c[i] !== undefined &&
                                  this.state.data_c[i].kd_brg !== undefined
                                    ? this.state.data_c[i].kd_brg
                                    : ""}
                                </td>
                                <td>
                                  {this.state.data_c[i] !== undefined &&
                                  this.state.data_c[i].nm_brg !== undefined
                                    ? this.state.data_c[i].nm_brg
                                    : ""}
                                </td>
                                <td>
                                  {this.state.data_c[i] !== undefined &&
                                  this.state.data_c[i].omset !== undefined
                                    ? this.state.data_c[i].omset
                                    : ""}
                                </td>
                                <td style={{ border: "none" }}>&nbsp;</td>
                                <td>{i + 1}</td>
                                <td>
                                  {this.state.data_d[i] !== undefined &&
                                  this.state.data_d[i].kd_brg
                                    ? this.state.data_d[i].kd_brg
                                    : ""}
                                </td>
                                <td>
                                  {this.state.data_d[i] !== undefined &&
                                  this.state.data_d[i].nm_brg
                                    ? this.state.data_d[i].nm_brg
                                    : ""}
                                </td>
                                <td>
                                  {this.state.data_d[i] !== undefined &&
                                  this.state.data_d[i].omset
                                    ? this.state.data_d[i].omset
                                    : ""}
                                </td>
                              </tr>
                            );
                          }
                          return rows;
                        })()}
                      </tbody>
                    </table>
                  </TabPanel>
                </Tabs>
              </div>
            </div>
            <table
              className="table table-hover table-responsive d-none"
              id="laporan_sale_omset_periode"
            >
              <tbody>
                <tr style={{ height: 53 }}>
                  <td
                    className="p-0 m-0"
                    style={{ border: "none" }}
                    colSpan={4}
                  >
                    <h4>Periode Bulan Lalu</h4>
                  </td>
                  <td style={{ width: "1%", border: "none" }}>&nbsp;</td>
                  <td
                    className="p-0 m-0"
                    style={{ border: "none" }}
                    colSpan={4}
                  >
                    <h4>Periode Bulan Sekarang</h4>
                  </td>
                </tr>
                <tr style={{ height: 18 }}>
                  <td
                    style={{
                      width: "11.1111%",
                      textAlign: "center",
                      height: 18,
                    }}
                    colSpan={4}
                  >
                    Top 100 Items By Qty
                  </td>
                  <td style={{ border: "none" }}>&nbsp;</td>
                  <td
                    style={{
                      width: "11.1111%",
                      textAlign: "center",
                      height: 18,
                    }}
                    colSpan={4}
                  >
                    Top 100 Items By Qty
                  </td>
                </tr>
                <tr style={{ height: 36 }}>
                  <td style={columnStyle}>
                    <strong>No</strong>
                  </td>
                  <td style={columnStyle}>
                    <strong>Kode Barang</strong>
                  </td>
                  <td style={columnStyle}>
                    <strong>Nama</strong>
                  </td>
                  <td style={columnStyle}>
                    <strong>Omset</strong>
                  </td>
                  <td style={{ border: "none" }}>&nbsp;</td>
                  <td style={columnStyle}>
                    <strong>No</strong>
                  </td>
                  <td style={columnStyle}>
                    <strong>Kode Barang</strong>
                  </td>
                  <td style={columnStyle}>
                    <strong>Nama</strong>
                  </td>
                  <td style={columnStyle}>
                    <strong>Omset</strong>
                  </td>
                </tr>
                {(() => {
                  const rows = [];
                  for (
                    let i = 0;
                    i <
                    (this.state.data_a.length > this.state.data_b.length
                      ? this.state.data_a.length
                      : this.state.data_b.length);
                    i++
                  ) {
                    rows.push(
                      <tr style={{ height: 18 }} key={i}>
                        <td>{i + 1}</td>
                        <td>
                          {this.state.data_a[i] !== undefined &&
                          this.state.data_a[i].kd_brg !== undefined
                            ? this.state.data_a[i].kd_brg
                            : ""}
                        </td>
                        <td>
                          {this.state.data_a[i] !== undefined &&
                          this.state.data_a[i].nm_brg !== undefined
                            ? this.state.data_a[i].nm_brg
                            : ""}
                        </td>
                        <td>
                          {this.state.data_a[i] !== undefined &&
                          this.state.data_a[i].omset !== undefined
                            ? this.state.data_a[i].omset
                            : ""}
                        </td>
                        <td style={{ border: "none" }}>&nbsp;</td>
                        <td>{i + 1}</td>
                        <td>
                          {this.state.data_b[i] !== undefined &&
                          this.state.data_b[i].kd_brg
                            ? this.state.data_b[i].kd_brg
                            : ""}
                        </td>
                        <td>
                          {this.state.data_b[i] !== undefined &&
                          this.state.data_b[i].nm_brg
                            ? this.state.data_b[i].nm_brg
                            : ""}
                        </td>
                        <td>
                          {this.state.data_b[i] !== undefined &&
                          this.state.data_b[i].omset
                            ? this.state.data_b[i].omset
                            : ""}
                        </td>
                      </tr>
                    );
                  }
                  return rows;
                })()}
                <tr style={{ height: 36 }}>
                  <td colSpan="9">&nbsp;</td>
                </tr>
                <tr style={{ height: 53 }}>
                  <td
                    className="p-0 m-0"
                    style={{ border: "none" }}
                    colSpan={4}
                  >
                    <h4>Periode Bulan Lalu</h4>
                  </td>
                  <td style={{ width: "1%", border: "none" }}>&nbsp;</td>
                  <td
                    className="p-0 m-0"
                    style={{ border: "none" }}
                    colSpan={4}
                  >
                    <h4>Periode Bulan Sekarang</h4>
                  </td>
                </tr>
                <tr style={{ height: 18 }}>
                  <td
                    style={{
                      width: "11.1111%",
                      textAlign: "center",
                      height: 18,
                    }}
                    colSpan={4}
                  >
                    Top 100 Items By Value
                  </td>
                  <td style={{ border: "none" }}>&nbsp;</td>
                  <td
                    style={{
                      width: "11.1111%",
                      textAlign: "center",
                      height: 18,
                    }}
                    colSpan={4}
                  >
                    Top 100 Items By Value
                  </td>
                </tr>
                <tr style={{ height: 36 }}>
                  <td style={columnStyle}>
                    <strong>No</strong>
                  </td>
                  <td style={columnStyle}>
                    <strong>Kode Barang</strong>
                  </td>
                  <td style={columnStyle}>
                    <strong>Nama</strong>
                  </td>
                  <td style={columnStyle}>
                    <strong>Omset</strong>
                  </td>
                  <td style={{ border: "none" }}>&nbsp;</td>
                  <td style={columnStyle}>
                    <strong>No</strong>
                  </td>
                  <td style={columnStyle}>
                    <strong>Kode Barang</strong>
                  </td>
                  <td style={columnStyle}>
                    <strong>Nama</strong>
                  </td>
                  <td style={columnStyle}>
                    <strong>Omset</strong>
                  </td>
                </tr>
                {(() => {
                  const rows = [];
                  for (
                    let i = 0;
                    i <
                    (this.state.data_c.length > this.state.data_d.length
                      ? this.state.data_c.length
                      : this.state.data_d.length);
                    i++
                  ) {
                    rows.push(
                      <tr style={{ height: 18 }} key={i}>
                        <td>{i + 1}</td>
                        <td>
                          {this.state.data_c[i] !== undefined &&
                          this.state.data_c[i].kd_brg !== undefined
                            ? this.state.data_c[i].kd_brg
                            : ""}
                        </td>
                        <td>
                          {this.state.data_c[i] !== undefined &&
                          this.state.data_c[i].nm_brg !== undefined
                            ? this.state.data_c[i].nm_brg
                            : ""}
                        </td>
                        <td>
                          {this.state.data_c[i] !== undefined &&
                          this.state.data_c[i].omset !== undefined
                            ? this.state.data_c[i].omset
                            : ""}
                        </td>
                        <td style={{ border: "none" }}>&nbsp;</td>
                        <td>{i + 1}</td>
                        <td>
                          {this.state.data_d[i] !== undefined &&
                          this.state.data_d[i].kd_brg
                            ? this.state.data_d[i].kd_brg
                            : ""}
                        </td>
                        <td>
                          {this.state.data_d[i] !== undefined &&
                          this.state.data_d[i].nm_brg
                            ? this.state.data_d[i].nm_brg
                            : ""}
                        </td>
                        <td>
                          {this.state.data_d[i] !== undefined &&
                          this.state.data_d[i].omset
                            ? this.state.data_d[i].omset
                            : ""}
                        </td>
                      </tr>
                    );
                  }
                  return rows;
                })()}
              </tbody>
            </table>
          </ModalBody>
        </form>
      </WrapperModal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    saleOmsetPeriodeReportExcel: state.saleOmsetPeriodeReducer.report_excel,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(SaleOmsetPeriodeReportExcel);
