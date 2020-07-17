import {PRODUCT, HEADERS} from "../../_constants";
import axios from 'axios';
import Swal from "sweetalert2";
import {store, update,cekData} from "components/model/app.model";


export function setLoadingbrg(load){
    return {type : PRODUCT.LOADING_BRG,load}
}

export function setProductbrg(data=[]){
    return {type:PRODUCT.SUCCESS_BRG,data}
}

export function setLoading(load){
    return {type : PRODUCT.LOADING,load}
}

export function setProduct(data=[]){
    return {type:PRODUCT.SUCCESS,data}
}

export function setProductFailed(data=[]){
    return {type:PRODUCT.FAILED,data}
}

export const FetchProduct = (page=1,by='',q='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        const headers={
            headers:{'Content-Type': 'application/x-www-form-urlencoded'}
        };
        let url = '';
        if(q===''&&by===''){
            url = `barang?page=${page}&isbo=true`;
        }else if(q===''||by===''||by===''){
            url = `barang?page=${page}&isbo=true`;
        }else if(by===''){
            url = `barang?page=${page}&isbo=true`;
        }else{
            url = `barang?page=${page}&q=${q}&searchby=${by}&isbo=true`;
        }

        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                console.log(data);
                dispatch(setProduct(data));
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

export const createProduct = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `barang`;
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'username': `${HEADERS.USERNAME}`,
                'password': `${HEADERS.PASSWORD}`,
                'crossDomain': true
            }
        };
        console.log(data);
        axios.post(url, data, headers)
            .then(function (response) {
                const data = (response.data)
                console.log("DATA",data);
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
                dispatch(FetchProduct(1,'',''));

            })
            .catch(function (error) {
                dispatch(setLoading(false))
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

export const FetchBrg = (page=1,by='barcode',q='',lokasi=null,supplier=null,db)=>{
    return (dispatch) => {
        dispatch(setLoadingbrg(true));
        let url = `barang/get?page=${page}`;
        if(q!=='') url+=`&q=${q}&searchby=${by}`;
        if(lokasi!==null) url+=`&lokasi=${lokasi}`
        if(supplier!==null) url+=`&supplier=${supplier}`

        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                if(data.result.data.length===1){
                    const barang = data.result.data;
                    const cek=db(barang[0].kd_brg,barang)
                    cek.then(re=>{
                        dispatch(setProductbrg(data));
                        dispatch(setLoadingbrg(false));
                    })
                }else{
                    dispatch(setProductbrg(data));
                    dispatch(setLoadingbrg(false));
                }
               
            }).catch(function(error){
            console.log(error);
            dispatch(setLoadingbrg(false));

            Swal.fire({
                title: 'failed',
                type: 'danger',
                // text: error.response.data.msg,
            });
        })
    }
}