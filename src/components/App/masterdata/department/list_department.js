import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import { deleteDepartment, FetchDepartment } from "redux/actions/masterdata/department/department.action";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import FormDepartment from "components/App/modals/masterdata/department/form_department";
import TableCommon from "../../common/TableCommon";
import HeaderGeneralCommon from "../../common/HeaderGeneralCommon";

class ListDepartment extends Component {
  constructor(props) {
    super(props);
    this.toggleModal = this.toggleModal.bind(this);
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
        <HeaderGeneralCommon
          callbackGet={(res) => {
            this.setState({ any: res });
            this.handleGet(res, 1);
          }}
          callbackAdd={() => this.toggleModal(null)}
        />
        <TableCommon
          head={[{ label: "No", className: "text-center", width: "1%" }, { label: "#", className: "text-center", width: "1%" }, { label: "Nama" }]}
          meta={{
            total: total,
            current_page: current_page,
            per_page: per_page,
          }}
          body={typeof data === "object" && data}
          label={[{ label: "nama" }]}
          current_page={current_page}
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
