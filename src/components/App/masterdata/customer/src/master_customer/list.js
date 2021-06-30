import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import Paginationq, { statusQ } from "helper";
import { deleteCustomer, FetchCustomer, setCustomerEdit } from "redux/actions/masterdata/customer/customer.action";
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
import FormCustomer from "components/App/modals/masterdata/customer/form_customer";
import { FetchCustomerTypeAll } from "redux/actions/masterdata/customer_type/customer_type.action";
import { generateNo } from "../../../../../../helper";

class ListCustomer extends Component {
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
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleGet(any, page) {
    let where = `page=${page}`;
    if (any !== "") where += `&q=${any}`;
    this.setState({ where: where });
    this.props.dispatch(FetchCustomer(where));
  }
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
    this.props.dispatch(setCustomerEdit([]));
  }

  handleDelete(e, id) {
    e.preventDefault();
    let detail = {};
    Object.assign(detail, {
      where: this.state.where,
      total: this.props.data.total,
    });
    console.log(detail);
    this.props.dispatch(deleteCustomer(id, detail));
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
                <button style={{ height: "38px" }} type="button" onClick={(e) => this.toggleModal(e, null)} className="btn btn-primary">
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
                <th className="text-black middle nowrap text-center" width="1%">
                  No
                </th>
                <th className="text-black middle nowrap text-center" width="1%">
                  #
                </th>
                <th className="text-black middle nowrap">Kode</th>
                <th className="text-black middle nowrap">Nama</th>
                <th className="text-black middle nowrap">Telepon</th>
                <th className="text-black middle nowrap">Tipe Customer</th>
                <th className="text-black middle nowrap">Email</th>
                <th className="text-black middle nowrap">Lokasi</th>
                <th className="text-black middle nowrap">Keterangan</th>
                <th className="text-black middle nowrap">Alamat</th>
                <th className="text-black middle nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {typeof data === "object" ? (
                data.map((v, i) => {
                  return (
                    <tr key={i}>
                      <td className="middle nowrap text-center">{generateNo(i, current_page)}</td>
                      <td className="middle nowrap text-center">
                        <UncontrolledButtonDropdown>
                          <DropdownToggle caret></DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem onClick={(e) => this.toggleModal(e, i)}>Edit</DropdownItem>
                            <DropdownItem onClick={(e) => this.handleDelete(e, v.kd_cust)}>Delete</DropdownItem>
                          </DropdownMenu>
                        </UncontrolledButtonDropdown>
                      </td>
                      <td className="middle nowrap">{v.kd_cust}</td>
                      <td className="middle nowrap">{v.nama}</td>
                      <td className="middle nowrap">{v.tlp}</td>
                      <td className="middle nowrap">{v.cust_type}</td>
                      <td className="middle nowrap">{v.email}</td>
                      <td className="middle nowrap">{v.lokasi}</td>
                      <td className="middle nowrap">{v.keterangan}</td>
                      <td className="middle nowrap">{v.alamat}</td>
                      <td className="middle nowrap">{v.status === "1" ? statusQ("success", "Aktif") : statusQ("danger", "Tidak Aktif")}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11}>Tidak ada data Customer.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: "20px", float: "right" }}>
          <Paginationq current_page={current_page} per_page={per_page} total={total} callback={this.handlePageChange.bind(this)} />
        </div>
        {
          // this.props.dataCustomerEdit!==undefined?
          this.props.isOpen && <FormCustomer detail={this.state.detail} dataCustomerEdit={this.props.dataCustomerEdit} dataCustomerTypeAll={this.props.dataCustomerTypeAll} />
          // : <Preloader/>
        }
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
