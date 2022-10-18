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
import LokasiCommon from "../../../common/LokasiCommon";
import {handleError, isEmptyOrUndefined} from "../../../../../helper";

class FormArea extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      nama: "",
      location: "",
      gambar: "",
      id: "",
    };
  }
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  toggle = (e) => {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.clearState();
  };
  clearState() {
    this.setState({
      nama: "",
      id: "",
      location: "",
      gambar: "",
    });
  }
  getProps(props) {
    if (props.detail.id !== "") {
      this.setState({
        location: props.detail.id_lokasi,
        nama: props.detail.nama,
        gambar: props.detail.gambar,
        id: props.detail.id,
      });
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
  componentDidMount() {
    this.getProps(this.props);
  }
  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    let data = new FormData(form);
    let parseData = stringifyFormData(data);
    parseData["nama"] = this.state.nama;
    parseData["foto"] = this.state.gambar === undefined ? "-" : this.state.gambar.base64;
    parseData["lokasi"] = this.state.location;
    console.log(parseData)
    if (parseData["lokasi"] === undefined) {
      return handleError("lokasi");
    } else if (this.state.nama === undefined || this.state.nama === "") {
      return handleError("nama");
    } else {
      if (this.props.detail.id === '') {
        this.props.dispatch(createArea(parseData));
      } else {
        this.props.dispatch(updateArea(this.state.id, parseData, this.props.detail.where));
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
          {this.props.detail.id === "" ? "Tambah Area" : "Ubah Area"}
        </ModalHeader>
        <form onSubmit={this.handleSubmit}>
          <ModalBody>

            <div className="form-group">
              <label>
                Nama <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="nama"
                value={this.state.nama}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <LokasiCommon
                  isRequired={true}
                  callback={(val) => {
                      this.setState({ location: val.value });
                  }}
                  dataEdit={this.state.location}
              />
            </div>
            <div className="form-group">
              <label htmlFor="inputState" className="col-form-label">
                Foto{" "}
                {this.props.detail.id !== '' ? (
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
            </div>
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
export default connect(mapStateToProps)(FormArea);
