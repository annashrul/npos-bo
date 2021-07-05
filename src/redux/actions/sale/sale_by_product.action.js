import { SALE_BY_PRODUCT } from "../_constants";
import { handleGet, handleGetExport } from "../handleHttp";
import { ModalToggle, ModalType } from "../modal.action";

export function setDownloadDetail(load) {
  return {
    type: SALE_BY_PRODUCT.DOWNLOAD_DETAIL,
    load,
  };
}
export function setDownload(load) {
  return {
    type: SALE_BY_PRODUCT.DOWNLOAD,
    load,
  };
}
export function setLoadingDetail(load) {
  return {
    type: SALE_BY_PRODUCT.LOADING_DETAIL,
    load,
  };
}
export function setSaleByProductReportData(data = []) {
  return {
    type: SALE_BY_PRODUCT.REPORT_DETAIL_SUCCESS,
    data,
  };
}
export function setReport(data = []) {
  return {
    type: SALE_BY_PRODUCT.REPORT_SUCCESS,
    data,
  };
}
export function setReportExcel(data = []) {
  return {
    type: SALE_BY_PRODUCT.REPORT_SUCCESS_EXCEL,
    data,
  };
}
export function setReportDetailExcel(data = []) {
  return {
    type: SALE_BY_PRODUCT.REPORT_DETAIL_EXCEL,
    data,
  };
}
export function setReportFailed(data = []) {
  return {
    type: SALE_BY_PRODUCT.REPORT_FAILED,
    data,
  };
}
export function setLoadingReport(load) {
  return {
    type: SALE_BY_PRODUCT.REPORT_LOADING,
    load,
  };
}

export const FetchReportSaleByProduct = (where = "") => {
  return (dispatch) => {
    let url = `report/penjualan/barang`;
    if (where !== "") url += `?${where}`;
    handleGet(url, (res) => {
      let data = res.data;
      dispatch(setReport(data));
    });
  };
};
export const FetchReportSaleByProductExcel = (where = "", perpage = 10000) => {
  return (dispatch) => {
    let url = `report/penjualan/barang?perpage=${perpage}`;
    if (where !== "") url += `&${where}`;
    handleGetExport(
      url,
      (res) => {
        dispatch(setReportExcel(res.data));
        dispatch(ModalType("formSaleByProductExcel"));
        dispatch(ModalToggle(true));
      },
      (res) => dispatch(setDownload(res))
    );
  };
};

export const FetchReportDetailSaleByProduct = (kd, where = "", isExcel = false) => {
  return (dispatch) => {
    let url = `report/penjualan/barang/${kd}`;
    if (where !== "") url += `?${where}`;
    handleGetExport(
      url,
      (res) => {
        if (!isExcel) {
          dispatch(setSaleByProductReportData(res.data));
          dispatch(ModalToggle(true));
        } else {
          dispatch(setReportDetailExcel(res.data));
        }
      },
      (res) => {
        if (isExcel) {
          dispatch(setDownloadDetail(res));
        }
      }
    );
  };
};
