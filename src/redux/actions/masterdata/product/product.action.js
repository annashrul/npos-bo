import {PRODUCT, HEADERS} from "../../_constants";
import axios from 'axios';
import Swal from "sweetalert2";
import {store,get, update,destroy,cekData,del} from "components/model/app.model";

export function setLoadingbrg(load){
    return {type : PRODUCT.LOADING_BRG,load}
}

export function setProductbrg(data=[]){
    return {type:PRODUCT.SUCCESS_BRG,data}
}

export function setLoading(load){
    return {type : PRODUCT.LOADING,load}
}

export function setProduct(data=[]){
    return {type:PRODUCT.SUCCESS,data}
}

export function setProductFailed(data=[]){
    return {type:PRODUCT.FAILED,data}
}

export const FetchProduct = (page=1,by='',q='')=>{
    return (dispatch) => {
        dispatch(setLoading(true));
        const headers={
            headers:{'Content-Type': 'application/x-www-form-urlencoded'}
        };
        let url = '';
        if(q===''&&by===''){
            url = `barang?page=${page}&isbo=true`;
        }else if(q===''||by===''||by===''){
            url = `barang?page=${page}&isbo=true`;
        }else if(by===''){
            url = `barang?page=${page}&isbo=true`;
        }else{
            url = `barang?page=${page}&q=${q}&searchby=${by}&isbo=true`;
        }

        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                console.log(data);
                dispatch(setProduct(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            console.log(error);
            dispatch(setLoading(false));
            Swal.fire({
                title: 'failed',
                type: 'danger',
                text: error.response.data.msg,
            });
        })
    }
}

export const FetchBrg = (page=1,by='barcode',q='',lokasi=null,supplier=null,table='purchase_order')=>{
    return (dispatch) => {
        dispatch(setLoadingbrg(true));
        let url = `barang/get?page=${page}`;
        if(q!=='') url+=`&q=${q}&searchby=${by}`;
        if(lokasi!==null) url+=`&lokasi=${lokasi}`
        if(supplier!==null) url+=`&supplier=${supplier}`

        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                const data = response.data;
                if(data.result.data.length===1){
                    const barang = data.result.data;
                    const cek = cekData('kd_brg', barang[0].kd_brg, table);
                    cek.then(res => {
                        if (res == undefined) {
                            console.log('GADA');
                            store(table, {
                                kd_brg: barang[0].kd_brg,
                                barcode: barang[0].barcode,
                                satuan: barang[0].satuan,
                                diskon: 0,
                                diskon2: 0,
                                diskon3: 0,
                                diskon4: 0,
                                ppn: 0,
                                harga_beli: barang[0].harga_beli,
                                qty: 1,
                                stock: barang[0].stock,
                                nm_brg: barang[0].nm_brg,
                                tambahan: barang[0].tambahan
                            })
                        } else {
                                update(table, {
                                    id: res.id,
                                    qty: parseFloat(res.qty) + 1,
                                    kd_brg: res.kd_brg,
                                    barcode: res.barcode,
                                    satuan: res.satuan,
                                    diskon: res.diskon,
                                    diskon2: res.diskon2,
                                    diskon3: 0,
                                    diskon4: 0,
                                    ppn: res.ppn,
                                    stock: res.stock,
                                    harga_beli: res.harga_beli,
                                    nm_brg: res.nm_brg,
                                    tambahan: res.tambahan
                                })
                        }
                        dispatch(setProductbrg(data));
                        dispatch(setLoadingbrg(false));

                    })
                }else{
                        dispatch(setProductbrg(data));
                        dispatch(setLoadingbrg(false));
                }
               
            }).catch(function(error){
            console.log(error);
            dispatch(setLoadingbrg(false));

            Swal.fire({
                title: 'failed',
                type: 'danger',
                text: error.response.data.msg,
            });
        })
    }
}