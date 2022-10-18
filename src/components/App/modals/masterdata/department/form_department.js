import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { stringifyFormData } from "helper";
import {
  createDepartment,
  updateDepartment,
} from "redux/actions/masterdata/department/department.action";
import { isEmptyOrUndefined } from "../../../../../helper";
import ButtonActionForm from "../../../common/ButtonActionForm";

class FormDepartment extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      nama: "",
    };
  }
  resetState() {
    this.setState({
      nama: "",
    });
  }

  closeModal(e) {
    e.preventDefault();
    this.resetState();
    this.props.dispatch(ModalToggle(false));
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  getProps(props) {
    if (props.detail && props.detail.id !== "") {
      this.setState({
        nama: props.detail.nama,
      });
    } else {
      this.resetState();
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
    const form = e.target;
    let data = new FormData(form);
    let parseData = stringifyFormData(data);
    parseData["nama"] = this.state.nama;
    if (!isEmptyOrUndefined(parseData.nama, "nama")) return;
    if (this.props.detail.id === "") {
      this.props.dispatch(createDepartment(parseData));
    } else {
      Object.assign(parseData, { where: this.props.detail.where });
      this.props.dispatch(updateDepartment(this.props.detail.id, parseData));
    }
  }

  render() {
    console.log("props",this.props.detail);
    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === "formDepartment"}
        size="md"
      >
        <ModalHeader toggle={this.closeModal}>
          {this.props.detail.id === "" ? "Tambah " : "Ubah"} Departemen
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
          </ModalBody>
          <ModalFooter>
            <ButtonActionForm callback={this.closeModal} />
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
export default connect(mapStateToProps)(FormDepartment);
