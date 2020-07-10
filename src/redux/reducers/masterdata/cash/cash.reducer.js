import {CASH} from "../../../actions/_constants";


const initialState = {
    isLoading:true,
    status:"",msg:"",data:[], currentPage:0,
    per_page:0,
    total:0,
};

export const cashReducer = (state=initialState,action) => {
    switch (action.type) {
        case CASH.SUCCESS:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case CASH.FAILED:
            return Object.assign({}, state, {
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case CASH.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        default:
            return state
    }
};