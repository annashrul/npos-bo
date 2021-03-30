import React, { Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import Preloader from '../../../Preloader';
import ErrorBoundary from '../../../ErrorBoundary'
import 'bootstrap-daterangepicker/daterangepicker.css';

const Login = React.lazy(() => import('../Auth/Login/Login'));
const Dashboard = React.lazy(() => import('../Dashboard/Dashboard'));
const Bank = React.lazy(() => import('../masterdata/bank'));
const Promo = React.lazy(() => import('../masterdata/promo'));
const Cash = React.lazy(() => import('../masterdata/cash'));
const User = React.lazy(() => import('../masterdata/user'));
const Location = React.lazy(() => import('../masterdata/location'));
const Product = React.lazy(() => import('../masterdata/product'));
const Customer = React.lazy(() => import('../masterdata/customer'));
const Supplier = React.lazy(() => import('../masterdata/supplier'));
const Sales = React.lazy(() => import('../masterdata/sales'));
const Department = React.lazy(() => import('../masterdata/department'));
const PrivateRoute = React.lazy(() => import('../common/PrivateRoute'));
const Adjustment = React.lazy(() => import('../inventory/adjusment'));
const PurchaseOrder = React.lazy(() => import('../purchase/purchaseorder'));
const Receive = React.lazy(() => import('../purchase/receive'));
const DeliveyNote = React.lazy(() => import('../inventory/delivery_note'));
const Alokasi = React.lazy(() => import('../inventory/alokasi'));
const InventoryReport = React.lazy(() => import('../report/inventory/stock'));
const AdjustmentReport = React.lazy(() => import('../report/inventory/adjustment'));
const ApprovalMutasi = React.lazy(() => import('../inventory/approval_mutasi'));
const ApprovalMutasiJualBeli = React.lazy(() => import('../inventory/mutasi_jual_beli/approval_mutasi_jual_beli'));
const BayarMutasiJualBeli = React.lazy(() => import('../inventory/mutasi_jual_beli/bayar_mutasi_jual_beli'));
const Opname = React.lazy(() => import('../inventory/opname'));
const ListPosting = React.lazy(() => import('../inventory/opname/list_posting'));
const PoReport = React.lazy(() => import('../report/inventory/po'));
const Produksi = React.lazy(() => import('../inventory/produksi'));
const Packing = React.lazy(() => import('../inventory/packing/trx_packing'));
const Expedisi = React.lazy(() => import('../inventory/expedisi'));
const ReceiveReport = React.lazy(() => import('../report/inventory/receive'));
const AlokasiReport = React.lazy(() => import('../report/inventory/alokasi'));
const DnReport = React.lazy(() => import('../report/inventory/dn'));
const OpnameReport = React.lazy(() => import('../report/inventory/opname'));
const ExpedisiReport = React.lazy(() => import('../report/inventory/expedisi'));
const PackingReport = React.lazy(() => import('../report/inventory/packing'));
const MutationReport = React.lazy(() => import('../report/inventory/mutation'));
const TransactionReport = React.lazy(() => import('../report/inventory/transaction'));
const ProductionReport = React.lazy(() => import('../report/inventory/production'));
const LogTrxReport = React.lazy(() => import('../report/log/log_trx'));
const LogActReport = React.lazy(() => import('../report/log/log_act'));
const Closing = React.lazy(() => import('../report/closing'));
const SaleArchive = React.lazy(() => import('../report/sale/sale_archive'));
const SaleByCustArchive = React.lazy(() => import('../report/sale/sale_by_cust_archive'));
const SaleByProductArchive = React.lazy(() => import('../report/sale/sale_by_product_archive'));
const SaleBySalesArchive = React.lazy(() => import('../report/sale/sale_by_sales_archive'));
const Sale = React.lazy(() => import('../sale/product_sale'));
const CashTrx = React.lazy(() => import('../sale/cash_trx'));
const Company = React.lazy(() => import('../setting/company'));
const ReportCash = React.lazy(() => import('../report/cash'));
const ReportLabaRugi = React.lazy(() => import('../report/laba_rugi'));
const HutangReport = React.lazy(() => import('../report/hutang'));
const PiutangReport = React.lazy(() => import('../report/piutang'));
const PurchaseBySupplierReport = React.lazy(() => import('../report/purchase/purchase_by_supplier'));
const ReturTanpaNota = React.lazy(() => import('../purchase/retur'));
const BayarHutang = React.lazy(() => import('../hutang/bayar_hutang'));
const BayarPiutang = React.lazy(() => import('../piutang/bayar_piutang'));
const CetakBarcode = React.lazy(() => import('../cetak_barcode'));
const NotFound = React.lazy(() => import('../common/notfound'));
const SaleReturReport = React.lazy(() => import('../report/sale/sale_retur_archive'));
const Area = React.lazy(() => import('../masterdata/area'));
const Meja = React.lazy(() => import('../masterdata/meja'));
const GlobalSetting = React.lazy(() => import('../setting/global_setting/global_setting'));
const Upload = React.lazy(() => import('../setting/upload/upload'));
const Print3ply = React.lazy(() => import('../print/penjualan3ply'));
const Adjust3ply = React.lazy(() => import('../print/adjust3ply'));
const Dn3ply = React.lazy(() => import('../print/dn3ply'));
const Alokasi3ply = React.lazy(() => import('../print/alokasi3ply'));
const Packing3ply = React.lazy(() => import('../print/packing3ply'));
const Expedisi3ply = React.lazy(() => import('../print/expedisi3ply'));
const BayarHutang3ply = React.lazy(() => import('../print/bayar_hutang3ply'));
const BayarPiutang3ply = React.lazy(() => import('../print/bayar_piutang3ply'));
const BayarMutasi3ply = React.lazy(() => import('../print/bayar_mutasi3ply'));
const Pembelian3ply = React.lazy(() => import('../print/pembelian3ply'));
const Retur3ply = React.lazy(() => import('../print/retur3ply'));
const Po3ply = React.lazy(() => import('../print/po3ply'));
const priceTagPrint = React.lazy(() => import('../print/priceTag'));

const Routes = (
    <div>
    <ErrorBoundary>
    <Suspense fallback={<Preloader/>}>
        <Switch>
            <Route path='/login' exact strict component={Login} />
            <Route path='/config' exact strict component={GlobalSetting} />
            <Route path='/print3ply/:id' exact strict component={Print3ply} />
            <Route path='/adjust3ply/:id' exact strict component={Adjust3ply} />
            <Route path='/dn3ply/:id' exact strict component={Dn3ply} />
            <Route path='/alokasi3ply/:id' exact strict component={Alokasi3ply} />
            <Route path='/packing3ply/:id' exact strict component={Packing3ply} />
            <Route path='/expedisi3ply' exact strict component={Expedisi3ply} />
            <Route path='/bayar_hutang3ply/:id' exact strict component={BayarHutang3ply} />
            <Route path='/bayar_piutang3ply/:id' exact strict component={BayarPiutang3ply} />
            <Route path='/bayar_mutasi3ply' exact strict component={BayarMutasi3ply} />
            <Route path='/pembelian3ply' exact strict component={Pembelian3ply} />
            <Route path='/retur3ply' exact strict component={Retur3ply} />
            <Route path='/po3ply' exact strict component={Po3ply} />
            <Route path='/priceTag' exact strict component={priceTagPrint} />
            {/* <Route path='/approvalAlokasi3ply' exact strict component={approvalAlokasi3ply} /> */}
            {/* DASHBOARD SECTION START */}
            <PrivateRoute path='/' exact strict component={Dashboard} />
            {/* DASHBOARD SECTION END */}

            {/* MASTERDATA SECTION START */}
            <PrivateRoute path='/bank' exact strict component={Bank} />
            <PrivateRoute path='/promo' exact strict component={Promo} />
            <PrivateRoute path='/cash' exact strict component={Cash} />
            <PrivateRoute path='/customer' exact strict component={Customer} />
            <PrivateRoute path='/supplier' exact strict component={Supplier} />
            <PrivateRoute path='/sales' exact strict component={Sales} />
            <PrivateRoute path='/department' exact strict component={Department} />
            <PrivateRoute path='/product' exact strict component={Product} />

            <PrivateRoute path='/area' exact strict component={Area} />
            <PrivateRoute path='/meja' exact strict component={Meja} />
            {/* MASTERDATA SECTION END */}

            {/* PRODUCTION SECTION START */}
            <PrivateRoute path='/production' exact strict component={Produksi} />
            {/* PRODUCTION SECTION END */}

            {/* INVENTORY SECTION START */}
            <PrivateRoute path='/adjustment' exact strict component={Adjustment} />
            <PrivateRoute path='/opname' exact strict component={Opname} />
            <PrivateRoute path='/approval_opname' exact strict component={ListPosting} />
            <PrivateRoute path='/approval_mutasi' exact strict component={ApprovalMutasi} />
            <PrivateRoute path='/delivery_note' exact strict component={DeliveyNote} />
            <PrivateRoute path='/alokasi' exact strict component={Alokasi} />
            <PrivateRoute path='/packing' exact strict component={Packing} />
            <PrivateRoute path='/expedisi' exact strict component={Expedisi} />
            <PrivateRoute path='/edit/alokasi/:id' exact strict component={Alokasi} />

            <PrivateRoute path='/approval_mutasi_jual_beli' exact strict component={ApprovalMutasiJualBeli} />
            <PrivateRoute path='/bayar_mutasi_jual_beli' exact strict component={BayarMutasiJualBeli} />
            {/* INVENTORY SECTION END */}

            {/* PEMBELIAN SECTION START */}
            <PrivateRoute path='/receive' exact strict component={Receive} />
            <PrivateRoute path='/purchase_order' exact strict component={PurchaseOrder} />
            <PrivateRoute path='/retur_tanpa_nota' exact strict component={ReturTanpaNota} />
            {/* PEMBELIAN SECTION END */}

            {/* TRANSAKSI SECTION START */}
            <PrivateRoute path='/sale' exact strict component={Sale} />
            <PrivateRoute path='/cash_trx' exact strict component={CashTrx} />
            {/* TRANSAKSI SECTION END */}

            {/* PEMBAYARAN SECTION START */}
            <PrivateRoute path='/bayar_hutang' exact strict component={BayarHutang} />
            <PrivateRoute path='/bayar_piutang' exact strict component={BayarPiutang} />
            {/* PEMBAYARAN SECTION END */}

            {/* REPORT SECTION START */}
            <PrivateRoute path='/report/inventory' exact strict component={InventoryReport} />
            <PrivateRoute path='/report/adjustment' exact strict component={AdjustmentReport} />
            <PrivateRoute path='/report/po' exact strict component={PoReport} />
            <PrivateRoute path='/report/receive' exact strict component={ReceiveReport} />
            <PrivateRoute path='/report/alokasi' exact strict component={AlokasiReport} />
            <PrivateRoute path='/report/dn' exact strict component={DnReport} />
            <PrivateRoute path='/report/opname' exact strict component={OpnameReport} />
            <PrivateRoute path='/report/packing' exact strict component={PackingReport} />
            <PrivateRoute path='/report/expedisi' exact strict component={ExpedisiReport} />
            <PrivateRoute path='/report/mutation' exact strict component={MutationReport} />
            <PrivateRoute path='/report/alokasi_trx' exact strict component={TransactionReport} />
            <PrivateRoute path='/report/production' exact strict component={ProductionReport} />
            <PrivateRoute path='/report/closing' exact strict component={Closing} />
            <PrivateRoute path='/report/cash' exact strict component={ReportCash} />
            <PrivateRoute path='/report/laba_rugi' exact strict component={ReportLabaRugi} />
            <PrivateRoute path='/report/hutang' exact strict component={HutangReport} />
            <PrivateRoute path='/report/piutang' exact strict component={PiutangReport} />
            <PrivateRoute path='/report/sale_archive' exact strict component={SaleArchive} />
            <PrivateRoute path='/report/sale_by_cust_archive' exact strict component={SaleByCustArchive} />
            <PrivateRoute path='/report/sale_by_product_archive' exact strict component={SaleByProductArchive} />
            <PrivateRoute path='/report/sale_by_sales_archive' exact strict component={SaleBySalesArchive} />
            <PrivateRoute path='/report/purchase_by_supplier' exact strict component={PurchaseBySupplierReport} />
            <PrivateRoute path='/report/sale_retur_archive' exact strict component={SaleReturReport} />
            <PrivateRoute path='/log/trx' exact strict component={LogTrxReport} />
            <PrivateRoute path='/log/act' exact strict component={LogActReport} />
            {/* REPORT SECTION END */}

            {/* SETTINGS SECTION START */}
            <PrivateRoute path='/company' exact strict component={Company} />
            <PrivateRoute path='/user' exact strict component={User} />
            <PrivateRoute path='/location' exact strict component={Location} />
            {/* SETTINGS SECTION END */}

            {/* OTHERS SECTION START */}
            <PrivateRoute path='/cetak_barcode' exact strict component={CetakBarcode} />
            <PrivateRoute path='/receive/:slug' exact strict component={Receive} />
            <PrivateRoute path='/upload' exact strict component={Upload} />
            {/* OTHERS SECTION END */}
            <Route component={NotFound}/>

        </Switch>
        </Suspense>
        </ErrorBoundary>
    </div>
)

export default Routes
