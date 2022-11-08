import React, { Component } from "react";
import { ModalBody, ModalHeader } from "reactstrap";
import WrapperModal from "../../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import { ModalToggle } from "redux/actions/modal.action";
import { getMargin, noData, parseToRp } from "../../../../../helper";
import HeaderDetailCommon from "../../../common/HeaderDetailCommon";
import TableCommon from "../../../common/TableCommon";
class DetailProduct extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
  }
  toggle(e) {
    e.preventDefault();
    const bool = !this.props.isOpen;
    this.props.dispatch(ModalToggle(bool));
  }
  render() {
    let master = this.props.detail;
    const head = [
      { rowSpan: 2, label: "No", className: "text-center" },
      { rowSpan: 2, label: "Lokasi" },
      { rowSpan: 2, label: "Barcode" },
      { rowSpan: 2, label: "Satuan" },
      { rowSpan: 2, label: "Ppn" },
      { rowSpan: 2, label: "Servis" },
      { rowSpan: 2, label: "Harga beli" },
    ];

    const rowSpans = [];
    let setHarga = this.props.auth.user.set_harga;

    if (setHarga > 1) {
      head.push({ colSpan: setHarga, label: "Harga jual" });
      head.push({ colSpan: setHarga, label: "Margin" });
      for (let i = 0; i < setHarga; i++) {
        rowSpans.push({
          label: this.props.auth.user.nama_harga[i][`harga${i + 1}`],
        });
      }

      for (let i = 0; i < setHarga; i++) {
        rowSpans.push({
          label: this.props.auth.user.nama_harga[i][`harga${i + 1}`],
        });
      }
    } else {
      head.push({ rowSpan: 2, label: "Harga jual" });
      head.push({ rowSpan: 2, label: "Margin" });
    }

    // console.log(head);
    console.log(this.props);

    return (
      <WrapperModal
        isOpen={this.props.isOpen && this.props.type === "detailProduct"}
        size="lg"
      >
        <ModalHeader toggle={this.toggle}>Detail Barang</ModalHeader>
        <ModalBody>
          <HeaderDetailCommon
            md="col-md-5"
            data={[
              { title: "Kode", desc: master.kd_brg },
              { title: "Supplier", desc: master.supplier },
              { title: "Nama", desc: master.nm_brg },
              {
                title: "Jenis",
                desc: master.jenis === "0" ? "TIDAK DIJUAL" : "DIJUAL",
              },
              { title: "Kategori", desc: master.kategori },
              // { title: "dept", desc: master.dept },
              { title: "Kelompok", desc: master.kel_brg },

              { title: "Variasi/Motif", desc: master.ukuran },              // { title: "Sub dept", desc: master.subdept },
              // {
              //   title: "Variasi/Motif",
              //   desc: this.props.dataDetail ? this.props.dataDetail.ukuran : "",
              // },
              
            ]}
          />
          <TableCommon
            head={head}
            rowSpan={rowSpans}
            renderRow={
              typeof this.props.dataDetail.tambahan === "object"
                ? this.props.dataDetail.tambahan.map((v, i) => {
                    // let price = "";
                    // console.log(v.harga);
                    // for (let x = 0; x < setHarga; x++) {
                    //   let valPrice = v[x === 0 ? `harga` : `harga${x + 1}`];
                    //   price = (
                    //     <td className="middle nowrap text-right">
                    //       {parseToRp(valPrice !== undefined ? valPrice : 0)}
                    //     </td>
                    //   );
                    // }

                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">{i + 1}</td>
                        <td className="middle nowrap">{v.lokasi}</td>
                        <td className="middle nowrap">{v.barcode}</td>
                        <td className="middle nowrap">{v.satuan}</td>
                        <td className="middle nowrap text-right">
                          {parseToRp(v.ppn)}
                        </td>
                        <td className="middle nowrap text-right">
                          {parseToRp(v.service)}
                        </td>
                        <td className="middle nowrap text-right">
                          {parseToRp(v.harga_beli)}
                        </td>
                        {(() => {
                          let container = [];
                          for (let x = 0; x < setHarga; x++) {
                            container.push(
                              <td className="middle nowrap text-right" key={x}>
                                {parseToRp(
                                  x === 0 ? v.harga : v[`harga${x + 1}`]
                                )}
                              </td>
                            );
                          }
                          return container;
                        })()}
                        {(() => {
                          let container = [];
                          for (let x = 0; x < setHarga; x++) {
                            let valMargin =
                              x === 0 ? v.harga : v[`harga${x + 1}`];
                            container.push(
                              <td className="middle nowrap text-right" key={x}>
                                {valMargin !== "0"
                                  ? getMargin(valMargin, v.harga_beli, "margin")
                                  : 0}{" "}
                                %
                              </td>
                            );
                          }
                          return container;
                        })()}
                      </tr>
                    );
                  })
                : noData(head.length)
            }
          />
        </ModalBody>
      </WrapperModal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isOpen: state.modalReducer,
    type: state.modalTypeReducer,
    auth: state.auth,
  };
};
// const mapDispatch
export default connect(mapStateToProps)(DetailProduct);
