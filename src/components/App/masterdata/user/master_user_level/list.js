import React, { Component } from "react";
import Paginationq from "helper";
import connect from "react-redux/es/connect/connect";
import FormUserLevel from "components/App/modals/masterdata/user_level/form_user_level";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import { deleteUserLevel, getUserLevel } from "redux/actions/masterdata/user_level/user_level.action";
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
import HeaderGeneralCommon from "../../../common/HeaderGeneralCommon";

class ListUserLevel extends Component {
  constructor(props) {
    super(props);
    this.handleModal = this.handleModal.bind(this);
    this.state = {
      detail: {},
      isModalForm: false,
      any: "",
    };
  }

  handlePageChange(pageNumber) {
    this.handleGet(this.state.any, pageNumber);
  }

  handleGet(any, page) {
    let where = `page=${page}`;
    if (any !== "") where += `&q=${any}`;
    this.setState({ where: where });
    this.props.dispatch(getUserLevel(where));
  }
  handleModal(param) {
    const state = {};
    if (param.mode === "add") {
      Object.assign(state, { isModalForm: true, detail: undefined });
    } else {
      Object.assign(state, { isModalForm: true, detail: param });
    }
    this.props.dispatch(ModalToggle(true));
    this.props.dispatch(ModalType("formUserLevel"));
    this.setState(state);
  }
  render() {
    const { total, per_page, current_page, data } = this.props.data;
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
                  <div className="col-xl-3 col-md-6" key={i}>
                    <div className="card">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-9 col-md-9">
                            <p className="mb-0">{v.lvl}</p>
                          </div>
                          <div className="col-3">
                            <div className="dashboard-dropdown">
                              <UncontrolledButtonDropdown>
                                <DropdownToggle caret style={{ background: "transparent", border: "none" }}>
                                  <i className="zmdi zmdi-more-vert"></i>
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem onClick={(e) => this.handleModal(v)}>
                                    <i className="ti-pencil-alt"></i> Edit
                                  </DropdownItem>
                                  <DropdownItem onClick={(e) => this.props.dispatch(deleteUserLevel(v.id))}>
                                    <i className="ti-trash"></i> Delete
                                  </DropdownItem>
                                </DropdownMenu>
                              </UncontrolledButtonDropdown>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="progress h-8 mb-0 mt-20 h-8">
                              <div className="progress-bar bg-primary" role="progressbar" style={{ width: "100%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            : "no data"}
        </div>

        <div className="row" style={{ float: "right" }}>
          <Paginationq current_page={current_page} per_page={per_page} total={total} callback={this.handlePageChange.bind(this)} />
        </div>
        {this.props.isOpen && this.state.isModalForm ? <FormUserLevel detail={this.state.detail} /> : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
  };
};
export default connect(mapStateToProps)(ListUserLevel);
