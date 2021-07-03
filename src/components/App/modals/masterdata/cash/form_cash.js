import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { createCash, updateCash } from "redux/actions/masterdata/cash/cash.action";
import { stringifyFormData } from "helper";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import SelectCommon from "../../../common/SelectCommon";
import { isEmptyOrUndefined } from "../../../../../helper";

class FormCash extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      title: "",
      jenis: "",
      type: "",
      jenis_data: [
        { value: "0", label: "Kas kecil" },
        { value: "1", label: "Kas besar" },
      ],
    };
  }
  getProps(param) {
    let state = { type: param.detail.tipe };
    if (this.props.detail.id !== "") {
      Object.assign(state, {
        title: param.detail.title,
        jenis: `${param.detail.jenis}`,
      });
    }
    this.setState(state);
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

  isTypeRule(type) {
    return type === "masuk" ? "0" : "1";
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    let data = new FormData(form);
    let parseData = stringifyFormData(data);
    parseData["title"] = this.state.title;
    parseData["jenis"] = this.state.jenis;
    parseData["type"] = this.isTypeRule(this.state.type);
    if (!isEmptyOrUndefined(parseData["jenis"], "jenis kas")) return;
    if (!isEmptyOrUndefined(parseData["title"], "catatan kas")) return;

    if (this.props.detail.id === "") {
      this.props.dispatch(createCash(parseData, `page=1&type=${this.state.type}`));
    } else {
      this.props.dispatch(updateCash(this.props.detail.id, parseData, this.props.detail.where));
    }
  }
  toggle = (e) => {
    e.preventDefault();
    this.props.dispatch(ModalToggle(false));
    this.setState({});
  };
  render() {
    return (
      <WrapperModal isOpen={this.props.isOpen && this.props.type === "formCash"} size="md">
        <ModalHeader toggle={this.toggle}>{this.props.detail.id === "" ? "Tambah" : "Ubah"} kas</ModalHeader>
        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <div className="form-group">
              <label>Tipe kas</label>
              <input type="text" className="form-control" name="type" value={this.state.type} disabled={true} />
            </div>
            <SelectCommon label="Jenis" options={this.state.jenis_data} callback={(res) => this.setState({ jenis: res.value })} isRequired={true} dataEdit={this.state.jenis} />
            <div className="form-group">
              <label>
                Catatan <span className="text-danger">*</span>
              </label>
              <input type="text" className="form-control" name="title" value={this.state.title} onChange={this.handleChange} />
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
export default connect(mapStateToProps)(FormCash);
