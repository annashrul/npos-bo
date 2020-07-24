import {OPNAME} from "../../../actions/_constants";

const initialState = {
    isLoading:true,
    status:"",msg:"",total_opname:{total_fisik:0,total_akhir:0,total_hpp:0,},
    data:[]
};

export const opnameReducer = (state=initialState,action) => {
    switch (action.type) {
        case OPNAME.DATA_POSTING:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result,
                total_opname:action.data.result.total_opname
            });
        case OPNAME.FAILED:
            return Object.assign({}, state, {
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case OPNAME.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        default:
            return state
    }
};