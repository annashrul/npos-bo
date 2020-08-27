import {PRODUKSI, HEADERS} from "../_constants";
import axios from 'axios';
import Swal from "sweetalert2";
import {destroy} from "components/model/app.model";
import {setLoadingbrg, setProductbrg} from "../masterdata/product/product.action";
import {toRp} from "../../../helper";

export function setLoading(load){
    return {type : PRODUKSI.LOADING,load}
}

export function setProduksiPaket(data=[]){
    return {type:PRODUKSI.SUCCESS_PAKET,data}
}
export function setProduksiBahan(data=[]){
    return {type:PRODUKSI.SUCCESS_BAHAN,data}
}

export function setProduksiFailed(data=[]){
    return {type:PRODUKSI.FAILED,data}
}

export function setCodeProduksi(data=[]){
    return {type:PRODUKSI.GET_CODE,data}
}

export function setProduction(data=[]){
    return {type:PRODUKSI.SUCCESS,data}
}

export function setProductionExcel(data=[]){
    return {type:PRODUKSI.SUCCESS_EXCEL,data}
}

export function setProductionData(data=[]){
    return {type:PRODUKSI.SUCCESS_DATA,data}
}


export const FetchCodeProduksi = (lokasi)=>{
    return (dispatch) => {
        axios.get(HEADERS.URL+`production/getcode?lokasi=${lokasi}`)
            .then(function(response){
                const data = response.data;
                console.log("IEU KODE PRODUKSI",data);
                dispatch(setCodeProduksi(data));
            }).catch(function(error){
            console.log(error)
        })
    }
}

export const FetchBrgProduksiBahan = (page=1,by='barcode',q='',lokasi=null,db)=>{
    console.log("DATA DB",db);
    return (dispatch) => {
        dispatch(setLoadingbrg(true));
        let url = `barang/get?page=${page}&kategori=4`;
        if(q!=='') url+=`&q=${q}&searchby=${by}`;
        if(lokasi!==null) url+=`&lokasi=${lokasi}`;
        console.log("FETCH BARANG URL",url);
        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                console.log("RESPONSE BARANG BAHAN",data);
                if(data.result.data.length===1){
                    const barang = data.result.data;
                    const cek=db(barang[0].kd_brg,barang);
                    cek.then(re=>{
                        dispatch(setProduksiBahan(data));
                        dispatch(setLoading(false));
                    })
                }else{
                    dispatch(setProduksiBahan(data));
                    dispatch(setLoading(false));
                }

            }).catch(function(error){
            console.log(error);
            dispatch(setLoadingbrg(false));

            Swal.fire({
                title: 'failed',
                type: 'danger',
                // text: error.response.data.msg,
            });
        })
    }
}
export const FetchBrgProduksiPaket = (page=1,by='barcode',q='',lokasi=null)=>{
    return (dispatch) => {
        dispatch(setLoadingbrg(true));
        let url = `barang/get?page=${page}&kategori=2`;
        if(q!=='') url+=`&q=${q}&searchby=${by}`;
        if(lokasi!==null) url+=`&lokasi=${lokasi}`;
        console.log("FETCH BARANG URL",url);
        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;

                dispatch(setProduksiPaket(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error);
            dispatch(setLoadingbrg(false));

            Swal.fire({
                title: 'failed',
                type: 'danger',
                // text: error.response.data.msg,
            });
        })
    }
}

export const storeProduksi = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `production`;
        axios.post(url, data)
            .then(function (response) {
                const data = (response.data)
                console.log(data);
                Swal.fire({
                    title: 'Transaksi berhasil.',
                    html:`<table class="table table-bordered table-hover"><tbody><tr><th>Total Hpp</th><th>${toRp(data.result.total_hpp)}</th></tr><tr><th>Qty Estimasi</th><th>${data.result.qty_estimasi}</th></tr><tr><th>Hpp Rata-Rata (Peritem)</th><th>${data.result.hpp_peritem}</th></tr></tbody></table>`,
                    icon: 'success',
                    showCancelButton: true,
                    cancelButtonColor: '#2196F3',
                    cancelButtonText: 'Oke!'
                }).then((result) => {
                    destroy('production');
                    localStorage.removeItem('location_produksi');
                    localStorage.removeItem('barang_paket_produksi');
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

export const storeApproval = (data) => {
    return (dispatch) => {
        dispatch(setLoading(true))
        const url = HEADERS.URL + `production/approve`;
        axios.post(url, data)
            .then(function (response) {
                const data = (response.data)
                Swal.fire({
                    title: 'Berhasil Diapprove!',
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#ff9800',
                    confirmButtonText: 'Ok',
                }).then((result) => {
                    destroy('production');
                    localStorage.removeItem('code_for_approval');
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

export const FetchProduction = (page=1,where='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url=`production/report?page=${page==='NaN'||page===null||page===''||page===undefined?1:page}`;
        if(where!==''){
            url+=where
        }
        console.log(url)
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                console.log("FetchTrx",data);
                dispatch(setProduction(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}

export const FetchProductionExcel = (page=1,where='',perpage=99999)=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let url=`production/report?page=${page==='NaN'||page===null||page===''||page===undefined?1:page}&perpage=${perpage}`;
        if(where!==''){
            url+=where
        }
        console.log(url)
        axios.get(HEADERS.URL+url)
            .then(function(response){
                const data = response.data;
                console.log("FetchTrx",data);
                dispatch(setProductionExcel(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}
export const FetchProductionData = (page=1,code,dateFrom='',dateTo='',location='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        let que = '';
        if(dateFrom===''&&dateTo===''&&location===''){
            que = `production/report/${code}?page=${page}`;
        }
        if(dateFrom!==''&&dateTo!==''&&location===''){
            que = `production/report/${code}?page=${page}&datefrom=${dateFrom}&dateto=${dateFrom}`;
        }
        if(dateFrom!==''&&dateTo!==''&&location!==''){
            que = `production/report/${code}?page=${page}&datefrom=${dateFrom}&dateto=${dateFrom}&lokasi=${location}`;
        }
        if(location!==''){
            que = `production/report/${code}?page=${page}&lokasi=${location}`;
        }
        console.log("url production",`${que}`);
        axios.get(HEADERS.URL+`${que}`)
            .then(function(response){
                const data = response.data;
                console.log(data);
                dispatch(setProductionData(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error)
        })
    }
}