import {
    MUTASI_JUAL_BELI,
    HEADERS
} from "../_constants"
import axios from "axios"
import Swal from 'sweetalert2'

export function setLoadingMutasiJualBeli(load) {
    return {
        type: MUTASI_JUAL_BELI.LOADING,
        load
    }
}
export function setBayarMutasiJualBeli(data = []) {
    return {
        type: MUTASI_JUAL_BELI.SUCCESS_DATA_BAYAR,
        data
    }
}

export function setBayarMutasiJualBeliFailed(data = []) {
    return {
        type: MUTASI_JUAL_BELI.FAILED_DATA_BAYAR,
        data
    }
}

export function setCodeBayarMutasiJualBeli(data = []) {
    return {
        type: MUTASI_JUAL_BELI.SUCCESS_CODE_BAYAR,
        data
    }
}

export function setKartuAlokasi(data=[]){
    return {type:MUTASI_JUAL_BELI.SUCCESS_KARTU,data}
}

export const FetchCodeBayarMutasiJualBeli = (lokasi) => {
    return (dispatch) => {
        dispatch(setLoadingMutasiJualBeli(true));
        axios.get(HEADERS.URL + `alokasi/getcode?lokasi=${lokasi}&prefix=BM`)
            .then(function (response) {
                const data = response.data;
                dispatch(setCodeBayarMutasiJualBeli(data));
                dispatch(setLoadingMutasiJualBeli(false));
            })
            .catch(function (error) {
                // handle error
                
                dispatch(setLoadingMutasiJualBeli(false));
            })

    }
}
export const FetchDataBayarMutasiJualBeli = (kode) => {
    return (dispatch) => {
        dispatch(setLoadingMutasiJualBeli(true));
        axios.get(HEADERS.URL + `alokasi_trx/hutang/${kode}`)
            .then(function (response) {
                const data = response.data;
                
                dispatch(setBayarMutasiJualBeli(data));
                dispatch(FetchCodeBayarMutasiJualBeli(data.result.kd_tujuan));
                dispatch(setLoadingMutasiJualBeli(false));
            })
            .catch(function (error) {
                // handle error
                
                dispatch(setLoadingMutasiJualBeli(false));
                Swal.fire({allowOutsideClick: false,
                    title: 'Failed',
                    type: 'error',
                    text: error.response === undefined?'error!':error.response.data.msg,
                });

                if (error.response) {
                    
                }
            })

    }
}
export const storeMutasiJualBeli = (data) => {
    return (dispatch) => {
        dispatch(setLoadingMutasiJualBeli(true))
        const url = HEADERS.URL + `alokasi_trx/bayar`;
        axios.post(url, data)
            .then(function (response) {
                const data = (response.data);
                Swal.fire({allowOutsideClick: false,
                    title: 'Transaksi berhasil.',
                    text: `Disimpan dengan nota: ${data.result.insertId}`,
                    icon: 'info',
                    showCancelButton: false,
                    confirmButtonColor: '#ff9800',
                    // cancelButtonColor: '#2196F3',
                    confirmButtonText: 'Ok',
                    // cancelButtonText: 'Oke!'
                }).then((result) => {
                    window.location.reload(false);
                })
                dispatch(setLoadingMutasiJualBeli(false));
            })
            .catch(function (error) {
                dispatch(setLoadingMutasiJualBeli(false));
                Swal.fire({allowOutsideClick: false,
                    title: 'Failed',
                    type: 'error',
                    text: error.response === undefined?'error!':error.response.data.msg,
                });

                if (error.response) {
                    
                }
            })
    }
}


export const FetchKartuAlokasi = (page=1,where='')=>{
    return (dispatch) => {
        dispatch(setLoadingMutasiJualBeli(true));
        let url = `alokasi_trx/kartu_hutang?page=${page}`;
        if(where!==''){
            url+=`${where}`
        }
        
        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setKartuAlokasi(data));
                dispatch(setLoadingMutasiJualBeli(false));
            }).catch(function(error){
            
        })
    }
}
