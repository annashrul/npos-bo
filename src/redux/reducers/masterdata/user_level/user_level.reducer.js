import {USER_LEVEL} from "../../../actions/_constants";


const initialState = {
    isLoading:false,status:"",msg:"",data:[]
};

export const userLevelReducer = (state=initialState,action) => {
    switch (action.type) {
        case USER_LEVEL.SUCCESS:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case USER_LEVEL.FAILED:
            return Object.assign({}, state, {
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case USER_LEVEL.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        default:
            return state
    }
};