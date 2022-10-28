import { SCAN_RESI, HEADERS } from "../_constants";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { destroy } from "components/model/app.model";
import { handlePost } from "../handleHttp";
// import { ModalToggle, ModalType } from "../modal.action";
import { swal, swalWithCallback } from "../../../helper";
import { ToastQ } from "../../../helper";

export function setLoading(load) {
  return {
    type: SCAN_RESI.LOADING,
    load,
  };
}
export function setLoadingDetail(load) {
  return {
    type: SCAN_RESI.LOADING_DETAIL,
    load,
  };
}
export function setScanResi(data = []) {
  return {
    type: SCAN_RESI.SUCCESS,
    data,
  };
}

export function setScanResiData(data = []) {
  return {
    type: SCAN_RESI.PO_DATA,
    data,
  };
}
export const storeScanResi = (data, callback) => {
  return (dispatch) => {
    handlePost("scanresi/create", data, (res, msg, status) => {
      if (status) { 
          ToastQ.fire({ icon: "success", title: ` Resi Disimpan ` });
          callback();
      } else {
        swal(msg);
      }
    });
  };
};