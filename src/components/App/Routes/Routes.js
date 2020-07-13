import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Login from '../Auth/Login/Login';
import Dashboard from '../Dashboard/Dashboard';
import Bank from '../masterdata/bank';
import Cash from '../masterdata/cash';
import User from '../masterdata/user';
import PrivateRoute from '../common/PrivateRoute';
import Adjustment from '../inventory/adjusment'
import PurchaseOrder from '../purchase/purchaseorder'
const Routes = (
    <div>
        <Route path="/login" exact strict component={Login} />
        <Switch>
            <PrivateRoute path="/" exact strict component={Dashboard} />
            <PrivateRoute path="/bank" exact strict component={Bank} />
            <PrivateRoute path="/cash" exact strict component={Cash} />
            <PrivateRoute path="/user" exact strict component={User} />
            <PrivateRoute path="/adjustment" exact strict component={Adjustment} />
            <PrivateRoute path="/purchase_order" exact strict component={PurchaseOrder} />
        </Switch>
    </div>
)

export default Routes;