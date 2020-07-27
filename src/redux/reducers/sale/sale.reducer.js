import {SALE} from "../../actions/_constants";

const initialState = {
    isLoading: false,
    isLoadingDetail: false,
    isLoadingReport: false,
    data: [],
    msg:"",
    status:"",
    code:"-",
    sale_data:[],
    report:[],
    report_data:[],
    total_penjualan:{
        omset: 0,
        dis_item: 0,
        sub_total: 0,
        dis_persen: 0,
        dis_rp: 0,
        kas_lain: 0,
        gt: 0,
        bayar: 0,
        jml_kartu: 0,
        charge: 0,
        change: 0,
        voucher: 0,
        rounding: 0
    }
};

export const saleReducer = (state = initialState, action) => {
    switch (action.type) {
        case SALE.SUCCESS:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result,
                total: action.data.result.total
            });
        case SALE.REPORT_SUCCESS:
            return Object.assign({}, state, {
                report: action.data.result,
                report_data: action.data.result.data,
                total: action.data.result.total_penjualan,
            });
        case SALE.SALE_DATA:
            return Object.assign({}, state, {
                sale_data: action.data.result
            });
        case SALE.SUCCESS_CODE:
            return Object.assign({}, state, {
                code: action.data.result
            });
        case SALE.FAILED:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result
            });
        case SALE.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        case SALE.LOADING_DETAIL:
            return Object.assign({}, state, {
                isLoadingDetail: action.load
            });
        case SALE.REPORT_LOADING:
            return Object.assign({}, state, {
                isLoadingReport: action.load
            });
        default:
            return state
    }
};