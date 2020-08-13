import {
    PIUTANG,
    HEADERS
} from "../_constants"
import axios from "axios"
import Swal from 'sweetalert2'



export function setLoading(load) {
    return {
        type: PIUTANG.LOADING,
        load
    }
}
export function setLoadingPost(load) {
    return {
        type: PIUTANG.LOADING,
        load
    }
}
export function setPiutang(data = []) {
    return {
        type: PIUTANG.SUCCESS,
        data
    }
}

export function setCode(data = []) {
    return {
        type: PIUTANG.SUCCESS_CODE,
        data
    }
}
export function setFailed(data = []) {
    return {
        type: PIUTANG.FAILED,
        data
    }
}

export const FetchPiutang = (nota) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `piutang/get?nota=${nota}`)
            .then(function (response) {
                const data = response.data;
                console.log(data);
                dispatch(FetchNotaPiutang(data.result.lokasi));
                dispatch(setPiutang(data));
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

export const FetchNotaPiutang = (lokasi) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        // axios.get(HEADERS.URL + `piutang/getcode?lokasi=${lokasi}`)
        axios.get(HEADERS.URL + `piutang/getcode?lokasi=LK/0001`)
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

export const storePiutang = (data) => {
    return (dispatch) => {
        dispatch(setLoadingPost(true));
        const url = HEADERS.URL + `piutang/bayar`;
        axios.post(url, data)
            .then(function (response) {
                // const data = (response.data);

                dispatch(setLoadingPost(false));
                Swal.fire({
                    title: 'Success',
                    type: 'success',
                    text:"Transaksi Berhasil",
                }).then((result)=>{
                    localStorage.removeItem("nota_pembelian_piutang");
                    localStorage.removeItem("jenis_trx_piutang");
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

