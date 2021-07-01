import React, { Component } from "react";
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import { FetchReportSaleByProduct } from "redux/actions/sale/sale_by_product.action";
import SaleByProductReportExcel from "components/App/modals/report/sale/form_sale_by_product_excel";
import { FetchReportDetailSaleByProduct, FetchReportSaleByProductExcel } from "redux/actions/sale/sale_by_product.action";
import DetailSaleByProductReport from "../../modals/report/sale/detail_sale_by_product_report";
import { ModalType } from "redux/actions/modal.action";
import { dateRange, getStorage, handleDataSelect, isEmptyOrUndefined, isProgress, setStorage, toDate } from "../../../../helper";
import SelectCommon from "../../common/SelectCommon";
import LokasiCommon from "../../common/LokasiCommon";
import TableCommon from "../../common/TableCommon";

const dateFromStorage = "dateFromReportSaleByProduct";
const dateToStorage = "dateToReportSaleByProduct";
const locationStorage = "locationReportSaleByProduct";
const sortStorage = "sortReportSaleByProduct";
const anyStorage = "anyReportSaleByProduct";
const activeDateRangePickerStorage = "activeDateReportSaleByProduct";
class SaleByProductArchive extends Component {
  constructor(props) {
    super(props);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.state = {
      where_data: "",
      location: "",
      any: "",
      sort: "",
      startDate: toDate(new Date()),
      endDate: toDate(new Date()),
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
  componentDidMount() {
    this.handleService(1);
  }

  handleService(page = 1) {
    let getDateFrom = getStorage(dateFromStorage);
    let getDateTo = getStorage(dateToStorage);
    let getLocation = getStorage(locationStorage);
    let getSort = getStorage(sortStorage);
    let getAny = getStorage(anyStorage);
    let where = `page=${page}`;
    let state = {};

    if (isEmptyOrUndefined(getDateFrom) && isEmptyOrUndefined(getDateTo)) {
      where += `&datefrom=${getDateFrom}&dateto=${getDateTo}`;
      Object.assign(state, { startDate: getDateFrom, endDate: getDateTo });
    } else {
      where += `&datefrom=${this.state.startDate}&dateto=${this.endDate}`;
    }
    if (isEmptyOrUndefined(getLocation)) {
      where += `&lokasi=${getLocation}`;
      Object.assign(state, { location: getLocation });
    }
    if (isEmptyOrUndefined(getSort)) {
      where += `&sort=${getSort}`;
      Object.assign(state, { sort: getSort });
    }
    if (isEmptyOrUndefined(getAny)) {
      where += `&q=${getAny}`;
      Object.assign(state, { any: getAny });
    }
    Object.assign(state, { where_data: where });
    this.setState(state);
    this.props.dispatch(FetchReportSaleByProduct(where));
  }
  handlePageChange(pageNumber) {
    this.handleService(pageNumber);
  }
  handleModal(e = "detail", index, total = 0) {
    let state = {};
    let where = this.state.where_data;
    if (e !== "detail") {
      Object.assign(state, { isModalExport: true });
      this.props.dispatch(ModalType("formSaleByProductExcel"));
      this.props.dispatch(FetchReportSaleByProductExcel(1, where, total));
    } else {
      let props = this.props.sale_by_productReport.data[index];
      Object.assign(state, { isModalDetail: true, detail: props });
      this.props.dispatch(ModalType("detailSaleByProductReport"));
      this.props.dispatch(FetchReportDetailSaleByProduct(btoa(props.barcode), where));
    }
    this.setState(state);
  }

  handleChangeSelect(state, res) {
    if (state === "location") setStorage(locationStorage, res.value);
    if (state === "sort") setStorage(sortStorage, res.value);
    this.setState({ [state]: res.value });
    setTimeout(() => this.handleService(), 300);
  }
  handleSearch(e) {
    e.preventDefault();
    setStorage(anyStorage, this.state.any);
    this.handleService(1);
  }

  render() {
    const { total, last_page, per_page, current_page, data } = this.props.sale_by_productReport;
    const { startDate, endDate, location, sort, sort_data, any, isModalExport, isModalDetail, detail } = this.state;

    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "#", className: "text-center", width: "1%" },
      { label: "Kode" },
      { label: "Nama" },
      { label: "Barcode" },
      { label: "Deskripsi" },
      { label: "Satuan" },
      { label: "Qty" },
      { label: "Gross sales" },
      { label: "Diskon item" },
      { label: "Pajak" },
      { label: "Servis" },
      { label: "Toko  " },
      { label: "Tanggal" },
    ];

    return (
      <Layout page="Laporan penjualan by barang">
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
            <LokasiCommon callback={(res) => this.handleChangeSelect("location", res)} isAll={true} dataEdit={location} />
          </div>
          <div className="col-6 col-xs-6 col-md-2">
            <SelectCommon label="Sort" options={handleDataSelect(sort_data, "kode", "value")} callback={(res) => this.handleChangeSelect("sort", res)} dataEdit={sort} />
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
                <button className="btn btn-primary ml-1" onClick={(e) => this.handleModal("excel", last_page * per_page)}>
                  {isProgress(this.props.download)}
                </button>
              </span>
            </div>
          </div>
        </div>
        <TableCommon
          head={head}
          meta={{
            total: total,
            current_page: current_page,
            per_page: per_page,
          }}
          current_page={current_page}
          callbackPage={this.handlePageChange.bind(this)}
          body={typeof data === "object" && data}
          label={[
            { label: "kd_brg" },
            { label: "nm_brg" },
            { label: "barcode" },
            { label: "deskripsi" },
            { label: "satuan" },
            { label: "qty_jual", isCurrency: true, className: "text-right" },
            { label: "gross_sales", isCurrency: true, className: "text-right" },
            { label: "diskon_item", isCurrency: true, className: "text-right" },
            { label: "tax", isCurrency: true, className: "text-right" },
            { label: "service", isCurrency: true, className: "text-right" },
            { label: "toko" },
            { label: "tgl", date: true },
          ]}
          action={[{ label: "Detail" }]}
          callback={(e, index) => this.handleModal("detail", index)}
        />
        {this.props.isOpen && isModalExport ? <SaleByProductReportExcel startDate={startDate} endDate={endDate} location={location} /> : null}
        {this.props.isOpen && isModalDetail ? (
          <DetailSaleByProductReport
            detailSaleByProduct={this.props.detailSaleByProduct}
            detail={detail}
            startDate={localStorage.getItem("date_from_sale_by_product_report") === null ? startDate : localStorage.getItem("date_from_sale_by_product_report")}
            endDate={localStorage.getItem("date_to_sale_by_product_report") === null ? endDate : localStorage.getItem("date_to_sale_by_product_report")}
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
    download: state.sale_by_productReducer.download,
    detailSaleByProduct: state.sale_by_productReducer.dataDetail,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(SaleByProductArchive);
