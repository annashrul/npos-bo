import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "../Layout";
import Chart from "react-apexcharts";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import moment from "moment";
import Select from "react-select";
import { toRp } from "helper";
import { FetchStock } from "redux/actions/dashboard/dashboard.action";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import Cookies from "js-cookie";

import socketIOClient from "socket.io-client";
import { HEADERS } from "redux/actions/_constants";
import { rangeDate } from "../../../helper";
import Clock from "../common/clock";
const socket = socketIOClient(HEADERS.URL);

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: localStorage.getItem("startDateDashboard") === null ? moment(new Date()).format("yyyy-MM-DD") : localStorage.getItem("startDateDashboard"),
      endDate: localStorage.getItem("endDateDashboard") === null ? moment(new Date()).format("yyyy-MM-DD") : localStorage.getItem("endDateDashboard"),

      grossSales: "0",
      wGrossSales: 110,
      netSales: "0",
      wNetSales: 110,
      trxNum: "0",
      wTrxNum: 110,
      avgTrx: "0",
      wAvgTrx: 110,

      dataA: [5, 3, 9, 6, 5, 9, 7, 3, 5, 2],
      dataB: [9, 7, 3, 5, 2, 5, 3, 9, 6, 5],
      dataC: [5, 3, 9, 3, 5, 2, 6, 5, 9, 7],
      dataD: [7, 3, 5, 2, 5, 3, 9, 6, 5, 9],

      location_data: [],
      location: "-",

      lokasi_sales: {
        options: {
          chart: {
            id: "basic-bar",
          },
          xaxis: {
            categories: [],
          },
        },
        series: [
          {
            name: "Bulan Lalu",
            data: [],
          },
          {
            name: "Bulan Sekarang",
            data: [],
          },
        ],
      },
      lokasi_tr: {
        options: {
          chart: {
            id: "basic-bar",
          },
          xaxis: {
            categories: [],
          },
        },
        series: [
          {
            name: "Bulan Lalu",
            data: [],
          },
          {
            name: "Bulan Sekarang",
            data: [],
          },
        ],
      },
      daily: {
        options: {
          chart: {
            id: "basic-bar",
          },
          xaxis: {
            categories: ["Monday", "Thuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          },
          colors: ["#F44336", "#E91E63", "#9C27B0", "#F44336", "#E91E63", "#9C27B0", "#9C27B0"],
          dataLabels: {
            enabled: false,
          },
          plotOptions: {
            bar: {
              columnWidth: "45%",
              distributed: true,
            },
          },
          legend: {
            show: false,
          },
        },
        series: [
          {
            // name: "Bulan Lalu",
            data: [0, 0, 0, 0, 0, 0, 0],
          },
        ],
      },
      hourly: {
        options: {
          chart: {
            type: "area",
          },
          xaxis: {
            categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: "smooth",
          },
        },
        series: [
          {
            // name: "Bulan Lalu",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
        ],
      },
      top_item_qty: {
        options: {
          colors: ["#F44336", "#E91E63", "#9C27B0", "#F44336", "#E91E63", "#9C27B0", "#9C27B0", "#9C27B0", "#F44336"],
          xaxis: {
            categories: [],
          },
          plotOptions: {
            bar: {
              horizontal: true,
              columnWidth: "45%",
              distributed: true,
            },
          },
          legend: {
            show: false,
          },
          dataLabels: {
            enabled: false,
          },
        },
        series: [
          {
            // name: "Bulan Lalu",
            data: [],
          },
        ],
      },
      top_item_sale: {
        options: {
          colors: ["#F44336", "#E91E63", "#9C27B0", "#F44336", "#E91E63", "#9C27B0", "#9C27B0", "#9C27B0", "#F44336"],
          xaxis: {
            categories: [],
          },
          plotOptions: {
            bar: {
              horizontal: true,
              columnWidth: "45%",
              distributed: true,
            },
          },
          legend: {
            show: false,
          },
          dataLabels: {
            enabled: false,
          },
        },
        series: [
          {
            // name: "Bulan Lalu",
            data: [],
          },
        ],
      },
      top_cat_qty: {
        options: {
          colors: ["#F44336", "#E91E63", "#9C27B0", "#F44336", "#E91E63", "#9C27B0", "#9C27B0", "#9C27B0", "#F44336"],
          xaxis: {
            categories: [],
          },
          plotOptions: {
            bar: {
              horizontal: true,
              columnWidth: "45%",
              distributed: true,
            },
          },
          legend: {
            show: false,
          },
          dataLabels: {
            enabled: false,
          },
        },
        series: [
          {
            // name: "Bulan Lalu",
            data: [],
          },
        ],
      },
      top_cat_sale: {
        options: {
          colors: ["#F44336", "#E91E63", "#9C27B0", "#F44336", "#E91E63", "#9C27B0", "#9C27B0", "#9C27B0", "#F44336"],
          xaxis: {
            categories: [],
          },
          plotOptions: {
            bar: {
              horizontal: true,
              columnWidth: "45%",
              distributed: true,
            },
          },
          legend: {
            show: false,
          },
          dataLabels: {
            enabled: false,
          },
        },
        series: [
          {
            // name: "Bulan Lalu",
            data: [],
          },
        ],
      },
      top_sp_qty: {
        options: {
          colors: ["#F44336", "#E91E63", "#9C27B0", "#F44336", "#E91E63", "#9C27B0", "#9C27B0", "#9C27B0", "#F44336"],
          xaxis: {
            categories: [],
          },
          plotOptions: {
            bar: {
              horizontal: true,
              columnWidth: "45%",
              distributed: true,
            },
          },
          legend: {
            show: false,
          },
          dataLabels: {
            enabled: false,
          },
        },
        series: [
          {
            // name: "Bulan Lalu",
            data: [],
          },
        ],
      },
      top_sp_sale: {
        options: {
          colors: ["#F44336", "#E91E63", "#9C27B0", "#F44336", "#E91E63", "#9C27B0", "#9C27B0", "#9C27B0", "#F44336"],
          xaxis: {
            categories: [],
          },
          plotOptions: {
            bar: {
              horizontal: true,
              columnWidth: "45%",
              distributed: true,
            },
          },
          legend: {
            show: false,
          },
          dataLabels: {
            enabled: false,
          },
        },
        series: [
          {
            data: [],
          },
        ],
      },
    };

    socket.on("refresh_dashboard", (data) => {
      this.refreshData();
    });

    socket.on("set_dashboard", (data) => {
      if (data.tenant === atob(atob(Cookies.get("tnt=")))) {
        this.setState({
          grossSales: toRp(parseInt(data.header.penjualan, 10)),
          netSales: toRp(parseInt(data.header.net_sales, 10)),
          trxNum: data.header.transaksi,
          avgTrx: toRp(parseInt(data.header.avg, 10)),
          lokasi_sales: data.lokasi_sales,
          lokasi_tr: data.lokasi_tr,
          hourly: data.hourly,
          daily: data.daily,
          top_item_qty: data.top_item_qty,
          top_item_sale: data.top_item_sale,
          top_cat_qty: data.top_cat_qty,
          top_cat_sale: data.top_cat_sale,
          top_sp_qty: data.top_sp_qty,
          top_sp_sale: data.top_sp_sale,
        });
      }
    });
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSelect2 = this.handleSelect2.bind(this);
    this.handleSelect3 = this.handleSelect3.bind(this);
    this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(FetchStock());
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.auth.user) {
      let lk = [];
      let loc = nextProps.auth.user.lokasi;
      if (loc !== undefined) {
        if (loc.length === 1) {
          this.setState({
            location: loc[0].kode,
          });
          this.refreshData(this.state.startDate, this.state.endDate, loc[0].kode);
        } else {
          lk.push({
            value: "-",
            label: "Semua Lokasi",
          });
        }
        loc.map((i) => {
          lk.push({
            value: i.kode,
            label: i.nama,
            label: i.ukuran,
          });
          return null;
        });

        this.setState({
          location_data: lk,
          userid: nextProps.auth.user.id,
        });
      }
    }
  };

  refreshData(start = null, end = null, loc = null) {
    console.log("refersh");
    socket.emit("get_dashboard", {
      datefrom: start !== null ? start : this.state.startDate,
      dateto: end !== null ? end : this.state.endDate,
      location: loc !== null ? loc : this.state.location,
      tenant: atob(Cookies.get("tnt=")),
    });
    console.log("refersh done");
  }

  componentWillMount() {
    this.refreshData();
    // this.props.dispatch(FetchStock());
  }

  componentWillUnmount() {
    localStorage.removeItem("startDateProduct");
    localStorage.removeItem("endDateDashboard");
  }

  onChange = (date) => this.setState({ date });

  handleSelect = (e, index) => {
    this.setState({ selectedIndex: index });
  };
  handleSelect2 = (e, index) => {
    this.setState({ selectedIndex: index });
  };
  handleSelect3 = (e, index) => {
    this.setState({ selectedIndex: index });
  };

  handleEvent = (event, picker) => {
    // end:  2020-07-02T16:59:59.999Z
    const awal = moment(picker.startDate._d).format("YYYY-MM-DD");
    const akhir = moment(picker.endDate._d).format("YYYY-MM-DD");
    this.setState({
      startDate: awal,
      endDate: akhir,
    });
    this.refreshData(awal, akhir, null);
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.refreshData();
  };

  HandleChangeLokasi(lk) {
    let err = Object.assign({}, this.state.error, {
      location: "",
    });
    this.setState({
      location: lk.value,
      error: err,
    });
    this.refreshData(null, null, lk.value);
  }

  HandleStock(e) {
    e.preventDefault();
    this.props.dispatch(FetchStock());
  }

  render() {
    return (
      <Layout page="Dashboard">
        <div className="row align-items-center">
          <div className="col-6">
            <div className="dashboard-header-title mb-3">
              <h5 className="mb-0 font-weight-bold">Dashboard</h5>
            </div>
          </div>
          {/* Dashboard Info Area */}
          <div className="col-6">
            <div className="dashboard-infor-mation d-flex flex-wrap align-items-center mb-3">
              <div className="dashboard-clock">
                <div id="dashboardDate">{moment().format("dddd, Do MMM YYYY")}</div>
                <Clock />
              </div>
              <div className="dashboard-btn-group d-flex align-items-center">
                <button type="button" onClick={(e) => this.handleSubmit(e)} className="btn btn-primary ml-1 float-right">
                  <i className="fa fa-refresh"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row  mb-3">
          {/* Dashboard Info Area */}
          <div className="col-md-2 col-sm-2 col-lg-2">
            <div className="form-group">
              <DateRangePicker ranges={rangeDate} alwaysShowCalendars={true} onEvent={this.handleEvent}>
                <input readOnly type="text" className="form-control" name="date_product" value={`${this.state.startDate} to ${this.state.endDate}`} style={{ padding: "9px", fontWeight: "bolder" }} />
              </DateRangePicker>
            </div>
          </div>
          <div className="col-md-2 col-sm-2 col-lg-2">
            <div className="form-group">
              <Select
                options={this.state.location_data}
                placeholder="Pilih Lokasi"
                defaultValue={{ label: "Select Location", value: "-" }}
                onChange={this.HandleChangeLokasi}
                value={this.state.location_data.find((op) => {
                  return op.value === this.state.location;
                })}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 col-xl-3 box-margin">
            <div className="card">
              <div className="card-header bg-transparent border-bottom-0">GROSS SALES</div>
              <div className="card-body">
                <div className="row justify-content-between" style={{ paddingLeft: 12, paddingRight: 12 }}>
                  <h2>
                    <i className="fa fa-area-chart text-primary"></i>
                  </h2>
                  <h2 style={{ paddingLeft: 5 }} className="font-20">
                    {this.state.grossSales}
                  </h2>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-3 box-margin">
            <div className="card">
              <div className="card-header bg-transparent border-bottom-0">NET SALES</div>
              <div className="card-body">
                <div className="row justify-content-between" style={{ paddingLeft: 12, paddingRight: 12 }}>
                  <h2>
                    <i className="fa fa-bar-chart text-secondary"></i>
                  </h2>
                  <h2 style={{ paddingLeft: 5 }} className="font-20">
                    {this.state.netSales}
                  </h2>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-3 box-margin">
            <div className="card">
              <div className="card-header bg-transparent border-bottom-0">NUMBER OF TRANSACTION</div>
              <div className="card-body">
                <div className="row justify-content-between" style={{ paddingLeft: 12, paddingRight: 12 }}>
                  <h2>
                    <i className="fa fa-line-chart text-success"></i>
                  </h2>
                  <h2 style={{ paddingLeft: 5 }} className="font-20">
                    {this.state.trxNum}
                  </h2>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xl-3 box-margin">
            <div className="card">
              <div className="card-header bg-transparent border-bottom-0">AVG. SALES PER TRANSACTION</div>
              <div className="card-body">
                <div className="row justify-content-between" style={{ paddingLeft: 12, paddingRight: 12 }}>
                  <h2>
                    <i className="fa fa-pie-chart text-danger"></i>
                  </h2>
                  <h2 style={{ paddingLeft: 5 }} className="font-20">
                    {this.state.avgTrx}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 box-margin">
            <div className="card text-center">
              <div className="card-body">
                <h4 className="card-title">MONTHLY SALES AMOUNT</h4>
                <Chart options={this.state.lokasi_sales.options} series={this.state.lokasi_sales.series} type="bar" height="300" />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 box-margin">
            <div className="card text-center">
              <div className="card-body">
                <h4 className="card-title">MONTHLY TRANSACTIONS</h4>
                <Chart options={this.state.lokasi_tr.options} series={this.state.lokasi_tr.series} type="bar" height="300" />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 box-margin">
            <div className="card">
              <div className="card-header bg-transparent text-center">
                <h4 className="card-title mt-3">SALES THIS WEEK</h4>
              </div>
              <div className="card-body">
                <Chart options={this.state.daily.options} series={this.state.daily.series} type="bar" height="300" />
              </div>
            </div>
          </div>
          <div className="col-md-8 box-margin">
            <div className="card">
              <div className="card-header bg-transparent text-center">
                <h4 className="card-title mt-3">HOURLY GROSS SALES AMOUNT</h4>
              </div>
              <div className="card-body">
                <Chart options={this.state.hourly.options} series={this.state.hourly.series} height="300" />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 box-margin">
            <div className="card">
              {/* <div className="card-body"> */}
              <Tabs>
                <div className="card-header bg-transparent user-area d-flex align-items-center justify-content-between">
                  <h4 className="card-title mt-3">TOP 8 ITEMS</h4>
                  <TabList>
                    <Tab onClick={(e) => this.handleSelect(e, 1)}>Volume</Tab>
                    <Tab onClick={(e) => this.handleSelect(e, 2)}>Sales</Tab>
                  </TabList>
                </div>
                <div className="card-body">
                  <TabPanel>
                    {/* <div className="card-body"> */}
                    <Chart options={this.state.top_item_qty.options} series={this.state.top_item_qty.series} type="bar" height="300" />
                    {/* </div> */}
                  </TabPanel>
                  <TabPanel>
                    <Chart options={this.state.top_item_sale.options} series={this.state.top_item_sale.series} type="bar" height="300" />
                  </TabPanel>
                </div>
              </Tabs>
              {/* </div> */}
            </div>
          </div>
          <div className="col-md-6 box-margin">
            <div className="card">
              <Tabs>
                <div className="card-header bg-transparent user-area d-flex align-items-center justify-content-between">
                  <h4 className="card-title mt-3">TOP 8 CATEGORY</h4>
                  <TabList>
                    <Tab onClick={(e) => this.handleSelect2(e, 1)}>Volume</Tab>
                    <Tab onClick={(e) => this.handleSelect2(e, 2)}>Sales</Tab>
                  </TabList>
                </div>
                <div className="card-body">
                  <TabPanel>
                    <Chart options={this.state.top_cat_qty.options} series={this.state.top_cat_qty.series} type="bar" height="300" />
                    {/* </div> */}
                  </TabPanel>
                  <TabPanel>
                    <Chart options={this.state.top_cat_sale.options} series={this.state.top_cat_sale.series} type="bar" height="300" />
                  </TabPanel>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 box-margin">
            <div className="card">
              {/* <div className="card-body"> */}
              <Tabs>
                <div className="card-header bg-transparent user-area d-flex align-items-center justify-content-between">
                  <h4 className="card-title mt-3">TOP 5 SUPPLIER</h4>
                  <TabList>
                    <Tab onClick={(e) => this.handleSelect3(e, 1)}>Volume</Tab>
                    <Tab onClick={(e) => this.handleSelect3(e, 2)}>Sales</Tab>
                  </TabList>
                </div>
                <div className="card-body">
                  <TabPanel>
                    <Chart options={this.state.top_sp_qty.options} series={this.state.top_sp_qty.series} type="bar" height="300" />
                  </TabPanel>
                  <TabPanel>
                    <Chart options={this.state.top_sp_sale.options} series={this.state.top_sp_sale.series} type="bar" height="300" />
                  </TabPanel>
                </div>
              </Tabs>
              {/* </div> */}
            </div>
          </div>
          <div className="col-md-6 box-margin">
            <div className="card">
              <div className="card-header bg-transparent user-area d-flex align-items-center justify-content-between">
                <h4 className="card-title mt-3">STOCK</h4>
                <button type="button" onClick={(e) => this.HandleStock(e)} className="btn btn-primary">
                  <i className="fa fa-refresh"></i>
                </button>
              </div>
              <div className="card-body" style={{ height: "355px", overflowY: "auto" }}>
                {this.props.stock.length !== 0 ? (
                  this.props.stock.map((i, inx) => {
                    return (
                      <div className="widget-download-file d-flex align-items-center justify-content-between mb-4">
                        <div className="d-flex align-items-center mr-3">
                          <div className="download-file-icon mr-3">
                            <img src="img/filemanager-img/1.png" alt=""></img>
                          </div>
                          <div className="user-text-table">
                            <h6 className="d-inline-block font-15 mb-0">{i.nm_brg}</h6><label>--</label>
                            <h6 className="d-inline-block font-15 mb-0">{i.ukuran}</h6>
                            <p className="mb-0">Stock {i.stock}</p>
                          </div>
                        </div>
                        <a href="about:blank" className={"download-link badge " + (i.stock <= 0 ? " badge-danger " : " badge-primary ") + " badge-pill"} style={{ padding: "8px" }}>
                          {i.stock <= 0 ? "Stock kosong" : "Stock ada"}
                        </a>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: "center", fontSize: "11px", fontStyle: "italic" }}>Tidak tersedia.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}
// Dashboard.propTypes = {
//     auth: PropTypes.object
// }

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    stock: state.dashboardReducer.data,
  };
};
export default connect(mapStateToProps)(Dashboard);
