import { PRODUKSI } from "../../../actions/_constants";

const initialState = {
  download: 0,
  isLoading: false,
  dataBahan: [],
  msgBahan: "",
  statusBahan: "",
  dataPaket: [],
  msgPaket: "",
  statusPaket: "",
  code: "-",
  report: [],
  report_excel: [],
  report_data: [],
};

export const produksiReducer = (state = initialState, action) => {
  switch (action.type) {
    case PRODUKSI.SUCCESS:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        report: action.data.result,
      });
    case PRODUKSI.SUCCESS_DATA:
      return Object.assign({}, state, {
        report_data: action.data.result,
      });
    case PRODUKSI.SUCCESS_EXCEL:
      return Object.assign({}, state, {
        report_excel: action.data.result,
      });
    case PRODUKSI.SUCCESS_BAHAN:
      return Object.assign({}, state, {
        statusBahan: action.data.status,
        msgBahan: action.data.msg,
        dataBahan: action.data.result,
      });
    case PRODUKSI.SUCCESS_PAKET:
      return Object.assign({}, state, {
        statusPaket: action.data.status,
        msgPaket: action.data.msg,
        dataPaket: action.data.result.data,
      });

    case PRODUKSI.GET_CODE:
      return Object.assign({}, state, {
        code: action.data.result,
      });
    case PRODUKSI.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });
    case PRODUKSI.DOWNLOAD:
      return Object.assign({}, state, {
        download: action.load,
      });

    default:
      return state;
  }
};
