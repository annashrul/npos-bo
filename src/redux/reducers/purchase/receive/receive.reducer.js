import { RECEIVE } from "../../../actions/_constants";

const initialState = {
  download: 0,
  isLoading: false,
  isLoadingReportDetail: false,
  persenDl: 0,
  data: [],
  dataReceiveReportDetail: [],
  receiveReport: [],
  receiveReportExcel: [],
  receiveReportDetail: [],
  msg: "",
  status: "",
  receive_data: [],
  code: "-",
};

export const receiveReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE.SUCCESS:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
        total: action.data.result.total,
      });
    case RECEIVE.RECEIVE_DATA:
      return Object.assign({}, state, {
        receive_data: action.data.result,
      });
    case RECEIVE.SUCCESS_CODE:
      return Object.assign({}, state, {
        code: action.data.result,
      });
    case RECEIVE.SUCCESS_PERSEN:
      return Object.assign({}, state, {
        persenDl: action.data,
      });
    // case RECEIVE.RECEIVE_DATA:
    //     return Object.assign({}, state, {
    //         status: action.data.status,
    //         msg: action.data.msg,
    //         data: action.data.result,
    //     });
    case RECEIVE.RECEIVE_REPORT_DETAIL:
      console.log("reducer", action.data.result);
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        dataReceiveReportDetail: action.data.result,
      });
    case RECEIVE.RECEIVE_REPORT_EXCEL:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        receiveReportExcel: action.data.result,
      });
    case RECEIVE.FAILED:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    case RECEIVE.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });
    case RECEIVE.LOADING_REPORT_DETAIL:
      return Object.assign({}, state, {
        isLoadingReportDetail: action.load,
      });
    case RECEIVE.DOWNLOAD:
      return Object.assign({}, state, {
        download: action.load,
      });
    default:
      return state;
  }
};
