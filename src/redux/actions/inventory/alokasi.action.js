import {
    ALOKASI,
    HEADERS
} from "../_constants"
import axios from "axios"
import Swal from 'sweetalert2'
import {
    destroy
} from "components/model/app.model";


export function setLoading(load) {
    return {
        type: ALOKASI.LOADING,
        load
    }
}
export function setLoadingDetail(load){
    return {
        type : ALOKASI.LOADING_DETAIL,
        load}
}
export function setALOKASI(data = []) {
    return {
        type: ALOKASI.SUCCESS,
        data
    }
}
export function setAlokasiExcel(data = []) {
    return {
        type: ALOKASI.SUCCESS_EXCEL,
        data
    }
}

export function setALOKASIData(data = []) {
    return {
        type: ALOKASI.ALOKASI_DATA,
        data
    }
}
export function setReport(data = []) {
    return {
        type: ALOKASI.REPORT_SUCCESS,
        data
    }
}
export function setCode(data = []) {
    return {
        type: ALOKASI.SUCCESS_CODE,
        data
    }
}
export function setPOFailed(data = []) {
    return {
        type: ALOKASI.FAILED,
        data
    }
}

// export function setAlokasi(data=[]){
//     return {type:ALOKASI.SUCCESS,data}
// }
export function setAlokasiDetail(data=[]){
    return {type:ALOKASI.DETAIL,data}
}

export const FetchDnReport = (page = 1, perpage = 10) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `purchaseorder/report?page=${page}&perpage=${perpage}&status=0`)
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
export const FetchDnData = (nota) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `purchaseorder/ambil_data/${nota}`)
            .then(function (response) {
                const data = response.data
                dispatch(setALOKASIData(data))
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error
                
            })

    }
}
export const FetchNota = (lokasi, prefix) => {
    return (dispatch) => {
        dispatch(setLoading(true));

        axios.get(HEADERS.URL + `alokasi/getcode?lokasi=${lokasi}&prefix=${prefix}`)
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
export const storeAlokasi = (data,param) => {
    return (dispatch) => {
        Swal.fire({
            allowOutsideClick: false,
            title: 'Please Wait.',
            html: 'Sending request..',
            onBeforeOpen: () => {
                Swal.showLoading()
            },
            onClose: () => {}
        })
        dispatch(setLoading(true))
        const url = HEADERS.URL + `alokasi`;
        axios.post(url, data.detail)
            .then(function (response) {
                Swal.close()
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
                    destroy('alokasi');
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
                    //     pathname: `/alokasi3ply/${response.data.result.insertId}`
                    // })
                    const win = window.open(`/alokasi3ply/${response.data.result.insertId}`, '_blank');
                    if (win != null) {
                        win.focus();
                    }
                    //Swal.closeModal();==
                    return false;
                });
                dispatch(setLoading(false));

            })
            .catch(function (error) {
                Swal.close()

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
export const updateAlokasi = (data,param) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `alokasi/${data['nota']}`;
        axios.put(url, data.detail)
            .then(function (response) {
                const data = (response.data)
                Swal.fire({allowOutsideClick: false,
                    title: 'Transaksi berhasil diperbarui.',
                    type: 'info',
                    html: `Nota: ${data.result.insertId}` +
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
                    destroy('alokasi');
                    localStorage.removeItem('lk2');
                    localStorage.removeItem('lk');
                    localStorage.removeItem('ambil_data');
                    localStorage.removeItem('nota');
                    localStorage.removeItem('catatan');
                    
                    if(result.dismiss === 'cancel'){
                        window.history.back();
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
                    //     pathname: `/alokasi3ply/${response.data.result.insertId}`
                    // })
                    const win = window.open(`/alokasi3ply/${response.data.result.insertId}`, '_blank');
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
export const FetchAlokasi = (page=1,where='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = `alokasi/report?page=${page}`;
        if(where!==''){
            url+=where
        }
        
        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setALOKASI(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}
export const FetchAlokasiExcel = (page=1,where='',perpage=99999)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = `alokasi/report?page=${page}&perpage=${perpage}`;
        if(where!==''){
            url+=where
        }
        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setAlokasiExcel(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}
export const FetchAlokasiDetail = (page=1,code,dateFrom='',dateTo='',location='',perpage='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let que = '';
        if(dateFrom===''&&dateTo===''&&location===''){
            que = `alokasi/report/${code}?page=${page}`;
        }
        if(dateFrom!==''&&dateTo!==''&&location===''){
            que = `alokasi/report/${code}?page=${page}&datefrom=${dateFrom}&dateto=${dateFrom}`;
        }
        if(dateFrom!==''&&dateTo!==''&&location!==''){
            que = `alokasi/report/${code}?page=${page}&datefrom=${dateFrom}&dateto=${dateFrom}&lokasi=${location}`;
        }
        if(location!==''){
            que = `alokasi/report/${code}?page=${page}&lokasi=${location}`;
        }

        if(perpage!==''){
            que +=`&perpage=${perpage}`
        }
        
        axios.get(HEADERS.URL+`${que}`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setALOKASIData(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}
export const FetchAlokasiData = (page=1,code)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let que = `alokasi/get/${code}`;
        
        axios.get(HEADERS.URL+`${que}`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setALOKASIData(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}
