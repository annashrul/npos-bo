import {COMPANY,HEADERS} from "../../_constants";
import axios from "axios"
import Swal from 'sweetalert2'


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
