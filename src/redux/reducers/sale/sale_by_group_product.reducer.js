import { SALE_BY_GROUP_PRODUCT } from "../../actions/_constants";

const initialState = {
    download: 0,
    data: [],
    msg: "",
    status: "",
    dataExport: [],
    detail:[]

};

export const saleByGroupProductReducer = (state = initialState, action) => {
    switch (action.type) {
        case SALE_BY_GROUP_PRODUCT.SUCCESS:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result,
            });
        case SALE_BY_GROUP_PRODUCT.DETAIL:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                detail: action.data.result,
            });
        case SALE_BY_GROUP_PRODUCT.EXPORT:
            return Object.assign({}, state, {
                dataExport: action.data.result,
            });
        case SALE_BY_GROUP_PRODUCT.DOWNLOAD:
            return Object.assign({}, state, {
                download: action.load,
            });
        default:
            return state;
    }
};
