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
import { FetchNotaSale } from "redux/actions/sale/sale.action";
import { toRp, toCurrency, rmComma } from "helper";
import Spinner from "Spinner";
import Cookies from "js-cookie";
import LokasiCommon from "../../common/LokasiCommon";
import SelectCommon from "../../common/SelectCommon";
import {
  getStorage,
  handleDataSelect,
  isEmptyOrUndefined,
  onHandleKeyboardChar,
  setFocus,
  setStorage,
  swal,
  swallOption,
} from "../../../../helper";
import { handleInputOnBlurCommon } from "../../common/FlowTrxCommon";
import FormHoldBill from "../../modals/sale/form_hold_bill";
import ListHoldBill from "../../modals/sale/list_hold_bill";

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

const save = "ctrl+s";
const closing = "ctrl+c";
const reset = "ctrl+x";
const focusSearch = "ctrl+f";
const holdBill = "ctrl+h";
const listHoldBill = "ctrl+l";

class Sale extends Component {
  constructor(props) {
    super(props);
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
      catatan: "-",
      jenis_trx: "Tunai",
      userid: 0,
      searchby: 1,
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
      error: {
        location: "",
        customer: "",
        catatan: "",
      },
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
      idxQty: 0,
    };
    this.HandleRemove = this.HandleRemove.bind(this);
    this.HandleAddBrg = this.HandleAddBrg.bind(this);
    this.HandleOnBlur = this.HandleOnBlur.bind(this);
    this.HandleChangeInputValue = this.HandleChangeInputValue.bind(this);
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

    // set focus search
    onHandleKeyboardChar("f", (e) => {
      e.preventDefault();
      setFocus(this, "search");
    });
    // closing
    onHandleKeyboardChar("c", (e) => {
      e.preventDefault();
      this.handleClosing(e);
    });
    // form hold bill
    onHandleKeyboardChar("h", (e) => {
      e.preventDefault();
      this.handleHoldBill(e, "formHoldBill");
    });
    // list hold bill
    onHandleKeyboardChar("l", (e) => {
      e.preventDefault();
      this.handleHoldBill(e, "listHoldBill");
    });
    //simpan transaksi
    onHandleKeyboardChar("s", (e) => {
      e.preventDefault();
      this.HandleSubmit(e);
    });
    //reset transaksi
    onHandleKeyboardChar("x", (e) => {
      e.preventDefault();
      this.HandleReset(e);
    });
  }

  handleClickToggle(e) {
    e.preventDefault();
    this.setState({
      toggleSide: !this.state.toggleSide,
    });
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

  componentDidMount() {
    this.getData();
    let state = {
      modalClosing: false,
      modalHoldBill: false,
      modalListHoldBill: false,
    };
    let idHold = localStorage.objectHoldBill;
    if (isEmptyOrUndefined(idHold)) {
      Object.assign(state, { objectHoldBill: JSON.parse(idHold) });
    }
    this.setState(state);
    this.fetchProduct();
  }
  getProps(props) {
    let state = {};
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
      barcode: item.barcode,
      satuan: item.satuan,
      harga_old: item.harga,
      harga: item.harga,
      harga2: item.harga2,
      harga3: item.harga3,
      harga4: item.harga4,
      stock: item.stock,
      diskon_persen: item.diskon_persen,
      diskon_nominal: 0,
      ppn: item.ppn,
      qty: item.qty,
      hrg_beli: parseFloat(item.hrg_beli),
      kategori: item.kategori,
      services: item.services,
      tambahan: item.tambahan,
      isOpenPrice: item.isOpenPrice,
    };
    return finaldt;
  }

  handleCheckData(key, item) {
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
    }
    if (state === "location_tr") {
      this.setState({ location: res.value });
      destroy(table);
      this.getData();
    }
    if (state === "customer") {
      this.setState({ customer: res.value });
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

  HandleChangeSelect(state, res) {
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
      let val = parseInt(value, 10);
      if (isNaN(val) || val < 1) {
        Object.assign(this.state.brgval[i], { qty: 1 });
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
      } else if (column === "qty") {
        values = isNaN(val) ? 1 : val;
      }
      brgval[i] = { ...brgval[i], [column]: values };
      this.setState({ brgval });
    }
  }

  HandleFocusInputReset(e, i) {
    const column = e.target.name;
    const val = e.target.value;
    let brgval = [...this.state.brgval];
    if (column === "qty") {
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
      Object.assign(item, { isOpenPrice: false, qty: 0 });
    } else {
      Object.assign(item, { isOpenPrice: false });
    }
    this.handleCheckData(item.barcode, item);
    setTimeout(() => this[`qty-${btoa(item.barcode)}`].focus(), 500);
  }
  HandleAddBrg(e, item, index) {
    e.preventDefault();
    this.setState({
      isScroll: false,
      isClick: index,
    });
    this.HanldeSetAddBrg(item, "", index);
  }
  HandleReset(e) {
    e.preventDefault();
    swallOption("anda yakin akan membatalkan transaksi ini ?", () => {
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
          let ppnInt = parseInt(item.ppn, 10);
          let disc_rp = parseInt(item.diskon_nominal, 10);
          let disc_per = parseInt(item.diskon_persen, 10);
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

          subtotal +=
            (disc2 === 0 ? hrg + ppn : disc2 + ppn) * parseInt(item.qty, 10);
          detail.push({
            kode_trx: this.props.nota,
            subtotal:
              (disc2 === 0 ? hrg + ppn : disc2 + ppn) * parseInt(item.qty, 10),
            price: rmComma(item.harga),
            qty: item.qty,
            diskon: item.diskon_persen,
            kategori: item.kategori,
            tax: item.ppn,
            services: item.services,
            sku: item.barcode,
            open_price:
              rmComma(item.harga) === rmComma(item.harga_old)
                ? 0
                : rmComma(item.harga),
            hrg_beli: item.hrg_beli,
            nm_brg: item.nm_brg,
            satuan: item.satuan,
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
          gt:
            subtotal -
            subtotal * (parseFloat(this.state.discount_persen) / 100) +
            subtotal * (parseFloat(this.state.pajak) / 100),
          pemilik_kartu: "-",
          jenis_trx: "TUNAI",
          kd_cust: this.state.customer,
          kode_trx: this.props.nota,
          subtotal: subtotal,
          lokasi: this.state.location,
          kassa:
            atob(atob(Cookies.get("tnt="))) === "nov-jkt" ||
            atob(atob(Cookies.get("tnt="))) === "nov-bdg" ||
            atob(atob(Cookies.get("tnt="))) === "npos"
              ? "Z"
              : "Q",
          jns_kartu: "Debit",
          status: "LUNAS",
          optional_note: this.state.catatan,
        };

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
    if (!isEmptyOrUndefined(this.state.catatan, "catatan")) return;
    if (!isEmptyOrUndefined(this.state.location, "lokasi")) return;
    if (!isEmptyOrUndefined(this.state.customer, "customer")) return;
    if (!isEmptyOrUndefined(this.state.sales, "sales")) return;
    this.handleMasterDetail((res) => {
      if (res) {
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));

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
        where += `searchby=barcode`;
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
          where += `searchby=barcode`;
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
    if (this.state.isScroll === true) this.handleScroll();
    let totalsub = 0;
    return (
      <Layout page="Penjualan Barang">
        <div className="card">
          <div className="card-header">
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
              Penjualan Barang
            </h4>
            {atob(atob(Cookies.get("tnt="))) === "nov-jkt" ||
            atob(atob(Cookies.get("tnt="))) === "nov-bdg" ||
            atob(atob(Cookies.get("tnt="))) === "npos" ? (
              <h4 style={{ float: "right" }}>
                <button
                  className={"btn btn-primary"}
                  onClick={(e) => this.handleClosing(e)}
                >
                  Closing
                </button>
                <button
                  className="btn btn-outline-info ml-1"
                  onClick={(e) => this.handleHoldBill(e, "listHoldBill")}
                >
                  List Hold bill
                </button>
              </h4>
            ) : (
              ""
            )}
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
                    <div className="input-group input-group-sm">
                      <select
                        name="searchby"
                        className="form-control form-control-sm"
                        onChange={(e) => this.HandleCommonInputChange(e, false)}
                      >
                        <option value={1}>Kode Barang</option>
                        <option value={2}>Barcode</option>
                        <option value={3}>Deskripsi</option>
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
                        ? "Barcode"
                        : "Deskripsi"}
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
                        placeholder={`Search ${
                          localStorage.anySaleTrx !== undefined
                            ? localStorage.anySaleTrx
                            : ""
                        }`}
                        value={this.state.search}
                        onChange={(e) => this.HandleCommonInputChange(e, false)}
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
                                        fontSize: "12px",
                                      }}
                                    >
                                      {i.nm_brg}
                                    </div>
                                    <div
                                      className="status"
                                      style={{
                                        color: "#a1887f",
                                        fontWeight: "bold",
                                        wordBreak: "break-all",
                                        fontSize: "12px",
                                      }}
                                    >
                                      ({i.kd_brg})
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
                    <div className="row" style={{ zoom: "80%" }}>
                      <div className="col-md-2">
                        <div className="form-group">
                          <label>No. Transaksi</label>
                          <input
                            type="text"
                            readOnly
                            className="form-control"
                            id="nota"
                            value={this.props.nota}
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="form-group">
                          <label>Tanggal Order</label>
                          <input
                            type="date"
                            name={"tgl_order"}
                            className={"form-control"}
                            value={this.state.tgl_order}
                            onChange={(e) => this.HandleCommonInputChange(e)}
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <LokasiCommon
                          callback={(res) =>
                            this.HandleChangeSelect("location_tr", res)
                          }
                          dataEdit={this.state.location}
                        />
                      </div>
                      <div className="col-md-2">
                        <SelectCommon
                          label="Customer"
                          options={this.state.customer_data}
                          callback={(res) =>
                            this.HandleChangeSelect("customer_tr", res)
                          }
                          dataEdit={this.state.customer}
                        />
                      </div>
                      <div className="col-md-2">
                        <SelectCommon
                          label="Sales"
                          options={this.state.opSales}
                          callback={(res) =>
                            this.HandleChangeSelect("sales_tr", res)
                          }
                          dataEdit={this.state.sales}
                        />
                      </div>
                      <div className="col-md-2">
                        <div className="form-group">
                          <label>Catatan</label>
                          <textarea
                            style={{ height: "39px" }}
                            className="form-control"
                            id="exampleTextarea1"
                            rows={3}
                            defaultValue={this.state.catatan}
                            onChange={(e) => this.HandleCommonInputChange(e)}
                            name="catatan"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                  <div style={{ overflowX: "auto" }}>
                    <table className="table table-hover table-noborder">
                      <thead>
                        <tr>
                          <th className="middle nowrap text-center">#</th>
                          <th className="middle nowrap">barang</th>
                          <th className="middle nowrap">satuan</th>
                          <th className="middle nowrap">harga</th>
                          <th className="middle nowrap">stock</th>
                          <th className="middle nowrap">qty</th>
                          <th className="middle nowrap">disc 1 (%)</th>
                          <th className="middle nowrap">ppn</th>
                          <th className="middle nowrap">Subtotal</th>
                        </tr>
                      </thead>

                      <tbody>
                        {this.state.databrg.map((item, index) => {
                          let disc1 = 0;
                          let disc2 = 0;
                          let ppn = 0;
                          let hrg = parseFloat(rmComma(item.harga));
                          let ppnInt = parseFloat(item.ppn);
                          let disc_rp = parseFloat(item.diskon_nominal);
                          let disc_per = parseFloat(item.diskon_persen);
                          // 2000-(2000*(10/100)) = 1800 // diskon 1 (%)
                          // 1800-(1800*(10/100)) = 1620 // diskon 2 (%)
                          // 2000+(2000*(10/100)) = 2200 // ppn
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
                                <a
                                  style={{
                                    height: "20px",
                                    width: "20px",
                                    padding: "0px",
                                    margin: "0px",
                                  }}
                                  href="about:blank"
                                  className="btn btn-danger btn-sm mr-1"
                                  onClick={(e) => this.HandleRemove(e, item.id)}
                                >
                                  <i className="fa fa-trash" />
                                </a>
                              </td>
                              <td
                                className="middle nowrap"
                                style={{ zoom: "80%" }}
                              >
                                {item.nm_brg}
                                <br />
                                {item.barcode}
                              </td>
                              <td className="middle nowrap">{item.satuan}</td>
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
                                    onBlur={(e) => this.HandleOnBlur(e, index)}
                                    onChange={(e) =>
                                      this.HandleChangeInputValue(e, index)
                                    }
                                  />
                                ) : (
                                  <select
                                    className="form-control in-table"
                                    style={{ width: "100px" }}
                                    name="harga"
                                    onBlur={(e) => this.HandleOnBlur(e, index)}
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
                                          this.state.brgval[index].harga === "0"
                                            ? "none"
                                            : "",
                                      }}
                                    >
                                      {toCurrency(
                                        this.state.brgval[index].harga
                                      )}
                                    </option>
                                    <option
                                      value={this.state.brgval[index].harga2}
                                      style={{
                                        display:
                                          this.state.brgval[index].harga2 ===
                                            "" ||
                                          this.state.brgval[index].harga2 ===
                                            "0"
                                            ? "none"
                                            : "",
                                      }}
                                    >
                                      {toCurrency(
                                        this.state.brgval[index].harga2
                                      )}
                                    </option>
                                    <option
                                      value={this.state.brgval[index].harga3}
                                      style={{
                                        display:
                                          this.state.brgval[index].harga3 ===
                                            "" ||
                                          this.state.brgval[index].harga3 ===
                                            "0"
                                            ? "none"
                                            : "",
                                      }}
                                    >
                                      {toCurrency(
                                        this.state.brgval[index].harga3
                                      )}
                                    </option>
                                    <option
                                      value={this.state.brgval[index].harga4}
                                      style={{
                                        display:
                                          this.state.brgval[index].harga4 ===
                                            "" ||
                                          this.state.brgval[index].harga4 ===
                                            "0"
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
                                    // paddingTop: "10px",
                                  }}
                                  type="checkbox"
                                  name="isOpenPrice"
                                  checked={this.state.brgval[index].isOpenPrice}
                                  onChange={(e) =>
                                    this.handleChecked(e, index, item.barcode)
                                  }
                                />{" "}
                                <label
                                  for="isOpenPrice"
                                  style={{ fontSize: "10px" }}
                                >
                                  Open Price
                                </label>
                              </td>
                              <td className="middle nowrap">
                                <input
                                  readOnly={true}
                                  type="number"
                                  value={item.stock}
                                  className="form-control text-right in-table"
                                  style={{ width: "70px" }}
                                />
                              </td>

                              <td className="middle nowrap">
                                <input
                                  type="text"
                                  name="qty"
                                  style={{ width: "70px" }}
                                  ref={(input) => {
                                    if (input !== null) {
                                      this[`qty-${btoa(item.barcode)}`] = input;
                                    }
                                  }}
                                  onFocus={(e) =>
                                    this.HandleFocusInputReset(e, index)
                                  }
                                  onBlur={(e) => this.HandleOnBlur(e, index)}
                                  className="form-control text-right in-table"
                                  onChange={(e) =>
                                    this.HandleChangeInputValue(e, index)
                                  }
                                  value={this.state.brgval[index].qty}
                                />
                                <div
                                  className="invalid-feedback text-center"
                                  style={
                                    parseFloat(
                                      this.state.brgval[index].autoSetQty
                                    ) > parseFloat(item.stockautoSetQty)
                                      ? {
                                          display: "block",
                                        }
                                      : {
                                          display: "none",
                                        }
                                  }
                                >
                                  Qty Melebihi Stock.
                                </div>
                              </td>
                              <td className="middle nowrap">
                                <input
                                  type="number"
                                  name="diskon_persen"
                                  style={{ width: "70px" }}
                                  className="form-control in-table text-right"
                                  onBlur={(e) => this.HandleOnBlur(e, index)}
                                  onChange={(e) =>
                                    this.HandleChangeInputValue(e, index)
                                  }
                                  value={this.state.brgval[index].diskon_persen}
                                />
                              </td>
                              <td className="middle nowrap">
                                <input
                                  type="number"
                                  name="ppn"
                                  style={{ width: "70px" }}
                                  className="form-control in-table text-right"
                                  onBlur={(e) => this.HandleOnBlur(e, index)}
                                  onChange={(e) =>
                                    this.HandleChangeInputValue(e, index)
                                  }
                                  value={this.state.brgval[index].ppn}
                                />
                              </td>

                              <td className="middle nowrap">
                                <input
                                  readOnly={true}
                                  type="text"
                                  value={toCurrency(subtot)}
                                  className="form-control text-right in-table"
                                  style={{ width: "100px" }}
                                />
                              </td>
                              {/*<td>{toCurrency((disc2===0?hrg+ppn:disc2+ppn)*parseInt(item.qty,10))}</td>*/}
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr style={{ background: "#eee" }}></tr>
                      </tfoot>
                    </table>
                  </div>
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
                        <button
                          onClick={(e) => this.HandleReset(e)}
                          className="btn btn-warning ml-1"
                        >
                          Reset
                        </button>
                        <button
                          className={"btn btn-primary  ml-1"}
                          onClick={(e) =>
                            this.handleHoldBill(e, "formHoldBill")
                          }
                        >
                          Hold bill
                        </button>
                      </div>
                    </div>
                    <div className="col-md-5">
                      <div className="pull-right">
                        <form className="form_head">
                          <div className="row" style={{ marginBottom: "3px" }}>
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
                          <div className="row" style={{ marginBottom: "3px" }}>
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
                          <div className="row" style={{ marginBottom: "3px" }}>
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
                          <div className="row" style={{ marginBottom: "3px" }}>
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
                                      (parseFloat(this.state.discount_persen) /
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

        <FormSale
          master={this.state.master}
          detail={this.state.detail}
          subtotal={totalsub}
          lokasi={this.props.dataDetailLocation}
        />

        {this.state.modalClosing && this.props.isOpen ? <FormClosing /> : null}
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
              this.setState({
                modalListHoldBill: false,
              });
              if (res !== "close" && res !== "delete") {
                destroy("sale");
                if (res.detail !== undefined) {
                  res.detail.map((val, index) => {
                    this.HanldeSetAddBrg(val, "hold", index);
                  });
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
});

export default connect(mapStateToPropsCreateItem)(Sale);
