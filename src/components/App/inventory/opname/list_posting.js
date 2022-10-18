import React, { Component } from "react";
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import { FetchPostingOpname, storeOpnamePosting, cancelOpname } from "redux/actions/inventory/opname.action";
import { CURRENT_DATE, DEFAULT_WHERE, generateNo, getFetchWhere, noData, parseToRp, swallOption, toDate } from "../../../../helper";
import TableCommon from "../../common/TableCommon";
import ButtonActionCommon from "../../common/ButtonActionCommon";
import { statusApprovalOpname } from "../../../../helperStatus";
import HeaderReportCommon from "../../common/HeaderReportCommon";

class ListPosting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      where_data: DEFAULT_WHERE,
      startDate: CURRENT_DATE,
      endDate: CURRENT_DATE,
      location: "-",
    };
    this.handlePosting = this.handlePosting.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handlePageChange(pageNumber) {
    this.handleService(this.state.where_data, pageNumber);
  }

  handlePosting(type = "all", kd_trx = null) {
    let data = {};
    if (type !== "all") {
      data["kd_trx"] = kd_trx;
    } else {
      data["datefrom"] = this.state.startDate;
      data["dateto"] = this.state.endDate;
      data["lokasi"] = this.state.location;
    }
    swallOption("Pastikan data yang akan anda posting sudah benar!", () => this.props.dispatch(storeOpnamePosting(data, type)));
  }

  handleCancel(kd_trx) {
    let data = {};
    data["kd_trx"] = kd_trx;
    swallOption("Data yang diubah tidak dapat dikembalikan!", () => this.props.dispatch(cancelOpname(data)));
  }

  handleService(res, page = 1) {
    if (res !== undefined) {
      let location = this.state.location;
      let where = getFetchWhere(res, page);
      if (res.split("&").length > 3) {
        location = res.split("&")[3].split("=")[1];
      }
      let state = { where_data: where, location: location };
      this.setState(state);
      this.props.dispatch(FetchPostingOpname(where));
    }
  }
  render() {
    const { per_page, current_page, data, total } = this.props.data;
    const { total_fisik, total_akhir, total_hpp } = this.props.total !== undefined ? this.props.total : [];
    let total_fisik_per = 0;
    let total_akhir_per = 0;
    let total_hpp_per = 0;
    const head = [
      { rowSpan: 2, label: "No", className: "text-center", width: "1%" },
      { rowSpan: 2, label: "#", className: "text-center", width: "1%" },
      { rowSpan: 2, label: "Kode transaksi", width: "1%" },
      { colSpan: 3, label: "Barang", width: "1%" },
      { rowSpan: 2, label: "Tanggal", width: "1%" },
      { rowSpan: 2, label: "Kasir", width: "1%" },
      { rowSpan: 2, label: "Lokasi", width: "1%" },
      { colSpan: 2, label: "Stok", width: "1%" },
      { rowSpan: 2, label: "Selisih stok", width: "1%" },
      { rowSpan: 2, label: "HPP", width: "1%" },
      { rowSpan: 2, label: "Selisih Hpp", width: "1%" },
      { rowSpan: 2, label: "Status", width: "1%" },
    ];
    let rowSpan = [{ label: "Kode" }, { label: "barcode" }, { label: "Nama" }, { label: "Akhir" }, { label: "Fisik" }];

    return (
      <Layout page="List Posing">
        <div className="row">
          <div className="col-md-12">
            <HeaderReportCommon
              isNotSearch={true}
              pathName="ApprovalOpnameTransaction"
              isLocation={true}
              callbackWhere={(res) => this.handleService(res)}
              renderHeader={
                <div className="col-md-4">
                  <button
                    style={{ marginTop: "28px" }}
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      this.handlePosting("all", null);
                    }}
                  >
                    Posting semua
                  </button>
                </div>
              }
            />
            <TableCommon
              head={head}
              rowSpan={rowSpan}
              meta={{ total: total, current_page: current_page, per_page: per_page }}
              current_page={current_page}
              callbackPage={this.handlePageChange.bind(this)}
              renderRow={
                typeof data === "object"
                  ? data.map((v, i) => {
                      total_fisik_per += parseFloat(v.qty_fisik);
                      total_akhir_per += parseFloat(v.stock_terakhir);
                      total_hpp_per += (parseFloat(v.qty_fisik) - parseFloat(v.stock_terakhir)) * parseInt(v.hrg_beli, 10);
                      return (
                        <tr key={i}>
                          <td className="text-center middle nowrap">{generateNo(i, current_page)}</td>
                          <td className="text-center middle nowrap">
                            <ButtonActionCommon
                              action={[{ label: "Posting" }, { label: "Batalkan" }]}
                              callback={(e) => {
                                if (e === 0) this.handlePosting("item", v.kd_trx);
                                if (e === 1) this.handleCancel(v.kd_trx);
                              }}
                            />
                          </td>
                          <td className="middle nowrap">{v.kd_trx}</td>
                          <td className="middle nowrap">{v.kd_brg}</td>
                          <td className="middle nowrap">{v.barcode}</td>
                          <td className="middle nowrap">{v.nm_brg}</td>
                          <td className="middle nowrap">{toDate(v.tgl)}</td>
                          <td className="middle nowrap">{v.kd_kasir}</td>
                          <td className="middle nowrap">{v.lokasi_nama}</td>
                          <td className="middle nowrap text-right">{parseToRp(v.stock_terakhir)}</td>
                          <td className="middle nowrap text-right">{parseToRp(v.qty_fisik)}</td>
                          <td className="middle nowrap text-right">{parseToRp(parseFloat(v.qty_fisik) - parseFloat(v.stock_terakhir))}</td>
                          <td className="middle nowrap text-right">{parseToRp(v.hrg_beli)}</td>
                          <td className="middle nowrap text-right">{parseToRp((parseFloat(v.qty_fisik) - parseFloat(v.stock_terakhir)) * v.hrg_beli)}</td>
                          <td className="middle nowrap">{statusApprovalOpname("0", true)}</td>
                        </tr>
                      );
                    })
                  : noData(head.length + rowSpan.length)
              }
              footer={[
                {
                  data: [
                    { colSpan: 9, label: "Total perhalaman", className: "text-left" },
                    { colSpan: 1, label: parseToRp(total_akhir_per) },
                    { colSpan: 1, label: parseToRp(total_fisik_per) },
                    { colSpan: 2, label: "" },
                    { colSpan: 1, label: parseToRp(total_hpp_per) },
                    { colSpan: 1, label: "" },
                  ],
                },
                {
                  data: [
                    { colSpan: 9, label: "Total keseluruhan", className: "text-left" },
                    { colSpan: 1, label: parseToRp(total_akhir !== undefined ? total_akhir : 0) },
                    { colSpan: 1, label: parseToRp(total_fisik !== undefined ? total_fisik : 0) },
                    { colSpan: 2, label: "" },
                    { colSpan: 1, label: parseToRp(total_hpp !== undefined && total_hpp !== null ? total_hpp : 0) },
                    { colSpan: 1, label: "" },
                  ],
                },
              ]}
            />
            {/* <div style={{ overflowX: "auto", zoom: "85%" }}>
              <table className="table table-hover table-bordered">
                <thead className="bg-light">
                  <tr>
                    <th className="text-black" style={columnStyle}>
                      Kode trx
                    </th>
                    <th className="text-black" style={columnStyle}>
                      Kode brg
                    </th>
                    <th className="text-black" style={columnStyle}>
                      Barcode
                    </th>
                    <th className="text-black" style={columnStyle}>
                      Tgl
                    </th>
                    <th className="text-black" style={columnStyle}>
                      Kode kasir
                    </th>
                    <th className="text-black" style={columnStyle}>
                      Lokasi
                    </th>
                    <th className="text-black" style={columnStyle}>
                      Nama
                    </th>
                    <th className="text-black" style={columnStyle}>
                      Stock akhir
                    </th>
                    <th className="text-black" style={columnStyle}>
                      Stock fisik
                    </th>
                    <th className="text-black" style={columnStyle}>
                      Selisih Stock
                    </th>
                    <th className="text-black" style={columnStyle}>
                      HPP
                    </th>
                    <th className="text-black" style={columnStyle}>
                      Selisih HPP
                    </th>
                    <th className="text-black" style={columnStyle}>
                      status
                    </th>
                    <th className="text-black" style={columnStyle}>
                      #
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {typeof data === "object"
                    ? data.length > 0
                      ? data.map((v, i) => {
                          total_fisik_per += parseFloat(v.qty_fisik);
                          total_akhir_per += parseFloat(v.stock_terakhir);
                          total_hpp_per += Math.abs(parseFloat(v.qty_fisik) - parseFloat(v.stock_terakhir)) * parseInt(v.hrg_beli, 10);
                          return (
                            <tr key={i}>
                              <td style={columnStyle}>{v.kd_trx}</td>
                              <td style={columnStyle}>{v.kd_brg}</td>
                              <td style={columnStyle}>{v.barcode}</td>
                              <td style={columnStyle}>{moment(v.tgl).format("yyyy-MM-DD")}</td>
                              <td style={columnStyle}>{v.kd_kasir}</td>
                              <td style={columnStyle}>{v.lokasi}</td>
                              <td style={columnStyle}>{v.nm_brg}</td>
                              <td style={{ textAlign: "right" }}>{v.stock_terakhir}</td>
                              <td style={{ textAlign: "right" }}>{v.qty_fisik}</td>
                              <td style={{ textAlign: "right" }}>{parseFloat(v.qty_fisik) - parseFloat(v.stock_terakhir)}</td>
                              <td style={{ textAlign: "right" }}>{toRp(v.hrg_beli, 10)}</td>
                              <td style={{ textAlign: "right" }}>{toRp(Math.abs(parseFloat(v.qty_fisik) - parseFloat(v.stock_terakhir)) * v.hrg_beli)}</td>
                              <td style={{ textAlign: "right" }}>{statusQ("danger", "POSTING")}</td>
                              <td style={columnStyle}>
                                <button className="btn btn-danger btn-sm" onClick={(e) => this.handleCancel(e, v.kd_trx)} style={{ fontSize: "8px" }}>
                                  <i className="fa fa-window-close"></i>
                                </button>
                                {"  "}
                                <button className="btn btn-primary btn-sm" onClick={(e) => this.handleOne(e, v.kd_trx)} style={{ fontSize: "8px" }}>
                                  <i className="fa fa-send"></i>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      : "No data."
                    : "No data."}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="7">TOTAL PERPAGE</td>
                    <td style={{ textAlign: "right" }}>{total_akhir_per}</td>
                    <td style={{ textAlign: "right" }}>{total_fisik_per}</td>
                    <td></td>
                    <td></td>
                    <td style={{ textAlign: "right" }}>{toRp(total_hpp_per)}</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan="7">TOTAL</td>
                    <td style={{ textAlign: "right" }}>{total_akhir !== undefined ? total_akhir : 0}</td>
                    <td style={{ textAlign: "right" }}>{total_fisik !== undefined ? total_fisik : 0}</td>
                    <td></td>
                    <td></td>
                    <td style={{ textAlign: "right" }}>{toRp(total_hpp !== undefined && total_hpp !== null ? total_hpp : 0)}</td>
                    <td></td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div style={{ marginTop: "20px", float: "right" }}>
              <Paginationq current_page={current_page} per_page={per_page} total={last_page * per_page} callback={this.handlePageChange.bind(this)} />
            </div> */}
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStateToPropsCreateItem = (state) => ({
  auth: state.auth,
  data: state.opnameReducer.data,
  total: state.opnameReducer.total_opname,
  isLoading: state.opnameReducer.isLoading,
});

export default connect(mapStateToPropsCreateItem)(ListPosting);
