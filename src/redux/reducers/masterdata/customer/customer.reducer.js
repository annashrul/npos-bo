import { CUSTOMER } from "../../../actions/_constants";

const initialState = {
  isLoading: true,
  status: "",
  msg: "",
  data: [],
  edit: [],
  dataPrice: [],
  all: [],
};

export const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case CUSTOMER.SUCCESS:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    case CUSTOMER.ALL:
      return Object.assign({}, state, {
        all: action.data.result.data,
      });
    case CUSTOMER.LIST_PRICE:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        dataPrice: action.data.result,
      });
    case CUSTOMER.EDIT:
      return Object.assign({}, state, {
        edit: action.data.result,
      });
    case CUSTOMER.FAILED:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    case CUSTOMER.LOADING:
      return Object.assign({}, state, {
        isLoading: action.load,
      });
    default:
      return state;
  }
};
