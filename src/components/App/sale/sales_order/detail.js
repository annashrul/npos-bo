import React, { Component } from "react";
import WrapperModal from "components/App/modals/_wrapper.modal";
import { ModalBody, ModalHeader } from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import HeaderDetailCommon from "../../common/HeaderDetailCommon";
import TableCommon from "../../common/TableCommon";
import moment from "moment";
import { noData, parseToRp, rmComma, toRp } from "../../../../helper";
import ButtonTrxSo from "../../common/ButtonTrxSo";
import { putApprovalSalesOrderAction } from "../../../../redux/actions/sale/sales_order.action";
class DetailApprovalSalesOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataDetail: [],
      totalQty: 0,
      timer: 0,
    };
    this.toggle = this.toggle.bind(this);
    this.handleSum = this.handleSum.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  toggle(e) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ dataDetail: nextProps.data.detail });
  }
  componentWillMount() {
    this.setState({ dataDetail: this.props.data.detail });
  }
  handleSum() {
    let totalQty = 0;
    this.state.dataDetail.map((res) => {
      console.log(res);
      totalQty += Number(res.qty_brg);
    });
    clearTimeout(this.state.timer);
    const timer = setTimeout(() => {
      this.setState({ totalQty }, () => {
        console.log("total qty", totalQty);
      });
    }, 1000);
    this.setState({ timer });
  }
  handleChange(e, i) {
    const val = e.target.value;
    const dataDetail = this.state.dataDetail;
    dataDetail[i]["qty_brg"] = rmComma(val);
    this.setState({ dataDetail }, () => {
      this.handleSum();
    });
    console.log(val);
  }

  handleSubmit() {
    const newDatas = this.state.dataDetail;
    let subtotal_so = 0;
    let qty_so = 0;
    let detail = [];
    let kd_so = this.props.data.kd_so;
    newDatas.map((res, i) => {
      qty_so += Number(res.qty_brg);
      subtotal_so += Number(res.harga);
      detail.push({
        qty_brg: res.qty_brg,
        kd_brg: res.kd_brg,
        kd_so,
      });
    });
    let master = {
      kd_so,
      subtotal_so,
      qty_so,
    };
    this.props.dispatch(putApprovalSalesOrderAction({ master, detail }));

    // console.log(newDatas);
  }

  render() {
    console.log("data detail", this.state.dataDetail);
    const head = [
      { rowSpan: 2, label: "No", className: "text-center", width: "1%" },
      { colSpan: 4, label: "Barang" },
      { rowSpan: 2, label: "Qty", width: "1%" },
    ];
    const rowSpan = [
      { label: "Kode", width: "1%" },
      { label: "Nama", width: "1%" },
      { label: "Variasi" },
      { label: "Satuan" },

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
          Edit Approval Sales Order
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
              typeof data.detail === "object" &&
              data.detail.length > 0 &&
              this.state.dataDetail.length > 0
                ? data.detail.map((v, i) => {
                    totalQtyPerHalaman += parseFloat(v.qty_brg);
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">{i + 1}</td>
                        <td className="middle nowrap">{v.kd_brg}</td>
                        <td className="middle nowrap">{v.nm_brg}</td>
                        <td className="middle nowrap">{v.ukuran}</td>
                        <td className="middle nowrap">{v.satuan}</td>
                        <td className="middle nowrap text-right">
                          <input
                            style={{ width: "100px", textAlign: "right" }}
                            onChange={(e) => this.handleChange(e, i)}
                            name={`qty_brg_${i}`}
                            value={toRp(
                              this.state.dataDetail[i].qty_brg > 0
                                ? this.state.dataDetail[i].qty_brg
                                : v.qty_brg
                            )}
                            className="form-control in-table"
                          />
                          {/* {parseToRp(v.qty_brg)} */}
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
                    colSpan: 5,
                    label: "Total",
                    className: "text-left",
                  },
                  {
                    colSpan: 1,
                    label: (
                      <input
                        readOnly
                        className="form-control in-table text-right"
                        value={toRp(
                          this.state.totalQty > 1
                            ? this.state.totalQty
                            : totalQtyPerHalaman
                        )}
                      />
                    ),
                  },
                ],
              },
            ]}
          />
          <div style={{ float: "right" }}>
            <ButtonTrxSo
              disabled={false}
              callback={(e, res) => {
                console.log(res);
                this.handleSubmit();
              }}
            />
          </div>
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
