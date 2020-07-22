import React,{Component} from 'react';
import {ModalBody, ModalHeader} from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import {toRp} from "helper";
import DetailStockReportTransaction from "./detail_stock_report_transaction";
import {FetchStockReportDetailTransaction} from "redux/actions/report/inventory/stock_report.action";
class DetailStockReportSatuan extends Component{
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
    handelDetailTrx(e,code,location,barcode,name){
        e.preventDefault();
        const bool = !this.props.isOpen;
        localStorage.setItem("codeDetailTrx",code);
        localStorage.setItem("locationDetailTrx",location);
        localStorage.setItem("barcodeDetailTrx",barcode);
        localStorage.setItem("nameDetailTrx",name);
        this.props.dispatch(ModalType("detailStockReportTransaction"));
        this.props.dispatch(FetchStockReportDetailTransaction(this.props.token,1,code,'','',localStorage.getItem("locationDetailTrx")))
    };


    render(){
        console.log("############# STATE SIITU",this.props);
        const {data} = this.props.stockReportDetailSatuan;
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        let totPrice1=0;
        let totPrice2=0;
        let totPrice3=0;
        let totPrice4=0;
        let totFirstStock=0;
        let totLastStock=0;
        let totStockIn=0;
        let totStockOut=0;
        let totHpp=0;
        let totProfitPrice1=0;
        let totProfitPrice2=0;
        let totProfitPrice3=0;
        let totProfitPrice4=0;
        let sumTotPrice1=0;
        let sumTotPrice2=0;
        let sumTotPrice3=0;
        let sumTotPrice4=0;
        return (
            <div>
                <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailStockReportSatuan"} size="lg" style={{maxWidth: '1600px', width: '100%'}}>
                    <ModalHeader toggle={this.toggle}>Detail Stock Report Satuan</ModalHeader>
                    <ModalBody>
                        <table className="table">
                            <tbody>
                            <tr>
                                <td className="text-black">Code</td>
                                <td className="text-black">: {localStorage.getItem("code")}</td>
                            </tr>
                            <tr>
                                <td className="text-black">Barcode</td>
                                <td className="text-black">: {localStorage.getItem("barcode")}</td>
                            </tr>
                            <tr>
                                <td className="text-black">Product name</td>
                                <td className="text-black">: {localStorage.getItem("name")}</td>
                            </tr>

                            </tbody>
                        </table>
                        <div className="table-responsive" style={{overflowX: "auto"}}>
                            <table className="table table-hover table-bordered">
                                <thead className="bg-light">
                                <tr>
                                    <th className="text-black" style={columnStyle} rowSpan="2">#</th>
                                    <th className="text-black" style={columnStyle} rowSpan="2">Location</th>
                                    <th className="text-black" style={columnStyle} colSpan="4">PRICE</th>
                                    <th className="text-black" style={columnStyle} colSpan="4">STOCK</th>
                                    <th className="text-black" style={columnStyle} rowSpan="2">HPP</th>
                                    <th className="text-black" style={columnStyle} colSpan="4">PROFIT</th>
                                    <th className="text-black" style={columnStyle} colSpan="4">TOTAL</th>
                                </tr>
                                <tr>
                                    <td className="text-black" style={columnStyle}>1</td>
                                    <td className="text-black" style={columnStyle}>2</td>
                                    <td className="text-black" style={columnStyle}>3</td>
                                    <td className="text-black" style={columnStyle}>4</td>

                                    <td className="text-black" style={columnStyle}>First Stock</td>
                                    <td className="text-black" style={columnStyle}>Stock In</td>
                                    <td className="text-black" style={columnStyle}>Stock Out</td>
                                    <td className="text-black" style={columnStyle}>Last Stock</td>

                                    <td className="text-black" style={columnStyle}>1</td>
                                    <td className="text-black" style={columnStyle}>2</td>
                                    <td className="text-black" style={columnStyle}>3</td>
                                    <td className="text-black" style={columnStyle}>4</td>
                                    <td className="text-black" style={columnStyle}>1</td>
                                    <td className="text-black" style={columnStyle}>2</td>
                                    <td className="text-black" style={columnStyle}>3</td>
                                    <td className="text-black" style={columnStyle}>4</td>
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
                <DetailStockReportTransaction token={this.props.token} stockReportDetailTransaction={this.props.stockReportDetailTransaction}/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    console.log("mapState", state);
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
        stockReportDetailTransaction:state.stockReportReducer.dataDetailTransaksi,
        isLoading: state.stockReportReducer.isLoading,
    }
}
// const mapDispatch
export default connect(mapStateToProps)(DetailStockReportSatuan);