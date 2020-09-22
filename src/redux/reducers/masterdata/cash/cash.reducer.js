import {CASH} from "../../../actions/_constants";


const initialState = {
    isLoading:true,
    status:"",msg:"",data:[], currentPage:0,
    dataExcel:[],
    per_page:0,
    total:0,
    dataReport:[],
    isLoadingReport:false,
    isSuccessTrx:false
};

export const cashReducer = (state=initialState,action) => {
    switch (action.type) {
        case CASH.EXCEL_REPORT:
            return Object.assign({}, state,{
                dataExcel:action.data.result
            });
        case CASH.SUCCESS_REPORT:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                dataReport:action.data.result
            });
        case CASH.TRX_SUCCESS:
            return Object.assign({},state,{
                isSuccessTrx:action.bool
            })
        case CASH.SUCCESS:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case CASH.FAILED:
            return Object.assign({}, state, {
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case CASH.LOADING_REPORT:
            return Object.assign({}, state, {
                isLoadingReport: action.load
            });
        case CASH.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        default:
            return state
    }
};