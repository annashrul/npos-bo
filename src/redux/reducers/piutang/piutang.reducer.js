import {PIUTANG} from "../../actions/_constants";

const initialState = {
    isLoading:false,
    isLoadingPost:false,
    status:"",
    msg:"",
    data:[],
    get_code:'-'
};

export const piutangReducer = (state=initialState,action) => {
    switch (action.type) {
        case PIUTANG.SUCCESS_CODE:
            return Object.assign({}, state,{
                get_code: action.data.result
            });
        case PIUTANG.SUCCESS:
            console.log("REDUCER",action.data.result);
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result,
            });

        case PIUTANG.FAILED:
            return Object.assign({}, state, {
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case PIUTANG.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        case PIUTANG.LOADING_POST:
            return Object.assign({}, state, {
                isLoadingPost: action.load
            });
        default:
            return state
    }
};