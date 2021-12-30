import React, { Component } from "react";
import { ModalBody, ModalHeader } from "reactstrap";
import WrapperModal from "../../_wrapper.modal";
import connect from "react-redux/es/connect/connect";
import { ModalToggle } from "redux/actions/modal.action";
import { getMargin, noData, parseToRp, toRp } from "../../../../../helper";
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
    const rowSpan = [];
    let setHarga=this.props.auth.user.set_harga;
    if(setHarga > 1){
      head.push({colSpan: setHarga, label: "Harga jual"});
      head.push({colSpan: setHarga, label: "Margin"});
      for(let i=0;i<setHarga;i++){
        rowSpan.push({label: this.props.auth.user.nama_harga[`harga${i+1}`]});
      }
      for(let i=0;i<setHarga;i++){
        rowSpan.push({label: this.props.auth.user.nama_harga[`harga${i+1}`]});
      }
    }else{
      head.push({rowSpan: 2,label: "Harga jual"})
      head.push({rowSpan: 2,label: "Margin"})
    }
    
    return (
      <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailProduct"} size="lg">
        <ModalHeader toggle={this.toggle}>Detail Barang</ModalHeader>
        <ModalBody>
          <HeaderDetailCommon
            md="col-md-5"
            data={[
              { title: "Kode", desc: master.kd_brg },
              { title: "Supplier", desc: master.supplier },
              { title: "Nama", desc: master.nm_brg },
              { title: "Jenis", desc: master.jenis === "0" ? "TIDAK DIJUAL" : "DIJUAL" },
              { title: "Kategori", desc: master.kategori },
              { title: "dept", desc: master.dept },
              { title: "Kelompok", desc: master.kel_brg },
              { title: "Sub dept", desc: master.subdept },
            ]}
          />
          <TableCommon
            head={head}
            rowSpan={rowSpan}
            renderRow={
              typeof this.props.dataDetail.tambahan === "object"
                ? this.props.dataDetail.tambahan.map((v, i) => {
                    return (
                      <tr key={i}>
                        <td className="middle nowrap text-center">{i + 1}</td>
                        <td className="middle nowrap">{v.lokasi}</td>
                        <td className="middle nowrap">{v.barcode}</td>
                        <td className="middle nowrap">{v.satuan}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.ppn)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.service)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.harga_beli)}</td>
                        <td className="middle nowrap text-right">{parseToRp(v.harga)}</td>
                        {setHarga>1&&<td className="middle nowrap text-right">{parseToRp(v.harga2)}</td>}
                        {setHarga>2&&<td className="middle nowrap text-right">{parseToRp(v.harga3)}</td>}
                        {setHarga>3&&<td className="middle nowrap text-right">{parseToRp(v.harga4)}</td>}
                        <td className="middle nowrap text-right">{parseToRp(v.harga !== "0" ? getMargin(v.harga, v.harga_beli) : "0")}</td>
                        {setHarga>1&&<td className="middle nowrap text-right">{parseToRp(v.harga2 !== "0" ? getMargin(v.harga2, v.harga_beli) : "0")}</td>}
                        {setHarga>2&&<td className="middle nowrap text-right">{parseToRp(v.harga3 !== "0" ? getMargin(v.harga3, v.harga_beli) : "0")}</td>}
                        {setHarga>3&&<td className="middle nowrap text-right">{parseToRp(v.harga4 !== "0" ? getMargin(v.harga4, v.harga_beli) : "0")}</td>}
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
