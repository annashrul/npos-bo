import {SALE_BY_SALES,HEADERS} from "../_constants";
import axios from "axios"

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

export function setDetail(data = []) {
    return {
        type: SALE_BY_SALES.DETAIL,
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

export const FetchReportDetailSaleBySales = (page=1,kd_trx,where='') => {
    return (dispatch) => {
        dispatch(setLoadingDetail(true));
        let w=''
        if (where !== '') {
            w+= `&${where}`;
        }
        
        axios.get(HEADERS.URL + `report/penjualan/sales/${kd_trx}?page=${page}${w}`)
            .then(function (response) {
                const data = response.data;
                
                dispatch(setDetail(data));
                dispatch(setLoadingDetail(false));
            })
            .catch(function (error) {
                // handle error
                
            })

    }
}
