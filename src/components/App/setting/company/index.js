import React, { Component } from "react";
import Layout from "../../Layout";
import FileBase64 from "react-file-base64";
import { stringifyFormData } from "helper";
import connect from "react-redux/es/connect/connect";
import {
  FetchCompany,
  storeCompany,
} from "redux/actions/setting/company/company.action";
import Preloader from "Preloader";
import { get, update } from "components/model/app.model";
import { handleError } from "../../../../helper";
const table = "sess";

class Company extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "-",
      logo: "-",
      fav_icon: "-",
      splash: "-",
      meta_key: "",
      meta_deskripsi: "-",
      web: "-",
      set_harga: 1,
      nm_hrg1: "",
      nm_hrg2: "",
      nm_hrg3: "",
      nm_hrg4: "",
      data_harga: [],
      selectedIndex: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    if (event.target.name === "set_harga") {
      // let hrg=[];
      // let idxHarga=this.state.data_harga[event.target.value-1];
      console.log(this.state.data_harga);
      let data_harga = this.state.data_harga;
      let val = event.target.value;
      if (parseInt(val, 10) > data_harga.length) {
        data_harga.push({ [`harga${val}`]: "" });
      }
      // if(idxHarga===undefined){
      //     this.state.data_harga.push({[`harga${event.target.value}`]:""})
      // }else{
      //     for(let i=0;i<event.target.value;i++){
      //         hrg.push({[`harga${i+1}`] : this.state.data_harga[i][`harga${i+1}`]});
      //     }
      //     this.state.data_harga=hrg;
      // }
      this.setState({});
    }
  };
  getLogo(files) {
    this.setState({
      logo: files.base64,
    });
  }
  getFavIcon(files) {
    this.setState({
      fav_icon: files.base64,
    });
  }
  getSplash(files) {
    this.setState({
      splash: files.base64,
    });
  }

  getProps(param) {
    if (param.auth.user) {
      let access = param.auth.user.access;
      if (access !== undefined && access !== null) {
        if (param.auth.user.access[0]["value"] === "0") {
          alert("bukan halaman kamu");
          this.props.history.push({
            pathname: "/",
            state: { from: this.props.location.pathname },
          });
        }
      }
    }
  }

  componentWillMount() {
    this.getProps(this.props);
    this.props.dispatch(FetchCompany());
    this.setState({
      title: this.props.company.title,
    });
  }

  componentWillReceiveProps(nextprops) {
    this.getProps(nextprops);
    const data = get(table);
    data.then((res) => {
      res.map((item, index) => {
        this.setState({
          data_harga: item.nama_harga,
          set_harga: item.set_harga,
        });
        return null;
      });
    });

    this.setState({
      title: nextprops.company.title,
      meta_key:
        nextprops.company.meta_key !== null ? nextprops.company.meta_key : "-",
      meta_deskripsi: nextprops.company.meta_descr,
      web: nextprops.company.web,
      logo: nextprops.company.logo,
      fav_icon: nextprops.company.fav_icon,
      splash: nextprops.company.splash,
      set_harga: nextprops.company.set_harga,
      nm_hrg1: nextprops.company.nm_hrg1,
      nm_hrg2: nextprops.company.nm_hrg2,
      nm_hrg3: nextprops.company.nm_hrg3,
      nm_hrg4: nextprops.company.nm_hrg4,
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    let data = new FormData(form);
    let parseData = stringifyFormData(data);
    parseData["title"] = this.state.title;
    parseData["meta_descr"] = this.state.meta_deskripsi;
    parseData["meta_key"] = this.state.meta_key;
    parseData["web"] = this.state.web;
    parseData["logo"] =
      this.state.logo.substring(0, 4) !== "http" ? this.state.logo : "-";
    parseData["fav_icon"] =
      this.state.fav_icon.substring(0, 4) !== "http"
        ? this.state.fav_icon
        : "-";
    parseData["splash"] =
      this.state.splash.substring(0, 4) !== "http" ? this.state.splash : "-";
    parseData["set_harga"] = this.state.set_harga;
    for (let i = 0; i < this.state.set_harga; i++) {
      parseData[`nm_hrg${i + 1}`] =
        this.state.data_harga[i] !== undefined
          ? this.state.data_harga[i][`harga${i + 1}`]
          : "";
      if (parseData[`nm_hrg${i + 1}`] === "") {
        return handleError(`harga ${i + 1}`);
      }
    }
    const cek = get(table);
    cek.then((res) => {
      res.map((item, index) => {
        let hrg = [];
        this.state.data_harga.map((val, key) => {
          hrg.push({ [`harga${key + 1}`]: val[`harga${key + 1}`] });
        });
        Object.assign(item, {
          id: item.id,
          nama_harga: hrg,
          set_harga: hrg.length,
        });
        console.log(hrg);
        update(table, item);
        return null;
      });
    });
    this.props.dispatch(storeCompany(parseData));
  }
  handleSelect = (e, index) => {
    this.setState({ selectedIndex: index });
  };

  render() {
    const columnStyle = {
      verticalAlign: "middle",
      textAlign: "center",
      whiteSpace: "nowrap",
    };
    return (
      <Layout page="Pengaturan Umum">
        <div className="card">
          <form onSubmit={this.handleSubmit}>
            <div className="card-header bg-transparent user-area d-flex align-items-center justify-content-between">
              <h4 className="card-title mt-3">PENGATURAN UMUM</h4>
              <button className="btn btn-primary">SIMPAN</button>
            </div>
            {!this.props.isLoadingGet ? (
              <div className="card-body">
                <div
                  className="table-responsive"
                  style={{ overflowX: "auto", zoom: "85%" }}
                >
                  <table className="table table-hover table-bordered">
                    <thead className="bg-light">
                      <tr>
                        <th style={columnStyle}>TITLE</th>
                        <th style={columnStyle}>META KEY</th>
                        <th style={columnStyle}>Keterangan penjualan</th>
                        <th style={columnStyle}>LINK WEBSITE</th>
                        <th style={columnStyle}>SET HARGA</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={columnStyle}>
                          <input
                            type="text"
                            name="title"
                            className="form-control"
                            value={this.state.title}
                            onChange={this.handleChange}
                          />
                        </td>
                        <td style={columnStyle}>
                          <input
                            type="text"
                            name="meta_key"
                            className="form-control"
                            value={this.state.meta_key}
                            onChange={this.handleChange}
                          />
                        </td>
                        <td style={columnStyle}>
                          <input
                            type="text"
                            name="meta_deskripsi"
                            className="form-control"
                            value={this.state.meta_deskripsi}
                            onChange={this.handleChange}
                          />
                        </td>
                        <td style={columnStyle}>
                          <input
                            type="text"
                            name="web"
                            className="form-control"
                            value={this.state.web}
                            onChange={this.handleChange}
                          />
                        </td>
                        <td style={columnStyle}>
                          <select
                            name="set_harga"
                            className="form-control"
                            value={this.state.set_harga}
                            defaultValue={this.state.set_harga}
                            onChange={this.handleChange}
                          >
                            {(() => {
                              let container = [];
                              for (let x = 0; x < 10; x++) {
                                container.push(
                                  <option key={x} value={x + 1}>
                                    {x + 1}
                                  </option>
                                );
                              }
                              return container;
                            })()}
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div
                  className="table-responsive"
                  style={{ overflowX: "auto", zoom: "85%" }}
                >
                  <table className="table table-hover table-bordered">
                    <thead className="bg-light">
                      <tr>
                        {(() => {
                          let container = [];
                          for (let x = 0; x < this.state.set_harga; x++) {
                            container.push(
                              <td key={x} style={columnStyle}>
                                NAMA HARGA {x + 1}
                              </td>
                            );
                          }
                          return container;
                        })()}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.data_harga.length > 0 && (
                        <tr>
                          {(() => {
                            let container = [];
                            for (let x = 0; x < this.state.set_harga; x++) {
                              let nama = this.state.data_harga[x]
                                ? this.state.data_harga[x][`harga${x + 1}`]
                                : "";
                              container.push(
                                <td style={columnStyle} key={x}>
                                  <input
                                    type="text"
                                    name={nama}
                                    className="form-control"
                                    value={nama}
                                    onChange={(e) => {
                                      this.state.data_harga[x][
                                        `harga${x + 1}`
                                      ] = e.target.value;
                                      this.setState({});
                                    }}
                                  />
                                </td>
                              );
                            }
                            return (
                              this.state.data_harga !== undefined && container
                            );
                          })()}
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div
                  className="table-responsive"
                  style={{ overflowX: "auto", zoom: "85%" }}
                >
                  <table className="table table-hover table-bordered">
                    <thead className="bg-light">
                      <tr>
                        <th style={columnStyle}>LOGO</th>
                        <th style={columnStyle}>FAV ICON</th>
                        <th style={columnStyle}>SPLASH</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={columnStyle}>
                          <FileBase64
                            multiple={false}
                            className="mr-3 form-control-file"
                            onDone={this.getLogo.bind(this)}
                          />
                        </td>
                        <td style={columnStyle}>
                          <FileBase64
                            multiple={false}
                            className="mr-3 form-control-file"
                            onDone={this.getFavIcon.bind(this)}
                          />
                        </td>
                        <td style={columnStyle}>
                          <FileBase64
                            multiple={false}
                            className="mr-3 form-control-file"
                            onDone={this.getSplash.bind(this)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={columnStyle}>
                          {this.state.logo !== "-" ? (
                            <img
                              alt="netindo"
                              src={this.state.logo}
                              style={{
                                height: "200px",
                                width: "300px",
                                objectFit: "scale-down",
                              }}
                            />
                          ) : (
                            <img
                              alt="netindo"
                              src="https://satriabahana.co.id/asset/img/noimage.png"
                              style={{ height: "150px", width: "100%" }}
                            />
                          )}
                        </td>
                        <td style={columnStyle}>
                          {this.state.fav_icon !== "-" ? (
                            <img
                              alt="netindo"
                              src={this.state.fav_icon}
                              style={{
                                height: "200px",
                                width: "300px",
                                objectFit: "scale-down",
                              }}
                            />
                          ) : (
                            <img
                              alt="netindo"
                              src="https://satriabahana.co.id/asset/img/noimage.png"
                              style={{ height: "150px", width: "100%" }}
                            />
                          )}
                        </td>
                        <td style={columnStyle}>
                          {this.state.splash !== "-" ? (
                            <img
                              alt="netindo"
                              src={this.state.splash}
                              style={{
                                height: "200px",
                                width: "300px",
                                objectFit: "scale-down",
                              }}
                            />
                          ) : (
                            <img
                              alt="netindo"
                              src="https://satriabahana.co.id/asset/img/noimage.png"
                              style={{ height: "150px", width: "100%" }}
                            />
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <Preloader />
            )}
          </form>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    company: state.companyReducer.dataGet,
    isLoadingGet: state.companyReducer.isLoadingGet,
    isLoadingPost: state.companyReducer.isLoadingPost,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(Company);
