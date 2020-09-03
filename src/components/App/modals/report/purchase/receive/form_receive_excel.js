import React,{Component} from 'react';
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import {ModalBody} from "reactstrap";
import moment from "moment";
import Preloader from "Preloader";
import {to_pdf} from "helper";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
// import jsPDF from 'jspdf';
import imgExcel from 'assets/xls.png';
// import imgPdf from 'assets/pdf.png';
import "jspdf-autotable";

class ReceiveReportExcel extends Component{
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
        '<h3 style="text-align:center"><center>LAPORAN ALOKASI MUTASI TRX</center></h3>'+
        '</div>';
        
        const headers = [[
            "No Faktur",
            "Tanggal",
            "Penerima",
            "Tipe",
            "Pelunasan",
            "Diskon",
            "PPN",
            "Supplier",
            "Operator",
            "Lokasi",
            "Serial",
            "Kontrabon",
            "Jumlah Kontabon",
            "Qty Beli",
            "Total Beli",
        ]];
        let data = typeof this.props.receiveReportExcel.data === 'object'?this.props.receiveReportExcel.data.map(v=> [
           v.no_faktur_beli,
           moment(v.tgl_beli).format("YYYY-MM-DD"),
           v.nama_penerima,
           v.type,
           v.pelunasan,
           v.disc,
           v.ppn,
           v.supplier,
           v.operator,
           v.lokasi,
           v.serial,
           v.kontabon,
           v.jumlah_kontrabon,
           v.qty_beli,
           v.total_beli,
        ]):'';
        // data +=["TOTAL","","","","","","","","",tprice];
        to_pdf(
            "receive_",
            stringHtml,
            headers,
            data,
            // footer
        );
        this.toggle(e);
      }
    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        const {data} = this.props.data;
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formReceiveExcel"} size={this.state.view === false?'md':'xl'} aria-labelledby="contained-modal-title-vcenter" centered keyboard>
                {/* <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Manage Export":"Update ReceiveExcel"}</ModalHeader> */}
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
                                                table={'laporan_receive'}
                                                filename={'laporan_receive'}
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
                        <table className="table table-hover table-bordered table-responsive"  id="laporan_receive" style={{display:this.state.view === false?'none':'inline-table'}}>
                            <thead className="bg-light">
                                    <tr>
                                        <th className="text-black" colSpan={15}>{this.props.startDate} - {this.props.startDate}</th>
                                    </tr>
                                    <tr>
                                        <th className="text-black" colSpan={15}>{this.props.location===''?'SEMUA LOKASI':this.props.location}</th>
                                    </tr>
                                    <tr>
                                        <th className="text-black" style={columnStyle}>No Faktur</th>
                                        <th className="text-black" style={columnStyle}>Tanggal</th>
                                        <th className="text-black" style={columnStyle}>Penerima</th>
                                        <th className="text-black" style={columnStyle}>Tipe</th>
                                        <th className="text-black" style={columnStyle}>Pelunasan</th>
                                        <th className="text-black" style={columnStyle}>Diskon</th>
                                        <th className="text-black" style={columnStyle}>PPN</th>
                                        <th className="text-black" style={columnStyle}>Supplier</th>
                                        <th className="text-black" style={columnStyle}>Operator</th>
                                        <th className="text-black" style={columnStyle}>Lokasi</th>
                                        <th className="text-black" style={columnStyle}>Serial</th>
                                        <th className="text-black" style={columnStyle}>Kontrabon</th>
                                        <th className="text-black" style={columnStyle}>Jumlah Kontabon</th>
                                        <th className="text-black" style={columnStyle}>Qty Beli</th>
                                        <th className="text-black" style={columnStyle}>Total Beli</th>
                                    </tr>
                                    </thead>
                                    {
                                        !this.props.isLoading ? (
                                            <tbody>
                                            {
                                                (
                                                    typeof data === 'object' ? data.length>0?
                                                        data.map((v,i)=>{
                                                            return(
                                                                <tr key={i}>

                                                                    <td style={columnStyle}>{v.no_faktur_beli}</td>
                                                                    <td style={columnStyle}>{moment(v.tgl_beli).format("YYYY-MM-DD")}</td>
                                                                    <td style={columnStyle}>{v.nama_penerima}</td>
                                                                    <td style={columnStyle}>{v.type}</td>
                                                                    <td style={columnStyle}>{v.pelunasan}</td>
                                                                    <td style={columnStyle}>{v.disc}</td>
                                                                    <td style={columnStyle}>{v.ppn}</td>
                                                                    <td style={columnStyle}>{v.supplier}</td>
                                                                    <td style={columnStyle}>{v.operator}</td>
                                                                    <td style={columnStyle}>{v.lokasi}</td>
                                                                    <td style={columnStyle}>{v.serial}</td>
                                                                    <td style={columnStyle}>{v.kontabon}</td>
                                                                    <td style={columnStyle}>{v.jumlah_kontrabon}</td>
                                                                    <td style={columnStyle}>{v.qty_beli}</td>
                                                                    <td style={columnStyle}>{v.total_beli}</td>
                                                                </tr>
                                                            )
                                                        })
                                                        : "No data.":"No data."
                                                )
                                            }
                                            </tbody>
                                        ) : <Preloader/>
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
        data:state.receiveReducer.data,
        receiveReportDetail:state.receiveReducer.dataReceiveReportDetail,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(ReceiveReportExcel);