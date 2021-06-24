import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { stringifyFormData, isEmptyOrUndefined } from "helper";
import {
  createCustomerType,
  updateCustomerType,
} from "redux/actions/masterdata/customer_type/customer_type.action";
class FormCustomerType extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      kode: "",
      nama: "",
    };
  }

  getProps(props) {
    if (props.detail.id !== "") {
      this.setState({
        kode: props.detail.kode,
        nama: props.detail.nama,
      });
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

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  toggle(e) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
  }

  handleSubmit(e) {
    e.preventDefault();
    let parseData = {};
    parseData["nama"] = this.state.nama;
    if (!isEmptyOrUndefined(parseData["nama"], "nama")) return;
    if (this.props.detail.id !== "") {
      this.props.dispatch(
        updateCustomerType(this.state.kode, parseData, this.props.detail.where)
      );
    } else {
      this.props.dispatch(createCustomerType(parseData));
    }
  }

  render() {
    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === "formCustomerType"}
      >
        <ModalHeader toggle={this.toggle}>
          {this.props.detail.id === "" ? "Tambah" : "Ubah"} tipe Customer
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
          </ModalBody>
          <ModalFooter>
            <div className="form-group" style={{ textAlign: "right" }}>
              <button
                type="button"
                className="btn btn-warning mr-2"
                onClick={this.toggle}
              >
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
export default connect(mapStateToProps)(FormCustomerType);
