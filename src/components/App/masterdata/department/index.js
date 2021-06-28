import React, { Component } from "react";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import ListDepartment from "./list_department";
import ListSubDepartment from "./list_sub_department";
import { FetchDepartment } from "redux/actions/masterdata/department/department.action";
import { FetchSubDepartment } from "redux/actions/masterdata/department/sub_department.action";
import { getStorage, isEmptyOrUndefined, setStorage } from "../../../../helper";
import TabCommon from "../../common/TabCommon";

class Department extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.props.dispatch(FetchDepartment());
    this.props.dispatch(FetchSubDepartment());
  }

  render() {
    return (
      <TabCommon
        path="departemen"
        tabHead={["Departemen", "Sub departemen"]}
        tabBody={[
          <ListDepartment data={this.props.department} />,
          <ListSubDepartment data={this.props.subDepartment} />,
        ]}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    department: state.departmentReducer.data,
    subDepartment: state.subDepartmentReducer.data,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(Department);
