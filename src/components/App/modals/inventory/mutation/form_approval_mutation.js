import React, { Component } from "react";
import { ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import WrapperModal from "../../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import { ModalToggle } from "redux/actions/modal.action";
import {
    FetchApprovalMutation,
    // FetchApprovalMutation,
    saveApprovalMutation,
} from "../../../../../redux/actions/inventory/mutation.action";
import Swal from "sweetalert2";
import { withRouter } from "react-router-dom";
import Spinner from "Spinner";
import TableCommon from "../../../common/TableCommon";
import { handleError, parseToRp } from "../../../../../helper";

class FormApprovalMutation extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.state = {
            dataApproval: [],
            q: "",
            checked_all: false,
            allCheck: false,
            error: {},
        };
    }
    componentWillReceiveProps(nextProps) {
        let data = [];
        let isAppove = [];
        if (typeof nextProps.dataApproval.data === "object") {
            nextProps.dataApproval.data.map((v, i) => {
                data.push({
                    checked: false,
                    kd_brg: v.kd_brg,
                    barcode: v.barcode,
                    nm_brg: v.nm_brg,
                    satuan: v.satuan,
                    hrg_beli: v.hrg_beli,
                    hrg_jual: v.hrg_jual,
                    total_qty: v.total_qty,
                    total_approval: v.total_approval,
                    sisa_approval: v.total_qty,
                    isReadonly: parseInt(v.total_qty, 10) === parseInt(v.total_approval, 10) ? true : false,
                });
                if (parseInt(v.total_qty, 10) === parseInt(v.total_approval, 10)) {
                    isAppove.push({ count: i });
                }
                return null;
            });
        }
        if (isAppove.length !== 0) {
            if (isAppove.length === nextProps.dataApproval.data.length) {
                this.setState({ allCheck: true });
            }
        }
        this.setState({ dataApproval: data });
    }
    handleChange(event, i) {
        // event.preventDefault()
        this.setState({ [event.target.name]: event.target.value });
        let dataApproval = [...this.state.dataApproval];
        dataApproval[i] = { ...dataApproval[i], [event.target.name]: event.target.value };
        this.setState({ dataApproval });
    }
    handleCheck(event, i) {
        // event.preventDefault()
        let dataApproval = [...this.state.dataApproval];
        if (event.target.name === "checked_all") {
            for (let j = 0; j < this.state.dataApproval.length; j++) {
                dataApproval[j] = { ...dataApproval[j], checked: !this.state.checked_all };
            }
            this.setState({ checked_all: !this.state.checked_all });
        } else {
            dataApproval[i] = { ...dataApproval[i], checked: !this.state.dataApproval[i].checked };
        }
        this.setState({ dataApproval });
    }

    handleApproveAll(e) {
        e.preventDefault();
        let isValid = true;
        let data = [];
        let detail = [];
        var stateDataApproval=this.state.dataApproval;
        for (let i = 0; i < stateDataApproval.length; i++) {
            if (stateDataApproval[i].checked) {
                if (parseInt(stateDataApproval[i].total_qty, 10) !== parseInt(stateDataApproval[i].total_approval, 10)) {
                    let val = {};
                    val["sisa_approval"] = stateDataApproval[i].sisa_approval;
                    val["barcode"] = stateDataApproval[i].barcode;
                    data.push(val);
                    detail.push(stateDataApproval[i]);
                    if (parseInt(stateDataApproval[i].sisa_approval, 10) > (parseInt(stateDataApproval[i].total_qty, 10) - parseInt(stateDataApproval[i].total_approval, 10))) {
                        handleError("Terdapat qty yang tidak sesuai", "");
                        isValid = false;
                    }
                }
            } else {
                handleError("Ceklis item yang akan di approve", "");
            }
        }
        let parsedata = {};
        parsedata["kd_trx"] = localStorage.getItem("kd_trx_mutasi");
        parsedata["detail"] = data;

        let newParse = {};
        newParse["data"] = parsedata;
        newParse["detail"] = detail;
        if (data.length > 0) {
            if (isValid) {
                this.props.dispatch(saveApprovalMutation(newParse, (arr) => {
                    this.props.dispatch(FetchApprovalMutation(1, "", this.props.lokasi, this.props.parameterMutasi));
                    this.props.dispatch(ModalToggle(false));
                }, this.props.lokasi));
            }
        }
        this.setState({});
    }
    toggle(e) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
    }

    render() {

        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formApprovalMutation"} size="lg" className="custom-map-modal">
              <ModalHeader toggle={this.toggle}>
                  {localStorage.getItem("kd_trx_mutasi")} <br />
                <p style={{ color: "white" }}>
                  <small style={{ color: "white" }}>( Enter Atau Klik Button Approval Untuk Menyimpan Data )</small>{" "}
                </p>
              </ModalHeader>
              <ModalBody style={{ height: "90vh" }}>
                  {this.props.isLoadingApprovalDetail ? (
                      <Spinner />
                  ) : (
                      <TableCommon
                          head={[
                              { rowSpan: 2, label: "No", width: "1%" },
                              {
                                  rowSpan: 2,
                                  label: (
                                      <input
                                          type="checkbox"
                                          name="checked_all"
                                          className={this.state.allCheck ? "d-none" : ""}
                                          checked={this.state.checked_all}
                                          defaultValue={this.state.checked_all}
                                          onChange={(e) => this.handleCheck(e)}
                                      />
                                  ),
                                  width: "1%",
                              },
                              { colSpan: 6, label: "Barang", width: "1%" },
                              { colSpan: 2, label: "Total", width: "1%" },
                              { rowSpan: 2, label: "Qty approval" },
                          ]}
                          rowSpan={[{ label: "Nama" }, { label: "Kode" }, { label: "Barcode" }, { label: "Satuan" }, { label: "Harga jual" }, { label: "Harga beli" }, { label: "Qty" }, { label: "Approval" }]}
                          renderRow={
                              this.state.dataApproval.length > 0
                                  ? this.state.dataApproval.map((v, i) => {
                                      return (
                                          <tr key={i}>
                                            <td className="middle nowrap text-center">{i + 1}</td>
                                            <td className="middle nowrap text-center">
                                              <input type="checkbox" className={v.isReadonly ? "d-none" : ""} name="checked" checked={v.checked} defaultValue={v.checked} onChange={(e) => this.handleCheck(e, i)} />
                                            </td>
                                            <td className="middle nowrap">{v.nm_brg}</td>
                                            <td className="middle nowrap">{v.kd_brg}</td>
                                            <td className="middle nowrap">{v.barcode}</td>
                                            <td className="middle nowrap">{v.satuan}</td>
                                            <td className="middle nowrap text-right">{parseToRp(v.hrg_beli)}</td>
                                            <td className="middle nowrap text-right">{parseToRp(v.hrg_jual)}</td>
                                            <td className="middle nowrap text-right">{parseToRp(v.total_qty)}</td>
                                            <td className="middle nowrap text-right">{parseToRp(v.total_approval)}</td>
                                            <td className="middle nowrap">
                                              <input
                                                  readOnly={v.isReadonly}
                                                  type="text"
                                                  name="sisa_approval"
                                                  className={`form-control text-right in-table ${v.isReadonly ? "d-none" : ""}`}
                                                  value={v.sisa_approval}
                                                  onChange={(e) => this.handleChange(e, i)}
                                              />
                                                {!v.isReadonly ? (
                                                    <div
                                                        className="invalid-feedback"
                                                        style={parseInt(v.sisa_approval, 10) > parseInt(v.total_qty, 10) - parseInt(v.total_approval, 10) ? { display: "block" } : { display: "none" }}
                                                    >
                                                      Qty Approval Melebihi Total Qty.
                                                    </div>
                                                ) : (
                                                    ""
                                                )}
                                            </td>
                                          </tr>
                                      );
                                  })
                                  : "No data."
                          }
                      />
                  )}
              </ModalBody>
              <ModalFooter>
                <button onClick={(e) => this.handleApproveAll(e)} className="btn btn-primary float-right" disabled={this.props.isLoadingApprove}>
                    {this.props.isLoadingApprove ? <span className="spinner-border spinner-border-sm mr-2"></span> : ""}Approve Checked
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
        isLoadingApprovalDetail: state.mutationReducer.isLoadingApprovalDetail,
        isLoadingApprove: state.mutationReducer.isLoadingApprove,
    };
};
// const mapDispatch
export default withRouter(connect(mapStateToProps)(FormApprovalMutation));
// export default withRouter(connect(mapStateToPropsCreateItem)(ReturTanpaNota));
