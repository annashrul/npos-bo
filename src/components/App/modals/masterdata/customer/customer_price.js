import React, { Component } from "react";
import { ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import WrapperModal from "../../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import { ModalToggle } from "redux/actions/modal.action";
import { saveCustomerPrice, FetchCustomerPrice } from "redux/actions/masterdata/customer/customer.action";
import Paginationq from "helper";
import { generateNo, rmComma, toCurrency, toRp } from "../../../../../helper";

class CustomerPrice extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleOnEnter = this.handleOnEnter.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleOnSearch = this.handleOnSearch.bind(this);
    this.state = {
      dataCustomer: [],
      q: "",
    };
  }
  componentWillReceiveProps(nextProps) {
    let data = [];
    if (typeof nextProps.dataCustomerPrice.data === "object") {
      nextProps.dataCustomerPrice.data.map((v, i) => {
        data.push({
          kd_cust: v.kd_cust,
          nama: v.nama,
          harga: v.harga,
          harga_beli_asli: v.harga_beli_asli,
          harga_jual_asli: v.harga_jual_asli,
          satuan: v.satuan,
          barcode: v.barcode,
          nama_toko: v.nama_toko,
        });
        return null;
      });
    }
    // typeof nextProps.dataCustomerPrice.data==='object'?
    //     nextProps.dataCustomerPrice.data.map((v,i)=>{
    //         data.push({"kd_cust":v.kd_cust,"nama":v.nama,"harga":v.harga});
    //         return null;
    //     })
    // : "";
    this.setState({ dataCustomer: data });
  }
  handleChange(event, i) {
    this.setState({ [event.target.name]: event.target.value });
    let dataCustomer = [...this.state.dataCustomer];
    dataCustomer[i] = {
      ...dataCustomer[i],
      [event.target.name]: event.target.value,
    };
    this.setState({ dataCustomer });
  }
  handleOnEnter(i) {
    let data = {};
    data["kd_cust"] = this.state.dataCustomer[i].kd_cust;
    data["barcode"] = this.state.dataCustomer[i].barcode;
    data["harga"] = rmComma(this.state.dataCustomer[i].harga);

    this.props.dispatch(saveCustomerPrice(data));
  }
  toggle(e) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    localStorage.removeItem("nm_brg_price_customer");
    localStorage.removeItem("kd_brg_price_customer");
    localStorage.removeItem("q_price_customer");
    localStorage.removeItem("page_price_customer");
  }
  handlePageChange(pageNumber) {
    let q = localStorage.getItem("q_price_customer");
    localStorage.setItem("page_price_customer", pageNumber);
    this.props.dispatch(FetchCustomerPrice(btoa(localStorage.getItem("kd_brg_price_customer")), pageNumber, q === undefined || q === null ? "" : q));
  }
  handleOnSearch() {
    localStorage.setItem("page_price_customer", 1);

    localStorage.setItem("q_price_customer", this.state.q);
    this.props.dispatch(FetchCustomerPrice(btoa(localStorage.getItem("kd_brg_price_customer")), 1, this.state.q));
  }

  render() {
    const { total, per_page, current_page } = this.props.dataCustomerPrice;

    return (
      <WrapperModal isOpen={this.props.isOpen && this.props.type === "CustomerPrice"} size="lg">
        <ModalHeader toggle={this.toggle}>
          {localStorage.getItem("nm_brg_price_customer")} ( {localStorage.getItem("kd_brg_price_customer")} ) <br />
          <small>( Enter Untuk Menyimpan Data )</small>
        </ModalHeader>
        <ModalBody>
          <input
            type="text"
            placeholder="Cari berdasarkan nama customer"
            name="q"
            className="form-control"
            value={this.state.q}
            onChange={(e) => this.handleChange(e, null)}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                this.handleOnSearch();
              }
            }}
          />
          <br />
          <table className="table table-hover table-noborder">
            <thead>
              <tr>
                <th className="text-left middle text-center" width="1%">
                  No
                </th>
                <th className="text-left middle">Lokasi</th>
                <th className="text-left middle" width="1%">
                  Customer
                </th>
                <th className="text-left middle">Harga jual</th>
                <th className="text-left middle">Harga beli</th>
                <th className="text-left middle">Harga</th>
                {/* <th>Satuan</th> */}
              </tr>
            </thead>
            <tbody>
              {this.state.dataCustomer.length > 0 ? (
                this.state.dataCustomer.map((v, i) => {
                  return (
                    <tr key={i}>
                      <td className="middle nowrap text-center">{generateNo(i, current_page)}</td>
                      <td className="middle nowrap">{v.nama_toko}</td>
                      <td className="middle nowrap">{v.nama}</td>
                      <td className="middle nowrap text-right">{toRp(v.harga_jual_asli)}</td>
                      <td className="middle nowrap text-right">{toRp(v.harga_beli_asli)}</td>
                      <td className="middle nowrap">
                        <div class="input-group">
                          <input
                            type="text"
                            name="harga"
                            className="form-control in-table"
                            value={toCurrency(v.harga)}
                            onChange={(e) => this.handleChange(e, i)}
                            onKeyPress={(event) => {
                              if (event.key === "Enter") {
                                console.log(parseInt(rmComma(event.target.value)));
                                console.log(parseInt(v.harga_beli_asli));

                                if (parseInt(rmComma(event.target.value)) < parseInt(v.harga_beli_asli)) {
                                  alert("harga customer kurang dari harga beli");
                                } else {
                                  this.handleOnEnter(i);
                                }
                              }
                            }}
                          />
                          <div className="input-group-append  in-table">
                            <span className="input-group-text">{v.satuan}</span>
                          </div>
                        </div>
                      </td>
                      {/* <td>{v.satuan}</td> */}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3">
                    <p className="text-center">tidak ada data</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </ModalBody>
        <ModalFooter>
          <div style={{ float: "right" }}>
            <Paginationq current_page={current_page} per_page={per_page} total={total} callback={this.handlePageChange.bind(this)} />
          </div>
        </ModalFooter>
      </WrapperModal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
// const mapDispatch
export default connect(mapStateToProps)(CustomerPrice);
