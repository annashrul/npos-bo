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

export const getManualSaleReportAction = (data, callback) => {
  return (dispatch) => {
    handlePost("pos/laporan_penjualan_manual", data, (res, msg, isTrue) => {
      dispatch(setDataReport(res));
      callback(res);
    });
  };
};

// export const getManualSaleReportDetailAction = (data, callback) => {
//   return (dispatch) => {
//     handlePost("pos/laporan_penjualan_manual", data, (res, msg, isTrue) => {
//       dispatch(setDataReport(res));
//       callback(res);
//     });
//   };
// };
