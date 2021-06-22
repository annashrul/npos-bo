import React, { Component } from "react";
import WrapperModal from "components/App/modals/_wrapper.modal";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { FetchBank } from "redux/actions/masterdata/bank/bank.action";
import Preloader from "../../../../Preloader";
import { storeSale } from "../../../../redux/actions/sale/sale.action";
import { ToastQ, toCurrency, rmComma } from "helper";
import { withRouter } from "react-router-dom";
import moment from "moment";
import {
  store,
  get,
  update,
  destroy,
  cekData,
  del,
} from "components/model/app.model";
import {
  isEmptyOrUndefined,
  swallOption,
  swalWithCallback,
} from "../../../../helper";
import { ModalType } from "../../../../redux/actions/modal.action";
class FormHoldBill extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  toggle = (e) => {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.callback("close");
    this.setState({});
  };
  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    let nama = data.get("nama");
    if (!isEmptyOrUndefined(nama, "atas nama")) return;
    store("hold", {
      nama: nama,
      master: JSON.stringify(this.props.master),
      detail: JSON.stringify(this.props.dataHoldBill),
    });

    swalWithCallback("transaksi berhasil disimpan", () => {
      this.props.callback("submit");
      const bool = !this.props.isOpen;
      this.props.dispatch(ModalToggle(bool));
    });
  }
  render() {
    console.log(this.props);
    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === "formHoldBill"}
        size="md"
      >
        <ModalHeader toggle={this.toggle}>
          Simpan transaksi #{this.props.master.kode_trx}
        </ModalHeader>
        <ModalBody>
          <form onSubmit={this.handleSubmit} noValidate>
            <div className="form-group">
              <label>Atas nama</label>
              <input type="text" name="nama" className="form-control" />
            </div>
            <hr />
            <button type="submit" className="btn btn-primary">
              Simpan
            </button>
          </form>
        </ModalBody>
      </WrapperModal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    bank: state.bankReducer.data,
    isLoading: state.bankReducer.isLoading,
    isLoadingSale: state.saleReducer.isLoading,
  };
};
export default withRouter(connect(mapStateToProps)(FormHoldBill));
