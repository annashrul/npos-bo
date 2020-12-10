import {LOG_TRX, HEADERS} from "../../_constants";
import axios from 'axios';
import Swal from "sweetalert2";

export function setLoading(load){
    return {type : LOG_TRX.LOADING,load}
}
export function setLogTrx(data=[]){
    return {type:LOG_TRX.SUCCESS,data}
}
export function setLogTrxTrx(data=[]){
    return {type:LOG_TRX.SUCCESS_TRX,data}
}
export function setLogTrxExcel(data=[]){
    return {type:LOG_TRX.SUCCESS_EXCEL,data}
}
export function setPostingLogTrx(data=[]){
    return {type:LOG_TRX.DATA_POSTING,data}
}
export function setLogTrxFailed(data=[]){
    return {type:LOG_TRX.FAILED,data}
}

export const FetchLogTrx = (page=1,where='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url=`log/transaksi?page=${page==='NaN'||page===null||page===''||page===undefined?1:page}`;
        if(where!==''){
            url+=where
        }
        
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                
                dispatch(setLogTrx(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}
export const FetchLogTrxExcel = (page=1,where='',perpage=99999)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url=`log/transaksi?page=${page==='NaN'||page===null||page===''||page===undefined?1:page}&perpage=${perpage}`;
        if(where!==''){
            url+=where
        }
        
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                
                dispatch(setLogTrxExcel(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}

export const clearLogTrx = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        let url='log/transaksi';
        axios.post(HEADERS.URL + url, data)
            .then(function (response) {
                Swal.fire({allowOutsideClick: false,
                    title: 'Success',
                    type: 'success',
                    text:"Clearing Done!",
                });

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


