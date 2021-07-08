import { ADJUSTMENT, HEADERS } from "../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import { destroy } from "components/model/app.model";
import { handleDelete, handleGet, handleGetExport } from "../handleHttp";
import { ModalToggle, ModalType } from "redux/actions/modal.action";

export function setDownload(load) {
  return { type: ADJUSTMENT.DOWNLOAD, load };
}

export function setLoading(load) {
  return { type: ADJUSTMENT.LOADING, load };
}

export function setAdjustment(data = []) {
  return { type: ADJUSTMENT.SUCCESS, data };
}
export function setAdjustmentAll(data = []) {
  return { type: ADJUSTMENT.ALL, data };
}
export function setAdjustmentExcel(data = []) {
  return { type: ADJUSTMENT.EXCEL, data };
}
export function setAdjustmentFailed(data = []) {
  return { type: ADJUSTMENT.FAILED, data };
}
export function setAdjustmentDetail(data = []) {
  return { type: ADJUSTMENT.DETAIL_TRANSAKSI, data };
}
export function setCodeAdjusment(data = []) {
  return { type: ADJUSTMENT.GET_CODE, data };
}

export const FetchAdjustment = (where = "") => {
  return (dispatch) => {
    let url = `adjustment/report?perpage=${HEADERS.PERPAGE}`;
    if (where !== "") url += `&${where}`;
    handleGet(url, (res) => dispatch(setAdjustment(res.data)));
  };
};
export const FetchAdjustmentExcel = (where = "", perpage = "") => {
  return (dispatch) => {
    let url = `adjustment/report?perpage=${perpage}`;
    if (where !== "") {
      url += `&${where}`;
    }

    handleGetExport(
      url,
      (res) => {
        dispatch(setAdjustmentExcel(res.data));
        dispatch(ModalToggle(true));
        dispatch(ModalType("formAdjustmentExcel"));
      },
      (res) => dispatch(setDownload(res))
    );
  };
};

export const FetchAdjustmentAll = () => {
  return (dispatch) => {
    dispatch(setLoading(true));
    axios
      .get(HEADERS.URL + `adjustment/report?page=1&perpage=100`)
      .then(function (response) {
        const data = response.data;
        dispatch(setAdjustmentAll(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {});
  };
};

export const storeAdjusment = (data, callback) => {
  return (dispatch) => {
    Swal.fire({
      allowOutsideClick: false,
      title: "Please Wait.",
      html: "Sending request..",
      onBeforeOpen: () => {
        Swal.showLoading();
      },
      onClose: () => {},
    });
    dispatch(setLoading(true));
    const url = HEADERS.URL + `adjustment`;
    axios
      .post(url, data)
      .then(function (response) {
        Swal.close();
        const data = response.data;
        Swal.fire({
          allowOutsideClick: false,
          title: "Transaksi berhasil.",
          icon: "info",
          html:
            "Terimakasih Telah Melakukan Transaksi Di Toko Kami" +
            "<br><br>" +
            '<button type="button" role="button" tabindex="0" id="btnNotaPdf" class="btn btn-primary">Nota PDF</button>    ' +
            '<button type="button" role="button" tabindex="0" id="btnNota3ply" class="btn btn-info">Nota 3ply</button>',
          showCancelButton: true,
          showConfirmButton: false,
        }).then((result) => {
          destroy("adjusment");
          if (result.dismiss === "cancel") {
            callback();
          }
        });
        document.getElementById("btnNotaPdf").addEventListener("click", () => {
          const win = window.open(data.result.nota, "_blank");
          if (win != null) {
            win.focus();
          }
        });
        document.getElementById("btnNota3ply").addEventListener("click", () => {
          const win = window.open(`/adjust3ply/${response.data.result.insertId}`, "_blank");
          if (win != null) {
            win.focus();
          }
          return false;
        });
        dispatch(setLoading(false));
      })
      .catch(function (error) {
        Swal.close();

        Swal.fire({
          allowOutsideClick: false,
          title: "Failed",
          type: "error",
          text: error.response === undefined ? "error!" : error.response.data.msg,
        });

        if (error.response) {
        }
      });
  };
};
export const updateAdjustment = (id, data, token) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = HEADERS.URL + `adjustment/report/${id}`;

    axios
      .put(url, data)
      .then(function (response) {
        const data = response.data;
        if (data.status === "success") {
          Swal.fire({
            allowOutsideClick: false,
            title: "Success",
            type: "success",
            text: data.msg,
          });
        } else {
          Swal.fire({
            allowOutsideClick: false,
            title: "failed",
            type: "error",
            text: data.msg,
          });
        }
        dispatch(setLoading(false));
        dispatch(FetchAdjustment(localStorage.getItem("page_adjustment") ? localStorage.getItem("page_adjustment") : 1, ""));
      })
      .catch(function (error) {
        // handle error
        dispatch(setLoading(false));

        Swal.fire({
          allowOutsideClick: false,
          title: "failed",
          type: "error",
          text: error.response === undefined ? "error!" : error.response.data.msg,
        });
        if (error.response) {
        }
      });
  };
};
export const deleteAdjustment = (res) => {
  return (dispatch) => {
    handleDelete(`adjustment/${res.kd_trx}`, () => {
      dispatch(FetchAdjustment(res.where));
    });
  };
};
export const FetchAdjustmentDetail = (code, where = "", isModal = false) => {
  return (dispatch) => {
    let url = `adjustment/report/${code}?perpage=${HEADERS.PERPAGE}`;
    if (where !== "") url += `&${where}`;
    handleGet(
      url,
      (res) => {
        dispatch(setAdjustmentDetail(res.data));
        if (isModal) {
          dispatch(ModalToggle(true));
          dispatch(ModalType("detailAdjustment"));
        }
      },
      true
    );
  };
};

export const FetchCodeAdjustment = (lokasi) => {
  return (dispatch) => {
    handleGet(`adjustment/getcode?lokasi=${lokasi}`, (res) => dispatch(setCodeAdjusment(res.data)), true);
  };
};
