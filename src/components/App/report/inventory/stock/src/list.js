import React,{Component} from 'react'
import {FetchStockReport, FetchStockReportDetailSatuan} from "redux/actions/report/inventory/stock_report.action";
import connect from "react-redux/es/connect/connect";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import DetailStockReportSatuan from "components/App/modals/report/inventory/stock_report/detail_stock_report_satuan";
import Preloader from "Preloader";

class ListStockReport extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state={
            token:'',
            detail:{}
        }
    }
    componentWillMount(){
        console.log("TOKEN LIST",this.props.token);
       this.setState({token:this.props.token});
    }
    handlePageChange(pageNumber){
        this.setState({activePage: pageNumber});
        localStorage.setItem("page_stock_report",pageNumber);
        // this.props.dispatch(FetchLocation(pageNumber,localStorage.getItem("any_location")?localStorage.getItem("any_location"):''))
    }
    toggle(e,code,barcode,name){
        e.preventDefault();
        localStorage.setItem("code",code);
        localStorage.setItem("barcode",barcode);
        localStorage.setItem("name",name);
        // this.setState({detail:{}});
        console.log(`${code} ${barcode} ${name}`);
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("detailStockReportSatuan"));
        // this.setState({
        //     detail:{"code":localStorage.getItem("code")}
        // });
        // this.state.detail = {"code":"11111"};
        this.props.dispatch(FetchStockReportDetailSatuan(1,code,'','',''))
    };


    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        const {per_page,current_page,from,to,data} = this.props.data;
        const {total_dn,total_stock_awal,total_stock_masuk,total_stock_keluar,total_stock_akhir} = this.props.total;

        let total_dn_per=0;
        let total_first_stock_per=0;
        let total_last_stock_per=0;
        let total_stock_in_per=0;
        let total_stock_out_per=0;
        // console.log("############ TOTAL DATA ##############",this.props.total);
        return (

            <div>
                <div className="table-responsive" style={{overflowX: "auto"}}>
                    <table className="table table-hover table-bordered">
                        <thead className="bg-light">
                        <tr>
                            <th className="text-black" style={columnStyle} rowSpan="2">#</th>
                            <th className="text-black" style={columnStyle} rowSpan="2">Code</th>
                            <th className="text-black" style={columnStyle} rowSpan="2">Barcode</th>
                            <th className="text-black" style={columnStyle} rowSpan="2">Unit</th>
                            <th className="text-black" style={columnStyle} rowSpan="2">Name</th>
                            <th className="text-black" style={columnStyle} rowSpan="2">Supplier</th>
                            <th className="text-black" style={columnStyle} rowSpan="2">Sub Dept</th>
                            <th className="text-black" style={columnStyle} rowSpan="2">Group</th>
                            <th className="text-black" style={columnStyle} rowSpan="2">Delivery Note</th>
                            <th className="text-black" style={columnStyle} rowSpan="2">First Stock</th>
                            <th className="text-black" style={columnStyle} rowSpan="2">Stock In</th>
                            <th className="text-black" style={columnStyle} rowSpan="2">Stock Out</th>
                            <th className="text-black" style={columnStyle} rowSpan="2">Last Stock</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            (
                                typeof data === 'object' ?
                                    data.map((v,i)=>{
                                        total_dn_per = total_dn_per+parseInt(v.delivery_note);
                                        total_first_stock_per = total_first_stock_per+parseInt(v.stock_awal);
                                        total_last_stock_per = total_last_stock_per+parseInt(v.stock_akhir);
                                        total_stock_in_per = total_stock_in_per+parseInt(v.stock_masuk);
                                        total_stock_out_per = total_stock_out_per+parseInt(v.stock_keluar);
                                        return(
                                            <tr key={i}>
                                                <td style={columnStyle}>{/* Example split danger button */}
                                                    <div className="btn-group">
                                                        <button className="btn btn-primary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            Action
                                                        </button>
                                                        <div className="dropdown-menu">
                                                            <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.handleEdit(e,v.kd_brg)}>Export</a>
                                                            <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.toggle(e,v.kd_brg,v.barcode,v.nm_brg)}>Detail</a>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={columnStyle}>{v.kd_brg}</td>
                                                <td style={columnStyle}>{v.barcode}</td>
                                                <td style={columnStyle}>{v.satuan}</td>
                                                <td style={columnStyle}>{v.nm_brg}</td>
                                                <td style={columnStyle}>{v.supplier}</td>
                                                <td style={columnStyle}>{v.sub_dept}</td>
                                                <td style={columnStyle}>{v.nama_kel}</td>
                                                <td style={{textAlign:"right"}}>{v.delivery_note}</td>
                                                <td style={{textAlign:"right"}}>{v.stock_awal}</td>
                                                <td style={{textAlign:"right"}}>{v.stock_masuk}</td>
                                                <td style={{textAlign:"right"}}>{v.stock_keluar}</td>
                                                <td style={{textAlign:"right"}}>{v.stock_akhir}</td>

                                            </tr>
                                        )
                                    })
                                    : "No data."
                            )
                        }
                        </tbody>
                        <tfoot>
                        <tr style={{fontWeight:"bold"}}>
                            <th colSpan="8">TOTAL PERPAGE</th>
                            <th colSpan="1" style={{textAlign:"right"}}>{total_dn_per}</th>
                            <th colSpan="1" style={{textAlign:"right"}}>{total_first_stock_per}</th>
                            <th colSpan="1" style={{textAlign:"right"}}>{total_stock_in_per}</th>
                            <th colSpan="1" style={{textAlign:"right"}}>{total_stock_out_per}</th>
                            <th colSpan="1" style={{textAlign:"right"}}>{total_last_stock_per}</th>
                        </tr>
                        <tr style={{fontWeight:"bold"}}>
                            <th colSpan="8">TOTAL</th>
                            <th colSpan="1" style={{textAlign:"right"}}>{total_dn!==undefined?total_dn:'0'}</th>
                            <th colSpan="1" style={{textAlign:"right"}}>{total_stock_awal===undefined?0:total_stock_awal}</th>
                            <th colSpan="1" style={{textAlign:"right"}}>{total_stock_masuk===undefined?0:total_stock_masuk}</th>
                            <th colSpan="1" style={{textAlign:"right"}}>{total_stock_keluar===undefined?0:total_stock_keluar}</th>
                            <th colSpan="1" style={{textAlign:"right"}}>{total_stock_akhir===undefined?0:total_stock_akhir}</th>
                        </tr>
                        </tfoot>
                    </table>

                </div>
                {/*<div style={{"marginTop":"20px","float":"right"}}>*/}
                    {/*<Paginationq*/}
                        {/*current_page={current_page}*/}
                        {/*per_page={per_page}*/}
                        {/*total={total}*/}
                        {/*callback={this.handlePageChange.bind(this)}*/}
                    {/*/>*/}
                {/*</div>*/}
               <DetailStockReportSatuan token={this.props.token} stockReportDetailSatuan={this.props.stockReportDetailSatuan}/>
                {/*<DetailStockReportTransaction token={this.props.token}/>*/}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    console.log("mapStateToProps",state);
    return {
        // detail:this.state.detail,
        isLoading: state.stockReportReducer.isLoading,
        stockReportDetailSatuan:state.stockReportReducer.dataDetailSatuan,
        isLoadingDetailSatuan: state.stockReportReducer.isLoadingDetailSatuan,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
};

export default connect(mapStateToProps)(ListStockReport);