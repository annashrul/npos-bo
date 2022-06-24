import React, { Component } from "react";
import { connect } from "react-redux";
import { ModalBody, ModalFooter } from "reactstrap";
import WrapperModal from "./_wrapper.modal";
import { ModalToggle } from "../../../redux/actions/modal.action";
import Keamanan from "assets/keamanan.png";
import { checkOtorisasi, setOtorisasiId } from "redux/actions/authActions";
import { isEmptyOrUndefined, setStorage } from "../../../helper";

class ModalPin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pass: "",
      username: "",
      module: "",
      aksi: "",
      id_log: "",
      error: {
        pass: "",
      },
      prevIdLog: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleLanjut = this.handleLanjut.bind(this);
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.state.username !== this.props.auth.user.username) {
      this.setState({
        username: this.props.auth.user.username,
      });
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.datum) {
      this.setState({
        module: nextProps.datum.module,
        aksi: nextProps.datum.aksi,
      });
    }
  };

  toggle = (e) => {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    // this.props.dispatch(ModalType(this.props.typePage));
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    let err = Object.assign({}, this.state.error, {
      [event.target.name]: "",
    });
    this.setState({
      error: err,
    });
  };

  handleLanjut(event) {
    event.preventDefault();
    if (!isEmptyOrUndefined(this.state.pass, "password")) return;
    this.props.dispatch(
      checkOtorisasi(
        {
          username: this.state.username,
          password: this.state.pass,
          module: this.props.datum.module,
          aksi: this.props.datum.aksi,
          id_trx: this.props.datum.id_trx,
        },
        (status, data) => {
          if (status) {
            console.log();
            this.props.onDone(data.result.id_log, this.props.datum.id_trx);
            setStorage("idLogEdit", data.result.id_log);
            this.setState({
              prevIdLog: data.result.id_log,
              id_log: data.result.id_log,
              pass: "",
            });
            this.props.dispatch(setOtorisasiId(""));
            this.props.dispatch(ModalToggle(false));
          }
        }
      )
    );
  }

  render() {
    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === "modalOtorisasi"}
        size="lg"
        style={{ backgroundColor: "black" }}
      >
        <ModalBody style={{ backgroundColor: "black" }}>
          <div className="row">
            <div className="col-md-6">
              <img src={Keamanan} alt="Keamanan" />
            </div>
            <div className="col-md-6" style={{ margin: "auto" }}>
              <p className={"text-white"} style={{ textAlign: "center" }}>
                Sebelum melanjutkan aksi <i>{this.props.datum.aksi}</i> pada
                modul {this.props.datum.module}, silahkan masukan password anda
                terlebih dahulu.
              </p>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  name="pass"
                  value={this.state.pass}
                  onChange={this.handleChange}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      this.handleLanjut(event);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter style={{ backgroundColor: "black", borderTop: "none" }}>
          <div className="form-group" style={{ textAlign: "right" }}>
            <button
              type="button"
              className="btn btn-warning mr-2"
              onClick={this.toggle}
            >
              <i className="ti-close" /> Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={this.handleLanjut}
            >
              <i className="ti-save" /> Lanjutkan
            </button>
          </div>
        </ModalFooter>
      </WrapperModal>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    id_log: state.auth.id_log,
  };
};
export default connect(mapStateToProps)(ModalPin);
