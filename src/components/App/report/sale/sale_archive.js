import React,{Component} from 'react'
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import Select from "react-select";
import Preloader from "Preloader";
import Paginationq,{rangeDate, toRp, CapitalizeEachWord} from "helper";
import {FetchReportSale} from "redux/actions/sale/sale.action";
import Swal from "sweetalert2";
import {
    deleteReportSale,
    FetchReportDetailSale,
    FetchReportSaleExcel,
    FetchNotaReceipt

} from "redux/actions/sale/sale.action";
import DetailSaleReport from "../../modals/report/sale/detail_sale_report";
import SaleReportExcel from "../../modals/report/sale/form_sale_excel";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
// import {HEADERS} from 'redux/actions/_constants'
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';
import { Link } from 'react-router-dom';

class SaleArchive extends Component{
    constructor(props){
        super(props);
        this.state={
            where_data:"",
            type_data:[],
            type:"",
            status_data:[],
            status:"",
            location_data:[],
            location:"",
            any_sale_report:"",
            startDate:moment(new Date()).format("yyyy-MM-DD"),
            endDate:moment(new Date()).format("yyyy-MM-DD")
        }
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.HandleChangeType = this.HandleChangeType.bind(this);
        this.HandleChangeStatus = this.HandleChangeStatus.bind(this);
        this.handleEvent = this.handleEvent.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleDetail = this.handleDetail.bind(this);

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
            return null;
        });
        this.setState({
            type_data: data_type,
        });

        let status = [
            {kode:"",value: "Semua Status"},
            {kode:"0",value: "Belum Lunas"},
            {kode:"1",value: "Lunas"}
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
            status_data: data_status,
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
    }
    componentWillUnmount(){
        localStorage.removeItem('date_from_sale_report');
        localStorage.removeItem('date_to_sale_report');
        localStorage.removeItem('type_sale_report');
        localStorage.removeItem('status_sale_report');
        localStorage.removeItem('location_sale_report');
        localStorage.removeItem('any_sale_report');
        localStorage.removeItem('pageNumber_sale_report');
    }
    componentWillMount(){
        let page=localStorage.getItem("pageNumber_sale_report");
        this.checkingParameter(page===undefined&&page===null?1:page);
    }
    componentDidMount(){
        if (localStorage.location_sale_report !== undefined && localStorage.location_sale_report !== '') {
            this.setState({
                location: localStorage.location_sale_report
            })
        }
        if (localStorage.type_sale_report !== undefined && localStorage.type_sale_report !== '') {
            this.setState({
                type: localStorage.type_sale_report
            })
        }
        if (localStorage.any_sale_report !== undefined && localStorage.any_sale_report !== '') {
            this.setState({
                any_sale_report: localStorage.any_sale_report
            })
        }
        if (localStorage.date_from_sale_report !== undefined && localStorage.date_from_sale_report !== null) {
            this.setState({
                startDate: localStorage.date_from_sale_report
            })
        }
        if (localStorage.date_to_sale_report !== undefined && localStorage.date_to_sale_report !== null) {
            this.setState({
                endDate: localStorage.date_to_sale_report
            })
        }
        if (localStorage.status_sale_report !== undefined && localStorage.status_sale_report !== null) {
            this.setState({
                endDate: localStorage.status_sale_report
            })
        }
    }
    handleChange(event){
        this.setState({ [event.target.name]: event.target.value });
    }
    HandleChangeType(type) {
        this.setState({
            type: type.value,
        });
        localStorage.setItem('type_sale_report', type.value);
    }
    HandleChangeStatus(status) {
        this.setState({
            status: status.value,
        });
        localStorage.setItem('status_sale_report', status.value);
    }
    HandleChangeLokasi(lk) {
        this.setState({
            location: lk.value,
        });
        localStorage.setItem('location_sale_report', lk.value);
    }
    handleEvent = (event, picker) => {
        const awal = moment(picker.startDate._d).format('YYYY-MM-DD');
        const akhir = moment(picker.endDate._d).format('YYYY-MM-DD');
        localStorage.setItem("date_from_sale_report",`${awal}`);
        localStorage.setItem("date_to_sale_report",`${akhir}`);
        this.setState({
            startDate:awal,
            endDate:akhir
        });
    };
    handleSearch(e){
        e.preventDefault();
        localStorage.setItem("any_sale_report",this.state.any_sale_report);
        this.checkingParameter(1);
    }
    checkingParameter(pageNumber){
        let where='';
        let dateFrom=localStorage.getItem("date_from_sale_report");
        let dateTo=localStorage.getItem("date_to_sale_report");
        let tipe=this.state.type===''?localStorage.getItem("type_sale_report"):this.state.type;
        let status=this.state.status===''?localStorage.getItem("status_sale_report"):this.state.status;
        let lokasi=localStorage.getItem("location_sale_report");
        let any=this.state.any_sale_report===''?localStorage.getItem("any_sale_report"):this.state.any_sale_report;
        if(dateFrom!==undefined&&dateFrom!==null){
            if(where!==''){where+='&'}where+=`datefrom=${dateFrom}&dateto=${dateTo}`
        }else{
            if(where!==''){where+='&'}where+=`datefrom=${this.state.startDate}&dateto=${this.state.endDate}`
        }
        if(tipe!==undefined&&tipe!==null&&tipe!==''){
            if(where!==''){where+='&'}where+=`type=${tipe}`
        }
        if(status!==undefined&&status!==null&&status!==''){
            if(where!==''){where+='&'}where+=`status=${status}`
        }
        if(lokasi!==undefined&&lokasi!==null&&lokasi!==''){
            if(where!==''){where+='&'}where+=`lokasi=${lokasi}`
        }
        if(any !== undefined&&any!==''){
            if(where!==''){where+='&'}where+=`q=${any}`
        }
        this.setState({
            where_data:where
        })
        this.props.dispatch(FetchReportSale(pageNumber===null?1:pageNumber,where));
        // this.props.dispatch(FetchReportSaleExcel(pageNumber===null?1:pageNumber,where));
    }
    handlePageChange(pageNumber){
        localStorage.setItem("pageNumber_sale_report",pageNumber);
        this.checkingParameter(pageNumber);
    }
    handleDelete(e,id){
        e.preventDefault();
        Swal.fire({allowOutsideClick: false,
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                this.props.dispatch(deleteReportSale(id));
            }
        })

    }
    handleDetail(e,kode){
        e.preventDefault();

        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("detailSaleReport"));
        this.props.dispatch(FetchReportDetailSale(kode));
    }

    toggleModal(e,total,perpage) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        // let range = total*perpage;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formSaleExcel"));
        this.props.dispatch(FetchReportSaleExcel(this.state.where_data,total));
    }

    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        const columnRight = {verticalAlign: "middle", textAlign: "right",whiteSpace:"nowrap"};
        const {
            last_page,
            per_page,
            current_page,
            data
        } = this.props.saleReport;
        const {omset, dis_item, dis_persen, dis_rp, kas_lain, gt, bayar, jml_kartu, charge, change, rounding, profit,hpp} = this.props.totalPenjualan;
        let omset_per = 0;
        let profit_per = 0;
        let hpp_per = 0;
        let dis_item_per = 0;
        let dis_persen_per = 0;
        let dis_rp_per = 0;
        let kas_lain_per = 0;
        let gt_per = 0;
        let bayar_per = 0;
        let jml_kartu_per = 0;
        let charge_per = 0;
        let change_per = 0;
        let voucher_per = 0;
        let rounding_per = 0;

        return (
            <Layout page="Laporan Arsip Penjualan">
                <div className="card">
                    <div className="card-header">
                        <div className="row">
                            <div className='col-md-6'>
                                <h5>Laporan Arsip Penjualan</h5>
                            </div>
                            <div className='col-md-6 text-right'>
                                <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary" onClick={(e => this.toggleModal(e,(last_page*per_page),per_page))}>
                                    <i className="fa fa-print"></i> Export
                                </button>
                            </div>

                        </div>
                    </div>
                    <div className="card-body">
                                    <div className="row" style={{zoom:"100%"}}>
                                        <div className="col-6 col-xs-6 col-md-2">
                                            <div className="form-group">
                                                <label className="control-label font-12" htmlFor=""> Periode &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </label>
                                                <DateRangePicker style={{display:'unset'}} ranges={rangeDate} alwaysShowCalendars={true} onEvent={this.handleEvent}>
                                                    <input type="text" className="form-control" name="date_sale_report" value={`${this.state.startDate} to ${this.state.endDate}`} style={{padding: '9px',fontWeight:'bolder'}}/>
                                                </DateRangePicker>
                                            </div>
                                        </div>
                                        <div className="col-6 col-xs-6 col-md-2">
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
                                        </div>
                                        <div className="col-6 col-xs-6 col-md-2">
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
                                        </div>
                                        <div className="col-6 col-xs-6 col-md-2">
                                            <div className="form-group">
                                                <label className="control-label font-12">
                                                    Status
                                                </label>
                                                <Select
                                                    options={this.state.status_data}
                                                    placeholder="Pilih Status Transaksi"
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
                                            <div className="row">
                                                <div className="col-md-10" style={{padding: 0, margin: 0}}>
                                                    <div className="form-group">
                                                        <label htmlFor="">Cari</label>
                                                        <input type="text" name="any_sale_report" className="form-control" value={this.state.any_sale_report} placeholder="Kode/Kasir/Sales/Customer" onChange={(e)=>this.handleChange(e)}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-2" style={{padding: 0, margin: 0, paddingLeft: '5px'}}>
                                                    <div className="form-group">
                                                        <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary" onClick={this.handleSearch}>
                                                            <i className="fa fa-search"/>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            </div>

                                        
                                    </div>
                                <div style={{overflowX: "auto",zoom:"85%"}}>

                                    <table className="table table-hover table-bordered">
                                        <thead className="bg-light">

                                        <tr>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>No</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>#</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Kd Trx</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Tanggal</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Jam</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Customer</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Kasir</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Sales</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Omset</th>
                                            <th className="text-black" colSpan={3} style={columnStyle}>Diskon</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Pajak</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>HPP</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Subtotal</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Profit</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Reg.Member</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Trx Lain</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Keterangan</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Grand Total</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Rounding</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Tunai</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Change</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Transfer</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Charge</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Nama Kartu</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Status</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Lokasi</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Jenis Trx</th>
                                        </tr>
                                        <tr>
                                            <th className="text-black" style={columnStyle}>Item</th>
                                            <th className="text-black" style={columnStyle}>Total ( rp )</th>
                                            <th className="text-black" style={columnStyle}>Total ( % )</th>
                                        </tr>
                                        </thead>
                                        {
                                            !this.props.isLoadingReport?(
                                                <tbody>
                                                {
                                                    typeof data==='object'? data.length>0?

                                                        data.map((v,i)=>{
                                                            
                                                            omset_per+= parseFloat(v.omset);
                                                            profit_per+= parseFloat(v.profit);
                                                            dis_item_per = dis_item_per + parseInt(v.diskon_item,10);
                                                            dis_persen_per = dis_persen_per + parseInt(v.dis_persen,10);
                                                            dis_rp_per = dis_rp_per + parseInt(v.dis_rp,10);
                                                            kas_lain_per = kas_lain_per + parseInt(v.kas_lain,10);
                                                            gt_per = gt_per + parseInt(v.gt, 10);
                                                            bayar_per = bayar_per + parseInt(v.bayar,10);
                                                            jml_kartu_per = jml_kartu_per + parseInt(v.jml_kartu,10);
                                                            charge_per = charge_per + parseInt(v.charge,10);
                                                            change_per = change_per + parseInt(v.change,10);
                                                            voucher_per = voucher_per + parseInt(v.voucher,10);
                                                            rounding_per = rounding_per + parseInt(v.rounding, 10);
                                                            hpp_per += parseInt(v.hrg_beli, 10);
                                                            

                                                            return (
                                                                <tr key={i}>
                                                                    <td style={columnStyle}> {i+1 + (10 * (parseInt(current_page,10)-1))}</td>
                                                                    <td style={columnStyle}>
                                                                        <div className="btn-group">
                                                                            <UncontrolledButtonDropdown>
                                                                            <DropdownToggle caret>
                                                                                Aksi
                                                                            </DropdownToggle>
                                                                            <DropdownMenu>
                                                                                <DropdownItem onClick={(e)=>this.handleDetail(e,v.kd_trx)}>Detail</DropdownItem>
                                                                                <DropdownItem onClick={(e)=>this.handleDelete(e,v.kd_trx)}>Delete</DropdownItem>
                                                                                <DropdownItem onClick={(e)=>{
                                                                                    e.preventDefault();
                                                                                    this.props.dispatch(FetchNotaReceipt(v.kd_trx))
                                                                                }}>Nota</DropdownItem>
                                                                                <Link to={`../print3ply/${v.kd_trx}`}><DropdownItem>3ply</DropdownItem></Link>
                                                                            </DropdownMenu>
                                                                            </UncontrolledButtonDropdown>
                                                                        </div>
                                                                    </td>
                                                                    <td style={columnStyle}>{v.kd_trx}</td>
                                                                    <td style={columnStyle}>{moment(v.tgl).format("yyyy/MM/DD")}</td>
                                                                    <td style={columnStyle}>{moment(v.jam).format("hh:mm:ss")}</td>
                                                                    <td style={columnStyle}>{v.customer}</td>
                                                                    <td style={columnStyle}>{v.nama}</td>
                                                                    <td style={columnStyle}>{v.sales}</td>
                                                                    <td style={columnRight}>{toRp(parseFloat(v.omset))}</td>
                                                                    <td style={columnRight}>{toRp(parseInt(v.diskon_item,10))}</td>
                                                                    <td style={columnRight}>{toRp(v.dis_rp)}</td>
                                                                    <td style={columnRight}>{parseFloat(v.dis_persen).toFixed(2)}</td>
                                                                    <td style={columnRight}>{toRp(v.hrg_jual*(parseFloat(v.tax)/100))}</td>
                                                                    <td style={columnRight}>{toRp(parseInt(v.hrg_beli,10))}</td>
                                                                    <td style={columnRight}>{toRp(parseInt(v.hrg_jual,10))}</td>
                                                                    <td style={columnRight}>{toRp(parseInt(v.profit,10))}</td>
                                                                    <td style={columnStyle}>{v.regmember?v.regmember:"-"}</td>
                                                                    <td style={columnStyle}>{v.kas_lain}</td>
                                                                    <td style={columnStyle}>{v.ket_kas_lain}</td>
                                                                    <td style={columnRight}>{toRp(parseInt(v.gt,10))}</td>
                                                                    <td style={columnRight}>{toRp(parseInt(v.rounding,10))}</td>
                                                                    <td style={columnRight}>{toRp(parseInt(v.bayar,10))}</td>
                                                                    <td style={columnRight}>{toRp(parseInt(v.change,10))}</td>
                                                                    <td style={columnRight}>{toRp(parseInt(v.jml_kartu,10))}</td>
                                                                    <td style={columnRight}>{toRp(parseInt(v.charge,10))}</td>
                                                                    <td style={columnStyle}>{v.kartu}</td>
                                                                    <td style={columnStyle}>{CapitalizeEachWord(v.status)}</td>
                                                                    <td style={columnStyle}>{v.lokasi}</td>
                                                                    <td style={columnStyle}>{v.jenis_trx}</td>
                                                                </tr>
                                                            );


                                                        }) : "No data." : "No data."
                                                }
                                                </tbody>
                                            ):<Preloader/>
                                        }
                                        <tfoot>
                                        <tr style={{backgroundColor:"#EEEEEE"}}>
                                            <td colSpan="8">TOTAL PERPAGE</td>
                                            <td style={columnRight}>{toRp(omset_per)}</td>
                                            <td style={columnRight}>{toRp(dis_item_per)}</td>
                                            <td style={columnRight}>{toRp(dis_rp_per)}</td>
                                            <td style={columnRight}>{dis_persen_per}</td>
                                            <td colSpan="1"></td>
                                            <td style={columnRight}>{toRp(hpp_per)}</td>
                                            <td colSpan="1"></td>
                                            <td style={columnRight}>{toRp(profit_per)}</td>
                                            <td colSpan="1"></td>
                                            <td style={columnRight}>{toRp(kas_lain_per)}</td>
                                            <td colSpan="1"></td>
                                            <td style={columnRight}>{toRp(gt_per)}</td>
                                            <td style={columnRight}>{toRp(rounding_per)}</td>
                                            <td style={columnRight}>{toRp(bayar_per)}</td>
                                            <td style={columnRight}>{toRp(change_per)}</td>
                                            <td style={columnRight}>{toRp(jml_kartu_per)}</td>
                                            <td style={columnRight}>{toRp(charge_per)}</td>
                                            <td colSpan="4"></td>
                                        </tr>
                                        <tr style={{backgroundColor:"#EEEEEE"}}>
                                            <td colSpan="8">TOTAL</td>
                                            <td style={columnRight}>{toRp(omset)}</td>
                                            <td style={columnRight}>{toRp(dis_item===null?0:dis_item.toFixed(0))}</td>
                                            <td style={columnRight}>{toRp(dis_rp===null?0:dis_rp.toFixed(0))}</td>
                                            <td style={columnRight}>{dis_persen===null?0:dis_persen.toFixed(0)}</td>
                                            <td colSpan="1"></td>
                                            <td style={columnRight}>{hpp===undefined&&hpp===''?0:toRp(hpp)}</td>
                                            <td colSpan="1"></td>
                                            <td style={columnRight}>{profit===undefined&&profit===''?0:toRp(profit)}</td>
                                            <td colSpan="1"></td>
                                            <td style={columnRight}>{toRp(kas_lain)}</td>
                                            <td colSpan="1"></td>
                                            <td style={columnRight}>{toRp(gt)}</td>
                                            <td style={columnRight}>{toRp(rounding)}</td>
                                            <td style={columnRight}>{toRp(bayar)}</td>
                                            <td style={columnRight}>{toRp(change)}</td>
                                            <td style={columnRight}>{toRp(jml_kartu)}</td>
                                            <td style={columnRight}>{toRp(charge)}</td>
                                            <td colSpan="4"></td>
                                        </tr>
                                        </tfoot>
                                    </table>

                                </div>
                                <div style={{"marginTop":"20px","float":"right"}}>
                                    <Paginationq
                                        current_page={parseInt(current_page,10)}
                                        per_page={parseInt(per_page,10)}
                                        total={parseInt((per_page*last_page),10)}
                                        callback={this.handlePageChange.bind(this)}
                                    />
                                </div>
                    </div>
                </div>
                <DetailSaleReport detailSale={this.props.detailSale}/>
                <SaleReportExcel startDate={this.state.startDate} endDate={this.state.endDate} location={this.state.location} totalPenjualan={this.props.totalPenjualan} totalPenjualanExcel={this.props.totalPenjualanExcel}/>
            </Layout>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        saleReport:state.saleReducer.report,
        totalPenjualan:state.saleReducer.total_penjualan,
        saleReportExcel:state.saleReducer.report_excel,
        totalPenjualanExcel:state.saleReducer.total_penjualan_excel,
        isLoadingReport: state.saleReducer.isLoadingReport,
        detailSale:state.saleReducer.dataDetail,
        isLoadingDetail: state.saleReducer.isLoadingDetail,
        auth: state.auth
    }
}

export default connect(mapStateToProps)(SaleArchive)