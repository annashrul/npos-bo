import React, { Component } from "react";
import Layout from "components/App/Layout";
import { FetchOpname, FetchOpnameExcel } from "redux/actions/inventory/opname.action";
import connect from "react-redux/es/connect/connect";
import OpnameReportExcel from "components/App/modals/report/inventory/opname_report/form_opname_excel";
import { DEFAULT_WHERE, generateNo, getFetchWhere, getPeriode, noData, parseToRp, toDate, float } from "../../../../../helper";
import { statusOpname, STATUS_OPNAME } from "../../../../../helperStatus";
import TableCommon from "../../../common/TableCommon";
import HeaderReportCommon from "../../../common/HeaderReportCommon";

class OpnameReport extends Component {
  constructor(props) {
    super(props);
    this.handleModal = this.handleModal.bind(this);
    this.handleService = this.handleService.bind(this);
    this.state = {
      periode: "",
      where_data: DEFAULT_WHERE,
      column_data: [
        { value: "nm_brg", label: "Nama barang" },
        { value: "kd_trx", label: "Kode transaksi" },
        { value: "tgl", label: "Tanggal" },
        { value: "status", label: "Status" },
      ],

      isModalExport: false,
    };
  }

  componentWillUnmount() {
    this.setState({ isModalExport: false });
  }

  handlePageChange(pageNumber) {
    this.handleService(this.state.where_data, pageNumber);
  }

  handleService(res, page = 1) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      this.setState({ where_data: where });
      this.props.dispatch(FetchOpname(where));
    }
  }

  handleModal(param, obj) {
    let whereState = this.state.where_data;
    let periode = getPeriode(whereState.split("&"));
    let state = { periode: periode };
    if (param === "excel") {
      Object.assign(state, { isModalExport: true });
      this.props.dispatch(FetchOpnameExcel(getFetchWhere(whereState, 1), obj.total));
      this.setState(state);
    }
  }

  render() {
    const { column_data, periode, isModalExport, where_data } = this.state;
    const { per_page, last_page, current_page, data, total, total_opname } = this.props.opnameReport;
    const head = [
      { rowSpan: 2, label: "No", className: "text-center", width: "1%" },
      { rowSpan: 2, label: "Kode transaksi", width: "1%" },
      { colSpan: 5, label: "Barang", width: "1%" },
      { rowSpan: 2, label: "Lokasi", width: "1%" },
      { colSpan: 2, label: "Stok", width: "1%" },
      { rowSpan: 2, label: "Selisih stok", width: "1%" },
      { rowSpan: 2, label: "HPP", width: "1%" },
      { rowSpan: 2, label: "Selisih Hpp", width: "1%" },
      { rowSpan: 2, label: "Status", width: "1%" },
      { rowSpan: 2, label: "Tanggal", width: "1%" },
    ];
    const rowSpan = [
      { label: "Kode", width: "1%" },
      { label: "Nama" },
      { label: "Barcode", width: "1%" },
      { label: "Kelompok" },
      { label: "Harga beli", width: "1%" },
      { label: "Akhir" },
      { label: "Fisik" },
    ];
    let totalFisikPerPage = 0;
    let totalAkhirPerPage = 0;
    let totalHppPerPage = 0;
    console.log(total_opname);
    return (
      <Layout page="Laporan Opname">
        <HeaderReportCommon
          pathName="ReportOpname"
          isAll={true}
          columnData={column_data}
          statusData={STATUS_OPNAME}
          excelData={this.props.download}
          callbackWhere={this.handleService}
          callbackExcel={() => this.handleModal("excel", { total: last_page * per_page })}
        />
        <TableCommon
          head={head}
          rowSpan={rowSpan}
          meta={{ total: total, current_page: current_page, per_page: per_page }}
          current_page={current_page}
          callbackPage={(page) => this.handleService(where_data, page)}
          renderRow={
            typeof data === "object"
              ? data.length > 0
                ? data.map((v, i) => {
                    totalFisikPerPage += float(v.qty_fisik);
                    totalAkhirPerPage += float(v.stock_terakhir);
                    totalHppPerPage += (parseFloat(v.qty_fisik) - parseFloat(v.stock_terakhir)) * parseInt(v.hrg_beli, 10);
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center"> {generateNo(i, current_page)}</td>
                        <td className="middle nowrap">{v.kd_trx}</td>
                        <td className="middle nowrap">{v.kd_brg}</td>
                        <td className="middle nowrap">{v.nm_brg}</td>
                        <td className="middle nowrap">{v.barcode}</td>
                        <td className="middle nowrap">{v.nm_kel_brg}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.hrg_beli)}</td>
                        <td className="middle nowrap">{v.lokasi_nama}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.stock_terakhir)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.qty_fisik)}</td>
                        <td className="middle nowrap text-right">{parseToRp(parseFloat(v.qty_fisik) - parseFloat(v.stock_terakhir))}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.hrg_beli)}</td>
                        <td className="middle nowrap text-right">{parseToRp((parseFloat(v.qty_fisik) - parseFloat(v.stock_terakhir)) * v.hrg_beli)}</td>
                        <td className="middle nowrap">{statusOpname(v.status, true)}</td>
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
                { colSpan: 8, label: "Total perhalaman", className: "text-left" },
                { colSpan: 1, label: parseToRp(totalAkhirPerPage), className: `text-right` },
                { colSpan: 1, label: parseToRp(totalFisikPerPage), className: `text-right ` },
                { colSpan: 2, label: "" },
                { colSpan: 1, label: parseToRp(totalHppPerPage), className: `text-right ` },
                { colSpan: 2, label: "" },
              ],
            },
            {
              data: [
                { colSpan: 8, label: "Total keseluruhan", className: "text-left" },
                { colSpan: 1, label: parseToRp(total_opname ? total_opname.total_akhir : 0), className: `text-right` },
                { colSpan: 1, label: parseToRp(total_opname ? total_opname.total_fisik : 0), className: `text-right ` },
                { colSpan: 2, label: "" },
                { colSpan: 1, label: parseToRp(total_opname ? total_opname.total_hpp : 0), className: `text-right ` },
                { colSpan: 2, label: "" },
              ],
            },
          ]}
        />
        {this.props.isOpen && isModalExport ? <OpnameReportExcel periode={periode} /> : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    download: state.opnameReducer.download,
    opnameReport: state.opnameReducer.report,
    opnameReportExcel: state.opnameReducer.report_excel,
    auth: state.auth,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(OpnameReport);
