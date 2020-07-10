import {GROUP_PRODUCT} from "../../../actions/_constants";


const initialState = {
    isLoading:true,
    status:"",msg:"",data:[]
};

export const groupProductReducer = (state=initialState,action) => {
    switch (action.type) {
        case GROUP_PRODUCT.SUCCESS:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case GROUP_PRODUCT.FAILED:
            return Object.assign({}, state, {
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case GROUP_PRODUCT.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        default:
            return state
    }
};