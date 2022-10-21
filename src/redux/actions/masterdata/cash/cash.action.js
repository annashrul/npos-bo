import { swal } from "../../../../helper";
import {
  handleDelete,
  handleGet,
  handlePost,
  handlePostAndGet,
  handlePut,
} from "../../handleHttp";
import { ModalToggle } from "../../modal.action";
import { CASH } from "../../_constants";

const baseUrl = "kas";

export function setLoading(load) {
  return { type: CASH.LOADING, load };
}
export function setDataKartuKas(data = []) {
  return { type: CASH.DATA_GET_KARTU_KAS, data };
}
export function setCash(data = []) {
  return { type: CASH.SUCCESS, data };
}
export function setCashFailed(data = []) {
  return { type: CASH.FAILED, data };
}
export function setUpdate(data = []) {
  return {
    type: CASH.UPDATE,
    data,
  };
}

export function successCashTrx(bool) {
  return {
    type: CASH.TRX_SUCCESS,
    bool,
  };
}

export function setLoadingReport(load) {
  return { type: CASH.LOADING_REPORT, load };
}
export function setCashReport(data = []) {
  return { type: CASH.SUCCESS_REPORT, data };
}
export function setCashFailedReport(data = []) {
  return { type: CASH.FAILED_REPORT, data };
}

export function setCashReportExcel(data = []) {
  return { type: CASH.EXCEL_REPORT, data };
}
export const getKartuKasAction = (where = "") => {
  return (dispatch) => {
    let url = `${baseUrl}/kartu_kas`;
    if (where !== "") url += `?${where}`;
    handleGet(
      url,
      (res) => {
        const data = res.data;
        dispatch(setDataKartuKas(data));
      },
      true
    );
  };
};
export const FetchCash = (where = "") => {
  return (dispatch) => {
    let url = baseUrl;
    if (where !== "") url += `?${where}`;
    handleGet(
      url,
      (res) => {
        const data = res.data;
        dispatch(setCash(data));
      },
      true
    );
  };
};

export const FetchCashDetail = (id) => {
  return (dispatch) => {
    let url = baseUrl + "/" + id;
    handleGet(
      url,
      (res) => {
        const data = res.data;
        dispatch(setCash(data));
      },
      true
    );
  };
};
export const createCash = (data, where) => {
  return (dispatch) => {
    handlePost(baseUrl, data, (res, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(ModalToggle(false));
        dispatch(FetchCash(where));
      } else {
        dispatch(ModalToggle(true));
      }
    });
  };
};

export const updateCash = (id, data, where) => {
  return (dispatch) => {
    handlePut(`kas/${id}`, data, (res, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(ModalToggle(false));
        dispatch(FetchCash(where));
      } else {
        dispatch(ModalToggle(true));
      }
    });
  };
};
export const deleteCash = (id, detail) => {
  return (dispatch) => {
    handleDelete(`${baseUrl}/${id}`, () => {
      if (detail.total === 1) {
        dispatch(FetchCash(`page=1&type=${detail.type}`));
      } else {
        dispatch(FetchCash(detail.where));
      }
    });
  };
};

export const StoreCashTrx = (data) => {
  return (dispatch) => {
    handlePost("pos/kas", data, (res, msg, status) => {
      swal(msg);
      if (status) {
        dispatch(FetchCash(`page=1&type=${data.type_kas}&perpage=99`));
        dispatch(successCashTrx(true));
      }
    });
  };
};

export const UpdateCashTrx = (kd_trx, data, where = "") => {
  return (dispatch) => {
    handlePut(`pos/kas/${btoa(kd_trx)}`, data, (res, msg, status) => {
      if (status) {
        dispatch(successCashTrx(true));
        dispatch(FetchCashReport(where));
      }
    });
  };
};

export const deleteCashTransaksi = (id, id_trx) => {
  return (dispatch) => {
    const ids = btoa(id + "|" + id_trx);
    const url = `pos/kas/${ids}`;
    handleDelete(url, () => {
      dispatch(FetchCashReport("page=1"));
    });
  };
};

export const FetchCashReport = (where = "") => {
  return (dispatch) => {
    let url = "pos/report?param=kas&isbo=true";
    if (where !== "") url += `&${where}`;
    handlePostAndGet(
      url,
      (res, msg, status) => {
        if (status) {
          const data = res;
          dispatch(setCashReport(data));
          dispatch(successCashTrx(true));
        }
      },
      "kas"
    );
  };
};

export const FetchCashReportExcel = (where = "", perpage = "") => {
  return (dispatch) => {
    let url = `pos/report?page=1&param=kas&isbo=true&perpage=${perpage}`;
    if (where !== "") url += `&${where}`;
    handlePost(url, [], (res, msg, status) => {
      const data = res;
      dispatch(setCashReportExcel(data));
      dispatch(ModalToggle(true));
    });

    // handleGet(url, (res) => {
    //   const data = res.data;
    //   dispatch(setCashReportExcel(data));
    // });
  };
};
