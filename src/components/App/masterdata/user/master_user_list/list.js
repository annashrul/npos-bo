import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import FormUserList from "components/App/modals/masterdata/user_list/form_user_list";
import FormUserListPrompt from "components/App/modals/masterdata/user_list/form_user_list_prompt";

import profile from "assets/profile.png";
import Paginationq from "helper";
import DetailUserList from "../../../modals/masterdata/user_list/detail_user_list";
import {
  deleteUserList,
  FetchUserListDetail,
  FetchUserListEdit,
  setUserListEdit,
  getUserList,
} from "redux/actions/masterdata/user_list/user_list.action";
import { FetchAllLocation } from "redux/actions/masterdata/location/location.action";
import { getUserLevel } from "redux/actions/masterdata/user_level/user_level.action";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import HeaderGeneralCommon from "../../../common/HeaderGeneralCommon";

class ListUserList extends Component {
  constructor(props) {
    super(props);
    this.handleModal = this.handleModal.bind(this);
    this.state = {
      any: "",
      where: "",
      detail: {},
      isModalForm: false,
      isModalFormPrompt: false,
      isModalDetail: false,
    };
  }
  componentWillUnmount() {
    this.setState({
      isModalForm: false,
      isModalFormPrompt: false,
      isModalDetail: false,
    });
  }
  handleGet(any, page) {
    let where = `page=${page}`;
    if (any !== "") where += `&q=${any}`;
    this.setState({ where: where });
    this.props.dispatch(getUserList(where));
  }

  handlePageChange(pageNumber) {
    this.handleGet(this.state.any, pageNumber);
  }

  handleModal(param) {
    const isPublic = this.props.auth.user.is_public;
    const state = {};
    this.props.dispatch(FetchAllLocation());
    if (param.mode !== "detail") {
      this.props.dispatch(getUserLevel("page=1&perpage=1000"));
    }
    if (param.mode === "add") {
      this.props.dispatch(setUserListEdit([]));
      let form = "formUserList";
      Object.assign(state, { isModalForm: true });
      if (isPublic) {
        form = "formUserListPrompt";
        Object.assign(state, { isModalFormPrompt: true });
      }
      this.props.dispatch(ModalToggle(true));
      this.props.dispatch(ModalType(form));
    } else if (param.mode === "detail") {
      Object.assign(state, { isModalDetail: true });
      this.props.dispatch(FetchUserListDetail(param.id));
    } else {
      Object.assign(state, { isModalForm: true });
      this.props.dispatch(FetchUserListEdit(param.id));
    }

    this.setState(state);
  }

  render() {
    const {
      total,
      // last_page,
      per_page,
      current_page,
      // from,
      // to,
      data,
    } = this.props.userListData;
    return (
      <div>
        <HeaderGeneralCommon
          callbackGet={(res) => {
            this.setState({ any: res });
            this.handleGet(res, 1);
          }}
          callbackAdd={() => this.handleModal({ mode: "add" })}
        />
        <div className="row">
          {typeof data === "object"
            ? data.map((v, i) => {
                return (
                  <div className="col-md-6 col-xl-4" key={i}>
                    <div className="card rounded box-margin">
                      <div className="card-body">
                        <div className="d-flex justify-content-between mb-2 pb-2">
                          <div className="d-flex align-items-center">
                            <img
                              className="chat-img"
                              src={
                                v.foto === null || v.foto === "-"
                                  ? profile
                                  : v.foto
                              }
                              alt=""
                            />
                            <div className="ml-3">
                              <h6 className="mb-0">{v.nama}</h6>
                              <p className="text-12 mb-0">{v.lvl}</p>
                            </div>
                          </div>
                          <div className="dashboard-dropdown">
                            <UncontrolledButtonDropdown>
                              <DropdownToggle
                                caret
                                style={{
                                  background: "transparent",
                                  border: "none",
                                }}
                              >
                                <i className="zmdi zmdi-more-vert"></i>
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem
                                  onClick={(e) => {
                                    Object.assign(v, { mode: "edit" });
                                    this.handleModal(v);
                                  }}
                                >
                                  <i className="ti-pencil-alt"></i> Ubah
                                </DropdownItem>
                                <DropdownItem
                                  onClick={(e) => {
                                    Object.assign(v, { mode: "detail" });
                                    this.handleModal(v);
                                  }}
                                >
                                  <i className="ti-eye"></i> Detail
                                </DropdownItem>
                                {this.props.auth.user.is_public !== 1 ? (
                                  <DropdownItem
                                    onClick={(e) =>
                                      this.props.dispatch(deleteUserList(v.id))
                                    }
                                  >
                                    <i className="ti-trash"></i> Hapus
                                  </DropdownItem>
                                ) : (
                                  ""
                                )}
                              </DropdownMenu>
                            </UncontrolledButtonDropdown>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            : "No data."}
        </div>
        <hr />
        <div style={{ marginTop: "20px", float: "right" }}>
          <Paginationq
            current_page={current_page}
            per_page={per_page}
            total={total}
            callback={this.handlePageChange.bind(this)}
          />
        </div>
        {this.state.isModalForm && this.props.isOpen ? (
          <FormUserList
            lokasi={this.props.lokasi}
            userLevel={this.props.userLevel}
            userListEdit={this.props.userListEdit}
          />
        ) : null}

        {this.state.isModalFormPrompt && this.props.isOpen ? (
          <FormUserListPrompt token={this.props.token} />
        ) : null}
        {this.state.isModalDetail && this.props.isOpen ? (
          <DetailUserList
            userListDetail={this.props.userListDetail}
            lokasi={this.props.lokasi}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    isOpen: state.modalReducer,
    lokasi: state.locationReducer.allData,
    userLevel: state.userLevelReducer.data,
    userListEdit: state.userListReducer.edit,
    userListDetail: state.userListReducer.detail,
  };
};

export default connect(mapStateToProps)(ListUserList);
