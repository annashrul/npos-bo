import { PRODUCT } from "../../../actions/_constants";

const initialState = {
  isLoading: true,
  isLoadingBrg: false,
  isLoadingBrgAll: false,
  isLoadingBrgSale: false,
  status: "",
  msg: "",
  data: [],
  dataEdit: [],
  dataDetail: [],
  result_brg: [],
  result_brg_all: [],
  pagin_brg: [],
  msg_brg: "",
  status_brg: "",

  result_brg_sale: [],
  pagin_brg_sale: [],
  msg_brg_sale: "",
  status_brg_sale: "",

  productCode: "",

  persenDl: 0,

  dataTrx: [],
  isLoadingTrx: true,
};

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case PRODUCT.CODE_PRODUCT:
      return Object.assign({}, state, {
        productCode: action.data.result.code,
      });
    case PRODUCT.DATA_PRODUCT_TRX:
      return Object.assign({}, state, {
        dataTrx: action.data.result,
      });
    case PRODUCT.SUCCESS:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    case PRODUCT.EDIT_PRODUCT:
      return Object.assign({}, state, {
        dataEdit: action.data.result,
      });
    case PRODUCT.DETAIL:
      return Object.assign({}, state, {
        dataDetail: action.data.result,
      });
    case PRODUCT.SUCCESS_BRG:
      return Object.assign({}, state, {
        status_brg: action.data.status,
        msg_brg: action.data.msg,
        result_brg: action.data.result.data,
        pagin_brg: action.data.result,
      });
    case PRODUCT.SUCCESS_BRG_ALL:
      return Object.assign({}, state, {
        status_brg: action.data.status,
        msg_brg: action.data.msg,
        result_brg_all: action.data.result,
      });
    case PRODUCT.SUCCESS_BRG_SALE:
      return Object.assign({}, state, {
        status_brg_sale: action.data.status,
        msg_brg_sale: action.data.msg,
        result_brg_sale: action.data.result.data,
        pagin_brg_sale: action.data.result,
      });
    case PRODUCT.FAILED:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    case PRODUCT.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });
    case PRODUCT.LOADING_DATA_PRODUCT_TRX:
      return Object.assign({}, state, {
        isLoadingTrx: action.load,
      });
    case PRODUCT.LOADING_BRG:
      return Object.assign({}, state, {
        isLoadingBrg: action.load,
      });
    case PRODUCT.LOADING_BRG_ALL:
      return Object.assign({}, state, {
        isLoadingBrgAll: action.load,
      });
    case PRODUCT.LOADING_BRG_SALE:
      return Object.assign({}, state, {
        isLoadingBrgSale: action.load,
      });
    case PRODUCT.SUCCESS_PERSEN:
      return Object.assign({}, state, {
        persenDl: action.data,
      });
    default:
      return state;
  }
};
