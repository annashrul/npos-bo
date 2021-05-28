import React,{Component} from 'react';
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../../_wrapper.modal";
import {ModalBody,ModalHeader} from "reactstrap";
import {toRp,to_pdf} from "helper";
// import ReactHTMLTableToExcel from "react-html-table-to-excel";
import imgExcel from 'assets/xlsx.png';
import imgCsv from 'assets/csv.png';
// import imgPdf from 'assets/pdf.png';
import "jspdf-autotable";
import Spinner from '../../../../../../Spinner';
import moment from "moment";
import XLSX from 'xlsx'

class StockReportExcel extends Component{
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
        '<h3 style="text-align:center"><center>LAPORAN PENJUALAN BY CUST</center></h3>'+
        '</div>';
        
        const headers = [[
            "Kd Cust",
            "Nama",
            "Gross Sales",
            "Diskon Item",
            "Diskon Trx",
            "Service",
            "Qty"
        ]];
        let data = typeof this.props.sale_by_custReportExcel.data === 'object'?this.props.sale_by_custReportExcel.data.map(v=> [
           v.kd_cust,
           v.nama,
           toRp(parseInt(v.gross_sales,10)),
           toRp(parseInt(v.diskon_item,10)),
           toRp(parseInt(v.diskon_trx,10)),
           toRp(v.service),
           v.qty,
        ]):'';
        // data +=["TOTAL","","","","","","","","",tprice];
        to_pdf(
            "sale_by_cust_",
            stringHtml,
            headers,
            data,
            // footer
        );
        this.toggle(e);
      }
      printDocumentXLsx = (e,param) => {
        e.preventDefault();

        let header = [
                        ['LAPORAN STOCK'],
                        ['PERIODE : '+this.props.startDate + ' - ' + this.props.endDate+''],
                        [''],
                        [
                            'Kode Barang',
                            'Barcode',
                            'Satuan',
                            'Nama',
                            'Supplier',
                            'Sub Dept',
                            'Kelompok',
                            'DN',
                            'Stock Awal',
                            'Stock In',
                            'Stock Out',
                            'Stock Sale',
                            'Stock Akhir',
                        ]
                    ]
        let footer = [
                        // ['TOTAL','','','','',toRp(this.props.totalPenjualanExcel.omset),toRp(this.props.totalPenjualanExcel.dis_item),toRp(this.props.totalPenjualanExcel.dis_rp),this.props.totalPenjualanExcel.dis_persen,'','','','',toRp(this.props.totalPenjualanExcel.kas_lain),'',toRp(this.props.totalPenjualanExcel.gt),toRp(this.props.totalPenjualanExcel.rounding),toRp(this.props.totalPenjualanExcel.bayar),toRp(this.props.totalPenjualanExcel.change),toRp(this.props.totalPenjualanExcel.jml_kartu),toRp(this.props.totalPenjualanExcel.charge),'','','','']
                    ]
        // Kd Trx	Tanggal	Jam	Customer	Kasir	Omset	Diskon			HPP	Hrg Jual	Profit	Reg.Member	Trx Lain	Keterangan	Grand Total	Rounding	Tunai	Change	Transfer	Charge	Nama Kartu	Status	Lokasi	Jenis Trx
                        // Peritem(%)	Total(rp)	Total(%)	
                        															

        let raw = typeof this.props.stockReportExcel.data === 'object'?this.props.stockReportExcel.data.map(v=> [
            v.kd_brg,
            v.barcode,
            v.satuan,
            v.nm_brg,
            v.supplier,
            v.sub_dept,
            v.nama_kel,
            v.delivery_note,
            v.stock_awal,
            v.stock_masuk,
            v.stock_keluar,
            v.stock_penjualan,
            (parseFloat(v.stock_awal)+parseFloat(v.stock_masuk))-(parseFloat(v.stock_keluar)+parseFloat(v.stock_penjualan)),
        ]):'';

        let body = header.concat(raw);

        let data = footer===undefined||footer===[]?body:body.concat(footer);

        // let data = this.props.saleReportExcel.data;
        
        let ws = XLSX.utils.json_to_sheet(data, {skipHeader:true});
        // let ws = XLSX.utils.json_to_sheet(data, {header:header,skipHeader:true});
        let merge = [
                {s: {r:0, c:0},e: {r:0, c:14}},
                {s: {r:1, c:0},e: {r:1, c:14}},
            ];
        if(!ws['!merges']) ws['!merges'] = [];
        ws['!merges'] = merge;
        ws['!ref'] = XLSX.utils.encode_range({
            s: { c: 0, r: 0 },
            e: { c: 14, r: 1 + data.length + 1}
        });
        ws["A1"].s = {
            alignment: {
                vertical: 'center',
            }
        };
        
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        let exportFileName = `Laporan_Stock_${moment(new Date()).format('YYYYMMDDHHMMss')}.${param==='csv'?`csv`:`xlsx`}`;
        XLSX.writeFile(wb, exportFileName, {type:'file', bookType:param==='csv'?"csv":"xlsx"});

        this.toggle(e);
    }
    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        const {total_dn,total_stock_awal,total_stock_masuk,total_stock_keluar,total_stock_akhir} = this.props.total_stock;

        let total_dn_per=0;
        let total_first_stock_per=0;
        let total_last_stock_per=0;
        let total_stock_in_per=0;
        let total_stock_out_per=0;
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formStockExcel"} size={this.state.view === false?'md':'xl'} aria-labelledby="contained-modal-title-vcenter" centered keyboard>
                <ModalHeader toggle={this.toggle}></ModalHeader>
                <form onSubmit={this.handleSubmit}>
                    {typeof this.props.stockReportExcel.data==='object'?
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
                                            <img src={imgExcel} alt=""></img>
                                        </div>
                                        <div className="gallery-text-area">
                                            <div className="gallery-icon">
                                                <button type="button" className="btn btn-circle btn-lg btn-success" onClick={(e => this.printDocumentXLsx(e,'xlsx'))}><i className="fa fa-print"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="single-gallery--item">
                                        <div className="gallery-thumb">
                                            <img src={imgCsv} alt=""></img>
                                        </div>
                                        <div className="gallery-text-area">
                                            <div className="gallery-icon">
                                                <button type="button" className="btn btn-circle btn-lg btn-success" onClick={(e => this.printDocumentXLsx(e,'csv'))}><i className="fa fa-print"></i></button>
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
                                                    table={'laporan_sale_by_cust'}
                                                    filename={'laporan_sale_by_cust'}
                                                    sheet="kas"
                                                    buttonText={<i className="fa fa-print"></i>}>
                                                </ReactHTMLTableToExcel>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                            <table className="table table-hover table-bordered table-responsive"  id="laporan_sale_by_cust" style={{display:this.state.view === false?'none':'inline-table'}}>
                            <thead className="bg-light">
                                    <tr>
                                        <th className="text-black" colSpan={12}>{this.props.startDate} - {this.props.startDate}</th>
                                    </tr>
                                    <tr>
                                        <th className="text-black" colSpan={12}>LAPORAN STOCK</th>
                                    </tr>

                                    <tr>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Kode Barang</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Barcode</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Satuan</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Nama</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Supplier</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Sub Dept</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Kelompok</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Delivery Note</th>
                                        <th className="text-black" colSpan="4" style={columnStyle}>Stok</th>
                                    </tr>
                                    <tr>
                                        <th className="text-black" rowSpan="1" style={columnStyle}>Awal</th>
                                        <th className="text-black" rowSpan="1" style={columnStyle}>Masuk</th>
                                        <th className="text-black" rowSpan="1" style={columnStyle}>Keluar</th>
                                        <th className="text-black" rowSpan="1" style={columnStyle}>Akhir</th>
                                    </tr>
                                    </thead>
                                    {
                                        <tbody>
                                        {
                                            typeof this.props.stockReportExcel.data==='object'? this.props.stockReportExcel.data.length>0?
                                                this.props.stockReportExcel.data.map((v,i)=>{
                                                    const stok_akhir = (parseFloat(v.stock_awal) + parseFloat(v.stock_masuk) - parseFloat(v.stock_keluar));
                                                    total_dn_per = total_dn_per+parseInt(v.delivery_note,10);
                                                    total_first_stock_per = total_first_stock_per+parseInt(v.stock_awal,10);
                                                    total_last_stock_per = total_last_stock_per+parseFloat(v.stock_awal)+parseFloat(v.stock_masuk)-parseFloat(v.stock_keluar);
                                                    total_last_stock_per = total_last_stock_per + stok_akhir;
                                                    total_stock_in_per = total_stock_in_per+parseInt(v.stock_masuk,10);
                                                    total_stock_out_per = total_stock_out_per+parseInt(v.stock_keluar,10);
                                                    return (
                                                        <tr key={i}>
                                                            <td style={columnStyle}>{v.kd_brg}</td>
                                                            <td style={columnStyle}>{v.barcode}</td>
                                                            <td style={columnStyle}>{v.satuan}</td>
                                                            <td style={columnStyle}>{v.nm_brg}</td>
                                                            <td style={columnStyle}>{v.supplier}</td>
                                                            <td style={columnStyle}>{v.sub_dept}</td>
                                                            <td style={columnStyle}>{v.nama_kel}</td>
                                                            <td style={columnStyle}>{v.delivery_note}</td>
                                                            <td style={columnStyle}>{v.stock_awal}</td>
                                                            <td style={columnStyle}>{v.stock_masuk}</td>
                                                            <td style={columnStyle}>{v.stock_keluar}</td>
                                                            {/* <td style={columnStyle}>{parseFloat(v.stock_awal)+parseFloat(v.stock_masuk)-parseFloat(v.stock_keluar)}</td> */}
                                                            <td style={columnStyle}>{stok_akhir}</td>
                                                        </tr>
                                                    );
                                                }) : "No data." : "No data."
                                        }
                                        <tfoot>
                                        <tr style={{fontWeight:"bold"}}>
                                            <th colSpan="7">TOTAL PERPAGE</th>
                                            <th colSpan="1" style={{textAlign:"right"}}>{total_dn_per}</th>
                                            <th colSpan="1" style={{textAlign:"right"}}>{total_first_stock_per}</th>
                                            <th colSpan="1" style={{textAlign:"right"}}>{total_stock_in_per}</th>
                                            <th colSpan="1" style={{textAlign:"right"}}>{total_stock_out_per}</th>
                                            <th colSpan="1" style={{textAlign:"right"}}>{total_last_stock_per}</th>
                                        </tr>
                                        <tr style={{fontWeight:"bold",backgroundColor:"#EEEEEE"}}>
                                            <th colSpan="7">TOTAL</th>
                                            <th colSpan="1" style={{textAlign:"right"}}>{total_dn!==undefined?total_dn:'0'}</th>
                                            <th colSpan="1" style={{textAlign:"right"}}>{total_stock_awal===undefined?0:total_stock_awal}</th>
                                            <th colSpan="1" style={{textAlign:"right"}}>{total_stock_masuk===undefined?0:total_stock_masuk}</th>
                                            <th colSpan="1" style={{textAlign:"right"}}>{total_stock_keluar===undefined?0:total_stock_keluar}</th>
                                            <th colSpan="1" style={{textAlign:"right"}}>{total_stock_akhir===undefined?0:total_stock_akhir}</th>
                                        </tr>
                                        </tfoot>
                                        </tbody>
                                    }
                                </table>
                        </ModalBody> 
                    : <Spinner/>}
                </form>
            </WrapperModal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoading:state.stockReportReducer.isLoading,
        stockReportExcel:state.stockReportReducer.report_excel,
        total_stock:state.stockReportReducer.total_stock,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(StockReportExcel);