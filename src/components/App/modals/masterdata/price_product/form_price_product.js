import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { stringifyFormData } from "helper";
import { updatePriceProduct } from "../../../../../redux/actions/masterdata/price_product/price_product.action";
import {
  handleError,
  isEmptyOrUndefined,
  rmComma,
  toCurrency,
} from "../../../../../helper";

import ButtonActionForm from "../../../common/ButtonActionForm";

class FormPriceProduct extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      id: "",
      harga: "0",
      harga2: "0",
      harga3: "0",
      harga4: "0",
      ppn: "0",
      service: "0",
      harga_beli: "0",
    };
  }
  closeModal(e) {
    e.preventDefault();
    this.resetState();
    this.props.dispatch(ModalToggle(false));
  }
  resetState() {
    this.setState({
      id: "",
      harga: "0",
      harga2: "0",
      harga3: "0",
      harga4: "0",
      ppn: "0",
      service: "0",
      harga_beli: "0",
    });
  }
  getProps(param) {
    if (param.detail.id !== "") {
      this.setState({
        id: param.detail.id,
        harga: param.detail.harga,
        harga2: param.detail.harga2,
        harga3: param.detail.harga3,
        harga4: param.detail.harga4,
        ppn: param.detail.ppn,
        service: param.detail.service,
        harga_beli: param.detail.harga_beli,
      });
    } else {
      this.resetState();
    }
  }
  componentWillMount() {
    this.getProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    let data = new FormData(form);
    let parseData = stringifyFormData(data);
    parseData["harga"] = rmComma(this.state.harga);
    parseData["ppn"] = rmComma(this.state.ppn);
    parseData["service"] = rmComma(this.state.service);
    parseData["harga2"] = rmComma(this.state.harga2);
    parseData["harga3"] = rmComma(this.state.harga3);
    parseData["harga4"] = rmComma(this.state.harga4);
    parseData["harga_beli"] = rmComma(this.state.harga_beli);
    if (!isEmptyOrUndefined(parseData.harga_beli, "harga beli")) return;
    if (!isEmptyOrUndefined(parseData.harga, "harga 1")) return;
    if (!isEmptyOrUndefined(parseData.harga2, "harga 2")) return;
    if (!isEmptyOrUndefined(parseData.harga3, "harga 3")) return;
    if (!isEmptyOrUndefined(parseData.harga4, "harga 4")) return;
    if (!isEmptyOrUndefined(parseData.ppn, "ppn")) return;
    if (!isEmptyOrUndefined(parseData.service, "service")) return;
    this.props.dispatch(
      updatePriceProduct(this.state.id, parseData, this.props.detail.where)
    );
  }

  render() {
    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === "formPriceProduct"}
        size="md"
      >
        <ModalHeader toggle={this.closeModal}>Ubah Harga Barang</ModalHeader>
        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <div className="form-group">
              <label>Harga Beli</label>
              <input
                type="text"
                className="form-control"
                name="harga_beli"
                value={toCurrency(this.state.harga_beli)}
                onChange={this.handleChange}
              />
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Harga 1</label>
                  <input
                    type="text"
                    className="form-control"
                    name="harga"
                    value={toCurrency(this.state.harga)}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Harga 2</label>
                  <input
                    type="text"
                    className="form-control"
                    name="harga2"
                    value={toCurrency(this.state.harga2)}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>PPN</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ppn"
                    value={toCurrency(this.state.ppn)}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Harga 3</label>
                  <input
                    type="text"
                    className="form-control"
                    name="harga3"
                    value={toCurrency(this.state.harga3)}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Harga 4</label>
                  <input
                    type="text"
                    className="form-control"
                    name="harga4"
                    value={toCurrency(this.state.harga4)}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Servis</label>
                  <input
                    type="text"
                    className="form-control"
                    name="service"
                    value={toCurrency(this.state.service)}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
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
export default connect(mapStateToProps)(FormPriceProduct);
