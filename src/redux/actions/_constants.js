/*****************
 * isLading
*****************/
export const LOADING = {
  IS_LOADING: "IS_LOADING"
}

/****************
      TOKEN
*****************/
export const TOKEN = {
  GET: "GET_TOKEN"
}

export const HEADERS ={
  URL: "http://203.190.54.4:6692/",
  // URL:"http://192.168.100.6:5000/api/v1/",
  TOKEN:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwY2RiN2M5OC0wNWNmLTQ4NDgtOGM3Yy0yZTFiYTczZGUwNmYiLCJpYXQiOjE1NzAxNzM0ODYsImV4cCI6MTU3MDc3ODI4Nn0.1NiWtt2luG83am8FJSvWpL5p35Oxd8GSJJTwhFmAdgw",
  USERNAME: "netindo",
  PASSWORD: "$2b$08$hLMU6rEvNILCMaQbthARK.iCmDRO7jNbUB8CcvyRStqsHD4UQxjDO"
}

/****************
      MODAL
*****************/
export const MODALS = {
  IS_MODAL_OPEN: 'IS_MODAL_OPEN',
  MODAL_TYPE : 'MODAL_TYPE'
}

/****************
      AUTH
*****************/
export const LOGIN = {
  PROCESS: 'SET_LOGIN_PROCESS',
  SUCCESS: 'SET_LOGIN_SUCCESS',
  FAILED: 'SET_LOGIN_FAILED',
  REMOVE: 'SET_LOGOUT'
}
export const REGISTER = {
  PROCESS: 'SET_REGISTER_PROCESS',
  SUCCESS: 'SET_REGISTER_SUCCESS',
  FAILED: 'SET_REGISTER_FAILED',
  SETEMAIL: 'SET_EMAIL',
}
/****************
    USERS
*****************/
export const USER_LIST = {
  LOADING: 'SET_USER_LIST_LOADING',
  SUCCESS: 'SUCCESS_USER_LIST',
  FAILED: 'FAILED_USER_LIST',
  DETAIL: 'DETAIL_USER_LIST',
  EDIT: 'EDIT_USER_LIST'
}

/****************
 USERS LEVEL
 *****************/
export const USER_LEVEL = {
    LOADING: 'SET_USER_LEVEL_LOADING',
    SUCCESS: 'SUCCESS_USER_LEVEL',
    FAILED: 'FAILED_USER_LEVEL',
    DETAIL: 'DETAIL_USER_LEVEL'
}
/****************
 LOCATION CATEGORY
 *****************/
export const LOCATION_CATEGORY = {
    LOADING: 'SET_LOCATION_CATEGORY_LOADING',
    SUCCESS: 'SUCCESS_LOCATION_CATEGORY',
    FAILED: 'FAILED_LOCATION_CATEGORY',
    DETAIL: 'DETAIL_LOCATION_CATEGORY'
}
/****************
 LOCATION
 *****************/
export const LOCATION = {
    LOADING: 'SET_LOCATION_LOADING',
    SUCCESS: 'SUCCESS_LOCATION',
    FAILED: 'FAILED_LOCATION',
    DETAIL: 'DETAIL_LOCATION',
    ALL: 'ALL_LOCATION',
    EDIT: 'EDIT_LOCATION',
}

/****************
 CASH
 *****************/
export const CASH = {
    LOADING: 'SET_CASH_LOADING',
    SUCCESS: 'SUCCESS_CASH',
    FAILED: 'FAILED_CASH',
    DETAIL: 'DETAIL_CASH'
}

/****************
 BANK
 *****************/
export const BANK = {
    LOADING: 'SET_BANK_LOADING',
    SUCCESS: 'SUCCESS_BANK',
    FAILED: 'FAILED_BANK',
    DETAIL: 'DETAIL_BANK'
}

/****************
 PRODUCT
 *****************/
export const PRODUCT = {
    LOADING: 'SET_PRODUCT_LOADING',
    SUCCESS: 'SUCCESS_PRODUCT',
    FAILED: 'FAILED_PRODUCT',
    DETAIL: 'DETAIL_PRODUCT'
}

/****************
 PRICE PRODUCT
 *****************/
export const PRICE_PRODUCT = {
    LOADING: 'SET_PRICE_PRODUCT_LOADING',
    SUCCESS: 'SUCCESS_PRICE_PRODUCT',
    FAILED: 'FAILED_PRICE_PRODUCT',
    DETAIL: 'DETAIL_PRICE_PRODUCT'
}

/****************
 GROUP PRODUCT
 *****************/
export const GROUP_PRODUCT = {
    LOADING: 'SET_GROUP_PRODUCT_LOADING',
    SUCCESS: 'SUCCESS_GROUP_PRODUCT',
    FAILED: 'FAILED_GROUP_PRODUCT',
    DETAIL: 'DETAIL_GROUP_PRODUCT'
}
/****************
 CUSTOMER
 *****************/
export const CUSTOMER = {
    LOADING: 'SET_CUSTOMER_LOADING',
    SUCCESS: 'SET_CUSTOMER_SUCCESS',
    FAILED: 'SET_CUSTOMER_FAILED',
    DETAIL: 'SET_CUSTOMER_DETAIL',
    EDIT: 'SET_CUSTOMER_EDIT',
    POST_LOADING: 'SET_CUSTOMER_POST_LOADING'
}
/****************
 CUSTOMER TYPE
 *****************/
export const CUSTOMER_TYPE = {
    LOADING: 'SET_CUSTOMER_TYPE_LOADING',
    SUCCESS: 'SET_CUSTOMER_TYPE_SUCCESS',
    FAILED: 'SET_CUSTOMER_TYPE_FAILED',
    DETAIL: 'SET_CUSTOMER_TYPE_DETAIL',
    ALL: 'SET_CUSTOMER_TYPE_ALL',
    POST_LOADING: 'SET_CUSTOMER_TYPE_POST_LOADING'
}
/****************
 DEPT
 *****************/
export const DEPT = {
    LOADING: 'SET_DEPT_LOADING',
    SUCCESS: 'SET_DEPT_SUCCESS',
    FAILED: 'SET_DEPT_FAILED',
    DETAIL: 'SET_DEPT_DETAIL',
    POST_LOADING: 'SET_DEPT_POST_LOADING'
}
/****************
 SUB DEPT
 *****************/
export const SUB_DEPT = {
    LOADING: 'SET_SUB_DEPT_LOADING',
    SUCCESS: 'SET_SUB_DEPT_SUCCESS',
    FAILED: 'SET_SUB_DEPT_FAILED',
    DETAIL: 'SET_SUB_DEPT_DETAIL',
    ALL: 'SET_SUB_DEPT_ALL',
    POST_LOADING: 'SET_SUB_DEPT_POST_LOADING'
}
/****************
 SUPPLIER
 *****************/
export const SUPPLIER = {
    LOADING: 'SET_SUPPLIER_LOADING',
    SUCCESS: 'SET_SUPPLIER_SUCCESS',
    FAILED: 'SET_SUPPLIER_FAILED',
    DETAIL: 'SET_SUPPLIER_DETAIL',
    ALL: 'SET_SUPPLIER_ALL',
    POST_LOADING: 'SET_SUPPLIER_POST_LOADING'
}
/****************
    DASHBOARD
*****************/
/****************
 STOCK REPORT
 *****************/
export const STOCK_REPORT = {
    LOADING: 'SET_STOCK_REPORT_LOADING',
    LOADING_DETAIL_SATUAN: 'SET_STOCK_REPORT_DETAIL_SATUAN_LOADING',
    SUCCESS: 'SET_STOCK_REPORT_SUCCESS',
    FAILED: 'SET_STOCK_REPORT_FAILED',
    DETAIL_SATUAN: 'SET_STOCK_REPORT_DETAIL_SATUAN',
    DETAIL_TRANSAKSI: 'SET_STOCK_REPORT_DETAIL_TRANSAKSI',
    POST_LOADING: 'SET_STOCK_REPORT_POST_LOADING'
}
/****************
 DASHBOARD
 *****************/
export const DASHBOARD = {
  LOADING: 'SET_DASHBOARD_LOADING',
  SUCCESS: 'SET_DASHBOARD_SUCCESS',
  SUCCESS_NEWEST: 'SET_DASHBOARD_SUCCESS_NEWEST',
  FAILED: 'SET_DASHBOARD_FAILED',
  DETAIL: 'SET_DASHBOARD_DETAIL',
  POST_LOADING: 'SET_DASHBOARD_POST_LOADING'
}
