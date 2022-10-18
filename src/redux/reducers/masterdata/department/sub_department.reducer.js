import {SUB_DEPT} from "../../../actions/_constants";


const initialState = {
    isLoading:true,
    status:"",msg:"",data:[],all:[]
};

export const subDepartmentReducer = (state=initialState,action) => {
    switch (action.type) {
        case SUB_DEPT.SUCCESS:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case SUB_DEPT.ALL:
            return Object.assign({}, state,{
                all:action.data.result
            });
        case SUB_DEPT.FAILED:
            return Object.assign({}, state, {
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case SUB_DEPT.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        default:
            return state
    }
};