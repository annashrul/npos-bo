import {SALE_BY_CUST,HEADERS} from "../_constants";
import axios from "axios"
import Swal from 'sweetalert2'
import {destroy} from "components/model/app.model";
import moment from "moment";


export function setLoading(load) {
    return {
        type: SALE_BY_CUST.LOADING,
        load
    }
}
export function setLoadingDetail(load) {
    return {
        type: SALE_BY_CUST.LOADING_DETAIL,
        load
    }
}
export function setSaleByCust(data = []) {
    return {
        type: SALE_BY_CUST.SUCCESS,
        data
    }
}

export function setSaleByCustData(data = []) {
    return {
        type: SALE_BY_CUST.SALE_BY_CUST_DATA,
        data
    }
}
export function setSaleByCustReportData(data = []) {
    return {
        type: SALE_BY_CUST.REPORT_DETAIL_SUCCESS,
        data
    }
}

export function setCode(data = []) {
    return {
        type: SALE_BY_CUST.SUCCESS_CODE,
        data
    }
}


export function setSaleByCustFailed(data = []) {
    return {
        type: SALE_BY_CUST.FAILED,
        data
    }
}
export function setReport(data = []) {
    return {
        type: SALE_BY_CUST.REPORT_SUCCESS,
        data
    }
}
export function setReportExcel(data = []) {
    return {
        type: SALE_BY_CUST.REPORT_SUCCESS_EXCEL,
        data
    }
}
export function setReportFailed(data = []) {
    return {
        type: SALE_BY_CUST.REPORT_FAILED,
        data
    }
}
export function setLoadingReport(load) {
    return {
        type: SALE_BY_CUST.REPORT_LOADING,
        load
    }
}
export const FetchNotaSaleByCust = () => {
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
export const storeSaleByCust = (data) => {
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
                        const win = window.open(data.result.nota, '_blank');
                        if (win != null) {
                            win.focus();
                        }
                    }
                    destroy('sale_by_cust');
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

export const FetchReportSaleByCust = (page=1,where='') => {

    return (dispatch) => {
        dispatch(setLoadingReport(true));
        let url=`report/penjualan_by_cust?page=${page}`;
        if(where!==''){
            url+=`&${where}`;
        }
        console.log("URL LAPORAN PENJUALAN",url);
        axios.get(HEADERS.URL + url)
            .then(function (response) {
                const data = response.data
                console.log(data);
                dispatch(setLoadingReport(false));
                dispatch(setReport(data))
            })
            .catch(function (error) {
                // handle error
                dispatch(setLoadingReport(false));
                console.log(error);
            })

    }
}
export const FetchReportSaleByCustExcel = (page=1,where='',perpage=10000) => {
    return (dispatch) => {
        let url=`report/penjualan_by_cust?page=${page}&perpage=${perpage}`;
        if(where!==''){
            url+=`&${where}`;
        }
        axios.get(HEADERS.URL + url)
            .then(function (response) {
                const data = response.data
                console.log(data);
                dispatch(setReportExcel(data))
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    }
}

export const FetchReportDetailSaleByCust = (kd_trx) => {
    return (dispatch) => {
        dispatch(setLoadingDetail(true));
        console.log(`report/penjualan_by_cust/${kd_trx}`);
        axios.get(HEADERS.URL + `report/penjualan_by_cust/${kd_trx}`)
            .then(function (response) {
                const data = response.data;
                console.log(data);
                dispatch(setSaleByCustReportData(data));
                dispatch(setLoadingDetail(false));
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    }
}


export const deleteReportSaleByCust = (kd_trx) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `pos/remove_penjualan/${kd_trx}`;
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
                dispatch(setLoadingReport(false));
                let dateFrom=localStorage.getItem("date_from_sale_by_cust_report");
                let dateTo=localStorage.getItem("date_to_sale_by_cust_report");
                let where='';
                if(dateFrom!==undefined&&dateFrom!==null){
                    if(where!==''){where+='&'}where+=`datefrom=${dateFrom}&dateto=${dateTo}`
                }else{
                    if(where!==''){where+='&'}where+=`datefrom=${moment(new Date()).format("yyyy-MM-DD")}&dateto=${moment(new Date()).format("yyyy-MM-DD")}`
                }
                dispatch(FetchReportSaleByCust(1,where));
            })
            .catch(function (error) {
                dispatch(setLoadingReport(false));
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
