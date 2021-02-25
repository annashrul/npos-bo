import {SALE_BY_SALES} from "../../actions/_constants";

const initialState = {
    isLoading: false,
    isLoadingDetail: false,
    isLoadingReport: false,
    data: [],
    dataDetail:[],
    msg:"",
    status:"",
    code:"-",
    report:[],
    report_data:[],
    
};

export const saleBySalesReducer = (state = initialState, action) => {
    switch (action.type) {
        case SALE_BY_SALES.REPORT_DETAIL_SUCCESS:
            return Object.assign({}, state, {
                dataDetail: action.data.result,
            });
        case SALE_BY_SALES.SUCCESS:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result,
                total: action.data.result.total
            });
        case SALE_BY_SALES.REPORT_SUCCESS_EXCEL:
            return Object.assign({}, state, {
                report_excel: action.data.result,
                total_penjualan_excel: action.data.result.total_penjualan,
            });
        case SALE_BY_SALES.REPORT_SUCCESS:
            return Object.assign({}, state, {
                report: action.data.result,
                report_data: action.data.result.data,
                total_penjualan: action.data.result.total_penjualan,
            });
        case SALE_BY_SALES.SALE_BY_SALES_DATA:
            return Object.assign({}, state, {
                SALE_BY_SALES_data: action.data.result
            });
        case SALE_BY_SALES.SUCCESS_CODE:
            return Object.assign({}, state, {
                code: action.data.result
            });
        case SALE_BY_SALES.FAILED:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result
            });
        case SALE_BY_SALES.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        case SALE_BY_SALES.LOADING_DETAIL:
            return Object.assign({}, state, {
                isLoadingDetail: action.load
            });
        case SALE_BY_SALES.REPORT_LOADING:
            return Object.assign({}, state, {
                isLoadingReport: action.load
            });
        default:
            return state
    }
};