import React, { Component } from "react";
import Layout from "components/App/Layout";
import { FetchPurchaseBySupplierReport, FetchPurchaseBySupplierReportExcel } from "redux/actions/purchase/purchase_order/po.action";
import connect from "react-redux/es/connect/connect";
import PurchaseBySupplierReportExcel from "components/App/modals/purchase/form_purchase_by_supplier_excel";
import { CURRENT_DATE, DEFAULT_WHERE, generateNo, getFetchWhere, getPeriode, noData, parseToRp } from "../../../../helper";
import HeaderReportCommon from "../../common/HeaderReportCommon";
import TableCommon from "../../common/TableCommon";

class PurchaseBySupplierReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      where_data: DEFAULT_WHERE,
      startDate: CURRENT_DATE,
      endDate: CURRENT_DATE,
      column_data: [
        { value: "kode", label: "Kode" },
        { value: "nama", label: "Nama" },
        { value: "total_pembelian", label: "Total Pembelian" },
      ],
      isModalExport: false,
    };
  }
  componentWillUnmount() {
    this.setState({ isModalExport: false });
  }
  handleService(res, page = 1) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      let state = { where_data: where };
      this.setState(state);
      this.props.dispatch(FetchPurchaseBySupplierReport(where));
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
      Object.assign(setState, { isModalExport: true });
      this.props.dispatch(FetchPurchaseBySupplierReportExcel(where, obj.total));
    }
    this.setState(setState);
  }

  render() {
    const { per_page, last_page, current_page, data, total } = this.props.purchase_by_supplierReport;
    let totalPembelianPerHalaman = 0;
    const { startDate, endDate, column_data, isModalExport } = this.state;
    const head = [{ label: "No", className: "text-center", width: "1%" }, { label: "Kode", width: "1%" }, { label: "Nama" }, { label: "Total pembelian", width: "1%" }];
    return (
      <Layout page="Laporan PurchaseBySupplier">
        <HeaderReportCommon
          col="col-md-2"
          pathName="ReportPurchaseBySupplier"
          isLocation={true}
          isColumn={true}
          isSort={true}
          columnData={column_data}
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
                    totalPembelianPerHalaman = totalPembelianPerHalaman + parseInt(v.total_pembelian);
                    return (
                      <tr key={i}>
                        <td className="text-center middle nowrap">{generateNo(i, current_page)}</td>
                        <td className="middle nowrap">{v.kode}</td>
                        <td className="middle nowrap">{v.nama}</td>
                        <td className="text-right middle nowrap">{parseToRp(v.total_pembelian)}</td>
                      </tr>
                    );
                  })
                : noData(head.length)
              : noData(head.length)
          }
          footer={[
            {
              data: [
                { colSpan: 3, label: "Total perhalaman", className: "text-left" },
                { colSpan: 1, label: parseToRp(totalPembelianPerHalaman) },
              ],
            },
          ]}
        />
        {this.props.isOpen && isModalExport ? <PurchaseBySupplierReportExcel startDate={startDate} endDate={endDate} /> : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    download: state.poReducer.downloadPoSupplier,
    purchase_by_supplierReport: state.poReducer.pbs_data,
    auth: state.auth,
    isLoading: state.poReducer.isLoading,
    purchase_by_supplierReportExcel: state.poReducer.pbs_data_excel,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(PurchaseBySupplierReport);
