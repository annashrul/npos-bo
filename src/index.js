import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import "react-datepicker/dist/react-datepicker.css";
import 'react-tabs/style/react-tabs.css';
import 'sweetalert2/src/sweetalert2.scss'

import store from './redux/store';

ReactDOM.render(
    <Provider store={store}>
       <App />
    </Provider>, 
    document.getElementById('root'));
registerServiceWorker();
