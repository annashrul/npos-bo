import { HEADERS } from "./_constants";
import localforage from 'localforage'
import memoryDriver from 'localforage-memoryStorageDriver'
import { setup } from 'axios-cache-adapter'
import Swal from "sweetalert2";

import Nprogress from "nprogress";
import "nprogress/nprogress.css";

export async function configure ()  {
    await localforage.defineDriver(memoryDriver)
    const forageStore = localforage.createInstance({
        driver: [
            localforage.INDEXEDDB,
            localforage.LOCALSTORAGE,
            memoryDriver._driver
        ],
        name: 'my-cache'
    })

    return setup({
        baseURL: HEADERS.URL,
        cache: {
            maxAge: 15 * 60 * 1000,
            store: forageStore // Pass `localforage` store to `axios-cache-adapter`
        }
    })
}

export function handleGet(url,callback){
    Nprogress.start();
    configure().then(async (api) => {
        const response = await api.get(url)
        const data = response.data;
        callback(data)
        Nprogress.done();
    }).catch(function (error) {
        Nprogress.done();
        Swal.fire({
            title: "Terjadi Kesalahan",
            type: "error",
            text:"cek koneksi internet anda"
        });
    });
}