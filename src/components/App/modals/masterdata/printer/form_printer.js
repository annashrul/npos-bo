import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { stringifyFormData } from "helper";
import {
  createPrinter,
  updatePrinter,
  readPrinter,
} from "redux/actions/masterdata/printer/printer.action";
import Select from "react-select";
import { handleError, rmSpaceToStrip } from "../../../../../helper";

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
      id_printer: "",
    });
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  toggle = (e) => {
    e.preventDefault();
    if (this.props.fastAdd === undefined) {
      const bool = !this.props.isOpen;
      this.props.dispatch(ModalToggle(bool));
    }

    if (this.props.fastAdd === true) {
      this.props.dispatch(ModalType("formProduct"));
      this.props.dispatch(readPrinter("page=1&perpage=99999", true));
    }

    this.clearState();
  };
  getProps(props) {
    if (props.detail.id_printer !== "") {
      this.setState({
        nama: props.detail.nama,
        konektor: {
          value: `${props.detail.konektor}`.toLowerCase(),
          label: `${props.detail.konektor}`.toLowerCase(),
        },
        pid: props.detail.pid,
        vid: props.detail.vid,
        ip: props.detail.ip,
        id_printer: props.detail.id_printer,
      });
    }
  }

  componentWillMount() {
    this.getProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }
  componentDidMount() {
    this.getProps(this.props);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    let data = new FormData(form);
    let parseData = stringifyFormData(data);
    let state = this.state;
    parseData["pid"] = rmSpaceToStrip(state.pid);
    parseData["vid"] = rmSpaceToStrip(state.vid);
    parseData["konektor"] = state.konektor.value;
    parseData["ip"] = rmSpaceToStrip(state.ip);
    parseData["nama"] = state.nama;

    if (state.nama === "" || state.nama === undefined) {
      handleError("nama");
      return;
    }
    if (state.konektor.value === "" || state.konektor.value === undefined) {
      handleError("konektor");
      return;
    }
    if (state.konektor.value === "usb") {
      if (state.vid === "" || state.vid === undefined) {
        handleError("vid");
        return;
      }
      if (state.pid === "" || state.pid === undefined) {
        handleError("pid");
        return;
      }
    }
    if (state.konektor.value === "lan") {
      if (state.ip === "" || state.ip === undefined) {
        handleError("ip");
        return;
      }
    }

    if (this.props.detail.id_printer === "") {
      this.props.dispatch(
        createPrinter(parseData, (status) => {
          if (status) {
            this.clearState();
          }
        })
      );
      if (this.props.fastAdd === undefined) {
        this.props.dispatch(ModalToggle(false));
      }
      if (this.props.fastAdd === true) {
        this.props.dispatch(ModalType("formProduct"));
      }
    } else {
      this.props.dispatch(
        updatePrinter(
          this.props.detail.id_printer,
          parseData,
          (status) => {
            if (status) {
              this.clearState();
              this.props.dispatch(ModalToggle(false));
            }
          },
          this.props.detail.where
        )
      );
    }
  }

  handleChangeKonektor(lk) {
    let setState = { konektor: lk };
    if (lk.value === "lan") {
      Object.assign(setState, { pid: "", vid: "" });
    }
    if (lk.value === "usb") {
      Object.assign(setState, { ip: "" });
    }
    this.setState(setState);
  }
  render() {
    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === "formPrinter"}
        size="md"
      >
        <ModalHeader toggle={this.toggle}>
          {this.props.detail.id_printer === ""
            ? "Tambah Printer"
            : "Ubah Printer"}
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
            </div>
            <div className="form-group">
              <label>Konektor</label>
              <Select
                options={this.state.konektor_data}
                placeholder="Pilih konektor"
                onChange={this.handleChangeKonektor}
                value={this.state.konektor}
              />
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
    auth: state.auth,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(FormPrinter);
