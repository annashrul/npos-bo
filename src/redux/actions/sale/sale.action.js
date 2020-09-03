import {SALE,HEADERS} from "../_constants";
import axios from "axios"
import Swal from 'sweetalert2'
import {destroy} from "components/model/app.model";
import moment from "moment";


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
export function setSaleReportData(data = []) {
    return {
        type: SALE.REPORT_DETAIL_SUCCESS,
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
export function setReportExcel(data = []) {
    return {
        type: SALE.REPORT_SUCCESS_EXCEL,
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

export function setSaleReturReport(data=[]){
    return {type:SALE.SUCCESS_SALE_RETUR,data}
}

export function setSaleReturReportExcel(data=[]){
    return {type:SALE.SUCCESS_SALE_RETUR_EXCEL,data}
}

export const FetchNotaSale = () => {
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
export const storeSale = (data,param) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const rawdata=data;
        const url = HEADERS.URL + `pos/checkout`;
        axios.post(url, data)
            .then(function (response) {
                const data = (response.data)
                Swal.fire({
                    title: 'Transaksi berhasil.',
                    type: 'info',
                    html: "Terimakasih Telah Melakukan Transaksi Di Toko Kami" +
                        "<br><br>" +
                        '<button type="button" role="button" tabindex="0" id="btnNotaPdf" class="btn btn-primary">Nota PDF</button>    ' +
                        '<button type="button" role="button" tabindex="0" id="btnNota3ply" class="btn btn-info">Nota 3ply</button>',
                    showCancelButton: true,
                    showConfirmButton: false
                }).then((result) => {
                    destroy('sale');
                    localStorage.removeItem('cs');
                    localStorage.removeItem('lk');
                    window.location.reload(false);
                })
                document.getElementById("btnNotaPdf").addEventListener("click", () => {
                    const win = window.open(data.result.nota, '_blank');
                    if (win != null) {
                        win.focus();
                    }
                });
                document.getElementById("btnNota3ply").addEventListener("click", () => {
                    param({
                        pathname: '/print3ply',
                        state: {
                            data: rawdata,
                            nota: data.result.kode
                        }
                    })
                    Swal.closeModal();
                    return false;
                });

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
                
                dispatch(setLoadingReport(false));
                dispatch(setReport(data))
            })
            .catch(function (error) {
                // handle error
                dispatch(setLoadingReport(false));
                
            })

    }
}
export const FetchReportSaleExcel = (where='',perpage='') => {
    return (dispatch) => {
        let url=`report/arsip_penjualan?page=1&perpage=${perpage}`;
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

export const FetchReportDetailSale = (kd_trx) => {
    return (dispatch) => {
        dispatch(setLoadingDetail(true));
        
        axios.get(HEADERS.URL + `report/arsip_penjualan/${kd_trx}`)
            .then(function (response) {
                const data = response.data;
                
                dispatch(setSaleReportData(data));
                dispatch(setLoadingDetail(false));
            })
            .catch(function (error) {
                // handle error
                
            })

    }
}


export const deleteReportSale = (kd_trx) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `pos/remove_penjualan/${kd_trx}`;
        axios.delete(url)
            .then(function (response) {
                const data = (response.data);
                
                if (data.status === 'success') {
                    Swal.fire({
                        title: 'Success',
                        type: 'success',
                        text: data.msg,
                    });
                } else {
                    Swal.fire({
                        title: 'failed',
                        type: 'error',
                        text: data.msg,
                    });
                }
                dispatch(setLoadingReport(false));
                let dateFrom=localStorage.getItem("date_from_sale_report");
                let dateTo=localStorage.getItem("date_to_sale_report");
                let where='';
                if(dateFrom!==undefined&&dateFrom!==null){
                    if(where!==''){where+='&'}where+=`datefrom=${dateFrom}&dateto=${dateTo}`
                }else{
                    if(where!==''){where+='&'}where+=`datefrom=${moment(new Date()).format("yyyy-MM-DD")}&dateto=${moment(new Date()).format("yyyy-MM-DD")}`
                }
                dispatch(FetchReportSale(1,where));
            })
            .catch(function (error) {
                dispatch(setLoadingReport(false));
                
                Swal.fire({
                    title: 'failed',
                    type: 'error',
                    text: error.response.data.msg,
                });
                if (error.response) {
                    
                }
            })
    }
}

export const FetchSaleReturReport = (page=1,where='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        // report/stock?page=1&datefrom=2020-01-01&dateto=2020-07-01&lokasi=LK%2F0001
        let que = `report/penjualan/retur?page=${page}`;
        if(where!==''){
            que+=`${where}`;
        }
        
        axios.get(HEADERS.URL+`${que}`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setSaleReturReport(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}

export const FetchSaleReturReportExcel = (page=1,where='',perpage=99999)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        // report/stock?page=1&datefrom=2020-01-01&dateto=2020-07-01&lokasi=LK%2F0001
        let que = `report/penjualan/retur?page=${page}&perpage=${perpage}`;
        if(where!==''){
            que+=`${where}`;
        }
        
        axios.get(HEADERS.URL+`${que}`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setSaleReturReportExcel(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}