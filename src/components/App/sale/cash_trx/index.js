import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import Layout from "components/App/Layout";
import { FetchCash, StoreCashTrx } from "redux/actions/masterdata/cash/cash.action";
import { kassa, toCurrency, rmComma, swallOption, isEmptyOrUndefined, getStorage } from "../../../../helper";
import moment from "moment";
import LokasiCommon from "../../common/LokasiCommon";
import SelectCommon from "../../common/SelectCommon";
import Cookies from "js-cookie";

class Sale extends Component {
  constructor(props) {
    super(props);
    this.HandleInput = this.HandleInput.bind(this);
    this.HandleReset = this.HandleReset.bind(this);
    this.HandleSubmit = this.HandleSubmit.bind(this);
    this.HandleSelect = this.HandleSelect.bind(this);
    this.handleEvent = this.handleEvent.bind(this);

    this.state = {
      dataEdit: "",
      addingItemName: "",
      perpage: 99999,
      kategori: "masuk",
      jumlah: "",
      keterangan: "",
      userid: "",
      jenis: "",
      jenis_data: [],
      location: "",
      location_data: [],
      kassa: "Z",
      startDate: moment().format("yyyy-MM-DD"),
      jns: [],
      error: {
        kassa: "",
        location: "",
        jenis: "",
        jumlah: "",
        keterangan: "",
      },
    };
  }

  handleGet(type) {
    this.props.dispatch(FetchCash(`page=1&type=${type}&perpage=${99}`));
    this.refreshCommon();
  }

  componentDidMount() {
    this.handleGet(this.state.kategori);
  }
  componentWillMount() {
    this.handleGet(this.state.kategori);
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.cash.data) {
      let j = [];
      let jns = nextProps.cash.data;
      if (jns !== this.state.jns) {
        jns.map((i) => {
          j.push({
            value: i.id,
            label: i.title,
          });
          return true;
        });
        this.setState({
          jenis_data: j,
          jns: jns,
          jenis: "",
          userid: nextProps.auth.user.id,
        });
      }
    }

    if (nextProps.isSuccessTrx) {
      this.setState({
        dataEdit: "-",
        jumlah: "",
        keterangan: "",
      });
      this.refreshCommon();
    }
  };

  refreshCommon() {
    setTimeout(() => {
      this.setState({ dataEdit: "" });
    }, 500);
  }

  componentWillUnmount() {}

  handleEvent = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    let err = Object.assign({}, this.state.error, { [event.target.name]: "" });
    this.setState({ error: err });
  };

  HandleInput(e) {
    // e.preventDefault();
    const column = e.target.name;
    const val = e.target.value;

    if (column === "jumlah") {
      this.setState({
        jumlah: val.replace(/,/g, "").replace(/\D/, ""),
      });
    } else {
      this.setState({
        [column]: val,
      });
    }
    if (column === "kategori") {
      this.setState({
        dataEdit: "-",
        jumlah: "",
        keterangan: "",
      });
      this.handleGet(val);
    }
    if (column === "jumlah") {
      let err = Object.assign({}, this.state.error, {
        jumlah: "",
        error: "",
      });
      this.setState({
        error: err,
      });
    }
    if (column === "keterangan") {
      let err = Object.assign({}, this.state.error, {
        keterangan: "",
        error: "",
      });
      this.setState({
        error: err,
      });
    }
  }

  HandleSelect(val, state) {
    this.setState({
      [state]: val.value,
    });
  }
  HandleReset(e) {
    e.preventDefault();
    swallOption("anda yakin akan menghapus data ini ?", () => {
      this.setState({
        dataEdit: "-",
        kategori: "masuk",
        jumlah: "",
        keterangan: "",
      });
      this.handleGet(this.state.kategori);
    });
  }

  HandleSubmit(e) {
    e.preventDefault();
    const { kassa, jenis, jumlah, keterangan, location, kategori, startDate } = this.state;
    if (!isEmptyOrUndefined(kassa, "kassa")) return;
    if (!isEmptyOrUndefined(jenis, "jenis kas")) return;
    if (!isEmptyOrUndefined(jumlah, "jumlah")) return;
    if (!isEmptyOrUndefined(keterangan, "keterangan")) return;

    let data = {
      kd_kasir: this.props.auth.user.id,
      jumlah: rmComma(jumlah),
      keterangan: keterangan,
      lokasi: location === "" ? getStorage("location_tr") : location,
      kassa: kassa,
      kd_trx: "",
      type_kas: kategori,
      jenis: jenis,
      tanggal: startDate,
    };
    swallOption("Pastikan data telah diisi dengan benar!", () => {
      this.props.dispatch(StoreCashTrx(data));
    });
  }

  render() {
    return (
      <Layout page="Kas Masuk/Keluar">
        <div className="row">
          <div className="col-12">
            <div className="row">
              <div className="col-md-6 offset-md-3 col-sm-12 offset-sm-0">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 col-sm-6 col-xs-6 col-6">
                        <div className="custom-control custom-radio" style={{ textAlign: "end" }}>
                          <input
                            type="radio"
                            id="customRadio1"
                            checked={this.state.kategori === "masuk"}
                            onChange={(e) => this.HandleInput(e)}
                            value={"masuk"}
                            name="kategori"
                            className="custom-control-input"
                          />
                          <label className="custom-control-label" htmlFor="customRadio1">
                            Kas Masuk
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-6 col-xs-6 col-6">
                        <div className="custom-control custom-radio">
                          <input
                            type="radio"
                            id="customRadio2"
                            checked={this.state.kategori === "keluar"}
                            onChange={(e) => this.HandleInput(e)}
                            value={"keluar"}
                            name="kategori"
                            className="custom-control-input"
                          />
                          <label className="custom-control-label" htmlFor="customRadio2">
                            Kas Keluar
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-md-6">
                        <LokasiCommon useLabel={false} callback={(res) => this.HandleSelect(res, "location")} dataEdit={this.state.location} isLable={false} />
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <input
                            type="date"
                            name="startDate"
                            className="form-control"
                            value={this.state.startDate === undefined ? moment(new Date()).format("yyyy-MM-DD") : moment(this.state.startDate).format("yyyy-MM-DD")}
                            onChange={this.handleEvent}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        {/* <SelectCommon
                          label="kassa"
                          options={kassa("")}
                          callback={(res) => this.HandleSelect(res, "kassa")}
                          isLabel={false}
                          isDisabled={atob(atob(Cookies.get("tnt="))) === "nov-jkt" || atob(atob(Cookies.get("tnt="))) === "nov-bdg"}
                          dataEdit={this.state.dataEdit}
                        /> */}
                      </div>

                      <div className="col-md-6">
                        <SelectCommon label="jenis" options={this.state.jenis_data} callback={(res) => this.HandleSelect(res, "jenis")} isLabel={false} dataEdit={this.state.dataEdit} />
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label className="control-label font-12">Jumlah</label>
                          <input type="text" readOnly={false} className="form-control" id="jumlah" name="jumlah" onChange={(e) => this.HandleInput(e)} value={toCurrency(this.state.jumlah)} />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div class="form-group">
                          <label for="exampleTextarea1">Informasi</label>
                          <textarea
                            class="form-control"
                            readOnly={false}
                            className="form-control"
                            id="keterangan"
                            name="keterangan"
                            onChange={(e) => this.HandleInput(e)}
                            value={this.state.keterangan}
                            rows="4"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div class="form-group">
                          <label>&nbsp;</label>
                          <button type="button" className="btn btn-primary btn-block" onClick={(e) => this.HandleSubmit(e)}>
                            SIMPAN
                          </button>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div class="form-group">
                          <label>&nbsp;</label>
                          <button type="button" className="btn btn-danger btn-block" onClick={(e) => this.HandleReset(e)}>
                            RESET
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  {/* end col */}
                </div>{" "}
                {/* end row */}
              </div>{" "}
              {/* end row */}
            </div>{" "}
            {/* end col */}
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStateToPropsCreateItem = (state) => {
  return {
    cash: state.cashReducer.data,
    isLoading: state.cashReducer.isLoading,
    auth: state.auth,
    isSuccessTrx: state.cashReducer.isSuccessTrx,
  };
};

export default connect(mapStateToPropsCreateItem)(Sale);
