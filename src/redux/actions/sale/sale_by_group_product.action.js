import { SALE_BY_GROUP_PRODUCT } from "../_constants";
import { handleDelete, handleGet, handleGetExport } from "../handleHttp";
import { ModalToggle, ModalType } from "../modal.action";

export function setSuccess(data = []) {
    return {
        type: SALE_BY_GROUP_PRODUCT.SUCCESS,
        data,
    };
}

export function setExport(data = []) {
    return {
        type: SALE_BY_GROUP_PRODUCT.EXPORT,
        data,
    };
}
export function setDetail(data = []) {
    return {
        type: SALE_BY_GROUP_PRODUCT.DETAIL,
        data,
    };
}

export function setDownload(load) {
    return {
        type: SALE_BY_GROUP_PRODUCT.DOWNLOAD,
        load,
    };
}

export const FetchSaleByGroupProduct = (where="") => {
    return (dispatch) => {
        let url = `report/penjualan/kelompok`;
        if(where!=="")url+=`?${where}`;
        handleGet(url, (res) => {
            let data = res.data;
            dispatch(setSuccess(data));
        });
    };
};

export const FetchReportDetailSaleByProduct = (kelBrg='',where="",isModal=true) => {
    return (dispatch) => {
        let url = `report/penjualan/kelompok/get/${btoa(kelBrg)}`;
        if(where!=="")url+=`?${where}`;
        handleGet(url, (res) => {
            if(isModal){
                dispatch(ModalType("detailSaleByGroupProductReport"));
                dispatch(ModalToggle(true));
            }

            let data = res.data;
            dispatch(setDetail(data));
        });
    };
};

export const FetchSaleByGroupProductExport = (where = "", perpage = 10000) => {
    return (dispatch) => {
        let url = `report/penjualan/kelompok?perpage=${perpage}`;
        if (where !== "") {
            url += `&${where}`;
        }
        handleGetExport(
            url,
            (res) => {
                dispatch(setExport(res.data));
                dispatch(ModalType("modalSaleByGroupProductExport"));
                dispatch(ModalToggle(true));
            },
            (res) => {
                dispatch(setDownload(res));
            }
        );
    };
};
