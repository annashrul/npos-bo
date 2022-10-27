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
    destroy,
    cekData,
    del,
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
            kd_kasir:"",
            tgl: moment(new Date()).format("yyyy-MM-DD"),
            catatan: "-",
            perpage: 5,
            scrollPage: 0,
            isScroll: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.clearState = this.clearState.bind(this);
    }

    clearState() {
        this.setState({
          createdAt: moment(new Date()).format("YYYY-MM-DD"),
          catatan: "-",
          no_resi: "",
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

    handleSubmit(e) {
        e.preventDefault();
        let data = {};
        const { tgl, no_resi,catatan } = this.state;
        const { auth } = this.props;
        data["kd_kasir"] = auth.user.id;
        data["no_resi"] = no_resi;
        data["catatan"] = catatan;
        data["tgl"] = moment(tgl).format("yyyy-MM-DD");
        // const data = [
        //     "no_resi",
        //     "kd_kasir",
        //     "tgl",
        //     "catatan"
        // ]
        this.props.dispatch(
            storeScanResi(data, () => {
                this.clearState();
            })
        );
        console.log(this.state);

    }

    render() {
        const {
            no_resi,
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
                            // ref={(input) => (this[`catatan`] = input)}
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
                                            // ref={(input) => (this[`no_resi`] = input)}
                                            name="no_resi"
                                            className="form-control form-control-sm"
                                            value={no_resi}
                                            onChange={(e) => this.handleChange(e, null)}
                                            onKeyPress={(event) => {
                                                if (event.key === "Enter") {
                                                    this.handleSubmit(event);
                                                }
                                            }}
                                        />
                                        <span className="input-group-append">
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                onClick={(event) =>
                                                    this.handleSubmit(event)
                                                }

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
        auth: state.auth,
    };
    
};

export default connect(mapStateToPropsCreateItem)(ScanResi);
