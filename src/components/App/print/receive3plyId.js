import React, { Component } from "react";
import Layout from "./layout";
import connect from "react-redux/es/connect/connect";
import { toRp } from "helper";
import Barcode from "react-barcode";
import { receiveAmbilData } from "../../../redux/actions/purchase/receive/receive.action";
import { float, generateNo, getMargin, noData, parseToRp, toCurrency, toDate } from "../../../helper";
import HeaderDetailCommon from "../common/HeaderDetailCommon";
import TableCommon from "../common/TableCommon";

class Receive3plyId extends Component {
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
    if (nextProps.receiveReportDetail.master !== undefined && nextProps.receiveReportDetail.detail !== undefined) {
      let getData = nextProps.receiveReportDetail;
      this.setState({
        data: getData,
      });
    }
  }

  render() {
    const { master, detail } = this.state.data;
    const head = [
      { rowSpan: 2, label: "Barang" },
      { colSpan: 2, label: "Harga", width: "1%" },
      // { rowSpan: 2, label: "Margin", width: "1%" },
      { colSpan: 2, label: "Diskon (%)", width: "1%" },
      { colSpan: 4, label: "Qty", width: "1%" },
      // { rowSpan: 2, label: "Ppn", width: "1%" },
      { rowSpan: 2, label: "Subtotal", width: "1%" },
    ];
    const rowSpan = [{ label: "Beli" }, { label: "Jual" }, { label: "1" }, { label: "2" }, { label: "Beli" }, { label: "Retur" }, { label: "Bonus" }, { label: "Sisa" }];
    let totalMarginPerHalaman = 0;
    let totalDiskon1PerHalaman = 0;
    let totalDisko2PerHalaman = 0;
    let totalQtyBeliPerHalaman = 0;
    let totalQtyBonusPerHalaman = 0;
    let totalQtyReturPerHalaman = 0;
    let totalQtySisaPerHalaman = 0;
    let totalPpnPerHalaman = 0;
    let totalAmountPerHalaman = 0;
    return (
      <Layout>
        {master.no_faktur_beli !== undefined ? (
          <div id="print_3ply">
            <table width="100%" cellSpacing={0} cellPadding={1} style={{ letterSpacing: 5, fontFamily: '"Courier New"  !important', marginBottom: 10, fontSize: "20pt" }}>
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
                    Receive ({this.props.match.params.id})
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
                  <td>{toDate(master.tgl_beli)}</td>
                  <td />
                  <td>Penerima</td>
                  <td>:</td>
                  <td>{master.nama_penerima}</td>
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
                  <td>Grand Total</td>
                  <td>:</td>
                  <td>{toCurrency(master.total_pembelian)}</td>
                  <td />
                  <td>Catatan</td>
                  <td>:</td>
                  <td>{master.catatan}</td>
                </tr>
              </tbody>
            </table>
            <TableCommon
              head={head}
              rowSpan={rowSpan}
              renderRow={
                typeof detail === "object"
                  ? detail.length > 0
                    ? detail.map((v, i) => {
                        let hrgJual = float(v.harga);
                        let hrgBeli = float(v.harga_beli);
                        let diskon1 = float(v.disc1);
                        let diskon2 = float(v.disc2);
                        let jmlBeli = float(v.jumlah_beli);
                        let jmlBonus = float(v.jumlah_bonus);
                        let retur = float(v.jumlah_retur);
                        let sisa = float(v.qty);
                        let ppn = float(v.ppn_item);
                        let subtotal = float(hrgBeli * sisa - diskon1 - diskon2 + ppn);

                        totalMarginPerHalaman += float(getMargin(hrgJual, hrgBeli));
                        totalDiskon1PerHalaman += float(diskon1);
                        totalDisko2PerHalaman += float(diskon2);
                        totalQtyBeliPerHalaman += float(jmlBeli);
                        totalQtyBonusPerHalaman += float(jmlBonus);
                        totalQtyReturPerHalaman += float(retur);
                        totalQtySisaPerHalaman += float(sisa);
                        totalPpnPerHalaman += float(ppn);
                        totalAmountPerHalaman += float(subtotal);

                        return (
                          <tr key={i}>
                            <td className="middle nowrap" style={{ fontFamily: '"Courier New"  !important' }}>
                              {v.nm_brg} <br />
                              {v.kode_barang}
                            </td>
                            <td className="middle nowrap text-right" style={{ fontFamily: '"Courier New"  !important' }}>
                              {parseToRp(hrgBeli)}
                            </td>
                            <td className="middle nowrap text-right" style={{ fontFamily: '"Courier New"  !important' }}>
                              {parseToRp(hrgJual)}
                            </td>
                            {/* <td className="middle nowrap text-right" style={{ fontFamily: '"Courier New"  !important' }}>
                              {parseToRp(getMargin(hrgJual, hrgBeli))}
                            </td> */}
                            <td className="middle nowrap text-right" style={{ fontFamily: '"Courier New"  !important' }}>
                              {parseToRp(diskon1)}
                            </td>
                            <td className="middle nowrap text-right" style={{ fontFamily: '"Courier New"  !important' }}>
                              {parseToRp(diskon2)}
                            </td>
                            <td className="middle nowrap text-right" style={{ fontFamily: '"Courier New"  !important' }}>
                              {parseToRp(jmlBeli)}
                            </td>
                            <td className="middle nowrap text-right" style={{ fontFamily: '"Courier New"  !important' }}>
                              {parseToRp(retur)}
                            </td>
                            <td className="middle nowrap text-right" style={{ fontFamily: '"Courier New"  !important' }}>
                              {parseToRp(jmlBonus)}
                            </td>
                            <td className="middle nowrap text-right" style={{ fontFamily: '"Courier New"  !important' }}>
                              {parseToRp(sisa)}
                            </td>
                            {/* <td className="middle nowrap text-right" style={{ fontFamily: '"Courier New"  !important' }}>
                              {parseToRp(ppn)}
                            </td> */}
                            <td className="middle nowrap text-right" style={{ fontFamily: '"Courier New"  !important' }}>
                              {parseToRp(subtotal)}
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
                    { colSpan: 5, label: "TOTAL", className: "text-left" },
                    // { colSpan: 1, label: parseToRp(totalMarginPerHalaman) },
                    // { colSpan: 1, label: parseToRp(totalDiskon1PerHalaman) },
                    // { colSpan: 1, label: parseToRp(totalDisko2PerHalaman) },
                    { colSpan: 1, label: parseToRp(totalQtyBeliPerHalaman) },
                    { colSpan: 1, label: parseToRp(totalQtyReturPerHalaman) },
                    { colSpan: 1, label: parseToRp(totalQtyBonusPerHalaman) },
                    { colSpan: 1, label: parseToRp(totalQtySisaPerHalaman) },
                    { colSpan: 1, label: parseToRp(totalAmountPerHalaman) },
                  ],
                },
              ]}
            />
            <table width="100%" style={{ letterSpacing: 5, fontFamily: '"Courier New"  !important', fontSize: "20pt" }}>
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
    poDetail: state.poReducer.dataReportDetail,
    receiveReportDetail: state.receiveReducer.dataReceiveReportDetail,
  };
};
export default connect(mapStateToProps)(Receive3plyId);
