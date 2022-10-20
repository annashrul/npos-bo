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
      console.log(res);
      dispatch(setLoadingCreate(false));
      // dispatch(ModalToggle(true));
      // dispatch(ModalType("downloadNotaPdf"));
      // swal("data berhasil disimpan");
      callback();
    });
    // handleGet(`so/code?lokasi=${btoa(val)}`, (res) => {
    //   console.log("sales order", res);
    //   dispatch(setSoCode(res.data));
    // });
  };
};
