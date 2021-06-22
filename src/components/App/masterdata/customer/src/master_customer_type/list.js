import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import Paginationq, { generateNo } from "helper";
import {
  deleteCustomerType,
  FetchCustomerType,
} from "redux/actions/masterdata/customer_type/customer_type.action";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import FormCustomerType from "components/App/modals/masterdata/customer_type/form_customer_type";

class ListCustomerType extends Component {
  constructor(props) {
    super(props);
    this.handlesearch = this.handlesearch.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      any: "",
      where: "",
      detail: {},
    };
  }
  handleGet(any, page) {
    let where = `page=${page}`;
    if (any !== "") where += `&q=${any}`;
    this.setState({ where: where });
    this.props.dispatch(FetchCustomerType(where));
  }
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handlePageChange(pageNumber) {
    this.handleGet(this.state.any, pageNumber);
  }
  handlesearch(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    let any = data.get("any");
    this.setState({ any: any });
    this.handleGet(any, 1);
  }
  toggleModal(e, i) {
    e.preventDefault();
    let where = this.state.where;
    let detail = { where: where };
    if (i === null) {
      Object.assign(detail, { id: "" });
    } else {
      Object.assign(this.props.data.data[i], { id: "-" });
      Object.assign(detail, this.props.data.data[i]);
    }
    this.setState({ detail: detail });
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formCustomerType"));
  }
  handleDelete(e, i) {
    e.preventDefault();
    let detail = {};
    Object.assign(detail, {
      where: this.state.where,
      total: this.props.data.total,
    });
    this.props.dispatch(deleteCustomerType(i, detail));
  }
  render() {
    const { total, per_page, current_page, data } = this.props.data;
    return (
      <div>
        <form onSubmit={this.handlesearch} noValidate>
          <div className="row">
            <div className="col-10 col-xs-10 col-md-3">
              <div className="input-group input-group-sm">
                <input
                  type="search"
                  name="any"
                  className="form-control form-control-sm"
                  placeholder="tulis sesuatu disini"
                  value={this.state.any}
                  onChange={(e) => this.setState({ any: e.target.value })}
                />
                <span className="input-group-append">
                  <button type="submit" className="btn btn-primary">
                    <i className="fa fa-search" />
                  </button>
                </span>
              </div>
            </div>
            <div className="col-2 col-xs-2 col-md-9">
              <div className="form-group text-right">
                <button
                  style={{ height: "38px" }}
                  type="button"
                  onClick={(e) => this.toggleModal(e, null)}
                  className="btn btn-primary"
                >
                  <i className="fa fa-plus" />
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
                <th className="text-black" width="1%">
                  Kode
                </th>
                <th className="text-black">Nama</th>
              </tr>
            </thead>
            <tbody>
              {typeof data === "object" ? (
                data.map((v, i) => {
                  return (
                    <tr key={i}>
                      <td className="text-center middle nowrap">
                        {generateNo(i, current_page)}
                      </td>
                      <td className="text-center middle nowrap">
                        <UncontrolledButtonDropdown>
                          <DropdownToggle caret></DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              onClick={(e) => this.toggleModal(e, i)}
                            >
                              Edit
                            </DropdownItem>
                            <DropdownItem
                              onClick={(e) => this.handleDelete(e, v.kode)}
                            >
                              Delete
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledButtonDropdown>
                      </td>
                      <td className="middle nowrap">{v.kode}</td>
                      <td className="middle nowrap">{v.nama}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4}>No Data.</td>
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
        {this.props.isOpen && <FormCustomerType detail={this.state.detail} />}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
  };
};
export default connect(mapStateToProps)(ListCustomerType);
