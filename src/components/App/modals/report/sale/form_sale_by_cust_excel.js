import React,{Component} from 'react';
import {ModalToggle} from "redux/actions/modal.action";
import connect from "react-redux/es/connect/connect";
import WrapperModal from "../../_wrapper.modal";
import {ModalBody} from "reactstrap";
import {toRp, to_pdf} from 'helper'
import ReactHTMLTableToExcel from "react-html-table-to-excel";
// import jsPDF from 'jspdf';
import imgExcel from 'assets/xls.png';
import imgPdf from 'assets/pdf.png';
import "jspdf-autotable";

class SaleByCustReportExcel extends Component{
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
    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        // let subtotal=0;
        // let t_harga_beli = 0;
        // let t_qty = 0;
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "formSaleByCustExcel"} size={this.state.view === false?'md':'xl'} aria-labelledby="contained-modal-title-vcenter" centered keyboard>
                {/* <ModalHeader toggle={this.toggle}>{this.props.detail===undefined?"Manage Export":"Update SaleByCustExcel"}</ModalHeader> */}
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
                                                table={'laporan_sale_by_cust'}
                                                filename={'laporan_sale_by_cust'}
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
                        <table className="table table-hover table-bordered table-responsive"  id="laporan_sale_by_cust" style={{display:this.state.view === false?'none':'inline-table'}}>
                        <thead className="bg-light">
                                    <tr>
                                        <th className="text-black" colSpan={7}>{this.props.startDate} - {this.props.startDate}</th>
                                    </tr>
                                    <tr>
                                        <th className="text-black" colSpan={7}>{this.props.location===''?'SEMUA LOKASI':this.props.location}</th>
                                    </tr>

                                    <tr>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Kd Cust</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Nama</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Gross Sales</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Diskon Item</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Diskon Trx</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Service</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Qty</th>
                                    </tr>
                                    <tr></tr>
                                    </thead>
                                    {
                                        <tbody>
                                        {
                                            typeof this.props.sale_by_custReportExcel.data==='object'? this.props.sale_by_custReportExcel.data.length>0?
                                                this.props.sale_by_custReportExcel.data.map((v,i)=>{
                                                    return (
                                                        <tr key={i}>
                                                            <td style={columnStyle}>{v.kd_cust}</td>
                                                            <td style={columnStyle}>{v.nama}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(parseInt(v.gross_sales,10))}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(parseInt(v.diskon_item,10))}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(parseInt(v.diskon_trx,10))}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(v.service)}</td>
                                                            <td style={{textAlign:"right"}}>{v.qty}</td>
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
        sale_by_custReportExcel:state.sale_by_custReducer.report_excel,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(SaleByCustReportExcel);