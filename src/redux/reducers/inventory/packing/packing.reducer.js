import { PACKING } from "../../../actions/_constants";

const initialState = {
  download: 0,
  isLoading: false,
  data: [],
  msg: "",
  status: "",
  code: "-",
  data_trx: [],
  packing_detail: [],
  report: [],
  report_excel: [],
};

export const packingReducer = (state = initialState, action) => {
  switch (action.type) {
    case PACKING.SUCCESS:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        report: action.data.result,
      });
    case PACKING.SUCCESS_EXCEL:
      return Object.assign({}, state, {
        report_excel: action.data.result,
      });
    case PACKING.GET_BARANG_SUCCESS:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    case PACKING.GET_BARANG_SUCCESS_TRX:
      return Object.assign({}, state, {
        data_trx: action.data.result,
      });
    case PACKING.SUCCESS_DETAIL:
      return Object.assign({}, state, {
        packing_detail: action.data.result,
      });
    case PACKING.GET_CODE:
      return Object.assign({}, state, {
        code: action.data.result,
      });
    case PACKING.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });
    case PACKING.DOWNLOAD:
      return Object.assign({}, state, {
        download: action.load,
      });

    default:
      return state;
  }
};
