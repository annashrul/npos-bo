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
import {
  FetchBrg,
  setProductbrg,
} from "redux/actions/masterdata/product/product.action";
import { FetchSupplierAll } from "redux/actions/masterdata/supplier/supplier.action";
import {
  FetchNota,
  storePo,
} from "redux/actions/purchase/purchase_order/po.action";
import Select from "react-select";
import Swal from "sweetalert2";
import moment from "moment";
import StickyBox from "react-sticky-box";
import { toRp, ToastQ } from "helper";
import { rmComma, swal, swallOption, toCurrency } from "../../../../helper";
import Spinner from "Spinner";
import { HEADERS } from "../../../../redux/actions/_constants";
import TableCommon from "../../common/TableCommon";
import Cookies from "js-cookie";
import ButtonTrxCommon from "../../common/ButtonTrxCommon";

const table = "purchase_order";

class PurchaseOrder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addingItemName: "",
      databrg: [],
      brgval: [],
      tgl_order: moment(new Date()).format("yyyy-MM-DD"),
      tgl_kirim: moment(new Date()).format("yyyy-MM-DD"),
      harga_beli: 0,
      diskon: 0,
      ppn: 0,
      qty: 0,
      location_data: [],
      location: "",
      location_val: "",
      supplier: "",
      catatan: "-",
      jenis_trx: "Tunai",
      userid: 0,
      searchby: 3,
      search: "",
      perpage: 5,
      scrollPage: 0,
      isScroll: false,
      toggleSide: false,
      isShowHargaBeli: true,
      error: {
        location: "",
        supplier: "",
        catatan: "",
      },
    };
    this.HandleRemove = this.HandleRemove.bind(this);
    this.HandleAddBrg = this.HandleAddBrg.bind(this);
    this.HandleChangeInput = this.HandleChangeInput.bind(this);
    this.HandleChangeInputValue = this.HandleChangeInputValue.bind(this);
    this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
    this.HandleChangeSupplier = this.HandleChangeSupplier.bind(this);
    this.setTglOrder = this.setTglOrder.bind(this);
    this.setTglEx = this.setTglEx.bind(this);
    this.HandleReset = this.HandleReset.bind(this);
    this.HandleSearch = this.HandleSearch.bind(this);
    this.HandleCommonInputChange = this.HandleCommonInputChange.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleClickToggle = this.handleClickToggle.bind(this);
  }
  handleClickToggle(e) {
    e.preventDefault();
    this.setState({
      toggleSide: !this.state.toggleSide,
    });
  }
  componentDidMount() {
    this.props.dispatch(FetchSupplierAll());
    this.getData();
    if (localStorage.lk !== undefined && localStorage.lk !== "") {
      this.props.dispatch(FetchNota(localStorage.lk));
      this.setState({
        location: localStorage.lk,
      });
    }
    if (localStorage.sp !== undefined && localStorage.sp !== "") {
      this.setState({
        supplier: localStorage.sp,
      });
    }
    if (
      localStorage.sp !== undefined &&
      localStorage.sp !== "" &&
      localStorage.lk !== undefined &&
      localStorage.lk !== ""
    ) {
      if (this.getConfigSupplier() === 0) {
        this.props.dispatch(
          FetchBrg(1, "barcode", "", localStorage.lk, null, this.autoSetQty, 5)
        );
      } else {
        this.props.dispatch(
          FetchBrg(
            1,
            "barcode",
            "",
            localStorage.lk,
            localStorage.sp,
            this.autoSetQty,
            5
          )
        );
      }
    }
  }
  getProps(param) {
    let perpage = this.state.perpage;
    if (param.barang && param.barang.length === perpage) {
      this.setState({
        perpage: perpage + 5,
      });
    }
    if (param.auth.user) {
      let lk = [];
      let loc = param.auth.user.lokasi;
      if (loc !== undefined) {
        loc.map((i) => {
          lk.push({
            value: i.kode,
            label: i.nama,
          });
          return null;
        });
        this.setState({
          location_data: lk,
          userid: param.auth.user.id,
        });
      }
    }
    if (param.barang && param.barang.length > 0) {
      this.getData();
    }
  }
  componentWillReceiveProps = (nextProps) => {
    this.getProps(nextProps);
  };
  componentWillMount() {
    this.getProps(this.props);
  }
  componentWillUnmount() {
    this.props.dispatch(
      setProductbrg({ status: "", msg: "", result: { data: [] } })
    );
    destroy(table);
    localStorage.removeItem("sp");
    localStorage.removeItem("lk");
    localStorage.removeItem("anyPurchaseOrder");
  }
  HandleChangeLokasi(lk) {
    let err = Object.assign({}, this.state.error, {
      location: "",
    });
    this.setState({
      location: lk.value,
      location_val: lk.label,
      error: err,
    });
    localStorage.setItem("lk", lk.value);
    this.props.dispatch(FetchNota(lk.value));
    if (this.state.supplier !== "") {
      if (this.getConfigSupplier() === 0) {
        this.props.dispatch(
          FetchBrg(1, "barcode", "", lk.value, null, this.autoSetQty)
        );
      } else {
        this.props.dispatch(
          FetchBrg(
            1,
            "barcode",
            "",
            lk.value,
            this.state.supplier,
            this.autoSetQty
          )
        );
      }
    }
    destroy(table);
    this.getData();
  }
  HandleChangeSupplier(sp) {
    let err = Object.assign({}, this.state.error, {
      supplier: "",
    });
    this.setState({
      supplier: sp.value,
      error: err,
      isScroll: true,
    });
    localStorage.setItem("sp", sp.value);

    if (this.state.location !== "") {
      if (this.getConfigSupplier() === 0) {
        this.props.dispatch(
          FetchBrg(
            1,
            "barcode",
            "",
            this.state.location,
            null,
            this.autoSetQty,
            5
          )
        );
      } else {
        this.props.dispatch(
          FetchBrg(
            1,
            "barcode",
            "",
            this.state.location,
            sp.value,
            this.autoSetQty,
            5
          )
        );
      }
    }
    destroy(table);
    this.getData();
  }
  handleChange(e, errs = true) {
    const column = e.target.name;
    const val = e.target.value;
    this.setState({
      [column]: val,
    });
    if (errs) {
      let err = Object.assign({}, this.state.error, {
        [column]: "",
      });
      this.setState({
        error: err,
      });
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
  HandleChangeInput(e, id) {
    const column = e.target.name;
    const val = e.target.value;

    const cek = cekData("barcode", id, table);
    cek.then((res) => {
      if (res === undefined) {
        ToastQ.fire({
          icon: "error",
          title: `not found.`,
        });
      } else {
        let final = {};
        if (column === "ppn_nominal") {
          Object.keys(res).forEach((k, i) => {
            if (k !== "ppn") {
              final[k] = res[k];
            } else {
              final["ppn"] =
                (parseFloat(val, 10) / parseFloat(res.harga_beli, 10)) * 100;
            }
          });
        } else if (column === "qty") {
          Object.keys(res).forEach((k, i) => {
            if (k !== "qty") {
              final[k] = res[k];
            } else {
              final["qty"] = val === "" ? 1 : val;
            }
          });
        } else {
          Object.keys(res).forEach((k, i) => {
            if (k !== column) {
              final[k] = res[k];
            } else {
              final[column] = val;
            }
          });
        }
        update(table, final);
        ToastQ.fire({
          icon: "success",
          title: `${column} has been changed.`,
        });
      }
      this.getData();
    });
  }
  HandleCommonInputChange(e, errs = true) {
    const column = e.target.name;
    const val = e.target.value;
    this.setState({
      [column]: val,
    });
    if (errs) {
      let err = Object.assign({}, this.state.error, {
        [column]: "",
      });
      this.setState({
        error: err,
      });
    }
  }
  HandleChangeInputValue(e, i, barcode = null, datas = []) {
    const column = e.target.name;
    const val = e.target.value;
    let brgval = [...this.state.brgval];
    brgval[i] = { ...brgval[i], [column]: val };
    this.setState({ brgval });
    if (column === "satuan") {
      const cek = cekData("barcode", barcode, table);
      cek.then((res) => {
        if (res === undefined) {
          ToastQ.fire({
            icon: "error",
            title: `not found.`,
          });
        } else {
          let newbrg = [];
          datas.map((i) => {
            if (i.satuan === val) {
              newbrg = i;
            }
            return null;
          });

          let final = {
            id: res.id,
            qty: 0,
            kd_brg: res.kd_brg,
            barcode: newbrg.barcode,
            satuan: newbrg.satuan,
            diskon: res.diskon,
            diskon2: res.diskon2,
            diskon3: 0,
            diskon4: 0,
            ppn: res.ppn,
            stock: newbrg.stock,
            harga_beli: newbrg.harga_beli,
            nm_brg: res.nm_brg,
            tambahan: res.tambahan,
          };
          update(table, final);
          ToastQ.fire({
            icon: "success",
            title: `${column} has been changed.`,
          });
        }
        this.getData();
      });
    }
  }
  setTglOrder(date) {
    this.setState({
      tgl_order: date,
    });
  }
  setTglEx(date) {
    this.setState({
      tgl_kirim: date,
    });
  }
  HandleRemove(e, id) {
    e.preventDefault();
    swallOption("Anda yakin akan mengahpus data ini ?", () => {
      del(table, id).then((res) => {
        this.getData();
        swal("data berhasil dihapus");
        // Swal.fire("Deleted!", "Your data has been deleted.", "success");
      });
    });
  }
  HandleAddBrg(e, item, index) {
    e.preventDefault();
    this.setState({
      isScroll: false,
    });
    const finaldt = {
      kd_brg: item.kd_brg,
      barcode: item.barcode,
      ukuran: item.ukuran,
      satuan: item.satuan,
      diskon: item.diskon,
      diskon2: 0,
      diskon3: 0,
      diskon4: 0,
      ppn: item.ppn,
      harga_beli: rmComma(item.harga_beli),
      qty: item.qty,
      stock: item.stock,
      nm_brg: item.nm_brg,
      tambahan: item.tambahan,
    };
    const cek = cekData("kd_brg", item.kd_brg, table);
    cek.then((res) => {
      if (res === undefined) {
        store(table, finaldt);
      } else {
        update(table, {
          id: res.id,
          qty: parseFloat(res.qty) + 1,
          kd_brg: res.kd_brg,
          ukuran: item.ukuran,
          barcode: res.barcode,
          satuan: res.satuan,
          diskon: res.diskon,
          diskon2: res.diskon2,
          diskon3: 0,
          diskon4: 0,
          ppn: res.ppn,
          stock: res.stock,
          harga_beli: res.harga_beli,
          nm_brg: res.nm_brg,
          tambahan: res.tambahan,
        });
      }

      this.getData();
      setTimeout(() => this[`qty-${btoa(finaldt.barcode)}`].focus(), 500);
    });
  }
  HandleReset(e) {
    e.preventDefault();
    swallOption("anda yakin akan membatalkan transaksi ini ?", () => {
      destroy(table);
      localStorage.removeItem("sp");
      localStorage.removeItem("lk");
      this.getData();
    });
  }
  HandleSubmit(e) {
    e.preventDefault();

    // validator head form
    let err = this.state.error;
    if (
      this.state.catatan === "" ||
      this.state.location === "" ||
      this.state.supplier === ""
    ) {
      if (this.state.catatan === "") {
        err = Object.assign({}, err, {
          catatan: "Catatan tidak boleh kosong.",
        });
      }
      if (this.state.location === "") {
        err = Object.assign({}, err, {
          location: "Lokasi tidak boleh kosong.",
        });
      }

      if (this.state.supplier === "") {
        err = Object.assign({}, err, {
          supplier: "Supplier tidak boleh kosong.",
        });
      }
      this.setState({
        error: err,
      });
    } else {
      const data = get(table);
      data.then((res) => {
        if (res.length === 0) {
          swal("Pilih barang untuk melanjutkan PO.");
        } else {
          swallOption("Pastikan data yang anda masukan sudah benar!", () => {
            let subtotal = 0;
            let detail = [];
            res.map((item) => {
              let disc1 = 0;
              let disc2 = 0;
              let ppn = 0;
              if (item.diskon !== 0) {
                disc1 =
                  parseInt(rmComma(item.harga_beli), 10) *
                  (parseFloat(item.diskon) / 100);
                disc2 = disc1;
                if (item.diskon2 !== 0) {
                  disc2 = disc1 * (parseFloat(item.diskon2) / 100);
                }
              }
              if (item.ppn !== 0) {
                ppn =
                  parseInt(rmComma(item.harga_beli), 10) *
                  (parseFloat(item.ppn) / 100);
              }
              subtotal +=
                (parseInt(rmComma(item.harga_beli), 10) - disc2 + ppn) *
                parseFloat(item.qty);
              detail.push({
                kd_brg: item.kd_brg,
                barcode: item.barcode,
                satuan: item.satuan,
                diskon: item.diskon,
                diskon2: item.diskon2,
                diskon3: item.diskon3,
                diskon4: item.diskon4,
                ppn: item.ppn,
                harga_beli: rmComma(item.harga_beli),
                qty: item.qty,
              });
              return null;
            });
            let data_final = {
              isShowHargaBeli: this.state.isShowHargaBeli ? 1 : 0,
              tgl_order: moment(this.state.tgl_order).format("YYYY-MM-DD"),
              tgl_kirim: moment(this.state.tgl_kirim).format("YYYY-MM-DD"),
              catatan: this.state.catatan,
              jenis_transaksi: this.state.jenis_trx,
              supplier: this.state.supplier,
              lokasi: this.state.location,
              userid: this.state.userid,
              sub_total: subtotal,
              detail: detail,
            };
            let parsedata = {};
            parsedata["detail"] = data_final;
            parsedata["master"] = this.state.databrg;
            parsedata["nota"] = this.props.nota;
            parsedata["logo"] = this.props.auth.user.logo;
            parsedata["user"] = this.props.auth.user.username;
            parsedata["lokasi_beli"] = this.state.location_val;
            this.props.dispatch(
              storePo(parsedata, (arr) => this.props.history.push(arr))
            );
          });
        }
      });
    }
  }
  autoSetQty(kode, data) {
    const cek = cekData("kd_brg", kode, table);
    return cek.then((res) => {
      if (res === undefined) {
        store(table, {
          kd_brg: data[0].kd_brg,
          barcode: data[0].barcode,
          ukuran: data[0].ukuran,
          satuan: data[0].satuan,
          diskon: 0,
          diskon2: 0,
          diskon3: 0,
          diskon4: 0,
          ppn: 0,
          harga_beli: data[0].harga_beli,
          qty: 1,
          stock: data[0].stock,
          nm_brg: data[0].nm_brg,
          tambahan: data[0].tambahan,
        });
      } else {
        update(table, {
          id: res.id,
          qty: parseFloat(res.qty) + 1,
          kd_brg: res.kd_brg,
          barcode: res.barcode,
          ukuran: res.ukuran,
          satuan: res.satuan,
          diskon: res.diskon,
          diskon2: res.diskon2,
          diskon3: 0,
          diskon4: 0,
          ppn: res.ppn,
          stock: res.stock,
          harga_beli: res.harga_beli,
          nm_brg: res.nm_brg,
          tambahan: res.tambahan,
        });
      }
      return true;
    });
  }
  HandleSearch() {
    if (this.state.supplier === "" || this.state.location === "") {
      Swal.fire(
        "Gagal!",
        "Pilih lokasi dan supplier terlebih dahulu.",
        "error"
      );
    } else {
      localStorage.setItem("anyPurchaseOrder", this.state.search);
      const searchby =
        parseInt(this.state.searchby, 10) === 1
          ? "kd_brg"
          : parseInt(this.state.searchby, 10) === 2
            ? "ukuran"
            : "deskripsi";
      if (this.getConfigSupplier() === 0) {
        this.props.dispatch(
          FetchBrg(
            1,
            searchby,
            this.state.search,
            this.state.location,
            null,
            this.autoSetQty,
            5
          )
        );
      } else {
        this.props.dispatch(
          FetchBrg(
            1,
            searchby,
            this.state.search,
            this.state.location,
            this.state.supplier,
            this.autoSetQty,
            5
          )
        );
      }
      this.setState({ search: "" });
    }
  }
  getData() {
    const data = get(table);
    data.then((res) => {
      let brg = [];
      res.map((i) => {
        brg.push({
          harga_beli: i.harga_beli,
          diskon: i.diskon,
          ppn: i.ppn,
          ppn_nominal: parseInt(i.harga_beli, 10) * (parseFloat(i.ppn) / 100),
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
    let perpage = parseInt(this.props.paginBrg.per_page, 10);
    let lengthBrg = parseInt(this.props.barang.length, 10);
    if (perpage === lengthBrg || perpage < lengthBrg) {
      let searchby = "";
      if (
        parseInt(this.state.searchby, 10) === 1 ||
        this.state.searchby === ""
      ) {
        searchby = "kd_brg";
      }
      if (parseInt(this.state.searchby, 10) === 2) {
        searchby = "ukuran";
      }
      if (parseInt(this.state.searchby, 10) === 3) {
        searchby = "deskripsi";
      }
      if (this.getConfigSupplier() === 0) {
        this.props.dispatch(
          FetchBrg(
            1,
            searchby,
            localStorage.anyPurchaseOrder !== undefined
              ? localStorage.anyPurchaseOrder
              : "",
            this.state.location,
            null,
            this.autoSetQty,
            this.state.perpage
          )
        );
      } else {
        this.props.dispatch(
          FetchBrg(
            1,
            searchby,
            localStorage.anyPurchaseOrder !== undefined
              ? localStorage.anyPurchaseOrder
              : "",
            this.state.location,
            this.state.supplier,
            this.autoSetQty,
            this.state.perpage
          )
        );
      }
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

  getConfigSupplier() {
    const config = this.props.auth.user.use_supplier;
    return parseInt(config, 10);
  }

  render() {
    if (this.state.isScroll === true) this.handleScroll();

    let opSupplier = [];
    if (this.props.supplier !== []) {
      this.props.supplier.map((i) => {
        opSupplier.push({
          value: i.kode,
          label: i.nama,
        });
        return null;
      });
    }
    let subtotal = 0;
    const columnStyle = {
      verticalAlign: "middle",
      textAlign: "center",
      whiteSpace: "nowrap",
    };
    const head = [
      { rowSpan: 2, label: "No" },
      { rowSpan: 2, label: "Barang" },
      { rowSpan: 2, label: "Variasi" },
      { rowSpan: 2, label: "Satuan", width: "1%" },
      { rowSpan: 2, label: "Harga beli", width: "1%" },
      { colSpan: 2, label: "Diskon", width: "1%" },
      { rowSpan: 2, label: "Ppn", width: "1%" },
      { rowSpan: 2, label: "Stok", width: "1%" },
      { rowSpan: 2, label: "Qty", width: "1%" },
      { rowSpan: 2, label: "Subtotal", width: "1%" },
      { rowSpan: 2, label: "#", className: "text-center", width: "1%" },
    ];
    const rowSpan = [{ label: "%" }, { label: "Rp" }];
    return (
      <Layout page="Purchase Order">
        <div className="card">
          <div className="card-header">
            <h4>
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
              </button>{" "}
              Purchase Order #{this.props.nota}
            </h4>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <StickyBox
              offsetTop={100}
              offsetBottom={20}
              style={
                this.state.toggleSide
                  ? { display: "none", width: "25%", marginRight: "10px" }
                  : { display: "block", width: "25%", marginRight: "10px" }
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
                        <option value={3}>Nama Barang</option>
                        <option value={1}>Kode Barang</option>
                        <option value={2}>Variasi</option>
                      </select>
                    </div>
                    <small
                      id="passwordHelpBlock"
                      className="form-text text-muted"
                    >
                      Cari berdasarkan{" "}
                      {parseInt(this.state.searchby, 10) === 1
                        ? "Kode Barang"
                        : parseInt(this.state.searchby, 10) === 2
                          ? "Ukuran"
                          : "Deskripsi"}
                    </small>
                  </div>
                  <div className="form-group">
                    <div className="input-group input-group-sm">
                      <input
                        autoFocus
                        type="text"
                        id="chat-search"
                        name="search"
                        className="form-control form-control-sm"
                        placeholder={`Search ${localStorage.anyPurchaseOrder !== undefined
                          ? localStorage.anyPurchaseOrder
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
                      zoom: "90%",
                      height: "300px",
                      maxHeight: "100%",
                      overflowY: "scroll",
                    }}
                  >
                    {!this.props.loadingbrg ? (
                      <div id="chat_user_2">
                        <ul className="chat-list list-unstyled">
                          {this.props.barang &&
                            this.props.barang.length !== 0 ? (
                            this.props.barang.map((i, inx) => {
                              return (
                                <li
                                  style={{
                                    backgroundColor:
                                      this.state.scrollPage === inx
                                        ? "#eeeeee"
                                        : "",
                                  }}
                                  id={`item${inx}`}
                                  className="clearfix"
                                  key={inx}
                                  onClick={(e) =>
                                    this.HandleAddBrg(e, {
                                      kd_brg: i.kd_brg,
                                      barcode: i.barcode,
                                      ukuran: i.ukuran,
                                      satuan: i.satuan,
                                      diskon: 0,
                                      diskon2: 0,
                                      ppn: 0,
                                      harga_beli: i.harga_beli,
                                      qty: 1,
                                      stock: i.stock,
                                      nm_brg: i.nm_brg,
                                      tambahan: i.tambahan,
                                    })
                                  }
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
                                        color: "black",
                                        fontWeight: "bold",
                                        wordBreak: "break-all",
                                        fontSize: "12px",
                                      }}
                                    >
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
                this.state.toggleSide ? { width: "100%" } : { width: "75%" }
              }
            >
              <div className="card">
                <div className="card-body">
                  <form className="" style={{ zoom: "85%" }}>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="control-label font-12">
                            Lokasi
                          </label>
                          <Select
                            options={this.state.location_data}
                            placeholder="Pilih Lokasi"
                            onChange={this.HandleChangeLokasi}
                            value={this.state.location_data.find((op) => {
                              return op.value === this.state.location;
                            })}
                          />
                          <div
                            className="invalid-feedback"
                            style={
                              this.state.error.location !== ""
                                ? { display: "block" }
                                : { display: "none" }
                            }
                          >
                            {this.state.error.location}
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="control-label font-12">
                            Supplier
                          </label>
                          <Select
                            options={opSupplier}
                            placeholder="Pilih Supplier"
                            onChange={this.HandleChangeSupplier}
                            value={opSupplier.find((op) => {
                              return op.value === this.state.supplier;
                            })}
                          />
                          <div
                            className="invalid-feedback"
                            style={
                              this.state.error.supplier !== ""
                                ? { display: "block" }
                                : { display: "none" }
                            }
                          >
                            {this.state.error.supplier}
                          </div>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label className="control-label font-12">
                                Tanggal Order
                              </label>
                              <input
                                type="date"
                                name={"tgl_order"}
                                className={"form-control"}
                                value={this.state.tgl_order}
                                onChange={(e) =>
                                  this.HandleCommonInputChange(e)
                                }
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label className="control-label font-12">
                                Tanggal Kirim
                              </label>
                              <input
                                type="date"
                                name={"tgl_kirim"}
                                className={"form-control"}
                                value={this.state.tgl_kirim}
                                onChange={(e) =>
                                  this.HandleCommonInputChange(e)
                                }
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="row">
                              <div
                                className="col-md-12"
                                style={{
                                  marginTop:
                                    atob(atob(Cookies.get("tnt="))) === "rb" ||
                                      atob(atob(Cookies.get("tnt="))) === "npos"
                                      ? "-10px"
                                      : "0px",
                                }}
                              >
                                <label className="control-label font-12">
                                  Jenis Transaksi
                                </label>
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <div className="custom-control custom-radio">
                                        <input
                                          type="radio"
                                          id="customRadio1"
                                          name="jenis_trx"
                                          onChange={(e) =>
                                            this.HandleCommonInputChange(e)
                                          }
                                          value="Tunai"
                                          className="custom-control-input"
                                          checked={
                                            this.state.jenis_trx === "Tunai"
                                          }
                                        />
                                        <label
                                          className="custom-control-label"
                                          htmlFor="customRadio1"
                                        >
                                          Tunai
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <div className="custom-control custom-radio">
                                        <input
                                          type="radio"
                                          id="customRadio2"
                                          name="jenis_trx"
                                          onChange={(e) =>
                                            this.HandleCommonInputChange(e)
                                          }
                                          value="Kredit"
                                          className="custom-control-input"
                                          checked={
                                            this.state.jenis_trx === "Kredit"
                                          }
                                        />
                                        <label
                                          className="custom-control-label"
                                          htmlFor="customRadio2"
                                        >
                                          Kredit
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div
                                className="col-md-12"
                                style={{
                                  marginTop: "-15px",
                                  display:
                                    atob(atob(Cookies.get("tnt="))) === "rb" ||
                                      atob(atob(Cookies.get("tnt="))) === "npos"
                                      ? "block"
                                      : "none",
                                }}
                              >
                                <div className="form-group">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="exampleCheck1"
                                    value={this.state.isShowHargaBeli}
                                    onChange={(e) => {
                                      this.setState({
                                        isShowHargaBeli: !e.target.checked,
                                      });
                                    }}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="exampleCheck1"
                                  >
                                    &nbsp; Sembunyikan harga beli di nota ?
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="control-label font-12">
                            Catatan
                          </label>
                          <textarea
                            name={"catatan"}
                            className="form-control"
                            onChange={(e) => this.HandleCommonInputChange(e)}
                            style={{ height: "122px" }}
                          >
                            {this.state.catatan}
                          </textarea>
                        </div>
                      </div>
                    </div>
                  </form>
                  <TableCommon
                    head={head}
                    rowSpan={rowSpan}
                    renderRow={this.state.databrg.map((item, index) => {
                      let disc1 = 0;
                      let disc2 = 0;
                      let ppn = 0;

                      if (item.diskon !== 0) {
                        disc1 =
                          parseInt(rmComma(item.harga_beli), 10) *
                          (parseFloat(item.diskon) / 100);
                        disc2 = disc1;
                        if (item.diskon2 !== 0) {
                          disc2 = disc1 * (parseFloat(item.diskon2) / 100);
                        }
                      }
                      if (item.ppn !== 0) {
                        ppn =
                          parseInt(rmComma(item.harga_beli), 10) *
                          (parseFloat(item.ppn) / 100);
                      }
                      subtotal +=
                        (parseInt(rmComma(item.harga_beli), 10) - disc2 + ppn) *
                        parseFloat(item.qty);
                      return (
                        <tr key={index}>
                          <td className="middle nowrap">{index + 1}</td>
                          <td className="middle nowrap">
                            <small>
                              {item.nm_brg} <br />
                              {item.barcode}
                            </small>
                          </td>
                          <td className="middle nowrap">
                            {item.ukuran}
                          </td>
                          <td className="middle nowrap">
                            <select
                              style={{ width: "100px" }}
                              className="form-control in-table"
                              name="satuan"
                              onChange={(e) =>
                                this.HandleChangeInputValue(
                                  e,
                                  index,
                                  item.barcode,
                                  item.tambahan
                                )
                              }
                            >
                              {item.tambahan.map((i) => {
                                return (
                                  <option
                                    value={i.satuan}
                                    selected={i.satuan === item.satuan}
                                  >
                                    {i.satuan}
                                  </option>
                                );
                              })}
                            </select>
                          </td>
                          <td className="middle nowrap">
                            <input
                              style={{ width: "100px", textAlign: "right" }}
                              type="text"
                              name="harga_beli"
                              className="form-control in-table"
                              onBlur={(e) =>
                                this.HandleChangeInput(e, item.barcode)
                              }
                              onChange={(e) =>
                                this.HandleChangeInputValue(e, index)
                              }
                              value={toCurrency(
                                this.state.brgval[index].harga_beli
                              )}
                            />
                          </td>
                          <td className="middle nowrap">
                            <input
                              style={{ width: "100px", textAlign: "right" }}
                              type="text"
                              name="diskon"
                              className="form-control in-table"
                              onBlur={(e) =>
                                this.HandleChangeInput(e, item.barcode)
                              }
                              onChange={(e) =>
                                this.HandleChangeInputValue(e, index)
                              }
                              value={this.state.brgval[index].diskon}
                            />
                          </td>
                          <td className="middle nowrap">
                            <input
                              style={{ width: "100px", textAlign: "right" }}
                              className="form-control in-table"
                              type="text"
                              name="ppn"
                              onBlur={(e) =>
                                this.HandleChangeInput(e, item.barcode)
                              }
                              onChange={(e) =>
                                this.HandleChangeInputValue(e, index)
                              }
                              value={this.state.brgval[index].ppn}
                            />
                          </td>
                          <td className="middle nowrap">
                            <input
                              style={{ width: "100px", textAlign: "right" }}
                              className="form-control in-table"
                              type="text"
                              name="ppn_nominal"
                              onBlur={(e) =>
                                this.HandleChangeInput(e, item.barcode)
                              }
                              onChange={(e) =>
                                this.HandleChangeInputValue(e, index)
                              }
                              value={this.state.brgval[index].ppn_nominal}
                            />
                          </td>
                          <td className="middle nowrap">
                            <input
                              style={{ width: "100px", textAlign: "right" }}
                              readOnly
                              className="form-control in-table"
                              type="text"
                              value={item.stock}
                            />
                          </td>
                          <td className="middle nowrap">
                            <input
                              style={{ width: "100px", textAlign: "right" }}
                              type="text"
                              name="qty"
                              className="form-control in-table"
                              onBlur={(e) =>
                                this.HandleChangeInput(e, item.barcode)
                              }
                              onChange={(e) =>
                                this.HandleChangeInputValue(e, index)
                              }
                              onFocus={(e) =>
                                this.HandleFocusInputReset(e, index)
                              }
                              ref={(input) =>
                                (this[`qty-${btoa(item.barcode)}`] = input)
                              }
                              value={this.state.brgval[index].qty}
                            />
                          </td>
                          <td className="middle nowrap text-right">
                            {toRp(
                              (parseInt(rmComma(item.harga_beli), 10) -
                                disc2 +
                                ppn) *
                              parseFloat(item.qty)
                            )}
                          </td>
                          <td className="middle nowrap">
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={(e) => this.HandleRemove(e, item.id)}
                            >
                              <i className="fa fa-trash" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    footer={[
                      {
                        data: [
                          {
                            colSpan: 9,
                            label: "Total",
                            className: "text-left",
                          },
                          { colSpan: 1, label: toRp(subtotal) },
                        ],
                      },
                    ]}
                  />

                  <hr />
                  <div className="row">
                    <div className="col-md-12">
                      <ButtonTrxCommon
                        disabled={this.state.databrg.length < 1}
                        callback={(e, res) => {
                          if (res === "simpan") this.HandleSubmit(e);
                          if (res === "batal") this.HandleReset(e);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStateToPropsCreateItem = (state) => ({
  barang: state.productReducer.result_brg,
  loadingbrg: state.productReducer.isLoadingBrg,
  nota: state.poReducer.code,
  supplier: state.supplierReducer.dataSupllier,
  isLoading: state.poReducer.isLoading,
  auth: state.auth,
  paginBrg: state.productReducer.pagin_brg,
});

export default connect(mapStateToPropsCreateItem)(PurchaseOrder);
