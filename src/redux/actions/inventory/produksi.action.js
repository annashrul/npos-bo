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

export const FetchBrgProduksi = (page=1,by='barcode',q='',lokasi=null,db,type='')=>{
    console.log("DATA DB",db);
    return (dispatch) => {
        dispatch(setLoadingbrg(true));
        let url = `barang/get?page=${page}`;
        if(q!=='') url+=`&q=${q}&searchby=${by}`;
        if(lokasi!==null) url+=`&lokasi=${lokasi}`;
        if(type!=='') url+=`&kategori=${type}`;
        console.log("FETCH BARANG URL",url);
        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                if(data.result.data.length===1){
                    const barang = data.result.data;
                    const cek=db(barang[0].kd_brg,barang);
                    cek.then(re=>{
                        if(type === '2'){
                            dispatch(setProduksiPaket(data));
                        }
                        if(type === '4'){
                            dispatch(setProduksiBahan(data));
                        }

                        dispatch(setLoading(false));
                    })
                }else{
                    dispatch(setProductbrg(data));
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
export const storeProduksi = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `production`;
        axios.post(url, data)
            .then(function (response) {
                const data = (response.data)
                Swal.fire({
                    title: 'Transaksi berhasil.',
                    // html: `Total Hpp: ${data.result.total_hpp} <br/> Qty Estimasi : ${data.result.qty_estimasi} <br/> Hpp Peritem : ${data.result.hpp_peritem}`,
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
