import React, { Component } from "react";
import { ModalBody, ModalHeader } from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import { ModalToggle } from "redux/actions/modal.action";
import { FetchMutationData } from "redux/actions/inventory/mutation.action";
import { generateNo, noData, parseToRp, rmSpaceToStrip, toDate } from "../../../../../../helper";
import TableCommon from "../../../../common/TableCommon";
import HeaderDetailCommon from "../../../../common/HeaderDetailCommon";
import { statusMutasi } from "../../../../../../helperStatus";

class DetailMutation extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }
  toggle(e) {
    e.preventDefault();
    this.props.dispatch(ModalToggle(false));
  }

  handlePageChange(pageNumber) {
    this.props.dispatch(FetchMutationData(this.props.mutationDetail.no_faktur_mutasi, `page=${pageNumber}`));
  }

  render() {
    const { data, current_page, per_page, last_page } = this.props.mutationDetail.detail === undefined ? [] : this.props.mutationDetail.detail;
    const { keterangan, lokasi_asal, lokasi_tujuan, no_faktur_beli, no_faktur_mutasi, operator, tgl_mutasi, total, status } = this.props.mutationDetail;
    const head = [
      { rowSpan: 2, label: "No", className: "text-center", width: "1%" },
      { colSpan: 4, label: "Barang" },
      // { rowSpan: 2, label: "Kode" },
      // { rowSpan: 2, label: "Barcode" },
      // { rowSpan: 2, label: "Barang" },
      { colSpan: 3, label: "Qty" },
      { colSpan: 2, label: "Harga" },
      { rowSpan: 2, label: "Total" },
      // { rowSpan: 2, label: "Satuan" },
    ];
    let total_qty = 0;
    let total_qty_retur = 0;
    let total_qty_diterima = 0;
    let total_hasil = 0;
    return (
      <div>
        <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailMutation"} size="lg">
          <ModalHeader toggle={this.toggle}>Detail laporan mutasi</ModalHeader>
          <ModalBody>
            <HeaderDetailCommon
              data={[
                { title: "Faktur mutasi", desc: no_faktur_mutasi },
                { title: "Tanggal", desc: toDate(tgl_mutasi) },
                {
                  title: "Faktur beli",
                  desc: rmSpaceToStrip(no_faktur_beli),
                },
                { title: "Operator", desc: operator },
                { title: "Lokasi asal", desc: lokasi_asal },
                { title: "Total transaksi", desc: statusMutasi(status) },
                { title: "Lokasi tujuan", desc: lokasi_tujuan },
                { title: "Keterangan", desc: keterangan },
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
                total: parseInt(per_page * last_page, 10),
                current_page: current_page,
                per_page: per_page,
              }}
              current_page={current_page}
              callbackPage={this.handlePageChange.bind(this)}
              renderRow={
                typeof data === "object"
                  ? data.length > 0
                    ? data.map((v, i) => {
                        let qty = parseInt(v.qty, 10);
                        let qtyRetur = parseInt(v.qty_retur, 10);
                        let totalItem = v.hrg_beli * (qty - qtyRetur);

                        total_qty = total_qty + qty;

                        total_qty_retur = total_qty_retur + qtyRetur;

                        total_qty_diterima = total_qty_diterima + qty - qtyRetur;

                        total_hasil = total_hasil + totalItem;

                        return (
                          <tr key={i}>
                            <td className="middle nowrap text-center">{generateNo(i, current_page)}</td>
                            <td className="middle nowrap">{v.barcode}</td>
                            <td className="middle nowrap">{v.kd_brg}</td>
                            <td className="middle nowrap">{v.nm_brg}</td>
                            <td className="middle nowrap">{v.satuan}</td>

                            <td className="middle nowrap text-right">{parseToRp(qty)}</td>
                            <td className="middle nowrap text-right">{parseToRp(qtyRetur)}</td>
                            <td className="middle nowrap text-right">{parseToRp(qty - qtyRetur)}</td>
                            <td className="middle nowrap text-right">{parseToRp(v.hrg_beli)}</td>
                            <td className="middle nowrap text-right">{parseToRp(v.hrg_jual)}</td>
                            <td className="middle nowrap text-right">{parseToRp(totalItem)}</td>
                          </tr>
                        );
                      })
                    : noData(head.length)
                  : noData(head.length)
              }
              footer={[
                {
                  data: [
                    { colSpan: 5, label: "Total perhalaman", className: "text-left" },
                    { colSpan: 1, label: parseToRp(total_qty) },
                    { colSpan: 1, label: parseToRp(total_qty_retur) },
                    { colSpan: 1, label: parseToRp(total_qty_diterima) },
                    { colSpan: 2, label: "" },
                    { colSpan: 1, label: parseToRp(total_hasil) },
                  ],
                },
              ]}
            />
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
    mutationDetail: state.mutationReducer.report_data,
  };
};
// const mapDispatch
export default connect(mapStateToProps)(DetailMutation);
