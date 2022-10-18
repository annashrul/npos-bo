import React, { Component } from "react";
import { FetchAlokasiDetail } from "redux/actions/inventory/alokasi.action";
import connect from "react-redux/es/connect/connect";
import Layout from "./layout";
import { toRp } from "helper";
import Barcode from "react-barcode";
import moment from "moment";
class Print3ply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      newLogo: "",
    };
    this.props.dispatch(FetchAlokasiDetail(this.props.match.params.id, "[page=1", false));
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let getData = nextProps.alokasiDetail.length !== 0 ? nextProps.alokasiDetail : 0;
    if (getData !== 0 && nextProps.auth.user.logo !== undefined) {
      if (this.state.newLogo === "") {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          const reader = new FileReader();
          reader.onloadend = () => {
            this.setState({ newLogo: reader.result });
          };
          reader.readAsDataURL(xhr.response);
        };
        xhr.open("GET", nextProps.auth.user.logo !== undefined ? nextProps.auth.user.logo : "");
        xhr.responseType = "blob";
        xhr.send();
      }
    }
    this.setState({
      data: getData,
    });
  }
  render() {
    const { detail, operator, keterangan, lokasi_asal, lokasi_tujuan, tgl_mutasi, no_faktur_beli } = this.state.data;
    let amount_total = 0;
    return (
      <Layout>
        <div id="print_3ply">
          <table width="100%" cellSpacing={0} cellPadding={1} style={{ letterSpacing: 5, fontFamily: '"Courier New"', marginBottom: 10, fontSize: "20pt" }}>
            <thead>
              <tr>
                <td colSpan={3} style={{ textAlign: "center" }}></td>
                <td colSpan={5} style={{ textAlign: "right" }}>
                  <Barcode width={2} height={25} format={"CODE128"} displayValue={false} value={this.props.match.params.id} />{" "}
                </td>
              </tr>
              <tr>
                <td colSpan={3} style={{ textAlign: "center" }}>
                  <img className="img_head" style={{ padding: "10px" }} alt="LOGO" src={this.state.newLogo} />
                </td>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  Alokasi Barang ({this.props.match.params.id})
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td width="2%" />
                <td width="20%" />
                <td width="2%" />
                <td width="28%" />
                <td width="6%" />
                <td width="12%" />
                <td width="2%" />
                <td width="29%" />
              </tr>
              <tr>
                <td />
                <td>Tanggal</td>
                <td>:</td>
                <td>{moment(tgl_mutasi).format("YYYY-MM-DD")}</td>
                <td />
                <td>Operator</td>
                <td>:</td>
                <td>{operator}</td>
              </tr>
              <tr>
                <th />
                <td>Lokasi Asal</td>
                <td>:</td>
                <td>{lokasi_asal}</td>
                <td />
                <td>No Faktur Beli</td>
                <td>:</td>
                <td>{no_faktur_beli}</td>
              </tr>
              <tr>
                <th />
                <td>Lokasi Tujuan</td>
                <td>:</td>
                <td>{lokasi_tujuan}</td>
                <td />
                <td>Keterangan</td>
                <td>:</td>
                <td>{keterangan}</td>
              </tr>
            </tbody>
          </table>
          <table width="99%" style={{ letterSpacing: 5, fontFamily: '"Courier New"', fontSize: "20pt" }}>
            <thead>
              <tr>
                <td style={{ width: "5%", borderBottom: "", borderWidth: "", paddingLeft: "5pt" }} className="text-center">
                  No
                </td>
                <td style={{ width: "25%", borderBottom: "", borderWidth: "", paddingLeft: "5pt" }} className="text-center">
                  Nama
                </td>
                <td style={{ width: "15%", borderBottom: "", borderWidth: "", paddingLeft: "5pt" }} className="text-center">
                  Barcode
                </td>
                <td style={{ width: "10%", borderBottom: "", borderWidth: "", paddingLeft: "5pt" }} className="text-center">
                  Satuan
                </td>
                <td style={{ width: "10%", borderBottom: "", borderWidth: "", paddingLeft: "5pt" }} className="text-center">
                  Qty
                </td>
                <td style={{ width: "10%", borderBottom: "", borderWidth: "", paddingLeft: "5pt" }} className="text-center">
                  Qty diterima
                </td>
                <td style={{ width: "20%", borderBottom: "", borderWidth: "", paddingLeft: "5pt" }} className="text-center">
                  Harga
                </td>
                <td style={{ width: "20%", borderBottom: "", borderWidth: "", paddingLeft: "5pt" }} className="text-center">
                  Amount
                </td>
              </tr>
            </thead>
            <tbody>
              {detail !== undefined
                ? detail.data.map((item, index) => {
                    const jenis = item.no_faktur_mutasi.substring(0, 2);
                    // amount_total += jenis === "TR" ? parseInt(item.hrg_jual, 10) : parseInt(item.hrg_beli, 10) * (parseInt(item.qty_retur, 10) > 0 ? parseInt(item.qty, 10) - parseInt(item.qty_retur) : parseInt(item.qty, 10));
                    let amount = 0;
                    let price = 0;
                    if (jenis === "TR") {
                      price = parseInt(item.hrg_jual, 10);
                    } else {
                      price = parseInt(item.hrg_beli, 10);
                    }
                    if (parseInt(item.qty_retur, 10) > 0) {
                      amount = price * (parseInt(item.qty, 10) - parseInt(item.qty_retur, 10));
                    } else {
                      amount = price * parseInt(item.qty, 10);
                    }
                    amount_total+=amount;

                    console.log("amount", amount);

                    return (
                      <tr key={index}>
                        <td style={{ border: "solid", borderWidth: "", paddingLeft: "5pt" }} className="text-center">
                          {index + 1}
                        </td>
                        <td style={{ border: "solid", borderWidth: "", paddingLeft: "5pt" }} className="text-left">
                          {item.nm_brg}
                        </td>
                        <td style={{ border: "solid", borderWidth: "", paddingLeft: "5pt" }} className="text-left">
                          {item.barcode}
                        </td>
                        <td style={{ border: "solid", borderWidth: "", paddingLeft: "5pt" }} className="text-left">
                          {item.satuan}
                        </td>
                        <td style={{ border: "solid", borderWidth: "", paddingLeft: "5pt" }} className="text-right">
                          {item.qty}
                        </td>
                        <td style={{ border: "solid", borderWidth: "", paddingLeft: "5pt" }} className="text-right">
                          {item.qty_retur > 0 ? item.qty - item.qty_retur : 0}
                        </td>
                        <td style={{ border: "solid", borderWidth: "", paddingLeft: "5pt" }} className="text-right">
                          {toRp(price)}
                        </td>
                        <td style={{ border: "solid", borderWidth: "", paddingLeft: "5pt" }} className="text-right">
                          {toRp(amount)}
                        </td>
                      </tr>
                    );
                  })
                : "no data"}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={7} style={{ borderTop: "", borderWidth: "", paddingLeft: "25pt" }}>
                  TOTAL
                </td>
                <td className="text-right" style={{ borderTop: "", borderWidth: "", paddingLeft: "5pt" }}>
                  {toRp(amount_total)}
                </td>
                <td style={{ borderTop: "", borderWidth: "" }} />
              </tr>
            </tfoot>
          </table>
          <table width="100%" style={{ letterSpacing: 5, fontFamily: '"Courier New"', fontSize: "20pt" }}>
            <thead>
              <tr>
                <td style={{ borderTop: "", borderWidth: "" }} width="33%" />
                <td style={{ borderTop: "", borderWidth: "" }} width="33%" />
                <td style={{ borderTop: "", borderWidth: "" }} width="33%" />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ textAlign: "center" }}>
                  <br />
                  Pengirim
                  <br />
                  <br />
                  <br />
                  _____________
                </td>
                <td style={{ textAlign: "center" }}>
                  <br />
                  Penerima
                  <br />
                  <br />
                  <br />
                  _____________
                </td>
                <td style={{ textAlign: "center" }}>
                  <br />
                  Mengetahui
                  <br />
                  <br />
                  <br />
                  _____________
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    alokasiDetail: state.alokasiReducer.alokasi_data,
  };
};
export default connect(mapStateToProps)(Print3ply);
