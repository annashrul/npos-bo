import React,{Component} from 'react';
import {ModalBody, ModalHeader} from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import {toRp} from "helper";
import moment from "moment";
import {FetchApprovalMutation} from "../../../../../../redux/actions/inventory/mutation.action";
class DetailPoReport extends Component{
    constructor(props){
        super(props);

        this.toggle = this.toggle.bind(this);
    }


    toggle(e){
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
    };
    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "poReportDetail"} size="lg">
                <ModalHeader toggle={this.toggle}>Detail Laporan Purchase Order</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="row">
                                <div className="col-sm-4"><b>No. PO</b></div>
                                <div className="col-sm-8"><b> : </b>{this.props.master.no_po}</div>
                                <div className="col-sm-4"><b>Tgl PO</b></div>
                                <div className="col-sm-8"><b> : </b>{this.props.master.tgl_po}</div>
                                <div className="col-sm-4"><b>Tgl Expired</b></div>
                                <div className="col-sm-8"><b> : </b>{this.props.master.tgl_kirim}</div>
                                <div className="col-sm-4"><b>Lokasi</b></div>
                                <div className="col-sm-8"><b> : </b>{this.props.master.lokasi}</div>
                                <div className="col-sm-4"><b>Operator</b></div>
                                <div className="col-sm-8"><b> : </b>{this.props.master.kd_kasir}</div>

                            </div>
                        </div>
                        <div className="col-sm-1"></div>
                        <div className="col-sm-5">
                           <div className="row">
                               <div className="col-sm-4"><b>Supplier</b></div>
                               <div className="col-sm-8"><b> : </b>{this.props.master.nama_supplier}</div>
                               <div className="col-sm-4"><b>Alamat</b></div>
                               <div className="col-sm-8"><b> : </b>{this.props.master.alamat_supplier}</div>
                               <div className="col-sm-4"><b>Telepon</b></div>
                               <div className="col-sm-8"><b> : </b>{this.props.master.telp_supplier}</div>
                               <div className="col-sm-4"><b>Keterangan</b></div>
                               <div className="col-sm-8"><b> : </b>{this.props.master.catatan}</div>

                           </div>
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-md-12">
                            <table className="table table-hover table-bordered">
                                <thead>
                                <tr>
                                    <th className="text-black" style={columnStyle}>Kode Barang</th>
                                    <th className="text-black" style={columnStyle}>Barcode</th>
                                    <th className="text-black" style={columnStyle}>Nama Barang</th>
                                    <th className="text-black" style={columnStyle}>Artikel</th>
                                    <th className="text-black" style={columnStyle}>Satuan</th>
                                    <th className="text-black" style={columnStyle}>Qty</th>
                                    <th className="text-black" style={columnStyle}>Harga Beli</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    typeof this.props.poReportDetail.data==='object'?this.props.poReportDetail.data.length>0?this.props.poReportDetail.data.map((v,i)=>{
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
                                    }):"No data.":"No data"
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
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
    }
}
// const mapDispatch
export default connect(mapStateToProps)(DetailPoReport);