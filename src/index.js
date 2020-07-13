import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";

import store from './redux/store';
axios.defaults.baseURL = 'http://203.190.54.4:6692/';

ReactDOM.render(
    <Provider store={store}>
       <App />
    </Provider>, 
    document.getElementById('root'));
registerServiceWorker();
