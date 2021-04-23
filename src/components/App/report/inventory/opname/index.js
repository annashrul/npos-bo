import React,{Component} from 'react'
import Layout from 'components/App/Layout'
import Paginationq from "helper";
import {FetchOpname, FetchOpnameExcel} from "redux/actions/inventory/opname.action";
import connect from "react-redux/es/connect/connect";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import OpnameReportExcel from "components/App/modals/report/inventory/opname_report/form_opname_excel";
import Select from 'react-select';
import moment from "moment";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import {rangeDate} from "helper";
import Preloader from "Preloader";
import {statusQ} from "helper";
class OpnameReport extends Component{
    constructor(props){
        super(props);
        this.toggle = this.toggle.bind(this);
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.HandleChangeSort = this.HandleChangeSort.bind(this);
        this.HandleChangeFilter = this.HandleChangeFilter.bind(this);
        this.HandleChangeStatus = this.HandleChangeStatus.bind(this);
        this.state={
            where_data:"",
            any:"",
            location:"",
            location_data:[],
            startDate:moment(new Date()).format("yyyy-MM-DD"),
            endDate:moment(new Date()).format("yyyy-MM-DD"),
            sort:"",
            sort_data:[],
            filter:"",
            filter_data:[],
            status:"",
            status_data:[],
            isModalExcel:false
        }
    }

    componentWillUnmount(){
        this.setState({isModalExcel:false})
    }

    componentWillMount(){
        let page=localStorage.page_opname_report;
        this.handleParameter(page!==undefined&&page!==null?page:1);
    }
    componentDidMount(){
        if (localStorage.location_opname_report !== undefined && localStorage.location_opname_report !== '') {
            this.setState({location: localStorage.location_opname_report})
        }
        if (localStorage.any_opname_report !== undefined && localStorage.any_opname_report !== '') {
            this.setState({any: localStorage.any_opname_report})
        }
        if (localStorage.date_from_opname_report !== undefined && localStorage.date_from_opname_report !== null) {
            this.setState({startDate: localStorage.date_from_opname_report})
        }
        if (localStorage.date_to_opname_report !== undefined && localStorage.date_to_opname_report !== null) {
            this.setState({endDate: localStorage.date_to_opname_report})
        }
        if (localStorage.sort_opname_report !== undefined && localStorage.sort_opname_report !== null) {
            this.setState({sort: localStorage.sort_opname_report})
        }
        if (localStorage.filter_opname_report !== undefined && localStorage.filter_opname_report !== null) {
            this.setState({filter: localStorage.filter_opname_report})
        }
        if (localStorage.status_opname_report !== undefined && localStorage.status_opname_report !== null) {
            this.setState({status: localStorage.status_opname_report})
        }
    }
    handlePageChange(pageNumber){
        localStorage.setItem("page_opname_report",pageNumber);
        this.props.dispatch(FetchOpname(pageNumber))
    }
    toggle(e,code,barcode,name){
        e.preventDefault();
        localStorage.setItem("code",code);
        localStorage.setItem("barcode",barcode);
        localStorage.setItem("name",name);
        this.setState({isModalExcel:true})
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("detailOpname"));
        // this.props.dispatch(FetchOpnameData(code))
    };
    handleEvent = (event, picker) => {
        const awal = moment(picker.startDate._d).format('YYYY-MM-DD');
        const akhir = moment(picker.endDate._d).format('YYYY-MM-DD');
        localStorage.setItem("date_from_opname_report",`${awal}`);
        localStorage.setItem("date_to_opname_report",`${akhir}`);
        this.setState({
            startDate:awal,
            endDate:akhir
        });
    };
    handleSearch(e){
        e.preventDefault();
        localStorage.setItem("any_opname_report",this.state.any);
        this.handleParameter(1);
    }
    handleParameter(pageNumber){
        let dateFrom=localStorage.date_from_opname_report;
        let dateTo=localStorage.date_to_opname_report;
        let lokasi = localStorage.location_opname_report;
        let any = localStorage.any_opname_report;
        let sort=localStorage.sort_opname_report;
        let filter=localStorage.filter_opname_report;
        let status=localStorage.status_opname_report;
        let where='';
        if(dateFrom!==undefined&&dateFrom!==null){
            where+=`&datefrom=${dateFrom}&dateto=${dateTo}`;
        }
        if(lokasi!==undefined&&lokasi!==null&&lokasi!==''){
            where+=`&lokasi=${lokasi}`;
        }
        if(status!==undefined&&status!==null&&status!==''){
            where+=`&status=${status}`;
        }
        if(filter!==undefined&&filter!==null&&filter!==''){
            if(sort!==undefined&&sort!==null&&sort!==''){
                where+=`&sort=${filter}|${sort}`;
            }
        }
        if(any!==undefined&&any!==null&&any!==''){
            where+=`&q=${any}`
        }
        this.setState({
            where_data:where
        })
        this.props.dispatch(FetchOpname(pageNumber,where))
        // this.props.dispatch(FetchOpnameExcel(pageNumber,where))
    }
    componentWillReceiveProps = (nextProps) => {
        let sort = [
            {kode:"desc",value: "DESCENDING"},
            {kode:"asc",value: "ASCENDING"},
        ];
        let data_sort=[];
        sort.map((i) => {
            data_sort.push({
                value: i.kode,
                label: i.value
            });
            return null;
        });
        let filter = [
            {kode:"kd_trx",value: "Kode Trx"},
            {kode:"tgl",value: "Tanggal"},
            {kode:"status",value: "Status"},
        ];
        let data_filter=[];
        filter.map((i) => {
            data_filter.push({
                value: i.kode,
                label: i.value
            });
            return null;
        });
        let status = [
            {kode:"",value: "Semua"},
            {kode:"0",value: "belum opname"},
            {kode:"1",value: "sudah opname"},
        ];
        let data_status=[];
        status.map((i) => {
            data_status.push({
                value: i.kode,
                label: i.value
            });
            return null;
        });
        this.setState({
            sort_data: data_sort,
            filter_data: data_filter,
            status_data: data_status,
        });
        if (nextProps.auth.user) {
            let lk = [{
                value: '',
                label: 'Semua Lokasi'
            }];
            let loc = nextProps.auth.user.lokasi;
            if(loc!==undefined){
                loc.map((i) => {
                    lk.push({
                        value: i.kode,
                        label: i.nama
                    });
                    return null;
                })
                this.setState({
                    location_data: lk,
                })
            }
        }
        
        localStorage.setItem('status_opname_report',this.state.status===''||this.state.status===undefined?status[0].kode:localStorage.status_opname_report)
        localStorage.setItem('sort_opname_report',this.state.sort===''||this.state.sort===undefined?sort[0].kode:localStorage.sort_opname_report)
        localStorage.setItem('filter_opname_report',this.state.filter===''||this.state.filter===undefined?filter[0].kode:localStorage.filter_opname_report)
    }
    HandleChangeLokasi(lk) {
        this.setState({
            location: lk.value
        })
        localStorage.setItem('location_opname_report', lk.value);
    }
    handleChange(event){
        this.setState({ [event.target.name]: event.target.value });
    }

    HandleChangeSort(sr) {
        this.setState({
            sort: sr.value,
        });
        localStorage.setItem('sort_opname_report', sr.value);
    }
    HandleChangeFilter(fl) {
        this.setState({
            filter: fl.value,
        });
        localStorage.setItem('filter_opname_report', fl.value);
    }
    HandleChangeStatus(st) {
        this.setState({
            status: st.value,
        });
        localStorage.setItem('status_opname_report', st.value);
    }


    toggleModal(e,total,perpage) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        // let range = total*perpage;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formOpnameExcel"));
        this.props.dispatch(FetchOpnameExcel(1,this.state.where_data,total));
    }

    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        const {
            per_page,
            last_page,
            current_page,
            // from,
            // to,
            data,
            // total
        } = this.props.opnameReport;
        return (
            <Layout page="Laporan Opname">
                <div className="row">
                                <div className="col-md-10" style={{zoom:"85%"}}>
                                    <div className="row">
                                        <div className="col-6 col-xs-6 col-md-2">
                                            <div className="form-group">
                                                <label htmlFor=""> Periode </label>
                                                <DateRangePicker
                                                    style={{display:'unset'}}
                                                    ranges={rangeDate}
                                                    alwaysShowCalendars={true}
                                                    onEvent={this.handleEvent}
                                                >
                                                    <input readOnly={true} type="text" className="form-control" value={`${this.state.startDate} to ${this.state.endDate}`} style={{padding: '10px',fontWeight:'bolder'}}/>
                                                </DateRangePicker>
                                            </div>
                                        </div>

                                        <div className="col-6 col-xs-6 col-md-2">
                                            <div className="form-group">
                                                <label htmlFor="">Lokasi</label>
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
                                                <label className="control-label font-12">
                                                    Status
                                                </label>
                                                <Select
                                                    options={this.state.status_data}
                                                    // placeholder="Pilih Tipe Kas"
                                                    onChange={this.HandleChangeStatus}
                                                    value={
                                                        this.state.status_data.find(op => {
                                                            return op.value === this.state.status
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="col-6 col-xs-6 col-md-2">
                                            <div className="form-group">
                                                <label className="control-label font-12">
                                                    Filter
                                                </label>
                                                <Select
                                                    options={this.state.filter_data}
                                                    // placeholder="Pilih Tipe Kas"
                                                    onChange={this.HandleChangeFilter}
                                                    value={
                                                        this.state.filter_data.find(op => {
                                                            return op.value === this.state.filter
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="col-6 col-xs-6 col-md-2">
                                            <div className="form-group">
                                                <label className="control-label font-12">
                                                    Sort
                                                </label>
                                                <Select
                                                    options={this.state.sort_data}
                                                    // placeholder="Pilih Tipe Kas"
                                                    onChange={this.HandleChangeSort}
                                                    value={
                                                        this.state.sort_data.find(op => {
                                                            return op.value === this.state.sort
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="col-6 col-xs-6 col-md-2">
                                            <div className="form-group">
                                                <label>Cari</label>
                                                <input className="form-control" type="text" style={{padding: '9px',fontWeight:'bolder'}} name="any" value={this.state.any} onChange={(e) => this.handleChange(e)}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="col-6 col-xs-6 col-md-2" style={{zoom:"85%",textAlign:"right"}}>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary" onClick={this.handleSearch}>
                                                    <i className="fa fa-search"/>
                                                </button>
                                                <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary" onClick={(e => this.toggleModal(e,(last_page*per_page),per_page))}>
                                                    <i className="fa fa-print"/> Export
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                            {/*DATA EXCEL*/}
                            <table className="table table-hover"  id="report_opname_to_excel" style={{display:"none"}}>
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="text-black" colSpan={11}>{this.state.startDate} - {this.state.startDate}</th>
                                        </tr>
                                        <tr>
                                            <th className="text-black" colSpan={11}>{this.state.location===''?'SEMUA LOKASI':this.state.location}</th>
                                        </tr>

                                        <tr>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Kode Trx</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Tanggal</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>kode Barang</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Nama Barang</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Kel. Barang</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Barcode</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Qty Fisik</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Stok Terakhir</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Lokasi</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Harga Beli</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Status</th>
                                        </tr>
                                        <tr/>
                                    </thead>
                                    {
                                        <tbody>
                                        {
                                            typeof this.props.opnameReportExcel.data==='object'? this.props.opnameReportExcel.data.length>0?
                                                this.props.opnameReportExcel.data.map((v,i)=>{
                                                    return (
                                                        <tr key={i}>
                                                            <td style={columnStyle}>{v.kd_trx}</td>
                                                            <td style={columnStyle}>{moment(v.tanggal).format("DD-MM-YYYY")}</td>
                                                            <td style={columnStyle}>{v.kd_brg}</td>
                                                            <td style={columnStyle}>{v.nm_brg}</td>
                                                            <td style={columnStyle}>{v.nm_kel_brg}</td>
                                                            <td style={columnStyle}>{v.barcode}</td>
                                                            <td style={columnStyle}>{v.qty_fisik}</td>
                                                            <td style={columnStyle}>{v.stock_terakhir}</td>
                                                            <td style={columnStyle}>{v.lokasi}</td>
                                                            <td style={columnStyle}>{v.hrg_beli}</td>
                                                            <td style={columnStyle}>{v.status==='0'?statusQ('danger','Belum Opname'):(v.status==='1'?statusQ('warning','Sudah Opname'):"")}</td>
                                                        </tr>
                                                    );
                                                }) : <tr><td>No Data</td></tr> : <tr><td>No Data</td></tr>
                                        }
                                        </tbody>
                                    }
                                </table>
                                {/*END DATA EXCEL*/}
                            <div style={{overflowX: "auto",zoom:"90%"}}>
                                <table className="table table-hover table-bordered">
                                    <thead className="bg-light">
                                    <tr>
                                        {/* <th className="text-black" style={columnStyle} rowSpan="2">#</th> */}
                                        <th className="text-black" style={columnStyle} rowSpan="2">No</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Kode Trx</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Tanggal</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">kode Barang</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Nama Barang</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Kel. Barang</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Barcode</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Qty Fisik</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Stok Terakhir</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Lokasi</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Harga Beli</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Status</th>
                                    </tr>
                                    </thead>
                                    {
                                      
                                            <tbody>
                                            {
                                                (
                                                    typeof data === 'object' ? data.length>0?
                                                        data.map((v,i)=>{
                                                            return(
                                                                <tr key={i}>
                                                                    <td style={columnStyle}> {i+1 + (10 * (parseInt(current_page,10)-1))}</td>
                                                                    {/* <td style={columnStyle}>Example split danger button */}
                                                                        {/* <div className="btn-group">
                                                                            <button className="btn btn-primary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                Action
                                                                            </button>
                                                                            <div className="dropdown-menu"> */}
                                                                                {/* <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.handleEdit(e,v.kd_brg)}>Export</a> */}
                                                                                {/* <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.toggle(e,v.no_delivery_note,'','')}>Detail</a>
                                                                            </div>
                                                                        </div>
                                                                    </td> */}
                                                                    <td style={columnStyle}>{v.kd_trx}</td>
                                                                    <td style={columnStyle}>{moment(v.tanggal).format("DD-MM-YYYY")}</td>
                                                                    <td style={columnStyle}>{v.kd_brg}</td>
                                                                    <td style={columnStyle}>{v.nm_brg}</td>
                                                                    <td style={columnStyle}>{v.nm_kel_brg}</td>
                                                                    <td style={columnStyle}>{v.barcode}</td>
                                                                    <td style={columnStyle}>{v.qty_fisik}</td>
                                                                    <td style={columnStyle}>{v.stock_terakhir}</td>
                                                                    <td style={columnStyle}>{v.lokasi}</td>
                                                                    <td style={columnStyle}>{v.hrg_beli}</td>
                                                                    <td style={columnStyle}>{
                                                                        v.status==='0'?statusQ('warning','Belum Opname'):(v.status==='1'?statusQ('success','Sudah Opname'):statusQ('danger','Cancel Opname'))
                                                                        // v.status===0?statusQ('danger','proses'):(v.status===1?statusQ('warning','packing')?(v.status===2?statusQ('info','dikirim'):statusQ('info','diterima')):""):""
                                                                    }</td>

                                                                </tr>
                                                            )
                                                        })
                                                        : <tr><td>No Data</td></tr> : <tr><td>No Data</td></tr>
                                                )
                                            }
                                            </tbody>
                                    }
                                </table>

                            </div>
                            <div style={{"marginTop":"20px","float":"right"}}>
                                <Paginationq
                                    current_page={current_page}
                                    per_page={per_page}
                                    total={parseInt((per_page*last_page),10)}
                                    callback={this.handlePageChange.bind(this)}
                                />
                            </div>
                            {/* <DetailOpname opnameDetail={this.props.opnameDetail}/> */}
                            <OpnameReportExcel startDate={this.state.startDate} endDate={this.state.endDate} location={this.state.location} />
                        
            </Layout>
            );
    }
}

const mapStateToProps = (state) => {
    
    return {
        opnameReport:state.opnameReducer.report,
        isLoadingDetail: state.opnameReducer.isLoadingDetail,
        opnameReportExcel:state.opnameReducer.report_excel,
        auth:state.auth,
        isLoading: state.opnameReducer.isLoading,
        // opnameDetail:state.opnameReducer.opname_data,
        // isLoadingDetailSatuan: state.stockReportReducer.isLoadingDetailSatuan,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(OpnameReport);