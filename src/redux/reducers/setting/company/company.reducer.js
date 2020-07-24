import {COMPANY} from "../../../actions/_constants";

const initialState = {
    isLoadingGet: false,
    dataGet: [],
    msgGet:"",
    statusGet:"",
};

export const companyReducer = (state = initialState, action) => {
    switch (action.type) {
        case COMPANY.SUCCESS_GET:
            console.log("REDUCER",action.data.result);
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

        default:
            return state
    }
};