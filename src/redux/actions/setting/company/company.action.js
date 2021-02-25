import {COMPANY,HEADERS} from "../../_constants";
import axios from "axios"
import Swal from 'sweetalert2'
import {logoutUser} from "../../authActions";

export function setLoadingGet(load) {
    return {
        type: COMPANY.LOADING_GET,
        load
    }
}


export function setSuccessGet(data = []) {
    return {
        type: COMPANY.SUCCESS_GET,
        data
    }
}
export function setFailedGet(data = []) {
    return {
        type: COMPANY.FAILED_GET,
        data
    }
}


export function setLoadingPost(load) {
    return {
        type: COMPANY.LOADING_POST,
        load
    }
}
export function setSuccessPost(data = []) {
    return {
        type: COMPANY.SUCCESS_POST,
        data
    }
}
export function setFailedPost(data = []) {
    return {
        type: COMPANY.FAILED_POST,
        data
    }
}

export const FetchCompany = () => {
    return (dispatch) => {
        dispatch(setLoadingGet(true));
        axios.get(HEADERS.URL + `site`)
            .then(function (response) {
                const data = response.data;
                
                dispatch(setSuccessGet(data));
                dispatch(setLoadingGet(false));
            })
            .catch(function (error) {
                // handle error
                
            })

    }
}

export const storeCompany = (data) => {
    return (dispatch) => {
        dispatch(setLoadingPost(true))
        const url = HEADERS.URL + `site`;
        axios.put(url, data)
            .then(function (response) {
                dispatch(FetchCompany());
                dispatch(setLoadingPost(false));
                Swal.fire({allowOutsideClick: false,
                    title: 'Berhasil merubah data.',
                    type: 'success',
                    text: "Silahkan login kembali untuk melanjutkan",
                }).then((res)=>{
                    dispatch(logoutUser());
                });


            })
            .catch(function (error) {
                dispatch(setLoadingPost(false));
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

