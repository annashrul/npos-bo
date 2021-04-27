import React, { Component } from "react";
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import Select from "react-select";
import Paginationq from "helper";
import Preloader from "Preloader";
import { rangeDate, toRp } from "helper";
import { FetchReportSaleByProduct } from "redux/actions/sale/sale_by_product.action";
// import Swal from "sweetalert2";
import SaleByProductReportExcel from "components/App/modals/report/sale/form_sale_by_product_excel";
import {
  FetchReportDetailSaleByProduct,
  FetchReportSaleByProductExcel,
} from "redux/actions/sale/sale_by_product.action";
import DetailSaleByProductReport from "../../modals/report/sale/detail_sale_by_product_report";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
// import { HEADERS } from '../../../../redux/actions/_constants';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledButtonDropdown,
} from "reactstrap";

class SaleByProductArchive extends Component {
  constructor(props) {
    super(props);
    this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
    this.HandleChangeType = this.HandleChangeType.bind(this);
    this.handleEvent = this.handleEvent.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    // this.handleDelete = this.handleDelete.bind(this);
    this.handleDetail = this.handleDetail.bind(this);
    this.HandleChangeSort = this.HandleChangeSort.bind(this);
    this.HandleChangeFilter = this.HandleChangeFilter.bind(this);
    this.HandleChangeStatus = this.HandleChangeStatus.bind(this);
    this.state = {
      where_data: "",
      type_data: [],
      type: "",
      location_data: [],
      location: "",
      any_sale_by_product_report: "",
      startDate: moment(new Date()).format("yyyy-MM-DD"),
      endDate: moment(new Date()).format("yyyy-MM-DD"),
      sort: "",
      sort_data: [],
      filter: "",
      filter_data: [],
      status: "",
      status_data: [],
      detail: {},
      isModalDetail: false,
      isModalExport: false,
    };
  }
  componentWillUnmount() {
    this.setState({ isModalDetail: false, isModalExport: false });
  }

  componentWillReceiveProps = (nextProps) => {
    let type = [
      { kode: "", value: "Semua Tipe" },
      { kode: "0", value: "Tunai" },
      { kode: "1", value: "Non Tunai" },
      { kode: "2", value: "Gabungan" },
      { kode: "3", value: "Void" },
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
      { kode: "gross_sales|desc", value: "Penjualan Terbesar" },
      { kode: "gross_sales|asc", value: "Penjualan Terkecil" },
      { kode: "qty_jual|desc", value: "Qty Terbesar" },
      { kode: "qty_jual|asc", value: "Qty Terkecil" },
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
      { kode: "kd_product", value: "Kode Product." },
      { kode: "nama", value: "Nama" },
      { kode: "qty", value: "QTY" },
      { kode: "gross_sales", value: "Gross Sales" },
      { kode: "diskon_item", value: "Diskon Item" },
      { kode: "diskon_trx", value: "Diskon Trx" },
      { kode: "tax", value: "Tax" },
      { kode: "service", value: "Service" },
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
      { kode: "", value: "Semua" },
      { kode: "0", value: "0" },
      { kode: "1", value: "1" },
      { kode: "2", value: "2" },
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
    // localStorage.setItem('status_sale_by_product_report',this.state.status===''||this.state.status===undefined?status[0].kode:localStorage.status_sale_by_product_report)
    localStorage.setItem(
      "sort_sale_by_product_report",
      this.state.sort === "" || this.state.sort === undefined
        ? sort[0].kode
        : localStorage.sort_sale_by_product_report
    );
    localStorage.setItem(
      "filter_sale_by_product_report",
      this.state.filter === "" || this.state.filter === undefined
        ? filter[0].kode
        : localStorage.filter_sale_by_product_report
    );
  };
  componentWillMount() {
    let page = localStorage.getItem("pageNumber_sale_by_product_report");
    this.checkingParameter(page === undefined && page === null ? 1 : page);
  }
  componentDidMount() {
    if (
      localStorage.location_sale_by_product_report !== undefined &&
      localStorage.location_sale_by_product_report !== ""
    ) {
      this.setState({
        location: localStorage.location_sale_by_product_report,
      });
    }

    if (
      localStorage.type_sale_by_product_report !== undefined &&
      localStorage.type_sale_by_product_report !== ""
    ) {
      this.setState({
        type: localStorage.type_sale_by_product_report,
      });
    }
    if (
      localStorage.any_sale_by_product_report !== undefined &&
      localStorage.any_sale_by_product_report !== ""
    ) {
      this.setState({
        any: localStorage.any_sale_by_product_report,
      });
    }
    if (
      localStorage.date_from_sale_by_product_report !== undefined &&
      localStorage.date_from_sale_by_product_report !== null
    ) {
      this.setState({
        startDate: localStorage.date_from_sale_by_product_report,
      });
    }
    if (
      localStorage.date_to_sale_by_product_report !== undefined &&
      localStorage.date_to_sale_by_product_report !== null
    ) {
      this.setState({
        endDate: localStorage.date_to_sale_by_product_report,
      });
    }
    if (
      localStorage.sort_sale_by_product_report !== undefined &&
      localStorage.sort_sale_by_product_report !== null
    ) {
      this.setState({ sort: localStorage.sort_sale_by_product_report });
    }
    if (
      localStorage.filter_sale_by_product_report !== undefined &&
      localStorage.filter_sale_by_product_report !== null
    ) {
      this.setState({ filter: localStorage.filter_sale_by_product_report });
    }
    if (
      localStorage.status_sale_by_product_report !== undefined &&
      localStorage.status_sale_by_product_report !== null
    ) {
      this.setState({ status: localStorage.status_sale_by_product_report });
    }
  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  HandleChangeType(type) {
    this.setState({
      type: type.value,
    });
    localStorage.setItem("type_sale_by_product_report", type.value);
  }
  HandleChangeLokasi(lk) {
    this.setState({
      location: lk.value,
    });
    localStorage.setItem("location_sale_by_product_report", lk.value);
  }
  handleEvent = (event, picker) => {
    const awal = moment(picker.startDate._d).format("YYYY-MM-DD");
    const akhir = moment(picker.endDate._d).format("YYYY-MM-DD");
    localStorage.setItem("date_from_sale_by_product_report", `${awal}`);
    localStorage.setItem("date_to_sale_by_product_report", `${akhir}`);
    this.setState({
      startDate: awal,
      endDate: akhir,
    });
  };
  handleSearch(e) {
    e.preventDefault();
    localStorage.setItem(
      "any_sale_by_product_report",
      this.state.any_sale_by_product_report
    );
    this.checkingParameter(1);
  }
  checkingParameter(pageNumber) {
    let where = "";
    let dateFrom = localStorage.getItem("date_from_sale_by_product_report");
    let dateTo = localStorage.getItem("date_to_sale_by_product_report");
    // let tipe=localStorage.getItem("type_sale_by_product_report");
    let lokasi = localStorage.getItem("location_sale_by_product_report");
    let any = localStorage.getItem("any_sale_by_product_report");
    let sort = localStorage.sort_sale_by_product_report;
    // let filter=localStorage.filter_sale_by_product_report;
    // let status=localStorage.status_sale_by_product_report;
    if (dateFrom !== undefined && dateFrom !== null) {
      if (where !== "") {
        where += "&";
      }
      where += `datefrom=${dateFrom}&dateto=${dateTo}`;
    } else {
      if (where !== "") {
        where += "&";
      }
      where += `datefrom=${this.state.startDate}&dateto=${this.state.endDate}`;
    }
    // if(tipe!==undefined&&tipe!==null&&tipe!==''){
    //     if(where!==''){where+='&'}where+=`type=${tipe}`
    // }
    if (lokasi !== undefined && lokasi !== null && lokasi !== "") {
      if (where !== "") {
        where += "&";
      }
      where += `lokasi=${lokasi}`;
    }
    // if(status!==undefined&&status!==null&&status!==''){
    //     if(where!==''){where+='&'}where+=`status=${status}`;
    // }
    // if(filter!==undefined&&filter!==null&&filter!==''){
    //     if(sort!==undefined&&sort!==null&&sort!==''){
    //         if(where!==''){where+='&'}where+=`sort=${filter}|${sort}`;
    //     }
    // }
    if (sort !== undefined && sort !== null && sort !== "") {
      if (where !== "") {
        where += "&";
      }
      where += `sort=${sort}`;
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
    localStorage.setItem("where_sale_by_product_report", where);
    this.props.dispatch(
      FetchReportSaleByProduct(pageNumber === null ? 1 : pageNumber, where)
    );
    // this.props.dispatch(FetchReportSaleByProductExcel(pageNumber===null?1:pageNumber,where));
  }
  handlePageChange(pageNumber) {
    localStorage.setItem("pageNumber_sale_by_product_report", pageNumber);

    this.checkingParameter(pageNumber);
  }
  handleDetail(
    e,
    kode,
    kd_brg,
    nm_brg,
    deskripsi,
    satuan,
    qty_jual,
    gross_sales,
    diskon_item,
    tax,
    service,
    toko,
    tgl
  ) {
    e.preventDefault();
    localStorage.setItem("kode_sale_by_product_report", kode);
    let dateFrom = localStorage.getItem("date_from_sale_by_product_report");
    let dateTo = localStorage.getItem("date_to_sale_by_product_report");
    this.setState({
      isModalDetail: true,
      detail: {
        kd_brg: kd_brg,
        nm_brg: nm_brg,
        deskripsi: deskripsi,
        satuan: satuan,
        qty_jual: qty_jual,
        gross_sales: gross_sales,
        diskon_item: diskon_item,
        tax: tax,
        service: service,
        toko: toko,
        tgl: tgl,
      },
    });

    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("detailSaleByProductReport"));
    this.props.dispatch(
      FetchReportDetailSaleByProduct(
        kode,
        1,
        dateFrom === null ? this.state.startDate : dateFrom,
        dateTo === null ? this.state.endDate : dateTo
      )
    );
  }

  HandleChangeSort(sr) {
    this.setState({
      sort: sr.value,
    });
    localStorage.setItem("sort_sale_by_product_report", sr.value);
  }
  HandleChangeFilter(fl) {
    this.setState({
      filter: fl.value,
    });
    localStorage.setItem("filter_sale_by_product_report", fl.value);
  }
  HandleChangeStatus(st) {
    this.setState({
      status: st.value,
    });
    localStorage.setItem("status_sale_by_product_report", st.value);
  }
  toggleModal(e, total) {
    e.preventDefault();
    this.setState({ isModalExport: true });
    const bool = !this.props.isOpen;
    // let range = total*perpage;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formSaleByProductExcel"));
    this.props.dispatch(
      FetchReportSaleByProductExcel(1, this.state.where_data, total)
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
    } = this.props.sale_by_productReport;

    return (
      <Layout page="Laporan Arsip Penjualan">
        <div className="row">
          <div className="col-md-10">
            <div className="row">
              <div className="col-6 col-xs-6 col-md-3">
                <div className="form-group">
                  <label htmlFor=""> Periode </label>
                  <DateRangePicker
                    style={{ display: "unset" }}
                    ranges={rangeDate}
                    alwaysShowCalendars={true}
                    onEvent={this.handleEvent}
                  >
                    <input
                      readOnly={true}
                      type="text"
                      className="form-control"
                      name="date_sale_by_product_report"
                      value={`${this.state.startDate} to ${this.state.endDate}`}
                      style={{ padding: "9px", fontWeight: "bolder" }}
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
                  <label className="control-label font-12">Sort</label>
                  <Select
                    options={this.state.sort_data}
                    // placeholder="Pilih Tipe Kas"
                    onChange={this.HandleChangeSort}
                    value={this.state.sort_data.find((op) => {
                      return op.value === this.state.sort;
                    })}
                  />
                </div>
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <div className="form-group">
                  <label htmlFor="">Cari</label>
                  <input
                    type="text"
                    name="any_sale_by_product_report"
                    placeholder="Kode/Barcode/Nama/Deskipsi"
                    className="form-control form-control-lg"
                    value={this.state.any_sale_by_product_report}
                    onChange={(e) => this.handleChange(e)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-xs-12 col-md-2  text-right">
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
              <i className="fa fa-print" />
            </button>
          </div>

          <div className="col-md-12">
            <div style={{ overflowX: "auto", zoom: "85%" }}>
              <table className="table table-hover table-bordered">
                <thead className="bg-light">
                  <tr>
                    <th className="text-black" rowSpan="2" style={columnStyle}>
                      No
                    </th>
                    <th className="text-black" rowSpan="2" style={columnStyle}>
                      #
                    </th>
                    <th className="text-black" rowSpan="2" style={columnStyle}>
                      Kd Barang
                    </th>
                    <th className="text-black" rowSpan="2" style={columnStyle}>
                      Nama
                    </th>
                    <th className="text-black" rowSpan="2" style={columnStyle}>
                      Barcode
                    </th>
                    <th className="text-black" rowSpan="2" style={columnStyle}>
                      Deskripsi
                    </th>
                    <th className="text-black" rowSpan="2" style={columnStyle}>
                      Satuan
                    </th>
                    <th className="text-black" rowSpan="2" style={columnStyle}>
                      Qty
                    </th>
                    <th className="text-black" rowSpan="2" style={columnStyle}>
                      Gross Sales
                    </th>
                    <th className="text-black" rowSpan="2" style={columnStyle}>
                      Diskon Item
                    </th>
                    <th className="text-black" rowSpan="2" style={columnStyle}>
                      Tax
                    </th>
                    <th className="text-black" rowSpan="2" style={columnStyle}>
                      Service
                    </th>
                    {/* <th className="text-black" rowSpan="2" style={columnStyle}>Location</th> */}
                    <th className="text-black" rowSpan="2" style={columnStyle}>
                      Store
                    </th>
                    <th className="text-black" rowSpan="2" style={columnStyle}>
                      Date
                    </th>
                  </tr>
                </thead>
                {!this.props.isLoadingReport ? (
                  <tbody>
                    {typeof data === "object"
                      ? data.length > 0
                        ? data.map((v, i) => {
                            return (
                              <tr key={i}>
                                <td style={columnStyle}>
                                  {" "}
                                  {i +
                                    1 +
                                    10 * (parseInt(current_page, 10) - 1)}
                                </td>
                                <td style={columnStyle}>
                                  <div className="btn-group">
                                    <UncontrolledButtonDropdown>
                                      <DropdownToggle caret>
                                        Aksi
                                      </DropdownToggle>
                                      <DropdownMenu>
                                        <DropdownItem
                                          onClick={(e) =>
                                            this.handleDetail(
                                              e,
                                              btoa(v.barcode),
                                              v.kd_brg,
                                              v.nm_brg,
                                              v.deskripsi,
                                              v.satuan,
                                              v.qty_jual,
                                              v.gross_sales,
                                              v.diskon_item,
                                              v.tax,
                                              v.service,
                                              v.toko,
                                              v.tgl
                                            )
                                          }
                                        >
                                          Detail
                                        </DropdownItem>
                                        {/* <DropdownItem onClick={(e)=>this.handleDelete(e,v.kd_trx)}>Delete</DropdownItem> */}
                                        {/* <DropdownItem href={`${HEADERS.URL}reports/penjualan/${v.kd_trx}.pdf`} target="_blank">Nota</DropdownItem> */}
                                        {/* <Link to={`../print3ply/${v.kd_trx}`}><DropdownItem>3ply</DropdownItem></Link> */}
                                      </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                  </div>
                                </td>
                                <td style={columnStyle}>{v.kd_brg}</td>
                                <td style={columnStyle}>{v.nm_brg}</td>
                                <td style={columnStyle}>{v.barcode}</td>
                                <td style={columnStyle}>{v.deskripsi}</td>
                                <td style={columnStyle}>{v.satuan}</td>
                                <td style={{ textAlign: "right" }}>
                                  {parseInt(v.qty_jual, 10)}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {toRp(parseInt(v.gross_sales, 10))}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  {v.diskon_item}
                                </td>
                                <td style={{ textAlign: "right" }}>{v.tax}</td>
                                <td style={{ textAlign: "right" }}>
                                  {v.service}
                                </td>
                                {/* <td style={columnStyle}>{v.lokasi}</td> */}
                                <td style={columnStyle}>{v.toko}</td>
                                <td style={columnStyle}>
                                  {moment(v.tgl).format("YYYY-MM-DD")}
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
          </div>
        </div>
        {this.state.isModalExport ? (
          <SaleByProductReportExcel
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            location={this.state.location}
          />
        ) : null}
        {this.state.isModalDetail ? (
          <DetailSaleByProductReport
            detailSaleByProduct={this.props.detailSaleByProduct}
            detail={this.state.detail}
            startDate={
              localStorage.getItem("date_from_sale_by_product_report") === null
                ? this.state.startDate
                : localStorage.getItem("date_from_sale_by_product_report")
            }
            endDate={
              localStorage.getItem("date_to_sale_by_product_report") === null
                ? this.state.endDate
                : localStorage.getItem("date_to_sale_by_product_report")
            }
          />
        ) : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    sale_by_productReport: state.sale_by_productReducer.report,
    // totalPenjualan:state.sale_by_productReducer.total_penjualan,
    sale_by_productReportExcel: state.sale_by_productReducer.report_excel,
    totalPenjualanExcel: state.sale_by_productReducer.total_penjualan_excel,
    isLoadingReport: state.sale_by_productReducer.isLoadingReport,
    detailSaleByProduct: state.sale_by_productReducer.dataDetail,
    isLoadingDetail: state.sale_by_productReducer.isLoadingDetail,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(SaleByProductArchive);
