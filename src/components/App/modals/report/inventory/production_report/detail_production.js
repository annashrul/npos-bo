import React,{Component} from 'react';
import {ModalBody, ModalHeader} from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import {toRp} from "helper";
class DetailProduction extends Component{
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
        
        const {data} = this.props.productionDetail;
        
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        let t_harga_beli = 0;
        let r_harga_beli = 0;
        let l_harga_beli = 0;
        return (
            <div>
                <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailProduction"} size="lg" style={{maxWidth: '1600px', width: '100%'}}>
                    <ModalHeader toggle={this.toggle}>Detail Production</ModalHeader>
                    <ModalBody>
                        <div className="table-responsive" style={{overflowX: "auto"}}>
                            <table className="table table-hover table-bordered">
                                <thead className="bg-light">
                                <tr>
                                    <th className="text-black" style={columnStyle}>Product Code</th>
                                    <th className="text-black" style={columnStyle}>Code</th>
                                    <th className="text-black" style={columnStyle}>Product Name</th>
                                    <th className="text-black" style={columnStyle}>Barcode</th>
                                    <th className="text-black" style={columnStyle}>Type</th>
                                    <th className="text-black" style={columnStyle}>Qty</th>
                                    <th className="text-black" style={columnStyle}>Buy Price</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    (
                                        typeof data === 'object' ? data.length > 0 ?
                                            data.map((v,i)=>{
                                                t_harga_beli +=parseFloat(v.harga_beli);
                                                return (
                                                    <tr key={i}>
                                                        <td style={{textAlign:"right"}}>{v.kd_produksi}</td>
                                                        <td style={{textAlign:"right"}}>{v.kd_brg}</td>
                                                        <td style={{textAlign:"right"}}>{v.nm_brg}</td>
                                                        <td style={{textAlign:"right"}}>{v.barcode}</td>
                                                        <td style={{textAlign:"right"}}>{v.satuan}</td>
                                                        <td style={{textAlign:"right"}}>{v.qty}</td>
                                                        <td style={{textAlign:"right"}}>{v.harga_beli}</td>
                                                    </tr>
                                                )
                                            }) : <tr><td colSpan="17">Data Not Available</td></tr> : <tr><td colSpan="17">Data Not Available</td></tr>)
                                }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="6">Total</td>
                                        <td style={{textAlign:"right"}}>{t_harga_beli}</td>
                                    </tr>
                                </tfoot>
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
        // stockReportDetailProduction:state.stockReportReducer.dataDetailTransaksi,
        isLoading: state.stockReportReducer.isLoading,
    }
}
// const mapDispatch
export default connect(mapStateToProps)(DetailProduction);