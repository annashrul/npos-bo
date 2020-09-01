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

class AlokasiReportExcel extends Component{
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
        '<h3 style="text-align:center"><center>LAPORAN ALOKASI</center></h3>'+
        '</div>';
        console.log(stringHtml)
        const headers = [[
            "No Faktur Mutasi",
            "Tanggal",
            "Lokasi Asal",
            "Lokasi Tujuan",
            "Status",
            "No. Faktur Beli",
            "Keterangan",
        ]];
        let data = typeof this.props.alokasiReportExcel.data === 'object'?this.props.alokasiReportExcel.data.map(v=> [
           v.no_faktur_mutasi,
           moment(v.tgl_mutasi).format("DD-MM-YYYY"),
           v.lokasi_asal,
           v.lokasi_tujuan,
           v.status==='0'?'Proses':(v.status==='1'?'Packing':(v.status==='2'?'Dikirim':(v.status==='3'?'Diterima':""))),
           v.no_faktur_beli?v.no_faktur_beli:'-',
           v.keterangan?v.keterangan:'-',
        ]):'';
        // data +=["TOTAL","","","","","","","","",tprice];
        to_pdf(
            "alokasi_",
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
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formAlokasiExcel"} size={this.state.view === false?'md':'xl'} aria-labelledby="contained-modal-title-vcenter" centered keyboard>
                {/* <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Manage Export":"Update AlokasiExcel"}</ModalHeader> */}
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
                                                table={'laporan_alokasi'}
                                                filename={'laporan_alokasi'}
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
                        <table className="table table-hover table-bordered table-responsive"  id="laporan_alokasi" style={{display:this.state.view === false?'none':'inline-table'}}>
                        <thead className="bg-light">
                                <tr>
                                    <th className="text-black" colSpan={7}>{this.props.startDate} - {this.props.startDate}</th>
                                </tr>
                                <tr>
                                    <th className="text-black" colSpan={7}>LAPORAN ALOKASI</th>
                                </tr>

                                <tr>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>No Faktur Mutasi</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Tanggal</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Lokasi Asal</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Lokasi Tujuan</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Status</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>No. Faktur Beli</th>
                                    <th className="text-black" rowSpan="2" style={columnStyle}>Keterangan</th>
                                </tr>
                                <tr></tr>
                                </thead>
                                {
                                    <tbody>
                                    {
                                        typeof this.props.alokasiReportExcel.data==='object'? this.props.alokasiReportExcel.data.length>0?
                                            this.props.alokasiReportExcel.data.map((v,i)=>{
                                                return (
                                                    <tr key={i}>
                                                        <td style={columnStyle}>{v.no_faktur_mutasi}</td>
                                                        <td style={columnStyle}>{moment(v.tgl_mutasi).format("DD-MM-YYYY")}</td>
                                                        <td style={columnStyle}>{v.lokasi_asal}</td>
                                                        <td style={columnStyle}>{v.lokasi_tujuan}</td>
                                                        <td style={columnStyle}>{v.status==='0'?statusQ('danger','proses'):(v.status==='1'?statusQ('warning','packing'):(v.status==='2'?statusQ('info','dikirim'):(v.status==='3'?statusQ('success','diterima'):"")))}</td>
                                                        <td style={columnStyle}>{v.no_faktur_beli?v.no_faktur_beli:'-'}</td>
                                                        <td style={columnStyle}>{v.keterangan?v.keterangan:'-'}</td>
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
        alokasiReportExcel:state.alokasiReducer.report_excel,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(AlokasiReportExcel);