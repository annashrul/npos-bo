import React, { Component } from "react";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import ListDepartment from "./list_department";
import ListSubDepartment from "./list_sub_department";
import { FetchDepartment } from "redux/actions/masterdata/department/department.action";
import { FetchSubDepartment } from "redux/actions/masterdata/department/sub_department.action";

class Department extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
    };
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.auth.user) {
      let access = nextProps.auth.user.access;
      if (access !== undefined && access !== null) {
        if (nextProps.auth.user.access[12]["label"] === "0") {
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
    this.props.dispatch(FetchDepartment());
    this.props.dispatch(FetchSubDepartment());
  }
  handleSelect = (index) => {
    this.setState({ selectedIndex: index }, () => {});
  };
  render() {
    return (
      <Layout page="Department">
        <div className="col-12 box-margin">
          <Tabs>
            <TabList>
              <Tab onClick={() => this.handleSelect(0)}>Department</Tab>
              <Tab onClick={() => this.handleSelect(1)}>Sub Department</Tab>
            </TabList>
            <TabPanel>
              <ListDepartment
                token={this.state.token}
                data={this.props.department}
              />
            </TabPanel>
            <TabPanel>
              <ListSubDepartment
                token={this.state.token}
                data={this.props.subDepartment}
              />
            </TabPanel>
          </Tabs>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    department: state.departmentReducer.data,
    subDepartment: state.subDepartmentReducer.data,
    isLoading: state.departmentReducer.isLoading,
    isLoading1: state.subDepartmentReducer.isLoading,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(Department);
