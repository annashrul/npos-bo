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
import Select from "react-select";
import Swal from "sweetalert2";
import { Scrollbars } from "react-custom-scrollbars";
import { FetchBrgSame } from "redux/actions/masterdata/product/product.action";
import { FetchReport } from "redux/actions/purchase/receive/receive.action";
import Layout from "../Layout";
import ModalCetakBarcode from "../modals/modal_cetak_barcode";
import moment from "moment";
import { toRp } from "helper";
import AsyncSelect from "react-select/async";
import {
  FetchReceiveData,
  setPoData,
} from "redux/actions/purchase/receive/receive.action";
import axios from "axios";
import { HEADERS } from "redux/actions/_constants";
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
const filterColors = (inputValue) => {
  let search = "receive/report?page=1&perpage=40";
  if (inputValue !== "")
    search = "receive/report?page=1&perpage=40&q=" + inputValue;
  return axios
    .get(HEADERS.URL + search)
    .then(function (response) {
      const data = response.data;
      let options = [];
      data.result.data.map((i) => {
        options.push({
          value: i.no_faktur_beli,
          label: i.no_faktur_beli,
        });
        return null;
      });
      return options;
    })
    .catch(function (error) {
      return [];
    });
};
const loadOptions = (inputValue, callback) => {
  const results = filterColors(inputValue);
  results.then((res) => {
    callback(res);
  });
};
const table = "cetak_barcode";
class CetakBarcode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data_barcode: "",
      databrg: [],
      brgval: [],
      location_data: [],
      location: "",
      searchby: "3",
      search: "",
      userid: 0,
      ambil_data: 1,
      price_tag: false,
      all_product: false,
      error: {
        location: "",
      },
    };
    this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
    this.HandleCommonInputChange = this.HandleCommonInputChange.bind(this);
    this.HandleSearch = this.HandleSearch.bind(this);
    this.HandleAddBrg = this.HandleAddBrg.bind(this);
    this.HandleRemove = this.HandleRemove.bind(this);
    this.HandleReset = this.HandleReset.bind(this);
    this.HandleChangeInputValue = this.HandleChangeInputValue.bind(this);
    this.HandleChangeInput = this.HandleChangeInput.bind(this);
    this.HandleSubmit = this.HandleSubmit.bind(this);
    this.HandleChangeNota = this.HandleChangeNota.bind(this);
    this.handleChecked = this.handleChecked.bind(this);
    this.handleCheckedAllProduct = this.handleCheckedAllProduct.bind(this);
  }
  getProps(param) {
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
    if (param.barang.length > 0) {
      this.getData();
    }

    if (param.receive_data) {
      if (param.receive_data.master !== undefined) {
        if (this.props.receive_data === undefined) {
          this.setState({
            location: param.receive_data.master.lokasi,
            catatan: param.receive_data.master.catatan,
            no_faktur_beli: param.receive_data.master.no_faktur_beli,
          });
          localStorage.setItem("lk", param.receive_data.master.lokasi);
          localStorage.setItem("catatan", param.receive_data.master.catatan);

          param.receive_data.detail.map((item) => {
            const datas = {
              title: item.nm_brg,
              barcode: item.barcode,
              ukuran: item.ukuran,
              harga_jual: item.harga,
              qty: item.qty,
            };
            store(table, datas);
            this.getData();
            return null;
          });
        }
      }
    }
  }
  componentDidMount() {
    if (localStorage.lk !== undefined && localStorage.lk !== "") {
      this.setState({
        location: localStorage.lk,
      });
    }
    if (localStorage.lk !== undefined && localStorage.lk !== "") {
      this.props.dispatch(
        FetchBrgSame(1, "barcode", "", localStorage.lk, null, this.autoSetQty)
      );
    }
  }
  componentWillReceiveProps = (nextProps) => {
    this.getProps(nextProps);
  };

  componentWillMount() {
    this.getProps(this.props);
    localStorage.removeItem("all_product");
    localStorage.removeItem("price_tag");
  }
  componentWillUnmount() {
    localStorage.removeItem("all_product");
    localStorage.removeItem("price_tag");
  }

  HandleChangeLokasi(lk) {
    let err = Object.assign({}, this.state.error, {
      location: "",
    });
    this.setState({
      location: lk.value,
      error: err,
    });
    localStorage.setItem("lk", lk.value);
    this.props.dispatch(
      FetchBrgSame(1, "barcode", "", lk.value, null, this.autoSetQty)
    );
    destroy(table);
    this.getData();
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

    if (column === "ambil_data") {
      if (parseInt(val, 10) === 2) {
        this.props.dispatch(FetchReport(1, "&perpage=999"));
      }

      localStorage.setItem("ambil_data", val);
      destroy(table);
      this.getData();
    }
  }
  HandleChangeNota(nota) {
    this.props.dispatch(setPoData([]));
    this.setState({
      ambil_nota: nota.value,
      error: {
        location: "",
        supplier: "",
        catatan: "",
        notasupplier: "",
        penerima: "",
      },
    });

    localStorage.setItem("nota", nota.value);
    this.props.dispatch(FetchReceiveData(nota.value));
    destroy(table);
    localStorage.removeItem("sp");
    localStorage.removeItem("lk");
    localStorage.removeItem("catatan");
    this.getData();
  }
  HandleSearch() {
    if (this.state.location === "") {
      Swal.fire("Gagal!", "Pilih lokasi", "error");
    } else {
      if (
        parseInt(this.state.searchby, 10) === 1 ||
        this.state.searchby === ""
      ) {
        this.props.dispatch(
          FetchBrgSame(
            1,
            "kd_brg",
            this.state.search,
            this.state.location,
            null,
            this.autoSetQty
          )
        );
      }
      if (parseInt(this.state.searchby, 10) === 2) {
        this.props.dispatch(
          FetchBrgSame(
            1,
            "ukuran",
            this.state.search,
            this.state.location,
            null,
            this.autoSetQty
          )
        );
      }
      if (parseInt(this.state.searchby, 10) === 3) {
        this.props.dispatch(
          FetchBrgSame(
            1,
            "deskripsi",
            this.state.search,
            this.state.location,
            null,
            this.autoSetQty
          )
        );
      }
      this.setState({ search: "" });
    }
  }
  HandleAddBrg(e, item) {
    e.preventDefault();

    const finaldt = {
      barcode: item.barcode,
      title: item.title,
      ukuran: item.ukuran,
      harga_jual: item.harga_jual,
      qty: 0,
    };
    const cek = cekData("barcode", item.barcode, table);
    cek.then((res) => {
      if (res === undefined) {
        store(table, finaldt);
      } else {
        update(table, {
          id: res.id,
          barcode: res.barcode,
          title: res.title,
          ukuran: res.ukuran,
          harga_jual: res.harga_jual,
          qty: parseInt(res.qty, 10) + 1,
        });
      }
      this.getData();
    });
  }
  HandleRemove(e, id) {
    e.preventDefault();
    Swal.fire({
      allowOutsideClick: false,
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        del(table, id);
        this.getData();
        Swal.fire("Deleted!", "Your data has been deleted.", "success");
      }
    });
  }
  HandleReset(e) {
    e.preventDefault();
    Swal.fire({
      allowOutsideClick: false,
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then((result) => {
      if (result.value) {
        destroy(table);
        localStorage.removeItem("lk");
        window.location.reload(false);
      }
    });
  }
  HandleChangeInputValue(e, i, barcode = null, datas = []) {
    const column = e.target.name;
    const val = e.target.value;
    let brgval = [...this.state.brgval];
    brgval[i] = { ...brgval[i], [column]: val };
    this.setState({ brgval });
  }
  handleChecked(event) {
    localStorage.setItem("price_tag", event.target.checked);
    let column = event.target.name;
    // let value=event.target.name;
    this.setState({
      [column]: event.target.checked,
    });
  }
  handleCheckedAllProduct(event) {
    let column = event.target.name;
    // let value=event.target.name;
    if (this.state.location !== "") {
      localStorage.setItem("all_product", event.target.checked);
      this.setState({
        [column]: event.target.checked,
      });
      if (event.target.checked === false) {
        destroy(table);
      } else {
        let total_data = parseInt(
          this.props.pagin_barang.per_page * this.props.pagin_barang.last_page,
          10
        );
        this.props.dispatch(
          FetchBrgSame(
            1,
            "barcode",
            "",
            "",
            this.state.location,
            null,
            this.autoSetQty,
            total_data
          )
        );
        destroy(table);
        const param = this.props;
        if (param.barang) {
          param.barang.map((item) => {
            const datas = {
              title: item.nm_brg,
              barcode: item.barcode,
              ukuran: item.ukuran,
              harga_jual: item.harga,
              qty: 0,
            };
            store(table, datas);
            this.getData();
            return null;
          });
        }
      }
    } else {
      Swal.fire("Error!", "Lokasi belum dipilih!", "error");
    }
  }
  HandleChangeInput(e, id) {
    const column = e.target.name;
    const val = e.target.value;
    const cek = cekData("barcode", id, table);
    cek.then((res) => {
      if (res === undefined) {
        Toast.fire({
          icon: "error",
          title: `not found.`,
        });
      } else {
        let final = {};
        Object.keys(res).forEach((k, i) => {
          if (k !== column) {
            final[k] = res[k];
          } else {
            final[column] = val;
          }
        });
        update(table, final);
        Toast.fire({
          icon: "success",
          title: `${column} has been changed.`,
        });
      }
      this.getData();
    });
  }
  HandleSubmit(e) {
    e.preventDefault();
    if (this.state.price_tag) {
      Swal.fire({
        allowOutsideClick: false,
        title: "Information.",
        icon: "info",
        html:
          "Data Price Tag Berhasil Diolah!" +
          "<br><br>" +
          '<button type="button" role="button" tabindex="0" id="btnPriceTag" class="btn btn-info">Print Price Tag?</button>',
        showCancelButton: true,
        showConfirmButton: false,
      }).then((result) => {
        // destroy('adjusment');
        // localStorage.removeItem("lk");
        // if(result.dismiss === 'cancel'){
        //     window.location.reload(false);
        // }
      });
      document.getElementById("btnPriceTag").addEventListener("click", () => {
        this.props.history.push({
          pathname: "/priceTag",
          state: {
            data: this.state.databrg,
          },
        });
        //Swal.closeModal();==
        localStorage.removeItem("lk");
        destroy("cetak_barcode");
        return false;
      });
    } else {
      let err = this.state.error;
      if (
        this.state.catatan === "" ||
        this.state.location === "" ||
        this.state.customer === ""
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
        this.setState({
          error: err,
        });
      } else {
        const data = get(table);
        data.then((res) => {
          if (res.length === 0) {
            Swal.fire(
              "Error!",
              "Pilih barang untuk melanjutkan Menyimpan Barcode.",
              "error"
            );
          } else {
            Swal.fire({
              allowOutsideClick: false,
              title: "Simpan Barcode?",
              text: "Pastikan data yang anda masukan sudah benar!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Ya, Simpan!",
              cancelButtonText: "Tidak!",
            }).then((result) => {
              if (result.value) {
                let detail = [];
                let parseData = {};
                let barcode = "";
                res.map((item) => {
                  for (
                    let i = 0;
                    i < parseInt(this.state.price_tag ? 1 : item.qty, 10);
                    i++
                  ) {
                    barcode +=
                      item.barcode +
                      ", " +
                      item.title +
                      ", " +
                      item.ukuran +
                      ", " +
                      toRp(item.harga_jual);
                    barcode += "\n";
                  }
                  detail.push({
                    barcode: item.barcode,
                    title: item.title,
                    ukuran: item.ukuran,
                    harga_jual: item.harga_jual,
                    qty: this.state.price_tag ? 1 : item.qty,
                  });
                  return null;
                });
                this.setState({
                  data_barcode: barcode,
                });
                parseData["data"] = detail;
                this.downloadTxtFile(barcode);
                Swal.fire({
                  allowOutsideClick: false,
                  title: "Buka batender?",
                  text:
                    "buka dan import file txt, dan masukan ke aplikasi bartender.",
                  icon: "success",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Buka Bartender!",
                  cancelButtonText: "Tidak!",
                }).then((result) => {
                  if (result.value) {
                    localStorage.removeItem("lk");
                    destroy("cetak_barcode");
                    this.getData();
                    const win = window.open("NetindoAppBartend:", "_blank");
                    if (win != null) {
                      win.focus();
                    }
                  } else {
                    window.location.reload();
                    localStorage.removeItem("lk");
                    destroy("cetak_barcode");
                  }
                });
              }
            });
          }
        });
      }
    }
  }
  dateOnlyCode() {
    return moment(new Date()).format("YYYYMMDD");
  }
  intRand(limit, char = "0123456789") {
    let result = "";
    let characters = char;
    const charactersLength = characters.length;
    for (var i = 0; i < limit; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  downloadTxtFile = (data) => {
    const element = document.createElement("a");
    const file = new Blob([data], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `barcode_barang.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    //
  };
  autoSetQty(kode, data) {
    const cek = cekData("barcode", kode, table);

    return cek.then((res) => {
      if (res === undefined) {
        store(table, {
          barcode: data[0].barcode,
          title: data[0].nm_brg,
          ukuran: data[0].ukuran,
          harga_jual: data[0].harga,
          qty: 0,
        });
      } else {
        update(table, {
          id: res.id,
          barcode: res.barcode,
          title: data[0].nm_brg,
          ukuran: data[0].ukuran,
          harga_jual: data[0].harga,
          qty: parseFloat(res.qty) + 1,
        });
      }
      return true;
    });
  }
  getData() {
    const data = get(table);
    data.then((res) => {
      let brg = [];
      res.map((i) => {
        brg.push({
          qty: i.qty,
        });
        return null;
      });
      this.setState({
        databrg: res,
        brgval: brg,
      });
      return null;
    });
  }

  render() {
    const columnStyle = {
      verticalAlign: "middle",
      textAlign: "center",
      whiteSpace: "nowrap",
    };

    return (
      <Layout page="Cetak Barcode">
        <div className="card">
          <div className="card-header">
            <h4>Cetak Barcode</h4>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label className="control-label font-12">
                          {parseInt(this.state.ambil_data, 10) === 1
                            ? "Data langsung."
                            : "Ambil data dari Pembelian."}
                        </label>
                        <div className="input-group input-group-sm">
                          <select
                            name="ambil_data"
                            className="form-control form-control-sm"
                            onChange={(e) =>
                              this.HandleCommonInputChange(e, false)
                            }
                          >
                            <option
                              value={1}
                              selected={this.state.ambil_data === 1}
                            >
                              Langsung
                            </option>
                            <option
                              value={2}
                              selected={this.state.ambil_data === 2}
                            >
                              Pembelian
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-md-12"
                      style={
                        parseInt(this.state.ambil_data, 10) === 1
                          ? { display: "none" }
                          : { display: "block" }
                      }
                    >
                      <div className="form-group">
                        <label className="control-label font-12">
                          Nota Pembelian
                        </label>
                        <AsyncSelect
                          placeholder={
                            "Pilih Nota " +
                            (parseInt(this.state.ambil_data, 10) === 1
                              ? ""
                              : "Pembelian")
                          }
                          onChange={this.HandleChangeNota}
                          value={{
                            label: this.state.ambil_nota,
                            value: this.state.ambil_nota,
                          }}
                          cacheOptions
                          loadOptions={loadOptions}
                          defaultOptions
                          filterOptions={(options, filter, currentValues) => {
                            return options;
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="d-flex">
                    <div className="form-group mr-5">
                      <label>Semua Barang</label>
                      <br />
                      <label htmlFor="inputState" className="col-form-label">
                        <input
                          name="all_product"
                          type="checkbox"
                          checked={
                            localStorage.all_product === "true" ? true : false
                          }
                          onChange={this.handleCheckedAllProduct}
                        />
                        {this.state.all_product !== true ? " Tidak" : " Ya"}
                      </label>
                    </div>
                    <div className="form-group">
                      <label>Price Tag</label>
                      <br />
                      <label htmlFor="inputState" className="col-form-label">
                        <input
                          name="price_tag"
                          type="checkbox"
                          checked={
                            localStorage.price_tag === "true" ? true : false
                          }
                          onChange={this.handleChecked}
                        />
                        {this.state.price_tag !== true
                          ? " Non-Active"
                          : " Active"}
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Plih Barang</label>
                    <div className="input-group input-group-sm">
                      <select
                        name="searchby"
                        className="form-control form-control-sm"
                        onChange={(e) => this.HandleCommonInputChange(e, false)}
                      >
                        <option value={3}>Nam barang</option>
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
                        placeholder="Search"
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
                  <Scrollbars
                    style={{
                      width: "100%",
                      height: "500px",
                      maxHeight: "100%",
                    }}
                  >
                    <div className="people-list">
                      <div id="chat_user_2">
                        <ul className="chat-list list-unstyled">
                          {this.props.barang.length !== 0 ? (
                            this.props.barang.map((i, inx) => {
                              return (
                                <li
                                  className="clearfix"
                                  key={inx}
                                  onClick={(e) =>
                                    this.HandleAddBrg(e, {
                                      barcode: i.barcode,
                                      title: i.nm_brg,
                                      ukuran :i.ukuran,
                                      harga_jual: i.harga,
                                      qty: 0,
                                    })
                                  }
                                >
                                  <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"
                                    alt="avatar"
                                  />
                                  <div className="about">
                                    <div
                                      className="status"
                                      style={{
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {`${i.nm_brg}`}
                                    </div>
                                    <div
                                      className="status"
                                      style={{
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {i.ukuran}
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
                    </div>
                  </Scrollbars>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label className="control-label font-12">Lokasi</label>
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
                    {/* <div className="col-md-2">
                                        </div> */}

                    <div
                      className="table-responsive"
                      style={{ overflowX: "auto", zoom: "80%" }}
                    >
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th style={columnStyle}>#</th>
                            <th style={columnStyle}>barcode</th>
                            <th style={columnStyle}>Nama Barang</th>
                            <th style={columnStyle}>Variasi</th>
                            <th style={columnStyle}>Harga Jual</th>
                            <th style={columnStyle}>Qty</th>
                          </tr>
                        </thead>

                        <tbody>
                          {this.state.databrg.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td style={columnStyle}>
                                  <a
                                    href="about:blank"
                                    className="btn btn-danger btn-sm"
                                    onClick={(e) =>
                                      this.HandleRemove(e, item.id)
                                    }
                                  >
                                    <i className="fa fa-trash" />
                                  </a>
                                </td>
                                <td style={columnStyle}>{item.barcode}</td>
                                <td style={columnStyle}>{item.title}</td>
                                <td style={columnStyle}>{item.ukuran}</td>
                                <td style={columnStyle}>{item.harga_jual}</td>
                                <td style={columnStyle}>
                                  <input
                                    readOnly={this.state.price_tag}
                                    type="text"
                                    name="qty"
                                    onBlur={(e) =>
                                      this.HandleChangeInput(e, item.barcode)
                                    }
                                    onChange={(e) =>
                                      this.HandleChangeInputValue(e, index)
                                    }
                                    value={
                                      this.state.price_tag !== true
                                        ? this.state.brgval[index].qty
                                        : ""
                                    }
                                    className="form-control"
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="card-header">
                  <div className="dashboard-btn-group d-flex align-items-center">
                    <a
                      href="about:blank"
                      onClick={(e) => this.HandleSubmit(e)}
                      className="btn btn-primary ml-1"
                    >
                      Simpan
                    </a>
                    <a
                      href="about:blank"
                      onClick={(e) => this.HandleReset(e)}
                      className="btn btn-danger ml-1"
                    >
                      Reset
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ModalCetakBarcode
          getLink={this.props.get_link}
          dataBarcode={this.state.data_barcode}
        />
      </Layout>
    );
  }
}

const mapStateToPropsCreateItem = (state) => ({
  auth: state.auth,
  barang: state.productReducer.result_brg,
  pagin_barang: state.productReducer.pagin_brg,
  loadingbrg: state.productReducer.isLoadingBrg,
  get_link: state.siteReducer.get_link,
  isLoading: state.receiveReducer.isLoading,
  receive_data: state.receiveReducer.receive_data,
});

export default connect(mapStateToPropsCreateItem)(CetakBarcode);
