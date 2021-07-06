import React, { Component } from "react";
import Layout from "components/App/Layout";
import { FetchProduction, FetchProductionExcel, FetchProductionData } from "redux/actions/inventory/produksi.action";
import connect from "react-redux/es/connect/connect";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import DetailProduction from "components/App/modals/report/inventory/production_report/detail_production";
import ProductionReportExcel from "components/App/modals/report/inventory/production_report/form_production_excel";
import ApproveProduction from "components/App/modals/report/inventory/production_report/approve_production";

import HeaderReportCommon from "../../../common/HeaderReportCommon";
import TableCommon from "../../../common/TableCommon";
import { statusProduksi, STATUS_PRODUKSI } from "../../../../../helperStatus";
import { float, parseToRp, generateNo, getFetchWhere, getPeriode, noData, rmSpaceToStrip, toDate } from "../../../../../helper";
import ButtonActionCommon from "../../../common/ButtonActionCommon";

class ProductionReport extends Component {
  constructor(props) {
    super(props);
    this.handleModal = this.handleModal.bind(this);
    this.handleService = this.handleService.bind(this);
    this.state = {
      where_data: "",
      startDate: "",
      endDate: "",
      column_data: [
        { value: "kd_produksi", label: "Kode produksi" },
        { value: "tanggal", label: "Tanggal" },
        { value: "status", label: "Status" },
      ],
      detail: {},
      isModalDetail: false,
      isModalExport: false,
      isModalForm: false,
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
      this.props.dispatch(FetchProduction(where));
    }
  }

  handleModal(type = "excel", obj) {
    let whereState = this.state.where_data;
    let where = getFetchWhere(whereState);
    let periode = getPeriode(where.split("&"));
    let getDate = periode.split("-");
    let state = { startDate: getDate[0], endDate: getDate[1], where_data: where };

    if (type === "excel") {
      Object.assign(state, { isModalExport: true });
      this.props.dispatch(FetchProductionExcel(where, obj.total));
    } else if (type === "detail") {
      Object.assign(obj, { where: where });
      Object.assign(state, { isModalDetail: true, detail: obj });
      this.props.dispatch(FetchProductionData(obj.kd_produksi, where, true));
    } else {
      Object.assign(obj, { where: where });
      Object.assign(state, { isModalForm: true, detail: obj });
      this.props.dispatch(ModalToggle(true));
      this.props.dispatch(ModalType("approveProduction"));
    }
    this.setState(state);
  }

  render() {
    const { per_page, last_page, current_page, data, total } = this.props.productionReport;
    const { startDate, endDate, column_data, isModalDetail, isModalExport, isModalForm, detail } = this.state;
    let totalQtyEstimasiPerHalaman = 0;
    let totalRataRataQtyPerHalaman = 0;
    let totalAmountPerHalaman = 0;
    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "#", className: "text-center", width: "1%" },
      { label: "Kode produksi", width: "1%" },
      { label: "Paket" },
      { label: "Operator", width: "1%" },
      { label: "Lokasi" },
      { label: "Qty estimasi", width: "1%" },
      { label: "Rata rata hpp/qty", width: "1%" },
      { label: "Total", width: "1%" },
      { label: "Keterangan" },
      { label: "Status", width: "1%" },
      { label: "Tanggal", width: "1%" },
    ];
    return (
      <Layout page="Laporan Production">
        <HeaderReportCommon
          pathName="ReportProduction"
          isLocation={true}
          isColumn={true}
          isSort={true}
          isStatus={true}
          columnData={column_data}
          statusData={STATUS_PRODUKSI}
          callbackWhere={(res) => this.handleService(res)}
          callbackExcel={() => this.handleModal("excel", { total: last_page * per_page })}
          excelData={this.props.download}
        />
        <TableCommon
          head={head}
          meta={{ total: total, current_page: current_page, per_page: per_page }}
          current_page={current_page}
          callbackPage={this.handlePageChange.bind(this)}
          renderRow={
            typeof data === "object"
              ? data.length > 0
                ? data.map((v, i) => {
                    let action = [{ label: "Detail" }];
                    if (v.status === 0) {
                      action.push({ label: "Terima" });
                    }
                    let hpp = float(v.hpp);
                    let qtyEstimasi = float(v.qty_estimasi);
                    let total = float(hpp * qtyEstimasi);

                    totalQtyEstimasiPerHalaman += qtyEstimasi;
                    totalRataRataQtyPerHalaman += hpp;
                    totalAmountPerHalaman += total;
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center"> {generateNo(i, current_page)}</td>
                        <td className="middle nowrap text-center">
                          <ButtonActionCommon
                            action={action}
                            callback={(e) => {
                              if (e === 0) this.handleModal("detail", v);
                              if (e === 1) this.handleModal("approval", v);
                            }}
                          />
                        </td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.kd_produksi)}</td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.nm_brg)}</td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.operator)}</td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.nama_toko)}</td>
                        <td className="middle nowrap text-right ">{parseToRp(qtyEstimasi)}</td>
                        <td className="middle nowrap text-right ">{parseToRp(hpp)}</td>
                        <td className="middle nowrap text-right ">{parseToRp(total)}</td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.keterangan)}</td>
                        <td className="middle nowrap">{statusProduksi(`${v.status}`, true)}</td>
                        <td className="middle nowrap">{toDate(v.tanggal)}</td>
                      </tr>
                    );
                  })
                : noData(head.length)
              : noData(head.length)
          }
          footer={[
            {
              data: [
                { colSpan: 6, label: "Total perhalaman", className: "text-left" },
                { colSpan: 1, label: parseToRp(totalQtyEstimasiPerHalaman) },
                { colSpan: 1, label: parseToRp(totalRataRataQtyPerHalaman) },
                { colSpan: 1, label: parseToRp(totalAmountPerHalaman) },
                { colSpan: 3, label: "" },
              ],
            },
          ]}
        />
        {this.props.isOpen && isModalDetail ? <DetailProduction detail={detail} productionDetail={this.props.productionDetail} /> : null}
        {this.props.isOpen && isModalExport ? <ProductionReportExcel startDate={startDate} endDate={endDate} /> : null}
        {this.props.isOpen && isModalForm ? <ApproveProduction detail={detail} /> : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    download: state.produksiReducer.download,
    productionReport: state.produksiReducer.report,
    auth: state.auth,
    productionDetail: state.produksiReducer.report_data,
    productionReportExcel: state.produksiReducer.report_excel,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(ProductionReport);
