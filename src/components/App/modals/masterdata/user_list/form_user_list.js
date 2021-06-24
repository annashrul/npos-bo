import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import { ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Select from "react-select";
import { stringifyFormData } from "helper";
import {
  sendUserList,
  setUserListEdit,
  updateUserList,
} from "redux/actions/masterdata/user_list/user_list.action";
import moment from "moment";
import FileBase64 from "react-file-base64";
import { ModalToggle } from "redux/actions/modal.action";
import axios from "axios";
import { HEADERS } from "redux/actions/_constants";
import SelectCommon from "../../../common/SelectCommon";
import LokasiCommon from "../../../common/LokasiCommon";
import IsActiveCommon from "../../../common/IsActiveCommon";

class FormUserList extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.state = {
      show: false,
      nama: "",
      username: "",
      password: "",
      password_confirmation: "",
      password_otorisasi: "",
      email: "",
      alamat: "",
      tgl_lahir: moment().format("YYYY-MM-DD"),
      foto: "-",
      nohp: "",
      lokasi: "",
      user_lvl: "0",
      status: "1",
      user_lvl_data: [],
      location: [],
      isChecked: false,
      opt: [],
      opt1: [],
      token: "",
      error: {
        nama: "",
        username: "",
        password: "",
        password_confirmation: "",
        password_otorisasi: "",
        email: "",
        alamat: "",
        tgl_lahir: "",
        foto: "",
        nohp: "",
        lokasi: "",
        location: "",
        user_lvl: "",
        status: "",
      },
    };
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    if (event.target.name === "username") {
      const data = this.fetchData({
        table: "user_akun",
        kolom: "username",
        value: event.target.value,
      });
      data.then((res) => {
        if (res.result === 1) {
          let err = Object.assign({}, this.state.error, {
            username: "Username telah digunakan.",
          });
          this.setState({
            error: err,
          });
        } else {
          let err = Object.assign({}, this.state.error, {
            username: "",
          });
          this.setState({
            error: err,
          });
        }
      });
    } else {
      let err = Object.assign({}, this.state.error, {
        [event.target.name]: "",
      });
      this.setState({
        error: err,
      });
    }
  };

  async fetchData(data) {
    const url = HEADERS.URL + `site/cekdata`;
    return await axios
      .post(url, data)
      .then(function (response) {
        const data = response.data;
        return data;
      })
      .catch(function (error) {
        if (error.response) {
        }
      });
  }

  componentDidMount() {
    if (
      this.props.userListEdit !== undefined &&
      this.props.userListEdit !== []
    ) {
      let lokasiUser =
        typeof this.props.userListEdit.lokasi === "object"
          ? this.props.userListEdit.lokasi
          : [];
      let lokasi =
        typeof this.props.lokasi.data === "object"
          ? this.props.lokasi.data
          : [];
      let loc = [];
      let val = [];
      for (let i = 0; i < lokasi.length; i++) {
        for (let x = 0; x < lokasiUser.length; x++) {
          if (lokasi[i].kode === lokasiUser[x].kode) {
            loc.push({ value: lokasiUser[x].kode, label: lokasi[i].nama_toko });
            val.push({ kode: lokasiUser[x].kode });
          }
        }
      }
      this.setState({
        nama: this.props.userListEdit.nama,
        username: this.props.userListEdit.username,
        email: this.props.userListEdit.email,
        alamat: this.props.userListEdit.alamat,
        tgl_lahir: moment(this.props.userListEdit.tgl_lahir).format(
          "yyyy-MM-DD"
        ),
        foto: this.props.userListEdit.foto,
        nohp: this.props.userListEdit.nohp,
        location: loc,
        opt: val,
        user_lvl: this.props.userListEdit.user_lvl,
        status: this.props.userListEdit.status,
      });
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    let err = this.state.error;

    if (!isEmptyOrUndefined())
      if (
        this.state.nama === "" ||
        this.state.nama === undefined ||
        this.state.error.username !== ""
      ) {
        if (this.state.nama === "" || this.state.nama === undefined) {
          err = Object.assign({}, err, {
            nama: "nama tidak boleh kosong.",
          });
          this.setState({
            error: err,
          });
        }
      } else if (
        this.state.username === "" ||
        this.state.username === undefined
      ) {
        err = Object.assign({}, err, {
          username: "username tidak boleh kosong.",
        });
        this.setState({
          error: err,
        });
      } else if (
        this.state.location.length <= 0 ||
        this.state.location === "" ||
        this.state.location === undefined
      ) {
        err = Object.assign({}, err, {
          location: "lokasi tidak boleh kosong.",
        });
        this.setState({
          error: err,
        });
      } else if (
        this.state.user_lvl === "" ||
        this.state.user_lvl === undefined
      ) {
        err = Object.assign({}, err, {
          user_lvl: "level user tidak boleh kosong.",
        });
        this.setState({
          error: err,
        });
      } else if (this.state.foto === "" || this.state.foto === undefined) {
        err = Object.assign({}, err, {
          foto: "foto user tidak boleh kosong.",
        });
        this.setState({
          error: err,
        });
      } else if (this.state.nohp === "" || this.state.nohp === undefined) {
        err = Object.assign({}, err, {
          nohp: "no hp tidak boleh kosong.",
        });
        this.setState({
          error: err,
        });
      } else if (this.state.email === "" || this.state.email === undefined) {
        err = Object.assign({}, err, {
          email: "email tidak boleh kosong.",
        });
        this.setState({
          error: err,
        });
      } else if (
        this.state.tgl_lahir === "" ||
        this.state.tgl_lahir === undefined
      ) {
        err = Object.assign({}, err, {
          tgl_lahir: "tgl_lahir tidak boleh kosong.",
        });
        this.setState({
          error: err,
        });
      } else if (this.state.alamat === "" || this.state.alamat === undefined) {
        err = Object.assign({}, err, {
          alamat: "alamat tidak boleh kosong.",
        });
        this.setState({
          error: err,
        });
      } else {
        const form = e.target;
        let data = new FormData(form);
        let parseData = stringifyFormData(data);
        parseData["username"] = this.state.username;
        parseData["user_lvl"] = this.state.user_lvl;
        parseData["lokasi"] = lok;
        parseData["status"] =
          this.state.status === undefined ? 1 : this.state.status;
        parseData["nama"] = this.state.nama;
        parseData["alamat"] =
          this.state.alamat === undefined ? "-" : this.state.alamat;
        parseData["email"] =
          this.state.email === undefined ? "-" : this.state.email;
        parseData["nohp"] = this.state.nohp === undefined ? 0 : this.state.nohp;
        parseData["tgl_lahir"] = this.state.tgl_lahir;
        parseData["password"] =
          parseInt(this.state.password.length, 10) > 0
            ? this.state.password
            : "-";
        parseData["password_confirmation"] =
          parseInt(this.state.password_confirmation.length, 10) > 0
            ? this.state.password_confirmation
            : "-";
        parseData["password_otorisasi"] =
          parseInt(this.state.password_otorisasi.length, 10) > 0
            ? this.state.password_otorisasi
            : "-";
        let lok = [];
        for (let i = 0; i < this.state.location.length; i++) {
          lok.push({ kode: this.state.location[i].value });
        }

        if (this.state.foto !== undefined) {
          if (this.state.foto.base64 !== undefined) {
            parseData["foto"] = this.state.foto.base64;
          }
        } else {
          parseData["foto"] = "-";
        }
        if (
          this.props.userListEdit !== undefined &&
          this.props.userListEdit !== []
        ) {
          if (parseData.password === "-") {
            delete parseData.password;
          }
          if (parseData.password_confirmation === "-") {
            delete parseData.password_confirmation;
          }
          if (parseData.password_otorisasi === "-") {
            delete parseData.password_otorisasi;
          }
          if (parseData.foto === "-") {
            delete parseData.foto;
          }
          this.props.dispatch(
            updateUserList(this.props.userListEdit.id, parseData)
          );
          this.props.dispatch(ModalToggle(false));
        } else {
          if (this.state.password === "" || this.state.password === undefined) {
            err = Object.assign({}, err, {
              password: "password tidak boleh kosong.",
            });
            this.setState({
              error: err,
            });
          } else if (
            this.state.password_confirmation === "" ||
            this.state.password_confirmation === undefined
          ) {
            err = Object.assign({}, err, {
              password_confirmation: "konfirmasi password tidak boleh kosong.",
            });
            this.setState({
              error: err,
            });
          } else if (
            this.state.password_otorisasi === "" ||
            this.state.password_otorisasi === undefined
          ) {
            err = Object.assign({}, err, {
              password_otorisasi: "otorisasi password tidak boleh kosong.",
            });
            this.setState({
              error: err,
            });
          } else {
            this.props.dispatch(sendUserList(parseData));
            this.props.dispatch(ModalToggle(false));
          }
        }
      }
  }
  getFiles(files) {
    this.setState({
      foto: files,
    });
    let err = Object.assign({}, this.state.error, {
      foto: "",
    });
    this.setState({
      error: err,
    });
  }

  toggle(e) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(setUserListEdit([]));
    this.setState({
      show: false,
      nama: "",
      username: "",
      password: "",
      password_confirmation: "",
      password_otorisasi: "",
      email: "",
      alamat: "",
      tgl_lahir: moment().format("YYYY-MM-DD"),
      foto: "-",
      nohp: "",
      lokasi: "",
      user_lvl: "",
      status: "1",
      selectedOption: [],
      isChecked: true,
      opt: [],
      opt1: [],
      token: "",
    });
  }

  static getDerivedStateFromProps(props, state) {
    let userLevel =
      typeof props.userLevel.data === "object" ? props.userLevel.data : [];
    let userG = [];
    let lokasi = typeof props.lokasi.data === "object" ? props.lokasi.data : [];
    let locG = [];
    for (let i = 0; i < lokasi.length; i++) {
      locG.push({ value: lokasi[i].kode, label: lokasi[i].nama_toko });
    }
    for (let i = 0; i < userLevel.length; i++) {
      userG.push({ value: userLevel[i].id, label: userLevel[i].lvl });
    }
    state.opt = locG;
    state.user_lvl_data = userG;
    return null;
  }
  handleChangeSelect(state, val) {
    this.setState({ [state]: state === "location" ? val : val.value });
  }
  render() {
    const curr = new Date();
    curr.setDate(curr.getDate() + 3);
    const date = curr.toISOString().substr(0, 10);

    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === "formUserList"}
        size="lg"
      >
        <ModalHeader toggle={this.toggle}>
          {this.props.userListEdit !== undefined &&
          this.props.userListEdit !== []
            ? `Ubah User List`
            : `Tambah User List`}
        </ModalHeader>

        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>
                    Nama <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="nama"
                    value={this.state.nama}
                    onChange={this.handleChange}
                  />
                  <div
                    className="invalid-feedback"
                    style={
                      this.state.error.nama !== ""
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    {this.state.error.nama}
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    Username <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={this.state.username}
                    onChange={this.handleChange}
                  />
                  <div
                    className="invalid-feedback"
                    style={
                      this.state.error.username !== ""
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    {this.state.error.username}
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    Password <span className="text-danger">*</span>{" "}
                    <small>
                      {this.props.userListEdit !== undefined &&
                      this.props.userListEdit !== []
                        ? "( kosongkan jika tidak akan diubah )"
                        : ""}
                    </small>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                  />
                  <div
                    className="invalid-feedback"
                    style={
                      this.state.error.password !== ""
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    {this.state.error.password}
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    Konfirmasi Password <span className="text-danger">*</span>
                    <small>
                      {this.props.userListEdit !== undefined &&
                      this.props.userListEdit !== []
                        ? "(  kosongkan jika tidak akan diubah )"
                        : ""}
                    </small>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="password_confirmation"
                    value={this.state.password_confirmation}
                    onChange={this.handleChange}
                  />
                  <div
                    className="invalid-feedback"
                    style={
                      this.state.error.password_confirmation !== ""
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    {this.state.error.password_confirmation}
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    Otorisasi Password <span className="text-danger">*</span>
                    <small>
                      {this.props.userListEdit !== undefined &&
                      this.props.userListEdit !== []
                        ? "( kosongkan jika tidak akan diubah )"
                        : ""}
                    </small>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="password_otorisasi"
                    value={this.state.password_otorisasi}
                    onChange={this.handleChange}
                  />
                  <div
                    className="invalid-feedback"
                    style={
                      this.state.error.password_otorisasi !== ""
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    {this.state.error.password_otorisasi}
                  </div>
                </div>
                <LokasiCommon
                  callback={(res) => this.handleChangeSelect("location", res)}
                  isMulti={true}
                  dataEdit={this.state.location}
                />
                <SelectCommon
                  label="User level"
                  options={this.state.user_lvl_data}
                  callback={(res) => this.handleChangeSelect("user_lvl", res)}
                  dataEdit={this.state.user_lvl}
                />
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>No. Hp</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nohp"
                    defaultValue="0"
                    value={this.state.nohp}
                    onChange={this.handleChange}
                  />
                  <div
                    className="invalid-feedback"
                    style={
                      this.state.error.nohp !== ""
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    {this.state.error.nohp}
                  </div>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    aria-describedby="emailHelp"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                  <div
                    className="invalid-feedback"
                    style={
                      this.state.error.email !== ""
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    {this.state.error.email}
                  </div>
                </div>
                <div className="form-group">
                  <label>Tanggal Lahir</label>
                  <input
                    type="date"
                    name="tgl_lahir"
                    className="form-control"
                    data-parse="date"
                    placeholder="MM/DD/YYYY"
                    defaultValue={date}
                    value={this.state.tgl_lahir}
                    pattern="\d{2}\/\d{2}/\d{4}"
                    onChange={this.handleChange}
                  />
                  <div
                    className="invalid-feedback"
                    style={
                      this.state.error.tgl_lahir !== ""
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    {this.state.error.tgl_lahir}
                  </div>
                </div>
                <IsActiveCommon
                  callback={(res) => this.handleChangeSelect("status", res)}
                />

                <div className="form-group">
                  <label>Alamat</label>
                  <textarea
                    rows="2"
                    className="form-control"
                    name="alamat"
                    value={this.state.alamat}
                    onChange={this.handleChange}
                    style={{ height: "125px" }}
                  >
                    -
                  </textarea>
                  <div
                    className="invalid-feedback"
                    style={
                      this.state.error.alamat !== ""
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    {this.state.error.alamat}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="inputState" className="col-form-label">
                    Photo
                  </label>
                  <br />
                  <FileBase64
                    multiple={false}
                    className="mr-3 form-control-file"
                    onDone={this.getFiles.bind(this)}
                  />
                  <div
                    className="invalid-feedback"
                    style={
                      this.state.error.foto !== ""
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    {this.state.error.foto}
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="form-group" style={{ textAlign: "right" }}>
              <button
                type="button"
                className="btn btn-warning mb-2 mr-2"
                onClick={this.toggle}
              >
                <i className="ti-close" /> Cancel
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

export default connect(mapStateToProps)(FormUserList);
