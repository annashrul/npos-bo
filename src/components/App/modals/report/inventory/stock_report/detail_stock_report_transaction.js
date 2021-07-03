import React, { Component } from "react";
import { ModalBody, ModalHeader } from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import { ModalType } from "redux/actions/modal.action";
import { FetchStockReportDetailTransaction } from "redux/actions/report/inventory/stock_report.action";
import HeaderDetailCommon from "../../../../common/HeaderDetailCommon";
import TableCommon from "../../../../common/TableCommon";
import { generateNo, noData, toDate } from "../../../../../../helper";
class DetailStockReportTransaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data_lok: [],
    };
    this.toggle = this.toggle.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  toggle(e) {
    e.preventDefault();
    this.props.dispatch(ModalType("detailStockReportSatuan"));
  }

  handlePageChange(page) {
    let where = this.props.detail.where.split("&");
    where.shift();
    let whereToString = `${where}`.replaceAll(",", "&");
    this.props.dispatch(FetchStockReportDetailTransaction(this.props.detail.kd_brg, `page=${page}&${whereToString}`, false));
  }

  render() {
    const { data, total, current_page, per_page } = this.props.stockReportDetailTransaction;
    let totStockIn = 0;
    let totStockOut = 0;
    let totQty = 0;
    let head = [
      { rowSpan: 2, label: "No", className: "text-center", width: "1%" },
      { rowSpan: 2, label: "Kode transaksi" },
      { rowSpan: 2, label: "Tanggal" },
      { colSpan: 2, label: "Stok" },
      { rowSpan: 2, label: "Qty" },
      { rowSpan: 2, label: "Catatan" },
    ];

    let rowSpan = [{ label: "Masuk" }, { label: "Keluar" }];
    return (
      <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailStockReportTransaction"} size="md">
        <ModalHeader toggle={this.toggle}>Detail laporan stok per-transaksi</ModalHeader>
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
                ? data.length > 0
                  ? data.map((v, i) => {
                      totStockIn = totStockIn + parseInt(v.stock_in, 10);
                      totStockOut = totStockOut + parseInt(v.stock_out, 10);
                      totQty = totQty + parseInt(v.qty, 10);
                      return (
                        <tr key={i}>
                          <td className="middle nowrap text-center">{generateNo(i, current_page)}</td>
                          <td className="middle nowrap">{v.kd_trx}</td>
                          <td className="middle nowrap">{toDate(v.tgl)}</td>
                          <td className="middle nowrap text-right">{v.stock_in}</td>
                          <td className="middle nowrap text-right">{v.stock_out}</td>
                          <td className="middle nowrap text-right">{v.qty}</td>
                          <td className="middle nowrap">{v.keterangan}</td>
                        </tr>
                      );
                    })
                  : noData(head.length)
                : noData(head.length)
            }
            footer={[
              {
                data: [
                  { colSpan: 3, label: "Total", className: "text-left" },
                  { colSpan: 1, label: totStockIn },
                  { colSpan: 1, label: totStockOut },
                  { colSpan: 1, label: totQty },
                  { colSpan: 2, label: "" },
                ],
              },
            ]}
          />
          {/* <table className="table">
            <tbody>
              <tr>
                <td className="text-black">Location</td>
                <td className="text-black">: {(lok === undefined ? [] : lok).filter((cat) => cat.kode === localStorage.getItem("locationDetailTrx")).map((filteredCat) => filteredCat.nama)}</td>
              </tr>
              <tr>
                <td className="text-black">Code</td>
                <td className="text-black">: {localStorage.getItem("codeDetailTrx")}</td>
              </tr>
              <tr>
                <td className="text-black">Barcode</td>
                <td className="text-black">: {localStorage.getItem("barcodeDetailTrx")}</td>
              </tr>
              <tr>
                <td className="text-black">Product name</td>
                <td className="text-black">: {localStorage.getItem("nameDetailTrx")}</td>
              </tr>
            </tbody>
          </table>
          <div className="table-responsive" style={{ overflowX: "auto" }}>
            <table className="table table-hover table-bordered">
              <thead className="bg-light">
                <tr>
                  <th className="text-black" style={columnStyle} rowSpan="2">
                    TRX NO
                  </th>
                  <th className="text-black" style={columnStyle} rowSpan="2">
                    DATE
                  </th>
                  <th className="text-black" style={columnStyle} colSpan="2">
                    STOCK
                  </th>
                  <th className="text-black" style={columnStyle} rowSpan="2">
                    QTY
                  </th>
                  <th className="text-black" style={columnStyle} rowSpan="2">
                    NOTE
                  </th>
                </tr>
                <tr>
                  <td className="text-black" style={columnStyle}>
                    IN
                  </td>
                  <td className="text-black" style={columnStyle}>
                    OUT
                  </td>
                </tr>
              </thead>
              <tbody>
                {typeof data === "object" ? (
                  data.length > 0 ? (
                    data.map((v, i) => {
                      totStockIn = totStockIn + parseInt(v.stock_in, 10);
                      totStockOut = totStockOut + parseInt(v.stock_out, 10);
                      totQty = totQty + parseInt(v.qty, 10);

                      return (
                        <tr key={i}>
                          <td style={columnStyle}>{v.kd_trx}</td>
                          <td style={columnStyle}>{moment(v.tgl).format("yyyy-MM-DD")}</td>
                          <td style={{ textAlign: "right" }}>{v.stock_in}</td>
                          <td style={{ textAlign: "right" }}>{v.stock_out}</td>
                          <td style={{ textAlign: "right" }}>{v.qty}</td>
                          <td style={columnStyle}>{v.keterangan}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6">Data Not Available</td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td colSpan="17">Data Not Available</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: "#EEEEEE" }}>
                  <td colSpan="2">TOTAL</td>
                  <td colSpan="1" style={{ textAlign: "right" }}>
                    {totStockIn}
                  </td>
                  <td colSpan="1" style={{ textAlign: "right" }}>
                    {totStockOut}
                  </td>
                  <td colSpan="1" style={{ textAlign: "right" }}>
                    {totQty}
                  </td>
                  <td colSpan="1"></td>
                </tr>
              </tfoot>
            </table>
            <div style={{ marginTop: "20px", float: "right" }}>
              <Paginationq current_page={parseInt(current_page, 10)} per_page={parseInt(per_page, 10)} total={parseInt(per_page * last_page, 10)} callback={this.handlePageChange.bind(this)} />
            </div>
          </div> */}
        </ModalBody>
      </WrapperModal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    stockReportDetailTransaction: state.stockReportReducer.dataDetailTransaksi,
    isLoading: state.stockReportReducer.isLoading,
  };
};
// const mapDispatch
export default connect(mapStateToProps)(DetailStockReportTransaction);
