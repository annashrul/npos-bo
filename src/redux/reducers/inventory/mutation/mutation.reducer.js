import {
    MUTATION
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

export const mutationReducer = (state = initialState, action) => {
    switch (action.type) {
        case MUTATION.SUCCESS:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                report: action.data.result,
            });
        case MUTATION.SUCCESS_DATA:
            return Object.assign({}, state, {
                report_data: action.data.result
            });
        case MUTATION.SUCCESS_EXCEL:
            return Object.assign({}, state, {
                report_excel: action.data.result
            });
        case MUTATION.APPROVAL_MUTATION_DATA:
            return Object.assign({}, state, {
                statusApproval: action.data.status,
                msgApproval: action.data.msg,
                dataApproval: action.data.result,
            });
        case MUTATION.APPROVAL_TUTATION_DATA_DETAIL:
            return Object.assign({}, state, {
                dataApprovalDetail: action.data.result,
            });
        case MUTATION.APPROVAL_MUTATION_FAILED:
            return Object.assign({}, state, {
                statusApproval: action.data.status,
                msgApproval: action.data.msg,
                dataApproval: action.data.result
            });
        case MUTATION.APPROVAL_MUTATION_LOADING:
            return Object.assign({}, state, {
                isLoadingApproval: action.load
            });
        default:
            return state
    }
};