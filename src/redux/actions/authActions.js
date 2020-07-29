import { AUTH} from './_constants';
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
        Swal.fire({
            title: 'Please Wait.',
            html: 'Checking your account.',
            onBeforeOpen: () => {
                Swal.showLoading()
            },
            onClose: () => {}
        })

        axios.post(HEADERS.URL+'auth/bo', userData)
        .then(res=>{
            setTimeout(
            function () {
                Swal.close() 
                // save token to localStorage
                const token = res.data.result.token;
                localStorage.setItem('npos', btoa(token));
                store('sess', {
                    id: res.data.result.id,
                    username: res.data.result.username,
                    lokasi: res.data.result.lokasi,
                    lvl: res.data.result.lvl,
                    access: res.data.result.access,
                    password_otorisasi: res.data.result.password_otorisasi,
                    nama: res.data.result.nama,
                    alamat: res.data.result.alamat,
                    foto: res.data.result.foto,
                    token:token
                })
            
                // Set token to Auth Header 
                setAuthToken(token);
                // decode token to set user data
                dispatch(setCurrentUser(res.data.result));
                dispatch(setLoggedin(true));
            },800)

        }).catch(err =>{
            Swal.close() 
            Swal.fire(
                'Something wrong.',
                err.response.data.msg,
                'error'
            )
        dispatch({type: AUTH.GET_ERRORS, payload: err.response.data.msg})
        });
    }
// set user data
export const setCurrentUser = decoded =>{
    return{
        type: AUTH.SET_CURRENT_USER,
        payload: decoded
    }
}

//set loggedin
export const setLoggedin = decoded => {
    return {
        type: AUTH.SET_LOGGED_USER,
        payload: decoded
    }
}
// set logout user
export const logoutUser = () => dispatch =>{
    // remove jwtToken from localStorage
    // localStorage.removeItem('jwtToken');
    destroy('sess')
    dispatch(setLoggedin(false));
    localStorage.clear()

    // remove auth header for future request
    setAuthToken(false);
    // Set current user to {} and isAuthenticated to false
    dispatch(setCurrentUser({}));

}

