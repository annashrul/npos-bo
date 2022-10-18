import React, { Component } from "react";
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import SaleByCustReportExcel from "components/App/modals/report/sale/form_sale_by_cust_excel";
import { FetchReportSaleByCust, FetchReportSaleByCustExcel } from "redux/actions/sale/sale_by_cust.action";
import { float, generateNo, getFetchWhere, getPeriode, noData, parseToRp } from "../../../../helper";
import TableCommon from "../../common/TableCommon";
import HeaderReportCommon from "../../common/HeaderReportCommon";

class SaleByCustArchive extends Component {
  constructor(props) {
    super(props);
    this.handleService = this.handleService.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.state = {
      where_data: "",
      periode: "",
      isModalExport: false,
      column_data: [
        { value: "kd_cust", label: "Kode Cust." },
        { value: "nama", label: "Nama" },
        { value: "qty", label: "QTY" },
        { value: "gross_sales", label: "Gross Sales" },
        { value: "diskon_item", label: "Diskon Item" },
        { value: "diskon_trx", label: "Diskon Trx" },
        { value: "tax", label: "Tax" },
        { value: "service", label: "Service" },
      ],
    };
  }

  componentWillUnmount() {
    this.setState({ isModalDetail: false, isModalExport: false });
  }

  handlePageChange(pageNumber) {
    this.handleService(this.state.where_data, pageNumber);
  }

  handleModal(total) {
    let whereState = this.state.where_data;
    let where = getFetchWhere(whereState);
    let periode = getPeriode(where.split("&"));
    this.setState({ isModalExport: true, periode: periode, where_data: where });
    this.props.dispatch(FetchReportSaleByCustExcel(where, total));
  }

  handleService(res, page = 1) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      this.setState({ where_data: where });
      this.props.dispatch(FetchReportSaleByCust(where));
    }
  }

  render() {
    const { total, last_page, per_page, current_page, data } = this.props.sale_by_custReport;
    const { periode, column_data, isModalExport } = this.state;
    const startDate = periode.split("-")[0];
    const endDate = periode.split("-")[1];
    const head = [
      { rowSpan: 2, label: "No", className: "text-center", width: "1%" },
      { rowSpan: 2, label: "Kode Customer", width: "5%" },
      { rowSpan: 2, label: "Nama" },
      { rowSpan: 2, label: "Gross sales", width: "1%" },
      { colSpan: 2, label: "Diskon", width: "1%" },
      { rowSpan: 2, label: "Service", width: "1%" },
      { rowSpan: 2, label: "Qty", width: "1%" },
    ];
    const rowSpan = [{ label: "Item" }, { label: "Transaksi" }];

    let totalGrossSalePerHalaman = 0;
    let totalDiskonItemPerHalaman = 0;
    let totalDiskonTransaksiPerHalaman = 0;
    let totalServicePerHalaman = 0;
    let totalQtyPerHalaman = 0;
    return (
      <Layout page="Laporan arsip penjualan by customer">
        <HeaderReportCommon
          pathName="ReportSaleByCustomer"
          isColumn={true}
          columnData={column_data}
          isSort={true}
          callbackWhere={(res) => this.handleService(res)}
          callbackExcel={() => this.handleModal(last_page * per_page, per_page)}
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
                ? data.map((val, key) => {
                    totalGrossSalePerHalaman += float(val.gross_sales);
                    totalDiskonItemPerHalaman += float(val.diskon_item);
                    totalDiskonTransaksiPerHalaman += float(val.diskon_trx);
                    totalServicePerHalaman += float(val.service);
                    totalQtyPerHalaman += float(val.qty);
                    return (
                      <tr key={key}>
                        <td className="middle nowrap text-center">{generateNo(key, current_page)}</td>
                        <td className="middle nowrap">{val.kd_cust}</td>
                        <td className="middle nowrap">{val.nama}</td>
                        <td className="middle nowrap text-right">{parseToRp(val.gross_sales)}</td>
                        <td className="middle nowrap text-right">{parseToRp(val.diskon_item)}</td>
                        <td className="middle nowrap text-right">{parseToRp(val.diskon_trx)}</td>
                        <td className="middle nowrap text-right">{parseToRp(val.service)}</td>
                        <td className="middle nowrap text-right">{parseToRp(val.qty)}</td>
                      </tr>
                    );
                  })
                : noData(head.length + rowSpan.length)
              : noData(head.length + rowSpan.length)
          }
          footer={[
            {
              data: [
                { colSpan: 3, label: "Total perhalaman", className: "text-left" },
                { colSpan: 1, label: parseToRp(totalGrossSalePerHalaman) },
                { colSpan: 1, label: parseToRp(totalDiskonItemPerHalaman) },
                { colSpan: 1, label: parseToRp(totalDiskonTransaksiPerHalaman) },
                { colSpan: 1, label: parseToRp(totalServicePerHalaman) },
                { colSpan: 1, label: parseToRp(totalQtyPerHalaman) },
              ],
            },
          ]}
        />
        {this.props.isOpen && isModalExport ? <SaleByCustReportExcel startDate={startDate} endDate={endDate} /> : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    sale_by_custReport: state.sale_by_custReducer.report,
    download: state.sale_by_custReducer.download,
    sale_by_custReportExcel: state.sale_by_custReducer.report_excel,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(SaleByCustArchive);
