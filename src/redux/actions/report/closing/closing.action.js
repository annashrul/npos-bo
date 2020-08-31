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
                    
                }
            })
    }
}
export const reClosing = (data) => {
    return (dispatch) => {
        const url = HEADERS.URL + `pos/reclosing`;
        axios.post(url,data)
            .then(function (response) {
                const data = (response.data);
                dispatch(FetchClosing(1,''));
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


            })
            .catch(function (error) {

                Swal.fire({
                    title: 'failed',
                    type: 'danger',
                    text: error.response.data.msg,
                });
                if (error.response) {
                    
                }
            })
    }
};
export const FetchClosing = (page=1,where='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = `report/closing?page=${page}`;
        if(where !==''){
            url+=`${where}`
        }
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                dispatch(setCLOSING(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
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
        axios.get(HEADERS.URL+`${que}`)
            .then(function(response){
                const data = response.data;
                dispatch(setCLOSINGData(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}
