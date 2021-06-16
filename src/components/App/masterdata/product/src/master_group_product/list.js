import React, { Component } from "react";
import { connect } from "react-redux";
import {
  deleteGroupProduct,
  FetchGroupProduct,
} from "redux/actions/masterdata/group_product/group_product.action";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import { FetchSubDepartmentAll } from "redux/actions/masterdata/department/sub_department.action";
import FormGroupProduct from "components/App/modals/masterdata/group_product/form_group_product";
import Paginationq, { statusQ, generateNo } from "helper";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";

class ListGroupProduct extends Component {
  constructor(props) {
    super(props);
    this.handlesearch = this.handlesearch.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
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

  handlesearch(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    let any = data.get("any");
    this.setState({ any: any });
    this.handleGet(any, 1);
  }

  toggleModal(e) {
    e.preventDefault();
    this.setState({ detail: { kel_brg: "", where: this.state.where } });
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formGroupProduct"));
    this.props.dispatch(FetchSubDepartmentAll());
  }
  handleEdit(
    e,
    kel_brg,
    nm_kel_brg,
    group2,
    margin,
    dis_persen,
    status,
    gambar
  ) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formGroupProduct"));
    this.props.dispatch(FetchSubDepartmentAll());
    this.setState({
      detail: {
        kel_brg: kel_brg,
        nm_kel_brg: nm_kel_brg,
        margin: margin,
        status: status,
        group2: group2,
        dis_persen: dis_persen,
        gambar: gambar,
        where: this.state.where,
      },
    });
  }
  handleDelete(e, i) {
    e.preventDefault();
    this.props.dispatch(deleteGroupProduct(i, this.state.where));
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
                  placeholder="cari berdasarkan nama kelompok barang"
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
                  onClick={(e) => this.toggleModal(e)}
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
                <th
                  className="text-black middle text-center"
                  style={{ width: "1%" }}
                >
                  No
                </th>
                <th
                  className="text-black middle text-center"
                  style={{ width: "1%" }}
                >
                  #
                </th>
                <th className="text-black middle">Nama</th>
                <th className="text-black middle" style={{ width: "15%" }}>
                  Sub departemen
                </th>
                <th className="text-black middle" style={{ width: "10%" }}>
                  Status
                </th>
                <th className="text-black middle" style={{ width: "2%" }}>
                  Gambar
                </th>
              </tr>
            </thead>
            <tbody>
              {typeof data === "object" ? (
                data.map((v, i) => {
                  return (
                    <tr key={i}>
                      <td className="middle">{generateNo(i, current_page)}</td>
                      <td className="middle">
                        {/* Example split danger button */}
                        <div className="btn-group">
                          <UncontrolledButtonDropdown>
                            <DropdownToggle caret>Aksi</DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem
                                onClick={(e) =>
                                  this.handleEdit(
                                    e,
                                    v.kel_brg,
                                    v.nm_kel_brg,
                                    v.group2,
                                    v.margin,
                                    v.dis_persen,
                                    v.status,
                                    "-"
                                  )
                                }
                              >
                                Edit
                              </DropdownItem>
                              <DropdownItem
                                onClick={(e) => this.handleDelete(e, v.kel_brg)}
                              >
                                Delete
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledButtonDropdown>
                        </div>
                      </td>
                      <td className="middle">{v.nm_kel_brg}</td>
                      <td className="middle">{v.subdept}</td>
                      <td className="middle">
                        {v.status === "1"
                          ? statusQ("success", "Aktif")
                          : statusQ("danger", "Tidak Aktif")}
                      </td>
                      <td className="middle">
                        <img
                          src={
                            v.gambar === "-" || v.gambar === ""
                              ? "https://icoconvert.com/images/noimage2.png"
                              : v.gambar
                          }
                          style={{ height: "20px", objectFit: "scale-down" }}
                          alt=""
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5}></td>
                </tr>
              )}
            </tbody>
          </table>
          <div style={{ marginTop: "20px", float: "right" }}>
            <Paginationq
              current_page={current_page}
              per_page={per_page}
              total={total}
              callback={this.handlePageChange.bind(this)}
            />
          </div>
        </div>

        {this.props.isOpen && (
          <FormGroupProduct
            group2={this.props.group2}
            detail={this.state.detail}
            token={this.props.token}
          />
        )}
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
