import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import {
  deleteSupplier,
  FetchSupplier,
} from "redux/actions/masterdata/supplier/supplier.action";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import Paginationq, { statusQ } from "helper";
import FormSupplier from "components/App/modals/masterdata/supplier/form_supplier";
import Swal from "sweetalert2";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import { rmSpaceToStrip } from "../../../../../helper";

class ListSupplier extends Component {
  constructor(props) {
    super(props);
    this.handlesearch = this.handlesearch.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
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
    this.props.dispatch(FetchSupplier(where));
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
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formSupplier"));
    if (i === null) {
      this.setState({ detail: { id: "", where: this.state.where } });
    } else {
      this.setState({
        detail: {
          id: "-",
          where: this.state.where,
          kode: this.props.data.data[i].kode,
          nama: this.props.data.data[i].nama,
          alamat: this.props.data.data[i].alamat,
          kota: this.props.data.data[i].kota,
          telp: this.props.data.data[i].telp,
          penanggung_jawab: this.props.data.data[i].penanggung_jawab,
          no_penanggung_jawab: this.props.data.data[i].no_penanggung_jawab,
          status: this.props.data.data[i].status,
          email: this.props.data.data[i].email,
        },
      });
    }
  }
  handleDelete(e, id) {
    e.preventDefault();
    if (this.props.data.total === 1) {
      this.setState({ any: "" });
    }
    this.props.dispatch(
      deleteSupplier(id, {
        where: this.state.where,
        total: this.props.data.total,
      })
    );
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
                <th
                  className="text-black middle nowrap text-center"
                  width="1%"
                  rowSpan={2}
                >
                  No
                </th>
                <th
                  className="text-black middle nowrap text-center"
                  width="1%"
                  rowSpan={2}
                >
                  #
                </th>
                <th className="text-black middle nowrap" rowSpan={2}>
                  Kode
                </th>
                <th className="text-black middle nowrap" rowSpan={2}>
                  Nama
                </th>
                <th className="text-black middle nowrap" rowSpan={2}>
                  Alamat
                </th>
                <th className="text-black middle nowrap" rowSpan={2}>
                  Kota
                </th>
                <th className="text-black middle nowrap" rowSpan={2}>
                  Telepon
                </th>
                <th
                  className="text-black middle text-center nowrap"
                  colSpan={2}
                >
                  Penaggung jawab
                </th>
                <th className="text-black middle nowrap" rowSpan={2}>
                  Status
                </th>
                <th className="text-black middle nowrap" rowSpan={2}>
                  Email
                </th>
              </tr>
              <tr>
                <th className="text-black middle nowrap">Nama</th>
                <th className="text-black middle nowrap">Telepon</th>
              </tr>
            </thead>
            <tbody>
              {typeof data === "object" ? (
                data.map((v, i) => {
                  return (
                    <tr key={i}>
                      <td className="text-center middle">
                        {i + 1 + 10 * (parseInt(current_page, 10) - 1)}
                      </td>
                      <td className="text-center middle">
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
                      <td className="middle nowrap">
                        {rmSpaceToStrip(v.alamat)}
                      </td>
                      <td className="middle nowrap">
                        {rmSpaceToStrip(v.kota)}
                      </td>
                      <td className="middle nowrap">
                        {rmSpaceToStrip(v.telp)}
                      </td>
                      <td className="middle nowrap">{v.penanggung_jawab}</td>
                      <td className="middle nowrap">{v.no_penanggung_jawab}</td>
                      <td className="middle nowrap">
                        {v.status === "1"
                          ? statusQ("success", "Aktif")
                          : statusQ("danger", "Tidak aktif")}
                      </td>
                      <td className="middle nowrap">
                        {rmSpaceToStrip(v.email)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11}>No data.</td>
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
        <FormSupplier token={this.props.token} detail={this.state.detail} />
      </div>
    );
  }
}

export default connect()(ListSupplier);
