import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import { lengthBrg, swal } from "../../../helper";
import { update } from "components/model/app.model";
import { actionDataCommon, getDataCommon } from "./FlowTrxCommon";
import Select from "react-select";
import { readProductTrx } from "../../../redux/actions/masterdata/product/product.action";
/* ############# list props ############# */
/* location                    : string   */
/* category                    : string   */
/* loading                     : boolean  */
/* table                       : string   */
/* callbackSetFocus(res)       : void     */
/* callbackGetData(res,brg)    : void     */
class ProductCommon extends Component {
  constructor(props) {
    super(props);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.HandleAddBrg = this.HandleAddBrg.bind(this);
    this.HandleSearch = this.HandleSearch.bind(this);
    this.HandleChangeSelect = this.HandleChangeSelect.bind(this);
    this.HandleChangeSelect = this.HandleChangeSelect.bind(this);
    this.state = {
      scrollPage: 0,
      data_array: [
        { value: 1, label: "Kode barang" },
        { value: 2, label: "Barcode" },
        { value: 3, label: "Deskripsi" },
      ],
      data: { value: 1, label: "Kode barang" },
      dataBahan: {},
      value: "",
    };
  }

  handleLoadMore() {
    if (this.props.data === undefined) return;
    if (
      parseInt(this.props.data.total, 10) >
      parseInt(this.props.data.per_page, 10)
    ) {
      this.props.callbackDispatch();
      this.setState({ scrollPage: this.state.scrollPage + 5 });
    } else {
      swal("Tida ada data.");
    }
    if (!this.props.loading) this.handleScroll();
  }
  handleScroll() {
    let divToScrollTo;
    divToScrollTo = document.getElementById(`item${this.state.scrollPage}`);
    if (divToScrollTo) {
      divToScrollTo.scrollIntoView(false, { behavior: "smooth" });
    }
  }

  HandleAddBrg(item) {
    let table = this.props.table;
    actionDataCommon(table, item, (res) => {
      if (res !== undefined) {
        Object.assign(res, {
          id: res.id,
          qty_adjust: parseInt(res.qty_adjust, 10) + 1,
        });
        update(table, res);
      }
      this.getData();
    });
  }
  getData() {
    getDataCommon(this.props.table, (res, brg) => {
      this.props.callbackGetData(res, brg);
    });
  }

  HandleSearch(val) {
    let state = this.state;
    if (this.props.location === "") {
      swal("Pilih lokasi");
    } else {
      let column = "";
      if (state.data.value === 1) column = "kd_brg";
      if (state.data.value === 2) column = "barcode";
      if (state.data.value === 3) column = "deskripsi";
      this.props.dispatch(
        readProductTrx(
          `page=1&kategori=${this.props.category}&lokasi=${this.props.location}&searchby=${column}&q=${val}`,
          (res) => {
            this.HandleAddBrg(res[0]);
            this.props.callbackSetFocus(res[0]);
          }
        )
      );
      setTimeout(() => this.setState({ value: "" }), 500);
    }
  }

  HandleChangeInput(e) {
    const column = e.target.name;
    const val = e.target.value;
    this.setState({
      [column]: val,
    });
  }
  HandleChangeSelect(val) {
    this.setState({ data: val });
  }

  render() {
    return (
      <div>
        <div className="form-group">
          <label>Pilih barang</label>
          <Select
            options={this.state.data_array}
            placeholder="Pilih barang"
            onChange={this.HandleChangeSelect}
            value={this.state.data}
          />
          <small id="passwordHelpBlock" className="form-text text-muted">
            Cari berdasarkan{" "}
            {this.state.data.value === 1
              ? "Kode Barang"
              : this.state.data.value === 2
              ? "Barcode"
              : "Deskripsi"}
          </small>
        </div>
        <div className="form-group">
          <div className="input-group input-group-sm">
            <input
              autoFocus
              type="text"
              id="chat-search"
              name="value"
              className="form-control form-control-sm"
              placeholder="tulis sesuatu disini ..."
              value={this.state.value}
              onChange={(e) => this.HandleChangeInput(e)}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  this.HandleSearch(event.target.value);
                }
              }}
            />
            <span className="input-group-append">
              <button
                type="button"
                className="btn btn-primary"
                onClick={(event) => {
                  event.preventDefault();
                  this.HandleSearch(this.state.value);
                }}
              >
                <i className="fa fa-search" />
              </button>
            </span>
          </div>
        </div>
        <div
          className="people-list"
          style={{
            height: "300px",
            maxHeight: "100%",
            overflowY: "scroll",
          }}
        >
          <div id="chat_user_2">
            <ul className="chat-list list-unstyled">
              {typeof this.props.dataTrx.data === "object" ? (
                this.props.dataTrx.data.length !== 0 ? (
                  this.props.dataTrx.data.map((i, inx) => {
                    return (
                      <li
                        style={{
                          backgroundColor:
                            this.state.scrollPage === inx ? "#eeeeee" : "",
                        }}
                        id={`item${inx}`}
                        className="clearfix"
                        key={inx}
                        onClick={(e) => {
                          e.preventDefault();
                          Object.assign(this.props.dataTrx.data[inx], {
                            qty_adjust: 0,
                          });
                          this.HandleAddBrg(this.props.dataTrx.data[inx]);
                          this.props.callbackSetFocus(
                            this.props.dataTrx.data[inx]
                          );
                        }}
                      >
                        <div className="about">
                          <div
                            className="status"
                            style={{
                              color: "black",
                              fontWeight: "bold",
                              wordBreak: "break-all",
                              fontSize: "12px",
                            }}
                          >
                            {i.nm_brg}
                          </div>
                          <div
                            className="status"
                            style={{
                              color: "#a1887f",
                              fontWeight: "bold",
                              wordBreak: "break-all",
                              fontSize: "12px",
                            }}
                          >
                            {i.barcode}
                          </div>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: "11px",
                      fontStyle: "italic",
                    }}
                  >
                    Barang tidak ditemukan.
                  </div>
                )
              ) : (
                ""
              )}
            </ul>
          </div>
        </div>
        <hr />
        <div className="form-group">
          <button
            className={"btn btn-primary"}
            style={{ width: "100%" }}
            onClick={this.handleLoadMore}
          >
            {this.props.isLoading ? (
              "Tunggu Sebentar"
            ) : (
              <i className="fa fa-refresh"></i>
            )}
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToPropsCreateItem = (state) => ({
  loadingTrx: state.productReducer.isLoadingTrx,
  dataTrx: state.productReducer.dataTrx,
});

export default connect(mapStateToPropsCreateItem)(ProductCommon);
