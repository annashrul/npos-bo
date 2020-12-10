import {BANK, HEADERS} from "../../_constants";
import axios from 'axios';
import Swal from "sweetalert2";


export function setLoading(load){
    return {type : BANK.LOADING,load}
}

export function setBank(data=[]){
    return {type:BANK.SUCCESS,data}
}
export function setBankFailed(data=[]){
    return {type:BANK.FAILED,data}
}
export const FetchBank = (page=1,param,perpage=10)=>{
    return (dispatch) => {

        dispatch(setLoading(true));
        let que = '';
        if(param===null){
            
            que = `bank?page=${page}&perpage=${perpage}`;
        }else{
            
            que = `bank?page=${page}&q=${param}&perpage=${perpage}`;
        }
        axios.get(HEADERS.URL+`${que}`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setBank(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}


export const createBank = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `bank`;
        axios.post(url, data)
            .then(function (response) {
                const data = (response.data)
                if (data.status === 'success') {
                    Swal.fire({allowOutsideClick: false,
                        title: 'Success',
                        type: 'success',
                        text: data.msg,
                    });
                } else {
                    Swal.fire({allowOutsideClick: false,
                        title: 'failed',
                        type: 'error',
                        text: data.msg,
                    });
                }
                dispatch(setLoading(false));
                dispatch(FetchBank(1,null));

            })
            .catch(function (error) {
                dispatch(setLoading(false));

                Swal.fire({allowOutsideClick: false,
                    title: 'failed',
                    type: 'error',
                    text: error.response === undefined?'error!':error.response.data.msg,
                });

                if (error.response) {
                    
                }
            })
    }
}
export const updateBank = (id,data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `bank/${id}`;
        axios.put(url, data)
            .then(function (response) {
                const data = (response.data)
                if (data.status === 'success') {
                    Swal.fire({allowOutsideClick: false,
                        title: 'Success',
                        type: 'success',
                        text: data.msg,
                    });
                } else {
                    Swal.fire({allowOutsideClick: false,
                        title: 'failed',
                        type: 'error',
                        text: data.msg,
                    });
                }
                dispatch(setLoading(false));
                dispatch(FetchBank(1,null));

            })
            .catch(function (error) {
                dispatch(setLoading(false));

                Swal.fire({allowOutsideClick: false,
                    title: 'failed',
                    type: 'error',
                    text: error.response === undefined?'error!':error.response.data.msg,
                });

                if (error.response) {
                    
                }
            })
    }
}

export const deleteBank = (id) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `bank/${id}`;
        axios.delete(url)
            .then(function (response) {
                const data = (response.data);
                if (data.status === 'success') {
                    Swal.fire({allowOutsideClick: false,
                        title: 'Success',
                        type: 'success',
                        text: data.msg,
                    });
                } else {
                    Swal.fire({allowOutsideClick: false,
                        title: 'failed',
                        type: 'error',
                        text: data.msg,
                    });
                }
                dispatch(setLoading(false));
                dispatch(FetchBank(1,''));
            })
            .catch(function (error) {
                dispatch(setLoading(false));
                Swal.fire({allowOutsideClick: false,
                    title: 'failed',
                    type: 'error',
                    text: error.response === undefined?'error!':error.response.data.msg,
                });
                if (error.response) {
                    
                }
            })
    }
}
