import { NILAI_PERSEDIAAN_REPORT } from "../../../actions/_constants";

const initialState = {
  isLoading: false,
  isLoadingDetailSatuan: false,
  download: 0,
  status: "",
  msg: "",
  data: [],
  dataDetailSatuan: [],
  dataDetailTransaksi: [],
  report_excel: [],
};

export const nilai_persediaanReportReducer = (state = initialState, action) => {
  switch (action.type) {
    case NILAI_PERSEDIAAN_REPORT.SUCCESS:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    case NILAI_PERSEDIAAN_REPORT.SUCCESS_EXCEL:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        report_excel: action.data.result,
      });
    case NILAI_PERSEDIAAN_REPORT.DETAIL_SATUAN:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        dataDetailSatuan: action.data.result,
      });
    case NILAI_PERSEDIAAN_REPORT.DETAIL_TRANSAKSI:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        dataDetailTransaksi: action.data.result,
      });
    case NILAI_PERSEDIAAN_REPORT.FAILED:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    case NILAI_PERSEDIAAN_REPORT.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });
    case NILAI_PERSEDIAAN_REPORT.LOADING_DETAIL_SATUAN:
      return Object.assign({}, state, {
        isLoadingDetailSatuan: action.load,
      });
    case NILAI_PERSEDIAAN_REPORT.DOWNLOAD:
      return Object.assign({}, state, {
        download: action.load,
      });
    default:
      return state;
  }
};
