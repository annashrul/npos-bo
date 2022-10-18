import {SUPPLIER} from "../../../actions/_constants";


const initialState = {
    isLoading:true,
    status:"",
    msg:"",
    data:[],
    dataAll:[],
    dataSupllier:[]
};

export const supplierReducer = (state=initialState,action) => {
    switch (action.type) {
        case SUPPLIER.SUCCESS:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result,
            });
        case SUPPLIER.ALL:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                dataAll:action.data.result,
                dataSupllier:action.data.result.data
            });
        case SUPPLIER.FAILED:
            return Object.assign({}, state, {
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case SUPPLIER.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        default:
            return state
    }
};