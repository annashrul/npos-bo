import React,{Component} from 'react'
import Layout from 'components/App/Layout'
import Paginationq from "helper";
import {FetchLogTrx} from "redux/actions/report/log/log.action";
import connect from "react-redux/es/connect/connect";
import moment from "moment";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import {rangeDate} from "helper";
import Preloader from "Preloader";
import { isArray } from 'lodash';
class LogTrxReport extends Component{
    constructor(props){
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleGet = this.handleGet.bind(this);
        this.state={
            where_data:"",
            any:"",
            startDate:moment(new Date()).format("yyyy-MM-DD"),
            endDate:moment(new Date()).format("yyyy-MM-DD"),
            keyName_:[],
            valData_:[],
        }
    }
    componentWillMount(){
        let page=localStorage.page_log_trx_report;
        this.handleParameter(page!==undefined&&page!==null?page:1);
    }
    componentDidMount(){
        if (localStorage.any_log_trx_report !== undefined && localStorage.any_log_trx_report !== '') {
            this.setState({any: localStorage.any_log_trx_report})
        }
        if (localStorage.date_from_log_trx_report !== undefined && localStorage.date_from_log_trx_report !== null) {
            this.setState({startDate: localStorage.date_from_log_trx_report})
        }
        if (localStorage.date_to_log_trx_report !== undefined && localStorage.date_to_log_trx_report !== null) {
            this.setState({endDate: localStorage.date_to_log_trx_report})
        }
    }
    handlePageChange(pageNumber){
        localStorage.setItem("page_log_trx_report",pageNumber);
        this.props.dispatch(FetchLogTrx(pageNumber))
    }
    handleEvent = (event, picker) => {
        const awal = moment(picker.startDate._d).format('YYYY-MM-DD');
        const akhir = moment(picker.endDate._d).format('YYYY-MM-DD');
        localStorage.setItem("date_from_log_trx_report",`${awal}`);
        localStorage.setItem("date_to_log_trx_report",`${akhir}`);
        this.setState({
            startDate:awal,
            endDate:akhir
        });
    };
    handleSearch(e){
        e.preventDefault();
        localStorage.setItem("any_log_trx_report",this.state.any);
        this.handleParameter(1);
    }
    handleParameter(pageNumber){
        let dateFrom=localStorage.date_from_log_trx_report;
        let dateTo=localStorage.date_to_log_trx_report;
        let any = localStorage.any_log_trx_report;
        let where='';
        if(dateFrom!==undefined&&dateFrom!==null){
            where+=`&datefrom=${dateFrom}&dateto=${dateTo}`;
        }
        if(any!==undefined&&any!==null&&any!==''){
            where+=`&q=${any}`
        }
        this.setState({
            where_data:where
        })
        this.props.dispatch(FetchLogTrx(pageNumber,where))
        // this.props.dispatch(FetchLogTrxExcel(pageNumber,where))
    }
    handleGet(e,data){
        e.preventDefault();
        
        const arr_data = isArray(JSON.parse(data))?JSON.parse(data):[JSON.parse(data)];

        arr_data.map((v,i)=>{
            const not_allowed = ['id','password'];
            Object.keys(arr_data[i]).filter(key => not_allowed.includes(key))
            .forEach(key => delete arr_data[i][key]);
            return null
        })

        const keyName = arr_data.map((o) => {
                return Object.keys(o)
            }).reduce((prev, curr) => {
                return prev.concat(curr)
            }).filter((col, i, array) => {
                return array.indexOf(col) === i
            });
        
        this.setState({
            keyName_:keyName,
            valData_:arr_data
        })
        
        
    }


    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        const {
            per_page,
            last_page,
            current_page,
            // from,
            // to,
            data
        } = this.props.log_trxReport;

        
        return (
            <Layout page="Laporan LogTrx">
                <div className="col-12 box-margin">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">

                                <div className="col-md-10" style={{zoom:"85%"}}>
                                    <div className="row">
                                        <div className="col-6 col-xs-6 col-md-2">
                                            <div className="form-group">
                                                <label htmlFor="" className="control-label"> Periode </label>
                                                <DateRangePicker
                                                    style={{display:'unset'}}
                                                    ranges={rangeDate}
                                                    alwaysShowCalendars={true}
                                                    onEvent={this.handleEvent}
                                                >
                                                    <input type="text" className="form-control" value={`${this.state.startDate} to ${this.state.endDate}`} style={{padding: '10px',fontWeight:'bolder'}}/>
                                                </DateRangePicker>
                                            </div>
                                        </div>
                                        <div className="col-6 col-xs-6 col-md-2">
                                            <div className="form-group">
                                                <label htmlFor="" >Cari</label>
                                                <div className="input-group">
                                                    <input className="form-control" type="text" style={{padding: '9px',fontWeight:'bolder'}} name="any" value={this.state.any} onChange={(e) => this.handleChange(e)}/>
                                                    <div className="input-group-append">
                                                        <button className="btn btn-primary" type="button" onClick={this.handleSearch}>
                                                                <i className="fa fa-search"/>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                </div>

                                </div>

                            </div>

                            <div className="row">
                                <div className="col-4">
                                    <div className="card">
                                        <div className="card-body">
                                            <h4 className="card-title">LOG TRX</h4>
                                            <div style={{position: 'relative', overflowX: 'auto', width: 'auto', height: 400}}>
                                                <ul className="dashboard-active-timeline list-unstyled">
                                                    {
                                                        !this.props.isLoading?(
                                                            <tbody>
                                                            {
                                                                (
                                                                    typeof data === 'object' ? data.length>0?
                                                                        data.map((v,i)=>{
                                                                            const items = ['bg-primary','bg-info','bg-warning','bg-danger','bg-dark']
                                                                            let rand_bg = items[Math.floor(Math.random() * items.length)];
                                                                            return(
                                                                                <a href="!#" onClick={(e)=>this.handleGet(e,v.detail_trx)}>
                                                                                    <li className="d-flex align-items-center mb-15" key={i}>
                                                                                        <div className={"timeline-icon " +(rand_bg) +" mr-3"}>
                                                                                            {(v.kd_trx).substring(0,2)}
                                                                                        </div>
                                                                                        <div className="timeline-info">
                                                                                            <p className="font-weight-bold mb-0">{v.aksi}</p>
                                                                                            <span>{v.transaksi} | {v.nama_user}</span>
                                                                                            <p className="mb-0">{moment(v.tanggal).format('LLLL')}</p>
                                                                                        </div>
                                                                                    </li>
                                                                                </a>
                                                                )
                                                            })
                                                            : "No data." : "No data."
                                                    )
                                                }
                                                </tbody>
                                            ):<Preloader/>
                                        }
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="card-footer text-center">
                                            <div className="mt-2 float-right">
                                                <Paginationq
                                                    current_page={current_page}
                                                    per_page={per_page}
                                                    total={(per_page*last_page)}
                                                    callback={this.handlePageChange.bind(this)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-8">
                                    <h4 className="card-title">DETAIL TRX</h4>
                                    <div className="table-responsive" ref={element => {
                                        if (element) element.style.setProperty('overflow-x', 'auto', 'important');
                                    }}>
                                    <table className="table table-hover table-bordered">
                                        <thead className="bg-light">
                                        <tr>
                                                {
                                                    (
                                                        typeof this.state.keyName_ === 'object' ? this.state.keyName_.length>0?
                                                            this.state.keyName_.map((v,i)=>{
                                                                return(
                                                                    <th className="text-black" style={columnStyle} rowSpan="2" key={i}>{v.split('_').map(f=>{ return f.toUpperCase(); }).join(' ')}</th>
                                                                )
                                                            })
                                                            : "No data." : "No data."
                                                    )
                                                }
                                        </tr>
                                        </thead>
                                        {
                                            !this.props.isLoading?(
                                                <tbody>
                                                {
                                                    (
                                                        typeof this.state.valData_ === 'object' ? this.state.valData_.length>0?
                                                            this.state.valData_.map((v,i)=>{
                                                                return(
                                                                    <tr key={i}>
                                                                        {
                                                                            (
                                                                                typeof this.state.keyName_ === 'object' ? this.state.keyName_.length>0?
                                                                                    this.state.keyName_.map((w,j)=>{
                                                                                        return(
                                                                                            <td style={columnStyle} key={j}>{v[w]}</td>
                                                                                        )
                                                                                    })
                                                                                    : "No data." : "No data."
                                                                            )
                                                                        }

                                                                    </tr>
                                                                )
                                                            })
                                                            : "No data." : "No data."
                                                    )
                                                }
                                                </tbody>
                                            ):<Preloader/>
                                        }
                                    </table>

                                </div>
                                </div>
                            </div>
                            {/* <DetailLogTrx log_trxDetail={this.props.log_trxDetail}/> */}
                            {/* <LogTrxReportExcel startDate={this.state.startDate} endDate={this.state.endDate} location={this.state.location} /> */}
                        </div>
                    </div>
                </div>
            </Layout>
            );
    }
}

const mapStateToProps = (state) => {
    
    return {
        log_trxReport:state.log_trxReducer.report,
        isLoadingDetail: state.log_trxReducer.isLoadingDetail,
        log_trxReportExcel:state.log_trxReducer.report_excel,
        auth:state.auth,
        isLoading: state.log_trxReducer.isLoading,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(LogTrxReport);