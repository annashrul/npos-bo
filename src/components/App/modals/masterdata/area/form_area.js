import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { stringifyFormData } from "helper";
import FileBase64 from "react-file-base64";
import {
  createArea,
  updateArea,
} from "redux/actions/masterdata/area/area.action";
import Select from "react-select";

class FormArea extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      nama: "",
      location_data: [],
      location: "",
      gambar: "",
      id: "",
      user: "",
      error: {
        nama: "",
        location: "",
        gambar: "",
      },
    };
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
    this.setState({});
  };
  HandleChangeLokasi(lk) {
    let err = Object.assign({}, this.state.error, {
      location: "",
    });
    this.setState({
      location: lk,
      error: err,
    });
    localStorage.setItem("location_area", lk);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.detail !== [] && nextProps.detail !== undefined) {
      let data = this.state.location_data.filter(
        (item) => item.value === nextProps.detail.lokasi
      );

      this.setState({
        nama: nextProps.detail.nama,
        location: data,
        gambar: nextProps.detail.gambar,
        id: nextProps.detail.id,
      });
    } else {
      this.setState({
        nama: "",
        id: "",
      });
    }

    if (nextProps.auth.user) {
      let lk = [];
      let loc = nextProps.auth.user.lokasi;
      if (loc !== undefined) {
        loc.map((i) => {
          lk.push({
            value: i.kode,
            label: i.nama,
          });
          return null;
        });
        this.setState({
          location_data: lk,
          userid: nextProps.auth.user.id,
        });
      }
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    let data = new FormData(form);
    let parseData = stringifyFormData(data);
    parseData["nama"] = this.state.nama;
    parseData["gambar"] =
      this.state.gambar === undefined ? "-" : this.state.gambar.base64;
    parseData["lokasi"] = this.state.location.value;
    let err = this.state.error;
    if (this.state.nama === "" || this.state.nama === undefined) {
      err = Object.assign({}, err, { nama: "nama tidak boleh kosong" });
      this.setState({ error: err });
      return;
    } else if (
      this.state.location === "" ||
      this.state.location === undefined
    ) {
      err = Object.assign({}, err, { location: "lokasi tidak boleh kosong" });
      this.setState({ error: err });
      return;
    } else {
      if (this.props.detail === undefined) {
        this.props.dispatch(createArea(parseData));
      } else {
        this.props.dispatch(updateArea(this.state.id, parseData));
      }
    }
  }

  getFiles(files) {
    this.setState({
      gambar: files,
    });
  }
  render() {
    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === "formArea"}
        size="md"
      >
        <ModalHeader toggle={this.toggle}>
          {this.props.detail === undefined ? "Add Area" : "Update Area"}
        </ModalHeader>
        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <div className="form-group">
              <label>Lokasi</label>
              <Select
                options={this.state.location_data}
                placeholder="Pilih Lokasi"
                onChange={this.HandleChangeLokasi}
                value={this.state.location}
              />
              <div
                className="invalid-feedback"
                style={
                  this.state.error.location !== ""
                    ? { display: "block" }
                    : { display: "none" }
                }
              >
                {this.state.error.location}
              </div>
            </div>
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
              <label htmlFor="inputState" className="col-form-label">
                Foto{" "}
                {this.props.dataCustomerEdit !== undefined ? (
                  <small>(kosongkan bila tidak akan diubah)</small>
                ) : (
                  ""
                )}
              </label>
              <br />
              <FileBase64
                multiple={false}
                name="gambar"
                className="mr-3 form-control-file"
                onDone={this.getFiles.bind(this)}
              />
              <div
                className="invalid-feedback"
                style={
                  this.state.error.gambar !== ""
                    ? { display: "block" }
                    : { display: "none" }
                }
              >
                {this.state.error.gambar}
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
    auth: state.auth,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(FormArea);
