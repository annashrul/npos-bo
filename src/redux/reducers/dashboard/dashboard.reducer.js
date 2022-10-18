import {
    DASHBOARD
} from "redux/actions/_constants"

const initialState = {
    isLoading: true,
    isLoadingPost:false,
    status: "",
    msg: "",
    data: [],
    newest:[]
}

export const dashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        case DASHBOARD.SUCCESS:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result,
            });
        case DASHBOARD.FAILED:
            return Object.assign({}, state, {
                status: action.products.status,
                msg: action.products.msg,
                data: action.products.data,
            });
        case DASHBOARD.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        case DASHBOARD.SUCCESS_NEWEST:
            return Object.assign({}, state, {
                newest: action.dataNew.result,
            });
        default:
            return state
    }
}