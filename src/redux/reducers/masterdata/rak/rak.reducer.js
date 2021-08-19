import {RAK} from "../../../actions/_constants";

const initialState = {
    isLoading:true,
    status:"",msg:"",data:[], currentPage:0,
    per_page:0,
    total:0,
};

export const rakReducer = (state=initialState,action) => {
    switch (action.type) {
        case RAK.SUCCESS:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case RAK.FAILED:
            return Object.assign({}, state, {
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case RAK.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        default:
            return state
    }
};