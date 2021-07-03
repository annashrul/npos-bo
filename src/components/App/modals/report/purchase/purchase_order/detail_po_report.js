import React, { Component } from "react";
import { ModalBody, ModalHeader } from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import { ModalToggle } from "redux/actions/modal.action";
import HeaderDetailCommon from "../../../../common/HeaderDetailCommon";
import { toDate } from "../../../../../../helper";
import TableCommon from "../../../../common/TableCommon";
import { poReportDetail } from "../../../../../../redux/actions/purchase/purchase_order/po.action";
class DetailPoReport extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
  }

  toggle(e) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
  }
  handlePage(res) {
    console.log(this.props.master);
    this.props.dispatch(poReportDetail(res, this.props.master.no_po));
  }
  render() {
    let master = this.props.master;
    const { total, per_page, current_page, data } = this.props.poReportDetail;
    const head = [
      { label: "No", className: "text-center", width: "1%" },
      { label: "Kode barang", width: "1%" },
      { label: "Barcode", width: "1%" },
      { label: "Nama barang", width: "1%" },
      { label: "Qty", width: "1%" },
      { label: "Harga beli" },
      { label: "Satuan", width: "1%" },
      { label: "Catatan" },
    ];
    return (
      <WrapperModal isOpen={this.props.isOpen && this.props.type === "poReportDetail"} size="lg">
        <ModalHeader toggle={this.toggle}>Detail Laporan Purchase Order</ModalHeader>
        <ModalBody>
          <HeaderDetailCommon
            data={[
              {
                title: "No PO",
                desc: master.no_po,
              },
              {
                title: "Supplier",
                desc: master.nama_supplier,
              },
              {
                title: "Tanggal PO",
                desc: toDate(master.tgl_po),
              },
              {
                title: "Alamat",
                desc: master.alamat_supplier,
              },
              {
                title: "Tanggal Expired",
                desc: toDate(master.tgl_kirim),
              },
              {
                title: "Telepon",
                desc: master.telp_supplier,
              },
              {
                title: "Lokasi",
                desc: master.lokasi,
              },
              {
                title: "Keterangan",
                desc: master.catatan,
              },
              {
                title: "Operator",
                desc: master.kd_kasir,
              },
            ]}
          />

          <TableCommon
            head={head}
            body={typeof data === "object" && data}
            label={[
              { label: "kode_barang" },
              { label: "barcode" },
              { label: "nm_brg" },
              {
                label: "jumlah_beli",
                isCurrency: true,
                className: "text-right",
              },
              {
                label: "harga_beli",
                isCurrency: true,
                className: "text-right",
              },
              { label: "satuan" },
              { label: "deskripsi" },
            ]}
            meta={{
              total: total,
              current_page: current_page,
              per_page: per_page,
            }}
            callbackPage={this.handlePage.bind(this)}
          />

          {/* <div className="row">
            <div className="col-md-12">
              <table className="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th className="text-black" style={columnStyle}>
                      Kode Barang
                    </th>
                    <th className="text-black" style={columnStyle}>
                      Barcode
                    </th>
                    <th className="text-black" style={columnStyle}>
                      Nama Barang
                    </th>
                    <th className="text-black" style={columnStyle}>
                      Artikel
                    </th>
                    <th className="text-black" style={columnStyle}>
                      Satuan
                    </th>
                    <th className="text-black" style={columnStyle}>
                      Qty
                    </th>
                    <th className="text-black" style={columnStyle}>
                      Harga Beli
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {typeof this.props.poReportDetail.data === "object"
                    ? this.props.poReportDetail.data.length > 0
                      ? this.props.poReportDetail.data.map((v, i) => {
                          return (
                            <tr key={i}>
                              <td style={columnStyle}>{v.kode_barang}</td>
                              <td style={columnStyle}>{v.barcode}</td>
                              <td style={columnStyle}>{v.nm_brg}</td>
                              <td style={columnStyle}>{v.deskripsi}</td>
                              <td style={columnStyle}>{v.satuan}</td>
                              <td style={columnStyle}>{v.jumlah_beli}</td>
                              <td style={columnStyle}>{toRp(v.harga_beli)}</td>
                            </tr>
                          );
                        })
                      : "No data."
                    : "No data"}
                </tbody>
              </table>
            </div>
          </div> */}
        </ModalBody>
      </WrapperModal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    // poReportDetail:state.poReducer.poReportDetail,
    // isLoading: state.poReducer.isLoading,
  };
};
// const mapDispatch
export default connect(mapStateToProps)(DetailPoReport);
