import React,{Component} from 'react'
import connect from "react-redux/es/connect/connect";
import {deleteAdjustment, FetchAdjustment, FetchAdjustmentDetail} from "redux/actions/adjustment/adjustment.action";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import Paginationq, {statusQ} from "helper";
import DetailAdjustment from "components/App/modals/report/inventory/adjustment_report/detail_adjustment_report";
import Swal from "sweetalert2";
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
class ListAdjustmentReport extends Component{
    constructor(props){
        super(props);
        this.handlesearch = this.handlesearch.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.state={
            detail:{}
        }
    }
    handlePageChange(pageNumber){
        console.log(`active page is ${pageNumber}`);
        localStorage.setItem("page_customer",pageNumber);
        this.props.dispatch(FetchAdjustment(pageNumber,''))
    }
    handlesearch(e){
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        let any = data.get('field_any');
        localStorage.setItem('any_customer',any);
        if(any===''||any===null||any===undefined){
            this.props.dispatch(FetchAdjustment(1,''))
        }else{
            this.props.dispatch(FetchAdjustment(1,any))
        }
    }
    toggleModal(e, kd_trx) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("detailAdjustment"));
        this.props.dispatch(FetchAdjustmentDetail(1,kd_trx))
    }
    handleDelete(e,id){
        console.log(id);
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                this.props.dispatch(deleteAdjustment(id,this.props.token));
            }
        })

    }
    
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
        this.props.dispatch(FetchAdjustment(this.state.activePage,this.state.search,this.state.startDate,this.state.endDate,this.state.location,this.state.filter_stock_report))
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
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        const {data} = this.props.data;
        console.log("log adjustment", this.props)
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

                    {/* <div className="col-6 col-xs-6 col-md-2">
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
                    </div> */}
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
                            <th className="text-black" style={columnStyle}>#</th>
                            <th className="text-black" style={columnStyle}>Code</th>
                            <th className="text-black" style={columnStyle}>Date</th>
                            <th className="text-black" style={columnStyle}>Name</th>
                            <th className="text-black" style={columnStyle}>Location</th>
                            <th className="text-black" style={columnStyle}>Note</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            (
                                typeof data === 'object' ?
                                    data.map((v,i)=>{
                                        return(
                                            <tr key={i}>
                                                <td style={columnStyle}>{/* Example split danger button */}
                                                    <div className="btn-group">
                                                        <button className="btn btn-primary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            Action
                                                        </button>
                                                        <div className="dropdown-menu">
                                                            <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.toggleModal(e,v.kd_trx)}>Detail</a>
                                                            {/* <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.handleDelete(e,v.kd_trx)}>Delete</a> */}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={columnStyle}>{v.kd_trx}</td>
                                                <td style={columnStyle}>{v.tgl}</td>
                                                <td style={columnStyle}>{v.username}</td>
                                                <td style={columnStyle}>{v.lokasi}</td>
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
                {/* <div style={{"marginTop":"20px","float":"right"}}>
                    <Paginationq
                        current_page={current_page}
                        per_page={per_page}
                        total={total}
                        callback={this.handlePageChange.bind(this)}
                    />
                </div> */}
                <DetailAdjustment detail={this.props.adjustmentDetailSatuan} />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    console.log("mapStateToProps",state);
    return {
        // detail:this.state.detail,
        isLoading: state.adjustmentReducer.isLoading,
        adjustmentDetailSatuan:state.adjustmentReducer.dataDetailTransaksi,
        // isLoadingDetailSatuan: state.stockReportReducer.isLoadingDetailSatuan,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
};

export default connect(mapStateToProps)(ListAdjustmentReport)