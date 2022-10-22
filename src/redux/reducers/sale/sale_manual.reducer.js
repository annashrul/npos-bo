import { PENJUALAN_MANUAL } from "../../actions/_constants";

const initialState = {
  loadingCreate: false,
  loadingGet: true,
  dataGet: [],
  dataGetReport: [],
  dataGetDetailReport: [],
};

export const saleManualReducer = (state = initialState, action) => {
  switch (action.type) {
    case PENJUALAN_MANUAL.GET_REPORT:
      return Object.assign({}, state, {
        dataGetReport: action.data.result,
      });
    case PENJUALAN_MANUAL.GET_DETAIL_REPORT:
      return Object.assign({}, state, {
        dataGetDetailReport: action.data.result,
      });
    case PENJUALAN_MANUAL.GET:
      return Object.assign({}, state, {
        dataGet: action.data.result,
      });
    case PENJUALAN_MANUAL.LOADING_GET:
      return Object.assign({}, state, {
        loadingGet: action.load,
      });
    case PENJUALAN_MANUAL.LOADING_CREATE:
      return Object.assign({}, state, {
        loadingCreate: action.load,
      });
    default:
      return state;
  }
};
