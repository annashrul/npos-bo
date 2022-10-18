import {USER_LIST} from "../../../actions/_constants";


const initialState = {
    isLoading: true,
    status: "",
    msg: "",
    data: [],
    edit:[],
    detail:[]
}

export const userListReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_LIST.SUCCESS:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result,
            });
        case USER_LIST.EDIT:
            return Object.assign({}, state, {
                edit: action.data.result,
            });
        case USER_LIST.DETAIL:
            return Object.assign({}, state, {
                detail: action.data.result,
            });
        case USER_LIST.FAILED:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.data,
            });
        case USER_LIST.LOADING:
            return Object.assign({}, state, {
                isLoading: action.load
            });
        case USER_LIST.SUCCESS_NEWEST:
            return Object.assign({}, state, {
                newest: action.dataNew.result,
            });
        default:
            return state
    }
}