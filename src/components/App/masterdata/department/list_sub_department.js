import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import {
  deleteSubDepartment,
  FetchSubDepartment,
} from "redux/actions/masterdata/department/sub_department.action";
import FormSubDepartment from "components/App/modals/masterdata/department/form_sub_department";
import { ModalType } from "redux/actions/modal.action";
import { FetchAllDepartment } from "../../../../redux/actions/masterdata/department/department.action";
import TableCommon from "../../common/TableCommon";

class ListSubDepartment extends Component {
  constructor(props) {
    super(props);
    this.toggleModal = this.toggleModal.bind(this);
    this.handlesearch = this.handlesearch.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
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
    this.props.dispatch(FetchSubDepartment(where));
  }

  handlePageChange(pageNumber) {
    this.handleGet(this.state.any, pageNumber);
  }
  handlesearch(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    let any = data.get("any");
    this.handleGet(any, 1);
  }
  toggleModal(index) {
    if (index === null) {
      this.setState({ detail: { id: "" } });
    } else {
      Object.assign(this.props.data.data[index], { where: this.state.where });
      this.setState({
        detail: this.props.data.data[index],
      });
    }
    this.props.dispatch(FetchAllDepartment());

    this.props.dispatch(ModalType("formSubDepartment"));
  }
  handleDelete(index) {
    Object.assign(this.props.data.data[index], { where: this.state.where });
    this.props.dispatch(deleteSubDepartment(this.props.data.data[index]));
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
                  onClick={(e) => this.toggleModal(null)}
                  className="btn btn-primary"
                >
                  <i className="fa fa-plus" />
                </button>
              </div>
            </div>
          </div>
        </form>
        <TableCommon
          head={[
            { label: "No", className: "text-center", width: "1%" },
            { label: "#", className: "text-center", width: "1%" },
            { label: "Kode", width: "1%" },
            { label: "Nama" },
          ]}
          meta={{
            total: total,
            current_page: current_page,
            per_page: per_page,
          }}
          body={typeof data === "object" && data}
          label={[{ label: "kode" }, { label: "nama" }]}
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
        {this.props.isOpen && (
          <FormSubDepartment
            dataDepartment={this.props.dataDepartment}
            detail={this.state.detail}
          />
        )}
      </div>
      // <div className="row">
      //   <div className="col-md-6 offset-3">
      //     <form onSubmit={this.handlesearch} noValidate>
      //       <div className="row">
      //         <div className="col-8 col-xs-8 col-md-6">
      //           <div className="form-group">
      //             <label>Search Sub Department</label>
      //             <input
      //               type="text"
      //               className="form-control"
      //               name="any"
      //               value={this.state.any}
      //               onChange={(e)=>this.setState({any:e.target.value})}
      //             />
      //           </div>
      //         </div>
      //         <div className="col-4 col-xs-4 col-md-4">
      //           <div className="form-group">
      //             <button
      //               style={{ marginTop: "27px", marginRight: "2px" }}
      //               type="submit"
      //               className="btn btn-primary"
      //             >
      //               <i className="fa fa-search"></i>
      //             </button>
      //             <button
      //               style={{ marginTop: "27px", marginRight: "2px" }}
      //               type="button"
      //               onClick={(e) => this.toggleModal(e, null)}
      //               className="btn btn-primary"
      //             >
      //               <i className="fa fa-plus"></i>
      //             </button>
      //           </div>
      //         </div>
      //       </div>
      //     </form>
      //     <div className="table-responsive" style={{ overflowX: "auto" }}>
      //       <table className="table table-hover table-bordered">
      //         <thead className="bg-light">
      //           <tr>
      //             <th className="text-black" style={columnStyle}>
      //               #
      //             </th>
      //             <th className="text-black" style={columnStyle}>
      //               Code
      //             </th>
      //             <th className="text-black" style={columnStyle}>
      //               Name
      //             </th>
      //           </tr>
      //         </thead>
      //         <tbody>
      //           {typeof data === "object" ? (
      //             data.map((v, i) => {
      //               return (
      //                 <tr key={i}>
      //                   <td style={columnStyle}>
      //                     <div className="btn-group">
      //                       <UncontrolledButtonDropdown>
      //                         <DropdownToggle caret>Aksi</DropdownToggle>
      //                         <DropdownMenu>
      //                           <DropdownItem
      //                             onClick={(e) => this.toggleModal(e, i)}
      //                           >
      //                             Edit
      //                           </DropdownItem>
      //                           <DropdownItem
      //                             onClick={(e) => this.handleDelete(e, v.kode)}
      //                           >
      //                             Delete
      //                           </DropdownItem>
      //                         </DropdownMenu>
      //                       </UncontrolledButtonDropdown>
      //                     </div>
      //                   </td>
      //                   <td style={columnStyle}>{v.kode}</td>
      //                   <td style={columnStyle}>{v.nama}</td>
      //                 </tr>
      //               );
      //             })
      //           ) : (
      //             <tr>
      //               <td>No data.</td>
      //             </tr>
      //           )}
      //         </tbody>
      //       </table>
      //     </div>
      //     <div style={{ marginTop: "20px", float: "right" }}>
      //       <Paginationq
      //         current_page={current_page}
      //         per_page={per_page}
      //         total={total}
      //         callback={this.handlePageChange.bind(this)}
      //       />
      //     </div>
      //   </div>
      // <FormSubDepartment
      //   dataDepartment={this.props.dataDepartment}
      //   token={this.props.token}
      //   detail={this.state.detail}
      // />
      // </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    dataDepartment: state.departmentReducer.allData,
  };
};
export default connect(mapStateToProps)(ListSubDepartment);
