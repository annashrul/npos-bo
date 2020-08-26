import {HUTANG} from "../../actions/_constants";

const initialState = {
    isLoading:false,
    isLoadingPost:false,
    status:"",
    msg:"",
    data:[],
    data_report:[],
    report_excel:[],
    get_code:'-'
};

export const hutangReducer = (state=initialState,action) => {
    switch (action.type) {
        case HUTANG.SUCCESS_REPORT:
            console.log(action.data.result);
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                data_report:action.data.result
            });
        case HUTANG.SUCCESS_EXCEL:
            console.log(action.data.result);
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                report_excel:action.data.result
            });
        case HUTANG.SUCCESS_CODE:
            return Object.assign({}, state,{
                get_code: action.data.result
            });
        case HUTANG.SUCCESS:
            console.log("REDUCER",action.data.result);
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result,
            });

        case HUTANG.FAILED:
            return Object.assign({}, state, {
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case HUTANG.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        case HUTANG.LOADING_POST:
            return Object.assign({}, state, {
                isLoadingPost: action.load
            });
        default:
            return state
    }
};