import {CASH, HEADERS} from "../../_constants";
import axios from 'axios';
import Swal from "sweetalert2";


export function setLoading(load){
    return {type : CASH.LOADING,load}
}
export function setCash(data=[]){
    return {type:CASH.SUCCESS,data}
}
export function setCashFailed(data=[]){
    return {type:CASH.FAILED,data}
}


export function setLoadingReport(load){
    return {type : CASH.LOADING_REPORT,load}
}
export function setCashReport(data=[]){
    return {type:CASH.SUCCESS_REPORT,data}
}
export function setCashFailedReport(data=[]){
    return {type:CASH.FAILED_REPORT,data}
}

export function setCashReportExcel(data=[]){
    return {type : CASH.EXCEL_REPORT,data}
}

export const FetchCash = (page=1,type='masuk',param)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        
        let q = '';
        if(param !== '' && param!==null){
            q = '&q='+param;
        }else{
            q = '';
        }
        axios.get(HEADERS.URL+`kas?page=${page}&type=${type}${q}`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setCash(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}
export const FetchCashDetail = (id)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        
        axios.get(HEADERS.URL+`kas/${id}`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setCash(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}
export const createCash = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `kas`;
        axios.post(url,data)
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
                dispatch(FetchCash(1,'masuk',''));
            })
            .catch(function (error) {
                // handle error
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
export const updateCash = (id,data) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `kas/${id}`;

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
                        type: 'error',
                        text: data.msg,
                    });
                }
                dispatch(setLoading(false));
                dispatch(FetchCash(1,'masuk',''));
            })
            .catch(function (error) {
                // handle error
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
export const deleteCash = (id) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `kas/${id}`;
        // const headers = {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `${token}`,
        //         'username': `${HEADERS.USERNAME}`,
        //         'password': `${HEADERS.PASSWORD}`,
        //         'crossDomain': true
        //     }
        // }
        // 

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
                dispatch(FetchCash(1,'masuk',''));
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


export const FetchCashReport = (page=1,where='')=>{
    return (dispatch) => {
        dispatch(setLoadingReport(true));
        // pos/report?page=1&param=kas&kassa=A&lokasi=LK%2F0001&datefrom=2020-01-01&dateto=2020-07-30&type_kas=masuk
        let url = `pos/report?page=${page}&param=kas&isbo=true`;
        if(where!==''){
            url+=`&${where}`;
        }
        
        axios.post(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                
                dispatch(setCashReport(data));
                dispatch(setLoadingReport(false));
            }).catch(function(error){
            
        })
    }
}
export const FetchCashReportExcel = (where='',perpage='')=>{
    return (dispatch) => {
        dispatch(setLoadingReport(true));
        let url = `pos/report?page=1&param=kas&isbo=true&perpage=${perpage}`;
        if(where!==''){
            url+=`&${where}`;
        }
        axios.post(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                dispatch(setCashReportExcel(data));
                dispatch(setLoadingReport(false));
            }).catch(function(error){
            
        })
    }
}
