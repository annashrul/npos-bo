import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import { deleteSales, FetchSales } from "redux/actions/masterdata/sales/sales.action";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import Paginationq, { statusQ } from "helper";
import FormSales from "components/App/modals/masterdata/sales/form_sales";
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
import { generateNo } from "../../../../../helper";

class ListSales extends Component {
  constructor(props) {
    super(props);
    this.handlesearch = this.handlesearch.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      any: "",
      detail: {},
      lokasi_data: [],
    };
  }
  handlePageChange(pageNumber) {
    this.handleService(this.state.any, pageNumber);
  }
  handleService(any, page) {
    let where = `page=${page}`;
    if (any !== "") where += `q=${any}`;
    this.props.dispatch(FetchSales(where));
  }
  handlesearch(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    let any = data.get("any");
    this.handleService(any, 1);
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
    this.props.dispatch(deleteSales(id));
  }
  render() {
    const { total, per_page, current_page, data } = this.props.data;
    return (
      <div className="col-12 box-margin">
        <form onSubmit={this.handlesearch} noValidate>
          <div className="row">
            <div className="col-10 col-xs-10 col-md-3">
              <div className="input-group input-group-sm">
                <input
                  type="search"
                  name="any"
                  className="form-control form-control-sm"
                  placeholder="cari berdasarkan nama"
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
                <th className="text-black text-center middle nowrap" width="1%">
                  No
                </th>
                <th className="text-black text-center middle nowrap" width="1%">
                  #
                </th>
                <th className="text-black middle nowrap">Nama</th>
                <th className="text-black middle nowrap">Lokasi</th>
                <th className="text-black middle nowrap" width="1%">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {typeof data === "object" ? (
                data.map((v, i) => {
                  let getLok;
                  if (this.props.auth.user.lokasi !== undefined) getLok = this.props.auth.user.lokasi.filter((item) => item.kode === v.lokasi);
                  return (
                    <tr key={i}>
                      <td className="text-center middle nowrap">{generateNo(i, current_page)}</td>
                      <td className="text-center middle nowrap">
                        {/* Example split danger button */}
                        <div className="btn-group">
                          <UncontrolledButtonDropdown>
                            <DropdownToggle caret></DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem onClick={(e) => this.toggleModal(e, i)}>Edit</DropdownItem>
                              <DropdownItem onClick={(e) => this.handleDelete(e, v.kode)}>Delete</DropdownItem>
                            </DropdownMenu>
                          </UncontrolledButtonDropdown>
                        </div>
                      </td>
                      <td className="middle nowrap">{v.nama}</td>
                      <td className="middle nowrap">{getLok === undefined ? "Location Not Found!" : getLok[0].nama}</td>
                      <td className="middle nowrap">{v.status === "1" ? statusQ("success", "Aktif") : statusQ("danger", "Tidak aktif")}</td>
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
          <Paginationq current_page={current_page} per_page={per_page} total={total} callback={this.handlePageChange.bind(this)} />
        </div>
        {this.props.isOpen && <FormSales token={this.props.token} detail={this.state.detail} />}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
  };
};
export default connect(mapStateToProps)(ListSales);
