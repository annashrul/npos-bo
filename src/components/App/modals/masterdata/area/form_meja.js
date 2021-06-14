import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import {
  createMeja,
  updateMeja,
} from "redux/actions/masterdata/meja/meja.action";
import Select from "react-select";

class FormMeja extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.HandleChangeArea = this.HandleChangeArea.bind(this);
    this.HandleChangeBentuk = this.HandleChangeBentuk.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      kapasitas: "",
      width: "",
      height: "",
      bentuk: "",
      area: "",
      jumlah: "",
      area_data: [],
      bentuk_data: [
        { value: "persegi", label: "Persegi" },
        { value: "lingkaran", label: "Lingkaran" },
        { value: "persegi panjang", label: "Persegi panjang" },
      ],
      id: "",
      user: "",
      error: {
        kapasitas: "",
        width: "",
        height: "",
        bentuk: "",
        area: "",
        jumlah: "",
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
  HandleChangeArea(ar) {
    let err = Object.assign({}, this.state.error, {
      area: "",
    });
    this.setState({
      area: ar,
      error: err,
    });
    localStorage.setItem("area_meja", ar);
  }
  HandleChangeBentuk(ar) {
    let err = Object.assign({}, this.state.error, {
      bentuk: "",
    });
    this.setState({
      bentuk: ar,
      error: err,
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.detail !== [] && nextProps.detail !== undefined) {
      let data = nextProps.area.filter(
        (item) => item.id_area === nextProps.detail.id_area
      );
      let dataBentuk = this.state.bentuk_data.filter(
        (item) => item.value === nextProps.detail.bentuk
      );

      this.setState({
        kapasitas: nextProps.detail.kapasitas,
        area: {
          value: data[0] === undefined ? "" : data[0].id_area,
          label: data[0] === undefined ? "" : data[0].nama,
        },
        height: nextProps.detail.height,
        width: nextProps.detail.width,
        bentuk: {
          value: dataBentuk[0] === undefined ? "" : dataBentuk[0].value,
          label: dataBentuk[0] === undefined ? "" : dataBentuk[0].label,
        },
        id: nextProps.detail.id,
      });
    } else {
      this.setState({
        nama: "",
        kapasitas: "",
        area: "",
        height: "",
        width: "",
        bentuk: "",
        id: "",
      });
    }
    if (nextProps.auth.user) {
      let ar = [];
      let are = nextProps.area;
      if (are !== undefined) {
        are.map((i) => {
          ar.push({
            value: i.id_area,
            label: i.nama,
          });
          return null;
        });
        this.setState({
          area_data: ar,
          userid: nextProps.auth.user.id,
        });
      }
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    let parseDataU = {};
    if (this.props.detail === undefined) {
      parseDataU["jumlah"] = parseInt(this.state.jumlah, 10);
      parseDataU["area"] = this.state.area.value;
    }

    parseDataU["kapasitas"] = parseInt(this.state.kapasitas, 10);
    parseDataU["height"] = parseInt(this.state.height, 10);
    parseDataU["width"] = parseInt(this.state.width, 10);
    parseDataU["bentuk"] = this.state.bentuk.value;
    let err = this.state.error;

    if (this.props.detail === undefined) {
      if (parseDataU["area"] === undefined) {
        err = Object.assign({}, err, {
          area: "area tidak boleh kosong",
        });
        this.setState({ error: err });
        return;
      }
      if (isNaN(parseDataU["jumlah"]) || parseDataU["jumlah"] < 1) {
        err = Object.assign({}, err, {
          jumlah: "jumlah meja tidak boleh kosong",
        });
        this.setState({ error: err });
        return;
      }
    }
    if (isNaN(parseDataU["width"]) || parseDataU["width"] < 1) {
      err = Object.assign({}, err, {
        width: "lebar tidak boleh kosong",
      });
      this.setState({ error: err });
      return;
    }
    if (isNaN(parseDataU["height"]) || parseDataU["height"] < 1) {
      err = Object.assign({}, err, {
        height: "panjang tidak boleh kosong",
      });
      this.setState({ error: err });
      return;
    }
    if (isNaN(parseDataU["kapasitas"]) || parseDataU["kapasitas"] < 1) {
      err = Object.assign({}, err, {
        kapasitas: "kapasitas tidak boleh kosong",
      });
      this.setState({ error: err });
      return;
    }
    if (parseDataU["bentuk"] === "" || parseDataU["bentuk"] === undefined) {
      err = Object.assign({}, err, {
        bentuk: "bentuk tidak boleh kosong",
      });
      this.setState({ error: err });
      return;
    }

    if (this.props.detail === undefined) {
      this.props.dispatch(createMeja(parseDataU));
    } else {
      this.props.dispatch(updateMeja(this.state.id, parseDataU));
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
        isOpen={this.props.isOpen && this.props.type === "formMeja"}
        size="md"
      >
        <ModalHeader toggle={this.toggle}>
          {this.props.detail === undefined ? "Add Meja" : "Update Meja"}
        </ModalHeader>
        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <div className="row">
              <div
                className="col-md-6"
                style={{
                  display: this.props.detail === undefined ? "block" : "none",
                }}
              >
                <div className="form-group">
                  <label>
                    Area <span className="text-danger">*</span>
                  </label>
                  <Select
                    options={this.state.area_data}
                    placeholder="Pilih Area"
                    onChange={this.HandleChangeArea}
                    value={this.state.area}
                  />
                  <div
                    className="invalid-feedback"
                    style={
                      this.state.error.area !== ""
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    {this.state.error.area}
                  </div>
                </div>
              </div>
              <div
                className="col-md-6"
                style={{
                  display: this.props.detail === undefined ? "block" : "none",
                }}
              >
                <div className="form-group">
                  <label>
                    Jumlah Meja <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    readOnly={this.props.detail === undefined ? false : true}
                    name="jumlah"
                    value={this.state.jumlah}
                    onChange={this.handleChange}
                  />
                  <div
                    className="invalid-feedback"
                    style={
                      this.state.error.jumlah !== ""
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    {this.state.error.jumlah}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>
                    Lebar <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="width"
                    value={this.state.width}
                    onChange={this.handleChange}
                  />
                  <div
                    className="invalid-feedback"
                    style={
                      this.state.error.width !== ""
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    {this.state.error.width}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>
                    Panjang <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="height"
                    value={this.state.height}
                    onChange={this.handleChange}
                  />
                  <div
                    className="invalid-feedback"
                    style={
                      this.state.error.height !== ""
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    {this.state.error.height}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>
                    Kapasitas <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="kapasitas"
                    value={this.state.kapasitas}
                    onChange={this.handleChange}
                  />
                  <div
                    className="invalid-feedback"
                    style={
                      this.state.error.kapasitas !== ""
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    {this.state.error.kapasitas}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>
                    Bentuk <span className="text-danger">*</span>
                  </label>
                  <Select
                    options={this.state.bentuk_data}
                    placeholder="Pilih bentuk meja"
                    onChange={this.HandleChangeBentuk}
                    value={this.state.bentuk}
                  />
                  <div
                    className="invalid-feedback"
                    style={
                      this.state.error.bentuk !== ""
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    {this.state.error.bentuk}
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
                Cancel
              </button>
              <button type="submit" className="btn btn-primary mb-2 mr-2">
                Simpan
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
export default connect(mapStateToProps)(FormMeja);
