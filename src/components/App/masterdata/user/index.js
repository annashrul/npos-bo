import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import ListUserList from "./master_user_list/list";
import TabCommon from "../../common/TabCommon";
import ListUserLevel from "./master_user_level/list";
import { getUserList } from "../../../../redux/actions/masterdata/user_list/user_list.action";
import { getUserLevel } from "../../../../redux/actions/masterdata/user_level/user_level.action";

class User extends Component {
  constructor(props) {
    super(props);
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.auth.user) {
      let access = nextProps.auth.user.access;
      if (access !== undefined && access !== null) {
        if (nextProps.auth.user.access[11]["label"] === "0") {
          // alert("bukan halaman kamu");
          // this.props.history.push({
          //     pathname: '/',
          //     state: {from: this.props.location.pathname}
          // });
        }
      }
    }
  };
  componentWillMount() {
    this.props.dispatch(getUserList("page=1"));
    this.props.dispatch(getUserLevel("page=1"));
  }

  render() {
    return (
      <TabCommon path={"Pengguna"} tabHead={["Daftar pengguna", "Level pengguna"]} tabBody={[<ListUserList userListData={this.props.userlist} />, <ListUserLevel data={this.props.userLevel} />]} />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userlist: state.userListReducer.data,
    userLevel: state.userLevelReducer.data,
    isOpen: state.modalReducer,
    auth: state.auth.user,
  };
};
export default connect(mapStateToProps)(User);
