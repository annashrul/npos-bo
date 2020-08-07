import {
    HUTANG,
    HEADERS
} from "../_constants"
import axios from "axios"
import Swal from 'sweetalert2'



export function setLoading(load) {
    return {
        type: HUTANG.LOADING,
        load
    }
}
export function setLoadingPost(load) {
    return {
        type: HUTANG.LOADING,
        load
    }
}
export function setHutang(data = []) {
    return {
        type: HUTANG.SUCCESS,
        data
    }
}

export function setCode(data = []) {
    return {
        type: HUTANG.SUCCESS_CODE,
        data
    }
}
export function setFailed(data = []) {
    return {
        type: HUTANG.FAILED,
        data
    }
}

export const FetchHutang = (nota) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `hutang/get?nota=${nota}`)
            .then(function (response) {
                const data = response.data;
                console.log(data);
                dispatch(FetchNotaHutang(data.result.lokasi));
                dispatch(setHutang(data));
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                dispatch(setLoading(false));
                Swal.fire({
                    title: 'Failed',
                    type: 'danger',
                    text: "Data Tidak Ditemukan",
                });
            })

    }
}

export const FetchNotaHutang = (lokasi) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `hutang/getcode?lokasi=${lokasi}`)
            .then(function (response) {
                const data = response.data;
                dispatch(setCode(data));
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error

                console.log(error);

            })

    }
}

export const storeHutang = (data) => {
    return (dispatch) => {
        dispatch(setLoadingPost(true));
        const url = HEADERS.URL + `hutang/bayar`;
        axios.post(url, data)
            .then(function (response) {
                // const data = (response.data);

                dispatch(setLoadingPost(false));
                Swal.fire({
                    title: 'Success',
                    type: 'success',
                    text:"Transaksi Berhasil",
                }).then((result)=>{
                    localStorage.removeItem("nota_pembelian_hutang");
                    localStorage.removeItem("jenis_trx_hutang");
                    window.location.reload();
                });
            })
            .catch(function (error) {
                dispatch(setLoadingPost(false));
                Swal.fire({
                    title: 'Failed',
                    type: 'danger',
                    text: error.response.data.msg,
                });

                if (error.response) {
                    console.log("error")
                }
            })
    }
}

