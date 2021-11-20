import { RETUR_TANPA_NOTA } from "../../../actions/_constants";

const initialState = {
  download: 0,
  data: [],
  returReportExcel: [],
  returReportDetail: [],
  msg: "",
  status: "",
};

export const returReducer = (state = initialState, action) => {
  switch (action.type) {
    case RETUR_TANPA_NOTA.GET_REPORT:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
        total: action.data.result.total,
      });
    case RETUR_TANPA_NOTA.GET_REPORT_DETAIL:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        returReportDetail: action.data.result,
      });
    default:
      return state;
  }
};
