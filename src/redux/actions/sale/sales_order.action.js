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
export function setDataDetailSo(data = []) {
  return {
    type: SALES_ORDER.GET_DATA_DETAIL_SO,
    data,
  };
}
export function setData(data = []) {
  return {
    type: SALES_ORDER.GET_SO_DATA,
    data,
  };
}
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
export const getDetailSoAction = (kd_so, callback) => {
  return (dispatch) => {
    let url = `so/detail-so/${kd_so}`;
    handleGet(url, (res) => {
      // dispatch(setDataDetailSo(res.data));
      callback(res.data.result);
    });
  };
};
export const getSoAction = () => {
  return (dispatch) => {
    let url = `so`;
    handleGet(url, (res) => {
      dispatch(setData(res.data));
    });
  };
};
export const getApprovalSoAction = (where = "", callback = null) => {
  return (dispatch) => {
    let url = `so/approval`;
    if (where !== "") {
      url += `?${where}`;
    }
    handleGet(url, (res) => {
      dispatch(setDataApproval(res.data));
      if (callback !== null) {
        callback(res.data.result.data);
      }
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
      console.log("postSalesOrderAction", res);
      callback(res.result);
    });
  };
};

export const putApprovalSalesOrderAction = (data) => {
  return (dispatch) => {
    handlePut(`so`, data, (res, msg, isTrue) => {
      dispatch(getApprovalSoAction());
      dispatch(ModalToggle(!isTrue));
    });
  };
};

export const deleteSalesOrderAction = (res) => {
  return (dispatch) => {
    handleDelete(`so/${res.kd_so}`, () => {
      dispatch(getApprovalSoAction());
    });
  };
};