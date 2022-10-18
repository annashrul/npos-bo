import { LABA_RUGI_REPORT, HEADERS } from "../../_constants";
import axios from "axios";
import Nprogress from "nprogress";
import "nprogress/nprogress.css";

export function setLoading(load) {
  return { type: LABA_RUGI_REPORT.LOADING, load };
}
export function setLoadingDetailSatuan(load) {
  return { type: LABA_RUGI_REPORT.LOADING_DETAIL_SATUAN, load };
}

export function setLabaRugiReport(data = []) {
  return { type: LABA_RUGI_REPORT.SUCCESS, data };
}

export function setLabaRugiReportExcel(data = []) {
  return { type: LABA_RUGI_REPORT.SUCCESS_EXCEL, data };
}
export function setLabaRugiReportDetailSatuan(data = []) {
  return { type: LABA_RUGI_REPORT.DETAIL_SATUAN, data };
}
export function setLabaRugiReportDetailTransaction(data = []) {
  return { type: LABA_RUGI_REPORT.DETAIL_TRANSAKSI, data };
}

export function setLabaRugiReportFailed(data = []) {
  return { type: LABA_RUGI_REPORT.FAILED, data };
}

//FILTER LABA_RUGI REPORT//
// perpage=10,page=1,searchby=kd_brg,dateFrom=2020-01-01,dateTo=2020-07-01,lokasi=LK%2F0001
export const FetchLabaRugiReport = (page = 1, where = "") => {
  return (dispatch) => {
    dispatch(setLoading(true));
    Nprogress.start();
    let url = `report/laba_rugi?`;
    if (where !== "") {
      url += `${where}`;
    }

    axios
      .get(HEADERS.URL + `${url}`)
      .then(function (response) {
        const data = response.data;

        dispatch(setLabaRugiReport(data));
        dispatch(setLoading(false));
        Nprogress.done();
      })
      .catch(function (error) {
        Nprogress.done();
      });
  };
};

//FILTER LABA_RUGI REPORT EXCEL//
export const FetchLabaRugiReportExcel = (
  page = 1,
  where = "",
  perpage = 99999
) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    let url = `report/laba_rugi?perpage=${perpage}`;
    if (where !== "") {
      url += `${where}`;
    }

    axios
      .get(HEADERS.URL + `${url}`)
      .then(function (response) {
        const data = response.data;

        dispatch(setLabaRugiReportExcel(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {});
  };
};
