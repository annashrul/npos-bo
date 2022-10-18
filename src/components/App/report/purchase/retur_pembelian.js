import React, { Component } from "react";
import Layout from "components/App/Layout";
import {
  FetchReportRetur,
  FetchReportDetailRetur,
} from "../../../../redux/actions/purchase/retur_tanpa_nota/return_tanpa_nota.action";
import connect from "react-redux/es/connect/connect";
import {
  CURRENT_DATE,
  DEFAULT_WHERE,
  generateNo,
  getFetchWhere,
  getPeriode,
  noData,
  parseToRp,
  rmSpaceToStrip,
  toDate,
} from "../../../../helper";
import HeaderReportCommon from "../../common/HeaderReportCommon";
import TableCommon from "../../common/TableCommon";
import ButtonActionCommon from "../../common/ButtonActionCommon";
import DetailReportRetur from "../../modals/report/purchase/retur/detail_report_retur";

class ReturPembelianReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      where_data: DEFAULT_WHERE,
      startDate: CURRENT_DATE,
      endDate: CURRENT_DATE,
      column_data: [
        { value: "no_retur", label: "No.Faktur Retur" },
        { value: "no_faktur_beli", label: "No.Faktur Beli" },
        { value: "supplier", label: "Supplier" },
      ],
      isModalDetail: false,
    };
  }
  componentWillUnmount() {
    this.setState({ isModalDetail: false });
  }
  handleService(res, page = 1) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      let state = { where_data: where };
      this.setState(state);
      this.props.dispatch(FetchReportRetur(where));
    }
  }

  handlePageChange(page) {
    this.handleService(this.state.where_data, page);
  }

  handleModal(type, obj) {
    let whereState = this.state.where_data;
    let where = getFetchWhere(whereState);
    let periode = getPeriode(where.split("&"));
    let getDate = periode.split("-");
    let setState = {
      startDate: getDate[0],
      endDate: getDate[1],
      where_data: where,
    };
    if (type === "detail") {
      Object.assign(setState, { isModalDetail: true });
      this.props.dispatch(FetchReportDetailRetur(obj.no_retur));
    }
    this.setState(setState);
  }

  render() {
    const { per_page, current_page, data, total } = this.props.data;
    let totalQtyPerHalaman = 0;
    let totalReturPerHalaman = 0;
    const { startDate, endDate, column_data, isModalDetail } = this.state;

    const head = [
      { rowSpan: 2, label: "No", className: "text-center", width: "1%" },
      { rowSpan: 2, label: "#", className: "text-center", width: "1%" },
      { colSpan: 2, label: "No.Faktur", width: "1%" },
      { rowSpan: 2, label: "Lokasi", width: "1%" },
      { rowSpan: 2, label: "Operator", width: "1%" },
      { rowSpan: 2, label: "Supplier", width: "1%" },
      { rowSpan: 2, label: "Qty retur", width: "1%" },
      { rowSpan: 2, label: "Total retur", width: "1%" },
      { rowSpan: 2, label: "Keterangan" },
      { rowSpan: 2, label: "Tanggal", width: "1%" },
    ];
    const rowSpan = [{ label: "Retur" }, { label: "Beli" }];
    return (
      <Layout page="Laporan Retur Pembelian">
        <HeaderReportCommon
          col="col-md-3"
          pathName="LaporanReturPembelian"
          isLocation={true}
          isColumn={true}
          columnData={column_data}
          callbackWhere={(res) => this.handleService(res)}
          // callbackExcel={() => this.handleModal("excel", { total: last_page * per_page })}
          // excelData={this.props.download}
          // sortNoColumn={true}
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
                    totalQtyPerHalaman += parseFloat(v.qty_retur);
                    totalReturPerHalaman += parseFloat(v.total_retur);
                    return (
                      <tr key={i}>
                        <td className="text-center middle nowrap">
                          {generateNo(i, current_page)}
                        </td>
                        <td className="middle nowrap text-center">
                          {v.no_faktur_beli !== "Tanpa Nota" && (
                            <ButtonActionCommon
                              action={[{ label: "Detail" }]}
                              callback={(e) => {
                                if (e === 0) this.handleModal("detail", v);
                                // if (e === 1) this.props.dispatch(FetchNotaReceipt(v.kd_trx));
                                // if (e === 2) this.props.history.push(`../print3ply/${v.kd_trx}`);
                                // if (e === 3) this.handleDelete(v.kd_trx);
                              }}
                            />
                          )}
                        </td>
                        <td className="middle nowrap">{v.no_retur}</td>
                        <td className="middle nowrap">{v.no_faktur_beli}</td>
                        <td className="middle nowrap">{v.lokasi}</td>
                        <td className="middle nowrap">{v.operator}</td>
                        <td className="middle nowrap">{v.supplier}</td>
                        <td className="text-right middle nowrap">
                          {parseToRp(v.qty_retur)}
                        </td>
                        <td className="text-right middle nowrap">
                          {parseToRp(v.total_retur)}
                        </td>
                        <td className="middle nowrap">
                          {rmSpaceToStrip(v.keterangan)}
                        </td>
                        <td className="middle nowrap">{toDate(v.tanggal)}</td>
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
                { colSpan: 1, label: parseToRp(totalQtyPerHalaman) },
                { colSpan: 1, label: parseToRp(totalReturPerHalaman) },
                { colSpan: 2, label: "" },
              ],
            },
          ]}
        />
        {this.props.isOpen && isModalDetail ? (
          <DetailReportRetur startDate={startDate} endDate={endDate} />
        ) : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.returReducer.data,
    auth: state.auth,
    isLoading: state.poReducer.isLoading,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(ReturPembelianReport);
