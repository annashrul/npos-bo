import Swal from "sweetalert2";
import { swal, swallOption } from "../../helper";
import axios from "axios";
import { HEADERS } from "../actions/_constants";
import Nprogress from "nprogress";
import "nprogress/nprogress.css";

const strNetworkError = "a network error occurred.";
const strServerError = "a server error occurred.";

export const loading = (isStatus = true, title = "Silahkan tunggu.") => {
  Swal.fire({
    allowOutsideClick: false,
    title: title,
    html: "",
    onBeforeOpen: () => {
      Swal.showLoading();
    },
    onClose: () => {},
  });
  if (!isStatus) Swal.close();
};

export const handleError = (err) => {
  if (err.message === "Network Error") {
    swal(strNetworkError);
  } else {
    if (err.response !== undefined) {
      if (err.response.data.msg !== undefined) {
        swal(err.response.data.msg);
      } else {
        swal(strServerError);
      }
    }
  }
};

export const handleGet = (url, callback, isLoading = true) => {
  if (isLoading) Nprogress.start();
  axios
    .get(HEADERS.URL + url)
    .then(function (response) {
      callback(response);
      if (isLoading) Nprogress.done();
    })
    .catch(function (error) {
      if (isLoading) Nprogress.done();
      handleError(error);
    });
};

export const handlePost = async (url, data, callback, title = "Silahkan tunggu.") => {
  loading(true, title);
  axios
    .post(HEADERS.URL + url, data)
    .then(function (response) {
      setTimeout(function () {
        loading(false);
        const datum = response.data;
        if (datum.status === "success") {
          callback(datum, datum.msg, true);
        } else {
          callback(datum, datum.msg, false);
        }
      }, 800);
    })
    .catch(function (error) {
      setTimeout(function () {
        loading(false);
        handleError(error);
      }, 800);
    });
};

export const handlePut = async (url, data, callback, title = "Silahkan tunggu.") => {
  loading(true, title);
  axios
    .put(HEADERS.URL + url, data)
    .then(function (response) {
      setTimeout(function () {
        loading(false);
        const datum = response.data;
        if (datum.status === "success") {
          callback(datum, datum.msg, true);
        } else {
          callback(datum, datum.msg, false);
        }
      }, 800);
    })
    .catch(function (error) {
      setTimeout(function () {
        loading(false);
        handleError(error);
      }, 800);
    });
};

export const handleDelete = async (url, callback, title = "Silahkan tunggu.") => {
  swallOption("Anda yakin akan menghapus data ini ?", async () => {
    loading(true, title);
    axios
      .delete(HEADERS.URL + url)
      .then(function (response) {
        setTimeout(function () {
          loading(false);
          const datum = response.data;
          if (datum.status === "success") {
            swal(datum.msg);
            callback();
          } else {
            swal(datum.msg);
          }
        }, 800);
      })
      .catch(function (error) {
        setTimeout(function () {
          loading(false);
          handleError(error);
        }, 800);
      });
  });
};

export const handleGetExport = (url, callback, download) => {
  Nprogress.start();
  download("loading");
  axios
    .get(HEADERS.URL + url, {
      onDownloadProgress: (progressEvent) => {
        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        Nprogress.set(percentCompleted / 100);
        download(percentCompleted);
      },
    })
    .then(function (response) {
      console.log("response helper http", response.data.result.data);
      if (response.data.result.data !== undefined && response.data.result.data.length > 0) {
        callback(response);
      } else {
        swal("Data tidak tersedia");
      }

      Nprogress.done();
      download(0);
    })
    .catch(function (error) {
      Nprogress.done();
      handleError(error);
      download(0);
    });
};
