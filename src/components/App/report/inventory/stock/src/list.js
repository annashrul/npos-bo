import React,{Component} from 'react'
import {FetchStockReport, FetchStockReportDetailSatuan} from "redux/actions/report/inventory/stock_report.action";
import connect from "react-redux/es/connect/connect";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import DetailStockReportSatuan from "components/App/modals/report/inventory/stock_report/detail_stock_report_satuan";
import Preloader from "Preloader";
import Select from 'react-select';
import moment from "moment";
import DateRangePicker from 'react-bootstrap-daterangepicker';
const range = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
    "Last 7 Days": [moment().subtract(6, "days"), moment()],
    "Last 30 Days": [moment().subtract(29, "days"), moment()],
    "This Month": [moment().startOf("month"), moment().endOf("month")],
    "Last Month": [
        moment()
            .subtract(1, "month")
            .startOf("month"),
        moment()
            .subtract(1, "month")
            .endOf("month")
    ],
    "Last Year": [
        moment()
            .subtract(1, "year")
            .startOf("year"),
        moment()
            .subtract(1, "year")
            .endOf("year")
    ]
};
class ListStockReport extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.state={
            location:"",
            location_data:[],
            activePage:1,
            status: [
                {id: 1, value: "<",label:'Kurang Dari (<)'},
                {id: 2, value: ">", label:'Lebih Dari (>)'},
                {id: 3, value: "=", label:'Sama Dengan (=)'},
            ],
            filter_stock_report:'',
            startDate:localStorage.getItem("startDateAlokasiReport")===null?moment(new Date()).format("yyyy-MM-DD"):localStorage.getItem("startDateAlokasiReport"),
            endDate:localStorage.getItem("endDateAlokasiReport")===null?moment(new Date()).format("yyyy-MM-DD"):localStorage.getItem("endDateAlokasiReport"),
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
    
    HandleCommonInputChange(e,errs=true,st=0){
        const column = e.target.name;
        const val = e.target.value;
        this.setState({
            [column]: val
        });
        if(errs){
            let err = Object.assign({}, this.state.error, {
                [column]: ""
            });
            this.setState({
                error: err
            });
        }
    }

    handleEvent = (event, picker) => {
        console.log("start: ", picker.startDate);
        console.log("end: ", picker.endDate._d.toISOString());
        // end:  2020-07-02T16:59:59.999Z
        const awal = picker.startDate._d.toISOString().substring(0,10);
        const akhir = picker.endDate._d.toISOString().substring(0,10);
        localStorage.setItem("startDateProduct",`${awal}`);
        localStorage.setItem("endDateProduct",`${akhir}`);
        this.setState({
            startDate:awal,
            endDate:akhir
        });
        // console.log(picker.startDate._d.toISOString());
        // console.log(picker.endDate._d.toISOString());
    };
    handleSubmit(e){
        e.preventDefault();
        console.log("log",this.state.activePage+this.state.search+this.state.startDate+this.state.endDate+this.state.location)
        this.props.dispatch(FetchStockReport(this.state.activePage,this.state.search,this.state.startDate,this.state.endDate,this.state.location,this.state.filter_stock_report))
    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.auth.user) {
          let lk = []
          let loc = nextProps.auth.user.lokasi;
          if(loc!==undefined){
                lk.push({
                    value: '-',
                    label: 'Pilih Lokasi'
                });
              loc.map((i) => {
                lk.push({
                  value: i.kode,
                  label: i.nama
                });
              })
              this.setState({
                location_data: lk,
              })
          }
          console.log("log lok",nextProps.auth.user.lokasi);
        }
      }
      HandleChangeLokasi(lk) {
        this.setState({
            location: lk.value
        })
        localStorage.setItem('lk_stock_report', lk.value);
    }

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
                <div className="row">
                    <div className="col-6 col-xs-6 col-md-2">
                        <div className="form-group">
                            <label htmlFor=""> Periode </label>
                            <DateRangePicker
                                style={{display:'unset'}}
                                ranges={range}
                                alwaysShowCalendars={true}
                                onEvent={this.handleEvent}
                            >
                                <input type="text" className="form-control" name="date_product" value={`${this.state.startDate} to ${this.state.endDate}`} style={{padding: '10px',width: '185px',fontWeight:'bolder'}}/>
                                {/*<input type="text" className="form-control" name="date_product" value={`${this.state.startDate} to ${this.state.endDate}`}/>*/}
                            </DateRangePicker>
                        </div>
                    </div>

                    <div className="col-6 col-xs-6 col-md-2">
                        <div className="form-group">
                            <label htmlFor="">Destination</label>
                                <Select
                                    options={this.state.location_data}
                                    onChange={this.HandleChangeLokasi}
                                    placeholder="Pilih Lokasi"
                                    value = {
                                        this.state.location_data.find(op => {
                                        return op.value === this.state.location
                                        })
                                    }
                                    />
                        </div>
                    </div>

                    <div className="col-6 col-xs-6 col-md-2">
                        <div className="form-group">
                            <label htmlFor="exampleFormControlSelect1">Filter</label>
                            <div className="input-group">
                                <select className="form-control form-control-lg" onChange={(e => this.HandleCommonInputChange(e))} id="filter_stock_report" name="filter_stock_report" style={{padding: '11px',width: '185px',fontWeight:'bolder'}}>
                                    {
                                        this.state.status.map((v,i)=>{
                                            return (<option key={i} value={v.value} selected={localStorage.getItem('filter_stock_report')===v.value?true:false}>{v.label}</option>)
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-xs-6 col-md-2">
                    <label htmlFor="exampleFormControlSelect1">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                        <div className="form-group">
                            <input className={"form-control"} type={"text"} style={{padding: '9px',width: '185px',fontWeight:'bolder'}} name="search" value={this.state.search} onChange={(e) => this.HandleCommonInputChange(e, false)}></input>
                            {/* <button style={{marginTop:"27px",marginRight:"2px"}} type="submit" className="btn btn-primary"><i className="fa fa-search"></i></button> */}
                        </div>
                    </div>
                    <div className="col-6 col-xs-6 col-md-4">
                        <div className="form-group">
                            <button onClick={(e=>this.handleSubmit(e))} style={{marginTop:"29px",marginRight:"2px", padding:"8px"}} type="submit" className="btn btn-primary" ><i className="fa fa-search"></i></button>
                            <button style={{marginTop:"29px",marginRight:"2px", padding:"8px"}} type="submit" className="btn btn-primary" ><i className="fa fa-excel"> Export Excel</i></button>
                            {/* <button style={{marginTop:"27px",marginRight:"2px"}} type="button" onClick={(e)=>this.toggleModal(e)} className="btn btn-primary"><i className="fa fa-plus"></i></button>
                            <button style={{marginTop:"27px",marginRight:"2px"}} type="button" onClick={this.exportPDF} className="btn btn-primary"><i className="fa fa-file-pdf-o"></i></button>
                            <ReactHTMLTableToExcel
                                className="btn btn-primary btnBrg"
                                table="emp"
                                filename="barang"
                                sheet="barang"
                                buttonText="export excel">
                            </ReactHTMLTableToExcel> */}
                        </div>
                    </div>
                </div>
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
        auth:state.auth,
        isLoading: state.stockReportReducer.isLoading,
        stockReportDetailSatuan:state.stockReportReducer.dataDetailSatuan,
        isLoadingDetailSatuan: state.stockReportReducer.isLoadingDetailSatuan,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
};

export default connect(mapStateToProps)(ListStockReport);