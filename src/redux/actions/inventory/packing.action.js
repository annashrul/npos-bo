import {PACKING, HEADERS} from "../_constants";
import axios from 'axios';
import Swal from "sweetalert2";
import {destroy} from "components/model/app.model";

export function setLoading(load){
    return {type : PACKING.LOADING,load}
}

export function setBarangPacking(data=[]){
    return {type:PACKING.GET_BARANG_SUCCESS,data}
}

export function setProduksiFailed(data=[]){
    return {type:PACKING.GET_BARANG_FAILED,data}
}

export function setCodePacking(data=[]){
    return {type:PACKING.GET_CODE,data}
}


export const FetchCodePacking = ()=>{
    return (dispatch) => {
        axios.get(HEADERS.URL+`packing/getcode`)
            .then(function(response){
                const data = response.data;
                console.log("IEU KODE PRODUKSI",data);
                dispatch(setCodePacking(data));
            }).catch(function(error){
            console.log(error)
        })
    }
}

export const FetchBrgPacking = (kode,db)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = `alokasi/get/${kode}`;
        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                console.log(data);
                if(data.result.detail.length===1){
                    const barang = data.result.detail;
                    const cek=db(barang[0].kode_barang,barang);
                    cek.then(re=>{
                        dispatch(setBarangPacking(data));
                        dispatch(setLoading(false));
                    })
                }else{
                    dispatch(setBarangPacking(data));
                    dispatch(setLoading(false));
                }


            }).catch(function(error){
            console.log(error);
            dispatch(setLoading(false));

            Swal.fire({
                title: 'failed',
                type: 'danger',
                // text: error.response.data.msg,
            });
        })
    }
}

