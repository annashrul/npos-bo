import {
    RECEIVE,
    HEADERS
} from "../../_constants"
import axios from "axios"
import Swal from 'sweetalert2'
import {destroy} from "components/model/app.model";


export function setLoading(load) {
    return {
        type: RECEIVE.LOADING,
        load
    }
}
export function setPO(data = []) {
    return {
        type: RECEIVE.SUCCESS,
        data
    }
}
export function setCode(data = []) {
    return {
        type: RECEIVE.SUCCESS_CODE,
        data
    }
}
export function setNewest(dataNew = []) {
    return {
        type: RECEIVE.SUCCESS_NEWEST,
        dataNew
    }
}

export function setPOFailed(data = []) {
    return {
        type: RECEIVE.FAILED,
        data
    }
}
export const FetchNota = (lokasi) => {
    return (dispatch) => {
        dispatch(setLoading(true));
       
        axios.get(HEADERS.URL + `receive/getcode?lokasi=${lokasi}`)
            .then(function (response) {
                const data = response.data
                console.log(data);
                dispatch(setCode(data))
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    }
}

export const storeReceive= (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `receive`;
        axios.post(url, data)
            .then(function (response) {
                const data = (response.data)
                Swal.fire({
                    title: 'Transaksi berhasil.',
                    text: `Disimpan dengan nota: ${data.result.insertId}`,
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#ff9800',
                    cancelButtonColor: '#2196F3',
                    confirmButtonText: 'Print Nota?',
                    cancelButtonText: 'Oke!'
                }).then((result) => {
                    if (result.value) {
                        const win = window.open('http://google.com', '_blank');
                        if (win != null) {
                            win.focus();
                        }
                    }
                    destroy('receive');
                    localStorage.removeItem('sp');
                    localStorage.removeItem('lk');
                    localStorage.removeItem('ambil_data');
                    localStorage.removeItem('nota');
                    localStorage.removeItem('catatan');
                    window.location.reload(false);
                })
                dispatch(setLoading(false));

            })
            .catch(function (error) {

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