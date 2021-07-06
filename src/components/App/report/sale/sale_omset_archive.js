import React, { Component } from "react";
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import { FetchReportSaleOmset, FetchReportSaleOmsetExcel } from "redux/actions/sale/sale_omset.action";
import SaleOmsetReportExcel from "../../modals/report/sale/form_sale_omset_excel";
import { generateNo, getFetchWhere, getPeriode, noData, parseToRp, rmToZero, toDate } from "../../../../helper";
import TableCommon from "../../common/TableCommon";
import HeaderReportCommon from "../../common/HeaderReportCommon";

class SaleOmsetArchive extends Component {
  constructor(props) {
    super(props);
    this.handleService = this.handleService.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.state = {
      where_data: "",
      periode: "",

      sort_data: [
        {
          value: "qty|DESC",
          label: "Qty Terbesar",
        },
        {
          value: "qty|ASC",
          label: "Qty Terkecil",
        },
        {
          value: "gross_sales|DESC",
          label: "Gross Sales Terbesar",
        },
        {
          value: "gross_sales|ASC",
          label: "Gross Sales Terkecil",
        },
        {
          value: "diskon_item|DESC",
          label: "Diskon Item Terbesar",
        },
        {
          value: "diskon_item|ASC",
          label: "Diskon Item Terkecil",
        },
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

  handleModal(total) {
    let whereState = this.state.where_data;
    let where = getFetchWhere(whereState);
    let periode = getPeriode(where.split("&"));
    this.setState({ isModalExport: true, periode: periode, where_data: where });
    this.props.dispatch(FetchReportSaleOmsetExcel(where, total));
  }

  handleService(res, page = 1) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      this.setState({ where_data: where });
      this.props.dispatch(FetchReportSaleOmset(where));
    }
  }

  render() {
    const { total, last_page, per_page, current_page, data, total_data } = this.props.data;
    const { periode, sort_data, isModalExport } = this.state;
    const startDate = periode.split("-")[0];
    const endDate = periode.split("-")[1];
    let tot_qty = 0;
    let tot_gross_sales = 0;
    let tot_net_sales = 0;
    let tot_grand_total = 0;
    let tot_diskon_item = 0;
    let tot_diskon_trx = 0;
    let tot_tax = 0;
    let tot_service = 0;

    return (
      <Layout page="Laporan omset penjualan">
        <HeaderReportCommon
          pathName="ReportSaleOmset"
          isLocation={true}
          isSort={true}
          sortData={sort_data}
          sortNotColumn={true}
          callbackWhere={(res) => this.handleService(res)}
          callbackExcel={() => this.handleModal(last_page * per_page, per_page)}
          excelData={this.props.download}
        />

        <TableCommon
          head={[
            { rowSpan: 2, label: "No", width: "1%", className: "text-center" },
            { rowSpan: 2, label: "Tanggal", width: "1%" },
            { rowSpan: 2, label: "Qty" },
            { rowSpan: 2, label: "Gross sale" },
            { rowSpan: 2, label: "Net sale" },
            { colSpan: 2, label: "Diskon" },
            { rowSpan: 2, label: "Pajak" },
            { rowSpan: 2, label: "Servis" },
            { rowSpan: 2, label: "Grand total" },
          ]}
          rowSpan={[{ label: "Item" }, { label: "Transaksi" }]}
          meta={{ total: total, current_page: current_page, per_page: per_page }}
          current_page={current_page}
          callbackPage={this.handlePageChange.bind(this)}
          renderRow={
            typeof data === "object"
              ? data.length > 0
                ? data.map((v, i) => {
                    tot_qty += parseFloat(rmToZero(v.qty));
                    tot_gross_sales += parseFloat(rmToZero(v.gross_sales));
                    tot_net_sales += parseFloat(rmToZero(v.net_sales));
                    tot_diskon_item += parseFloat(rmToZero(v.diskon_item));
                    tot_diskon_trx += parseFloat(rmToZero(v.diskon_trx));
                    tot_tax += parseFloat(rmToZero(v.tax));
                    tot_service += parseFloat(rmToZero(v.service));
                    tot_grand_total += parseFloat(rmToZero(v.grand_total));
                    return (
                      <tr key={i}>
                        <td className="text-center middle nowrap">{generateNo(i, current_page)}</td>
                        <td className="middle nowrap">{toDate(v.tanggal)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.qty)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.gross_sales)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.net_sales)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.diskon_item)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.diskon_trx)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.tax)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.service)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.grand_total)}</td>
                      </tr>
                    );
                  })
                : noData(10)
              : noData(10)
          }
          footer={[
            {
              data: [
                { colSpan: 2, label: "Total perhalaman", className: "text-left" },
                { colSpan: 1, label: parseToRp(tot_qty) },
                { colSpan: 1, label: parseToRp(tot_gross_sales) },
                { colSpan: 1, label: parseToRp(tot_net_sales) },
                { colSpan: 1, label: parseToRp(tot_diskon_item) },
                { colSpan: 1, label: parseToRp(tot_diskon_trx) },
                { colSpan: 1, label: parseToRp(tot_tax) },
                { colSpan: 1, label: parseToRp(tot_service) },
                { colSpan: 1, label: parseToRp(tot_grand_total) },
              ],
            },
            {
              data: [
                { colSpan: 2, label: "Total keseluruhan", className: "text-left" },
                { colSpan: 1, label: parseToRp(total_data && total_data.qty) },
                { colSpan: 1, label: parseToRp(total_data && total_data.gross_sales) },
                { colSpan: 1, label: parseToRp(total_data && total_data.net_sales) },
                { colSpan: 1, label: parseToRp(total_data && total_data.diskon_item) },
                { colSpan: 1, label: parseToRp(total_data && total_data.diskon_trx) },
                { colSpan: 1, label: parseToRp(total_data && total_data.tax) },
                { colSpan: 1, label: parseToRp(total_data && total_data.service) },
                { colSpan: 1, label: parseToRp(total_data && total_data.grand_total) },
              ],
            },
          ]}
        />
        {this.props.isOpen && isModalExport ? <SaleOmsetReportExcel startDate={startDate} endDate={endDate} /> : ""}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.saleOmsetReducer.data,
    download: state.saleOmsetReducer.download,
    sale_omsetReportExcel: state.saleOmsetReducer.report_excel,
    totalPenjualanExcel: state.saleOmsetReducer.total_penjualan_excel,
    detailSaleByCust: state.saleOmsetReducer.dataDetail,
    auth: state.auth,
    isOpen: state.modalReducer,
  };
};

export default connect(mapStateToProps)(SaleOmsetArchive);
