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
class SaleOmsetReportExcel extends Component{
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
        '<h3 style="text-align:center"><center>LAPORAN OMSET PENJUALAN</center></h3>'+
        '</div>';
        
        const headers = [[
            "Tanggal",
            "QTY",
            "Gross Sale",
            "Net Sale",
            "Grand Total",
            "Diskon Item",
            "Diskon Trx",
            "TAX",
            "Service",
        ]];
        let data = typeof this.props.sale_omsetReportExcel.data === 'object'?this.props.sale_omsetReportExcel.data.map(v=> [
           moment(v.tanggal).format('YYYY-MM-DD'),
           v.qty,
           toRp(parseInt(v.gross_sales,10)),
           toRp(parseInt(v.net_sales,10)),
           toRp(parseInt(v.grand_total,10)),
           toRp(parseInt(v.diskon_item,10)),
           toRp(parseInt(v.diskon_trx,10)),
           toRp(parseInt(v.tax,10)),
           toRp(parseInt(v.service,10)),
        ]):'';
        // data +=["TOTAL","","","","","","","","",tprice];
        to_pdf(
            "sale_omset_",
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
            ['LAPORAN OMSET PENJUALAN'],
            ['PERIODE : ' + this.props.startDate + ' - ' + this.props.endDate + ''],
            [''],
            [
                'Tanggal',
                'QTY',
                'Gross Sale',
                'Net Sale',
                'Grand Total',
                'Diskon Item',
                'Diskon Trx',
                'TAX',
                'Service',]
        ]
        let raw = typeof this.props.sale_omsetReportExcel.data === 'object' ? this.props.sale_omsetReportExcel.data.map(v => [
            moment(v.tanggal).format('YYYY-MM-DD'),
            v.qty,
            toRp(parseInt(v.gross_sales,10)),
            toRp(parseInt(v.net_sales,10)),
            toRp(parseInt(v.grand_total,10)),
            toRp(parseInt(v.diskon_item,10)),
            toRp(parseInt(v.diskon_trx,10)),
            toRp(parseInt(v.tax,10)),
            toRp(parseInt(v.service,10)),
        ]) : '';

        let body = header.concat(raw);

        let data = body;
        let ws = XLSX.utils.json_to_sheet(data, { skipHeader: true });

        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        let exportFileName = `Laporan__Omset_Penjualan_${moment(new Date()).format('YYYYMMDDHHMMss')}.${param === 'csv' ? `csv` : `xlsx`}`;
        XLSX.writeFile(wb, exportFileName, { type: 'file', bookType: param === 'csv' ? "csv" : "xlsx" });

        this.toggle(e);
    }
    render(){
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formSaleOmsetExcel"} size={this.state.view === false?'md':'xl'} aria-labelledby="contained-modal-title-vcenter" centered keyboard>
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
        sale_omsetReportExcel:state.saleOmsetReducer.report_excel,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(SaleOmsetReportExcel);