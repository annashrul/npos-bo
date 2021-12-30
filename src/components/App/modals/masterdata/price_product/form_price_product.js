import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { stringifyFormData } from "helper";
import { updatePriceProduct } from "../../../../../redux/actions/masterdata/price_product/price_product.action";
import { isEmptyOrUndefined, rmComma, toCurrency } from "../../../../../helper";

import ButtonActionForm from "../../../common/ButtonActionForm";

class FormPriceProduct extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      id: "",
      harga1: "0",
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
      harga1: "0",
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
        harga1: param.detail.harga,
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
    const propsUser=this.props.auth.user;
    const setHarga=propsUser.set_harga;
    parseData["harga"] = rmComma(this.state.harga1);
    parseData["ppn"] = rmComma(this.state.ppn);
    parseData["service"] = rmComma(this.state.service);
    parseData["harga2"] = rmComma(this.state.harga2);
    parseData["harga3"] = rmComma(this.state.harga3);
    parseData["harga4"] = rmComma(this.state.harga4);
    parseData["harga_beli"] = rmComma(this.state.harga_beli);
    if (!isEmptyOrUndefined(parseData.harga_beli, "harga beli")) return;
    if (!isEmptyOrUndefined(this.state.harga1, `harga ${propsUser.nama_harga.harga1}`)) return;
    if(setHarga>1) if (!isEmptyOrUndefined(this.state.harga2, `harga ${propsUser.nama_harga.harga2}`)) return;
    if(setHarga>2) if (!isEmptyOrUndefined(this.state.harga3,`harga ${propsUser.nama_harga.harga3}`)) return;
    if(setHarga>3) if (!isEmptyOrUndefined(this.state.harga4, `harga ${propsUser.nama_harga.harga4}`)) return;
    if (!isEmptyOrUndefined(this.state.ppn, "ppn")) return;
    if (!isEmptyOrUndefined(this.state.service, "service")) return;
    this.props.dispatch(updatePriceProduct(this.state.id, parseData, this.props.detail.where));
  }

  render() {
    const propsUser=this.props.auth.user;
    const setHarga=propsUser.set_harga;
    return (
      <WrapperModal isOpen={this.props.isOpen && this.props.type === "formPriceProduct"} siindexHargae="md">
        <ModalHeader toggle={this.closeModal}>Ubah Harga Barang</ModalHeader>
        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <div className="form-group">
              <label>Harga Beli</label>
              <input type="text" className="form-control" name="harga_beli" value={toCurrency(this.state.harga_beli)} onChange={this.handleChange} />
            </div>
            <div className="row">
              {(() => {
                let container = [];
                for (let indexHarga = 0; indexHarga < setHarga; indexHarga++) {
                  container.push(
                    <div className={setHarga>1?`col-md-6`:`col-md-12`}>
                      <div className="form-group">
                        <label>{ setHarga>1?`Harga ${propsUser.nama_harga[`harga${indexHarga+1}`]}`:"Harga"}</label>
                        <input type="text" className="form-control" name={`harga${indexHarga+1}`} value={toCurrency(this.state[`harga${indexHarga+1}`])} onChange={this.handleChange} />
                      </div>
                    </div>
                  );
                }
                return container;
              })()}
              <div className="col-md-6">
                <div className="form-group">
                  <label>PPN</label>
                  <input type="text" className="form-control" name="ppn" value={toCurrency(this.state.ppn)} onChange={this.handleChange} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Servis</label>
                  <input type="text" className="form-control" name="service" value={toCurrency(this.state.service)} onChange={this.handleChange} />
                </div>
              </div>
              {/* <div className="col-md-6">
                <div className="form-group">
                  <label>Harga 1</label>
                  <input type="text" className="form-control" name="harga" value={toCurrency(this.state.harga)} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                  <label>Harga 2</label>
                  <input type="text" className="form-control" name="harga2" value={toCurrency(this.state.harga2)} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                  <label>PPN</label>
                  <input type="text" className="form-control" name="ppn" value={toCurrency(this.state.ppn)} onChange={this.handleChange} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Harga 3</label>
                  <input type="text" className="form-control" name="harga3" value={toCurrency(this.state.harga3)} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                  <label>Harga 4</label>
                  <input type="text" className="form-control" name="harga4" value={toCurrency(this.state.harga4)} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                  <label>Servis</label>
                  <input type="text" className="form-control" name="service" value={toCurrency(this.state.service)} onChange={this.handleChange} />
                </div>
              </div> */}
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
    auth: state.auth,

  };
};
export default connect(mapStateToProps)(FormPriceProduct);
