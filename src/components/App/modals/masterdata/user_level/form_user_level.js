import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import { stringifyFormData } from "helper";
import { createUserLevel, updateUserLevel } from "redux/actions/masterdata/user_level/user_level.action";
import { ModalBody, ModalHeader, ModalFooter } from "reactstrap";

import { ModalToggle } from "redux/actions/modal.action";
import { isEmptyOrUndefined, setFocus } from "../../../../../helper";
import { menuCetakBarcode, menuInventory, menuMasterdata, menuPembayaran, menuPembelian, menuProduksi, menuReport, menuSetting, menuTransaksi } from "../../../../../helperMenu";

class FormUserLevel extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      setting:menuSetting,
      produksi:menuProduksi,
      cetak_barcode:menuCetakBarcode,
      masterdata:menuMasterdata,
      inventory:menuInventory,
      pembelian:menuPembelian,
      transaksi:menuTransaksi,
      pembayaran:menuPembayaran,
      report:menuReport,
      lvl: "",
      access: [],
      array_modul: ["setting", "masterdata", "produksi", "inventory", "pembelian", "transaksi", "pembayaran", "report", "cetak_barcode"],
      error: {
        lvl: "",
      },
    };
  }
  clearState() {
    this.setState({
      setting:menuSetting,
      produksi:menuProduksi,
      cetak_barcode:menuCetakBarcode,
      masterdata:menuMasterdata,
      inventory:menuInventory,
      pembelian:menuPembelian,
      transaksi:menuTransaksi,
      pembayaran:menuPembayaran,
      report:menuReport,
      lvl: "",
      access: [],
      error: {
        lvl: "",
      },
    });
  }
  getProps(param) {
    if (param.detail !== undefined && param.detail !== []) {
      let array = [];
      this.state.array_modul.map((val) => {
        array.push(...this.state[val]);
        return val;
      });
      this.handleLoopAccess(array, param.detail.access);
      this.setState({ lvl: param.detail.lvl });
    } else {
      this.clearState();
    }
  }
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }
  componentWillMount() {
    this.getProps(this.props);
  }
  toggle = (e) => {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.clearState();
  };
  handleLoopAccess(moduls = [], nextProps = []) {
    if (nextProps !== null) {
      moduls.forEach((modul) => {
        for (let i = 0; i < nextProps.length; i++) {
          if (modul.id === nextProps[i].id) {
            modul.isChecked = nextProps[i].isChecked;
            modul.value = nextProps[i].value;
          }
        }
      });
      return moduls;
    }
  }
  handleAllChecked = (event, param) => {
    let moduls = this.state[param];
    moduls.forEach((modul) => {
      modul.isChecked = event.target.checked;
      modul.value = modul.label !== "" ? (modul.isChecked === false ? "0" : "1") : "0";
    });
    this.setState({ param: moduls });
  };
  handleCheckChieldElement = (event, param) => {
    let moduls = this.state[param];
    moduls.forEach((modul) => {
      if (modul.label === event.target.getAttribute("id")) {
        modul.isChecked = event.target.checked;
        modul.value = modul.label !== "" ? (modul.isChecked === false ? "0" : "1") : "0";
      }
    });
    this.setState({ param: moduls });
  };
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    let err = Object.assign({}, this.state.error, { [event.target.name]: "" });
    this.setState({ error: err });
  };
  handleSubmit(e) {
    e.preventDefault();
    let form = e.target;
    let data = new FormData(form);
    let parseData = stringifyFormData(data);
    let akses = [];
    let err = this.state.error;
    parseData["lvl"] = this.state.lvl;
    parseData["access"] = akses;
    if (!isEmptyOrUndefined(parseData["lvl"], "Nama Level pengguna")) {
      setFocus(this, "lvl");
      return;
    }
    this.state.array_modul.forEach((val) => {
      this.state[val].forEach((key) => {
        akses.push({
          id: key.id,
          value: key.value,
          isChecked: key.isChecked,
          label: key.label,
        });
      });
    });

    if (this.props.detail !== undefined) {
      this.props.dispatch(
        updateUserLevel(this.props.detail.id, parseData, (showModal) => {
          if (!showModal) this.clearState();
        })
      );
    } else {
      this.props.dispatch(
        createUserLevel(parseData, (showModal) => {
          if (!showModal) this.clearState();
        })
      );
    }
  }
  render() {
    const { array_modul } = this.state;
    return (
      <WrapperModal isOpen={this.props.isOpen && this.props.type === "formUserLevel"} size="lg">
        <ModalHeader toggle={this.toggle}>{this.props.detail === undefined ? "Tambah" : "Ubah"} level pengguna</ModalHeader>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <ModalBody>
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  <label>Nama level pengguna</label>
                  <input ref={(input) => (this[`lvl`] = input)} type="text" className="form-control" name="lvl" value={this.state.lvl} onChange={(e) => this.handleChange(e)} />
                </div>
              </div>
              {array_modul.map((val, i) => {
                return (
                  <div className="col-12" key={i}>
                    <div className="form-group">
                      <input type="checkbox" onChange={(e) => this.handleAllChecked(e, val)} value="checkedall" /> <b style={{ color: "red" }}>{val.replace("_", " ").toUpperCase()}</b>
                    </div>
                    <div className="row">
                      {this.state[val].map((modul, index) => {
                        return modul.label !== "" ? (
                          <div className="col-md-3" key={index}>
                            <div className="form-group" style={{ marginLeft: "6px", fontSize: "12px" }}>
                              <input onChange={(e) => this.handleCheckChieldElement(e, val)} id={modul.label} className={modul.label} type="checkbox" checked={modul.isChecked} value={modul.value} />{" "}
                              {modul.label}
                            </div>
                          </div>
                        ) : (
                          ""
                        );
                      })}
                    </div>
                    {val !== "cetak_barcode" && <hr />}
                  </div>
                );
              })}
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="form-group" style={{ textAlign: "right" }}>
              <button type="button" className="btn btn-warning mb-2 mr-2" onClick={this.toggle}>
                <i className="ti-close" /> Batal
              </button>
              <button type="submit" className="btn btn-primary mb-2 mr-2">
                <i className="ti-save" /> Simpan
              </button>
            </div>
          </ModalFooter>
        </form>
      </WrapperModal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};

export default connect(mapStateToProps)(FormUserLevel);
