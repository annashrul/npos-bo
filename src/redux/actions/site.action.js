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
export function setList(data = []) {
    return {
        type: SITE.SUCCESS_LIST,
        data
    }
}
export function setFolder(data = []) {
    return {
        type: SITE.SUCCESS_FOLDER,
        data
    }
}
export function setTables(data = []) {
    return {
        type: SITE.SUCCESS_TABLES,
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
export const FetchFolder = () => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `site/folders`)
            .then(function (response) {
                const data = response.data;
                dispatch(setFolder(data));
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error
                dispatch(setLoading(false));
            })

    }
}
export const FetchFiles = (path) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        
        let where = '';
        if(path!==undefined){
            where +=`?path=${path}`;
        }
        axios.get(HEADERS.URL + `site/files`+where)
            .then(function (response) {
                const data = response.data;
                dispatch(setList(data));
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error
                dispatch(setLoading(false));
            })

    }
}
export const FetchTables = () => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `site/tables`)
            .then(function (response) {
                const data = response.data;
                dispatch(setTables(data));
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error
                dispatch(setLoading(false));
            })

    }
}
export const storeBackup = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `site/backup`;
        axios.post(url,data)
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
                        type: 'error',
                        text: data.msg,
                    });
                }
                dispatch(setLoading(false));
                dispatch(FetchFiles());
            })
            .catch(function (error) {
                dispatch(setLoading(false));
                Swal.fire({
                    title: 'failed',
                    type: 'error',
                    text: error.response === undefined?'error!':error.response.data.msg,
                });
                if (error.response) {
                }
            })
    }
}
export const deleteFiles = (id, i) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `site/files/del`;
        axios.delete(url, { data: { path: i }})
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
                        type: 'error',
                        text: data.msg,
                    });
                }
                dispatch(setLoading(false));
                let path = localStorage.getItem('id_file_manager_val');
                if(path !== undefined){
                    dispatch(FetchFiles(path));
                }
                localStorage.removeItem('id_file_manager_val');
                dispatch(FetchFiles());
            })
            .catch(function (error) {
                dispatch(setLoading(false));
                Swal.fire({
                    title: 'failed',
                    type: 'error',
                    text: error.response === undefined?'error!':error.response.data.msg,
                });
                if (error.response) {
                }
            })
    }
}
export const mergeStock = () => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `site/merge_stock`;
        axios.post(url)
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
                        type: 'error',
                        text: data.msg,
                    });
                }
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                dispatch(setLoading(false));
                Swal.fire({
                    title: 'failed',
                    type: 'error',
                    text: error.response === undefined?'error!':error.response.data.msg,
                });
                if (error.response) {
                }
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


export const importTable = (data) => {
    
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `site/pushTable`;
        axios.post(url,data)
            .then(function (response) {
                const data = (response.data);
                
                if (data.status === 'success') {
                    Swal.fire({
                        title: 'Success',
                        icon: 'success',
                        text: data.msg,
                    });
                } else {
                    Swal.fire({
                        title: 'failed',
                        icon: 'error',
                        text: data.msg,
                    });
                }
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error
                dispatch(setLoading(false));
                
                Swal.fire({
                    title: 'failed',
                    icon: 'error',
                    text: error.response.data.msg,
                });
                if (error.response) {
                    
                }
            })

        }
    };
