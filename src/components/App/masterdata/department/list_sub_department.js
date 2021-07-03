import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import {
  deleteSubDepartment,
  FetchSubDepartment,
} from "redux/actions/masterdata/department/sub_department.action";
import FormSubDepartment from "components/App/modals/masterdata/department/form_sub_department";
import { ModalType } from "redux/actions/modal.action";
import { FetchAllDepartment } from "../../../../redux/actions/masterdata/department/department.action";
import TableCommon from "../../common/TableCommon";
import HeaderGeneralCommon from "../../common/HeaderGeneralCommon";

class ListSubDepartment extends Component {
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
    this.props.dispatch(FetchSubDepartment(where));
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
    this.props.dispatch(FetchAllDepartment());
    this.props.dispatch(ModalType("formSubDepartment"));
  }
  handleDelete(index) {
    Object.assign(this.props.data.data[index], { where: this.state.where });
    this.props.dispatch(deleteSubDepartment(this.props.data.data[index]));
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
          head={[
            { label: "No", className: "text-center", width: "1%" },
            { label: "#", className: "text-center", width: "1%" },
            { label: "Kode", width: "1%" },
            { label: "Nama" },
          ]}
          meta={{
            total: total,
            current_page: current_page,
            per_page: per_page,
          }}
          body={typeof data === "object" && data}
          label={[{ label: "kode" }, { label: "nama" }]}
          current_page={current_page}
          action={[{ label: "Edit" }, { label: "Hapus" }]}
          callback={(e, index) => {
            if (e === 0) this.toggleModal(index);
            if (e === 1) this.handleDelete(index);
          }}
          callbackPage={this.handlePageChange.bind(this)}
        />
        {this.props.isOpen && (
          <FormSubDepartment
            dataDepartment={this.props.dataDepartment}
            detail={this.state.detail}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    dataDepartment: state.departmentReducer.allData,
  };
};
export default connect(mapStateToProps)(ListSubDepartment);
