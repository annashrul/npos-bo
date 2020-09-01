import React,{Component} from 'react';
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import {ModalBody, ModalHeader,ModalFooter} from "reactstrap";
import moment from "moment";
import {rangeDate, toRp, to_pdf,statusQ} from "helper";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import jsPDF from 'jspdf';
import imgExcel from 'assets/xls.png';
import imgPdf from 'assets/pdf.png';
import "jspdf-autotable";

class OpnameReportExcel extends Component{
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
        let loc_val = this.props.location===''?'SEMUA':this.props.location;
        stringHtml+=
        '<div style="text-align:center>'+
        '<h3 align="center"><center>PERIODE : '+this.props.startDate + ' - ' + this.props.endDate+'</center></h3>'+
        '<h3 align="center"><center>LOKASI : '+ loc_val +'</center></h3>'+
        '<h3 align="center"><center>&nbsp;</center></h3>'+
        '<h3 style="text-align:center"><center>LAPORAN OPNAME</center></h3>'+
        '</div>';
        console.log(stringHtml)
        const headers = [[
            "Kode Trx",
            "Tanggal",
            "kode Barang",
            "Nama Barang",
            "Kel. Barang",
            "Barcode",
            "Qty Fisik",
            "Stok Terakhir",
            "Lokasi",
            "Harga Beli",
            "Status",
        ]];
        let data = typeof this.props.opnameReportExcel.data === 'object'?this.props.opnameReportExcel.data.map(v=> [
           v.kd_trx,
           moment(v.tanggal).format("DD-MM-YYYY"),
           v.kd_brg,
           v.nm_brg,
           v.nm_kel_brg,
           v.barcode,
           v.qty_fisik,
           v.stock_terakhir,
           v.lokasi,
           v.hrg_beli,
           v.status==='0'?'Belum Opname':(v.status==='1'?'Sudah Opname':""),
        ]):'';
        // data +=["TOTAL","","","","","","","","",tprice];
        to_pdf(
            "opname_",
            stringHtml,
            headers,
            data,
            // footer
        );
        this.toggle(e);
      }
    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formOpnameExcel"} size={this.state.view === false?'md':'xl'} aria-labelledby="contained-modal-title-vcenter" centered keyboard>
                {/* <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Manage Export":"Update OpnameExcel"}</ModalHeader> */}
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <button type="button" className="close"><span aria-hidden="true" onClick={(e => this.toggle(e))}>×</span><span className="sr-only">Close</span></button>
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
                                                table={'laporan_opname'}
                                                filename={'laporan_opname'}
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
                        <table className="table table-hover table-bordered table-responsive"  id="laporan_opname" style={{display:this.state.view === false?'none':'inline-table'}}>
                            <thead className="bg-light">
                                <tr>
                                    <th className="text-black" colSpan={11}>{this.props.startDate} - {this.props.startDate}</th>
                                </tr>
                                <tr>
                                    <th className="text-black" colSpan={11}>{this.props.location===''?'SEMUA LOKASI':this.props.location}</th>
                                </tr>

                                <tr>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Kode Trx</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Tanggal</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>kode Barang</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Nama Barang</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Kel. Barang</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Barcode</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Qty Fisik</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Stok Terakhir</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Lokasi</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Harga Beli</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Status</th>
                                </tr>
                                <tr></tr>
                                </thead>
                                {
                                    <tbody>
                                    {
                                        typeof this.props.opnameReportExcel.data==='object'? this.props.opnameReportExcel.data.length>0?
                                            this.props.opnameReportExcel.data.map((v,i)=>{
                                                return (
                                                    <tr key={i}>
                                                        <td style={columnStyle}>{v.kd_trx}</td>
                                                        <td style={columnStyle}>{moment(v.tanggal).format("DD-MM-YYYY")}</td>
                                                        <td style={columnStyle}>{v.kd_brg}</td>
                                                        <td style={columnStyle}>{v.nm_brg}</td>
                                                        <td style={columnStyle}>{v.nm_kel_brg}</td>
                                                        <td style={columnStyle}>{v.barcode}</td>
                                                        <td style={columnStyle}>{v.qty_fisik}</td>
                                                        <td style={columnStyle}>{v.stock_terakhir}</td>
                                                        <td style={columnStyle}>{v.lokasi}</td>
                                                        <td style={columnStyle}>{v.hrg_beli}</td>
                                                        <td style={columnStyle}>{v.status==='0'?statusQ('danger','Belum Opname'):(v.status==='1'?statusQ('warning','Sudah Opname'):"")}</td>
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
        opnameReportExcel:state.opnameReducer.report_excel,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(OpnameReportExcel);