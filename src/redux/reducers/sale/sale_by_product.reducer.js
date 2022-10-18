import { SALE_BY_PRODUCT } from "../../actions/_constants";

const initialState = {
  download: 0,
  download_detail: 0,
  isLoading: false,
  isLoadingDetail: false,
  isLoadingReport: false,
  data: [],
  dataDetail: [],
  msg: "",
  status: "",
  code: "-",
  sale_by_product_data: [],
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
  report_detail_excel: [],
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
};

export const sale_by_productReducer = (state = initialState, action) => {
  switch (action.type) {
    case SALE_BY_PRODUCT.REPORT_DETAIL_SUCCESS:
      return Object.assign({}, state, {
        dataDetail: action.data.result,
      });
    case SALE_BY_PRODUCT.SUCCESS:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
        total: action.data.result.total,
      });
    case SALE_BY_PRODUCT.REPORT_DETAIL_EXCEL:
      return Object.assign({}, state, {
        report_detail_excel: action.data.result,
      });
    case SALE_BY_PRODUCT.REPORT_SUCCESS_EXCEL:
      return Object.assign({}, state, {
        report_excel: action.data.result,
        total_penjualan_excel: action.data.result.total_penjualan,
      });
    case SALE_BY_PRODUCT.REPORT_SUCCESS:
      return Object.assign({}, state, {
        report: action.data.result,
        report_data: action.data.result.data,
        total_penjualan: action.data.result.total_penjualan,
      });
    case SALE_BY_PRODUCT.SALE_BY_PRODUCT_DATA:
      return Object.assign({}, state, {
        sale_by_product_data: action.data.result,
      });
    case SALE_BY_PRODUCT.SUCCESS_CODE:
      return Object.assign({}, state, {
        code: action.data.result,
      });
    case SALE_BY_PRODUCT.FAILED:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    case SALE_BY_PRODUCT.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });
    case SALE_BY_PRODUCT.LOADING_DETAIL:
      return Object.assign({}, state, {
        isLoadingDetail: action.load,
      });
    case SALE_BY_PRODUCT.REPORT_LOADING:
      return Object.assign({}, state, {
        isLoadingReport: action.load,
      });
    case SALE_BY_PRODUCT.DOWNLOAD:
      return Object.assign({}, state, {
        download: action.load,
      });
    case SALE_BY_PRODUCT.DOWNLOAD_DETAIL:
      return Object.assign({}, state, {
        download_detail: action.load,
      });
    default:
      return state;
  }
};
