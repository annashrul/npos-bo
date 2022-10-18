import React, { Component } from "react";
import {
  deleteBank,
  FetchBank,
} from "redux/actions/masterdata/bank/bank.action";
import connect from "react-redux/es/connect/connect";
import Paginationq from "helper";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import FormBank from "components/App/modals/masterdata/bank/form_bank";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import Default from "assets/noimage.png";
import ButtonActionCommon from "../../../common/ButtonActionCommon";

class ListBank extends Component {
  constructor(props) {
    super(props);
    this.handlesearch = this.handlesearch.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.state = {
      any: "",
      detail: {},
    };
  }
  handleService(any, page) {
    let where = `page=${page}`;
    if (any !== "") where += `&q=${any}`;
    this.props.dispatch(FetchBank(where));
  }
  handlePageChange(pageNumber) {
    this.handleService(this.state.any, pageNumber);
  }
  handlesearch(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    let any = data.get("any");
    this.handleService(any, 1);
  }
  toggleModal(e) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formBank"));
    this.setState({ detail: {} });
  }
  handleEdit(val) {
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formBank"));
    this.setState({
      detail: {
        id: val.id,
        akun: val.akun,
        charge_debit: val.debit,
        charge_kredit: val.kredit,
        edc: val.edc,
        foto: val.foto,
        status: val.status,
        nama: val.nama,
      },
    });
  }

  handleDelete(e, id) {
    e.preventDefault();
    this.props.dispatch(deleteBank(id));
  }
  render() {
    const { current_page, data, per_page, total } = this.props.data;
    return (
      <div>
        <form onSubmit={this.handlesearch} noValidate>
          <div className="row">
            <div className="col-6 col-xs-6 col-md-11">
              <div className="row">
                <div className="col-md-12">
                  <div className="input-group input-group-sm">
                    <input
                      type="search"
                      name="any"
                      className="form-control form-control-sm"
                      placeholder="cari berdasarkan nama"
                      value={this.state.any}
                      onChange={(e) => {
                        this.setState({ any: e.target.value });
                      }}
                    />
                    <span className="input-group-append">
                      <button type="submit" className="btn btn-primary">
                        <i className="fa fa-search" />
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6 col-xs-6 col-md-1 text-right">
              <div className="form-group">
                <button
                  type="button"
                  onClick={(e) => this.toggleModal(e)}
                  className="btn btn-primary"
                >
                  <i className="fa fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className="row">
          {total !== "0" ? (
            typeof data === "object" ? (
              data.map((v, i) => {
                return (
                  <div className="col-6 col-xs-6 col-md-3 mb-4" key={i}>
                    <div className="card">
                      <div className="social-widget">
                        <div className={`ribbon ribbon-${v.status === "1" ? "success" : "danger"}`}>
                          {v.status === "1" ? "Aktif" : "Tidak aktif"}
                        </div>
                        <div className="bg-light text-center text-white font-30">
                          <img
                            src={v.foto === null ? "error" : v.foto}
                            alt="netindo"
                            onError={(e) => {  e.target.onerror = null;e.target.src = `${Default}`;}}
                            style={{width:"100%" }}
                          />
                        </div>
                        <div className="row">
                          <div className="col-8 text-left">
                            <div className="p-2">
                              <p style={{ fontSize: "14px"}}><b>{v.akun}</b></p>
                            </div>
                          </div>
                          <div className="col-4 text-center">
                            <div className="p-2">
                              <ButtonActionCommon
                                action={[{ label: "Edit"},{ label: "Hapus"}]}
                                callback={(e) => {
                                  if (e === 0) this.handleEdit(v);
                                  if (e === 1) this.handleDelete(v.id);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 text-left">
                            <div className="p-2">
                              <table className="table" style={{ padding: 0, border: "none" }}>
                                <thead>
                                  <tr>
                                    <th
                                      style={{
                                        paddingTop: "3px",
                                        paddingBottom: "3px",
                                        paddingLeft: 0,
                                        paddingRight: 0,
                                        borderTop: "none",
                                      }}
                                    >
                                      Bank Name
                                    </th>
                                    <th
                                      style={{
                                        paddingTop: "3px",
                                        paddingBottom: "3px",
                                        paddingLeft: 0,
                                        paddingRight: 0,
                                        borderTop: "none",
                                      }}
                                    >
                                      {" "}
                                      {v.nama}
                                    </th>
                                  </tr>
                                  <tr>
                                    <th
                                      style={{
                                        paddingTop: "3px",
                                        paddingBottom: "3px",
                                        paddingLeft: 0,
                                        paddingRight: 0,
                                        borderTop: "none",
                                      }}
                                    >
                                      Charge Debit
                                    </th>
                                    <th
                                      style={{
                                        paddingTop: "3px",
                                        paddingBottom: "3px",
                                        paddingLeft: 0,
                                        paddingRight: 0,
                                        borderTop: "none",
                                      }}
                                    >
                                      {" "}
                                      {v.charge_debit}
                                    </th>
                                  </tr>
                                  <tr>
                                    <th
                                      style={{
                                        paddingTop: "3px",
                                        paddingBottom: "3px",
                                        paddingLeft: 0,
                                        paddingRight: 0,
                                        borderTop: "none",
                                      }}
                                    >
                                      Charge Credit
                                    </th>
                                    <th
                                      style={{
                                        paddingTop: "3px",
                                        paddingBottom: "3px",
                                        paddingLeft: 0,
                                        paddingRight: 0,
                                        borderTop: "none",
                                      }}
                                    >
                                      {" "}
                                      {v.charge_kredit}
                                    </th>
                                  </tr>
                                  <tr>
                                    <th
                                      style={{
                                        paddingTop: "3px",
                                        paddingBottom: "3px",
                                        paddingLeft: 0,
                                        paddingRight: 0,
                                        borderTop: "none",
                                      }}
                                    >
                                      EDC
                                    </th>
                                    <th
                                      style={{
                                        paddingTop: "3px",
                                        paddingBottom: "3px",
                                        paddingLeft: 0,
                                        paddingRight: 0,
                                        borderTop: "none",
                                      }}
                                    >
                                      {" "}
                                      {v.edc === "1" ? (
                                        <i
                                          className="fa fa-check-circle"
                                          style={{ color: "green" }}
                                        ></i>
                                      ) : (
                                        <i
                                          className="fa fa-close"
                                          style={{ color: "red" }}
                                        ></i>
                                      )}
                                    </th>
                                  </tr>
                                </thead>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              "No data."
            )
          ) : (
            <div className="col-md-12">
              <h1 className="text-center">No Data</h1>
            </div>
          )}
        </div>
        <div style={{ marginTop: "20px", float: "right" }}>
          <Paginationq
            current_page={current_page}
            per_page={per_page}
            total={total}
            callback={this.handlePageChange.bind(this)}
          />
        </div>
        <FormBank token={this.props.token} detail={this.state.detail} />
      </div>
    );
  }
}

export default connect()(ListBank);
