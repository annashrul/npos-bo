import {PROMO, HEADERS} from "../../_constants";
import axios from 'axios';
import Swal from "sweetalert2";


export function setLoading(load){
    return {type : PROMO.LOADING,load}
}
export function setPromo(data=[]){
    return {type:PROMO.SUCCESS,data}
}
export function setPromoBrg1(data=[]){
    return {type:PROMO.SUCCESS_BRG1,data}
}
export function setPromoBrg2(data=[]){
    return {type:PROMO.SUCCESS_BRG2,data}
}
export function setPromoKategori(data=[]){
    return {type:PROMO.SUCCESS_KATEGORI,data}
}
export function setPromoDetail(data=[]){
    return {type:PROMO.DETAIL,data}
}
export function setPromoFailed(data=[]){
    return {type:PROMO.FAILED,data}
}
export const FetchPromo = (page=1,where='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = `promo?page=${page}`;
        if(where!==''){
            url+=`&${where}`;
        }

        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setPromo(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
            dispatch(setLoading(false));
        })
    }
}
export const FetchPromoDetail = (id)=>{

    return (dispatch) => {
        dispatch(setLoading(true));
        let que = `promo/${id}`;
        axios.get(HEADERS.URL+`${que}`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setPromoDetail(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
            dispatch(setLoading(false));
        })
    }
}
export const FetchPromoKategori = ()=>{
    return (dispatch) => {
        let que = `promo/category`;
        axios.get(HEADERS.URL+`${que}`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setPromoKategori(data));
            }).catch(function(error){
            
            dispatch(setLoading(false));
        })
    }
}
export const createPromo = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `promo`;
        axios.post(url, data)
            .then(function (response) {
                const data = (response.data)
                if (data.status === 'success') {
                    Swal.fire({
                        title: 'Success',
                        type: 'success',
                        text: data.msg,
                    });
                    // window.location.reload();
                } else {
                    Swal.fire({
                        title: 'failed',
                        type: 'error',
                        text: data.msg,
                    });
                }
                dispatch(setLoading(false));
                dispatch(FetchPromo(1,null));

            })
            .catch(function (error) {
                dispatch(setLoading(false));
                Swal.fire({
                    title: 'failed',
                    type: 'error',
                    text: error.response === undefined?'error!':error.response.data.msg,
                });

                if (error.response) {
                    
                }
            })
    }
}
export const updatePromo = (id,data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `promo/${id}`;
        axios.put(url, data)
            .then(function (response) {
                const data = (response.data)
                if (data.status === 'success') {
                    Swal.fire({
                        title: 'Success',
                        type: 'success',
                        text: data.msg,
                    });
                    // window.location.reload();
                } else {
                    Swal.fire({
                        title: 'failed',
                        type: 'error',
                        text: data.msg,
                    });
                }
                dispatch(setLoading(false));
                dispatch(FetchPromo(1,null));

            })
            .catch(function (error) {
                Swal.fire({
                    title: 'failed',
                    type: 'error',
                    text: error.response === undefined?'error!':error.response.data.msg,
                });

                if (error.response) {
                    
                }
            })
    }
}
export const deletePromo = (id) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `promo/${id}`;
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
                dispatch(FetchPromo(1,''));
            })
            .catch(function (error) {
                dispatch(setLoading(false));
                Swal.fire({
                    title: 'failed',
                    type: 'error',
                    text: error.response === undefined?'error!':error.response.data.msg,
                });
                if (error.response) {
                    
                }
            })
    }
}
export const FetchBrg1 = (page=1,perpage=10,where='')=>  {
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = `barang?page=${page}&perpage=${perpage}`;
        if(where!==''){
            url+=`${where}`
        }
        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                if(data.result.data.length===1){
                    dispatch(setPromoBrg1(data));
                    dispatch(setLoading(false));
                }else{
                    dispatch(setPromoBrg1(data));
                    dispatch(setLoading(false));
                }

            }).catch(function(error){
            
            dispatch(setLoading(false));

            Swal.fire({
                title: 'failed',
                type: 'error',
                // text: error.response === undefined?'error!':error.response.data.msg,
            });
        })
    }
}
export const FetchBrg2 = (page=1,perpage=10,where='')=>  {
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = `barang?page=${page}&perpage=${perpage}`;
        if(where!==''){
            url+=`${where}`
        }
        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                if(data.result.data.length===1){
                    dispatch(setPromoBrg2(data));
                    dispatch(setLoading(false));
                }else{
                    dispatch(setPromoBrg2(data));
                    dispatch(setLoading(false));
                }

            }).catch(function(error){
            
            dispatch(setLoading(false));

            Swal.fire({
                title: 'failed',
                type: 'error',
                // text: error.response === undefined?'error!':error.response.data.msg,
            });
        })
    }
}

