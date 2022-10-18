import React, { Component } from "react";
import Layout from "components/App/Layout";
import { FetchAlokasi, FetchAlokasiExcel, FetchAlokasiDetail } from "redux/actions/inventory/alokasi.action";
import { rePrintFaktur } from "redux/actions/inventory/mutation.action";
import connect from "react-redux/es/connect/connect";
import DetailAlokasi from "components/App/modals/report/inventory/alokasi_report/detail_alokasi";
import AlokasiReportExcel from "components/App/modals/report/inventory/alokasi_report/form_alokasi_excel";
import { CURRENT_DATE, DEFAULT_WHERE, generateNo, getFetchWhere, getPeriode, noData, rmSpaceToStrip, toDate } from "../../../../../helper";

import TableCommon from "../../../common/TableCommon";
import ButtonActionCommon from "../../../common/ButtonActionCommon";
import { statusAlokasi, STATUS_ALOKASI } from "../../../../../helperStatus";
import HeaderReportCommon from "../../../common/HeaderReportCommon";
import { linkAlokasi, linkReportAlokasi, linkReportAlokasi3ply } from "../../../../../helperLink";

class AlokasiReport extends Component {
  constructor(props) {
    super(props);
    this.handleModal = this.handleModal.bind(this);
    this.handleRePrint = this.handleRePrint.bind(this);
    this.state = {
      where_data: DEFAULT_WHERE,
      startDate: CURRENT_DATE,
      endDate: CURRENT_DATE,
      column_data: [
        { value: "no_faktur_mutasi", label: "Faktur mutasi" },
        { value: "tgl_mutasi", label: "Tanggal Mutasi" },
        { value: "status", label: "Status" },
      ],
      isModalDetail: false,
      isModalExcel: false,
    };
  }
  componentWillUnmount() {
    this.setState({
      isModalDetail: false,
      isModalExcel: false,
    });
  }

  handleService(res, page = 1) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      let state = { where_data: where };
      this.setState(state);
      this.props.dispatch(FetchAlokasi(where));
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
    let setState = { startDate: getDate[0], endDate: getDate[1], where_data: where };

    if (type === "excel") {
      Object.assign(setState, { isModalExcel: true });
      this.props.dispatch(FetchAlokasiExcel(where, obj.total));
    } else if (type === "detail") {
      Object.assign(setState, { isModalDetail: true });
      this.props.dispatch(FetchAlokasiDetail(obj.no_faktur_mutasi, where));
    }
    this.setState(setState);
  }

  handleRePrint(id) {
    this.props.dispatch(rePrintFaktur(id));
  }

  render() {
    const { per_page, last_page, current_page, data, total } = this.props.alokasiReport;
    const { startDate, endDate, column_data, isModalExcel, isModalDetail } = this.state;
    const head = [
      { rowSpan: 2, label: "No", className: "text-center", width: "1%" },
      { rowSpan: 2, label: "#", className: "text-center", width: "1%" },
      { colSpan: 2, label: "Faktur", width: "1%" },
      { colSpan: 2, label: "Lokasi", width: "1%" },
      { rowSpan: 2, label: "Keterangan" },
      { rowSpan: 2, label: "Status", width: "1%" },
      { rowSpan: 2, label: "Tanggal", width: "1%" },
    ];
    const rowSpan = [{ label: "Mutasi" }, { label: "Beli" }, { label: "Asal" }, { label: "Tujuan" }];
    return (
      <Layout page="Laporan Alokasi">
        <HeaderReportCommon
          pathName="ReportAlokasi"
          isLocation={true}
          isColumn={true}
          isSort={true}
          isStatus={true}
          columnData={column_data}
          statusData={STATUS_ALOKASI}
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
                    let action = [{ label: "Detail" }];
                    if (v.status === "0") {
                      action.push({ label: "Edit" });
                    }
                    action.push({ label: "3ply" }, { label: "Print nota" });
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center"> {generateNo(i, current_page)}</td>
                        <td className="middle nowrap text-center">
                          <ButtonActionCommon
                            action={action}
                            callback={(e) => {
                              if (e === 0) this.handleModal("detail", v);
                              if (e === 1) this.props.history.push(`${linkAlokasi}/${btoa(v.no_faktur_mutasi)}`);
                              if (e === 2) this.props.history.push(`${linkReportAlokasi3ply}${v.no_faktur_mutasi}`);
                              if (e === 3) this.handleRePrint(v.no_faktur_mutasi);
                            }}
                          />
                        </td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.no_faktur_mutasi)}</td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.no_faktur_beli)}</td>
                        <td className="middle nowrap">{v.lokasi_asal}</td>
                        <td className="middle nowrap">{v.lokasi_tujuan}</td>

                        <td className="middle nowrap">{rmSpaceToStrip(v.keterangan)}</td>
                        <td className="middle nowrap">{statusAlokasi(v.status, true)}</td>
                        <td className="middle nowrap">{toDate(v.tgl_mutasi)}</td>
                      </tr>
                    );
                  })
                : noData(head.length + rowSpan.length)
              : noData(head.length + rowSpan.length)
          }
        />

        {this.props.isOpen && isModalDetail ? <DetailAlokasi where={this.state.where_data} alokasiDetail={this.props.alokasiDetail} /> : null}
        {this.props.isOpen && isModalExcel ? <AlokasiReportExcel startDate={startDate} endDate={endDate} /> : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    alokasiReport: state.alokasiReducer.data,
    download: state.alokasiReducer.download,
    auth: state.auth,
    alokasiDetail: state.alokasiReducer.alokasi_data,
    alokasiReportExcel: state.alokasiReducer.report_excel,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(AlokasiReport);
