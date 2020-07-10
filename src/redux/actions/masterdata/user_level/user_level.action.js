import {USER_LEVEL, HEADERS} from "../../_constants";
import axios from 'axios';
import Swal from "sweetalert2";
import {FetchCash} from "../cash/cash.action";
import {ModalToggle} from "../../modal.action";
import {FetchUserList} from "../user_list/user_list.action";


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

        console.log(url);
        axios.get(HEADERS.URL + `${url}&perpage=${perpage}`,headers)
            .then(function(response){
                const data = response.data;
                console.log("FETCH USER LEVEL",data);
                dispatch(setUserLevel(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error);
        })
    }
};



export const createUserLevel = (data,token) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `userLevel`;
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
                'username': `${HEADERS.USERNAME}`,
                'password': `${HEADERS.PASSWORD}`,
                'crossDomain': true
            }
        }
        axios.post(url, data, headers)
            .then(function (response) {
                const data = (response.data)
                console.log("DATA",data);
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
                    console.log("error")
                }
            })
    }
}


export const updateUserLevel = (id,data,token) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `userLevel/${id}`;
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
                'username': `${HEADERS.USERNAME}`,
                'password': `${HEADERS.PASSWORD}`,
                'crossDomain': true
            }
        }
        axios.put(url, data, headers)
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
                console.log(error);
                Swal.fire({
                    title: 'failed',
                    type: 'danger',
                    text: error.response.data.msg,
                });
                if (error.response) {
                    console.log("error")
                }
            })
    }
}

export const deleteUserLevel = (id,token) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `userLevel/${id}`;
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
                'username': `${HEADERS.USERNAME}`,
                'password': `${HEADERS.PASSWORD}`,
                'crossDomain': true
            }
        }
        console.log("=============== DELETE ====================");

        axios.delete(url,headers)
            .then(function (response) {
                const data = (response.data);
                console.log("DATA",data);
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
                console.log(error);
                Swal.fire({
                    title: 'failed',
                    type: 'danger',
                    text: error.response.data.msg,
                });
                if (error.response) {
                    console.log("error")
                }
            })
    }
}