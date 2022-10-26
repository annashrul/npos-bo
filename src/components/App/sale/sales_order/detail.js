import React, { Component } from "react";
import WrapperModal from "components/App/modals/_wrapper.modal";
import { ModalBody, ModalHeader } from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import HeaderDetailCommon from "../../common/HeaderDetailCommon";
import TableCommon from "../../common/TableCommon";
import moment from "moment";
import { noData, parseToRp } from "../../../../helper";
class DetailApprovalSalesOrder extends Component {
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
    const head = [
      { rowSpan: 2, label: "No", className: "text-center", width: "1%" },
      { colSpan: 3, label: "Barang" },
      { rowSpan: 2, label: "Qty", width: "1%" },
    ];
    const rowSpan = [
      { label: "Kode", width: "1%" },
      { label: "Barcode", width: "1%" },
      { label: "Nama" },
    ];

    let totalQtyPerHalaman = 0;
    const data = this.props.data;
    return (
      <WrapperModal
        isOpen={
          this.props.isOpen && this.props.type === "detailApprovalSalesOrder"
        }
        size="lg"
      >
        <ModalHeader toggle={this.toggle}>
          Detail Approval Sales Order
        </ModalHeader>
        <ModalBody>
          <HeaderDetailCommon
            md="col-md-6"
            data={[
              { title: "Kode", desc: data.kd_so },
              {
                title: "Operator",
                desc: data.operator,
              },
              {
                title: "Lokasi",
                desc: data.lokasi,
              },
              {
                title: "Customer",
                desc: data.customer,
              },
              {
                title: "Tanggal",
                desc: moment(data.created_at).format("lll"),
              },

              { title: "Keterangan", desc: data.catatan },
            ]}
          />
          <TableCommon
            head={head}
            rowSpan={rowSpan}
            renderRow={
              typeof data.detail === "object" && data.detail.length > 0
                ? data.detail.map((v, i) => {
                    totalQtyPerHalaman += parseFloat(v.qty_brg);
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">{i + 1}</td>
                        <td className="middle nowrap">{v.kd_brg}</td>
                        <td className="middle nowrap">{v.barcode}</td>
                        <td className="middle nowrap">{v.nm_brg}</td>
                        <td className="middle nowrap text-right">
                          {parseToRp(v.qty_brg)}
                        </td>
                      </tr>
                    );
                  })
                : noData(head.length)
            }
            footer={[
              {
                data: [
                  {
                    colSpan: 4,
                    label: "Total perhalaman",
                    className: "text-left",
                  },
                  { colSpan: 1, label: parseToRp(totalQtyPerHalaman) },
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
export default connect(mapStateToProps)(DetailApprovalSalesOrder);
