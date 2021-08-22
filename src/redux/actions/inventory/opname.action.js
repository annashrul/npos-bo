import { OPNAME, HEADERS } from "../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import { destroy } from "components/model/app.model";
import { handleGet, handleGetExport, handlePost } from "../handleHttp";
import { ModalToggle, ModalType } from "../modal.action";
import { swal, swallOption } from "../../../helper";

export function setDownload(load) {
  return { type: OPNAME.DOWNLOAD, load };
}
export function setLoading(load) {
  return { type: OPNAME.LOADING, load };
}
export function setOpname(data = []) {
  return { type: OPNAME.SUCCESS, data };
}
export function setOpnameExcel(data = []) {
  return { type: OPNAME.SUCCESS_EXCEL, data };
}
export function setPostingOpname(data = []) {
  return { type: OPNAME.DATA_POSTING, data };
}
export function setOpnameFailed(data = []) {
  return { type: OPNAME.FAILED, data };
}

export const FetchPostingOpname = (where = "") => {
  return (dispatch) => {
    let url = `opname/report?status=0`;
    if (where !== "") url += `&${where}`;

    handleGet(url, (res) => {
      dispatch(setPostingOpname(res.data));
    });
  };
};
export const FetchOpname = (where = "") => {
  return (dispatch) => {
    let url = `opname/report?perpage=${HEADERS.PERPAGE}`;
    if (where !== "") url += `&${where}`;
    handleGet(url, (res) => dispatch(setOpname(res.data)), true);
  };
};
export const FetchOpnameExcel = (where = "", perpage = 99999) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    let url = `opname/report?perpage=${perpage}`;
    if (where !== "") url += `&${where}`;
    handleGetExport(
      url,
      (res) => {
        dispatch(setOpnameExcel(res.data));
        dispatch(ModalToggle(true));
        dispatch(ModalType("formOpnameExcel"));
      },
      (res) => dispatch(setDownload(res))
    );
  };
};

export const storeOpname = (data, callback) => {
  return (dispatch) => {
    handlePost("opname", data, (res, msg, status) => {
      if (status) {
        swallOption("transaksi berhasil", () => {
          callback();
        });
      } else {
        swal(msg);
      }
    });
    // Swal.fire({
    //   allowOutsideClick: false,
    //   title: "Please Wait.",
    //   html: "Sending request..",
    //   onBeforeOpen: () => {
    //     Swal.showLoading();
    //   },
    //   onClose: () => {},
    // });
    // dispatch(setLoading(true));
    // const url = HEADERS.URL + `opname`;
    // axios
    //   .post(url, data)
    //   .then(function (response) {
    //     Swal.close();
    //     Swal.fire({ allowOutsideClick: false, title: "Success", type: "success", text: "Transaksi Berhasil" }).then((result) => {
    //       destroy("opname");
    //       localStorage.removeItem("location_opname");
    //       window.location.reload(false);
    //     });
    //     dispatch(setLoading(false));
    //   })
    //   .catch(function (error) {
    //     Swal.close();

    //     Swal.fire({ allowOutsideClick: false, title: "Failed", type: "error", text: error.response === undefined ? "error!" : error.response.data.msg });

    //     if (error.response) {
    //     }
    //   });
  };
};

export const storeOpnamePosting = (data, param) => {
  return (dispatch) => {
    handlePost(`opname/posting/${param}`, data, (res, msg, status) => {
      swal(msg);
      dispatch(FetchPostingOpname(""));
    });
  };
};

export const cancelOpname = (data) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    let url = `opname/`;

    axios
      .put(HEADERS.URL + url, data)
      .then(function (response) {
        Swal.fire({ allowOutsideClick: false, title: "Success", type: "success", text: "Cancel Opname Berhasil" }).then((result) => {
          dispatch(FetchPostingOpname(1));
        });

        dispatch(setLoading(false));
      })
      .catch(function (error) {
        Swal.fire({ allowOutsideClick: false, title: "Failed", type: "error", text: "Gagal Cancel opname" });

        if (error.response) {
        }
      });
  };
};
