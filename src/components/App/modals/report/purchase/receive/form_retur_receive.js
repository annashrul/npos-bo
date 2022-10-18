import React, { Component } from "react";
import { ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import { ModalToggle } from "redux/actions/modal.action";
import { toRp } from "helper";
import HeaderDetailCommon from "../../../../common/HeaderDetailCommon";
import {
  float,
  handleError,
  noData,
  setFocus,
  toDate,
} from "../../../../../../helper";
import TableCommon from "../../../../common/TableCommon";
import KeyHandler, { KEYDOWN } from "react-key-handler";
import { storeReturTanpaNota } from "../../../../../../redux/actions/purchase/retur_tanpa_nota/return_tanpa_nota.action";

class FormReturReceive extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.HandleChangeInputValue = this.HandleChangeInputValue.bind(this);
    this.HandleFocusInputReset = this.HandleFocusInputReset.bind(this);
    this.HandleOnBlurInput = this.HandleOnBlurInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      data_retur: [],
      kondisi_data: [
        { value: "bad_stock", label: "Bad stock" },
        { value: "good_stock", label: "Good stock" },
        { value: "dead_stock", label: "Dead stock" },
        { value: "over_stock", label: "Over stock" },
        { value: "expired_date", label: "Expired date" },
        { value: "slow_moving", label: "Slow moving" },
      ],
      kondisi: "bad_stock",
      lokasi: "",
      no_faktur_beli: "",
      disabelButton: false,
      userid: 0,
      qtyFocus: 0,
    };
  }
  handleFocusShortCut(e) {
    e.preventDefault();
    let key = this.state.qtyFocus; // 0
    key++;
    if (key === this.state.data_retur.length + 1) {
      key = 1;
    }
    setFocus(this, `qty-${key}`);
    this.setState({ qtyFocus: key });
  }
  getProps(props) {
    if (props.dataRetur !== undefined && props.dataRetur !== []) {
      let dataRetur = [];
      if (typeof props.dataRetur.detail === "object") {
        props.dataRetur.detail.map((v, i) => {
          dataRetur.push({
            barcode: v.barcode,
            disc2: v.disc2,
            disc3: v.disc3,
            disc4: v.disc4,
            diskon: v.diskon,
            harga: v.harga,
            harga_beli: v.harga_beli,
            jumlah_beli: v.jumlah_beli,
            jumlah_bonus: v.jumlah_bonus,
            jumlah_po: v.jumlah_po,
            jumlah_retur: v.jumlah_retur,
            kode_barang: v.kode_barang,
            nm_brg: v.nm_brg,
            no_faktur_beli: v.no_faktur_beli,
            ppn: v.ppn,
            qty: v.qty,
            satuan: v.satuan,
            stock: v.stock,
            qty_retur: 0,
            kondisi: "bad_stock",
          });
          return null;
        });
        this.setState({
          data_retur: dataRetur,
          userid: props.auth.user.id,
          lokasi: props.dataRetur.master.lokasi,
          no_faktur_beli: props.dataRetur.master.no_faktur_beli,
        });
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    this.getProps(nextProps);
  }
  componentDidMount() {
    this.getProps(this.props);
  }
  componentWillMount() {
    this.getProps(this.props);
  }

  toggle(e) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
  }

  HandleData(i, col, val) {
    let data_retur = [...this.state.data_retur];
    data_retur[i] = { ...data_retur[i], [col]: val };
    this.setState({ data_retur });
  }

  HandleChangeInputValue(e, i) {
    const column = e.target.name;
    const val = e.target.value;
    this.HandleData(i, column, val);
  }
  HandleFocusInputReset(e, i) {
    let col = e.target.name;
    let val = parseInt(e.target.value);
    if (val === 0) {
      this.HandleData(i, col, "");
    }
  }
  HandleOnBlurInput(e, i) {
    let col = e.target.name;
    let val = parseInt(e.target.value);
    if (val === 0 || isNaN(val)) {
      this.HandleData(i, col, 1);
    }
  }
  handleSubmit(e) {
    e.preventDefault();
    let props = this.props.dataRetur.master;
    let data = {};
    let detail = [];
    let detailOther = [];
    let masterOther = props;
    let subtotal = 0;
    console.log(this.state.data_retur);
    for (let i = 0; i < this.state.data_retur.length; i++) {
      let v = this.state.data_retur[i];
      let qty = float(v.qty_retur);
      subtotal += qty * parseInt(v.harga_beli, 10);
      detailOther.push({
        disc2: v.disc2,
        disc3: v.disc3,
        disc4: v.disc4,
        diskon: v.diskon,
        harga: v.harga,
        jumlah_beli: v.jumlah_beli,
        jumlah_bonus: v.jumlah_bonus,
        jumlah_po: v.jumlah_po,
        jumlah_retur: v.jumlah_retur,
        nm_brg: v.nm_brg,
        no_faktur_beli: v.no_faktur_beli,
        ppn: v.ppn,
        stock: v.stock,
        kd_brg: v.kode_barang,
        barcode: v.barcode,
        satuan: v.satuan,
        qty: v.qty_retur,
        harga_beli: v.harga_beli,
        keterangan: "-",
        kondisi: v.kondisi,
      });
      detail.push({
        kd_brg: v.kode_barang,
        barcode: v.barcode,
        satuan: v.satuan,
        qty: v.qty_retur,
        harga_beli: v.harga_beli,
        keterangan: "-",
        kondisi: v.kondisi,
      });
      if (isNaN(qty)) {
        handleError("", `Qty retur ${v.nm_brg} tidak boleh kosong`);
        setFocus(this, `qty-${i + 1}`);
        return;
      }
      if (qty > parseInt(v.stock, 10)) {
        handleError("", "Qty retur melebihi stock");
        setFocus(this, `qty-${i + 1}`);
        return;
      }
      if (qty > parseInt(v.qty, 10)) {
        handleError("", "Qty retur melebihi qty pembelian");
        setFocus(this, `qty-${i + 1}`);
        return;
      }
      continue;
    }
    // data["tanggal"] = toDate(new Date(), "-");
    // data["supplier"] = props.supplier;
    // data["keterangan"] = "-";
    // data["subtotal"] = subtotal;
    // data["lokasi"] = props.lokasi_nama;
    // data["userid"] = props.operator_nama;
    // data["nobeli"] = props.no_faktur_beli;
    // data["detail"] = detail;
    data["tanggal"] = toDate(new Date(), "-");
    data["supplier"] = props.kode_supplier;
    data["keterangan"] = "-";
    data["subtotal"] = subtotal;
    data["lokasi"] = props.lokasi;
    data["userid"] = this.state.userid;
    data["nobeli"] = props.no_faktur_beli;
    data["detail"] = detail;

    let parsedata = {};
    parsedata["detail"] = data;
    parsedata["master"] = this.state.data_retur;
    parsedata["nota"] = "";
    this.props.dispatch(
      storeReturTanpaNota(
        parsedata,
        { master: masterOther, detail: detailOther },
        (arr) => {
          this.props.history.push(arr);
        },
        true
      )
    );
  }
  render() {
    let master = this.props.dataRetur.master;
    const head = [
      { rowSpan: 2, label: "No", width: "1%" },
      { rowSpan: 2, label: "Barang", width: "1%" },
      { rowSpan: 2, label: "Harga beli", width: "1%" },
      { rowSpan: 2, label: "Stok", width: "1%" },
      { rowSpan: 2, label: "Qty beli", width: "1%" },
      { rowSpan: 2, label: "Kondisi", width: "1%" },
      { rowSpan: 2, label: "Qty retur" },
      { rowSpan: 2, label: "Nilai retur" },
    ];
    let totalQty = 0;
    let totalRetur = 0;

    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === "formReturReceive"}
        size="lg"
      >
        <ModalHeader toggle={this.toggle}>{"Retur pembelian"}</ModalHeader>
        <ModalBody>
          <KeyHandler
            keyEventName={[`${KEYDOWN}`]}
            keyValue={["ArrowDown", "ArrowUp", "Tab", "Escape", "Enter"]}
            onKeyHandle={(e) => {
              if (e.key === "Escape") {
                this.toggle(e);
                return;
              }
              if (e.key === "Enter") {
                this.handleSubmit(e);
                return;
              }
              this.handleFocusShortCut(e);
            }}
          />

          <HeaderDetailCommon
            data={[
              { title: "No faktur beli", desc: master.no_faktur_beli },
              { title: "Penerima", desc: master.nama_penerima },
              { title: "Lokasi", desc: master.lokasi },
              { title: "Tipe", desc: master.type },
              { title: "Pelunasan", desc: master.pelunasan },
              { title: "Tanggal", desc: toDate(master.tgl_beli) },
            ]}
          />
          <TableCommon
            head={head}
            renderRow={
              this.state.data_retur.length > 0
                ? this.state.data_retur.map((v, i) => {
                    totalQty += float(v.qty_retur);
                    totalRetur += float(v.qty_retur) * float(v.harga_beli);
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">{i + 1}</td>

                        <td className="middle nowrap">
                          {v.nm_brg}
                          <br />{" "}
                          <small style={{ fontWeight: "bold" }}>
                            {v.kode_barang}
                          </small>
                        </td>
                        <td className="middle nowrap text-right">
                          {toRp(parseInt(v.harga_beli, 10))}
                        </td>
                        <td className="middle nowrap text-right">{v.stock}</td>
                        <td className="middle nowrap text-right">{v.qty}</td>
                        <td className="middle nowrap">
                          <select
                            className="form-control in-table"
                            style={{ width: "140px" }}
                            name="kondisi"
                            onChange={(e) => this.HandleChangeInputValue(e, i)}
                            value={v.kondisi}
                          >
                            {this.state.kondisi_data.map((val, key) => {
                              return (
                                <option key={key} value={val.value}>
                                  {val.label}
                                </option>
                              );
                            })}
                          </select>
                        </td>
                        <td className="middle nowrap">
                          <input
                            ref={(input) => (this[`qty-${i + 1}`] = input)}
                            type="text"
                            name="qty_retur"
                            className="form-control in-table text-right"
                            value={v.qty_retur}
                            onChange={(e) => this.HandleChangeInputValue(e, i)}
                            onFocus={(e) => this.HandleFocusInputReset(e, i)}
                            onBlur={(e) => this.HandleOnBlurInput(e, i)}
                          />
                        </td>
                        <td className="middle nowrap">
                          <input
                            disabled={true}
                            type="text"
                            className="form-control in-table text-right"
                            value={toRp(
                              parseFloat(v.qty_retur) * parseFloat(v.harga_beli)
                            )}
                          />
                        </td>
                      </tr>
                    );
                  })
                : noData(head.length)
            }
            footer={[
              {
                data: [
                  { colSpan: 6, label: "Total", className: "text-left" },
                  {
                    colSpan: 1,
                    label: (
                      <input
                        disabled={true}
                        className="form-control in-table text-right"
                        value={toRp(totalQty)}
                      />
                    ),
                  },
                  {
                    colSpan: 1,
                    label: (
                      <input
                        disabled={true}
                        className="form-control in-table text-right"
                        value={toRp(totalRetur)}
                      />
                    ),
                  },
                ],
              },
            ]}
          />
        </ModalBody>
        <ModalFooter>
          <button
            className="btn btn-primary"
            onClick={(e) => this.handleSubmit(e)}
          >
            Simpan
          </button>
        </ModalFooter>
      </WrapperModal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    auth: state.auth,
  };
};
// const mapDispatch
export default connect(mapStateToProps)(FormReturReceive);
