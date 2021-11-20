import React, { Component } from "react";
import { ModalBody, ModalHeader } from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import { ModalToggle } from "redux/actions/modal.action";
import { FetchReportDetail } from "redux/actions/purchase/receive/receive.action";
import HeaderDetailCommon from "../.../../../../../common/HeaderDetailCommon";
import { getMargin, float, generateNo, noData, parseToRp, toDate, rmPage, rmSpaceToStrip, rmUnderscore } from "../../../../../../helper";
import TableCommon from "../../../../common/TableCommon";
class DetailReturReport extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }

  toggle(e) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
  }
  render() {
    console.log("props", this.props.data);
    const head = [
      { rowSpan: 2, label: "No", className: "text-center", width: "1%" },
      { rowSpan: 2, label: "No retur", width: "1%" },
      { colSpan: 5, label: "Barang", width: "1%" },
      { rowSpan: 2, label: "Kondisi", width: "1%" },
      { rowSpan: 2, label: "Qty retur", width: "1%" },
      { rowSpan: 2, label: "Total retur", width: "1%" },
      { rowSpan: 2, label: "Keterangan" },
    ];
    const rowSpan = [{ label: "Kode" }, { label: "Nama" }, { label: "Barcode" }, { label: "Satuan" }, { label: "Harga beli" }];
    let totalQtyReturPerHalaman = 0;
    let totalSubTotalPerHalaman = 0;

    return (
      <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailReportRetur"} size="lg">
        <ModalHeader toggle={this.toggle}>Detail laporan retur pembelian</ModalHeader>
        <ModalBody>
          <HeaderDetailCommon
            data={[
              { title: "No faktur retur", desc: this.props.data.no_retur },
              { title: "Lokasi", desc: this.props.data.lokasi },
              { title: "No faktur beli", desc: this.props.data.no_faktur_beli },
              { title: "Supplier", desc: this.props.data.supplier },
              { title: "Qty retur", desc: parseToRp(this.props.data.qty_retur) },
              { title: "Operator", desc: this.props.data.operator },
              { title: "Total retur", desc: parseToRp(this.props.data.total_retur) },
              { title: "Tanggal", desc: toDate(this.props.data.tgl) },
            ]}
          />
          <TableCommon
            head={head}
            rowSpan={rowSpan}
            renderRow={
              typeof this.props.data.detail === "object"
                ? this.props.data.detail.length > 0
                  ? this.props.data.detail.map((v, i) => {
                      totalQtyReturPerHalaman += parseFloat(v.qty_retur);
                      totalSubTotalPerHalaman += parseFloat(v.qty_retur) * parseFloat(v.hrg_beli);
                      return (
                        <tr key={i}>
                          <td className="middle nowrap text-center">{i + 1}</td>
                          <td className="middle nowrap">{v.no_retur}</td>
                          <td className="middle nowrap">{v.kd_brg}</td>
                          <td className="middle nowrap">{v.nm_brg}</td>
                          <td className="middle nowrap">{v.barcode}</td>
                          <td className="middle nowrap">{v.satuan}</td>
                          <td className="middle nowrap text-right">{parseToRp(v.hrg_beli)}</td>
                          <td className="middle nowrap">{rmUnderscore(v.kondisi)}</td>
                          <td className="middle nowrap text-right">{parseToRp(v.qty_retur)}</td>
                          <td className="middle nowrap text-right">{parseToRp(parseFloat(v.qty_retur) * parseFloat(v.hrg_beli))}</td>
                          <td className="middle nowrap">{rmSpaceToStrip(v.keterangan)}</td>
                        </tr>
                      );
                    })
                  : noData(head.length + rowSpan.length)
                : noData(head.length + rowSpan.length)
            }
            footer={[
              {
                data: [
                  { colSpan: 8, label: "Total perhalaman", className: "text-left" },
                  { colSpan: 1, label: parseToRp(totalQtyReturPerHalaman) },
                  { colSpan: 1, label: parseToRp(totalSubTotalPerHalaman) },
                  { colSpan: 1, label: "" },
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
    data: state.returReducer.returReportDetail,
  };
};
export default connect(mapStateToProps)(DetailReturReport);
