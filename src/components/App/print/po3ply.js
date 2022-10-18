import React, { Component } from "react";
import Layout from "./layout";
import { toRp } from "helper";
import { rmComma } from "../../../helper";
import Cookies from "js-cookie";

export default class Print3ply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      master: [],
      logo: "",
      user: "",
      lokasi_beli: "",
      nota: "",
      newLogo: "",
    };
  }
  componentWillMount() {
    const getData = this.props.location.state.data;
    console.log("GET DATA", getData);
    this.setState({
      data: getData.detail,
      master: getData.master,
      nota: getData.nota,
      logo: getData.logo,
      user: getData.user,
      lokasi_beli: getData.lokasi_beli,
    });
  }

  getLogo() {
    const simg = document.getElementsByClassName("selected__img");
    const src = simg[0].src;
    return src;
  }

  render() {
    const { master, data, nota, logo, user, lokasi_beli } = this.state;
    if (this.state.newLogo === "") {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
          //
          // logoBase64 = reader.result;
          this.setState({ newLogo: reader.result });
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.open("GET", logo);
      xhr.responseType = "blob";
      xhr.send();
    }
    return (
      <Layout>
        <div id="print_3ply">
          <table width="100%" cellSpacing={0} cellPadding={1} style={{ letterSpacing: 5, fontFamily: '"Courier New"', marginBottom: 10, fontSize: "20pt" }}>
            <thead>
              <tr>
                <td colSpan={3} style={{ textAlign: "center" }}>
                  <img className="img_head" style={{ padding: "10px" }} alt="LOGO" src={this.state.newLogo} />
                </td>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  Laporan Arsip Purchase Order ({nota})
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="2%" />
                <td width="20%" />
                <td width="2%" />
                <td width="28%" />
                <td width="10%" />
                <td width="12%" />
                <td width="2%" />
                <td width="25%" />
              </tr>
              <tr>
                <td />
                <td style={{ fontSize: "10pt !important" }} className="text-left">
                  Tanggal Kirim
                </td>
                <td style={{ fontSize: "10pt !important" }}>:</td>
                <td style={{ fontSize: "10pt !important" }} className="text-left">
                  {data.tgl_kirim}
                </td>
                <td />
                <td style={{ fontSize: "10pt !important" }} className="text-left">
                  Operator
                </td>
                <td style={{ fontSize: "10pt !important" }}>:</td>
                <td style={{ fontSize: "10pt !important" }} className="text-left">
                  {user}
                </td>
              </tr>
              <tr>
                <td />
                <td style={{ fontSize: "10pt !important" }} className="text-left">
                  Tanggal Order
                </td>
                <td style={{ fontSize: "10pt !important" }}>:</td>
                <td style={{ fontSize: "10pt !important" }} className="text-left">
                  {data.tgl_order}
                </td>
                <td />
                <td style={{ fontSize: "10pt !important" }} className="text-left">
                  Jenis Trx
                </td>
                <td style={{ fontSize: "10pt !important" }}>:</td>
                <td style={{ fontSize: "10pt !important" }} className="text-left">
                  {data.jenis_transaksi}
                </td>
              </tr>
              <tr>
                <td />
                <td style={{ fontSize: "10pt !important" }} className="text-left">
                  Lokasi
                </td>
                <td style={{ fontSize: "10pt !important" }}>:</td>
                <td style={{ fontSize: "10pt !important" }} className="text-left">
                  {lokasi_beli}
                </td>
                <td />
                <td style={{ fontSize: "10pt !important" }} className="text-left">
                  Keterangan
                </td>
                <td style={{ fontSize: "10pt !important" }}>:</td>
                <td style={{ fontSize: "10pt !important" }} className="text-left">
                  {data.catatan}
                </td>
              </tr>
            </tbody>
          </table>
          <table width="99%" style={{ letterSpacing: 5, fontFamily: '"Courier New"', fontSize: "20pt" }}>
            <thead>
              <tr>
                <td style={{ borderBottom: "solid", borderWidth: "thin", paddingLeft: "5pt", fontSize: "10pt !important" }} className="text-center">
                  No
                </td>
                <td style={{ borderBottom: "solid", borderWidth: "thin", paddingLeft: "5pt", fontSize: "10pt !important" }} className="text-center">
                  Nama barang
                </td>
                <td style={{ borderBottom: "solid", borderWidth: "thin", paddingLeft: "5pt", fontSize: "10pt !important" }} className="text-center">
                  Barcode
                </td>
                <td style={{ borderBottom: "solid", borderWidth: "thin", paddingLeft: "5pt", fontSize: "10pt !important" }} className="text-center">
                  Satuan
                </td>
                <td style={{ display: data.isShowHargaBeli !== 1 && "none", borderBottom: "solid", borderWidth: "thin", paddingLeft: "5pt", fontSize: "10pt !important" }} className="text-center">
                  Harga Beli
                </td>
                <td style={{ borderBottom: "solid", borderWidth: "thin", paddingLeft: "5pt", fontSize: "10pt !important" }} className="text-center">
                  Diskon
                </td>
                <td style={{ borderBottom: "solid", borderWidth: "thin", paddingLeft: "5pt", fontSize: "10pt !important" }} className="text-center">
                  PPN %
                </td>
                <td style={{ borderBottom: "solid", borderWidth: "thin", paddingLeft: "5pt", fontSize: "10pt !important" }} className="text-center">
                  QTY
                </td>
                <td style={{ display: data.isShowHargaBeli === 1 ? "block" : "none", borderBottom: "solid", borderWidth: "thin", paddingLeft: "5pt", paddingRight: "15px", fontSize: "10pt !important" }} className="text-center">
                  Subtotal
                </td>
              </tr>
            </thead>
            <tbody>
              {master.map((item, index) => {
                let disc1 = 0;
                let disc2 = 0;
                let ppn = 0;
                if (item.diskon !== 0) {
                  disc1 = parseInt(rmComma(item.harga_beli), 10) * (parseFloat(item.diskon) / 100);
                  disc2 = disc1;
                  if (item.diskon2 !== 0) {
                    disc2 = disc1 * (parseFloat(item.diskon2) / 100);
                  }
                }

                if (item.ppn !== 0) {
                  ppn = parseInt(rmComma(item.harga_beli), 10) * (parseFloat(item.ppn) / 100);
                }
                return (
                  <tr key={index}>
                    <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-center">
                      {index + 1}
                    </td>
                    <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-left">
                      {item.nm_brg}
                    </td>
                    <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-left">
                      {item.barcode}
                    </td>
                    <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-left">
                      {item.satuan}
                    </td>
                    <td style={{ display: data.isShowHargaBeli === 1 ? "block" : "none", border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-right">
                      {toRp(rmComma(item.harga_beli))}
                    </td>
                    <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-right">
                      {item.diskon}
                    </td>
                    <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-right">
                      {item.ppn}
                    </td>
                    <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-right">
                      {item.qty}
                    </td>
                    <td style={{ display: data.isShowHargaBeli !== 1 && "none", border: "solid", borderWidth: "thin", paddingLeft: "5pt", paddingRight: "15pt" }} className="text-right">
                      {toRp((parseInt(rmComma(item.harga_beli), 10) - disc2 + ppn) * parseFloat(item.qty))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot style={{ display: data.isShowHargaBeli !== 1 && "none" }}>
              <tr>
                <td colSpan={8} style={{ borderTop: "", borderWidth: "", paddingLeft: "25pt" }}>
                  TOTAL
                </td>
                <td className="text-right" style={{ borderTop: "", borderWidth: "", paddingLeft: "5pt" }}>
                  {toRp(data.sub_total)}
                </td>
                {/* <td style={{ borderTop: "", borderWidth: "thin", paddingLeft: "15pt" }} colSpan={7}>
                  TOTAL
                </td>
                <td style={{ borderTop: "", borderWidth: "thin" }} />
                <td style={{ borderTop: "", borderWidth: "thin", paddingLeft: "5pt", paddingRight: "15pt" }} className="text-right">
                  {toRp(data.sub_total)}
                </td> */}
              </tr>
            </tfoot>
          </table>
          <table width="100%" style={{ letterSpacing: 5, fontFamily: '"Courier New"', fontSize: "20pt" }}>
            <thead>
              <tr>
                <td style={{ borderTop: "", borderWidth: "thin" }} width="33%" />
                <td style={{ borderTop: "", borderWidth: "thin" }} width="33%" />
                <td style={{ borderTop: "", borderWidth: "thin" }} width="33%" />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ textAlign: "center" }}></td>
                <td style={{ textAlign: "center" }}></td>
                <td style={{ textAlign: "center" }}>
                  <b>
                    <br />
                    <br />
                    <br />
                    <br />
                    _____________
                  </b>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Layout>
    );
  }
}
