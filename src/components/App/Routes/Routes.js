import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Login from '../Auth/Login/Login';
import Dashboard from '../Dashboard/Dashboard';
import Bank from '../masterdata/bank';
import Promo from '../masterdata/promo';
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
import DeliveyNote from '../inventory/delivery_note'
import Alokasi from '../inventory/alokasi'
import InventoryReport from '../report/inventory/stock'
import AdjustmentReport from '../report/inventory/adjustment'
import ApprovalMutasi from "../inventory/approval_mutasi";
import ApprovalMutasiJualBeli from "../inventory/mutasi_jual_beli/approval_mutasi_jual_beli";
import BayarMutasiJualBeli from "../inventory/mutasi_jual_beli/bayar_mutasi_jual_beli";
import Opname from "../inventory/opname";
import ListPosting from "../inventory/opname/list_posting";
import PoReport from '../report/inventory/po'
import Produksi from '../inventory/produksi'
import Packing from '../inventory/packing/trx_packing'
import Expedisi from '../inventory/expedisi'
import ReceiveReport from '../report/inventory/receive'
import AlokasiReport from '../report/inventory/alokasi'
import DnReport from '../report/inventory/dn'
import OpnameReport from '../report/inventory/opname'
import ExpedisiReport from '../report/inventory/expedisi'
import PackingReport from '../report/inventory/packing'
import MutationReport from '../report/inventory/mutation'
import TransactionReport from '../report/inventory/transaction'
import ProductionReport from '../report/inventory/production'
import LogTrxReport from '../report/log/log_trx'
import LogActReport from '../report/log/log_act'
import Closing from '../report/inventory/closing'
import SaleArchive from '../report/sale/sale_archive'
import SaleByCustArchive from '../report/sale/sale_by_cust_archive'
import SaleByProductArchive from '../report/sale/sale_by_product_archive'
import Sale from '../sale/product_sale'
import CashTrx from '../sale/cash_trx'
import Company from "../setting/company";
import ReportCash from "../report/cash";
import ReportLabaRugi from "../report/laba_rugi";
import HutangReport from "../report/hutang";
import PiutangReport from "../report/piutang";
import PurchaseBySupplierReport from "../report/purchase/purchase_by_supplier";
import ReturTanpaNota from "../purchase/retur";
import BayarHutang from "../hutang/bayar_hutang";
import BayarPiutang from "../piutang/bayar_piutang";
import CetakBarcode from "../cetak_barcode";
import NotFound from "../common/notfound";
import SaleReturReport from "../report/sale/sale_retur_archive";
import Area from '../masterdata/area';
import Meja from '../masterdata/meja';
import GlobalSetting from "../setting/global_setting/global_setting";
import Upload from "../setting/upload/upload";
import Print3ply from "../print/penjualan3ply";
import Adjust3ply from "../print/adjust3ply";
import Dn3ply from "../print/dn3ply";
import Alokasi3ply from "../print/alokasi3ply";
import Packing3ply from "../print/packing3ply";
import Expedisi3ply from "../print/expedisi3ply";
import BayarHutang3ply from "../print/bayar_hutang3ply";
import BayarPiutang3ply from "../print/bayar_piutang3ply";
import Pembelian3ply from "../print/pembelian3ply";
import Retur3ply from "../print/retur3ply";
import Po3ply from "../print/po3ply";
import priceTagPrint from "../print/priceTag";

const Routes = (
    <div>
        <Switch>
            <Route path="/login" exact strict component={Login} />
            <Route path="/config" exact strict component={GlobalSetting} />
            <Route path="/print3ply/:id" exact strict component={Print3ply} />
            <Route path="/adjust3ply/:id" exact strict component={Adjust3ply} />
            <Route path="/dn3ply/:id" exact strict component={Dn3ply} />
            <Route path="/alokasi3ply/:id" exact strict component={Alokasi3ply} />
            <Route path="/packing3ply/:id" exact strict component={Packing3ply} />
            <Route path="/expedisi3ply" exact strict component={Expedisi3ply} />
            <Route path="/bayar_hutang3ply/:id" exact strict component={BayarHutang3ply} />
            <Route path="/bayar_piutang3ply/:id" exact strict component={BayarPiutang3ply} />
            <Route path="/pembelian3ply" exact strict component={Pembelian3ply} />
            <Route path="/retur3ply" exact strict component={Retur3ply} />
            <Route path="/po3ply" exact strict component={Po3ply} />
            <Route path="/priceTag" exact strict component={priceTagPrint} />
            {/* DASHBOARD SECTION START */}
            <PrivateRoute path="/" exact strict component={Dashboard} />
            {/* DASHBOARD SECTION END */}

            {/* MASTERDATA SECTION START */}
            <PrivateRoute path="/bank" exact strict component={Bank} />
            <PrivateRoute path="/promo" exact strict component={Promo} />
            <PrivateRoute path="/cash" exact strict component={Cash} />
            <PrivateRoute path="/customer" exact strict component={Customer} />
            <PrivateRoute path="/supplier" exact strict component={Supplier} />
            <PrivateRoute path="/sales" exact strict component={Sales} />
            <PrivateRoute path="/department" exact strict component={Department} />
            <PrivateRoute path="/product" exact strict component={Product} />

            <PrivateRoute path="/area" exact strict component={Area} />
            <PrivateRoute path="/meja" exact strict component={Meja} />
            {/* MASTERDATA SECTION END */}

            {/* PRODUCTION SECTION START */}
            <PrivateRoute path="/production" exact strict component={Produksi} />
            {/* PRODUCTION SECTION END */}

            {/* INVENTORY SECTION START */}
            <PrivateRoute path="/adjustment" exact strict component={Adjustment} />
            <PrivateRoute path="/opname" exact strict component={Opname} />
            <PrivateRoute path="/approval_opname" exact strict component={ListPosting} />
            <PrivateRoute path="/approval_mutasi" exact strict component={ApprovalMutasi} />
            <PrivateRoute path="/delivery_note" exact strict component={DeliveyNote} />
            <PrivateRoute path="/alokasi" exact strict component={Alokasi} />
            <PrivateRoute path="/packing" exact strict component={Packing} />
            <PrivateRoute path="/expedisi" exact strict component={Expedisi} />
            <PrivateRoute path="/edit/alokasi/:id" exact strict component={Alokasi} />

            <PrivateRoute path="/approval_mutasi_jual_beli" exact strict component={ApprovalMutasiJualBeli} />
            <PrivateRoute path="/bayar_mutasi_jual_beli" exact strict component={BayarMutasiJualBeli} />
            {/* INVENTORY SECTION END */}

            {/* PEMBELIAN SECTION START */}
            <PrivateRoute path="/receive" exact strict component={Receive} />
            <PrivateRoute path="/purchase_order" exact strict component={PurchaseOrder} />
            <PrivateRoute path="/retur_tanpa_nota" exact strict component={ReturTanpaNota} />
            {/* PEMBELIAN SECTION END */}

            {/* TRANSAKSI SECTION START */}
            <PrivateRoute path="/sale" exact strict component={Sale} />
            <PrivateRoute path="/cash_trx" exact strict component={CashTrx} />
            {/* TRANSAKSI SECTION END */}

            {/* PEMBAYARAN SECTION START */}
            <PrivateRoute path="/bayar_hutang" exact strict component={BayarHutang} />
            <PrivateRoute path="/bayar_piutang" exact strict component={BayarPiutang} />
            {/* PEMBAYARAN SECTION END */}

            {/* REPORT SECTION START */}
            <PrivateRoute path="/report/inventory" exact strict component={InventoryReport} />
            <PrivateRoute path="/report/adjustment" exact strict component={AdjustmentReport} />
            <PrivateRoute path="/report/po" exact strict component={PoReport} />
            <PrivateRoute path="/report/receive" exact strict component={ReceiveReport} />
            <PrivateRoute path="/report/alokasi" exact strict component={AlokasiReport} />
            <PrivateRoute path="/report/dn" exact strict component={DnReport} />
            <PrivateRoute path="/report/opname" exact strict component={OpnameReport} />
            <PrivateRoute path="/report/packing" exact strict component={PackingReport} />
            <PrivateRoute path="/report/expedisi" exact strict component={ExpedisiReport} />
            <PrivateRoute path="/report/mutation" exact strict component={MutationReport} />
            <PrivateRoute path="/report/alokasi_trx" exact strict component={TransactionReport} />
            <PrivateRoute path="/report/production" exact strict component={ProductionReport} />
            <PrivateRoute path="/report/closing" exact strict component={Closing} />
            <PrivateRoute path="/report/cash" exact strict component={ReportCash} />
            <PrivateRoute path="/report/laba_rugi" exact strict component={ReportLabaRugi} />
            <PrivateRoute path="/report/hutang" exact strict component={HutangReport} />
            <PrivateRoute path="/report/piutang" exact strict component={PiutangReport} />
            <PrivateRoute path="/report/sale_archive" exact strict component={SaleArchive} />
            <PrivateRoute path="/report/sale_by_cust_archive" exact strict component={SaleByCustArchive} />
            <PrivateRoute path="/report/sale_by_product_archive" exact strict component={SaleByProductArchive} />
            <PrivateRoute path="/report/purchase_by_supplier" exact strict component={PurchaseBySupplierReport} />
            <PrivateRoute path="/report/sale_retur_archive" exact strict component={SaleReturReport} />
            <PrivateRoute path="/log/trx" exact strict component={LogTrxReport} />
            <PrivateRoute path="/log/act" exact strict component={LogActReport} />
            {/* REPORT SECTION END */}

            {/* SETTINGS SECTION START */}
            <PrivateRoute path="/company" exact strict component={Company} />
            <PrivateRoute path="/user" exact strict component={User} />
            <PrivateRoute path="/location" exact strict component={Location} />
            {/* SETTINGS SECTION END */}

            {/* OTHERS SECTION START */}
            <PrivateRoute path="/cetak_barcode" exact strict component={CetakBarcode} />
            <PrivateRoute path="/receive/:slug" exact strict component={Receive} />
            <PrivateRoute path="/upload" exact strict component={Upload} />
            {/* OTHERS SECTION END */}
            <Route component={NotFound}/>

        </Switch>
    </div>
)

export default Routes;