import React, { Component } from "react";
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import { FetchPromo, FetchPromoKategori } from "redux/actions/masterdata/promo/promo.action";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import moment from "moment";
import Paginationq from "helper";
import FormPromo from "components/App/modals/masterdata/promo/form_promo";
import { HEADERS } from "redux/actions/_constants";
import { deletePromo, FetchPromoDetail } from "redux/actions/masterdata/promo/promo.action";
import { FetchGroupProduct } from "redux/actions/masterdata/group_product/group_product.action";
import { FetchSupplierAll } from "redux/actions/masterdata/supplier/supplier.action";
import { FetchAllLocation } from "redux/actions/masterdata/location/location.action";
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
import Noimage from "assets/default.png";

class Promo extends Component {
  constructor(props) {
    super(props);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.state = {
      detail: {},
      lokasi_data: [],
      kategori_data: [],
      isModalForm: false,
      any: "",
    };

    this.handlePagin = this.handlePagin.bind(this);
  }
  handleService(any, page) {
    let where = `page=${page}`;
    if (any !== "") where += `&q=${where}`;
    this.props.dispatch(FetchPromo(where));
  }
  componentWillUnmount() {
    this.setState({ isModalForm: false });
  }
  componentWillReceiveProps = (nextProps) => {
    this.setState({
      lokasi_data: nextProps.lokasi.data,
      kategori_data: nextProps.promo_kategori,
    });
  };
  componentWillMount() {
    this.props.dispatch(FetchPromoKategori());
    this.handleService("", 1);
    this.props.dispatch(FetchAllLocation());
  }
  toggleModal(e, res = null) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formPromo"));
    this.props.dispatch(FetchSupplierAll());
    this.props.dispatch(FetchGroupProduct(1, "", 100));
    if (res !== null) {
      this.props.dispatch(FetchPromoDetail(res.id));
    }
    let state = { isModalForm: true };
    this.setState(state);
  }
  handlePagin(param) {
    this.handleService(this.state.any, param);
  }
  handleSearch(event) {
    event.preventDefault();
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    let any = data.get("any");
    this.handleService(any, 1);
  }

  handleDelete(e, id) {
    e.preventDefault();
    this.props.dispatch(deletePromo(id));
  }

  render() {
    const {
      current_page,
      data,
      // from,
      // last_page,
      per_page,
      // to,
      total,
    } = this.props.promo;
    // const columnStyle = {verticalAlign: "middle", textAlign: "center",};
    console.log(this.state);
    return (
      <Layout page="Promo">
        <form onSubmit={this.handleSearch} noValidate>
          <div className="row">
            <div className="col-10 col-xs-10 col-md-11">
              <div className="row">
                <div className="col-md-4">
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
            <div className="col-4 col-xs-2 col-md-1 text-right">
              <div className="form-group">
                <button type="button" onClick={(e) => this.toggleModal(e)} className="btn btn-primary">
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
                console.log(this.state.kategori_data);
                // let kategori = this.state.kategori_data.filter(res=>res)
                // let arrLok = v.lokasi.split(",");
                // let kat =
                //   this.state.kategori_data === undefined
                //     ? ""
                //     : this.state.kategori_data.filter(
                //         (item) => item.kode === v.category
                //       );
                // let val =
                //   this.state.lokasi_data === undefined
                //     ? ""
                //     : this.state.lokasi_data.filter(
                //         (item) => item.kode === v.lokasi
                //       );
                // let val1 =
                //   this.state.lokasi_data === undefined
                //     ? ""
                //     : this.state.lokasi_data.filter(
                //         (item) => item.kode === arrLok[0]
                //       );
                // let val2 =
                //   this.state.lokasi_data === undefined
                //     ? ""
                //     : this.state.lokasi_data.filter(
                //         (item) => item.kode === arrLok[1]
                //       );
                // let val3 =
                //   this.state.lokasi_data === undefined
                //     ? ""
                //     : this.state.lokasi_data.filter(
                //         (item) => item.kode === arrLok[2]
                //       );
                // let getVal1 =
                //   this.state.lokasi_data === undefined
                //     ? ""
                //     : val1[0] === undefined
                //     ? ""
                //     : val1[0].nama_toko;
                // let getVal2 =
                //   this.state.lokasi_data === undefined
                //     ? ""
                //     : val2[0] === undefined
                //     ? ""
                //     : val2[0].nama_toko;
                // let getVal3 =
                //   this.state.lokasi_data === undefined
                //     ? ""
                //     : val3[0] === undefined
                //     ? ""
                //     : val3[0].nama_toko;
                return (
                  <div className="col-xl-3 col-md-6 mb-4" key={i}>
                    <div className="card">
                      <div className="social-widget">
                        <div className={"bg-light p-3 text-center text-white font-30"}>
                          <img src={v.gambar === "-" ? Noimage : `${HEADERS.URL + v.gambar}`} style={{ height: "120px" }} alt="" />
                        </div>
                        <div className="row">
                          <div className="col-8 text-left">
                            <div className="p-2">
                              <p style={{ fontSize: "12px" }}>{v.id_promo}</p>
                            </div>
                          </div>
                          <div className="col-4 text-center">
                            <div className="p-2">
                              <div className="dashboard-dropdown">
                                <UncontrolledButtonDropdown>
                                  <DropdownToggle
                                    caret
                                    style={{
                                      background: "transparent",
                                      border: "none",
                                    }}
                                  >
                                    <i className="zmdi zmdi-more-vert" />
                                  </DropdownToggle>
                                  <DropdownMenu>
                                    <DropdownItem onClick={(e) => this.toggleModal(e, v)}>
                                      <i className="ti-pencil-alt" /> Edit
                                    </DropdownItem>
                                    <DropdownItem onClick={(e) => this.handleDelete(e, v.id_promo)}>
                                      <i className="ti-trash" /> Delete
                                    </DropdownItem>
                                  </DropdownMenu>
                                </UncontrolledButtonDropdown>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12 text-left">
                            <div className="p-2">
                              <table className="table" style={{ padding: 0, border: "none" }}>
                                <thead>
                                  <tr>
                                    <td
                                      style={{
                                        paddingTop: "3px",
                                        paddingBottom: "3px",
                                        paddingLeft: 0,
                                        paddingRight: 5,
                                        borderTop: "none",
                                      }}
                                    >
                                      Kategori{" "}
                                    </td>
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
                                      {/* Promo {kat[0].title} */}
                                      Promo
                                    </th>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        paddingTop: "3px",
                                        paddingBottom: "3px",
                                        paddingLeft: 0,
                                        paddingRight: 5,
                                        borderTop: "none",
                                      }}
                                    >
                                      Lokasi
                                    </td>
                                    <th
                                      style={{
                                        paddingTop: "3px",
                                        paddingBottom: "3px",
                                        paddingLeft: 0,
                                        paddingRight: 0,
                                        borderTop: "none",
                                      }}
                                    >
                                      {/* {arrLok.length >= 3
                                        ? `${getVal1}, ${getVal2}, ${getVal3} ...`
                                        : arrLok.length >= 2
                                        ? `${getVal1} & ${getVal2}`
                                        : this.state.lokasi_data === undefined
                                        ? ""
                                        : val[0] === undefined
                                        ? ""
                                        : val[0].nama_toko} */}
                                      lokasi
                                    </th>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        paddingTop: "3px",
                                        paddingBottom: "3px",
                                        paddingLeft: 0,
                                        paddingRight: 5,
                                        borderTop: "none",
                                      }}
                                    >
                                      Tgl Mulai
                                    </td>
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
                                      {v.periode === "1" ? "-" : moment(v.daritgl).format("YYYY-MM-DD HH:mm:ss")}
                                    </th>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        paddingTop: "3px",
                                        paddingBottom: "3px",
                                        paddingLeft: 0,
                                        paddingRight: 5,
                                        borderTop: "none",
                                      }}
                                    >
                                      Tgl Selesai
                                    </td>
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
                                      {v.periode === "1" ? "-" : moment(v.sampaitgl).format("YYYY-MM-DD HH:mm:ss")}
                                    </th>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        paddingTop: "3px",
                                        paddingBottom: "3px",
                                        paddingLeft: 0,
                                        paddingRight: 5,
                                        borderTop: "none",
                                      }}
                                    >
                                      Member
                                    </td>
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
                                      {v.member === "0" ? "-" : v.member}
                                    </th>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        paddingTop: "3px",
                                        paddingBottom: "3px",
                                        paddingLeft: 0,
                                        paddingRight: 5,
                                        borderTop: "none",
                                      }}
                                    >
                                      Periode
                                    </td>
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
                                      {v.periode === "1" ? "Tanpa Periode" : "-"}
                                    </th>
                                  </tr>
                                  <tr>
                                    <td
                                      style={{
                                        paddingTop: "3px",
                                        paddingBottom: "3px",
                                        paddingLeft: 0,
                                        paddingRight: 5,
                                        borderTop: "none",
                                      }}
                                    >
                                      Catatan
                                    </td>
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
                                      {v.keterangan.length > 20 ? `${v.keterangan.substring(0, 20)} ...` : v.keterangan}
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
              <p className="text-center">No Data</p>
            )
          ) : (
            <p className="text-center">No Data</p>
          )}
        </div>
        <div style={{ marginTop: "20px", float: "right" }}>
          <Paginationq current_page={current_page} per_page={per_page} total={total} callback={this.handlePagin.bind(this)} />
        </div>
        {this.props.isOpen && this.state.isModalForm ? (
          <FormPromo detail={this.props.promo_detail} kategori={this.props.promo_kategori} kel_barang={this.props.kel_barang} supplier={this.props.supplier} lokasi={this.props.lokasi} />
        ) : null}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    authenticated: state.auth,
    promo: state.promoReducer.data,
    promo_kategori: state.promoReducer.data_kategori,
    promo_detail: state.promoReducer.detail,
    isLoading: state.promoReducer.isLoading,
    auth: state.auth,
    kel_barang: state.groupProductReducer.data,
    supplier: state.supplierReducer.dataSupllier,
    lokasi: state.locationReducer.allData,
  };
};

export default connect(mapStateToProps)(Promo);
