import {ADJUSTMENT, HEADERS} from "../_constants";
import axios from 'axios';
import Swal from "sweetalert2";
import {destroy} from "components/model/app.model";

export function setLoading(load){
    return {type : ADJUSTMENT.LOADING,load}
}

export function setAdjustment(data=[]){
    return {type:ADJUSTMENT.SUCCESS,data}
}
export function setAdjustmentAll(data=[]){
    return {type:ADJUSTMENT.ALL,data}
}
export function setAdjustmentExcel(data=[]){
    return {type:ADJUSTMENT.EXCEL,data}
}
export function setAdjustmentFailed(data=[]){
    return {type:ADJUSTMENT.FAILED,data}
}
export function setAdjustmentDetail(data=[]){
    return {type:ADJUSTMENT.DETAIL_TRANSAKSI,data}
}
export function setCodeAdjusment(data=[]){
    return {type:ADJUSTMENT.GET_CODE,data}
}

export const FetchAdjustment = (page=1,where='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));

        let url =  `adjustment/report?page=${page}`;
        if(where!==''){
            url+=where;
        }
        console.log("URL ADJUSMENT REPORT",url)
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                dispatch(setAdjustment(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}
export const FetchAdjustmentExcel = (where='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url =  `adjustment/report?page=1&perpage=10000`;
        if(where!==''){
            url+=where;
        }
        console.log("URL ADJUSMENT REPORT",url)
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                dispatch(setAdjustmentExcel(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}

export const FetchAdjustmentAll = ()=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        
        axios.get(HEADERS.URL+`adjustment/report?page=1&perpage=100`)
            .then(function(response){
                const data = response.data;
                dispatch(setAdjustmentAll(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}


export const storeAdjusment = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `adjustment`;
        axios.post(url, data)
            .then(function (response) {
                const data = (response.data)
                Swal.fire({
                    title: 'Transaksi berhasil.',
                    text: `Terimakasih Telah Melakukan Transaksi Di Toko Kami`,
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
                    destroy('adjusment');
                    localStorage.removeItem("lk");
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
export const updateAdjustment = (id,data,token) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `adjustment/report/${id}`;

        axios.put(url, data)
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
                        type: 'danger',
                        text: data.msg,
                    });
                }
                dispatch(setLoading(false));
                dispatch(FetchAdjustment(localStorage.getItem("page_adjustment")?localStorage.getItem("page_adjustment"):1,''));
            })
            .catch(function (error) {
                // handle error
                dispatch(setLoading(false));
                console.log(error);
                Swal.fire({
                    title: 'failed',
                    type: 'danger',
                    text: error.response.data.msg,
                });
                if (error.response) {
                    console.log("error")
                }
            })
    }
}
export const deleteAdjustment = (id) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `adjustment/${id}`;

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
                        type: 'danger',
                        text: data.msg,
                    });
                }
                dispatch(setLoading(false));
                dispatch(FetchAdjustment(1,''));
            })
            .catch(function (error) {
                dispatch(setLoading(false));
                console.log(error);
                Swal.fire({
                    title: 'failed',
                    type: 'danger',
                    text: error.response.data.msg,
                });
                if (error.response) {
                    console.log("error")
                }
            })
    }
}
export const FetchAdjustmentDetail = (page=1,code)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL+`adjustment/report/${code}/?page=${page}`)
            .then(function(response){
                const data = response.data;
                dispatch(setAdjustmentDetail(data));
                dispatch(setLoading(false));
            }).catch(function(error){
                dispatch(setLoading(false));
                console.log(error);
                Swal.fire({
                    title: 'failed',
                    type: 'danger',
                    text: error.response.data.msg,
                });
                if (error.response) {
                    console.log("error")
                }
        })
    }
}

export const FetchCodeAdjustment = (lokasi)=>{
    return (dispatch) => {
        axios.get(HEADERS.URL+`adjustment/getcode?lokasi=${lokasi}`)
            .then(function(response){
                const data = response.data;
                dispatch(setCodeAdjusment(data));
            }).catch(function(error){
            console.log(error)
        })
    }
}
