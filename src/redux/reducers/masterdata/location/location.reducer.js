import {LOCATION} from "../../../actions/_constants";

const initialState = {
    isLoading:true,detail:[],allData:[],edit:[],
    status:"",msg:"",data:[], currentPage:0,
    per_page:0,
    total:0,
};

export const locationReducer = (state=initialState,action) => {
    switch (action.type) {
        case LOCATION.SUCCESS:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case LOCATION.DETAIL:
            return Object.assign({}, state,{
                detail:action.data.result
            });
        case LOCATION.EDIT:
            return Object.assign({}, state,{
                edit:action.data.result
            });
        case LOCATION.ALL:
            return Object.assign({}, state,{
                allData:action.data.result
            });
        case LOCATION.FAILED:
            return Object.assign({}, state, {
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case LOCATION.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        default:
            return state
    }
};