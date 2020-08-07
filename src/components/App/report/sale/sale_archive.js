import React,{Component} from 'react'
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import {FetchCashReport} from "redux/actions/masterdata/cash/cash.action";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import Select from "react-select";
import Paginationq from "helper";
import Preloader from "../../../../Preloader";
import {rangeDate, toRp} from "../../../../helper";
import {FetchReportSale} from "redux/actions/sale/sale.action";
import Swal from "sweetalert2";
import {
    deleteReportSale,
    FetchReportDetailSale,
    FetchReportSaleExcel
} from "../../../../redux/actions/sale/sale.action";
import DetailSaleReport from "../../modals/report/sale/detail_sale_report";
import {ModalToggle, ModalType} from "../../../../redux/actions/modal.action";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import {HEADERS} from "../../../../redux/actions/_constants";

class SaleArchive extends Component{
    constructor(props){
        super(props);
        this.state={
            type_data:[],
            type:"",
            location_data:[],
            location:"",
            any_sale_report:"",
            startDate:moment(new Date()).format("yyyy-MM-DD"),
            endDate:moment(new Date()).format("yyyy-MM-DD")
        }
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this);
        this.HandleChangeType = this.HandleChangeType.bind(this);
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
        ];
        let data_type=[];
        type.map((i) => {
            data_type.push({
                value: i.kode,
                label: i.value
            });
        });

        this.setState({
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
                })
                this.setState({
                    location_data: lk,
                })
            }
        }
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
                any: localStorage.any_sale_report
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
    HandleChangeLokasi(lk) {
        this.setState({
            location: lk.value,
        });
        localStorage.setItem('location_sale_report', lk.value);
    }
    handleEvent = (event, picker) => {
        const awal = picker.startDate._d.toISOString().substring(0,10);
        const akhir = picker.endDate._d.toISOString().substring(0,10);
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
        let tipe=localStorage.getItem("type_sale_report");
        let lokasi=localStorage.getItem("location_sale_report");
        let any=localStorage.getItem("any_sale_report");
        if(dateFrom!==undefined&&dateFrom!==null){
            if(where!==''){where+='&'}where+=`datefrom=${dateFrom}&dateto=${dateTo}`
        }else{
            if(where!==''){where+='&'}where+=`datefrom=${this.state.startDate}&dateto=${this.state.endDate}`
        }
        if(tipe!==undefined&&tipe!==null&&tipe!==''){
            if(where!==''){where+='&'}where+=`tipe=${tipe}`
        }
        if(lokasi!==undefined&&lokasi!==null&&lokasi!==''){
            if(where!==''){where+='&'}where+=`lokasi=${lokasi}`
        }
        if(any !== undefined&&any!==''){
            if(where!==''){where+='&'}where+=`q=${any}`
        }
        this.props.dispatch(FetchReportSale(pageNumber===null?1:pageNumber,where));
        this.props.dispatch(FetchReportSaleExcel(pageNumber===null?1:pageNumber,where));
    }
    handlePageChange(pageNumber){
        localStorage.setItem("pageNumber_sale_report",pageNumber);
        this.checkingParameter(pageNumber);
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
                this.props.dispatch(deleteReportSale(id));
            }
        })

    }
    handleDetail(e,kode){
        e.preventDefault();
        console.log(kode);
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("detailSaleReport"));
        this.props.dispatch(FetchReportDetailSale(kode));
    }

    render(){
        // console.log("MOMENT 1",moment(new Date()).format("yyyy-MM-DD"));
        // console.log("MOMENT 2",moment(new Date()).format("yyyy-MM-DD"));
        // console.log("LAPORAN EXCEL", this.props.saleReportExcel);
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        const {total,last_page,per_page,current_page,from,to,data} = this.props.saleReport;
        const {omset, dis_item, dis_persen, dis_rp, kas_lain, gt, bayar, jml_kartu, charge, change, rounding} = this.props.totalPenjualan;
        // const {omset, dis_item, dis_persen, dis_rp, kas_lain, gt, bayar, jml_kartu, charge, change, rounding} = this.props.totalPenjualan;
        let omset_per = 0;
        let dis_item_per = 0;
        let sub_total_per = 0;
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
                        <h5>Laporan Arsip Penjualan</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-6 col-xs-6 col-md-2">
                                <div className="form-group">
                                    <label htmlFor=""> Periode </label>
                                    <DateRangePicker style={{display:'unset'}} ranges={rangeDate} alwaysShowCalendars={true} onEvent={this.handleEvent}>
                                        <input type="text" className="form-control" name="date_sale_report" value={`${this.state.startDate} to ${this.state.endDate}`} style={{padding: '10px',width: '185px',fontWeight:'bolder'}}/>
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
                                    <label htmlFor="">Cari</label>
                                    <input type="text" name="any_sale_report" className="form-control" value={this.state.any_sale_report} placeholder="Kode/Kasir/Customer" onChange={(e)=>this.handleChange(e)}/>
                                </div>
                            </div>
                            <div className="col-6 col-xs-6 col-md-3">
                                <div className="form-group">
                                    <label className="control-label font-12"></label>
                                    <button style={{marginTop:"28px",marginRight:"5px"}} className="btn btn-primary" onClick={this.handleSearch}>
                                        <i className="fa fa-search"></i>
                                    </button>
                                    <ReactHTMLTableToExcel
                                        className="btn btn-primary btnBrg"
                                        table="report_sale_to_excel"
                                        filename="laporan_penjualan"
                                        sheet="barang"
                                        buttonText="export excel">
                                    </ReactHTMLTableToExcel>
                                </div>

                            </div>
                            <div className="col-md-12">
                                {/*DATA EXCEL*/}
                                <table className="table table-hover"  id="report_sale_to_excel" style={{display:"none"}}>
                                    <thead className="bg-light">
                                    <tr>
                                        <th className="text-black" colSpan={23}>{this.state.startDate} - {this.state.startDate}</th>
                                    </tr>
                                    <tr>
                                        <th className="text-black" colSpan={23}>{this.state.location===''?'SEMUA LOKASI':this.state.location}</th>
                                    </tr>

                                    <tr>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Kd Trx</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Tanggal</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Jam</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Customer</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Kasir</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Omset</th>
                                        <th className="text-black" colSpan={3} style={columnStyle}>Diskon</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>HPP</th>
                                        <th className="text-black" rowSpan="2" style={columnStyle}>Hrg Jual</th>
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
                                        <tbody>
                                        {
                                            typeof this.props.saleReportExcel.data==='object'? this.props.saleReportExcel.data.length>0?
                                                this.props.saleReportExcel.data.map((v,i)=>{
                                                    return (
                                                        <tr key={i}>
                                                            <td style={columnStyle}>{v.kd_trx}</td>
                                                            <td style={columnStyle}>{moment(v.tgl).format("yyyy/MM/DD")}</td>
                                                            <td style={columnStyle}>{moment(v.jam).format("hh:mm:ss")}</td>
                                                            <td style={columnStyle}>{v.nama}</td>
                                                            <td style={columnStyle}>{v.kd_kasir}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(parseInt(v.omset))}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(parseInt(v.diskon_item))}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(v.dis_rp)}</td>
                                                            <td style={{textAlign:"right"}}>{v.dis_persen}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(parseInt(v.hrg_beli))}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(parseInt(v.hrg_jual))}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(parseInt(v.profit))}</td>
                                                            <td style={columnStyle}>{v.regmember?v.regmember:"-"}</td>
                                                            <td style={columnStyle}>{v.kas_lain}</td>
                                                            <td style={columnStyle}>{v.ket_kas_lain}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(parseInt(v.omset-v.diskon_item-v.dis_rp-v.kas_lain))}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(parseInt(v.rounding))}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(parseInt(v.bayar))}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(parseInt(v.change))}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(parseInt(v.jml_kartu))}</td>
                                                            <td style={{textAlign:"right"}}>{toRp(parseInt(v.charge))}</td>
                                                            <td>{v.kartu}</td>
                                                            <td>{v.status}</td>
                                                            <td>{v.lokasi}</td>
                                                            <td>{v.jenis_trx}</td>
                                                        </tr>
                                                    );


                                                }) : "No data." : "No data."
                                        }
                                        </tbody>
                                    }
                                    <tfoot>
                                    <tr>
                                        <td colSpan="5">TOTAL</td>
                                        <td style={{textAlign:"right"}}>{toRp(this.props.totalPenjualanExcel.omset)}</td>
                                        <td style={{textAlign:"right"}}>{toRp(this.props.totalPenjualanExcel.dis_item)}</td>
                                        <td style={{textAlign:"right"}}>{toRp(this.props.totalPenjualanExcel.dis_rp)}</td>
                                        <td style={{textAlign:"right"}}>{this.props.totalPenjualanExcel.dis_persen}</td>
                                        <td colSpan="4"></td>
                                        <td style={{textAlign:"right"}}>{toRp(this.props.totalPenjualanExcel.kas_lain)}</td>
                                        <td colSpan="1"></td>
                                        <td style={{textAlign:"right"}}>{toRp(this.props.totalPenjualanExcel.gt)}</td>
                                        <td style={{textAlign:"right"}}>{toRp(this.props.totalPenjualanExcel.rounding)}</td>
                                        <td style={{textAlign:"right"}}>{toRp(this.props.totalPenjualanExcel.bayar)}</td>
                                        <td style={{textAlign:"right"}}>{toRp(this.props.totalPenjualanExcel.change)}</td>
                                        <td style={{textAlign:"right"}}>{toRp(this.props.totalPenjualanExcel.jml_kartu)}</td>
                                        <td style={{textAlign:"right"}}>{toRp(this.props.totalPenjualanExcel.charge)}</td>
                                        <td colSpan="4"></td>
                                    </tr>
                                    </tfoot>
                                </table>
                                {/*END DATA EXCEL*/}
                                <div className="table-responsive" style={{overflowX: "auto",zoom:"85%"}}>

                                    <table className="table table-hover table-bordered">
                                        <thead className="bg-light">

                                        <tr>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>#</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Kd Trx</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Tanggal</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Jam</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Customer</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Kasir</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Omset</th>
                                            <th className="text-black" colSpan={3} style={columnStyle}>Diskon</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>HPP</th>
                                            <th className="text-black" rowSpan="2" style={columnStyle}>Hrg Jual</th>
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
                                                            omset_per = omset_per + parseInt(v.omset);
                                                            dis_item_per = dis_item_per + parseInt(v.diskon_item);
                                                            dis_persen_per = dis_persen_per + parseInt(v.dis_persen);
                                                            dis_rp_per = dis_rp_per + parseInt(v.dis_rp);
                                                            kas_lain_per = kas_lain_per + parseInt(v.kas_lain);
                                                            gt_per = gt_per + parseInt(v.omset - v.diskon_item - v.dis_rp - v.kas_lain);
                                                            bayar_per = bayar_per + parseInt(v.bayar);
                                                            jml_kartu_per = jml_kartu_per + parseInt(v.jml_kartu);
                                                            charge_per = charge_per + parseInt(v.charge);
                                                            change_per = change_per + parseInt(v.change);
                                                            voucher_per = voucher_per + parseInt(v.voucher);
                                                            rounding_per = rounding_per + parseInt(v.rounding);


                                                            return (
                                                                <tr key={i}>
                                                                    <td style={columnStyle}>
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
                                                                    </td>
                                                                    <td style={columnStyle}>{v.kd_trx}</td>
                                                                    <td style={columnStyle}>{moment(v.tgl).format("yyyy/MM/DD")}</td>
                                                                    <td style={columnStyle}>{moment(v.jam).format("hh:mm:ss")}</td>
                                                                    <td style={columnStyle}>{v.nama}</td>
                                                                    <td style={columnStyle}>{v.kd_kasir}</td>
                                                                    <td style={{textAlign:"right"}}>{toRp(parseInt(v.omset))}</td>
                                                                    <td style={{textAlign:"right"}}>{toRp(parseInt(v.diskon_item))}</td>
                                                                    <td style={{textAlign:"right"}}>{toRp(v.dis_rp)}</td>
                                                                    <td style={{textAlign:"right"}}>{v.dis_persen}</td>
                                                                    <td style={{textAlign:"right"}}>{toRp(parseInt(v.hrg_beli))}</td>
                                                                    <td style={{textAlign:"right"}}>{toRp(parseInt(v.hrg_jual))}</td>
                                                                    <td style={{textAlign:"right"}}>{toRp(parseInt(v.profit))}</td>
                                                                    <td style={columnStyle}>{v.regmember?v.regmember:"-"}</td>
                                                                    <td style={columnStyle}>{v.kas_lain}</td>
                                                                    <td style={columnStyle}>{v.ket_kas_lain}</td>
                                                                    <td style={{textAlign:"right"}}>{toRp(parseInt(v.omset-v.diskon_item-v.dis_rp-v.kas_lain))}</td>
                                                                    <td style={{textAlign:"right"}}>{toRp(parseInt(v.rounding))}</td>
                                                                    <td style={{textAlign:"right"}}>{toRp(parseInt(v.bayar))}</td>
                                                                    <td style={{textAlign:"right"}}>{toRp(parseInt(v.change))}</td>
                                                                    <td style={{textAlign:"right"}}>{toRp(parseInt(v.jml_kartu))}</td>
                                                                    <td style={{textAlign:"right"}}>{toRp(parseInt(v.charge))}</td>
                                                                    <td>{v.kartu}</td>
                                                                    <td>{v.status}</td>
                                                                    <td>{v.lokasi}</td>
                                                                    <td>{v.jenis_trx}</td>
                                                                </tr>
                                                            );


                                                        }) : "No data." : "No data."
                                                }
                                                </tbody>
                                            ):<Preloader/>
                                        }
                                        <tfoot>
                                        <tr style={{backgroundColor:"#EEEEEE"}}>
                                            <td colSpan="6">TOTAL PERPAGE</td>
                                            <td style={{textAlign:"right"}}>{toRp(omset_per)}</td>
                                            <td style={{textAlign:"right"}}>{toRp(dis_item_per)}</td>
                                            <td style={{textAlign:"right"}}>{toRp(dis_rp_per)}</td>
                                            <td style={{textAlign:"right"}}>{dis_persen_per}</td>
                                            <td colSpan="4"></td>
                                            <td style={{textAlign:"right"}}>{toRp(kas_lain_per)}</td>
                                            <td colSpan="1"></td>
                                            <td style={{textAlign:"right"}}>{toRp(gt_per)}</td>
                                            <td style={{textAlign:"right"}}>{toRp(rounding_per)}</td>
                                            <td style={{textAlign:"right"}}>{toRp(bayar_per)}</td>
                                            <td style={{textAlign:"right"}}>{toRp(change_per)}</td>
                                            <td style={{textAlign:"right"}}>{toRp(jml_kartu_per)}</td>
                                            <td style={{textAlign:"right"}}>{toRp(charge_per)}</td>
                                            <td colSpan="4"></td>
                                        </tr>
                                        <tr style={{backgroundColor:"#EEEEEE"}}>
                                            <td colSpan="6">TOTAL</td>
                                            <td style={{textAlign:"right"}}>{toRp(omset)}</td>
                                            <td style={{textAlign:"right"}}>{toRp(dis_item)}</td>
                                            <td style={{textAlign:"right"}}>{toRp(dis_rp)}</td>
                                            <td style={{textAlign:"right"}}>{dis_persen}</td>
                                            <td colSpan="4"></td>
                                            <td style={{textAlign:"right"}}>{toRp(kas_lain)}</td>
                                            <td colSpan="1"></td>
                                            <td style={{textAlign:"right"}}>{toRp(gt)}</td>
                                            <td style={{textAlign:"right"}}>{toRp(rounding)}</td>
                                            <td style={{textAlign:"right"}}>{toRp(bayar)}</td>
                                            <td style={{textAlign:"right"}}>{toRp(change)}</td>
                                            <td style={{textAlign:"right"}}>{toRp(jml_kartu)}</td>
                                            <td style={{textAlign:"right"}}>{toRp(charge)}</td>
                                            <td colSpan="4"></td>
                                        </tr>
                                        </tfoot>
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
                            </div>
                        </div>
                    </div>
                </div>
                <DetailSaleReport detailSale={this.props.detailSale}/>
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