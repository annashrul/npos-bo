import { TRANSACTION, HEADERS } from "../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import { setLoading } from "../masterdata/customer/customer.action";
import { handleDelete, handleGet, handleGetExport } from "../handleHttp";
import { ModalToggle, ModalType } from "../modal.action";
export function setDownload(load) {
  return {
    type: TRANSACTION.APPROVAL_TRANSACTION_DOWNLAOD,
    load,
  };
}
export function setLoadingApprovalTransaction(load) {
  return {
    type: TRANSACTION.APPROVAL_TRANSACTION_LOADING,
    load,
  };
}
export function setApprovalTransaction(data = []) {
  return {
    type: TRANSACTION.APPROVAL_TRANSACTION_DATA,
    data,
  };
}
export function setApprovalTransactionDetail(data = []) {
  return {
    type: TRANSACTION.APPROVAL_TUTATION_DATA_DETAIL,
    data,
  };
}

export function setApprovalTransactionFailed(data = []) {
  return {
    type: TRANSACTION.APPROVAL_TRANSACTION_FAILED,
    data,
  };
}

export function setTransaction(data = []) {
  return { type: TRANSACTION.SUCCESS, data };
}

export function setTransactionExcel(data = []) {
  return { type: TRANSACTION.SUCCESS_EXCEL, data };
}

export function setTransactionData(data = []) {
  return { type: TRANSACTION.SUCCESS_DATA, data };
}

export const FetchApprovalTransaction = (page = 1, q = "", lokasi = "", param = "") => {
  return (dispatch) => {
    dispatch(setLoadingApprovalTransaction(true));
    let url = `mutasi?page=${page}`;
    if (q !== "") {
      if (url !== "") {
        url += "&";
      }
      url += `q=${q}`;
    }
    if (lokasi !== "") {
      if (url !== "") {
        url += "&";
      }
      url += `lokasi=${lokasi}`;
    }
    if (param !== "") {
      if (url !== "") {
        url += "&";
      }
      url += `type=${param}`;
    }
    axios
      .get(HEADERS.URL + url)
      .then(function (response) {
        const data = response.data;
        dispatch(setApprovalTransaction(data));
        dispatch(setLoadingApprovalTransaction(false));
      })
      .catch(function (error) {
        // handle error
      });
  };
};

export const FetchApprovalTransactionDetail = (page = 1, kd_trx) => {
  return (dispatch) => {
    dispatch(setLoadingApprovalTransaction(true));
    let url = `mutasi/${kd_trx}/?page=${page}`;
    axios
      .get(HEADERS.URL + url)
      .then(function (response) {
        const data = response.data;
        dispatch(setApprovalTransactionDetail(data));
        dispatch(setLoadingApprovalTransaction(false));
      })
      .catch(function (error) {
        // handle error
      });
  };
};

export const saveApprovalTransaction = (data) => {
  return (dispatch) => {
    // dispatch(setLoading(true))
    const url = HEADERS.URL + `mutasi/approve`;
    axios
      .post(url, data)
      .then(function (response) {
        const data = response.data;
        if (data.status === "success") {
          Toast.fire({
            icon: "success",
            title: data.msg,
          });
        } else {
          Swal.fire({
            allowOutsideClick: false,
            title: "failed",
            type: "error",
            text: data.msg,
          });
        }
        // dispatch(setLoading(false));
      })
      .catch(function (error) {
        // dispatch(setLoading(false));
        // Swal.fire({allowOutsideClick: false,
        //     title: 'failed',
        //     type: 'error',
        //     text: error.response === undefined?'error!':error.response.data.msg,
        // });

        if (error.response) {
        }
      });
  };
};

export const FetchTransaction = (where = "") => {
  return (dispatch) => {
    let url = `alokasi_trx/report?perpage=${HEADERS.PERPAGE}`;
    if (where !== "") url += `&${where}`;
    handleGet(url, (res) => dispatch(setTransaction(res.data)));
  };
};

export const FetchTransactionExcel = (where = "", perpage = 99999) => {
  return (dispatch) => {
    let url = `alokasi_trx/report?perpage=${perpage}`;
    if (where !== "") {
      url += `&${where}`;
    }
    handleGetExport(
      url,
      (res) => {
        dispatch(ModalToggle(true));
        dispatch(ModalType("formTransactionExcel"));
        dispatch(setTransactionExcel(res.data));
      },
      (res) => dispatch(setDownload(res))
    );
  };
};
export const DeleteTransaction = (val) => {
  return (dispatch) => {
    handleDelete(`alokasi/${val.id}`, () => {
      dispatch(FetchTransaction(val.where));
    });
  };
};
export const FetchTransactionData = (code, where = "", isModal = false) => {
  return (dispatch) => {
    let url = `alokasi/report/${code}?perpage=${HEADERS.PERPAGE}`;
    if (where !== "") url += `&${where}`;

    handleGet(
      url,
      (res) => {
        if (isModal) {
          dispatch(ModalToggle(true));
          dispatch(ModalType("detailTransaction"));
        }
        dispatch(setTransactionData(res.data));
      },
      true
    );
  };
};

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});
