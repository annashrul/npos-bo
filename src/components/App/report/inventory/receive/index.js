import React, { Component } from "react";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import { FetchReport } from "redux/actions/purchase/receive/receive.action";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { rangeDate } from "helper";
import Select from "react-select";
import moment from "moment";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import Paginationq from "helper";
import DetailReceiveReport from "../../../modals/report/purchase/receive/detail_receive_report";
import ReceiveReportExcel from "../../../modals/report/purchase/receive/form_receive_excel";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import {
  deleteReceiveReport,
  FetchReceiveData,
  FetchReportExcel,
  FetchReportDetail,
} from "redux/actions/purchase/receive/receive.action";
import { toRp } from "helper";
import FormReturReceive from "../../../modals/report/purchase/receive/form_retur_receive";
import Swal from "sweetalert2";
import {
  dateRange,
  generateNo,
  isEmptyOrUndefined,
} from "../../../../../helper";
import LokasiCommon from "../../../common/LokasiCommon";
import SelectCommon from "../../../common/SelectCommon";

class ReceiveReport extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleEvent = this.handleEvent.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRetur = this.handleRetur.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.state = {
      where_data: "",
      detail: {},
      dateFrom: moment(new Date()).format("yyyy-MM-DD"),
      dateTo: moment(new Date()).format("yyyy-MM-DD"),
      location_data: [],
      location: "",
      type_data: [],
      type: "",
      any: "",
      sort: "",
      sort_data: [],
      filter: "",
      filter_data: [],
      status: "",
      status_data: [],
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
    this.checkingParameter(1);
  }

  componentWillReceiveProps = (nextProps) => {
    let type = [
      { kode: "", value: "Semua Tipe" },
      { kode: "Tunai", value: "Tunai" },
      { kode: "Kredit", value: "Kredit" },
    ];
    let data_type = [];
    type.map((i) => {
      data_type.push({
        value: i.kode,
        label: i.value,
      });
      return null;
    });
    let sort = [
      { kode: "desc", value: "DESCENDING" },
      { kode: "asc", value: "ASCENDING" },
    ];
    let data_sort = [];
    sort.map((i) => {
      data_sort.push({
        value: i.kode,
        label: i.value,
      });
      return null;
    });
    let filter = [
      { kode: "no_faktur_beli", value: "No. Faktur" },
      { kode: "nama_penerima", value: "Penerima" },
    ];
    let data_filter = [];
    filter.map((i) => {
      data_filter.push({
        value: i.kode,
        label: i.value,
      });
      return null;
    });
    let status = [
      { kode: "", value: "Semua Status" },
      { kode: "0", value: "Belum Lunas" },
      { kode: "1", value: "Lunas" },
    ];
    let data_status = [];
    status.map((i) => {
      data_status.push({
        value: i.kode,
        label: i.value,
      });
      return null;
    });
    this.setState({
      sort_data: data_sort,
      filter_data: data_filter,
      status_data: data_status,
      type_data: data_type,
    });
    if (nextProps.auth.user) {
      let lk = [
        {
          value: "",
          label: "Semua Lokasi",
        },
      ];
      let loc = nextProps.auth.user.lokasi;
      if (loc !== undefined) {
        loc.map((i) => {
          lk.push({
            value: i.kode,
            label: i.nama,
          });
          return null;
        });
        this.setState({
          location_data: lk,
        });
      }
    }

    localStorage.setItem(
      "status_receive_report",
      this.state.status === "" || this.state.status === undefined
        ? status[0].kode
        : localStorage.status_receive_report
    );
    localStorage.setItem(
      "sort_receive_report",
      this.state.sort === "" || this.state.sort === undefined
        ? sort[0].kode
        : localStorage.sort_receive_report
    );
    localStorage.setItem(
      "filter_receive_report",
      this.state.filter === "" || this.state.filter === undefined
        ? filter[0].kode
        : localStorage.filter_receive_report
    );
  };
  checkingParameter(pageNumber) {
    console.log("state", this.state);
    let page = pageNumber;
    let dateFrom = this.state.dateFrom;
    let dateTo = this.state.dateTo;
    let type = this.state.type;
    let location = this.state.location;
    let any = this.state.any;
    let sort = this.state.sort;
    let filter = this.state.filter;
    let status = this.state.status;
    let where = `dateFrom=${dateFrom}&dateTo=${dateTo}`;

    if (!isNaN(page)) {
      where += `page=${page}`;
    }
    if (isEmptyOrUndefined(type)) {
      where += `type=${type}`;
    }
    if (isEmptyOrUndefined(location)) {
      where += `lokasi=${location}`;
    }
    if (isEmptyOrUndefined(status)) {
      where += `status=${status}`;
    }
    if (isEmptyOrUndefined(filter)) {
      if (isEmptyOrUndefined(sort)) {
        where += `sort=${filter}|${sort}`;
      }
    }
    if (isEmptyOrUndefined(any)) {
      where += `q=${any}`;
    }
    this.setState({
      where_data: where,
    });
    this.props.dispatch(FetchReport(where));
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleEvent = (first, last) => {};
  handlePageChange(pageNumber) {
    localStorage.setItem("pageNumber_receive_report", pageNumber);
    this.checkingParameter(pageNumber);
  }
  handleSearch(e) {
    e.preventDefault();
    localStorage.setItem("any_receive_report", this.state.any_receive_report);
    this.checkingParameter(1);
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
  handleChangePage(
    e,
    kode,
    lokasi,
    catatan,
    kode_supplier,
    penerima,
    nonota,
    type
  ) {
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
  render() {
    const columnStyle = {
      verticalAlign: "middle",
      textAlign: "center",
      whiteSpace: "nowrap",
    };
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
              <div
                className="col-6 col-xs-6 col-md-3"
                style={{ paddingRight: "0px" }}
              >
                {dateRange((first, last) => {
                  this.setState({
                    dateFrom: first,
                    dateTo: last,
                  });
                }, `${this.state.dateFrom} to ${this.state.dateTo}`)}
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <LokasiCommon
                  callback={(res) => {
                    this.setState({ location: res.value });
                  }}
                  isAll={true}
                />
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <SelectCommon
                  label="Tipe transaksi"
                  options={this.state.type_data}
                  callback={(res) => {
                    this.setState({
                      type: res.value,
                    });
                  }}
                />
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <SelectCommon
                  label="Kolom"
                  options={this.state.filter_data}
                  callback={(res) => {
                    this.setState({
                      filter: res.value,
                    });
                  }}
                />
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <SelectCommon
                  label="Sort"
                  options={this.state.sort_data}
                  callback={(res) => {
                    this.setState({
                      sort: res.value,
                    });
                  }}
                />
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <SelectCommon
                  label="Status"
                  options={this.state.status_data}
                  callback={(res) => {
                    this.setState({
                      status: res.value,
                    });
                  }}
                />
              </div>
              <div className="col-12 col-xs-12 col-md-3">
                <div className="form-group">
                  <label htmlFor="">Cari</label>
                  <input
                    type="text"
                    name="any"
                    className="form-control"
                    style={{ width: "100%" }}
                    value={this.state.any}
                    onChange={(e) => this.handleChange(e)}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <button
                  style={{ marginTop: "27px", marginRight: "2px" }}
                  className="btn btn-primary"
                  onClick={this.handleSearch}
                >
                  <i className="fa fa-search" />
                </button>
                <button
                  style={{ marginTop: "27px" }}
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
              {typeof data === "object" ? (
                data.length > 0 ? (
                  data.map((v, i) => {
                    tot_beli = tot_beli + parseInt(v.total_beli, 10);
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
                                  this.toggle(
                                    e,
                                    v.no_faktur_beli,
                                    moment(v.tgl_beli).format("YYYY-MM-DD"),
                                    v.lokasi,
                                    v.nama_penerima,
                                    v.pelunasan,
                                    v.operator
                                  )
                                }
                              >
                                Detail
                              </DropdownItem>
                              <DropdownItem
                                onClick={(e) =>
                                  this.handleRetur(e, v.no_faktur_beli)
                                }
                              >
                                Retur
                              </DropdownItem>
                              <DropdownItem
                                onClick={(e) =>
                                  this.handleDelete(e, v.no_faktur_beli)
                                }
                              >
                                Delete
                              </DropdownItem>
                              <DropdownItem
                                onClick={(e) =>
                                  this.handleChangePage(
                                    e,
                                    v.no_faktur_beli,
                                    v.kd_lokasi,
                                    "-",
                                    v.kode_supplier,
                                    v.nama_penerima,
                                    v.nonota,
                                    v.type
                                  )
                                }
                              >
                                Edit
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledButtonDropdown>
                        </td>
                        <td className="middle nowrap">{v.no_faktur_beli}</td>
                        <td className="middle nowrap">
                          {moment(v.tgl_beli).format("YYYY-MM-DD")}
                        </td>
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
                        <td className="middle nowrap">
                          {v.pelunasan.toLowerCase() === "lunas"
                            ? 0
                            : toRp(
                                parseFloat(v.total_beli) -
                                  parseFloat(v.jumlah_bayar)
                              )}
                        </td>
                        <td className="middle nowrap">{v.qty_beli}</td>
                        <td className="middle nowrap">
                          {toRp(parseInt(v.total_beli, 10))}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={17}>No Data.</td>
                  </tr>
                )
              ) : (
                <tr>
                  <td colSpan={17}>No Data.</td>
                </tr>
              )}
            </tbody>

            <tfoot>
              <tr style={{ backgroundColor: "#EEEEEE" }}>
                <td colSpan="16">TOTAL PERPAGE</td>
                <td style={{ textAlign: "right" }}>{toRp(tot_beli)}</td>
              </tr>
            </tfoot>
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
        {this.state.isModalDetail ? (
          <DetailReceiveReport
            receiveReportDetail={this.props.receiveReportDetail}
          />
        ) : null}

        {this.state.isModalForm ? (
          <FormReturReceive dataRetur={this.props.dataRetur} />
        ) : null}
        {this.state.isModalExport ? (
          <ReceiveReportExcel
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            location={this.state.location}
          />
        ) : null}
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
