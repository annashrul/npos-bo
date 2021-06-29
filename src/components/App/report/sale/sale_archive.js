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
import {
  dateRange,
  generateNo,
  getStorage,
  handleDataSelect,
  isEmptyOrUndefined,
  isProgress,
  noData,
  setStorage,
  swallOption,
  toDate,
} from "../../../../helper";
import LokasiCommon from "../../common/LokasiCommon";
import SelectCommon from "../../common/SelectCommon";
import TableCommon from "../../common/TableCommon";
import ButtonActionCommon from "../../common/ButtonActionCommon";

const dateFromStorage = "dateFromReportSaleArchive";
const dateToStorage = "dateToReportSaleArchive";
const locationStorage = "locationReportSaleArchive";
const typeStorage = "typeReportSaleArchive";
const statusStorage = "statusReportSaleArchive";
const anyStorage = "anyReportSaleArchive";

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
    this.handleSearch = this.handleSearch.bind(this);
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
    let getDateFrom = getStorage(dateFromStorage);
    let getDateTo = getStorage(dateToStorage);
    let getLocation = getStorage(locationStorage);
    let getType = getStorage(typeStorage);
    let getStatus = getStorage(statusStorage);
    let getAny = getStorage(anyStorage);

    let where = `page=${page}`;
    let state = {};

    if (isEmptyOrUndefined(getDateFrom) && isEmptyOrUndefined(getDateTo)) {
      where += `&datefrom=${getDateFrom}&dateto=${getDateTo}`;
      Object.assign(state, { startDate: getDateFrom, endDate: getDateTo });
    } else {
      where += `&datefrom=${this.state.startDate}&dateto=${this.state.endDate}`;
    }
    if (isEmptyOrUndefined(getLocation)) {
      where += `&lokasi=${getLocation}`;
      Object.assign(state, { lokasi: getLocation });
    }
    if (isEmptyOrUndefined(getType)) {
      where += `&type=${getType}`;
      Object.assign(state, { type: getType });
    }
    if (isEmptyOrUndefined(getStatus)) {
      where += `&status=${getStatus}`;
      Object.assign(state, { status: getStatus });
    }
    if (isEmptyOrUndefined(getAny)) {
      where += `&q=${getAny}`;
      Object.assign(state, { any: getAny });
    }
    Object.assign(state, { where_data: where });
    this.setState(state);
    this.props.dispatch(FetchReportSale(where));
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  handleChangeSelect(state, res) {
    if (state === "lokasi") setStorage(locationStorage, res.value);
    if (state === "type") setStorage(typeStorage, res.value);
    if (state === "status") setStorage(statusStorage, res.value);
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

  handleModal(page, param) {
    let state = {};
    if (page === "detail") {
      Object.assign(state, { isModalDetail: true });
      this.props.dispatch(FetchReportDetailSale(param.kode));
    }
    if (page === "formSaleExcel") {
      Object.assign(state, { isModalExcel: true, totalExcel: param.total });
      this.props.dispatch(
        FetchReportSaleExcel(this.state.where_data, param.total)
      );
    }
    this.setState(state);
  }

  handleDelete(id) {
    this.setState({
      id_trx: id,
    });
    swallOption("Data yang telah dihapus tidak bisa dikembalikan.", () => {
      this.setState({ isModalOtorisasi: true });
      this.handleFetchModal("modalOtorisasi");
    });
  }

  handleSearch(e) {
    e.preventDefault();
    setStorage(anyStorage, this.state.any);
    this.handleService(1);
  }

  render() {
    const { total, last_page, per_page, current_page, data } =
      this.props.saleReport;
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
    const head = [
      { rowSpan: "2", label: "No", className: "text-center", width: "1%" },
      { rowSpan: "2", label: "#", className: "text-center", width: "1%" },
      { rowSpan: "2", label: "Kd Trx" },
      { rowSpan: "2", label: "Tanggal" },
      { rowSpan: "2", label: "Jam" },
      { rowSpan: "2", label: "Customer" },
      { rowSpan: "2", label: "Kasir" },
      { rowSpan: "2", label: "Sales" },
      { rowSpan: "2", label: "Omset" },
      { colSpan: "3", label: "Diskon" },
      { rowSpan: "2", label: "Pajak" },
      { rowSpan: "2", label: "HPP" },
      { rowSpan: "2", label: "Subtotal" },
      { rowSpan: "2", label: "Profit" },
      { rowSpan: "2", label: "Reg.Member" },
      { rowSpan: "2", label: "Trx Lain" },
      { rowSpan: "2", label: "Keterangan" },
      { rowSpan: "2", label: "Grand Total" },
      { rowSpan: "2", label: "Rounding" },
      { rowSpan: "2", label: "Tunai" },
      { rowSpan: "2", label: "Change" },
      { rowSpan: "2", label: "Total Tunai" },
      { rowSpan: "2", label: "Transfer" },
      { rowSpan: "2", label: "Charge" },
      { rowSpan: "2", label: "Nama Kartu" },
      { rowSpan: "2", label: "Status" },
      { rowSpan: "2", label: "Lokasi" },
      { rowSpan: "2", label: "Jenis Trx" },
    ];
    return (
      <Layout page="Laporan Arsip Penjualan">
        <div className="row">
          <div className="col-6 col-xs-6 col-md-2">
            {dateRange((first, last) => {
              setStorage(dateFromStorage, first);
              setStorage(dateToStorage, last);
              setTimeout(() => this.handleService(), 300);
            }, `${toDate(this.state.startDate)} - ${toDate(this.state.endDate)}`)}
          </div>
          <div className="col-6 col-xs-6 col-md-2">
            <LokasiCommon
              callback={(res) => this.handleChangeSelect("lokasi", res)}
              isAll={true}
              dataEdit={this.state.lokasi}
            />
          </div>
          <div className="col-6 col-xs-6 col-md-2">
            <SelectCommon
              label="Tipe transaksi"
              options={handleDataSelect(this.state.type_data, "kode", "value")}
              callback={(res) => this.handleChangeSelect("type", res)}
              dataEdit={this.state.type}
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
              dataEdit={this.state.status}
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
                onKeyPress={(e) => {
                  if (e.key === "Enter") this.handleSearch(e);
                }}
              />
              <span className="input-group-append">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={this.handleSearch}
                >
                  <i className="fa fa-search" />
                </button>
                <button
                  className="btn btn-primary ml-1"
                  onClick={(e) => {
                    this.handleModal("formSaleExcel", {
                      total: last_page * per_page,
                    });
                  }}
                >
                  {isProgress(this.props.percent)}
                </button>
              </span>
            </div>
          </div>
        </div>
        <TableCommon
          head={head}
          rowSpan={[
            { label: "Item" },
            { label: "Total (rp)" },
            { label: "Total (%)" },
          ]}
          meta={{
            total: total,
            current_page: current_page,
            per_page: per_page,
          }}
          current_page={current_page}
          callbackPage={this.handlePageChange.bind(this)}
          renderRow={
            typeof data === "object"
              ? data.length > 0
                ? data.map((v, i) => {
                    omset_per += parseFloat(v.omset);
                    profit_per += parseFloat(v.profit);
                    dis_item_per = dis_item_per + parseFloat(v.diskon_item);
                    dis_persen_per = dis_persen_per + parseFloat(v.dis_persen);
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
                          <ButtonActionCommon
                            action={[
                              { label: "Detail" },
                              { label: "Nota" },
                              { label: "3ply" },
                              { label: "Hapus" },
                            ]}
                            callback={(e) => {
                              if (e === 0)
                                this.handleModal("detail", { kode: v.kd_trx });
                              if (e === 1)
                                this.props.dispatch(FetchNotaReceipt(v.kd_trx));
                              if (e === 2)
                                this.props.history.push(
                                  `../print3ply/${v.kd_trx}`
                                );
                              if (e === 3) this.handleDelete(v.kd_trx);
                            }}
                          />
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
                          {toRp(parseFloat(v.dis_rp))}
                        </td>
                        <td className="middle nowrap text-right">
                          {toRp(parseFloat(v.dis_persen).toFixed(0))}
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
                : noData(head.length)
              : noData(head.length)
          }
          footer={[
            {
              data: [
                {
                  colSpan: 8,
                  label: "Total perhalaman",
                  className: "text-left",
                },
                { colSpan: 1, label: toRp(parseFloat(omset_per)) },
                {
                  colSpan: 1,
                  label: toRp(parseFloat(dis_item_per).toFixed(0)),
                },
                { colSpan: 1, label: toRp(parseFloat(dis_rp_per).toFixed(0)) },
                {
                  colSpan: 1,
                  label: toRp(parseFloat(dis_persen_per).toFixed(0)),
                },
                { colSpan: 1, label: "" },
                { colSpan: 1, label: toRp(parseFloat(hpp_per)) },
                { colSpan: 1, label: "" },
                { colSpan: 1, label: toRp(parseFloat(profit_per)) },
                { colSpan: 1, label: "" },
                { colSpan: 1, label: toRp(parseFloat(kas_lain_per)) },
                { colSpan: 1, label: "" },
                { colSpan: 1, label: toRp(parseFloat(gt_per)) },
                { colSpan: 1, label: toRp(parseFloat(rounding_per)) },
                { colSpan: 1, label: toRp(parseFloat(bayar_per)) },
                { colSpan: 1, label: toRp(parseFloat(change_per)) },
                { colSpan: 1, label: toRp(parseFloat(total_tunai)) },
                { colSpan: 1, label: toRp(parseFloat(jml_kartu_per)) },
                { colSpan: 1, label: toRp(parseFloat(charge_per)) },
                { colSpan: 4, label: "" },
              ],
            },
            {
              data: [
                {
                  colSpan: 8,
                  label: "Total keseluruhan",
                  className: "text-left",
                },
                { colSpan: 1, label: toRp(parseFloat(omset ? omset : 0)) },
                { colSpan: 1, label: toRp(parseFloat(dis_item).toFixed(0)) },
                { colSpan: 1, label: toRp(parseFloat(dis_rp).toFixed(0)) },
                { colSpan: 1, label: toRp(parseFloat(dis_persen).toFixed(0)) },
                { colSpan: 1, label: "" },
                { colSpan: 1, label: toRp(parseFloat(hpp)) },
                { colSpan: 1, label: "" },
                { colSpan: 1, label: toRp(parseFloat(profit)) },
                { colSpan: 1, label: "" },
                { colSpan: 1, label: toRp(parseFloat(kas_lain)) },
                { colSpan: 1, label: "" },
                { colSpan: 1, label: toRp(parseFloat(gt)) },
                { colSpan: 1, label: toRp(parseFloat(rounding)) },
                { colSpan: 1, label: toRp(parseFloat(bayar)) },
                { colSpan: 1, label: toRp(parseFloat(change)) },
                { colSpan: 1, label: toRp(parseFloat(total_tunai_all)) },
                { colSpan: 1, label: toRp(parseFloat(jml_kartu)) },
                { colSpan: 1, label: toRp(parseFloat(charge)) },
                { colSpan: 4, label: "" },
              ],
            },
          ]}
        />

        {this.props.isOpen && this.state.isModalDetail ? (
          <DetailSaleReport detailSale={this.props.detailSale} />
        ) : null}
        {this.props.isOpen && this.state.isModalExcel ? (
          <SaleReportExcel
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            location={this.state.lokasi}
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
            onDone={this.onDone}
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
