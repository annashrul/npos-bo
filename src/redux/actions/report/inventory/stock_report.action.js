import {STOCK_REPORT, HEADERS} from "../../_constants";
import axios from 'axios';


export function setLoading(load){
    return {type : STOCK_REPORT.LOADING,load}
}
export function setLoadingDetailSatuan(load){
    return {type : STOCK_REPORT.LOADING_DETAIL_SATUAN,load}
}

export function setStockReport(data=[]){
    return {type:STOCK_REPORT.SUCCESS,data}
}
export function setStockReportDetailSatuan(data=[]){
    return {type:STOCK_REPORT.DETAIL_SATUAN,data}
}
export function setStockReportDetailTransaction(data=[]){
    return {type:STOCK_REPORT.DETAIL_TRANSAKSI,data}
}

export function setStockReportFailed(data=[]){
    return {type:STOCK_REPORT.FAILED,data}
}

//FILTER STOCK REPORT//
// perpage=10,page=1,searchby=kd_brg,dateFrom=2020-01-01,dateTo=2020-07-01,lokasi=LK%2F0001
export const FetchStockReport = (token,page=1,dateFrom='',dateTo='',location='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        console.log("############### TOKEN ###############",token);
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
                'username': `${HEADERS.USERNAME}`,
                'password': `${HEADERS.PASSWORD}`,
                'crossDomain': true
            }
        };
        // report/stock?page=1&datefrom=2020-01-01&dateto=2020-07-01&lokasi=LK%2F0001
        let que = '';
        if(dateFrom===''&&dateTo===''&&location===''){
            que = `report/stock?page=${page}`;
        }
        if(dateFrom!==''&&dateTo!==''&&location===''){
            que = `report/stock?page=${page}&datefrom=${dateFrom}&dateto=${dateFrom}`;
        }
        if(dateFrom!==''&&dateTo!==''&&location!==''){
            que = `report/stock?page=${page}&datefrom=${dateFrom}&dateto=${dateFrom}&lokasi=${location}`;
        }
        if(location!==''){
            que = `report/stock?page=${page}&lokasi=${location}`;
        }
        console.log(`${que}`);
        axios.get(HEADERS.URL+`${que}`,headers)
            .then(function(response){
                const data = response.data;
                console.log(data);
                dispatch(setStockReport(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}
export const FetchStockReportDetailSatuan = (token,page=1,code,dateFrom='',dateTo='',location='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
                'username': `${HEADERS.USERNAME}`,
                'password': `${HEADERS.PASSWORD}`,
                'crossDomain': true
            }
        };
        let que = '';
        if(dateFrom===''&&dateTo===''&&location===''){
            que = `report/stock/${code}?page=${page}`;
        }
        if(dateFrom!==''&&dateTo!==''&&location===''){
            que = `report/stock/${code}?page=${page}&datefrom=${dateFrom}&dateto=${dateFrom}`;
        }
        if(dateFrom!==''&&dateTo!==''&&location!==''){
            que = `report/stock/${code}?page=${page}&datefrom=${dateFrom}&dateto=${dateFrom}&lokasi=${location}`;
        }
        if(location!==''){
            que = `report/stock/${code}?page=${page}&lokasi=${location}`;
        }
        console.log(`${que}`);
        axios.get(HEADERS.URL+`${que}`,headers)
            .then(function(response){
                const data = response.data;
                console.log(data);
                dispatch(setStockReportDetailSatuan(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}
export const FetchStockReportDetailTransaction = (token,page=1,code,dateFrom='',dateTo='',location='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
                'username': `${HEADERS.USERNAME}`,
                'password': `${HEADERS.PASSWORD}`,
                'crossDomain': true
            }
        };
        // let que = '';
        // if(dateFrom===''&&dateTo===''&&location===''){
        //     que = `report/stock/${code}/detail?page=${page}`;
        // }
        // if(dateFrom!==''&&dateTo!==''&&location===''){
        //     que = `report/stock/${code}/detail?page=${page}&datefrom=${dateFrom}&dateto=${dateFrom}`;
        // }
        // if(dateFrom!==''&&dateTo!==''&&location!==''){
        //     que = `report/stock/${code}/detail?page=${page}&datefrom=${dateFrom}&dateto=${dateFrom}&lokasi=${location}`;
        // }
        // if(location!==''){
        //     que = `report/stock/${code}/detail?page=${page}&lokasi=${location}`;
        // }
        // console.log(`${que}`);
        axios.get(HEADERS.URL+`report/stock/${code}/detail?page=${page}&datefrom=2019-01-16&lokasi=${location}&dateto=2020-06-18`,headers)
            .then(function(response){
                const data = response.data;
                console.log(data);
                dispatch(setStockReportDetailTransaction(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}