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

export function setDnDetail(data = []) {
    return {
        type: DN.DN_DETAIL,
        data
    }
}
export function setReport(data = []) {
    return {
        type: DN.REPORT_SUCCESS,
        data
    }
}
export function setReportExcel(data = []) {
    return {
        type: DN.REPORT_SUCCESS_EXCEL,
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
                
            })

    }
}

export const FetchDn = (page=1,where='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = `deliverynote/report?page=${page}`;
        if(where!==''){
            url+=where
        }
        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setReport(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}

export const FetchDnExcel = (page=1,where='', perpage=99999)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = `deliverynote/report?page=${page}&perpage=${perpage}`;
        if(where!==''){
            url+=where
        }
        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setReportExcel(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
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
                
            })

    }
}

export const FetchDnDetail = (nota) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `deliverynote/report/${nota}`)
            .then(function (response) {
                const data = response.data
                dispatch(setDnDetail(data))
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error
                
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
                
            })

    }
}

export const storeDN = (data,param) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `deliverynote`;
        axios.post(url, data.detail)
            .then(function (response) {
                const data = (response.data)
                Swal.fire({allowOutsideClick: false,
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
                    destroy('delivery_note');
                    localStorage.removeItem('lk2');
                    localStorage.removeItem('lk');
                    localStorage.removeItem('ambil_data');
                    localStorage.removeItem('nota');
                    localStorage.removeItem('catatan');
                    if(result.dismiss === 'cancel'){
                        window.location.reload(false);
                    }
                })
                document.getElementById("btnNotaPdf").addEventListener("click", () => {
                    const win = window.open(data.result.nota, '_blank');
                    if (win != null) {
                        win.focus();
                    }
                });
                document.getElementById("btnNota3ply").addEventListener("click", () => {
                    // param({
                    //     pathname: `/dn3ply/${response.data.result.insertId}`
                    // })
                    const win = window.open(`/dn3ply/${response.data.result.insertId}`, '_blank');
                    if (win != null) {
                        win.focus();
                    }
                    //Swal.closeModal();==
                    return false;
                });
                dispatch(setLoading(false));

            })
            .catch(function (error) {

                Swal.fire({allowOutsideClick: false,
                    title: 'Failed',
                    type: 'error',
                    text: error.response === undefined?'error!':error.response.data.msg,
                });

                if (error.response) {
                    
                }
            })
    }
}
