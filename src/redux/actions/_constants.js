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
  URL: atob(document.getElementById("hellyeah").value),
  TOKEN:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwY2RiN2M5OC0wNWNmLTQ4NDgtOGM3Yy0yZTFiYTczZGUwNmYiLCJpYXQiOjE1NzAxNzM0ODYsImV4cCI6MTU3MDc3ODI4Nn0.1NiWtt2luG83am8FJSvWpL5p35Oxd8GSJJTwhFmAdgw",
  USERNAME: "netindo",
  PASSWORD: "$2b$08$hLMU6rEvNILCMaQbthARK.iCmDRO7jNbUB8CcvyRStqsHD4UQxjDO"
}

/****************
      PASSWORD MODAL ADD LOCATION
*****************/
export const LOC_VERIF ={
  password:"netindo35a"
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
export const AUTH = {
  FETCH_DATAS:'FETCH_DATAS',
  GET_ERRORS:'GET_ERRORS',
  TEST_DISPATCH:'TEST_DISPATCH',
  SET_CURRENT_USER:'SET_CURRENT_USER',
  SET_LOGGED_USER:'SET_LOGGED_USER'
}
export const REGISTER = {
  PROCESS: 'SET_REGISTER_PROCESS',
  SUCCESS: 'SET_REGISTER_SUCCESS',
  FAILED: 'SET_REGISTER_FAILED',
  SETEMAIL: 'SET_EMAIL',
}
/****************
 COMPANY
 *****************/
export const COMPANY = {
    LOADING_GET: 'SET_COMPANY_LOADING_GET',
    SUCCESS_GET: 'SUCCESS_COMPANY_GET',
    FAILED_GET: 'FAILED_COMPANY_GET',
    LOADING_POST: 'SET_COMPANY_LOADING_POST',
    SUCCESS_POST: 'SUCCESS_COMPANY_POST',
    FAILED_POST: 'FAILED_COMPANY_POST',
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
    DETAIL: 'DETAIL_CASH',
    LOADING_REPORT: 'SET_CASH_LOADING_REPORT',
    SUCCESS_REPORT: 'SUCCESS_CASH_REPORT',
    FAILED_REPORT: 'FAILED_CASH_REPORT',
    DETAIL_REPORT: 'DETAIL_CASH_REPORT',
    EXCEL_REPORT: 'SUCCESS_CASH_EXCEL_REPORT',
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
 PROMO
 *****************/
export const PROMO = {
    LOADING: 'SET_PROMO_LOADING',
    SUCCESS: 'SUCCESS_PROMO',
    SUCCESS_KATEGORI: 'SUCCESS_PROMO_KATEGORI',
    FAILED: 'FAILED_PROMO',
    DETAIL: 'DETAIL_PROMO'
}

/****************
 PRODUCT
 *****************/
export const PRODUCT = {
    LOADING: 'SET_PRODUCT_LOADING',
    SUCCESS: 'SUCCESS_PRODUCT',
    FAILED: 'FAILED_PRODUCT',
    DETAIL: 'DETAIL_PRODUCT',
    LOADING_BRG: 'SET_BRG_LOADING',
    LOADING_BRG_SALE: 'SET_LOADING_BRG_SALE',
    SUCCESS_BRG: 'SET_BRG_SUCCESS',
    SUCCESS_BRG_SALE: 'SET_SUCCESS_BRG_SALE',
    EDIT_PRODUCT: 'SET_EDIT_PRODUCT',
    CODE_PRODUCT: 'SET_CODE_PRODUCT',
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
    ALL: 'SET_CUSTOMER_ALL',
    FAILED: 'SET_CUSTOMER_FAILED',
    DETAIL: 'SET_CUSTOMER_DETAIL',
    LIST_PRICE: 'SET_CUSTOMER_LIST_PRICE',
    SAVE_LIST_PRICE: 'SET_CUSTOMER_SAVE_LIST_PRICE',
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
    POST_LOADING: 'SET_DEPT_POST_LOADING',
    ALL:'SET_ALL_DEPT_SUCCESS'
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
 ADJUSTMENT
 *****************/
export const ADJUSTMENT = {
    LOADING: 'SET_ADJUSTMENT_LOADING',
    SUCCESS: 'SET_ADJUSTMENT_SUCCESS',
    FAILED: 'SET_ADJUSTMENT_FAILED',
    DETAIL: 'SET_ADJUSTMENT_DETAIL',
    ALL: 'SET_ADJUSTMENT_ALL',
    EXCEL: 'SET_ADJUSTMENT_EXCEL',
    POST_LOADING: 'SET_ADJUSTMENT_POST_LOADING',
    DETAIL_TRANSAKSI: 'SET_ADJUSTMENT_DETAIL_TRANSAKSI',
    GET_CODE:"SET_CODE_ADJUSMENT"
}
/****************
 OPNAME
 *****************/
export const OPNAME = {
    LOADING: 'SET_OPNAME_LOADING',
    SUCCESS: 'SET_OPNAME_SUCCESS',
    FAILED: 'SET_OPNAME_FAILED',
    DATA_POSTING:"SET_DATA_POSTING",
    FAILED_POSING:"SET_FAILED_POSTING"
}
/****************
 SALES
 *****************/
export const SALES = {
    LOADING: 'SET_SALES_LOADING',
    SUCCESS: 'SET_SALES_SUCCESS',
    FAILED: 'SET_SALES_FAILED',
    DETAIL: 'SET_SALES_DETAIL',
    ALL: 'SET_SALES_ALL',
    POST_LOADING: 'SET_SALES_POST_LOADING'
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

/****************
 PURCHSE ORDER
 *****************/
export const PO = {
  LOADING: 'SET_PO_LOADING',
  LOADING_DETAIL: 'SET_PO_LOADING_DETAIL',
  SUCCESS: 'SET_PO_SUCCESS',
  FAILED: 'SET_PO_FAILED',
  DETAIL: 'SET_PO_DETAIL',
  SUCCESS_CODE: 'SET_PO_SUCCESS_CODE',
  REPORT_SUCCESS: 'SET_PO_REPORT_SUCCESS',
  PO_DATA: 'SET_PO_DATA_SUCCESS',
  PO_REPORT_DETAIL: 'SET_PO_REPORT_DETAIL_SUCCESS'
}


/****************
 PURCHSE ORDER
 *****************/
export const RETUR_TANPA_NOTA = {
    LOADING: 'SET_RETUR_TANPA_NOTA_LOADING',
    SUCCESS_CODE: 'SET_RETUR_TANPA_NOTA_SUCCESS_CODE',
}

export const RECEIVE = {
    LOADING: 'SET_RECEIVE_LOADING',
    SUCCESS: 'SET_RECEIVE_SUCCESS',
    FAILED: 'SET_RECEIVE_FAILED',
    DETAIL: 'SET_RECEIVE_DETAIL',
    SUCCESS_CODE: 'SET_RECEIVE_SUCCESS_CODE',
    SUCCESS_REPORT: 'SET_RECEIVE_SUCCESS_REPORT',
    RECEIVE_DATA: 'SET_RECEIVE_DATA_SUCCESS',
    RECEIVE_REPORT_DETAIL: 'SET_RECEIVE_REPORT_DETAIL_SUCCESS',
    LOADING_REPORT_DETAIL: 'SET_RECEIVE_LOADING',

}


/****************
 APPROVAL MUTATION
 *****************/
export const MUTATION = {
    APPROVAL_MUTATION_LOADING   : 'SET_APPROVAL_MUTATION_LOADING',
    APPROVAL_MUTATION_FAILED    : 'SET_APPROVAL_MUTATION_FAILED',
    APPROVAL_MUTATION_DATA      : 'SET_APPROVAL_MUTATION_DATA_SUCCESS',
    APPROVAL_TUTATION_DATA_DETAIL : 'SET_APPROVAL_MUTATION_DATA_DETAIL'
}



/****************
 SALE
 *****************/
export const SALE = {
    LOADING: 'SET_SALE_LOADING',
    LOADING_DETAIL: 'SET_SALE_LOADING_DETAIL',
    SUCCESS: 'SET_SALE_SUCCESS',
    FAILED: 'SET_SALE_FAILED',
    DETAIL: 'SET_SALE_DETAIL',
    SUCCESS_CODE: 'SET_SALE_SUCCESS_CODE',
    SALE_DATA: 'SET_SALE_DATA_SUCCESS',
    REPORT_SUCCESS_EXCEL: 'SET_SALE_REPORT_SUCCESS_EXCEL',
    REPORT_SUCCESS: 'SET_SALE_REPORT_SUCCESS',
    REPORT_FAILED: 'SET_SALE_REPORT_FAILED',
    REPORT_LOADING: 'SET_SALE_REPORT_LOADING',
    REPORT_DETAIL_SUCCESS: 'SET_SALE_REPORT_DETAIL_SUCCESS',
}

/****************
 SITE SECTION
 *****************/
export const SITE = {
  LOADING: 'SET_SITE_LOADING',
  SUCCESS: 'SET_SITE_SUCCESS',
  FAILED: 'SET_SITE_FAILED',
  DETAIL: 'SET_SITE_DETAIL',
  SUCCESS_CHECK: 'SET_SITE_SUCCESS_CHECK',
  TRIGGER_ECAPS: 'SET_TRIGGER_ECAPS',
  DOWNLOAD_TXT: 'SET_DOWNLOAD_TXT',
  TRIGGER_MOBILE_ECAPS: 'SET_TRIGGER_MOBILE_ECAPS'
}

/****************
 INVENTORY SECTION
 *****************/
export const DN = {
  LOADING: 'SET_DN_LOADING',
  SUCCESS: 'SET_DN_SUCCESS',
  FAILED: 'SET_DN_FAILED',
  DETAIL: 'SET_DN_DETAIL',
  SUCCESS_CODE: 'SET_DN_SUCCESS_CODE',
  REPORT_SUCCESS: 'SET_DN_REPORT_SUCCESS',
  DN_DATA: 'SET_DN_DATA_SUCCESS'
}

export const ALOKASI = {
  LOADING: 'SET_ALOKASI_LOADING',
  LOADING_DETAIL: 'SET_STOCK_REPORT_DETAIL_LOADING',
  SUCCESS: 'SET_ALOKASI_SUCCESS',
  FAILED: 'SET_ALOKASI_FAILED',
  DETAIL: 'SET_ALOKASI_DETAIL',
  SUCCESS_CODE: 'SET_ALOKASI_SUCCESS_CODE',
  REPORT_SUCCESS: 'SET_ALOKASI_REPORT_SUCCESS',
  ALOKASI_DATA: 'SET_ALOKASI_DATA_SUCCESS'
}

export const CLOSING = {
  LOADING: 'SET_CLOSING_LOADING',
  LOADING_DETAIL: 'SET_STOCK_REPORT_DETAIL_LOADING',
  SUCCESS: 'SET_CLOSING_SUCCESS',
  FAILED: 'SET_CLOSING_FAILED',
  DETAIL: 'SET_CLOSING_DETAIL',
  SUCCESS_CODE: 'SET_CLOSING_SUCCESS_CODE',
  REPORT_SUCCESS: 'SET_CLOSING_REPORT_SUCCESS',
  CLOSING_DATA: 'SET_CLOSING_DATA_SUCCESS'
}
/****************
 HUTANG
 *****************/
export const HUTANG = {
    LOADING: 'SET_HUTANG_LOADING',
    SUCCESS: 'SET_HUTANG_SUCCESS',
    FAILED: 'SET_HUTANG_FAILED',
    SUCCESS_CODE: 'SET_HUTANG_SUCCESS_CODE',
    LOADING_POST: 'SET_HUTANG_LOADING_POST',
}

/****************
 MUTASI JUAL BELI
 *****************/
export const MUTASI_JUAL_BELI = {
    LOADING: 'SET_MUTASI_JUAL_BELI_LOADING',
    SUCCESS_DATA_BAYAR: 'SET_BAYAR_MUTASI_JUAL_BELI_SUCCESS_DATA',
    FAILED_DATA_BAYAR: 'SET_BAYAR_MUTASI_JUAL_BELI_FAILED_DATA',
    SUCCESS_CODE_BAYAR: 'SET_BAYAR_MUTASI_JUAL_BELI_SUCCESS_CODE',
}

/****************
 PRODUKSI
 *****************/
export const PRODUKSI = {
    LOADING: 'SET_PRODUKSI_LOADING',
    SUCCESS_BAHAN: 'SET_PRODUKSI_SUCCESS_BAHAN',
    SUCCESS_PAKET: 'SET_PRODUKSI_SUCCESS_PAKET',
    FAILED: 'SET_PRODUKSI_FAILED',
    DETAIL: 'SET_PRODUKSI_DETAIL',
    GET_CODE:"SET_CODE_PRODUKSI"
}
