import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import * as Swal from "sweetalert2";
import Preloader from "Preloader";
import { deleteFiles, FetchTables } from "redux/actions/site.action";
import { HEADERS } from "redux/actions/_constants";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import FormBackup from "../../../modals/setting/form_setting_backup";

class BackupList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  toggle(e) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formBackup"));
    this.props.dispatch(FetchTables());
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

  render() {
    return (
      <div>
        <div className="card-body">
          <div className="bg-transparent d-flex align-items-center justify-content-between mb-20">
            <div className="widgets-card-title">
              <h5 className="card-title mb-0">List Backup</h5>
            </div>
            <button type="button" className="btn btn-primary btn-circle" onClick={(e) => this.toggle(e)}>
              <i className="fa fa-plus"></i>{" "}
            </button>
          </div>
          {!this.props.isLoading ? (
            typeof this.props.files === "object" ? (
              this.props.files.length > 0 ? (
                this.props.files.map((v, i) => {
                  return (
                    <div className="widget-download-file d-flex align-items-center justify-content-between mb-4" key={i}>
                      <div className="d-flex align-items-center mr-3">
                        <button type="button" className="btn btn-danger btn-circle mr-3" onClick={(e) => this.handleDelete(e, v.fullpath)}>
                          <i className="fa fa-trash"></i>{" "}
                        </button>
                        <div className="user-text-table">
                          <h6 className="d-inline-block font-15 mb-0">{v.filename}</h6>
                          <p className="mb-0">{v.size}</p>
                        </div>
                      </div>
                      <a href={HEADERS.URL + v.path} target="_blank" rel="noopener noreferrer" className="download-link badge badge-success badge-pill" style={{ padding: 10 + "px" }}>
                        Download
                      </a>
                    </div>
                  );
                })
              ) : (
                "No data."
              )
            ) : (
              "No data."
            )
          ) : (
            <Preloader />
          )}
          <FormBackup />
        </div>
      </div>
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
export default connect(mapStateToProps)(BackupList);
