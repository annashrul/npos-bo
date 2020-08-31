import React,{Component} from 'react';
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import {ModalBody, ModalHeader,ModalFooter} from "reactstrap";
import moment from "moment";
import {rangeDate, toRp, to_pdf,statusQ} from "helper";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import jsPDF from 'jspdf';
import "jspdf-autotable";

class StockReportExcel extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleView = this.handleView.bind(this);
        this.printDocument = this.printDocument.bind(this);
        this.state = {
            title:'',
            jenis: '',
            type:'',
            view:false,
            error:{
                title:'',
                jenis: '',
                type:'',
            }
        };

    }
    handleView = (e) => {
        e.preventDefault();
        this.setState({
            view:!this.state.view
        })
    }
    toggle = (e) => {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
    };
    printDocument = (e) => {
        e.preventDefault();
        let stringHtml = '',tprice=0;
        stringHtml+=
        '<div style="text-align:center>'+
        '<h3 align="center"><center>PERIODE : '+this.props.startDate + ' - ' + this.props.endDate+'</center></h3>'+
        '<h3 align="center"><center>LOKASI : '+this.props.location +'</center></h3>'+
        '<h3 align="center"><center>&nbsp;</center></h3>'+
        '<h3 style="text-align:center"><center>LAPORAN PENJUALAN BY CUST</center></h3>'+
        '</div>';
        
        const headers = [[
            "Kd Cust",
            "Nama",
            "Gross Sales",
            "Diskon Item",
            "Diskon Trx",
            "Service",
            "Qty"
        ]];
        let data = typeof this.props.sale_by_custReportExcel.data === 'object'?this.props.sale_by_custReportExcel.data.map(v=> [
           v.kd_cust,
           v.nama,
           toRp(parseInt(v.gross_sales)),
           toRp(parseInt(v.diskon_item)),
           toRp(parseInt(v.diskon_trx)),
           toRp(v.service),
           v.qty,
        ]):'';
        // data +=["TOTAL","","","","","","","","",tprice];
        to_pdf(
            "sale_by_cust_",
            stringHtml,
            headers,
            data,
            // footer
        );
        this.toggle(e);
      }
    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        const {total_dn,total_stock_awal,total_stock_masuk,total_stock_keluar,total_stock_akhir} = this.props.total_stock;

        let total_dn_per=0;
        let total_first_stock_per=0;
        let total_last_stock_per=0;
        let total_stock_in_per=0;
        let total_stock_out_per=0;
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formStockExcel"} size={this.state.view === false?'md':'xl'} aria-labelledby="contained-modal-title-vcenter" centered keyboard>
                {/* <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Manage Export":"Update StockExcel"}</ModalHeader> */}
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <button type="button" className="close"><span aria-hidden="true" onClick={(e => this.toggle(e))}>×</span><span className="sr-only">Close</span></button>
                        <h3 className="text-center">Manage Export</h3>
                        <div className="row mb-4">
                            {/* <div className="col-4">
                                <button type="button" className="btn btn-info btn-block" onClick={(e => this.handleView(e))}>VIEW</button>
                            </div> */}
                            {/* <div className="col-6">
                                <div className="single-gallery--item">
                                    <div className="gallery-thumb">
                                        <img src="/img/pdf.png" alt=""></img>
                                    </div>
                                    <div className="gallery-text-area">
                                        <div className="gallery-icon">
                                            <button type="button" className="btn btn-circle btn-lg btn-danger" onClick={(e => this.printDocument(e))}><i className="fa fa-print"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            <div className="col-6 offset-3">
                                <div className="single-gallery--item">
                                    <div className="gallery-thumb">
                                        <img src="/img/xls.png" alt=""></img>
                                    </div>
                                    <div className="gallery-text-area">
                                        <div className="gallery-icon" onClick={(e => this.toggle(e))}>
                                            <ReactHTMLTableToExcel
                                                className="btn btn-circle btn-lg btn-success"
                                                table={'laporan_sale_by_cust'}
                                                filename={'laporan_sale_by_cust'}
                                                sheet="kas"
                                                buttonText={<i className="fa fa-print"></i>}>
                                            </ReactHTMLTableToExcel>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="row mt-4">
                            <div className="col-12">
                                <button type="button" className="btn btn-info float-right">CLOSE</button>
                            </div>
                        </div> */}
                        {/* <hr></hr> */}
                        <table className="table table-hover table-bordered table-responsive"  id="laporan_sale_by_cust" style={{display:this.state.view === false?'none':'inline-table'}}>
                        <thead className="bg-light">
                                <tr>
                                    <th className="text-black" colSpan={12}>{this.props.startDate} - {this.props.startDate}</th>
                                </tr>
                                <tr>
                                    <th className="text-black" colSpan={12}>LAPORAN STOCK</th>
                                </tr>

                                <tr>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Kode Barang</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Barcode</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Satuan</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Nama</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Supplier</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Sub Dept</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Kelompok</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Delivery Note</th>
                                    <th className="text-black" colSpan="4" style={columnStyle}>Stok</th>
                                </tr>
                                <tr>
                                    <th className="text-black" rowSpan="1" style={columnStyle}>Awal</th>
                                    <th className="text-black" rowSpan="1" style={columnStyle}>Masuk</th>
                                    <th className="text-black" rowSpan="1" style={columnStyle}>Keluar</th>
                                    <th className="text-black" rowSpan="1" style={columnStyle}>Akhir</th>
                                </tr>
                                </thead>
                                {
                                    <tbody>
                                    {
                                        typeof this.props.stockReportExcel.data==='object'? this.props.stockReportExcel.data.length>0?
                                            this.props.stockReportExcel.data.map((v,i)=>{
                                                const stok_akhir = (parseFloat(v.stock_awal) + parseFloat(v.stock_masuk) - parseFloat(v.stock_keluar));
                                                total_dn_per = total_dn_per+parseInt(v.delivery_note);
                                                total_first_stock_per = total_first_stock_per+parseInt(v.stock_awal);
                                                total_last_stock_per = total_last_stock_per+parseFloat(v.stock_awal)+parseFloat(v.stock_masuk)-parseFloat(v.stock_keluar);
                                                total_last_stock_per = total_last_stock_per + stok_akhir;
                                                total_stock_in_per = total_stock_in_per+parseInt(v.stock_masuk);
                                                total_stock_out_per = total_stock_out_per+parseInt(v.stock_keluar);
                                                return (
                                                    <tr key={i}>
                                                        <td style={columnStyle}>{v.kd_brg}</td>
                                                        <td style={columnStyle}>{v.barcode}</td>
                                                        <td style={columnStyle}>{v.satuan}</td>
                                                        <td style={columnStyle}>{v.nm_brg}</td>
                                                        <td style={columnStyle}>{v.supplier}</td>
                                                        <td style={columnStyle}>{v.sub_dept}</td>
                                                        <td style={columnStyle}>{v.nama_kel}</td>
                                                        <td style={columnStyle}>{v.delivery_note}</td>
                                                        <td style={columnStyle}>{v.stock_awal}</td>
                                                        <td style={columnStyle}>{v.stock_masuk}</td>
                                                        <td style={columnStyle}>{v.stock_keluar}</td>
                                                        {/* <td style={columnStyle}>{parseFloat(v.stock_awal)+parseFloat(v.stock_masuk)-parseFloat(v.stock_keluar)}</td> */}
                                                        <td style={columnStyle}>{stok_akhir}</td>
                                                    </tr>
                                                );
                                            }) : "No data." : "No data."
                                    }
                                    <tfoot>
                                    <tr style={{fontWeight:"bold"}}>
                                        <th colSpan="7">TOTAL PERPAGE</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_dn_per}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_first_stock_per}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_stock_in_per}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_stock_out_per}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_last_stock_per}</th>
                                    </tr>
                                    <tr style={{fontWeight:"bold",backgroundColor:"#EEEEEE"}}>
                                        <th colSpan="7">TOTAL</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_dn!==undefined?total_dn:'0'}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_stock_awal===undefined?0:total_stock_awal}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_stock_masuk===undefined?0:total_stock_masuk}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_stock_keluar===undefined?0:total_stock_keluar}</th>
                                        <th colSpan="1" style={{textAlign:"right"}}>{total_stock_akhir===undefined?0:total_stock_akhir}</th>
                                    </tr>
                                    </tfoot>
                                    </tbody>
                                }
                            </table>
                    </ModalBody>
                </form>
            </WrapperModal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        stockReportExcel:state.stockReportReducer.report_excel,
        total_stock:state.stockReportReducer.total_stock,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(StockReportExcel);