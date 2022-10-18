import {LOCATION_CATEGORY} from "../../../actions/_constants";

const initialState = {
    isLoading:true,status:"",msg:"",data:[]
};

export const locationCategoryReducer = (state=initialState,action) => {
    switch (action.type) {
        case LOCATION_CATEGORY.SUCCESS:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case LOCATION_CATEGORY.FAILED:
            return Object.assign({}, state, {
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case LOCATION_CATEGORY.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        default:
            return state
    }
};