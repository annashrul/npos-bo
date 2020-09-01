import {GROUP_PRODUCT, HEADERS} from "../../_constants";
import axios from 'axios'
import Swal from "sweetalert2";


export function setLoading(load){
    return {type : GROUP_PRODUCT.LOADING,load}
}

export function setGroupProduct(data=[]){
    return {type:GROUP_PRODUCT.SUCCESS,data}
}
export function setGroupProductFailed(data=[]){
    return {type:GROUP_PRODUCT.FAILED,data}
}
export const FetchGroupProduct = (page=1,q='',perpage='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = '';
        if(q===''){
            url=`kelompokBrg?page=${page}`;
        }else{
            url=`kelompokBrg?page=${page}&q=${q}`;
        }
        if(perpage!==''){
            url+=`&perpage=${perpage}`
        }
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                
                dispatch(setGroupProduct(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}


export const createGroupProduct = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `kelompokBrg`;
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
                dispatch(FetchGroupProduct(localStorage.getItem("page_group_product")?localStorage.getItem("page_group_product"):1,''));

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
export const updateGroupProduct = (id,data) => {
    
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `kelompokBrg/${id}`;
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
                dispatch(FetchGroupProduct(localStorage.getItem("page_group_product")?localStorage.getItem("page_group_product"):1,''));

            })
            .catch(function (error) {
                // handle error
                dispatch(setLoading(false));
                
                // Swal.fire({
                //     title: 'failed',
                //     type: 'error',
                //     text: error.response.data.msg,
                // });
                if (error.response) {
                    
                }
            })
    }
}
export const deleteGroupProduct = (id) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `kelompokBrg/${id}`;
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
                dispatch(FetchGroupProduct(localStorage.getItem("page_group_product")?localStorage.getItem("page_group_product"):1,''));
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