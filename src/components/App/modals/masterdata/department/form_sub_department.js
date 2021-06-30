import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { stringifyFormData } from "helper";
import { createSubDepartment, updateSubDepartment } from "redux/actions/masterdata/department/sub_department.action";
import SelectCommon from "../../../common/SelectCommon";
import ButtonActionForm from "../../../common/ButtonActionForm";
import { handleDataSelect, isEmptyOrUndefined } from "../../../../../helper";

class FormSubDepartment extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      dept_data: [],
      kode: "",
      nama: "",
      kode_dept: "",
    };
  }
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  closeModal(e) {
    e.preventDefault();
    this.resetState();
    this.props.dispatch(ModalToggle(false));
  }

  resetState() {
    this.setState({
      nama: "",
      kode: "",
      kode_dept: "",
    });
  }
  getProps(param) {
    let kode_departemen = "";
    if (param.dataDepartment !== undefined && param.dataDepartment !== []) {
      let depProps = param.dataDepartment.data;
      if (depProps !== undefined) {
        kode_departemen = depProps.filter((res) => res.nama === param.detail.departement);
        this.setState({
          dept_data: handleDataSelect(depProps, "id", "nama"),
        });
      }
    }

    console.log("###################", param);
    if (this.props.detail === undefined || this.props.detail.id === "") {
      this.resetState();
    } else {
      this.setState({
        nama: param.detail.nama,
        kode: param.detail.kode,
        kode_dept: kode_departemen[0].id,
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }
  componentWillMount() {
    this.getProps(this.props);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    let data = new FormData(form);
    let parseData = stringifyFormData(data);
    parseData["kode_dept"] = this.state.kode_dept;
    parseData["nama"] = this.state.nama;
    if (!isEmptyOrUndefined(parseData.kode_dept, "Departemen")) return;
    if (!isEmptyOrUndefined(parseData.nama, "Nama")) return;
    if (this.props.detail.id === "") {
      this.props.dispatch(createSubDepartment(parseData));
    } else {
      Object.assign(parseData, { where: this.props.detail.where });
      this.props.dispatch(updateSubDepartment(this.state.kode, parseData));
    }
  }

  render() {
    return (
      <WrapperModal isOpen={this.props.isOpen && this.props.type === "formSubDepartment"} size="md">
        <ModalHeader toggle={this.closeModal}>{this.props.detail === undefined || this.props.detail.id === "" ? "Tambah" : "Ubah"} Sub Departemen</ModalHeader>
        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <SelectCommon label="Departemen" options={this.state.dept_data} callback={(res) => this.setState({ kode_dept: res.value })} dataEdit={this.state.kode_dept} />

            <div className="form-group">
              <label>Nama</label>
              <input type="text" className="form-control" name="nama" value={this.state.nama} onChange={this.handleChange} />
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
export default connect(mapStateToProps)(FormSubDepartment);
