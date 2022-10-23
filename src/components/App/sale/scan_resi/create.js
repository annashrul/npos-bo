import React, { Component } from "react";
import { storeScanResi } from "../../../../redux/actions/sale/scan_resi.action";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import StickyBox from "react-sticky-box";
import Spinner from "Spinner";
import gambar_scan from './../../../../assets/gambar_scan.png';
import TableCommon from "../../common/TableCommon";
import moment from "moment";
import {
    actionDataCommon,
    getDataCommon,
    handleInputOnBlurCommon,
  } from "../../common/FlowTrxCommon";
import {
    get,
} from "components/model/app.model";
import {
    handleError,
    rmComma,
    setFocus,
    swallOption,
} from "../../../../helper";


const table = "scan_opname";
class ScanResi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            no_resi: "",
            tgl: moment(new Date()).format("yyyy-MM-DD"),
            catatan: "-",
            perpage: 5,
            scrollPage: 0,
            isScroll: false,
        };


    }
    handleGetDataObject(column, val, i) {
        let resival = [...this.state.resival];
        resival[i] = { ...resival[i], [column]: val };
        this.setState({ resival });
      }

    getData() {
        getDataCommon(table, (res, no_resi) => {
          this.setState({ no_resi: res, resival: no_resi });
        });
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

    HandleSubmit(e) {
        e.preventDefault();

        const data = get(table);
        data.then((res) => {
            if (res.length === 0) {
                handleError("scanresi");
                return;
            } else {
                swallOption("Pastikan data yang anda masukan sudah benar!", () => {
                    let detail = [];
                    let data = {};
                    const { tgl, no_resi, catatan } = this.state;
                    const { auth } = this.props;
                    data["kd_kasir"] = auth.user.id;
                    data["tgl"] = moment(tgl).format("yyyy-MM-DD");
                    data["catatan"] = catatan.value;
                    for (let i = 0; i < no_resi.length; i++) {
                        let item = res[i];
                        let no_resi = rmComma(item.no_resi);
                        if (no_resi < 0) {
                            setFocus(this, `${no_resi - btoa(item.no_resi)}`);
                            handleError("", "Nomor resi tidak boleh kosong");
                            return;
                        }
                        // detail.push({
                        //     no_resi: item.no_resi,
                        //     tgl: item.tgl,
                        //     kd_kasir: item.kd_kasir,
                        //     catatan: item.catatan,
                        // });
                    }
                    this.props.dispatch(
                        storeScanResi(data, () => {
                            this.handleClear();
                            this.getData();
                        })
                    );
                });
            }
        });
    }

    render() {
        const {
            no_resi,
            kd_kasir,
            tgl,
            catatan,
        } = this.state;

        return (
            <Layout page="Buat Scan Resi">
                <div className="card-header d-flex justify-content-between">
                    <h4>Scan Resi
                    </h4>
                    <h4
                        className="text-right   d-flex justify-content-between"
                        style={{ width: "50%" }}
                    >
                        <input
                            type="date"
                            name={"tgl"}
                            className={"form-control nbt nbr nbl bt"}
                            value={tgl}
                            onChange={(e) => this.handleChange(e, null)}
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
                    </h4>
                </div>
                <div className="card">
                    <div style={{ alignSelf: 'center', display: "flex", alignItems: "flex-start" }}>
                        <StickyBox>
                            <div className="card-body">
                                <img src={gambar_scan} alt="Logo" />
                                <div className="form-group">
                                    <div className="input-group input-group-sm">
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="Scan nomor resi disini ...."
                                            name="no_resi"
                                            className="form-control form-control-sm"
                                            value={no_resi}
                                            onChange={(e) => this.handleChange(e, null)}
                                            onKeyPress={(event) => {
                                                if (event.key === "Enter") {
                                                    this.HandleSubmit(event);
                                                }
                                            }}
                                            ref={(input) => (this[`no_resi`] = input)}
                                        />
                                        <span className="input-group-append">
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={this.HandleSubmit}
                                            >
                                                <i className="fa fa-paper-plane" />
                                            </button>
                                        </span>
                                    </div>
                                </div>

                            </div>
                        </StickyBox>
                    </div>
                </div>
            </Layout>

        )
    }
}

const mapStateToPropsCreateItem = (state) => {
    return {
        cash: state.cashReducer.data,
        isLoading: state.cashReducer.isLoading,
        auth: state.auth,
        isSuccessTrx: state.cashReducer.isSuccessTrx,
    };
};

export default connect(mapStateToPropsCreateItem)(ScanResi);
