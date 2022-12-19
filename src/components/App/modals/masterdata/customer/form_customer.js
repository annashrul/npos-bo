import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ModalToggle } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import { stringifyFormData } from "helper";
import { createCustomer, setCustomerEdit, updateCustomer } from "redux/actions/masterdata/customer/customer.action";
import FileBase64 from "react-file-base64";
import moment from "moment";
import LokasiCommon from "../../../common/LokasiCommon";
import SelectCommon from "../../../common/SelectCommon";
import IsActiveCommon from "../../../common/IsActiveCommon";
import { handleError, isEmptyOrUndefined, setFocus } from "../../../../../helper";

class FormCustomer extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      kd_cust: "",
      nama: "",
      alamat: "-",
      status: "",
      tgl_ultah: moment(new Date()).format("yyyy-MM-DD"),
      tlp: "",
      cust_type: "CT00003",
      cust_type_data: ["LK/0001"],
      password: "1",
      register: "",
      foto: "-",
      jenis_kelamin: "1",
      jenis_kelamin_data: [
        { value: "1", label: "Laki-laki" },
        { value: "0", label: "Perempuan" },
      ],
      email: "morph@gmail.com",
      biografi: "-",
      special_price: "1",
      discount: "0",
      location: "LK/0001",
    };
  }

  getProps(param) {
    console.log(param);
    let detail = param.detail;
    let state = {};
    let cust = [];
    if (typeof param.dataCustomerTypeAll.data === "object") {
      param.dataCustomerTypeAll.data.map((v) =>
        cust.push({
          value: v.kode,
          label: v.nama,
        })
      );
      Object.assign(state, { cust_type_data: cust });
    }
    if (detail.id !== "") {
      Object.assign(state, {
        kd_cust: detail.kd_cust,
        nama: detail.nama,
        alamat: detail.alamat,
        status: detail.status,
        tgl_ultah: moment(detail.tgl_ultah).format("yyyy-MM-DD"),
        tlp: detail.tlp.replaceAll(" ", ""),
        cust_type: detail.kd_type,
        password: "",
        register: detail.register,
        email: detail.email,
        biografi: detail.biografi,
        special_price: detail.special_price,
        jenis_kelamin: detail.jenis_kelamin,
        discount: detail.discount,
        location: detail.kd_lokasi,
      });
    }

    this.setState(state);
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

  toggle(e) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(setCustomerEdit([]));
    this.setState({
      kd_cust: "",
      nama: "",
      alamat: "",
      status: "1",
      tgl_ultah: "",
      tlp: "0",
      cust_type: "-",
      password: "",
      register: "-",
      foto: "-",
      jenis_kelamin: "1",
      email: "",
      biografi: "",
      special_price: "1",
      discount: "0",
      location: "",
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log(this.props.detail);
    const form = e.target;
    let data = new FormData(form);
    let parseData = stringifyFormData(data);
    parseData["nama"] = this.state.nama;
    parseData["lokasi"] = this.state.location;
    parseData["alamat"] = this.state.alamat;
    parseData["status"] = this.state.status;
    parseData["tgl_ultah"] = this.state.tgl_ultah;
    parseData["tlp"] = this.state.tlp;
    parseData["cust_type"] = this.state.cust_type;
    parseData["password"] = this.state.password;
    parseData["register"] = this.state.register;
    parseData["foto"] = this.state.foto;
    parseData["jenis_kelamin"] = this.state.jenis_kelamin;
    parseData["email"] = this.state.email;
    parseData["biografi"] = this.state.biografi;
    parseData["special_price"] = 0;

    if (!isEmptyOrUndefined(parseData["nama"], "nama")) {
      setFocus(this, "nama");
      return;
    }
    if (!isEmptyOrUndefined(parseData["lokasi"], "lokasi")) return;
    if (!isEmptyOrUndefined(parseData["cust_type"], "tipe Customer")) return;
    if (!isEmptyOrUndefined(parseData["password"])) {
      if (this.props.detail.id !== "") {
        parseData["password"] = "-";
      } else {
        handleError("password");
        return;
      }
    }
    if (!isEmptyOrUndefined(parseData["jenis_kelamin"], "jenis kelamin")) return;
    if (!isEmptyOrUndefined(parseData["tlp"], "telepon")) return;
    if (!isEmptyOrUndefined(parseData["email"], "email")) return;
    if (!isEmptyOrUndefined(parseData["tgl_ultah"], "tanggal ulang tahun")) return;
    if (!isEmptyOrUndefined(parseData["status"], "status")) return;
    if (!isEmptyOrUndefined(parseData["alamat"], "alamat")) return;

    if (this.props.detail.id !== "") {
      this.props.dispatch(updateCustomer(this.props.detail.kd_cust, parseData));
    } else {
      if (!isEmptyOrUndefined(parseData["password"], "password")) return;
      this.props.dispatch(createCustomer(parseData));
    }
  }
  getFiles(files) {
    this.setState({
      foto: files.base64,
    });
  }
  render() {
    return (
      <WrapperModal isOpen={this.props.isOpen && this.props.type === "formCustomer"} size="lg">
        <ModalHeader toggle={this.toggle}>{this.props.detail.id !== "" ? "Ubah Customer" : "Tambah Customer"}</ModalHeader>
        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label>
                    Nama <span className="text-danger">*</span>
                  </label>
                  <input ref={(input) => (this[`nama`] = input)} type="text" className="form-control" name="nama" value={this.state.nama} onChange={this.handleChange} />
                </div>
                <LokasiCommon ref={(input) => (this[`lokasi`] = input)} callback={(res) => this.setState({ location: res.value })} isRequired={true} dataEdit={this.state.location} />
                {/* <SelectCommon
                  ref={(input) => (this[`cust_type`] = input)}
                  label="Tipe Customer"
                  options={this.state.cust_type_data}
                  callback={(res) => {
                    this.setState({ cust_type: res.value });
                  }}
                  dataEdit={this.state.cust_type}
                  isRequired={true}
                />
                <SelectCommon
                  label="Jenis kelamin"
                  options={this.state.jenis_kelamin_data}
                  callback={(res) => this.setState({ jenis_kelamin: res.value })}
                  dataEdit={this.state.jenis_kelamin}
                  isRequired={true}
                /> */}
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label>
                    Telepon <span className="text-danger">*</span>
                  </label>
                  <input type="number" className="form-control" name="tlp" value={this.state.tlp} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                  <label>Keterangan</label>
                  <input type="text" className="form-control" name="biografi" value={this.state.biografi} onChange={this.handleChange} />
                </div>
                {/* <div className="form-group">
                  <label>
                    Email <span className="text-danger">*</span>
                  </label>
                  <input type="email" className="form-control" name="email" value={this.state.email} onChange={this.handleChange} />
                </div> */}
                {/* <div className="form-group">
                  <label>Password {this.props.detail.id !== "" ? <small>(kosongkan jika tidak diubah)</small> : <span className="text-danger">*</span>}</label>
                  <input type="password" className="form-control" name="password" value={this.state.password} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                  <label>
                    Ulang Tahun <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    name="tgl_ultah"
                    className="form-control"
                    data-parse="date"
                    placeholder="MM/DD/YYYY"
                    value={this.state.tgl_ultah}
                    pattern="\d{2}\/\d{2}/\d{4}"
                    onChange={this.handleChange}
                  />
                </div> */}
              </div>
              <div className="col-md-4">
                <IsActiveCommon callback={(res) => this.setState({ status: res.value })} isRequired={true} dataEdit={this.state.status} />
                <div className="form-group">
                  <label>
                    Alamat <span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control" name="alamat" value={this.state.alamat} onChange={this.handleChange} />
                </div>
                
                {/* <div className="form-group">
                  <label>Foto {this.props.detail.id !== "" && <small>(kosongkan jika tidak diubah)</small>}</label>
                  <br />
                  <FileBase64 multiple={false} className="form-control " onDone={this.getFiles.bind(this)} />
                </div> */}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="form-group" style={{ textAlign: "right" }}>
              <button type="button" className="btn btn-warning mr-2" onClick={this.toggle}>
                <i className="ti-close" /> Batal
              </button>
              <button type="submit" className="btn btn-primary mr-2">
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
export default connect(mapStateToProps)(FormCustomer);
