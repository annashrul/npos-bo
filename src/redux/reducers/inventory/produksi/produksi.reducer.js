import {
    PRODUKSI
} from "../../../actions/_constants";

const initialState = {
    isLoading: false,
    dataBahan: [], msgBahan:"", statusBahan:"",
    dataPaket: [], msgPaket:"", statusPaket:"",
    code:"-",
};

export const produksiReducer = (state = initialState, action) => {
    switch (action.type) {
        case PRODUKSI.SUCCESS_BAHAN:
            return Object.assign({}, state, {
                statusBahan: action.data.status,
                msgBahan: action.data.msg,
                dataBahan: action.data.result.data,
            });
        case PRODUKSI.SUCCESS_PAKET:
            return Object.assign({}, state, {
                statusPaket: action.data.status,
                msgPaket: action.data.msg,
                dataPaket: action.data.result.data,
            });

        case PRODUKSI.GET_CODE:
            return Object.assign({}, state, {
                code: action.data.result
            });
        case PRODUKSI.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });

        default:
            return state
    }
};