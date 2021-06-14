import React, { Component } from "react";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import {
  readPrinter,
  deletePrinter,
} from "redux/actions/masterdata/printer/printer.action";
import FormPrinter from "../../modals/masterdata/printer/form_printer";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import Paginationq from "helper";
import { ModalToggle, ModalType } from "redux/actions/modal.action";

class Printer extends Component {
  constructor(props) {
    super(props);
    this.handlesearch = this.handlesearch.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      any: "",
      detail: {},
    };
  }
  checkingParam(page = 1) {
    let state = this.state;
    let where = `page=${page}&perpage=10`;
    if (state.any !== "") {
      where += `&q=${state.any}`;
    }
    this.props.dispatch(readPrinter(where));
  }
  componentWillMount() {
    this.checkingParam();
  }
  toggleModal(e, i) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formPrinter"));
    if (i === null) {
      this.setState({ detail: { id_printer: "" } });
    } else {
      this.setState({
        detail: this.props.data.data[i],
      });
    }
  }
  handlesearch() {
    this.checkingParam();
  }
  handlePageChange(i) {
    this.checkingParam(i);
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  handleDelete(e, id) {
    e.preventDefault();
    this.props.dispatch(deletePrinter(id));
  }
  render() {
    const { total, per_page, current_page, data } = this.props.data;

    return (
      <Layout page="Printer">
        <div className="col-12 box-margin">
          <div className="row">
            <div className="col-10 col-xs-10 col-md-3">
              <div className="form-group">
                <label>Search</label>
                <input
                  type="text"
                  className="form-control"
                  name="any"
                  value={this.state.any}
                  onChange={(e) => this.handleChange(e)}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      this.handlesearch();
                    }
                  }}
                />
              </div>
            </div>
            <div className="col-2 col-xs-4 col-md-4">
              <div className="form-group">
                <button
                  style={{ marginTop: "27px", marginRight: "2px" }}
                  type="button"
                  className="btn btn-primary"
                  onClick={this.handlesearch}
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
          <div className="table-responsive" style={{ overflowX: "auto" }}>
            <table className="table table-hover table-bordered">
              <thead className="bg-light">
                <tr>
                  <th className="text-black">#</th>
                  <th className="text-black">Nama</th>
                  <th className="text-black">IP</th>
                  <th className="text-black">Konektor</th>
                  <th className="text-black">Vid</th>
                  <th className="text-black">Pid</th>
                </tr>
              </thead>
              <tbody>
                {typeof data === "object"
                  ? data.map((v, i) => {
                      return (
                        <tr key={i}>
                          <td>
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
                                    onClick={(e) =>
                                      this.handleDelete(e, v.id_printer)
                                    }
                                  >
                                    Delete
                                  </DropdownItem>
                                </DropdownMenu>
                              </UncontrolledButtonDropdown>
                            </div>
                          </td>
                          <td>{v.nama}</td>
                          <td>{`${v.konektor}`.toLowerCase()}</td>
                          <td>{v.ip !== "" ? v.ip : "-"}</td>
                          <td>{v.vid !== "" ? v.vid : "-"}</td>
                          <td>{v.pid !== "" ? v.pid : "-"}</td>
                        </tr>
                      );
                    })
                  : "No data."}
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
          {!this.props.isOpen && <FormPrinter detail={this.state.detail} />}
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.printerReducer.data,
    auth: state.auth,
  };
};

export default connect(mapStateToProps)(Printer);
