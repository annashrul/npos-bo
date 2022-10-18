import {SALE_OMSET_PERIODE} from "../../actions/_constants";

const initialState = {
    isLoading: false,
    isLoadingDetail: false,
    isLoadingReport: false,
    data: [],
    detail:[],
    msg:"",
    status:"",
    code:"-",
    report:[],
    report_excel:[],
    
};

export const saleOmsetPeriodeReducer = (state = initialState, action) => {
    switch (action.type) {
        case SALE_OMSET_PERIODE.DETAIL:
            return Object.assign({}, state, {
                 status: action.data.status,
                msg: action.data.msg,
                detail: action.data.result,
            });
        case SALE_OMSET_PERIODE.SUCCESS:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result,
                total: action.data.result.total
            });
        case SALE_OMSET_PERIODE.REPORT_SUCCESS_EXCEL:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                report_excel: action.data.result,
            });
        case SALE_OMSET_PERIODE.FAILED:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result
            });
        case SALE_OMSET_PERIODE.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        case SALE_OMSET_PERIODE.LOADING_DETAIL:
            return Object.assign({}, state, {
                isLoadingDetail: action.load
            });
        case SALE_OMSET_PERIODE.REPORT_LOADING:
            return Object.assign({}, state, {
                isLoadingReport: action.load
            });
        default:
            return state
    }
};