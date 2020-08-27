import {PIUTANG} from "../../actions/_constants";

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

export const piutangReducer = (state=initialState,action) => {
    switch (action.type) {
        case PIUTANG.SUCCESS_REPORT:
            console.log(action.data.result);
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                data_report:action.data.result
            });
        case PIUTANG.SUCCESS_EXCEL:
            console.log(action.data.result);
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                report_excel:action.data.result
            });
        case PIUTANG.SUCCESS_CODE:
            return Object.assign({}, state,{
                get_code: action.data.result
            });
        case PIUTANG.SUCCESS:
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