import {
    PO
} from "../../../actions/_constants";

const initialState = {
    isLoading: true,
    isLoadingDetail: false,
    data: [],
    msg:"",
    status:"",
    code:"-",
    po_data:[],
    report:[],
    report_data:[],
    dataReportDetail:[]
};

export const poReducer = (state = initialState, action) => {
    switch (action.type) {
        case PO.SUCCESS:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result,
                total: action.data.result.total
            });
        case PO.REPORT_SUCCESS:
            return Object.assign({}, state, {
                report: action.data.result,
                report_data: action.data.result.data
            });
        case PO.PO_DATA:
            return Object.assign({}, state, {
                po_data: action.data.result
            });
        case PO.PO_REPORT_DETAIL:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                dataReportDetail:action.data.result
            });
        case PO.SUCCESS_CODE:
            return Object.assign({}, state, {
                code: action.data.result
            });
        case PO.FAILED:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result
            });
        case PO.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        case PO.LOADING_DETAIL:
            return Object.assign({}, state, {
                isLoadingDetail: action.load
            });
        default:
            return state
    }
};