import React, { Component } from "react";
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import imgCsv from "assets/csv.png";
import imgUpload from "assets/upload.png";
import { HEADERS } from "../../../../redux/actions/_constants";
import Dropzone from "react-dropzone";
import Swal from "sweetalert2";
import { importTable } from "redux/actions/site.action";
import { Link } from "react-router-dom";
class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUpload: "",
      toUpload: "",
      isLoad: "",
      files: "",
      table: "",
    };
  }

  handleUpload(e, param) {
    e.preventDefault();
    this.setState({
      toUpload: param,
      isUpload: param,
    });
  }

  getUpload(data, param) {
    var reader = new FileReader();
    reader.readAsDataURL(data[0]);
    if (data[0].name.toString().substring(data[0].name.length - 4) === ".csv") {
      reader.onloadstart = () =>
        this.setState({
          isLoad: param,
        });
      reader.onabort = () => Swal.fire({ allowOutsideClick: false, title: "Kesalahan", text: "File Dibatalkan!", icon: "error" });
      reader.onerror = () => Swal.fire({ allowOutsideClick: false, title: "Kesalahan", text: "File Error!", icon: "error" });
      reader.onload = () =>
        (reader.onloadend = () =>
          this.setState({
            isLoad: "",
            files: reader.result.toString().includes("application/vnd.ms-excel") ? reader.result.toString().replace("application/vnd.ms-excel", "text/csv") : reader.result.toString(),
            table: param,
          }));
    } else {
      Swal.fire({ allowOutsideClick: false, title: "Kesalahan", text: "Format File Tidak Diperbolehkan!", icon: "error" });
    }
    this.setState({
      isUpload: param === "close" ? "" : param,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let parsedata = {};
    parsedata["files"] = this.state.files;
    parsedata["table"] = this.state.table;
    this.props.dispatch(importTable(parsedata));
    this.setState({
      isUpload: "",
      toUpload: "",
      isLoad: "",
      files: "",
      table: "",
    });
  }

  render() {
    return (
      <Layout page="Product">
        <div className="col-12 box-margin">
          <div className="card bg-boxshadow">
            <div className="card-body px-3 py-2">
              <div className="user-important-data-info d-sm-flex align-items-center justify-content-between">
                <ul className="downloads--data-btn d-flex align-items-center justify-content-between mb-3 mb-sm-0">
                  <li>
                    <h5 className="mt-2 pointer" onClick={()=>window.history.back()}>
                      <i className="fa fa-chevron-left" /> Kembali
                    </h5>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 box-margin">
          {/* <div className="container-fluid"> */}
          <div className="row">
            <div className="col-4">
              <div className="card animate__animated animate__faster animate__fadeInUp" style={{ display: this.state.toUpload === "uploadBarang" ? "" : "none" }}>
                <div className="card-body text-center">
                  <button className="btn btn-circle btn-danger float-right" onClick={(e) => this.handleUpload(e, "close")}>
                    <i className="fa fa-times"></i>
                  </button>
                  <Dropzone onDrop={(acceptedFiles) => this.getUpload(acceptedFiles, "barang")}>
                    {({ getRootProps, getInputProps }) => (
                      <div className="container text-center" style={{ padding: "1rem", cursor: "pointer" }}>
                        <div {...getRootProps()}>
                          <input {...getInputProps()} accept=".csv" />
                          <img className="card-img-top img-responsive mb-3" src={imgUpload} alt="" style={{ borderRadius: "30px", padding: "4rem", borderStyle: "dashed" }} />
                          <p>Drag 'n' drop some files csv here, or click to select files</p>
                        </div>
                      </div>
                    )}
                  </Dropzone>
                  <button className="btn btn-rounded btn-primary" disabled={this.state.isUpload === "barang" ? false : true} onClick={(e) => this.handleSubmit(e)}>
                    <span class="spinner-border spinner-border-sm mr-2" style={{ display: this.state.isLoad === "barang" ? "" : "none" }} role="status" aria-hidden="true"></span>
                    {this.state.isLoad === "barang" ? "Loading ..." : "IMPORT"}
                  </button>
                </div>
              </div>
              <div className="card animate__animated animate__fadeIn" style={{ display: this.state.toUpload !== "uploadBarang" ? "" : "none" }}>
                <img className="card-img-top img-responsive" src={imgCsv} alt="" />
                <div className="card-body">
                  <h4 className="card-title mb-2">Template Barang</h4>
                  <p className="card-text text-justify">
                    Pada template barang, terdapat 14 kolom. Masing - masing kolom harus diisi dengan benar sesuai contoh yang terdapat dalam template tersebut.{" "}
                    <span className="text-danger">BACA NOTE TERLEBIH DAHULU SEBELUM MELAKUKAN PENGISIAN TEMPLATE BARANG</span>
                  </p>
                  <div className="d-flex align-items-center justify-content-between">
                    <a href={HEADERS.URL + "/templates/barang_template.csv"} rel="noopener noreferrer" target="_blank" class="btn btn-info">
                      Download Template
                    </a>
                    <button onClick={(e) => this.handleUpload(e, "uploadBarang")} class="btn btn-primary">
                      Import File
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="card animate__animated animate__faster animate__fadeInUp" style={{ display: this.state.toUpload === "uploadBarcode" ? "" : "none" }}>
                <div className="card-body text-center">
                  <button className="btn btn-circle btn-danger float-right" onClick={(e) => this.handleUpload(e, "close")}>
                    <i className="fa fa-times"></i>
                  </button>
                  <Dropzone onDrop={(acceptedFiles) => this.getUpload(acceptedFiles, "barcode")}>
                    {({ getRootProps, getInputProps }) => (
                      <div className="container text-center" style={{ padding: "1rem", cursor: "pointer" }}>
                        <div {...getRootProps()}>
                          <input {...getInputProps()} accept=".csv" />
                          <img className="card-img-top img-responsive mb-3" src={imgUpload} alt="" style={{ borderRadius: "30px", padding: "4rem", borderStyle: "dashed" }} />
                          <p>Drag 'n' drop some files csv here, or click to select files</p>
                        </div>
                      </div>
                    )}
                  </Dropzone>
                  <button className="btn btn-rounded btn-primary" disabled={this.state.isUpload === "barcode" ? false : true} onClick={(e) => this.handleSubmit(e)}>
                    <span class="spinner-border spinner-border-sm mr-2" style={{ display: this.state.isLoad === "barcode" ? "" : "none" }} role="status" aria-hidden="true"></span>
                    {this.state.isLoad === "barcode" ? "Loading ..." : "IMPORT"}
                  </button>
                </div>
              </div>
              <div className="card animate__animated animate__fadeIn" style={{ display: this.state.toUpload !== "uploadBarcode" ? "" : "none" }}>
                <img className="card-img-top img-responsive" src={imgCsv} alt="" />
                <div className="card-body">
                  <h4 className="card-title mb-2">Template Barcode</h4>
                  <p className="card-text text-justify">
                    Pada template barcode, terdapat 5 kolom. Masing - masing kolom harus diisi dengan benar sesuai contoh yang terdapat dalam template tersebut.{" "}
                    <del className="text-danger">BACA NOTE TERLEBIH DAHULU SEBELUM MELAKUKAN PENGISIAN TEMPLATE BARCODE</del>
                  </p>
                  <div className="d-flex align-items-center justify-content-between">
                    <a href={HEADERS.URL + "/templates/template_barcode.csv"} target="_blank" rel="noopener noreferrer" class="btn btn-info">
                      Download Template
                    </a>
                    <button onClick={(e) => this.handleUpload(e, "uploadBarcode")} class="btn btn-primary">
                      Import File
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="card animate__animated animate__faster animate__fadeInUp" style={{ display: this.state.toUpload === "uploadHarga" ? "" : "none" }}>
                <div className="card-body text-center">
                  <button className="btn btn-circle btn-danger float-right" onClick={(e) => this.handleUpload(e, "close")}>
                    <i className="fa fa-times"></i>
                  </button>
                  <Dropzone onDrop={(acceptedFiles) => this.getUpload(acceptedFiles, "harga")}>
                    {({ getRootProps, getInputProps }) => (
                      <div className="container text-center" style={{ padding: "1rem", cursor: "pointer" }}>
                        <div {...getRootProps()}>
                          <input {...getInputProps()} accept=".csv" />
                          <img className="card-img-top img-responsive mb-3" src={imgUpload} alt="" style={{ borderRadius: "30px", padding: "4rem", borderStyle: "dashed" }} />
                          <p>Drag 'n' drop some files csv here, or click to select files</p>
                        </div>
                      </div>
                    )}
                  </Dropzone>
                  <button className="btn btn-rounded btn-primary" disabled={this.state.isUpload === "harga" ? false : true} onClick={(e) => this.handleSubmit(e)}>
                    <span class="spinner-border spinner-border-sm mr-2" style={{ display: this.state.isLoad === "harga" ? "" : "none" }} role="status" aria-hidden="true"></span>
                    {this.state.isLoad === "harga" ? "Loading ..." : "IMPORT"}
                  </button>
                </div>
              </div>
              <div className="card animate__animated animate__fadeIn" style={{ display: this.state.toUpload !== "uploadHarga" ? "" : "none" }}>
                <img className="card-img-top img-responsive" src={imgCsv} alt="" />
                <div className="card-body">
                  <h4 className="card-title mb-2">Template Harga</h4>
                  <p className="card-text text-justify">
                    Pada template harga, terdapat 10 kolom. Masing - masing kolom harus diisi dengan benar sesuai contoh yang terdapat dalam template tersebut.{" "}
                    <del className="text-danger">BACA NOTE TERLEBIH DAHULU SEBELUM MELAKUKAN PENGISIAN TEMPLATE HARGA</del>
                  </p>
                  <div className="d-flex align-items-center justify-content-between">
                    <a href={HEADERS.URL + "/templates/template_harga.csv"} target="_blank" rel="noopener noreferrer" class="btn btn-info">
                      Download Template
                    </a>
                    <button onClick={(e) => this.handleUpload(e, "uploadHarga")} class="btn btn-primary">
                      Import File
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h3 className="text-danger">NOTE:</h3>
                  <code>#</code> Pengisian kolom <span className="text-danger">KATEGORI</span>
                  <br />
                  <span className="border border-light">
                    0: <code>kartonan</code>, 1: <code>satuan</code>, 2: <code>paket</code>, 3: <code>service</code>, 4: <code>bahan</code>
                  </span>
                  <br />
                  <code>#</code> Pengisian kolom <span className="text-danger">JENIS</span>
                  <br />
                  <span className="border border-light">
                    0: <code>tidak dijual</code>, 1: <code>dijual</code>
                  </span>
                  <br />
                  <code>#</code> Pengisian kolom <span className="text-danger">ONLINE</span>
                  <br />
                  <span className="border border-light">
                    0: <code>hanya offline</code>, 1: <code>online offline</code>
                  </span>
                  <br />
                  <code>#</code> Pengisian kolom <span className="text-danger">GROUP1</span>
                  <br />
                  <span className="border border-light">
                    Disisi dari kode <code>SUPPLIER</code>
                  </span>
                  <br />
                  <code>#</code> Pengisian kolom <span className="text-danger">GROUP2</span>
                  <br />
                  <span className="border border-light">
                    Disisi dari kode <code>SUB DEPT</code>
                  </span>
                  <br />
                  <span className="border border-light">
                    <code>KODE BARANG</code> dan <code>BARCODE</code> tidak boleh duplikat
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* </div> */}
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    site: state.siteReducer.data,
    files: state.siteReducer.data_list,
    isLoading: state.siteReducer.isLoading,
  };
};
export default connect(mapStateToProps)(Upload);
