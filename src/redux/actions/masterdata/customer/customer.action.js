import {CUSTOMER, HEADERS} from "../../_constants";
import axios from 'axios'
import Swal from "sweetalert2";


export function setLoading(load){
    return {type : CUSTOMER.LOADING,load}
}
export function setCustomerEdit(data=[]){
    return {type:CUSTOMER.EDIT,data}
}
export function setCustomer(data=[]){
    return {type:CUSTOMER.SUCCESS,data}
}
export function setCustomerAll(data=[]){
    return {type:CUSTOMER.ALL,data}
}
export function setCustomerPrice(data=[]){
    return {type:CUSTOMER.LIST_PRICE,data}
}
export function setCustomerFailed(data=[]){
    return {type:CUSTOMER.FAILED,data}
}

export const FetchCustomer = (page=1,q)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        const headers={
            headers:{'Content-Type': 'application/x-www-form-urlencoded'}
        };
        let url = '';
        if(q===null||q===''||q===undefined){
            url=`customer?page=${page}`;
        }else{
            url=`customer?page=${page}&q=${q}`;
        }
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                console.log(data);
                dispatch(setCustomer(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}
export const FetchCustomerAll = ()=>{
    return (dispatch) => {
        dispatch(setLoading(true));

        axios.get(HEADERS.URL+`customer?page=1&perpage=100`)
            .then(function(response){
                const data = response.data;
                console.log(data);
                dispatch(setCustomerAll(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}


export const FetchCustomerEdit = (id)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        const headers={
            headers:{'Content-Type': 'application/x-www-form-urlencoded'}
        };
        axios.get(HEADERS.URL+`customer/${id}`,headers)
            .then(function(response){
                const data = response.data;
                dispatch(setCustomerEdit(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}


export const createCustomer = (data,token) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `customer`;
        
        axios.post(url, data)
            .then(function (response) {
                const data = (response.data)
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
                dispatch(FetchCustomer(1,''));

            })
            .catch(function (error) {
                dispatch(setLoading(false));
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
export const updateCustomer = (id,data,token) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `customer/${id}`;
        
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
                    console.log("tes : "+token);
                    Swal.fire({
                        title: 'failed',
                        type: 'danger',
                        text: data.msg,
                    });
                }
                dispatch(setLoading(false));
                dispatch(FetchCustomer(1,''));
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
export const deleteCustomer = (id,token) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `customer/${id}`;
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
                'username': `${HEADERS.USERNAME}`,
                'password': `${HEADERS.PASSWORD}`,
                'crossDomain': true
            }
        }

        axios.delete(url,headers)
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
                dispatch(FetchCustomer(localStorage.getItem("page_customer")?localStorage.getItem("page_customer"):1,''));
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



export const FetchCustomerPrice = (kode,page=1,q='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = '';
        if(q===''){
            url = `customer/harga/${kode}?page=${page}`;
        }else{
            url = `customer/harga/${kode}?page=${page}&q=${q}`;
        }
        console.log(url)
        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                console.log(data);
                dispatch(setCustomerPrice(data));
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

export const saveCustomerPrice = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `customer/harga`;

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
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                dispatch(setLoading(false));
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