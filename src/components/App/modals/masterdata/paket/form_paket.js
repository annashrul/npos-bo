import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { stringifyFormData } from "helper";
import { getMargin, rmComma, toCurrency } from "../../../../../helper";

class FormPaket extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      harga_beli: "",
      margin: "",
      harga_jual: "",
      error: {
        harga_beli: "",
        margin: "",
        harga_jual: "",
      },
    };
  }

  clearState() {
    this.setState({
      harga_beli: "",
      margin: "",
      harga_jual: "",
      error: {
        harga_beli: "",
        margin: "",
        harga_jual: "",
      },
    });
  }

  getProps(props) {
    console.log(props);

    this.setState({ harga_beli: props.detail.harga_beli });
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
  handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    let margin = 0;
    this.setState({ [name]: value });
    if (name === "harga_jual") {
      margin = getMargin(value, this.state.harga_beli);
    }
    if (name === "harga_beli") {
      margin = getMargin(this.state.harga_jual, value);
    }
    if (name === "margin") {
      margin = value;
      this.setState({
        harga_jual: getMargin(this.state.harga_beli, value, "margin"),
      });
    }

    let err = Object.assign({}, this.state.error, {
      [name]: "",
    });
    this.setState({
      error: err,
      margin: margin,
    });
  };
  closeModal(param, parseData = null) {
    this.props.dispatch(ModalToggle(false));
    this.clearState();
    if (param === "submit" && parseData !== null) {
      this.props.callback(parseData);
    } else {
      this.props.callback(null);
    }
  }
  toggle = (e) => {
    e.preventDefault();
    this.closeModal("close");
  };

  handleError(state) {
    let err = state.error;
    err = Object.assign({}, err, {
      [state]: `${state}`.replace("_", " ") + " tidak boleh kosong",
    });
    this.setState({ error: err });
  }
  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    let data = new FormData(form);
    let parseData = stringifyFormData(data);
    let state = this.state;
    parseData["harga_beli"] = rmComma(state.harga_beli);
    parseData["harga_jual"] = rmComma(state.harga_jual);
    parseData["margin"] = rmComma(state.harga_jual);
    if (isNaN(parseData["harga_beli"]) || parseData["harga_beli"] === 0) {
      this.handleError("harga_beli");
      return;
    }
    if (isNaN(parseData["margin"])) {
      this.handleError("margin");
      return;
    }
    if (isNaN(parseData["harga_jual"]) || parseData["harga_jual"] === 0) {
      this.handleError("harga_jual");
      return;
    }
    this.closeModal("submit", parseData);
  }

  render() {
    return (
      <WrapperModal isOpen={this.props.isOpen && this.props.type === "formPaket"} size="md">
        <ModalHeader toggle={this.toggle}>Ubah HPP {this.props.detail.nama}</ModalHeader>
        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label>Harga beli</label>
                  <input type="text" className="form-control" name="harga_beli" value={toCurrency(this.state.harga_beli)} onChange={this.handleChange} />
                  <div className="invalid-feedback" style={this.state.error.harga_beli !== "" ? { display: "block" } : { display: "none" }}>
                    {this.state.error.harga_beli}
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>Margin</label>
                  <input type="text" className="form-control" name="margin" value={toCurrency(this.state.margin)} onChange={this.handleChange} />
                  <div className="invalid-feedback" style={this.state.error.margin !== "" ? { display: "block" } : { display: "none" }}>
                    {this.state.error.margin}
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>Harga jual</label>
                  <input type="text" className="form-control" name="harga_jual" value={toCurrency(this.state.harga_jual)} onChange={this.handleChange} />
                  <div className="invalid-feedback" style={this.state.error.harga_jual !== "" ? { display: "block" } : { display: "none" }}>
                    {this.state.error.harga_jual}
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="form-group" style={{ textAlign: "right" }}>
              <button type="button" className="btn btn-warning mb-2 mr-2" onClick={this.toggle}>
                <i className="ti-close" /> Cancel
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
export default connect(mapStateToProps)(FormPaket);
