import React, { Component } from "react";
import ReactPDF, {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { parseToRp, toRp } from "../../../../helper";
// Create styles
const borderColor = "black";

const styles = StyleSheet.create({
  page: {
    // fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    lineHeight: 1.5,
    flexDirection: "column",
    fontStyle: "bold",
  },
  em: {
    fontStyle: "bold",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    display: "flex",
    flexDirection: "column",
    marginVertical: 12,
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
  },
  cell: {
    borderWidth: 1,
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    flexWrap: "wrap",
  },
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 24,
    borderTop: "1px solid black",
    borderRight: "1px solid black",
    borderLeft: "1px solid black",
  },
  container: {
    flexDirection: "row",
    borderBottom: "1px solid black",
    // backgroundColor: "grey",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    // height: 24,
    // textAlign: "left",
    fontStyle: "bold",
    flexGrow: 1,
  },
  no: {
    textAlign: "center",
    width: "5%",
    // borderRightColor: borderColor,
    // borderRightWidth: 1,
    color: "black",
  },
  sku: {
    width: "15%",
    // borderRightColor: borderColor,
    // borderRightWidth: 1,
    textAlign: "center",
    color: "black",
  },
  nama: {
    width: "20%",
    // borderRightColor: borderColor,
    // borderRightWidth: 1,
    textAlign: "center",
    color: "black",
  },
  motif: {
    width: "10%",
    // borderRightColor: borderColor,
    // borderRightWidth: 1,
    textAlign: "center",
    color: "black",
  },
  qty: {
    width: "10%",
    // borderRightColor: borderColor,
    // borderRightWidth: 1,
    textAlign: "center",
    color: "black",
  },
  harga: {
    width: "20%",
    // borderRightColor: borderColor,
    // borderRightWidth: 1,
    textAlign: "center",
    color: "black",
  },
  jumlah: {
    width: "20%",
    textAlign: "center",
    color: "black",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 24,
    fontStyle: "bold",
  },
  rowNo: {
    width: "5%",
    textAlign: "center",
    borderBottom: "1px solid black",
  },
  rowSKU: {
    width: "15%",
    textAlign: "center",
    borderBottom: "1px solid black",
  },
  rowNama: {
    width: "20%",
    textAlign: "center",
    borderBottom: "1px solid black",
  },
  rowMotif: {
    width: "10%",
    textAlign: "center",
    borderBottom: "1px solid black",
  },
  rowQty: {
    width: "10%",
    textAlign: "center",
    borderBottom: "1px solid black",
  },
  rowHarga: {
    width: "20%",
    textAlign: "center",
    borderBottom: "1px solid black",
  },
  rowJumlah: {
    width: "20%",
    textAlign: "center",
    borderBottom: "1px solid black",
  },

  header1: {
    flexDirection: "row",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    fontStyle: "bold",
    backgroundColor: "#a1887f",
  },
  header2: {
    // marginTop: "5px",
    flexDirection: "row",
    // borderBottomColor: "black",
    // borderBottomWidth: 1,
    backgroundColor: "#a1887f",
    alignItems: "center",
    height: 24,
    fontStyle: "bold",
  },
  fontHeader: {
    width: "100%",
    textAlign: "center",
  },
});
const newDatas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

class MyDocument extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.isReport ? "aya" : "eweh");

    const { master, detail } = this.props;
    if (this.props.isReport) {
      let splitPenerima = master.penerima.split("|");
      let splitPengirim = master.pengirim.split("|");
      Object.assign(master, {
        nama_penerima: splitPenerima[0],
        no_telepon_penerima: splitPenerima[1],
        alamat_penerima: splitPenerima[2],
        nama_pengirim: splitPengirim[0],
        no_telepon_pengirim: splitPengirim[1],
        alamat_pengirim: splitPengirim[2],
      });
    }
    let totalQty = 0;
    let totalTrx = 0;
    return (
      <Document>
        <Page style={styles.page} size="A4" wrap>
          <View style={styles.tableContainer}>
            <View style={styles.header1}>
              <Text style={styles.fontHeader}>SURAT MASUK BARANG</Text>
            </View>
            <View style={styles.header2}>
              <Text style={styles.fontHeader}>MORP APPAREL</Text>
            </View>
            <View
              style={{
                // paddingRight: 8,
                paddingTop: 8,
                paddingBottom: 12,
                flexDirection: "row",
                width: "100%",
                justifyContent: "flex-end",
              }}
            >
              <Text style={{ backgroundColor: "#a1887f", padding: 5 }}>
                Tanggal: 11/10/2022
              </Text>
            </View>
            <View
              style={{
                paddingLeft: 8,
                paddingRight: 8,
                paddingBottom: 8,
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ width: "30%" }}>
                <Text
                  style={{
                    textAlign: "left",
                    borderBottom: "1px solid black",
                    marginBottom: "5px",
                  }}
                >
                  Penerima
                </Text>
                <Text style={{ textAlign: "left" }}>
                  {master.nama_penerima}
                </Text>
                <Text style={{ textAlign: "left" }}>
                  {master.alamat_penerima}
                </Text>
                <Text style={{ textAlign: "left" }}>
                  Telp. {master.no_telepon_penerima}
                </Text>
              </View>
              <View style={{ width: "40%" }}>
                <Text
                  style={{
                    textAlign: "left",
                    borderBottom: "1px solid black",
                    marginBottom: "5px",
                  }}
                >
                  &nbsp;
                </Text>
              </View>
              <View style={{ width: "30%" }}>
                <Text
                  style={{
                    textAlign: "left",
                    borderBottom: "1px solid black",
                    marginBottom: "5px",
                  }}
                >
                  Pengirim
                </Text>
                <Text style={{ textAlign: "left" }}>
                  {master.nama_pengirim}
                </Text>
                <Text style={{ textAlign: "left" }}>
                  {master.alamat_pengirim}
                </Text>
                <Text style={{ textAlign: "left" }}>
                  Telp. {master.no_telepon_pengirim}
                </Text>
              </View>
            </View>

            <View style={styles.container}>
              <Text style={styles.no}>NO</Text>
              <Text style={styles.sku}>SKU</Text>
              <Text style={styles.nama}>NAMA</Text>
              <Text style={styles.motif}>MOTIF</Text>
              <Text style={styles.qty}>QTY</Text>
              <Text style={styles.harga}>HARGA</Text>
              <Text style={styles.jumlah}>JUMLAH</Text>
            </View>
            {detail.map((res, i) => {
              totalQty += Number(res.qty);
              totalTrx += Number(res.qty) * Number(res.harga);
              return (
                <View style={styles.row} key={i}>
                  <Text style={styles.rowNo}>{i + 1}</Text>
                  <Text style={styles.rowSKU}>{res.sku}</Text>
                  <Text style={styles.rowNama}>{res.nama}</Text>
                  <Text style={styles.rowMotif}>{res.motif}</Text>
                  <Text style={styles.rowQty}>{parseToRp(res.qty)}</Text>
                  <Text style={styles.rowHarga}>{parseToRp(res.harga)}</Text>
                  <Text style={styles.rowJumlah}>
                    {parseToRp(Number(res.qty) * Number(res.harga))}
                  </Text>
                </View>
              );
            })}
          </View>
          <View
            style={{
              backgroundColor: "grey",
              borderBottom: "1px solid grey",
              borderLeft: "1px solid grey",
              borderRight: "1px solid grey",
              width: "100%",
              //   marginBottom: "10px",
              flexDirection: "row",
              flexWrap: "wrap",
              color: "white",
            }}
          >
            <Text
              style={{
                paddingTop: 5,
                width: "50%",
                textAlign: "center",
                color: "white",
              }}
            >
              JUMLAH
            </Text>
            <Text
              style={{
                paddingTop: 5,
                width: "10%",
                textAlign: "center",

                color: "white",
              }}
            >
              {parseToRp(totalQty)}
            </Text>
            <Text
              style={{
                width: "20%",
              }}
            ></Text>
            <Text
              style={{
                paddingTop: 5,
                width: "20%",
                textAlign: "center",
                color: "white",
              }}
            >
              {parseToRp(totalTrx)}
            </Text>
          </View>
          <View
            style={{
              paddingTop: 8,
              paddingLeft: 8,
              paddingRight: 8,
              paddingBottom: 8,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ width: "20%" }}>
              <Text
                style={{
                  textAlign: "center",
                }}
              >
                Penerima
              </Text>
              <Text style={{ textAlign: "left", height: "30px" }}></Text>
              <Text style={{ textAlign: "center" }}>Morp Apparel</Text>
            </View>
            <View style={{ width: "40%" }}>
              <Text
                style={{
                  textAlign: "left",
                  marginBottom: "5px",
                }}
              >
                &nbsp;
              </Text>
            </View>
            <View style={{ width: "30%" }}>
              <Text
                style={{
                  textAlign: "center",
                }}
              >
                Hormat Kami,
              </Text>
              <Text style={{ textAlign: "left", height: "30px" }}></Text>
              <Text style={{ textAlign: "center" }}>Elz Calza</Text>
            </View>
          </View>
        </Page>
      </Document>
    );
  }
}
export default MyDocument;
