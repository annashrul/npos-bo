import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import FileBase64 from "react-file-base64";
import { stringifyFormData } from "helper";
import { createBank } from "redux/actions/masterdata/bank/bank.action";
import { updateBank } from "../../../../../redux/actions/masterdata/bank/bank.action";
import IsActiveCommon from "../../../common/IsActiveCommon";
import { isEmptyOrUndefined } from "../../../../../helper";
class FormBank extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      id: "",
      akun: "",
      nama: "",
      edc: "1",
      status: "1",
      charge_debit: "0",
      charge_kredit: "0",
      foto: "-",
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
        akun: param.detail.akun,
        nama: param.detail.nama,
        edc: param.detail.edc,
        status: param.detail.status,
        charge_debit: param.detail.charge_debit,
        charge_kredit: param.detail.charge_kredit,
        foto: "-",
      });
    } else {
      this.setState({
        id: "",
        akun: "",
        nama: "",
        edc: "1",
        status: "1",
        charge_debit: "0",
        charge_kredit: "0",
        foto: "-",
      });
    }
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
  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    let data = new FormData(form);
    let parseData = stringifyFormData(data);
    parseData["nama"] = this.state.nama;
    parseData["akun"] = this.state.akun;
    parseData["edc"] = this.state.edc;
    parseData["status"] = this.state.status;
    parseData["charge_debit"] = this.state.charge_debit;
    parseData["charge_kredit"] = this.state.charge_kredit;
    parseData["foto"] = this.state.foto === "-" ? "-" : this.state.foto.base64;
    if (!isEmptyOrUndefined(parseData["akun"], "akun")) return;
    if (!isEmptyOrUndefined(parseData["nama"], "nama")) return;
    if (!isEmptyOrUndefined(parseData["charge_debit"], "charge debit")) return;
    if (!isEmptyOrUndefined(parseData["charge_kredit"], "charge kredit"))
      return;
    if (!isEmptyOrUndefined(parseData["edc"], "status")) return;
    if (!isEmptyOrUndefined(parseData["status"], "status")) return;
    if (Object.keys(this.props.detail).length > 0) {
      this.props.dispatch(updateBank(this.state.id, parseData));
    } else {
      this.props.dispatch(createBank(parseData));
    }
  }
  getFiles(files) {
    this.setState({
      foto: files,
    });
  }

  render() {
    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === "formBank"}
        size="md"
      >
        <ModalHeader toggle={this.toggle}>
          {Object.keys(this.props.detail).length > 0
            ? "Ubah Bank"
            : "Tambah Bank"}
        </ModalHeader>
        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Nama Akun</label>
                  <input
                    type="text"
                    className="form-control"
                    name="akun"
                    value={this.state.akun}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Nama Bank</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nama"
                    value={this.state.nama}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>Charge debit</label>
                  <input
                    type="text"
                    className="form-control"
                    name="charge_debit"
                    value={this.state.charge_debit}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Charge credit</label>
                  <input
                    type="text"
                    className="form-control"
                    name="charge_kredit"
                    value={this.state.charge_kredit}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <IsActiveCommon
                  label="EDC"
                  callback={(res) => this.setState({ edc: res.value })}
                  dataEdit={this.state.edc}
                  isRequied={true}
                />
              </div>
              <div className="col-md-6">
                <IsActiveCommon
                  callback={(res) => this.setState({ status: res.value })}
                  dataEdit={this.state.status}
                  isRequied={true}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="inputState" className="col-form-label">
                Foto
              </label>
              <br />
              <FileBase64
                multiple={false}
                className="mr-3 form-control-file"
                onDone={this.getFiles.bind(this)}
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
export default connect(mapStateToProps)(FormBank);
