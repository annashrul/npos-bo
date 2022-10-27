import { SCAN_RESI } from "../../actions/_constants";

const initialState = {
  loadingCreate: false,
  loadingGet: true,
  dataGet: [],
  dataGetReport: [],
  dataGetDetailReport: [],
};

export const scanResiReducer = (state = initialState, action) => {
  switch (action.type) {
    case SCAN_RESI.GET_REPORT:
      return Object.assign({}, state, {
        dataGetReport: action.data.result,
      });
    case SCAN_RESI.GET_DETAIL_REPORT:
      return Object.assign({}, state, {
        dataGetDetailReport: action.data.result,
      });
    case SCAN_RESI.GET:
      return Object.assign({}, state, {
        dataGet: action.data.result,
      });
    case SCAN_RESI.LOADING_GET:
      return Object.assign({}, state, {
        loadingGet: action.load,
      });
    case SCAN_RESI.LOADING_CREATE:
      return Object.assign({}, state, {
        loadingCreate: action.load,
      });
    default:
      return state;
  }
};