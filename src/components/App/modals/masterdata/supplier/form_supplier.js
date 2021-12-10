import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { stringifyFormData } from "helper";
import { createSupplier, updateSupplier, FetchSupplierAll } from "redux/actions/masterdata/supplier/supplier.action";
import { isEmptyOrUndefined, setFocus } from "../../../../../helper";
import SelectCommon from "../../../common/SelectCommon";

class FormSupplier extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      statusData: [
        { value: "0", label: "Tidak aktif" },
        { value: "1", label: "Aktif" },
      ],
      kode: "",
      nama: "",
      bank: "",
      no_rek: "",
      alamat: "",
      kota: "",
      telp: "",
      penanggung_jawab: "",
      no_penanggung_jawab: "",
      status: "1",
      email: "",
      error: {
        kode: "",
        nama: "",
        alamat: "",
        kota: "",
        telp: "",
        penanggung_jawab: "",
        no_penanggung_jawab: "",
        status: "",
        email: "",
      },
    };
  }
  getProps(param) {
    if (param.detail !== undefined) {
      if (param.detail.id !== "") {
        this.setState({
          kode: param.detail.kode,
          nama: param.detail.nama,
          bank: param.detail.bank,
          no_rek: param.detail.no_rek,
          alamat: param.detail.alamat,
          kota: param.detail.kota,
          telp: param.detail.telp,
          penanggung_jawab: param.detail.penanggung_jawab,
          no_penanggung_jawab: param.detail.no_penanggung_jawab,
          status: param.detail.status,
          email: param.detail.email,
        });
      } else {
        this.setState({
          kode: "",
          nama: "",
          alamat: "",
          bank: "",
          no_rek: "",
          kota: "",
          telp: "",
          penanggung_jawab: "",
          no_penanggung_jawab: "",
          status: "",
          email: "",
        });
      }
    }
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

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    let err = Object.assign({}, this.state.error, { [event.target.name]: "" });
    this.setState({ error: err });
  };
  toggle(e) {
    e.preventDefault();
    if (this.props.fastAdd === undefined) {
      const bool = !this.props.isOpen;
      this.props.dispatch(ModalToggle(bool));
    }
    if (this.props.fastAdd === true) {
      this.props.dispatch(ModalType("formProduct"));
      // this.props.dispatch(supp(1,'','999'));
      this.props.dispatch(FetchSupplierAll());
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    let data = new FormData(form);
    let parseData = stringifyFormData(data);
    parseData["nama"] = this.state.nama;
    parseData["alamat"] = this.state.alamat;
    parseData["bank"] = this.state.bank;
    parseData["no_rek"] = this.state.no_rek;
    parseData["kota"] = this.state.kota;
    parseData["telp"] = this.state.telp;
    parseData["penanggung_jawab"] = this.state.penanggung_jawab;
    parseData["no_penanggung_jawab"] = this.state.no_penanggung_jawab;
    parseData["status"] = this.state.status;
    parseData["email"] = this.state.email;
    console.log(parseData["status"]);
    if (!isEmptyOrUndefined(parseData["nama"], "nama")) {
      setFocus(this, "nama");
      return;
    }
    if (!isEmptyOrUndefined(parseData["no_penanggung_jawab"], "no penanggun jawab")) {
      setFocus(this, "no_penanggung_jawab");
      return;
    }
    if (!isEmptyOrUndefined(parseData["penanggung_jawab"], "penanggun jawab")) {
      setFocus(this, "penanggung_jawab");
      return;
    }

    if (!isEmptyOrUndefined(parseData["status"], "status")) return;
    let where = "";
    if (this.props.fastAdd === undefined) {
      where = this.props.detail.where;
    } else {
      where = "page=1";
    }
    if (this.props.detail !== undefined && this.props.detail.id !== "") {
      this.props.dispatch(updateSupplier(this.state.kode, parseData, where));
      this.props.dispatch(ModalToggle(false));
    } else {
      this.props.dispatch(createSupplier(parseData, this.props.fastAdd !== undefined, where));
      if (this.props.fastAdd === undefined) {
        this.props.dispatch(ModalToggle(false));
      }
      if (this.props.fastAdd === true) {
        this.props.dispatch(ModalType("formProduct"));
      }
    }
  }

  render() {
    const { statusData } = this.state;
    return (
      <WrapperModal isOpen={this.props.isOpen && this.props.type === "formSupplier"} size="lg">
        <ModalHeader toggle={this.toggle}>{this.props.detail === undefined ? "Tambah Supplier" : "Ubah Supplier"}</ModalHeader>
        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <div className="row">
              <div className="col-6 col-md-6">
                <div className="form-group">
                  <label>
                    Nama Supplier <span className="text-danger">*</span>
                  </label>
                  <input
                    ref={(input) => (this[`nama`] = input)}
                    type="text"
                    placeholder="Isi nama supplier"
                    className="form-control"
                    name="nama"
                    value={this.state.nama}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="ex. example@mail.com" className="form-control" name="email" value={this.state.email} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                  <label>Telepon</label>
                  <input type="number" placeholder="ex. 6281324654665" className="form-control" name="telp" value={this.state.telp} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                  <label>Kota</label>
                  <input type="text" placeholder="Isi nama kota" className="form-control" name="kota" value={this.state.kota} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                  <label>Alamat Lengkap</label>
                  <input type="text" placeholder="Isi alamat lengkap" className="form-control" name="alamat" value={this.state.alamat} onChange={this.handleChange} />
                </div>
              </div>
              <div className="col-6 col-md-6">
                <div className="form-group">
                  <label>
                    Nama Penanggung Jawab <span className="text-danger">*</span>
                  </label>
                  <input
                    ref={(input) => (this[`penanggung_jawab`] = input)}
                    type="text"
                    placeholder="Isi nama penanggung jawab"
                    className="form-control"
                    name="penanggung_jawab"
                    value={this.state.penanggung_jawab}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>
                    No Penanggung Jawab <span className="text-danger">*</span>
                  </label>
                  <input
                    ref={(input) => (this[`no_penanggung_jawab`] = input)}
                    type="number"
                    placeholder="ex. 628513456789"
                    className="form-control"
                    name="no_penanggung_jawab"
                    value={this.state.no_penanggung_jawab}
                    onChange={this.handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Bank</label>
                  <input type="bank" placeholder="ex. BANK MANDIRI" className="form-control" name="bank" value={this.state.bank} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                  <label>No Rek</label>
                  <input type="no_rek" placeholder="ex. 21850180181812" className="form-control" name="no_rek" value={this.state.no_rek} onChange={this.handleChange} />
                </div>

                <SelectCommon
                  label="status"
                  options={statusData}
                  callback={(res) => {
                    this.setState({ status: res.value });
                  }}
                  isRequired={true}
                  dataEdit={this.state.status}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="form-group" style={{ textAlign: "right" }}>
              <button type="button" className="btn btn-warning mb-2 mr-2" onClick={this.toggle}>
                <i className="ti-close" /> Batal
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
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(FormSupplier);
