import {
    CLOSING,
    HEADERS
} from "../../_constants"
import axios from "axios"
import Swal from 'sweetalert2'
import {
    destroy
} from "components/model/app.model";
import moment from "moment";

export function setLoading(load) {
    return {
        type: CLOSING.LOADING,
        load
    }
}
export function setLoadingDetail(load){
    return {
        type : CLOSING.LOADING_DETAIL,
        load}
}
export function setCLOSING(data = []) {
    return {
        type: CLOSING.SUCCESS,
        data
    }
}

export function setCLOSINGData(data = []) {
    return {
        type: CLOSING.CLOSING_DATA,
        data
    }
}
export function setReport(data = []) {
    return {
        type: CLOSING.REPORT_SUCCESS,
        data
    }
}
export function setCode(data = []) {
    return {
        type: CLOSING.SUCCESS_CODE,
        data
    }
}
export function setPOFailed(data = []) {
    return {
        type: CLOSING.FAILED,
        data
    }
}

// export function setClosing(data=[]){
//     return {type:CLOSING.SUCCESS,data}
// }
export function setClosingDetail(data=[]){
    return {type:CLOSING.DETAIL,data}
}

export const FetchDnReport = (page = 1, perpage = 10) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `purchaseorder/report/closing?page=${page}&perpage=${perpage}&status=0`)
            .then(function (response) {
                const data = response.data
                dispatch(setReport(data))
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    }
}

export const FetchDnData = (nota) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `purchaseorder/ambil_data/${nota}`)
            .then(function (response) {
                const data = response.data
                dispatch(setCLOSINGData(data))
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    }
}

export const FetchNota = (lokasi, prefix) => {
    return (dispatch) => {
        dispatch(setLoading(true));

        axios.get(HEADERS.URL + `getcode?lokasi=${lokasi}&prefix=${prefix}`)
            .then(function (response) {
                const data = response.data
                dispatch(setCode(data))
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    }
}

export const storeClosing = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `alokasi`;
        axios.post(url, data)
            .then(function (response) {
                const data = (response.data)
                Swal.fire({
                    title: 'Transaksi berhasil.',
                    text: `Disimpan dengan nota: ${data.result.insertId}`,
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#ff9800',
                    cancelButtonColor: '#2196F3',
                    confirmButtonText: 'Print Nota?',
                    cancelButtonText: 'Oke!'
                }).then((result) => {
                    if (result.value) {
                        const win = window.open('http://google.com', '_blank');
                        if (win != null) {
                            win.focus();
                        }
                    }
                    destroy('alokasi');
                    localStorage.removeItem('lk2');
                    localStorage.removeItem('lk');
                    localStorage.removeItem('ambil_data');
                    localStorage.removeItem('nota');
                    localStorage.removeItem('catatan');;
                    window.location.reload(false);
                })
                dispatch(setLoading(false));

            })
            .catch(function (error) {

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

export const reClosing = (data) => {
    console.log("DATA TI CLOSING",data)
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `pos/reclosing`;
        axios.post(url,data)
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
                // dispatch(FetchProduct(1,'',''));
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
};
export const FetchClosing = (page=1,dateFrom='',lokasi='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        // report/stock?page=1&datefrom=2020-01-01&dateto=2020-07-01&lokasi=LK%2F0001
        let url = '';
        url = `report/closing?page=${page}`;
        // if(q===''){
        //     url = `report/closing?page=${page}`;
        // }else{
        //     url = `report/closing?page=${page}&q=${q}`;
        // }
        console.log("url closing",`${url}`);
        
        axios.get(HEADERS.URL+`${url}`+`&datefrom=`+moment(dateFrom).format("yyyy-MM-DD")+`&lokasi=`+lokasi)
            .then(function(response){
                const data = response.data;
                console.log(data);
                dispatch(setCLOSING(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}
export const FetchClosingDetail = (page=1,code,dateFrom='',dateTo='',location='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let que = '';
        if(dateFrom===''&&dateTo===''&&location===''){
            que = `report/${code}?page=${page}`;
        }
        if(dateFrom!==''&&dateTo!==''&&location===''){
            que = `report/${code}?page=${page}&datefrom=${dateFrom}&dateto=${dateFrom}`;
        }
        if(dateFrom!==''&&dateTo!==''&&location!==''){
            que = `report/${code}?page=${page}&datefrom=${dateFrom}&dateto=${dateFrom}&lokasi=${location}`;
        }
        if(location!==''){
            que = `report/${code}?page=${page}&lokasi=${location}`;
        }
        console.log("url alokasi",`${que}`);
        axios.get(HEADERS.URL+`${que}`)
            .then(function(response){
                const data = response.data;
                console.log(data);
                dispatch(setCLOSINGData(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}
