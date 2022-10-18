import { SALE } from "../../actions/_constants";

const initialState = {
  download: 0,
  isLoading: false,
  isLoadingDetail: false,
  isLoadingReport: false,
  data: [],
  dataDetail: [],
  dataEdit: [],
  msg: "",
  status: "",
  code: "-",
  sale_data: [],
  sale_retur_data: [],
  sale_retur_export: [],
  report: [],
  report_data: [],
  total_penjualan: {
    omset: 0,
    dis_item: 0,
    sub_total: 0,
    dis_persen: 0,
    dis_rp: 0,
    kas_lain: 0,
    gt: 0,
    bayar: 0,
    jml_kartu: 0,
    charge: 0,
    change: 0,
    voucher: 0,
    rounding: 0,
  },
  report_excel: [],
  total_penjualan_excel: {
    omset: 0,
    dis_item: 0,
    sub_total: 0,
    dis_persen: 0,
    dis_rp: 0,
    kas_lain: 0,
    gt: 0,
    bayar: 0,
    jml_kartu: 0,
    charge: 0,
    change: 0,
    voucher: 0,
    rounding: 0,
  },
  percent: 0,
};

export const saleReducer = (state = initialState, action) => {
  switch (action.type) {
    case SALE.LOADING:
      return Object.assign({}, state, {
        percent: action.load,
      });
    case SALE.EDIT_TRX:
      return Object.assign({}, state, {
        dataEdit: action.data.result,
      });
    case SALE.REPORT_DETAIL_SUCCESS:
      return Object.assign({}, state, {
        dataDetail: action.data.result,
      });
    case SALE.SUCCESS:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
        total: action.data.result.total,
      });
    case SALE.SUCCESS_SALE_RETUR:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        sale_retur_data: action.data.result,
      });
    case SALE.SUCCESS_SALE_RETUR_EXCEL:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        sale_retur_export: action.data.result,
      });
    case SALE.REPORT_SUCCESS_EXCEL:
      return Object.assign({}, state, {
        report_excel: action.data.result,
        total_penjualan_excel: action.data.result.total_penjualan,
      });
    case SALE.REPORT_SUCCESS:
      return Object.assign({}, state, {
        report: action.data.result,
        report_data: action.data.result.data,
        total_penjualan: action.data.result.total_penjualan,
      });
    case SALE.SALE_DATA:
      return Object.assign({}, state, {
        sale_data: action.data.result,
      });
    case SALE.SUCCESS_CODE:
      return Object.assign({}, state, {
        code: action.data.result,
      });
    case SALE.FAILED:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    case SALE.DOWNLOAD:
      return Object.assign({}, state, {
        download: action.load,
      });
    case SALE.LOADING_DETAIL:
      return Object.assign({}, state, {
        isLoadingDetail: action.load,
      });
    case SALE.REPORT_LOADING:
      return Object.assign({}, state, {
        isLoadingReport: action.load,
      });
    default:
      return state;
  }
};
