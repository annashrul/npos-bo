import React, { Component } from "react";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import {
  fetchPoReport,
  fetchPoReportExcel,
} from "redux/actions/purchase/purchase_order/po.action";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import { poReportDetail } from "redux/actions/purchase/purchase_order/po.action";
import moment from "moment";
import Paginationq, { statusQ } from "helper";
import DetailPoReport from "components/App/modals/report/purchase/purchase_order/detail_po_report";
import PoReportExcel from "components/App/modals/report/purchase/purchase_order/form_po_excel";
import DateRangePicker from "react-bootstrap-daterangepicker";
import Select from "react-select";
import { rangeDate } from "helper";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import {
  dateRange,
  generateNo,
  getStorage,
  isEmptyOrUndefined,
  setStorage,
} from "../../../../../helper";
import LokasiCommon from "../../../common/LokasiCommon";
import SelectCommon from "../../../common/SelectCommon";
import SelectSortCommon from "../../../common/SelectSortCommon";

const dateFromStorage = "dateFromReportPo";
const dateToStorage = "dateToReportPo";
const locationStorage = "locationReportPoe";
const columnStorage = "columnReportPo";
const sortStorage = "sortReportPo";
const statusStorage = "statusReportPo";
const anyStorage = "anyReportPo";

class PoReport extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.state = {
      master: {},
      where_data: "",
      any: "",
      location: "",
      dateFrom: moment(new Date()).format("yyyy-MM-DD"),
      dateTo: moment(new Date()).format("yyyy-MM-DD"),
      sort: "",
      column: "",
      status: "",
      column_data: [
        { value: "no_po", label: "No. PO" },
        { value: "tgl_po", label: "Tanggal PO" },
        { value: "tglkirim", label: "Tanggal Kirim" },
        { value: "nama_supplier", label: "Nama Supplier" },
        { value: "status", label: "Status" },
        { value: "kode_supplier", label: "Kode Supplier" },
      ],
      status_data: [
        { value: "", label: "Semua" },
        { value: "0", label: "Processing" },
        { value: "1", label: "Ordered" },
      ],
      isModalDetail: false,
      isModalExport: false,
    };
  }

  handleService(page = 1) {
    let tglAwal = getStorage(dateFromStorage);
    let tglAkhir = getStorage(dateToStorage);
    let lokasi = getStorage(locationStorage);
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
    if (isEmptyOrUndefined(kolom)) {
      if (isEmptyOrUndefined(urutan)) {
        where += `&sort=${kolom}|${urutan}`;
        Object.assign(state, { sort: urutan, column: kolom });
      }
    }
    if (isEmptyOrUndefined(stts)) {
      where += `&status=${stts}`;
      Object.assign(state, { status: stts });
    }
    if (isEmptyOrUndefined(any)) {
      where += `&q=${any}`;
      Object.assign(state, { any: any });
    }
    Object.assign(state, { where_data: where });
    this.setState(state);
    this.props.dispatch(fetchPoReport(where));
  }
  handleChangeSelect(state, res) {
    if (state === "location") setStorage(locationStorage, res.value);
    if (state === "column") setStorage(columnStorage, res.value);
    if (state === "sort") setStorage(sortStorage, res.value);
    if (state === "status") setStorage(statusStorage, res.value);
    setTimeout(() => this.handleService(1), 500);
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

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handlePageChange(pageNumber) {
    this.handleService(pageNumber);
  }
  handleSearch(e) {
    e.preventDefault();
    setStorage(anyStorage, this.state.any);
    setTimeout(() => this.handleService(1), 300);
  }
  toggle(e, no_po, i) {
    e.preventDefault();
    this.setState({ isModalDetail: true });
    this.props.dispatch(poReportDetail(1, no_po));
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("poReportDetail"));

    this.setState({
      master: {
        no_po: no_po,
        tgl_po: moment(this.props.poReport.data[i].tgl_po).format("yyyy-MM-DD"),
        tgl_kirim: moment(this.props.poReport.data[i].tglkirim).format(
          "yyyy-MM-DD"
        ),
        lokasi: this.props.poReport.data[i].lokasi,
        kd_kasir: this.props.poReport.data[i].kd_kasir,
        nama_supplier: this.props.poReport.data[i].nama_supplier,
        alamat_supplier: this.props.poReport.data[i].alamat_supplier,
        telp_supplier: this.props.poReport.data[i].telp_supplier,
        catatan: this.props.poReport.data[i].catatan,
      },
    });
  }

  toggleModal(e, total, perpage) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.setState({ isModalExport: true });

    // let range = total*perpage;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formPoExcel"));
    this.props.dispatch(fetchPoReportExcel(1, this.state.where_data, total));
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
    } = this.props.poReport;
    console.log(data);
    return (
      <Layout page="Laporan Purchase Order">
        <div className="row" style={{ zoom: "90%" }}>
          <div className="col-md-12">
            <div className="row">
              <div className="col-6 col-xs-6 col-md-3">
                {dateRange((first, last) => {
                  setStorage(dateFromStorage, first);
                  setStorage(dateToStorage, last);
                  setTimeout(() => this.handleService(1), 500);
                }, `${this.state.dateFrom} to ${this.state.dateTo}`)}
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <div className="form-group">
                  <LokasiCommon
                    isAll={true}
                    callback={(res) => this.handleChangeSelect("location", res)}
                    dataEdit={this.state.location}
                  />
                </div>
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <SelectCommon
                  label="Status"
                  options={this.state.status_data}
                  callback={(res) => this.handleChangeSelect("status", res)}
                  dataEdit={this.state.status}
                />
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <SelectCommon
                  label="Kolom"
                  options={this.state.column_data}
                  callback={(res) => this.handleChangeSelect("column", res)}
                  dataEdit={this.state.column}
                />
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <SelectSortCommon
                  callback={(res) => this.handleChangeSelect("sort", res)}
                  dataEdit={this.state.sort}
                />
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <div className="form-group">
                  <label>Cari</label>
                  <input
                    className="form-control"
                    type="text"
                    name="any"
                    value={this.state.any}
                    onChange={(e) => this.handleChange(e)}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <button
                  style={{ marginTop: "28px", marginRight: "5px" }}
                  className="btn btn-primary"
                  onClick={this.handleSearch}
                >
                  <i className="fa fa-search" />
                </button>
                <button
                  style={{ marginTop: "28px" }}
                  className="btn btn-primary"
                  onClick={(e) =>
                    this.toggleModal(e, last_page * per_page, per_page)
                  }
                >
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
                <th className="text-black text-center middle nowrap" width="1%">
                  No
                </th>
                <th className="text-black text-center middle nowrap" width="1%">
                  #
                </th>
                <th className="text-black middle nowrap">No. PO</th>
                <th className="text-black middle nowrap">Tanggal</th>
                <th className="text-black middle nowrap">Tanggal Kirim</th>
                <th className="text-black middle nowrap">Nama Supplier</th>
                <th className="text-black middle nowrap">Lokasi</th>
                <th className="text-black middle nowrap">Jenis</th>
                <th className="text-black middle nowrap">Operator</th>
                <th className="text-black middle nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {typeof data === "object" ? (
                data.map((v, i) => {
                  return (
                    <tr key={i}>
                      <td className="text-center middle nowrap">
                        {generateNo(i, current_page)}
                      </td>
                      <td className="text-center middle nowrap">
                        {/* Example split danger button */}
                        <div className="btn-group">
                          <UncontrolledButtonDropdown>
                            <DropdownToggle caret></DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem
                                onClick={(e) => this.toggle(e, v.no_po, i)}
                              >
                                Detail
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledButtonDropdown>
                        </div>
                      </td>
                      <td className="middle nowrap">{v.no_po}</td>
                      <td className="middle nowrap">
                        {moment(v.tgl_po).format("YYYY-MM-DD")}
                      </td>
                      <td className="middle nowrap">
                        {moment(v.tglkirim).format("YYYY-MM-DD")}
                      </td>
                      <td className="middle nowrap">{v.nama_supplier}</td>
                      <td className="middle nowrap">{v.lokasi}</td>
                      <td className="middle nowrap">{v.jenis}</td>
                      <td className="middle nowrap">{v.kd_kasir}</td>
                      <td className="middle nowrap">
                        {v.status === "0"
                          ? statusQ("warning", "Proses")
                          : statusQ("success", "Order")}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td>No data.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: "20px", float: "right" }}>
          <Paginationq
            current_page={current_page}
            per_page={per_page}
            total={last_page * per_page}
            callback={this.handlePageChange.bind(this)}
          />
        </div>
        {this.state.isModalDetail ? (
          <DetailPoReport
            master={this.state.master}
            poReportDetail={this.props.dataReportDetail}
          />
        ) : null}

        {this.state.isModalExport ? (
          <PoReportExcel
            startDate={this.state.startDate}
            endDate={this.state.endDate}
          />
        ) : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    poReport: state.poReducer.data,
    poReportExcel: state.poReducer.report_excel,
    dataReportDetail: state.poReducer.dataReportDetail,
    isLoading: state.poReducer.isLoading,
    isLoadingDetail: state.poReducer.isLoadingDetail,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(PoReport);
