import React, { Component } from "react";
import Layout from "components/App/Layout";
import { FetchExpedisi, FetchExpedisiExcel } from "redux/actions/inventory/expedisi.action";
import connect from "react-redux/es/connect/connect";
import ExpedisiReportExcel from "components/App/modals/report/inventory/expedisi_report/form_expedisi_excel";
import HeaderReportCommon from "../../../common/HeaderReportCommon";
import TableCommon from "../../../common/TableCommon";
import { statusPacking, STATUS_PACKING_DAN_EXPEDISI } from "../../../../../helperStatus";
import { generateNo, getFetchWhere, getPeriode, noData, rmSpaceToStrip, toDate } from "../../../../../helper";

class ExpedisiReport extends Component {
  constructor(props) {
    super(props);
    this.handleModal = this.handleModal.bind(this);
    this.handleService = this.handleService.bind(this);
    this.state = {
      where_data: "",
      startDate: "",
      endDate: "",
      column_data: [
        { value: "kd_expedisi", label: "Kode Ekspedisi" },
        { value: "tgl_expedisi", label: "Tanggal" },
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
      this.props.dispatch(FetchExpedisi(where));
    }
  }

  handleModal(total) {
    let whereState = this.state.where_data;
    let where = getFetchWhere(whereState);
    let periode = getPeriode(where.split("&"));
    let getDate = periode.split("-");
    this.setState({ isModalExport: true, startDate: getDate[0], endDate: getDate[1], where_data: where });
    this.props.dispatch(FetchExpedisiExcel(this.state.where_data, total));
  }

  render() {
    const { per_page, last_page, current_page, total, data } = this.props.expedisiReport;
    const { startDate, endDate, column_data, isModalExport } = this.state;
    const head = [
      { rowSpan: 2, label: "No", className: "text-center", width: "1%" },
      { rowSpan: 2, label: "No Expedisi", width: "1%" },
      { rowSpan: 2, label: "Pengirim" },
      { colSpan: 2, label: "Lokasi", width: "1%" },
      { rowSpan: 2, label: "Operator" },
      { rowSpan: 2, label: "Status", width: "1%" },
      { rowSpan: 2, label: "Tanggal", width: "1%" },
    ];
    const rowSpan = [{ label: "Asal" }, { label: "Tujuan" }];
    return (
      <Layout page="Laporan Expedisi">
        <HeaderReportCommon
          pathName="ReportExpedisi"
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
                        <td className="middle nowrap">{rmSpaceToStrip(v.kd_expedisi)}</td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.pengirim)}</td>
                        <td className="middle nowrap">{v.nama_lokasi_asal}</td>
                        <td className="middle nowrap">{v.nama_lokasi_asal}</td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.nama_operator)}</td>
                        <td className="middle nowrap">{statusPacking(v.status, true)}</td>
                        <td className="middle nowrap">{toDate(v.tgl_expedisi)}</td>
                      </tr>
                    );
                  })
                : noData(head.length + rowSpan.length)
              : noData(head.length + rowSpan.length)
          }
        />

        {this.props.isOpen && isModalExport ? <ExpedisiReportExcel startDate={startDate} endDate={endDate} /> : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    download: state.expedisiReducer.download,
    expedisiReport: state.expedisiReducer.report,
    expedisiReportExcel: state.expedisiReducer.report_excel,
    auth: state.auth,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(ExpedisiReport);
