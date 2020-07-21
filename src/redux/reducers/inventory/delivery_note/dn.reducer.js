import {
    DN
} from "../../../actions/_constants";

const initialState = {
    isLoading: false,
    data: [],
    msg:"",
    status:"",
    code:"-",
    dn_data:[],
    report:[],
    report_data:[]
};

export const dnReducer = (state = initialState, action) => {
    switch (action.type) {
        case DN.SUCCESS:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result,
                total: action.data.result.total
            });
        case DN.REPORT_SUCCESS:
            return Object.assign({}, state, {
                report: action.data.result,
                report_data: action.data.result.data
            });
        case DN.DN_DATA:
            return Object.assign({}, state, {
                dn_data: action.data.result
            });
        case DN.SUCCESS_CODE:
            return Object.assign({}, state, {
                code: action.data.result
            });
        case DN.FAILED:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result
            });
        case DN.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        default:
            return state
    }
};