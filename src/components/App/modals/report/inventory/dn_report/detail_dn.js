import React, { Component } from "react";
import { ModalBody, ModalHeader } from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import { ModalToggle } from "redux/actions/modal.action";
import DetailHeaderCommon from "../../../../common/HeaderDetailCommon";
import { rmSpaceToStrip, toDate } from "../../../../../../helper";
import { statusDeliveryNote } from "../../../../../../helperStatus";
import TableCommon from "../../../../common/TableCommon";
class DetailDn extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }
  toggle(e) {
    e.preventDefault();
    this.props.dispatch(ModalToggle(false));
  }
  handlePageChange(page) {}

  render() {
    const { per_page, current_page, total, data } = this.props.dnDetail.detail === undefined ? [] : this.props.dnDetail.detail;
    const master = this.props.dnDetail === undefined ? [] : this.props.dnDetail;
    const columnStyle = { verticalAlign: "middle", textAlign: "center" };
    return (
      <div>
        <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailDn"} size="lg">
          <ModalHeader toggle={this.toggle}>Detail laporan delivery note</ModalHeader>
          <ModalBody>
            <DetailHeaderCommon
              md="col-md-6"
              data={[
                { title: "Faktur DN", desc: master.no_delivery_note },
                { title: "Operator", desc: master.operator },
                { title: "Faktur Beli", desc: rmSpaceToStrip(master.no_faktur_beli) },
                { title: "Status", desc: statusDeliveryNote(master.status) },
                { title: "Lokasi asal", desc: master.lokasi_asal },
                { title: "Tanggal", desc: toDate(master.tanggal) },
                { title: "Lokasi tujuan", desc: master.lokasi_tujuan },
                { title: "Keterangan", desc: rmSpaceToStrip(master.keterangan) },
              ]}
            />
            <TableCommon
              head={[
                { rowSpan: 2, label: "No", className: "text-center", width: "1%" },
                { colSpan: 4, label: "Barang", className: "text-center" },
                { rowSpan: 2, label: "Qty", className: "text-center" },
                { colSpan: 2, label: "Harga", className: "text-center" },
              ]}
              rowSpan={[{ label: "Kode" }, { label: "Barcode" }, { label: "Nama" }, { label: "Satuan" }, { label: "Beli" }, { label: "Jual" }]}
              meta={{ total: total, current_page: current_page, per_page: per_page }}
              current_page={current_page}
              callbackPage={this.handlePageChange.bind(this)}
              body={typeof data === "object" && data}
              label={[
                { label: "kd_brg" },
                { label: "barcode" },
                { label: "nm_brg" },
                { label: "satuan" },
                { label: "qty", className: "text-right", isCurrency: true },
                { label: "hrg_beli", className: "text-right", isCurrency: true },
                { label: "hrg_jual", className: "text-right", isCurrency: true },
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
export default connect(mapStateToProps)(DetailDn);
