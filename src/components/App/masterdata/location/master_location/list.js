import React, { Component } from "react";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import FormLocation from "components/App/modals/masterdata/location/form_location";
import FormLocationPrompt from "components/App/modals/masterdata/location/form_location_prompt";
import { deleteLocation, FetchAllLocation, FetchDetailLocation, FetchEditLocation, FetchLocation, setEditLocation } from "redux/actions/masterdata/location/location.action";
import Swal from "sweetalert2";
import DetailLocationModal from "components/App/modals/masterdata/location/detail_location";
import Paginationq from "helper";
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
// import { Navigation, Pagination, Scrollbar, A11y } from "swiper";

// import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import "swiper/css/scrollbar";

class ListLocation extends Component {
  constructor(props) {
    super(props);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlesearch = this.handlesearch.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      detail: {},
      isParam: "add",
    };
  }

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber });
    localStorage.setItem("pageLocation", pageNumber);
    this.props.dispatch(FetchLocation(pageNumber, localStorage.getItem("any_location") ? localStorage.getItem("any_location") : ""));
  }

  toggleModal(e) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formLocationPrompt"));
    this.props.dispatch(FetchAllLocation());
    this.props.dispatch(setEditLocation([]));
  }
  handleEdit(e, kode) {
    e.preventDefault();
    this.props.dispatch(FetchAllLocation());
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formLocation"));
    this.props.dispatch(FetchEditLocation(kode));
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
        this.props.dispatch(deleteLocation(id));
      }
    });
  }

  handleDetail(e, kode) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("detailLocationModal"));
    this.props.dispatch(FetchDetailLocation(kode));
  }

  handlesearch(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    let any = data.get("field_any");
    localStorage.setItem("any_location", any);
    if (any !== "" || any !== undefined || any !== null) {
      this.props.dispatch(FetchLocation(1, any));
    } else {
      this.props.dispatch(FetchLocation(1, ""));
    }
  }
  render() {
    const columnStyle = { verticalAlign: "middle", textAlign: "center" };
    const { total, per_page, current_page, data } = this.props.data;
    return (
      <div>
        <form onSubmit={this.handlesearch} noValidate>
          <div className="row">
            <div className="col-8 col-xs-8 col-md-8">
              <div className="form-group">
                <label>Search</label>
                <input type="text" className="form-control" name="field_any" defaultValue={localStorage.getItem("any_location")} />
              </div>
            </div>
            <div className="col-4 col-xs-4 col-md-4">
              <div className="form-group">
                <button style={{ marginTop: "27px", marginRight: "2px" }} type="submit" className="btn btn-primary">
                  <i className="fa fa-search"></i>
                </button>
                <button style={{ marginTop: "27px", marginRight: "2px" }} type="button" onClick={(e) => this.toggleModal(e)} className="btn btn-primary">
                  <i className="fa fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className="table-responsive" style={{ overflowX: "auto" }}>
          <table className="table table-hover table-bordered">
            <thead className="bg-light">
              <tr>
                <th className="text-black" style={columnStyle} rowSpan="2">
                  #
                </th>
                <th className="text-black" style={columnStyle} rowSpan="2">
                  Code
                </th>
                <th className="text-black" style={columnStyle} rowSpan="2">
                  Name
                </th>
                <th className="text-black" style={columnStyle} rowSpan="2">
                  Serial
                </th>
                <th className="text-black" style={columnStyle} rowSpan="2">
                  Category
                </th>
                <th className="text-black" style={columnStyle} rowSpan="2">
                  City
                </th>
              </tr>
            </thead>
            <tbody>
              {typeof data === "object"
                ? data.map((v, i) => {
                    return (
                      <tr key={i}>
                        <td style={columnStyle}>
                          {/* Example split danger button */}
                          <UncontrolledButtonDropdown>
                            <DropdownToggle caret>Aksi</DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem onClick={(e) => this.handleEdit(e, v.kode)}>Edit</DropdownItem>
                              <DropdownItem onClick={(e) => this.handleDetail(e, v.kode)}>Detail</DropdownItem>
                              <DropdownItem onClick={(e) => this.handleDelete(e, v.kode)}>Delete</DropdownItem>
                            </DropdownMenu>
                          </UncontrolledButtonDropdown>
                        </td>
                        <td style={columnStyle}>{v.kode}</td>
                        <td style={columnStyle}>{v.nama_toko}</td>
                        <td style={columnStyle}>{v.serial ? v.serial : "-"}</td>
                        <td style={columnStyle}>{v.lokasi_ktg ? v.lokasi_ktg : "-"}</td>
                        <td style={columnStyle}>{v.kota ? v.kota : "-"}</td>
                      </tr>
                    );
                  })
                : "No data."}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan="12">Total Data = {total}</th>
              </tr>
            </tfoot>
          </table>
        </div>
        <div style={{ marginTop: "20px", float: "right" }}>
          <Paginationq current_page={current_page} per_page={per_page} total={total} callback={this.handlePageChange.bind(this)} />
        </div>

        <FormLocation dataDetailLocation={this.props.dataEditLocation} dataLocation={this.props.dataLocation} dataLocationCategory={this.props.dataLocationCategory} token={this.props.token} />
        <FormLocationPrompt token={this.props.token} />
        <DetailLocationModal dataDetailLocation={this.props.dataDetailLocation} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataLocation: state.locationReducer.allData,
    dataLocationCategory: state.locationCategoryReducer.data,
    isLoading: state.locationReducer.isLoading,
    dataEditLocation: state.locationReducer.edit,
    dataDetailLocation: state.locationReducer.detail,
  };
};
export default connect(mapStateToProps)(ListLocation);
