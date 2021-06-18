import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import {
  deleteArea,
  FetchArea,
} from "redux/actions/masterdata/area/area.action";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import Paginationq from "helper";
import FormArea from "components/App/modals/masterdata/area/form_area";
import Swal from "sweetalert2";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import Default from "assets/default.png";
import { clearAllMeja } from "../../../../../redux/actions/masterdata/meja/meja.action";

class ListArea extends Component {
  constructor(props) {
    super(props);
    this.handlesearch = this.handlesearch.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      any: "",
      detail: {},
      lokasi_data: [],
      where: "",
    };
  }

  handleGet(any, page) {
    let where = `page=${page}`;
    if (any !== "") where += `&q=${any}`;
    this.setState({ where: where });
    this.props.dispatch(FetchArea(where));
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      lokasi_data: nextProps.auth.user.lokasi,
    });
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
    this.props.dispatch(ModalType("formArea"));
    if (i === null) {
      this.setState({ detail: { id: "" } });
    } else {
      this.setState({
        detail: {
          where: this.state.where,
          lokasi: this.props.data.data[i].lokasi,
          id_lokasi: this.props.data.data[i].id_lokasi,
          nama: this.props.data.data[i].nama,
          gambar: this.props.data.data[i].gambar,
          id: this.props.data.data[i].id_area,
        },
      });
    }
  }
  handleDelete(e, id) {
    this.props.dispatch(deleteArea(id, this.state.where));
  }
  handleClearAllMeja(e, id) {
    e.preventDefault();
    Swal.fire({
      allowOutsideClick: false,
      title: "Informasi !!",
      text: "data yang akan dihapus adalah semua data meja di area ini",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oke",
    }).then((result) => {
      if (result.value) {
        this.props.dispatch(clearAllMeja(id));
      }
    });
  }
  render() {
    const { total, per_page, current_page, data } = this.props.data;
    let getImg = Default;

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
                  placeholder="cari berdasarkan nama area"
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
        <div className="row">
          {typeof data === "object"
            ? data.map((v, i) => {
                return (
                  <div className="col-sm-6 col-xl-3" key={i}>
                    <div className="single-gallery--item mb-50">
                      <div className="gallery-thumb">
                        <img
                          src={v.gambar === null ? "error" : v.gambar}
                          alt="netindo"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `${getImg}`;
                          }}
                        />
                      </div>
                      <div className="gallery-text-area">
                        <h6 className="text-white font-16 mb-0">
                          Area : {v.nama}
                        </h6>
                        <p className="text-white mb-10">Lokasi : {v.lokasi}</p>
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
                                onClick={(e) => this.handleDelete(e, v.id_area)}
                              >
                                Delete
                              </DropdownItem>
                              <DropdownItem
                                onClick={(e) =>
                                  this.handleClearAllMeja(e, v.id_area)
                                }
                              >
                                Delete Meja
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledButtonDropdown>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            : "No data."}
        </div>
        <div style={{ marginTop: "20px", float: "right" }}>
          <Paginationq
            current_page={current_page}
            per_page={per_page}
            total={total}
            callback={this.handlePageChange.bind(this)}
          />
        </div>
        {this.props.isOpen && <FormArea detail={this.state.detail} />}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
  };
};

export default connect(mapStateToProps)(ListArea);
