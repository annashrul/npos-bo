import React, { Component } from "react";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import { FetchSupplier } from "redux/actions/masterdata/supplier/supplier.action";
import ListSupplier from "./src/list";

class Supplier extends Component {
  constructor(props) {
    super(props);
    this.state = { token: "" };
  }
  componentWillMount() {
    let any = localStorage.getItem("any_supplier");
    let page = localStorage.getItem("page_supplier");
    this.props.dispatch(FetchSupplier(page ? page : 1, any ? any : ""));
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.auth.user) {
      let access = nextProps.auth.user.access;
      if (access !== undefined && access !== null) {
        if (nextProps.auth.user.access[13]["label"] === "0") {
          alert("bukan halaman kamu");
          this.props.history.push({
            pathname: "/",
            state: { from: this.props.location.pathname },
          });
        }
      }
    }
  };

  render() {
    return (
      <Layout page="Supplier">
        <div className="col-12 box-margin">
          <ListSupplier
            data={this.props.supplier}
            pagin={this.handlePagin}
            search={this.handleSearch}
            token={this.state.token}
          />
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    supplier: state.supplierReducer.data,
    isLoading: state.supplierReducer.isLoading,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(Supplier);
