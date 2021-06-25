import { SALE_OMSET, HEADERS } from "../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import { handleGet, loading } from "../handleHttp";
import { ModalToggle, ModalType } from "../modal.action";

export function setLoading(load) {
  return {
    type: SALE_OMSET.LOADING,
    load,
  };
}
export function setLoadingDetail(load) {
  return {
    type: SALE_OMSET.LOADING_DETAIL,
    load,
  };
}
export function setSaleOmset(data = []) {
  return {
    type: SALE_OMSET.SUCCESS,
    data,
  };
}

export function setDetail(data = []) {
  return {
    type: SALE_OMSET.DETAIL,
    data,
  };
}

export function setCode(data = []) {
  return {
    type: SALE_OMSET.SUCCESS_CODE,
    data,
  };
}

export function setSaleOmsetFailed(data = []) {
  return {
    type: SALE_OMSET.FAILED,
    data,
  };
}
export function setReport(data = []) {
  return {
    type: SALE_OMSET.SUCCESS,
    data,
  };
}
export function setReportExcel(data = []) {
  return {
    type: SALE_OMSET.REPORT_SUCCESS_EXCEL,
    data,
  };
}
export function setReportFailed(data = []) {
  return {
    type: SALE_OMSET.REPORT_FAILED,
    data,
  };
}
export function setLoadingReport(load) {
  return {
    type: SALE_OMSET.REPORT_LOADING,
    load,
  };
}

export const FetchReportSaleOmset = (where = "") => {
  return (dispatch) => {
    let url = `report/penjualan/omset`;
    if (where !== "") url += `?${where}`;
    handleGet(url, (res) => dispatch(setReport(res.data)));
  };
};
export const FetchReportSaleOmsetExcel = (
  page = 1,
  where = "",
  perpage = 10000
) => {
  return (dispatch) => {
    loading(true, "Sedang memproses faktur..");
    let url = `report/penjualan/omset?page=${page}&perpage=${perpage}`;
    if (where !== "") {
      url += `&${where}`;
    }
    handleGet(url, (res) => {
      const data = res.data;
      dispatch(ModalToggle(true));
      dispatch(ModalType("formSaleOmsetExcel"));
      dispatch(setReportExcel(data));
      loading(false);
    });
  };
};

export const FetchReportDetailSaleOmset = (page = 1, kd_trx, where = "") => {
  return (dispatch) => {
    dispatch(setLoadingDetail(true));
    let w = "";
    if (where !== "") {
      w += `&${where}`;
    }

    axios
      .get(HEADERS.URL + `report/penjualan/omset/${kd_trx}?page=${page}${w}`)
      .then(function (response) {
        const data = response.data;

        dispatch(setDetail(data));
        dispatch(setLoadingDetail(false));
      })
      .catch(function (error) {
        // handle error
      });
  };
};
