import {AREA, HEADERS} from "../../_constants";
import axios from 'axios';
import Swal from "sweetalert2";

export function setLoading(load){
    return {type : AREA.LOADING,load}
}

export function setArea(data=[]){
    return {type:AREA.SUCCESS,data}
}
export function setAreaAll(data=[]){
    return {type:AREA.ALL,data}
}
export function setAreaFailed(data=[]){
    return {type:AREA.FAILED,data}
}

export const FetchArea = (page=1,q='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        
        let url = '';
        if(q===''){
            url = `area?page=${page}`;
        }else{
            url = `area?page=${page}&q=${q}`;
        }
        
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                
                dispatch(setArea(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}
export const FetchAreaAll = ()=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        
        axios.get(HEADERS.URL+`area?page=1&perpage=100`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setAreaAll(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}


export const createArea = (data,token) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `area`;

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
                        type: 'error',
                        text: data.msg,
                    });
                }
                dispatch(setLoading(false));
                dispatch(FetchArea(localStorage.getItem("page_area")?localStorage.getItem("page_area"):1,''));

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
export const updateArea = (id,data,token) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `area/${id}`;

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
                dispatch(FetchArea(localStorage.getItem("page_area")?localStorage.getItem("page_area"):1,''));
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
export const deleteArea = (id,token) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `area/${id}`;

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
                dispatch(FetchArea(localStorage.getItem("page_area")?localStorage.getItem("page_area"):1,''));
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