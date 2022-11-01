import React, { Component } from "react";
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import Swal from "sweetalert2";
import { FetchSupplierAll } from "redux/actions/masterdata/supplier/supplier.action";
import { FetchBrg } from "redux/actions/masterdata/product/product.action";
import { setProductbrg } from "redux/actions/masterdata/product/product.action";
import {
  store,
  get,
  update,
  destroy,
  cekData,
  del,
} from "components/model/app.model";
import StickyBox from "react-sticky-box";
import { toRp, ToastQ } from "helper";
import Select from "react-select";
import moment from "moment";
import { storeReturTanpaNota } from "redux/actions/purchase/retur_tanpa_nota/return_tanpa_nota.action";
import { withRouter } from "react-router-dom";
import {
  handleError,
  isEmptyOrUndefined,
  rmComma,
  setFocus,
  swal,
  swallOption,
  toCurrency,
} from "../../../../helper";
import Spinner from "Spinner";
import { HEADERS } from "../../../../redux/actions/_constants";
import TableCommon from "../../common/TableCommon";
import ButtonTrxCommon from "../../common/ButtonTrxCommon";

const table = "retur_tanpa_nota";

class ReturTanpaNota extends Component {
  constructor(props) {
    super(props);
    this.state = {
      databrg: [],
      brgval: [],
      tanggal: moment(new Date()).format("yyyy-MM-DD"),
      location_data: [],
      location: "",
      location_val: "",
      location_nama: "",
      supplier_data: [],
      supplier: "",
      supplier_nama: "",
      catatan: "-",
      userid: 0,
      ambil_nota: "",
      searchby: 3,
      search: "",
      perpage: 5,
      scrollPage: 0,
      isScroll: false,
      isClick: 0,
      error: {
        location: "",
        supplier: "",
        catatan: "",
      },
      detail: [],
      master: {},
    };
    this.HandleRemove = this.HandleRemove.bind(this);
    this.HandleAddBrg = this.HandleAddBrg.bind(this);
    this.HandleChangeInput = this.HandleChangeInput.bind(this);
    this.HandleChangeInputValue = this.HandleChangeInputValue.bind(this);
    this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
    this.HandleChangeSupplier = this.HandleChangeSupplier.bind(this);
    this.setTanggal = this.setTanggal.bind(this);
    this.HandleReset = this.HandleReset.bind(this);
    this.HandleSearch = this.HandleSearch.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }
  componentDidMount() {
    this.props.dispatch(FetchSupplierAll());
    this.getData();
    if (localStorage.catatan !== undefined && localStorage.catatan !== "") {
      this.setState({
        catatan: localStorage.catatan,
      });
    }
    if (localStorage.lk !== undefined && localStorage.lk !== "") {
      this.setState({
        location: localStorage.lk,
        location_nama: localStorage.lk_nama,
      });
    }
    if (localStorage.sp !== undefined && localStorage.sp !== "") {
      this.setState({
        supplier: localStorage.sp,
        supplier_nama: localStorage.sp_nama,
      });
    }
    if (localStorage.lk !== undefined && localStorage.lk !== "") {
      this.props.dispatch(
        FetchBrg(1, "barcode", "", localStorage.lk, null, this.autoSetQty, 5)
      );
    }
  }
  componentWillReceiveProps = (nextProps) => {
    let perpage = this.state.perpage;
    if (nextProps.barang.length === perpage) {
      this.setState({
        perpage: perpage + 5,
      });
    }
    if (nextProps.auth.user) {
      let lk = [];
      let loc = nextProps.auth.user.lokasi;
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
          userid: nextProps.auth.user.id,
        });
      }
    }
    if (nextProps.barang.length > 0) {
      this.getData();
    }
  };
  componentWillUnmount() {
    this.props.dispatch(
      setProductbrg({ status: "", msg: "", result: { data: [] } })
    );
    destroy(table);
    localStorage.removeItem("sp");
    localStorage.removeItem("lk");
    localStorage.removeItem("lk_nama");
    localStorage.removeItem("sp_nama");
    localStorage.removeItem("ambil_data");
    localStorage.removeItem("nota");
    localStorage.removeItem("catatan");
    localStorage.removeItem("anyReturTanpaNota");
  }
  HandleChangeLokasi(lk) {
    let err = Object.assign({}, this.state.error, {
      location: "",
    });

    this.setState({
      location: lk.value,
      location_val: lk.label,
      location_nama: lk.label,
      error: err,
    });
    localStorage.setItem("lk", lk.value);
    localStorage.setItem("lk_nama", lk.label);

    this.props.dispatch(
      FetchBrg(1, "barcode", "", lk.value, null, this.autoSetQty, 5)
    );

    destroy(table);
    this.getData();
  }
  HandleChangeSupplier(sp) {
    let err = Object.assign({}, this.state.error, {
      supplier: "",
    });
    this.setState({
      supplier: sp.value,
      supplier_nama: sp.label,
      error: err,
      scrollPage: 5,
    });
    localStorage.setItem("sp", sp.value);
    localStorage.setItem("sp_nama", sp.label);
    // if (this.state.location !== "") {
    //   this.props.dispatch(FetchBrg(1, "barcode", "", this.state.location, sp.value, this.autoSetQty, 5));
    // }
    // destroy(table);
    // this.getData();
  }
  HandleCommonInputChange(e, errs = true, st = 0) {
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
        if (column === "qty_retur") {
          Object.keys(res).forEach((k, i) => {
            if (k !== "qty_retur") {
              final[k] = res[k];
            } else {
              final["qty_retur"] = val === "" ? 1 : val;
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
  HandleFocusInputReset(e, i) {
    const column = e.target.name;
    const val = e.target.value;
    let brgval = [...this.state.brgval];
    if (column === "qty_retur") {
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

            kd_brg: res.kd_brg,
            nm_brg: res.nm_brg,
            ukuran: res.ukuran,
            barcode: newbrg.barcode,
            satuan: newbrg.satuan,
            deskripsi: res.deskripsi,
            kondisi: res.kondisi,
            stock: newbrg.stock,
            harga_beli: newbrg.harga_beli,
            ppn: res.ppn,
            ket: "",
            qty_retur: 0,
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
  setTanggal(date) {
    this.setState({
      tanggal: date,
    });
  }
  HandleRemove(e, id) {
    e.preventDefault();
    swallOption("Anda yakin akan mengahpus data ini ?", () => {
      del(table, id).then((res) => {
        this.getData();
        swal("data berhasil dihapus");
      });
    });
  }
  HandleAddBrg(e, item, i) {
    e.preventDefault();
    this.setState({
      isScroll: false,
      isClick: i,
    });
    const finaldt = {
      kd_brg: item.kd_brg,
      nm_brg: item.nm_brg,
      ukuran: item.ukuran,
      barcode: item.barcode,
      satuan: item.satuan,
      deskripsi: item.deskripsi,
      kondisi: item.kondisi,
      stock: item.stock,
      ppn: item.ppn,
      harga_beli: rmComma(item.harga_beli),
      ket: item.ket,
      qty_retur: item.qty_retur,
      tambahan: item.tambahan,
    };
    const cek = cekData("kd_brg", item.kd_brg, table);
    cek.then((res) => {
      if (res === undefined) {
        store(table, finaldt);
      } else {
        update(table, {
          id: res.id,
          kd_brg: res.kd_brg,
          nm_brg: res.nm_brg,
          barcode: res.barcode,
          ukuran: res.ukuran,
          satuan: res.satuan,
          deskripsi: res.deskripsi,
          kondisi: res.kondisi,
          stock: res.stock,
          ppn: res.ppn,
          harga_beli: res.harga_beli,
          ket: res.ket,
          qty_retur: parseFloat(res.qty_retur) + 1,
          tambahan: res.tambahan,
        });
      }

      this.getData();
      setTimeout(() => this[`qty_retur-${btoa(finaldt.barcode)}`].focus(), 500);
    });
  }
  HandleReset(e) {
    e.preventDefault();
    swallOption("anda yakin akan membatalkan transaksi ini ?", () => {
      destroy(table);
      localStorage.removeItem("sp");
      localStorage.removeItem("lk");
      localStorage.removeItem("ambil_data");
      localStorage.removeItem("nota");
      localStorage.removeItem("catatan");
      localStorage.removeItem("anyReturTanpaNota");
      this.getData();
    });
  }
  HandleSubmit(e) {
    e.preventDefault();
    // validator head form
    if (!isEmptyOrUndefined(this.state.catatan)) {
      handleError("catatan");
      return;
    }
    if (!isEmptyOrUndefined(this.state.supplier)) {
      handleError("supplier");
      return;
    }
    const data = get(table);
    let masterOther = {
      supplier: this.state.supplier_nama,
      operator_nama: this.props.auth.user.nama,
      lokasi_nama: this.state.location_nama,
    };
    console.log(this.state.location_nama);
    console.log(this.state.supplier_nama);
    console.log(this.props.auth.user.nama);
    data.then((res) => {
      if (res.length === 0) {
        swal("Pilih barang untuk melanjutkan transaksi");
      } else {
        swallOption("Pastikan data yang anda masukan sudah benar!", () => {
          let data = {};
          let detail = [];
          data["tanggal"] = moment(this.state.tanggal).format("yyyy-MM-DD");
          data["supplier"] = this.state.supplier;
          data["keterangan"] = this.state.catatan;
          data["subtotal"] = localStorage.getItem("grand_total");
          data["lokasi"] = this.state.location;
          data["userid"] = this.state.userid;
          console.log(res);
          res.map((item) => {
            if (!isEmptyOrUndefined(item.kondisi)) {
              handleError(`kondisi barang ${item.nm_brg}`);
              setFocus(this, `kondisi_${item.barcode}`);
              return;
            }
            detail.push({
              kd_brg: item.kd_brg,
              barcode: item.barcode,
              ukuran: item.ukuran,
              satuan: item.satuan,
              qty: item.qty_retur,
              harga_beli: rmComma(item.harga_beli),
              keterangan: item.keterangan,
              kondisi: item.kondisi,
            });
            return null;
          });
          data["detail"] = detail;
          let parsedata = {};
          parsedata["detail"] = data;
          parsedata["master"] = this.state.databrg;
          parsedata["nota"] = "";
          parsedata["logo"] = this.props.auth.user.logo;
          parsedata["user"] = this.props.auth.user.username;
          parsedata["lokasi"] = this.state.location_val;
          // console.log({ master: masterOther, detail: detail });
          this.props.dispatch(
            storeReturTanpaNota(
              parsedata,
              { master: masterOther, detail: res },
              (arr) => this.props.history.push(arr)
            )
          );
        });
      }
    });
  }
  autoSetQty(kode, data) {
    const cek = cekData("kd_brg", kode, table);
    return cek.then((res) => {
      if (res === undefined) {
        store(table, {
          kd_brg: data[0].kd_brg,
          nm_brg: data[0].nm_brg,
          barcode: data[0].barcode,
          ukuran: data[0].ukuran,
          satuan: data[0].satuan,
          deskripsi: data[0].deskripsi,
          kondisi: data[0].kondisi,
          stock: data[0].stock,
          ppn: data[0].ppn,
          harga_beli: data[0].harga_beli,
          ket: data[0].ket,
          qty_retur: 1,
          tambahan: data[0].tambahan,
        });
      } else {
        update(table, {
          id: res.id,
          kd_brg: res.kd_brg,
          nm_brg: res.nm_brg,
          ukuran: res.ukuran,
          barcode: res.barcode,
          satuan: res.satuan,
          deskripsi: res.deskripsi,
          kondisi: res.kondisi,
          stock: res.stock,
          ppn: res.ppn,
          harga_beli: res.harga_beli,
          ket: res.ket,
          qty_retur: parseFloat(res.qty_retur) + 1,
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
      localStorage.setItem("anyReturTanpaNota", this.state.search);

      const searchby =
        parseInt(this.state.searchby, 10) === 1
          ? "kd_brg"
          : parseInt(this.state.searchby, 10) === 2
            ? "ukuran"
            : "deskripsi";
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
      this.setState({ search: "" });
    }
  }
  getData() {
    const data = get(table);
    data.then((res) => {
      let brg = [];
      res.map((i) => {
        brg.push({
          kondisi: i.kondisi,
          qty_retur: i.qty_retur,
          satuan: i.satuan,
          harga_beli: i.harga_beli,
          ket: i.ket,
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
      this.props.dispatch(
        FetchBrg(
          1,
          searchby,
          localStorage.anyReturTanpaNota !== undefined
            ? localStorage.anyReturTanpaNota
            : "",
          this.state.location,
          null,
          this.autoSetQty,
          this.state.perpage
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

  render() {
    if (this.state.isScroll === true) this.handleScroll();

    let total_stock = 0;
    let qty_retur = 0;
    let grand_total = 0;
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
    const head = [
      { rowSpan: 2, label: "No", width: "1%" },
      { rowSpan: 2, label: "Barang" },
      { rowSpan: 2, label: "Variasi" },
      { rowSpan: 2, label: "Satuan", width: "1%" },
      { rowSpan: 2, label: "Harga beli", width: "1%" },
      { rowSpan: 2, label: "Kondisi", width: "1%" },
      { rowSpan: 2, label: "Keterangan", width: "1%" },
      { rowSpan: 2, label: "Stok", width: "1%" },
      { rowSpan: 2, label: "Qty", width: "1%" },
      { rowSpan: 2, label: "Nilai retur", width: "1%" },
      { rowSpan: 2, label: "#", className: "text-center", width: "1%" },
    ];
    return (
      <Layout page="Retur Tanpa Nota">
        <div className="card">
          <div className="card-header">
            <h5>Retur Tanpa Nota {this.state.isScroll}</h5>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <StickyBox
              offsetTop={100}
              offsetBottom={20}
              style={{ width: "25%" }}
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
                          ? "Variasi"
                          : "Nama Baarang"}
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
                        placeholder={`Search ${localStorage.anyReturTanpaNota !== undefined
                            ? localStorage.anyReturTanpaNota
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
                                  onClick={(e) =>
                                    this.HandleAddBrg(
                                      e,
                                      {
                                        kd_brg: i.kd_brg,
                                        nm_brg: i.nm_brg,
                                        ukuran: i.ukuran,
                                        barcode: i.barcode,
                                        satuan: i.satuan,
                                        deskripsi: i.deskripsi,
                                        kondisi: i.kondisi,
                                        stock: i.stock,
                                        ppn: i.ppn,
                                        harga_beli: i.harga_beli,
                                        ket: "-",
                                        qty_retur: 1,
                                        tambahan: i.tambahan,
                                      },
                                      inx
                                    )
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
                                      className="about"
                                      style={{
                                        color: "#a1887f",
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
            <div style={{ width: "75%", zoom: "85%" }}>
              <div className="card">
                <div className="card-body">
                  <form className="">
                    <div className="row">
                      <div className="col-md-3">
                        <div className="form-group">
                          <label className="control-label font-12">
                            Tanggal Order
                          </label>
                          <input
                            type="date"
                            name={"tanggal"}
                            className={"form-control form-control-lg"}
                            value={this.state.tanggal}
                            onChange={(e) => this.HandleCommonInputChange(e)}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
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
                      </div>
                      <div className="col-md-3">
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
                      <div className="col-md-3">
                        <div className="form-group">
                          <label className="control-label font-12">
                            Catatan
                          </label>
                          <textarea
                            className="form-control"
                            id="exampleTextarea1"
                            rows={1}
                            onChange={(e) => this.HandleCommonInputChange(e)}
                            name="catatan"
                            value={this.state.catatan}
                            style={{ height: "39px" }}
                          />
                          <div
                            className="invalid-feedback"
                            style={
                              this.state.error.catatan !== ""
                                ? { display: "block" }
                                : { display: "none" }
                            }
                          >
                            {this.state.error.catatan}
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>

                  <TableCommon
                    head={head}
                    renderRow={this.state.databrg.map((item, index) => {
                      let total_retur =
                        parseInt(item.qty_retur, 10) *
                        parseInt(rmComma(item.harga_beli), 10);
                      grand_total = grand_total + total_retur;
                      localStorage.setItem("grand_total", grand_total);
                      qty_retur = qty_retur + parseInt(item.qty_retur, 10);
                      total_stock = total_stock + parseInt(item.stock, 10);
                      return (
                        <tr key={index}>
                          <td className="middle nowrap text-center">
                            {index + 1}
                          </td>
                          <td className="middle nowrap">
                            {item.nm_brg} <br />
                            {item.barcode}
                          </td>
                          <td className="middle nowrap">
                            {item.ukuran} 
                          </td>

                          <td className="middle nowrap">
                            <select
                              disabled={item.tambahan.length <= 1}
                              className="form-control in-table"
                              style={{ width: "100px" }}
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
                              className="form-control in-table"
                              style={{ width: "100px", textAlign: "right" }}
                              type="text"
                              name="harga_beli"
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
                            <select
                              className="form-control in-table"
                              style={{ width: "140px" }}
                              name="kondisi"
                              onChange={(e) =>
                                this.HandleChangeInput(e, item.barcode)
                              }
                              value={this.state.brgval[index].kondisi}
                              defaultValue={this.state.brgval[index].kondisi}
                              ref={(input) =>
                                (this[`kondisi_${item.barcode}`] = input)
                              }
                            >
                              <option value="">Pilih Kondisi</option>
                              <option value="bad_stock">Bad Stock</option>
                              <option value="good_stock">Good Stock</option>
                              <option value="dead_stock">Dead Stock</option>
                              <option value="over_stock">Over Stock</option>
                              <option value="expired_date">Expired Date</option>
                              <option value="slow_moving">Slow Moving</option>
                            </select>
                          </td>
                          <td className="middle nowrap">
                            <input
                              className="form-control in-table"
                              style={{ width: "100px" }}
                              type="text"
                              name="ket"
                              onBlur={(e) =>
                                this.HandleChangeInput(e, item.barcode)
                              }
                              onChange={(e) =>
                                this.HandleChangeInputValue(e, index)
                              }
                              value={this.state.brgval[index].ket}
                            />
                          </td>
                          <td className="middle nowrap text-right">
                            {item.stock}
                          </td>
                          <td className="middle nowrap">
                            <input
                              className="form-control in-table"
                              style={{ width: "100px", textAlign: "right" }}
                              type="text"
                              name="qty_retur"
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
                              (this[`qty_retur-${btoa(item.barcode)}`] =
                                input)
                              }
                              value={this.state.brgval[index].qty_retur}
                            />
                          </td>
                          <td className="middle nowrap text-right">
                            {toRp(total_retur)}
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
                            label: "Total",
                            colSpan: 6,
                            className: "text-left",
                          },
                          { label: toRp(total_stock), colSpan: 1 },
                          { label: toRp(qty_retur), colSpan: 1 },
                          { label: toRp(grand_total), colSpan: 1 },
                          { label: "", colSpan: 1 },
                        ],
                      },
                    ]}
                  />
                  <hr />
                  <div className="row">
                    <div className="col-md-7">
                      <div className="dashboard-btn-group d-flex align-items-center">
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
        </div>
      </Layout>
    );
  }
}

const mapStateToPropsCreateItem = (state) => ({
  barang: state.productReducer.result_brg,
  loadingbrg: state.productReducer.isLoadingBrg,
  supplier: state.supplierReducer.dataSupllier,
  auth: state.auth,
  paginBrg: state.productReducer.pagin_brg,
});

export default withRouter(connect(mapStateToPropsCreateItem)(ReturTanpaNota));
