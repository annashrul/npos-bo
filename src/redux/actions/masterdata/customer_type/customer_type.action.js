import {CUSTOMER_TYPE, HEADERS} from "../../_constants";
import axios from 'axios'
import Swal from "sweetalert2";
import {FetchCustomer} from "../customer/customer.action";


export function setLoading(load){
    return {type : CUSTOMER_TYPE.LOADING,load}
}

export function setCustomerType(data=[]){
    return {type:CUSTOMER_TYPE.SUCCESS,data}
}
export function setCustomerTypeAll(data=[]){
    return {type:CUSTOMER_TYPE.ALL,data}
}
export function setCustomerTypeFailed(data=[]){
    return {type:CUSTOMER_TYPE.FAILED,data}
}

export const FetchCustomerType = (page=1,q)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        const headers={
            headers:{'Content-Type': 'application/x-www-form-urlencoded'}
        };
        let url = '';
        if(q===null||q===''||q===undefined){
            url=`customerType?page=${page}`;
        }else{
            url=`customerType?page=${page}&q=${q}`;
        }
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                console.log(data);
                dispatch(setCustomerType(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}


export const FetchCustomerTypeAll = ()=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        const headers={
            headers:{'Content-Type': 'application/x-www-form-urlencoded'}
        };
        axios.get(HEADERS.URL+`customerType?page=1&perpage=100`)
            .then(function(response){
                const data = response.data;
                console.log(data);
                dispatch(setCustomerTypeAll(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}


export const createCustomerType = (data,token) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `customerType`;

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
                dispatch(FetchCustomerType(1,''));

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
export const updateCustomerType = (id,data,token) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `customerType/${id}`;

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
                dispatch(FetchCustomerType(1,''));
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
export const deleteCustomerType = (id,token) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `customerType/${id}`;
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
                dispatch(FetchCustomerType(localStorage.getItem("page_customer_type")?localStorage.getItem("page_customer_type"):1,''));
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