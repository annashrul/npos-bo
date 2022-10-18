import React, { Component } from "react";
// import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import Select from "react-select";
import { FetchPiutang, storePiutang } from "redux/actions/piutang/piutang.action";
import moment from "moment";
import { toRp } from "helper";
import Swal from "sweetalert2";
import Spinner from "Spinner";
import { rmComma, toCurrency } from "helper";
import File64 from "../../common/File64";

class BayarPiutangForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tgl: moment(new Date()).format("yyyy-MM-DD"),
      no_trx: "",
      location: "",
      jenis_trx_data: [],
      jenis_trx: "",
      nota_pembelian: "",
      nama: "",
      tempo: "",
      catatan: "-",
      jumlah_telah_bayar: "",
      jumlah_bayar: "",
      userid: 0,
      payment_slip: "-",
      error: {
        location: "",
        jenis_trx: "",
        nota_pembelian: "",
        catatan: "",
        jumlah_telah_bayar: "",
        jumlah_bayar: "",
      },
    };
    this.handleChange = this.handleChange.bind(this);
    this.HandleChangeJenisTrx = this.HandleChangeJenisTrx.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleChangeImage = this.handleChangeImage.bind(this);
  }

  handleChangeImage(files) {
    if (files.status === "success") {
      // this.props.dispatch(putMember({picture:files.base64},this.props.auth.user.id))
      this.setState({
        payment_slip: files.base64,
      });
    }
  }

  getProps(param) {
    let jns = [
      { value: "Tunai", label: "Tunai" },
      { value: "Transfer", label: "Transfer" },
    ];
    this.setState({
      jenis_trx_data: jns,
      nota_pembelian: param.data.kode,
    });
    if (param.auth.user) {
      this.setState({
        userid: param.auth.user.id,
      });
    }
  }

  componentDidMount() {
    if (localStorage.jenis_trx_piutang !== undefined && localStorage.jenis_trx_piutang !== "") {
      this.setState({
        jenis_trx: localStorage.jenis_trx_piutang,
      });
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.getProps(nextProps);
  };
  componentWillMount() {
    this.getProps(this.props);
  }

  handleChange(e) {
    let column = e.target.name;
    let val = e.target.value;
    let err = Object.assign({}, this.state.error, {
      [column]: "",
    });
    if (column === "nota_pembelian") {
      localStorage.setItem("nota_pembelian_piutang", val);
    }
    if (column === "jumlah_bayar") {
      this.setState({
        [column]: val.replace(/,/g, "").replace(/\D/, ""),
        error: err,
      });
    } else {
      this.setState({
        [column]: val,
        error: err,
      });
    }
  }

  HandleChangeJenisTrx(jenis) {
    let err = Object.assign({}, this.state.error, { jenis_trx: "" });
    this.setState({
      jenis_trx: jenis.value,
      error: err,
    });
    localStorage.setItem("jenis_trx_piutang", jenis.value);
  }
  handleSearch(e) {
    let err = this.state.error;
    if (this.state.jenis_trx === "") {
      err = Object.assign({}, err, {
        jenis_trx: "Jenis Pembayaran Tidak Boleh Kosong",
      });
    } else {
      this.props.dispatch(FetchPiutang(this.state.nota_pembelian));
    }
    this.setState({
      error: err,
    });
  }
  handleSave(e) {
    e.preventDefault();
    let err = this.state.error;
    if (this.state.jenis_trx === "") {
      err = Object.assign({}, err, {
        jenis_trx: "Jenis Pembayaran Tidak Boleh Kosong",
      });
      this.setState({ error: err });
    } else if (this.state.nota_pembelian === "") {
      err = Object.assign({}, err, {
        nota_pembelian: "Nota Penjualan Tidak Boleh Kosong",
      });
      this.setState({ error: err });
    } else if (this.state.catatan === "") {
      err = Object.assign({}, err, {
        catatan: "Keterangan Tidak Boleh Kosong",
      });
      this.setState({ error: err });
    } else if (this.state.jumlah_bayar === "" || this.state.jumlah_bayar === "0" || parseInt(this.state.jumlah_bayar, 10) === 0) {
      err = Object.assign({}, err, {
        jumlah_bayar: "Jumlah Bayar Tidak Boleh Kosong",
      });
      this.setState({ error: err });
    } else if (parseInt(this.state.jumlah_bayar, 10) > parseInt(this.props.getPiutang.gt, 10) - parseInt(this.props.getPiutang.jumlah_telah_bayar, 10)) {
      err = Object.assign({}, err, {
        jumlah_bayar: "Jumlah Bayar Tidak Boleh Lebih Dari Jumlah Piutang",
      });
      this.setState({
        error: err,
        jumlah_bayar: 0,
      });
    } else {
      Swal.fire({
        allowOutsideClick: false,
        title: "Simpan Piutang?",
        text: "Pastikan data yang anda masukan sudah benar!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Simpan!",
        cancelButtonText: "Tidak!",
      }).then((result) => {
        if (result.value) {
          let data = {};
          data["nota_jual"] = this.state.nota_pembelian;
          data["tanggal"] = moment(this.state.tgl).format("yyyy-MM-DD");
          data["jumlah"] = this.state.jumlah_bayar;
          data["jumlah_piutang"] = parseInt(this.props.getPiutang.gt, 10);
          data["tgl_jatuh_tempo"] = moment(this.props.getPiutang.tempo).format("yyyy-MM-DD");
          data["lokasi"] = this.props.getPiutang.lokasi === undefined || this.props.getPiutang.lokasi === "" || this.props.getPiutang.lokasi === null ? "LK/0001" : this.props.getPiutang.lokasi;
          data["cara_byr"] = this.state.jenis_trx;
          data["bank"] = "-";
          data["pembulatan"] = 0;
          data["nogiro"] = 0;
          data["tanggal_cair"] = moment(new Date()).format("yyyy-MM-DD");
          data["ket"] = this.state.catatan;
          data["userid"] = this.state.userid;
          data["jumlah_sudah_bayar"] = this.props.getPiutang.jumlah_telah_bayar;
          data["payment_slip"] = this.state.payment_slip;
          this.props.dispatch(storePiutang(data, (arr) => this.props.history.push(arr)));
        }
      });
    }
  }
  handleCancel(e) {
    e.preventDefault();
    Swal.fire({
      allowOutsideClick: false,
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then((result) => {
      if (result.value) {
        localStorage.removeItem("nota_pembelian_piutang");
        localStorage.removeItem("jenis_trx_piutang");
        window.location.reload();
      }
    });
  }
  render() {
    return (
      // <Layout page="Bayar Piutang">
      !this.props.isLoading ? (
        <div className="card">
          <div className="card-header">
            <h4>Bayar Piutang</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-8">
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="control-label font-12">No. Bayar Piutang</label>
                      <input readOnly={true} type="text" className="form-control" value={this.props.nota} />
                    </div>
                    <div className="form-group">
                      <label className="control-label font-12">Tanggal Pembayaran</label>
                      <input type="date" name={"tgl"} className="form-control" value={this.state.tgl} onChange={this.handleChange} />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="control-label font-12">Lokasi Piutang</label>
                      <input readOnly={true} type="text" name="lokasi" className="form-control" value={this.props.getPiutang.lokasi !== undefined ? this.props.getPiutang.lokasi : "-"} />
                    </div>
                    <div className="form-group">
                      <label className="control-label font-12">Jenis Pembayaran</label>
                      <Select
                        options={this.state.jenis_trx_data}
                        placeholder="Pilih Metode"
                        onChange={this.HandleChangeJenisTrx}
                        value={this.state.jenis_trx_data.find((op) => {
                          return op.value === this.state.jenis_trx;
                        })}
                      />
                      <div className="invalid-feedback" style={this.state.error.jenis_trx !== "" ? { display: "block" } : { display: "none" }}>
                        {this.state.error.jenis_trx}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="control-label font-12">Nota Penjualan</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          name="nota_pembelian"
                          readOnly={true}
                          value={this.state.nota_pembelian}
                          onChange={this.handleChange}
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              this.handleSearch();
                            }
                          }}
                        />
                        <div className="input-group-prepend">
                          <button className="btn btn-primary" onClick={this.handleSearch}>
                            {this.props.isLoading ? "loading ...." : <i className="fa fa-search" />}
                          </button>
                        </div>
                      </div>
                      <div className="invalid-feedback" style={this.state.error.nota_pembelian !== "" ? { display: "block" } : { display: "none" }}>
                        {this.state.error.nota_pembelian}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="control-label font-12">Tanggal Transaksi</label>
                      <input
                        readOnly={true}
                        type="text"
                        className="form-control"
                        name="tempo"
                        value={this.props.getPiutang.tgl !== undefined ? moment(this.props.getPiutang.tgl).format("yyyy-MM-DD") : this.state.tgl}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="control-label font-12">Customer</label>
                      <input readOnly={true} type="text" className="form-control" name="nama" value={this.props.getPiutang.nama !== undefined ? this.props.getPiutang.nama : this.state.nama} />
                    </div>
                    <div className="form-group">
                      <label className="control-label font-12">Jatuh Tempo</label>
                      <input
                        readOnly={true}
                        type="text"
                        className="form-control"
                        name="tempo"
                        value={this.props.getPiutang.tempo !== undefined ? moment(this.props.getPiutang.tempo).format("yyyy-MM-DD") : this.state.tempo}
                      />
                    </div>
                    {/* sss */}
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="control-label font-12">DP</label>
                      <input
                        readOnly={true}
                        type="text"
                        className="form-control"
                        name="dp"
                        value={
                          (this.props.getPiutang.dp !== undefined ? parseInt(this.props.getPiutang.dp, 10) : 0) +
                          (this.props.getPiutang.jml_kartu !== undefined ? parseInt(this.props.getPiutang.jml_kartu, 10) : 0)
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="control-label font-12">Kas Lain</label>
                      <input
                        readOnly={true}
                        type="text"
                        className="form-control"
                        name="kas_lain"
                        value={this.props.getPiutang.kas_lain !== undefined ? this.props.getPiutang.kas_lain : this.state.kas_lain}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="control-label font-12">Keterangan</label>
                      <input type="text" className="form-control" name="catatan" value={this.state.catatan} onChange={this.handleChange} />
                      <div className="invalid-feedback" style={this.state.error.catatan !== "" ? { display: "block" } : { display: "none" }}>
                        {this.state.error.catatan}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label className="control-label font-12">
                    Bukti Pembayaran <small className="text-muted">(optional)</small>
                  </label>
                  <File64
                    multiple={false}
                    maxSize={2048} //in kb
                    fileType="png,jpg" //pisahkan dengan koma
                    className="form-control-file"
                    onDone={this.handleChangeImage}
                    lang="id"
                  />
                </div>
              </div>
            </div>
            <hr />
            {this.props.isLoadingPost ? (
              <Spinner />
            ) : (
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="control-label font-12">Jumlah Piutang</label>
                    <input readOnly={true} type="text" className="form-control" value={this.props.getPiutang.gt !== undefined ? toRp(parseInt(this.props.getPiutang.gt, 10)) : "0"} />
                  </div>
                  <div className="form-group">
                    <label className="control-label font-12">Jumlah Yang Telah Dibayar</label>
                    <input
                      readOnly={true}
                      type="text"
                      className="form-control"
                      value={this.props.getPiutang.jumlah_telah_bayar !== undefined ? rmComma(this.props.getPiutang.jumlah_telah_bayar) : "0"}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="control-label font-12">Sisa Piutang</label>
                    <input
                      readOnly={true}
                      type="text"
                      className="form-control"
                      value={this.props.getPiutang.gt !== undefined ? toRp(parseInt(this.props.getPiutang.gt, 10) - parseInt(this.props.getPiutang.jumlah_telah_bayar, 10)) : "0"}
                    />
                  </div>
                  <div className="form-group">
                    <label className="control-label font-12">Jumlah Bayar</label>
                    <input type="text" name="jumlah_bayar" className="form-control" value={toCurrency(this.state.jumlah_bayar)} onChange={this.handleChange} />
                    <div className="invalid-feedback" style={this.state.error.jumlah_bayar !== "" ? { display: "block" } : { display: "none" }}>
                      {this.state.error.jumlah_bayar}
                    </div>
                    {/*{*/}
                    {/*parseInt(this.state.jumlah_bayar)>(parseInt(this.props.getPiutang.gt)-parseInt(this.props.getPiutang.jumlah_telah_bayar))?<small style={{color:"red",fontWeight:"bold"}}>jumlah bayar tidak boleh lebih dari sisa piutang</small>:""*/}
                    {/*}*/}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <div className="pull-right" style={{ alignSelf: "flex-end" }}>
                      <button className="btn btn-primary btn-sm" style={{ marginTop: "29px" }} onClick={this.handleSave}>
                        Simpan
                      </button>
                      <button className="btn btn-danger btn-sm" style={{ marginTop: "29px", marginLeft: "5px" }} onClick={this.props.action(false)}>
                        Kembali
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Spinner spinnerLabel={"Menyiapkan data " + this.state.nota_pembelian} />
      )
    );
  }
}
const mapStateToPropsCreateItem = (state) => ({
  auth: state.auth,
  nota: state.piutangReducer.get_code,
  getPiutang: state.piutangReducer.data,
  isLoading: state.piutangReducer.isLoading,
  isLoadingPost: state.piutangReducer.isLoadingPost,
});

export default connect(mapStateToPropsCreateItem)(BayarPiutangForm);
