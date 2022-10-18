import React, { Component } from "react";
import Layout from "../../Layout";
import ListRak from "./src/list";
import connect from "react-redux/es/connect/connect";
import { FetchRak } from "redux/actions/masterdata/rak/rak.action";
// import {cekAkses} from "../../../../helper";

class Rak extends Component {
  constructor(props) {
    super(props);
    this.state = {
      section: "list",
      token: "",
      any: localStorage.getItem("any_rak"),
    };
    this.handlePagin = this.handlePagin.bind(this);
  }
  getProps(param) {
    if (param.auth.user) {
      let access = param.auth.user.access;
      if (access !== undefined && access !== null) {
        if (param.auth.user.access[16]["value"] === "0") {
          alert("bukan halaman kamu");
          this.props.history.push({
            pathname: "/",
            state: { from: this.props.location.pathname },
          });
        }
      }
    }
  }
  componentWillReceiveProps = (nextProps) => {
    this.getProps(nextProps);
  };

  componentWillMount() {
    let any = this.state.any;
    this.props.dispatch(FetchRak('page=1', any === undefined ? "" : any));
    this.getProps(this.props);
  }
  handlePagin(param) {
    let any = this.state.any;
    this.props.dispatch(FetchRak(param, any === undefined ? "" : any));
  }

  render() {
    return (
      <Layout page="Cash">
        <div className="col-12 box-margin">
          <ListRak pagin={this.handlePagin} data={this.props.rak} />
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth,
    rak: state.rakReducer.data,
    isLoading: state.rakReducer.isLoading,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(Rak);
