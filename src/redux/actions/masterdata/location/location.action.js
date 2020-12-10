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
        
        axios.get(HEADERS.URL+`${url}`,headers)
            .then(function(response){
                const data = response.data;
                dispatch(setLocation(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
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
                
                dispatch(setAllLocation(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
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
            
        })
    }
}

export const createLocation = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `lokasi`;

        axios.post(url, data)
            .then(function (response) {
                const data = (response.data)
                if (data.status === 'success') {
                    Swal.fire({allowOutsideClick: false,
                        title: 'Success',
                        type: 'success',
                        text: data.msg,
                    });
                } else {
                    Swal.fire({allowOutsideClick: false,
                        title: 'failed',
                        type: 'error',
                        text: data.msg,
                    });
                }
                dispatch(setLoading(false));
                dispatch(FetchLocation(1,''));

            })
            .catch(function (error) {
                dispatch(setLoading(false));
                Swal.fire({allowOutsideClick: false,
                    title: 'failed',
                    type: 'error',
                    text: error.response === undefined?'error!':error.response.data.msg,
                });

                if (error.response) {
                    
                }
            })
    }
}

export const updateLocation = (id,data) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `lokasi/${id}`;

        axios.put(url, data)
            .then(function (response) {
                const data = (response.data);
                if (data.status === 'success') {
                    Swal.fire({allowOutsideClick: false,
                        title: 'Success',
                        type: 'success',
                        text: data.msg,
                    });
                } else {
                    Swal.fire({allowOutsideClick: false,
                        title: 'failed',
                        type: 'error',
                        text: data.msg,
                    });
                }
                dispatch(setLoading(false));
                dispatch(FetchLocation(1,''));
            })
            .catch(function (error) {
                // handle error
                dispatch(setLoading(false));
                
                Swal.fire({allowOutsideClick: false,
                    title: 'failed',
                    type: 'error',
                    text: error.response === undefined?'error!':error.response.data.msg,
                });
                if (error.response) {
                    
                }
            })
    }
}
export const deleteLocation = (id) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `lokasi/${id}`;

        axios.delete(url)
            .then(function (response) {
                const data = (response.data);
                if (data.status === 'success') {
                    Swal.fire({allowOutsideClick: false,
                        title: 'Success',
                        type: 'success',
                        text: data.msg,
                    });
                } else {
                    Swal.fire({allowOutsideClick: false,
                        title: 'failed',
                        type: 'error',
                        text: data.msg,
                    });
                }
                dispatch(setLoading(false));
                dispatch(FetchLocation(localStorage.getItem("pageLocation")?localStorage.getItem("pageLocation"):1,''));
            })
            .catch(function (error) {
                dispatch(setLoading(false));
                
                Swal.fire({allowOutsideClick: false,
                    title: 'failed',
                    type: 'error',
                    text: error.response === undefined?'error!':error.response.data.msg,
                });
                if (error.response) {
                    
                }
            })
    }
}