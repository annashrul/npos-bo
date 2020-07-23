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

export const FetchApprovalMutation = (page = 1,q='',lokasi='') => {
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
        console.log(url);
        axios.get(HEADERS.URL + url)
            .then(function (response) {
                const data = response.data;
                console.log("DATA APPROVAL MUTATION",data);
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
                console.log("DATA APPROVAL MUTATION DETAIL",data);
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
                console.log("STATUS APPROVAL",data.status);
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
