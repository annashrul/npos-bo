import React, { Component } from "react";

import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import { FetchReportSale, deleteReportSale, FetchReportDetailSale, FetchReportSaleExcel, FetchNotaReceipt } from "redux/actions/sale/sale.action";
import DetailSaleReport from "../../modals/report/sale/detail_sale_report";
import Otorisasi from "../../modals/otorisasi.modal";
import SaleReportExcel from "../../modals/report/sale/form_sale_excel";
import { CapitalizeEachWord, generateNo, getFetchWhere, getPeriode, noData, parseToRp, swallOption, toDate, float } from "../../../../helper";
import TableCommon from "../../common/TableCommon";
import ButtonActionCommon from "../../common/ButtonActionCommon";
import HeaderReportCommon from "../../common/HeaderReportCommon";
import { STATUS_ARSIP_PENJUALAN } from "../../../../helperStatus";
import { ModalToggle, ModalType } from "../../../../redux/actions/modal.action";
class SaleArchive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      where_data: "",
      type_data: [
        { value: "", label: "Semua" },
        { value: "0", label: "Tunai" },
        { value: "1", label: "Non Tunai" },
        { value: "2", label: "Gabungan" },
        { value: "3", label: "Void" },
      ],
      id_trx: "",
      isModalDetail: false,
      isModalExcel: false,
      isModalOtorisasi: false,
      totalExcel: 0,
      detail: {},
      periode: "",
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.onDone = this.onDone.bind(this);
    this.handleService = this.handleService.bind(this);
  }

  onDone(id, id_trx) {
    this.props.dispatch(deleteReportSale({ id: id, id_trx: id_trx, where: this.state.where_data }));
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

  handleService(res, page = 1) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      this.setState({ where_data: where });
      this.props.dispatch(FetchReportSale(where));
    }
  }

  handlePageChange(pageNumber) {
    this.handleService(this.state.where_data, pageNumber);
  }
  handleFetchModal(page) {
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType(page));
  }

  handleModal(page, param) {
    let whereState = this.state.where_data;
    let where = getFetchWhere(whereState);
    let periode = getPeriode(where.split("&"));
    let state = { periode: periode, where_data: where };
    if (page === "detail") {
      Object.assign(state, { isModalDetail: true, detail: param });
      this.props.dispatch(FetchReportDetailSale(param.kd_trx, where, true));
    } else {
      Object.assign(state, { isModalExcel: true, totalExcel: param.total });
      this.props.dispatch(FetchReportSaleExcel(where, param.total));
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

  render() {
    const startDate = this.state.periode.split("-")[0];
    const endDate = this.state.periode.split("-")[1];
    const { total, last_page, per_page, current_page, data } = this.props.saleReport;
    const { omset, dis_item, dis_persen, dis_rp, kas_lain, gt, bayar, jml_kartu, charge, change, rounding, profit, hpp, total_tunai_all } = this.props.totalPenjualan;

    let totalOmsetPerHalaman = 0;
    let totalProfitPerHalaman = 0;
    let totalHppPerHalaman = 0;
    let totalDiskonItemPerHalaman = 0;
    let totalDiskonPersenPerHalaman = 0;
    let totalDiskonRpPerHalaman = 0;
    let totalKasLainPerHalaman = 0;
    let totalGtPerHalaman = 0;
    let totalBayarPerHalaman = 0;
    let totalJumlahKartuPerHalaman = 0;
    let totalChargePerHalaman = 0;
    let totalChangePerHalaman = 0;
    let totalRoundingPerHalaman = 0;
    let totalTunaiPerHalaman = 0;

    const head = [
      { rowSpan: "2", label: "No", className: "text-center", width: "1%" },
      { rowSpan: "2", label: "#", className: "text-center", width: "1%" },
      { rowSpan: "2", label: "Kode transaksi" },
      { rowSpan: "2", label: "Tanggal" },
      { rowSpan: "2", label: "Jam" },
      { rowSpan: "2", label: "Lokasi" },
      { rowSpan: "2", label: "Status" },
      { rowSpan: "2", label: "Jenis" },
      { rowSpan: "2", label: "Customer" },
      { rowSpan: "2", label: "Kasir" },
      { rowSpan: "2", label: "Sales" },
      { rowSpan: "2", label: "Jatuh tempo" },
      { rowSpan: "2", label: "Omset" },
      { colSpan: "3", label: "Diskon" },
      { rowSpan: "2", label: "Pajak" },
      { rowSpan: "2", label: "HPP" },
      { rowSpan: "2", label: "Subtotal" },
      { rowSpan: "2", label: "Profit" },
      { rowSpan: "2", label: "Trx Lain" },
      { rowSpan: "2", label: "Grand Total" },
      { rowSpan: "2", label: "Tunai" },
      { rowSpan: "2", label: "Kembalian" },
      { rowSpan: "2", label: "Total tunai" },
      { rowSpan: "2", label: "Rounding" },
      { rowSpan: "2", label: "Transfer" },
      { rowSpan: "2", label: "Charge" },
      { rowSpan: "2", label: "Bank" },
      { rowSpan: "2", label: "Keterangan" },
    ];
    const rowSpan = [{ label: "Item" }, { label: "Total (rp)" }, { label: "Total (%)" }];
    return (
      <Layout page="Laporan Arsip Penjualan">
        <HeaderReportCommon
          pathName="ReportSale"
          col="col-md-2"
          isLocation={true}
          isOther={true}
          otherName="Jenis"
          otherState="type"
          otherData={this.state.type_data}
          isStatus={true}
          statusData={STATUS_ARSIP_PENJUALAN}
          callbackWhere={(res) => this.handleService(res)}
          callbackExcel={() => this.handleModal("formSaleExcel", { total: last_page * per_page })}
          excelData={this.props.download}
        />

        <TableCommon
          head={head}
          rowSpan={rowSpan}
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
                    totalOmsetPerHalaman += float(v.omset);
                    totalProfitPerHalaman += float(v.profit);
                    totalHppPerHalaman += float(v.hrg_beli);
                    totalDiskonItemPerHalaman += float(v.diskon_item);
                    totalDiskonPersenPerHalaman += float(v.dis_persen);
                    totalDiskonRpPerHalaman += float(v.dis_rp);
                    totalKasLainPerHalaman += float(v.kas_lain);
                    totalGtPerHalaman += float(v.gt);
                    totalBayarPerHalaman += float(v.bayar);
                    totalJumlahKartuPerHalaman += float(v.jml_kartu);
                    totalChargePerHalaman += float(v.charge);
                    totalChangePerHalaman += float(String(v.jenis_trx).toLowerCase() === "non tunai" ? 0 : v.change);
                    totalRoundingPerHalaman += float(v.rounding);
                    totalTunaiPerHalaman += v.jenis_trx === "Non Tunai" ? 0 : float(v.bayar) - float(v.change);
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">{generateNo(i, current_page)}</td>
                        <td className="middle nowrap text-center">
                          <ButtonActionCommon
                            action={[{ label: "Detail" }, { label: "Nota" }, { label: "3ply" }, { label: "Hapus" }]}
                            callback={(e) => {
                              if (e === 0) this.handleModal("detail", v);
                              if (e === 1) this.props.dispatch(FetchNotaReceipt(v.kd_trx));
                              if (e === 2) this.props.history.push(`../print3ply/${v.kd_trx}`);
                              if (e === 3) this.handleDelete(v.kd_trx);
                            }}
                          />
                        </td>
                        <td className="middle nowrap">{v.kd_trx}</td>
                        <td className="middle nowrap">{toDate(v.tgl)}</td>
                        <td className="middle nowrap">{toDate(v.jam, "/", true)}</td>
                        <td className="middle nowrap">{v.lokasi}</td>
                        <td className="middle nowrap">{CapitalizeEachWord(v.status)}</td>
                        <td className="middle nowrap">{v.jenis_trx}</td>
                        <td className="middle nowrap">{v.customer}</td>
                        <td className="middle nowrap">{v.nama}</td>
                        <td className="middle nowrap">{v.sales}</td>
                        <td className="middle nowrap">{v.jenis_trx === "Kredit" ? toDate(v.tempo) : "-"}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.omset)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.diskon_item)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.dis_rp)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.dis_persen)}</td>
                        <td className="middle nowrap text-right">{parseToRp(float(v.hrg_jual) * (float(v.tax) / 100))}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.hrg_beli)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.hrg_jual)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.profit)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.kas_lain)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.gt)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.bayar)}</td>
                        <td className="middle nowrap text-right">{parseToRp(String(v.jenis_trx).toLowerCase() === "non tunai" ? 0 : v.change)}</td>
                        <td className="middle nowrap text-right">{parseToRp(float(v.bayar) - (String(v.jenis_trx).toLowerCase() === "non tunai" ? 0 : float(v.change)))}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.rounding)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.jml_kartu)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.charge)}</td>
                        <td className="middle nowrap">{v.kartu}</td>
                        <td className="middle nowrap">{v.ket_kas_lain}</td>
                      </tr>
                    );
                  })
                : noData(head.length + rowSpan.length)
              : noData(head.length + rowSpan.length)
          }
          footer={[
            {
              data: [
                { colSpan: 12, label: "Total perhalaman", className: "text-left" },
                { colSpan: 1, label: parseToRp(totalOmsetPerHalaman) },
                { colSpan: 1, label: parseToRp(totalDiskonItemPerHalaman) },
                { colSpan: 1, label: parseToRp(totalDiskonRpPerHalaman) },
                { colSpan: 1, label: parseToRp(totalDiskonPersenPerHalaman) },
                { colSpan: 1, label: "" },
                { colSpan: 1, label: parseToRp(totalHppPerHalaman) },
                { colSpan: 1, label: "" },
                { colSpan: 1, label: parseToRp(totalProfitPerHalaman) },
                { colSpan: 1, label: parseToRp(totalKasLainPerHalaman) },
                { colSpan: 1, label: parseToRp(totalGtPerHalaman) },
                { colSpan: 1, label: parseToRp(totalBayarPerHalaman) },
                { colSpan: 1, label: parseToRp(totalChangePerHalaman) },
                { colSpan: 1, label: parseToRp(totalTunaiPerHalaman) },
                { colSpan: 1, label: parseToRp(totalRoundingPerHalaman) },
                { colSpan: 1, label: parseToRp(totalJumlahKartuPerHalaman) },
                { colSpan: 1, label: parseToRp(totalChargePerHalaman) },
                { colSpan: 2, label: "" },
              ],
            },
            {
              data: [
                {
                  colSpan: 12,
                  label: "Total keseluruhan",
                  className: "text-left",
                },
                { colSpan: 1, label: parseToRp(omset) },
                { colSpan: 1, label: parseToRp(dis_item) },
                { colSpan: 1, label: parseToRp(dis_rp) },
                { colSpan: 1, label: parseToRp(dis_persen) },
                { colSpan: 1, label: "" },
                { colSpan: 1, label: parseToRp(hpp) },
                { colSpan: 1, label: "" },
                { colSpan: 1, label: parseToRp(profit) },
                { colSpan: 1, label: parseToRp(kas_lain) },
                { colSpan: 1, label: parseToRp(gt) },
                { colSpan: 1, label: parseToRp(bayar) },
                { colSpan: 1, label: parseToRp(change) },
                { colSpan: 1, label: parseToRp(total_tunai_all) },
                { colSpan: 1, label: parseToRp(rounding) },
                { colSpan: 1, label: parseToRp(jml_kartu) },
                { colSpan: 1, label: parseToRp(charge) },
                { colSpan: 2, label: "" },
              ],
            },
          ]}
        />

        {this.props.isOpen && this.state.isModalDetail ? <DetailSaleReport detailSale={this.props.detailSale} detail={this.state.detail} /> : null}
        {this.props.isOpen && this.state.isModalExcel ? (
          <SaleReportExcel startDate={startDate} endDate={endDate} totalPenjualan={this.props.totalPenjualan} totalPenjualanExcel={this.props.totalPenjualanExcel} totalRow={this.state.totalExcel} />
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
    detailSale: state.saleReducer.dataDetail,
    download: state.saleReducer.download,
    auth: state.auth,
    isOpen: state.modalReducer,
  };
};

export default connect(mapStateToProps)(SaleArchive);
