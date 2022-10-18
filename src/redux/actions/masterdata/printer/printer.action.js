import { PRINTER } from "../../_constants";
import {
  handleDelete,
  handleGet,
  handlePost,
  handlePut,
} from "../../handleHttp";
import { swal } from "../../../../helper";

const baseUrl = "printer";

export function setDataSuccess(data = []) {
  return { type: PRINTER.GET_PRINTER_SUCCESS, data };
}
export function setDataTestPrint(data = []) {
  return { type: PRINTER.TEST_PRINTER_SUCCESS, data };
}

export function setDataFailed(data = []) {
  return { type: PRINTER.GET_PRINTER_FAILED, data };
}
export const testPrinter = (where = "") => {
  return (dispatch) => {
    let url = baseUrl + "/test/" + where;
    handleGet(
      url,
      (res) => {
        const data = res.data;
        dispatch(setDataTestPrint(data));
      },
      true
    );
  };
};
export const readPrinter = (where = "", fastAdd = false) => {
  return (dispatch) => {
    let url = baseUrl;
    if (where !== "") url += `?${where}`;
    handleGet(
      url,
      (res) => {
        const data = res.data;
        dispatch(setDataSuccess(data));
        if (fastAdd) dispatch(readPrinter("page=1&perpage=99999"));
      },
      true
    );
  };
};

export const createPrinter = (data, callback) => {
  return (dispatch) => {
    handlePost(baseUrl, data, (res, msg, status) => {
      swal(msg);
      callback(true);
      dispatch(readPrinter("page=1"));
    });
  };
};
export const updatePrinter = (id, data, callback, where = "") => {
  return (dispatch) => {
    handlePut(`${baseUrl}/${id}`, data, (res, msg, status) => {
      swal(msg);
      callback(true);
      dispatch(readPrinter(where));
    });
  };
};
export const deletePrinter = (id, where = "") => {
  return (dispatch) => {
    handleDelete(`${baseUrl}/${id}`, () => {
      dispatch(readPrinter(where));
    });
  };
};
