import {LOCATION, HEADERS} from "../../_constants";
import axios from 'axios';
import Swal from "sweetalert2";

export function setLoading(load){
    return {type : LOCATION.LOADING,load}
}
export function setDetailLocation(data=[]){
    return {type:LOCATION.DETAIL,data}
}
export function setEditLocation(data=[]){
    return {type:LOCATION.EDIT,data}
}
export function setAllLocation(data=[]){
    return {type:LOCATION.ALL,data}
}
export function setLocation(data=[]){
    return {type:LOCATION.SUCCESS,data}
}
export function setLocationFailed(data=[]){
    return {type:LOCATION.FAILED,data}
}
export const FetchLocation = (page=1,q='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        const headers={
            headers:{'Content-Type': 'application/x-www-form-urlencoded'}
        };
        let url = '';
        if(q===''){
            url = `lokasi?page=${page}`;
        }else{
            url = `lokasi?page=${page}&q=${q}`;
        }
        console.log(url)
        axios.get(HEADERS.URL+`${url}`,headers)
            .then(function(response){
                const data = response.data;
                dispatch(setLocation(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}

export const FetchAllLocation = (page=1)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        const headers={
            headers:{'Content-Type': 'application/x-www-form-urlencoded'}
        };
        axios.get(HEADERS.URL+`lokasi?page=${page}&perpage=50`,headers)
            .then(function(response){
                const data = response.data;
                console.log("SEMUA DATA LOKASI",data);
                dispatch(setAllLocation(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}
export const FetchDetailLocation = (id)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        const headers={
            headers:{'Content-Type': 'application/x-www-form-urlencoded'}
        };
        axios.get(HEADERS.URL+`lokasi/${id}`,headers)
            .then(function(response){
                const data = response.data;
                dispatch(setDetailLocation(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}
export const FetchEditLocation = (id)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        const headers={
            headers:{'Content-Type': 'application/x-www-form-urlencoded'}
        };
        axios.get(HEADERS.URL+`lokasi/${id}`,headers)
            .then(function(response){
                const data = response.data;
                dispatch(setEditLocation(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}

export const createLocation = (data,token) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `lokasi`;
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
                'username': `${HEADERS.USERNAME}`,
                'password': `${HEADERS.PASSWORD}`,
                'crossDomain': true
            }
        };
        axios.post(url, data, headers)
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
                dispatch(FetchLocation(1,''));

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

export const updateLocation = (id,data,token) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `lokasi/${id}`;
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
                'username': `${HEADERS.USERNAME}`,
                'password': `${HEADERS.PASSWORD}`,
                'crossDomain': true
            }
        }
        axios.put(url, data, headers)
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
                dispatch(FetchLocation(1,''));
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
export const deleteLocation = (id,token) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `lokasi/${id}`;
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
                dispatch(FetchLocation(localStorage.getItem("pageLocation")?localStorage.getItem("pageLocation"):1,''));
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