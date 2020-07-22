import React,{Component} from 'react'
import Paginationq from "helper";
import {FetchAlokasiReport, FetchAlokasiDetail} from "redux/actions/inventory/alokasi.action";
import connect from "react-redux/es/connect/connect";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import DetailAlokasi from "components/App/modals/report/inventory/alokasi_report/detail_alokasi";
import Preloader from "Preloader";
import moment from "moment";

class ListAlokasiReport extends Component{
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
        localStorage.setItem("page_alokasi_report",pageNumber);
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
        this.props.dispatch(ModalType("detailAlokasi"));
        // this.setState({
        //     detail:{"code":localStorage.getItem("code")}
        // });
        // this.state.detail = {"code":"11111"};
        this.props.dispatch(FetchAlokasiDetail(1,code,'','',''))
    };


    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        const {data} = this.props.data;
        // const {total_dn,total_stock_awal,total_stock_masuk,total_stock_keluar,total_stock_akhir} = this.props.total;

        // let total_dn_per=0;
        // let total_first_stock_per=0;
        // let total_last_stock_per=0;
        // let total_stock_in_per=0;
        // let total_stock_out_per=0;
        // console.log("############ TOTAL DATA ##############",this.props.total);
        return (

            <div>
                <div className="table-responsive" style={{overflowX: "auto"}}>
                    <table className="table table-hover table-bordered">
                        <thead className="bg-light">
                        <tr>
                            <th className="text-black" style={columnStyle} rowSpan="2">#</th>
                            <th className="text-black" style={columnStyle} rowSpan="2">Code</th>
                            <th className="text-black" style={columnStyle} rowSpan="2">Date Trx</th>
                            <th className="text-black" style={columnStyle} rowSpan="2">From</th>
                            <th className="text-black" style={columnStyle} rowSpan="2">To</th>
                            <th className="text-black" style={columnStyle} rowSpan="2">Status</th>
                            <th className="text-black" style={columnStyle} rowSpan="2">Factur No.</th>
                            <th className="text-black" style={columnStyle} rowSpan="2">Note</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            (
                                typeof data === 'object' ?
                                    data.map((v,i)=>{
                                        // total_dn_per = total_dn_per+parseInt(v.delivery_note);
                                        // total_first_stock_per = total_first_stock_per+parseInt(v.stock_awal);
                                        // total_last_stock_per = total_last_stock_per+parseInt(v.stock_akhir);
                                        // total_stock_in_per = total_stock_in_per+parseInt(v.stock_masuk);
                                        // total_stock_out_per = total_stock_out_per+parseInt(v.stock_keluar);
                                        return(
                                            <tr key={i}>
                                                <td style={columnStyle}>{/* Example split danger button */}
                                                    <div className="btn-group">
                                                        <button className="btn btn-primary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            Action
                                                        </button>
                                                        <div className="dropdown-menu">
                                                            {/* <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.handleEdit(e,v.kd_brg)}>Export</a> */}
                                                            <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.toggle(e,v.no_faktur_mutasi,'','')}>Detail</a>
                                                        </div>
                                                    </div>
                                                </td>
                                                {/* "tgl_mutasi": "2020-07-21T11:06:25.000Z",
                                                "no_faktur_mutasi": "MC-2007210001-3",
                                                "kd_lokasi_1": "LK/0001",
                                                "kd_lokasi_2": "LK/0002",
                                                "kd_kasir": "1",
                                                "status": "0",
                                                "no_faktur_beli": "DN-2007200001-4",
                                                "keterangan": "-" */}
                                                <td style={columnStyle}>{v.no_faktur_mutasi}</td>
                                                <td style={columnStyle}>{moment(v.tgl_mutasi).format("DD-MM-YYYY")}</td>
                                                <td style={columnStyle}>{v.kd_lokasi_1}</td>
                                                <td style={columnStyle}>{v.kd_lokasi_2}</td>
                                                <td style={columnStyle}>{v.status}</td>
                                                <td style={columnStyle}>{v.no_faktur_beli}</td>
                                                <td style={columnStyle}>{v.keterangan}</td>

                                            </tr>
                                        )
                                    })
                                    : "No data."
                            )
                        }
                        </tbody>
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
               <DetailAlokasi token={this.props.token} alokasiDetail={this.props.alokasiDetail}/>
                {/*<DetailStockReportTransaction token={this.props.token}/>*/}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    console.log("mapStateToProps",state);
    return {
        // detail:this.state.detail,
        isLoading: state.alokasiReducer.isLoading,
        alokasiDetail:state.alokasiReducer.alokasi_data,
        isLoadingDetailSatuan: state.stockReportReducer.isLoadingDetailSatuan,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
};

export default connect(mapStateToProps)(ListAlokasiReport);