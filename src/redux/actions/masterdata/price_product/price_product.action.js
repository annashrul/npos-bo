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
        const headers={
            headers:{'Content-Type': 'application/x-www-form-urlencoded'}
        };
        let url = '';
        if(q===''){
            url = `barangHarga?page=${page}`
        }else{
            url = `barangHarga?page=${page}&q=${q}`
        }
        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                console.log(data);
                dispatch(setPriceProduct(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error);
            dispatch(setLoading(false));
            Swal.fire({
                title: 'failed',
                type: 'danger',
                text: error.response.data.msg,
            });
        })
    }
}
