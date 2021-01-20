import {
    MUTATION,
    HEADERS
} from "../_constants"
import axios from "axios"
import Swal from 'sweetalert2'
import {setLoading} from "../masterdata/customer/customer.action";

export function setLoadingApprovalMutation(load) {
    return {
        type: MUTATION.APPROVAL_MUTATION_LOADING,
        load
    }
}
export function setApprovalMutation(data = []) {
    return {
        type: MUTATION.APPROVAL_MUTATION_DATA,
        data
    }
}
export function setApprovalMutationDetail(data = []) {
    return {
        type: MUTATION.APPROVAL_TUTATION_DATA_DETAIL,
        data
    }
}

export function setApprovalMutationFailed(data = []) {
    return {
        type: MUTATION.APPROVAL_MUTATION_FAILED,
        data
    }
}

export function setMutation(data=[]){
    return {type:MUTATION.SUCCESS,data}
}

export function setMutationExcel(data=[]){
    return {type:MUTATION.SUCCESS_EXCEL,data}
}

export function setMutationData(data=[]){
    return {type:MUTATION.SUCCESS_DATA,data}
}

export const rePrintFaktur = (id) => {
    return (dispatch) => {
        Swal.fire({
            title: 'Silahkan tunggu.',
            html: 'Sedang memproses faktur..',
            onBeforeOpen: () => {
                Swal.showLoading()
            },
            onClose: () => {}
        })
        let url = `alokasi/reprint/${id}`;
        
        axios.get(HEADERS.URL + url)
            .then(function (response) {
                Swal.close() 

                const data = response.data;
                if(data.status==='success'){
                    window.open(data.result.nota, '_blank');
                }else{
                    Swal.fire({
                        title: 'failed',
                        type: 'error',
                        text: 'Gagal mengambil faktur.',
                    });

                }
                dispatch(setLoadingApprovalMutation(false));
            }).catch(function (error) {
                Swal.close() 


            })
    }
}

export const FetchApprovalMutation = (page = 1,q='',lokasi='',param='') => {
    return (dispatch) => {
        dispatch(setLoadingApprovalMutation(true));
        let url=`mutasi?page=${page}`;
        if(q!==''){
            if(url!==''){url+='&';}
            url+=`q=${q}`;
        }
        if(lokasi!==''){
            if(url!==''){url+='&';}
            url+=`lokasi=${lokasi}`;
        }
        if(param!==''){
            if(url!==''){url+='&';}
            url+=`type=${param}`;
        }
        axios.get(HEADERS.URL + url)
            .then(function (response) {
                const data = response.data;
                dispatch(setApprovalMutation(data));
                dispatch(setLoadingApprovalMutation(false));
            })
            .catch(function (error) {
                // handle error
                
            })

    }
}

export const FetchApprovalMutationDetail = (page = 1,kd_trx) => {
    return (dispatch) => {
        dispatch(setLoadingApprovalMutation(true));
        let url=`mutasi/${kd_trx}/?page=${page}`;
        axios.get(HEADERS.URL + url)
            .then(function (response) {
                const data = response.data;
                dispatch(setApprovalMutationDetail(data));
                dispatch(setLoadingApprovalMutation(false));
            })
            .catch(function (error) {
                // handle error
                
            })

    }
}

export const saveApprovalMutation = (data,param) => {
    return (dispatch) => {
        // dispatch(setLoading(true))
        const url = HEADERS.URL + `mutasi/approve`;
        axios.post(url, data)
            .then(function (response) {
//                const data = (response.data)
//                if (data.status === 'success') {
//                    Toast.fire({
//                        icon: 'success',
//                        title: data.msg
//                    })
//                } else {
//                    Swal.fire({
//                        title: 'failed',
//                        type: 'error',
//                        text: data.msg,
//                    });
//                }
                // const data = data['kd_trx']
                Swal.fire({
                    title: 'Transaksi berhasil.',
                    type: 'info',
                    html: `Disimpan dengan nota: ${data['kd_trx']}` +
                        "<br><br>" +
                        '<button type="button" role="button" tabindex="0" id="btnNotaPdf" class="btn btn-primary">Nota PDF</button>    ' +
                        '<button type="button" role="button" tabindex="0" id="btnNota3ply" class="btn btn-info">Nota 3ply</button>',
                    showCancelButton: true,
                    showConfirmButton: false
                }).then((result) => {
                    if(result.dismiss === 'cancel'){
                        window.location.reload(false);
                        // window.open(`/approval_mutasi`, '_top');
                    }
                })
                document.getElementById("btnNotaPdf").addEventListener("click", () => {
                    // const win = window.open(data['kd_trx'], '_blank');
                    // if (win != null) {
                    //     win.focus();
                    // }
                    
                    dispatch(rePrintFaktur(data['kd_trx']));
                });
                document.getElementById("btnNota3ply").addEventListener("click", () => {
                    // param({
                    //     pathname: `/alokasi3ply/${data['kd_trx']}`
                    // })
                    // Swal.closeModal();
                    // return false;
                        const win = window.open(`/alokasi3ply/${data['kd_trx']}`, '_blank');
                        if (win != null) {
                            win.focus();
                        }
                });
                dispatch(setLoading(false));
                // dispatch(setLoading(false));
            })
            .catch(function (error) {
                // dispatch(setLoading(false));
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

export const FetchMutation = (page=1,where='')=>{
    return (dispatch) => {
        dispatch(setLoadingApprovalMutation(true));
        let url=`mutasi/report?page=${page==='NaN'||page===null||page===''||page===undefined?1:page}`;
        if(where!==''){
            url+=where
        }
        
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                
                dispatch(setMutation(data));
                dispatch(setLoadingApprovalMutation(false));
            }).catch(function(error){
            
        })
    }
}

export const FetchMutationExcel = (page=1,where='',perpage=99999)=>{
    return (dispatch) => {
        dispatch(setLoadingApprovalMutation(true));
        let url=`mutasi/report?page=${page==='NaN'||page===null||page===''||page===undefined?1:page}&perpage=${perpage}`;
        if(where!==''){
            url+=where
        }
        
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                
                dispatch(setMutationExcel(data));
                dispatch(setLoadingApprovalMutation(false));
            }).catch(function(error){
            
        })
    }
}
export const FetchMutationData = (page=1,code,dateFrom='',dateTo='',location='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let que = '';
        if(dateFrom===''&&dateTo===''&&location===''){
            que = `alokasi/report/${code}?page=${page}`;
        }
        if(dateFrom!==''&&dateTo!==''&&location===''){
            que = `alokasi/report/${code}?page=${page}&datefrom=${dateFrom}&dateto=${dateFrom}`;
        }
        if(dateFrom!==''&&dateTo!==''&&location!==''){
            que = `alokasi/report/${code}?page=${page}&datefrom=${dateFrom}&dateto=${dateFrom}&lokasi=${location}`;
        }
        if(location!==''){
            que = `alokasi/report/${code}?page=${page}&lokasi=${location}`;
        }
        
        axios.get(HEADERS.URL+`${que}`)
            .then(function(response){
                const data = response.data;
                
                dispatch(setMutationData(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}

//const Toast = Swal.mixin({
//    toast: true,
//    position: 'top-end',
//    showConfirmButton: false,
//    timer: 1000,
//    timerProgressBar: true,
//    onOpen: (toast) => {
//        toast.addEventListener('mouseenter', Swal.stopTimer)
//        toast.addEventListener('mouseleave', Swal.resumeTimer)
//    }
//})
