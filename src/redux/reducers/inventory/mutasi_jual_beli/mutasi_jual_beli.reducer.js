import {
    MUTASI_JUAL_BELI
} from "../../../actions/_constants";

const initialState = {
    isLoading: false,
    code:"-",
    status:"",
    msg:"",
    data:[],
    kartu_data:[],
};

export const mutasiJualBeliReducer = (state = initialState, action) => {
    switch (action.type) {
        case MUTASI_JUAL_BELI.SUCCESS_CODE_BAYAR:

            return Object.assign({}, state, {
                code: action.data.result
            });
        case MUTASI_JUAL_BELI.SUCCESS_KARTU:
            return Object.assign({}, state, {
                kartu_data: action.data.result
            });
        case MUTASI_JUAL_BELI.SUCCESS_DATA_BAYAR:
            
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result,
            });
        case MUTASI_JUAL_BELI.FAILED_DATA_BAYAR:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result,
            });
        case MUTASI_JUAL_BELI.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        default:
            return state
    }
};