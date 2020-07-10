import React, { Component } from 'react';
import { BrowserRouter as Router} from 'react-router-dom';

import './App.css';
import store from '../../redux/store';
import setAuthToken from '../../utils/setAuthToken';
import {setCurrentUser, logoutUser} from '../../redux/actions/authActions';

import Aux from './Hoc/Aux';
import Routes from './Routes/Routes';

// Check token in localStorage
if(localStorage.jwtToken){
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode auth token and get user info
  // let decoded = jwt_decode(localStorage.jwtToken);
  // Dispatch user info
  store.dispatch(setCurrentUser(localStorage.jwtToken))
  // Check for expire token
  // const currentTime = Date.now() /1000;
  // if(decoded.exp < currentTime){
  //   // Logout User
  //   store.dispatch(logoutUser());
  //   // TODO: Clear current profile
  //   // Redirect to login
  //   window.location.href = '/login';
  // }
}


class App extends Component {
  render() {
    return (
      <Router>
          <Aux>
            {Routes}
          </Aux>
      </Router>
    );
  }
}

export default App;