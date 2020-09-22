import {LOG_TRX} from "../../../actions/_constants";

const initialState = {
    isLoading:true,
    status:"",msg:"",
    data:[],
    report:[],
    report_excel:[],
    total_log_trx:{total_fisik:0,total_akhir:0,total_hpp:0,},
};

export const log_trxReducer = (state=initialState,action) => {
    switch (action.type) {
        case LOG_TRX.SUCCESS:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                report:action.data.result
            });
        case LOG_TRX.DATA_POSTING:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result,
                total_log_trx:action.data.result.total_log_trx
            });
        case LOG_TRX.SUCCESS_EXCEL:
            return Object.assign({}, state, {
                report_excel: action.data.result,
            });
        case LOG_TRX.FAILED:
            return Object.assign({}, state, {
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case LOG_TRX.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        default:
            return state
    }
};