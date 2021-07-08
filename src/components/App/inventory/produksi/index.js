import React, { Component } from "react";
import { get, update, destroy, del } from "components/model/app.model";
import connect from "react-redux/es/connect/connect";
import Layout from "../../Layout";
import Swal from "sweetalert2";
import { storeProduksi, FetchCodeProduksi, FetchBrgProduksiPaket } from "redux/actions/inventory/produksi.action";
import StickyBox from "react-sticky-box";
import FormPaket from "../../modals/masterdata/paket/form_paket";
import {
  btnSave,
  btnSCancel,
  CURRENT_DATE,
  getStorage,
  handleError,
  isEmptyOrUndefined,
  noData,
  rmComma,
  rmStorage,
  setStorage,
  swallOption,
  swalWithCallback,
  toCurrency,
  toDate,
} from "../../../../helper";
import LokasiCommon from "../../common/LokasiCommon";
import ProductCommon from "../../common/ProductCommon";
import SelectCommon from "../../common/SelectCommon";
import TableCommon from "../../common/TableCommon";
import { actionDataCommon, getDataCommon, handleInputOnBlurCommon } from "../../common/FlowTrxCommon";
import { readProductTrx } from "../../../../redux/actions/masterdata/product/product.action";

const tglStorage = "tglTrxProduction";
const locationStorage = "locationTrxProduction";
const paketStorage = "paketTrxProduction";
const qtyEstimasiStorage = "qtyEstimasiTrxProduction";
const catatanStorage = "catatanTrxProduction";

const table = "production";
class Production extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataPaket: [],
      paket: "",
      databrg: [],
      brgval: [],
      location: "",
      tgl_order: CURRENT_DATE,
      qty_estimasi: "1",
      catatan: "",
    };
    this.HandleRemove = this.HandleRemove.bind(this);
    this.HandleReset = this.HandleReset.bind(this);
    this.HandleOnChange = this.HandleOnChange.bind(this);
    this.HandleOnBlur = this.HandleOnBlur.bind(this);
    this.HandleChangeSelect = this.HandleChangeSelect.bind(this);
    this.HandleFocusInputReset = this.HandleFocusInputReset.bind(this);
    this.HandleSubmit = this.HandleSubmit.bind(this);
  }

  getProps(param) {
    if (param.barangPaket.length > 0) {
      let brg = [];
      if (typeof param.barangPaket === "object") {
        param.barangPaket.map((v) => {
          brg.push({
            value: `${v.kd_brg} | ${v.barcode} | ${v.nm_brg}`,
            label: v.nm_brg,
          });
          return null;
        });
      }
      this.setState({
        dataPaket: brg,
      });
    }
  }
  componentWillReceiveProps = (nextProps) => {
    this.getProps(nextProps);
  };
  handleClear() {
    destroy(table);
    rmStorage(qtyEstimasiStorage);
    rmStorage(catatanStorage);
    this.setState({ qty_estimasi: "", catatan: "-" });
  }
  componentWillUnmount() {
    this.handleClear();
  }
  componentDidMount() {
    this.handleFetch();
  }
  componentWillMount() {
    this.handleFetch();
    this.getProps(this.props);
  }

  handleFetch() {
    let getTgl = getStorage(tglStorage);
    let getLocation = getStorage(locationStorage);
    let getPaket = getStorage(paketStorage);
    let getQtyEstimasi = getStorage(qtyEstimasiStorage);
    let getCatatan = getStorage(catatanStorage);
    if (isEmptyOrUndefined(getTgl)) {
      this.setState({ tgl_order: getTgl });
    }
    if (isEmptyOrUndefined(getPaket)) {
      this.setState({ paket: getPaket });
    }
    if (isEmptyOrUndefined(getQtyEstimasi)) {
      this.setState({ qty_estimasi: getQtyEstimasi });
    }
    if (isEmptyOrUndefined(getCatatan)) {
      this.setState({ catatan: getCatatan });
    }
    if (isEmptyOrUndefined(getLocation)) {
      this.setState({ location: getLocation });
      this.props.dispatch(FetchCodeProduksi(getLocation));
      this.props.dispatch(readProductTrx(`page=1&kategori=4&lokasi=${getLocation}`));
      this.props.dispatch(FetchBrgProduksiPaket(1, "", "", getLocation));
      getDataCommon(table, (res, brg) => {
        this.setState({ databrg: res, brgval: brg });
      });
    }
  }

  HandleChangeSelect(res, param) {
    let val = res.value;
    let setState = {};
    if (param === "paket") {
      setStorage(paketStorage, val);
      setState = { paket: val };
    } else {
      destroy(table);
      setStorage(locationStorage, val);
      setState = { location: val };
      this.handleFetch();
    }
    this.setState(setState);
  }

  getData() {
    getDataCommon(table, (res, brg) => {
      this.setState({ databrg: res, brgval: brg });
    });
  }

  HandleRemove(e, id) {
    e.preventDefault();
    swalWithCallback("anda yakin akan menghapus data ini ?", () => {
      del(table, id);
      this.getData();
      Swal.fire("Deleted!", "Your data has been deleted.", "success");
    });
  }
  HandleReset(e) {
    e.preventDefault();
    swalWithCallback("anda yakin akan mereset barang barang ini ?", () => {
      this.handleClear();
      this.getData();
    });
  }
  handleGetDataObject(column, val, i) {
    let brgval = [...this.state.brgval];
    brgval[i] = { ...brgval[i], [column]: val };
    this.setState({ brgval });
  }
  HandleOnChange(e, i = null) {
    const column = e.target.name;
    const val = e.target.value;
    if (i === null) {
      if (column === "tgl_order") setStorage(tglStorage, val);
      if (column === "catatan") setStorage(catatanStorage, val);
      if (column === "qty_estimasi") setStorage(qtyEstimasiStorage, val);
      this.setState({ [column]: val });
    } else {
      this.handleGetDataObject(column, rmComma(val), i);
    }
  }
  HandleOnBlur(e, i) {
    if (e.target.name === "qty") {
      let val = parseInt(e.target.value, 10);
      if (isNaN(val) || val < 1) {
        Object.assign(this.state.brgval[i], { qty: 1 });
        actionDataCommon(table, this.state.brgval[i], (res) => {
          if (res !== undefined) {
            update(table, this.state.brgval[i]);
          }
          this.getData();
        });
        return;
      }
    }
    handleInputOnBlurCommon(e, { id: this.state.brgval[i].barcode, table: table, where: "barcode" }, () => {
      getDataCommon(table, (res, brg) => {
        this.setState({ databrg: res, brgval: brg });
      });
    });
  }
  HandleFocusInputReset(e, i) {
    let col = e.target.name;
    let val = e.target.value;
    if (col === "qty") {
      val = parseInt(val);
      if (val < 2) {
        this.handleGetDataObject(col, "", i);
      }
    }
  }

  HandleSubmit(e) {
    e.preventDefault();
    let { location, brgval, paket, qty_estimasi, catatan } = this.state;
    if (!isEmptyOrUndefined(location)) {
      handleError("lokasi");
      return;
    }
    if (!isEmptyOrUndefined(paket)) {
      handleError("paket");
      return;
    }
    if (!isEmptyOrUndefined(qty_estimasi) || parseInt(qty_estimasi, 10) < 1) {
      handleError("Qty estimasi");
      return;
    }
    if (brgval.length < 1) {
      handleError("barang");
      return;
    }
    this.HandleSave();
  }

  HandleSave() {
    let { location, brgval, paket, qty_estimasi, catatan } = this.state;
    let props = this.props;
    swallOption("Pastikan data yang anda masukan sudah benar!", async () => {
      let detail = [];
      let exp = paket.split("|", 2);
      let data = {};
      data["brcd_hasil"] = exp[1].trim();
      data["kd_brg_hasil"] = exp[0].trim();
      data["userid"] = props.auth.user.id;
      data["tanggal"] = toDate(this.state.tgl_order, "-");
      data["lokasi"] = location;
      data["keterangan"] = isEmptyOrUndefined(catatan) ? catatan : "-";
      data["qty_estimasi"] = qty_estimasi;
      const geTable = get(table);
      geTable.then((res) => {
        res.map((item) => {
          detail.push({
            kd_brg: item.kd_brg,
            barcode: item.barcode,
            satuan: item.satuan,
            qty: item.qty,
            harga_beli: item.harga_beli,
          });
          return null;
        });
        data["detail"] = detail;
        for (let x = 0; x < res.length; x++) {
          if (parseFloat(res[x].qty) > parseFloat(res[x].stock)) {
            swallOption("ada qty yang melebihi stok. Anda yakin akan melanjutkan transaksi ini ??", () => {
              props.dispatch(
                storeProduksi(data, () => {
                  this.handleClear();
                  this.getData();
                  props.dispatch(FetchCodeProduksi(this.state.location));
                })
              );
            });
          } else {
            props.dispatch(
              storeProduksi(data, () => {
                this.handleClear();
                this.getData();
                props.dispatch(FetchCodeProduksi(this.state.location));
              })
            );
            break;
          }
        }
      });
    });
  }

  render() {
    let totHargaBeli = 0;
    const head = [{ label: "Bahan" }, { label: "Harga beli" }, { label: "Stok" }, { label: "Qty" }, { label: "#", className: "text-center", width: "1%" }];
    return (
      <Layout page="Produksi">
        <div className="card">
          <div className="card-header d-flex justify-content-between">
            <h4>Produksi #{this.props.nota}</h4>
            <div>
              <button className="btn btn-primary mr-1" disabled={this.state.databrg.length < 1} onClick={this.HandleSubmit}>
                Simpan
              </button>
              <button className="btn btn-warning" disabled={this.state.databrg.length < 1} onClick={this.HandleReset}>
                Batal
              </button>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            {/*START LEFT*/}
            <StickyBox offsetTop={100} offsetBottom={20} style={{ width: "30%", marginRight: "10px" }}>
              <div className="card">
                <div className="card-body">
                  <ProductCommon
                    location={this.state.location}
                    category="4"
                    loading={this.props.isLoading}
                    table={table}
                    callbackGetData={(res, brg) => {
                      this.setState({
                        databrg: res,
                        brgval: brg,
                      });
                    }}
                    callbackSetFocus={(res) => {
                      setTimeout(() => this && this[`qty-${btoa(res.barcode)}`].focus(), 500);
                    }}
                  />
                </div>
              </div>
            </StickyBox>
            {/*END LEFT*/}
            {/*START RIGHT*/}
            <div style={{ width: "70%" }}>
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4">
                      <LokasiCommon callback={(val) => this.HandleChangeSelect(val, "lokasi")} dataEdit={this.state.location} isRequired={true} />
                    </div>
                    <div className="col-md-4">
                      <SelectCommon label="paket" options={this.state.dataPaket} callback={(res) => this.HandleChangeSelect(res, "paket")} dataEdit={this.state.paket} isRequired={true} />
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>
                          Qty Estimasi <span className="text-danger">*</span>
                        </label>
                        <input type="text" name="qty_estimasi" className="form-control" value={this.state.qty_estimasi} onChange={(e) => this.HandleOnChange(e, null)} />
                      </div>
                    </div>
                  </div>
                  <TableCommon
                    head={head}
                    renderRow={
                      this.state.databrg.length > 0
                        ? this.state.databrg.map((item, index) => {
                            totHargaBeli += parseInt(item.harga_beli, 10) * parseInt(item.qty, 10);
                            return (
                              <tr key={index}>
                                <td className="middle nowrap">
                                  {item.nm_brg} <br />
                                  <div className="subtitle">
                                    {item.kd_brg} ( {item.satuan} )
                                  </div>
                                </td>
                                <td className="middle nowrap">
                                  <input disabled={true} type="text" name="harga_beli" value={toCurrency(parseInt(item.harga_beli, 10))} className="form-control in-table text-right" />
                                </td>
                                <td className="middle nowrap">
                                  <input disabled={true} type="text" name="stock" value={toCurrency(parseInt(item.stock, 10))} className="form-control in-table text-right" />
                                </td>
                                <td className="middle nowrap">
                                  <input
                                    type="text"
                                    name="qty"
                                    ref={(input) => (this[`qty-${btoa(item.barcode)}`] = input)}
                                    onFocus={(e) => this.HandleFocusInputReset(e, index)}
                                    onBlur={(e) => this.HandleOnBlur(e, index)}
                                    onChange={(e) => this.HandleOnChange(e, index)}
                                    value={toCurrency(this.state.brgval[index].qty)}
                                    className="form-control in-table text-right"
                                  />
                                </td>
                                <td className="middle nowrap">
                                  <button className="btn btn-primary btn-sm" onClick={(e) => this.HandleRemove(e, item.id)}>
                                    <i className="fa fa-trash" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        : noData(head.length)
                    }
                  />
                </div>
                <div className="card-header d-flex justify-content-between">
                  <input type="date" name="tgl_order" className="form-control  nbt nbl nbr bt" value={this.state.tgl_order} onChange={(e) => this.HandleOnChange(e, null)} />

                  <input
                    type="text"
                    name="catatan"
                    className="form-control nbt nbl nbr bt"
                    placeholder="Tambahkan catatan disini ...."
                    value={this.state.catatan}
                    onChange={(e) => this.HandleOnChange(e, null)}
                  />
                </div>
              </div>
            </div>
            {/*END RIGHT*/}
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStateToPropsCreateItem = (state) => ({
  auth: state.auth,
  isOpen: state.modalReducer,
  type: state.modalTypeReducer,
  dataTrx: state.productReducer.dataTrx,
  barangPaket: state.produksiReducer.dataPaket,
  nota: state.produksiReducer.code,
});

export default connect(mapStateToPropsCreateItem)(Production);
