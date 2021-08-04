import { PO } from "../../../actions/_constants";

const initialState = {
  downloadPoSupplier: 0,
  isLoading: 0,
  isLoadingDetail: false,
  data: [],
  msg: "",
  status: "",
  code: "-",
  po_data: [],
  pbs_data: [],
  pbs_data_excel: [],
  report: [],
  report_excel: [],
  report_data: [],
  dataReportDetail: [],
};

export const poReducer = (state = initialState, action) => {
  switch (action.type) {
    case PO.SUCCESS:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
        total: action.data.result.total,
        report: action.data.result,
        report_data: action.data.result.data,
      });
    case PO.SUCCESS_BY_SUPPLIER:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        pbs_data: action.data.result,
      });
    case PO.SUCCESS_BY_SUPPLIER_EXCEL:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        pbs_data_excel: action.data.result,
      });
    case PO.PO_DATA:
      return Object.assign({}, state, {
        po_data: action.data.result,
      });
    case PO.SUCCESS_EXCEL:
      return Object.assign({}, state, {
        report_excel: action.data.result,
      });
    case PO.PO_REPORT_DETAIL:
      return Object.assign({}, state, {
        dataReportDetail: action.data.result,
      });
    case PO.SUCCESS_CODE:
      return Object.assign({}, state, {
        code: action.data.result,
      });
    case PO.FAILED:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    case PO.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });
    case PO.LOADING_DETAIL:
      return Object.assign({}, state, {
        isLoadingDetail: action.load,
      });
    case PO.DOWNLOAD_PO_SUPPLIER:
      return Object.assign({}, state, {
        downloadPoSupplier: action.load,
      });
    default:
      return state;
  }
};
