import React,{Component} from 'react';
import {ModalBody, ModalHeader} from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import {ModalToggle} from "redux/actions/modal.action";
class DetailTransaction extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
    }
    toggle(e){
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        localStorage.removeItem("code");
        localStorage.removeItem("barcode");
        localStorage.removeItem("name");
    };

    render(){
        
        const data = this.props.transactionDetail.detail===undefined?[]:this.props.transactionDetail.detail.data;
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        return (
            <div>
                <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailTransaction"} size="lg" style={{maxWidth: '1600px', width: '100%'}}>
                    <ModalHeader toggle={this.toggle}>Detail Transaction</ModalHeader>
                    <ModalBody>
                        <div className="table-responsive" style={{overflowX: "auto"}}>
                            <table className="table table-hover table-bordered">
                                <thead className="bg-light">
                                <tr>
                                    <th className="text-black" style={columnStyle}>Factur No.</th>
                                    <th className="text-black" style={columnStyle}>Barcode</th>
                                    <th className="text-black" style={columnStyle}>Kode</th>
                                    <th className="text-black" style={columnStyle}>Barang</th>
                                    <th className="text-black" style={columnStyle}>Satuan</th>
                                    <th className="text-black" style={columnStyle}>QTY</th>
                                    <th className="text-black" style={columnStyle}>QTY Retur</th>
                                    <th className="text-black" style={columnStyle}>QTY Diterima</th>
                                    <th className="text-black" style={columnStyle}>Harga Beli</th>
                                    <th className="text-black" style={columnStyle}>Harga Jual</th>
                                </tr>
                                
                                </thead>
                                <tbody>
                                {
                                    (
                                        typeof data === 'object' ? data.length > 0 ?
                                            data.map((v,i)=>{
                                                return (
                                                    <tr key={i}>
                                                        <td style={{textAlign:"right"}}>{v.no_faktur_mutasi}</td>
                                                        <td style={{textAlign:"right"}}>{v.barcode}</td>
                                                        <td style={{textAlign:"right"}}>{v.kd_brg}</td>
                                                        <td style={{textAlign:"right"}}>{v.nm_brg}</td>
                                                        <td style={{textAlign:"right"}}>{v.satuan}</td>
                                                        <td style={{textAlign:"right"}}>{v.qty}</td>
                                                        <td style={{textAlign:"right"}}>{v.qty_retur}</td>
                                                        <td style={{textAlign:"right"}}>{v.qty-v.qty_retur}</td>
                                                        <td style={{textAlign:"right"}}>{v.hrg_beli}</td>
                                                        <td style={{textAlign:"right"}}>{v.hrg_jual}</td>
                                                    </tr>
                                                )
                                            }) : <tr><td colSpan="17">Data Not Available</td></tr> : <tr><td colSpan="17">Data Not Available</td></tr>)
                                }
                                </tbody>
                                
                            </table>
                        </div>
                    </ModalBody>

                </WrapperModal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
        // stockReportDetailTransaction:state.stockReportReducer.dataDetailTransaksi,
        isLoading: state.stockReportReducer.isLoading,
    }
}
// const mapDispatch
export default connect(mapStateToProps)(DetailTransaction);