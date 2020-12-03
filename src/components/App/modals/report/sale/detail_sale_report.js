import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalHeader} from "reactstrap";
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import moment from "moment";
import {toRp} from "../../../../../helper";
class DetailSaleReport extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);


    }
    componentDidMount(){
        
    }
    componentWillMount(){
        
    }
    componentWillReceiveProps(nextprops){
        
    }
    toggle(e){
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
    };


    render(){
        
        const {detail} = this.props.detailSale;
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        const leftStyle = {verticalAlign: "middle", textAlign: "left",whiteSpace:"nowrap"};
        const rightStyle = {verticalAlign: "middle", textAlign: "right",whiteSpace:"nowrap"};
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailSaleReport"} size="lg">
                <ModalHeader toggle={this.toggle}>Detail Penjualan {this.props.detailSale.kd_trx}</ModalHeader>
                <ModalBody>
                    <table className="table">
                        <tbody>
                        <tr>
                            <td className="text-black">Tanggal</td>
                            <td className="text-black">: {moment(this.props.detailSale.tgl).format("yyyy-MM-DD")}</td>
                            <td className="text-black">No Nota</td>
                            <td className="text-black">: {this.props.detailSale.kd_trx}</td>
                        </tr>
                        <tr>
                            <td className="text-black">Lokasi</td>
                            <td className="text-black">: {this.props.detailSale.lokasi}</td>
                            <td className="text-black">Operator</td>
                            <td className="text-black">:  {this.props.detailSale.operator}</td>
                        </tr>
                        </tbody>
                    </table>
                    <div style={{overflowX: "auto"}}>
                        <table className="table table-hover">
                            <thead className="bg-light">
                            <tr>
                                <th className="text-black" style={columnStyle}>Barcode</th>
                                <th className="text-black" style={columnStyle}>Nama Barang</th>
                                <th className="text-black" style={columnStyle}>Open Price</th>
                                <th className="text-black" style={columnStyle}>Harga Jual</th>
                                <th className="text-black" style={columnStyle}>Qty</th>
                                <th className="text-black" style={columnStyle}>Diskon</th>
                                <th className="text-black" style={columnStyle}>Subtotal</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                typeof detail === 'object' ? detail.length>0?
                                    detail.map((v,i)=>{
                                        return (
                                            <tr key={i}>
                                                <td style={leftStyle}>{v.sku}</td>
                                                <td style={leftStyle}>{v.nm_brg}</td>
                                                <td style={rightStyle}>{toRp(parseInt(v.open_price,10))}</td>
                                                <td style={rightStyle}>{toRp(parseInt(v.hrg_jual,10))}</td>
                                                <td style={rightStyle}>{v.qty} ({v.satuan})</td>
                                                <td style={rightStyle}>{v.dis_persen}</td>
                                                <td style={rightStyle}>{toRp(parseInt(v.subtotal,10))}</td>
                                            </tr>
                                        );
                                    }) : "No data." : "No data."
                            }
                            </tbody>
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
export default connect(mapStateToProps)(DetailSaleReport);