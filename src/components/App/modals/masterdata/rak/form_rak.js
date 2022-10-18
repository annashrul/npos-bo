import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import FileBase64 from "react-file-base64";
import { stringifyFormData } from "helper";
import { createRak } from "redux/actions/masterdata/rak/rak.action";
import { FetchRak, updateRak } from "../../../../../redux/actions/masterdata/rak/rak.action";
import IsActiveCommon from "../../../common/IsActiveCommon";
import { isEmptyOrUndefined } from "../../../../../helper";
import { ModalType } from "../../../../../redux/actions/modal.action";
class FormRak extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      id: "",
      title: "",
    };
  }
  componentWillMount() {
    this.getProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }
  getProps(param) {
    if (Object.keys(param.detail).length > 0) {
      this.setState({
        id: param.detail.id,
        title: param.detail.title,
      });
    } else {
      this.setState({
        id: "",
        title: "",
      });
    }
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
      this.props.dispatch(FetchRak("page=1&perpage=9999"));
    }
  };
  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    let data = new FormData(form);
    let parseData = stringifyFormData(data);
    parseData["title"] = this.state.title;

    if (!isEmptyOrUndefined(parseData["title"], "title")) return;

    if (this.props.detail.id === undefined || this.props.fastAdd) {
      this.props.dispatch(createRak(parseData));
      if (this.props.fastAdd === undefined) {
        this.props.dispatch(ModalToggle(false));
      }
      if (this.props.fastAdd === true) {
        this.props.dispatch(ModalType("formProduct"));
        // this.props.dispatch(ModalToggle(true));
        // this.props.dispatch(ModalType("formProduct"));
      }
    } else {
      this.props.dispatch(updateRak(this.state.id, parseData));
      this.props.dispatch(ModalToggle(false));
    }
  }
  getFiles(files) {
    this.setState({
      foto: files,
    });
  }

  render() {
    return (
      <WrapperModal isOpen={this.props.isOpen && this.props.type === "formRak"} size="sm">
        <ModalHeader toggle={this.toggle}>{this.props.detail.id === undefined || this.props.fastAdd ? "Tambah Rak" : "Ubah Rak"}</ModalHeader>
        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Nama Rak</label>
                  <input type="text" className="form-control" name="title" value={this.state.title} onChange={this.handleChange} />
                </div>
              </div>
            </div>
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
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(FormRak);
