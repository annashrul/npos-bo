import React, { Component } from "react";
import { destroy, del } from "components/model/app.model";
import connect from "react-redux/es/connect/connect";
import Layout from "../../Layout";
import Select from "react-select";
import Swal from "sweetalert2";
import { FetchBrgProduksiPaket } from "redux/actions/inventory/produksi.action";
import StickyBox from "react-sticky-box";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import FormPaket from "../../modals/masterdata/paket/form_paket";
import { btnSave, btnSCancel, handleError, rmComma, swal, swallOption, swalWithCallback, toCurrency } from "../../../../helper";
import { handlePost } from "../../../../redux/actions/handleHttp";
import LokasiCommon from "../../common/LokasiCommon";
import ProductCommon from "../../common/ProductCommon";
import { actionDataCommon, getDataCommon, handleInputOnBlurCommon } from "../../common/FlowTrxCommon";
import { readProductTrx } from "../../../../redux/actions/masterdata/product/product.action";
import { update } from "lodash";
const table = "production";
class Paket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataPaket: [],
      paket: "",
      total_hrg_beli: 0,
      total_hrg_jual: 0,
      isModalForm: false,
      isUpdatePaket: false,
      databrg: [],
      brgval: [],
      location: "",
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.HandleRemove = this.HandleRemove.bind(this);
    this.HandleReset = this.HandleReset.bind(this);
    this.HandleOnChange = this.HandleOnChange.bind(this);
    this.HandleOnBlur = this.HandleOnBlur.bind(this);
    this.HandleChangeSelect = this.HandleChangeSelect.bind(this);
    this.HandleFocusInputReset = this.HandleFocusInputReset.bind(this);
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
  }
  componentWillUnmount() {
    this.handleClear();
  }
  componentWillMount() {
    this.getProps(this.props);
  }

  HandleChangeSelect(res, param) {
    let val = res.value;
    let setState = {};
    if (param === "paket") {
      setState = { paket: val };
    } else {
      setState = { location: val };
      this.props.dispatch(readProductTrx(`page=1&kategori=4&lokasi=${val}`));
      this.props.dispatch(FetchBrgProduksiPaket(1, "", "", val));
      destroy(table);
      getDataCommon(table, (res, brg) => {
        this.setState({ databrg: res, brgval: brg });
      });
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
  HandleOnChange(e, i, barcode = null, datas = []) {
    const column = e.target.name;
    const val = rmComma(e.target.value);
    this.handleGetDataObject(column, val, i);
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
  HandleValidate() {
    let { location, brgval, paket } = this.state;
    let listBahan = [];
    if (location === "" || location === undefined) {
      handleError("lokasi");
      return;
    }
    if (paket === "" || paket === undefined) {
      handleError("paket");
      return;
    }
    if (brgval.length < 1) {
      handleError("barang");
      return;
    }
    for (let i = 0; i < brgval.length; i++) {
      listBahan.push({
        kd_brg: brgval[i].kd_brg,
        qty: brgval[i].qty,
      });
      if (isNaN(parseFloat(brgval[i].qty)) || parseFloat(brgval[i].qty) < 1) {
        handleError("qty");
        setTimeout(() => this && this[`qty-${btoa(brgval[i].barcode)}`].focus(), 500);
        return;
        // break;
      }
      continue;
    }
    return true;
  }

  HandleSubmit(e) {
    e.preventDefault();
    let listBahan = [];
    let validate = this.HandleValidate();
    if (!validate) return validate;
    swallOption("Pastikan data yang anda masukan sudah benar!", async () => {
      let parseData = {
        lokasi: this.state.location,
        kd_brg: this.state.paket.split("|")[0],
        list_bahan: listBahan,
        isChangePrice: this.state.isUpdatePaket ? 1 : 0,
        harga_beli: this.state.total_hrg_beli,
        harga_jual: this.state.total_hrg_beli,
      };
      await handlePost("barang/paket", parseData, (res, msg, status) => {
        if (status) {
          swalWithCallback(msg, () => {
            this.handleClear();
          });
        } else {
          swal(msg);
        }
      });
    });
  }

  toggleModal(e, i) {
    let isChecked = e.target.checked;
    let isModal = true;
    if (isChecked) {
      let validate = this.HandleValidate();
      if (!validate) return validate;
      this.props.dispatch(ModalToggle(true));
      this.props.dispatch(ModalType("formPaket"));
    }
    this.setState({
      isUpdatePaket: isChecked,
      isModalForm: isModal,
    });
  }

  render() {
    let totHargaBeli = 0;
    return (
      <Layout page="Paket">
        <div className="card">
          <div className="card-header">
            <h4>Paket</h4>
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
                    <div className="col-md-3">
                      <LokasiCommon callback={(val) => this.HandleChangeSelect(val, "lokasi")} isRequired={true} />
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Barang Paket</label>
                        <Select
                          options={this.state.dataPaket}
                          placeholder="Pilih Barang"
                          onChange={(val, actionMeta) => this.HandleChangeSelect(val, "paket")}
                          value={this.state.dataPaket.find((op) => {
                            return op.value === this.state.paket;
                          })}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="new-checkbox">
                        <label>Ubah harga</label>
                        <div className="d-flex align-items-center">
                          <label className="switch mr-2">
                            <input
                              type="checkbox"
                              checked={this.state.isUpdatePaket}
                              onChange={(e) => {
                                this.toggleModal(e, null);
                              }}
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12" style={{ overflowX: "auto" }}>
                      <table className="table table-hover table-noborder">
                        <thead>
                          <tr>
                            <th className="text-center middle nowrap" width="1%">
                              No
                            </th>

                            <th className="middle nowrap">Nama</th>
                            <th className="middle nowrap" width="10%">
                              Satuan
                            </th>
                            <th className="middle nowrap" style={{ width: "15%" }}>
                              Harga Beli
                            </th>
                            <th className="middle nowrap" style={{ width: "15%" }}>
                              Qty
                            </th>
                            <th className="text-center middle nowrap" width="1%">
                              #
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {this.state.databrg.map((item, index) => {
                            totHargaBeli += parseInt(item.harga_beli, 10) * parseInt(item.qty, 10);
                            return (
                              <tr key={index}>
                                <td className="middle nowrap text-center">{index + 1}</td>

                                <td className="middle nowrap">{item.nm_brg}</td>
                                <td className="middle nowrap">{item.satuan}</td>
                                <td className="middle nowrap">
                                  <input
                                    style={{
                                      textAlign: "right",
                                    }}
                                    readOnly={true}
                                    type="text"
                                    name="harga_beli"
                                    value={toCurrency(parseInt(item.harga_beli, 10))}
                                    className="form-control in-table"
                                  />
                                </td>
                                <td className="middle nowrap">
                                  <input
                                    style={{
                                      textAlign: "right",
                                    }}
                                    type="text"
                                    name="qty"
                                    ref={(input) => (this[`qty-${btoa(item.barcode)}`] = input)}
                                    onFocus={(e) => this.HandleFocusInputReset(e, index)}
                                    onBlur={(e) => this.HandleOnBlur(e, index)}
                                    onChange={(e) => this.HandleOnChange(e, index)}
                                    value={toCurrency(this.state.brgval[index].qty)}
                                    className="form-control in-table"
                                  />
                                </td>
                                <td className="middle nowrap">
                                  <button className="btn btn-primary btn-sm" onClick={(e) => this.HandleRemove(e, item.id)}>
                                    <i className="fa fa-trash" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="card-header d-flex justify-content-between">
                  <div style={{ width: "50%" }}>
                    {btnSave("", (e) => {
                      this.HandleSubmit(e);
                    })}
                    {btnSCancel("ml-1", (e) => {
                      this.HandleReset(e);
                    })}
                  </div>
                  <div className="row" style={{ width: "50%" }}>
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-6 text-right">Total harga beli</div>
                        <div className="col-md-1">:</div>
                        <div className="col-md-5 text-right">{toCurrency(this.props.isOpen ? this.state.total_hrg_beli : totHargaBeli)}</div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 text-right">Total harga jual</div>
                        <div className="col-md-1">:</div>
                        <div className="col-md-5 text-right">{toCurrency(this.state.total_hrg_jual)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*END RIGHT*/}
          </div>
          {this.props.isOpen ? (
            <FormPaket
              detail={{
                harga_beli: totHargaBeli,
                nama: this.state.paket.split("|")[2],
              }}
              callback={(e) => {
                if (e === null) {
                  this.setState({ isUpdatePaket: false });
                } else {
                  this.setState({
                    total_hrg_beli: e.harga_beli,
                    total_hrg_jual: e.harga_jual,
                  });
                }
              }}
            />
          ) : null}
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
});

export default connect(mapStateToPropsCreateItem)(Paket);
