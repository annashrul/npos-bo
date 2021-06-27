import React, { Component } from "react";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import ListDepartment from "./list_department";
import ListSubDepartment from "./list_sub_department";
import { FetchDepartment } from "redux/actions/masterdata/department/department.action";
import { FetchSubDepartment } from "redux/actions/masterdata/department/sub_department.action";
import { getStorage, isEmptyOrUndefined, setStorage } from "../../../../helper";

class Department extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
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
  componentDidMount() {
    let index = getStorage("activeTabDepartment");
    if (isEmptyOrUndefined(index)) {
      this.setState({ selectedIndex: parseInt(index, 10) });
    }
  }
  handleSelect = (index) => {
    setStorage("activeTabDepartment", `${index}`);
    this.setState({ selectedIndex: index });
  };
  render() {
    return (
      <Layout page="Department">
        <Tabs
          style={{ zoom: "90%" }}
          selectedIndex={this.state.selectedIndex}
          onSelect={(selectedIndex) => this.handleSelect(selectedIndex)}
        >
          <div className="card-header">
            <TabList>
              <Tab>Department</Tab>
              <Tab>Sub Department</Tab>
            </TabList>
          </div>
          <div className="card-body">
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
          </div>
        </Tabs>
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
