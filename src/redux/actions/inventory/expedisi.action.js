import {EXPEDISI, HEADERS} from "../_constants";
import axios from 'axios';
import Swal from "sweetalert2";
import {destroy} from "components/model/app.model";
import {setAdjustmentAll} from "../adjustment/adjustment.action";

export function setLoading(load){
    return {type : EXPEDISI.LOADING,load}
}
export function setExpedisi(data=[]){
    return {type:EXPEDISI.SUCCESS,data}
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
        console.log(url)
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                console.log(data);
                dispatch(setPostingExpedisi(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
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
        console.log(url)
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                console.log("FetchExpedisi",data);
                dispatch(setExpedisi(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
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
        console.log(url)
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                console.log("FetchExpedisiExcel",data);
                dispatch(setExpedisiExcel(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
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
//                 console.log(error);
//             })

//     }
// }


export const storeExpedisi = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `expedisi`;
        axios.post(url, data)
            .then(function (response) {
                const data = (response.data)
                Swal.fire({
                    title: 'Success',
                    type: 'success',
                    text:"Transaksi Berhasil",
                }).then((result)=>{
                    destroy('expedisi');
                    localStorage.removeItem("location_expedisi");
                    window.location.reload(false);
                });
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
                const data = (response.data)
                Swal.fire({
                    title: 'Success',
                    type: 'success',
                    text:"Transaksi Berhasil",
                }).then((result)=>{
                    dispatch(FetchPostingExpedisi(1))
                });

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


