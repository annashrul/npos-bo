import React,{Component} from 'react'
import Layout from "../../Layout";
import connect from "react-redux/es/connect/connect";
import {FetchPostingOpname} from "redux/actions/inventory/opname.action";
import moment from "moment";
import {statusQ, toRp} from "../../../../helper";
import Paginationq from "helper";
import {storeOpnamePosting} from "../../../../redux/actions/inventory/opname.action";
import Swal from "sweetalert2";

class ListPosting extends Component{
    constructor(props) {
        super(props);
        this.handleOne=this.handleOne.bind(this);
    }
    componentWillMount(){
        this.props.dispatch(FetchPostingOpname(1));
    }
    handlePageChange(pageNumber){
        this.setState({activePage: pageNumber});
        localStorage.setItem("page_list_posting",pageNumber);
        this.props.dispatch(FetchPostingOpname(pageNumber));
    }
    handleOne(e,kd_trx){
        e.preventDefault();
        console.log(kd_trx);
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
    render(){
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        const {per_page,current_page,from,to,data,total} = this.props.data;
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
                                <div className="table-responsive">
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
                                                typeof data === 'object' ?
                                                    data.map((v,i)=>{
                                                        total_fisik_per = total_fisik_per+parseInt(v.qty_fisik);
                                                        total_akhir_per = total_akhir_per+parseInt(v.stock_terakhir);
                                                        total_hpp_per = total_hpp_per+(Math.abs(parseInt(v.qty_fisik)-parseInt(v.stock_terakhir))) * v.hrg_beli;
                                                        return(
                                                            <tr key={i}>
                                                                <td style={columnStyle}>{v.kd_trx}</td>
                                                                <td style={columnStyle}>{v.kd_brg}</td>
                                                                <td style={{textAlign:"right"}}>{v.barcode}</td>
                                                                <td style={columnStyle}>{moment(v.tgl).format("yyyy-MM-DD")}</td>
                                                                <td style={columnStyle}>{v.kd_kasir}</td>
                                                                <td style={columnStyle}>{v.lokasi}</td>
                                                                <td style={{textAlign:"right"}}>{v.nm_brg}</td>
                                                                <td style={{textAlign:"right"}}>{v.stock_terakhir}</td>
                                                                <td style={{textAlign:"right"}}>{v.qty_fisik}</td>
                                                                <td style={{textAlign:"right"}}>{Math.abs(parseInt(v.qty_fisik)-parseInt(v.stock_terakhir))}</td>
                                                                <td style={{textAlign:"right"}}>{toRp(v.hrg_beli)}</td>
                                                                <td style={{textAlign:"right"}}>{toRp((Math.abs(parseInt(v.qty_fisik)-parseInt(v.stock_terakhir))) * v.hrg_beli)}</td>
                                                                <td style={{textAlign:"right"}}>{statusQ("danger","POSTING")}</td>
                                                                <td>
                                                                    <button className="btn btn-primary btn-sm" onClick={(e)=>this.handleOne(e,v.kd_trx)}>POSTING</button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                    : "No data."
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
                                            <td style={{textAlign:"right"}}>{toRp(total_hpp!==undefined?total_hpp:0)}</td>
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