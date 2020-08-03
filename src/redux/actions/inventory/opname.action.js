import {OPNAME, HEADERS} from "../_constants";
import axios from 'axios';
import Swal from "sweetalert2";
import {destroy} from "components/model/app.model";
import {setAdjustmentAll} from "../adjustment/adjustment.action";

export function setLoading(load){
    return {type : OPNAME.LOADING,load}
}
export function setOpname(data=[]){
    return {type:OPNAME.SUCCESS,data}
}
export function setPostingOpname(data=[]){
    return {type:OPNAME.DATA_POSTING,data}
}
export function setOpnameFailed(data=[]){
    return {type:OPNAME.FAILED,data}
}

export const FetchPostingOpname = (page=1,where='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url=`opname/report?page=${page}&status=0`;
        if(where!==''){
            url+=where
        }
        console.log(url)
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                console.log(data);
                dispatch(setPostingOpname(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}


export const storeOpname = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `opname`;
        axios.post(url, data)
            .then(function (response) {
                const data = (response.data)
                Swal.fire({
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

export const storeOpnamePosting = (data,param) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        let url='';
        if(param==='all'){
            url = `opname/posting/all`
        }else{
            url = `opname/posting/item`
        }
        axios.post(HEADERS.URL + url, data)
            .then(function (response) {
                const data = (response.data)
                Swal.fire({
                    title: 'Success',
                    type: 'success',
                    text:"Transaksi Berhasil",
                }).then((result)=>{
                    dispatch(FetchPostingOpname(1))
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


