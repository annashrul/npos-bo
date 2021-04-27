import React, { Component } from "react";
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import { FetchLabaRugiReport } from "redux/actions/report/laba_rugi/laba_rugi.action";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import Select from "react-select";
import { rangeDate, toRp } from "../../../../helper";
import { FetchLabaRugiReportExcel } from "../../../../redux/actions/report/laba_rugi/laba_rugi.action";

class ReportLabaRugi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type_data: [],
      type: "",
      location_data: [],
      location: "",
      kassa_data: [],
      kassa: "",
      startDate: moment(new Date()).format("yyyy-MM-DD"),
      endDate: moment(new Date()).format("yyyy-MM-DD"),
    };
    this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
    this.HandleChangeKassa = this.HandleChangeKassa.bind(this);
    this.HandleChangeType = this.HandleChangeType.bind(this);
    this.handleEvent = this.handleEvent.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
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
    let kassa = [
      { value: "Semua Kassa", kode: "" },
      { value: "A", kode: "A" },
      { value: "B", kode: "B" },
      { value: "C", kode: "C" },
      { value: "D", kode: "D" },
      { value: "E", kode: "E" },
      { value: "F", kode: "F" },
      { value: "G", kode: "G" },
      { value: "H", kode: "H" },
      { value: "I", kode: "I" },
      { value: "J", kode: "J" },
      { value: "K", kode: "K" },
      { value: "L", kode: "L" },
      { value: "M", kode: "M" },
      { value: "N", kode: "N" },
      { value: "O", kode: "O" },
      { value: "P", kode: "P" },
      { value: "Q", kode: "Q" },
      { value: "R", kode: "R" },
      { value: "S", kode: "S" },
      { value: "T", kode: "T" },
      { value: "U", kode: "U" },
      { value: "V", kode: "V" },
      { value: "W", kode: "W" },
      { value: "X", kode: "X" },
      { value: "Y", kode: "Y" },
      { value: "Z", kode: "Z" },
    ];
    let data_kassa = [];

    kassa.map((i) => {
      data_kassa.push({
        value: i.kode,
        label: i.value,
      });
      return null;
    });

    this.setState({
      kassa_data: data_kassa,
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
    let page = localStorage.getItem("pageNumber_laba_rugi_report");
    if (page !== undefined && page !== null) {
      this.checkingParameter(page);
    } else {
      this.checkingParameter(1);
    }
  }
  componentDidMount() {
    if (
      localStorage.location_laba_rugi_report !== undefined &&
      localStorage.location_laba_rugi_report !== ""
    ) {
      this.setState({
        location: localStorage.location_laba_rugi_report,
      });
    }
    if (
      localStorage.kassa_laba_rugi_report !== undefined &&
      localStorage.kassa_laba_rugi_report !== ""
    ) {
      this.setState({
        kassa: localStorage.kassa_laba_rugi_report,
      });
    }
    if (
      localStorage.type_laba_rugi_report !== undefined &&
      localStorage.type_laba_rugi_report !== ""
    ) {
      this.setState({
        type: localStorage.type_laba_rugi_report,
      });
    }
    if (
      localStorage.date_from_laba_rugi_report !== undefined &&
      localStorage.date_from_laba_rugi_report !== null
    ) {
      this.setState({
        startDate: localStorage.date_from_laba_rugi_report,
      });
    }
    if (
      localStorage.date_to_laba_rugi_report !== undefined &&
      localStorage.date_to_laba_rugi_report !== null
    ) {
      this.setState({
        endDate: localStorage.date_to_laba_rugi_report,
      });
    }
  }
  HandleChangeType(type) {
    this.setState({
      type: type.value,
    });
    localStorage.setItem("type_laba_rugi_report", type.value);
  }
  HandleChangeLokasi(lk) {
    this.setState({
      location: lk.value,
    });
    localStorage.setItem("location_laba_rugi_report", lk.value);
  }
  HandleChangeKassa(ks) {
    this.setState({
      kassa: ks.value,
    });
    localStorage.setItem("kassa_laba_rugi_report", ks.value);
  }
  handleEvent = (event, picker) => {
    const awal = moment(picker.startDate._d).format("YYYY-MM-DD");
    const akhir = moment(picker.endDate._d).format("YYYY-MM-DD");
    localStorage.setItem("date_from_laba_rugi_report", `${awal}`);
    localStorage.setItem("date_to_laba_rugi_report", `${akhir}`);
    this.setState({
      startDate: awal,
      endDate: akhir,
    });
  };
  handleSearch(e) {
    e.preventDefault();
    let page = localStorage.getItem("pageNumber_laba_rugi_report");
    if (page !== undefined && page !== null) {
      this.checkingParameter(page);
    } else {
      this.checkingParameter(1);
    }
  }
  checkingParameter(pageNumber) {
    let where = "";
    let dateFrom = localStorage.getItem("date_from_laba_rugi_report");
    let dateTo = localStorage.getItem("date_to_laba_rugi_report");
    let tipe = localStorage.getItem("type_laba_rugi_report");
    let lokasi = localStorage.getItem("location_laba_rugi_report");
    let kassa = localStorage.getItem("kassa_laba_rugi_report");
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

    this.props.dispatch(FetchLabaRugiReport(pageNumber, where));
    this.props.dispatch(FetchLabaRugiReportExcel(where));
  }
  handlePageChange(pageNumber) {
    localStorage.setItem("pageNumber_laba_rugi_report", pageNumber);
    this.checkingParameter(pageNumber);
  }
  render() {
    // const columnStyle = {verticalAlign: "middle", textAlign: "center",};
    const {
      penjualan,
      hpp,
      dis_penjualan,
      kas_masuk,
      kas_keluar,
      total_pendapatan,
      total_beban,
      laba,
    } = this.props.laba_rugiReport;
    return (
      <Layout page="Laporan Kas">
        <div className="row">
          <div className="col-6 col-xs-6 col-md-2">
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
          <div className="col-6 col-xs-6 col-md-2">
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
              <label className="control-label font-12"></label>
              <button
                style={{ marginTop: "28px", marginRight: "5px" }}
                className="btn btn-primary"
                onClick={this.handleSearch}
              >
                <i className="fa fa-search"></i>
              </button>
            </div>
          </div>
          <div className="col-md-12 col-lg-12 col-sm-12">
            <div className="col-md-6 col-lg-6 col-sm-6 offset-lg-3 offset-md-3">
              <div className="card rounded box-margin">
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-10 col-sm-10 col-md-10 col-xs-10">
                      {/* <h6 className="mb-0">{item.kasir} - {item.nama_toko} ({item.kassa})</h6> */}
                      <p className="text-12 mb-0">
                        PERIODE{" "}
                        {moment(this.state.startDate)
                          .locale("id")
                          .format("yyyy/MM/DD")}{" "}
                        -{" "}
                        {moment(this.state.endDate)
                          .locale("id")
                          .format("yyyy/MM/DD")}
                      </p>
                    </div>
                    <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 text-right">
                      <div className="dashboard-dropdown">
                        <div className="dropdown">
                          <button
                            className="btn dropdown-toggle"
                            type="button"
                            id="dashboardDropdown50"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <i className="ti-more"></i>
                          </button>
                          <div
                            className="dropdown-menu dropdown-menu-right"
                            aria-labelledby="dashboardDropdown50"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <hr></hr>
                      <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <h5 className="text-15 mb-2 text-left">Pendapatan</h5>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                          <p className="text-10 mb-0 text-left">
                            Total Penjualan
                          </p>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                          <p className="text-12 mb-0 text-right">
                            {toRp(parseInt(penjualan, 10))}
                          </p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                          <p className="text-10 mb-0 text-left">Kas Masuk</p>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                          <p className="text-12 mb-0 text-right">
                            {toRp(parseInt(kas_masuk, 10))}
                          </p>
                        </div>
                      </div>
                      <div className="row mt-1">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                          <h6 className="text-10 mb-0 text-left">
                            Total Pendapatan
                          </h6>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                          <p className="text-12 mb-0 text-right">
                            {toRp(parseInt(total_pendapatan, 10))}
                          </p>
                        </div>
                      </div>
                      <hr></hr>
                      <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <h5 className="text-15 mb-2 text-left">Beban</h5>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                          <p className="text-10 mb-0 text-left">HPP</p>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                          <p className="text-12 mb-0 text-right">
                            {toRp(parseInt(hpp, 10))}
                          </p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                          <p className="text-10 mb-0 text-left">
                            Diskon Penjualan
                          </p>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                          <p className="text-12 mb-0 text-right">
                            {toRp(parseInt(dis_penjualan, 10))}
                          </p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                          <p className="text-10 mb-0 text-left">Kas Keluar</p>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                          <p className="text-12 mb-0 text-right">
                            {toRp(parseInt(kas_keluar, 10))}
                          </p>
                        </div>
                      </div>
                      <div className="row mt-1">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                          <h6 className="text-10 mb-0 text-left">
                            Total Beban
                          </h6>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                          <p className="text-12 mb-0 text-right">
                            {toRp(parseInt(total_beban, 10))}
                          </p>
                        </div>
                      </div>
                      <hr></hr>
                      <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                          <h6 className="text-10 mb-0 text-left">Laba</h6>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                          <p className="text-12 mb-0 text-right">
                            {toRp(parseInt(laba, 10))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* </div>
                            </div> */}
              </div>
            </div>
            {/* <div style={{"marginTop":"20px","float":"right"}}>
                                    <Paginationq
                                        current_page={parseInt(current_page)}
                                        per_page={parseInt(per_page)}
                                        total={parseInt(total)}
                                        callback={this.handlePageChange.bind(this)}
                                    />
                                </div> */}
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    laba_rugiReport: state.laba_rugiReducer.data,
    laba_rugiReportExcel: state.laba_rugiReducer.report_excel,
    isLoadingReport: state.laba_rugiReducer.isLoadingReport,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(ReportLabaRugi);
