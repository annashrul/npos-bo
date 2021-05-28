import React, { Component } from "react";
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import moment from "moment";
// import DateRangePicker from "react-bootstrap-daterangepicker";
// import Select from "react-select";
import Paginationq from "helper";
import Preloader from "Preloader";
import { toRp } from "helper";
import {
  FetchReportSaleOmsetPeriode,
  FetchReportDetailSaleOmsetPeriode,
  FetchReportSaleOmsetPeriodeExcel,
} from "redux/actions/sale/sale_omset_periode.action";
import SaleOmsetPeriodeReportExcel from "../../modals/report/sale/form_sale_omset_periode_excel";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledButtonDropdown,
} from "reactstrap";
import SaleOmsetPeriodeDetail from "../../modals/report/sale/form_sale_omset_periode_detail";

class SaleOmsetPeriodeArchive extends Component {
  constructor(props) {
    super(props);
    this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
    this.HandleChangeType = this.HandleChangeType.bind(this);
    this.handleEvent = this.handleEvent.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDetail = this.handleDetail.bind(this);
    this.HandleChangeFilter = this.HandleChangeFilter.bind(this);
    this.HandleChangeStatus = this.HandleChangeStatus.bind(this);
    this.state = {
      where_data: "",
      type_data: [],
      type: "",
      location_data: [],
      location: "",
      any_saleOmsetPeriode_report: "",
      startDate: moment(new Date()).subtract(1, "months"),
      endDate: new Date(),
      sort: "",
      sort_data: [],
      filter: "",
      filter_data: [
        {
          value: "qty|DESC",
          label: "Qty Terbesar",
        },
        {
          value: "qty|ASC",
          label: "Qty Terkecil",
        },
        {
          value: "gross_sales|DESC",
          label: "Gross Sales Terbesar",
        },
        {
          value: "gross_sales|ASC",
          label: "Gross Sales Terkecil",
        },
        {
          value: "diskon_item|DESC",
          label: "Diskon Item Terbesar",
        },
        {
          value: "diskon_item|ASC",
          label: "Diskon Item Terkecil",
        },
      ],
      status: "",
      status_data: [],
      export: false,
    };
  }

  componentWillReceiveProps = (nextProps) => {
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
  };
  componentWillMount() {
    let page = localStorage.getItem("pageNumber_saleOmsetPeriode_report");
    this.checkingParameter(page === undefined && page === null ? 1 : page);
  }
  componentDidMount() {
    if (
      localStorage.location_saleOmsetPeriode_report !== undefined &&
      localStorage.location_saleOmsetPeriode_report !== ""
    ) {
      this.setState({
        location: localStorage.location_saleOmsetPeriode_report,
      });
    }

    if (
      localStorage.any_saleOmsetPeriode_report !== undefined &&
      localStorage.any_saleOmsetPeriode_report !== ""
    ) {
      this.setState({
        any: localStorage.any_saleOmsetPeriode_report,
      });
    }
    if (
      localStorage.date_from_saleOmsetPeriode_report !== undefined &&
      localStorage.date_from_saleOmsetPeriode_report !== null
    ) {
      this.setState({
        startDate: localStorage.date_from_saleOmsetPeriode_report,
      });
    }
    if (
      localStorage.date_to_saleOmsetPeriode_report !== undefined &&
      localStorage.date_to_saleOmsetPeriode_report !== null
    ) {
      this.setState({
        endDate: localStorage.date_to_saleOmsetPeriode_report,
      });
    }

    if (
      localStorage.filter_saleOmsetPeriode_report !== undefined &&
      localStorage.filter_saleOmsetPeriode_report !== null
    ) {
      this.setState({ filter: localStorage.filter_saleOmsetPeriode_report });
    }
    if (
      localStorage.status_saleOmsetPeriode_report !== undefined &&
      localStorage.status_saleOmsetPeriode_report !== null
    ) {
      this.setState({ status: localStorage.status_saleOmsetPeriode_report });
    }
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  HandleChangeType(type) {
    this.setState({
      type: type.value,
    });
    localStorage.setItem("type_saleOmsetPeriode_report", type.value);
  }
  HandleChangeLokasi(lk) {
    this.setState({
      location: lk.value,
    });
    localStorage.setItem("location_saleOmsetPeriode_report", lk.value);
  }
  handleEvent = (event, picker) => {
    const awal = moment(picker.startDate._d).format("YYYY-MM-DD");
    const akhir = moment(picker.endDate._d).format("YYYY-MM-DD");
    localStorage.setItem("date_from_saleOmsetPeriode_report", `${awal}`);
    localStorage.setItem("date_to_saleOmsetPeriode_report", `${akhir}`);
    this.setState({
      startDate: awal,
      endDate: akhir,
    });
  };
  handleDate = (e, param) => {
    
    if (param === "old") {
      const old = moment(e._d).format("yyyy-MM");
      localStorage.setItem("date_from_saleOmsetPeriode_report", `${old}`);
      this.setState({
        startDate: moment(e._d).utc(),
      });
    } else if (param === "now") {
      const now = moment(e._d).format("yyyy-MM");
      localStorage.setItem("date_to_saleOmsetPeriode_report", `${now}`);
      this.setState({
        endDate: moment(e._d).utc(),
      });
    }
  };
  handleSearch(e) {
    e.preventDefault();
    localStorage.setItem(
      "any_saleOmsetPeriode_report",
      this.state.any_saleOmsetPeriode_report
    );
    this.checkingParameter(1);
  }
  checkingParameter(pageNumber) {
    let where = "";
    let dateFrom = localStorage.getItem("date_from_saleOmsetPeriode_report");
    let dateTo = localStorage.getItem("date_to_saleOmsetPeriode_report");
    let any = localStorage.getItem("any_saleOmsetPeriode_report");
    let filter = localStorage.filter_saleOmsetPeriode_report;
    let lokasi = localStorage.location_saleOmsetPeriode_report;
    if (dateFrom !== undefined && dateFrom !== null) {
      if (where !== "") {
        where += "&";
      }
      where += `sebelum=${dateFrom}&sekarang=${dateTo}`;
    } else {
      if (where !== "") {
        where += "&";
      }
      where += `sebelum=${this.state.startDate}&sekarang=${this.state.endDate}`;
    }
    if (lokasi !== undefined && lokasi !== null && lokasi !== "") {
      if (where !== "") {
        where += "&";
      }
      where += `lokasi=${lokasi}`;
    }

    if (filter !== undefined && filter !== null && filter !== "") {
      if (where !== "") {
        where += "&";
      }
      where += `sort=${filter}`;
    }
    if (any !== undefined && any !== null && any !== "") {
      if (where !== "") {
        where += "&";
      }
      where += `q=${any}`;
    }
    this.setState({
      where_data: where,
    });
    localStorage.setItem("where_saleOmsetPeriode_report", pageNumber);
    this.props.dispatch(
      FetchReportSaleOmsetPeriode(pageNumber === null ? 1 : pageNumber, where)
    );
    // this.props.dispatch(FetchReportSaleOmsetPeriodeExcel(pageNumber===null?1:pageNumber,where));
  }
  handlePageChange(pageNumber) {
    localStorage.setItem("pageNumber_saleOmsetPeriode_report", pageNumber);
    this.checkingParameter(pageNumber);
  }
  handleDetail(e, kode) {
    e.preventDefault();

    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formSaleOmsetPeriodeExcelDetail"));
    let where = "";
    let dateFrom = localStorage.getItem("date_from_saleOmsetPeriode_report");
    let dateTo = localStorage.getItem("date_to_saleOmsetPeriode_report");
    // let lokasi = localStorage.location_saleOmsetPeriode_report;

    if (dateFrom !== undefined && dateFrom !== null) {
      if (where !== "") {
        where += "&";
      }
      where += `sebelum=${dateFrom}&sekarang=${dateTo}`;
    } else {
      if (where !== "") {
        where += "&";
      }
      where += `sebelum=${this.state.startDate}&sekarang=${this.state.endDate}`;
    }
    // if(lokasi!==undefined&&lokasi!==null&&lokasi!==''){
    //     if(where!==''){where+='&'}where+=`lokasi=${lokasi}`
    // }
    this.props.dispatch(
      FetchReportDetailSaleOmsetPeriode(1, btoa(kode), where)
    );
  }

  HandleChangeFilter(fl) {
    this.setState({
      filter: fl.value,
    });
    localStorage.setItem("filter_saleOmsetPeriode_report", fl.value);
  }
  HandleChangeStatus(st) {
    this.setState({
      status: st.value,
    });
    localStorage.setItem("status_saleOmsetPeriode_report", st.value);
  }
  toggleModal(e, total, perpage) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    // let range = total*perpage;
    this.setState({ export: true });
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formSaleOmsetPeriodeExcel"));
    this.props.dispatch(
      FetchReportSaleOmsetPeriodeExcel(1, this.state.where_data, total)
    );
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

    let tot_omset_sebelum = 0;
    let tot_transaksi_sebelum = 0;
    let tot_rata_sebelum = 0;
    let tot_omset_sekarang = 0;
    let tot_transaksi_sekarang = 0;
    let tot_rata_sekarang = 0;
    let tot_pertumbuhan = 0;
    let tot_persen_pertumbuhan = 0;

    return (
      <Layout page="Laporan Arsip Penjualan">
        <div className="card">
          <div className="card-header">
            <h5>Laporan Omset Periode</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-10">
                <div className="row">
                  <div className="col-6 col-xs-6 col-md-3">
                    <div className="form-group">
                      <label htmlFor=""> Bulan Lalu </label>
                      {/* <DateRangePicker style={{display:'unset'}} ranges={rangeDate} alwaysShowCalendars={true} onEvent={this.handleEvent}>
                                                <input type="text" className="form-control" name="date_saleOmsetPeriode_report" value={`${this.state.startDate} to ${this.state.endDate}`} style={{padding: '9px',fontWeight:'bolder'}}/>
                                            </DateRangePicker> */}
                      <Datetime
                        dateFormat="YYYY-MM"
                        timeFormat={false}
                        closeOnSelect={true}
                        value={this.state.startDate}
                        onChange={(e) => this.handleDate(e, "old")}
                      />
                    </div>
                  </div>
                  <div className="col-6 col-xs-6 col-md-3">
                    <div className="form-group">
                      <label htmlFor=""> Bulan Sekarang </label>
                      {/* <DateRangePicker style={{display:'unset'}} ranges={rangeDate} alwaysShowCalendars={true} onEvent={this.handleEvent}>
                                                <input type="text" className="form-control" name="date_saleOmsetPeriode_report" value={`${this.state.startDate} to ${this.state.endDate}`} style={{padding: '9px',fontWeight:'bolder'}}/>
                                            </DateRangePicker> */}
                      <Datetime
                        dateFormat="YYYY-MM"
                        timeFormat={false}
                        closeOnSelect={true}
                        value={this.state.endDate}
                        onChange={(e) => this.handleDate(e, "now")}
                      />
                    </div>
                  </div>
                  {/* <div className="col-6 col-xs-6 col-md-3">
                                        <div className="form-group">
                                            <label className="control-label font-12">
                                                Filter
                                            </label>
                                            <Select
                                                options={this.state.filter_data}
                                                // placeholder="Pilih Tipe Kas"
                                                onChange={this.HandleChangeFilter}
                                                value={
                                                    this.state.filter_data.find(op => {
                                                        return op.value === this.state.filter
                                                    })
                                                }
                                            />
                                        </div>
                                    </div> */}
                  {/* <div className="col-6 col-xs-6 col-md-3">
                                        <div className="form-group">
                                            <label className="control-label font-12">
                                                Lokasi
                                            </label>
                                            <Select
                                                options={this.state.location_data}
                                                // placeholder="Pilih Tipe Kas"
                                                onChange={this.HandleChangeLokasi}
                                                value={
                                                    this.state.location_data.find(op => {
                                                        return op.value === this.state.location
                                                    })
                                                }
                                            />
                                        </div>
                                    </div> */}

                  {/* <div className="col-6 col-xs-6 col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="">Cari</label>
                                            <input type="text" name="any_saleOmsetPeriode_report" className="form-control form-control-lg" value={this.state.any_saleOmsetPeriode_report} onChange={(e)=>this.handleChange(e)}/>
                                        </div>
                                    </div> */}
                </div>
              </div>
              <div className="col-md-2">
                <div className="row">
                  <div className="col-12 col-xs-12 col-md-12">
                    <div className="form-group text-right">
                      <button
                        style={{ marginTop: "28px", marginRight: "5px" }}
                        className="btn btn-primary"
                        onClick={this.handleSearch}
                      >
                        <i className="fa fa-search" />
                      </button>
                      <button
                        style={{ marginTop: "28px", marginRight: "5px" }}
                        className="btn btn-primary"
                        onClick={(e) =>
                          this.toggleModal(e, last_page * per_page, per_page)
                        }
                      >
                        <i className="fa fa-print" /> Export
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div style={{ overflowX: "auto", zoom: "85%" }}>
                  <table className="table table-hover table-bordered">
                    <thead className="bg-light">
                      <tr>
                        {/* <th className="text-black" rowSpan="2" style={columnStyle}>#</th> */}
                        <th
                          className="text-black"
                          rowSpan="2"
                          style={columnStyle}
                        >
                          No
                        </th>
                        <th
                          className="text-black"
                          rowSpan="2"
                          style={columnStyle}
                        >
                          Aksi
                        </th>
                        <th
                          className="text-black"
                          rowSpan="2"
                          style={columnStyle}
                        >
                          Lokasi
                        </th>
                        <th
                          className="text-black"
                          rowSpan="2"
                          style={columnStyle}
                        >
                          Omset
                          <br />
                          Bulan Lalu
                        </th>
                        <th
                          className="text-black"
                          rowSpan="2"
                          style={columnStyle}
                        >
                          Transaksi
                          <br />
                          Bulan Lalu
                        </th>
                        <th
                          className="text-black"
                          rowSpan="2"
                          style={columnStyle}
                        >
                          Rata - Rata Transaksi
                          <br />
                          Bulan Lalu
                        </th>
                        <th
                          className="text-black"
                          rowSpan="2"
                          style={columnStyle}
                        >
                          Omset
                          <br />
                          Bulan Sekarang
                        </th>
                        <th
                          className="text-black"
                          rowSpan="2"
                          style={columnStyle}
                        >
                          Transaksi
                          <br />
                          Bulan Sekarang
                        </th>
                        <th
                          className="text-black"
                          rowSpan="2"
                          style={columnStyle}
                        >
                          Rata - Rata Transaksi
                          <br />
                          Bulan Sekarang
                        </th>
                        <th
                          className="text-black"
                          rowSpan="2"
                          style={columnStyle}
                        >
                          Pertumbuhan
                        </th>
                        <th
                          className="text-black"
                          rowSpan="2"
                          style={columnStyle}
                        >
                          Persentase
                        </th>
                      </tr>
                    </thead>
                    {!this.props.isLoadingReport ? (
                      <tbody>
                        {typeof data === "object"
                          ? data.length > 0
                            ? data.map((v, i) => {
                                tot_omset_sebelum =
                                  tot_omset_sebelum +
                                  parseInt(v.omset_sebelum, 10);
                                tot_transaksi_sebelum =
                                  tot_transaksi_sebelum +
                                  parseInt(v.transaksi_sebelum, 10);
                                tot_rata_sebelum =
                                  tot_rata_sebelum +
                                  (!Number.isNaN(
                                    parseFloat(v.omset_sebelum) /
                                      parseFloat(v.transaksi_sebelum)
                                  )
                                    ? parseFloat(v.omset_sebelum) /
                                      parseFloat(v.transaksi_sebelum)
                                    : 0);
                                tot_omset_sekarang =
                                  tot_omset_sekarang +
                                  parseInt(v.omset_sekarang, 10);
                                tot_transaksi_sekarang =
                                  tot_transaksi_sekarang +
                                  parseInt(v.transaksi_sekarang, 10);
                                tot_rata_sekarang =
                                  tot_rata_sekarang +
                                  (!Number.isNaN(
                                    parseFloat(v.omset_sekarang) /
                                      parseFloat(v.transaksi_sekarang)
                                  )
                                    ? parseFloat(v.omset_sekarang) /
                                      parseFloat(v.transaksi_sekarang)
                                    : 0);
                                tot_pertumbuhan =
                                  tot_pertumbuhan +
                                  (parseInt(v.omset_sekarang, 10) -
                                    parseInt(v.omset_sebelum, 10));
                                tot_persen_pertumbuhan =
                                  tot_persen_pertumbuhan +
                                  ((!Number.isNaN(
                                    ((parseFloat(v.omset_sekarang) -
                                      parseFloat(v.omset_sebelum)) /
                                      parseFloat(v.omset_sebelum)) *
                                      100
                                  )&&(
                                    ((parseFloat(v.omset_sekarang) - parseFloat(v.omset_sebelum)) / parseFloat(v.omset_sebelum) * 100)
                                  )!==Infinity)
                                    ? ((parseFloat(v.omset_sekarang, 10) -
                                        parseFloat(v.omset_sebelum, 10)) /
                                        parseFloat(v.omset_sebelum, 10)) *
                                      100
                                    : 0);
                                    
                                    
                                return (
                                  <tr key={i}>
                                    <td style={columnStyle}>
                                      {" "}
                                      {i +
                                        1 +
                                        10 * (parseInt(current_page, 10) - 1)}
                                    </td>
                                    <td>
                                      <div className="btn-group">
                                        <UncontrolledButtonDropdown>
                                          <DropdownToggle caret>
                                            Aksi
                                          </DropdownToggle>
                                          <DropdownMenu>
                                            <DropdownItem
                                              onClick={(e) =>
                                                this.handleDetail(e, v)
                                              }
                                            >
                                              Detail
                                            </DropdownItem>
                                            {/* <DropdownItem onClick={(e) => this.handleExport(e, v.kd_trx)}>Export</DropdownItem> */}
                                          </DropdownMenu>
                                        </UncontrolledButtonDropdown>
                                      </div>
                                    </td>
                                    <td style={{ textAlign: "center" }}>
                                      {v.nama_toko}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                      {toRp(parseInt(v.omset_sebelum, 10))}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                      {toRp(parseInt(v.transaksi_sebelum, 10))}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                      {toRp(
                                        !Number.isNaN(
                                          parseInt(v.omset_sebelum, 10) /
                                            parseInt(v.transaksi_sebelum, 10)
                                        )
                                          ? parseFloat(
                                              parseFloat(v.omset_sebelum) /
                                                parseFloat(
                                                  v.transaksi_sebelum
                                                )
                                            ).toFixed(2)
                                          : 0
                                      )}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                      {toRp(parseInt(v.omset_sekarang, 10))}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                      {toRp(parseInt(v.transaksi_sekarang, 10))}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                      {toRp(
                                        !Number.isNaN(
                                          parseInt(v.omset_sekarang, 10) /
                                            parseInt(v.transaksi_sekarang, 10)
                                        )
                                          ? parseFloat(
                                              parseFloat(v.omset_sekarang) /
                                                parseFloat(
                                                  v.transaksi_sekarang
                                                )
                                            ).toFixed(2)
                                          : 0
                                      )}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                      {toRp(
                                        parseInt(v.omset_sekarang, 10) -
                                          parseInt(v.omset_sebelum, 10)
                                      )}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                      {toRp(
                                        (!Number.isNaN(
                                          ((parseFloat(v.omset_sekarang) - parseFloat(v.omset_sebelum)) / parseFloat(v.omset_sebelum) * 100)
                                        )&&(
                                            ((parseFloat(v.omset_sekarang) - parseFloat(v.omset_sebelum)) / parseFloat(v.omset_sebelum) * 100)
                                          )!==Infinity)
                                          ? ((parseFloat(v.omset_sekarang) -
                                              parseFloat(v.omset_sebelum)) /
                                              parseFloat(v.omset_sebelum)) *
                                              100
                                          : 0
                                      )}
                                      %
                                    </td>
                                  </tr>
                                );
                              })
                            : "No data."
                          : "No data."}
                      </tbody>
                    ) : (
                      <Preloader />
                    )}
                    <tfoot>
                      <tr>
                        <td style={columnStyle} colSpan={3}>
                          {" "}
                          Total
                        </td>

                        <td style={{ textAlign: "right" }}>
                          {toRp(parseInt(tot_omset_sebelum, 10))}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {toRp(parseInt(tot_transaksi_sebelum, 10))}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {toRp(parseFloat(tot_rata_sebelum).toFixed(2))}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {toRp(parseInt(tot_omset_sekarang, 10))}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {toRp(parseInt(tot_transaksi_sekarang, 10))}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {toRp(parseFloat(tot_rata_sekarang).toFixed(2))}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {toRp(parseInt(tot_pertumbuhan, 10))}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {toRp(parseInt(tot_persen_pertumbuhan, 10))}%
                        </td>
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
                {this.props.saleOmsetPeriodeReportExcel.data !== undefined &&
                this.props.saleOmsetPeriodeReportExcel.data.length > 0 ? (
                  <SaleOmsetPeriodeReportExcel
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    location={this.state.location}
                  />
                ) : (
                  ""
                )}
                {typeof this.props.detail === "object" ? (
                  <SaleOmsetPeriodeDetail
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    dataDetail={this.props.detail}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
        {/* <Details /> */}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  
  return {
    data: state.saleOmsetPeriodeReducer.data,
    detail: state.saleOmsetPeriodeReducer.detail,
    // totalPenjualan:state.saleOmsetPeriodeReducer.total_penjualan,
    saleOmsetPeriodeReportExcel: state.saleOmsetPeriodeReducer.report_excel,
    totalPenjualanExcel: state.saleOmsetPeriodeReducer.total_penjualan_excel,
    isLoadingReport: state.saleOmsetPeriodeReducer.isLoadingReport,
    detailSaleByCust: state.saleOmsetPeriodeReducer.dataDetail,
    isLoadingDetail: state.saleOmsetPeriodeReducer.isLoadingDetail,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(SaleOmsetPeriodeArchive);
