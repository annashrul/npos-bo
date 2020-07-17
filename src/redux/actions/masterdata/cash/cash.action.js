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
export const FetchCash = (page=1,type='masuk',param)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        const headers={
            headers:{'Content-Type': 'application/x-www-form-urlencoded'}
        };
        let q = '';
        if(param !== '' && param!==null){
            q = '&q='+param;
        }else{
            q = '';
        }
        axios.get(HEADERS.URL+`kas?page=${page}&type=${type}${q}`)
            .then(function(response){
                const data = response.data;
                console.log(data);
                dispatch(setCash(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}
export const FetchCashDetail = (id)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        const headers={
            headers:{'Content-Type': 'application/x-www-form-urlencoded'}
        };
        axios.get(HEADERS.URL+`kas/${id}`)
            .then(function(response){
                const data = response.data;
                console.log(data);
                dispatch(setCash(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
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
                console.log("DATA",data);
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
                dispatch(FetchCash(1,'masuk',''));
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



export const updateCash = (id,data) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `kas/${id}`;

        axios.put(url, data)
            .then(function (response) {
                const data = (response.data);
                console.log("DATA",data);
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
                dispatch(FetchCash(1,'masuk',''));
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
        // console.log("=============== DELETE ====================");

        axios.delete(url)
            .then(function (response) {
                const data = (response.data);
                console.log("DATA",data);
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
                dispatch(FetchCash(1,'masuk',''));
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