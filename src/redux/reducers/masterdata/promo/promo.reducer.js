import {PROMO} from "../../../actions/_constants";

const initialState = {
    isLoading:true,
    status:"",msg:"",data:[], currentPage:0,
    per_page:0,
    total:0,
};

export const promoReducer = (state=initialState,action) => {
    switch (action.type) {
        case PROMO.SUCCESS:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case PROMO.SUCCESS_KATEGORI:
            return Object.assign({}, state,{
                status:action.data.status,
                msg:action.data.msg,
                data_kategori:action.data.result
            });
        case PROMO.FAILED:
            return Object.assign({}, state, {
                status:action.data.status,
                msg:action.data.msg,
                data:action.data.result
            });
        case PROMO.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        default:
            return state
    }
};