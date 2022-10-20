import { combineReducers } from "redux";
import { modalReducer, modalTypeReducer } from "./modal.reducer";
import { dashboardReducer } from "./dashboard/dashboard.reducer";
import authReducer from "./authReducer";
import errorsReducer from "./errorsReducer";
import { locationCategoryReducer } from "./masterdata/location_category/location_category.reducer";
import { locationReducer } from "./masterdata/location/location.reducer";
import { cashReducer } from "./masterdata/cash/cash.reducer";
import { bankReducer } from "./masterdata/bank/bank.reducer";
import { rakReducer } from "./masterdata/rak/rak.reducer";
import { promoReducer } from "./masterdata/promo/promo.reducer";
import { productReducer } from "./masterdata/product/product.reducer";
import { groupProductReducer } from "./masterdata/group_product/group_product.reducer";
import { userListReducer } from "./masterdata/user_list/user_list.reducer";
import { userLevelReducer } from "./masterdata/user_level/user_level.reducer";
import { priceProductReducer } from "./masterdata/price_product/price_product.reducer";
import { customerReducer } from "./masterdata/customer/customer.reducer";
import { customerTypeReducer } from "./masterdata/customer_type/customer_type.reducer";
import { supplierReducer } from "./masterdata/supplier/supplier.action";
import { areaReducer } from "./masterdata/area/area.reducer";
import { mejaReducer } from "./masterdata/meja/meja.reducer";
import { salesReducer } from "./masterdata/sales/sales.action";
import { departmentReducer } from "./masterdata/department/department.reducer";
import { subDepartmentReducer } from "./masterdata/department/sub_department.reducer";
import { stockReportReducer } from "./report/inventory/stock_report.reducer";
import { nilai_persediaanReportReducer } from "./report/inventory/nilai_persediaan_report.reducer";
import { laba_rugiReducer } from "./report/laba_rugi/laba_rugi_report.reducer";
import { adjustmentReducer } from "./adjustment/adjustment.reducer";
import { poReducer } from "./purchase/purchase_order/po.reducer";
import { receiveReducer } from "./purchase/receive/receive.reducer";
import { returReducer } from "./purchase/retur/retur.reducer";
import { siteReducer } from "./site.reducer";
import { dnReducer } from "./inventory/delivery_note/dn.reducer";
import { alokasiReducer } from "./inventory/alokasi/alokasi.reducer";
import { saleManualReducer } from "./sale/sale_manual.reducer";
import { saleReducer } from "./sale/sale.reducer";
import { salesOrderReducer } from "./sale/sales_order.reducer";
import { saleByGroupProductReducer } from "./sale/sale_by_group_product.reducer";
import { sale_by_custReducer } from "./sale/sale_by_cust.reducer";
import { sale_by_productReducer } from "./sale/sale_by_product.reducer";
import { mutationReducer } from "./inventory/mutation/mutation.reducer";
import { transactionReducer } from "./inventory/transaction/transaction.reducer";
import { closingReducer } from "./report/closing/closing.reducer";
import { opnameReducer } from "./inventory/opname/opname.reducer";
import { expedisiReducer } from "./inventory/expedisi/expedisi.reducer";
import { companyReducer } from "./setting/company/company.reducer";
import { hutangReducer } from "./hutang/hutang.reducer";
import { piutangReducer } from "./piutang/piutang.reducer";
import { mutasiJualBeliReducer } from "./inventory/mutasi_jual_beli/mutasi_jual_beli.reducer";
import { produksiReducer } from "./inventory/produksi/produksi.reducer";
import { packingReducer } from "./inventory/packing/packing.reducer";
import { log_trxReducer } from "./report/log/log.reducer";
import { log_actReducer } from "./report/log/log_act.reducer";
import { saleBySalesReducer } from "./sale/sale_by_sales.reducer";
import { saleOmsetReducer } from "./sale/sale_omset.reducer";
import { saleOmsetPeriodeReducer } from "./sale/sale_omset_periode.reducer";
import { printerReducer } from "./masterdata/printer/printer.reducer";
import { scanResiReducer } from "./sale/scan_resi.reducer";
import { scanResiLaporanReducer } from "./sale/scan_resi_laporan.reducer";

export default combineReducers({

  modalReducer,
  modalTypeReducer,
  dashboardReducer,
  companyReducer,
  userLevelReducer,
  userListReducer,
  locationCategoryReducer,
  locationReducer,
  cashReducer,
  bankReducer,
  promoReducer,
  productReducer,
  priceProductReducer,
  groupProductReducer,
  customerReducer,
  customerTypeReducer,
  departmentReducer,
  subDepartmentReducer,
  supplierReducer,
  areaReducer,
  mejaReducer,
  salesReducer,
  stockReportReducer,
  laba_rugiReducer,
  adjustmentReducer,
  poReducer,
  receiveReducer,
  returReducer,
  siteReducer,
  dnReducer,
  alokasiReducer,
  saleManualReducer,
  saleReducer,
  salesOrderReducer,
  saleByGroupProductReducer,
  sale_by_custReducer,
  sale_by_productReducer,
  mutationReducer,
  mutasiJualBeliReducer,
  closingReducer,
  hutangReducer,
  piutangReducer,
  opnameReducer,
  produksiReducer,
  transactionReducer,
  expedisiReducer,
  packingReducer,
  log_trxReducer,
  log_actReducer,
  saleBySalesReducer,
  saleOmsetReducer,
  saleOmsetPeriodeReducer,
  printerReducer,
  nilai_persediaanReportReducer,
  rakReducer,
  scanResiReducer,
  scanResiLaporanReducer,

  auth: authReducer,
  errors: errorsReducer,
});
