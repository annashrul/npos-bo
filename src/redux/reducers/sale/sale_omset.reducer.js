import { SALE_OMSET } from "../../actions/_constants";

const initialState = {
  isLoading: false,
  isLoadingDetail: false,
  isLoadingReport: false,
  data: [],
  detail: [],
  msg: "",
  status: "",
  code: "-",
  report: [],
  report_excel: [],
  download: 0,
};

export const saleOmsetReducer = (state = initialState, action) => {
  switch (action.type) {
    case SALE_OMSET.DETAIL:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        detail: action.data.result,
      });
    case SALE_OMSET.SUCCESS:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
        total: action.data.result.total,
      });
    case SALE_OMSET.REPORT_SUCCESS_EXCEL:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        report_excel: action.data.result,
      });
    case SALE_OMSET.FAILED:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    case SALE_OMSET.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });
    case SALE_OMSET.LOADING_DETAIL:
      return Object.assign({}, state, {
        isLoadingDetail: action.load,
      });
    case SALE_OMSET.REPORT_LOADING:
      return Object.assign({}, state, {
        isLoadingReport: action.load,
      });
    case SALE_OMSET.DOWNLOAD:
      return Object.assign({}, state, {
        download: action.load,
      });
    default:
      return state;
  }
};
