import {LOG_ACT, HEADERS} from "../../_constants";
import axios from 'axios';
import Swal from "sweetalert2";

export function setLoading(load){
    return {type : LOG_ACT.LOADING,load}
}
export function setLogAct(data=[]){
    return {type:LOG_ACT.SUCCESS,data}
}
export function setLogActTrx(data=[]){
    return {type:LOG_ACT.SUCCESS_TRX,data}
}
export function setLogActExcel(data=[]){
    return {type:LOG_ACT.SUCCESS_EXCEL,data}
}
export function setPostingLogAct(data=[]){
    return {type:LOG_ACT.DATA_POSTING,data}
}
export function setLogActFailed(data=[]){
    return {type:LOG_ACT.FAILED,data}
}

export const FetchPostingLogAct = (page=1,where='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url=`log/master?page=${page}&status=0`;
        if(where!==''){
            url+=where
        }
        
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                
                dispatch(setPostingLogAct(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}
export const FetchLogAct = (page=1,where='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url=`log/master?page=${page==='NaN'||page===null||page===''||page===undefined?1:page}`;
        if(where!==''){
            url+=where
        }
        
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                
                dispatch(setLogAct(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}
export const FetchLogActExcel = (page=1,where='',perpage=99999)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url=`log/master?page=${page==='NaN'||page===null||page===''||page===undefined?1:page}&perpage=${perpage}`;
        if(where!==''){
            url+=where
        }
        
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                
                dispatch(setLogActExcel(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}

export const storeLogAct = (data,param) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const rawdata=data;
        const url = HEADERS.URL + `log_act`;
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
                    localStorage.removeItem("lokasi1_log_act");
                    localStorage.removeItem("lokasi2_log_act");
                    localStorage.removeItem("search_log_act");
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
                        pathname: '/log_act3ply',
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
export const storeLogActPosting = (data,param) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        let url='';
        if(param==='all'){
            url = `log_act/posting/all`
        }else{
            url = `log_act/posting/item`
        }
        axios.post(HEADERS.URL + url, data)
            .then(function (response) {
                Swal.fire({
                    title: 'Success',
                    type: 'success',
                    text:"Transaksi Berhasil",
                }).then((result)=>{
                    dispatch(FetchPostingLogAct(1))
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


