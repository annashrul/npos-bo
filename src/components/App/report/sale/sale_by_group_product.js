import React, { Component } from "react";
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import {
  FetchSaleByGroupProduct,
  FetchSaleByGroupProductExport,
  FetchReportDetailSaleByProduct,
} from "../../../../redux/actions/sale/sale_by_group_product.action";
import DetailSaleByGroupProduct from "../../modals/report/sale/detail_sale_by_group_product";
import ModalSaleByGroupProduct from "../../modals/report/sale/export_sale_by_group_product";
import {
  generateNo,
  getFetchWhere,
  getPeriode,
  noData,
  parseToRp,
  rmSpaceToStrip,
} from "../../../../helper";
import TableCommon from "../../common/TableCommon";
import HeaderReportCommon from "../../common/HeaderReportCommon";
import ButtonActionCommon from "../../common/ButtonActionCommon";

class SaleByGroupProduct extends Component {
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
        { value: "kel_brg", label: "Kode" },
        { value: "kelompok", label: "Nama" },
      ],
      isFirstHit: false,
    };
  }
  componentWillUnmount() {
    this.setState({ isModalDetail: false, isModalExport: false });
  }

  handleService(res, page = 1) {
    this.setState({ isFirstHit: true });
    if (res !== undefined && this.state.isFirstHit) {
      let where = getFetchWhere(res, page);
      this.setState({ where_data: where });
      this.props.dispatch(FetchSaleByGroupProduct(where));
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
      this.props.dispatch(FetchSaleByGroupProductExport(where, total));
    } else {
      let props = this.props.data.data[index];
      Object.assign(props, { where: where });
      Object.assign(state, { isModalDetail: true, detail: props });
      this.props.dispatch(FetchReportDetailSaleByProduct(props.kel_brg, where));
    }

    this.setState(state);
  }

  render() {
    const { total, last_page, per_page, current_page, data } = this.props.data;
    const {
      sort_data,
      periode,
      isModalExport,
      isModalDetail,
      detail,
      isFirstHit,
    } = this.state;
    const startDate = periode.split("-")[0];
    const endDate = periode.split("-")[1];
    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "#", className: "text-center", width: "1%" },
      { label: "Kode", width: "1%" },
      { label: "Nama" },
      { label: "Qty terjual", width: "1%" },
      { label: "Diskon item", width: "1%" },
      { label: "Gross sales", width: "1%" },
      { label: "Tax", width: "1%" },
      { label: "Service", width: "1%" },
      { label: "Net sales", width: "1%" },
    ];

    let totalQtyPerHalaman = 0;
    let totalDiskonPerHalaman = 0;
    let totalNetSalesPerHalaman = 0;
    let totalTaxPerHalaman = 0;
    let totalServicePerHalaman = 0;
    let totalGrossSalesPerHalaman = 0;
    return (
      <Layout page="Laporan penjualan by kelompok barang">
        <HeaderReportCommon
          pathName="ReportSaleByGroupProduct"
          isLocation={true}
          isColumn={true}
          isSort={true}
          columnData={sort_data}
          callbackWhere={(res) => this.handleService(res)}
          callbackExcel={() =>
            this.handleModal("excel", 0, last_page * per_page)
          }
          excelData={this.props.download}
        />
        <TableCommon
          head={head}
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
                    totalQtyPerHalaman += parseInt(val.qty);
                    totalDiskonPerHalaman += parseInt(val.diskon_item);
                    totalNetSalesPerHalaman += parseInt(val.net_sales);
                    totalTaxPerHalaman += parseInt(val.tax);
                    totalServicePerHalaman += parseInt(val.service);
                    totalGrossSalesPerHalaman += parseInt(val.gross);
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
                          {rmSpaceToStrip(val.kel_brg)}
                        </td>
                        <td className="middle nowrap">
                          {rmSpaceToStrip(val.kelompok)}
                        </td>
                        <td className="middle nowrap text-right">
                          {parseToRp(val.qty)}
                        </td>
                        <td className="middle nowrap text-right">
                          {parseToRp(val.diskon_item)}
                        </td>
                        <td className="middle nowrap text-right">
                          {parseToRp(val.gross)}
                        </td>
                        <td className="middle nowrap text-right">
                          {parseToRp(val.tax)}
                        </td>
                        <td className="middle nowrap text-right">
                          {parseToRp(val.service)}
                        </td>
                        <td className="middle nowrap text-right">
                          {parseToRp(val.net_sales)}
                        </td>
                      </tr>
                    );
                  })
                : noData(
                    head.length,
                    isFirstHit ? "Pilih lokasi untuk menampilkan data" : ""
                  )
              : noData(
                  head.length,
                  isFirstHit ? "Pilih lokasi untuk menampilkan data" : ""
                )
          }
          footer={[
            {
              data: [
                {
                  colSpan: 4,
                  label: "Total perhalaman",
                  className: "text-left",
                },
                { colSpan: 1, label: parseToRp(totalQtyPerHalaman) },
                { colSpan: 1, label: parseToRp(totalDiskonPerHalaman) },
                { colSpan: 1, label: parseToRp(totalGrossSalesPerHalaman) },
                { colSpan: 1, label: parseToRp(totalTaxPerHalaman) },
                { colSpan: 1, label: parseToRp(totalServicePerHalaman) },
                { colSpan: 1, label: parseToRp(totalNetSalesPerHalaman) },
              ],
            },
          ]}
        />
        {this.props.isOpen && isModalExport ? (
          <ModalSaleByGroupProduct startDate={startDate} endDate={endDate} />
        ) : null}
        {this.props.isOpen && isModalDetail ? (
          <DetailSaleByGroupProduct
            data={this.props.dataDetail}
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
    data: state.saleByGroupProductReducer.data,
    dataExport: state.saleByGroupProductReducer.dataExport,
    download: state.saleByGroupProductReducer.download,
    dataDetail: state.saleByGroupProductReducer.detail,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(SaleByGroupProduct);
