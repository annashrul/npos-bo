import React, { Component } from "react";
import { ModalBody, ModalHeader } from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import HeaderDetailCommon from "../../../../common/HeaderDetailCommon";
import { rmSpaceToStrip, toDate } from "../../../../../../helper";
import TableCommon from "../../../../common/TableCommon";
class DetailAdjustmentReport extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }

  toggle(e) {
    e.preventDefault();
    this.props.dispatch(ModalToggle(false));
    this.props.dispatch(ModalType("detailAdjustment"));
  }

  render() {
    const { kd_trx, tgl, lokasi, keterangan, operator, detail } = this.props.adjustmentDetailTransaction;
    // const { kd_trx, tgl, lokasi, keterangan, operator, detail } = detail;

    console.log(this.props);
    // let totAdjustmentIn=0;
    // let totAdjustmentOut=0;
    // let totQty=0;

    const columnStyle = { verticalAlign: "middle", textAlign: "center" };
    return (
      <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailAdjustment"} size="lg">
        <ModalHeader toggle={this.toggle}>Detail laporan adjusment </ModalHeader>
        <ModalBody>
          <HeaderDetailCommon
            data={[
              { title: "Kode transaksi", desc: kd_trx },
              { title: "Tanggal", desc: toDate(tgl) },
              { title: "Lokasi", desc: lokasi },
              { title: "Keterangan", desc: rmSpaceToStrip(keterangan) },
              { title: "Operator", desc: operator },
            ]}
          />
          <TableCommon head={[{ label: "Barcode" }, { label: "Nama barang" }, { label: "Satuan" }, { label: "Harga beli" }, { label: "Qty adjusment" }, { label: "Stok terakhir" }, { label: "Saldo stok" }, { label: "Status" }]} body={typeof [detail] === "object" && [detail]} label={[{ label: "brcd_brg" }, { label: "nm_brg" }, { label: "satuan" }, { label: "harga_beli", isCurrency: true }, { label: "qty_adjust", isCurrency: true }, { label: "stock_terakhir", isCurrency: true }, { label: "saldo_stock", isCurrency: true }, { label: "status" }]} />
          {/* <div className="table-responsive" style={{ overflowX: "auto" }}>
            <table className="table table-hover table-bordered">
              <thead className="bg-light">
                <tr>
                  <th className="text-black" style={columnStyle}>
                    Code
                  </th>
                  <th className="text-black" style={columnStyle}>
                    Barcode
                  </th>
                  <th className="text-black" style={columnStyle}>
                    Status
                  </th>
                  <th className="text-black" style={columnStyle}>
                    QTY Adjust
                  </th>
                  <th className="text-black" style={columnStyle}>
                    Saldo Stock
                  </th>
                  <th className="text-black" style={columnStyle}>
                    Last Stock
                  </th>
                </tr>
              </thead>
              <tbody>
                {detail !== undefined ? (
                  typeof [detail] === "object" ? (
                    [detail].length >= 0 ? (
                      [detail].map((v, i) => {
                        return (
                          <tr key={i}>
                            <td style={columnStyle}>{v.kd_trx}</td>
                            <td style={{ textAlign: "right" }}>{v.brcd_brg}</td>
                            <td style={{ textAlign: "right" }}>{v.status}</td>
                            <td style={{ textAlign: "right" }}>{v.qty_adjust}</td>
                            <td style={columnStyle}>{v.saldo_stock}</td>
                            <td style={columnStyle}>{v.stock_terakhir}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td>Data Not Available</td>
                      </tr>
                    )
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
              <tfoot>
                <tr style={{ backgroundColor: "#EEEEEE" }}></tr>
              </tfoot>
            </table>
          </div> */}
        </ModalBody>
      </WrapperModal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    adjustmentDetailTransaction: state.adjustmentReducer.dataDetailTransaksi,
    isLoading: state.adjustmentReducer.isLoading,
  };
};
// const mapDispatch
export default connect(mapStateToProps)(DetailAdjustmentReport);
