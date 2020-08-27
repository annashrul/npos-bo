import React,{Component} from 'react';
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import {FetchCashExcel} from "redux/actions/masterdata/cash/cash.action";
import {stringifyFormData} from "helper";
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalHeader,ModalFooter} from "reactstrap";
import moment from "moment";
import {rangeDate, toRp} from "../../../../../helper";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import jsPDF from 'jspdf';
import "jspdf-autotable";
import {to_pdf} from "helper";


class CashReportExcel extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleView = this.handleView.bind(this);
        this.printDocument = this.printDocument.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
        // this.handleChange = this.handleChange.bind(this);
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
        '<h3 align="center"><center>TIPE : '+(this.props.tipe===''?'SEMUA':this.props.tipe.toUpperCase())+'</center></h3>'+
        '<h3 align="center"><center>PERIODE : '+this.props.startDate + ' - ' + this.props.endDate+'</center></h3>'+
        '<h3 align="center"><center>LOKASI : '+(this.props.location===''?'SEMUA LOKASI':this.props.location)+'</center></h3>'+
        '<h3 align="center"><center>KASSA : '+(this.props.kassa===''?'SEMUA KASSA':this.props.kassa)+'</center></h3>';
        // stringHtml+=
        // '<table style="border:0px;width:100%">'+
        // '<tbody>'+
        //     '<tr><td><h3>TIPE : ' + (this.props.tipe===''?'SEMUA':this.props.tipe.toUpperCase()) + '</h3></td></tr>'+
        //     '<tr><td><h3>PERIODER : ' + this.props.startDate + ' - ' + this.props.endDate + '</h3></td></tr>'+
        //     '<tr><td><h3>LOKASI : ' + (this.props.location===''?'SEMUA LOKASI':this.props.location) + '</h3></td></tr>'+
        //     '<tr><td><h3>KASSA : ' + (this.props.kassa===''?'SEMUA KASSA':this.props.kassa) + '</h3></td></tr>'+
        // '</tbody>'+
        // '</table>';
        // stringHtml+= '<h3 align="center"><center>PERIODE : '+this.props.startDate + ' - ' + this.props.endDate+'</center></h3>';
        // stringHtml+= '<h3 align="center"><center>LOKASI : '+this.props.location===''?'SEMUA LOKASI':this.props.location+'</center></h3>';
        // stringHtml+= '<h3 align="center"><center>KASSA : '+this.props.kassa===''?'SEMUA KASSA':this.props.kassa+'</center></h3>';
        console.log(stringHtml)
        const headers = [["No", "Tgl","Kd Trx","Keterangan","Lokasi","Kassa","Kasir","Tipe","Jenis","Jumlah"]];
        let data = typeof this.props.cashReportExcel.data === 'object'?this.props.cashReportExcel.data.map(v=> [
           1,moment(v.tgl).format("yyyy-MM-DD"),v.kd_trx,v.keterangan,v.lokasi,v.kassa,v.kasir,v.type,v.jenis,toRp(parseInt(v.jumlah))
        ]):'';
        // data +=["TOTAL","","","","","","","","",tprice];
        to_pdf(
            "kas_",
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
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formCashExcel"} size={this.state.view === false?'md':'xl'} aria-labelledby="contained-modal-title-vcenter" centered keyboard>
                {/* <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Manage Export":"Update CashExcel"}</ModalHeader> */}
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
                                                table={'laporan_kas'}
                                                filename={'laporan_kas'}
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
                        <table className="table table-hover table-bordered table-responsive"  id="laporan_kas" style={{display:this.state.view === false?'none':'inline-table'}}>
                            <thead className="bg-light">
                            <tr>
                                <th className="text-black" colSpan={10}>TIPE : {this.props.type===''?'SEMUA':this.props.type.toUpperCase()}</th>
                            </tr>
                            <tr>
                                <th className="text-black" colSpan={10}>PERIODE: {this.props.startDate} - {this.props.startDate}</th>
                            </tr>
                            <tr>
                                <th className="text-black" colSpan={10}>LOKASI: {this.props.location===''?'SEMUA LOKASI':this.props.location}</th>
                            </tr>
                            <tr>
                                <th className="text-black" colSpan={10}>KASSA : {this.props.kassa===''?'SEMUA KASSA':this.props.kassa}</th>
                            </tr>
                            <tr>
                                <th className="text-black" style={columnStyle}>No</th>
                                <th className="text-black" style={columnStyle}>Tgl</th>
                                <th className="text-black" style={columnStyle}>Kd Trx</th>
                                <th className="text-black" style={columnStyle}>Keterangan</th>
                                <th className="text-black" style={columnStyle}>Lokasi</th>
                                <th className="text-black" style={columnStyle}>Kassa</th>
                                <th className="text-black" style={columnStyle}>Kasir</th>
                                <th className="text-black" style={columnStyle}>Tipe</th>
                                <th className="text-black" style={columnStyle}>Jenis</th>
                                <th className="text-black" style={columnStyle}>Jumlah</th>
                            </tr>
                            </thead>
                            <tbody>

                            {
                                (
                                    typeof this.props.cashReportExcel.data === 'object' ? this.props.cashReportExcel.data.length > 0 ?
                                        this.props.cashReportExcel.data.map((v,i)=>{
                                            subtotal = subtotal+parseInt(v.jumlah);
                                            return(
                                                <tr key={i}>
                                                    <td style={columnStyle}>{i+1}</td>
                                                    <td style={columnStyle}>{moment(v.tgl).format("yyyy-MM-DD")}</td>
                                                    <td style={columnStyle}>{v.kd_trx}</td>
                                                    <td style={columnStyle}>{v.keterangan}</td>
                                                    <td style={columnStyle}>{v.lokasi}</td>
                                                    <td style={columnStyle}>{v.kassa}</td>
                                                    <td style={columnStyle}>{v.kasir}</td>
                                                    <td style={columnStyle}>{v.type}</td>
                                                    <td style={columnStyle}>{v.jenis}</td>
                                                    <td style={{textAlign:"right"}}>{toRp(parseInt(v.jumlah))}</td>
                                                </tr>
                                            )
                                        })
                                        : "No data." : "No data."
                                )
                            }
                            </tbody>
                            <tfoot>
                            <tr>
                                <td colSpan={9}>TOTAL</td>
                                <td style={{textAlign:"right"}}>
                                    {toRp(subtotal)}
                                    </td>
                            </tr>
                            </tfoot>
                        </table>
                    </ModalBody>
                </form>
            </WrapperModal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        cashReportExcel:state.cashReducer.dataExcel,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(CashReportExcel);