import { DN } from "../../../actions/_constants";

const initialState = {
  download: 0,
  isLoading: false,
  data: [],
  msg: "",
  status: "",
  code: "-",
  dn_data: [],
  dn_detail: [],
  report: [],
  report_excel: [],
  report_data: [],
};

export const dnReducer = (state = initialState, action) => {
  switch (action.type) {
    case DN.SUCCESS:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
        total: action.data.result.total,
      });
    case DN.REPORT_SUCCESS:
      return Object.assign({}, state, {
        report: action.data.result,
        report_data: action.data.result.data,
      });
    case DN.REPORT_SUCCESS_EXCEL:
      return Object.assign({}, state, {
        report_excel: action.data.result,
      });
    case DN.DN_DATA:
      return Object.assign({}, state, {
        dn_data: action.data.result,
      });
    case DN.DN_DETAIL:
      return Object.assign({}, state, {
        dn_detail: action.data.result,
      });
    case DN.SUCCESS_CODE:
      return Object.assign({}, state, {
        code: action.data.result,
      });
    case DN.FAILED:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    case DN.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });
    case DN.DOWNLOAD:
      return Object.assign({}, state, {
        download: action.load,
      });
    default:
      return state;
  }
};
