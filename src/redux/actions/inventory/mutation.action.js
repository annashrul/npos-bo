import { MUTATION, HEADERS } from "../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import { setLoading } from "../masterdata/customer/customer.action";
import { handleDelete, handleGet, handleGetExport } from "../handleHttp";
import { ModalToggle, ModalType } from "../modal.action";
import { linkApprovalMutasi } from "../../../helperLink";

export function setDownload(load) {
  return {
    type: MUTATION.DOWNLOAD,
    load,
  };
}

export function setLoadingApprove(load) {
  return {
    type: MUTATION.APPROVAL_MUTATION_SAVE,
    load,
  };
}
export function setLoadingApprovalMutation(load) {
  return {
    type: MUTATION.APPROVAL_MUTATION_LOADING,
    load,
  };
}
export function setLoadingApprovalMutationDetail(load) {
  return {
    type: MUTATION.APPROVAL_MUTATION_LOADING_DETAIL,
    load,
  };
}
export function setApprovalMutation(data = []) {
  return {
    type: MUTATION.APPROVAL_MUTATION_DATA,
    data,
  };
}
export function setApprovalMutationDetail(data = []) {
  return {
    type: MUTATION.APPROVAL_TUTATION_DATA_DETAIL,
    data,
  };
}

export function setApprovalMutationFailed(data = []) {
  return {
    type: MUTATION.APPROVAL_MUTATION_FAILED,
    data,
  };
}

export function setMutation(data = []) {
  return { type: MUTATION.SUCCESS, data };
}

export function setMutationExcel(data = []) {
  return { type: MUTATION.SUCCESS_EXCEL, data };
}

export function setMutationData(data = []) {
  return { type: MUTATION.SUCCESS_DATA, data };
}

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
    let url = `alokasi/reprint/${id}`;

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
              // console.log(this.props);
              window.location.reload();
              // window.open(`/approval_mutasi`, '_top');
            }
          });
          document.getElementById("btnNotaPdf").addEventListener("click", () => {
            // const win = window.open(data['kd_trx'], '_blank');
            // if (win != null) {
            //     win.focus();
            // }

            dispatch(rePrintFaktur(id));
          });
          document.getElementById("btnNota3ply").addEventListener("click", () => {
            // param({
            //     pathname: `/approvalAlokasi3ply`,
            //     state: {
            //         data: rawdata,
            //     }
            // })
            // Swal.closeModal();
            // return false;
            const win = window.open(`/alokasi3ply/${id}`, "_blank");
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
        dispatch(setLoadingApprovalMutation(false));
      })
      .catch(function (error) {
        Swal.close();
      });
  };
};

export const FetchApprovalMutation = (page = 1, q = "", lokasi = "", param = "") => {
  return (dispatch) => {
    dispatch(setLoadingApprovalMutation(true));
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
        dispatch(setApprovalMutation(data));
        dispatch(setLoadingApprovalMutation(false));
      })
      .catch(function (error) {
        // handle error
      });
  };
};

export const FetchApprovalMutationDetail = (page = 1, kd_trx) => {
  return (dispatch) => {
    dispatch(setLoadingApprovalMutationDetail(true));
    let url = `mutasi/${kd_trx}/?perpage=${page}`;
    axios
      .get(HEADERS.URL + url)
      .then(function (response) {
        const data = response.data;
        dispatch(setApprovalMutationDetail(data));
        dispatch(setLoadingApprovalMutationDetail(false));
      })
      .catch(function (error) {
        // handle error
        Swal.fire({
          title: "failed",
          type: "error",
          text: "Gagal mengambil data.\n" + JSON.stringify(error),
        });
      });
  };
};

export const saveApprovalMutation = (data, param, lokasi) => {
  return (dispatch) => {
    // let rawdata = data;
    dispatch(setLoadingApprove(true));
    Swal.fire({
      allowOutsideClick: false,
      title: "Silahkan tunggu.",
      html: "Sedang memproses data..",
      onBeforeOpen: () => {
        Swal.showLoading();
      },
      onClose: () => {},
    });
    const url = HEADERS.URL + `mutasi/approve`;
    axios
      .post(url, data.data)
      .then(function (response) {
        Swal.close();
        Swal.fire({
          allowOutsideClick: false,
          title: "Transaksi berhasil.",
          type: "info",
          html:
            `Disimpan dengan nota: ${data.data["kd_trx"]}` +
            "<br><br>" +
            '<button type="button" role="button" tabindex="0" id="btnNotaPdf" class="btn btn-primary">Nota PDF</button>    ' +
            '<button type="button" role="button" tabindex="0" id="btnNota3ply" class="btn btn-info d-none">Nota 3ply</button>',
          showCancelButton: true,
          showConfirmButton: false,
        }).then((result) => {
          if (result.dismiss === "cancel") {
            // dispatch(FetchApprovalMutation(1, "", lokasi, ""));
            // dispatch(ModalToggle(false));
            param({ pathname: linkApprovalMutasi });
          }
        });
        document.getElementById("btnNotaPdf").addEventListener("click", () => {
            dispatch(rePrintFaktur(data.data["kd_trx"]));
        });
        document.getElementById("btnNota3ply").addEventListener("click", () => {
          const win = window.open(`/alokasi3ply/${data.data["kd_trx"]}`, "_blank");
          if (win != null) {
            win.focus();
          }
        });
        dispatch(setLoadingApprove(false));
        dispatch(setLoading(false));
      })
      .catch(function (error) {
        // dispatch(setLoading(false));
        dispatch(setLoadingApprove(false));
        Swal.fire({
          title: "failed",
          type: "error",
          text: error.response === undefined ? "error!" : error.response.data.msg,
        });

        if (error.response) {
        }
      });
  };
};

export const FetchMutation = (where = "") => {
  return (dispatch) => {
    let url = `mutasi/report`;
    if (where !== "") url += `?${where}`;
    handleGet(url, (res) => dispatch(setMutation(res.data)));
  };
};

export const FetchMutationExcel = (where = "", perpage = 99999) => {
  return (dispatch) => {
    let url = `mutasi/report?perpage=${perpage}`;
    if (where !== "") url += `&${where}`;
    handleGetExport(
      url,
      (res) => {
        dispatch(setMutationExcel(res.data));
        dispatch(ModalToggle(true));
        dispatch(ModalType("formMutationExcel"));
      },
      (percent) => {
        dispatch(setDownload(percent));
      }
    );
  };
};
export const FetchMutationData = (code, where = "", isModal = false) => {
  return (dispatch) => {
    let url = `alokasi/report/${code}`;
    if (where !== "") url += `?${where}`;
    handleGet(url, (res) => {
      dispatch(setMutationData(res.data));
      if (isModal) {
        dispatch(ModalToggle(true));
        dispatch(ModalType("detailMutation"));
      }
    });
  };
};

export const deleteReportMutation = (kdTrx) => {
  return (dispatch) => {
    handleDelete(`alokasi/${kdTrx}`, () => {
      dispatch(FetchMutation("page=1"));
    });
    // handleDelete()
  };
};

//const Toast = Swal.mixin({
//    toast: true,
//    position: 'top-end',
//    showConfirmButton: false,
//    timer: 1000,
//    timerProgressBar: true,
//    onOpen: (toast) => {
//        toast.addEventListener('mouseenter', Swal.stopTimer)
//        toast.addEventListener('mouseleave', Swal.resumeTimer)
//    }
//})
