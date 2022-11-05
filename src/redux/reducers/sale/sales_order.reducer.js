import { SALES_ORDER } from "../../actions/_constants";

const initialState = {
  code: ['kd_so'] ,
  dataGetApproval: [],
  dataGetSo: [],
  detaDetailSo: [],
};

export const salesOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case SALES_ORDER.GET_DATA_DETAIL_SO:
      return Object.assign({}, state, {
        detaDetailSo: action.data.result,
      });
    case SALES_ORDER.GET_SO_DATA:
      return Object.assign({}, state, {
        dataGetSo: action.data.result,
      });
    case SALES_ORDER.GET_SO_CODE:
      return Object.assign({}, state, {
        code: action.data.result,
      });
    case SALES_ORDER.APPROVAL_SO_GET:
      return Object.assign({}, state, {
        dataGetApproval: action.data.result,
      });
    default:
      return state;
  }
};
