import React, { Component } from "react";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { UpdateCashTrx } from "redux/actions/masterdata/cash/cash.action";
import { float, rmComma, toCurrency } from "../../../../../helper";

class Update extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      jumlah: "",
      keterangan: "",
      tgl: "",
      kd_trx: "",
      before: {},
      error: {
        jumlah: "",
        keterangan: "",
        tgl: "",
      },
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  getProps(props) {
    if (props.datum !== undefined) {
      if (props.datum !== this.state.before) {
        this.setState({
          kd_trx: props.datum.kd_trx,
          before: props.datum,
          jumlah: float(props.datum.jumlah),
          keterangan: props.datum.keterangan,
          tgl: props.datum.tgl,
        });
      }
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

  toggle = (e) => {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
    let err = Object.assign({}, this.state.error, {
      [event.target.name]: "",
    });
    this.setState({
      error: err,
    });
  };

  handleSubmit(e) {
    e.preventDefault();
    let err = this.state.error;
    let jumlah = rmComma(this.state.jumlah);

    if (jumlah === "" || jumlah === undefined) {
      err = Object.assign({}, err, { jumlah: "jumlah tidak boleh kosong" });
      this.setState({ error: err });
      return;
    } else if (
      this.state.keterangan === "" ||
      this.state.keterangan === undefined
    ) {
      err = Object.assign({}, err, { keterangan: "lokasi tidak boleh kosong" });
      this.setState({ error: err });
      return;
    } else {
      this.props.dispatch(
        UpdateCashTrx(
          this.state.kd_trx,
          {
            jumlah: jumlah,
            keterangan: this.state.keterangan,
          },
          this.props.datum.where
        )
      );
      this.props.dispatch(ModalToggle(false));
    }
  }
  render() {
    console.log(this.props);
    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === "formUpdateKasTrx"}
        size="md"
      >
        <ModalHeader toggle={this.toggle}>Ubah Transaksi KAS</ModalHeader>
        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <div className="form-group">
              <label>Jumlah</label>
              <input
                type="text"
                className="form-control"
                name="jumlah"
                value={toCurrency(this.state.jumlah)}
                onChange={this.handleChange}
              />
              <div
                className="invalid-feedback"
                style={
                  this.state.error.jumlah !== ""
                    ? { display: "block" }
                    : { display: "none" }
                }
              >
                {this.state.error.jumlah}
              </div>
            </div>
            <div className="form-group">
              <label>Keterangan</label>
              <textarea
                className="form-control"
                name="keterangan"
                onChange={this.handleChange}
              >
                {this.state.keterangan}
              </textarea>
              <div
                className="invalid-feedback"
                style={
                  this.state.error.keterangan !== ""
                    ? { display: "block" }
                    : { display: "none" }
                }
              >
                {this.state.error.keterangan}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              className="btn btn-warning mb-2 mr-2"
              onClick={this.toggle}
            >
              <i className="ti-close" /> Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary mb-2"
              onClick={this.handleSubmit}
            >
              <i className="ti-save" /> Simpan
            </button>
          </ModalFooter>
        </form>
      </WrapperModal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    datum: state.cashReducer.update_data,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(Update);
