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
