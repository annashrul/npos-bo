import React, { Component } from "react";
import { ModalBody, ModalHeader } from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import { ModalToggle } from "redux/actions/modal.action";
import { FetchReportDetail } from "redux/actions/purchase/receive/receive.action";
import HeaderDetailCommon from "../.../../../../../common/HeaderDetailCommon";
import { getMargin, float, generateNo, noData, parseToRp, toDate, rmPage } from "../../../../../../helper";
import TableCommon from "../../../../common/TableCommon";
class DetailReturReport extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }
  handlePageChange(pageNumber) {
    let master = this.props.master;
    let where = `page=${pageNumber}`;
    where += rmPage(master.where);
    this.props.dispatch(FetchReportDetail(master.no_faktur_beli, where));
  }
  toggle(e) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
  }
  render() {
    console.log("props", this.props.data);
    // const { data } = this.props.data;
    // barcode: "211029450303";
    // hrg_beli: "250000";
    // kd_brg: "2110294503";
    // keterangan: "-";
    // kondisi: "bad_stock";
    // nm_brg: "Yataro";
    // no_retur: "NR-2111180002-7";
    // qty_retur: "1";
    // satuan: "Karton";
    const head = [
      { rowSpan: 2, label: "No retur", width: "1%" },
      { colSpan: 5, label: "Barang", width: "1%" },
      { rowSpan: 2, label: "Kondisi", width: "1%" },
      { rowSpan: 2, label: "Qty retur", width: "1%" },
      { rowSpan: 2, label: "Keterangan" },
    ];
    const rowSpan = [{ label: "Kode" }, { label: "Nama" }, { label: "Barcode" }, { label: "Satuan" }, { label: "Harga beli" }];

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
              <tr>
                <td className="middle nowrap">{this.props.data.detail.no_retur}</td>
                <td className="middle nowrap">{this.props.data.detail.kd_brg}</td>
                <td className="middle nowrap">{this.props.data.detail.nm_brg}</td>
                <td className="middle nowrap">{this.props.data.detail.barcode}</td>
                <td className="middle nowrap">{this.props.data.detail.satuan}</td>
                <td className="middle nowrap text-right">{parseToRp(this.props.data.detail.hrg_beli)}</td>
                <td className="middle nowrap">{this.props.data.detail.kondisi}</td>
                <td className="middle nowrap text-right">{parseToRp(this.props.data.detail.qty_retur)}</td>
                <td className="middle nowrap">{this.props.data.detail.keterangan}</td>
              </tr>
            }
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
