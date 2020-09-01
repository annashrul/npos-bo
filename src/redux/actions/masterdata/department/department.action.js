import {DEPT, HEADERS} from "../../_constants";
import axios from 'axios';
import Swal from "sweetalert2";
import {FetchCash} from "../cash/cash.action";

export function setLoading(load){
    return {type : DEPT.LOADING,load}
}

export function setDepartment(data=[]){
    return {type:DEPT.SUCCESS,data}
}
export function setAllDepartment(data=[]){
    return {type:DEPT.ALL,data}
}
export function setDepartmentFailed(data=[]){
    return {type:DEPT.FAILED,data}
}
export const FetchDepartment = (page=1,q='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        const headers={
            headers:{'Content-Type': 'application/x-www-form-urlencoded'}
        };
        let url = '';
        if(q===''){
            url = `departement?page=${page}`;
        }else{
            url = `departement?page=${page}&q=${q}`;
        }
        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setDepartment(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}

export const createDepartment = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `departement`;

        
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
                dispatch(FetchDepartment(1,''));

            })
            .catch(function (error) {

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

export const updateDepartment = (id,data) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `departement/${id}`;

        
        
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
                dispatch(FetchDepartment(1,''));
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

export const deleteDepartment = (id,token) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `departement/${id}`;

        

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
                dispatch(FetchDepartment(1,''));
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

export const FetchAllDepartment = ()=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL+`departement?page=1&perpage=10000`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setAllDepartment(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}
