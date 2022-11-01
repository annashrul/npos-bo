import React, { Component } from "react";
import { ModalBody, ModalHeader } from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import { ModalToggle } from "redux/actions/modal.action";
import { FetchReportDetail } from "redux/actions/purchase/receive/receive.action";
import HeaderDetailCommon from "../.../../../../../common/HeaderDetailCommon";
import { getMargin, float, generateNo, noData, parseToRp, toDate, rmPage } from "../../../../../../helper";
import TableCommon from "../../../../common/TableCommon";
class DetailReceiveReport extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }
  handlePageChange(pageNumber) {
    let master = this.props.where;
    let where = `page=${pageNumber}`;
    where += rmPage(master);
    this.props.dispatch(FetchReportDetail(this.props.receiveReportDetail.master.no_faktur_beli, where));
  }
  toggle(e) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
  }
  render() {
    const { master, total, per_page, current_page, data } = this.props.receiveReportDetail;
    const head = [
      { rowSpan: 2, label: "No", className: "text-center", width: "1%" },
      { colSpan: 3, label: "Barang" },
      { colSpan: 2, label: "Harga" },
      { rowSpan: 2, label: "Margin" },
      { colSpan: 2, label: "Diskon (%)" },
      { colSpan: 4, label: "Qty" },
      { rowSpan: 2, label: "Ppn" },
      { rowSpan: 2, label: "Subtotal" },
    ];
    const rowSpan = [
      { label: "Kode" },
      { label: "Nama" },
      { label: "Variasi" },
      { label: "Beli" },
      { label: "Jual" },
      { label: "1" },
      { label: "2" },
      { label: "Beli" },
      { label: "Retur" },
      { label: "Bonus" },
      { label: "Sisa" },
    ];
    let totalReturPerHalaman = 0;
    let totalSisaPerHalaman = 0;
    let totalDiskon1PerHalaman = 0;
    let totalDisko2PerHalaman = 0;
    let totalQtyBeliPerHalaman = 0;
    let totalQtyBonusPerHalaman = 0;
    let totalPpnPerHalaman = 0;
    let totalAmountPerHalaman = 0;

    return (
      <WrapperModal isOpen={this.props.isOpen && this.props.type === "receiveReportDetail"} size="lg">
        <ModalHeader toggle={this.toggle}>Detail laporan receive pembelian</ModalHeader>
        <ModalBody>
          <HeaderDetailCommon
            data={[
              { title: "No faktur beli", desc: master.no_faktur_beli },
              { title: "Penerima", desc: master.nama_penerima },
              { title: "Lokasi", desc: master.lokasi_nama },
              { title: "Operator", desc: master.operator_nama },
              { title: "Pelunasan", desc: master.pelunasan },
              { title: "Tanggal", desc: toDate(master.tgl_beli) },
            ]}
          />
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
                      let hrgJual = float(v.harga_jual);
                      let hrgBeli = float(v.harga_beli);
                      let diskon1 = float(v.disc1);
                      let diskon2 = float(v.disc2);
                      let jmlBeli = float(v.jumlah_beli);
                      let jmlBonus = float(v.jumlah_bonus);
                      let retur = float(v.jumlah_retur);
                      let sisa = float(v.qty);
                      let ppn = float(v.ppn_item);

                      let subtotal = float(hrgBeli * v.qty - diskon1 - diskon2 + ppn);

                      totalSisaPerHalaman += float(sisa);
                      totalReturPerHalaman += float(retur);
                      totalDiskon1PerHalaman += float(diskon1);
                      totalDisko2PerHalaman += float(diskon2);
                      totalQtyBeliPerHalaman += float(jmlBeli);
                      totalQtyBonusPerHalaman += float(jmlBonus);
                      totalPpnPerHalaman += float(ppn);
                      totalAmountPerHalaman += float(subtotal);

                      return (
                        <tr key={i}>
                          <td className="middle nowrap text-center">{generateNo(i, current_page)}</td>
                          <td className="middle nowrap">{v.kode_barang}</td>
                          <td className="middle nowrap">{v.nm_brg}</td>
                          <td className="middle nowrap">{v.ukuran}</td>
                          <td className="middle nowrap text-right">{parseToRp(hrgBeli)}</td>
                          <td className="middle nowrap text-right">{parseToRp(hrgJual)}</td>
                          <td className="middle nowrap text-right">{parseToRp(getMargin(hrgJual, hrgBeli))}</td>
                          <td className="middle nowrap text-right">{parseToRp(diskon1)}</td>
                          <td className="middle nowrap text-right">{parseToRp(diskon2)}</td>
                          <td className="middle nowrap text-right">{parseToRp(jmlBeli)}</td>
                          <td className="middle nowrap text-right">{parseToRp(retur)}</td>
                          <td className="middle nowrap text-right">{parseToRp(jmlBonus)}</td>
                          <td className="middle nowrap text-right">{parseToRp(sisa)}</td>
                          <td className="middle nowrap text-right">{parseToRp(ppn)}</td>
                          <td className="middle nowrap text-right">{parseToRp(subtotal)}</td>
                        </tr>
                      );
                    })
                  : noData(head.length)
                : noData(head.length)
            }
            footer={[
              {
                data: [
                  { colSpan: 6, label: "Total perhalaman", className: "text-left" },
                  { colSpan: 1, label: parseToRp(totalDiskon1PerHalaman) },
                  { colSpan: 1, label: parseToRp(totalDisko2PerHalaman) },
                  { colSpan: 1, label: parseToRp(totalQtyBeliPerHalaman) },
                  { colSpan: 1, label: parseToRp(totalReturPerHalaman) },
                  { colSpan: 1, label: parseToRp(totalQtyBonusPerHalaman) },
                  { colSpan: 1, label: parseToRp(totalSisaPerHalaman) },
                  { colSpan: 1, label: parseToRp(totalPpnPerHalaman) },
                  { colSpan: 1, label: parseToRp(totalAmountPerHalaman) },
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
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(DetailReceiveReport);
