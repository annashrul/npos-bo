import { CASH } from "../../../actions/_constants";

const initialState = {
  isLoading: true,
  status: "",
  msg: "",
  data: [],
  currentPage: 0,
  dataExcel: [],
  per_page: 0,
  total: 0,
  dataReport: [],
  update_data: [],
  isLoadingReport: false,
  isSuccessTrx: false,
  dataKartuKas: [],
};

export const cashReducer = (state = initialState, action) => {
  switch (action.type) {
    case CASH.DATA_GET_KARTU_KAS:
      return Object.assign({}, state, {
        dataKartuKas: action.data.result,
      });
    case CASH.EXCEL_REPORT:
      return Object.assign({}, state, {
        dataExcel: action.data.result,
      });
    case CASH.UPDATE:
      return Object.assign({}, state, {
        update_data: action.data,
      });
    case CASH.SUCCESS_REPORT:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        dataReport: action.data.result,
      });
    case CASH.TRX_SUCCESS:
      return Object.assign({}, state, {
        isSuccessTrx: action.bool,
      });
    case CASH.SUCCESS:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    case CASH.FAILED:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    case CASH.LOADING_REPORT:
      return Object.assign({}, state, {
        isLoadingReport: action.load,
      });
    case CASH.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });
    default:
      return state;
  }
};
