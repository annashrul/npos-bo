import React, { Component } from "react";
import { get, update, destroy, del } from "components/model/app.model";
import connect from "react-redux/es/connect/connect";
import { storeProduksi, FetchCodeProduksi, FetchBrgProduksiPaket } from "redux/actions/inventory/produksi.action";
import {
  CURRENT_DATE,
  float,
  getStorage,
  handleError,
  isEmptyOrUndefined,
  noData,
  rmComma,
  rmStorage,
  setFocus,
  setStorage,
  swallOption,
  swalWithCallback,
  toCurrency,
  toDate,
} from "../../../../helper";
import LokasiCommon from "../../common/LokasiCommon";
import SelectCommon from "../../common/SelectCommon";
import TableCommon from "../../common/TableCommon";
import ButtonTrxCommon from "../../common/ButtonTrxCommon";
import { actionDataCommon, getDataCommon, handleInputOnBlurCommon } from "../../common/FlowTrxCommon";
import { readProductTrx } from "../../../../redux/actions/masterdata/product/product.action";
import TransaksiWrapper from "../../common/TransaksiWrapper";

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
      toggleSide: false,
      searchby: "kd_brg",
      search: "",
      perpage: 5,
    };
    this.HandleRemove = this.HandleRemove.bind(this);
    this.HandleOnChange = this.HandleOnChange.bind(this);
    this.HandleOnBlur = this.HandleOnBlur.bind(this);
    this.HandleChangeSelect = this.HandleChangeSelect.bind(this);
    this.HandleFocusInputReset = this.HandleFocusInputReset.bind(this);
    this.HandleSubmit = this.HandleSubmit.bind(this);
    this.HandleAdd = this.HandleAdd.bind(this);
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
  componentDidMount() {
    this.handleFetch();
  }
  componentWillMount() {
    this.handleFetch();
    this.getProps(this.props);
  }
  handleGetDataObject(column, val, i) {
    let brgval = [...this.state.brgval];
    brgval[i] = { ...brgval[i], [column]: val };
    this.setState({ brgval });
  }
  getData() {
    getDataCommon(table, (res, brg) => {
      this.setState({ databrg: res, brgval: brg });
    });
  }
  handleFetch(perpage = 5, res = null) {
    let getLocation = getStorage(locationStorage);
    let getPaket = getStorage(paketStorage);
    let getQtyEstimasi = getStorage(qtyEstimasiStorage);
    if (isEmptyOrUndefined(getPaket)) this.setState({ paket: getPaket });
    if (isEmptyOrUndefined(getQtyEstimasi)) this.setState({ qty_estimasi: getQtyEstimasi });
    if (isEmptyOrUndefined(getLocation)) {
      this.setState({ location: getLocation });
      let where = `perpage=${this.state.perpage}&page=1&kategori=4&lokasi=${getLocation}`;
      if (res !== null) where += `&searchby=${res.searchby}&q=${res.search}`;
      this.props.dispatch(
        readProductTrx(where, (res) => {
          if (res !== null) this.HandleAdd(res[0]);
        })
      );
      this.getData();
      if (perpage === 5) {
        this.props.dispatch(FetchCodeProduksi(getLocation));
        this.props.dispatch(FetchBrgProduksiPaket(1, "", "", getLocation));
      }
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

  handleClear() {
    destroy(table);
    rmStorage(qtyEstimasiStorage);
    rmStorage(catatanStorage);
    this.setState({ qty_estimasi: "", catatan: "-" });
  }
  HandleRemove(e, id = null) {
    e.preventDefault();
    swalWithCallback("anda yakin akan menghapus data ini ?", () => {
      if (id !== null) del(table, id);
      else this.handleClear();
      this.getData();
    });
  }

  HandleOnChange(e, i = null) {
    const column = e.target.name;
    const val = e.target.value;
    if (i === null) {
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
          if (res !== undefined) update(table, this.state.brgval[i]);
          this.getData();
        });
        return;
      }
    }
    handleInputOnBlurCommon(e, { id: this.state.brgval[i].barcode, table: table, where: "barcode" }, () => {
      this.getData();
    });
  }
  HandleFocusInputReset(e, i) {
    let col = e.target.name;
    let val = e.target.value;
    if (col === "qty") {
      val = parseInt(val);
      if (val < 2) this.handleGetDataObject(col, "", i);
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
      setFocus(this, "qty-estimasi");
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

  HandleAdd(item) {
    Object.assign(item, { qty: 0 });
    actionDataCommon(table, item, (res) => {
      if (res !== undefined) {
        Object.assign(res, {
          id: res.id,
          qty: parseInt(res.qty, 10) + 1,
        });
        update(table, res);
        setFocus(this, `qty-${btoa(res.barcode)}`);
      } else {
        setFocus(this, `qty-${btoa(item.barcode)}`);
      }
      this.getData();
    });
  }

  render() {
    const { searchby, databrg, brgval, qty_estimasi, location, dataPaket, paket, toggleSide } = this.state;
    const head = [{ label: "Bahan" }, { label: "Harga beli" }, { label: "Stok" }, { label: "Qty" }, { label: "#", className: "text-center", width: "1%" }];
    return (
      <TransaksiWrapper
        table="production"
        pathName="Produksi"
        nota={this.props.nota}
        callbackInput={(res) => this.setState({ [res.name]: res.value })}
        callbackToggle={(res) => this.setState({ toggleSide: !toggleSide })}
        callbackFetch={(res) => {
          if (res.label === "loadmore") {
            if (this.props.dataTrx.total <= float(res.value)) {
              handleError("", "tidak ada data lagi");
              return;
            }
            this.handleFetch(res.value);
          } else {
            if (res.label === "search") {
              this.handleFetch(10, { searchby: searchby, search: res.value });
            } else {
              this.setState({ searchby: res.value });
            }
          }
        }}
        callbackAdd={(res) => this.HandleAdd(res)}
        data={this.props.dataTrx.data !== undefined && this.props.dataTrx.data.length > 0 ? this.props.dataTrx.data : []}
        renderRow={
          <div style={{ width: !toggleSide ? "70%" : "100%" }}>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <LokasiCommon callback={(val) => this.HandleChangeSelect(val, "lokasi")} dataEdit={location} isRequired={true} />
                  </div>
                  <div className="col-md-4">
                    <SelectCommon label="paket" options={dataPaket} callback={(res) => this.HandleChangeSelect(res, "paket")} dataEdit={paket} isRequired={true} />
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>
                        Qty Estimasi <span className="text-danger">*</span>
                      </label>
                      <input
                        ref={(input) => (this[`qty-estimasi`] = input)}
                        type="text"
                        name="qty_estimasi"
                        className="form-control"
                        value={qty_estimasi}
                        onChange={(e) => this.HandleOnChange(e, null)}
                      />
                    </div>
                  </div>
                </div>
                <TableCommon
                  head={head}
                  renderRow={
                    databrg.length > 0
                      ? databrg.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td className="middle nowrap">
                                {item.nm_brg}
                                <div className="subtitle subtitle-intable">
                                  {item.kd_brg} ( {item.satuan} )
                                </div>
                              </td>
                              <td className="middle nowrap">
                                <input disabled={true} type="text" name="harga_beli" value={toCurrency(parseInt(item.harga_beli, 10))} className="form-control in-table text-right" />
                              </td>
                              <td className="middle nowrap">
                                <input disabled={true} type="text" name="stock" value={toCurrency(float(item.stock))} className="form-control in-table text-right" />
                              </td>
                              <td className="middle nowrap">
                                <input
                                  type="text"
                                  name="qty"
                                  ref={(input) => (this[`qty-${btoa(item.barcode)}`] = input)}
                                  onFocus={(e) => this.HandleFocusInputReset(e, index)}
                                  onBlur={(e) => this.HandleOnBlur(e, index)}
                                  onChange={(e) => this.HandleOnChange(e, index)}
                                  value={toCurrency(brgval[index].qty)}
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
              <div className="card-header">
                <ButtonTrxCommon
                  disabled={databrg.length < 1}
                  callback={(e, res) => {
                    if (res === "simpan") this.HandleSubmit(e);
                    if (res === "batal") this.HandleRemove(e);
                  }}
                />
              </div>
            </div>
          </div>
        }
      />
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
