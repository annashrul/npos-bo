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
    console.log(startDate);
    console.log(endDate);
    let totalGTPerHalaman = 0;
    let totalDiskonTransaksiPerHalaman = 0;
    let totalDiskonItemPerhalaman = 0;
    let totalTunaiPerHalaman = 0;
    let totalNonTunaiPerHalaman = 0;
    let totalNetSalesPerHalaman = 0;
    let totalSetoranPerHalaman = 0;
    let totalSelisihPerHalaman = 0;

    const head = [
      { rowSpan: 2, label: "No", width: "1%", className: "text-center" },
      { rowSpan: 2, label: "Tanggal", width: "1%" },
      { rowSpan: 2, label: "Omset Kotor" },
      { colSpan: 2, label: "Diskon" },
      { rowSpan: 2, label: "Tunai" },
      { rowSpan: 2, label: "Non Tunai" },
      { rowSpan: 2, label: "Net Sales" },
      { rowSpan: 2, label: "Setoran" },
      { rowSpan: 2, label: "Selisih" },
    ];
    const rowSpan = [{ label: "Transaksi" }, { label: "Item" }];

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
          head={head}
          rowSpan={rowSpan}
          meta={{ total: total, current_page: current_page, per_page: per_page }}
          current_page={current_page}
          callbackPage={this.handlePageChange.bind(this)}
          renderRow={
            typeof data === "object"
              ? data.length > 0
                ? data.map((v, i) => {
                    totalGTPerHalaman += parseFloat(rmToZero(v.gross_sales));
                    totalDiskonTransaksiPerHalaman += parseFloat(rmToZero(v.diskon_trx));
                    totalDiskonItemPerhalaman += parseFloat(rmToZero(v.diskon_item));
                    totalTunaiPerHalaman += parseFloat(rmToZero(v.tunai));
                    totalNonTunaiPerHalaman += parseFloat(rmToZero(v.non_tunai));
                    totalNetSalesPerHalaman += parseFloat(rmToZero(v.net_sales));
                    totalSetoranPerHalaman += parseFloat(rmToZero(v.setoran));
                    totalSelisihPerHalaman += parseFloat(rmToZero(v.net_sales - v.setoran));
                    return (
                      <tr key={i}>
                        <td className="text-center middle nowrap">{generateNo(i, current_page)}</td>
                        <td className="middle nowrap">{toDate(v.tanggal)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.gross_sales)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.diskon_trx)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.diskon_item)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.tunai)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.non_tunai)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.net_sales)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.setoran)}</td>
                        <td className="middle nowrap text-right">{parseToRp(parseFloat(v.net_sales) - parseFloat(v.setoran))}</td>
                      </tr>
                    );
                  })
                : noData(head.length + rowSpan.length)
              : noData(head.length + rowSpan.length)
          }
          footer={[
            {
              data: [
                { colSpan: 2, label: "Total perhalaman", className: "text-left" },
                { colSpan: 1, label: parseToRp(totalGTPerHalaman) },
                { colSpan: 1, label: parseToRp(totalDiskonTransaksiPerHalaman) },
                { colSpan: 1, label: parseToRp(totalDiskonItemPerhalaman) },
                { colSpan: 1, label: parseToRp(totalTunaiPerHalaman) },
                { colSpan: 1, label: parseToRp(totalNonTunaiPerHalaman) },
                { colSpan: 1, label: parseToRp(totalNetSalesPerHalaman) },
                { colSpan: 1, label: parseToRp(totalSetoranPerHalaman) },
                { colSpan: 1, label: parseToRp(totalSelisihPerHalaman) },
              ],
            },
            {
              data: [
                { colSpan: 2, label: "Total keseluruhan", className: "text-left" },
                { colSpan: 1, label: parseToRp(total_data && total_data.gross_sales) },
                { colSpan: 1, label: parseToRp(total_data && total_data.diskon_trx) },
                { colSpan: 1, label: parseToRp(total_data && total_data.diskon_item) },
                { colSpan: 1, label: parseToRp(total_data && total_data.tunai) },
                { colSpan: 1, label: parseToRp(total_data && total_data.non_tunai) },
                { colSpan: 1, label: parseToRp(total_data && total_data.net_sales) },
                { colSpan: 1, label: parseToRp(total_data && total_data.setoran) },
                { colSpan: 1, label: parseToRp(total_data && total_data.net_sales - total_data.setoran) },
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
