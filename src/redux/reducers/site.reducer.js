import {
    SITE
} from "../actions/_constants";

const initialState = {
    isLoading: false,
    data: [],
    msg:"",
    status:"",
    check:false,
};

export const siteReducer = (state = initialState, action) => {
    switch (action.type) {
        case SITE.SUCCESS_CHECK:
            return Object.assign({}, state, {
                check:action.data.result===0?false:true
            });
        case SITE.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        default:
            return state
    }
};