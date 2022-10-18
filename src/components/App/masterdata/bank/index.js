import React, { Component } from "react";
import Layout from "../../Layout";
import ListBank from "./src/list";
import connect from "react-redux/es/connect/connect";
import { FetchBank } from "redux/actions/masterdata/bank/bank.action";
// import {cekAkses} from "../../../../helper";

class Bank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      section: "list",
      token: "",
      any: localStorage.getItem("any_bank"),
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
    this.props.dispatch(FetchBank(1, any === undefined ? "" : any));
    this.getProps(this.props);
  }
  handlePagin(param) {
    let any = this.state.any;
    this.props.dispatch(FetchBank(param, any === undefined ? "" : any));
  }

  render() {
    return (
      <Layout page="Cash">
        <div className="col-12 box-margin">
          <ListBank pagin={this.handlePagin} data={this.props.bank} />
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth,
    bank: state.bankReducer.data,
    isLoading: state.bankReducer.isLoading,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(Bank);
