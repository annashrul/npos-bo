import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import * as Swal from "sweetalert2";
import Preloader from "Preloader";
import { deleteFiles, FetchFiles, FetchFolder } from "redux/actions/site.action";

class FileManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: true,
      show: false,
      prevName: "",
    };
    this.toggleMode = this.toggleMode.bind(this);
  }

  toggleMode(e) {
    e.preventDefault();
    this.setState({
      mode: !this.state.mode,
    });
  }
  handleDelete(e, i) {
    e.preventDefault();
    Swal.fire({
      allowOutsideClick: false,
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        let body = {};
        body["path"] = i;
        this.props.dispatch(deleteFiles(body, i));
      }
    });
  }
  handleOpen(e, id, name) {
    e.preventDefault();
    localStorage.setItem("id_file_manager_val", id);
    this.props.dispatch(FetchFiles(id));
    this.setState({
      show: !this.state.show,
      prevName: name,
    });
  }
  handleBack(e, id) {
    e.preventDefault();
    this.props.dispatch(FetchFolder());
    this.setState({
      show: !this.state.show,
    });
  }

  render() {
    return (
      <div>
        <div className="card-body">
          <div className="bg-transparent d-flex align-items-center justify-content-between mb-20">
            {/* <div className="d-flex align-items-center justify-content-between"> */}
            <span className="mr-5 ml-5" style={{ display: this.state.show === false ? "block" : "none" }}></span>
            <button
              type="button"
              class={"btn btn-link mr-2 animate__animated animate__faster " + (this.state.show === false ? "animate__fadeInLeft" : "animate__fadeInRight")}
              onClick={(e) => this.handleBack(e)}
              style={{ display: this.state.show === true ? "block" : "none" }}
            >
              <i className="fa fa-chevron-left"></i>&nbsp;List Folders
            </button>
            <div className="widgets-card-title">
              <h5 className={"card-title mb-0 animate__animated " + (this.state.show === false ? "animate__faster animate__fadeInLeft" : "animate__fast animate__fadeInRight")}>
                {this.state.show === true ? this.state.prevName : "List Folders"}
              </h5>
            </div>
            {/* </div> */}
            <div>
              <button type="button" disabled={this.state.mode === true ? true : false} className="btn btn-light waves-effect waves-light ml-1" onClick={(e) => this.toggleMode(e)}>
                <i className="fa fa-list"></i>{" "}
              </button>
              <button type="button" disabled={this.state.mode === true ? false : true} className="btn btn-light waves-effect waves-light ml-1" onClick={(e) => this.toggleMode(e)}>
                <i className="fa fa-th"></i>{" "}
              </button>
            </div>
          </div>
          <div className="row animate__animated animate__faster animate__slideInUp" style={{ display: this.state.show === false ? "flex" : "none" }}>
            {!this.props.isLoading ? (
              typeof this.props.folder === "object" ? (
                this.props.folder.length > 0 ? (
                  this.props.folder.map((v, i) => {
                    return (
                      <div className={this.state.mode === true ? "col-md-12 mb-2" : "col-md-4 mb-2"}>
                        <a href="!#" onClick={(e) => this.handleOpen(e, v.path, v.title)}>
                          <div className="card">
                            <div className="card-body">
                              <div className="widget-download-file d-flex align-items-center justify-content-between" key={i}>
                                <div className="d-flex align-items-center mr-3">
                                  <button type="button" className="btn btn-warning btn-circle mr-3" onClick={(e) => this.handleOpen(e, v.path)}>
                                    <i className="fa fa-folder"></i>{" "}
                                  </button>
                                  <div className="user-text-table">
                                    <h6 className="d-inline-block font-15 mb-0">{v.title}</h6>
                                    {/* <p className="mb-0">{v.size}</p> */}
                                  </div>
                                </div>
                                {/* <a href={HEADERS.URL+v.path} target="_blank" className="download-link badge badge-success badge-pill" style={{padding:10+'px'}}>Download</a> */}
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-md-12 mb-2">No folder found.</div>
                )
              ) : (
                <div className="col-md-12 mb-2">No folder found.</div>
              )
            ) : (
              <Preloader />
            )}
          </div>
          <div className="row animate__animated animate__faster animate__slideInUp" style={{ display: this.state.show === true ? "flex" : "none" }}>
            {!this.props.isLoading ? (
              typeof this.props.files === "object" ? (
                this.props.files.length > 0 ? (
                  this.props.files.map((v, i) => {
                    return (
                      <div className={this.state.mode === true ? "col-md-12 mb-2" : "col-md-4 mb-2"}>
                        {/* <a href="!#" onClick={(e) => this.handleOpen(e, v.path)}> */}
                        <div className="card">
                          <div className="card-body">
                            <div className="widget-download-file d-flex align-items-center justify-content-between" key={i}>
                              <div className="d-flex align-items-center mr-3">
                                <button type="button" className="btn btn-danger btn-circle mr-3" onClick={(e) => this.handleDelete(e, v.fullpath)}>
                                  <i className="fa fa-trash"></i>{" "}
                                </button>
                                <div className="user-text-table">
                                  <h6 className="d-inline-block font-15 mb-0">{v.filename}</h6>
                                  <p className="mb-0">{v.size}</p>
                                </div>
                              </div>
                              <a href={v.urls} rel="noopener noreferrer" target="_blank" className="download-link badge badge-success badge-pill" style={{ padding: 10 + "px" }}>
                                Download
                              </a>
                            </div>
                          </div>
                        </div>
                        {/* </a> */}
                      </div>
                    );
                  })
                ) : (
                  <div className="col-md-12 mb-2">No files found.</div>
                )
              ) : (
                <div className="col-md-12 mb-2">No folder found.</div>
              )
            ) : (
              <Preloader />
            )}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    folder: state.siteReducer.data_folder,
    files: state.siteReducer.data_list,
    isLoading: state.siteReducer.isLoading,
  };
};
export default connect(mapStateToProps)(FileManager);
