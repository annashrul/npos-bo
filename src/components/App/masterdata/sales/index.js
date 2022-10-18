import React, { Component } from "react";
import Layout from "components/App/Layout";
import connect from "react-redux/es/connect/connect";
import {
  deleteSales,
  FetchSales,
} from "redux/actions/masterdata/sales/sales.action";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import FormSales from "components/App/modals/masterdata/sales/form_sales";
import HeaderGeneralCommon from "../../common/HeaderGeneralCommon";
import TableCommon from "../../common/TableCommon";
import { generateNo, noData } from "../../../../helper";
import ButtonActionCommon from "../../common/ButtonActionCommon";
import CompareLocationCommon from "../../common/CompareLocationCommon";
import { statusGeneral } from "../../../../helperStatus";

class Sales extends Component {
  constructor(props) {
    super(props);
    this.handleModal = this.handleModal.bind(this);
    this.state = {
      detail: {},
      any: "",
      where: "",
    };
  }
  componentWillMount() {
    this.handleGet("", 1);
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.auth.user) {
      let access = nextProps.auth.user.access;
      if (access !== undefined && access !== null) {
        if (nextProps.auth.user.access[17]["label"] === "0") {
          alert("bukan halaman kamu");
          this.props.history.push({
            pathname: "/",
            state: { from: this.props.location.pathname },
          });
        }
      }
    }
  };
  handleGet(any, page) {
    let where = `page=${page}`;
    if (any !== "") where += `&q=${any}`;
    this.setState({ where: where });
    this.props.dispatch(FetchSales(where));
  }
  handlePageChange(pageNumber) {
    this.handleGet(this.state.any, pageNumber);
  }
  handleModal(i) {
    if (i === null) {
      this.setState({ detail: undefined });
    } else {
      let detail = { id: "-" };
      Object.assign(this.props.data.data[i], { where: this.state.where });
      Object.assign(detail, this.props.data.data[i]);
      this.setState({ detail: detail });
    }
    this.props.dispatch(ModalToggle(true));
    this.props.dispatch(ModalType("formSales"));
  }

  render() {
    const { total, per_page, current_page, data } = this.props.data;
    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "#", className: "text-center", width: "1%" },
      { label: "Nama" },
      { label: "Lokasi", width: "1%" },
      { label: "Status", width: "1%" },
    ];
    return (
      <Layout page="Sales">
        <HeaderGeneralCommon
          callbackGet={(res) => {
            this.setState({ any: res });
            this.handleGet(res, 1);
          }}
          callbackAdd={() => this.handleModal(null)}
        />
        <TableCommon
          meta={{
            total: total,
            current_page: current_page,
            per_page: per_page,
          }}
          head={head}
          current_page={current_page}
          callbackPage={this.handlePageChange.bind(this)}
          renderRow={
            typeof data === "object"
              ? data.map((v, i) => {
                  return (
                    <tr key={i}>
                      <td className="text-center middle nowrap">
                        {generateNo(i, current_page)}
                      </td>
                      <td className="text-center middle nowrap">
                        <ButtonActionCommon
                          action={[{ label: "Edit" }, { label: "Hapus" }]}
                          callback={(index) => {
                            if (index === 0) this.handleModal(i);
                            if (index === 1)
                              this.props.dispatch(deleteSales(v.kode));
                          }}
                        />
                      </td>
                      <td className="middle nowrap">{v.nama}</td>
                      <td className="middle nowrap">
                        <CompareLocationCommon lokasi={v.lokasi} />
                      </td>
                      <td className="middle nowrap">
                        {statusGeneral(v.status, true)}
                      </td>
                    </tr>
                  );
                })
              : noData(head.length)
          }
        />
        {this.props.isOpen && <FormSales detail={this.state.detail} />}

        {/* <ListSales data={this.props.sales} pagin={this.handlePagin} search={this.handleSearch} token={this.state.token} auth={this.props.auth} /> */}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.salesReducer.data,
    auth: state.auth,
    isOpen: state.modalReducer,
  };
};

export default connect(mapStateToProps)(Sales);
