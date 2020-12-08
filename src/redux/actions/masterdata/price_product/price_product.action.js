import {PRICE_PRODUCT, HEADERS} from "../../_constants";
import axios from 'axios';
import Swal from "sweetalert2";


export function setLoading(load){
    return {type : PRICE_PRODUCT.LOADING,load}
}

export function setPriceProduct(data=[]){
    return {type:PRICE_PRODUCT.SUCCESS,data}
}
export function setPriceProductFailed(data=[]){
    return {type:PRICE_PRODUCT.FAILED,data}
}
export const FetchPriceProduct = (page=1,q='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = '';
        if(q===''){
            url = `barangHarga?page=${page}`
        }else{
            url = `barangHarga?page=${page}&q=${q}`
        }
        
        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setPriceProduct(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            dispatch(setLoading(false));
            Swal.fire({
                title: 'failed',
                type: 'error',
                text: error.response === undefined?'error!':error.response.data.msg,
            });
        })
    }
}

export const updatePriceProduct = (id,data) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `barangHarga/${id}`;

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
                dispatch(FetchPriceProduct(1,''));

            })
            .catch(function (error) {
                // handle error
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
