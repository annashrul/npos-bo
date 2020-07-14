import axios from 'axios';
import {HEADERS} from "../redux/actions/_constants";

const setAuthToken = token =>{
    console.log("SET AUTH TOKEN ",token);
    if(token){

        // Apply to every request
        axios.defaults.headers.common['Authorization'] = token;
        axios.defaults.headers.common['username'] = `${HEADERS.USERNAME}`;
        axios.defaults.headers.common['password'] = `${HEADERS.PASSWORD}`;
        axios.defaults.headers.common['Content-Type'] = `application/x-www-form-urlencoded`;
    }else{
        // delete auth header
        delete axios.defaults.headers.common['Authorization'];
    }
}

export default setAuthToken;