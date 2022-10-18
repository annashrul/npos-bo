import { LOG_ACT, HEADERS } from "../../_constants";
import axios from "axios";
import Swal from "sweetalert2";
import { handleGet } from "../../handleHttp";
export function setLoading(load) {
  return { type: LOG_ACT.LOADING, load };
}
export function setLogAct(data = []) {
  return { type: LOG_ACT.SUCCESS, data };
}
export function setLogActTrx(data = []) {
  return { type: LOG_ACT.SUCCESS_TRX, data };
}
export function setLogActExcel(data = []) {
  return { type: LOG_ACT.SUCCESS_EXCEL, data };
}
export function setPostingLogAct(data = []) {
  return { type: LOG_ACT.DATA_POSTING, data };
}
export function setLogActFailed(data = []) {
  return { type: LOG_ACT.FAILED, data };
}

export const FetchLogAct = (where = "") => {
  return (dispatch) => {
    dispatch(setLoading(true));
    let url = `log/master`;
    if (where !== "") {
      url += `?${where}`;
    }
    handleGet(url, (res) => {
      let data = res.data;
      dispatch(setLogAct(data));
      dispatch(setLoading(false));
    });
  };
};
export const FetchLogActExcel = (page = 1, where = "", perpage = 99999) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    let url = `log/master?page=${page === "NaN" || page === null || page === "" || page === undefined ? 1 : page}&perpage=${perpage}`;
    if (where !== "") {
      url += where;
    }

    axios
      .get(HEADERS.URL + url)
      .then(function (response) {
        const data = response.data;

        dispatch(setLogActExcel(data));
        dispatch(setLoading(false));
      })
      .catch(function (error) {});
  };
};

export const clearLogAct = (data) => {
  return (dispatch) => {
    dispatch(setLoading(true));
    let url = "log/master";
    axios
      .post(HEADERS.URL + url, data)
      .then(function (response) {
        Swal.fire({ allowOutsideClick: false, title: "Success", type: "success", text: "Clearing Done!" });

        dispatch(setLoading(false));
      })
      .catch(function (error) {
        Swal.fire({ allowOutsideClick: false, title: "Failed", type: "error", text: error.response === undefined ? "error!" : error.response.data.msg });

        if (error.response) {
        }
      });
  };
};
