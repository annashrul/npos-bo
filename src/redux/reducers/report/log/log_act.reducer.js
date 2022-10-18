import {LOG_ACT} from "../../../actions/_constants";

const initialState = {
    isLoading:true,
    status:"",msg:"",
    data:[],
    report:[],
    report_excel:[],
    total_log_act:{total_fisik:0,total_akhir:0,total_hpp:0,},
};

export const log_actReducer = (state=initialState,action) => {
    switch (action.type) {
        case LOG_ACT.SUCCESS:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                report:action.data.result
            });
        case LOG_ACT.DATA_POSTING:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result,
                total_log_act:action.data.result.total_log_act
            });
        case LOG_ACT.SUCCESS_EXCEL:
            return Object.assign({}, state, {
                report_excel: action.data.result,
            });
        case LOG_ACT.FAILED:
            return Object.assign({}, state, {
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case LOG_ACT.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        default:
            return state
    }
};