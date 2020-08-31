import React,{Component} from 'react';
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import WrapperModal from ".././_wrapper.modal";
import {ModalBody, ModalHeader,ModalFooter} from "reactstrap";
import moment from "moment";
import {rangeDate, toRp, to_pdf,statusQ} from "helper";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import jsPDF from 'jspdf';
import "jspdf-autotable";

class PiutangReportExcel extends Component{
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
        '<h3 align="center"><center>&nbsp;</center></h3>'+
        '<h3 style="text-align:center"><center>LAPORAN PIUTANG</center></h3>'+
        '</div>';
        
        const headers = [[
            "No Nota",
            "Faktur Jual",
            "Tanggal Bayar",
            "Cara Bayar",
            "Jumlah",
            "Nama Bank",
            "Jatuh Tempo",
            "No Giro",
            "Tanggal Cair Giro",
            "Nama",
            "Kode Cust.",
            "Keterangan",
        ]];
        let data = typeof this.props.piutangReportExcel.data === 'object'?this.props.piutangReportExcel.data.map(v=> [
           v.no_nota,
           v.fak_jual,
           moment(v.tgl_byr).format("DD-MM-YYYY"),
           v.cara_byr,
           v.jumlah,
           v.nm_bank,
           moment(v.tgl_jatuh_tempo).format("DD-MM-YYYY"),
           v.nogiro,
           moment(v.tgl_cair_giro).format("DD-MM-YYYY"),
           v.nama,
           v.kd_cust,
           v.ket,
        ]):'';
        // data +=["TOTAL","","","","","","","","",tprice];
        to_pdf(
            "piutang_",
            stringHtml,
            headers,
            data,
            // footer
        );
        this.toggle(e);
      }
    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        let subtotal=0;
        let t_harga_beli = 0;
        let t_qty = 0;
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formPiutangExcel"} size={this.state.view === false?'md':'xl'} aria-labelledby="contained-modal-title-vcenter" centered keyboard>
                {/* <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Manage Export":"Update PiutangExcel"}</ModalHeader> */}
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
                                        <img src="/img/pdf.png" alt=""></img>
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
                                        <img src="/img/xls.png" alt=""></img>
                                    </div>
                                    <div className="gallery-text-area">
                                        <div className="gallery-icon" onClick={(e => this.toggle(e))}>
                                            <ReactHTMLTableToExcel
                                                className="btn btn-circle btn-lg btn-success"
                                                table={'laporan_piutang'}
                                                filename={'laporan_piutang'}
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
                        <table className="table table-hover table-bordered table-responsive"  id="laporan_piutang" style={{display:this.state.view === false?'none':'inline-table'}}>
                            <thead className="bg-light">
                                <tr>
                                    <th className="text-black" colSpan={12}>{this.props.startDate} - {this.props.startDate}</th>
                                </tr>
                                <tr>
                                    <th className="text-black" colSpan={12}>LAPORAN PIUTANG</th>
                                </tr>

                                <tr>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>No Nota</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Faktur Jual</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Tanggal Bayar</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Cara Bayar</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Jumlah</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Nama Bank</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Jatuh Tempo</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>No Giro</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Tanggal Cair Giro</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Nama</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Kode Cust.</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Keterangan</th>
                                </tr>
                                <tr></tr>
                                </thead>
                                {
                                    <tbody>
                                    {
                                        typeof this.props.piutangReportExcel.data==='object'? this.props.piutangReportExcel.data.length>0?
                                            this.props.piutangReportExcel.data.map((v,i)=>{
                                                t_harga_beli +=parseFloat(v.hpp);
                                                t_qty +=parseFloat(v.qty_estimasi);
                                                return (
                                                    <tr key={i}>
                                                        <td style={columnStyle}>{v.no_nota}</td>
                                                        <td style={columnStyle}>{v.fak_jual}</td>
                                                        <td style={columnStyle}>{moment(v.tgl_byr).format("DD-MM-YYYY")}</td>
                                                        <td style={columnStyle}>{v.cara_byr}</td>
                                                        <td style={columnStyle}>{v.jumlah}</td>
                                                        <td style={columnStyle}>{v.nm_bank}</td>
                                                        <td style={columnStyle}>{moment(v.tgl_jatuh_tempo).format("DD-MM-YYYY")}</td>
                                                        <td style={columnStyle}>{v.nogiro}</td>
                                                        <td style={columnStyle}>{moment(v.tgl_cair_giro).format("DD-MM-YYYY")}</td>
                                                        <td style={columnStyle}>{v.nama}</td>
                                                        <td style={columnStyle}>{v.kd_cust}</td>
                                                        <td style={columnStyle}>{v.ket}</td>
                                                    </tr>
                                                );
                                            }) : "No data." : "No data."
                                    }
                                    {/* <tfoot>
                                        <tr>
                                            <td style={columnStyle} colSpan="6">Total</td>
                                            <td style={columnStyle}>{t_qty}</td>
                                            <td style={columnStyle}>{t_harga_beli}</td>
                                        </tr>
                                        <tr>
                                            <td style={columnStyle} colSpan="6">Rata - rata</td>
                                            <td style={columnStyle}>{parseInt(parseInt(t_qty)/parseInt(typeof this.props.piutangReportExcel.data === 'object' ? this.props.piutangReportExcel.data.length > 0 ? this.props.piutangReportExcel.data.length : 0 : 0))}</td>
                                            <td style={columnStyle}>{parseInt(parseInt(t_harga_beli)/parseInt(typeof this.props.piutangReportExcel.data === 'object' ? this.props.piutangReportExcel.data.length > 0 ? this.props.piutangReportExcel.data.length : 0 : 0))}</td>
                                        </tr>
                                    </tfoot> */}
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
        piutangReportExcel:state.piutangReducer.report_excel,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(PiutangReportExcel);