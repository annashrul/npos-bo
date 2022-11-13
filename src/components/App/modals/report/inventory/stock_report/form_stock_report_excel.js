import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import ExportCommon from "../../../../common/ExportCommon";
import { EXTENSION } from "../../../../../../redux/actions/_constants";
import { toExcel } from "../../../../../../helper";

class StockReportExcel extends Component {
  constructor(props) {
    super(props);
    this.printExcel = this.printExcel.bind(this);
  }

  handleHeader() {
    let head = ["Kode barang", "Nama barang","Variasi", "Satuan", "Kelompok barang", "Supplier", "Sub departemen"];
    if (this.props.lokasi !== "") {
      head.push("Harga beli");
      head.push("Harga jual");
    }

    head.push("Stok awal");
    head.push("Stok masuk");
    head.push("Stok keluar");
    head.push("Stok pernjualan");
    head.push("Stok akhir");
    if (this.props.lokasi !== "") {
      head.push("Total harga beli");
      head.push("Total harga jual");
    }

    return head;
  }

  handleContent() {
    let props = [];
    if (this.props.stockReportExcel.data !== undefined) {
      if (this.props.stockReportExcel.data.length > 0) {
        this.props.stockReportExcel.data.map((v, i) => {
          let stockAkhir = parseFloat(v.stock_awal) + parseFloat(v.stock_masuk) - (parseFloat(v.stock_keluar) + parseFloat(v.stock_penjualan));
          props.push([v.kd_brg,v.nm_brg, v.variasi, v.satuan, v.nama_kel, v.supplier, v.sub_dept]);
          if (this.props.lokasi !== "") {
            props[i].push(parseFloat(v.harga_beli_lokasi));
            props[i].push(parseFloat(v.harga_lokasi));
          }
          props[i].push(parseFloat(v.stock_awal));
          props[i].push(parseFloat(v.stock_masuk));
          props[i].push(parseFloat(v.stock_keluar));
          props[i].push(parseFloat(v.stock_penjualan));
          props[i].push(parseFloat(stockAkhir));
          if (this.props.lokasi !== "") {
            props[i].push(parseFloat(v.harga_beli_lokasi) * stockAkhir);
            props[i].push(parseFloat(v.harga_lokasi) * stockAkhir);
          }
        });
      }
    }
    return props;
  }
  isNull(val) {
    if (val) {
      return parseFloat(val);
    } else {
      return parseFloat(0);
    }
  }
  handleFooter() {
    let props = this.props.total_stock;
    let data = ["TOTAL", "", "", "", "", "", ""];
    if (this.props.lokasi !== "") {
      data.push(parseFloat(this.isNull(props.total_harga_beli)));
      data.push(parseFloat(this.isNull(props.total_harga_jual)));
    }
    data.push(parseFloat(this.isNull(props.total_stock_awal)));
    data.push(parseFloat(this.isNull(props.total_stock_masuk)));
    data.push(parseFloat(this.isNull(props.total_stock_keluar)));
    data.push(parseFloat(this.isNull(props.total_penjualan)));
    data.push(parseFloat(this.isNull(props.total_stock_akhir)));
    if (this.props.lokasi !== "") {
      data.push(parseFloat(this.isNull(props.total_harga_beli_qty)));
      data.push(parseFloat(this.isNull(props.total_harga_jual_qty)));
    }

    let dataFinish = [[""], [""], data];
    return dataFinish;
  }
  printExcel(param) {
    let header = this.handleHeader();
    let content = this.handleContent();
    let footer = this.handleFooter();
    toExcel(`LAPORAN STOK ${this.props.lokasi.replaceAll("/", "")}`, `${this.props.startDate} - ${this.props.endDate}`, header, content, footer, param);
    this.props.dispatch(ModalToggle(false));
  }

  render() {
    return <ExportCommon modalType="formStockExcel" isCsv={true} isExcel={true} callbackCsv={() => this.printExcel(EXTENSION.CSV)} callbackExcel={() => this.printExcel(EXTENSION.XLXS)} />;
  }
}

const mapStateToProps = (state) => {
  return {
    isLoading: state.stockReportReducer.isLoading,
    stockReportExcel: state.stockReportReducer.report_excel,
    total_stock: state.stockReportReducer.total_stock,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(StockReportExcel);
