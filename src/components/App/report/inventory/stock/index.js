import React, { Component } from "react";
import Layout from "components/App/Layout";
import { FetchStockReport, FetchStockReportExcel } from "redux/actions/report/inventory/stock_report.action";
import connect from "react-redux/es/connect/connect";
import DetailStockReportSatuan from "components/App/modals/report/inventory/stock_report/detail_stock_report_satuan";
import StockReportExcel from "components/App/modals/report/inventory/stock_report/form_stock_report_excel";
import { FetchStockReportDetailSatuan } from "redux/actions/report/inventory/stock_report.action";
import { HEADERS } from "redux/actions/_constants";
import { CURRENT_DATE, float, generateNo, getFetchWhere, getPeriode, getStorage, isEmptyOrUndefined, noData, parseToRp } from "../../../../../helper";

import TableCommon from "../../../common/TableCommon";
import ButtonActionCommon from "../../../common/ButtonActionCommon";
import HeaderReportCommon from "../../../common/HeaderReportCommon";
import { STATUS_STOK } from "../../../../../helperStatus";

class InventoryReport extends Component {
  constructor(props) {
    super(props);
    this.handleModal = this.handleModal.bind(this);
    this.state = {
      where_data: `page=1&datefrom=${CURRENT_DATE}&dateto=${CURRENT_DATE}`,
      periode: "",
      bukaHarga: false,
      location: "",
      search_by_data: [
        { value: "br.kd_brg", label: "SKU Induk" },
        { value: "br.nm_brg", label: "Nama Barang" },
        { value: "br.nama_kel", label: "Kelompok Barang" },
        { value: "br.variasi", label: "Variasi" },
        { value: "br.group1", label: "Supplier" },
      ],
      isModalExcel: false,
      isModalDetail: false,
      detail: "",
    };
  }
  componentWillUnmount() {
    this.setState({ isModalDetail: false, isModalExcel: false });
  }

  handlePageChange(pageNumber) {
    this.handleService(this.state.where_data, pageNumber);
  }

  handleService(res, page = 1) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      let state = { where_data: where, bukaHarga: false, location: "" };
      let lokasi = getStorage("locationStorageReportStock");
      if (isEmptyOrUndefined(lokasi)) {
        Object.assign(state, { location: lokasi, bukaHarga: true });
      }
      this.setState(state);
      this.props.dispatch(FetchStockReport(where));
    }
  }

  handleModal(param, obj) {
    let whereState = this.state.where_data;
    let where = getFetchWhere(whereState);
    let periode = getPeriode(where.split("&"));
    let state = { periode: periode, where_data: where };

    if (param === "formSaleExcel") {
      Object.assign(state, { isModalExcel: true });
      this.props.dispatch(FetchStockReportExcel(1, where, obj.total));
    } else {
      if (this.state.location === "") {
        Object.assign(obj, { isLocation: false });
      } else {
        Object.assign(obj, { isLocation: true });
      }
      Object.assign(obj, { where_data: where });
      Object.assign(state, { isModalDetail: true, detail: obj });
      this.props.dispatch(FetchStockReportDetailSatuan(btoa(obj.kd_brg), where));
    }
    this.setState(state);
  }

  render() {
    const { per_page, last_page, current_page, data, total } = this.props.stockReport;
    const { total_harga_beli, total_harga_jual, total_harga_beli_qty, total_harga_jual_qty, total_stock_awal, total_stock_masuk, total_stock_keluar, total_stock_akhir, total_stock_penjualan } =
      this.props.total_stock;

    let total_stock_harga_beli_item_per = 0;
    let total_stock_harga_jual_item_per = 0;
    let total_stock_awal_per = 0;
    let total_stock_masuk_per = 0;
    let total_stock_keluar_per = 0;
    let total_stock_penjualan_per = 0;
    let total_stock_akhir_per = 0;
    let total_stock_harga_beli_per = 0;
    let total_stock_harga_jual_per = 0;

    const { bukaHarga, periode, search_by_data, location, detail, isModalExcel, isModalDetail } = this.state;
    const startDate = periode.split("-")[0];
    const endDate = periode.split("-")[1];
    let head = [
      { rowSpan: "2", label: "No", className: "text-center", width: "1%" },
      { rowSpan: "2", label: "#", className: "text-center", width: "1%" },
      { colSpan: "4", label: "Barang" },
    ];
    bukaHarga && head.push({ colSpan: "2", label: "Harga" });
    head.push({ colSpan: "5", label: "Stok" });
    bukaHarga && head.push({ colSpan: "2", label: "Total" });
    head.push({ rowSpan: "2", label: "Satuan" });
    head.push({ rowSpan: "2", label: "Supplier" });
    head.push({ rowSpan: "2", label: "Sub dept" });

    let rowSpan = [{ label: "Kelompok" }, { label: "SKU Induk" }, { label: "Nama" }, , { label: "Variasi" }];

    bukaHarga && rowSpan.push({ label: "Beli" });
    bukaHarga && rowSpan.push({ label: "Jual" });
    rowSpan.push({ label: "Awal" });
    rowSpan.push({ label: "Masuk" });
    rowSpan.push({ label: "Keluar" });
    rowSpan.push({ label: "Penjualan" });
    rowSpan.push({ label: "Akhir" });
    bukaHarga && rowSpan.push({ label: "Harga beli" });
    bukaHarga && rowSpan.push({ label: "Harga jual" });

    return (
      <Layout page="Laporan Stock">
        <HeaderReportCommon
          col="col-md-2"
          pathName="ReportStock"
          isLocation={true}
          isStatus={true}
          isColumn={true}
          statusData={STATUS_STOK}
          columnData={search_by_data}
          otherStatus="filter_stock"
          // otherColumn="search_by"
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
              ? data.map((v, i) => {
                  const stockAwal = float(v.stock_awal);
                  const stockMasuk = float(v.stock_masuk);
                  const stockKeluar = float(v.stock_keluar);
                  const hrgBeliPerLokasi = float(v.harga_beli_lokasi);
                  const hrgJualPerLokasi = float(v.harga_lokasi);
                  const stockPenjualan = float(v.stock_penjualan);
                  const stockAkhir = float(stockAwal + stockMasuk - (stockKeluar + parseFloat(v.stock_penjualan)));

                  total_stock_harga_beli_item_per += hrgBeliPerLokasi;
                  total_stock_harga_jual_item_per += hrgJualPerLokasi;
                  total_stock_awal_per += stockAwal;
                  total_stock_masuk_per += stockMasuk;
                  total_stock_keluar_per += stockKeluar;
                  total_stock_penjualan_per += stockPenjualan;
                  total_stock_akhir_per += stockAkhir;
                  total_stock_harga_beli_per += hrgBeliPerLokasi * stockAkhir;
                  total_stock_harga_jual_per += hrgJualPerLokasi * stockAkhir;
                  return (
                    <tr key={i}>
                      <td className="text-center middle nowrap">{generateNo(i, current_page)}</td>
                      <td className="text-center middle nowrap">
                        <ButtonActionCommon
                          action={[{ label: "Detail" }, { label: "Export" }]}
                          callback={(e) => {
                            if (e === 0) this.handleModal("detal", v);
                            if (e === 1) this.props.history.push(`${HEADERS.URL}reports/penjualan/${v.kd_trx}.pdf`);
                          }}
                        />
                      </td>
                      {/* <td className="middle nowrap">{v.kd_brg}</td> */}
                      <td className="middle nowrap">{v.nama_kel}</td>
                      <td className="middle nowrap">{v.barcode}</td>
                      <td className="middle nowrap">{v.nm_brg}</td>
                      <td className="middle nowrap">{v.variasi}</td>

                      <td className={`middle nowrap text-right ${bukaHarga ? "" : "dNone"}`}>{parseToRp(hrgBeliPerLokasi)}</td>
                      <td className={`middle nowrap text-right ${bukaHarga ? "" : "dNone"}`}>{parseToRp(hrgJualPerLokasi)}</td>

                      <td className="text-right middle nowrap">{parseToRp(stockAwal)}</td>
                      <td className="text-right middle nowrap">{parseToRp(stockMasuk)}</td>
                      <td className="text-right middle nowrap">{parseToRp(stockKeluar)}</td>
                      <td className="text-right middle nowrap">{parseToRp(v.stock_penjualan)}</td>
                      <td className="text-right middle nowrap">{parseToRp(stockAkhir)}</td>
                      <td className={`middle nowrap text-right ${bukaHarga ? "" : "dNone"}`}>{parseToRp(hrgBeliPerLokasi * stockAkhir)}</td>
                      <td className={`middle nowrap text-right ${bukaHarga ? "" : "dNone"}`}>{parseToRp(hrgJualPerLokasi * stockAkhir)}</td>
                      <td className="middle nowrap">{v.satuan}</td>
                      <td className="middle nowrap">{v.supplier}</td>
                      <td className="middle nowrap">{v.sub_dept}</td>
                    </tr>
                  );
                })
              : noData(head.length+rowSpan.length)
          }
          footer={[
            {
              data: [
                { colSpan: 6, label: "Total perhalaman", className: "text-left" },
                { colSpan: 1, label: parseToRp(total_stock_harga_beli_item_per), className: `text-right ${bukaHarga ? "" : "dNone"}` },
                { colSpan: 1, label: parseToRp(total_stock_harga_jual_item_per), className: `text-right  ${bukaHarga ? "" : "dNone"}` },
                { colSpan: 1, label: parseToRp(total_stock_awal_per) },
                { colSpan: 1, label: parseToRp(total_stock_masuk_per) },
                { colSpan: 1, label: parseToRp(total_stock_keluar_per) },
                { colSpan: 1, label: parseToRp(total_stock_penjualan_per) },
                { colSpan: 1, label: parseToRp(total_stock_akhir_per) },
                { colSpan: 1, label: parseToRp(total_stock_harga_beli_per), className: `text-right  ${bukaHarga ? "" : "dNone"}` },
                { colSpan: 1, label: parseToRp(total_stock_harga_jual_per), className: `text-right  ${bukaHarga ? "" : "dNone"}` },
                { colSpan: 2, label: "" },
              ],
            },
            {
              data: [
                { colSpan: 6, label: "Total keseluruhan", className: "text-left" },
                { colSpan: 1, label: parseToRp(total_harga_beli), className: `text-right  ${bukaHarga ? "" : "dNone"}` },
                { colSpan: 1, label: parseToRp(total_harga_jual), className: `text-right  ${bukaHarga ? "" : "dNone"}` },
                { colSpan: 1, label: parseToRp(total_stock_awal) },
                { colSpan: 1, label: parseToRp(total_stock_masuk) },
                { colSpan: 1, label: parseToRp(total_stock_keluar) },
                { colSpan: 1, label: parseToRp(total_stock_penjualan) },
                { colSpan: 1, label: parseToRp(total_stock_akhir) },
                { colSpan: 1, label: parseToRp(total_harga_beli_qty), className: `text-right  ${bukaHarga ? "" : "dNone"}` },
                { colSpan: 1, label: parseToRp(total_harga_jual_qty), className: `text-right  ${bukaHarga ? "" : "dNone"}` },
                { colSpan: 2, label: "" },
              ],
            },
          ]}
        />
        {this.props.isOpen && isModalDetail ? <DetailStockReportSatuan stockReportDetailSatuan={this.props.stockReportDetailSatuan} detail={detail} /> : null}
        {this.props.isOpen && isModalExcel ? <StockReportExcel startDate={startDate} endDate={endDate} lokasi={location} /> : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    download: state.stockReportReducer.download,
    stockReport: state.stockReportReducer.data,
    stockReportExcel: state.stockReportReducer.report_excel,
    total_stock: state.stockReportReducer.total_stock,
    auth: state.auth,
    stockReportDetailSatuan: state.stockReportReducer.dataDetailSatuan,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(InventoryReport);
