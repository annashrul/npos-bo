import React, { Component } from "react";
import Layout from "components/App/Layout";
import { FetchMutation, FetchMutationExcel, FetchMutationData, rePrintFaktur } from "redux/actions/inventory/mutation.action";
import connect from "react-redux/es/connect/connect";
import DetailMutation from "components/App/modals/report/inventory/mutation_report/detail_mutation";
import MutationReportExcel from "components/App/modals/report/inventory/mutation_report/form_mutation_excel";
import { CURRENT_DATE, generateNo, getFetchWhere, getPeriode, noData, parseToRp, rmSpaceToStrip, toDate, toRp } from "../../../../../helper";
import ButtonActionCommon from "../../../common/ButtonActionCommon";
import TableCommon from "../../../common/TableCommon";
import { statusMutasi, STATUS_MUTASI } from "../../../../../helperStatus";
import HeaderReportCommon from "../../../common/HeaderReportCommon";

class MutationReport extends Component {
  constructor(props) {
    super(props);
    this.handleModal = this.handleModal.bind(this);
    this.handleService = this.handleService.bind(this);
    this.handleRePrint = this.handleRePrint.bind(this);
    this.state = {
      where_data: `page=1&datefrom=${CURRENT_DATE}&dateto=${CURRENT_DATE}`,
      startDate: CURRENT_DATE,
      endDate: CURRENT_DATE,
      column_data: [
        { value: "", label: "Semua" },
        { value: "no_faktur_mutasi", label: "Kode Mutasi" },
        { value: "tgl_mutasi", label: "Tanggal" },
        { value: "status", label: "Status" },
      ],
      isModalDetail: false,
      isModalExport: false,
    };
  }

  handleService(res, page = 1) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      let state = { where_data: where };
      this.setState(state);
      this.props.dispatch(FetchMutation(where));
    }
  }

  componentWillUnmount() {
    this.setState({
      isModalDetail: false,
      isModalExport: false,
    });
  }

  handlePageChange(pageNumber) {
    this.handleService(this.state.where_data, pageNumber);
  }
  handleModal(type, obj) {
    let whereState = this.state.where_data;
    let where = getFetchWhere(whereState);
    let periode = getPeriode(where.split("&"));
    let getDate = periode.split("-");
    let state = { startDate: getDate[0], endDate: getDate[1], where_data: where };

    if (type === "excel") {
      Object.assign(state, { isModalExport: true });
      this.props.dispatch(FetchMutationExcel(where, obj.total));
    } else {
      Object.assign(state, { isModalDetail: true, where_data: where });
      this.props.dispatch(FetchMutationData(obj.no_faktur_mutasi, where, true));
    }
    this.setState(state);
  }

  handleRePrint(id) {
    this.props.dispatch(rePrintFaktur(id));
  }

  render() {
    const { per_page, last_page, current_page, data, total } = this.props.mutationReport;
    const { startDate, endDate, column_data, isModalDetail, isModalExport } = this.state;
    const head = [
      { rowSpan: "2", label: "No", className: "text-center", width: "1%" },
      { rowSpan: "2", label: "#", className: "text-center", width: "1%" },
      { colSpan: "2", label: "Faktur", width: "1%" },
      { colSpan: "2", label: "Lokasi", width: "1%" },
      { rowSpan: "2", label: "qty", width: "1%" },
      { rowSpan: "2", label: "Total transaksi", width: "1%" },
      { rowSpan: "2", label: "Keterangan" },
      { rowSpan: "2", label: "Status", width: "1%" },
      { rowSpan: "2", label: "Tanggal mutasi", width: "1%" },
    ];
    let totalQtyPerHalaman = 0;
    let totalAmounPerHalaman = 0;

    return (
      <Layout page="Laporan Mutasi">
        <HeaderReportCommon
          pathName="ReportMutasi"
          isLocation={true}
          isColumn={true}
          isSort={true}
          isStatus={true}
          columnData={column_data}
          statusData={STATUS_MUTASI}
          callbackWhere={(res) => this.handleService(res)}
          callbackExcel={() => this.handleModal("excel", { total: last_page * per_page })}
          excelData={this.props.download}
        />
        <TableCommon
          head={head}
          rowSpan={[{ label: "Mutasi" }, { label: "Beli" }, { label: "Asal" }, { label: "Tujuan" }]}
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
                    let action = [{ label: "Detail" }, { label: "Print Faktur" }, { label: "3ply" }, { label: "Edit" }];
                    if (v.status !== "0") {
                      action = [{ label: "Detail" }, { label: "Print Faktur" }, { label: "3ply" }];
                    }
                    totalQtyPerHalaman = totalQtyPerHalaman + parseInt(v.total_qty);
                    totalAmounPerHalaman = totalAmounPerHalaman + parseInt(v.total);
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">{generateNo(i, current_page)}</td>
                        <td className="middle nowrap text-center">
                          <ButtonActionCommon
                            action={action}
                            callback={(e) => {
                              console.log(e);
                              if (e === 0) this.handleModal("detail", v);
                              if (e === 1) this.handleRePrint(v.no_faktur_mutasi);
                              if (e === 2) this.props.history.push(`../alokasi3ply/${v.no_faktur_mutasi}`);
                              if (v.status === "0") {
                                if (e === 3) this.props.history.push(`../edit/alokasi/${btoa(v.no_faktur_mutasi)}`);
                              }
                            }}
                          />
                        </td>
                        <td className="middle nowrap">{v.no_faktur_mutasi}</td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.no_faktur_beli)}</td>
                        <td className="middle nowrap">{v.lokasi_asal}</td>
                        <td className="middle nowrap">{v.lokasi_tujuan}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.total_qty)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.total)}</td>
                        <td className="middle nowrap">{v.keterangan}</td>
                        <td className="middle nowrap">{statusMutasi(v.status, true)}</td>
                        <td className="middle nowrap">{toDate(v.tgl_mutasi)}</td>
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
                  colSpan: 6,
                  label: "Total perhalaman",
                  className: "text-left",
                },
                { colSpan: 1, label: toRp(parseFloat(totalQtyPerHalaman)) },
                { colSpan: 1, label: toRp(parseFloat(totalAmounPerHalaman)) },
                { colSpan: 3, label: "" },
              ],
            },
          ]}
        />

        {this.props.isOpen && isModalDetail ? <DetailMutation /> : null}

        {this.props.isOpen && isModalExport ? <MutationReportExcel startDate={startDate} endDate={endDate} /> : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    mutationReport: state.mutationReducer.report,
    download: state.mutationReducer.download,
    mutationReportExcel: state.mutationReducer.report_excel,
    auth: state.auth,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(MutationReport);
