import {SALE_BY_PRODUCT,HEADERS} from "../_constants";
import axios from "axios"


// export function setLoading(load) {
//     return {
//         type: SALE_BY_PRODUCT.LOADING,
//         load
//     }
// }
export function setLoadingDetail(load) {
    return {
        type: SALE_BY_PRODUCT.LOADING_DETAIL,
        load
    }
}
// export function setSaleByProduct(data = []) {
//     return {
//         type: SALE_BY_PRODUCT.SUCCESS,
//         data
//     }
// }

// export function setSaleByProductData(data = []) {
//     return {
//         type: SALE_BY_PRODUCT.SALE_BY_PRODUCT_DATA,
//         data
//     }
// }

// export function setSaleByProductFailed(data = []) {
//     return {
//         type: SALE_BY_PRODUCT.FAILED,
//         data
//     }
// }
export function setSaleByProductReportData(data = []) {
    return {
        type: SALE_BY_PRODUCT.REPORT_DETAIL_SUCCESS,
        data
    }
}
export function setReport(data = []) {
    return {
        type: SALE_BY_PRODUCT.REPORT_SUCCESS,
        data
    }
}
export function setReportExcel(data = []) {
    return {
        type: SALE_BY_PRODUCT.REPORT_SUCCESS_EXCEL,
        data
    }
}
export function setReportFailed(data = []) {
    return {
        type: SALE_BY_PRODUCT.REPORT_FAILED,
        data
    }
}
export function setLoadingReport(load) {
    return {
        type: SALE_BY_PRODUCT.REPORT_LOADING,
        load
    }
}

export const FetchReportSaleByProduct = (page=1,where='') => {

    return (dispatch) => {
        dispatch(setLoadingReport(true));
        if(page === 'NaN'||page===''||page===undefined||!isNaN(page)){
            page = 1;
        }
        let url=`report/penjualan/barang?page=${page}`;
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
export const FetchReportSaleByProductExcel = (page=1,where='',perpage=10000) => {
    return (dispatch) => {
        let url=`report/penjualan/barang?page=${page}&perpage=${perpage}`;
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

export const FetchReportDetailSaleByProduct = (kd,page,datefrom,dateto,perpage) => {
    return (dispatch) => {
        dispatch(setLoadingDetail(true));
        let url = `report/penjualan/barang/${kd}?page=${page}`;
        if(datefrom!=='' && dateto!==''){
            url+=`&datefrom=${datefrom}&dateto=${dateto}`;
        }
        if(perpage!==undefined){
            url+=`&perpage=${perpage}`;
        }
        axios.get(HEADERS.URL + url)
            .then(function (response) {
                const data = response.data;
                
                dispatch(setSaleByProductReportData(data));
                dispatch(setLoadingDetail(false));
            })
            .catch(function (error) {
                // handle error
                
            })

    }
}
