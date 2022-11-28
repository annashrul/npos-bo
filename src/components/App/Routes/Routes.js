import React from "react";
import { Route, Switch } from "react-router-dom";

import PrivateRoute from "../common/PrivateRoute";
import Login from "../Auth/Login/Login";
import Dashboard from "../Dashboard/Dashboard";

import MasterdataBarang from "../masterdata/product";
import MasterdataBank from "../masterdata/bank";
import MasterdataRak from "../masterdata/rak";
import MasterdataPromo from "../masterdata/promo";
import MasterdataKas from "../masterdata/cash";

import MasterdataCustomer from "../masterdata/customer";
import MasterdataSupplier from "../masterdata/supplier";
import MasterdataSales from "../masterdata/sales";
import MasterdataPrinter from "../masterdata/printer";
import MasterdataDepartment from "../masterdata/department";
import MasterdataArea from "../masterdata/area";
import MasterdataMeja from "../masterdata/meja";
import MasterdataPaket from "../masterdata/paket";

import PengaturanPengguna from "../masterdata/user";
import PengaturanLokasi from "../masterdata/location";
import PengaturanUmum from "../setting/company";

import TransaksiProduksi from "../inventory/produksi";

import TransaksiAdjustment from "../inventory/adjusment";
import TransaksiDeliveyNote from "../inventory/delivery_note";
import TransaksiAlokasi from "../inventory/alokasi";
import TransaksiApprovalMutasi from "../inventory/approval_mutasi";
import TransaksiOpname from "../inventory/opname";
import TransaksiApprovalOpname from "../inventory/opname/list_posting";
import TransaksiPacking from "../inventory/packing/trx_packing";
import TransaksiExpedisi from "../inventory/expedisi";
import TransaksiApprovalMutasiJualBeli from "../inventory/mutasi_jual_beli/approval_mutasi_jual_beli";
import TransaksiBayarMutasiJualBeli from "../inventory/mutasi_jual_beli/bayar_mutasi_jual_beli";

import TransaksiPurchaseOrder from "../purchase/purchaseorder";
import TransaksiReceive from "../purchase/receive";
import TransaksiReturTanpaNota from "../purchase/retur";

import InventoryReport from "../report/inventory/stock";
import AdjustmentReport from "../report/inventory/adjustment";

import PoReport from "../report/inventory/po";

import ReceiveReport from "../report/inventory/receive";
import AlokasiReport from "../report/inventory/alokasi";
import DnReport from "../report/inventory/dn";
import OpnameReport from "../report/inventory/opname";
import NilaiPersediaanReport from "../report/inventory/nilai_persediaan";
import ExpedisiReport from "../report/inventory/expedisi";
import PackingReport from "../report/inventory/packing";
import MutationReport from "../report/inventory/mutation";
import TransactionReport from "../report/inventory/transaction";
import ProductionReport from "../report/inventory/production";
import LogTrxReport from "../report/log/log_trx";
import LogActReport from "../report/log/log_act";
import Closing from "../report/closing";
import SaleArchive from "../report/sale/sale_archive";
import SaleByCustArchive from "../report/sale/sale_by_cust_archive";
import SaleByProductArchive from "../report/sale/sale_by_product_archive";
import SaleBySalesArchive from "../report/sale/sale_by_sales_archive";
import SaleOmsetArchive from "../report/sale/sale_omset_archive";
import SaleOmsetPeriodeArchive from "../report/sale/sale_omset_periode_archive";
import CreateSO from "../sale/sales_order/create";
import ApproveSO from "../sale/sales_order/approve";
import ScanResi from "../sale/scan_resi/create";
import ScanResiLaporan from "../sale/scan_resi/report";
import Sale from "../sale/product_sale";
import CashTrx from "../sale/cash_trx";
import TransaksiManual from "../sale/penjualan_manual";
import ReportCash from "../report/cash";
import ReportLabaRugi from "../report/laba_rugi";
import HutangReport from "../report/hutang";
import PiutangReport from "../report/piutang";
import PurchaseBySupplierReport from "../report/purchase/purchase_by_supplier";
import ReturPembelianReport from "../report/purchase/retur_pembelian";
import BayarHutang from "../hutang/bayar_hutang";
import BayarPiutang from "../piutang/bayar_piutang";
import CetakBarcode from "../cetak_barcode";
import NotFound from "../common/notfound";
import SaleReturReport from "../report/sale/sale_retur_archive";
import GlobalSetting from "../setting/global_setting/global_setting";
import Upload from "../setting/upload/upload";
import Print3ply from "../print/penjualan3ply";
import Adjust3ply from "../print/adjust3ply";
import Dn3ply from "../print/dn3ply";
import Po3plyId from "../print/po3plyId";
import Alokasi3ply from "../print/alokasi3ply";
import Packing3ply from "../print/packing3ply";
import Expedisi3ply from "../print/expedisi3ply";
import BayarHutang3ply from "../print/bayar_hutang3ply";
import BayarPiutang3ply from "../print/bayar_piutang3ply";
import BayarMutasi3ply from "../print/bayar_mutasi3ply";
import Pembelian3ply from "../print/pembelian3ply";
import Pembelian3plyId from "../print/pembelian3plyId";
import Retur3ply from "../print/retur3ply";
import Po3ply from "../print/po3ply";
import Receive3plyId from "../print/receive3plyId";
import priceTagPrint from "../print/priceTag";
import SaleByGroupProduct from "../report/sale/sale_by_group_product";
import {
  linkAdjustment,
  linkAlokasi,
  linkAlokasiEdit,
  linkApprovalMutasi,
  linkArea,
  linkBank,
  linkBarang,
  linkCetakBarcode,
  linkCustomer,
  linkDeliveryNote,
  linkDepartment,
  linkKas,
  linkMeja,
  linkMutasiJualBeliApproval,
  linkMutasiJualBeliBayar,
  linkOpnameApproval,
  linkOpnameTransaksi,
  linkPaket,
  linkPembayaranHutang,
  linkPembayaranPiutang,
  linkPengaturanLokasi,
  linkPengaturanPengguna,
  linkPengaturanUmum,
  linkPengirimanExpedisi,
  linkPengirimanPacking,
  linkPrinter,
  linkProduksi,
  linkPromo,
  linkPurchaseOrder,
  linkRak,
  linkReceivePembelian,
  linkReportAdjustment,
  linkReportAlokasi,
  linkReportAlokasi3ply,
  linkReportAlokasiTransaksi,
  linkReportArsipPenjualan,
  linkReportArsipPenjualanByBarang,
  linkReportArsipPenjualanByCustomer,
  linkReportArsipPenjualanByKelompokBarang,
  linkReportArsipPenjualanBySales,
  linkReportArsipReturPenjualan,
  linkReportClosing,
  linkReportDeliveryNote,
  linkReportExpedisi,
  linkReportHutang,
  linkReportKas,
  linkReportLabaRugi,
  linkReportLogAktifitas,
  linkReportLogTransaksi,
  linkReportMutasi,
  linkReportNilaiPersediaan,
  linkReportOmsetPenjualan,
  linkReportOmsetPenjualanByPeriode,
  linkReportOpname,
  linkReportPacking,
  linkReportPembelianBySupplier,
  linkReportPiutang,
  linkReportProduksi,
  linkReportPurchaseOrder,
  linkReportReceive,
  linkReportReturPembelian,
  linkReportStock,
  linkReturTanpaNota,
  linkSales,
  linkSupplier,
  linkTransaksiApprovalSalesOrder,
  linkTransaksiBarang,
  linkTransaksiKas,
  linkTransaksiSalesOrder,
  linkTransaksiManual,
  linkScanResi,
  linkScanResiLaporan,
} from "../../../helperLink";
// import approvalAlokasi3ply from "../print/approvalAlokasi3ply";

const Routes = (
  <div>
    <Switch>
      <Route path="/login" exact strict component={Login} />
      <Route path="/config" exact strict component={GlobalSetting} />
      <Route
        path={`${linkReportArsipPenjualan}/nota3ply/:id`}
        exact
        strict
        component={Print3ply}
      />
      <Route path="/adjust3ply/:id" exact strict component={Adjust3ply} />
      <Route path="/dn3ply/:id" exact strict component={Dn3ply} />
      <Route path="/po3plyId/:id" exact strict component={Po3plyId} />
      <Route
        path="/pembelian3plyId/:id"
        exact
        strict
        component={Pembelian3plyId}
      />
      <Route
        path={`${linkReportAlokasi3ply}:id`}
        exact
        strict
        component={Alokasi3ply}
      />
      <Route path="/packing3ply/:id" exact strict component={Packing3ply} />
      <Route path="/packing3ply/:id" exact strict component={Packing3ply} />
      <Route path="/receive3plyId/:id" exact strict component={Receive3plyId} />
      <Route path="/expedisi3ply" exact strict component={Expedisi3ply} />
      <Route
        path="/bayar_hutang3ply/:id"
        exact
        strict
        component={BayarHutang3ply}
      />
      <Route
        path="/bayar_piutang3ply/:id"
        exact
        strict
        component={BayarPiutang3ply}
      />
      <Route
        path="/bayar_mutasi3ply"
        exact
        strict
        component={BayarMutasi3ply}
      />
      <Route path="/pembelian3ply" exact strict component={Pembelian3ply} />
      <Route path="/retur3ply" exact strict component={Retur3ply} />
      <Route path="/po3ply" exact strict component={Po3ply} />
      <Route path="/priceTag" exact strict component={priceTagPrint} />
      {/* <Route path="/approvalAlokasi3ply" exact strict component={approvalAlokasi3ply} /> */}
      {/* DASHBOARD SECTION START */}
      <PrivateRoute path="/" exact strict component={Dashboard} />
      {/* DASHBOARD SECTION END */}

      {/* MASTERDATA SECTION START */}
      <PrivateRoute
        path={`${linkBarang}`}
        exact
        strict
        component={MasterdataBarang}
      />
      <PrivateRoute
        path={linkDepartment}
        exact
        strict
        component={MasterdataDepartment}
      />
      <PrivateRoute
        path={linkSupplier}
        exact
        strict
        component={MasterdataSupplier}
      />
      <PrivateRoute
        path={linkCustomer}
        exact
        strict
        component={MasterdataCustomer}
      />
      <PrivateRoute path={linkKas} exact strict component={MasterdataKas} />
      <PrivateRoute path={linkSales} exact strict component={MasterdataSales} />
      <PrivateRoute path={linkBank} exact strict component={MasterdataBank} />
      <PrivateRoute path={linkPromo} exact strict component={MasterdataPromo} />
      <PrivateRoute
        path={linkPrinter}
        exact
        strict
        component={MasterdataPrinter}
      />
      <PrivateRoute path={linkPaket} exact strict component={MasterdataPaket} />
      <PrivateRoute path={linkRak} exact strict component={MasterdataRak} />
      <PrivateRoute path={linkArea} exact strict component={MasterdataArea} />
      <PrivateRoute path={linkMeja} exact strict component={MasterdataMeja} />
      {/* MASTERDATA SECTION END */}

      {/* PRODUCTION SECTION START */}
      <PrivateRoute
        path={linkProduksi}
        exact
        strict
        component={TransaksiProduksi}
      />
      {/* PRODUCTION SECTION END */}

      {/* INVENTORY SECTION START */}
      <PrivateRoute
        path={linkAdjustment}
        exact
        strict
        component={TransaksiAdjustment}
      />
      <PrivateRoute
        path={linkOpnameTransaksi}
        exact
        strict
        component={TransaksiOpname}
      />
      <PrivateRoute
        path={linkOpnameApproval}
        exact
        strict
        component={TransaksiApprovalOpname}
      />
      <PrivateRoute
        path={linkApprovalMutasi}
        exact
        strict
        component={TransaksiApprovalMutasi}
      />
      <PrivateRoute
        path={linkDeliveryNote}
        exact
        strict
        component={TransaksiDeliveyNote}
      />
      <PrivateRoute
        path={linkAlokasi}
        exact
        strict
        component={TransaksiAlokasi}
      />
      <PrivateRoute
        path={linkPengirimanPacking}
        exact
        strict
        component={TransaksiPacking}
      />
      <PrivateRoute
        path={linkPengirimanExpedisi}
        exact
        strict
        component={TransaksiExpedisi}
      />
      <PrivateRoute
        path={linkMutasiJualBeliApproval}
        exact
        strict
        component={TransaksiApprovalMutasiJualBeli}
      />
      <PrivateRoute
        path={linkMutasiJualBeliBayar}
        exact
        strict
        component={TransaksiBayarMutasiJualBeli}
      />
      <PrivateRoute
        path={`${linkAlokasi}/:id`}
        exact
        strict
        component={TransaksiAlokasi}
      />
      {/* INVENTORY SECTION END */}
      {/* PEMBELIAN SECTION START */}
      <PrivateRoute
        path={linkReceivePembelian}
        exact
        strict
        component={TransaksiReceive}
      />
      <PrivateRoute
        path={linkPurchaseOrder}
        exact
        strict
        component={TransaksiPurchaseOrder}
      />
      <PrivateRoute
        path={linkReturTanpaNota}
        exact
        strict
        component={TransaksiReturTanpaNota}
      />
      {/* PEMBELIAN SECTION END */}

      {/* TRANSAKSI SECTION START */}
      <PrivateRoute
        path={`${linkTransaksiManual}`}
        exact
        strict
        component={TransaksiManual}
      />
      <PrivateRoute
        path={linkTransaksiSalesOrder}
        exact
        strict
        component={CreateSO}
      />
      <PrivateRoute
        path={linkTransaksiApprovalSalesOrder}
        exact
        strict
        component={ApproveSO}
      />
      <PrivateRoute path={linkTransaksiBarang} exact strict component={Sale} />
      <PrivateRoute path={linkTransaksiKas} exact strict component={CashTrx} />

      <PrivateRoute path={linkScanResi} exact strict component={ScanResi} />

      <PrivateRoute
        path={linkScanResiLaporan}
        exact
        strict
        component={ScanResiLaporan}
      />
      <PrivateRoute
        path={`${linkTransaksiManual}/:slug`}
        exact
        strict
        component={TransaksiManual}
      />

      {/* TRANSAKSI SECTION END */}
      {/* PEMBAYARAN SECTION START */}
      <PrivateRoute
        path={linkPembayaranHutang}
        exact
        strict
        component={BayarHutang}
      />
      <PrivateRoute
        path={linkPembayaranPiutang}
        exact
        strict
        component={BayarPiutang}
      />
      {/* PEMBAYARAN SECTION END */}

      {/* REPORT SECTION START */}
      <PrivateRoute path={linkReportClosing} exact strict component={Closing} />
      <PrivateRoute path={linkReportKas} exact strict component={ReportCash} />
      <PrivateRoute
        path={linkReportLabaRugi}
        exact
        strict
        component={ReportLabaRugi}
      />
      <PrivateRoute
        path={linkReportProduksi}
        exact
        strict
        component={ProductionReport}
      />

      <PrivateRoute
        path={linkReportArsipPenjualan}
        exact
        strict
        component={SaleArchive}
      />
      <PrivateRoute
        path={linkReportArsipReturPenjualan}
        exact
        strict
        component={SaleReturReport}
      />
      <PrivateRoute
        path={linkReportArsipPenjualanByCustomer}
        exact
        strict
        component={SaleByCustArchive}
      />
      <PrivateRoute
        path={linkReportArsipPenjualanBySales}
        exact
        strict
        component={SaleBySalesArchive}
      />
      <PrivateRoute
        path={linkReportArsipPenjualanByBarang}
        exact
        strict
        component={SaleByProductArchive}
      />
      <PrivateRoute
        path={linkReportArsipPenjualanByKelompokBarang}
        exact
        strict
        component={SaleByGroupProduct}
      />
      <PrivateRoute
        path={linkReportOmsetPenjualan}
        exact
        strict
        component={SaleOmsetArchive}
      />
      <PrivateRoute
        path={linkReportOmsetPenjualanByPeriode}
        exact
        strict
        component={SaleOmsetPeriodeArchive}
      />

      <PrivateRoute
        path={linkReportStock}
        exact
        strict
        component={InventoryReport}
      />
      <PrivateRoute
        path={linkReportNilaiPersediaan}
        exact
        strict
        component={NilaiPersediaanReport}
      />
      <PrivateRoute
        path={linkReportAdjustment}
        exact
        strict
        component={AdjustmentReport}
      />
      <PrivateRoute
        path={linkReportAlokasi}
        exact
        strict
        component={AlokasiReport}
      />
      <PrivateRoute
        path={linkReportDeliveryNote}
        exact
        strict
        component={DnReport}
      />
      <PrivateRoute
        path={linkReportOpname}
        exact
        strict
        component={OpnameReport}
      />
      <PrivateRoute
        path={linkReportMutasi}
        exact
        strict
        component={MutationReport}
      />
      <PrivateRoute
        path={linkReportAlokasiTransaksi}
        exact
        strict
        component={TransactionReport}
      />
      <PrivateRoute
        path={linkReportPacking}
        exact
        strict
        component={PackingReport}
      />
      <PrivateRoute
        path={linkReportExpedisi}
        exact
        strict
        component={ExpedisiReport}
      />

      <PrivateRoute
        path={linkReportPurchaseOrder}
        exact
        strict
        component={PoReport}
      />
      <PrivateRoute
        path={linkReportReceive}
        exact
        strict
        component={ReceiveReport}
      />
      <PrivateRoute
        path={linkReportPembelianBySupplier}
        exact
        strict
        component={PurchaseBySupplierReport}
      />
      <PrivateRoute
        path={linkReportReturPembelian}
        exact
        strict
        component={ReturPembelianReport}
      />

      <PrivateRoute
        path={linkReportHutang}
        exact
        strict
        component={HutangReport}
      />
      <PrivateRoute
        path={linkReportPiutang}
        exact
        strict
        component={PiutangReport}
      />

      <PrivateRoute
        path={linkReportLogTransaksi}
        exact
        strict
        component={LogTrxReport}
      />
      <PrivateRoute
        path={linkReportLogAktifitas}
        exact
        strict
        component={LogActReport}
      />
      {/* REPORT SECTION END */}

      {/* SETTINGS SECTION START */}
      <PrivateRoute
        path={linkPengaturanUmum}
        exact
        strict
        component={PengaturanUmum}
      />
      <PrivateRoute
        path={linkPengaturanPengguna}
        exact
        strict
        component={PengaturanPengguna}
      />
      <PrivateRoute
        path={linkPengaturanLokasi}
        exact
        strict
        component={PengaturanLokasi}
      />
      {/* SETTINGS SECTION END */}

      {/* OTHERS SECTION START */}
      <PrivateRoute
        path={linkCetakBarcode}
        exact
        strict
        component={CetakBarcode}
      />
      <PrivateRoute
        path={`${linkReceivePembelian}/:slug`}
        exact
        strict
        component={TransaksiReceive}
      />
      <PrivateRoute
        path={`${linkTransaksiBarang}/:slug`}
        exact
        strict
        component={Sale}
      />
      <PrivateRoute
        path={`${linkTransaksiManual}/:slug`}
        exact
        strict
        component={TransaksiManual}
      />

      <PrivateRoute path="/upload" exact strict component={Upload} />
      {/* OTHERS SECTION END */}
      <Route component={NotFound} />
    </Switch>
  </div>
);

export default Routes;
