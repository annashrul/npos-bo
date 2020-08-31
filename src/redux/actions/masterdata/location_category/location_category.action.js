import {LOCATION_CATEGORY,HEADERS} from "../../_constants";
import axios from 'axios';
import Swal from "sweetalert2";
import {FetchLocation} from "../location/location.action";

export function setLoading(load){
    return {type : LOCATION_CATEGORY.LOADING,load}
}

export function setLocationCategory(data=[]){
    return {type:LOCATION_CATEGORY.SUCCESS,data}
}
export function setLocationCategoryFailed(data=[]){
    return {type:LOCATION_CATEGORY.FAILED,data}
}
export const FetchLocationCategory = (page=1,q='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        const headers={
            headers:{'Content-Type': 'application/x-www-form-urlencoded'}
        };
        let url = '';
        if(q===''){
            url=`lokasiKategori?page=${page}`;
        }else{
            url=`lokasiKategori?page=${page}&q=${q}`;
        }
        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                dispatch(setLocationCategory(data));
                dispatch(setLoading(false));
            }).catch(function(error){
                
        })
    }
}

export const createLocationCategory = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `lokasiKategori`;

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
                dispatch(FetchLocationCategory(localStorage.getItem("pageLocationCategory")?localStorage.getItem("pageLocationCategory"):1,''));

            })
            .catch(function (error) {
                dispatch(setLoading(false));
                Swal.fire({
                    title: 'failed',
                    type: 'danger',
                    text: error.response.data.msg,
                });

                if (error.response) {
                    
                }
            })
    }
}
export const updateLocationCategory = (id,data) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `lokasiKategori/${id}`;

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
                dispatch(FetchLocationCategory(localStorage.getItem("pageLocationCategory")?localStorage.getItem("pageLocationCategory"):1,''));

            })
            .catch(function (error) {
                // handle error
                dispatch(setLoading(false));
                
                Swal.fire({
                    title: 'failed',
                    type: 'danger',
                    text: error.response.data.msg,
                });
                if (error.response) {
                    
                }
            })
    }
}
export const deleteLocationCategory = (id) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `lokasiKategori/${id}`;
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
                        type: 'danger',
                        text: data.msg,
                    });
                }
                dispatch(setLoading(false));
                dispatch(FetchLocationCategory(localStorage.getItem("pageLocationCategory")?localStorage.getItem("pageLocationCategory"):1,''));
            })
            .catch(function (error) {
                dispatch(setLoading(false));
                
                Swal.fire({
                    title: 'failed',
                    type: 'danger',
                    text: error.response.data.msg,
                });
                if (error.response) {
                    
                }
            })
    }
}