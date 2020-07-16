import {
    PO
} from "../../../actions/_constants";

const initialState = {
    isLoading: false,
    data: [],
    msg:"",
    status:"",
    code:"-"
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
        default:
            return state
    }
};