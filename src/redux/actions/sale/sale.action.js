import {SALE,HEADERS} from "../_constants";
import axios from "axios"
import Swal from 'sweetalert2'
import {destroy} from "components/model/app.model";


export function setLoading(load) {
    return {
        type: SALE.LOADING,
        load
    }
}
export function setLoadingDetail(load) {
    return {
        type: SALE.LOADING_DETAIL,
        load
    }
}
export function setSale(data = []) {
    return {
        type: SALE.SUCCESS,
        data
    }
}

export function setSaleData(data = []) {
    return {
        type: SALE.SALE_DATA,
        data
    }
}

export function setCode(data = []) {
    return {
        type: SALE.SUCCESS_CODE,
        data
    }
}


export function setSaleFailed(data = []) {
    return {
        type: SALE.FAILED,
        data
    }
}
export function setReport(data = []) {
    return {
        type: SALE.REPORT_SUCCESS,
        data
    }
}
export function setReportFailed(data = []) {
    return {
        type: SALE.REPORT_FAILED,
        data
    }
}
export function setLoadingReport(load) {
    return {
        type: SALE.REPORT_LOADING,
        load
    }
}
export const FetchNotaSale = () => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `pos/getcode`)
            .then(function (response) {
                const data = response.data
                console.log(data);
                dispatch(setCode(data))
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    }
}
export const storeSale = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `pos/checkout`;
        axios.post(url, data)
            .then(function (response) {
                const data = (response.data)
                Swal.fire({
                    title: 'Transaksi berhasil.',
                    text: `Terimakasih Telah Melakukan Transaksi Di Toko Kami`,
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#ff9800',
                    cancelButtonColor: '#2196F3',
                    confirmButtonText: 'Print Nota?',
                    cancelButtonText: 'Oke!'
                }).then((result) => {
                    if (result.value) {
                        const win = window.open('http://google.com', '_blank');
                        if (win != null) {
                            win.focus();
                        }
                    }
                    destroy('sale');
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

export const FetchReportSale = (page=1,where='') => {
    return (dispatch) => {
        dispatch(setLoadingReport(true));
        let url=`report/arsip_penjualan?page=${page}`;
        if(where!==''){
            url+=`&${where}`;
        }
        axios.get(HEADERS.URL + url)
            .then(function (response) {
                const data = response.data
                console.log(data);
                dispatch(setReport(data))
                dispatch(setLoadingReport(false));
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    }
}


