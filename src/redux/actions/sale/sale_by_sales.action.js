import {SALE_BY_SALES,HEADERS} from "../_constants";
import axios from "axios"
import Swal from 'sweetalert2'
import {destroy} from "components/model/app.model";

export function setLoading(load) {
    return {
        type: SALE_BY_SALES.LOADING,
        load
    }
}
export function setLoadingDetail(load) {
    return {
        type: SALE_BY_SALES.LOADING_DETAIL,
        load
    }
}
export function setSaleBySales(data = []) {
    return {
        type: SALE_BY_SALES.SUCCESS,
        data
    }
}

export function setSaleBySalesData(data = []) {
    return {
        type: SALE_BY_SALES.SALE_BY_SALES_DATA,
        data
    }
}
export function setSaleBySalesReportData(data = []) {
    return {
        type: SALE_BY_SALES.REPORT_DETAIL_SUCCESS,
        data
    }
}

export function setCode(data = []) {
    return {
        type: SALE_BY_SALES.SUCCESS_CODE,
        data
    }
}


export function setSaleBySalesFailed(data = []) {
    return {
        type: SALE_BY_SALES.FAILED,
        data
    }
}
export function setReport(data = []) {
    return {
        type: SALE_BY_SALES.SUCCESS,
        data
    }
}
export function setReportExcel(data = []) {
    return {
        type: SALE_BY_SALES.REPORT_SUCCESS_EXCEL,
        data
    }
}
export function setReportFailed(data = []) {
    return {
        type: SALE_BY_SALES.REPORT_FAILED,
        data
    }
}
export function setLoadingReport(load) {
    return {
        type: SALE_BY_SALES.REPORT_LOADING,
        load
    }
}
export const FetchNotaSaleByCust = () => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `pos/getcode`)
            .then(function (response) {
                const data = response.data
                
                dispatch(setCode(data))
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error
                
            })

    }
}
export const storeSaleByCust = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `pos/checkout`;
        axios.post(url, data)
            .then(function (response) {
                const data = (response.data)
                Swal.fire({allowOutsideClick: false,
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
                        const win = window.open(data.result.nota, '_blank');
                        if (win != null) {
                            win.focus();
                        }
                    }
                    destroy('SALE_BY_SALES');
                    window.location.reload(false);
                })
                dispatch(setLoading(false));

            })
            .catch(function (error) {

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

export const FetchReportSaleBySales = (page=1,where='') => {

    return (dispatch) => {
        dispatch(setLoadingReport(true));
        // if(page === 'NaN'||page===''||page===undefined||!isNaN(page)){
        //     page = 1;
        // }
        let url = `report/penjualan/sales?page=${page}`;
        if(where!==''){
            url+=`&${where}`;
        }
        
        axios.get(HEADERS.URL + url)
            .then(function (response) {
                const data = response.data
                
                dispatch(setLoadingReport(false));
                dispatch(setReport(data))
            })
            .catch(function (error) {
                // handle error
                dispatch(setLoadingReport(false));
                
            })

    }
}
export const FetchReportSaleBySalesExcel = (page=1,where='',perpage=10000) => {
    return (dispatch) => {
        let url = `report/penjualan/sales?page=${page}&perpage=${perpage}`;
        if(where!==''){
            url+=`&${where}`;
        }
        axios.get(HEADERS.URL + url)
            .then(function (response) {
                const data = response.data
                
                dispatch(setReportExcel(data))
            })
            .catch(function (error) {
                // handle error
                
            })

    }
}

export const FetchReportDetailSaleBySales = (kd_trx) => {
    return (dispatch) => {
        dispatch(setLoadingDetail(true));
        
        axios.get(HEADERS.URL + `report/penjualan/sales/${kd_trx}`)
            .then(function (response) {
                const data = response.data;
                
                dispatch(setSaleBySalesReportData(data));
                dispatch(setLoadingDetail(false));
            })
            .catch(function (error) {
                // handle error
                
            })

    }
}
