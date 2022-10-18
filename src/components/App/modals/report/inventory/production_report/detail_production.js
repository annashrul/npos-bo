import React, { Component } from "react";
import { ModalBody, ModalHeader } from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import { ModalToggle } from "redux/actions/modal.action";
import { noData, parseToRp, rmSpaceToStrip, toDate } from "../../../../../../helper";
import { statusProduksi } from "../../../../../../helperStatus";
import HeaderDetailCommon from "../../../../common/HeaderDetailCommon";
import TableCommon from "../../../../common/TableCommon";

class DetailProduction extends Component {
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
    const { data } = this.props.productionDetail;
    let master = this.props.detail;
    let totalAmountPerHalaman = 0;
    let totalQtyPerHalaman = 0;
    const head = [
      { rowSpan: 2, label: "No", className: "text-center", width: "1%" },
      { colSpan: 4, label: "Bahan" },
      { rowSpan: 2, label: "Qty" },
      { rowSpan: 2, label: "Harga jual" },
      { rowSpan: 2, label: "Total" },
    ];
    const rowSpan = [{ label: "Kode" }, { label: "Barcode" }, { label: "Nama" }, { label: "Satuan" }];
    return (
      <div>
        <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailProduction"} size="lg">
          <ModalHeader toggle={this.toggle}>Detail laporan produksi</ModalHeader>
          <ModalBody>
            <HeaderDetailCommon
              data={[
                { title: "Kode produksi", desc: master.kd_produksi },
                { title: "Tanggal", desc: toDate(master.tanggal) },
                { title: "Paket", desc: master.nm_brg },
                { title: "Qty estimasi", desc: parseToRp(master.qty_estimasi) },
                { title: "Lokasi", desc: master.nama_toko },
                { title: "Hpp", desc: parseToRp(master.hpp) },
                { title: "Status", desc: statusProduksi(master.status.toString()) },
                { title: "Operator", desc: rmSpaceToStrip(master.operator) },
              ]}
            />
            <TableCommon
              head={head}
              rowSpan={rowSpan}
              renderRow={
                typeof data === "object"
                  ? data.length > 0
                    ? data.map((v, i) => {
                        totalAmountPerHalaman += parseFloat(v.harga_beli * v.qty);
                        totalQtyPerHalaman += parseFloat(v.qty);
                        return (
                          <tr key={i}>
                            <td className="middle nowrap">{i + 1}</td>
                            <td className="middle nowrap">{v.kd_brg}</td>
                            <td className="middle nowrap">{v.barcode}</td>
                            <td className="middle nowrap">{v.nm_brg}</td>
                            <td className="middle nowrap">{v.satuan}</td>
                            <td className="middle nowrap text-right">{parseToRp(v.qty)}</td>
                            <td className="middle nowrap text-right">{parseToRp(v.harga_beli)}</td>
                            <td className="middle nowrap text-right">{parseToRp(v.harga_beli * v.qty)}</td>
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
                    { colSpan: 1, label: parseToRp(totalQtyPerHalaman) },
                    { colSpan: 1, label: "" },
                    { colSpan: 1, label: parseToRp(totalAmountPerHalaman) },
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
  };
};
export default connect(mapStateToProps)(DetailProduction);
