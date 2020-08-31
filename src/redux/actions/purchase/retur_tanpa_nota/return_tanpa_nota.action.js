import {
    RETUR_TANPA_NOTA,
    HEADERS
} from "../../_constants"
import axios from "axios"
import Swal from 'sweetalert2'
import {destroy} from "components/model/app.model";


export function setLoading(load) {
    return {
        type: RETUR_TANPA_NOTA.LOADING,
        load
    }
}
export function setCode(data = []) {
    return {
        type: RETUR_TANPA_NOTA.SUCCESS_CODE,
        data
    }
}


export const storeReturTanpaNota = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `retur`;
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
                        const win = window.open(data.result.nota,'_blank');
                        if (win != null) {
                            win.focus();
                        }
                    }
                    destroy('retur_tanpa_nota');
                    localStorage.removeItem('grand_total');
                    localStorage.removeItem('sp');
                    localStorage.removeItem('lk');
                    window.location.reload(false);
                })
                dispatch(setLoading(false));

            })
            .catch(function (error) {
                dispatch(setLoading(false));

                Swal.fire({
                    title: 'Failed',
                    type: 'danger',
                    text: error.response.data.msg,
                });

                if (error.response) {
                    
                }
            })
    }
}
