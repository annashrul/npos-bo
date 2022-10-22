import React, { Component } from "react";
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import {
  FetchCashReportExcel,
  FetchCashReport,
  setUpdate,
  deleteCashTransaksi,
} from "redux/actions/masterdata/cash/cash.action";
import moment from "moment";
import {
  float,
  generateNo,
  getFetchWhere,
  getPeriode,
  getStorage,
  isEmptyOrUndefined,
  kassa,
  noData,
  parseToRp,
  setStorage,
  swallOption,
  toDate,
  toRp,
} from "../../../../helper";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import CashReportExcel from "components/App/modals/report/cash/form_cash_excel";
import Updates from "components/App/modals/report/cash/update";
import Otorisasi from "../../modals/otorisasi.modal";
import HeaderReportCommon from "../../common/HeaderReportCommon";
import SelectCommon from "../../common/SelectCommon";
import TableCommon from "../../common/TableCommon";
import ButtonActionCommon from "../../common/ButtonActionCommon";
import CompareLocationCommon from "../../common/CompareLocationCommon";
import { getKartuKasAction } from "../../../../redux/actions/masterdata/cash/cash.action";

const kassStorage = "kassaReportKas";
const typeStorage = "typeReportKas";

class LaporanArusKas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment(new Date()).format("yyyy-MM-DD"),
      endDate: moment(new Date()).format("yyyy-MM-DD"),
    };
    this.handleService = this.handleService.bind(this);
  }

  handlePageChange(pageNumber) {
    this.handleService(this.state.where_data, pageNumber);
  }
  handleService(res, page = 1) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      let state = {};
      Object.assign(state, { where_data: where });
      this.setState(state);
      this.props.dispatch(getKartuKasAction(where));
    }
  }

  render() {
    const { total, per_page, current_page, data, totalData } =
      this.props.dataKartuKas;
    let total_perpage = 0;
    const head = [
      { rowSpan: 2, label: "No", className: "text-center", width: "1%" },
      { rowSpan: 2, label: "Kode", width: "1%" },
      { colSpan: 3, label: "Saldo", width: "1%" },
      { rowSpan: 2, label: "Keterangan" },
      { rowSpan: 2, label: "Tanggal", width: "1%" },
    ];

    const rowSpan = [
      { label: "Masuk" },
      { label: "Keluar" },
      { label: "Total" },
    ];
    let saldo = 0;
    let totalSaldo = 0;
    let totalMasuk = 0;
    let totalKeluar = 0;
    return (
      <div>
        <HeaderReportCommon
          pathName="ReportArusKas"
          callbackWhere={(res) => {
            this.handleService(res);
          }}
        />

        <TableCommon
          head={head}
          rowSpan={rowSpan}
          meta={{
            total: total,
            current_page: current_page,
            per_page: per_page,
          }}
          current_page={current_page}
          callbackPage={this.handlePageChange.bind(this)}
          renderRow={
            typeof data === "object"
              ? data.length > 0
                ? data.map((v, i) => {
                    console.log(i, data.length);
                    // saldo += Number(v.masuk) - Number(v.keluar);
                    totalMasuk += Number(v.masuk);
                    totalKeluar += Number(v.keluar);
                    totalSaldo += Number(v.saldo);
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">
                          {generateNo(i, current_page)}
                        </td>
                        <td className="middle nowrap">{v.kd_kas}</td>
                        <td className="middle nowrap text-right">
                          {parseToRp(Number(v.masuk))}
                        </td>
                        <td className="middle nowrap text-right">
                          {parseToRp(Number(v.keluar))}
                        </td>
                        <td className="middle nowrap text-right">
                          {parseToRp(Number(v.saldo))}
                        </td>
                        <td className="middle nowrap">{v.keterangan}</td>
                        <td className="middle nowrap">
                          {moment(v.created_at).format("LLLL")}
                        </td>
                      </tr>
                    );
                  })
                : noData(head.length + rowSpan.length)
              : noData(head.length + rowSpan.length)
          }
          footer={[
            // {
            //   data: [
            //     {
            //       colSpan: 2,
            //       label: "Total perhalaman",
            //       className: "text-left",
            //     },
            //     { colSpan: 1, label: parseToRp(totalMasuk) },
            //     { colSpan: 1, label: parseToRp(totalKeluar) },
            //     { colSpan: 1, label: parseToRp(totalSaldo) },
            //     { colSpan: 2, label: "" },
            //   ],
            // },
            {
              data: [
                {
                  colSpan: 2,
                  label: "Total keseluruhan",
                  className: "text-left",
                },
                {
                  colSpan: 1,
                  label: parseToRp(
                    totalData && data.length > 0 ? totalData.masuk : 0
                  ),
                },
                {
                  colSpan: 1,
                  label: parseToRp(
                    totalData && data.length > 0 ? totalData.keluar : 0
                  ),
                },
                {
                  colSpan: 1,
                  label: parseToRp(
                    totalData && data.length > 0
                      ? Number(totalData.masuk) - Number(totalData.keluar)
                      : 0
                  ),
                },
                { colSpan: 2, label: "" },
              ],
            },
          ]}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataKartuKas: state.cashReducer.dataKartuKas,
    auth: state.auth,
    isOpen: state.modalReducer,
  };
};

export default connect(mapStateToProps)(LaporanArusKas);
