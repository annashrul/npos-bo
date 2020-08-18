import {PRODUKSI, HEADERS} from "../_constants";
import axios from 'axios';
import Swal from "sweetalert2";
import {destroy} from "components/model/app.model";
import {setLoadingbrg, setProductbrg} from "../masterdata/product/product.action";

export function setLoading(load){
    return {type : PRODUKSI.LOADING,load}
}

export function setProduksiPaket(data=[]){
    return {type:PRODUKSI.SUCCESS_PAKET,data}
}
export function setProduksiBahan(data=[]){
    return {type:PRODUKSI.SUCCESS_BAHAN,data}
}

export function setProduksiFailed(data=[]){
    return {type:PRODUKSI.FAILED,data}
}

export function setCodeProduksi(data=[]){
    return {type:PRODUKSI.GET_CODE,data}
}


export const FetchCodeProduksi = (lokasi)=>{
    return (dispatch) => {
        axios.get(HEADERS.URL+`production/getcode?lokasi=${lokasi}`)
            .then(function(response){
                const data = response.data;
                console.log("IEU KODE PRODUKSI",data);
                dispatch(setCodeProduksi(data));
            }).catch(function(error){
            console.log(error)
        })
    }
}

export const FetchBrgProduksiBahan = (page=1,by='barcode',q='',lokasi=null,db)=>{
    console.log("DATA DB",db);
    return (dispatch) => {
        dispatch(setLoadingbrg(true));
        let url = `barang/get?page=${page}&kategori=4`;
        if(q!=='') url+=`&q=${q}&searchby=${by}`;
        if(lokasi!==null) url+=`&lokasi=${lokasi}`;
        console.log("FETCH BARANG URL",url);
        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                console.log("RESPONSE BARANG BAHAN",data);
                if(data.result.data.length===1){
                    const barang = data.result.data;
                    const cek=db(barang[0].kd_brg,barang);
                    cek.then(re=>{
                        dispatch(setProduksiBahan(data));
                        dispatch(setLoading(false));
                    })
                }else{
                    dispatch(setProduksiBahan(data));
                    dispatch(setLoading(false));
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
export const FetchBrgProduksiPaket = (page=1,by='barcode',q='',lokasi=null)=>{
    return (dispatch) => {
        dispatch(setLoadingbrg(true));
        let url = `barang/get?page=${page}&kategori=2`;
        if(q!=='') url+=`&q=${q}&searchby=${by}`;
        if(lokasi!==null) url+=`&lokasi=${lokasi}`;
        console.log("FETCH BARANG URL",url);
        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;

                dispatch(setProduksiPaket(data));
                dispatch(setLoading(false));
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

export const storeProduksi = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `production`;
        axios.post(url, data)
            .then(function (response) {
                const data = (response.data)
                Swal.fire({
                    title: 'Transaksi berhasil.',
                    html:`<table class="table table-bordered table-hover"><thead><tr><th>Total Hpp</th><th>Qty Estimasi</th><th>Hpp Peritem</th></tr></thead><tbody><tr><td>${data.result.total_hpp}</td><td>${data.result.qty_estimasi}</td><td>${data.result.hpp_peritem}</td></tr></tbody></table>`,
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonColor: '#ff9800',
                    cancelButtonColor: '#2196F3',
                    confirmButtonText: 'Print Nota?',
                    cancelButtonText: 'Oke!'
                }).then((result) => {
                    destroy('production');
                    localStorage.removeItem('location_produksi');
                    localStorage.removeItem('barang_paket_produksi');
                    window.location.reload(false);
                })
                dispatch(setLoading(false));

            })
            .catch(function (error) {

                Swal.fire({
                    title: 'Failed',
                    type: 'danger',
                    text: error.response.data.msg,
                });

                if (error.response) {
                    console.log("error")
                }
            })
    }
}
