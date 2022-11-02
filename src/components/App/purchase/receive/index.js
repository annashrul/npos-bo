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
import { FetchCheck } from "redux/actions/site.action";
import { FetchSupplierAll } from "redux/actions/masterdata/supplier/supplier.action";
import {
  FetchNota,
  storeReceive,
} from "redux/actions/purchase/receive/receive.action";
import {
  FetchPoReport,
  FetchPoData,
  setPoData,
} from "redux/actions/purchase/purchase_order/po.action";
import Select from "react-select";
import Swal from "sweetalert2";
import moment from "moment";
import { updateReceive } from "redux/actions/purchase/receive/receive.action";
import axios from "axios";
import { HEADERS, CONFIG_HIDE } from "redux/actions/_constants";
import { withRouter } from "react-router-dom";
import StickyBox from "react-sticky-box";
import { toRp, ToastQ } from "helper";
import {
  handleError,
  isEmptyOrUndefined,
  lengthBrg,
  rmComma,
  swal,
  swallOption,
  toCurrency,
} from "../../../../helper";
import Spinner from "Spinner";
import ButtonTrxCommon from "../../common/ButtonTrxCommon";
import Cookies from "js-cookie";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

const table = "receive";
const receiveLocationStorage = "receiveLocationStorage";
const receiveSupplierStorage = "receiveSupplierStorage";
class Receive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemSearch: [],
      anyCart: "",
      setHarga: 0,
      addingItemName: "",
      no_faktur_beli: "-",
      databrg: [],
      brgval: [],
      tanggal: moment(new Date()).format("yyyy-MM-DD"),
      tanggal_tempo: moment(new Date()).format("yyyy-MM-DD"),
      harga_beli: 0,
      diskon: 0,
      ppn: 0,
      qty: 0,
      qty_po: 0,
      location_data: [],
      location: "",
      location_val: "",
      supplier: "",
      catatan: "-",
      notasupplier: "",
      penerima: "",
      jenis_trx: "Tunai",
      userid: 0,
      searchby: 3,
      qty_bonus: 0,
      discount_persen: 0,
      discount_harga: 0,
      pajak: 0,
      ppn_harga: 0,
      ppn_nominal: 0,
      search: "",
      grandtotal: 0,
      no_po: "-",
      pre_receive: "-",
      data_nota: [],
      ambil_data: 1,
      ambil_nota: "",
      perpage: 5,
      scrollPage: 0,
      isScroll: false,
      toggleSide: false,
      anyField: "",
      error: {
        location: "",
        supplier: "",
        catatan: "",
        notasupplier: "",
        penerima: "",
      },
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
    this.getData = this.getData.bind(this);
    this.HandleChangeNota = this.HandleChangeNota.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleClickToggle = this.handleClickToggle.bind(this);
    this.HandleFocusInputReset = this.HandleFocusInputReset.bind(this);
  }
  handleClickToggle(e) {
    e.preventDefault();
    this.setState({
      toggleSide: !this.state.toggleSide,
    });
  }
  getSetting() {
    const setting = get("sess");
    setting.then((res) => {
      this.setState({ set_harga: res[0].set_harga });
      return null;
    });
  }
  async fetchDataEdit() {
    const url =
      HEADERS.URL + `receive/ambil_data/${this.props.match.params.slug}`;
    return await axios
      .get(url)
      .then(function (response) {
        return response.data.result;
      })
      .catch(function (error) {
        if (error.response) {
        }
      });
  }
  getConfigSupplier() {
    const config = this.props.auth.user.use_supplier;
    return parseInt(config, 10);
  }
  componentWillMount() {
    this.getSetting();
    if (
      this.props.match.params.slug !== undefined &&
      this.props.match.params.slug !== null
    ) {
      destroy(table);
      const data = this.fetchDataEdit();
      data.then((res) => {
        res.detail.map((v, i) => {
          // const data_final={
          //     "kd_brg" : v.kode_barang,
          //     "barcode" : v.barcode,
          //     "satuan" : v.satuan,
          //     "diskon" : v.diskon,
          //     "harga_beli" : v.harga_beli,
          //     "stock" : v.stock,
          //     "diskon2" : 0,
          //     "diskon3" :0,
          //     "diskon4" : 0,
          //     "ppn" : v.ppn,
          //     "qty" : v.jumlah_beli,
          //     "qty_bonus" : v.jumlah_bonus,
          //     "nm_brg" : v.nm_brg,
          //     "tambahan" : v.tambahan,
          // };
          const data_final = {
            kd_brg: v.kode_barang,
            barcode: v.barcode,
            satuan: v.satuan,
            diskon: v.diskon,
            diskon2: 0,
            diskon3: 0,
            diskon4: 0,

            harga: v.tambahan[0].harga,
            harga2: v.tambahan[0].harga2,
            harga3: v.tambahan[0].harga3,
            harga4: v.tambahan[0].harga4,

            ppn: v.ppn === null ? 0 : v.ppn,
            harga_beli: v.harga_beli,
            qty: v.jumlah_beli,
            qty_po: v.jumlah_beli,
            qty_bonus: v.jumlah_bonus,
            stock: v.stock,
            nm_brg: v.nm_brg,
            tambahan: v.tambahan,
          };
          store("receive", data_final);
          return null;
        });
        this.getData();
        if (this.getConfigSupplier() === 0) {
          this.props.dispatch(
            FetchBrg(
              1,
              "barcode",
              "",
              localStorage.receiveLocationStorage,
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
              localStorage.receiveLocationStorage,
              localStorage.receiveSupplierStorage,
              this.autoSetQty,
              5
            )
          );
        }
        this.setState({
          location: res.master.lokasi,
          catatan: res.master.catatan,
          supplier: res.master.kode_supplier,
          no_faktur_beli: this.props.match.params.slug,
          tanggal: moment(res.master.tgl_beli).format("YYYY-MM-DD"),
          tanggal_tempo: moment(res.master.tgl_jatuh_tempo).format(
            "YYYY-MM-DD"
          ),
          penerima: res.master.nama_penerima,
          notasupplier: res.master.nonota,
          jenis_trx: res.master.type,
          discount_persen: (res.master.disc / res.master.total_pembelian) * 100,
          discount_harga: res.master.disc,
          pajak: res.master.ppn,
        });
      });

      // window.location.reload();

      // let get_master = localStorage.getItem('data_master_receive');
      // let master = JSON.parse(get_master);
    }
  }
  componentDidMount() {
    this.props.dispatch(FetchSupplierAll());
    if (localStorage.catatan !== undefined && localStorage.catatan !== "") {
      this.setState({
        catatan: localStorage.catatan,
      });
    }

    if (
      localStorage.ambil_data !== undefined &&
      localStorage.ambil_data !== ""
    ) {
      if (parseInt(localStorage.ambil_data, 10) === 2) {
        this.props.dispatch(FetchPoReport("page=1&perpage=9999"));
      }
      this.setState({
        ambil_data: localStorage.ambil_data,
      });
    }

    if (localStorage.nota !== undefined && localStorage.nota !== "") {
      this.setState({
        ambil_nota: localStorage.nota,
      });
      this.props.dispatch(FetchPoData(localStorage.nota));
      destroy(table);
      this.getData();
    }

    if (
      localStorage.receiveLocationStorage !== undefined &&
      localStorage.receiveLocationStorage !== ""
    ) {
      this.props.dispatch(FetchNota(localStorage.receiveLocationStorage));
      this.setState({
        location: localStorage.receiveLocationStorage,
      });
    }
    if (
      localStorage.receiveSupplierStorage !== undefined &&
      localStorage.receiveSupplierStorage !== ""
    ) {
      this.setState({
        supplier: localStorage.receiveSupplierStorage,
      });
    }
    if (
      localStorage.receiveSupplierStorage !== undefined &&
      localStorage.receiveSupplierStorage !== "" &&
      localStorage.receiveLocationStorage !== undefined &&
      localStorage.receiveLocationStorage !== ""
    ) {
      if (this.getConfigSupplier() === 0 || isNaN(this.getConfigSupplier())) {
        this.props.dispatch(
          FetchBrg(
            1,
            "barcode",
            "",
            localStorage.receiveLocationStorage,
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
            localStorage.receiveLocationStorage,
            localStorage.receiveSupplierStorage,
            this.autoSetQty,
            5
          )
        );
      }
    }

    this.getData();
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

    if (nextProps.po_report) {
      let nota = [];
      let po = nextProps.po_report;
      if (po !== undefined) {
        po.map((i) => {
          nota.push({
            value: i.no_po,
            label: i.no_po + " (" + i.nama_supplier + ")",
          });
          return null;
        });
        this.setState({
          data_nota: nota,
        });
      }
    }
    if (nextProps.po_data) {
      if (nextProps.po_data.master !== undefined) {
        if (this.props.po_data === undefined) {
          this.props.dispatch(FetchNota(nextProps.po_data.master.lokasi));
          this.setState({
            location: nextProps.po_data.master.lokasi,
            supplier: nextProps.po_data.master.kode_supplier,
            catatan: nextProps.po_data.master.catatan,
            jenis_trx: nextProps.po_data.master.jenis,
            no_po: nextProps.po_data.master.no_po,
          });
          localStorage.setItem(
            receiveLocationStorage,
            nextProps.po_data.master.lokasi
          );
          localStorage.setItem(
            receiveSupplierStorage,
            nextProps.po_data.master.kode_supplier
          );
          localStorage.setItem("catatan", nextProps.po_data.master.catatan);
          if (this.getConfigSupplier() === 0) {
            this.props.dispatch(
              FetchBrg(
                1,
                "barcode",
                "",
                nextProps.po_data.master.lokasi,
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
                nextProps.po_data.master.lokasi,
                nextProps.po_data.master.kode_supplier,
                this.autoSetQty,
                5
              )
            );
          }
          nextProps.po_data.detail.map((item) => {
            let newbrg = [];
            item.tambahan.map((i) => {
              if (i.satuan === item.satuan) {
                newbrg = i;
              }
              return null;
            });
            const datas = {
              kd_brg: item.kode_barang,
              barcode: item.barcode,
              ukuran: item.ukuran,
              satuan: item.satuan,
              diskon: item.diskon,
              diskon2: item.disc2,
              diskon3: item.disc3,
              diskon4: item.disc4,
              ppn: item.ppn,
              harga_beli: item.harga_beli,
              qty:
                atob(atob(Cookies.get("tnt="))) === "rb" ||
                atob(atob(Cookies.get("tnt="))) === "npos"
                  ? 0
                  : item.jumlah_beli,
              qty_po: item.jumlah_beli,
              qty_bonus: 0,
              stock: item.stock,
              nm_brg: item.nm_brg,
              harga: newbrg.harga,
              harga2: newbrg.harga2,
              harga3: newbrg.harga3,
              harga4: newbrg.harga4,
              tambahan: item.tambahan,
            };
            store(table, datas);
            this.getData();
            return null;
          });
        }
      }
    }

    if (nextProps.checkNotaPem) {
      this.setState({
        error: Object.assign({}, this.state.error, {
          notasupplier: "Nota supplier sudah digunakan.",
        }),
      });
    }
  };
  componentWillUnmount() {
    // this.props.dispatch(setProductbrg({ status: "", msg: "", result: { data: [] } }));
    // destroy(table);
    // localStorage.removeItem("sp");
    // localStorage.removeItem("lk");
    // localStorage.removeItem("ambil_data");
    // localStorage.removeItem("nota");
    // localStorage.removeItem("catatan");
    // localStorage.removeItem("data_master_receive");
    // localStorage.removeItem("data_detail_receive");
    // localStorage.removeItem("anyReceive");
    if (
      this.props.match.params.slug !== undefined &&
      this.props.match.params.slug !== null
    ) {
      localStorage.removeItem("data_master_receive");
      localStorage.removeItem("data_detail_receive");
      destroy("receive");
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
    this.props.dispatch(FetchPoData(nota.value));

    destroy(table);
    localStorage.removeItem("sp");
    localStorage.removeItem("lk");
    localStorage.removeItem("catatan");
    this.getData();
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
    localStorage.setItem(receiveLocationStorage, lk.value);
    this.props.dispatch(FetchNota(lk.value));
    if (this.state.supplier !== "") {
      if (this.getConfigSupplier() === 0) {
        this.props.dispatch(
          FetchBrg(1, "barcode", "", lk.value, null, this.autoSetQty, 5)
        );
      } else {
        this.props.dispatch(
          FetchBrg(
            1,
            "barcode",
            "",
            lk.value,
            this.state.supplier,
            this.autoSetQty,
            5
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
    });
    localStorage.setItem(receiveSupplierStorage, sp.value);
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

    if (column === "notasupplier") {
      this.props.dispatch(
        FetchCheck({
          table: "master_beli",
          kolom: "nonota",
          value: val,
        })
      );
    }

    if (column === "ambil_data") {
      if (parseInt(val, 10) === 2) {
        this.props.dispatch(FetchPoReport("page=1&perpage=9999"));
      }
      localStorage.setItem("ambil_data", val);
      destroy(table);
      this.getData();
    }

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
        if (column.includes("harga_jual")) {
          let splitHarga = column.split("#");
          let keyHrg = parseInt(splitHarga[1], 10);
          console.log(keyHrg);
          let dataTambahan = {
            barcode: res.tambahan[0].barcode,
            harga_beli: res.tambahan[0].harga_beli,
            kd_brg: res.tambahan[0].kd_brg,
            lokasi: res.tambahan[0].lokasi,
            ppn: res.tambahan[0].ppn,
            qty_konversi: res.tambahan[0].qty_konversi,
            satuan: res.tambahan[0].satuan,
            satuan_jual: res.tambahan[0].satuan_jual,
            service: res.tambahan[0].service,
            stock: res.tambahan[0].stock,
          };
          let nameHrg = keyHrg === 0 ? "harga" : `harga${keyHrg + 1}`;
          this.props.auth.user.nama_harga.map((row, key) => {
            Object.assign(dataTambahan, {
              [key === 0 ? "harga" : `harga${key + 1}`]:
                key === 0
                  ? res.tambahan[0]["harga"]
                  : res.tambahan[0][`harga${key + 1}`],
            });
          });
          dataTambahan[nameHrg] = parseInt(rmComma(val), 10);
          const dataUpdate = {
            barcode: res.barcode,
            diskon: res.diskon,
            diskon2: res.diskon2,
            diskon3: res.diskon3,
            diskon4: res.diskon4,
            harga: res.harga,
            harga2: res.harga2,
            harga3: res.harga3,
            harga4: res.harga4,
            harga_beli: res.harga_beli,
            id: res.id,
            kd_brg: res.kd_brg,
            nm_brg: res.nm_brg,
            ppn: res.ppn,
            qty: res.qty,
            qty_bonus: res.qty_bonus,
            qty_po: res.qty_po,
            satuan: res.satuan,
            stock: res.stock,
            tambahan: [dataTambahan],
          };
          update(table, dataUpdate);
          this.getData();
          return;
          // console.log(dataUpdate);
        }
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
        } else if (column === "qty_po") {
          Object.keys(res).forEach((k, i) => {
            if (k !== "qty_po") {
              final[k] = res[k];
            } else {
              final["qty_po"] = val === "" ? 1 : val;
            }
          });
        } else if (column === "harga_beli") {
          Object.keys(res).forEach((k, i) => {
            if (k !== "harga_beli") {
              final[k] = res[k];
            } else {
              final["harga_beli"] = val;
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
        // ToastQ.fire({
        //   icon: "success",
        //   title: `${column} has been changed.`,
        // });
      }
      this.getData();
    });
  }
  HandleChangeInputValue(e, i, barcode = null, datas = []) {
    const column = e.target.name;
    const val = e.target.value;
    let brgval = [...this.state.brgval];
    let values = val;

    if (column === "ppn" || column === "diskon") {
      if (val < 0 || val === "") values = 0;
      else if (parseFloat(val) > 100) {
        values = 100;
      }
    } else if (column === "qty") {
      if (val === "") values = 0;
      else values = val;
    } else if (column === "qty_po") {
      if (val === "") values = 0;
      else values = val;
    } else if (column.includes("harga_jual")) {
      let splitHarga = column.split("#");
      let keyHrg = parseInt(splitHarga[1], 10);
      let hargaKey = keyHrg === 0 ? "harga" : `harga${keyHrg + 1}`;
      console.log(keyHrg);
      this.state.brgval[i].tambahan[0][hargaKey] = values;
      // this.state.brgval[i].tambahan[0][hargaKey] = values;
    }

    brgval[i] = { ...brgval[i], [column]: values };
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
            qty_po: 0,
            kd_brg: res.kd_brg,
            barcode: newbrg.barcode,
            satuan: newbrg.satuan,
            diskon: res.diskon,
            diskon2: res.diskon2,
            diskon3: 0,
            diskon4: 0,

            harga: newbrg.harga,
            harga2: newbrg.harga2,
            harga3: newbrg.harga3,
            harga4: newbrg.harga4,

            ppn: res.ppn,
            qty_bonus: res.qty_bonus,
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
    if (column === "qty_po") {
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
  setTanggal(date) {
    this.setState({
      tanggal: date,
    });
  }
  HandleRemove(e, id) {
    e.preventDefault();
    swallOption("Anda yakin akan menghapus data ini ?", () => {
      del(table, id);
      this.getData();
      swal("data berhasil dihapus");
    });
  }
  HandleAddBrg(e, item) {
    e.preventDefault();
    this.setState({
      isScroll: false,
    });

    const finaldt = {
      kd_brg: item.kd_brg,
      ukuran: item.ukuran,
      barcode: item.barcode,
      satuan: item.satuan,
      diskon: item.diskon,
      diskon2: 0,
      diskon3: 0,
      diskon4: 0,

      harga: item.tambahan[0].harga,
      harga2: item.tambahan[0].harga2,
      harga3: item.tambahan[0].harga3,
      harga4: item.tambahan[0].harga4,

      ppn: item.ppn,
      harga_beli: item.harga_beli,
      qty: item.qty,
      qty_po: 0,
      qty_bonus: item.qty_bonus,
      stock: item.stock,
      nm_brg: item.nm_brg,
      tambahan: item.tambahan,
    };
    const cek = cekData("kd_brg", item.kd_brg, table);
    let no = 0;
    cek.then((res) => {
      if (res === undefined) {
        store(table, finaldt);
      } else {
        update(table, {
          id: res.id,
          qty: parseFloat(res.qty) + 1,
          qty_po: parseFloat(res.qty_po),
          kd_brg: res.kd_brg,
          barcode: res.barcode,
          ukuran: res.ukuran,
          satuan: res.satuan,
          diskon: res.diskon,
          diskon2: res.diskon2,
          diskon3: 0,
          diskon4: 0,
          harga: res.harga,
          harga2: res.harga2,
          harga3: res.harga3,
          harga4: res.harga4,

          ppn: res.ppn,
          stock: res.stock,
          harga_beli: res.harga_beli,
          nm_brg: res.nm_brg,
          qty_bonus: item.qty_bonus,
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
      localStorage.removeItem("ambil_data");
      localStorage.removeItem("nota");
      localStorage.removeItem("catatan");
      this.getData();
    });
  }
  HandleSubmit(e) {
    e.preventDefault();
    // validator head form
    let err = this.state.error;
    if (!isEmptyOrUndefined(this.state.penerima)) {
      handleError("penerima");
      return;
    }
    if (!isEmptyOrUndefined(this.state.notasupplier)) {
      handleError("nota supplier");
      return;
    }
    if (this.props.checkNotaPem) {
      handleError("nota supplier", "telah digunakan");
      return;
    }

    let namaHarga = this.props.auth.user.nama_harga;
    const data = get(table);
    data.then((res) => {
      if (res.length === 0) {
        swal("Pilih barang untuk melanjutkan Pembelian.");
      } else {
        let subtotal = 0;
        let detail = [];
        res.map((item) => {
          let disc1 = 0;
          let ppn = 0;
          if (item.diskon !== 0) {
            disc1 =
              parseFloat(item.harga_beli) * (parseFloat(item.diskon) / 100);
          }

          if (item.ppn !== 0) {
            ppn =
              (parseFloat(item.harga_beli) - disc1) *
              (parseFloat(item.ppn) / 100);
          }
          const subtotal_perrow =
            (parseFloat(item.harga_beli) - disc1 + ppn) * parseFloat(item.qty);
          subtotal += subtotal_perrow;
          let harga_ = 0;
          let harga_2 = 0;
          let harga_3 = 0;
          let harga_4 = 0;
          if (this.state.set_harga === 1) harga_ = rmComma(item.harga);
          else if (this.state.set_harga === 2) {
            harga_ = rmComma(item.harga);
            harga_2 = rmComma(item.harga2);
          } else if (this.state.set_harga === 3) {
            harga_ = rmComma(item.harga);
            harga_2 = rmComma(item.harga2);
            harga_3 = rmComma(item.harga3);
          } else if (this.state.set_harga === 4) {
            harga_ = rmComma(item.harga);
            harga_2 = rmComma(item.harga2);
            harga_3 = rmComma(item.harga3);
            harga_4 = rmComma(item.harga4);
          }

          const dataDetailUpdate = {
            kd_brg: item.kd_brg,
            barcode: item.barcode,
            ukuran: item.ukuran,
            satuan: item.satuan,
            diskon: item.diskon,
            diskon2: item.diskon2,
            diskon3: item.diskon3,
            diskon4: item.diskon4,
            ppn: item.ppn,
            harga_beli: item.harga_beli,
            qty: item.qty,
            qty_po: item.qty_po,
            qty_bonus: item.qty_bonus,
          };
          for (let keyHrg = 0; keyHrg < namaHarga.length; keyHrg++) {
            Object.assign(dataDetailUpdate, {
              [keyHrg === 0 ? "harga" : `harga${keyHrg + 1}`]:
                item.tambahan[0][keyHrg === 0 ? "harga" : `harga${keyHrg + 1}`],
            });
          }

          detail.push(dataDetailUpdate);
          return null;
        });
        let data_final = {
          tanggal: moment(this.state.tanggal).format("YYYY-MM-DD HH:mm:ss"),
          type: this.state.jenis_trx,
          tgl_jatuh_tempo: moment(this.state.tanggal_tempo).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          no_po: this.state.no_po,
          pre_receive: this.state.pre_receive,
          sub_total: subtotal,
          supplier: this.state.supplier,
          nota_supplier: this.state.notasupplier,
          nama_penerima: this.state.penerima,
          discount_harga: this.state.discount_harga,
          discount_persen: this.state.discount_persen,
          ppn: this.state.pajak,
          ppn_harga: this.state.ppn_harga,
          lokasi_beli: this.state.location,
          lokasi_harga: this.state.location,
          userid: this.state.userid,
          detail: detail,
          lvl: this.props.auth.user.lvl,
        };
        let parsedata = {};
        parsedata["detail"] = data_final;
        parsedata["master"] = this.state.databrg;
        parsedata["nota"] = this.props.nota;
        parsedata["logo"] = this.props.auth.user.logo;
        parsedata["user"] = this.props.auth.user.username;
        parsedata["lokasi_beli"] = this.state.location_val;
        parsedata["lokasi_harga"] = this.state.location_val;
        let store = atob(atob(Cookies.get("tnt=")));
        if (store === "kairo" || store === "npos") {
          swallOption(
            "Apakah anda akan mengubah harga beli untuk semua lokasi ?",
            () => {
              let dataAllLocatoin = [];
              this.state.location_data.forEach((row) =>
                dataAllLocatoin.push(row.value)
              );
              this.handleStore(parsedata, dataAllLocatoin);
            },
            () => {
              this.handleStore(parsedata, [this.state.location]);
            },
            "",
            "Tidak"
          );
        } else {
          this.handleStore(parsedata, [this.state.location]);
        }
      }
    });
  }

  handleStore(parsedata, location) {
    parsedata["detail"]["lokasi_harga"] = location;
    swallOption("Pastikan data anda sudah benar ", () => {
      if (
        this.props.match.params.slug !== undefined &&
        this.props.match.params.slug !== null
      ) {
        this.props.dispatch(
          updateReceive(parsedata, this.props.match.params.slug)
        );
        destroy(table);
        localStorage.removeItem("sp");
        localStorage.removeItem("lk");
        localStorage.removeItem("ambil_data");
        localStorage.removeItem("nota");
        localStorage.removeItem("catatan");
        this.getData();
      } else {
        this.props.dispatch(
          storeReceive(parsedata, (arr) => {
            this.props.dispatch(FetchNota(localStorage.receiveLocationStorage));
            this.setState({ notasupplier: "" });
            this.props.history.push(arr);
            destroy(table);
            localStorage.removeItem("sp");
            localStorage.removeItem("lk");
            localStorage.removeItem("ambil_data");
            localStorage.removeItem("nota");
            localStorage.removeItem("catatan");
            window.location.reload(true);
            this.getData();
          })
        );
      }
    });
  }

  autoSetQty(kode, data) {
    const cek = cekData("kd_brg", kode, table);
    return cek.then((res) => {
      if (res === undefined) {
        store(table, {
          kd_brg: data[0].kd_brg,
          barcode: data[0].barcode,
          satuan: data[0].satuan,
          ukuran: data[0].ukuran,
          diskon: 0,
          diskon2: 0,
          diskon3: 0,
          diskon4: 0,
          harga: data[0].tambahan[0].harga,
          harga2: data[0].tambahan[0].harga2,
          harga3: data[0].tambahan[0].harga3,
          harga4: data[0].tambahan[0].harga4,
          ppn: 0,
          harga_beli: data[0].harga_beli,
          qty: 1,
          qty_po: 0,
          qty_bonus: 0,
          stock: data[0].stock,
          nm_brg: data[0].nm_brg,
          tambahan: data[0].tambahan,
        });
      } else {
        update(table, {
          id: res.id,
          qty: parseFloat(res.qty) + 1,
          qty_po: parseFloat(res.qty_po) + 1,
          kd_brg: res.kd_brg,
          barcode: res.barcode,
          satuan: res.satuan,
          ukuran: res.ukuran,
          diskon: res.diskon,
          diskon2: res.diskon2,
          diskon3: 0,
          diskon4: 0,
          harga: res.harga,
          harga2: res.harga2,
          harga3: res.harga3,
          harga4: res.harga4,
          ppn: res.ppn,
          qty_bonus: res.qty_bonus,
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
      localStorage.setItem("anyReceive", this.state.search);
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
      let item = [];
      res.map((i) => {
        item.push({
          name: `${i.kd_brg} | ${i.nm_brg} | ${i.barcode}`,
          kd_brg: i.kd_brg,
          nm_brg: i.nm_brg,
          barcode: i.barcode,
          ukuran: i.ukuran,
          index: 1000000000000000,
        });
        brg.push({
          harga_beli: i.harga_beli,
          harga: i.harga,
          harga2: i.harga2,
          harga3: i.harga3,
          harga4: i.harga4,
          diskon: i.diskon,
          ppn: i.ppn,
          ppn_nominal:
            parseFloat(i.harga_beli, 10) * (parseFloat(i.ppn, 10) / 100),
          qty: i.qty,
          qty_po: i.qty_po,
          qty_bonus: i.qty_bonus,
          satuan: i.satuan,
          tambahan: i.tambahan,
        });
        return null;
      });
      this.setState({
        itemSearch: item,
        databrg: res,
        brgval: brg,
      });
      return null;
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
            localStorage.anyReceive !== undefined
              ? localStorage.anyReceive
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
            localStorage.anyReceive !== undefined
              ? localStorage.anyReceive
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

  handleOnSelect = (item) => {
    // the item selected
    this.setState({ anyCart: item.name });
    setTimeout(() => {
      this[`qty-${btoa(item.barcode)}`].focus();
      this.setState({ anyCart: "" });
    }, 500);
  };

  formatResult = (item) => {
    // return item;
    return (
      <p
        dangerouslySetInnerHTML={{ __html: "<strong>" + item + "</strong>" }}
      ></p>
    ); //To format result as html
  };

  render() {
    if (this.state.isScroll === true) this.handleScroll();

    // const tenant = atob(atob(Cookies.get('tnt='))) === 'giandy-pusat' || atob(atob(Cookies.get('tnt='))) === 'giandy-cabang01';
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

    return (
      <Layout page="Receive Pembelian">
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
              Receive pembelian #
              {this.props.match.params.slug !== undefined &&
              this.props.match.params.slug !== null
                ? this.state.no_faktur_beli
                : this.props.nota}
            </h4>
            <h4
              className="text-right   d-flex justify-content-between"
              style={{ width: "50%" }}
            >
              <input
                type="date"
                name="tanggal"
                className={"form-control  nbt nbr nbl bt"}
                value={this.state.tanggal}
                onChange={(e) => this.HandleCommonInputChange(e)}
              />
              <input
                placeholder="Tambahkan catatan disini ...."
                type="text"
                style={{ height: "39px" }}
                className="form-control nbt nbr nbl bt"
                onChange={(e) => this.HandleCommonInputChange(e)}
                name="catatan"
                value={this.state.catatan}
              />
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
                  <div className="chat-area">
                    <div className="chat-search">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group">
                            <label className="text-muted">
                              Ambil data pembelian{" "}
                              {parseInt(this.state.ambil_data, 10) === 1
                                ? "langsung."
                                : parseInt(this.state.ambil_data, 10) === 2
                                ? "dari PO."
                                : "dari Pre-Receive."}
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
                                  selected={
                                    parseInt(this.state.ambil_data, 10) === 1
                                  }
                                >
                                  Pembelian Langsung
                                </option>
                                <option
                                  value={2}
                                  selected={
                                    parseInt(this.state.ambil_data, 10) === 2
                                  }
                                >
                                  Purchase Order
                                </option>
                                <option
                                  value={3}
                                  selected={
                                    parseInt(this.state.ambil_data, 10) === 3
                                  }
                                >
                                  Pre-Receive
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
                            <Select
                              options={this.state.data_nota}
                              placeholder={
                                "Pilih Nota " +
                                (parseInt(this.state.ambil_data, 10) === 2
                                  ? "PO"
                                  : "Pre-Receive")
                              }
                              onChange={this.HandleChangeNota}
                              value={this.state.data_nota.find((op) => {
                                return op.value === this.state.ambil_nota;
                              })}
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label className="text-muted">
                              Cari berdasarkan{" "}
                              {parseInt(this.state.searchby, 10) === 1
                                ? "Kode Barang"
                                : parseInt(this.state.searchby, 10) === 2
                                ? "Variasi"
                                : "Nama Barang"}
                            </label>
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
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <div className="input-group input-group-sm">
                              <input
                                autoFocus
                                type="text"
                                id="chat-search"
                                name="search"
                                className="form-control form-control-sm"
                                value={this.state.search}
                                placeholder={`Search ${
                                  localStorage.anyReceive !== undefined
                                    ? localStorage.anyReceive
                                    : ""
                                }`}
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
                                  style={{ zIndex: 0 }}
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
                        </div>
                        <div className="col-md-12">
                          <div className="chat-area">
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
                                    {this.props.barang &&
                                    this.props.barang.length > 0 ? (
                                      this.props.barang.map((i, inx) => {
                                        console.log(i);
                                        return (
                                          <abbr title={i.nm_brg} key={inx}>
                                            <li
                                              id={`item${inx}`}
                                              className="clearfix"
                                              key={inx}
                                              onClick={(e) => {
                                                this.HandleAddBrg(e, {
                                                  kd_brg: i.kd_brg,
                                                  barcode: i.barcode,
                                                  satuan: i.satuan,
                                                  ukuran: i.ukuran,
                                                  diskon: 0,
                                                  diskon2: 0,
                                                  ppn: 0,
                                                  harga_beli: i.harga_beli,
                                                  qty: 1,
                                                  qty_bonus: 0,
                                                  stock: i.stock,
                                                  nm_brg: i.nm_brg,
                                                  tambahan: i.tambahan,
                                                });
                                              }}
                                            >
                                              <div className="about">
                                                <div className="status titles bold">
                                                  {lengthBrg(i.nm_brg)}
                                                </div>
                                                <div className="status titles bold">
                                                  {" "}
                                                  ({i.ukuran})
                                                </div>
                                              </div>
                                            </li>
                                          </abbr>
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </StickyBox>
            <div
              style={
                this.state.toggleSide
                  ? { width: "100%", zoom: "85%" }
                  : { width: "75%", zoom: "85%" }
              }
            >
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-3">
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
                          Penerima
                        </label>
                        <input
                          type="text"
                          id="chat-search"
                          name="penerima"
                          className="form-control"
                          onChange={(e) =>
                            this.HandleCommonInputChange(e, true)
                          }
                          value={this.state.penerima}
                        />
                        <div
                          className="invalid-feedback"
                          style={
                            this.state.error.penerima !== ""
                              ? { display: "block" }
                              : { display: "none" }
                          }
                        >
                          {this.state.error.penerima}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="control-label font-12">
                          Nota Supplier
                        </label>

                        <input
                          type="text"
                          id="chat-search"
                          name="notasupplier"
                          className="form-control"
                          onChange={(e) => this.HandleCommonInputChange(e)}
                          value={this.state.notasupplier}
                        />
                        <div
                          className="invalid-feedback"
                          style={
                            this.state.error.notasupplier !== ""
                              ? { display: "block" }
                              : { display: "none" }
                          }
                        >
                          {this.state.error.notasupplier}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label className="control-label font-12">
                          Jenis transaksi
                        </label>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="row">
                              <div className="col-md-6">
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
                                    checked={this.state.jenis_trx === "Tunai"}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="customRadio1"
                                  >
                                    Tunai
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-6">
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
                                    checked={this.state.jenis_trx === "Kredit"}
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
                          {/* <div className="col-md-4">
                              <div className="custom-control custom-radio">
                                <input
                                  type="radio"
                                  id="customRadio3"
                                  name="jenis_trx"
                                  onChange={(e) => this.HandleCommonInputChange(e)}
                                  value="Konsinyasi"
                                  className="custom-control-input"
                                  checked={this.state.jenis_trx === "Konsinyasi"}
                                />
                                <label className="custom-control-label" htmlFor="customRadio3">
                                  Konsinyasi
                                </label>
                              </div>
                            </div> */}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      {this.state.jenis_trx === "Kredit" ? (
                        <div className="form-group">
                          <label className="control-label font-12">
                            Tanggal Jatuh Tempo
                          </label>
                          <input
                            type="date"
                            name={"tanggal_tempo"}
                            min={this.state.tanggal}
                            className={"form-control"}
                            value={this.state.tanggal_tempo}
                            onChange={(e) =>
                              this.HandleCommonInputChange(e, true)
                            }
                          />
                        </div>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="control-label font-12">
                          Cari barang di keranjang
                        </label>
                        <ReactSearchAutocomplete
                          maxResults={this.state.databrg.length}
                          inputSearchString={this.state.anyCart}
                          items={this.state.itemSearch}
                          onSelect={this.handleOnSelect.bind(this)}
                          onClear={() => {
                            this.setState({ anyCart: "" });
                          }}
                          autoFocus={false}
                          formatResult={this.formatResult}
                          styling={{
                            boxShadow: "rgba(32, 33, 36, 0.28) 0px 0px 0px 0px",
                            borderRadius: "4px",
                            border: "1px solid hsl(0, 0%, 80%)",
                            height: "38px",
                            // zIndex: "99",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div style={{ overflow: "scroll", height: "400px" }}>
                    <table className="tableFixHead table table-hover table-noborder ">
                      <thead>
                        <tr>
                          <th rowSpan={2} className="text-black middle nowrap">
                            Barang
                          </th>
                          <th rowSpan={2} className="text-black middle nowrap">
                            Variasi
                          </th>
                          <th rowSpan={2} className="text-black middle nowrap">
                            satuan
                          </th>
                          {this.props.auth.user.lvl !==
                            CONFIG_HIDE.HIDE_HRG_BELI && (
                            <th
                              rowSpan={2}
                              className="text-black middle nowrap"
                            >
                              harga beli
                            </th>
                          )}
                          {this.props.auth.user.lvl !==
                            CONFIG_HIDE.HIDE_HRG_BELI && (
                            <th
                              colSpan={this.state.set_harga}
                              className="text-black middle nowrap text-center"
                            >
                              Harga jual
                            </th>
                          )}
                          <th rowSpan={2} className="text-black middle nowrap">
                            diskon
                          </th>
                          <th rowSpan={2} className="text-black middle nowrap">
                            ppn
                          </th>
                          <th rowSpan={2} className="text-black middle nowrap">
                            stock
                          </th>
                          <th rowSpan={2} className="text-black middle nowrap">
                            qty
                          </th>
                          <th rowSpan={2} className="text-black middle nowrap">
                            qty po
                          </th>
                          <th rowSpan={2} className="text-black middle nowrap">
                            bonus
                          </th>
                          {this.props.auth.user.lvl !==
                            CONFIG_HIDE.HIDE_HRG_BELI && (
                            <th
                              rowSpan={2}
                              className="text-black middle nowrap"
                            >
                              Subtotal
                            </th>
                          )}
                          <th rowSpan={2} className="text-black middle nowrap">
                            #
                          </th>
                        </tr>
                        <tr>
                          {this.props.auth.user.lvl !==
                            CONFIG_HIDE.HIDE_HRG_BELI &&
                            typeof this.props.auth.user.nama_harga ===
                              "object" &&
                            (() => {
                              let wrapperCol = [];
                              for (
                                let idx = 0;
                                idx < this.props.auth.user.set_harga;
                                idx++
                              ) {
                                wrapperCol.push(
                                  <th
                                    key={idx}
                                    className="text-black middle nowrap"
                                  >
                                    {
                                      this.props.auth.user.nama_harga[idx][
                                        `harga${idx + 1}`
                                      ]
                                    }
                                  </th>
                                );
                              }
                              return wrapperCol;
                            })()}
                          {/*{*/}
                          {/*(this.props.auth.user.lvl !== CONFIG_HIDE.HIDE_HRG_BELI && typeof this.props.auth.user.nama_harga==="object") && this.props.auth.user.nama_harga.map((row,idx)=>{*/}
                          {/*return(*/}
                          {/*<th key={idx} className="text-black middle nowrap">*/}
                          {/*{row[`harga${idx+1}`]}*/}
                          {/*</th>*/}
                          {/*);*/}
                          {/*})*/}
                          {/*}*/}
                          {/*{(this.props.auth.user.lvl !== CONFIG_HIDE.HIDE_HRG_BELI && typeof this.props.auth.user.nama_harga==="object") && (() => {*/}
                          {/*let container = [];*/}
                          {/*for (let x = 0; x < this.state.set_harga; x++) {*/}
                          {/*container.push(*/}
                          {/*<th key={x} className="text-black middle nowrap">*/}
                          {/*{this.props.auth.user.nama_harga[`harga${x+1}`]}*/}
                          {/*</th>*/}
                          {/*);*/}
                          {/*}*/}
                          {/*return container;*/}
                          {/*})()*/}
                          {/*}*/}
                        </tr>
                      </thead>

                      <tbody>
                        {this.state.databrg.map((item, index) => {
                          let disc1 = 0;
                          let ppn = 0;
                          if (item.diskon !== 0) {
                            disc1 =
                              parseFloat(item.harga_beli) *
                              (parseFloat(item.diskon) / 100);
                          }

                          if (item.ppn !== 0) {
                            ppn =
                              (parseFloat(item.harga_beli) - disc1) *
                              (parseFloat(item.ppn) / 100);
                          }
                          const subtotal_perrow =
                            (parseFloat(item.harga_beli) - disc1 + ppn) *
                            parseFloat(item.qty);
                          subtotal += subtotal_perrow;
                          return (
                            <tr key={index}>
                              <td className="middle nowrap">
                                {item.nm_brg} <br />
                                {item.kd_brg}
                              </td>
                              <td className="middle nowrap">
                                {item.ukuran}
                              </td>
                              <td className="middle nowrap">
                                <select
                                  disabled={item.tambahan.length <= 1}
                                  name="satuan"
                                  onChange={(e) =>
                                    this.HandleChangeInputValue(
                                      e,
                                      index,
                                      item.barcode,
                                      item.tambahan
                                    )
                                  }
                                  className="form-control in-table"
                                  style={{ width: "100px" }}
                                >
                                  {item.tambahan.map((i, b) => {
                                    return (
                                      <option
                                        key={b}
                                        value={i.satuan}
                                        selected={i.satuan === item.satuan}
                                      >
                                        {i.satuan}
                                      </option>
                                    );
                                  })}
                                </select>
                              </td>
                              {this.props.auth.user.lvl !==
                                CONFIG_HIDE.HIDE_HRG_BELI && (
                                <td className="middle nowrap">
                                  <input
                                    style={{
                                      width: "100px",
                                      textAlign: "right",
                                    }}
                                    className="form-control in-table"
                                    type="text"
                                    name="harga_beli"
                                    onBlur={(e) =>
                                      this.HandleChangeInput(e, item.barcode)
                                    }
                                    onChange={(e) =>
                                      this.HandleChangeInputValue(e, index)
                                    }
                                    value={this.state.brgval[index].harga_beli}
                                  />
                                </td>
                              )}
                              {/*{this.props.auth.user.lvl !== CONFIG_HIDE.HIDE_HRG_BELI && (*/}
                              {/*<td className="middle nowrap">*/}
                              {/*<input*/}
                              {/*style={{*/}
                              {/*width: "100px",*/}
                              {/*textAlign: "right",*/}
                              {/*}}*/}
                              {/*className="form-control in-table"*/}
                              {/*type="text"*/}
                              {/*name="harga"*/}
                              {/*onBlur={(e) => this.HandleChangeInput(e, item.barcode)}*/}
                              {/*onChange={(e) => this.HandleChangeInputValue(e, index)}*/}
                              {/*value={toCurrency(this.state.brgval[index].harga)}*/}
                              {/*/>*/}
                              {/*</td>*/}
                              {/*)}*/}

                              {this.props.auth.user.lvl !==
                                CONFIG_HIDE.HIDE_HRG_BELI &&
                                typeof this.props.auth.user.nama_harga ===
                                  "object" &&
                                (() => {
                                  let wrapperCol = [];
                                  for (
                                    let idx = 0;
                                    idx < this.props.auth.user.set_harga;
                                    idx++
                                  ) {
                                    wrapperCol.push(
                                      <td className="middle nowrap" key={idx}>
                                        <input
                                          style={{
                                            width: "100px",
                                            textAlign: "right",
                                          }}
                                          className="form-control in-table"
                                          type="text"
                                          name={`harga_jual#${idx}`}
                                          onBlur={(e) =>
                                            this.HandleChangeInput(
                                              e,
                                              item.barcode
                                            )
                                          }
                                          onChange={(e) =>
                                            this.HandleChangeInputValue(
                                              e,
                                              index,
                                              item.barcode,
                                              item.tambahan
                                            )
                                          }
                                          value={toCurrency(
                                            this.state.brgval[index]
                                              .tambahan[0][
                                              idx === 0
                                                ? "harga"
                                                : `harga${idx + 1}`
                                            ]
                                          )}
                                        />
                                      </td>
                                    );
                                  }
                                  return wrapperCol;
                                })()}

                              {/*{*/}
                              {/*this.props.auth.user.lvl !== CONFIG_HIDE.HIDE_HRG_BELI && this.props.auth.user.nama_harga.map((row,idx)=>{*/}
                              {/*return(*/}
                              {/*<td className="middle nowrap" key={idx}>*/}
                              {/*<input*/}
                              {/*style={{*/}
                              {/*width: "100px",*/}
                              {/*textAlign: "right",*/}
                              {/*}}*/}
                              {/*className="form-control in-table"*/}
                              {/*type="text"*/}
                              {/*name={`harga_jual#${idx}`}*/}
                              {/*onBlur={(e) => this.HandleChangeInput(e, item.barcode)}*/}
                              {/*onChange={(e) => this.HandleChangeInputValue(e, index,item.barcode, item.tambahan)}*/}
                              {/*value={toCurrency(this.state.brgval[index].tambahan[0][idx===0?"harga":`harga${idx+1}`])}*/}
                              {/*/>*/}
                              {/*</td>*/}
                              {/*);*/}
                              {/*})*/}
                              {/*}*/}
                              {/*{this.props.auth.user.lvl !== CONFIG_HIDE.HIDE_HRG_BELI && (*/}
                              {/*parseInt(this.state.set_harga, 10) >= 2&& (*/}
                              {/*<td className="middle nowrap">*/}
                              {/*<input*/}
                              {/*style={{*/}
                              {/*width: "100px",*/}
                              {/*textAlign: "right",*/}
                              {/*}}*/}
                              {/*className="form-control in-table"*/}
                              {/*type="text"*/}
                              {/*name="harga2"*/}
                              {/*onBlur={(e) => this.HandleChangeInput(e, item.barcode)}*/}
                              {/*onChange={(e) => this.HandleChangeInputValue(e, index)}*/}
                              {/*value={toCurrency(this.state.brgval[index].harga2)}*/}
                              {/*/>*/}
                              {/*</td>*/}
                              {/*)*/}
                              {/*) }*/}
                              {/*{this.props.auth.user.lvl !== CONFIG_HIDE.HIDE_HRG_BELI&& (*/}
                              {/*parseInt(this.state.set_harga, 10) >= 3 && (*/}
                              {/*<td className="middle nowrap">*/}
                              {/*<input*/}
                              {/*style={{*/}
                              {/*width: "100px",*/}
                              {/*textAlign: "right",*/}
                              {/*}}*/}
                              {/*className="form-control in-table"*/}
                              {/*type="text"*/}
                              {/*name="harga3"*/}
                              {/*onBlur={(e) => this.HandleChangeInput(e, item.barcode)}*/}
                              {/*onChange={(e) => this.HandleChangeInputValue(e, index)}*/}
                              {/*value={toCurrency(this.state.brgval[index].harga3)}*/}
                              {/*/>*/}
                              {/*</td>*/}
                              {/*)) }*/}
                              {/*{this.props.auth.user.lvl !== CONFIG_HIDE.HIDE_HRG_BELI&& (*/}
                              {/*parseInt(this.state.set_harga, 10) === 4 && (*/}
                              {/*<td className="middle nowrap">*/}
                              {/*<input*/}
                              {/*style={{*/}
                              {/*width: "100px",*/}
                              {/*textAlign: "right",*/}
                              {/*}}*/}
                              {/*className="form-control in-table"*/}
                              {/*type="text"*/}
                              {/*name="harga4"*/}
                              {/*onBlur={(e) => this.HandleChangeInput(e, item.barcode)}*/}
                              {/*onChange={(e) => this.HandleChangeInputValue(e, index)}*/}
                              {/*value={toCurrency(this.state.brgval[index].harga4)}*/}
                              {/*/>*/}
                              {/*</td>*/}
                              {/*))}*/}

                              <td className="middle nowrap">
                                <input
                                  style={{ width: "70px", textAlign: "right" }}
                                  className="form-control in-table"
                                  type="text"
                                  name="diskon"
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
                                  style={{ width: "80px", textAlign: "right" }}
                                  className="form-control in-table"
                                  type="number"
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
                                  style={{ width: "80px", textAlign: "right" }}
                                  readOnly
                                  type="text"
                                  className="form-control in-table"
                                  value={item.stock}
                                />
                              </td>
                              <td className="middle nowrap">
                                <input
                                  style={{ width: "80px", textAlign: "right" }}
                                  className="form-control in-table"
                                  type="text"
                                  name="qty"
                                  ref={(input) =>
                                    (this[`qty-${btoa(item.barcode)}`] = input)
                                  }
                                  onFocus={(e) =>
                                    this.HandleFocusInputReset(e, index)
                                  }
                                  onBlur={(e) =>
                                    this.HandleChangeInput(e, item.barcode)
                                  }
                                  onChange={(e) =>
                                    this.HandleChangeInputValue(e, index)
                                  }
                                  value={this.state.brgval[index].qty}
                                />
                              </td>
                              <td className="middle nowrap">
                                <input
                                  style={{ width: "80px", textAlign: "right" }}
                                  className="form-control in-table"
                                  type="text"
                                  name="qty_po"
                                  value={this.state.brgval[index].qty_po}
                                  readOnly={true}
                                />
                              </td>
                              <td className="middle nowrap">
                                <input
                                  style={{ width: "80px", textAlign: "right" }}
                                  className="form-control in-table"
                                  type="text"
                                  name="qty_bonus"
                                  onBlur={(e) =>
                                    this.HandleChangeInput(e, item.barcode)
                                  }
                                  onChange={(e) =>
                                    this.HandleChangeInputValue(e, index)
                                  }
                                  value={this.state.brgval[index].qty_bonus}
                                />
                              </td>
                              {this.props.auth.user.lvl !==
                                CONFIG_HIDE.HIDE_HRG_BELI && (
                                <td className="middle nowrap">
                                  <input
                                    style={{
                                      width: "100px",
                                      textAlign: "right",
                                    }}
                                    readOnly
                                    type="text"
                                    className="form-control in-table"
                                    value={toRp(subtotal_perrow)}
                                  />
                                </td>
                              )}
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
                      </tbody>
                    </table>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-md-2">
                      <ButtonTrxCommon
                        disabled={false}
                        callback={(e, res) => {
                          if (res === "simpan") this.HandleSubmit(e);
                          if (res === "batal") this.HandleReset(e);
                        }}
                      />
                    </div>
                    <div className="col-md-5">
                      <button className="btn btn-outline-info">
                        Total Barang = {this.state.databrg.length}
                      </button>
                    </div>
                    {this.props.auth.user.lvl !== CONFIG_HIDE.HIDE_HRG_BELI ? (
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
                                  style={{ textAlign: "right" }}
                                  type="text"
                                  id="sub_total"
                                  name="sub_total"
                                  className="form-control text-right"
                                  value={toRp(subtotal)}
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
                                      subtotal
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
                                      subtotal
                                    )
                                  }
                                  name="discount_harga"
                                  className="form-control text-right"
                                  placeholder="Rp"
                                  value={this.state.discount_harga}
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
                                      subtotal
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
                                      subtotal
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
                                  style={{ textAlign: "right" }}
                                  type="text"
                                  name="grand_total"
                                  className="form-control text-right"
                                  readOnly
                                  value={toRp(
                                    subtotal -
                                      subtotal *
                                        (parseFloat(
                                          this.state.discount_persen
                                        ) /
                                          100) +
                                      subtotal *
                                        (parseFloat(this.state.pajak) / 100)
                                  )}
                                />
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
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
  nota: state.receiveReducer.code,
  supplier: state.supplierReducer.dataSupllier,
  isLoading: state.receiveReducer.isLoading,
  auth: state.auth,
  po_report: state.poReducer.report_data,
  po_data: state.poReducer.po_data,
  checkNotaPem: state.siteReducer.check,
  dataEdit: state.receiveReducer.receive_data,
  paginBrg: state.productReducer.pagin_brg,
});

export default withRouter(connect(mapStateToPropsCreateItem)(Receive));
