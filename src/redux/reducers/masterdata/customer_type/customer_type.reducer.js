import {CUSTOMER_TYPE} from "../../../actions/_constants";


const initialState = {
    isLoading:true,
    status:"",msg:"",data:[],all:[]
};

export const customerTypeReducer = (state=initialState,action) => {
    switch (action.type) {
        case CUSTOMER_TYPE.SUCCESS:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case CUSTOMER_TYPE.ALL:
            return Object.assign({}, state,{
                all:action.data.result
            });
        case CUSTOMER_TYPE.FAILED:
            return Object.assign({}, state, {
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case CUSTOMER_TYPE.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        default:
            return state
    }
};