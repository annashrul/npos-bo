import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalHeader } from "reactstrap";
import connect from "react-redux/es/connect/connect";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import { setProductEdit, updateProduct } from "redux/actions/masterdata/product/product.action";
import { FetchCheck } from "redux/actions/site.action";
import axios from "axios";
import { HEADERS } from "redux/actions/_constants";
import moment from "moment";
import { rmComma, toCurrency } from "../../../../../helper";
import { isNaN } from "lodash";
import FormSubDepartment from "../../../../../components/App/modals/masterdata/department/form_sub_department";
import FormGroupProduct from "../../../../../components/App/modals/masterdata/group_product/form_group_product";
import FormSupplier from "../../../../../components/App/modals/masterdata/supplier/form_supplier";
import { convertBase64 } from "helper";
class FormProductPricings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataHarga:[],
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
            kel_brg_data: [],
            kel_brg: "",
            stock: "0",
            kategori: "1",
            stock_min: "0",
            group1_data: [],
            group1: "",
            group2_data: [],
            group2: "-",
            deskripsi: "-",
            gambar: "",
            jenis: "1",
            kcp: "-",
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
            zoom: 13,
            isFill: false,
        };
        this.handleKelompokBarang = this.handleKelompokBarang.bind(this);
        this.handleGroup1 = this.handleGroup1.bind(this);
        this.handleGroup2 = this.handleGroup2.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onHandleChangeChild = this.onHandleChangeChild.bind(this);
        this.onHandleChangeChildSku = this.onHandleChangeChildSku.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.generateCode = this.generateCode.bind(this);
        this.checkData = this.checkData.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleKateBrg = this.handleKateBrg.bind(this);
    }

    clearState() {
        this.setState({
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
            kel_brg_data: [],
            kel_brg: "",
            stock: "0",
            kategori: "1",
            stock_min: "0",
            group1_data: [],
            group1: "",
            group2_data: [],
            group2: "",
            deskripsi: "-",
            gambar: "",
            jenis: "1",
            kcp: "-",
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
        });
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
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

    generateCode(e) {
        this.setState({ generateCode: e.target.checked });
        if (e.target.checked === true) {
            let err = this.state.error;
            err = Object.assign({}, err, { kd_brg: "" });
            let genCode = `${moment(new Date()).format("YYMMDD")}${Math.floor(Math.random() * (10000 - 0 + 1)) + 0}`;

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
            if (this.state.jenis === "0") {
                let brgSku = [];
                for (let i = 0; i < 3; i++) {
                    let brcd = i === 0 ? `${genCode}` : i === 1 ? `${genCode}02` : `${genCode}03`;
                    let satuan = i === 0 ? "Pcs" : i === 1 ? "Pack" : "Karton";
                    brgSku.push({
                        barcode: brcd,
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
                    let satuan = this.state.jenis === "1" ? "" : this.state.jenis === "1" ? "Pcs" : "Pack";
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
            this.setState({
                kd_brg: "",
                jenis: "1",
                barangSku: [{ barcode: "", qty: "", konversi: "", satuan_jual: "1" }],
            });
        }
    }
    toggle = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        if (this.props.allState !== undefined) {
            this.props.dispatch(ModalType("formProduct"));
        } else {
            this.clearState();
            const bool = !this.props.isOpen;
            this.props.dispatch(ModalToggle(bool));
        }
    };
    toggleModal(e, param) {
        e.preventDefault();
        // const bool = !this.props.isOpen;
        // this.props.dispatch(ModalToggle(true));
        this.props.dispatch(ModalType(param));
    }
    handleKateBrg = (e) => {
        // e.preventDefault();
        this.setState({ kategori: this.state.kategori === "1" ? "0" : "1" });
    };
    handleFileRead = async (event) => {
        const file = event.target.files[0];
        const base64 = await convertBase64(file);
        this.setState({ gambar: base64 });
    };
    getProps(param) {
        if (this.props.allState !== undefined) {
            if (!this.state.isFill) {
                this.setState(this.props.allState);
            }
        }
        let propsUser=param.auth.user;
        this.setState({
            dataHarga:propsUser.nama_harga,
            nm_harga1: propsUser.nama_harga===undefined?propsUser[0].harga1:propsUser.nama_harga[0].harga1,
            nm_harga2: propsUser.nama_harga===undefined?propsUser[1].harga2:propsUser.nama_harga[1].harga2,
            nm_harga3: propsUser.nama_harga===undefined?propsUser[2].harga3:propsUser.nama_harga[2].harga3,
            nm_harga4: propsUser.nama_harga===undefined?propsUser[3].harga4:propsUser.nama_harga[3].harga4,
            nm_harga5: propsUser.nama_harga===undefined?propsUser[4].harga5:propsUser.nama_harga[4].harga5,
            nm_harga6: propsUser.nama_harga===undefined?propsUser[5].harga6:propsUser.nama_harga[5].harga6,
            nm_harga7: propsUser.nama_harga===undefined?propsUser[6].harga7:propsUser.nama_harga[6].harga7,
            nm_harga8: propsUser.nama_harga===undefined?propsUser[7].harga8:propsUser.nama_harga[7].harga8,
            nm_harga9: propsUser.nama_harga===undefined?propsUser[8].harga9:propsUser.nama_harga[8].harga9,
            nm_harga10: propsUser.nama_harga===undefined?propsUser[9].harga10:propsUser.nama_harga[9].harga10,
            set_harga: propsUser.set_harga,
            codeServer: param.productCode,
        });
        if (param.dataEdit !== undefined && param.dataEdit !== []) {
            let barang_sku = typeof param.dataEdit.barang_sku === "object" ? param.dataEdit.barang_sku : this.state.barangSku;
            let barang_hrg = typeof param.dataEdit.barang_hrg === "object" ? param.dataEdit.barang_hrg : this.state.barangHarga;
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
                if (barang_sku.length === 3) {
                    barangHrg.push([
                        {
                            nama_toko: barang_hrg[x][0].nama_toko,
                            lokasi: barang_hrg[x][0].lokasi,
                            isCheckedPCS: true,
                            hrgBeliPCS: barang_hrg[x][0].harga_beli,
                            margin1PCS:param.dataEdit.kategori === "4" ? "0": ((parseInt(rmComma(barang_hrg[x][0].harga), 10) - parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) * 100,
                            margin2PCS:param.dataEdit.kategori === "4" ? "0": ((parseInt(rmComma(barang_hrg[x][0].harga2), 10) - parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) * 100,
                            margin3PCS:param.dataEdit.kategori === "4" ? "0": ((parseInt(rmComma(barang_hrg[x][0].harga3), 10) - parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) * 100,
                            margin4PCS:param.dataEdit.kategori === "4" ? "0": ((parseInt(rmComma(barang_hrg[x][0].harga4), 10) - parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) * 100,
                            margin5PCS:param.dataEdit.kategori === "4" ? "0": ((parseInt(rmComma(barang_hrg[x][0].harga5), 10) - parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) * 100,
                            margin6PCS:param.dataEdit.kategori === "4" ? "0": ((parseInt(rmComma(barang_hrg[x][0].harga6), 10) - parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) * 100,
                            margin7PCS:param.dataEdit.kategori === "4" ? "0": ((parseInt(rmComma(barang_hrg[x][0].harga7), 10) - parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) * 100,
                            margin8PCS:param.dataEdit.kategori === "4" ? "0": ((parseInt(rmComma(barang_hrg[x][0].harga8), 10) - parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) * 100,
                            margin9PCS:param.dataEdit.kategori === "4" ? "0": ((parseInt(rmComma(barang_hrg[x][0].harga9), 10) - parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) * 100,
                            margin10PCS:param.dataEdit.kategori === "4" ? "0": ((parseInt(rmComma(barang_hrg[x][0].harga10), 10) - parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) * 100,

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

                            margin1PACK: ((parseInt(rmComma(barang_hrg[x][1].harga), 10) - parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) * 100,
                            margin2PACK: ((parseInt(rmComma(barang_hrg[x][1].harga2), 10) - parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) * 100,
                            margin3PACK: ((parseInt(rmComma(barang_hrg[x][1].harga3), 10) - parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) * 100,
                            margin4PACK: ((parseInt(rmComma(barang_hrg[x][1].harga4), 10) - parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) * 100,
                            margin5PACK: ((parseInt(rmComma(barang_hrg[x][1].harga5), 10) - parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) * 100,
                            margin6PACK: ((parseInt(rmComma(barang_hrg[x][1].harga6), 10) - parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) * 100,
                            margin7PACK: ((parseInt(rmComma(barang_hrg[x][1].harga7), 10) - parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) * 100,
                            margin8PACK: ((parseInt(rmComma(barang_hrg[x][1].harga8), 10) - parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) * 100,
                            margin9PACK: ((parseInt(rmComma(barang_hrg[x][1].harga9), 10) - parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) * 100,
                            margin10PACK:((parseInt(rmComma(barang_hrg[x][1].harga10), 10) - parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) * 100,


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
                            margin1KARTON: ((parseInt(rmComma(barang_hrg[x][2].harga), 10) - parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) * 100,
                            margin2KARTON: ((parseInt(rmComma(barang_hrg[x][2].harga2), 10) - parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) * 100,
                            margin3KARTON: ((parseInt(rmComma(barang_hrg[x][2].harga3), 10) - parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) * 100,
                            margin4KARTON: ((parseInt(rmComma(barang_hrg[x][2].harga4), 10) - parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) * 100,
                            margin5KARTON: ((parseInt(rmComma(barang_hrg[x][2].harga5), 10) - parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) * 100,
                            margin6KARTON: ((parseInt(rmComma(barang_hrg[x][2].harga6), 10) - parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) * 100,
                            margin7KARTON: ((parseInt(rmComma(barang_hrg[x][2].harga7), 10) - parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) * 100,
                            margin8KARTON: ((parseInt(rmComma(barang_hrg[x][2].harga8), 10) - parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) * 100,
                            margin9KARTON: ((parseInt(rmComma(barang_hrg[x][2].harga9), 10) - parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) * 100,
                            margin10KARTON: ((parseInt(rmComma(barang_hrg[x][2].harga10), 10) - parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][2].harga_beli), 10)) * 100,



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
                }
                else if (barang_sku.length === 2) {
                    barangHrg.push([
                        {
                            nama_toko: barang_hrg[x][0].nama_toko,
                            lokasi: barang_hrg[x][0].lokasi,
                            isCheckedPCS: true,
                            hrgBeliPCS: barang_hrg[x][0].harga_beli,

                            margin1PCS: param.dataEdit.kategori === "4" ? "0" : ((parseInt(rmComma(barang_hrg[x][0].harga), 10) - parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) * 100,
                            margin2PCS: param.dataEdit.kategori === "4" ? "0" : ((parseInt(rmComma(barang_hrg[x][0].harga2), 10) - parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) * 100,
                            margin3PCS: param.dataEdit.kategori === "4" ? "0" : ((parseInt(rmComma(barang_hrg[x][0].harga3), 10) - parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) * 100,
                            margin4PCS: param.dataEdit.kategori === "4" ? "0" : ((parseInt(rmComma(barang_hrg[x][0].harga4), 10) - parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) * 100,
                            margin5PCS: param.dataEdit.kategori === "4" ? "0" : ((parseInt(rmComma(barang_hrg[x][0].harga5), 10) - parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) * 100,
                            margin6PCS: param.dataEdit.kategori === "4" ? "0" : ((parseInt(rmComma(barang_hrg[x][0].harga6), 10) - parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) * 100,
                            margin7PCS: param.dataEdit.kategori === "4" ? "0" : ((parseInt(rmComma(barang_hrg[x][0].harga7), 10) - parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) * 100,
                            margin8PCS: param.dataEdit.kategori === "4" ? "0" : ((parseInt(rmComma(barang_hrg[x][0].harga8), 10) - parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) * 100,
                            margin9PCS: param.dataEdit.kategori === "4" ? "0" : ((parseInt(rmComma(barang_hrg[x][0].harga9), 10) - parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) * 100,
                            margin10PCS: param.dataEdit.kategori === "4" ? "0" : ((parseInt(rmComma(barang_hrg[x][0].harga10), 10) - parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) * 100,



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
                            margin1PACK: ((parseInt(rmComma(barang_hrg[x][1].harga), 10) - parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) * 100,
                            margin2PACK: ((parseInt(rmComma(barang_hrg[x][1].harga2), 10) - parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) * 100,
                            margin3PACK: ((parseInt(rmComma(barang_hrg[x][1].harga3), 10) - parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) * 100,
                            margin4PACK: ((parseInt(rmComma(barang_hrg[x][1].harga4), 10) - parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) * 100,
                            margin5PACK: ((parseInt(rmComma(barang_hrg[x][1].harga5), 10) - parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) * 100,
                            margin6PACK: ((parseInt(rmComma(barang_hrg[x][1].harga6), 10) - parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) * 100,
                            margin7PACK: ((parseInt(rmComma(barang_hrg[x][1].harga7), 10) - parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) * 100,
                            margin8PACK: ((parseInt(rmComma(barang_hrg[x][1].harga8), 10) - parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) * 100,
                            margin9PACK: ((parseInt(rmComma(barang_hrg[x][1].harga9), 10) - parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) * 100,
                            margin10PACK: ((parseInt(rmComma(barang_hrg[x][1].harga10), 10) - parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][1].harga_beli), 10)) * 100,

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
                }
                else {
                    const objBrgHrg={
                        nama_toko: barang_hrg[x][0].nama_toko,
                        lokasi: barang_hrg[x][0].lokasi,
                        isCheckedPCS: true,
                        hrgBeliPCS: barang_hrg[x][0].harga_beli,
                    };
                    for(let key=0;key<propsUser.set_harga;key++){
                        if(key===0){
                            const getMargin=barang_hrg[x][0][`harga`]==="0"?0:param.dataEdit.kategori === "4"? "0": ((parseInt(rmComma(barang_hrg[x][0].harga), 10) - parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) * 100
                            Object.assign(objBrgHrg,{
                                [`margin1PCS`] : getMargin,
                                [`hrgJual${key+1}PCS`]: barang_hrg[x][0][`harga`]
                            });

                        }else{
                            const getMargin=barang_hrg[x][0][`harga${key+1}`]==="0"?0:param.dataEdit.kategori === "4"? "0": ((parseInt(rmComma(barang_hrg[x][0][`harga${key+1}`]), 10) - parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) / parseInt(rmComma(barang_hrg[x][0].harga_beli), 10)) * 100
                            Object.assign(objBrgHrg,{
                                [`margin${key+1}PCS`] : getMargin,
                                [`hrgJual${key+1}PCS`]: barang_hrg[x][0][`harga${key+1}`]
                            });
                        }
                    }
                    barangHrg.push([objBrgHrg]);
                }
            }
            this.setState({
                kd_brg: param.dataEdit.kd_brg,
                nm_brg: param.dataEdit.nm_brg,
                kel_brg: param.dataEdit.kel_brg,
                jenis: param.dataEdit.kategori,
                stock_min: param.dataEdit.stock_min,
                group1: param.dataEdit.group1,
                group2: param.dataEdit.group2,
                deskripsi: param.dataEdit.deskripsi,
                gambar: "",
                kategori: param.dataEdit.jenis,
                kcp: param.dataEdit.kcp,
                poin: param.dataEdit.poin,
                online: param.dataEdit.online,
                berat: param.dataEdit.berat,
                barangSku: barangSku,
                barangHarga: barangHrg,
            });
        }
        else {
            if (this.props.allState === undefined) {
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
                        // const arrBrgHrg=[
                        //     {nama_toko: v.nama_toko,lokasi: v.kode},
                        //     {nama_toko: v.nama_toko,lokasi: v.kode},
                        //     {nama_toko: v.nama_toko,lokasi: v.kode}
                        // ];
                        // let objectSatuan={ nama_toko: v.nama_toko,lokasi: v.kode};
                        // const dataJenis=["PCS","PACK","KARTON"];
                        // const objBrgHrg={
                        // };
                        // arrBrgHrg.map((row,key)=>{
                        //
                        //     console.log(row);
                        // })

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
                        // console.log(arrBrgHrg);
                        return null;
                    });
                    this.setState({
                        barangHarga: brgHrg,
                    });
                }
            }
        }
        let kel_brg = [];
        let group1 = [];
        let group2 = [];
        if (param.data.data !== undefined) {
            if (typeof param.data.data === "object") {
                param.data.data.map((v) => {
                    kel_brg.push({
                        value: v.kel_brg,
                        label: v.nm_kel_brg,
                    });
                    return null;
                });
            }
            // typeof param.data.data === 'object' ? param.data.data.map((v)=>{
            //     kel_brg.push({
            //         value:v.kel_brg,
            //         label:v.nm_kel_brg,
            //     })
            //     return null;
            // }): "no data"
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
    handleKelompokBarang(val) {
        let err = Object.assign({}, this.state.error, { kel_brg: "" });
        this.setState({
            kel_brg: val.value,
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
    handleSelect = (index) => {
        let err = this.state.error;
        if (this.props.checkKodeBarang !== false) {
            this.setState({
                kd_brg: "0",
            });
            return;
        }
        if (this.state.kd_brg === "" || this.state.kd_brg === undefined) {
            err = Object.assign({}, err, {
                kd_brg: "kode barang tidak boleh kosong",
            });
            this.setState({ error: err });
            return;
        }
        if (this.state.nm_brg === "" || this.state.nm_brg === undefined) {
            err = Object.assign({}, err, {
                nm_brg: "nama barang tidak boleh kosong",
            });
            this.setState({ error: err });
            return;
        }
        if (this.state.kel_brg === "" || this.state.kel_brg === undefined) {
            err = Object.assign({}, err, {
                kel_brg: "kelompok barang tidak boleh kosong",
            });
            this.setState({ error: err });
            return;
        }
        if (this.state.kategori === "" || this.state.kategori === undefined) {
            err = Object.assign({}, err, {
                kategori: "kategori barang tidak boleh kosong",
            });
            this.setState({ error: err });
            return;
        }
        if (this.state.stock_min === "" || this.state.stock_min === undefined) {
            err = Object.assign({}, err, { stock_min: "Stock tidak boleh kosong" });
            this.setState({ error: err });
            return;
        }
        if (this.state.group1 === "" || this.state.group1 === undefined) {
            err = Object.assign({}, err, { group1: "supplier tidak boleh kosong" });
            this.setState({ error: err });
            return;
        }
        if (this.state.group2 === "" || this.state.group2 === undefined) {
            err = Object.assign({}, err, { group2: "sub dept tidak boleh kosong" });
            this.setState({ error: err });
            return;
        }
        if (this.state.deskripsi === "" || this.state.deskripsi === undefined) {
            err = Object.assign({}, err, {
                deskripsi: "deskripsi tidak boleh kosong",
            });
            this.setState({ error: err });
            return;
        }
        if (this.state.jenis === "" || this.state.jenis === undefined) {
            err = Object.assign({}, err, { jenis: "jenis tidak boleh kosong" });
            this.setState({ error: err });
            return;
        }
        if (this.state.kcp === "" || this.state.kcp === undefined) {
            err = Object.assign({}, err, { kcp: "kcp tidak boleh kosong" });
            this.setState({ error: err });
            return;
        }
        if (this.state.poin === "" || this.state.poin === undefined) {
            err = Object.assign({}, err, { poin: "poin tidak boleh kosong" });
            this.setState({ error: err });
            return;
        }
        if (this.state.online === "" || this.state.online === undefined) {
            err = Object.assign({}, err, { online: "online tidak boleh kosong" });
            this.setState({ error: err });
            return;
        }
        if (this.state.berat === "" || this.state.berat === undefined) {
            err = Object.assign({}, err, { berat: "berat tidak boleh kosong" });
            this.setState({ error: err });
            return;
        }
        if (index === 1) {
            for (let i = 0; i < this.state.barangSku.length; i++) {
                if (this.state.barangSku[i].barcode === "0" || this.state.barangSku[i].barcode === "" || this.state.barangSku[i].barcode === undefined) {
                    alert(`barcode ${i + 1} tidak boleh kosong atau tidak boleh 0`);
                    return;
                }
                if (this.state.barangSku[i].satuan_jual === "" || this.state.barangSku[i].satuan_jual === undefined) {
                    alert(`form tampilkan di pos index ke ${i + 1} tidak boleh kosong`);
                    return;
                }
                if (this.state.barangSku[i].qty === "") {
                    alert(`Satuan tidak boleh kosong`);
                    return;
                }
            }

            for (let i = 1; i < this.state.barangSku.length; i++) {
                if (parseInt(this.state.barangSku[i].konversi, 10) <= 0 || this.state.barangSku[i].konversi === "") {
                    alert(`Konversi Qty pada barcode ${this.state.barangSku[i].barcode} tidak boleh kosong atau kurang dari = 0`);
                    return;
                }
            }
        }
        if (this.state.error_barcode1 === true || this.state.error_barcode2 === true || this.state.error_barcode3 === true) {
            return;
        }

        this.setState({ selectedIndex: index }, () => {});
    };
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
                barangHarga[i][1].hrgBeliPACK = parseInt(rmComma(event.target.value * qty_konversi[1]), 10);
                barangHarga[i][2].hrgBeliKARTON = parseInt(rmComma(event.target.value * qty_konversi[2]), 10);
            }
            this.setState({
                hrgBeliPACK: parseInt(rmComma(event.target.value * qty_konversi[1]), 10),
                hrgBeliKARTON: parseInt(rmComma(event.target.value * qty_konversi[2]), 10),
            });
        }
        if (event.target.name === "margin1PCS") {
            barangHarga[i][0] = {
                ...barangHarga[i][0],
                [event.target.name]: event.target.value,
            };
            barangHarga[i][0].hrgJual1PCS = parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) * (parseInt(rmComma(event.target.value), 10) / 100) + parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
        }
        if (event.target.name === "margin2PCS") {
            barangHarga[i][0] = {
                ...barangHarga[i][0],
                [event.target.name]: event.target.value,
            };
            barangHarga[i][0].hrgJual2PCS = parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) * (parseInt(rmComma(event.target.value), 10) / 100) + parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
        }
        if (event.target.name === "margin3PCS") {
            barangHarga[i][0] = {
                ...barangHarga[i][0],
                [event.target.name]: event.target.value,
            };
            barangHarga[i][0].hrgJual3PCS = parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) * (parseInt(rmComma(event.target.value), 10) / 100) + parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
        }
        if (event.target.name === "margin4PCS") {
            barangHarga[i][0] = {
                ...barangHarga[i][0],
                [event.target.name]: event.target.value,
            };
            barangHarga[i][0].hrgJual4PCS = parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) * (parseInt(rmComma(event.target.value), 10) / 100) + parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
        }
        if (event.target.name === "margin5PCS") {
            barangHarga[i][0] = {
                ...barangHarga[i][0],
                [event.target.name]: event.target.value,
            };
            barangHarga[i][0].hrgJual5PCS = parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) * (parseInt(rmComma(event.target.value), 10) / 100) + parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
        }
        if (event.target.name === "margin6PCS") {
            barangHarga[i][0] = {
                ...barangHarga[i][0],
                [event.target.name]: event.target.value,
            };
            barangHarga[i][0].hrgJual6PCS = parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) * (parseInt(rmComma(event.target.value), 10) / 100) + parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
        }
        if (event.target.name === "margin7PCS") {
            barangHarga[i][0] = {
                ...barangHarga[i][0],
                [event.target.name]: event.target.value,
            };
            barangHarga[i][0].hrgJual7PCS = parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) * (parseInt(rmComma(event.target.value), 10) / 100) + parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
        }
        if (event.target.name === "margin8PCS") {
            barangHarga[i][0] = {
                ...barangHarga[i][0],
                [event.target.name]: event.target.value,
            };
            barangHarga[i][0].hrgJual8PCS = parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) * (parseInt(rmComma(event.target.value), 10) / 100) + parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
        }
        if (event.target.name === "margin9PCS") {
            barangHarga[i][0] = {
                ...barangHarga[i][0],
                [event.target.name]: event.target.value,
            };
            barangHarga[i][0].hrgJual9PCS = parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) * (parseInt(rmComma(event.target.value), 10) / 100) + parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
        }

        if (event.target.name === "margin10PCS") {
            barangHarga[i][0] = {
                ...barangHarga[i][0],
                [event.target.name]: event.target.value,
            };
            barangHarga[i][0].hrgJual10PCS = parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) * (parseInt(rmComma(event.target.value), 10) / 100) + parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
        }



        if (event.target.name === "hrgJual1PCS") {
            barangHarga[i][0] = {
                ...barangHarga[i][0],
                [event.target.name]: event.target.value,
            };
            barangHarga[i][0].margin1PCS = ((parseInt(rmComma(event.target.value), 10) - parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) * 100;
        }
        if (event.target.name === "hrgJual2PCS") {
            barangHarga[i][0] = {
                ...barangHarga[i][0],
                [event.target.name]: event.target.value,
            };
            barangHarga[i][0].margin2PCS = ((parseInt(rmComma(event.target.value), 10) - parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) * 100;
        }
        if (event.target.name === "hrgJual3PCS") {
            barangHarga[i][0] = {
                ...barangHarga[i][0],
                [event.target.name]: event.target.value,
            };
            barangHarga[i][0].margin3PCS = ((parseInt(rmComma(event.target.value), 10) - parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) * 100;
        }
        if (event.target.name === "hrgJual4PCS") {
            barangHarga[i][0] = {
                ...barangHarga[i][0],
                [event.target.name]: event.target.value,
            };
            barangHarga[i][0].margin4PCS = ((parseInt(rmComma(event.target.value), 10) - parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) * 100;
        }
        if (event.target.name === "hrgJual5PCS") {
            barangHarga[i][0] = {
                ...barangHarga[i][0],
                [event.target.name]: event.target.value,
            };
            barangHarga[i][0].margin5PCS = ((parseInt(rmComma(event.target.value), 10) - parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) * 100;
        }
        if (event.target.name === "hrgJual6PCS") {
            barangHarga[i][0] = {
                ...barangHarga[i][0],
                [event.target.name]: event.target.value,
            };
            barangHarga[i][0].margin6PCS = ((parseInt(rmComma(event.target.value), 10) - parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) * 100;
        }
        if (event.target.name === "hrgJual7PCS") {
            barangHarga[i][0] = {
                ...barangHarga[i][0],
                [event.target.name]: event.target.value,
            };
            barangHarga[i][0].margin7PCS = ((parseInt(rmComma(event.target.value), 10) - parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) * 100;
        }
        if (event.target.name === "hrgJual8PCS") {
            barangHarga[i][0] = {
                ...barangHarga[i][0],
                [event.target.name]: event.target.value,
            };
            barangHarga[i][0].margin8PCS = ((parseInt(rmComma(event.target.value), 10) - parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) * 100;
        }
        if (event.target.name === "hrgJual9PCS") {
            barangHarga[i][0] = {
                ...barangHarga[i][0],
                [event.target.name]: event.target.value,
            };
            barangHarga[i][0].margin9PCS = ((parseInt(rmComma(event.target.value), 10) - parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) * 100;
        }
        if (event.target.name === "hrgJual10PCS") {
            barangHarga[i][0] = {
                ...barangHarga[i][0],
                [event.target.name]: event.target.value,
            };
            barangHarga[i][0].margin10PCS = ((parseInt(rmComma(event.target.value), 10) - parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10)) * 100;
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

    passToParent(event, i, x, lbl) {
        if (this.props.allState !== undefined) {
            this.props.onHandleChangeChildSku_(event, i, x, lbl);
        }
    }
    onHandleChangeChildSku(event, i, x, lbl) {
        let column = event.target.name;
        let value = event.target.value;
        this.setState({ isFill: value !== "" });
        this.setState({ [column]: value });
        let barangHarga = [...this.state.barangHarga];
        if (column === "hrgBeliPCS" || column === "hrgBeliPACK" || column === "hrgBeliKARTON") {
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
                    barangHarga[i][1].hrgBeliPACK = parseInt(rmComma(value * qty_konversi[1]), 10);
                    barangHarga[i][2].hrgBeliKARTON = parseInt(rmComma(value * qty_konversi[2]), 10);
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
            column === "margin4KARTON"||
            column === "margin5KARTON"||
            column === "margin6KARTON"||
            column === "margin7KARTON"||
            column === "margin8KARTON"||
            column === "margin9KARTON"||
            column === "margin10KARTON"
        ) {
            barangHarga[i][x] = { ...barangHarga[i][x], [column]: value };
            if (column === "margin1PCS") {
                barangHarga[i][x].hrgJual1PCS = parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10);
                this.setState({
                    hrgJual1PCS: parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[x].hrgBeliPCS), 10),
                });
            }
            if (column === "margin2PCS") {
                barangHarga[i][x].hrgJual2PCS = parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10);
                this.setState({
                    hrgJual2PCS: parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[x].hrgBeliPCS), 10),
                });
            }
            if (column === "margin3PCS") {
                barangHarga[i][x].hrgJual3PCS = parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10);
                this.setState({
                    hrgJual3PCS: parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[x].hrgBeliPCS), 10),
                });
            }
            if (column === "margin4PCS") {
                barangHarga[i][0].hrgJual4PCS = parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
                this.setState({
                    hrgJual4PCS: parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[0].hrgBeliPCS), 10),
                });
            }
            if (column === "margin5PCS") {
                barangHarga[i][0].hrgJual5PCS = parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
                this.setState({
                    hrgJual5PCS: parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[0].hrgBeliPCS), 10),
                });
            }
            if (column === "margin6PCS") {
                barangHarga[i][0].hrgJual6PCS = parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
                this.setState({
                    hrgJual6PCS: parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[0].hrgBeliPCS), 10),
                });
            }
            if (column === "margin7PCS") {
                barangHarga[i][0].hrgJual7PCS = parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
                this.setState({
                    hrgJual7PCS: parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[0].hrgBeliPCS), 10),
                });
            }
            if (column === "margin8PCS") {
                barangHarga[i][0].hrgJual8PCS = parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
                this.setState({
                    hrgJual8PCS: parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[0].hrgBeliPCS), 10),
                });
            }
            if (column === "margin9PCS") {
                barangHarga[i][0].hrgJual9PCS = parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
                this.setState({
                    hrgJual9PCS: parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[0].hrgBeliPCS), 10),
                });
            }
            if (column === "margin10PCS") {
                barangHarga[i][0].hrgJual10PCS = parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10);
                this.setState({
                    hrgJual10PCS: parseInt(rmComma(barangHarga[i][0].hrgBeliPCS), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[0].hrgBeliPCS), 10),
                });
            }

            if (column === "margin1PACK") {
                barangHarga[i][x].hrgJual1PACK = parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10);
                this.setState({
                    hrgJual1PACK: parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[x].hrgBeliPACK), 10),
                });
            }
            if (column === "margin2PACK") {
                barangHarga[i][x].hrgJual2PACK = parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10);
                this.setState({
                    hrgJual2PACK: parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[x].hrgBeliPACK), 10),
                });
            }
            if (column === "margin3PACK") {
                barangHarga[i][x].hrgJual3PACK = parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10);
                this.setState({
                    hrgJual4PACK: parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[x].hrgBeliPACK), 10),
                });
            }
            if (column === "margin4PACK") {
                barangHarga[i][x].hrgJual4PACK = parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10);
                this.setState({
                    hrgJual4PACK: parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[x].hrgBeliPACK), 10),
                });
            }
            if (column === "margin5PACK") {
                barangHarga[i][x].hrgJual5PACK = parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10);
                this.setState({
                    hrgJual5PACK: parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[x].hrgBeliPACK), 10),
                });
            }
            if (column === "margin6PACK") {
                barangHarga[i][x].hrgJual6PACK = parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10);
                this.setState({
                    hrgJual6PACK: parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[x].hrgBeliPACK), 10),
                });
            }
            if (column === "margin7PACK") {
                barangHarga[i][x].hrgJual7PACK = parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10);
                this.setState({
                    hrgJual7PACK: parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[x].hrgBeliPACK), 10),
                });
            }
            if (column === "margin8PACK") {
                barangHarga[i][x].hrgJual8PACK = parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10);
                this.setState({
                    hrgJual8PACK: parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[x].hrgBeliPACK), 10),
                });
            }
            if (column === "margin9PACK") {
                barangHarga[i][x].hrgJual9PACK = parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10);
                this.setState({
                    hrgJual9PACK: parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[x].hrgBeliPACK), 10),
                });
            }
            if (column === "margin10PACK") {
                barangHarga[i][x].hrgJual10PACK = parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10);
                this.setState({
                    hrgJual10PACK: parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[x].hrgBeliPACK), 10),
                });
            }

            if (column === "margin1KARTON") {
                barangHarga[i][x].hrgJual1KARTON = parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10);
                this.setState({
                    hrgJual1KARTON: parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[x].hrgBeliKARTON), 10),
                });
            }
            if (column === "margin2KARTON") {
                barangHarga[i][x].hrgJual2KARTON = parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10);
                this.setState({
                    hrgJual2KARTON: parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[x].hrgBeliKARTON), 10),
                });
            }
            if (column === "margin3KARTON") {
                barangHarga[i][x].hrgJual3KARTON = parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10);
                this.setState({
                    hrgJual3KARTON: parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[x].hrgBeliKARTON), 10),
                });
            }
            if (column === "margin4KARTON") {
                barangHarga[i][x].hrgJual4KARTON = parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10);
                this.setState({
                    hrgJual4KARTON: parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[x].hrgBeliKARTON), 10),
                });
            }
            if (column === "margin5KARTON") {
                barangHarga[i][x].hrgJual5KARTON = parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10);
                this.setState({
                    hrgJual5KARTON: parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[x].hrgBeliKARTON), 10),
                });
            }
            if (column === "margin6KARTON") {
                barangHarga[i][x].hrgJual6KARTON = parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10);
                this.setState({
                    hrgJual6KARTON: parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[x].hrgBeliKARTON), 10),
                });
            }
            if (column === "margin7KARTON") {
                barangHarga[i][x].hrgJual7KARTON = parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10);
                this.setState({
                    hrgJual7KARTON: parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[x].hrgBeliKARTON), 10),
                });
            }
            if (column === "margin8KARTON") {
                barangHarga[i][x].hrgJual8KARTON = parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10);
                this.setState({
                    hrgJual8KARTON: parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[x].hrgBeliKARTON), 10),
                });
            }
            if (column === "margin9KARTON") {
                barangHarga[i][x].hrgJual9KARTON = parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10);
                this.setState({
                    hrgJual9KARTON: parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[x].hrgBeliKARTON), 10),
                });
            }
            if (column === "margin10KARTON") {
                barangHarga[i][x].hrgJual10KARTON = parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10);
                this.setState({
                    hrgJual10KARTON: parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(barangHarga[x].hrgBeliKARTON), 10),
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
            column === "hrgJual4KARTON"||
            column === "hrgJual5KARTON"||
            column === "hrgJual6KARTON"||
            column === "hrgJual7KARTON"||
            column === "hrgJual8KARTON"||
            column === "hrgJual9KARTON"||
            column === "hrgJual10KARTON"
        ) {
            barangHarga[i][x] = { ...barangHarga[i][x], [column]: value };
            if (column === "hrgJual1PCS") {
                barangHarga[i][x].margin1PCS = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) * 100;
                this.setState({
                    margin1PCS: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) * 100,
                });
            }
            if (column === "hrgJual2PCS") {
                barangHarga[i][x].margin2PCS = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) * 100;
                this.setState({
                    margin2PCS: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) * 100,
                });
            }
            if (column === "hrgJual3PCS") {
                barangHarga[i][x].margin3PCS = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) * 100;
                this.setState({
                    margin3PCS: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) * 100,
                });
            }
            if (column === "hrgJual4PCS") {
                barangHarga[i][x].margin4PCS = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) * 100;
                this.setState({
                    margin4PCS: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) * 100,
                });
            }
            if (column === "hrgJual5PCS") {
                barangHarga[i][x].margin5PCS = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) * 100;
                this.setState({
                    margin5PCS: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) * 100,
                });
            }
            if (column === "hrgJual6PCS") {
                barangHarga[i][x].margin6PCS = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) * 100;
                this.setState({
                    margin6PCS: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) * 100,
                });
            }
            if (column === "hrgJual7PCS") {
                barangHarga[i][x].margin7PCS = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) * 100;
                this.setState({
                    margin7PCS: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) * 100,
                });
            }
            if (column === "hrgJual8PCS") {
                barangHarga[i][x].margin8PCS = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) * 100;
                this.setState({
                    margin8PCS: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) * 100,
                });
            }
            if (column === "hrgJual9PCS") {
                barangHarga[i][x].margin9PCS = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) * 100;
                this.setState({
                    margin9PCS: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) * 100,
                });
            }
            if (column === "hrgJual10PCS") {
                barangHarga[i][x].margin10PCS = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) * 100;
                this.setState({
                    margin10PCS: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPCS), 10)) * 100,
                });
            }

            if (column === "hrgJual1PACK") {
                barangHarga[i][x].margin1PACK = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) * 100;
                this.setState({
                    margin1PACK: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) * 100,
                });
            }
            if (column === "hrgJual2PACK") {
                barangHarga[i][x].margin2PACK = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) * 100;
                this.setState({
                    margin2PACK: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) * 100,
                });
            }
            if (column === "hrgJual3PACK") {
                barangHarga[i][x].margin3PACK = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) * 100;
                this.setState({
                    margin3PACK: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) * 100,
                });
            }
            if (column === "hrgJual4PACK") {
                barangHarga[i][x].margin4PACK = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) * 100;
                this.setState({
                    margin4PACK: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) * 100,
                });
            }
            if (column === "hrgJual5PACK") {
                barangHarga[i][x].margin5PACK = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) * 100;
                this.setState({
                    margin5PACK: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) * 100,
                });
            }
            if (column === "hrgJual6PACK") {
                barangHarga[i][x].margin6PACK = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) * 100;
                this.setState({
                    margin6PACK: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) * 100,
                });
            }
            if (column === "hrgJual7PACK") {
                barangHarga[i][x].margin7PACK = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) * 100;
                this.setState({
                    margin7PACK: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) * 100,
                });
            }
            if (column === "hrgJual8PACK") {
                barangHarga[i][x].margin8PACK = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) * 100;
                this.setState({
                    margin8PACK: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) * 100,
                });
            }

            if (column === "hrgJual9PACK") {
                barangHarga[i][x].margin9PACK = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) * 100;
                this.setState({
                    margin9PACK: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) * 100,
                });
            }
            if (column === "hrgJual10PACK") {
                barangHarga[i][x].margin10PACK = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) * 100;
                this.setState({
                    margin10PACK: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) * 100,
                });
            }

            if (column === "hrgJual1KARTON") {
                barangHarga[i][x].margin1KARTON = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) * 100;
                this.setState({
                    margin1KARTON: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) * 100,
                });
            }
            if (column === "hrgJual2KARTON") {
                barangHarga[i][x].margin2KARTON = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) * 100;
                this.setState({
                    margin2KARTON: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) * 100,
                });
            }
            if (column === "hrgJual3KARTON") {
                barangHarga[i][x].margin3KARTON = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) * 100;
                this.setState({
                    margin3KARTON: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) * 100,
                });
            }
            if (column === "hrgJual4KARTON") {
                barangHarga[i][x].margin4KARTON = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) * 100;
                this.setState({
                    margin4KARTON: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) * 100,
                });
            }
            if (column === "hrgJual6KARTON") {
                barangHarga[i][x].margin6KARTON = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) * 100;
                this.setState({
                    margin6KARTON: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) * 100,
                });
            }
            if (column === "hrgJual7KARTON") {
                barangHarga[i][x].margin7KARTON = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) * 100;
                this.setState({
                    margin7KARTON: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) * 100,
                });
            }
            if (column === "hrgJual8KARTON") {
                barangHarga[i][x].margin8KARTON = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) * 100;
                this.setState({
                    margin8KARTON: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) * 100,
                });
            }
            if (column === "hrgJual9KARTON") {
                barangHarga[i][x].margin9KARTON = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) * 100;
                this.setState({
                    margin4KARTON: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliKARTON), 10)) * 100,
                });
            }
            if (column === "hrgJual10PACK") {
                barangHarga[i][x].margin10PACK = ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) * 100;
                this.setState({
                    margin10PACK: ((parseInt(rmComma(value), 10) - parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) / parseInt(rmComma(barangHarga[i][x].hrgBeliPACK), 10)) * 100,
                });
            }
        }

        if (column === "servicePCS" || column === "servicePACK" || column === "serviceKARTON") {
            barangHarga[i][x] = { ...barangHarga[i][x], [column]: parseFloat(value) > 100 ? 100 : value };
            if (column === "servicePCS") {
                this.setState({
                    servicePCS: parseFloat(value) > 100 ? 100 : value,
                });
            }
            if (column === "servicePACK") {
                this.setState({
                    servicePACK: parseFloat(value) > 100 ? 100 : value,
                });
            }
            if (column === "serviceKARTON") {
                this.setState({
                    serviceKARTON: parseFloat(value) > 100 ? 100 : value,
                });
            }
        }
        if (column === "ppnPCS" || column === "ppnPACK" || column === "ppnKARTON") {
            barangHarga[i][x] = { ...barangHarga[i][x], [column]: parseFloat(value) > 100 ? 100 : value };
            if (column === "ppnPCS") {
                this.setState({
                    ppnPCS: parseFloat(value) > 100 ? 100 : value,
                });
            }
            if (column === "ppnPACK") {
                this.setState({
                    ppnPACK: parseFloat(value) > 100 ? 100 : value,
                });
            }
            if (column === "ppnKARTON") {
                this.setState({
                    ppnKARTON: parseFloat(value) > 100 ? 100 : value,
                });
            }
        }
        this.setState({ barangHarga });
    }
    handleAllCheckedSku(event, i, lbl) {
        let checked = event.target.checked;
        if (lbl === "PCS") {
            checked === true ? localStorage.setItem("isReadonly", "true") : localStorage.setItem("isReadonly", "false");
            checked === true ? localStorage.setItem("samarata", "true") : localStorage.setItem("samarata", "false");
            let data = this.state.barangHarga;
            data.map((v, i) => {
                Object.assign(v[0], { isCheckedPCS: checked });
                return null;
            });
            this.setState({ barangHarga: data });
        }
        if (lbl === "PACK") {
            checked === true ? localStorage.setItem("isReadonlySamaPack", "true") : localStorage.setItem("isReadonlySamaPack", "false");
            checked === true ? localStorage.setItem("isReadonlyPack", "true") : localStorage.setItem("isReadonlyPack", "false");
            checked === true ? localStorage.setItem("samarata_pack", "true") : localStorage.setItem("samarata_pack", "false");
            let data = this.state.barangHarga;
            data.map((v, i) => {
                Object.assign(v[1], { isCheckedPACK: checked });
                return null;
            });
            this.setState({ barangHarga: data });
        }
        if (lbl === "KARTON") {
            checked === true ? localStorage.setItem("isReadonlySamaKarton", "true") : localStorage.setItem("isReadonlySamaKarton", "false");
            checked === true ? localStorage.setItem("isReadonlyKarton", "true") : localStorage.setItem("isReadonlyKarton", "false");
            checked === true ? localStorage.setItem("samarata_karton", "true") : localStorage.setItem("samarata_karton", "false");
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
            state.barangHarga[i][1].isCheckedPACK = !state.barangHarga[i][1].isCheckedPACK;
            return {
                barangHarga: state.barangHarga,
            };
        });
    }
    handleChange(event, i) {
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
        this.setState({ [event.target.name]: event.target.value });
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
            this.props.dispatch(
                FetchCheck({
                    table: "barang",
                    kolom: "kd_brg",
                    value: val,
                })
            );
        }
        if (i !== null) {
            let barangSku = [...this.state.barangSku];
            barangSku[i] = {
                ...barangSku[i],
                [event.target.name]: event.target.value,
            };
            this.setState({ barangSku });
        }
        if (event.target.name === "jenis") {
            if (event.target.value === "0") {
                let brgSku = [];
                for (let i = 0; i < 3; i++) {
                    let brcd = i === 0 ? `${this.state.kd_brg}` : i === 1 ? `${this.state.kd_brg}02` : `${this.state.kd_brg}03`;
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
                    let brcd = i === 0 ? `${this.state.kd_brg}` : i === 1 ? `${this.state.kd_brg}02` : "";
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
                    let satuan = val === "1" ? "" : val === "1" ? "Pcs" : "Pack";
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
                margin1: ((parseInt(rmComma(val), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100,
            });
            margin1_pcs = ((parseInt(rmComma(val), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100;
        }
        if (name === "hrgjual2") {
            this.setState({
                margin2: ((parseInt(rmComma(val), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100,
            });
            margin2_pcs = ((parseInt(rmComma(val), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100;
        }
        if (name === "hrgjual3") {
            this.setState({
                margin3: ((parseInt(rmComma(val), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100,
            });
            margin3_pcs = ((parseInt(rmComma(val), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100;
        }
        if (name === "hrgjual4") {
            this.setState({
                margin4: ((parseInt(rmComma(val), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100,
            });
            margin4_pcs = ((parseInt(rmComma(val), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100;
        }
        if (name === "margin1") {
            this.setState({
                hrgjual1: parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(val), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10),
            });
            hrg_jual_1_pcs = parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(val), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10);
        }
        if (name === "margin2") {
            this.setState({
                hrgjual2: parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(val), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10),
            });
            hrg_jual_2_pcs = parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(val), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10);
        }
        if (name === "margin3") {
            this.setState({
                hrgjual3: parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(val), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10),
            });
            hrg_jual_3_pcs = parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(val), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10);
        }
        if (name === "margin4") {
            this.setState({
                hrgjual4: parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(val), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10),
            });
            hrg_jual_4_pcs = parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(val), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10);
        }
        if (localStorage.getItem("samarata") === "true") {
            for (let i = 0; i < this.state.barangHarga.length; i++) {
                if (name === "hrg_beli") {
                    let barangHarga = this.state.barangHarga;
                    barangHarga[i][0].hrgBeliPCS = val;
                    this.setState({ barangHarga: barangHarga });
                    if (1 === 2) {
                        let barangHarga = this.state.barangHarga;
                        barangHarga[i][1].hrgBeliPACK = parseInt(rmComma(val * qty_konversi[1]), 10);
                        barangHarga[i][2].hrgBeliKARTON = parseInt(rmComma(val * qty_konversi[2]), 10);
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
    handleChangeMore(e) {
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
                hrgjual1: parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10),
            });
            hrg_jual_1_pcs = parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10);
        }
        if (column === "margin2") {
            this.setState({
                hrgjual2: parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10),
            });
            hrg_jual_2_pcs = parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10);
        }
        if (column === "margin3") {
            this.setState({
                hrgjual3: parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10),
            });
            hrg_jual_3_pcs = parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10);
        }
        if (column === "margin4") {
            this.setState({
                hrgjual4: parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10),
            });
            hrg_jual_4_pcs = parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10);
        }
        if (column === "margin5") {
            this.setState({
                hrgjual5: parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10),
            });
            hrg_jual_5_pcs = parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10);
        }
        if (column === "margin6") {
            this.setState({
                hrgjual6: parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10),
            });
            hrg_jual_6_pcs = parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10);
        }
        if (column === "margin7") {
            this.setState({
                hrgjual7: parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10),
            });
            hrg_jual_7_pcs = parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10);
        }
        if (column === "margin8") {
            this.setState({
                hrgjual8: parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10),
            });
            hrg_jual_8_pcs = parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10);
        }
        if (column === "margin9") {
            this.setState({
                hrgjual9: parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10),
            });
            hrg_jual_9_pcs = parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10);
        }
        if (column === "margin10") {
            this.setState({
                hrgjual10: parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10),
            });
            hrg_jual_10_pcs = parseInt(rmComma(this.state.hrg_beli), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli), 10);
        }

        if (column === "hrgjual1") {
            this.setState({
                margin1: ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100,
            });
            margin1_pcs = ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100;
        }
        if (column === "hrgjual2") {
            this.setState({
                margin2: ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100,
            });
            margin2_pcs = ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100;
        }
        if (column === "hrgjual3") {
            this.setState({
                margin3: ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100,
            });
            margin3_pcs = ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100;
        }
        if (column === "hrgjual4") {
            this.setState({
                margin4: ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100,
            });
            margin4_pcs = ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100;
        }
        if (column === "hrgjual5") {
            this.setState({
                margin5: ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100,
            });
            margin5_pcs = ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100;
        }
        if (column === "hrgjual6") {
            this.setState({
                margin6: ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100,
            });
            margin6_pcs = ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100;
        }
        if (column === "hrgjual7") {
            this.setState({
                margin7: ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100,
            });
            margin7_pcs = ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100;
        }
        if (column === "hrgjual8") {
            this.setState({
                margin8: ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100,
            });
            margin8_pcs = ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100;
        }
        if (column === "hrgjual9") {
            this.setState({
                margin9: ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100,
            });
            margin9_pcs = ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100;
        }
        if (column === "hrgjual10") {
            this.setState({
                margin10: ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100,
            });
            margin10_pcs = ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli), 10)) / parseInt(rmComma(this.state.hrg_beli), 10)) * 100;
        }

        if (localStorage.getItem("samarata") === "true") {
            for (let i = 0; i < this.state.barangHarga.length; i++) {
                if (column === "hrg_beli") {
                    let barangHarga = this.state.barangHarga;
                    barangHarga[i][0].hrgBeliPCS = value;
                    this.setState({ barangHarga: barangHarga });
                    if (this.state.barangSku.length === 3) {
                        let barangHarga = this.state.barangHarga;
                        barangHarga[i][1].hrgBeliPACK = parseInt(rmComma(value * qty_konversi[1]), 10);
                        barangHarga[i][2].hrgBeliKARTON = parseInt(rmComma(value * qty_konversi[2]), 10);
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
                    barangHarga[i][0].servicePCS = value;
                    this.setState({ barangHarga: barangHarga });
                }
                if (column === "ppn") {
                    let barangHarga = this.state.barangHarga;
                    barangHarga[i][0].ppnPCS = value;
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
                        hrgjual1_pack: parseInt(rmComma(this.state.hrg_beli_pack), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli_pack), 10),
                        hrgJual1PACK: parseInt(rmComma(this.state.hrg_beli_pack), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli_pack), 10),
                        margin1PACK: value,
                    });
                    let barangHarga = this.state.barangHarga;
                    barangHarga[i][1].margin1PACK = value;
                    barangHarga[i][1].hrgJual1PACK = parseInt(rmComma(this.state.hrg_beli_pack), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli_pack), 10);
                    this.setState({ barangHarga: barangHarga });
                }
                if (column === "margin2_pack") {
                    this.setState({
                        hrgjual2_pack: parseInt(rmComma(this.state.hrg_beli_pack), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli_pack), 10),
                        hrgJual2PACK: parseInt(rmComma(this.state.hrg_beli_pack), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli_pack), 10),
                        margin2PACK: value,
                    });
                    let barangHarga = this.state.barangHarga;
                    barangHarga[i][1].margin2PACK = value;
                    barangHarga[i][1].hrgJual2PACK = parseInt(rmComma(this.state.hrg_beli_pack), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli_pack), 10);
                    this.setState({ barangHarga: barangHarga });
                }
                if (column === "margin3_pack") {
                    this.setState({
                        hrgjual3_pack: parseInt(rmComma(this.state.hrg_beli_pack), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli_pack), 10),
                        hrgJual3PACK: parseInt(rmComma(this.state.hrg_beli_pack), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli_pack), 10),
                        margin3PACK: value,
                    });
                    let barangHarga = this.state.barangHarga;
                    barangHarga[i][1].margin3PACK = value;
                    barangHarga[i][1].hrgJual3PACK = parseInt(rmComma(this.state.hrg_beli_pack), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli_pack), 10);
                    this.setState({ barangHarga: barangHarga });
                }
                if (column === "margin4_pack") {
                    this.setState({
                        hrgjual4_pack: parseInt(rmComma(this.state.hrg_beli_pack), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli_pack), 10),
                        hrgJual4PACK: parseInt(rmComma(this.state.hrg_beli_pack), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli_pack), 10),
                        margin4PACK: value,
                    });
                    let barangHarga = this.state.barangHarga;
                    barangHarga[i][1].margin4PACK = value;
                    barangHarga[i][1].hrgJual4PACK = parseInt(rmComma(this.state.hrg_beli_pack), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli_pack), 10);
                    this.setState({ barangHarga: barangHarga });
                }
                if (column === "hrgjual1_pack") {
                    this.setState({
                        margin1_pack: ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli_pack), 10)) / parseInt(rmComma(this.state.hrg_beli_pack), 10)) * 100,
                        margin1PACK: ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli_pack), 10)) / parseInt(rmComma(this.state.hrg_beli_pack), 10)) * 100,
                        hrgJual1PACK: value,
                    });
                    let barangHarga = this.state.barangHarga;
                    barangHarga[i][1].margin1PACK = ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli_pack), 10)) / parseInt(rmComma(this.state.hrg_beli_pack), 10)) * 100;
                    barangHarga[i][1].hrgJual1PACK = value;
                    this.setState({ barangHarga: barangHarga });
                }
                if (column === "hrgjual2_pack") {
                    this.setState({
                        margin2_pack: ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli_pack), 10)) / parseInt(rmComma(this.state.hrg_beli_pack), 10)) * 100,
                        margin2PACK: ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli_pack), 10)) / parseInt(rmComma(this.state.hrg_beli_pack), 10)) * 100,
                        hrgJual2PACK: value,
                    });
                    let barangHarga = this.state.barangHarga;
                    barangHarga[i][1].margin2PACK = ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli_pack), 10)) / parseInt(rmComma(this.state.hrg_beli_pack), 10)) * 100;
                    barangHarga[i][1].hrgJual2PACK = value;
                    this.setState({ barangHarga: barangHarga });
                }
                if (column === "hrgjual3_pack") {
                    this.setState({
                        margin3_pack: ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli_pack), 10)) / parseInt(rmComma(this.state.hrg_beli_pack), 10)) * 100,
                        margin3PACK: ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli_pack), 10)) / parseInt(rmComma(this.state.hrg_beli_pack), 10)) * 100,
                        hrgJual3PACK: value,
                    });
                    let barangHarga = this.state.barangHarga;
                    barangHarga[i][1].margin3PACK = ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli_pack), 10)) / parseInt(rmComma(this.state.hrg_beli_pack), 10)) * 100;
                    barangHarga[i][1].hrgJual3PACK = value;
                    this.setState({ barangHarga: barangHarga });
                }
                if (column === "hrgjual4_pack") {
                    this.setState({
                        margin4_pack: ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli_pack), 10)) / parseInt(rmComma(this.state.hrg_beli_pack), 10)) * 100,
                        margin4PACK: ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli_pack), 10)) / parseInt(rmComma(this.state.hrg_beli_pack), 10)) * 100,
                        hrgJual4PACK: value,
                    });
                    let barangHarga = this.state.barangHarga;
                    barangHarga[i][1].margin4PACK = ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli_pack), 10)) / parseInt(rmComma(this.state.hrg_beli_pack), 10)) * 100;
                    barangHarga[i][1].hrgJual4PACK = value;
                    this.setState({ barangHarga: barangHarga });
                }
                if (column === "service_pack") {
                    let barangHarga = this.state.barangHarga;
                    barangHarga[i][1].servicePACK = value;
                    this.setState({
                        barangHarga: barangHarga,
                        servicePACK: value,
                    });
                }
                if (column === "ppn_pack") {
                    let barangHarga = this.state.barangHarga;
                    barangHarga[i][1].ppnPACK = value;
                    this.setState({
                        barangHarga: barangHarga,
                        ppnPACK: value,
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
                        hrgjual1_karton: parseInt(rmComma(this.state.hrg_beli_karton), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli_karton), 10),
                        hrgJual1KARTON: parseInt(rmComma(this.state.hrg_beli_karton), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli_karton), 10),
                        margin1KARTON: value,
                    });
                    let barangHarga = this.state.barangHarga;
                    barangHarga[i][2].margin1KARTON = value;
                    barangHarga[i][2].hrgJual1KARTON = parseInt(rmComma(this.state.hrg_beli_karton), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli_karton), 10);
                    this.setState({ barangHarga: barangHarga });
                }
                if (column === "margin2_karton") {
                    this.setState({
                        hrgjual2_karton: parseInt(rmComma(this.state.hrg_beli_karton), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli_karton), 10),
                        hrgJual2KARTON: parseInt(rmComma(this.state.hrg_beli_karton), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli_karton), 10),
                        margin2KARTON: value,
                    });
                    let barangHarga = this.state.barangHarga;
                    barangHarga[i][2].margin2KARTON = value;
                    barangHarga[i][2].hrgJual2KARTON = parseInt(rmComma(this.state.hrg_beli_karton), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli_karton), 10);
                    this.setState({ barangHarga: barangHarga });
                }
                if (column === "margin3_karton") {
                    this.setState({
                        hrgjual3_karton: parseInt(rmComma(this.state.hrg_beli_karton), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli_karton), 10),
                        hrgJual3KARTON: parseInt(rmComma(this.state.hrg_beli_karton), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli_karton), 10),
                        margin3KARTON: value,
                    });
                    let barangHarga = this.state.barangHarga;
                    barangHarga[i][2].margin3KARTON = value;
                    barangHarga[i][2].hrgJual3KARTON = parseInt(rmComma(this.state.hrg_beli_karton), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli_karton), 10);
                    this.setState({ barangHarga: barangHarga });
                }
                if (column === "margin4_karton") {
                    this.setState({
                        hrgjual4_karton: parseInt(rmComma(this.state.hrg_beli_karton), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli_karton), 10),
                        hrgJual4KARTON: parseInt(rmComma(this.state.hrg_beli_karton), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli_karton), 10),
                        margin4KARTON: value,
                    });
                    let barangHarga = this.state.barangHarga;
                    barangHarga[i][2].margin4KARTON = value;
                    barangHarga[i][2].hrgJual4KARTON = parseInt(rmComma(this.state.hrg_beli_karton), 10) * (parseInt(rmComma(value), 10) / 100) + parseInt(rmComma(this.state.hrg_beli_karton), 10);
                    this.setState({ barangHarga: barangHarga });
                }
                if (column === "hrgjual1_karton") {
                    this.setState({
                        margin1_karton: ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli_karton), 10)) / parseInt(rmComma(this.state.hrg_beli_karton), 10)) * 100,
                        margin1KARTON: ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli_karton), 10)) / parseInt(rmComma(this.state.hrg_beli_karton), 10)) * 100,
                        hrgJual1KARTON: value,
                    });
                    let barangHarga = this.state.barangHarga;
                    barangHarga[i][2].margin1KARTON = ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli_karton), 10)) / parseInt(rmComma(this.state.hrg_beli_karton), 10)) * 100;
                    barangHarga[i][2].hrgJual1KARTON = value;
                    this.setState({ barangHarga: barangHarga });
                }
                if (column === "hrgjual2_karton") {
                    this.setState({
                        margin2_karton: ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli_karton), 10)) / parseInt(rmComma(this.state.hrg_beli_karton), 10)) * 100,
                        margin2KARTON: ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli_karton), 10)) / parseInt(rmComma(this.state.hrg_beli_karton), 10)) * 100,
                        hrgJual2KARTON: value,
                    });
                    let barangHarga = this.state.barangHarga;
                    barangHarga[i][2].margin2KARTON = ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli_karton), 10)) / parseInt(rmComma(this.state.hrg_beli_karton), 10)) * 100;
                    barangHarga[i][2].hrgJual2KARTON = value;
                    this.setState({ barangHarga: barangHarga });
                }
                if (column === "hrgjual3_karton") {
                    this.setState({
                        margin3_karton: ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli_karton), 10)) / parseInt(rmComma(this.state.hrg_beli_karton), 10)) * 100,
                        margin3KARTON: ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli_karton), 10)) / parseInt(rmComma(this.state.hrg_beli_karton), 10)) * 100,
                        hrgJual3KARTON: value,
                    });
                    let barangHarga = this.state.barangHarga;
                    barangHarga[i][2].margin3KARTON = ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli_karton), 10)) / parseInt(rmComma(this.state.hrg_beli_karton), 10)) * 100;
                    barangHarga[i][2].hrgJual3KARTON = value;
                    this.setState({ barangHarga: barangHarga });
                }
                if (column === "hrgjual4_karton") {
                    this.setState({
                        margin4_karton: ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli_karton), 10)) / parseInt(rmComma(this.state.hrg_beli_karton), 10)) * 100,
                        margin4KARTON: ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli_karton), 10)) / parseInt(rmComma(this.state.hrg_beli_karton), 10)) * 100,
                        hrgJual4KARTON: value,
                    });
                    let barangHarga = this.state.barangHarga;
                    barangHarga[i][2].margin4KARTON = ((parseInt(rmComma(value), 10) - parseInt(rmComma(this.state.hrg_beli_karton), 10)) / parseInt(rmComma(this.state.hrg_beli_karton), 10)) * 100;
                    barangHarga[i][2].hrgJual4KARTON = value;
                    this.setState({ barangHarga: barangHarga });
                }
                if (column === "service_karton") {
                    let barangHarga = this.state.barangHarga;
                    barangHarga[i][2].serviceKARTON = value;
                    this.setState({
                        barangHarga: barangHarga,
                        serviceKARTON: value,
                    });
                }
                if (column === "ppn_karton") {
                    let barangHarga = this.state.barangHarga;
                    barangHarga[i][2].ppnKARTON = value;
                    this.setState({
                        barangHarga: barangHarga,
                        ppnKARTON: value,
                    });
                }
            }
        }
    }
    handleSubmit(e) {
        e.preventDefault();
        let parseData = {};
        let barangSku = [];
        let barangHarga = [];
        let barcode = [];
        parseData["kd_brg"] = this.state.kd_brg;
        parseData["nm_brg"] = this.state.nm_brg;
        parseData["kel_brg"] = this.state.kel_brg;
        parseData["jenis"] = this.state.kategori;
        parseData["stock_min"] = this.state.stock_min;
        parseData["group1"] = this.state.group1;
        parseData["group2"] = this.state.group2;
        parseData["deskripsi"] = this.state.deskripsi;
        parseData["gambar"] = this.state.gambar;
        parseData["kategori"] = this.state.jenis;
        parseData["kcp"] = this.state.kcp;
        parseData["poin"] = this.state.poin;
        parseData["online"] = this.state.online;
        parseData["berat"] = this.state.berat;
        parseData["gambar"] = parseData["gambar"] === "" ? "-" : this.state.gambar.base64;
        for (let sku = 0; sku < this.state.barangSku.length; sku++) {
            let stateSku = this.state.barangSku[sku];
            let satuan = "";
            if (sku === 0) {
                satuan = `PCS`;
            }
            if (sku === 1) {
                satuan = `PACK`;
            }
            if (sku === 2) {
                satuan = `KARTON`;
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


                for (let setHrg = 0; setHrg < this.state.set_harga; setHrg++) {
                    let valHrgJual = `hrgJual${setHrg + 1}${satuan}`;
                    let valMargin = `margin${setHrg + 1}${satuan}`;
                    let lblHrg = `nm_harga${setHrg + 1}`;
                    if (parseInt(rmComma(stateBrgHrg[hrgbeli]), 10) === 0 || parseInt(rmComma(stateBrgHrg[hrgbeli]), 10) < 0 || stateBrgHrg[hrgbeli] === "") {
                        alert(`harga beli ${stateSku.qty !== undefined ? `jenis barang ${stateSku.qty}` : ""} di lokasi ${stateBrgHrg.nama_toko} tidak boleh atau kurang dari 0`);
                        return false;
                    }
                    if (this.state.jenis !== "4") {
                        if (parseInt(rmComma(stateBrgHrg[valMargin]), 10) < 0) {
                            alert(`margin ${setHrg + 1} ${stateSku.qty !== undefined ? `jenis barang ${stateSku.qty}` : ""}  di lokasi ${stateBrgHrg.nama_toko} tidak boleh kurang dari 0`);
                            return false;
                        }
                        if (stateBrgHrg[valHrgJual] === "") {
                            alert(`harga jual ${this.state[lblHrg]} ${stateSku.qty !== undefined ? `jenis barang ${stateSku.qty}` : ""}  di lokasi ${stateBrgHrg.nama_toko} tidak boleh atau kurang dari 0`);
                            return false;
                        }
                        if (parseInt(rmComma(stateBrgHrg[service]), 10) < 0 || stateBrgHrg[service] === "") {
                            alert(`service ${stateSku.qty !== undefined ? `jenis barang ${stateSku.qty}` : ""} di lokasi ${stateBrgHrg.nama_toko} tidak boleh atau kurang dari 0`);
                            return false;
                        }
                        if (parseInt(rmComma(stateBrgHrg[ppn]), 10) < 0 || stateBrgHrg[hrgbeli] === "") {
                            alert(`ppn ${stateSku.qty !== undefined ? `jenis barang ${stateSku.qty}` : ""} di lokasi ${stateBrgHrg.nama_toko} tidak boleh atau kurang dari 0`);
                            return false;
                        }
                    }
                }

                barangHarga.push({
                    lokasi: stateBrgHrg.lokasi,
                    barcode: barcode[sku],
                    harga_beli: parseInt(isNaN(rmComma(stateBrgHrg[hrgbeli])) ? 0 : rmComma(stateBrgHrg[hrgbeli]), 10),
                    ppn: stateBrgHrg[ppn],
                    service: stateBrgHrg[service],
                    harga: parseInt(isNaN(rmComma(stateBrgHrg[hrgJual1])) ? 0 : rmComma(stateBrgHrg[hrgJual1]), 10),
                    harga2: parseInt(isNaN(rmComma(stateBrgHrg[hrgJual2])) ? 0 : rmComma(stateBrgHrg[hrgJual2]), 10),
                    harga3: parseInt(isNaN(rmComma(stateBrgHrg[hrgJual3])) ? 0 : rmComma(stateBrgHrg[hrgJual3]), 10),
                    harga4: parseInt(isNaN(rmComma(stateBrgHrg[hrgJual4])) ? 0 : rmComma(stateBrgHrg[hrgJual4]), 10),
                    harga5: parseInt(isNaN(rmComma(stateBrgHrg[hrgJual5])) ? 0 : rmComma(stateBrgHrg[hrgJual5]), 10),
                    harga6: parseInt(isNaN(rmComma(stateBrgHrg[hrgJual6])) ? 0 : rmComma(stateBrgHrg[hrgJual6]), 10),
                    harga7: parseInt(isNaN(rmComma(stateBrgHrg[hrgJual7])) ? 0 : rmComma(stateBrgHrg[hrgJual7]), 10),
                    harga8: parseInt(isNaN(rmComma(stateBrgHrg[hrgJual8])) ? 0 : rmComma(stateBrgHrg[hrgJual8]), 10),
                    harga9: parseInt(isNaN(rmComma(stateBrgHrg[hrgJual9])) ? 0 : rmComma(stateBrgHrg[hrgJual9]), 10),
                    harga10: parseInt(isNaN(rmComma(stateBrgHrg[hrgJual10])) ? 0 : rmComma(stateBrgHrg[hrgJual10]), 10),
                });
            }
        }

        parseData["barang_sku"] = barangSku;
        parseData["barang_harga"] = barangHarga;
        console.log(parseData);
        if (this.props.dataEdit !== undefined && this.props.dataEdit !== []) {
            if (this.props.allState === undefined) {
                let newParseData = {};
                newParseData["barang_harga"] = parseData.barang_harga;
                this.props.dispatch(updateProduct(this.state.kd_brg, newParseData,(status)=>{

                }));
            }
            this.clearState();
        } else {
            // this.props.dispatch(createProduct(parseData));
            // this.props.handler({dataEdit:{barang_harga:parseData.barang_harga,barang_sku:parseData.barang_sku}})
            this.props.handler({ barangHarga_: this.state.barangHarga, barangSku_: this.state.barangSku });
            this.setState({ isFill: false });
            this.props.dispatch(ModalType("formProduct"));
        }
    }
    getFiles(files) {
        this.setState({
            gambar: files,
        });
    }
    render() {
        return (
            <div>
                <WrapperModal
                    // className="custom-map-modal"
                    isOpen={this.props.isOpen && this.props.type === "formProductPricing"}
                    size="xl"
                >
                    <ModalHeader toggle={this.toggle}>
                        {this.props.dataEdit === undefined ? "Tambah Harga Barang" : "Ubah Harga Barang"}
                    </ModalHeader>

                    <form onSubmit={this.handleSubmit}>
                        <ModalBody>

                            <div className="row mt-2" style={{ display: this.state.jenis !== "" && this.state.kd_brg !== "" ? "" : "none" }}/>
                            <div className="row mt-2">
                                <div className="col-md-12">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h4 className="mb-2">Set harga per lokasi</h4>
                                        <div className="form-group">
                                            <label htmlFor="zoom" className="m-0 p-0">
                                                Zoom in/out table
                                            </label>
                                            <input className="custom-range border-0" id="zoom" type="range" name="zoom" onChange={(e) => this.handleChange(e)} value={this.state.zoom} min={0} max={25} step={1} />
                                        </div>
                                    </div>
                                    <hr className="mt-0" />
                                </div>
                                <div className="col-md-12">
                                    <table className="table table-hover table-bordered" style={{ tableLayout: "fixed", zoom: 75 + parseInt(this.state.zoom, 10) + "%" }}>
                                        <thead className="bg-light d-none">
                                        <tr>
                                            <div>
                                                <tr>
                                                    <th className="text-black" rowSpan={2} width="1%" style={{ verticalAlign: "middle", textAlign: "center" }}>
                                                        HARGA BELI
                                                    </th>
                                                    <th className="text-black" colSpan={this.state.set_harga} width="5%" style={{ verticalAlign: "middle", textAlign: "center" }}>
                                                        HARGA JUAL
                                                    </th>
                                                    <th className="text-black" colSpan={this.state.set_harga} width="5%" style={{ verticalAlign: "middle", textAlign: "center" }}>
                                                        MARGIN
                                                    </th>
                                                </tr>
                                                <tr>
                                                    {(() => {
                                                        let container = [];
                                                        for (let z = 0; z < this.state.set_harga; z++) {
                                                            container.push(
                                                                <td className="text-black" style={{ verticalAlign: "middle", textAlign: "center" }}>
                                                                    {z + 1}
                                                                </td>
                                                            );
                                                        }
                                                        return container;
                                                    })()}
                                                    {(() => {
                                                        let container = [];
                                                        for (let z = 0; z < this.state.set_harga; z++) {
                                                            container.push(
                                                                <td className="text-black" style={{ verticalAlign: "middle", textAlign: "center" }}>
                                                                    {z + 1}
                                                                </td>
                                                            );
                                                        }
                                                        return container;
                                                    })()}
                                                </tr>
                                            </div>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.barangHarga.map((v, i) => {
                                            return (
                                                <tr key={i}>
                                                    {(() => {
                                                        let containers = [];
                                                        for (let x = 0; x < this.state.barangSku.length; x++) {
                                                            let satuan = "";
                                                            let lbl = this.state.barangSku[x].qty;
                                                            let hargaBeli,
                                                                nameHargaBeli = "hrgBeli";
                                                            let service,
                                                                serviceName = "service";
                                                            let ppn,
                                                                ppnName = "ppn";
                                                            if (x === 0) {
                                                                satuan = "Pcs";
                                                                hargaBeli = v[x].hrgBeliPCS;
                                                                nameHargaBeli += `PCS`;
                                                                service = v[x].servicePCS;
                                                                ppn = v[x].ppnPCS;
                                                                serviceName += "PCS";
                                                                ppnName += "PCS";
                                                            }
                                                            if (x === 1) {
                                                                satuan = "Pack";
                                                                hargaBeli = v[x].hrgBeliPACK;
                                                                nameHargaBeli += `PACK`;
                                                                service = v[x].servicePACK;
                                                                ppn = v[x].ppnPACK;
                                                                serviceName += "PACK";
                                                                ppnName += "PACK";
                                                            }
                                                            if (x === 2) {
                                                                satuan = "Karton";
                                                                hargaBeli = v[x].hrgBeliKARTON;
                                                                nameHargaBeli += `KARTON`;
                                                                service = v[x].serviceKARTON;
                                                                ppn = v[x].ppnKARTON;
                                                                serviceName += "KARTON";
                                                                ppnName += "KARTON";
                                                            }
                                                            containers.push(
                                                                <div>
                                                                    <tr>
                                                                        <th className="text-black" colSpan={9} width="10%" style={{ verticalAlign: "middle", textAlign: "left" }}>
                                                                            <div className="d-flex align-items-center">
                                                                                <label className="mb-0">
                                                                                    {v[x].nama_toko}
                                                                                </label>
                                                                            </div>
                                                                        </th>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="text-black" style={{ verticalAlign: "top", textAlign: "center" }}>
                                                                            <div className="form-group">
                                                                                <label className="text-secondary float-left">Harga Beli</label>
                                                                                <input
                                                                                    type="text"
                                                                                    placeholder="hrg beli"
                                                                                    className="form-control"
                                                                                    name={nameHargaBeli}
                                                                                    value={toCurrency(hargaBeli)}
                                                                                    onChange={(e) => this.onHandleChangeChildSku(e, i, x, satuan)}
                                                                                />
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            {(() => {
                                                                                let container = [];
                                                                                for (let z = 0; z < this.state.set_harga; z++) {
                                                                                    let marginName = x === 0 ? `margin${z + 1}PCS` : x === 1 ? `margin${z + 1}PACK` : `margin${z + 1}KARTON`;
                                                                                    let place = `harga${z + 1}`;
                                                                                    let marginValue = v[x][marginName];
                                                                                    container.push(
                                                                                        <div className="form-group" key={z}>
                                                                                            <label className="text-secondary float-left">Margin {this.props.auth.user.nama_harga[z][`harga${z+1}`]}</label>
                                                                                            <div className="input-group">
                                                                                                <input
                                                                                                    type="text"
                                                                                                    placeholder={`margin ${z + 1} ${lbl}`}
                                                                                                    className="form-control"
                                                                                                    name={marginName}
                                                                                                    onChange={(e) => this.onHandleChangeChildSku(e, i, x, satuan)}
                                                                                                    value={marginValue}
                                                                                                />
                                                                                                <div className="input-group-append">
                                                                                                    <span className="input-group-text">%</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                }
                                                                                return container;
                                                                            })()}
                                                                        </td>
                                                                        {/* end margin */}
                                                                        {/* start harga jual */}

                                                                        <td>
                                                                            {(() => {
                                                                                let container = [];
                                                                                for (let z = 0; z < this.state.set_harga; z++) {
                                                                                    let place = `nm_harga${z + 1}`;
                                                                                    let hrgName = `hrgJual${z + 1}${satuan !== undefined ? satuan.toUpperCase() : ""}`;
                                                                                    let hrg = `hrgJual${z + 1}${satuan !== undefined ? satuan.toUpperCase() : ""}`;
                                                                                    let hrgValue = v[x][hrg];
                                                                                    container.push(
                                                                                        <div className="form-group" key={z}>
                                                                                            <label className="text-secondary float-left">
                                                                                                Harga Jual
                                                                                                {this.state.set_harga > 1 ? ` ${this.props.auth.user.nama_harga[z][`harga${z+1}`]}` : ""}
                                                                                            </label>
                                                                                            <input
                                                                                                type="text"
                                                                                                placeholder={`hrg jual ${this.state[place]} ${lbl}`}
                                                                                                className="form-control"
                                                                                                name={hrgName}
                                                                                                value={toCurrency(hrgValue)}
                                                                                                onChange={(e) => this.onHandleChangeChildSku(e, i, x, satuan)}
                                                                                            />
                                                                                        </div>
                                                                                    );
                                                                                }
                                                                                return container;
                                                                            })()}
                                                                        </td>

                                                                        {this.props.auth.user.is_resto === 1 ? (
                                                                            <td className="text-black" style={{ verticalAlign: "top", textAlign: "center" }}>
                                                                                <div className="form-group">
                                                                                    <label className="text-secondary float-left">Service</label>
                                                                                    <div className="input-group">
                                                                                        <input
                                                                                            type="text"
                                                                                            placeholder="service"
                                                                                            className="form-control"
                                                                                            name={serviceName}
                                                                                            value={service}
                                                                                            onChange={(e) => this.onHandleChangeChildSku(e, i, x, satuan)}
                                                                                        />
                                                                                        <div className="input-group-append">
                                                                                            <span className="input-group-text">%</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                        ) : (
                                                                            ""
                                                                        )}
                                                                        {this.props.auth.user.is_resto === 1 ? (
                                                                            <td className="text-black" style={{ verticalAlign: "top", textAlign: "center" }}>
                                                                                <div className="form-group">
                                                                                    <label className="text-secondary float-left">PPN</label>
                                                                                    <div className="input-group">
                                                                                        <input
                                                                                            type="text"
                                                                                            placeholder="PPN"
                                                                                            className="form-control"
                                                                                            name={ppnName}
                                                                                            value={ppn}
                                                                                            onChange={(e) => this.onHandleChangeChildSku(e, i, x, satuan)}
                                                                                        />
                                                                                        <div className="input-group-append">
                                                                                            <span className="input-group-text">%</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                        ) : (
                                                                            ""
                                                                        )}
                                                                    </tr>


                                                                </div>
                                                            );
                                                        }
                                                        return containers;
                                                    })()}
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-md-12">
                                    <div className="row d-none">
                                        <div className="col-md-2">
                                            <label>Lokasi</label>
                                        </div>
                                        <div className="col-md-10">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="row">
                                                        <div className="col-md-4">
                                                            <label className="control-label">Harga Beli</label>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label className="control-label">Margin %</label>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <label className="control-label">Harga Jual</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="row">
                                                        <div className="col-md-3">
                                                            <label className="control-label">Service %</label>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <label className="control-label">PPN %</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/*END LABEL*/}

                                    <div className="row d-none">
                                        {this.state.barangHarga.map((v, i) => {
                                            return (
                                                <div className="col-md-12" key={i}>
                                                    <div className={`border border-1 mx-0 p-2 rounded-lg mb-2 ${i % 2 === 0 ? "bg-light" : ""}`}>
                                                        {(() => {
                                                            let containers = [];
                                                            for (let x = 0; x < this.state.barangSku.length; x++) {
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
                                                                            <div className="form-group">
                                                                                <div className="d-flex align-items-center">
                                                                                    <input className="mr-2" type="checkbox" name="lokasi" value={v[x].lokasi} checked={checked} onChange={(e) => this.handleCheckChieldElementSku(e, i)} />
                                                                                    <label className="mb-0">
                                                                                        {v[x].nama_toko}
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-md-12">
                                                                            <div className="row">
                                                                                <div className="col-md-12">
                                                                                    <div className="row">
                                                                                        <div className="col-md-4">
                                                                                            <div className="form-group">
                                                                                                <label>Harga Beli </label>
                                                                                                <input
                                                                                                    readOnly={localStorage.getItem(`${isReadonly}`) === "true"}
                                                                                                    type="text"
                                                                                                    placeholder="hrg beli"
                                                                                                    className="form-control"
                                                                                                    name={nameHargaBeli}
                                                                                                    value={toCurrency(hargaBeli)}
                                                                                                    onChange={(e) => this.onHandleChangeChildSku(e, i, x, satuan)}
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-md-4">
                                                                                            {(() => {
                                                                                                let container = [];
                                                                                                for (let z = 0; z < this.state.set_harga; z++) {
                                                                                                    let marginName = x === 0 ? `margin${z + 1}PCS` : x === 1 ? `margin${z + 1}PACK` : `margin${z + 1}KARTON`;
                                                                                                    let place = `nm_harga${z + 1}`;
                                                                                                    let marginValue = v[x][marginName];
                                                                                                    container.push(
                                                                                                        <div className="form-group" key={z}>
                                                                                                            <label>Margin {this.props.auth.user.nama_harga[z][`harga${z+1}`]}</label>
                                                                                                            <div className="input-group">
                                                                                                                <input
                                                                                                                    readOnly={this.state.jenis === "4" ? true : localStorage.getItem(`${isReadonly}`) === "true"}
                                                                                                                    type="text"
                                                                                                                    placeholder={`margin ${z + 1}`}
                                                                                                                    className="form-control"
                                                                                                                    name={marginName}
                                                                                                                    onChange={(e) => this.onHandleChangeChildSku(e, i, x, satuan)}
                                                                                                                    value={marginValue}
                                                                                                                />
                                                                                                                <div className="input-group-append">
                                                                                                                    <span className="input-group-text">%</span>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    );
                                                                                                }
                                                                                                return container;
                                                                                            })()}
                                                                                        </div>
                                                                                        <div className="col-md-4">
                                                                                            {(() => {
                                                                                                let container = [];
                                                                                                for (let z = 0; z < this.state.set_harga; z++) {
                                                                                                    let place = `nm_harga${z + 1}`;
                                                                                                    let hrgName = `hrgJual${z + 1}${satuan !== undefined ? satuan.toUpperCase() : ""}`;
                                                                                                    let hrg = `hrgJual${z + 1}${satuan !== undefined ? satuan.toUpperCase() : ""}`;
                                                                                                    let hrgValue = v[x][hrg];
                                                                                                    container.push(
                                                                                                        <div className="form-group" key={z}>
                                                                                                            <label>Harga Jual {this.props.auth.user.nama_harga[z][`harga${z+1}`]}</label>
                                                                                                            <input
                                                                                                                readOnly={this.state.jenis === "4" ? true : localStorage.getItem(`${isReadonly}`) === "true"}
                                                                                                                type="text"
                                                                                                                placeholder={`hrg jual ${this.state[place]}`}
                                                                                                                className="form-control"
                                                                                                                name={hrgName}
                                                                                                                value={toCurrency(hrgValue)}
                                                                                                                onChange={(e) => this.onHandleChangeChildSku(e, i, x, satuan)}
                                                                                                            />
                                                                                                        </div>
                                                                                                    );
                                                                                                }
                                                                                                return container;
                                                                                            })()}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                {/*service,ppn,stock min,stock max */}
                                                                                <div className="col-md-6 d-none">
                                                                                    <div className="row">
                                                                                        <div className="col-md-6">
                                                                                            <div className="form-group">
                                                                                                <label>Service</label>
                                                                                                <input
                                                                                                    readOnly={this.state.jenis === "4" ? true : localStorage.getItem(`${isReadonly}`) === "true"}
                                                                                                    type="text"
                                                                                                    placeholder="service"
                                                                                                    className="form-control"
                                                                                                    name={serviceName}
                                                                                                    value={service}
                                                                                                    onChange={(e) => this.onHandleChangeChildSku(e, i, x, satuan)}
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-md-6">
                                                                                            <div className="form-group">
                                                                                                <label>PPN</label>
                                                                                                <input
                                                                                                    readOnly={this.state.jenis === "4" ? true : localStorage.getItem(`${isReadonly}`) === "true"}
                                                                                                    type="text"
                                                                                                    placeholder="PPN"
                                                                                                    className="form-control"
                                                                                                    name={ppnName}
                                                                                                    value={ppn}
                                                                                                    onChange={(e) => this.onHandleChangeChildSku(e, i, x, satuan)}
                                                                                                />
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
                                <div className="col-md-12">
                                    <div className="form-group" style={{ textAlign: "right" }}>
                                        <button type="button" className="btn btn-warning mb-2 mr-2" onClick={this.toggle}>
                                            <i className="ti-close" /> Batal
                                        </button>
                                        {this.props.allState === undefined ? (
                                            <button type="submit" className="btn btn-primary mb-2 mr-2">
                                                <i className="ti-save" /> Simpan
                                            </button>
                                        ) : (
                                            <button type="submit" className="btn btn-primary mb-2 mr-2">
                                                <i className="ti-save" /> Terapkan
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                    </form>
                </WrapperModal>
                <FormSupplier fastAdd={true} />
                <FormSubDepartment fastAdd={true} />
                <FormGroupProduct group2={this.props.group2} fastAdd={true} />
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

        // group:state.groupProductReducer.data
    };
};
export default connect(mapStateToProps)(FormProductPricings);
