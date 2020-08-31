import {
    PIUTANG,
    HEADERS
} from "../_constants"
import axios from "axios"
import Swal from 'sweetalert2'



export function setLoading(load) {
    return {
        type: PIUTANG.LOADING,
        load
    }
}
export function setLoadingPost(load) {
    return {
        type: PIUTANG.LOADING,
        load
    }
}
export function setPiutang(data = []) {
    return {
        type: PIUTANG.SUCCESS,
        data
    }
}

export function setCode(data = []) {
    return {
        type: PIUTANG.SUCCESS_CODE,
        data
    }
}
export function setFailed(data = []) {
    return {
        type: PIUTANG.FAILED,
        data
    }
}

export function setPiutangReport(data=[]){
    return {type:PIUTANG.SUCCESS_REPORT,data}
}

export function setPiutangReportExcel(data=[]){
    return {type:PIUTANG.SUCCESS_EXCEL,data}
}

export const FetchPiutang = (nota) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `piutang/get?nota=${nota}`)
            .then(function (response) {
                const data = response.data;
                
                dispatch(FetchNotaPiutang(data.result.lokasi));
                dispatch(setPiutang(data));
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error
                
                dispatch(setLoading(false));
                Swal.fire({
                    title: 'Failed',
                    type: 'danger',
                    text: "Data Tidak Ditemukan",
                });
            })

    }
}

export const FetchNotaPiutang = (lokasi) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        // axios.get(HEADERS.URL + `piutang/getcode?lokasi=${lokasi}`)
        axios.get(HEADERS.URL + `piutang/getcode?lokasi=LK/0001`)
            .then(function (response) {
                const data = response.data;
                dispatch(setCode(data));
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error

                

            })

    }
}

export const storePiutang = (data) => {
    return (dispatch) => {
        dispatch(setLoadingPost(true));
        const url = HEADERS.URL + `piutang/bayar`;
        axios.post(url, data)
            .then(function (response) {
                // const data = (response.data);

                dispatch(setLoadingPost(false));
                Swal.fire({
                    title: 'Success',
                    type: 'success',
                    text:"Transaksi Berhasil",
                }).then((result)=>{
                    localStorage.removeItem("nota_pembelian_piutang");
                    localStorage.removeItem("jenis_trx_piutang");
                    window.location.reload();
                });
            })
            .catch(function (error) {
                dispatch(setLoadingPost(false));
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


//FILTER PIUTANG REPORT//
// perpage=10,page=1,searchby=kd_brg,dateFrom=2020-01-01,dateTo=2020-07-01,lokasi=LK%2F0001
export const FetchPiutangReport = (page=1,where='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = `piutang/report?page=${page}`;
        if(where!==''){
            url+=`${where}`
        }
        
        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setPiutangReport(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}

//FILTER PIUTANG REPORT EXCEL//
export const FetchPiutangReportExcel = (page=1,where='',perpage=99999)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = `piutang/report?page=${page}&perpage=${perpage}`;
        if(where!==''){
            url+=`${where}`
        }
        
        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setPiutangReportExcel(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}

//DELETE PIUTANG REPORT EXCEL//
export const DeletePiutangReport = (id)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `piutang/${id}`;

        axios.delete(url)
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
                        type: 'danger',
                        text: data.msg,
                    });
                }
                dispatch(setLoading(false));
                dispatch(FetchPiutangReport(localStorage.getItem("page_piutang_report")?localStorage.getItem("page_piutang_report"):1,localStorage.getItem('where_piutang_report')));
            })
            .catch(function (error) {
                dispatch(setLoading(false));
                
                Swal.fire({
                    title: 'failed',
                    type: 'danger',
                    text: error.response.data.msg,
                });
                if (error.response) {
                    
                }
            })
    }
}
