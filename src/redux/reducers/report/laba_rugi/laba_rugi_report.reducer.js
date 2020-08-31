import {LABA_RUGI_REPORT} from "../../../actions/_constants";

const initialState = {
    isLoading:false,isLoadingDetailSatuan:false,
    status:"",
    msg:"",
    data:{penjualan:0,hpp:0,dis_penjualan:0,kas_masuk:0,kas_keluar:0,total_pendapatan:0,total_beban:0,laba:0},
    report_excel:{penjualan:0,hpp:0,dis_penjualan:0,kas_masuk:0,kas_keluar:0,total_pendapatan:0,total_beban:0,laba:0}
};

export const laba_rugiReducer = (state=initialState,action) => {
    switch (action.type) {
        case LABA_RUGI_REPORT.SUCCESS:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case LABA_RUGI_REPORT.SUCCESS_EXCEL:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                report_excel:action.data.result
            });
        case LABA_RUGI_REPORT.DETAIL_SATUAN:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                dataDetailSatuan:action.data.result
            });
        case LABA_RUGI_REPORT.DETAIL_TRANSAKSI:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                dataDetailTransaksi:action.data.result
            });
        case LABA_RUGI_REPORT.FAILED:
            return Object.assign({}, state, {
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case LABA_RUGI_REPORT.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        case LABA_RUGI_REPORT.LOADING_DETAIL_SATUAN:
            return Object.assign({}, state, {
                isLoadingDetailSatuan: action.load
            });
        default:
            return state
    }
};