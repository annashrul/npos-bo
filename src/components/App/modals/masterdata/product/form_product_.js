import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalHeader } from "reactstrap";
import connect from "react-redux/es/connect/connect";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import {
  setProductEdit,
  createProduct,
  updateProduct,
} from "redux/actions/masterdata/product/product.action";
import { FetchCheck } from "redux/actions/site.action";
import axios from "axios";
import { HEADERS } from "redux/actions/_constants";
import moment from "moment";
import {
  handleError,
  rmComma,
  select2Group,
  setFocus,
  toCurrency,
} from "../../../../../helper";
import { isNaN } from "lodash";
import FormGroupProduct from "../../../../../components/App/modals/masterdata/group_product/form_group_product";
import FormSupplier from "../../../../../components/App/modals/masterdata/supplier/form_supplier";
import Default from "../../../../../assets/default.png";
import { convertBase64 } from "helper";
import FormProductPricings from "./form_product_pricing_";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import FormPrinter from "../printer/form_printer";
import Preloader from "Preloader";
import FormRak from "../rak/form_rak";
import FormUkuran from "./form_ukuran";

const tenantBool =
  Cookies.get("tnt=") !== undefined
    ? atob(atob(Cookies.get("tnt="))) === "giandy-pusat" ||
    atob(atob(Cookies.get("tnt="))) === "giandy-cabang01"
    : false;
class FormProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalFormGroupProduct: false,
      isModalFormPrinter: false,
      detail: {},
      nm_harga1: "1",
      nm_harga2: "2",
      nm_harga3: "3",
      nm_harga4: "4",
      nm_harga5: "5",
      nm_harga6: "6",
      nm_harga7: "7",
      nm_harga8: "8",
      nm_harga9: "9",
      nm_harga10: "10",
      set_harga: 1,
      selectedIndex: 0,
      error_barcode1: false,
      error_barcode2: false,
      error_barcode3: false,
      pesan_barcode1: "",
      pesan_barcode2: "",
      pesan_barcode3: "",
      error: {
        kd_brg: "",
        nm_brg: "",
        nama_singkat: "",
        tag: "",
        kel_brg: "",
        stock: "",
        kategori: "",
        stock_min: "",
        group1: "",
        group2: "",
        deskripsi: "",
        jenis: "",
        kcp: "",
        poin: "",
        online: "",
        berat: "",
        barang_sku_err: [],
      },
      kd_brg: "",
      nm_brg: "",
      nama_singkat: "",
      tag: "",
      kel_brg_data: [],
      kel_brg: "",
      rak_data: [],
      rak: "",
      stock: "0",
      kategori: "1",
      stock_min: "0",
      group1_data: [],
      group1: "",
      group2_data: [],
      group2: "-",
      deskripsi: "-",
      gambar: "-",
      jenis: "1",
      kcp: "",
      kcp_data: [],
      poin: "0",
      online: "0",
      berat: "0",
      barangSku: [{ barcode: "", qty: "", konversi: "", satuan_jual: "1" }],
      barangHargaEdit: [
        [
          {
            nama_toko: "",
            lokasi: "",
            isCheckedPCS: false,
            hrgBeliPCS: 0,
            margin1PCS: "0",
            margin2PCS: "0",
            margin3PCS: "0",
            margin4PCS: "0",
            margin5PCS: "0",
            margin6PCS: "0",
            margin7PCS: "0",
            margin8PCS: "0",
            margin9PCS: "0",
            margin10PCS: "0",
            hrgJual1PCS: "0",
            hrgJual2PCS: "0",
            hrgJual3PCS: "0",
            hrgJual4PCS: "0",
            hrgJual5PCS: "0",
            hrgJual6PCS: "0",
            hrgJual7PCS: "0",
            hrgJual8PCS: "0",
            hrgJual9PCS: "0",
            hrgJual10PCS: "0",
            ppnPCS: 0,
            servicePCS: 0,
          },
          {
            nama_toko: "",
            lokasi: "",
            isCheckedPACK: false,
            hrgBeliPACK: 0,
            margin1PACK: "0",
            margin2PACK: "0",
            margin3PACK: "0",
            margin4PACK: "0",
            margin5PACK: "0",
            margin6PACK: "0",
            margin7PACK: "0",
            margin8PACK: "0",
            margin9PACK: "0",
            margin10PACK: "0",
            hrgJual1PACK: "0",
            hrgJual2PACK: "0",
            hrgJual3PACK: "0",
            hrgJual4PACK: "0",
            hrgJual5PACK: "0",
            hrgJual6PACK: "0",
            hrgJual7PACK: "0",
            hrgJual8PACK: "0",
            hrgJual9PACK: "0",
            hrgJual10PACK: "0",
            ppnPACK: 0,
            servicePACK: 0,
          },
          {
            nama_toko: "",
            lokasi: "",
            isCheckedKARTON: false,
            hrgBeliKARTON: 0,
            margin1KARTON: "0",
            margin2KARTON: "0",
            margin3KARTON: "0",
            margin4KARTON: "0",
            margin5KARTON: "0",
            margin6KARTON: "0",
            margin7KARTON: "0",
            margin8KARTON: "0",
            margin9KARTON: "0",
            margin10KARTON: "0",
            hrgJual1KARTON: "0",
            hrgJual2KARTON: "0",
            hrgJual3KARTON: "0",
            hrgJual4KARTON: "0",
            hrgJual5KARTON: "0",
            hrgJual6KARTON: "0",
            hrgJual7KARTON: "0",
            hrgJual8KARTON: "0",
            hrgJual9KARTON: "0",
            hrgJual10KARTON: "0",
            ppnKARTON: 0,
            serviceKARTON: 0,
          },
        ],
      ],
      barangHarga: [
        [
          {
            nama_toko: "",
            lokasi: "",
            isCheckedPCS: false,
            hrgBeliPCS: 0,
            margin1PCS: "0",
            margin2PCS: "0",
            margin3PCS: "0",
            margin4PCS: "0",
            margin5PCS: "0",
            margin6PCS: "0",
            margin7PCS: "0",
            margin8PCS: "0",
            margin9PCS: "0",
            margin10PCS: "0",
            hrgJual1PCS: "0",
            hrgJual2PCS: "0",
            hrgJual3PCS: "0",
            hrgJual4PCS: "0",
            hrgJual5PCS: "0",
            hrgJual6PCS: "0",
            hrgJual7PCS: "0",
            hrgJual8PCS: "0",
            hrgJual9PCS: "0",
            hrgJual10PCS: "0",
            ppnPCS: 0,
            servicePCS: 0,
          },
          {
            nama_toko: "",
            lokasi: "",
            isCheckedPACK: false,
            hrgBeliPACK: 0,
            margin1PACK: "0",
            margin2PACK: "0",
            margin3PACK: "0",
            margin4PACK: "0",
            margin5PACK: "0",
            margin6PACK: "0",
            margin7PACK: "0",
            margin8PACK: "0",
            margin9PACK: "0",
            margin10PACK: "0",
            hrgJual1PACK: "0",
            hrgJual2PACK: "0",
            hrgJual3PACK: "0",
            hrgJual4PACK: "0",
            hrgJual5PACK: "0",
            hrgJual6PACK: "0",
            hrgJual7PACK: "0",
            hrgJual8PACK: "0",
            hrgJual9PACK: "0",
            hrgJual10PACK: "0",
            ppnPACK: 0,
            servicePACK: 0,
          },
          {
            nama_toko: "",
            lokasi: "",
            isCheckedKARTON: false,
            hrgBeliKARTON: 0,
            margin1KARTON: "0",
            margin2KARTON: "0",
            margin3KARTON: "0",
            margin4KARTON: "0",
            margin5KARTON: "0",
            margin6KARTON: "0",
            margin7KARTON: "0",
            margin8KARTON: "0",
            margin9KARTON: "0",
            margin10KARTON: "0",
            hrgJual1KARTON: "0",
            hrgJual2KARTON: "0",
            hrgJual3KARTON: "0",
            hrgJual4KARTON: "0",
            hrgJual5KARTON: "0",
            hrgJual6KARTON: "0",
            hrgJual7KARTON: "0",
            hrgJual8KARTON: "0",
            hrgJual9KARTON: "0",
            hrgJual10KARTON: "0",
            ppnKARTON: 0,
            serviceKARTON: 0,
          },
        ],
      ],
      barcode: [],
      qty: [],
      konversi: [],
      satuan_jual: [],
      isChecked: false,
      PACK: false,
      KARTON: false,
      check: [],
      hrg_beli: "0",
      hrg_beli_pack: "0",
      hrg_beli_karton: "0",
      margin1: "0",
      margin2: "0",
      margin3: "0",
      margin4: "0",
      margin1_pack: "0",
      margin2_pack: "0",
      margin3_pack: "0",
      margin4_pack: "0",
      margin1_karton: "0",
      margin2_karton: "0",
      margin3_karton: "0",
      margin4_karton: "0",
      hrgjual1: "0",
      hrgjual2: "0",
      hrgjual3: "0",
      hrgjual4: "0",
      hrgjual1_pack: "0",
      hrgjual2_pack: "0",
      hrgjual3_pack: "0",
      hrgjual4_pack: "0",
      hrgjual1_karton: "0",
      hrgjual2_karton: "0",
      hrgjual3_karton: "0",
      hrgjual4_karton: "0",
      service: "0",
      service_pack: "0",
      service_karton: "0",
      ppn: "0",
      ppn_pack: "0",
      ppn_karton: "0",

      hrgBeliPACK: 0,
      margin1PACK: "0",
      margin2PACK: "0",
      margin3PACK: "0",
      margin4PACK: "0",
      hrgJual1PACK: "0",
      hrgJual2PACK: "0",
      hrgJual3PACK: "0",
      hrgJual4PACK: "0",
      servicePACK: 0,
      ppnPACK: 0,

      hrgBeliKARTON: 0,
      margin1KARTON: "0",
      margin2KARTON: "0",
      margin3KARTON: "0",
      margin4KARTON: "0",
      hrgJual1KARTON: "0",
      hrgJual2KARTON: "0",
      hrgJual3KARTON: "0",
      hrgJual4KARTON: "0",
      serviceKARTON: 0,
      ppnKARTON: 0,
      purchasePrice: {},
      generateCode: false,
      codeServer: 0,
      display: "none",
      filled: false,
      swPrice: "1",
      summary: false,
      isLoadingGenerateBarcode: false,
      dataUkuran: [],
    };
    this.handleKelompokBarang = this.handleKelompokBarang.bind(this);
    this.handleKcp = this.handleKcp.bind(this);
    this.handleGroup1 = this.handleGroup1.bind(this);
    this.handleGroup2 = this.handleGroup2.bind(this);
    this.handleRak = this.handleRak.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onHandleChangeChild = this.onHandleChangeChild.bind(this);
    this.onHandleChangeChildSku = this.onHandleChangeChildSku.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.generateCode = this.generateCode.bind(this);
    this.generateBrcd = this.generateBrcd.bind(this);
    this.checkData = this.checkData.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleKateBrg = this.handleKateBrg.bind(this);
    this.switchPrice = this.switchPrice.bind(this);
    this.mouseEnter = this.mouseEnter.bind(this);
    this.mouseLeave = this.mouseLeave.bind(this);
    this.handler = this.handler.bind(this);
  }

  clearState() {
    this.setState({
      isModalFormGroupProduct: false,
      isModalFormPrinter: false,
      detail: {},
      nm_harga1: "1",
      nm_harga2: "2",
      nm_harga3: "3",
      nm_harga4: "4",
      set_harga: 1,
      selectedIndex: 0,
      error_barcode1: false,
      error_barcode2: false,
      error_barcode3: false,
      pesan_barcode1: "",
      pesan_barcode2: "",
      pesan_barcode3: "",
      error: {
        kd_brg: "",
        nm_brg: "",
        kel_brg: "",
        stock: "",
        kategori: "",
        stock_min: "",
        group1: "",
        group2: "",
        deskripsi: "",
        jenis: "",
        kcp: "",
        poin: "",
        online: "",
        berat: "",
        barang_sku_err: [],
      },
      kd_brg: "",
      nm_brg: "",
      nama_singkat: "",
      tag: "",
      kel_brg_data: [],
      kel_brg: "",
      rak_data: [],
      rak: "",
      stock: "0",
      kategori: "1",
      stock_min: "0",
      group1_data: [],
      group1: "",
      group2_data: [],
      group2: "",
      deskripsi: "-",
      gambar: "-",
      jenis: "1",
      kcp: "",
      poin: "0",
      online: "0",
      berat: "0",
      barangSku: [{ barcode: "", qty: "", konversi: "", satuan_jual: "1" }],
      barangHargaEdit: [
        [
          {
            nama_toko: "",
            lokasi: "",
            isCheckedPCS: false,
            hrgBeliPCS: 0,
            margin1PCS: "0",
            margin2PCS: "0",
            margin3PCS: "0",
            margin4PCS: "0",
            hrgJual1PCS: "0",
            hrgJual2PCS: "0",
            hrgJual3PCS: "0",
            hrgJual4PCS: "0",
            ppnPCS: 0,
            servicePCS: 0,
          },
          {
            nama_toko: "",
            lokasi: "",
            isCheckedPACK: false,
            hrgBeliPACK: 0,
            margin1PACK: "0",
            margin2PACK: "0",
            margin3PACK: "0",
            margin4PACK: "0",
            hrgJual1PACK: "0",
            hrgJual2PACK: "",
            hrgJual3PACK: "0",
            hrgJual4PACK: "0",
            ppnPACK: 0,
            servicePACK: 0,
          },
          {
            nama_toko: "",
            lokasi: "",
            isCheckedKARTON: false,
            hrgBeliKARTON: 0,
            margin1KARTON: "0",
            margin2KARTON: "0",
            margin3KARTON: "0",
            margin4KARTON: "0",
            hrgJual1KARTON: "0",
            hrgJual2KARTON: "0",
            hrgJual3KARTON: "0",
            hrgJual4KARTON: "0",
            ppnKARTON: 0,
            serviceKARTON: 0,
          },
        ],
      ],
      barangHarga: [
        [
          {
            nama_toko: "",
            lokasi: "",
            isCheckedPCS: false,
            hrgBeliPCS: 0,
            margin1PCS: "0",
            margin2PCS: "0",
            margin3PCS: "0",
            margin4PCS: "0",
            hrgJual1PCS: "0",
            hrgJual2PCS: "0",
            hrgJual3PCS: "0",
            hrgJual4PCS: "0",
            ppnPCS: 0,
            servicePCS: 0,
          },
          {
            nama_toko: "",
            lokasi: "",
            isCheckedPACK: false,
            hrgBeliPACK: 0,
            margin1PACK: "0",
            margin2PACK: "0",
            margin3PACK: "0",
            margin4PACK: "0",
            hrgJual1PACK: "0",
            hrgJual2PACK: "0",
            hrgJual3PACK: "0",
            hrgJual4PACK: "0",
            ppnPACK: 0,
            servicePACK: 0,
          },
          {
            nama_toko: "",
            lokasi: "",
            isCheckedKARTON: false,
            hrgBeliKARTON: 0,
            margin1KARTON: "0",
            margin2KARTON: "0",
            margin3KARTON: "0",
            margin4KARTON: "0",
            hrgJual1KARTON: "0",
            hrgJual2KARTON: "0",
            hrgJual3KARTON: "0",
            hrgJual4KARTON: "0",
            ppnKARTON: 0,
            serviceKARTON: 0,
          },
        ],
      ],
      barcode: [],
      qty: [],
      konversi: [],
      satuan_jual: [],
      isChecked: false,
      PACK: false,
      KARTON: false,
      check: [],
      hrg_beli: "0",
      hrg_beli_pack: "0",
      hrg_beli_karton: "0",
      margin1: "0",
      margin2: "0",
      margin3: "0",
      margin4: "0",
      margin1_pack: "0",
      margin2_pack: "0",
      margin3_pack: "0",
      margin4_pack: "0",
      margin1_karton: "0",
      margin2_karton: "0",
      margin3_karton: "0",
      margin4_karton: "0",
      hrgjual1: "0",
      hrgjual2: "0",
      hrgjual3: "0",
      hrgjual4: "0",
      hrgjual1_pack: "0",
      hrgjual2_pack: "0",
      hrgjual3_pack: "0",
      hrgjual4_pack: "0",
      hrgjual1_karton: "0",
      hrgjual2_karton: "0",
      hrgjual3_karton: "0",
      hrgjual4_karton: "0",
      service: "0",
      service_pack: "0",
      service_karton: "0",
      ppn: "0",
      ppn_pack: "0",
      ppn_karton: "0",

      hrgBeliPACK: 0,
      margin1PACK: "0",
      margin2PACK: "0",
      margin3PACK: "0",
      margin4PACK: "0",
      hrgJual1PACK: "0",
      hrgJual2PACK: "0",
      hrgJual3PACK: "0",
      hrgJual4PACK: "0",
      servicePACK: 0,
      ppnPACK: 0,

      hrgBeliKARTON: 0,
      margin1KARTON: "0",
      margin2KARTON: "0",
      margin3KARTON: "0",
      margin4KARTON: "0",
      hrgJual1KARTON: "0",
      hrgJual2KARTON: "0",
      hrgJual3KARTON: "0",
      hrgJual4KARTON: "0",
      serviceKARTON: 0,
      ppnKARTON: 0,
      purchasePrice: {},
      generateCode: false,
      codeServer: 0,
      display: "none",
      filled: false,
      swPrice: "1",
      summary: false,
    });

    this.props.dispatch(setProductEdit([]));
    localStorage.removeItem("isReadonly");
    localStorage.removeItem("samarata");
    localStorage.removeItem("isReadonlySamaPack");
    localStorage.removeItem("isReadonlyPack");
    localStorage.removeItem("samarata_pack");
    localStorage.removeItem("isReadonlySamaKarton");
    localStorage.removeItem("isReadonlyKarton");
    localStorage.removeItem("samarata_karton");
  }

  componentWillUnmount() {
    this.setState({
      isModalFormGroupProduct: false,
      isModalFormPrinter: false,
    });
  }

  genBrcd(val) {
    this.setState({ isLoadingGenerateBarcode: true });
    const headers = {
      Authorization: atob(Cookies.get("datum_exp")),
      username: atob(Cookies.get("tnt=")),
      password: HEADERS.PASSWORD,
      "Content-Type": `application/json`,
    };
    const requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        kolom: "barcode",
        table: "barang_sku",
        value: val,
      }),
    };

    if (!tenantBool) {
      return fetch(HEADERS.URL + `site/cekdata`, requestOptions)
        .then((res) => res.json())
        .then(
          (data) => {
            this.setState({ isLoadingGenerateBarcode: false });
            if (data.result === 0) {
              return val;
            } else {
              Swal.fire("Informasi", "Barcode " + val + " sudah digunakan!");
              return 0;
            }
          },
          (error) => {
            this.setState({ isLoadingGenerateBarcode: false });
            Swal.fire("Peringatan", "Terjadi kesalahan, coba kembali.");
          }
        );
    } else {
      this.setState({ isLoadingGenerateBarcode: false });
      return val;
    }
  }
  generateCode(e, action = "add") {
    // this.setState({ generateCode: e.target.checked });
    if (e === "generate") {
      let genCode = `${moment(new Date()).format("YYMMDD")}${Math.floor(Math.random() * (10000 - 0 + 1)) + 0
        }`;
      let err = this.state.error;
      err = Object.assign({}, err, { kd_brg: "" });
      if (action === "add") {
        this.setState({
          kd_brg: genCode,
          error: err,
        });
        this.props.dispatch(
          FetchCheck({
            table: "barang",
            kolom: "kd_brg",
            value: genCode,
          })
        );
      } else {
        this.setState({ kd_brg: "" });
      }
    }
  }
  async generateBrcd(e, idx) {
    if (e === "generate") {
      let genCode = "";
      if (this.state.kd_brg !== "") {
        genCode = await this.genBrcd(this.state.kd_brg);
      }
      if (this.state.jenis === "0") {
        let brgSku = [];
        for (let i = 0; i < 3; i++) {
          let brcd =
            i === 0 ? `${genCode}` : i === 1 ? `${genCode}02` : `${genCode}03`;
          let satuan = i === 0 ? "Pcs" : i === 1 ? "Pack" : "Karton";
          brgSku.push({
            barcode:
              i !== idx && this.state.barangSku[i].barcode === "" ? "" : brcd,
            qty: satuan,
            konversi: "0",
            satuan_jual: "1",
          });
        }
        this.setState({ barangSku: brgSku });
      } else if (this.state.jenis === "2") {
        let brgSku = [];
        for (let i = 0; i < 2; i++) {
          let brcd = i === 0 ? `${genCode}` : i === 1 ? `${genCode}02` : "";
          brgSku.push({
            barcode:
              i !== idx && this.state.barangSku[i].barcode === "" ? "" : brcd,
            qty: "",
            konversi: "0",
            satuan_jual: "1",
          });
        }
        this.setState({ barangSku: brgSku });
      } else {
        let brgSku = [];
        for (let i = 0; i < 1; i++) {
          let satuan =
            this.state.jenis === "1"
              ? "Pcs"
              : this.state.jenis === "1"
                ? "Pcs"
                : "Pack";
          brgSku.push({
            barcode: `${genCode}`,
            qty: satuan,
            konversi: "0",
            satuan_jual: "1",
          });
        }
        this.setState({ barangSku: brgSku });
      }
    } else {
      if (idx !== null) {
        let barangSku = [...this.state.barangSku];
        barangSku[idx] = {
          ...barangSku[idx],
          ["barcode"]: "",
        };
        this.setState({ barangSku });
      }
    }
  }
  toggle = (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    this.props.dispatch(ModalToggle(false));
    this.clearState();
  };
  toggleModal(e, param) {
    e.preventDefault();
    this.setState({
      detail: { kel_brg: "", id: "" },
      filled: true,
      isModalFormGroupProduct: true,
    });
    this.props.dispatch(ModalType(param));
  }
  handleKateBrg = (e) => {
    // e.preventDefault();
    this.setState({ kategori: this.state.kategori === "1" ? "0" : "1" });
  };
  switchPrice = (e) => {
    // e.preventDefault();
    this.setState({
      swPrice: this.state.swPrice === "1" ? "0" : "1",
      summary: !this.state.swPrice === "1",
    });
  };
  handleFileRead = async (event) => {
    const file = event.target.files[0];
    const fileSize = event.target.files[0].size / 1024 / 1024; // in MiB
    if (fileSize > 2) {
      // alert('File size exceeds 2 MiB');
      Swal.fire(
        "Error",
        "Ukuran gambar yang diperbolehkan harus dibawah 2MB!!"
      );
      // $(file).val(''); //for clearing with Jquery
    } else {
      // Proceed further
      const base64 = await convertBase64(file);
      this.setState({ gambar: base64 });
    }
  };

  getProps(param) {
    let kel_brg = [],
      group1 = [],
      group2 = [],
      rak = [],
      kcp = [];

    if (param.checkKodeBarang) {
      handleError("", "kode barang sudah digunakan");
      this.setState({ kd_brg: "" });
      setFocus(this, "kd_brg");
      return;
    }
    let propsUser = param.auth.user;
    this.setState({
      nm_harga1:
        propsUser.nama_harga === undefined
          ? propsUser[0].harga1
          : propsUser.nama_harga[0].harga1,
      nm_harga2:
        propsUser.nama_harga === undefined
          ? propsUser[1].harga2
          : propsUser.nama_harga[1].harga2,
      nm_harga3:
        propsUser.nama_harga === undefined
          ? propsUser[2].harga3
          : propsUser.nama_harga[2].harga3,
      nm_harga4:
        propsUser.nama_harga === undefined
          ? propsUser[3].harga4
          : propsUser.nama_harga[3].harga4,
      nm_harga5:
        propsUser.nama_harga === undefined
          ? propsUser[4].harga5
          : propsUser.nama_harga[4].harga5,
      nm_harga6:
        propsUser.nama_harga === undefined
          ? propsUser[5].harga6
          : propsUser.nama_harga[5].harga6,
      nm_harga7:
        propsUser.nama_harga === undefined
          ? propsUser[6].harga7
          : propsUser.nama_harga[6].harga7,
      nm_harga8:
        propsUser.nama_harga === undefined
          ? propsUser[7].harga8
          : propsUser.nama_harga[7].harga8,
      nm_harga9:
        propsUser.nama_harga === undefined
          ? propsUser[8].harga9
          : propsUser.nama_harga[8].harga9,
      nm_harga10:
        propsUser.nama_harga === undefined
          ? propsUser[9].harga10
          : propsUser.nama_harga[9].harga10,
      set_harga: propsUser.set_harga,
      codeServer: param.productCode,
    });
    if (param.dataEdit !== undefined && param.dataEdit !== []) {
      let barang_sku =
        typeof param.dataEdit.barang_sku === "object"
          ? param.dataEdit.barang_sku
          : this.state.barangSku;
      let barang_hrg =
        typeof param.dataEdit.barang_hrg === "object"
          ? param.dataEdit.barang_hrg
          : this.state.barangHarga;
      let barangSku = [];
      let barangHrg = [];
      let konversi = [];
      for (let i = 0; i < barang_sku.length; i++) {
        barangSku.push({
          barcode: barang_sku[i].barcode,
          qty: barang_sku[i].satuan,
          konversi: barang_sku[i].qty_konversi,
          satuan_jual: barang_sku[i].satuan_jual,
        });
        konversi.push(barang_sku[i].konversi);
      }
      for (let x = 0; x < barang_hrg.length; x++) {
        console.log(barang_hrg);
        if (barang_sku.length === 3) {
          barangHrg.push([
            {
              nama_toko: barang_hrg[x][0].nama_toko,
              lokasi: barang_hrg[x][0].lokasi,
              isCheckedPCS: true,
              hrgBeliPCS: barang_hrg[x][0].harga_beli,
              margin1PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,
              margin2PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga2), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,
              margin3PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga3), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,
              margin4PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga4), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,
              margin5PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga5), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,
              margin6PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga6), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,
              margin7PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga7), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,
              margin8PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga8), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,
              margin9PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga9), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,
              margin10PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga10), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,

              hrgJual1PCS: barang_hrg[x][0].harga,
              hrgJual2PCS: barang_hrg[x][0].harga2,
              hrgJual3PCS: barang_hrg[x][0].harga3,
              hrgJual4PCS: barang_hrg[x][0].harga4,
              hrgJual5PCS: barang_hrg[x][0].harga5,
              hrgJual6PCS: barang_hrg[x][0].harga6,
              hrgJual7PCS: barang_hrg[x][0].harga7,
              hrgJual8PCS: barang_hrg[x][0].harga8,
              hrgJual9PCS: barang_hrg[x][0].harga9,
              hrgJual10PCS: barang_hrg[x][0].harga10,
              ppnPCS: barang_hrg[x][0].ppn,
              servicePCS: barang_hrg[x][0].service,
            },
            {
              nama_toko: barang_hrg[x][1].nama_toko,
              lokasi: barang_hrg[x][1].lokasi,
              isCheckedPACK: false,
              hrgBeliPACK: barang_hrg[x][1].harga_beli,
              margin1PACK:
                ((parseInt(rmComma(barang_hrg[x][1].harga), 10) -
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) *
                100,
              margin2PACK:
                ((parseInt(rmComma(barang_hrg[x][1].harga2), 10) -
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) *
                100,
              margin3PACK:
                ((parseInt(rmComma(barang_hrg[x][1].harga3), 10) -
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) *
                100,
              margin4PACK:
                ((parseInt(rmComma(barang_hrg[x][1].harga4), 10) -
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) *
                100,
              margin5PACK:
                ((parseInt(rmComma(barang_hrg[x][1].harga5), 10) -
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) *
                100,
              margin6PACK:
                ((parseInt(rmComma(barang_hrg[x][1].harga6), 10) -
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) *
                100,
              margin7PACK:
                ((parseInt(rmComma(barang_hrg[x][1].harga7), 10) -
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) *
                100,
              margin8PACK:
                ((parseInt(rmComma(barang_hrg[x][1].harga8), 10) -
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) *
                100,
              margin9PACK:
                ((parseInt(rmComma(barang_hrg[x][1].harga9), 10) -
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) *
                100,
              margin10PACK:
                ((parseInt(rmComma(barang_hrg[x][1].harga10), 10) -
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) *
                100,

              hrgJual1PACK: barang_hrg[x][1].harga,
              hrgJual2PACK: barang_hrg[x][1].harga2,
              hrgJual3PACK: barang_hrg[x][1].harga3,
              hrgJual4PACK: barang_hrg[x][1].harga4,
              hrgJual5PACK: barang_hrg[x][1].harga5,
              hrgJual6PACK: barang_hrg[x][1].harga6,
              hrgJual7PACK: barang_hrg[x][1].harga7,
              hrgJual8PACK: barang_hrg[x][1].harga8,
              hrgJual9PACK: barang_hrg[x][1].harga9,
              hrgJual10PACK: barang_hrg[x][1].harga10,

              ppnPACK: barang_hrg[x][1].ppn,
              servicePACK: barang_hrg[x][1].service,
            },
            {
              nama_toko: barang_hrg[x][2].nama_toko,
              lokasi: barang_hrg[x][2].lokasi,
              isCheckedKARTON: false,
              hrgBeliKARTON: barang_hrg[x][2].harga_beli,
              margin1KARTON:
                ((parseInt(rmComma(barang_hrg[x][2].harga), 10) -
                  parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) *
                100,
              margin2KARTON:
                ((parseInt(rmComma(barang_hrg[x][2].harga2), 10) -
                  parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) *
                100,
              margin3KARTON:
                ((parseInt(rmComma(barang_hrg[x][2].harga3), 10) -
                  parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) *
                100,
              margin4KARTON:
                ((parseInt(rmComma(barang_hrg[x][2].harga4), 10) -
                  parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) *
                100,
              margin5KARTON:
                ((parseInt(rmComma(barang_hrg[x][2].harga5), 10) -
                  parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) *
                100,
              margin6KARTON:
                ((parseInt(rmComma(barang_hrg[x][2].harga6), 10) -
                  parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) *
                100,
              margin7KARTON:
                ((parseInt(rmComma(barang_hrg[x][2].harga7), 10) -
                  parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) *
                100,
              margin8KARTON:
                ((parseInt(rmComma(barang_hrg[x][2].harga8), 10) -
                  parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) *
                100,
              margin9KARTON:
                ((parseInt(rmComma(barang_hrg[x][2].harga9), 10) -
                  parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) *
                100,
              margin10KARTON:
                ((parseInt(rmComma(barang_hrg[x][2].harga10), 10) -
                  parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) *
                100,

              hrgJual1KARTON: barang_hrg[x][2].harga,
              hrgJual2KARTON: barang_hrg[x][2].harga2,
              hrgJual3KARTON: barang_hrg[x][2].harga3,
              hrgJual4KARTON: barang_hrg[x][2].harga4,
              hrgJual5KARTON: barang_hrg[x][2].harga5,
              hrgJual6KARTON: barang_hrg[x][2].harga6,
              hrgJual7KARTON: barang_hrg[x][2].harga7,
              hrgJual8KARTON: barang_hrg[x][2].harga8,
              hrgJual9KARTON: barang_hrg[x][2].harga9,
              hrgJual10KARTON: barang_hrg[x][2].harga10,

              ppnKARTON: barang_hrg[x][2].ppn,
              serviceKARTON: barang_hrg[x][2].service,
            },
          ]);
        } else if (barang_sku.length === 2) {
          barangHrg.push([
            {
              nama_toko: barang_hrg[x][0].nama_toko,
              lokasi: barang_hrg[x][0].lokasi,
              isCheckedPCS: true,
              hrgBeliPCS: barang_hrg[x][0].harga_beli,
              margin1PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,
              margin2PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga2), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,
              margin3PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga3), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,
              margin4PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga4), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,
              margin5PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga5), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,
              margin6PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga6), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,
              margin7PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga7), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,
              margin8PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga8), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,
              margin9PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga9), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,
              margin10PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga10), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,

              hrgJual1PCS: barang_hrg[x][0].harga,
              hrgJual2PCS: barang_hrg[x][0].harga2,
              hrgJual3PCS: barang_hrg[x][0].harga3,
              hrgJual4PCS: barang_hrg[x][0].harga4,
              hrgJual5PCS: barang_hrg[x][0].harga5,
              hrgJual6PCS: barang_hrg[x][0].harga6,
              hrgJual7PCS: barang_hrg[x][0].harga7,
              hrgJual8PCS: barang_hrg[x][0].harga8,
              hrgJual9PCS: barang_hrg[x][0].harga9,
              hrgJual10PCS: barang_hrg[x][0].harga10,

              ppnPCS: barang_hrg[x][0].ppn,
              servicePCS: barang_hrg[x][0].service,
            },
            {
              nama_toko: barang_hrg[x][1].nama_toko,
              lokasi: barang_hrg[x][1].lokasi,
              isCheckedPACK: true,
              hrgBeliPACK: barang_hrg[x][1].harga_beli,
              margin1PACK:
                ((parseInt(rmComma(barang_hrg[x][1].harga), 10) -
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) *
                100,
              margin2PACK:
                ((parseInt(rmComma(barang_hrg[x][1].harga2), 10) -
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) *
                100,
              margin3PACK:
                ((parseInt(rmComma(barang_hrg[x][1].harga3), 10) -
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) *
                100,
              margin4PACK:
                ((parseInt(rmComma(barang_hrg[x][1].harga4), 10) -
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) *
                100,
              margin5PACK:
                ((parseInt(rmComma(barang_hrg[x][1].harga5), 10) -
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) *
                100,
              margin6PACK:
                ((parseInt(rmComma(barang_hrg[x][1].harga6), 10) -
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) *
                100,
              margin7PACK:
                ((parseInt(rmComma(barang_hrg[x][1].harga7), 10) -
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) *
                100,
              margin8PACK:
                ((parseInt(rmComma(barang_hrg[x][1].harga8), 10) -
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) *
                100,
              margin9PACK:
                ((parseInt(rmComma(barang_hrg[x][1].harga9), 10) -
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) *
                100,
              margin10PACK:
                ((parseInt(rmComma(barang_hrg[x][1].harga10), 10) -
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) /
                  parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) *
                100,

              hrgJual1PACK: barang_hrg[x][1].harga,
              hrgJual2PACK: barang_hrg[x][1].harga2,
              hrgJual3PACK: barang_hrg[x][1].harga3,
              hrgJual4PACK: barang_hrg[x][1].harga4,
              hrgJual5PACK: barang_hrg[x][1].harga5,
              hrgJual6PACK: barang_hrg[x][1].harga6,
              hrgJual7PACK: barang_hrg[x][1].harga7,
              hrgJual8PACK: barang_hrg[x][1].harga8,
              hrgJual9PACK: barang_hrg[x][1].harga9,
              hrgJual10PACK: barang_hrg[x][1].harga10,

              ppnPACK: barang_hrg[x][1].ppn,
              servicePACK: barang_hrg[x][1].service,
            },
          ]);
        } else {
          barangHrg.push([
            {
              nama_toko: barang_hrg[x][0].nama_toko,
              lokasi: barang_hrg[x][0].lokasi,
              isCheckedPCS: true,
              hrgBeliPCS: barang_hrg[x][0].harga_beli,
              margin1PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,
              margin2PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga2), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,
              margin3PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga3), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,
              margin4PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga4), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,
              margin5PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga5), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,
              margin6PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga6), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,
              margin7PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga7), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,
              margin8PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga8), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,
              margin9PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga9), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,
              margin10PCS:
                param.dataEdit.kategori === "4"
                  ? "0"
                  : ((parseInt(rmComma(barang_hrg[x][0].harga10), 10) -
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) /
                    parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) *
                  100,

              hrgJual1PCS: barang_hrg[x][0].harga,
              hrgJual2PCS: barang_hrg[x][0].harga2,
              hrgJual3PCS: barang_hrg[x][0].harga3,
              hrgJual4PCS: barang_hrg[x][0].harga4,
              hrgJual5PCS: barang_hrg[x][0].harga5,
              hrgJual6PCS: barang_hrg[x][0].harga6,
              hrgJual7PCS: barang_hrg[x][0].harga7,
              hrgJual8PCS: barang_hrg[x][0].harga8,
              hrgJual9PCS: barang_hrg[x][0].harga9,
              hrgJual10PCS: barang_hrg[x][0].harga10,

              ppnPCS: barang_hrg[x][0].ppn,
              servicePCS: barang_hrg[x][0].service,
            },
          ]);
        }
      }

      this.setState({
        kd_brg: param.dataEdit.kd_brg,
        nm_brg: param.dataEdit.nm_brg,
        kel_brg: param.dataEdit.kel_brg,
        nama_singkat: param.dataEdit.nama_singkat,
        tag: param.dataEdit.tag,
        rak: param.dataEdit.id_rak,
        jenis: param.dataEdit.kategori,
        stock_min: param.dataEdit.stock_min,
        group1: param.dataEdit.group1,
        group2: param.dataEdit.group2,
        deskripsi: param.dataEdit.deskripsi,
        gambar: "-",
        kategori: param.dataEdit.jenis,
        kcp: param.dataEdit.kcp,
        poin: param.dataEdit.poin,
        online: param.dataEdit.online,
        berat: param.dataEdit.berat,
        barangSku: barangSku,
        barangHarga: barangHrg,
        swPrice: "0",
      });
    } else {
      if (!this.state.filled) {
        const { data } = param.dataLocation;
        this.setState({
          check: param.dataLocation,
        });
        let brgHrg = [];
        if (typeof data === "object") {
          data.map((v) => {
            Object.assign(v, {
              isChecked: false,
              PACK: false,
              KARTON: false,
              hrg_beli: "0",
            });
            brgHrg.push([
              {
                nama_toko: v.nama_toko,
                lokasi: v.kode,
                isCheckedPCS: false,
                hrgBeliPCS: 0,
                margin1PCS: "0",
                margin2PCS: "0",
                margin3PCS: "0",
                margin4PCS: "0",
                margin5PCS: "0",
                margin6PCS: "0",
                margin7PCS: "0",
                margin8PCS: "0",
                margin9PCS: "0",
                margin10PCS: "0",

                hrgJual1PCS: "0",
                hrgJual2PCS: "0",
                hrgJual3PCS: "0",
                hrgJual4PCS: "0",
                hrgJual5PCS: "0",
                hrgJual6PCS: "0",
                hrgJual7PCS: "0",
                hrgJual8PCS: "0",
                hrgJual9PCS: "0",
                hrgJual10PCS: "0",

                ppnPCS: "0",
                servicePCS: "0",
              },
              {
                nama_toko: v.nama_toko,
                lokasi: v.kode,
                isCheckedPACK: false,
                hrgBeliPACK: 0,
                margin1PACK: "0",
                margin2PACK: "0",
                margin3PACK: "0",
                margin4PACK: "0",
                margin5PACK: "0",
                margin6PACK: "0",
                margin7PACK: "0",
                margin8PACK: "0",
                margin9PACK: "0",
                margin10PACK: "0",

                hrgJual1PACK: "0",
                hrgJual2PACK: "0",
                hrgJual3PACK: "0",
                hrgJual4PACK: "0",
                hrgJual5PACK: "0",
                hrgJual6PACK: "0",
                hrgJual7PACK: "0",
                hrgJual8PACK: "0",
                hrgJual9PACK: "0",
                hrgJual10PACK: "0",

                ppnPACK: "0",
                servicePACK: "0",
              },
              {
                nama_toko: v.nama_toko,
                lokasi: v.kode,
                isCheckedKARTON: false,
                hrgBeliKARTON: 0,
                margin1KARTON: "0",
                margin2KARTON: "0",
                margin3KARTON: "0",
                margin4KARTON: "0",
                margin5KARTON: "0",
                margin6KARTON: "0",
                margin7KARTON: "0",
                margin8KARTON: "0",
                margin9KARTON: "0",
                margin10KARTON: "0",

                hrgJual1KARTON: "0",
                hrgJual2KARTON: "0",
                hrgJual3KARTON: "0",
                hrgJual4KARTON: "0",
                hrgJual5KARTON: "0",
                hrgJual6KARTON: "0",
                hrgJual7KARTON: "0",
                hrgJual8KARTON: "0",
                hrgJual9KARTON: "0",
                hrgJual10KARTON: "0",

                ppnKARTON: "0",
                serviceKARTON: "0",
              },
            ]);
            return null;
          });
          this.setState({
            barangHarga: brgHrg,
          });
        }
      }
    }

    if (param.data.data !== undefined) {
      if (typeof param.data.data === "object") {
        param.data.data.map((v) => {
          kel_brg.push({
            value: v.kel_brg,
            value2: v.group2,
            label: v.nm_kel_brg,
          });
          return null;
        });
      }

      this.setState({
        kel_brg_data: kel_brg,
      });
    }
    if (param.dataSupplier !== undefined) {
      param.dataSupplier.map((v) => {
        group1.push({
          value: v.kode,
          label: v.nama,
        });
        return null;
      });
      this.setState({
        group1_data: group1,
      });
    }
    if (param.dataPrinter.data !== undefined) {
      param.dataPrinter.data.map((v) => {
        kcp.push({
          value: v.id_printer,
          label: v.nama,
        });
        return null;
      });
      this.setState({
        kcp_data: kcp,
      });
    }

    if (param.dataSubDept.data !== undefined) {
      if (typeof param.dataSubDept.data === "object") {
        param.dataSubDept.data.map((v) => {
          group2.push({
            value: v.kode,
            label: v.nama,
          });
          return null;
        });
      }
      // typeof param.dataSubDept.data === 'object' ? param.dataSubDept.data.map((v)=>{
      //     group2.push({
      //         value:v.kode,
      //         label:v.nama,
      //     })
      //     return null;
      // }): "no data"
      this.setState({
        group2_data: group2,
      });
    }
    if (param.rak.data !== undefined) {
      if (typeof param.rak.data === "object") {
        param.rak.data.map((v) => {
          rak.push({
            value: v.id,
            label: v.title,
          });
          return null;
        });
      }
      this.setState({
        rak_data: rak,
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }
  componentWillMount() {
    this.getProps(this.props);
  }

  async fetchData(data) {
    const url = HEADERS.URL + `site/cekdata`;
    return await axios
      .post(url, data)
      .then(function (response) {
        const data = response.data;
        return data;
      })
      .catch(function (error) {
        if (error.response) {
        }
      });
  }
  handler(value) {
    this.setState({
      barangHarga: value.barangHarga_,
      barangSku: value.barangSku_,
      summary: true,
      swPrice: "0",
    });
  }
  checkData(event, i) {
    event.preventDefault();
    let val = event.target.value;
    let barangSku = [...this.state.barangSku];
    barangSku[i] = { ...barangSku[i], [event.target.name]: event.target.value };
    this.setState({ barangSku });
    if (barangSku.length === 3 || barangSku.length === 2) {
      if (barangSku[0].barcode !== "0") {
        if (barangSku.length === 3) {
          if (barangSku[0].barcode === barangSku[2].barcode) {
            alert("barcode 1 tidak boleh sama dengan barcode 3");
            barangSku[0].barcode = "0";
          }
        }
      }
      if (barangSku[1].barcode !== "0") {
        if (barangSku[1].barcode === barangSku[0].barcode) {
          alert("barcode 2 tidak boleh sama dengan barcode 1");
          barangSku[1].barcode = "0";
        }
      }
      if (barangSku.length === 3) {
        if (barangSku[2].barcode !== "0") {
          if (barangSku[2].barcode === barangSku[1].barcode) {
            alert("barcode 3 tidak boleh sama dengan barcode 2");
            barangSku[2].barcode = "0";
          }
        }
      }
    }
    if (event.target.id === "barcode1") {
      const data = this.fetchData({
        table: "barang_sku",
        kolom: "barcode",
        value: val,
      });
      data.then((res) => {
        if (res.result === 1) {
          this.setState({
            error_barcode1: true,
            pesan_barcode1: "barcode sudah digunakan",
          });
        } else {
          this.setState({
            error_barcode1: false,
            pesan_barcode1: "",
          });
        }
      });
    }
    if (event.target.id === "barcode2") {
      const data = this.fetchData({
        table: "barang_sku",
        kolom: "barcode",
        value: val,
      });
      data.then((res) => {
        if (res.result === 1) {
          this.setState({
            error_barcode2: true,
            pesan_barcode2: "barcode sudah digunakan",
          });
        } else {
          this.setState({
            error_barcode2: false,
            pesan_barcode2: "",
          });
        }
      });
    }
    if (event.target.id === "barcode3") {
      const data = this.fetchData({
        table: "barang_sku",
        kolom: "barcode",
        value: val,
      });
      data.then((res) => {
        if (res.result === 1) {
          this.setState({
            error_barcode3: true,
            pesan_barcode3: "barcode sudah digunakan",
          });
        } else {
          this.setState({ error_barcode3: false, pesan_barcode3: "" });
        }
      });
    }
  }
  handleKelompokBarang(val, action) {
    let err = Object.assign({}, this.state.error, { kel_brg: "" });
    this.setState({
      kel_brg: val.value,
      group2: val.value2,
      error: err,
    });
  }
  handleKcp(val) {
    let err = Object.assign({}, this.state.error, { kcp: "" });
    this.setState({
      kcp: val.value,
      error: err,
    });
  }
  handleGroup1(val) {
    let err = Object.assign({}, this.state.error, { group1: "" });
    this.setState({
      group1: val.value,
      error: err,
    });
  }
  handleGroup2(val) {
    let err = Object.assign({}, this.state.error, { group2: "" });
    this.setState({
      group2: val.value,
      error: err,
    });
  }
  handleRak(val) {
    let err = Object.assign({}, this.state.error, { rak: "" });
    this.setState({
      rak: val.value,
      error: err,
    });
  }

  onHandleChangeChild(event, i) {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
    let qty_konversi = [];
    for (let i = 0; i < this.state.barangSku.length; i++) {
      qty_konversi.push(this.state.barangSku[i].konversi);
    }
    let barangHarga = [...this.state.barangHarga];
    if (event.target.name === "hrgBeliPCS") {
      barangHarga[i][0] = {
        ...barangHarga[i][0],
        [event.target.name]: event.target.value,
      };
      if (this.state.barangSku.length > 1) {
        barangHarga[i][1].hrgBeliPACK = parseInt(
          rmComma(event.target.value * qty_konversi[1]),
          10
        );
        barangHarga[i][2].hrgBeliKARTON = parseInt(
          rmComma(event.target.value * qty_konversi[2]),
          10
        );
      }
      this.setState({
        hrgBeliPACK: parseInt(
          rmComma(event.target.value * qty_konversi[1]),
          10
        ),
        hrgBeliKARTON: parseInt(
          rmComma(event.target.value * qty_konversi[2]),
          10
        ),
      });
    }
    if (event.target.name === "margin1PCS") {
      barangHarga[i][0] = {
        ...barangHarga[i][0],
        [event.target.name]: event.target.value,
      };
      barangHarga[i][0].hrgJual1PCS =
        parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) *
        (parseInt(rmComma(event.target.value), 10) / 100) +
        parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
    }
    if (event.target.name === "margin2PCS") {
      barangHarga[i][0] = {
        ...barangHarga[i][0],
        [event.target.name]: event.target.value,
      };
      barangHarga[i][0].hrgJual2PCS =
        parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) *
        (parseInt(rmComma(event.target.value), 10) / 100) +
        parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
    }
    if (event.target.name === "margin3PCS") {
      barangHarga[i][0] = {
        ...barangHarga[i][0],
        [event.target.name]: event.target.value,
      };
      barangHarga[i][0].hrgJual3PCS =
        parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) *
        (parseInt(rmComma(event.target.value), 10) / 100) +
        parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
    }
    if (event.target.name === "margin4PCS") {
      barangHarga[i][0] = {
        ...barangHarga[i][0],
        [event.target.name]: event.target.value,
      };
      barangHarga[i][0].hrgJual4PCS =
        parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) *
        (parseInt(rmComma(event.target.value), 10) / 100) +
        parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
    }
    if (event.target.name === "margin5PCS") {
      barangHarga[i][0] = {
        ...barangHarga[i][0],
        [event.target.name]: event.target.value,
      };
      barangHarga[i][0].hrgJual5PCS =
        parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) *
        (parseInt(rmComma(event.target.value), 10) / 100) +
        parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
    }
    if (event.target.name === "margin6PCS") {
      barangHarga[i][0] = {
        ...barangHarga[i][0],
        [event.target.name]: event.target.value,
      };
      barangHarga[i][0].hrgJual6PCS =
        parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) *
        (parseInt(rmComma(event.target.value), 10) / 100) +
        parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
    }
    if (event.target.name === "margin7PCS") {
      barangHarga[i][0] = {
        ...barangHarga[i][0],
        [event.target.name]: event.target.value,
      };
      barangHarga[i][0].hrgJual7PCS =
        parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) *
        (parseInt(rmComma(event.target.value), 10) / 100) +
        parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
    }
    if (event.target.name === "margin8PCS") {
      barangHarga[i][0] = {
        ...barangHarga[i][0],
        [event.target.name]: event.target.value,
      };
      barangHarga[i][0].hrgJual8PCS =
        parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) *
        (parseInt(rmComma(event.target.value), 10) / 100) +
        parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
    }
    if (event.target.name === "margin9PCS") {
      barangHarga[i][0] = {
        ...barangHarga[i][0],
        [event.target.name]: event.target.value,
      };
      barangHarga[i][0].hrgJual9PCS =
        parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) *
        (parseInt(rmComma(event.target.value), 10) / 100) +
        parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
    }

    if (event.target.name === "margin10PCS") {
      barangHarga[i][0] = {
        ...barangHarga[i][0],
        [event.target.name]: event.target.value,
      };
      barangHarga[i][0].hrgJual10PCS =
        parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) *
        (parseInt(rmComma(event.target.value), 10) / 100) +
        parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
    }

    if (event.target.name === "hrgJual1PCS") {
      barangHarga[i][0] = {
        ...barangHarga[i][0],
        [event.target.name]: event.target.value,
      };
      barangHarga[i][0].margin1PCS =
        ((parseInt(rmComma(event.target.value), 10) -
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) /
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) *
        100;
    }
    if (event.target.name === "hrgJual2PCS") {
      barangHarga[i][0] = {
        ...barangHarga[i][0],
        [event.target.name]: event.target.value,
      };
      barangHarga[i][0].margin2PCS =
        ((parseInt(rmComma(event.target.value), 10) -
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) /
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) *
        100;
    }
    if (event.target.name === "hrgJual3PCS") {
      barangHarga[i][0] = {
        ...barangHarga[i][0],
        [event.target.name]: event.target.value,
      };
      barangHarga[i][0].margin3PCS =
        ((parseInt(rmComma(event.target.value), 10) -
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) /
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) *
        100;
    }
    if (event.target.name === "hrgJual4PCS") {
      barangHarga[i][0] = {
        ...barangHarga[i][0],
        [event.target.name]: event.target.value,
      };
      barangHarga[i][0].margin4PCS =
        ((parseInt(rmComma(event.target.value), 10) -
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) /
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) *
        100;
    }

    if (event.target.name === "hrgJual5PCS") {
      barangHarga[i][0] = {
        ...barangHarga[i][0],
        [event.target.name]: event.target.value,
      };
      barangHarga[i][0].margin5PCS =
        ((parseInt(rmComma(event.target.value), 10) -
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) /
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) *
        100;
    }
    if (event.target.name === "hrgJual6PCS") {
      barangHarga[i][0] = {
        ...barangHarga[i][0],
        [event.target.name]: event.target.value,
      };
      barangHarga[i][0].margin6PCS =
        ((parseInt(rmComma(event.target.value), 10) -
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) /
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) *
        100;
    }
    if (event.target.name === "hrgJual7PCS") {
      barangHarga[i][0] = {
        ...barangHarga[i][0],
        [event.target.name]: event.target.value,
      };
      barangHarga[i][0].margin7PCS =
        ((parseInt(rmComma(event.target.value), 10) -
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) /
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) *
        100;
    }
    if (event.target.name === "hrgJual8PCS") {
      barangHarga[i][0] = {
        ...barangHarga[i][0],
        [event.target.name]: event.target.value,
      };
      barangHarga[i][0].margin8PCS =
        ((parseInt(rmComma(event.target.value), 10) -
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) /
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) *
        100;
    }
    if (event.target.name === "hrgJual9PCS") {
      barangHarga[i][0] = {
        ...barangHarga[i][0],
        [event.target.name]: event.target.value,
      };
      barangHarga[i][0].margin9PCS =
        ((parseInt(rmComma(event.target.value), 10) -
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) /
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) *
        100;
    }
    if (event.target.name === "hrgJual10PCS") {
      barangHarga[i][0] = {
        ...barangHarga[i][0],
        [event.target.name]: event.target.value,
      };
      barangHarga[i][0].margin10PCS =
        ((parseInt(rmComma(event.target.value), 10) -
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) /
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) *
        100;
    }

    if (event.target.name === "servicePCS") {
      barangHarga[i][0] = {
        ...barangHarga[i][0],
        [event.target.name]: event.target.value,
      };
    }
    if (event.target.name === "ppnPCS") {
      barangHarga[i][0] = {
        ...barangHarga[i][0],
        [event.target.name]: event.target.value,
      };
    }
    this.setState({ barangHarga });
  }
  onHandleChangeChildSku(event, i, x, lbl) {
    let column = event.target.name;
    let value = event.target.value;
    this.setState({ [column]: value });
    let barangHarga = [...this.state.barangHarga];
    if (
      column === "hrgBeliPCS" ||
      column === "hrgBeliPACK" ||
      column === "hrgBeliKARTON"
    ) {
      barangHarga[i][x] = { ...barangHarga[i][x], [column]: value };
      if (column === "hrgBeliPCS") {
        this.setState({
          hrgBeliPCS: value,
        });
        barangHarga[i][0].hrgBeliPCS = value;
        if (this.state.barangSku.length === 3) {
          let qty_konversi = [];
          if (this.state.barangSku[x].konversi !== undefined) {
            qty_konversi.push(this.state.barangSku[x].konversi);
          }
          barangHarga[i][1].hrgBeliPACK = parseInt(
            rmComma(value * qty_konversi[1]),
            10
          );
          barangHarga[i][2].hrgBeliKARTON = parseInt(
            rmComma(value * qty_konversi[2]),
            10
          );
          this.setState({
            hrgBeliPACK: parseInt(rmComma(value * qty_konversi[1]), 10),
            hrgBeliKARTON: parseInt(rmComma(value * qty_konversi[2]), 10),
          });
        }
      }
      if (column === "hrgBeliPACK") {
        this.setState({
          hrgBeliPACK: value,
        });
        barangHarga[i][1].hrgBeliPACK = value;
      }
      if (column === "hrgBeliKARTON") {
        this.state({
          hrgBeliKARTON: value,
        });
        barangHarga[i][2].hrgBeliKARTON = value;
      }
    }
    if (
      column === "margin1PCS" ||
      column === "margin2PCS" ||
      column === "margin3PCS" ||
      column === "margin4PCS" ||
      column === "margin5PCS" ||
      column === "margin6PCS" ||
      column === "margin7PCS" ||
      column === "margin8PCS" ||
      column === "margin9PCS" ||
      column === "margin10PCS" ||
      column === "margin1PACK" ||
      column === "margin2PACK" ||
      column === "margin3PACK" ||
      column === "margin4PACK" ||
      column === "margin5PACK" ||
      column === "margin6PACK" ||
      column === "margin7PACK" ||
      column === "margin8PACK" ||
      column === "margin9PACK" ||
      column === "margin10PACK" ||
      column === "margin1KARTON" ||
      column === "margin2KARTON" ||
      column === "margin3KARTON" ||
      column === "margin4KARTON" ||
      column === "margin5KARTON" ||
      column === "margin6KARTON" ||
      column === "margin7KARTON" ||
      column === "margin8KARTON" ||
      column === "margin9KARTON" ||
      column === "margin10KARTON"
    ) {
      barangHarga[i][x] = { ...barangHarga[i][x], [column]: value };
      if (column === "margin1PCS") {
        barangHarga[i][x].hrgJual1PCS =
          parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10);
        this.setState({
          hrgJual1PCS:
            parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[x].hrgBeliPCS), 10),
        });
      }
      if (column === "margin2PCS") {
        barangHarga[i][x].hrgJual2PCS =
          parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10);
        this.setState({
          hrgJual2PCS:
            parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[x].hrgBeliPCS), 10),
        });
      }
      if (column === "margin3PCS") {
        barangHarga[i][x].hrgJual3PCS =
          parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10);
        this.setState({
          hrgJual3PCS:
            parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[x].hrgBeliPCS), 10),
        });
      }
      if (column === "margin4PCS") {
        barangHarga[i][0].hrgJual4PCS =
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
        this.setState({
          hrgJual4PCS:
            parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[0].hrgBeliPCS), 10),
        });
      }
      if (column === "margin5PCS") {
        barangHarga[i][0].hrgJual5PCS =
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
        this.setState({
          hrgJual5PCS:
            parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[0].hrgBeliPCS), 10),
        });
      }
      if (column === "margin6PCS") {
        barangHarga[i][0].hrgJual6PCS =
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
        this.setState({
          hrgJual6PCS:
            parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[0].hrgBeliPCS), 10),
        });
      }
      if (column === "margin7PCS") {
        barangHarga[i][0].hrgJual7PCS =
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
        this.setState({
          hrgJual7PCS:
            parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[0].hrgBeliPCS), 10),
        });
      }
      if (column === "margin8PCS") {
        barangHarga[i][0].hrgJual8PCS =
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
        this.setState({
          hrgJual8PCS:
            parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[0].hrgBeliPCS), 10),
        });
      }
      if (column === "margin9PCS") {
        barangHarga[i][0].hrgJual9PCS =
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
        this.setState({
          hrgJual9PCS:
            parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[0].hrgBeliPCS), 10),
        });
      }
      if (column === "margin10PCS") {
        barangHarga[i][0].hrgJual10PCS =
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
        this.setState({
          hrgJual10PCS:
            parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[0].hrgBeliPCS), 10),
        });
      }

      if (column === "margin1PACK") {
        barangHarga[i][x].hrgJual1PACK =
          parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10);
        this.setState({
          hrgJual1PACK:
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[x].hrgBeliPACK), 10),
        });
      }
      if (column === "margin2PACK") {
        barangHarga[i][x].hrgJual2PACK =
          parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10);
        this.setState({
          hrgJual2PACK:
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[x].hrgBeliPACK), 10),
        });
      }
      if (column === "margin3PACK") {
        barangHarga[i][x].hrgJual3PACK =
          parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10);
        this.setState({
          hrgJual4PACK:
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[x].hrgBeliPACK), 10),
        });
      }
      if (column === "margin4PACK") {
        barangHarga[i][x].hrgJual4PACK =
          parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10);
        this.setState({
          hrgJual4PACK:
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[x].hrgBeliPACK), 10),
        });
      }
      if (column === "margin5PACK") {
        barangHarga[i][x].hrgJual5PACK =
          parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10);
        this.setState({
          hrgJual5PACK:
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[x].hrgBeliPACK), 10),
        });
      }
      if (column === "margin6PACK") {
        barangHarga[i][x].hrgJual6PACK =
          parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10);
        this.setState({
          hrgJual6PACK:
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[x].hrgBeliPACK), 10),
        });
      }
      if (column === "margin7PACK") {
        barangHarga[i][x].hrgJual7PACK =
          parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10);
        this.setState({
          hrgJual7PACK:
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[x].hrgBeliPACK), 10),
        });
      }
      if (column === "margin8PACK") {
        barangHarga[i][x].hrgJual8PACK =
          parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10);
        this.setState({
          hrgJual8PACK:
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[x].hrgBeliPACK), 10),
        });
      }
      if (column === "margin9PACK") {
        barangHarga[i][x].hrgJual9PACK =
          parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10);
        this.setState({
          hrgJual9PACK:
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[x].hrgBeliPACK), 10),
        });
      }
      if (column === "margin10PACK") {
        barangHarga[i][x].hrgJual10PACK =
          parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10);
        this.setState({
          hrgJual10PACK:
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[x].hrgBeliPACK), 10),
        });
      }

      if (column === "margin1KARTON") {
        barangHarga[i][x].hrgJual1KARTON =
          parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10);
        this.setState({
          hrgJual1KARTON:
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[x].hrgBeliKARTON), 10),
        });
      }
      if (column === "margin2KARTON") {
        barangHarga[i][x].hrgJual2KARTON =
          parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10);
        this.setState({
          hrgJual2KARTON:
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[x].hrgBeliKARTON), 10),
        });
      }
      if (column === "margin3KARTON") {
        barangHarga[i][x].hrgJual3KARTON =
          parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10);
        this.setState({
          hrgJual3KARTON:
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[x].hrgBeliKARTON), 10),
        });
      }
      if (column === "margin4KARTON") {
        barangHarga[i][x].hrgJual4KARTON =
          parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10);
        this.setState({
          hrgJual4KARTON:
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[x].hrgBeliKARTON), 10),
        });
      }
      if (column === "margin5KARTON") {
        barangHarga[i][x].hrgJual5KARTON =
          parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10);
        this.setState({
          hrgJual5KARTON:
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[x].hrgBeliKARTON), 10),
        });
      }
      if (column === "margin6KARTON") {
        barangHarga[i][x].hrgJual6KARTON =
          parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10);
        this.setState({
          hrgJual6KARTON:
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[x].hrgBeliKARTON), 10),
        });
      }
      if (column === "margin7KARTON") {
        barangHarga[i][x].hrgJual7KARTON =
          parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10);
        this.setState({
          hrgJual7KARTON:
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[x].hrgBeliKARTON), 10),
        });
      }
      if (column === "margin8KARTON") {
        barangHarga[i][x].hrgJual8KARTON =
          parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10);
        this.setState({
          hrgJual8KARTON:
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[x].hrgBeliKARTON), 10),
        });
      }
      if (column === "margin9KARTON") {
        barangHarga[i][x].hrgJual9KARTON =
          parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10);
        this.setState({
          hrgJual9KARTON:
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[x].hrgBeliKARTON), 10),
        });
      }
      if (column === "margin10KARTON") {
        barangHarga[i][x].hrgJual10KARTON =
          parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10);
        this.setState({
          hrgJual10KARTON:
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(barangHarga[x].hrgBeliKARTON), 10),
        });
      }
    }
    if (
      column === "hrgJual1PCS" ||
      column === "hrgJual2PCS" ||
      column === "hrgJual3PCS" ||
      column === "hrgJual4PCS" ||
      column === "hrgJual5PCS" ||
      column === "hrgJual6PCS" ||
      column === "hrgJual7PCS" ||
      column === "hrgJual8PCS" ||
      column === "hrgJual9PCS" ||
      column === "hrgJual10PCS" ||
      column === "hrgJual1PACK" ||
      column === "hrgJual2PACK" ||
      column === "hrgJual3PACK" ||
      column === "hrgJual4PACK" ||
      column === "hrgJual5PACK" ||
      column === "hrgJual6PACK" ||
      column === "hrgJual7PACK" ||
      column === "hrgJual8PACK" ||
      column === "hrgJual9PACK" ||
      column === "hrgJual10PACK" ||
      column === "hrgJual1KARTON" ||
      column === "hrgJual2KARTON" ||
      column === "hrgJual3KARTON" ||
      column === "hrgJual4KARTON" ||
      column === "hrgJual5KARTON" ||
      column === "hrgJual6KARTON" ||
      column === "hrgJual7KARTON" ||
      column === "hrgJual8KARTON" ||
      column === "hrgJual9KARTON" ||
      column === "hrgJual10KARTON"
    ) {
      barangHarga[i][x] = { ...barangHarga[i][x], [column]: value };
      if (column === "hrgJual1PCS") {
        barangHarga[i][x].margin1PCS =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) *
          100;
        this.setState({
          margin1PCS:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) *
            100,
        });
      }
      if (column === "hrgJual2PCS") {
        barangHarga[i][x].margin2PCS =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) *
          100;
        this.setState({
          margin2PCS:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) *
            100,
        });
      }
      if (column === "hrgJual3PCS") {
        barangHarga[i][x].margin3PCS =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) *
          100;
        this.setState({
          margin3PCS:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) *
            100,
        });
      }
      if (column === "hrgJual4PCS") {
        barangHarga[i][x].margin4PCS =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) *
          100;
        this.setState({
          margin4PCS:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) *
            100,
        });
      }
      if (column === "hrgJual5PCS") {
        barangHarga[i][x].margin5PCS =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) *
          100;
        this.setState({
          margin5PCS:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) *
            100,
        });
      }
      if (column === "hrgJual6PCS") {
        barangHarga[i][x].margin6PCS =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) *
          100;
        this.setState({
          margin6PCS:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) *
            100,
        });
      }
      if (column === "hrgJual7PCS") {
        barangHarga[i][x].margin7PCS =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) *
          100;
        this.setState({
          margin7PCS:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) *
            100,
        });
      }
      if (column === "hrgJual8PCS") {
        barangHarga[i][x].margin8PCS =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) *
          100;
        this.setState({
          margin8PCS:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) *
            100,
        });
      }
      if (column === "hrgJual9PCS") {
        barangHarga[i][x].margin9PCS =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) *
          100;
        this.setState({
          margin9PCS:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) *
            100,
        });
      }
      if (column === "hrgJual10PCS") {
        barangHarga[i][x].margin10PCS =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) *
          100;
        this.setState({
          margin10PCS:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) *
            100,
        });
      }

      if (column === "hrgJual1PACK") {
        barangHarga[i][x].margin1PACK =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) *
          100;
        this.setState({
          margin1PACK:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) *
            100,
        });
      }
      if (column === "hrgJual2PACK") {
        barangHarga[i][x].margin2PACK =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) *
          100;
        this.setState({
          margin2PACK:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) *
            100,
        });
      }
      if (column === "hrgJual3PACK") {
        barangHarga[i][x].margin3PACK =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) *
          100;
        this.setState({
          margin3PACK:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) *
            100,
        });
      }
      if (column === "hrgJual4PACK") {
        barangHarga[i][x].margin4PACK =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) *
          100;
        this.setState({
          margin4PACK:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) *
            100,
        });
      }
      if (column === "hrgJual5PACK") {
        barangHarga[i][x].margin5PACK =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) *
          100;
        this.setState({
          margin5PACK:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) *
            100,
        });
      }
      if (column === "hrgJual6PACK") {
        barangHarga[i][x].margin6PACK =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) *
          100;
        this.setState({
          margin6PACK:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) *
            100,
        });
      }
      if (column === "hrgJual7PACK") {
        barangHarga[i][x].margin7PACK =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) *
          100;
        this.setState({
          margin7PACK:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) *
            100,
        });
      }
      if (column === "hrgJual8PACK") {
        barangHarga[i][x].margin8PACK =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) *
          100;
        this.setState({
          margin8PACK:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) *
            100,
        });
      }

      if (column === "hrgJual9PACK") {
        barangHarga[i][x].margin9PACK =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) *
          100;
        this.setState({
          margin9PACK:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) *
            100,
        });
      }
      if (column === "hrgJual10PACK") {
        barangHarga[i][x].margin10PACK =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) *
          100;
        this.setState({
          margin10PACK:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) *
            100,
        });
      }
      if (column === "hrgJual1KARTON") {
        barangHarga[i][x].margin1KARTON =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) *
          100;
        this.setState({
          margin1KARTON:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) *
            100,
        });
      }
      if (column === "hrgJual2KARTON") {
        barangHarga[i][x].margin2KARTON =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) *
          100;
        this.setState({
          margin2KARTON:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) *
            100,
        });
      }
      if (column === "hrgJual3KARTON") {
        barangHarga[i][x].margin3KARTON =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) *
          100;
        this.setState({
          margin3KARTON:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) *
            100,
        });
      }
      if (column === "hrgJual4KARTON") {
        barangHarga[i][x].margin4KARTON =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) *
          100;
        this.setState({
          margin4KARTON:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) *
            100,
        });
      }
      if (column === "hrgJual5KARTON") {
        barangHarga[i][x].margin5KARTON =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) *
          100;
        this.setState({
          margin5KARTON:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) *
            100,
        });
      }

      if (column === "hrgJual6KARTON") {
        barangHarga[i][x].margin6KARTON =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) *
          100;
        this.setState({
          margin6KARTON:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) *
            100,
        });
      }
      if (column === "hrgJual7KARTON") {
        barangHarga[i][x].margin7KARTON =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) *
          100;
        this.setState({
          margin7KARTON:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) *
            100,
        });
      }
      if (column === "hrgJual8KARTON") {
        barangHarga[i][x].margin8KARTON =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) *
          100;
        this.setState({
          margin8KARTON:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) *
            100,
        });
      }
      if (column === "hrgJual9KARTON") {
        barangHarga[i][x].margin9KARTON =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) *
          100;
        this.setState({
          margin4KARTON:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) *
            100,
        });
      }
      if (column === "hrgJual10PACK") {
        barangHarga[i][x].margin10PACK =
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) /
            parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) *
          100;
        this.setState({
          margin10PACK:
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) /
              parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) *
            100,
        });
      }
    }

    if (
      column === "servicePCS" ||
      column === "servicePACK" ||
      column === "serviceKARTON"
    ) {
      barangHarga[i][x] = { ...barangHarga[i][x], [column]: value };
      if (column === "servicePCS") {
        this.setState({
          servicePCS: value,
        });
      }
      if (column === "servicePACK") {
        this.setState({
          servicePACK: value,
        });
      }
      if (column === "serviceKARTON") {
        this.setState({
          serviceKARTON: value,
        });
      }
    }
    if (column === "ppnPCS" || column === "ppnPACK" || column === "ppnKARTON") {
      barangHarga[i][x] = { ...barangHarga[i][x], [column]: value };
      if (column === "ppnPCS") {
        this.setState({
          ppnPCS: value,
        });
      }
      if (column === "ppnPACK") {
        this.setState({
          ppnPACK: value,
        });
      }
      if (column === "ppnKARTON") {
        this.setState({
          ppnKARTON: value,
        });
      }
    }
    this.setState({ barangHarga });
  }
  handleAllCheckedSku(event, i, lbl) {
    // let checked = event.target.checked;
    let checked = event.target.value !== "";
    if (lbl === "PCS") {
      checked === true
        ? localStorage.setItem("isReadonly", "true")
        : localStorage.setItem("isReadonly", "false");
      checked === true
        ? localStorage.setItem("samarata", "true")
        : localStorage.setItem("samarata", "false");
      let data = this.state.barangHarga;
      data.map((v, i) => {
        Object.assign(v[0], { isCheckedPCS: checked });
        return null;
      });
      this.setState({ barangHarga: data });
    }
    if (lbl === "PACK") {
      checked === true
        ? localStorage.setItem("isReadonlySamaPack", "true")
        : localStorage.setItem("isReadonlySamaPack", "false");
      checked === true
        ? localStorage.setItem("isReadonlyPack", "true")
        : localStorage.setItem("isReadonlyPack", "false");
      checked === true
        ? localStorage.setItem("samarata_pack", "true")
        : localStorage.setItem("samarata_pack", "false");
      let data = this.state.barangHarga;
      data.map((v, i) => {
        Object.assign(v[1], { isCheckedPACK: checked });
        return null;
      });
      this.setState({ barangHarga: data });
    }
    if (lbl === "KARTON") {
      checked === true
        ? localStorage.setItem("isReadonlySamaKarton", "true")
        : localStorage.setItem("isReadonlySamaKarton", "false");
      checked === true
        ? localStorage.setItem("isReadonlyKarton", "true")
        : localStorage.setItem("isReadonlyKarton", "false");
      checked === true
        ? localStorage.setItem("samarata_karton", "true")
        : localStorage.setItem("samarata_karton", "false");
      let data = this.state.barangHarga;
      data.map((v, i) => {
        Object.assign(v[2], { isCheckedKARTON: checked });
        return null;
      });
      this.setState({ barangHarga: data });
    }
  }

  handleCheckChieldElementSku(e, i) {
    this.setState((state, props) => {
      state.barangHarga[i][1].isCheckedPACK =
        !state.barangHarga[i][1].isCheckedPACK;
      return {
        barangHarga: state.barangHarga,
      };
    });
  }
  handleChange(event, i, mtd) {
    let name = event.target.name;
    let val = event.target.value;
    let hrg_jual_1_pcs = 0;
    let margin1_pcs = 0;
    let hrg_jual_2_pcs = 0;
    let margin2_pcs = 0;
    let hrg_jual_3_pcs = 0;
    let margin3_pcs = 0;
    let hrg_jual_4_pcs = 0;
    let margin4_pcs = 0;

    this.setState({
      [event.target.name]:
        !tenantBool && name === "kd_brg"
          ? String(event.target.value).replace(/[^a-z0-9]/gi, "")
          : event.target.value,
    });

    let err = Object.assign({}, this.state.error, {
      [name]: "",
    });
    this.setState({
      error: err,
    });
    if (name === "nm_brg") {
      this.setState({ deskripsi: val });
    }
    if (name === "kd_brg") {
      if (mtd === "onBlur") {
        this.props.dispatch(
          FetchCheck({
            table: "barang",
            kolom: "kd_brg",
            value: val,
          })
        );
      }
    }
    if (i !== null) {
      let barangSku = [...this.state.barangSku];
      barangSku[i] = {
        ...barangSku[i],
        [event.target.name]:
          !tenantBool && name === "barcode"
            ? String(event.target.value).replace(/[^a-z0-9]/gi, "")
            : event.target.value,
      };
      this.setState({ barangSku });
      console.log("udiiiii",barangSku)
    }
    if (event.target.name === "jenis") {
      if (event.target.value === "0") {
        let brgSku = [];
        for (let i = 0; i < 3; i++) {
          let brcd =
            i === 0
              ? `${this.state.kd_brg}`
              : i === 1
                ? `${this.state.kd_brg}02`
                : `${this.state.kd_brg}03`;
          let satuan = i === 0 ? "Pcs" : i === 1 ? "Pack" : "Karton";
          brgSku.push({
            barcode: brcd,
            qty: satuan,
            konversi: "0",
            satuan_jual: "1",
          });
        }
        this.setState({ barangSku: brgSku });
      } else if (event.target.value === "2") {
        let brgSku = [];
        for (let i = 0; i < 2; i++) {
          let brcd =
            i === 0
              ? `${this.state.kd_brg}`
              : i === 1
                ? `${this.state.kd_brg}02`
                : "";
          brgSku.push({
            barcode: brcd,
            qty: "",
            konversi: "0",
            satuan_jual: "1",
          });
        }
        this.setState({ barangSku: brgSku });
      } else {
        let brgSku = [];
        for (let i = 0; i < 1; i++) {
          let satuan = val === "1" ? "" : val === "1" ? "" : "";
          brgSku.push({
            barcode: `${this.state.kd_brg}`,
            qty: satuan,
            konversi: "0",
            satuan_jual: "1",
          });
        }
        this.setState({ barangSku: brgSku });
      }
    }
    let qty_konversi = [];
    for (let i = 0; i < this.state.barangSku.length; i++) {
      qty_konversi.push(this.state.barangSku[i].konversi);
    }
    if (name === "hrg_beli") {
      this.setState({
        hrg_beli_pack: parseInt(rmComma(val * qty_konversi[1]), 10),
        hrg_beli_karton: parseInt(rmComma(val * qty_konversi[2]), 10),
      });
    }
    if (name === "hrgjual1") {
      this.setState({
        margin1:
          ((parseInt(rmComma(val), 10) -
            parseInt(rmComma(this.state.hrg_beli), 10)) /
            parseInt(rmComma(this.state.hrg_beli), 10)) *
          100,
      });
      margin1_pcs =
        ((parseInt(rmComma(val), 10) -
          parseInt(rmComma(this.state.hrg_beli), 10)) /
          parseInt(rmComma(this.state.hrg_beli), 10)) *
        100;
    }
    if (name === "hrgjual2") {
      this.setState({
        margin2:
          ((parseInt(rmComma(val), 10) -
            parseInt(rmComma(this.state.hrg_beli), 10)) /
            parseInt(rmComma(this.state.hrg_beli), 10)) *
          100,
      });
      margin2_pcs =
        ((parseInt(rmComma(val), 10) -
          parseInt(rmComma(this.state.hrg_beli), 10)) /
          parseInt(rmComma(this.state.hrg_beli), 10)) *
        100;
    }
    if (name === "hrgjual3") {
      this.setState({
        margin3:
          ((parseInt(rmComma(val), 10) -
            parseInt(rmComma(this.state.hrg_beli), 10)) /
            parseInt(rmComma(this.state.hrg_beli), 10)) *
          100,
      });
      margin3_pcs =
        ((parseInt(rmComma(val), 10) -
          parseInt(rmComma(this.state.hrg_beli), 10)) /
          parseInt(rmComma(this.state.hrg_beli), 10)) *
        100;
    }
    if (name === "hrgjual4") {
      this.setState({
        margin4:
          ((parseInt(rmComma(val), 10) -
            parseInt(rmComma(this.state.hrg_beli), 10)) /
            parseInt(rmComma(this.state.hrg_beli), 10)) *
          100,
      });
      margin4_pcs =
        ((parseInt(rmComma(val), 10) -
          parseInt(rmComma(this.state.hrg_beli), 10)) /
          parseInt(rmComma(this.state.hrg_beli), 10)) *
        100;
    }
    if (name === "margin1") {
      this.setState({
        hrgjual1:
          parseInt(rmComma(this.state.hrg_beli), 10) *
          (parseInt(rmComma(val), 10) / 100) +
          parseInt(rmComma(this.state.hrg_beli), 10),
      });
      hrg_jual_1_pcs =
        parseInt(rmComma(this.state.hrg_beli), 10) *
        (parseInt(rmComma(val), 10) / 100) +
        parseInt(rmComma(this.state.hrg_beli), 10);
    }
    if (name === "margin2") {
      this.setState({
        hrgjual2:
          parseInt(rmComma(this.state.hrg_beli), 10) *
          (parseInt(rmComma(val), 10) / 100) +
          parseInt(rmComma(this.state.hrg_beli), 10),
      });
      hrg_jual_2_pcs =
        parseInt(rmComma(this.state.hrg_beli), 10) *
        (parseInt(rmComma(val), 10) / 100) +
        parseInt(rmComma(this.state.hrg_beli), 10);
    }
    if (name === "margin3") {
      this.setState({
        hrgjual3:
          parseInt(rmComma(this.state.hrg_beli), 10) *
          (parseInt(rmComma(val), 10) / 100) +
          parseInt(rmComma(this.state.hrg_beli), 10),
      });
      hrg_jual_3_pcs =
        parseInt(rmComma(this.state.hrg_beli), 10) *
        (parseInt(rmComma(val), 10) / 100) +
        parseInt(rmComma(this.state.hrg_beli), 10);
    }
    if (name === "margin4") {
      this.setState({
        hrgjual4:
          parseInt(rmComma(this.state.hrg_beli), 10) *
          (parseInt(rmComma(val), 10) / 100) +
          parseInt(rmComma(this.state.hrg_beli), 10),
      });
      hrg_jual_4_pcs =
        parseInt(rmComma(this.state.hrg_beli), 10) *
        (parseInt(rmComma(val), 10) / 100) +
        parseInt(rmComma(this.state.hrg_beli), 10);
    }
    if (localStorage.getItem("samarata") === "true") {
      for (let i = 0; i < this.state.barangHarga.length; i++) {
        if (name === "hrg_beli") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][0].hrgBeliPCS = val;
          this.setState({ barangHarga: barangHarga });
          if (1 === 2) {
            let barangHarga = this.state.barangHarga;
            barangHarga[i][1].hrgBeliPACK = parseInt(
              rmComma(val * qty_konversi[1]),
              10
            );
            barangHarga[i][2].hrgBeliKARTON = parseInt(
              rmComma(val * qty_konversi[2]),
              10
            );
            this.setState({ barangHarga: barangHarga });
          }
        }
        if (name === "margin1") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][0].margin1PCS = val;
          barangHarga[i][0].hrgJual1PCS = hrg_jual_1_pcs;
          this.setState({ barangHarga: barangHarga });
        }
        if (name === "margin2") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][0].margin2PCS = val;
          barangHarga[i][0].hrgJual2PCS = hrg_jual_2_pcs;
          this.setState({ barangHarga: barangHarga });
        }
        if (name === "margin3") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][0].margin3PCS = val;
          barangHarga[i][0].hrgJual3PCS = hrg_jual_3_pcs;
          this.setState({ barangHarga: barangHarga });
        }
        if (name === "margin4") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][0].margin4PCS = val;
          barangHarga[i][0].hrgJual4PCS = hrg_jual_4_pcs;
          this.setState({ barangHarga: barangHarga });
        }
        if (name === "hrgjual1") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][0].hrgJual1PCS = val;
          barangHarga[i][0].margin1PCS = margin1_pcs;
          this.setState({ barangHarga: barangHarga });
        }
        if (name === "hrgjual2") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][0].hrgJual2PCS = val;
          barangHarga[i][0].margin2PCS = margin2_pcs;
          this.setState({ barangHarga: barangHarga });
        }
        if (name === "hrgjual3") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][0].hrgJual3PCS = val;
          barangHarga[i][0].margin3PCS = margin3_pcs;
          this.setState({ barangHarga: barangHarga });
        }
        if (name === "hrgjual4") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][0].hrgJual4PCS = val;
          barangHarga[i][0].margin4PCS = margin4_pcs;
          this.setState({ barangHarga: barangHarga });
        }
        if (name === "service") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][0].servicePCS = val;
          this.setState({ barangHarga: barangHarga });
        }
        if (name === "ppn") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][0].ppnPCS = val;
          this.setState({ barangHarga: barangHarga });
        }
      }
    }
  }
  handleChangeMore(e, i, lbl) {
    e.preventDefault();
    let hrg_jual_1_pcs = 0;
    let margin1_pcs = 0;

    let hrg_jual_2_pcs = 0;
    let margin2_pcs = 0;
    let hrg_jual_3_pcs = 0;
    let margin3_pcs = 0;
    let hrg_jual_4_pcs = 0;
    let margin4_pcs = 0;
    let hrg_jual_5_pcs = 0;
    let margin5_pcs = 0;
    let hrg_jual_6_pcs = 0;
    let margin6_pcs = 0;
    let hrg_jual_7_pcs = 0;
    let margin7_pcs = 0;
    let hrg_jual_8_pcs = 0;
    let margin8_pcs = 0;
    let hrg_jual_9_pcs = 0;
    let margin9_pcs = 0;
    let hrg_jual_10_pcs = 0;
    let margin10_pcs = 0;

    let column = e.target.name;
    let value = e.target.value;

    if (value !== "" && lbl !== undefined) {
      this.handleAllCheckedSku(e, i, lbl);
    }

    this.setState({ [column]: value });
    let qty_konversi = [];
    for (let i = 0; i < this.state.barangSku.length; i++) {
      qty_konversi.push(this.state.barangSku[i].konversi);
    }
    if (column === "hrg_beli") {
      if (this.state.jenis === "0") {
        this.setState({
          hrg_beli_pack: parseInt(rmComma(value * qty_konversi[1]), 10),
          hrg_beli_karton: parseInt(rmComma(value * qty_konversi[2]), 10),
        });
      }
    }
    if (column === "margin1") {
      this.setState({
        hrgjual1:
          parseInt(rmComma(this.state.hrg_beli), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(this.state.hrg_beli), 10),
      });
      hrg_jual_1_pcs =
        parseInt(rmComma(this.state.hrg_beli), 10) *
        (parseInt(rmComma(value), 10) / 100) +
        parseInt(rmComma(this.state.hrg_beli), 10);
    }
    if (column === "margin2") {
      this.setState({
        hrgjual2:
          parseInt(rmComma(this.state.hrg_beli), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(this.state.hrg_beli), 10),
      });
      hrg_jual_2_pcs =
        parseInt(rmComma(this.state.hrg_beli), 10) *
        (parseInt(rmComma(value), 10) / 100) +
        parseInt(rmComma(this.state.hrg_beli), 10);
    }
    if (column === "margin3") {
      this.setState({
        hrgjual3:
          parseInt(rmComma(this.state.hrg_beli), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(this.state.hrg_beli), 10),
      });
      hrg_jual_3_pcs =
        parseInt(rmComma(this.state.hrg_beli), 10) *
        (parseInt(rmComma(value), 10) / 100) +
        parseInt(rmComma(this.state.hrg_beli), 10);
    }
    if (column === "margin4") {
      this.setState({
        hrgjual4:
          parseInt(rmComma(this.state.hrg_beli), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(this.state.hrg_beli), 10),
      });
      hrg_jual_4_pcs =
        parseInt(rmComma(this.state.hrg_beli), 10) *
        (parseInt(rmComma(value), 10) / 100) +
        parseInt(rmComma(this.state.hrg_beli), 10);
    }
    if (column === "margin5") {
      this.setState({
        hrgjual5:
          parseInt(rmComma(this.state.hrg_beli), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(this.state.hrg_beli), 10),
      });
      hrg_jual_5_pcs =
        parseInt(rmComma(this.state.hrg_beli), 10) *
        (parseInt(rmComma(value), 10) / 100) +
        parseInt(rmComma(this.state.hrg_beli), 10);
    }
    if (column === "margin6") {
      this.setState({
        hrgjual6:
          parseInt(rmComma(this.state.hrg_beli), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(this.state.hrg_beli), 10),
      });
      hrg_jual_6_pcs =
        parseInt(rmComma(this.state.hrg_beli), 10) *
        (parseInt(rmComma(value), 10) / 100) +
        parseInt(rmComma(this.state.hrg_beli), 10);
    }
    if (column === "margin7") {
      this.setState({
        hrgjual7:
          parseInt(rmComma(this.state.hrg_beli), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(this.state.hrg_beli), 10),
      });
      hrg_jual_7_pcs =
        parseInt(rmComma(this.state.hrg_beli), 10) *
        (parseInt(rmComma(value), 10) / 100) +
        parseInt(rmComma(this.state.hrg_beli), 10);
    }
    if (column === "margin8") {
      this.setState({
        hrgjual8:
          parseInt(rmComma(this.state.hrg_beli), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(this.state.hrg_beli), 10),
      });
      hrg_jual_8_pcs =
        parseInt(rmComma(this.state.hrg_beli), 10) *
        (parseInt(rmComma(value), 10) / 100) +
        parseInt(rmComma(this.state.hrg_beli), 10);
    }
    if (column === "margin9") {
      this.setState({
        hrgjual9:
          parseInt(rmComma(this.state.hrg_beli), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(this.state.hrg_beli), 10),
      });
      hrg_jual_9_pcs =
        parseInt(rmComma(this.state.hrg_beli), 10) *
        (parseInt(rmComma(value), 10) / 100) +
        parseInt(rmComma(this.state.hrg_beli), 10);
    }
    if (column === "margin10") {
      this.setState({
        hrgjual10:
          parseInt(rmComma(this.state.hrg_beli), 10) *
          (parseInt(rmComma(value), 10) / 100) +
          parseInt(rmComma(this.state.hrg_beli), 10),
      });
      hrg_jual_10_pcs =
        parseInt(rmComma(this.state.hrg_beli), 10) *
        (parseInt(rmComma(value), 10) / 100) +
        parseInt(rmComma(this.state.hrg_beli), 10);
    }

    if (column === "hrgjual1") {
      this.setState({
        margin1:
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(this.state.hrg_beli), 10)) /
            parseInt(rmComma(this.state.hrg_beli), 10)) *
          100,
      });
      margin1_pcs =
        ((parseInt(rmComma(value), 10) -
          parseInt(rmComma(this.state.hrg_beli), 10)) /
          parseInt(rmComma(this.state.hrg_beli), 10)) *
        100;
    }
    if (column === "hrgjual2") {
      this.setState({
        margin2:
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(this.state.hrg_beli), 10)) /
            parseInt(rmComma(this.state.hrg_beli), 10)) *
          100,
      });
      margin2_pcs =
        ((parseInt(rmComma(value), 10) -
          parseInt(rmComma(this.state.hrg_beli), 10)) /
          parseInt(rmComma(this.state.hrg_beli), 10)) *
        100;
    }
    if (column === "hrgjual3") {
      this.setState({
        margin3:
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(this.state.hrg_beli), 10)) /
            parseInt(rmComma(this.state.hrg_beli), 10)) *
          100,
      });
      margin3_pcs =
        ((parseInt(rmComma(value), 10) -
          parseInt(rmComma(this.state.hrg_beli), 10)) /
          parseInt(rmComma(this.state.hrg_beli), 10)) *
        100;
    }
    if (column === "hrgjual4") {
      this.setState({
        margin4:
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(this.state.hrg_beli), 10)) /
            parseInt(rmComma(this.state.hrg_beli), 10)) *
          100,
      });
      margin4_pcs =
        ((parseInt(rmComma(value), 10) -
          parseInt(rmComma(this.state.hrg_beli), 10)) /
          parseInt(rmComma(this.state.hrg_beli), 10)) *
        100;
    }
    if (column === "hrgjual5") {
      this.setState({
        margin5:
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(this.state.hrg_beli), 10)) /
            parseInt(rmComma(this.state.hrg_beli), 10)) *
          100,
      });
      margin5_pcs =
        ((parseInt(rmComma(value), 10) -
          parseInt(rmComma(this.state.hrg_beli), 10)) /
          parseInt(rmComma(this.state.hrg_beli), 10)) *
        100;
    }
    if (column === "hrgjual6") {
      this.setState({
        margin6:
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(this.state.hrg_beli), 10)) /
            parseInt(rmComma(this.state.hrg_beli), 10)) *
          100,
      });
      margin6_pcs =
        ((parseInt(rmComma(value), 10) -
          parseInt(rmComma(this.state.hrg_beli), 10)) /
          parseInt(rmComma(this.state.hrg_beli), 10)) *
        100;
    }
    if (column === "hrgjual7") {
      this.setState({
        margin7:
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(this.state.hrg_beli), 10)) /
            parseInt(rmComma(this.state.hrg_beli), 10)) *
          100,
      });
      margin7_pcs =
        ((parseInt(rmComma(value), 10) -
          parseInt(rmComma(this.state.hrg_beli), 10)) /
          parseInt(rmComma(this.state.hrg_beli), 10)) *
        100;
    }
    if (column === "hrgjual8") {
      this.setState({
        margin8:
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(this.state.hrg_beli), 10)) /
            parseInt(rmComma(this.state.hrg_beli), 10)) *
          100,
      });
      margin8_pcs =
        ((parseInt(rmComma(value), 10) -
          parseInt(rmComma(this.state.hrg_beli), 10)) /
          parseInt(rmComma(this.state.hrg_beli), 10)) *
        100;
    }
    if (column === "hrgjual9") {
      this.setState({
        margin9:
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(this.state.hrg_beli), 10)) /
            parseInt(rmComma(this.state.hrg_beli), 10)) *
          100,
      });
      margin9_pcs =
        ((parseInt(rmComma(value), 10) -
          parseInt(rmComma(this.state.hrg_beli), 10)) /
          parseInt(rmComma(this.state.hrg_beli), 10)) *
        100;
    }
    if (column === "hrgjual10") {
      this.setState({
        margin10:
          ((parseInt(rmComma(value), 10) -
            parseInt(rmComma(this.state.hrg_beli), 10)) /
            parseInt(rmComma(this.state.hrg_beli), 10)) *
          100,
      });
      margin10_pcs =
        ((parseInt(rmComma(value), 10) -
          parseInt(rmComma(this.state.hrg_beli), 10)) /
          parseInt(rmComma(this.state.hrg_beli), 10)) *
        100;
    }

    let service_val = 0;
    if (column === "service") {
      service_val = parseFloat(value) > 100 ? 100 : value;
      this.setState({ service: service_val });
    }
    let ppn_val = 0;
    if (column === "ppn") {
      ppn_val = parseFloat(value) > 100 ? 100 : value;
      this.setState({ ppn: ppn_val });
    }
    let service_pack_val = 0;
    if (column === "service_pack") {
      service_pack_val = parseFloat(value) > 100 ? 100 : value;
      this.setState({ service_pack: service_pack_val });
    }
    let ppn_pack_val = 0;
    if (column === "ppn_pack") {
      ppn_pack_val = parseFloat(value) > 100 ? 100 : value;
      this.setState({ ppn_pack: ppn_pack_val });
    }
    let service_karton_val = 0;
    if (column === "service_karton") {
      service_karton_val = parseFloat(value) > 100 ? 100 : value;
      this.setState({ service_karton: service_karton_val });
    }
    let ppn_karton_val = 0;
    if (column === "ppn_karton") {
      ppn_karton_val = parseFloat(value) > 100 ? 100 : value;
      this.setState({ ppn_karton: ppn_karton_val });
    }

    if (localStorage.getItem("samarata") === "true") {
      for (let i = 0; i < this.state.barangHarga.length; i++) {
        if (column === "hrg_beli") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][0].hrgBeliPCS = value;
          this.setState({ barangHarga: barangHarga });
          if (this.state.barangSku.length === 3) {
            let barangHarga = this.state.barangHarga;
            barangHarga[i][1].hrgBeliPACK = parseInt(
              rmComma(value * qty_konversi[1]),
              10
            );
            barangHarga[i][2].hrgBeliKARTON = parseInt(
              rmComma(value * qty_konversi[2]),
              10
            );
            this.setState({ barangHarga: barangHarga });
          }
        }
        if (column === "margin1") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][0].margin1PCS = value;
          barangHarga[i][0].hrgJual1PCS = hrg_jual_1_pcs;
          this.setState({ barangHarga: barangHarga });
        }
        if (column === "margin2") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][0].margin2PCS = value;
          barangHarga[i][0].hrgJual2PCS = hrg_jual_2_pcs;
          this.setState({ barangHarga: barangHarga });
        }
        if (column === "margin3") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][0].margin3PCS = value;
          barangHarga[i][0].hrgJual3PCS = hrg_jual_3_pcs;
          this.setState({ barangHarga: barangHarga });
        }
        if (column === "margin4") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][0].margin4PCS = value;
          barangHarga[i][0].hrgJual4PCS = hrg_jual_4_pcs;
          this.setState({ barangHarga: barangHarga });
        }
        if (column === "hrgjual1") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][0].hrgJual1PCS = value;
          barangHarga[i][0].margin1PCS = margin1_pcs;
          this.setState({ barangHarga: barangHarga });
        }
        if (column === "hrgjual2") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][0].hrgJual2PCS = value;
          barangHarga[i][0].margin2PCS = margin2_pcs;
          this.setState({ barangHarga: barangHarga });
        }
        if (column === "hrgjual3") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][0].hrgJual3PCS = value;
          barangHarga[i][0].margin3PCS = margin3_pcs;
          this.setState({ barangHarga: barangHarga });
        }
        if (column === "hrgjual4") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][0].hrgJual4PCS = value;
          barangHarga[i][0].margin4PCS = margin4_pcs;
          this.setState({ barangHarga: barangHarga });
        }
        if (column === "service") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][0].servicePCS = service_val;
          this.setState({ barangHarga: barangHarga });
        }
        if (column === "ppn") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][0].ppnPCS = ppn_val;
          this.setState({ barangHarga: barangHarga });
        }
      }
    }
    if (localStorage.getItem("samarata_pack") === "true") {
      for (let i = 0; i < this.state.barangHarga.length; i++) {
        if (column === "hrg_beli_pack") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][1].hrgBeliPACK = value;
          this.setState({
            barangHarga: barangHarga,
            hrgBeliPACK: value,
          });
        }
        if (column === "margin1_pack") {
          this.setState({
            hrgjual1_pack:
              parseInt(rmComma(this.state.hrg_beli_pack), 10) *
              (parseInt(rmComma(value), 10) / 100) +
              parseInt(rmComma(this.state.hrg_beli_pack), 10),
            hrgJual1PACK:
              parseInt(rmComma(this.state.hrg_beli_pack), 10) *
              (parseInt(rmComma(value), 10) / 100) +
              parseInt(rmComma(this.state.hrg_beli_pack), 10),
            margin1PACK: value,
          });
          let barangHarga = this.state.barangHarga;
          barangHarga[i][1].margin1PACK = value;
          barangHarga[i][1].hrgJual1PACK =
            parseInt(rmComma(this.state.hrg_beli_pack), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(this.state.hrg_beli_pack), 10);
          this.setState({ barangHarga: barangHarga });
        }
        if (column === "margin2_pack") {
          this.setState({
            hrgjual2_pack:
              parseInt(rmComma(this.state.hrg_beli_pack), 10) *
              (parseInt(rmComma(value), 10) / 100) +
              parseInt(rmComma(this.state.hrg_beli_pack), 10),
            hrgJual2PACK:
              parseInt(rmComma(this.state.hrg_beli_pack), 10) *
              (parseInt(rmComma(value), 10) / 100) +
              parseInt(rmComma(this.state.hrg_beli_pack), 10),
            margin2PACK: value,
          });
          let barangHarga = this.state.barangHarga;
          barangHarga[i][1].margin2PACK = value;
          barangHarga[i][1].hrgJual2PACK =
            parseInt(rmComma(this.state.hrg_beli_pack), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(this.state.hrg_beli_pack), 10);
          this.setState({ barangHarga: barangHarga });
        }
        if (column === "margin3_pack") {
          this.setState({
            hrgjual3_pack:
              parseInt(rmComma(this.state.hrg_beli_pack), 10) *
              (parseInt(rmComma(value), 10) / 100) +
              parseInt(rmComma(this.state.hrg_beli_pack), 10),
            hrgJual3PACK:
              parseInt(rmComma(this.state.hrg_beli_pack), 10) *
              (parseInt(rmComma(value), 10) / 100) +
              parseInt(rmComma(this.state.hrg_beli_pack), 10),
            margin3PACK: value,
          });
          let barangHarga = this.state.barangHarga;
          barangHarga[i][1].margin3PACK = value;
          barangHarga[i][1].hrgJual3PACK =
            parseInt(rmComma(this.state.hrg_beli_pack), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(this.state.hrg_beli_pack), 10);
          this.setState({ barangHarga: barangHarga });
        }
        if (column === "margin4_pack") {
          this.setState({
            hrgjual4_pack:
              parseInt(rmComma(this.state.hrg_beli_pack), 10) *
              (parseInt(rmComma(value), 10) / 100) +
              parseInt(rmComma(this.state.hrg_beli_pack), 10),
            hrgJual4PACK:
              parseInt(rmComma(this.state.hrg_beli_pack), 10) *
              (parseInt(rmComma(value), 10) / 100) +
              parseInt(rmComma(this.state.hrg_beli_pack), 10),
            margin4PACK: value,
          });
          let barangHarga = this.state.barangHarga;
          barangHarga[i][1].margin4PACK = value;
          barangHarga[i][1].hrgJual4PACK =
            parseInt(rmComma(this.state.hrg_beli_pack), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(this.state.hrg_beli_pack), 10);
          this.setState({ barangHarga: barangHarga });
        }
        if (column === "hrgjual1_pack") {
          this.setState({
            margin1_pack:
              ((parseInt(rmComma(value), 10) -
                parseInt(rmComma(this.state.hrg_beli_pack), 10)) /
                parseInt(rmComma(this.state.hrg_beli_pack), 10)) *
              100,
            margin1PACK:
              ((parseInt(rmComma(value), 10) -
                parseInt(rmComma(this.state.hrg_beli_pack), 10)) /
                parseInt(rmComma(this.state.hrg_beli_pack), 10)) *
              100,
            hrgJual1PACK: value,
          });
          let barangHarga = this.state.barangHarga;
          barangHarga[i][1].margin1PACK =
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(this.state.hrg_beli_pack), 10)) /
              parseInt(rmComma(this.state.hrg_beli_pack), 10)) *
            100;
          barangHarga[i][1].hrgJual1PACK = value;
          this.setState({ barangHarga: barangHarga });
        }
        if (column === "hrgjual2_pack") {
          this.setState({
            margin2_pack:
              ((parseInt(rmComma(value), 10) -
                parseInt(rmComma(this.state.hrg_beli_pack), 10)) /
                parseInt(rmComma(this.state.hrg_beli_pack), 10)) *
              100,
            margin2PACK:
              ((parseInt(rmComma(value), 10) -
                parseInt(rmComma(this.state.hrg_beli_pack), 10)) /
                parseInt(rmComma(this.state.hrg_beli_pack), 10)) *
              100,
            hrgJual2PACK: value,
          });
          let barangHarga = this.state.barangHarga;
          barangHarga[i][1].margin2PACK =
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(this.state.hrg_beli_pack), 10)) /
              parseInt(rmComma(this.state.hrg_beli_pack), 10)) *
            100;
          barangHarga[i][1].hrgJual2PACK = value;
          this.setState({ barangHarga: barangHarga });
        }
        if (column === "hrgjual3_pack") {
          this.setState({
            margin3_pack:
              ((parseInt(rmComma(value), 10) -
                parseInt(rmComma(this.state.hrg_beli_pack), 10)) /
                parseInt(rmComma(this.state.hrg_beli_pack), 10)) *
              100,
            margin3PACK:
              ((parseInt(rmComma(value), 10) -
                parseInt(rmComma(this.state.hrg_beli_pack), 10)) /
                parseInt(rmComma(this.state.hrg_beli_pack), 10)) *
              100,
            hrgJual3PACK: value,
          });
          let barangHarga = this.state.barangHarga;
          barangHarga[i][1].margin3PACK =
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(this.state.hrg_beli_pack), 10)) /
              parseInt(rmComma(this.state.hrg_beli_pack), 10)) *
            100;
          barangHarga[i][1].hrgJual3PACK = value;
          this.setState({ barangHarga: barangHarga });
        }
        if (column === "hrgjual4_pack") {
          this.setState({
            margin4_pack:
              ((parseInt(rmComma(value), 10) -
                parseInt(rmComma(this.state.hrg_beli_pack), 10)) /
                parseInt(rmComma(this.state.hrg_beli_pack), 10)) *
              100,
            margin4PACK:
              ((parseInt(rmComma(value), 10) -
                parseInt(rmComma(this.state.hrg_beli_pack), 10)) /
                parseInt(rmComma(this.state.hrg_beli_pack), 10)) *
              100,
            hrgJual4PACK: value,
          });
          let barangHarga = this.state.barangHarga;
          barangHarga[i][1].margin4PACK =
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(this.state.hrg_beli_pack), 10)) /
              parseInt(rmComma(this.state.hrg_beli_pack), 10)) *
            100;
          barangHarga[i][1].hrgJual4PACK = value;
          this.setState({ barangHarga: barangHarga });
        }
        if (column === "service_pack") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][1].servicePACK = service_pack_val;
          this.setState({
            barangHarga: barangHarga,
            servicePACK: service_pack_val,
          });
        }
        if (column === "ppn_pack") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][1].ppnPACK = ppn_pack_val;
          this.setState({
            barangHarga: barangHarga,
            ppnPACK: ppn_pack_val,
          });
        }
      }
    }
    if (localStorage.getItem("samarata_karton") === "true") {
      for (let i = 0; i < this.state.barangHarga.length; i++) {
        if (column === "hrg_beli_karton") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][2].hrgBeliKARTON = value;
          this.setState({ barangHarga: barangHarga });
        }
        if (column === "margin1_karton") {
          this.setState({
            hrgjual1_karton:
              parseInt(rmComma(this.state.hrg_beli_karton), 10) *
              (parseInt(rmComma(value), 10) / 100) +
              parseInt(rmComma(this.state.hrg_beli_karton), 10),
            hrgJual1KARTON:
              parseInt(rmComma(this.state.hrg_beli_karton), 10) *
              (parseInt(rmComma(value), 10) / 100) +
              parseInt(rmComma(this.state.hrg_beli_karton), 10),
            margin1KARTON: value,
          });
          let barangHarga = this.state.barangHarga;
          barangHarga[i][2].margin1KARTON = value;
          barangHarga[i][2].hrgJual1KARTON =
            parseInt(rmComma(this.state.hrg_beli_karton), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(this.state.hrg_beli_karton), 10);
          this.setState({ barangHarga: barangHarga });
        }
        if (column === "margin2_karton") {
          this.setState({
            hrgjual2_karton:
              parseInt(rmComma(this.state.hrg_beli_karton), 10) *
              (parseInt(rmComma(value), 10) / 100) +
              parseInt(rmComma(this.state.hrg_beli_karton), 10),
            hrgJual2KARTON:
              parseInt(rmComma(this.state.hrg_beli_karton), 10) *
              (parseInt(rmComma(value), 10) / 100) +
              parseInt(rmComma(this.state.hrg_beli_karton), 10),
            margin2KARTON: value,
          });
          let barangHarga = this.state.barangHarga;
          barangHarga[i][2].margin2KARTON = value;
          barangHarga[i][2].hrgJual2KARTON =
            parseInt(rmComma(this.state.hrg_beli_karton), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(this.state.hrg_beli_karton), 10);
          this.setState({ barangHarga: barangHarga });
        }
        if (column === "margin3_karton") {
          this.setState({
            hrgjual3_karton:
              parseInt(rmComma(this.state.hrg_beli_karton), 10) *
              (parseInt(rmComma(value), 10) / 100) +
              parseInt(rmComma(this.state.hrg_beli_karton), 10),
            hrgJual3KARTON:
              parseInt(rmComma(this.state.hrg_beli_karton), 10) *
              (parseInt(rmComma(value), 10) / 100) +
              parseInt(rmComma(this.state.hrg_beli_karton), 10),
            margin3KARTON: value,
          });
          let barangHarga = this.state.barangHarga;
          barangHarga[i][2].margin3KARTON = value;
          barangHarga[i][2].hrgJual3KARTON =
            parseInt(rmComma(this.state.hrg_beli_karton), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(this.state.hrg_beli_karton), 10);
          this.setState({ barangHarga: barangHarga });
        }
        if (column === "margin4_karton") {
          this.setState({
            hrgjual4_karton:
              parseInt(rmComma(this.state.hrg_beli_karton), 10) *
              (parseInt(rmComma(value), 10) / 100) +
              parseInt(rmComma(this.state.hrg_beli_karton), 10),
            hrgJual4KARTON:
              parseInt(rmComma(this.state.hrg_beli_karton), 10) *
              (parseInt(rmComma(value), 10) / 100) +
              parseInt(rmComma(this.state.hrg_beli_karton), 10),
            margin4KARTON: value,
          });
          let barangHarga = this.state.barangHarga;
          barangHarga[i][2].margin4KARTON = value;
          barangHarga[i][2].hrgJual4KARTON =
            parseInt(rmComma(this.state.hrg_beli_karton), 10) *
            (parseInt(rmComma(value), 10) / 100) +
            parseInt(rmComma(this.state.hrg_beli_karton), 10);
          this.setState({ barangHarga: barangHarga });
        }
        if (column === "hrgjual1_karton") {
          this.setState({
            margin1_karton:
              ((parseInt(rmComma(value), 10) -
                parseInt(rmComma(this.state.hrg_beli_karton), 10)) /
                parseInt(rmComma(this.state.hrg_beli_karton), 10)) *
              100,
            margin1KARTON:
              ((parseInt(rmComma(value), 10) -
                parseInt(rmComma(this.state.hrg_beli_karton), 10)) /
                parseInt(rmComma(this.state.hrg_beli_karton), 10)) *
              100,
            hrgJual1KARTON: value,
          });
          let barangHarga = this.state.barangHarga;
          barangHarga[i][2].margin1KARTON =
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(this.state.hrg_beli_karton), 10)) /
              parseInt(rmComma(this.state.hrg_beli_karton), 10)) *
            100;
          barangHarga[i][2].hrgJual1KARTON = value;
          this.setState({ barangHarga: barangHarga });
        }
        if (column === "hrgjual2_karton") {
          this.setState({
            margin2_karton:
              ((parseInt(rmComma(value), 10) -
                parseInt(rmComma(this.state.hrg_beli_karton), 10)) /
                parseInt(rmComma(this.state.hrg_beli_karton), 10)) *
              100,
            margin2KARTON:
              ((parseInt(rmComma(value), 10) -
                parseInt(rmComma(this.state.hrg_beli_karton), 10)) /
                parseInt(rmComma(this.state.hrg_beli_karton), 10)) *
              100,
            hrgJual2KARTON: value,
          });
          let barangHarga = this.state.barangHarga;
          barangHarga[i][2].margin2KARTON =
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(this.state.hrg_beli_karton), 10)) /
              parseInt(rmComma(this.state.hrg_beli_karton), 10)) *
            100;
          barangHarga[i][2].hrgJual2KARTON = value;
          this.setState({ barangHarga: barangHarga });
        }
        if (column === "hrgjual3_karton") {
          this.setState({
            margin3_karton:
              ((parseInt(rmComma(value), 10) -
                parseInt(rmComma(this.state.hrg_beli_karton), 10)) /
                parseInt(rmComma(this.state.hrg_beli_karton), 10)) *
              100,
            margin3KARTON:
              ((parseInt(rmComma(value), 10) -
                parseInt(rmComma(this.state.hrg_beli_karton), 10)) /
                parseInt(rmComma(this.state.hrg_beli_karton), 10)) *
              100,
            hrgJual3KARTON: value,
          });
          let barangHarga = this.state.barangHarga;
          barangHarga[i][2].margin3KARTON =
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(this.state.hrg_beli_karton), 10)) /
              parseInt(rmComma(this.state.hrg_beli_karton), 10)) *
            100;
          barangHarga[i][2].hrgJual3KARTON = value;
          this.setState({ barangHarga: barangHarga });
        }
        if (column === "hrgjual4_karton") {
          this.setState({
            margin4_karton:
              ((parseInt(rmComma(value), 10) -
                parseInt(rmComma(this.state.hrg_beli_karton), 10)) /
                parseInt(rmComma(this.state.hrg_beli_karton), 10)) *
              100,
            margin4KARTON:
              ((parseInt(rmComma(value), 10) -
                parseInt(rmComma(this.state.hrg_beli_karton), 10)) /
                parseInt(rmComma(this.state.hrg_beli_karton), 10)) *
              100,
            hrgJual4KARTON: value,
          });
          let barangHarga = this.state.barangHarga;
          barangHarga[i][2].margin4KARTON =
            ((parseInt(rmComma(value), 10) -
              parseInt(rmComma(this.state.hrg_beli_karton), 10)) /
              parseInt(rmComma(this.state.hrg_beli_karton), 10)) *
            100;
          barangHarga[i][2].hrgJual4KARTON = value;
          this.setState({ barangHarga: barangHarga });
        }
        if (column === "service_karton") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][2].serviceKARTON = service_karton_val;
          this.setState({
            barangHarga: barangHarga,
            serviceKARTON: service_karton_val,
          });
        }
        if (column === "ppn_karton") {
          let barangHarga = this.state.barangHarga;
          barangHarga[i][2].ppnKARTON = ppn_karton_val;
          this.setState({
            barangHarga: barangHarga,
            ppnKARTON: ppn_karton_val,
          });
        }
      }
    }
  }
  handleEmptyOrUndefined(val, msg = "", isFocus = true) {
    if (this.state[val] === "" || this.state[val] === undefined) {
      handleError(msg);
      if (isFocus) {
        setFocus(this, val);
      }
      return false;
    }
    return true;
  }
  handleSubmit(e) {
    e.preventDefault();
    let parseData = {};
    let barangSku = [];
    let barangHarga = [];
    let barcode = [];

    parseData["kd_brg"] = this.state.kd_brg;
    parseData["nm_brg"] = this.state.nm_brg;
    parseData["nama_singkat"] =
      this.state.nama_singkat === "" ? "-" : this.state.nama_singkat;
    parseData["tag"] = this.state.tag === "" ? "-" : this.state.tag;
    parseData["rak"] =
      this.state.rak === ""
        ? "00000000-0000-0000-0000-000000000000"
        : this.state.rak;
    parseData["kel_brg"] = this.state.kel_brg;
    parseData["jenis"] = this.state.kategori;
    parseData["stock_min"] = this.state.stock_min;
    parseData["group1"] = this.state.group1;
    parseData["group2"] = this.state.group2;
    parseData["deskripsi"] = this.state.deskripsi;
    // parseData["gambar"] = this.state.gambar;
    parseData["kategori"] = this.state.jenis;
    parseData["kcp"] = this.state.kcp;
    parseData["poin"] = this.state.poin;
    parseData["online"] = this.state.online;
    parseData["berat"] = this.state.berat;
    parseData["gambar"] =
      this.state.gambar === "" && this.state.gambar === undefined
        ? "-"
        : this.state.gambar;
    if (this.props.checkKodeBarang !== false) {
      handleError("", "kode barang sudah digunakan");
      this.setState({ kd_brg: "" });
      setFocus(this, "kd_brg");
      return;
    }
    if (!this.handleEmptyOrUndefined("kd_brg", "kode barang")) return;
    if (!this.handleEmptyOrUndefined("nm_brg", "nama barang")) return;
    // if (!this.handleEmptyOrUndefined("ukuran", "variasi")) return;
    // if (!this.handleEmptyOrUndefined("nama_singkat", "nama singkat")) return;
    // if (!this.handleEmptyOrUndefined("tag", "tag", false)) return;
    // if (!this.handleEmptyOrUndefined("rak", "rak", false)) return;
    if (!this.handleEmptyOrUndefined("kel_brg", "kelompok barang", false))
      return;
    if (!this.handleEmptyOrUndefined("group1", "supplier", false)) return;
    if (this.props.auth.user.is_resto === 1 && this.state.jenis === "5") {
      if (!this.handleEmptyOrUndefined("kcp", "printer", false)) return;
    }
    // console.log("state",this.state.barangHarga);
    // return;

    for (let sku = 0; sku < this.state.barangSku.length; sku++) {
      let stateSku = this.state.barangSku[sku];
      let satuan = sku === 0 ? "PCS" : sku === 1 ? "PACK" : "KARTON";

      // satuan = sku === 0 && "PCS" ? sku === 1 && "PACK" : sku === 2 && "KARTON";
      if (stateSku.barcode === "" || stateSku.barcode === undefined) {
        handleError("barcode");
        return;
      }
      if (stateSku.qty === "" || stateSku.qty === undefined) {
        handleError("satuan");
        return;
      }
      barangSku.push({
        barcode: stateSku.barcode,
        satuan: stateSku.qty,
        qty_konversi: stateSku.konversi,
        satuan_jual: stateSku.satuan_jual,
      });

      barcode.push(stateSku.barcode);

      for (let brgHrg = 0; brgHrg < this.state.barangHarga.length; brgHrg++) {
        let stateBrgHrg = this.state.barangHarga[brgHrg][sku];
        let hrgbeli = `hrgBeli${satuan}`;
        let ppn = `ppn${satuan}`;
        let service = `service${satuan}`;
        let hrgJual1 = `hrgJual1${satuan}`;
        let hrgJual2 = `hrgJual2${satuan}`;
        let hrgJual3 = `hrgJual3${satuan}`;
        let hrgJual4 = `hrgJual4${satuan}`;
        let hrgJual5 = `hrgJual5${satuan}`;
        let hrgJual6 = `hrgJual6${satuan}`;
        let hrgJual7 = `hrgJual7${satuan}`;
        let hrgJual8 = `hrgJual8${satuan}`;
        let hrgJual9 = `hrgJual9${satuan}`;
        let hrgJual10 = `hrgJual10${satuan}`;

        if (
          stateBrgHrg[hrgbeli] === undefined ||
          parseInt(rmComma(stateBrgHrg[hrgbeli]), 10) < 1
        ) {
          handleError("harga beli");
          return;
        }

        for (let setHrg = 0; setHrg < this.state.set_harga; setHrg++) {
          let valHrgJual = `hrgJual${setHrg + 1}${satuan}`;
          let valMargin = `margin${setHrg + 1}${satuan}`;

          let postMargin =
            parseInt(rmComma(stateBrgHrg[valMargin]), 10) < 0
              ? 0
              : parseInt(rmComma(stateBrgHrg[valMargin]), 10);
          if (this.state.jenis !== "4") {
            if (postMargin < 0) {
              handleError(`margin`);
              return false;
            }
            if (stateBrgHrg[valHrgJual] === "") {
              handleError("harga jual");
              return false;
            }
            if (
              parseInt(rmComma(stateBrgHrg[service]), 10) < 0 ||
              stateBrgHrg[service] === ""
            ) {
              alert(`service tidak boleh atau kurang dari 0`);
              return false;
            }
            if (
              parseInt(rmComma(stateBrgHrg[ppn]), 10) < 0 ||
              stateBrgHrg[hrgbeli] === ""
            ) {
              alert(`ppn tidak boleh atau kurang dari 0`);
              return false;
            }
          }
        }

        barangHarga.push({
          lokasi: stateBrgHrg.lokasi,
          barcode: barcode[sku],
          harga_beli: parseInt(
            isNaN(rmComma(stateBrgHrg[hrgbeli]))
              ? 0
              : rmComma(stateBrgHrg[hrgbeli]),
            10
          ),
          ppn: stateBrgHrg[ppn],
          service: stateBrgHrg[service],
          harga: parseInt(
            isNaN(rmComma(stateBrgHrg[hrgJual1]))
              ? 0
              : rmComma(stateBrgHrg[hrgJual1]),
            10
          ),
          harga2: parseInt(
            isNaN(rmComma(stateBrgHrg[hrgJual2]))
              ? 0
              : rmComma(stateBrgHrg[hrgJual2]),
            10
          ),
          harga3: parseInt(
            isNaN(rmComma(stateBrgHrg[hrgJual3]))
              ? 0
              : rmComma(stateBrgHrg[hrgJual3]),
            10
          ),
          harga4: parseInt(
            isNaN(rmComma(stateBrgHrg[hrgJual4]))
              ? 0
              : rmComma(stateBrgHrg[hrgJual4]),
            10
          ),
          harga5: parseInt(
            isNaN(rmComma(stateBrgHrg[hrgJual5]))
              ? 0
              : rmComma(stateBrgHrg[hrgJual5]),
            10
          ),
          harga6: parseInt(
            isNaN(rmComma(stateBrgHrg[hrgJual6]))
              ? 0
              : rmComma(stateBrgHrg[hrgJual6]),
            10
          ),
          harga7: parseInt(
            isNaN(rmComma(stateBrgHrg[hrgJual7]))
              ? 0
              : rmComma(stateBrgHrg[hrgJual7]),
            10
          ),
          harga8: parseInt(
            isNaN(rmComma(stateBrgHrg[hrgJual8]))
              ? 0
              : rmComma(stateBrgHrg[hrgJual8]),
            10
          ),
          harga9: parseInt(
            isNaN(rmComma(stateBrgHrg[hrgJual9]))
              ? 0
              : rmComma(stateBrgHrg[hrgJual9]),
            10
          ),
          harga10: parseInt(
            isNaN(rmComma(stateBrgHrg[hrgJual10]))
              ? 0
              : rmComma(stateBrgHrg[hrgJual10]),
            10
          ),
        });
      }
    }
    parseData["barang_sku"] = barangSku;
    parseData["barang_harga"] = barangHarga;
    let newDataUkuran = [];
    const dataUkuran = this.state.dataUkuran;
    dataUkuran.map((row) => {
      newDataUkuran.push({
        kd_brg: this.state.kd_brg,
        nama: row,
      });
    });
    parseData["barang_ukuran"] = newDataUkuran;
    if (this.props.dataEdit !== undefined && this.props.dataEdit !== []) {
      this.props.dispatch(
        updateProduct(this.state.kd_brg, parseData, (status) => {
          if (status) this.clearState();
        })
      );
      console.log("ukuranNewData",newDataUkuran)
    } else {
      this.props.dispatch(
        createProduct(parseData, (status) => {
          if (status) this.clearState();
        })
      );
    }
  }
  getFiles(files) {
    this.setState({
      gambar: files,
    });
  }
  mouseEnter() {
    this.setState({ display: "flex" });
  }

  mouseLeave() {
    this.setState({ display: "none" });
  }
  render() {
    let showPricing = false;
    for (let i = 0; i < this.state.barangSku.length; i++) {
      if (
        this.state.barangSku.length > 0 &&
        (this.state.jenis === "2" || this.state.jenis === "0")
      ) {
        if (
          parseInt(this.state.barangSku[i].konversi, 10) > 0 &&
          this.state.barangSku[i].qty !== ""
        ) {
          showPricing = true;
        } else {
          if (i === 0) {
            showPricing = true;
          } else {
            showPricing = false;
            break;
          }
        }
      } else {
        if (this.state.barangSku[i].qty !== "") {
          showPricing = true;
        } else {
          showPricing = false;
          break;
        }
      }
    }
    console.log("data edits", this.props.dataEdit);

    return (
      <div>
        <WrapperModal
          isOpen={this.props.isOpen && this.props.type === "formProduct"}
          size={this.props.auth.user.is_resto !== 1 ? "lg" : "xl"}
        >
          {this.state.isLoadingGenerateBarcode && <Preloader />}
          <ModalHeader toggle={this.toggle}>
            {this.props.dataEdit === undefined
              ? "Tambah Barang"
              : "Ubah Barang"}
          </ModalHeader>
          <form onSubmit={this.handleSubmit}>
            <ModalBody>
              <div className="row d-flex box-margin">
                <div className="col-md-5">
                  <div
                    className="border border-1 h-100 d-flex justify-content-center align-items-end"
                    onMouseEnter={this.mouseEnter}
                    onMouseLeave={this.mouseLeave}
                    style={{
                      backgroundImage: `url('${this.state.gambar}'),url('${this.state.gambar === "-" ? Default : this.state.gambar
                        }')`,
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                    }}
                  >
                    <label
                      className="w-100 h-100 bg-light m-0 p-0 align-items-center justify-content-center"
                      style={{
                        display: this.state.display,
                        cursor: "pointer",
                        opacity: "0.7",
                      }}
                      htmlFor="fileUpload"
                    >
                      <p className="text-center">
                        <i className="fa fa-cloud-upload font-40" />
                        <br />
                        Unggah Gambar
                      </p>
                    </label>
                  </div>
                  <input
                    hidden
                    id="fileUpload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => this.handleFileRead(e)}
                  />
                </div>
                <div className="col-md-7">
                  <div className="h-100">
                    <div className="form-group">
                      <div className="input-group">
                        <input
                          ref={(input) => (this[`kd_brg`] = input)}
                          readOnly={this.props.dataEdit !== undefined}
                          type="text"
                          maxLength={20}
                          className="form-control"
                          name="kd_brg"
                          placeholder="Kode Barang"
                          value={this.state.kd_brg}
                          onChange={(e) => {
                            this.props.dataEdit === undefined &&
                              this.handleChange(e, null);
                          }}
                          onBlur={(e) =>
                            this.props.dataEdit === undefined &&
                            this.handleChange(e, null, "onBlur")
                          }
                        />
                        <div className="input-group-append">
                          {this.props.dataEdit === undefined ? (
                            this.state.kd_brg === "" ? (
                              <button
                                className="btn btn-primary"
                                name="generate"
                                type="button"
                                onClick={(e) => this.generateCode("generate")}
                              >
                                <i
                                  onClick={(e) => this.generateCode("generate")}
                                  className="fa fa-refresh"
                                />
                              </button>
                            ) : (
                              <button
                                name="generate"
                                className="btn btn-danger"
                                type="button"
                                onClick={(e) =>
                                  this.generateCode("generate", "delete")
                                }
                              >
                                <i
                                  onClick={(e) =>
                                    this.generateCode("generate", "delete")
                                  }
                                  className="fa fa-close"
                                />
                              </button>
                            )
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        ref={(input) => (this[`nm_brg`] = input)}
                        className="form-control"
                        placeholder="Nama Barang"
                        name="nm_brg"
                        value={this.state.nm_brg}
                        onChange={(e) => this.handleChange(e, null)}
                      />
                    </div>
                    {/* {document
                      .getElementById("tambahan_barang")
                      .value.search(atob(atob(Cookies.get("tnt=")))) >= 0 ? ( */}
                    <div className="form-group">
                      <input
                        type="text"
                        ref={(input) => (this[`nama_singkat`] = input)}
                        className="form-control"
                        placeholder="Nama Singkat"
                        name="nama_singkat"
                        maxLength={20}
                        value={this.state.nama_singkat}
                        onChange={(e) => this.handleChange(e, null)}
                      />
                    </div>
                    {/* ) : (
                      ""
                    )} */}
                    {/* {document
                      .getElementById("tambahan_barang")
                      .value.search(atob(atob(Cookies.get("tnt=")))) >= 0 ? (
                      <div className="row">
                        <div className="col-md-7">
                          <div className="form-group">
                            {select2Group(
                              this.state.rak_data.find((op) => {
                                return op.value === this.state.rak;
                              }),
                              (any, action) => this.handleRak(any, action),
                              this.state.rak_data,
                              (e) => this.toggleModal(e, "formRak"),
                              "rak"
                            )}
                          </div>
                        </div>
                        <div className="col-md-5">
                          <div className="form-group">
                            <input
                              type="text"
                              ref={(input) => (this[`tag`] = input)}
                              className="form-control"
                              placeholder="Tag"
                              name="tag"
                              maxLength={3}
                              value={this.state.tag}
                              onChange={(e) => this.handleChange(e, null)}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )} */}

                    <div className="form-group">
                      {select2Group(
                        this.state.kel_brg_data.find((op) => {
                          return op.value === this.state.kel_brg;
                        }),
                        (any, action) => this.handleKelompokBarang(any, action),
                        this.state.kel_brg_data,
                        (e) => this.toggleModal(e, "formGroupProduct"),
                        "kelompok barang"
                      )}
                    </div>
                    <div className="form-group">
                      {select2Group(
                        this.state.group1_data.find((op) => {
                          return op.value === this.state.group1;
                        }),
                        (any, action) => this.handleGroup1(any, action),
                        this.state.group1_data,
                        (e) => this.toggleModal(e, "formSupplier"),
                        "supplier"
                      )}
                    </div>
                    <FormUkuran
                      callback={(e) => {
                        this.setState({ dataUkuran: e });
                      }}
                      defaultValue={
                        this.props.dataEdit !== undefined
                          ? this.props.dataEdit.barang_ukuran
                          : []
                      }
                    />

                    <div className="row no-gutters">
                      <div className="col-md-4">
                        <div className="new-checkbox">
                          <label>Jenis Barang</label>
                          <div className="d-flex align-items-center">
                            <label className="switch mr-2">
                              <input
                                type="checkbox"
                                checked={this.state.kategori === "1"}
                                onChange={(e) => this.handleKateBrg(e)}
                              />
                              <span className="slider round" />
                            </label>
                            <label>
                              {this.state.kategori === "1"
                                ? "Dijual"
                                : "Tidak dijual"}
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-7 offset-md-1">
                        <div className="form-group">
                          <label>Kategori Barang</label>
                          <select
                            name="jenis"
                            id="jenis"
                            className="form-control form-control-lg"
                            value={this.state.jenis}
                            onChange={(e) => this.handleChange(e, null)}
                          >
                            <option value="1">Satuan</option>
                            <option value="2">Paket</option>
                            <option value="3">Servis</option>
                            <option value="0">Karton</option>
                            <option value="4">Bahan</option>
                            <option value="5">Menu paket</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    {this.props.auth.user.is_resto === 1 &&
                      this.state.jenis === "5" && (
                        <div className="form-group">
                          {select2Group(
                            this.state.kcp_data.find((op) => {
                              return op.value === this.state.kcp;
                            }),
                            (any, action) => this.handleKcp(any, action),
                            this.state.kcp_data,
                            (e) => this.toggleModal(e, "formPrinter"),
                            "printer"
                          )}
                        </div>
                      )}
                  </div>
                </div>
              </div>



              <div className="row mt-2">
                <div className="col-md-12">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th style={{ whiteSpace: "no-wrap" }}>Barcode</th>
                        <th style={{ whiteSpace: "no-wrap" }}>Satuan</th>
                        <th
                          style={{
                            display:
                              this.state.jenis === "2" ||
                                this.state.jenis === "0"
                                ? ""
                                : "none",
                            whiteSpace: "no-wrap",
                          }}
                        >
                          Konversi Qty
                        </th>
                        <th
                          style={{
                            display:
                              this.state.jenis === "2" ||
                                this.state.jenis === "0"
                                ? ""
                                : "none",
                            whiteSpace: "no-wrap",
                          }}
                        >
                          Tampilkan di POS ?
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        let container = [];
                        for (let x = 0; x < this.state.barangSku.length; x++) {
                          container.push(
                            <tr key={x}>
                              <td>
                                <div className="input-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Input barcode"
                                    name="barcode"
                                    id={`${x === 0
                                      ? "barcode1"
                                      : x === 1
                                        ? "barcode2"
                                        : "barcode3"
                                      }`}
                                    maxLength={20}
                                    value={this.state.barangSku[x].barcode}
                                    onChange={(e) => this.handleChange(e, x)}
                                    onBlur={(e) => this.checkData(e, x)}
                                  />
                                  <div
                                    className="input-group-append pointer"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      this.generateBrcd(
                                        this.state.barangSku[x].barcode === ""
                                          ? "generate"
                                          : "",
                                        x
                                      );
                                    }}
                                    style={{ zIndex: 0 }}
                                  >
                                    {this.props.dataEdit === undefined ? (
                                      this.state.barangSku[x].barcode === "" ? (
                                        <button className="btn btn-primary">
                                          <i className="fa fa-refresh" />
                                        </button>
                                      ) : (
                                        <button className="btn btn-danger">
                                          <i className="fa fa-close" />
                                        </button>
                                      )
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <input
                                  type="text"
                                  placeholder="ex. PCS"
                                  className="form-control"
                                  name="qty"
                                  value={this.state.barangSku[x].qty}
                                  onChange={(e) => this.handleChange(e, x)}
                                />
                              </td>
                              <td
                                style={{
                                  display:
                                    this.state.jenis === "2" ||
                                      this.state.jenis === "0"
                                      ? ""
                                      : "none",
                                }}
                              >
                                <input
                                  readOnly={x === 0}
                                  type="text"
                                  className="form-control"
                                  name="konversi"
                                  value={this.state.barangSku[x].konversi}
                                  onChange={(e) => this.handleChange(e, x)}
                                />
                              </td>
                              <td
                                style={{
                                  display:
                                    this.state.jenis === "2" ||
                                      this.state.jenis === "0"
                                      ? ""
                                      : "none",
                                }}
                              >
                                <select
                                  name="satuan_jual"
                                  id="satuan_jual"
                                  className="form-control"
                                  value={this.state.barangSku[x].satuan_jual}
                                  onChange={(e) => this.handleChange(e, x)}
                                >
                                  <option value="">Pilih Opsi</option>
                                  <option value="1">Tampilkan</option>
                                  <option value="0">Sembunyikan</option>
                                </select>
                              </td>
                            </tr>
                          );
                        }
                        return container;
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="row m-1 border border-1 rounded-lg bg-light px-0 py-3">
                <div className="col-md-12">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="new-checkbox">
                      <div className="d-flex align-items-center">
                        <label className="mb-0">
                          {this.props.dataEdit === undefined ? "Set" : "Ubah"}{" "}
                          Harga Semua Lokasi
                        </label>
                        <label className="switch ml-2 mb-0">
                          <input
                            type="checkbox"
                            checked={this.state.swPrice === "1"}
                            onChange={(e) => this.switchPrice(e)}
                          />
                          <span className="slider round" />
                        </label>
                      </div>
                    </div>
                    {/* <p className="mb-0">Set Harga Semua Lokasi</p> */}
                    {this.props.dataEdit === undefined ? (
                      <button
                        type="button"
                        className="btn btn-info"
                        onClick={(e) =>
                          this.toggleModal(e, "formProductPricing")
                        }
                      >
                        <i className="fa fa-pencil" /> Atur{" "}
                        {this.state.summary ? "kembali" : ""} harga per lokasi
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div
                  className="col-md-12"
                  style={{
                    display: this.state.swPrice === "1" ? "block" : "none",
                  }}
                >
                  <hr className="mt-2" />
                  <div className="row">
                    {/*ATUR SEMUA*/}
                    {/*DIDIEU*/}
                    {(() => {
                      let container = [];

                      for (let i = 0; i < this.state.barangSku.length; i++) {
                        let lbl = this.state.barangSku[i].qty;
                        let stateHargaBeli =
                          i === 0
                            ? "hrg_beli"
                            : i === 1
                              ? "hrg_beli_pack"
                              : "hrg_beli_karton";
                        let stateService =
                          i === 0
                            ? "service"
                            : i === 1
                              ? "service_pack"
                              : "service_karton";
                        let statePpn =
                          i === 0 ? "ppn" : i === 1 ? "ppn_pack" : "ppn_karton";
                        let satuan =
                          i === 0 ? "Pcs" : i === 1 ? "Pack" : "Karton";

                        container.push(
                          <div className="col-md-12" key={i}>
                            <div className="row">
                              <div className="col-md-12">
                                <div className="row">
                                  <div
                                    className={
                                      this.props.auth.user.is_resto !== 1
                                        ? "col-md-12"
                                        : "col-md-8"
                                    }
                                  >
                                    <div className="row">
                                      <div className="col-md-4">
                                        <div className="form-group">
                                          <label>Harga Beli</label>
                                          <input
                                            type="text"
                                            placeholder={`hrg beli ${lbl}`}
                                            className={`form-control`}
                                            name={stateHargaBeli}
                                            value={toCurrency(
                                              this.state[stateHargaBeli]
                                            )}
                                            onChange={(e) =>
                                              this.handleChangeMore(
                                                e,
                                                i,
                                                satuan.toUpperCase()
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        {(() => {
                                          let containers = [];
                                          for (
                                            let z = 0;
                                            z < this.state.set_harga;
                                            z++
                                          ) {
                                            let stateMargin =
                                              i === 0
                                                ? `margin${z + 1}`
                                                : i === 1
                                                  ? `margin${z + 1}_pack`
                                                  : `margin${z + 1}_karton`;
                                            let place = `nm_harga${z + 1}`;
                                            containers.push(
                                              <div
                                                className="form-group"
                                                key={z}
                                              >
                                                <label>
                                                  Margin
                                                  {this.state.set_harga > 1
                                                    ? ` ${this.props.auth.user
                                                      .nama_harga[z][
                                                    `harga${z + 1}`
                                                    ]
                                                    }`
                                                    : ""}
                                                </label>
                                                <div className="input-group">
                                                  <input
                                                    readOnly={
                                                      this.state.jenis === "4"
                                                    }
                                                    type="text"
                                                    placeholder={`margin ${z + 1
                                                      } ${lbl}`}
                                                    className="form-control"
                                                    name={stateMargin}
                                                    value={
                                                      this.state[stateMargin]
                                                    }
                                                    onChange={(e) =>
                                                      this.handleChangeMore(
                                                        e,
                                                        i,
                                                        satuan.toUpperCase()
                                                      )
                                                    }
                                                  />
                                                  <div className="input-group-append">
                                                    <span className="input-group-text">
                                                      %
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          }
                                          return containers;
                                        })()}
                                      </div>
                                      <div className="col-md-4">
                                        {(() => {
                                          let containers = [];
                                          for (
                                            let z = 0;
                                            z < this.state.set_harga;
                                            z++
                                          ) {
                                            let place = `nm_harga${z + 1}`;
                                            let stateHargaJual =
                                              i === 0
                                                ? `hrgjual${z + 1}`
                                                : i === 1
                                                  ? `hrgjual${z + 1}_pack`
                                                  : `hrgjual${z + 1}_karton`;
                                            containers.push(
                                              <div
                                                className="form-group"
                                                key={z}
                                              >
                                                <label>
                                                  Harga Jual
                                                  {this.state.set_harga > 1
                                                    ? ` ${this.props.auth.user
                                                      .nama_harga[z][
                                                    `harga${z + 1}`
                                                    ]
                                                    }`
                                                    : ""}
                                                </label>
                                                <input
                                                  readOnly={
                                                    this.state.jenis === "4"
                                                  }
                                                  type="text"
                                                  placeholder={`hrg jual ${this.state[place]} ${lbl}`}
                                                  className="form-control"
                                                  name={stateHargaJual}
                                                  value={toCurrency(
                                                    this.state[stateHargaJual]
                                                  )}
                                                  onChange={(e) =>
                                                    this.handleChangeMore(
                                                      e,
                                                      i,
                                                      satuan.toUpperCase()
                                                    )
                                                  }
                                                />
                                              </div>
                                            );
                                          }
                                          return containers;
                                        })()}
                                      </div>
                                    </div>
                                  </div>
                                  {/*service,ppn,stock min,stock max */}
                                  <div
                                    className={
                                      this.props.auth.user.is_resto !== 1
                                        ? "d-none"
                                        : "col-md-4"
                                    }
                                  >
                                    <div className="row">
                                      <div className="col-md-6">
                                        <div className="form-group">
                                          <label>Service</label>
                                          <div className="input-group">
                                            <input
                                              readOnly={
                                                this.state.jenis === "4"
                                              }
                                              type="text"
                                              placeholder={`service ${lbl}`}
                                              className="form-control"
                                              name={stateService}
                                              value={this.state[stateService]}
                                              onChange={(e) =>
                                                this.handleChangeMore(
                                                  e,
                                                  i,
                                                  satuan.toUpperCase()
                                                )
                                              }
                                            />
                                            <div className="input-group-append">
                                              <span className="input-group-text">
                                                %
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="form-group">
                                          <label>PPN</label>
                                          <div className="input-group">
                                            <input
                                              readOnly={
                                                this.state.jenis === "4"
                                              }
                                              type="text"
                                              placeholder={`ppn ${lbl}`}
                                              className="form-control"
                                              name={statePpn}
                                              value={this.state[statePpn]}
                                              onChange={(e) =>
                                                this.handleChangeMore(
                                                  e,
                                                  i,
                                                  satuan.toUpperCase()
                                                )
                                              }
                                            />
                                            <div className="input-group-append">
                                              <span className="input-group-text">
                                                %
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return container;
                    })()}
                    {/*END ATUR SEMUA*/}
                    <strong className="text-secondary ml-3">
                      <i>Note : </i>Harga untuk setiap lokasi otomatis akan sama
                      dengan yang telah di input pada kolom-kolom tersebut.
                    </strong>
                  </div>
                </div>

                <div
                  className="col-md-12 mt-3"
                  style={{ display: this.state.summary ? "block" : "none" }}
                >
                  <h4>
                    <strong>Harga per lokasi</strong>
                  </h4>
                  <div
                    className="row"
                    style={{ height: "200px", overflow: "auto" }}
                  >
                    {this.state.barangHarga.map((v, i) => {
                      return (
                        <div className="col-md-12" key={i}>
                          <div
                            className={`border border-1 mx-0 p-2 rounded-lg mb-2 ${i % 2 === 0 ? "bg-light" : ""
                              }`}
                          >
                            {(() => {
                              let containers = [];
                              for (
                                let x = 0;
                                x < this.state.barangSku.length;
                                x++
                              ) {
                                let satuan = "",
                                  checked;
                                let lbl = this.state.barangSku[x].qty;
                                let isReadonly = "isReadonly";
                                let hargaBeli,
                                  nameHargaBeli = "hrgBeli";
                                let service,
                                  serviceName = "service";
                                let ppn,
                                  ppnName = "ppn";
                                if (x === 0) {
                                  satuan = "Pcs";
                                  checked = v[x].isCheckedPCS;
                                  hargaBeli = v[x].hrgBeliPCS;
                                  nameHargaBeli += `PCS`;
                                  isReadonly += ``;
                                  service = v[x].servicePCS;
                                  ppn = v[x].ppnPCS;
                                  serviceName += "PCS";
                                  ppnName += "PCS";
                                }
                                if (x === 1) {
                                  satuan = "Pack";
                                  checked = v[x].isCheckedPACK;
                                  hargaBeli = v[x].hrgBeliPACK;
                                  nameHargaBeli += `PACK`;
                                  isReadonly += `Pack`;
                                  service = v[x].servicePACK;
                                  ppn = v[x].ppnPACK;
                                  serviceName += "PACK";
                                  ppnName += "PACK";
                                }
                                if (x === 2) {
                                  satuan = "Karton";
                                  checked = v[x].isCheckedKARTON;
                                  hargaBeli = v[x].hrgBeliKARTON;
                                  nameHargaBeli += `KARTON`;
                                  isReadonly += `Karton`;
                                  service = v[x].serviceKARTON;
                                  ppn = v[x].ppnKARTON;
                                  serviceName += "KARTON";
                                  ppnName += "KARTON";
                                }
                                containers.push(
                                  <div className="row" key={x}>
                                    <div className="col-md-12">
                                      <div className="mb-1">
                                        <div className="d-flex align-items-center">
                                          <label className="mb-0">
                                            {v[x].nama_toko}
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-12">
                                      <div className="row">
                                        <div
                                          className={
                                            this.props.auth.user.is_resto !== 1
                                              ? "col-md-12"
                                              : "col-md-8"
                                          }
                                        >
                                          <div className="row">
                                            <div className="col-md-4">
                                              <div className="">
                                                <label>
                                                  Harga Beli :{" "}
                                                  <strong>
                                                    {toCurrency(hargaBeli)}
                                                  </strong>
                                                </label>
                                              </div>
                                            </div>
                                            <div className="col-md-4">
                                              {(() => {
                                                let container = [];
                                                for (
                                                  let z = 0;
                                                  z < this.state.set_harga;
                                                  z++
                                                ) {
                                                  let marginName =
                                                    x === 0
                                                      ? `margin${z + 1}PCS`
                                                      : x === 1
                                                        ? `margin${z + 1}PACK`
                                                        : `margin${z + 1}KARTON`;
                                                  let place = `nm_harga${z + 1
                                                    }`;
                                                  let marginValue =
                                                    v[x][marginName];
                                                  container.push(
                                                    <div className="" key={z}>
                                                      <label>
                                                        Margin{" "}
                                                        {this.state.set_harga >
                                                          1
                                                          ? ` ${this.props.auth
                                                            .user
                                                            .nama_harga[z][
                                                          `harga${z + 1}`
                                                          ]
                                                          }`
                                                          : ""}{" "}
                                                        :{" "}
                                                        <strong>
                                                          {marginValue}%
                                                        </strong>
                                                      </label>
                                                    </div>
                                                  );
                                                }
                                                return container;
                                              })()}
                                            </div>
                                            <div className="col-md-4">
                                              {(() => {
                                                let container = [];
                                                for (
                                                  let z = 0;
                                                  z < this.state.set_harga;
                                                  z++
                                                ) {
                                                  let place = `nm_harga${z + 1
                                                    }`;
                                                  let hrgName = `hrgJual${z + 1
                                                    }${satuan !== undefined
                                                      ? satuan.toUpperCase()
                                                      : ""
                                                    }`;
                                                  let hrg = `hrgJual${z + 1}${satuan !== undefined
                                                    ? satuan.toUpperCase()
                                                    : ""
                                                    }`;
                                                  let hrgValue = v[x][hrg];
                                                  container.push(
                                                    <div className="" key={z}>
                                                      <label>
                                                        Harga Jual
                                                        {this.state.set_harga >
                                                          1
                                                          ? ` ${this.props.auth
                                                            .user
                                                            .nama_harga[z][
                                                          `harga${z + 1}`
                                                          ]
                                                          }`
                                                          : ""}{" "}
                                                        :{" "}
                                                        <strong>
                                                          {toCurrency(hrgValue)}
                                                        </strong>
                                                      </label>
                                                    </div>
                                                  );
                                                }
                                                return container;
                                              })()}
                                            </div>
                                          </div>
                                        </div>
                                        {/*service,ppn,stock min,stock max */}
                                        <div
                                          className={
                                            this.props.auth.user.is_resto !== 1
                                              ? "d-none"
                                              : "col-md-4"
                                          }
                                        >
                                          <div className="row">
                                            <div className="col-md-6">
                                              <div className="form-group">
                                                <label>
                                                  Service :{" "}
                                                  <strong>{service}%</strong>
                                                </label>
                                              </div>
                                            </div>
                                            <div className="col-md-6">
                                              <div className="form-group">
                                                <label>
                                                  PPN : <strong>{ppn}%</strong>
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                              return containers;
                            })()}

                            {/* <hr /> */}
                          </div>
                        </div>
                      );
                    })}
                    {/*END DYNAMIC  */}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="mt-2" style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      className="btn btn-warning mr-2"
                      onClick={this.toggle}
                    >
                      <i className="ti-close" /> Batal
                    </button>

                    {this.state.swPrice === "1" ? (
                      <button type="submit" className="btn btn-primary mr-1">
                        <i className="ti-save" /> Simpan
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-primary mr-1"
                        disabled={
                          this.props.dataEdit === undefined &&
                          this.state.summary === false
                        }
                      >
                        <i className="ti-save" /> Simpan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </ModalBody>
          </form>
        </WrapperModal>
        <FormRak fastAdd={true} detail={this.state.detail} />
        <FormSupplier fastAdd={true} detail={this.state.detail} />
        {this.state.isModalFormGroupProduct && this.props.isOpen ? (
          <FormGroupProduct
            detail={this.state.detail}
            group2={this.props.group2}
            fastAdd={true}
          />
        ) : null}
        <FormProductPricings
          allState={this.state}
          handler={this.handler}
          onHandleChangeChildSku_={this.onHandleChangeChildSku}
          data={this.props.data}
          dataLocation={this.props.dataLocation}
          dataSupplier={this.props.dataSupplier}
          dataSubDept={this.props.dataSubDept}
          dataEdit={this.props.dataEdit}
          productCode={this.props.productCode}
        />
        {this.props.auth.user.is_resto === 1 && (
          <FormPrinter detail={{ id_printer: "" }} fastAdd={true} />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    location: state.locationReducer.data,
    checkKodeBarang: state.siteReducer.check,
    checkBarcode1: state.siteReducer.check,
    isLoadingCheck: state.siteReducer.isLoading,
    auth: state.auth,
    group2: state.subDepartmentReducer.all,
    dataPrinter: state.printerReducer.data,
    rak: state.rakReducer.data,

    // group:state.groupProductReducer.data
  };
};
export default connect(mapStateToProps)(FormProducts);
