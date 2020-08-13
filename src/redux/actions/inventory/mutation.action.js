import {
    MUTATION,
    HEADERS
} from "../_constants"
import axios from "axios"
import Swal from 'sweetalert2'
import {setLoading} from "../masterdata/customer/customer.action";

export function setLoadingApprovalMutation(load) {
    return {
        type: MUTATION.APPROVAL_MUTATION_LOADING,
        load
    }
}
export function setApprovalMutation(data = []) {
    return {
        type: MUTATION.APPROVAL_MUTATION_DATA,
        data
    }
}
export function setApprovalMutationDetail(data = []) {
    return {
        type: MUTATION.APPROVAL_TUTATION_DATA_DETAIL,
        data
    }
}

export function setApprovalMutationFailed(data = []) {
    return {
        type: MUTATION.APPROVAL_MUTATION_FAILED,
        data
    }
}

export function setMutation(data=[]){
    return {type:MUTATION.SUCCESS,data}
}

export function setMutationExcel(data=[]){
    return {type:MUTATION.SUCCESS_EXCEL,data}
}

export function setMutationData(data=[]){
    return {type:MUTATION.SUCCESS_DATA,data}
}


export const FetchApprovalMutation = (page = 1,q='',lokasi='',param='') => {
    return (dispatch) => {
        dispatch(setLoadingApprovalMutation(true));
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
                dispatch(setApprovalMutation(data));
                dispatch(setLoadingApprovalMutation(false));
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    }
}

export const FetchApprovalMutationDetail = (page = 1,kd_trx) => {
    return (dispatch) => {
        dispatch(setLoadingApprovalMutation(true));
        let url=`mutasi/${kd_trx}/?page=${page}`;
        axios.get(HEADERS.URL + url)
            .then(function (response) {
                const data = response.data;
                dispatch(setApprovalMutationDetail(data));
                dispatch(setLoadingApprovalMutation(false));
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    }
}

export const saveApprovalMutation = (data) => {
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

export const FetchMutation = (page=1,where='')=>{
    return (dispatch) => {
        dispatch(setLoadingApprovalMutation(true));
        let url=`mutasi/report?page=${page==='NaN'||page===null||page===''||page===undefined?1:page}`;
        if(where!==''){
            url+=where
        }
        console.log(url)
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                console.log("FetchMutasi",data);
                dispatch(setMutation(data));
                dispatch(setLoadingApprovalMutation(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}

export const FetchMutationExcel = (page=1,where='',perpage=99999)=>{
    return (dispatch) => {
        dispatch(setLoadingApprovalMutation(true));
        let url=`mutasi/report?page=${page==='NaN'||page===null||page===''||page===undefined?1:page}&perpage=${perpage}`;
        if(where!==''){
            url+=where
        }
        console.log(url)
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                console.log("FetchMutasi",data);
                dispatch(setMutationExcel(data));
                dispatch(setLoadingApprovalMutation(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}
export const FetchMutationData = (page=1,code,dateFrom='',dateTo='',location='')=>{
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
        console.log("url alokasi",`${que}`);
        axios.get(HEADERS.URL+`${que}`)
            .then(function(response){
                const data = response.data;
                console.log(data);
                dispatch(setMutationData(data));
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
