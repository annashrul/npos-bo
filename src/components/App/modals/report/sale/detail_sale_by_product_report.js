import React,{Component} from 'react';
import WrapperModal from "../../_wrapper.modal";
import {ModalBody, ModalHeader} from "reactstrap";
import {ModalToggle} from "redux/actions/modal.action";
// import DateRangePicker from "react-bootstrap-daterangepicker";
import {
    FetchReportDetailSaleByProduct
} from "redux/actions/sale/sale_by_product.action";
import connect from "react-redux/es/connect/connect";
// import {rangeDate} from "helper";
import Paginationq from "helper";
import moment from "moment";
import {toRp} from "../../../../../helper";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import imgExcel from 'assets/xls.png';
class DetailSaleByProductReport extends Component{
    constructor(props){
        super(props);
        this.state={
            startDate:'',
            endDate:'',
            isExport:false,
        }
        this.toggle = this.toggle.bind(this);


    }
    componentDidMount(){
        
    }
    componentWillMount(){
        
        this.setState({
            startDate:this.props.startDate,
            endDate:this.props.endDate,
        })
    }
    // componentWillReceiveProps(nextprops){
    //     
    //     this.setState({
    //         startDate:nextprops.startDate,
    //         endDate:nextprops.endDate,
    //     })
        
    // }
    toggle(e){
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
    };
    toggleExport(e){
        e.preventDefault();
        if(this.state.isExport===true){
            this.checkingParameter(1)
        }
        this.setState({
            isExport:!this.state.isExport
        })
    };
    handlePageChange(pageNumber){
        localStorage.setItem("pageNumber_sale_by_product_report_detail",pageNumber);
        this.checkingParameter(pageNumber);
    }    
    handleEvent = (event, picker) => {
        const awal = moment(picker.startDate._d).format('YYYY-MM-DD');
        const akhir = moment(picker.endDate._d).format('YYYY-MM-DD');
        localStorage.setItem("date_from_sale_by_product_report_detail",`${awal}`);
        localStorage.setItem("date_to_sale_by_product_report_detail",`${akhir}`);
        this.setState({
            startDate:awal,
            endDate:akhir
        });
        
        let kode=localStorage.getItem("kode_sale_by_product_report");
        this.props.dispatch(FetchReportDetailSaleByProduct(kode,1,awal,akhir));
    }
    handleExport(e,total){
        e.preventDefault();
        this.setState({isExport:true});
        let dateFrom=localStorage.getItem("date_from_sale_by_product_report_detail");
        let dateTo=localStorage.getItem("date_to_sale_by_product_report_detail");
        let kode=localStorage.getItem("kode_sale_by_product_report");

        this.props.dispatch(FetchReportDetailSaleByProduct(kode,1,dateFrom===null?this.props.startDate:dateFrom,dateTo===null?this.props.endDate:dateTo,total));
    }
    checkingParameter(pageNumber){
        let dateFrom=localStorage.getItem("date_from_sale_by_product_report_detail");
        let dateTo=localStorage.getItem("date_to_sale_by_product_report_detail");
        let kode=localStorage.getItem("kode_sale_by_product_report");

        this.props.dispatch(FetchReportDetailSaleByProduct(kode,pageNumber,dateFrom===null?this.props.startDate:dateFrom,dateTo===null?this.props.endDate:dateTo));
    }

    render(){
        
        const {data,last_page, per_page,current_page} = this.props.detailSaleByProduct;
        const columnStyle = {verticalAlign: "middle", textAlign: "left",};
        return (
            <WrapperModal isOpen={this.props.isOpen && this.props.type === "detailSaleByProductReport"} size={this.state.isExport===false?'lg':'sm'}>
                <ModalHeader toggle={this.toggle}>{this.state.isExport===false?`Detail Penjualan By Barang (${this.props.detail.kd_brg})`:'Export Data'}</ModalHeader>
                <ModalBody hidden={this.state.isExport===true}>
                    <div className="row">
                        <div className="col-6 col-xs-6 col-md-6">
                            <table className="table no-border" >
                                <tbody className="bg-transparent no-border" style={{border:"none"}}>
                                <tr>
                                    <th className="text-black" style={columnStyle}>Nama Barang</th>
                                    <th className="text-black" style={columnStyle}>: {this.props.detail.nm_brg}</th>
                                </tr>
                                <tr>
                                    <th className="text-black" style={columnStyle}>Qty</th>
                                    <th className="text-black" style={columnStyle}>: {parseInt(this.props.detail.qty_jual,10)+" "+this.props.detail.satuan}</th>
                                </tr>
                                <tr>
                                    <th className="text-black" style={columnStyle}>Gross Sale</th>
                                    <th className="text-black" style={columnStyle}>: {toRp(parseInt(this.props.detail.gross_sales,10))}</th>
                                </tr>
                                <tr>
                                    <th className="text-black" style={columnStyle}>Nama Toko</th>
                                    <th className="text-black" style={columnStyle}>: {this.props.detail.toko}</th>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                        <div className="col-6 col-xs-6 col-md-6">
                            <div className="form-group text-right">
                                <button style={{marginRight:"5px"}} className="btn btn-primary" onClick={(e => this.handleExport(e,(last_page*per_page)))}>
                                    <i className="fa fa-print"/> Export
                                </button>
                            </div>
                        </div>
                    </div>

                    <div style={{overflowX: "auto"}}>
                        <table className="table table-hover table-bordered">
                            <thead className="bg-light">
                            <tr>
                                <th className="text-black" style={columnStyle}>Kd Trx</th>
                                <th className="text-black" style={columnStyle}>Tanggal</th>
                                <th className="text-black" style={columnStyle}>Lokasi</th>
                                <th className="text-black" style={columnStyle}>SKU</th>
                                <th className="text-black" style={columnStyle}>Diskon</th>
                                <th className="text-black" style={columnStyle}>Qty</th>
                                <th className="text-black" style={columnStyle}>Net Sales</th>
                                <th className="text-black" style={columnStyle}>Gross Sales</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                typeof data === 'object' ? data.length>0?
                                    data.map((v,i)=>{
                                        return (
                                            <tr key={i}>
                                                <td style={columnStyle}>{v.kd_trx}</td>
                                                <td style={columnStyle}>{moment(v.tgl).format('YYYY-MM-DD')}</td>
                                                <td style={columnStyle}>{v.lokasi}</td>
                                                <td style={columnStyle}>{v.sku}</td>
                                                <td style={{textAlign:"right"}}>{v.diskon}</td>
                                                <td style={{textAlign:"right"}}>{parseInt(v.qty,10)}</td>
                                                <td style={{textAlign:"right"}}>{toRp(parseInt(v.net_sales,10))}</td>
                                                <td style={{textAlign:"right"}}>{toRp(parseInt(v.gross_sales,10))}</td>
                                            </tr>
                                        );
                                    }) : "No data." : "No data."
                            }
                            </tbody>
                        </table>
                        
                        <div style={{"marginTop":"20px","float":"right"}}>
                                    <Paginationq
                                        current_page={parseInt(current_page,10)}
                                        per_page={parseInt(per_page,10)}
                                        total={parseInt(last_page*per_page,10)}
                                        callback={this.handlePageChange.bind(this)}
                                    />
                                </div>
                    </div>
                </ModalBody>
                <ModalBody hidden={this.state.isExport===false}>
                    {/* <div className="row">
                        <div className="col-6 offset-3"> */}
                            <button type="button" className="btn btn-link" onClick={(e => this.toggleExport(e))}><i className="fa fa fa-angle-left"></i> Back</button>
                            <div className="single-gallery--item mb-4">
                                <div className="gallery-thumb">
                                    <img src={imgExcel} alt=""></img>
                                </div>
                                <div className="gallery-text-area">
                                    <div className="gallery-icon" onClick={(e => this.toggleExport(e))}>
                                        <ReactHTMLTableToExcel
                                            className="btn btn-circle btn-lg btn-success"
                                            table={'laporan_product_detail'}
                                            filename={'laporan_product_detail'}
                                            sheet="laporan_product_detail"
                                            buttonText={<i className="fa fa-print"></i>}>
                                        </ReactHTMLTableToExcel>
                                    </div>
                                </div>
                            </div>
                            <table className="table table-hover table-bordered" id="laporan_product_detail" style={{display:'none'}}>
                                <thead className="bg-light">
                                    <tr>
                                        <th colSpan={8} className="text-center">Laporan Product Detail</th>
                                    </tr>
                                    <tr>
                                        <th colSpan={2} className="text-black" style={columnStyle}>Nama Barang</th>
                                        <th colSpan={2} className="text-black" style={columnStyle}>Qty</th>
                                        <th colSpan={2} className="text-black" style={columnStyle}>Gross Sale</th>
                                        <th colSpan={2} className="text-black" style={columnStyle}>Store</th>
                                    </tr>
                                    <tr>
                                        <th colSpan={2} className="text-black" style={columnStyle}>{this.props.detail.nm_brg}</th>
                                        <th colSpan={2} className="text-black" style={columnStyle}>{parseInt(this.props.detail.qty_jual,10)+" "+this.props.detail.satuan}</th>
                                        <th colSpan={2} className="text-black" style={columnStyle}>{toRp(parseInt(this.props.detail.gross_sales,10))}</th>
                                        <th colSpan={2} className="text-black" style={columnStyle}>{this.props.detail.toko}</th>
                                    </tr>
                                    <tr>
                                        <th colSpan={8}></th>
                                    </tr>
                                    <tr>
                                        <th className="text-black" style={columnStyle}>Kd Trx</th>
                                        <th className="text-black" style={columnStyle}>Tanggal</th>
                                        <th className="text-black" style={columnStyle}>Lokasi</th>
                                        <th className="text-black" style={columnStyle}>SKU</th>
                                        <th className="text-black" style={columnStyle}>Diskon</th>
                                        <th className="text-black" style={columnStyle}>Qty</th>
                                        <th className="text-black" style={columnStyle}>Net Sales</th>
                                        <th className="text-black" style={columnStyle}>Gross Sales</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    typeof data === 'object' ? data.length>0?
                                        data.map((v,i)=>{
                                            return (
                                                <tr key={i}>
                                                    <td style={columnStyle}>{v.kd_trx}</td>
                                                    <td style={columnStyle}>{moment(v.tgl).format('YYYY-MM-DD')}</td>
                                                    <td style={columnStyle}>{v.lokasi}</td>
                                                    <td style={columnStyle}>{v.sku}</td>
                                                    <td style={{textAlign:"right"}}>{v.diskon}</td>
                                                    <td style={{textAlign:"right"}}>{parseInt(v.qty,10)}</td>
                                                    <td style={{textAlign:"right"}}>{toRp(parseInt(v.net_sales,10))}</td>
                                                    <td style={{textAlign:"right"}}>{toRp(parseInt(v.gross_sales,10))}</td>
                                                </tr>
                                            );
                                        }) : "No data." : "No data."
                                }
                                </tbody>
                            </table>
                        {/* </div>
                    </div> */}
                </ModalBody>
            </WrapperModal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(DetailSaleByProductReport);