import {
    HUTANG,
    HEADERS
} from "../_constants"
import axios from "axios"
import Swal from 'sweetalert2'



export function setLoading(load) {
    return {
        type: HUTANG.LOADING,
        load
    }
}
export function setLoadingPost(load) {
    return {
        type: HUTANG.LOADING,
        load
    }
}
export function setHutang(data = []) {
    return {
        type: HUTANG.SUCCESS,
        data
    }
}

export function setCode(data = []) {
    return {
        type: HUTANG.SUCCESS_CODE,
        data
    }
}
export function setFailed(data = []) {
    return {
        type: HUTANG.FAILED,
        data
    }
}


export function setHutangReport(data=[]){
    return {type:HUTANG.SUCCESS_REPORT,data}
}

export function setHutangReportExcel(data=[]){
    return {type:HUTANG.SUCCESS_EXCEL,data}
}

export const FetchHutang = (nota) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `hutang/get?nota=${nota}`)
            .then(function (response) {
                const data = response.data;
                
                dispatch(FetchNotaHutang(data.result.lokasi));
                dispatch(setHutang(data));
                dispatch(setLoading(false));
            })
            .catch(function (error) {
                // handle error
                
                dispatch(setLoading(false));
                Swal.fire({
                    title: 'Failed',
                    type: 'error',
                    text: "Data Tidak Ditemukan",
                });
            })

    }
}

export const FetchNotaHutang = (lokasi) => {
    return (dispatch) => {
        dispatch(setLoading(true));
        axios.get(HEADERS.URL + `hutang/getcode?lokasi=${lokasi}`)
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

export const storeHutang = (data,param) => {
    return (dispatch) => {
        dispatch(setLoadingPost(true));
        const rawdata=data;
        const url = HEADERS.URL + `hutang/bayar`;
        axios.post(url, data)
            .then(function (response) {
                // const data = (response.data);

                dispatch(setLoadingPost(false));
                Swal.fire({
                    title: 'Transaksi berhasil.',
                    type: 'info',
                    html: `Data telah disimpan!` +
                        "<br><br>" +
                        // '<button type="button" role="button" tabindex="0" id="btnNotaPdf" class="btn btn-primary">Nota PDF</button>    ' +
                        '<button type="button" role="button" tabindex="0" id="btnNota3ply" class="btn btn-info">Nota 3ply</button>',
                    showCancelButton: true,
                    showConfirmButton: false
                }).then((result)=>{
                    localStorage.removeItem("nota_pembelian_hutang");
                    localStorage.removeItem("jenis_trx_hutang");
                    window.location.reload();
                });
                // document.getElementById("btnNotaPdf").addEventListener("click", () => {
                //     const win = window.open(data.result.nota, '_blank');
                //     if (win != null) {
                //         win.focus();
                //     }
                // });
                document.getElementById("btnNota3ply").addEventListener("click", () => {
                    param({
                        pathname: '/bayar_hutang3ply',
                        state: {
                            data: rawdata,
                            nota: data.nota_beli
                        }
                    })
                    Swal.closeModal();
                    return false;
                });
            })
            .catch(function (error) {
                dispatch(setLoadingPost(false));
                Swal.fire({
                    title: 'Failed',
                    type: 'error',
                    text: error.response.data.msg,
                });

                if (error.response) {
                    
                }
            })
    }
}


//FILTER HUTANG REPORT//
// perpage=10,page=1,searchby=kd_brg,dateFrom=2020-01-01,dateTo=2020-07-01,lokasi=LK%2F0001
export const FetchHutangReport = (page=1,where='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = `hutang/report?page=${page}`;
        if(where!==''){
            url+=`${where}`
        }
        
        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setHutangReport(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}

//FILTER HUTANG REPORT EXCEL//
export const FetchHutangReportExcel = (page=1,where='',perpage=99999)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = `hutang/report?page=${page}&perpage=${perpage}`;
        if(where!==''){
            url+=`${where}`
        }
        
        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setHutangReportExcel(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}

//DELETE HUTANG REPORT EXCEL//
export const DeleteHutangReport = (id)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        const url = HEADERS.URL + `hutang/${id}`;

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
                        type: 'error',
                        text: data.msg,
                    });
                }
                dispatch(setLoading(false));
                dispatch(FetchHutangReport(localStorage.getItem("page_hutang_report")?localStorage.getItem("page_hutang_report"):1,localStorage.getItem('where_hutang_report')));
            })
            .catch(function (error) {
                dispatch(setLoading(false));
                
                Swal.fire({
                    title: 'failed',
                    type: 'error',
                    text: error.response.data.msg,
                });
                if (error.response) {
                    
                }
            })
    }
}

