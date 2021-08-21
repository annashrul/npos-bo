import React, { Component } from "react";
import Layout from "components/App/Layout";
import { FetchPacking, FetchPackingExcel } from "redux/actions/inventory/packing.action";
import connect from "react-redux/es/connect/connect";
import PackingReportExcel from "components/App/modals/report/inventory/packing_report/form_packing_excel";
import HeaderReportCommon from "../../../common/HeaderReportCommon";
import TableCommon from "../../../common/TableCommon";
import { statusPacking, STATUS_PACKING_DAN_EXPEDISI } from "../../../../../helperStatus";
import { generateNo, getFetchWhere, getPeriode, noData, rmSpaceToStrip, toDate } from "../../../../../helper";
import ButtonActionCommon from "../../../common/ButtonActionCommon";

class PackingReport extends Component {
  constructor(props) {
    super(props);
    this.handleModal = this.handleModal.bind(this);
    this.handleService = this.handleService.bind(this);
    this.state = {
      where_data: "",
      startDate: "",
      endDate: "",
      column_data: [
        { value: "kd_packing", label: "Kode Packing" },
        { value: "tgl_packing", label: "Tanggal" },
        { value: "status", label: "Status" },
        { value: "pengirim", label: "Pengirim" },
      ],
      isModalExport: false,
    };
  }

  handlePageChange(pageNumber) {
    this.handleService(this.state.where_data, pageNumber);
  }

  handleService(res, page = 1) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      let state = { where_data: where };
      this.setState(state);
      this.props.dispatch(FetchPacking(where));
    }
  }

  handleModal(total) {
    let whereState = this.state.where_data;
    let where = getFetchWhere(whereState);
    let periode = getPeriode(where.split("&"));
    let getDate = periode.split("-");
    this.setState({ isModalExport: true, startDate: getDate[0], endDate: getDate[1], where_data: where });
    this.props.dispatch(FetchPackingExcel(this.state.where_data, total));
  }

  render() {
    const { per_page, last_page, current_page, total, data } = this.props.packingReport;
    const { startDate, endDate, column_data, isModalExport } = this.state;
    const head = [
      { rowSpan: 2, label: "No", className: "text-center", width: "1%" },
      { rowSpan: 2, label: "#", className: "text-center", width: "1%" },
      { colSpan: 4, label: "No faktur", width: "1%" },
      { rowSpan: 2, label: "Pengirim" },
      { rowSpan: 2, label: "Penerima" },
      { colSpan: 2, label: "Lokasi", width: "1%" },
      { rowSpan: 2, label: "Operator" },
      { rowSpan: 2, label: "Status", width: "1%" },
      { rowSpan: 2, label: "Tanggal", width: "1%" },
    ];
    const rowSpan = [{ label: "Packing" }, { label: "Beli" }, { label: "Delivery note" }, { label: "Mutasi" }, { label: "Asal" }, { label: "Tujuan" }];
    return (
      <Layout page="Laporan Packing">
        <HeaderReportCommon
          pathName="ReportPacking"
          isLocation={true}
          isColumn={true}
          isSort={true}
          isStatus={true}
          columnData={column_data}
          statusData={STATUS_PACKING_DAN_EXPEDISI}
          callbackWhere={(res) => this.handleService(res)}
          callbackExcel={() => this.handleModal(last_page * per_page)}
          excelData={this.props.download}
        />

        <TableCommon
          head={head}
          rowSpan={rowSpan}
          meta={{ total: total, current_page: current_page, per_page: per_page }}
          current_page={current_page}
          callbackPage={this.handlePageChange.bind(this)}
          renderRow={
            typeof data === "object"
              ? data.length > 0
                ? data.map((v, i) => {
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center"> {generateNo(i, current_page)}</td>
                        <td className="middle nowrap text-center">
                          <ButtonActionCommon
                            action={[{ label: "3ply" }]}
                            callback={(e) => {
                              if (e === 0) this.props.history.push(`../packing3ply/${v.kd_packing}`);
                            }}
                          />
                        </td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.kd_packing)}</td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.no_faktur_beli)}</td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.delivery_note)}</td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.no_faktur_mutasi)}</td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.pengirim)}</td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.penerima)}</td>
                        <td className="middle nowrap">{v.kd_lokasi_1}</td>
                        <td className="middle nowrap">{v.kd_lokasi_2}</td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.nama_operator)}</td>
                        <td className="middle nowrap">{statusPacking(v.status, true)}</td>
                        <td className="middle nowrap">{toDate(v.tgl_packing)}</td>
                      </tr>
                    );
                  })
                : noData(head.length + rowSpan.length)
              : noData(head.length + rowSpan.length)
          }
        />
        {this.props.isOpen && isModalExport ? <PackingReportExcel startDate={startDate} endDate={endDate} /> : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    download: state.packingReducer.download,
    packingReport: state.packingReducer.report,
    packingReportExcel: state.packingReducer.report_excel,
    auth: state.auth,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(PackingReport);
