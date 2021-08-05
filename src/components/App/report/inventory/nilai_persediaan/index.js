import React, { Component } from "react";
import Layout from "components/App/Layout";
import { FetchNilaiPersediaanReport, FetchNilaiPersediaanReportExcel } from "redux/actions/report/inventory/nilai_persediaan_report.action";
import connect from "react-redux/es/connect/connect";
// import DetailNilaiPersediaanReportSatuan from "components/App/modals/report/inventory/nilai_persediaan_report/detail_nilai_persediaan_report_satuan";
// import NilaiPersediaanReportExcel from "components/App/modals/report/inventory/nilai_persediaan_report/form_nilai_persediaan_report_excel";
import { FetchNilaiPersediaanReportDetailSatuan } from "redux/actions/report/inventory/nilai_persediaan_report.action";
import { HEADERS } from "redux/actions/_constants";
import { CURRENT_DATE, float, generateNo, getFetchWhere, getPeriode, getStorage, isEmptyOrUndefined, noData, parseToRp } from "../../../../../helper";

import TableCommon from "../../../common/TableCommon";
import ButtonActionCommon from "../../../common/ButtonActionCommon";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import Select from "react-select";

class NilaiPersediaanReport extends Component {
  constructor(props) {
    super(props);
    this.handleModal = this.handleModal.bind(this);
    this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
    this.handleChange = this.handleChange.bind(this);
    // this.handleEvent = this.handleEvent.bind(this);

    this.state = {
      where_data: `page=1`,
      periode: "",
      bukaHarga: false,
      location: "",
      location_data: [],
      set_harga: 1,
      // search_by_data: [
      //   { value: "br.kd_brg", label: "Kode Barang" },
      //   { value: "br.nm_brg", label: "Nama Barang" },
      //   { value: "br.group1", label: "Supplier" },
      // ],
      isModalExcel: false,
      isModalDetail: false,
      detail: "",
    };
  }
  componentWillUnmount() {
    this.setState({ isModalDetail: false, isModalExcel: false });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSearch(e) {
    e.preventDefault();
    localStorage.setItem("any_nilai_persediaan_report", this.state.any);
    this.handleParameter(1);
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.auth.user) {
      let lk = [];
      let loc = nextProps.auth.user.lokasi;
      if (loc !== undefined) {
        // lk.push({
        //   value: "",
        //   label: "Semua Lokasi",
        // });
        loc.map((i) => {
          lk.push({
            value: i.kode,
            label: i.nama,
          });
          return null;
        });
        this.setState({
          location_data: lk,
          location:this.state.location===""?'LK/0001':localStorage.lk_nilai_persediaan_report
        });
      }
      this.setState({set_harga:nextProps.auth.user.set_harga})
    }
  };
  HandleChangeLokasi(lk) {
    this.setState({
      location: lk.value,
    });
    localStorage.setItem("lk_nilai_persediaan_report", lk.value);
  }

  handleParameter(pageNumber) {
    let lokasi = localStorage.lk_nilai_persediaan_report;
    let any = localStorage.any_nilai_persediaan_report;
    let where = `&page=${pageNumber===''?1:pageNumber}`;

    if (lokasi !== "" && lokasi !== undefined && lokasi !== null) {
      where += `&lokasi=${lokasi}`;
      this.setState({
        bukaHarga: true,
      });
    } else {
      this.setState({
        bukaHarga: false,
      });
    }

    if (any !== undefined && any !== null && any !== "" && any !== 'undefined') {
      where += `&q=${any}`;
    }
    this.setState({
      where_data: where,
    });
    localStorage.setItem("where_nilai_persediaan_report", pageNumber);
    this.props.dispatch(FetchNilaiPersediaanReport(where));
  }
  // toggleModal(e, total, perpage) {
  //   e.preventDefault();
  //   this.setState({ isModalExcel: true });
  //   const bool = !this.props.isOpen;
  //   this.props.dispatch(ModalToggle(bool));
  //   this.props.dispatch(ModalType("formStockExcel"));
  //   this.props.dispatch(FetchNilaiPersediaanReportExcel(1, this.state.where_data, total));
  // }

  handlePageChange(pageNumber) {
    localStorage.setItem("page_nilai_persediaan_report", pageNumber);
    this.handleParameter(pageNumber);
  }

  handleModal(param, obj) {
    let whereState = this.state.where_data;
    let where = getFetchWhere(whereState);
    let periode = getPeriode(where.split("&"));
    let state = { periode: periode, where_data: where };

    if (param === "formSaleExcel") {
      Object.assign(state, { isModalExcel: true });
      this.props.dispatch(FetchNilaiPersediaanReportExcel(1, where, obj.total));
    } else {
      console.log(this.state.location);
      if (!isEmptyOrUndefined(this.state.location, "lokasi")) return;
      Object.assign(obj, { where_data: where });
      Object.assign(state, { isModalDetail: true, detail: obj });
      this.props.dispatch(FetchNilaiPersediaanReportDetailSatuan(obj.kd_brg, where));
    }
    this.setState(state);
  }

  render() {
    const { per_page, last_page, current_page, data, total } = this.props.nilai_persediaanReport;

    console.log("================",data);

    let total_nilai_persediaan_stock = 0;
    let total_nilai_persediaan_hrg_beli = 0;
    let total_nilai_persediaan_harga = 0;
    let total_nilai_persediaan_harga2 = 0;
    let total_nilai_persediaan_harga3 = 0;
    let total_nilai_persediaan_harga4 = 0;
    let total_nilai_persediaan_total_harga_1 = 0;
    let total_nilai_persediaan_total_harga_2 = 0;
    let total_nilai_persediaan_total_harga_3 = 0;
    let total_nilai_persediaan_total_harga_4 = 0;
    let total_nilai_persediaan_total_harga_beli = 0;

    const { bukaHarga } = this.state;
    
    let head = [
      { rowSpan: "2", label: "No", className: "text-center", width: "1%" },
      // { rowSpan: "2", label: "#", className: "text-center", width: "1%" },
      { rowSpan: "2", colSpan: "1", label: "Kode Barang" },
      { rowSpan: "2", colSpan: "1", label: "Barcode" },
      { rowSpan: "2", colSpan: "1", label: "Nama Barang" },
      { rowSpan: "2", colSpan: "1", label: "Lokasi" },
      { rowSpan: "2", colSpan: "1", label: "Satuan" },
      { rowSpan: "2", colSpan: "1", label: "Stok" },
      // { rowSpan: "2", colSpan: "1", label: "Harga Beli" },
      // { colSpan: "4", label: "Harga" },
      // { colSpan: "4", label: "Total Harga" },
      // { rowSpan: "2", colSpan: "1", label: "Total Harga Beli" },
    ];

    bukaHarga && head.push({ rowSpan: "2", colSpan: "1", label: "Harga Beli" });
    bukaHarga && head.push({ colSpan: this.state.set_harga, label: "Harga" });
    bukaHarga && head.push({ colSpan: this.state.set_harga, label: "Total Harga" });
    bukaHarga && head.push({ rowSpan: "2", colSpan: "1", label: "Total Harga Beli" });

    let rowSpan = [];
    for (let i = 0; i < this.state.set_harga; i++) {
      // const element = array[i];
      bukaHarga && rowSpan.push({ label: i+1 });
    }
    for (let i = 0; i < this.state.set_harga; i++) {
      // const element = array[i];
      bukaHarga && rowSpan.push({ label: i+1 });
    }

    let bukaSetHarga = [];
    for (let i = 0; i < this.state.set_harga; i++) {
      bukaSetHarga.push(i)      
    }


    return (
      <Layout page="Laporan Nilai Persediaan">
        <div className="row">
          <div className="col-md-10">
            <div className="row">
              <div className="col-6 col-xs-6 col-md-2">
                <div className="form-group">
                  <label htmlFor="">Lokasi</label>
                  <Select
                    options={this.state.location_data}
                    onChange={this.HandleChangeLokasi}
                    placeholder="Pilih Lokasi"
                    value={this.state.location_data.find((op) => {
                      return op.value === this.state.location;
                    })}
                  />
                </div>
              </div>

              <div className="col-12 col-xs-12 col-md-3">
                <label htmlFor="exampleFormControlSelect1">
                  Tulis sesuatu disini
                </label>
                <div className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    style={{ padding: "9px", fontWeight: "bolder" }}
                    name="any"
                    value={this.state.any}
                    onChange={(e) => this.handleChange(e)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="row">
              <div
                className="col-12 col-xs-12 col-md-12"
                style={{ textAlign: "right" }}
              >
                <div className="form-group text-right">
                  <button
                    style={{ marginTop: "28px", marginRight: "5px" }}
                    className="btn btn-primary"
                    onClick={(e) => this.handleSearch(e)}
                  >
                    <i className="fa fa-search" />
                  </button>
                  {/* <button
                    style={{ marginTop: "28px" }}
                    className="btn btn-primary"
                    onClick={(e) =>
                      this.toggleModal(e, last_page * per_page, per_page)
                    }
                  >
                    <i className="fa fa-print" />
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <TableCommon
          head={head}
          rowSpan={rowSpan}
          meta={{
            total: total,
            current_page: current_page,
            per_page: per_page,
          }}
          current_page={current_page}
          callbackPage={this.handlePageChange.bind(this)}
          renderRow={
            typeof data === "object"
              ? data.map((v, i) => {
                  const nilai_persediaan_stock = float(v.stock);
                  const nilai_persediaan_hrg_beli = float(v.hrg_beli);
                  const nilai_persediaan_harga = float(v.harga);
                  const nilai_persediaan_harga2 = float(v.harga2);
                  const nilai_persediaan_harga3 = float(v.harga3);
                  const nilai_persediaan_harga4 = float(v.harga4);
                  const nilai_persediaan_total_harga_1 = float(v.total_harga_1);
                  const nilai_persediaan_total_harga_2 = float(v.total_harga_2);
                  const nilai_persediaan_total_harga_3 = float(v.total_harga_3);
                  const nilai_persediaan_total_harga_4 = float(v.total_harga_4);
                  const nilai_persediaan_total_harga_beli = float(v.total_harga_beli);

                  total_nilai_persediaan_stock += nilai_persediaan_stock;
                  total_nilai_persediaan_hrg_beli += nilai_persediaan_hrg_beli;
                  total_nilai_persediaan_harga += nilai_persediaan_harga;
                  total_nilai_persediaan_harga2 += nilai_persediaan_harga2;
                  total_nilai_persediaan_harga3 += nilai_persediaan_harga3;
                  total_nilai_persediaan_harga4 += nilai_persediaan_harga4;
                  total_nilai_persediaan_total_harga_1 += nilai_persediaan_total_harga_1;
                  total_nilai_persediaan_total_harga_2 += nilai_persediaan_total_harga_2;
                  total_nilai_persediaan_total_harga_3 += nilai_persediaan_total_harga_3;
                  total_nilai_persediaan_total_harga_4 += nilai_persediaan_total_harga_4;
                  total_nilai_persediaan_total_harga_beli += nilai_persediaan_total_harga_beli;
                  return (
                    <tr key={i}>
                      <td className="text-center middle nowrap">{generateNo(i, current_page)}</td>
                      {/* <td className="text-center middle nowrap">
                        <ButtonActionCommon
                          action={[{ label: "Detail" }, { label: "Export" }]}
                          callback={(e) => {
                            if (e === 0) this.handleModal("detal", v);
                            if (e === 1) this.props.history.push(`${HEADERS.URL}reports/penjualan/${v.kd_trx}.pdf`);
                          }}
                        />
                      </td> */}
                      <td className="middle nowrap">{v.kd_brg}</td>
                      <td className="middle nowrap">{v.barcode}</td>
                      <td className="middle nowrap">{v.nm_brg}</td>
                      <td className="middle nowrap">{v.lokasi}</td>
                      <td className="middle nowrap">{v.satuan}</td>
                      <td className="text-center middle nowrap">{v.stock}</td>
                      <td className={`text-right middle nowrap ${bukaHarga ? "" : "dNone"}`}>{parseToRp(v.hrg_beli)}</td>

                      {(() => {
                        let tds = [];
                        for (let i = 0; i < this.state.set_harga; i++) {
                          tds.push(
                            <td className={`text-right middle nowrap ${bukaHarga ? "" : "dNone"}`}>{parseToRp(v['harga'+(i===0?'':i+1)])}</td>
                          );
                        }
                        return tds;
                      })()}
                      {/* <td className={`text-right middle nowrap ${bukaHarga ? "" : "dNone"}`}>{parseToRp(v.harga)}</td>
                      <td className={`text-right middle nowrap ${bukaHarga ? "" : "dNone"}`}>{parseToRp(v.harga2)}</td>
                      <td className={`text-right middle nowrap ${bukaHarga ? "" : "dNone"}`}>{parseToRp(v.harga3)}</td>
                      <td className={`text-right middle nowrap ${bukaHarga ? "" : "dNone"}`}>{parseToRp(v.harga4)}</td> */}

                      
                      {(() => {
                        let tds = [];
                        for (let i = 0; i < this.state.set_harga; i++) {
                          tds.push(
                            <td className={`text-right middle nowrap ${bukaHarga ? "" : "dNone"}`}>{parseToRp(v['total_harga_'+i+1])}</td>
                          );
                        }
                        return tds;
                      })()}

                      {/* <td className={`text-right middle nowrap ${bukaHarga ? "" : "dNone"}`}>{parseToRp(v.total_harga_1)}</td>
                      <td className={`text-right middle nowrap ${bukaHarga ? "" : "dNone"}`}>{parseToRp(v.total_harga_2)}</td>
                      <td className={`text-right middle nowrap ${bukaHarga ? "" : "dNone"}`}>{parseToRp(v.total_harga_3)}</td>
                      <td className={`text-right middle nowrap ${bukaHarga ? "" : "dNone"}`}>{parseToRp(v.total_harga_4)}</td> */}
                      
                      <td className={`text-right middle nowrap ${bukaHarga ? "" : "dNone"}`}>{parseToRp(v.total_harga_beli)}</td>

                    </tr>
                  );
                })
              : noData(head.length)
          }
          footer={[
            {
              data: [
                { colSpan: 6, label: "Total perhalaman", className: "text-left" },
                { colSpan: 1, label: parseInt(total_nilai_persediaan_stock), className: `text-center` },
                { colSpan: 1, label: parseToRp(total_nilai_persediaan_hrg_beli), className: `text-right ${bukaHarga ? "" : "dNone"}` },

                { colSpan: 1, label: parseToRp(total_nilai_persediaan_harga), className: `text-right ${bukaHarga && (bukaSetHarga[0]!==undefined && bukaHarga) ? "" : "dNone"}` },
                { colSpan: 1, label: parseToRp(total_nilai_persediaan_harga2), className: `text-right ${bukaHarga && (bukaSetHarga[1]!==undefined && bukaHarga) ? "" : "dNone"}` },
                { colSpan: 1, label: parseToRp(total_nilai_persediaan_harga3), className: `text-right ${bukaHarga && (bukaSetHarga[2]!==undefined && bukaHarga) ? "" : "dNone"}` },
                { colSpan: 1, label: parseToRp(total_nilai_persediaan_harga4), className: `text-right ${bukaHarga && (bukaSetHarga[3]!==undefined && bukaHarga) ? "" : "dNone"}` },

                { colSpan: 1, label: parseToRp(total_nilai_persediaan_total_harga_1), className: `text-right ${bukaHarga && (bukaSetHarga[0]!==undefined && bukaHarga) ? "" : "dNone"}` },
                { colSpan: 1, label: parseToRp(total_nilai_persediaan_total_harga_2), className: `text-right ${bukaHarga && (bukaSetHarga[1]!==undefined && bukaHarga) ? "" : "dNone"}` },
                { colSpan: 1, label: parseToRp(total_nilai_persediaan_total_harga_3), className: `text-right ${bukaHarga && (bukaSetHarga[2]!==undefined && bukaHarga) ? "" : "dNone"}` },
                { colSpan: 1, label: parseToRp(total_nilai_persediaan_total_harga_4), className: `text-right ${bukaHarga && (bukaSetHarga[3]!==undefined && bukaHarga) ? "" : "dNone"}` },
                
                { colSpan: 1, label: parseToRp(total_nilai_persediaan_total_harga_beli), className: `text-right ${bukaHarga ? "" : "dNone"}` },
              ],
            },
          ]}
        />
        {/* {this.props.isOpen && isModalDetail ? <DetailNilaiPersediaanReportSatuan nilai_persediaanReportDetailSatuan={this.props.nilai_persediaanReportDetailSatuan} detail={detail} /> : null}
        {this.props.isOpen && isModalExcel ? <NilaiPersediaanReportExcel startDate={startDate} endDate={endDate} lokasi={location} /> : null} */}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    download: state.nilai_persediaanReportReducer.download,
    nilai_persediaanReport: state.nilai_persediaanReportReducer.data,
    nilai_persediaanReportExcel: state.nilai_persediaanReportReducer.report_excel,
    auth: state.auth,
    nilai_persediaanReportDetailSatuan: state.nilai_persediaanReportReducer.dataDetailSatuan,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(NilaiPersediaanReport);
