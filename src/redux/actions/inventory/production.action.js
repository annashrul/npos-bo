import {
    PRODUCTION,
    HEADERS
} from "../_constants"
import axios from "axios"
import Swal from 'sweetalert2'
import {setLoading} from "../masterdata/customer/customer.action";

export function setLoadingApprovalProduction(load) {
    return {
        type: PRODUCTION.APPROVAL_PRODUCTION_LOADING,
        load
    }
}
export function setApprovalProduction(data = []) {
    return {
        type: PRODUCTION.APPROVAL_PRODUCTION_DATA,
        data
    }
}
export function setApprovalProductionDetail(data = []) {
    return {
        type: PRODUCTION.APPROVAL_TUTATION_DATA_DETAIL,
        data
    }
}

export function setApprovalProductionFailed(data = []) {
    return {
        type: PRODUCTION.APPROVAL_PRODUCTION_FAILED,
        data
    }
}

export function setProduction(data=[]){
    return {type:PRODUCTION.SUCCESS,data}
}

export function setProductionExcel(data=[]){
    return {type:PRODUCTION.SUCCESS_EXCEL,data}
}

export function setProductionData(data=[]){
    return {type:PRODUCTION.SUCCESS_DATA,data}
}


export const FetchApprovalProduction = (page = 1,q='',lokasi='',param='') => {
    return (dispatch) => {
        dispatch(setLoadingApprovalProduction(true));
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
                dispatch(setApprovalProduction(data));
                dispatch(setLoadingApprovalProduction(false));
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    }
}

export const FetchApprovalProductionDetail = (page = 1,kd_trx) => {
    return (dispatch) => {
        dispatch(setLoadingApprovalProduction(true));
        let url=`mutasi/${kd_trx}/?page=${page}`;
        axios.get(HEADERS.URL + url)
            .then(function (response) {
                const data = response.data;
                dispatch(setApprovalProductionDetail(data));
                dispatch(setLoadingApprovalProduction(false));
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    }
}

export const saveApprovalProduction = (data) => {
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
                    console.log("error")
                }
            })
    }
}

export const FetchProduction = (page=1,where='')=>{
    return (dispatch) => {
        dispatch(setLoadingApprovalProduction(true));
        let url=`production/report?page=${page==='NaN'||page===null||page===''||page===undefined?1:page}`;
        if(where!==''){
            url+=where
        }
        console.log(url)
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                console.log("FetchTrx",data);
                dispatch(setProduction(data));
                dispatch(setLoadingApprovalProduction(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}

export const FetchProductionExcel = (page=1,where='',perpage=99999)=>{
    return (dispatch) => {
        dispatch(setLoadingApprovalProduction(true));
        let url=`production/report?page=${page==='NaN'||page===null||page===''||page===undefined?1:page}&perpage=${perpage}`;
        if(where!==''){
            url+=where
        }
        console.log(url)
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                console.log("FetchTrx",data);
                dispatch(setProductionExcel(data));
                dispatch(setLoadingApprovalProduction(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}
export const FetchProductionData = (page=1,code,dateFrom='',dateTo='',location='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let que = '';
        if(dateFrom===''&&dateTo===''&&location===''){
            que = `production/report/${code}?page=${page}`;
        }
        if(dateFrom!==''&&dateTo!==''&&location===''){
            que = `production/report/${code}?page=${page}&datefrom=${dateFrom}&dateto=${dateFrom}`;
        }
        if(dateFrom!==''&&dateTo!==''&&location!==''){
            que = `production/report/${code}?page=${page}&datefrom=${dateFrom}&dateto=${dateFrom}&lokasi=${location}`;
        }
        if(location!==''){
            que = `production/report/${code}?page=${page}&lokasi=${location}`;
        }
        console.log("url production",`${que}`);
        axios.get(HEADERS.URL+`${que}`)
            .then(function(response){
                const data = response.data;
                console.log(data);
                dispatch(setProductionData(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
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
