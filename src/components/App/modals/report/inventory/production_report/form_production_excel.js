import React,{Component} from 'react';
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import {ModalBody} from "reactstrap";
import moment from "moment";
import {to_pdf,statusQ} from "helper";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
// import jsPDF from 'jspdf';
import imgExcel from 'assets/xls.png';
import imgPdf from 'assets/pdf.png';
import "jspdf-autotable";

class ProductionReportExcel extends Component{
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
        '<h3 align="center"><center>&nbsp;</center></h3>'+
        '<h3 style="text-align:center"><center>LAPORAN PRODUKSI</center></h3>'+
        '</div>';
        
        const headers = [[
            "Kode Produksi",
            "Tanggal",
            "Nama Brg",
            "Operator",
            "Lokasi",
            "Nama Toko",
            "QTYy Estimasi",
            "HPP",
            "Status",
            "Keterangan"
        ]];
        let data = typeof this.props.productionReportExcel.data === 'object'?this.props.productionReportExcel.data.map(v=> [
           v.kd_produksi,
           moment(v.tanggal).format("DD-MM-YYYY"),
           v.nm_brg,
           v.operator,
           v.lokasi,
           v.nama_toko,
           v.qty_estimasi,
           parseInt(v.hpp,10),
           v.status===0?'Not Approved':(v.status===1?'Aproved':""),
           v.keterangan
        ]):'';
        // data +=["TOTAL","","","","","","","","",tprice];
        to_pdf(
            "produksi_",
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
        let t_harga_beli = 0;
        let t_qty = 0;
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formProductionExcel"} size={this.state.view === false?'md':'xl'} aria-labelledby="contained-modal-title-vcenter" centered keyboard>
                {/* <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Manage Export":"Update ProductionExcel"}</ModalHeader> */}
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <button type="button" className="close"><span className="text-dark" aria-hidden="true" onClick={(e => this.toggle(e))}>×</span><span className="sr-only">Close</span></button>
                        <h3 className="text-center">Manage Export</h3>
                        <div className="row mb-4">
                            {/* <div className="col-4">
                                <button type="button" className="btn btn-info btn-block" onClick={(e => this.handleView(e))}>VIEW</button>
                            </div> */}
                            <div className="col-6">
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
                            </div>
                            <div className="col-6">
                                <div className="single-gallery--item">
                                    <div className="gallery-thumb">
                                        <img src={imgExcel} alt=""></img>
                                    </div>
                                    <div className="gallery-text-area">
                                        <div className="gallery-icon" onClick={(e => this.toggle(e))}>
                                            <ReactHTMLTableToExcel
                                                className="btn btn-circle btn-lg btn-success"
                                                table={'laporan_production'}
                                                filename={'laporan_production'}
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
                        <table className="table table-hover table-bordered table-responsive"  id="laporan_production" style={{display:this.state.view === false?'none':'inline-table'}}>
                            <thead className="bg-light">
                                <tr>
                                    <th className="text-black" colSpan={10}>{this.props.startDate} - {this.props.startDate}</th>
                                </tr>
                                <tr>
                                    <th className="text-black" colSpan={10}>LAPORAN PRODUCTION</th>
                                </tr>

                                <tr>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Kode Produksi</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Tanggal</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Nama Barang</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Operator</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Lokasi</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Nama Toko</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Qty Estimasi</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>HPP</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Status</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Keterangan</th>
                                </tr>
                                <tr></tr>
                                </thead>
                                {
                                    <tbody>
                                    {
                                        typeof this.props.productionReportExcel.data==='object'? this.props.productionReportExcel.data.length>0?
                                            this.props.productionReportExcel.data.map((v,i)=>{
                                                t_harga_beli +=parseFloat(v.hpp);
                                                t_qty +=parseFloat(v.qty_estimasi);
                                                return (
                                                    <tr key={i}>
                                                        <td style={columnStyle}>{v.kd_produksi}</td>
                                                        <td style={columnStyle}>{moment(v.tanggal).format("DD-MM-YYYY")}</td>
                                                        <td style={columnStyle}>{v.nm_brg}</td>
                                                        <td style={columnStyle}>{v.operator}</td>
                                                        <td style={columnStyle}>{v.lokasi}</td>
                                                        <td style={columnStyle}>{v.nama_toko}</td>
                                                        <td style={columnStyle}>{v.qty_estimasi}</td>
                                                        <td style={columnStyle}>{parseInt(v.hpp,10)}</td>
                                                        <td style={columnStyle}>{v.status===0?statusQ('info','Not Approved'):(v.status===1?statusQ('success','Aproved'):"")}</td>
                                                        <td style={columnStyle}>{v.keterangan}</td>
                                                    </tr>
                                                );
                                            }) : "No data." : "No data."
                                    }
                                    <tfoot>
                                        <tr>
                                            <td style={columnStyle} colSpan="6">Total</td>
                                            <td style={columnStyle}>{t_qty}</td>
                                            <td style={columnStyle}>{t_harga_beli}</td>
                                        </tr>
                                        <tr>
                                            <td style={columnStyle} colSpan="6">Rata - rata</td>
                                            <td style={columnStyle}>{parseInt(parseInt(t_qty,10)/parseInt(typeof this.props.productionReportExcel.data === 'object' ? this.props.productionReportExcel.data.length > 0 ? this.props.productionReportExcel.data.length : 0 : 0,10),10)}</td>
                                            <td style={columnStyle}>{parseInt(parseInt(t_harga_beli,10)/parseInt(typeof this.props.productionReportExcel.data === 'object' ? this.props.productionReportExcel.data.length > 0 ? this.props.productionReportExcel.data.length : 0 : 0,10),10)}</td>
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
        productionReportExcel:state.produksiReducer.report_excel,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(ProductionReportExcel);