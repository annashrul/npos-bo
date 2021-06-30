import { ADJUSTMENT } from "../../actions/_constants";

const initialState = {
  isLoading: true,
  isLoadingDetailSatuan: false,
  download: 0,
  status: "",
  msg: "",
  total: { total_dn: 0, total_stock_awal: 0, total_stock_masuk: 0, total_stock_keluar: 0, total_stock_akhir: 0 },
  data: [],
  dataExcel: [],
  dataDetailSatuan: [],
  dataDetailTransaksi: [],
  get_code: "-",
};

export const adjustmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADJUSTMENT.GET_CODE:
      return Object.assign({}, state, {
        get_code: action.data.result,
      });
    case ADJUSTMENT.EXCEL:
      return Object.assign({}, state, {
        dataExcel: action.data.result,
      });
    case ADJUSTMENT.SUCCESS:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
        total: action.data.result.total,
      });
    case ADJUSTMENT.DETAIL_SATUAN:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        dataDetailSatuan: action.data.result,
      });
    case ADJUSTMENT.DETAIL_TRANSAKSI:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        dataDetailTransaksi: action.data.result,
      });
    case ADJUSTMENT.FAILED:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    case ADJUSTMENT.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });
    case ADJUSTMENT.LOADING_DETAIL_SATUAN:
      return Object.assign({}, state, {
        isLoadingDetailSatuan: action.load,
      });
    case ADJUSTMENT.DOWNLOAD:
      return Object.assign({}, state, {
        download: action.load,
      });
    default:
      return state;
  }
};
