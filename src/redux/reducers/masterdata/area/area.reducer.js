import {AREA} from "../../../actions/_constants";


const initialState = {
    isLoading:true,
    status:"",
    msg:"",
    data:[],
    dataAll:[],
    dataArea:[]
};

export const areaReducer = (state=initialState,action) => {
    switch (action.type) {
        case AREA.SUCCESS:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result,
            });
        case AREA.ALL:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                dataAll:action.data.result,
                dataArea:action.data.result.data
            });
        case AREA.FAILED:
            return Object.assign({}, state, {
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case AREA.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        default:
            return state
    }
};