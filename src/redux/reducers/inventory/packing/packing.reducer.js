import {
    PACKING
} from "../../../actions/_constants";

const initialState = {
    isLoading: false,
    data: [], msg:"", status:"",
    code:"-",data_trx:[],
};

export const packingReducer = (state = initialState, action) => {
    switch (action.type) {
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