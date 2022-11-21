import React, { Component } from "react";
import Layout from "./layout";
import connect from "react-redux/es/connect/connect";
import { toRp } from "helper";
import Barcode from "react-barcode";
import { FetchReportDetailSale } from "redux/actions/sale/sale.action";
import { isEmpty } from "lodash";
import moment from "moment";
import { noData } from "../../../helper";
class Print3ply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      master: [],
      nota: "",
      alamat: "",
      lokasi: "",
      newLogo: "",
    };

    this.props.dispatch(FetchReportDetailSale(this.props.match.params.id));
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const getData = nextProps.detailSale;

    this.setState({
      data: isEmpty(getData) ? [] : getData.detail,
      master: getData,
      nota: getData.kd_trx,
      lokasi: getData.lokasi,
      alamat: getData.alamat,
    });
  }

  getLogo() {
    const simg = document.getElementsByClassName("selected__img");
    const src = simg[0].src;
    return src;
  }

  render() {
    const { master, data, nota, alamat, lokasi } = this.state;
    if (this.state.newLogo === "") {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.setState({ newLogo: reader.result });
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.open("GET", localStorage.getItem("logos"));
      xhr.responseType = "blob";
      xhr.send();
    }
    // let gt=0;
    // let dp=0;
    // let pj=0;
    return (
      <Layout>
        <div id="print_3ply">
          <table style={{ height: "5cm", position: "relative" }} width="100%" cellSpacing={0} cellPadding={1}>
            <thead>
              <tr>
                <td colSpan={3} style={{ textAlign: "center" }}></td>
                <td colSpan={5} style={{ textAlign: "right" }}>
                  {nota !== undefined && nota !== "" ? <Barcode width={2} height={25} format={"CODE128"} displayValue={false} value={nota} /> : null}
                </td>
              </tr>
              <tr>
                <td rowSpan={3} colSpan={3} style={{ textAlign: "center" }}>
                  <img className="img_head" style={{ padding: "10px" }} alt="LOGO" src={this.state.newLogo} />
                </td>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  <strong>{lokasi}</strong>
                </td>
              </tr>
              <tr>
                {/* <td colSpan={5} style={{ textAlign: "center" }}>
                  {alamat}
                </td> */}
              </tr>
              <tr>
                <td colSpan={5} style={{ textAlign: "center", bordeColor: "black", borderBottom: "solid", borderWidth: "thin" }}>
                  NOTA PENJUALAN
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
                <td>{moment(master.tgl).format("YYYY-MM-DD")}</td>
                <td>Kode Trx</td>
                <td>:</td>
                <td>{nota}</td>
              </tr>
              <tr>
                <th />
                <td>Customer</td>
                <td>:</td>
                <td>{master.customer}</td>
                <td>Operator</td>
                <td>:</td>
                <td>{master.operator}</td>
              </tr>
              <tr>
                <th />
                <td>Jenis Trx</td>
                <td>:</td>
                <td>{master.jenis_trx}</td>
                <td>Keterangan</td>
                <td>:</td>
                <td>{master.keterangan}</td>
              </tr>
            </tbody>
          </table>
          <table width="99%">
            <thead>
              <tr style={{border:"1px solid black",borderWidth: "thin"}}>
                <th  style={{border:"1px solid black",borderWidth: "thin"}} className="tengah">KODE BARANG</th>
                <th style={{border:"1px solid black",borderWidth: "thin"}} className="tengah">NAMA BARANG</th>
                <th  style={{border:"1px solid black",borderWidth: "thin"}} className="tengah">VARIASI</th>
                <th  style={{border:"1px solid black",borderWidth: "thin"}} className="tengah">QTY</th>
                <th  style={{border:"1px solid black",borderWidth: "thin"}} className="tengah">HARGA @ Rp</th>
                <th   style={{border:"1px solid black",borderWidth: "thin"}}className="tengah">Diskon(%)</th>
                <th   style={{border:"1px solid black",borderWidth: "thin"}}className="tengah">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0
                ? data.map((item, key) => {
                  return (
                    <tr key={key}>
                      <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-center">
                        {item.sku}
                      </td>
                      <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-center">
                        {item.nm_brg}
                      </td>
                      <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-center">
                        {item.ukuran}
                      </td>
                      <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-center">
                        {item.qty} {item.satuan}
                      </td>
                      <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt", paddingRight: "5pt" }} className="text-center">
                        {toRp(parseInt(item.hrg_jual, 10))}
                      </td>
                      <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt" }} className="text-center">
                        {item.dis_persen}
                      </td>
                      <td style={{ border: "solid", borderWidth: "thin", paddingLeft: "5pt", paddingRight: "5pt" }} className="text-center">
                        {toRp(parseInt(item.subtotal, 10))}
                      </td>
                    </tr>
                  );
                })
                : noData(7)}
            </tbody>
            <tbody>
              <tr>
                <th colSpan={4}> </th>
                <th className="kanan">Total Rp.</th>
                <th style={{ paddingRight: "5pt" }} className="text-right">
                  {toRp(master.st)}
                </th>
              </tr>
              <tr>
                <th colSpan={4}> </th>
                <th className="kanan">Diskon Rp.</th>
                <th style={{ paddingRight: "5pt" }} className="text-right">
                  {toRp(master.dis_rp)}
                </th>
              </tr>
              <tr>
                <th colSpan={4}> </th>
                <th className="kanan">Pajak Rp.</th>
                <th style={{ paddingRight: "5pt" }} className="text-right">
                  {toRp((parseInt(master.st, 10) * master.tax) / 100)}
                </th>
              </tr>
              <tr>
                <th colSpan={4}> </th>
                <th className="kanan">Grand Total Rp.</th>
                <th style={{ paddingRight: "5pt" }} className="text-right">
                  {toRp(master.gt)}
                </th>
              </tr>
            </tbody>
          </table>
          <table width="100%" style={{ marginTop: "0.5cm" }}>
            <thead>
              <tr>
                <th className="isi atas tengah borderTB borderLR" style={{ width: "3cm" }}>
                  Tanda Terima,
                </th>
                <th className="isi tengah" style={{ width: "4cm" }}>
                  Barang yang sudah dibeli tidak dapat ditukar/dikembalikan
                </th>
                <th className="isi atas tengah borderTB borderLR" style={{ width: "3cm" }}>
                  Hormat kami,
                </th>
              </tr>
              <tr>
                <td className="borderLR borderTB tengah" style={{ height: "2cm" }}>
                  (_____________)
                </td>
                <td className="borderLR borderTB" />
                <td className="borderLR borderTB tengah">(_____________)</td>
              </tr>
            </thead>
          </table>
          <br></br>
          <br></br>
          <table width="100%" style={{ marginTop: "0.5cm" }}>
            <thead>
              <tr>
                <th className="isi atas tengah borderTB borderLR" style={{ width: "3cm" }}>
                  Penerima,
                </th>
                <th className="isi tengah" style={{ width: "4cm" }}>-                </th>
                <th className="isi atas tengah borderTB borderLR" style={{ width: "3cm" }}>
                  Pengirim,
                </th>
              </tr>
              <tr>
                <td className=" text-center borderLR borderTB tengah" style={{ height: "2cm" }}>
                  <td style={{width: "20cm",textAlign:"center"}} >{master.nama_penerima}</td><br></br>
                  <td style={{width: "20cm",textAlign:"center"}}>{master.no_telepon_penerima}</td><br></br>
                  <td style={{width: "20cm",textAlign:"center"}}>{master.alamat_penerima}</td>
                </td>
                <td className="text-center borderLR borderTB" />
                <td className="borderLR borderTB tengah">
                  <td style={{width: "20cm",textAlign:"center"}}>{master.nama_pengirim}</td><br></br>
                  <td style={{width: "20cm",textAlign:"center"}}>{master.no_telepon_pengirim}</td><br></br>
                  <td style={{width: "20cm",textAlign:"center"}}>{master.alamat_pengirim}</td>
                </td>
              </tr>
            </thead>
          </table>
        </div>
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    detailSale: state.saleReducer.dataDetail,
    isLoadingDetail: state.saleReducer.isLoadingDetail,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(Print3ply);
