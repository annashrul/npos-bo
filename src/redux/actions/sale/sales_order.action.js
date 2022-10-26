import { SALES_ORDER, HEADERS } from "../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import { destroy, del } from "components/model/app.model";
import {
  handleDelete,
  handleGet,
  handleGetExport,
  handlePost,
  handlePut,
} from "../handleHttp";
import { ModalToggle } from "redux/actions/modal.action";
import { ToastQ, getStorage, rmStorage } from "../../../helper";
import { ModalType } from "../modal.action";
import Cookies from "js-cookie";

export function setDataApproval(data = []) {
  return {
    type: SALES_ORDER.APPROVAL_SO_GET,
    data,
  };
}
export function setSoCode(data = []) {
  return {
    type: SALES_ORDER.GET_SO_CODE,
    data,
  };
}
export function setLoadingCreate(load) {
  return {
    type: SALES_ORDER.LOADING_CREATE_SO_POST,
    load,
  };
}
export function setLoadingApproval(load) {
  return {
    type: SALES_ORDER.LOADING_APPROVAL_SO_POST,
    load,
  };
}

export const getApprovalSoAction = (where = "") => {
  return (dispatch) => {
    let url = `so`;
    if (where !== "") {
      url += `?${where}`;
    }
    handleGet(url, (res) => {
      dispatch(setDataApproval(res.data));
    });
  };
};

export const getCodeSoAction = (val) => {
  return (dispatch) => {
    handleGet(`so/code?lokasi=${btoa(val)}`, (res) => {
      console.log("sales order", res);
      dispatch(setSoCode(res.data));
    });
  };
};

export const postSalesOrderAction = (data, callback) => {
  return (dispatch) => {
    handlePost(`so`, data, (res, msg, isTrue) => {
      console.log(res);
      callback(isTrue);
    });
  };
};

export const putApprovalSalesOrderAction = (kd_so) => {
  return (dispatch) => {
    handlePut(`so`, { kd_so: kd_so }, (res, msg, isTrue) => {
      dispatch(getApprovalSoAction());
    });
  };
};