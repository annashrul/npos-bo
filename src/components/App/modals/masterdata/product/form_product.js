import React,{Component} from "react";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalHeader } from "reactstrap";
import connect from "react-redux/es/connect/connect";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import { setProductEdit, createProduct, updateProduct } from "redux/actions/masterdata/product/product.action";
import { FetchCheck } from "redux/actions/site.action";
import axios from "axios";
import { HEADERS } from "redux/actions/_constants";
import moment from "moment";
import {
    getMargin, handleDataSelect, handleError, rmComma, select2Group, setFocus,
    toCurrency
} from "../../../../../helper";
import { isNaN } from "lodash";
import FormGroupProduct from "../../../../../components/App/modals/masterdata/group_product/form_group_product";
import FormSupplier from "../../../../../components/App/modals/masterdata/supplier/form_supplier";
import Default from "../../../../../assets/default.png";
import { convertBase64 } from "helper";
import FormProductPricing from "./form_product_pricing";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import FormPrinter from "../printer/form_printer";
import Preloader from "Preloader";
import FormRak from "../rak/form_rak";
const tenantBool = Cookies.get("tnt=") !== undefined ? atob(atob(Cookies.get("tnt="))) === "giandy-pusat" || atob(atob(Cookies.get("tnt="))) === "giandy-cabang01" : false;

class FormProduct extends Component{
    constructor(props){
        super(props);
        this.state={
            rak_data:[],kel_brg_data:[],group1_data:[],kcp_data:[],dataHarga:[],
            barangSku: [{ barcode: "", qty: "", konversi: "", satuan_jual: "1" }],
            gambar: "-",kd_brg:'',nm_brg:"",nama_singkat:"",rak:"", tag:"", kel_brg:"", group1:"", kategori:"1", jenis:"1", kcp:"",
            display:"none",
            detail: {},
            filled: false,summary:false,swPrice:false,
            isLoadingGenerateBarcode:false,
            isModalFormGroupProduct: false,isModalFormRak: false, isModalFormSupplier: false, isModalFormPricingProduct: false,


        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.generateCode = this.generateCode.bind(this);
        this.handleSelect2 = this.handleSelect2.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handler = this.handler.bind(this);
        this.generateBrcd = this.generateBrcd.bind(this);

    }

    componentWillReceiveProps(nextProps){this.getProps(nextProps)}
    componentWillMount(){this.getProps(this.props)}
    handleFileRead = async (event) => {
        const file = event.target.files[0];
        const fileSize = event.target.files[0].size / 1024 / 1024; // in MiB
        if (fileSize > 2) {
            Swal.fire("Error", "Ukuran gambar yang diperbolehkan harus dibawah 2MB!!");
        } else {
            const base64 = await convertBase64(file);
            this.setState({ gambar: base64 });
        }
    };
    handleMouseEnter(){
        this.setState({ display: "flex"});
    }
    handleMouseLeave(){
        this.setState({ display:"none" });
    }
    toggle = (e) => {
        e.preventDefault();
        this.props.dispatch(ModalToggle(false));
    };
    toggleModal(e, param) {
        e.preventDefault();
        this.setState({
            detail: { kel_brg: "", id: "" },
            filled: true,
            isModalFormGroupProduct: true,
            isModalFormSupplier: true,
            isModalFormRak: true,
        });
        this.props.dispatch(ModalType(param));

    }
    handler(value) {
        this.setState({
            barangHarga: value.barangHarga_,
            barangSku: value.barangSku_,
            summary: true,
            swPrice: "0",
        });
    }
    async fetchData(data) {
        const url = HEADERS.URL + `site/cekdata`;
        // const headers = {
        //     Authorization: atob(Cookies.get("datum_exp")),
        //     username: atob(Cookies.get("tnt=")),
        //     password: HEADERS.PASSWORD,
        //     "Content-Type": `application/json`,
        // };
        // const requestOptions = {
        //     method: "POST",
        //     headers: headers,
        //     body: data,
        // };
        return await axios
            .post(url, data)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                if (error.response) {
                }
            });
    }



    checkData(event, i) {
        event.preventDefault();
        let val = event.target.value;
        let barangSku=this.state.barangSku;
        let resultArray=barangSku.filter((item) =>item["barcode"] === val);
        if(resultArray.length>1){
            handleError(`terjadi duplikasi pada barcode ${barangSku[i].qty}`,"");
            barangSku[i]["barcode"]="0";
        }
        const data = this.fetchData({table: "barang_sku",kolom: "barcode",value: val});
        data.then((res) => {
            if(res.result===1){
                handleError(`barcode ${barangSku[i].qty} sudah digunakan`,"");
                barangSku[i]["barcode"]="0";
            }
        });
        this.setState({barangSku})
    }
    handleDataSku(value,brcd){
        let barcode=brcd,satuan ="",barangSku=[],state=this.state;
        let index = value==="0"?3:(value==="2"?2:1);
        console.log(value,brcd);
        for(let i=0;i<index;i++){
            if(value==="0") satuan = i === 0 ? "Pcs" : (i === 1 ? "Pack" : "Karton");
            if(i>0){
                let x=i+1;
                barcode=`${brcd}0${x++}`;
            }
            barangSku.push({barcode: barcode,qty: satuan,konversi: "0",satuan_jual: "1"});
        }
        this.setState({barangSku:barangSku});
    }
    handleChange(event, i, mtd) {
        let column      = event.target.name;
        let value       = event.target.value;
        let state       = this.state;
        let isNominal   = column.includes("nominal");
        let isMargin    = column.includes("margin");
        const valHrgBeli= parseInt(rmComma(state.hrg_beli), 10);
        if(column==='kategori'||column==="swPrice"){
            value=value==="1"?"0":"1";
            column==="swPrice" && this.setState({summary: value === "1"})
        }
        if (column === "jenis") {
            this.handleDataSku(value,state.kd_brg);
        }
        if (i !== null&&column==="barcode") {
            let barangSku = [...state.barangSku];
            barangSku[i] = {...barangSku[i],[column]: !tenantBool && column === "barcode" ? String(value).replace(/[^a-z0-9]/gi, "") : value,};
            this.setState({ barangSku });
        }
        if(isNominal){
            let inputNominal=parseInt(rmComma(value), 10);
            state.dataHarga[i][`nominal${i+1}`]=inputNominal;
            state.dataHarga[i][`margin${i+1}`] = getMargin(inputNominal,valHrgBeli,"margin");
        }
        if(isMargin){
            let inputMargin=parseInt(rmComma(value), 10);
            this.state.dataHarga[i][`margin${i+1}`]=inputMargin;
            this.state.dataHarga[i][`nominal${i+1}`] = getMargin(inputMargin,valHrgBeli,"nominal");
        }
        this.setState({[column]:value});
    }
    generateCode(e, action = "add") {
        if (e === "generate") {
            let genCode = `${moment(new Date()).format("YYMMDD")}${Math.floor(Math.random() * (10000 - 0 + 1)) + 0}`;
            let kdBrg="";
            if (action === "add") {
                kdBrg=genCode;
                this.props.dispatch(FetchCheck({table: "barang",kolom: "kd_brg",value: genCode}));
            }
            this.setState({ kd_brg: kdBrg });
        }
    }
    genBrcd(val) {
        this.setState({ isLoadingGenerateBarcode: true });
        if (!tenantBool) {
            const data = this.fetchData({
                kolom: "barcode",
                table: "barang_sku",
                value: val,
            });
            data.then((res) => {
                this.setState({ isLoadingGenerateBarcode: false });
                if(res.result===1){
                    Swal.fire("Informasi", "Barcode " + val + " sudah digunakan!");
                    return 0;
                }
                else{
                    this.handleDataSku(this.state.jenis,val);
                }
            });

        } else {
            this.setState({ isLoadingGenerateBarcode: false });
            return val;
        }
    }
    async generateBrcd(e, idx) {
        let state=this.state;
        if (e === "generate") {
            let genCode = "";
            if(state.kd_brg!==""){
                await this.genBrcd(state.kd_brg);
            }

        }
        else {
            if (idx !== null) {
                let barangSku = [...state.barangSku];
                barangSku[idx] = {...barangSku[idx],["barcode"]: ""};
                this.setState({ barangSku });
            }
        }
    }
    handleSelect2(col,val){
        this.setState({[col]:val});
    }
    handleSubmit=(e)=>{
        e.preventDefault();
    };
    getProps(props){
        let propsUser=props.auth.user;
        let hrg=propsUser.nama_harga;
        hrg.map((val,key)=>Object.assign(val,{[`nominal${key+1}`]:0,[`margin${key+1}`]:0}));
        if (props.dataEdit !== undefined && props.dataEdit !== []){
            let data=props.dataEdit;
            let barangSku=[];
            let barang_sku = typeof data.barang_sku === "object" ? data.barang_sku : this.state.barangSku;

            for (let i = 0; i < barang_sku.length; i++) {
                barangSku.push({
                    barcode: barang_sku[i].barcode,
                    qty: barang_sku[i].satuan,
                    konversi: barang_sku[i].qty_konversi,
                    satuan_jual: barang_sku[i].satuan_jual,
                });
            }
            this.setState({
                kd_brg: data.kd_brg,
                nm_brg: data.nm_brg,
                kel_brg: data.kel_brg,
                nama_singkat: data.nama_singkat,
                tag: data.tag,
                rak: data.id_rak,
                jenis: data.kategori,
                stock_min: data.stock_min,
                group1: data.group1,
                group2: data.group2,
                deskripsi: data.deskripsi,
                gambar: "-",
                kategori: data.jenis,
                kcp: data.kcp,
                poin: data.poin,
                online: data.online,
                berat: data.berat,
                barangSku: barangSku,
                // barangHarga: barangHrg,
                swPrice: "0",
            });
        }
        if (props.data.data !== undefined) {
            if (typeof props.data.data === "object") this.setState({kel_brg_data:  handleDataSelect(props.data.data,"kel_brg","nm_kel_brg")});
        }
        if (props.dataSupplier !== undefined) {
            this.setState({group1_data: handleDataSelect(props.dataSupplier,"kode","nama")});
        }
        if (props.dataPrinter !== undefined) {
            this.setState({kcp_data: handleDataSelect(props.dataPrinter,"id_printer","nama")});
        }
        if (props.dataSubDept.data !== undefined) {
            if (typeof props.dataSubDept.data === "object") this.setState({group2_data:  handleDataSelect(props.dataSubDept.data,"kode","nama")});
        }
        if (props.rak.data !== undefined) {
            if (typeof props.rak.data === "object") this.setState({rak_data:  handleDataSelect(props.rak.data,"id","title")});
        }
        this.setState({dataHarga:hrg});

    }


    render(){
        return(
            <div>
                <WrapperModal isOpen={this.props.isOpen && this.props.type === "formProduct"} size={this.props.auth.user.is_resto !== 1 ? "lg" : "xl"}>
                    {this.state.isLoadingGenerateBarcode && <Preloader />}
                    <ModalHeader toggle={this.toggle}>{this.props.dataEdit === undefined ? "Tambah Barang" : "Ubah Barang"}</ModalHeader>
                    <form onSubmit={this.handleSubmit}>
                        <ModalBody>
                            <div className="row d-flex box-margin">
                                <div className="col-md-5">
                                    <div
                                        className="border border-1 h-100 d-flex justify-content-center align-items-end"
                                        onMouseEnter={this.handleMouseEnter}
                                        onMouseLeave={this.handleMouseLeave}
                                        style={{backgroundImage: `url('${this.state.gambar}'),url('${this.state.gambar === "-" ? Default : this.state.gambar}')`, backgroundPosition: "center",backgroundRepeat: "no-repeat",backgroundSize: "cover",}}
                                    >
                                        <label
                                            className="w-100 h-100 bg-light m-0 p-0 align-items-center justify-content-center"
                                            style={{display: this.state.display,cursor: "pointer",opacity: "0.7"}}
                                            htmlFor="fileUpload"
                                        >
                                            <p className="text-center">
                                                <i className="fa fa-cloud-upload font-40" /><br />
                                                Unggah Gambar
                                            </p>
                                        </label>
                                    </div>
                                    <input hidden id="fileUpload" type="file" accept="image/*" onChange={(e) => this.handleFileRead(e)} />
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
                                                        this.props.dataEdit === undefined && this.handleChange(e, null);
                                                    }}
                                                    onBlur={(e) => this.props.dataEdit === undefined && this.handleChange(e, null, "onBlur")}
                                                />
                                                <div className="input-group-append">
                                                    {this.props.dataEdit === undefined ? (
                                                        this.state.kd_brg === "" ? (
                                                            <button className="btn btn-primary" name="generate" type="button" onClick={(e) => this.generateCode("generate")}>
                                                                <i onClick={(e) => this.generateCode("generate")} className="fa fa-refresh" />
                                                            </button>
                                                        ) : (
                                                            <button name="generate" className="btn btn-danger" type="button" onClick={(e) => this.generateCode("generate", "delete")}>
                                                                <i onClick={(e) => this.generateCode("generate", "delete")} className="fa fa-close" />
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
                                        {document.getElementById("tambahan_barang").value.search(atob(atob(Cookies.get("tnt=")))) >= 0 ? (
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
                                        ) : (
                                            ""
                                        )}
                                        {document.getElementById("tambahan_barang").value.search(atob(atob(Cookies.get("tnt=")))) >= 0 ? (
                                            <div className="row">
                                                <div className="col-md-7">
                                                    <div className="form-group">
                                                        {select2Group(
                                                            this.state.rak_data.find((op) => {
                                                                return op.value === this.state.rak;
                                                            }),
                                                            (any, action) => this.handleSelect2(any, "rak"),
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
                                        )}

                                        <div className="form-group">
                                            {select2Group(
                                                this.state.kel_brg_data.find((op) => {return op.value === this.state.kel_brg;}),
                                                (any, action) => this.handleSelect2(any, "kel_brg"),
                                                this.state.kel_brg_data,
                                                (e) => this.toggleModal(e, "formGroupProduct"),
                                                "kelompok barang"
                                            )}
                                        </div>
                                        <div className="form-group">
                                            {select2Group(
                                                this.state.group1_data.find((op) => {return op.value === this.state.group1;}),
                                                (any, action) => this.handleSelect2(any, "group1"),
                                                this.state.group1_data,
                                                (e) => this.toggleModal(e, "formSupplier"),
                                                "supplier"
                                            )}
                                        </div>

                                        <div className="row no-gutters">
                                            <div className="col-md-4">
                                                <div className="new-checkbox">
                                                    <label>Jenis Barang</label>
                                                    <div className="d-flex align-items-center">
                                                        <label className="switch mr-2">
                                                            <input type="checkbox" name="kategori" defaultChecked={this.state.kategori === "1"} value={this.state.kategori} onChange={(e)=>this.handleChange(e,null)} />
                                                            <span className="slider round"/>
                                                        </label>
                                                        <label>{this.state.kategori === "1" ? "Dijual" : "Tidak dijual"}</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-7 offset-md-1">
                                                <div className="form-group">
                                                    <label>Kategori Barang</label>
                                                    <select name="jenis" id="jenis" className="form-control form-control-lg" value={this.state.jenis} onChange={(e) => this.handleChange(e, null)}>
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
                                        {this.props.auth.user.is_resto === 1 && this.state.jenis === "5" && (
                                            <div className="form-group">
                                                {select2Group(
                                                    this.state.kcp_data.find((op) => {return op.value === this.state.kcp;}),
                                                    (any, action) => this.handleSelect2(any, "kcp"),
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
                                            <th style={{display: this.state.jenis === "2" || this.state.jenis === "0" ? "" : "none",whiteSpace: "no-wrap"}}>
                                                Konversi Qty
                                            </th>
                                            <th style={{display: this.state.jenis === "2" || this.state.jenis === "0" ? "" : "none",whiteSpace: "no-wrap"}}>
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
                                                                    id={`${x === 0 ? "barcode1" : x === 1 ? "barcode2" : "barcode3"}`}
                                                                    maxLength={20}
                                                                    value={this.state.barangSku[x].barcode}
                                                                    onChange={(e) => this.handleChange(e, x)}
                                                                    onBlur={(e) => this.checkData(e, x)}
                                                                />
                                                                <div
                                                                    className="input-group-append pointer"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        this.generateBrcd(this.state.barangSku[x].barcode === "" ? "generate" : "", x);
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
                                                            <input type="text" placeholder="ex. PCS" className="form-control" name="qty" value={this.state.barangSku[x].qty} onChange={(e) => this.handleChange(e, x)} />
                                                        </td>
                                                        <td style={{display: this.state.jenis === "2" || this.state.jenis === "0" ? "" : "none"}}>
                                                            <input
                                                                readOnly={x === 0}
                                                                type="text"
                                                                className="form-control"
                                                                name="konversi"
                                                                value={this.state.barangSku[x].konversi}
                                                                onChange={(e) => this.handleChange(e, x)}
                                                            />
                                                        </td>
                                                        <td style={{display: this.state.jenis === "2" || this.state.jenis === "0" ? "" : "none"}}>
                                                            <select name="satuan_jual" id="satuan_jual" className="form-control" value={this.state.barangSku[x].satuan_jual} onChange={(e) => this.handleChange(e, x)}>
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
                                                <label className="mb-0">{this.props.dataEdit === undefined ? "Set" : "Ubah"} Harga Semua Lokasi</label>
                                                <label className="switch ml-2 mb-0">
                                                    <input type="checkbox" name="swPrice" defaultChecked={this.state.swPrice === "1"} value={this.state.swPrice} onChange={(e)=>this.handleChange(e,null)} />
                                                    <span className="slider round"/>
                                                </label>
                                            </div>
                                        </div>
                                        {this.props.dataEdit === undefined ? (
                                            <button type="button" className="btn btn-info" onClick={(e) => this.toggleModal(e, "formProductPricing")}>
                                                <i className="fa fa-pencil" /> Atur {this.state.summary ? "kembali" : ""} harga per lokasi
                                            </button>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-12" style={{display: this.state.swPrice === "1" ? "block" : "none"}}>
                                    <hr className="mt-2" />
                                    <div className="row">
                                        {/*ATUR SEMUA*/}
                                        {/*DIDIEU*/}
                                        {(() => {
                                            let container = [];
                                            for (let i = 0; i < this.state.barangSku.length; i++) {
                                                let stateHargaBeli = i === 0 ? "hrg_beli" : i === 1 ? "hrg_beli_pack" : "hrg_beli_karton";
                                                let stateService = i === 0 ? "service" : i === 1 ? "service_pack" : "service_karton";
                                                let statePpn = i === 0 ? "ppn" : i === 1 ? "ppn_pack" : "ppn_karton";
                                                let satuan = i === 0 ? "Pcs" : i === 1 ? "Pack" : "Karton";
                                                container.push(
                                                    <div className="col-md-12" key={i}>
                                                        <div className="card">
                                                            <div className="card-header"><h5>SETTING HARGA {satuan.toUpperCase()}</h5></div>
                                                            <div className="card-body">
                                                                <div className="row">
                                                                    <div className={this.props.auth.user.is_resto !== 1 ? "col-md-12" : "col-md-8"}>
                                                                        <div className="row">
                                                                            <div className="col-md-4">
                                                                                <div className="form-group">
                                                                                    <label>Harga Beli</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        placeholder={`Harga Beli`}
                                                                                        className={`form-control`}
                                                                                        name={stateHargaBeli}
                                                                                        value={toCurrency(this.state[stateHargaBeli])}
                                                                                        onChange={(e) => this.handleChangeMore(e, i, satuan.toUpperCase())}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            {(() => {
                                                                                let wrapperCol = [];
                                                                                let dataCol=[{"label":"Margin","value":"margin"},{"label":"Harga Jual","value":"nominal"}];
                                                                                for (let i = 0; i < dataCol.length; i++) {
                                                                                    wrapperCol.push(
                                                                                        <div className="col-md-4" key={i}>
                                                                                            {(() => {
                                                                                                let containers = [];
                                                                                                for (let z = 0; z < this.state.dataHarga.length; z++) {
                                                                                                    let valHarga=this.state.dataHarga[z];
                                                                                                    containers.push(
                                                                                                        <div className="form-group" key={z}>
                                                                                                            <label>
                                                                                                                {dataCol[i]["label"]} {valHarga[`harga${z+1}`]}
                                                                                                            </label>
                                                                                                            <div className="input-group">
                                                                                                                <input
                                                                                                                    readOnly={this.state.jenis === "4"}
                                                                                                                    type="text"
                                                                                                                    placeholder={`${dataCol[i]["label"]} ${valHarga[`harga${z+1}`]}`}
                                                                                                                    className="form-control"
                                                                                                                    name={[`${dataCol[i]['value']}${z+1}`]}
                                                                                                                    value={isNaN(valHarga[`${dataCol[i]['value']}${z+1}`])?0:valHarga[`margin${z+1}`]}
                                                                                                                    onChange={(e) => this.handleChange(e, z, satuan.toUpperCase())}
                                                                                                                />
                                                                                                                <div className="input-group-append">
                                                                                                                    <span className="input-group-text">%</span>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    );
                                                                                                }
                                                                                                return containers;
                                                                                            })()}
                                                                                        </div>
                                                                                    );
                                                                                }
                                                                                return wrapperCol;
                                                                            })()}

                                                                        </div>
                                                                    </div>
                                                                    {/*service,ppn,stock min,stock max */}
                                                                    <div className={this.props.auth.user.is_resto !== 1 ? "d-none" : "col-md-4"}>
                                                                        <div className="row">
                                                                            <div className="col-md-6">
                                                                                <div className="form-group">
                                                                                    <label>Service</label>
                                                                                    <div className="input-group">
                                                                                        <input
                                                                                            readOnly={this.state.jenis === "4"}
                                                                                            type="text"
                                                                                            placeholder={`service`}
                                                                                            className="form-control"
                                                                                            name={stateService}
                                                                                            value={this.state[stateService]}
                                                                                            onChange={(e) => this.handleChangeMore(e, i, satuan.toUpperCase())}
                                                                                        />
                                                                                        <div className="input-group-append">
                                                                                            <span className="input-group-text">%</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-6">
                                                                                <div className="form-group">
                                                                                    <label>PPN</label>
                                                                                    <div className="input-group">
                                                                                        <input
                                                                                            readOnly={this.state.jenis === "4"}
                                                                                            type="text"
                                                                                            placeholder={`ppn`}
                                                                                            className="form-control"
                                                                                            name={statePpn}
                                                                                            value={this.state[statePpn]}
                                                                                            onChange={(e) => this.handleChangeMore(e, i, satuan.toUpperCase())}
                                                                                        />
                                                                                        <div className="input-group-append">
                                                                                            <span className="input-group-text">%</span>
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
                                            <i>Note : </i>Harga untuk setiap lokasi otomatis akan sama dengan yang telah di input pada kolom-kolom tersebut.
                                        </strong>
                                    </div>
                                </div>


                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="mt-2" style={{ textAlign: "right" }}>
                                        <button type="button" className="btn btn-warning mr-2" onClick={this.toggle}>
                                            <i className="ti-close" /> Batal
                                        </button>

                                        {this.state.swPrice === "1" ? (
                                            <button type="submit" className="btn btn-primary mr-1">
                                                <i className="ti-save" /> Simpan
                                            </button>
                                        ) : (
                                            <button type="submit" className="btn btn-primary mr-1" disabled={this.props.dataEdit === undefined && this.state.summary === false}>
                                                <i className="ti-save" /> Simpan
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                    </form>
                </WrapperModal>
                {this.state.isModalFormRak&&this.props.isOpen?<FormRak fastAdd={true} detail={this.state.detail} />:null}
                {this.state.isModalFormSupplier&&this.props.isOpen?<FormSupplier fastAdd={true} detail={this.state.detail} />:null}
                {this.state.isModalFormGroupProduct && this.props.isOpen ? <FormGroupProduct detail={this.state.detail} group2={this.props.group2} fastAdd={true} /> : null}
                {this.state.isModalFormSupplier&&this.props.isOpen?<FormProductPricing
                    allState={this.state}
                    handler={this.handler}
                    data={this.props.data}
                    dataLocation={this.props.dataLocation}
                    dataSupplier={this.props.dataSupplier}
                    dataSubDept={this.props.dataSubDept}
                    dataEdit={this.props.dataEdit}
                    productCode={this.props.productCode}
                />:null}
                {this.props.auth.user.is_resto === 1 && <FormPrinter detail={{ id_printer: "" }} fastAdd={true} />}
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
    };
};

export default connect(mapStateToProps)(FormProduct);
