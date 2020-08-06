import {PROMO, HEADERS} from "../../_constants";
import axios from 'axios';
import Swal from "sweetalert2";


export function setLoading(load){
    return {type : PROMO.LOADING,load}
}

export function setPromo(data=[]){
    return {type:PROMO.SUCCESS,data}
}
export function setPromoKategori(data=[]){
    return {type:PROMO.SUCCESS_KATEGORI,data}
}
export function setPromoFailed(data=[]){
    return {type:PROMO.FAILED,data}
}
export const FetchPromo = (page=1,param,perpage=10)=>{
    return (dispatch) => {

        dispatch(setLoading(true));
        const headers={
            headers:{'Content-Type': 'application/x-www-form-urlencoded'}
        };
        let que = '';
        if(param===null){
            console.log(param);
            que = `promo?page=${page}&perpage=${perpage}`;
        }else{
            console.log(param);
            que = `promo?page=${page}&q=${param}&perpage=${perpage}`;
        }
        axios.get(HEADERS.URL+`${que}`)
            .then(function(response){
                const data = response.data;
                console.log(data);
                dispatch(setPromo(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}

export const FetchPromoKategori = ()=>{
    return (dispatch) => {

        // dispatch(setLoading(true));
        // const headers={
        //     headers:{'Content-Type': 'application/x-www-form-urlencoded'}
        // };
        let que = '';
            que = `promo/category`;
        axios.get(HEADERS.URL+`${que}`)
            .then(function(response){
                const data = response.data;
                console.log(data);
                dispatch(setPromoKategori(data));
                // dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
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
                } else {
                    Swal.fire({
                        title: 'failed',
                        type: 'danger',
                        text: data.msg,
                    });
                }
                dispatch(setLoading(false));
                dispatch(FetchPromo(1,null));

            })
            .catch(function (error) {
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
                } else {
                    Swal.fire({
                        title: 'failed',
                        type: 'danger',
                        text: data.msg,
                    });
                }
                dispatch(setLoading(false));
                dispatch(FetchPromo(1,null));

            })
            .catch(function (error) {
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
                        type: 'danger',
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
                    type: 'danger',
                    text: error.response.data.msg,
                });
                if (error.response) {
                    console.log("error")
                }
            })
    }
}
