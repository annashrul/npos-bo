import React, { Component } from "react";
import { ModalBody, ModalHeader } from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import { ModalToggle } from "redux/actions/modal.action";
import { toRp } from "helper";
import DetailStockReportTransaction from "./detail_stock_report_transaction";
import { FetchStockReportDetailTransaction } from "redux/actions/report/inventory/stock_report.action";
import Cookies from "js-cookie";
import HeaderDetailCommon from "../../../../common/HeaderDetailCommon";
import TableCommon from "../../../../common/TableCommon";
import { generateNo, noData } from "../../../../../../helper";
import { FetchStockReportDetailSatuan } from "redux/actions/report/inventory/stock_report.action";

class DetailStockReportSatuan extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      detail: "",
      isModal: false,
    };
  }
  componentWillUnmount() {
    this.setState({ isModal: false });
  }
  toggle(e) {
    e.preventDefault();
    this.setState({ isModal: false });
    this.props.dispatch(ModalToggle(false));
  }

  handelDetailTrx(e, obj) {
    e.preventDefault();
    Object.assign(obj, { where: this.props.detail.where });
    this.setState({ isModal: true, detail: obj });
    this.props.dispatch(FetchStockReportDetailTransaction(obj.kd_brg, obj.where));
  }

  handlePageChange(page) {
    let where = this.props.detail.where.split("&");
    where.shift();
    let whereToString = `${where}`.replaceAll(",", "&");
    this.props.dispatch(FetchStockReportDetailSatuan(this.props.detail.kd_brg, `page=${page}&${whereToString}`, false));
  }

  render() {
    let tenant = atob(atob(Cookies.get("tnt="))) === "giandy-pusat" || atob(atob(Cookies.get("tnt="))) === "giandy-cabang01";
    const { data, total, current_page, per_page } = this.props.stockReportDetailSatuan;
    let totPrice1 = 0;
    let totPrice2 = 0;
    let totPrice3 = 0;
    let totPrice4 = 0;
    let totFirstStock = 0;
    let totLastStock = 0;
    let totStockIn = 0;
    let totStockOut = 0;
    let totHpp = 0;
    let totProfitPrice1 = 0;
    let totProfitPrice2 = 0;
    let totProfitPrice3 = 0;
    let totProfitPrice4 = 0;
    let sumTotPrice1 = 0;
    let sumTotPrice2 = 0;
    let sumTotPrice3 = 0;
    let sumTotPrice4 = 0;
    let head = [
      { rowSpan: 2, label: "No", className: "text-center", width: "1%" },
      { rowSpan: 2, label: "#", className: "text-center", width: "1%" },
      { rowSpan: 2, label: "Lokasi" },
    ];
    !tenant && head.push({ colSpan: 4, label: "Harga" });
    head.push({ colSpan: 4, label: "Stok" });
    !tenant && head.push({ rowSpan: 2, label: "Hpp" }, { colSpan: 4, label: "Profit" }, { colSpan: 4, label: "Total harga" });

    let rowSpan = [];
    !tenant && rowSpan.push({ label: "1" }, { label: "2" }, { label: "3" }, { label: "4" });
    rowSpan.push({ label: "Awal" }, { label: "Masuk" }, { label: "Keluar" }, { label: "Akhir" });
    !tenant && rowSpan.push({ label: "1" }, { label: "2" }, { label: "3" }, { label: "4" });
    !tenant && rowSpan.push({ label: "1" }, { label: "2" }, { label: "3" }, { label: "4" });

    return (
      <div>
        <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailStockReportSatuan"} size="lg">
          <ModalHeader toggle={this.toggle}>Detail laporan stok per-item</ModalHeader>
          <ModalBody>
            <HeaderDetailCommon
              md="col-md-12"
              data={[
                { title: "Kode barang", desc: this.props.detail.kd_brg },
                { title: "Barcode", desc: this.props.detail.barcode },
                { title: "Nama barang", desc: this.props.detail.nm_brg },
              ]}
            />
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
                      totPrice1 = totPrice1 + v.harga;
                      totPrice2 = totPrice2 + v.harga2;
                      totPrice3 = totPrice3 + v.harga3;
                      totPrice4 = totPrice4 + v.harga4;
                      totFirstStock = totFirstStock + v.stock_awal;
                      totLastStock = totLastStock + v.stock_akhir;
                      totStockIn = totStockIn + v.stock_masuk;
                      totStockOut = totStockOut + v.stock_keluar;
                      totHpp = totHpp + v.harga_beli;
                      totProfitPrice1 = totProfitPrice1 + v.profit_hrg1;
                      totProfitPrice2 = totProfitPrice2 + v.profit_hrg2;
                      totProfitPrice3 = totProfitPrice3 + v.profit_hrg3;
                      totProfitPrice4 = totProfitPrice4 + v.profit_hrg4;
                      sumTotPrice1 = sumTotPrice1 + v.total_hrg1;
                      sumTotPrice2 = sumTotPrice2 + v.total_hrg2;
                      sumTotPrice3 = sumTotPrice3 + v.total_hrg3;
                      sumTotPrice4 = sumTotPrice4 + v.total_hrg4;

                      return (
                        <tr key={i}>
                          <td className="middle nowrap text-center">{generateNo(i, current_page)}</td>
                          <td className="middle nowrap">
                            {/* <button style={{ fontSize: "10px" }} className="btn btn-sm btn-primary" onClick={(e) => this.handelDetailTrx(e, v.kd_brg, v.lokasi, v.barcode, v.nm_brg)}> */}
                            <button style={{ fontSize: "10px" }} className="btn btn-sm btn-primary" onClick={(e) => this.handelDetailTrx(e, v)}>
                              Detail
                            </button>
                          </td>
                          <td className={`middle nowrap`}>{v.nama_toko}</td>
                          <td className={`middle nowrap text-right ${!tenant ? "" : "dNone"}`}>{toRp(v.harga)}</td>
                          <td className={`middle nowrap text-right ${!tenant ? "" : "dNone"}`}>{toRp(v.harga2)}</td>
                          <td className={`middle nowrap text-right ${!tenant ? "" : "dNone"}`}>{toRp(v.harga3)}</td>
                          <td className={`middle nowrap text-right ${!tenant ? "" : "dNone"}`}>{toRp(v.harga4)}</td>
                          <td className={`middle nowrap text-right`}>{v.stock_awal}</td>
                          <td className={`middle nowrap text-right`}>{v.stock_masuk}</td>
                          <td className={`middle nowrap text-right`}>{v.stock_keluar}</td>
                          <td className={`middle nowrap text-right`}>{v.stock_akhir}</td>
                          <td className={`middle nowrap text-right ${!tenant ? "" : "dNone"}`}>{toRp(v.harga_beli)}</td>

                          <td className={`middle nowrap text-right ${!tenant ? "" : "dNone"}`}>{toRp(v.profit_hrg1)}</td>
                          <td className={`middle nowrap text-right ${!tenant ? "" : "dNone"}`}>{toRp(v.profit_hrg2)}</td>
                          <td className={`middle nowrap text-right ${!tenant ? "" : "dNone"}`}>{toRp(v.profit_hrg3)}</td>
                          <td className={`middle nowrap text-right ${!tenant ? "" : "dNone"}`}>{toRp(v.profit_hrg4)}</td>

                          <td className={`middle nowrap text-right ${!tenant ? "" : "dNone"}`}>{toRp(v.total_hrg1)}</td>
                          <td className={`middle nowrap text-right ${!tenant ? "" : "dNone"}`}>{toRp(v.total_hrg2)}</td>
                          <td className={`middle nowrap text-right ${!tenant ? "" : "dNone"}`}>{toRp(v.total_hrg3)}</td>
                          <td className={`middle nowrap text-right ${!tenant ? "" : "dNone"}`}>{toRp(v.total_hrg4)}</td>
                        </tr>
                      );
                    })
                  : noData(head.length)
              }
              footer={[
                {
                  data: [
                    { colSpan: 3, label: "Total", className: "text-left" },
                    { colSpan: 1, label: toRp(totPrice1), className: `text-right ${!tenant ? "" : "dNone"}` },
                    { colSpan: 1, label: toRp(totPrice2), className: `text-right ${!tenant ? "" : "dNone"}` },
                    { colSpan: 1, label: toRp(totPrice3), className: `text-right ${!tenant ? "" : "dNone"}` },
                    { colSpan: 1, label: toRp(totPrice4), className: `text-right ${!tenant ? "" : "dNone"}` },
                    { colSpan: 1, label: totFirstStock },
                    { colSpan: 1, label: totStockIn },
                    { colSpan: 1, label: totStockOut },
                    { colSpan: 1, label: totLastStock },
                    { colSpan: 1, label: toRp(totHpp), className: `text-right ${!tenant ? "" : "dNone"}` },
                    { colSpan: 1, label: toRp(totProfitPrice1), className: `text-right ${!tenant ? "" : "dNone"}` },
                    { colSpan: 1, label: toRp(totProfitPrice2), className: `text-right ${!tenant ? "" : "dNone"}` },
                    { colSpan: 1, label: toRp(totProfitPrice3), className: `text-right ${!tenant ? "" : "dNone"}` },
                    { colSpan: 1, label: toRp(totProfitPrice4), className: `text-right ${!tenant ? "" : "dNone"}` },
                    { colSpan: 1, label: toRp(sumTotPrice1), className: `text-right ${!tenant ? "" : "dNone"}` },
                    { colSpan: 1, label: toRp(sumTotPrice2), className: `text-right ${!tenant ? "" : "dNone"}` },
                    { colSpan: 1, label: toRp(sumTotPrice3), className: `text-right ${!tenant ? "" : "dNone"}` },
                    { colSpan: 1, label: toRp(sumTotPrice4), className: `text-right ${!tenant ? "" : "dNone"}` },
                  ],
                },
              ]}
            />
          </ModalBody>
        </WrapperModal>
        {this.props.isOpen && this.state.isModal ? (
          // <DetailStockReportTransaction lok={this.props.lokasi} startDate={this.props.startDate} endDate={this.props.endDate} code={localStorage.getItem("codeDetailTrx")} />
          <DetailStockReportTransaction detail={this.state.detail} />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    auth: state.auth,
  };
};
export default connect(mapStateToProps)(DetailStockReportSatuan);
