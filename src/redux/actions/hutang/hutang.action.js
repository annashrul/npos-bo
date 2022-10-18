import { HUTANG, HEADERS } from "../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import { handleGet, handleGetExport } from "../handleHttp";
import { ModalToggle, ModalType } from "../modal.action";

export function setDownload(load) {
  return {
    type: HUTANG.DOWNLOAD,
    load,
  };
}
export function setLoading(load) {
  return {
    type: HUTANG.LOADING,
    load,
  };
}
export function setLoadingPost(load) {
  return {
    type: HUTANG.LOADING,
    load,
  };
}
export function setHutang(data = []) {
  return {
    type: HUTANG.SUCCESS,
    data,
  };
}

export function setCode(data = []) {
  return {
    type: HUTANG.SUCCESS_CODE,
    data,
  };
}
export function setFailed(data = []) {
  return {
    type: HUTANG.FAILED,
    data,
  };
}

export function setHutangReport(data = []) {
  return { type: HUTANG.SUCCESS_REPORT, data };
}
export function setHutangReportDetail(data = []) {
  return { type: HUTANG.SUCCESS_REPORT_DETAIL, data };
}
export function setKartuHutang(data = []) {
  return { type: HUTANG.SUCCESS_KARTU_HUTANG, data };
}

export function setHutangReportExcel(data = []) {
  return { type: HUTANG.SUCCESS_EXCEL, data };
}

export const FetchHutang = (nota) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    axios
      .get(HEADERS.URL + `hutang/get?nota=${nota}`)
      .then(function (response) {
        const data = response.data;

        dispatch(FetchNotaHutang(data.result.lokasi));
        dispatch(setHutang(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {
        // handle error

        dispatch(setLoading(false));
        Swal.fire({
          allowOutsideClick: false,
          title: "Failed",
          type: "error",
          text: "Data Tidak Ditemukan",
        });
      });
  };
};

export const FetchNotaHutang = (lokasi) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    axios
      .get(HEADERS.URL + `hutang/getcode?lokasi=${lokasi}`)
      // axios.get(HEADERS.URL + `hutang/getcode?lokasi=LK/0001`)
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

export const FetchPdfHutang = (nota) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        Swal.fire({
            title: "Silahkan tunggu.",
            html: "Sedang memproses faktur..",
            onBeforeOpen: () => {
                Swal.showLoading();
            },
            onClose: () => {},
        });
        axios
            .get(HEADERS.URL + `hutang/cetak_nota/${nota}`)
            .then(function (response) {
                Swal.close();
                const data = response.data;
                if (data.status === "success") {
                    // window.open(data.result.nota, '_blank');
                    const win = window.open(data.result.nota, "_blank");
                    if (win != null) {
                        win.focus();
                    }
                } else {
                    Swal.fire({
                        title: "failed",
                        type: "error",
                        text: "Gagal mengambil faktur.",
                    });
                }
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error
            });
    };
};

export const storeHutang = (data, param) => {
  return (dispatch) => {
    dispatch(setLoadingPost(true));
    const url = HEADERS.URL + `hutang/bayar`;
    axios
      .post(url, data)
      .then(function (response) {
        // const data = (response.data);
          console.log(response);

        dispatch(setLoadingPost(false));
        Swal.fire({
          allowOutsideClick: false,
          title: "Transaksi berhasil.",
          type: "info",
          html:
          `Data telah disimpan!` +
          "<br><br>" +
          '<button type="button" role="button" tabindex="0" id="btnNotaPdf" class="btn btn-primary">Nota PDF</button>    ' +
          '<button type="button" role="button" tabindex="0" id="btnNota3ply" class="btn btn-info">Nota 3ply</button>',
          showCancelButton: true,
          showConfirmButton: false,
        }).then((result) => {
          localStorage.removeItem("nota_pembelian_hutang");
          localStorage.removeItem("jenis_trx_hutang");
          if (result.dismiss === "cancel") {
            window.location.reload(false);
          }
        });
        document.getElementById("btnNota3ply").addEventListener("click", () => {
          const win = window.open(`/bayar_hutang3ply/${response.data.result.insertId}|${data.nota_beli}`, "_blank");
          if (win != null) {
            win.focus();
          }
          return false;
        });
        document.getElementById("btnNotaPdf").addEventListener("click", () => {
          dispatch(FetchPdfHutang(response.data.result.insertId));
            // const win = window.open(`${HEADERS.URL}cetak_nota/${response.data.result.insertId}`, "_blank");
            // if (win !== null) {
            //     win.focus();
            // }
        });
      })
      .catch(function (error) {
        dispatch(setLoadingPost(false));
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

//FILTER HUTANG REPORT//
// perpage=10,page=1,searchby=kd_brg,dateFrom=2020-01-01,dateTo=2020-07-01,lokasi=LK%2F0001
export const FetchHutangReport = (where = "") => {
  return (dispatch) => {
    let url = `hutang/report/detail`;
    if (where !== "") {
      url += `?${where}`;
    }
    handleGet(url, (res) => {
      let data = res.data;
      dispatch(setHutangReport(data));
    });
  };
};
export const FetchHutangReportDetail = (page = 1, where = "", id = null) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    let url = `hutang/report/${id}?page=${page}`;
    if (where !== "") {
      url += `${where}`;
    }

    axios
      .get(HEADERS.URL + `${url}`)
      .then(function (response) {
        const data = response.data;

        dispatch(setHutangReportDetail(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {});
  };
};

//FILTER HUTANG REPORT EXCEL//
export const FetchHutangReportExcel = (where = "", perpage = 99999) => {
  return (dispatch) => {
    let url = `hutang/report/detail?page=1&perpage=${perpage}`;
    if (where !== "") {
      url += `${where}`;
    }
    handleGetExport(
      url,
      (res) => {
        dispatch(setHutangReportExcel(res.data));
        dispatch(ModalToggle(true));
        dispatch(ModalType("formHutangExcel"));
      },
      (percent) => dispatch(setDownload(percent))
    );
  };
};

//DELETE HUTANG REPORT EXCEL//
export const DeleteHutangReport = (id) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = HEADERS.URL + `hutang/${id}`;

    axios
      .delete(url)
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
        dispatch(FetchHutangReport(1));
      })
      .catch(function (error) {
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

export const FetchKartuHutang = (page = 1, where = "") => {
  return (dispatch) => {
    dispatch(setLoading(true));
    let url = `hutang/kartu_hutang?page=${page}`;
    if (where !== "") {
      url += `${where}`;
    }

    axios
      .get(HEADERS.URL + `${url}`)
      .then(function (response) {
        const data = response.data;

        dispatch(setKartuHutang(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {});
  };
};
