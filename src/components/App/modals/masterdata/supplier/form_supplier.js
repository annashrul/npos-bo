import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { stringifyFormData } from "helper";
import {
  createSupplier,
  updateSupplier,
} from "redux/actions/masterdata/supplier/supplier.action";
class FormSupplier extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      kode: "",
      nama: "",
      alamat: "",
      kota: "",
      telp: "",
      penanggung_jawab: "",
      no_penanggung_jawab: "",
      status: "",
      email: "",
      error: {
        kode: "",
        nama: "",
        alamat: "",
        kota: "",
        telp: "",
        penanggung_jawab: "",
        no_penanggung_jawab: "",
        status: "",
        email: "",
      },
    };
  }
  getProps(param) {
    if (param.detail !== [] && param.detail !== undefined) {
      this.setState({
        kode: param.detail.kode,
        nama: param.detail.nama,
        alamat: param.detail.alamat,
        kota: param.detail.kota,
        telp: param.detail.telp,
        penanggung_jawab: param.detail.penanggung_jawab,
        no_penanggung_jawab: param.detail.no_penanggung_jawab,
        status: param.detail.status,
        email: param.detail.email,
      });
    } else {
      this.setState({
        kode: "",
        nama: "",
        alamat: "",
        kota: "",
        telp: "",
        penanggung_jawab: "",
        no_penanggung_jawab: "",
        status: "",
        email: "",
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }
  componentWillMount() {
    this.getProps(this.props);
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    let err = Object.assign({}, this.state.error, { [event.target.name]: "" });
    this.setState({ error: err });
  };
  toggle(e) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    let data = new FormData(form);
    let parseData = stringifyFormData(data);
    parseData["nama"] = this.state.nama;
    parseData["alamat"] = this.state.alamat;
    parseData["kota"] = this.state.kota;
    parseData["telp"] = this.state.telp;
    parseData["penanggung_jawab"] = this.state.penanggung_jawab;
    parseData["no_penanggung_jawab"] = this.state.no_penanggung_jawab;
    parseData["status"] = this.state.status;
    parseData["email"] = this.state.email;
    let err = this.state.error;
    if (parseData["nama"] === "" || parseData["nama"] === undefined) {
      err = Object.assign({}, err, { nama: "nama tidak boleh kosong" });
      this.setState({ error: err });
    } else if (
      parseData["alamat"] === "" ||
      parseData["alamat"] === undefined
    ) {
      err = Object.assign({}, err, { alamat: "alamat tidak boleh kosong" });
      this.setState({ error: err });
    } else if (parseData["kota"] === "" || parseData["kota"] === undefined) {
      err = Object.assign({}, err, { kota: "kota tidak boleh kosong" });
      this.setState({ error: err });
    } else if (parseData["telp"] === "" || parseData["telp"] === undefined) {
      err = Object.assign({}, err, { telp: "telepon tidak boleh kosong" });
      this.setState({ error: err });
    } else if (
      parseData["penanggung_jawab"] === "" ||
      parseData["penanggung_jawab"] === undefined
    ) {
      err = Object.assign({}, err, {
        penanggung_jawab: "penanggung jawab tidak boleh kosong",
      });
      this.setState({ error: err });
    } else if (
      parseData["no_penanggung_jawab"] === "" ||
      parseData["no_penanggung_jawab"] === undefined
    ) {
      err = Object.assign({}, err, {
        no_penanggung_jawab: "no penanggung jawab tidak boleh kosong",
      });
      this.setState({ error: err });
    } else if (parseData["email"] === "" || parseData["email"] === undefined) {
      err = Object.assign({}, err, { email: "email tidak boleh kosong" });
      this.setState({ error: err });
    } else if (
      parseData["status"] === "" ||
      parseData["status"] === undefined
    ) {
      err = Object.assign({}, err, { status: "status tidak boleh kosong" });
      this.setState({ error: err });
    } else {
      if (this.props.detail !== undefined) {
        this.props.dispatch(updateSupplier(this.state.kode, parseData));
        this.props.dispatch(ModalToggle(false));
      } else {
        this.props.dispatch(createSupplier(parseData));
        this.props.dispatch(ModalToggle(false));
      }
    }
  }

  render() {
    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === "formSupplier"}
        size="lg"
      >
        <ModalHeader toggle={this.toggle}>
          {this.props.detail === undefined
            ? "Tambah Supplier"
            : "Ubah Supplier"}
        </ModalHeader>
        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <div className="row">
              <div className="col-6">
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
                  <label>Alamat</label>
                  <input
                    type="text"
                    className="form-control"
                    name="alamat"
                    value={this.state.alamat}
                    onChange={this.handleChange}
                  />
                  <div
                    className="invalid-feedback"
                    style={
                      this.state.error.alamat !== ""
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    {this.state.error.alamat}
                  </div>
                </div>
                <div className="form-group">
                  <label>Kota</label>
                  <input
                    type="text"
                    className="form-control"
                    name="kota"
                    value={this.state.kota}
                    onChange={this.handleChange}
                  />
                  <div
                    className="invalid-feedback"
                    style={
                      this.state.error.kota !== ""
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    {this.state.error.kota}
                  </div>
                </div>
                <div className="form-group">
                  <label>Telepon</label>
                  <input
                    type="number"
                    className="form-control"
                    name="telp"
                    value={this.state.telp}
                    onChange={this.handleChange}
                  />
                  <div
                    className="invalid-feedback"
                    style={
                      this.state.error.telp !== ""
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    {this.state.error.telp}
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <label>Penanggung Jawab</label>
                  <input
                    type="text"
                    className="form-control"
                    name="penanggung_jawab"
                    value={this.state.penanggung_jawab}
                    onChange={this.handleChange}
                  />
                  <div
                    className="invalid-feedback"
                    style={
                      this.state.error.penanggung_jawab !== ""
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    {this.state.error.penanggung_jawab}
                  </div>
                </div>
                <div className="form-group">
                  <label>No Penanggung Jawab</label>
                  <input
                    type="text"
                    className="form-control"
                    name="no_penanggung_jawab"
                    value={this.state.no_penanggung_jawab}
                    onChange={this.handleChange}
                  />
                  <div
                    className="invalid-feedback"
                    style={
                      this.state.error.no_penanggung_jawab !== ""
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    {this.state.error.no_penanggung_jawab}
                  </div>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                  <div
                    className="invalid-feedback"
                    style={
                      this.state.error.email !== ""
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    {this.state.error.email}
                  </div>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    className="form-control"
                    id="type"
                    value={this.state.status}
                    onChange={this.handleChange}
                  >
                    <option value="">Pilih Status</option>
                    <option value="0">Tidak Aktif</option>
                    <option value="1">Aktif</option>
                  </select>
                  <div
                    className="invalid-feedback"
                    style={
                      this.state.error.status !== ""
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    {this.state.error.status}
                  </div>
                </div>
              </div>
            </div>
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
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(FormSupplier);
