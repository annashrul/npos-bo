// import { HEADERS } from "./_constants";
// import localforage from 'localforage'
// import memoryDriver from 'localforage-memoryStorageDriver'
// import { setup } from 'axios-cache-adapter'
// import Swal from "sweetalert2";

// import Nprogress from "nprogress";
// import "nprogress/nprogress.css";

import Swal from "sweetalert2";
import { handleError, swal, swallOption } from "../../helper";
import axios from "axios";
import { HEADERS } from "../actions/_constants";
import Nprogress from "nprogress";
import "nprogress/nprogress.css";

const strNetworkError = "a network error occurred.";

export const handleGet = (url, callback) => {
  Nprogress.start();
  axios
    .get(HEADERS.URL + url)
    .then(function (response) {
      const datum = response.data;
      callback(datum);
      Nprogress.done();
    })
    .catch(function (error) {
      Nprogress.done();
      handleError(error);
    });
};

// export async function configure ()  {
//     await localforage.defineDriver(memoryDriver)
//     const forageStore = localforage.createInstance({
//         driver: [
//             localforage.INDEXEDDB,
//             localforage.LOCALSTORAGE,
//             memoryDriver._driver
//         ],
//         name: 'my-cache'
//     })

//     return setup({
//         baseURL: HEADERS.URL,
//         cache: {
//             maxAge: 15 * 60 * 1000,
//             store: forageStore // Pass `localforage` store to `axios-cache-adapter`
//         }
//     })
// }

// export function handleGet(url,callback){
//     Nprogress.start();
//     configure().then(async (api) => {
//         const response = await api.get(url)
//         const data = response.data;
//         callback(data)
//         Nprogress.done();
//     }).catch(function (error) {
//         Nprogress.done();
//         Swal.fire({
//             title: "Terjadi Kesalahan",
//             type: "error",
//             text:"cek koneksi internet anda"
//         });
//     });
// }
