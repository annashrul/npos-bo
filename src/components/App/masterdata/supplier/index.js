import React, { Component } from "react";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import { FetchSupplier, deleteSupplier } from "redux/actions/masterdata/supplier/supplier.action";

import { ModalToggle, ModalType } from "redux/actions/modal.action";
import FormSupplier from "components/App/modals/masterdata/supplier/form_supplier";
import TableCommon from "../../common/TableCommon";
import HeaderGeneralCommon from "../../common/HeaderGeneralCommon";

class Supplier extends Component {
  constructor(props) {
    super(props);
    this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      detail: {},
      any: "",
      where: "",
    };
  }
  componentWillMount() {
    this.handleGet("", 1);
  }
  handleGet(any, page) {
    let where = `page=${page}`;
    if (any !== "") where += `&q=${any}`;
    this.setState({ where: where });
    this.props.dispatch(FetchSupplier(where));
  }
  handlePageChange(pageNumber) {
    this.handleGet(this.state.any, pageNumber);
  }

  toggleModal(i) {
    if (i === null) {
      this.setState({ detail: { id: "", where: this.state.where } });
    } else {
      let detail = { id: "-" };
      Object.assign(detail, this.props.data.data[i]);
      this.setState({
        detail: detail,
      });
    }
    this.props.dispatch(ModalToggle(true));
    this.props.dispatch(ModalType("formSupplier"));
  }
  handleDelete(index) {
    if (this.props.data.total === 1) {
      this.setState({ any: "" });
    }
    this.props.dispatch(
      deleteSupplier(this.props.data.data[index].kode, {
        where: this.state.where,
        total: this.props.data.total,
      })
    );
  }

  render() {
    const { total, per_page, current_page, data } = this.props.data;
    const head = [
      { label: "No", className: "text-center", width: "1%", rowSpan: "2" },
      { label: "#", className: "text-center", width: "1%", rowSpan: "2" },
      { label: "Kode", rowSpan: "2" },
      { label: "Nama", rowSpan: "2" },
      { label: "Alamat", rowSpan: "2" },
      { label: "Kota", rowSpan: "2" },
      { label: "Telepon", rowSpan: "2" },
      { label: "Bank", rowSpan: "2" },
      { label: "No Rek", rowSpan: "2" },
      { label: "Penanggung jawab", className: "text-center", colSpan: "2" },
      { label: "Status", width: "1%", rowSpan: "2" },
      { label: "Email", rowSpan: "2" },
    ];
    return (
      <Layout page="Supplier">
        <div>
          <HeaderGeneralCommon
            callbackGet={(res) => {
              this.setState({ any: res });
              this.handleGet(res, 1);
            }}
            callbackAdd={() => this.toggleModal(null)}
          />

          <TableCommon
            meta={{
              total: total,
              current_page: current_page,
              per_page: per_page,
            }}
            head={head}
            isRowSpan={true}
            rowSpan={[{ label: "Nama" }, { label: "No" }]}
            body={typeof data === "object" && data}
            label={[
              { label: "kode" },
              { label: "nama" },
              { label: "alamat", isSubstring: true },
              { label: "kota" },
              { label: "telp" },
              { label: "bank" },
              { label: "no_rek" },
              { label: "penanggung_jawab" },
              { label: "no_penanggung_jawab" },
              { label: "status", isStatus: true },
              { label: "email" },
            ]}
            current_page={current_page}
            action={[{ label: "Edit" }, { label: "Hapus" }]}
            callback={(e, index) => {
              if (e === 0) this.toggleModal(index);
              if (e === 1) this.handleDelete(index);
            }}
            callbackPage={this.handlePageChange.bind(this)}
          />

          {this.props.isOpen && <FormSupplier detail={this.state.detail} />}
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.supplierReducer.data,
    auth: state.auth,
    isOpen: state.modalReducer,
  };
};

export default connect(mapStateToProps)(Supplier);
