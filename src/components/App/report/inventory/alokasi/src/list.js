import React,{Component} from 'react'
import Paginationq from "helper";
import {FetchAlokasi, FetchAlokasiDetail} from "redux/actions/inventory/alokasi.action";
import connect from "react-redux/es/connect/connect";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import DetailAlokasi from "components/App/modals/report/inventory/alokasi_report/detail_alokasi";
import Preloader from "Preloader";
import Select from 'react-select';
import moment from "moment";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import {HEADERS} from 'redux/actions/_constants'
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

class ListAlokasiReport extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state={
            location:"",
            location_data:[],
            status: [
                {id: 1, value: "0",label:'Packing'},
                {id: 2, value: "1", label:'Packed'},
                {id: 3, value: "2", label:'Received'},
            ],
            startDate:localStorage.getItem("startDateAlokasiReport")===''?moment(new Date()).format("yyyy-MM-DD"):localStorage.getItem("startDateAlokasiReport"),
            endDate:localStorage.getItem("endDateAlokasiReport")===''?moment(new Date()).format("yyyy-MM-DD"):localStorage.getItem("endDateAlokasiReport"),
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
        this.props.dispatch(FetchAlokasi(pageNumber))
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
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.auth.user) {
          let lk = []
          let loc = nextProps.auth.user.lokasi;
          if(loc!==undefined){
              loc.map((i) => {
                lk.push({
                  value: i.kode,
                  label: i.nama
                });
              })
              this.setState({
                location_data: lk,
                userid: nextProps.auth.user.id
              })
          }
        }
      }
      HandleChangeLokasi(lk) {
        let err = Object.assign({}, this.state.error, {
            location: ""
        });
        console.log(err);
        this.setState({
            location: lk.value,
            error: err
        })
        localStorage.setItem('lk_alokasi_report', lk.value);
    }

    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        const {total,last_page,per_page,current_page,from,to,data} = this.props.data;
        // const {total_dn,total_stock_awal,total_stock_masuk,total_stock_keluar,total_stock_akhir} = this.props.total;

        // let total_dn_per=0;
        // let total_first_stock_per=0;
        // let total_last_stock_per=0;
        // let total_stock_in_per=0;
        // let total_stock_out_per=0;
        // console.log("############ TOTAL DATA ##############",this.props.total);
        console.log("############ LOKASI ##############",this.state.location_data);
        return (

            <div>
                <div className="row">
                    <div className="col-6 col-xs-6 col-md-2">
                        <div className="form-group">
                            <label htmlFor=""> Periode </label>
                            <DateRangePicker
                                ranges={range}
                                alwaysShowCalendars={true}
                                onEvent={this.handleEvent}
                            >
                                <input type="text" className="form-control" name="date_product" value={`${this.state.startDate} to ${this.state.endDate}`}/>
                                {/*<input type="text" className="form-control" name="date_product" value={`${this.state.startDate} to ${this.state.endDate}`}/>*/}
                            </DateRangePicker>
                        </div>
                    </div>

                    <div className="col-6 col-xs-6 col-md-2">
                        <div className="form-group">
                            <label htmlFor="exampleFormControlSelect1">Destination</label>
                            <div className="input-group">
                                <select className="form-control form-control-lg" id="sort_name" name="sort_name">
                                    {
                                        this.state.location_data.map((v,i)=>{
                                            return (<option key={i} value={v.value} selected={localStorage.getItem('location')===v.value?true:false}>{v.label}</option>)
                                        })
                                    }
                                </select>
                                {/* <Select 
                                                    options={this.state.location_data} 
                                                    placeholder = "Pilih Lokasi"
                                                    defaultValue={{ label: "Select Location", value: "-" }}
                                                    onChange={this.HandleChangeLokasi}
                                                    value = {
                                                        this.state.location_data.find(op => {
                                                        return op.value === this.state.location
                                                        })
                                                    }
                                                    /> */}
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-xs-6 col-md-2">
                        <div className="form-group">
                            <label htmlFor="exampleFormControlSelect1">Status</label>
                            <div className="input-group">
                                <select className="form-control form-control-lg" id="status_alokasi_report" name="status_alokasi_report">
                                    {
                                        this.state.status.map((v,i)=>{
                                            return (<option key={i} value={v.value} selected={localStorage.getItem('status_alokasi_report')===v.value?true:false}>{v.label}</option>)
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-xs-6 col-md-2">
                    <label htmlFor="exampleFormControlSelect1">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                        <div className="form-group">
                            <input className={"form-control"} type={"text"}></input>
                            {/* <button style={{marginTop:"27px",marginRight:"2px"}} type="submit" className="btn btn-primary"><i className="fa fa-search"></i></button> */}
                        </div>
                    </div>
                    <div className="col-6 col-xs-6 col-md-4">
                        <div className="form-group">
                            <button style={{marginTop:"27px",marginRight:"2px"}} type="submit" className="btn btn-primary"><i className="fa fa-search"></i></button>
                            <button style={{marginTop:"27px",marginRight:"2px"}} type="submit" className="btn btn-primary"><i className="fa fa-excel"> Export Excel</i></button>
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
                <div style={{"marginTop":"20px","float":"right"}}>
                    <Paginationq
                        current_page={current_page}
                        per_page={per_page}
                        total={total}
                        callback={this.handlePageChange.bind(this)}
                    />
                </div>
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