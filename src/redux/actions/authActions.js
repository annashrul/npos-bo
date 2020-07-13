import { GET_ERRORS,SET_CURRENT_USER } from './types';
import axios from 'axios';

import setAuthToken from '../../utils/setAuthToken';
import {HEADERS} from "./_constants";

// user register
export const registerUser = (userData, history) =>
    async dispatch=>{
        axios.post(HEADERS.URL+'auth/bo',userData)
            .then(res=> history.push('/login'))
            .catch(err =>{
                dispatch({type: GET_ERRORS, payload: err.response.data})
            });
    }

// Login user -- get token
export const loginUser = (userData) =>
    async dispatch =>{
        console.log(userData);
         axios.post(HEADERS.URL+'auth/bo', userData)
              .then(res=>{
                  console.log(res);
                  // save token to localStorage
                  const token = res.data.result.token;

                  localStorage.setItem('jwtToken', token);
                  // Set token to Auth Header 
                  setAuthToken(token);
                  // decode token to set user data
                  dispatch(setCurrentUser(res.data.result));

              }).catch(err =>{
                  console.log(err);
                dispatch({type: GET_ERRORS, payload: 'cek'})
              });
    }
// set logged in user
export const setCurrentUser = decoded =>{
    return{
        type: SET_CURRENT_USER,
        payload: decoded
    }
}
// set logout user
export const logoutUser = () => dispatch =>{
    // remove jwtToken from localStorage
    localStorage.removeItem('jwtToken');
    // remove auth header for future request
    setAuthToken(false);
    // Set current user to {} and isAuthenticated to false
    dispatch(setCurrentUser({}));

}

