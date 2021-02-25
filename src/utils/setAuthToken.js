import axios from 'axios';
import {HEADERS} from "../redux/actions/_constants";
import Cookies from 'js-cookie'
const setAuthToken = token =>{
    if(token){

        // Apply to every request
        axios.defaults.headers.common['Authorization'] = token;
        axios.defaults.headers.common['username'] = atob(Cookies.get('tnt='));
        axios.defaults.headers.common['password'] = `${HEADERS.PASSWORD}`;
        axios.defaults.headers.common['Content-Type'] = `application/json`;
    }else{
        // delete auth header
        delete axios.defaults.headers.common['Authorization'];
    }
}

export default setAuthToken;