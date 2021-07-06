import { EXPEDISI } from "../../../actions/_constants";

const initialState = {
  download: 0,
  isLoading: true,
  status: "",
  msg: "",
  data: [],
  report: [],
  report_excel: [],
  total_expedisi: { total_fisik: 0, total_akhir: 0, total_hpp: 0 },
};

export const expedisiReducer = (state = initialState, action) => {
  switch (action.type) {
    case EXPEDISI.SUCCESS:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        report: action.data.result,
      });
    case EXPEDISI.DATA_POSTING:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
        total_expedisi: action.data.result.total_expedisi,
      });
    case EXPEDISI.SUCCESS_EXCEL:
      return Object.assign({}, state, {
        report_excel: action.data.result,
      });
    case EXPEDISI.FAILED:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    case EXPEDISI.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });
    case EXPEDISI.DOWNLOAD:
      return Object.assign({}, state, {
        download: action.load,
      });
    default:
      return state;
  }
};
