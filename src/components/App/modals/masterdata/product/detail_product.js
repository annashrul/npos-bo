import React, { Component } from "react";
import { ModalBody, ModalHeader } from "reactstrap";
import WrapperModal from "../../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import { ModalToggle } from "redux/actions/modal.action";
import { getMargin, noData, parseToRp, toRp } from "../../../../../helper";
import HeaderDetailCommon from "../../../common/HeaderDetailCommon";
import TableCommon from "../../../common/TableCommon";
class DetailProduct extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }
  toggle(e) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
  }
  render() {
    const columnStyle = { verticalAlign: "middle", textAlign: "center" };
    let master = this.props.detail;
    console.log(this.props);
    const head = [
      { rowSpan: 2, label: "No", className: "text-center" },
      { rowSpan: 2, label: "Lokasi" },
      { rowSpan: 2, label: "Barcode" },
      { rowSpan: 2, label: "Satuan" },
      { rowSpan: 2, label: "Ppn" },
      { rowSpan: 2, label: "Servis" },
      { rowSpan: 2, label: "Harga beli" },
      { colSpan: 4, label: "Harga jual" },
      { colSpan: 4, label: "Margin" },
    ];

    const rowSpan = [{ label: "1" }, { label: "2" }, { label: "3" }, { label: "4" }, { label: "1" }, { label: "2" }, { label: "3" }, { label: "4" }];
    return (
      <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailProduct"} size="lg">
        <ModalHeader toggle={this.toggle}>Detail Barang</ModalHeader>
        <ModalBody>
          <HeaderDetailCommon
            md="col-md-5"
            data={[
              { title: "Kode", desc: master.kd_brg },
              { title: "Supplier", desc: master.supplier },
              { title: "Nama", desc: master.nm_brg },
              { title: "Jenis", desc: master.jenis === "0" ? "TIDAK DIJUAL" : "DIJUAL" },
              { title: "Kategori", desc: master.kategori },
              { title: "dept", desc: master.dept },
              { title: "Kelompok", desc: master.kel_brg },
              { title: "Sub dept", desc: master.subdept },
            ]}
          />
          <TableCommon
            head={head}
            rowSpan={rowSpan}
            renderRow={
              typeof this.props.dataDetail.tambahan === "object"
                ? this.props.dataDetail.tambahan.map((v, i) => {
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">{i + 1}</td>
                        <td className="middle nowrap">{v.lokasi}</td>
                        <td className="middle nowrap">{v.barcode}</td>
                        <td className="middle nowrap">{v.satuan}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.ppn)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.service)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.harga_beli)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.harga)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.harga2)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.harga3)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.harga4)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.harga !== "0" ? getMargin(v.harga, v.harga_beli) : "0")}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.harga2 !== "0" ? getMargin(v.harga2, v.harga_beli) : "0")}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.harga3 !== "0" ? getMargin(v.harga3, v.harga_beli) : "0")}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.harga4 !== "0" ? getMargin(v.harga4, v.harga_beli) : "0")}</td>
                      </tr>
                    );
                  })
                : noData(head.length)
            }
          />
          {/* <table className="table">
            <tbody>
              <tr>
                <td className="text-black">KODE BARANG</td>
                <td className="text-black-50">: {this.props.dataDetail.kd_brg}</td>
                <td className="text-black">SUPPLIER</td>
                <td className="text-black-50">: {this.props.dataDetail.group1}</td>
              </tr>
              <tr>
                <td className="text-black">JENIS</td>
                <td className="text-black-50">: {this.props.dataDetail.jenis === "0" ? "TIDAK JUAL" : "DIJUAL"}</td>
                <td className="text-black">SUBDEPT</td>
                <td className="text-black-50">: {this.props.dataDetail.group2}</td>
              </tr>
              <tr>
                <td className="text-black">NAMA BARANG</td>
                <td className="text-black-50">: {this.props.dataDetail.nm_brg}</td>
                <td className="text-black">KATEGORI</td>
                <td className="text-black-50">: {this.props.dataDetail.kategori}</td>
              </tr>
              <tr>
                <td className="text-black">KELOMPOK BARANG</td>
                <td className="text-black-50">: {this.props.dataDetail.kel_brg}</td>
                <td className="text-black">JENIS</td>
                <td className="text-black-50">: {this.props.dataDetail.jenis}</td>
              </tr>
            </tbody>
          </table> */}
          {/* <div style={{ overflowX: "auto" }}>
            <table className="table table-hover table-bordered">
              <thead className="bg-light">
                <tr>
                  <th className="text-black" style={columnStyle} rowSpan="2">
                    NO
                  </th>
                  <th className="text-black" style={columnStyle} rowSpan="2">
                    LOKASI
                  </th>
                  <th className="text-black" style={columnStyle} rowSpan="2">
                    BARCODE
                  </th>
                  <th className="text-black" style={columnStyle} rowSpan="2">
                    SATUAN
                  </th>
                  <th className="text-black" style={columnStyle} rowSpan="2">
                    PPN
                  </th>
                  <th className="text-black" style={columnStyle} rowSpan="2">
                    SERVICE
                  </th>
                  <th className="text-black" style={columnStyle} rowSpan="2">
                    HARGA BELI
                  </th>
                  <th className="text-black" style={columnStyle} colSpan="4">
                    HARGA JUAL
                  </th>
                  <th className="text-black" style={columnStyle} colSpan="4">
                    MARGIN
                  </th>
                </tr>
                <tr>
                  <td className="text-black" style={columnStyle}>
                    1
                  </td>
                  <td className="text-black" style={columnStyle}>
                    2
                  </td>
                  <td className="text-black" style={columnStyle}>
                    3
                  </td>
                  <td className="text-black" style={columnStyle}>
                    4
                  </td>

                  <td className="text-black" style={columnStyle}>
                    1
                  </td>
                  <td className="text-black" style={columnStyle}>
                    2
                  </td>
                  <td className="text-black" style={columnStyle}>
                    3
                  </td>
                  <td className="text-black" style={columnStyle}>
                    4
                  </td>
                </tr>
              </thead>
              <tbody>
                {typeof this.props.dataDetail.tambahan === "object"
                  ? this.props.dataDetail.tambahan.map((v, i) => {
                      return (
                        <tr key={i}>
                          <td style={columnStyle}>{i + 1}</td>
                          <td style={columnStyle}>{v.lokasi}</td>
                          <td style={columnStyle}>{v.barcode}</td>
                          <td style={columnStyle}>{v.satuan}</td>
                          <td style={columnStyle}>{v.ppn}</td>
                          <td style={columnStyle}>{v.service}</td>
                          <td style={columnStyle}>{toRp(v.harga_beli)}</td>
                          <td style={columnStyle}>{toRp(v.harga)}</td>
                          <td style={columnStyle}>{toRp(v.harga2)}</td>
                          <td style={columnStyle}>{toRp(v.harga3)}</td>
                          <td style={columnStyle}>{toRp(v.harga4)}</td>
                          <td style={columnStyle}>{v.harga !== "0" ? getMargin(v.harga, v.harga_beli) : "0"}</td>
                          <td style={columnStyle}>{v.harga2 !== "0" ? getMargin(v.harga2, v.harga_beli) : "0"}</td>
                          <td style={columnStyle}>{v.harga3 !== "0" ? getMargin(v.harga3, v.harga_beli) : "0"}</td>
                          <td style={columnStyle}>{v.harga4 !== "0" ? getMargin(v.harga4, v.harga_beli) : "0"}</td>
                        </tr>
                      );
                    })
                  : ""}
              </tbody>
            </table>
          </div> */}
        </ModalBody>
      </WrapperModal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
// const mapDispatch
export default connect(mapStateToProps)(DetailProduct);
