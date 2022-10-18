import { STOCK_REPORT, HEADERS } from "../../_constants";
import { handleGet, handleGetExport } from "../../handleHttp";
import { ModalToggle, ModalType } from "../../modal.action";

export function setDownload(load) {
  return { type: STOCK_REPORT.DOWNLOAD, load };
}

export function setLoading(load) {
  return { type: STOCK_REPORT.LOADING, load };
}
export function setLoadingDetailSatuan(load) {
  return { type: STOCK_REPORT.LOADING_DETAIL_SATUAN, load };
}

export function setStockReport(data = []) {
  return { type: STOCK_REPORT.SUCCESS, data };
}

export function setStockReportExcel(data = []) {
  return { type: STOCK_REPORT.SUCCESS_EXCEL, data };
}
export function setStockReportDetailSatuan(data = []) {
  return { type: STOCK_REPORT.DETAIL_SATUAN, data };
}
export function setStockReportDetailTransaction(data = []) {
  return { type: STOCK_REPORT.DETAIL_TRANSAKSI, data };
}

export function setStockReportFailed(data = []) {
  return { type: STOCK_REPORT.FAILED, data };
}

//FILTER STOCK REPORT//
// perpage=10,page=1,searchby=kd_brg,dateFrom=2020-01-01,dateTo=2020-07-01,lokasi=LK%2F0001
export const FetchStockReport = (where = "") => {
  return (dispatch) => {
    let url = `report/stock?perpage=${HEADERS.PERPAGE}`;
    if (where !== "") {
      url += `&${where}`;
    }
    handleGet(url, (res) => dispatch(setStockReport(res.data)));
  };
};

//FILTER STOCK REPORT EXCEL//
export const FetchStockReportExcel = (page = 1, where = "", perpage = 99999) => {
  return (dispatch) => {
    let url = `report/stock?page=${page}&perpage=${perpage}`;
    if (where !== "") {
      url += `${where}`;
    }
    handleGetExport(
      url,
      (res) => {
        dispatch(setStockReportExcel(res.data));
        dispatch(ModalToggle(true));
        dispatch(ModalType("formStockExcel"));
      },
      (res) => dispatch(setDownload(res))
    );
  };
};
export const FetchStockReportDetailSatuan = (code, where = "", isModal = true) => {
  return (dispatch) => {
    let url = `report/stock/${code}?perpage=${HEADERS.PERPAGE}`;
    if (where !== "") url += `&${where}`;
    handleGet(url, (res) => {
      dispatch(setStockReportDetailSatuan(res.data));
      if (isModal) {
        dispatch(ModalToggle(true));
        dispatch(ModalType("detailStockReportSatuan"));
      }
    });
  };
};
export const FetchStockReportDetailTransaction = (code, where = "", isModal = true) => {
  return (dispatch) => {
    let url = `report/stock/${code}/detail?perpage=${HEADERS.PERPAGE}`;
    if (where !== "") url += `&${where}`;
    handleGet(
      url,
      (res) => {
        console.log(res);

        dispatch(setStockReportDetailTransaction(res.data));
        if (isModal) {
          dispatch(ModalToggle(true));
          dispatch(ModalType("detailStockReportTransaction"));
        }
      },
      true
    );
  };
};
