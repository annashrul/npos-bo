import React, { Component } from "react";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import Paginationq from "helper";
import { FetchClosing } from "redux/actions/report/closing/closing.action";
import Select from "react-select";
import moment from "moment";
import "moment/locale/id";
import Card from "./src/card";

class Closing extends Component {
  constructor(props) {
    super(props);
    this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
    this.handleEvent = this.handleEvent.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.state = {
      location_data: [],
      location: "",
      startDate: new Date(),
      token: "",
      detail: {},
    };
  }
  getProps(param) {
    if (param.auth.user) {
      let lk = [
        {
          value: "all",
          label: "Semua",
        },
      ];
      let loc = param.auth.user.lokasi;
      if (loc !== undefined) {
        loc.map((i) => {
          lk.push({
            value: i.kode,
            label: i.nama,
          });
          return null;
        });
        this.setState({
          location_data: lk,
        });
      }
    }
  }
  componentWillMount() {
    this.getProps(this.props);
    this.handleParam();
  }
  componentWillReceiveProps = (nextProps) => {
    this.getProps(nextProps);
  };
  componentDidMount() {
    if (
      localStorage.location_report_closing !== undefined &&
      localStorage.location_report_closing !== null
    ) {
      this.setState({
        location: localStorage.location_report_closing,
      });
    }
  }
  handlePageChange(pageNumber) {
    localStorage.setItem("page_closing_report", pageNumber);
    this.props.dispatch(FetchClosing(pageNumber, ""));
  }

  handleEvent = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    let err = Object.assign({}, this.state.error, { [event.target.name]: "" });
    this.setState({ error: err });
  };

  HandleChangeLokasi(lk) {
    this.setState({
      location: lk.value,
    });

    localStorage.setItem("location_report_closing", lk.value);
  }

  handleSearch(e) {
    e.preventDefault();
    this.handleParam();
  }
  handleParam() {
    let where = "";
    if (this.state.startDate !== undefined && this.state.startDate !== null) {
      where += `&datefrom=${moment(this.state.startDate).format("yyyy-MM-DD")}`;
    }
    if (
      this.state.location !== "" &&
      this.state.location !== undefined &&
      this.state.location !== null
    ) {
      where += `&lokasi=${this.state.location}`;
    }
    this.props.dispatch(FetchClosing(1, where));
  }

  render() {
    const {
      // total,
      last_page,
      per_page,
      current_page,
      // from,
      // to,
      data,
    } = this.props.closing;
    return (
      <Layout page="Closing">
        <div className="row align-items-center">
          <div className="col-md-3">
            <div className="form-group">
              <label>Tanggal</label>
              <input
                type="date"
                name="startDate"
                className="form-control"
                value={
                  this.state.startDate === undefined
                    ? moment(new Date()).format("yyyy-MM-DD")
                    : moment(this.state.startDate).format("yyyy-MM-DD")
                }
                onChange={this.handleEvent}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label>Lokasi</label>
              <Select
                options={this.state.location_data}
                placeholder="Pilih Lokasi"
                onChange={this.HandleChangeLokasi}
                value={this.state.location_data.find((op) => {
                  return op.value === this.state.location;
                })}
              />
            </div>
          </div>
          <div className="col-md-1">
            <div className="form-group">
              <button
                style={{ marginTop: "28px" }}
                type="button"
                className="btn btn-primary"
                onClick={(e) => this.handleSearch(e)}
              >
                <i className="fa fa-search" />
              </button>
            </div>
          </div>
        </div>
        <hr />
        <div className="row">
          {typeof data === "object" ? (
            data.length > 0 ? (
              data.map((v, i) => {
                return <Card handleReclosing={this.handleReclosing} item={v} />;
              })
            ) : (
              <div className="col-md-12">
                <p className="text-center">Tidak ada data.</p>
              </div>
            )
          ) : (
            <div className="col-md-12">
              <p className="text-center">Tidak ada data.</p>
            </div>
          )}
        </div>
        <div style={{ marginTop: "20px", float: "right" }}>
          <Paginationq
            current_page={current_page}
            per_page={per_page}
            total={parseInt(last_page * per_page, 10)}
            callback={this.handlePageChange.bind(this)}
          />
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    closing: state.closingReducer.data,
    auth: state.auth,
    isLoading: state.closingReducer.isLoading,
    closingDetail: state.closingReducer.closing_data,
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
  };
};
export default connect(mapStateToProps)(Closing);
