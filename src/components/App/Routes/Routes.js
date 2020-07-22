import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Login from '../Auth/Login/Login';
import Dashboard from '../Dashboard/Dashboard';
import Bank from '../masterdata/bank';
import Cash from '../masterdata/cash';
import User from '../masterdata/user';
import Location from '../masterdata/location';
import Product from '../masterdata/product';
import Customer from '../masterdata/customer';
import Supplier from '../masterdata/supplier';
import Sales from '../masterdata/sales';
import Department from '../masterdata/department';
import PrivateRoute from '../common/PrivateRoute';
import Adjustment from '../inventory/adjusment'
import PurchaseOrder from '../purchase/purchaseorder'
import Receive from '../purchase/receive'
import Sale from '../sale/product_sale'
import DeliveyNote from '../inventory/delivery_note'
import Alokasi from '../inventory/alokasi'
import InventoryReport from '../report/inventory/stock'
import AdjustmentReport from '../report/inventory/adjustment'
import PoReport from '../report/inventory/po'
import ReceiveReport from '../report/inventory/receive'
const Routes = (
    <div>
        <Route path="/login" exact strict component={Login} />
        <Switch>
            <PrivateRoute path="/" exact strict component={Dashboard} />
            <PrivateRoute path="/bank" exact strict component={Bank} />
            <PrivateRoute path="/cash" exact strict component={Cash} />
            <PrivateRoute path="/customer" exact strict component={Customer} />
            <PrivateRoute path="/supplier" exact strict component={Supplier} />
            <PrivateRoute path="/sales" exact strict component={Sales} />
            <PrivateRoute path="/department" exact strict component={Department} />
            <PrivateRoute path="/user" exact strict component={User} />
            <PrivateRoute path="/location" exact strict component={Location} />
            <PrivateRoute path="/product" exact strict component={Product} />
            <PrivateRoute path="/adjustment" exact strict component={Adjustment} />
            <PrivateRoute path="/receive" exact strict component={Receive} />
            <PrivateRoute path="/sale" exact strict component={Sale} />
            <PrivateRoute path="/purchase_order" exact strict component={PurchaseOrder} />
            <PrivateRoute path="/inventory_report" exact strict component={InventoryReport} />
            <PrivateRoute path="/delivery_note" exact strict component={DeliveyNote} />
            <PrivateRoute path="/alokasi" exact strict component={Alokasi} />
            <PrivateRoute path="/adjustment_report" exact strict component={AdjustmentReport} />
            <PrivateRoute path="/po_report" exact strict component={PoReport} />
            <PrivateRoute path="/receive_report" exact strict component={ReceiveReport} />
        </Switch>
    </div>
)

export default Routes;