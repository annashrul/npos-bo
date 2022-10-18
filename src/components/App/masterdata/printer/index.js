import React, { Component } from "react";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import { readPrinter, deletePrinter } from "redux/actions/masterdata/printer/printer.action";
import FormPrinter from "../../modals/masterdata/printer/form_printer";
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
import Paginationq from "helper";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import { generateNo, rmSpaceToStrip } from "../../../../helper";
import { testPrinter } from "../../../../redux/actions/masterdata/printer/printer.action";

class Printer extends Component {
  constructor(props) {
    super(props);
    this.handlesearch = this.handlesearch.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      any: "",
      detail: {},
      where: "",
    };
  }
  checkingParam(any, page = 1) {
    let where = `page=${page}&perpage=10`;
    if (any !== "") {
      where += `&q=${any}`;
    }
    this.setState({ where: where });
    this.props.dispatch(readPrinter(where));
  }
  componentWillMount() {
    this.checkingParam("", 1);
  }
  toggleModal(i) {
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formPrinter"));
    if (i === null) {
      this.setState({ detail: { id_printer: "" } });
    } else {
      this.setState({
        detail: Object.assign(this.props.data.data[i], {
          where: this.state.where,
        }),
      });
    }
  }
  handlesearch(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    let any = data.get("any");
    this.setState({ any: any });
    this.checkingParam(any, 1);
  }
  handlePageChange(i) {
    this.checkingParam(this.state.any, i);
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  handleDelete(id) {
    this.props.dispatch(deletePrinter(id, this.state.where));
  }
  handleTestPrint(i) {
    this.props.dispatch(testPrinter(this.props.data.data[i].id_printer));
  }
  render() {
    const { total, per_page, current_page, data } = this.props.data;

    return (
      <Layout page="Printer">
        <div className="col-12 box-margin">
          <form onSubmit={this.handlesearch} noValidate>
            <div className="row">
              <div className="col-10 col-xs-10 col-md-3">
                <div className="input-group input-group-sm">
                  <input
                    type="search"
                    name="any"
                    className="form-control form-control-sm"
                    placeholder="cari berdasarkan nama printer"
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
          {/* <TableCommon
            head={head}
            body={
              typeof data === "object"
                ? data.length > 0
                  ? data.map((res, index) => {
                      return (
                        <tr key={index}>
                          <td className="middle text-center nowrap">
                            {generateNo(index, current_page)}
                          </td>
                          <td className="text-center middle nowrap">
                            <ButtonActionCommon
                              action={[
                                { label: "Edit" },
                                { label: "Test print" },
                                { label: "Hapus" },
                              ]}
                              callback={(e) => {
                                if (e === 0) this.toggleModal(index);
                                if (e === 0) this.handleTestPrint(index);
                                if (e === 0) this.handleDelete(res.id_printer);
                              }}
                            />
                          </td>
                          <td className="middle nowrap">{res.nama} </td>
                          <td className="middle nowrap">
                            {rmSpaceToStrip(res.lokasi)}
                          </td>
                          <td className="middle nowrap">
                            {rmSpaceToStrip(res.paper_size)}
                          </td>

                          <td className="middle nowrap">
                            {`${res.konektor}`.toLowerCase()}
                          </td>
                          <td className="middle nowrap">
                            {rmSpaceToStrip(res.ip)}
                          </td>
                          <td className="middle nowrap">
                            {rmSpaceToStrip(res.vid)}
                          </td>
                          <td className="middle nowrap">
                            {rmSpaceToStrip(res.pid)}
                          </td>
                        </tr>
                      );
                    })
                  : noData(head.length)
                : noData(head.length)
            }
          /> */}
          <div style={{ overflowX: "auto" }}>
            <table className="table table-hover table-noborder">
              <thead className="bg-light">
                <tr>
                  <th className="text-black middle text-center" width="1%">
                    No
                  </th>
                  <th className="text-black middle text-center" width="1%">
                    #
                  </th>
                  <th className="text-black middle">Nama</th>
                  <th className="text-black middle" width="5%">
                    Lokasi
                  </th>
                  <th className="text-black middle" width="10%">
                    Ukuran kertas
                  </th>

                  <th className="text-black middle" width="1%">
                    IP
                  </th>
                  <th className="text-black middle" width="5%">
                    Konektor
                  </th>
                  <th className="text-black middle" width="5%">
                    Vid
                  </th>
                  <th className="text-black middle" width="5%">
                    Pid
                  </th>
                </tr>
              </thead>
              <tbody>
                {typeof data === "object" ? (
                  data.map((v, i) => {
                    return (
                      <tr key={i}>
                        <td className="middle text-center nowrap">{generateNo(i, current_page)}</td>
                        <td className="text-center middle nowrap">
                          <UncontrolledButtonDropdown>
                            <DropdownToggle caret></DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem onClick={(e) => this.toggleModal(e, i)}>Edit</DropdownItem>
                              <DropdownItem onClick={(e) => this.handleTestPrint(e, i)}>Test print</DropdownItem>
                              <DropdownItem onClick={(e) => this.handleDelete(e, v.id_printer)}>Delete</DropdownItem>
                            </DropdownMenu>
                          </UncontrolledButtonDropdown>
                        </td>
                        <td className="middle nowrap">{v.nama} </td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.lokasi)}</td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.paper_size)}</td>

                        <td className="middle nowrap">{rmSpaceToStrip(v.ip)}</td>
                        <td className="middle nowrap">{`${v.konektor}`.toLowerCase()}</td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.vid)}</td>
                        <td className="middle nowrap">{rmSpaceToStrip(v.pid)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7}>Tidak ada data . </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: "20px", float: "right" }}>
            <Paginationq current_page={current_page} per_page={per_page} total={total} callback={this.handlePageChange.bind(this)} />
          </div>
          {this.props.isOpen && <FormPrinter detail={this.state.detail} />}
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    data: state.printerReducer.data,
    auth: state.auth,
    testPrinter: state.printerReducer.testPrinter,
  };
};

export default connect(mapStateToProps)(Printer);
