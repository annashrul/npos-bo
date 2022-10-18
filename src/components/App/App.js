import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import store from "../../redux/store";
import setAuthToken from "../../utils/setAuthToken";
import {
  setCurrentUser,
  setLoggedin,
  logoutUser,
} from "../../redux/actions/authActions";

import Routes from "./Routes/Routes";
// import { DBConfig } from "DBConfig";
import { DBConfig } from "../../DBConfig";
import { initDB } from "react-indexed-db";
import { get } from "components/model/app.model";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

initDB(DBConfig);
// Check token in cookie
const token = Cookies.get("datum_exp");
if (token) {
  setAuthToken(atob(token));
  store.dispatch(setLoggedin(true));
  const sess = get("sess");
  sess.then((res) => {
    if (res.length !== 0) {
      // Set auth token header auth
      setAuthToken(atob(token));
      store.dispatch(setCurrentUser(res[0]));

      // cek JWT Token
      var decodedToken = jwt_decode(atob(token));
      var dateNow = new Date();
      if (decodedToken.exp * 1000 < dateNow.getTime()) {
        store.dispatch(logoutUser());
        // Redirect to login
        window.location.href = "/login";
      }
    } else {
      store.dispatch(logoutUser());
      // Redirect to login
      window.location.href = "/login";
    }
  });
}

class App extends Component {
  render() {
    return <Router>{Routes}</Router>;
  }
}

export default App;
