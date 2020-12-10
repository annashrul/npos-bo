import {USER_LIST,HEADERS} from "../../_constants";
import axios from "axios"
import Swal from "sweetalert2";
import {ModalToggle} from "../../modal.action";


export function setLoading(load) {
    return {
        type: USER_LIST.LOADING,
        load
    }
}

export function setUserList(data = []) {
    return {
        type: USER_LIST.SUCCESS,
        data
    }
}

export function setUserListEdit(data = []) {
    return {
        type: USER_LIST.EDIT,
        data
    }
}
export function setUserListDetail(data = []) {
    return {
        type: USER_LIST.DETAIL,
        data
    }
}

export function setUserListFailed(data = []) {
    return {
        type: USER_LIST.FAILED,
        data
    }
}

export const FetchUserList = (page=1,q) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const headers = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let url = '';
        if(q===null||q===''||q===undefined){
            url = `user?page=${page}`;
        }else{
            url = `user?page=${page}&q=${q}`;
        }
        
        axios.get(HEADERS.URL + `${url}&perpage=15`, headers)
            .then(function (response) {
                const data = response.data;
                
                dispatch(setUserList(data));
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error
                
            })

    }
};

export const sendUserList = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `user`;
        // const headers = {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `${token}`,
        //         'username': `${HEADERS.USERNAME}`,
        //         'password': `${HEADERS.PASSWORD}`,
        //         'crossDomain': true
        //     }
        // }
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
                dispatch(FetchUserList());
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

export const updateUserList = (id,data) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `user/${id}`;
        axios.put(url, data)
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
                dispatch(ModalToggle(false));
                dispatch(setLoading(false));
                dispatch(FetchUserList(1,''));
            })
            .catch(function (error) {
                // handle error
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

export const deleteUserList = (id) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `user/${id}`;

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
                dispatch(FetchUserList(1,''));
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

export const FetchUserListEdit = (id) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const headers = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        axios.get(HEADERS.URL + `user/${id}`, headers)
            .then(function (response) {
                const data = response.data;
                
                dispatch(setUserListEdit(data));
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error
                
            })

    }
};


export const FetchUserListDetail = (id) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const headers = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        axios.get(HEADERS.URL + `user/${id}`, headers)
            .then(function (response) {
                const data = response.data;
                
                dispatch(setUserListDetail(data));
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error
                
            })

    }
};


