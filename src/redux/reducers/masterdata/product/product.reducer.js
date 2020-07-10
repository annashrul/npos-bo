import {PRODUCT} from "../../../actions/_constants";


const initialState = {
    isLoading:true,
    status:"",msg:"",data:[]
};

export const productReducer = (state=initialState,action) => {
    switch (action.type) {
        case PRODUCT.SUCCESS:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case PRODUCT.FAILED:
            return Object.assign({}, state, {
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case PRODUCT.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        default:
            return state
    }
};