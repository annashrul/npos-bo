import React, { Component } from "react";
import { ModalBody, ModalHeader } from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import { ModalToggle } from "redux/actions/modal.action";
import HeaderDetailCommon from "../../../../common/HeaderDetailCommon";
import { rmPage, toDate } from "../../../../../../helper";
import TableCommon from "../../../../common/TableCommon";
import { poReportDetail } from "../../../../../../redux/actions/purchase/purchase_order/po.action";
class DetailPoReport extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }

  toggle(e) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
  }
  handlePage(res) {
    let master = this.props.master;
    let where = `page=${res}`;
    where += rmPage(master.where);
    this.props.dispatch(poReportDetail(this.props.master.no_po, where));
  }
  render() {
    let master = this.props.master;
    const { total, per_page, current_page, data } = this.props.poReportDetail;
    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "Kode barang", width: "1%" },
      { label: "Barcode", width: "1%" },
      { label: "Nama barang", width: "1%" },
      { label: "Qty", width: "1%" },
      { label: "Harga beli" },
      { label: "Satuan", width: "1%" },
      { label: "Catatan" },
    ];
    return (
      <WrapperModal isOpen={this.props.isOpen && this.props.type === "poReportDetail"} size="lg">
        <ModalHeader toggle={this.toggle}>Detail laporan purchase order</ModalHeader>
        <ModalBody>
          <HeaderDetailCommon
            md={"col-md-6"}
            data={[
              { title: "No PO", desc: master.no_po },
              { title: "Supplier", desc: master.nama_supplier },
              { title: "Tgl PO", desc: toDate(master.tgl_po) },
              { title: "Alamat", desc: master.alamat_supplier },
              { title: "Tgl Expired", desc: toDate(master.tgl_kirim) },
              { title: "Telepon", desc: master.telp_supplier },
              { title: "Lokasi", desc: master.lokasi },
              { title: "Keterangan", desc: master.catatan },
              { title: "Operator", desc: master.kd_kasir },
            ]}
          />

          <TableCommon
            head={head}
            body={typeof data === "object" && data}
            label={[
              { label: "kode_barang" },
              { label: "barcode" },
              { label: "nm_brg" },
              {
                label: "jumlah_beli",
                isCurrency: true,
                className: "text-right",
              },
              {
                label: "harga_beli",
                isCurrency: true,
                className: "text-right",
              },
              { label: "satuan" },
              { label: "deskripsi" },
            ]}
            meta={{
              total: total,
              current_page: current_page,
              per_page: per_page,
            }}
            callbackPage={this.handlePage.bind(this)}
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
export default connect(mapStateToProps)(DetailPoReport);
