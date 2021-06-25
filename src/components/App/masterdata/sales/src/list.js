import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import {
  deleteSales,
  FetchSales,
} from "redux/actions/masterdata/sales/sales.action";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import Paginationq, { statusQ } from "helper";
import FormSales from "components/App/modals/masterdata/sales/form_sales";
import Swal from "sweetalert2";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import { generateNo } from "../../../../../helper";

class ListSales extends Component {
  constructor(props) {
    super(props);
    this.handlesearch = this.handlesearch.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      detail: {},
      lokasi_data: [],
    };
  }
  handlePageChange(pageNumber) {
    localStorage.setItem("page_sales", pageNumber);
    this.props.dispatch(FetchSales(pageNumber, ""));
  }
  handlesearch(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    let any = data.get("field_any");
    localStorage.setItem("any_sales", any);
    if (any === "" || any === null || any === undefined) {
      this.props.dispatch(FetchSales(1, ""));
    } else {
      this.props.dispatch(FetchSales(1, any));
    }
  }
  toggleModal(e, i) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formSales"));
    if (i === null) {
      this.setState({ detail: undefined });
    } else {
      this.setState({
        detail: {
          nama: this.props.data.data[i].nama,
          status: this.props.data.data[i].status,
          kode: this.props.data.data[i].kode,
          lokasi: this.props.data.data[i].lokasi,
        },
      });
    }
  }
  handleDelete(e, id) {
    e.preventDefault();
    Swal.fire({
      allowOutsideClick: false,
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        this.props.dispatch(deleteSales(id, this.props.token));
      }
    });
  }
  render() {
    const columnStyle = { verticalAlign: "middle", textAlign: "center" };
    const { total, per_page, current_page, data } = this.props.data;
    return (
      <div>
        <form onSubmit={this.handlesearch} noValidate>
          <div className="row">
            <div className="col-10 col-xs-10 col-md-3">
              <div className="form-group">
                <label>Search</label>
                <input
                  type="text"
                  className="form-control"
                  name="field_any"
                  defaultValue={localStorage.getItem("any_sales")}
                />
              </div>
            </div>
            <div className="col-2 col-xs-4 col-md-4">
              <div className="form-group">
                <button
                  style={{ marginTop: "27px", marginRight: "2px" }}
                  type="submit"
                  className="btn btn-primary"
                >
                  <i className="fa fa-search"></i>
                </button>
                <button
                  style={{ marginTop: "27px", marginRight: "2px" }}
                  type="button"
                  onClick={(e) => this.toggleModal(e, null)}
                  className="btn btn-primary"
                >
                  <i className="fa fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className="table-responsive" style={{ overflowX: "auto" }}>
          <table className="table table-hover table-noborder">
            <thead className="bg-light">
              <tr>
                <th className="text-black text-center middle nowrap" width="1%">
                  No
                </th>
                <th className="text-black text-center middle nowrap" width="1%">
                  #
                </th>
                <th className="text-black middle nowrap">Nama</th>
                <th className="text-black middle nowrap">Lokasi</th>
                <th className="text-black middle nowrap">Status</th>
                {/* <th className="text-black" style={columnStyle}>KODE</th> */}
              </tr>
            </thead>
            <tbody>
              {typeof data === "object" ? (
                data.map((v, i) => {
                  let getLok;
                  if (this.props.auth.user.lokasi !== undefined)
                    getLok = this.props.auth.user.lokasi.filter(
                      (item) => item.kode === v.lokasi
                    );
                  return (
                    <tr key={i}>
                      <td className="text-center middle nowrap">
                        {generateNo(i, current_page)}
                      </td>
                      <td className="text-center middle nowrap">
                        {/* Example split danger button */}
                        <div className="btn-group">
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
                        </div>
                      </td>
                      <td className="middle nowrap">{v.nama}</td>
                      <td className="middle nowrap">
                        {getLok === undefined
                          ? "Location Not Found!"
                          : getLok[0].nama}
                      </td>
                      <td className="middle nowrap">
                        {v.status === "1"
                          ? statusQ("success", "Aktif")
                          : statusQ("danger", "Tidak aktif")}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4}>No Data</td>
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
        <FormSales token={this.props.token} detail={this.state.detail} />
      </div>
    );
  }
}

export default connect()(ListSales);
