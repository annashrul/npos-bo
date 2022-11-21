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
import moment from "moment";
import {
  FetchCodeAdjustment,
  storeAdjusment,
} from "redux/actions/adjustment/adjustment.action";
import { withRouter } from "react-router-dom";
import {
  float,
  getStorage,
  handleError,
  isEmptyOrUndefined,
  noData,
  rmComma,
  setFocus,
  setStorage,
  swallOption,
  toCurrency,
} from "../../../../helper";
import TransaksiWrapper from "../../common/TransaksiWrapper";
import ButtonTrxCommon from "../../common/ButtonTrxCommon";
import TableCommon from "../../common/TableCommon";
import LokasiCommon from "../../common/LokasiCommon";
import {
  actionDataCommon,
  getDataCommon,
  handleInputOnBlurCommon,
} from "../../common/FlowTrxCommon";
import { readProductTrx } from "../../../../redux/actions/masterdata/product/product.action";

const table = "adjusment";
const locationStorage = "locationTrxAdjusment";
class TrxAdjustment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      databrg: [],
      brgval: [],
      location: { value: "", label: "" },
      catatan: "-",
      tgl_order: moment(new Date()).format("yyyy-MM-DD"),
      searchby: "deskripsi",
      search: "",
      toggleSide: false,
    };
    this.HandleOnBlur = this.HandleOnBlur.bind(this);
    this.HandleRemove = this.HandleRemove.bind(this);
    this.HandleOnChange = this.HandleOnChange.bind(this);
    this.HandleChangeSelect = this.HandleChangeSelect.bind(this);
    this.HandleAdd = this.HandleAdd.bind(this);
  }
  getProps(param) {
    if (param.barang.length > 0) {
      this.getData();
    }
  }
  componentDidMount() {
    this.handleFetch();
  }

  handleClear() {
    destroy(table);
  }
  handleFetch(perpage = 5, res = null) {
    let storageLocation = getStorage(locationStorage);
    if (isEmptyOrUndefined(storageLocation)) {
      let getLocation = JSON.parse(storageLocation);
      this.setState({ location: getLocation });
      let where = `perpage=${perpage}&page=1&lokasi=${getLocation.value}`;
      if (res !== null) where += `&searchby=${res.searchby}&q=${res.search}`;
      this.props.dispatch(
        readProductTrx(where, (res) => {
          if (res !== null) this.HandleAdd(res[0]);
          this.getData();
        })
      );
      this.getData();
      if (perpage === 5) {
        this.props.dispatch(FetchCodeAdjustment(getLocation.value));
      }
    }
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
  HandleChangeSelect(res, param) {
    let val = res;
    this.setState({ location: val });
    setTimeout(() => {
      destroy(table);
      setStorage(locationStorage, JSON.stringify(val));
      this.handleFetch();
    }, 300);
  }

  getSaldoStock(val, i) {
    let data = this.state.brgval[i];
    let saldo_stock = data.stock;
    if (data.status === "kurang") {
      saldo_stock = parseInt(data.stock, 10) - parseInt(rmComma(val), 10);
    }
    if (
      data.status === "tambah" ||
      data.status === "" ||
      data.status === undefined
    ) {
      saldo_stock = parseInt(data.stock, 10) + parseInt(rmComma(val), 10);
    }

    return saldo_stock;
  }

  HandleOnChange(e, i = null, other = null) {
    const column = e.target.name;
    const val = e.target.value;
    let data = this.state.brgval[i];
    if (other !== null) {
      let newData = [];
      other.map((otherVal) => {
        if (otherVal.satuan === val) {
          newData = otherVal;
        }
        return null;
      });
      Object.assign(data, {
        id: data.id,
        kd_brg: data.kd_brg,
        nm_brg: data.nm_brg,
        ukuran: data.ukuran,
        barcode: newData.barcode,
        satuan: newData.satuan,
        harga_beli: newData.harga_beli,
        hrg_jual: newData.harga,
        stock: newData.stock,
        qty: 1,
        tambahan: data.tambahan,
      });
    }
    if (column === "qty") {
      let saldo_stock = this.getSaldoStock(rmComma(val), i);
      Object.assign(data, { saldo_stock: saldo_stock, qty: rmComma(val) });
    }
    if (column === "status") {
      Object.assign(data, { status: val });
    }

    actionDataCommon(table, data, (res) => {
      if (res !== undefined) update(table, data);
      this.getData();
    });
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
    handleInputOnBlurCommon(
      e,
      { id: this.state.brgval[i].barcode, table: table, where: "barcode" },
      () => {
        this.getData();
      }
    );
  }
  HandleFocusInputReset(e, i) {
    let col = e.target.name;
    let val = e.target.value;
    if (col === "qty") {
      val = parseInt(val);
      if (val < 2) this.handleGetDataObject(col, "", i);
    }
  }
  HandleRemove(e, id = null) {
    e.preventDefault();
    swallOption("anda yakin akan menghapus data ini ?", () => {
      if (id !== null) del(table, id);
      else this.handleClear();
      this.getData();
    });
  }
  HandleAdd(item) {
    Object.assign(item, { qty: 0, status: "tambah" });
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
  HandleSubmit(e) {
    e.preventDefault();

    const data = get(table);
    data.then((res) => {
      if (res.length === 0) {
        handleError("barang");
        return;
      } else {
        swallOption("Pastikan data yang anda masukan sudah benar!", () => {
          let detail = [];
          let data = {};
          const { tgl_order, catatan, location, databrg } = this.state;
          const { nota, auth } = this.props;
          data["kd_kasir"] = auth.user.id;
          data["tgl"] = moment(tgl_order).format("yyyy-MM-DD");
          data["lokasi"] = location.value;
          data["keterangan"] = isEmptyOrUndefined(catatan) ? catatan : "-";
          for (let i = 0; i < databrg.length; i++) {
            let item = res[i];
            let qty = rmComma(item.qty);
            if (qty < 1) {
              setFocus(this, `${qty - btoa(item.barcode)}`);
              handleError("", "Qty tidak boleh kosong");
              return;
            }
            console.log(item);
            let saldo_stock = this.getSaldoStock(qty, i);
            detail.push({
              brcd_brg: item.barcode,
              status: item.status,
              qty_adjust: qty,
              stock_terakhir: item.stock,
              hrg_beli: item.harga_beli,
            });
          }
          console.log(data);
          data["detail"] = detail;
          data["master"] = databrg;
          data["nota"] = nota;
          data["logo"] = auth.user.logo;
          data["user"] = auth.user.username;
          data["lokasi_val"] = location.value;
          data["alamat"] = auth.user.alamat;
          data["site_title"] =
            auth.user.site_title === undefined
              ? auth.user.title
              : auth.user.site_title;
          this.props.dispatch(
            storeAdjusment(data, () => {
              this.handleClear();
              this.getData();
              this.props.dispatch(FetchCodeAdjustment(location.value));
            })
          );
        });
      }
    });
  }

  render() {
    const { searchby, databrg, brgval, location, toggleSide } = this.state;
    const head = [
      { rowSpan: 2, label: "Barang" },
      { rowSpan: 2, label: "Variasi", width: "20%" },
      { rowSpan: 2, label: "Satuan", width: "1%" },
      { rowSpan: 2, label: "Jenis", width: "1%" },
      { rowSpan: 2, label: "Qty", width: "1%" },
      { colSpan: 2, label: "Stok", width: "1%" },
      { rowSpan: 2, label: "#", className: "text-center", width: "1%" },
    ];
    const rowSpan = [{ label: "Stock Awal" }, { label: "Real Stock" }];

    return (
      <TransaksiWrapper
        table={table}
        pathName="Adjusment"
        nota={this.props.nota}
        callbackInput={(res) => this.setState({ [res.name]: res.value })}
        callbackToggle={(res) => this.setState({ toggleSide: !toggleSide })}
        callbackFetch={(res) => {
          if (res.label === "loadmore") {
            this.handleFetch((this.props.dataTrx.data.length += 5));
          } else {
            if (res.label === "search") {
              this.handleFetch(10, { searchby: searchby, search: res.value });
            } else {
              this.setState({ searchby: res.value });
            }
          }
        }}
        callbackAdd={(res) => this.HandleAdd(res)}
        data={
          this.props.dataTrx.data !== undefined &&
          this.props.dataTrx.data.length > 0
            ? this.props.dataTrx.data
            : []
        }
        renderRow={
          <div style={{ width: !toggleSide ? "70%" : "100%" }}>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <LokasiCommon
                      callback={(val) => this.HandleChangeSelect(val, "lokasi")}
                      dataEdit={location.value}
                      isRequired={true}
                    />
                  </div>
                </div>
                <TableCommon
                  head={head}
                  rowSpan={rowSpan}
                  renderRow={
                    databrg.length > 0
                      ? databrg.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td className="middle nowrap">
                                {item.nm_brg}
                                <div className="subtitle">
                                  {item.barcode} ({" "}
                                  {toCurrency(parseInt(item.harga_beli, 10))} )
                                </div>
                              </td>
                              <td className="middle nowrap">
                                {item.ukuran}
                              </td>
                              <td className="middle nowrap">
                                <select
                                  value={item.satuan}
                                  className="form-control in-table"
                                  name="satuan"
                                  style={{ width: "100px" }}
                                  disabled={
                                    item.tambahan.length <= 1 ? true : false
                                  }
                                  onChange={(e) =>
                                    this.HandleOnChange(e, index, item.tambahan)
                                  }
                                >
                                  {item.tambahan.map((i, key) => {
                                    return (
                                      <option
                                        key={key}
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
                                <select
                                  style={{ width: "100px" }}
                                  name="status"
                                  onChange={(e) =>
                                    this.HandleOnChange(e, index)
                                  }
                                  value={this.state.brgval[index].status}
                                  className="form-control in-table"
                                >
                                  <option value="tambah">Tambah</option>
                                  <option value="kurang">Kurang</option>
                                </select>
                              </td>
                              <td className="middle nowrap">
                                <input
                                  style={{ width: "100px" }}
                                  type="text"
                                  name="qty"
                                  ref={(input) =>
                                    (this[`qty-${btoa(item.barcode)}`] = input)
                                  }
                                  onFocus={(e) =>
                                    this.HandleFocusInputReset(e, index)
                                  }
                                  onBlur={(e) => this.HandleOnBlur(e, index)}
                                  onChange={(e) =>
                                    this.HandleOnChange(e, index)
                                  }
                                  value={toCurrency(brgval[index].qty)}
                                  className="form-control in-table text-right"
                                />
                              </td>
                              <td className="middle nowrap">
                                <input
                                  style={{ width: "100px" }}
                                  disabled={true}
                                  type="text"
                                  name="stock"
                                  value={toCurrency(parseInt(item.stock, 10))}
                                  className="form-control in-table text-right"
                                />
                              </td>
                              <td className="middle nowrap">
                                <input
                                  style={{ width: "100px" }}
                                  disabled={true}
                                  type="text"
                                  name="saldo_stock"
                                  value={toCurrency(
                                    this.getSaldoStock(item.qty, index)
                                  )}
                                  className="form-control in-table text-right"
                                />
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
                        })
                      : noData(head.length + rowSpan.length)
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
  barang: state.productReducer.result_brg,
  loadingbrg: state.productReducer.isLoadingBrg,
  paginBrg: state.productReducer.pagin_brg,
  nota: state.adjustmentReducer.get_code,
  dataTrx: state.productReducer.dataTrx,
});

export default withRouter(connect(mapStateToPropsCreateItem)(TrxAdjustment));
