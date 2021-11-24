import React, { Component } from "react";
import Layout from "components/App/Layout";
import { FetchSaleReturReport, FetchSaleReturReportExcel } from "redux/actions/sale/sale.action";
import connect from "react-redux/es/connect/connect";
import SaleReturReportExcel from "components/App/modals/report/sale/form_sale_retur_excel";
import { float, generateNo, getFetchWhere, getPeriode, noData, parseToRp, toDate } from "../../../../helper";
import TableCommon from "../../common/TableCommon";
import HeaderReportCommon from "../../common/HeaderReportCommon";

class SaleReturReport extends Component {
  constructor(props) {
    super(props);
    this.handleService = this.handleService.bind(this);
    this.state = {
      where_data: "",
      periode: "",
      isModalReport: false,
      column_data: [
        { value: "kd_trx", label: "Kode Trx" },
        { value: "tgl", label: "Tanggal" },
        { value: "nama", label: "Nama" },
        { value: "nilai_retur", label: "Nilai Retur" },
        { value: "diskon_item", label: "Diskon Item" },
      ],
    };
  }

  componentWillUnmount() {
    this.setState({ isModalReport: false });
  }
  handlePageChange(pageNumber) {
    this.handleService(this.state.where_data, pageNumber);
  }
  toggleModal(total) {
    let whereState = this.state.where_data;
    let where = getFetchWhere(whereState);
    let periode = getPeriode(where.split("&"));
    this.setState({ isModalReport: true, periode: periode, where_data: where });
    this.props.dispatch(FetchSaleReturReportExcel(where, total));
  }

  handleService(res, page = 1) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      this.setState({ where_data: where });
      this.props.dispatch(FetchSaleReturReport(where));
    }
  }

  handleSearch(e) {
    e.preventDefault();
    this.handleService();
  }

  render() {
    const { per_page, last_page, current_page, total, data } = this.props.sale_returReport;
    const { periode, column_data, isModalReport } = this.state;
    const startDate = periode.split("-")[0];
    const endDate = periode.split("-")[1];
    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "Kode transaksi", width: "5%" },
      { label: "Nama" },
      { label: "Nilai retur", width: "1%" },
      { label: "Diskon item", width: "1%" },
      { label: "Lokasi", width: "1%" },
      { label: "Tanggal", width: "1%" },
    ];
    let totalNilaiReturPerHalaman = 0;
    let totalDiskonPerHalaman = 0;
    return (
      <Layout page="Laporan retur penjualan">
        <HeaderReportCommon
          pathName="ReportReturSale"
          isLocation={true}
          isColumn={true}
          columnData={column_data}
          callbackWhere={(res) => this.handleService(res)}
          callbackExcel={() => this.toggleModal(last_page * per_page, per_page)}
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
                ? data.map((val, key) => {
                    totalNilaiReturPerHalaman += float(val.nilai_retur);
                    totalDiskonPerHalaman += float(val.diskon_item);
                    return (
                      <tr key={key}>
                        <td className="middle nowrap">{generateNo(key, current_page)}</td>
                        <td className="middle nowrap">{val.kd_trx}</td>
                        <td className="middle nowrap">{val.nama}</td>
                        <td className="middle nowrap text-right">{parseToRp(val.nilai_retur)}</td>
                        <td className="middle nowrap text-right">{parseToRp(val.diskon_item)}</td>
                        <td className="middle nowrap">{val.lokasi_nama}</td>
                        <td className="middle nowrap">{toDate(val.tgl)}</td>
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
                { colSpan: 1, label: parseToRp(totalNilaiReturPerHalaman) },
                { colSpan: 1, label: parseToRp(totalDiskonPerHalaman) },
                { colSpan: 2, label: "" },
              ],
            },
          ]}
        />
        {this.props.isOpen && isModalReport ? <SaleReturReportExcel startDate={startDate} endDate={endDate} /> : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    sale_returReport: state.saleReducer.sale_retur_data,
    isLoadingDetail: state.saleReducer.isLoadingDetail,
    auth: state.auth,
    sale_returReportExcel: state.saleReducer.sale_retur_export,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    download: state.saleReducer.percent,
  };
};
export default connect(mapStateToProps)(SaleReturReport);
