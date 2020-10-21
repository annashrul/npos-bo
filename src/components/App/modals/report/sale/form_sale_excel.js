import React,{Component} from 'react';
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../_wrapper.modal";
import {ModalBody} from "reactstrap";
import moment from "moment";
import {toRp} from "helper";
// import ReactHTMLTableToExcel from "react-html-table-to-excel";
// // import jsPDF from 'jspdf';
import imgExcel from 'assets/xls.png';
// import imgPdf from 'assets/pdf.png';
import "jspdf-autotable";
import {to_pdf_l} from "helper";
import XLSX from 'xlsx'
import Spinner from '../../../../../Spinner';


class SaleReportExcel extends Component{
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
        let stringHtml = '';
        stringHtml+=
        '<h3 align="center"><center>PERIODE : '+this.props.startDate + ' - ' + this.props.endDate+'</center></h3>'+
        '<h3 align="center"><center>LOKASI : '+(this.props.location===''?'SEMUA LOKASI':this.props.location)+'</center></h3>';
        const headers = [[
            "Kd Trx",
            "Tanggal Trx",
            "Jam",
            "Customer",
            "Kasir",
            "Omset",
            "Disk. Peritem(%)",
            "Disk. Total(rp)",
            "Disk. Total(%)",
            "HPP",
            "Hrg Jual",
            "Profit",
            "Reg.Member",
            "Trx Lain",
            "Keterangan",
            "Grand Total",
            "Rounding",
            "Tunai",
            "Change",
            "Transfer",
            "Charge",
            "Nama Kartu",
            "Status",
            "Lokasi",
            "Jenis Trx",
        ]];
        let data = typeof this.props.saleReportExcel.data === 'object'?this.props.saleReportExcel.data.map(v=> [
            moment(v.tgl).format("yyyy-MM-DD"),
            v.kd_trx,
            moment(v.tgl).format("yyyy/MM/DD"),
            moment(v.jam).format("hh:mm:ss"),
            v.nama,
            v.kd_kasir,
            toRp(parseInt(v.omset,10)),
            toRp(parseInt(v.diskon_item,10)),
            toRp(v.dis_rp),
            v.dis_persen,
            toRp(parseInt(v.hrg_beli,10)*parseInt(v.hrg_jual,10)),
            toRp(parseInt(v.hrg_jual,10)),
            toRp(parseInt(v.profit,10)),
            v.regmember?v.regmember:"-",
            v.kas_lain,
            v.ket_kas_lain,
            toRp(parseInt(v.omset-v.diskon_item-v.dis_rp-v.kas_lain,10)),
            toRp(parseInt(v.rounding,10)),
            toRp(parseInt(v.bayar,10)),
            toRp(parseInt(v.change,10)),
            toRp(parseInt(v.jml_kartu,10)),
            toRp(parseInt(v.charge,10)),
            v.kartu,
            v.status,
            v.lokasi,
            v.jenis_trx,
        ]):'';
        // data +=["TOTAL","","","","","","","","",tprice];
        to_pdf_l(
            "sale_",
            stringHtml,
            headers,
            data,
            // footer
        );
        this.toggle(e);
      }
    printDocumentXLsx = (e) => {
        e.preventDefault();

        let header = [
                        ['LAPORAN PENJUALAN'],
                        ['PERIODE : '+this.props.startDate + ' - ' + this.props.endDate+''],
                        [''],
                        ['Kd Trx','Tanggal','Jam','Customer','Kasir','Omset','Diskon Item','Diskon Total (rp)','Diskon Total (%)','HPP','Hrg Jual','Profit','Reg.Member','Trx Lain','Keterangan','Grand Total','Rounding','Tunai','Change','Transfer','Charge','Nama Kartu','Status','Lokasi','Jenis Trx']
                    ]
        let footer = [
                        ['TOTAL','','','','',toRp(this.props.totalPenjualanExcel.omset),toRp(this.props.totalPenjualanExcel.dis_item),toRp(this.props.totalPenjualanExcel.dis_rp),this.props.totalPenjualanExcel.dis_persen,'','','','',toRp(this.props.totalPenjualanExcel.kas_lain),'',toRp(this.props.totalPenjualanExcel.gt),toRp(this.props.totalPenjualanExcel.rounding),toRp(this.props.totalPenjualanExcel.bayar),toRp(this.props.totalPenjualanExcel.change),toRp(this.props.totalPenjualanExcel.jml_kartu),toRp(this.props.totalPenjualanExcel.charge),'','','','']
                    ]
        // Kd Trx	Tanggal	Jam	Customer	Kasir	Omset	Diskon			HPP	Hrg Jual	Profit	Reg.Member	Trx Lain	Keterangan	Grand Total	Rounding	Tunai	Change	Transfer	Charge	Nama Kartu	Status	Lokasi	Jenis Trx
						// Peritem(%)	Total(rp)	Total(%)																

        let raw = typeof this.props.saleReportExcel.data === 'object'?this.props.saleReportExcel.data.map(v=> [
            v.kd_trx,
            moment(v.tgl).format("yyyy/MM/DD"),
            moment(v.jam).format("hh:mm:ss"),
            v.customer,
            v.nama,
            toRp(parseInt(v.omset,10)),
            toRp(parseInt(v.diskon_item,10)),
            toRp(v.dis_rp),
            v.dis_persen,
            toRp(parseInt(v.hrg_beli,10)*parseInt(v.hrg_jual,10)),
            toRp(parseInt(v.hrg_jual,10)),
            toRp(parseInt(v.profit,10)),
            v.regmember?v.regmember:"-",
            v.kas_lain,
            v.ket_kas_lain,
            toRp(parseInt(v.omset-v.diskon_item-v.dis_rp-v.kas_lain,10)),
            toRp(parseInt(v.rounding,10)),
            toRp(parseInt(v.bayar,10)),
            toRp(parseInt(v.change,10)),
            toRp(parseInt(v.jml_kartu,10)),
            toRp(parseInt(v.charge,10)),
            v.kartu,
            v.status,
            v.lokasi,
            v.jenis_trx,
        ]):'';

        let body = header.concat(raw);

        let data = body.concat(footer);

        // let data = this.props.saleReportExcel.data;
        console.log(data)
        let ws = XLSX.utils.json_to_sheet(data, {skipHeader:true});
        // let ws = XLSX.utils.json_to_sheet(data, {header:header,skipHeader:true});
        let merge = [
                {s: {r:0, c:0},e: {r:0, c:24}},
                {s: {r:1, c:0},e: {r:1, c:24}},
                {s: {r:data.length-1, c:0},e: {r:data.length-1, c:4}},
                {s: {r:data.length-1, c:9},e: {r:data.length-1, c: 12}},
                {s: {r:data.length-1, c:21},e: {r:data.length-1, c: 24}},
            ];
        if(!ws['!merges']) ws['!merges'] = [];
        ws['!merges'] = merge;
        ws['!ref'] = XLSX.utils.encode_range({
            s: { c: 0, r: 0 },
            e: { c: 24, r: 1 + data.length + 1}
        });
        ws["A1"].s = {
            alignment: {
                vertical: 'center',
            }
        };
        console.log(ws['A1'])
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        let exportFileName = `Laporan_Penjualan_${moment(new Date()).format('YYYYMMDDHHMMss')}.xlsx`;
        XLSX.writeFile(wb, exportFileName, {type:'file', bookType:"xlsx"});

        this.toggle(e);
      }
    render(){
        // const columnStyle = {verticalAlign: "middle", textAlign: "center"};
        console.log(this.props.isLoadingReport)
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formSaleExcel"} size={this.state.view === false?'md':'xl'} aria-labelledby="contained-modal-title-vcenter" centered keyboard>
                {/* <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Manage Export":"Update SaleExcel"}</ModalHeader> */}
                <form onSubmit={this.handleSubmit}>
                    { !this.props.isLoadingReport?
                    <ModalBody>
                        <button type="button" className="close"><span aria-hidden="true" onClick={(e => this.toggle(e))}>×</span><span className="sr-only">Close</span></button>
                        <h3 className="text-center">Manage Export</h3>
                        <div className="row mb-4">
                            {/* <div className="col-4">
                                <button type="button" className="btn btn-info btn-block" onClick={(e => this.handleView(e))}>VIEW</button>
                            </div> */}
                            <div className="col-6 offset-3">
                                <div className="single-gallery--item">
                                    <div className="gallery-thumb">
                                        <img src={imgExcel} alt=""></img>
                                    </div>
                                    <div className="gallery-text-area">
                                        <div className="gallery-icon">
                                            <button type="button" className="btn btn-circle btn-lg btn-success" onClick={(e => this.printDocumentXLsx(e))}><i className="fa fa-print"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="col-6 offset-3">
                                <div className="single-gallery--item">
                                    <div className="gallery-thumb">
                                        <img src={imgExcel} alt=""></img>
                                    </div>
                                    <div className="gallery-text-area">
                                        <div className="gallery-icon" onClick={(e => this.toggle(e))}>
                                            <ReactHTMLTableToExcel
                                                className="btn btn-circle btn-lg btn-success"
                                                table={'laporan_sale'}
                                                filename={'laporan_sale'}
                                                sheet="sale"
                                                buttonText={<i className="fa fa-print"></i>}>
                                            </ReactHTMLTableToExcel>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </ModalBody> : <Spinner spinnerLabel={"Sedang memuat data ..."}/>
                    }
                </form>
            </WrapperModal>
        );
    }
}

const mapStateToProps = (state) => {
    console.log(state);
    return {
        saleReportExcel:state.saleReducer.report_excel,
        isLoadingReport: state.saleReducer.isLoadingReport,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(SaleReportExcel);