import React, { Component } from "react";
import {
  deleteRak,
  FetchRak,
} from "redux/actions/masterdata/rak/rak.action";
import connect from "react-redux/es/connect/connect";
import Paginationq from "helper";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import FormRak from "components/App/modals/masterdata/rak/form_rak";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import Default from "assets/default.png";
import { generateNo } from "../../../../../helper";

class ListRak extends Component {
  constructor(props) {
    super(props);
    this.handlesearch = this.handlesearch.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.state = {
      any: "",
      detail: {},
    };
  }
  handleService(any, page) {
    let where = `page=${page}`;
    if (any !== "") where += `&q=${any}`;
    this.props.dispatch(FetchRak(where));
  }
  handlePageChange(pageNumber) {
    this.handleService(this.state.any, pageNumber);
  }
  handlesearch(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    let any = data.get("any");
    this.handleService(any, 1);
  }
  toggleModal(e) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formRak"));
    this.setState({ detail: {} });
  }
  handleEdit(e, id, title) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formRak"));
    this.setState({
      detail: {
        id: id,
        title: title,
      },
    });
  }

  handleDelete(e, id) {
    e.preventDefault();
    this.props.dispatch(deleteRak(id));
  }
  render() {
    const { current_page, data, per_page, total } = this.props.data;
    return (
      <div>
        <form onSubmit={this.handlesearch} noValidate>
          <div className="row">
            <div className="col-10 col-xs-10 col-md-11">
              <div className="row">
                <div className="col-md-4">
                  <div className="input-group input-group-sm">
                    <input
                      type="search"
                      name="any"
                      className="form-control form-control-sm"
                      placeholder="cari berdasarkan nama"
                      value={this.state.any}
                      onChange={(e) => {
                        this.setState({ any: e.target.value });
                      }}
                    />
                    <span className="input-group-append">
                      <button type="submit" className="btn btn-primary">
                        <i className="fa fa-search" />
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-4 col-xs-2 col-md-1 text-right">
              <div className="form-group">
                <button
                  type="button"
                  onClick={(e) => this.toggleModal(e)}
                  className="btn btn-primary"
                >
                  <i className="fa fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </form>
        
        <div style={{ overflowX: "auto" }}>
          <table className="table table-hover table-noborder">
            <thead className="bg-light">
              <tr>
                <th className="text-black text-center middle nowrap" width="1%">
                  No
                </th>
                <th className="text-black text-center middle nowrap" width="1%">
                  #
                </th>
                <th className="text-black middle nowrap">Nama</th>
              </tr>
            </thead>
            <tbody>
              {
                typeof data === "object" ? (
                  data.map((v, i) => {
                  return (
                    <tr key={i}>
                      <td className="text-center middle nowrap">{generateNo(i, current_page)}</td>
                      <td className="text-center middle nowrap">
                        {/* Example split danger button */}
                        <div className="btn-group">
                          <UncontrolledButtonDropdown>
                            <DropdownToggle caret></DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem onClick={(e) =>
                                          this.handleEdit(
                                            e,
                                            v.id,
                                            v.title
                                          )
                                        }>Edit</DropdownItem>
                              <DropdownItem onClick={(e) =>
                                          this.handleDelete(e, v.id)
                                        }>Delete</DropdownItem>
                            </DropdownMenu>
                          </UncontrolledButtonDropdown>
                        </div>
                      </td>
                      <td className="middle nowrap">{v.title}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={2}>No Data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: "20px", float: "right" }}>
          <Paginationq
            current_page={current_page}
            per_page={per_page}
            total={total}
            callback={this.handlePageChange.bind(this)}
          />
        </div>
        <FormRak token={this.props.token} detail={this.state.detail} />
      </div>
    );
  }
}

export default connect()(ListRak);
