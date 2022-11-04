import { RECEIVE, HEADERS } from "../../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import { destroy } from "components/model/app.model";
import { handleDelete, handleGet, handleGetExport } from "../../handleHttp";
import { ModalToggle, ModalType } from "../../modal.action";
import { linkReceivePembelian } from "../../../../helperLink";
import { handleNotifAction } from "../../site.action";
export function setDownload(load) {
  return {
    type: RECEIVE.DOWNLOAD,
    load,
  };
}
export function setLoading(load) {
  return {
    type: RECEIVE.LOADING,
    load,
  };
}
export function setLoadingReportDetail(load) {
  return {
    type: RECEIVE.LOADING_REPORT_DETAIL,
    load,
  };
}
export function setPO(data = []) {
  return {
    type: RECEIVE.SUCCESS,
    data,
  };
}
export function setPoData(data = []) {
  return {
    type: RECEIVE.RECEIVE_DATA,
    data,
  };
}
export function setReport(data = []) {
  return {
    type: RECEIVE.SUCCESS_REPORT,
    data,
  };
}
export function setCode(data = []) {
  return {
    type: RECEIVE.SUCCESS_CODE,
    data,
  };
}
export function setPersen(data = []) {
  return {
    type: RECEIVE.SUCCESS_PERSEN,
    data,
  };
}
export function setNewest(dataNew = []) {
  return {
    type: RECEIVE.SUCCESS_NEWEST,
    dataNew,
  };
}

export function setPOFailed(data = []) {
  return {
    type: RECEIVE.FAILED,
    data,
  };
}
export function setReportDetail(data = []) {
  return { type: RECEIVE.RECEIVE_REPORT_DETAIL, data };
}
export function setReportExcel(data = []) {
  return { type: RECEIVE.RECEIVE_REPORT_EXCEL, data };
}
export const FetchNota = (lokasi) => {
  return (dispatch) => {
    let url = `receive/getcode?lokasi=${lokasi}`;
    handleGet(url, (res) => dispatch(setCode(res.data)), true);
  };
};
export const storeReceive = (data, param) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    Swal.fire({
      allowOutsideClick: false,
      title: "Please Wait.",
      html: "Sending request..",
      onBeforeOpen: () => {
        Swal.showLoading();
      },
      onClose: () => {},
    });
    const url = HEADERS.URL + `receive`;
    axios
      .post(url, data.detail)
      .then(function (response) {
        Swal.close();
        const data = response.data;
        Swal.fire({
          allowOutsideClick: false,
          title: "Transaksi berhasil.",
          type: "info",
          html:
            `Disimpan dengan nota: ${data.result.insertId}` +
            "<br><br>" +
            // '<button type="button" role="button" tabindex="0" id="btnNotaPdf" class="btn btn-primary">Nota PDF</button>    ' +
            '<button type="button" role="button" tabindex="0" id="btnNota3ply" class="btn btn-info">Nota Print</button>',
          showCancelButton: true,
          showConfirmButton: false,
        }).then((result) => {
          destroy("receive");
          dispatch(handleNotifAction(true));
          if (result.dismiss === "cancel") {
            param({ pathname: linkReceivePembelian });
          }
        });
        // document.getElementById("btnNotaPdf").addEventListener("click", () => {
        //   const win = window.open(data.result.nota, "_blank");
        //   if (win != null) {
        //     win.focus();
        //   }
        // });
        document.getElementById("btnNota3ply").addEventListener("click", () => {
          const win = window.open(
            `/pembelian3plyId/${data.result.insertId}`,
            "_blank"
          );
          if (win != null) {
            win.focus();
          }
          return false;
          // param({
          //   pathname: "/pembelian3plyId/" + data.result.insertId,
          //   state: {
          //     data: rawdata,
          //     nota: data.result.kode,
          //   },
          // });

          // return false;
        });
        dispatch(setLoading(false));
      })
      .catch(function (error) {
        Swal.close();

        Swal.fire({
          allowOutsideClick: false,
          title: "Failed",
          type: "error",
          text:
            error.response === undefined ? "error!" : error.response.data.msg,
        });

        if (error.response) {
        }
      });
  };
};
export const updateReceive = (data, kode) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    const url = HEADERS.URL + `receive/${kode}`;
    axios
      .put(url, data.detail)
      .then(function (response) {
        const data = response.data;
        Swal.fire({
          allowOutsideClick: false,
          title: "Transaksi berhasil.",
          text: `Disimpan dengan nota: ${data.result.insertId}`,
          icon: "info",
          showCancelButton: true,
          confirmButtonColor: "#ff9800",
          cancelButtonColor: "#2196F3",
          confirmButtonText: "Print Nota?",
          cancelButtonText: "Oke!",
        }).then((result) => {
          if (result.value) {
            const win = window.open(data.result.nota, "_blank");
            if (win != null) {
              win.focus();
            }
          }
          destroy("receive");
          localStorage.removeItem("sp");
          localStorage.removeItem("lk");
          localStorage.removeItem("ambil_data");
          localStorage.removeItem("nota");
          localStorage.removeItem("catatan");
          localStorage.removeItem("data_master_receive");
          localStorage.removeItem("data_detail_receive");

          window.location.href = `/report/receive`;
        });
        dispatch(setLoading(false));
      })
      .catch(function (error) {
        Swal.fire({
          allowOutsideClick: false,
          title: "Failed",
          type: "error",
          text:
            error.response === undefined ? "error!" : error.response.data.msg,
        });

        if (error.response) {
        }
      });
  };
};

export const FetchReport = (where = "") => {
  return (dispatch) => {
    let url = `receive/report?perpage=${HEADERS.PERPAGE}`;
    if (where !== "") url += `&${where}`;
    handleGet(
      url,
      (res) => {
        let data = res.data;
        dispatch(setPO(data));
      },
      true
    );
  };
};

export const FetchReceiveData = (nota, isModal = false) => {
  return (dispatch) => {
    let url = `receive/ambil_data/${nota}`;
    handleGet(
      url,
      (res) => {
        dispatch(setPoData(res.data));
        if (isModal) {
          dispatch(ModalToggle(true));
          dispatch(ModalType("formReturReceive"));
        }
      },
      true
    );
    dispatch(setLoading(true));
  };
};
export const FetchReportDetail = (code, where = "", isModal = false) => {
  return (dispatch) => {
    let url = `receive/report/${code}?perpage=${HEADERS.PERPAGE}`;
    if (where !== "") url += `&${where}`;
    handleGet(
      url,
      (res) => {
        dispatch(setReportDetail(res.data));
        if (isModal) {
          dispatch(ModalToggle(true));
          dispatch(ModalType("receiveReportDetail"));
        }
      },
      true
    );
  };
};
export const receiveAmbilData = (code) => {
  return (dispatch) => {
    let url = `receive/ambil_data/${code}`;
    handleGet(
      url,
      (res) => {
        console.log("response ambnil data", res);
        dispatch(setReportDetail(res.data));
      },
      true
    );
  };
};
export const FetchReportExcel = (where = "", perpage = 9999) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    let url = `receive/report?perpage=${perpage}`;

    if (where !== "") {
      url += `&${where}`;
    }

    handleGetExport(
      url,
      (res) => {
        dispatch(ModalToggle(true));
        dispatch(ModalType("formReceiveExcel"));
        dispatch(setReportExcel(res.data));
      },
      (res) => dispatch(setDownload(res))
    );
  };
};
export const deleteReceiveReport = (data) => {
  return (dispatch) => {
    handleDelete(`receive/${data.id}`, () => {
      dispatch(FetchReport(data.where));
    });
  };
};

export const rePrintFaktur = (id) => {
  return (dispatch) => {
    Swal.fire({
      title: "Silahkan tunggu.",
      html: "Sedang memproses faktur..",
      onBeforeOpen: () => {
        Swal.showLoading();
      },
      onClose: () => {},
    });
    let url = `receive/reprint/${btoa(id)}`;

    axios
      .get(HEADERS.URL + url)
      .then(function (response) {
        Swal.close();
        const data = response.data;
        if (data.status === "success") {
          window.open(data.result.nota, "_blank");
          Swal.fire({
            allowOutsideClick: false,
            title: "Transaksi berhasil.",
            type: "info",
            html:
              `Disimpan dengan nota: ${id}` +
              "<br><br>" +
              '<button type="button" role="button" tabindex="0" id="btnNotaPdf" class="btn btn-primary">Nota PDF</button>    ' +
              '<button type="button" role="button" tabindex="0" id="btnNota3ply" class="btn btn-info d-none">Nota 3ply</button>',
            showCancelButton: true,
            showConfirmButton: false,
          }).then((result) => {
            if (result.dismiss === "cancel") {
              Swal.close();
            }
          });
          document
            .getElementById("btnNotaPdf")
            .addEventListener("click", () => {
              dispatch(rePrintFaktur(id));
            });
          document
            .getElementById("btnNota3ply")
            .addEventListener("click", () => {
              const win = window.open(`/pembelian3ply/${id}`, "_blank");
              if (win != null) {
                win.focus();
              }
            });
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
        Swal.close();
      });
  };
};
