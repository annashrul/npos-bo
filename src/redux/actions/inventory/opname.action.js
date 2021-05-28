import {OPNAME, HEADERS} from "../_constants";
import axios from 'axios';
import Swal from "sweetalert2";
import {destroy} from "components/model/app.model";
import Nprogress from "nprogress";
import "nprogress/nprogress.css";

export function setLoading(load){
    return {type : OPNAME.LOADING,load}
}
export function setOpname(data=[]){
    return {type:OPNAME.SUCCESS,data}
}
export function setOpnameExcel(data=[]){
    return {type:OPNAME.SUCCESS_EXCEL,data}
}
export function setPostingOpname(data=[]){
    return {type:OPNAME.DATA_POSTING,data}
}
export function setOpnameFailed(data=[]){
    return {type:OPNAME.FAILED,data}
}

export const FetchPostingOpname = (page=1,where='')=>{
    return (dispatch) => {
        Nprogress.start();
        dispatch(setLoading(true));
        let url=`opname/report?page=${page}&status=0`;
        if(where!==''){
            url+=where
        }
        
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                dispatch(setPostingOpname(data));
                dispatch(setLoading(false));
                Nprogress.done();
            }).catch(function(error){
                Nprogress.done();
            
        })
    }
}
export const FetchOpname = (page=1,where='')=>{
    return (dispatch) => {
        Nprogress.start();
        dispatch(setLoading(true));
        let url=`opname/report?page=${page==='NaN'||page===null||page===''||page===undefined?1:page}`;
        if(where!==''){
            url+=where
        }
        
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                
                dispatch(setOpname(data));
                dispatch(setLoading(false));
                Nprogress.done();
            }).catch(function(error){
                Nprogress.done();
        })
    }
}
export const FetchOpnameExcel = (page=1,where='',perpage=99999)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url=`opname/report?page=${page==='NaN'||page===null||page===''||page===undefined?1:page}&perpage=${perpage}`;
        if(where!==''){
            url+=where
        }
        
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                
                dispatch(setOpnameExcel(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}

// export const FetchOpnameData = (nota) => {
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


export const storeOpname = (data) => {
    return (dispatch) => {
        Swal.fire({
            allowOutsideClick: false,
            title: 'Please Wait.',
            html: 'Sending request..',
            onBeforeOpen: () => {
                Swal.showLoading()
            },
            onClose: () => {}
        })
        dispatch(setLoading(true))
        const url = HEADERS.URL + `opname`;
        axios.post(url, data)
            .then(function (response) {
                Swal.close();
                Swal.fire({allowOutsideClick: false,
                    title: 'Success',
                    type: 'success',
                    text:"Transaksi Berhasil",
                }).then((result)=>{
                    destroy('opname');
                    localStorage.removeItem("location_opname");
                    window.location.reload(false);
                });
                dispatch(setLoading(false));

            })
            .catch(function (error) {
                Swal.close();

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

export const storeOpnamePosting = (data,param) => {
    return (dispatch) => {
        Swal.fire({
            allowOutsideClick: false,
            title: 'Please Wait.',
            html: 'Sending request..',
            onBeforeOpen: () => {
                Swal.showLoading()
            },
            onClose: () => {}
        })

        dispatch(setLoading(true));
        let url='';
        if(param==='all'){
            url = `opname/posting/all`
        }else{
            url = `opname/posting/item`
        }
        axios.post(HEADERS.URL + url, data)
            .then(function (response) {
                Swal.close();
                Swal.fire({allowOutsideClick: false,
                    title: 'Success',
                    type: 'success',
                    text:"Transaksi Berhasil",
                }).then((result)=>{
                    dispatch(FetchPostingOpname(1))
                });

                dispatch(setLoading(false));

            })
            .catch(function (error) {
                Swal.close()
                Swal.fire({allowOutsideClick: false,
                    title: 'Failed',
                    type: 'error',
                    text: 'Gagal posting opname.',
                });

                if (error.response) {
                    
                }
            })
    }
}

export const cancelOpname = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = `opname/`

        axios.put(HEADERS.URL + url, data)
            .then(function (response) {
                Swal.fire({allowOutsideClick: false,
                    title: 'Success',
                    type: 'success',
                    text: "Cancel Opname Berhasil",
                }).then((result) => {
                    dispatch(FetchPostingOpname(1))
                });

                dispatch(setLoading(false));

            })
            .catch(function (error) {
                Swal.fire({allowOutsideClick: false,
                    title: 'Failed',
                    type: 'error',
                    text: "Gagal Cancel opname",
                });

                if (error.response) {

                }
            })
    }
}

