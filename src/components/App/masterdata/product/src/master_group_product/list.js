import React, { Component } from "react";
import { connect } from "react-redux";
import { deleteGroupProduct, FetchGroupProduct } from "redux/actions/masterdata/group_product/group_product.action";
import { ModalType } from "redux/actions/modal.action";
import { FetchSubDepartmentAll } from "redux/actions/masterdata/department/sub_department.action";
import FormGroupProduct from "components/App/modals/masterdata/group_product/form_group_product";

import HeaderGeneralCommon from "../../../../common/HeaderGeneralCommon";
import TableCommon from "../../../../common/TableCommon";

class ListGroupProduct extends Component {
  constructor(props) {
    super(props);
    this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      where: "",
      detail: {},
      any: "",
    };
  }
  handleGet(any, page) {
    let where = `page=${page}`;
    if (any !== "") where += `&q=${any}`;
    this.setState({ where: where });
    this.props.dispatch(FetchGroupProduct(where));
  }
  handlePageChange(pageNumber) {
    this.handleGet(this.state.any, pageNumber);
  }

  toggleModal(index) {
    let state = { kel_brg: "", where: this.state.where };
    if (index !== null) {
      Object.assign(state, this.props.data.data[index]);
      this.setState({ detail: state });
    }
    this.props.dispatch(ModalType("formGroupProduct"));
    this.props.dispatch(FetchSubDepartmentAll());
  }

  handleDelete(i) {
    this.props.dispatch(deleteGroupProduct(this.props.data.data[i].kel_brg, this.state.where));
  }
  render() {
    const { total, per_page, current_page, data } = this.props.data;
    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "#", className: "text-center", width: "1%" },
      { label: "Nama" },
      { label: "Sub departemen", width: "1%" },
      { label: "Status", width: "1%" },
      { label: "Gambar", width: "1%" },
    ];
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
          meta={{
            total: total,
            current_page: current_page,
            per_page: per_page,
          }}
          head={head}
          body={typeof data === "object" && data}
          label={[{ label: "nm_kel_brg" }, { label: "subdept" }, { label: "status", isStatus: true }, { label: "gambar", isImage: true }]}
          current_page={current_page}
          action={[{ label: "Edit" }, { label: "Hapus" }]}
          callback={(e, index) => {
            if (e === 0) this.toggleModal(index);
            if (e === 1) this.handleDelete(index);
          }}
          callbackPage={this.handlePageChange.bind(this)}
        />
        {this.props.isOpen && <FormGroupProduct group2={this.props.group2} detail={this.state.detail} token={this.props.token} />}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    group2: state.subDepartmentReducer.all,
  };
};
export default connect(mapStateToProps)(ListGroupProduct);
