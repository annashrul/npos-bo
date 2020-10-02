import {
    PACKING
} from "../../../actions/_constants";

const initialState = {
    isLoading: false,
    data: [], msg:"", status:"",
    code:"-",data_trx:[],
    report:[],
    report_excel:[],
};

export const packingReducer = (state = initialState, action) => {
    switch (action.type) {
        case PACKING.SUCCESS:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                report:action.data.result
            });
        case PACKING.SUCCESS_EXCEL:
            return Object.assign({}, state, {
                report_excel: action.data.result,
            });
        case PACKING.GET_BARANG_SUCCESS:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result,
            });
        case PACKING.GET_BARANG_SUCCESS_TRX:
            return Object.assign({}, state, {
                data_trx: action.data.result,
            });
        case PACKING.GET_CODE:
            console.log("codeeeeeeeeeeeeeeee",action.data.result)
            return Object.assign({}, state, {
                code: action.data.result
            });
        case PACKING.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });

        default:
            return state
    }
};