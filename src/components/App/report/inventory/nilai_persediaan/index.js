import React, { Component } from "react";
import Layout from "components/App/Layout";
import { FetchNilaiPersediaanReport } from "redux/actions/report/inventory/nilai_persediaan_report.action";
import connect from "react-redux/es/connect/connect";
import { float, generateNo, getFetchWhere, noData, parseToRp } from "../../../../../helper";
import TableCommon from "../../../common/TableCommon";
import HeaderReportCommon from "../../../common/HeaderReportCommon";

class NilaiPersediaanReport extends Component {
    constructor(props) {
        super(props);
        this.handleService = this.handleService.bind(this);
        this.state = {
            where_data: `page=1`,
            bukaHarga: true,
        };
    }
    handlePageChange(pageNumber) {
        this.handleService(this.state.where_data, pageNumber);
    }
    handleService(res, page = 1) {
        if (res !== undefined) {
            let where = getFetchWhere(res, page);
            this.setState({ where_data: where });
            this.props.dispatch(FetchNilaiPersediaanReport(where));
        }
    }

    render() {
        const { per_page, last_page, current_page, data, total, total_persediaan } = this.props.nilai_persediaanReport;

        let totalNilaiPersediaanStockPerHalaman = 0;
        let totalNilaiPersediaanHrgBeliPerHalaman = 0;
        let total_nilai_persediaan_harga = 0;
        let total_nilai_persediaan_harga2 = 0;
        let total_nilai_persediaan_harga3 = 0;
        let total_nilai_persediaan_harga4 = 0;
        let total_nilai_persediaan_harga5 = 0;
        let total_nilai_persediaan_harga6 = 0;
        let total_nilai_persediaan_harga7 = 0;
        let total_nilai_persediaan_harga8 = 0;
        let total_nilai_persediaan_harga9 = 0;
        let total_nilai_persediaan_harga10 = 0;



        let total_nilai_persediaan_total_harga_1 = 0;
        let total_nilai_persediaan_total_harga_2 = 0;
        let total_nilai_persediaan_total_harga_3 = 0;
        let total_nilai_persediaan_total_harga_4 = 0;
        let total_nilai_persediaan_total_harga_5 = 0;
        let total_nilai_persediaan_total_harga_6 = 0;
        let total_nilai_persediaan_total_harga_7 = 0;
        let total_nilai_persediaan_total_harga_8 = 0;
        let total_nilai_persediaan_total_harga_9 = 0;
        let total_nilai_persediaan_total_harga_10 = 0;
        let total_nilai_persediaan_total_harga_beli = 0;

        let totalNilaiPersediaanHarga;

        const { bukaHarga } = this.state;
        const propsUser = this.props.auth.user;
        const setHarga = propsUser.set_harga;

        let head = [
            { rowSpan: "2", label: "No", className: "text-center", width: "1%" },
            { rowSpan: "2", colSpan: "1", label: "Kode Barang", width: "1%" },
            { rowSpan: "2", colSpan: "1", label: "Barcode", width: "1%" },
            { rowSpan: "2", colSpan: "1", label: "Nama Barang" },
            { rowSpan: "2", colSpan: "1", label: "Lokasi", width: "1%" },
            { rowSpan: "2", colSpan: "1", label: "Satuan", width: "1%" },
        ];

        let colPerHalaman=[];


        let colOrRow = { colSpan: setHarga };
        setHarga === 1 && Object.assign(colOrRow, { rowSpan: "2" });

        bukaHarga && head.push({ rowSpan: "2", colSpan: "1", label: "Harga Beli", width: "1%" });
        bukaHarga && head.push({ ...colOrRow, label: "Harga Jual", width: "1%" });
        head.push({ rowSpan: "2", colSpan: "1", label: "Stok", width: "1%" });
        bukaHarga && head.push({ rowSpan: "2", colSpan: "1", label: "Total Harga Beli", width: "1%" });
        let rowSpan = [];

        if (setHarga > 1 && propsUser.nama_harga !== undefined) {
            for (let i = 0; i < setHarga; i++) {
                colPerHalaman.push({
                    colSpan: 1,
                    label: 0,
                    className: `text-right ${bukaHarga ? "" : "dNone"}`,
                })

                bukaHarga && rowSpan.push({ label: propsUser.nama_harga[i][`harga${i + 1}`] });
            }
        }

        let bukaSetHarga = [];
        for (let i = 0; i < setHarga; i++) {
            bukaSetHarga.push(i);
            // console.log(totalNilaiPersediaanHarga[i+1])
        }


        return (
            <Layout page="Laporan Nilai Persediaan">
              <HeaderReportCommon pathName="ReportNilaiPersediaan" callbackWhere={this.handleService} isLocation={true} isPeriode={false} isSelectedLocationFirstIndex={true} placeholder="Nama/Barcode/Kode Barang" col="col-md-3" />
              <TableCommon
                  head={head}
                  rowSpan={rowSpan}
                  meta={{ total: total, current_page: current_page, per_page: per_page }}
                  current_page={current_page}
                  callbackPage={this.handlePageChange.bind(this)}
                  renderRow={
                      typeof data === "object" ? data.map((v, i) => {


                              const nilai_persediaan_stock = float(v.stock);
                              const nilai_persediaan_hrg_beli = float(v.hrg_beli);
                              const nilai_persediaan_harga = float(v.harga);
                              const nilai_persediaan_harga2 = float(v.harga2);
                              const nilai_persediaan_harga3 = float(v.harga3);
                              const nilai_persediaan_harga4 = float(v.harga4);
                              const nilai_persediaan_total_harga_1 = float(v.total_harga_1);
                              const nilai_persediaan_total_harga_2 = float(v.total_harga_2);
                              const nilai_persediaan_total_harga_3 = float(v.total_harga_3);
                              const nilai_persediaan_total_harga_4 = float(v.total_harga_4);
                              const nilai_persediaan_total_harga_beli = float(v.total_harga_beli);
                              totalNilaiPersediaanStockPerHalaman += nilai_persediaan_stock;
                              totalNilaiPersediaanHrgBeliPerHalaman += nilai_persediaan_hrg_beli;
                              total_nilai_persediaan_harga += nilai_persediaan_harga;
                              total_nilai_persediaan_harga2 += nilai_persediaan_harga2;
                              total_nilai_persediaan_harga3 += nilai_persediaan_harga3;
                              total_nilai_persediaan_harga4 += nilai_persediaan_harga4;
                              total_nilai_persediaan_total_harga_1 += nilai_persediaan_total_harga_1;
                              total_nilai_persediaan_total_harga_2 += nilai_persediaan_total_harga_2;
                              total_nilai_persediaan_total_harga_3 += nilai_persediaan_total_harga_3;
                              total_nilai_persediaan_total_harga_4 += nilai_persediaan_total_harga_4;
                              total_nilai_persediaan_total_harga_beli += nilai_persediaan_total_harga_beli;
                              return (
                                  <tr key={i}>
                                    <td className="text-center middle nowrap">{generateNo(i, current_page)}</td>
                                    <td className="middle nowrap">{v.kd_brg}</td>
                                    <td className="middle nowrap">{v.barcode}</td>
                                    <td className="middle nowrap">{v.nm_brg}</td>
                                    <td className="middle nowrap">{v.lokasi}</td>
                                    <td className="middle nowrap">{v.satuan}</td>
                                    <td className={`text-right middle nowrap ${bukaHarga ? "" : "dNone"}`}>{parseToRp(v.hrg_beli)}</td>
                                      {(() => {
                                          let tds = [];
                                          for (let i = 0; i < setHarga; i++) {
                                              tds.push(
                                                  <td key={i} className={`text-right middle nowrap ${bukaHarga ? "" : "dNone"}`}>
                                                      {parseToRp(v["harga" + (i === 0 ? "" : i + 1)])}
                                                  </td>
                                              );
                                          }
                                          return tds;
                                      })()}
                                    <td className="text-center middle nowrap">{v.stock}</td>
                                    <td className={`text-right middle nowrap ${bukaHarga ? "" : "dNone"}`}>{parseToRp(v.total_harga_beli)}</td>
                                  </tr>
                              );
                          })
                          : noData(head.length + rowSpan.length)
                  }
                  footer={[
                      {
                          data: [
                              {
                                  colSpan: 6,
                                  label: "Total perhalaman",
                                  className: "text-left",
                              },
                              {
                                  colSpan: 1,
                                  label: parseToRp(totalNilaiPersediaanHrgBeliPerHalaman),
                                  className: `text-right ${bukaHarga ? "" : "dNone"}`,
                              },

                              {
                                  colSpan: 1,
                                  label: parseToRp(total_nilai_persediaan_harga),
                                  className: `text-right ${bukaSetHarga[0] !== undefined && bukaHarga ? "" : "dNone"}`,
                              },
                              {
                                  colSpan: 1,
                                  label: parseToRp(total_nilai_persediaan_harga2),
                                  className: `text-right ${bukaSetHarga[1] !== undefined && bukaHarga ? "" : "dNone"}`,
                              },
                              {
                                  colSpan: 1,
                                  label: parseToRp(total_nilai_persediaan_harga3),
                                  className: `text-right ${bukaSetHarga[2] !== undefined && bukaHarga ? "" : "dNone"}`,
                              },
                              {
                                  colSpan: 1,
                                  label: parseToRp(total_nilai_persediaan_harga4),
                                  className: `text-right ${bukaSetHarga[3] !== undefined && bukaHarga ? "" : "dNone"}`,
                              },
                              {
                                  colSpan: 1,
                                  label: parseToRp(total_nilai_persediaan_harga5),
                                  className: `text-right ${bukaSetHarga[4] !== undefined && bukaHarga ? "" : "dNone"}`,
                              },
                              {
                                  colSpan: 1,
                                  label: parseToRp(total_nilai_persediaan_harga6),
                                  className: `text-right ${bukaSetHarga[5] !== undefined && bukaHarga ? "" : "dNone"}`,
                              },
                              {
                                  colSpan: 1,
                                  label: parseToRp(total_nilai_persediaan_harga7),
                                  className: `text-right ${bukaSetHarga[6] !== undefined && bukaHarga ? "" : "dNone"}`,
                              },
                              {
                                  colSpan: 1,
                                  label: parseToRp(total_nilai_persediaan_harga8),
                                  className: `text-right ${bukaSetHarga[7] !== undefined && bukaHarga ? "" : "dNone"}`,
                              },
                              {
                                  colSpan: 1,
                                  label: parseToRp(total_nilai_persediaan_harga9),
                                  className: `text-right ${bukaSetHarga[8] !== undefined && bukaHarga ? "" : "dNone"}`,
                              },
                              {
                                  colSpan: 1,
                                  label: parseToRp(total_nilai_persediaan_harga10),
                                  className: `text-right ${bukaSetHarga[9] !== undefined && bukaHarga ? "" : "dNone"}`,
                              },
                              {
                                  colSpan: 1,
                                  label: parseInt(totalNilaiPersediaanStockPerHalaman),
                                  className: `text-center`,
                              },
                              {
                                  colSpan: 1,
                                  label: parseToRp(total_nilai_persediaan_total_harga_beli),
                                  className: `text-right ${bukaHarga ? "" : "dNone"}`,
                              },
                          ],
                      },
                      {
                          data: [
                              {
                                  colSpan: 6,
                                  label: "Total keseluruhan",
                                  className: "text-left",
                              },
                              {
                                  colSpan: 1,
                                  label: parseToRp(total_persediaan === undefined ? 0 : total_persediaan.hrg_beli),
                                  className: `text-right ${bukaHarga ? "" : "dNone"}`,
                              },

                              {
                                  colSpan: 1,
                                  label: parseToRp(total_persediaan === undefined ? 0 : total_persediaan.harga),
                                  className: `text-right ${bukaSetHarga[0] !== undefined && bukaHarga ? "" : "dNone"}`,
                              },
                              {
                                  colSpan: 1,
                                  label: parseToRp(total_persediaan === undefined ? 0 : total_persediaan.harga2),
                                  className: `text-right ${bukaSetHarga[1] !== undefined && bukaHarga ? "" : "dNone"}`,
                              },
                              {
                                  colSpan: 1,
                                  label: parseToRp(total_persediaan === undefined ? 0 : total_persediaan.harga3),
                                  className: `text-right ${bukaSetHarga[2] !== undefined && bukaHarga ? "" : "dNone"}`,
                              },
                              {
                                  colSpan: 1,
                                  label: parseToRp(total_persediaan === undefined ? 0 : total_persediaan.harga4),
                                  className: `text-right ${bukaSetHarga[3] !== undefined && bukaHarga ? "" : "dNone"}`,
                              },
                              {
                                  colSpan: 1,
                                  label: parseToRp(0),
                                  className: `text-right ${bukaSetHarga[3] !== undefined && bukaHarga ? "" : "dNone"}`,
                              },
                              {
                                  colSpan: 1,
                                  label: parseToRp(0),
                                  className: `text-right ${bukaSetHarga[3] !== undefined && bukaHarga ? "" : "dNone"}`,
                              },
                              {
                                  colSpan: 1,
                                  label: parseToRp(0),
                                  className: `text-right ${bukaSetHarga[3] !== undefined && bukaHarga ? "" : "dNone"}`,
                              },
                              {
                                  colSpan: 1,
                                  label: parseToRp(0),
                                  className: `text-right ${bukaSetHarga[3] !== undefined && bukaHarga ? "" : "dNone"}`,
                              },
                              {
                                  colSpan: 1,
                                  label: parseToRp(total_persediaan === undefined ? 0 : total_persediaan.harga9),
                                  className: `text-right ${bukaSetHarga[3] !== undefined && bukaHarga ? "" : "dNone"}`,
                              },
                              {
                                  colSpan: 1,
                                  label: parseToRp(0),
                                  className: `text-right ${bukaSetHarga[3] !== undefined && bukaHarga ? "" : "dNone"}`,
                              },
                              {
                                  colSpan: 1,
                                  label: parseInt(total_persediaan === undefined ? 0 : total_persediaan.stock),
                                  className: `text-center`,
                              },
                              {
                                  colSpan: 1,
                                  label: parseToRp(total_persediaan === undefined ? 0 : total_persediaan.total_harga_beli),
                                  className: `text-right ${bukaHarga ? "" : "dNone"}`,
                              },

                              // {
                              //   colSpan: 1,
                              //   label: parseToRp(total_persediaan === undefined ? 0 : total_persediaan.total_harga_1),
                              //   className: `text-right ${bukaSetHarga[0] !== undefined && bukaHarga ? "" : "dNone"}`,
                              // },
                              // {
                              //   colSpan: 1,
                              //   label: parseToRp(total_persediaan === undefined ? 0 : total_persediaan.total_harga_2),
                              //   className: `text-right ${bukaSetHarga[1] !== undefined && bukaHarga ? "" : "dNone"}`,
                              // },
                              // {
                              //   colSpan: 1,
                              //   label: parseToRp(total_persediaan === undefined ? 0 : total_persediaan.total_harga_3),
                              //   className: `text-right ${bukaSetHarga[2] !== undefined && bukaHarga ? "" : "dNone"}`,
                              // },
                              // {
                              //   colSpan: 1,
                              //   label: parseToRp(total_persediaan === undefined ? 0 : total_persediaan.total_harga_4),
                              //   className: `text-right ${bukaSetHarga[3] !== undefined && bukaHarga ? "" : "dNone"}`,
                              // },
                          ],
                      },
                  ]}
              />
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        download: state.nilai_persediaanReportReducer.download,
        nilai_persediaanReport: state.nilai_persediaanReportReducer.data,
        nilai_persediaanReportExcel: state.nilai_persediaanReportReducer.report_excel,
        auth: state.auth,
        nilai_persediaanReportDetailSatuan: state.nilai_persediaanReportReducer.dataDetailSatuan,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    };
};
export default connect(mapStateToProps)(NilaiPersediaanReport);
