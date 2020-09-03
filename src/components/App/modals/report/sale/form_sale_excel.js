import React,{Component} from 'react';
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../_wrapper.modal";
import {ModalBody} from "reactstrap";
import moment from "moment";
import {toRp} from "helper";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
// // import jsPDF from 'jspdf';
import imgExcel from 'assets/xls.png';
// import imgPdf from 'assets/pdf.png';
import "jspdf-autotable";
import {to_pdf_l} from "helper";


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
    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center"};
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formSaleExcel"} size={this.state.view === false?'md':'xl'} aria-labelledby="contained-modal-title-vcenter" centered keyboard>
                {/* <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Manage Export":"Update SaleExcel"}</ModalHeader> */}
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
                                                table={'laporan_sale'}
                                                filename={'laporan_sale'}
                                                sheet="sale"
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
                        <table className="table table-hover table-bordered table-responsive"  id="laporan_sale" style={{display:this.state.view === false?'none':'inline-table'}}>
                        <thead className="bg-light">
                                    <tr>
                                        <th className="text-black" colSpan={25}>{this.props.startDate} - {this.props.startDate}</th>
                                    </tr>
                                    <tr>
                                        <th className="text-black" colSpan={25}>{this.props.location===''?'SEMUA LOKASI':this.props.location}</th>
                                    </tr>

                                    <tr>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Kd Trx</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Tanggal</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Jam</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Customer</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Kasir</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Omset</th>
                                        <th className="text-black" colSpan={3} style={columnStyle}>Diskon</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>HPP</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Hrg Jual</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Profit</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Reg.Member</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Trx Lain</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Keterangan</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Grand Total</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Rounding</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Tunai</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Change</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Transfer</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Charge</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Nama Kartu</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Status</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Lokasi</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Jenis Trx</th>
                                    </tr>
                                    <tr>
                                        <th className="text-black" style={columnStyle}>Peritem(%)</th>
                                        <th className="text-black" style={columnStyle}>Total(rp)</th>
                                        <th className="text-black" style={columnStyle}>Total(%)</th>
                                    </tr>
                                    </thead>
                                    {
                                        <tbody>
                                        {
                                            typeof this.props.saleReportExcel.data==='object'? this.props.saleReportExcel.data.length>0?
                                                this.props.saleReportExcel.data.map((v,i)=>{
                                                    return (
                                                        <tr key={i}>
                                                            <td style={columnStyle}>{v.kd_trx}</td>
                                                            <td style={columnStyle}>{moment(v.tgl).format("yyyy/MM/DD")}</td>
                                                            <td style={columnStyle}>{moment(v.jam).format("hh:mm:ss")}</td>
                                                            <td style={columnStyle}>{v.nama}</td>
                                                            <td style={columnStyle}>{v.kd_kasir}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(parseInt(v.omset,10))}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(parseInt(v.diskon_item,10))}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(v.dis_rp)}</td>
                                                            <td style={{textAlign:"right"}}>{v.dis_persen}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(parseInt(v.hrg_beli,10)*parseInt(v.hrg_jual,10))}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(parseInt(v.hrg_jual,10))}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(parseInt(v.profit,10))}</td>
                                                            <td style={columnStyle}>{v.regmember?v.regmember:"-"}</td>
                                                            <td style={columnStyle}>{v.kas_lain}</td>
                                                            <td style={columnStyle}>{v.ket_kas_lain}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(parseInt(v.omset-v.diskon_item-v.dis_rp-v.kas_lain,10))}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(parseInt(v.rounding,10))}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(parseInt(v.bayar,10))}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(parseInt(v.change,10))}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(parseInt(v.jml_kartu,10))}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(parseInt(v.charge,10))}</td>
                                                            <td style={columnStyle}>{v.kartu}</td>
                                                            <td style={columnStyle}>{v.status}</td>
                                                            <td style={columnStyle}>{v.lokasi}</td>
                                                            <td style={columnStyle}>{v.jenis_trx}</td>
                                                        </tr>
                                                    );
                                                }) : "No data." : "No data."
                                        }
                                        </tbody>
                                    }
                                    <tfoot>
                                    <tr>
                                        <td colSpan="5">TOTAL</td>
                                        <td style={{textAlign:"right"}}>{toRp(this.props.totalPenjualanExcel.omset)}</td>
                                        <td style={{textAlign:"right"}}>{toRp(this.props.totalPenjualanExcel.dis_item)}</td>
                                        <td style={{textAlign:"right"}}>{toRp(this.props.totalPenjualanExcel.dis_rp)}</td>
                                        <td style={{textAlign:"right"}}>{this.props.totalPenjualanExcel.dis_persen}</td>
                                        <td colSpan="4"/>
                                        <td style={{textAlign:"right"}}>{toRp(this.props.totalPenjualanExcel.kas_lain)}</td>
                                        <td colSpan="1"/>
                                        <td style={{textAlign:"right"}}>{toRp(this.props.totalPenjualanExcel.gt)}</td>
                                        <td style={{textAlign:"right"}}>{toRp(this.props.totalPenjualanExcel.rounding)}</td>
                                        <td style={{textAlign:"right"}}>{toRp(this.props.totalPenjualanExcel.bayar)}</td>
                                        <td style={{textAlign:"right"}}>{toRp(this.props.totalPenjualanExcel.change)}</td>
                                        <td style={{textAlign:"right"}}>{toRp(this.props.totalPenjualanExcel.jml_kartu)}</td>
                                        <td style={{textAlign:"right"}}>{toRp(this.props.totalPenjualanExcel.charge)}</td>
                                        <td colSpan="4"/>
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
        saleReportExcel:state.saleReducer.report_excel,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(SaleReportExcel);