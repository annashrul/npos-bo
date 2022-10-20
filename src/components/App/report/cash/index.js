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
import TabCommon from "../../common/TabCommon";
import ReportTransactionCash from "./transaksi_kas";
import LaporanArusKas from "./arus_kas";
const kassStorage = "kassaReportKas";
const typeStorage = "typeReportKas";

class ReportCash extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleActive(res) {
    console.log(res);
    // if (res === 0) {
    //   this.handleService();
    //   this.props.dispatch(FetchRak("page=1&perpage=99999"));
    // } else if (res === 1) {
    //   this.props.dispatch(FetchPriceProduct("page=1"));
    // } else {
    //   this.props.dispatch(FetchGroupProduct("page=1"));
    // }
  }

  render() {
    return (
      <TabCommon
        path="laporan kas"
        tabHead={["Transaksi Kas", "Arus Kas"]}
        tabBody={[<ReportTransactionCash />, <LaporanArusKas />]}
        callbackActive={(res) => {
          this.handleActive(res);
        }}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cashReport: state.cashReducer.dataReport,
    cashReportExcel: state.cashReducer.dataExcel,
    isLoadingReport: state.cashReducer.isLoadingReport,
    auth: state.auth,
    isOpen: state.modalReducer,
  };
};

export default connect(mapStateToProps)(ReportCash);
