import { DASHBOARD, HEADERS } from "../_constants"
import axios from "axios"


export function setLoading(load) {
    return {
        type: DASHBOARD.LOADING,
        load
    }
}

export function setSendLoading(loadPost) {
    return {
        type: DASHBOARD.POST_LOADING,
        loadPost
    }
}

export function setDashboard(data = []) {
    return {
        type: DASHBOARD.SUCCESS,
        data
    }
}
export function setNewest(dataNew = []) {
    return {
        type: DASHBOARD.SUCCESS_NEWEST,
        dataNew
    }
}

export function setDashboardFailed(data = []) {
    return {
        type: DASHBOARD.FAILED,
        data
    }
}

export const FetchDashboard = () => {
    return (dispatch) => {
        dispatch(setLoading(true));
        const headers = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        }
        axios.get(HEADERS.URL + "chartdata", headers)
        .then(function (response) {
            const data = response.data
            dispatch(setDashboard(data))
            dispatch(setLoading(false));
        })
        .catch(function (error) {
            // handle error
            
        })

    }
}

export const FetchNewest = () => {
    return (dispatch) => {
        const headers = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        axios.get(HEADERS.URL + "newest", headers)
            .then(function (response) {
                const data = response.data
                dispatch(setNewest(data))
            })
            .catch(function (error) {
                // handle error
            })

    }
}

export const FetchStock = () => {
    return (dispatch) => {
        dispatch(setLoading(true));
        let url = '';
        url = `site/get_out_stock`;
        
        
        axios.get(HEADERS.URL+`${url}`)
            .then(function(response){
                
                const data = response.data;
                
                dispatch(setDashboard(data));
                dispatch(setLoading(false));
            }).catch(function(error){
            
        })
    }
}
