import {MEJA} from "../../../actions/_constants";


const initialState = {
    isLoading:true,
    status:"",
    msg:"",
    data:[],
    dataAll:[],
    dataMeja:[]
};

export const mejaReducer = (state=initialState,action) => {
    switch (action.type) {
        case MEJA.SUCCESS:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result,
            });
        case MEJA.ALL:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                dataAll:action.data.result,
                dataMeja:action.data.result.data
            });
        case MEJA.FAILED:
            return Object.assign({}, state, {
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case MEJA.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        default:
            return state
    }
};