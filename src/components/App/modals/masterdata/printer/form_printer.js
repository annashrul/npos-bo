import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { stringifyFormData } from "helper";
import {
  createPrinter,
  updatePrinter,
} from "redux/actions/masterdata/printer/printer.action";
import Select from "react-select";

class FormPrinter extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeKonektor = this.handleChangeKonektor.bind(this);
    this.state = {
      id_printer: "",
      pid: "",
      vid: "",
      konektor: "",
      konektor_data: [
        { value: "lan", label: "lan" },
        { value: "usb", label: "usb" },
      ],
      ip: "",
      nama: "",
      error: {
        pid: "",
        vid: "",
        konektor: "",
        ip: "",
        nama: "",
      },
    };
  }
  clearState() {
    this.setState({
      pid: "",
      vid: "",
      konektor: "",
      konektor_data: [
        { value: "lan", label: "lan" },
        { value: "usb", label: "usb" },
      ],
      ip: "",
      nama: "",
      error: {
        pid: "",
        vid: "",
        konektor: "",
        ip: "",
        nama: "",
      },
    });
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    let err = Object.assign({}, this.state.error, {
      [event.target.name]: "",
    });
    this.setState({
      error: err,
    });
  };
  toggle = (e) => {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.clearState();
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.detail.id_printer !== "") {
      if (this.props.detail.id_printer !== prevProps.detail.id_printer) {
        this.setState({
          nama: this.props.detail.nama,
          konektor: {
            value: `${this.props.detail.konektor}`.toLowerCase(),
            label: `${this.props.detail.konektor}`.toLowerCase(),
          },
          pid: this.props.detail.pid,
          vid: this.props.detail.vid,
          ip: this.props.detail.ip,
        });
      }
    }
  }

  handleError(state) {
    let err = state.error;
    err = Object.assign({}, err, { [state]: state + " tidak boleh kosong" });
    this.setState({ error: err });
  }
  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    let data = new FormData(form);
    let parseData = stringifyFormData(data);
    let state = this.state;
    parseData["pid"] = state.pid;
    parseData["vid"] = state.vid;
    parseData["konektor"] = state.konektor.value;
    parseData["ip"] = state.ip;
    parseData["nama"] = state.nama;

    if (state.nama === "" || state.nama === undefined) {
      this.handleError("nama");
      return;
    }
    if (state.konektor.value === "" || state.konektor.value === undefined) {
      this.handleError("konektor");
      return;
    }
    if (state.konektor.value === "usb") {
      if (state.vid === "" || state.vid === undefined) {
        this.handleError("vid");
        return;
      }
      if (state.pid === "" || state.pid === undefined) {
        this.handleError("pid");
        return;
      }
    }
    if (state.konektor.value === "lan") {
      if (state.ip === "" || state.ip === undefined) {
        this.handleError("ip");
        return;
      }
    }

    if (this.props.detail.id_printer === "") {
      this.props.dispatch(
        createPrinter(parseData, (status) => {
          if (status) {
            this.clearState();
            this.props.dispatch(ModalToggle(false));
          }
        })
      );
    } else {
      this.props.dispatch(
        updatePrinter(this.props.detail.id_printer, parseData, (status) => {
          if (status) {
            this.clearState();
            this.props.dispatch(ModalToggle(false));
          }
        })
      );
    }
  }

  handleChangeKonektor(lk) {
    let err = Object.assign({}, this.state.error, {
      konektor: "",
    });
    this.setState({
      konektor: lk,
      error: err,
    });
  }
  render() {
    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === "formPrinter"}
        size="md"
      >
        <ModalHeader toggle={this.toggle}>
          {this.props.detail.id_printer === ""
            ? "Add Printer"
            : "Update Printer"}
        </ModalHeader>
        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <div className="form-group">
              <label>Nama</label>
              <input
                type="text"
                className="form-control"
                name="nama"
                value={this.state.nama}
                onChange={this.handleChange}
              />
              <div
                className="invalid-feedback"
                style={
                  this.state.error.nama !== ""
                    ? { display: "block" }
                    : { display: "none" }
                }
              >
                {this.state.error.nama}
              </div>
            </div>
            <div className="form-group">
              <label>Konektor</label>
              <Select
                options={this.state.konektor_data}
                placeholder="Pilih konektor"
                onChange={this.handleChangeKonektor}
                value={this.state.konektor}
              />
              <div
                className="invalid-feedback"
                style={
                  this.state.error.konektor !== ""
                    ? { display: "block" }
                    : { display: "none" }
                }
              >
                {this.state.error.konektor}
              </div>
            </div>
            {this.state.konektor.value === "lan" && (
              <div className="form-group">
                <label>IP address</label>
                <input
                  type="text"
                  className="form-control"
                  name="ip"
                  value={this.state.ip}
                  onChange={this.handleChange}
                />
                <div
                  className="invalid-feedback"
                  style={
                    this.state.error.ip !== ""
                      ? { display: "block" }
                      : { display: "none" }
                  }
                >
                  {this.state.error.ip}
                </div>
              </div>
            )}
            {this.state.konektor.value === "usb" && (
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Vid</label>
                    <input
                      type="text"
                      className="form-control"
                      name="vid"
                      value={this.state.vid}
                      onChange={this.handleChange}
                    />
                    <div
                      className="invalid-feedback"
                      style={
                        this.state.error.vid !== ""
                          ? { display: "block" }
                          : { display: "none" }
                      }
                    >
                      {this.state.error.vid}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Pid</label>
                    <input
                      type="text"
                      className="form-control"
                      name="pid"
                      value={this.state.pid}
                      onChange={this.handleChange}
                    />
                    <div
                      className="invalid-feedback"
                      style={
                        this.state.error.pid !== ""
                          ? { display: "block" }
                          : { display: "none" }
                      }
                    >
                      {this.state.error.pid}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <div className="form-group" style={{ textAlign: "right" }}>
              <button
                type="button"
                className="btn btn-warning mb-2 mr-2"
                onClick={this.toggle}
              >
                <i className="ti-close" /> Cancel
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
    auth: state.auth,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(FormPrinter);
