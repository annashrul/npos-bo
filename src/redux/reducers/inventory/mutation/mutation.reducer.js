import {
    MUTATION
} from "../../../actions/_constants";

const initialState = {
    isLoadingApproval: false,
    dataApproval: [],
    dataApprovalDetail: [],
    msgApproval:"",
    statusApproval:"",
};

export const mutationReducer = (state = initialState, action) => {
    switch (action.type) {
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