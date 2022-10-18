import React, { Component } from "react";
import Layout from "../Layout";
import connect from "react-redux/es/connect/connect";
import { Card, CardBody, CardHeader, Collapse } from "reactstrap";
import { FetchKartuPiutang, FetchPiutang } from "../../../redux/actions/piutang/piutang.action";
import { toRp } from "../../../helper";
import Spinner from "../../../Spinner";
import BayarPiutangForm from "./src/bayar_piutang_form";
import moment from "moment";
import Paginationq from "helper";
import DetailPiutangTrx from "../modals/piutang/DetailPiutangTrx";
import { FetchReportDetailPiutangTrx, FetchReportDetailSale } from "../../../redux/actions/sale/sale.action";
import { ModalType } from "../../../redux/actions/modal.action";

class BayarPiutang extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      indexOpen: null,
      isPay: false,
      data: {},
      detail: {},
    };
    this.toggle = this.toggle.bind(this);
    this.handleBayar = this.handleBayar.bind(this);
    this.handlesearch = this.handlesearch.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleDetail = this.handleDetail.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(FetchKartuPiutang("page=1"));
  }

  handleDetail(e, v) {
    e.preventDefault();
    this.setState({
      isModalDetail: true,
      detail: v,
    });

    // this.props.dispatch(ModalType("detailPiutangTrx"));
    this.props.dispatch(FetchReportDetailPiutangTrx(v.kd_trx, "", true));
  }
  toggle(e, index) {
    e.preventDefault();
    this.setState({
      isOpen: !this.state.isOpen,
      indexOpen: index,
    });
  }
  handleBayar(e, kode) {
    e.preventDefault();
    this.setState({
      isPay: !this.state.isPay,
      data: { kode: kode },
    });

    this.props.dispatch(FetchPiutang(kode));
  }
  handlesearch(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    let any = data.get("any");
    localStorage.setItem("any_kartu_piutang", any);
    this.props.dispatch(FetchKartuPiutang(`page=1&customer=${any}`));
  }
  handlePageChange(pageNumber) {
    let any = localStorage.getItem("any_kartu_piutang");
    let where = `page=${pageNumber}`;
    if (any && any !== "") {
      where += `&customer=${any}`;
    }
    this.props.dispatch(FetchKartuPiutang(where));
  }
  update(value) {
    return () => {
      this.setState({
        isPay: value,
      });
    };
  }
  render() {
    const { last_page, current_page, per_page, data, total_piutang } =
      this.props.getKartuPiutang === undefined ? { last_page: "", per_page: "", current_page: "", data: [], total_piutang: "" } : this.props.getKartuPiutang;
    //

    return (
      <Layout page="Bayar Piutang">
        <Card>
          <CardHeader className="bg-transparent d-flex align-items-center justify-content-between">
            <h4>Pembayaran Piutang</h4>
            <h4>Total Piutang Rp. {toRp(parseInt(total_piutang, 10))}</h4>
          </CardHeader>
          <CardBody hidden={this.state.isPay}>
            <form onSubmit={this.handlesearch} noValidate>
              <div className="row">
                <div className="col-10 col-xs-10 col-md-3">
                  <div className="form-group">
                    <label>Search</label>
                    <input type="text" className="form-control" name="any" defaultValue={localStorage.getItem("any_kartu_piutang")} />
                  </div>
                </div>
                <div className="col-2 col-xs-2 col-md-3">
                  <div className="form-group">
                    <button style={{ marginTop: "27px" }} type="submit" className="btn btn-primary">
                      <i className="fa fa-search"></i>
                    </button>
                  </div>
                </div>
              </div>
            </form>
            {!this.props.isLoading ? (
              <div>
                {data !== undefined
                  ? data.length > 0
                    ? data.map((v, i) => {
                        return (
                          <div className="accordion" key={i}>
                            <div className="card mb-2">
                              <button className="btn btn-link btn-block text-left" onClick={(e) => this.toggle(e, i)}>
                                <div className="card-header d-flex align-items-center justify-content-between" style={{ borderBottom: "none" }}>
                                  <h5 className="mb-0">
                                    {/* <button className="btn btn-link collapsed" onClick={this.toggle} type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne"> */}
                                    {v.nama} | Sisa : Rp. {toRp(parseInt(v.sisa_piutang, 10))}
                                    {/* </button> */}
                                  </h5>
                                  <h5>
                                    <i className={this.state.isOpen && this.state.indexOpen === i ? "fa fa-angle-up" : "fa fa-angle-down"}></i>
                                  </h5>
                                </div>
                              </button>
                              <Collapse isOpen={this.state.isOpen && this.state.indexOpen === i}>
                                <Card>
                                  <CardBody style={{ minHeight: "min-content", maxHeight: "400px", overflowX: "auto" }}>
                                    {v.detail.map((w, j) => {
                                      return (
                                        <div className="accordion" key={j}>
                                          <div className="card rounded bg-dark mb-1">
                                            <div className="card-header d-flex align-items-center justify-content-between">
                                              <div className="d-flex align-items-center justify-content-start">
                                                <div>
                                                  <h6 className="text-light">
                                                    {w.kd_trx} | Sisa : Rp. {toRp(parseInt(w.sisa_piutang, 10))}
                                                  </h6>
                                                  <small className="text-light">Dibuat: {moment(w.tgl).format("YYYY-MM-DD")} | </small>
                                                  <small className="text-light">Tempo: {moment(w.tempo).format("YYYY-MM-DD")} | </small>
                                                  <small className="text-light">Piutang : {toRp(parseInt(w.piutang, 10))} | </small>
                                                  <small className="text-light">Dibayar : {toRp(parseInt(w.dibayar, 10))}</small>
                                                </div>
                                              </div>
                                              <div>
                                                <button className="btn btn-info mr-2" onClick={(e) => this.handleDetail(e, w)}>
                                                  <i className="fa fa-eye" />
                                                  &nbsp;Detail
                                                </button>
                                                <button
                                                  className="btn btn-primary"
                                                  onClick={(e) => this.handleBayar(e, w.kd_trx)}
                                                  type="button"
                                                  data-toggle="collapse"
                                                  data-target="#collapseOne"
                                                  aria-expanded="false"
                                                  aria-controls="collapseOne"
                                                >
                                                  <i className="fa fa-usd"></i>&nbsp;Bayar
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </CardBody>
                                </Card>
                              </Collapse>
                            </div>
                          </div>
                        );
                      })
                    : "no data"
                  : "no data"}
              </div>
            ) : (
              <Spinner spinnerLabel={"Memuat data ..."} />
            )}

            <div style={{ marginTop: "20px", float: "right" }}>
              <Paginationq current_page={current_page} per_page={per_page} total={last_page * per_page} callback={this.handlePageChange.bind(this)} />
            </div>
          </CardBody>
          <CardBody hidden={!this.state.isPay}>
            <BayarPiutangForm data={this.state.data} action={this.update.bind(this)} history={this.props.history} />
          </CardBody>
        </Card>
        {this.props.isOpen && this.state.isModalDetail ? <DetailPiutangTrx detailSale={this.props.detailSale} detail={this.state.detail} /> : null}
      </Layout>
    );
  }
}
const mapStateToPropsCreateItem = (state) => ({
  auth: state.auth,
  getKartuPiutang: state.piutangReducer.data_kartu_piutang,
  isLoading: state.piutangReducer.isLoading,
  detailSale: state.saleReducer.dataDetail,
  isOpen: state.modalReducer,
  type: state.modalTypeReducer,
});

export default connect(mapStateToPropsCreateItem)(BayarPiutang);
