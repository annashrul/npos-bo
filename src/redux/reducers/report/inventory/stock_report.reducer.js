import { STOCK_REPORT } from "../../../actions/_constants";

const initialState = {
  isLoading: false,
  isLoadingDetailSatuan: false,
  download: 0,
  status: "",
  msg: "",
  total_stock: { total_dn: 0, total_stock_awal: 0, total_stock_masuk: 0, total_stock_keluar: 0, total_stock_akhir: 0 },
  data: [],
  dataDetailSatuan: [],
  dataDetailTransaksi: [],
  report_excel: [],
};

export const stockReportReducer = (state = initialState, action) => {
  switch (action.type) {
    case STOCK_REPORT.SUCCESS:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
        total_stock: action.data.result.total_stock,
      });
    case STOCK_REPORT.SUCCESS_EXCEL:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        report_excel: action.data.result,
      });
    case STOCK_REPORT.DETAIL_SATUAN:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        dataDetailSatuan: action.data.result,
      });
    case STOCK_REPORT.DETAIL_TRANSAKSI:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        dataDetailTransaksi: action.data.result,
      });
    case STOCK_REPORT.FAILED:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    case STOCK_REPORT.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });
    case STOCK_REPORT.LOADING_DETAIL_SATUAN:
      return Object.assign({}, state, {
        isLoadingDetailSatuan: action.load,
      });
    case STOCK_REPORT.DOWNLOAD:
      return Object.assign({}, state, {
        download: action.load,
      });
    default:
      return state;
  }
};
