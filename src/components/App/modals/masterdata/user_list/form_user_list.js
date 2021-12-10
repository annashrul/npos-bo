import React, { Component } from "react";
import WrapperModal from "../../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import { ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Select from "react-select";
import { stringifyFormData } from "helper";
import { sendUserList, setUserListEdit, updateUserList } from "redux/actions/masterdata/user_list/user_list.action";
import moment from "moment";
import FileBase64 from "react-file-base64";
import { ModalToggle } from "redux/actions/modal.action";
import axios from "axios";
import { HEADERS } from "redux/actions/_constants";
import { handleError, isEmptyOrUndefined, setFocus } from "../../../../../helper";

class FormUserList extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.HandleChangeUserLevel = this.HandleChangeUserLevel.bind(this);
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
      foto: "",
      nohp: "",
      lokasi: "",
      user_lvl: "",
      status: "1",
      user_lvl_data: [],
      isChecked: false,
      location_data: [],
      location: [],
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
        location: [],
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
          handleError("username", "telah digunakan");
          return;
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

  toggleChange = (e) => {
    let state = { isChecked: e.target.checked };
    if (e.target.checked === true) {
      Object.assign(state, { location: this.state.location_data });
    } else {
      Object.assign(state, { location: [] });
    }
    this.setState(state);
  };

  getProps(props) {
    const propsDetail = props.userListEdit;
    let propsLokasi = typeof props.lokasi.data === "object" ? props.lokasi.data : [];
    let propsUserLevel = typeof props.userLevel.data === "object" ? props.userLevel.data : [];
    let arrayUserLevel = [];
    let arrayLokasi = [];
    let valueLokasi = [];
    let state = {};

    for (let i = 0; i < propsUserLevel.length; i++) {
      arrayUserLevel.push({ value: propsUserLevel[i].id, label: propsUserLevel[i].lvl });
    }

    for (let i = 0; i < propsLokasi.length; i++) {
      valueLokasi.push({ value: propsLokasi[i].kode, label: propsLokasi[i].nama_toko });
      if (propsDetail !== undefined) {
        let propsLokasiUserDetail = typeof propsDetail.lokasi === "object" ? propsDetail.lokasi : [];
        for (let x = 0; x < propsLokasiUserDetail.length; x++) {
          if (propsLokasi[i].kode === propsLokasiUserDetail[x].kode) {
            arrayLokasi.push({ value: propsLokasiUserDetail[x].kode, label: propsLokasi[i].nama_toko });
          }
        }
      } else {
        arrayLokasi.push({ value: propsLokasi[i].kode, label: propsLokasi[i].nama_toko });
      }
    }
    Object.assign(state, {
      location_data: valueLokasi,
      user_lvl_data: arrayUserLevel,
    });
    if (propsDetail !== undefined) {
      if (propsLokasi.length > 0 && propsLokasi.length === arrayLokasi.length) {
        Object.assign(state, { isChecked: true });
      }
      Object.assign(state, {
        location: arrayLokasi,
        nama: propsDetail.nama,
        username: propsDetail.username,
        email: propsDetail.email,
        alamat: propsDetail.alamat,
        tgl_lahir: moment(propsDetail.tgl_lahir).format("yyyy-MM-DD"),
        foto: propsDetail.foto,
        nohp: propsDetail.nohp,
        user_lvl: propsDetail.user_lvl,
        status: propsDetail.status,
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
  componentDidMount() {
    this.getProps(this.props);
  }
  handleSubmit(e) {
    e.preventDefault();
    const state = this.state;
    if (!isEmptyOrUndefined(state.nama, "nama")) {
      setFocus(this, "nama");
      return;
    }
    if (!isEmptyOrUndefined(state.username, "username")) {
      setFocus(this, "username");
      return;
    }

    if (this.props.userListEdit === undefined) {
      if (!isEmptyOrUndefined(state.password, "password")) {
        setFocus(this, "password");
        return;
      }
      if (!isEmptyOrUndefined(state.password_confirmation, "konfirmasi password")) {
        setFocus(this, "password_confirmation");
        return;
      }
      if (state.password !== state.password_confirmation) {
        handleError("password", " tidak sesuai");
        setFocus(this, "password_confirmation");
        return;
      }
      if (!isEmptyOrUndefined(state.password_otorisasi, "otorisasi password")) {
        setFocus(this, "password_otorisasi");
        return;
      }
    } else {
      state.password = state.password.length > 0 ? state.password : "-";
      state.password_confirmation = state.password_confirmation.length > 0 ? state.password_confirmation : "-";
      state.password_otorisasi = state.password_otorisasi.length > 0 ? state.password_otorisasi : "-";
    }
    if (state.location.length <= 0 || !isEmptyOrUndefined(state.location)) {
      handleError("Lokasi");
      setFocus(this, "location");
      return;
    }
    if (!isEmptyOrUndefined(state.user_lvl, "level pengguna")) {
      setFocus(this, "user_lvl");
      return;
    }
    if (!isEmptyOrUndefined(state.tgl_lahir, "tanggal lahir")) {
      setFocus(this, "tgl_lahir");
      return;
    }
    if (!isEmptyOrUndefined(state.alamat, "alamat")) {
      setFocus(this, "alamat");
      return;
    }
    let kodeLokasi = [];
    for (let i = 0; i < state.location.length; i++) {
      kodeLokasi.push({ kode: state.location[i].value });
    }
    if (!isEmptyOrUndefined(state.foto)) {
      state.foto = "-";
    } else {
      state.foto = this.state.foto.base64;
    }

    let parseData = {
      username: state.username,
      user_lvl: state.user_lvl,
      lokasi: kodeLokasi,
      status: state.status,
      nama: state.nama,
      alamat: state.alamat,
      email: state.email,
      nohp: state.nohp,
      tgl_lahir: state.tgl_lahir,
      password: state.password,
      password_confirmation: state.password_confirmation,
      password_otorisasi: state.password_otorisasi,
      foto: state.foto,
    };

    if (this.props.userListEdit !== undefined) {
      this.props.dispatch(updateUserList(this.props.userListEdit.id, parseData));
    } else {
      this.props.dispatch(sendUserList(parseData));
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
  handleOnChange = (location) => {
    this.setState({
      location: location,
    });
  };
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
      foto: "",
      nohp: "",
      lokasi: "",
      user_lvl: "",
      status: "1",
      location: [],
      location_data: [],
      isChecked: true,
    });
  }
  HandleChangeUserLevel(val) {
    this.setState({
      user_lvl: val.value,
    });
  }

  render() {
    const curr = new Date();
    curr.setDate(curr.getDate() + 3);
    const date = curr.toISOString().substr(0, 10);
    // console.log(this.props);

    return (
      <WrapperModal isOpen={this.props.isOpen && this.props.type === "formUserList"} size="lg">
        <ModalHeader toggle={this.toggle}>{this.props.userListEdit !== undefined && this.props.userListEdit !== [] ? `Ubah` : `Tambah`} pengguna</ModalHeader>

        <form onSubmit={this.handleSubmit}>
          <ModalBody>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>
                    Nama <span className="text-danger">*</span>
                  </label>
                  <input ref={(input) => (this[`nama`] = input)} type="text" className="form-control" name="nama" value={this.state.nama} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                  <label>
                    Username <span className="text-danger">*</span>
                  </label>
                  <input ref={(input) => (this[`username`] = input)} type="text" className="form-control" name="username" value={this.state.username} onChange={this.handleChange} />
                  <div className="invalid-feedback" style={this.state.error.username !== "" ? { display: "block" } : { display: "none" }}>
                    {this.state.error.username}
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    Password
                    {this.props.userListEdit !== undefined && this.props.userListEdit !== [] ? <small> ( kosongkan jika tidak akan diubah )</small> : <span className="text-danger">*</span>}
                  </label>
                  <input ref={(input) => (this[`password`] = input)} type="password" className="form-control" name="password" value={this.state.password} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                  <label>
                    Konfirmasi Password
                    {this.props.userListEdit !== undefined && this.props.userListEdit !== [] ? <small> ( kosongkan jika tidak akan diubah )</small> : <span className="text-danger">*</span>}
                  </label>
                  <input
                    ref={(input) => (this[`password_confirmation`] = input)}
                    type="password"
                    className="form-control"
                    name="password_confirmation"
                    value={this.state.password_confirmation}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>
                    Otorisasi Password
                    {this.props.userListEdit !== undefined && this.props.userListEdit !== [] ? <small> ( kosongkan jika tidak akan diubah )</small> : <span className="text-danger">*</span>}
                  </label>
                  <input
                    ref={(input) => (this[`password_otorisasi`] = input)}
                    type="password"
                    className="form-control"
                    name="password_otorisasi"
                    value={this.state.password_otorisasi}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="inputState" className="col-form-label">
                    <input className="text-right" type="checkbox" name="checked_lokasi" checked={this.state.isChecked} onChange={this.toggleChange} /> Pilih semua lokasi{" "}
                  </label>
                  <Select
                    ref={(input) => (this[`location`] = input)}
                    required
                    disabled
                    isMulti
                    value={this.state.location}
                    onChange={this.handleOnChange}
                    options={this.state.location_data}
                    name="lokasi"
                  />
                </div>
                <label className="control-label font-12">
                  User Level <span className="text-danger">*</span>
                </label>
                <Select
                  ref={(input) => (this[`user_lvl`] = input)}
                  options={this.state.user_lvl_data}
                  placeholder="Pilih User Level"
                  onChange={this.HandleChangeUserLevel}
                  value={this.state.user_lvl_data.find((op) => {
                    return op.value === this.state.user_lvl;
                  })}
                />
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Photo</label>
                  <br />
                  <FileBase64 multiple={false} className="mr-3 form-control-file" onDone={this.getFiles.bind(this)} />
                </div>
                <div className="form-group">
                  <label>No. Hp</label>
                  <input type="text" className="form-control" name="nohp" defaultValue="0" value={this.state.nohp} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-control" name="email" value={this.state.email} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                  <label>
                    Tanggal Lahir <span className="text-danger">*</span>
                  </label>
                  <input
                    ref={(input) => (this[`tgl_lahir`] = input)}
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
                </div>
                <div className="form-group">
                  <label htmlFor="inputState" className="col-form-label">
                    Status <span className="text-danger">*</span>
                  </label>
                  <select className="form-control" name="status" defaultValue={this.state.status} value={this.state.status} onChange={this.handleChange}>
                    <option value="1">Aktif</option>
                    <option value="0">Tidak Aktif</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    Alamat <span className="text-danger">*</span>
                  </label>
                  <textarea
                    ref={(input) => (this[`alamat`] = input)}
                    rows="2"
                    className="form-control"
                    name="alamat"
                    value={this.state.alamat}
                    onChange={this.handleChange}
                    style={{ height: "125px" }}
                  >
                    -
                  </textarea>
                </div>
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

export default connect(mapStateToProps)(FormUserList);
