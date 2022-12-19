import { SCAN_RESI, SCAN_RESI_REPORT } from "../../actions/_constants";

const initialState = {
    download: 0,
    data: [],
    msg: "",
    status: "",
    dataExport: [],
    dataGetDetailReport: []

};

export const scanResiLaporanReducer = (state = initialState, action) => {
    switch (action.type) {
        case SCAN_RESI_REPORT.SUCCESS:
            return Object.assign({}, state, {
                status: action.data.status,
                msg: action.data.msg,
                data: action.data.result,
            });
        case SCAN_RESI_REPORT.GET_DETAIL_REPORT:
            return Object.assign({}, state, {
                dataGetDetailReport: action.data.result,
            });
        case SCAN_RESI_REPORT.EXPORT:
            return Object.assign({}, state, {
                dataExport: action.data.result,
            });
        case SCAN_RESI_REPORT.DOWNLOAD:
            return Object.assign({}, state, {
                download: action.load,
            });
        default:
            return state;
    }
};
