import React, { Component } from "react";
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { FetchCustomer } from "redux/actions/masterdata/customer/customer.action";
import ListCustomer from "./src/master_customer/list";
import { FetchCustomerType } from "redux/actions/masterdata/customer_type/customer_type.action";
import ListCustomerType from "./src/master_customer_type/list";
import TabCommon from "../../common/TabCommon";

class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: true,
      isActive: 0,
    };
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.auth.user) {
      let access = nextProps.auth.user.access;
      if (access !== undefined && access !== null) {
        if (nextProps.auth.user.access[15]["label"] === "0") {
          alert("bukan halaman kamu");
          this.props.history.push({
            pathname: "/",
            state: { from: this.props.location.pathname },
          });
        }
      }
    }
  };

  componentWillMount() {
    this.props.dispatch(FetchCustomer("page=1"));
    this.props.dispatch(FetchCustomerType("page=1"));
  }
  render() {
    return (
      <TabCommon
        path={this.state.isActive === 0 ? "customer" : "customerType"}
        tabHead={["Daftar Customer", "Tipe customer"]}
        tabBody={[
          <ListCustomer data={this.props.customer} />,
          <ListCustomerType data={this.props.customerType} />,
        ]}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    customer: state.customerReducer.data,
    customerType: state.customerTypeReducer.data,
    isOpen: state.modalReducer,
    isLoading: state.customerReducer.isLoading,
    isLoading1: state.customerTypeReducer.isLoading,
    auth: state.auth,
  };
};
export default connect(mapStateToProps)(Customer);
