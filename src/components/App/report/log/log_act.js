import React, { Component } from "react";
import Layout from "components/App/Layout";
import Paginationq from "helper";
import { FetchLogAct } from "redux/actions/report/log/log_act.action";
import connect from "react-redux/es/connect/connect";
import moment from "moment";
import { isArray } from "lodash";
import HeaderReportCommon from "../../common/HeaderReportCommon";
import {
  CapitalizeEachWord,
  getFetchWhere,
  noDataImg,
} from "../../../../helper";
class LogActReport extends Component {
  constructor(props) {
    super(props);
    this.handleGet = this.handleGet.bind(this);
    this.state = {
      where_data: "",
      any: "",
      startDate: moment(new Date()).format("yyyy-MM-DD"),
      endDate: moment(new Date()).format("yyyy-MM-DD"),
      keyName_: [],
      valData_: [],
    };
  }

  handleGet(e, data) {
    e.preventDefault();
    const arr_data = isArray(JSON.parse(data))
      ? JSON.parse(data)
      : [JSON.parse(data)];
    arr_data.map((v, i) => {
      const not_allowed = [
        "id",
        "password",
        "password_otorisasi",
        "kode",
        "username",
        "user_id",
        "user_lvl",
      ];
      Object.keys(arr_data[i])
        .filter((key) => not_allowed.includes(key))
        .forEach((key) => delete arr_data[i][key]);
      return null;
    });

    const keyName = arr_data
      .map((o) => {
        return Object.keys(o);
      })
      .reduce((prev, curr) => {
        return prev.concat(curr);
      })
      .filter((col, i, array) => {
        return array.indexOf(col) === i;
      });

    this.setState({
      keyName_: keyName,
      valData_: arr_data,
    });
  }

  handleService(res, page = 1) {
    if (res !== undefined) {
      let where = getFetchWhere(res, page);
      let state = { where_data: where };
      this.setState(state);
      this.props.dispatch(FetchLogAct(where));
    }
  }
  handlePageChange(page) {
    this.handleService(this.state.where_data, page);
  }

  render() {
    const { per_page, last_page, current_page, data } =
      this.props.log_actReport;
    return (
      <Layout page="Laporan LogAct">
        <HeaderReportCommon
          col="col-md-2"
          pathName="LogAktivitas"
          callbackWhere={(res) => this.handleService(res)}
        />
        <div className="row">
          <div className="col-4">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">LOG AKTIFITAS</h4>
                <div style={{ overflowX: "auto", width: "auto", height: 400 }}>
                  <ul className="dashboard-active-timeline list-unstyled">
                    <tbody>
                      {typeof data === "object"
                        ? data.length > 0
                          ? data.map((v, i) => {
                              const items = ["bg-primary"];
                              let rand_bg =
                                items[Math.floor(Math.random() * items.length)];
                              let icon = "";
                              let table = v.tabel.split("_");
                              if (table.length === 1) {
                                icon = `${table[0]}`.charAt(0);
                              }
                              if (table.length > 1) {
                                icon = `${table[0].charAt(0)}${table[1].charAt(
                                  0
                                )}`;
                              }

                              return (
                                <a
                                  href="!#"
                                  onClick={(e) => this.handleGet(e, v.detail)}
                                  key={i}
                                >
                                  <li className="d-flex align-items-center mb-15">
                                    <div
                                      className={
                                        "timeline-icon " + rand_bg + " mr-3"
                                      }
                                    >
                                      {icon.toUpperCase()}
                                    </div>
                                    <div className="timeline-info">
                                      <p className="font-weight-bold mb-0">
                                        {v.aksi}
                                      </p>
                                      <span>
                                        {v.tabel} | {v.nama}
                                      </span>
                                      <p className="mb-0">
                                        {moment(v.tgl).format("LLLL")}
                                      </p>
                                    </div>
                                  </li>
                                </a>
                              );
                            })
                          : "No data."
                        : "No data."}
                    </tbody>
                  </ul>
                </div>
                <hr />
                <div className="mt-10 float-right">
                  <Paginationq
                    current_page={current_page}
                    per_page={per_page}
                    total={per_page * last_page}
                    callback={this.handlePageChange.bind(this)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-8">
            <div
              className="table-responsive"
              ref={(element) => {
                if (element)
                  element.style.setProperty("overflow-x", "auto", "important");
              }}
            >
              {typeof this.state.valData_ === "object" &&
              this.state.valData_.length > 0 ? (
                <table className="table table-hover table-noborder">
                  <thead className="bg-light">
                    {this.state.valData_.map((v, i) => {
                      return typeof this.state.keyName_ === "object"
                        ? this.state.keyName_.length > 0
                          ? this.state.keyName_.map((w, j) => {
                              return (
                                <>
                                  <tr>
                                    <th
                                      className="middle nowrap"
                                      style={{ width: "50%" }}
                                    >
                                      {CapitalizeEachWord(
                                        w.replaceAll("_", " ")
                                      )}
                                    </th>
                                    <th
                                      className="middle nowrap text-center"
                                      width="1%"
                                    >
                                      :
                                    </th>
                                    <th className="middle nowrap text-right">
                                      {v[w]}
                                    </th>
                                  </tr>
                                </>
                              );
                            })
                          : "No data."
                        : "No data.";
                    })}
                  </thead>
                  <tbody></tbody>
                </table>
              ) : (
                <img src={noDataImg} />
              )}
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    log_actReport: state.log_actReducer.report,
    isLoadingDetail: state.log_actReducer.isLoadingDetail,
    log_actReportExcel: state.log_actReducer.report_excel,
    auth: state.auth,
    isLoading: state.log_actReducer.isLoading,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(LogActReport);
