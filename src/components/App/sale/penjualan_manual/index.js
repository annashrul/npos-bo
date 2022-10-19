import React, { Component } from "react";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import TableCommon from "../../common/TableCommon";
import {
  handleError,
  isEmptyOrUndefined,
  rmComma,
  setFocus,
  ToastQ,
  toRp,
} from "../../../../helper";
import ButtonTrxCommon from "../../common/ButtonTrxCommon";
import { key } from "localforage";
class PenjualanManual extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          no: Math.random(10000),
          sku: "",
          nama: "",
          motif: "",
          qty: "",
          harga: "",
        },
      ],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleChange(e, i) {
    const col = e.target.name;
    let val = e.target.value;
    let data = this.state.data;
    if (col === "harga") {
      val = rmComma(val);
    }
    data[i][col] = val;
    this.setState({ data });
  }

  handleAction(e, i, param = "+") {
    let data = this.state.data;
    if (param === "+") {
      data.push({
        no: Math.random(10000),
        sku: "",
        nama: "",
        motif: "",
        qty: "",
        harga: "",
      });
    } else {
      const newData = data.filter((res, key) => res.no !== data[i].no);
      data = newData;
    }
    this.setState({ data });
  }

  handleSubmit(e) {
    e.preventDefault();
    let data = this.state.data;

    for (let i = 0; i < data.length; i++) {
      const keys = Object.keys(data[i]);
      for (let x = 0; x < keys.length; x++) {
        if (data[i][keys[x]] === "") {
          handleError(keys[x]);
          setTimeout(() => this[`${keys[x]}-${btoa(data[i].no)}`].focus(), 500);
          return;
        }
      }
    }

    console.log(this.state.data);
  }
  handleReset(e) {}
  render() {
    const head = [
      { label: "No", width: "1%" },
      { label: "SKU", width: "1%" },
      { label: "Nama" },
      { label: "Motif", width: "1%" },
      { label: "Qty", width: "1%" },
      { label: "Harga", width: "1%" },
      { label: "Jumlah", width: "1%" },
      { label: "#", className: "text-center", width: "1%" },
    ];
    let totalJumlah = 0;
    let totalQty = 0;
    return (
      <Layout page="Transaksi Manual">
        <div className="card">
          <div
            className="card-header"
            style={{ justifyContent: "space-between", display: "flex" }}
          >
            <h4>Transaksi Manual</h4>
            <div className="row">
              <div className="col-md-6">
                <input className="form-control" type="date" />
              </div>
              <div className="col-md-6">
                <input className="form-control" type="date" />
              </div>
            </div>
          </div>
          <div className="card-body">
            <TableCommon
              head={head}
              renderRow={this.state.data.map((res, i) => {
                console.log(this.state.data.length);
                totalJumlah = totalJumlah + Number(res.qty) * Number(res.harga);
                totalQty = totalQty + Number(res.qty);
                return (
                  <tr key={i}>
                    <td className="middle nowrap text-center">{i + 1}</td>
                    <td className="middle nowrap">
                      <input
                        style={{ width: "250px" }}
                        type="text"
                        name="sku"
                        className="form-control in-table"
                        onChange={(e) => this.handleChange(e, i)}
                        value={res.sku}
                        ref={(input) => (this[`sku-${btoa(res.no)}`] = input)}
                      />
                    </td>
                    <td className="middle nowrap">
                      <input
                        // style={{ width: "100px" }}
                        type="text"
                        name="nama"
                        className="form-control in-table"
                        onChange={(e) => this.handleChange(e, i)}
                        value={res.nama}
                        ref={(input) => (this[`nama-${btoa(res.no)}`] = input)}
                      />
                    </td>
                    <td className="middle nowrap">
                      <input
                        style={{ width: "100px" }}
                        type="text"
                        name="motif"
                        className="form-control in-table"
                        onChange={(e) => this.handleChange(e, i)}
                        value={res.motif}
                        ref={(input) => (this[`motif-${btoa(res.no)}`] = input)}
                      />
                    </td>
                    <td className="middle nowrap">
                      <input
                        style={{ width: "100px", textAlign: "right" }}
                        type="text"
                        name="qty"
                        className="form-control in-table"
                        onChange={(e) => this.handleChange(e, i)}
                        value={res.qty}
                        ref={(input) => (this[`qty-${btoa(res.no)}`] = input)}
                      />
                    </td>
                    <td className="middle nowrap">
                      <input
                        style={{ width: "250px", textAlign: "right" }}
                        type="text"
                        name="harga"
                        className="form-control in-table"
                        onChange={(e) => this.handleChange(e, i)}
                        value={toRp(res.harga)}
                        ref={(input) => (this[`harga-${btoa(res.no)}`] = input)}
                      />
                    </td>
                    <td className="middle nowrap">
                      <input
                        disabled
                        style={{ width: "200px", textAlign: "right" }}
                        type="text"
                        name="jumlah"
                        className="form-control in-table"
                        value={toRp(Number(res.qty) * Number(res.harga))}
                      />
                    </td>
                    <td className="middle nowrap">
                      <button
                        disabled={this.state.data.length === 1}
                        className="btn btn-danger btn-md"
                        onClick={(e) => {
                          if (this.state.data.length > 1) {
                            this.handleAction(e, i, "-");
                          }
                        }}
                      >
                        <i className="fa fa-close" />
                      </button>
                      &nbsp;
                      {this.state.data.length - 1 === i && (
                        <button
                          className="btn btn-primary btn-md"
                          onClick={(e) => this.handleAction(e, i, "+")}
                        >
                          <i className="fa fa-plus" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              footer={[
                {
                  data: [
                    {
                      colSpan: 3,
                      label: "Total",
                      className: "text-left",
                    },
                    { colSpan: 1, label: "" },
                    {
                      colSpan: 1,
                      label: (
                        <input
                          style={{ textAlign: "right" }}
                          disabled
                          className="form-control"
                          value={toRp(totalQty)}
                        />
                      ),
                    },
                    { colSpan: 1, label: "" },
                    {
                      colSpan: 1,
                      label: (
                        <input
                          style={{ textAlign: "right" }}
                          disabled
                          className="form-control"
                          value={toRp(totalJumlah)}
                        />
                      ),
                    },
                    { colSpan: 1, label: "" },
                  ],
                },
              ]}
            />
            <hr />
            <div className="row">
              <div
                className="col-md-12"
                style={{ float: "right", textAlign: "right" }}
              >
                <ButtonTrxCommon
                  disabled={this.state.data.length < 1}
                  callback={(e, res) => {
                    if (res === "simpan") this.handleSubmit(e);
                    if (res === "batal") this.handleReset(e);
                  }}
                />
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
export default connect(mapStateToPropsCreateItem)(PenjualanManual);
