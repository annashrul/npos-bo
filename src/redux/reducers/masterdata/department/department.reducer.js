import {DEPT} from "../../../actions/_constants";


const initialState = {
    isLoading:true,
    status:"",msg:"",data:[]
};

export const departmentReducer = (state=initialState,action) => {
    switch (action.type) {
        case DEPT.SUCCESS:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case DEPT.FAILED:
            return Object.assign({}, state, {
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case DEPT.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        default:
            return state
    }
};