import {
    TRANSACTION,
    HEADERS
} from "../_constants"
import axios from "axios"
import Swal from 'sweetalert2'
import {setLoading} from "../masterdata/customer/customer.action";

export function setLoadingApprovalTransaction(load) {
    return {
        type: TRANSACTION.APPROVAL_TRANSACTION_LOADING,
        load
    }
}
export function setApprovalTransaction(data = []) {
    return {
        type: TRANSACTION.APPROVAL_TRANSACTION_DATA,
        data
    }
}
export function setApprovalTransactionDetail(data = []) {
    return {
        type: TRANSACTION.APPROVAL_TUTATION_DATA_DETAIL,
        data
    }
}

export function setApprovalTransactionFailed(data = []) {
    return {
        type: TRANSACTION.APPROVAL_TRANSACTION_FAILED,
        data
    }
}

export function setTransaction(data=[]){
    return {type:TRANSACTION.SUCCESS,data}
}

export function setTransactionExcel(data=[]){
    return {type:TRANSACTION.SUCCESS_EXCEL,data}
}

export function setTransactionData(data=[]){
    return {type:TRANSACTION.SUCCESS_DATA,data}
}


export const FetchApprovalTransaction = (page = 1,q='',lokasi='',param='') => {
    return (dispatch) => {
        dispatch(setLoadingApprovalTransaction(true));
        let url=`mutasi?page=${page}`;
        if(q!==''){
            if(url!==''){url+='&';}
            url+=`q=${q}`;
        }
        if(lokasi!==''){
            if(url!==''){url+='&';}
            url+=`lokasi=${lokasi}`;
        }
        if(param!==''){
            if(url!==''){url+='&';}
            url+=`type=${param}`;
        }
        axios.get(HEADERS.URL + url)
            .then(function (response) {
                const data = response.data;
                dispatch(setApprovalTransaction(data));
                dispatch(setLoadingApprovalTransaction(false));
            })
            .catch(function (error) {
                // handle error
                
            })

    }
}

export const FetchApprovalTransactionDetail = (page = 1,kd_trx) => {
    return (dispatch) => {
        dispatch(setLoadingApprovalTransaction(true));
        let url=`mutasi/${kd_trx}/?page=${page}`;
        axios.get(HEADERS.URL + url)
            .then(function (response) {
                const data = response.data;
                dispatch(setApprovalTransactionDetail(data));
                dispatch(setLoadingApprovalTransaction(false));
            })
            .catch(function (error) {
                // handle error
                
            })

    }
}

export const saveApprovalTransaction = (data) => {
    return (dispatch) => {
        // dispatch(setLoading(true))
        const url = HEADERS.URL + `mutasi/approve`;
        axios.post(url, data)
            .then(function (response) {
                const data = (response.data)
                if (data.status === 'success') {
                    Toast.fire({
                        icon: 'success',
                        title: data.msg
                    })
                } else {
                    Swal.fire({
                        title: 'failed',
                        type: 'danger',
                        text: data.msg,
                    });
                }
                // dispatch(setLoading(false));
            })
            .catch(function (error) {
                // dispatch(setLoading(false));
                // Swal.fire({
                //     title: 'failed',
                //     type: 'danger',
                //     text: error.response.data.msg,
                // });

                if (error.response) {
                    
                }
            })
    }
}

export const FetchTransaction = (page=1,where='')=>{
    return (dispatch) => {
        dispatch(setLoadingApprovalTransaction(true));
        let url=`alokasi_trx/report?page=${page==='NaN'||page===null||page===''||page===undefined?1:page}`;
        if(where!==''){
            url+=where
        }
        
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                
                dispatch(setTransaction(data));
                dispatch(setLoadingApprovalTransaction(false));
            }).catch(function(error){
            
        })
    }
}

export const FetchTransactionExcel = (page=1,where='',perpage=99999)=>{
    return (dispatch) => {
        dispatch(setLoadingApprovalTransaction(true));
        let url=`alokasi_trx/report?page=${page==='NaN'||page===null||page===''||page===undefined?1:page}&perpage=${perpage}`;
        if(where!==''){
            url+=where
        }
        
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                
                dispatch(setTransactionExcel(data));
                dispatch(setLoadingApprovalTransaction(false));
            }).catch(function(error){
            
        })
    }
}
export const FetchTransactionData = (page=1,code,dateFrom='',dateTo='',location='')=>{
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
        
        axios.get(HEADERS.URL+`${que}`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setTransactionData(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})
