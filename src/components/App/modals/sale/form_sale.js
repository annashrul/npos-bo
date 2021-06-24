import React, { Component } from "react";
import WrapperModal from "components/App/modals/_wrapper.modal";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { FetchBank } from "redux/actions/masterdata/bank/bank.action";
import Preloader from "../../../../Preloader";
import { storeSale } from "../../../../redux/actions/sale/sale.action";
import { ToastQ, toCurrency, rmComma } from "helper";
import { withRouter } from "react-router-dom";
import moment from "moment";
import {
  store,
  get,
  update,
  destroy,
  cekData,
  del,
} from "components/model/app.model";
import {
  handleError,
  isEmptyOrUndefined,
  onHandleKeyboard,
} from "../../../../helper";
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
    onHandleKeyboard(13, (e) => {
      console.log("enter bayar");
      this.handleSubmit(e);
    });
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
    if (nextProps.master !== undefined && nextProps.master !== []) {
      this.setState({
        gt: nextProps.master.gt,
        tunai: nextProps.master.gt,
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

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });

    if (event.target.name === "tunai") {
      let tunai = event.target.value;
      if (tunai < 0) {
        tunai = 0;
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
    if (event.target.name === "jenis_trx") {
      if (
        event.target.value === "Transfer" ||
        event.target.value === "Gabungan"
      ) {
        this.setState({ isTransfer: true, jml_kartu: this.state.gt });
        let bank = this.state.bank.split("-");
        Object.assign(this.props.master, {
          tunai: rmComma(this.state.tunai),
          change: this.state.change,
          jenis_trx: event.target.value,
          pemilik_kartu: bank[1],
          kartu: bank[0],
        });
      } else {
        this.setState({
          isTransfer: false,
        });
      }
      if (event.target.value === "Kredit") {
        this.setState({
          change: 0,
          tunai: 0,
        });
        Object.assign(this.props.master, {
          change: 0,
          tunai: 0,
          jenis_trx: event.target.value,
        });
      }
    }
    if (event.target.name.toLowerCase() === "dp") {
      this.setState({
        change: 0,
        tunai:
          event.target.value === "" ||
          event.target.value === undefined ||
          event.target.value === null
            ? 0
            : event.target.value,
      });
      Object.assign(this.props.master, {
        change: 0,
        tunai: rmComma(this.state.tunai),
      });
    }
    if (event.target.name === "tanggal_tempo") {
      Object.assign(this.props.master, {
        tempo: event.target.value,
      });
    }
  };

  toggle = (e) => {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.setState({});
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
    let bank = this.state.bank.split("-");

    let err = this.state.error;
    if (this.state.jenis_trx.toLowerCase() === "kredit") {
      if (parseFloat(this.state.tunai.toString().replace(/,/g, "")) < 0) {
        handleError("Nominal masih kosong!");
        return;
      } else if (this.state.tanggal_tempo === "") {
        handleError("Tanggal masih kosong!");
        return;
      } else {
        let parsedata = {};
        parsedata["master"] = this.props.master;
        parsedata["split"] = [];
        parsedata["join"] = [];
        parsedata["detail"] = this.props.detail;
        parsedata["master"]["jml_kartu"] = 0;
        parsedata["master"]["pemilik_kartu"] = "-";
        let newparse = {};
        newparse["parsedata"] = parsedata;
        newparse["alamat"] = this.props.lokasi.alamat;
        newparse["site_title"] =
          this.props.auth.user.site_title === undefined
            ? this.props.auth.user.title
            : this.props.auth.user.site_title;

        this.props.dispatch(
          storeSale(newparse, (arr) => this.props.history.push(arr))
        );
        this.resetState();
      }
    } else {
      if (this.state.jenis_trx === "Tunai") {
        if (
          parseFloat(this.state.tunai.toString().replace(/,/g, "")) <
          this.state.gt
        ) {
          handleError("Jumlah uang tidak boleh kurang dari total pembayaran");
          return;
        }
      }
      if (this.state.jenis_trx === "Transfer") {
        if (this.state.bank === "") {
          handleError("silahkan pilih bank tujuan");
          return false;
        }
        if (rmComma(this.state.jml_kartu) < this.state.gt) {
          handleError("Jumlah uang tidak boleh kurang dari total pembayaran");
          return false;
        }
      }

      if (this.state.jenis_trx === "Gabungan") {
        let jumlah =
          parseInt(rmComma(this.state.tunai)) +
          parseInt(rmComma(this.state.jml_kartu));
        if (this.state.bank === "") {
          handleError("silahkan pilih bank tujuan");
          return false;
        }
        if (jumlah > parseInt(rmComma(this.state.gt))) {
          handleError(
            "uang tunai dan uang transfer tidak boleh lebih dari total pembayaran"
          );
          return;
        }
      }

      let parsedata = {};
      parsedata["master"] = this.props.master;
      parsedata["split"] = [];
      parsedata["join"] = [];
      parsedata["detail"] = this.props.detail;
      parsedata["master"]["jenis_trx"] = this.state.jenis_trx;

      let newparse = {};

      if (this.state.jenis_trx === "Transfer") {
        parsedata["master"]["change"] = 0;
        parsedata["master"]["tunai"] = 0;
        parsedata["master"]["jml_kartu"] = rmComma(this.state.jml_kartu);
        parsedata["master"]["pemilik_kartu"] = bank[1];
        parsedata["master"]["kartu"] = bank[0];
      } else if (this.state.jenis_trx === "Tunai") {
        parsedata["master"]["change"] = rmComma(this.state.change);
        parsedata["master"]["tunai"] = rmComma(this.state.tunai);
        parsedata["master"]["jml_kartu"] = 0;
        parsedata["master"]["pemilik_kartu"] = "-";
        parsedata["master"]["kartu"] = "-";
      } else if (this.state.jenis_trx === "Gabungan") {
        parsedata["master"]["change"] = 0;
        parsedata["master"]["tunai"] = rmComma(this.state.tunai);
        parsedata["master"]["jml_kartu"] = rmComma(this.state.jml_kartu);
        parsedata["master"]["pemilik_kartu"] = bank[1];
        parsedata["master"]["kartu"] = bank[0];
      }
      newparse["parsedata"] = parsedata;
      newparse["alamat"] = this.props.lokasi.alamat;
      newparse["site_title"] =
        this.props.auth.user.site_title === undefined
          ? this.props.auth.user.title
          : this.props.auth.user.site_title;
      if (this.props.master.id_hold !== undefined) {
        del("hold", this.props.master.id_hold);
        localStorage.removeItem("objectHoldBill");
      } else {
        Object.assign(parsedata["master"], { id_hold: "" });
      }

      this.props.dispatch(
        storeSale(newparse, (arr) => this.props.history.push(arr))
      );
      this.resetState();
    }
  }
  componentWillMount() {
    this.props.dispatch(FetchBank(1, "", 100));
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
          onFocus={function (e) {
            e.currentTarget.select();
          }}
          onKeyUp={this.handleChange}
          onChange={this.handleChange}
        />
        <div
          className="invalid-feedback"
          style={
            this.state.error.tunai !== "" || this.state.error.tunai !== "0"
              ? { display: "block" }
              : { display: "none" }
          }
        >
          {this.state.error.tunai}
        </div>
      </div>
    );
  }

  render() {
    const { data } = this.props.bank;
    return (
      <div>
        <WrapperModal
          isOpen={this.props.isOpen && this.props.type === "formSale"}
          size="md"
        >
          <ModalHeader toggle={this.toggle}>
            {this.props.detail === undefined
              ? "Pembayaran"
              : "#" + this.state.kode_trx}
          </ModalHeader>
          <ModalBody>
            <div className="row"></div>
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label htmlFor="">Jenis Pembayaran</label>
                  <select
                    name="jenis_trx"
                    id="jenis_trx"
                    className="form-control"
                    value={this.state.jenis_trx}
                    defaultValue={this.state.jenis_trx}
                    onChange={this.handleChange}
                  >
                    <option value="Tunai">TUNAI</option>
                    <option value="Transfer">TRANSFER</option>
                    <option value="Kredit">KREDIT</option>
                    <option value="Gabungan">GABUNGAN</option>
                  </select>
                </div>
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
                    min={moment(new Date()).add(1, "days").format("yyyy-MM-DD")}
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
                  !this.props.isLoading ? (
                    <div className="form-group">
                      <label htmlFor="">BANK</label>
                      <select
                        name="bank"
                        id="bank"
                        className="form-control"
                        value={this.state.bank}
                        defaultValue={this.state.bank}
                        onChange={this.handleChange}
                      >
                        {typeof data === "object"
                          ? data.map((v, i) => {
                              return (
                                <option value={`${v.nama}-${v.akun}`}>
                                  {v.nama} || {v.akun}
                                </option>
                              );
                            })
                          : ""}

                        {/*<option value="KREDIT">KREDIT</option>*/}
                      </select>
                    </div>
                  ) : (
                    <Preloader />
                  )
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
                    className="invalid-feedback text-center"
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
                  className="btn btn-primary"
                  onClick={this.handleSubmit}
                  disabled={this.props.isLoadingSale}
                >
                  {this.props.isLoadingSale ? (
                    <span className="spinner-border spinner-border-sm text-light" />
                  ) : (
                    "Bayar"
                  )}
                </button>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="container"></div>
          </ModalFooter>
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
