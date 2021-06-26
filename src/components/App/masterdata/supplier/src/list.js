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
import TableCommon from "../../../common/TableCommon";

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
  toggleModal(i) {
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formSupplier"));
    if (i === null) {
      this.setState({ detail: { id: "", where: this.state.where } });
    } else {
      let detail = { id: "-" };
      Object.assign(detail, this.props.data.data[i]);
      this.setState({
        detail: detail,
      });
    }
  }
  handleDelete(index) {
    if (this.props.data.total === 1) {
      this.setState({ any: "" });
    }
    this.props.dispatch(
      deleteSupplier(this.props.data.data[index].kode, {
        where: this.state.where,
        total: this.props.data.total,
      })
    );
  }
  render() {
    const { total, per_page, current_page, data } = this.props.data;
    const head = [
      { label: "No", className: "text-center", width: "1%", rowSpan: "2" },
      { label: "#", className: "text-center", width: "1%", rowSpan: "2" },
      { label: "Kode", rowSpan: "2" },
      { label: "Nama", rowSpan: "2" },
      { label: "Alamat", rowSpan: "2" },
      { label: "Kota", rowSpan: "2" },
      { label: "Telepon", rowSpan: "2" },
      { label: "Penanggung jawab", className: "text-center", colSpan: "2" },
      { label: "Status", width: "1%", rowSpan: "2" },
      { label: "Email", rowSpan: "2" },
    ];
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
        <TableCommon
          meta={{
            total: total,
            current_page: current_page,
            per_page: per_page,
          }}
          head={head}
          isRowSpan={true}
          rowSpan={[{ label: "Nama" }, { label: "No" }]}
          body={typeof data === "object" && data}
          label={[
            { label: "kode" },
            { label: "nama" },
            { label: "alamat" },
            { label: "kota" },
            { label: "telp" },
            { label: "penanggung_jawab" },
            { label: "no_penanggung_jawab" },
            { label: "status", isButton: true },
            { label: "email" },
          ]}
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

        <FormSupplier token={this.props.token} detail={this.state.detail} />
      </div>
    );
  }
}

export default connect()(ListSupplier);
