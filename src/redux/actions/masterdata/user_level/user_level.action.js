import {USER_LEVEL, HEADERS} from "../../_constants";
import axios from 'axios';
import Swal from "sweetalert2";
import {ModalToggle} from "../../modal.action";


export function setLoading(load){
    return {type : USER_LEVEL.LOADING, load}
}

export function setUserLevel(data=[]){
    return {type:USER_LEVEL.SUCCESS,data}
}
export function setUserLevelFailed(data=[]){
    return {type:USER_LEVEL.FAILED,data}
}
export  const FetchUserLevel = (page=1,q,perpage) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const headers = {
            headers : { 'Content-Type': 'application/x-www-form-urlencoded'}
        };
        let url = '';
        if(q===null||q===''||q===undefined){
            url = `userLevel?page=${page}`;
        }else{
            url = `userLevel?page=${page}&q=${q}`;
        }

        
        axios.get(HEADERS.URL + `${url}&perpage=${perpage}`,headers)
            .then(function(response){
                const data = response.data;
                
                dispatch(setUserLevel(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
};



export const createUserLevel = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `userLevel`;

        axios.post(url, data)
            .then(function (response) {
                const data = (response.data)
                
                if (data.status === 'success') {
                    Swal.fire({
                        title: 'Success',
                        type: 'success',
                        text: data.msg,
                    });
                } else {
                    Swal.fire({
                        title: 'failed',
                        type: 'danger',
                        text: data.msg,
                    });
                }
                dispatch(setLoading(false));
                dispatch(FetchUserLevel(1,'',15));
            })
            .catch(function (error) {
                dispatch(setLoading(false));
                dispatch(ModalToggle(true));
                Swal.fire({
                    title: 'failed',
                    type: 'danger',
                    text: error.response.data.msg,
                });

                if (error.response) {
                    
                }
            })
    }
}


export const updateUserLevel = (id,data) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `userLevel/${id}`;

        axios.put(url, data)
            .then(function (response) {
                const data = (response.data);
                if (data.status === 'success') {
                    Swal.fire({
                        title: 'Success',
                        type: 'success',
                        text: data.msg,
                    });
                } else {
                    Swal.fire({
                        title: 'failed',
                        type: 'danger',
                        text: data.msg,
                    });
                }
                dispatch(setLoading(false));
                dispatch(FetchUserLevel(1,'','15'));
            })
            .catch(function (error) {
                // handle error
                dispatch(setLoading(false));
                
                Swal.fire({
                    title: 'failed',
                    type: 'danger',
                    text: error.response.data.msg,
                });
                if (error.response) {
                    
                }
            })
    }
}

export const deleteUserLevel = (id) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `userLevel/${id}`;
        axios.delete(url)
            .then(function (response) {
                const data = (response.data);
                
                if (data.status === 'success') {
                    Swal.fire({
                        title: 'Success',
                        type: 'success',
                        text: data.msg,
                    });
                } else {
                    Swal.fire({
                        title: 'failed',
                        type: 'danger',
                        text: data.msg,
                    });
                }
                dispatch(setLoading(false));
                dispatch(FetchUserLevel(1,'',15));
            })
            .catch(function (error) {
                dispatch(setLoading(false));
                
                Swal.fire({
                    title: 'failed',
                    type: 'danger',
                    text: error.response.data.msg,
                });
                if (error.response) {
                    
                }
            })
    }
}