import React, { Component } from "react";
import WrapperModal from "../_wrapper.modal";
import { ModalBody, ModalHeader } from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { noData, parseToRp, rmSpaceToStrip, toDate } from "../../../../helper";
import HeaderDetailCommon from "../../common/HeaderDetailCommon";
import TableCommon from "../../common/TableCommon";
class DetailPiutangTrx extends Component {
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
    const master = this.props.detailSale;
    const { detail } = master;
    const head = [
      { rowSpan: 2, label: "No", className: "text-center", width: "1%" },
      { colSpan: 4, label: "Barang" },
      { rowSpan: 2, label: "Open price" },
      { rowSpan: 2, label: "Harga jual" },
      { rowSpan: 2, label: "Qty" },
      { rowSpan: 2, label: "Diskon" },
      { rowSpan: 2, label: "Subtotal" },
    ];
    const rowSpan = [{ label: "Kode" }, { label: "Nama" }, { label: "Variasi" }, { label: "Satuan" }];
    let totalSubTotalPerHalaman = 0;
    let totalQtyPerHalaman = 0;
    let totalDiskonPerHalaman = 0;
    return (
      <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailPiutangTrx"} size="lg">
        <ModalHeader toggle={this.toggle}>Detail #{this.props.detail.kd_trx}</ModalHeader>
        <ModalBody>
          <HeaderDetailCommon
            md="col-md-6"
            data={[
              { title: "Kode Trx", desc: String(this.props.detail.kd_trx).toUpperCase() },
              { title: "Dibayar", desc: parseToRp(this.props.detail.dibayar) },
              { title: "Piutang", desc: parseToRp(this.props.detail.piutang)},
              { title: "Sisa Piutang", desc: parseToRp(this.props.detail.sisa_piutang)},
              { title: "Tgl. Tempo", desc: toDate(this.props.detail.tempo)},
              { title: "Tgl. Trx", desc: toDate(this.props.detail.tgl) },
            ]}
          />
          <TableCommon
            head={head}
            rowSpan={rowSpan}
            renderRow={
              typeof detail === "object"
                ? detail.length > 0
                  ? detail.map((v, i) => {
                      totalSubTotalPerHalaman += parseFloat(v.subtotal);
                      totalQtyPerHalaman += parseFloat(v.qty);
                      totalDiskonPerHalaman += parseFloat(v.dis_persen);
                      return (
                        <tr key={i}>
                          <td className="middle nowrap text-center">{i + 1}</td>
                          <td className="middle nowrap">{v.kd_brg}</td>
                          <td className="middle nowrap">{v.nm_brg}</td>
                          <td className="middle nowrap">{v.ukuran}</td>
                          <td className="middle nowrap">{v.satuan}</td>
                          <td className="middle nowrap text-right">{parseToRp(v.open_price)}</td>
                          <td className="middle nowrap text-right">{parseToRp(v.hrg_jual)}</td>
                          <td className="middle nowrap text-right">{parseToRp(v.qty)}</td>
                          <td className="middle nowrap text-right">{parseToRp(v.dis_persen)}</td>
                          <td className="middle nowrap text-right">{parseToRp(v.subtotal)}</td>
                        </tr>
                      );
                    })
                  : noData(head.length)
                : noData(head.length)
            }
            footer={[
              {
                data: [
                  { colSpan: 7, label: "Total perhalaman", className: "text-left" },
                  { colSpan: 1, label: parseToRp(totalQtyPerHalaman) },
                  { colSpan: 1, label: parseToRp(totalDiskonPerHalaman) },
                  { colSpan: 1, label: parseToRp(totalSubTotalPerHalaman) },
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
export default connect(mapStateToProps)(DetailPiutangTrx);
