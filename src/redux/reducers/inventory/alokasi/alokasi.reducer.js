import { ALOKASI } from "../../../actions/_constants";

const initialState = {
  download: 0,
  isLoading: false,
  isLoadingDetail: false,
  data: [],
  msg: "",
  status: "",
  code: "-",
  alokasi_data: [],
  report: [],
  report_excel: [],
  report_data: [],
};

export const alokasiReducer = (state = initialState, action) => {
  switch (action.type) {
    case ALOKASI.SUCCESS:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
        // total: action.data.result.total
      });
    case ALOKASI.REPORT_SUCCESS:
      return Object.assign({}, state, {
        report: action.data.result,
        report_data: action.data.result.data,
      });
    case ALOKASI.SUCCESS_EXCEL:
      return Object.assign({}, state, {
        report_excel: action.data.result,
      });
    case ALOKASI.ALOKASI_DATA:
      return Object.assign({}, state, {
        alokasi_data: action.data.result,
      });
    case ALOKASI.SUCCESS_CODE:
      return Object.assign({}, state, {
        code: action.data.result,
      });
    case ALOKASI.FAILED:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    case ALOKASI.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });
    case ALOKASI.LOADING_DETAIL:
      return Object.assign({}, state, {
        isLoadingDetail: action.load,
      });
    case ALOKASI.DOWNLOAD:
      return Object.assign({}, state, {
        download: action.load,
      });
    default:
      return state;
  }
};
