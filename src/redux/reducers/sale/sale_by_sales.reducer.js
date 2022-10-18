import {SALE_BY_SALES} from "../../actions/_constants";

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
    report_data:[],
    
};

export const saleBySalesReducer = (state = initialState, action) => {
    switch (action.type) {
        case SALE_BY_SALES.DETAIL:
            return Object.assign({}, state, {
                 status: action.data.status,
                msg: action.data.msg,
                detail: action.data.result,
            });
        case SALE_BY_SALES.SUCCESS:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result,
                total: action.data.result.total
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