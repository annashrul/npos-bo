import React, { Component } from "react";
import Layout from "components/App/Layout";
import { FetchDn, FetchDnExcel, FetchDnDetail } from "redux/actions/inventory/dn.action";
import connect from "react-redux/es/connect/connect";
import DetailDn from "components/App/modals/report/inventory/dn_report/detail_dn";
import DnReportExcel from "components/App/modals/report/inventory/dn_report/form_dn_excel";
import { CURRENT_DATE, DEFAULT_WHERE, generateNo, getFetchWhere, getPeriode, noData, rmSpaceToStrip, toDate } from "../../../../../helper";
import { statusDeliveryNote, STATUS_DELIVERY_NOTE } from "../../../../../helperStatus";

import TableCommon from "../../../common/TableCommon";
import ButtonActionCommon from "../../../common/ButtonActionCommon";
import HeaderReportCommon from "../../../common/HeaderReportCommon";
import CompareLocationCommon from "../../../common/CompareLocationCommon";

class DnReport extends Component {
  constructor(props) {
    super(props);
    this.handleModal = this.handleModal.bind(this);
    this.handleService = this.handleService.bind(this);
    this.state = {
      where_data: DEFAULT_WHERE,
      startDate: CURRENT_DATE,
      endDate: CURRENT_DATE,
      column_data: [
        { value: "no_delivery_note", label: "No faktur delivery note" },
        { value: "tanggal", label: "Tanggal" },
        { value: "status", label: "Status" },
      ],
      status: "",
      isModalDetail: false,
      isModalExport: false,
    };
  }

  componentWillUnmount() {
    this.setState({ isModalDetail: false, isModalExport: false });
  }

  handlePageChange(pageNumber) {
    this.handleService(this.state.where, pageNumber);
  }

  handleService(res, page = 1) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      let state = { where_data: where };
      this.setState(state);
      this.props.dispatch(FetchDn(where));
    }
  }

  handleModal(param, obj) {
    let whereState = this.state.where_data;
    let where = getFetchWhere(whereState);
    let periode = getPeriode(where.split("&"));
    let getDate = periode.split("-");
    let setState = { startDate: getDate[0], endDate: getDate[1], where_data: where };

    if (param === "excel") {
      Object.assign(setState, { isModalExport: true });
      this.props.dispatch(FetchDnExcel(where, obj.total));
    } else {
      Object.assign(setState, { isModalDetail: true, detail: obj });
      this.props.dispatch(FetchDnDetail(obj.no_delivery_note, where, true));
    }
    this.setState(setState);
  }

  render() {
    const { per_page, last_page, current_page, data, total } = this.props.dnReport;
    const { startDate, endDate, column_data, isModalExport, isModalDetail } = this.state;
    const head = [
      { rowSpan: 2, label: "No", className: "text-center", width: "1%" },
      { rowSpan: 2, label: "#", className: "text-center", width: "1%" },
      { colSpan: 2, label: "No faktur", width: "1%" },
      { colSpan: 2, label: "Lokasi", width: "1%" },
      { rowSpan: 2, label: "Keterangan" },
      { rowSpan: 2, label: "Status", width: "1%" },
      { rowSpan: 2, label: "Tanggal", width: "1%" },
    ];

    const rowSpan = [{ label: "Delivery note" }, { label: "Beli" }, { label: "Asal" }, { label: "Tujuan" }];
    return (
      <Layout page="Laporan delivery note">
        <HeaderReportCommon
          pathName="ReportDeliveryNote"
          isLocation={true}
          isColumn={true}
          isSort={true}
          isStatus={true}
          columnData={column_data}
          statusData={STATUS_DELIVERY_NOTE}
          callbackWhere={(res) => this.handleService(res)}
          callbackExcel={() => this.handleModal("excel", { total: last_page * per_page })}
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
                            action={[{ label: "Detail" }, { label: "3ply" }]}
                            callback={(e) => {
                              if (e === 0) this.handleModal("detail", v);
                              if (e === 1) this.props.history.push(`/dn3ply/${v.no_delivery_note}`);
                            }}
                          />
                        </td>
                        <td className="middle nowrap">{v.no_delivery_note}</td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.no_faktur_beli)}</td>
                        <td className="middle nowrap"><CompareLocationCommon lokasi={v.kd_lokasi_1}/></td>
                        <td className="middle nowrap"><CompareLocationCommon lokasi={v.kd_lokasi_2}/></td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.keterangan)}</td>
                        <td className="middle nowrap">{statusDeliveryNote(v.status, true)}</td>
                        <td className="middle nowrap">{toDate(v.tanggal)}</td>
                      </tr>
                    );
                  })
                : noData(head.length + rowSpan.length)
              : noData(head.length + rowSpan.length)
          }
        />

        {this.props.isOpen && isModalDetail ? <DetailDn where={this.state.where_data} dnDetail={this.props.dnDetail} /> : null}

        {this.props.isOpen && isModalExport ? <DnReportExcel startDate={startDate} endDate={endDate} /> : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    download: state.dnReducer.download,
    dnReport: state.dnReducer.report,
    auth: state.auth,
    dnDetail: state.dnReducer.dn_detail,
    dnReportExcel: state.dnReducer.report_excel,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(DnReport);
