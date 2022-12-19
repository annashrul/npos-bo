import React, { Component } from "react";
import WrapperModal from "../_wrapper.modal";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ModalBody,
  ModalHeader,
  UncontrolledButtonDropdown,
} from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
// import DateRangePicker from "react-bootstrap-daterangepicker";
import { FetchHutangReportDetail } from "redux/actions/hutang/hutang.action";
import connect from "react-redux/es/connect/connect";
// import {rangeDate} from "helper";
import Paginationq from "helper";
import moment from "moment";
import { toRp } from "../../../../helper";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import imgExcel from "assets/xls.png";
import { Link } from "react-router-dom";
import Spinner from "../../../../Spinner";
import Swal from "sweetalert2";

class DetailSaleByProductReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: "",
      endDate: "",
      any: "",
      isExport: false,
    };
    this.toggle = this.toggle.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {}
  componentWillMount() {
    this.setState({
      startDate: this.props.startDate,
      endDate: this.props.endDate,
    });
  }
  // componentWillReceiveProps(nextprops){
  //
  //     this.setState({
  //         startDate:nextprops.startDate,
  //         endDate:nextprops.endDate,
  //     })

  // }
  toggle(e) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
  }
  toggleExport(e) {
    e.preventDefault();
    if (this.state.isExport === true) {
      this.checkingParameter(1);
    }
    this.setState({
      isExport: !this.state.isExport,
    });
  }

  handleSearch(e) {
    e.preventDefault();
    localStorage.setItem("any_hutang_report_detail", this.state.any);
    this.checkingParameter(1);
  }
  handlePageChange(pageNumber) {
    localStorage.setItem(
      "pageNumber_sale_by_product_report_detail",
      pageNumber
    );
    this.checkingParameter(pageNumber);
  }
  handleEvent = (event, picker) => {
    const awal = moment(picker.startDate._d).format("YYYY-MM-DD");
    const akhir = moment(picker.endDate._d).format("YYYY-MM-DD");
    localStorage.setItem("date_from_sale_by_product_report_detail", `${awal}`);
    localStorage.setItem("date_to_sale_by_product_report_detail", `${akhir}`);
    this.setState({
      startDate: awal,
      endDate: akhir,
    });

    this.props.dispatch(FetchHutangReportDetail(1, "", ""));
  };
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  handleExport(e, total) {
    e.preventDefault();
    this.setState({ isExport: true });
    let dateFrom = localStorage.getItem(
      "date_from_sale_by_product_report_detail"
    );
    let dateTo = localStorage.getItem("date_to_sale_by_product_report_detail");
    let kode = this.props.detail.id;

    this.props.dispatch(
      FetchHutangReportDetail(
        kode,
        1,
        dateFrom === null ? this.props.startDate : dateFrom,
        dateTo === null ? this.props.endDate : dateTo,
        total
      )
    );
  }
  checkingParameter(pageNumber) {
    let any = localStorage.any_hutang_report_detail;

    let where = "";
    if (any !== undefined && any !== null && any !== "") {
      where += `&q=${any}`;
    }
    this.props.dispatch(
      FetchHutangReportDetail(pageNumber, where, this.props.detail.id)
    );
  }

  handlePaymentSlip(e, title, image) {
    e.preventDefault();
    Swal.fire({
      title: "Bukti Pembayaran",
      text: title,
      imageUrl: image,
      imageAlt: title,
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    });
  }

  render() {
    const { data, last_page, per_page, current_page } =
      this.props.hutangReportDetail;
    const centerStyle = { verticalAlign: "middle", textAlign: "center" };
    return (
      <WrapperModal
        isOpen={
          this.props.isOpen && this.props.type === "detailHutangReportDetail"
        }
        size={this.state.isExport === false ? "xl" : "sm"}
      >
        <ModalHeader toggle={this.toggle}>Daftar Pembayaran Hutang</ModalHeader>
        {!this.props.isLoading ? (
          <ModalBody hidden={this.state.isExport === true}>
            <div className="row">
              <div className="col-6 col-xs-6 col-md-2">
                <div className="form-group">
                  <label>Cari</label>
                  <input
                    className="form-control"
                    type="text"
                    style={{ padding: "9px", fontWeight: "bolder" }}
                    name="any"
                    value={this.state.any}
                    onChange={(e) => this.handleChange(e)}
                  />
                </div>
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <div className="form-group">
                  <button
                    style={{ marginTop: "28px", marginRight: "5px" }}
                    className="btn btn-primary"
                    onClick={this.handleSearch}
                  >
                    <i className="fa fa-search" />
                  </button>
                </div>
              </div>
            </div>
            <table className="table">
              <tbody
                className="bg-transparent no-border"
                style={{ border: "none" }}
              >
                <tr>
                  {/* <th className="text-black" style={centerStyle}>id</th> */}
                  <th className="text-black" style={centerStyle}>
                    No Faktur Beli
                  </th>
                  <th className="text-black" style={centerStyle}>
                    Nama Toko
                  </th>
                  <th className="text-black" style={centerStyle}>
                    Supplier
                  </th>
                  <th className="text-black" style={centerStyle}>
                    Nilai Pembelian
                  </th>
                  <th className="text-black" style={centerStyle}>
                    Status
                  </th>
                  <th className="text-black" style={centerStyle}>
                    Tempo
                  </th>
                </tr>
                <tr>
                  {/* <th className="text-black" style={centerStyle}>{this.props.detail.id}</th> */}
                  <th className="text-black" style={centerStyle}>
                    {this.props.detail.id}
                  </th>
                  <th className="text-black" style={centerStyle}>
                    {this.props.detail.nama_toko}
                  </th>
                  <th className="text-black" style={centerStyle}>
                    {this.props.detail.supplier}
                  </th>
                  <th className="text-black" style={centerStyle}>
                    {toRp(parseInt(this.props.detail.nilai_pembelian, 10))}
                  </th>
                  <th className="text-black" style={centerStyle}>
                    {this.props.detail.status}
                  </th>
                  <th className="text-black" style={centerStyle}>
                    {moment(this.props.detail.tempo).format("YYYY-MM-DD")}
                  </th>
                </tr>
              </tbody>
            </table>
            <div style={{ overflowX: "auto" }}>
              <table className="table table-hover table-bordered">
                <thead className="bg-light">
                  <tr>
                    <th className="text-black" style={centerStyle}>
                      #
                    </th>
                    <th className="text-black" style={centerStyle}>
                      No Nota
                    </th>
                    {/* <th className="text-black" style={centerStyle}>Kode Cust</th> */}
                    <th className="text-black" style={centerStyle}>
                      Faktur Beli
                    </th>
                    <th className="text-black" style={centerStyle}>
                      Nama
                    </th>
                    {/* <th className="text-black" style={centerStyle}>Kasir</th> */}
                    <th className="text-black" style={centerStyle}>
                      Bulat
                    </th>
                    <th className="text-black" style={centerStyle}>
                      Cara Bayar
                    </th>
                    <th className="text-black" style={centerStyle}>
                      Jumlah
                    </th>
                    {/* <th className="text-black" style={centerStyle}>Nama Bank</th>
                                <th className="text-black" style={centerStyle}>No Giro</th> */}
                    <th className="text-black" style={centerStyle}>
                      Kasir
                    </th>
                    <th className="text-black" style={centerStyle}>
                      Tanggal Bayar
                    </th>
                    {/* <th className="text-black" style={centerStyle}>Tanggal Cair Giro</th> */}
                    <th className="text-black" style={centerStyle}>
                      Ket
                    </th>
                    <th className="text-black" style={centerStyle}>
                      Bukti
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {typeof data === "object"
                    ? data.length > 0
                      ? data.map((v, i) => {
                          return (
                            <tr key={i}>
                              <td style={centerStyle}>
                                <div className="btn-group">
                                  <UncontrolledButtonDropdown>
                                    <DropdownToggle caret>Aksi</DropdownToggle>
                                    <DropdownMenu>
                                      {/* <DropdownItem onClick={(e)=>this.handleDelete(e,v.no_nota)}>Delete</DropdownItem> */}
                                      <Link
                                        to={`../bayar_hutang3ply/${v.no_nota}|${this.props.detail.id}`}
                                      >
                                        <DropdownItem>3ply</DropdownItem>
                                      </Link>
                                    </DropdownMenu>
                                  </UncontrolledButtonDropdown>
                                </div>
                              </td>
                              <td style={centerStyle}>{v.no_nota}</td>
                              {/* <td style={centerStyle}>{v.kd_cust}</td> */}
                              <td style={centerStyle}>{v.fak_beli}</td>
                              <td style={centerStyle}>{v.nama}</td>
                              {/* <td style={centerStyle}>{v.kasir}</td> */}
                              <td style={centerStyle}>{v.bulat}</td>
                              <td style={centerStyle}>{v.cara_byr}</td>
                              <td style={centerStyle}>
                                {toRp(parseInt(v.jumlah, 10))}
                              </td>
                              {/* <td style={centerStyle}>{v.nm_bank}</td>
                                                <td style={centerStyle}>{v.nogiro}</td> */}
                              <td style={centerStyle}>{v.kasir}</td>
                              <td style={centerStyle}>
                                {moment(v.tgl_byr).format("YYYY-MM-DD")}
                              </td>
                              <td style={centerStyle}>{v.ket}</td>
                              <td style={centerStyle}>
                                <button
                                  className="badge badge-secondary"
                                  style={{ padding: "10px", fontSize: "1em" }}
                                  onClick={(event) =>
                                    this.handlePaymentSlip(
                                      event,
                                      v.no_nota,
                                      v.payment_slip
                                    )
                                  }
                                >
                                  <i className="fa fa-eye" /> Pembayaran
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      : "No data."
                    : "No data."}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: "20px", float: "right" }}>
              <Paginationq
                current_page={parseInt(current_page, 10)}
                per_page={parseInt(per_page, 10)}
                total={parseInt(last_page * per_page, 10)}
                callback={this.handlePageChange.bind(this)}
              />
            </div>
          </ModalBody>
        ) : (
          <Spinner />
        )}
        <ModalBody hidden={this.state.isExport === false}>
          {/* <div className="row">
                        <div className="col-6 offset-3"> */}
          <button
            type="button"
            className="btn btn-link"
            onClick={(e) => this.toggleExport(e)}
          >
            <i className="fa fa fa-angle-left"></i> Back
          </button>
          <div className="single-gallery--item mb-4">
            <div className="gallery-thumb">
              <img src={imgExcel} alt=""></img>
            </div>
            <div className="gallery-text-area">
              <div
                className="gallery-icon"
                onClick={(e) => this.toggleExport(e)}
              >
                <ReactHTMLTableToExcel
                  className="btn btn-circle btn-lg btn-success"
                  table={"laporan_product_detail"}
                  filename={"laporan_product_detail"}
                  sheet="laporan_product_detail"
                  buttonText={<i className="fa fa-print"></i>}
                ></ReactHTMLTableToExcel>
              </div>
            </div>
          </div>
          <table
            className="table table-hover table-bordered"
            id="laporan_product_detail"
            style={{ display: "none" }}
          >
            <thead className="bg-light">
              <tr>
                <th colSpan={8} className="text-center">
                  Laporan Product Detail
                </th>
              </tr>
              {/* <tr>
                                        <th colSpan={2} className="text-black" style={centerStyle}>Nama Barang</th>
                                        <th colSpan={2} className="text-black" style={centerStyle}>Qty</th>
                                        <th colSpan={2} className="text-black" style={centerStyle}>Gross Sale</th>
                                        <th colSpan={2} className="text-black" style={centerStyle}>Store</th>
                                    </tr>
                                    <tr>
                                        <th colSpan={2} className="text-black" style={centerStyle}>{this.props.detail.nm_brg}</th>
                                        <th colSpan={2} className="text-black" style={centerStyle}>{parseInt(this.props.detail.qty_jual,10)+" "+this.props.detail.satuan}</th>
                                        <th colSpan={2} className="text-black" style={centerStyle}>{toRp(parseInt(this.props.detail.gross_sales,10))}</th>
                                        <th colSpan={2} className="text-black" style={centerStyle}>{this.props.detail.toko}</th>
                                    </tr> */}
              <tr>
                <th colSpan={8}></th>
              </tr>
              <tr>
                <th className="text-black" style={centerStyle} rowSpan="2">
                  #
                </th>
                <th className="text-black" style={centerStyle} rowSpan="2">
                  No Nota
                </th>
                <th className="text-black" style={centerStyle} rowSpan="2">
                  Faktur Jual
                </th>
                <th className="text-black" style={centerStyle} rowSpan="2">
                  Tanggal Bayar
                </th>
                <th className="text-black" style={centerStyle} rowSpan="2">
                  Cara Bayar
                </th>
                <th className="text-black" style={centerStyle} rowSpan="2">
                  Jumlah
                </th>
                <th className="text-black" style={centerStyle} rowSpan="2">
                  nama Bank
                </th>
                <th className="text-black" style={centerStyle} rowSpan="2">
                  Jatuh Tempo
                </th>
                <th className="text-black" style={centerStyle} rowSpan="2">
                  No Giro
                </th>
                <th className="text-black" style={centerStyle} rowSpan="2">
                  Tanggal Cair Giro
                </th>
                <th className="text-black" style={centerStyle} rowSpan="2">
                  Nama
                </th>
                <th className="text-black" style={centerStyle} rowSpan="2">
                  kode Cust.
                </th>
                <th className="text-black" style={centerStyle} rowSpan="2">
                  Keterangan
                </th>
              </tr>
            </thead>
            <tbody>
              {typeof data === "object"
                ? data.length > 0
                  ? data.map((v, i) => {
                      return (
                        <tr key={i}>
                          <td style={centerStyle}>
                            <div className="btn-group">
                              <UncontrolledButtonDropdown>
                                <DropdownToggle caret>Aksi</DropdownToggle>
                                <DropdownMenu>
                                  {/* <DropdownItem onClick={(e)=>this.handleDetail(e,v.kd_trx)}>Detail</DropdownItem> */}
                                  {/* <DropdownItem onClick={(e)=>this.handleDelete(e,v.kd_trx)}>Delete</DropdownItem> */}
                                  <Link to={`../bayar_hutang3ply/${v.no_nota}`}>
                                    <DropdownItem>3ply</DropdownItem>
                                  </Link>
                                </DropdownMenu>
                              </UncontrolledButtonDropdown>
                            </div>
                          </td>
                          <td style={centerStyle}>{v.no_nota}</td>
                          <td style={centerStyle}>{v.fak_jual}</td>
                          <td style={centerStyle}>
                            {moment(v.tgl_byr).format("DD-MM-YYYY")}
                          </td>
                          <td style={centerStyle}>{v.cara_byr}</td>
                          <td style={centerStyle}>{v.jumlah}</td>
                          <td style={centerStyle}>{v.nm_bank}</td>
                          <td style={centerStyle}>
                            {moment(v.tgl_jatuh_tempo).format("DD-MM-YYYY")}
                          </td>
                          <td style={centerStyle}>{v.nogiro}</td>
                          <td style={centerStyle}>
                            {moment(v.tgl_cair_giro).format("DD-MM-YYYY")}
                          </td>
                          <td style={centerStyle}>{v.nama}</td>
                          <td style={centerStyle}>{v.kd_cust}</td>
                          <td style={centerStyle}>{v.ket}</td>
                        </tr>
                      );
                    })
                  : "No data."
                : "No data."}
            </tbody>
          </table>
          {/* </div>
                    </div> */}
        </ModalBody>
      </WrapperModal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    hutangReportDetail: state.hutangReducer.data_report_detail,
    isLoading: state.hutangReducer.isLoading,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(DetailSaleByProductReport);
