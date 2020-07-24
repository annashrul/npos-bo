import {COMPANY,HEADERS} from "../../_constants";
import axios from "axios"
import Swal from 'sweetalert2'
import {setLoading} from "../../sale/sale.action";


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
                console.log(data);
                dispatch(setSuccessGet(data));
                dispatch(setLoadingGet(false));
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    }
}

export const storeCompany = (data) => {
    return (dispatch) => {
        dispatch(setLoadingPost(true))
        const url = HEADERS.URL + `site`;
        axios.put(url, data)
            .then(function (response) {
                const data = (response.data)
                console.log("RESPONS FORM",data);
                dispatch(FetchCompany());
                dispatch(setLoadingPost(false));

            })
            .catch(function (error) {
                dispatch(setLoadingPost(false));
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

