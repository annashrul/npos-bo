import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import Paginationq from "helper";
import {
  deleteDepartment,
  FetchDepartment,
} from "redux/actions/masterdata/department/department.action";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import FormDepartment from "components/App/modals/masterdata/department/form_department";
import Swal from "sweetalert2";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import TableCommon from "../../common/TableCommon";
import { generateNo, noData } from "../../../../helper";
import ButtonActionCommon from "../../common/ButtonActionCommon";

class ListDepartment extends Component {
  constructor(props) {
    super(props);
    this.toggleModal = this.toggleModal.bind(this);
    this.handlesearch = this.handlesearch.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.state = {
      detail: {},
      any: "",
      where: "",
    };
  }
  handleGet(any, page) {
    let where = `page=${page}`;
    if (any !== "") where += `&q=${any}`;
    this.setState({ where: where });
    this.props.dispatch(FetchDepartment(where));
  }
  handlePageChange(pageNumber) {
    this.handleGet(this.state.any, pageNumber);
  }
  handlesearch(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    let any = data.get("any");
    this.handleGet(any, 1);
  }
  toggleModal(index) {
    if (index === null) {
      this.setState({ detail: { id: "" } });
    } else {
      Object.assign(this.props.data.data[index], { where: this.state.where });
      this.setState({
        detail: this.props.data.data[index],
      });
    }
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formDepartment"));
  }
  handleDelete(index) {
    Object.assign(this.props.data.data[index], { where: this.state.where });
    this.props.dispatch(deleteDepartment(this.props.data.data[index]));
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
            <div className="col-2 col-xs-2 col-md-9">
              <div className="form-group text-right">
                <button
                  style={{ height: "38px" }}
                  type="button"
                  onClick={(e) => this.toggleModal(null)}
                  className="btn btn-primary"
                >
                  <i className="fa fa-plus" />
                </button>
              </div>
            </div>
          </div>
        </form>
        <TableCommon
          head={[
            { label: "No", className: "text-center", width: "1%" },
            { label: "#", className: "text-center", width: "1%" },
            { label: "Nama" },
          ]}
          meta={{
            total: total,
            current_page: current_page,
            per_page: per_page,
          }}
          body={typeof data === "object" && data}
          label={[{ label: "nama" }]}
          isNo={true}
          current_page={current_page}
          isAction={true}
          action={[{ label: "Edit" }, { label: "Hapus" }]}
          callback={(e, index) => {
            if (e === 0) this.toggleModal(index);
            if (e === 1) this.handleDelete(index);
          }}
          callbackPage={this.handlePageChange.bind(this)}
        />
        {this.props.isOpen && <FormDepartment detail={this.state.detail} />}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
  };
};
export default connect(mapStateToProps)(ListDepartment);
