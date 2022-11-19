import React, { Component } from "react";
import WrapperModal from "components/App/modals/_wrapper.modal";
import { ModalBody, ModalHeader } from "reactstrap";
import connect from "react-redux/es/connect/connect";
import { withRouter } from "react-router-dom";
import { ModalToggle, ModalType } from "../../../../redux/actions/modal.action";
import {
  getStorage,
  handleError,
  isEmptyOrUndefined,
  rmComma,
  rmStorage,
  toRp,
} from "../../../../helper";
import { FetchBank } from "redux/actions/masterdata/bank/bank.action";
import { createManualSaleAction } from "../../../../redux/actions/sale/sale_manual.action";
import DownloadNotaPdf from "./download_pdf";

class ConfirmPenjualanManual extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tipe: 0,
      jumlah_uang: 0,
      kembalian: 0,
      bank: "",
      isDownload: false,
      kd_trx: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(FetchBank("page=1&perpage=100"));
    this.setState({ jumlah_uang: this.props.master.total, kembalian: 0 });
  }

  componentWillReceiveProps(nextProps) {
    // if(nextProps.bank.data==="object" && nextProps.bank.data.length>0){
    //     this.setState()
    // }
  }

  handleChange(e, i = null) {
    let col = e.target.name;
    let val = e.target.value;
    let state = { [col]: val };
    let total = this.props.master.total;
    if (col === "jumlah_uang") {
      val = rmComma(val);
      let kembalian = Number(val) - total;
      Object.assign(state, { [col]: val, kembalian });
    } else if (col === "tipe") {
      if (val === "0") {
        let kembalian = Number(this.state.jumlah_uang) - total;
        Object.assign(state, { [col]: val, kembalian, jumlah_uang: total });
      }
      //   else if(val==="1"){
      //     Object.assign(state,{bank:this.props.})
      //   }
    }
    // else if(col==="bank"){
    //     Object.assign(state,{bank:this.props.bank.data[i].name})
    // }
    this.setState(state);
  }

  handleModal(e) {
    e.preventDefault();
    this.props.dispatch(ModalToggle(false));
  }
  handleSubmit(e) {
    e.preventDefault();
    const props = this.props;
    let total = props.master.total;
    let { kembalian, jumlah_uang, bank, tipe } = this.state;
    if (Number(jumlah_uang) < 1) {
      handleError("Jumlah uang");
      setTimeout(() => this[`jumlah_uang`].focus(), 500);
      return;
    }
    if (Number(jumlah_uang) < total) {
      handleError("Jumlah uang", "tidak boleh kurang dari total");
      setTimeout(() => this[`jumlah_uang`].focus(), 500);
      return;
    }
    if (tipe === "1") {
      if (!isEmptyOrUndefined(bank)) {
        handleError("bank");
        setTimeout(() => this[`bank`].focus(), 500);
        return;
      }
    }
    Object.assign(props.master, {
      tipe,
      bank,
      kembalian,
    });
    const isEdit = getStorage("isEditTrxManual");
    if (isEdit === "true") {
      var retrievedObject = localStorage.getItem("masterTrxManual");
      retrievedObject = JSON.parse(retrievedObject);
      Object.assign(props.master, {
        isEdit: true,
        kdOldTrx: retrievedObject.kd_trx,
      });
    }

    props.dispatch(
      createManualSaleAction(
        {
          master: props.master,
          detail: props.detail,
        },
        (res) => {
          this.setState({ kd_trx: res.result, isDownload: true }, () => {
            props.dispatch(ModalToggle(true));
            props.dispatch(ModalType("downloadNotaPdf"));
          });
        }
      )
    );
  }

  render() {
    const { isDownload, tipe, kembalian, jumlah_uang, bank, kd_trx } =
      this.state;
    const { master, detail } = this.props;
    return (
      <div>
        <WrapperModal
          isOpen={
            this.props.isOpen && this.props.type === "confirmPenjualanManual"
          }
          size="md"
        >
          <ModalHeader
            toggle={(e) => {
              this.props.dispatch(ModalToggle(false));
            }}
          >
            Transaksi Manual
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label>Jenis Pembayaran</label>
              <select
                className="form-control"
                name="tipe"
                value={tipe}
                onChange={this.handleChange}
              >
                <option value={0}>Tunai</option>
                <option value={1}>Transfer</option>
                <option value={2}>Kredit</option>
              </select>
            </div>
            <div className="form-group">
              <label>Jumlah Uang</label>
              <input
                className="form-control"
                name="jumlah_uang"
                value={toRp(jumlah_uang)}
                onChange={this.handleChange}
                ref={(input) => (this[`jumlah_uang`] = input)}
              />
            </div>
            {tipe !== "1" && (
              <div className="form-group">
                <label>Kembalian</label>
                <input
                  readOnly
                  className="form-control"
                  name="kembalian"
                  value={toRp(kembalian)}
                  onChange={this.handleChange}
                />
              </div>
            )}

            {tipe === "1" && (
              <div className="form-group">
                <label>BANK</label>
                <select
                  name="bank"
                  className="form-control"
                  value={bank}
                  onChange={this.handleChange}
                  ref={(input) => (this[`bank`] = input)}
                >
                  <option value="">pilih bank</option>
                  {typeof this.props.bank.data === "object"
                    ? this.props.bank.data.map((v, i) => {
                      return (
                        <option key={i} value={`${v.nama}-${v.akun}`}>
                          {v.nama} || {v.akun}
                        </option>
                      );
                    })
                    : ""}
                </select>
              </div>
            )}

            {tipe === "2" && (
              <div className="form-group">
                <label>Isi nominal sesuai jumlah!</label>
              </div>
            )}

            <div className="row">
              <div className="col-md-9">
                <button
                  className="btn btn-info btn-block text-left"
                  onClick={(event) => {
                    this.setState({
                      kembalian: 0,
                      jumlah_uang: master.total,
                    });
                  }}
                  data-toggle="tooltip"
                  title="Masukan total ke jumlah uang."
                >
                  TOTAL = <b>{toRp(master.total)}</b>
                </button>
              </div>
              <div className="col-md-3">
                <button
                  style={{ float: "right" }}
                  type="submit"
                  className="btn btn-primary"
                  onClick={this.handleSubmit}
                //   disabled={this.props.isLoadingSale}
                >
                  Bayar
                </button>
              </div>
            </div>
          </ModalBody>
        </WrapperModal>
        {isDownload && this.props.isOpen ? (
          <DownloadNotaPdf
            master={master}
            detail={detail}
            kdTrx={kd_trx}
            callbackDownload={() => {
              this.props.callback();
            }}
          />
        ) : null}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    bank: state.bankReducer.data,
    isLoading: state.bankReducer.isLoading,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(ConfirmPenjualanManual);
// export default withRouter(connect(mapStateToProps)(ConfirmPenjualanManual));

// export default ConfirmPenjualanManual;
