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
import { dataStatus, dateRange, generateNo, getStorage, isEmptyOrUndefined, noData, setStorage } from "../../../../../helper";
import LokasiCommon from "../../../common/LokasiCommon";
import SelectCommon from "../../../common/SelectCommon";
import SelectSortCommon from "../../../common/SelectSortCommon";

const dateFromStorage = "dateFromReportReceive";
const dateToStorage = "dateToReportReceive";
const locationStorage = "locationReportReveive";
const typeStorage = "typeReportReveive";
const columnStorage = "columnReportReveive";
const sortStorage = "sortReportReveive";
const statusStorage = "statusReportReveive";
const anyStorage = "anyReportReveive";

class ReceiveReport extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRetur = this.handleRetur.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.state = {
      where_data: "",
      detail: {},
      dateFrom: moment(new Date()).format("yyyy-MM-DD"),
      dateTo: moment(new Date()).format("yyyy-MM-DD"),
      location: "",
      type: "",
      any: "",
      sort: "",
      column: "no_faktur_beli",
      status: "",
      type_data: [
        { value: "", label: "Semua Tipe" },
        { value: "Tunai", label: "Tunai" },
        { value: "Kredit", label: "Kredit" },
      ],
      column_data: [
        { value: "no_faktur_beli", label: "No. Faktur" },
        { value: "nama_penerima", label: "Penerima" },
      ],
      status_data: [
        { value: "", label: "Semua Status" },
        { value: "0", label: "Belum Lunas" },
        { value: "1", label: "Lunas" },
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
      if (isEmptyOrUndefined(urutan)) {
        where += `&sort=${kolom}|${urutan}`;
        Object.assign(state, { sort: urutan, column: kolom });
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

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handlePageChange(pageNumber) {
    this.handleService(pageNumber);
  }
  handleSearch(e) {
    e.preventDefault();
    setStorage(anyStorage, this.state.any);
    setTimeout(() => this.handleService(1), 500);
  }
  toggle(e, kdTrx, tgl, lokasi, penerima, pelunasan, operator) {
    e.preventDefault();
    this.setState({ isModalDetail: true });
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("receiveReportDetail"));
    let que = `detail_receive_report`;
    localStorage.setItem(`kd_trx_${que}`, kdTrx);
    localStorage.setItem(`tgl_${que}`, tgl);
    localStorage.setItem(`lokasi_${que}`, lokasi);
    localStorage.setItem(`penerima_${que}`, penerima);
    localStorage.setItem(`pelunasan_${que}`, pelunasan);
    localStorage.setItem(`operator_${que}`, operator);
    this.props.dispatch(FetchReportDetail(1, kdTrx));
  }
  handleRetur(e, kode) {
    e.preventDefault();
    this.setState({ isModalForm: true });

    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formReturReceive"));
    this.props.dispatch(FetchReceiveData(kode, ""));
  }
  handleDelete(e, kode) {
    e.preventDefault();
    Swal.fire({
      allowOutsideClick: false,
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        this.props.dispatch(deleteReceiveReport(kode));
      }
    });
  }
  handleChangePage(e, kode, lokasi, catatan, kode_supplier, penerima, nonota, type) {
    e.preventDefault();
    localStorage.setItem("kode_edit", kode);
    localStorage.setItem("lokasi_edit", lokasi);
    localStorage.setItem("catatan_edit", catatan);
    localStorage.setItem("kode_supplier_edit", kode_supplier);
    localStorage.setItem("nama_penerima_edit", penerima);
    localStorage.setItem("nonota_edit", nonota);
    localStorage.setItem("type_edit", type);
    // window.location.href = `/receive/${kode}`;
    this.props.history.push(`/receive/${kode}`);
    // this.props.dispatch(FetchReceiveData(kode,'edit'));
  }
  toggleModal(e, total, perpage) {
    e.preventDefault();
    this.setState({ isModalExport: true });

    const bool = !this.props.isOpen;
    // let range = total*perpage;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formReceiveExcel"));
    this.props.dispatch(FetchReportExcel(1, this.state.where_data, total));
  }
  handleChangeSelect(state, res) {
    if (state === "location") setStorage(locationStorage, res.value);
    if (state === "type") setStorage(typeStorage, res.value);
    if (state === "column") setStorage(columnStorage, res.value);
    if (state === "sort") setStorage(sortStorage, res.value);
    if (state === "status") setStorage(statusStorage, res.value);
    setTimeout(() => this.handleService(1), 500);
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
    } = this.props.data;
    let tot_beli = 0;
    return (
      <Layout page="Laporan Pembelian">
        <div className="row">
          <div className="col-md-12">
            <div className="row">
              <div className="col-6 col-xs-6 col-md-3" style={{ paddingRight: "0px" }}>
                {dateRange((first, last) => {
                  setStorage(dateFromStorage, first);
                  setStorage(dateToStorage, last);
                  setTimeout(() => this.handleService(1), 500);
                }, `${this.state.dateFrom} to ${this.state.dateTo}`)}
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <LokasiCommon callback={(res) => this.handleChangeSelect("location", res)} isAll={true} dataEdit={this.state.location} />
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <SelectCommon label="Tipe transaksi" options={this.state.type_data} callback={(res) => this.handleChangeSelect("type", res)} dataEdit={this.state.type} />
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <SelectCommon label="Kolom" options={this.state.column_data} callback={(res) => this.handleChangeSelect("column", res)} dataEdit={this.state.column} />
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <SelectSortCommon callback={(res) => this.handleChangeSelect("sort", res)} dataEdit={this.state.sort} />
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <SelectCommon label="Status" options={dataStatus(true)} callback={(res) => this.handleChangeSelect("status", res)} dataEdit={this.state.status} />
              </div>
              <div className="col-12 col-xs-12 col-md-3">
                <div className="form-group">
                  <label htmlFor="">Cari</label>
                  <input type="text" name="any" className="form-control" style={{ width: "100%" }} value={this.state.any} onChange={(e) => this.handleChange(e)} />
                </div>
              </div>
              <div className="col-md-3">
                <button style={{ marginTop: "27px", marginRight: "2px" }} className="btn btn-primary" onClick={this.handleSearch}>
                  <i className="fa fa-search" />
                </button>
                <button style={{ marginTop: "27px" }} className="btn btn-primary" onClick={(e) => this.toggleModal(e, last_page * per_page, per_page)}>
                  <i className="fa fa-print"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="table table-hover table-noborder">
            <thead className="bg-light">
              <tr>
                <th className="text-black text-center middle nowrap">No</th>
                <th className="text-black text-center middle nowrap">#</th>
                <th className="text-black middle nowrap">No Faktur</th>
                <th className="text-black middle nowrap">Tanggal</th>
                <th className="text-black middle nowrap">Penerima</th>
                <th className="text-black middle nowrap">Tipe</th>
                <th className="text-black middle nowrap">Pelunasan</th>
                <th className="text-black middle nowrap">Diskon</th>
                <th className="text-black middle nowrap">PPN</th>
                <th className="text-black middle nowrap">Supplier</th>
                <th className="text-black middle nowrap">Operator</th>
                <th className="text-black middle nowrap">Lokasi</th>
                <th className="text-black middle nowrap">Serial</th>
                <th className="text-black middle nowrap">Pembayaran ke-</th>
                <th className="text-black middle nowrap">Sisa Pembayaran</th>
                <th className="text-black middle nowrap">Qty Beli</th>
                <th className="text-black middle nowrap">Total Beli</th>
              </tr>
            </thead>
            <tbody>
              {typeof data === "object"
                ? data.length > 0
                  ? data.map((v, i) => {
                      tot_beli = tot_beli + parseInt(v.total_beli, 10);
                      return (
                        <tr key={i}>
                          <td className="text-center middle nowrap">{generateNo(i, current_page)}</td>

                          <td className="text-center middle nowrap">
                            <UncontrolledButtonDropdown>
                              <DropdownToggle caret></DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem onClick={(e) => this.toggle(e, v.no_faktur_beli, moment(v.tgl_beli).format("YYYY-MM-DD"), v.lokasi, v.nama_penerima, v.pelunasan, v.operator)}>
                                  Detail
                                </DropdownItem>
                                <DropdownItem onClick={(e) => this.handleRetur(e, v.no_faktur_beli)}>Retur</DropdownItem>
                                <DropdownItem onClick={(e) => this.handleDelete(e, v.no_faktur_beli)}>Delete</DropdownItem>
                                <DropdownItem onClick={(e) => this.handleChangePage(e, v.no_faktur_beli, v.kd_lokasi, "-", v.kode_supplier, v.nama_penerima, v.nonota, v.type)}>Edit</DropdownItem>
                              </DropdownMenu>
                            </UncontrolledButtonDropdown>
                          </td>
                          <td className="middle nowrap">{v.no_faktur_beli}</td>
                          <td className="middle nowrap">{moment(v.tgl_beli).format("YYYY-MM-DD")}</td>
                          <td className="middle nowrap">{v.nama_penerima}</td>
                          <td className="middle nowrap">{v.type}</td>
                          <td className="middle nowrap">{v.pelunasan}</td>
                          <td className="middle nowrap">{v.disc}</td>
                          <td className="middle nowrap">{v.ppn}</td>
                          <td className="middle nowrap">{v.supplier}</td>
                          <td className="middle nowrap">{v.operator}</td>
                          <td className="middle nowrap">{v.lokasi}</td>
                          <td className="middle nowrap">{v.serial}</td>
                          <td className="middle nowrap">{v.jumlah_pembayaran}</td>
                          <td className="middle nowrap">{v.pelunasan.toLowerCase() === "lunas" ? 0 : toRp(parseFloat(v.total_beli) - parseFloat(v.jumlah_bayar))}</td>
                          <td className="middle nowrap">{v.qty_beli}</td>
                          <td className="middle nowrap">{toRp(parseInt(v.total_beli, 10))}</td>
                        </tr>
                      );
                    })
                  : noData(17)
                : noData(17)}
            </tbody>

            <tfoot>
              <tr style={{ backgroundColor: "#EEEEEE" }}>
                <td colSpan="16">Total perhalaman</td>
                <td style={{ textAlign: "right" }}>{toRp(tot_beli)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div style={{ marginTop: "20px", float: "right" }}>
          <Paginationq current_page={parseInt(current_page, 10)} per_page={parseInt(per_page, 10)} total={parseInt(last_page * per_page, 10)} callback={this.handlePageChange.bind(this)} />
        </div>
        {this.state.isModalDetail ? <DetailReceiveReport receiveReportDetail={this.props.receiveReportDetail} /> : null}

        {this.state.isModalForm ? <FormReturReceive dataRetur={this.props.dataRetur} /> : null}
        {this.state.isModalExport ? <ReceiveReportExcel startDate={this.state.startDate} endDate={this.state.endDate} location={this.state.location} /> : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.receiveReducer.data,
    isLoading: state.receiveReducer.isLoading,
    // isLoadingReportDetail: state.receiveReducer.isLoadingReportDetail,
    receiveReportDetail: state.receiveReducer.dataReceiveReportDetail,
    dataRetur: state.receiveReducer.receive_data,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(ReceiveReport);
