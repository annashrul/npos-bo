import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import {
  deleteMeja,
  FetchMeja,
} from "redux/actions/masterdata/meja/meja.action";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import Paginationq from "helper";
import FormMeja from "components/App/modals/masterdata/area/form_meja";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import { generateNo } from "../../../../../helper";

class ListMeja extends Component {
  constructor(props) {
    super(props);
    this.handlesearch = this.handlesearch.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      any: "",
      detail: {},
      where: "",
    };
  }

  handleGet(any, page) {
    let where = `page=${page}`;
    if (any !== "") where += `&q=${any}`;
    this.setState({ where: where });
    this.props.dispatch(FetchMeja(where));
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
    this.props.dispatch(ModalType("formMeja"));
    if (i === null) {
      this.setState({ detail: undefined });
    } else {
      this.setState({
        detail: {
          where: this.state.where,
          nama: this.props.data.data[i].nama,
          kapasitas: this.props.data.data[i].kapasitas,
          id_area: this.props.data.data[i].id_area,
          nama_area: this.props.data.data[i].nama_area,
          height: this.props.data.data[i].height,
          width: this.props.data.data[i].width,
          bentuk: this.props.data.data[i].bentuk,
          id: this.props.data.data[i].id_meja,
        },
      });
    }
  }
  handleDelete(e, id) {
    e.preventDefault();
    this.props.dispatch(deleteMeja(id, this.state.where));
  }
  render() {
    const columnStyle = { verticalAlign: "middle", textAlign: "left" };
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
                  placeholder="cari berdasarkan meja"
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
        <div className="table-responsive" style={{ overflowX: "auto" }}>
          <table className="table table-hover table-noborder">
            <thead className="bg-light">
              <tr>
                <th className="text-black text-center middle" width="1%">
                  No
                </th>
                <th className="text-black text-center middle" width="1%">
                  #
                </th>
                {/* <th className="text-black" className="middle">Area</th> */}
                <th className="text-black middle">Area</th>
                <th className="text-black middle" width="5%">
                  Meja
                </th>
                <th className="text-black middle" width="5%">
                  Kapasitas
                </th>
                <th className="text-black middle" width="20%">
                  Bentuk Meja
                </th>
              </tr>
            </thead>
            <tbody>
              {typeof data === "object" ? (
                data.map((v, i) => {
                  return (
                    <tr key={i}>
                      <td className="midde text-center">
                        {generateNo(i, current_page)}
                      </td>
                      <td className="middle">
                        {/* Example split danger button */}
                        <div className="btn-group">
                          <UncontrolledButtonDropdown>
                            <DropdownToggle caret>Aksi</DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem
                                onClick={(e) => this.toggleModal(e, i)}
                              >
                                Edit
                              </DropdownItem>
                              <DropdownItem
                                onClick={(e) => this.handleDelete(e, v.id_meja)}
                              >
                                Delete
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledButtonDropdown>
                        </div>
                      </td>
                      {/* <td className="middle">{v.area}</td> */}
                      <td className="middle">{v.nama_area}</td>
                      <td className="middle">{v.nama_meja}</td>
                      <td className="middle">{v.kapasitas}</td>
                      <td className="middle">{v.bentuk}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6}>No data</td>
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
        {this.props.isOpen && (
          <FormMeja
            token={this.props.token}
            detail={this.state.detail}
            area={this.props.area}
          />
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
  };
};

export default connect(mapStateToProps)(ListMeja);
