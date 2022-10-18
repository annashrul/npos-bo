import React, { Component } from "react";
import { ModalBody, ModalHeader } from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import { ModalToggle } from "redux/actions/modal.action";
import HeaderDetailCommon from "../../../../common/HeaderDetailCommon";
import TableCommon from "../../../../common/TableCommon";
import {
  statusMutasi,
  statusArsipPenjualan,
} from "../../.././../../../helperStatus";
import {
  generateNo,
  getFetchWhere,
  noData,
  parseToRp,
  rmSpaceToStrip,
  toDate,
} from "../../../../../../helper";
import { FetchTransactionData } from "../../../../../../redux/actions/inventory/transaction.action";

class DetailTransaction extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }
  toggle(e) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    localStorage.removeItem("code");
    localStorage.removeItem("barcode");
    localStorage.removeItem("name");
  }

  handlePageChange(page) {
    let where = this.props.where;
    let cek = getFetchWhere(where);
    console.log(cek.replaceAll("page=1", ""));
    this.props.dispatch(
      FetchTransactionData(
        this.props.transactionDetail.no_faktur_mutasi,
        `page=${page}${where.replaceAll("page=1", "")}`
      )
    );
  }

  render() {
    const { per_page, current_page, data, total } =
      this.props.transactionDetail.detail === undefined
        ? []
        : this.props.transactionDetail.detail;
    const master =
      this.props.transactionDetail === undefined
        ? []
        : this.props.transactionDetail;
    const head = [
      { rowSpan: 2, label: "No", className: "text-center", width: "1%" },
      { colSpan: 4, label: "barang" },
      { colSpan: 3, label: "Qty" },
      { colSpan: 2, label: "Harga" },
    ];
    return (
      <div>
        <WrapperModal
          isOpen={this.props.isOpen && this.props.type === "detailTransaction"}
          size="lg"
        >
          <ModalHeader toggle={this.toggle}>Detail Transaction</ModalHeader>
          <ModalBody>
            <HeaderDetailCommon
              data={[
                { title: "Faktur mutasi", desc: master.no_faktur_mutasi },
                {
                  title: "Status penerimaan",
                  desc: statusMutasi(master.status),
                },
                {
                  title: "Faktur beli",
                  desc: rmSpaceToStrip(master.no_faktur_beli),
                },
                {
                  title: "Status pembayaran",
                  desc: statusArsipPenjualan(`${master.status_transaksi}`),
                },
                { title: "Lokasi asal", desc: master.lokasi_asal },
                { title: "Tanggal", desc: toDate(master.tgl_mutasi) },
                { title: "Lokasi tujuan", desc: master.lokasi_tujuan },
                {
                  title: "Keterangan",
                  desc: rmSpaceToStrip(master.keterangan),
                },
              ]}
            />
            <TableCommon
              head={head}
              rowSpan={[
                { label: "Kode" },
                { label: "Barcode" },
                { label: "Nama" },
                { label: "Satuan" },
                { label: "Total" },
                { label: "Retur" },
                { label: "Diterima" },
                { label: "Beli" },
                { label: "Jual" },
              ]}
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
                        return (
                          <tr key={i}>
                            <td className="middle nowrap text-center">
                              {generateNo(i, current_page)}
                            </td>
                            <td className="middle nowrap">{v.kd_brg}</td>
                            <td className="middle nowrap">{v.barcode}</td>
                            <td className="middle nowrap">{v.nm_brg}</td>
                            <td className="middle nowrap">{v.satuan}</td>
                            <td className="middle nowrap text-right">
                              {parseToRp(v.qty)}
                            </td>
                            <td className="middle nowrap text-right">
                              {parseToRp(v.qty_retur)}
                            </td>
                            <td className="middle nowrap text-right">
                              {parseToRp(v.qty - v.qty_retur)}
                            </td>
                            <td className="middle nowrap text-right">
                              {parseToRp(v.hrg_beli)}
                            </td>
                            <td className="middle nowrap text-right">
                              {parseToRp(v.hrg_jual)}
                            </td>
                          </tr>
                        );
                      })
                    : noData(head.length)
                  : noData(head.length)
              }
            />
            {/* <div className="table-responsive" style={{ overflowX: "auto" }}>
              <table className="table table-hover table-bordered">
                <thead className="bg-light">
                  <tr>
                    <th className="text-black" style={columnStyle}>
                      Factur No.
                    </th>
                    <th className="text-black" style={columnStyle}>
                      Barcode
                    </th>
                    <th className="text-black" style={columnStyle}>
                      Kode
                    </th>
                    <th className="text-black" style={columnStyle}>
                      Barang
                    </th>
                    <th className="text-black" style={columnStyle}>
                      Satuan
                    </th>
                    <th className="text-black" style={columnStyle}>
                      QTY
                    </th>
                    <th className="text-black" style={columnStyle}>
                      QTY Retur
                    </th>
                    <th className="text-black" style={columnStyle}>
                      QTY Diterima
                    </th>
                    <th className="text-black" style={columnStyle}>
                      Harga Beli
                    </th>
                    <th className="text-black" style={columnStyle}>
                      Harga Jual
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {typeof data === "object" ? (
                    data.length > 0 ? (
                      data.map((v, i) => {
                        return (
                          <tr key={i}>
                            <td style={{ textAlign: "right" }}>{v.no_faktur_mutasi}</td>
                            <td style={{ textAlign: "right" }}>{v.barcode}</td>
                            <td style={{ textAlign: "right" }}>{v.kd_brg}</td>
                            <td style={{ textAlign: "right" }}>{v.nm_brg}</td>
                            <td style={{ textAlign: "right" }}>{v.satuan}</td>
                            <td style={{ textAlign: "right" }}>{v.qty}</td>
                            <td style={{ textAlign: "right" }}>{v.qty_retur}</td>
                            <td style={{ textAlign: "right" }}>{v.qty - v.qty_retur}</td>
                            <td style={{ textAlign: "right" }}>{v.hrg_beli}</td>
                            <td style={{ textAlign: "right" }}>{v.hrg_jual}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="17">Data Not Available</td>
                      </tr>
                    )
                  ) : (
                    <tr>
                      <td colSpan="17">Data Not Available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div> */}
          </ModalBody>
        </WrapperModal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    // stockReportDetailTransaction:state.stockReportReducer.dataDetailTransaksi,
    isLoading: state.stockReportReducer.isLoading,
  };
};
// const mapDispatch
export default connect(mapStateToProps)(DetailTransaction);
