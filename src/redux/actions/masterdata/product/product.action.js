import {PRODUCT, HEADERS} from "../../_constants";
import axios from 'axios';
import Swal from "sweetalert2";
import {store, update,cekData} from "components/model/app.model";
import {FetchBank} from "../bank/bank.action";
import {FetchCash} from "../cash/cash.action";

export function setLoadingbrg(load){
    return {type : PRODUCT.LOADING_BRG,load}
}
export function setProductDetail(data=[]){
    return {type:PRODUCT.DETAIL,data}
}
export function setProductbrg(data=[]){
    return {type:PRODUCT.SUCCESS_BRG,data}
}
export function setProductEdit(data=[]){
    return {type:PRODUCT.EDIT_PRODUCT,data}
}
export function setProductCode(data=[]){
    return {type:PRODUCT.CODE_PRODUCT,data}
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

export const FetchProduct = (page=1,where)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url =``;
        if(where!==''){
             url=`barang?page=${page}&isbo=true&${where}`;
        }else {
             url=`barang?page=${page}&isbo=true`;
        }


        console.log("URL ACTION PRODUCT",HEADERS.URL+`${url}`);
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
    console.log("DATA TI FORM",data)
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `barang`;
        axios.post(url,data)
            .then(function (response) {
                const data = (response.data);
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
                // handle error
                dispatch(setLoading(false));
                console.log(error);
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
    };

export const deleteProduct = (id) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `barang/${id}`;
        axios.delete(url)
            .then(function (response) {
                const data = (response.data);
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
                dispatch(FetchProduct(1,''));
            })
            .catch(function (error) {
                dispatch(setLoading(false));
                console.log(error);
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


export const FetchProductEdit = (kode)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL+`barang/update/${kode}`)
            .then(function(response){
                const data = response.data;
                console.log(data);
                dispatch(setProductEdit(data));
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


export const updateProduct = (id,data) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `barang/${id}`;

        axios.put(url, data)
            .then(function (response) {
                const data = (response.data);
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
                // handle error
                dispatch(setLoading(false));
                console.log(error);
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


export const FetchProductDetail = (kode)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL+`barang/${kode}?isbo=true`)
            .then(function(response){
                const data = response.data;
                console.log(data);
                dispatch(setProductDetail(data));
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



export const FetchProductCode = ()=>{
    return (dispatch) => {
        // dispatch(setLoading(true));
        axios.get(HEADERS.URL+`barang/code`)
            .then(function(response){
                const data = response.data;
                dispatch(setProductCode(data));
                // dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error);
            dispatch(setLoading(false));

        })
    }
}
