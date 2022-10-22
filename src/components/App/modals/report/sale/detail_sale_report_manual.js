import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalHeader } from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import {
  noData,
  parseToRp,
  rmSpaceToStrip,
  toDate,
} from "../../../../../helper";
import HeaderDetailCommon from "../../../common/HeaderDetailCommon";
import TableCommon from "../../../common/TableCommon";
import moment from "moment";
import { getManualSaleDetailReportAction } from "../../../../../redux/actions/sale/sale_manual.action";
class DetailSaleReportManual extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }
  toggle(e) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
  }

  handlePageChange(e) {
    console.log(e);
    let where = `kd_trx=${this.props.detail.kd_trx}&page=${e}`;
    this.props.dispatch(getManualSaleDetailReportAction(where, false));
  }

  render() {
    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "Nama" },
      { label: "Sku" },
      { label: "Motif" },
      { label: "Harga jual" },
      { label: "Qty" },
      { label: "Subtotal" },
    ];

    let totalSubTotalPerHalaman = 0;
    let totalQtyPerHalaman = 0;
    const { detail, data } = this.props;
    const { total, last_page, per_page, current_page } = data;
    return (
      <WrapperModal
        isOpen={
          this.props.isOpen && this.props.type === "detailSaleReportManual"
        }
        size="lg"
      >
        <ModalHeader toggle={this.toggle}>
          Detail laporan penjualan Manual
        </ModalHeader>
        <ModalBody>
          <HeaderDetailCommon
            md="col-md-6"
            data={[
              { title: "Kode", desc: detail.kd_trx },
              {
                title: "Penerima",
                desc: detail.penerima.replaceAll("|", " - "),
              },
              {
                title: "Jenis",
                desc: detail.tipe === 0 ? "Tunai" : "Transfer",
              },
              {
                title: "Pengirim",
                desc: detail.pengirim.replaceAll("|", " - "),
              },
              {
                title: "Tanggal",
                desc: moment(detail.created_at).format("lll"),
              },

              { title: "Keterangan", desc: rmSpaceToStrip(detail.keterangan) },
            ]}
          />
          <TableCommon
            head={head}
            meta={{
              total: total,
              current_page: current_page,
              per_page: per_page,
            }}
            current_page={current_page}
            callbackPage={this.handlePageChange.bind(this)}
            renderRow={
              typeof data.data === "object"
                ? data.data.length > 0
                  ? data.data.map((v, i) => {
                      totalSubTotalPerHalaman +=
                        Number(v.harga) * Number(v.qty);
                      totalQtyPerHalaman += parseFloat(v.qty);
                      return (
                        <tr key={i}>
                          <td className="middle nowrap text-center">{i + 1}</td>
                          <td className="middle nowrap">{v.nama}</td>
                          <td className="middle nowrap">{v.sku}</td>
                          <td className="middle nowrap">{v.motif}</td>
                          <td className="middle nowrap text-right">
                            {parseToRp(v.harga)}
                          </td>
                          <td className="middle nowrap text-right">
                            {parseToRp(v.qty)}
                          </td>
                          <td className="middle nowrap text-right">
                            {parseToRp(Number(v.harga) * Number(v.qty))}
                          </td>
                        </tr>
                      );
                    })
                  : noData(head.length)
                : noData(head.length)
            }
            footer={[
              {
                data: [
                  {
                    colSpan: 5,
                    label: "Total perhalaman",
                    className: "text-left",
                  },
                  { colSpan: 1, label: parseToRp(totalQtyPerHalaman) },
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
    data: state.saleManualReducer.dataGetDetailReport,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(DetailSaleReportManual);
