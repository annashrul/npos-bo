import axios from 'axios';
import {HEADERS} from "redux/actions/_constants";
import Cookies from 'js-cookie'

const setAuthToken = token =>{
    // SET HEADERS COMMON
    axios.defaults.headers.common['username'] = atob(Cookies.get('tnt='));
    axios.defaults.headers.common['password'] = `${HEADERS.PASSWORD}`;
    axios.defaults.headers.common['Content-Type'] = `application/json`;
    if(token){
        // Apply to every request
        axios.defaults.headers.common['Authorization'] = token;
    }else{
        // delete auth header
        delete axios.defaults.headers.common['Authorization'];
    }
}

export default setAuthToken;