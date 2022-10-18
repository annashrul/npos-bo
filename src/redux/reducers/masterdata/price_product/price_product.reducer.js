import {PRICE_PRODUCT} from "../../../actions/_constants";


const initialState = {
    isLoading:true,
    status:"",msg:"",data:[]
};

export const priceProductReducer = (state=initialState,action) => {
    switch (action.type) {
        case PRICE_PRODUCT.SUCCESS:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case PRICE_PRODUCT.FAILED:
            return Object.assign({}, state, {
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case PRICE_PRODUCT.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        default:
            return state
    }
};