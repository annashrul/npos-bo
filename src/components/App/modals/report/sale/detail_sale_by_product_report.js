import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalHeader } from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
import { FetchReportDetailSaleByProduct } from "redux/actions/sale/sale_by_product.action";
import connect from "react-redux/es/connect/connect";
import {
  generateNo,
  getFetchWhere,
  isProgress,
  noData,
  parseToRp,
  toDate,
  toExcel,
} from "../../../../../helper";
import HeaderDetailCommon from "../../../common/HeaderDetailCommon";
import TableCommon from "../../../common/TableCommon";
import { EXTENSION } from "../../../../../redux/actions/_constants";

class DetailSaleByProductReport extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleExcel = this.handleExcel.bind(this);
  }

  toggle(e) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
  }

  handleService(pageNumber = 1, type = "page") {
    let master = this.props.detail;
    let where = getFetchWhere(master.where, pageNumber);
    if (type !== "page") {
      where += `&perpage=${type}`;
    }
    this.props.dispatch(
      FetchReportDetailSaleByProduct(
        btoa(master.barcode),
        where,
        type !== "page"
      )
    );
  }
  handlePageChange(pageNumber) {
    this.handleService(pageNumber);
  }

  handleExcel(e, total) {
    e.preventDefault();
    this.handleService(1, total);
  }
  printExcel() {
    let master = this.props.detail;
    let header = [
      "KODE TRANSAKSI",
      "SKU",
      "DISKON",
      "QTY",
      "NET SALE",
      "GROSS SALE",
    ];
    let content = this.handleContent();
    let footer = [
      [""],
      [""],
      [
        "TOTAL",
        "",
        content.footer.diskon,
        content.footer.qty,
        content.footer.netSale,
        content.footer.grossSale,
      ],
    ];
    toExcel(
      `LAPORAN PENJUALAN ${master.nm_brg}`,
      `${toDate(master.tgl)}`,
      header,
      content.props,
      footer,
      EXTENSION.XLXS
    );
  }
  handleContent() {
    let content = {};
    let props = [];
    let totalDiskonPerHalaman = 0;
    let totalQtyPerHalaman = 0;
    let totalGrossSalePerHalaman = 0;
    let totalNetSalePerHalaman = 0;
    let data = this.props.excel.data;
    if (data !== undefined) {
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let v = data[i];
          totalDiskonPerHalaman += parseFloat(v.diskon);
          totalQtyPerHalaman += parseFloat(v.qty);
          totalGrossSalePerHalaman += parseFloat(v.net_sales);
          totalNetSalePerHalaman += parseFloat(v.gross_sales);
          props.push([
            v.kd_trx,
            v.sku,
            parseFloat(v.diskon),
            parseFloat(v.qty),
            parseFloat(v.net_sales),
            parseFloat(v.gross_sales),
          ]);
        }
        Object.assign(content, {
          props: props,
          footer: {
            diskon: totalDiskonPerHalaman,
            qty: totalQtyPerHalaman,
            grossSale: totalGrossSalePerHalaman,
            netSale: totalNetSalePerHalaman,
          },
        });
      }
    }
    return content;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.excel !== prevProps.excel) {
      this.printExcel();
      return;
    }
  }
  render() {
    const { data, total, last_page, per_page, current_page } =
      this.props.detailSaleByProduct;
    let master = this.props.detail;
    let totalDiskonPerHalaman = 0;
    let totalQtyPerHalaman = 0;
    let totalGrossSalePerHalaman = 0;
    let totalNetSalePerHalaman = 0;
    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "Kode transaksi" },
      { label: "Sku" },
      { label: "Diskon", width: "1%" },
      { label: "Qty", width: "1%" },
      { label: "Net sale" },
      { label: "Gross sale" },
    ];

    return (
      <WrapperModal
        isOpen={
          this.props.isOpen && this.props.type === "detailSaleByProductReport"
        }
        size={"lg"}
      >
        <ModalHeader toggle={this.toggle}>
          Laporan detail penjualan by barang{" "}
          <button
            onClick={(e) => this.handleExcel(e, last_page * per_page)}
            className="btn btn-default btn-sm"
          >
            {isProgress(this.props.download)}
          </button>
        </ModalHeader>
        <ModalBody>
          <HeaderDetailCommon
            md="col-md-6"
            data={[
              { title: "Nama", desc: master.nm_brg },
              { title: "Gross Sale", desc: parseToRp(master.gross_sales) },
              { title: "Kode", desc: master.barcode },
              { title: "Lokasi", desc: master.toko },
              { title: "Barcode", desc: master.barcode },
              { title: "Deskripsi", desc: master.deskripsi },
              {
                title: "Qty",
                desc: parseToRp(master.qty_jual) + " " + master.satuan,
              },
              { title: "Tanggal", desc: toDate(master.tgl) },
            ]}
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
                  ? data.map((v, i) => {
                      totalDiskonPerHalaman += parseFloat(v.diskon);
                      totalQtyPerHalaman += parseFloat(v.qty);
                      totalGrossSalePerHalaman += parseFloat(v.net_sales);
                      totalNetSalePerHalaman += parseFloat(v.gross_sales);
                      return (
                        <tr key={i}>
                          <td className="middle nowrap text-center">
                            {generateNo(i, current_page)}
                          </td>
                          <td className="middle nowrap">{v.kd_trx}</td>
                          <td className="middle nowrap">{v.sku}</td>
                          <td className="middle nowrap text-right">
                            {parseToRp(v.diskon)}
                          </td>
                          <td className="middle nowrap text-right">
                            {parseToRp(v.qty)}
                          </td>
                          <td className="middle nowrap text-right">
                            {parseToRp(v.net_sales)}
                          </td>
                          <td className="middle nowrap text-right">
                            {parseToRp(v.gross_sales)}
                          </td>
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
                    colSpan: 3,
                    label: "Total perhalaman",
                    className: "text-left",
                  },
                  { colSpan: 1, label: parseToRp(totalDiskonPerHalaman) },
                  { colSpan: 1, label: parseToRp(totalQtyPerHalaman) },
                  { colSpan: 1, label: parseToRp(totalNetSalePerHalaman) },
                  { colSpan: 1, label: parseToRp(totalGrossSalePerHalaman) },
                ],
              },
            ]}
          />
        </ModalBody>
      </WrapperModal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    download: state.sale_by_productReducer.download_detail,
    excel: state.sale_by_productReducer.report_detail_excel,
  };
};
export default connect(mapStateToProps)(DetailSaleByProductReport);
