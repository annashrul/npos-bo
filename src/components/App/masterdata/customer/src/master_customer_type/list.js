import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import Paginationq, { generateNo, parseToRp } from "helper";
import { deleteCustomerType, FetchCustomerType } from "redux/actions/masterdata/customer_type/customer_type.action";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
import FormCustomerType from "components/App/modals/masterdata/customer_type/form_customer_type";
import HeaderGeneralCommon from "../../../../common/HeaderGeneralCommon";
import TableCommon from "../../../../common/TableCommon";

class ListCustomerType extends Component {
  constructor(props) {
    super(props);
    this.toggleModal = this.toggleModal.bind(this);
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

  handlePageChange(pageNumber) {
    this.handleGet(this.state.any, pageNumber);
  }

  toggleModal(i) {
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
  handleDelete(i) {
    let detail = {};
    Object.assign(detail, {
      where: this.state.where,
      total: this.props.data.total,
    });
    this.props.dispatch(deleteCustomerType(this.props.data.data[i].kode, detail));
  }
  render() {
    const { total, per_page, current_page, data } = this.props.data;
    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "#", className: "text-center", width: "1%" },
      { label: "Kode", width: "1%" },
      { label: "Nama" },
      { label: "Diskon", width: "1%" },
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
          head={head}
          meta={{
            total: total,
            current_page: current_page,
            per_page: per_page,
          }}
          body={typeof data === "object" && data}
          label={[{ label: "kode" }, { label: "nama" }, { label: "diskon", isCurrency: true }]}
          current_page={current_page}
          action={[{ label: "Edit" }, { label: "Hapus" }]}
          callback={(e, index) => {
            if (e === 0) this.toggleModal(index);
            if (e === 1) this.handleDelete(index);
          }}
          callbackPage={this.handlePageChange.bind(this)}
        />
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
