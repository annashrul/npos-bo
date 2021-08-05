import { NILAI_PERSEDIAAN_REPORT, HEADERS } from "../../_constants";
import { handleGet, handleGetExport } from "../../handleHttp";
import { ModalToggle, ModalType } from "../../modal.action";

export function setDownload(load) {
  return { type: NILAI_PERSEDIAAN_REPORT.DOWNLOAD, load };
}

export function setLoading(load) {
  return { type: NILAI_PERSEDIAAN_REPORT.LOADING, load };
}
export function setLoadingDetailSatuan(load) {
  return { type: NILAI_PERSEDIAAN_REPORT.LOADING_DETAIL_SATUAN, load };
}

export function setNilaiPersediaanReport(data = []) {
  return { type: NILAI_PERSEDIAAN_REPORT.SUCCESS, data };
}

export function setNilaiPersediaanReportExcel(data = []) {
  return { type: NILAI_PERSEDIAAN_REPORT.SUCCESS_EXCEL, data };
}
export function setNilaiPersediaanReportDetailSatuan(data = []) {
  return { type: NILAI_PERSEDIAAN_REPORT.DETAIL_SATUAN, data };
}
export function setNilaiPersediaanReportDetailTransaction(data = []) {
  return { type: NILAI_PERSEDIAAN_REPORT.DETAIL_TRANSAKSI, data };
}

export function setNilaiPersediaanReportFailed(data = []) {
  return { type: NILAI_PERSEDIAAN_REPORT.FAILED, data };
}

//FILTER NILAI_PERSEDIAAN REPORT//
// perpage=10,page=1,searchby=kd_brg,dateFrom=2020-01-01,dateTo=2020-07-01,lokasi=LK%2F0001
export const FetchNilaiPersediaanReport = (where = "") => {
  return (dispatch) => {
    let url = `report/nilai_persediaan?limit=${HEADERS.PERPAGE}`;
    if (where !== "") {
      url += `&${where}`;
    }
    handleGet(url, (res) => dispatch(setNilaiPersediaanReport(res.data)));
  };
};

//FILTER NILAI_PERSEDIAAN REPORT EXCEL//
export const FetchNilaiPersediaanReportExcel = (page = 1, where = "", perpage = 99999) => {
  return (dispatch) => {
    let url = `report/nilai_persediaan?page=${page}&perpage=${perpage}`;
    if (where !== "") {
      url += `${where}`;
    }
    handleGetExport(
      url,
      (res) => {
        dispatch(setNilaiPersediaanReportExcel(res.data));
        dispatch(ModalToggle(true));
        dispatch(ModalType("formNilaiPersediaanExcel"));
      },
      (res) => dispatch(setDownload(res))
    );
  };
};
export const FetchNilaiPersediaanReportDetailSatuan = (code, where = "", isModal = true) => {
  return (dispatch) => {
    let url = `report/nilai_persediaan/${code}?perpage=${HEADERS.PERPAGE}`;
    if (where !== "") url += `&${where}`;
    handleGet(url, (res) => {
      dispatch(setNilaiPersediaanReportDetailSatuan(res.data));
      if (isModal) {
        dispatch(ModalToggle(true));
        dispatch(ModalType("detailNilaiPersediaanReportSatuan"));
      }
    });
  };
};
export const FetchNilaiPersediaanReportDetailTransaction = (code, where = "", isModal = true) => {
  return (dispatch) => {
    let url = `report/nilai_persediaan/${code}/detail?perpage=${HEADERS.PERPAGE}`;
    if (where !== "") url += `&${where}`;
    handleGet(
      url,
      (res) => {
        console.log(res);

        dispatch(setNilaiPersediaanReportDetailTransaction(res.data));
        if (isModal) {
          dispatch(ModalToggle(true));
          dispatch(ModalType("detailNilaiPersediaanReportTransaction"));
        }
      },
      true
    );
  };
};
