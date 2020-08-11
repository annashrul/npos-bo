import {
    TRANSACTION
} from "../../../actions/_constants";

const initialState = {
    isLoadingApproval: false,
    dataApproval: [],
    report: [],
    report_data: [],
    dataApprovalDetail: [],
    msgApproval:"",
    statusApproval:"",
};

export const transactionReducer = (state = initialState, action) => {
    switch (action.type) {
        case TRANSACTION.SUCCESS:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                report: action.data.result,
            });
        case TRANSACTION.SUCCESS_DATA:
            return Object.assign({}, state, {
                report_data: action.data.result
            });
        case TRANSACTION.APPROVAL_TRANSACTION_DATA:
            return Object.assign({}, state, {
                statusApproval: action.data.status,
                msgApproval: action.data.msg,
                dataApproval: action.data.result,
            });
        case TRANSACTION.APPROVAL_TUTATION_DATA_DETAIL:
            return Object.assign({}, state, {
                dataApprovalDetail: action.data.result,
            });
        case TRANSACTION.APPROVAL_TRANSACTION_FAILED:
            return Object.assign({}, state, {
                statusApproval: action.data.status,
                msgApproval: action.data.msg,
                dataApproval: action.data.result
            });
        case TRANSACTION.APPROVAL_TRANSACTION_LOADING:
            return Object.assign({}, state, {
                isLoadingApproval: action.load
            });
        default:
            return state
    }
};