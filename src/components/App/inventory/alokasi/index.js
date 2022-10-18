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
import {
  FetchNota,
  storeAlokasi,
} from "redux/actions/inventory/alokasi.action";
import {
  FetchDnReport,
  FetchDnData,
  setDnData,
} from "redux/actions/inventory/dn.action";
import StickyBox from "react-sticky-box";
import Select from "react-select";
import Swal from "sweetalert2";
import moment from "moment";
import { withRouter } from "react-router-dom";
import {
  handleError,
  isEmptyOrUndefined,
  swal,
  swallOption,
  toRp,
} from "../../../../helper";
import Spinner from "Spinner";
import { FetchAlokasiData } from "../../../../redux/actions/inventory/alokasi.action";
import TableCommon from "../../common/TableCommon";
import ButtonTrxCommon from "../../common/ButtonTrxCommon";
import Cookies from "js-cookie";

const table = "alokasi";
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

class Alokasi extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addingItemName: "",
      databrg: [],
      brgval: [],
      tanggal: moment(new Date()).format("yyyy-MM-DD"),
      qty: 0,
      location_data: [],
      location: "",
      location2: "",
      location_val: "",
      location2_val: "",
      catatan: "",
      userid: 0,
      searchby: 1,
      search: "",
      no_delivery_note: "-",
      data_nota: [],
      ambil_data: 1,
      ambil_nota: "",
      nota_trx: "-",
      jenis_trx: "Mutasi",
      jenis_trx_data: [
        { value: "Alokasi", label: "Alokasi" },
        { value: "Mutasi", label: "Mutasi" },
        { value: "Transaksi", label: "Transaksi" },
      ],
      scrollPage: 0,
      isScroll: false,
      perpage: 5,
      toggleSide: false,
      error: {
        location: "",
        location2: "",
        catatan: "",
        qty: [],
      },
    };
    this.HandleRemove = this.HandleRemove.bind(this);
    this.HandleAddBrg = this.HandleAddBrg.bind(this);
    this.HandleChangeInput = this.HandleChangeInput.bind(this);
    this.HandleChangeInputValue = this.HandleChangeInputValue.bind(this);
    this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
    this.HandleChangeLokasi2 = this.HandleChangeLokasi2.bind(this);
    this.setTanggal = this.setTanggal.bind(this);
    this.HandleSearch = this.HandleSearch.bind(this);
    this.getData = this.getData.bind(this);
    this.HandleChangeNota = this.HandleChangeNota.bind(this);
    this.HandleChangeJenisTrx = this.HandleChangeJenisTrx.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);

    if (
      this.props.match.params.id !== undefined &&
      this.props.match.params.id !== ""
    ) {
      this.props.dispatch(
        FetchAlokasiData(
          1,
          atob(this.props.match.params.id),
          "",
          "",
          "",
          "99999"
        )
      );
    }
    this.handleClickToggle = this.handleClickToggle.bind(this);
  }
  handleClickToggle(e) {
    e.preventDefault();
    this.setState({
      toggleSide: !this.state.toggleSide,
    });
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
          nota_trx: this.props.nota === "" ? "-" : this.props.nota,
        });
      }
    }
  }

  componentWillMount() {
    this.getProps(this.props);
  }

  componentDidUpdate(prevState) {
    if (this.props.alokasiDetail !== prevState.alokasiDetail) {
      // this.getProps(this.props)
      destroy(table);
      let param = this.props;
      if (param.alokasiDetail !== undefined || param.alokasiDetail.length > 0) {
        let val = param.alokasiDetail;
        this.setState({
          nota_trx: val.master.no_faktur_mutasi,
          tanggal: moment(val.master.tgl_mutasi).format("yyyy-MM-DD"),
          location: val.master.kd_lokasi_1,
          location2: val.master.kd_lokasi_2,
          catatan: val.master.keterangan,
          no_delivery_note: val.master.no_faktur_beli,
          jenis_trx:
            String(atob(this.props.match.params.id)).substr(0, 2) === "MC"
              ? "Alokasi"
              : String(atob(this.props.match.params.id)).substr(0, 2) === "MU"
              ? "Mutasi"
              : "Transaksi",
        });
        if (val.detail !== undefined) {
          val.detail.map((item) => {
            const datas = {
              kd_brg: item.kode_barang,
              nm_brg: item.nm_brg,
              barcode: item.barcode,
              satuan: item.satuan,
              harga_beli: item.harga_beli,
              hrg_jual: item.harga_jual,
              stock: item.stock,
              qty: item.qty,
              tambahan: item.tambahan,
            };
            store(table, datas);
            this.getData();
            return null;
          });
        }

        this.props.dispatch(
          FetchBrg(1, "barcode", "", val.kd_lokasi_1, null, this.autoSetQty, 5)
        );
      }
    }
    if (this.state.nota_trx === "-") {
      this.setState({
        nota_trx:
          this.props.alokasiDetail.master === undefined
            ? "- "
            : this.props.alokasiDetail.master.no_faktur_mutasi,
      });
    }
  }

  componentDidMount() {
    this.getData();
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
        this.props.dispatch(FetchDnReport(1, 1000));
      }
      this.setState({
        ambil_data: parseInt(localStorage.ambil_data, 10),
      });
    }

    if (localStorage.nota !== undefined && localStorage.nota !== "") {
      this.setState({
        ambil_nota: localStorage.nota,
      });
    }

    if (localStorage.lk !== undefined && localStorage.lk !== "") {
      let prefix =
        this.state.jenis_trx.toLowerCase() === "alokasi"
          ? "MC"
          : this.state.jenis_trx.toLowerCase() === "mutasi"
          ? "MU"
          : "TR";

      this.props.dispatch(FetchNota(localStorage.lk, prefix));
      this.props.dispatch(
        FetchBrg(1, "barcode", "", localStorage.lk, null, this.autoSetQty, 5)
      );

      this.setState({
        location: localStorage.lk,
      });
    }
    if (localStorage.lk2 !== undefined && localStorage.lk2 !== "") {
      console.log("component did mount", localStorage.lk2);
      this.setState({
        location2: localStorage.lk2,
      });
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.getProps(nextProps);
    let perpage = this.state.perpage;
    if (this.props.barang.length === perpage) {
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

    if (nextProps.dn_report) {
      let nota = [];
      let po = nextProps.dn_report;
      if (po !== undefined) {
        po.map((i) => {
          nota.push({
            value: i.no_delivery_note,
            label: i.no_delivery_note,
          });
          return null;
        });
        this.setState({
          data_nota: nota,
        });
      }
    }
    if (nextProps.dn_data) {
      if (nextProps.dn_data.master !== undefined) {
        if (this.props.dn_data === undefined) {
          let prefix =
            this.state.jenis_trx.toLowerCase() === "alokasi"
              ? "MC"
              : this.state.jenis_trx.toLowerCase() === "mutasi"
              ? "MU"
              : "TR";
          this.props.dispatch(
            FetchNota(nextProps.dn_data.master.kd_lokasi_1, prefix)
          );
          this.setState({
            location: nextProps.dn_data.master.kd_lokasi_1,
            location2: nextProps.dn_data.master.kd_lokasi_2,
            catatan: nextProps.dn_data.master.keterangan,
            no_delivery_note: nextProps.dn_data.master.no_delivery_note,
          });
          localStorage.setItem("lk", nextProps.dn_data.master.kd_lokasi_1);
          localStorage.setItem("lk2", nextProps.dn_data.master.kd_lokasi_2);
          localStorage.setItem("catatan", nextProps.dn_data.master.catatan);

          nextProps.dn_data.detail.map((item) => {
            const datas = {
              kd_brg: item.kode_barang,
              nm_brg: item.nm_brg,
              barcode: item.barcode,
              satuan: item.satuan,
              harga_beli: item.harga_beli,
              hrg_jual: item.harga,
              stock: item.stock,
              qty: item.qty,
              tambahan: item.tambahan,
            };
            store(table, datas);
            this.getData();
            return null;
          });
        }
      }
    }
  };

  componentWillUnmount() {
    this.props.dispatch(
      setProductbrg({ status: "", msg: "", result: { data: [] } })
    );
    destroy(table);
    this.setState({ nota_trx: "-" });
    localStorage.removeItem("sp");
    localStorage.removeItem("lk");
    localStorage.removeItem("lk2");
    localStorage.removeItem("ambil_data");
    localStorage.removeItem("nota");
    localStorage.removeItem("catatan");
    localStorage.removeItem("anyAlokasi");
  }

  HandleChangeNota(nota) {
    this.props.dispatch(setDnData([]));
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
    destroy(table);
    localStorage.setItem("nota", nota.value);
    this.props.dispatch(FetchDnData(nota.value));
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
      location2: "",
    });
    this.HandleChangeLokasi2(lk, "change");
    localStorage.setItem("lk", lk.value);
    let prefix =
      this.state.jenis_trx.toLowerCase() === "alokasi"
        ? "MC"
        : this.state.jenis_trx.toLowerCase() === "mutasi"
        ? "MU"
        : "TR";
    this.props.dispatch(FetchNota(lk.value, prefix));
    this.props.dispatch(
      FetchBrg(1, "barcode", "", lk.value, null, this.autoSetQty, 5)
    );
    destroy(table);
    this.getData();
  }

  HandleChangeLokasi2(sp, par = "") {
    let setState = {
      location2: sp.value,
      location2_val: sp.label,
    };
    if (par === "change") {
      let anotherLocation = this.state.location_data.filter(
        (option) => option.value !== sp.value
      );
      Object.assign(setState, {
        location2: anotherLocation[0].value,
        location2_val: anotherLocation[0].label,
      });
    }
    localStorage.setItem("lk2", setState.location2);
    this.setState(setState);
  }
  HandleChangeJenisTrx(sp) {
    this.setState({
      jenis_trx: sp.value,
    });
    if (this.state.location !== "") {
      let prefix =
        sp.value.toLowerCase() === "alokasi"
          ? "MC"
          : sp.value.toLowerCase() === "mutasi"
          ? "MU"
          : "TR";
      this.props.dispatch(FetchNota(this.state.location, prefix));
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
    }
  }

  HandleCommonInputChange(e, errs = true, st = 0) {
    const column = e.target.name;
    const val = e.target.value;
    this.setState({
      [column]: val,
    });
    if (column === "jenis_trx") {
      if (this.state.location !== "") {
        let prefix =
          val.toLowerCase() === "alokasi"
            ? "MC"
            : val.toLowerCase() === "mutasi"
            ? "MU"
            : "TR";
        this.props.dispatch(FetchNota(this.state.location, prefix));
      }
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
        this.props.dispatch(FetchDnReport(1, 1000));
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

  HandleChangeInput(e, id, idx) {
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

  HandleChangeInputValue(e, i, barcode = null, datas = []) {
    const column = e.target.name;
    const val = e.target.value;
    let brgval = [...this.state.brgval];
    brgval[i] = { ...brgval[i], [column]: val };
    this.setState({ brgval });
    console.log("asd", datas);
    if (column === "harga") {
      const cek = cekData("barcode", barcode, table);
      cek.then((res) => {
        if (res === undefined) {
          Toast.fire({
            icon: "error",
            title: `not found.`,
          });
        } else {
          let final = {
            id: res.id,
            kd_brg: res.kd_brg,
            nm_brg: res.nm_brg,
            barcode: res.barcode,
            satuan: res.satuan,
            harga_beli: res.harga_beli,
            hrg_jual: val,
            stock: res.stock,
            qty: 1,
            tambahan: res.tambahan,
          };
          update(table, final);
          Toast.fire({
            icon: "success",
            title: `${column} has been changed.`,
          });
        }
        this.getData();
        return null;
      });
    }
    if (column === "satuan") {
      const cek = cekData("barcode", barcode, table);
      cek.then((res) => {
        if (res === undefined) {
          Toast.fire({
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
            barcode: newbrg.barcode,
            satuan: newbrg.satuan,
            harga_beli: newbrg.harga_beli,
            hrg_jual: newbrg.harga,
            stock: newbrg.stock,
            qty: 1,
            tambahan: res.tambahan,
          };
          update(table, final);
          Toast.fire({
            icon: "success",
            title: `${column} has been changed.`,
          });
        }
        this.getData();
        return null;
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
    swallOption("anda yakin akan menghapus data ini ?", () => {
      console.log(id);
      if (id !== null) {
        del(table, id).then((res) => {
          this.getData();
          swal("data berhasil dihapus");
        });
      } else {
        destroy(table);
        localStorage.removeItem("lk2");
        localStorage.removeItem("lk");
        localStorage.removeItem("ambil_data");
        localStorage.removeItem("nota");
        this.getData();
      }
    });
  }

  HandleAddBrg(e, item) {
    console.log(item);
    e.preventDefault();
    this.setState({
      isScroll: false,
    });
    const finaldt = {
      kd_brg: item.kd_brg,
      nm_brg: item.nm_brg,
      barcode: item.barcode,
      satuan: item.satuan,
      harga_beli: item.harga_beli,
      hrg_jual: item.hrg_jual,
      stock: item.stock,
      qty: item.qty,
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
          satuan: res.satuan,
          harga_beli: res.harga_beli,
          hrg_jual: res.hrg_jual,
          stock: res.stock,
          qty: parseFloat(res.qty) + 1,
          tambahan: res.tambahan,
        });
      }

      this.getData();
      return null;
    });
  }

  HandleSubmit(e) {
    e.preventDefault();
    // validator head form
    if (!isEmptyOrUndefined(this.state.location)) {
      handleError("Lokasi asal");
      return;
    }
    if (!isEmptyOrUndefined(this.state.location2)) {
      handleError("Lokasi tujuan");
      return;
    }

    const data = get(table);
    data.then((res) => {
      if (res.length === 0) {
        swal(`Pilih barang untuk melanjutkan ${this.state.jenis_trx}.`);
      } else {
        swallOption("Pastikan data yang anda masukan sudah benar!", () => {
          let subtotal = 0;
          let detail = [];
          let err_stock = "";
          res.map((item) => {
            subtotal += parseInt(item.harga_beli, 10) * parseFloat(item.qty);
            if (item.qty > item.stock)
              err_stock = `Qty barang melebihi stock persediaan.`;
            detail.push({
              kd_brg: item.kd_brg,
              barcode: item.barcode,
              satuan: item.satuan,
              qty: item.qty,
              hrg_beli: item.harga_beli,
              hrg_jual: item.hrg_jual,
            });
            return null;
          });
          let data_final = {
            tgl_mutasi: moment(this.state.tanggal).format("YYYY-MM-DD"),
            lokasi_asal: this.state.location,
            lokasi_tujuan: this.state.location2,
            catatan: !isEmptyOrUndefined(this.state.catatan)
              ? "-"
              : this.state.catatan,
            kode_delivery_note: this.state.ambil_nota,
            subtotal,
            userid: this.state.userid,
            jenis_trx: this.state.jenis_trx,
            detail: detail,
          };
          let parsedata = {};
          parsedata["detail"] = data_final;
          parsedata["master"] = this.state.databrg;
          parsedata["nota"] = this.props.nota;
          parsedata["logo"] = this.props.auth.user.logo;
          parsedata["user"] = this.props.auth.user.username;
          parsedata["lokasi_asal"] = this.state.location_val;
          parsedata["lokasi_tujuan"] = this.state.location2_val;
          let prefix =
            this.state.jenis_trx.toLowerCase() === "alokasi"
              ? "MC"
              : this.state.jenis_trx.toLowerCase() === "mutasi"
              ? "MU"
              : "TR";

          if (
            this.props.match.params.id !== undefined &&
            this.props.match.params.id !== ""
          ) {
            swallOption(`Anda yakin akan memperbarui transaksi?`, () => {
              parsedata["nota"] = this.state.nota_trx;
              this.props.dispatch(
                storeAlokasi(parsedata, () => {
                  this.props.dispatch(FetchNota(localStorage.lk, prefix));
                })
              );
            });
          } else {
            this.props.dispatch(
              storeAlokasi(parsedata, () => {
                this.props.dispatch(FetchNota(localStorage.lk, prefix));
              })
            );
          }
        });
      }
      return null;
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
          satuan: data[0].satuan,
          harga_beli: data[0].harga_beli,
          hrg_jual: data[0].hrg_jual,
          stock: data[0].stock,
          qty: 1,
          tambahan: data[0].tambahan,
        });
      } else {
        update(table, {
          id: res.id,
          qty: parseFloat(res.qty) + 1,
          kd_brg: res.kd_brg,
          nm_brg: res.nm_brg,
          barcode: res.barcode,
          satuan: res.satuan,
          harga_beli: res.harga_beli,
          hrg_jual: res.hrg_jual,
          stock: res.stock,
          tambahan: res.tambahan,
        });
      }
      return true;
    });
  }

  HandleSearch() {
    if (this.state.supplier === "" || this.state.lokasi === "") {
      Swal.fire(
        "Gagal!",
        "Pilih lokasi dan supplier terlebih dahulu.",
        "error"
      );
    } else {
      localStorage.setItem("anyAlokasi", this.state.search);
      const searchby =
        parseInt(this.state.searchby, 10) === 1
          ? "kd_brg"
          : parseInt(this.state.searchby, 10) === 2
          ? "barcode"
          : "deskripsi";
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
      this.setState({ search: "" });
    }
  }

  getData() {
    const data = get(table);
    data.then((res) => {
      let brg = [];
      let err = [];
      res.map((i) => {
        brg.push({
          qty: i.qty,
          satuan: i.satuan,
        });
        err.push({
          qty: "",
        });
        return null;
      });
      this.setState({
        databrg: res,
        brgval: brg,
        error: Object.assign({}, this.state.eror, {
          qty: err,
        }),
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
        searchby = "barcode";
      }
      if (parseInt(this.state.searchby, 10) === 3) {
        searchby = "deskripsi";
      }
      this.props.dispatch(
        FetchBrg(
          1,
          searchby,
          localStorage.anyAlokasi !== undefined ||
            localStorage.anyAlokasi !== ""
            ? localStorage.anyAlokasi
            : "",
          this.state.location,
          this.state.supplier,
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
    let subtotal = 0;

    return (
      <Layout page="Alokasi">
        <div className="card">
          <div className="card-header  d-flex justify-content-between">
            <h5>
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
              {this.props.match.params.id === undefined
                ? "Alokasi #" + this.state.nota_trx
                : `Edit ${
                    (String(atob(this.props.match.params.id)).substr(0, 2) ===
                    "MU"
                      ? "Mutasi"
                      : String(atob(this.props.match.params.id)).substr(
                          0,
                          2
                        ) === "TR"
                      ? "Transaksi"
                      : "Alokasi") +
                    " : " +
                    atob(this.props.match.params.id)
                  }`}
            </h5>
            <h4
              className="text-right  d-flex justify-content-between"
              style={{ width: "50%" }}
            >
              <input
                type="date"
                name={"tanggal"}
                className={"form-control nbt nbr nbl bt"}
                value={this.state.tanggal}
                onChange={(e) => this.HandleCommonInputChange(e)}
                disabled={this.props.match.params.id !== undefined}
              />
              <input
                placeholder="Tambahkan catatan disini ...."
                type="text"
                style={{ height: "39px" }}
                className="form-control nbt nbr nbl bt"
                value={this.state.catatan}
                onChange={(e) => this.HandleCommonInputChange(e)}
                name="catatan"
              />
            </h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div
                className="col-md-12"
                style={{
                  zoom: "90%",
                  display: "flex",
                  alignItems: "flex-start",
                }}
              >
                <StickyBox
                  offsetTop={100}
                  offsetBottom={20}
                  style={
                    this.state.toggleSide
                      ? { display: "none", width: "25%", marginRight: "10px" }
                      : { display: "block", width: "25%", marginRight: "10px" }
                  }
                >
                  {this.props.match.params.id === undefined ? (
                    <div className="chat-area">
                      <div className="chat-header-text d-flex border-none mb-10">
                        <div className="chat-about">
                          <div className="chat-with font-13">Ambil Data</div>
                        </div>
                      </div>
                      <div className="chat-search">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group">
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
                                    Delivery Note
                                  </option>
                                </select>
                              </div>
                              <small
                                id="passwordHelpBlock"
                                className="form-text text-muted"
                              >
                                {parseInt(this.state.ambil_data, 10) === 1
                                  ? this.state.jenis_trx + " langsung."
                                  : "Ambil data pembelian dari Delivery Note."}
                              </small>
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
                                    ? "DN"
                                    : "")
                                }
                                onChange={this.HandleChangeNota}
                                value={this.state.data_nota.find((op) => {
                                  return op.value === this.state.ambil_nota;
                                })}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="chat-area">
                    <div className="chat-header-text d-flex border-none mb-10">
                      <div className="chat-about">
                        <div className="chat-with font-12">Pilih Barang</div>
                      </div>
                    </div>
                    <div className="chat-search">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group">
                            <div className="input-group input-group-sm">
                              <select
                                name="searchby"
                                className="form-control form-control-sm"
                                onChange={(e) =>
                                  this.HandleCommonInputChange(e, false)
                                }
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
                              Cari berdasarkan{" "}
                              {parseInt(this.state.searchby, 10) === 1
                                ? "Kode Barang"
                                : parseInt(this.state.searchby, 10) === 2
                                ? "Barcode"
                                : "Deskripsi"}
                            </small>
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
                                  localStorage.anyAlokasi !== undefined
                                    ? localStorage.anyAlokasi
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
                                        nm_brg: i.nm_brg,
                                        barcode: i.barcode,
                                        satuan: i.satuan,
                                        harga_beli: i.harga_beli,
                                        hrg_jual: i.hrg_jual,
                                        stock: i.stock,
                                        qty: 1,
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
                                          color: "#a1887f",
                                          fontWeight: "bold",
                                          wordBreak: "break-all",
                                          fontSize: "12px",
                                        }}
                                      >
                                        ({i.kd_brg}) {i.supplier}
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
                </StickyBox>
                {/*START RIGHT*/}
                <div
                  style={
                    this.state.toggleSide ? { width: "100%" } : { width: "75%" }
                  }
                >
                  <form className="">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="control-label">
                            Jenis Transaksi
                          </label>
                          <Select
                            options={this.state.jenis_trx_data}
                            placeholder="Pilih Jenis Transaksi"
                            onChange={this.HandleChangeJenisTrx}
                            value={this.state.jenis_trx_data.find((op) => {
                              return op.value === this.state.jenis_trx;
                            })}
                            isDisabled={
                              this.props.match.params.id !== undefined
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="control-label">Lokasi Asal</label>
                          <Select
                            options={this.state.location_data}
                            placeholder="==== Pilih ===="
                            onChange={this.HandleChangeLokasi}
                            value={this.state.location_data.find((op) => {
                              return op.value === this.state.location;
                            })}
                            isDisabled={
                              this.props.match.params.id !== undefined
                            }
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
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="control-label">Lokasi Tujuan</label>
                          <Select
                            options={this.state.location_data.filter(
                              (option) => option.value !== this.state.location
                            )}
                            placeholder="==== Pilih ===="
                            onChange={this.HandleChangeLokasi2}
                            value={this.state.location_data.find((op) => {
                              return op.value === this.state.location2;
                            })}
                          />
                          <div
                            className="invalid-feedback"
                            style={
                              this.state.error.location2 !== ""
                                ? { display: "block" }
                                : { display: "none" }
                            }
                          >
                            {this.state.error.location2}
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                  <TableCommon
                    head={[
                      { rowSpan: 2, label: "No", width: "1%" },
                      { rowSpan: 2, label: "Barang", width: "1%" },
                      { rowSpan: 2, label: "Satuan", width: "1%" },
                      { colSpan: 2, label: "Harga", width: "1%" },
                      { rowSpan: 2, label: "Stok", width: "1%" },
                      { rowSpan: 2, label: "Qty" },
                      { rowSpan: 2, label: "Subtotal", width: "1%" },
                      { rowSpan: 2, label: "#", width: "1%" },
                    ]}
                    rowSpan={[{ label: "Beli" }, { label: "Jual" }]}
                    renderRow={this.state.databrg.map((item, index) => {
                      subtotal +=
                        this.state.jenis_trx.toLowerCase() !== "transaksi"
                          ? parseInt(item.harga_beli, 10) * parseFloat(item.qty)
                          : parseInt(item.hrg_jual, 10) * parseFloat(item.qty);
                      return (
                        <tr key={index}>
                          <td className="middle nowrap text-center">
                            {index + 1}
                          </td>

                          <td className="middle nowrap">
                            {item.nm_brg}
                            <br />
                            {item.barcode}
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
                          <td className="middle nowrap text-right">
                            {toRp(item.harga_beli)}
                          </td>
                          <td className="middle nowrap text-right">
                            {atob(atob(Cookies.get("tnt="))) === "depo-beku" ||
                            atob(atob(Cookies.get("tnt="))) === "npos" ? (
                              <select
                                className="form-control in-table"
                                style={{ width: "100px" }}
                                name="harga"
                                onChange={(e) =>
                                  this.HandleChangeInputValue(
                                    e,
                                    index,
                                    item.barcode,
                                    item.tambahan
                                  )
                                }
                              >
                                {(() => {
                                  let container = [];
                                  for (
                                    let k = 0;
                                    k < this.props.auth.user.set_harga;
                                    k++
                                  ) {
                                    container.push(
                                      <option
                                        value={
                                          item.tambahan[0][
                                            k === 0 ? `harga` : `harga${k + 1}`
                                          ]
                                        }
                                        selected={
                                          item.tambahan[0][
                                            k === 0 ? `harga` : `harga${k + 1}`
                                          ] === item.hrg_jual
                                        }
                                      >
                                        {
                                          item.tambahan[0][
                                            k === 0 ? `harga` : `harga${k + 1}`
                                          ]
                                        }{" "}
                                        -{" "}
                                        {
                                          this.props.auth.user.nama_harga[k][
                                            `harga${k + 1}`
                                          ]
                                        }
                                      </option>
                                    );
                                  }
                                  return container;
                                })()}
                              </select>
                            ) : (
                              <td className="middle nowrap text-right">
                                {toRp(item.hrg_jual)}
                              </td>
                            )}
                          </td>
                          <td className="middle nowrap text-right">
                            {item.stock}
                          </td>
                          <td className="middle nowrap">
                            <input
                              type="text"
                              name="qty"
                              className="form-control in-table text-right"
                              onBlur={(e) =>
                                this.HandleChangeInput(e, item.barcode)
                              }
                              onChange={(e) =>
                                this.HandleChangeInputValue(e, index)
                              }
                              value={this.state.brgval[index].qty}
                            />
                            <div
                              className="invalid-feedback"
                              style={
                                parseInt(this.state.brgval[index].qty, 10) >
                                parseInt(item.stock, 10)
                                  ? { display: "block" }
                                  : { display: "none" }
                              }
                            >
                              Qty Melebihi Stock.
                            </div>
                          </td>
                          <td className="middle nowrap text-right">
                            {this.state.jenis_trx.toLowerCase() !== "transaksi"
                              ? toRp(
                                  parseInt(item.harga_beli, 10) *
                                    parseFloat(item.qty)
                                )
                              : toRp(
                                  parseInt(item.hrg_jual, 10) *
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
                            colSpan: 7,
                            label: "Total",
                            className: "text-left",
                          },
                          { colSpan: 1, label: toRp(subtotal) },
                        ],
                      },
                    ]}
                  />

                  <div className="row">
                    <div className="col-md-4">
                      <ButtonTrxCommon
                        disabled={this.state.databrg.length < 1}
                        callback={(e, res) => {
                          if (res === "simpan") this.HandleSubmit(e);
                          if (res === "batal") this.HandleRemove(e, null);
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
  paginBrg: state.productReducer.pagin_brg,
  nota: state.alokasiReducer.code,
  supplier: state.supplierReducer.dataSupllier,
  isLoading: state.alokasiReducer.isLoading,
  auth: state.auth,
  dn_report: state.dnReducer.report_data,
  dn_data: state.dnReducer.dn_data,
  checkNotaPem: state.siteReducer.check,
  alokasiDetail: state.alokasiReducer.alokasi_data,
});

export default withRouter(connect(mapStateToPropsCreateItem)(Alokasi));
