import React, { Component } from "react";
import Layout from "./layout";
import { toRp } from "helper";
import { CapitalizeEachWord, parseToRp, rmComma, toDate } from "../../../helper";

export default class Print3ply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      detail: [],
      master: [],
      logo: "",
      user: "",
      lokasi: "",
      nota: "",
      newLogo: "",
    };
  }
  componentWillMount() {
    const getData = this.props.location.state.data;
    console.log(getData);
    this.setState({
      detail: getData.detail,
      data: getData.detail,
      master: getData.master,
      nota: getData.nota,
      logo: getData.logo,
      user: getData.user,
      lokasi: getData.lokasi,
    });
  }

  getLogo() {
    const simg = document.getElementsByClassName("selected__img");
    const src = simg[0].src;
    return src;
  }

  render() {
    const { master, data, logo, user, lokasi, detail } = this.state;
    // const { detail,master}
    console.log(this.props.location);
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

    let total_stock = 0;
    let qty_retur = 0;
    let grand_total = 0;
    return (
      <Layout>
        <div id="print_3ply">
          <table width="100%" cellSpacing={0} cellPadding={1} style={{ letterSpacing: 5, fontFamily: '"OpenSans-Regular", "Lucida Sans Typewriter", "Lucida Typewriter", "Arial", "Helvetica", "sans-serif"', marginBottom: 10, fontSize: "9pt" }}>
            <thead>
              <tr>
                <td colSpan={3} style={{ textAlign: "center" }}>
                  <img className="img_head" style={{ padding: "10px" }} alt="LOGO" src={this.state.newLogo} />
                </td>
                <td style={{ height: "1.5cm", textAlign: "center" }} colSpan={5}>
                  Nota Retur Pembelian
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="2%" />
                <td width="23%" />
                <td width="2%" />
                <td width="25%" />
                <td width="3%" />
                <td width="19%" />
                <td width="2%" />
                <td width="25%" />
              </tr>
              <tr>
                <td />
                <td style={{ fontSize: "8pt !important" }}>Tanggal</td>
                <td style={{ fontSize: "8pt !important" }}>:</td>
                <td style={{ fontSize: "10pt !important" }}>{toDate(new Date(), "-")}</td>
                <td />
                <td style={{ fontSize: "8pt !important" }}>Retur Ke</td>
                <td style={{ fontSize: "8pt !important" }}>:</td>
                <td style={{ fontSize: "10pt !important" }}>{master.supplier}</td>
              </tr>
              <tr>
                <td />
                <td style={{ fontSize: "8pt !important" }}>Operator</td>
                <td style={{ fontSize: "8pt !important" }}>:</td>
                <td style={{ fontSize: "10pt !important" }}>{master.operator_nama}</td>
                <td />
                <td style={{ fontSize: "8pt !important" }}>Lokasi Cabang</td>
                <td style={{ fontSize: "8pt !important" }}>:</td>
                <td style={{ fontSize: "10pt !important" }}>{master.lokasi_nama}</td>
              </tr>
            </tbody>
          </table>
          <table width="99%" style={{ letterSpacing: 5, fontFamily: '"OpenSans-Regular", "Lucida Sans Typewriter", "Lucida Typewriter", "Arial", "Helvetica", "sans-serif"', fontSize: "9pt" }}>
            <thead>
              <tr>
                <td style={{ borderBottom: "", borderWidth: "thin", paddingLeft: "5pt", fontSize: "10pt !important" }} className="text-center">
                  No
                </td>
                <td style={{ borderBottom: "", borderWidth: "thin", paddingLeft: "5pt", fontSize: "10pt !important" }} className="text-center">
                  Nama barang
                </td>
                <td style={{ borderBottom: "", borderWidth: "thin", paddingLeft: "5pt", fontSize: "10pt !important" }} className="text-center">
                  Barcode
                </td>
                <td style={{ borderBottom: "", borderWidth: "thin", paddingLeft: "5pt", fontSize: "10pt !important" }} className="text-center">
                  Satuan
                </td>
                <td style={{ borderBottom: "", borderWidth: "thin", paddingLeft: "5pt", fontSize: "10pt !important" }} className="text-center">
                  Harga Beli
                </td>
                <td style={{ borderBottom: "", borderWidth: "thin", paddingLeft: "5pt", fontSize: "10pt !important" }} className="text-center">
                  Kondisi
                </td>
                <td style={{ borderBottom: "", borderWidth: "thin", paddingLeft: "5pt", fontSize: "10pt !important" }} className="text-center">
                  Qty Retur
                </td>
                <td style={{ borderBottom: "", borderWidth: "thin", paddingLeft: "5pt", fontSize: "10pt !important" }} className="text-center">
                  Nilai Retur
                </td>
              </tr>
            </thead>
            <tbody>
              {detail.map((item, index) => {
                let total_retur = parseInt(item.qty_retur, 10) * parseInt(rmComma(item.harga_beli), 10);
                grand_total = grand_total + total_retur;
                localStorage.setItem("grand_total", grand_total);
                qty_retur = qty_retur + parseInt(item.qty_retur, 10);
                total_stock = total_stock + parseInt(item.stock, 10);
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
                    <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-right">
                      {parseToRp(rmComma(item.harga_beli))}
                    </td>
                    <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-left">
                      {item.kondisi ? CapitalizeEachWord(item.kondisi) : "Bad Stock"}
                    </td>
                    <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-right">
                      {parseToRp(item.qty_retur)}
                    </td>
                    <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-right">
                      {parseToRp(total_retur)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ border: "solid", borderWidth: "thin", backgroundColor: "#EEEEEE" }}>
                <td style={{ borderTop: "", borderWidth: "thin" }} colSpan={3}>
                  TOTAL
                </td>
                <td style={{ borderTop: "", borderWidth: "thin" }}>{/*?=$tqty?*/}</td>
                <td style={{ borderTop: "", borderWidth: "thin" }} colSpan={3} />
                <td style={{ borderTop: "", borderWidth: "thin", paddingLeft: "5pt" }} className="text-right">
                  {parseToRp(grand_total)}
                </td>
              </tr>
            </tfoot>
          </table>
          <table width="100%" style={{ letterSpacing: 5, fontFamily: '"OpenSans-Regular", "Lucida Sans Typewriter", "Lucida Typewriter", "Arial", "Helvetica", "sans-serif"', fontSize: "9pt" }}>
            <thead>
              <tr>
                <td style={{ borderTop: "", borderWidth: "thin" }} width="33%" />
                <td style={{ borderTop: "", borderWidth: "thin" }} width="33%" />
                <td style={{ borderTop: "", borderWidth: "thin" }} width="33%" />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ textAlign: "left" }} colSpan={2}></td>
              </tr>
              <tr>
                <td style={{ textAlign: "center" }}>Penerima</td>
                <td style={{ textAlign: "center" }}>Pengirim</td>
                <td style={{ textAlign: "center" }}>Admin</td>
              </tr>
              <tr>
                <td style={{ textAlign: "center" }}>
                  <b>
                    <br />
                    <br />
                    <br />
                    <br />
                    _____________
                  </b>
                </td>
                <td style={{ textAlign: "center" }}>
                  <b>
                    <br />
                    <br />
                    <br />
                    <br />
                    _____________
                  </b>
                </td>
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
          <table width="100%" border={0} style={{ marginTop: "5mm", letterSpacing: 5, fontFamily: '"OpenSans-Regular", "Lucida Sans Typewriter", "Lucida Typewriter", "Arial", "Helvetica", "sans-serif"', fontSize: "9pt" }}>
            <tbody>
              <tr>
                <td colSpan={3}>Ket : {data.keterangan}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Layout>
    );
  }
}
