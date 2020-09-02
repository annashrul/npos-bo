import React,{Component} from 'react';
import {ModalBody, ModalHeader} from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import {ModalToggle} from "redux/actions/modal.action";
import {toRp,getMargin} from "helper";
import Paginationq from "helper";
import {FetchReportDetail} from "redux/actions/purchase/receive/receive.action";
class DetailReceiveReport extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);

    }
    componentWillReceiveProps(nextprops){
        
    }
    handlePageChange(pageNumber){
        this.props.dispatch(FetchReportDetail(pageNumber,localStorage.getItem("kd_trx_detail_receive_report")));

    }
    toggle(e){
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        let que=`detail_receive_report`;
        localStorage.removeItem(`tgl_${que}`);
        localStorage.removeItem(`kd_trx_${que}`);
        localStorage.removeItem(`lokasi_${que}`);
        localStorage.removeItem(`operator_${que}`);
        localStorage.removeItem(`penerima_${que}`);
        localStorage.removeItem(`pelunasan_${que}`);
    };
    render(){
        const {
            total,
            last_page,
            per_page,
            current_page,
            from,
            to,
            data
        } = this.props.receiveReportDetail;
        let que=`detail_receive_report`;
        const columnStyle = {verticalAlign: "middle", textAlign: "center"};

        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "receiveReportDetail"} size="lg" style={{maxWidth: '1600px', width: '100%'}}>
                <ModalHeader toggle={this.toggle}>{"Detail Arsip Pembelian"}</ModalHeader>
                <ModalBody>
                    <table className="table">
                        <thead>
                        <tr>
                            <th className="text-black">Tanggal</th>
                            <td>: {localStorage.getItem(`tgl_${que}`)}</td>
                            <td className="text-black">Operator</td>
                            <td>: {localStorage.getItem(`operator_${que}`)}</td>
                        </tr>
                        <tr>
                            <td className="text-black">No Transaksi</td>
                            <td>: {localStorage.getItem(`kd_trx_${que}`)}</td>
                            <td className="text-black">Penerima</td>
                            <td>: {localStorage.getItem(`penerima_${que}`)}</td>
                        </tr>
                        <tr>
                            <td className="text-black">Lokasi</td>
                            <td>: {localStorage.getItem(`lokasi_${que}`)}</td>
                            <td className="text-black">Pelunasan</td>
                            <td>: {localStorage.getItem(`pelunasan_${que}`)}</td>
                        </tr>

                        </thead>
                    </table>
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead>
                           <tr>
                               <th className="text-black" style={columnStyle} rowSpan={2}>Kode Barang</th>
                               <th className="text-black" style={columnStyle} rowSpan={2}>Nama Barang</th>
                               <th className="text-black" style={columnStyle} rowSpan={2}>Harga Beli</th>
                               <th className="text-black" style={columnStyle} rowSpan={2}>Harga Jual</th>
                               <th className="text-black" style={columnStyle} rowSpan={2}>Margin</th>
                               <th className="text-black" style={columnStyle} colSpan={2}>Diskon (%)</th>
                               <th className="text-black" style={columnStyle} rowSpan={2}>Qty Beli</th>
                               <th className="text-black" style={columnStyle} rowSpan={2}>Qty Bonus</th>
                               <th className="text-black" style={columnStyle} rowSpan={2}>PPN</th>
                               <th className="text-black" style={columnStyle} rowSpan={2}>Subtotal</th>
                           </tr>
                            <tr>
                                <th className="text-black" style={columnStyle}>1</th>
                                <th className="text-black" style={columnStyle}>2</th>

                            </tr>
                            </thead>
                            <tbody>
                            {
                                typeof data==='object'?data.length>0?(
                                    data.map((v,i)=>{
                                        let subtotal=parseInt(v.harga_beli)*parseInt(v.jumlah_beli)-parseInt(v.disc1)-parseInt(v.disc2)+parseInt(v.ppn_item);
                                        return (
                                            <tr>
                                                <td style={columnStyle}>{v.kode_barang}</td>
                                                <td style={columnStyle}>{v.nm_brg}</td>
                                                <td style={{textAlign:"Right"}}>{toRp(v.harga_beli)}</td>
                                                <td style={{textAlign:"Right"}}>{toRp(v.harga_jual)}</td>
                                                <td style={{textAlign:"Right"}}>{getMargin(v.harga_jual,v.harga_beli)}</td>
                                                <td style={{textAlign:"Right"}}>{v.disc1}</td>
                                                <td style={{textAlign:"Right"}}>{v.disc2}</td>
                                                <td style={{textAlign:"Right"}}>{v.jumlah_beli}</td>
                                                <td style={{textAlign:"Right"}}>{v.jumlah_bonus}</td>
                                                <td style={{textAlign:"Right"}}>{v.ppn_item}</td>
                                                <td style={{textAlign:"Right"}}>{toRp(subtotal)}</td>
                                            </tr>
                                        );
                                    })
                                ):"No data.":"No data."
                            }
                            </tbody>
                        </table>
                    </div>
                    <div style={{"marginTop":"20px","float":"right"}}>
                        <Paginationq
                            current_page={parseInt(current_page)}
                            per_page={parseInt(per_page)}
                            total={parseInt(total)}
                            callback={this.handlePageChange.bind(this)}
                        />
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
    }
}
// const mapDispatch
export default connect(mapStateToProps)(DetailReceiveReport);