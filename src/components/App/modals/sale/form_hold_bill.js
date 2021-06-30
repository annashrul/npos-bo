import React, { Component } from "react";
import WrapperModal from "components/App/modals/_wrapper.modal";
import { ModalBody, ModalHeader } from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { withRouter } from "react-router-dom";
import { store, update } from "components/model/app.model";
import { isEmptyOrUndefined, setFocus, swalWithCallback } from "../../../../helper";

class FormHoldBill extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      nama: "",
    };
  }
  getProps(props, inState) {
    if (props.objectHoldBill.id !== undefined) {
      this.setState({ nama: props.objectHoldBill.nama });
    } else {
      this.setState({ nama: "" });
    }
    props.type === "formHoldBill" && setFocus(this, "nama");
  }
  componentDidMount() {
    this.getProps(this.props, "componentDidMount");
  }
  componentWillMount() {
    this.getProps(this.props, "componentWillMount");
  }
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps, "componentWillReceiveProps");
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
    if (!isEmptyOrUndefined(nama, "atas nama")) {
      setFocus(this, "nama");
      return;
    }
    let field = {
      nama: nama,
      master: JSON.stringify(this.props.master),
      detail: JSON.stringify(this.props.dataHoldBill),
    };
    if (this.props.objectHoldBill.id !== undefined) {
      Object.assign(field, { id: this.props.objectHoldBill.id });
      update("hold", field);
    } else {
      store("hold", field);
    }

    swalWithCallback("transaksi berhasil disimpan", () => {
      this.props.callback("submit");
      const bool = !this.props.isOpen;
      this.props.dispatch(ModalToggle(bool));
      this.setState({ nama: "" });
    });
  }
  render() {
    return (
      <WrapperModal isOpen={this.props.isOpen && this.props.type === "formHoldBill"} size="md">
        <ModalHeader toggle={this.toggle}>Simpan transaksi #{this.props.master.kode_trx}</ModalHeader>
        <ModalBody>
          <form onSubmit={this.handleSubmit} noValidate>
            <div className="form-group">
              <label>Atas nama</label>

              <input
                autoFocus
                type="text"
                name="nama"
                className="form-control"
                value={this.state.nama}
                onChange={(e) => this.setState({ nama: e.target.value })}
                ref={(input) => {
                  // this[`nama`] = input;
                  if (input !== null) {
                    this[`nama`] = input;
                  }
                }}
              />
            </div>
            <hr />
            <button type="submit" className="btn btn-primary text-right">
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
