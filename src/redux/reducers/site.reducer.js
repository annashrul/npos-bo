import {
    SITE
} from "../actions/_constants";

const initialState = {
    isLoading: false,
    data: [],
    msg:"",
    status:"",
    check:false,
    triggerEcaps:false,
    get_link:'-',
    triggerMobileEcaps:false,
};

export const siteReducer = (state = initialState, action) => {
    switch (action.type) {
        case SITE.DOWNLOAD_TXT:
            return Object.assign({}, state,{
                get_link: action.data.result
            });
        case SITE.SUCCESS_CHECK:
            return Object.assign({}, state, {
                check:action.data.result===0?false:true
            });
        case SITE.TRIGGER_ECAPS:
            return Object.assign({}, state, {
                triggerEcaps: action.data
            });
        case SITE.TRIGGER_MOBILE_ECAPS:
            return Object.assign({}, state, {
                triggerMobileEcaps: action.data
            });
        case SITE.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        default:
            return state
    }
};