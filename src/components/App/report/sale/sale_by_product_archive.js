import React, { Component } from "react";
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import {
  FetchReportSaleByProduct,
  FetchReportDetailSaleByProduct,
  FetchReportSaleByProductExcel,
} from "redux/actions/sale/sale_by_product.action";
import DetailSaleByProductReport from "../../modals/report/sale/detail_sale_by_product_report";
import SaleByProductReportExcel from "../../modals/report/sale/form_sale_by_product_excel";
import { ModalType } from "redux/actions/modal.action";
import {
  generateNo,
  getFetchWhere,
  getPeriode,
  noData,
  parseToRp,
  rmSpaceToStrip,
  rmToZero,
} from "../../../../helper";
import TableCommon from "../../common/TableCommon";
import HeaderReportCommon from "../../common/HeaderReportCommon";
import ButtonActionCommon from "../../common/ButtonActionCommon";

class SaleByProductArchive extends Component {
  constructor(props) {
    super(props);
    this.handleModal = this.handleModal.bind(this);
    this.handleService = this.handleService.bind(this);
    this.state = {
      where_data: "",
      periode: "",
      isModalDetail: false,
      isModalExport: false,
      detail: {},
      sort_data: [
        { value: "gross_sales|desc", label: "Penjualan Terbesar" },
        { value: "gross_sales|asc", label: "Penjualan Terkecil" },
        { value: "qty_jual|desc", label: "Qty Terbesar" },
        { value: "qty_jual|asc", label: "Qty Terkecil" },
      ],
    };
  }
  componentWillUnmount() {
    this.setState({ isModalDetail: false, isModalExport: false });
  }

  handleService(res, page = 1) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      this.setState({ where_data: where });
      this.props.dispatch(FetchReportSaleByProduct(where));
    }
  }
  handlePageChange(pageNumber) {
    this.handleService(this.state.where_data, pageNumber);
  }
  handleModal(param = "detail", index, total = 0) {
    let whereState = this.state.where_data;
    let where = getFetchWhere(whereState);
    let periode = getPeriode(where.split("&"));
    let state = { periode: periode, where_data: where };
    if (param === "excel") {
      Object.assign(state, { isModalExport: true });
      this.props.dispatch(FetchReportSaleByProductExcel(where, total));
    } else {
      let props = this.props.sale_by_productReport.data[index];
      Object.assign(props, { where: where });
      Object.assign(state, { isModalDetail: true, detail: props });
      this.props.dispatch(ModalType("detailSaleByProductReport"));
      this.props.dispatch(
        FetchReportDetailSaleByProduct(btoa(props.barcode), where)
      );
    }
    this.setState(state);
  }

  render() {
    const { total, last_page, per_page, current_page, data } =
      this.props.sale_by_productReport;
    const { sort_data, periode, isModalExport, isModalDetail, detail } =
      this.state;
    const startDate = periode.split("-")[0];
    const endDate = periode.split("-")[1];
    const head = [
      { rowSpan: 2, label: "No", className: "text-center", width: "1%" },
      { rowSpan: 2, label: "#", className: "text-center", width: "1%" },
      { colSpan: 4, label: "Barang" },
      { rowSpan: 2, label: "Qty" },
      { rowSpan: 2, label: "Gross sales" },
      { rowSpan: 2, label: "Diskon item" },
      { rowSpan: 2, label: "Pajak" },
      { rowSpan: 2, label: "Servis" },
      { rowSpan: 2, label: "Toko  " },
    ];
    const rowSpan = [
      { label: "Kode" },
      { label: "Nama" },
      { label: "Variasi" },
      { label: "Satuan" },
    ];

    let totalQtyPerHalaman = 0;
    let totalGrossSalePerHalaman = 0;
    let totalDiskonPerHalaman = 0;
    let totalPajakPerHalaman = 0;
    let totalServicePerHalaman = 0;

    return (
      <Layout page="Laporan penjualan by barang">
        <HeaderReportCommon
          pathName="ReportSaleByProduct"
          isLocation={true}
          isSort={true}
          sortData={sort_data}
          sortNotColumn={true}
          callbackWhere={(res) => this.handleService(res)}
          callbackExcel={() =>
            this.handleModal("excel", 0, last_page * per_page)
          }
          excelData={this.props.download}
        />
        <TableCommon
          head={head}
          rowSpan={rowSpan}
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
                ? data.map((val, key) => {
                    totalQtyPerHalaman += parseFloat(rmToZero(val.qty_jual));
                    totalGrossSalePerHalaman += parseFloat(
                      rmToZero(val.gross_sales)
                    );
                    totalDiskonPerHalaman += parseFloat(
                      rmToZero(val.diskon_item)
                    );
                    totalPajakPerHalaman += parseFloat(rmToZero(val.tax));
                    totalServicePerHalaman += parseFloat(rmToZero(val.service));

                    return (
                      <tr key={key}>
                        <td className="middle nowrap text-center">
                          {generateNo(key, current_page)}
                        </td>
                        <td className="middle nowrap text-center">
                          <ButtonActionCommon
                            action={[{ label: "Detail" }]}
                            callback={(e) => this.handleModal("detail", key)}
                          />
                        </td>
                        <td className="middle nowrap">
                          {rmSpaceToStrip(val.kd_brg)}
                        </td>
                        <td className="middle nowrap">
                          {rmSpaceToStrip(val.nm_brg)}
                        </td>
                        <td className="middle nowrap">
                          {rmSpaceToStrip(val.ukuran)}
                        </td>
                        <td className="middle nowrap">
                          {rmSpaceToStrip(val.deskripsi)}
                        </td>
                        <td className="middle nowrap">
                          {rmSpaceToStrip(val.satuan)}
                        </td>
                        <td className="middle nowrap text-right">
                          {parseToRp(val.qty_jual)}
                        </td>
                        <td className="middle nowrap text-right">
                          {parseToRp(val.gross_sales)}
                        </td>
                        <td className="middle nowrap text-right">
                          {parseToRp(val.diskon_item)}
                        </td>
                        <td className="middle nowrap text-right">
                          {parseToRp(val.tax)}
                        </td>
                        <td className="middle nowrap text-right">
                          {parseToRp(val.service)}
                        </td>
                        <td className="middle nowrap">
                          {rmSpaceToStrip(val.toko)}
                        </td>
                      </tr>
                    );
                  })
                : noData(head.length + rowSpan.length)
              : noData(head.length + rowSpan.length)
          }
          footer={[
            {
              data: [
                {
                  colSpan: 7,
                  label: "Total perhalaman",
                  className: "text-left",
                },
                { colSpan: 1, label: parseToRp(totalQtyPerHalaman) },
                { colSpan: 1, label: parseToRp(totalGrossSalePerHalaman) },
                { colSpan: 1, label: parseToRp(totalDiskonPerHalaman) },
                { colSpan: 1, label: parseToRp(totalPajakPerHalaman) },
                { colSpan: 1, label: parseToRp(totalServicePerHalaman) },
              ],
            },
          ]}
        />
        {this.props.isOpen && isModalExport ? (
          <SaleByProductReportExcel startDate={startDate} endDate={endDate} />
        ) : null}
        {this.props.isOpen && isModalDetail ? (
          <DetailSaleByProductReport
            detailSaleByProduct={this.props.detailSaleByProduct}
            detail={detail}
          />
        ) : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    sale_by_productReport: state.sale_by_productReducer.report,
    sale_by_productReportExcel: state.sale_by_productReducer.report_excel,
    download: state.sale_by_productReducer.download,
    detailSaleByProduct: state.sale_by_productReducer.dataDetail,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(SaleByProductArchive);
