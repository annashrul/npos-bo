import React, { Component } from "react";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import TableCommon from "../../common/TableCommon";
import {
  getStorage,
  handleError,
  isEmptyOrUndefined,
  rmComma,
  rmStorage,
  setStorage,
  swallOption,
  toRp,
} from "../../../../helper";
import ButtonTrxCommon from "../../common/ButtonTrxCommon";
import moment from "moment";
import { ModalToggle, ModalType } from "../../../../redux/actions/modal.action";
import ConfirmPenjualanManual from "./confirm_penjualan_manual";
import { getManualSaleDetailReportAction } from "../../../../redux/actions/sale/sale_manual.action";
import { withRouter } from "react-router-dom";
import { linkTransaksiManual } from "../../../../helperLink";

class PenjualanManual extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createdAt: moment(new Date()).format("YYYY-MM-DD"),
      catatan: "-",
      nama_penerima: "",
      no_telepon_penerima: "",
      alamat_penerima: "",
      nama_pengirim: "",
      no_telepon_pengirim: "",
      alamat_pengirim: "",
      total: 0,
      isDownload: false,
      isConfirm: false,
      data: [
        {
          sku: "",
          nama: "",
          motif: "",
          qty: "",
          harga: "",
          no: Math.random(10000000),
        },
      ],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.clearState = this.clearState.bind(this);
  }

  getProps(props) {
    if (isEmptyOrUndefined(props.match.params.slug)) {
      props.dispatch(
        getManualSaleDetailReportAction(
          `kd_trx=${atob(props.match.params.slug)}&perpage=999`,
          false,
          (res) => {
            setStorage("isEditTrxManual", true);
            var retrievedObject = localStorage.getItem("masterTrxManual");
            retrievedObject = JSON.parse(retrievedObject);
            const arrPenerima = retrievedObject.penerima.split("|");
            const arrPengirim = retrievedObject.pengirim.split("|");
            console.log(retrievedObject);
            const newData = [];
            res.result.data.map((row, key) => {
              newData.push({
                sku: row.sku,
                nama: row.nama,
                motif: row.motif,
                qty: row.qty,
                harga: row.harga,
                no: Math.random(10000000),
              });
            });

            this.setState({
              data: newData,
              catatan: retrievedObject.catatan,
              nama_penerima: arrPenerima[0],
              no_telepon_penerima: arrPenerima[1],
              alamat_penerima: arrPenerima[2],
              nama_pengirim: arrPengirim[0],
              no_telepon_pengirim: arrPengirim[1],
              alamat_pengirim: arrPengirim[2],
            });
          }
        )
      );
    } else {
      rmStorage("isEditTrxManual");
    }
  }

  componentDidMount() {
    this.getProps(this.props);
  }

  componentWillMount() {
    this.getProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    // this.getProps(nextProps);
    // console.log("nextProps", nextProps);
  }

  handleChange(e, i) {
    const col = e.target.name;
    let val = e.target.value;
    if (i !== null) {
      let data = this.state.data;
      if (col === "harga") {
        val = rmComma(val);
      }
      data[i][col] = val;
      this.setState({ data });
    } else {
      this.setState({ [col]: val });
    }
  }

  handleAction(e, i, param = "+") {
    let data = this.state.data;
    if (param === "+") {
      data.push({
        sku: "",
        nama: "",
        motif: "",
        qty: "",
        harga: "",
        no: Math.random(10000000),
      });
    } else {
      const newData = data.filter((res, key) => res.no !== data[i].no);
      data = newData;
    }
    this.setState({ data });
  }

  handleSubmit(e) {
    e.preventDefault();
    const masterState = [
      "createdAt",
      "catatan",
      "nama_penerima",
      "no_telepon_penerima",
      "alamat_penerima",
      "nama_pengirim",
      "no_telepon_pengirim",
      "alamat_pengirim",
    ];
    const data = this.state.data;
    let total = this.state.total;
    let parsedata = {};
    parsedata["master"] = {};
    parsedata["detail"] = [];

    for (let i = 0; i < masterState.length; i++) {
      const col = masterState[i];
      const val = this.state[col];
      if (!isEmptyOrUndefined(val)) {
        handleError(col.replaceAll("_", " "));
        setTimeout(() => this[col].focus(), 500);
        return;
      }
      Object.assign(parsedata["master"], { [col]: val });
    }

    for (let i = 0; i < data.length; i++) {
      total = total + Number(data[i].qty) * Number(data[i].harga);
      const keys = Object.keys(data[i]);
      for (let x = 0; x < keys.length; x++) {
        if (!isEmptyOrUndefined(data[i][keys[x]])) {
          handleError(keys[x]);
          setTimeout(() => this[`${keys[x]}-${btoa(data[i].no)}`].focus(), 500);
          return;
        }
      }
      delete data[i].no;
    }
    Object.assign(parsedata["master"], { total });
    parsedata["detail"] = data;
    swallOption(
      "Anda yakin akan melanjutkan transaksi ini ?",
      () => {
        this.setState({ isConfirm: true, total }, () => {
          this.props.dispatch(ModalToggle(true));
          this.props.dispatch(ModalType("confirmPenjualanManual"));
        });
      },
      () => {
        console.log("cancel");
      }
    );
  }
  handleReset(e) {}

  clearState() {
    this.setState({
      createdAt: moment(new Date()).format("YYYY-MM-DD"),
      catatan: "-",
      nama_penerima: "",
      no_telepon_penerima: "",
      alamat_penerima: "",
      nama_pengirim: "",
      no_telepon_pengirim: "",
      alamat_pengirim: "",
      total: 0,
      data: [
        {
          sku: "",
          nama: "",
          motif: "",
          qty: "",
          harga: "",
          no: Math.random(10000000),
        },
      ],
    });
  }
  render() {
    const {
      isConfirm,
      createdAt,
      catatan,
      data,
      nama_penerima,
      no_telepon_penerima,
      alamat_penerima,
      nama_pengirim,
      no_telepon_pengirim,
      alamat_pengirim,
      total,
    } = this.state;
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

    console.log("##################", data);

    return (
      <Layout page="Transaksi Manual">
        <div className="card">
          <div className="card-header d-flex justify-content-between">
            <h4>Transaksi Manual</h4>

            <div
              className="d-flex justify-content-between"
              style={{ width: "50%" }}
            >
              <input
                type="date"
                name={"createdAt"}
                className={"form-control nbt nbr nbl bt"}
                value={createdAt}
                onChange={(e) => this.handleChange(e, null)}
                ref={(input) => (this[`createdAt`] = input)}
              />
              <input
                placeholder="Tambahkan catatan disini ...."
                type="text"
                style={{ height: "39px" }}
                className="form-control nbt nbr nbl bt"
                value={catatan}
                onChange={(e) => this.handleChange(e, null)}
                name="catatan"
                ref={(input) => (this[`catatan`] = input)}
              />
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-12 d-flex justify-content-between">
                <div className="form-group">
                  <label className="bold">Penerima</label>
                  <div className="d-flex">
                    <input
                      placeholder="nama"
                      type="text"
                      className="form-control"
                      value={nama_penerima}
                      onChange={(e) => this.handleChange(e, null)}
                      name="nama_penerima"
                      style={{
                        borderRight: "0px",
                        borderTopRightRadius: "0px",
                        borderBottomRightRadius: "0px",
                      }}
                      ref={(input) => (this[`nama_penerima`] = input)}
                    />
                    <input
                      placeholder="no telepon"
                      type="text"
                      className="form-control"
                      value={no_telepon_penerima}
                      onChange={(e) => this.handleChange(e, null)}
                      name="no_telepon_penerima"
                      style={{
                        borderRight: "0px",
                        borderTopRightRadius: "0px",
                        borderBottomRightRadius: "0px",
                        borderLeft: "0px",
                        borderTopLeftRadius: "0px",
                        borderBottomLeftRadius: "0px",
                      }}
                      ref={(input) => (this[`no_telepon_penerima`] = input)}
                    />
                    <textarea
                      placeholder="alamat"
                      type="text"
                      className="form-control"
                      value={alamat_penerima}
                      onChange={(e) => this.handleChange(e, null)}
                      name="alamat_penerima"
                      style={{
                        borderLeft: "0px",
                        borderTopLeftRadius: "0px",
                        borderBottomLeftRadius: "0px",
                      }}
                      ref={(input) => (this[`alamat_penerima`] = input)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="bold">Pengirim</label>
                  <div className="d-flex">
                    <input
                      placeholder="nama"
                      type="text"
                      className="form-control"
                      value={nama_pengirim}
                      onChange={(e) => this.handleChange(e, null)}
                      name="nama_pengirim"
                      style={{
                        borderRight: "0px",
                        borderTopRightRadius: "0px",
                        borderBottomRightRadius: "0px",
                      }}
                      ref={(input) => (this[`nama_pengirim`] = input)}
                    />
                    <input
                      placeholder="no telepon"
                      type="text"
                      className="form-control"
                      value={no_telepon_pengirim}
                      onChange={(e) => this.handleChange(e, null)}
                      name="no_telepon_pengirim"
                      style={{
                        borderRight: "0px",
                        borderTopRightRadius: "0px",
                        borderBottomRightRadius: "0px",
                        borderLeft: "0px",
                        borderTopLeftRadius: "0px",
                        borderBottomLeftRadius: "0px",
                      }}
                      ref={(input) => (this[`no_telepon_pengirim`] = input)}
                    />
                    <textarea
                      placeholder="alamat"
                      type="text"
                      className="form-control"
                      value={alamat_pengirim}
                      onChange={(e) => this.handleChange(e, null)}
                      name="alamat_pengirim"
                      style={{
                        borderLeft: "0px",
                        borderTopLeftRadius: "0px",
                        borderBottomLeftRadius: "0px",
                      }}
                      ref={(input) => (this[`alamat_pengirim`] = input)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <TableCommon
              head={head}
              renderRow={data.map((res, i) => {
                console.log(data.length);
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
        {isConfirm && this.props.isOpen ? (
          <ConfirmPenjualanManual
            master={{
              createdAt,
              catatan,
              nama_penerima,
              alamat_penerima,
              no_telepon_penerima,
              nama_pengirim,
              alamat_pengirim,
              no_telepon_pengirim,
              total,
            }}
            detail={data}
            callback={() => {
              this.clearState();
              if (isEmptyOrUndefined(this.props.match.params.slug)) {
                this.props.history.push(`${linkTransaksiManual}`);
                rmStorage("isEditTrxManual");
              }
            }}
          />
        ) : null}
      </Layout>
    );
  }
}
const mapStateToPropsCreateItem = (state) => {
  return {
    isOpen: state.modalReducer,
    loadingCreate: state.saleManualReducer.loadingCreate,
    auth: state.auth,
  };
};
export default withRouter(connect(mapStateToPropsCreateItem)(PenjualanManual));
// export default connect(mapStateToPropsCreateItem)(PenjualanManual);
