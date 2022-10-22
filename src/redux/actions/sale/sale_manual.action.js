import { PENJUALAN_MANUAL, HEADERS } from "../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import { destroy, del } from "components/model/app.model";
import {
  handleDelete,
  handleGet,
  handleGetExport,
  handlePost,
} from "../handleHttp";
import { ModalToggle } from "redux/actions/modal.action";
import {
  ToastQ,
  getStorage,
  rmStorage,
  swallOption,
  swal,
} from "../../../helper";
import { ModalType } from "../modal.action";
import Cookies from "js-cookie";

export function setDataReport(data = []) {
  return {
    type: PENJUALAN_MANUAL.GET_REPORT,
    data,
  };
}
export function setDataDetailReport(data = []) {
  return {
    type: PENJUALAN_MANUAL.GET_DETAIL_REPORT,
    data,
  };
}
export function setData(data = []) {
  return {
    type: PENJUALAN_MANUAL.GET,
    data,
  };
}
export function setLoadingGet(load) {
  return {
    type: PENJUALAN_MANUAL.LOADING_GET,
    load,
  };
}
export function setLoadingCreate(load) {
  return {
    type: PENJUALAN_MANUAL.LOADING_CREATE,
    load,
  };
}

export const createManualSaleAction = (data, callback) => {
  return (dispatch) => {
    dispatch(setLoadingCreate(true));
    handlePost("pos/penjualan_manual", data, (res, msg, isTrue) => {
      dispatch(setLoadingCreate(false));
      callback(res);
    });
  };
};

export const getManualSaleReportAction = (where = "") => {
  return (dispatch) => {
    let url = "pos/laporan_penjualan_manual";
    if (where !== "") {
      url += `?${where}`;
    }
    handleGet(url, (res) => {
      dispatch(setDataReport(res.data));
    });
  };
};

export const deleteManualSaleAction = (kdTrx, gt) => {
  return (dispatch) => {
    let url = `pos/laporan_penjualan_manual/${btoa(kdTrx)}/${btoa(gt)}`;
    handleDelete(url, () => {
      dispatch(getManualSaleReportAction("page=1"));
    });
  };
};

export const getManualSaleDetailReportAction = (
  where,
  isModal = true,
  callback = null
) => {
  return (dispatch) => {
    let url = `pos/detail/laporan_penjualan_manual`;
    if (where !== "") {
      url += `?${where}`;
    }
    handleGet(url, (res) => {
      console.log("detail", res.data);
      dispatch(setDataDetailReport(res.data));
      if (isModal) {
        dispatch(ModalToggle(true));
        dispatch(ModalType("detailSaleReportManual"));
      } else {
        callback(res.data);
      }
    });
  };
};
