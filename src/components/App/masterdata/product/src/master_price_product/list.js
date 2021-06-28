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
          rowSpan={[
            { label: "1" },
            { label: "2" },
            { label: "3" },
            { label: "4" },
          ]}
          body={typeof data === "object" && data}
          label={[
            { label: "kd_brg" },
            { label: "barcode" },
            { label: "nm_brg" },
            { label: "nama_toko" },
            { label: "harga_beli", className: "text-right" },
            { label: "harga", className: "text-right" },
            { label: "harga2", className: "text-right" },
            { label: "harga3", className: "text-right" },
            { label: "harga4", className: "text-right" },
            { label: "ppn", className: "text-right" },
            { label: "service", className: "text-right" },
          ]}
          current_page={current_page}
          action={[{ label: "Edit" }]}
          callback={(e, index) => {
            if (e === 0) this.toggleModal(index);
          }}
          callbackPage={this.handlePageChange.bind(this)}
        />

        {/* <div style={{ overflowX: "auto" }}>
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
                      <tr key={i}>
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
        </div> */}
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
