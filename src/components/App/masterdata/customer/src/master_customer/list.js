import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import Paginationq, { statusQ } from "helper";
import { deleteCustomer, FetchCustomer, setCustomerEdit } from "redux/actions/masterdata/customer/customer.action";
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
import FormCustomer from "components/App/modals/masterdata/customer/form_customer";
import { FetchCustomerTypeAll } from "redux/actions/masterdata/customer_type/customer_type.action";
import { generateNo } from "../../../../../../helper";
import HeaderGeneralCommon from "../../../../common/HeaderGeneralCommon";
import TableCommon from "../../../../common/TableCommon";
class ListCustomer extends Component {
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
    this.props.dispatch(FetchCustomer(where));
  }
  handlePageChange(pageNumber) {
    this.handleGet(this.state.any, pageNumber);
  }

  toggleModal(i) {
    if (i === null) {
      this.setState({ detail: { where: this.state.where, id: "" } });
    } else {
      let props = this.props.data.data[i];
      Object.assign(props, { where: this.state.where });
      this.setState({ detail: props });
    }
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formCustomer"));
    this.props.dispatch(FetchCustomerTypeAll());
  }

  handleDelete(i) {
    let detail = {};
    Object.assign(detail, {
      where: this.state.where,
      total: this.props.data.total,
    });
    this.props.dispatch(deleteCustomer(this.props.data.data[i].kd_cust, detail));
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
            { label: "Kode" },
            { label: "Nama" },
            { label: "Telepon" },
            { label: "Tipe Customer" },
            { label: "Email" },
            { label: "Lokasi" },
            { label: "Keterangan" },
            { label: "Alamat" },
            { label: "Status" },
          ]}
          meta={{
            total: total,
            current_page: current_page,
            per_page: per_page,
          }}
          body={typeof data === "object" && data}
          label={[
            { label: "kd_cust" },
            { label: "nama" },
            { label: "tlp" },
            { label: "cust_type" },
            { label: "email" },
            { label: "lokasi" },
            { label: "keterangan" },
            { label: "alamat" },
            { label: "status", isStatus: true },
          ]}
          current_page={current_page}
          action={[{ label: "Edit" }, { label: "Hapus" }]}
          callback={(e, index) => {
            if (e === 0) this.toggleModal(index);
            if (e === 1) this.handleDelete(index);
          }}
          callbackPage={this.handlePageChange.bind(this)}
        />
        {this.props.isOpen && <FormCustomer detail={this.state.detail} dataCustomerEdit={this.props.dataCustomerEdit} dataCustomerTypeAll={this.props.dataCustomerTypeAll} />}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    auth: state.auth,
    dataCustomerEdit: state.customerReducer.edit,
    dataCustomerTypeAll: state.customerTypeReducer.all,
    isLoading: state.customerReducer.isLoading,
  };
};
export default connect(mapStateToProps)(ListCustomer);
