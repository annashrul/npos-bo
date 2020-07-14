import { GET_ERRORS,SET_CURRENT_USER } from './types';
import axios from 'axios';
import Swal from 'sweetalert2'
import {store,destroy} from "components/model/app.model";

import setAuthToken from '../../utils/setAuthToken';
import {HEADERS} from "./_constants";

// user register

// Login user -- get token
export const loginUser = (userData) =>
    async dispatch =>{
        destroy('sess');
         axios.post(HEADERS.URL+'auth/bo', userData)
              .then(res=>{
                  console.log(res);
                  // save token to localStorage
                  const token = res.data.result.token;

                //   localStorage.setItem('jwtToken', token);
                store('sess', {
                    id: res.data.result.id,
                    username: res.data.result.username,
                    lokasi: res.data.result.lokasi,
                    lvl: res.data.result.lvl,
                    access: res.data.result.access,
                    password_otorisasi: res.data.result.password_otorisasi,
                    nama: res.data.result.nama,
                    alamat: res.data.result.alamat,
                    foto: res.data.result.foto
                })
                
                  // Set token to Auth Header 
                  setAuthToken(token);
                  // decode token to set user data
                  dispatch(setCurrentUser(res.data.result));

              }).catch(err =>{
                  Swal.fire(
                      'Something wrong.',
                      err.response.data.msg,
                      'error'
                  )
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
    // localStorage.removeItem('jwtToken');
    destroy('sess')

    // remove auth header for future request
    setAuthToken(false);
    // Set current user to {} and isAuthenticated to false
    dispatch(setCurrentUser({}));

}

