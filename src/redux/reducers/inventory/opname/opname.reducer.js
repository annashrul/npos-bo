import {OPNAME} from "../../../actions/_constants";

const initialState = {
    isLoading:true,
    status:"",msg:"",
    data:[],
    report:[],
    report_excel:[],
    total_opname:{total_fisik:0,total_akhir:0,total_hpp:0,},
};

export const opnameReducer = (state=initialState,action) => {
    switch (action.type) {
        case OPNAME.SUCCESS:
            console.log("opnameReducer", action.data.result)
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                report:action.data.result
            });
        case OPNAME.DATA_POSTING:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result,
                total_opname:action.data.result.total_opname
            });
        case OPNAME.SUCCESS_EXCEL:
            return Object.assign({}, state, {
                report_excel: action.data.result,
            });
        case OPNAME.FAILED:
            return Object.assign({}, state, {
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case OPNAME.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        default:
            return state
    }
};