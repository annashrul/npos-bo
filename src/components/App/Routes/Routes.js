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
import Opname from "../inventory/opname";
import ListPosting from "../inventory/opname/list_posting";
import PoReport from '../report/inventory/po'
import ReceiveReport from '../report/inventory/receive'
import AlokasiReport from '../report/inventory/alokasi'
import DnReport from '../report/inventory/dn'
import OpnameReport from '../report/inventory/opname'
import ExpedisiReport from '../report/inventory/expedisi'
import MutationReport from '../report/inventory/mutation'
import TransactionReport from '../report/inventory/transaction'
import ProductionReport from '../report/inventory/production'
import Closing from '../report/inventory/closing'
import SaleArchive from '../report/sale/sale_archive'
import SaleByCustArchive from '../report/sale/sale_by_cust_archive'
import Sale from '../sale/product_sale'
import Company from "../setting/company";
import ReportCash from "../report/cash";
import ReportLabaRugi from "../report/laba_rugi";
import ReturTanpaNota from "../purchase/retur";
import BayarHutang from "../hutang/bayar_hutang";
import BayarPiutang from "../piutang/bayar_piutang";
import CetakBarcode from "../cetak_barcode";

const Routes = (
    <div>
        <Route path="/login" exact strict component={Login} />
        <Switch>
            <PrivateRoute path="/" exact strict component={Dashboard} />
            <PrivateRoute path="/cetak_barcode" exact strict component={CetakBarcode} />
            <PrivateRoute path="/company" exact strict component={Company} />
            <PrivateRoute path="/bank" exact strict component={Bank} />
            <PrivateRoute path="/promo" exact strict component={Promo} />
            <PrivateRoute path="/cash" exact strict component={Cash} />
            <PrivateRoute path="/customer" exact strict component={Customer} />
            <PrivateRoute path="/supplier" exact strict component={Supplier} />
            <PrivateRoute path="/sales" exact strict component={Sales} />
            <PrivateRoute path="/department" exact strict component={Department} />
            <PrivateRoute path="/user" exact strict component={User} />
            <PrivateRoute path="/location" exact strict component={Location} />
            <PrivateRoute path="/product" exact strict component={Product} />
            <PrivateRoute path="/adjustment" exact strict component={Adjustment} />
            <PrivateRoute path="/opname" exact strict component={Opname} />
            <PrivateRoute path="/approval_opname" exact strict component={ListPosting} />
            <PrivateRoute path="/receive" exact strict component={Receive} />
            <PrivateRoute path="/sale" exact strict component={Sale} />
            <PrivateRoute path="/purchase_order" exact strict component={PurchaseOrder} />
            <PrivateRoute path="/approval_mutasi" exact strict component={ApprovalMutasi} />
            <PrivateRoute path="/approval_mutasi_transaksi" exact strict component={ApprovalMutasiJualBeli} />
            <PrivateRoute path="/inventory_report" exact strict component={InventoryReport} />
            <PrivateRoute path="/delivery_note" exact strict component={DeliveyNote} />
            <PrivateRoute path="/alokasi" exact strict component={Alokasi} />
            <PrivateRoute path="/adjustment_report" exact strict component={AdjustmentReport} />
            <PrivateRoute path="/po_report" exact strict component={PoReport} />
            <PrivateRoute path="/receive_report" exact strict component={ReceiveReport} />
            <PrivateRoute path="/alokasi_report" exact strict component={AlokasiReport} />
            <PrivateRoute path="/report/dn_report" exact strict component={DnReport} />
            <PrivateRoute path="/report/opname_report" exact strict component={OpnameReport} />
            <PrivateRoute path="/report/expedisi_report" exact strict component={ExpedisiReport} />
            <PrivateRoute path="/report/mutation_report" exact strict component={MutationReport} />
            <PrivateRoute path="/report/alokasi_trx_report" exact strict component={TransactionReport} />
            <PrivateRoute path="/report/production_report" exact strict component={ProductionReport} />
            <PrivateRoute path="/closing" exact strict component={Closing} />
            <PrivateRoute path="/report_cash" exact strict component={ReportCash} />
            <PrivateRoute path="/report/laba_rugi_report" exact strict component={ReportLabaRugi} />
            <PrivateRoute path="/sale_archive" exact strict component={SaleArchive} />
            <PrivateRoute path="/sale_by_cust_archive" exact strict component={SaleByCustArchive} />
            <PrivateRoute path="/retur_tanpa_nota" exact strict component={ReturTanpaNota} />
            <PrivateRoute path="/bayar_hutang" exact strict component={BayarHutang} />
            <PrivateRoute path="/bayar_piutang" exact strict component={BayarPiutang} />
            <PrivateRoute path="/receive/:slug" exact strict component={Receive} />
        </Switch>
    </div>
)

export default Routes;