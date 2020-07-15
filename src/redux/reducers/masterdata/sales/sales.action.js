import {SALES} from "../../../actions/_constants";


const initialState = {
    isLoading:true,
    status:"",msg:"",data:[],dataAll:[]
};

export const salesReducer = (state=initialState,action) => {
    switch (action.type) {
        case SALES.SUCCESS:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case SALES.ALL:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                dataAll:action.data.result
            });
        case SALES.FAILED:
            return Object.assign({}, state, {
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case SALES.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        default:
            return state
    }
};