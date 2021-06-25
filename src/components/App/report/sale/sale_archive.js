import React, { Component } from "react";
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import moment from "moment";
import Select from "react-select";
import Paginationq, { toRp, CapitalizeEachWord } from "helper";
import { FetchReportSale } from "redux/actions/sale/sale.action";
import {
  deleteReportSale,
  FetchReportDetailSale,
  FetchReportSaleExcel,
  FetchNotaReceipt,
} from "redux/actions/sale/sale.action";
import DetailSaleReport from "../../modals/report/sale/detail_sale_report";
import Otorisasi from "../../modals/otorisasi.modal";
import SaleReportExcel from "../../modals/report/sale/form_sale_excel";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
// import {HEADERS} from 'redux/actions/_constants'
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import { Link } from "react-router-dom";
import {
  dateRange,
  generateNo,
  getStorage,
  handleDataSelect,
  isEmptyOrUndefined,
  setStorage,
  swallOption,
} from "../../../../helper";
import LokasiCommon from "../../common/LokasiCommon";
import SelectCommon from "../../common/SelectCommon";
import { loading } from "../../../../redux/actions/handleHttp";
class SaleArchive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      where_data: "",
      type_data: [
        { kode: "", value: "Semua Tipe" },
        { kode: "0", value: "Tunai" },
        { kode: "1", value: "Non Tunai" },
        { kode: "2", value: "Gabungan" },
        { kode: "3", value: "Void" },
      ],
      type: "",
      status_data: [
        { kode: "", value: "Semua Status" },
        { kode: "0", value: "Belum Lunas" },
        { kode: "1", value: "Lunas" },
      ],
      status: "",
      lokasi: "",
      any: "",
      id_trx: "",
      prevLoc: [],
      startDate: moment(new Date()).format("yyyy-MM-DD"),
      endDate: moment(new Date()).format("yyyy-MM-DD"),
      isModalDetail: false,
      isModalExcel: false,
      isModalOtorisasi: false,
      totalExcel: 0,
      page: 1,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.onDone = this.onDone.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
  }

  onDone(id, id_trx) {
    this.props.dispatch(
      deleteReportSale({ id: id, id_trx: id_trx, where: this.state.where_data })
    );
    this.setState({
      id_trx: "",
    });
  }

  componentWillUnmount() {
    this.setState({
      isModalDetail: false,
      isModalExcel: false,
      isModalOtorisasi: false,
    });
  }
  componentWillMount() {
    this.handleService();
  }

  handleService(page = 1) {
    const { startDate, endDate, lokasi, type, status, any } = this.state;
    let where = `page=${page}&datefrom=${startDate}&dateto=${endDate}`;
    if (isEmptyOrUndefined(lokasi)) where += `&lokasi=${lokasi}`;
    if (isEmptyOrUndefined(type)) where += `&type=${type}`;
    if (isEmptyOrUndefined(status)) where += `&status=${status}`;
    if (isEmptyOrUndefined(any)) where += `&q=${any}`;
    this.setState({ where_data: where });
    this.props.dispatch(FetchReportSale(where));
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  handleChangeSelect(state, res) {
    this.setState({ [state]: res.value });
    setTimeout(() => this.handleService(), 500);
  }

  handlePageChange(pageNumber) {
    this.handleService(pageNumber);
  }

  handleFetchModal(page) {
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType(page));
  }

  handleModal(e, page, param) {
    e.preventDefault();
    let state = {};
    if (page === "detailSaleReport") {
      Object.assign(state, { isModalDetail: true });
      this.props.dispatch(FetchReportDetailSale(param.kode));
    }
    if (page === "formSaleExcel") {
      Object.assign(state, { isModalExcel: true, totalExcel: param.total });
      this.props.dispatch(
        FetchReportSaleExcel(this.state.where_data, param.total, (percent) => {
          // Object.assign(state, { where_data: percent });
        })
      );
    }
    this.setState(state);
    // this.handleFetchModal(page);
  }

  handleDelete(e, id) {
    e.preventDefault();
    this.setState({
      id_trx: id,
    });
    swallOption("Data yang telah dihapus tidak bisa dikembalikan.", () => {
      this.setState({ isModalOtorisasi: true });
      this.handleFetchModal("modalOtorisasi");
    });
  }

  render() {
    const { last_page, per_page, current_page, data } = this.props.saleReport;
    const {
      omset,
      dis_item,
      dis_persen,
      dis_rp,
      kas_lain,
      gt,
      bayar,
      jml_kartu,
      charge,
      change,
      rounding,
      profit,
      hpp,
      total_tunai_all,
    } = this.props.totalPenjualan;
    let omset_per = 0;
    let profit_per = 0;
    let hpp_per = 0;
    let dis_item_per = 0;
    let dis_persen_per = 0;
    let dis_rp_per = 0;
    let kas_lain_per = 0;
    let gt_per = 0;
    let bayar_per = 0;
    let jml_kartu_per = 0;
    let charge_per = 0;
    let change_per = 0;
    let voucher_per = 0;
    let rounding_per = 0;
    let total_tunai = 0;
    let loadings;

    if (this.props.percent === "loading") {
      loadings = this.props.percent;
    } else if (this.props.percent > 0 && this.props.percent < 100) {
      loadings = this.props.percent + "%";
    } else {
      loadings = <i className="fa fa-print"></i>;
    }
    // load

    return (
      <Layout page="Laporan Arsip Penjualan">
        <div className="row" style={{ zoom: "90%" }}>
          <div className="col-6 col-xs-6 col-md-2">
            {dateRange((first, last) => {
              this.setState({ startDate: first, endDate: last });
              setTimeout(() => this.handleService(), 300);
            }, `${this.state.startDate} to ${this.state.endDate}`)}
          </div>
          <div className="col-6 col-xs-6 col-md-2">
            <LokasiCommon
              callback={(res) => this.handleChangeSelect("lokasi", res)}
              isAll={true}
            />
          </div>
          <div className="col-6 col-xs-6 col-md-2">
            <SelectCommon
              label="Tipe transaksi"
              options={handleDataSelect(this.state.type_data, "kode", "value")}
              callback={(res) => this.handleChangeSelect("type", res)}
            />
          </div>
          <div className="col-6 col-xs-6 col-md-2">
            <SelectCommon
              label="Status"
              options={handleDataSelect(
                this.state.status_data,
                "kode",
                "value"
              )}
              callback={(res) => this.handleChangeSelect("status", res)}
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
          <div className="col-md-1 text-right">
            <div className="form-group">
              <button
                style={{ marginTop: "28px", marginRight: "5px" }}
                className="btn btn-primary"
                onClick={
                  (e) =>
                    this.handleModal(e, "formSaleExcel", {
                      total: last_page * per_page,
                    })
                  // this.toggleModal(e, last_page * per_page, per_page)
                }
              >
                {loadings}
              </button>
            </div>
          </div>
        </div>

        <div style={{ overflowX: "auto", zoom: "90%" }}>
          <table className="table table-hover table-noborder">
            <thead className="bg-light">
              <tr>
                <th className="text-black middle nowrap" rowSpan="2" width="1%">
                  No
                </th>
                <th className="text-black middle nowrap" rowSpan="2" width="1%">
                  #
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Kd Trx
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Tanggal
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Jam
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Customer
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Kasir
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Sales
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Omset
                </th>
                <th
                  className="text-black middle nowrap text-center"
                  colSpan={3}
                >
                  Diskon
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Pajak
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  HPP
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Subtotal
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Profit
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Reg.Member
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Trx Lain
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Keterangan
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Grand Total
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Rounding
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Tunai
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Change
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Total Tunai
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Transfer
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Charge
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Nama Kartu
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Status
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Lokasi
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Jenis Trx
                </th>
              </tr>
              <tr>
                <th className="text-black middle nowrap text-center">Item</th>
                <th className="text-black middle nowrap text-center">
                  Total ( rp )
                </th>
                <th className="text-black middle nowrap text-center">
                  Total ( % )
                </th>
              </tr>
            </thead>
            {
              <tbody>
                {typeof data === "object" ? (
                  data.length > 0 ? (
                    data.map((v, i) => {
                      omset_per += parseFloat(v.omset);
                      profit_per += parseFloat(v.profit);
                      dis_item_per = dis_item_per + parseFloat(v.diskon_item);
                      dis_persen_per =
                        dis_persen_per + parseFloat(v.dis_persen);
                      dis_rp_per = dis_rp_per + parseFloat(v.dis_rp);
                      kas_lain_per = kas_lain_per + parseInt(v.kas_lain, 10);
                      gt_per = gt_per + parseFloat(v.gt);
                      bayar_per = bayar_per + parseInt(v.bayar, 10);
                      jml_kartu_per = jml_kartu_per + parseFloat(v.jml_kartu);
                      charge_per = charge_per + parseFloat(v.charge);
                      change_per = change_per + parseFloat(v.change);
                      voucher_per = voucher_per + parseInt(v.voucher, 10);
                      rounding_per = rounding_per + parseInt(v.rounding, 10);
                      hpp_per += parseFloat(v.hrg_beli);
                      total_tunai += parseFloat(v.bayar) - parseFloat(v.change);

                      return (
                        <tr key={i}>
                          <td className="middle nowrap text-center">
                            {generateNo(i, current_page)}
                          </td>
                          <td className="middle nowrap text-center">
                            <UncontrolledButtonDropdown>
                              <DropdownToggle caret></DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem
                                  onClick={
                                    (e) =>
                                      this.handleModal(e, "detailSaleReport", {
                                        kode: v.kd_trx,
                                      })
                                    // this.handleDetail(e, v.kd_trx)
                                  }
                                >
                                  Detail
                                </DropdownItem>
                                <DropdownItem
                                  onClick={(e) =>
                                    this.handleDelete(e, v.kd_trx)
                                  }
                                >
                                  Delete
                                </DropdownItem>
                                <DropdownItem
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.props.dispatch(
                                      FetchNotaReceipt(v.kd_trx)
                                    );
                                  }}
                                >
                                  Nota
                                </DropdownItem>
                                <Link to={`../print3ply/${v.kd_trx}`}>
                                  <DropdownItem>3ply</DropdownItem>
                                </Link>
                              </DropdownMenu>
                            </UncontrolledButtonDropdown>
                          </td>
                          <td className="middle nowrap">{v.kd_trx}</td>
                          <td className="middle nowrap">
                            {moment(v.tgl).format("yyyy/MM/DD")}
                          </td>
                          <td className="middle nowrap">
                            {moment(v.jam).format("hh:mm:ss")}
                          </td>
                          <td className="middle nowrap">{v.customer}</td>
                          <td className="middle nowrap">{v.nama}</td>
                          <td className="middle nowrap">{v.sales}</td>
                          <td className="middle nowrap text-right">
                            {toRp(parseFloat(v.omset))}
                          </td>
                          <td className="middle nowrap text-right">
                            {toRp(parseFloat(v.diskon_item))}
                          </td>
                          <td className="middle nowrap text-right">
                            {toRp(v.dis_rp)}
                          </td>
                          <td className="middle nowrap text-right">
                            {parseFloat(v.dis_persen).toFixed(2)}
                          </td>
                          <td className="middle nowrap text-right">
                            {toRp(v.hrg_jual * (parseFloat(v.tax) / 100))}
                          </td>
                          <td className="middle nowrap text-right">
                            {toRp(parseFloat(v.hrg_beli))}
                          </td>
                          <td className="middle nowrap text-right">
                            {toRp(parseFloat(v.hrg_jual))}
                          </td>
                          <td className="middle nowrap text-right">
                            {toRp(parseFloat(v.profit))}
                          </td>
                          <td className="middle nowrap">
                            {v.regmember ? v.regmember : "-"}
                          </td>
                          <td className="middle nowrap">{v.kas_lain}</td>
                          <td className="middle nowrap">{v.ket_kas_lain}</td>
                          <td className="middle nowrap text-right">
                            {toRp(parseFloat(v.gt))}
                          </td>
                          <td className="middle nowrap text-right">
                            {toRp(parseFloat(v.rounding))}
                          </td>
                          <td className="middle nowrap text-right">
                            {toRp(parseFloat(v.bayar))}
                          </td>
                          <td className="middle nowrap text-right">
                            {toRp(parseFloat(v.change))}
                          </td>
                          <td className="middle nowrap text-right">
                            {toRp(parseFloat(v.bayar) - parseFloat(v.change))}
                          </td>
                          <td className="middle nowrap text-right">
                            {toRp(parseFloat(v.jml_kartu))}
                          </td>
                          <td className="middle nowrap text-right">
                            {toRp(parseFloat(v.charge))}
                          </td>
                          <td className="middle nowrap">{v.kartu}</td>
                          <td className="middle nowrap">
                            {CapitalizeEachWord(v.status)}
                          </td>
                          <td className="middle nowrap">{v.lokasi}</td>
                          <td className="middle nowrap">{v.jenis_trx}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td>No Data</td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td>No Data</td>
                  </tr>
                )}
              </tbody>
            }
            <tfoot>
              <tr style={{ backgroundColor: "#EEEEEE" }}>
                <td colSpan="8">Total perhalaman</td>
                <td className="text-right">{toRp(omset_per)}</td>
                <td className="text-right">{toRp(dis_item_per)}</td>
                <td className="text-right">{toRp(dis_rp_per)}</td>
                <td className="text-right">{dis_persen_per}</td>
                <td colSpan="1"></td>
                <td className="text-right">{toRp(hpp_per)}</td>
                <td colSpan="1"></td>
                <td className="text-right">{toRp(profit_per)}</td>
                <td colSpan="1"></td>
                <td className="text-right">{toRp(kas_lain_per)}</td>
                <td colSpan="1"></td>
                <td className="text-right">{toRp(gt_per)}</td>
                <td className="text-right">{toRp(rounding_per)}</td>
                <td className="text-right">{toRp(bayar_per)}</td>
                <td className="text-right">{toRp(change_per)}</td>
                <td className="text-right">{toRp(total_tunai)}</td>
                <td className="text-right">{toRp(jml_kartu_per)}</td>
                <td className="text-right">{toRp(charge_per)}</td>
                <td colSpan="4"></td>
              </tr>
              <tr style={{ backgroundColor: "#EEEEEE" }}>
                <td colSpan="8">Total keseluruhan</td>
                <td className="text-right">{toRp(omset)}</td>
                <td className="text-right">
                  {toRp(dis_item === null ? 0 : dis_item.toFixed(0))}
                </td>
                <td className="text-right">
                  {toRp(dis_rp === null ? 0 : dis_rp.toFixed(0))}
                </td>
                <td className="text-right">
                  {dis_persen === null ? 0 : dis_persen.toFixed(0)}
                </td>
                <td colSpan="1"></td>
                <td className="text-right">
                  {hpp === undefined && hpp === "" ? 0 : toRp(hpp)}
                </td>
                <td colSpan="1"></td>
                <td className="text-right">
                  {profit === undefined && profit === "" ? 0 : toRp(profit)}
                </td>
                <td colSpan="1"></td>
                <td className="text-right">{toRp(kas_lain)}</td>
                <td colSpan="1"></td>
                <td className="text-right">{toRp(gt)}</td>
                <td className="text-right">{toRp(rounding)}</td>
                <td className="text-right">{toRp(bayar)}</td>
                <td className="text-right">{toRp(change)}</td>
                <td className="text-right">{toRp(total_tunai_all)}</td>

                <td className="text-right">{toRp(jml_kartu)}</td>
                <td className="text-right">{toRp(charge)}</td>
                <td colSpan="4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div style={{ marginTop: "20px", float: "right", zoom: "90%" }}>
          <Paginationq
            current_page={parseInt(current_page, 10)}
            per_page={parseInt(per_page, 10)}
            total={parseInt(per_page * last_page, 10)}
            callback={this.handlePageChange.bind(this)}
          />
        </div>

        {this.props.isOpen && this.state.isModalDetail ? (
          <DetailSaleReport detailSale={this.props.detailSale} />
        ) : null}
        {this.props.isOpen && this.state.isModalExcel ? (
          <SaleReportExcel
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            location={this.state.location}
            totalPenjualan={this.props.totalPenjualan}
            totalPenjualanExcel={this.props.totalPenjualanExcel}
            totalRow={this.state.totalExcel}
          />
        ) : null}
        {this.props.isOpen && this.state.isModalOtorisasi ? (
          <Otorisasi
            datum={{
              module: "arsip penjualan",
              aksi: "delete",
              id_trx: this.state.id_trx,
            }}
            onDone={(id, kd_trx) => {
              this.onDone(id, kd_trx);
            }}
          />
        ) : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    saleReport: state.saleReducer.report,
    totalPenjualan: state.saleReducer.total_penjualan,
    saleReportExcel: state.saleReducer.report_excel,
    totalPenjualanExcel: state.saleReducer.total_penjualan_excel,
    isLoadingReport: state.saleReducer.isLoadingReport,
    detailSale: state.saleReducer.dataDetail,
    isLoadingDetail: state.saleReducer.isLoadingDetail,
    percent: state.saleReducer.percent,
    auth: state.auth,
    isOpen: state.modalReducer,
  };
};

export default connect(mapStateToProps)(SaleArchive);
