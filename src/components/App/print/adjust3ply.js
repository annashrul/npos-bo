import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import Layout from "./layout";
import { toRp } from "helper";
import Barcode from "react-barcode";
import { FetchAdjustmentDetail } from "redux/actions/adjustment/adjustment.action";
import moment from "moment";
class Adjust3ply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      newLogo: "",
    };
    this.props.dispatch(FetchAdjustmentDetail(this.props.match.params.id));
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    let getData = nextProps.adjustmentDetailSatuan.length !== 0 ? nextProps.adjustmentDetailSatuan : 0;
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
    const { detail, kd_trx, operator, tgl, lokasi, keterangan, alamat, site_title } = this.state.data;
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
                <td rowSpan={3} colSpan={3} style={{ textAlign: "center" }}>
                  <img className="img_head" style={{ padding: "10px" }} alt="LOGO" src={this.state.newLogo} />
                </td>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  <strong>{site_title}</strong>
                </td>
              </tr>
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  {alamat}
                </td>
              </tr>
              <tr>
                <td colSpan={5} style={{ textAlign: "center", bordeColor: "black", borderBottom: "solid", borderWidth: "thin" }}>
                  Adjustment Stock ({kd_trx})
                </td>
              </tr>
            </thead>
            <tbody className="mt-2">
              <tr>
                <td width="2%" />
                <td width="20%" />
                <td width="2%" />
                <td width="28%" />
                <td width="10%" />
                <td width="2%" />
                <td width="20%" />
              </tr>
              <tr>
                <td />
                <td>Tanggal</td>
                <td>:</td>
                <td>{moment(tgl).format("YYYY-MM-DD")}</td>
                <td>Operator</td>
                <td>:</td>
                <td>{operator}</td>
              </tr>
              <tr>
                <th />
                <td>Lokasi</td>
                <td>:</td>
                <td>{lokasi}</td>
                <td>Keterangan</td>
                <td>:</td>
                <td>{keterangan}</td>
              </tr>
            </tbody>
          </table>
          <table width="99%" style={{ letterSpacing: 5, fontFamily: '"Courier New"', fontSize: "20pt" }}>
            <thead>
              <tr>
                <td style={{ borderBottom: "solid", borderWidth: "thin", width: "3%", paddingLeft: "5pt" }} className="text-center">
                  No
                </td>
                <td style={{ borderBottom: "solid", borderWidth: "thin", width: "15%", paddingLeft: "5pt" }} className="text-center">
                  Barcode
                </td>
                <td style={{ borderBottom: "solid", borderWidth: "thin", width: "30%", paddingLeft: "5pt" }} className="text-center">
                  Nama
                </td>
                <td style={{ borderBottom: "solid", borderWidth: "thin", width: "10%", paddingLeft: "5pt" }} className="text-center">
                  Satuan
                </td>
                <td style={{ borderBottom: "solid", borderWidth: "thin", width: "10%", paddingLeft: "5pt" }} className="text-center">
                  Harga Beli
                </td>
                <td style={{ borderBottom: "solid", borderWidth: "thin", width: "10%", paddingLeft: "5pt" }} className="text-center">
                  Stock Sistem
                </td>
                <td style={{ borderBottom: "solid", borderWidth: "thin", width: "10%", paddingLeft: "5pt" }} className="text-center">
                  Jenis
                </td>
                <td style={{ borderBottom: "solid", borderWidth: "thin", width: "10%", paddingLeft: "5pt" }} className="text-center">
                  Stock Adjust
                </td>
                <td style={{ borderBottom: "solid", borderWidth: "thin", width: "10%", paddingLeft: "5pt" }} className="text-center">
                  Saldo Stock
                </td>
              </tr>
            </thead>
            {detail !== undefined
              ? (detail.isArray ? detail : [detail]).map((item, index) => {
                  return (
                    <tr key={index}>
                      <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-center">
                        {index + 1}
                      </td>
                      <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-left">
                        {item.brcd_brg}
                      </td>
                      <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-left">
                        {item.nm_brg}
                      </td>
                      <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-left">
                        {item.satuan}
                      </td>
                      <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-right">
                        {toRp(item.harga_beli)}
                      </td>
                      <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-right">
                        {item.stock_terakhir}
                      </td>
                      <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-left">
                        {item.status}
                      </td>
                      <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-right">
                        {item.qty_adjust}
                      </td>
                      <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-right">
                        {item.saldo_stock}
                      </td>
                    </tr>
                  );
                })
              : "no data"}
            <tbody></tbody>
          </table>
          <table width="100%" style={{ letterSpacing: 5, fontFamily: '"Courier New"', fontSize: "20pt" }}>
            <thead>
              <tr>
                <th style={{ borderTop: "solid", borderWidth: "0" }} width="50%" />
                <th style={{ borderTop: "solid", borderWidth: "0" }} width="50%" />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ textAlign: "center" }}>
                  <br />
                  Operator
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
    adjustmentDetailSatuan: state.adjustmentReducer.dataDetailTransaksi,
  };
};

export default connect(mapStateToProps)(Adjust3ply);
