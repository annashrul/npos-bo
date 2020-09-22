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

export const FetchPostingLogTrx = (page=1,where='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url=`log/transaksi?page=${page}&status=0`;
        if(where!==''){
            url+=where
        }
        
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                
                dispatch(setPostingLogTrx(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
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

export const storeLogTrx = (data,param) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const rawdata=data;
        const url = HEADERS.URL + `log_trx`;
        axios.post(url, data.detail)
            .then(function (response) {
                Swal.fire({
                    title: 'Transaksi berhasil.',
                    type: 'info',
                    html: `Data telah disimpan!` +
                        "<br><br>" +
                        // '<button type="button" role="button" tabindex="0" id="btnNotaPdf" class="btn btn-primary">Nota PDF</button>    ' +
                        '<button type="button" role="button" tabindex="0" id="btnNota3ply" class="btn btn-info">Nota 3ply</button>',
                    showCancelButton: true,
                    showConfirmButton: false
                }).then((result)=>{
                    localStorage.removeItem("lokasi1_log_trx");
                    localStorage.removeItem("lokasi2_log_trx");
                    localStorage.removeItem("search_log_trx");
                    if(result.dismiss === 'cancel'){
                        window.location.reload(false);
                    }
                });
                // document.getElementById("btnNotaPdf").addEventListener("click", () => {
                //     const win = window.open(data.result.nota, '_blank');
                //     if (win != null) {
                //         win.focus();
                //     }
                // });
                document.getElementById("btnNota3ply").addEventListener("click", () => {
                    param({
                        pathname: '/log_trx3ply',
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
export const storeLogTrxPosting = (data,param) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        let url='';
        if(param==='all'){
            url = `log_trx/posting/all`
        }else{
            url = `log_trx/posting/item`
        }
        axios.post(HEADERS.URL + url, data)
            .then(function (response) {
                Swal.fire({
                    title: 'Success',
                    type: 'success',
                    text:"Transaksi Berhasil",
                }).then((result)=>{
                    dispatch(FetchPostingLogTrx(1))
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


