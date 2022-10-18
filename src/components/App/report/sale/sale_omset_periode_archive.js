import React, { Component } from "react";
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import moment from "moment";
import Paginationq from "helper";
import { toRp } from "helper";
import { FetchReportSaleOmsetPeriode, FetchReportDetailSaleOmsetPeriode, FetchReportSaleOmsetPeriodeExcel } from "redux/actions/sale/sale_omset_periode.action";
import SaleOmsetPeriodeReportExcel from "../../modals/report/sale/form_sale_omset_periode_excel";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown } from "reactstrap";
import SaleOmsetPeriodeDetail from "../../modals/report/sale/form_sale_omset_periode_detail";
import Swal from "sweetalert2";
import { float, generateNo, noData, parseToRp, rmToZero } from "../../../../helper";
import TableCommon from "../../common/TableCommon";

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
      where_data: `sebelum=2021-05&sekarang=2021-06`,
      type_data: [],
      type: "",
      location_data: [],
      location: "",
      any_saleOmsetPeriode_report: "",
      startDate: moment(new Date()).subtract(1, "months").utc(),
      endDate: moment(new Date()).utc(),
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
    this.checkingParameter(page === undefined && page === null ? 1 : page, this.state.startDate, this.state.endDate);
  }
  componentDidMount() {
    if (localStorage.location_saleOmsetPeriode_report !== undefined && localStorage.location_saleOmsetPeriode_report !== "") {
      this.setState({
        location: localStorage.location_saleOmsetPeriode_report,
      });
    }

    if (localStorage.any_saleOmsetPeriode_report !== undefined && localStorage.any_saleOmsetPeriode_report !== "") {
      this.setState({
        any: localStorage.any_saleOmsetPeriode_report,
      });
    }
    // if (
    //   localStorage.date_from_saleOmsetPeriode_report !== undefined &&
    //   localStorage.date_from_saleOmsetPeriode_report !== null
    // ) {
    //   this.setState({
    //     startDate: localStorage.date_from_saleOmsetPeriode_report,
    //   });
    // }
    // if (
    //   localStorage.date_to_saleOmsetPeriode_report !== undefined &&
    //   localStorage.date_to_saleOmsetPeriode_report !== null
    // ) {
    //   this.setState({
    //     endDate: localStorage.date_to_saleOmsetPeriode_report,
    //   });
    // }

    if (localStorage.filter_saleOmsetPeriode_report !== undefined && localStorage.filter_saleOmsetPeriode_report !== null) {
      this.setState({ filter: localStorage.filter_saleOmsetPeriode_report });
    }
    if (localStorage.status_saleOmsetPeriode_report !== undefined && localStorage.status_saleOmsetPeriode_report !== null) {
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
    console.log(param, e);

    if (param === "old") {
      // const old =  moment(e._d).utc();
      // localStorage.setItem("date_from_saleOmsetPeriode_report", `${old}`);
      if (moment(e._d).utc() < moment(this.state.endDate).utc()) {
        this.setState({
          startDate: moment(e._d).utc(),
        });
        this.checkingParameter(1, moment(e._d).utc(), this.state.endDate);
      } else {
        Swal.fire("Error", "Bulan yang dipilih tidak boleh melebihi bulan sekarang");
      }
    } else if (param === "now") {
      // const now =  moment(e._d).utc();
      // localStorage.setItem("date_to_saleOmsetPeriode_report", `${now}`);
      if (moment(e._d).utc() > moment(this.state.startDate).utc()) {
        this.setState({
          endDate: moment(e._d).utc(),
        });
        this.checkingParameter(1, this.state.startDate, moment(e._d).utc());
      } else {
        Swal.fire("Error", "Bulan yang dipilih tidak boleh kurang dari bulan sebelum");
      }
    }
  };
  handleSearch(e) {
    e.preventDefault();
    localStorage.setItem("any_saleOmsetPeriode_report", this.state.any_saleOmsetPeriode_report);
    this.checkingParameter(1);
  }
  checkingParameter(pageNumber, startDate, endDate) {
    let where = "";
    let dateFrom = moment.unix(startDate / 1000).format("yyyy-MM");
    let dateTo = moment.unix(endDate / 1000).format("yyyy-MM");
    // let dateFrom = moment.unix(this.state.startDate/1000).format('yyyy-MM');
    // let dateTo = moment.unix(this.state.endDate/1000).format('yyyy-MM');
    // let any = localStorage.getItem("any_saleOmsetPeriode_report");
    // let filter = localStorage.filter_saleOmsetPeriode_report;
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
    // if (lokasi !== undefined && lokasi !== null && lokasi !== "") {
    //   if (where !== "") {
    //     where += "&";
    //   }
    //   where += `lokasi=${lokasi}`;
    // }

    // if (filter !== undefined && filter !== null && filter !== "") {
    //   if (where !== "") {
    //     where += "&";
    //   }
    //   where += `sort=${filter}`;
    // }
    // if (any !== undefined && any !== null && any !== "") {
    //   if (where !== "") {
    //     where += "&";
    //   }
    //   where += `q=${any}`;
    // }
    this.setState({
      where_data: where,
    });
    localStorage.setItem("where_saleOmsetPeriode_report", pageNumber);
    this.props.dispatch(FetchReportSaleOmsetPeriode(pageNumber === null ? 1 : pageNumber, where));
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
    this.props.dispatch(FetchReportDetailSaleOmsetPeriode(1, btoa(kode), where));
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
    console.log(this.state.where_data);
    const bool = !this.props.isOpen;
    // let range = total*perpage;
    this.setState({ export: true });
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formSaleOmsetPeriodeExcel"));
    this.props.dispatch(FetchReportSaleOmsetPeriodeExcel(1, this.state.where_data, total));
  }

  render() {
    const { total, last_page, per_page, current_page, data } = this.props.data;

    let totalOmsetSebelumPerHalaman = 0;
    let totalTransaksiSebelumPerHalaman = 0;
    let totalRataRataSebelumPerHalaman = 0;
    let totalOmsetSekarangPerHalaman = 0;
    let totalTransaksiSekarangPerHalaman = 0;
    let totalRataRataSekarangPerHalaman = 0;
    let totalPertumbuhanPerHalaman = 0;
    let totalPertumbuhanPersenPerHalaman = 0;

    const head = [
      { rowSpan: 2, label: "No", className: "text-center", width: "1%" },
      { rowSpan: 2, label: "#", className: "text-center", width: "1%" },
      { rowSpan: 2, label: "Lokasi" },
      { colSpan: 3, label: "Bulan lalu" },
      { colSpan: 3, label: "Bulan sekarang" },
      { rowSpan: 2, label: "Pertumbuhan" },
      { rowSpan: 2, label: "Persentase" },
    ];
    const rowSpan = [{ label: "Omset" }, { label: "Transaksi" }, { label: "Rata-rata" }, { label: "Omset" }, { label: "Transaksi" }, { label: "Rata-rata" }];
    return (
      <Layout page="Laporan Arsip Penjualan">
        <div className="row">
          <div className="col-md-10">
            <div className="row">
              <div className="col-6 col-xs-6 col-md-3">
                <div className="form-group">
                  <label htmlFor=""> Bulan Lalu </label>
                  <Datetime dateFormat="YYYY-MM" timeFormat={false} closeOnSelect={true} value={this.state.startDate} onChange={(e) => this.handleDate(e, "old")} />
                </div>
              </div>
              <div className="col-6 col-xs-6 col-md-3">
                <div className="form-group">
                  <label htmlFor=""> Bulan Sekarang </label>
                  <Datetime dateFormat="YYYY-MM" timeFormat={false} closeOnSelect={true} value={this.state.endDate} onChange={(e) => this.handleDate(e, "now")} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="row">
              <div className="col-12 col-xs-12 col-md-12">
                <div className="form-group text-right">
                  <button style={{ marginTop: "28px", marginRight: "5px" }} className="btn btn-primary" onClick={(e) => this.toggleModal(e, last_page * per_page, per_page)}>
                    <i className="fa fa-print" /> Export
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <TableCommon
          head={head}
          rowSpan={rowSpan}
          meta={{ total: total, current_page: current_page, per_page: per_page }}
          current_page={current_page}
          callbackPage={this.handlePageChange.bind(this)}
          renderRow={
            typeof data === "object"
              ? data.length > 0
                ? data.map((v, i) => {
                    let omsetSebelum = float(v.omset_sebelum);
                    let transaksiSebelum = float(v.transaksi_sebelum);
                    let rataRataSebelum = float(omsetSebelum / transaksiSebelum);
                    let omsetSekarang = float(v.omset_sekarang);
                    let transaksiSekarang = float(v.transaksi_sekarang);
                    let rataRataSekarang = float(omsetSekarang / transaksiSekarang);
                    let pertumbuhan = float(omsetSekarang / omsetSebelum);
                    let pertumbuhanPersen = float(((omsetSekarang - omsetSebelum) / omsetSebelum) * 100);

                    rataRataSebelum = rataRataSebelum !== Infinity ? rataRataSebelum : float(0);
                    pertumbuhan = pertumbuhan !== Infinity ? pertumbuhan : float(0);
                    pertumbuhanPersen = pertumbuhanPersen !== Infinity ? pertumbuhanPersen : float(0);
                    rataRataSekarang = rataRataSekarang !== Infinity ? rataRataSekarang : float(0);

                    totalOmsetSebelumPerHalaman += omsetSebelum;
                    totalTransaksiSebelumPerHalaman += transaksiSebelum;
                    totalRataRataSebelumPerHalaman += rataRataSebelum;
                    totalOmsetSekarangPerHalaman += omsetSekarang;
                    totalTransaksiSekarangPerHalaman += transaksiSekarang;
                    totalRataRataSekarangPerHalaman += rataRataSekarang;
                    totalPertumbuhanPerHalaman += pertumbuhan;
                    totalPertumbuhanPersenPerHalaman += pertumbuhanPersen;

                    return (
                      <tr key={i}>
                        <td className="text-center middle nowrap">{generateNo(i, current_page)}</td>
                        <td className="text-center middle nowrap">
                          <div className="btn-group">
                            <UncontrolledButtonDropdown>
                              <DropdownToggle caret></DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem onClick={(e) => this.handleDetail(e, v)}>Detail</DropdownItem>
                              </DropdownMenu>
                            </UncontrolledButtonDropdown>
                          </div>
                        </td>
                        <td className="middle nowrap">{v.nama_toko}</td>
                        <td className="text-right middle nowrap">{parseToRp(omsetSebelum)}</td>
                        <td className="text-right middle nowrap">{parseToRp(transaksiSebelum)}</td>
                        <td className="text-right middle nowrap">{parseToRp(rataRataSebelum)}</td>
                        <td className="text-right middle nowrap">{parseToRp(omsetSekarang)}</td>
                        <td className="text-right middle nowrap">{parseToRp(transaksiSekarang)}</td>
                        <td className="text-right middle nowrap">{parseToRp(rataRataSekarang)}</td>
                        <td className="text-right middle nowrap">{parseToRp(pertumbuhan)}</td>
                        <td className="text-right middle nowrap">{parseToRp(pertumbuhanPersen)} %</td>
                      </tr>
                    );
                  })
                : noData(head.length)
              : noData(head.length)
          }
          footer={[
            {
              data: [
                { colSpan: 3, label: "Total perhalaman", className: "text-left" },
                { colSpan: 1, label: parseToRp(totalOmsetSebelumPerHalaman) },
                { colSpan: 1, label: parseToRp(totalTransaksiSebelumPerHalaman) },
                { colSpan: 1, label: parseToRp(totalRataRataSebelumPerHalaman) },
                { colSpan: 1, label: parseToRp(totalOmsetSekarangPerHalaman) },
                { colSpan: 1, label: parseToRp(totalTransaksiSekarangPerHalaman) },
                { colSpan: 1, label: parseToRp(totalRataRataSekarangPerHalaman) },
                { colSpan: 1, label: parseToRp(totalPertumbuhanPerHalaman) },
                { colSpan: 1, label: parseToRp(totalPertumbuhanPersenPerHalaman) + " %" },
              ],
            },
          ]}
        />
        {this.props.saleOmsetPeriodeReportExcel.data !== undefined && this.props.saleOmsetPeriodeReportExcel.data.length > 0 ? (
          <SaleOmsetPeriodeReportExcel
            startDate={moment.unix(this.state.startDate / 1000).format("yyyy-MM-DD")}
            endDate={moment.unix(this.state.endDate / 1000).format("yyyy-MM-DD")}
            location={this.state.location}
          />
        ) : (
          ""
        )}
        {typeof this.props.detail === "object" ? (
          <SaleOmsetPeriodeDetail
            startDate={moment.unix(this.state.startDate / 1000).format("yyyy-MM-DD")}
            endDate={moment.unix(this.state.endDate / 1000).format("yyyy-MM-DD")}
            dataDetail={this.props.detail}
          />
        ) : (
          ""
        )}
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
