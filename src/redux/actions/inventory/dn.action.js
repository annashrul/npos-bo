import {
    DN,
    HEADERS
} from "../_constants"
import axios from "axios"
import Swal from 'sweetalert2'
import {
    destroy
} from "components/model/app.model";


export function setLoading(load) {
    return {
        type: DN.LOADING,
        load
    }
}
export function setDN(data = []) {
    return {
        type: DN.SUCCESS,
        data
    }
}

export function setDnData(data = []) {
    return {
        type: DN.DN_DATA,
        data
    }
}
export function setReport(data = []) {
    return {
        type: DN.REPORT_SUCCESS,
        data
    }
}
export function setCode(data = []) {
    return {
        type: DN.SUCCESS_CODE,
        data
    }
}
export function setPOFailed(data = []) {
    return {
        type: DN.FAILED,
        data
    }
}

export const FetchDnReport = (page = 1, perpage = 10) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `deliverynote/report?page=${page}&perpage=${perpage}&status=0`)
            .then(function (response) {
                const data = response.data
                dispatch(setReport(data))
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    }
}

export const FetchDnData = (nota) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `deliverynote/ambil_data/${nota}`)
            .then(function (response) {
                const data = response.data
                dispatch(setDnData(data))
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    }
}

export const FetchNota = (lokasi) => {
    return (dispatch) => {
        dispatch(setLoading(true));

        axios.get(HEADERS.URL + `deliverynote/getcode?lokasi=${lokasi}`)
            .then(function (response) {
                const data = response.data
                dispatch(setCode(data))
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    }
}

export const storeDN = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `deliverynote`;
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
                    destroy('delivery_note');
                    localStorage.removeItem('lk2');
                    localStorage.removeItem('lk');
                    localStorage.removeItem('ambil_data');
                    localStorage.removeItem('nota');
                    localStorage.removeItem('catatan');;
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
