import React, { Component } from "react";
import WrapperModal from "components/App/modals/_wrapper.modal";
import { ModalBody, ModalHeader } from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { FetchBank } from "redux/actions/masterdata/bank/bank.action";
import {
  storeSale,
  storeSaleEdit,
} from "../../../../redux/actions/sale/sale.action";
import { toCurrency, rmComma } from "helper";
import { withRouter } from "react-router-dom";
import moment from "moment";
import KeyHandler, { KEYPRESS } from "react-key-handler";
import SelectCommon from "../../common/SelectCommon";

import { handleError, setFocus } from "../../../../helper";
import { getSoAction } from "../../../../redux/actions/sale/sales_order.action";
class FormSale extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      isTransfer: false,
      error: {
        tunai: "",
        bank: "",
        tanggal_tempo: "",
      },
      gt: 0,
      kode_trx: "",
      jenis_trx: "Tunai",
      tunai: 0,
      jml_kartu: 0,
      tanggal_tempo: "",
      change: 0,
      bank: "",
    };
    this.handleSetTunai = this.handleSetTunai.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    // onHandleKeyboard(13, (e) => {
    //   e.preventDefault();
    //   console.log(this.props.type);
    //   if (this.props.type === "formSale") {
    //     this.handleSubmit(e);
    //   }
    // });
  }
  getProps(props) {
    setFocus(this, "tunai");
  }

  resetState() {
    this.setState({
      isTransfer: false,
      error: {
        tunai: "",
        bank: "",
        tanggal_tempo: "",
      },
      gt: 0,
      kode_trx: "",
      jenis_trx: "Tunai",
      tunai: 0,
      tanggal_tempo: "",
      change: 0,
      bank: "",
      
    });
  }

  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
    if (nextProps.master !== undefined && nextProps.master !== []) {
      this.setState({
        gt: nextProps.master.gt,
        kode_trx: nextProps.master.kode_trx,
      });
    }
    if (nextProps.bank !== undefined) {
      if (nextProps.bank.data !== undefined) {
        this.setState({
          bank: `${nextProps.bank.data[0].nama}-${nextProps.bank.data[0].akun}`,
        });
        // value={`${v.nama}-${v.akun}`}
      }
    }
  }

  handleSelect(res) {
    let value = res.value;
    let setState = { jenis_trx: value, isTransfer: false };
    let state = this.state;
    let props = this.props.master;
    if (value === "Transfer" || value === "Gabungan") {
      if (value === "Transfer") {
        setFocus(this, "jml_kartu");
      }
      Object.assign(setState, { isTransfer: true, jml_kartu: state.gt });
      let bank = state.bank.split("-");
      Object.assign(props, {
        tunai: rmComma(state.tunai),
        change: state.change,
        jenis_trx: value,
        pemilik_kartu: bank[1],
        kartu: bank[0],
      });
    }
    if (value === "Kredit") {
      Object.assign(setState, { change: 0, tunai: 0 });
      Object.assign(props, {
        change: 0,
        tunai: 0,
        jenis_trx: value,
      });
    }
    if (value === "Tunai" || value === "Kredit" || value === "Gabungan") {
      setFocus(this, "tunai");
    }
    this.setState(setState);
  }

  handleChange = (event) => {
    event.preventDefault();
    let col = event.target.name;
    let val = event.target.value;
    this.setState({ [col]: val });
    if (col === "tunai") {
      let tunai = val;
      if (tunai < 0) {
        tunai = 0;
      }

      if (this.state.jenis_trx === "Gabungan") {
        console.log(this.state.gt, val);
        this.setState({
          jml_kartu: this.state.gt - parseInt(rmComma(tunai), 10),
        });
      }
      this.setState({
        change: parseInt(rmComma(tunai), 10) - this.state.gt,
      });
      Object.assign(this.props.master, {
        tunai: rmComma(this.state.tunai),
        change: this.state.change,
        jenis_trx: this.state.jenis_trx,
        pemilik_kartu: "-",
        kartu: "-",
      });
    }
    if (col.toLowerCase() === "dp") {
      this.setState({
        change: 0,
        tunai: val === "" || val === undefined || val === null ? 0 : val,
      });
      Object.assign(this.props.master, {
        change: 0,
        tunai: rmComma(this.state.tunai),
      });
    }
    if (col === "tanggal_tempo") {
      Object.assign(this.props.master, {
        tempo: val,
      });
    }
  };

  toggle = (e) => {
    e.preventDefault();
    this.props.dispatch(ModalToggle(false));
  };
  handleSetTunai(e) {
    e.preventDefault();
    if (this.state.jenis_trx === "Tunai") {
      let err = Object.assign({}, this.state.error, { tunai: "" });
      this.setState({
        tunai: this.state.gt,
        change: 0,
        error: err,
      });
    } else if (this.state.jenis_trx === "Transfer") {
      this.setState({
        jml_kartu: this.state.gt,
        change: 0,
      });
    }
  }
  handleSubmit(e) {
    e.preventDefault();

    let propsMaster = this.props.master;
    let field = {};
    console.log(propsMaster);

    field["master"] = {
      kd_so: propsMaster.kd_so,
      cetak_nota: true,
      tempo: propsMaster.tempo,
      kd_cust: propsMaster.kd_cust,
      change: propsMaster.change,
      kd_sales: propsMaster.kd_sales,
      optional_note: propsMaster.optional_note,
      rounding: propsMaster.rounding,
      tax: propsMaster.tax,
      dis_persen: propsMaster.dis_persen,
      status: propsMaster.status,
      kd_kasir: propsMaster.kd_kasir,
      subtotal: propsMaster.subtotal,
      gt: propsMaster.gt,
      jam: propsMaster.jam,
      tunai: propsMaster.tunai,
      nominal_poin: propsMaster.nominal_poin,
      diskon: propsMaster.diskon,
      kode_trx: propsMaster.kode_trx,
      compliment: propsMaster.compliment,
      poin_tukar: propsMaster.poin_tukar,
      jenis_trx: propsMaster.jenis_trx,
      jml_kartu: propsMaster.jml_kartu,
      no_kartu: propsMaster.no_kartu,
      lokasi: propsMaster.lokasi,
      kartu: propsMaster.kartu,
      charge: propsMaster.charge,
      hr: propsMaster.hr,
      kassa: propsMaster.kassa,
      nama_penerima: propsMaster.nama_penerima,
      no_telepon_penerima: propsMaster.no_telepon_penerima,
      alamat_penerima: propsMaster.alamat_penerima,
      nama_pengirim: propsMaster.nama_pengirim,
      no_telepon_pengirim: propsMaster.no_telepon_pengirim,
      alamat_pengirim: propsMaster.alamat_pengirim,
      pemilik_kartu: propsMaster.pemilik_kartu,
      id_hold: propsMaster.id_hold === undefined ? "-" : propsMaster.id_hold,
      jns_kartu: propsMaster.jns_kartu,
      compliment_rp: propsMaster.compliment_rp,
      tgl: propsMaster.tgl,
    };
    field["split"] = [];
    field["join"] = [];
    field["detail"] = this.props.detail;
    let parsedata = field;
    let bank = this.state.bank.split("-");
    let jenisTransaksi = this.state.jenis_trx;
    let nominalTunai = parseInt(rmComma(this.state.tunai));
    let nominalTransfer = parseInt(rmComma(this.state.jml_kartu));
    let totalBayar = this.state.gt;

    if (jenisTransaksi.toLowerCase() === "kredit") {
      if (nominalTunai < 0) {
        handleError("Nominal masih kosong!");
        return;
      } else if (this.state.tanggal_tempo === "") {
        handleError("Tanggal masih kosong!");
        return;
      } else {
        parsedata["detail"] = this.props.detail;
        parsedata["master"]["jml_kartu"] = 0;
        parsedata["master"]["pemilik_kartu"] = "-";
        let newparse = {};
        newparse["parsedata"] = parsedata;

        this.props.dispatch(
          storeSale(newparse, (arr) => this.props.history.push(arr))
        );
        this.resetState();
      }
    } else {
      if (jenisTransaksi === "Tunai") {
        if (nominalTunai < totalBayar) {
          handleError(
            "",
            "Jumlah uang tidak boleh kurang dari total pembayaran"
          );
          return;
        }
      }
      if (jenisTransaksi === "Transfer") {
        if (this.state.bank === "") {
          handleError("", "silahkan pilih bank tujuan");
          return false;
        }
        if (nominalTransfer < totalBayar) {
          handleError(
            "",
            "Jumlah uang tidak boleh kurang dari total pembayaran"
          );
          return false;
        }
      }

      if (jenisTransaksi === "Gabungan") {
        let jumlah = nominalTunai + nominalTransfer;
        if (this.state.bank === "") {
          handleError("", "silahkan pilih bank tujuan");
          return false;
        }

        if (jumlah > parseInt(rmComma(totalBayar))) {
          handleError(
            "",
            "uang tunai dan uang transfer tidak boleh lebih dari total pembayaran"
          );
          return false;
        }
      }

      // parsedata["master"] = propsMaster;
      if (this.props.master.id_hold === undefined) {
        Object.assign(parsedata["master"], { id_hold: "" });
      }

      parsedata["master"]["jenis_trx"] = jenisTransaksi;

      let newparse = {};

      if (jenisTransaksi === "Transfer") {
        parsedata["master"]["change"] = 0;
        parsedata["master"]["tunai"] = 0;
        parsedata["master"]["jml_kartu"] = nominalTransfer;
        parsedata["master"]["pemilik_kartu"] = bank[1];
        parsedata["master"]["kartu"] = bank[0];
      } else if (jenisTransaksi === "Tunai") {
        parsedata["master"]["change"] = rmComma(this.state.change);
        parsedata["master"]["tunai"] = nominalTunai;
        parsedata["master"]["jml_kartu"] = 0;
        parsedata["master"]["pemilik_kartu"] = "-";
        parsedata["master"]["kartu"] = "-";
      } else if (jenisTransaksi === "Gabungan") {
        parsedata["master"]["change"] = 0;
        parsedata["master"]["tunai"] = nominalTunai;
        parsedata["master"]["jml_kartu"] = nominalTransfer;
        parsedata["master"]["pemilik_kartu"] = bank[1];
        parsedata["master"]["kartu"] = bank[0];
      }
      newparse["parsedata"] = parsedata;

      if (propsMaster.idLog !== undefined) {
        this.props.dispatch(storeSaleEdit(newparse));
      } else {
        console.log("submit");
        this.props.callback();
        this.props.dispatch(
          storeSale(newparse, (arr) => {
            this.props.callback();
            this.props.history.push(arr);
          })
        );
      }

      this.resetState();
    }
  }
  componentWillMount() {
    this.props.dispatch(FetchBank("page=1&perpage=100"));
    this.getProps(this.props);
  }
  componentDidMount() {
    this.getProps(this.prop);
  }

  isTunai(label, name) {
    return (
      <div className="form-group">
        <label htmlFor="">{label}</label>
        <input
          type="text"
          name={name}
          id={name}
          className="form-control"
          value={toCurrency(this.state[name])}
          ref={(input) => {
            if (input !== null) {
              this[`${name}`] = input;
            }
          }}
          onKeyUp={this.handleChange}
          onChange={this.handleChange}
        />
      </div>
    );
  }

  render() {
    const { data } = this.props.bank;
    return (
      <div>
        <KeyHandler
          keyEventName={KEYPRESS}
          keyValue={["Enter", "f"]}
          onKeyHandle={(e) => {
            if (e.key === "s") {
              this.handleSubmit(e);
            }
            if (e.key === "f") {
              setFocus(this, "tunai");
            }
          }}
        />

        <WrapperModal
          isOpen={this.props.isOpen && this.props.type === "formSale"}
          size="md"
        >
          <ModalHeader toggle={this.toggle}>
            {this.props.detail === undefined
              ? "Pembayaran"
              : "#" + this.props.master.kode_trx}
          </ModalHeader>
          <ModalBody>
            <form onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="col-md-12">
                  <SelectCommon
                    label="Jenis pembayaran"
                    options={[
                      { value: "Tunai", label: "Tunai" },
                      { value: "Transfer", label: "Transfer" },
                      { value: "Kredit", label: "Kredit" },
                      { value: "Gabungan", label: "Gabungan" },
                    ]}
                    dataEdit={this.state.jenis_trx}
                    callback={(res) => this.handleSelect(res)}
                  />

                  {this.state.jenis_trx === "Gabungan" &&
                    this.isTunai("Uang tunai", "tunai")}
                  {(() => {
                    let label = "",
                      name = "";
                    let jenis_trx = this.state.jenis_trx;
                    if (jenis_trx === "Kredit") {
                      label = "Jumlah DP";
                      name = "tunai";
                    } else if (
                      jenis_trx === "Transfer" ||
                      jenis_trx === "Gabungan"
                    ) {
                      label =
                        jenis_trx === "Gabungan"
                          ? "Uang transfer"
                          : "Jumlah Uang";
                      name = "jml_kartu";
                    } else {
                      label = "Jumlah Uang";
                      name = "tunai";
                    }
                    return this.isTunai(label, name);
                  })()}
                  <div
                    className="form-group"
                    style={{
                      display: this.state.jenis_trx === "Kredit" ? "" : "none",
                    }}
                  >
                    <label htmlFor="">Tanggal Tempo</label>
                    <input
                      type="date"
                      name={"tanggal_tempo"}
                      min={moment(new Date())
                        .add(1, "days")
                        .format("yyyy-MM-DD")}
                      className="form-control"
                      value={this.state.tanggal_tempo}
                      onChange={this.handleChange}
                    />
                    <div
                      className="invalid-feedback"
                      style={
                        this.state.error.tanggal_tempo !== "" ||
                        this.state.error.tanggal_tempo !== "0"
                          ? { display: "block" }
                          : { display: "none" }
                      }
                    >
                      {this.state.error.tanggal_tempo}
                    </div>
                  </div>
                  {/*TRANSFER*/}
                  {this.state.isTransfer === true ? (
                    <div className="form-group">
                      <label htmlFor="">BANK</label>
                      <select
                        name="bank"
                        id="bank"
                        className="form-control"
                        value={this.state.bank}
                        onChange={this.handleChange}
                      >
                        {typeof data === "object"
                          ? data.map((v, i) => {
                              return (
                                <option key={i} value={`${v.nama}-${v.akun}`}>
                                  {v.nama} || {v.akun}
                                </option>
                              );
                            })
                          : ""}
                      </select>
                    </div>
                  ) : (
                    ""
                  )}
                  {/*END TRANSFER*/}
                  <div
                    className="form-group"
                    style={{
                      display:
                        this.state.jenis_trx === "Gabungan" ||
                        this.state.jenis_trx === "Kredit" ||
                        this.state.jenis_trx === "Transfer"
                          ? "none"
                          : "block",
                    }}
                  >
                    <label htmlFor="">Kembalian</label>
                    <input
                      readOnly
                      type="text"
                      name="change"
                      id="change"
                      className="form-control"
                      value={toCurrency(this.state.change)}
                      onChange={this.handleChange}
                    />
                    <div
                      className="invalid-feedback text-left"
                      style={
                        parseInt(this.state.change, 10) < 0 &&
                        this.state.jenis_trx !== "Gabungan"
                          ? { display: "block" }
                          : { display: "none" }
                      }
                    >
                      Kembalian Masih (Minus)
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-9">
                  <button
                    className="btn btn-info btn-block text-left"
                    onClick={(event) => this.handleSetTunai(event)}
                    data-toggle="tooltip"
                    title="Masukan total ke jumlah uang."
                  >
                    TOTAL = <b>{toCurrency(this.state.gt)}</b>
                  </button>
                </div>
                <div className="col-md-3">
                  <button
                    style={{ float: "right" }}
                    type="submit"
                    className="btn btn-primary"
                    disabled={this.props.isLoadingSale}
                  >
                    Bayar
                  </button>
                </div>
              </div>
            </form>
          </ModalBody>
        </WrapperModal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    bank: state.bankReducer.data,
    isLoading: state.bankReducer.isLoading,
    isLoadingSale: state.saleReducer.isLoading,
  };
};
export default withRouter(connect(mapStateToProps)(FormSale));
