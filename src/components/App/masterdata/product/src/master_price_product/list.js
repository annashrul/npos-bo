import React, { Component } from "react";
import { toRp } from "helper";
import connect from "react-redux/es/connect/connect";
import { FetchPriceProduct } from "redux/actions/masterdata/price_product/price_product.action";
import { ModalToggle, ModalType } from "redux/actions/modal.action";
import Paginationq from "helper";
import FormPriceProduct from "../../../../modals/masterdata/price_product/form_price_product";
import { toCurrency } from "../../../../../../helper";

class ListPriceProduct extends Component {
  constructor(props) {
    super(props);
    this.handlesearch = this.handlesearch.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleGet = this.handleGet.bind(this);
    this.state = {
      detail: {},
      any: "",
      page: 1,
    };
  }

  handleGet(any, page) {
    let where = `page=${page}`;
    if (any !== "") {
      where += `&q=${any}`;
    }

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
    this.handleGet(any, this.state.page);
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
      detail: {
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
    const centerStyle = {
      whiteSpace: "nowrap",
      verticalAlign: "middle",
      textAlign: "center",
    };
    const leftStyle = {
      whiteSpace: "nowrap",
      verticalAlign: "middle",
      textAlign: "left",
    };
    const rightStyle = {
      verticalAlign: "middle",
      textAlign: "right",
      whiteSpace: "nowrap",
    };
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
                    placeholder="Search"
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
                <th className="text-black middle text-center" rowSpan="2">
                  #
                </th>
                <th className="text-black middle" rowSpan="2">
                  Kode
                </th>
                <th className="text-black middle" rowSpan="2">
                  Barcode
                </th>
                <th className="text-black middle" rowSpan="2">
                  Nama
                </th>
                <th className="text-black middle" rowSpan="2">
                  Lokasi
                </th>
                <th className="text-black middle" rowSpan="2">
                  Harga Beli
                </th>
                <th className="text-black middle text-center" colSpan="4">
                  Harga Jual
                </th>
                <th className="text-black middle" rowSpan="2">
                  PPN
                </th>
                <th className="text-black middle" rowSpan="2">
                  Servis
                </th>
              </tr>
              <tr>
                <th className="text-black middle text-center">1</th>
                <th className="text-black middle text-center">2</th>
                <th className="text-black middle text-center">3</th>
                <th className="text-black middle text-center">4</th>
              </tr>
            </thead>
            <tbody>
              {typeof data === "object"
                ? data.map((v, i) => {
                    return (
                      <tr key={i}>
                        <td>
                          {/* Example split danger button */}
                          <div className="btn-group">
                            <button
                              className="btn btn-primary btn-sm"
                              type="button"
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
                            </button>
                          </div>
                        </td>
                        <td style={leftStyle}>{v.kd_brg}</td>
                        <td style={leftStyle}>{v.barcode ? v.barcode : "-"}</td>
                        <td style={leftStyle}>{v.nm_brg ? v.nm_brg : "-"}</td>
                        <td style={leftStyle}>
                          {v.nama_toko ? v.nama_toko : "-"}
                        </td>
                        <td style={rightStyle}>{toCurrency(v.harga_beli)}</td>
                        <td style={rightStyle}>{toRp(v.harga)}</td>
                        <td style={rightStyle}>{toRp(v.harga2)}</td>
                        <td style={rightStyle}>{toRp(v.harga3)}</td>
                        <td style={rightStyle}>{toRp(v.harga4)}</td>
                        <td style={rightStyle}>{v.ppn}</td>
                        <td style={rightStyle}>{v.service}</td>
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
        <FormPriceProduct detail={this.state.detail} />
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
