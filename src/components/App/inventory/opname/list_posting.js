import React,{Component} from 'react'
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import {FetchPostingOpname} from "redux/actions/inventory/opname.action";
import moment from "moment";
import {statusQ, toRp} from "helper";
import Paginationq from "helper";
import {storeOpnamePosting} from "redux/actions/inventory/opname.action";
import Swal from "sweetalert2";
import Select from "react-select";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import {rangeDate} from "../../../../helper";

class ListPosting extends Component{
    constructor(props) {
        super(props);
        this.state={
            dataPosting:[],
            location_data:[],
            location:"",
            startDate:localStorage.getItem("startDateProduct")===null?moment(new Date()).format("yyyy-MM-DD"):localStorage.getItem("startDateProduct"),
            endDate:localStorage.getItem("endDateProduct")===null?moment(new Date()).format("yyyy-MM-DD"):localStorage.getItem("endDateProduct"),

        }
        this.handleOne=this.handleOne.bind(this);
        this.HandleChangeLokasi=this.HandleChangeLokasi.bind(this);
        this.handleEvent=this.handleEvent.bind(this);
        this.handleAll=this.handleAll.bind(this);
    }
    componentDidMount(){
        if(localStorage.lk!==undefined&&localStorage.lk!==''){
            this.setState({
                location:localStorage.lk
            })
        }
        if(localStorage.startDateProduct!==undefined&&localStorage.startDateProduct!==''){
            this.setState({
                startDate:localStorage.startDateProduct
            })
        }
        if(localStorage.endDateProduct!==undefined&&localStorage.endDateProduct!==''){
            this.setState({
                endDate:localStorage.endDateProduct
            })
        }
    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.auth.user) {
            let lk = [];
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
    componentWillUnmount(){
        localStorage.removeItem("lk");
    }
    componentWillMount(){
        let where='';
        if(localStorage.lk!==undefined){
            if(where!==''){where+='&'}
            where+=`lokasi=${localStorage.lk}`;
        }
        if(localStorage.startDateProduct!==undefined){
            if(where!==''){where+='&'}
            where+=`datefrom=${localStorage.startDateProduct}&dateto=${localStorage.endDateProduct}`;
        }

        this.props.dispatch(FetchPostingOpname(1,where));
    }
    HandleChangeLokasi(lk){
        this.setState({
            location: lk.value,
        })
        localStorage.setItem('lk', lk.value);
        if(localStorage.lk!==undefined){
            this.props.dispatch(FetchPostingOpname(1,`&lokasi=${lk.value}`));
        }
    }
    handlePageChange(pageNumber){
        this.setState({activePage: pageNumber});
        localStorage.setItem("page_list_posting",pageNumber);
        this.props.dispatch(FetchPostingOpname(pageNumber));
    }
    handleEvent = (event, picker) => {
        const awal = picker.startDate._d.toISOString().substring(0,10);
        const akhir = picker.endDate._d.toISOString().substring(0,10);
        localStorage.setItem("startDateProduct",`${awal}`);
        localStorage.setItem("endDateProduct",`${akhir}`);
        this.setState({
            startDate:awal,
            endDate:akhir
        });
        if(localStorage.getItem("lk")!==null&&localStorage.getItem("lk")!==''){
            this.props.dispatch(FetchPostingOpname(1,`&lokasi=${this.state.location}&datefrom=${awal}&dateto=${akhir}`));
        }

    // &datefrom=2020-07-01&dateto=2020-07-01
    };
    handleOne(e,kd_trx){
        e.preventDefault();
        let data={};
        data['kd_trx'] = kd_trx;
        Swal.fire({
            title: 'Posting Data Opname?',
            text: "Pastikan data yang anda masukan sudah benar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Simpan!',
            cancelButtonText: 'Tidak!'
        }).then((result) => {
            if(result.value){
                this.props.dispatch(storeOpnamePosting(data,'item'))
            }
        });

    }
    handleAll(e){
        e.preventDefault();
        let parsedata={};
        parsedata['datefrom'] = moment(this.state.startDate).format("yyyy-MM-DD");
        parsedata['dateto'] = moment(this.state.endDate).format("yyyy-MM-DD");
        if(this.state.location===''){
            parsedata['lokasi']='-';
        }else{
            parsedata['lokasi']=this.state.location;
        }
        Swal.fire({
            title: 'Posting Data Opname?',
            text: "Pastikan data yang anda masukan sudah benar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Simpan!',
            cancelButtonText: 'Tidak!'
        }).then((result) => {
            if(result.value){
                this.props.dispatch(storeOpnamePosting(parsedata,'all'))
            }
        });
    }
    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",whiteSpace:"nowrap"};
        const {per_page,last_page,current_page,from,to,data,total} = this.props.data;
        this.state.dataPosting = this.props.data.data;
        const {total_fisik,total_akhir,total_hpp} = this.props.total!==undefined?this.props.total:[];
        let total_fisik_per=0;
        let total_akhir_per=0;
        let total_hpp_per=0;

        return (
            <Layout page="List Posing">
                <div className="card">
                    <div className="card-header">
                        <h4>List Posting</h4>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="row">
                                    <div className="col-6 col-xs6 col-md-2">
                                        <div className="form-group">
                                            <label htmlFor=""> Periode </label>
                                            <DateRangePicker
                                                ranges={rangeDate}
                                                alwaysShowCalendars={true}
                                                onEvent={this.handleEvent}
                                            >
                                                <input type="text" className="form-control" name="date_product" value={`${this.state.startDate} to ${this.state.endDate}`}/>
                                                {/*<input type="text" className="form-control" name="date_product" value={`${this.state.startDate} to ${this.state.endDate}`}/>*/}
                                            </DateRangePicker>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
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
                                    <div className="col-md-2">
                                        <div className="form-group">
                                            <label htmlFor=""></label>
                                            <button style={{marginTop:"28px"}} className="btn btn-primary" onClick={this.handleAll}>Posting All</button>
                                        </div>
                                    </div>
                                </div>
                                <div style={{overflowX:'auto',zoom:'85%'}}>
                                    <table className="table table-hover table-bordered">
                                        <thead className="bg-light">
                                        <tr>
                                            <th className="text-black"  style={columnStyle}>Kode trx</th>
                                            <th className="text-black"  style={columnStyle}>Kode brg</th>
                                            <th className="text-black"  style={columnStyle}>Barcode</th>
                                            <th className="text-black"  style={columnStyle}>Tgl</th>
                                            <th className="text-black"  style={columnStyle}>Kode kasir</th>
                                            <th className="text-black"  style={columnStyle}>Lokasi</th>
                                            <th className="text-black"  style={columnStyle}>Nama</th>
                                            <th className="text-black"  style={columnStyle}>Stock akhir</th>
                                            <th className="text-black"  style={columnStyle}>Stock fisik</th>
                                            <th className="text-black"  style={columnStyle}>Selisih Stock</th>
                                            <th className="text-black"  style={columnStyle}>HPP</th>
                                            <th className="text-black"  style={columnStyle}>Selisih HPP</th>
                                            <th className="text-black"  style={columnStyle}>status</th>
                                            <th className="text-black"  style={columnStyle}>#</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            (
                                                typeof data === 'object' ? data.length>0?
                                                    data.map((v,i)=>{
                                                        total_fisik_per +=parseFloat(v.qty_fisik);
                                                        total_akhir_per +=parseFloat(v.stock_terakhir);
                                                        total_hpp_per +=(Math.abs(parseFloat(v.qty_fisik)-parseFloat(v.stock_terakhir))) * parseInt(v.hrg_beli,10);
                                                        return(
                                                            <tr key={i}>
                                                                <td style={columnStyle}>{v.kd_trx}</td>
                                                                <td style={columnStyle}>{v.kd_brg}</td>
                                                                <td style={columnStyle}>{v.barcode}</td>
                                                                <td style={columnStyle}>{moment(v.tgl).format("yyyy-MM-DD")}</td>
                                                                <td style={columnStyle}>{v.kd_kasir}</td>
                                                                <td style={columnStyle}>{v.lokasi}</td>
                                                                <td style={columnStyle}>{v.nm_brg}</td>
                                                                <td style={{textAlign:"right"}}>{v.stock_terakhir}</td>
                                                                <td style={{textAlign:"right"}}>{v.qty_fisik}</td>
                                                                <td style={{textAlign:"right"}}>{(parseFloat(v.qty_fisik)-parseFloat(v.stock_terakhir))}</td>
                                                                <td style={{textAlign:"right"}}>{toRp(v.hrg_beli,10)}</td>
                                                                <td style={{textAlign:"right"}}>{toRp((Math.abs(parseFloat(v.qty_fisik)-parseFloat(v.stock_terakhir))) * v.hrg_beli)}</td>
                                                                <td style={{textAlign:"right"}}>{statusQ("danger","POSTING")}</td>
                                                                <td style={columnStyle}>
                                                                    <button className="btn btn-primary btn-sm" onClick={(e)=>this.handleOne(e,v.kd_trx)} style={{fontSize:'8px'}}>
                                                                        <i className="fa fa-send"></i>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                    : "No data." : "No data."
                                            )
                                        }
                                        </tbody>
                                        <tfoot>
                                        <tr>
                                            <td colSpan="7">TOTAL PERPAGE</td>
                                            <td style={{textAlign:"right"}}>{total_akhir_per}</td>
                                            <td style={{textAlign:"right"}}>{total_fisik_per}</td>
                                            <td></td>
                                            <td></td>
                                            <td style={{textAlign:"right"}}>{toRp(total_hpp_per)}</td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td colSpan="7">TOTAL</td>
                                            <td style={{textAlign:"right"}}>{total_akhir!==undefined?total_akhir:0}</td>
                                            <td style={{textAlign:"right"}}>{total_fisik!==undefined?total_fisik:0}</td>
                                            <td></td>
                                            <td></td>
                                            <td style={{textAlign:"right"}}>{toRp(total_hpp!==undefined&&total_hpp!==null?total_hpp:0)}</td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        </tfoot>
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
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

}


const mapStateToPropsCreateItem = (state) => ({
    auth:state.auth,
    data: state.opnameReducer.data,
    total:state.opnameReducer.total_opname,
    isLoading: state.opnameReducer.isLoading,
});

export default connect(mapStateToPropsCreateItem)(ListPosting);