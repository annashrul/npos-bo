import React,{Component} from 'react';
import {ModalBody, ModalHeader} from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import {toRp} from "helper";
import moment from "moment";
class DetailAdjustmentReport extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
    }


    toggle(e){
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(false));
        this.props.dispatch(ModalType("detailAdjustment"));

    };

    render(){
        const {data} = this.props.detail;
        // let totAdjustmentIn=0;
        // let totAdjustmentOut=0;
        // let totQty=0;
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailAdjustment"} size="lg">
                <ModalHeader toggle={this.toggle}>Detail Adjustment Report </ModalHeader>
                <ModalBody>
                    <div className="table-responsive" style={{overflowX: "auto"}}>
                        <table className="table table-hover table-bordered">
                            <thead className="bg-light">
                            <tr>
                                <th className="text-black" style={columnStyle}>Code</th>
                                <th className="text-black" style={columnStyle}>Barcode</th>
                                <th className="text-black" style={columnStyle}>Status</th>
                                <th className="text-black" style={columnStyle}>QTY Adjust</th>
                                <th className="text-black" style={columnStyle}>Saldo Stock</th>
                                <th className="text-black" style={columnStyle}>Last Stock</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                (
                                    typeof data === 'object' ? data.length > 0 ?
                                        data.map((v,i)=>{

                                            return (
                                                <tr key={i}>
                                                    <td style={columnStyle}>{v.kd_trx}</td>
                                                    <td style={{textAlign:"right"}}>{v.brcd_brg}</td>
                                                    <td style={{textAlign:"right"}}>{v.status}</td>
                                                    <td style={{textAlign:"right"}}>{v.qty_adjust}</td>
                                                    <td style={columnStyle}>{v.saldo_stock}</td>
                                                    <td style={columnStyle}>{v.stock_terakhir}</td>
                                                </tr>
                                            )
                                        }) : <tr><td>Data Not Available</td></tr> : <tr><td colSpan="17">Data Not Available</td></tr>)
                            }
                            </tbody>
                            <tfoot>
                            <tr style={{backgroundColor:"#EEEEEE"}}>
                                {/* <td colSpan="2">TOTAL</td>
                                <td colSpan="1" style={{textAlign:"right"}}>{totAdjustmentIn}</td>
                                <td colSpan="1" style={{textAlign:"right"}}>{totAdjustmentOut}</td>
                                <td colSpan="1" style={{textAlign:"right"}}>{totQty}</td>
                                <td colSpan="1"></td> */}
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
        adjustmentDetailTransaction:state.adjustmentReducer.dataDetailTransaksi,
        isLoading: state.adjustmentReducer.isLoading,
    }
}
// const mapDispatch
export default connect(mapStateToProps)(DetailAdjustmentReport);