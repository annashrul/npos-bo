import React, { Component } from "react";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import { storeApproval } from "redux/actions/inventory/produksi.action";
import Swal from "sweetalert2";
import { ModalToggle } from "redux/actions/modal.action";
import { handleError, isEmptyOrUndefined, parseToRp, rmComma, setFocus, swalWithCallback, toCurrency } from "../../../../../../helper";
class ApproveProduction extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.HandleSubmit = this.HandleSubmit.bind(this);
    this.state = {
      txtHpp: "",
      txtSisaApproval: "",
      txtKdTrx: "",
    };
  }

  getProps(props) {
    console.log("props", props);
    this.setState({
      txtHpp: parseInt(props.detail.hpp, 10),
      txtSisaApproval: props.detail.qty_estimasi,
      txtKdTrx: props.detail.kd_produksi,
    });
    setFocus(this, "txtSisaApproval");
  }

  componentWillMount() {
    this.getProps(this.props);
  }
  componentDidMount() {
    this.getProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }

  toggle(e) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
  }

  HandleSubmit(e) {
    e.preventDefault();
    let sisa = rmComma(this.state.txtSisaApproval);

    console.log(sisa);
    if (!isEmptyOrUndefined(sisa, "Sisa approval") || parseInt(sisa, 10) < 1 || isNaN(sisa)) {
      handleError("Sisa approval");
      setFocus(this, "txtSisaApproval");
      return;
    }
    swalWithCallback("Pastikan data yang anda masukan sudah benar", () => {
      let data = {};
      data["hpp"] = this.state.txtHpp;
      data["sisa_approval"] = sisa;
      data["kd_trx"] = this.state.txtKdTrx;
      this.props.dispatch(storeApproval(data, this.props.detail.where));
    });
  }

  render() {
    return (
      <div>
        <WrapperModal isOpen={this.props.isOpen && this.props.type === "approveProduction"} size="md">
          <ModalHeader toggle={this.toggle}>Form penerimaan #{this.props.detail.kd_produksi}</ModalHeader>
          <ModalBody>
            <form onSubmit={this.HandleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Hpp</label>
                    <input type="text" className="form-control" name="txtHpp" value={toCurrency(this.state.txtHpp)} disabled={true} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Sisa</label>
                    <input
                      type="text"
                      className="form-control"
                      name="txtSisaApproval"
                      autoFocus={true}
                      value={toCurrency(this.state.txtSisaApproval)}
                      onChange={(e) => this.setState({ txtSisaApproval: e.target.value })}
                      ref={(input) => {
                        if (input !== null) {
                          this[`txtSisaApproval`] = input;
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <button type="submit" className="btn-block btn btn-primary">
                    Simpan
                  </button>
                </div>
              </div>
            </form>
          </ModalBody>
        </WrapperModal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    // stockReportApproveProduction:state.stockReportReducer.dataApproveTransaksi,
    // isLoading: state.stockReportReducer.isLoading,
  };
};
// const mapDispatch
export default connect(mapStateToProps)(ApproveProduction);
