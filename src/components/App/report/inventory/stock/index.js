import React, { Component } from "react";
import Layout from "components/App/Layout";
import { FetchStockReport, FetchStockReportExcel } from "redux/actions/report/inventory/stock_report.action";
import connect from "react-redux/es/connect/connect";
import DetailStockReportSatuan from "components/App/modals/report/inventory/stock_report/detail_stock_report_satuan";
import StockReportExcel from "components/App/modals/report/inventory/stock_report/form_stock_report_excel";
import moment from "moment";
import { FetchStockReportDetailSatuan } from "redux/actions/report/inventory/stock_report.action";
import { HEADERS } from "redux/actions/_constants";
import { dateRange, generateNo, getStorage, isEmptyOrUndefined, isProgress, noData, setStorage, toDate, toRp } from "../../../../../helper";
import LokasiCommon from "../../../common/LokasiCommon";
import SelectCommon from "../../../common/SelectCommon";
import TableCommon from "../../../common/TableCommon";
import ButtonActionCommon from "../../../common/ButtonActionCommon";

const dateFromStorage = "dateFromReportStock";
const dateToStorage = "dateToReportStock";
const locationStorage = "locationReportStock";
const filterStorage = "filterReportStock";
const searchByStorage = "searchByReportStock";
const anyStorage = "anyReportStock";
const activeDateRangePickerStorage = "activeDateReportStock";

class InventoryReport extends Component {
  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.state = {
      where_data: "",
      isSelected: false,
      location: "",
      location_data: [],
      bukaHarga: false,
      status_data: [
        { value: "", label: "Semua Stock" },
        { value: "<", label: "Stock -" },
        { value: ">", label: "Stock +" },
        { value: "=", label: "Stock 0" },
      ],
      status: "",
      any: "",
      startDate: toDate(new Date()),
      endDate: toDate(new Date()),
      search_by: "br.kd_brg",
      search_by_data: [
        { value: "br.kd_brg", label: "Kode Barang" },
        { value: "br.nm_brg", label: "Nama Barang" },
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

  componentDidMount() {
    this.handleService();
  }
  componentWillMount() {
    this.handleService();
  }
  handlePageChange(pageNumber) {
    this.handleService(pageNumber);
  }

  handleService(page = 1) {
    let getDateFrom = getStorage(dateFromStorage);
    let getDateTo = getStorage(dateToStorage);
    let getLocation = getStorage(locationStorage);
    let getStatus = getStorage(filterStorage);
    let getSearchBy = getStorage(searchByStorage);
    let getAny = getStorage(anyStorage);

    let where = `page=${page}`;
    let state = { bukaHarga: false };

    if (isEmptyOrUndefined(getDateFrom) && isEmptyOrUndefined(getDateTo)) {
      where += `&datefrom=${getDateFrom}&dateto=${getDateTo}`;
      Object.assign(state, { startDate: getDateFrom, endDate: getDateTo });
    } else {
      where += `&datefrom=${this.state.startDate}&dateto=${this.state.endDate}`;
    }
    if (isEmptyOrUndefined(getLocation)) {
      where += `&lokasi=${getLocation}`;
      Object.assign(state, { location: getLocation, bukaHarga: true });
    }

    if (isEmptyOrUndefined(getStatus)) {
      where += `&filter_stock=${getStatus}`;
      Object.assign(state, { status: getStatus });
    }
    if (isEmptyOrUndefined(getSearchBy)) {
      where += `&search_by=${getSearchBy}`;
      Object.assign(state, { search_by: getSearchBy });
    }
    if (isEmptyOrUndefined(getAny)) {
      where += `&q=${getAny}`;
      Object.assign(state, { any: getAny });
    }
    Object.assign(state, { where_data: where });
    this.setState(state);
    this.props.dispatch(FetchStockReport(where));
  }
  handleSelect(state, res) {
    if (state === "location") setStorage(locationStorage, res.value);
    if (state === "status") setStorage(filterStorage, res.value);
    if (state === "search_by") setStorage(searchByStorage, res.value);
    this.setState({ [state]: res.value });
    setTimeout(() => this.handleService(), 500);
  }
  handleSearch(e) {
    e.preventDefault();
    setStorage(anyStorage, this.state.any);
    this.handleService(1);
  }

  handleModal(param, obj) {
    let state = {};
    if (param === "formSaleExcel") {
      Object.assign(state, { isModalExcel: true });
      this.props.dispatch(FetchStockReportExcel(1, this.state.where_data, obj.total));
    } else {
      Object.assign(obj, { where: this.state.where_data });
      Object.assign(state, { isModalDetail: true, detail: obj });
      this.props.dispatch(FetchStockReportDetailSatuan(obj.kd_brg, this.state.where_data));
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

    const { bukaHarga, startDate, endDate, location, status, status_data, any, search_by_data, search_by, isModalExcel, isModalDetail } = this.state;

    let head = [
      { rowSpan: "2", label: "No", className: "text-center", width: "1%" },
      { rowSpan: "2", label: "#", className: "text-center", width: "1%" },
      { colSpan: "5", label: "Barang" },
    ];
    bukaHarga && head.push({ colSpan: "2", label: "Harga" });
    head.push({ colSpan: "5", label: "Stok" });
    bukaHarga && head.push({ colSpan: "2", label: "Total" });
    head.push({ rowSpan: "2", label: "Supplier" });
    head.push({ rowSpan: "2", label: "Sub dept" });

    let rowSpan = [{ label: "Kode" }, { label: "barcode" }, { label: "Nama" }, { label: "Satuan" }, { label: "Kelompok" }];

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
        <div className="row">
          <div className="col-6 col-xs-6 col-md-2">
            {dateRange(
              (first, last, isActive) => {
                setStorage(activeDateRangePickerStorage, isActive);
                setStorage(dateFromStorage, first);
                setStorage(dateToStorage, last);
                setTimeout(() => this.handleService(), 300);
              },
              `${toDate(startDate)} - ${toDate(endDate)}`,
              getStorage(activeDateRangePickerStorage)
            )}
          </div>

          <div className="col-6 col-xs-6 col-md-2">
            <LokasiCommon callback={(res) => this.handleSelect("location", res)} dataEdit={location} isAll={true} />
          </div>

          <div className="col-6 col-xs-6 col-md-2">
            <SelectCommon label="Filter stock" options={status_data} callback={(res) => this.handleSelect("status", res)} dataEdit={status} />
          </div>
          <div className="col-6 col-xs-6 col-md-2">
            <SelectCommon label="Kolom" options={search_by_data} callback={(res) => this.handleSelect("search_by", res)} dataEdit={search_by} />
          </div>
          <div className="col-6 col-xs-6 col-md-3">
            <label>Cari</label>
            <div className="input-group">
              <input
                type="search"
                name="any"
                className="form-control"
                placeholder="tulis sesuatu disini"
                value={any}
                onChange={(e) => this.setState({ any: e.target.value })}
                onKeyPress={(e) => {
                  if (e.key === "Enter") this.handleSearch(e);
                }}
              />
              <span className="input-group-append">
                <button type="button" className="btn btn-primary" onClick={this.handleSearch}>
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
                  {isProgress(this.props.download)}
                </button>
              </span>
            </div>
          </div>
        </div>
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
                  const stockAwal = parseFloat(v.stock_awal);
                  const stockMasuk = parseFloat(v.stock_masuk);
                  const stockKeluar = parseFloat(v.stock_keluar);
                  const hrgBeliPerLokasi = parseFloat(v.harga_beli_lokasi);
                  const hrgJualPerLokasi = parseFloat(v.harga_lokasi);
                  const stockPenjualan = parseFloat(v.stock_penjualan);
                  const stockAkhir = stockAwal + stockMasuk - (stockKeluar + parseFloat(v.stock_penjualan));

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
                      <td className="middle nowrap">{v.kd_brg}</td>
                      <td className="middle nowrap">{v.barcode}</td>
                      <td className="middle nowrap">{v.satuan}</td>
                      <td className="middle nowrap">{v.nm_brg}</td>
                      <td className="middle nowrap">{v.nama_kel}</td>

                      <td className={`middle nowrap text-right ${bukaHarga ? "" : "dNone"}`}>{toRp(hrgBeliPerLokasi)}</td>
                      <td className={`middle nowrap text-right ${bukaHarga ? "" : "dNone"}`}>{toRp(hrgJualPerLokasi)}</td>

                      <td className="text-right middle nowrap">{stockAwal}</td>
                      <td className="text-right middle nowrap">{stockMasuk}</td>
                      <td className="text-right middle nowrap">{stockKeluar}</td>
                      <td className="text-right middle nowrap">{v.stock_penjualan}</td>
                      <td className="text-right middle nowrap">{stockAkhir}</td>
                      <td className={`middle nowrap text-right ${bukaHarga ? "" : "dNone"}`}>{toRp(hrgBeliPerLokasi * stockAkhir)}</td>
                      <td className={`middle nowrap text-right ${bukaHarga ? "" : "dNone"}`}>{toRp(hrgJualPerLokasi * stockAkhir)}</td>
                      <td className="middle nowrap">{v.supplier}</td>
                      <td className="middle nowrap">{v.sub_dept}</td>
                    </tr>
                  );
                })
              : noData(head.length)
          }
          footer={[
            {
              data: [
                { colSpan: 7, label: "Total perhalaman", className: "text-left" },
                { colSpan: 1, label: toRp(total_stock_harga_beli_item_per), className: `text-right ${bukaHarga ? "" : "dNone"}` },
                { colSpan: 1, label: toRp(total_stock_harga_jual_item_per), className: `text-right  ${bukaHarga ? "" : "dNone"}` },
                { colSpan: 1, label: toRp(total_stock_awal_per) },
                { colSpan: 1, label: toRp(total_stock_masuk_per) },
                { colSpan: 1, label: toRp(total_stock_keluar_per) },
                { colSpan: 1, label: toRp(total_stock_penjualan_per) },
                { colSpan: 1, label: toRp(total_stock_akhir_per) },
                { colSpan: 1, label: toRp(total_stock_harga_beli_per), className: `text-right  ${bukaHarga ? "" : "dNone"}` },
                { colSpan: 1, label: toRp(total_stock_harga_jual_per), className: `text-right  ${bukaHarga ? "" : "dNone"}` },
                { colSpan: 2, label: "" },
              ],
            },
            {
              data: [
                { colSpan: 7, label: "Total keseluruhan", className: "text-left" },
                { colSpan: 1, label: toRp(total_harga_beli), className: `text-right  ${bukaHarga ? "" : "dNone"}` },
                { colSpan: 1, label: toRp(total_harga_jual), className: `text-right  ${bukaHarga ? "" : "dNone"}` },
                { colSpan: 1, label: toRp(total_stock_awal) },
                { colSpan: 1, label: toRp(total_stock_masuk) },
                { colSpan: 1, label: toRp(total_stock_keluar) },
                { colSpan: 1, label: toRp(total_stock_penjualan) },
                { colSpan: 1, label: toRp(total_stock_akhir) },
                { colSpan: 1, label: toRp(total_harga_beli_qty), className: `text-right  ${bukaHarga ? "" : "dNone"}` },
                { colSpan: 1, label: toRp(total_harga_jual_qty), className: `text-right  ${bukaHarga ? "" : "dNone"}` },
                { colSpan: 2, label: "" },
              ],
            },
          ]}
        />
        {this.props.isOpen && isModalDetail ? <DetailStockReportSatuan stockReportDetailSatuan={this.props.stockReportDetailSatuan} detail={this.state.detail} /> : null}
        {this.props.isOpen && isModalExcel ? <StockReportExcel startDate={startDate} endDate={endDate} lokasi={this.state.location} /> : null}
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
    isLoading: state.stockReportReducer.isLoading,
    stockReportDetailSatuan: state.stockReportReducer.dataDetailSatuan,
    isLoadingDetailSatuan: state.stockReportReducer.isLoadingDetailSatuan,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(InventoryReport);
