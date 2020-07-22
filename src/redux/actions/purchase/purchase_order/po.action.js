import {
    PO,
    HEADERS
} from "../../_constants"
import axios from "axios"
import Swal from 'sweetalert2'
import {destroy} from "components/model/app.model";


export function setLoading(load) {
    return {
        type: PO.LOADING,
        load
    }
}
export function setLoadingDetail(load) {
    return {
        type: PO.LOADING_DETAIL,
        load
    }
}
export function setPO(data = []) {
    return {
        type: PO.SUCCESS,
        data
    }
}

export function setPoData(data = []) {
    return {
        type: PO.PO_DATA,
        data
    }
}
// export function setReport(data = []) {
//     return {
//         type: PO.REPORT_SUCCESS,
//         data
//     }
// }
// export function setReportDetail(data = []) {
//     return {
//         type: PO.PO_REPORT_DETAIL,
//         data
//     }
// }
export function setCode(data = []) {
    return {
        type: PO.SUCCESS_CODE,
        data
    }
}
export function setNewest(dataNew = []) {
    return {
        type: PO.SUCCESS_NEWEST,
        dataNew
    }
}

export function setPOFailed(data = []) {
    return {
        type: PO.FAILED,
        data
    }
}

export function setPoReport(data=[]){
    return {type:PO.SUCCESS,data}
}
export function setPoReportDetail(data=[]){
    return {type:PO.DETAIL,data}
}

export const FetchPoReport = (page=1, perpage=10) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `purchaseorder/report?page=${page}&perpage=${perpage}&status=0`)
            .then(function (response) {
                const data = response.data
                dispatch(setPoReport(data))
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    }
}

export const FetchPoData = (nota) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `purchaseorder/ambil_data/${nota}`)
            .then(function (response) {
                const data = response.data
                dispatch(setPoData(data))
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
       
        axios.get(HEADERS.URL + `purchaseorder/getcode?prefix=PO&lokasi=${lokasi}`)
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

export const storePo = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `purchaseorder`;
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
                    destroy('purchase_order');
                    localStorage.removeItem('sp');
                    localStorage.removeItem('lk');
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
export const fetchPoReport = (page=1,dateFrom='',dateTo='',location='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        // report/stock?page=1&datefrom=2020-01-01&dateto=2020-07-01&lokasi=LK%2F0001
        let que = '';
        if(dateFrom===''&&dateTo===''&&location===''){
            que = `purchaseorder/report?page=${page}`;
        }
        if(dateFrom!==''&&dateTo!==''&&location===''){
            que = `purchaseorder/report?page=${page}&datefrom=${dateFrom}&dateto=${dateFrom}`;
        }
        if(dateFrom!==''&&dateTo!==''&&location!==''){
            que = `purchaseorder/report?page=${page}&datefrom=${dateFrom}&dateto=${dateFrom}&lokasi=${location}`;
        }
        if(location!==''){
            que = `purchaseorder/report?page=${page}&lokasi=${location}`;
        }
        console.log(`${que}`);
        axios.get(HEADERS.URL+`${que}`)
            .then(function(response){
                const data = response.data;
                console.log(data);
                dispatch(setPoReport(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}
export const poReportDetail = (page=1,code,dateFrom='',dateTo='',location='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL+`purchaseorder/report/${code}?page=${page}`)
            .then(function(response){
                const data = response.data;
                console.log(data);
                dispatch(setPoReportDetail(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}
