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
export function setLoadingReportDetail(load) {
    return {
        type: RECEIVE.LOADING_REPORT_DETAIL,
        load
    }
}
export function setPO(data = []) {
    return {
        type: RECEIVE.SUCCESS,
        data
    }
}
export function setPoData(data = []) {
    return {
        type: RECEIVE.RECEIVE_DATA,
        data
    }
}
export function setReport(data = []) {
    return {
        type: RECEIVE.SUCCESS_REPORT,
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
export function setReportDetail(data=[]){
    return {type:RECEIVE.RECEIVE_REPORT_DETAIL,data}
}
export const FetchNota = (lokasi) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `receive/getcode?lokasi=${lokasi}`)
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
export const storeReceive= (data,param) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const rawdata = data;
        const url = HEADERS.URL + `receive`;
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
                    destroy('receive');
                    localStorage.removeItem('sp');
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
                    param({
                        pathname: '/pembelian3ply',
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
export const updateReceive= (data,kode) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `receive/${kode}`;
        axios.put(url, data.detail)
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
                    destroy('receive');
                    localStorage.removeItem('sp');
                    localStorage.removeItem('lk');
                    localStorage.removeItem('ambil_data');
                    localStorage.removeItem('nota');
                    localStorage.removeItem('catatan');
                    localStorage.removeItem('data_master_receive');
                    localStorage.removeItem('data_detail_receive');

                    window.location.href = `/receive_report`;

                })
                dispatch(setLoading(false));

            })
            .catch(function (error) {

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

export const FetchReport = (page = 1,where='') => {
    return (dispatch) => {
        dispatch(setLoading(true));
        let url=`receive/report?page=${page==='NaN'||page===NaN?1:page}`;
        if(where!==''){
            url+=`&${where}`
        }
        
        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setPO(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })

    }
}
export const FetchReceiveData = (nota,param='') => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `receive/ambil_data/${nota}`)
            .then(function (response) {
                const data = response.data;
                    dispatch(setPoData(data));
                    dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error
                
            })

    }
}
export const FetchReportDetail = (page=1,code)=>{
    return (dispatch) => {
        dispatch(setLoadingReportDetail(true));
        axios.get(HEADERS.URL+`receive/report/${code}?page=${page}`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setReportDetail(data));
                dispatch(setLoadingReportDetail(false));
            }).catch(function(error){
            
        })
    }
}
export const FetchReportExcel = (page=1,where='',perpage='') => {
    return (dispatch) => {
        dispatch(setLoading(true));
        let url=`receive/report?page=${isNaN(page)||page==='NaN'?1:page}&perpage=${isNaN(perpage)||perpage==='NaN'?99999:perpage}`;
        if(where!==''){
            url+=`&${where}`
        }
        
        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setPO(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })

    }
}
export const deleteReceiveReport = (id) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `receive/${id}`;
        axios.delete(url)
            .then(function (response) {
                const data = (response.data);
                if (data.status === 'success') {
                    Swal.fire({
                        title: 'Success',
                        type: 'success',
                        text: data.msg,
                    });
                } else {
                    Swal.fire({
                        title: 'failed',
                        type: 'error',
                        text: data.msg,
                    });
                }
                dispatch(setLoading(false));
                dispatch(FetchReport(1,''));
            })
            .catch(function (error) {
                dispatch(setLoading(false));
                Swal.fire({
                    title: 'failed',
                    type: 'error',
                    text: error.response.data.msg,
                });
                if (error.response) {
                    
                }
            })
    }
}
