import React, { Component } from "react";
import {
  store,
  get,
  update,
  destroy,
  cekData,
  del,
} from "components/model/app.model";
import connect from "react-redux/es/connect/connect";
import Layout from "components/App/Layout";
import Swal from "sweetalert2";
import moment from "moment";
import { FetchCustomerAll } from "redux/actions/masterdata/customer/customer.action";
import { FetchSalesAll } from "redux/actions/masterdata/sales/sales.action";
import { FetchProductSale } from "redux/actions/masterdata/product/product.action";
import StickyBox from "react-sticky-box";
import FormSale from "../../modals/sale/form_sale";
import FormClosing from "../../modals/sale/form_closing";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import {
  FetchNotaSale,
  FetchReportDetailSale,
  getEditTrx,
} from "redux/actions/sale/sale.action";
import { toCurrency, rmComma } from "helper";
import Spinner from "Spinner";
import Cookies from "js-cookie";
import LokasiCommon from "../../common/LokasiCommon";
import SelectCommon from "../../common/SelectCommon";
import {
  getStorage,
  handleDataSelect,
  isEmptyOrUndefined,
  noData,
  rmStorage,
  setStorage,
  swal,
  swallOption,
} from "../../../../helper";
import { handleInputOnBlurCommon } from "../../common/FlowTrxCommon";
import FormHoldBill from "../../modals/sale/form_hold_bill";
import ListHoldBill from "../../modals/sale/list_hold_bill";
import KeyHandler, { KEYPRESS } from "react-key-handler";
import TableCommon from "../../common/TableCommon";
import {
  getDetailSoAction,
  getSoAction,
} from "../../../../redux/actions/sale/sales_order.action";

const table = "sale";
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

class Sale extends Component {
  constructor(props) {
    super(props);
    console.log("slug edit", this.props.match.params.slug);
    this.state = {
      isOpenPrice: false,
      addingItemName: "",
      databrg: [],
      brgval: [],
      tgl_order: moment(new Date()).format("yyyy-MM-DD"),
      tgl_kirim: moment(new Date()).format("yyyy-MM-DD"),
      harga_beli: 0,
      diskon: 0,
      ppn: 0,
      qty: 0,
      location: "",
      sales: "1",
      customer: "1000001",
      customer_data: [
        {
          value: "1000001",
          label: "UMUM",
        },
      ],
      nama_penerima: "",
      no_telepon_penerima: "",
      alamat_penerima: "",
      nama_pengirim: "",
      no_telepon_pengirim: "",
      alamat_pengirim: "",
      so: "",
      so_data: [],
      catatan: "",
      jenis_trx: "Tunai",
      userid: 0,
      searchby: 3,
      search: "",
      subtotal: 0,
      discount_persen: 0,
      discount_harga: 0,
      pajak: 0,
      ppn_harga: 0,
      perpage: 5,
      scrollPage: 0,
      isScroll: false,
      isClick: 0,
      toggleSide: false,
      detail: [],
      master: {},
      dataHoldBill: [],
      idHoldBill: "",
      objectHoldBill: {},
      opSales: [
        {
          value: "1",
          label: "UMUM",
        },
      ],

      modalClosing: false,
      modalHoldBill: false,
      modalListHoldBill: false,
      isModalForm: false,
      idxQty: 0,
      isSo: false,
    };
    this.HandleRemove = this.HandleRemove.bind(this);
    this.HandleAddBrg = this.HandleAddBrg.bind(this);
    this.HandleOnBlur = this.HandleOnBlur.bind(this);
    this.HandleChangeInputValue = this.HandleChangeInputValue.bind(this);
    this.HandleChangeTambahan = this.HandleChangeTambahan.bind(this);
    this.HandleChangeSelect = this.HandleChangeSelect.bind(this);
    this.setTglOrder = this.setTglOrder.bind(this);
    this.HandleReset = this.HandleReset.bind(this);
    this.HandleSearch = this.HandleSearch.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleChecked = this.handleChecked.bind(this);
    this.handleClickToggle = this.handleClickToggle.bind(this);
    this.handleClosing = this.handleClosing.bind(this);
    this.HandleFocusInputReset = this.HandleFocusInputReset.bind(this);
    this.handleHoldBill = this.handleHoldBill.bind(this);
    this.fetchDataEdit = this.fetchDataEdit.bind(this);
    this.handleChangeIsSo = this.handleChangeIsSo.bind(this);
  }

  handleClickToggle(e) {
    e.preventDefault();
    this.setState({
      toggleSide: !this.state.toggleSide,
    });
  }
  HandleChangeTambahan(e, i) {
    const col = e.target.name;
    let val = e.target.value;
    if (i !== null) {
      let data = this.state.data;
      if (col === "harga") {
        val = rmComma(val);
      }
      data[i][col] = val;
      this.setState({ data });
    } else {
      this.setState({ [col]: val });
    }
  }

  fetchByLocation(val) {
    this.props.dispatch(FetchNotaSale(val));
    this.props.dispatch(FetchCustomerAll(val));
    this.props.dispatch(FetchSalesAll(val));
  }
  fetchProduct(val = "") {
    let customer = getStorage("customer_tr");
    let location = getStorage("location_tr");
    let sales = getStorage("sales_tr");
    let where = `perpage=5`;
    let setState = {};
    if (isEmptyOrUndefined(customer)) {
      Object.assign(setState, { customer: customer });
      where += `&customer=${customer}`;
    }
    if (isEmptyOrUndefined(location)) {
      this.fetchByLocation(location);
      Object.assign(setState, { location: location });
      where += `&lokasi=${location}`;
    }
    if (isEmptyOrUndefined(sales)) {
      Object.assign(setState, { sales: sales });
      where += `&sales=${sales}`;
    }
    this.setState(setState);
    if (location !== null) {
      if (val !== "sales" || customer !== "1000001") {
        this.props.dispatch(
          FetchProductSale(1, where, "sale", this.autoSetQty)
        );
      }
    }
  }

  fetchDataEdit(props) {
    if (typeof props === "object") {
      console.log("state barangf", props.detail);
      destroy(table);

      let master = props.master;
      if (master !== undefined) {
        console.log(master);
        setStorage("customer_tr", master.kd_cust);
        setStorage("location_tr", master.lokasi);
        this.setState({
          nama_penerima: master.nama_penerima,
          no_telepon_penerima: master.no_telepon_penerima,
          alamat_penerima: master.alamat_penerima,
          nama_pengirim: master.nama_pengirim,
          no_telepon_pengirim: master.no_telepon_pengirim,
          alamat_pengirim: master.alamat_pengirim,
          location: master.lokasi,
          customer: master.kd_cust,
          sales: master.kd_sales,
          tgl_order: moment(master.tgl).format("YYYY-MM-DD"),
        });
        let detail = props.detail;
        let dataFinal = [];
        let getHarga = this.props.auth.user.set_harga;
        detail.map((val, key) => {
          val.tambahan.map((row, idx) => {
            dataFinal.push({
              kd_brg: row.kd_brg,
              nm_brg: val.nm_brg,
              ukuran: val.ukuran,
              barcode: row.barcode,
              satuan: row.satuan_jual,
              harga_old: !isEmptyOrUndefined(row.harga) ? "0" : row.harga,
              stock: row.stock,
              diskon_nominal: 0,
              ppn: !isEmptyOrUndefined(row.ppn) ? "0" : row.ppn,
              qty: !isEmptyOrUndefined(val.qty) ? "1" : val.qty,
              hrg_beli: parseFloat(row.harga_beli),
              isOpenPrice: false,
              diskon_persen: "0",
              kategori: "1",
              services: "0",
              tambahan: [],
            });
            for (let i = 0; i < getHarga; i++) {
              Object.assign(dataFinal[key], {
                [i === 0 ? `harga` : `harga${i + 1}`]:
                  row[i === 0 ? `harga` : `harga${i + 1}`],
              });
            }
            // this.HanldeSetAddBrg(dataFinal, "", idx);
          });
          this.HanldeSetAddBrg(dataFinal[key], "", key);
        });
        setTimeout(() => {
          this.fetchProduct();
          this.getData();
        }, 300);
      }
    }
  }

  componentWillMount() {
    if (this.props.match.params.slug) {
      this.props.dispatch(
        getEditTrx(this.props.match.params.slug, (res) => {
          this.fetchDataEdit(res);
        })
      );
    }
  }

  componentDidMount() {
    this.props.dispatch(getSoAction());
    if (this.props.match.params.slug !== undefined) {
      // this.props.dispatch(
      //   getEditTrx(this.props.match.params.slug, (res) => {
      //     this.fetchDataEdit(res);
      //   })
      // );
    } else {
      let state = {
        modalClosing: false,
        modalHoldBill: false,
        modalListHoldBill: false,
        isModalForm: false,
      };
      let idHold = localStorage.objectHoldBill;
      if (isEmptyOrUndefined(idHold)) {
        Object.assign(state, { objectHoldBill: JSON.parse(idHold) });
      }
      this.setState(state);
      this.fetchProduct();
    }
    this.getData();
  }
  getProps(props) {
    let state = {};
    if (props.dataSo !== undefined && props.dataSo.length > 0) {
      let newSo = handleDataSelect(props.dataSo, "kd_so","kd_so");
      Object.assign(state, { so_data: newSo });
    }
    if (props.barang.length > 0) this.getData();

    if (props.sales !== undefined) {
      if (props.sales.data !== undefined) {
        if (props.sales.data.length > 0) {
          let sales = handleDataSelect(props.sales.data, "kode", "nama");
          Object.assign(state, { opSales: sales });
        }
      }
    }
    if (props.customer !== undefined) {
      if (props.customer.length > 0) {
        let customer = handleDataSelect(props.customer, "kd_cust", "nama");
        Object.assign(state, { customer_data: customer });
      }
    }

    if (props.auth.user) {
      Object.assign(state, {
        userid: props.auth.user.id,
      });
    }

    this.setState(state);
  }
  componentWillReceiveProps = (nextProps) => {
    let perpage = this.state.perpage;
    if (nextProps.barang.length === perpage) {
      this.setState({
        perpage: perpage + 5,
      });
    }
    this.getProps(nextProps);
  };

  handleField(item) {
    const finaldt = {
      kd_brg: item.kd_brg,
      nm_brg: item.nm_brg,
      ukuran: item.ukuran,
      barcode: item.barcode,
      satuan: item.satuan,
      harga_old: !isEmptyOrUndefined(item.harga) ? "0" : item.harga,
      harga: !isEmptyOrUndefined(item.harga) ? "0" : item.harga,
      harga2: !isEmptyOrUndefined(item.harga2) ? "0" : item.harga2,
      harga3: !isEmptyOrUndefined(item.harga3) ? "0" : item.harga3,
      harga4: !isEmptyOrUndefined(item.harga4) ? "0" : item.harga4,
      stock: item.stock,
      diskon_persen: !isEmptyOrUndefined(item.diskon_persen)
        ? "0"
        : item.diskon_persen,
      diskon_nominal: 0,
      ppn: !isEmptyOrUndefined(item.ppn) ? "0" : item.ppn,
      qty: !isEmptyOrUndefined(item.qty) ? "1" : item.qty,
      hrg_beli: parseFloat(item.hrg_beli),
      kategori: item.kategori,
      services: !isEmptyOrUndefined(item.services) ? "0" : item.services,
      tambahan: item.tambahan,
      isOpenPrice: item.isOpenPrice,
    };
    return finaldt;
  }

  handleCheckData(key, item) {
    console.log(key);
    const cek = cekData("barcode", key, table);
    cek.then((res) => {
      if (res === undefined) {
        if (item !== undefined) {
          let finaldt = this.handleField(item);
          store(table, finaldt);
        } else {
          Toast.fire({
            icon: "error",
            title: `not found.`,
          });
        }
      } else {
        Object.assign(res, {
          id: res.id,
          qty: isNaN(res.qty) ? 1 : parseFloat(res.qty) + 1,
        });
        update(table, res);
      }

      this.getData();
    });
  }

  filterState(state, res) {
    setStorage(state, res.value);
    if (state === "sales_tr") {
      this.setState({ sales: res.value });
      destroy(table);
      this.getData();
    }
    if (state === "location_tr") {
      this.setState({ location: res.value });
      destroy(table);
      this.getData();
    }
    if (state === "customer_tr") {
      this.setState({ customer: res.value });
      destroy(table);
      this.getData();
    }
    this.fetchProduct(state);
  }

  setCoreState(action = "", res = null) {
    if (action !== "" && res !== null) {
      localStorage.setItem("objectHoldBill", JSON.stringify(res));
      this.setState({
        objectHoldBill: res,
        location: res.master.lokasi,
        customer: res.master.kd_cust,
        sales: res.master.kd_sales,
      });
    } else {
      localStorage.removeItem("objectHoldBill");
      this.setState({
        detail: [],
        master: {},
        dataHoldBill: [],
        objectHoldBill: {},
      });
    }
  }

  handleChangeIsSo(e) {
    this.setState({ isSo: e.target.checked });
  }

  HandleChangeSelect(state, res) {
    if (state === "so") {
      this.setState({ so: res }, () => {
        this.props.dispatch(
          getDetailSoAction(res.value, (row) => {
            console.log("######################", row);
            this.handleClear();
            row.map((val, key) => {
              const col = {
                barcode: val.barcode,
                diskon_nominal: 0,
                diskon_persen: 0,
                harga: val.harga,
                harga2: "0",
                harga3: "0",
                harga4: "0",
                harga_old: "0",
                hrg_beli: val.hrg_beli,
                isOpenPrice: false,
                kategori: val.kategori,
                kd_brg: val.kd_brg,
                ukuran: val.ukuran,
                nm_brg: val.nm_brg,
                ppn: val.ppn,
                qty: val.qty_brg,
                satuan: val.satuan,
                services: "0",
                stock: val.stock,
                tambahan: undefined,
              };

              this.HanldeSetAddBrg(col, "", key);
            });
          })
        );
      });
    } else {
      if (this.state.objectHoldBill.id !== undefined) {
        swallOption(
          "anda yakin akan mereset transaksi atas nama " +
          this.state.objectHoldBill.nama,
          () => {
            this.setCoreState();
            this.filterState(state, res);
          }
        );
      } else {
        this.filterState(state, res);
      }
    }
  }

  HandleCommonInputChange(e, errs = true, st = 0) {
    const column = e.target.name;
    const val = e.target.value;

    if (column === "discount_persen" || column === "pajak") {
      let val_final = 0;
      if (val < 0 || val === "") val_final = 0;
      else if (parseFloat(val) > 100) {
        val_final = 100;
      } else {
        val_final = val;
      }
      if (column === "discount_persen") {
        this.setState({
          discount_harga: st * (rmComma(val_final) / 100),
          discount_persen: val_final,
        });
      } else if (column === "pajak") {
        this.setState({
          ppn_harga: st * (rmComma(val_final) / 100),
          pajak: val_final,
        });
      }
    } else if (column === "discount_harga") {
      const disper = (rmComma(val) / st) * 100;
      this.setState({
        discount_persen: disper >= 100 ? 100 : disper,
        [column]: disper >= 100 ? st : rmComma(val),
      });
    } else if (column === "ppn_harga") {
      const disper = (rmComma(val) / st) * 100;
      this.setState({
        pajak: disper >= 100 ? 100 : disper,
        [column]: disper >= 100 ? st : rmComma(val),
      });
    } else {
      this.setState({
        [column]: val,
      });
    }
  }
  HandleOnBlur(e, i) {
    const column = e.target.name;
    const value = e.target.value;
    if (column === "qty") {
      if (value === "") {
        Object.assign(this.state.brgval[i], { qty: 0 });
        this.handleCheckData(this.state.databrg[i].barcode);
        return;
      }
    }
    handleInputOnBlurCommon(
      e,
      { id: this.state.databrg[i].barcode, table: table, where: "barcode" },
      () => {
        this.getData();
      }
    );
  }
  HandleChangeInputValue(e, i) {
    const column = e.target.name;
    const val = e.target.value;
    console.log(column, val);
    if (
      column === "harga" ||
      column === "qty" ||
      column === "diskon_persen" ||
      column === "ppn"
    ) {
      let brgval = [...this.state.brgval];
      let values = val;
      if (column === "ppn" || column === "diskon_persen") {
        if (val < 0 || val === "") values = 0;
        else if (parseFloat(val) > 100) {
          values = 100;
        }
      }
      // else if (column === "qty") {
      //   values = isNaN(val) ? 1 : val;
      // }
      brgval[i] = { ...brgval[i], [column]: values };
      this.setState({ brgval });
    }
  }

  HandleFocusInputReset(e, i) {
    const column = e.target.name;
    const val = e.target.value;
    let brgval = [...this.state.brgval];
    if (column === "barcode") {
      if (parseInt(val, 10) < 2) {
        brgval[i] = {
          ...brgval[i],
          [column]: "",
        };
        this.setState({
          brgval,
        });
      }
    }
  }
  setTglOrder(date) {
    this.setState({
      tgl_order: date,
    });
  }
  HandleRemove(e, id) {
    e.preventDefault();
    swallOption("anda yakin akan menghapus barang ini ?", () => {
      this.setState({
        subtotal: 0,
      });
      del(table, id).then((res) => {
        this.getData();
        Swal.fire("Deleted!", "Your data has been deleted.", "success");
      });
    });
  }
  HanldeSetAddBrg(item, param, index) {
    if (param === "hold") {
      Object.assign(item, { isOpenPrice: false });
    } else {
      Object.assign(item, { isOpenPrice: false });
    }
    this.handleCheckData(item.barcode, item);
    setTimeout(() => this[`qty-${btoa(item.barcode)}`].focus(), 500);
  }
  HandleAddBrg(e, item, index) {
    e.preventDefault();
    console.log(item);
    this.setState({
      isScroll: false,
      isClick: index,
    });
    this.HanldeSetAddBrg(item, "", index);
  }
  HandleReset(e) {
    e.preventDefault();
    swallOption("anda yakin akan membatalkan transaksi ini ?", () => {
      this.setState({ isSo: false, so: "", so_data: [] });
      this.handleClear();
    });
  }

  handleMasterDetail(callback) {
    const data = get(table);
    data.then((res) => {
      if (res.length === 0) {
        swal("Pilih barang untuk melanjutkan Penjualan.");
        callback(false);
      } else {
        let subtotal = 0;
        let detail = [];
        let hold = [];
        res.map((item) => {
          hold.push(item);
          let disc1 = 0;
          let disc2 = 0;
          let ppn = 0;
          let hrg = parseInt(rmComma(item.harga), 10);
          let ppnInt = parseInt(rmComma(item.ppn), 10);
          let disc_rp = parseInt(rmComma(item.diskon_nominal), 10);
          let disc_per = parseInt(rmComma(item.diskon_persen), 10);
          let qty = parseFloat(item.qty);
          if (disc_per !== 0) {
            disc1 = hrg - hrg * (disc_per / 100);
            disc2 = disc1;
            if (disc_rp !== 0) {
              disc2 = disc1 - disc1 * (disc_rp / 100);
            }
          } else if (disc_rp !== 0) {
            disc1 = hrg - hrg * (disc_rp / 100);
            disc2 = disc1;
            if (disc_per !== 0) {
              disc2 = disc1 - disc1 * (disc_per / 100);
            }
          }
          if (ppnInt !== 0) {
            ppn = hrg * (ppnInt / 100);
          }

          subtotal += (disc2 === 0 ? hrg + ppn : disc2 + ppn) * qty;
          detail.push({
            kode_trx:
              this.props.match.params.slug !== undefined
                ? this.props.match.params.slug
                : this.props.nota,
            subtotal: (disc2 === 0 ? hrg + ppn : disc2 + ppn) * qty,
            price: hrg,
            qty: qty,
            diskon: qty * hrg * (disc_per / 100),
            kategori: item.kategori,
            tax: ppnInt,
            services: item.services === undefined ? "0" : item.services,
            sku: item.barcode,
            open_price: hrg === rmComma(item.harga_old) ? 0 : hrg,
            hrg_beli: item.hrg_beli,
            nm_brg: item.nm_brg,
            satuan: item.satuan,
            ukuran: item.ukuran,
          });
          return null;
        });
        moment.locale("id");
        let master = {
          cetak_nota: true,
          tempo: moment(new Date()).format("yyyy-MM-DD HH:mm:ss"),
          hr: "S",
          kartu: "-",
          dis_persen: this.state.discount_persen,
          dis_rp:
            this.state.discount_harga === 0
              ? 0
              : rmComma(this.state.discount_harga),
          kd_sales: this.state.sales,
          jam: moment(new Date()).format("HH:mm:ss"),
          tgl: moment(new Date()).format("yyyy-MM-DD HH:mm:ss"),
          compliment: "-",
          kd_kasir: this.state.userid,
          no_kartu: "0",
          id_hold: this.state.objectHoldBill.id,
          diskon:
            this.state.discount_harga === 0
              ? 0
              : rmComma(this.state.discount_harga),
          compliment_rp: "0",
          jml_kartu: 0,
          charge: 0,
          change: 0,
          rounding: 0,
          tax: this.state.pajak,
          nominal_poin: 0,
          tunai: 0,
          poin_tukar: 0,
          nama_penerima: this.state.nama_penerima,
          no_telepon_penerima: this.state.no_telepon_penerima,
          alamat_penerima: this.state.alamat_penerima,
          nama_pengirim: this.state.nama_pengirim,
          no_telepon_pengirim: this.state.no_telepon_pengirim,
          alamat_pengirim: this.state.alamat_pengirim,
          gt:
            subtotal -
            subtotal * (parseFloat(this.state.discount_persen) / 100) +
            subtotal * (parseFloat(this.state.pajak) / 100),
          pemilik_kartu: "-",
          jenis_trx: "TUNAI",
          kd_cust: this.state.customer,
          kode_trx:
            this.props.match.params.slug !== undefined
              ? this.props.match.params.slug
              : this.props.nota,
          subtotal: subtotal,
          lokasi: this.state.location,
          kassa:
            atob(atob(Cookies.get("tnt="))) === "nov-jkt" ||
              atob(atob(Cookies.get("tnt="))) === "nov-bdg" ||
              atob(atob(Cookies.get("tnt="))) === "morph-apparel" ||
              atob(atob(Cookies.get("tnt="))) === "npos" ||
              atob(atob(Cookies.get("tnt="))) === "miski"
              ? "Z"
              : "Q",
          jns_kartu: "Debit",
          status: "LUNAS",
          optional_note: isEmptyOrUndefined(this.state.catatan)
            ? this.state.catatan
            : "-",
        };
        if (this.state.so !== "" && this.state.isSo) {
          Object.assign(master, { kd_so: this.state.so.value });
        } else {
          Object.assign(master, { kd_so: "" });
        }
        console.log("handle submit", master);
        if (this.props.match.params.slug !== undefined) {
          Object.assign(master, { idLog: getStorage("idLogEdit") });
        }
        this.setState({
          dataHoldBill: hold,
          master: master,
          detail: detail,
          objectHoldBill: this.state.objectHoldBill,
        });
        callback(true);
      }
    });
  }

  HandleSubmit(e) {
    e.preventDefault();
    // if (!isEmptyOrUndefined(this.state.catatan, "catatan")) return;
    if (!isEmptyOrUndefined(this.state.location, "lokasi")) return;
    if (!isEmptyOrUndefined(this.state.customer, "customer")) return;
    if (!isEmptyOrUndefined(this.state.sales, "sales")) return;
    this.handleMasterDetail((res) => {
      if (res) {
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.setState({ isModalForm: true });
        this.props.dispatch(ModalType("formSale"));
      }
    });
  }

  autoSetQty(kode, data) {
    const cek = cekData("barcode", kode, table);
    return cek.then((res) => {
      if (res === undefined) {
        Object.assign(data[0], { isOpenPrice: false, qty: 1 });
        store(table, data[0]);
      } else {
        Object.assign(res, { id: res.id, qty: parseFloat(res.qty) + 1 });
        update(table, res);
      }
      return true;
    });
  }
  HandleSearch() {
    if (this.state.customer === "" || this.state.location === "") {
      Swal.fire("Gagal!", "Pilih lokasi terlebih dahulu.", "error");
    } else {
      localStorage.setItem("anySaleTrx", this.state.search);
      let where = `lokasi=${this.state.location}&customer=${this.state.customer}`;
      if (parseInt(this.state.searchby, 10) === 1) {
        if (where !== "") {
          where += "&";
        }
        where += `searchby=kd_brg`;
      }
      if (parseInt(this.state.searchby, 10) === 2) {
        if (where !== "") {
          where += "&";
        }
        where += `searchby=ukuran`;
      }
      if (parseInt(this.state.searchby, 10) === 3) {
        if (where !== "") {
          where += "&";
        }
        where += `searchby=deskripsi`;
      }
      if (this.state.search !== "") {
        if (where !== "") {
          where += "&";
        }
        where += `q=${this.state.search}`;
      }
      this.props.dispatch(
        FetchProductSale(1, `${where}&perpage=5`, "sale", this.autoSetQty)
      );
      this.setState({ search: "" });
    }
  }

  getData() {
    const data = get(table);
    data.then((res) => {
      let brg = [];
      res.map((i) => {
        brg.push({
          isOpenPrice: i.isOpenPrice,
          harga: i.harga,
          harga2: i.harga2,
          harga3: i.harga3,
          harga4: i.harga4,
          ukuran: i.ukuran,
          diskon_persen: i.diskon_persen,
          diskon_nominal: i.diskon_nominal,
          ppn: i.ppn,
          qty: i.qty,
          satuan: i.satuan,
        });
        return null;
      });
      this.setState({
        databrg: res,
        brgval: brg,
      });
    });
  }
  handleLoadMore() {
    this.setState({
      isScroll: true,
    });
    let perpage = parseInt(this.props.pagin_brg_sale.per_page, 10);
    let lengthBrg = parseInt(this.props.barang.length, 10);
    if (perpage === lengthBrg || perpage < lengthBrg) {
      // barang?page=1&lokasi=LK/0001&customer=1000001&searchby=deskripsi&q=cedea&perpage=5
      let where = `lokasi=${this.state.location}&customer=${this.state.customer}`;
      if (localStorage.anySaleTrx !== undefined) {
        if (where !== "") {
          where += "&";
        }
        where += `q=${localStorage.anySaleTrx}`;
        if (parseInt(this.state.searchby, 10) === 1) {
          if (where !== "") {
            where += "&";
          }
          where += `searchby=kd_brg`;
        }
        if (parseInt(this.state.searchby, 10) === 2) {
          if (where !== "") {
            where += "&";
          }
          where += `searchby=ukuran`;
        }
        if (parseInt(this.state.searchby, 10) === 3) {
          if (where !== "") {
            where += "&";
          }
          where += `searchby=deskripsi`;
        }
      }
      // let where=`lokasi=${this.state.location}&customer=${this.state.customer}&perpage=${this.state.perpage}`;
      this.props.dispatch(
        FetchProductSale(
          1,
          `${where}&perpage=${this.state.perpage}`,
          "sale",
          this.autoSetQty
        )
      );
      this.setState({ scrollPage: this.state.scrollPage + 5 });
    } else {
      Swal.fire({
        allowOutsideClick: false,
        title: "Perhatian",
        icon: "warning",
        text: "Tidak ada data.",
      });
    }
  }
  handleScroll() {
    let divToScrollTo;
    divToScrollTo = document.getElementById(`item${this.state.scrollPage}`);
    if (divToScrollTo) {
      divToScrollTo.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "end",
      });
    }
  }
  handleChecked(event, i, barcode) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    let brgval = [...this.state.brgval];
    brgval[i] = { ...brgval[i], [name]: value };
    this.setState({ brgval });
    const cek = cekData("barcode", barcode, table);
    if (name === "isOpenPrice") {
      cek.then((res) => {
        if (res === undefined) {
        } else {
          Object.assign(res, { isOpenPrice: value });
          update(table, res);
        }
        this.getData();
      });
    }
  }
  handleClear() {
    this.setCoreState();
    destroy(table);
    this.getData();
  }
  handleClosing(e) {
    e.preventDefault();
    this.setState({ modalClosing: true });
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formClosing"));
  }

  handleHoldBill(e, param) {
    e.preventDefault();
    if (param === "formHoldBill") {
      this.handleMasterDetail((res) => {
        if (res) {
          this.setState({ modalHoldBill: true });
          this.props.dispatch(ModalToggle(true));
          this.props.dispatch(ModalType("formHoldBill"));
          return;
        }
      });
    }
    if (param === "listHoldBill") {
      setStorage("key", "-");
      this.setState({ modalListHoldBill: true });
      this.props.dispatch(ModalToggle(true));
      this.props.dispatch(ModalType("listHoldBill"));
      return;
    }
  }

  render() {
    console.log("so data", this.props.detailSo);
    if (this.state.isScroll === true) this.handleScroll();
    let totalsub = 0;
    const head = [
      { label: "Barang" },
      { label: "Variasi" },
      { label: "Harga" },
      { label: "Stok" },
      { label: "Qty" },
      { label: "Disc (%)" },
      { label: "Ppn" },
      { label: "Subtotal" },
      { label: "#", className: "text-center", width: "1%" },
    ];
    return (
      <React.Fragment>
        {!this.props.isOpen && !this.state.isModalForm ? (
          <KeyHandler
            keyEventName={KEYPRESS}
            keyValue={["Enter", "c", "h", "l", "x"]}
            onKeyHandle={(e) => {
              if (e.key === "Enter") {
                this.HandleSubmit(e);
                return;
              }
              if (e.key === "h") {
                this.handleHoldBill(e, "formHoldBill");
                return;
              }
              if (e.key === "l") {
                this.handleHoldBill(e, "listHoldBill");
                return;
              }
              if (e.key === "c") {
                this.handleClosing(e);
                return;
              }
              if (e.key === "x") {
                this.HandleReset(e);
                return;
              }
            }}
          />
        ) : null}
        <Layout page="Penjualan Barang">
          <div className="card">
            <div className="card-header  d-flex justify-content-between">
              <h4 style={{ float: "left" }}>
                <button
                  onClick={this.handleClickToggle}
                  className={
                    this.state.toggleSide
                      ? "btn btn-danger mr-3"
                      : "btn btn-outline-dark text-dark mr-3"
                  }
                >
                  <i
                    className={
                      this.state.toggleSide ? "fa fa-remove" : "fa fa-bars"
                    }
                  />
                </button>
                Penjualan Barang #
                {this.props.match.params.slug !== undefined
                  ? this.props.match.params.slug
                  : this.props.nota}
              </h4>
              <h4
                className="text-right   d-flex justify-content-between"
                style={{ width: "50%" }}
              >
                <input
                  type="date"
                  name={"tgl_order"}
                  className={"form-control  nbt nbr nbl bt"}
                  value={this.state.tgl_order}
                  onChange={(e) => this.HandleCommonInputChange(e)}
                />
                <input
                  placeholder="Tambahkan catatan disini ..."
                  type="text"
                  style={{ height: "39px" }}
                  className="form-control nbt nbr nbl bt"
                  value={this.state.catatan}
                  onChange={(e) => this.HandleCommonInputChange(e)}
                  name="catatan"
                />
              </h4>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <StickyBox
                offsetTop={100}
                offsetBottom={20}
                style={
                  this.state.toggleSide
                    ? { display: "none", width: "30%", marginRight: "10px" }
                    : { display: "block", width: "30%", marginRight: "10px" }
                }
              >
                <div className="card">
                  <div className="card-body">
                    <div className="form-group">
                      <input
                        type="checkbox"
                        value={this.state.isSo}
                        onChange={this.handleChangeIsSo}
                      />{" "}
                      tarik data so
                      {this.state.isSo && (
                        <SelectCommon
                          isLabel={false}
                          options={this.state.so_data}
                          callback={(res) => this.HandleChangeSelect("so", res)}
                          dataEdit={this.state.so}
                        />
                      )}
                    </div>
                    <div className="form-group">
                      <div className="input-group input-group-sm">
                        <select
                          name="searchby"
                          className="form-control form-control-sm"
                          onChange={(e) =>
                            this.HandleCommonInputChange(e, false)
                          }
                        >
                          <option value={3}>Nama Barang</option>
                          <option value={1}>Kode Barang</option>
                          <option value={2}>Variasi</option>
                        </select>
                      </div>
                      <small
                        id="passwordHelpBlock"
                        className="form-text text-muted"
                      >
                        Cariberdasarkan{" "}
                        {parseInt(this.state.searchby, 10) === 1
                          ? "Kode Barang"
                          : parseInt(this.state.searchby, 10) === 2
                            ? "Variasi"
                            : "Nama Barang"}
                      </small>
                    </div>
                    <div className="form-group">
                      <div className="input-group input-group-sm">
                        <input
                          autoFocus={true}
                          type="text"
                          id="chat-search"
                          name="search"
                          ref={(input) => {
                            if (input !== null) {
                              this[`search`] = input;
                            }
                          }}
                          className="form-control form-control-sm"
                          placeholder={`Search ${localStorage.anySaleTrx !== undefined
                            ? localStorage.anySaleTrx
                            : ""
                            }`}
                          value={this.state.search}
                          onChange={(e) =>
                            this.HandleCommonInputChange(e, false)
                          }
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              this.HandleSearch();
                            }
                          }}
                        />
                        <span className="input-group-append">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={(event) => {
                              event.preventDefault();
                              this.HandleSearch();
                            }}
                          >
                            <i className="fa fa-search" />
                          </button>
                        </span>
                      </div>
                    </div>
                    <div
                      className="people-list"
                      style={{
                        height: "300px",
                        maxHeight: "100%",
                        overflowY: "scroll",
                      }}
                    >
                      {!this.props.loadingbrg ? (
                        <div id="chat_user_2">
                          <ul className="chat-list list-unstyled">
                            {this.props.barang.length !== 0 ? (
                              this.props.barang.map((i, inx) => {
                                return (
                                  <li
                                    style={{
                                      backgroundColor:
                                        this.state.scrollPage === inx ||
                                          this.state.isClick === inx
                                          ? "#eeeeee"
                                          : "",
                                    }}
                                    id={`item${inx}`}
                                    className="clearfix"
                                    key={inx}
                                    onClick={(e) => {
                                      // let field = this.handleField(i);
                                      this.HandleAddBrg(e, i, inx);
                                    }}
                                  >
                                    <div className="about">
                                      <div
                                        className="status"
                                        style={{
                                          color: "black",
                                          fontWeight: "bold",
                                          wordBreak: "break-all",
                                          fontSize: "14px",
                                        }}
                                      >
                                        {i.nm_brg}
                                      </div>
                                      <div className="status"
                                        style={{
                                          color: "black",
                                          fontWeight: "bold",
                                          wordBreak: "break-all",
                                          fontSize: "12px",
                                        }}>

                                        ({i.ukuran})
                                      </div>
                                    </div>
                                  </li>
                                );
                              })
                            ) : (
                              <div
                                style={{
                                  textAlign: "center",
                                  fontSize: "11px",
                                  fontStyle: "italic",
                                }}
                              >
                                Barang tidak ditemukan.
                              </div>
                            )}
                          </ul>
                        </div>
                      ) : (
                        <Spinner />
                      )}
                    </div>
                    <hr />
                    <div className="form-group">
                      <button
                        className={"btn btn-primary"}
                        style={{ width: "100%" }}
                        onClick={this.handleLoadMore}
                      >
                        {this.props.loadingbrg
                          ? "tunggu sebentar ..."
                          : "tampilkan lebih banyak"}
                      </button>
                    </div>
                  </div>
                </div>
              </StickyBox>
              <div
                style={
                  this.state.toggleSide ? { width: "100%" } : { width: "70%" }
                }
              >
                <div className="card">
                  <div className="card-body">
                    <form className="">
                      <div className="row">
                        <div className="col-md-3">
                          <LokasiCommon
                            callback={(res) =>
                              this.HandleChangeSelect("location_tr", res)
                            }
                            dataEdit={this.state.location}
                          />
                        </div>
                        <div className="col-md-3">
                          <SelectCommon
                            label="Sales"
                            options={this.state.opSales}
                            callback={(res) =>
                              this.HandleChangeSelect("sales_tr", res)
                            }
                            dataEdit={this.state.sales}
                          />
                        </div>
                        <div className="col-md-3">
                          <SelectCommon
                            label="Customer"
                            options={this.state.customer_data}
                            callback={(res) =>
                              this.HandleChangeSelect("customer_tr", res)
                            }
                            dataEdit={this.state.customer}
                          />
                        </div>
                      </div>
                      <div className="col-md-12 d-flex justify-content-between">
                        <div className="form-group">
                          <label className="bold">Penerima</label>
                          <div className="d-flex">
                            <input
                              placeholder="nama"
                              type="text"
                              className="form-control"
                              dataEdit={this.state.nama_penerima}
                              onChange={(e) => this.HandleChangeTambahan(e, null)}
                              name="nama_penerima"
                              style={{
                                borderRight: "0px",
                                borderTopRightRadius: "0px",
                                borderBottomRightRadius: "0px",
                              }}
                              ref={(input) => (this[`nama_penerima`] = input)}
                            />
                            <input
                              placeholder="no telepon"
                              type="text"
                              className="form-control"
                              dataEdit={this.state.no_telepon_penerima}
                              onChange={(e) => this.HandleChangeTambahan(e, null)}
                              name="no_telepon_penerima"
                              style={{
                                borderRight: "0px",
                                borderTopRightRadius: "0px",
                                borderBottomRightRadius: "0px",
                                borderLeft: "0px",
                                borderTopLeftRadius: "0px",
                                borderBottomLeftRadius: "0px",
                              }}
                              ref={(input) => (this[`no_telepon_penerima`] = input)}
                            />
                            <textarea
                              placeholder="alamat"
                              type="text"
                              className="form-control"
                              dataEdit={this.state.alamat_penerima}
                              onChange={(e) => this.HandleChangeTambahan(e, null)}
                              name="alamat_penerima"
                              style={{
                                borderLeft: "0px",
                                borderTopLeftRadius: "0px",
                                borderBottomLeftRadius: "0px",
                              }}
                              ref={(input) => (this[`alamat_penerima`] = input)}
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="bold">Pengirim</label>
                          <div className="d-flex">
                            <input
                              placeholder="nama"
                              type="text"
                              className="form-control"
                              dataEdit={this.state.nama_pengirim}
                              onChange={(e) => this.HandleChangeTambahan(e, null)}
                              name="nama_pengirim"
                              style={{
                                borderRight: "0px",
                                borderTopRightRadius: "0px",
                                borderBottomRightRadius: "0px",
                              }}
                              ref={(input) => (this[`nama_pengirim`] = input)}
                            />
                            <input
                              placeholder="no telepon"
                              type="text"
                              className="form-control"
                              dataEdit={this.state.no_telepon_pengirim}
                              onChange={(e) => this.HandleChangeTambahan(e, null)}
                              name="no_telepon_pengirim"
                              style={{
                                borderRight: "0px",
                                borderTopRightRadius: "0px",
                                borderBottomRightRadius: "0px",
                                borderLeft: "0px",
                                borderTopLeftRadius: "0px",
                                borderBottomLeftRadius: "0px",
                              }}
                              ref={(input) => (this[`no_telepon_pengirim`] = input)}
                            />
                            <textarea
                              placeholder="alamat"
                              type="text"
                              className="form-control"
                              dataEdit={this.state.alamat_pengirim}
                              onChange={(e) => this.HandleChangeTambahan(e, null)}
                              name="alamat_pengirim"
                              style={{
                                borderLeft: "0px",
                                borderTopLeftRadius: "0px",
                                borderBottomLeftRadius: "0px",
                              }}
                              ref={(input) => (this[`alamat_pengirim`] = input)}
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                    <TableCommon
                      head={head}
                      renderRow={
                        this.state.databrg.length > 0
                          ? this.state.databrg.map((item, index) => {
                            let disc1 = 0;
                            let disc2 = 0;
                            let ppn = 0;
                            let hrg = parseFloat(rmComma(item.harga));
                            let ppnInt = parseFloat(item.ppn);
                            let disc_rp = parseFloat(item.diskon_nominal);
                            let disc_per = parseFloat(item.diskon_persen);
                            if (disc_per !== 0) {
                              disc1 = hrg - hrg * (disc_per / 100);
                              disc2 = disc1;
                              if (disc_rp !== 0) {
                                disc2 = disc1 - disc1 * (disc_rp / 100);
                              }
                            } else if (disc_rp !== 0) {
                              disc1 = hrg - hrg * (disc_rp / 100);
                              disc2 = disc1;
                              if (disc_per !== 0) {
                                disc2 = disc1 - disc1 * (disc_per / 100);
                              }
                            }

                            if (ppnInt !== 0) {
                              ppn = hrg * (ppnInt / 100);
                            }
                            const subtot =
                              (disc2 === 0 ? hrg + ppn : disc2 + ppn) *
                              parseFloat(item.qty);
                            totalsub += subtot;

                            return (
                              <tr key={index}>
                                <td className="middle nowrap">
                                  {item.nm_brg} <br />
                                  <div className="subtitle">
                                    {item.kd_brg} ( {item.satuan} )
                                  </div>
                                </td>
                                <td className="middle nowrap">
                                  {item.ukuran}
                                </td>
                                <td className="middle nowrap">
                                  {this.state.brgval[index].isOpenPrice ? (
                                    <input
                                      type="text"
                                      style={{ width: "100px" }}
                                      className={"form-control in-table"}
                                      value={toCurrency(
                                        this.state.brgval[index].harga
                                      )}
                                      name="harga"
                                      onBlur={(e) =>
                                        this.HandleOnBlur(e, index)
                                      }
                                      onChange={(e) =>
                                        this.HandleChangeInputValue(e, index)
                                      }
                                    />
                                  ) : (
                                    <select
                                      className="form-control in-table"
                                      style={{ width: "100px" }}
                                      name="harga"
                                      onBlur={(e) =>
                                        this.HandleOnBlur(e, index)
                                      }
                                      onChange={(e) =>
                                        this.HandleChangeInputValue(e, index)
                                      }
                                    >
                                      <option
                                        value={this.state.brgval[index].harga}
                                        style={{
                                          display:
                                            this.state.brgval[index].harga ===
                                              "" ||
                                              this.state.brgval[index].harga ===
                                              "0"
                                              ? "none"
                                              : "",
                                        }}
                                      >
                                        {toCurrency(
                                          this.state.brgval[index].harga
                                        )}
                                      </option>
                                      <option
                                        value={
                                          this.state.brgval[index].harga2
                                        }
                                        style={{
                                          display:
                                            this.state.brgval[index]
                                              .harga2 === "" ||
                                              this.state.brgval[index]
                                                .harga2 === "0"
                                              ? "none"
                                              : "",
                                        }}
                                      >
                                        {toCurrency(
                                          this.state.brgval[index].harga2
                                        )}
                                      </option>
                                      <option
                                        value={
                                          this.state.brgval[index].harga3
                                        }
                                        style={{
                                          display:
                                            this.state.brgval[index]
                                              .harga3 === "" ||
                                              this.state.brgval[index]
                                                .harga3 === "0"
                                              ? "none"
                                              : "",
                                        }}
                                      >
                                        {toCurrency(
                                          this.state.brgval[index].harga3
                                        )}
                                      </option>
                                      <option
                                        value={
                                          this.state.brgval[index].harga4
                                        }
                                        style={{
                                          display:
                                            this.state.brgval[index]
                                              .harga4 === "" ||
                                              this.state.brgval[index]
                                                .harga4 === "0"
                                              ? "none"
                                              : "",
                                        }}
                                      >
                                        {toCurrency(
                                          this.state.brgval[index].harga4
                                        )}
                                      </option>
                                    </select>
                                  )}
                                  <div
                                    className="row"
                                    style={{
                                      marginTop: "1px",
                                    }}
                                  >
                                    <div
                                      className="col-md-3"
                                      style={{
                                        paddingRight: "0px",
                                        paddingLeft: "0px",
                                      }}
                                    ></div>
                                    <div
                                      className="col-md-"
                                      style={{
                                        marginTop: "-3px",
                                        textAlign: "left",
                                        paddingLeft: "0px",
                                      }}
                                    ></div>
                                  </div>
                                  <input
                                    style={{
                                      height: "17px",
                                      width: "17px",
                                    }}
                                    id="isOpenPrice"
                                    type="checkbox"
                                    name="isOpenPrice"
                                    checked={
                                      this.state.brgval[index].isOpenPrice
                                    }
                                    onChange={(e) =>
                                      this.handleChecked(
                                        e,
                                        index,
                                        item.barcode
                                      )
                                    }
                                  />{" "}
                                  <label
                                    htmlFor="isOpenPrice"
                                    style={{ fontSize: "10px" }}
                                  >
                                    Open Price
                                  </label>
                                </td>
                                <td className="middle nowrap">
                                  <input
                                    disabled={true}
                                    type="text"
                                    value={toCurrency(item.stock)}
                                    className="form-control text-right in-table"
                                    style={{ width: "70px" }}
                                  />
                                </td>

                                <td className="middle nowrap">
                                  <input
                                    type="text"
                                    name="qty"
                                    style={{ width: "100px" }}
                                    ref={(input) => {
                                      if (input !== null) {
                                        this[`qty-${btoa(item.barcode)}`] =
                                          input;
                                      }
                                    }}
                                    onFocus={(e) =>
                                      this.HandleFocusInputReset(e, index)
                                    }
                                    onBlur={(e) =>
                                      this.HandleOnBlur(e, index)
                                    }
                                    className="form-control text-right in-table"
                                    onChange={(e) =>
                                      this.HandleChangeInputValue(e, index)
                                    }
                                    value={this.state.brgval[index].qty}
                                  />
                                  <div
                                    className="invalid-feedback text-left"
                                    style={
                                      parseInt(
                                        this.state.brgval[index].qty,
                                        10
                                      ) > parseInt(item.stock, 10)
                                        ? { display: "block" }
                                        : { display: "none" }
                                    }
                                  >
                                    Qty Melebihi Stock.
                                  </div>
                                </td>
                                <td className="middle nowrap">
                                  <input
                                    type="text"
                                    name="diskon_persen"
                                    style={{ width: "70px" }}
                                    className="form-control in-table text-right"
                                    onBlur={(e) =>
                                      this.HandleOnBlur(e, index)
                                    }
                                    onChange={(e) =>
                                      this.HandleChangeInputValue(e, index)
                                    }
                                    value={toCurrency(
                                      this.state.brgval[index].diskon_persen
                                    )}
                                  />
                                </td>
                                <td className="middle nowrap">
                                  <input
                                    type="text"
                                    name="ppn"
                                    style={{ width: "70px" }}
                                    className="form-control in-table text-right"
                                    onBlur={(e) =>
                                      this.HandleOnBlur(e, index)
                                    }
                                    onChange={(e) =>
                                      this.HandleChangeInputValue(e, index)
                                    }
                                    value={toCurrency(
                                      this.state.brgval[index].ppn
                                    )}
                                  />
                                </td>

                                <td className="middle nowrap">
                                  <input
                                    disabled={true}
                                    type="text"
                                    value={toCurrency(subtot)}
                                    className="form-control text-right in-table"
                                    style={{ width: "100px" }}
                                  />
                                </td>
                                <td className="middle nowrap text-center">
                                  <button
                                    className="btn btn-primary btn-sm"
                                    onClick={(e) =>
                                      this.HandleRemove(e, item.id)
                                    }
                                  >
                                    <i className="fa fa-trash" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                          : noData(head.length)
                      }
                    />
                    <hr />
                    <div className="row">
                      <div className="col-md-7">
                        <div className="dashboard-btn-group d-flex align-items-center">
                          <button
                            onClick={(e) => this.HandleSubmit(e)}
                            className="btn btn-primary ml-1"
                          >
                            Bayar
                          </button>

                          {atob(atob(Cookies.get("tnt="))) !== "nov-jkt" ||
                            atob(atob(Cookies.get("tnt="))) !== "nov-bdg" ||
                            atob(atob(Cookies.get("tnt="))) !== "morph-apparel" ||
                            atob(atob(Cookies.get("tnt="))) !== "miski" ? (
                            ""
                          ) : (
                            <button
                              className={"btn btn-outline-info ml-1"}
                              onClick={(e) =>
                                this.handleHoldBill(e, "formHoldBill")
                              }
                            >
                              Hold bill
                            </button>
                          )}
                          {atob(atob(Cookies.get("tnt="))) === "nov-jkt" ||
                            atob(atob(Cookies.get("tnt="))) === "nov-bdg" ||
                            atob(atob(Cookies.get("tnt="))) === "morph-apparel" ||
                            atob(atob(Cookies.get("tnt="))) === "npos" ||
                            atob(atob(Cookies.get("tnt="))) === "miski" ? (
                            <div>
                              <button
                                className={"btn btn-outline-info ml-1"}
                                onClick={(e) => this.handleClosing(e)}
                              >
                                Closing
                              </button>
                              <button
                                className="btn btn-outline-info ml-1"
                                onClick={(e) =>
                                  this.handleHoldBill(e, "listHoldBill")
                                }
                              >
                                List Hold bill
                              </button>
                              <button
                                className="btn btn-outline-info ml-1"
                                onClick={(e) =>
                                  this.handleHoldBill(e, "formHoldBill")
                                }
                              >
                                Hold bill
                              </button>
                            </div>
                          ) : (
                            ""
                          )}
                          <button
                            onClick={(e) => this.HandleReset(e)}
                            className="btn btn-warning ml-1"
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                      <div className="col-md-5">
                        <div className="pull-right">
                          <form className="form_head">
                            <div
                              className="row"
                              style={{ marginBottom: "3px" }}
                            >
                              <label className="col-sm-4">Sub Total</label>
                              <div className="col-sm-8">
                                <input
                                  type="text"
                                  id="sub_total"
                                  name="sub_total"
                                  className="form-control text-right"
                                  value={toCurrency(totalsub)}
                                  readOnly
                                />
                              </div>
                            </div>
                            <div
                              className="row"
                              style={{ marginBottom: "3px" }}
                            >
                              <label className="col-sm-4">Discount</label>
                              <div className="col-sm-3">
                                <input
                                  type="number"
                                  onChange={(e) =>
                                    this.HandleCommonInputChange(
                                      e,
                                      false,
                                      totalsub
                                    )
                                  }
                                  name="discount_persen"
                                  min="0"
                                  max="100"
                                  className="form-control"
                                  placeholder="%"
                                  value={this.state.discount_persen}
                                />
                              </div>
                              <div className="col-sm-5">
                                <input
                                  type="text"
                                  onChange={(e) =>
                                    this.HandleCommonInputChange(
                                      e,
                                      false,
                                      totalsub
                                    )
                                  }
                                  name="discount_harga"
                                  className="form-control text-right"
                                  placeholder="Rp"
                                  value={toCurrency(this.state.discount_harga)}
                                />
                              </div>
                            </div>
                            <div
                              className="row"
                              style={{ marginBottom: "3px" }}
                            >
                              <label className="col-sm-4">Pajak</label>
                              <div className="col-sm-3">
                                <input
                                  type="number"
                                  onChange={(e) =>
                                    this.HandleCommonInputChange(
                                      e,
                                      false,
                                      totalsub
                                    )
                                  }
                                  name="pajak"
                                  min="0"
                                  max="100"
                                  className="form-control"
                                  placeholder="%"
                                  value={this.state.pajak}
                                />
                              </div>
                              <div className="col-sm-5">
                                <input
                                  type="text"
                                  onChange={(e) =>
                                    this.HandleCommonInputChange(
                                      e,
                                      false,
                                      totalsub
                                    )
                                  }
                                  name="ppn_harga"
                                  className="form-control text-right"
                                  placeholder="Rp"
                                  value={toCurrency(this.state.ppn_harga)}
                                />
                              </div>
                            </div>
                            <div
                              className="row"
                              style={{ marginBottom: "3px" }}
                            >
                              <label className="col-sm-4">Grand Total</label>
                              <div className="col-sm-8">
                                <input
                                  type="text"
                                  name="grand_total"
                                  className="form-control text-right"
                                  readOnly
                                  value={toCurrency(
                                    totalsub -
                                    totalsub *
                                    (parseFloat(
                                      this.state.discount_persen
                                    ) /
                                      100) +
                                    totalsub *
                                    (parseFloat(this.state.pajak) / 100)
                                  )}
                                />
                              </div>
                            </div>
                          </form>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {this.props.isOpen && this.state.isModalForm ? (
            <FormSale
              master={this.state.master}
              detail={this.state.detail}
              subtotal={totalsub}
              lokasi={this.props.dataDetailLocation}
              callback={() => {
                console.log("########################################");
                // this.props.dispatch(getSoAction());
                // this.setState();
                this.setState({ isSo: false, so: "", so_data: [] }, () => {
                  this.props.dispatch(getSoAction());
                });
              }}
            />
          ) : null}

          {this.state.modalClosing && this.props.isOpen ? (
            <FormClosing />
          ) : null}
          {this.state.modalHoldBill && this.props.isOpen ? (
            <FormHoldBill
              objectHoldBill={this.state.objectHoldBill}
              dataHoldBill={this.state.dataHoldBill}
              master={this.state.master}
              detail={this.state.detail}
              callback={(res) => {
                if (res === "submit") {
                  this.handleClear();
                }
              }}
            />
          ) : null}

          {this.state.modalListHoldBill && this.props.isOpen ? (
            <ListHoldBill
              objectHoldBill={this.state.objectHoldBill}
              callback={(res) => {
                console.log(res);
                this.setState({
                  modalListHoldBill: false,
                });
                if (res !== "close" && res !== "delete") {
                  destroy("sale");
                  if (res.detail !== undefined) {
                    res.detail.map((val, index) =>
                      this.HanldeSetAddBrg(val, "hold", index)
                    );
                  }
                  setStorage("location", res.master.lokasi);
                  setStorage("sales", res.master.kd_sales);
                  setStorage("customer", res.master.kd_cust);
                  this.setCoreState("set", res);

                  setTimeout(() => {
                    this.fetchProduct();
                  }, 500);

                  // !this.props.loadingbrg &&this.props.dispatch(ModalToggle(false));
                }
                if (res === "delete") {
                  this.handleClear();
                }
              }}
            />
          ) : null}
        </Layout>
      </React.Fragment>
    );
  }
}

const mapStateToPropsCreateItem = (state) => ({
  isOpen: state.modalReducer,
  barang: state.productReducer.result_brg_sale,
  loadingbrg: state.productReducer.isLoadingBrgSale,
  pagin_brg_sale: state.productReducer.pagin_brg_sale,
  nota: state.saleReducer.code,
  customer: state.customerReducer.all,
  sales: state.salesReducer.dataAll,
  auth: state.auth,
  dataDetailLocation: state.locationReducer.detail,
  detailSale: state.saleReducer.dataDetail,
  editSale: state.saleReducer.dataEdit,
  dataSo: state.salesOrderReducer.dataGetSo,
  detailSo: state.salesOrderReducer.detaDetailSo,
});

export default connect(mapStateToPropsCreateItem)(Sale);
