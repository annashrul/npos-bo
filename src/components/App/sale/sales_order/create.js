import React, { Component } from "react";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import {
  getCodeSoAction,
  postSalesOrderAction,
} from "../../../../redux/actions/sale/sales_order.action";
import StickyBox from "react-sticky-box";
import Select from "react-select";
// import { FetchBrg } from "redux/actions/masterdata/product/product.action";
import { FetchBrg } from "../../../../redux/actions/masterdata/product/product.action";
import Spinner from "Spinner";
import {
  store,
  get,
  update,
  destroy,
  cekData,
  del,
} from "components/model/app.model";
import { FetchCustomerAll } from "redux/actions/masterdata/customer/customer.action";
import {
  handleDataSelect,
  handleError,
  isEmptyOrUndefined,
  parseToRp,
  rmComma,
  swal,
  swallOption,
  swalWithCallback,
  ToastQ,
  toRp,
} from "../../../../helper";
import TableCommon from "../../common/TableCommon";
import ButtonTrxCommon from "../../common/ButtonTrxCommon";
import moment from "moment";

const table = "sales_order";

class CreateSO extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationData: [],
      location: "",
      customerData: [],
      customer: "",
      toggleSide: false,
      searchBy: 3,
      searchByData: [
        // { value: 1, label: "Barcode" },
        { value: 2, label: "Kode Barang" },
        { value: 3, label: "Nama Barang" },
      ],
      any: "",
      createdAt: moment().format("YYYY-MM-DD"),
      note: "-",
      databrg: [],
      brgval: [],
      perpage: 5,
      scrollPage: 0,
      isScroll: false,
    };
    this.handleClickToggle = this.handleClickToggle.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleStoreProduct = this.handleStoreProduct.bind(this);
    this.handleSetFocus = this.handleSetFocus.bind(this);
    this.handleCheckSearchBy = this.handleCheckSearchBy.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }
  handleClickToggle(e) {
    e.preventDefault();
    this.setState({
      toggleSide: !this.state.toggleSide,
    });
  }
  handleBlur(e, id) {
    const column = e.target.name;
    const val = e.target.value;
    const cek = cekData("barcode", id, table);
    cek.then((res) => {
      if (res === undefined) {
        ToastQ.fire({
          icon: "error",
          title: `not found.`,
        });
      } else {
        let final = {};
        if (column === "qty") {
          Object.keys(res).forEach((k, i) => {
            if (k !== "qty") {
              final[k] = res[k];
            } else {
              final["qty"] = val === "" ? 1 : val;
            }
          });
        }
        update(table, final);
        ToastQ.fire({
          icon: "success",
          title: `${column} has been changed.`,
        });
      }
      this.getData();
    });
  }
  handleSetFocus(barcode) {
    setTimeout(() => this[`qty-${btoa(barcode)}`].focus(), 500);
  }
  handleFocus(e, i) {
    const column = e.target.name;
    const val = e.target.value;
    let brgval = [...this.state.brgval];
    if (column === "qty") {
      if (parseInt(val, 10) < 2) {
        brgval[i] = {
          ...brgval[i],
          [column]: "",
        };
        this.setState({
          brgval,
        });
      }
    }
  }
  handleCheckSearchBy() {
    const searchBy = isEmptyOrUndefined(localStorage.searchBy)
      ? Number(localStorage.searchBy)
      : 1;
    this.setState({ searchBy });
    if (searchBy === 1) {
      return "barcode";
    }
    if (searchBy === 2) {
      return "kd_brg";
    }
    if (searchBy === 3) {
      return "deskripsi";
    }
  }

  handleChange(e, i = null) {
    const val = e.target.value;
    const col = e.target.name;
    if (i !== null) {
      let brgval = [...this.state.brgval];
      brgval[i] = { ...brgval[i], [col]: val };
      this.setState({ brgval });
    } else {
      localStorage.setItem(col, val);
      this.setState({ [col]: val });
    }
  }

  handleSelect(e, state) {
    if (state === "location") {
      this.props.dispatch(FetchCustomerAll(e.value));
      this.props.dispatch(getCodeSoAction(e.value));
      const searchBy = this.handleCheckSearchBy();
      this.props.dispatch(
        FetchBrg(1, searchBy, "", e.value, null, this.autoSetQty, 5)
      );
    }
    localStorage.setItem(state, e.value);
    this.setState({ [state]: e.value, any: "" });
  }

  handleSearch(e) {
    const val = e.target.value;
    const searchBy = this.handleCheckSearchBy();
    this.props.dispatch(
      FetchBrg(
        1,
        searchBy,
        val,
        localStorage.location,
        null,
        this.autoSetQty,
        5
      )
    );
    this.setState(
      { any: val },
      () => {
        this.setState({ any: "" }, () => {
          setTimeout(() => this[`any`].focus(), 500);
        });
      },
      1000
    );
  }

  getProps(param) {
    let state = {};
    if (param.auth.user) {
      let loc = param.auth.user.lokasi;
      if (isEmptyOrUndefined(loc)) {
        let location = handleDataSelect(loc, "kode", "nama");
        Object.assign(state, { locationData: location });
      }
    }
    if (isEmptyOrUndefined(param.customer)) {
      if (param.customer.length > 0) {
        let customer = handleDataSelect(param.customer, "kd_cust", "nama");
        Object.assign(state, { customerData: customer });
      }
    }
    if (param.barang && param.barang.length > 0) {
      this.getData();
    }
    this.setState(state);
  }

  handleUpdate(res, item) {
    update(table, {
      id: res.id,
      kd_brg: res.kd_brg,
      nm_brg: res.nm_brg,
      barcode: res.barcode,
      satuan: res.satuan,
      stock: res.stock,
      harga_beli: isEmptyOrUndefined(res.harga_beli)
        ? res.harga_beli
        : item.harga_beli,
      harga_jual: isEmptyOrUndefined(res.harga_jual)
        ? res.harga_jual
        : item.hrg_jual,
      qty: parseFloat(res.qty) + 1,
      tambahan: res.tambahan,
    });
  }
  handleRemove(e, id) {
    e.preventDefault();
    swallOption("Anda yakin akan mengahpus data ini ?", () => {
      del(table, id).then((res) => {
        this.getData();
        swal("data berhasil dihapus");
      });
    });
  }

  handleStoreProduct(e, item) {
    this.setState({ isScroll: false }, () => {
      const cek = cekData("kd_brg", item.kd_brg, table);
      cek.then((res) => {
        if (res === undefined) {
          store(table, item);
        } else {
          this.handleUpdate(res, item);
        }
        this.getData();
        this.handleSetFocus(item.barcode);
      });
    });
  }
  handleLoadMore() {
    this.setState({ isScroll: true }, () => {
      let { perpage, scrollPage } = this.state;
      let lengthBrg = Number(this.props.paginBrg.total, 10);
      if (perpage === lengthBrg || perpage < lengthBrg) {
        let searchby = this.handleCheckSearchBy();
        perpage = perpage + 5;
        scrollPage = scrollPage + 5;
        this.setState({ scrollPage, perpage }, () => {
          this.props.dispatch(
            FetchBrg(
              1,
              searchby,
              this.state.any,
              this.state.location,
              null,
              this.autoSetQty,
              perpage
            )
          );
        });
      } else {
        swal("Tidak ada data.");
      }
    });
  }
  handleScroll() {
    let divToScrollTo;
    divToScrollTo = document.getElementById(`item${this.state.scrollPage}`);
    if (divToScrollTo) {
      divToScrollTo.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "end",
      });
    }
  }
  getData() {
    const data = get(table);
    data.then((res) => {
      let cartData = [];
      res.map((i) => {
        cartData.push({
          qty: i.qty,
          satuan: i.satuan,
        });
        return null;
      });
      this.setState({
        databrg: res,
        brgval: cartData,
      });
    });
  }
  componentWillReceiveProps = (nextProps) => {
    this.getProps(nextProps);
  };
  componentDidMount() {
    this.getProps(this.props);
    let state = {};
    const location = localStorage.location;
    const customer = localStorage.customer;
    const createdAt = localStorage.createdAt;
    const note = localStorage.note;
    if (isEmptyOrUndefined(location)) {
      this.handleSelect({ value: location }, "location");
    }
    if (isEmptyOrUndefined(customer)) {
      this.handleSelect({ value: customer }, "customer");
    }
    if (isEmptyOrUndefined(createdAt)) {
      Object.assign(state, { createdAt });
    }
    if (isEmptyOrUndefined(note)) {
      Object.assign(state, { note });
    }

    this.setState(state);
  }
  autoSetQty(kode, data) {
    const cek = cekData("kd_brg", kode, table);
    return cek.then((res) => {
      if (res === undefined) {
        store(table, {
          kd_brg: data[0].kd_brg,
          nm_brg: data[0].nm_brg,
          barcode: data[0].barcode,
          satuan: data[0].satuan,
          stock: data[0].stock,
          harga_jual: data[0].hrg_jual,
          harga_beli: data[0].harga_beli,
          qty: 1,
          tambahan: data[0].tambahan,
        });
      } else {
        update(table, {
          id: res.id,
          kd_brg: res.kd_brg,
          nm_brg: res.nm_brg,
          barcode: res.barcode,
          satuan: res.satuan,
          stock: res.stock,
          harga_beli: isEmptyOrUndefined(res.harga_beli)
            ? res.harga_beli
            : data[0].harga_beli,
          harga_jual: isEmptyOrUndefined(res.harga_jual)
            ? res.harga_jual
            : data[0].hrg_jual,
          qty: parseFloat(res.qty) + 1,
          tambahan: res.tambahan,
        });
        // this.handleUpdate(res, data[0]);
      }
      return true;
    });
  }
  handleSubmit(e) {
    const data = get(table);
    data.then((res) => {
      if (res.length === 0) {
        handleError("barang");
        return;
      } else {
        swallOption("Pastikan data yang anda masukan sudah benar!", () => {
          console.log(res);
          let detail = [];
          let data = {};
          const { note, location, databrg, customer } = this.state;
          let qtySo = 0;
          let subtotal = 0;
          for (let i = 0; i < databrg.length; i++) {
            let item = res[i];
            let qty = rmComma(item.qty);
            qtySo = qtySo + qty;
            subtotal = subtotal + qty * rmComma(item.harga_jual);
            detail.push({
              kd_brg: item.barcode,
              qty_brg: qty,
            });
          }
          data["detail"] = detail;
          data["master"] = {
            catatan_so: note,
            qty_so: qtySo,
            subtotal_so: subtotal,
            kd_lokasi: location,
            kd_cust: customer,
          };
          this.props.dispatch(
            postSalesOrderAction(data, (isTrue) => {
              swalWithCallback("transaksi berhasil disimpan", () => {
                this.setState(
                  {
                    note: "-",
                    location: "",
                    databrg: [],
                    customer: "",
                  },
                  () => {
                    destroy(table);
                    this.getData();
                  }
                );
              });
            })
          );
          // this.props.dispatch(
          //   storeAdjusment(data, () => {
          // this.handleClear();
          // this.getData();
          //     this.props.dispatch(FetchCodeAdjustment(location.value));
          //   })
          // );
        });
      }
    });
  }
  handleReset(e) {
    e.preventDefault();
    swallOption("anda yakin akan membatalkan transaksi ini ?", () => {
      destroy(table);
      this.getData();
    });
  }

  render() {
    const {
      toggleSide,
      searchBy,
      locationData,
      location,
      searchByData,
      any,
      createdAt,
      note,
      customerData,
      customer,
      brgval,
      databrg,
      isScroll,
    } = this.state;
    if (isScroll) this.handleScroll();
    console.log("is scroll", isScroll);
    const head = [
      { rowSpan: 2, label: "No", width: "1%" },
      { rowSpan: 2, label: "Barang" },
      { rowSpan: 2, label: "Stok", width: "1%" },
      { colSpan: 2, label: "Harga", width: "1%" },
      { rowSpan: 2, label: "Qty", width: "1%" },
      { rowSpan: 2, label: "Subtotal", width: "1%" },
      { rowSpan: 2, label: "#", className: "text-center", width: "1%" },
    ];
    const rowSpan = [{ label: "Beli" }, { label: "Jual" }];
    let subtotal = 0;
    let totalQty = 0;
    return (
      <Layout page="Transaksi Sales Order">
        <div className="card">
          <div className="card-header d-flex justify-content-between">
            <h4>
              <button
                onClick={this.handleClickToggle}
                className={
                  this.state.toggleSide
                    ? "btn btn-danger mr-3"
                    : "btn btn-outline-dark text-dark mr-3"
                }
              >
                <i className={toggleSide ? "fa fa-remove" : "fa fa-bars"} />
              </button>{" "}
              Sales Order #{this.props.code}
            </h4>
            <h4
              className="text-right   d-flex justify-content-between"
              style={{ width: "50%" }}
            >
              <input
                type="date"
                name={"createdAt"}
                className={"form-control nbt nbr nbl bt"}
                value={createdAt}
                onChange={this.handleChange}
              />
              <input
                placeholder="Tambahkan catatan disini ...."
                type="text"
                style={{ height: "39px" }}
                className="form-control nbt nbr nbl bt"
                value={note}
                onChange={this.handleChange}
                name="note"
              />
            </h4>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <StickyBox
              offsetTop={100}
              offsetBottom={20}
              style={
                toggleSide
                  ? { display: "none", width: "25%", marginRight: "10px" }
                  : { display: "block", width: "25%", marginRight: "10px" }
              }
            >
              <div className="card">
                <div className="card-body">
                  <div className="form-group">
                    <label className="control-label font-12">
                      Cari Berdasarkan{" "}
                      {Number(searchBy) === 1
                        ? "Kode Barang"
                        : Number(searchBy) === 2
                        ? "Barcode"
                        : "Deskripsi"}
                    </label>
                    <Select
                      options={searchByData}
                      placeholder="Perncarian berdasarkan"
                      onChange={(e) => this.handleSelect(e, "searchBy")}
                      value={searchByData.find((op) => {
                        return op.value === searchBy;
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <div className="input-group input-group-sm">
                      <input
                        ref={(input) => (this[`any`] = input)}
                        autoFocus
                        type="text"
                        name="any"
                        className="form-control form-control-sm"
                        value={any}
                        onChange={(e) => this.handleChange(e)}
                        onKeyPress={(event) => {
                          if (event.key === "Enter") {
                            this.handleSearch(event);
                          }
                        }}
                      />
                      <span className="input-group-append">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={this.handleSearch}
                        >
                          <i className="fa fa-search" />
                        </button>
                      </span>
                    </div>
                  </div>
                  <div
                    className="people-list"
                    style={{
                      zoom: "90%",
                      height: "300px",
                      maxHeight: "100%",
                      overflowY: "scroll",
                    }}
                  >
                    {!this.props.loadingbrg ? (
                      <div id="chat_user_2" style={{ padding: 0 }}>
                        <ul
                          className="chat-list list-unstyled"
                          style={{ padding: 0 }}
                        >
                          {this.props.barang &&
                          this.props.barang.length !== 0 ? (
                            this.props.barang.map((i, inx) => {
                              return (
                                <li
                                  style={{
                                    paddingLeft: 0,
                                    backgroundColor:
                                      this.state.scrollPage === inx
                                        ? "#eeeeee"
                                        : "",
                                  }}
                                  id={`item${inx}`}
                                  className="clearfix"
                                  key={inx}
                                  onClick={(e) => {
                                    this.handleStoreProduct(e, {
                                      kd_brg: i.kd_brg,
                                      nm_brg: i.nm_brg,
                                      barcode: i.barcode,
                                      satuan: i.satuan,
                                      stock: i.stock,
                                      harga_beli: i.harga_beli,
                                      harga_jual: i.hrg_jual,
                                      qty: 1,
                                      tambahan: i.tambahan,
                                    });
                                  }}
                                >
                                  <div
                                    className="about"
                                    style={{ paddingLeft: 0 }}
                                  >
                                    <div
                                      className="status"
                                      style={{
                                        color: "black",
                                        fontWeight: "bold",
                                        wordBreak: "break-all",
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
                                      }}
                                    >
                                      ({i.kd_brg}) {i.supplier} - {i.ukuran}
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
                          )}
                        </ul>
                      </div>
                    ) : (
                      <Spinner />
                    )}
                  </div>
                  <div className="form-group">
                    <button
                      className={"btn btn-primary"}
                      style={{ width: "100%" }}
                      onClick={this.handleLoadMore}
                    >
                      {this.props.loadingbrg
                        ? "tunggu sebentar ..."
                        : "tampilkan lebih banyak"}
                    </button>
                  </div>
                </div>
              </div>
            </StickyBox>
            <div style={toggleSide ? { width: "100%" } : { width: "75%" }}>
              <div className="card">
                <div className="card-body">
                  <form className="">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="control-label font-12">
                            Lokasi
                          </label>
                          <Select
                            options={locationData}
                            placeholder="Pilih Lokasi"
                            onChange={(e) => this.handleSelect(e, "location")}
                            value={locationData.find((op) => {
                              return op.value === location;
                            })}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label className="control-label font-12">
                            Customer
                          </label>
                          <Select
                            options={customerData}
                            placeholder="Pilih Customer"
                            onChange={(e) => this.handleSelect(e, "customer")}
                            value={customerData.find((op) => {
                              return op.value === customer;
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                  <div style={{ zoom: "90%" }}>
                    <TableCommon
                      head={head}
                      rowSpan={rowSpan}
                      renderRow={databrg.map((item, index) => {
                        const sub = Number(item.harga_jual) * Number(item.qty);
                        subtotal = subtotal + sub;
                        totalQty = totalQty + Number(item.qty);
                        return (
                          <tr key={index}>
                            <td className="middle nowrap text-center">
                              {index + 1}
                            </td>
                            <td className="middle nowrap">
                              <span className="bold">{item.nm_brg}</span> <br />
                              {item.barcode}
                            </td>
                            <td className="middle nowrap">{item.stock}</td>
                            <td className="middle nowrap text-right">
                              {toRp(item.harga_beli)}
                            </td>
                            <td className="middle nowrap text-right">
                              {toRp(item.harga_jual)}
                            </td>
                            <td className="middle nowrap">
                              <input
                                style={{ width: "100px", textAlign: "right" }}
                                type="text"
                                name="qty"
                                className="form-control in-table"
                                onBlur={(e) => this.handleBlur(e, item.barcode)}
                                onChange={(e) => this.handleChange(e, index)}
                                onFocus={(e) => this.handleFocus(e, index)}
                                ref={(input) =>
                                  (this[`qty-${btoa(item.barcode)}`] = input)
                                }
                                value={brgval[index].qty}
                              />
                            </td>
                            <td className="middle nowrap text-right">
                              {toRp(sub)}
                            </td>
                            <td className="middle nowrap">
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={(e) => this.handleRemove(e, item.id)}
                              >
                                <i className="fa fa-trash" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      footer={[
                        {
                          data: [
                            {
                              colSpan: 5,
                              label: "Total",
                              className: "text-left",
                            },
                            {
                              colSpan: 1,
                              label: (
                                <input
                                  className="form-control in-table text-right"
                                  value={parseToRp(totalQty)}
                                  disabled
                                />
                              ),
                            },
                            { colSpan: 1, label: toRp(subtotal) },
                            { colSpan: 1, label: "" },
                          ],
                        },
                      ]}
                    />
                    <hr />
                    <div className="row">
                      <div className="col-md-12">
                        <ButtonTrxCommon
                          disabled={databrg.length < 1}
                          callback={(e, res) => {
                            if (res === "simpan") this.handleSubmit(e);
                            if (res === "batal") this.handleReset(e);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStateToPropsCreateItem = (state) => {
  return {
    barang: state.productReducer.result_brg,
    loadingbrg: state.productReducer.isLoadingBrg,
    code: state.salesOrderReducer.code,
    customer: state.customerReducer.all,
    paginBrg: state.productReducer.pagin_brg,
    auth: state.auth,
  };
};

export default connect(mapStateToPropsCreateItem)(CreateSO);
