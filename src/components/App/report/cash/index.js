import React, { Component } from "react";
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import {
  FetchCashReportExcel,
  FetchCashReport,
  setUpdate,
  deleteCashTransaksi,
} from "redux/actions/masterdata/cash/cash.action";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import Select from "react-select";
import Paginationq from "helper";
import { kassa, rangeDate, toRp } from "../../../../helper";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import CashReportExcel from "components/App/modals/report/cash/form_cash_excel";
import Updates from "components/App/modals/report/cash/update";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import Otorisasi from "../../modals/otorisasi.modal";
import Swal from "sweetalert2";

class ReportCash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      where_data: "",
      type_data: [],
      type: "",
      location_data: [],
      location: "",
      kassa_data: [],
      kassa: "",
      id_trx: "",
      startDate: moment(new Date()).format("yyyy-MM-DD"),
      endDate: moment(new Date()).format("yyyy-MM-DD"),
      isModalExport: false,
      isModalUpdate: false,
      isModalOtorisasi: false,
    };
    this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
    this.HandleChangeKassa = this.HandleChangeKassa.bind(this);
    this.HandleChangeType = this.HandleChangeType.bind(this);
    this.handleEvent = this.handleEvent.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.onDone = this.onDone.bind(this);
  }
  componentWillUnmount() {
    this.setState({
      isModalExport: false,
      isModalUpdate: false,
      isModalOtorisasi: false,
    });
  }
  onDone(id, id_trx) {
    this.props.dispatch(deleteCashTransaksi(id, id_trx));
    setTimeout(() => {
      this.checkingParameter(1);
    }, 1500);
    this.setState({
      id_trx: "",
    });
  }
  componentWillReceiveProps = (nextProps) => {
    let type = [
      { kode: "", value: "Semua Tipe" },
      { kode: "masuk", value: "Kas Masuk" },
      { kode: "keluar", value: "Kas Keluar" },
    ];
    let data_type = [];
    type.map((i) => {
      data_type.push({
        value: i.kode,
        label: i.value,
      });
      return null;
    });

    this.setState({
      type_data: data_type,
    });
    if (nextProps.auth.user) {
      let lk = [];
      let loc = nextProps.auth.user.lokasi;
      if (loc !== undefined) {
        if (loc.length === 1) {
          this.setState({
            location: loc[0].kode,
          });
        } else {
          lk.push({
            value: "-",
            label: "Semua Lokasi",
          });
        }
        // loc.push({"kode":"","nama":"Semua Lokasi"});
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
  };

  componentWillMount() {
    let page = localStorage.getItem("pageNumber_cash_report");
    if (page !== undefined && page !== null) {
      this.checkingParameter(page);
    } else {
      this.checkingParameter(1);
    }
  }
  componentDidMount() {
    if (
      localStorage.location_cash_report !== undefined &&
      localStorage.location_cash_report !== ""
    ) {
      this.setState({
        location: localStorage.location_cash_report,
      });
    }
    if (
      localStorage.kassa_cash_report !== undefined &&
      localStorage.kassa_cash_report !== ""
    ) {
      this.setState({
        kassa: localStorage.kassa_cash_report,
      });
    }
    if (
      localStorage.type_cash_report !== undefined &&
      localStorage.type_cash_report !== ""
    ) {
      this.setState({
        type: localStorage.type_cash_report,
      });
    }
    if (
      localStorage.date_from_cash_report !== undefined &&
      localStorage.date_from_cash_report !== null
    ) {
      this.setState({
        startDate: localStorage.date_from_cash_report,
      });
    }
    if (
      localStorage.date_to_cash_report !== undefined &&
      localStorage.date_to_cash_report !== null
    ) {
      this.setState({
        endDate: localStorage.date_to_cash_report,
      });
    }
  }
  HandleChangeType(type) {
    this.setState({
      type: type.value,
    });
    localStorage.setItem("type_cash_report", type.value);
  }
  HandleChangeLokasi(lk) {
    this.setState({
      location: lk.value,
    });
    localStorage.setItem("location_cash_report", lk.value);
  }
  HandleChangeKassa(ks) {
    this.setState({
      kassa: ks.value,
    });
    localStorage.setItem("kassa_cash_report", ks.value);
  }
  handleEvent = (event, picker) => {
    const awal = moment(picker.startDate._d).format("YYYY-MM-DD");
    const akhir = moment(picker.endDate._d).format("YYYY-MM-DD");
    localStorage.setItem("date_from_cash_report", `${awal}`);
    localStorage.setItem("date_to_cash_report", `${akhir}`);
    this.setState({
      startDate: awal,
      endDate: akhir,
    });
  };
  handleSearch(e) {
    e.preventDefault();
    let page = localStorage.getItem("pageNumber_cash_report");
    if (page !== undefined && page !== null) {
      this.checkingParameter(page);
    } else {
      this.checkingParameter(1);
    }
  }
  toggleModal(e, total, perpage) {
    e.preventDefault();
    this.setState({ isModalExport: true });
    const bool = !this.props.isOpen;
    // let range = total*perpage;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formCashExcel"));
    this.props.dispatch(FetchCashReportExcel(this.state.where_data, total));
  }

  handleUpdate(e, data) {
    e.preventDefault();
    this.setState({ isModalUpdate: true });

    const bool = !this.props.isOpen;
    this.props.dispatch(setUpdate(data));
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formUpdateKasTrx"));
  }
  handleDelete(e, id) {
    e.preventDefault();
    this.setState({
      id_trx: id,
    });
    Swal.fire({
      allowOutsideClick: false,
      title: "Apakah anda yakin?",
      text: "Data yang telah dihapus tidak bisa dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        this.setState({ isModalOtorisasi: true });

        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("modalOtorisasi"));
      }
    });
  }
  checkingParameter(pageNumber) {
    let where = "";
    let dateFrom = localStorage.getItem("date_from_cash_report");
    let dateTo = localStorage.getItem("date_to_cash_report");
    let tipe = localStorage.getItem("type_cash_report");
    let lokasi = localStorage.getItem("location_cash_report");
    let kassa = localStorage.getItem("kassa_cash_report");
    if (dateFrom !== undefined && dateFrom !== null) {
      if (where !== "") {
        where += "&";
      }
      where += `datefrom=${dateFrom}&dateto=${dateTo}`;
    }
    if (tipe !== undefined && tipe !== null && tipe !== "") {
      if (where !== "") {
        where += "&";
      }
      where += `type_kas=${tipe}`;
    }
    if (lokasi !== undefined && lokasi !== null && lokasi !== "") {
      if (where !== "") {
        where += "&";
      }
      where += `lokasi=${lokasi}`;
    }
    if (kassa !== undefined && kassa !== null && kassa !== "") {
      if (where !== "") {
        where += "&";
      }
      where += `kassa=${kassa}`;
    }

    this.setState({
      where_data: where,
    });

    this.props.dispatch(FetchCashReport(pageNumber, where));
    // this.props.dispatch(FetchCashReportExcel(where));
  }
  handlePageChange(pageNumber) {
    localStorage.setItem("pageNumber_cash_report", pageNumber);
    this.checkingParameter(pageNumber);
  }
  render() {
    const columnStyle = { verticalAlign: "middle", textAlign: "center" };
    const {
      last_page,
      per_page,
      current_page,
      total_kas,
      data,
    } = this.props.cashReport;
    let total_perpage = 0;
    return (
      <Layout page="Laporan Kas">
        <div className="row">
          <div className="col-md-10">
            <div className="row">
              <div className="col-6 col-xs-6 col-md-3">
                <div className="form-group">
                  <label htmlFor=""> Periode </label>
                  <DateRangePicker
                    ranges={rangeDate}
                    alwaysShowCalendars={true}
                    onEvent={this.handleEvent}
                  >
                    <input
                      readOnly={true}
                      type="text"
                      className="form-control"
                      name="date_product"
                      value={`${this.state.startDate} to ${this.state.endDate}`}
                      style={{ padding: "10px", fontWeight: "bolder" }}
                    />
                  </DateRangePicker>
                </div>
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <div className="form-group">
                  <label className="control-label font-12">Lokasi</label>
                  <Select
                    options={this.state.location_data}
                    placeholder="Pilih Lokasi"
                    onChange={this.HandleChangeLokasi}
                    value={this.state.location_data.find((op) => {
                      return op.value === this.state.location;
                    })}
                  />
                </div>
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <div className="form-group">
                  <label className="control-label font-12">Kassa</label>
                  <Select
                    options={kassa("semua")}
                    placeholder="Pilih Kassa"
                    onChange={this.HandleChangeKassa}
                    value={this.state.kassa_data.find((op) => {
                      return op.value === this.state.kassa;
                    })}
                  />
                </div>
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <div className="form-group">
                  <label className="control-label font-12">Tipe Kas</label>
                  <Select
                    options={this.state.type_data}
                    placeholder="Pilih Tipe Kas"
                    onChange={this.HandleChangeType}
                    value={this.state.type_data.find((op) => {
                      return op.value === this.state.type;
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-xs-12 col-md-2 text-right">
            <div className="form-group">
              <label className="control-label font-12"></label>
              <button
                style={{ marginTop: "28px", marginRight: "5px" }}
                className="btn btn-primary"
                onClick={this.handleSearch}
              >
                <i className="fa fa-search"></i>
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
        <div style={{ overflowX: "auto", zoom: "85%" }}>
          <table className="table table-hover table-bordered">
            <thead className="bg-light">
              <tr>
                <th className="text-black" style={columnStyle}>
                  #
                </th>
                <th className="text-black" style={columnStyle}>
                  Kode Transaksi
                </th>
                <th className="text-black" style={columnStyle}>
                  Tipe
                </th>
                <th className="text-black" style={columnStyle}>
                  Jenis
                </th>
                <th className="text-black" style={columnStyle}>
                  Lokasi
                </th>
                <th className="text-black" style={columnStyle}>
                  Kasir
                </th>
                <th className="text-black" style={columnStyle}>
                  Jumlah
                </th>
                <th className="text-black" style={columnStyle}>
                  Keterangan
                </th>
                <th className="text-black" style={columnStyle}>
                  Tanggal
                </th>
                {/* <th className="text-black" style={columnStyle}>Aksi</th> */}
              </tr>
            </thead>
            {
              <tbody>
                {typeof data === "object" ? (
                  data.length > 0 ? (
                    data.map((v, i) => {
                      total_perpage += parseInt(v.jumlah, 10);
                      return (
                        <tr key={i}>
                          <td style={columnStyle}>
                            <UncontrolledButtonDropdown>
                              <DropdownToggle caret>Aksi</DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem
                                  onClick={(event) => {
                                    this.handleUpdate(event, {
                                      kd_trx: v.kd_trx,
                                      jumlah: v.jumlah,
                                      keterangan: v.keterangan,
                                      tgl: v.tgl,
                                    });
                                  }}
                                >
                                  Edit
                                </DropdownItem>
                                <DropdownItem
                                  onClick={(e) =>
                                    this.handleDelete(e, v.kd_trx)
                                  }
                                >
                                  Delete
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledButtonDropdown>
                          </td>
                          <td style={columnStyle}>{v.kd_trx}</td>
                          <td style={columnStyle}>{v.type}</td>
                          <td style={columnStyle}>{v.jenis}</td>
                          <td style={columnStyle}>
                            {v.lokasi} ({v.kassa})
                          </td>
                          <td style={columnStyle}>{v.kasir}</td>
                          <td style={columnStyle}>{toRp(v.jumlah)}</td>
                          <td style={columnStyle}>{v.keterangan}</td>
                          <td style={columnStyle}>
                            {moment(v.tgl).format("yyyy-MM-DD hh:mm:ss")}
                          </td>
                          {/* <td style={columnStyle}><button className="btn btn-success" ><i className="fa fa-edit"/></button></td> */}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={10}>No Data</td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td colSpan={10}>No Data</td>
                  </tr>
                )}
              </tbody>
            }
            <tfoot className="bg-light">
              <tr style={{ backgroundColor: "rgb(238, 238, 238)" }}>
                <td colSpan="6">TOTAL PERPAGE</td>
                <td style={columnStyle} colSpan="">
                  {toRp(total_perpage)}
                </td>
                <td colSpan="2"></td>
              </tr>
              <tr style={{ backgroundColor: "rgb(238, 238, 238)" }}>
                <td colSpan="6">TOTAL</td>
                <td style={columnStyle} colSpan="">
                  {total_kas === undefined ? 0 : toRp(total_kas.jumlah)}
                </td>
                <td colSpan="2" />
              </tr>
            </tfoot>
          </table>
        </div>
        <div style={{ marginTop: "20px", float: "right" }}>
          <Paginationq
            current_page={parseInt(current_page, 10)}
            per_page={parseInt(per_page, 10)}
            total={parseInt(per_page * last_page, 10)}
            callback={this.handlePageChange.bind(this)}
          />
        </div>
        {this.state.isModalExport ? (
          <CashReportExcel
            tipe={this.state.type}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            location={this.state.location}
            kassa={this.state.kassa}
          />
        ) : null}

        {this.state.isModalUpdate ? <Updates /> : null}
        {this.state.isModalOtorisasi ? (
          <Otorisasi
            datum={{
              module: "transaksi kas",
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
    cashReport: state.cashReducer.dataReport,
    cashReportExcel: state.cashReducer.dataExcel,
    isLoadingReport: state.cashReducer.isLoadingReport,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(ReportCash);
