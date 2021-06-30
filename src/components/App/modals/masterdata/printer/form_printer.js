import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { stringifyFormData } from "helper";
import { createPrinter, updatePrinter, readPrinter } from "redux/actions/masterdata/printer/printer.action";
import { isEmptyOrUndefined, rmSpaceToStrip } from "../../../../../helper";
import SelectCommon from "../../../common/SelectCommon";
import LokasiCommon from "../../../common/LokasiCommon";
class FormPrinter extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.state = {
      id_printer: "",
      lokasi: "",
      pid: "",
      vid: "",
      konektor: "",
      konektor_data: [
        { value: "lan", label: "lan" },
        { value: "usb", label: "usb" },
      ],
      ip: "",
      nama: "",
      ukuran_kertas: "",
      ukuran_kertas_data: [
        { value: "32", label: "32" },
        { value: "33", label: "33" },
        { value: "48", label: "48" },
      ],
    };
  }
  clearState() {
    this.setState({
      lokasi: "",
      pid: "",
      vid: "",
      konektor: "",
      ip: "",
      nama: "",
      id_printer: "",
      ukuran_kertas: "",
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
        ukuran_kertas: props.detail.paper_size,
        konektor: props.detail.konektor,
        lokasi: props.detail.lokasi,
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
    parseData["nama"] = state.nama;
    parseData["lokasi"] = state.lokasi;
    parseData["konektor"] = state.konektor;
    parseData["pid"] = rmSpaceToStrip(state.pid);
    parseData["vid"] = rmSpaceToStrip(state.vid);
    parseData["ip"] = rmSpaceToStrip(state.ip);
    parseData["paper_size"] = state.ukuran_kertas;

    if (!isEmptyOrUndefined(parseData["nama"], "nama")) return;
    if (!isEmptyOrUndefined(parseData["lokasi"], "lokasi")) return;
    if (!isEmptyOrUndefined(parseData["paper_size"], "ukuran kertas")) return;
    if (!isEmptyOrUndefined(parseData["konektor"], "konektor")) return;
    if (parseData["konektor"] === "usb") {
      if (!isEmptyOrUndefined(state.vid, "vid")) return;
      if (!isEmptyOrUndefined(state.pid, "pid")) return;
    }
    if (parseData["konektor"] === "lan") {
      if (!isEmptyOrUndefined(state.ip, "ip")) return;
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

  handleChangeSelect(state, val) {
    let setState = { [state]: val.value };
    if (val.value === "lan") {
      Object.assign(setState, { pid: "", vid: "" });
    }
    if (val.value === "usb") {
      Object.assign(setState, { ip: "" });
    }
    this.setState(setState);
  }

  render() {
    return (
      <WrapperModal isOpen={this.props.isOpen && this.props.type === "formPrinter"} size="md">
        <ModalHeader toggle={this.toggle}>{this.props.detail.id_printer === "" ? "Tambah Printer" : "Ubah Printer"}</ModalHeader>
        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Nama</label>
                  <input type="text" className="form-control" name="nama" value={this.state.nama} onChange={this.handleChange} />
                </div>
              </div>
              <div className="col-md-6">
                <LokasiCommon callback={(res) => this.handleChangeSelect("lokasi", res)} isRequired={true} dataEdit={this.state.lokasi} />
              </div>
              <div className="col-md-6">
                <SelectCommon
                  label="Ukuran kertas"
                  options={this.state.ukuran_kertas_data}
                  callback={(res) => this.handleChangeSelect("ukuran_kertas", res)}
                  isRequired={true}
                  dataEdit={this.state.ukuran_kertas}
                />
              </div>
              <div className="col-md-6">
                <SelectCommon label="Konektor" options={this.state.konektor_data} callback={(res) => this.handleChangeSelect("konektor", res)} isRequired={true} dataEdit={this.state.konektor} />
              </div>
            </div>

            {this.state.konektor === "lan" && (
              <div className="form-group">
                <label>IP address</label>
                <input type="text" className="form-control" name="ip" value={this.state.ip} onChange={this.handleChange} />
              </div>
            )}
            {this.state.konektor === "usb" && (
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Vid</label>
                    <input type="text" className="form-control" name="vid" value={this.state.vid} onChange={this.handleChange} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Pid</label>
                    <input type="text" className="form-control" name="pid" value={this.state.pid} onChange={this.handleChange} />
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <div className="form-group" style={{ textAlign: "right" }}>
              <button type="button" className="btn btn-warning mr-2" onClick={this.toggle}>
                <i className="ti-close" /> Batal
              </button>
              <button type="submit" className="btn btn-primary">
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
