import { SALE_OMSET_PERIODE, HEADERS } from "../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import { handleGet } from "../handleHttp";

export function setLoading(load) {
  return {
    type: SALE_OMSET_PERIODE.LOADING,
    load,
  };
}
export function setLoadingDetail(load) {
  return {
    type: SALE_OMSET_PERIODE.LOADING_DETAIL,
    load,
  };
}
export function setSaleOmsetPeriode(data = []) {
  return {
    type: SALE_OMSET_PERIODE.SUCCESS,
    data,
  };
}

export function setDetail(data = []) {
  return {
    type: SALE_OMSET_PERIODE.DETAIL,
    data,
  };
}

export function setCode(data = []) {
  return {
    type: SALE_OMSET_PERIODE.SUCCESS_CODE,
    data,
  };
}

export function setSaleOmsetPeriodeFailed(data = []) {
  return {
    type: SALE_OMSET_PERIODE.FAILED,
    data,
  };
}
export function setReport(data = []) {
  return {
    type: SALE_OMSET_PERIODE.SUCCESS,
    data,
  };
}
export function setReportExcel(data = []) {
  return {
    type: SALE_OMSET_PERIODE.REPORT_SUCCESS_EXCEL,
    data,
  };
}
export function setReportFailed(data = []) {
  return {
    type: SALE_OMSET_PERIODE.REPORT_FAILED,
    data,
  };
}
export function setLoadingReport(load) {
  return {
    type: SALE_OMSET_PERIODE.REPORT_LOADING,
    load,
  };
}

export const FetchReportSaleOmsetPeriode = (page = 1, where = "") => {
  return (dispatch) => {
    let url = `report/penjualan/omset/periode?page=${page}&perpage=${HEADERS.PERPAGE}`;
    if (where !== "") {
      url += `&${where}`;
    }
    handleGet(url, (res) => dispatch(setReport(res.data)), true);
  };
};
export const FetchReportSaleOmsetPeriodeExcel = (page = 1, where = "", perpage = 10000) => {
  return (dispatch) => {
    Swal.fire({
      title: "Silahkan tunggu.",
      html: "Sedang memproses faktur..",
      onBeforeOpen: () => {
        Swal.showLoading();
      },
      onClose: () => {},
    });
    let url = `report/penjualan/omset/periode?page=${page}&perpage=${perpage}`;
    if (where !== "") {
      url += `&${where}`;
    }
    axios
      .get(HEADERS.URL + url)
      .then(function (response) {
        const data = response.data;

        dispatch(setReportExcel(data));
        Swal.close();
      })
      .catch(function (error) {
        Swal.close();
        // handle error
      });
  };
};

export const FetchReportDetailSaleOmsetPeriode = (page = 1, kd_trx, where = "") => {
  return (dispatch) => {
    dispatch(setLoadingDetail(true));
    let w = "";
    if (where !== "") {
      w += `&${where}`;
    }

    axios
      .get(HEADERS.URL + `report/penjualan/omset/periode/${kd_trx}?page=${page}${w}`)
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
