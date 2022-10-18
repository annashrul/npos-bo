import {COMPANY} from "../../../actions/_constants";

const initialState = {
    isLoadingGet: false,
    isLoadingPost: false,
    dataGet: [],
    msgGet:"",
    statusGet:"",
};

export const companyReducer = (state = initialState, action) => {
    switch (action.type) {
        case COMPANY.SUCCESS_GET:
            
            return Object.assign({}, state, {
                statusGet: action.data.status,
                msgGet: action.data.msg,
                dataGet: action.data.result,
            });
        case COMPANY.FAILED_GET:
            return Object.assign({}, state, {
                statusGet: action.data.status,
                msgGet: action.data.msg,
                dataGet: action.data.result,
            });
        case COMPANY.LOADING_GET:
            return Object.assign({}, state, {
                isLoadingGet: action.load
            });
        case COMPANY.LOADING_POST:
            return Object.assign({}, state, {
                isLoadingPost: action.load
            });
        default:
            return state
    }
};