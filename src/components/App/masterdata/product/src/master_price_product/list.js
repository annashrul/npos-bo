import React, { Component } from "react";
import connect from "react-redux/es/connect/connect";
import { FetchPriceProduct } from "redux/actions/masterdata/price_product/price_product.action";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import FormPriceProduct from "../../../../modals/masterdata/price_product/form_price_product";
import HeaderGeneralCommon from "../../../../common/HeaderGeneralCommon";
import TableCommon from "../../../../common/TableCommon";

class ListPriceProduct extends Component {
  constructor(props) {
    super(props);
    this.toggleModal = this.toggleModal.bind(this);
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
    this.props.dispatch(FetchPriceProduct(where));
  }

  handlePageChange(pageNumber) {
    this.handleGet(this.state.any, pageNumber);
  }

  toggleModal(index) {
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formPriceProduct"));
    Object.assign(this.props.data.data[index], { where: this.state.where });
    this.setState({
      detail: this.props.data.data[index],
    });
  }

  render() {
    const { total, per_page, current_page, data } = this.props.data;
    const head = [
      { label: "No", className: "text-center", width: "1%", rowSpan: "2" },
      { label: "#", className: "text-center", width: "1%", rowSpan: "2" },
      { label: "Kode", rowSpan: "2" },
      { label: "Barcode", rowSpan: "2" },
      { label: "Nama", rowSpan: "2" },
      { label: "Lokasi", rowSpan: "2" },
      { label: "Harga beli", rowSpan: "2" },
      { label: "Harga jual", className: "text-center", colSpan: "4" },
      { label: "Ppn (%)", width: "1%", rowSpan: "2" },
      { label: "Servis (%)", rowSpan: "2" },
    ];
    return (
      <div>
        <HeaderGeneralCommon
          callbackGet={(res) => {
            this.setState({ any: res });
            this.handleGet(res, 1);
          }}
        />
        <TableCommon
          meta={{
            total: total,
            current_page: current_page,
            per_page: per_page,
          }}
          head={head}
          rowSpan={[{ label: "1" }, { label: "2" }, { label: "3" }, { label: "4" }]}
          body={typeof data === "object" && data}
          label={[
            { label: "kd_brg" },
            { label: "barcode" },
            { label: "nm_brg" },
            { label: "nama_toko" },
            { label: "harga_beli", className: "text-right", isCurrency: true },
            { label: "harga", className: "text-right", isCurrency: true },
            { label: "harga2", className: "text-right", isCurrency: true },
            { label: "harga3", className: "text-right", isCurrency: true },
            { label: "harga4", className: "text-right", isCurrency: true },
            { label: "ppn", className: "text-right", isCurrency: true },
            { label: "service", className: "text-right", isCurrency: true },
          ]}
          current_page={current_page}
          action={[{ label: "Edit" }]}
          callback={(e, index) => {
            if (e === 0) this.toggleModal(index);
          }}
          callbackPage={this.handlePageChange.bind(this)}
        />
        {this.props.isOpen && (
          <FormPriceProduct
            callback={(id) => {
              this.setState({ isActive: id });
            }}
            detail={this.state.detail}
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
export default connect(mapStateToProps)(ListPriceProduct);
