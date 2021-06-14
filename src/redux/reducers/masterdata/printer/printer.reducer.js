import { PRINTER } from "../../../actions/_constants";

const initialState = {
  status: "",
  msg: "",
  data: [],
};

export const printerReducer = (state = initialState, action) => {
  switch (action.type) {
    case PRINTER.GET_PRINTER_SUCCESS:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    case PRINTER.GET_PRINTER_FAILED:
      return Object.assign({}, state, {
        status: action.data.status,
        msg: action.data.msg,
        data: action.data.result,
      });
    default:
      return state;
  }
};
