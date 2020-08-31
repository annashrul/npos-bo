import React,{Component} from 'react';
import {ModalBody, ModalHeader} from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import {toRp} from "helper";
class DetailOpname extends Component{
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
        
        const {data} = this.props.opnameDetail;
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        return (
            <div>
                <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailOpname"} size="lg" style={{maxWidth: '1600px', width: '100%'}}>
                    <ModalHeader toggle={this.toggle}>Detail Opname</ModalHeader>
                    <ModalBody>
                        <div className="table-responsive" style={{overflowX: "auto"}}>
                            <table className="table table-hover table-bordered">
                                <thead className="bg-light">
                                <tr>
                                    <th className="text-black" style={columnStyle}>Factur No.</th>
                                    <th className="text-black" style={columnStyle}>Code</th>
                                    <th className="text-black" style={columnStyle}>Product Name</th>
                                    <th className="text-black" style={columnStyle}>QTY</th>
                                    <th className="text-black" style={columnStyle}>Buy Price</th>
                                    <th className="text-black" style={columnStyle}>Sell Price</th>
                                    <th className="text-black" style={columnStyle}>Type</th>
                                    <th className="text-black" style={columnStyle}>Barcode</th>
                                </tr>
                                
                                </thead>
                                <tbody>
                                {
                                    (
                                        typeof data === 'object' ? data.length > 0 ?
                                            data.map((v,i)=>{
                                                return (
                                                    <tr key={i}>

                                                                {/* "no_faktur_mutasi": "MC-2006190001-2",
                                                                        "kd_brg": "010000003",
                                                                        "qty": "10",
                                                                        "hrg_beli": "170000",
                                                                        "hrg_jual": "180000",
                                                                        "barcode": "123123123",
                                                                        "satuan": "Karton",
                                                                        "nm_brg": "seprit orange" */}
                                                        <td style={{textAlign:"right"}}>{v.no_faktur_mutasi}</td>
                                                        <td style={{textAlign:"right"}}>{v.kd_brg}</td>
                                                        <td style={{textAlign:"right"}}>{v.nm_brg}</td>
                                                        <td style={{textAlign:"right"}}>{v.qty}</td>
                                                        <td style={{textAlign:"right"}}>{v.hrg_beli}</td>
                                                        <td style={{textAlign:"right"}}>{v.hrg_jual}</td>
                                                        <td style={{textAlign:"right"}}>{v.satuan}</td>
                                                        <td style={{textAlign:"right"}}>{v.barcode}</td>
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
export default connect(mapStateToProps)(DetailOpname);