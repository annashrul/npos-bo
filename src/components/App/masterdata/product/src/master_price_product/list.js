import React, { Component } from "react";
import { toRp } from "helper";
import connect from "react-redux/es/connect/connect";
import { FetchPriceProduct } from "redux/actions/masterdata/price_product/price_product.action";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import Paginationq from "helper";
import FormPriceProduct from "../../../../modals/masterdata/price_product/form_price_product";
import { generateNo, toCurrency } from "../../../../../../helper";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";

class ListPriceProduct extends Component {
  constructor(props) {
    super(props);
    this.handlesearch = this.handlesearch.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleGet = this.handleGet.bind(this);
    this.state = {
      detail: {},
      isActive: "",
      any: "",
      page: 1,
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
    this.setState({ page: pageNumber });
    this.handleGet(this.state.any, pageNumber);
  }
  handlesearch(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    let any = data.get("field_any");
    this.setState({ any: any });
    this.handleGet(any, 1);
  }
  handleDelete = (e, kode) => {
    e.preventDefault();
  };
  handleEdit = (
    e,
    id,
    harga,
    ppn,
    service,
    harga2,
    harga3,
    harga4,
    harga_beli
  ) => {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
    this.props.dispatch(ModalType("formPriceProduct"));
    this.setState({
      isActive: id,
      detail: {
        where: this.state.where,
        id: id,
        harga: harga,
        ppn: ppn,
        service: harga,
        harga2: harga2,
        harga3: harga3,
        harga4: harga4,
        service: service,
        harga_beli: harga_beli,
      },
    });
  };

  render() {
    console.log(this.state.isActive);

    const {
      total,
      // last_page,
      per_page,
      current_page,
      // from,
      // to,
      data,
    } = this.props.data;
    return (
      <div>
        <form onSubmit={this.handlesearch} noValidate>
          <div className="row">
            <div className="col-10 col-xs-10 col-md-3">
              <div className="form-group">
                <div className="input-group input-group-sm">
                  <input
                    type="text"
                    name="field_any"
                    className="form-control form-control-sm"
                    placeholder="cari berdasarkan nama barang"
                    defaultValue={localStorage.getItem("any_price_product")}
                  />
                  <span className="input-group-append">
                    <button type="submit" className="btn btn-primary">
                      <i className="fa fa-search" />
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </form>
        <div style={{ overflowX: "auto" }}>
          <table className="table table-hover table-noborder">
            <thead className="bg-light">
              <tr>
                <th
                  className="text-black middle nowrap text-center"
                  rowSpan="2"
                >
                  No
                </th>
                <th
                  className="text-black middle nowrap text-center"
                  rowSpan="2"
                >
                  #
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Kode
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Barcode
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Nama
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Lokasi
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Harga beli
                </th>
                <th
                  className="text-black middle nowrap text-center"
                  colSpan="4"
                >
                  Harga jual
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Ppn
                </th>
                <th className="text-black middle nowrap" rowSpan="2">
                  Servis
                </th>
              </tr>
              <tr>
                <th className="text-black middle nowrap text-center">1</th>
                <th className="text-black middle nowrap text-center">2</th>
                <th className="text-black middle nowrap text-center">3</th>
                <th className="text-black middle nowrap text-center">4</th>
              </tr>
            </thead>
            <tbody>
              {typeof data === "object"
                ? data.map((v, i) => {
                    return (
                      <tr
                        key={i}
                        style={{
                          backgroundColor:
                            this.state.isActive === v.id ? "#EEEEEE" : "",
                        }}
                      >
                        <td className="text-center middle nowrap">
                          {generateNo(i, current_page)}
                        </td>
                        <td className="middle text-center nowrap">
                          <UncontrolledButtonDropdown>
                            <DropdownToggle caret></DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem
                                onClick={(e) =>
                                  this.handleEdit(
                                    e,
                                    v.id,
                                    v.harga,
                                    v.ppn,
                                    v.service,
                                    v.harga2,
                                    v.harga3,
                                    v.harga4,
                                    v.harga_beli
                                  )
                                }
                              >
                                Edit
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledButtonDropdown>
                        </td>
                        <td className="text-left middle nowrap">{v.kd_brg}</td>
                        <td className="text-left middle nowrap">
                          {v.barcode ? v.barcode : "-"}
                        </td>
                        <td className="text-left middle nowrap">
                          {v.nm_brg ? v.nm_brg : "-"}
                        </td>
                        <td className="text-left middle nowrap">
                          {v.nama_toko ? v.nama_toko : "-"}
                        </td>
                        <td className="text-right middle nowrap">
                          {toCurrency(v.harga_beli)}
                        </td>
                        <td className="text-right middle nowrap">
                          {toRp(v.harga)}
                        </td>
                        <td className="text-right middle nowrap">
                          {toRp(v.harga2)}
                        </td>
                        <td className="text-right middle nowrap">
                          {toRp(v.harga3)}
                        </td>
                        <td className="text-right middle nowrap">
                          {toRp(v.harga4)}
                        </td>
                        <td className="text-right middle nowrap">{v.ppn} %</td>
                        <td className="text-right middle nowrap">
                          {v.service} %
                        </td>
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
