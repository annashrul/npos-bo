import React,{Component} from 'react'
import Layout from 'components/App/Layout'
import Paginationq from "helper";
import {FetchAlokasi, FetchAlokasiExcel, FetchAlokasiDetail} from "redux/actions/inventory/alokasi.action";
import connect from "react-redux/es/connect/connect";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import DetailAlokasi from "components/App/modals/report/inventory/alokasi_report/detail_alokasi";
import AlokasiReportExcel from "components/App/modals/report/inventory/alokasi_report/form_alokasi_excel";
import Select from 'react-select';
import moment from "moment";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import {rangeDate} from "helper";
import Preloader from "Preloader";
import {statusQ} from "helper";
class AlokasiReport extends Component{
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
            status:"",
            status_data:[],
            sort:"",
            sort_data:[],
            filter:"",
            filter_data:[],
        }
    }
    componentWillMount(){
        let page=localStorage.page_alokasi_report;
        this.handleParameter(page!==undefined&&page!==null?page:1);
    }
    componentDidMount(){
        if (localStorage.location_alokasi_report !== undefined && localStorage.location_alokasi_report !== '') {
            this.setState({location: localStorage.location_alokasi_report})
        }
        if (localStorage.any_alokasi_report !== undefined && localStorage.any_alokasi_report !== '') {
            this.setState({any: localStorage.any_alokasi_report})
        }
        if (localStorage.date_from_alokasi_report !== undefined && localStorage.date_from_alokasi_report !== null) {
            this.setState({startDate: localStorage.date_from_alokasi_report})
        }
        if (localStorage.date_to_alokasi_report !== undefined && localStorage.date_to_alokasi_report !== null) {
            this.setState({endDate: localStorage.date_to_alokasi_report})
        }
        if (localStorage.sort_alokasi_report !== undefined && localStorage.sort_alokasi_report !== null) {
            this.setState({sort: localStorage.sort_alokasi_report})
        }
        if (localStorage.filter_alokasi_report !== undefined && localStorage.filter_alokasi_report !== null) {
            this.setState({filter: localStorage.filter_alokasi_report})
        }
        if (localStorage.status_alokasi_report !== undefined && localStorage.status_alokasi_report !== null) {
            this.setState({status: localStorage.status_alokasi_report})
        }
    }
    handlePageChange(pageNumber){
        localStorage.setItem("page_alokasi_report",pageNumber);
        this.props.dispatch(FetchAlokasi(pageNumber))
    }
    toggle(e,code,barcode,name){
        e.preventDefault();
        localStorage.setItem("code",code);
        localStorage.setItem("barcode",barcode);
        localStorage.setItem("name",name);
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("detailAlokasi"));
        this.props.dispatch(FetchAlokasiDetail(1,code,'','',''))
    };
    handleEvent = (event, picker) => {
        const awal = picker.startDate._d.toISOString().substring(0,10);
        const akhir = picker.endDate._d.toISOString().substring(0,10);
        localStorage.setItem("date_from_alokasi_report",`${awal}`);
        localStorage.setItem("date_to_alokasi_report",`${akhir}`);
        this.setState({
            startDate:awal,
            endDate:akhir
        });
    };
    handleSearch(e){
        e.preventDefault();
        localStorage.setItem("any_alokasi_report",this.state.any);
        this.handleParameter(1);
    }
    handleParameter(pageNumber){
        let dateFrom=localStorage.date_from_alokasi_report;
        let dateTo=localStorage.date_to_alokasi_report;
        let lokasi = localStorage.location_alokasi_report;
        let any = localStorage.any_alokasi_report;
        let status=localStorage.status_alokasi_report;
        let sort=localStorage.sort_alokasi_report;
        let filter=localStorage.filter_alokasi_report;
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
            where+=`&search=${any}`
        }
        this.setState({
            where_data:where
        })
        this.props.dispatch(FetchAlokasi(pageNumber,where))
        // this.props.dispatch(FetchAlokasiExcel(pageNumber,where))
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
        });
        let status = [
            {kode:"",value: "Semua"},
            {kode:"3",value: "Diterima"},
            {kode:"2",value: "Dikirim"},
            {kode:"1",value: "Packing"},
            {kode:"0",value: "Proses"},
        ];
        let data_status=[];
        status.map((i) => {
            data_status.push({
                value: i.kode,
                label: i.value
            });
        });
        let filter = [
            {kode:"no_faktur_mutasi",value: "Faktur Mutasi"},
            {kode:"tgl_mutasi",value: "Tanggal Mutasi"},
            {kode:"status",value: "Status"},
        ];
        let data_filter=[];
        filter.map((i) => {
            data_filter.push({
                value: i.kode,
                label: i.value
            });
        });
        this.setState({
            sort_data: data_sort,
            filter_data: data_filter,
            status_data: data_status,
        });
        localStorage.setItem('status_alokasi_report',this.state.status===''||this.state.status===undefined?status[0].kode:localStorage.status_production_report)
        localStorage.setItem('sort_alokasi_report',this.state.sort===''||this.state.sort===undefined?sort[0].kode:localStorage.sort_alokasi_report)
        localStorage.setItem('filter_alokasi_report',this.state.filter===''||this.state.filter===undefined?filter[0].kode:localStorage.filter_alokasi_report)
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
                })
                this.setState({
                    location_data: lk,
                })
            }
        }
    }
    HandleChangeLokasi(lk) {
        this.setState({
            location: lk.value
        })
        localStorage.setItem('location_alokasi_report', lk.value);
    }
    handleChange(event){
        this.setState({ [event.target.name]: event.target.value });
    }

    HandleChangeSort(sr) {
        this.setState({
            sort: sr.value,
        });
        localStorage.setItem('sort_alokasi_report', sr.value);
    }
    HandleChangeFilter(fl) {
        this.setState({
            filter: fl.value,
        });
        localStorage.setItem('filter_alokasi_report', fl.value);
    }
    HandleChangeStatus(st) {
        this.setState({
            status: st.value,
        });
        localStorage.setItem('status_alokasi_report', st.value);
    }

    toggleModal(e,total,perpage) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        let range = total*perpage;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formAlokasiExcel"));
        this.props.dispatch(FetchAlokasiExcel(1,this.state.where_data,total));
    }


    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        const {per_page,current_page,from,to,data,total} = this.props.alokasiReport;
        return (
            <Layout page="Laporan Alokasi">
                <div className="col-12 box-margin">
                    <div className="card">
                        <div className="card-body">
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
                                            <input type="text" className="form-control" value={`${this.state.startDate} to ${this.state.endDate}`} style={{padding: '10px',width: '185px',fontWeight:'bolder'}}/>
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
                                <div className="col-6 col-xs-6 col-md-2"></div>
                                <div className="col-6 col-xs-6 col-md-2"></div>
                                <div className="col-6 col-xs-6 col-md-2"></div>
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
                                <div className="col-6 col-xs-6 col-md-3">
                                    <div className="form-group">
                                        <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary" onClick={this.handleSearch}>
                                            <i className="fa fa-search"/>
                                        </button>
                                        <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary" onClick={(e => this.toggleModal(e,total,per_page))}>
                                            <i className="fa fa-print"></i> Export
                                        </button>
                                    </div>

                                </div>

                            </div>
                            <div className="table-responsive" style={{overflowX: "auto"}}>
                                <table className="table table-hover table-bordered">
                                    <thead className="bg-light">
                                    <tr>
                                        <th className="text-black" style={columnStyle} rowSpan="2">#</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">No Faktur Mutasi</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Tanggal</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Lokasi Asal</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Lokasi Tujuan</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Status</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">No. Faktur Beli</th>
                                        <th className="text-black" style={columnStyle} rowSpan="2">Keterangan</th>
                                    </tr>
                                    </thead>
                                    {
                                        !this.props.isLoading?(
                                            <tbody>
                                            {
                                                (
                                                    typeof data === 'object' ? data.length>0?
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
                                                                    <td style={columnStyle}>{v.no_faktur_mutasi}</td>
                                                                    <td style={columnStyle}>{moment(v.tgl_mutasi).format("DD-MM-YYYY")}</td>
                                                                    <td style={columnStyle}>{v.lokasi_asal}</td>
                                                                    <td style={columnStyle}>{v.lokasi_tujuan}</td>
                                                                    <td style={columnStyle}>{
                                                                        v.status==='0'?statusQ('danger','proses'):(v.status==='1'?statusQ('warning','packing'):(v.status==='2'?statusQ('info','dikirim'):(v.status==='3'?statusQ('success','diterima'):"")))
                                                                        // v.status===0?statusQ('danger','proses'):(v.status===1?statusQ('warning','packing')?(v.status===2?statusQ('info','dikirim'):statusQ('info','diterima')):""):""
                                                                    }</td>
                                                                    <td style={columnStyle}>{v.no_faktur_beli?v.no_faktur_beli:'-'}</td>
                                                                    <td style={columnStyle}>{v.keterangan?v.keterangan:'-'}</td>

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
                            <div style={{"marginTop":"20px","float":"right"}}>
                                <Paginationq
                                    current_page={current_page}
                                    per_page={per_page}
                                    total={total}
                                    callback={this.handlePageChange.bind(this)}
                                />
                            </div>
                            <DetailAlokasi alokasiDetail={this.props.alokasiDetail}/>
                            <AlokasiReportExcel startDate={this.state.startDate} endDate={this.state.endDate} />
                        </div>
                    </div>
                </div>
            </Layout>
            );
    }
}

const mapStateToProps = (state) => {
    return {
        alokasiReport:state.alokasiReducer.data,
        isLoadingDetail: state.alokasiReducer.isLoadingDetail,
        auth:state.auth,
        isLoading: state.alokasiReducer.isLoading,
        alokasiDetail:state.alokasiReducer.alokasi_data,
        alokasiReportExcel:state.alokasiReducer.report_excel,
        isLoadingDetailSatuan: state.stockReportReducer.isLoadingDetailSatuan,
        isOpen: state.modalReducer,
        type: state.modalTypeReducer,
    }
}
export default connect(mapStateToProps)(AlokasiReport);