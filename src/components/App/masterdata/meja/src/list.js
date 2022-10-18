import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import { deleteMeja, FetchMeja } from "redux/actions/masterdata/meja/meja.action";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import FormMeja from "components/App/modals/masterdata/area/form_meja";
import HeaderGeneralCommon from "../../../common/HeaderGeneralCommon";
import TableCommon from "../../../common/TableCommon";

class ListMeja extends Component {
  constructor(props) {
    super(props);
    this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      any: "",
      detail: {},
      where: "",
    };
  }

  handleGet(any, page=1) {
    let where = `page=${page}`;
    if (any !== "") where += `&q=${any}`;
    this.setState({ where: where });
    this.props.dispatch(FetchMeja(where));
  }

  handlePageChange(pageNumber) {
    this.handleGet(this.state.any, pageNumber);
  }

  toggleModal(i) {
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
  handleDelete(i) {
    this.props.dispatch(deleteMeja(this.props.data.data[i].id_meja, this.state.where));
  }
  render() {
    const { total, per_page, current_page, data } = this.props.data;
      const head = [
          { label: "No", className: "text-center", width: "1%" },
          { label: "#", className: "text-center", width: "1%" },
          { label: "Area"},
          { label: "Meja", width: "1%"  },
          { label: "Kapasitas", width: "1%" },
          { label: "Bentuk Meja", width: "1%" },
          { label: "Tinggi", width: "1%" },
          { label: "Lebar", width: "1%" },
      ];
    return (
      <div>
        <HeaderGeneralCommon
            callbackGet={(res) => {
                this.setState({ any: res });
                this.handleGet(res, 1);
            }}
            callbackAdd={() => this.toggleModal(null)}
        />
        <TableCommon
            head={head}
            meta={{
                total: total,
                current_page: current_page,
                per_page: per_page,
            }}
            body={typeof data === "object" && data}
            label={[
                { label: "nama_area" },
                { label: "nama_meja" },
                { label: "kapasitas" },
                { label: "bentuk" },
                { label: "height" },
                { label: "width" },
            ]}
            current_page={current_page}
            action={[{ label: "Edit" }, { label: "Hapus" }]}
            callback={(e, index) => {
                if (e === 0) this.toggleModal(index);
                if (e === 1) this.handleDelete(index);
            }}
            callbackPage={this.handlePageChange.bind(this)}
        />
        {this.props.isOpen && <FormMeja token={this.props.token} detail={this.state.detail} area={this.props.area} />}
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
