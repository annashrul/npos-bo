import React, { Component } from "react";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import { FetchReport } from "redux/actions/purchase/receive/receive.action";
import moment from "moment";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import Paginationq from "helper";
import DetailReceiveReport from "../../../modals/report/purchase/receive/detail_receive_report";
import ReceiveReportExcel from "../../../modals/report/purchase/receive/form_receive_excel";
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
import { deleteReceiveReport, FetchReceiveData, FetchReportExcel, FetchReportDetail } from "redux/actions/purchase/receive/receive.action";
import { toRp } from "helper";
import FormReturReceive from "../../../modals/report/purchase/receive/form_retur_receive";
import Swal from "sweetalert2";
import { CURRENT_DATE, dateRange, DEFAULT_WHERE, generateNo, getStorage, getWhere, isEmptyOrUndefined, isProgress, noData, parseToRp, setStorage, toDate } from "../../../../../helper";
import { STATUS_ARSIP_PENJUALAN } from "../../../../../helperStatus";

import LokasiCommon from "../../../common/LokasiCommon";
import SelectCommon from "../../../common/SelectCommon";
import SelectSortCommon from "../../../common/SelectSortCommon";
import TableCommon from "../../../common/TableCommon";
import ButtonActionCommon from "../../../common/ButtonActionCommon";

const dateFromStorage = "dateFromReportReceive";
const dateToStorage = "dateToReportReceive";
const locationStorage = "locationReportReveive";
const typeStorage = "typeReportReveive";
const columnStorage = "columnReportReveive";
const sortStorage = "sortReportReveive";
const statusStorage = "statusReportReveive";
const anyStorage = "anyReportReveive";
const activeDateRangePickerStorage = "activeDateRangeReportReceive";

class ReceiveReport extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.state = {
      where_data: DEFAULT_WHERE,
      detail: {},
      dateFrom: CURRENT_DATE,
      dateTo: CURRENT_DATE,
      location: "",
      type: "",
      any: "",
      sort: "",
      column: "no_faktur_beli",
      status: "",
      type_data: [
        { value: "", label: "Semua" },
        { value: "Tunai", label: "Tunai" },
        { value: "Kredit", label: "Kredit" },
      ],
      column_data: [
        { value: "no_faktur_beli", label: "No. Faktur" },
        { value: "nama_penerima", label: "Penerima" },
      ],
      isModalDetail: false,
      isModalForm: false,
      isModalExport: false,
    };
  }

  componentWillUnmount() {
    this.setState({
      isModalDetail: false,
      isModalForm: false,
      isModalExport: false,
    });
  }
  componentWillMount() {
    this.handleService(1);
  }
  componentDidMount() {
    this.handleService(1);
  }
  handleService(page = 1) {
    let tglAwal = getStorage(dateFromStorage);
    let tglAkhir = getStorage(dateToStorage);
    let lokasi = getStorage(locationStorage);
    let tipe = getStorage(typeStorage);
    let kolom = getStorage(columnStorage);
    let urutan = getStorage(sortStorage);
    let stts = getStorage(statusStorage);
    let any = getStorage(anyStorage);
    let where = `page=${page}`;
    let state = {};
    if (isEmptyOrUndefined(tglAwal) && isEmptyOrUndefined(tglAkhir)) {
      where = `page=${page}&datefrom=${tglAwal}&dateto=${tglAkhir}`;
      Object.assign(state, { dateFrom: tglAwal, dateTo: tglAkhir });
    } else {
      where = `page=${page}&datefrom=${this.state.dateFrom}&dateto=${this.state.dateTo}`;
    }
    if (isEmptyOrUndefined(lokasi)) {
      where += `&lokasi=${lokasi}`;
      Object.assign(state, { location: lokasi });
    }
    if (isEmptyOrUndefined(tipe)) {
      where += `&type=${tipe}`;
      Object.assign(state, { type: tipe });
    }
    if (isEmptyOrUndefined(kolom)) {
      where += `&sort=${kolom}`;
      Object.assign(state, { column: kolom });
      if (isEmptyOrUndefined(urutan)) {
        where += `|${urutan}`;
        Object.assign(state, { sort: urutan });
      }
    }
    if (isEmptyOrUndefined(stts)) {
      if (stts !== "semua") where += `&status=${stts}`;
      Object.assign(state, { status: stts });
    }
    if (isEmptyOrUndefined(any)) {
      where += `&q=${any}`;
      Object.assign(state, { any: any });
    }
    Object.assign(state, { where_data: where });
    this.setState(state);
    this.props.dispatch(FetchReport(where));
  }

  handlePageChange(pageNumber) {
    this.handleService(pageNumber);
  }
  handleSearch(e) {
    e.preventDefault();
    setStorage(anyStorage, this.state.any);
    this.handleService();
  }

  handleDelete(kode) {
    this.props.dispatch(deleteReceiveReport({ id: kode, where: this.state.where_data }));
  }

  handleEdit(obj) {
    localStorage.setItem("kode_edit", obj.no_faktur_beli);
    localStorage.setItem("lokasi_edit", obj.lokasi);
    localStorage.setItem("catatan_edit", "-");
    localStorage.setItem("kode_supplier_edit", obj.kode_supplier);
    localStorage.setItem("nama_penerima_edit", obj.nama_penerima);
    localStorage.setItem("nonota_edit", obj.nonota);
    localStorage.setItem("type_edit", obj.type);
    this.props.history.push(`/receive/${obj.no_faktur_beli}`);
  }

  handleModal(type, obj) {
    let whereState = getWhere(this.state.where_data);
    let where = `page=1${whereState}`;
    let state = { where_data: where };
    if (type === "excel") {
      Object.assign(state, { isModalExport: true });
      this.props.dispatch(FetchReportExcel(where, obj.total));
    } else if (type === "detail") {
      Object.assign(state, { isModalDetail: true });
      this.props.dispatch(FetchReportDetail(obj.no_faktur_beli, where, true));
    } else {
      Object.assign(state, { isModalForm: true });
      this.props.dispatch(FetchReceiveData(obj.no_faktur_beli, true));
    }
    this.setState(state);
  }
  handleChangeSelect(state, res) {
    this.setState({ [state]: res.value });
    if (state === "location") setStorage(locationStorage, res.value);
    if (state === "type") setStorage(typeStorage, res.value);
    if (state === "column") setStorage(columnStorage, res.value);
    if (state === "sort") setStorage(sortStorage, res.value);
    if (state === "status") setStorage(statusStorage, res.value);
    this.handleService(1);
  }
  render() {
    const { total, last_page, per_page, current_page, data } = this.props.data;
    const { dateFrom, dateTo, any, location, column, column_data, sort, type_data, type, status, isModalDetail, isModalExport, isModalForm } = this.state;
    let tot_beli = 0;

    return (
      <Layout page="Laporan Pembelian">
        <div className="row">
          <div className="col-md-12">
            <div className="row">
              <div className="col-6 col-xs-6 col-md-3" style={{ paddingRight: "0px" }}>
                {dateRange(
                  (first, last, isActive) => {
                    setStorage(activeDateRangePickerStorage, isActive);
                    setStorage(dateFromStorage, first);
                    setStorage(dateToStorage, last);
                    this.handleService();
                  },
                  `${toDate(dateFrom)} - ${toDate(dateTo)}`,
                  getStorage(activeDateRangePickerStorage)
                )}
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <LokasiCommon callback={(res) => this.handleChangeSelect("location", res)} isAll={true} dataEdit={this.state.location} />
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <SelectCommon label="Tipe transaksi" options={type_data} callback={(res) => this.handleChangeSelect("type", res)} dataEdit={type} />
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <SelectCommon label="Kolom" options={column_data} callback={(res) => this.handleChangeSelect("column", res)} dataEdit={column} />
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <SelectSortCommon callback={(res) => this.handleChangeSelect("sort", res)} dataEdit={sort} />
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <SelectCommon label="Status" options={STATUS_ARSIP_PENJUALAN} callback={(res) => this.handleChangeSelect("status", res)} dataEdit={status} />
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
                        this.handleModal("excel", {
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
          </div>
        </div>
        <TableCommon
          head={[
            { label: "No", className: "text-center", width: "1%" },
            { label: "#", className: "text-center", width: "1%" },
            { label: "Faktur receive" },
            { label: "Tanggal" },
            { label: "Penerima" },
            { label: "Tipe" },
            { label: "Pelunasan" },
            { label: "Diskon (%)" },
            { label: "Ppn (%)" },
            { label: "Supplier" },
            { label: "Operator" },
            { label: "Lokasi" },
            { label: "Pembayaran-ke" },
            { label: "Sisa pembayaran" },
            { label: "Qty beli" },
            { label: "Total beli" },
          ]}
          meta={{ total: total, current_page: current_page, per_page: per_page }}
          current_page={current_page}
          callbackPage={this.handlePageChange.bind(this)}
          renderRow={
            typeof data === "object"
              ? data.length > 0
                ? data.map((v, i) => {
                    tot_beli = tot_beli + parseInt(v.total_beli, 10);
                    return (
                      <tr key={i}>
                        <td className="text-center middle nowrap">{generateNo(i, current_page)}</td>
                        <td className="text-center middle nowrap">
                          <ButtonActionCommon
                            action={[{ label: "Detail" }, { label: "Retur" }, { label: "Hapus" }, { label: "Edit" }]}
                            callback={(e) => {
                              if (e === 0) this.handleModal("detail", v);
                              if (e === 1) this.handleModal("retur", v);
                              if (e === 2) this.handleDelete(v.no_faktur_beli);
                              if (e === 3) this.handleEdit(v);
                            }}
                          />
                        </td>
                        <td className="middle nowrap">{v.no_faktur_beli}</td>
                        <td className="middle nowrap">{toDate(v.tgl_beli)}</td>
                        <td className="middle nowrap">{v.nama_penerima}</td>
                        <td className="middle nowrap">{v.type}</td>
                        <td className="middle nowrap">{v.pelunasan}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.disc)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.ppn)}</td>
                        <td className="middle nowrap">{v.supplier}</td>
                        <td className="middle nowrap">{v.operator}</td>
                        <td className="middle nowrap">{v.lokasi}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.jumlah_pembayaran)}</td>
                        <td className="middle nowrap text-right">{v.pelunasan.toLowerCase() === "lunas" ? 0 : parseToRp(parseFloat(v.total_beli) - parseFloat(v.jumlah_bayar))}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.qty_beli)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.total_beli)}</td>
                      </tr>
                    );
                  })
                : noData(17)
              : noData(17)
          }
          footer={[
            {
              data: [
                { colSpan: 15, label: "Total perhalaman", className: "text-left" },
                { label: parseToRp(tot_beli), className: "text-right" },
              ],
            },
          ]}
        />

        {this.props.isOpen && isModalDetail ? <DetailReceiveReport receiveReportDetail={this.props.receiveReportDetail} /> : null}
        {this.props.isOpen && isModalForm ? <FormReturReceive dataRetur={this.props.dataRetur} /> : null}
        {this.props.isOpen && isModalExport ? <ReceiveReportExcel startDate={dateFrom} endDate={dateTo} location={location} /> : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.receiveReducer.data,
    download: state.receiveReducer.download,
    receiveReportDetail: state.receiveReducer.dataReceiveReportDetail,
    dataRetur: state.receiveReducer.receive_data,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(ReceiveReport);
