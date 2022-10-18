import { DN, HEADERS } from "../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import { destroy } from "components/model/app.model";
import { ModalToggle, ModalType } from "../modal.action";
import { handleGet, handleGetExport } from "../handleHttp";
import { linkDeliveryNote } from "../../../helperLink";
export function setDOwnload(load) {
  return {
    type: DN.DOWNLOAD,
    load,
  };
}
export function setLoading(load) {
  return {
    type: DN.LOADING,
    load,
  };
}
export function setDN(data = []) {
  return {
    type: DN.SUCCESS,
    data,
  };
}

export function setDnData(data = []) {
  return {
    type: DN.DN_DATA,
    data,
  };
}

export function setDnDetail(data = []) {
  return {
    type: DN.DN_DETAIL,
    data,
  };
}
export function setReport(data = []) {
  return {
    type: DN.REPORT_SUCCESS,
    data,
  };
}
export function setReportExcel(data = []) {
  return {
    type: DN.REPORT_SUCCESS_EXCEL,
    data,
  };
}
export function setCode(data = []) {
  return {
    type: DN.SUCCESS_CODE,
    data,
  };
}
export function setPOFailed(data = []) {
  return {
    type: DN.FAILED,
    data,
  };
}

export const FetchDnReport = (page = 1, perpage = 10) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    axios
      .get(HEADERS.URL + `deliverynote/report?page=${page}&perpage=${perpage}&status=0`)
      .then(function (response) {
        const data = response.data;
        dispatch(setReport(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {
        // handle error
      });
  };
};

export const FetchDn = (where = "") => {
  return (dispatch) => {
    dispatch(setLoading(true));
    let url = `deliverynote/report?perpage=${HEADERS.PERPAGE}`;
    if (where !== "") url += `&${where}`;
    handleGet(url, (res) => {
      let data = res.data;
      dispatch(setReport(data));
    });
  };
};

export const FetchDnExcel = (where = "", perpage = 99999) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    let url = `deliverynote/report?perpage=${perpage}`;
    if (where !== "") {
      url += `&${where}`;
    }
    handleGetExport(
      url,
      (res) => {
        dispatch(setReportExcel(res.data));
        dispatch(ModalToggle(true));
        dispatch(ModalType("formDnExcel"));
      },
      (res) => dispatch(setDOwnload(res))
    );
  };
};

export const FetchDnData = (nota) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    axios
      .get(HEADERS.URL + `deliverynote/ambil_data/${nota}`)
      .then(function (response) {
        const data = response.data;
        dispatch(setDnData(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {
        // handle error
      });
  };
};

export const FetchDnDetail = (nota, where = "", isModal = false) => {
  return (dispatch) => {
    let url = `deliverynote/report/${nota}?perpage=${HEADERS.PERPAGE}`;
    if (where !== "") url += `&${where}`;
    handleGet(
      url,
      (res) => {
        dispatch(setDnDetail(res.data));
        if (isModal) {
          dispatch(ModalToggle(true));
          dispatch(ModalType("detailDn"));
        }
      },
      true
    );
  };
};

export const FetchNota = (lokasi) => {
  return (dispatch) => {
    dispatch(setLoading(true));

    axios
      .get(HEADERS.URL + `deliverynote/getcode?lokasi=${lokasi}`)
      .then(function (response) {
        const data = response.data;
        dispatch(setCode(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {
        // handle error
      });
  };
};

export const storeDN = (data, param) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = HEADERS.URL + `deliverynote`;
    axios
      .post(url, data.detail)
      .then(function (response) {
        const data = response.data;
        Swal.fire({
          allowOutsideClick: false,
          title: "Transaksi berhasil.",
          type: "info",
          html:
            `Disimpan dengan nota: ${data.result.insertId}` +
            "<br><br>" +
            '<button type="button" role="button" tabindex="0" id="btnNotaPdf" class="btn btn-primary">Nota PDF</button>    ' +
            '<button type="button" role="button" tabindex="0" id="btnNota3ply" class="btn btn-info">Nota 3ply</button>',
          showCancelButton: true,
          showConfirmButton: false,
        }).then((result) => {
          destroy("delivery_note");
          if (result.dismiss === "cancel") {
            param({
              pathname: linkDeliveryNote,
            });
          }
        });
        document.getElementById("btnNotaPdf").addEventListener("click", () => {
          const win = window.open(data.result.nota, "_blank");
          if (win != null) {
            win.focus();
          }
        });
        document.getElementById("btnNota3ply").addEventListener("click", () => {
          param();
          const win = window.open(`/dn3ply/${response.data.result.insertId}`, "_blank");
          if (win != null) {
            win.focus();
          }
          return false;
        });
        dispatch(setLoading(false));
      })
      .catch(function (error) {
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
