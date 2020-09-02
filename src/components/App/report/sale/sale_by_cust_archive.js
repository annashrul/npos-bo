import React,{Component} from 'react'
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import {FetchCashReport} from "redux/actions/masterdata/cash/cash.action";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import Select from "react-select";
import Paginationq from "helper";
import Preloader from "Preloader";
import {rangeDate, toRp} from "helper";
import {FetchReportSaleByCust} from "redux/actions/sale/sale_by_cust.action";
import Swal from "sweetalert2";
import SaleByCustReportExcel from "components/App/modals/report/sale/form_sale_by_cust_excel";
import {
    deleteReportSaleByCust,
    FetchReportDetailSaleByCust,
    FetchReportSaleByCustExcel
} from "redux/actions/sale/sale_by_cust.action";
import DetailSaleByCustReport from "../../modals/report/sale/detail_sale_by_cust_report";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import {HEADERS} from "../../../../redux/actions/_constants";

class SaleByCustArchive extends Component{
    constructor(props){
        super(props);
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.HandleChangeType = this.HandleChangeType.bind(this);
        this.handleEvent = this.handleEvent.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleDetail = this.handleDetail.bind(this);
        this.HandleChangeSort = this.HandleChangeSort.bind(this);
        this.HandleChangeFilter = this.HandleChangeFilter.bind(this);
        this.HandleChangeStatus = this.HandleChangeStatus.bind(this);
        this.state={
            where_data:"",
            type_data:[],
            type:"",
            location_data:[],
            location:"",
            any_sale_by_cust_report:"",
            startDate:moment(new Date()).format("yyyy-MM-DD"),
            endDate:moment(new Date()).format("yyyy-MM-DD"),
            sort:"",
            sort_data:[],
            filter:"",
            filter_data:[],
            filter:"",
            filter_data:[],
            status:"",
            status_data:[],
        }
    }

    componentWillReceiveProps = (nextProps) => {
        let type = [
            {kode:"",value: "Semua Tipe"},
            {kode:"0",value: "Tunai"},
            {kode:"1",value: "Non Tunai"},
            {kode:"2",value: "Gabungan"},
            {kode:"3",value: "Void"},
        ];
        let data_type=[];
        type.map((i) => {
            data_type.push({
                value: i.kode,
                label: i.value
            });
        });
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
            {kode:"kd_cust",value: "Kode Cust."},
            {kode:"nama",value: "Nama"},
            {kode:"qty",value: "QTY"},
            {kode:"gross_sales",value: "Gross Sales"},
            {kode:"diskon_item",value: "Diskon Item"},
            {kode:"diskon_trx",value: "Diskon Trx"},
            {kode:"tax",value: "Tax"},
            {kode:"service",value: "Service"},
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
            {kode:"0",value: "0"},
            {kode:"1",value: "1"},
            {kode:"2",value: "2"},
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
            type_data: data_type,
        });
        if (nextProps.auth.user) {
            let lk = [{
                value: "",
                label: "Semua Lokasi"
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
        // localStorage.setItem('status_sale_by_cust_report',this.state.status===''||this.state.status===undefined?status[0].kode:localStorage.status_sale_by_cust_report)
        localStorage.setItem('sort_sale_by_cust_report',this.state.sort===''||this.state.sort===undefined?sort[0].kode:localStorage.sort_sale_by_cust_report)
        localStorage.setItem('filter_sale_by_cust_report',this.state.filter===''||this.state.filter===undefined?filter[0].kode:localStorage.filter_sale_by_cust_report)
    }
    componentWillMount(){
        let page=localStorage.getItem("pageNumber_sale_by_cust_report");
        this.checkingParameter(page===undefined&&page===null?1:page);
    }
    componentDidMount(){
        if (localStorage.location_sale_by_cust_report !== undefined && localStorage.location_sale_by_cust_report !== '') {
            this.setState({
                location: localStorage.location_sale_by_cust_report
            })
        }

        if (localStorage.type_sale_by_cust_report !== undefined && localStorage.type_sale_by_cust_report !== '') {
            this.setState({
                type: localStorage.type_sale_by_cust_report
            })
        }
        if (localStorage.any_sale_by_cust_report !== undefined && localStorage.any_sale_by_cust_report !== '') {
            this.setState({
                any: localStorage.any_sale_by_cust_report
            })
        }
        if (localStorage.date_from_sale_by_cust_report !== undefined && localStorage.date_from_sale_by_cust_report !== null) {
            this.setState({
                startDate: localStorage.date_from_sale_by_cust_report
            })
        }
        if (localStorage.date_to_sale_by_cust_report !== undefined && localStorage.date_to_sale_by_cust_report !== null) {
            this.setState({
                endDate: localStorage.date_to_sale_by_cust_report
            })
        }
        if (localStorage.sort_sale_by_cust_report !== undefined && localStorage.sort_sale_by_cust_report !== null) {
            this.setState({sort: localStorage.sort_sale_by_cust_report})
        }
        if (localStorage.filter_sale_by_cust_report !== undefined && localStorage.filter_sale_by_cust_report !== null) {
            this.setState({filter: localStorage.filter_sale_by_cust_report})
        }
        if (localStorage.status_sale_by_cust_report !== undefined && localStorage.status_sale_by_cust_report !== null) {
            this.setState({status: localStorage.status_sale_by_cust_report})
        }
    }
    handleChange(event){
        this.setState({ [event.target.name]: event.target.value });
    }
    HandleChangeType(type) {
        this.setState({
            type: type.value,
        });
        localStorage.setItem('type_sale_by_cust_report', type.value);
    }
    HandleChangeLokasi(lk) {
        this.setState({
            location: lk.value,
        });
        localStorage.setItem('location_sale_by_cust_report', lk.value);
    }
    handleEvent = (event, picker) => {
        const awal = picker.startDate._d.toISOString().substring(0,10);
        const akhir = picker.endDate._d.toISOString().substring(0,10);
        localStorage.setItem("date_from_sale_by_cust_report",`${awal}`);
        localStorage.setItem("date_to_sale_by_cust_report",`${akhir}`);
        this.setState({
            startDate:awal,
            endDate:akhir
        });
    };
    handleSearch(e){
        e.preventDefault();
        localStorage.setItem("any_sale_by_cust_report",this.state.any_sale_by_cust_report);
        this.checkingParameter(1);
    }
    checkingParameter(pageNumber){
        let where='';
        let dateFrom=localStorage.getItem("date_from_sale_by_cust_report");
        let dateTo=localStorage.getItem("date_to_sale_by_cust_report");
        let tipe=localStorage.getItem("type_sale_by_cust_report");
        let lokasi=localStorage.getItem("location_sale_by_cust_report");
        let any=localStorage.getItem("any_sale_by_cust_report");
        let sort=localStorage.sort_sale_by_cust_report;
        let filter=localStorage.filter_sale_by_cust_report;
        let status=localStorage.status_sale_by_cust_report;
        if(dateFrom!==undefined&&dateFrom!==null){
            if(where!==''){where+='&'}where+=`datefrom=${dateFrom}&dateto=${dateTo}`
        }else{
            if(where!==''){where+='&'}where+=`datefrom=${this.state.startDate}&dateto=${this.state.endDate}`
        }
        if(tipe!==undefined&&tipe!==null&&tipe!==''){
            if(where!==''){where+='&'}where+=`type=${tipe}`
        }
        // if(lokasi!==undefined&&lokasi!==null&&lokasi!==''){
        //     if(where!==''){where+='&'}where+=`lokasi=${lokasi}`
        // }
        if(status!==undefined&&status!==null&&status!==''){
            if(where!==''){where+='&'}where+=`status=${status}`;
        }
        if(filter!==undefined&&filter!==null&&filter!==''){
            if(sort!==undefined&&sort!==null&&sort!==''){
                if(where!==''){where+='&'}where+=`sort=${filter}|${sort}`;
            }
        }
        if(any!==undefined&&any!==null&&any!==''){
            if(where!==''){where+='&'}where+=`search=${any}`
        }
        this.setState({
            where_data:where
        })
        localStorage.setItem("where_sale_by_cust_report",pageNumber);
        this.props.dispatch(FetchReportSaleByCust(pageNumber===null?1:pageNumber,where));
        // this.props.dispatch(FetchReportSaleByCustExcel(pageNumber===null?1:pageNumber,where));
    }
    handlePageChange(pageNumber){
        localStorage.setItem("pageNumber_sale_by_cust_report",pageNumber);
        this.checkingParameter(pageNumber);
    }
    handleDelete(e,id){
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
                this.props.dispatch(deleteReportSaleByCust(id));
            }
        })

    }
    handleDetail(e,kode){
        e.preventDefault();

        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("detailSaleByCustReport"));
        this.props.dispatch(FetchReportDetailSaleByCust(kode));
    }

    HandleChangeSort(sr) {
        this.setState({
            sort: sr.value,
        });
        localStorage.setItem('sort_sale_by_cust_report', sr.value);
    }
    HandleChangeFilter(fl) {
        this.setState({
            filter: fl.value,
        });
        localStorage.setItem('filter_sale_by_cust_report', fl.value);
    }
    HandleChangeStatus(st) {
        this.setState({
            status: st.value,
        });
        localStorage.setItem('status_sale_by_cust_report', st.value);
    }
    toggleModal(e,total,perpage) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        let range = total*perpage;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formSaleByCustExcel"));
        this.props.dispatch(FetchReportSaleByCustExcel(1,this.state.where_data,total));
    }

    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        const {
            total,
            last_page,
            per_page,
            current_page,
            from,
            to,
            data
        } = this.props.sale_by_custReport;

        return (
            <Layout page="Laporan Arsip Penjualan">
                <div className="card">
                    <div className="card-header">
                        <h5>Laporan Arsip Penjualan By Customer</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-6 col-xs-6 col-md-2">
                                <div className="form-group">
                                    <label htmlFor=""> Periode </label>
                                    <DateRangePicker style={{display:'unset'}} ranges={rangeDate} alwaysShowCalendars={true} onEvent={this.handleEvent}>
                                        <input type="text" className="form-control" name="date_sale_by_cust_report" value={`${this.state.startDate} to ${this.state.endDate}`} style={{padding: '9px',width: '185px',fontWeight:'bolder'}}/>
                                    </DateRangePicker>


                                </div>
                            </div>
                            {/* <div className="col-6 col-xs-6 col-md-2">
                                <div className="form-group">
                                    <label className="control-label font-12">
                                        Lokasi
                                    </label>
                                    <Select
                                        options={this.state.location_data}
                                        placeholder="Pilih Lokasi"
                                        onChange={this.HandleChangeLokasi}
                                        value={
                                            this.state.location_data.find(op => {
                                                return op.value === this.state.location
                                            })
                                        }

                                    />
                                </div>
                            </div> */}
                            {/* <div className="col-6 col-xs-6 col-md-2">
                                <div className="form-group">
                                    <label className="control-label font-12">
                                        Tipe Transaksi
                                    </label>
                                    <Select
                                        options={this.state.type_data}
                                        placeholder="Pilih Tipe Transaksi"
                                        onChange={this.HandleChangeType}
                                        value={
                                            this.state.type_data.find(op => {
                                                return op.value === this.state.type
                                            })
                                        }
                                    />
                                </div>
                            </div> */}
                            {/* <div className="col-6 col-xs-6 col-md-2">
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
                                </div> */}
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
                                    <label htmlFor="">Cari</label>
                                    <input type="text" name="any_sale_by_cust_report" className="form-control" value={this.state.any_sale_by_cust_report} onChange={(e)=>this.handleChange(e)}/>
                                </div>
                            </div>
                                <div className="col-6 col-xs-6 col-md-2">
                                    <div className="form-group">
                                        <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary" onClick={this.handleSearch}>
                                            <i className="fa fa-search"/>
                                        </button>
                                        <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary" onClick={(e => this.toggleModal(e,(last_page*per_page),per_page))}>
                                            <i className="fa fa-print"></i> Export
                                        </button>
                                    </div>

                                </div>
                            <div className="col-md-12">
                                <div className="table-responsive" style={{overflowX: "auto",zoom:"85%"}}>

                                    <table className="table table-hover table-bordered">
                                        <thead className="bg-light">

                                        <tr>
                                            {/* <th className="text-black" rowSpan="2" style={columnStyle}>#</th> */}
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Kd Cust</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Nama</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Gross Sales</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Diskon Item</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Diskon Trx</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Service</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Qty</th>
                                        </tr>
                                        </thead>
                                        {
                                            !this.props.isLoadingReport?(
                                                <tbody>
                                                {
                                                    typeof data==='object'? data.length>0?

                                                        data.map((v,i)=>{
                                                            return (
                                                                <tr key={i}>
                                                                    {/* <td style={columnStyle}>
                                                                        <div className="btn-group">
                                                                            <button className="btn btn-primary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                Aksi
                                                                            </button>
                                                                            <div className="dropdown-menu">
                                                                                <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.handleDetail(e,v.kd_trx)}>Detail</a>
                                                                                <a className="dropdown-item" href="javascript:void(0)" onClick={(e)=>this.handleDelete(e,v.kd_trx)}>Delete</a>
                                                                                <a className="dropdown-item" href={`${HEADERS.URL}reports/penjualan/${v.kd_trx}.pdf`} target="_blank">Nota</a>
                                                                            </div>
                                                                        </div>
                                                                    </td> */}
                                                                    <td style={columnStyle}>{v.kd_cust}</td>
                                                                    <td style={columnStyle}>{v.nama}</td>
                                                                    <td style={{textAlign:"right"}}>{toRp(parseInt(v.gross_sales))}</td>
                                                                    <td style={{textAlign:"right"}}>{toRp(parseInt(v.diskon_item))}</td>
                                                                    <td style={{textAlign:"right"}}>{toRp(parseInt(v.diskon_trx))}</td>
                                                                    <td style={{textAlign:"right"}}>{toRp(v.service)}</td>
                                                                    <td style={{textAlign:"right"}}>{v.qty}</td>
                                                                </tr>
                                                            );


                                                        }) : "No data." : "No data."
                                                }
                                                </tbody>
                                            ):<Preloader/>
                                        }
                                    </table>

                                </div>
                                <div style={{"marginTop":"20px","float":"right"}}>
                                    <Paginationq
                                        current_page={parseInt(current_page)}
                                        per_page={parseInt(per_page)}
                                        total={parseInt(total)}
                                        callback={this.handlePageChange.bind(this)}
                                    />
                                </div>
                                <SaleByCustReportExcel startDate={this.state.startDate} endDate={this.state.endDate} location={this.state.location} />
                            </div>
                        </div>
                    </div>
                </div>
                <DetailSaleByCustReport detailSaleByCust={this.props.detailSaleByCust}/>
            </Layout>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        sale_by_custReport:state.sale_by_custReducer.report,
        // totalPenjualan:state.sale_by_custReducer.total_penjualan,
        sale_by_custReportExcel:state.sale_by_custReducer.report_excel,
        totalPenjualanExcel:state.sale_by_custReducer.total_penjualan_excel,
        isLoadingReport: state.sale_by_custReducer.isLoadingReport,
        detailSaleByCust:state.sale_by_custReducer.dataDetail,
        isLoadingDetail: state.sale_by_custReducer.isLoadingDetail,
        auth: state.auth
    }
}

export default connect(mapStateToProps)(SaleByCustArchive)