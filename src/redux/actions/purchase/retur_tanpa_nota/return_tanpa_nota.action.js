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


export const storeReturTanpaNota = (data,param) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        let rawdata = data;
        const url = HEADERS.URL + `retur`;
        axios.post(url, data.detail)
            .then(function (response) {
                const data = (response.data)
                Swal.fire({
                    title: 'Transaksi berhasil.',
                    type: 'info',
                    html: `Disimpan dengan nota: ${data.result.insertId}` +
                        "<br><br>" +
                        '<button type="button" role="button" tabindex="0" id="btnNotaPdf" class="btn btn-primary">Nota PDF</button>    ' +
                        '<button type="button" role="button" tabindex="0" id="btnNota3ply" class="btn btn-info">Nota 3ply</button>',
                    showCancelButton: true,
                    showConfirmButton: false
                }).then((result) => {
                    // if (result.value) {
                    //     const win = window.open(data.result.nota,'_blank');
                    //     if (win != null) {
                    //         win.focus();
                    //     }
                    // }
                    destroy('retur_tanpa_nota');
                    localStorage.removeItem('grand_total');
                    localStorage.removeItem('sp');
                    localStorage.removeItem('lk');
                    // window.location.reload(false);
                })
                document.getElementById("btnNotaPdf").addEventListener("click", () => {
                    const win = window.open(data.result.nota, '_blank');
                    if (win != null) {
                        win.focus();
                    }
                });
                document.getElementById("btnNota3ply").addEventListener("click", () => {
                    param({
                        pathname: '/retur3ply',
                        state: {
                            data: rawdata,
                            nota: data.result.kode
                        }
                    })
                    Swal.closeModal();
                    return false;
                });
                dispatch(setLoading(false));

            })
            .catch(function (error) {
                dispatch(setLoading(false));

                Swal.fire({
                    title: 'Failed',
                    type: 'error',
                    text: error.response.data.msg,
                });

                if (error.response) {
                    
                }
            })
    }
}
