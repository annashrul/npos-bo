import {
    CLOSING
} from "../../../actions/_constants";

const initialState = {
    isLoading: false,
    isLoadingDetail:false,
    data: [],
    msg:"",
    status:"",
    code:"-",
    closing_data: [],
    report:[],
    report_data:[]
};

export const closingReducer = (state = initialState, action) => {
    switch (action.type) {
        case CLOSING.SUCCESS:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result,
                // total: action.data.result.total
            });
        case CLOSING.REPORT_SUCCESS:
            return Object.assign({}, state, {
                report: action.data.result,
                report_data: action.data.result.data
            });
        case CLOSING.CLOSING_DATA:
            return Object.assign({}, state, {
                closing_data: action.data.result
            });
        case CLOSING.SUCCESS_CODE:
            return Object.assign({}, state, {
                code: action.data.result
            });
        case CLOSING.FAILED:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result
            });
        case CLOSING.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        case CLOSING.LOADING_DETAIL:
            return Object.assign({}, state, {
                isLoadingDetail: action.load
            });
        default:
            return state
    }
};