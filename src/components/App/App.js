import React, { Component } from 'react';
import { BrowserRouter as Router} from 'react-router-dom';

import store from '../../redux/store';
import setAuthToken from '../../utils/setAuthToken';
import {setCurrentUser, setLoggedin,logoutUser} from '../../redux/actions/authActions';

import Routes from './Routes/Routes';
import { DBConfig } from 'DBConfig';
import { initDB } from 'react-indexed-db';
 import {get} from "components/model/app.model";
import Cookies from 'js-cookie'

initDB(DBConfig);
// Check token in cookie
const token = Cookies.get('datum_exp');

if (token) {
  setAuthToken(atob(token));
  store.dispatch(setLoggedin(true))
  const sess = get('sess');
    sess.then(res => {
      if (res.length!==0) {
        // Set auth token header auth
        setAuthToken(atob(token));
        store.dispatch(setCurrentUser(res[0]))
        var decodedToken = jwt.decode(atob(token), {complete: true});
        var dateNow = new Date();

        if (decodedToken.exp < dateNow.getTime()){
          store.dispatch(logoutUser());
          Cookies.remove('datum_exp')
          Cookies.remove('datum_np')
          // Redirect to login
          window.location.href = '/login';
        }


      }else{
        store.dispatch(logoutUser());
        Cookies.remove('datum_exp')
        Cookies.remove('datum_np')
        // Redirect to login
        window.location.href = '/login';
      }
  })
}

class App extends Component {
  render() {
    return (
      <Router>
            {Routes}
      </Router>
    );
  }
}

export default App;