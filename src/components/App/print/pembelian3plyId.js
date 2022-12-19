import React, { Component } from "react";
import Layout from "./layout";
import connect from "react-redux/es/connect/connect";
import { toRp } from "helper";
import Barcode from "react-barcode";
import { receiveAmbilData } from "../../../redux/actions/purchase/receive/receive.action";
import moment from "moment";

class Adjust3ply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: { master: {}, data: {} },
      newLogo: "",
    };
    this.props.dispatch(receiveAmbilData(this.props.match.params.id));
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.auth.user.logo !== undefined) {
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
    if (nextProps.poDetail.master !== undefined && nextProps.poDetail.detail !== undefined) {
      let getData = nextProps.poDetail;
      this.setState({
        data: getData,
      });
    }
  }
  render() {
    const { master, detail } = this.state.data;

    console.log(master, detail);

    return (
      <Layout>
        {master.no_po !== undefined ? (
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
                    Receive Pembelian ({this.props.match.params.id})
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
                  <td>Tanggal Beli</td>
                  <td>:</td>
                  <td>{moment(master.tgl_beli).format("yyyy-MM-DD")}</td>
                  <td />
                  <td>Operator</td>
                  <td>:</td>
                  <td>{master.operator}</td>
                </tr>
                <tr>
                  <th />
                  <td>Lokasi</td>
                  <td>:</td>
                  <td>{master.lokasi}</td>
                  <td />
                  <td>Pelunasan</td>
                  <td>:</td>
                  <td>{master.pelunasan}</td>
                </tr>
                <tr>
                  <th />
                  <td>Penerima</td>
                  <td>:</td>
                  <td>{master.nama_penerima}</td>
                  <td />
                  <td>Catatan</td>
                  <td>:</td>
                  <td>{master.catatan}</td>
                </tr>
              </tbody>
            </table>
            <table width="99%" style={{ letterSpacing: 5, fontFamily: '"Courier New"', fontSize: "20pt" }}>
              <thead>
                <tr>
                  <td style={{ width: "5%", borderBottom: "", borderWidth: "thin", paddingLeft: "5pt" }} className="text-center">
                    No
                  </td>
                  <td style={{ width: "15%", borderBottom: "", borderWidth: "thin", paddingLeft: "5pt" }} className="text-center">
                    Nama
                  </td>
                  <td style={{ width: "15%", borderBottom: "", borderWidth: "thin", paddingLeft: "5pt" }} className="text-center">
                    Variasi
                  </td>                  
                  <td style={{ width: "15%", borderBottom: "", borderWidth: "thin", paddingLeft: "5pt" }} className="text-center">
                    Barcode
                  </td>
                  <td style={{ width: "10%", borderBottom: "", borderWidth: "thin", paddingLeft: "5pt" }} className="text-center">
                    Harga beli
                  </td>
                  <td style={{ width: "7%", borderBottom: "", borderWidth: "thin", paddingLeft: "5pt" }} className="text-center">
                    Diskon
                  </td>
                
                  <td style={{ width: "7%", borderBottom: "", borderWidth: "thin", paddingLeft: "5pt" }} className="text-center">
                    QTY
                  </td>
                  <td style={{ width: "7%", borderBottom: "", borderWidth: "thin", paddingLeft: "5pt" }} className="text-center">
                    QTY PO
                  </td>
                  
                  <td style={{ width: "7%", borderBottom: "", borderWidth: "thin", paddingLeft: "5pt" }} className="text-center">
                    Bonus
                  </td>
                  {/* <td style={{width: '10%', borderBottom: '', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-center">Harga jual</td> */}
                  <td style={{ width: "15%", borderBottom: "", borderWidth: "thin", paddingLeft: "5pt" }} className="text-center">
                    Sub Total
                  </td>
                </tr>
              </thead>
              <tbody>
                {detail !== undefined
                  ? detail.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-center">
                            {index + 1}
                          </td>
                          <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-left">
                            {item.nm_brg}
                          </td>
                          <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-left">
                            {item.ukuran}
                          </td>
                          <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-left">
                            {item.barcode}
                          </td>
                          <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-right">
                            {toRp(item.harga_beli)}
                          </td>
                          <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-left">
                            {item.diskon}
                          </td>
                          {/* <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-left">
                            {item.ppn}
                          </td> */}
                          <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-left">
                            {item.qty}
                          </td>
                          <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-left">
                            {item.jumlah_po}
                          </td>
                          <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-left">
                            {item.bonus}
                          </td>
                          {/* <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-left">
                            {item.retur}
                          </td> */}
                          {/* <td style={{border: 'solid', borderWidth: 'thin', paddingLeft: '5pt'}} className="text-right">{toRp(item.hrg_jual)}</td> */}
                          <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-right">
                            {toRp(item.harga_beli * item.qty)}
                          </td>
                        </tr>
                      );
                    })
                  : "no data"}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={9} style={{ borderTop: "", borderWidth: "thin", paddingLeft: "25pt" }}>
                    TOTAL
                  </td>
                  <td className="text-right" style={{ borderTop: "", borderWidth: "thin", paddingLeft: "5pt" }}>
                    {toRp(master.total_pembelian)}
                  </td>
                  <td style={{ borderTop: "", borderWidth: "thin" }} />
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
        ) : (
          ""
        )}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state.poReducer);
  return {
    auth: state.auth,
    poDetail: state.receiveReducer.dataReceiveReportDetail,
  };
};
export default connect(mapStateToProps)(Adjust3ply);
