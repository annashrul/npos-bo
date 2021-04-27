import React, { Component } from "react";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import { FetchSales } from "redux/actions/masterdata/sales/sales.action";
import ListSales from "./src/list";

class Sales extends Component {
  constructor(props) {
    super(props);
    this.state = { token: "" };
  }
  componentWillMount() {
    let any = localStorage.getItem("any_sales");
    let page = localStorage.getItem("page_sales");
    this.props.dispatch(FetchSales(page ? page : 1, any ? any : ""));
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.auth.user) {
      let access = nextProps.auth.user.access;
      if (access !== undefined && access !== null) {
        if (nextProps.auth.user.access[17]["label"] === "0") {
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
      <Layout page="Sales">
        <div className="col-12 box-margin">
          <ListSales
            data={this.props.sales}
            pagin={this.handlePagin}
            search={this.handleSearch}
            token={this.state.token}
            auth={this.props.auth}
          />
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    sales: state.salesReducer.data,
    isLoading: state.salesReducer.isLoading,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(Sales);
