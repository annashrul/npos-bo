import {
    SITE,
    HEADERS, ADJUSTMENT
} from "./_constants"
import axios from "axios"
import {destroy,store} from "components/model/app.model";
import {ModalToggle, ModalType} from "./modal.action";

export const setEcaps = (bool) => dispatch => {
    dispatch(setEcaps_(bool));
}
export const setMobileEcaps = (bool) => dispatch => {
    dispatch(setMobileEcaps_(bool));
}
export function setEcaps_(bool) {
    return {
        type: SITE.TRIGGER_ECAPS,
        data:bool
    }
}
export function setMobileEcaps_(bool) {
    return {
        type: SITE.TRIGGER_MOBILE_ECAPS,
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
export function setLinkTxt(data=[]){
    return {type:SITE.DOWNLOAD_TXT,data}
}
export const FetchCheck = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `site/cekdata`;
        axios.post(url, data)
            .then(function (response) {
                const data = response.data
                console.log(data);
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

export const storeCetakBarcode = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `site/generate_barcode`;
        axios.post(url, data)
            .then(function (response) {
                const data = response.data;
                dispatch(setLoading(false));
                localStorage.removeItem('lk');
                destroy('cetak_barcode');
                dispatch(setLinkTxt(data));
            })
            .catch(function (error) {

                if (error.response) {
                    console.log("error")
                }
            })
    }
}

