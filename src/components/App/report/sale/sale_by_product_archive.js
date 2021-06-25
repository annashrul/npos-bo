import React, { Component } from "react";
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import Select from "react-select";
import Paginationq from "helper";
import Preloader from "Preloader";
import { rangeDate, toRp } from "helper";
import { FetchReportSaleByProduct } from "redux/actions/sale/sale_by_product.action";
// import Swal from "sweetalert2";
import SaleByProductReportExcel from "components/App/modals/report/sale/form_sale_by_product_excel";
import {
  FetchReportDetailSaleByProduct,
  FetchReportSaleByProductExcel,
} from "redux/actions/sale/sale_by_product.action";
import DetailSaleByProductReport from "../../modals/report/sale/detail_sale_by_product_report";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
// import { HEADERS } from '../../../../redux/actions/_constants';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledButtonDropdown,
} from "reactstrap";
import {
  dateRange,
  generateNo,
  handleDataSelect,
  isEmptyOrUndefined,
} from "../../../../helper";
import SelectCommon from "../../common/SelectCommon";
import LokasiCommon from "../../common/LokasiCommon";

class SaleByProductArchive extends Component {
  constructor(props) {
    super(props);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.handleDetail = this.handleDetail.bind(this);
    this.state = {
      where_data: "",
      location: "",
      any: "",
      sort: "",
      startDate: moment(new Date()).format("yyyy-MM-DD"),
      endDate: moment(new Date()).format("yyyy-MM-DD"),
      isModalDetail: false,
      isModalExport: false,
      detail: {},
      sort_data: [
        { kode: "gross_sales|desc", value: "Penjualan Terbesar" },
        { kode: "gross_sales|asc", value: "Penjualan Terkecil" },
        { kode: "qty_jual|desc", value: "Qty Terbesar" },
        { kode: "qty_jual|asc", value: "Qty Terkecil" },
      ],
    };
  }
  componentWillUnmount() {
    this.setState({ isModalDetail: false, isModalExport: false });
  }

  componentWillMount() {
    this.handleService(1);
  }
  handlePageChange(pageNumber) {
    this.handleService(pageNumber);
  }
  handleDetail(
    e,
    kode,
    kd_brg,
    nm_brg,
    deskripsi,
    satuan,
    qty_jual,
    gross_sales,
    diskon_item,
    tax,
    service,
    toko,
    tgl
  ) {
    e.preventDefault();
    localStorage.setItem("kode_sale_by_product_report", kode);
    let dateFrom = localStorage.getItem("date_from_sale_by_product_report");
    let dateTo = localStorage.getItem("date_to_sale_by_product_report");
    this.setState({
      isModalDetail: true,
      detail: {
        kd_brg: kd_brg,
        nm_brg: nm_brg,
        deskripsi: deskripsi,
        satuan: satuan,
        qty_jual: qty_jual,
        gross_sales: gross_sales,
        diskon_item: diskon_item,
        tax: tax,
        service: service,
        toko: toko,
        tgl: tgl,
      },
    });

    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("detailSaleByProductReport"));
    this.props.dispatch(
      FetchReportDetailSaleByProduct(
        kode,
        1,
        dateFrom === null ? this.state.startDate : dateFrom,
        dateTo === null ? this.state.endDate : dateTo
      )
    );
  }
  toggleModal(e, total) {
    e.preventDefault();
    this.setState({ isModalExport: true });
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formSaleByProductExcel"));
    this.props.dispatch(
      FetchReportSaleByProductExcel(1, this.state.where_data, total)
    );
  }

  handleChangeSelect(state, val) {
    this.setState({ [state]: val.value });
    setTimeout(() => this.handleService(), 300);
  }

  handleService(page = 1) {
    const { startDate, endDate, location, sort, any } = this.state;
    let where = `page=${page}&datefrom=${startDate}&dateto=${endDate}`;
    if (isEmptyOrUndefined(location)) where += `&lokasi=${location}`;
    if (isEmptyOrUndefined(sort)) where += `&sort=${sort}`;
    if (isEmptyOrUndefined(any)) where += `&q=${any}`;
    this.setState({ where_data: where });
    this.props.dispatch(FetchReportSaleByProduct(where));
  }

  render() {
    const {
      // total,
      last_page,
      per_page,
      current_page,
      // from,
      // to,
      data,
    } = this.props.sale_by_productReport;

    return (
      <Layout page="Laporan Arsip Penjualan">
        <div className="row" style={{ zoom: "90%" }}>
          <div className="col-md-11">
            <div className="row">
              <div className="col-6 col-xs-6 col-md-3">
                {dateRange((first, last) => {
                  this.setState({ startDate: first, endDate: last });
                  setTimeout(() => this.handleService(), 300);
                }, `${this.state.startDate} to ${this.state.endDate}`)}
              </div>

              <div className="col-6 col-xs-6 col-md-3">
                <LokasiCommon
                  callback={(res) => this.handleChangeSelect("location", res)}
                  isAll={true}
                />
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <SelectCommon
                  label="Sort"
                  options={handleDataSelect(
                    this.state.sort_data,
                    "kode",
                    "value"
                  )}
                  callback={(res) => this.handleChangeSelect("sort", res)}
                />
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <label>Cari</label>
                <div className="input-group">
                  <input
                    type="search"
                    name="any"
                    className="form-control"
                    placeholder="tulis sesuatu disini"
                    value={this.state.any}
                    onChange={(e) => this.setState({ any: e.target.value })}
                    onKeyPress={(event) => {
                      if (event.key === "Enter") {
                        this.handleService();
                      }
                    }}
                  />
                  <span className="input-group-append">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={(e) => {
                        e.preventDefault();
                        this.handleService();
                      }}
                    >
                      <i className="fa fa-search" />
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-xs-12 col-md-1  text-right">
            <button
              style={{ marginTop: "28px" }}
              className="btn btn-primary"
              onClick={(e) =>
                this.toggleModal(e, last_page * per_page, per_page)
              }
            >
              <i className="fa fa-print" />
            </button>
          </div>

          <div className="col-md-12">
            <div style={{ overflowX: "auto" }}>
              <table className="table table-hover table-noborder">
                <thead className="bg-light">
                  <tr>
                    <th
                      className="text-black text-center middle nowrap"
                      width="1%"
                    >
                      No
                    </th>
                    <th
                      className="text-black text-center middle nowrap"
                      width="1%"
                    >
                      #
                    </th>
                    <th className="text-black middle nowrap">Kd Barang</th>
                    <th className="text-black middle nowrap">Nama</th>
                    <th className="text-black middle nowrap">Barcode</th>
                    <th className="text-black middle nowrap">Deskripsi</th>
                    <th className="text-black middle nowrap">Satuan</th>
                    <th className="text-black middle nowrap">Qty</th>
                    <th className="text-black middle nowrap">Gross Sales</th>
                    <th className="text-black middle nowrap">Diskon Item</th>
                    <th className="text-black middle nowrap">Tax</th>
                    <th className="text-black middle nowrap">Service</th>
                    {/* <th className="text-black middle nowrap">Location</th> */}
                    <th className="text-black middle nowrap">Store</th>
                    <th className="text-black middle nowrap">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {typeof data === "object" ? (
                    data.length > 0 ? (
                      data.map((v, i) => {
                        return (
                          <tr key={i}>
                            <td className="text-center middle nowrap">
                              {generateNo(i, current_page)}
                            </td>
                            <td className="text-center middle nowrap">
                              <UncontrolledButtonDropdown>
                                <DropdownToggle caret></DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem
                                    onClick={(e) =>
                                      this.handleDetail(
                                        e,
                                        btoa(v.barcode),
                                        v.kd_brg,
                                        v.nm_brg,
                                        v.deskripsi,
                                        v.satuan,
                                        v.qty_jual,
                                        v.gross_sales,
                                        v.diskon_item,
                                        v.tax,
                                        v.service,
                                        v.toko,
                                        v.tgl
                                      )
                                    }
                                  >
                                    Detail
                                  </DropdownItem>
                                </DropdownMenu>
                              </UncontrolledButtonDropdown>
                            </td>
                            <td className="middle nowrap">{v.kd_brg}</td>
                            <td className="middle nowrap">{v.nm_brg}</td>
                            <td className="middle nowrap">{v.barcode}</td>
                            <td className="middle nowrap">{v.deskripsi}</td>
                            <td className="middle nowrap">{v.satuan}</td>
                            <td className="middle nowrap text-right">
                              {parseInt(v.qty_jual, 10)}
                            </td>
                            <td className="middle nowrap text-right">
                              {toRp(parseInt(v.gross_sales, 10))}
                            </td>
                            <td className="middle nowrap text-right">
                              {v.diskon_item}
                            </td>
                            <td className="middle nowrap text-right">
                              {v.tax}
                            </td>
                            <td className="middle nowrap text-right">
                              {v.service}
                            </td>
                            {/* <td className="middle nowrap">{v.lokasi}</td> */}
                            <td className="middle nowrap">{v.toko}</td>
                            <td className="middle nowrap">
                              {moment(v.tgl).format("YYYY-MM-DD")}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={14}>No Data</td>
                      </tr>
                    )
                  ) : (
                    <tr>
                      <td colSpan={14}>No Data</td>
                    </tr>
                  )}
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
          </div>
        </div>
        {this.props.isOpen && this.state.isModalExport ? (
          <SaleByProductReportExcel
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            location={this.state.location}
          />
        ) : null}
        {this.props.isOpen && this.state.isModalDetail ? (
          <DetailSaleByProductReport
            detailSaleByProduct={this.props.detailSaleByProduct}
            detail={this.state.detail}
            startDate={
              localStorage.getItem("date_from_sale_by_product_report") === null
                ? this.state.startDate
                : localStorage.getItem("date_from_sale_by_product_report")
            }
            endDate={
              localStorage.getItem("date_to_sale_by_product_report") === null
                ? this.state.endDate
                : localStorage.getItem("date_to_sale_by_product_report")
            }
          />
        ) : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    sale_by_productReport: state.sale_by_productReducer.report,
    sale_by_productReportExcel: state.sale_by_productReducer.report_excel,
    totalPenjualanExcel: state.sale_by_productReducer.total_penjualan_excel,
    isLoadingReport: state.sale_by_productReducer.isLoadingReport,
    detailSaleByProduct: state.sale_by_productReducer.dataDetail,
    isLoadingDetail: state.sale_by_productReducer.isLoadingDetail,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(SaleByProductArchive);
