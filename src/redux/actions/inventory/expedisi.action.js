import {EXPEDISI, HEADERS} from "../_constants";
import axios from 'axios';
import Swal from "sweetalert2";

export function setLoading(load){
    return {type : EXPEDISI.LOADING,load}
}
export function setExpedisi(data=[]){
    return {type:EXPEDISI.SUCCESS,data}
}
export function setExpedisiTrx(data=[]){
    return {type:EXPEDISI.SUCCESS_TRX,data}
}
export function setExpedisiExcel(data=[]){
    return {type:EXPEDISI.SUCCESS_EXCEL,data}
}
export function setPostingExpedisi(data=[]){
    return {type:EXPEDISI.DATA_POSTING,data}
}
export function setExpedisiFailed(data=[]){
    return {type:EXPEDISI.FAILED,data}
}

export const FetchPostingExpedisi = (page=1,where='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url=`expedisi/report?page=${page}&status=0`;
        if(where!==''){
            url+=where
        }
        
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                
                dispatch(setPostingExpedisi(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}
export const FetchExpedisi = (page=1,where='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url=`expedisi/report?page=${page==='NaN'||page===null||page===''||page===undefined?1:page}`;
        if(where!==''){
            url+=where
        }
        
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                
                dispatch(setExpedisi(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}
export const FetchExpedisiExcel = (page=1,where='',perpage=99999)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url=`expedisi/report?page=${page==='NaN'||page===null||page===''||page===undefined?1:page}&perpage=${perpage}`;
        if(where!==''){
            url+=where
        }
        
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                
                dispatch(setExpedisiExcel(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}

// export const FetchExpedisiData = (nota) => {
//     return (dispatch) => {
//         dispatch(setLoading(true));
//         axios.get(HEADERS.URL + `deliverynote/ambil_data/${nota}`)
//             .then(function (response) {
//                 const data = response.data
//                 dispatch(setDnData(data))
//                 dispatch(setLoading(false));
//             })
//             .catch(function (error) {
//                 // handle error
//                 
//             })

//     }
// }


export const storeExpedisi = (data,param) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const rawdata=data;
        const url = HEADERS.URL + `expedisi`;
        axios.post(url, data.detail)
            .then(function (response) {
                Swal.fire({allowOutsideClick: false,
                    title: 'Transaksi berhasil.',
                    type: 'info',
                    html: `Data telah disimpan!` +
                        "<br><br>" +
                        // '<button type="button" role="button" tabindex="0" id="btnNotaPdf" class="btn btn-primary">Nota PDF</button>    ' +
                        '<button type="button" role="button" tabindex="0" id="btnNota3ply" class="btn btn-info">Nota 3ply</button>',
                    showCancelButton: true,
                    showConfirmButton: false
                }).then((result)=>{
                    localStorage.removeItem("lokasi1_expedisi");
                    localStorage.removeItem("lokasi2_expedisi");
                    localStorage.removeItem("search_expedisi");
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
                        pathname: '/expedisi3ply',
                        state: {
                            data: rawdata,
                            nota: data.result.kode
                        }
                    })
                    //Swal.closeModal();==
                    return false;
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
export const storeExpedisiPosting = (data,param) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        let url='';
        if(param==='all'){
            url = `expedisi/posting/all`
        }else{
            url = `expedisi/posting/item`
        }
        axios.post(HEADERS.URL + url, data)
            .then(function (response) {
                Swal.fire({allowOutsideClick: false,
                    title: 'Success',
                    type: 'success',
                    text:"Transaksi Berhasil",
                }).then((result)=>{
                    dispatch(FetchPostingExpedisi(1))
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


