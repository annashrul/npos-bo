import React, { Component } from "react";
import { ModalBody, ModalHeader } from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import { ModalToggle } from "redux/actions/modal.action";
import { toRp } from "helper";
import { FetchMutationData } from "redux/actions/inventory/mutation.action";
import {
  generateNo,
  noData,
  parseToRp,
  rmSpaceToStrip,
  toDate,
} from "../../../../../../helper";
import TableCommon from "../../../../common/TableCommon";
import HeaderDetailCommon from "../../../../common/HeaderDetailCommon";

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
    this.props.dispatch(
      FetchMutationData(
        this.props.mutationDetail.no_faktur_mutasi,
        `page=${pageNumber}`
      )
    );
  }

  render() {
    const { data, current_page, per_page, last_page } =
      this.props.mutationDetail.detail === undefined
        ? []
        : this.props.mutationDetail.detail;
    const {
      keterangan,
      lokasi_asal,
      lokasi_tujuan,
      no_faktur_beli,
      no_faktur_mutasi,
      operator,
      tgl_mutasi,
      total,
    } = this.props.mutationDetail;
    const head = [
      { rowSpan: 2, label: "No", className: "text-center", width: "1%" },
      { rowSpan: 2, label: "Kode" },
      { rowSpan: 2, label: "Barcode" },
      { rowSpan: 2, label: "Barang" },
      { colSpan: 3, label: "Qty" },
      { colSpan: 2, label: "Harga" },
      { rowSpan: 2, label: "Total" },
      { rowSpan: 2, label: "Satuan" },
    ];

    return (
      <div>
        <WrapperModal
          isOpen={this.props.isOpen && this.props.type === "detailMutation"}
          size="lg"
        >
          <ModalHeader toggle={this.toggle}>DETAIL LAPORAN MUTASI</ModalHeader>
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
                { title: "Total transaksi", desc: parseToRp(total) },
                { title: "Lokasi tujuan", desc: lokasi_tujuan },
                { title: "Keterangan", desc: keterangan },
              ]}
            />
            <TableCommon
              head={head}
              rowSpan={[
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
                        return (
                          <tr key={i}>
                            <td className="middle nowrap text-center">
                              {generateNo(i, current_page)}
                            </td>
                            <td className="middle nowrap">{v.barcode}</td>
                            <td className="middle nowrap">{v.kd_brg}</td>
                            <td className="middle nowrap">{v.nm_brg}</td>
                            <td className="middle nowrap text-right">
                              {parseToRp(v.qty)}
                            </td>
                            <td className="middle nowrap text-right">
                              {parseToRp(v.qty_retur)}
                            </td>
                            <td className="middle nowrap text-right">
                              {parseToRp(v.qty - v.qty_retur)}
                            </td>
                            <td className="middle nowrap text-right">
                              {parseToRp(v.hrg_beli)}
                            </td>
                            <td className="middle nowrap text-right">
                              {parseToRp(v.hrg_jual)}
                            </td>
                            <td className="middle nowrap text-right">
                              {parseToRp(v.hrg_jual * (v.qty - v.qty_retur))}
                            </td>
                            <td className="middle nowrap">{v.satuan}</td>
                          </tr>
                        );
                      })
                    : noData(head.length)
                  : noData(head.length)
              }
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
