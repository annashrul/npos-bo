import React, { Component } from "react";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import StickyBox from "react-sticky-box";
import Spinner from "Spinner";
import gambar_scan from './../../../../assets/gambar_scan.png';


class ScanResi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            no_resi:"",
            any: "",
            tgl: "",
            catatan: "",
            perpage: 5,
            scrollPage: 0,
            isScroll: false,
          };
    }

    render() {
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
                            // name={"tgl"}
                            className={"form-control nbt nbr nbl bt"}
                            // value={tgl}
                            onChange={this.handleChange}
                        />
                        <input
                            placeholder="Tambahkan catatan disini ...."
                            type="text"
                            style={{ height: "39px" }}
                            className="form-control nbt nbr nbl bt"
                            // value={catatan}
                            onChange={this.handleChange}
                        // name="note"
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
                                            // ref={(input) => (this[`any`] = input)}
                                            autoFocus
                                            type="text"
                                            placeholder="Scan nomor resi disini ...."
                                            // name="any"
                                            className="form-control form-control-sm"
                                            // value={any}
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
