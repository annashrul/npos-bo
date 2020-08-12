import {
    PRODUCTION
} from "../../../actions/_constants";

const initialState = {
    isLoadingApproval: false,
    dataApproval: [],
    report: [],
    report_excel: [],
    report_data: [],
    dataApprovalDetail: [],
    msgApproval:"",
    statusApproval:"",
};

export const productionReducer = (state = initialState, action) => {
    switch (action.type) {
        case PRODUCTION.SUCCESS:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                report: action.data.result,
            });
        case PRODUCTION.SUCCESS_DATA:
            return Object.assign({}, state, {
                report_data: action.data.result
            });
        case PRODUCTION.SUCCESS_EXCEL:
            return Object.assign({}, state, {
                report_excel: action.data.result
            });
        case PRODUCTION.APPROVAL_PRODUCTION_DATA:
            return Object.assign({}, state, {
                statusApproval: action.data.status,
                msgApproval: action.data.msg,
                dataApproval: action.data.result,
            });
        case PRODUCTION.APPROVAL_TUTATION_DATA_DETAIL:
            return Object.assign({}, state, {
                dataApprovalDetail: action.data.result,
            });
        case PRODUCTION.APPROVAL_PRODUCTION_FAILED:
            return Object.assign({}, state, {
                statusApproval: action.data.status,
                msgApproval: action.data.msg,
                dataApproval: action.data.result
            });
        case PRODUCTION.APPROVAL_PRODUCTION_LOADING:
            return Object.assign({}, state, {
                isLoadingApproval: action.load
            });
        default:
            return state
    }
};