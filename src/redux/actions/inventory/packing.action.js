import { PACKING, HEADERS } from "../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import { destroy } from "components/model/app.model";
import { handleGet, handleGetExport } from "../handleHttp";
import { ModalToggle, ModalType } from "../modal.action";
export function setDownload(load) {
  return { type: PACKING.DOWNLOAD, load };
}

export function setLoading(load) {
  return { type: PACKING.LOADING, load };
}

export function setBarangPacking(data = []) {
  return { type: PACKING.GET_BARANG_SUCCESS, data };
}
export function setBarangPackingTrx(data = []) {
  return { type: PACKING.GET_BARANG_SUCCESS_TRX, data };
}

export function setProduksiFailed(data = []) {
  return { type: PACKING.GET_BARANG_FAILED, data };
}

export function setCodePacking(data = []) {
  return { type: PACKING.GET_CODE, data };
}

export function setPacking(data = []) {
  return { type: PACKING.SUCCESS, data };
}

export function setPackingDetail(data = []) {
  return { type: PACKING.SUCCESS_DETAIL, data };
}

export function setPackingExcel(data = []) {
  return { type: PACKING.SUCCESS_EXCEL, data };
}

export const FetchCodePacking = (lokasi) => {
  return (dispatch) => {
    let where = "";
    if (lokasi !== "") {
      where += `?lokasi=${lokasi}`;
    }
    axios
      .get(HEADERS.URL + `packing/getcode${where}`)
      .then(function (response) {
        const data = response.data;

        dispatch(setCodePacking(data));
      })
      .catch(function (error) {});
  };
};

export const FetchBrgPacking = (kode, db) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    let url = `alokasi/get/${kode}`;
    axios
      .get(HEADERS.URL + `${url}`)
      .then(function (response) {
        const data = response.data;
        if (data.result.detail.length === 1) {
          const barang = data.result.detail;
          const cek = db(barang[0].kode_barang, barang);
          cek.then((re) => {
            dispatch(setBarangPacking(data));
            dispatch(setLoading(false));
          });
        } else {
          dispatch(setBarangPacking(data));
          dispatch(setLoading(false));
        }
      })
      .catch(function (error) {
        dispatch(setLoading(false));

        Swal.fire({
          allowOutsideClick: false,
          title: "failed",
          type: "error",
          // text: error.response === undefined?'error!':error.response.data.msg,
        });
      });
  };
};

export const storePacking = (data, param) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = HEADERS.URL + `packing`;
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
            // '<button type="button" role="button" tabindex="0" id="btnNotaPdf" class="btn btn-primary">Nota PDF</button>    ' +
            '<button type="button" role="button" tabindex="0" id="btnNota3ply" class="btn btn-info">Nota 3ply</button>',
          showCancelButton: true,
          showConfirmButton: false,
        }).then((result) => {
          destroy("packing");
          localStorage.removeItem("faktur_alokasi_packing");
          localStorage.removeItem("penerima_packing");
          if (result.dismiss === "cancel") {
            window.location.reload(false);
          }
        });
        // document.getElementById("btnNotaPdf").addEventListener("click", () => {
        //     const win = window.open(data.result.nota, '_blank');
        //     if (win != null) {
        //         win.focus();
        //     }
        // });
        document.getElementById("btnNota3ply").addEventListener("click", () => {
          // param({
          //     pathname: `/packing3ply/${response.data.result.insertId}`
          // })
          const win = window.open(`/packing3ply/${response.data.result.insertId}`, "_blank");
          if (win != null) {
            win.focus();
          }
          //Swal.closeModal();==
          return false;
        });
        dispatch(setLoading(false));
      })
      .catch(function (error) {
        Swal.fire({
          allowOutsideClick: false,
          title: "Failed",
          type: "error",
          text: "error.response.data.msg===undefined?'something wrong':error.response.data.msg",
        });

        if (error.response) {
        }
      });
  };
};

export const FetchBrgPackingTrx = (kode) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    let url = `packing/get/${kode}`;
    axios
      .get(HEADERS.URL + `${url}`)
      .then(function (response) {
        const data = response.data;
        dispatch(setBarangPackingTrx(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {
        dispatch(setLoading(false));
        Swal.fire({
          allowOutsideClick: false,
          title: "failed",
          type: "error",
          // text: error.response === undefined?'error!':error.response.data.msg,
        });
      });
  };
};

export const FetchPacking = (where = "") => {
  return (dispatch) => {
    let url = `packing/report?perpage=${HEADERS.PERPAGE}`;
    if (where !== "") url += `&${where}`;
    handleGet(url, (res) => dispatch(setPacking(res.data)));
  };
};
export const FetchPackingExcel = (where = "", perpage = 99999) => {
  return (dispatch) => {
    let url = `packing/report?perpage=${perpage}`;
    if (where !== "") url += `&${where}`;
    handleGetExport(
      url,
      (res) => {
        let data = res.data;
        dispatch(setPackingExcel(data));
        dispatch(ModalToggle(true));
        dispatch(ModalType("formPackingExcel"));
      },
      (res) => dispatch(setDownload(res))
    );
  };
};

export const FetchPackingDetail = (nota) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    axios
      .get(HEADERS.URL + `packing/report/${nota}`)
      .then(function (response) {
        const data = response.data;
        dispatch(setPackingDetail(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {
        // handle error
      });
  };
};
