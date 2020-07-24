import {
    SITE,
    HEADERS
} from "./_constants"
import axios from "axios"

export const setEcaps = (bool) => dispatch => {
    dispatch(setEcaps_(bool));
}
export function setEcaps_(bool) {
    return {
        type: SITE.TRIGGER_ECAPS,
        data:bool
    }
}

export function setLoading(load) {
    return {
        type: SITE.LOADING,
        load
    }
}
export function setCheck(data = []) {
    return {
        type: SITE.SUCCESS_CHECK,
        data
    }
}

export const FetchCheck = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `site/cekdata`;
        axios.post(url, data)
            .then(function (response) {
                const data = response.data

                dispatch(setCheck(data))
                dispatch(setLoading(false));

            })
            .catch(function (error) {

                if (error.response) {
                    console.log("error")
                }
            })
    }
}
