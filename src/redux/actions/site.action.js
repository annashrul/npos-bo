import {
    SITE,
    HEADERS
} from "./_constants"
import axios from "axios"
import {destroy} from "components/model/app.model";
import * as Swal from "sweetalert2";

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
export function setSite(data = []) {
    return {
        type: SITE.SUCCESS,
        data
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
export const FetchSite = () => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `site/logo`)
            .then(function (response) {
                const data = response.data;
                dispatch(setSite(data));
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error
                dispatch(setLoading(false));
            })

    }
}
export const storeSite = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `site`;
        axios.put(url,data)
            .then(function (response) {
                dispatch(setLoading(false));
                Swal.fire({
                    title: 'Berhasil',
                    text: `Data Berhasil DIsimpan`,
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#ff9800',
                    confirmButtonText: 'Oke',
                }).then((result) => {
                    if (result.value) {
                        dispatch(FetchSite());
                        dispatch(setLoading(false));
                    }
                })

            })
            .catch(function (error) {
                // handle error
                dispatch(setLoading(false));
            })

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
                    
                }
            })
    }
}

