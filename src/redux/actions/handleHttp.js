import Swal from "sweetalert2";
import { swal, swallOption } from "../../helper";
import axios from "axios";
import { HEADERS } from "../actions/_constants";
import Nprogress from "nprogress";
import "nprogress/nprogress.css";
import localforage from "localforage";
import memoryDriver from "localforage-memoryStorageDriver";
import { setup } from "axios-cache-adapter";
import { useIndexedDB, initDB } from "react-indexed-db";

const httpClient = axios.create();
httpClient.defaults.timeout = 500;
const strNetworkError = "Terjadi kesalahan jaringan";
const strServerError = "Terjadi kesalahan server";

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
export async function configure() {
  await localforage.defineDriver(memoryDriver);
  const forageStore = localforage.createInstance({
    driver: [
      localforage.INDEXEDDB,
      localforage.LOCALSTORAGE,
      memoryDriver._driver,
    ],
    name: "my-cache",
  });

  return setup({
    // baseURL: HEADERS.URL,
    cache: {
      readHeaders: false,
      exclude: {
        query: false,
      },
      debug: false,
      store: forageStore,
      invalidate: async (config, request) => {
        // console.log("config", config);
        // console.log("request", request);
        if (request.clearCacheEntry) {
          await config.store.removeItem(config.uuid);
        }
      },
      // maxAge: 10 * 1000,
      maxAge: 15 * 60 * 1000,
      // store: forageStore, // Pass `localforage` store to `axios-cache-adapter`
    },
  });
}

export const handleGet = (
  url,
  callback,
  isLoading = true,
  clearCache = false
) => {
  if (isLoading) Nprogress.start();
  configure()
    .then(async (api) => {
      const response = await api.get(HEADERS.URL + url, {
        clearCacheEntry: true,
      });
      const data = response;
      callback(data);
      if (isLoading) Nprogress.done();
    })
    .catch(function (error) {
      if (isLoading) Nprogress.done();
      handleError(error);
    });

  // axios
  //   .get(HEADERS.URL + url)
  //   .then(function (response) {
  //     callback(response);
  //     if (isLoading) Nprogress.done();
  //   })
  //   .catch(function (error) {
  //     if (isLoading) Nprogress.done();
  //     handleError(error);
  //   });
};

export const handlePostAndGet = async (url, callback) => {
  Nprogress.start();
  axios
    .post(HEADERS.URL + url, [])
    .then(function (response) {
      const datum = response.data;
      if (datum.status === "success") {
        callback(datum, datum.msg, true);
      } else {
        callback(datum, datum.msg, false);
      }
      Nprogress.done();
    })
    .catch(function (error) {
      Nprogress.done();
      handleError(error);
    });
};

export const handlePost = async (
  url,
  data,
  callback,
  title = "Silahkan tunggu."
) => {
  loading(title);
  axios
    .post(HEADERS.URL + url, data)
    .then(function (response) {
      loading(false);
      const datum = response.data;
      if (datum.status === "success") {
        callback(datum, datum.msg, true);
      } else {
        callback(datum, datum.msg, false);
      }
    })
    .catch(function (error) {
      console.log("##############", error);
      loading(false);
      handleError(error);
    });
};

export const handlePut = async (
  url,
  data,
  callback,
  title = "Silahkan tunggu."
) => {
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

export const handleDelete = async (
  url,
  callback,
  title = "Silahkan tunggu."
) => {
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
  configure()
    .then(async (api) => {
      const response = await api.get(HEADERS.URL + url, {
        onDownloadProgress: (progressEvent) => {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          Nprogress.set(percentCompleted / 100);
          download(percentCompleted);
        },
      });
      if (
        response.data.result.data !== undefined &&
        response.data.result.data.length > 0
      ) {
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

  // axios
  //   .get(HEADERS.URL + url, {
  //     onDownloadProgress: (progressEvent) => {
  //       let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
  //       Nprogress.set(percentCompleted / 100);
  //       download(percentCompleted);
  //     },
  //   })
  //   .then(function (response) {
  //     if (response.data.result.data !== undefined && response.data.result.data.length > 0) {
  //       callback(response);
  //     } else {
  //       swal("Data tidak tersedia");
  //     }
  //     Nprogress.done();
  //     download(0);
  //   })
  //   .catch(function (error) {
  //     Nprogress.done();
  //     handleError(error);
  //     download(0);
  //   });
};
