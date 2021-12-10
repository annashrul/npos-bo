import { HUTANG } from "../../actions/_constants";

const initialState = {
  isLoading: false,
  isLoadingPost: false,
  status: "",
  msg: "",
  data: [],
  data_kartu_hutang: [],
  data_report: [],
  data_report_detail: [],
  report_excel: [],
  get_code: "-",
  download: 0,
};

export const hutangReducer = (state = initialState, action) => {
  switch (action.type) {
    case HUTANG.SUCCESS_REPORT:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data_report: action.data.result,
      });
    case HUTANG.SUCCESS_REPORT_DETAIL:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data_report_detail: action.data.result,
      });
    case HUTANG.SUCCESS_KARTU_HUTANG:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data_kartu_hutang: action.data.result,
      });
    case HUTANG.SUCCESS_EXCEL:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        report_excel: action.data.result,
      });
    case HUTANG.SUCCESS_CODE:
      return Object.assign({}, state, {
        get_code: action.data.result,
      });
    case HUTANG.SUCCESS:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    case HUTANG.FAILED:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    case HUTANG.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });
    case HUTANG.LOADING_POST:
      return Object.assign({}, state, {
        isLoadingPost: action.load,
      });
    case HUTANG.DOWNLOAD:
      return Object.assign({}, state, {
        download: action.load,
      });
    default:
      return state;
  }
};
