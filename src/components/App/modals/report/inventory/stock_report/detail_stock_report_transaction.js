import React, { Component } from "react";
import { ModalBody, ModalHeader } from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import { ModalType } from "redux/actions/modal.action";
import { FetchStockReportDetailTransaction } from "redux/actions/report/inventory/stock_report.action";
import HeaderDetailCommon from "../../../../common/HeaderDetailCommon";
import TableCommon from "../../../../common/TableCommon";
import { generateNo, noData, parseToRp, toDate } from "../../../../../../helper";
class DetailStockReportTransaction extends Component {
  constructor(props) {
    super(props);
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
    this.props.dispatch(FetchStockReportDetailTransaction(btoa(this.props.detail.kd_brg), `page=${page}&${whereToString}`, false));
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
      <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailStockReportTransaction"} size="lg">
        <ModalHeader toggle={this.toggle}>Detail laporan stok per-transaksi</ModalHeader>
        <ModalBody>
          <HeaderDetailCommon
            md="col-md-12"
            data={[
              { title: "SKU Induk", desc: this.props.detail.kd_brg },
              { title: "Barcode", desc: this.props.detail.barcode },
              { title: "Nama barang", desc: this.props.detail.nm_brg },
              { title: "Ukuran", desc: this.props.detail.ukuran },

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
                          <td className="middle nowrap text-right">{parseToRp(v.stock_in)}</td>
                          <td className="middle nowrap text-right">{parseToRp(v.stock_out)}</td>
                          <td className="middle nowrap text-right">{parseToRp(v.qty)}</td>
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
                  { colSpan: 1, label: parseToRp(totStockIn) },
                  { colSpan: 1, label: parseToRp(totStockOut) },
                  { colSpan: 1, label: parseToRp(totQty) },
                  { colSpan: 2, label: "" },
                ],
              },
            ]}
          />
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
  };
};
export default connect(mapStateToProps)(DetailStockReportTransaction);
