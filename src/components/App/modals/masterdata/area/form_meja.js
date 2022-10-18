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
import { handleError } from "../../../../../helper";

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
    };
  }
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  toggle = (e) => {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.setState({});
  };
  HandleChangeArea(ar) {
    this.setState({
      area: ar,
    });
  }
  HandleChangeBentuk(ar) {
    this.setState({
      bentuk: ar,
    });
  }
  getProps(props) {
    if (props.detail !== [] && props.detail !== undefined) {
      let data = props.area.filter(
        (item) => item.id_area === props.detail.id_area
      );
      let dataBentuk = this.state.bentuk_data.filter(
        (item) => item.value === props.detail.bentuk
      );

      this.setState({
        kapasitas: props.detail.kapasitas,
        area: {
          value: data[0] === undefined ? "" : data[0].id_area,
          label: data[0] === undefined ? "" : data[0].nama,
        },
        height: props.detail.height,
        width: props.detail.width,
        bentuk: {
          value: dataBentuk[0] === undefined ? "" : dataBentuk[0].value,
          label: dataBentuk[0] === undefined ? "" : dataBentuk[0].label,
        },
        id: props.detail.id,
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
    if (props.auth.user) {
      let ar = [];
      let are = props.area;
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
          userid: props.auth.user.id,
        });
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }
  componentDidMount() {
    this.getProps(this.props);
  }
  componentWillMount() {
    this.getProps(this.props);
  }
  handleSubmit(e) {
    e.preventDefault();
    let parseDataU = this.validError();
    if (this.props.detail === undefined) {
      this.props.dispatch(createMeja(parseDataU));
    } else {
      this.props.dispatch(
        updateMeja(this.state.id, parseDataU, this.props.detail.where)
      );
    }
  }
  validError() {
    let parseDataU = {};
    if (this.props.detail === undefined) {
      parseDataU["jumlah"] = parseInt(this.state.jumlah, 10);
      parseDataU["area"] = this.state.area.value;
    }
    parseDataU["kapasitas"] = parseInt(this.state.kapasitas, 10);
    parseDataU["height"] = parseInt(this.state.height, 10);
    parseDataU["width"] = parseInt(this.state.width, 10);
    parseDataU["bentuk"] = this.state.bentuk.value;
    if (this.props.detail === undefined) {
      if (parseDataU["area"] === undefined) {
        handleError("area");
        return false;
      }
      if (isNaN(parseDataU["jumlah"]) || parseDataU["jumlah"] < 1) {
        handleError("jumlah meja");
        return false;
      }
    }
    if (isNaN(parseDataU["width"]) || parseDataU["width"] < 1) {
      handleError("lebar");
      return false;
    }
    if (isNaN(parseDataU["height"]) || parseDataU["height"] < 1) {
      handleError("tinggi meja");
      return false;
    }
    if (isNaN(parseDataU["kapasitas"]) || parseDataU["kapasitas"] < 1) {
      handleError("kapasitas");
      return false;
    }
    if (parseDataU["bentuk"] === "" || parseDataU["bentuk"] === undefined) {
      handleError("bentuk");
      return false;
    }
    return parseDataU;
  }


  render() {
    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === "formMeja"}
        size="md"
      >
        <ModalHeader toggle={this.toggle}>
          {this.props.detail === undefined ? "Tambah Meja" : "Ubah Meja"}
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
                    readOnly={this.props.detail !== undefined}
                    name="jumlah"
                    value={this.state.jumlah}
                    onChange={this.handleChange}
                  />
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
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button type="button" className="btn btn-warning mb-2 mr-2" onClick={this.toggle}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary mb-2">
              Simpan
            </button>
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
