import { SALE_BY_PRODUCT, HEADERS } from "../_constants";
import { handleGet, handleGetExport } from "../handleHttp";
import { ModalToggle } from "../modal.action";
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
// export function setSaleByProduct(data = []) {
//     return {
//         type: SALE_BY_PRODUCT.SUCCESS,
//         data
//     }
// }

// export function setSaleByProductData(data = []) {
//     return {
//         type: SALE_BY_PRODUCT.SALE_BY_PRODUCT_DATA,
//         data
//     }
// }

// export function setSaleByProductFailed(data = []) {
//     return {
//         type: SALE_BY_PRODUCT.FAILED,
//         data
//     }
// }
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
export const FetchReportSaleByProductExcel = (page = 1, where = "", perpage = 10000) => {
  return (dispatch) => {
    let url = `report/penjualan/barang?page=${page}&perpage=${perpage}`;
    if (where !== "") url += `&${where}`;
    handleGetExport(
      url,
      (res) => {
        dispatch(setReportExcel(res.data));
        dispatch(ModalToggle(true));
      },
      (res) => dispatch(setDownload(res))
    );
  };
};

export const FetchReportDetailSaleByProduct = (kd, where = "") => {
  return (dispatch) => {
    let url = `report/penjualan/barang/${kd}`;
    if (where !== "") url += `?${where}`;
    handleGet(
      url,
      (res) => {
        dispatch(setSaleByProductReportData(res.data));
        dispatch(ModalToggle(true));
      },
      true
    );
  };
};
