import React,{Component} from 'react';
import {ModalBody, ModalHeader} from "reactstrap";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import {ModalType} from "redux/actions/modal.action";
import Paginationq from "helper";
import moment from "moment";
import {FetchStockReportDetailTransaction} from "redux/actions/report/inventory/stock_report.action";
class DetailStockReportTransaction extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    handlePageChange(pageNumber){
        localStorage.setItem("page_stock_detail_trx_report",pageNumber);
        this.props.dispatch(FetchStockReportDetailTransaction(pageNumber, this.props.code, this.props.startDate, this.props.endDate, localStorage.getItem("locationDetailTrx")))
    }


    toggle(e){
        e.preventDefault();
        this.props.dispatch(ModalType("detailStockReportSatuan"));

    };

    render(){
        const {data,
            current_page,
            per_page,
            last_page} = this.props.stockReportDetailTransaction;
        const lok = this.props.lok;
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
                            <td className="text-black">: {lok.filter(cat => cat.kode===localStorage.getItem("locationDetailTrx")).map(filteredCat => (
                                                        (filteredCat.nama_toko)
                                                        ))}</td>
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
                                            totStockIn=totStockIn+parseInt(v.stock_in,10);
                                            totStockOut=totStockOut+parseInt(v.stock_out,10);
                                            totQty=totQty+parseInt(v.qty,10);

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
                        <div style={{"marginTop":"20px","float":"right"}}>
                                <Paginationq
                                    current_page={parseInt(current_page,10)}
                                    per_page={parseInt(per_page,10)}
                                    total={parseInt((per_page*last_page),10)}
                                    callback={this.handlePageChange.bind(this)}
                                />
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
        stockReportDetailTransaction: state.stockReportReducer.dataDetailTransaksi,
        isLoading: state.stockReportReducer.isLoading,
    }
}
// const mapDispatch
export default connect(mapStateToProps)(DetailStockReportTransaction);