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
export function setBarangPackingTrx(data=[]){
    return {type:PACKING.GET_BARANG_SUCCESS_TRX,data}
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
                
                dispatch(setCodePacking(data));
            }).catch(function(error){
            
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
            
            dispatch(setLoading(false));

            Swal.fire({
                title: 'failed',
                type: 'error',
                // text: error.response.data.msg,
            });
        })
    }
}

export const storePacking = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `packing`;
        axios.post(url, data)
            .then(function (response) {
                const data = (response.data)
                Swal.fire({
                    title: 'Transaksi berhasil.',
                    text: `Disimpan dengan nota: ${data.result.insertId}`,
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonColor: '#ff9800',
                }).then((result) => {
                    destroy('packing');
                    localStorage.removeItem('faktur_alokasi_packing');
                    localStorage.removeItem('penerima_packing');
                    window.location.reload(false);
                })
                dispatch(setLoading(false));

            })
            .catch(function (error) {

                Swal.fire({
                    title: 'Failed',
                    type: 'error',
                    text: error.response.data.msg,
                });

                if (error.response) {
                    
                }
            })
    }
}

export const FetchBrgPackingTrx = (kode)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = `packing/get/${kode}`;
        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                dispatch(setBarangPackingTrx(data));
                dispatch(setLoading(false));

            }).catch(function(error){
            dispatch(setLoading(false));
            Swal.fire({
                title: 'failed',
                type: 'error',
                // text: error.response.data.msg,
            });
        })
    }
}

