import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import FormCash from "components/App/modals/masterdata/cash/form_cash";
import Paginationq from "helper";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import { generateNo } from "../../../../../helper";

class ListCash extends Component {
  constructor(props) {
    super(props);
    this.handlesearch = this.handlesearch.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.state = {
      any: "",
      detail: {},
    };
  }
  handleGet(any) {
    this.props.search(any);

    // this.setState({ where: where });
    // this.props.dispatch(FetchCustomer(where));
  }
  handlePageChange(pageNumber) {
    this.props.pagin(pageNumber);
  }
  handlesearch(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    let any = data.get("any");
    this.props.search(any);
  }

  toggleModal(e, i) {
    e.preventDefault();
    let detail = { where: this.props.where, tipe: this.props.type };
    if (i !== null) {
      Object.assign(detail, this.props.data.data[i]);
    } else {
      Object.assign(detail, { id: "" });
    }
    this.setState({
      detail: detail,
    });
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formCash"));
  }
  handleDelete(e, id) {
    e.preventDefault();
    this.props.delete(id);
  }

  render() {
    const toggleModal = this.toggleModal;
    const handleDelete = this.handleDelete;
    const { current_page, data, per_page, total } = this.props.data;

    return (
      <div>
        {/*<HeaderGeneralCommon*/}
        {/*callbackGet={(res) => this.props.search(res)}*/}
        {/*callbackAdd={() => this.toggleModal(null)}*/}
        {/*/>*/}
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

        <div className="row">
          <div className="col-12 col-md-12">
            <div style={{ overflowX: "auto" }}>
              <table className="table table-hover table-noborder">
                <thead className="bg-light">
                  <tr>
                    <th
                      className="text-black text-center middle nowrap"
                      width="1%"
                    >
                      No
                    </th>
                    <th
                      className="text-black text-center middle nowrap"
                      width="1%"
                    >
                      #
                    </th>
                    <th className="text-black middle nowrap" width="5%">
                      Jenis
                    </th>
                    <th className="text-black middle nowrap" width="5%">
                      Tipe
                    </th>
                    <th className="text-black middle nowrap">Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  {typeof data === "object" ? (
                    data.map((v, i) => {
                      return (
                        <tr key={i}>
                          <td className="text-center middle nowrap">
                            {generateNo(i, current_page)}
                          </td>
                          <td className="text-center middle nowrap">
                            <UncontrolledButtonDropdown>
                              <DropdownToggle caret></DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem
                                  onClick={(e) => toggleModal(e, i)}
                                >
                                  Edit
                                </DropdownItem>
                                <DropdownItem
                                  onClick={(e) => handleDelete(e, v.id)}
                                >
                                  Delete
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledButtonDropdown>
                          </td>
                          <td className="middle nowrap">
                            {v.jenis === 0 ? "KAS KECIL" : "KAS BESAR"}
                          </td>
                          <td className="middle nowrap">
                            {v.type === 0 ? "KAS MASUK" : "KAS KELUAR"}
                          </td>
                          <td className="middle nowrap">{v.title}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5}>Tidak ada data.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div style={{ marginTop: "20px", float: "right" }}>
          <Paginationq
            current_page={current_page}
            per_page={per_page}
            total={total}
            callback={(page) => this.handlePageChange(page)}
          />
        </div>
        {this.props.isOpen && <FormCash detail={this.state.detail} />}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
  };
};

export default connect(mapStateToProps)(ListCash);

// export default ListCash;
