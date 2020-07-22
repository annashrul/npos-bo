import React,{Component} from 'react';
import {ModalBody, ModalHeader} from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import {toRp} from "helper";
class DetailAlokasi extends Component{
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
        console.log("############# STATE SIITU",this.props);
        const {data} = this.props.alokasiDetail;
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        return (
            <div>
                <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailAlokasi"} size="lg" style={{maxWidth: '1600px', width: '100%'}}>
                    <ModalHeader toggle={this.toggle}>Detail Alokasi</ModalHeader>
                    <ModalBody>
                        <div className="table-responsive" style={{overflowX: "auto"}}>
                            <table className="table table-hover table-bordered">
                                <thead className="bg-light">
                                <tr>
                                    <th className="text-black" style={columnStyle} rowSpan="2">#</th>
                                    <th className="text-black" style={columnStyle} rowSpan="2">Factur No.</th>
                                    <th className="text-black" style={columnStyle} colSpan="4">Code</th>
                                    <th className="text-black" style={columnStyle} colSpan="4">Product Name</th>
                                    <th className="text-black" style={columnStyle} rowSpan="2">QTY</th>
                                    <th className="text-black" style={columnStyle} colSpan="4">Buy Price</th>
                                    <th className="text-black" style={columnStyle} colSpan="4">Sell Price</th>
                                    <th className="text-black" style={columnStyle} colSpan="4">Type</th>
                                    <th className="text-black" style={columnStyle} colSpan="4">Barcode</th>
                                </tr>
                                
                                </thead>
                                <tbody>
                                {
                                    (
                                        typeof data === 'object' ? data.length > 0 ?
                                            data.map((v,i)=>{
                                                totPrice1=totPrice1+v.harga;
                                                totPrice2=totPrice2+v.harga2;
                                                totPrice3=totPrice3+v.harga3;
                                                totPrice4=totPrice4+v.harga4;
                                                totFirstStock=totFirstStock+v.stock_awal;
                                                totLastStock=totLastStock+v.stock_akhir;
                                                totStockIn=totStockIn+v.stock_masuk;
                                                totStockOut=totStockOut+v.stock_keluar;
                                                totHpp=totHpp+v.harga_beli;
                                                totProfitPrice1=totProfitPrice1+v.profit_hrg1;
                                                totProfitPrice2=totProfitPrice2+v.profit_hrg2;
                                                totProfitPrice3=totProfitPrice3+v.profit_hrg3;
                                                totProfitPrice4=totProfitPrice4+v.profit_hrg4;
                                                sumTotPrice1=sumTotPrice1+v.total_hrg1;
                                                sumTotPrice2=sumTotPrice2+v.total_hrg2;
                                                sumTotPrice3=sumTotPrice3+v.total_hrg3;
                                                sumTotPrice4=sumTotPrice4+v.total_hrg4;
                                                return (
                                                    <tr key={i}>
                                                        <td style={columnStyle}>{/* Example split danger button */}
                                                            <a className="btn btn-sm btn-primary" href="javascript:void(0)" onClick={(e)=>this.handelDetailTrx(e,v.kd_brg,v.lokasi,v.barcode,v.nm_brg)}>Detail</a>
                                                        </td>
                                                        <td>{v.lokasi}</td>
                                                        <td style={{textAlign:"right"}}>{toRp(v.harga)}</td>
                                                        <td style={{textAlign:"right"}}>{toRp(v.harga2)}</td>
                                                        <td style={{textAlign:"right"}}>{toRp(v.harga3)}</td>
                                                        <td style={{textAlign:"right"}}>{toRp(v.harga4)}</td>
                                                        <td style={{textAlign:"right"}}>{v.stock_awal}</td>
                                                        <td style={{textAlign:"right"}}>{v.stock_masuk}</td>
                                                        <td style={{textAlign:"right"}}>{v.stock_keluar}</td>
                                                        <td style={{textAlign:"right"}}>{v.stock_akhir}</td>
                                                        <td style={{textAlign:"right"}}>{toRp(v.harga_beli)}</td>
                                                        <td style={{textAlign:"right"}}>{toRp(v.profit_hrg1)}</td>
                                                        <td style={{textAlign:"right"}}>{toRp(v.profit_hrg2)}</td>
                                                        <td style={{textAlign:"right"}}>{toRp(v.profit_hrg3)}</td>
                                                        <td style={{textAlign:"right"}}>{toRp(v.profit_hrg4)}</td>
                                                        <td style={{textAlign:"right"}}>{toRp(v.total_hrg1)}</td>
                                                        <td style={{textAlign:"right"}}>{toRp(v.total_hrg2)}</td>
                                                        <td style={{textAlign:"right"}}>{toRp(v.total_hrg3)}</td>
                                                        <td style={{textAlign:"right"}}>{toRp(v.total_hrg4)}</td>
                                                    </tr>
                                                )
                                            }) : <tr><td colSpan="17">Data Not Available</td></tr> : <tr><td colSpan="17">Data Not Available</td></tr>)
                                }
                                </tbody>
                                <tfoot>
                                <tr style={{backgroundColor:"#EEEEEE"}}>
                                    <td colSpan="2">TOTAL</td>
                                    <td colSpan="1" style={{textAlign:"right"}}>{toRp(totPrice1)}</td>
                                    <td colSpan="1" style={{textAlign:"right"}}>{toRp(totPrice2)}</td>
                                    <td colSpan="1" style={{textAlign:"right"}}>{toRp(totPrice3)}</td>
                                    <td colSpan="1" style={{textAlign:"right"}}>{toRp(totPrice4)}</td>
                                    <td colSpan="1" style={{textAlign:"right"}}>{totFirstStock}</td>
                                    <td colSpan="1" style={{textAlign:"right"}}>{totStockIn}</td>
                                    <td colSpan="1" style={{textAlign:"right"}}>{totStockOut}</td>
                                    <td colSpan="1" style={{textAlign:"right"}}>{totLastStock}</td>
                                    <td colSpan="1" style={{textAlign:"right"}}>{toRp(totHpp)}</td>
                                    <td colSpan="1" style={{textAlign:"right"}}>{toRp(totProfitPrice1)}</td>
                                    <td colSpan="1" style={{textAlign:"right"}}>{toRp(totProfitPrice2)}</td>
                                    <td colSpan="1" style={{textAlign:"right"}}>{toRp(totProfitPrice3)}</td>
                                    <td colSpan="1" style={{textAlign:"right"}}>{toRp(totProfitPrice4)}</td>
                                    <td colSpan="1" style={{textAlign:"right"}}>{toRp(sumTotPrice1)}</td>
                                    <td colSpan="1" style={{textAlign:"right"}}>{toRp(sumTotPrice2)}</td>
                                    <td colSpan="1" style={{textAlign:"right"}}>{toRp(sumTotPrice3)}</td>
                                    <td colSpan="1" style={{textAlign:"right"}}>{toRp(sumTotPrice4)}</td>
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
    console.log("mapState", state);
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
        // stockReportDetailTransaction:state.stockReportReducer.dataDetailTransaksi,
        isLoading: state.stockReportReducer.isLoading,
    }
}
// const mapDispatch
export default connect(mapStateToProps)(DetailAlokasi);