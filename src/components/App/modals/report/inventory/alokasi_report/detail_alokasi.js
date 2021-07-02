import React, { Component } from "react";
import { ModalBody, ModalHeader } from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import { ModalToggle } from "redux/actions/modal.action";
import HeaderDetailCommon from "../../../../common/HeaderDetailCommon";
import { rmSpaceToStrip } from "../../../../../../helper";
import { statusAlokasi } from "../../../../../../helperStatus";
import TableCommon from "../../../../common/TableCommon";
import { FetchAlokasiDetail } from "redux/actions/inventory/alokasi.action";

class DetailAlokasi extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }
  toggle(e) {
    e.preventDefault();
    this.props.dispatch(ModalToggle(false));
  }
  handlePageChange(page) {
    let props = this.props;
    let no_mutasi = props.alokasiDetail.no_faktur_mutasi;
    let where = props.where;
    this.props.dispatch(FetchAlokasiDetail(no_mutasi, `page=${page}${where}`));
  }

  render() {
    let master = this.props.alokasiDetail;
    const detail = master.detail === undefined ? [] : master.detail;
    const { per_page, last_page, current_page, data, total } = detail;

    return (
      <div>
        <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailAlokasi"} size="lg">
          <ModalHeader toggle={this.toggle}>Detail laporan alokasi</ModalHeader>
          <ModalBody>
            <HeaderDetailCommon
              data={[
                { title: "No faktur mutasi", desc: master.no_faktur_mutasi },
                { title: "No faktur beli", desc: rmSpaceToStrip(master.no_faktur_beli) },
                { title: "Lokasi asal", desc: master.lokasi_asal },
                { title: "Status", desc: statusAlokasi(master.status) },
                { title: "Lokasi tujuan", desc: master.lokasi_tujuan },

                { title: "Keterangan", desc: rmSpaceToStrip(master.keterangan) },
              ]}
            />
            <TableCommon
              head={[
                { rowSpan: 2, label: "No", className: "text-center", width: "1%" },
                { colSpan: 4, label: "Barang" },
                { rowSpan: 2, label: "Qty" },
                { colSpan: 2, label: "Harga" },
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
                { label: "qty", isCurrency: true, className: "text-right" },
                { label: "hrg_beli", isCurrency: true, className: "text-right" },
                { label: "hrg_jual", isCurrency: true, className: "text-right" },
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
    isLoading: state.stockReportReducer.isLoading,
  };
};
// const mapDispatch
export default connect(mapStateToProps)(DetailAlokasi);
