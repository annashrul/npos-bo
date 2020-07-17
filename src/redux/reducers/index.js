import { combineReducers } from 'redux';
import { modalReducer, modalTypeReducer } from './modal.reducer';
import { dashboardReducer } from './dashboard/dashboard.reducer'
import authReducer from './authReducer';
import errorsReducer from './errorsReducer';
import {locationCategoryReducer} from "./masterdata/location_category/location_category.reducer";
import {locationReducer} from "./masterdata/location/location.reducer";
import {cashReducer} from "./masterdata/cash/cash.reducer";
import {bankReducer} from "./masterdata/bank/bank.reducer";
import {productReducer} from "./masterdata/product/product.reducer";
import {groupProductReducer} from "./masterdata/group_product/group_product.reducer";
import {userListReducer} from "./masterdata/user_list/user_list.reducer";
import {userLevelReducer} from "./masterdata/user_level/user_level.reducer";
import {priceProductReducer} from "./masterdata/price_product/price_product.reducer";
import {customerReducer} from "./masterdata/customer/customer.reducer";
import {customerTypeReducer} from "./masterdata/customer_type/customer_type.reducer";
import {supplierReducer} from "./masterdata/supplier/supplier.action";
import {salesReducer} from "./masterdata/sales/sales.action";
import {departmentReducer} from "./masterdata/department/department.reducer";
import {subDepartmentReducer} from "./masterdata/department/sub_department.reducer";
import {stockReportReducer} from "./report/inventory/stock_report.reducer";
import {poReducer} from "./purchase/purchase_order/po.reducer";
import {receiveReducer} from "./purchase/receive/receive.reducer";
import {siteReducer} from "./site.reducer";

export default combineReducers({
    modalReducer,
    modalTypeReducer,
    dashboardReducer,
    userLevelReducer,
    userListReducer,
    locationCategoryReducer,
    locationReducer,
    cashReducer,
    bankReducer,
    productReducer,
    priceProductReducer,
    groupProductReducer,
    customerReducer,
    customerTypeReducer,
    departmentReducer,
    subDepartmentReducer,
    supplierReducer,
    salesReducer,
    stockReportReducer,
    poReducer,
    receiveReducer,
    siteReducer,

    auth: authReducer,
    errors : errorsReducer
});