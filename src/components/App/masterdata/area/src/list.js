import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import {
  deleteArea,
  FetchArea,
} from "redux/actions/masterdata/area/area.action";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import Paginationq from "helper";
import FormArea from "components/App/modals/masterdata/area/form_area";
import Default from "assets/noimage.png";
import { clearAllMeja } from "../../../../../redux/actions/masterdata/meja/meja.action";
import ButtonActionCommon from "../../../common/ButtonActionCommon";
import HeaderGeneralCommon from "../../../common/HeaderGeneralCommon";
import {swallOption} from "../../../../../helper";

class ListArea extends Component {
  constructor(props) {
    super(props);
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

  toggleModal(i) {
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
  handleDelete(id) {
    this.props.dispatch(deleteArea(id, this.state.where));
  }
  handleClearAllMeja(res) {
    swallOption(`data yang akan dihapus adalah semua data meja di area ${res.nama}`,()=>{
        this.props.dispatch(clearAllMeja(res.id_area));
    });
  }
  render() {
    const { total, per_page, current_page, data } = this.props.data;
    let getImg = Default;

    return (
      <div>
        <HeaderGeneralCommon
            callbackGet={(res) => {
                this.setState({ any: res });
                this.handleGet(res, 1);
            }}
            callbackAdd={() => this.toggleModal(null)}
        />

        <div className="row">
          {typeof data === "object"
            ? data.map((v, i) => {
              return (
                <div className="col-sm-6 col-xl-3" key={i}>
                    <div className="card" style={{borderTop:"5px solid #283593"}}>
                        <div className="card-body">
                            <img
                                style={{alignItems:"center"}}
                                src={v.gambar === null ? "error" : v.gambar}
                                alt="netindo"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `${getImg}`;
                                }}
                            />

                            <hr/>
                            <table className="table">
                                <thead>
                                <tr>
                                    <th className="noPadding noBorder bold">Nama Area</th>
                                    <th className="noPadding noBorder bold">:</th>
                                    <th className="noPadding noBorder bold">{v.nama}</th>
                                    <th className="noPadding noBorder bold">
                                        <ButtonActionCommon
                                            action={[{label:"Edit"},{label:"Hapus Area"},{label:"Hapus Meja"}]}
                                            callback={(e)=>{
                                                if(e===0) this.toggleModal(i);
                                                if(e===1) this.handleDelete(v.id_area);
                                                if(e===2) this.handleClearAllMeja(v.id_area);
                                            }}
                                        />
                                    </th>
                                </tr>
                                <tr>
                                    <th className="noPadding noBorder bold">Lokasi</th>
                                    <th className="noPadding noBorder bold">:</th>
                                    <th className="noPadding noBorder bold">{v.lokasi}</th>
                                </tr>
                                </thead>
                            </table>

                        </div>
                    </div>
                  {/*<div className="single-gallery--item mb-50" style={{backgroundColor:'transparent'}}>*/}
                    {/*<div className="gallery-thumb">*/}
                      {/*<img*/}
                        {/*src={v.gambar === null ? "error" : v.gambar}*/}
                        {/*alt="netindo"*/}
                        {/*onError={(e) => {*/}
                          {/*e.target.onerror = null;*/}
                          {/*e.target.src = `${getImg}`;*/}
                        {/*}}*/}
                      {/*/>*/}
                    {/*</div>*/}
                    {/*<div className="gallery-text-area">*/}
                      {/*<h6 className="text-white font-16 mb-0">*/}
                        {/*Area : {v.nama}*/}
                      {/*</h6>*/}
                      {/*<p className="text-white mb-10">Lokasi : {v.lokasi}</p>*/}
                      {/*<div className="btn-group">*/}
                        {/*<UncontrolledButtonDropdown>*/}
                          {/*<DropdownToggle caret>Aksi</DropdownToggle>*/}
                          {/*<DropdownMenu>*/}
                            {/*<DropdownItem*/}
                              {/*onClick={(e) => {e.preventDefault();this.toggleModal(i)}}*/}
                            {/*>*/}
                              {/*Edit*/}
                            {/*</DropdownItem>*/}
                            {/*<DropdownItem*/}
                              {/*onClick={(e) => {e.preventDefault();this.handleDelete(v.id_area)}}*/}
                            {/*>*/}
                              {/*Delete*/}
                            {/*</DropdownItem>*/}
                            {/*<DropdownItem*/}
                              {/*onClick={(e) =>{e.preventDefault();this.handleClearAllMeja( v.id_area);}}*/}
                            {/*>*/}
                              {/*Delete Meja*/}
                            {/*</DropdownItem>*/}
                          {/*</DropdownMenu>*/}
                        {/*</UncontrolledButtonDropdown>*/}
                      {/*</div>*/}
                    {/*</div>*/}
                  {/*</div>*/}
                </div>
              );
            }) : "No data."}
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
