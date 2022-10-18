import React, { Component } from "react";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";

class ApproveSO extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <Layout page="Transaksi Approval Sales Order">Approval SO</Layout>;
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

export default connect(mapStateToPropsCreateItem)(ApproveSO);
