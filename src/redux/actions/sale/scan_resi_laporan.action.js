import { SCAN_RESI_REPORT, HEADERS } from "../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import { destroy } from "components/model/app.model";
import { handleDelete, handleGet, handleGetExport } from "../handleHttp";
import { ModalToggle, ModalType } from "../modal.action";

export function setSuccess(data = []) {
  return {
      type: SCAN_RESI_REPORT.SUCCESS,
      data,
  };
}

export function setExport(data = []) {
  return {
      type: SCAN_RESI_REPORT.EXPORT,
      data,
  };
}
export function setDetail(data = []) {
  return {
      type: SCAN_RESI_REPORT.DETAIL,
      data,
  };
}

export function setDownload(load) {
  return {
      type: SCAN_RESI_REPORT.DOWNLOAD,
      load,
  };
}
export const FetchScanResiReport = (where="") => {
  return (dispatch) => {
      let url = `scanresi/report`;
      if(where!=="")url+=`?${where}`;
      handleGet(url, (res) => {
          let data = res.data;
          dispatch(setSuccess(data));
      });
  };
};

export const FetchReportDetailScanResi = (kelBrg='',where="",isModal=true) => {
  return (dispatch) => {
      let url = `scanresi/detail`;
      if(where!=="")url+=`?${where}`;
      handleGet(url, (res) => {
          if(isModal){
              dispatch(ModalType("detailSaleByGroupProductReport"));
              dispatch(ModalToggle(true));
          }

          let data = res.data;
          dispatch(setDetail(data));
      });
  };
};
export const deleteScanResi = (res) => {
  return (dispatch) => {
    handleDelete(`scanresi/${res.no_resi}`, () => {
      dispatch(FetchScanResiReport());
    });
  };
};
