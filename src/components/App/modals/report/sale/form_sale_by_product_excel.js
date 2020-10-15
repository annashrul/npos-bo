import React,{Component} from 'react';
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../_wrapper.modal";
import {ModalBody} from "reactstrap";
import {toRp, to_pdf} from 'helper'
import ReactHTMLTableToExcel from "react-html-table-to-excel";
// import jsPDF from 'jspdf';
import imgExcel from 'assets/xls.png';
// import imgPdf from 'assets/pdf.png';
import "jspdf-autotable";
import moment from 'moment'

class SaleByProductReportExcel extends Component{
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
        let stringHtml = '';
        stringHtml+=
        '<div style="text-align:center>'+
        '<h3 align="center"><center>PERIODE : '+this.props.startDate + ' - ' + this.props.endDate+'</center></h3>'+
        '<h3 align="center"><center>LOKASI : '+this.props.location +'</center></h3>'+
        '<h3 align="center"><center>&nbsp;</center></h3>'+
        '<h3 style="text-align:center"><center>LAPORAN PENJUALAN BY BARANG</center></h3>'+
        '</div>';
        
        const headers = [[
            "Kd Barang",
            "Nama",
            "Barcode",
            "Deskripsi",
            "Satuan",
            "Qty",
            "Gross Sales",
            "Diskon Item",
            "Tax",
            "Service",
            "Location",
            "Store",
            "Date",
        ]];
        let data = typeof this.props.sale_by_productReportExcel.data === 'object'?this.props.sale_by_productReportExcel.data.map(v=> [
           v.kd_brg,
           v.nm_brg,
           v.barcode,
           v.deskripsi,
           v.satuan,
           parseInt(v.qty_jual,10),
           toRp(parseInt(v.gross_sales,10)),
           v.diskon_item,
           v.tax,
           v.service,
           v.lokasi,
           v.toko,
           moment(v.tgl).format('YYYY-MM-DD'),
        ]):'';
        // data +=["TOTAL","","","","","","","","",tprice];
        to_pdf(
            "sale_by_product_",
            stringHtml,
            headers,
            data,
            // footer
        );
        this.toggle(e);
      }
    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        // let subtotal=0;
        // let t_harga_beli = 0;
        // let t_qty = 0;
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formSaleByProductExcel"} size={this.state.view === false?'md':'xl'} aria-labelledby="contained-modal-title-vcenter" centered keyboard>
                {/* <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Manage Export":"Update SaleByProductExcel"}</ModalHeader> */}
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
                                        <img src={imgPdf} alt=""></img>
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
                                        <img src={imgExcel} alt=""></img>
                                    </div>
                                    <div className="gallery-text-area">
                                        <div className="gallery-icon" onClick={(e => this.toggle(e))}>
                                            <ReactHTMLTableToExcel
                                                className="btn btn-circle btn-lg btn-success"
                                                table={'laporan_sale_by_product'}
                                                filename={'laporan_sale_by_product'}
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
                        <table className="table table-hover table-bordered table-responsive"  id="laporan_sale_by_product" style={{display:this.state.view === false?'none':'inline-table'}}>
                        <thead className="bg-light">
                                    <tr>
                                        <th className="text-black" colSpan={13}>{this.props.startDate} - {this.props.startDate}</th>
                                    </tr>
                                    <tr>
                                        <th className="text-black" colSpan={13}>{this.props.location===''?'SEMUA LOKASI':this.props.location}</th>
                                    </tr>

                                    <tr>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Kd Barang</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Nama</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Barcode</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Deskripsi</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Satuan</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Qty</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Gross Sales</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Diskon Item</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Tax</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Service</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Location</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Store</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Date</th>
                                    </tr>
                                    <tr></tr>
                                    </thead>
                                    {
                                        <tbody>
                                        {
                                            typeof this.props.sale_by_productReportExcel.data==='object'? this.props.sale_by_productReportExcel.data.length>0?
                                                this.props.sale_by_productReportExcel.data.map((v,i)=>{
                                                    return (
                                                        <tr key={i}>
                                                            <td style={columnStyle}>{v.kd_brg}</td>
                                                            <td style={columnStyle}>{v.nm_brg}</td>
                                                            <td style={columnStyle}>{v.barcode}</td>
                                                            <td style={columnStyle}>{v.deskripsi}</td>
                                                            <td style={columnStyle}>{v.satuan}</td>
                                                            <td style={{textAlign:"right"}}>{parseInt(v.qty_jual,10)}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(parseInt(v.gross_sales,10))}</td>
                                                            <td style={{textAlign:"right"}}>{v.diskon_item}</td>
                                                            <td style={{textAlign:"right"}}>{v.tax}</td>
                                                            <td style={{textAlign:"right"}}>{v.service}</td>
                                                            <td style={columnStyle}>{v.lokasi}</td>
                                                            <td style={columnStyle}>{v.toko}</td>
                                                            <td style={columnStyle}>{moment(v.tgl).format('YYYY-MM-DD')}</td>
                                                        </tr>
                                                    );
                                                }) : "No data." : "No data."
                                        }
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
        sale_by_productReportExcel:state.sale_by_productReducer.report_excel,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(SaleByProductReportExcel);