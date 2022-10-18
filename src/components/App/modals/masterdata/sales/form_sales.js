import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { stringifyFormData } from "helper";
import { createSales, updateSales } from "redux/actions/masterdata/sales/sales.action";

import LokasiCommon from "../../../common/LokasiCommon";
import IsActiveStatus from "../../../common/IsActiveCommon";
import { isEmptyOrUndefined } from "../../../../../helper";

class FormSales extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      nama: "",
      status: "",
      location: "",
      kode: "",
    };
  }
  getProps(param) {
    if (param.detail !== [] && param.detail !== undefined) {
      console.log(param.detail);
      this.setState({
        nama: param.detail.nama,
        status: param.detail.status,
        kode: param.detail.kode,
        location: param.detail.lokasi,
      });
    } else {
      this.setState({
        nama: "",
        status: "",
        kode: "",
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }
  componentDidMount() {
    this.getProps(this.props);
  }

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
    parseData["status"] = this.state.status;
    parseData["lokasi"] = this.state.location;
    parseData["kode"] = this.state.kode;

    if (!isEmptyOrUndefined(parseData["nama"], "nama")) return;
    if (!isEmptyOrUndefined(parseData["lokasi"], "lokasi")) return;
    if (!isEmptyOrUndefined(parseData["status"], "status")) return;

    if (this.props.detail !== undefined) {
      this.props.dispatch(updateSales(this.state.kode, parseData));
    } else {
      this.props.dispatch(createSales(parseData));
    }
  }

  render() {
    return (
      <WrapperModal isOpen={this.props.isOpen && this.props.type === "formSales"} size="md">
        <ModalHeader toggle={this.toggle}>{this.props.detail === undefined ? "Tambah Sales" : "Ubah Sales"}</ModalHeader>
        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <div className="form-group">
              <label>Nama</label>
              <input type="text" className="form-control" name="nama" value={this.state.nama} onChange={(e) => this.setState({ nama: e.target.value })} />
            </div>
            <LokasiCommon callback={(res) => this.setState({ location: res.value })} isRequired={true} dataEdit={this.state.location} />
            <IsActiveStatus callback={(res) => this.setState({ status: res.value })} isRequired={true} dataEdit={this.state.status} />
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
export default connect(mapStateToProps)(FormSales);
