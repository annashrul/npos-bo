import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import {
  generateNo,
  getFetchWhere,
  noData,
  parseToRp,
  rmComma,
  swallOption,
  toRp,
} from "../../../../helper";
import TableCommon from "../../common/TableCommon";
import ButtonActionCommon from "../../common/ButtonActionCommon";
import HeaderReportCommon from "../../common/HeaderReportCommon";
import { ModalToggle, ModalType } from "../../../../redux/actions/modal.action";
import moment from "moment";
import DetailApprovalSalesOrder from "./detail";
import { withRouter } from "react-router-dom";
import {
  getApprovalSoAction,
  putApprovalSalesOrderAction,
  deleteSalesOrderAction,
} from "../../../../redux/actions/sale/sales_order.action";
import Layout from "components/App/Layout";

class ApproveSo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      where_data: "",
      isModalDetail: false,
      detail: {},
      periode: "",
      dataApprove: [],
    };
    this.handleModal = this.handleModal.bind(this);
    this.handleService = this.handleService.bind(this);
    this.handleApprove = this.handleApprove.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleService(res, page = 1) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      this.setState({ where_data: where });
      this.props.dispatch(getApprovalSoAction(where));
    }
  }

  handlePageChange(pageNumber) {
    this.handleService(this.state.where_data, pageNumber);
  }
  handleFetchModal(page) {
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType(page));
  }

  handleModal(param) {
    this.setState({ isModalDetail: true, detail: param }, () => {
      this.handleFetchModal("detailApprovalSalesOrder");
    });
  }

  handleApprove(param) {
    swallOption(
      "Anda yakin melajutkan proses ini ? ",
      () => {
        this.props.dispatch(putApprovalSalesOrderAction(param.kd_so));
      },
      () => {}
    );
  }
  

  handleDelete(obj) {
    Object.assign(obj);
    this.props.dispatch(deleteSalesOrderAction(obj));
  }

  // handleDelete(param) {
  //   swallOption(
  //     "Data yang dihapus tidak bisa dikembalikan! ",
  //     () => {
  //       this.props.dispatch(deleteSalesOrderAction(param.kd_so));
  //     },
  //     () => {}
  //   );
  // }

  render() {
    const { total, last_page, per_page, current_page, data, totalData } =
      this.props.data;

    const head = [
      { rowSpan: "2", label: "No", className: "text-center", width: "1%" },
      { rowSpan: "2", label: "#", className: "text-center", width: "1%" },
      { rowSpan: "2", label: "Kode transaksi", width: "1%" },
      { rowSpan: "2", label: "Tanggal", width: "1%" },
      { rowSpan: "2", label: "Lokasi", width: "1%" },
      { rowSpan: "2", label: "Customer", width: "1%" },
      { rowSpan: "2", label: "Operator", width: "1%" },
      { colSpan: "3", label: "Total Transaksi", width: "1%" },
      { rowSpan: "2", label: "Catatan" },
    ];
    const rowSpan = [
      { label: "Item", width: "1%" },
      { label: "Qty", width: "1%" },
      { label: "Bayar", width: "1%" },
    ];
    let totalItemPerHalaman = 0;
    let totalBayarPerHalaman = 0;
    let totalQtyPerHalaman = 0;
    return (
      <Layout page="Approval Sales Order">
        <HeaderReportCommon
          pathName="ApprovalSO"
          col="col-md-3"
          callbackWhere={(res) => this.handleService(res)}
        />

        <TableCommon
          head={head}
          rowSpan={rowSpan}
          meta={{
            total: total,
            current_page: current_page,
            per_page: per_page,
          }}
          current_page={current_page}
          callbackPage={this.handlePageChange.bind(this)}
          renderRow={
            typeof data === "object"
              ? data.length > 0
                ? data.map((v, i) => {
                    let btnAction = [{ label: "Delete" }, { label: "Approve" }];
                    totalItemPerHalaman += Number(v.detail.length);
                    totalBayarPerHalaman += Number(v.subtotal_so);
                    totalQtyPerHalaman += Number(v.qty_so);
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">
                          {generateNo(i, current_page)}
                        </td>
                        <td className="middle nowrap text-center">
                          <ButtonActionCommon
                            action={btnAction}
                            callback={(e) => {
                              if (e === 0) this.handleDelete(v);
                              if (e === 1) this.handleModal(v);
                            }}
                          />
                        </td>

                        <td className="middle nowrap">{v.kd_so}</td>
                        <td className="middle nowrap">
                          {moment(v.created_at).format("LLL")}
                        </td>
                        <td className="middle nowrap">{v.lokasi}</td>
                        <td className="middle nowrap">{v.kd_cust}</td>
                        <td className="middle nowrap">{v.operator}</td>
                        <td className="middle nowrap text-right">
                          {parseToRp(Number(v.detail.length))}
                        </td>
                        <td className="middle nowrap text-right">
                          {/* <input
                            style={{ width: "100px", textAlign: "right" }}
                            onChange={(e) => this.handleChange(e, i)}
                            name={`qty_so_${i}`}
                            value={toRp(this.state.dataApprove[i].qty_so)}
                            className="form-control in-table"
                          /> */}
                          {parseToRp(Number(v.qty_so))}
                        </td>
                        <td className="middle nowrap text-right">
                          Rp. {parseToRp(Number(v.subtotal_so))},-
                        </td>
                        <td className="middle nowrap">{v.catatan_so}</td>
                      </tr>
                    );
                  })
                : noData(head.length + rowSpan.length)
              : noData(head.length + rowSpan.length)
          }
          footer={[
            {
              data: [
                {
                  colSpan: 7,
                  label: "Total perhalaman",
                  className: "text-left",
                },
                {
                  colSpan: 1,
                  label: parseToRp(totalItemPerHalaman),
                  className: "text-right",
                },
                {
                  colSpan: 1,
                  label: parseToRp(totalQtyPerHalaman),
                  className: "text-right",
                },
                {
                  colSpan: 1,
                  label: `Rp. ${parseToRp(totalBayarPerHalaman)},-`,
                  className: "text-right",
                },
                {
                  colSpan: 1,
                  label: "",
                  className: "text-left",
                },
              ],
            },
          ]}
        />
        {this.state.isModalDetail && this.props.isOpen ? (
          <DetailApprovalSalesOrder
            data={this.state.detail}
            dataApprove={this.state.dataApprove}
          />
        ) : null}
      </Layout>
    );
  }
}

const mapStateToPropsCreateItem = (state) => {
  return {
    data: state.salesOrderReducer.dataGetApproval,
    auth: state.auth,
    isOpen: state.modalReducer,
  };
};
export default withRouter(connect(mapStateToPropsCreateItem)(ApproveSo));
