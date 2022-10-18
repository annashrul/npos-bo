import { SALES_ORDER } from "../../actions/_constants";

const initialState = {
  code: "-",
};

export const salesOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case SALES_ORDER.GET_SO_CODE:
      return Object.assign({}, state, {
        code: action.data.result,
      });
    default:
      return state;
  }
};
