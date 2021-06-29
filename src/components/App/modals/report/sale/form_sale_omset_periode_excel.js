import React,{Component} from 'react';
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../_wrapper.modal";
import {ModalBody} from "reactstrap";
import {toRp, to_pdf} from 'helper'
import imgExcel from 'assets/xls.png';
import imgPdf from 'assets/pdf.png';
import moment from "moment";
import XLSX from 'xlsx'
class SaleOmsetPeriodeReportExcel extends Component{
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
        // '<h3 align="center"><center>PERIODE : '+this.props.startDate + ' - ' + this.props.endDate+'</center></h3>'+
        '<h3 align="center"><center>&nbsp;</center></h3>'+
        '<h3 style="text-align:center"><center>LAPORAN OMSET PERIODE</center></h3>'+
        '</div>';
        
        const headers = [[
            "No",
            "Nama Toko",
            "Omset Bulan Lalu",
            "Transaksi Bulan Lalu",
            "Rata - Rata Transaksi Bulan Lalu Sale",
            "Omset Bulan Sekarang Sale",
            "Transaksi Bulan Sekarang Total",
            "Rata - Rata Transaksi Bulan Sekarang Item",
            "Pertumbuhan Trx",
            "Persentase",
        ]];
        let data = typeof this.props.saleOmsetPeriodeReportExcel.data === 'object'?this.props.saleOmsetPeriodeReportExcel.data.map((v,i)=> [
            i+1,
            v.nama_toko,
            toRp(parseInt(v.omset_sebelum, 10)),
            toRp(parseInt(v.transaksi_sebelum, 10)),
            toRp(!Number.isNaN(parseInt(v.omset_sebelum, 10) / parseInt(v.transaksi_sebelum, 10)) ? parseInt(v.omset_sebelum, 10) / parseInt(v.transaksi_sebelum, 10) : 0),
            toRp(parseInt(v.omset_sekarang, 10)),
            toRp(parseInt(v.transaksi_sekarang, 10)),
            toRp(!Number.isNaN(parseInt(v.omset_sekarang, 10) / parseInt(v.transaksi_sekarang, 10)) ? parseInt(v.omset_sekarang, 10) / parseInt(v.transaksi_sekarang, 10) : 0),
            toRp(parseInt(v.omset_sekarang, 10) - parseInt(v.omset_sebelum, 10)),
            toRp(!Number.isNaN((parseInt(v.omset_sekarang, 10) - parseInt(v.omset_sebelum, 10)) / parseInt(v.omset_sebelum, 10) * 100) ? (parseInt(v.omset_sekarang, 10) - parseInt(v.omset_sebelum, 10)) / parseInt(v.omset_sebelum, 10) * 100 : 0),
        ]):'';
        // data +=["TOTAL","","","","","","","","",tprice];
        to_pdf(
            "saleOmsetPeriode_",
            stringHtml,
            headers,
            data,
            // footer
        );
        this.toggle(e);
      }
    printDocumentXLsx = (e, param) => {
        e.preventDefault();

        let header = [
            ['LAPORAN OMSET PERIODE'],
            ['PERIODE : ' + this.props.startDate + ' - ' + this.props.endDate + ''],
            [''],
            [
                'Nama Toko',
                'Omset Bulan Lalu',
                'Transaksi Bulan Lalu',
                'Rata - Rata Transaksi Bulan Lalu Sale',
                'Omset Bulan Sekarang Sale',
                'Transaksi Bulan Sekarang Total',
                'Rata - Rata Transaksi Bulan Sekarang Item',
                'Pertumbuhan Trx',
                'Persentase']
        ]
        let raw = typeof this.props.saleOmsetPeriodeReportExcel.data === 'object' ? this.props.saleOmsetPeriodeReportExcel.data.map(v => [
            v.nama_toko,
            toRp(parseInt(v.omset_sebelum,10)),
            toRp(parseInt(v.transaksi_sebelum,10)),
            toRp(!Number.isNaN(parseInt(v.omset_sebelum, 10) / parseInt(v.transaksi_sebelum, 10)) ? parseInt(v.omset_sebelum, 10) / parseInt(v.transaksi_sebelum, 10) : 0),
            toRp(parseInt(v.omset_sekarang,10)),
            toRp(parseInt(v.transaksi_sekarang,10)),
            toRp(!Number.isNaN(parseInt(v.omset_sekarang, 10) / parseInt(v.transaksi_sekarang, 10)) ? parseInt(v.omset_sekarang, 10) / parseInt(v.transaksi_sekarang, 10):0),
            toRp(parseInt(v.omset_sekarang, 10) - parseInt(v.omset_sebelum,10)),
            toRp(!Number.isNaN((parseInt(v.omset_sekarang, 10) - parseInt(v.omset_sebelum, 10)) / parseInt(v.omset_sebelum, 10) * 100) ? (parseInt(v.omset_sekarang, 10) - parseInt(v.omset_sebelum, 10)) / parseInt(v.omset_sebelum, 10) * 100:0),
        ]) : '';

        let body = header.concat(raw);

        let data = body;
        let ws = XLSX.utils.json_to_sheet(data, { skipHeader: true });
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        let exportFileName = `Laporan_Omset_Periode_${moment(new Date()).format('YYYYMMDDHHMMss')}.${param === 'csv' ? `csv` : `xlsx`}`;
        XLSX.writeFile(wb, exportFileName, { type: 'file', bookType: param === 'csv' ? "csv" : "xlsx" });

        this.toggle(e);
    }
    render(){

        // const columnStyle = { verticalAlign: "middle", textAlign: "center", };
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formSaleOmsetPeriodeExcel"} size={this.state.view === false?'md':'xl'} aria-labelledby="contained-modal-title-vcenter" centered keyboard>
                <form onSubmit={this.handleSubmit}>
                    <ModalBody>
                        <button type="button" className="close"><span className="text-dark" aria-hidden="true" onClick={(e => this.toggle(e))}>×</span><span className="sr-only">Close</span></button>
                        <h3 className="text-center">Manage Export</h3>
                        <div className="row mb-4">
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
                                        <div className="gallery-icon">
                                            <button type="button" className="btn btn-circle btn-lg btn-success" onClick={(e => this.printDocumentXLsx(e, 'xlsx'))}><i className="fa fa-print"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </form>
            </WrapperModal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        saleOmsetPeriodeReportExcel:state.saleOmsetPeriodeReducer.report_excel,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(SaleOmsetPeriodeReportExcel);