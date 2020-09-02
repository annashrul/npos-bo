import React,{Component} from 'react'
import Layout from "components/App/Layout"
import connect from "react-redux/es/connect/connect";
import Select from "react-select";
import {FetchApprovalMutation,FetchApprovalMutationDetail} from "redux/actions/inventory/mutation.action";
import moment from "moment";
import Preloader from "Preloader";
import Paginationq from "helper";
import {ModalToggle, ModalType} from "redux/actions/modal.action";
import FormApprovalMutation from "../../modals/inventory/mutation/form_approval_mutation";

class ApprovalMutasiJualBeli extends Component{
    constructor(props){
        super(props);
        this.state={
            location_data:[],
            location:"",
            kd_trx:'',
            status:"TR"
        }
        this.handleChange = this.handleChange.bind(this)
        this.HandleChangeLokasi = this.HandleChangeLokasi.bind(this)
        this.HandleSearch = this.HandleSearch.bind(this)
        this.handlePageChange = this.handlePageChange.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
    }
    getProps(param){
        if (param.auth.user) {
            let lk = [];
            let loc = param.auth.user.lokasi;
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
    componentWillMount(){
        this.getProps(this.props);
        this.props.dispatch(FetchApprovalMutation(1,'','','TR'));
    }
    componentWillReceiveProps = (nextProps) => {
        this.getProps(nextProps);
    }
    HandleChangeLokasi(lk){
        this.setState({
            location:lk.value,
        })
        this.props.dispatch(FetchApprovalMutation(1,this.state.kd_trx!==''?this.state.kd_trx:'',lk.value,'TR'));
    }
    handlePageChange(pageNumber){
        this.props.dispatch(FetchApprovalMutation(pageNumber,''))
    }
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }
    HandleSearch(event){
        this.props.dispatch(FetchApprovalMutation(1,this.state.kd_trx,this.state.location!==''?this.state.location:''));
    }
    toggleModal(e,kd_trx) {
        e.preventDefault();
        const bool = !this.props.isOpen;
        this.props.dispatch(ModalToggle(bool));
        this.props.dispatch(ModalType("formApprovalMutation"));
        localStorage.setItem("kd_trx_mutasi",kd_trx);
        this.props.dispatch(FetchApprovalMutationDetail(1,kd_trx))
    }
    render(){
        const {
            total,
            // last_page,
            per_page,
            current_page,
            // from,
            // to,
            data
        } = this.props.mutation;
        const columnStyle = {verticalAlign: "middle", textAlign: "center",};
        return (
            <Layout page="Approval Mutasi">
                <div className="card">
                    <div className="card-header">
                        <h5>Approval Mutasi</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="control-label font-12">
                                        Lokasi
                                    </label>
                                    <Select
                                        options={this.state.location_data}
                                        placeholder="Pilih Lokasi Asal"
                                        onChange={this.HandleChangeLokasi}
                                        value={
                                            this.state.location_data.find(op => {
                                                return op.value === this.state.location
                                            })
                                        }

                                    />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="control-label font-12">
                                        Kode Transaksi
                                    </label>
                                    <input type="text" name="kd_trx" value={this.state.kd_trx} className="form-control" style={{height:"38px"}}
                                           onChange={this.handleChange}
                                           onKeyPress = {
                                               event => {
                                                   if (event.key === 'Enter') {
                                                       this.HandleSearch();
                                                   }
                                               }
                                           }
                                    />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="table-responsive" style={{overflowX: "auto"}}>
                                    <table className="table table-hover table-bordered">
                                        <thead className="bg-light">
                                        <tr>
                                            <th className="text-black" style={columnStyle}>No Faktur Mutasi</th>
                                            <th className="text-black" style={columnStyle}>Tanggal</th>
                                            <th className="text-black" style={columnStyle}>Lokasi</th>
                                            <th className="text-black" style={columnStyle}>Total Item</th>
                                            <th className="text-black" style={columnStyle}>Total Approval</th>
                                            <th className="text-black" style={columnStyle}>#</th>
                                        </tr>
                                        </thead>
                                        {
                                            !this.props.isLoading?(<tbody>
                                            {
                                                (
                                                    typeof data === 'object' ? data.length > 0 ?
                                                        data.map((v,i)=>{
                                                            return(
                                                                <tr key={i}>
                                                                    <td style={columnStyle}>{v.no_faktur_mutasi}</td>
                                                                    <td style={columnStyle}>{moment(v.tgl_mutasi).format("yyyy-MM-DD")}</td>
                                                                    <td style={columnStyle}>{v.nama}</td>
                                                                    <td style={columnStyle}>{v.total_qty}</td>
                                                                    <td style={columnStyle}>{v.total_approval}</td>
                                                                    <td style={columnStyle}>
                                                                        <button className="btn btn-primary" onClick={(e)=>this.toggleModal(e,v.no_faktur_mutasi)}>
                                                                            Approval
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                        : "No data." : "No data."
                                                )
                                            }
                                            </tbody>):<Preloader/>
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
                            </div>
                        </div>
                    </div>
                </div>
                <FormApprovalMutation parameterMutasi={this.state.status} dataApproval={this.props.detailApproval}/>
            </Layout>
        );
    }
}

const mapStateToPropsCreateItem = (state) => ({
    auth:state.auth,
    isOpen:state.modalReducer,
    mutation:state.mutationReducer.dataApproval,
    isLoading:state.mutationReducer.isLoadingApproval,
    detailApproval:state.mutationReducer.dataApprovalDetail
});

export default connect(mapStateToPropsCreateItem)(ApprovalMutasiJualBeli);