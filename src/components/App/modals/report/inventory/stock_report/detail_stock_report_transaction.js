import React,{Component} from 'react';
import {ModalBody, ModalHeader} from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import {ModalToggle, ModalType} from "../../../../../actions/modal.action";
import {toRp} from "../../../../../helper";
import moment from "moment";
class DetailStockReportTransaction extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
    }


    toggle(e){
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(false));
        this.props.dispatch(ModalType("detailStockReportTransaction"));

    };

    render(){
        const {data} = this.props.stockReportDetailTransaction;
        let totStockIn=0;
        let totStockOut=0;
        let totQty=0;
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailStockReportTransaction"} size="lg">
                <ModalHeader toggle={this.toggle}>Detail Stock Report Transaction</ModalHeader>
                <ModalBody>
                    <table className="table">
                        <tbody>
                        <tr>
                            <td className="text-black">Location</td>
                            <td className="text-black">: {localStorage.getItem("locationDetailTrx")}</td>
                        </tr>
                        <tr>
                            <td className="text-black">Code</td>
                            <td className="text-black">: {localStorage.getItem("codeDetailTrx")}</td>
                        </tr>
                        <tr>
                            <td className="text-black">Barcode</td>
                            <td className="text-black">: {localStorage.getItem("barcodeDetailTrx")}</td>
                        </tr>
                        <tr>
                            <td className="text-black">Product name</td>
                            <td className="text-black">: {localStorage.getItem("nameDetailTrx")}</td>
                        </tr>
                        </tbody>
                    </table>
                    <div className="table-responsive" style={{overflowX: "auto"}}>
                        <table className="table table-hover table-bordered">
                            <thead className="bg-light">
                            <tr>
                                <th className="text-black" style={columnStyle} rowSpan="2">TRX NO</th>
                                <th className="text-black" style={columnStyle} rowSpan="2">DATE</th>
                                <th className="text-black" style={columnStyle} colSpan="2">STOCK</th>
                                <th className="text-black" style={columnStyle} rowSpan="2">QTY</th>
                                <th className="text-black" style={columnStyle} rowSpan="2">NOTE</th>
                            </tr>
                            <tr>
                                <td className="text-black" style={columnStyle}>IN</td>
                                <td className="text-black" style={columnStyle}>OUT</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                (
                                    typeof data === 'object' ? data.length > 0 ?
                                        data.map((v,i)=>{
                                            totStockIn=totStockIn+parseInt(v.stock_in);
                                            totStockOut=totStockOut+parseInt(v.stock_out);
                                            totQty=totQty+parseInt(v.qty);

                                            return (
                                                <tr key={i}>
                                                    <td style={columnStyle}>{v.kd_trx}</td>
                                                    <td style={columnStyle}>{ moment(v.tgl).format('yyyy-MM-DD')}</td>
                                                    <td style={{textAlign:"right"}}>{v.stock_in}</td>
                                                    <td style={{textAlign:"right"}}>{v.stock_out}</td>
                                                    <td style={{textAlign:"right"}}>{v.qty}</td>
                                                    <td style={columnStyle}>{v.keterangan}</td>
                                                </tr>
                                            )
                                        }) : <tr><td colSpan="6">Data Not Available</td></tr> : <tr><td colSpan="17">Data Not Available</td></tr>)
                            }
                            </tbody>
                            <tfoot>
                            <tr style={{backgroundColor:"#EEEEEE"}}>
                                <td colSpan="2">TOTAL</td>
                                <td colSpan="1" style={{textAlign:"right"}}>{totStockIn}</td>
                                <td colSpan="1" style={{textAlign:"right"}}>{totStockOut}</td>
                                <td colSpan="1" style={{textAlign:"right"}}>{totQty}</td>
                                <td colSpan="1"></td>
                            </tr>
                            </tfoot>
                        </table>
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
export default connect(mapStateToProps)(DetailStockReportTransaction);