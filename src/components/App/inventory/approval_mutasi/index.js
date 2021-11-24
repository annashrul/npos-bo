import React, { Component } from "react";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
// import Select from "react-select";
import { FetchApprovalMutation } from "redux/actions/inventory/mutation.action";
import moment from "moment";
// import Preloader from "../../../../Preloader";
import Paginationq from "helper";
import { ModalToggle, ModalType } from "../../../../redux/actions/modal.action";
import FormApprovalMutation from "../../modals/inventory/mutation/form_approval_mutation";
import { FetchApprovalMutationDetail } from "../../../../redux/actions/inventory/mutation.action";
import { Link } from "react-router-dom";
import { Card, CardBody, Collapse } from "reactstrap";
import { toRp } from "../../../../helper";

class ApprovalMutasi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location_data: [],
      location: "",
      kd_trx: "",
      status: "",
      isOpen: false,
      indexOpen: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
    this.HandleSearch = this.HandleSearch.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.toggle = this.toggle.bind(this);
  }
  getProps(param) {
    if (param.auth.user) {
      let lk = [];
      let loc = param.auth.user.lokasi;
      if (loc !== undefined) {
        loc.map((i) => {
          lk.push({
            value: i.kode,
            label: i.nama,
          });
          return null;
        });
        this.setState({
          location_data: lk,
        });
      }
    }
  }
  componentWillMount() {
    this.getProps(this.props);
    // this.props.dispatch(FetchApprovalMutation(1,'','',''));
  }
  componentWillReceiveProps = (nextProps) => {
    this.getProps(nextProps);
  };
  HandleChangeLokasi(lk) {
    this.setState({
      location: lk.value,
    });
    this.props.dispatch(FetchApprovalMutation(1, this.state.kd_trx !== "" ? this.state.kd_trx : "", lk.value, ""));
  }
  handlePageChange(pageNumber) {
    this.props.dispatch(FetchApprovalMutation(pageNumber, this.state.kd_trx !== "" ? this.state.kd_trx : "", this.state.location !== "" ? this.state.location : "", ""));
  }
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  HandleSearch(event) {
    this.props.dispatch(FetchApprovalMutation(1, this.state.kd_trx, "", ""));
  }
  toggleModal(e, kd_trx, total = 20) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formApprovalMutation"));
    localStorage.setItem("kd_trx_mutasi", kd_trx);
    this.props.dispatch(FetchApprovalMutationDetail(total, kd_trx));
  }
  toggle(e, index, lokasi) {
    e.preventDefault();
    console.log(lokasi);
    this.setState({
      location: lokasi,
      isOpen: !this.state.isOpen,
      indexOpen: index === this.state.indexOpen ? null : index,
    });
    if (index !== this.state.indexOpen) {
      this.props.dispatch(FetchApprovalMutation(1, "", lokasi, ""));
    }
  }
  render() {
    const {
      total,
      // last_page,
      per_page,
      current_page,
      // from,
      // to,
      data,
    } = this.props.mutation;
    // const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
    return (
      <Layout page="Approval Mutasi">
        <div className="card">
          <div className="card-header">
            <div className="card-body d-flex align-items-center justify-content-between">
              <h5>Approval Mutasi</h5>
              <div>
                <Link to="report/mutation" className="btn btn-outline-info">
                  <i className="fa fa-eye"></i>&nbsp;VIEW REPORT
                </Link>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-3">
                <div className="form-group">
                  <label className="control-label">No Faktur Mutasi</label>
                  <div className="input-group">
                    <input
                      type="text"
                      name="kd_trx"
                      value={this.state.kd_trx}
                      className="form-control"
                      style={{ height: "38px" }}
                      onChange={this.handleChange}
                      onKeyUp={() => {
                        if (this.state.kd_trx.length > 3) {
                          this.HandleSearch();
                        }
                      }}
                    />
                    <div className="input-group-append">
                      {this.props.isLoading && this.state.kd_trx !== "" ? (
                        <button className={`btn btn-primary`} type="button">
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                          <span className="sr-only">Loading...</span>
                        </button>
                      ) : (
                        <button className="btn btn-primary">
                          <i className="fa fa-search"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div>
                  {this.state.kd_trx !== "" && this.state.kd_trx.length > 3 ? (
                    <Card>
                      <CardBody style={{ minHeight: "min-content", maxHeight: "400px", overflowX: "auto" }}>
                        {typeof data === "object"
                          ? data.length > 0
                            ? data.map((w, j) => {
                                return (
                                  <div className="card rounded bg-dark mb-1">
                                    <div className="card-header d-flex align-items-center justify-content-between">
                                      <div>
                                        <h6 className="text-light">
                                          {w.no_faktur_mutasi} | Tanggal : {moment(w.tgl_mutasi).format("yyyy-MM-DD")}
                                        </h6>
                                        <small className="text-light">Lokasi Tujuan : {w.nama_tujuan} | </small>
                                        <small className="text-light">Lokasi Asal : {w.nama_asal} | </small>
                                        <small className="text-light">Total Item : {toRp(parseInt(w.total_qty, 10))} | </small>
                                        <small className="text-light">Total Approval : {toRp(parseInt(w.total_approval, 10))}</small>
                                      </div>
                                      <button
                                        className="btn btn-primary"
                                        onClick={(e) => this.toggleModal(e, w.no_faktur_mutasi, parseInt(w.total_qty, 10))}
                                        type="button"
                                        data-toggle="collapse"
                                        data-target="#collapseOne"
                                        aria-expanded="false"
                                        aria-controls="collapseOne"
                                      >
                                        <i class="fa fa-check"></i>&nbsp;Approval
                                      </button>
                                    </div>
                                  </div>
                                );
                              })
                            : "No data."
                          : "No data."}
                      </CardBody>
                    </Card>
                  ) : // {
                  this.state.location_data !== undefined ? (
                    this.state.location_data.length > 0 ? (
                      this.state.location_data.map((v, i) => {
                        return (
                          <div className="accordion" key={i}>
                            <div className="card mb-2">
                              <button className="btn btn-link btn-block text-left" onClick={(e) => this.toggle(e, i, v.value)}>
                                <div className="card-header d-flex align-items-center justify-content-between" style={{ borderBottom: "none" }}>
                                  <h5 className="mb-0">
                                    {/* <button className="btn btn-link collapsed" onClick={this.toggle} type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne"> */}
                                    {v.label}
                                    {/* </button> */}
                                  </h5>
                                  {this.props.isLoading && this.state.indexOpen === i ? (
                                    <div className="spinner-border spinner-border-sm text-info" role="status" />
                                  ) : (
                                    <h5>
                                      <i className={this.state.indexOpen === i ? "fa fa-angle-up" : "fa fa-angle-down"}></i>
                                    </h5>
                                  )}
                                </div>
                              </button>
                              <Collapse isOpen={this.props.isLoading ? false : this.state.indexOpen === i}>
                                <Card>
                                  <CardBody style={{ minHeight: "min-content", maxHeight: "400px", overflowX: "auto" }}>
                                    {typeof data === "object"
                                      ? data.length > 0
                                        ? data.map((w, j) => {
                                            return (
                                              <div className="accordion" key={j}>
                                                <div className="card rounded bg-dark mb-1">
                                                  <div className="card-header d-flex align-items-center justify-content-between">
                                                    <div>
                                                      <h6 className="text-light">
                                                        {w.no_faktur_mutasi} | Tanggal : {moment(w.tgl_mutasi).format("yyyy-MM-DD")}
                                                      </h6>
                                                      <small className="text-light">Lokasi Tujuan : {w.nama_tujuan} | </small>
                                                      <small className="text-light">Lokasi Asal : {w.nama_asal} | </small>
                                                      <small className="text-light">Total Item : {toRp(parseInt(w.total_qty, 10))} | </small>
                                                      <small className="text-light">Total Approval : {toRp(parseInt(w.total_approval, 10))}</small>
                                                    </div>
                                                    <button
                                                      className="btn btn-primary"
                                                      onClick={(e) => this.toggleModal(e, w.no_faktur_mutasi, parseInt(w.total_qty, 10))}
                                                      type="button"
                                                      data-toggle="collapse"
                                                      data-target="#collapseOne"
                                                      aria-expanded="false"
                                                      aria-controls="collapseOne"
                                                    >
                                                      <i class="fa fa-check"></i>&nbsp;Approval
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })
                                        : "No data."
                                      : "No data."}
                                    {this.props.isLoading ? (
                                      false
                                    ) : this.state.indexOpen === i ? (
                                      <div style={{ marginTop: "20px", float: "right" }}>
                                        <Paginationq current_page={current_page} per_page={per_page} total={total} callback={this.handlePageChange.bind(this)} />
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </CardBody>
                                </Card>
                              </Collapse>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      "no data"
                    )
                  ) : (
                    "no data"
                  )}
                </div>
              </div>
              {/* <div className="col-md-12 d-none">
                                <div style={{overflowX: "auto"}}>
                                    <table className="table table-hover table-bordered">
                                        <thead className="bg-light">
                                        <tr>
                                            <th className="text-black" style={columnStyle}>No Faktur Mutasi</th>
                                            <th className="text-black" style={columnStyle}>Tanggal</th>
                                            <th className="text-black" style={columnStyle}>Lokasi Tujuan</th>
                                            <th className="text-black" style={columnStyle}>Lokasi Asal</th>
                                            <th className="text-black" style={columnStyle}>Total Item</th>
                                            <th className="text-black" style={columnStyle}>Total Approval</th>
                                            <th className="text-black" style={columnStyle}>#</th>
                                        </tr>
                                        </thead>
                                        {
                                            !this.props.isLoading?(<tbody>
                                            {
                                                (
                                                    typeof data === 'object' ? data.length > 0 ?
                                                        data.map((v,i)=>{
                                                            return(
                                                                <tr key={i}>
                                                                    <td style={columnStyle}>{v.no_faktur_mutasi}</td>
                                                                    <td style={columnStyle}>{moment(v.tgl_mutasi).format("yyyy-MM-DD")}</td>
                                                                    <td style={columnStyle}>{v.nama_asal}</td>
                                                                    <td style={columnStyle}>{v.nama_tujuan}</td>
                                                                    <td style={columnStyle}>{v.total_qty}</td>
                                                                    <td style={columnStyle}>{v.total_approval}</td>
                                                                    <td style={columnStyle}>
                                                                        <button className="btn btn-primary" onClick={(e)=>this.toggleModal(e,v.no_faktur_mutasi)}>
                                                                            Approval
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                        : "No data." : "No data."
                                                )
                                            }
                                            </tbody>):<Preloader/>
                                        }
                                    </table>
                                </div>

                                <div style={{"marginTop":"20px","float":"right"}}>
                                    <Paginationq
                                        current_page={current_page}
                                        per_page={per_page}
                                        total={total}
                                        callback={this.handlePageChange.bind(this)}
                                    />
                                </div>
                            </div> */}
            </div>
          </div>
        </div>
        <FormApprovalMutation parameterMutasi={this.state.status} dataApproval={this.props.detailApproval} lokasi={this.state.location} />
      </Layout>
    );
  }
}

const mapStateToPropsCreateItem = (state) => ({
  auth: state.auth,
  isOpen: state.modalReducer,
  mutation: state.mutationReducer.dataApproval,
  isLoading: state.mutationReducer.isLoadingApproval,
  detailApproval: state.mutationReducer.dataApprovalDetail,
});

export default connect(mapStateToPropsCreateItem)(ApprovalMutasi);
